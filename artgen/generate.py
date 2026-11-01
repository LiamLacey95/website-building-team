"""Headless image generation for the website team, through the ComfyUI HTTP API.

Stdlib only. Run with any Python 3.9+, e.g. the ComfyUI venv:
  F:\\ArtGen\\ComfyUI\\venv\\Scripts\\python.exe artgen\\generate.py WEB1 --prompt "..." --size 16:9

Examples:
  generate.py --list
  generate.py WEB3 --prompt "..." --count 8 --out design/concepts/a-calm/explore
  generate.py WEB1 --prompt "..." --size 21:9 --mp 2 --seed 42
  generate.py WEB1 --prompt "..." --size 1920x816 --model fast          (exact size, distilled drafts)
  generate.py WEB2 --image pick.png --ref hero.png --prompt "... <ref_image_1> ..."
  generate.py WEB5 --prompt "Seamless tileable ..." --size 768x768
  generate.py WEB6 --image artgen/output/web1/web1_00001_.png
  generate.py --jobs batch.json                         (list of job objects, same keys as the flags)
  generate.py --stop                                    (stop a headless server)

If ComfyUI is not running it is started headless (output to artgen/output, log in
artgen/user/comfyui_headless.log) and stopped again when the run ends, unless --keep-server.
Every image gets a provenance sidecar <image>.json with everything needed to regenerate it.
"""
import argparse
import copy
import datetime as dt
import hashlib
import json
import os
import random
import shutil
import struct
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import uuid

ARTGEN = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(ARTGEN)
COMFY = r"F:\ArtGen\ComfyUI"
COMFY_PY = os.path.join(COMFY, "venv", "Scripts", "python.exe")
API_DIR = os.path.join(ARTGEN, "api")
USER_DIR = os.path.join(ARTGEN, "user")
INPUT_DIR = os.path.join(ARTGEN, "input")
OUTPUT_DIR = os.path.join(ARTGEN, "output")
LOG_FILE = os.path.join(USER_DIR, "comfyui_headless.log")
PID_FILE = os.path.join(USER_DIR, "comfyui_headless.pid")
SERVER = os.environ.get("COMFY_URL", "http://127.0.0.1:8188")

MODELS = {
    "full": "flux3_image_klein_int8_convrot.safetensors",
    "fast": "flux3_image_klein_sd_int8_convrot.safetensors",
    "distilled": "flux3_image_klein_sd_int8_convrot.safetensors",
}
# Tuned steps/CFG per model (from the Safeguard workflows). Applied when --model changes the model
# and --steps/--cfg are not given.
MODEL_DEFAULTS = {
    "flux3_image_klein_int8_convrot.safetensors": {"steps": 30, "cfg": 3.5},
    "flux3_image_klein_sd_int8_convrot.safetensors": {"steps": 12, "cfg": 1.0},
}
LICENCES = {
    "klein": "FLUX Kommunity licence: free commercial use under US$5M annual revenue",
    "zimage": "Apache 2.0",
    "4x-UltraSharp.safetensors": "CC BY-NC-SA 4.0 (non-commercial: boards only, not shipped assets)",
}
JOB_KEYS = ["workflow", "prompt", "negative", "size", "mp", "seed", "count", "out", "name", "steps", "cfg",
            "model", "image", "refs", "scale", "upscale_model", "seam_denoise", "ref_mp"]


# ---------------------------------------------------------------------------------------------
# HTTP
# ---------------------------------------------------------------------------------------------

def http(method, path, body=None, timeout=30):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(SERVER + path, data=data, method=method,
                                 headers={"Content-Type": "application/json"} if data else {})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        raw = r.read()
    return json.loads(raw) if raw and raw[:1] in b"{[" else raw


def server_stats():
    try:
        return http("GET", "/system_stats", timeout=3)
    except (urllib.error.URLError, ConnectionError, TimeoutError, OSError):
        return None


def norm(p):
    return os.path.normcase(os.path.abspath(p))


def server_is_ours(stats):
    argv = stats.get("system", {}).get("argv", [])
    for i, a in enumerate(argv):
        if a == "--output-directory" and i + 1 < len(argv):
            return norm(argv[i + 1]) == norm(OUTPUT_DIR)
    return False


# ---------------------------------------------------------------------------------------------
# Server lifecycle
# ---------------------------------------------------------------------------------------------

def start_server(wait=240):
    os.makedirs(USER_DIR, exist_ok=True)
    log = open(LOG_FILE, "w", encoding="utf-8", errors="replace")
    flags = 0
    if os.name == "nt":
        flags = subprocess.CREATE_NEW_PROCESS_GROUP | subprocess.DETACHED_PROCESS | subprocess.CREATE_NO_WINDOW
    proc = subprocess.Popen(
        [COMFY_PY, "main.py", "--preview-method", "none", "--user-directory", USER_DIR,
         "--input-directory", INPUT_DIR, "--output-directory", OUTPUT_DIR],
        cwd=COMFY, stdout=log, stderr=subprocess.STDOUT, stdin=subprocess.DEVNULL, creationflags=flags)
    with open(PID_FILE, "w") as f:
        f.write(str(proc.pid))
    say(f"starting ComfyUI headless (pid {proc.pid}, log {rel(LOG_FILE)}) ...")
    t0 = time.time()
    while time.time() - t0 < wait:
        if proc.poll() is not None:
            sys.exit(f"ComfyUI exited with code {proc.returncode}; see {LOG_FILE}")
        if server_stats():
            say(f"ComfyUI up in {time.time() - t0:.0f} s")
            return proc.pid
        time.sleep(1)
    sys.exit(f"ComfyUI did not come up within {wait} s; see {LOG_FILE}")


def find_server_pids():
    """PIDs of a ComfyUI serving our output dir: the pid file, else a psutil scan if available."""
    pids = []
    if os.path.exists(PID_FILE):
        try:
            pids.append(int(open(PID_FILE).read().strip()))
        except ValueError:
            pass
    try:
        import psutil  # in the ComfyUI venv; optional
        for p in psutil.process_iter(["pid", "cmdline"]):
            cmd = p.info.get("cmdline") or []
            if "main.py" in " ".join(cmd) and any(norm(a) == norm(OUTPUT_DIR) for a in cmd if os.path.isabs(a)):
                pids.append(p.info["pid"])
    except ImportError:
        pass
    return sorted(set(pids))


def stop_server():
    stats = server_stats()
    if stats and not server_is_ours(stats):
        say("the running ComfyUI is not this team's server (another project's output dir); leaving it alone")
        return
    pids = find_server_pids()
    for pid in pids:
        if os.name == "nt":
            subprocess.run(["taskkill", "/PID", str(pid), "/T", "/F"], capture_output=True)
        else:
            try:
                os.kill(pid, 15)
            except OSError:
                pass
    for _ in range(30):
        if not server_stats():
            break
        time.sleep(0.5)
    if os.path.exists(PID_FILE):
        os.remove(PID_FILE)
    say("ComfyUI stopped" if not server_stats() else "ComfyUI still answering; stop it by hand")


# ---------------------------------------------------------------------------------------------
# Workflow patching
# ---------------------------------------------------------------------------------------------

def load_manifest():
    with open(os.path.join(API_DIR, "manifest.json"), encoding="utf-8") as f:
        return json.load(f)


def resolve_workflow(manifest, name):
    key = name.strip().upper().split(" ")[0]
    if key in manifest:
        return key
    for k, m in manifest.items():
        if m["name"].lower().startswith(name.lower()):
            return k
    sys.exit(f"unknown workflow {name!r}; choose from {', '.join(manifest)}")


def setv(api, ref, value):
    node, inp = ref
    api[str(node)]["inputs"][inp] = value


def getv(api, ref):
    node, inp = ref
    return api[str(node)]["inputs"].get(inp)


def round16(v):
    return max(16, int(round(v / 16.0)) * 16)


def parse_size(size):
    """'1920x1080' -> (1920, 1080); '16:9' -> ('16:9', None)."""
    s = str(size).lower().replace(" ", "")
    if "x" in s:
        w, h = s.split("x")
        return int(w), int(h)
    if ":" in s:
        return s, None
    sys.exit(f"bad --size {size!r}: use WxH (1920x1080) or an aspect (16:9)")


def stage_input(path):
    """Copy an input image into artgen/input/_generate/ and return the LoadImage name."""
    src = os.path.abspath(os.path.join(REPO, path)) if not os.path.isabs(path) else path
    if not os.path.isfile(src):
        src = os.path.abspath(path)
    if not os.path.isfile(src):
        sys.exit(f"input image not found: {path}")
    with open(src, "rb") as f:
        digest = hashlib.sha1(f.read()).hexdigest()[:12]
    ext = os.path.splitext(src)[1].lower() or ".png"
    dest_dir = os.path.join(INPUT_DIR, "_generate")
    os.makedirs(dest_dir, exist_ok=True)
    name = f"{os.path.splitext(os.path.basename(src))[0][:40]}_{digest}{ext}"
    dest = os.path.join(dest_dir, name)
    if not os.path.exists(dest):
        shutil.copyfile(src, dest)
    return f"_generate/{name}", src


def build_prompt(m, base, job, seed):
    api = copy.deepcopy(base)
    kind = m["kind"]
    info = {} if kind == "upscale" else {"seed": seed}

    if m.get("prompt"):
        if job.get("prompt"):
            setv(api, m["prompt"], job["prompt"])
        info["prompt"] = getv(api, m["prompt"])
    if m.get("negative"):
        if job.get("negative") is not None:
            setv(api, m["negative"], job["negative"])
        info["negative"] = getv(api, m["negative"])
    elif job.get("negative"):
        say("note: this workflow runs at CFG 1 and has no negative prompt; --negative ignored")

    model_changed = False
    if m.get("model"):
        if job.get("model"):
            name = MODELS.get(job["model"], job["model"])
            model_changed = name != getv(api, m["model"])
            setv(api, m["model"], name)
        info["model"] = getv(api, m["model"])

    samplers = [str(s) for s in m.get("samplers", [m["sampler"]] if m.get("sampler") else [])]
    for sid in samplers:
        ins = api[sid]["inputs"]
        ins["seed"] = seed
        if model_changed and info["model"] in MODEL_DEFAULTS:
            ins.update(MODEL_DEFAULTS[info["model"]])
        if job.get("steps"):
            ins["steps"] = int(job["steps"])
        if job.get("cfg") is not None:
            ins["cfg"] = float(job["cfg"])
    if samplers:
        s = api[samplers[0]]["inputs"]
        info.update(steps=s["steps"], cfg=s["cfg"], sampler=s["sampler_name"], scheduler=s["scheduler"],
                    denoise=s["denoise"])
    if m.get("seam_denoise"):
        if job.get("seam_denoise") is not None:
            setv(api, m["seam_denoise"], float(job["seam_denoise"]))
        info["seam_denoise"] = getv(api, m["seam_denoise"])

    # Size
    size = job.get("size")
    if kind == "txt2img":
        r, lat = str(m["resolution"]), str(m["latent"])
        if size:
            w, h = parse_size(size)
            if h is None:
                opts = OBJECT_INFO["ResolutionSelector"]["input"]["required"]["aspect_ratio"][1]["options"]
                match = [o for o in opts if o.split(" ")[0] == w]
                if not match:
                    sys.exit(f"aspect {w} not offered; use one of {[o.split(' ')[0] for o in opts]} or WxH")
                api[r]["inputs"]["aspect_ratio"] = match[0]
            else:
                rw, rh = round16(w), round16(h)
                if (rw, rh) != (w, h):
                    say(f"note: size rounded to multiples of 16: {rw}x{rh}")
                api[lat]["inputs"]["width"], api[lat]["inputs"]["height"] = rw, rh
                del api[r]
        if job.get("mp") and r in api:
            api[r]["inputs"]["megapixels"] = float(job["mp"])
        if r in api:
            info["aspect"] = api[r]["inputs"]["aspect_ratio"]
            info["megapixels"] = api[r]["inputs"]["megapixels"]
    elif kind == "texture":
        if size:
            w, h = parse_size(size)
            if h is None:
                sys.exit("WEB5 needs an exact tile size, e.g. --size 1024x1024")
            w, h = round16(w), round16(h)
            env = {"w": w, "h": h, "bw": round16(w * 3 / 16), "bh": round16(h * 3 / 16)}
            for node, inp, expr in m["size_bindings"]:
                api[str(node)]["inputs"][inp] = int(eval(expr, {"__builtins__": {}}, env))
    elif kind == "edit":
        if job.get("ref_mp"):
            setv(api, m["ref_megapixels"], float(job["ref_mp"]))
        if size:
            w, h = parse_size(size)
            if h is None:
                sys.exit("WEB2 --size needs WxH (the output otherwise keeps image 1's aspect)")
            api["900"] = {"class_type": "EmptyFlux2LatentImage",
                          "inputs": {"width": round16(w), "height": round16(h), "batch_size": 1},
                          "_meta": {"title": "Output size (generate.py --size)"}}
            api[samplers[0]]["inputs"]["latent_image"] = ["900", 0]

    # Images in
    if m.get("image"):
        if not job.get("image"):
            sys.exit(f"{m['name']} needs --image")
        name, src = stage_input(job["image"])
        api[str(m["image"])]["inputs"]["image"] = name
        info["image"] = rel(src)
        info["source_provenance"] = read_sidecar(src)
    if kind == "edit":
        refs = job.get("refs") or []
        ref_node = api[str(m["refs"])]["inputs"]
        info["refs"] = []
        for i, path in enumerate(refs, start=1):
            name, src = stage_input(path)
            nid = str(910 + i)
            api[nid] = {"class_type": "LoadImage", "inputs": {"image": name},
                        "_meta": {"title": f"Image {i + 1} = <ref_image_{i}>"}}
            ref_node[f"images.image{i}"] = [nid, 0]
            info["refs"].append(rel(src))
    if kind == "upscale":
        if job.get("upscale_model"):
            setv(api, m["upscale_model"], job["upscale_model"])
        if job.get("scale"):
            setv(api, m["scale"], float(job["scale"]))
        info["upscale_model"] = getv(api, m["upscale_model"])
        info["scale_after_4x"] = getv(api, m["scale"])
    return api, info


# ---------------------------------------------------------------------------------------------
# Run
# ---------------------------------------------------------------------------------------------

def submit(api, client_id):
    try:
        res = http("POST", "/prompt", {"prompt": api, "client_id": client_id})
    except urllib.error.HTTPError as e:
        detail = e.read().decode(errors="replace")
        try:
            d = json.loads(detail)
            msg = d.get("error", {}).get("message", "")
            for nid, ne in (d.get("node_errors") or {}).items():
                for err in ne.get("errors", []):
                    msg += f"\n  node {nid} ({ne.get('class_type')}): {err.get('message')} {err.get('details', '')}"
            detail = msg
        except ValueError:
            pass
        sys.exit(f"ComfyUI rejected the workflow: {detail}")
    return res["prompt_id"]


def wait_for(prompt_id, timeout):
    t0 = time.time()
    while time.time() - t0 < timeout:
        hist = http("GET", f"/history/{prompt_id}")
        if prompt_id in hist:
            h = hist[prompt_id]
            st = h.get("status", {})
            if st.get("status_str") == "error":
                msgs = [m[1] for m in st.get("messages", []) if m[0] == "execution_error"]
                err = msgs[0] if msgs else st
                if isinstance(err, dict):
                    err = f"node {err.get('node_id')} ({err.get('node_type')}): {err.get('exception_message')}"
                sys.exit(f"generation failed: {err}")
            if st.get("completed", True):
                return h
        time.sleep(0.5)
    sys.exit(f"timed out after {timeout} s waiting for {prompt_id}")


def collect(h, save_node, out_dir):
    files = []
    for img in h.get("outputs", {}).get(str(save_node), {}).get("images", []):
        if img.get("type") != "output":
            continue
        local = os.path.join(OUTPUT_DIR, img.get("subfolder", ""), img["filename"])
        dest = os.path.join(out_dir, img["filename"])
        os.makedirs(out_dir, exist_ok=True)
        if os.path.exists(local):
            if norm(local) != norm(dest):
                shutil.move(local, dest)
        else:  # foreign server: download
            q = urllib.parse.urlencode({"filename": img["filename"], "subfolder": img.get("subfolder", ""),
                                        "type": "output"})
            with urllib.request.urlopen(f"{SERVER}/view?{q}", timeout=60) as r, open(dest, "wb") as f:
                f.write(r.read())
        files.append(dest)
    return files


def png_size(path):
    with open(path, "rb") as f:
        head = f.read(24)
    if head[:8] == b"\x89PNG\r\n\x1a\n":
        return list(struct.unpack(">II", head[16:24]))
    return None


def read_sidecar(image_path):
    side = os.path.splitext(image_path)[0] + ".json"
    if os.path.exists(side):
        try:
            with open(side, encoding="utf-8") as f:
                d = json.load(f)
            d.pop("api_prompt", None)
            return d
        except ValueError:
            return None
    return None


def run_job(manifest, job, client_id, comfy_version):
    key = resolve_workflow(manifest, job["workflow"])
    m = manifest[key]
    with open(os.path.join(API_DIR, m["file"]), encoding="utf-8") as f:
        base = json.load(f)
    count = int(job.get("count") or 1)
    seed0 = job.get("seed")
    seed0 = int(seed0) if seed0 is not None else random.randint(0, 2 ** 48)
    out_dir = job.get("out") or os.path.join(OUTPUT_DIR, key.lower())
    out_dir = out_dir if os.path.isabs(out_dir) else os.path.join(REPO, out_dir)
    name = job.get("name") or key.lower()
    prefix_dir = os.path.relpath(out_dir, OUTPUT_DIR) if norm(out_dir).startswith(norm(OUTPUT_DIR)) else "_generate"
    results = []
    for i in range(count):
        seed = seed0 + i
        api, info = build_prompt(m, base, job, seed)
        api[str(m["save"])]["inputs"]["filename_prefix"] = os.path.join(prefix_dir, name).replace("\\", "/")
        if job.get("dry_run"):
            print(json.dumps(api, indent=1))
            continue
        t0 = time.time()
        pid = submit(api, client_id)
        h = wait_for(pid, job.get("timeout") or 900)
        elapsed = time.time() - t0
        files = collect(h, m["save"], out_dir)
        for path in files:
            family = m["family"]
            record = {
                "workflow": m["name"],
                "workflow_file": f"artgen/user/default/workflows/{m['file']}",
                "api_file": f"artgen/api/{m['file']}",
                **info,
                "size": png_size(path),
                "licence": LICENCES.get(info.get("upscale_model"), LICENCES.get(family, "")),
                "created": dt.datetime.now().astimezone().isoformat(timespec="seconds"),
                "elapsed_s": round(elapsed, 1),
                "comfyui_version": comfy_version,
                "prompt_id": pid,
                "regenerate": "python artgen/generate.py --replay " + rel(os.path.splitext(path)[0] + ".json"),
                "api_prompt": api,
            }
            with open(os.path.splitext(path)[0] + ".json", "w", encoding="utf-8") as f:
                json.dump(record, f, indent=1)
            results.append({"file": rel(path), "seed": info.get("seed"), "elapsed_s": round(elapsed, 1)})
            label = f" seed {seed}" if "seed" in info else ""
            say(f"{key}{label}: {rel(path)}  ({elapsed:.1f} s)")
    return results


def replay(sidecar, client_id, comfy_version, out=None):
    """Re-run the exact API graph stored in a sidecar."""
    with open(sidecar, encoding="utf-8") as f:
        rec = json.load(f)
    api = rec["api_prompt"]
    save = next(k for k, n in api.items() if n["class_type"] == "SaveImage")
    out_dir = out or os.path.dirname(os.path.abspath(sidecar))
    out_dir = out_dir if os.path.isabs(out_dir) else os.path.join(REPO, out_dir)
    prefix_dir = os.path.relpath(out_dir, OUTPUT_DIR) if norm(out_dir).startswith(norm(OUTPUT_DIR)) else "_generate"
    api[save]["inputs"]["filename_prefix"] = f"{prefix_dir}/replay".replace("\\", "/")
    t0 = time.time()
    h = wait_for(submit(api, client_id), 900)
    for path in collect(h, save, out_dir):
        rec.update(created=dt.datetime.now().astimezone().isoformat(timespec="seconds"),
                   elapsed_s=round(time.time() - t0, 1), size=png_size(path), replay_of=rel(sidecar))
        with open(os.path.splitext(path)[0] + ".json", "w", encoding="utf-8") as f:
            json.dump(rec, f, indent=1)
        say(f"replayed: {rel(path)}")


# ---------------------------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------------------------

def say(msg):
    print(f"[generate] {msg}", flush=True)


def rel(p):
    try:
        return os.path.relpath(p, REPO).replace("\\", "/")
    except ValueError:
        return p


OBJECT_INFO = {}


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("workflow", nargs="?", help="WEB1..WEB6 (or a name prefix)")
    ap.add_argument("--prompt", "-p")
    ap.add_argument("--negative", "-n", help="negative prompt (WEB1/WEB4, only used at CFG > 1)")
    ap.add_argument("--size", "-s", help="WxH (multiples of 16) or an aspect: 1:1 2:3 3:2 3:4 4:3 9:16 16:9 21:9")
    ap.add_argument("--mp", type=float, help="megapixels when --size is an aspect (default per workflow)")
    ap.add_argument("--seed", type=int, help="first seed (random if omitted); --count adds 1 per image")
    ap.add_argument("--count", "-c", type=int, default=1)
    ap.add_argument("--out", "-o", help="output folder (default artgen/output/<web#>)")
    ap.add_argument("--name", help="filename prefix (default web#)")
    ap.add_argument("--steps", type=int)
    ap.add_argument("--cfg", type=float)
    ap.add_argument("--model", help="full | fast | a diffusion model filename (Klein workflows)")
    ap.add_argument("--image", "-i", help="input image: WEB2 <ref_image_0>, WEB6 the image to upscale")
    ap.add_argument("--ref", dest="refs", action="append", help="WEB2 extra reference (repeat for <ref_image_2> ...)")
    ap.add_argument("--ref-mp", dest="ref_mp", type=float, help="WEB2 reference/output megapixels (default 1.5)")
    ap.add_argument("--scale", type=float, help="WEB6 scale after the 4x model (0.5 = 2x, 1.0 = 4x)")
    ap.add_argument("--upscale-model", dest="upscale_model")
    ap.add_argument("--seam-denoise", dest="seam_denoise", type=float, help="WEB5 seam repaint strength (0.75)")
    ap.add_argument("--jobs", help="JSON file: a list of job objects with the same keys as these flags")
    ap.add_argument("--replay", help="re-run the exact graph stored in a provenance sidecar .json")
    ap.add_argument("--keep-server", action="store_true", help="leave a server this run started running")
    ap.add_argument("--stop", action="store_true", help="stop this team's headless ComfyUI and exit")
    ap.add_argument("--list", action="store_true", help="list workflows and exit")
    ap.add_argument("--dry-run", action="store_true", help="print the patched API graph instead of running")
    ap.add_argument("--timeout", type=int, default=900, help="seconds per image")
    ap.add_argument("--allow-foreign-server", action="store_true",
                    help="use a ComfyUI that another project started (inputs land in its input folder)")
    args = ap.parse_args()

    manifest = load_manifest()
    if args.list:
        for k, m in manifest.items():
            print(f"{k:5} {m['name']:38} kind={m['kind']}")
        return
    if args.stop:
        stop_server()
        return
    if args.jobs:
        with open(args.jobs, encoding="utf-8") as f:
            jobs = json.load(f)
        defaults = {k: v for k, v in vars(args).items() if k in JOB_KEYS and v is not None}
        defaults.pop("count", None)
        jobs = [dict(defaults, **j) for j in jobs]
    elif args.workflow:
        jobs = [{k: getattr(args, k) for k in JOB_KEYS}]
    elif not args.replay:
        ap.error("give a workflow, --jobs, --replay, --list or --stop")
    for j in jobs if not args.replay else []:
        j.setdefault("count", 1)
        j["dry_run"], j["timeout"] = args.dry_run, args.timeout

    started = None
    stats = server_stats()
    if args.dry_run:
        pass
    elif stats is None:
        started = start_server()
        stats = server_stats()
    elif not server_is_ours(stats) and not args.allow_foreign_server:
        sys.exit("ComfyUI on :8188 was started by another project (e.g. Safeguard): its input/output folders "
                 "are not artgen/. Close it, or pass --allow-foreign-server.")
    comfy_version = (stats or {}).get("system", {}).get("comfyui_version")
    if stats:
        OBJECT_INFO["ResolutionSelector"] = http("GET", "/object_info/ResolutionSelector")["ResolutionSelector"]
    else:
        OBJECT_INFO["ResolutionSelector"] = {"input": {"required": {"aspect_ratio": [None, {"options": [
            "1:1 (Square)", "2:3 (Portrait Photo)", "3:2 (Photo)", "3:4 (Portrait Standard)", "4:3 (Standard)",
            "9:16 (Portrait Widescreen)", "16:9 (Widescreen)", "21:9 (Ultrawide)"]}]}}}

    client_id = str(uuid.uuid4())
    t0 = time.time()
    try:
        if args.replay:
            replay(args.replay, client_id, comfy_version, args.out)
        else:
            total = []
            for job in jobs:
                total += run_job(manifest, job, client_id, comfy_version)
            if total:
                say(f"done: {len(total)} image(s) in {time.time() - t0:.1f} s")
    except KeyboardInterrupt:
        say("interrupted; clearing the queue")
        try:
            http("POST", "/interrupt", {})
            http("POST", "/queue", {"clear": True})
        except Exception:
            pass
        raise
    finally:
        if started and not args.keep_server:
            stop_server()


if __name__ == "__main__":
    main()
