# Brief 04-review-kit-audit

Owner: Review. Phase: Kit packaging, final check before the kit is called handoff-ready.

Context: the human's requirement is that this repo is "enough to hand off to someone's Claude Code or T3 Code, say 'set up this system', and that thread becomes the project manager, sets up the team, sets up ComfyUI and the models, Impeccable, worktrees, etc." Concept (03, 1980bdb and fc7fc3f), Front-end (03 and 05, through 945a8b7) and Backend (03, through 2bfed09) are done. Audit the result as a stranger would. Remote: https://github.com/LiamLacey95/website-building-team (private; `gh` is authenticated, so you can clone it).

Deliverables: `.team/reports/04-review-kit-audit-review.md` with a verdict (PASS, PASS WITH NOTES or REVISE) and findings in your usual severity format.

1. **Fresh-clone test from GitHub:** clone `origin/master` into a temporary folder and follow `README.md`, then `BOOTSTRAP.md`, literally, as a new PM thread would. Run the bootstrap with `--comfyui-path` pointing at this machine's install (no fresh 29 GB install) and `--selftest`. Record every place where the instructions are wrong, ambiguous, out of order, or assume knowledge a stranger lacks. **Do not create threads**: for step 4, check that the thread-prompt templates exist, their placeholders are complete, and the self-test commands they name exist and pass. Delete the clone and anything it created (worktrees folder, team.config.json) when done.
2. **Secrets and personal data:** scan the whole git history (`git log -p` or a scanner such as gitleaks via npx if available) for tokens, keys, `.env` files, personal email addresses other than commit authorship, and machine paths that leak more than necessary. Note that `.team/history/` and reports are meant to be kept as worked examples; flag anything in them that shouldn't be public if the repo goes public.
3. **Machine coupling:** grep committed files for absolute paths (`F:\`, `F:/`, `C:\Users`, the user name) outside `.team/history/`, reports and `projects/*/research/refs`. Each one is a finding unless it's clearly an example.
4. **Consistency:** `.team/PLAYBOOK.md`, role files, thread-prompt templates, `CLAUDE.md` and `AGENTS.md`, and `BOOTSTRAP.md` agree on paths, commands, ownership, and the pathspec commit rule. List contradictions.
5. **Licences in the repo:** third-party content committed (Impeccable skill files, NOTICE requirements, fonts, research screenshots of other sites). Say what attribution or removal is needed before the repo can go public. The repo licence itself is a Gate 1 question.

Do not fix other agents' files; report. You may fix your own.
When done: commit your report with a pathspec, send DONE to the PM with the verdict in the summary line, then wait. After this you'll get the Gate 1 review of how-it-works.
