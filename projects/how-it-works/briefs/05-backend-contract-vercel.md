# Brief 05-backend-contract-vercel (project: how-it-works)

Owner: Backend. Phase: 3, in parallel with Concept. Read `gates/G1-strategy/DECISION.md` first: it overrides the stack proposal where they differ.

What changed:
- **Hosting is Vercel** (Q2 C), at the site root.
- **Quotes and decisions are written for the story**, not mined from the repo (Q5), so the verbatim-excerpt and marker pipeline is no longer needed.
- **No time or cost figures** (Q6) and **no analytics** (Q9).
- **FLUX Klein images may ship** (Q11 A); keep the licence guard.
- **Creativity and polish are the measure**, and the JS budget is relaxed.

Deliverables:
1. **Update `api/stack-proposal.md`**:
   - a "Gate 1 changes" section;
   - Vercel deploy: static output, `vercel.json` if needed, headers including a real CSP header instead of a meta tag, preview deployments per branch (useful for Gate 3 variants), and what the human must do at Gate 4 (account, project link, environment);
   - drop or simplify the parts Q5 and Q6 removed.
   - Keep: the licence guard, the redaction scan (the site may still show real images and screenshots), the image pipeline, `llms.txt` and `story.md`.
2. **Content model and contract** (`api/contract.md` plus `server/contracts/` types): the content the site renders. Includes chapters, the six roles (with made-up but plausible dialogue lines), the four gates (options shown and the fictional decision), the setup block, requirements (read from `README.md` and `BOOTSTRAP.md` at build time), credits and licences. Authored content lives as Astro content collections (Markdown or JSON) in the project. Agree the shape with Front-end; you may message it directly.
3. **Fixtures:** a first draft of real copy for every chapter (no lorem), written in a vivid voice; Concept's direction will refine the tone later. Mark it draft.
4. **Vercel readiness:** confirm the Vercel CLI works via npx, without logging in, and that `vercel build` or an equivalent local build produces the expected output. **Do not create an account, log in, link a project or deploy**: that needs the human at Gate 4.

When done: commit with a pathspec, write `reports/05-backend-contract-vercel-backend.md`, send DONE, then wait.
