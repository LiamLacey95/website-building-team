"""Install, verify or top up the ComfyUI engine and models the website team needs.

Stdlib only (Python 3.10+), so it runs before any venv exists. Run from anywhere:

  python artgen/setup/install_comfyui.py --verify <comfyui dir> [--quick] [--json]
  python artgen/setup/install_comfyui.py --install <dir> [--yes] [--dry-run] [--with-extras] [--skip-models] [--json]
  python artgen/setup/install_comfyui.py --models-only <comfyui dir> [--yes] [--dry-run] [--with-extras]

Model list, pinned ComfyUI commit and torch choice: artgen/setup/models.json.
Gated models (FLUX 3 Klein) need a Hugging Face read token in HF_TOKEN, and the licence accepted once at
https://huggingface.co/black-forest-labs/flux-3-image-klein-comfy .

Logs go to stderr; --json prints one JSON object to stdout.
Exit codes: 0 ok / green, 3 amber (verify: only optional items missing or untested version), 1 error / red,
2 usage error.
"""
import argparse
import hashlib
import json
import os
import platform
import re
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ARTGEN = os.path.dirname(HERE)
sys.path.insert(0, ARTGEN)
import comfy_config  # noqa: E402
REPO = os.path.dirname(ARTGEN)
MANIFEST = os.path.join(HERE, "models.json")
PROJECT_MODELS = os.path.join(ARTGEN, "models")
HASH_CACHE = os.path.join(HERE, ".hashcache.json")
CONFIG = os.path.join(REPO, "team.config.json")
WINDOWS = os.name == "nt"
GB = 1000 ** 3
UA = "website-building-team-installer/1.0"
HF_ACCEPT_URL = "https://huggingface.co/black-forest-labs/flux-3-image-klein-comfy"


def log(msg=""):
    print(msg, file=sys.stderr, flush=True)


def gb(n):
    return f"{n / GB:.1f} GB" if n >= GB else f"{n / 1e6:.0f} MB"


def load_manifest():
    with open(MANIFEST, encoding="utf-8") as f:
        return json.load(f)


def venv_python(comfy_dir):
    return os.path.join(comfy_dir, "venv", "Scripts", "python.exe") if WINDOWS else \
        os.path.join(comfy_dir, "venv", "bin", "python")


def config_python(comfy_dir):
    """comfyui.python from team.config.json when it describes this install, else the default venv path."""
    try:
        with open(CONFIG, encoding="utf-8") as f:
            c = json.load(f).get("comfyui", {})
        if c.get("path") and os.path.normcase(os.path.abspath(c["path"])) == os.path.normcase(os.path.abspath(comfy_dir)) \
                and c.get("python"):
            return c["python"]
    except (OSError, ValueError):
        pass
    cands = comfy_config.python_candidates(comfy_dir)
    return next((c for c in cands if os.path.isfile(c)), cands[0])


def model_path(m, comfy_dir):
    base = PROJECT_MODELS if m["location"] == "project" else os.path.join(comfy_dir, "models")
    return os.path.join(base, m["subfolder"], m["file"])


def select_models(manifest, with_extras=False, no_optional=False):
    out = []
    for m in manifest["models"]:
        if m["required"] or (m["default"] and not no_optional) or with_extras:
            out.append(m)
    return out


def version_tuple(v):
    return tuple(int(x) for x in re.findall(r"\d+", v)[:3])


# ---------------------------------------------------------------------------------------------
# Hashing (cached by path + size + mtime, so repeat verifies are instant)
# ---------------------------------------------------------------------------------------------

def load_cache():
    try:
        with open(HASH_CACHE, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return {}


def save_cache(cache):
    try:
        with open(HASH_CACHE, "w", encoding="utf-8") as f:
            json.dump(cache, f, indent=1)
    except OSError:
        pass


def sha256_file(path, cache):
    st = os.stat(path)
    key = os.path.normcase(os.path.abspath(path))
    hit = cache.get(key)
    if hit and hit["size"] == st.st_size and hit["mtime_ns"] == st.st_mtime_ns:
        return hit["sha256"]
    h = hashlib.sha256()
    done, t0, last = 0, time.time(), 0
    with open(path, "rb") as f:
        while True:
            b = f.read(16 * 1024 * 1024)
            if not b:
                break
            h.update(b)
            done += len(b)
            if time.time() - last > 5:
                log(f"    hashing {os.path.basename(path)}: {done * 100 // max(st.st_size, 1)}%")
                last = time.time()
    digest = h.hexdigest()
    cache[key] = {"size": st.st_size, "mtime_ns": st.st_mtime_ns, "sha256": digest}
    return digest


# ---------------------------------------------------------------------------------------------
# Machine checks
# ---------------------------------------------------------------------------------------------

def run(cmd, cwd=None, check=True, capture=False):
    log("  $ " + " ".join(f'"{c}"' if " " in str(c) else str(c) for c in cmd))
    r = subprocess.run([str(c) for c in cmd], cwd=cwd, text=True,
                       stdout=subprocess.PIPE if capture else sys.stderr,
                       stderr=subprocess.STDOUT if capture else sys.stderr)
    if check and r.returncode != 0:
        raise SystemExit(f"command failed ({r.returncode}): {' '.join(map(str, cmd))}"
                         + (f"\n{r.stdout}" if capture and r.stdout else ""))
    return r


def detect_gpu():
    """{'name', 'vram_mb', 'driver', 'cuda'} from nvidia-smi, or None."""
    smi = shutil.which("nvidia-smi")
    if not smi:
        return None
    try:
        q = subprocess.run([smi, "--query-gpu=name,memory.total,driver_version", "--format=csv,noheader,nounits"],
                           capture_output=True, text=True, timeout=30)
        full = subprocess.run([smi], capture_output=True, text=True, timeout=30).stdout
    except (OSError, subprocess.TimeoutExpired):
        return None
    if q.returncode != 0 or not q.stdout.strip():
        return None
    name, vram, driver = [x.strip() for x in q.stdout.strip().splitlines()[0].split(",")]
    # Older drivers print "CUDA Version: 12.8", newer ones "CUDA UMD Version: 13.4".
    m = re.search(r"CUDA(?: UMD)? Version:\s*([\d.]+)", full)
    cuda = m.group(1) if m else cuda_from_driver(driver)
    return {"name": name, "vram_mb": int(float(vram)), "driver": driver, "cuda": cuda}


def cuda_from_driver(driver):
    """Highest CUDA runtime a driver supports, from NVIDIA's minimum driver table (fallback only)."""
    d = version_tuple(driver)
    for minimum, cuda in (((580,), "13.0"), ((570,), "12.8"), ((560,), "12.6")):
        if d >= minimum:
            return cuda
    return None


def pick_torch(manifest, gpu):
    t = manifest["comfyui"]["torch"]
    if gpu and gpu.get("cuda"):
        for opt in t["indexes"]:
            if version_tuple(gpu["cuda"]) >= version_tuple(opt["minCuda"]):
                return dict(opt, kind="cuda")
        return None
    return dict(t["cpu"], kind="cpu")


def free_bytes(path):
    p = os.path.abspath(path)
    while not os.path.exists(p):
        parent = os.path.dirname(p)
        if parent == p:
            break
        p = parent
    return shutil.disk_usage(p).free


def hf_token():
    for k in ("HF_TOKEN", "HUGGING_FACE_HUB_TOKEN"):
        if os.environ.get(k):
            return os.environ[k].strip()
    for p in (os.path.join(os.path.expanduser("~"), ".cache", "huggingface", "token"),
              os.path.join(os.environ.get("HF_HOME", ""), "token") if os.environ.get("HF_HOME") else ""):
        if p and os.path.isfile(p):
            with open(p, encoding="utf-8") as f:
                tok = f.read().strip()
            if tok:
                return tok
    return None


def make_request(url, token=None, start=0):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    if start:
        req.add_header("Range", f"bytes={start}-")
    if token and urllib.parse.urlparse(url).hostname == "huggingface.co":
        # Unredirected: the token goes to huggingface.co only, never to the CDN it redirects to.
        req.add_unredirected_header("Authorization", f"Bearer {token}")
    return req


def check_gated_access(url, token):
    """'ok', 'no-token', 'bad-token', 'not-accepted' or 'error: ...'."""
    if not token:
        return "no-token"
    try:
        req = make_request(url, token)
        req.add_header("Range", "bytes=0-0")
        with urllib.request.urlopen(req, timeout=60) as r:
            r.read(1)
        return "ok"
    except urllib.error.HTTPError as e:
        if e.code == 401:
            return "bad-token"
        if e.code == 403:
            return "not-accepted"
        return f"error: HTTP {e.code}"
    except (urllib.error.URLError, OSError) as e:
        return f"error: {e}"


GATED_HELP = (
    "The FLUX 3 Klein files are gated by Black Forest Labs. Once only:\n"
    "  1. Create a free account at https://huggingface.co/join\n"
    f"  2. Open {HF_ACCEPT_URL} and accept the FLUX Kommunity licence\n"
    "  3. Create a read token at https://huggingface.co/settings/tokens\n"
    "  4. Set it for this shell: PowerShell  $env:HF_TOKEN='hf_...'   bash  export HF_TOKEN=hf_...\n"
    "Then run this command again.")


# ---------------------------------------------------------------------------------------------
# Download with resume and hash check
# ---------------------------------------------------------------------------------------------

def download(m, dest, token, cache, retries=6):
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    part = dest + ".part"
    size = m["size"]
    for attempt in range(1, retries + 1):
        have = os.path.getsize(part) if os.path.exists(part) else 0
        if have > size:
            os.remove(part)
            have = 0
        h = hashlib.sha256()
        if have:
            with open(part, "rb") as f:
                for b in iter(lambda: f.read(16 * 1024 * 1024), b""):
                    h.update(b)
            log(f"    resuming at {gb(have)}")
        try:
            if have < size:
                with urllib.request.urlopen(make_request(m["url"], token, have), timeout=120) as r:
                    if have and r.status != 206:  # server ignored Range: start over
                        have, h = 0, hashlib.sha256()
                        mode = "wb"
                    else:
                        mode = "ab"
                    with open(part, mode) as f:
                        t0, last, got = time.time(), 0, 0
                        while True:
                            b = r.read(8 * 1024 * 1024)
                            if not b:
                                break
                            f.write(b)
                            h.update(b)
                            got += len(b)
                            now = time.time()
                            if now - last > 3:
                                rate = got / max(now - t0, 0.001)
                                done = have + got
                                eta = (size - done) / rate if rate else 0
                                log(f"    {m['file']}: {gb(done)} / {gb(size)}  {rate / 1e6:.0f} MB/s  ETA {eta / 60:.0f} min")
                                last = now
            if os.path.getsize(part) != size:
                raise IOError(f"size {os.path.getsize(part)} != expected {size}")
            digest = h.hexdigest()
            if digest != m["sha256"]:
                os.remove(part)
                raise SystemExit(f"{m['file']}: SHA-256 mismatch (got {digest}, expected {m['sha256']}). "
                                 "Deleted the download; the upstream file may have changed. Tell the Concept agent.")
            os.replace(part, dest)
            st = os.stat(dest)
            cache[os.path.normcase(os.path.abspath(dest))] = {"size": st.st_size, "mtime_ns": st.st_mtime_ns,
                                                               "sha256": digest}
            save_cache(cache)
            return
        except urllib.error.HTTPError as e:
            if e.code in (401, 403):
                raise SystemExit(f"{m['file']}: HTTP {e.code} from Hugging Face.\n{GATED_HELP}")
            err = f"HTTP {e.code}"
        except (urllib.error.URLError, OSError, TimeoutError) as e:
            err = str(e)
        wait = min(60, 5 * attempt)
        log(f"    attempt {attempt} failed ({err}); retrying in {wait} s")
        time.sleep(wait)
    raise SystemExit(f"{m['file']}: download failed after {retries} attempts; run again to resume")


# ---------------------------------------------------------------------------------------------
# Verify
# ---------------------------------------------------------------------------------------------

def verify(comfy_dir, manifest, quick=False, python=None, with_extras=False):
    checks = []

    def add(item, status, detail):
        checks.append({"item": item, "status": status, "detail": detail})

    comfy_dir = os.path.abspath(comfy_dir)
    info = {"path": comfy_dir}
    if not os.path.isfile(os.path.join(comfy_dir, "main.py")):
        add("comfyui", "error", f"no ComfyUI at {comfy_dir} (main.py missing)")
        return summarise(checks, info)

    # Version
    pinned = manifest["comfyui"]["commit"]
    ver = None
    try:
        with open(os.path.join(comfy_dir, "comfyui_version.py"), encoding="utf-8") as f:
            ver = re.search(r'__version__\s*=\s*"([^"]+)"', f.read()).group(1)
    except (OSError, AttributeError):
        pass
    head = None
    if shutil.which("git") and os.path.isdir(os.path.join(comfy_dir, ".git")):
        r = subprocess.run(["git", "-C", comfy_dir, "rev-parse", "HEAD"], capture_output=True, text=True)
        head = r.stdout.strip() if r.returncode == 0 else None
    info.update(version=ver, commit=head)
    if ver is None:
        add("comfyui version", "error", "cannot read comfyui_version.py")
    elif version_tuple(ver) < version_tuple(manifest["comfyui"]["minVersion"]):
        add("comfyui version", "error", f"{ver} is older than {manifest['comfyui']['minVersion']}; update ComfyUI "
            "(git pull, then reinstall requirements)")
    elif head == pinned:
        add("comfyui version", "ok", f"{ver} at the pinned commit {pinned[:10]}")
    elif version_tuple(ver) > version_tuple(manifest["comfyui"]["version"]):
        add("comfyui version", "warn", f"{ver} is newer than the tested {manifest['comfyui']['version']}; "
            "should work, run generate.py --smoke")
    else:
        add("comfyui version", "ok", f"{ver} (commit {head[:10] if head else 'unknown'}; tested "
            f"{pinned[:10]})")

    # Python, torch, manager
    py = python or config_python(comfy_dir)
    info["python"] = py
    if not os.path.isfile(py):
        add("python", "error", f"venv python not found at {py}")
    elif quick:
        add("python", "ok", f"{py} (not imported: --quick)")
    else:
        probe = ("import json,sys,importlib.metadata as md\n"
                 "d={'python_version':sys.version.split()[0]}\n"
                 "try:\n import torch\n d['torch']=torch.__version__\n d['cuda']=torch.cuda.is_available()\n"
                 " d['gpu']=torch.cuda.get_device_name(0) if d['cuda'] else None\n"
                 "except Exception as e:\n d['torch_error']=str(e)\n"
                 "try:\n d['manager']=md.version('comfyui_manager')\nexcept Exception:\n d['manager']=None\n"
                 "print(json.dumps(d))")
        r = subprocess.run([py, "-c", probe], capture_output=True, text=True, timeout=300)
        try:
            d = json.loads(r.stdout.strip().splitlines()[-1])
        except (ValueError, IndexError):
            d = {"torch_error": (r.stderr or r.stdout)[-400:]}
        info.update(d)
        if "torch_error" in d:
            add("torch", "error", f"torch does not import: {d['torch_error']}")
        elif not d.get("cuda"):
            add("torch", "warn", f"torch {d['torch']} without CUDA: generation will be very slow")
        else:
            add("torch", "ok", f"python {d['python_version']}, torch {d['torch']}, {d['gpu']}")
        if not d.get("manager"):
            add("comfyui manager", "warn", "comfyui_manager not installed; the UI launcher uses --enable-manager. "
                "Install manager_requirements.txt in the venv")
        else:
            add("comfyui manager", "ok", d["manager"])

    # Models
    cache = load_cache()
    for m in manifest["models"]:
        path = model_path(m, comfy_dir)
        wanted = m["required"] or m["default"] or with_extras
        miss_status = "error" if m["required"] else ("warn" if wanted else "info")
        label = f"model {m['file']}"
        if not os.path.isfile(path):
            alias = os.path.join(os.path.dirname(path), m.get("sourceFile", "")) if m.get("sourceFile") else None
            hint = (f"; found {m['sourceFile']} in the same folder: rename it to {m['file']}"
                    if alias and os.path.isfile(alias) else "; install with --models-only")
            add(label, miss_status, f"missing at {path}{hint}" if wanted else
                "not installed (optional extra, not used by WEB workflows)")
            continue
        size = os.path.getsize(path)
        if size != m["size"]:
            add(label, "error" if m["required"] else "warn", f"size {size} != expected {m['size']}")
            continue
        if quick:
            add(label, "ok", "present, size matches (hash not checked: --quick)")
            continue
        digest = sha256_file(path, cache)
        if digest != m["sha256"]:
            add(label, "error" if m["required"] else "warn", f"SHA-256 {digest} != expected {m['sha256']}")
        else:
            add(label, "ok", "hash matches")
    save_cache(cache)

    # Project-local model path wiring
    if not os.path.isfile(os.path.join(ARTGEN, "extra_model_paths.yaml")):
        add("extra_model_paths.yaml", "error", "artgen/extra_model_paths.yaml missing (RealESRGAN will not load)")
    return summarise(checks, info)


def summarise(checks, info):
    statuses = {c["status"] for c in checks}
    status = "red" if "error" in statuses else ("amber" if "warn" in statuses else "green")
    return {"status": status, "comfyui": info, "checks": checks}


def print_verify(res):
    mark = {"ok": "OK  ", "warn": "WARN", "error": "FAIL", "info": "    "}
    for c in res["checks"]:
        log(f"  [{mark[c['status']]}] {c['item']}: {c['detail']}")
    log(f"\nResult: {res['status'].upper()}")


# ---------------------------------------------------------------------------------------------
# Install / models-only
# ---------------------------------------------------------------------------------------------

def plan(comfy_dir, manifest, full_install, with_extras, no_optional, skip_models=False):
    comfy_dir = os.path.abspath(comfy_dir)
    p = {"path": comfy_dir, "steps": [], "blockers": [], "warnings": [], "download_bytes": 0, "need_bytes": 0}
    exists = os.path.isfile(os.path.join(comfy_dir, "main.py"))
    if not full_install and not exists:
        p["blockers"].append(f"no ComfyUI at {comfy_dir}; use --install")
    if full_install:
        if not shutil.which("git"):
            p["blockers"].append("git is not installed")
        if exists:
            p["steps"].append(f"ComfyUI already at {comfy_dir}: keep it (no clone)")
        elif os.path.isdir(comfy_dir) and os.listdir(comfy_dir):
            p["blockers"].append(f"{comfy_dir} exists and is not empty (and is not a ComfyUI checkout)")
        else:
            p["steps"].append(f"clone {manifest['comfyui']['repo']} at {manifest['comfyui']['commit'][:10]} "
                              f"(ComfyUI {manifest['comfyui']['version']})")
            p["need_bytes"] += manifest["comfyui"]["repoSizeBytes"]
        gpu = detect_gpu()
        p["gpu"] = gpu
        torch = pick_torch(manifest, gpu)
        if gpu is None:
            p["blockers"].append("no NVIDIA GPU found (nvidia-smi). Image generation needs CUDA; "
                                 "pass --allow-cpu to install CPU torch anyway (very slow)")
            torch = dict(manifest["comfyui"]["torch"]["cpu"], kind="cpu")
        elif torch is None:
            p["blockers"].append(f"driver supports CUDA {gpu['cuda']}; need 12.6+ (13.0+ recommended). "
                                 "Update the NVIDIA driver")
        else:
            if torch["kind"] == "cuda" and version_tuple(gpu["cuda"]) < (13, 0):
                p["warnings"].append(f"driver supports CUDA {gpu['cuda']}: using {torch['index'].rsplit('/', 1)[-1]}. "
                                     "ComfyUI recommends cu130 (driver 580+) on RTX 20-series and newer")
            if gpu["vram_mb"] < 11000:
                p["warnings"].append(f"{gpu['vram_mb'] // 1024} GB VRAM: set comfyui.profile to \"8gb\" "
                                     "in team.config.json (see artgen/README.md)")
        p["torch"] = torch
        venv_py = venv_python(comfy_dir)
        if os.path.isfile(venv_py):
            p["steps"].append(f"venv exists ({venv_py}): keep it")
        else:
            uv = shutil.which("uv")
            p["venv_tool"] = "uv" if uv else "venv"
            if uv:
                p["steps"].append(f"create venv with uv (Python {manifest['comfyui']['python']['recommended']}, "
                                  "uv fetches it if needed)")
            else:
                v = f"{sys.version_info.major}.{sys.version_info.minor}"
                if v not in manifest["comfyui"]["python"]["supported"]:
                    p["blockers"].append(f"this Python is {v}; run the installer with Python 3.11-3.13, "
                                         "or install uv (https://docs.astral.sh/uv/)")
                p["steps"].append(f"create venv with {sys.executable} (Python {v})")
            p["need_bytes"] += manifest["comfyui"]["venvSizeBytes"]
        if torch:
            p["steps"].append(f"install {torch['pin']} from {torch['index']}")
        p["steps"].append("install requirements.txt and manager_requirements.txt")

    # Models
    cache = load_cache()
    todo, have = [], []
    for m in ([] if skip_models else select_models(manifest, with_extras, no_optional)):
        path = model_path(m, comfy_dir)
        if os.path.isfile(path) and os.path.getsize(path) == m["size"]:
            have.append(m["file"])
            continue
        todo.append(m)
    p["models_present"] = have
    p["models_to_download"] = [{"file": m["file"], "size": m["size"], "gated": m["gated"],
                                "dest": model_path(m, comfy_dir)} for m in todo]
    p["download_bytes"] = sum(m["size"] for m in todo)
    p["need_bytes"] += p["download_bytes"]
    for m in todo:
        p["steps"].append(f"download {m['file']} ({gb(m['size'])}{', gated' if m['gated'] else ''})")
    gated = [m for m in todo if m["gated"]]
    p["hf_token"] = "present" if hf_token() else "missing"
    if gated:
        access = check_gated_access(gated[0]["url"], hf_token())
        p["gated_access"] = access
        if access != "ok":
            reason = {"no-token": "no Hugging Face token (HF_TOKEN)",
                      "bad-token": "the Hugging Face token was rejected",
                      "not-accepted": "the FLUX Klein licence has not been accepted for this account"}.get(access, access)
            p["blockers"].append(f"{reason}.\n{GATED_HELP}")

    # Disk (ComfyUI drive and, for project models, the repo drive)
    comfy_need = p["need_bytes"] - sum(m["size"] for m in todo if m["location"] == "project")
    proj_need = sum(m["size"] for m in todo if m["location"] == "project")
    for where, need in ((comfy_dir, comfy_need), (PROJECT_MODELS, proj_need)):
        if need <= 0:
            continue
        free = free_bytes(where)
        if free < need + 2 * GB:
            p["blockers"].append(f"not enough disk at {where}: need {gb(need)} + 2 GB margin, free {gb(free)}")
    p["free_bytes"] = free_bytes(comfy_dir)
    return p


def print_plan(p):
    log(f"Plan for {p['path']}:")
    for s in p["steps"]:
        log(f"  - {s}")
    if p.get("models_present"):
        log(f"  - already present: {', '.join(p['models_present'])}")
    log(f"Download: {gb(p['download_bytes'])}.  Disk needed: {gb(p['need_bytes'])}.  Free: {gb(p['free_bytes'])}.")
    for w in p["warnings"]:
        log(f"WARNING: {w}")
    for b in p["blockers"]:
        log(f"BLOCKED: {b}")


def pip_install(venv_py, args):
    uv = shutil.which("uv")
    if uv:
        run([uv, "pip", "install", "--python", venv_py] + args)
    else:
        run([venv_py, "-m", "pip", "install"] + args)


def execute(p, manifest, full_install):
    comfy_dir = p["path"]
    t0 = time.time()
    if full_install:
        c = manifest["comfyui"]
        if not os.path.isfile(os.path.join(comfy_dir, "main.py")):
            log("\n== Clone ComfyUI")
            run(["git", "clone", "--filter=blob:none", c["repo"], comfy_dir])
            run(["git", "-C", comfy_dir, "checkout", "-B", "website-team-pinned", c["commit"]])
        venv_py = venv_python(comfy_dir)
        if not os.path.isfile(venv_py):
            log("\n== Create venv")
            if p.get("venv_tool") == "uv":
                run([shutil.which("uv"), "venv", "--seed", "--python", c["python"]["recommended"],
                     os.path.join(comfy_dir, "venv")])
            else:
                run([sys.executable, "-m", "venv", os.path.join(comfy_dir, "venv")])
                run([venv_py, "-m", "pip", "install", "--upgrade", "pip"])
        torch = p["torch"]
        have_torch = subprocess.run([venv_py, "-c", "import torch"], capture_output=True).returncode == 0
        if have_torch:
            log("\n== torch already installed: keeping it")
        else:
            log(f"\n== Install torch ({torch['index'].rsplit('/', 1)[-1]})")
            pip_install(venv_py, torch["pin"].split() + ["--index-url", torch["index"]])
        log("\n== Install ComfyUI requirements")
        reqs = []
        for r in c["requirements"]:
            reqs += ["-r", os.path.join(comfy_dir, r)]
        pip_install(venv_py, reqs + ["--extra-index-url", torch["index"]])
    log("\n== Download models")
    cache = load_cache()
    token = hf_token()
    by_file = {m["file"]: m for m in manifest["models"]}
    for i, d in enumerate(p["models_to_download"], 1):
        m = by_file[d["file"]]
        log(f"  [{i}/{len(p['models_to_download'])}] {m['file']} ({gb(m['size'])}) -> {d['dest']}")
        download(m, d["dest"], token if m["gated"] else None, cache)
    log(f"\nDone in {(time.time() - t0) / 60:.1f} min.")
    return {"status": "ok", "path": comfy_dir, "python": venv_python(comfy_dir),
            "downloaded": [d["file"] for d in p["models_to_download"]], "minutes": round((time.time() - t0) / 60, 1)}


# ---------------------------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    mode = ap.add_mutually_exclusive_group(required=True)
    mode.add_argument("--verify", metavar="DIR", help="check an existing install")
    mode.add_argument("--install", metavar="DIR", help="install ComfyUI, venv, torch, requirements and models")
    mode.add_argument("--models-only", metavar="DIR", help="download missing models into an existing install")
    ap.add_argument("--quick", action="store_true", help="verify: sizes only, no hashing, no torch import")
    ap.add_argument("--python", help="verify: venv python to probe (default: team.config.json or <dir>/venv)")
    ap.add_argument("--dry-run", action="store_true", help="show the plan, sizes and disk check; change nothing")
    ap.add_argument("--yes", "-y", action="store_true", help="do not ask for confirmation")
    ap.add_argument("--with-extras", action="store_true", help="also the depth model and ControlNet (8 GB)")
    ap.add_argument("--no-optional", action="store_true", help="skip optional models (4x-UltraSharp)")
    ap.add_argument("--skip-models", action="store_true", help="install: engine, venv and packages only")
    ap.add_argument("--allow-cpu", action="store_true", help="install without an NVIDIA GPU (CPU torch)")
    ap.add_argument("--json", action="store_true", help="print a JSON result to stdout")
    args = ap.parse_args()
    manifest = load_manifest()

    if args.verify:
        res = verify(args.verify, manifest, quick=args.quick, python=args.python, with_extras=args.with_extras)
        print_verify(res)
        if args.json:
            print(json.dumps(res, indent=1))
        sys.exit({"green": 0, "amber": 3, "red": 1}[res["status"]])

    full = bool(args.install)
    target = args.install or args.models_only
    p = plan(target, manifest, full, args.with_extras, args.no_optional, args.skip_models and full)
    if args.allow_cpu:
        p["blockers"] = [b for b in p["blockers"] if not b.startswith("no NVIDIA GPU")]
    print_plan(p)
    if args.dry_run or p["blockers"]:
        if args.json:
            print(json.dumps(dict(p, status="blocked" if p["blockers"] else "dry-run"), indent=1, default=str))
        sys.exit(1 if p["blockers"] else 0)
    if not p["models_to_download"] and not full:
        log("Nothing to download.")
        if args.json:
            print(json.dumps({"status": "ok", "path": p["path"], "downloaded": []}))
        return
    if not args.yes:
        if not sys.stdin.isatty():
            sys.exit("not interactive: pass --yes to proceed")
        if input("Proceed? [y/N] ").strip().lower() not in ("y", "yes"):
            sys.exit("cancelled")
    res = execute(p, manifest, full)
    if args.json:
        print(json.dumps(res, indent=1))


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        log("\ninterrupted; run the same command again to resume downloads")
        sys.exit(130)
