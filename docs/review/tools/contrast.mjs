#!/usr/bin/env node
// WCAG 2.x contrast checker.
//
//   node contrast.mjs "#1a1a1a:#ffffff" "#767676:#fff:large"
//   node contrast.mjs --palette palette.json [--out report.md]
//
// Pair syntax: FG:BG[:kind] where kind is normal (default), large or ui.
// Hex may be #rgb, #rrggbb or #rrggbbaa; a translucent foreground is composited over the background.
//
// Palette file (any one of these shapes):
//   { "pairs": [ { "fg": "#111", "bg": "#fff", "label": "Body text", "kind": "normal" } ] }
//   { "text": { "ink": "#111" }, "background": { "paper": "#fff" } }    every text x background
//   { "colors": { "ink": "#111", "paper": "#fff", "accent": "#c33" } }   every unordered pair
//
// Exit code 1 if any pair fails AA for its kind (normal 4.5, large 3, ui 3).
import { readFileSync } from 'node:fs';
import { parseArgs, writeOut, esc, isMain } from './lib.mjs';

export function parseHex(hex) {
  let h = String(hex).trim().replace(/^#/, '');
  if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('');
  if (!/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(h)) throw new Error(`Bad hex colour: ${hex}`);
  const n = (i) => parseInt(h.slice(i, i + 2), 16);
  return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) / 255 : 1 };
}

const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
export const luminance = ({ r, g, b }) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);

export function contrast(fgHex, bgHex) {
  const bg = parseHex(bgHex);
  if (bg.a < 1) throw new Error(`Background must be opaque: ${bgHex}`);
  const f = parseHex(fgHex);
  const fg = { r: f.r * f.a + bg.r * (1 - f.a), g: f.g * f.a + bg.g * (1 - f.a), b: f.b * f.a + bg.b * (1 - f.a) };
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const AA = { normal: 4.5, large: 3, ui: 3 };
const AAA = { normal: 7, large: 4.5, ui: null };

export function grade(ratio, kind = 'normal') {
  const r = Math.floor(ratio * 100) / 100; // WCAG forbids rounding up to a pass
  return { ratio: r, aa: r >= AA[kind], aaa: AAA[kind] == null ? null : r >= AAA[kind] };
}

function pairsFromPalette(p) {
  if (Array.isArray(p.pairs)) return p.pairs;
  if (p.text && p.background) {
    return Object.entries(p.text).flatMap(([tn, fg]) =>
      Object.entries(p.background).map(([bn, bg]) => ({ fg, bg, label: `${tn} on ${bn}` })));
  }
  if (p.colors) {
    const e = Object.entries(p.colors);
    return e.flatMap(([an, a], i) => e.slice(i + 1).map(([bn, b]) => ({ fg: a, bg: b, label: `${an} / ${bn}` })));
  }
  throw new Error('Palette needs "pairs", "text"+"background", or "colors".');
}

function main() {
  const opts = parseArgs();
  let pairs = opts._.map((s) => {
    const [fg, bg, kind = 'normal'] = s.split(':');
    return { fg, bg, kind, label: '' };
  });
  if (opts.palette) pairs = pairs.concat(pairsFromPalette(JSON.parse(readFileSync(opts.palette, 'utf8'))));
  if (!pairs.length) { console.error('Usage: node contrast.mjs FG:BG[:normal|large|ui] ... | --palette file.json [--out file.md]'); process.exit(2); }

  let failures = 0;
  const rows = pairs.map(({ fg, bg, label = '', kind = 'normal' }) => {
    if (!AA[kind]) throw new Error(`Unknown kind "${kind}" (use normal, large or ui)`);
    const g = grade(contrast(fg, bg), kind);
    if (!g.aa) failures++;
    const yn = (v) => (v == null ? 'n/a' : v ? 'pass' : '**FAIL**');
    return `| ${esc(label)} | \`${fg}\` | \`${bg}\` | ${kind} | ${g.ratio.toFixed(2)}:1 | ${yn(g.aa)} | ${yn(g.aaa)} |`;
  });

  const md = [
    '# Contrast check', '',
    `Thresholds: AA normal 4.5, large 3 (18pt or 14pt bold), ui 3 (WCAG 1.4.11); AAA normal 7, large 4.5. Ratios are truncated, never rounded up.`, '',
    '| Pair | Foreground | Background | Kind | Ratio | AA | AAA |',
    '|---|---|---|---|---|---|---|',
    ...rows, '',
    `**${pairs.length - failures}/${pairs.length} pairs pass AA.**`, '',
  ].join('\n');

  console.log(md);
  if (opts.out) console.error(`Wrote ${writeOut(opts.out, md)}`);
  process.exitCode = failures ? 1 : 0;
}

if (isMain(import.meta.url)) main();
