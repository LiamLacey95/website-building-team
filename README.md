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

That thread becomes the project manager. It installs or connects ComfyUI and the image models, installs Impeccable and the screenshot and review tooling, creates the five agent threads, and asks you for your first website prompt. See [`BOOTSTRAP.md`](BOOTSTRAP.md).

Requirements: Windows or Linux, an NVIDIA GPU with 12 GB VRAM (an 8 GB profile exists but is untested), about 40 GB of disk, git, Node.js 20+, Python 3.11 to 3.13. A fresh ComfyUI install also needs a free Hugging Face account to download FLUX Klein. Full details are in [`BOOTSTRAP.md`](BOOTSTRAP.md).

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

Code in this repo: licence not chosen yet. Models are downloaded at setup under their own licences (listed in `artgen/README.md`): FLUX 3 Image Klein is free for commercial use under US$5M revenue; 4x-UltraSharp is non-commercial and used for concept boards only. Impeccable is Apache-2.0.
