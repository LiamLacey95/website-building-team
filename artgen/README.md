# Website art station

Local image generation for the website team: hero and key art, moodboard drafts, style frames, textures and upscales.
It runs a ComfyUI engine whose location is in `team.config.json` (`comfyui.path`). That install may be shared with other projects; this folder holds the team's own workflows, launchers, inputs, outputs and project-only models.
Tuned for a 12 GB NVIDIA GPU (built on an RTX 4070 SUPER).

## Setting up on a new machine

`node scripts/bootstrap.mjs` runs these steps for you (see `BOOTSTRAP.md`). By hand, from the repo root, with any Python 3.10+:

1. **Engine and models.** Either connect an install you already have:
   ```
   python artgen/setup/install_comfyui.py --verify <ComfyUI dir>            full check incl. hashes (~3 min first time, cached after)
   python artgen/setup/install_comfyui.py --models-only <ComfyUI dir>       add whatever is missing
   ```
   or install a fresh one (clones ComfyUI at the pinned commit, creates its venv with CUDA torch for your driver, installs requirements and the manager, downloads the models with resume and SHA-256 checks):
   ```
   python artgen/setup/install_comfyui.py --install <dir> --dry-run          plan, sizes, disk check, token check
   python artgen/setup/install_comfyui.py --install <dir>
   ```
   Add `--with-extras` for the depth model and ControlNet (8 GB, not used by the WEB workflows), `--skip-models` for the engine only, `--json` for machine-readable output.
2. **Hugging Face token (once).** FLUX 3 Klein is only published in Black Forest Labs' gated repo. Create a free account at https://huggingface.co/join, accept the licence at https://huggingface.co/black-forest-labs/flux-3-image-klein-comfy, create a read token at https://huggingface.co/settings/tokens and set it as `HF_TOKEN` before installing. The installer checks access before downloading anything. The token is only sent to huggingface.co and is never written to disk by these scripts.
3. **Config.** `team.config.json` at the repo root (git-ignored; bootstrap writes it from `team.config.example.json`):
   ```json
   {"comfyui": {"path": "D:/ComfyUI", "python": "D:/ComfyUI/venv/Scripts/python.exe", "port": 8188, "profile": "12gb"}}
   ```
   Only `path` is required. `python` defaults to `<path>/venv/Scripts/python.exe` (Windows) or `<path>/venv/bin/python` (Linux); `port` to 8188; `profile` to `12gb`. Environment overrides: `COMFYUI_PATH`, `COMFYUI_PYTHON`, `COMFYUI_PORT`, `COMFYUI_PROFILE`, `TEAM_CONFIG`.
4. **Launchers.** `python artgen/setup/configure.py` writes this machine's launchers from the templates in `artgen/setup/templates/` (`--check` validates without writing).
5. **Smoke test.** `python artgen/generate.py --smoke` makes one image each with WEB3, WEB1 and WEB6b, prints timings and writes `artgen/output/_smoke/<timestamp>/smoke.json`.

### What gets downloaded

| | Size |
|---|---|
| Required models (Klein full and distilled, Klein text encoder and VAE, Z-Image Turbo with encoder and VAE, RealESRGAN) | 29.1 GB |
| Optional: 4x-UltraSharp (boards only, installed by default) | 0.07 GB |
| Extras with `--with-extras`: depth model and Z-Image ControlNet | 8.0 GB |
| ComfyUI checkout plus venv (CUDA torch, requirements) | about 4.5 GB |
| **Default fresh install** | **about 34 GB on the ComfyUI drive**, plus about 4 GB of uv/pip download cache on the system drive |

Plan for 40 GB free, plus room for outputs. The full list with URLs, hashes, licences and which workflow uses what is `artgen/setup/models.json`.

### Hardware tiers

| GPU | Setting | What changes |
|---|---|---|
| NVIDIA 12 GB or more (tested: RTX 4070 SUPER) | `"profile": "12gb"` | Everything as documented below |
| NVIDIA 8-11 GB | `"profile": "8gb"` | `generate.py` uses distilled Klein for WEB1 and WEB4 (CFG 1, 12 steps), caps text-to-image at 1 MP and WEB2 references at 1 MP, unless you pass `--model`, `--mp` or `--ref-mp`. Ship at 1 MP plus WEB6b 2x (1360 px becomes 2720 px). The 5-6 GB models plus 5 GB text encoders do not fit together, so ComfyUI streams weights: expect 1.5 to 3 times the timings below. **Not yet tested on an 8 GB card** |
| Under 8 GB, AMD, Apple | not supported | ComfyUI can run but these workflows will be impractically slow. The installer refuses to install without an NVIDIA GPU unless you pass `--allow-cpu` |

Drivers: the installer picks torch from the highest CUDA version your driver supports (cu130 for driver 580+, recommended by ComfyUI for RTX 20-series and newer; cu128 or cu126 for older drivers). Python 3.13 is recommended (3.11 and 3.12 work); if `uv` is installed it fetches 3.13 for the venv itself.

**Shared GPU:** other apps holding VRAM (browsers, Playwright, games) push ComfyUI into streaming mode. On the reference machine, with about 7 GB of VRAM held by other apps and the CPU busy, the smoke test took 93 s instead of 64 s and the server start took 67 s instead of 14 s. Close what you can before long batches.

## Start

- **Headless (normal for the team):** just run `generate.py`. If ComfyUI is not up, it starts it in the background, generates, and stops it again (pass `--keep-server` to leave it running for a batch).
- **UI:** run the launcher `configure.py` wrote: `artgen\Launch ComfyUI (Website).bat` on Windows, `artgen/launch-comfyui.sh` on Linux. ComfyUI opens at `http://127.0.0.1:<port>`. Press **W** for the Workflows panel; the website workflows start with `WEB`.
- **Background server by hand:** `python artgen/generate.py --start`, and `--stop` to stop it. (The headless launchers do the same.)

All of these pass `--extra-model-paths-config artgen/extra_model_paths.yaml`, which adds this project's own models in `artgen/models/` (the commercial upscaler). A ComfyUI started any other way will not see them.

If another project's ComfyUI (for example one that shares the install) is already on the port, `generate.py` refuses to use it, because inputs and outputs would land in that project's folders. Close it or give this team another `comfyui.port`.

## Folders

| Path | What |
|---|---|
| `comfyui.path` (from `team.config.json`) | Engine, Python venv and the shared models (may be shared; never modify the engine or delete models you did not add) |
| `artgen/setup/` | `install_comfyui.py`, `configure.py`, `models.json` (pinned ComfyUI commit, torch choice, every model with URL and SHA-256), launcher templates |
| `artgen/user/default/workflows` | The WEB workflows (UI format). Anything you save in the UI lands here |
| `artgen/api` | API-format exports plus `manifest.json` (which nodes `generate.py` patches) |
| `artgen/input` | Reference images. `generate.py` copies its inputs into `input/_generate/` (ignored) |
| `artgen/output` | Every generated image (git-ignored). Copy picks out with their `.json` sidecar |
| `artgen/models` | Project-only models (git-ignored; installed by `install_comfyui.py`) |
| `artgen/extra_model_paths.yaml` | Points ComfyUI at `artgen/models/` (relative paths, committed) |
| `artgen/comfy_config.py` | Reads `team.config.json` for every script here |
| `artgen/tools/build_workflows.py` | Single source for the WEB workflows; writes both formats |

## Which workflow

| Workflow | Use it for | Model | Time (12 GB, warm) |
|---|---|---|---|
| **WEB1 Klein - Hero and Key Art** | Hero banners, section key art, feature images. Best quality and prompt-following | Klein full, 30 steps, CFG 3.5 | ~30 s at 2 MP (~43 s including model load) |
| **WEB2 Klein - Style Match and Edit** | Edit a pick with words; make a new image that matches a direction's refs; clear space for copy | Klein distilled, 16 steps, CFG 1 | ~55 s with 2 refs at 1.5 MP |
| **WEB3 Z-Image - Fast Exploration** | Moodboard drafts, trying many compositions quickly | Z-Image Turbo, 8 steps, CFG 1 | ~6 s at 1 MP (~8 s including load) |
| **WEB4 Klein - Style Frame** | Full-page "feel" mockups for Gate 2 boards, portrait (scrolling page) or landscape (viewport). Mood image, not a layout | Klein full, 30 steps, CFG 3.5 | ~31 s at 1.5 MP |
| **WEB5 Texture and Pattern** | Seamless tiles: paper, grain, fabric, terrazzo, subtle backgrounds | Klein distilled, 2 passes x 12 steps | ~14 s at 1024 px (~17 s including load) |
| **WEB6b Upscale 2x (commercial)** | **Anything that ships on the site.** Take a pick to production size (1936 px becomes 3872 px) | RealESRGAN_x4plus (BSD-3), then 0.5x | ~10-13 s |
| **WEB6 Upscale 2x** | **Boards only** (moodboards, gate packets, reviews). Slightly more faithful detail, but non-commercial | 4x-UltraSharp (CC BY-NC-SA), then 0.5x | ~10-13 s |

Times were measured on the reference machine (Nov 2026) with the models already in system RAM and a mostly idle GPU. Server start is ~14 s. Switching between Klein full, Klein distilled and Z-Image reloads models (5-6 GB each), which adds 10-20 s, so **batch work per model family**: all WEB3 drafts, then all WEB1/WEB4 (Klein full), then WEB2/WEB5 (Klein distilled).

## generate.py

Stdlib only; run it from the repo root with any Python 3.9+ (the ComfyUI venv python works too).

```
python artgen/generate.py --smoke
python artgen/generate.py --list
python artgen/generate.py WEB3 -p "..." --count 8 --out projects/<slug>/concepts/a-calm/explore
python artgen/generate.py WEB1 -p "..." --size 21:9 --mp 2 --seed 42 --name hero
python artgen/generate.py WEB1 -p "..." --size 1920x816 --model fast        (exact size; distilled draft)
python artgen/generate.py WEB4 -p "..." --size 16:9                          (landscape style frame)
python artgen/generate.py WEB2 -i pick.png --ref hero.png -p "... <ref_image_1> ..."
python artgen/generate.py WEB5 -p "Seamless tileable ..." --size 768x768
python artgen/generate.py WEB6b -i artgen/output/web1/hero_00001_.png --out projects/<slug>/web/public/assets/generated
python artgen/generate.py WEB6 -i artgen/output/web1/hero_00001_.png --out projects/<slug>/concepts/a-calm   (boards)
python artgen/generate.py --jobs batch.json --out artgen/output/batch
python artgen/generate.py --replay artgen/output/web1/hero_00001_.json
python artgen/generate.py --start | --stop
```

A `--jobs` file is a JSON list of objects with the same keys as the flags, for example `[{"workflow": "WEB3", "prompt": "...", "count": 4}, {"workflow": "WEB1", "prompt": "...", "size": "21:9", "seed": 7}]`. Command-line flags act as defaults, and the whole batch shares one server start.

| Flag | Meaning |
|---|---|
| `--prompt/-p`, `--negative/-n` | Prompt text. Negative only exists in WEB1/WEB4 and only works at CFG > 1 |
| `--size/-s` | `WxH` (rounded to multiples of 16) or an aspect: `1:1 2:3 3:2 3:4 4:3 9:16 16:9 21:9`. For other ratios (4:5, 2:1, 3:1) use `WxH` |
| `--mp` | Megapixels when `--size` is an aspect (WEB1 2.0, WEB3 1.0, WEB4 1.5; 1.0 on the 8gb profile) |
| `--seed`, `--count/-c` | First seed (random if omitted); each extra image uses seed + 1 |
| `--out/-o`, `--name` | Output folder (default `artgen/output/<web#>`) and filename prefix |
| `--model` | `full` or `fast` (Klein), or a filename. Switching applies the tuned steps/CFG unless you pass `--steps`/`--cfg` |
| `--image/-i`, `--ref` | WEB2 `<ref_image_0>` and extra refs (repeat `--ref`); WEB6/WEB6b image to upscale |
| `--ref-mp`, `--seam-denoise`, `--scale`, `--upscale-model` | WEB2 working size; WEB5 seam repaint strength (0.75); WEB6/WEB6b scale after 4x (0.5) and model |
| `--smoke` | First-start check: WEB3, WEB1, WEB6b with fixed prompts and seeds, timings, `smoke.json`; exit 0 when all three succeed |
| `--jobs`, `--replay` | Batch file; re-run the exact API graph stored in a sidecar (bit-identical result on the same engine) |
| `--keep-server`, `--start`, `--stop`, `--dry-run` | Leave the server up; start it and exit; stop it; print the patched graph without running |

**Shipping rule (enforced):** any output written into a folder named `web` (a project's `projects/<slug>/web/...`, or a variant worktree's `web/`) must use a commercial upscaler. If you run WEB6 into such a folder, `generate.py` switches it to RealESRGAN_x4plus and says so. Explicitly asking for `--upscale-model 4x-UltraSharp.safetensors` there, or `--replay`ing an UltraSharp graph there, is refused.

**Provenance.** Every image gets `<image>.json` beside it with the workflow, prompt, negative, seed, model, steps, CFG, sampler, size, input images and refs (with their own sidecars embedded), licence, profile, timing, ComfyUI version and the full API graph. Copy the `.json` with the image whenever a pick leaves `artgen/output/`.

## Prompting for websites

- **Write full captions, not tags.** Subject, setting, light, palette, lens and camera, mood. Klein gives generic results from short prompts.
- **Don't say "website", "moodboard", "banner" or "hero" in image prompts** (except WEB4). The models draw collages, UI chrome and fake buttons. Describe the photograph or illustration itself: *Wide editorial photograph. ...*
- **Plan negative space for copy.** Say where it goes and what it is: *The left half of the frame is a clean, softly lit plaster wall with plenty of negative space for a headline.* Keep the subject on the opposite third. For centred hero copy: *subject low in the frame, the upper half open sky*.
- **No text.** End every prompt with *No text, no letters, no logos.* Real copy is set in HTML. WEB4 style frames will still invent lettering; say they are mood images and never use one where readable text matters.
- **Keep a set consistent.** For each direction fix one lighting sentence, one palette sentence and one lens/rendering sentence, and paste them unchanged into every prompt in the set. For new images that must match a pick, use WEB2 with the pick as a reference.
- **Text contrast comes later.** Images behind text need a calm, low-detail area; Front-end adds overlays. Avoid busy detail where the headline sits.
- **Presets** (paste and edit):
  - *Photographic:* Editorial photograph, shot on a 35 mm lens at f/2.8, soft natural window light, shallow depth of field, true-to-life colour, subtle film grain.
  - *Illustrative:* Flat vector-style editorial illustration, clean geometric shapes, limited palette of [3-4 colours], soft paper grain, no outlines, generous empty background.
  - *3D:* Soft 3D render, matte clay materials, rounded forms, gentle studio lighting with soft shadows, pastel palette of [...], plain seamless background.
  - *Texture (WEB5):* Seamless tileable texture, flat top-down view of [...], perfectly even diffuse lighting, no vignette, no shadows, no focal point.
- **Randomise vs lock:** drafts use random seeds; to iterate on one image, reuse its seed from the sidecar and change one thing at a time.

### Aspect ratios per section

| Section | Aspect | Generate at | Ship at |
|---|---|---|---|
| Full-bleed hero (desktop) | 16:9 | WEB1 2 MP (1936x1088) | WEB6b 2x, crop to 2560-3840 wide |
| Ultrawide banner | 21:9 | WEB1 2 MP (2208x944) | WEB6b 2x |
| Mobile hero (art-directed crop) | 4:5 or 9:16 | WEB1 `--size 1088x1360` / `9:16` | 1080-1440 wide |
| Section / feature image | 3:2 or 4:3 | WEB1 1.5 MP | 1200-1600 wide |
| Card thumbnail | 1:1, 4:3 or 3:2 | WEB1 `--model fast`, 1 MP | 600-800 wide |
| Background tile | 1:1 | WEB5 1024 | 512-1024, `background-repeat` |
| Open Graph image | 1.91:1 | WEB1 `--size 1200x624` then crop to 1200x630 | 1200x630 |

Export shipped images as AVIF or WebP at the sizes Front-end asks for. Keep the PNG master and sidecar in the concept folder.

## Models and licences

| Model | File (ComfyUI folder) | Size | Used by | Licence |
|---|---|---|---|---|
| FLUX 3 Image Klein, full (BFL "base") | `flux3_image_klein_int8_convrot` (diffusion_models) | 5.8 GB | WEB1, WEB4 | FLUX Kommunity: free commercial use under US$5M annual revenue (gated repo) |
| FLUX 3 Image Klein, distilled | `flux3_image_klein_sd_int8_convrot` (diffusion_models) | 5.8 GB | WEB2, WEB5, `--model fast` | as above |
| Klein text encoder | `qwen3vl_4b_int8_convrot` (text_encoders) | 4.9 GB | Klein workflows | Apache 2.0 (in the gated FLUX repo) |
| Klein VAE | `flux2-vae` (vae) | 0.3 GB | Klein workflows | FLUX Kommunity (gated repo) |
| Z-Image Turbo, encoder, VAE | `z_image_turbo_int8_convrot`, `qwen_3_4b_fp8_mixed`, `ae` | 6.2 + 5.6 + 0.3 GB | WEB3 | Apache 2.0 |
| RealESRGAN x4plus | `RealESRGAN_x4plus.pth` (`artgen/models/upscale_models/`) | 0.07 GB | WEB6b | BSD-3-Clause: commercial use OK |
| 4x-UltraSharp (optional) | `4x-UltraSharp` (upscale_models) | 0.07 GB | WEB6 | **CC BY-NC-SA 4.0: non-commercial, boards only** |
| Depth Anything 3 mono large (extra) | `depth_anything_3_mono_large` (geometry_estimation) | 1.3 GB | none yet | Apache 2.0 |
| Z-Image ControlNet Union 2.1 (extra) | `Z-Image-Turbo-Fun-Controlnet-Union-2.1-2602-8steps` (model_patches) | 6.7 GB | none yet | Apache 2.0 |

Sources and SHA-256 for every file: `artgen/setup/models.json`. The Klein files are saved under the names the workflows use: BFL publishes the full model as `flux3-image-klein-base-int8-convrot` and the distilled one as `flux3-image-klein-int8-convrot`.

Record the model licence in every `direction.md`. Klein outputs are fine for a client whose revenue is under US$5M; above that, check the licence or use Z-Image (Apache 2.0).

**Upscaling for shipped assets:** use WEB6b. 4x-UltraSharp is non-commercial, so it stays for boards and gate packets only.

**Quality, WEB6b vs WEB6.** On the same 1936 px hero, RealESRGAN is a little smoother: it softens film grain, fine skin texture and the throwing lines on clay. It can also turn faint speckles in flat areas into crisp dark hairlines. UltraSharp stays closer to the source. At normal web display sizes the difference is small. Before shipping, check flat copy areas (sky, walls) at 100% for stray marks and retouch them. If grain matters, add it back in post.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `no ComfyUI location` | `team.config.json` is missing or has no `comfyui.path`: run `node scripts/bootstrap.mjs` |
| A node or model is missing | `python artgen/setup/install_comfyui.py --verify <path>` says which; `--models-only <path>` fixes models. An older ComfyUI: `git pull` in its folder, then reinstall its requirements |
| `HTTP 401/403` from Hugging Face | Token missing or wrong, or the FLUX licence not accepted for that account (see step 2) |
| Port in use by another project | Close it, or set another `comfyui.port` and rerun `configure.py` |
| Very slow or out of VRAM | Close other GPU apps; on an 8 GB card set `"profile": "8gb"` |

## Changing a workflow

Edit the definition in `tools/build_workflows.py`, then rebuild both formats (needs a running server):

```
python artgen/generate.py --start
python artgen/tools/build_workflows.py
python artgen/generate.py --stop
```

If you tweak a workflow in the UI and want to keep it, port the change into the builder so the API export and `manifest.json` stay in step.
