# Review: Gate 1, strategy and scope (how-it-works)

Brief: `projects/how-it-works/briefs/03-review-gate1.md` · Checklist: `docs/review/checklists/G1.md` · Reviewer: Review · 2026-11-01

Verdict: **REVISE.** Fix the packet, not the strategy.

The strategy, structure and stack are sound and well evidenced, and I would pass them as they stand. Three MAJOR findings are about the questions the human is asked:
- the option letters don't match between the three places the human can read them;
- the FLUX Klein licence condition is never put to the human;
- Q10's recommendation omits Review's position and the simplest clean option.

All three are edits to `README.md`, `contact-sheet.html` and `research/define/gate1-questions.md`. No new research is needed.

## Scope

- **Read in full:** `BRIEF.md`; `research/SUMMARY.md` and `personas.md`; all of `research/define/` (positioning, sitemap, journeys, story outline, metrics, gate1-questions); `api/stack-proposal.md`; Concept's no-GPU note (now `.team/history/2026-11-01-kit-packaging/03-concept-no-gpu-fallback-concept.md`); and the packet's `README.md` and `contact-sheet.html`. Skimmed `competitors.md` and `reference-board.md` for counts.
- **Sources:** checked 12 URLs against the claims they support (table below).
- **Package versions** (`npm view`): astro 7.4.4 (published 2026-10-28), @11ty/eleventy 3.1.7 and next 16.4.3, all as stated.
- **Contact sheet:** ran `contrast.mjs` on its palette and `a11y.mjs` at 390 and 1440 px.
- **Kit facts:** checked against the fresh-clone bootstrap run from brief 04 (same day).

## Findings

### MAJOR

**[MAJOR] Decision integrity: the option letters for Q7 differ between files, and the contact sheet shows no letters at all.**
- `README.md:47`: A = document the art-directed no-GPU path; B = rented cloud GPU support; C = BFL API, or "GPU required".
- `research/define/gate1-questions.md:87-91`: A = no-GPU path; **B = "State that a GPU is required"**; C = cloud GPU, "out of scope for this project". This file predates Concept's note, which offers A, A+B and A+C, and calls D "not recommended".
- `contact-sheet.html`, the page the PM renders in chat, has no option letters for any question, yet ends "Reply with … question numbers and letters". Its Q7 row also embeds an unlettered sub-question ("Your call: also add rented cloud GPU support?").
- **Why it matters:** "Q7 B" means cloud GPU in one file and "GPU required" in another. A gate answer that can be read two ways is the one thing the packet must not allow.
- **Fix:**
  - Make `gate1-questions.md` Q7 match Concept's note and the README.
  - Put letters in the contact sheet: "Recommended (A)" and "Main alternative (B)", with every option letter matching the README.
  - Split Q7 into a lettered choice, for example: A = art-directed only; B = A plus cloud-GPU support (about ½ day, about $1-3 per round); C = A plus the BFL API adapter.
  - Say in Q7 that it sets **kit scope and what the site tells visitors**. It does not affect this project's own imagery, because this machine has a GPU.

**[MAJOR] Licences: the FLUX Klein condition is assumed, never asked.**
- The stack's licence guard allow-lists WEB1-WEB5 and WEB6b (`api/stack-proposal.md:107`), and four of those workflows are FLUX Klein. The packet tells the human the build "refuses non-commercial images" but never asks whether they qualify.
- **What the licence says** (checked on the model card and LICENSE.md): commercial use of outputs is royalty-free only for "Qualifying Users with less than US$5M in gross annualized revenue, **including affiliates**", measured "at any time". §2.e also requires **content filtering or output review** and **AI disclosure** where the law requires it.
- **Why it matters:** BRIEF must-not "over-promise … licences", and checklist G1 asks for the client's revenue band when Klein imagery may ship. This site exists to show licence honesty, so it can't rest on an unconfirmed condition.
- **Fix:** add one line to the packet: "By accepting, you confirm annual revenue (with affiliates) under US$5M; otherwise Concept uses Z-Image (Apache-2.0) only for shipped images". Or add it as Q11. Note that Review's G2 visual check counts as the output review, and that `/credits/` will carry the AI disclosure.

**[MAJOR] Neutrality: Q10 leaves out Review's position and the cleanest option.**
- **What the packet says:** README:50 and gate1-questions:115-125 recommend removing the screenshots "from the tree" while keeping them in history ("acceptable … in our view"). The only alternative offered is rewriting history, described as "disruptive".
- **What it leaves out:**
  - Review's kit audit (`.team/reports/04-review-kit-audit-review.md`, now in history) rated this MAJOR for going public. The 46 files include Nintendo and Kirby art, Kurzgesagt and Monument Valley, and remain downloadable from public history.
  - The same history also carries live thread ids, machine paths and two ~20 MB `impeccable.exe` blobs.
  - A third option is low-disruption and fixes all of it at once: **publish the public repo from a fresh squashed history** (a new initial commit), and keep this repo private as the team's working copy.
- **Fix:**
  - Add that option.
  - State plainly that Review recommends a clean history before going public.
  - Keep the PM's recommendation if the PM disagrees; the human should see both.

### MINOR

1. **[MINOR] Stack: "Gate 4 is enforced by GitHub" is true only under Q2 A.**
   - GitHub docs: "If you are on a GitHub Free, GitHub Pro, or GitHub Team plan, required reviewers are only available for public repositories."
   - Under Q2 B (private repo on Pro or Team), the approval gate disappears. `stack-proposal.md:178` and README:35 don't say so.
   - Under A, the order matters: make the repo public, configure the `github-pages` reviewer, and only then merge the deploy workflow. Otherwise the first run deploys without approval.
   - **Fix:** say this in the stack proposal's B row and add a line to the README.
2. **[MINOR] Evidence: some claims are stronger than their sources** (see the spot-check table).
   - README:13 and SUMMARY:28 say "every major browser since 27 Oct 2026". caniuse confirms support (Firefox 159+, Safari 26+, Chrome) but gives no date.
   - SUMMARY:24 and story-outline:23 say the Design Council "admits" or "raised" the too-linear criticism. The cited page doesn't say it; the nearest is a former director's Medium post.
   - README:11 says "84% of developers use AI tools". The source says "using **or planning to use**", and it is the 2025 survey.
   - The "study of 500 Show HN sites" is one blogger's analysis (Adrian Krebs), relayed by Gigazine.
   - "Claude Code is the most-used agent" is "agents of choice … (66%)" on the page.
   - Thaler: the human-author requirement comes from the 2025 D.C. Circuit ruling, which the 2 March 2026 cert denial leaves standing. It is not the denial itself.
   - GoatCounter is called "free for non-commercial use" (gate1-questions:110, metrics). Its page says "free for reasonable public usage", and small businesses are explicitly fine. The stack proposal has this right.
   - **Fix:** reword to match the sources.
3. **[MINOR] Stale kit facts.**
   - `sitemap.md:65` says Python "3.11/3.12"; README and BOOTSTRAP now say 3.11 to 3.13.
   - `journeys.md:45` says "~20 GB"; the kit now says ~29 GB (37 GB with extras).
   - The site's `/setup/` must take these from `README.md` and `BOOTSTRAP.md` at build time, not from copies.
4. **[MINOR] Over-promise in the positioning.**
   - `positioning.md:11` says "an **open-source** studio" before a licence exists (Q4) or the repo is public (Q2).
   - `positioning.md:20` says "Image models are chosen for commercial use", but 4x-UltraSharp is non-commercial (boards only) and Klein is conditional.
   - **Suggested wording:** "Shipped images use only commercially licensed workflows; see the licence table". Keep "open-source" only once Q2 and Q4 are settled.
5. **[MINOR] Scope: no accessibility statement page.** The sitemap lists a privacy note under `/credits/` but no accessibility statement. For a site whose proof is WCAG 2.2 AA, it's expected, and checklist G4 requires one. **Fix:** add it as a `/credits/` section or its own page.
6. **[MINOR] Stack safeguards: two gaps.**
   - Redaction (`stack-proposal.md:99`) matches `[A-Z]:\…`, but this repo's reports contain forward-slash `F:/…` paths and Git Bash forms like `/c/Users/…`. Widen the pattern to `[A-Za-z]:[\\/]` and `/[a-z]/(Users|home)/`, and keep the post-build scan.
   - The licence guard checks the sidecar's top-level workflow only. A WEB6b upscale records its source's models in nested `source_provenance`, so the guard should walk the whole chain, as `docs/review/tools/licences.mjs` does.
7. **[MINOR] Metrics: an impossible owner.** `metrics.md:9` assigns the 5-person "name the gates" hallway test to "Review or the human". Agents can't recruit people, so it has to be the human, or the target should be dropped.
8. **[MINOR] Contact-sheet accessibility.**
   - The accent `#c8401e` on paper `#f4f1ea` measures **4.42:1**, which fails AA for the 12 px `.eyebrow` and `.pending` labels. axe reports 2 serious color-contrast violations at both 390 and 1440 px.
   - `#b83a1b` fixes it: 5.08:1 on paper, and 5.73:1 for white text on the G-chips.
   - Otherwise axe passed 21 rules.

### NIT

- `reference-board.md:3` says "19 references", but the table has 20 rows (A1-D5).
- README Q4 says "One LICENSE plus a NOTICE covers everything". That NOTICE must also carry Impeccable's upstream NOTICE text and the two MIT notices (kit audit BLOCKER, brief 06).
- Impeccable gets a glossary entry and a mention in chapter 6, but BRIEF lists it as something the site must *explain*. Give it one plain sentence in chapter 6 ("a design vocabulary and a slop detector the agents must pass").

## Checklist G1

| Item | Result |
|---|---|
| Claims sourced; sources say what's claimed | **Mostly.** All 12 sources exist and support the core figures. Six are worded more strongly than their source (MINOR 2), and one detail is unsourced (the Firefox date) |
| ≥ 3 competitors torn down | **Pass.** 8 teardowns with strengths and weaknesses, plus 4 "also consulted" |
| Findings separated from recommendations | **Pass.** SUMMARY gives insights, then "Design implication"; inferred items are marked *(inferred)* throughout |
| Personas cite evidence | **Pass.** Every objection is sourced or marked inferred; three personas match BRIEF's three audiences |
| Primary persona and task named | **Pass.** Primary task: copy the setup sentence. Maya leads on home, Sam on `/setup/` |
| BRIEF goals and must-haves mapped | **Pass** (table below) |
| Nothing out of scope | **Pass.** `/llms.txt` and `story.md` are justified (Factory precedent, Maya) |
| Open questions answered or listed | **Pass.** BRIEF Q1-4 plus 6 new questions; Klein qualification missing (MAJOR) |
| Revenue band asked if Klein ships | **Fail** (MAJOR) |
| Journeys walk through the sitemap | **Pass.** All three journeys reach their success step; the objection map covers 8 objections |
| Primary task within 3 clicks | **Pass.** Copy block in the hero (0 clicks) and again in chapter 9 and `/setup/` |
| Legal and policy pages | **Partly.** Credits, licences and privacy note are present; accessibility statement missing (MINOR 5); terms and cookies not needed (no cookies, no forms) |
| Metrics measurable, with sources | **Pass.** GitHub traffic API (14-day window noted), Lighthouse, axe, detector; one owner wrong (MINOR 7) |
| Stack fits; cost and licences named; budget achievable | **Pass.** Static Astro, 0 KB framework runtime, 10 KB JS cap, $0 |
| Contract boundary planned | **Pass.** `server/contracts/` plus `api/contract.md` with fixtures for filled and pending slots before Gate 3 |
| Privacy, security, accessibility considered | **Pass.** Meta CSP with stated limits, no cookies, GitHub IP-logging note, reduced-motion and no-JS paths |

## BRIEF must-haves against the plan

| BRIEF | Where it's met |
|---|---|
| Creative, but fast, accessible, reduced motion, mobile | P3; CSS-only scroll effects under `@supports`; motion toggle; static reduced-motion story; 390 px layout; no-JS version |
| Explain roles, phases, gates | Chapter 2 (role cards, roster, a real brief); double-diamond spine; gate cards in chapters 4-7 |
| Explain the ComfyUI pipeline | Chapter 5 (style tiles, image plus sidecar "label", timings) |
| Explain variations and worktrees | Chapter 6 (three branches, four widths) |
| Explain Impeccable | Chapter 6 and glossary; thin (NIT) |
| Explain Review | Chapter 7 |
| Explain setup | Chapter 9, `/setup/`, `llms.txt` |
| Real artefacts, not mock-ups | The repo is the content source; slots for future gates, never lorem; `STRICT_SLOTS=1` before G4 |
| Not generic AI output | Detector-clean target in metrics; Impeccable at every design step |
| Don't over-promise on GPU, gates or licences | GPU: Q7 and requirements card (pass). Human decisions: gate cards (pass). Licences: credits table (pass), but the Klein condition is unconfirmed (MAJOR) |
| Static, GitHub Pages, approval at G1 and G4 | Q2; deploy behind the environment reviewer (MINOR 1) |
| Commercially licensed imagery only | Licence guard (MINOR 6); Klein condition (MAJOR) |
| Code in `web/` (and `server/` if needed) | Yes: `server/content` and `server/contracts` are build-time only |

## Stack against the story outline's 7 constraints

| # | Constraint (`story-outline.md:81-96`) | Stack answer | Met |
|---|---|---|---|
| 1 | Build-time pipeline tolerant of missing slots | Slot registry; `filled` or `pending`; `STRICT_SLOTS` for release | Yes |
| 2 | Full git history in CI | `fetch-depth: 0`; shallow repo fails the release build | Yes |
| 3 | AVIF/WebP, well under 1 GB | `<Picture>` at 400-1600 (2400 for the hero); ~40 MB estimate; CI cap 150 MB | Yes |
| 4 | Excerpt markers | By heading or marker comment; the build fails if a marker disappears | Yes |
| 5 | No runtime fetching; ≤ 2 small JS islands | One vanilla module plus a head snippet; hard cap 10 KB gzipped | Yes |
| 6 | `llms.txt` and markdown twin | Build endpoints from the same collections | Yes |
| 7 | Pages base path | `base: '/website-building-team'`; CI link check | Yes |

## Source spot-check (12 URLs, fetched 2026-11-01)

| # | Claim (where) | Source | Result |
|---|---|---|---|
| 1 | 84% use AI tools, 3.1% highly trust, 66% "almost right" (SUMMARY, personas, README) | survey.stackoverflow.co/2025/ai | Supported. Source says "using **or planning to use**"; it is the 2025 survey |
| 2 | 66% use agents; Claude Code most-used ~66%; 93% want attribution (personas) | stackoverflow.blog 2026-10-06 | Partly. "Agents of choice … Claude Code (66%)"; base is "those AI users"; 93% supported |
| 3 | 500 Show HN sites: 28% gradients, 23.5% shadcn, 20.1% icon grids, 10.7% purple CTAs, 21% five or more (personas, SUMMARY) | gigazine.net 2026-04-23 | Figures supported; it is one blogger's analysis, not a study |
| 4 | Scroll-driven CSS in Chrome, Safari 26+, Firefox 159+; Firefox shipped 27 Oct 2026 (SUMMARY, README) | caniuse animation-timeline | Support supported; **date not on the page**; 88% global |
| 5 | Double Diamond is CC BY 4.0; the Design Council admits it reads as linear (SUMMARY, story outline) | designcouncil.org.uk | Licence supported; **"linear" not on the page** |
| 6 | Klein: commercial output free only under US$5M (personas, constraints) | huggingface.co/black-forest-labs/flux-3-image-klein + LICENSE.md | Supported, with conditions omitted: affiliates count; output review and AI disclosure; gated repo |
| 7 | RTX 5070 12 GB $855.99, US Amazon, 20 Oct 2026 (personas, SUMMARY, Q7) | computingforgeeks.com | Supported |
| 8 | Thaler cert denied 2 Mar 2026; human author required (personas) | mayerbrown.com | Date supported; the requirement rests on the 2025 D.C. Circuit ruling |
| 9 | Multi-agent ≈ 15x chat tokens (personas) | anthropic.com engineering | Supported ("in our data") |
| 10 | Pages: 1 GB, 100 GB/month, 10 min deploy timeout, build limit n/a for Actions (stack, Q2) | docs.github.com Pages limits | Supported, all four |
| 11 | Deploy gated by required reviewer (stack, README) | docs.github.com deployments and environments | Free, Pro and Team: **public repos only** (MINOR 1) |
| 12 | Plausible $9/month, no free tier, 30-day trial; GoatCounter free (stack, Q9, metrics) | plausible.io, goatcounter.com | Plausible supported; GoatCounter "free for reasonable public usage", **not "non-commercial only"** |

## What the PM needs to change before showing the human

1. Make the Q7 letters agree everywhere, and add letters to the contact sheet (MAJOR).
2. Add the Klein qualification line or a Q11 (MAJOR).
3. Q10: add the "fresh squashed public repo" option and note Review's position (MAJOR).
4. Optional in the same pass: the six evidence rewordings (MINOR 2), the Gate 4 reviewer caveat (MINOR 1), the positioning wording (MINOR 4), and the accent colour `#b83a1b` (MINOR 8).

The rest (stale kit facts, accessibility statement, redaction and licence-guard patterns, metric owner) can be picked up in Phase 4 briefs without blocking Gate 1. I'm happy to re-check the revised packet; that's a 10-minute diff review.
