# Direction C · Marble Run: images

Exported by `artgen/tools/export_picks.py`. Each `.webp` has a `.json` sidecar beside it with the full generation record (workflow, prompt, negative, seed, model, steps, CFG, size and the exact API graph). The record can be replayed with `python artgen/generate.py --replay <name>.json`. Mood images: none of these contain real text; any lettering on a page is set in HTML.

| File | Role | Workflow | Model | Seed | Size | Alt text |
|---|---|---|---|---|---|---|
| `c-hero.webp` | Key art (hero) | WEB1 | flux3_image_klein_int8_convrot | 3201 | 1600x899 | A handmade wooden marble run with painted lanes zig-zags down against a sunflower-yellow wall; a glass marble waits at the top and tiny clay figures stand at stations along the track. |
| `c-cast.webp` | Character sheet: the six agents as clay figures (WEB2 edit of a WEB1 render) | WEB2 | flux3_image_klein_sd_int8_convrot | 5501 | 1536x1024 | Six small clay figures in a row against a yellow wall, each one colour and holding one prop: navy with a clipboard, mint with a magnifying glass, yellow with a paintbrush, red with a hammer, white with a wrench, red with a pennant. |
| `c-hand.webp` | The gate: a real human hand lifts the barrier | WEB1 | flux3_image_klein_int8_convrot | 3401 | 1536x1024 | A real human hand reaches into the clay diorama and lifts a tiny red-and-white barrier while a glass marble waits on the track and two clay figures look up. |
| `c-research.webp` | Chapter: Discover (Research station) | WEB1 | flux3_image_klein_int8_convrot | 3402 | 1536x1024 | A mint clay figure with a magnifying glass studies a glass marble on a little wooden stand, with stacks of tiny blank cards around it. |
| `c-diverge.webp` | Chapter: diverge (the track splits) | WEB1 | flux3_image_klein_int8_convrot | 3403 | 1536x1024 | A wooden marble track splitting into red, mint and white lanes with glass marbles rolling down, clay figures watching from the edges. |
| `c-studio.webp` | Chapter: the studio (who talks to whom) | WEB1 | flux3_image_klein_int8_convrot | 3404 | 1536x1024 | Six clay figures around a little sky-blue table passing tiny white paper notes to each other. |
| `c-frame-home.webp` | Style frame, home page (mood image; lettering is fake) | WEB4 | flux3_image_klein_int8_convrot | 3301 | 944x1680 | Mood image of a full yellow home page: a bold headline, a wooden marble track winding down the whole page past clay figures, white cards and a red barrier. |
| `c-frame-chapter.webp` | Style frame, chapter (mood image; lettering is fake) | WEB4 | flux3_image_klein_int8_convrot | 3302 | 1600x899 | Mood image of one chapter: a white rounded card with a heading beside a clay diorama of a marble track, a barrier and a mint figure with a magnifying glass. |
| `c-texture.webp` | Texture: seamless painted-wall tile | WEB1 | flux3_image_klein_sd_int8_convrot | 5311 | 1024x1024 |  |

Licence: FLUX 3 Klein outputs (FLUX Kommunity licence; allowed for this project under the Gate 1 answer, revenue under US$5M). Upscales, if any, use RealESRGAN (BSD-3).
## Notes

- **Texture:** made with WEB1 on the distilled Klein model, then `artgen/tools/make_seamless.py` (lighting flatten plus a half-offset cross-fade; settings in the sidecar's `post` block). WEB5's in-ComfyUI seam repaint left a visible cross on these evenly coloured but unevenly lit surfaces, so it is a kit follow-up.
- **Upscaled hero:** a 2x WEB6b (RealESRGAN, BSD-3) master of the hero is at `artgen/output/how-it-works/c/_ship/` (git-ignored, with its sidecar). The Build phase exports production sizes from it.
- **Style frames** are mood images. Their lettering is invented by the model and must never be read as content.
