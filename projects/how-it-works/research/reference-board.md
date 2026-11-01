# Reference board: how-it-works

There are 19 references in four candidate directions. These are options for Concept to choose from; Research is not picking one.

Each live site has a 1440x900 screenshot, captured 2026-11-01. Board screenshots are in `research/refs/board/`, and each file name starts with its board ID (for example `d3-monument-valley-desktop.webp` is D3). A4, A5 and B5 reuse competitor screenshots from `research/refs/`. Three references have no screenshot: D1 and D2 are links only because their art is copyrighted print work, and C5 is WebGL. `extra-*` files are candidates that didn't make the board.

Typefaces are taken from each site's own CSS (font-family declarations, checked 2026-11-01) unless marked otherwise. Several of the faces are commercial (Söhne, Ivar, GT, Plain). These are cues for the type pairing; our own choice should come from open-licence (OFL) families that we self-host (see `constraints.md`).

Every direction has to carry the same story: one prompt, six agents, four gates. The direction changes the metaphor the story is told through.

---

## Direction A: "The Studio Book" (editorial, print)

The site reads like a beautifully made process book. It has numbered chapters, generous margins, serif display type and real artefacts tipped in like plates. The metaphor is a monograph about a studio and its method.

| # | Reference | Type | Link / file | Why it is here |
|---|---|---|---|---|
| A1 | Stripe Press | site | https://press.stripe.com/, `refs/board/a1-stripe-press-desktop.webp` | Its books are shown as 3D objects on a dark page, each with its own cover colour. Our briefs, reports and gate packets could be rendered as physical documents the same way. Type: Ivar Display/Text. |
| A2 | Works in Progress | site | https://worksinprogress.co/, `refs/board/a2-works-in-progress-desktop.webp` | Magazine layout with collage art (postmarks, stamps), standfirsts and numbered issues. Shows how to frame each phase as an "article". Type: Editor serif with GT America Mono. |
| A3 | Klim Type Foundry | site / typography | https://klim.co.nz/, `refs/board/a3-klim-desktop.webp` | Black-and-white restraint with huge specimens and a single product-like object. Proof that type alone can carry a page. Type: Söhne, Söhne Mono, Martina Plantijn. |
| A4 | Shape Up (Basecamp) | site / book | https://basecamp.com/shapeup, `refs/shape-up-desktop.webp` | Process as chapters (Shaping, Betting, Building), named pauses, and one hand-drawn diagram reused throughout. |
| A5 | Linear Method | site | https://linear.app/method, `refs/linear-method-desktop.webp` | Large serif "Practices for building" over thin-line interlocking circles. Close to a double diamond drawn as fine line art. |

**Palette cues:** warm paper off-whites and inks, with one saturated accent per chapter (Stripe Press covers).
**Type cues:** a literary serif for display, a quiet grotesk for text, and mono for file paths and commands.
**Generated imagery fit:** still-life "plates" of documents, tools and paper, photographed as objects (WEB1 Klein). This plays to the ComfyUI pipeline *(inferred)*.

## Direction B: "The Instrument" (technical, blueprint)

The team is presented as a precision machine. It uses spec-sheet layouts, grids you can see, mono labels, part numbers for each agent and gate, and a schematic double diamond. The metaphor is a product manual or an engineering drawing.

| # | Reference | Type | Link / file | Why it is here |
|---|---|---|---|---|
| B1 | teenage engineering | site | https://teenage.engineering/, `refs/board/b1-teenage-engineering-desktop.webp` | Product-as-hero photography on black, tiny all-caps labels and dry, cheeky copy. Each agent could be a "module" with a spec sheet. Type: custom TechnoType / te-20. |
| B2 | Standards Manual (NASA Graphics Standards Manual reissue) | site / print | https://standardsmanual.com/, `refs/board/b2-standards-manual-desktop.webp` | Archival standards-manual pages with hard grids and bold flat colour. Our PLAYBOOK is a standards manual. Type: NYCTA Standard, Pitch. |
| B3 | Vercel Geist | site / design system | https://vercel.com/geist, `refs/board/b3-vercel-geist-desktop.webp` | High contrast, with visible grid lines treated as "a core part of the Vercel aesthetic", and mono labels. Geist is OFL, so we could use it. Type: Geist Sans/Mono/Pixel. |
| B4 | Devouring Details | site | https://devouringdetails.com/, `refs/board/b4-devouring-details-desktop.webp` | An interactive manual: fine rules, an orange accent dot, live prototypes beside the prose, and handwritten notes. A good model for annotated artefacts. |
| B5 | Factory | site | https://factory.ai/, `refs/factory-desktop.webp` | "Industrial, geometric, and precise" (https://basement.studio/ai/showcase/factory-precision-in-the-age-of-autonomy). All-caps grotesk, mono labels, and the install command shown as a spec line. |

**Palette cues:** paper white or near-black, one signal colour (NASA red, TE orange), and hairline greys.
**Type cues:** a geometric or neo-grotesk, with mono doing a lot of work (paths, commit hashes, timings).
**Generated imagery fit:** exploded-view renders of abstract "modules", and macro photos of hardware and the GPU (WEB1). Blueprint textures (WEB5) *(inferred)*.

## Direction C: "The Toy Studio" (playful, toy-like)

The team is a set of characters or a toy machine you can play with. A prompt goes in one end, and you crank, press and drag it through the gates. The metaphor is a handheld game, a desktop toy or a marble run.

| # | Reference | Type | Link / file | Why it is here |
|---|---|---|---|---|
| C1 | Playdate | site / product | https://play.date/, `refs/board/c1-playdate-desktop.webp` | One bright yellow object with a crank, and 1-bit dithered screens. A single physical control could step the story through phases. Type: Roobert. |
| C2 | Poolsuite | site | https://poolsuite.net/, `refs/board/c2-poolsuite-desktop.webp` | A retro desktop OS with draggable windows. Six agent "windows" posting messages to each other would be a literal, charming picture of threads. |
| C3 | Rive | site | https://rive.app/, `refs/board/c3-rive-desktop.webp` | State-machine animations that respond to input, plus an install-the-CLI line in the hero. A good model for small interactive agent mascots that react to gates. |
| C4 | Kirby (Nintendo) | site | https://kirby.nintendo.com/, `refs/board/c4-kirby-desktop.webp` | Bouncy character art with a visible **"Reduce motion" toggle** in the header. Proof that playful and accessible can coexist. |
| C5 | Bruno Simon portfolio | site | https://bruno-simon.com/ (no screenshot; WebGL) | You drive a toy car through a 3D world to explore it. The peak of the "explore by playing" idea, and a warning about weight. Its game server is currently offline. |

**Palette cues:** one loud hero colour (Playdate yellow, Kirby pink) on calm neutrals, with pastel secondaries.
**Type cues:** a friendly rounded or quirky grotesk, with a pixel or bitmap face for UI accents (Geist Pixel is OFL).
**Generated imagery fit:** clay or vinyl toy figures for the six agents, shot as product photography. Keep them consistent with WEB2 style-match *(inferred)*.

## Direction D: "The Studio Floor" (cutaway illustration)

A cross-section of an imaginary studio building. You follow one prompt, as a parcel, a paper boat or a character, from room to room: the Research library, the Concept darkroom, the Front-end workshop, the Review inspection desk, and the four gates as doors where a human waves it through. The metaphor is a "How Things Work" cutaway.

| # | Reference | Type | Link / file | Why it is here |
|---|---|---|---|---|
| D1 | David Macaulay, *The Way Things Work* | illustration (book) | https://www.harpercollins.com/products/the-way-things-work-newly-revised-edition-david-macaulay | Pen-and-wash cutaways that follow a process step by step, with a recurring guide character (the mammoth). The canonical reference for this direction. |
| D2 | Richard Scarry, Busytown | illustration (book) | https://www.richardscarry.com/ | Crowded, busy scenes where everyone has a job, plus a "find Lowly Worm" hunt. Six agents at work in one scene, with a recurring prompt to spot. |
| D3 | Monument Valley | game / site | https://www.monumentvalleygame.com/, `refs/board/d3-monument-valley-desktop.webp` | Pastel isometric architecture with a small character walking through it. Shows how to give a cutaway calm and elegance rather than clutter. Type: Humanist 521. |
| D4 | Kurzgesagt | illustration / site | https://kurzgesagt.org/, `refs/board/d4-kurzgesagt-desktop.webp` | Flat vector, saturated colours on deep backgrounds, and complex systems made friendly. Their scroll-free video style translates to still scenes. Type: Montserrat. |
| D5 | Bartosz Ciechanowski, "Internal Combustion Engine" | interactive explainer | https://ciechanow.ski/internal-combustion-engine/, `refs/board/d5-ciechanowski-engine-desktop.webp` | Cutaway 3D diagrams you scrub, placed right next to the text explaining them. The interactive version of a Macaulay page. |

**Palette cues:** pastel isometric (Monument Valley) or saturated flat (Kurzgesagt) on warm paper.
**Type cues:** a humanist sans for labels, with an editorial serif for the narration.
**Generated imagery fit:** this direction is the riskiest for ComfyUI. Isometric scenes with consistent rooms and characters need many style-matched images (WEB2), and the models invent text, so labels must be set in HTML. Concept should test feasibility early *(inferred)*.

---

## Cross-direction notes for Concept

- **The double diamond is the shared visual spine.** Every direction should redraw it in its own idiom: book plate, schematic, toy track, building floor plan. It is CC BY 4.0, so credit the Design Council.
- **The real artefacts must look at home in the direction.** Screenshots, contact sheets and markdown files appear on the site whichever direction wins. A and B handle them most naturally *(inferred)*.
- **Avoid the generic AI-site look:** purple-to-indigo gradients, glow, default shadcn cards, centred hero plus three icon cards (https://www.gigazine.net/gsc_news/en/20260423-design-slop). Cursor's warm paper and painting (`refs/cursor-desktop.webp`) and Factory's industrial look show there is room to stand apart.
