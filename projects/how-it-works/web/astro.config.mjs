// @ts-check
import { defineConfig } from 'astro/config';

// Static site, deployed to Vercel at the site root (Gate 1, Q2): no `base`.
// SITE_URL is set once the Vercel domain exists; the placeholder keeps canonical and llms.txt URLs well-formed.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://website-building-team.example',
  output: 'static',
  // Shiki emits inline styles, which the CSP blocks. Re-enable with a CSP-safe highlighter if code blocks arrive.
  markdown: { syntaxHighlight: false },
  trailingSlash: 'ignore',
  // CSP is a real header (vercel.json, Backend): script-src 'self'; style-src 'self'. So nothing may be inline:
  // stylesheets and scripts are always external files, and components follow the inline bans in README.md.
  build: { inlineStylesheets: 'never' },
  vite: {
    build: { assetsInlineLimit: 0 },
    // Content schemas and loaders live in ../server (Backend's contract); they import zod from outside web/.
    resolve: { dedupe: ['zod'] },
    // Dev server may read the project folder (../server, ../concepts), nothing above projects/how-it-works.
    server: { fs: { allow: ['..'] } },
  },
});
