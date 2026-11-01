#!/usr/bin/env node
// axe-core accessibility runner (WCAG 2.0/2.1/2.2 A and AA rules) via Playwright.
//
//   node a11y.mjs https://example.com [more urls or local .html paths] [--urls list.txt]
//        [--viewports 390,1440] [--best-practice] [--out report.md] [--project slug] [--fail-on serious]
//
// Writes a Markdown summary (default <out dir>/<stamp>-a11y.md, see README) plus the raw axe JSON beside it.
// Local files and file:// URLs are served over http://127.0.0.1 for the run.
// Uses installed Google Chrome if present, else Playwright's bundled Chromium (`npx playwright install chromium`).
// Exit: 0 clean, 1 if --fail-on is set and a violation at or above that impact is found, 2 if a page or the tool fails.
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { resolve } from 'node:path';
import { parseArgs, readUrls, resolveTargets, stamp, writeOut, esc, outDir, displayPath, run, ToolError } from './lib.mjs';

const IMPACTS = ['critical', 'serious', 'moderate', 'minor'];
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function launch() {
  try { return await chromium.launch({ channel: 'chrome' }); }
  catch { return chromium.launch(); }
}

async function main() {
  const opts = parseArgs();
  const widths = String(opts.viewports || '1440').split(',').map(Number);
  if (widths.some((w) => !(w > 0))) throw new ToolError(`Bad --viewports: ${opts.viewports}`);
  if (opts['fail-on'] && !IMPACTS.includes(opts['fail-on'])) throw new ToolError(`--fail-on must be one of ${IMPACTS.join(', ')}`);
  const tags = opts['best-practice'] ? [...TAGS, 'best-practice'] : TAGS;
  const out = resolve(opts.out || `${outDir(opts)}/${stamp()}-a11y.md`);
  const { targets, close } = await resolveTargets(readUrls(opts));

  const browser = await launch();
  const results = [];
  try {
    for (const { url, label } of targets) {
      for (const width of widths) {
        const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
        const page = await ctx.newPage();
        const entry = { url: label, width };
        try {
          const resp = await page.goto(url, { waitUntil: 'load', timeout: 60000 });
          if (resp && resp.status() >= 400) throw new Error(`HTTP ${resp.status()}`);
          await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
          const r = await new AxeBuilder({ page }).withTags(tags).analyze();
          Object.assign(entry, { violations: r.violations, incomplete: r.incomplete.length, passes: r.passes.length, axe: r.testEngine.version });
        } catch (e) {
          entry.error = e.message.split('\n')[0];
        }
        console.error(`${label} @${width}: ${entry.error ? 'ERROR ' + entry.error : entry.violations.length + ' violations'}`);
        results.push(entry);
        await ctx.close();
      }
    }
  } finally {
    await browser.close();
    await close();
  }

  const md = ['# Accessibility (axe-core)', '',
    `Run: ${new Date().toISOString()}. Rules: ${tags.join(', ')}. axe ${results.find((r) => r.axe)?.axe ?? '?'}.`,
    'axe catches roughly a third of WCAG issues; a manual keyboard and screen-reader pass is still required.', '',
    '| URL | Width | Critical | Serious | Moderate | Minor | Needs review | Passed rules |',
    '|---|---|---|---|---|---|---|---|'];
  for (const r of results) {
    if (r.error) { md.push(`| ${esc(r.url)} | ${r.width} | ERROR: ${esc(r.error)} ||||||`); continue; }
    const c = (i) => r.violations.filter((v) => v.impact === i).length;
    md.push(`| ${esc(r.url)} | ${r.width} | ${IMPACTS.map(c).join(' | ')} | ${r.incomplete} | ${r.passes} |`);
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
  console.error(`Wrote ${displayPath(out)}`);

  if (results.some((r) => r.error)) { process.exitCode = 2; return; }
  const limit = opts['fail-on'] ? IMPACTS.indexOf(opts['fail-on']) : -1;
  process.exitCode = results.some((r) => r.violations.some((v) => IMPACTS.indexOf(v.impact) <= limit)) ? 1 : 0;
}

run(main);
