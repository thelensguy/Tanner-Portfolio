import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'screenshots', 'readme');
const URL = 'http://localhost:5174';

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });

async function shot(name, opts = {}) {
  const path = join(OUT, `${name}.png`);
  await page.screenshot({ path, ...opts });
  console.log(`✓ ${name}.png`);
  return path;
}

// ── Light mode ───────────────────────────────────────────────────────────────
await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(800); // fonts settle

// Hero
await shot('hero');

// Scroll to Work section and wait for reveal
await page.evaluate(() => document.getElementById('work')?.scrollIntoView({ behavior: 'instant' }));
await page.waitForTimeout(900);
await shot('work');

// Scroll to InFocus section (id="focus") — capture bio + resume dials
await page.evaluate(() => document.getElementById('focus')?.scrollIntoView({ behavior: 'instant' }));
await page.waitForTimeout(1200); // canvas dials need a beat to render
await shot('infocus');

// Scroll further to show the resume/dial rows
await page.evaluate(() => document.querySelector('.resume')?.scrollIntoView({ behavior: 'instant' }));
await page.waitForTimeout(900);
await shot('infocus-resume');

// Scroll to Contact section
await page.evaluate(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'instant' }));
await page.waitForTimeout(900);
await shot('contact');

// ── Dark mode ────────────────────────────────────────────────────────────────
await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);

// Click the dark-mode toggle (moon icon button in the nav)
await page.click('button[aria-label*="dark"], button[aria-label*="mode"], nav button:last-of-type');
await page.waitForTimeout(600);
await shot('hero-dark');

// Scroll to work in dark mode
await page.evaluate(() => document.getElementById('work')?.scrollIntoView({ behavior: 'instant' }));
await page.waitForTimeout(900);
await shot('work-dark');

await browser.close();
console.log('\nAll screenshots saved to screenshots/readme/');
