/**
 * Slots: real imagery for later gates (Concept's directions, the Gate 3 contact sheet, Review's audit).
 * A slot is "pending" until its files exist, then "filled". Registry: server/content/slots.json.
 *
 * CONTENT_SLOTS=filled  -> every slot uses server/contracts/fixtures/slots.filled.json (real images we already
 *                          have: kit smoke-test renders and dry-run screenshots), for Gate 3 variants
 * CONTENT_SLOTS=pending -> every slot is pending
 * unset / auto          -> resolve the real sources
 * STRICT_SLOTS=1        -> any pending slot is a build error (release build, Gate 4)
 *
 * Generated images (registry `kind: "generated"`) must pass the licence guard, or the build fails.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, extname, join } from 'node:path';
import { CONTENT, FIXTURES, PROJECT, rel } from './paths.ts';
import { checkImage, loadPolicy } from './licence.ts';

export type SlotDef = {
  gate: 'G1' | 'G2' | 'G3' | 'G4';
  chapter: number;
  label: string;
  pendingLabel: string;
  kind: 'generated' | 'screenshot';
  /** Globs relative to projects/how-it-works: `*` within a segment, `{a,b}` alternatives. */
  sources: string[];
  min: number;
  max?: number;
  /** Alt text when neither the sidecar's `alt` nor a sibling `<image>.alt.txt` exists. `{dir}` = parent folder. */
  defaultAlt: string;
};

export type SlotItem = { src: string; alt: string; caption?: string; provenance?: { workflows: string[]; models: string[] } };
export type SlotEntry = Omit<SlotDef, 'kind' | 'sources' | 'min' | 'max' | 'defaultAlt'> & { status: 'filled' | 'pending'; items: SlotItem[] };

const IMAGE = /\.(png|webp|jpe?g|avif)$/i;

export function readRegistry(): Record<string, SlotDef> {
  const raw = JSON.parse(readFileSync(join(CONTENT, 'slots.json'), 'utf8')) as Record<string, SlotDef | string>;
  return Object.fromEntries(Object.entries(raw).filter(([k]) => !k.startsWith('$'))) as Record<string, SlotDef>;
}

/** Minimal glob: `*` matches within one path segment; `{a,b}` expands. Returns absolute file paths, sorted. */
export function glob(base: string, pattern: string): string[] {
  const brace = pattern.match(/\{([^{}]+)\}/);
  if (brace) return [...new Set(brace[1].split(',').flatMap((alt) => glob(base, pattern.replace(brace[0], alt))))].sort();
  const segs = pattern.split('/');
  let paths = [base];
  segs.forEach((seg, i) => {
    const last = i === segs.length - 1;
    const re = new RegExp(`^${seg.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.')}$`);
    paths = paths.flatMap((dir) => {
      if (!existsSync(dir) || !statSync(dir).isDirectory()) return [];
      return readdirSync(dir).filter((n) => re.test(n)).map((n) => join(dir, n))
        .filter((p) => (last ? statSync(p).isFile() : statSync(p).isDirectory()));
    });
  });
  return paths.sort();
}

function altFor(img: string, def: SlotDef): string {
  const side = [`${img}.json`, `${img.slice(0, -extname(img).length)}.json`].find(existsSync);
  if (side) {
    try { const a = JSON.parse(readFileSync(side, 'utf8')).alt; if (typeof a === 'string' && a.trim()) return a.trim(); } catch { /* ignore */ }
  }
  const txt = `${img.slice(0, -extname(img).length)}.alt.txt`;
  if (existsSync(txt)) return readFileSync(txt, 'utf8').trim();
  return def.defaultAlt.replace('{dir}', basename(dirname(img)));
}

function resolveItems(id: string, def: SlotDef, files: string[], problems: string[]): SlotItem[] {
  const policy = def.kind === 'generated' ? loadPolicy() : null;
  return files.map((src) => {
    const item: SlotItem = { src, alt: altFor(src, def) };
    if (policy) {
      const v = checkImage(src, policy, `${id}: ${rel(PROJECT, src)}`);
      if (!v.ok) problems.push(...v.problems);
      item.provenance = { workflows: v.workflows, models: v.models };
    }
    return item;
  });
}

type FixtureItem = { file: string; alt: string; caption?: string };

/** Resolve every slot. Throws on licence problems, and on pending slots when `strict`. */
export function resolveSlots(mode = process.env.CONTENT_SLOTS ?? 'auto', strict = process.env.STRICT_SLOTS === '1'): Record<string, SlotEntry> {
  const registry = readRegistry();
  const fixtures = mode === 'filled'
    ? JSON.parse(readFileSync(join(FIXTURES, 'slots.filled.json'), 'utf8')) as Record<string, FixtureItem[]>
    : {};
  const problems: string[] = [];
  const out: Record<string, SlotEntry> = {};

  for (const [id, def] of Object.entries(registry)) {
    let items: SlotItem[] = [];
    if (mode === 'filled') {
      const fx = fixtures[id] ?? [];
      const files = fx.map((f) => join(FIXTURES, f.file));
      items = resolveItems(id, def, files, problems).map((it, i) => ({ ...it, alt: fx[i].alt, caption: fx[i].caption }));
    } else if (mode !== 'pending') {
      const files = [...new Set(def.sources.flatMap((g) => glob(PROJECT, g)))].filter((p) => IMAGE.test(p)).slice(0, def.max ?? Infinity);
      if (files.length >= def.min) items = resolveItems(id, def, files, problems);
    }
    const { kind: _k, sources: _s, min: _m, max: _x, defaultAlt: _d, ...shown } = def;
    out[id] = { ...shown, status: items.length ? 'filled' : 'pending', items };
  }

  if (problems.length) throw new Error(`Licence guard failed:\n- ${problems.join('\n- ')}`);
  const pending = Object.entries(out).filter(([, s]) => s.status === 'pending').map(([id]) => id);
  if (strict && pending.length) throw new Error(`STRICT_SLOTS=1 but these slots are still pending: ${pending.join(', ')}`);
  // Stand-in images must never reach a release build, whatever CONTENT_SLOTS says.
  const fromFixtures = Object.entries(out).flatMap(([id, s]) => s.items.filter((i) => i.src.startsWith(FIXTURES)).map(() => id));
  if (strict && fromFixtures.length) throw new Error(`STRICT_SLOTS=1 but these slots use fixture images: ${[...new Set(fromFixtures)].join(', ')} (unset CONTENT_SLOTS)`);
  return out;
}
