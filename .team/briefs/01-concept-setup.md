# Brief 01-concept-setup

Owner: Concept creator. Phase: Setup. This is the largest setup brief.

Goal: a working, headless ComfyUI pipeline for website imagery, separate from the Safeguard game project but sharing its engine and models.

Read first: `F:\ArtGen\Safeguard\README.md`, `F:\ArtGen\Safeguard\Launch ComfyUI.bat`, and the six SG workflows in `F:\ArtGen\Safeguard\user\default\workflows\`. Reuse their tuned settings (models, CFG, steps, samplers). Do not modify anything in `Safeguard` or the ComfyUI engine.

Deliverables in `F:\ArtGen\Website Test\artgen\`:
1. `Launch ComfyUI (Website).bat` modelled on the Safeguard launcher, with `--user-directory`, `--input-directory` and `--output-directory` pointing into `artgen\` (`user`, `input`, `output`). Also a headless variant (no `--auto-launch`) the team can run in the background.
2. Website workflows in `artgen\user\default\workflows\`, UI format, prefixed `WEB`:
   - `WEB1 Klein - Hero and Key Art` (wide aspect ratios: 16:9, 21:9, 3:2; photographic and illustrative presets in notes)
   - `WEB2 Klein - Style Match and Edit` (reference images in, for matching a direction or editing a pick)
   - `WEB3 Z-Image - Fast Exploration` (quick drafts for moodboards)
   - `WEB4 Klein - Style Frame` (full-page website mood mockup, portrait and landscape)
   - `WEB5 Texture and Pattern` (seamless or near-seamless backgrounds)
   - `WEB6 Upscale 2x` (from Safeguard SG5)
   Add a note node in each explaining the inputs, like the SG workflows do.
3. API-format exports of each in `artgen\api\` plus `artgen\generate.py`: a CLI that takes a workflow name, prompt, optional negative prompt, size, seed, count and output folder; patches the API JSON; POSTs to `http://127.0.0.1:8188/prompt`; waits for completion; downloads results; and writes a provenance sidecar JSON per image. It should start ComfyUI headless itself if the server is not up. Use the ComfyUI venv Python (`F:\ArtGen\ComfyUI\venv\Scripts\python.exe`) or plain stdlib so it needs no installs.
4. `artgen\README.md`: like the Safeguard README but for websites: which workflow for what, prompting guidance for web imagery (negative space for headline copy, no text, consistent lighting across a set, aspect ratios per section), timings, licences.
5. A smoke test: generate one image from each of WEB1, WEB3 and WEB6 into `artgen\output\_smoke\` and record the timings in your report. Stop ComfyUI afterwards if you started it.

Acceptance: `generate.py` works end to end from a cold start; workflows open in the ComfyUI UI without missing nodes.
When done: commit your paths (outputs are git-ignored), write `.team/reports/01-concept-setup-concept.md`, send DONE to the PM, then wait.
