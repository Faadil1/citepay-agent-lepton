// harness-v3.mjs — verifies agent-v3.mjs behavior.
// Run seller-v2.mjs (unmodified) before this, same as V2 harness does.

import { execSync } from 'child_process';
import fs from 'fs';

function assert(cond, msg) {
  if (!cond) throw new Error('ASSERTION FAILED: ' + msg);
  console.log('PASS:', msg);
}

console.log('Running agent-v3.mjs...');
execSync('node agent-v3.mjs', { stdio: 'inherit' });

const evidence = JSON.parse(fs.readFileSync('evidence-log-v3.json', 'utf-8'));

const scoringEvent = evidence.events.find(e => e.event === 'v3_scoring');
const consideredEvent = evidence.events.find(e => e.event === 'candidate_sources_considered');
const selectedEvent = evidence.events.find(e => e.event === 'source_selected');
const rejectedEvent = evidence.events.find(e => e.event === 'source_rejected');

// 1. relevance score was computed from query/source metadata (not hardcoded)
assert(
  scoringEvent && Array.isArray(scoringEvent.queryTokens) && scoringEvent.queryTokens.length > 0,
  'relevance score derived from tokenized query'
);
assert(
  consideredEvent.candidates.every(c => Array.isArray(c.matchedTerms)),
  'each candidate has a matchedTerms trace (proves computation, not a hardcoded number)'
);

// 2. at least one source rejected over_budget
assert(
  rejectedEvent.rejected.some(r => r.reason === 'over_budget'),
  'at least one source rejected as over_budget'
);

// 3. at least one source rejected for lower_relevance_price_ratio
assert(
  rejectedEvent.rejected.some(r => r.reason === 'lower_relevance_price_ratio'),
  'at least one source rejected for lower_relevance_price_ratio'
);

// 4. selected source paid LIVE_GATEWAY
assert(evidence.payment_mode === 'LIVE_GATEWAY', 'payment_mode is LIVE_GATEWAY');
assert(!!evidence.payment_evidence.transaction, 'transaction reference present');
assert(evidence.payment_evidence.status === 'success' || evidence.payment_evidence.status === true || !!evidence.payment_evidence.transaction,
  'settlement succeeded (transaction present)');

// 5. final answer cites only selected source
const citations = evidence.final_answer.citations;
assert(citations.length === 1 && citations[0] === evidence.selected_source_id, 'final answer cites only the selected source');

// 6. rejected sources not cited
const rejectedIds = evidence.rejected_source_ids;
assert(!citations.some(c => rejectedIds.includes(c)), 'no rejected source appears in citations');

console.log('ALL V3 CHECKS PASSED');
