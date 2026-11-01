# Contract changelog: how-it-works

Lives at `projects/how-it-works/api/CHANGELOG.md`. Tracks every change to `api/contract.md` and `server/contracts/`, newest first. The contract uses semantic versioning:
- **MAJOR:** breaking for Front-end (a renamed or removed field, a changed type, a new required field);
- **MINOR:** additive;
- **PATCH:** docs or fixtures only.

Every MAJOR change is announced to Front-end before it merges, and the entry records the acknowledgement.

## [Unreleased]

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
