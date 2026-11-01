# Content contract: how-it-works

Owner: Backend. Consumer: Front-end. Status: **draft, published for Gate 3 work**. Version: **0.1.0**.
Lives at `projects/how-it-works/api/contract.md`.
- **Source of truth:** `projects/how-it-works/server/contracts/schema.ts` (Zod 4 schemas and inferred types). If this doc and the code disagree, the code wins and this doc is a bug.
- **Changes:** `api/CHANGELOG.md`. Breaking changes are announced to Front-end before they merge.

There is no runtime API. Everything below is **build-time content**: Astro content collections that `web/` reads with `getCollection` and `getEntry`. Gate 1 (`gates/G1-strategy/DECISION.md`) shapes it:
- **Q5:** dialogue, agent messages and gate decisions are **written for the story**, not quoted from the repo.
- **Q6:** there are no time, duration, cost or token fields anywhere.
- **Q7 D:** the site says plainly that the kit needs an NVIDIA GPU.

## Wiring (web/src/content.config.ts)

This is exactly what the local build test used (`api/stack-proposal.md` §5):

```ts
import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import {
  siteSchema, chapterSchema, roleSchema, gateSchema, sceneSchema, setupSchema,
  creditsSchema, requirementSchema, slotSchema, numbersSchema,
} from '../../server/contracts/schema.ts';
import { requirementsLoader, slotsLoader, numbersLoader } from '../../server/content/loaders.ts';

const C = '../server/content';   // relative to web/
export const collections = {
  site:         defineCollection({ loader: file(`${C}/site.json`), schema: siteSchema }),
  chapters:     defineCollection({ loader: glob({ base: `${C}/chapters`, pattern: '*.md' }), schema: chapterSchema }),
  roles:        defineCollection({ loader: file(`${C}/roles.json`), schema: roleSchema }),
  gates:        defineCollection({ loader: file(`${C}/gates.json`), schema: gateSchema }),
  scenes:       defineCollection({ loader: file(`${C}/scenes.json`), schema: sceneSchema }),
  setup:        defineCollection({ loader: file(`${C}/setup.json`), schema: setupSchema }),
  credits:      defineCollection({ loader: file(`${C}/credits.json`), schema: creditsSchema }),
  requirements: defineCollection({ loader: requirementsLoader(), schema: requirementSchema }),
  slots:        defineCollection({ loader: slotsLoader(), schema: ({ image }) => slotSchema(image) }),
  numbers:      defineCollection({ loader: numbersLoader(), schema: numbersSchema }),
};
```

Required in `astro.config`: `vite.resolve.dedupe: ['zod']` (the schemas import `zod` from outside `web/`), plus the CSP settings in `api/stack-proposal.md` §1. Types come from `astro:content` (`CollectionEntry<'chapters'>`), or import `Chapter`, `Gate` and the other types from `schema.ts`.

## Conventions

- **Ids.**
  - Roles: `pm`, `research`, `concept`, `frontend`, `backend`, `review`.
  - Gates: `G1` to `G4`.
  - Singletons (`site`, `setup`, `credits`, `numbers`): id `main`.
  - Chapters: the file name without `.md` (`00-hero`, …). Sort by `data.order`, not by id.
- **Text** is plain text unless marked *markdown*. Chapter bodies are Markdown; render them with `render(entry)`. Requirements' `minimum` and `notes` are **inline** Markdown (`code`, **bold**); render them with `inlineMd()` from `server/content/inline-md.ts` and `set:html`. It escapes HTML first and allows only code, bold, italic and `https` links.
- **Paths** shown on screen are repo-relative with forward slashes, and may contain `<slug>`. Never machine paths.
- **Images:** `src` is an Astro image (from `image()`), so pass it straight to `<Picture>`/`<Image>`. `alt` is always present and non-empty. Choose widths and `sizes` per component, and set `fallbackFormat`, because the default PNG fallback can be larger than a WebP source.
- **`draft: true`** on chapters, and `site.status: "draft"`: the copy is a first draft. Concept's direction refines the tone after Gate 2. Don't ship until these flip.

## Collections

### `site` (1 entry, `main`)

| Field | Type | Notes |
|---|---|---|
| `name` | string | "Website Building Team" (G1 Q1 A) |
| `heroLine` | string | Working hero line (G1 Q8); Concept may replace it at G2 |
| `shareLine` | string | OG card and meta title line |
| `setupSentence` | string | The call to action, copied verbatim by visitors. Show it with a copy button and a selectable `<code>` fallback |
| `setupIntro` | string | Line before the setup block |
| `whatHappensNext` | string | One sentence under the setup block |
| `gpuNotice` | string | G1 Q7 D. Show it beside every setup block |
| `repoUrl` | URL | |
| `meta.title`, `meta.description` | string | Description is 50 to 170 characters |
| `status` | `draft` \| `final` | |

### `chapters` (10 entries, Markdown)

| Field | Type | Notes |
|---|---|---|
| `order` | 0 to 9 | Prologue (0) to "Your turn" (9) |
| `slug` | `a-z0-9-` | Anchor id for the chapter nav |
| `label`, `kicker`, `title` | string | "Chapter 3" / "Discover" / headline |
| `dek` | string, max 220 | One-sentence summary under the title |
| `phase` | `intake` \| `discover` \| `define` \| `develop` \| `deliver` \| `setup` | |
| `diamond` | `d1-diverge` \| `d1-converge` \| `d2-diverge` \| `d2-converge` \| `null` | Where the chapter lights up the double-diamond spine; `null` = off the diagram |
| `gate` | `G1` to `G4`, optional | Chapters 4 to 7 each end at one gate. Render the **gate card** from the `gates` collection |
| `cast` | RoleId[] | Roles in order of appearance |
| `scenes` | string[] | Ids in `scenes`; each scene's `chapter` matches (tested) |
| `artefacts` | Artefact[] | See below |
| `draft` | boolean | |
| *body* | Markdown | The narrative, 2 to 4 short paragraphs |

**Artefact** is a union on `kind`:

| `kind` | Fields | What it is |
|---|---|---|
| `file` | `path`, `title`, `lang` (`md` \| `json` \| `text` \| `yaml`), `lines[]` (1 to 40) | A file on screen. The path is real; the lines are written for the story (Q5) |
| `terminal` | `command`, `output[]` | A terminal moment, written for the story (the real `--check` run is in `setup.checkOutput`) |
| `slot` | `slot` (SlotId), `caption` | Real imagery from a later gate. Look it up in `slots` |
| `diagram` | `id: 'double-diamond'` | The spine diagram (inline SVG, Front-end's) |

### `roles` (6 entries)

`name`, `short`, `threadTitle`, `oneLiner` (max 140), `does[]` (2 to 6), `owns[]` (real folders, may contain `<slug>`), `neverDoes`, `signatureLine` (in their voice, written for the story), `tools[]`.

### `gates` (4 entries, `G1` to `G4`)

All written for the story (Q5).

| Field | Notes |
|---|---|
| `number`, `name`, `where` | `where` = where it sits on the diamond |
| `question` | What the human is asked |
| `packet[]` | What the human sees |
| `options[]` | `{ letter, label, detail }`, 2 or more |
| `decision` | `{ choice, quote, consequence }`: the fictional decision |
| `revise` | `{ quote, outcome }`: the loop-back, for the "revise" arc on the diagram |

### `scenes` (8 entries)

`chapter`, `title`, and `lines[]`. Each line is `{ speaker, to?, kind, text }`:
- `speaker` is a RoleId, `human` or `system`;
- `to` is a speaker or `all`;
- `kind` is `message`, `brief`, `report`, `aside` or `command`.

They are written for the story. Render them as a chat, a log or a script; the shape doesn't assume any of those.

### `setup` (1 entry, `main`)

`steps[]` `{ title, detail }`, `commands[]` `{ label, command }`, `faq[]` `{ q, a }` (6 entries), and **`checkOutput[]`**.

`checkOutput` is a **real** `node scripts/bootstrap.mjs --check` run on the team's machine: 53 lines, 35 OK. It was redacted with `redact.ts`: machine paths became `<local path>` and the repo root became `<repo>`. Show it in a monospace block with whitespace preserved.

### `requirements` (computed, 5 entries)

`order`, `need`, `minimum` (inline markdown), `notes` (inline markdown, may be empty). Rows of `BOOTSTRAP.md` §1, read at build time when the kit is checked out, else from `server/content/generated/requirements.json`. A test fails if the snapshot drifts.

### `credits` (1 entry, `main`)

- `licences[]`: `{ name, what, licence, url, note }`. Six entries: the kit, Impeccable, FLUX Klein, Z-Image Turbo, Real-ESRGAN, Double Diamond.
- `aiDisclosure` (required on `/credits/`, G1 Q11 A), `diamondCredit`, `privacy` (no analytics; Vercel's logs), `accessibility`.

### `slots` (computed, 5 entries)

| Id | Gate | Chapter | Fills from (relative to `projects/how-it-works/`) |
|---|---|---|---|
| `g1-packet` | G1 | 4 | `gates/G1-*/contact-sheet.{png,webp}`, `screenshots/gates/g1-*` |
| `g2-style-tiles` | G2 | 5 | `concepts/*/style-tile.{png,webp}` (exactly 3) |
| `g2-key-art` | G2 | 5 | `concepts/*/key-art.{png,webp}`, `web/public/assets/generated/hero*` |
| `g3-contact-sheet` | G3 | 6 | `screenshots/g3/*-{390,768,1440,1920}.png` (4 or more) |
| `g4-review` | G4 | 7 | `review/*.{png,webp}`, `gates/G4-*/*.{png,webp}` |

**Entry:**
- `{ gate, chapter, label, pendingLabel, status: 'filled' | 'pending', items[] }`.
- Each item is `{ src (image), alt, caption?, provenance? { workflows[], models[] } }`.
- When `status` is `pending`, render `pendingLabel` ("This happens at Gate 2") as a designed placeholder, never as an empty box.

**Generated images** (`g2-*`) pass the licence guard or the build fails. `provenance` lets you print the "label on the back of the picture".

**Alt text:**
- the image sidecar's `alt`, else a sibling `<image>.alt.txt`, else the registry's default;
- Concept supplies real alt text with each image.

**Modes:**

| Environment | Effect |
|---|---|
| unset | Real sources: everything is pending today |
| `CONTENT_SLOTS=filled` | Every slot uses `server/contracts/fixtures/` (our own kit smoke-test renders, about 300 KB). Captions say "stand-in". **Use this for the Gate 3 variations** |
| `CONTENT_SLOTS=pending` | Every slot pending (test the placeholders) |
| `STRICT_SLOTS=1` | A pending slot fails the build (release, Gate 4) |

### `numbers` (computed, 1 entry, `main`)

`commits`, `commitsByRole` (`pm`, `research`, `concept`, `frontend`, `backend`, `review`, `other`), `briefs`, `reports`, `conceptImages`, `gatesDecided`, and `source` (`live` | `snapshot`).
- These are counts only: no dates or durations (G1 Q6).
- Locally they're counted live from git; on Vercel they come from the snapshot, because Vercel clones only 10 commits.

## Fixtures and draft copy

- **All authored content is a first draft:** chapters 0 to 9 with real narrative, six roles, four gates, eight scenes, the setup steps and FAQ, and the credits. There's no lorem; a test fails on "lorem", "TODO" or a time or cost figure.
- **Slot fixtures:** `server/contracts/fixtures/slots.filled.json` plus `images/` (two smoke-test renders as WebP, with sidecars; four dry-run screenshots).

## Checks Backend runs

- `npm test` in `server/`: 14 tests. They validate every file against the schemas and check cross-references (scenes, slots, gates), requirements parsing and drift, glob, the slot modes, the licence guard on nested chains, redaction, and `inlineMd`.
- `node server/scripts/check-dist.ts web/dist`: runs after every build, including inside Vercel's. It checks for inline scripts and styles, leaked paths or ids, and a 150 MB budget.
- `node server/scripts/sync-kit-facts.ts`: refreshes the snapshots (`--check` for drift).
