import type { APIRoute } from 'astro';
import { CHAPTERS, SITE } from '../data/site';

/** Markdown twin of the home story, generated from the same content as the page. */
export const GET: APIRoute = () => {
  const body = [
    `# ${SITE.heroLine}`,
    '',
    `Yours starts with this one: \`${SITE.setupSentence}\``,
    '',
    SITE.whatHappensNext,
    '',
    ...CHAPTERS.flatMap((c) => [
      `## ${c.title}`,
      '',
      c.summary,
      ...(c.gate ? ['', `_This chapter's artefacts arrive at Gate ${c.gate.slice(1)}._`] : []),
      '',
    ]),
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
