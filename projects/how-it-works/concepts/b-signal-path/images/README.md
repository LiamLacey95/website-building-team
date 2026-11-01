# Direction B · Signal Path: images

Exported by `artgen/tools/export_picks.py`. Each `.webp` has a `.json` sidecar beside it with the full generation record (workflow, prompt, negative, seed, model, steps, CFG, size and the exact API graph). The record can be replayed with `python artgen/generate.py --replay <name>.json`. Mood images: none of these contain real text; any lettering on a page is set in HTML.

| File | Role | Workflow | Model | Seed | Size | Alt text |
|---|---|---|---|---|---|---|
| `b-hero.webp` | Key art (hero); WEB2 clean-up of a WEB1 render | WEB2 | flux3_image_klein_sd_int8_convrot | 5401 | 1600x892 | A dark modular hardware rack of slim black modules with knobs and jacks; a single glowing amber patch cable loops through them. The left half of the frame is deep shadow. |
| `b-modules.webp` | Character sheet: the six agents as modules | WEB1 | flux3_image_klein_int8_convrot | 2102 | 1536x1024 | Six slim black hardware modules standing in a row, each with one kind of control: a big knob, a small amber screen, many jacks, square buttons, a fader, and a red-guarded switch. |
| `b-scope.webp` | Chapter: the double diamond on an oscilloscope | WEB1 | flux3_image_klein_int8_convrot | 2103 | 1536x1024 | Close-up of a round oscilloscope screen glowing amber, its trace forming two diamond shapes side by side. |
| `b-gate.webp` | Chapter: a gate | WEB2 | flux3_image_klein_sd_int8_convrot | 5402 | 1536x1024 | Macro of a heavy black toggle switch under a flipped-up red safety cover, a small amber lamp lit beside it. |
| `b-converge.webp` | Chapter: converge (many inputs, one output) | WEB1 | flux3_image_klein_int8_convrot | 2105 | 1536x1024 | Many thin grey cables sweeping in and converging into a few glowing amber cables plugged into one panel. |
| `b-frame-home.webp` | Style frame, home page (mood image; lettering is fake) | WEB4 | flux3_image_klein_int8_convrot | 2301 | 944x1680 | Mood image of a full dark home page: an expanded headline, a rack photo, an amber oscilloscope strip with two diamonds, six module panels and a guarded switch. |
| `b-frame-chapter.webp` | Style frame, chapter (mood image; lettering is fake) | WEB4 | flux3_image_klein_int8_convrot | 2302 | 1600x899 | Mood image of one dark chapter: a heading and text beside a module with a knob and a small amber screen, an amber trace across the top. |
| `b-texture.webp` | Texture: seamless brushed-metal tile | WEB1 | flux3_image_klein_sd_int8_convrot | 5211 | 1024x1024 |  |

Licence: FLUX 3 Klein outputs (FLUX Kommunity licence; allowed for this project under the Gate 1 answer, revenue under US$5M). Upscales, if any, use RealESRGAN (BSD-3).
## Notes

- **Texture:** made with WEB1 on the distilled Klein model, then `artgen/tools/make_seamless.py` (lighting flatten plus a half-offset cross-fade; settings in the sidecar's `post` block). WEB5's in-ComfyUI seam repaint left a visible cross on these evenly coloured but unevenly lit surfaces, so it is a kit follow-up.
- **Upscaled hero:** a 2x WEB6b (RealESRGAN, BSD-3) master of the hero is at `artgen/output/how-it-works/b/_ship/` (git-ignored, with its sidecar). The Build phase exports production sizes from it.
- **Style frames** are mood images. Their lettering is invented by the model and must never be read as content.
