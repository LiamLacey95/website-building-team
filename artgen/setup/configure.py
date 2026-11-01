"""Write this machine's ComfyUI launchers from team.config.json (stdlib only).

  python artgen/setup/configure.py            validate the config and (re)write the launchers
  python artgen/setup/configure.py --check    validate only; exit 1 if the config is broken or launchers are stale
  add --json for a machine-readable result on stdout

Templates (committed): artgen/setup/templates/*.tmpl. Generated (git-ignored):
  Windows  artgen/Launch ComfyUI (Website).bat, artgen/Launch ComfyUI (Website, headless).bat
  Linux    artgen/launch-comfyui.sh, artgen/launch-comfyui-headless.sh
artgen/extra_model_paths.yaml is committed as is: it only uses paths relative to itself.
"""
import argparse
import json
import os
import stat
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ARTGEN = os.path.dirname(HERE)
sys.path.insert(0, ARTGEN)
import comfy_config  # noqa: E402

TEMPLATES = os.path.join(HERE, "templates")
LAUNCHERS = {
    "nt": [("launch.bat.tmpl", "Launch ComfyUI (Website).bat"),
           ("launch-headless.bat.tmpl", "Launch ComfyUI (Website, headless).bat")],
    "posix": [("launch.sh.tmpl", "launch-comfyui.sh"),
              ("launch-headless.sh.tmpl", "launch-comfyui-headless.sh")],
}


def render(template, cfg):
    with open(os.path.join(TEMPLATES, template), encoding="utf-8") as f:
        text = f.read()
    path, python = cfg["path"], cfg["python"]
    if template.endswith(".bat.tmpl"):
        path, python = os.path.normpath(path), os.path.normpath(python)
    else:
        path, python = path.replace("\\", "/"), python.replace("\\", "/")
    for k, v in {"COMFYUI_PATH": path, "COMFYUI_PYTHON": python, "PORT": str(cfg["port"])}.items():
        text = text.replace("{{" + k + "}}", v)
    newline = "\r\n" if template.endswith(".bat.tmpl") else "\n"
    return text.replace("\r\n", "\n").replace("\n", newline)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--check", action="store_true", help="validate only, write nothing")
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()

    checks = []

    def add(item, status, detail):
        checks.append({"item": item, "status": status, "detail": detail})

    cfg = None
    try:
        cfg = comfy_config.load()
        add("config", "ok", f"{cfg['source']}: path {cfg['path']}, port {cfg['port']}, profile {cfg['profile']}")
    except comfy_config.ConfigError as e:
        add("config", "error", str(e))
    if cfg:
        if not os.path.isfile(os.path.join(cfg["path"], "main.py")):
            add("comfyui.path", "error", f"no ComfyUI at {cfg['path']} (main.py missing)")
        if not os.path.isfile(cfg["python"]):
            add("comfyui.python", "error", f"not found: {cfg['python']}")
        if not os.path.isfile(os.path.join(ARTGEN, "extra_model_paths.yaml")):
            add("extra_model_paths.yaml", "error", "artgen/extra_model_paths.yaml is missing")
        for template, name in LAUNCHERS["nt" if os.name == "nt" else "posix"]:
            dest = os.path.join(ARTGEN, name)
            text = render(template, cfg)
            current = None
            if os.path.isfile(dest):
                with open(dest, encoding="utf-8", newline="") as f:
                    current = f.read()
            if current == text:
                add(name, "ok", "up to date")
            elif args.check:
                add(name, "error", "missing or out of date: run python artgen/setup/configure.py")
            else:
                with open(dest, "w", encoding="utf-8", newline="") as f:
                    f.write(text)
                if os.name != "nt":
                    os.chmod(dest, os.stat(dest).st_mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)
                add(name, "ok", "written")

    status = "red" if any(c["status"] == "error" for c in checks) else "green"
    for c in checks:
        print(f"  [{'OK  ' if c['status'] == 'ok' else 'FAIL'}] {c['item']}: {c['detail']}", file=sys.stderr)
    print(f"Result: {status.upper()}", file=sys.stderr)
    if args.json:
        print(json.dumps({"status": status, "comfyui": cfg, "checks": checks}, indent=1))
    sys.exit(0 if status == "green" else 1)


if __name__ == "__main__":
    main()
