# Report 06-review-retest (Review)

Verdict: **PASS.** The kit is ready to hand off. Every finding from the 04 kit audit that doesn't depend on going public is closed. Two public-only items (M4 screenshots, m6 ids and paths in history) wait for the human's Gate 1 answers to Q10 and Q2. One item closes when the PM archives brief 06 (m4).

Scope:
- **GPU path:** a fresh `gh repo clone` of `origin/master` at `b491a50`, with README and BOOTSTRAP followed literally, then `node scripts/bootstrap.mjs --yes --comfyui-path "<ComfyUI>" --selftest`.
- **No-GPU path:** a second fresh clone with `--yes --skip-comfyui --selftest`.
- **Each 04 finding** checked against the files in the clone.
- **Clean-up:** both clones, both worktrees folders and their `team.config.json` files are deleted; no ComfyUI process is left running.

## Fresh-clone results

| Run | Result |
|---|---|
| GPU path (`--comfyui-path … --selftest`) | **Exit 0; health check 33 ok, 0 warnings, 0 failures.** Front-end selftest: 11/11 (new: pinned CLI from `tools/` = 4.8.0; licence files present). Review selftest: 9/9. ComfyUI smoke: 3 images in 70 s, server stopped afterwards. `git status` clean afterwards |
| Fresh clone's missing project model | Now `[INFO] model RealESRGAN_x4plus.pth: project model missing; expected in a fresh clone; fetching it now`, then "Install verified", GREEN. No more RED |
| No-GPU path (`--skip-comfyui --selftest`) | **Exit 0; 17 ok, 1 warning** ("ComfyUI not configured", as expected), 0 failures. Front-end 11/11, Review 9/9 |
| Concept prompt's self-test on the no-GPU clone | `python artgen/generate.py --smoke` printed "Smoke test: SKIPPED (no comfyui.path …)" and exited 0. The prompt routes to the role's "No GPU" section |
| BOOTSTRAP step 3 (reset) | Templates have no live ids. `DECISIONS.md` template seeds 5 kit-level rows (upscaler licence, generated-image licence, telemetry, layout and ownership, git) |
| BOOTSTRAP step 4 (prompts) | All 5 prompts use exactly `{{PM_THREAD_ID}}`, `{{ENVIRONMENT_ID}}` and `{{REPO_ROOT}}`, and BOOTSTRAP says what to do with `ENVIRONMENT_ID` outside T3. Each prompt commits its self-test report with a pathspec |

## 04 findings: status

| 04 finding | Status | Evidence (in the clone) |
|---|---|---|
| **BLOCKER** Impeccable without LICENSE/NOTICE | **Closed** | `LICENSE`, `NOTICE.md`, `LICENSE-platform-design-skills` and `scripts/LICENSE-modern-screenshot` are in both skill folders, plus `.claude/agents/IMPECCABLE-NOTICE.txt`. README has a third-party paragraph. Front-end's selftest now checks for them |
| **MAJOR** Research METHOD and templates on the old layout | **Closed** | METHOD uses `projects/<slug>/research/`, `projects/<slug>/BRIEF.md` and pathspec commits; no `docs/research/<project>` left in `_templates` |
| **MAJOR** No-GPU path points to text that doesn't exist | **Closed** | `roles/concept.md` "## No GPU (bootstrap --skip-comfyui)"; the prompt's self-test is conditional; tested above |
| **MAJOR** Report folders have no owner | **Closed** | Playbook team table has an "All agents" row for their own reports in `.team/reports/` and `projects/<slug>/reports/`, plus the archive-to-history rule |
| **MAJOR** (public only) 46 third-party screenshots | **Waiting for the human** | Gate 1 Q10, options A–D |
| m1 Front-end prompt runs the detector from root | **Closed** | `cd tools && npx impeccable detect .` in the prompt and the role file |
| m2 RED before the auto-fix | **Closed** | INFO message, GREEN result (above) |
| m3 Intake never sets the active project | **Closed** | Playbook Phase 0 and BOOTSTRAP §5: `node scripts/bootstrap.mjs --yes --project <slug>` |
| m4 Reset step incomplete; live kit briefs in `.team/` | **Closed in the docs; one PM step left** | BOOTSTRAP §3 now covers briefs, reports and history, and the DECISIONS template keeps kit rows. `.team/briefs/06-kit-fixes.md` and four `06-*` reports are still live; move them to history once 06 is closed |
| m5 Machine paths outside the examples | **Closed** | `git grep` outside history and reports finds only placeholders (`D:/AI/ComfyUI`, `D:/ComfyUI`) and the Git Bash note |
| m6 (public only) Live ids and paths in worked examples and history | **Waiting for the human** | Resolved by Q10 C or D |
| m7 README licence section | **Closed** | Third-party paragraph, all four models with licences, and the Klein example image |
| m8 An untrack can be undone by a pathspec commit | **Closed** | Playbook git gotcha "Untracking a file" |
| m9 Role-file ownership doesn't match the playbook | **Closed** | `frontend.md` lists all Impeccable config paths. Playbook names the PM as owner of `CLAUDE.md`, `AGENTS.md`, `.gitignore`, history and `TIMELINE.md`, and states Concept's `generated/` exception |
| m10 `docs/api/_templates` old paths | **Closed** | No `docs/api/contract.md`, `docs/api/CHANGELOG.md` or `.team/briefs/<id>` left |
| m11 Claude Code fallback half documented | **Closed** | Playbook "Messaging tool" covers T3 and plain Claude Code; the roster column is "Thread id (T3) or session name (Claude Code)" |
| m12 Hypothesis files lost with their branches | **Closed** | `tools/README.md`: hypothesis files are kept in the main checkout, committed on master |
| NITs (Impeccable wording, commit rule, gate names, Front-end commands, research `--out`, old comments, platform statements, exact Playwright pin, prompt details) | **Closed** | All checked: `CLAUDE.md` has the full rule, `roles/review.md` uses the full gate names and folders, both `package.json` files pin `1.64.1` exactly, the README states the platforms, and prompts say `[<ROLE>]` |

## New, small

- **[NIT] Report path in `roles/review.md`.** Its "Report format" path is `projects/<slug>/review/<brief id>-<subject>.md`, but gate verdicts go to `projects/<slug>/gates/G<n>-<name>/review.md`, as brief 03-review-gate1 asked. I've updated my checklists G1 to G4 to name both, with the brief's path winning. One line in the role file would match it (PM).
- **[NIT] README attribution.** The third-party paragraph names Impeccable and points to each folder's `NOTICE.md`, which covers ehmo's platform-design-skills. It doesn't name modern-screenshot (MIT), which has its own LICENSE file in `scripts/`. That's sufficient for the licences; naming it in the README would be a courtesy.

## Review's own changes in this brief

- `docs/review/checklists/G1.md` to `G4.md`: the report line now names the gate-packet `review.md` path.
