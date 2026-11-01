#!/usr/bin/env node
/**
 * Refresh the committed snapshots of kit facts that Vercel builds can't read
 * (Root Directory = projects/how-it-works; 10-commit shallow clone):
 *   server/content/generated/requirements.json  <- BOOTSTRAP.md section 1
 *   server/content/generated/numbers.json       <- git log and file counts (counts only, no dates)
 *
 * Run from anywhere in a full checkout:  node projects/how-it-works/server/scripts/sync-kit-facts.ts
 * --check: exit 1 if requirements.json differs from BOOTSTRAP.md (numbers always move, so they are not checked).
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';
import { liveNumbers, liveRequirements, SNAPSHOTS } from '../content/kit-facts.ts';
import { repoAvailable } from '../content/paths.ts';

if (!repoAvailable()) {
  console.error('sync-kit-facts: needs the full kit checkout (BOOTSTRAP.md and .team/ above projects/).');
  process.exit(2);
}

const req = `${JSON.stringify(liveRequirements(), null, 2)}\n`;
if (process.argv.includes('--check')) {
  const cur = existsSync(SNAPSHOTS.requirements) ? readFileSync(SNAPSHOTS.requirements, 'utf8') : '';
  if (cur !== req) {
    console.error('requirements.json is out of date with BOOTSTRAP.md. Run: node projects/how-it-works/server/scripts/sync-kit-facts.ts');
    process.exit(1);
  }
  console.log('requirements.json matches BOOTSTRAP.md');
  process.exit(0);
}

const { source: _live, ...nums } = liveNumbers();
mkdirSync(dirname(SNAPSHOTS.requirements), { recursive: true });
writeFileSync(SNAPSHOTS.requirements, req);
writeFileSync(SNAPSHOTS.numbers, `${JSON.stringify({ ...nums, source: 'snapshot' }, null, 2)}\n`);
console.log(`requirements.json: ${JSON.parse(req).length} rows`);
console.log(`numbers.json: ${nums.commits} commits, ${nums.briefs} briefs, ${nums.reports} reports, ${nums.conceptImages} concept images, ${nums.gatesDecided} gates decided`);
