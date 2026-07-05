# video/assets — Asset Inventory

## Folder structure

```
video/assets/
  proof-viewer/     Real browser screenshots of the published proof viewer
  product-ui/       Reserved — no separate product UI exists in this repo
  screenshots/      Original capture session output (same content as proof-viewer/)
```

## Proof viewer screenshots (`proof-viewer/`)

All screenshots captured via Playwright headless Chromium from `web/index.html` (served locally at http://localhost:8765/). The local file is byte-for-byte identical to the published public proof viewer at:

**https://faadil1.github.io/citepay-agent-lepton/index.html**

| File | Section |
|---|---|
| 00-full-page.png | Full scrollable page |
| 01-hero.png | Hero viewport — "No pay, no cite." headline + proof chips |
| 02-gate-lanes-s1-s2-s3.png | Citation gate: S1 PAID / S2 OVER BUDGET / S3 LOWER RELEVANCE |
| 02-gate-lanes.png | Earlier partial gate capture (superseded by 02-gate-lanes-s1-s2-s3.png) |
| 03-live-gateway-arc-usdc.png | Payment slip — LIVE_GATEWAY / eip155:5042002 / 0.001 USDC / HTTP 200 |
| 03b-notary-badge.png | Notary badge element |
| 04-seller-receipt.png | Seller receipt — payTo / payer / amount / tx/ref |
| 05-limitations-card.png | Honest limitations card |
| 06-ledger.png | Budget ledger — before/after 0.005→0.004 USDC |
| 07-final-answer.png | Final cited answer block |

## Notes

- The proof viewer is a **static judge presentation layer**, not a production app UI.
- It renders embedded JSON evidence from `evidence/live-gateway-evidence-v3.json` and `evidence/settlement-receiving-proof.json`.
- The agent itself is **terminal/log-based**. The viewer exists solely to present captured proof to judges.
- For video recording, prefer the published URL over localhost.
- `product-ui/` is empty because no separate product UI exists in this repo. The proof viewer IS the public-facing surface.
