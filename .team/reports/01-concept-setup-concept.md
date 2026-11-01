# Report 01-concept-setup (Concept)

State: DONE. A headless ComfyUI pipeline for website imagery is in `F:\ArtGen\Website Test\artgen\`. It shares the engine and models in `F:\ArtGen\ComfyUI` and changes nothing in that folder or in `F:\ArtGen\Safeguard`.

## Delivered

| Deliverable | Path |
|---|---|
| UI launcher (manager, auto-launch) | `artgen\Launch ComfyUI (Website).bat` |
| Headless launcher (no browser, no manager; log in `artgen\user\comfyui_headless.log`) | `artgen\Launch ComfyUI (Website, headless).bat` |
| 6 WEB workflows, UI format, each with a note node | `artgen\user\default\workflows\WEB1..WEB6 *.json` |
| API exports + patch manifest | `artgen\api\WEB*.json`, `artgen\api\manifest.json` |
| CLI | `artgen\generate.py` (stdlib only) |
| Workflow source of truth (writes both formats from one definition) | `artgen\tools\build_workflows.py` |
| Guide | `artgen\README.md` |
| Smoke batch (also an example of `--jobs`) | `artgen\smoke_jobs.json` |

Workflows reuse the Safeguard tuning:
- **WEB1** Klein full, 30 steps, CFG 3.5, 16:9 at 2 MP default. Photographic and illustrative presets are in the note.
- **WEB2** Klein distilled edit with `ReferenceMultiLatent`, the SG2 settings: 16 steps, CFG 1, 1.5 MP.
- **WEB3** Z-Image Turbo, the SG3 settings: 8 steps, CFG 1, res_multistep, shift 3, 1 MP.
- **WEB4** Klein full, 9:16 portrait style frame by default; landscape via `--size 16:9`.
- **WEB5** is new: Klein distilled draws a texture, the tile is wrapped by half, and the seam cross is repainted with a feathered mask and DifferentialDiffusion. The result tiles seamlessly; a 2x2 check on terrazzo shows no seam.
- **WEB6** is the SG5 upscale: 4x-UltraSharp, then 0.5x.

`generate.py` does the following:
- Takes a workflow, prompt, negative, size (aspect or WxH), seed, count, out folder and name, plus model, steps, CFG, input image and refs.
- Patches the API JSON, POSTs to `/prompt`, polls `/history`, moves results to `--out`, and writes a provenance sidecar per image. The sidecar holds the workflow, prompt, negative, seed, model, steps, CFG, sampler, size, refs (embedding their own sidecars), licence, timing, ComfyUI version and the full API graph.
- Starts ComfyUI headless if it is down and stops it at the end (`--keep-server` to leave it up). `--stop` stops it.
- Refuses to use a ComfyUI started by Safeguard, because uploads would land in Safeguard's input folder. Override with `--allow-foreign-server`.
- Also supports `--jobs` (a batch with one server start), `--replay` (re-run from a sidecar) and `--dry-run`.

## Verification

- **Cold start, end to end:** with no server running, one `generate.py --jobs artgen\smoke_jobs.json --out artgen\output\_smoke` started ComfyUI, ran WEB3, WEB1 and WEB6, wrote sidecars and stopped the server.
- **UI files:** all 6 are listed by the server's userdata API. Every node type exists in `/object_info` (MarkdownNote is frontend-only, as in the SG workflows), and every link's types and slot ids are consistent. I did not open them in a browser; the structure mirrors the SG files.
- **All 6 workflows** generated successfully on test runs (`artgen\output\_test\`, ignored).
- **`--replay`** of the WEB3 smoke image reproduced it bit-for-bit (mean pixel difference 0.0).

## Smoke timings (`artgen\output\_smoke\`, RTX 4070 SUPER)

| Step | Output | Time |
|---|---|---|
| Server start (cold) | n/a | 14 s |
| WEB3 Z-Image, 16:9 1 MP | 1360x768 | 7.7 s (includes model load) |
| WEB1 Klein full, 16:9 2 MP, 30 steps | 1936x1088 | 42.9 s (includes model switch) |
| WEB6 upscale of the WEB1 image | 3872x2176 | 13.3 s |
| **Total wall clock** including start and stop | 3 images | **84 s** |

The models were already in the OS file cache from earlier test runs. A first run after a reboot will load 5-6 GB per model from disk and be slower.

Other measured timings: WEB3 warm 5.6 s, WEB4 30.5 s (9:16, 1.5 MP), WEB5 13.6 s warm and 17.3 s with a model switch, WEB2 55 s (2 refs, 1.5 MP), WEB6 7 s from a 1 MP input.

## Findings worth knowing

- Putting "moodboard image for a website" in a prompt made Z-Image draw a collage with white panel borders. The README tells everyone to describe the image itself and to leave "website", "banner" and "moodboard" out of prompts (WEB4 excepted).
- WEB4 style frames get fake lettering, as expected. They are labelled as mood images.
- Klein holds negative space for headline copy well when the prompt says where it goes.

## Risks and needs

1. **Upscaler licence (needs a PM decision before Build).** 4x-UltraSharp is CC BY-NC-SA 4.0, which is non-commercial. It is fine for Gate 2 and Gate 3 boards but not for images that ship on a commercial site. I propose adding `RealESRGAN_x4plus` (BSD-3, about 64 MB) before Build. Two options:
   - put it in `F:\ArtGen\ComfyUI\models\upscale_models`. This is an addition, but the folder is shared.
   - put it in `artgen\models\`, git-ignored, wired in through an `extra_model_paths.yaml` in our launchers. This leaves the shared install untouched.

   WEB6 already accepts `--upscale-model`. I have not downloaded anything.
2. **Klein licence:** free for commercial use under US$5M revenue. Each `direction.md` will record this; a bigger client needs Z-Image (Apache 2.0) or a licence check.
3. **Port 8188 is shared with Safeguard:** only one ComfyUI can run at a time. `generate.py` detects Safeguard's server and stops rather than writing into its folders.

## Commit

`concept: artgen ComfyUI pipeline (launchers, WEB1-6 workflows, API exports, generate.py, README)`
