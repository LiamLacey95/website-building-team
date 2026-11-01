#!/usr/bin/env node
/**
 * bootstrap.mjs: one-shot setup and health check for the website building team kit.
 *
 * Node 20+, no npm dependencies, Windows and Linux. Every step is idempotent; re-run any time.
 *
 *   node scripts/bootstrap.mjs                      interactive setup
 *   node scripts/bootstrap.mjs --yes --comfyui-path <dir>
 *   node scripts/bootstrap.mjs --check              health report only
 *   node scripts/bootstrap.mjs --help
 *
 * Steps: 1 prerequisites, 2 team.config.json, 3 Node tooling + Playwright Chromium, 4 Impeccable,
 * 5 ComfyUI (connect or install, then configure), 6 worktrees folder, 7 health check.
 * Config keys are documented in scripts/README.md.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const NODE_MIN = 20;
const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG_FILE = path.join(REPO, 'team.config.json');
const EXAMPLE_FILE = path.join(REPO, 'team.config.example.json');
const IS_WIN = process.platform === 'win32';
const NODE_TOOL_DIRS = ['tools', 'docs/review/tools'];
const SELFTESTS = ['tools/selftest.mjs', 'docs/review/tools/selftest.mjs'];
const COMFY_INSTALLER = 'artgen/setup/install_comfyui.py';
const COMFY_CONFIGURE = 'artgen/setup/configure.py';
// Where `impeccable install --scope=project` puts each provider's skill.
const IMPECCABLE_DIRS = { claude: '.claude/skills/impeccable', codex: '.agents/skills/impeccable' };
// Fallback pin; the real pin is tools/package.json, so the installer matches the committed skill and engine.
const IMPECCABLE_FALLBACK_VERSION = '4.8.0';
const IMPECCABLE_LAUNCHER = '.claude/skills/impeccable/scripts/impeccable';
const GB = 1024 ** 3;
const DISK_NEEDED_COMFY_GB = 40;
const DISK_NEEDED_BASE_GB = 3;

// Kit policy: Impeccable telemetry is off unless the user explicitly sets the variable. Every child process inherits it.
process.env.IMPECCABLE_NO_TELEMETRY ??= '1';

if (Number(process.versions.node.split('.')[0]) < NODE_MIN) {
  console.error(`Node ${NODE_MIN}+ is required (found ${process.versions.node}). Install the LTS from https://nodejs.org/`);
  process.exit(1);
}

// ---------------------------------------------------------------------------------------------
// Flags
// ---------------------------------------------------------------------------------------------

const FLAGS = [
  ['help', 'bool', 'Show this help.'],
  ['check', 'bool', 'Health report only; changes nothing. Exit 1 if anything is red.'],
  ['yes', 'bool', 'Non-interactive: take flags, then the existing config, then defaults. Implied when stdin is not a terminal.'],
  ['dry-run', 'bool', 'Print what would happen without changing anything.'],
  ['comfyui-path', 'dir', 'Connect an existing ComfyUI install and verify it.'],
  ['install-comfyui', 'dir', 'Install a fresh ComfyUI (venv, CUDA torch, ~31 GB of models; needs HF_TOKEN) into <dir>.'],
  ['skip-comfyui', 'bool', 'Leave ComfyUI unconfigured (image generation unavailable).'],
  ['comfyui-python', 'file', "Python of ComfyUI's venv. Default: auto-detected inside the ComfyUI folder."],
  ['comfyui-port', 'n', 'ComfyUI port. Default 8188.'],
  ['comfyui-profile', '12gb|8gb', 'Workflow tuning. Default: from GPU VRAM (under 11 GB -> 8gb).'],
  ['models-only', 'bool', 'With a connected ComfyUI: download any missing models.'],
  ['worktrees-dir', 'dir', 'Folder for variant worktrees. Default: sibling "<repo-folder>.worktrees".'],
  ['project', 'slug', 'Active project slug (folder under projects/). Default: keep current, else none.'],
  ['providers', 'list', 'Harness providers for Impeccable, comma-separated. Default: claude,codex.'],
  ['python', 'exe', 'System Python 3.11/3.12 used for the ComfyUI scripts. Default: auto-detected.'],
  ['skip-node', 'bool', 'Skip npm install in tools/ and docs/review/tools/.'],
  ['skip-playwright', 'bool', 'Skip the Playwright Chromium download.'],
  ['with-deps', 'bool', 'Linux: also install Chromium system libraries (playwright --with-deps, needs sudo).'],
  ['skip-impeccable', 'bool', 'Skip the Impeccable install.'],
  ['reinstall', 'bool', 'Re-run npm and Impeccable installs even when they look current.'],
  ['selftest', 'bool', "After setup, run the Front-end and Review self-tests and ComfyUI's smoke test."],
];

function parseFlags(argv) {
  const types = Object.fromEntries(FLAGS.map(([n, t]) => [n, t]));
  const opts = {};
  for (let i = 0; i < argv.length; i++) {
    let a = argv[i];
    if (a === '-h') a = '--help';
    if (a === '-y') a = '--yes';
    if (!a.startsWith('--')) die(`Unexpected argument "${a}". See --help.`);
    let [name, value] = a.slice(2).split(/=(.*)/s, 2);
    if (!(name in types)) die(`Unknown flag --${name}. See --help.`);
    if (types[name] === 'bool') { opts[name] = true; continue; }
    if (value === undefined) {
      value = argv[++i];
      if (value === undefined || value.startsWith('--')) die(`--${name} needs a value.`);
    }
    opts[name] = value;
  }
  if (opts['comfyui-path'] && opts['install-comfyui']) die('Use either --comfyui-path or --install-comfyui, not both.');
  if (opts['skip-comfyui'] && (opts['comfyui-path'] || opts['install-comfyui'])) die('--skip-comfyui conflicts with the other ComfyUI flags.');
  if (opts['comfyui-port'] && !/^\d+$/.test(opts['comfyui-port'])) die('--comfyui-port must be a number.');
  if (opts['comfyui-profile'] && !['12gb', '8gb'].includes(opts['comfyui-profile'])) die('--comfyui-profile must be 12gb or 8gb.');
  return opts;
}

function printHelp() {
  const rows = FLAGS.map(([n, t, d]) => [`--${n}${t === 'bool' ? '' : ` <${t}>`}`, d]);
  const w = Math.max(...rows.map(([f]) => f.length)) + 2;
  console.log(`Website building team: bootstrap and health check

Usage: node scripts/bootstrap.mjs [flags]

Interactive by default. Each step is idempotent, so re-running is safe.
Steps: prerequisites, team.config.json, Node tooling and Playwright Chromium,
Impeccable, ComfyUI (connect or install, then configure), worktrees folder, health check.

Flags:
${rows.map(([f, d]) => `  ${f.padEnd(w)}${d}`).join('\n')}

Examples:
  node scripts/bootstrap.mjs --yes --comfyui-path "D:/AI/ComfyUI"
  node scripts/bootstrap.mjs --install-comfyui "D:/AI/ComfyUI" --dry-run
  node scripts/bootstrap.mjs --check
`);
}

// ---------------------------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------------------------

const COLOR = process.stdout.isTTY && !process.env.NO_COLOR;
const paint = (code, s) => (COLOR ? `\x1b[${code}m${s}\x1b[0m` : s);
const LABEL = { green: paint(32, '[ OK ]'), amber: paint(33, '[WARN]'), red: paint(31, '[FAIL]'), info: paint(36, '[INFO]') };

function die(msg) { console.error(paint(31, `Error: ${msg}`)); process.exit(1); }
function heading(n, title) { console.log(`\n${paint(1, `== ${n}. ${title}`)}`); }
function note(msg) { console.log(`  ${msg}`); }

/** A health item: { item, status: green|amber|red|info, detail, fix }. */
const result = (item, status, detail = '', fix = '') => ({ item, status, detail, fix });

function printResults(results) {
  const w = Math.min(36, Math.max(...results.map((r) => r.item.length))) + 2;
  for (const r of results) {
    const item = r.item.length > w - 2 ? `${r.item.slice(0, w - 3)}…` : r.item;
    console.log(`  ${LABEL[r.status]} ${item.padEnd(w)}${r.detail}`);
    if (r.fix && r.status !== 'green' && r.status !== 'info') console.log(`         ${' '.repeat(w)}${paint(2, `-> ${r.fix}`)}`);
  }
}

// ---------------------------------------------------------------------------------------------
// Processes
// ---------------------------------------------------------------------------------------------

let DRY = false;

// npm/npx are .cmd shims on Windows and must go through the shell; quote arguments ourselves.
const viaShell = (cmd) => IS_WIN && (/^(npm|npx)$/i.test(cmd) || /\.cmd$/i.test(cmd));
const quote = (a) => (/[\s"&|<>^()]/.test(a) ? `"${a.replace(/"/g, '""')}"` : a);
const display = (cmd, args) => [cmd, ...args].map(quote).join(' ');

function spawnArgs(cmd, args, opts) {
  return viaShell(cmd)
    ? [display(cmd, args), [], { ...opts, shell: true }]
    : [cmd, args, opts];
}

/** Run and capture output. Never throws; returns { ok, code, out, err }. */
function capture(cmd, args = [], { cwd = REPO, timeout = 60_000, env = process.env } = {}) {
  const r = spawnSync(...spawnArgs(cmd, args, { cwd, timeout, env, encoding: 'utf8', windowsHide: true }));
  return { ok: r.status === 0 && !r.error, code: r.status, out: (r.stdout || '').trim(), err: (r.stderr || r.error?.message || '').trim() };
}

/** Run with output streamed to the terminal. Honours --dry-run. Returns true on exit code 0. */
function stream(cmd, args = [], { cwd = REPO, env } = {}) {
  const where = cwd === REPO ? '' : `  (in ${path.relative(REPO, cwd) || cwd})`;
  if (DRY) { note(paint(36, `[dry-run] ${display(cmd, args)}${where}`)); return true; }
  note(paint(2, `$ ${display(cmd, args)}${where}`));
  const r = spawnSync(...spawnArgs(cmd, args, { cwd, stdio: 'inherit', env: env ? { ...process.env, ...env } : process.env }));
  if (r.error) note(paint(31, r.error.message));
  return r.status === 0 && !r.error;
}

function portOpen(port, host = '127.0.0.1', ms = 1000) {
  return new Promise((resolve) => {
    const s = net.connect({ port, host });
    const done = (v) => { s.destroy(); resolve(v); };
    s.setTimeout(ms, () => done(false));
    s.once('connect', () => done(true));
    s.once('error', () => done(false));
  });
}

// ---------------------------------------------------------------------------------------------
// Paths and config
// ---------------------------------------------------------------------------------------------

const fwd = (p) => p.replace(/\\/g, '/');
const abs = (p) => fwd(path.resolve(REPO, p));
const rel = (p) => path.join(REPO, p);
const exists = (p) => fs.existsSync(p);
const defaultWorktrees = () => fwd(path.join(path.dirname(REPO), `${path.basename(REPO)}.worktrees`));

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return null; }
}

function defaults() {
  const example = readJson(EXAMPLE_FILE) ?? {};
  return {
    version: 1,
    activeProject: '',
    worktreesDir: '',
    harnessProviders: ['claude', 'codex'],
    ...example,
    comfyui: { path: '', python: '', port: 8188, profile: '12gb', ...(example.comfyui ?? {}) },
  };
}

/** Existing config merged over defaults. Unknown keys written by other tools are preserved. */
function loadConfig() {
  const d = defaults();
  const cur = readJson(CONFIG_FILE) ?? {};
  return { ...d, ...cur, comfyui: { ...d.comfyui, ...(cur.comfyui ?? {}) } };
}

function writeConfig(cfg) {
  const text = `${JSON.stringify(cfg, null, 2)}\n`;
  if (exists(CONFIG_FILE) && fs.readFileSync(CONFIG_FILE, 'utf8') === text) { note('team.config.json unchanged.'); return; }
  if (DRY) { note(paint(36, `[dry-run] would write team.config.json:\n${text}`)); return; }
  fs.writeFileSync(CONFIG_FILE, text);
  note(`Wrote ${fwd(CONFIG_FILE)}`);
}

const worktreesOf = (cfg) => (cfg.worktreesDir ? abs(cfg.worktreesDir) : defaultWorktrees());

/** Python inside a ComfyUI folder: venv, .venv, or the Windows portable build's python_embeded. */
function detectComfyPython(dir) {
  const c = IS_WIN
    ? ['venv/Scripts/python.exe', '.venv/Scripts/python.exe', 'python_embeded/python.exe', '../python_embeded/python.exe']
    : ['venv/bin/python', '.venv/bin/python', 'venv/bin/python3', '.venv/bin/python3'];
  const hit = c.map((p) => path.resolve(dir, p)).find(exists);
  return hit ? fwd(hit) : '';
}

function listProjects() {
  try {
    return fs.readdirSync(rel('projects'), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
  } catch { return []; }
}

// ---------------------------------------------------------------------------------------------
// Step 1: prerequisites
// ---------------------------------------------------------------------------------------------

const verOf = (s) => (s.match(/(\d+)\.(\d+)(?:\.(\d+))?/) || []).slice(1).map((n) => Number(n || 0));

/** Find a system Python, preferring 3.12 then 3.11. Returns { exe, version, status } or null. */
function findPython(override) {
  const probe = ['-c', 'import sys;print("%d.%d.%d" % sys.version_info[:3]);print(sys.executable)'];
  const candidates = override
    ? [[override, []]]
    : IS_WIN
      ? [['py', ['-3.12']], ['py', ['-3.11']], ['python3.12', []], ['python3.11', []], ['python3', []], ['python', []], ['py', ['-3']]]
      : [['python3.12', []], ['python3.11', []], ['python3', []], ['python', []]];
  let fallback = null;
  for (const [cmd, pre] of candidates) {
    const r = capture(cmd, [...pre, ...probe], { timeout: 15_000 });
    if (!r.ok) continue;
    const [verLine, exe] = r.out.split(/\r?\n/);
    // Skip the Windows Store alias stub, which "runs" but is not a real interpreter.
    if (!exe || /WindowsApps/i.test(exe)) continue;
    const [maj, min] = verOf(verLine);
    const found = { exe: fwd(exe.trim()), version: verLine.trim() };
    if (maj === 3 && (min === 11 || min === 12)) return { ...found, status: 'green' };
    if (maj === 3 && min >= 10 && !fallback) fallback = { ...found, status: 'amber' };
    if (override) return { ...found, status: 'red' };
  }
  return fallback;
}

function freeBytes(dir) {
  let d = path.resolve(dir);
  while (!exists(d) && path.dirname(d) !== d) d = path.dirname(d);
  try { const s = fs.statfsSync(d); return { dir: d, free: s.bavail * s.bsize }; } catch { return null; }
}

function checkPrereqs(opts, { comfyTarget } = {}) {
  const out = [];

  const g = capture('git', ['--version']);
  out.push(g.ok
    ? result('git', 'green', g.out.replace(/^git version /, ''))
    : result('git', 'red', 'not found', 'Install Git: https://git-scm.com/downloads'));

  out.push(result('Node.js', 'green', process.versions.node));
  const npm = capture('npm', ['--version']);
  out.push(npm.ok ? result('npm', 'green', npm.out) : result('npm', 'red', 'not found', 'Reinstall Node.js from https://nodejs.org/ (npm ships with it)'));

  const py = findPython(opts.python);
  if (!py) out.push(result('Python', 'red', 'no Python 3.10+ found', 'Install Python 3.12 from https://www.python.org/downloads/ (tick "Add to PATH" / install the py launcher)'));
  else out.push(result('Python', py.status, `${py.version}  ${py.exe}`,
    py.status === 'amber' ? 'Works for the scripts, but install Python 3.11 or 3.12 for a fresh ComfyUI venv' : 'Use Python 3.11 or 3.12'));

  const gh = capture('gh', ['--version']);
  if (!gh.ok) out.push(result('gh (optional)', 'amber', 'not found', 'Optional, for GitHub: https://cli.github.com/'));
  else {
    const auth = capture('gh', ['auth', 'status'], { timeout: 20_000 });
    out.push(result('gh (optional)', auth.ok ? 'green' : 'amber', `${verOf(gh.out).join('.')}${auth.ok ? ', signed in' : ', not signed in'}`, 'Run: gh auth login'));
  }

  let vram = null;
  const smi = capture('nvidia-smi', ['--query-gpu=name,memory.total,driver_version', '--format=csv,noheader,nounits']);
  if (!smi.ok || !smi.out) {
    out.push(result('NVIDIA GPU', 'amber', 'nvidia-smi not found', 'Image generation needs an NVIDIA GPU with 8 GB+ VRAM and a current driver; everything else works without one'));
  } else {
    const [name, mem, driver] = smi.out.split(/\r?\n/)[0].split(',').map((s) => s.trim());
    vram = Number(mem) / 1024;
    const status = vram >= 11 ? 'green' : vram >= 7.5 ? 'amber' : 'red';
    out.push(result('NVIDIA GPU', status, `${name}, ${vram.toFixed(1)} GB VRAM, driver ${driver}`,
      status === 'amber' ? '8 GB tier: use the distilled Klein or Z-Image workflows at 1 MP (artgen/README.md)' : 'Under 8 GB VRAM is not supported for local image generation'));
  }

  for (const [label, dir, need] of [
    ['Disk (repo)', REPO, DISK_NEEDED_BASE_GB],
    ...(comfyTarget ? [['Disk (ComfyUI)', comfyTarget, DISK_NEEDED_COMFY_GB]] : []),
  ]) {
    const f = freeBytes(dir);
    if (!f) { out.push(result(label, 'amber', 'could not read free space')); continue; }
    const free = f.free / GB;
    out.push(result(label, free >= need ? 'green' : free >= need / 2 ? 'amber' : 'red',
      `${free.toFixed(0)} GB free on ${fwd(f.dir)}`, `Needs about ${need} GB free`));
  }
  return { results: out, python: py, vram };
}

// ---------------------------------------------------------------------------------------------
// Prompts
// ---------------------------------------------------------------------------------------------

let rl = null;
async function ask(question, def = '') {
  rl ??= readline.createInterface({ input: process.stdin, output: process.stdout });
  const a = (await rl.question(`  ${question}${def ? ` [${def}]` : ''}: `)).trim();
  return a || def;
}
async function confirm(question, def = true) {
  const a = (await ask(`${question} (${def ? 'Y/n' : 'y/N'})`)).toLowerCase();
  return a ? a.startsWith('y') : def;
}

// ---------------------------------------------------------------------------------------------
// Step 2: config
// ---------------------------------------------------------------------------------------------

/** Decide the ComfyUI mode and every config value. Precedence: flag, existing config, prompt, default. */
async function resolveSettings(opts, cfg, interactive, vram) {
  let comfyMode;
  if (opts['install-comfyui']) comfyMode = 'install';
  else if (opts['comfyui-path']) comfyMode = 'connect';
  else if (opts['skip-comfyui']) comfyMode = 'skip';
  else if (cfg.comfyui.path) comfyMode = 'connect';
  else if (interactive) {
    note('ComfyUI generates the concept art. Options: [c] connect an existing install, [i] install a fresh one (~31 GB download, needs a Hugging Face token), [s] skip for now.');
    const a = (await ask('ComfyUI', 'c')).toLowerCase()[0];
    comfyMode = a === 'i' ? 'install' : a === 's' ? 'skip' : 'connect';
  } else comfyMode = 'skip';

  let comfyPath = opts['install-comfyui'] || opts['comfyui-path'] || cfg.comfyui.path;
  if (comfyMode !== 'skip' && !comfyPath) {
    const def = comfyMode === 'install' ? fwd(path.join(path.dirname(REPO), 'ComfyUI')) : '';
    comfyPath = interactive ? await ask(comfyMode === 'install' ? 'Install ComfyUI into' : 'Path to your ComfyUI folder', def) : def;
    if (!comfyPath) { note('No ComfyUI path given; skipping ComfyUI.'); comfyMode = 'skip'; }
  }
  if (comfyMode !== 'skip') {
    if (abs(comfyPath) !== cfg.comfyui.path) cfg.comfyui.python = '';
    cfg.comfyui.path = abs(comfyPath);
    if (!cfg.comfyui.python) cfg.comfyui.python = detectComfyPython(cfg.comfyui.path);
  }
  if (opts['comfyui-python']) cfg.comfyui.python = abs(opts['comfyui-python']);
  if (opts['comfyui-port']) cfg.comfyui.port = Number(opts['comfyui-port']);
  if (opts['comfyui-profile']) cfg.comfyui.profile = opts['comfyui-profile'];
  else if (!readJson(CONFIG_FILE)?.comfyui?.profile && vram !== null) cfg.comfyui.profile = vram < 11 ? '8gb' : '12gb';

  if (opts['worktrees-dir']) cfg.worktreesDir = abs(opts['worktrees-dir']);
  else if (!cfg.worktreesDir) cfg.worktreesDir = interactive ? abs(await ask('Folder for variant worktrees', defaultWorktrees())) : defaultWorktrees();

  if (opts.providers) cfg.harnessProviders = opts.providers.split(',').map((s) => s.trim()).filter(Boolean);
  else if (interactive && !exists(CONFIG_FILE)) {
    cfg.harnessProviders = (await ask('Harness providers for Impeccable (comma-separated)', cfg.harnessProviders.join(',')))
      .split(',').map((s) => s.trim()).filter(Boolean);
  }

  if (opts.project !== undefined) cfg.activeProject = opts.project;
  else if (interactive && !exists(CONFIG_FILE)) {
    const projects = listProjects();
    if (projects.length) note(`Existing projects: ${projects.join(', ')}. Leave blank if the team has no project yet.`);
    cfg.activeProject = await ask('Active project slug', cfg.activeProject);
  }
  return comfyMode;
}

// ---------------------------------------------------------------------------------------------
// Step 3: Node tooling
// ---------------------------------------------------------------------------------------------

/** npm writes node_modules/.package-lock.json after every successful install. */
function nodeModulesState(dir) {
  const d = rel(dir);
  if (!exists(path.join(d, 'package.json'))) return 'absent';
  const hidden = path.join(d, 'node_modules', '.package-lock.json');
  if (!exists(hidden)) return 'missing';
  const t = fs.statSync(hidden).mtimeMs;
  const newer = ['package.json', 'package-lock.json'].some((f) => exists(path.join(d, f)) && fs.statSync(path.join(d, f)).mtimeMs > t);
  return newer ? 'stale' : 'current';
}

function installNodeTools(opts) {
  let ok = true;
  for (const dir of NODE_TOOL_DIRS) {
    const state = nodeModulesState(dir);
    if (state === 'absent') { note(`${dir}/: no package.json, skipped.`); continue; }
    if (state === 'current' && !opts.reinstall) { note(`${dir}/: node_modules current.`); continue; }
    const hasLock = exists(path.join(rel(dir), 'package-lock.json'));
    ok = stream('npm', [hasLock ? 'ci' : 'install', '--no-audit', '--no-fund'], { cwd: rel(dir) }) && ok;
  }
  return ok;
}

function chromiumPath() {
  const r = capture('node', ['-e', "process.stdout.write(require('playwright').chromium.executablePath())"], { cwd: rel('tools') });
  return r.ok && r.out && exists(r.out) ? r.out : '';
}

function installChromium(opts) {
  if (!exists(rel('tools/node_modules/playwright'))) { note('Playwright is not installed in tools/; skipping Chromium.'); return DRY; }
  if (chromiumPath() && !opts.reinstall) { note('Playwright Chromium already installed.'); return true; }
  const args = ['playwright', 'install', 'chromium'];
  if (opts['with-deps'] && !IS_WIN) args.push('--with-deps');
  return stream('npx', args, { cwd: rel('tools') });
}

// ---------------------------------------------------------------------------------------------
// Step 4: Impeccable
// ---------------------------------------------------------------------------------------------

function impeccableVersion() {
  const v = readJson(rel('tools/package.json'))?.devDependencies?.impeccable ?? '';
  return v.replace(/^[\^~=v]+/, '') || IMPECCABLE_FALLBACK_VERSION;
}

/**
 * The skills are committed, so a fresh clone normally needs no install. The version is pinned because a bare
 * `npx impeccable` resolves a stale global first. --no-hooks: the team's gated hook is committed in
 * .claude/settings.json and .codex/hooks.json; never run `impeccable hooks on` or `doctor --fix` from here.
 */
function installImpeccable(cfg, opts) {
  const providers = cfg.harnessProviders;
  if (!providers.length) { note('No harness providers configured; skipping Impeccable.'); return true; }
  const missing = providers.filter((p) => !IMPECCABLE_DIRS[p] || !exists(rel(IMPECCABLE_DIRS[p])));
  let ok = true;
  if (!missing.length && !opts.reinstall) note(`Impeccable skills present for ${providers.join(', ')} (committed).`);
  else {
    ok = stream('npx', ['--yes', `impeccable@${impeccableVersion()}`, 'install', '--scope=project',
      `--providers=${providers.join(',')}`, '--no-hooks', '-y', ...(opts.reinstall ? ['--force'] : [])]);
  }
  if (!exists(rel(IMPECCABLE_LAUNCHER))) return ok;
  // Warm the engine: a checksum-verified binary cached in ~/.impeccable (network needed once).
  ok = stream(...impeccable('--version')) && ok;
  // Kit policy: telemetry off, persisted per machine in ~/.impeccable/config.json (idempotent).
  ok = stream(...impeccable('telemetry', 'off')) && ok;
  return ok;
}

/** The committed skill launcher, as [cmd, args]. */
function impeccable(...args) {
  return IS_WIN ? [rel(`${IMPECCABLE_LAUNCHER}.cmd`), args] : ['sh', [rel(IMPECCABLE_LAUNCHER), ...args]];
}

// ---------------------------------------------------------------------------------------------
// Step 5: ComfyUI
// ---------------------------------------------------------------------------------------------

const VERIFY_STATUS = { 0: 'green', 3: 'amber', 1: 'red' };
const ITEM_STATUS = { ok: 'green', pass: 'green', green: 'green', warn: 'amber', amber: 'amber', fail: 'red', red: 'red', info: 'info' };

/**
 * Concept's verifier as health items: install_comfyui.py --verify <dir> [--quick] --json.
 * Exit codes: 0 green, 3 amber (optional models missing, ComfyUI newer than pinned), 1 red, 2 usage error.
 */
function comfyVerify(cfg, py, { quick = false } = {}) {
  if (!exists(rel(COMFY_INSTALLER))) return [result('ComfyUI models', 'amber', `${COMFY_INSTALLER} not found; models not verified`)];
  const args = [rel(COMFY_INSTALLER), '--verify', cfg.comfyui.path, ...(quick ? ['--quick'] : []), '--json'];
  const r = capture(py, args, { timeout: 900_000 });
  let parsed = null;
  try { parsed = JSON.parse(r.out); } catch { /* not JSON */ }
  const items = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.items) ? parsed.items : Array.isArray(parsed?.checks) ? parsed.checks : null;
  const fix = `Run: python ${COMFY_INSTALLER} --verify "${cfg.comfyui.path}"`;
  if (items?.length) {
    return items.map((it) => result(`ComfyUI: ${it.item ?? it.name ?? it.file ?? '?'}`,
      ITEM_STATUS[String(it.status).toLowerCase()] ?? 'amber', it.detail ?? it.message ?? '', it.fix ?? (it.status === 'ok' ? '' : fix)));
  }
  const tail = (r.err || r.out).split(/\r?\n/).filter(Boolean).slice(-1)[0] ?? '';
  return [result(`ComfyUI verify${quick ? ' (quick)' : ''}`, VERIFY_STATUS[r.code] ?? 'red', tail || `exit ${r.code}`, fix)];
}

function comfyConfigureCheck(py) {
  if (!exists(rel(COMFY_CONFIGURE))) return result('ComfyUI launchers', 'amber', `${COMFY_CONFIGURE} not found`);
  const r = capture(py, [rel(COMFY_CONFIGURE), '--check'], { timeout: 60_000 });
  const tail = (r.out || r.err).split(/\r?\n/).filter(Boolean).slice(-1)[0] ?? '';
  return result('ComfyUI launchers', r.ok ? 'green' : 'red', tail || (r.ok ? 'configured' : `exit ${r.code}`), `Run: python ${COMFY_CONFIGURE}`);
}

const HF_HELP = [
  'The FLUX 3 Klein models come from a gated Hugging Face repo. Before installing:',
  '  1. Create a free account at https://huggingface.co/join',
  '  2. Click "Agree" once at https://huggingface.co/black-forest-labs/flux-3-image-klein-comfy',
  '  3. Create a read token at https://huggingface.co/settings/tokens and set it as HF_TOKEN',
  IS_WIN ? '     PowerShell: $env:HF_TOKEN = "hf_..."   (or setx HF_TOKEN hf_... and open a new terminal)' : '     export HF_TOKEN=hf_...',
  'Then re-run bootstrap. Total download is about 31 GB including optional files.',
];

/** Install-level checks that need nothing from artgen/setup. */
async function comfyBasics(cfg) {
  const out = [];
  const dir = cfg.comfyui.path;
  if (!dir) return [result('ComfyUI', 'amber', 'not configured', 'Re-run bootstrap with --comfyui-path <dir> or --install-comfyui <dir>')];
  if (!exists(path.join(dir, 'main.py'))) return [result('ComfyUI folder', 'red', `${dir} has no main.py`, 'Point --comfyui-path at the folder that contains main.py')];
  const verFile = path.join(dir, 'comfyui_version.py');
  const ver = exists(verFile) ? (fs.readFileSync(verFile, 'utf8').match(/__version__\s*=\s*["']([^"']+)/) || [])[1] : '';
  const head = capture('git', ['-C', dir, 'rev-parse', '--short', 'HEAD']);
  out.push(result('ComfyUI folder', 'green', `${dir}  (v${ver || '?'}${head.ok ? `, ${head.out}` : ''})`));

  const py = cfg.comfyui.python;
  if (!py || !exists(py)) {
    out.push(result('ComfyUI python', 'red', py ? `${py} not found` : 'no venv found', 'Set --comfyui-python to the python.exe of ComfyUI\'s venv'));
    return out;
  }
  const t = capture(py, ['-c', 'import sys,torch;print(sys.version.split()[0]);print(torch.__version__);print(torch.cuda.is_available())'], { timeout: 180_000 });
  if (!t.ok) out.push(result('ComfyUI python', 'red', `${py}: torch import failed`, (t.err.split(/\r?\n/).pop() || '').slice(0, 160)));
  else {
    const [pyv, torchv, cuda] = t.out.split(/\r?\n/);
    out.push(result('ComfyUI python', cuda === 'True' ? 'green' : 'amber', `Python ${pyv}, torch ${torchv}, CUDA ${cuda === 'True' ? 'available' : 'NOT available'}`,
      'Reinstall CUDA torch in the venv (see artgen/README.md)'));
  }
  const up = await portOpen(cfg.comfyui.port);
  out.push(result('ComfyUI server', up ? 'green' : 'info', up ? `running on port ${cfg.comfyui.port}` : `not running on port ${cfg.comfyui.port} (generate.py starts it on demand)`));
  return out;
}

async function setupComfy(mode, cfg, opts, sysPy, interactive) {
  if (mode === 'skip') { note('Skipped. Image generation stays unavailable until you re-run with --comfyui-path or --install-comfyui.'); return true; }
  const dir = cfg.comfyui.path;
  if (!sysPy) { note(paint(31, 'No system Python found; cannot run the ComfyUI setup scripts.')); return false; }
  const installer = exists(rel(COMFY_INSTALLER));
  const downloading = mode === 'install' || opts['models-only'];

  if (downloading) {
    if (!installer) { note(paint(31, `${COMFY_INSTALLER} is missing; cannot download.`)); return false; }
    if (!process.env.HF_TOKEN && !DRY) { HF_HELP.forEach((l) => note(paint(33, l))); return false; }
    const action = mode === 'install' ? '--install' : '--models-only';
    if (mode === 'install' && exists(path.join(dir, 'main.py'))) note(`ComfyUI already present in ${dir}; the installer verifies it and fills in what is missing.`);
    if (interactive && !DRY) {
      note('Planned changes and download sizes (dry run):');
      stream(sysPy, [rel(COMFY_INSTALLER), action, dir, '--dry-run']);
      if (!(await confirm('Start the download now?'))) { note('ComfyUI download skipped.'); return false; }
    }
    if (!stream(sysPy, [rel(COMFY_INSTALLER), action, dir, '--yes', ...(DRY ? ['--dry-run'] : [])])) return false;
  }

  if (!cfg.comfyui.python) cfg.comfyui.python = detectComfyPython(dir);
  if (!cfg.comfyui.python && !DRY) note(paint(33, `No venv python found in ${dir}; pass --comfyui-python.`));

  if (mode === 'connect' && !opts['models-only'] && installer) {
    note('Verifying the install and models (the first run hashes ~37 GB and takes a few minutes; later runs use a cache).');
    if (DRY) note(paint(36, `[dry-run] ${display(sysPy, [rel(COMFY_INSTALLER), '--verify', dir])}`));
    else {
      note(paint(2, `$ ${display(sysPy, [rel(COMFY_INSTALLER), '--verify', dir])}`));
      const code = spawnSync(sysPy, [rel(COMFY_INSTALLER), '--verify', dir], { cwd: REPO, stdio: 'inherit' }).status;
      if (code === 3) note(paint(33, 'Verified with warnings (optional models missing or ComfyUI newer than pinned).'));
      else if (code !== 0) { note(paint(31, 'Verification failed. To fetch missing models, re-run with --models-only.')); return false; }
    }
  }

  if (exists(rel(COMFY_CONFIGURE))) {
    // configure.py reads team.config.json, so the config must be on disk first.
    writeConfig(cfg);
    if (!stream(sysPy, [rel(COMFY_CONFIGURE)])) return false;
  } else note(`${COMFY_CONFIGURE} not found; launchers not generated.`);
  return true;
}

// ---------------------------------------------------------------------------------------------
// Step 7: health check
// ---------------------------------------------------------------------------------------------

async function healthCheck(opts) {
  const cfg = loadConfig();
  const haveConfig = exists(CONFIG_FILE);
  const groups = [];

  groups.push(['Prerequisites', checkPrereqs(opts).results]);

  const conf = [];
  conf.push(haveConfig
    ? (readJson(CONFIG_FILE) ? result('team.config.json', 'green', fwd(CONFIG_FILE)) : result('team.config.json', 'red', 'not valid JSON', 'Fix or delete it, then re-run bootstrap'))
    : result('team.config.json', 'red', 'missing', 'Run: node scripts/bootstrap.mjs'));
  const ignored = capture('git', ['check-ignore', '-q', 'team.config.json']).ok;
  conf.push(result('config git-ignored', ignored ? 'green' : 'red', ignored ? 'yes' : 'NO', 'Add team.config.json to .gitignore'));
  const slug = cfg.activeProject;
  conf.push(!slug
    ? result('activeProject', 'info', 'none yet (set at intake)')
    : exists(rel(`projects/${slug}`)) ? result('activeProject', 'green', slug) : result('activeProject', 'amber', `${slug} (projects/${slug}/ missing)`, 'Create the project folder or fix activeProject'));
  const wt = worktreesOf(cfg);
  conf.push(exists(wt) ? result('worktreesDir', 'green', wt) : result('worktreesDir', 'amber', `${wt} (missing)`, 'Run bootstrap (without --check) to create it'));
  groups.push(['Config', conf]);

  const tools = [];
  for (const dir of NODE_TOOL_DIRS) {
    const s = nodeModulesState(dir);
    if (s === 'absent') continue;
    tools.push(result(`${dir}/ packages`, s === 'current' ? 'green' : s === 'stale' ? 'amber' : 'red', s,
      s === 'stale' ? 'package files changed since install; re-run bootstrap' : 'Run bootstrap to install'));
  }
  const chrome = exists(rel('tools/node_modules/playwright')) ? chromiumPath() : '';
  tools.push(chrome ? result('Playwright Chromium', 'green', 'installed') : result('Playwright Chromium', 'red', 'missing', 'Run: npx playwright install chromium (in tools/)'));
  for (const p of cfg.harnessProviders) {
    const d = IMPECCABLE_DIRS[p];
    tools.push(!d
      ? result(`Impeccable (${p})`, 'amber', 'unknown provider; cannot check')
      : exists(rel(d)) ? result(`Impeccable (${p})`, 'green', d) : result(`Impeccable (${p})`, 'red', `${d} missing`, 'Run bootstrap, or: npx impeccable install --scope=project'));
  }
  if (cfg.harnessProviders.length) {
    // Run in tools/ so npx resolves the pinned devDependency, never a global install.
    const v = capture('npx', ['--no-install', 'impeccable', '--version'], { cwd: rel('tools'), timeout: 120_000 });
    const want = impeccableVersion();
    const got = v.ok ? v.out.split(/\r?\n/).pop().trim() : '';
    tools.push(!v.ok
      ? result('Impeccable CLI', 'red', 'npx impeccable --version failed in tools/', 'Run bootstrap to install tools/ packages')
      : result('Impeccable CLI', got.includes(want) ? 'green' : 'amber', got, `Expected ${want}; re-run bootstrap with --reinstall`));
  }
  if (exists(rel(IMPECCABLE_LAUNCHER))) {
    // Without our env override, so this reports the persistent per-machine setting.
    const { IMPECCABLE_NO_TELEMETRY, ...env } = process.env;
    const t = capture(...impeccable('telemetry', 'status'), { env, timeout: 120_000 });
    const off = t.ok && /^telemetry: off/m.test(t.out);
    tools.push(result('Impeccable telemetry', off ? 'green' : 'amber', off ? 'off (machine setting)' : (t.out.split(/\r?\n/)[0] || 'status failed'),
      'Run bootstrap, or: .claude/skills/impeccable/scripts/impeccable telemetry off'));
  }
  groups.push(['Tooling', tools]);

  const comfy = await comfyBasics(cfg);
  if (cfg.comfyui.path && cfg.comfyui.python && exists(cfg.comfyui.python)) {
    const py = findPython(opts.python)?.exe ?? cfg.comfyui.python;
    comfy.push(...comfyVerify(cfg, py, { quick: true }), comfyConfigureCheck(py));
  }
  groups.push(['ComfyUI', comfy]);

  console.log(`\n${paint(1, 'Health check')}  ${fwd(REPO)}`);
  for (const [name, items] of groups) { console.log(`\n ${paint(1, name)}`); printResults(items); }
  const all = groups.flatMap(([, items]) => items);
  const n = (s) => all.filter((r) => r.status === s).length;
  console.log(`\n  ${paint(32, `${n('green')} ok`)}, ${paint(33, `${n('amber')} warnings`)}, ${paint(31, `${n('red')} failures`)}`);
  return n('red') === 0;
}

// ---------------------------------------------------------------------------------------------
// Self-tests
// ---------------------------------------------------------------------------------------------

function runSelftests(cfg) {
  let ok = true;
  for (const t of SELFTESTS) {
    if (!exists(rel(t))) { note(`${t} not found; skipped.`); continue; }
    ok = stream('node', [rel(t)]) && ok;
  }
  if (cfg.comfyui.python && exists(rel('artgen/generate.py'))) ok = stream(cfg.comfyui.python, [rel('artgen/generate.py'), '--smoke']) && ok;
  return ok;
}

// ---------------------------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------------------------

async function main() {
  const opts = parseFlags(process.argv.slice(2));
  if (opts.help) { printHelp(); return 0; }
  DRY = Boolean(opts['dry-run']);
  if (opts.check) return (await healthCheck(opts)) ? 0 : 1;

  const interactive = !opts.yes && process.stdin.isTTY;
  if (!opts.yes && !process.stdin.isTTY) note('stdin is not a terminal: running non-interactively (as with --yes).');
  console.log(paint(1, `Website building team bootstrap${DRY ? ' (dry run)' : ''}`));
  console.log(`  Repo: ${fwd(REPO)}  |  ${os.type()} ${os.release()}  |  Node ${process.versions.node}`);
  const failed = [];

  heading(1, 'Prerequisites');
  const comfyTarget = opts['install-comfyui'] ? abs(opts['install-comfyui']) : undefined;
  const pre = checkPrereqs(opts, { comfyTarget });
  printResults(pre.results);
  const blocking = pre.results.filter((r) => r.status === 'red' && ['git', 'npm'].includes(r.item));
  if (blocking.length) die('Install the missing prerequisites above, then re-run.');
  if (comfyTarget && pre.results.some((r) => r.item === 'Disk (ComfyUI)' && r.status === 'red')) die('Not enough disk space for a ComfyUI install.');

  heading(2, 'team.config.json');
  const cfg = loadConfig();
  const comfyMode = await resolveSettings(opts, cfg, interactive, pre.vram);
  writeConfig(cfg);

  heading(3, 'Node tooling');
  if (opts['skip-node']) note('Skipped (--skip-node).');
  else if (!installNodeTools(opts)) failed.push('Node tooling');
  if (opts['skip-playwright']) note('Skipped Chromium (--skip-playwright).');
  else if (!installChromium(opts)) failed.push('Playwright Chromium');

  heading(4, 'Impeccable');
  if (opts['skip-impeccable']) note('Skipped (--skip-impeccable).');
  else if (!installImpeccable(cfg, opts)) failed.push('Impeccable');

  heading(5, 'ComfyUI');
  if (!(await setupComfy(comfyMode, cfg, opts, pre.python?.exe, interactive))) failed.push('ComfyUI');
  writeConfig(cfg);

  heading(6, 'Worktrees folder');
  const wt = worktreesOf(cfg);
  if (exists(wt)) note(`${wt} exists.`);
  else if (DRY) note(paint(36, `[dry-run] would create ${wt}`));
  else { fs.mkdirSync(wt, { recursive: true }); note(`Created ${wt}`); }

  if (opts.selftest) {
    heading('+', 'Self-tests');
    if (!runSelftests(cfg)) failed.push('Self-tests');
  }

  heading(7, 'Health check');
  const healthy = (await healthCheck(opts)) || DRY;

  rl?.close();
  if (failed.length) console.log(paint(31, `\nSteps that failed: ${failed.join(', ')}. Fix them and re-run; finished steps are skipped.`));
  else if (healthy) console.log(paint(32, '\nBootstrap complete. Reload your harness so the Impeccable skills are picked up.'));
  return failed.length || !healthy ? 1 : 0;
}

main().then((code) => process.exit(code), (err) => { console.error(err); process.exit(1); });
