/**
 * Placeholder site copy for the scaffold. Real story content arrives through Backend's content model
 * (projects/how-it-works/api/contract.md) and Concept's voice at Gate 2. Nothing here is lorem ipsum:
 * it is the agreed working copy (PRODUCT.md, Gate 1 decision) or an honest placeholder.
 */
export const SITE = {
  name: 'Website Building Team',
  setupSentence: 'Set up the website building team from BOOTSTRAP.md.',
  heroLine: 'This website started as one sentence. Here’s everything that happened next.',
  whatHappensNext:
    'That thread becomes your project manager. It sets up the tools, creates five agent threads, and asks for your first website prompt.',
  description: 'Six AI agents, four human gates, one prompt to a launched website. This site is its own case study.',
  repoUrl: 'https://github.com/LiamLacey95/website-building-team',
} as const;

export interface Chapter {
  id: string;
  title: string;
  summary: string;
  gate?: 'G1' | 'G2' | 'G3' | 'G4';
}

/** Home story chapters (research/define/story-outline.md). Ids are stable anchors. */
export const CHAPTERS: readonly Chapter[] = [
  { id: 'sentence', title: 'The sentence', summary: 'One line typed by a human, and a thread became the project manager.' },
  { id: 'studio', title: 'The studio', summary: 'Six long-lived threads, each owning its own folders, talking through briefs and reports.' },
  { id: 'discover', title: 'Discover', summary: 'Research looks around: competitors, personas, references, constraints.' },
  { id: 'define', title: 'Define, then Gate 1', summary: 'Positioning, pages and a plan. The human answers the open questions.', gate: 'G1' },
  { id: 'concept', title: 'Concept, then Gate 2', summary: 'Three creative directions, with key art generated on a local GPU.', gate: 'G2' },
  { id: 'variations', title: 'Variations, then Gate 3', summary: 'Three coded versions built in parallel worktrees, screenshotted at four widths.', gate: 'G3' },
  { id: 'review', title: 'Build and review, then Gate 4', summary: 'Nothing ships without a second opinion.', gate: 'G4' },
  { id: 'receipt', title: 'The receipt', summary: 'What it took, as a strip of role-prefixed commits.' },
  { id: 'your-turn', title: 'Your turn', summary: 'Honest requirements, the sentence again, and what bootstrap does.' },
];

export const NAV = [
  { href: '/', label: 'Story' },
  { href: '/made/', label: 'How this site was made' },
  { href: '/setup/', label: 'Set it up' },
  { href: '/credits/', label: 'Credits' },
] as const;
