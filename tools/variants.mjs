#!/usr/bin/env node
/**
 * variants.mjs: create, list, serve and remove design-variant worktrees.
 *
 * Naming (playbook): branch "variant/<project>-<gate>-<letter>-<name>", worktree folder
 * "<worktreesDir>/variant-<project>-<gate>-<letter>-<name>". worktreesDir comes from team.config.json
 * (default: sibling folder "<repo-folder>.worktrees"). Ports: A 4321, B 4322, C 4323... (base port from
 * "variantBasePort" in team.config.json, default 4321).
 *
 * Usage:
 *   node tools/variants.mjs create a bold-grid [--project <slug>] [--gate g3] [--from <ref>] [--no-doc]
 *   node tools/variants.mjs list [--project <slug>]
 *   node tools/variants.mjs dev a              # one variant on its port (foreground; Ctrl+C stops)
 *   node tools/variants.mjs dev all            # every variant of the project and gate, each on its own port
 *   node tools/variants.mjs dev b --static dist   # serve a folder (relative to the variant's web/) instead
 *   node tools/variants.mjs port c             # print the port for a letter
 *   node tools/variants.mjs path a             # print the worktree path
 *   node tools/variants.mjs remove a [--keep-branch] [--force]
 *
 * --project defaults to "activeProject" in team.config.json; --gate defaults to g3. A variant is addressed
 * by its letter (within project and gate) or by its full folder name or branch.
 *
 * create: branches from --from (default HEAD of the main checkout, i.e. the shared base on master) and
 * writes a hypothesis stub at <worktree>/projects/<project>/variants/<letter>-<name>.md unless --no-doc.
 *
 * dev: serves <worktree>/projects/<project>/web. If its package.json has a "dev" script, runs
 * `npm run dev -- --port <port> --host 127.0.0.1` there (Astro, Vite and Next accept these flags).
 * Otherwise, or with --static [dir], serves the folder with a built-in static server.
 * --cmd "<command>" overrides the command; it runs in web/ with PORT set.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { parseArgs, git, repoRoot, loadConfig, projectSlug } from './lib.mjs';

const args = parseArgs(process.argv.slice(2));
const [cmd, target, nameArg] = args._;
const gate = String(args.gate ?? 'g3').toLowerCase();
const root = repoRoot();
const cfg = loadConfig(root);
const BASE_PORT = Number(cfg.variantBasePort ?? 4321);
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const portFor = (letter) => BASE_PORT + (letter.toLowerCase().charCodeAt(0) - 97);
const project = (required = true) => projectSlug(args, cfg, { required });
const isLetter = (t) => /^[a-z]$/i.test(t ?? '');

function die(msg) { console.error(`variants: ${msg}`); process.exit(1); }

function listVariants() {
  const out = git(['worktree', 'list', '--porcelain'], root);
  const items = [];
  let cur = {};
  for (const line of out.split(/\r?\n/).concat('')) {
    if (line.startsWith('worktree ')) cur.path = path.resolve(line.slice(9));
    else if (line.startsWith('branch ')) cur.branch = line.slice(7).replace('refs/heads/', '');
    else if (line.startsWith('HEAD ')) cur.head = line.slice(5, 12);
    else if (line === '') {
      const m = cur.branch?.match(/^variant\/(.+?)-(g\d+)-([a-z])-(.+)$/);
      if (m) {
        items.push({ ...cur, project: m[1], gate: m[2], letter: m[3], name: m[4],
          folder: `variant-${m[1]}-${m[2]}-${m[3]}-${m[4]}`, port: portFor(m[3]) });
      }
      cur = {};
    }
  }
  return items;
}

function resolveVariant(t) {
  if (!t) die('missing variant (letter, folder name or branch)');
  const all = listVariants();
  const v = isLetter(t)
    ? all.find((x) => x.project === project() && x.gate === gate && x.letter === t.toLowerCase())
    : all.find((x) => x.folder === t || x.branch === t);
  if (!v) die(`no variant "${t}"${isLetter(t) ? ` for ${project()} ${gate}` : ''}. Run: node tools/variants.mjs list`);
  return v;
}

const webDirOf = (v) => path.join(v.path, 'projects', v.project, 'web');

function create() {
  if (!isLetter(target)) die('usage: create <letter> <name>');
  if (!KEBAB.test(nameArg ?? '')) die('name must be lowercase kebab-case, e.g. bold-grid');
  const slug = project();
  if (!KEBAB.test(slug)) die(`project slug "${slug}" must be lowercase kebab-case`);
  const letter = target.toLowerCase();
  const existing = listVariants().find((x) => x.project === slug && x.gate === gate && x.letter === letter);
  if (existing) die(`letter ${letter} already used by ${existing.branch}`);
  const folder = `variant-${slug}-${gate}-${letter}-${nameArg}`;
  const branch = `variant/${slug}-${gate}-${letter}-${nameArg}`;
  const dir = path.join(cfg.worktreesDir, folder);
  fs.mkdirSync(cfg.worktreesDir, { recursive: true });
  git(['worktree', 'add', dir, '-b', branch, String(args.from ?? 'HEAD')], root);
  if (!args['no-doc']) {
    const doc = path.join(dir, 'projects', slug, 'variants', `${letter}-${nameArg}.md`);
    if (!fs.existsSync(doc)) {
      fs.mkdirSync(path.dirname(doc), { recursive: true });
      fs.writeFileSync(doc, [
        `# Variant ${letter.toUpperCase()}: ${nameArg}`, '',
        `Branch: \`${branch}\` · Port: ${portFor(letter)}`, '',
        '## Hypothesis', '',
        'What this variation tries (layout structure, navigation model, hero treatment, density, motion).', '',
        '## Persona served', '',
        '## Trade-off', '',
        '## Impeccable', '',
        '- shape brief:',
        '- commands run:',
        '- critique (top issues and what changed):',
        '- detect: clean, or each remaining finding with its justification', '',
      ].join('\n'));
    }
  }
  console.log(`created ${branch}\n  path: ${dir}\n  web:  ${path.join(dir, 'projects', slug, 'web')}\n  port: ${portFor(letter)}`);
}

function list() {
  const only = typeof args.project === 'string' ? args.project : '';
  const all = listVariants().filter((v) => !only || v.project === only);
  if (!all.length) return console.log(`no variant worktrees (folder ${cfg.worktreesDir})`);
  for (const v of all) {
    console.log(`${v.project} ${v.gate} ${v.letter.toUpperCase()}  :${v.port}  ${v.branch.padEnd(44)} ${v.head ?? ''}  ${v.path}`);
  }
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
  const webDir = webDirOf(v);
  if (!fs.existsSync(webDir)) die(`${webDir} does not exist; build the variant's web/ first`);
  const pkgPath = path.join(webDir, 'package.json');
  const hasDev = fs.existsSync(pkgPath) && JSON.parse(fs.readFileSync(pkgPath, 'utf8')).scripts?.dev;
  if (args.static || (!hasDev && !args.cmd)) {
    return serveStatic(typeof args.static === 'string' ? path.resolve(webDir, args.static) : webDir, v.port, tag);
  }
  const command = args.cmd ?? `npm run dev -- --port ${v.port} --host 127.0.0.1`;
  console.log(`[${tag}] ${command} (in ${webDir}) -> http://127.0.0.1:${v.port}`);
  const child = spawn(command, { cwd: webDir, shell: true, env: { ...process.env, PORT: String(v.port) } });
  const pipe = (stream, out) => stream.on('data', (d) => String(d).split(/\r?\n/).filter(Boolean).forEach((l) => out.write(`[${tag}] ${l}\n`)));
  pipe(child.stdout, process.stdout);
  pipe(child.stderr, process.stderr);
  child.on('exit', (code) => console.log(`[${tag}] exited ${code}`));
  return child;
}

function dev() {
  const targets = target === 'all'
    ? listVariants().filter((x) => x.project === project() && x.gate === gate)
    : [resolveVariant(target)];
  if (!targets.length) die(`no variants for ${project()} ${gate}`);
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
    case 'port': console.log(portFor(isLetter(target) ? target : resolveVariant(target).letter)); break;
    case 'path': console.log(resolveVariant(target).path); break;
    default:
      console.log('Usage: node tools/variants.mjs <create <letter> <name> | list | dev <letter|all> | port <letter> | path <letter> | remove <letter>> [--project <slug>] [--gate g3]');
      process.exit(cmd ? 1 : 0);
  }
} catch (err) {
  die((err.stderr ? String(err.stderr) : err.message).trim().replace(/^fatal: /, ''));
}
