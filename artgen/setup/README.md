# artgen/setup: ComfyUI installer and bootstrap interface

Owned by Concept. `scripts/bootstrap.mjs` (Backend) calls these. Everything here is stdlib-only Python 3.10+ and runs from the repo root, before or after a ComfyUI venv exists.

| File | What |
|---|---|
| `models.json` | Pinned ComfyUI commit and version, torch index per CUDA version, every model: file, folder, official URL, SHA-256, size, licence, gated or not, which workflows use it, required / default / extra |
| `install_comfyui.py` | `--verify`, `--install`, `--models-only`, all with `--dry-run` and `--json` |
| `configure.py` | Writes this machine's launchers from `templates/` using `team.config.json` |
| `templates/` | `launch*.bat.tmpl` (Windows), `launch*.sh.tmpl` (Linux) |
| `.hashcache.json` | Local SHA-256 cache keyed by path, size and mtime (git-ignored) |

## team.config.json keys

```json
"comfyui": {
  "path": "D:/AI/ComfyUI",
  "python": "D:/AI/ComfyUI/venv/Scripts/python.exe",
  "port": 8188,
  "profile": "12gb"
}
```

| Key | Required | Default | Notes |
|---|---|---|---|
| `comfyui.path` | yes | | Absolute path of the ComfyUI checkout |
| `comfyui.python` | no | `<path>/venv/Scripts/python.exe` (Windows), `<path>/venv/bin/python` (Linux) | Use `install_comfyui.py --install --json` output `python` |
| `comfyui.port` | no | 8188 | Change it when another project's ComfyUI shares the machine |
| `comfyui.profile` | no | `12gb` | `8gb` when `nvidia-smi` reports under 11 GB VRAM (`plan.gpu.vram_mb < 11000`) |

Environment overrides for all scripts: `TEAM_CONFIG`, `COMFYUI_PATH`, `COMFYUI_PYTHON`, `COMFYUI_PORT`, `COMFYUI_PROFILE`. Secrets are never stored in the config: the Hugging Face token comes from `HF_TOKEN` (or the `huggingface-cli` token file).

## Bootstrap steps

| Bootstrap | Command | Time |
|---|---|---|
| `--comfyui-path <dir>` | `python artgen/setup/install_comfyui.py --verify <dir> --json`. Exit 3 or a red result for missing models only: offer `--models-only <dir> --dry-run`, then `--models-only <dir> --yes` | ~3 min first time (hashing ~37 GB), ~5 s cached |
| `--install-comfyui <dir>` | Tell the human about the HF token and the 29 GB download first. `python artgen/setup/install_comfyui.py --install <dir> --dry-run --json`, then the same with `--yes` instead of `--dry-run`. Write `comfyui.path` and `comfyui.python` from the result | engine ~3-10 min, models depend on bandwidth (29 GB) |
| after `team.config.json` exists | `python artgen/setup/configure.py --json` | <1 s |
| optional at the end, required in Concept's self-test | `python artgen/generate.py --smoke` | ~1.5-3 min |
| `--check` | `python artgen/setup/install_comfyui.py --verify <comfyui.path> --quick --json` and `python artgen/setup/configure.py --check --json` | ~1 s |

## Exit codes

| Script | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| `install_comfyui.py --verify` | green | red: required model missing or wrong hash, ComfyUI older than `minVersion`, venv python or torch broken | usage | amber: optional model missing, ComfyUI newer than tested, no CUDA, manager missing |
| `install_comfyui.py --install / --models-only` | done (or dry run feasible) | blocked or failed (see `blockers`) | usage | |
| `configure.py` | green | red | usage | |
| `generate.py --smoke` | all three images made, or SKIPPED when `comfyui.path` is unset (no ComfyUI on this machine) | failed (`smoke.json` has `error`) | usage | |

Logs always go to stderr; with `--json`, stdout carries exactly one JSON object.

## JSON shapes

`install_comfyui.py --verify --json`:

```json
{"status": "green|amber|red",
 "comfyui": {"path": "...", "version": "0.41.0", "commit": "bdc63e7...", "python": "...venv python...",
             "python_version": "3.13.11", "torch": "2.14.1+cu130", "cuda": true, "gpu": "NVIDIA ...", "manager": "4.2.2"},
 "checks": [{"item": "model ae.safetensors", "status": "ok|warn|error|info", "detail": "..."}]}
```
(`--quick` omits the torch probe fields.)

`install_comfyui.py --install|--models-only --dry-run --json` (also printed when blocked, with `"status": "blocked"`):

```json
{"status": "dry-run|blocked", "path": "...", "steps": ["..."], "blockers": ["..."], "warnings": ["..."],
 "download_bytes": 29132277402, "need_bytes": 34332277402, "free_bytes": 238700000000,
 "gpu": {"name": "...", "vram_mb": 12282, "driver": "617.14", "cuda": "13.4"},
 "torch": {"index": "https://download.pytorch.org/whl/cu130", "pin": "torch==2.14.1 torchvision torchaudio"},
 "hf_token": "present|missing", "gated_access": "ok|no-token|bad-token|not-accepted",
 "models_present": ["..."], "models_to_download": [{"file": "...", "size": 0, "gated": true, "dest": "..."}]}
```

After a real run: `{"status": "ok", "path": "...", "python": "...", "downloaded": ["..."], "minutes": 3.1}`.

`configure.py --json`: `{"status": "green|red", "comfyui": {...resolved config...}, "checks": [...]}`.

`generate.py --smoke` writes `artgen/output/_smoke/<timestamp>/smoke.json`:

```json
{"status": "ok|failed", "profile": "12gb", "comfyui_version": "0.41.0", "server_start_s": 14.2, "total_s": 63.9,
 "images": [{"workflow": "WEB3", "file": "artgen/output/_smoke/.../smoke_web3_00001_.png", "seconds": 7.7, "size": [1360, 768]}]}
```

## Updating the pins

When ComfyUI or a model changes: install or update on a test machine, run `generate.py --smoke`, then update `comfyui.commit` / `version` / `tested` or the model's `url`, `sha256` and `size` in `models.json` (`sha256sum <file>`; for ungated Hugging Face files the API tree listing shows the same SHA-256 as `lfs.oid`).
