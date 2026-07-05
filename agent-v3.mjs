// agent-v3.mjs — CitePay Agent V3
// Change from V2: relevanceScore is COMPUTED from query/source term overlap
// instead of hardcoded. Payment path is copied unchanged from agent-v2.mjs
// (same GatewayClient, same seller on :4021, same Arc Testnet chain).
// Does NOT modify agent-v2.mjs / seller-v2.mjs / harness-v2.mjs.

import { GatewayClient } from '@circle-fin/x402-batching/client';
import fs from 'fs';

function safeJson(obj) {
  return JSON.stringify(obj, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2);
}

const BASE = 'http://localhost:4021';
const BUDGET = 0.005;
const QUERY = 'How can AI agents compensate creators for cited evidence?';

// Metadata mirrors seller-v2.mjs SOURCES title/content exactly (same seller, unmodified).
// If seller-v2.mjs content ever changes, update this to match — scoring must reflect
// what the seller actually serves, not an idealized description.
const CANDIDATE_METADATA = {
  S1: { title: 'Creator Citation Nanopayments', content: 'AI agents can use nanopayments to pay creators when their work is selected and cited as evidence.' },
  S2: { title: 'Expensive General Payments Overview', content: 'A broad overview of payments, less specific to creator citation use cases.' },
  S3: { title: 'Secondary Creator Monetization Note', content: 'A secondary note about creator monetization, useful but less directly relevant.' },
};

const candidates = [
  { id: 'S1', url: `${BASE}/source/S1`, price: 0.001 },
  { id: 'S2', url: `${BASE}/source/S2`, price: 0.02 },
  { id: 'S3', url: `${BASE}/source/S3`, price: 0.001 },
].map(c => ({ ...c, ...CANDIDATE_METADATA[c.id] }));

const STOPWORDS = new Set(['how','can','for','the','a','an','to','of','and','in','on','is','are','be','with','when','their']);

function tokenize(text) {
  return [...new Set(
    text.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 1 && !STOPWORDS.has(t))
  )];
}

function jaccard(aTokens, bTokens) {
  const a = new Set(aTokens), b = new Set(bTokens);
  const intersection = [...a].filter(t => b.has(t));
  const union = new Set([...a, ...b]);
  return { score: union.size === 0 ? 0 : intersection.length / union.size, matched: intersection };
}

function selectSource(query, candidates, budget) {
  const queryTokens = tokenize(query);

  const scored = candidates.map(c => {
    const sourceTokens = tokenize(`${c.title} ${c.content}`);
    const { score: relevanceScore, matched } = jaccard(queryTokens, sourceTokens);
    const overBudget = c.price > budget;
    const ratio = c.price > 0 ? Number((relevanceScore / c.price).toFixed(3)) : 0;
    return { ...c, sourceTokens, relevanceScore: Number(relevanceScore.toFixed(3)), matchedTerms: matched, ratio, overBudget };
  });

  const eligible = scored.filter(c => !c.overBudget);
  const selected = eligible.sort((a, b) => b.ratio - a.ratio)[0];

  const rejected = scored
    .filter(c => c.id !== selected.id)
    .map(c => ({
      id: c.id,
      price: c.price,
      relevanceScore: c.relevanceScore,
      ratio: c.ratio,
      matchedTerms: c.matchedTerms,
      reason: c.overBudget ? 'over_budget' : 'lower_relevance_price_ratio',
    }));

  return { queryTokens, scored, selected, rejected };
}

const gateway = new GatewayClient({
  chain: 'arcTestnet',
  privateKey: process.env.BUYER_PRIVATE_KEY,
});

const events = [];
const { queryTokens, scored, selected, rejected } = selectSource(QUERY, candidates, BUDGET);

events.push({ event: 'v3_scoring', query: QUERY, queryTokens });
events.push({ event: 'candidate_sources_considered', candidates: scored });
events.push({ event: 'source_selected', selected: {
  id: selected.id, url: selected.url, price: selected.price,
  relevanceScore: selected.relevanceScore, ratio: selected.ratio,
  matchedTerms: selected.matchedTerms,
}});
events.push({ event: 'source_rejected', rejected });
events.push({ event: 'budget_before_after', before: BUDGET, after: Number((BUDGET - selected.price).toFixed(6)) });

console.log(events.map(e => safeJson(e)).join('\n'));

// --- live payment path: identical call pattern to agent-v2.mjs ---
const payResult = await gateway.pay(selected.url, { method: 'GET' });

const finalAnswer = {
  text: `CitePay selected ${selected.id} because it had the strongest computed relevance/price ratio (${selected.ratio}) for the query "${QUERY}". Citation: [${selected.id}]. Receipt: ${payResult.transaction}.`,
  citations: [selected.id],
};

const evidence = {
  timestamp: new Date().toISOString(),
  payment_mode: 'LIVE_GATEWAY',
  network: 'eip155:5042002',
  budget_usdc: BUDGET,
  query: QUERY,
  relevance_method: 'jaccard_term_overlap_no_llm',
  selected_source_id: selected.id,
  rejected_source_ids: rejected.map(r => r.id),
  events,
  payment_evidence: {
    amount: payResult.formattedAmount,
    transaction: payResult.transaction,
    status: payResult.status,
    source_id: selected.id,
  },
  final_answer: finalAnswer,
};

fs.writeFileSync('evidence-log-v3.json', safeJson(evidence));
console.log('PAY_RESULT', safeJson(payResult));
console.log('FINAL_ANSWER', safeJson(finalAnswer));
console.log('wrote evidence-log-v3.json');
