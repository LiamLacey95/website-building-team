// Shared helpers for the review tools: arguments, URL lists, output paths, local file serving.
//
// Exit-code contract for every tool: 0 = clean, 1 = findings (site or palette problems), 2 = the tool itself failed.
import { readFileSync, mkdirSync, writeFileSync, existsSync, statSync, createReadStream } from 'node:fs';
import { dirname, resolve, relative, extname, isAbsolute, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createServer } from 'node:http';

export const TOOLS_DIR = dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = resolve(TOOLS_DIR, '..', '..', '..');

export class ToolError extends Error {}

// team.config.json at the repo root is optional and git-ignored; missing or unreadable means defaults.
export function readConfig() {
  const p = resolve(REPO_ROOT, 'team.config.json');
  if (!existsSync(p)) return {};
  try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return {}; }
}

// Reports go to projects/<slug>/review/out/ for the active project (--project overrides team.config.json),
// or docs/review/out/ when there is none (kit work, selftest).
export function outDir(opts = {}) {
  const slugName = opts.project || readConfig().activeProject;
  const dir = slugName
    ? resolve(REPO_ROOT, 'projects', slugName, 'review', 'out')
    : resolve(TOOLS_DIR, '..', 'out');
  mkdirSync(dir, { recursive: true });
  // Markdown summaries in a project's out/ are gate evidence and get committed; bulky raw output does not.
  const ignore = resolve(dir, '.gitignore');
  if (slugName && !existsSync(ignore)) writeFileSync(ignore, '*-html/\n*.json\n*.log\n');
  return dir;
}

// Repo-relative, forward-slash form of a path, so committed reports carry no machine paths.
export function displayPath(p) {
  const rel = relative(REPO_ROOT, resolve(p));
  if (!rel || rel.startsWith('..') || isAbsolute(rel)) return p;
  return rel.split(sep).join('/');
}

// Parses `--key value`, `--flag` and positional args.
export function parseArgs(argv = process.argv.slice(2)) {
  const opts = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) opts[key] = true;
      else { opts[key] = next; i++; }
    } else opts._.push(a);
  }
  return opts;
}

// URLs from positional args plus an optional --urls file (one per line, # comments allowed).
export function readUrls(opts) {
  const urls = [...opts._];
  if (opts.urls) {
    for (const line of readFileSync(opts.urls, 'utf8').split(/\r?\n/)) {
      const t = line.trim();
      if (t && !t.startsWith('#')) urls.push(t);
    }
  }
  if (!urls.length) throw new ToolError('No URLs given. Pass them as arguments or with --urls <file>.');
  return urls;
}

const TYPES = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ico': 'image/x-icon', '.txt': 'text/plain',
};

// Local targets (a file path or a file:// URL) are served over http://127.0.0.1 from the file's folder,
// because Lighthouse refuses file:// and relative assets behave more like production over http.
// Returns [{ input, url, label }] plus close(). `label` is what reports show: the URL, or the repo-relative path.
export async function resolveTargets(inputs) {
  const servers = new Map();
  const targets = [];
  for (const input of inputs) {
    let file = null;
    if (input.startsWith('file:')) file = fileURLToPath(input);
    else if (!/^https?:\/\//i.test(input) && existsSync(input)) file = resolve(input);
    if (!file) { targets.push({ input, url: input, label: input }); continue; }
    if (statSync(file).isDirectory()) file = resolve(file, 'index.html');
    if (!existsSync(file)) throw new ToolError(`Local target not found: ${input}`);
    const root = dirname(file);
    if (!servers.has(root)) servers.set(root, await serve(root));
    const { port } = servers.get(root).address();
    const path = relative(root, file).split(sep).map(encodeURIComponent).join('/');
    targets.push({ input, url: `http://127.0.0.1:${port}/${path}`, label: displayPath(file) });
  }
  // Browsers keep sockets alive after the run; drop them or close() never resolves and node never exits.
  const close = () => Promise.all([...servers.values()].map((s) => new Promise((r) => { s.close(r); s.closeAllConnections(); })));
  return { targets, close };
}

function serve(root) {
  const server = createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let f = resolve(root, '.' + p);
    if (f !== root && !f.startsWith(root + sep)) { res.writeHead(403).end(); return; }
    if (existsSync(f) && statSync(f).isDirectory()) f = resolve(f, 'index.html');
    if (!existsSync(f)) { res.writeHead(404).end('Not found'); return; }
    res.writeHead(200, { 'content-type': TYPES[extname(f).toLowerCase()] || 'application/octet-stream' });
    createReadStream(f).pipe(res);
  });
  return new Promise((r) => server.listen(0, '127.0.0.1', () => r(server)));
}

export function stamp() {
  return new Date().toISOString().replace(/[:T]/g, '-').slice(0, 16);
}

export function writeOut(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
  return path;
}

export function slug(s) {
  return s.replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 60);
}

// Escapes a value for a Markdown table cell.
export const esc = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');

// True when the module at `metaUrl` is the script node was started with.
export function isMain(metaUrl) {
  return process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === metaUrl;
}

// Runs a tool's main(): ToolError and unexpected errors exit 2; main() sets 0 or 1 itself.
export function run(main) {
  main().catch((e) => {
    console.error(e instanceof ToolError ? `Error: ${e.message}` : e);
    process.exitCode = 2;
  });
}
