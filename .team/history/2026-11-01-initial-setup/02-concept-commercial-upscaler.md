# Brief 02-concept-commercial-upscaler

Owner: Concept creator. Phase: Setup follow-up. Priority: low; finish before Build, and before Gate 2 if convenient.

Decision (PM): add a commercially licensed upscaler, kept inside our project rather than in the shared ComfyUI install.

Deliverables:
1. Download RealESRGAN_x4plus (BSD-3) from its official source (the xinntao/Real-ESRGAN GitHub releases) into `artgen\models\upscale_models\`. Record the URL and SHA-256 in `artgen\README.md`. Git-ignore `artgen/models/`.
2. `artgen\extra_model_paths.yaml` pointing ComfyUI at `artgen\models\`; pass it with `--extra-model-paths-config` in both launchers and in generate.py's auto-start.
3. Add `WEB6b Upscale 2x (commercial)` using RealESRGAN_x4plus, or add a model switch to WEB6. Make the commercial upscaler the default in generate.py for anything going into `web/`. Keep 4x-UltraSharp for boards only, and say so in the README.
4. Add a quick side-by-side check (same source image through both upscalers) to `artgen\output\_smoke\` and note quality differences in your report.

Do not modify `F:\ArtGen\ComfyUI` or `F:\ArtGen\Safeguard`.
When done: commit your paths, write `.team/reports/02-concept-commercial-upscaler-concept.md`, send DONE to the PM, then wait.
