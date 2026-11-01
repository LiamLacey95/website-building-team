# scripts/

Kit setup tooling, maintained by Backend.

| Script | What it does |
|---|---|
| `bootstrap.mjs` | One-shot setup for a new machine or a fresh clone, plus the health check (`--check`). Node 20+, no npm dependencies, Windows and Linux. |

## bootstrap.mjs

```
node scripts/bootstrap.mjs                       # interactive
node scripts/bootstrap.mjs --yes --comfyui-path "D:/AI/ComfyUI"
node scripts/bootstrap.mjs --install-comfyui "D:/AI/ComfyUI"
node scripts/bootstrap.mjs --check               # health report only
node scripts/bootstrap.mjs --help                # every flag
```

Every step is idempotent: it checks first and only acts if something is missing or out of date. Re-running is always safe, and a failed run can simply be repeated once the problem is fixed.

| # | Step | Does | Skip / control |
|---|---|---|---|
| 1 | Prerequisites | git, Node 20+, npm, Python 3.11/3.12, `gh` (optional), NVIDIA GPU and VRAM (`nvidia-smi`), free disk. Stops only if git or npm is missing. | `--python <exe>` |
| 2 | Config | Writes `team.config.json` (see below). | `--project`, `--worktrees-dir`, `--providers`, ComfyUI flags |
| 3 | Node tooling | `npm ci` in `tools/` and `docs/review/tools/` (skipped while `node_modules` is newer than the package files), then Playwright Chromium (skipped if already installed). | `--skip-node`, `--skip-playwright`, `--with-deps` (Linux system libraries, needs sudo), `--reinstall` |
| 4 | Impeccable | `npx impeccable install --scope=project --providers=<harnessProviders>`, only if a provider's skill folder is missing. | `--skip-impeccable`, `--reinstall` |
| 5 | ComfyUI | **Connect** (`--comfyui-path`): detects the venv python, verifies the install and models with `artgen/setup/install_comfyui.py --verify`. **Install** (`--install-comfyui`): runs `install_comfyui.py --install <dir>` (in interactive mode it shows a dry run with sizes and asks before downloading ~20 GB). Then runs `artgen/setup/configure.py` to generate launchers and model paths from the config. | `--skip-comfyui`, `--models-only`, `--comfyui-python`, `--comfyui-port` |
| 6 | Worktrees | Creates `worktreesDir`. | `--worktrees-dir` |
| 7 | Health check | Green / amber / red per item; same as `--check`. | |

Other flags: `--yes` (non-interactive; implied when stdin is not a terminal), `--dry-run` (print every command and the config that would be written, change nothing), `--selftest` (after setup, run `tools/selftest.mjs`, `docs/review/tools/selftest.mjs` and `artgen/generate.py --smoke`).

Value precedence: **flag**, then the **existing `team.config.json`**, then an **interactive answer**, then the **default**. Unknown keys already in `team.config.json` are kept, so other tools can add their own.

Exit code: 0 when every step succeeded and nothing in the health check is red; 1 otherwise. `--check` exits 1 if anything is red. Amber items (no `gh`, 8 GB GPU, ComfyUI server not running) do not fail.

## team.config.json

Machine-specific settings. **Git-ignored**; created by `bootstrap.mjs` from `team.config.example.json`. Paths are absolute with forward slashes (both Node and Python accept them on Windows). Any committed script that needs a machine path reads it from here; when the file or a key is missing, scripts fall back to the default in this table.

| Key | Type | Default | Used by | Meaning |
|---|---|---|---|---|
| `version` | number | `1` | all | Schema version. Bumped only on a breaking change, with a note here. |
| `activeProject` | string | `""` | PM, all agents | Slug of the project being worked on, a folder under `projects/`. Empty until intake. |
| `worktreesDir` | path | sibling `<repo-folder>.worktrees` | `tools/variants.mjs` | Where Gate 3 variant worktrees are created. Empty means the default. |
| `harnessProviders` | string[] | `["claude","codex"]` | bootstrap (Impeccable) | Agent harnesses to install Impeccable skills for. `claude` → `.claude/skills/impeccable`, `codex` → `.agents/skills/impeccable`. |
| `comfyui.path` | path | `""` | `artgen/` | ComfyUI install folder (the one containing `main.py`). Empty means image generation is not set up. |
| `comfyui.python` | path | auto-detected | `artgen/` | Python of ComfyUI's venv. Bootstrap looks for `venv/`, `.venv/`, then the Windows portable `python_embeded/`. |
| `comfyui.port` | number | `8188` | `artgen/` | Port the ComfyUI server listens on. |

Example (this is what a configured Windows machine looks like):

```json
{
  "version": 1,
  "activeProject": "how-it-works",
  "worktreesDir": "D:/Sites/website-building-team.worktrees",
  "harnessProviders": ["claude", "codex"],
  "comfyui": {
    "path": "D:/AI/ComfyUI",
    "python": "D:/AI/ComfyUI/venv/Scripts/python.exe",
    "port": 8188
  }
}
```

### Adding a key

1. Agree it with Backend (owner of this schema).
2. Add it to `team.config.example.json` with its default and to the table above.
3. Read it with a fallback to that default, so older configs keep working.
