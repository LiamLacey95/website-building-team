#!/usr/bin/env node
// Review tooling self-test. New teams run it on first start; rerun after updating Node, Chrome or the tools.
//
//   node selftest.mjs [--site https://www.gov.uk] [--skip-lighthouse] [--out report.md]
//
// Runs each review tool the way a reviewer would, against a public site and the deliberately broken
// fixtures in fixtures/, and checks that the tool ran and detected what it should. Findings on the public
// site do not matter; only whether the tools work. Raw output goes to docs/review/out/selftest/ (git-ignored).
// Exit: 0 every check passed, 1 a check failed (a tool is broken or misconfigured), 2 the self-test itself crashed.
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseArgs, writeOut, esc, displayPath, run, TOOLS_DIR, REPO_ROOT } from './lib.mjs';

const opts = parseArgs();
const SITE = opts.site || 'https://www.gov.uk';
const OUT = resolve(TOOLS_DIR, '..', 'out', 'selftest');
const DETECTOR = resolve(REPO_ROOT, 'tools', 'node_modules', 'impeccable', 'cli', 'bin', 'cli.js');
const BAD = 'fixtures/bad.html';
const SLOP = 'fixtures/slop.html';
// Rules axe must report on fixtures/bad.html (each element there breaks exactly one of them).
const AXE_EXPECTED = ['button-name', 'image-alt', 'label', 'color-contrast', 'document-title', 'html-has-lang', 'link-name'];
const SLOP_EXPECTED = ['gradient-text', 'side-tab', 'overused-font'];

// Runs `node <args>` in the tools folder; resolves with { code, stdout, stderr, ms }. Never rejects.
function node(args, { timeoutMs = 300000, env = {} } = {}) {
  return new Promise((done) => {
    const t0 = Date.now();
    const child = spawn(process.execPath, args, { cwd: TOOLS_DIR, env: { ...process.env, ...env } });
    let stdout = '', stderr = '';
    child.stdout.on('data', (d) => (stdout += d));
    child.stderr.on('data', (d) => (stderr += d));
    const timer = setTimeout(() => { stderr += `\n[selftest] timed out after ${timeoutMs / 1000} s`; child.kill(); }, timeoutMs);
    child.on('error', (e) => { stderr += `\n[selftest] ${e.message}`; });
    child.on('close', (code) => { clearTimeout(timer); done({ code, stdout, stderr, ms: Date.now() - t0 }); });
  });
}

const readJson = (p) => { try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return null; } };
const lastLine = (s) => s.trim().split(/\r?\n/).filter(Boolean).at(-1) || '';

const checks = [];
async function check(name, expect, fn) {
  process.stderr.write(`- ${name} ... `);
  const t0 = Date.now();
  let ok = false, detail = '';
  try { [ok, detail] = await fn(); } catch (e) { detail = `selftest error: ${e.message}`; }
  const secs = ((Date.now() - t0) / 1000).toFixed(0);
  process.stderr.write(`${ok ? 'PASS' : 'FAIL'} (${secs} s)${ok ? '' : ' ' + detail}\n`);
  checks.push({ name, expect, ok, detail, secs });
}

async function main() {
  await check('Prerequisites', 'Node 20+, tool dependencies installed', async () => {
    const major = Number(process.versions.node.split('.')[0]);
    if (major < 20) return [false, `Node ${process.versions.node}; need 20 or later`];
    for (const dep of ['playwright', '@axe-core/playwright', 'lighthouse', 'chrome-launcher']) {
      if (!existsSync(resolve(TOOLS_DIR, 'node_modules', dep))) return [false, `${dep} missing; run npm ci in docs/review/tools`];
    }
    return [true, `Node ${process.versions.node}`];
  });

  await check('contrast: known ratios', '#767676/#fff = 4.54 pass, #777/#fff = 4.47 fail, exit 1', async () => {
    const r = await node(['contrast.mjs', '#767676:#ffffff', '#777777:#ffffff']);
    const good = r.stdout.includes('4.54:1 | pass') && r.stdout.includes('4.47:1 | **FAIL**');
    return [good && r.code === 1, `exit ${r.code}; ${good ? 'ratios right' : 'ratios wrong'}`];
  });

  await check('contrast: palette file', 'fixtures/govuk-palette.json, 10 pairs, exit 0 or 1', async () => {
    const r = await node(['contrast.mjs', '--palette', 'fixtures/govuk-palette.json', '--out', `${OUT}/contrast-palette.md`]);
    const rows = (r.stdout.match(/^\| .*:1 \|/gm) || []).length;
    return [r.code !== 2 && rows === 10, `exit ${r.code}; ${rows} pairs; ${lastLine(r.stdout)}`];
  });

  await check('contrast: rejects bad input', 'exit 2 on an invalid colour', async () => {
    const r = await node(['contrast.mjs', '#12:#fff']);
    return [r.code === 2, `exit ${r.code}`];
  });

  await check('axe: broken fixture', `finds ${AXE_EXPECTED.length} known rules, --fail-on serious exits 1`, async () => {
    const out = `${OUT}/a11y-fixture.md`;
    const r = await node(['a11y.mjs', BAD, '--fail-on', 'serious', '--out', out]);
    const res = readJson(out.replace(/\.md$/, '.json'));
    const found = new Set((res?.[0]?.violations || []).map((v) => v.id));
    const missing = AXE_EXPECTED.filter((id) => !found.has(id));
    return [r.code === 1 && !missing.length, `exit ${r.code}; found ${found.size} rules${missing.length ? '; missing ' + missing.join(', ') : ''}${res?.[0]?.error ? '; ' + res[0].error : ''}`];
  });

  await check(`axe: public site`, `${SITE} loads and is scanned at 390 and 1440 px`, async () => {
    const out = `${OUT}/a11y-site.md`;
    const r = await node(['a11y.mjs', SITE, '--viewports', '390,1440', '--out', out]);
    const res = readJson(out.replace(/\.md$/, '.json')) || [];
    const scanned = res.filter((x) => !x.error);
    const v = scanned.map((x) => `${x.width}px ${x.violations.length} violations, ${x.passes} rules passed`).join('; ');
    return [r.code === 0 && scanned.length === 2, `exit ${r.code}; ${v || lastLine(r.stderr)}`];
  });

  if (!opts['skip-lighthouse']) {
    await check('Lighthouse: broken fixture', 'audits a local file over http; accessibility score below 90', async () => {
      const out = `${OUT}/lighthouse-fixture.md`;
      const r = await node(['lighthouse.mjs', BAD, '--no-html', '--out', out]);
      const row = readJson(out.replace(/\.md$/, '.json'))?.[0];
      return [r.code !== 2 && row && !row.error && row.a11y < 90, `exit ${r.code}; ${row?.error || `a11y ${row?.a11y}, perf ${row?.perf}`}`];
    });

    await check('Lighthouse: public site', `${SITE} audited on the mobile preset`, async () => {
      const out = `${OUT}/lighthouse-site.md`;
      const r = await node(['lighthouse.mjs', SITE, '--out', out]);
      const row = readJson(out.replace(/\.md$/, '.json'))?.[0];
      const ok = r.code !== 2 && row && !row.error && typeof row.perf === 'number' && row.lcp > 0;
      return [ok, `exit ${r.code}; ${row?.error || `perf ${row?.perf}, LCP ${(row?.lcp / 1000).toFixed(2)} s, CLS ${row?.cls?.toFixed(3)}, budget ${row?.pass ? 'pass' : 'fail'}`}`];
    });
  }

  await check('Impeccable detector (from tools/)', `flags ${SLOP_EXPECTED.join(', ')} in the slop fixture`, async () => {
    if (!existsSync(DETECTOR)) return [false, 'not installed; run npm ci in tools/ (Front-end tooling)'];
    const r = await node([DETECTOR, 'detect', '--json', resolve(TOOLS_DIR, SLOP)], { timeoutMs: 120000, env: { IMPECCABLE_NO_TELEMETRY: '1' } });
    let found = [];
    try { found = [...new Set(JSON.parse(r.stdout).map((f) => f.antipattern))]; } catch {}
    const missing = SLOP_EXPECTED.filter((id) => !found.includes(id));
    return [r.code === 2 && !missing.length, `exit ${r.code}; ${found.length} rules fired${missing.length ? '; missing ' + missing.join(', ') : ''}`];
  });

  const passed = checks.filter((c) => c.ok).length;
  const md = ['# Review tools self-test', '',
    `Run: ${new Date().toISOString()}. Node ${process.versions.node} on ${process.platform}. Public site: ${SITE}.`, '',
    '| Check | Expected | Result | Detail | Time |', '|---|---|---|---|---|',
    ...checks.map((c) => `| ${esc(c.name)} | ${esc(c.expect)} | ${c.ok ? 'PASS' : '**FAIL**'} | ${esc(c.detail)} | ${c.secs} s |`), '',
    `**${passed}/${checks.length} checks passed.**${opts['skip-lighthouse'] ? ' Lighthouse skipped (--skip-lighthouse).' : ''}`, ''].join('\n');
  const out = resolve(opts.out || `${OUT}/selftest.md`);
  writeOut(out, md);
  console.log(md);
  console.error(`Wrote ${displayPath(out)}`);
  process.exitCode = passed === checks.length ? 0 : 1;
}

run(main);
