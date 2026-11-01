# Report 02-concept-commercial-upscaler (Concept)

State: DONE. A commercially licensed upscaler, RealESRGAN_x4plus (BSD-3-Clause), is installed inside the project and is the enforced choice for anything written under `web/`. Nothing in `F:\ArtGen\ComfyUI` or `F:\ArtGen\Safeguard` was modified.

## Delivered

1. **Model:** `artgen\models\upscale_models\RealESRGAN_x4plus.pth`, git-ignored (`artgen/.gitignore` has `models/`).
   - Source: https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth (the official release).
   - SHA-256: `4fa0d38905f75ac06eb49a7951b426670021be3018265fd191d2125df9d682f1`, which matches the commonly published hash for this file. Size 67,040,989 bytes.
   - ComfyUI loads `.pth` files with `torch.load(weights_only=True)`, so no pickle code runs.
   - The URL and hash are recorded in `artgen\README.md`.
2. **`artgen\extra_model_paths.yaml`** (relative `base_path: models/`). Both launchers and `generate.py`'s auto-start pass it with `--extra-model-paths-config`. The server lists `["4x-UltraSharp.safetensors", "RealESRGAN_x4plus.pth"]`.
3. **New workflow `WEB6b Upscale 2x (commercial)`** (UI and API formats, from the builder). WEB6 is now labelled boards-only in its note and in the README.
4. **`generate.py` enforces the shipping rule.** For any `--out` under `web\`:
   - a non-commercial upscaler is switched to RealESRGAN, with a message;
   - an explicit `--upscale-model 4x-UltraSharp.safetensors` is refused;
   - `--replay` of an UltraSharp graph is refused.

   Sidecars record the upscaler licence. Two additions came with this: workflow names are now case-insensitive (`web6b`), and there is a new `--start` flag.

## Verification

- **Cold start:** with the server stopped, `generate.py WEB6b ...` started ComfyUI (23 s), upscaled with RealESRGAN (24.3 s, first load), wrote a sidecar with the BSD-3 licence and stopped the server. Total 55 s.
- **Warm timings on the same inputs:** WEB6b 12.6 s and WEB6 12.7 s for a 1936x1088 input; 9.8 s and 9.9 s for 1664x928. Speed is the same.
- **Guards** (checked with `--dry-run`, so nothing was written into `web/`): WEB6 with `--out web/public/assets/generated` printed the switch and the graph used `RealESRGAN_x4plus.pth`; an explicit UltraSharp into `web/` exited 1 with an error.
- **Workflows:** all 7 rebuilt; WEB1 to WEB5 are unchanged apart from the WEB1 note text.

## Side by side: WEB6 (4x-UltraSharp) vs WEB6b (RealESRGAN_x4plus)

Same source (the setup smoke hero, 1936x1088) through both upscalers. Files in `artgen\output\_smoke\` (git-ignored):

- `compare_ultrasharp_00001_.png`, `compare_realesrgan_00001_.png` (3872x2176)
- `upscaler_side_by_side.png`: crops of the hands and bowl, the shelf bokeh and the plaster copy space, shown as lanczos | UltraSharp | RealESRGAN.

What I saw:

- **Detail:** UltraSharp keeps more of the source's micro-texture: skin pores, the throwing lines on the clay, film grain. RealESRGAN is cleaner and a bit smoother, with slightly waxy skin and denoised grain.
- **Fidelity:** downscaling each result back to the source size, the mean pixel difference is 1.48 for UltraSharp and 2.16 for RealESRGAN. UltraSharp is closer to the original.
- **Edge-energy (detail) measure:** hands: lanczos 10.2, UltraSharp 12.9, RealESRGAN 12.2. Shelf bokeh: lanczos 11.1, UltraSharp 12.8, RealESRGAN 10.4 (RealESRGAN smooths the blur, which is fine).
- **Artifact to watch:** in the flat plaster copy area, RealESRGAN turned two or three faint speckles into crisp dark hairlines. On a hero with headline space this would need a quick retouch. The README now says to check flat copy areas at 100% before shipping.
- **Verdict:** at normal web display sizes, and especially after AVIF or WebP compression, the difference is small. RealESRGAN is fine for production; UltraSharp stays for boards.

## Needs

Nothing.

## Commit

`concept: commercial upscaler (RealESRGAN_x4plus via project-only model path, WEB6b, web/ guard)`
