import type { APIRoute } from 'astro';
import { getChapters, getSite } from '../lib/content';

/** Markdown twin of the home story, generated from the same chapter files as the page. */
export const GET: APIRoute = async () => {
  const site = await getSite();
  const chapters = await getChapters();
  const body = [
    `# ${site.heroLine}`,
    '',
    `${site.setupIntro} \`${site.setupSentence}\``,
    '',
    site.whatHappensNext,
    '',
    site.gpuNotice,
    '',
    ...chapters
      .filter((c) => c.data.order > 0)
      .flatMap((c) => [`## ${c.data.title}`, '', `_${c.data.dek}_`, '', (c.body ?? '').trim(), '']),
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
