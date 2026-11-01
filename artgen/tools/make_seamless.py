"""Make a texture tile truly seamless, as a post-process for WEB5 outputs with uneven lighting.

WEB5 repaints the wrap seam inside ComfyUI, which works for evenly lit surfaces. When the first pass has a strong
light gradient (leather, brushed metal, painted walls), the brightness jump is too big to bridge and a faint cross
shows when tiled. This tool fixes that in two steps:
  1. flatten: divide out the low-frequency lighting (a wrap-around blur), keeping the grain and the mean colour;
  2. cross-fade the tile with its half-offset copy, one axis at a time, using a weight that is 0 at the edges and 1 in
     the middle. The edges then come only from the offset copy, whose pixels are continuous across the wrap.

Run with the ComfyUI venv python (needs Pillow and numpy):
  <comfyui.python> artgen/tools/make_seamless.py in.png out.png [--flatten 96]
It copies in.json to out.json with a "post" block, so provenance is kept.
"""
import argparse
import json
import os

import numpy as np
from PIL import Image


def wrap_blur(a, radius):
    """Box-blur three times (about Gaussian), wrapping at the edges, per channel."""
    out = a.astype(np.float64)
    k = 2 * radius + 1
    for _ in range(3):
        for axis in (0, 1):
            n = out.shape[axis]
            pad = [(0, 0)] * out.ndim
            pad[axis] = (radius, radius)
            p = np.pad(out, pad, mode="wrap")
            zero_shape = list(p.shape)
            zero_shape[axis] = 1
            c = np.concatenate([np.zeros(zero_shape), np.cumsum(p, axis=axis)], axis=axis)
            out = (c.take(range(k, k + n), axis=axis) - c.take(range(0, n), axis=axis)) / k
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("dest")
    ap.add_argument("--flatten", type=int, default=96, help="blur radius for lighting removal (0 = off)")
    ap.add_argument("--crop", type=float, default=0.0,
                    help="trim this fraction from each edge first (removes a vignette), then scale back up")
    args = ap.parse_args()
    im = Image.open(args.src).convert("RGB")
    if args.crop:
        w0, h0 = im.size
        dx, dy = round(w0 * args.crop), round(h0 * args.crop)
        im = im.crop((dx, dy, w0 - dx, h0 - dy)).resize((w0, h0), Image.LANCZOS)
    a = np.asarray(im, dtype=np.float64)
    h, w, _ = a.shape
    if args.flatten:
        low = wrap_blur(a, args.flatten)
        a = np.clip(a / np.maximum(low, 1) * a.mean(axis=(0, 1)), 0, 255)
    # Two separable passes. Each copy's own seam sits where its weight is 0, so no seam survives.
    wx = (np.sin(np.linspace(0, np.pi, w)) ** 2)[None, :, None]
    a = a * wx + np.roll(a, w // 2, axis=1) * (1 - wx)
    wy = (np.sin(np.linspace(0, np.pi, h)) ** 2)[:, None, None]
    out = a * wy + np.roll(a, h // 2, axis=0) * (1 - wy)
    Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(args.dest)
    side = os.path.splitext(args.src)[0] + ".json"
    if os.path.exists(side):
        with open(side, encoding="utf-8") as f:
            rec = json.load(f)
        rec["post"] = {"tool": "artgen/tools/make_seamless.py", "flatten_radius": args.flatten, "crop": args.crop,
                       "method": "lighting flatten + half-offset cross-fade", "source": os.path.basename(args.src)}
        with open(os.path.splitext(args.dest)[0] + ".json", "w", encoding="utf-8") as f:
            json.dump(rec, f, indent=1)
    print("wrote", args.dest)


if __name__ == "__main__":
    main()
