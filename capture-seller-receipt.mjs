// capture-seller-receipt.mjs
// Reads seller-v2.mjs's own unmodified stdout (piped to a log file) plus the
// existing agent-v3 evidence file, and produces a sanitized seller-side
// settlement receipt. Does NOT modify seller-v2.mjs, agent-v3.mjs, or any
// payment logic. No balance-query API exists on BatchFacilitatorClient per
// the current seller-v2.mjs source, so this does NOT claim a balance delta —
// only what settleResult/requirements actually logged.

import fs from 'fs';

const SELLER_LOG_PATH = process.argv[2] || 'evidence/seller-v3-run.log';
const AGENT_EVIDENCE_PATH = process.argv[3] || 'evidence-log-v3.json';
const OUT_PATH = 'evidence/settlement-receiving-proof.json';

function extractJsonAfter(text, label) {
  const idx = text.lastIndexOf(label);
  if (idx === -1) return null;
  const start = text.indexOf('{', idx);
  if (start === -1) return null;
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === '{') depth++;
    if (text[i] === '}') depth--;
    if (depth === 0) {
      try { return JSON.parse(text.slice(start, i + 1)); } catch { return null; }
    }
  }
  return null;
}

if (!fs.existsSync(SELLER_LOG_PATH)) {
  console.error(`Missing seller log at ${SELLER_LOG_PATH}. Run seller-v2.mjs piped to this file during a live harness-v3 run first.`);
  process.exit(1);
}
if (!fs.existsSync(AGENT_EVIDENCE_PATH)) {
  console.error(`Missing agent evidence at ${AGENT_EVIDENCE_PATH}. Run harness-v3.mjs first.`);
  process.exit(1);
}

const sellerLog = fs.readFileSync(SELLER_LOG_PATH, 'utf-8');
const agentEvidence = JSON.parse(fs.readFileSync(AGENT_EVIDENCE_PATH, 'utf-8'));

const requirements = extractJsonAfter(sellerLog, 'requirements');
const verifyResult = extractJsonAfter(sellerLog, 'verifyResult');
const settleResult = extractJsonAfter(sellerLog, 'settleResult');

const limitations = [];
if (!settleResult) limitations.push('settleResult not found in seller log — receipt is incomplete.');
if (!requirements?.payTo) limitations.push('seller payTo address not found in logged requirements.');
limitations.push('No balance-query method is exposed by BatchFacilitatorClient in the current seller-v2.mjs — this receipt does NOT claim a measured before/after balance delta, only the logged settlement result.');

const receipt = {
  payment_mode: 'LIVE_GATEWAY',
  network: requirements?.network || agentEvidence.network || 'eip155:5042002',
  seller_address: requirements?.payTo || null,
  selected_source_id: agentEvidence.selected_source_id,
  tx_ref: settleResult?.transaction || agentEvidence.payment_evidence?.transaction || null,
  amount_paid_usdc: agentEvidence.payment_evidence?.amount ?? null,
  verify_is_valid: verifyResult?.isValid ?? null,
  settle_success: settleResult?.success ?? null,
  payer: settleResult?.payer ?? null,
  seller_balance_before: null,
  seller_balance_after: null,
  delta: null,
  limitations,
};

fs.mkdirSync('evidence', { recursive: true });
fs.writeFileSync(OUT_PATH, JSON.stringify(receipt, null, 2));
console.log(`Wrote ${OUT_PATH}`);
console.log(JSON.stringify(receipt, null, 2));
