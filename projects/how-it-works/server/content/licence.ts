/**
 * Licence guard for generated images (api/stack-proposal.md, "Licence guard").
 *
 * Walks the whole provenance sidecar, including nested `source_provenance` and provenance stored as a
 * JSON string, the same way Review's docs/review/tools/licences.mjs does. Rules:
 * - no sidecar, or invalid JSON: fail;
 * - a workflow outside WEB1-WEB5 and WEB6b anywhere in the chain: fail;
 * - a non-commercial model or licence anywhere in the chain (4x-UltraSharp, CC BY-NC): fail;
 * - FLUX Klein follows licence-policy.json ("allowed" since Gate 1 Q11 A; "boards-only" fails it).
 */
import { existsSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { CONTENT } from './paths.ts';

const MODEL_KEYS = /^(model|upscale_model|unet_name|ckpt_name|clip_name|vae_name|lora_name|control_net_name)$/;
const NONCOMMERCIAL = /ultrasharp|non-?commercial|cc[ -]by-nc|by-nc-sa/i;
const KLEIN = /klein|kommunity/i;
const ALLOWED_WORKFLOWS = /^WEB(?:[1-5]|6b)$/;

export type Policy = { klein: 'allowed' | 'boards-only' };
export type Verdict = { ok: boolean; problems: string[]; workflows: string[]; models: string[]; licences: string[] };

export function loadPolicy(): Policy {
  return JSON.parse(readFileSync(join(CONTENT, 'licence-policy.json'), 'utf8')) as Policy;
}

export function sidecarFor(image: string): string | null {
  const c = [`${image}.json`, `${image.slice(0, -extname(image).length)}.json`];
  return c.find((p) => existsSync(p)) ?? null;
}

type Acc = { workflows: Map<string, string>; models: Map<string, string>; licences: Map<string, string> };

function walk(node: unknown, at: string, acc: Acc): void {
  if (typeof node === 'string') {
    if (node.startsWith('{')) { try { walk(JSON.parse(node), at, acc); } catch { /* plain string */ } }
    return;
  }
  if (!node || typeof node !== 'object') return;
  for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
    const here = at ? `${at}.${k}` : k;
    if (typeof v === 'string' && v) {
      if (k === 'workflow') acc.workflows.set(here, v);
      if (MODEL_KEYS.test(k)) acc.models.set(here, v);
      if (/^licen[cs]e$/i.test(k)) acc.licences.set(here, v);
    }
    walk(v, here, acc);
  }
}

/** Check one sidecar object. `where` is only used in messages. */
export function checkProvenance(sidecar: unknown, policy: Policy, where = 'image'): Verdict {
  const acc: Acc = { workflows: new Map(), models: new Map(), licences: new Map() };
  walk(sidecar, '', acc);
  const problems: string[] = [];
  for (const [at, wf] of acc.workflows) {
    const id = wf.match(/^(WEB\d+b?)/i)?.[1];
    if (!id || !ALLOWED_WORKFLOWS.test(id)) problems.push(`${where}: workflow "${wf}" at ${at} is not commercially licensed (allowed: WEB1-WEB5, WEB6b)`);
  }
  for (const [at, v] of [...acc.models, ...acc.licences]) {
    if (NONCOMMERCIAL.test(v)) problems.push(`${where}: non-commercial "${v}" at ${at}`);
    else if (KLEIN.test(v) && policy.klein !== 'allowed') problems.push(`${where}: FLUX Klein "${v}" at ${at}, but licence-policy.json says boards-only`);
  }
  if (!acc.workflows.size) problems.push(`${where}: sidecar records no workflow`);
  return {
    ok: problems.length === 0,
    problems: [...new Set(problems)],
    workflows: [...new Set(acc.workflows.values())],
    models: [...new Set(acc.models.values())],
    licences: [...new Set(acc.licences.values())],
  };
}

/** Check an image file by its sidecar. Missing or invalid sidecars fail. */
export function checkImage(image: string, policy: Policy, where = image): Verdict {
  const side = sidecarFor(image);
  if (!side) return { ok: false, problems: [`${where}: no provenance sidecar`], workflows: [], models: [], licences: [] };
  let data: unknown;
  try { data = JSON.parse(readFileSync(side, 'utf8')); } catch {
    return { ok: false, problems: [`${where}: sidecar is not valid JSON`], workflows: [], models: [], licences: [] };
  }
  return checkProvenance(data, policy, where);
}
