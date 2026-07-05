# HACKATHON-STATE.md — CitePay Agent

Last updated: 2026-07-05

## Status: submission complete, video packaging in progress

---

## Delta since last state

> Note: HACKATHON-STATE.md was created fresh on 2026-07-05. No prior version of this file existed in the repo. Nothing was overwritten; there is no prior state to restore.

- Proof viewer published to GitHub Pages: https://faadil1.github.io/citepay-agent-lepton/index.html (verified live 2026-07-05 via WebFetch)
- Playwright screenshots captured from local render of web/index.html (identical to published page)
- Video packaging files created: brag-output/, video/SCRIPT.md, video/CLAIMS_CHECK.md, video/assets/README.md, video/citepay-demo.mdx
- Asset folders created: video/assets/proof-viewer/ (10 screenshots), video/assets/product-ui/ (reserved, empty)
- URL authority clarified: public URL is primary; localhost is fallback only
- QA pass completed 2026-07-05: brag-output/SCRIPT.md corrected to 25s teaser; video/SCRIPT.md extended to 90–120s judge video with 8-scene shot list

---

## Proof viewer URLs

| Path | Role |
|---|---|
| `web/index.html` | Canonical repo source |
| `docs/index.html` | GitHub Pages mirror — byte-for-byte identical |
| https://faadil1.github.io/citepay-agent-lepton/index.html | **Published public proof viewer — use for judges and video** |

## Agent surface

The agent is **terminal/log-based**. The proof viewer is the judge presentation layer only — not a production app or live dashboard.

---

## Live evidence (V3, final)

| Field | Value |
|---|---|
| payment_mode | LIVE_GATEWAY |
| network | eip155:5042002 (Arc Testnet) |
| amount | 0.001 USDC |
| selected | S1 — Creator Citation Nanopayments |
| rejected | S2 (over_budget), S3 (lower_relevance_price_ratio) |
| verify | true |
| settle | true |
| http_status | 200 |
| tx/ref (seller) | f1983b38-e27e-4126-8ed1-69e76927d25d |
| tx/ref (trace) | 1310f944-6996-4c6a-a32f-c7c27efc4966 |
| seller/payTo | 0x9252470F6237E16d087E0e39B121B3e770Ea1972 |
| payer | 0x44062bfded95d441a540f01ff21c1f1b8c841eea |
| budget before | 0.005 USDC |
| budget after | 0.004 USDC |

---

## Known limits (do not overclaim)

- Testnet only — no mainnet settlement
- No seller balance delta measured
- Single verified live run per version
- No production UI — proof viewer is static judge presentation

---

## Next steps — video

1. Record screen capture from https://faadil1.github.io/citepay-agent-lepton/index.html
2. Follow shot list in video/SCRIPT.md
3. Optional: re-capture screenshots from published URL via Playwright (update capture.mjs to use public URL)
4. Assemble video using brag-output/SCRIPT.md narration
5. Distribute using brag-output/SHARE_COPY.md
