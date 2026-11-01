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
| 1 | Prerequisites | git, Node 20+, npm, Python 3.11 to 3.13 (3.13 preferred), `gh` (optional), NVIDIA GPU and VRAM (`nvidia-smi`), free disk. Stops only if git or npm is missing. | `--python <exe>` |
| 2 | Config | Writes `team.config.json` (see below). | `--project`, `--worktrees-dir`, `--providers`, ComfyUI flags |
| 3 | Node tooling | `npm ci` in `tools/` and `docs/review/tools/` (skipped while `node_modules` is newer than the package files), then Playwright Chromium (skipped if already installed). | `--skip-node`, `--skip-playwright`, `--with-deps` (Linux system libraries, needs sudo), `--reinstall` |
| 4 | Impeccable | The skills are committed, so normally nothing to install. If a provider's skill folder is missing (or with `--reinstall`): `npx --yes impeccable@<pin> install --scope=project --providers=<harnessProviders> --no-hooks -y` (plus `--force` with `--reinstall`), where the pin comes from `tools/package.json` (a bare `npx impeccable` can pick up a stale global). Then warms the engine with `.claude/skills/impeccable/scripts/impeccable --version`. Never enables Impeccable's own hooks: the team's gated hook is committed. | `--skip-impeccable`, `--reinstall` |
| 5 | ComfyUI | **Connect** (`--comfyui-path`): detects the venv python, then `artgen/setup/install_comfyui.py --verify <dir>` (the first run hashes ~37 GB in a few minutes; later runs are cached). **Install** (`--install-comfyui`): first `install_comfyui.py --install <dir> --dry-run --json` (sizes, disk, GPU, token, blockers; stops here if blocked), then, after confirmation in interactive mode, `--install <dir> --yes --json`; `comfyui.python` comes from its result. **Missing models** (`--models-only`, or offered interactively when verification is red or amber): the same two-stage flow with `--models-only`. Downloads need a Hugging Face token (see below). Finally `artgen/setup/configure.py` generates the launchers from the config. | `--skip-comfyui`, `--models-only`, `--comfyui-python`, `--comfyui-port`, `--comfyui-profile` |
| 6 | Worktrees | Creates `worktreesDir`. | `--worktrees-dir` |
| 7 | Health check | Green / amber / red per item; same as `--check`. | |

Other flags: `--yes` (non-interactive; implied when stdin is not a terminal), `--dry-run` (print every command and the config that would be written, change nothing), `--selftest` (after setup, run `tools/selftest.mjs`, `docs/review/tools/selftest.mjs` and `artgen/generate.py --smoke`), `--smoke` (only the ComfyUI smoke test).

**Hugging Face token (fresh installs only).** The FLUX 3 Klein models are in a gated repo. The human needs a free Hugging Face account, must click "Agree" once at https://huggingface.co/black-forest-labs/flux-3-image-klein-comfy, and must provide a read token, either as the `HF_TOKEN` environment variable or saved with `hf auth login`. Without it, the installer's dry run reports a blocker with these steps and bootstrap skips the download. The default download is about 29 GB (37 GB with optional extras). Details: `artgen/setup/README.md`.

The health check runs the fast forms: `install_comfyui.py --verify <dir> --quick --json` (sizes only, about 1 s) and `configure.py --check --json`.

**Telemetry.** Bootstrap runs `impeccable telemetry off`, which writes `"telemetry": false` to `~/.impeccable/config.json` for the machine, so it also covers plain terminals. It also sets `IMPECCABLE_NO_TELEMETRY=1` for everything it runs unless the variable is already set. The health check reports the machine setting. Agent sessions get the same setting from the committed `.claude/settings.json`.

Value precedence: **flag**, then the **existing `team.config.json`**, then an **interactive answer**, then the **default**. Unknown keys already in `team.config.json` are kept, so other tools can add their own.

Exit code: 0 when every step succeeded and nothing in the health check is red; 1 otherwise. `--check` exits 1 if anything is red. Amber items (no `gh`, 8 GB GPU, ComfyUI server not running) do not fail.

## team.config.json

Machine-specific settings. **Git-ignored**; created by `bootstrap.mjs` from `team.config.example.json`. Paths are absolute with forward slashes (both Node and Python accept them on Windows). Any committed script that needs a machine path reads it from here; when the file or a key is missing, scripts fall back to the default in this table.

| Key | Type | Default | Used by | Meaning |
|---|---|---|---|---|
| `version` | number | `1` | all | Schema version. Bumped only on a breaking change, with a note here. |
| `activeProject` | string | `""` | PM, all agents | Slug of the project being worked on, a folder under `projects/`. Empty until intake. |
| `worktreesDir` | path | sibling `<repo-folder>.worktrees` | `tools/variants.mjs` | Where Gate 3 variant worktrees are created. Empty means the default. |
| `variantBasePort` | number | `4321` | `tools/variants.mjs` | Port of variant A; B and C use the next ports. |
| `harnessProviders` | string[] | `["claude","codex"]` | bootstrap (Impeccable) | Agent harnesses to install Impeccable skills for. `claude` → `.claude/skills/impeccable`, `codex` → `.agents/skills/impeccable`. |
| `comfyui.path` | path | `""` | `artgen/` | ComfyUI install folder (the one containing `main.py`). Empty means image generation is not set up. |
| `comfyui.python` | path | auto-detected | `artgen/` | Python of ComfyUI's venv. Bootstrap looks for `venv/`, `.venv/`, then the Windows portable `python_embeded/`. |
| `comfyui.port` | number | `8188` | `artgen/` | Port the ComfyUI server listens on. |
| `comfyui.profile` | `"12gb"` \| `"8gb"` | from GPU VRAM | `artgen/` | Workflow tuning. Bootstrap sets `8gb` when `nvidia-smi` reports under 11 GB, on first write only; change it by hand or with `--comfyui-profile`. |

Example (this is what a configured Windows machine looks like):

```json
{
  "version": 1,
  "activeProject": "how-it-works",
  "worktreesDir": "D:/Sites/website-building-team.worktrees",
  "variantBasePort": 4321,
  "harnessProviders": ["claude", "codex"],
  "comfyui": {
    "path": "D:/AI/ComfyUI",
    "python": "D:/AI/ComfyUI/venv/Scripts/python.exe",
    "port": 8188,
    "profile": "12gb"
  }
}
```

### Adding a key

1. Agree it with Backend (owner of this schema).
2. Add it to `team.config.example.json` with its default and to the table above.
3. Read it with a fallback to that default, so older configs keep working.
