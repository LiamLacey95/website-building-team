# Contract changelog: how-it-works

Lives at `projects/how-it-works/api/CHANGELOG.md`. Tracks every change to `api/contract.md` and `server/contracts/`, newest first. The contract uses semantic versioning:
- **MAJOR:** breaking for Front-end (a renamed or removed field, a changed type, a new required field);
- **MINOR:** additive;
- **PATCH:** docs or fixtures only.

Every MAJOR change is announced to Front-end before it merges, and the entry records the acknowledgement.

## [Unreleased]

## [0.3.3] - 2026-11-01

### Changed (copy only)
- Gate 2 chose Direction C, Marble Run (`gates/G2-direction/DECISION.md`). `site.heroLine` and chapter 0's title are now C's line: "We dropped one sentence in at the top. Watch where it rolls."
- A Marble Run pass across the copy:
  - the prologue and gate chapters (4 to 7, and 9) use the marble, the stations, the barriers and a human hand;
  - chapter 5's file view shows the real Marble Run key art's label (WEB4, seed 3301);
  - the old placeholder direction names are gone from the Concept scene, the G2 decision, Concept's line and the variant branch names;
  - chapter 9 is retitled "Drop yours in."

## [0.3.2] - 2026-11-01

### Changed
- `slotSchema` is generic: `slotSchema(image)` now types `items[].src` as `ImageMetadata`, so `<Picture src>` needs no cast. Checked with `astro check` on Front-end's code: 0 errors, including a probe that assigns `src` to `ImageMetadata`.
- Copy (Gate 1 Q6, from Front-end's review): removed every time or cost phrase. That covers "what it costs" (chapter 4, the G1 packet, the Backend role), "Running cost" (a scene), "the same afternoon" (the G1 revise), "in a few minutes" (chapter 1), "within budget" (chapter 7) and "quickly" (chapter 3).

### Added (tests)
- A word-level check for time and cost words (costs, prices, budgets, afternoon, hours, minutes, days, quickly, …) across all authored copy, including chapter frontmatter.
- Gate option labels: 40 characters or fewer, no trailing period (Front-end renders "A. {label}.").

## [0.3.1] - 2026-11-01

### Changed
- `STRICT_SLOTS=1` also fails if any slot item comes from `server/contracts/fixtures/`, so stand-ins can never reach a release build. The default (no `CONTENT_SLOTS`) already resolves only real files; tests cover both (Front-end's request).
- Vercel Node version: 24.x in Project Settings, to match local builds.

## [0.3.0] - 2026-11-01

### Changed
- Chapter 8 is renamed **"The record"**: entry id `08-the-record` (was `08-paper-trail`), slug `the-record` (was `paper-trail`). "Paper Trail" is the name of Concept's Direction A (Front-end's note). Nothing consumed the old id or slug yet; it is pre-1.0, so this is a minor bump, announced to Front-end.

### Added
- `check-dist.ts` now also flags inline event-handler attributes (`on…=`), as Front-end asked.
- The contract records `vercel.json`'s location (the project root, Backend-owned) and the exact CSP header, compared with the one Front-end tested.

## [0.2.1] - 2026-11-01

### Changed (copy only)
- PM decision (0772bc3) on Q5: the opening prompt is a polished version written for the story, not the human's words, and nothing claims to be verbatim. This updates chapter 1 (title, dek, file view, narrative), the `intake-the-sentence` scene and the contract's wording.

## [0.2.0] - 2026-11-01

### Changed
- `chapters.kicker` is now **optional** (MINOR: nothing that read it breaks). Front-end doesn't render eyebrows above headings (Impeccable's craft rules), and the draft copy keeps kickers only as a writing aid.

### Clarified (no schema change)
- Filled slot items' `src` is Astro `ImageMetadata`, so the master's intrinsic `width` and `height` are always available to `<Picture>` (CLS 0).
- `diamond` and `gate` are stable: the Gate 3 directions animate from them. Renaming or removing either is a MAJOR change.
- CSP: the strict header in `vercel.json` stays (`script-src 'self'; style-src 'self'`), matching Front-end's commit 2c74ad3 (no inline scripts or styles). `check-dist.ts` now evaluates the header and any per-page meta CSP together, as browsers do.

Discussed with Front-end: their notes of 2026-11-01. Point 2 (a meta CSP with hashes plus a slimmer header) was overtaken by their own 2c74ad3, which follows the header approach.

## [0.1.0] - 2026-11-01

### Added
- First contract, after Gate 1 (brief 05). Collections:
  - authored: `site`, `chapters`, `roles`, `gates`, `scenes`, `setup`, `credits`;
  - computed: `requirements`, `slots`, `numbers`.
- Zod schemas and types in `server/contracts/schema.ts`. Loaders in `server/content/loaders.ts`.
- First-draft copy for every chapter, role, gate and scene, plus the setup and credits content. The setup check output is real and redacted.
- Slot fixtures (`CONTENT_SLOTS=filled|pending`) and `STRICT_SLOTS=1` for release builds.
- Snapshots for Vercel: `server/content/generated/requirements.json` and `numbers.json`.
- `inlineMd()` for the requirements' inline Markdown.

Announced to Front-end: 2026-11-01. The shape was sent before the files were written, and an amendment followed for the Vercel Root Directory and snapshots. Acknowledged: pending at the time of writing.
