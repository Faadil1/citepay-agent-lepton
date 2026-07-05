# CLAIMS CHECK — Video Production

## Recording URL authority
| URL | Role | Use |
|---|---|---|
| https://faadil1.github.io/citepay-agent-lepton/index.html | Published public proof viewer | Primary — use for all recordings |
| http://localhost:8765/ | Local server (web/index.html) | Fallback only |
| web/index.html | Canonical source | Do not reference as URL in video |
| docs/index.html | GitHub Pages mirror (identical) | Do not reference separately in video |

## Claims verified for video use

All claims cross-referenced against `evidence/` files and public URL (WebFetch confirmed: page live, title "CitePay Agent — No pay, no cite.", LIVE_GATEWAY / Arc Testnet / 0.001 USDC / verify true / settle true).

| Claim | Verified |
|---|---|
| LIVE_GATEWAY payment mode | yes |
| Arc Testnet / eip155:5042002 | yes |
| 0.001 USDC paid | yes |
| Circle Gateway x402 | yes |
| HTTP 200 unlock after payment | yes |
| S1 selected, S2/S3 rejected with reasons | yes |
| S2 rejected — over_budget (0.02 USDC price) | yes |
| S3 rejected — lower_relevance_price_ratio | yes |
| verify: true / settle: true | yes |
| Seller receipt captured (payTo, payer, tx/ref) | yes |
| Public proof viewer published and accessible | yes (WebFetch 2026-07-05) |
| Screenshots match live published page | yes — local identical to docs/ |

## Do not claim in video
- Mainnet settlement
- Measured seller balance increase
- Production app or live dashboard
- Multiple live runs (one per version)
- Circle-side payment confirmation receipt
