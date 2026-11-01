// Every authored content file validates against the contract, and the cross-references hold.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { CONTENT } from '../content/paths.ts';
import {
  chapterSchema, creditsSchema, gateSchema, GATE_IDS, numbersSchema, requirementSchema, ROLE_IDS, roleSchema,
  sceneSchema, setupSchema, siteSchema, slotSchema, SLOT_IDS,
} from '../contracts/schema.ts';
import { requirements, numbers } from '../content/kit-facts.ts';
import { resolveSlots } from '../content/slots.ts';

const json = (f: string) => JSON.parse(readFileSync(join(CONTENT, f), 'utf8'));
const entries = (f: string) => Object.entries(json(f) as Record<string, unknown>).filter(([k]) => !k.startsWith('$'));

function chapters() {
  const dir = join(CONTENT, 'chapters');
  return readdirSync(dir).filter((f) => f.endsWith('.md')).sort().map((f) => {
    const src = readFileSync(join(dir, f), 'utf8').replace(/\r\n/g, '\n');
    const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    assert.ok(m, `${f}: frontmatter`);
    return { file: f, data: parseYaml(m[1]), body: m[2] };
  });
}

test('site, roles, gates, scenes, setup and credits validate', () => {
  for (const [, v] of entries('site.json')) siteSchema.parse(v);
  for (const [, v] of entries('setup.json')) setupSchema.parse(v);
  for (const [, v] of entries('credits.json')) creditsSchema.parse(v);
  const roles = entries('roles.json');
  assert.deepEqual(roles.map(([k]) => k).sort(), [...ROLE_IDS].sort());
  for (const [, v] of roles) roleSchema.parse(v);
  const gates = entries('gates.json');
  assert.deepEqual(gates.map(([k]) => k), [...GATE_IDS]);
  for (const [k, v] of gates) {
    const g = gateSchema.parse(v);
    assert.equal(g.number, Number(k.slice(1)));
    // Front-end renders options as "A. {label}.": short labels, no trailing period.
    for (const o of g.options) assert.ok(o.label.length <= 40 && !/[.!?]$/.test(o.label), `${k} option ${o.letter}: "${o.label}"`);
  }
  for (const [, v] of entries('scenes.json')) sceneSchema.parse(v);
});

test('chapters 0 to 9 validate, in order, with real narrative', () => {
  const cs = chapters();
  assert.deepEqual(cs.map((c) => chapterSchema.parse(c.data).order), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  for (const c of cs) {
    assert.ok(c.body.trim().split(/\s+/).length >= 40, `${c.file}: narrative too short`);
    assert.doesNotMatch(c.body, /lorem|ipsum|TODO|TBD/i, `${c.file}: placeholder text`);
  }
});

test('cross-references: scenes, slots and gates exist and agree', () => {
  const scenes = Object.fromEntries(entries('scenes.json')) as Record<string, { chapter: number }>;
  const cs = chapters().map((c) => chapterSchema.parse(c.data));
  for (const c of cs) {
    for (const s of c.scenes) {
      assert.ok(scenes[s], `chapter ${c.order}: unknown scene ${s}`);
      assert.equal(scenes[s].chapter, c.order, `scene ${s} belongs to chapter ${scenes[s].chapter}`);
    }
    for (const a of c.artefacts) if (a.kind === 'slot') assert.ok(SLOT_IDS.includes(a.slot), a.slot);
  }
  assert.deepEqual(cs.filter((c) => c.gate).map((c) => c.gate), ['G1', 'G2', 'G3', 'G4'], 'chapters 4-7 each end at one gate');
  const registry = Object.keys(json('slots.json')).filter((k) => !k.startsWith('$')).sort();
  assert.deepEqual(registry, [...SLOT_IDS].sort(), 'slots.json registry matches SLOT_IDS');
});

test('no time, duration or cost figures in authored content (Gate 1 Q6)', () => {
  const text = [...['site.json', 'roles.json', 'gates.json', 'scenes.json', 'setup.json', 'credits.json'].map((f) => readFileSync(join(CONTENT, f), 'utf8')),
    ...chapters().map((c) => `${JSON.stringify(c.data)}\n${c.body}`)].join('\n')
    .replace(/US\$5M/g, ''); // FLUX Klein's licence threshold, not a cost
  assert.doesNotMatch(text, /\b\d+\s*(?:minutes?|mins?|hours?|hrs?|seconds?|days?|weeks?)\b|\$\s?\d|\btokens?\b/i);
  // Words, not just figures (Front-end's review): no costs, prices, budgets or durations in the story.
  const words = text.match(/\b(?:costs?|costing|prices?|priced|cheap|expensive|budgets?|afternoon|morning|evening|overnight|hours?|minutes?|seconds|days?|weeks?|months?|quickly|instantly)\b/gi);
  assert.equal(words, null, `time or cost words in copy: ${words?.join(', ')}`);
});

test('computed collections validate', () => {
  for (const r of requirements().rows) requirementSchema.parse(r);
  numbersSchema.parse(numbers());
  const schema = slotSchema();
  for (const mode of ['auto', 'pending', 'filled']) {
    for (const s of Object.values(resolveSlots(mode, false))) schema.parse(s);
  }
});
