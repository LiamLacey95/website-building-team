# tools/

Front-end tooling for the team: screenshots, contact sheets, variant worktrees, the Impeccable hook gate, and a selftest. Owned by the Front-end design agent.

All scripts are Node ESM (Node 20+, tested on 24.11). Run them from the repo root or from inside a worktree. Relative paths resolve against the **main repo root**, even when the command runs in a worktree.

Nothing here hard-codes a machine path. Machine-specific settings come from `team.config.json` at the repo root. Every key is optional:

| Key | Used by | Default |
|---|---|---|
| `worktreesDir` | `variants.mjs`, `selftest.mjs` | sibling folder `<repo-folder>.worktrees`. A relative value resolves from the repo root |
| `activeProject` | default `--project` for `variants.mjs` and `screenshot.mjs` | none, so pass `--project <slug>` |
| `variantBasePort` | ports for variants A, B, C... | `4321` (A 4321, B 4322, C 4323) |

## Install and check

```bash
cd tools && npm ci && npx playwright install chromium && cd ..
node tools/selftest.mjs        # about 75 s; exit 0 = all good
```

`scripts/bootstrap.mjs` runs these for you. See [Impeccable](#impeccable) for the design skill.

## selftest.mjs

One command that proves the tooling works on this machine. It runs these steps:

1. Creates a temporary variant worktree with `variants.mjs create`.
2. Writes a throwaway page into it and serves it with `variants.mjs dev`.
3. Takes 4-width screenshots into the OS temp folder.
4. Builds a contact sheet and checks that every image link resolves.
5. Checks Impeccable:
   - `npx impeccable detect` is clean on the page and catches a planted bad fixture.
   - The skill launcher answers.
   - The hook gate flags a site edit and stays silent on other edits.
6. Removes the worktree, the branch and the temp files.

Each step prints PASS or FAIL. The exit code is 1 if anything fails, and cleanup runs regardless.

```bash
node tools/selftest.mjs [--skip-impeccable] [--keep] [--letter z]
```

It uses project `kit-selftest`, letter `z` (port 4346), and nothing in the main checkout.

## screenshot.mjs

Full-page screenshots at 390, 768, 1440 and 1920 px. The script forces `prefers-reduced-motion: reduce`, disables CSS animations, and emulates a touch device below 1024 px. Before each capture it waits for network idle, `document.fonts.ready` and every `<img>` (it scrolls the page first so lazy images load).

```bash
node tools/screenshot.mjs --base http://127.0.0.1:4321 --routes home,about                 # -> projects/<activeProject>/screenshots/<date>/
node tools/screenshot.mjs --base http://127.0.0.1:4322 --routes home --label variant/how-it-works-g3-b-editorial \
  --out projects/how-it-works/screenshots/g3
```

| Flag | Default | Meaning |
|---|---|---|
| `--base` | required | Base URL of the running site. Its path is kept, so with an Astro `base` pass e.g. `http://127.0.0.1:4321/website-building-team` |
| `--routes` | `/` | Comma-separated. The leading slash is optional; `home` means `/` |
| `--out` | `projects/<slug>/screenshots/<YYYY-MM-DD>/` | Output folder |
| `--project` | `activeProject` | Project used for the default `--out` |
| `--label` | current git branch | Branch or variant name used in file names |
| `--widths` | `390,768,1440,1920` | Comma-separated |
| `--motion` | off | Don't force reduced motion |
| `--allow-errors` | off | Capture pages that answer HTTP 4xx/5xx (by default these count as failures) |
| `--timeout` | `45000` | Navigation timeout per page, in ms |

Output files are named `<HHMM>-<label>-<route>-<width>.png`. Each run also appends an entry per shot to `<out>/manifest.json`. The exit code is 1 if any shot failed.

> **Git Bash:** in Git Bash, a bare `/` argument is rewritten to `C:/Program Files/Git/`. Use `--routes home`. The script detects the rewrite and stops with a hint.

## contact-sheet.mjs

Takes a folder of screenshots (searched recursively) and writes one self-contained HTML page. The page has one section per route, one row per width inside each section, and the variants side by side within each row. Each card is labelled and links to the full PNG. Images use relative paths, and the page has no JS.

```bash
node tools/contact-sheet.mjs --in projects/how-it-works/screenshots/g3 --title "Gate 3" --widths 1440,390 --latest \
  --out projects/how-it-works/gates/G3-design/contact-sheet.html
```

| Flag | Default | Meaning |
|---|---|---|
| `--in` | required | Screenshot folder |
| `--out` | `<in>/contact-sheet.html` | Output HTML file. Image paths are made relative to it |
| `--title` | `Contact sheet: <folder>` | Page title |
| `--widths` | all widths, widest first | Which widths to include, and in what order |
| `--latest` | off | Keep only the newest shot per variant, route and width |

Metadata comes from `manifest.json`. For PNGs without a manifest entry, the script parses the file name.

## variants.mjs

Design-variant worktrees, following the playbook naming:

- **Branch:** `variant/<project>-<gate>-<letter>-<name>`, for example `variant/how-it-works-g3-a-bold-grid`
- **Worktree folder:** `<worktreesDir>/variant-<project>-<gate>-<letter>-<name>`
- **Ports:** A 4321, B 4322, C 4323

```bash
node tools/variants.mjs create a bold-grid         # from HEAD of the main checkout (the shared base); writes
                                                   # projects/<slug>/variants/a-bold-grid.md stub in the worktree
node tools/variants.mjs create b editorial --from <commit> --no-doc
node tools/variants.mjs list [--project <slug>]
node tools/variants.mjs dev a                      # foreground; Ctrl+C stops
node tools/variants.mjs dev all                    # every variant of the project and gate, logs prefixed [g3-a]
node tools/variants.mjs port c                     # -> 4323
node tools/variants.mjs path a                     # worktree path
node tools/variants.mjs remove a                   # refuses if there are uncommitted files or the branch is unmerged
node tools/variants.mjs remove a --force           # discard work, delete branch with -D
node tools/variants.mjs remove a --keep-branch
```

- `--project` defaults to `activeProject`, and `--gate` defaults to `g3`.
- **`dev` behaviour:** `dev` serves `<worktree>/projects/<project>/web`. If that folder's `package.json` has a `dev` script, `dev` runs `npm run dev -- --port <port> --host 127.0.0.1`, which works for Astro, Vite and Next.
- **Static fallback:** otherwise `dev` serves the folder statically. `--static [dir]` serves a subfolder such as `dist` instead.
- **Custom command:** `--cmd "<command>"` overrides the command. It runs in `web/` with `PORT` set.
- **Stopping:** on Windows, stopping kills the whole process tree.
- For agents, run `dev` as a background task, take screenshots, then stop the task.

## Typical Gate 3 loop

```bash
node tools/variants.mjs create a <name>; node tools/variants.mjs create b <name>; node tools/variants.mjs create c <name>
# build each variant in its worktree (projects/<slug>/web), with Impeccable: shape -> build -> critique -> detect; commit there
node tools/variants.mjs dev all                                                    # background
# how-it-works uses Astro base '/website-building-team': add it to every --base below, e.g. http://127.0.0.1:4321/website-building-team
node tools/screenshot.mjs --base http://127.0.0.1:4321 --routes home,<interior> --label variant/<slug>-g3-a-<name> --out projects/<slug>/screenshots/g3
node tools/screenshot.mjs --base http://127.0.0.1:4322 --routes home,<interior> --label variant/<slug>-g3-b-<name> --out projects/<slug>/screenshots/g3
node tools/screenshot.mjs --base http://127.0.0.1:4323 --routes home,<interior> --label variant/<slug>-g3-c-<name> --out projects/<slug>/screenshots/g3
node tools/contact-sheet.mjs --in projects/<slug>/screenshots/g3 --title "Gate 3" --widths 1440,390 --latest
```

## Impeccable

[Impeccable](https://impeccable.style) 4.8.0 (Apache-2.0) is installed at project scope and committed:

| Path | What |
|---|---|
| `.claude/skills/impeccable/` | Skill for Claude Code (`/impeccable <command>`) |
| `.agents/skills/impeccable/` | Skill for Codex (`$impeccable <command>`) |
| `.claude/agents/impeccable-*.md` | 4 Claude subagents the skill spawns (documenter, finish reviewer, asset producer, manual-edit applier) |
| `.impeccable/config.json` | Shared detector and hook config: hook on, quiet mode |
| `.claude/settings.json`, `.codex/hooks.json` | The team hook gate (see below) |

- **Engine binary:** the skill's launcher (`scripts/impeccable`, or `impeccable.cmd` on Windows without `sh`) runs a self-contained engine binary. It downloads the binary once into `~/.impeccable/` and verifies it against `engine-checksums.txt`. Binaries are platform-specific and git-ignored.
- **Pinned CLI:** `tools/package.json` also pins the `impeccable` npm CLI, so `npx impeccable detect` from `tools/` is versioned. From the repo root, npx can pick up a stale global install instead.

**Install or repair** (only needed if the committed skill is missing or you are upgrading; run from the repo root):

```bash
npx --yes impeccable@4.8.0 install --scope=project --providers=claude,codex --no-hooks -y --force
sh .claude/skills/impeccable/scripts/impeccable --version     # warms the engine; prints 4.8.0
```

Always pass `--no-hooks` and pin the version:

- **Why `--no-hooks`:** without it, the installer writes its ungated hook into `.claude/settings.local.json`.
- **Why pin the version:** a bare `npx impeccable` can resolve to an old global 2.x, which ignores these flags and installs into 13 harnesses.

**Detect** (deterministic anti-pattern scan; exit 2 when there are findings):

```bash
cd tools && npx impeccable detect ../projects/<slug>/web            # or --json, or a URL: http://127.0.0.1:4321/
sh .claude/skills/impeccable/scripts/impeccable detect projects/<slug>/web   # same engine, via the skill launcher
```

**Project context:** in this kit, `PRODUCT.md` and `DESIGN.md` live in `projects/<slug>/`, not the repo root. When running a skill command or `impeccable context`, either pass `--target projects/<slug>/web/<file>` or run from `projects/<slug>/`. Impeccable then treats `projects/<slug>` as the project root and finds that project's files. Without a target it looks at the repo root and reports `NO_PRODUCT_MD`.

**Telemetry: off by default in this kit** (PM decision). The CLI would otherwise send anonymous usage pings for its live and generate features (no project names or code). It is set in four places, so it stays off however Impeccable is run:

| Where | How |
|---|---|
| Claude Code sessions, hooks included | `"env": {"IMPECCABLE_NO_TELEMETRY": "1"}` in `.claude/settings.json` |
| Codex | `[shell_environment_policy] set` in `.codex/config.toml`, applied once Codex trusts the project |
| Hook gate and selftest | `impeccable-hook.mjs` and `selftest.mjs` set the variable for every engine call |
| Each machine | `scripts/bootstrap.mjs` runs `impeccable telemetry off`, which writes `"telemetry": false` to `~/.impeccable/config.json`. This also covers commands run in a plain terminal |

Check with `sh .claude/skills/impeccable/scripts/impeccable telemetry status`.

### The hook gate: `impeccable-hook.mjs`

Impeccable's design-detector hook normally runs on every Edit or Write in the repo. That would include Backend's `server/*.ts`, Review's tools and Concept's files: about 1 to 3 s per edit, with design nags on non-site code. Its hook also ignores files outside its working directory, so edits in variant worktrees would go unscanned.

The committed hooks therefore call `node tools/impeccable-hook.mjs`, which works like this:

- **Site edits:** it forwards only edits to `projects/<slug>/web/**`, in the main repo or any variant worktree. It points the hook at the checkout that owns the file, so worktree edits are checked against that worktree's config.
- **Everything else:** other edits exit silently in about 0.2 s.
- **On Stop:** it runs Impeccable's full-rule deep pass, but only in sessions that edited site files.
- **Never blocks:** any error exits 0.

Turning it off:

- For one shell: set `IMPECCABLE_HOOK_DISABLED=1`.
- For the project: run `sh .claude/skills/impeccable/scripts/impeccable hooks off`, then commit `.impeccable/config.json`.

Don't run `impeccable hooks on` or `impeccable doctor --fix`. They re-add Impeccable's ungated manifest to `.claude/settings.local.json`; if that happens, delete that file's `hooks` block.

Because Impeccable can't see the gate, `impeccable context` reports `MANUAL_DETECTOR_REQUIRED` ("run detect once at the end"). That matches the playbook rule: run detect before any gate screenshot.

**Harness pickup:** Claude Code reads skills and hooks at session start. Threads started before the install need a restart before `/impeccable` and the hook work. Codex asks once, via `/hooks`, to approve project hooks.

## Other files

- **`lib.mjs`:** shared helpers: argument parser, git wrapper, repo-root detection (works in worktrees), config loader, slugs and timestamps.
- **`impeccable-hook.mjs`:** the hook gate described above.
