# Report: 06-kit-fixes (Backend)

Date: 2026-11-01. State: DONE. Commit: 96f534a.

## MINOR 2: misleading RED before the auto-fetch

**Before:** bootstrap streamed `install_comfyui.py --verify` as-is. In a fresh clone it printed `[FAIL] model RealESRGAN_x4plus.pth: missing … Result: RED` and then fetched the model.

**Now:** bootstrap runs `--verify <dir> --json` and renders the result itself.
- Hashing progress lines are still shown live.
- The verifier's own result lines, `Result: RED` included, are not printed.
- If the **only** failures are missing models:
  - each one is shown as `[INFO] … project model missing; expected in a fresh clone; fetching it now`. The "expected in a fresh clone" wording appears only for models in the repo's `artgen/models/`, like RealESRGAN;
  - the summary reads `Install verified; 1 model file to fetch.`;
  - the existing auto-fetch then runs (with `--yes`, up to 2 GB; interactive mode asks first).
- A real red is still shown as red and still fails: for example ComfyUI too old, broken torch, or a hash mismatch.
- If the JSON is unusable, bootstrap falls back to printing the verifier's own output.

**Tests:**
- **This machine (green):** all items OK, then "Install and models verified (green)".
- **Fresh clone of 96f534a** (connect only; Node and Impeccable steps skipped to keep it short): RealESRGAN showed as INFO with the wording above, with no FAIL or RED anywhere in step 5. It was fetched (67 MB) and `configure.py` wrote both launchers. The clone was then deleted.

The full fresh-clone run is Review's re-test.

## MINOR 10: old paths in `docs/api/_templates/`

| File | Change |
|---|---|
| `CHANGELOG.md` | Lives at `projects/<slug>/api/CHANGELOG.md`; tracks `projects/<slug>/api/contract.md` and `projects/<slug>/server/contracts/` |
| `contract.md` | Lives at `projects/<slug>/api/contract.md`; source of truth, changelog, fixtures and mocks all under `projects/<slug>/…` |
| `stack-proposal.md` | Brief at `projects/<slug>/briefs/<id>.md`; lives at `projects/<slug>/api/stack-proposal.md` |
| `deploy.md` | (not in the finding, same issue) lives at `projects/<slug>/api/deploy.md`; output dir `projects/<slug>/web/dist` |

`docs/api/stack-playbook.md` references are kit-level and still correct.

## Needs

Nothing.
