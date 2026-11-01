# Brief 06-kit-fixes

Owners: Front-end, Research, Backend, Concept (sections below), PM. Phase: Kit packaging, fixes from Review's audit.

Source: `.team/history/2026-11-01-kit-packaging/04-review-kit-audit-review.md` (finding numbers refer to it). Each agent does only its own section, commits with a pathspec, writes `.team/reports/06-kit-fixes-<role>.md` (agents may write their own reports there; see the playbook's updated ownership table), and sends DONE. Review re-runs the fresh-clone test once all are done.

## Front-end

1. **BLOCKER: Impeccable licence.** Add Impeccable's `LICENSE` (Apache-2.0) and upstream `NOTICE.md` to `.claude/skills/impeccable/` and `.agents/skills/impeccable/`, and make sure `.claude/agents/impeccable-*.md` are covered (a short header, or a NOTICE alongside). The vendored `scripts/modern-screenshot.umd.js` (MIT) needs its licence header or a `LICENSE-modern-screenshot` file next to it. Send the PM a short "Third-party" paragraph for the README (Impeccable Apache-2.0 © Paul Bakaus; ehmo platform-design-skills MIT; modern-screenshot MIT).
2. MINOR 12: G3 hypothesis files must survive. Make `variants.mjs` (or your documented process) commit `projects/<slug>/variants/<letter>-<name>.md` on `master`, not only on the variant branch.
3. NITs: exact Playwright pin in `tools/package.json` (`1.64.1`, not `^`); old branch name in the `tools/lib.mjs:62` comment; `selftest.mjs` runs the detector from `tools/`, not the repo root (MINOR 1).

## Research

1. **MAJOR: `docs/research/METHOD.md` and `_templates/`** use the old layout. Point them at `projects/<slug>/research/` and `projects/<slug>/BRIEF.md`; refresh the Playwright version mention; say research screenshots go to `--out projects/<slug>/research/refs`.
2. NIT: `projects/how-it-works/research/reference-board.md:5` says D1/D2 but means D3/D4.

## Backend

1. MINOR 2: in a fresh clone, bootstrap prints `[FAIL] … RealESRGAN missing … RED` before it auto-fetches. Word it as expected ("project model missing; fetching (expected in a fresh clone)") and don't print RED for something you're about to fix.
2. MINOR 10: old paths in `docs/api/_templates/` (`CHANGELOG.md:3`, `contract.md:5`, `stack-proposal.md:4`) should use the project's `api/` and `briefs/`.

## Concept

1. MINOR 5: `artgen/setup/README.md:17-18` uses this machine's real ComfyUI path as its example; use a placeholder such as `D:/AI/ComfyUI`.
2. NIT: `artgen/generate.py:10` comment still says `design/concepts/...`.
3. Send the PM a 6 to 10 line "No GPU" section for `roles/concept.md`, condensed from your fallback note (what Concept delivers without ComfyUI; that `generate.py --smoke` is skipped when `comfyui.path` is unset).

## PM (for the record)

Report ownership row; no-GPU section and conditional Concept self-test; `cd tools` in the Front-end prompt; active project at intake; kit briefs and reports into history; kit rows seeded in the DECISIONS template; untrack gotcha; role files matched to the playbook; Claude Code fallback in the communication section; README licences; NITs on wording, gate names, platform statement, template details.
