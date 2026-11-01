# Brief 03-review-portability

Owner: Review. Phase: Kit packaging.

Context: this repo is being published to GitHub as a kit, and projects now live in `projects/<slug>/`. Read the updated `.team/PLAYBOOK.md` and your updated role file first.

Deliverables:
1. **Portability of `docs/review/`:** no absolute or machine paths in committed files. Take generated test output (`docs/review/out/`) out of git (ignore it), or replace it with a small committed example that contains no local paths.
2. **Checklists:** update for the `projects/<slug>/` layout and add Impeccable evidence (`npx impeccable detect` results at G3 and G4) and the licence check for shipped generated images (G2 and G4).
3. **`docs/review/tools/selftest.mjs`:** runs contrast, axe and Lighthouse against a public site and your broken fixture; non-zero exit on tool failure (not on site findings). New teams run it on first start.
4. Make sure `npm ci` in `docs/review/tools/` works from a clean checkout (lockfile committed).

A second brief will follow once Concept, Front-end and Backend finish: a full kit audit (fresh-clone bootstrap test, secret and personal-data scan, and a dry run of `BOOTSTRAP.md` as a new PM would follow it).
When done: commit your paths, write `.team/reports/03-review-portability-review.md`, send DONE to the PM, then wait.
