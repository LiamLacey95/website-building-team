# Brief 03-backend-bootstrap

Owner: Backend. Phase: Kit packaging. Priority: high.

Context: this repo is being published to GitHub as a kit. A new PM thread follows `BOOTSTRAP.md` and runs `node scripts/bootstrap.mjs`. You own that script and the config schema. Read `BOOTSTRAP.md`, the updated `.team/PLAYBOOK.md` and your updated role file first.

Deliverables:
1. **`team.config.example.json`** at the repo root, with each key described in `scripts/README.md`. Minimum: `comfyui.path`, `comfyui.python`, `comfyui.port`, `worktreesDir`, `activeProject`, `harnessProviders` (for Impeccable, for example `["claude","codex"]`). Agree any extra keys with Concept and Front-end. `team.config.json` must be git-ignored.
2. **`scripts/bootstrap.mjs`:** Node 20+, no npm dependencies, works on Windows and Linux. Interactive by default; every prompt also has a flag, plus `--yes` for non-interactive and `--help`. Steps, each idempotent:
   1. Prerequisite check: git, Node version, Python 3.11 or 3.12, `gh` (optional), NVIDIA GPU and VRAM via `nvidia-smi`, free disk space. Clear guidance for anything missing.
   2. Write `team.config.json`.
   3. Install the Node tooling in `tools/` and `docs/review/tools/`; Playwright Chromium.
   4. Impeccable at project scope for the configured providers (commands from Front-end).
   5. ComfyUI: `--comfyui-path <dir>` connects and verifies an existing install; `--install-comfyui <dir>` runs Concept's installer. Then Concept's configure step for launchers and model paths.
   6. Create the worktrees folder.
   7. `--check`: a health report (green, amber or red per item) that also runs at the end of a full bootstrap.
3. **Run it for real on this machine** with `--comfyui-path F:\ArtGen\ComfyUI` so this team gets its own `team.config.json`, then `--check`. Then prove a clean checkout works: `git clone` this repo into a temporary folder, run bootstrap there with `--comfyui-path` pointing at the same install, run `--check`, and delete the temporary clone (and any worktrees folder it created) afterwards.
4. Update `BOOTSTRAP.md` step 2 if the flags or behaviour differ from what it says (you may edit that section; tell the PM what you changed).

Concept and Front-end are building their parts in parallel; start with the prerequisite check, config and Node tooling steps, and wire in their commands as they arrive. You may message the Concept and Front-end threads directly for this brief, about commands and config keys only.
When done: commit your paths, write `.team/reports/03-backend-bootstrap-backend.md`, send DONE to the PM, then wait.
