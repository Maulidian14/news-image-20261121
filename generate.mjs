// Renders index.html to entry.png (1024x1024) with the local Chromium
// through Playwright. Run: node generate.mjs
import { chromium } from '/opt/hatch/skills/spaces/ts-runtime/dist/node_modules/playwright/index.mjs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const dir = dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({
  executablePath: '/opt/meta-chromium/chrome',
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--allow-file-access-from-files',
    '--hatch-webgl-allowed-domains-file=/tmp/w1.txt',
    '--hatch-webgl-allowed-domains-sha256=8097045f0459c96c4cdc76e3a1af4e0f43f640b4b59c43d6db35e3641c0264c6',
  ],
});
try {
  const page = await browser.newPage({ viewport: { width: 1024, height: 1024 }, deviceScaleFactor: 1 });
  const faults = [];
  page.on('pageerror', (err) => faults.push(String(err)));
  await page.goto('file://' + join(dir, 'index.html'), { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(700);
  await page.screenshot({ path: join(dir, 'entry.png'), type: 'png' });
  if (faults.length > 0) console.log('PAGE ERRORS:', faults.join(' | '));
  console.log('rendered entry.png');
} finally {
  await browser.close();
}
