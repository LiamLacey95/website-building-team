# Report 04-review-kit-audit (Review)

Verdict: **REVISE**. The kit works: a stranger's fresh clone from GitHub bootstraps cleanly end to end. But one BLOCKER (licence) and four MAJOR findings need small fixes before handoff. Three more steps are needed only if the repo goes public; they are flagged under "public only".

Scope:
- **Fresh-clone test:** `origin/master` at `1d30afe`, cloned with `gh` into a temp folder, then README, BOOTSTRAP and the bootstrap with `--comfyui-path <this machine's install> --selftest`, followed literally. Steps 3 and 4 were done without creating threads.
- **Scans:** whole history (109 commits, 503 blobs) for secrets and personal data. HEAD for machine paths, consistency and third-party content (346 files, 8.96 MB). Local HEAD at the end of the audit: `70716c4`.
- **Method:** I ran the clone test myself. The secrets, consistency and licence sweeps were done by three read-only subagents, and I re-verified their key claims by hand (cited below).
- **Clean-up:** the clone, its worktrees folder and its `team.config.json` have been deleted.

## What works (evidence)

- **Bootstrap in the fresh clone:** `node scripts/bootstrap.mjs --yes --comfyui-path "<ComfyUI>" --selftest` exited 0, with a health check of **33 ok, 0 warnings, 0 failures**.
  - The prerequisites check, `npm ci` in both tool folders and the Impeccable engine (4.8.0) all ran; telemetry is off.
  - ComfyUI verification hashed all 11 models (the first run took a few minutes). It auto-fetched the one project-only model a clone lacks (RealESRGAN, 67 MB) into the clone's `artgen/models`, and wrote the launchers inside the clone. Nothing was written into the shared ComfyUI folder.
- **Self-tests:**
  - Front-end selftest: 9 of 9 PASS.
  - Review selftest: 9 of 9 PASS.
  - ComfyUI `generate.py --smoke`: 3 images in 81 s, and the server was stopped afterwards (port 8188 free).
  - `--check` re-run: exit 0. The Backend thread prompt's self-test is the same command.
- **Clean state after setup:** `git status` in the clone was clean after bootstrap and all self-tests, so a new PM won't commit generated files by accident. The BOOTSTRAP step 3 reset produces clean STATUS and DECISIONS files with no ids.
- **Thread prompts:**
  - All five templates exist and use exactly the three placeholders BOOTSTRAP names (`{{PM_THREAD_ID}}`, `{{ENVIRONMENT_ID}}`, `{{REPO_ROOT}}`), with no leftover real ids or paths.
  - Every self-test command they name exists and passes (but see m1 below for Front-end's).
- **Secrets:** none in any commit or blob. The scan covered GitHub/HF/OpenAI/Anthropic/AWS/Google/Slack/Discord token patterns, private keys, JWTs, keyword assignments and an entropy check. No `.env`, `team.config.json`, key or credential file was ever committed. The only emails in history are the GitHub noreply author addresses and the `noreply@anthropic.com` co-author trailer.
- **Impeccable:** all 125 vendored files are byte-identical to upstream tag `skill-v4.8.0` (blob SHAs compared), so Apache-2.0's "modified files" notices aren't needed.
- **Large files:** no model weights or binaries over 1 MB are committed, except one 1.1 MB example image with a sidecar.
- **Commands:** every command and flag named in the docs exists, checked against `--help` or the source (bootstrap, `variants.mjs`, `screenshot.mjs`, `contact-sheet.mjs`, both selftests, review tools, `generate.py`, `install_comfyui.py`, `configure.py`).
- **Agreement across docs:** the four gates' names and order, the branch format, the ports and the pathspec commit rule agree across README, PLAYBOOK, `CLAUDE.md`/`AGENTS.md` (identical) and the prompts.
- **Machine health:** the Chrome slowdown I reported in 03 is gone (axe on gov.uk took 4 s again).

## Findings

### BLOCKER

**[BLOCKER] Licence: Impeccable is redistributed without its LICENSE or NOTICE.**
- **Where:** `.claude/skills/impeccable/**` (58 files), `.agents/skills/impeccable/**` (63 files) and `.claude/agents/impeccable-*.md` (4 files), about 4.5 MB, half the repo. `git ls-files | grep -i -E 'licen|notice'` finds nothing but my `licences.mjs`.
- **Why it matters:** Apache-2.0 §4(a) requires a copy of the licence with any redistribution, and handing this repo to someone is redistribution even while it's private. Upstream also has a `NOTICE.md` (its iOS and Android references are derived from ehmo's MIT-licensed `platform-design-skills`), so §4(d) requires that too. The vendored `scripts/modern-screenshot.umd.js` is the MIT-licensed modern-screenshot library with no header.
- **Fix (owner Front-end, who owns the Impeccable install):**
  - Copy `tools/node_modules/impeccable/LICENSE` and upstream `NOTICE.md` into both skill folders.
  - Add a "Third-party" line to the `README.md` Licences section (PM) covering Impeccable (Apache-2.0, © Paul Bakaus), ehmo `platform-design-skills` (MIT) and modern-screenshot (MIT).
  - The alternative is to stop vendoring and let bootstrap install the skills (it already can), but the committed skills are what make "open the repo and it works" true, so I recommend adding the files.

### MAJOR

**[MAJOR] Research method: `docs/research/METHOD.md` and `_templates` still use the pre-kit layout.**
- **Where:** METHOD.md:7 says "Copy `_templates/` into `docs/research/<project>/`", :24 says to read `.team/briefs/00-project-brief.md` (which doesn't exist), and :33 says "Commit `docs/research/<project>/`". `_templates/competitor-teardown.md:3` uses `docs/research/<project>/refs/`, and :49 cites Playwright 1.58.1.
- **Why it matters:** `roles/research.md:18` tells Research to follow METHOD.md, so a new team's Research thread will write to the wrong place and look for a brief that doesn't exist.
- **Fix:** point them at `projects/<slug>/research/` and `projects/<slug>/BRIEF.md`, the playbook's Project layout (owner Research).

**[MAJOR] No-GPU path: BOOTSTRAP points to text that doesn't exist.**
- **Where:** `BOOTSTRAP.md:19` says "No GPU: `--skip-comfyui` (see the Concept role's fallback)", but `.team/roles/concept.md` has no fallback section; it exists only as `.team/reports/03-concept-no-gpu-fallback.md`.
- **Also:** the Concept thread prompt always runs `python artgen/generate.py --smoke`, which fails on a machine set up with `--skip-comfyui`. BOOTSTRAP step 4 then says "Fix or report anything that fails", with no hint that this is expected.
- **Why it matters:** this is the first thing a stranger without an NVIDIA GPU hits.
- **Fix:** add a "No GPU" section to `roles/concept.md` (PM, with Concept's text), and make the prompt's self-test conditional on `comfyui.path` being set.

**[MAJOR] Ownership: agents are told to write to folders they don't own.**
- **Where:**
  - Every thread prompt (step 3) has the agent write `.team/reports/00-selftest-<role>.md`, and playbook :42 and :101 send kit reports to `.team/reports/`. But the playbook team table gives `.team/` to the PM, and `CLAUDE.md`/`AGENTS.md` say "Write only to the paths your role owns".
  - `projects/<slug>/reports/` is "agents" in the layout but appears in no role file's "You own". `review.md:7` says "Read-only everywhere else".
  - The prompts don't say whether to commit the self-test report.
- **Why it matters:** a careful agent either refuses or breaks a rule on its very first task.
- **Fix:** add one row to the playbook team table: "All agents: their own `<brief id>-<role>.md` in `.team/reports/` and `projects/<slug>/reports/`, committed with a pathspec". Mirror it in the role files (PM).

**[MAJOR] (public only) Copyright: 46 screenshots of third-party websites are committed.**
- **Where:** `projects/how-it-works/research/refs/*.webp` (30) and `refs/board/*.webp` (16), about 2.3 MB. They include Nintendo/Kirby art, Kurzgesagt, Monument Valley and several brands' pages, with no provenance.
- **Why it matters:** `reference-board.md:5` itself says illustration references are "links only, because their art is copyrighted", yet those screenshots are committed. That's fine for private research, but a copyright and trademark risk in a public repo.
- **Fix (decision for the PM and human):** before going public, either git-ignore `projects/*/research/refs/` and keep only URLs, or publish from a fresh squashed history. The files are also in history, so deleting them at HEAD isn't enough (`git filter-repo --path projects/how-it-works/research/refs --invert-paths`).
- **Side note:** if history gets rewritten, also drop the two ~20 MB `impeccable.exe` blobs committed and later deleted under `.claude/` and `.agents/`.

### MINOR

1. **[MINOR] Commands: the Front-end self-test runs the detector from the repo root.**
   - `thread-prompts/frontend.md:7` uses `npx impeccable detect tools`, and `roles/frontend.md:16` uses `npx impeccable detect <path>`, both without `cd tools`.
   - In the clone, `npx impeccable --version` from the root returned **2.1.8** (a stale global), against **4.8.0** from `tools/`, which is exactly what playbook :87 warns about. The self-test "passes" on the wrong CLI.
   - **Fix:** `cd tools && npx impeccable detect .` (PM for the prompt, Front-end for the role text if delegated).
2. **[MINOR] Bootstrap: a "RED" message appears before the auto-fix.** In a fresh clone, step 5 prints `[FAIL] model RealESRGAN_x4plus.pth: missing`, `Result: RED`, then `Verification failed (red)`, and only then auto-fetches the model and ends green. A literal-minded PM following "If something fails, fix it and re-run" may stop there. Make the message "project model missing; fetching (expected in a fresh clone)" (Backend or Concept).
3. **[MINOR] Intake: the active project is never set.** BOOTSTRAP:46 says `activeProject` is "set at intake", but neither BOOTSTRAP:80 nor the playbook's Phase 0 says how (`node scripts/bootstrap.mjs --yes --project <slug>`). Without it, `variants.mjs` and the screenshot and review tools stop or write to the kit folders. **Fix:** add the step to Phase 0 (PM).
4. **[MINOR] Reset: step 3 is incomplete for the state this repo ships with.**
   - This team's `.team/briefs/03-*` and `04-*` and `.team/reports/03-*` and `05-*` are left behind, and a new PM will read them as live work.
   - Resetting DECISIONS also drops kit-level decisions a new team should keep (upscaler licence rule, telemetry off, Impeccable ownership).
   - **Fix:** before handoff, move the kit briefs and reports into `.team/history/<date>-kit-packaging/`, and seed `templates/DECISIONS.md` with the kit-level rows (PM).
5. **[MINOR] Machine paths outside the worked examples.**
   - `artgen/setup/README.md:17-18` uses this machine's real `F:/ArtGen/ComfyUI` as its example; use a placeholder like `scripts/README.md`'s `D:/AI/ComfyUI` (Concept).
   - `.team/briefs/03-backend-bootstrap.md:17` and `03-concept-comfyui-installer.md:5` contain `F:\ArtGen\...` paths and name a private sibling project, "Safeguard". This resolves itself if the briefs move into history (finding 4); otherwise redact them (PM).
6. **[MINOR] (public only) Live ids and worked examples to sanitise.**
   - `.team/STATUS.md:5,9-13` (PM, environment and five thread ids) and `projects/how-it-works/BRIEF.md:3` (PM thread id) are live state, which is expected, and the reset handles STATUS. They are harmless, but they're in history from `062f2ca` and `91718b6` onward.
   - The worked examples have about 34 lines of `F:\ArtGen\...` paths plus Safeguard mentions: `.team/history/2026-11-01-initial-setup/` (01 and 02 briefs and reports) and `.team/reports/03-backend-bootstrap-backend.md:23-25,52,58`, `03-concept-comfyui-installer-concept.md:3,37` and `03-frontend-impeccable-and-portability-frontend.md:127,129`.
   - **Fix:** make paths repo-relative or `<ComfyUI folder>` and decide on the Safeguard mentions before going public. No names, emails or tokens appear in any of them.
7. **[MINOR] Licences: the README section is incomplete.** It doesn't say that Impeccable is vendored, doesn't mention the MIT pieces (BLOCKER above), or that `artgen/input/web_example.png` is a FLUX Klein output (its sidecar is there; `licences.mjs` gives a Klein NOTE, which is fine for publishing outputs), and doesn't mention Z-Image (Apache 2.0) or RealESRGAN (BSD-3), which `artgen/README.md` covers. The repo's own licence stays a Gate 1 question (PM).
8. **[MINOR] Git rules: a pathspec commit can undo an untrack.** I found this one on my own files. `git rm --cached X`, then `git commit -- <dir containing X>`, silently re-adds X if it still exists on disk, because a pathspec commit takes the working-tree state of the paths. That's how my 03 report wrongly claimed `docs/review/out/test-*.md` was untracked; they stayed tracked until `70716c4`, and my 03 report now has a correction. **Fix:** add one line to the playbook's git gotchas: "to untrack, delete the file too (`git rm`), or check `git show --stat HEAD` after committing" (PM).
9. **[MINOR] Ownership: the role files don't match the playbook.**
   - `roles/frontend.md:7` lists `tools/` and `.claude/skills/`, but the playbook also gives Front-end `.claude/agents/`, `.claude/settings.json`, `.agents/`, `.codex/` and `.impeccable/`.
   - Concept owns `projects/<slug>/web/public/assets/generated/` inside Front-end's `web/`, with no exception stated in `frontend.md`.
   - `CLAUDE.md`, `AGENTS.md`, `.gitignore` and `.team/gates/` have no owner or folder-map entry (PM).
10. **[MINOR] Old paths in `docs/api/_templates`:** `CHANGELOG.md:3` says `docs/api/contract.md`, `contract.md:5` says `docs/api/CHANGELOG.md`, and `stack-proposal.md:4` says `.team/briefs/<id>.md`, where they should use the project's `api/` and `briefs/` (Backend).
11. **[MINOR] Plain Claude Code fallback is half documented.** It appears only in BOOTSTRAP:66 and the prompts. The playbook's communication section mentions only `t3_thread_send`, the Roster has no column for session names, and `{{ENVIRONMENT_ID}}` means nothing outside T3 (PM).
12. **[MINOR] Lost variants' hypothesis files disappear with their branches.** `variants.mjs` writes `projects/<slug>/variants/<letter>-<name>.md` inside each variant's worktree branch, and only the winner is merged, so the B and C hypotheses vanish when their branches are removed after Gate 4. G3 Review needs all three. **Fix:** say they get committed on `master`, or copied into the gate packet (PM and Front-end).

### NIT

- **Impeccable install wording:** README:31 ("installs Impeccable") and BOOTSTRAP:50 ("reload your harness so the Impeccable skills are picked up") read as if bootstrap installs the skills; they are committed and only checked.
- **Commit rule:** the short version in `CLAUDE.md`/`AGENTS.md:11` omits `git add <paths>` and the `git diff --cached --name-only` check that playbook :109 has.
- **Gate names:** `roles/review.md:13-17` uses short gate names (G1 Strategy / G2 Direction / G3 Variations / G4 Release), and the `<name>` in `gates/G<n>-<name>/` is never defined. *I can't edit the role file.*
- **Front-end role vs playbook:** `roles/frontend.md` omits `/impeccable document` after Gate 3 and the `onboard` command, which the playbook lists.
- **Research screenshots:** `roles/research.md:22` suggests `tools/screenshot.mjs`, whose default output is Front-end's `screenshots/`; say `--out projects/<slug>/research/refs`.
- **Old names in comments:** `artgen/generate.py:10` (`design/concepts/...`) and `tools/lib.mjs:62` (`variant/g3-a-bold`).
- **Platform statements differ:** README says "Windows or Linux", BOOTSTRAP says macOS works except image generation, and `docs/review/README.md` says Windows-only tested. Linux has not been tested by anyone; say so in one place.
- **Playwright pin:** `tools/package.json` has `^1.64.1` and `docs/review/tools` has exactly `1.64.1`. Both lockfiles resolve to 1.64.1, so it's pinned in practice; make it exact in both.
- **Prompt and template details:**
  - BOOTSTRAP:68 doesn't mention filling the PM id and environment line in the STATUS template.
  - The prompts' `"[ROLE] DONE 00-selftest"` may be sent verbatim; say "replace ROLE".
  - `.team/reports/03-concept-no-gpu-fallback.md` lacks the `-<role>` suffix.
  - `projects/how-it-works/TIMELINE.md` isn't in the layout.
  - `reference-board.md:5` says D1/D2, but its rows are D3/D4.

## Review's own fixes in this brief

- `70716c4`: untracked the old `docs/review/out/test-*.md` (with machine paths). This was MAJOR in the consistency sweep and is now closed.
- `.team/reports/03-review-portability-review.md`: corrected the false "removed from the index" claim.

## Recommended order

1. Front-end: Impeccable LICENSE and NOTICE (BLOCKER).
2. Research: METHOD.md and templates.
3. PM: report-folder ownership row; no-GPU section and conditional Concept self-test; Front-end prompt `cd tools`; active project at intake; move kit briefs and reports into history.
4. Backend or Concept: soften the RED message; placeholder path in `artgen/setup/README.md`.
5. Then hand off. The public-only items (screenshots, history rewrite, path redaction in examples, ids) wait for the human's decision on going public.

I'm happy to re-run the fresh-clone test after the fixes; it takes about 10 minutes.
