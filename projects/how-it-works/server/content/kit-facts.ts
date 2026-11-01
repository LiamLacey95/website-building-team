/**
 * Facts read from the kit outside this project: the requirements table in BOOTSTRAP.md section 1, and
 * counts for "The paper trail" (commits by role, briefs, reports, concept images, gates decided).
 *
 * Vercel builds see only projects/how-it-works (Root Directory) and a 10-commit shallow clone, so both are
 * also kept as committed snapshots in server/content/generated/, refreshed by
 * `node server/scripts/sync-kit-facts.ts`. Counts only: no dates, durations or costs (Gate 1 Q6).
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';
import { GENERATED, PROJECT, REPO, repoAvailable } from './paths.ts';
import type { Numbers, Requirement } from '../contracts/schema.ts';

const ROLES = ['pm', 'research', 'concept', 'frontend', 'backend', 'review'];

// ---------------------------------------------------------------------------------------------
// Requirements
// ---------------------------------------------------------------------------------------------

/** Rows of the first table under "## 1." in BOOTSTRAP.md, as { need, minimum, notes }. */
export function parseRequirements(markdown: string): Requirement[] {
  const text = markdown.replace(/\r\n/g, '\n');
  const start = text.search(/^## 1\.\s/m);
  if (start < 0) throw new Error('BOOTSTRAP.md: no "## 1." section');
  const rest = text.slice(start + 3);
  const end = rest.search(/^## /m);
  const section = end < 0 ? rest : rest.slice(0, end);
  const rows = section.split('\n').filter((l) => /^\s*\|/.test(l));
  if (rows.length < 3) throw new Error('BOOTSTRAP.md section 1: requirements table not found');
  const cells = (l: string) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
  const header = cells(rows[0]).map((h) => h.toLowerCase());
  const iNeed = header.indexOf('need');
  const iMin = header.indexOf('minimum');
  const iNotes = header.indexOf('notes');
  if (iNeed < 0 || iMin < 0) throw new Error('BOOTSTRAP.md section 1: expected columns Need, Minimum, Notes');
  return rows.slice(2).map((r, order) => {
    const c = cells(r);
    return { order, need: c[iNeed], minimum: c[iMin], notes: iNotes >= 0 ? (c[iNotes] ?? '') : '' };
  }).filter((r) => r.need && r.minimum);
}

export function liveRequirements(): Requirement[] {
  return parseRequirements(readFileSync(join(REPO, 'BOOTSTRAP.md'), 'utf8'));
}

// ---------------------------------------------------------------------------------------------
// Numbers
// ---------------------------------------------------------------------------------------------

function listMd(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => join(dir, f));
}

function walkFiles(dir: string, keep: (p: string) => boolean, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walkFiles(p, keep, out);
    else if (keep(p)) out.push(p);
  }
  return out;
}

/** A report is named "<brief id>-<role>.md"; anything else in a briefs/ or history folder is a brief. */
const isReport = (f: string) => new RegExp(`-(${ROLES.join('|')})\\.md$`).test(basename(f));

export function liveNumbers(): Numbers {
  const git = (args: string[]) => execFileSync('git', ['-C', REPO, ...args], { encoding: 'utf8' }).trim();
  if (git(['rev-parse', '--is-shallow-repository']) === 'true') throw new Error('shallow clone: commit counts would be wrong');
  const subjects = git(['log', '--format=%s']).split('\n').filter(Boolean);
  const commitsByRole: Record<string, number> = Object.fromEntries([...ROLES, 'other'].map((r) => [r, 0]));
  for (const s of subjects) {
    const role = s.match(/^([a-z-]+):\s/)?.[1];
    commitsByRole[role && role in commitsByRole ? role : 'other'] += 1;
  }

  const projects = existsSync(join(REPO, 'projects')) ? readdirSync(join(REPO, 'projects')).map((p) => join(REPO, 'projects', p)) : [];
  const history = walkFiles(join(REPO, '.team', 'history'), (p) => p.endsWith('.md'));
  const briefFiles = [...listMd(join(REPO, '.team', 'briefs')), ...projects.flatMap((p) => listMd(join(p, 'briefs'))), ...history.filter((f) => !isReport(f))];
  const reportFiles = [...listMd(join(REPO, '.team', 'reports')), ...projects.flatMap((p) => listMd(join(p, 'reports'))), ...history.filter(isReport)];

  const conceptImages = walkFiles(join(PROJECT, 'concepts'), (p) => /\.(png|webp|jpe?g)$/i.test(p)).length;
  const gatesDecided = existsSync(join(PROJECT, 'gates'))
    ? readdirSync(join(PROJECT, 'gates')).filter((g) => existsSync(join(PROJECT, 'gates', g, 'DECISION.md'))).length
    : 0;

  return {
    commits: subjects.length,
    commitsByRole,
    briefs: briefFiles.filter((f) => !f.endsWith('.gitkeep')).length,
    reports: reportFiles.length,
    conceptImages,
    gatesDecided,
    source: 'live',
  };
}

// ---------------------------------------------------------------------------------------------
// Live or snapshot
// ---------------------------------------------------------------------------------------------

export const SNAPSHOTS = {
  requirements: join(GENERATED, 'requirements.json'),
  numbers: join(GENERATED, 'numbers.json'),
};

function snapshot<T>(file: string): T {
  if (!existsSync(file)) throw new Error(`missing snapshot ${basename(file)}: run node server/scripts/sync-kit-facts.ts`);
  return JSON.parse(readFileSync(file, 'utf8')) as T;
}

/** Live BOOTSTRAP.md when the kit is checked out, else the committed snapshot. */
export function requirements(): { source: 'live' | 'snapshot'; rows: Requirement[] } {
  if (repoAvailable()) return { source: 'live', rows: liveRequirements() };
  return { source: 'snapshot', rows: snapshot<Requirement[]>(SNAPSHOTS.requirements) };
}

/** Live git counts with full history, else the committed snapshot. */
export function numbers(): Numbers {
  if (repoAvailable()) {
    try { return liveNumbers(); } catch { /* shallow or no git: fall through */ }
  }
  return { ...snapshot<Numbers>(SNAPSHOTS.numbers), source: 'snapshot' };
}
