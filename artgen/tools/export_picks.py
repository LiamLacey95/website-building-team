"""Export picked images from artgen/output/ with their provenance, for boards or production.

Run with the ComfyUI venv python (needs Pillow):
  <comfyui.python> artgen/tools/export_picks.py picks.json

picks.json:
  {"dest": "projects/<slug>/concepts/a-name/images", "max_width": 1600, "quality": 82, "title": "Direction A images",
   "picks": [{"src": "artgen/output/.../a_hero_00001_.png", "name": "a-hero", "role": "Key art", "alt": "…"}]}

For each pick it writes <dest>/<name>.webp and <dest>/<name>.json. The JSON is the generation sidecar plus an "export"
block (source file, size, format) and the alt text. It then writes <dest>/README.md, a table of every pick with its
workflow, seed and alt text. Paths are relative to the repo root.
"""
import json
import os
import sys

from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def rel(p):
    return os.path.relpath(p, REPO).replace("\\", "/")


def main():
    spec_path = sys.argv[1]
    with open(spec_path, encoding="utf-8") as f:
        spec = json.load(f)
    dest = os.path.join(REPO, spec["dest"])
    os.makedirs(dest, exist_ok=True)
    max_w, quality = spec.get("max_width", 1600), spec.get("quality", 82)
    rows = []
    for p in spec["picks"]:
        src = os.path.join(REPO, p["src"])
        side_src = os.path.splitext(src)[0] + ".json"
        with open(side_src, encoding="utf-8") as f:
            side = json.load(f)
        im = Image.open(src).convert("RGB")
        if im.width > max_w:
            im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
        out = os.path.join(dest, p["name"] + ".webp")
        im.save(out, "WEBP", quality=quality, method=6)
        side["export"] = {"source": rel(src), "file": os.path.basename(out), "size": [im.width, im.height],
                          "format": f"webp q{quality}", "role": p.get("role", "")}
        side["alt"] = p.get("alt", "")
        with open(os.path.join(dest, p["name"] + ".json"), "w", encoding="utf-8") as f:
            json.dump(side, f, indent=1)
        rows.append((p, side, os.path.getsize(out)))
        print(f"{p['name']}.webp {im.width}x{im.height} {os.path.getsize(out) // 1024} KB")
    lines = [f"# {spec.get('title', 'Images')}", "",
             "Exported by `artgen/tools/export_picks.py`. Each `.webp` has a `.json` sidecar beside it with the full generation record "
             "(workflow, prompt, negative, seed, model, steps, CFG, size and the exact API graph). The record can be replayed "
             "with `python artgen/generate.py --replay <name>.json`. Mood images: none of these contain real text; "
             "any lettering on a page is set in HTML.", "",
             "| File | Role | Workflow | Model | Seed | Size | Alt text |", "|---|---|---|---|---|---|---|"]
    for p, side, size in rows:
        wf = side.get("workflow", "").split(" ")[0]
        model = (side.get("model") or side.get("upscale_model") or "").replace(".safetensors", "")
        lines.append(f"| `{p['name']}.webp` | {p.get('role', '')} | {wf} | {model} | {side.get('seed', '')} | "
                     f"{side['export']['size'][0]}x{side['export']['size'][1]} | {p.get('alt', '')} |")
    lines += ["", "Licence: FLUX 3 Klein outputs (FLUX Kommunity licence; allowed for this project under the Gate 1 answer, "
              "revenue under US$5M). Upscales, if any, use RealESRGAN (BSD-3).", ""]
    with open(os.path.join(dest, "README.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(lines))


if __name__ == "__main__":
    main()
