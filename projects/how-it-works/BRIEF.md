# Project brief: How the Website Building Team works

> **Gate 1 decided (2026-11-01):** see `gates/G1-strategy/DECISION.md`, which overrides this brief where they differ. In short: a highly creative showcase measured on creativity, interest and polish; hosted on Vercel; quotes and decisions written for the story; no time or cost figures; no analytics.

Slug: `how-it-works`  ·  Opened: 2026-11-01  ·  PM thread: `fa660062-b3b4-4292-a789-b6fb4858c4e7`

## The prompt (verbatim)

> your first website that i want you to build is a creative website that runs through how this works.

Context from the same message: the whole system is being published as a GitHub repo, "website building team", that anyone can hand to Claude Code or T3 Code to set up their own team. This site explains that system.

## What success looks like

- **Primary goal:** a visitor understands, in a few minutes and with some delight, how one prompt becomes a finished website through this team: the six agents, the Double Diamond phases, the four human gates, local image generation in ComfyUI, coded variations in worktrees, Impeccable, and independent review.
- **Secondary goals:**
  - Make someone want to try it, and show them exactly how: clone, open in Claude Code or T3 Code, say "Set up the website building team from BOOTSTRAP.md."
  - Be proof of the process. The site is built by the process it describes, so it can show its own real artefacts: its brief, research, the three concept directions and the generated images, the variant screenshots, review verdicts and gate decisions.
- **Signals:** a first-time visitor can name the four gates and explain what happens at each one; the setup instruction is impossible to miss; the site passes our own quality bar (WCAG 2.2 AA, Lighthouse mobile budget, Impeccable detector clean).

## Audience (first guess; Research confirms)

1. Developers and designers who already use AI coding agents (Claude Code, T3 Code, Cursor) and want a structured design process rather than one-shot generation.
2. Small studio owners and freelancers weighing whether an agent team can do client-grade work.
3. The person who has just been handed this repo and wants to understand it before running it.

## Must have / must not

- **Must be creative.** The prompt says "creative": this is a chance for an ambitious, memorable piece (for example scroll-driven storytelling, an interactive pipeline, a "follow one prompt through the studio" narrative). It must still be fast, accessible, and work with reduced motion and on mobile.
- Must explain: roles, phases, gates, the ComfyUI pipeline, variations and worktrees, Impeccable, Review, and how to set it up.
- Must show real artefacts from this project's own run, not mock-ups of them.
- Must not look like generic AI output (Impeccable detector clean).
- Must not over-promise: be honest that it needs a capable NVIDIA GPU, human decisions at the gates, and that licences apply to models.

## Constraints

- No client brand: the team creates the identity for "Website Building Team" (the name can be refined at Gate 1).
- Static site expected; the repo is on GitHub, so GitHub Pages is the obvious host. Publishing publicly needs the human's approval (Gate 1 for the plan, Gate 4 for go-live).
- Generated imagery uses commercially licensed models only (WEB6b for upscales).
- Code lives in `projects/how-it-works/web/` (and `server/` only if a build-time content pipeline needs it).

## Open questions for Gate 1

1. Product name: keep "Website Building Team" or name the studio?
2. Hosting: GitHub Pages under the repo, or somewhere else? Public at launch?
3. How "meta" should it be: a full case study of its own making, or a light "made by the team" strand?
4. Licence for the repo, which the site should state.

## Phase plan

| Phase | Owner | Brief |
|---|---|---|
| 1 Discover | Research | `briefs/01-research-discover.md` |
| 2 Define | PM, Research, Front-end, Backend | to follow |
| G1 | human | |

Note: in parallel, the team is packaging the kit for handoff (`.team/briefs/03-*`). The site should describe the kit as it will be after that work.
