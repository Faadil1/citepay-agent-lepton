# DIRECTORS BRIEF — CitePay Agent Brag Video

## Elevator pitch (one sentence)
CitePay Agent is a terminal-based AI agent that scores candidate sources, rejects the expensive or irrelevant ones, pays the winner through Circle Gateway x402 on Arc Testnet, and cites only what it paid for.

## Core thesis for video
Payment is the evidence gate. No pay, no cite. The agent enforces this mechanically — not by policy — via live on-chain settlement.

## Proof viewer (public, judge-facing)
- URL: https://faadil1.github.io/citepay-agent-lepton/index.html
- Role: Published judge presentation layer. Not a production app UI. Renders captured V3 evidence as a visual flow.
- Source: docs/index.html (GitHub Pages mirror of web/index.html)
- Serve locally: `node -e "..." # see capture.mjs or README`

## Source authority
| Path | Role |
|---|---|
| `web/index.html` | Canonical repo source |
| `docs/index.html` | GitHub Pages deployment mirror (byte-for-byte identical) |
| `https://faadil1.github.io/citepay-agent-lepton/index.html` | Published public proof viewer — use for all recordings and judge links |

## What to show in the video

### Scene 1 — Problem statement (0–15s)
- "AI agents cite sources for free. CitePay makes citation cost something."
- No voiceover needed over the hero. Let the headline land.
- Show: proof viewer hero at the public URL.

### Scene 2 — The gate (15–35s)
- Show the gate matrix: S1 OPEN / S2 CLOSED / S3 CLOSED
- Narrate the rejection reasons: S2 over budget, S3 lower relevance/price ratio
- The agent computed this — not hardcoded selection

### Scene 3 — Live settlement (35–55s)
- PAYMENT_MODE: LIVE_GATEWAY
- NETWORK: eip155:5042002 (Arc Testnet)
- AMOUNT: 0.001 USDC
- TX/REF: f1983b38-e27e-4126-8ed1-69e76927d25d
- VERIFY: true / SETTLE: true / UNLOCK: HTTP 200

### Scene 4 — Seller receipt (55–70s)
- Seller/payTo: 0x9252470F6237E16d087E0e39B121B3e770Ea1972
- Payer: 0x44062bfded95d441a540f01ff21c1f1b8c841eea
- 0.001 USDC settled

### Scene 5 — Honest limitations (70–80s)
- Show limitations card verbatim
- Testnet only. No balance delta claim. No mainnet settlement claimed.

### Scene 6 — Final answer (80–90s)
- Show final cited answer block
- Only S1 cited. Only what was paid for.

## Tone
- Precise. Not hype.
- Let the on-chain proof speak.
- Do not describe the proof viewer as a production app or dashboard.
- Do not claim mainnet settlement.

## Recording priority
1. Record from public URL: https://faadil1.github.io/citepay-agent-lepton/index.html
2. Fallback to localhost:8765 only if internet is unavailable during capture session
