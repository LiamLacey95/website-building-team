# Website Building Team

An AI design studio you can run on your own machine. You give a project manager agent a website prompt, and five specialist agent threads take it from research to a launched site, with three variations at each creative step and exactly four human review gates.

| Agent | Does |
|---|---|
| **Project manager** | Your thread. Writes briefs, runs the process, assembles gate packets, merges work |
| **Research** | Competitors, audience, content inventory, reference boards |
| **Concept** | Three creative directions with imagery generated locally in ComfyUI (FLUX 3 Image Klein, Z-Image Turbo) |
| **Front-end Design** | Coded variations in parallel git worktrees, designed with [Impeccable](https://impeccable.style), screenshotted as it goes |
| **Backend** | Stack, content model, APIs, forms, deployment |
| **Review** | Independent gate: accessibility, Lighthouse, Impeccable slop detector, code review |

## The process

Double Diamond, four gates:

1. **Discover and Define**, then **Gate 1: strategy and scope**
2. **Concept**: three creative directions, then **Gate 2: creative direction**
3. **Design variations**: three coded versions in worktrees, then **Gate 3: design selection**
4. **Build, QA and release**, then **Gate 4: release sign-off**

Details: [`.team/PLAYBOOK.md`](.team/PLAYBOOK.md).

## Set it up

Clone this repo, open it in Claude Code or T3 Code, start a thread and say:

> Set up the website building team from BOOTSTRAP.md.

That thread becomes the project manager. It installs or connects ComfyUI and the image models, checks the bundled Impeccable skills, installs the screenshot and review tooling, creates the five agent threads, and asks you for your first website prompt. See [`BOOTSTRAP.md`](BOOTSTRAP.md).

Requirements: **an NVIDIA GPU is required; the kit is not suited to machines without one.** Windows 11 (tested; Linux is supported by the scripts but untested; macOS works except for local image generation), an NVIDIA GPU with 12 GB VRAM (an 8 GB profile exists but is untested), about 40 GB of disk, git, Node.js 20+, Python 3.11 to 3.13. A fresh ComfyUI install also needs a free Hugging Face account to download FLUX Klein. Full details are in [`BOOTSTRAP.md`](BOOTSTRAP.md).

## Layout

| Path | What |
|---|---|
| `BOOTSTRAP.md` | Setup instructions for the PM agent |
| `.team/` | Playbook, role charters, thread prompt templates, status board, decision log |
| `scripts/bootstrap.mjs` | Machine setup and health check |
| `artgen/` | ComfyUI workflows, headless `generate.py`, installer and model manifest |
| `tools/` | Screenshots, contact sheets, variant worktrees |
| `docs/` | Research templates, stack playbook and API templates, review checklists and tools |
| `projects/<slug>/` | One folder per website |

## Licences

**This repo:** Apache-2.0 (see `LICENSE` and `NOTICE`).

**Third-party components.** Impeccable 4.8.0 (https://impeccable.style) is vendored unmodified in `.claude/skills/impeccable/`, `.agents/skills/impeccable/` and `.claude/agents/impeccable-*.md`. It is © 2025 Paul Bakaus, licensed under Apache-2.0; see `LICENSE` and `NOTICE.md` in each skill folder. Its iOS and Android references are derived from ehmo's `platform-design-skills` (MIT; `LICENSE-platform-design-skills`), and its `scripts/modern-screenshot.umd.js` is modern-screenshot © 2021-present wxm (MIT; `scripts/LICENSE-modern-screenshot`). `THIRD-PARTY.md` in each skill folder maps every file to its licence. npm dependencies installed by the bootstrap (Playwright, Apache-2.0; the Impeccable CLI, Apache-2.0) are not committed.

**Models** are downloaded at setup, not stored in the repo, and keep their own licences (full table in `artgen/README.md`):
- FLUX 3 Image Klein: free for commercial use under US$5M revenue (FLUX Kommunity licence).
- Z-Image Turbo: Apache-2.0.
- RealESRGAN: BSD-3. Used for every shipped upscale.
- 4x-UltraSharp: CC BY-NC-SA, non-commercial. Used for concept boards only.

`artgen/input/web_example.png` is a FLUX Klein output (its provenance sidecar is next to it).
