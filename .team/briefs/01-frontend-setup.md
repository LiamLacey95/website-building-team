# Brief 01-frontend-setup

Owner: Front-end design. Phase: Setup.

Goal: the screenshot and variation tooling is ready before any design work starts.

Deliverables:
1. `tools/package.json` with Playwright (and anything else the scripts need) installed under `tools/` only. Chromium installed for Playwright.
2. `tools/screenshot.mjs` as specified in your role file (base URL, routes, widths 390/768/1440/1920, output folder, full page, waits for fonts and network idle, reduced motion). Usage documented in a header comment.
3. `tools/contact-sheet.mjs`: folder of screenshots in, one self-contained HTML grid out (grouped by variant and width, labelled, images referenced relatively).
4. `tools/variants.mjs` or a short PowerShell or Bash script that creates, lists and removes variant worktrees in `F:\ArtGen\Website Test.worktrees\` following the playbook naming, and can start each variant's dev server on its own port.
5. Dry run: make a throwaway static page in a temporary variant worktree, screenshot it at all four widths, build a contact sheet, then remove the worktree and branch. Report the commands you used.
6. `tools/README.md` describing all of the above.

Do not scaffold `web/` yet: the stack is chosen at Gate 1.
When done: commit your paths, write `.team/reports/01-frontend-setup-frontend.md`, send DONE to the PM, then wait.
