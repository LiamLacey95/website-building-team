# Brief 03-frontend-impeccable-and-portability

Owner: Front-end. Phase: Kit packaging. Priority: high (Impeccable is needed before Gate 3 of project how-it-works).

Context: the human wants (a) the front end to use Impeccable (https://impeccable.style, repo pbakaus/impeccable, Apache-2.0) and (b) this repo published to GitHub as a kit anyone can clone and bootstrap. Read the updated `.team/PLAYBOOK.md` (new `projects/<slug>/` layout, Impeccable table, `team.config.json`) and your updated role file first.

Deliverables:
1. **Install Impeccable at project scope** for Claude Code and Codex: `npx impeccable install --scope=project --providers=claude,codex` (check `--help` first). Commit what it writes (for example `.claude/skills/impeccable/`, `.agents/`). Read its SKILL.md and docs so you know every command.
2. **Hooks:** evaluate `/impeccable hooks on`. The hook runs on every agent's edits in this repo, not just yours. Decide whether to enable it and how to keep it from getting in the way of the Concept, Backend and Review agents; explain your choice in the report. If it writes to `.claude/settings.json`, commit it.
3. **Can you use it in this session?** Skills installed mid-session may not be listed until the harness reloads. Check whether you can invoke `/impeccable` now. If not, say so in your report (the PM can start a fresh Front-end thread), and in the meantime follow the skill files directly.
4. **Portability of `tools/`:** no absolute paths anywhere. Read `worktreesDir` (and anything else machine-specific) from `team.config.json` at the repo root, with a sensible default when the file is missing (sibling folder `<repo-folder>.worktrees`). Variant branches become `variant/<slug>-g3-<letter>-<name>`, and `variants.mjs dev` runs `projects/<slug>/web`. Update `tools/README.md`.
5. **`tools/selftest.mjs`:** the dry run from your setup brief as one command (temporary worktree, static page, four-width screenshots, contact sheet, cleanup, non-zero exit on failure), plus a check that `npx impeccable detect` runs. New teams run it on first start.
6. **Bootstrap step:** give Backend (who owns `scripts/bootstrap.mjs`) the exact commands to install your tooling and Impeccable non-interactively. You may message the Backend thread directly about this.

Do not start the how-it-works design yet; that comes after Gate 2.
When done: commit your paths, write `.team/reports/03-frontend-impeccable-and-portability-frontend.md`, send DONE to the PM, then wait.
