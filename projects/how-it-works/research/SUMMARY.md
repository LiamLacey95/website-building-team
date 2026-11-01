# Research summary: how-it-works

Date: 2026-11-01. One page. The detail is in `competitors.md`, `personas.md`, `content-inventory.md`, `reference-board.md`, `constraints.md` and `refs/`.

## The brief in one line

A creative, fast, accessible site that shows people who use AI agents, and studios weighing them, how one prompt becomes a launched website through six agents and four human gates. It has to make them copy one sentence: "Set up the website building team from BOOTSTRAP.md."

## Three insights that should shape the design

1. **Trust is the bottleneck, and our real artefacts are the answer.**
   - In Stack Overflow's 2025 survey, 84% of developers use or plan to use AI tools, but only 3.1% highly trust their output (https://survey.stackoverflow.co/2025/ai). 93% say trust requires source attribution (https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/).
   - "AI slop" is being measured: one blogger's analysis (Adrian Krebs) of 500 Show HN sites found gradients on 28% and five or more tells on 21% (https://www.gigazine.net/gsc_news/en/20260423-design-slop).
   - None of the agent product sites in our set shows its own process end to end. Claude Code's real transcript is the closest.
   - **Design implication:** follow **this site's own prompt** through the team. Pair every claim with the real file that proves it: brief, research, three directions, three variations, gate packets, Review verdict, git log. The artefacts are the spectacle. This is what Transformer Explainer does with your own input (https://poloclub.github.io/transformer-explainer/), applied to a real run.

2. **One sentence and one diagram carry everything.**
   - Factory puts its install command with a copy button straight under the hero CTAs (`refs/factory-desktop.webp`), and Claude Code prints its command twice.
   - Shape Up teaches its whole method through one reusable diagram with named pauses (https://basecamp.com/shapeup/3.4-chapter-13).
   - The Double Diamond is CC BY 4.0, so we may redraw it with credit (https://www.designcouncil.org.uk/our-resources/the-double-diamond/).
   - **Design implication:**
     - The hero holds the setup sentence with a copy button and a "what happens next" line. Repeat it at the end.
     - The double diamond, with the four gates marked as named checkpoints, is the hero visual, the progress indicator and the chapter navigation.
     - Show a loop back at each gate ("revise: …") so the process doesn't read as linear. The Double Diamond is often read as a one-way sequence *(inferred)*.

3. **"Creative" must not mean heavy or inaccessible, and in Nov 2026 it no longer has to.**
   - None of the three acclaimed explainers respects `prefers-reduced-motion`. Transformer Explainer downloads a 600 MB model on load.
   - CSS scroll-driven animations now work in Chrome, Safari 26+ and Firefox 159+ (https://caniuse.com/mdn-css_properties_animation-timeline).
   - Scroll-jacking measurably hurts users (https://www.nngroup.com/articles/scrolljacking-101/).
   - **Design implication:**
     - Native scroll, with CSS-native scroll effects under `@supports`, and a static story by default.
     - A visible "Reduce motion" toggle; Kirby's site shows playful and accessible together (`refs/board/c4-kirby-desktop.webp`).
     - Drag alternatives (WCAG 2.5.7), no hover-only detail, and no cookie banner (we need none).
     - Spend the creative budget on art direction and the ComfyUI imagery, not on JavaScript.

## Audience at a glance

- **Maya, the agent-native builder.** Needs to see the mechanics and proof that the output isn't slop. Objects to token cost and context loss between handoffs.
- **Tomás, the studio owner or freelancer.** Needs to see that humans decide at the right moments, the quality bar, and image licences he can explain to a client. Objects that the work may not be billable quality and that ownership of AI images is unclear.
- **Sam, handed the repo.** Needs one overview, plain definitions and honest requirements. Objects to the 12 GB NVIDIA GPU (about $856 for an RTX 5070 in Oct 2026), Mac limits and ComfyUI setup pain.

## Competitive gap

No one explains a multi-agent design process end to end with its real outputs:

- Agent product sites (Cursor, Claude Code, CrewAI) sell capability with mockups.
- Studio process pages (Work & Co) are text only.
- The great explainers (Ciechanowski, the Pudding) aren't about AI work.

The gap is an honest, art-directed "watch it happen" explainer that is itself the proof.

## Must-haves

- **Pages:** story home with an embedded case study, Set up (requirements, FAQ), credits and licences, and optionally `llms.txt` or a markdown twin.
- **Integrations:** copy-to-clipboard and a GitHub link. Analytics only if cookieless.
- **Constraints:**
  - WCAG 2.2 AA including 2.5.7 and 2.4.11.
  - Reduced-motion path.
  - GitHub Pages base path, 1 GB limit, meta-tag CSP.
  - FLUX Klein output allowed only under US$5M revenue.
  - Credit Impeccable's NOTICE.
  - Self-hosted OFL fonts.

## Recommended answers to the brief's open questions

| # | Question | Recommendation | Evidence |
|---|---|---|---|
| 1 | Product name | **Keep "Website Building Team"** as the product and repo name: plain, searchable, and matches the clone URL. Let Concept give it a wordmark and voice rather than invent a studio name. | Concrete names beat superlatives in our set (Cursor's interchangeable claims vs. Claude Code's concrete tasks, `competitors.md`). Persona Sam arrives from a GitHub link and needs the names to match *(inferred)*. |
| 2 | Hosting | **GitHub Pages from this repo, deployed by Actions. Public at Gate 4**, as the brief says. Custom domain optional. | Free with HTTPS, limits comfortable (1 GB, 100 GB/month). Transformer Explainer runs on Pages. Caveats: base path and no custom headers (`constraints.md`). |
| 3 | How meta | **Fully meta, as the spine, not a strand.** The story is "follow this site's prompt", and every chapter shows the real artefact. A separate "How this site was made" deep dive holds the full gate packets. | Insight 1. Trust needs attribution (93%), and proof convinced every persona. Note the dependency: the artefacts for G2 to G4 appear only as the project runs, so the build must leave slots that are filled at Phase 5. |
| 4 | Repo licence | **Apache-2.0.** MIT is acceptable. | Impeccable is Apache-2.0 with a NOTICE. One Apache licence plus a NOTICE covers everything and adds a patent grant. MIT and Apache are compatible (https://www.apache.org/legal/resolved.html). |

## Open questions for the human (new)

- May the site quote agent messages and reports verbatim, and show the human's own gate decisions?
- Should the site state a run's time or cost? It's honest and persuasive, but someone has to measure it from the start of this project.
- Is there a fallback for people without an NVIDIA GPU (skip image generation, or use stock images)? The site should say whichever is true.
