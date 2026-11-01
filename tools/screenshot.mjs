#!/usr/bin/env node
/**
 * screenshot.mjs: full-page screenshots of a running site at 390, 768, 1440 and 1920 px.
 *
 * Usage (run from anywhere; paths are resolved against the main repo root):
 *   node tools/screenshot.mjs --base http://localhost:4321 --routes /,/about
 *   node tools/screenshot.mjs --base http://localhost:4322 --routes / --label variant/g3-b-editorial
 *   node tools/screenshot.mjs --base http://localhost:4321 --routes / --out design/screenshots/g3 --widths 1440,390
 *
 * Flags:
 *   --base <url>       Base URL of the running site (required).
 *   --routes <list>    Comma-separated routes, leading slash optional; "home" means "/". Default "/".
 *                      From Git Bash prefer "home,about" (Bash rewrites a bare "/" into a Windows path).
 *   --out <dir>        Output folder. Default design/screenshots/<YYYY-MM-DD>/ under the repo root.
 *   --label <name>     Branch/variant label used in file names. Default: current git branch of cwd.
 *   --widths <list>    Comma-separated widths. Default 390,768,1440,1920.
 *   --motion           Do NOT force prefers-reduced-motion (default is reduce).
 *   --timeout <ms>     Navigation timeout per page. Default 45000.
 *   --allow-errors     Capture pages that answer HTTP 4xx/5xx (default: count them as failures).
 *
 * Exit code is 1 if any shot failed.
 *
 * Output: <out>/<HHMM>-<label>-<route>-<width>.png  (route "/" becomes "home", slashes become "-")
 * plus <out>/manifest.json, appended with one entry per shot; contact-sheet.mjs reads it.
 *
 * Each page waits for network idle, document.fonts.ready, every <img> to finish loading
 * (after scrolling the page to trigger lazy images), and two animation frames before capture.
 */
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import { parseArgs, repoRoot, currentBranch, slug, localStamp } from './lib.mjs';

const VIEWPORT_HEIGHTS = { 390: 844, 768: 1024, 1440: 900, 1920: 1080 };

const args = parseArgs(process.argv.slice(2));
if (!args.base || args.help) {
  console.log('Usage: node tools/screenshot.mjs --base <url> [--routes /,/about] [--out dir] [--label name] [--widths 390,768,1440,1920]');
  process.exit(args.help ? 0 : 1);
}

const root = repoRoot();
const { date, hhmm } = localStamp();
// Routes may be written without the leading slash ("home" means "/"), which avoids Git Bash
// rewriting "/" into "C:/Program Files/Git/". A drive-letter route means that rewrite happened.
const routes = String(args.routes ?? '/').split(',').map((r) => r.trim()).filter(Boolean).map((r) => {
  if (/^[a-zA-Z]:[\\/]/.test(r)) {
    console.error(`route "${r}" looks like a path rewritten by Git Bash; use --routes home,about or set MSYS_NO_PATHCONV=1`);
    process.exit(1);
  }
  return r === 'home' ? '/' : r.startsWith('/') ? r : `/${r}`;
});
const widths = String(args.widths ?? '390,768,1440,1920').split(',').map(Number).filter(Boolean);
const label = slug(args.label ?? currentBranch());
const outDir = path.resolve(root, args.out ?? path.join('design', 'screenshots', date));
const timeout = Number(args.timeout ?? 45000);
await fs.mkdir(outDir, { recursive: true });

async function settle(page) {
  await page.evaluate(async () => {
    // Scroll through the page so lazy-loaded images and observers fire, then return to top.
    const step = window.innerHeight;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 50));
    }
    window.scrollTo(0, 0);
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((img) =>
        img.complete ? null : new Promise((r) => {
          img.addEventListener('load', r, { once: true });
          img.addEventListener('error', r, { once: true });
        })),
    );
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  });
  await page.waitForLoadState('networkidle').catch(() => {});
}

const browser = await chromium.launch();
const shots = [];
let failures = 0;
try {
  for (const width of widths) {
    const mobile = width < 1024;
    const context = await browser.newContext({
      viewport: { width, height: VIEWPORT_HEIGHTS[width] ?? 900 },
      deviceScaleFactor: 1,
      isMobile: mobile,
      hasTouch: mobile,
      reducedMotion: args.motion ? 'no-preference' : 'reduce',
    });
    const page = await context.newPage();
    for (const route of routes) {
      const url = new URL(route, args.base).href;
      const file = `${hhmm}-${label}-${slug(route)}-${width}.png`;
      try {
        const res = await page.goto(url, { waitUntil: 'networkidle', timeout });
        if (res && res.status() >= 400 && !args['allow-errors']) throw new Error(`HTTP ${res.status()}`);
        await settle(page);
        await page.screenshot({ path: path.join(outDir, file), fullPage: true, animations: 'disabled' });
        shots.push({ file, label, route, width, url, takenAt: new Date().toISOString() });
        console.log(`ok   ${width}px ${url} -> ${path.join(outDir, file)}`);
      } catch (err) {
        failures++;
        console.error(`FAIL ${width}px ${url}: ${err.message.split('\n')[0]}`);
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
}

const manifestPath = path.join(outDir, 'manifest.json');
let manifest = [];
try { manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8')); } catch {}
await fs.writeFile(manifestPath, JSON.stringify([...manifest, ...shots], null, 2) + '\n');
console.log(`${shots.length} shot(s) written to ${outDir}${failures ? `, ${failures} failed` : ''}`);
process.exit(failures ? 1 : 0);
