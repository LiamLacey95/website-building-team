# Sitemap: how-it-works

There are five human-facing pages and two machine-readable outputs. The home page carries the story. The "How this site was made" page holds the full, unabridged evidence the story links into.

Legend:
- **Now**: the artefact exists today.
- **Slot (Phase 5)**: the artefact is produced by a later gate; the build leaves a slot that is filled at Phase 5.
- Paths are relative to `projects/how-it-works/` unless they start with a repo-root folder.

```
/                        Home: the story (chapters 0 to 9, see story-outline.md)
/made/                   How this site was made: the full case study, gate by gate
/setup/                  Set up: requirements, the sentence, what happens, FAQ, troubleshooting
/credits/                Credits and licences (+ privacy note)
/404                     Not found
/llms.txt                Agent-readable summary and links
/story.md                Markdown twin of the home story (optional; linked from llms.txt)
```

Global elements on every page:
- skip link;
- header (wordmark, chapter nav on home, "Set it up" link, Reduce motion toggle);
- footer (repo link, licence, credits, privacy note).

## `/` Home: the story

Purpose: in a few minutes, explain how one prompt becomes a website, and get the setup sentence copied. Sections follow `story-outline.md`:

| # | Section | Artefact | Status |
|---|---|---|---|
| 0 | Hero + setup sentence | Diagram SVG; setup block | Now |
| 1 | The sentence | `BRIEF.md` prompt quote | Now |
| 2 | The studio (six roles) | `.team/roles/*.md`, STATUS roster, `briefs/01-research-discover.md` | Now |
| 3 | Discover | `research/SUMMARY.md`, `research/personas.md` | Now |
| 4 | Define + Gate 1 | `research/define/*`; `gates/G1-*/`; `.team/DECISIONS.md` | Define Now; G1 **Slot (Phase 5)** |
| 5 | Concept + Gate 2 | `concepts/*/` style tiles, one image + sidecar; `artgen/README.md` facts | **Slot (Phase 5)** (facts Now) |
| 6 | Variations + Gate 3 | `screenshots/` G3 contact sheet; `variants/*.md`; detector output | **Slot (Phase 5)** |
| 7 | Build, Review + Gate 4 | `review/*.md`; `gates/G4-*/review.md`; Lighthouse and axe results | **Slot (Phase 5)** |
| 8 | The receipt | `git log`; counts; time or cost if approved | Log Now; figures **Slot (Phase 5)** |
| 9 | Your turn (set it up) | `README.md` requirements; setup block again | Now |

## `/made/` How this site was made

Purpose: the proof layer for Maya and Tomás. Every gate packet appears in full, with links to the files in the repo. The home page links here from each gate card ("See the full Gate 2 packet").

| # | Section | Artefact | Status |
|---|---|---|---|
| 1 | Intro: the run at a glance | Timeline of phases with dates from `git log`; the roster | Now (grows) |
| 2 | Intake | `BRIEF.md` in full | Now |
| 3 | Discover | All of `research/` rendered or linked: SUMMARY, competitors (text only, no third-party screenshots), personas, content inventory, reference board (links, not images), constraints | Now |
| 4 | Define + G1 | `research/define/*`, `api/stack-proposal.md`, `gates/G1-*/README.md` and `review.md`, the decision | Define Now; stack proposal in progress (Backend); G1 **Slot (Phase 5)** |
| 5 | Concept + G2 | `concepts/<a,b,c>/` moodboards, palettes, type pairings, key art, style tiles; image sidecars; `gates/G2-*/` contact sheet and review; decision; `DESIGN.md` | **Slot (Phase 5)** |
| 6 | Variations + G3 | `variants/*.md`; contact sheet at 4 widths; Impeccable critique notes and detector; `gates/G3-*/`; decision | **Slot (Phase 5)** |
| 7 | Build + QA + G4 | `review/` audit; Lighthouse and axe; `gates/G4-*/`; decision; launch date | **Slot (Phase 5)** |
| 8 | Messages | Selected PM/agent messages verbatim | **Slot (Phase 5)**, only if Q5 is approved |
| 9 | Numbers | Commits per role, briefs, images generated, wall-clock time, cost if approved | **Slot (Phase 5)** |

## `/setup/` Set up

Purpose: everything Sam needs before and during setup. It is the canonical home of the requirements.

| # | Section | Artefact | Status |
|---|---|---|---|
| 1 | The sentence (copy block) and "what happens next" in 5 steps | `BOOTSTRAP.md` §0 to §5 | Now |
| 2 | Requirements card: OS, GPU (12 GB, 8 GB reduced), disk ~40 GB, Node 20+, Python 3.11/3.12, git, optional `gh`; Hugging Face account and token for the Klein download | `README.md`, `BOOTSTRAP.md` §1 and §2 | Now |
| 3 | Without an NVIDIA GPU / on a Mac | `bootstrap --skip-comfyui`; what still works | Now (wording depends on Q7) |
| 4 | Claude Code alone vs T3 Code | `BOOTSTRAP.md` §4 | Now |
| 5 | What it costs you | Your own model subscription and usage; time per project | Figures **Slot (Phase 5)** if Q6 is approved |
| 6 | Health check | Sample `node scripts/bootstrap.mjs --check` output | Now (Backend to capture) |
| 7 | FAQ and troubleshooting | `BOOTSTRAP.md` Troubleshooting; persona objections (`../personas.md`) | Now |
| 8 | Glossary | thread, brief, gate, worktree, variation, contact sheet, sidecar, Impeccable, detector | Draft |

## `/credits/` Credits and licences

| Section | Artefact | Status |
|---|---|---|
| Repo licence | `LICENSE` | Slot until G1 (Q4) |
| Third-party tools and skills: Impeccable (Apache-2.0 + NOTICE), Playwright, ComfyUI, axe, Lighthouse | `.claude/skills/impeccable`, `tools/package.json` | Now |
| Image models and licences, including the FLUX Klein US$5M limit | `artgen/README.md` Models and licences | Now |
| Double Diamond credit (CC BY 4.0, adapted) | n/a | Now |
| Fonts (OFL texts) | from Concept/Front-end | **Slot (Phase 5)** |
| Privacy note: no cookies; GitHub Pages logs IPs; analytics if approved | `../constraints.md` | Now |

## `/llms.txt` and `/story.md`

- `llms.txt`: a one-paragraph summary, the setup sentence, and links to README, BOOTSTRAP, PLAYBOOK and `/story.md`. Generated at build time. It follows Factory's precedent (`../competitors.md`).
- `story.md`: the home story as plain markdown, generated from the same content.

## Deliberately not included

- **Blog, changelog, newsletter.** Out of scope; the git log is the changelog.
- **Separate role pages.** Role cards on home, with anchors, are enough. Role files link to GitHub.
- **Contact form or CMS.** None needed (`../constraints.md`).
