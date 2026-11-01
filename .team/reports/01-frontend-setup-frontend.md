# Report 01-frontend-setup (Front-end design)

State: DONE. Date: 2026-11-01.

## Deliverables

| # | Item | Path | State |
|---|---|---|---|
| 1 | Playwright 1.64.1 installed under `tools/` only; Chromium (headless shell v1248) installed | `F:\ArtGen\Website Test\tools\package.json`, `tools\package-lock.json` | done |
| 2 | Screenshot script | `F:\ArtGen\Website Test\tools\screenshot.mjs` | done, tested |
| 3 | Contact-sheet builder | `F:\ArtGen\Website Test\tools\contact-sheet.mjs` | done, tested |
| 4 | Variant worktree manager (create, list, port, dev, remove) | `F:\ArtGen\Website Test\tools\variants.mjs` | done; static-server path tested, `npm run dev` path untested (no `web/` app yet) |
| 5 | Dry run | `F:\ArtGen\Website Test\design\screenshots\setup-dryrun\` (8 PNGs, manifest, `contact-sheet.html`) | done |
| 6 | Documentation | `F:\ArtGen\Website Test\tools\README.md` | done |

Shared helpers are in `tools/lib.mjs`.

## What the tools do

- **screenshot.mjs:** full-page captures at 390, 768, 1440 and 1920 px.
  - Reduced motion is forced, CSS animations are disabled, and 390 and 768 are captured with mobile and touch emulation.
  - Before each capture it waits for network idle, fonts, and every image (it scrolls the page first so lazy images load).
  - Files are named `<HHMM>-<label>-<route>-<width>.png` in `design/screenshots/<YYYY-MM-DD>/` by default, and each run appends to `manifest.json`.
  - HTTP 4xx and 5xx responses count as failures (exit code 1).
- **contact-sheet.mjs:** turns a screenshot folder into one self-contained HTML file. It has one section per route, one row per width, and variants side by side. Images use relative paths and link to the full PNG. `--widths 1440,390` gives the Gate 3 desktop plus mobile view, and `--latest` dedupes repeated captures.
- **variants.mjs:**
  - Worktrees go in `F:\ArtGen\Website Test.worktrees\variant-g3-<letter>-<slug>` on branch `variant/g3-<letter>-<slug>`, with port 4321 plus the letter offset (A 4321, B 4322, C 4323).
  - `create` also writes a hypothesis stub at `design/variants/<letter>-<slug>.md` inside the worktree.
  - `dev` runs the web app's `npm run dev -- --port N`, or falls back to a built-in static server.
  - `remove` refuses to drop uncommitted work or unmerged branches unless given `--force`.

## Dry run (commands used, from the repo root in Git Bash)

```bash
cd tools && npm install -D playwright && npx playwright install chromium && cd ..
node tools/variants.mjs create z dry-run                 # + wrote web/index.html in the worktree
node tools/variants.mjs create y dry-run-alt --no-doc     # second variant to prove side-by-side grouping
node tools/variants.mjs list
node tools/variants.mjs dev all                          # background: static servers on :4346 (z) and :4345 (y)
node tools/screenshot.mjs --base http://127.0.0.1:4346 --routes home --label variant/g3-z-dry-run --out design/screenshots/setup-dryrun
node tools/screenshot.mjs --base http://127.0.0.1:4345 --routes home --label variant/g3-y-dry-run-alt --out design/screenshots/setup-dryrun
node tools/contact-sheet.mjs --in design/screenshots/setup-dryrun --title "Setup dry run" --latest
# stopped the dev task
node tools/variants.mjs remove y          # refused: untracked files (safety check works)
node tools/variants.mjs remove y --force
node tools/variants.mjs remove z --force
node tools/variants.mjs list              # -> no variant worktrees; git branch -> only master
```

Results:

- 8 screenshots were captured and checked visually; the layouts are correct at every width.
- The contact sheet rendered in Chromium with 0 broken images.
- The worktrees and branches were removed, and the servers were confirmed stopped.

## Issues found and fixed during the dry run

1. **Git Bash rewrites routes.** It turns a bare `/` argument into `C:/Program Files/Git/`.
   - Fix: routes now accept `home` and paths without the leading slash, and the script exits with a hint if it sees a drive-letter route.
   - This affects any agent that runs these tools from Git Bash, so it is documented in the README.
2. **404 pages were recorded as successful shots.** They now fail unless `--allow-errors` is passed.
3. **Mobile shots were stretched to the column width** in the contact sheet. Each image is now capped at its native width.

## Notes and risks

- The `npm run dev` path in `variants.mjs` can only be tested once `web/` exists after Gate 1. If a stack does not accept `--port` or `--host`, use `--cmd`.
- The dry-run screenshots are committed under `design/screenshots/setup-dryrun/` as proof. They are small (about 270 KB in total), and the PM can delete them.
- The `.worktrees` folder is now created at `F:\ArtGen\Website Test.worktrees\` and is empty.
