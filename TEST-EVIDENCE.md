# TEST-EVIDENCE.md — CitePay Agent

Evidence classification: LIVE, not LOCAL_STUB, not SIMULATED.

## V1 — Core rail proof
- environment: Google Cloud Shell
- network: Arc Testnet
- payment_mode: LIVE_GATEWAY
- amount: 0.001 USDC
- Gateway tx/ref: 41ff2be2-66c4-4b55-acec-88069d1a1992
- verifyResult.isValid: true
- settleResult.success: true
- final paid request: HTTP 200, article content unlocked
- root cause fixed: BatchFacilitatorClient must target https://gateway-api-testnet.circle.com

## V2 — Agentic differentiation proof
- payment_mode: LIVE_GATEWAY
- network: eip155:5042002
- candidate sources considered: S1, S2, S3
- selected source: S1
- rejected source: S2 — over_budget
- rejected source: S3 — lower_relevance_price_ratio
- fixed budget: 0.005 USDC
- amount paid: 0.001 USDC
- Gateway tx/ref: 80cefd79-94a6-401d-b469-b6905d888bde
- HTTP status: 200
- harness: ALL V2 CHECKS PASSED

## Not claimed
- No mainnet settlement
- No production reliability claim
- No dashboard or UI claim

## Seller-side settlement receipt

A final repeat V3 run captured a sanitized seller-side receipt from the unmodified seller logs.

- payment_mode: LIVE_GATEWAY
- network: eip155:5042002
- selected source: S1
- seller/payTo: 0x9252470F6237E16d087E0e39B121B3e770Ea1972
- amount paid: 0.001 USDC
- tx/ref: f1983b38-e27e-4126-8ed1-69e76927d25d
- verify_is_valid: true
- settle_success: true

Limitation: this receipt does not claim a measured before/after seller balance delta. It proves seller-side payTo, verification, settlement success, payer, amount, and tx/ref from the real seller log.

<!-- PLAN-C-EVIDENCE:START -->
## Verified LIVE_GATEWAY run table

| Run | Network | Amount | tx/ref | verify | settle | HTTP | Label |
|---|---|---:|---|---|---|---:|---|
| V1 core rail proof | Arc Testnet | 0.001 USDC | 41ff2be2-66c4-4b55-acec-88069d1a1992 | true | true | 200 | LIVE_GATEWAY |
| V2 agentic decision proof | eip155:5042002 | 0.001 USDC | 80cefd79-94a6-401d-b469-b6905d888bde | true | true | 200 | LIVE_GATEWAY |
| V3 settlement trace | eip155:5042002 | 0.001 USDC | 1310f944-6996-4c6a-a32f-c7c27efc4966 | true | true | 200 | LIVE_GATEWAY |
| V3 seller receipt | eip155:5042002 | 0.001 USDC | f1983b38-e27e-4126-8ed1-69e76927d25d | true | true | — | LOCAL_VERIFIED seller-side receipt |

## V3 decision trace

- query: "How can AI agents compensate creators for cited evidence?"
- relevance method: `jaccard_term_overlap_no_llm`
- budget: 0.005 USDC
- selected source: S1
- rejected sources: S2, S3
- label: LIVE_GATEWAY

No q2 / second-query evidence is claimed in this submission. The second-query run was not executed because the original private keys were not recoverable in the restarted Cloud Shell environment.
<!-- PLAN-C-EVIDENCE:END -->
