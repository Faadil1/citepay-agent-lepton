# CLAIMS CHECK — CitePay Agent Brag Video

All claims below are verified against evidence files in `evidence/`.
Source of truth: `evidence/live-gateway-evidence-v3.json`, `evidence/settlement-receiving-proof.json`, `evidence/settlement-trace-v3.json`.

---

## VERIFIED CLAIMS

| Claim | Source | Status |
|---|---|---|
| payment_mode: LIVE_GATEWAY | settlement-trace-v3.json, settlement-receiving-proof.json | VERIFIED |
| network: eip155:5042002 (Arc Testnet) | both evidence files | VERIFIED |
| amount: 0.001 USDC paid | settlement-receiving-proof.json `.amount_paid_usdc` | VERIFIED |
| verify: true | settlement-trace-v3.json `.verify_is_valid` | VERIFIED |
| settle: true | settlement-trace-v3.json `.settle_success` | VERIFIED |
| HTTP 200 unlock | settlement-trace-v3.json `.http_status: 200` | VERIFIED |
| S1 selected | live-gateway-evidence-v3.json `.selected_source_id: S1` | VERIFIED |
| S2 rejected — over_budget | live-gateway-evidence-v3.json S2 `.reason: over_budget` | VERIFIED |
| S3 rejected — lower_relevance_price_ratio | live-gateway-evidence-v3.json S3 `.reason` | VERIFIED |
| S1 relevanceScore: 0.357, ratio: 357.143 | live-gateway-evidence-v3.json | VERIFIED |
| Budget: 0.005 USDC | live-gateway-evidence-v3.json `.budget_usdc` | VERIFIED |
| Remaining after payment: 0.004 USDC | live-gateway-evidence-v3.json `.budget_before_after.after` | VERIFIED |
| Seller payTo: 0x9252470F6237E16d087E0e39B121B3e770Ea1972 | settlement-receiving-proof.json | VERIFIED |
| Payer: 0x44062bfded95d441a540f01ff21c1f1b8c841eea | settlement-receiving-proof.json | VERIFIED |
| tx/ref (seller): f1983b38-e27e-4126-8ed1-69e76927d25d | settlement-receiving-proof.json | VERIFIED |
| tx/ref (settlement trace): 1310f944-6996-4c6a-a32f-c7c27efc4966 | settlement-trace-v3.json | VERIFIED |
| Public proof viewer live at GitHub Pages URL | WebFetch confirmed — page title "CitePay Agent — No pay, no cite." | VERIFIED |
| Proof viewer content matches local evidence | diff web/index.html docs/index.html → empty; embedded JSON matches V3 files | VERIFIED |

---

## FORBIDDEN CLAIMS — do not make these

| Claim | Why forbidden |
|---|---|
| "Mainnet settlement" | Testnet only. No mainnet run. |
| "Seller balance increased by 0.001 USDC" | seller_balance_before/after are null in receipt. Not measured. |
| "Production app" or "production UI" | No production UI. Proof viewer is judge presentation layer only. |
| "Circle confirmed the payment" | Circle Gateway settled it; we have the tx/ref and settle:true but not a Circle-side confirmation receipt. |
| "Multiple successful runs" | Single verified live run per version (V2, V3). |

---

## BOUNDARY NOTES

- The proof viewer at https://faadil1.github.io/citepay-agent-lepton/index.html is the published judge-facing presentation. It is a static page rendering embedded evidence — not a live agent or payment UI.
- `web/index.html` = canonical source. `docs/index.html` = GitHub Pages mirror. Byte-for-byte identical.
- All screenshots in `video/assets/proof-viewer/` were captured from the local server rendering of `web/index.html`, which is identical to the published page.
