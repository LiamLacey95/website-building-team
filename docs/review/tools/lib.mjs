// Shared helpers for the review tools: argument parsing, URL lists, output paths.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const TOOLS_DIR = dirname(fileURLToPath(import.meta.url));
export const OUT_DIR = resolve(TOOLS_DIR, '..', 'out');

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
  if (!urls.length) throw new Error('No URLs given. Pass them as arguments or with --urls <file>.');
  return urls;
}

export function stamp() {
  return new Date().toISOString().replace(/[:T]/g, '-').slice(0, 16);
}

export function writeOut(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
  return path;
}

export function slug(url) {
  return url.replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 60);
}

export const esc = (s) => String(s ?? '').replace(/\|/g, '\|').replace(/\r?\n/g, ' ');

// True when the module at `metaUrl` is the script node was started with.
export function isMain(metaUrl) {
  return process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === metaUrl;
}
