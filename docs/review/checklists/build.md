# Build phase: continuous code review checklist

Run this on each change the PM is about to merge (or has merged) to `master`. Use `git diff <base>..<head> -- projects/<slug>/web projects/<slug>/server`.
Report: `projects/<slug>/review/<brief id>-build-<short sha>.md`.

## Correctness
- [ ] The change does what its brief says; check the acceptance criteria one by one.
- [ ] The build and tests pass locally (`npm run build`, `npm test` or the documented equivalent in `projects/<slug>/web`). Paste the result.
- [ ] Edge cases: empty data, long strings, missing images, API errors and a slow network all have a defined state.
- [ ] Front-end uses the API exactly as `projects/<slug>/api/` describes, including types, status codes and error shapes.

## Security
- [ ] No secrets in the diff (keys, tokens, `.env` contents). Grep for `key`, `secret`, `token`, `password`.
- [ ] No machine paths or personal data in committed files (absolute drive or home paths, emails). Machine paths belong in `team.config.json`.
- [ ] All user input is validated server-side; no string-built SQL or shell commands; output is escaped; no `innerHTML` or `dangerouslySetInnerHTML` with untrusted data.
- [ ] Forms have CSRF protection or same-site cookies, rate limiting or a honeypot, and server-side validation.
- [ ] Security headers are planned or set: CSP, HSTS, X-Content-Type-Options, Referrer-Policy.
- [ ] New dependencies are justified, maintained and licence-compatible; `npm audit` shows no new high or critical issue.

## Semantic HTML and accessibility
- [ ] Real elements are used: `button` for actions, `a` for navigation, `label` tied to inputs, lists for lists, landmarks.
- [ ] Headings are in order; images have meaningful `alt` (or `alt=""` when decorative); icon-only controls have accessible names.
- [ ] Focus states are styled, not removed; `outline: none` without a replacement is MAJOR.
- [ ] `node a11y.mjs` (from `docs/review/tools/`) on the affected pages shows no new serious or critical violations.

## Design quality
- [ ] From `tools/`: `npx impeccable detect <changed files or page URL>` adds no new unjustified findings compared with the last reviewed state.
- [ ] Colours, spacing, type sizes and radii come from design tokens or CSS variables, consistent with `projects/<slug>/DESIGN.md`. A hard-coded hex or pixel value that duplicates a token is MINOR; many of them are MAJOR.

## Maintainability
- [ ] Components are reused, not copy-pasted; there is no dead code or commented-out block.
- [ ] Naming matches the codebase, and files sit in the owner's paths.

## Performance
- [ ] Images are responsive (`srcset` and `sizes`), AVIF or WebP, with width and height set (for CLS), and lazy-loaded below the fold.
- [ ] Any new generated image has its sidecar beside it and passes `node licences.mjs <path>`.
- [ ] No heavy library is added for a trivial job; the JS bundle size change is noted.
- [ ] Fonts are subset and use `font-display: swap`, and the critical font is preloaded.

## Process
- [ ] The commit touches only the author's owned paths, was made with a pathspec (`git commit -- <paths>`), and the message follows `<role>: <what>`.
