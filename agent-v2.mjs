import { GatewayClient } from '@circle-fin/x402-batching/client';
import fs from 'fs';

function safeJson(obj) {
  return JSON.stringify(obj, (_, v) =>
    typeof v === 'bigint' ? v.toString() : v,
    2
  );
}

const BASE = 'http://localhost:4021';
const BUDGET = 0.005;

const candidates = [
  { id: 'S1', url: `${BASE}/source/S1`, price: 0.001, relevanceScore: 0.9, rationale: 'direct match for creator citation nanopayments' },
  { id: 'S2', url: `${BASE}/source/S2`, price: 0.02, relevanceScore: 0.5, rationale: 'too expensive for current budget and less specific' },
  { id: 'S3', url: `${BASE}/source/S3`, price: 0.001, relevanceScore: 0.55, rationale: 'relevant but less specific than S1' },
];

function selectSource(candidates, budget) {
  const scored = candidates.map(c => ({
    ...c,
    ratio: Number((c.relevanceScore / c.price).toFixed(3)),
    overBudget: c.price > budget,
  }));

  const eligible = scored.filter(c => !c.overBudget);
  const selected = eligible.sort((a, b) => b.ratio - a.ratio)[0];

  const rejected = scored
    .filter(c => c.id !== selected.id)
    .map(c => ({
      id: c.id,
      price: c.price,
      relevanceScore: c.relevanceScore,
      ratio: c.ratio,
      reason: c.overBudget ? 'over_budget' : 'lower_relevance_price_ratio',
      rationale: c.rationale
    }));

  return { scored, selected, rejected };
}

const gateway = new GatewayClient({
  chain: 'arcTestnet',
  privateKey: process.env.BUYER_PRIVATE_KEY,
});

const events = [];
const { scored, selected, rejected } = selectSource(candidates, BUDGET);

events.push({ event: 'candidate_sources_considered', candidates: scored });
events.push({ event: 'source_selected', selected: {
  id: selected.id,
  url: selected.url,
  price: selected.price,
  relevanceScore: selected.relevanceScore,
  ratio: selected.ratio,
  rationale: selected.rationale
}});
events.push({ event: 'source_rejected', rejected });
events.push({ event: 'budget_before_after', before: BUDGET, after: Number((BUDGET - selected.price).toFixed(6)) });

console.log(events.map(e => safeJson(e)).join('\n'));

const payResult = await gateway.pay(selected.url, { method: 'GET' });

const finalAnswer = {
  text: `CitePay selected ${selected.id} because it had the strongest relevance/price ratio. The paid source says AI agents can pay creators when their work is selected and cited as evidence. Citation: [${selected.id}]. Receipt: ${payResult.transaction}.`,
  citations: [selected.id]
};

const evidence = {
  timestamp: new Date().toISOString(),
  payment_mode: 'LIVE_GATEWAY',
  network: 'eip155:5042002',
  budget_usdc: BUDGET,
  selected_source_id: selected.id,
  rejected_source_ids: rejected.map(r => r.id),
  events,
  payment_evidence: {
    amount: payResult.formattedAmount,
    transaction: payResult.transaction,
    status: payResult.status,
    source_id: selected.id
  },
  final_answer: finalAnswer
};

fs.writeFileSync('evidence-log-v2.json', safeJson(evidence));
console.log('PAY_RESULT', safeJson(payResult));
console.log('FINAL_ANSWER', safeJson(finalAnswer));
console.log('wrote evidence-log-v2.json');
