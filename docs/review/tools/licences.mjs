#!/usr/bin/env node
// Generated-image licence check for anything that will ship.
//
//   node licences.mjs projects/<slug>/web/public/assets/generated [more dirs or files] [--out report.md]
//
// For every image (png, jpg, jpeg, webp, avif) it checks for a provenance sidecar (<image>.json or
// <image-without-ext>.json, written by artgen/generate.py) and walks the whole sidecar, including nested
// source provenance, for model names and licence strings.
//   FAIL: no sidecar, or a non-commercial model or licence anywhere in the chain (4x-UltraSharp, CC BY-NC).
//   NOTE: FLUX Klein (free commercial use only under US$5M annual revenue): confirm the client qualifies.
// Exit: 0 all pass, 1 a FAIL, 2 tool error.
import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs';
import { resolve, extname, join } from 'node:path';
import { parseArgs, writeOut, esc, displayPath, run, ToolError } from './lib.mjs';

const IMAGE = /\.(png|jpe?g|webp|avif)$/i;
const MODEL_KEYS = /^(model|upscale_model|unet_name|ckpt_name|clip_name|vae_name|lora_name|control_net_name)$/;
const NONCOMMERCIAL = /ultrasharp|non-?commercial|cc[ -]by-nc|by-nc-sa/i;
const REVENUE_CAP = /klein|kommunity/i;

function images(target) {
  const p = resolve(target);
  if (!existsSync(p)) throw new ToolError(`Not found: ${target}`);
  if (!statSync(p).isDirectory()) return IMAGE.test(p) ? [p] : [];
  return readdirSync(p, { withFileTypes: true }).flatMap((d) => images(join(p, d.name)));
}

// Collects model names and licence strings from anywhere in the sidecar.
function walk(node, acc = { models: new Set(), licences: new Set() }) {
  if (typeof node === 'string') {
    // Some sidecars embed nested provenance as a JSON string.
    if (node.startsWith('{')) { try { walk(JSON.parse(node), acc); } catch {} }
    return acc;
  }
  if (!node || typeof node !== 'object') return acc;
  for (const [k, v] of Object.entries(node)) {
    if (MODEL_KEYS.test(k) && typeof v === 'string' && v) acc.models.add(v);
    if (/^licen[cs]e$/i.test(k) && typeof v === 'string' && v) acc.licences.add(v);
    walk(v, acc);
  }
  return acc;
}

async function main() {
  const opts = parseArgs();
  if (!opts._.length) throw new ToolError('Usage: node licences.mjs <dir or image> [...] [--out report.md]');
  const files = opts._.flatMap(images);
  const rows = files.map((img) => {
    const sidecar = [img + '.json', img.slice(0, -extname(img).length) + '.json'].find(existsSync);
    if (!sidecar) return { img, status: 'FAIL', why: 'no provenance sidecar' };
    let data;
    try { data = JSON.parse(readFileSync(sidecar, 'utf8')); } catch { return { img, status: 'FAIL', why: 'sidecar is not valid JSON' }; }
    const { models, licences } = walk(data);
    const all = [...models, ...licences].join(' | ');
    const status = NONCOMMERCIAL.test(all) ? 'FAIL' : REVENUE_CAP.test(all) ? 'NOTE' : 'PASS';
    const why = status === 'FAIL' ? 'non-commercial model or licence in the chain'
      : status === 'NOTE' ? 'FLUX Klein: commercial use only under US$5M annual revenue' : '';
    return { img, status, why, models: [...models], licences: [...licences] };
  });

  const n = (s) => rows.filter((r) => r.status === s).length;
  const md = ['# Generated image licences', '',
    `Run: ${new Date().toISOString()}. Targets: ${opts._.map((t) => displayPath(t)).join(', ')}.`, '',
    '| Image | Status | Why | Models | Licences |', '|---|---|---|---|---|',
    ...rows.map((r) => `| ${esc(displayPath(r.img))} | ${r.status === 'FAIL' ? '**FAIL**' : r.status} | ${esc(r.why)} | ${esc((r.models || []).join(', '))} | ${esc((r.licences || []).join('; '))} |`), '',
    `**${files.length} images: ${n('PASS')} pass, ${n('NOTE')} need a revenue check, ${n('FAIL')} fail.**`, ''].join('\n');
  console.log(md);
  if (opts.out) console.error(`Wrote ${displayPath(writeOut(resolve(opts.out), md))}`);
  if (!files.length) console.error('Warning: no images found.');
  process.exitCode = n('FAIL') ? 1 : 0;
}

run(main);
