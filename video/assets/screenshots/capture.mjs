import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const webDir = 'C:/Users/fboussari/citepay-agent-lepton/web';
const outDir = __dir;

const server = createServer((req, res) => {
  const file = join(webDir, req.url === '/' ? 'index.html' : req.url.slice(1));
  try { res.writeHead(200); res.end(readFileSync(file)); }
  catch { res.writeHead(404); res.end('not found'); }
});
await new Promise(r => server.listen(8765, r));
console.log('Server ready');

const browser = await chromium.launch({ headless: true });
const page    = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:8765/', { waitUntil: 'networkidle' });

// 00 full page
await page.screenshot({ path: join(outDir, '00-full-page.png'), fullPage: true });
console.log('00-full-page.png ✓');

// 01 hero
await page.screenshot({ path: join(outDir, '01-hero.png'), clip: { x:0, y:0, width:1440, height:900 } });
console.log('01-hero.png ✓');

// Use element.screenshot() so Playwright scrolls to the element automatically
async function shot(sel, file) {
  const el = page.locator(sel).first();
  try {
    await el.waitFor({ timeout: 5000 });
    await el.scrollIntoViewIfNeeded();
    await el.screenshot({ path: join(outDir, file) });
    console.log(file, '✓');
  } catch(e) { console.warn('SKIP', file, '-', e.message.slice(0, 100)); }
}

// 02 S1 selected / S2 S3 rejected — the gate lanes section
await shot('#gate-lanes', '02-gate-lanes-s1-s2-s3.png');

// 03 LIVE_GATEWAY / Arc / 0.001 USDC — payment slip + stamp block
await shot('#payment-slip', '03-live-gateway-arc-usdc.png');

// Notary badge (settle proof)
await shot('#notary-badge', '03b-notary-badge.png');

// 04 Seller receipt / HTTP 200
await shot('#seller-slip', '04-seller-receipt.png');

// 05 Limitations card
await shot('#seller-limitation', '05-limitations-card.png');

// Bonus: invoice ledger
await shot('#ledger-rows', '06-ledger.png');

// Bonus: final answer
await shot('#final-answer', '07-final-answer.png');

await browser.close();
server.close();
console.log('All done.');
