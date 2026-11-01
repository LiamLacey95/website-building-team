#!/usr/bin/env node
// Lighthouse runner, mobile preset (Moto G Power emulation, simulated slow 4G).
//
//   node lighthouse.mjs https://example.com [more urls or local .html paths] [--urls list.txt]
//        [--runs 3] [--desktop] [--out report.md] [--project slug] [--no-html]
//
// Writes a Markdown summary (default <out dir>/<stamp>-lighthouse.md, see README), a JSON summary beside it,
// and one HTML report per URL in a folder beside it. Local files and file:// URLs are served over http://127.0.0.1.
// With --runs N, each metric is the median across runs and the min-max spread is listed.
// Browser: CHROME_PATH, else installed Chrome, else Playwright's Chromium.
// Budget (PLAYBOOK quality bar): LCP < 2.5 s, CLS < 0.1, JS < 150 KB transferred.
// Exit: 0 all within budget, 1 a URL misses the budget, 2 a URL could not be audited or the tool failed.
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import * as chromeLauncher from 'chrome-launcher';
import { chromium } from 'playwright';
import { resolve, dirname, basename } from 'node:path';
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { parseArgs, readUrls, resolveTargets, stamp, writeOut, slug, esc, outDir, displayPath, run } from './lib.mjs';

const BUDGET = { lcp: 2500, cls: 0.1, jsKB: 150 };
const METRICS = ['perf', 'a11y', 'bp', 'seo', 'fcp', 'lcp', 'cls', 'tbt', 'si', 'jsKB', 'totalKB'];

function chromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  if (chromeLauncher.Launcher.getInstallations().length) return undefined; // chrome-launcher picks it
  const pw = chromium.executablePath();
  return existsSync(pw) ? pw : undefined;
}

async function runOnce(url, desktop) {
  // A private profile dir per run; on Windows Chrome can hold it locked briefly, so cleanup is best-effort.
  const userDataDir = mkdtempSync(resolve(tmpdir(), 'lh-'));
  const chrome = await chromeLauncher.launch({
    chromePath: chromePath(),
    chromeFlags: ['--headless=new', '--no-first-run', '--disable-extensions'],
    userDataDir,
  });
  try {
    const flags = { port: chrome.port, output: 'html', logLevel: 'error' };
    const res = await lighthouse(url, flags, desktop ? desktopConfig : undefined);
    if (!res) throw new Error('Lighthouse returned no result');
    if (res.lhr.runtimeError) throw new Error(`${res.lhr.runtimeError.code}: ${res.lhr.runtimeError.message}`);
    return res;
  } finally {
    try { await chrome.kill(); } catch {}
    // On some Windows machines a taskkilled Chrome lingers in teardown and never reports exit,
    // which would keep node alive forever. Stop waiting on it.
    for (const h of [chrome.process, chrome.process?.stdout, chrome.process?.stderr]) h?.unref?.();
    try { rmSync(userDataDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }); } catch {}
  }
}

function summarise(lhr) {
  const a = lhr.audits;
  const score = (k) => (lhr.categories[k]?.score == null ? null : Math.round(lhr.categories[k].score * 100));
  const scripts = (a['network-requests']?.details?.items || []).filter((i) => i.resourceType === 'Script');
  return {
    perf: score('performance'), a11y: score('accessibility'), bp: score('best-practices'), seo: score('seo'),
    fcp: a['first-contentful-paint']?.numericValue,
    lcp: a['largest-contentful-paint']?.numericValue,
    cls: a['cumulative-layout-shift']?.numericValue,
    tbt: a['total-blocking-time']?.numericValue,
    si: a['speed-index']?.numericValue,
    jsKB: scripts.reduce((s, i) => s + (i.transferSize || 0), 0) / 1024,
    totalKB: (a['total-byte-weight']?.numericValue ?? 0) / 1024,
    warnings: lhr.runWarnings || [],
    version: lhr.lighthouseVersion,
  };
}

async function main() {
  const opts = parseArgs();
  const runs = Math.max(1, Number(opts.runs || 1));
  const desktop = !!opts.desktop;
  const out = resolve(opts.out || `${outDir(opts)}/${stamp()}-lighthouse.md`);
  const htmlDir = resolve(dirname(out), basename(out, '.md') + '-html');
  const { targets, close } = await resolveTargets(readUrls(opts));

  const rows = [];
  try {
    for (const { url, label } of targets) {
      const attempts = [];
      let lastError = null;
      for (let i = 0; i < runs; i++) {
        try {
          const res = await runOnce(url, desktop);
          attempts.push({ s: summarise(res.lhr), html: res.report });
          console.error(`${label} run ${i + 1}/${runs}: perf ${attempts.at(-1).s.perf}`);
        } catch (e) {
          lastError = e.message.split('\n')[0];
          console.error(`${label} run ${i + 1}/${runs}: ERROR ${lastError}`);
        }
      }
      if (!attempts.length) { rows.push({ url: label, error: lastError || 'all runs failed' }); continue; }
      // Each metric is the median across runs; the HTML report kept is the median run by performance score.
      attempts.sort((x, y) => (x.s.perf ?? -1) - (y.s.perf ?? -1));
      const medianRun = attempts[Math.floor(attempts.length / 2)];
      const med = { ...medianRun.s };
      const spread = {};
      for (const k of METRICS) {
        const vals = attempts.map((a) => a.s[k]).filter((v) => v != null).sort((x, y) => x - y);
        if (!vals.length) continue;
        med[k] = vals[Math.floor(vals.length / 2)];
        spread[k] = [vals[0], vals.at(-1)];
      }
      let htmlPath = null;
      if (!opts['no-html']) htmlPath = displayPath(writeOut(resolve(htmlDir, `${slug(label)}.html`), medianRun.html));
      const pass = med.lcp < BUDGET.lcp && med.cls < BUDGET.cls && med.jsKB < BUDGET.jsKB;
      rows.push({ url: label, ...med, pass, spread, runs: attempts.length, failedRuns: runs - attempts.length, htmlPath });
    }
  } finally {
    await close();
  }

  const sec = (ms) => (ms == null ? '?' : (ms / 1000).toFixed(2) + ' s');
  const ok = (cond) => (cond ? 'ok' : '**over**');
  const md = ['# Lighthouse', '',
    `Run: ${new Date().toISOString()}. Preset: ${desktop ? 'desktop' : 'mobile (default config: emulated Moto G Power, simulated slow 4G, 4x CPU slowdown)'}. Runs per URL: ${runs} (each figure is the median across runs). Lighthouse ${rows.find((r) => r.version)?.version ?? '?'}.`,
    `Budget: LCP < ${BUDGET.lcp / 1000} s, CLS < ${BUDGET.cls}, JS < ${BUDGET.jsKB} KB transferred.`, '',
    '| URL | Perf | A11y | Best pr. | SEO | FCP | LCP | CLS | TBT | Speed idx | JS KB | Total KB | Budget |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|---|'];
  for (const r of rows) {
    if (r.error) { md.push(`| ${esc(r.url)} | ERROR: ${esc(r.error)} ||||||||||||`); continue; }
    md.push(`| ${esc(r.url)} | ${r.perf} | ${r.a11y} | ${r.bp} | ${r.seo} | ${sec(r.fcp)} | ${sec(r.lcp)} ${ok(r.lcp < BUDGET.lcp)} | ${r.cls.toFixed(3)} ${ok(r.cls < BUDGET.cls)} | ${Math.round(r.tbt)} ms | ${sec(r.si)} | ${r.jsKB.toFixed(0)} ${ok(r.jsKB < BUDGET.jsKB)} | ${r.totalKB.toFixed(0)} | ${r.pass ? 'PASS' : '**FAIL**'} |`);
  }
  const reports = rows.filter((r) => r.htmlPath);
  if (reports.length) md.push('', 'Full reports:', ...reports.map((r) => `- ${r.url}: \`${r.htmlPath}\``));
  const multi = rows.filter((r) => r.runs > 1);
  if (multi.length) {
    md.push('', 'Spread across runs (min to max). A wide CLS or LCP range means the result is flaky; rerun or investigate:');
    for (const r of multi) {
      const s = r.spread;
      md.push(`- ${r.url} (${r.runs} runs): perf ${s.perf[0]} to ${s.perf[1]}, LCP ${sec(s.lcp[0])} to ${sec(s.lcp[1])}, CLS ${s.cls[0].toFixed(3)} to ${s.cls[1].toFixed(3)}, TBT ${Math.round(s.tbt[0])} to ${Math.round(s.tbt[1])} ms`);
    }
  }
  const failed = rows.filter((r) => r.failedRuns);
  if (failed.length) md.push('', 'Failed runs (excluded from the medians):', ...failed.map((r) => `- ${r.url}: ${r.failedRuns} of ${runs}`));
  const warned = rows.filter((r) => r.warnings?.length);
  if (warned.length) md.push('', 'Run warnings:', ...warned.flatMap((r) => r.warnings.map((w) => `- ${r.url}: ${esc(w)}`)));
  md.push('');

  writeOut(out, md.join('\n'));
  writeOut(out.replace(/\.md$/, '.json'), JSON.stringify(rows, null, 2));
  console.log(md.join('\n'));
  console.error(`Wrote ${displayPath(out)}`);
  process.exitCode = rows.some((r) => r.error) ? 2 : rows.some((r) => !r.pass) ? 1 : 0;
}

run(main);
