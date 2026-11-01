#!/usr/bin/env node
// Lighthouse runner, mobile preset (Moto G Power emulation, simulated slow 4G), via installed Chrome.
//
//   node lighthouse.mjs https://example.com [more urls] [--urls list.txt]
//        [--runs 3] [--desktop] [--out report.md] [--no-html]
//
// Writes a Markdown summary (default docs/review/out/<stamp>-lighthouse.md) and one HTML report per URL
// in a folder beside it. With --runs N, each metric is the median across runs and the min-max spread is listed.
// Budget (PLAYBOOK quality bar): LCP < 2.5 s, CLS < 0.1, JS < 150 KB transferred. Exit 1 if any URL misses it.
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import * as chromeLauncher from 'chrome-launcher';
import { resolve, dirname, basename } from 'node:path';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { parseArgs, readUrls, stamp, writeOut, slug, esc, OUT_DIR } from './lib.mjs';

const BUDGET = { lcp: 2500, cls: 0.1, jsKB: 150 };
const METRICS = ['perf', 'a11y', 'bp', 'seo', 'fcp', 'lcp', 'cls', 'tbt', 'si', 'jsKB', 'totalKB'];

async function runOnce(url, desktop) {
  // A private profile dir per run; on Windows Chrome can hold it locked briefly, so cleanup is best-effort.
  const userDataDir = mkdtempSync(resolve(tmpdir(), 'lh-'));
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless=new', '--no-first-run', '--disable-extensions'],
    userDataDir,
  });
  try {
    const flags = { port: chrome.port, output: 'html', logLevel: 'error' };
    const res = await lighthouse(url, flags, desktop ? desktopConfig : undefined);
    return res;
  } finally {
    try { await chrome.kill(); } catch {}
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
    runtimeError: lhr.runtimeError?.message,
    warnings: lhr.runWarnings || [],
    version: lhr.lighthouseVersion,
  };
}

async function main() {
  const opts = parseArgs();
  const urls = readUrls(opts);
  const runs = Math.max(1, Number(opts.runs || 1));
  const desktop = !!opts.desktop;
  const out = resolve(opts.out || `${OUT_DIR}/${stamp()}-lighthouse.md`);
  const htmlDir = resolve(dirname(out), basename(out, '.md') + '-html');

  const rows = [];
  for (const url of urls) {
    const attempts = [];
    for (let i = 0; i < runs; i++) {
      try {
        const res = await runOnce(url, desktop);
        attempts.push({ s: summarise(res.lhr), html: res.report });
        console.error(`${url} run ${i + 1}/${runs}: perf ${attempts.at(-1).s.perf}`);
      } catch (e) {
        console.error(`${url} run ${i + 1}/${runs}: ERROR ${e.message}`);
      }
    }
    if (!attempts.length) { rows.push({ url, error: 'all runs failed' }); continue; }
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
    if (!opts['no-html']) htmlPath = writeOut(resolve(htmlDir, `${slug(url)}.html`), medianRun.html);
    rows.push({ url, ...med, spread, runs: attempts.length, htmlPath });
  }

  const sec = (ms) => (ms == null ? '?' : (ms / 1000).toFixed(2) + ' s');
  const ok = (cond) => (cond ? 'ok' : '**over**');
  let overBudget = false;
  const md = ['# Lighthouse', '',
    `Run: ${new Date().toISOString()}. Preset: ${desktop ? 'desktop' : 'mobile (default config: emulated Moto G Power, simulated slow 4G, 4x CPU slowdown)'}. Runs per URL: ${runs} (each figure is the median across runs). Lighthouse ${rows.find((r) => r.version)?.version ?? '?'}.`,
    `Budget: LCP < ${BUDGET.lcp / 1000} s, CLS < ${BUDGET.cls}, JS < ${BUDGET.jsKB} KB transferred.`, '',
    '| URL | Perf | A11y | Best pr. | SEO | FCP | LCP | CLS | TBT | Speed idx | JS KB | Total KB | Budget |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|---|'];
  for (const r of rows) {
    if (r.error || r.runtimeError) { overBudget = true; md.push(`| ${r.url} | ERROR: ${esc(r.error || r.runtimeError)} ||||||||||||`); continue; }
    const pass = r.lcp < BUDGET.lcp && r.cls < BUDGET.cls && r.jsKB < BUDGET.jsKB;
    if (!pass) overBudget = true;
    md.push(`| ${r.url} | ${r.perf} | ${r.a11y} | ${r.bp} | ${r.seo} | ${sec(r.fcp)} | ${sec(r.lcp)} ${ok(r.lcp < BUDGET.lcp)} | ${r.cls.toFixed(3)} ${ok(r.cls < BUDGET.cls)} | ${Math.round(r.tbt)} ms | ${sec(r.si)} | ${r.jsKB.toFixed(0)} ${ok(r.jsKB < BUDGET.jsKB)} | ${r.totalKB.toFixed(0)} | ${pass ? 'PASS' : '**FAIL**'} |`);
  }
  const reports = rows.filter((r) => r.htmlPath);
  if (reports.length) md.push('', 'Full reports:', ...reports.map((r) => `- ${r.url}: \`${r.htmlPath}\``));
  const multi = rows.filter((r) => r.runs > 1 && r.spread);
  if (multi.length) {
    md.push('', 'Spread across runs (min to max). A wide CLS or LCP range means the result is flaky; rerun or investigate:');
    for (const r of multi) {
      const s = r.spread;
      md.push(`- ${r.url} (${r.runs} runs): perf ${s.perf[0]} to ${s.perf[1]}, LCP ${sec(s.lcp[0])} to ${sec(s.lcp[1])}, CLS ${s.cls[0].toFixed(3)} to ${s.cls[1].toFixed(3)}, TBT ${Math.round(s.tbt[0])} to ${Math.round(s.tbt[1])} ms`);
    }
  }
  const warned = rows.filter((r) => r.warnings?.length);
  if (warned.length) md.push('', 'Run warnings:', ...warned.flatMap((r) => r.warnings.map((w) => `- ${r.url}: ${esc(w)}`)));
  md.push('');

  writeOut(out, md.join('\n'));
  console.log(md.join('\n'));
  console.error(`Wrote ${out}`);
  process.exitCode = overBudget ? 1 : 0;
}

main().catch((e) => { console.error(e); process.exit(2); });
