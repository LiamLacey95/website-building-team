"""Where this machine's ComfyUI lives: read from team.config.json at the repo root (stdlib only).

  {"comfyui": {"path": "...", "python": "...", "port": 8188, "profile": "12gb"}}

Only comfyui.path is required. Environment overrides (handy for CI and worktrees): TEAM_CONFIG (path to the config
file), COMFYUI_PATH, COMFYUI_PYTHON, COMFYUI_PORT, COMFYUI_PROFILE.
"""
import json
import os

ARTGEN = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(ARTGEN)
CONFIG_FILE = os.environ.get("TEAM_CONFIG") or os.path.join(REPO, "team.config.json")
PROFILES = ("12gb", "8gb")


class ConfigError(Exception):
    pass


def python_candidates(comfy_path):
    """Same search order as scripts/bootstrap.mjs uses when comfyui.python is blank."""
    if os.name == "nt":
        return [os.path.join(comfy_path, "venv", "Scripts", "python.exe"),
                os.path.join(comfy_path, ".venv", "Scripts", "python.exe"),
                os.path.join(comfy_path, "python_embeded", "python.exe"),
                os.path.join(os.path.dirname(comfy_path), "python_embeded", "python.exe")]  # portable build layout
    return [os.path.join(comfy_path, "venv", "bin", "python"), os.path.join(comfy_path, ".venv", "bin", "python")]


def default_python(comfy_path):
    cands = python_candidates(comfy_path)
    return next((c for c in cands if os.path.isfile(c)), cands[0])


def load(require_path=True):
    """Return {'path', 'python', 'port', 'host', 'url', 'profile', 'source'}."""
    raw = {}
    source = None
    if os.path.isfile(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, encoding="utf-8") as f:
                raw = json.load(f).get("comfyui") or {}
            source = CONFIG_FILE
        except ValueError as e:
            raise ConfigError(f"{CONFIG_FILE} is not valid JSON: {e}")
    path = os.environ.get("COMFYUI_PATH") or raw.get("path")
    if not path and require_path:
        raise ConfigError(
            f"no ComfyUI location: {CONFIG_FILE} is missing or has no comfyui.path. "
            "Run `node scripts/bootstrap.mjs` (or copy team.config.example.json to team.config.json and set "
            "comfyui.path), or set COMFYUI_PATH.")
    path = os.path.abspath(os.path.expanduser(path)) if path else None
    python = os.environ.get("COMFYUI_PYTHON") or raw.get("python") or (default_python(path) if path else None)
    try:
        port = int(os.environ.get("COMFYUI_PORT") or raw.get("port") or 8188)
    except ValueError:
        raise ConfigError("comfyui.port must be a number")
    profile = (os.environ.get("COMFYUI_PROFILE") or raw.get("profile") or "12gb").lower()
    if profile not in PROFILES:
        raise ConfigError(f"comfyui.profile must be one of {PROFILES}, not {profile!r}")
    host = "127.0.0.1"
    return {"path": path, "python": python, "port": port, "host": host, "url": f"http://{host}:{port}",
            "profile": profile, "source": source or "environment"}
