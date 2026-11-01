# Report 03-concept-comfyui-installer (Concept)

State: DONE. A fresh machine can now install ComfyUI and every model the WEB workflows need, or connect an existing install, through stdlib-only scripts in `artgen/setup/`. Every script in `artgen/` now reads the ComfyUI location from `team.config.json`; nothing in the committed files is machine-specific. Nothing in `F:\ArtGen\ComfyUI` or `F:\ArtGen\Safeguard` was modified (read and hashed only).

## Delivered

| Deliverable | Path |
|---|---|
| Model manifest: 11 files, plus the pinned ComfyUI commit and torch rules | `artgen/setup/models.json` |
| Installer: `--verify`, `--install`, `--models-only`, `--dry-run`, `--json`, `--with-extras`, `--skip-models`, `--allow-cpu` | `artgen/setup/install_comfyui.py` |
| Launcher generator + templates (Windows `.bat`, Linux `.sh`) | `artgen/setup/configure.py`, `artgen/setup/templates/` |
| Bootstrap interface spec (commands, config keys, exit codes, JSON shapes) | `artgen/setup/README.md` |
| Config loader shared by all artgen scripts | `artgen/comfy_config.py` |
| `generate.py --smoke`, config-driven paths, 8 GB profile, shipping guard for `projects/<slug>/web/` | `artgen/generate.py` |
| New-machine setup, hardware tiers, download sizes, licence table, troubleshooting | `artgen/README.md` |

Generated launchers are now git-ignored. `artgen/extra_model_paths.yaml` stays committed, because it only uses paths relative to itself. `smoke_jobs.json` is gone (replaced by `--smoke`). The deletions went in with Front-end's 8cc32b9, as the PM noted.

## Model sources (deliverable 1)

All URLs are the official upstream repos; I found them via ComfyUI's own workflow templates and the Hugging Face API.

- **Ungated files, checked byte-for-byte:** for `z_image_turbo_int8_convrot`, `qwen_3_4b_fp8_mixed`, `ae`, `depth_anything_3_mono_large`, `Z-Image-Turbo-Fun-Controlnet-Union-2.1-2602-8steps` and `4x-UltraSharp.safetensors`, the local SHA-256 equals the upstream SHA-256 that Hugging Face publishes. RealESRGAN was already verified in brief 02.
- **Klein files are gated.** The two Klein models, `qwen3vl_4b_int8_convrot` and `flux2-vae` exist only in Black Forest Labs' gated repo `black-forest-labs/flux-3-image-klein-comfy`. It needs a free Hugging Face account, the licence accepted once, and `HF_TOKEN`. Hugging Face hides hashes on gated repos, so I matched these by exact byte size and recorded the local hashes.
- **The local Klein filenames don't match BFL's:**
  - our "full" `flux3_image_klein_int8_convrot` is BFL's `flux3-image-klein-base-int8-convrot` (5,807,427,339 bytes);
  - our `_sd_` file is BFL's `flux3-image-klein-int8-convrot` (5,827,874,779 bytes).

  The manifest keeps the workflow names and records `sourceFile`. ComfyUI's own templates point at underscore names that no longer exist in that repo.
- **No public ungated source for Klein.** There are third-party mirrors (for example `ml-resources/flux-3-image-klein-comfy`), but I did not use them. For the VAE only, the manifest lists Comfy-Org's public `flux2-dev` copy as an untested alternative (2,264 bytes larger).
- **Extras:** the depth model and the ControlNet are not used by any WEB workflow. They are listed as extras, off by default.

## Tests

| Test | Result |
|---|---|
| `--verify F:\ArtGen\ComfyUI` (full) | GREEN: pinned commit `bdc63e7` (0.41.0), Python 3.13.11, torch 2.14.1+cu130, manager 4.2.2, all 11 hashes match. 2 min 32 s cold, 5 s cached, `--quick` 0.6 s |
| Real download of RealESRGAN into an empty temp folder | OK, 2.5 s, hash verified |
| Resume from a 20 MB `.part` | OK, hash verified |
| Corrupted `.part` | rejected with SHA-256 mismatch and deleted |
| `--install --dry-run` into a temp folder | correct plan: clone, uv venv with Python 3.13, cu130 torch 2.14.1, requirements; 29.1 GB download, 34.3 GB needed. Blocked cleanly with no token, and with a rejected token. Changed nothing on disk |
| **Real `--install --skip-models` into a temp folder** | OK in 3.1 min: clone at the pinned commit, venv, torch, requirements and manager (fast because uv had the wheels cached; a clean machine downloads about 3 GB of wheels). `--verify` on it: engine all OK, models red as expected |
| ComfyUI run from that fresh install (port 8190 via env overrides) | booted (first start 164 s, one-time setup) and produced a WEB6b image with the project-local RealESRGAN. Then deleted |
| `configure.py` / `--check` with Backend's real `team.config.json` | GREEN; `.bat` files written with CRLF and native paths |
| Linux `.sh` templates rendered with a path containing a space | `bash -n` OK (not run on Linux) |
| `generate.py --smoke` from cold, config-driven | OK, see below |
| 8gb profile (dry run) | WEB1 switches to distilled Klein, 12 steps, CFG 1, 1.0 MP; explicit `--model full --mp 2` still wins |
| Missing config | clear error pointing at bootstrap; `--list` still works without a config |

## Smoke timings (this machine, cold server, `team.config.json`)

| Step | Size | Time |
|---|---|---|
| Server start | | 67.3 s |
| WEB3 | 1360x768 | 20.3 s |
| WEB1 | 1936x1088 | 49.3 s |
| WEB6b | 3872x2176 | 23.0 s |
| Total | | 92.7 s (168 s wall clock) |

This is 1.5 to 5 times slower than this morning (14 s start, 64 s for the three images). During the run about 7 GB of VRAM was held by other apps and the CPU was at 100% from other agents' work, which pushes ComfyUI into streaming weights. The README now says to close GPU apps before long batches.

## Not tested

- **A real model download of the gated Klein files.** There is no Hugging Face token on this machine. The token check (missing or rejected) and the 401/403 messages work. Downloading, resume and hashing are proven on RealESRGAN, and every manifest hash matches the local files.
- **A full fresh install including the 29 GB of models.** Not cheap; the engine part ran for real.
- **Linux launchers and the Linux installer path:** syntax-checked only, not run.
- **The 8 GB profile on a real 8 GB card.**
- **Drivers older than CUDA 13.0:** the cu128 and cu126 index choice is implemented but untested. ComfyUI says cu130 is required on RTX 20-series and newer.

## Corrections for BOOTSTRAP.md section 1 (PM-owned)

- **Python:** "3.11 or 3.12" should be "3.11 to 3.13 (3.13 recommended)". This machine runs 3.13.11, and ComfyUI's README recommends 3.13. With `uv` installed, the installer fetches 3.13 for the venv regardless.
- **Driver:** add "NVIDIA driver 580 or newer (CUDA 13.0) recommended". ComfyUI requires cu130 on RTX 20-series and newer; older drivers fall back to cu128 or cu126.
- **Disk:** "about 40 GB free" is right: 29.1 GB models, about 4.5 GB engine and venv, about 4 GB of package cache, plus outputs.
- **Section 2:** "Models are about 20 GB" is wrong; it is **29 GB** (37 GB with extras).
- **Add a prerequisite:** a free Hugging Face account with the FLUX Klein licence accepted, and `HF_TOKEN` set, for fresh installs only.
- **VRAM, 8 GB:** plausible with `"profile": "8gb"` but untested; say so.

## Bootstrap step (deliverable 6)

I sent Backend the commands and config keys early in the brief. Backend's `team.config.json` already uses them, including `profile`. The full spec is on disk in `artgen/setup/README.md`.

## Commit

`concept: ComfyUI installer, model manifest, config-driven paths, --smoke` (pathspec: `artgen/`, this report).
