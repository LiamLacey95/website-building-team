# tools/

Front-end tooling for the team: screenshots, contact sheets, and variant worktrees. Owned by the Front-end design agent.

All scripts are Node ESM (Node 20+; tested on Node 24.11). Run them from anywhere in the repo or a worktree. Relative paths resolve against the **main repo root** (`F:\ArtGen\Website Test`), even when the command runs inside a worktree.

## Install

```bash
cd tools
npm install                # Playwright, under tools/ only
npm run install-browsers   # = npx playwright install chromium (one-off per machine)
```

## screenshot.mjs

Full-page screenshots of a running site at 390, 768, 1440 and 1920 px. The script forces `prefers-reduced-motion: reduce` and disables CSS animations. Before each capture it waits for network idle, `document.fonts.ready`, and every `<img>` to load (it scrolls the page first so lazy images load).

```bash
node tools/screenshot.mjs --base http://127.0.0.1:4321 --routes home,about
node tools/screenshot.mjs --base http://127.0.0.1:4322 --routes home --label variant/g3-b-editorial --out design/screenshots/g3
```

| Flag | Default | Meaning |
|---|---|---|
| `--base` | required | Base URL of the running site |
| `--routes` | `/` | Comma-separated. The leading slash is optional; `home` means `/` |
| `--out` | `design/screenshots/<YYYY-MM-DD>/` | Output folder |
| `--label` | current git branch | Branch or variant name used in file names |
| `--widths` | `390,768,1440,1920` | Comma-separated |
| `--motion` | off | Don't force reduced motion |
| `--allow-errors` | off | Capture pages that answer HTTP 4xx/5xx (by default these count as failures) |
| `--timeout` | `45000` | Navigation timeout per page, in ms |

Output files are named `<HHMM>-<label>-<route>-<width>.png` (for example `1149-variant-g3-a-bold-grid-home-390.png`). Each run also appends an entry per shot to `<out>/manifest.json`. The exit code is 1 if any shot failed.

> **Git Bash gotcha:** in Git Bash, a bare `/` argument is rewritten to `C:/Program Files/Git/`. Use `--routes home`, or set `MSYS_NO_PATHCONV=1`. The script detects the rewrite and stops with an error.

## contact-sheet.mjs

Takes a folder of screenshots (searched recursively) and writes one self-contained HTML page. The page has one section per route, one row per width inside each section, and the variants side by side within each row. Every card shows the variant name, the width and the capture time, scrolls within a fixed-height frame, and links to the full PNG. Images use relative paths. The page has no JS, no external assets, and supports light and dark themes.

```bash
node tools/contact-sheet.mjs --in design/screenshots/g3 --title "Gate 3: design variations" --widths 1440,390 --latest
node tools/contact-sheet.mjs --in design/screenshots/g3 --out .team/gates/G3-design/contact-sheet.html
```

| Flag | Default | Meaning |
|---|---|---|
| `--in` | required | Screenshot folder |
| `--out` | `<in>/contact-sheet.html` | Output HTML file. Image paths are made relative to it |
| `--title` | `Contact sheet: <folder>` | Page title |
| `--widths` | all widths, widest first | Which widths to include, and in what order |
| `--latest` | off | Keep only the newest shot per variant, route and width |

Metadata comes from `manifest.json`. For PNGs without a manifest entry, the script parses the file name. That fallback can't recover nested routes: `about-team` stays a single token.

## variants.mjs

Creates, lists, serves and removes design-variant worktrees, following the playbook naming:

- **Worktree path:** `F:\ArtGen\Website Test.worktrees\variant-<gate>-<letter>-<slug>`
- **Branch:** `variant/<gate>-<letter>-<slug>`
- **Ports:** A 4321, B 4322, C 4323, and so on (4321 plus the letter's offset)

```bash
node tools/variants.mjs create a bold-grid          # from master; also writes design/variants/a-bold-grid.md stub in the worktree
node tools/variants.mjs create b editorial --from <commit> --no-doc
node tools/variants.mjs list
node tools/variants.mjs dev a                       # foreground, Ctrl+C stops
node tools/variants.mjs dev all                     # every g3 variant, each on its port, logs prefixed [g3-a] ...
node tools/variants.mjs port c                      # -> 4323
node tools/variants.mjs remove a                    # refuses if the worktree has uncommitted files or the branch is unmerged
node tools/variants.mjs remove a --force            # discard work, delete branch with -D
node tools/variants.mjs remove a --keep-branch      # drop the worktree, keep the branch
```

- `--gate g3` is the default. Pass `--gate g4` and so on for other rounds.
- **`dev` behaviour:** if `<worktree>/web/package.json` has a `dev` script, `dev` runs `npm run dev -- --port <port> --host 127.0.0.1` in `web/`. That works for Astro, Vite and Next.
- **Static fallback:** otherwise `dev` serves a static folder with a built-in server: `<worktree>/web`, or the worktree root if there is no `web/`. Pass `--static <dir>` to choose the folder yourself.
- **Custom command:** `--cmd "<command>"` overrides the command. It runs in the worktree root with `PORT` set.
- **Stopping:** on Windows, stopping kills the whole process tree with `taskkill /T`.
- For agents, run `dev` as a background task, take screenshots, then stop the task.

## Typical Gate 3 loop

```bash
node tools/variants.mjs create a <slug>; node tools/variants.mjs create b <slug>; node tools/variants.mjs create c <slug>
# ...build each variant in its worktree, commit there...
node tools/variants.mjs dev all          # background
node tools/screenshot.mjs --base http://127.0.0.1:4321 --routes home,<interior> --label variant/g3-a-<slug> --out design/screenshots/g3
node tools/screenshot.mjs --base http://127.0.0.1:4322 --routes home,<interior> --label variant/g3-b-<slug> --out design/screenshots/g3
node tools/screenshot.mjs --base http://127.0.0.1:4323 --routes home,<interior> --label variant/g3-c-<slug> --out design/screenshots/g3
node tools/contact-sheet.mjs --in design/screenshots/g3 --title "Gate 3" --widths 1440,390 --latest
```

Milestone shots for the visual history go to the default `design/screenshots/<YYYY-MM-DD>/`, so you only need to pass `--base` and `--routes`.

## lib.mjs

Shared helpers: argument parser, git wrapper, repo-root detection that also works in worktrees, slugs and timestamps.
