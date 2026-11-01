# Direction A · Paper Trail: images

Exported by `artgen/tools/export_picks.py`. Each `.webp` has a `.json` sidecar beside it with the full generation record (workflow, prompt, negative, seed, model, steps, CFG, size and the exact API graph). The record can be replayed with `python artgen/generate.py --replay <name>.json`. Mood images: none of these contain real text; any lettering on a page is set in HTML.

| File | Role | Workflow | Model | Seed | Size | Alt text |
|---|---|---|---|---|---|---|
| `a-hero.webp` | Key art (hero) | WEB1 | flux3_image_klein_int8_convrot | 1201 | 1600x899 | Overhead photograph of a deep green leather desk blotter: a blank cream sheet on the left; a rubber stamp, red ink pad, brass loupe, pencil, brass straightedge, clipped index cards and tracing paper with two pencil diamonds on the right. |
| `a-tools.webp` | Character sheet: the six agents as tools | WEB1 | flux3_image_klein_int8_convrot | 1202 | 1536x1024 | Six studio tools laid out in a row on green leather: a rubber stamp, a brass magnifier, a sable brush, a craft knife and straightedge, a bulldog clip on cream cards, and a red pencil. |
| `a-discover.webp` | Chapter: Discover | WEB1 | flux3_image_klein_int8_convrot | 1402 | 1536x1024 | Research spread out on green leather: blank index cards, small abstract photo clippings and colour swatches in loose clusters, with a brass loupe. |
| `a-concept.webp` | Chapter: Concept (three directions) | WEB1 | flux3_image_klein_int8_convrot | 1403 | 1536x1024 | Three photographic proof prints fanned on green leather beside a brass loupe: a warm paper still life, a dark amber object and a bright clay toy scene, one circled in red pencil. |
| `a-gate.webp` | Chapter: a gate | WEB1 | flux3_image_klein_int8_convrot | 1402 | 1536x1024 | A wooden rubber stamp beside a red ink pad on cream paper, which shows a round vermilion impression of plain concentric rings. |
| `a-book.webp` | Finale: the bound book | WEB1 | flux3_image_klein_int8_convrot | 1404 | 1536x1024 | A closed hand-bound book with a cream cloth cover and a red ribbon on green leather, tracing paper and a rubber stamp beside it. |
| `a-frame-home.webp` | Style frame, home page (mood image; lettering is fake) | WEB4 | flux3_image_klein_int8_convrot | 1301 | 944x1680 | Mood image of a full home page on a green leather blotter: a paper hero, a tracing-paper diamond with red stamps, a stamped folder, fanned photos and a bound book. |
| `a-frame-chapter.webp` | Style frame, chapter (mood image; lettering is fake) | WEB4 | flux3_image_klein_int8_convrot | 1302 | 1600x899 | Mood image of one chapter: a paper sheet with a serif heading on green leather beside photo prints under a loupe. |
| `a-texture.webp` | Texture: seamless leather tile | WEB1 | flux3_image_klein_sd_int8_convrot | 5111 | 1024x1024 |  |

Licence: FLUX 3 Klein outputs (FLUX Kommunity licence; allowed for this project under the Gate 1 answer, revenue under US$5M). Upscales, if any, use RealESRGAN (BSD-3).
## Notes

- **Texture:** made with WEB1 on the distilled Klein model, then `artgen/tools/make_seamless.py` (lighting flatten plus a half-offset cross-fade; settings in the sidecar's `post` block). WEB5's in-ComfyUI seam repaint left a visible cross on these evenly coloured but unevenly lit surfaces, so it is a kit follow-up.
- **Upscaled hero:** a 2x WEB6b (RealESRGAN, BSD-3) master of the hero is at `artgen/output/how-it-works/a/_ship/` (git-ignored, with its sidecar). The Build phase exports production sizes from it.
- **Style frames** are mood images. Their lettering is invented by the model and must never be read as content.
