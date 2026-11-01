#!/usr/bin/env node
/**
 * selftest.mjs: one-command health check of the front-end tooling. New teams run it on first start;
 * scripts/bootstrap.mjs runs it as part of the health check.
 *
 *   node tools/selftest.mjs [--keep] [--skip-impeccable] [--letter z]
 *
 * Steps (each PASS/FAIL; exit code 1 if any fails):
 *   1. variants.mjs create: a temporary variant worktree (project "kit-selftest", gate g3, letter z)
 *   2. a throwaway static page in its projects/kit-selftest/web/, served by `variants.mjs dev`
 *   3. screenshot.mjs at 390/768/1440/1920 into a temp folder; four non-empty PNGs plus manifest
 *   4. contact-sheet.mjs over those shots; every <img> it references exists
 *   5. Impeccable: `npx impeccable detect` (pinned in tools/) is clean on the page and finds the planted
 *      anti-patterns in a bad fixture; the skill launcher answers; the team hook gate forwards a site
 *      edit and stays silent on a non-site edit
 *   6. cleanup: stop the server, remove the worktree and branch, delete temp files (unless --keep)
 *
 * Touches nothing in the main checkout: the page lives in the temporary worktree, the shots in the OS temp folder.
 */
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs, repoRoot, loadConfig, git } from './lib.mjs';

process.env.IMPECCABLE_NO_TELEMETRY = '1'; // kit default: Impeccable telemetry off
const args = parseArgs(process.argv.slice(2));
const here = path.dirname(fileURLToPath(import.meta.url));
const root = repoRoot();
const cfg = loadConfig(root);
const PROJECT = 'kit-selftest';
const letter = String(args.letter ?? 'z').toLowerCase();
const port = Number(cfg.variantBasePort ?? 4321) + letter.charCodeAt(0) - 97;
const branch = `variant/${PROJECT}-g3-${letter}-check`;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'frontend-selftest-'));
const shots = path.join(tmp, 'shots');
const results = [];
let server;

const node = (script, scriptArgs, opts = {}) =>
  spawnSync(process.execPath, [path.join(here, script), ...scriptArgs], { cwd: root, encoding: 'utf8', ...opts });
const quote = (a) => (/[\s"]/.test(a) ? `"${a.replace(/"/g, '\\"')}"` : a);
const npx = (cliArgs) =>
  spawnSync(`npx --no-install ${cliArgs.map(quote).join(' ')}`, { cwd: here, encoding: 'utf8', shell: true, timeout: 120000 });

function step(name, fn) {
  try {
    const detail = fn();
    results.push({ name, ok: true, detail: detail ?? '' });
    console.log(`PASS  ${name}${detail ? `: ${detail}` : ''}`);
    return true;
  } catch (err) {
    results.push({ name, ok: false, detail: err.message });
    console.log(`FAIL  ${name}: ${err.message}`);
    return false;
  }
}
const check = (cond, msg) => { if (!cond) throw new Error(msg); };
const out = (r) => `${r.stdout ?? ''}${r.stderr ?? ''}`.trim().split(/\r?\n/).slice(-3).join(' | ');

const PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Front-end selftest</title>
<style>
  :root { --ink: #16181d; --paper: #ffffff; --rule: #16181d; --space: clamp(1rem, 4vw, 3rem); }
  body { margin: 0; font: 1.125rem/1.6 Georgia, serif; color: var(--ink); background: var(--paper); }
  header, main { padding: var(--space); max-width: 70ch; }
  h1 { font-size: clamp(2rem, 6vw, 3.5rem); line-height: 1.1; margin: 0 0 .5rem; }
  section { border-top: 1px solid var(--rule); padding-top: 1rem; margin-top: 1.5rem; }
</style>
</head>
<body>
<header><h1>Tooling selftest</h1><p>A throwaway page served from a temporary variant worktree.</p></header>
<main>
  <section><h2>Screenshots</h2><p>Four widths, full page, reduced motion.</p></section>
  <section><h2>Contact sheet</h2><p>Grouped by route and width, variants side by side.</p></section>
</main>
</body>
</html>
`;
const BAD = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Bad</title>
<style>body{font-family:Inter,sans-serif;background:#0f0f1a;color:#ddd}
h1{background:linear-gradient(90deg,#8b5cf6,#ec4899);-webkit-background-clip:text;color:transparent}
.card{border-left:4px solid #8b5cf6;border-radius:16px;box-shadow:0 0 40px rgba(139,92,246,.6);padding:24px}</style></head>
<body><h1>Unlock the power of AI</h1><div class="card"><p>Seamlessly supercharge your workflow.</p></div></body></html>
`;

function cleanup() {
  if (server) {
    if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
    else server.kill();
  }
  if (args.keep) { console.log(`kept: worktree (${branch}) and ${tmp}`); return; }
  const existing = node('variants.mjs', ['path', letter, '--project', PROJECT]);
  if (existing.status === 0) node('variants.mjs', ['remove', letter, '--project', PROJECT, '--force']);
  try { git(['branch', '-D', branch], root); } catch {}
  fs.rmSync(tmp, { recursive: true, force: true });
}

async function waitForPort(url, ms) {
  const until = Date.now() + ms;
  while (Date.now() < until) {
    try { if ((await fetch(url)).ok) return true; } catch {}
    await new Promise((r) => setTimeout(r, 250));
  }
  return false;
}

async function main() {
  console.log(`front-end selftest · repo ${root} · worktrees ${cfg.worktreesDir} · port ${port}\n`);

  // A leftover from an aborted run would block `create`.
  if (node('variants.mjs', ['path', letter, '--project', PROJECT]).status === 0) {
    node('variants.mjs', ['remove', letter, '--project', PROJECT, '--force']);
  }

  let wt;
  if (!step('variants create', () => {
    const r = node('variants.mjs', ['create', letter, 'check', '--project', PROJECT, '--no-doc']);
    check(r.status === 0, out(r));
    wt = node('variants.mjs', ['path', letter, '--project', PROJECT]).stdout.trim();
    check(wt && fs.existsSync(wt), `worktree path missing: ${wt}`);
    check(path.resolve(path.dirname(wt)) === path.resolve(cfg.worktreesDir), `worktree not in worktreesDir: ${wt}`);
    return wt;
  })) return;

  const web = path.join(wt, 'projects', PROJECT, 'web');
  fs.mkdirSync(web, { recursive: true });
  fs.writeFileSync(path.join(web, 'index.html'), PAGE);
  fs.writeFileSync(path.join(tmp, 'bad.html'), BAD);

  if (!(await (async () => {
    server = spawn(process.execPath, [path.join(here, 'variants.mjs'), 'dev', letter, '--project', PROJECT], { cwd: root, stdio: 'ignore' });
    const up = await waitForPort(`http://127.0.0.1:${port}/`, 15000);
    return step('variants dev (static server)', () => { check(up, `nothing answered on port ${port} within 15 s`); return `http://127.0.0.1:${port}/`; });
  })())) return;

  step('screenshot 390/768/1440/1920', () => {
    const r = node('screenshot.mjs', ['--base', `http://127.0.0.1:${port}`, '--routes', 'home', '--label', branch, '--out', shots], { timeout: 180000 });
    check(r.status === 0, out(r));
    const pngs = fs.readdirSync(shots).filter((f) => f.endsWith('.png'));
    for (const w of [390, 768, 1440, 1920]) {
      const f = pngs.find((p) => p.endsWith(`-home-${w}.png`));
      check(f && fs.statSync(path.join(shots, f)).size > 1000, `missing or empty ${w}px shot`);
    }
    const manifest = JSON.parse(fs.readFileSync(path.join(shots, 'manifest.json'), 'utf8'));
    check(manifest.length === 4, `manifest has ${manifest.length} entries, expected 4`);
    return `${pngs.length} PNGs`;
  });

  step('contact sheet', () => {
    const sheet = path.join(shots, 'contact-sheet.html');
    const r = node('contact-sheet.mjs', ['--in', shots, '--out', sheet, '--title', 'Selftest']);
    check(r.status === 0, out(r));
    const srcs = [...fs.readFileSync(sheet, 'utf8').matchAll(/<img src="([^"]+)"/g)].map((m) => decodeURIComponent(m[1]));
    check(srcs.length === 4, `${srcs.length} images in sheet, expected 4`);
    for (const s of srcs) check(fs.existsSync(path.join(shots, s)), `broken image reference ${s}`);
    return `${srcs.length} images, all resolve`;
  });

  if (!args['skip-impeccable']) {
    step('impeccable detect: selftest page is clean', () => {
      const r = npx(['impeccable', 'detect', '--json', path.join(web, 'index.html')]);
      check(!r.error, `npx impeccable failed to start: ${r.error?.message}`);
      let findings;
      try { findings = JSON.parse(r.stdout); } catch { throw new Error(`unexpected output: ${out(r)}`); }
      check(findings.length === 0, `findings: ${findings.map((f) => f.antipattern).join(', ')}`);
      return `exit ${r.status}, 0 findings`;
    });
    step('impeccable detect: bad fixture is caught', () => {
      const r = npx(['impeccable', 'detect', '--json', path.join(tmp, 'bad.html')]);
      const ids = new Set(JSON.parse(r.stdout).map((f) => f.antipattern));
      for (const id of ['gradient-text', 'side-tab', 'overused-font']) check(ids.has(id), `expected ${id}; got ${[...ids].join(', ')}`);
      check(r.status !== 0, 'detect exited 0 despite findings');
      return `${ids.size} rules fired, exit ${r.status}`;
    });
    step('impeccable skill launcher', () => {
      const launcher = path.join(root, '.claude', 'skills', 'impeccable', 'scripts', 'impeccable');
      check(fs.existsSync(launcher), `${launcher} missing: run the Impeccable install (see tools/README.md)`);
      let r = spawnSync('sh', [launcher, '--version'], { cwd: root, encoding: 'utf8', timeout: 120000 });
      if (r.error && process.platform === 'win32') {
        r = spawnSync(process.env.ComSpec ?? 'cmd.exe', ['/d', '/s', '/c', `""${launcher}.cmd" --version"`],
          { cwd: root, encoding: 'utf8', timeout: 120000, windowsVerbatimArguments: true });
      }
      check(r.status === 0, `launcher failed: ${out(r)}`);
      return `engine ${r.stdout.trim()}`;
    });
    step('impeccable hook gate', () => {
      fs.writeFileSync(path.join(web, 'bad.html'), BAD);
      const payload = (file, session) => JSON.stringify({ session_id: session, hook_event_name: 'PostToolUse', tool_name: 'Write', cwd: root, tool_input: { file_path: file } });
      const site = node('impeccable-hook.mjs', [], { input: payload(path.join(web, 'bad.html'), 'selftest-site'), timeout: 30000 });
      check(site.status === 0, `hook exited ${site.status}`);
      check(/Design hook findings/.test(site.stdout), `no findings for a site edit in a worktree: ${out(site) || '(silent)'}`);
      const other = node('impeccable-hook.mjs', [], { input: payload(path.join(tmp, 'bad.html'), 'selftest-other'), timeout: 30000 });
      check(other.status === 0 && other.stdout.trim() === '', `non-site edit was not silent: ${out(other)}`);
      const stop = node('impeccable-hook.mjs', [], { input: JSON.stringify({ session_id: 'selftest-other', hook_event_name: 'Stop', cwd: root }), timeout: 30000 });
      check(stop.stdout.trim() === '', 'Stop was not silent for a session without site edits');
      node('impeccable-hook.mjs', [], { input: JSON.stringify({ session_id: 'selftest-site', hook_event_name: 'Stop', cwd: root }), timeout: 60000 });
      return 'site edit flagged, other edits silent';
    });
  }
}

try {
  await main();
} catch (err) {
  results.push({ name: 'selftest', ok: false, detail: err.message });
  console.log(`FAIL  selftest crashed: ${err.stack}`);
} finally {
  step('cleanup', () => {
    cleanup();
    if (args.keep) return 'skipped (--keep)';
    check(node('variants.mjs', ['path', letter, '--project', PROJECT]).status !== 0, 'worktree still registered');
    check(!git(['branch', '--list', branch], root), `branch ${branch} still exists`);
    return 'worktree, branch and temp files removed';
  });
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${failed.length ? `SELFTEST FAILED (${failed.length} of ${results.length})` : `SELFTEST PASSED (${results.length} checks)`}`);
process.exit(failed.length ? 1 : 0);
