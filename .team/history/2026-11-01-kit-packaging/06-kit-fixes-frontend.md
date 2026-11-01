# Report 06-kit-fixes (Front-end)

State: DONE. Date: 2026-11-01. `node tools/selftest.mjs` passes 11 of 11 checks (two new ones, below).

## 1. BLOCKER: Impeccable licence (fixed)

All upstream texts were fetched from `pbakaus/impeccable` at tag `skill-v4.8.0`, the exact vendored version. The upstream `LICENSE` is byte-identical to `tools/node_modules/impeccable/LICENSE`.

| Added file (in both `.claude/skills/impeccable/` and `.agents/skills/impeccable/`) | Content |
|---|---|
| `LICENSE` | Apache-2.0, Copyright 2025 Paul Bakaus (upstream, verbatim) |
| `NOTICE.md` | Upstream third-party notice: `reference/ios.md` and `reference/android.md` are derived from ehmo's `platform-design-skills` (MIT) |
| `LICENSE-platform-design-skills` | ehmo's MIT licence text, verbatim from github.com/ehmo/platform-design-skills. Its copyright line names no holder ("Copyright (c) 2026"), so `THIRD-PARTY.md` names the author |
| `scripts/LICENSE-modern-screenshot` | modern-screenshot's MIT licence, Copyright (c) 2021-present wxm, from github.com/qq15725/modern-screenshot. The vendored UMD file has no version string and upstream doesn't record one; the MIT text is the same across versions |
| `THIRD-PARTY.md` | One table mapping each component to its files, licence and licence text, plus how to restore the files after a reinstall |

**The agent definitions.** `.claude/agents/IMPECCABLE-NOTICE.txt` covers `impeccable-*.md`: Apache-2.0, © Paul Bakaus, unmodified, with pointers to the licence and notice. It is a `.txt` file on purpose, because Claude Code loads every `.md` file in `.claude/agents/` as an agent definition.

**Why nothing else changed.** No vendored file was modified (Review confirmed byte-identity with upstream), so no Apache §4(b) change notices are needed.

**Guard.** The selftest now fails if any of the 11 licence files is missing. A `--force` reinstall can remove them; restore with `git checkout -- .claude/skills/impeccable .agents/skills/impeccable`.

**Note on Review's side note** about the two ~20 MB `impeccable.exe` blobs: `git log --all` finds them only in a T3 checkpoint ref (`refs/t3/orchestration-v2/checkpoints/...`, commit a9a42c4). They are not in `master`'s history and aren't pushed unless refs/t3 are pushed. The PM should make sure pushes are `git push origin master` only.

## 2. MINOR 12: G3 hypothesis files survive (fixed)

`node tools/variants.mjs create <letter> <name>` now:

1. Adds the worktree from HEAD, as before.
2. Writes `projects/<slug>/variants/<letter>-<name>.md` in the **main checkout**.
3. Commits it there with a pathspec commit (`git commit -- <that file>`), so it never takes other agents' staged files.

Options:
- `--no-commit` only writes the file.
- `--no-doc` skips it.

Because the stub is created after the worktree, variant branches never carry the file, and merging the winner can't conflict on it. The stub says to edit it in the main checkout.

**Tested in a throwaway clone:**
- the stub was committed on master;
- a file staged in the shared index stayed staged;
- the worktree had no copy;
- `--no-commit` wrote the file without committing.

`tools/README.md` (variants and Gate 3 loop) is updated to match.

## 3. NITs (fixed)

- **Playwright pin:** `tools/package.json` pins Playwright exactly at `1.64.1`. The lockfile was already on 1.64.1. Impeccable was already exact at `4.8.0`.
- **Old branch name:** the `tools/lib.mjs:62` comment now uses the current naming (`variant/how-it-works-g3-a-bold-grid`).
- **MINOR 1:** `selftest.mjs` already ran `detect` with cwd `tools/`. It now also asserts that the CLI resolved from `tools/` matches the pinned version and fails with a hint otherwise. A stale global can no longer "pass" the selftest.

## Not mine

The audit's other Front-end mentions belong to the PM (role and prompt text):
- `thread-prompts/frontend.md:7` and `roles/frontend.md:16` need `cd tools`.
- `roles/frontend.md` should list `.claude/agents/`, `.claude/settings.json`, `.agents/`, `.codex/` and `.impeccable/`, plus `/impeccable document` after Gate 3 and `onboard`.

The README's "Third-party" paragraph went to the PM with my DONE message.
