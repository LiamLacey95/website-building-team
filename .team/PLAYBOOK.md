# Website Building Team: Playbook

The single source of truth for how this team works. Every agent reads this first, then its own role file in `.team/roles/`, then `.team/STATUS.md`.

**Paths:** all paths in this playbook are relative to the repo root (wherever the repo is cloned). Machine-specific locations (ComfyUI install, worktree folder, ports) live in `team.config.json` at the repo root. It is git-ignored and created by `node scripts/bootstrap.mjs` from `team.config.example.json`. Never hard-code an absolute path in a committed file; read it from the config. When you message another thread about a file, give its absolute path so there is no ambiguity across worktrees.

## The team

| Role | Thread title | Kit-level files it maintains | Per-project folders it owns | Role file |
|---|---|---|---|---|
| Project manager (PM) | the project's main thread | `.team/`, `README.md`, `BOOTSTRAP.md` | `BRIEF.md`, `briefs/`, `gates/`, merges to `master` | n/a |
| Research | `Team · Research` | `docs/research/` (templates, method) | `research/` | `roles/research.md` |
| Concept creator | `Team · Concept (ComfyUI)` | `artgen/` | `concepts/`, `web/public/assets/generated/` (final picks only) | `roles/concept.md` |
| Front-end design | `Team · Front-end Design` | `tools/`, Impeccable install and config: `.claude/skills/`, `.claude/agents/`, `.claude/settings.json`, `.agents/`, `.codex/`, `.impeccable/` | `web/`, `variants/`, `screenshots/`, `PRODUCT.md`, `DESIGN.md`, variant worktrees | `roles/frontend.md` |
| Backend developer | `Team · Backend` | `scripts/`, `docs/api/` (templates, stack playbook), `team.config.example.json` | `server/`, `api/` | `roles/backend.md` |
| Review | `Team · Review` | `docs/review/` (checklists, tools) | `review/` (read-only everywhere else) | `roles/review.md` |

| All agents | | their own report `<brief id>-<role>.md` in `.team/reports/` (kit work) | their own report in `projects/<slug>/reports/` | n/a |

"Per-project folders" are inside `projects/<slug>/`. The PM also owns `CLAUDE.md`, `AGENTS.md`, `.gitignore`, `.team/history/` and each project's `TIMELINE.md`. Concept writes final images into `projects/<slug>/web/public/assets/generated/`, the one exception inside Front-end's `web/`. Thread ids are recorded in `.team/STATUS.md` under **Roster**. The active project slug is in `.team/STATUS.md` and `team.config.json`.

## Project layout

Each website is one folder. Several projects can live in one repo; the shared kit stays at the root.

```
projects/<slug>/
  BRIEF.md          PM: intake brief, the human's prompt verbatim plus goals, audience, constraints
  PRODUCT.md        Front-end via /impeccable init (after Gate 1)
  DESIGN.md         Front-end via /impeccable document (after Gate 2, updated after Gate 3)
  briefs/           PM: task briefs  <NN>-<role>-<slug>.md
  reports/          agents: full reports  <brief id>-<role>.md
  research/         Research
  concepts/         Concept: one folder per creative direction
  variants/         Front-end: one hypothesis file per Gate 3 variation
  screenshots/      Front-end: dated shots and contact sheets
  api/              Backend: stack proposal, contract, changelog, deploy notes
  review/           Review: reports
  gates/            PM: gate packets G1 to G4
  web/              Front-end: the site
  server/           Backend: functions, API, content pipeline (only if needed)
```

Kit-level work (changes to the team's own tooling) uses `.team/briefs/` and `.team/reports/`. When a kit brief is finished, the PM moves the brief and its reports into `.team/history/<date>-<topic>/`, so `.team/briefs/` only ever holds live work.

## Method: from prompt to launch

Double Diamond (Discover, Define, Develop, Deliver) with exactly **four human gates**. Nothing passes a human gate without first passing an internal Review check.

| Phase | Who leads | Output | Ends with |
|---|---|---|---|
| **0 Intake** | PM | `projects/<slug>/BRIEF.md`: goals, audience, constraints, open questions | n/a |
| **1 Discover** | Research (Backend and Front-end advise on feasibility) | Market and competitor teardown, audience and personas, content inventory, reference sites, accessibility and legal needs | n/a |
| **2 Define** | PM + Research, Front-end and Backend propose stack | Positioning, sitemap and IA, key user journeys, content model, success metrics, tech stack proposal | **GATE 1: Strategy and scope** |
| **3 Concept** | Concept creator (Research supplies references) | 3 distinct creative directions: moodboard, palette, type pairing, key art from ComfyUI, one style tile each | **GATE 2: Creative direction** |
| **4 Design variations** | Front-end (Concept supplies assets, Backend mocks data) | 3 coded variations of the home page plus one key interior page, each in its own worktree, built and critiqued with Impeccable, screenshotted at 390/768/1440/1920 | **GATE 3: Design selection** |
| **5 Build** | Front-end + Backend, Concept supplies final assets | Full site on the chosen variation: all pages, real content, APIs, forms, CMS or data layer | n/a (Review runs continuously) |
| **6 QA and release** | Review | Audit: WCAG 2.2 AA, Lighthouse, Impeccable audit and slop detector, cross-viewport screenshots, code review, content proof | **GATE 4: Release sign-off** |

Max four human gates. If the human asks for another round at a gate, it happens inside that gate; we do not add gates.

### Gate packet

For every gate the PM assembles `projects/<slug>/gates/G<n>-<name>/` containing:

- `README.md`: what is being decided, the options, the team's recommendation and why, open risks, and the exact question for the human.
- `contact-sheet.html`: a self-contained page showing the options side by side. The PM renders it in chat.
- `review.md`: the Review agent's verdict on everything in the packet.

The human answers with a choice (A/B/C, a combination, or "revise: ..."). The PM records the decision in `.team/DECISIONS.md` and briefs the next phase.

## Impeccable (design language for the front end)

[Impeccable](https://impeccable.style) ([repo](https://github.com/pbakaus/impeccable), Apache-2.0) gives the agents a shared design vocabulary and a deterministic anti-"AI slop" detector. It is installed at project scope in `.claude/skills/` by the bootstrap. **Front-end must use it** at every design step; Review uses it as independent evidence.

| When | Command | Who |
|---|---|---|
| After Gate 1 | `/impeccable init` writes `projects/<slug>/PRODUCT.md` from BRIEF and research | Front-end |
| Before each Gate 3 variation | `/impeccable shape` turns the variation's hypothesis into a design brief | Front-end |
| Building | `/impeccable <request>`, then steer with `layout`, `typeset`, `colorize`, `bolder`, `quieter`, `distill`, `animate`, `delight`, `overdrive` | Front-end |
| Before screenshots for a gate | `/impeccable critique <target>`, fix what it ranks first; the detector (`cd tools && npx impeccable detect <path>`) must be clean or each finding justified in the variant file | Front-end |
| After Gate 2 and Gate 3 | `/impeccable document` writes or updates `projects/<slug>/DESIGN.md` | Front-end |
| Build phase | `harden`, `adapt`, `clarify`, `optimize`, `onboard`, `extract` as needed | Front-end |
| Before Gate 4 | `/impeccable audit`, then `/impeccable polish` per page | Front-end |
| Every review | the detector (`cd tools && npx impeccable detect <path>`) plus its own checks; may run `/impeccable critique` for a second opinion | Review |

Narrow targets beat whole pages: critique one section at a time.

- **Run the detector from `tools/`**, where the CLI is pinned. From the repo root, `npx` can pick up a stale global copy.
- **Design hook:** `.claude/settings.json` runs `tools/impeccable-hook.mjs` after edits. It only scans files under `projects/<slug>/web/` (in the main checkout or a variant worktree); every other edit exits silently. A hook change takes effect in threads started after it.
- **Telemetry is off** for this team (`IMPECCABLE_NO_TELEMETRY=1`, set in `.claude/settings.json` and by the bootstrap). A team that wants it can remove the variable.

## Communication protocol

- **PM to agent:** a brief file, then a `t3_thread_send` to the agent's thread pointing at it. Briefs state: goal, inputs, deliverables with exact paths, acceptance criteria, deadline in phase terms.
- **Agent to PM:** when a task is finished, blocked, or needs a decision, send one message to the PM thread with `t3_thread_send` (`threadId` from the Roster, `mode: "queue"`). Format:
  ```
  [ROLE] DONE|BLOCKED|QUESTION <brief id>
  Summary: 1 to 3 lines
  Artifacts: absolute paths
  Needs: what you need from whom, or "nothing"
  ```
  Also write a fuller report to the project's `reports/` (or `.team/reports/` for kit work).
- **Agent to agent:** Front-end and Backend may message each other directly about the API and data contract. A brief may allow other direct contact for a named purpose. Everything else routes through the PM. Any agreement goes on disk.
- Agents never message the human directly and never decide a gate. If something needs the human, send QUESTION to the PM.
- After reporting, stop and wait. Do not start the next phase on your own.

## Repo and git conventions

- Main branch is `master`. The PM merges approved work into it and pushes to `origin` (GitHub). Agents commit locally; only the PM pushes.
- Commit only paths you own, and **always name them in the commit itself**: `git add <your paths>` then `git commit -m "<role>: <what>" -- <your paths>`. The index is shared by every agent, so a bare `git commit` sweeps in whatever another agent has staged. Never `git add -A` or `git commit -a` at the root. Before committing, check `git diff --cached --name-only` shows only your files. If `index.lock` exists, wait a few seconds and retry; do not delete it unless it is over five minutes old.
- Commit messages: `<role>: <what>` (for example `frontend: hero section for variant B`).
- Variation worktrees live outside the repo in the folder named by `worktreesDir` in `team.config.json` (default: a sibling folder `<repo-folder>.worktrees`). Branches are `variant/<slug>-g3-a-<name>`, `-b-`, `-c-`. Manage them with `node tools/variants.mjs`. The chosen one is merged to `master` after Gate 3; the others are kept until Gate 4, then removed.
- **Untracking a file:** a pathspec commit takes the working-tree state of the paths, so `git rm --cached X` followed by `git commit -- <dir>` silently re-adds X if it's still on disk. Delete it too (`git rm X`), and check `git show --stat HEAD` after committing.
- Raw generated images (`artgen/output/`), models, `node_modules`, and `team.config.json` are git-ignored. Only curated picks are committed.

## Kit folder map

```
.team/                 PLAYBOOK, STATUS, DECISIONS, roles/, templates/, briefs/ and reports/ for kit work, history/
.claude/skills/        Impeccable (installed by bootstrap, committed)
scripts/bootstrap.mjs  one-shot setup and health check for a new machine
team.config.example.json
docs/research/         research templates and method
docs/api/              stack playbook and API templates
docs/review/           checklists and review tools
artgen/                ComfyUI project folder: workflows, launchers, generate.py, setup/ (installer and model manifest)
tools/                 screenshot, contact sheet, variant worktrees
projects/<slug>/       one folder per website (see Project layout)
```

## Quality bar (applies to everyone)

- Accessibility: WCAG 2.2 AA. Text contrast at least 4.5:1, visible focus, keyboard reachable, alt text, reduced-motion support.
- Performance budget unless the brief says otherwise: LCP under 2.5 s on mobile, CLS under 0.1, JS under 150 KB gzipped on content pages, images responsive and in AVIF or WebP.
- Responsive at 390, 768, 1440 and 1920 px wide.
- No generic AI defaults: Impeccable's detector is clean, or each finding is justified.
- No lorem ipsum at Gate 3 or later; use real or realistic draft copy.
- Every generated image used on the site has its prompt and workflow recorded next to it (see `roles/concept.md`). Shipped images use commercially licensed models only (see `artgen/README.md`).

## Known gotchas (shared)

- **Git Bash path rewriting:** Git Bash turns a bare `/` argument into `C:/Program Files/Git/`. Pass routes by name (`--routes home`) or run the command from PowerShell. `tools/screenshot.mjs` catches this, but other scripts may not.
- **Ports:** variants run on A 4321, B 4322 and C 4323 (`node tools/variants.mjs port`). Don't use those ports for anything else during Gate 3. ComfyUI uses 8188.
- **Lighthouse and cookie banners:** measure with any consent banner dismissed, or CLS numbers are noise.
- **Upscaler licence:** `WEB6` (4x-UltraSharp) is non-commercial and for boards only; anything in `web/` uses `WEB6b` (RealESRGAN). `generate.py` enforces this.
- **Playwright version is pinned in two places** (`tools/` and `docs/review/tools/`, currently 1.64.1). Bump both together; Front-end tells Review first.
- **Clean up headless browsers.** Close every Playwright or Lighthouse browser you open (`browser.close()` in `finally`). Never kill `chrome.exe` by name: the human's own Chrome uses the same executable.
