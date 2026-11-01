# Third-party notices for this vendored copy

This folder is Impeccable 4.8.0 (upstream tag `skill-v4.8.0`, https://github.com/pbakaus/impeccable), installed with
`npx impeccable@4.8.0 install --scope=project` and redistributed **unmodified**, except for the licence files listed here,
which this kit adds.

| Component | Files | Licence | Licence text |
|---|---|---|---|
| Impeccable, Copyright 2025 Paul Bakaus | everything in this folder, plus `.claude/agents/impeccable-*.md` | Apache-2.0 | `LICENSE`; upstream notices in `NOTICE.md` |
| platform-design-skills by ehmo (https://github.com/ehmo/platform-design-skills), from which `reference/ios.md` and `reference/android.md` are derived | `reference/ios.md`, `reference/android.md` | MIT | `LICENSE-platform-design-skills` |
| modern-screenshot, Copyright (c) 2021-present wxm (https://github.com/qq15725/modern-screenshot) | `scripts/modern-screenshot.umd.js` | MIT | `scripts/LICENSE-modern-screenshot` |

A reinstall with `--force` can remove these added files; restore them with
`git checkout -- .claude/skills/impeccable .agents/skills/impeccable`. `node tools/selftest.mjs` fails if they are missing.
