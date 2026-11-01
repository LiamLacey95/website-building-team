# Story outline: the home page

The home page follows **this site's own prompt** through the team. It enters at the top as one sentence and leaves at the bottom as the page you are reading.

The double diamond is the spine (P2):
- the hero diagram;
- a slim progress rail on wide screens;
- the chapter nav.

The four gates are drawn on it as named checkpoints. Every chapter pairs a claim with a real artefact (P1).

Legend: **Now** = the artefact exists today. **Slot (Phase 5)** = produced by a later phase; the build leaves a slot that is filled at Phase 5. Paths are relative to `projects/how-it-works/` unless they start with a repo-root folder (`.team/`, `artgen/`, `tools/`).

## Spine: how the phases map onto the diamond

```
   Discover        Define    |G1|   Develop                          Deliver      |G4|
  <-- diverge --> <- converge ->   <-- diverge: Concept |G2| -->  <-- converge: Variations |G3|, Build, QA -->
  first diamond: which site?       second diamond: which design, built how?
```

- **Gate positions.** G1 sits at the first diamond's point. G2 and G3 sit inside the second diamond (directions, then variations). G4 sits at the end.
- **Loop-backs.** Each gate draws a small return arc labelled "revise: …". This counters the common one-way reading of the Double Diamond *(inferred)*.
- **Credit.** "Double Diamond by the Design Council, CC BY 4.0, adapted."

## Chapters

| # | Chapter (working title) | What it says | Real artefact shown | Status | Gate / loop-back |
|---|---|---|---|---|---|
| 0 | **Hero**: "This website started as one sentence." | The whole idea in one line, then the setup sentence as the call to action | The diagram (static inline SVG); setup block with copy button and the "what happens next" line | Now | Diagram shows G1 to G4 as named dots |
| 1 | **The sentence** (Intake) | The human typed one line, and a thread became the project manager | The prompt verbatim from `BRIEF.md`: "your first website that i want you to build is a creative website that runs through how this works." `BRIEF.md` excerpt (goals, open questions) | Now | n/a |
| 2 | **The studio** (six roles) | Six long-lived threads. Each owns folders and talks through briefs and reports. Shown as a status board with one lane per agent (the Cursor pattern, `../competitors.md`) | Role cards from `.team/roles/*.md`; the STATUS roster; one real brief (`briefs/01-research-discover.md`) and the DONE message format | Now | n/a |
| 3 | **Discover**: looking around | Research read 8 sites, wrote 3 personas, gathered 20 references and the constraints, and cited every claim | `research/SUMMARY.md` (three insights quoted), counts, persona cards. Only our own documents, **not** third-party screenshots (licence, see `../constraints.md`) | Now | n/a |
| 4 | **Define**, then **Gate 1: strategy and scope** | Research and the PM turn the findings into positioning, pages and a plan. The human answers the open questions | `research/define/*`; `gates/G1-*/README.md`; the human's G1 answers from `.team/DECISIONS.md` | Define: Now. G1 packet and decision: **Slot (Phase 5)** | Gate card. Loop-back shown if the human said "revise" |
| 5 | **Concept**: three directions, made on a local GPU | Concept made three distinct directions, with key art generated in ComfyUI. Every image records its prompt and model in a sidecar | Three style tiles (`concepts/*/`); one hero image with its `.json` sidecar shown as a "label"; timing from `artgen/README.md` (for example ~30 s per 2 MP Klein image); the commercial-licence guardrail | **Slot (Phase 5)**. Workflow facts: Now | **Gate 2: creative direction**: the three side by side and the human's pick |
| 6 | **Variations**: three websites at once | Front-end built three coded versions in parallel git worktrees and screenshotted each at 390, 768, 1440 and 1920 px. Impeccable, in one plain sentence: a design vocabulary the agents share, and a slop detector their work must pass | Gate 3 contact sheet (`screenshots/`); `variants/*.md` hypotheses; Impeccable detector result; branch names | **Slot (Phase 5)**. Dry-run precedent: Now (`.team/history/2026-11-01-initial-setup/frontend-dryrun-screenshots/`) | **Gate 3: design selection**: the human's pick or combination |
| 7 | **Build and review**: nothing ships without a second opinion | Front-end and Backend built the chosen variation. Review is read-only outside its own folder, audits everything, and can send work back | Review verdicts (`review/*.md`, `gates/G4-*/review.md`); Lighthouse, axe and contrast results; detector output | **Slot (Phase 5)** | **Gate 4: release sign-off**. Loop-back: the issues Review sent back, if any |
| 8 | **The receipt** | What it took: the git log as a strip of role-prefixed commits, plus time (and cost, if approved: `gate1-questions.md` Q6) | `git log` at build time; counts of briefs, reports, commits and images generated | Partly Now (the log grows). Figures: **Slot (Phase 5)** | n/a |
| 9 | **Your turn**: set it up | Honest requirements, the sentence again, what bootstrap does, links to README and BOOTSTRAP | Requirements from `README.md` and `BOOTSTRAP.md` §1; sample `node scripts/bootstrap.mjs --check` output | Now (output captured by Backend) | n/a |
| n/a | Footer | Credits and licences summary, privacy note, repo link, "this site's source" | `README.md` Licences | Now (repo licence decided at G1) | n/a |

Chapters 4 to 7 share one **gate card** component. It shows four things:
- what the human saw (a thumbnail of the packet);
- the options (A/B/C, combine, or "revise: …");
- what they chose (verbatim if approved, `gate1-questions.md` Q5);
- what changed because of it.

This turns Shape Up's idea of a named pause into a component.

## Where the setup sentence appears

1. **Hero** (chapter 0): copy block plus "what happens next", above the fold at 390 px.
2. **Chapter 9**: the copy block again, with the requirements beside it.
3. **On wide screens, quietly**: the progress rail ends in a small "Set it up" link to chapter 9. No sticky banner, because of WCAG 2.4.11 (focus not obscured).
4. **`/setup/` page and `llms.txt`**, as plain text.

## Reduced-motion version (P3)

- **When it applies:** whenever the visitor has `prefers-reduced-motion: reduce`, or has used the on-page "Reduce motion" toggle in the header (which pauses all motion).
- **What it shows:**
  - The same chapters in the same order, with every artefact visible from the start.
  - The diagram static, with the current chapter marked by a solid fill instead of an animated draw.
  - Gate cards fully expanded. Nothing auto-advances.
- **What it never loses:** information. Motion only adds emphasis: drawing the diamond as you scroll, artefacts sliding in, the "prompt token" travelling along the spine.

## No-JS version

- Everything is server-rendered HTML. The story, the artefacts and the inline-SVG diagram all work without JS.
- **Copy button:** without JS it is a selectable `<code>` block with "Select and copy" text. The button is progressive enhancement.
- **Motion toggle:** hidden without JS. CSS still honours the OS setting.
- **Navigation:** the chapter nav and progress rail are plain anchor links.
- **Scroll effects:** pure CSS under `@supports (animation-timeline: view())`, so they need no JS where supported.

## Mobile (390 px)

- Single column.
- The progress rail becomes a compact "Chapter 3 of 9" anchor menu at the top of each chapter.
- Gate cards stack.
- Contact sheets show one width at a time, switched with buttons, not swipe (WCAG 2.5.7).

## What this outline constrains in the stack (for Backend)

1. **Build-time content pipeline.** Chapters 3 to 8 read real files from `projects/how-it-works/` and the repo root:
   - markdown excerpts;
   - concept images with `.json` sidecars;
   - screenshot manifests;
   - `.team/DECISIONS.md`;
   - `git log`.

   The build must tolerate **missing slots**. Before Phase 5 a slot renders a clear "This happens at Gate N" placeholder, never lorem ipsum. It fills automatically once the files exist.
2. **Git history in CI.** The Actions checkout needs full history (`fetch-depth: 0`) for chapter 8.
3. **Image pipeline.** Concept PNG masters and contact-sheet screenshots must become responsive AVIF/WebP at build time, keeping the published site well under GitHub Pages' 1 GB.
4. **Excerpt markers.** A way to mark which part of a markdown file to quote (by heading or marker comment), so excerpts stay true to their source.
5. **No runtime content fetching.** Avoid Linear's "Loading…" problem. At most two small JS islands, copy button and motion toggle, plus optional cookieless analytics.
6. **Second outputs.** `llms.txt` and a markdown twin of the story, generated from the same content.
7. **Base path.** GitHub Pages serves a project site under `/<repo>/`, which every artefact link must respect.
