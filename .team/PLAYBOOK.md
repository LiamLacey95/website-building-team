# Website Design Team: Playbook

The single source of truth for how this team works. Every agent reads this first, then its own role file in `.team/roles/`.

Repo root (absolute): `F:\ArtGen\Website Test`. Always use absolute paths when referring to shared files, because some work happens in worktrees.

## The team

| Role | Thread title | Owns (writes to) | Role file |
|---|---|---|---|
| Project manager (PM) | the user's main thread | `.team/` (STATUS, briefs, gates), merges to `master` | n/a |
| Research | `Team · Research` | `docs/research/` | `roles/research.md` |
| Concept creator | `Team · Concept (ComfyUI)` | `artgen/`, `design/concepts/`, `web/public/assets/generated/` (final picks only) | `roles/concept.md` |
| Front-end design | `Team · Front-end Design` | `web/`, `tools/`, `design/screenshots/`, variant worktrees | `roles/frontend.md` |
| Backend developer | `Team · Backend` | `server/`, `docs/api/`, shared types under `server/contracts/` | `roles/backend.md` |
| Review | `Team · Review` | `docs/review/` (read-only everywhere else) | `roles/review.md` |

Thread ids are recorded in `.team/STATUS.md` under **Roster**.

## Method: from prompt to launch

Double Diamond (Discover, Define, Develop, Deliver) with exactly **four human gates**. Nothing passes a human gate without first passing an internal Review check.

| Phase | Who leads | Output | Ends with |
|---|---|---|---|
| **0 Intake** | PM | `.team/briefs/00-project-brief.md`: goals, audience, constraints, open questions | n/a |
| **1 Discover** | Research (Backend and Front-end advise on feasibility) | Market and competitor teardown, audience and personas, content inventory, reference sites, accessibility and legal needs | n/a |
| **2 Define** | PM + Research, Front-end and Backend propose stack | Positioning, sitemap and IA, key user journeys, content model, success metrics, tech stack proposal | **GATE 1: Strategy and scope** |
| **3 Concept** | Concept creator (Research supplies references) | 3 distinct creative directions: moodboard, palette, type pairing, key art from ComfyUI, one style tile each | **GATE 2: Creative direction** |
| **4 Design variations** | Front-end (Concept supplies assets, Backend mocks data) | 3 coded variations of the home page plus one key interior page, each in its own worktree, screenshotted at desktop, tablet and mobile | **GATE 3: Design selection** |
| **5 Build** | Front-end + Backend, Concept supplies final assets | Full site on the chosen variation: all pages, real content, APIs, forms, CMS or data layer | n/a (Review runs continuously) |
| **6 QA and release** | Review | Audit: WCAG 2.2 AA, Lighthouse, cross-viewport screenshots, code review, content proof | **GATE 4: Release sign-off** |

Max four human gates. If the human sends feedback at a gate that requires another round, the round happens inside the same gate; we do not add gates.

### Gate packet

For every gate the PM assembles `.team/gates/G<n>-<name>/` containing:

- `README.md`: what is being decided, the options, the team's recommendation and why, open risks, and the exact question for the human.
- `contact-sheet.html`: a self-contained page (images as relative paths or embedded) showing the options side by side. The PM renders it in chat.
- `review.md`: the Review agent's verdict on everything in the packet.

The human answers with a choice (A/B/C, a combination, or "revise: ..."). The PM records the decision in `.team/DECISIONS.md` and briefs the next phase.

## Communication protocol

- **PM to agent:** a task brief file in `.team/briefs/<NN>-<role>-<slug>.md`, then a `t3_thread_send` to the agent's thread pointing at it. Briefs state: goal, inputs, deliverables with exact paths, acceptance criteria, deadline in phase terms.
- **Agent to PM:** when a task is finished, blocked, or needs a decision, send one message to the PM thread with `t3_thread_send` (`threadId` from the Roster, `mode: "queue"`). Format:
  ```
  [ROLE] DONE|BLOCKED|QUESTION <brief id>
  Summary: 1 to 3 lines
  Artifacts: absolute paths
  Needs: what you need from whom, or "nothing"
  ```
  Also write a fuller report to `.team/reports/<brief id>-<role>.md`.
- **Agent to agent:** only Front-end and Backend may message each other directly, and only about the API and data contract. Everything else routes through the PM. Any agreement goes into `docs/api/` so it is on disk.
- Agents never message the human directly and never decide a gate. If something needs the human, send QUESTION to the PM.
- After reporting, stop and wait. Do not start the next phase on your own.

## Repo and git conventions

- Main branch is `master` at the repo root. The PM merges approved work into it.
- Commit only paths you own: `git add <your paths>` then `git commit`. Never `git add -A` at the root, because other agents have uncommitted work there. If `index.lock` exists, wait a few seconds and retry; do not delete it unless it is over five minutes old.
- Commit messages: `<role>: <what>` (for example `frontend: hero section for variant B`).
- Variation worktrees live outside the repo at `F:\ArtGen\Website Test.worktrees\<branch-name>`. Branches are `variant/g3-a-<slug>`, `variant/g3-b-<slug>`, `variant/g3-c-<slug>`. The chosen one is merged to `master` after Gate 3; the others are kept until Gate 4, then removed.
- Large or raw generated files (`artgen/output/`) are git-ignored. Only curated picks are committed.

## Folder map

```
.team/                 PLAYBOOK, STATUS, DECISIONS, roles/, briefs/, reports/, gates/
docs/research/         research outputs
docs/api/              API and data contracts
docs/review/           review reports
design/concepts/       creative directions (one folder per direction)
design/screenshots/    dated screenshots of work in progress and variants
artgen/                ComfyUI project folder for this team (workflows, launcher, inputs; outputs ignored)
tools/                 shared scripts (screenshot capture, contact sheets)
web/                   front-end app
server/                backend
```

## Quality bar (applies to everyone)

- Accessibility: WCAG 2.2 AA. Text contrast at least 4.5:1, visible focus, keyboard reachable, alt text, reduced-motion support.
- Performance budget unless the brief says otherwise: LCP under 2.5 s on mobile, CLS under 0.1, JS under 150 KB gzipped on content pages, images responsive and in AVIF or WebP.
- Responsive at 390, 768, 1440 and 1920 px wide.
- No lorem ipsum at Gate 3 or later; use real or realistic draft copy.
- Every generated image used on the site must have its prompt and workflow recorded next to it (see `roles/concept.md`).

## Known gotchas (shared)

- **Git Bash path rewriting:** Git Bash turns a bare `/` argument into `C:/Program Files/Git/`. Pass routes by name (`--routes home`) or run the command from PowerShell. `tools/screenshot.mjs` catches this, but other scripts may not.
- **Ports:** variants run on A 4321, B 4322 and C 4323 (`tools/variants.mjs port`). Don't use those ports for anything else during Gate 3.
