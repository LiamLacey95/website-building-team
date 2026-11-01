/**
 * Redaction: one pattern list for the redaction step and the post-build scan of dist/
 * (api/stack-proposal.md, "Redaction"). Strips machine paths, T3 thread ids, UUIDs and emails.
 */

const STOP = `[^\\s"'<>()\\]\`]*`;

export const PATTERNS: Array<{ name: string; re: RegExp; replace: string }> = [
  { name: 'windows-path', re: new RegExp(`\\b[A-Za-z]:[\\\\/]${STOP}`, 'g'), replace: '<local path>' },
  { name: 'msys-path', re: new RegExp(`(?<![\\w.])/[a-z]/(?:Users|home|[A-Za-z][\\w.-]*)/${STOP}`, 'g'), replace: '<local path>' },
  { name: 'posix-home', re: new RegExp(`(?<![\\w.])/(?:home|Users)/[^/\\s]+${STOP}`, 'g'), replace: '<local path>' },
  { name: 'unc-path', re: new RegExp(`\\\\\\\\[^\\\\\\s]+\\\\${STOP}`, 'g'), replace: '<local path>' },
  { name: 't3-thread', re: /thread:mcp:[0-9a-f-]{36}:[\w.:-]+|t3-thread:\/\/\S+/gi, replace: '<thread>' },
  { name: 'uuid', re: /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, replace: '<id>' },
  { name: 'email', re: /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g, replace: '<email>' },
];

/** All spellings of a folder as it may appear in text: back/forward slash, drive case, Git Bash form. */
function spellings(root: string): string[] {
  const fwd = root.replace(/\\/g, '/').replace(/\/+$/, '');
  const out = new Set([fwd, fwd.replace(/\//g, '\\')]);
  const m = fwd.match(/^([A-Za-z]):\/(.*)$/);
  if (m) {
    for (const d of [m[1].toUpperCase(), m[1].toLowerCase()]) {
      out.add(`${d}:/${m[2]}`);
      out.add(`${d}:\\${m[2].replace(/\//g, '\\')}`);
    }
    out.add(`/${m[1].toLowerCase()}/${m[2]}`);
  }
  return [...out].sort((a, b) => b.length - a.length);
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Redact one string. Paths inside `repoRoot` become repo-relative first (they can contain spaces, which
 * the generic patterns stop at), and the bare root becomes `<repo>`; then the generic patterns run.
 */
export function redact(text: string, repoRoot?: string): string {
  let s = text;
  if (repoRoot) {
    for (const sp of spellings(repoRoot)) {
      s = s.replace(new RegExp(`${escapeRe(sp)}[\\\\/]`, 'gi'), '').replace(new RegExp(escapeRe(sp), 'gi'), '<repo>');
    }
  }
  for (const p of PATTERNS) s = s.replace(p.re, p.replace);
  return s;
}

/** Findings for the post-build scan: every match of every pattern, with its name. */
export function scan(text: string): Array<{ name: string; match: string; index: number }> {
  const hits: Array<{ name: string; match: string; index: number }> = [];
  for (const p of PATTERNS) {
    for (const m of text.matchAll(new RegExp(p.re.source, p.re.flags))) hits.push({ name: p.name, match: m[0], index: m.index ?? 0 });
  }
  return hits;
}
