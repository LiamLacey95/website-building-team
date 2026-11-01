# Report 03-review-portability (Review)

Status: DONE. Commit `016d9cd` (pathspec `docs/review`). All four deliverables are done, with two additions: a generated-image licence checker, and a fix for Lighthouse hanging on this machine.

## 1. Portability of `docs/review/`

- **Output is out of git.** `docs/review/out/` is ignored, and the four old `out/test-*.md` files (which held absolute `F:\...` paths) are untracked. *Correction (04 audit):* they were not untracked in `016d9cd` as first reported. That pathspec commit re-added them because they still existed on disk. They were actually removed in `70716c4`. A committed sample takes their place: `docs/review/examples/selftest.md`. It contains no local paths.
- **The tools no longer write machine paths into reports.**
  - Local files are shown as repo-relative paths (`docs/review/tools/fixtures/bad.html`), and "Wrote ..." and HTML report links are repo-relative too.
  - Local files and `file://` URLs are now served over `http://127.0.0.1` for the run. Lighthouse refuses `file://` outright (`INVALID_URL`), and serving also means a built `dist/` folder can be audited directly.
- **Project-aware output.**
  - Without `--out`, reports go to `projects/<activeProject>/review/out/`, using `activeProject` from `team.config.json` (or `--project`). If no project is set, they go to `docs/review/out/`.
  - In a project's `out/`, the tools create a `.gitignore` for the HTML, JSON and logs, so only the Markdown evidence gets committed.
- **One exit-code contract for every tool:** 0 clean, 1 findings, 2 the tool failed. Previously a page that wouldn't load could look like a finding, and bad input crashed with exit 1.
- **Browser fallback.**
  - Lighthouse now uses `CHROME_PATH`, then installed Chrome, then Playwright's Chromium, so a machine without Chrome works after the bootstrap.
  - Playwright is pinned to exactly `1.64.1`, the same as `tools/`, so both folders share one Chromium build (1248).
- **A bug from my setup brief is fixed:** `esc()` never escaped `|` in Markdown table cells (a mangled backslash), so a page title or error message containing a pipe would have broken report tables.
- A scan of the committed `docs/review/` for drive paths, home folders, the user name, email or the GitHub handle finds nothing.

## 2. Checklists (`docs/review/checklists/`)

- **All five checklists use the `projects/<slug>/` layout:** inputs, report paths (`projects/<slug>/review/`) and tool output paths. G3 gets its worktrees from `worktreesDir` and the real `tools/variants.mjs list|path|port|dev` commands.
- **Impeccable evidence:**
  - **G3:** run the detector from `tools/` on each variant's `projects/<slug>/web` and on its running URL at the default width and at 390x844, then compare with the variant file's recorded results. An unjustified finding is MAJOR, and so is a mismatch with the variant file (stale evidence). A justification must point to `DESIGN.md` or the direction. Advisory findings never block. The scorecard gains a detector column.
  - **G4:** a new section 5 covers the detector on every template, plus proof that `/impeccable audit` and `/impeccable polish` were run.
  - **Build:** the detector adds no new unjustified findings.
  - I confirmed the detector skips `node_modules`, so scanning `projects/<slug>/web` is safe.
- **Licence check for shipped images:**
  - **G2:** sidecars present, `direction.md` records the licence, and a non-commercial chain is flagged as "boards only, regenerate with WEB6b before shipping".
  - **G4:** a new section 6. Any FAIL on `web/public/assets/generated` is a BLOCKER, and every Klein NOTE must be cleared against the client's revenue.
  - **G1:** asks for the client's revenue band if Klein imagery may ship.
- **The new tool, `licences.mjs`, makes this check mechanical.** A sidecar's top-level `licence` covers only the last step (for example, the upscaler), while the base model sits in nested `source_provenance`, which is easy to miss by eye. The tool walks the whole chain. Run against the real ComfyUI smoke outputs, it gave:
  - PASS for Z-Image (Apache 2.0);
  - NOTE for Klein;
  - FAIL for the 4x-UltraSharp image and for two comparison images with no sidecar.
- The build checklist adds a scan for machine paths and personal data, and the pathspec commit rule.

## 3. `docs/review/tools/selftest.mjs`

`node docs/review/tools/selftest.mjs` works from any folder. Use `--skip-lighthouse` for a quick run and `--site <url>` to change the public site. It has 9 checks:

- prerequisites;
- contrast: known ratios, a palette file, and rejection of bad input;
- axe: the 7 known rules on `fixtures/bad.html`, plus gov.uk at 390 and 1440 px;
- Lighthouse: the fixture (accessibility 22) and gov.uk on the mobile preset;
- the Impeccable detector from `tools/`, which must flag a new `fixtures/slop.html` (10 rules fire).

Exit codes are 0 when every check passes, 1 when a tool is broken, and 2 when the selftest itself crashes. Site findings never fail it: gov.uk missing the CLS budget does not count. The bootstrap already calls it (`--selftest`).

The result in the main checkout was **9/9 PASS** (sample in `examples/selftest.md`).

## 4. `npm ci` from a clean checkout

The lockfile is committed and matches `package.json` (Playwright pinned). In a fresh `git clone` of `016d9cd` in a temp folder:

- `npm ci` in `docs/review/tools` installed 122 packages.
- `selftest --skip-lighthouse` passed 6/7. The one failure was the detector check, which correctly said `tools/` had not been installed yet.
- With `npm ci` in `tools/` as well, the full selftest passed **9/9** (exit 0), run from the clone root as the bootstrap does.

The temporary clone was deleted afterwards.

## Machine issue found: Chrome processes don't finish exiting (affects everyone using headless Chrome)

Since about 12:30, `taskkill` reports success on headless Chrome but the process never finishes tearing down. Node then never gets an exit event, so Lighthouse wrote its report and then hung forever. I confirmed this with this morning's committed version, so it is not a code change. At one point there were 24 exited-but-still-listed `chrome.exe` entries, 20 of them not from my tools.

**Mitigation in `lighthouse.mjs`:** after `kill()` it stops waiting on the Chrome child, so the tool exits. Playwright-based tools (mine and Front-end's) were not affected in my runs.

**Effects and fix:**
- Everything Chrome-based is several times slower right now (axe on gov.uk took 100 to 177 s against about 5 s this morning). Some of that was also Backend's clone test running alongside.
- A reboot should clear it. That is the human's call, so I only flag it.

## Notes for other roles

- **Front-end:** my tools pin Playwright `1.64.1` exactly, like `tools/`. If you bump Playwright, tell me so both folders move together; otherwise they need two Chromium builds.
- **Backend:** no bootstrap change is needed. It already runs `npm ci` in `docs/review/tools` and calls `docs/review/tools/selftest.mjs`. Expect the selftest to take 3 to 5 minutes, or more on a loaded machine.

Needs: nothing.
