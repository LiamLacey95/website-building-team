#!/usr/bin/env node
/**
 * contact-sheet.mjs: build one self-contained HTML grid from a folder of screenshots.
 *
 * Usage:
 *   node tools/contact-sheet.mjs --in projects/how-it-works/screenshots/g3
 *   node tools/contact-sheet.mjs --in projects/how-it-works/screenshots/g3 --out projects/how-it-works/gates/G3-design/contact-sheet.html \
 *        --title "Gate 3: design variations" --widths 1440,390 --latest
 *
 * Flags:
 *   --in <dir>       Folder of screenshots, searched recursively (required).
 *   --out <file>     Output HTML. Default <in>/contact-sheet.html.
 *   --title <text>   Page title. Default "Contact sheet: <folder name>".
 *   --widths <list>  Only include these widths, in this order. Default: all found, widest first.
 *   --latest         Keep only the newest shot per variant/route/width.
 *
 * Layout: one section per route; inside it one row per width; inside each row the variants
 * side by side (so A, B and C compare directly at the same width). Each card is labelled with
 * variant, width and capture time, scrolls inside a fixed-height frame, and links to the full PNG.
 * Images are referenced by paths relative to the output file; no JS, no external assets.
 *
 * Metadata comes from manifest.json files written by screenshot.mjs. PNGs without a manifest
 * entry are parsed from their name: <HHMM>-<label>-<route>-<width>.png (route is the last
 * dash-separated token before the width; label is everything between).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { parseArgs, repoRoot } from './lib.mjs';

const args = parseArgs(process.argv.slice(2));
if (!args.in || args.help) {
  console.log('Usage: node tools/contact-sheet.mjs --in <dir> [--out file.html] [--title text] [--widths 1440,390] [--latest]');
  process.exit(args.help ? 0 : 1);
}

const root = repoRoot();
const inDir = path.resolve(root, args.in);
const outFile = path.resolve(root, args.out ?? path.join(args.in, 'contact-sheet.html'));
const title = args.title ?? `Contact sheet: ${path.basename(inDir)}`;
const widthFilter = args.widths ? String(args.widths).split(',').map(Number) : null;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  }));
  return files.flat();
}

const files = await walk(inDir);
const known = new Map();
for (const mf of files.filter((f) => path.basename(f) === 'manifest.json')) {
  try {
    for (const s of JSON.parse(await fs.readFile(mf, 'utf8'))) known.set(path.join(path.dirname(mf), s.file), s);
  } catch (err) { console.warn(`skipping unreadable ${mf}: ${err.message}`); }
}

const shots = [];
for (const f of files.filter((p) => p.toLowerCase().endsWith('.png'))) {
  let meta = known.get(f);
  if (!meta) {
    const m = path.basename(f, '.png').match(/^(\d{4})-(.+)-([^-]+)-(\d+)$/);
    if (!m) { console.warn(`skipping ${f}: name does not match <HHMM>-<label>-<route>-<width>.png`); continue; }
    meta = { label: m[2], route: m[3] === 'home' ? '/' : m[3], width: Number(m[4]), takenAt: m[1] };
  }
  if (widthFilter && !widthFilter.includes(meta.width)) continue;
  const stat = await fs.stat(f);
  shots.push({ ...meta, abs: f, mtime: stat.mtimeMs });
}

let selected = shots;
if (args.latest) {
  const best = new Map();
  for (const s of shots) {
    const k = `${s.label}|${s.route}|${s.width}`;
    if (!best.has(k) || best.get(k).mtime < s.mtime) best.set(k, s);
  }
  selected = [...best.values()];
}
if (!selected.length) { console.error(`no screenshots found in ${inDir}`); process.exit(1); }

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const rel = (abs) => path.relative(path.dirname(outFile), abs).split(path.sep).map(encodeURIComponent).join('/');
const when = (s) => (/^\d{4}$/.test(s.takenAt) ? `${s.takenAt.slice(0, 2)}:${s.takenAt.slice(2)}`
  : new Date(s.takenAt ?? s.mtime).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }));

const routes = [...new Set(selected.map((s) => s.route))].sort();
const labels = [...new Set(selected.map((s) => s.label))].sort();
const widths = widthFilter ?? [...new Set(selected.map((s) => s.width))].sort((a, b) => b - a);

const sections = routes.map((route) => {
  const rows = widths.map((w) => {
    const cards = labels.map((label) => {
      const group = selected.filter((s) => s.route === route && s.width === w && s.label === label)
        .sort((a, b) => b.mtime - a.mtime);
      if (!group.length) return `<figure class="card empty"><figcaption><b>${esc(label)}</b><span>no shot</span></figcaption></figure>`;
      return group.map((s) => `
        <figure class="card">
          <figcaption><b>${esc(label)}</b><span>${w}px · ${esc(when(s))}</span></figcaption>
          <a class="frame" href="${rel(s.abs)}"><img src="${rel(s.abs)}" style="max-width:${w}px" alt="${esc(label)} ${esc(route)} at ${w}px" loading="lazy"></a>
        </figure>`).join('');
    }).join('');
    return `<div class="row"><h3>${w}px</h3><div class="cards" style="--cols:${labels.length}">${cards}</div></div>`;
  }).join('');
  return `<section><h2>Route <code>${esc(route)}</code></h2>${rows}</section>`;
}).join('');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<style>
  :root { color-scheme: light dark; --bg: #f4f4f2; --fg: #1a1a1a; --muted: #5c5c5c; --card: #fff; --line: #d6d6d2; }
  @media (prefers-color-scheme: dark) { :root { --bg: #151515; --fg: #ececec; --muted: #a8a8a8; --card: #202020; --line: #353535; } }
  * { box-sizing: border-box; }
  body { margin: 0; padding: 2rem clamp(1rem, 3vw, 3rem); font: 15px/1.5 system-ui, sans-serif; background: var(--bg); color: var(--fg); }
  header p { color: var(--muted); margin: .25rem 0 0; }
  h1 { margin: 0; font-size: 1.6rem; }
  section { margin-top: 2.5rem; }
  h2 { font-size: 1.2rem; border-bottom: 1px solid var(--line); padding-bottom: .4rem; }
  h3 { font-size: .9rem; color: var(--muted); margin: 1.25rem 0 .5rem; font-weight: 600; }
  .cards { display: grid; grid-template-columns: repeat(var(--cols), minmax(220px, 1fr)); gap: 1rem; overflow-x: auto; }
  .card { margin: 0; background: var(--card); border: 1px solid var(--line); border-radius: 8px; overflow: hidden; display: flex; flex-direction: column; }
  figcaption { display: flex; justify-content: space-between; gap: .5rem; padding: .5rem .75rem; font-size: .85rem; border-bottom: 1px solid var(--line); }
  figcaption span { color: var(--muted); }
  .frame { display: block; max-height: 70vh; overflow-y: auto; }
  .frame:focus-visible { outline: 3px solid #2563eb; outline-offset: -3px; }
  .frame img { display: block; width: 100%; height: auto; margin-inline: auto; }
  .empty { justify-content: center; opacity: .6; }
</style>
</head>
<body>
<header>
  <h1>${esc(title)}</h1>
  <p>${selected.length} screenshot(s) · ${labels.length} variant(s) · ${routes.length} route(s) · generated ${esc(new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }))}. Click a shot to open it full size.</p>
</header>
${sections}
</body>
</html>
`;

await fs.mkdir(path.dirname(outFile), { recursive: true });
await fs.writeFile(outFile, html);
console.log(`contact sheet: ${outFile} (${selected.length} shots, variants: ${labels.join(', ')})`);
