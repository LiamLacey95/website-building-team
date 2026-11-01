#!/usr/bin/env node
/**
 * Post-build checks on the built site (run after `astro build`, locally and in the Vercel build command):
 *   1. CSP, as a browser enforces it: the header policy from ../vercel.json AND any per-page
 *      <meta http-equiv="Content-Security-Policy"> (Astro security.csp) both apply. An inline <script> or
 *      <style> passes only if every policy that governs it (script-src / style-src, else default-src) allows
 *      it, which with hashes means listing its sha256/384/512. With today's strict header ('self', no
 *      hashes) that means no inline code at all. style="" attributes are always flagged (hashes don't cover
 *      them).
 *   2. Redaction: no machine paths, T3 ids, UUIDs or emails in any text file (same patterns as redact.ts).
 *   3. Size budget: dist/ under 150 MB.
 *
 *   node projects/how-it-works/server/scripts/check-dist.ts [distDir]   (default: projects/how-it-works/web/dist)
 * Exit 0 clean, 1 findings, 2 usage error.
 */
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { PROJECT } from '../content/paths.ts';
import { scan } from '../content/redact.ts';

const BUDGET_MB = 150;
const TEXT = new Set(['.html', '.txt', '.md', '.xml', '.json', '.js', '.css', '.webmanifest', '.svg']);
const dist = resolve(process.argv[2] ?? join(PROJECT, 'web', 'dist'));
if (!existsSync(dist)) { console.error(`check-dist: ${dist} not found (build first)`); process.exit(2); }

type Policy = Map<string, string[]>;

function parsePolicy(value: string): Policy {
  const map: Policy = new Map();
  for (const part of value.replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').split(';')) {
    const [name, ...srcs] = part.trim().split(/\s+/);
    if (name) map.set(name.toLowerCase(), srcs);
  }
  return map;
}

/** The CSP header vercel.json sends on every route, if any. */
function headerPolicy(): Policy | null {
  const file = join(PROJECT, 'vercel.json');
  if (!existsSync(file)) return null;
  const cfg = JSON.parse(readFileSync(file, 'utf8')) as { headers?: Array<{ source: string; headers: Array<{ key: string; value: string }> }> };
  const h = cfg.headers?.find((r) => r.source === '/(.*)')?.headers.find((x) => x.key.toLowerCase() === 'content-security-policy');
  return h ? parsePolicy(h.value) : null;
}

function metaPolicy(html: string): Policy | null {
  const tag = html.match(/<meta\b[^>]*http-equiv=["']?content-security-policy["']?[^>]*>/i)?.[0];
  if (!tag) return null;
  return parsePolicy(tag.match(/\bcontent=(["'])([\s\S]*?)\1/i)?.[2] ?? '');
}

/** Does this policy allow an inline element with this body under `directive`? No governing directive = yes. */
function allows(p: Policy, directive: string, body: string): boolean {
  const srcs = p.get(directive) ?? p.get('default-src');
  if (!srcs) return true;
  // 'unsafe-inline' counts only when no hash or nonce is present (browsers ignore it otherwise).
  if (srcs.includes("'unsafe-inline'") && !srcs.some((x) => /^'(sha|nonce)/.test(x))) return true;
  return ['sha256', 'sha384', 'sha512'].some((alg) => srcs.includes(`'${alg}-${createHash(alg).update(body, 'utf8').digest('base64')}'`));
}

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? files(p) : [p];
  });
}

const header = headerPolicy();
const all = files(dist);
const findings: string[] = [];
const relp = (p: string) => p.slice(dist.length + 1).replace(/\\/g, '/');

for (const f of all) {
  const ext = extname(f).toLowerCase();
  if (!TEXT.has(ext)) continue;
  const text = readFileSync(f, 'utf8');
  if (ext === '.html') {
    const meta = metaPolicy(text);
    const policies: Array<[string, Policy]> = [];
    if (header) policies.push(['the vercel.json header', header]);
    if (meta) policies.push(['the meta CSP', meta]);
    if (!policies.length) findings.push(`${relp(f)}: no CSP at all (neither a vercel.json header nor a meta tag)`);
    const blockedBy = (directive: string, body: string) => policies.filter(([, p]) => !allows(p, directive, body)).map(([n]) => n);
    for (const m of text.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      const [, attrs, body] = m;
      if (/\bsrc=/.test(attrs) || /type=["']?application\/(ld\+json|json)/i.test(attrs)) continue;
      const by = blockedBy('script-src', body);
      if (by.length) findings.push(`${relp(f)}: inline <script${attrs}> would be blocked by ${by.join(' and ')}`);
    }
    for (const m of text.matchAll(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi)) {
      const by = blockedBy('style-src', m[2]);
      if (by.length) findings.push(`${relp(f)}: inline <style> would be blocked by ${by.join(' and ')}`);
    }
    for (const m of text.matchAll(/\sstyle=["'][^"']*["']/gi)) findings.push(`${relp(f)}: style attribute ${m[0].trim().slice(0, 60)} (no CSP hash covers it)`);
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
console.log(`clean: inline code allowed by every CSP that applies (${header ? 'vercel.json header' : 'no header'} plus any meta), no machine paths or ids, within budget`);
