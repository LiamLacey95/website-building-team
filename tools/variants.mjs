#!/usr/bin/env node
/**
 * variants.mjs: create, list, remove and serve design-variant worktrees.
 *
 * Worktrees live in "F:\ArtGen\Website Test.worktrees\variant-<gate>-<letter>-<slug>" on branch
 * "variant/<gate>-<letter>-<slug>" (playbook naming). Ports: A 4321, B 4322, C 4323, D 4324...
 *
 * Usage:
 *   node tools/variants.mjs create a bold-grid [--gate g3] [--from master] [--no-doc]
 *   node tools/variants.mjs list
 *   node tools/variants.mjs dev a              # one variant on its port (foreground; Ctrl+C stops)
 *   node tools/variants.mjs dev all            # every variant of the gate, each on its own port
 *   node tools/variants.mjs dev b --static web/dist   # serve a folder instead of `npm run dev`
 *   node tools/variants.mjs port c             # print the port for a letter
 *   node tools/variants.mjs remove a [--keep-branch] [--force]
 *
 * A variant is addressed by its letter (with --gate, default g3) or its full name/branch.
 *
 * dev: if <worktree>/web/package.json has a "dev" script, runs `npm run dev -- --port <port> --host 127.0.0.1`
 * in <worktree>/web (works for Astro, Vite and Next). Otherwise, or with --static <dir>, serves a static
 * folder (default <worktree>/web, falling back to the worktree root) with a built-in server.
 * Override the command with --cmd "<command>"; it receives PORT in the environment.
 *
 * create also writes a hypothesis stub at <worktree>/design/variants/<letter>-<slug>.md unless --no-doc.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { parseArgs, git, repoRoot } from './lib.mjs';

const BASE_PORT = 4321;
const args = parseArgs(process.argv.slice(2));
const [cmd, target, slugArg] = args._;
const gate = String(args.gate ?? 'g3').toLowerCase();
const root = repoRoot();
const wtRoot = `${root}.worktrees`;

const portFor = (letter) => BASE_PORT + (letter.toLowerCase().charCodeAt(0) - 97);

function listVariants() {
  const out = git(['worktree', 'list', '--porcelain'], root);
  const items = [];
  let cur = {};
  for (const line of out.split(/\r?\n/).concat('')) {
    if (line.startsWith('worktree ')) cur.path = path.resolve(line.slice(9));
    else if (line.startsWith('branch ')) cur.branch = line.slice(7).replace('refs/heads/', '');
    else if (line.startsWith('HEAD ')) cur.head = line.slice(5, 12);
    else if (line === '') {
      const m = cur.branch?.match(/^variant\/(g\d+)-([a-z])-(.+)$/);
      if (m) items.push({ ...cur, gate: m[1], letter: m[2], slug: m[3], name: `variant-${m[1]}-${m[2]}-${m[3]}`, port: portFor(m[2]) });
      cur = {};
    }
  }
  return items;
}

function resolveVariant(t) {
  if (!t) die('missing variant (letter, name or branch)');
  const all = listVariants();
  const v = /^[a-z]$/i.test(t)
    ? all.find((x) => x.gate === gate && x.letter === t.toLowerCase())
    : all.find((x) => x.name === t || x.branch === t);
  if (!v) die(`no variant "${t}" (gate ${gate}). Run: node tools/variants.mjs list`);
  return v;
}

function die(msg) { console.error(`variants: ${msg}`); process.exit(1); }

function create() {
  if (!/^[a-z]$/i.test(target ?? '')) die('usage: create <letter> <slug>');
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slugArg ?? '')) die('slug must be lowercase kebab-case, e.g. bold-grid');
  const letter = target.toLowerCase();
  const existing = listVariants().find((x) => x.gate === gate && x.letter === letter);
  if (existing) die(`letter ${letter} already used by ${existing.branch}`);
  const name = `variant-${gate}-${letter}-${slugArg}`;
  const branch = `variant/${gate}-${letter}-${slugArg}`;
  const dir = path.join(wtRoot, name);
  fs.mkdirSync(wtRoot, { recursive: true });
  git(['worktree', 'add', dir, '-b', branch, String(args.from ?? 'master')], root);
  if (!args['no-doc']) {
    const doc = path.join(dir, 'design', 'variants', `${letter}-${slugArg}.md`);
    if (!fs.existsSync(doc)) {
      fs.mkdirSync(path.dirname(doc), { recursive: true });
      fs.writeFileSync(doc, `# Variant ${letter.toUpperCase()}: ${slugArg}\n\nBranch: \`${branch}\` · Port: ${portFor(letter)}\n\n## Hypothesis\n\nWhat this variation tries (layout structure, navigation model, hero treatment, density, motion).\n\n## Persona served\n\n## Trade-off\n`);
    }
  }
  console.log(`created ${branch}\n  path: ${dir}\n  port: ${portFor(letter)}`);
}

function list() {
  const all = listVariants();
  if (!all.length) return console.log(`no variant worktrees (root ${wtRoot})`);
  for (const v of all) console.log(`${v.gate} ${v.letter.toUpperCase()}  :${v.port}  ${v.branch.padEnd(36)} ${v.head ?? ''}  ${v.path}`);
}

function remove() {
  const v = resolveVariant(target);
  git(['worktree', 'remove', ...(args.force ? ['--force'] : []), v.path], root);
  console.log(`removed worktree ${v.path}`);
  if (!args['keep-branch']) {
    git(['branch', args.force ? '-D' : '-d', v.branch], root);
    console.log(`deleted branch ${v.branch}`);
  }
}

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff' };

function serveStatic(dir, port, tag) {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = path.join(dir, urlPath);
    if (file !== dir && !file.startsWith(dir + path.sep)) { res.writeHead(403).end(); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    else if (!fs.existsSync(file) && fs.existsSync(`${file}.html`)) file = `${file}.html`;
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404, { 'content-type': 'text/plain' }).end('not found'); return; }
      res.writeHead(200, { 'content-type': MIME[path.extname(file).toLowerCase()] ?? 'application/octet-stream' }).end(data);
    });
  });
  server.listen(port, '127.0.0.1', () => console.log(`[${tag}] static ${dir} on http://127.0.0.1:${port}`));
  return server;
}

function startDev(v) {
  const tag = `${v.gate}-${v.letter}`;
  const webDir = path.join(v.path, 'web');
  const pkgPath = path.join(webDir, 'package.json');
  const hasDev = fs.existsSync(pkgPath) && JSON.parse(fs.readFileSync(pkgPath, 'utf8')).scripts?.dev;
  if (args.static || (!hasDev && !args.cmd)) {
    const dir = typeof args.static === 'string' ? path.resolve(v.path, args.static) : fs.existsSync(webDir) ? webDir : v.path;
    return serveStatic(dir, v.port, tag);
  }
  const command = args.cmd ?? `npm run dev -- --port ${v.port} --host 127.0.0.1`;
  console.log(`[${tag}] ${command} (in ${args.cmd ? v.path : webDir}) -> http://127.0.0.1:${v.port}`);
  const child = spawn(command, { cwd: args.cmd ? v.path : webDir, shell: true, env: { ...process.env, PORT: String(v.port) } });
  const pipe = (stream, out) => stream.on('data', (d) => String(d).split(/\r?\n/).filter(Boolean).forEach((l) => out.write(`[${tag}] ${l}\n`)));
  pipe(child.stdout, process.stdout);
  pipe(child.stderr, process.stderr);
  child.on('exit', (code) => console.log(`[${tag}] exited ${code}`));
  return child;
}

function dev() {
  const targets = target === 'all' ? listVariants().filter((x) => x.gate === gate) : [resolveVariant(target)];
  if (!targets.length) die(`no variants for gate ${gate}`);
  const running = targets.map(startDev);
  const stop = () => {
    for (const r of running) {
      if (!r.kill) r.close();
      // shell:true on Windows: kill the whole tree, not just cmd.exe
      else if (process.platform === 'win32') spawn('taskkill', ['/pid', String(r.pid), '/T', '/F']);
      else r.kill();
    }
    setTimeout(() => process.exit(0), 300);
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
}

try {
  switch (cmd) {
    case 'create': create(); break;
    case 'list': list(); break;
    case 'remove': remove(); break;
    case 'dev': dev(); break;
    case 'port': console.log(portFor(/^[a-z]$/i.test(target ?? '') ? target : resolveVariant(target).letter)); break;
    default:
      console.log('Usage: node tools/variants.mjs <create <letter> <slug> | list | dev <letter|all> | port <letter> | remove <letter>> [--gate g3]');
      process.exit(cmd ? 1 : 0);
  }
} catch (err) {
  die((err.stderr ? String(err.stderr) : err.message).trim().replace(/^fatal: /, ''));
}
