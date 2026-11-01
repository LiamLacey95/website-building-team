import type { APIRoute } from 'astro';
import { CHAPTERS, SITE } from '../data/site';

/** Agent-readable summary (llms.txt convention): what this is, the setup sentence, and where to read more. */
export const GET: APIRoute = ({ site }) => {
  const url = (p: string) => new URL(p, site).href;
  const body = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    `To set it up, open the repo in Claude Code or T3 Code and say: "${SITE.setupSentence}"`,
    '',
    '## Read more',
    '',
    `- [The story as Markdown](${url('/story.md')}): ${CHAPTERS.length} chapters, from one sentence to a launched site`,
    `- [Set it up](${url('/setup/')}): requirements (an NVIDIA GPU is required), what happens, FAQ`,
    `- [How this site was made](${url('/made/')})`,
    `- [Repository](${SITE.repoUrl}): README.md, BOOTSTRAP.md, .team/PLAYBOOK.md`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
