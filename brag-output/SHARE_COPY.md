# SHARE COPY — CitePay Agent

## Public proof viewer URL
https://faadil1.github.io/citepay-agent-lepton/index.html

---

## Twitter / X — Primary post

> Built CitePay Agent for @lepton_agents hackathon.
>
> An AI agent that only cites sources it paid for.
>
> No pay → source rejected.
> Pay → content unlocked → source cited.
>
> Live settlement: Circle Gateway x402 on Arc Testnet.
> 0.001 USDC. VERIFY: true. SETTLE: true. HTTP 200.
>
> Proof: https://faadil1.github.io/citepay-agent-lepton/index.html

---

## Twitter / X — Technical thread (1/4)

> 1/ CitePay Agent — how it works:
>
> - 3 candidate sources. Fixed budget: 0.005 USDC.
> - Agent computes relevance score via token overlap (no LLM call for ranking).
> - S2: over budget → rejected before payment attempt.
> - S3: lower relevance/price ratio → rejected.
> - S1: ratio 357.143 → selected.

> 2/ S1 gets the live payment.
>
> Circle Gateway x402. Arc Testnet. eip155:5042002.
> 0.001 USDC settled.
> Seller-side receipt captured: payTo confirmed, payer confirmed, settle: true.
> No balance-delta claim — honest about what was measured.

> 3/ After payment: HTTP 200 unlock. Content available. Citation written.
>
> The agent cites only what it paid for.
> S2 and S3 get no citation — they never received payment.
> Payment is the evidence gate.

> 4/ Proof viewer (published):
> https://faadil1.github.io/citepay-agent-lepton/index.html
>
> Terminal-based agent. Static proof presentation layer for judges.
> Testnet only. No mainnet claim.

---

## Discord / Hackathon post

**CitePay Agent — submission**

An AI research agent that gates citations behind live payment.

The agent evaluates sources by relevance and price, rejects anything over budget or below the relevance threshold, pays the winner through Circle Gateway x402 on Arc Testnet, and cites only what it paid for.

**Live proof:**
- payment_mode: LIVE_GATEWAY
- network: Arc Testnet (eip155:5042002)
- amount: 0.001 USDC
- verify: true / settle: true / HTTP 200

**Public proof viewer (judge-facing):**
https://faadil1.github.io/citepay-agent-lepton/index.html

**GitHub:** https://github.com/faadil1/citepay-agent-lepton

Testnet only. No mainnet settlement claimed.

---

## LinkedIn

> Submitted CitePay Agent to the Lepton Agents Hackathon.
>
> The core idea: AI agents currently cite sources for free. CitePay makes citation cost something.
>
> The agent scores candidate sources on relevance and price, rejects ones that exceed the budget or fall below the relevance threshold, settles payment through Circle's Gateway x402 protocol on Arc Testnet, and cites only the source it paid for.
>
> The payment is the evidence gate — mechanically enforced, not just claimed.
>
> Live proof: https://faadil1.github.io/citepay-agent-lepton/index.html
>
> Built with: Circle Gateway x402 · Arc Testnet · Node.js · viem

---

## One-liner (for everywhere)

> CitePay Agent — no pay, no cite. Live x402 settlement on Arc Testnet gates AI citations. https://faadil1.github.io/citepay-agent-lepton/index.html
