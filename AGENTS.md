# Website Building Team repo

This repo is worked on by a team of agent threads managed by a project manager (PM) thread.

- **New machine or new team?** Read `BOOTSTRAP.md`: the thread that does so becomes the PM.
- **Already on the team?** Read `.team/PLAYBOOK.md`, then your role file in `.team/roles/`, then `.team/STATUS.md`.

Rules for every agent:
- Write only to the paths your role owns (see the playbook table). Project work lives in `projects/<slug>/`.
- Never hard-code machine paths in committed files; read them from `team.config.json`.
- Commit only your own paths; never `git add -A` at the repo root. Only the PM pushes.
- Report to the PM thread as described in the playbook, then stop and wait.
