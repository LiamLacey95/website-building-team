/** Small typed helpers over the content collections (Backend's contract, api/contract.md). */
import { getCollection, getEntry } from 'astro:content';

export async function getSite() {
  const entry = await getEntry('site', 'main');
  if (!entry) throw new Error('site: entry "main" missing');
  return entry.data;
}

/** Chapters in story order (sort by data.order, never by id). */
export async function getChapters() {
  return (await getCollection('chapters')).sort((a, b) => a.data.order - b.data.order);
}

/** Role id -> short display name ("Front-end"). */
export async function roleName(): Promise<Record<string, string>> {
  return Object.fromEntries((await getCollection('roles')).map((r) => [r.id, r.data.short]));
}

export const NAV = [
  { href: '/', label: 'Story' },
  { href: '/made/', label: 'How this site was made' },
  { href: '/setup/', label: 'Set it up' },
  { href: '/credits/', label: 'Credits' },
] as const;
