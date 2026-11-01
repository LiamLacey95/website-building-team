# Report 02-research-define (Research, project how-it-works)

State: DONE. Date: 2026-11-01.

## Delivered (projects/how-it-works/research/define/)

| File | Contents |
|---|---|
| `positioning.md` | Positioning sentence plus a short form; a value proposition per persona with the proof shown for each; tone of voice as 5 do/don't pairs; 3 hero lines, each with the setup sentence as the call to action (recommended: line 2 for home, line 3 for the share card) |
| `sitemap.md` | `/`, `/made/`, `/setup/`, `/credits/`, `/404`, `/llms.txt`, `/story.md`. Sections in order, each with its real artefact, marked Now or "Slot (Phase 5)". What we deliberately left out |
| `journeys.md` | Maya (to a copy), Tomás (to a star or share), Sam (to a copy, knowing it will work), step by step, plus an objection-to-answer map |
| `story-outline.md` | How phases map onto the diamond; 10 chapters following this site's prompt (hero, sentence, studio, Discover, Define+G1, Concept+G2, Variations+G3, Build+Review+G4, receipt, your turn); a shared gate-card pattern with loop-backs; where the setup sentence appears; reduced-motion, no-JS and mobile versions; 7 constraints on the stack |
| `metrics.md` | Success signals and targets, how to observe each without cookies (GitHub traffic API keeps 14 days and needs write access; cookieless options), and what we won't measure |
| `gate1-questions.md` | 10 questions with options and recommendations: the 4 from the brief, my 3 from Discover, and 3 that came up in Define (hero line, analytics, third-party screenshots when the repo goes public) |

## Constraints on Backend's stack (from story-outline.md)

1. A build-time content pipeline that reads `projects/how-it-works/**` and `.team/DECISIONS.md`, and **tolerates missing slots** with a "happens at Gate N" placeholder, never lorem ipsum.
2. `fetch-depth: 0` in CI, for the git-log "receipt" chapter.
3. Build-time AVIF/WebP conversion of concept PNGs and contact-sheet screenshots.
4. Excerpt markers, so quotes stay true to their source files.
5. No runtime fetching of content. At most two JS islands (copy button, motion toggle), plus optional analytics.
6. Generated `llms.txt` and `story.md`.
7. The `/<repo>/` base path.

## Notes for the PM

- **Q2 depends on Backend.** Pages on a private repo needs a paid plan, so the free route means making the repo public at G4. Backend's stack proposal should confirm this.
- **Q7 needs Concept's input before G4.** What does the Concept role do when bootstrap runs with `--skip-comfyui`?
- **Q6, option A or B, needs the PM to start noting phase start and end times now.** Git timestamps cover most of it.
- **Prices for analytics are unverified.** They come from aggregators, and Q9 says so.
