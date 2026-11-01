// Shared helpers for the tools/ scripts. No dependencies beyond Node built-ins.
import { execFileSync } from 'node:child_process';
import path from 'node:path';

/** Minimal flag parser: --key value, --key=value, --flag (boolean). Positionals in `_`. */
export function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) { out._.push(a); continue; }
    const eq = a.indexOf('=');
    if (eq !== -1) { out[a.slice(2, eq)] = a.slice(eq + 1); continue; }
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next !== undefined && !next.startsWith('--')) { out[key] = next; i++; }
    else out[key] = true;
  }
  return out;
}

export function git(args, cwd = process.cwd()) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

/** Main repo root, even when run from inside a worktree. */
export function repoRoot(cwd = process.cwd()) {
  const common = git(['rev-parse', '--path-format=absolute', '--git-common-dir'], cwd);
  return path.dirname(path.resolve(common));
}

export function currentBranch(cwd = process.cwd()) {
  try { return git(['rev-parse', '--abbrev-ref', 'HEAD'], cwd); } catch { return 'nobranch'; }
}

/** Filesystem-safe slug: "variant/g3-a-bold" -> "variant-g3-a-bold", "/" -> "home". */
export function slug(s) {
  const v = String(s).replace(/^\/+|\/+$/g, '').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-');
  return v || 'home';
}

export function pad2(n) { return String(n).padStart(2, '0'); }

export function localStamp(d = new Date()) {
  return {
    date: `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`,
    hhmm: `${pad2(d.getHours())}${pad2(d.getMinutes())}`,
  };
}
