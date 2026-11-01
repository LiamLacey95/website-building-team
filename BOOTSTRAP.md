# BOOTSTRAP: turn a thread into the project manager and stand up the team

This file is written for an AI coding agent (Claude Code or T3 Code). A human hands you this repo and says something like *"Set up the website building team from BOOTSTRAP.md."* From that moment **you are the project manager (PM)**. Work through the steps below in order, then tell the human the team is ready and ask for their website prompt.

Read `.team/PLAYBOOK.md` before you start; it is how the team works once it exists.

## 0. What you are setting up

- Five long-lived agent threads (Research, Concept, Front-end Design, Backend, Review), each its own top-level thread, not a subagent. You brief them and they report back to your thread.
- A local ComfyUI install with FLUX 3 Image Klein, Z-Image Turbo and two upscalers, driven headlessly by `artgen/generate.py`.
- Impeccable (design skills for the front end) at project scope.
- Playwright screenshot tooling, variant worktrees, and review tooling (axe, Lighthouse, contrast).

## 1. Check the machine

| Need | Minimum | Notes |
|---|---|---|
| OS | Windows 10/11 or Linux | Built and tested on Windows 11. macOS works for everything except fast image generation (no CUDA) |
| GPU | NVIDIA, 12 GB VRAM; driver 580+ (CUDA 13) recommended | Tuned and tested on an RTX 4070 SUPER. An 8 GB profile exists (distilled Klein, smaller sizes) but is **untested** on a real 8 GB card. No GPU: `--skip-comfyui` (see the Concept role's fallback) |
| Disk | about 40 GB free | Models are about 29 GB (37 GB with optional extras), plus ComfyUI and its CUDA torch venv |
| Tools | git, Node.js 20+, Python 3.11 to 3.13 (3.13 recommended, as ComfyUI recommends), `gh` (optional, for GitHub) | |
| Accounts | A free Hugging Face account, **only for a fresh ComfyUI install** | FLUX Klein is only in Black Forest Labs' gated repo: accept its licence once and set a read token as `HF_TOKEN` (see step 2) |

If something is missing, tell the human exactly what to install and stop until it is there. Do not install system-wide software without asking.

## 2. Run the bootstrap script

From the repo root:

```
node scripts/bootstrap.mjs
```

It asks for each setting, or takes it as a flag (`node scripts/bootstrap.mjs --help` lists them all). An agent shell is not a terminal, so pass flags and `--yes`:

```
node scripts/bootstrap.mjs --yes --comfyui-path "<existing ComfyUI folder>"
node scripts/bootstrap.mjs --yes --install-comfyui "<new folder>"     # fresh install, see below
node scripts/bootstrap.mjs --yes --skip-comfyui                       # no image generation for now
```

- **ComfyUI:** connect an existing install (`--comfyui-path <dir>`); bootstrap verifies the ComfyUI version and every model's hash (the first run takes a few minutes and is cached after that). Or install a fresh one (`--install-comfyui <dir>`): this clones ComfyUI at the pinned commit, creates its venv with CUDA torch, and downloads the models in `artgen/setup/models.json` with hash checks. A fresh install needs, **before you run it**:
  - the human's go-ahead for about **29 GB** of model downloads (37 GB with optional extras) plus CUDA torch (preview the plan with `--dry-run`);
  - a free Hugging Face account that has clicked "Agree" once at https://huggingface.co/black-forest-labs/flux-3-image-klein-comfy, with a read token set as the `HF_TOKEN` environment variable. Ask the human for this; never invent a token. Without it, bootstrap prints these steps and skips the download.
- **Worktree folder** for design variations (`--worktrees-dir`, default: sibling folder `<repo-folder>.worktrees`).
- **Active project** (`--project <slug>`): leave it unset for a new team; it is set at intake.

It then writes `team.config.json` (machine-specific, git-ignored; keys in `scripts/README.md`), installs the Node tooling (`tools/`, `docs/review/tools/`) and Playwright Chromium, checks the committed Impeccable skills and warms their engine, generates the ComfyUI launchers, creates the worktree folder, and finishes with a health check (green, amber, red). Every step is idempotent: if something fails, fix it and re-run. Re-check any time with `--check`; add `--selftest` to also run the Front-end, Review and ComfyUI self-tests.

After it finishes, reload your harness so the Impeccable skills are picked up.

## 3. Reset the team state

This repo may carry another team's state. Start clean:

1. Copy `.team/templates/STATUS.md` over `.team/STATUS.md` and `.team/templates/DECISIONS.md` over `.team/DECISIONS.md`.
2. Leave `projects/` alone. Any project already there is an example from the team that built this kit.

## 4. Create the five agent threads

Find your own thread id and environment id (in T3 Code: `t3_thread_list` returns `currentThreadId`; the environment id is in the thread link).

For each role, take the prompt in `.team/templates/thread-prompts/<role>.md`, replace `{{PM_THREAD_ID}}`, `{{ENVIRONMENT_ID}}` and `{{REPO_ROOT}}`, and create a top-level thread with it:

- **T3 Code:** one `create_threads` call with all five threads (titles as in the playbook), in this project, inheriting your model and mode. Not subagents.
- **Claude Code without T3:** open five more Claude Code sessions in this repo, one per role, and paste each prompt. Sessions message each other with `SendMessage` (find names with `ListAgents`); use those in place of `t3_thread_send`. If your setup has no cross-session messaging, agents still write their reports to disk and the human relays a one-line "done" to you.

Record the five thread ids in the **Roster** table of `.team/STATUS.md` and commit it.

Each thread's first job is a quick self-test of its own tooling (built into its prompt). Wait for all five DONE messages. Fix or report anything that fails.

## 5. Ready

Tell the human:

- the team is set up and which self-tests passed;
- how the process runs (summarise the Method table and the four gates from the playbook);
- that you are waiting for their website prompt.

When the prompt arrives, follow Phase 0 Intake in the playbook: create `projects/<slug>/` with `BRIEF.md` (copy `.team/templates/BRIEF.md`), then brief Research.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `generate.py` says a node is missing | ComfyUI is older than the workflows. Update ComfyUI (`git pull` in its folder, then reinstall requirements in its venv) |
| Out of VRAM | Use the distilled Klein model or Z-Image workflows, generate at 1 MP, close other GPU apps |
| Git Bash mangles `/` arguments | Pass routes by name (`--routes home`) or use PowerShell |
| `index.lock` errors | Several agents committed at once. Wait and retry; delete the lock only if it is over five minutes old |
| Impeccable commands not found | Reload the harness after bootstrap; check `.claude/skills/impeccable` exists |
