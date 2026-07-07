<!-- PLAN-C-PACKAGING:START -->
# CitePay Agent — No pay, no cite.

Most agents automate payments. CitePay decides if payment is deserved — and can't cite without paying.

**The sophistication is knowing when not to pay.**

`Circle Gateway x402 · Gateway testnet API · Arc Testnet eip155:5042002 · verify=true · settle=true · HTTP 200 unlock`


## Rejection rubric

A candidate source is rejected when any of the following holds:

- **over_budget** — price exceeds the fixed research budget (0.005 USDC)
- **lower_relevance_price_ratio** — another eligible source offers more relevance per USDC
- **insufficient match** — too little term overlap with the query to justify any payment
- **no citation without successful payment** — even a selected source is never cited unless verify=true, settle=true, and HTTP 200 unlock all succeed

## Onboard a publisher in 5 minutes

A publisher needs exactly one thing: an x402-protected endpoint compatible with the seller pattern in `seller-v2.mjs` — price and `payTo` in the 402 requirements.

From there, CitePay can evaluate the source, pay through Circle Gateway x402 on Arc Testnet, unlock the content, and cite it only after payment settles.

No external publishers are onboarded yet. `seller-v2.mjs` is the reference implementation a real publisher would copy.
<!-- PLAN-C-PACKAGING:END -->

# CitePay Agent

AI research agent that decides which sources are worth paying for, unlocks x402-protected content via Circle Gateway on Arc Testnet, and pays creators in test USDC only when their work is cited.

Judge Memory Sentence: It picked which source to pay for, proved the payment on Arc/Gateway, then cited only that one.

## Judge quick links

- **Proof viewer source:** [docs/index.html](docs/index.html)
- **V3 evidence:** [evidence/live-gateway-evidence-v3.json](evidence/live-gateway-evidence-v3.json)
- **Settlement trace, sanitized:** [evidence/settlement-trace-v3.json](evidence/settlement-trace-v3.json)
- **V3 harness:** [harness-v3.mjs](harness-v3.mjs)
- **Demo script:** [DEMO-SCRIPT.md](DEMO-SCRIPT.md)

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

## V3 — computed relevance scoring

V3 improves the agentic layer by computing relevance from token overlap between the user query and each source's title/content metadata.

The agent now logs:
- query tokens
- source tokens
- matched terms
- computed relevance score
- relevance/price ratio
- rejection reasons
- selected paid source

V3 keeps the V2 payment path frozen and still settles through Circle Gateway on Arc Testnet.

Latest V3 proof:
- payment_mode: `LIVE_GATEWAY`
- tx/ref: `1310f944-6996-4c6a-a32f-c7c27efc4966`
- selected source: `S1`
- rejected sources: `S2`, `S3`
- harness: `ALL V3 CHECKS PASSED`

## CitePay Web

`web/index.html` is a static proof viewer. It renders the captured V3 evidence as a visual flow:

query → computed relevance → selected/rejected sources → live payment ref → final paid citation

It does not trigger browser payments and does not modify the live Gateway flow.

## Seller-side receipt

A repeat V3 run also captured a sanitized seller-side settlement receipt:

- seller/payTo: `0x9252470F6237E16d087E0e39B121B3e770Ea1972`
- tx/ref: `f1983b38-e27e-4126-8ed1-69e76927d25d`
- verify: `true`
- settle: `true`
- amount: `0.001 USDC`

This is not a balance-delta claim; it is a sanitized settlement receipt from the seller-side logs.
