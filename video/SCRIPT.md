# VIDEO SCRIPT — CitePay Agent (Judge Video, 90–120s)

## Recording target
- **Primary URL:** https://faadil1.github.io/citepay-agent-lepton/index.html
- **Fallback (local only):** http://localhost:8765/
- **Do not use localhost as primary.** The public URL is published and verifiable by judges.

## Format
- Screen recording of the published proof viewer, scrolling through each section
- Narration overlaid
- Target: 90–120 seconds
- Screenshots available in `video/assets/proof-viewer/` as static fallback frames

---

## Shot list

| # | Asset | Section | Start | Duration |
|---|---|---|---|---|
| 00 | (live scroll) | Context card / proof chips | 0s | 10s |
| 01 | 01-hero.png | Hero — "No pay, no cite." | 10s | 12s |
| 02 | 02-gate-lanes-s1-s2-s3.png | Gate: S1/S2/S3 decision | 22s | 25s |
| 03 | 03-live-gateway-arc-usdc.png | Payment slip | 47s | 22s |
| 04 | 04-seller-receipt.png | Seller receipt | 69s | 15s |
| 05 | 05-limitations-card.png | Limitations | 84s | 12s |
| 06 | 07-final-answer.png | Final cited answer | 96s | 14s |
| 07 | (end card) | End card + URL | 110s | 10s |

**Total: ~120s**

---

## Section narrations

### 00 — Context (0–10s)
**Screen:** Scroll past proof chips — LIVE_GATEWAY PASS · ARC TESTNET · CIRCLE GATEWAY X402 · 0.001 USDC PAID · HTTP 200 UNLOCK · SELLER-SIDE RECEIPT CAPTURED.

> This is CitePay Agent — a terminal-based AI agent submitted to the Lepton Hackathon.
> The proof viewer you're looking at is the published judge presentation layer. The agent itself runs in a terminal.

### 01 — Hero (10–22s)
**Screen:** "No pay, no cite." headline + subhead.

> The premise is simple: AI agents cite sources for free.
> CitePay makes citation cost something. No pay, no cite — enforced mechanically, not by policy.

### 02 — Gate (22–47s)
**Screen:** Gate lanes — S1 OPEN / S2 CLOSED / S3 CLOSED with rejection labels.

> Three candidate sources. One user query. Fixed budget: zero point zero zero five USDC.
> S2 priced at zero point zero two — over budget. Rejected before any payment attempt.
> S3 matched on price but scored lower relevance. Rejected.
> S1 — relevance score zero point three five seven, ratio three five seven — selected.
> The agent computed this from token overlap. No LLM call for ranking.

### 03 — Settlement (47–69s)
**Screen:** Payment slip — PAYMENT_MODE / NETWORK / AMOUNT / TX REF / VERIFY / SETTLE / UNLOCK.

> Live settlement through Circle Gateway x402.
> Network: Arc Testnet, chain eip155 five-zero-four-two-zero-zero-two.
> Amount: zero point zero zero one USDC.
> Verify: true. Settle: true. HTTP 200 — content unlocked.

### 04 — Seller Receipt (69–84s)
**Screen:** Seller slip — payTo / payer / amount / tx/ref.

> The seller's server captured its own receipt.
> PayTo address on record. Payer address on record. Same transaction reference as the settlement trace.
> This is from real seller logs — not a reconstructed claim.

### 05 — Limitations (84–96s)
**Screen:** Limitations card — "HONEST LIMITATION" label, full text.

> Honest about what isn't proven: no seller balance delta was measured.
> The BatchFacilitatorClient doesn't expose a balance query method.
> What is proven: payTo, payer, verify, settle, tx/ref — from seller logs.
> Testnet only. No mainnet settlement claimed.

### 06 — Final Answer (96–110s)
**Screen:** Final cited answer block.

> After payment and unlock, the agent writes its final answer.
> It cites only S1 — the source it paid for.
> S2 and S3 never received payment. They get no citation.
> Payment is the evidence gate.

### 07 — End Card (110–120s)
**Screen:** Static end card.

> CitePay Agent — Lepton Hackathon · Arc Testnet · Circle Gateway x402.

**End card text:**
```
Public proof viewer (judge-facing):
https://faadil1.github.io/citepay-agent-lepton/index.html

Arc Testnet · Circle Gateway x402 · 0.001 USDC
Testnet only — no mainnet claim
```
