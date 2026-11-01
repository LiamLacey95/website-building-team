# Note 03: Concept on a machine without an NVIDIA GPU (bootstrap --skip-comfyui)

For Gate 1 question 7 and the site's Set up page. Written by Concept, 2026-11-01. Prices come from third-party trackers checked today, and where they disagree I give a range. Check the provider's own page before quoting them to a client.

## The short answer

The Concept role still delivers three distinct directions at Gate 2 without a GPU. They are **art-directed, not generated**: palette, type, shape language, style tile, HTML style frame, CSS/SVG art, and licensed stock photography. What is lost is bespoke key art, meaning hero images made for this site, in one consistent look across a set. If the human wants bespoke imagery, the cheapest honest route is **renting a cloud GPU for a few hours** and running the same workflows there. That costs roughly US$1-3 for a Gate 2 round, with the same model licences.

## Options

| | A. No generation (default) | B. Rented cloud GPU (recommended upgrade) | C. Hosted image API | D. Local CPU or Apple Silicon |
|---|---|---|---|---|
| What it is | Style tiles, CSS and SVG art, type-led layouts, licensed stock photos | A Linux GPU box (e.g. RunPod RTX 4090) running our installer and the same WEB workflows | Black Forest Labs' API for FLUX 3 Klein (or another provider) | ComfyUI without CUDA |
| Bespoke key art | No | Yes, identical to the tuned setup | Yes, text-to-image and edits; no WEB5 seamless tiles or our tuned graphs | Technically yes, impractically slow |
| Cost | Free (Unsplash/Pexels) | ~US$0.34/h for a community RTX 4090 (trackers range $0.34-0.39; secure cloud ~$0.69-0.89), plus a few dollars a month to keep 40 GB of models on a volume. A Gate 2 round is about 1-2 billed hours, roughly $1-3 | Third-party figures: about $0.01-0.04 per Klein image at 1K; flagship FLUX 3 Image ~$0.05-0.10 at 1-2K. A Gate 2 round of ~80 images is roughly $1-5 | Free |
| Licence | Unsplash and Pexels licences allow commercial use without attribution, but you may not resell the photos unaltered. Keep a licence log per image | Same as now: FLUX Kommunity for Klein (free under US$5M revenue), Apache 2.0 for Z-Image, BSD-3 for RealESRGAN | Governed by BFL's API terms, not the Kommunity weights licence. Check the terms for commercial output use | Same as now |
| Setup | Nothing | Hugging Face token, rent a box, run `install_comfyui.py --install` (the 29 GB downloads fast in a datacenter) | API key, plus a small adapter script (not built) | `install_comfyui.py --allow-cpu`. On a Mac, ComfyUI's MPS backend |
| Speed | n/a | Faster than our 4070 SUPER | Seconds per image | CPU: many minutes per image, not workable for a set. Apple Silicon: untested here; the int8 model builds may not run at full speed on MPS. Expect minutes per image and 32 GB+ unified memory |
| Our tooling ready? | Yes | Mostly. `generate.py` can already target a remote server (`COMFY_URL` plus `--allow-foreign-server`). Input images (WEB2, WEB6b) still need an upload step: **about half a day of Concept work** to add `comfyui.url` and upload images through ComfyUI's `/upload/image` | No: needs a new adapter and a provenance format | Yes, but untested |
| Risks | Stock photos look generic and competitors may use the same images; weaker brand distinctiveness | Rental account and billing; remember to stop the box; the token is needed on the rented machine | Per-image cost scales with exploration; prompts and refs go to a third party | Slow enough that the team would cut corners |

## What Concept does in option A

- **Directions:** each of the three directions still gets `direction.md`, a palette with contrast checks, a type pairing, shape language and `style-tile.html`. These never needed a GPU.
- **Style frame:** an HTML/CSS mock page built from the style tile replaces the WEB4 mood image. That is arguably better, because the text is real and the tokens are lift-ready for Front-end.
- **Key art and texture:** generated with code instead of models:
  - SVG and CSS patterns, gradients, grain (SVG `feTurbulence`), geometric and typographic compositions;
  - hand-tuned blob or contour shapes;
  - duotone or colour-graded treatments of stock photos so a set looks consistent.
- **Photography:** curated from Unsplash and Pexels, with a licence log (URL, photographer, licence, date) next to each pick, replacing the generation sidecar.
- **Gate 2 label:** the contact sheet must say plainly that imagery is stock or code-made placeholder, and that bespoke key art is available via option B or C.

## Recommendation for Gate 1 question 7

Offer the human three choices:

1. **A only** (free): art-directed directions with stock and code-made art.
2. **A + B** (about US$1-3 per gate round, plus about half a day for me to add remote-server support): bespoke key art identical to the tuned setup. This is my recommendation when the site's identity depends on imagery.
3. **A + C** (pay per image via BFL's API): bespoke images without renting a machine, but no tuned workflows, and an adapter has to be built.

Option D should be mentioned only as "possible but not recommended".

## Sources (checked 2026-11-01; third-party unless noted)

- RunPod RTX 4090 rates: https://computeprices.com/providers/runpod/gpus/rtx4090, https://www.hivenet.com/post/runpod-pricing-complete-guide-to-gpu-cloud-costs, official https://www.runpod.io/gpu-cloud/pricing
- Comfy Cloud (official hosted ComfyUI; plans from $20/month, per-GPU-second credits; it is unclear whether our custom int8 model files can be loaded): https://comfy.org/pricing/
- FLUX 3 / Klein API prices: https://www.layer3labs.io/guides/flux-3-image-pricing, https://pricepertoken.com/flux-pricing, https://openrouter.ai/black-forest-labs/flux-3-image. Official prices: https://docs.bfl.ai
