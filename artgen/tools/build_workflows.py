"""Build the WEB workflows in both ComfyUI formats from one definition.

Writes:
  artgen/user/default/workflows/WEB*.json   UI format (open in ComfyUI, press W)
  artgen/api/WEB*.json                      API format (what generate.py POSTs)
  artgen/api/manifest.json                  which node/input generate.py patches per workflow

Needs a running ComfyUI (reads /object_info for socket types and widget order):
  F:\\ArtGen\\ComfyUI\\venv\\Scripts\\python.exe artgen\\tools\\build_workflows.py

Edit the workflow definitions below, not the generated JSON. If you change a workflow
in the UI and want to keep it, port the change back here and rebuild.
"""
import json
import os
import sys
import urllib.request
import uuid

HERE = os.path.dirname(os.path.abspath(__file__))
ARTGEN = os.path.dirname(HERE)
UI_DIR = os.path.join(ARTGEN, "user", "default", "workflows")
API_DIR = os.path.join(ARTGEN, "api")
SERVER = os.environ.get("COMFY_URL", "http://127.0.0.1:8188")

# Nodes that only exist in the UI: dropped from the API export.
UI_ONLY = {"MarkdownNote", "PreviewImage", "ImageCompare"}
WIDGET_TYPES = {"INT", "FLOAT", "STRING", "BOOLEAN", "COMBO", "COMFY_DYNAMICCOMBO_V3"}

KLEIN_FULL = "flux3_image_klein_int8_convrot.safetensors"
KLEIN_FAST = "flux3_image_klein_sd_int8_convrot.safetensors"
ZIMAGE = "z_image_turbo_int8_convrot.safetensors"
WEB_NEGATIVE = ("text, letters, words, typography, caption, watermark, logo, signature, "
                "user interface, frame, border, blurry, lowres, jpeg artifacts, oversaturated, "
                "plastic skin, extra fingers, deformed hands")
EXAMPLE_IMAGE = "web_example.png"


class Graph:
    def __init__(self, name):
        self.name = name
        self.nodes = []      # dicts: id, type, widgets, links{input: (src, slot)}, title, mode, col
        self.next_id = 1

    def add(self, type_, widgets=None, links=None, title=None, col=0, mode=0, size=None):
        node = {"id": self.next_id, "type": type_, "widgets": widgets or {}, "links": links or {},
                "title": title, "col": col, "mode": mode, "size": size}
        self.nodes.append(node)
        self.next_id += 1
        return node["id"]

    def note(self, text, col=0, height=300):
        return self.add("MarkdownNote", {"text": text}, col=col, size=[380, height])


def out(node_id, slot=0):
    return (node_id, slot)


# ---------------------------------------------------------------------------------------------
# Workflow definitions
# ---------------------------------------------------------------------------------------------

def klein_loaders(g, unet):
    m = g.add("UNETLoader", {"unet_name": unet, "weight_dtype": "default"}, col=0)
    c = g.add("CLIPLoader", {"clip_name": "qwen3vl_4b_int8_convrot.safetensors", "type": "flux3",
                             "device": "default"}, col=0)
    v = g.add("VAELoader", {"vae_name": "flux2-vae.safetensors"}, col=0)
    return m, c, v


def web1():
    g = Graph("WEB1 Klein - Hero and Key Art")
    g.note(
        "## WEB1 Klein: hero and key art (text to image)\n"
        "Full-quality FLUX 3 Klein for the images a page is built around: hero banners, section key art, "
        "feature illustrations. Write a **full scene caption**: subject, setting, light, palette, lens/camera, "
        "and where the **empty space for the headline** goes.\n\n"
        "- **Aspect (Resolution node):** 16:9 hero (default), 21:9 ultrawide banner, 3:2 section/feature image. "
        "2.0 MP default (~1920 px wide). 2x: WEB6b for shipped assets, WEB6 for boards.\n"
        "- **Model:** full model, 30 steps, CFG 3.5 (~40 s). 50 steps for finals. "
        "Drafts: switch to `flux3_image_klein_sd_int8_convrot`, steps 12, **CFG 1** (~12 s).\n"
        "- **Negative** only works when CFG > 1 (full model). It already bans text and logos.\n"
        "- **Photographic preset:** *Editorial photograph, shot on a 35 mm lens at f/2.8, soft natural window "
        "light, shallow depth of field, true-to-life colour, subtle film grain.*\n"
        "- **Illustrative preset:** *Flat vector-style editorial illustration, clean geometric shapes, "
        "limited palette of [3-4 colours], soft paper grain, no outlines, generous empty background.*\n"
        "- Always end with *no text, no letters, no logos*. Real copy is set in HTML.",
        height=430)
    m, c, v = klein_loaders(g, KLEIN_FULL)
    r = g.add("ResolutionSelector", {"aspect_ratio": "16:9 (Widescreen)", "megapixels": 2.0, "multiple": 16}, col=1)
    p = g.add("CLIPTextEncode", {
        "text": "Wide editorial photograph. A calm, sunlit studio workspace: a pale oak desk "
                "on the right third of the frame with a ceramic mug, a small potted olive tree and an open "
                "notebook, morning light streaming through a tall window, long soft shadows across a warm off-white "
                "plaster wall. The left half of the frame is clean, softly lit empty wall with plenty of negative "
                "space for a headline. Muted palette of cream, sand, sage green and soft charcoal. Shot on a 35 mm "
                "lens at f/2.8, shallow depth of field, true-to-life colour, subtle film grain. No text, no letters, "
                "no logos."}, links={"clip": out(c)}, title="Prompt", col=1, size=[380, 300])
    n = g.add("CLIPTextEncode", {"text": WEB_NEGATIVE}, links={"clip": out(c)},
              title="Negative (used when CFG > 1)", col=1, size=[380, 140])
    lat = g.add("EmptyFlux2LatentImage", {"width": 1024, "height": 1024, "batch_size": 1},
                links={"width": out(r, 0), "height": out(r, 1)}, col=2)
    k = g.add("KSampler", {"seed": 0, "steps": 30, "cfg": 3.5, "sampler_name": "euler", "scheduler": "simple",
                           "denoise": 1.0},
              links={"model": out(m), "positive": out(p), "negative": out(n), "latent_image": out(lat)}, col=2)
    d = g.add("VAEDecode", links={"samples": out(k), "vae": out(v)}, col=3)
    s = g.add("SaveImage", {"filename_prefix": "web/web1_hero"}, links={"images": out(d)}, col=3, size=[560, 520])
    manifest = {"kind": "txt2img", "family": "klein", "prompt": [p, "text"], "negative": [n, "text"],
                "model": [m, "unet_name"], "sampler": k, "resolution": r, "latent": lat, "save": s}
    return g, manifest


def web2():
    g = Graph("WEB2 Klein - Style Match and Edit")
    g.note(
        "## WEB2 Klein: style match and edit (images in)\n"
        "Edit a pick with words, or make a new image that matches a direction's look from reference images.\n\n"
        "- **Image 1** is `<ref_image_0>`: the image to edit. The output keeps its aspect (1.5 MP).\n"
        "- Images 2-3 are muted. Select one, **Ctrl+M** to unmute. Refer to them as `<ref_image_1>`, "
        "`<ref_image_2>`. More refs: drag new Load Image nodes into the empty `images` slots (up to 10).\n"
        "- **Edit:** *Keep the composition, subject and camera of <ref_image_0>. Change ... Keep everything else.*\n"
        "- **Style match:** *A [new subject] in exactly the palette, lighting, grain and rendering style of "
        "<ref_image_0> and <ref_image_1>.* Use the direction's hero as ref 0 so a set stays consistent.\n"
        "- **Make room for copy:** *Extend the empty background on the left third of <ref_image_0> so it is "
        "clean and uncluttered.*\n"
        "- Distilled model, 16 steps, CFG 1 (~35 s). Compare slider shows before / after.",
        height=400)
    m, c, v = klein_loaders(g, KLEIN_FAST)
    i0 = g.add("LoadImage", {"image": EXAMPLE_IMAGE}, title="Image 1 = <ref_image_0>", col=0, size=[380, 380])
    i1 = g.add("LoadImage", {"image": EXAMPLE_IMAGE}, title="Image 2 = <ref_image_1> (Ctrl+M to use)",
               col=1, mode=2, size=[380, 380])
    i2 = g.add("LoadImage", {"image": EXAMPLE_IMAGE}, title="Image 3 = <ref_image_2> (Ctrl+M to use)",
               col=1, mode=2, size=[380, 380])
    p = g.add("CLIPTextEncode", {
        "text": "Keep the composition, subject and camera of <ref_image_0>. Relight it as soft early-morning light "
                "with a warm peach, cream and sage palette, gentle haze, and clear the left third of the frame "
                "into calm, out-of-focus background with room for a headline. Keep everything else the same. "
                "No text, no letters, no logos."}, links={"clip": out(c)}, title="Prompt", col=2, size=[380, 260])
    z = g.add("ConditioningZeroOut", links={"conditioning": out(p)}, col=2)
    ref = g.add("ReferenceMultiLatent", {"resolution": ["resize", {"megapixels": 1.5}]},
                links={"positive": out(p), "negative": out(z), "vae": out(v),
                       "images.image0": out(i0), "images.image1": out(i1), "images.image2": out(i2),
                       "images.image3": None}, col=2)
    k = g.add("KSampler", {"seed": 0, "steps": 16, "cfg": 1.0, "sampler_name": "euler", "scheduler": "simple",
                           "denoise": 1.0},
              links={"model": out(m), "positive": out(ref, 0), "negative": out(ref, 1),
                     "latent_image": out(ref, 2)}, col=3)
    d = g.add("VAEDecode", links={"samples": out(k), "vae": out(v)}, col=3)
    g.add("ImageCompare", links={"image_a": out(i0), "image_b": out(d)}, col=4, size=[560, 520])
    s = g.add("SaveImage", {"filename_prefix": "web/web2_edit"}, links={"images": out(d)}, col=4, size=[560, 520])
    manifest = {"kind": "edit", "family": "klein", "prompt": [p, "text"], "negative": None,
                "model": [m, "unet_name"], "sampler": k, "image": i0, "refs": ref, "vae": v, "save": s,
                "ref_megapixels": [ref, "resolution.megapixels"]}
    return g, manifest


def web3():
    g = Graph("WEB3 Z-Image - Fast Exploration")
    g.note(
        "## WEB3 Z-Image: fast exploration (text to image)\n"
        "Z-Image Turbo for quick drafts: moodboards, testing a direction, trying ten compositions before "
        "committing Klein time. Apache 2.0.\n\n"
        "- 8 steps, CFG 1, ~6 s at 1 MP once loaded. Natural-language prompts work best.\n"
        "- 1.0 MP default; clean up to about 2 MP. Any aspect on the Resolution node.\n"
        "- No negative prompt (CFG 1). Say what you want instead: *plain empty background*, *no text*.\n"
        "- Picks that make the cut get re-rendered in WEB1 (same prompt) or matched with WEB2.\n"
        "- Batch work per model: switching to Klein reloads ~10 GB.",
        height=280)
    m = g.add("UNETLoader", {"unet_name": ZIMAGE, "weight_dtype": "default"}, col=0)
    c = g.add("CLIPLoader", {"clip_name": "qwen_3_4b_fp8_mixed.safetensors", "type": "lumina2",
                             "device": "default"}, col=0)
    v = g.add("VAELoader", {"vae_name": "ae.safetensors"}, col=0)
    ms = g.add("ModelSamplingAuraFlow", {"shift": 3.0, "sampling": "flow"}, links={"model": out(m)}, col=1)
    r = g.add("ResolutionSelector", {"aspect_ratio": "16:9 (Widescreen)", "megapixels": 1.0, "multiple": 16}, col=1)
    p = g.add("CLIPTextEncode", {
        "text": "Wide landscape photograph. A quiet coastal landscape at blue hour: smooth grey rocks in "
                "the foreground, a calm sea, soft pink and lavender sky with a low band of mist. Minimal "
                "composition, the upper half is open sky with lots of empty space. Muted pastel palette, soft "
                "diffuse light, fine photographic grain. No text, no people."},
        links={"clip": out(c)}, title="Prompt", col=1, size=[380, 260])
    z = g.add("ConditioningZeroOut", links={"conditioning": out(p)}, col=2)
    lat = g.add("EmptySD3LatentImage", {"width": 1024, "height": 1024, "batch_size": 1},
                links={"width": out(r, 0), "height": out(r, 1)}, col=2)
    k = g.add("KSampler", {"seed": 0, "steps": 8, "cfg": 1.0, "sampler_name": "res_multistep",
                           "scheduler": "simple", "denoise": 1.0},
              links={"model": out(ms), "positive": out(p), "negative": out(z), "latent_image": out(lat)}, col=2)
    d = g.add("VAEDecode", links={"samples": out(k), "vae": out(v)}, col=3)
    s = g.add("SaveImage", {"filename_prefix": "web/web3_draft"}, links={"images": out(d)}, col=3, size=[560, 520])
    manifest = {"kind": "txt2img", "family": "zimage", "prompt": [p, "text"], "negative": None,
                "model": [m, "unet_name"], "sampler": k, "resolution": r, "latent": lat, "save": s}
    return g, manifest


def web4():
    g = Graph("WEB4 Klein - Style Frame")
    g.note(
        "## WEB4 Klein: style frame (full-page mood mockup)\n"
        "A picture of what a finished page *feels* like: colour, type weight, imagery, density, shape language. "
        "It is a **mood image, not a layout**: Front-end builds the real page. Label it that way on boards.\n\n"
        "- **Portrait** 9:16 or 2:3 = a long scrolling page (default 9:16, 1.5 MP). "
        "**Landscape** 16:9 or 3:2 = a desktop viewport above the fold.\n"
        "- Describe the page top to bottom: nav bar, hero (with its image), sections, cards, footer. Name the "
        "palette with hex-like words, corner radius, borders, shadow, spacing.\n"
        "- Klein will invent fake lettering. Ask for *text shown only as soft grey placeholder lines*, "
        "and never use a style frame where readable text matters.\n"
        "- To build the frame around a direction's real hero art, use WEB2 with the hero as `<ref_image_0>`.\n"
        "- Full model, 30 steps, CFG 3.5 (~35 s).",
        height=400)
    m, c, v = klein_loaders(g, KLEIN_FULL)
    r = g.add("ResolutionSelector", {"aspect_ratio": "9:16 (Portrait Widescreen)", "megapixels": 1.5,
                                     "multiple": 16}, col=1)
    p = g.add("CLIPTextEncode", {
        "text": "A flat, straight-on screenshot of a complete modern website home page, shown full length as one "
                "tall scrolling page on a plain light grey background, like a polished design portfolio shot. "
                "From top to bottom: a slim navigation bar, a large hero section with a sunlit editorial photograph "
                "of a calm studio workspace and a bold headline area, a row of three rounded cards with soft "
                "shadows and small illustrations, a wide image band, a testimonial section, and a dark charcoal "
                "footer. Warm off-white background, sage green and terracotta accents, generous white space, 12 px "
                "rounded corners, thin hairline borders, clean geometric sans-serif type hierarchy. All text is "
                "shown only as soft grey placeholder lines, no readable words, no logos."},
        links={"clip": out(c)}, title="Prompt", col=1, size=[380, 320])
    n = g.add("CLIPTextEncode", {
        "text": "readable text, letters, words, gibberish lettering, watermark, logo, device frame, laptop, phone, "
                "hands, perspective, tilted, blurry, lowres, cluttered"},
        links={"clip": out(c)}, title="Negative (used when CFG > 1)", col=1, size=[380, 140])
    lat = g.add("EmptyFlux2LatentImage", {"width": 1024, "height": 1024, "batch_size": 1},
                links={"width": out(r, 0), "height": out(r, 1)}, col=2)
    k = g.add("KSampler", {"seed": 0, "steps": 30, "cfg": 3.5, "sampler_name": "euler", "scheduler": "simple",
                           "denoise": 1.0},
              links={"model": out(m), "positive": out(p), "negative": out(n), "latent_image": out(lat)}, col=2)
    d = g.add("VAEDecode", links={"samples": out(k), "vae": out(v)}, col=3)
    s = g.add("SaveImage", {"filename_prefix": "web/web4_styleframe"}, links={"images": out(d)}, col=3,
              size=[560, 720])
    manifest = {"kind": "txt2img", "family": "klein", "prompt": [p, "text"], "negative": [n, "text"],
                "model": [m, "unet_name"], "sampler": k, "resolution": r, "latent": lat, "save": s}
    return g, manifest


def web5():
    g = Graph("WEB5 Texture and Pattern")
    g.note(
        "## WEB5 Texture and pattern (seamless tile)\n"
        "Backgrounds, paper and fabric grain, surface textures, repeating patterns. Two passes, one model:\n"
        "1. Klein draws a flat texture (1024 px square).\n"
        "2. The tile is wrapped by half so its edges meet in the middle, then Klein repaints that seam cross "
        "(feathered mask, denoise 0.75). The outer edges now tile **seamlessly**.\n\n"
        "- Check the **2x2 tiling preview**. If a cross still shows, raise *Seam fix* denoise to 0.85.\n"
        "- Prompt for *flat, evenly lit, top-down, no vignette, no focal object*. Strong light gradients or "
        "one big motif will not tile well.\n"
        "- Use the tile as a CSS `background-repeat` image. Keep it subtle behind text and re-check contrast.\n"
        "- Size is fixed at 1024 here (crops and masks depend on it). `generate.py --size` rescales all of them. "
        "Upscale with WEB6 for 2048 tiles (upscaling keeps it seamless).\n"
        "- Distilled model, 12 steps each pass, CFG 1 (~25 s).",
        height=420)
    m, c, v = klein_loaders(g, KLEIN_FAST)
    p = g.add("CLIPTextEncode", {
        "text": "Seamless tileable texture, flat top-down scan of handmade cotton rag paper in warm off-white, "
                "subtle fibres and soft deckled grain, very low contrast, perfectly even diffuse lighting, no "
                "vignette, no shadows, no focal point, uniform detail across the whole surface. No text."},
        links={"clip": out(c)}, title="Prompt", col=1, size=[380, 240])
    z = g.add("ConditioningZeroOut", links={"conditioning": out(p)}, col=1)
    lat = g.add("EmptyFlux2LatentImage", {"width": 1024, "height": 1024, "batch_size": 1}, col=1)
    k1 = g.add("KSampler", {"seed": 0, "steps": 12, "cfg": 1.0, "sampler_name": "euler", "scheduler": "simple",
                            "denoise": 1.0},
               links={"model": out(m), "positive": out(p), "negative": out(z), "latent_image": out(lat)},
               title="Pass 1: texture", col=1)
    d1 = g.add("VAEDecode", links={"samples": out(k1), "vae": out(v)}, col=2)
    # Wrap by half: swap left/right halves, then top/bottom halves.
    cl = g.add("ImageCrop", {"width": 512, "height": 1024, "x": 0, "y": 0}, links={"image": out(d1)},
               title="Left half", col=2)
    cr = g.add("ImageCrop", {"width": 512, "height": 1024, "x": 512, "y": 0}, links={"image": out(d1)},
               title="Right half", col=2)
    sh = g.add("ImageStitch", {"direction": "right", "match_image_size": False, "spacing_width": 0,
                               "spacing_color": "white"}, links={"image1": out(cr), "image2": out(cl)},
               title="Wrap horizontally", col=2)
    ct = g.add("ImageCrop", {"width": 1024, "height": 512, "x": 0, "y": 0}, links={"image": out(sh)},
               title="Top half", col=3)
    cb = g.add("ImageCrop", {"width": 1024, "height": 512, "x": 0, "y": 512}, links={"image": out(sh)},
               title="Bottom half", col=3)
    sv = g.add("ImageStitch", {"direction": "down", "match_image_size": False, "spacing_width": 0,
                               "spacing_color": "white"}, links={"image1": out(cb), "image2": out(ct)},
               title="Wrap vertically (seams now cross the centre)", col=3)
    # Seam mask: feathered vertical + horizontal band through the centre.
    base = g.add("SolidMask", {"value": 0.0, "width": 1024, "height": 1024}, title="Mask canvas", col=4)
    vb = g.add("SolidMask", {"value": 1.0, "width": 192, "height": 1024}, title="Vertical seam band", col=4)
    vbf = g.add("FeatherMask", {"left": 72, "top": 0, "right": 72, "bottom": 0}, links={"mask": out(vb)}, col=4)
    hb = g.add("SolidMask", {"value": 1.0, "width": 1024, "height": 192}, title="Horizontal seam band", col=4)
    hbf = g.add("FeatherMask", {"left": 0, "top": 72, "right": 0, "bottom": 72}, links={"mask": out(hb)}, col=4)
    m1 = g.add("MaskComposite", {"x": 416, "y": 0, "operation": "add"},
               links={"destination": out(base), "source": out(vbf)}, col=5)
    m2 = g.add("MaskComposite", {"x": 0, "y": 416, "operation": "add"},
               links={"destination": out(m1), "source": out(hbf)}, title="Seam mask", col=5)
    enc = g.add("VAEEncode", links={"pixels": out(sv), "vae": out(v)}, col=5)
    nm = g.add("SetLatentNoiseMask", links={"samples": out(enc), "mask": out(m2)}, col=5)
    dd = g.add("DifferentialDiffusion", {"strength": 1.0}, links={"model": out(m)}, col=5)
    k2 = g.add("KSampler", {"seed": 0, "steps": 12, "cfg": 1.0, "sampler_name": "euler", "scheduler": "simple",
                            "denoise": 0.75},
               links={"model": out(dd), "positive": out(p), "negative": out(z), "latent_image": out(nm)},
               title="Pass 2: seam fix", col=6)
    d2 = g.add("VAEDecode", links={"samples": out(k2), "vae": out(v)}, col=6)
    t1 = g.add("ImageStitch", {"direction": "right", "match_image_size": False, "spacing_width": 0,
                               "spacing_color": "white"}, links={"image1": out(d2), "image2": out(d2)}, col=6)
    t2 = g.add("ImageStitch", {"direction": "down", "match_image_size": False, "spacing_width": 0,
                               "spacing_color": "white"}, links={"image1": out(t1), "image2": out(t1)}, col=6)
    g.add("PreviewImage", links={"images": out(t2)}, title="2x2 tiling preview", col=7, size=[560, 560])
    s = g.add("SaveImage", {"filename_prefix": "web/web5_texture"}, links={"images": out(d2)}, col=7,
              size=[560, 560])
    manifest = {
        "kind": "texture", "family": "klein", "prompt": [p, "text"], "negative": None,
        "model": [m, "unet_name"], "sampler": k1, "samplers": [k1, k2], "seam_denoise": [k2, "denoise"],
        "save": s,
        # generate.py --size WxH patches every size-dependent input (w, h = tile size; b = seam band 3/16 of side).
        "size_bindings": [
            [lat, "width", "w"], [lat, "height", "h"],
            [cl, "width", "w//2"], [cl, "height", "h"],
            [cr, "width", "w - w//2"], [cr, "height", "h"], [cr, "x", "w//2"],
            [ct, "width", "w"], [ct, "height", "h//2"],
            [cb, "width", "w"], [cb, "height", "h - h//2"], [cb, "y", "h//2"],
            [base, "width", "w"], [base, "height", "h"],
            [vb, "width", "bw"], [vb, "height", "h"], [hb, "width", "w"], [hb, "height", "bh"],
            [vbf, "left", "bw*3//8"], [vbf, "right", "bw*3//8"], [hbf, "top", "bh*3//8"], [hbf, "bottom", "bh*3//8"],
            [m1, "x", "(w - bw)//2"], [m2, "y", "(h - bh)//2"],
        ],
    }
    return g, manifest


def upscale(name, model, prefix, note):
    g = Graph(name)
    g.note(note, height=280)
    i = g.add("LoadImage", {"image": EXAMPLE_IMAGE}, col=0, size=[380, 380])
    u = g.add("UpscaleModelLoader", {"model_name": model}, col=1)
    up = g.add("ImageUpscaleWithModel", links={"upscale_model": out(u), "image": out(i)}, col=1)
    sc = g.add("ImageScaleBy", {"upscale_method": "lanczos", "scale_by": 0.5}, links={"image": out(up)}, col=1)
    s = g.add("SaveImage", {"filename_prefix": prefix}, links={"images": out(sc)}, col=2, size=[560, 520])
    manifest = {"kind": "upscale", "family": "upscale", "prompt": None, "negative": None,
                "image": i, "upscale_model": [u, "model_name"], "scale": [sc, "scale_by"], "save": s}
    return g, manifest


def web6():
    return upscale(
        "WEB6 Upscale 2x", "4x-UltraSharp.safetensors", "web/web6_upscaled",
        "## WEB6 Upscale 2x (boards only)\n"
        "4x-UltraSharp, then halved back to 2x so it stays sharp without over-sharpening. "
        "Set the scale to 1.0 for a full 4x. ~13 s at 2 MP in.\n\n"
        "- **Licence: CC BY-NC-SA 4.0, non-commercial.** Use it for moodboards, gate packets and reviews only. "
        "Anything that ships on the site goes through **WEB6b** (`generate.py` enforces this for `web/`).\n"
        "- Textures from WEB5 stay seamless when upscaled.")


def web6b():
    return upscale(
        "WEB6b Upscale 2x (commercial)", "RealESRGAN_x4plus.pth", "web/web6b_upscaled",
        "## WEB6b Upscale 2x (commercial, for shipped assets)\n"
        "RealESRGAN_x4plus, then halved back to 2x. Set the scale to 1.0 for a full 4x. ~13 s at 2 MP in.\n\n"
        "- **Licence: BSD-3-Clause**, commercial use OK. This is the upscaler for everything in "
        "`web/public/assets/generated/`.\n"
        "- The model lives in `artgen/models/upscale_models/` (project-only, via `extra_model_paths.yaml`). "
        "If the loader shows it missing, start ComfyUI with this project's launcher.\n"
        "- Hero at 2 MP (1936 px) becomes ~3870 px: enough for 1920 px at 2x DPR.\n"
        "- Textures from WEB5 stay seamless when upscaled.")


WORKFLOWS = [web1, web2, web3, web4, web5, web6, web6b]


# ---------------------------------------------------------------------------------------------
# Export
# ---------------------------------------------------------------------------------------------

def fetch_object_info():
    with urllib.request.urlopen(SERVER + "/object_info", timeout=60) as r:
        return json.load(r)


def iter_inputs(info):
    for section in ("required", "optional"):
        for name, spec in info["input"].get(section, {}).items():
            yield name, spec


def input_kind(spec):
    t = spec[0]
    opts = spec[1] if len(spec) > 1 and isinstance(spec[1], dict) else {}
    if opts.get("socketless"):
        return "skip"
    if isinstance(t, list) or t in WIDGET_TYPES:
        return "widget"
    if t == "COMFY_AUTOGROW_V3":
        return "autogrow"
    return "socket"


def widget_values(node, info):
    """UI widgets_values in the order the frontend creates widgets."""
    vals = []
    for name, spec in iter_inputs(info):
        if input_kind(spec) != "widget":
            continue
        opts = spec[1] if len(spec) > 1 and isinstance(spec[1], dict) else {}
        if spec[0] == "COMFY_DYNAMICCOMBO_V3":
            key, sub = node["widgets"][name]
            vals.append(key)
            option = next(o for o in opts["options"] if o["key"] == key)
            for sec in ("required", "optional"):
                for sname in option["inputs"].get(sec, {}):
                    vals.append(sub[sname])
            continue
        if name in node["widgets"]:
            vals.append(node["widgets"][name])
        else:
            default = opts.get("default")
            if default is None and isinstance(spec[0], list):
                default = spec[0][0]
            vals.append(default)
        if opts.get("control_after_generate"):
            vals.append("randomize")
        if opts.get("image_upload"):
            vals.append("image")
    return vals


def socket_type(info, name):
    for n, spec in iter_inputs(info):
        if n == name:
            return spec[0] if not isinstance(spec[0], list) else "COMBO"
        if input_kind(spec) == "autogrow" and name.startswith(n + "."):
            tmpl = spec[1]["template"]["input"]
            for sec in tmpl.values():
                for s in sec.values():
                    return s[0]
    raise KeyError(f"{info['name']} has no input {name}")


def ui_inputs(node, info):
    """Ordered UI input slots: sockets (and autogrow slots) in schema order, then linked widgets."""
    slots = []
    for name, spec in iter_inputs(info):
        kind = input_kind(spec)
        if kind == "socket":
            slots.append({"name": name, "type": spec[0]})
        elif kind == "autogrow":
            for key in node["links"]:
                if key.startswith(name + "."):
                    slots.append({"name": key, "type": socket_type(info, key)})
    for key in node["links"]:
        if not any(s["name"] == key for s in slots):
            t = socket_type(info, key)
            slots.append({"name": key, "type": t, "widget": {"name": key}})
    return slots


def topo_order(g):
    deps = {n["id"]: {src[0] for src in n["links"].values() if src} for n in g.nodes}
    order, done = [], set()
    while len(order) < len(g.nodes):
        for n in g.nodes:
            if n["id"] not in done and deps[n["id"]] <= done:
                order.append(n["id"])
                done.add(n["id"])
    return {nid: i for i, nid in enumerate(order)}


def estimate_height(node, info):
    if node["size"]:
        return node["size"][1]
    if info is None:
        return 120
    widgets = len(widget_values(node, info))
    sockets = sum(1 for s in ui_inputs(node, info) if "widget" not in s)
    outs = len(info["output"])
    return 46 + 26 * max(sockets, outs) + 28 * widgets


def to_ui(g, oi):
    order = topo_order(g)
    links, link_id = [], 0
    by_id = {n["id"]: n for n in g.nodes}
    ui_nodes = {}
    col_y = {}
    for n in g.nodes:
        info = oi.get(n["type"])
        col = n["col"]
        y = col_y.get(col, 40)
        h = estimate_height(n, info)
        col_y[col] = y + h + 50
        width = n["size"][0] if n["size"] else 380
        x = 40 + sum(430 if c < col else 0 for c in range(col))
        if n["type"] == "MarkdownNote":
            ui = {"inputs": [], "outputs": [], "properties": {}, "widgets_values": [n["widgets"]["text"]]}
        else:
            ui = {"inputs": [dict(s, link=None) for s in ui_inputs(n, info)],
                  "outputs": [{"name": nm, "type": t, "links": []}
                              for nm, t in zip(info["output_name"], info["output"])],
                  "properties": {"Node name for S&R": n["type"]},
                  "widgets_values": widget_values(n, info)}
            for s in ui["inputs"]:
                if s["name"].split(".")[0] in info["input"].get("optional", {}):
                    s["shape"] = 7  # hollow dot = optional input
        node = {"id": n["id"], "type": n["type"], "pos": [x, y], "size": [width, h], "flags": {},
                "order": order[n["id"]], "mode": n["mode"]}
        node.update(ui)
        if n["title"]:
            node["title"] = n["title"]
        ui_nodes[n["id"]] = node
    for n in g.nodes:
        for slot_i, s in enumerate(ui_nodes[n["id"]]["inputs"]):
            src = n["links"].get(s["name"])
            if not src:
                continue
            link_id += 1
            src_node, src_slot = src
            t = ui_nodes[src_node]["outputs"][src_slot]["type"]
            links.append([link_id, src_node, src_slot, n["id"], slot_i, t])
            s["link"] = link_id
            ui_nodes[src_node]["outputs"][src_slot]["links"].append(link_id)
    return {
        "id": str(uuid.uuid5(uuid.NAMESPACE_URL, "artgen/" + g.name)),
        "revision": 0,
        "last_node_id": max(by_id),
        "last_link_id": link_id,
        "nodes": [ui_nodes[n["id"]] for n in g.nodes],
        "links": links,
        "groups": [],
        "config": {},
        "extra": {"ds": {"scale": 0.75, "offset": [0, 0]}},
        "version": 0.4,
    }


def to_api(g, oi):
    live = {n["id"] for n in g.nodes if n["type"] not in UI_ONLY and n["mode"] == 0}
    api = {}
    for n in g.nodes:
        if n["id"] not in live:
            continue
        info = oi[n["type"]]
        inputs = {}
        for name, spec in iter_inputs(info):
            if input_kind(spec) != "widget" or name in n["links"]:
                continue
            opts = spec[1] if len(spec) > 1 and isinstance(spec[1], dict) else {}
            if spec[0] == "COMFY_DYNAMICCOMBO_V3":
                key, sub = n["widgets"][name]
                inputs[name] = key
                for sname, sval in sub.items():
                    inputs[f"{name}.{sname}"] = sval
            elif name in n["widgets"]:
                inputs[name] = n["widgets"][name]
            elif "default" in opts:
                inputs[name] = opts["default"]
        for name, src in n["links"].items():
            if src and src[0] in live:
                inputs[name] = [str(src[0]), src[1]]
        api[str(n["id"])] = {"class_type": n["type"], "inputs": inputs,
                             "_meta": {"title": n["title"] or info.get("display_name", n["type"])}}
    return api


def main():
    oi = fetch_object_info()
    oi["MarkdownNote"] = None
    os.makedirs(UI_DIR, exist_ok=True)
    os.makedirs(API_DIR, exist_ok=True)
    manifest = {}
    for build in WORKFLOWS:
        g, m = build()
        missing = sorted({n["type"] for n in g.nodes if n["type"] not in oi})
        if missing:
            sys.exit(f"{g.name}: server is missing nodes {missing}")
        for n in g.nodes:
            if oi[n["type"]]:
                oi[n["type"]]["name"] = n["type"]
        fname = g.name + ".json"
        with open(os.path.join(UI_DIR, fname), "w", encoding="utf-8") as f:
            json.dump(to_ui(g, oi), f, indent=1)
        with open(os.path.join(API_DIR, fname), "w", encoding="utf-8") as f:
            json.dump(to_api(g, oi), f, indent=1)
        key = g.name.split(" ")[0]
        manifest[key] = dict(m, name=g.name, file=fname)
        print(f"built {g.name}")
    # Node ids in the manifest are ints in the builder; the API graph keys are strings.
    with open(os.path.join(API_DIR, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=1)


if __name__ == "__main__":
    main()
