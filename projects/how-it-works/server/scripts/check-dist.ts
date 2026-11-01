#!/usr/bin/env node
/**
 * Post-build checks on the built site (run after `astro build`, locally and in the Vercel build command):
 *   1. CSP: no inline <script> (without src), no <style> blocks, no style="" attributes. vercel.json sends
 *      script-src 'self' and style-src 'self', so any of these would be blocked in production.
 *   2. Redaction: no machine paths, T3 ids, UUIDs or emails in any text file (same patterns as redact.ts).
 *   3. Size budget: dist/ under 150 MB.
 *
 *   node projects/how-it-works/server/scripts/check-dist.ts [distDir]   (default: projects/how-it-works/web/dist)
 * Exit 0 clean, 1 findings, 2 usage error.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { PROJECT } from '../content/paths.ts';
import { scan } from '../content/redact.ts';

const BUDGET_MB = 150;
const TEXT = new Set(['.html', '.txt', '.md', '.xml', '.json', '.js', '.css', '.webmanifest', '.svg']);
const dist = resolve(process.argv[2] ?? join(PROJECT, 'web', 'dist'));
if (!existsSync(dist)) { console.error(`check-dist: ${dist} not found (build first)`); process.exit(2); }

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? files(p) : [p];
  });
}

const all = files(dist);
const findings: string[] = [];
const relp = (p: string) => p.slice(dist.length + 1).replace(/\\/g, '/');

for (const f of all) {
  const ext = extname(f).toLowerCase();
  if (!TEXT.has(ext)) continue;
  const text = readFileSync(f, 'utf8');
  if (ext === '.html') {
    for (const m of text.matchAll(/<script\b([^>]*)>/gi)) {
      if (!/\bsrc=/.test(m[1]) && !/type=["']?application\/(ld\+json|json)/i.test(m[1])) findings.push(`${relp(f)}: inline <script${m[1]}> (blocked by script-src 'self')`);
    }
    if (/<style\b/i.test(text)) findings.push(`${relp(f)}: <style> block (blocked by style-src 'self'; set build.inlineStylesheets: 'never')`);
    for (const m of text.matchAll(/\sstyle=["'][^"']*["']/gi)) findings.push(`${relp(f)}: style attribute ${m[0].trim().slice(0, 60)}`);
  }
  for (const h of scan(text)) findings.push(`${relp(f)}: ${h.name} "${h.match.slice(0, 60)}"`);
}

const mb = all.reduce((n, f) => n + statSync(f).size, 0) / 1024 / 1024;
if (mb > BUDGET_MB) findings.push(`dist/ is ${mb.toFixed(1)} MB, over the ${BUDGET_MB} MB budget`);

console.log(`check-dist: ${all.length} files, ${mb.toFixed(1)} MB`);
if (findings.length) {
  console.error(`${findings.length} finding(s):\n- ${[...new Set(findings)].slice(0, 50).join('\n- ')}`);
  process.exit(1);
}
console.log('clean: no inline scripts or styles, no machine paths or ids, within budget');
