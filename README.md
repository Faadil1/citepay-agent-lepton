# CitePay Agent — No pay, no cite.

Most agents automate payments. CitePay decides if payment is deserved — and cannot cite without paying.

**The sophistication is knowing when not to pay.**

CitePay Agent is an AI research/payment agent that evaluates candidate sources, rejects weak or over-budget options, pays the selected source through Circle Gateway x402 on Arc Testnet, unlocks the content, and cites only the paid source.

`Circle Gateway x402 · Gateway testnet API · Arc Testnet eip155:5042002 · USDC · verify=true · settle=true · HTTP 200 unlock`

---

## Judge memory sentence

It picked which source to pay for, proved the payment on Arc/Gateway, then cited only that one.

---

## Judge quick links

- **Live proof viewer:** https://faadil1.github.io/citepay-agent-lepton/
- **Full proof page:** https://faadil1.github.io/citepay-agent-lepton/proof.html
- **V3 evidence:** [evidence/live-gateway-evidence-v3.json](evidence/live-gateway-evidence-v3.json)
- **Seller-side receipt:** [evidence/settlement-receiving-proof.json](evidence/settlement-receiving-proof.json)
- **Evidence boundary check:** [evidence/EVIDENCE-BOUNDARY-CHECK.md](evidence/EVIDENCE-BOUNDARY-CHECK.md)
- **V3 harness:** [harness-v3.mjs](harness-v3.mjs)
- **Demo script:** [DEMO-SCRIPT.md](DEMO-SCRIPT.md)
- **Submission framing:** [SUBMISSION.md](SUBMISSION.md)
- **Test evidence:** [TEST-EVIDENCE.md](TEST-EVIDENCE.md)

---

## What it does

CitePay Agent turns citation into a paid, verifiable economic action.

1. The agent receives a research query.
2. It evaluates candidate sources using relevance, price, and a fixed budget.
3. It rejects sources that are over budget or have a weaker relevance-to-price ratio.
4. It pays only the selected source through Circle Gateway x402 on Arc Testnet.
5. It unlocks the selected content after successful payment verification and settlement.
6. It cites only the paid source.

In the final V3 run:

- `S1` is selected and paid.
- `S2` is rejected because it is over budget.
- `S3` is rejected because its relevance-to-price ratio is lower.
- Only `S1` appears in the final citation.

---

## Why this matters

AI agents increasingly use creator and publisher content as evidence, but sources are usually cited without any payment event.

CitePay closes that gap with one rule:

**No pay, no cite.**

If an agent wants to use a source as evidence, it must pay the selected source first. The citation is not just attribution; it becomes a settlement-backed action.

---

## Rejection rubric

A candidate source is rejected when any of the following holds:

- **over_budget** — price exceeds the fixed research budget of `0.005 USDC`.
- **lower_relevance_price_ratio** — another eligible source offers more relevance per USDC.
- **insufficient match** — too little term overlap with the query to justify payment.
- **no citation without successful payment** — even a selected source is never cited unless `verify=true`, `settle=true`, and `HTTP 200` unlock all succeed.

The agentic layer is not only the payment. It is also the decision to reject sources that should not be paid.

---

## Final proof

Current final proof is V3 with computed relevance scoring and live Circle Gateway settlement on Arc Testnet.

- payment_mode: `LIVE_GATEWAY`
- network: `eip155:5042002`
- selected source: `S1`
- rejected sources:
  - `S2` — `over_budget`
  - `S3` — `lower_relevance_price_ratio`
- amount paid: `0.001 USDC`
- V3 tx/ref: `1310f944-6996-4c6a-a32f-c7c27efc4966`
- seller-side receipt tx/ref: `f1983b38-e27e-4126-8ed1-69e76927d25d`
- verify: `true`
- settle: `true`
- unlock: `HTTP 200`
- harness: `ALL V3 CHECKS PASSED`
- evidence boundary check: `PASS`

The seller-side receipt is sanitized. It proves seller-side `payTo`, payer, amount, verify result, settlement result, and tx/ref from logs. It does **not** claim a measured seller balance delta.

---

## V3 — computed relevance scoring

V3 improves the agentic layer by computing relevance from token overlap between the user query and each source’s title/content metadata.

The agent logs:

- query tokens
- source tokens
- matched terms
- computed relevance score
- relevance/price ratio
- rejection reasons
- selected paid source

Example final decision:

```text
Query:
How can AI agents compensate creators for cited evidence?

Selected:
S1 — Creator Citation Nanopayments

Rejected:
S2 — over_budget
S3 — lower_relevance_price_ratio
