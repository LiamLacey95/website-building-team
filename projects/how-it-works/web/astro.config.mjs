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
  security: {
    // Astro hashes its own scripts and styles into a CSP <meta>. Component rules that keep it strict:
    // no inline event handlers, no style="" attributes, no define:vars.
    csp: true,
  },
});
