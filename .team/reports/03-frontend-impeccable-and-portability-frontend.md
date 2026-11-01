# Report 03-frontend-impeccable-and-portability (Front-end)

State: DONE. Date: 2026-11-01. `node tools/selftest.mjs` passes 9 of 9 checks in about 73 s.

## 1. Impeccable install (project scope, Claude Code and Codex)

**Command used** (from the repo root):
`npx --yes impeccable@4.8.0 install --scope=project --providers=claude,codex --no-hooks -y`

- **Version:** Impeccable 4.8.0, skill metadata 4.8.0, engine 0.1.18.
- **Committed files:**
  - `.claude/skills/impeccable/`: Claude build, invoked as `/impeccable ...`.
  - `.agents/skills/impeccable/`: Codex build, invoked as `$impeccable ...`. The two builds differ per provider.
  - `.claude/agents/impeccable-{documenter,finish-reviewer,asset-producer,manual-edit-applier}.md`: subagents the skill spawns.
- **Not committed:**
  - The platform engine binaries in `scripts/bin/` (about 20 MB each). New `.gitignore` files in `.claude/` and `.agents/` exclude them.
  - Impeccable's per-developer state: `.impeccable/config.local.json` and the hook cache, excluded by `.impeccable/.gitignore`. The CLI only adds these to `.git/info/exclude`, which isn't shared.

**Gotchas found:**
- **Stale global CLI.** This machine has a stale global `impeccable` 2.1.8, which a bare `npx impeccable` resolves to. It has no `--scope`/`--providers` flags. Its `skills install --help` silently ran a real `npx skills add` into 13 harness folders under the current directory. I hit this once in `%TEMP%` and removed what it created. The fix is to always pin `impeccable@4.8.0`. The human may want to run `npm rm -g impeccable`.
- **Pinned in `tools/`.** `tools/package.json` now pins `impeccable` 4.8.0, so `npx impeccable detect` run from `tools/` is versioned and portable: npm picks the right platform engine.
- **Engine download.** The skill launcher (`scripts/impeccable`, or `impeccable.cmd` on Windows without `sh`) downloads its engine into `~/.impeccable/` on first use and verifies it against `engine-checksums.txt`. This needs network access once per machine.
- **Telemetry** is on by default. It sends anonymous pings for the live and generate features (no project names or code). It can be turned off with `impeccable telemetry off` or `IMPECCABLE_NO_TELEMETRY=1`. That's the PM's call.

**Commands available**, all from `SKILL.md` and `reference/*.md`:

| Group | Commands |
|---|---|
| Build | `init` (alias `teach`): writes PRODUCT.md; `shape`: plans UX before code; `document`: writes DESIGN.md from code; `extract`: tokens and components into the design system; `craft`: deprecated |
| Evaluate | `critique`: heuristic UX scoring; `audit`: accessibility, performance, responsive |
| Refine | `polish`, `bolder`, `quieter`, `distill`, `harden`, `onboard` |
| Enhance | `animate`, `colorize`, `typeset`, `layout`, `delight`, `overdrive` |
| Fix | `clarify`, `adapt`, `optimize` |
| Iterate | `live`, `generate` (browser variant pickers) |
| Admin | `hooks`, `pin`, `doctor` |

The skill sorts surfaces into modes: Persuade, Operate, Read and Experience.

**Things the team needs to know:**
- **Where project context lives.** `PRODUCT.md`/`DESIGN.md` live in `projects/<slug>/`. Impeccable only finds them if you pass `--target projects/<slug>/web/<file>` or run from `projects/<slug>/`, which I verified. Without that it looks at the repo root and reports `NO_PRODUCT_MD`.
- **`init` and `shape` interview the user.** The skill says to probe once with a structured question tool, and to infer from the brief (labelling assumptions) only when no answer channel exists. Agents don't talk to the human, so I'll answer the interview from `BRIEF.md` and `research/` and label the assumptions. Anything that needs the human goes to the PM as a QUESTION.
- **The detector is strict.** It flagged a plain warm off-white background (`cream-palette`) on my first test page. Expect justifications in variant files for deliberate choices, or narrow `ignore-value` exceptions with reasons.

## 2. Hooks: enabled, behind a team gate

Impeccable's hook is a PostToolUse step after every Edit or Write, plus a full-rule deep pass on Stop. I tested its raw behaviour in a scratch repo:

- **Never blocks.** It always exits 0.
- **Runs without consent.** It runs even when no local consent file exists.
- **Slow on every edit.** It takes 1 to 3.5 s on every edit of any file, including `.md` and `.py`, and about 3.6 s on Stop even when nothing was touched.
- **Fires on Backend code.** It reported on Backend-style `server/*.ts` when that file contained inline style strings.
- **Misses variant worktrees.** It ignores files outside its working directory, so edits in variant worktrees would go unscanned.
- **Doesn't share across checkouts.** It installs into `.claude/settings.local.json`, which is per user and doesn't reach worktrees or other clones.

**Decision:** enable it, but through `tools/impeccable-hook.mjs`, wired in the committed `.claude/settings.json` and `.codex/hooks.json`.

- **Scope:** it only forwards edits to `projects/<slug>/web/**`, in the main repo or any variant worktree.
- **Worktrees:** it rewrites the hook's `cwd` to the checkout that owns the file, so worktree edits are scanned.
- **Everything else:** other edits exit silently in about 0.2 s, so Concept, Backend, Review, Research and PM see no output.
- **Stop pass:** it runs only for sessions that edited site files, and merges the results when several checkouts were touched.
- **Fail-open:** any error, timeout or missing engine means exit 0.
- **Quiet mode:** `.impeccable/config.json` has `hook.enabled: true` and `quiet: true` (no "clean" acknowledgements).
- **Windows fallback:** `sh` is preferred. The `cmd` fallback handles paths with spaces (this repo's path has one); I tested it with `sh` removed from PATH.
- **Codex:** Codex users must approve project hooks once via `/hooks`.
- **Off switches:** `IMPECCABLE_HOOK_DISABLED=1` for one shell, or `impeccable hooks off` for the project.
- **Don't repair it with `impeccable hooks on` or `doctor --fix`.** They re-add the ungated manifest to `settings.local.json`. I removed the one `hooks on` wrote during evaluation.
- **Side effect:** because Impeccable can't see the gate, `impeccable context` reports `MANUAL_DETECTOR_REQUIRED`, meaning "run detect once at the end". That matches the playbook rule.

## 3. Can I use `/impeccable` in this session?

**No.** Invoking the `impeccable` skill in this thread returns `Unknown skill: impeccable`. Claude Code reads skills and hooks at session start, and this thread started before the install, so the committed hook isn't active here either.

Until the thread is restarted:
- I follow the skill files directly (`SKILL.md`, then the command's `reference/<cmd>.md`).
- I run `impeccable context --target ...` and `detect` through the launcher (`sh .claude/skills/impeccable/scripts/impeccable ...`). Both work in this session.

A fresh Front-end thread gets `/impeccable` natively. The same applies to every thread started before this commit, including Review if it wants `/impeccable critique`.

## 4. Portability of `tools/`

- **No absolute paths.** `grep` finds no machine paths in `tools/`, `.claude/`, `.agents/`, `.codex/` or `.impeccable/`.
- **Config loader.** `lib.mjs` has `loadConfig()`, which reads `team.config.json` at the main repo root (it works from worktrees too). It provides:
  - `worktreesDir`: a relative value resolves from the repo root; the default is the sibling `<repo-folder>.worktrees`.
  - `activeProject`.
  - `variantBasePort`: optional, default 4321.
  - A missing or partial file falls back to the defaults. I tested a custom relative `worktreesDir`, a missing file, and a missing project (clear error, exit 1).
- **`variants.mjs`:**
  - Branches are now `variant/<slug>-g3-<letter>-<name>` and folders `variant-<slug>-g3-<letter>-<name>`.
  - `--project` defaults to `activeProject`.
  - `create` branches from HEAD of the main checkout, so it works whether the default branch is `master` or `main`. It writes the hypothesis stub to `projects/<slug>/variants/<letter>-<name>.md` in the worktree, now with an Impeccable section (shape brief, commands, critique, detect).
  - `dev` serves `projects/<slug>/web` (npm `dev` script or static).
  - New command: `path <letter>`.
- **`screenshot.mjs`:** the default output is now `projects/<slug>/screenshots/<YYYY-MM-DD>/`, with a new `--project` flag.
- **`contact-sheet.mjs`:** only the examples changed.
- **README:** `tools/README.md` is rewritten, including the Impeccable section.

## 5. `tools/selftest.mjs`

It runs these steps in order:
1. Creates a temporary variant worktree (project `kit-selftest`, letter z, port 4346).
2. Writes a static page into it and serves it with `variants.mjs dev`.
3. Takes 4-width screenshots into the OS temp folder.
4. Builds a contact sheet and checks that every image link resolves.
5. Runs `npx impeccable detect` twice: the page must be clean, and a planted bad fixture must trigger `gradient-text`, `side-tab` and `overused-font` with a non-zero exit.
6. Checks that the skill launcher answers.
7. Checks the hook gate: a site edit in the worktree is flagged, while a non-site edit and its Stop stay silent.
8. Cleans up. Cleanup always runs, and the script exits 1 on any failure.

**Testing:**
- **Pass:** `SELFTEST PASSED (9 checks)`.
- **Failure path:** I blocked the port with a server returning HTTP 500. The selftest reported FAIL, exited 1, and still removed the worktree and branch.
- **Flags:** `--skip-impeccable`, `--keep`, `--letter`.

## 6. Bootstrap commands sent to Backend

I messaged Backend directly with these commands:

- `npm ci` and `npx playwright install chromium` in `tools/`.
- Impeccable is committed, so it only needs reinstalling when missing or when `--reinstall` is passed: `npx --yes impeccable@4.8.0 install --scope=project --providers=claude,codex --no-hooks -y --force`.
- Warm the engine with `sh .claude/skills/impeccable/scripts/impeccable --version`, or `impeccable.cmd` on Windows without `sh`.
- For the health check, use `npx --no-install impeccable --version` run in `tools/`, then `node tools/selftest.mjs`.

I also pointed out two problems in `scripts/bootstrap.mjs`. Line about 441 uses an unpinned `npx --yes impeccable install` without `--no-hooks`. The health check uses a bare `npx --yes impeccable --version` at the repo root, which resolves to the stale global 2.1.8 on this machine.

## Incident: I deleted and recreated `team.config.json`

While testing a custom `worktreesDir`, I overwrote `F:\ArtGen\Website Test\team.config.json` and then deleted it. Backend's bootstrap had created it after I last checked, and the file is git-ignored, so git can't restore it.

- **Recreated** in `bootstrap.mjs`'s `writeConfig` shape with the values on record: `activeProject` "how-it-works", the default `worktreesDir`, providers claude and codex, and `comfyui` path `F:/ArtGen/ComfyUI` with its venv python, port 8188 and profile 12gb. The venv python path exists.
- **Backend has been told** and asked to regenerate the file if their run wrote anything different.
- **Lesson:** from now on, all my config tests run against a scratch root.

## Paths outside the playbook's ownership table (please confirm)

These belong to the Impeccable and hook install and nobody else owns them: `.agents/` (Codex skill), `.codex/hooks.json`, `.impeccable/` (detector and hook config), `.claude/settings.json`, `.claude/agents/`, `.claude/.gitignore`. Suggestion: add them to Front-end's kit-level files in the playbook table.

## Suggested playbook tweaks (PM's call)

- **Detect command:** in the Impeccable table, change `npx impeccable detect <path>` to "`npx impeccable detect` run from `tools/`, or `.claude/skills/impeccable/scripts/impeccable detect <path>`", to avoid stale globals.
- **Restart threads:** any thread started before this commit must be restarted to get `/impeccable` and the hook.

## Files

New:
- `tools/selftest.mjs`
- `tools/impeccable-hook.mjs`
- `.claude/skills/impeccable/**`
- `.agents/skills/impeccable/**`
- `.claude/agents/impeccable-*.md`
- `.claude/settings.json`
- `.claude/.gitignore`
- `.agents/.gitignore`
- `.codex/hooks.json`
- `.impeccable/config.json`
- `.impeccable/.gitignore`

Changed:
- `tools/lib.mjs`
- `tools/variants.mjs`
- `tools/screenshot.mjs`
- `tools/contact-sheet.mjs`
- `tools/README.md`
- `tools/package.json`
- `tools/package-lock.json`
