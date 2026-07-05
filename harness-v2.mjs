import fs from 'fs';
import assert from 'assert';

const evidence = JSON.parse(fs.readFileSync('evidence-log-v2.json', 'utf-8'));

const events = evidence.events ?? [];
const selected = events.find(e => e.event === 'source_selected')?.selected;
const rejected = events.find(e => e.event === 'source_rejected')?.rejected ?? [];
const budget = events.find(e => e.event === 'budget_before_after');

assert.equal(evidence.payment_mode, 'LIVE_GATEWAY', 'payment_mode must be LIVE_GATEWAY');
assert.ok(evidence.payment_evidence?.transaction, 'tx/ref must exist');
assert.equal(evidence.payment_evidence?.status, 200, 'paid request must return HTTP 200');
assert.ok(events.find(e => e.event === 'candidate_sources_considered'), 'candidate_sources_considered exists');
assert.ok(selected?.id, 'one source selected');
assert.ok(rejected.length >= 1, 'at least one source rejected');
assert.ok(budget.after < budget.before, 'budget decreases after payment');
assert.deepEqual(evidence.final_answer.citations, [selected.id], 'final answer cites only selected source');
assert.ok(!evidence.final_answer.citations.some(c => rejected.map(r => r.id).includes(c)), 'no rejected source cited');

console.log('PASS 1 payment_mode LIVE_GATEWAY');
console.log('PASS 2 tx/ref exists');
console.log('PASS 3 paid request HTTP 200');
console.log('PASS 4 candidate sources considered');
console.log('PASS 5 selected source exists');
console.log('PASS 6 rejected sources exist');
console.log('PASS 7 budget decreases');
console.log('PASS 8 final answer cites only selected source');
console.log('PASS 9 no rejected source cited');
console.log('ALL V2 CHECKS PASSED');
