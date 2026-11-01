#!/usr/bin/env node
// axe-core accessibility runner (WCAG 2.0/2.1/2.2 A and AA rules) via Playwright.
//
//   node a11y.mjs https://example.com [more urls] [--urls list.txt]
//        [--viewports 390,1440] [--best-practice] [--out report.md] [--fail-on serious]
//
// Writes a Markdown summary (default docs/review/out/<stamp>-a11y.md) plus the raw axe JSON beside it.
// Uses installed Google Chrome if present, else Playwright's bundled Chromium (`npx playwright install chromium`).
// --fail-on minor|moderate|serious|critical: exit 1 if any violation at or above that impact.
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { resolve } from 'node:path';
import { parseArgs, readUrls, stamp, writeOut, esc, OUT_DIR } from './lib.mjs';

const IMPACTS = ['critical', 'serious', 'moderate', 'minor'];
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function launch() {
  try { return await chromium.launch({ channel: 'chrome' }); }
  catch { return chromium.launch(); }
}

async function main() {
  const opts = parseArgs();
  const urls = readUrls(opts);
  const widths = String(opts.viewports || '1440').split(',').map(Number);
  const tags = opts['best-practice'] ? [...TAGS, 'best-practice'] : TAGS;
  const out = resolve(opts.out || `${OUT_DIR}/${stamp()}-a11y.md`);

  const browser = await launch();
  const results = [];
  for (const url of urls) {
    for (const width of widths) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const page = await ctx.newPage();
      const entry = { url, width };
      try {
        await page.goto(url, { waitUntil: 'load', timeout: 60000 });
        await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
        const r = await new AxeBuilder({ page }).withTags(tags).analyze();
        Object.assign(entry, { violations: r.violations, incomplete: r.incomplete.length, passes: r.passes.length, axe: r.testEngine.version });
      } catch (e) {
        entry.error = e.message.split('\n')[0];
      }
      console.error(`${url} @${width}: ${entry.error ? 'ERROR ' + entry.error : entry.violations.length + ' violations'}`);
      results.push(entry);
      await ctx.close();
    }
  }
  await browser.close();

  const md = ['# Accessibility (axe-core)', '',
    `Run: ${new Date().toISOString()}. Rules: ${tags.join(', ')}. axe ${results.find((r) => r.axe)?.axe ?? '?'}.`,
    'axe catches roughly a third of WCAG issues; a manual keyboard and screen-reader pass is still required.', '',
    '| URL | Width | Critical | Serious | Moderate | Minor | Needs review | Passed rules |',
    '|---|---|---|---|---|---|---|---|'];
  for (const r of results) {
    if (r.error) { md.push(`| ${r.url} | ${r.width} | ERROR: ${esc(r.error)} ||||||`); continue; }
    const c = (i) => r.violations.filter((v) => v.impact === i).length;
    md.push(`| ${r.url} | ${r.width} | ${IMPACTS.map(c).join(' | ')} | ${r.incomplete} | ${r.passes} |`);
  }
  for (const r of results.filter((x) => x.violations?.length)) {
    md.push('', `## ${r.url} @ ${r.width}px`, '', '| Impact | Rule | Nodes | Description | Example target |', '|---|---|---|---|---|');
    const sorted = [...r.violations].sort((a, b) => IMPACTS.indexOf(a.impact) - IMPACTS.indexOf(b.impact));
    for (const v of sorted) {
      md.push(`| ${v.impact} | [${v.id}](${v.helpUrl}) | ${v.nodes.length} | ${esc(v.help)} | \`${esc(v.nodes[0]?.target.join(' '))}\` |`);
    }
  }
  md.push('');
  writeOut(out, md.join('\n'));
  writeOut(out.replace(/\.md$/, '.json'), JSON.stringify(results, null, 2));
  console.log(md.join('\n'));
  console.error(`Wrote ${out}`);

  if (opts['fail-on']) {
    const limit = IMPACTS.indexOf(opts['fail-on']);
    const bad = results.some((r) => r.error || r.violations.some((v) => IMPACTS.indexOf(v.impact) <= limit));
    process.exitCode = bad ? 1 : 0;
  }
}

main().catch((e) => { console.error(e); process.exit(2); });
