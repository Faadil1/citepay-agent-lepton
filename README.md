# CitePay Agent

AI research agent that decides which sources are worth paying for, unlocks x402-protected content via Circle Gateway on Arc Testnet, and pays creators in test USDC only when their work is cited.

Judge Memory Sentence: It picked which source to pay for, proved the payment on Arc/Gateway, then cited only that one.

## What it does
1. Evaluates candidate sources on relevance, price, and a fixed budget of 0.005 USDC.
2. Rejects sources that are over budget or have a lower relevance/price ratio.
3. Pays only the selected source via x402 on Circle Gateway / Arc Testnet.
4. Unlocks content, then cites only the paid source.

## Live proof
- payment_mode: LIVE_GATEWAY
- network: eip155:5042002
- selected source: S1
- rejected sources: S2 over_budget, S3 lower_relevance_price_ratio
- amount paid: 0.001 USDC
- Gateway tx/ref: 80cefd79-94a6-401d-b469-b6905d888bde
- HTTP status after payment: 200
- harness: ALL V2 CHECKS PASSED

## Why Circle/Arc matter
No Gateway settlement means no unlock. No unlock means no citation.

## Key files
- seller-v2.mjs: x402-protected source server
- agent-v2.mjs: source selection, live payment, citation
- harness-v2.mjs: verification checks
- TEST-EVIDENCE.md: evidence summary
- SUBMISSION.md: submission framing
- DEMO-SCRIPT.md: demo script

## Scope
- Testnet only
- No mainnet settlement claimed
- Terminal/log proof surface by design
