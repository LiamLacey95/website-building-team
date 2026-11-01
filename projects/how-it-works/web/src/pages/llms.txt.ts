import type { APIRoute } from 'astro';
import { getChapters, getSite } from '../lib/content';

/** Agent-readable summary (llms.txt convention): what this is, the setup sentence, and where to read more. */
export const GET: APIRoute = async ({ site: origin }) => {
  const site = await getSite();
  const chapters = await getChapters();
  const url = (p: string) => new URL(p, origin).href;
  const body = [
    `# ${site.name}`,
    '',
    `> ${site.meta.description}`,
    '',
    `To set it up, open the repo in Claude Code or T3 Code and say: "${site.setupSentence}"`,
    '',
    site.gpuNotice,
    '',
    '## Read more',
    '',
    `- [The story as Markdown](${url('/story.md')}): ${chapters.length} chapters, from one sentence to a launched site`,
    `- [Set it up](${url('/setup/')}): requirements, what happens, questions`,
    `- [How this site was made](${url('/made/')})`,
    `- [Repository](${site.repoUrl}): README.md, BOOTSTRAP.md, .team/PLAYBOOK.md`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
