<!-- PLAN-C-SUBMISSION:START -->
# CitePay Agent — No pay, no cite.

Most agents automate payments. CitePay decides if payment is deserved — and can't cite without paying.

**The sophistication is knowing when not to pay.**

`Circle Gateway x402 · Gateway testnet API · Arc Testnet eip155:5042002 · verify=true · settle=true · HTTP 200 unlock`


## What is proven live

- LIVE payment rail proven on Arc Testnet / `eip155:5042002`
- Circle Gateway x402 payment flow used as the citation gate
- verify=true, settle=true, HTTP 200 unlock
- Buyer-side evidence captured
- Seller-side settlement receipt captured
- Rejected source evidence captured
- Public GitHub Pages page is a judge-facing proof viewer

## Adoption readiness

- ✅ LIVE payment rail proven with repeated Arc Testnet Gateway evidence
- ✅ x402 seller endpoint pattern proven through `seller-v2.mjs`
- ✅ Buyer and seller receipts captured
- ✅ Public proof viewer deployed
- ❌ External publishers onboarded: not yet
- ❌ Self-serve public product: not yet — the public page is a judge-facing proof viewer

## FAQ

**Why only 3 hardcoded candidate sources?** Deliberate scope: the payment rail and the decision logic are the hard, proven parts. The source catalog is the trivially extensible part — any x402 endpoint can join.

## Honest limits

- Testnet only
- No mainnet settlement claim
- No production reliability claim
- No external publishers onboarded yet
- The public page is a proof viewer, not a live browser payment product
<!-- PLAN-C-SUBMISSION:END -->

# SUBMISSION.md — CitePay Agent

Hackathon: Lepton Agents Hackathon
Track fit: Creator & Publisher Monetization
Team: Faadil Labs / solo

## One-line
An AI research agent that decides which sources are worth paying for, unlocks x402-protected content, and pays creators in test USDC only when their work is cited as evidence.

## Judging criteria mapping
Agentic Sophistication: evaluates multiple sources, rejects with reasons, pays only the winner, cites only paid evidence.
Traction: working live testnet demo with Gateway settlement references and harness results.
Circle tool usage: Circle Gateway x402 settlement on Arc Testnet gates unlock and citation.
Innovation: payment becomes the evidence gate for AI citations.

## Signature moment
402 -> live Arc/Gateway tx ref -> unlock -> final answer cites only the paid source.

## Known limits
- Testnet only
- Single verified live run per version
- Terminal/log-based proof surface
- No production UI
