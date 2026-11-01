# Report 06-kit-fixes (Concept)

State: DONE.

## Fixes

1. **MINOR 5:** `artgen/setup/README.md` example config now uses the placeholder `D:/AI/ComfyUI`; no machine path remains. I checked every tracked file under `artgen/` for `F:/ArtGen`, `F:\ArtGen` and the user name. The only remaining hit is `artgen/setup/.hashcache.json`, which is git-ignored.
2. **NIT:** the `artgen/generate.py` usage comment now says `projects/<slug>/concepts/...`.
3. **"No GPU" section:** text below, for the PM to paste into `.team/roles/concept.md`. To make its last sentence true, `generate.py --smoke` now prints `Smoke test: SKIPPED (no comfyui.path ...)` and exits 0 when `comfyui.path` is unset. Before this it exited 1 with a config error. Both READMEs say so.

Found while testing item 3, and fixed:
- `--smoke --dry-run` used to try a real run and leave a `smoke.json` stuck at `"running"`. It is now rejected as a usage error (exit 2).
- `--smoke` now records any unexpected error (not only `SystemExit`) as `"failed"` in `smoke.json`.

Tests:
- `--smoke` with a config that has no `comfyui.path` prints SKIPPED and exits 0.
- A normal command without `comfyui.path` still fails with the bootstrap hint.
- `--smoke --dry-run` exits 2.
- `py_compile` passes.

## "No GPU" section for roles/concept.md

```markdown
## No GPU (bootstrap --skip-comfyui)

Without an NVIDIA GPU there is no ComfyUI: `comfyui.path` is unset and `generate.py --smoke` prints SKIPPED. Concept still delivers three directions at Gate 2, art-directed instead of generated:
- palette with contrast checks, type pairing, shape language and `style-tile.html`, as usual;
- an HTML/CSS style frame built from the style tile, replacing the WEB4 mood image;
- key art, texture and pattern made with code: SVG/CSS patterns, gradients, `feTurbulence` grain, geometric or typographic compositions;
- licensed stock photography (Unsplash, Pexels) with a licence log per image (URL, photographer, licence, date) in place of the generation sidecar, colour-graded or duotoned so a set reads as one.
Label the Gate 2 contact sheet honestly: imagery is stock or code-made, not bespoke. If the human wants bespoke key art, the options (rented cloud GPU, image API) and their costs are in `.team/history/2026-11-01-kit-packaging/03-concept-no-gpu-fallback-concept.md`.
```

## Commit

`concept: kit fixes from audit (placeholder path, smoke SKIPPED without ComfyUI)`, committed with a pathspec: `artgen/generate.py`, `artgen/README.md`, `artgen/setup/README.md`, this report.
