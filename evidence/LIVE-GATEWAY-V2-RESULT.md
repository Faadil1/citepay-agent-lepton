# LIVE_GATEWAY V2 Result — CitePay Agent

Status: PASS

Environment: Google Cloud Shell  
Network: Arc Testnet  
Payment mode: LIVE_GATEWAY  
Amount: 0.001 USDC  
Gateway transaction/reference: 80cefd79-94a6-401d-b469-b6905d888bde

## What was proven

The agent considered three candidate sources:

- S1: price 0.001 USDC, relevance 0.9
- S2: price 0.02 USDC, relevance 0.5, rejected as over budget
- S3: price 0.001 USDC, relevance 0.55, rejected for lower relevance/price ratio

The agent selected S1 because it had the strongest relevance/price ratio within the 0.005 USDC budget.

## Live payment proof

- `payment_mode`: LIVE_GATEWAY
- `network`: eip155:5042002
- `BatchFacilitatorClient.verify()`: valid
- `BatchFacilitatorClient.settle()`: success
- HTTP status after payment: 200
- Paid source unlocked: S1

## Harness result

All v2 checks passed:

1. payment_mode LIVE_GATEWAY
2. tx/ref exists
3. paid request HTTP 200
4. candidate sources considered
5. selected source exists
6. rejected sources exist
7. budget decreases
8. final answer cites only selected source
9. no rejected source cited

## Judge memory sentence

It picked which source to pay for, proved the payment on Arc/Gateway, then cited only that one.
