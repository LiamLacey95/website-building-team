# Product

<!-- impeccable:product-schema 1 -->

Written by Front-end with `/impeccable init` on 2026-11-01. Sources:
- `BRIEF.md`
- `research/SUMMARY.md`, `research/personas.md` and `research/define/`
- `gates/G1-strategy/DECISION.md`: the human's Gate 1 answers. Where they conflict with anything else, they win.

The init interview was answered by the human's Gate 1 decisions, not by a live round: this team's playbook routes every question for the human through the PM and its gates. Facts that rest on inference rather than a source or a decision are marked *(inferred)*.

## Platform

web

## Stack

- **Decided** (stack proposal, signed off by Front-end and Backend; hosting from the Gate 1 decision): Astro 7 with TypeScript, static output, in `projects/how-it-works/web/`.
- **Hosting:** Vercel, at the site root, so there is no base path.
- **JavaScript:** no UI framework by default. The original 10 KB JavaScript cap is relaxed: a set piece may use more JavaScript (canvas, WebGL through a small library, richer interaction) where it earns it, provided the page stays usable without it and performance stays reasonable.
- **Content:** Backend owns any build-time content code (`projects/how-it-works/server/`), and the data contract is in `api/contract.md`.

## Users

The site is for three groups (`research/personas.md`):

- **Agent-native builders ("Maya").** Developers and designers who already use Claude Code, T3 Code or Cursor. They arrive from a shared link on a desktop, with a few minutes of patience. Their job: judge whether a structured, multi-agent design process beats one-shot generation, and if so, set it up.
- **Studio owners and freelancers ("Tomás").** They weigh whether an agent team can produce work they would bill a client for. Their job: see where humans stay in control, what the quality bar is, and whether the image licences can be explained to a client.
- **The person handed the repo ("Sam").** Often on mobile first. Their job: understand what the system is and whether their machine can run it before touching anything.

## Product Purpose

**What it is.** A website that explains, creatively, how the Website Building Team works. The Website Building Team is an open kit: one project-manager thread plus five agent threads (Research, Concept, Front-end, Backend, Review) that take one prompt to a launched website. Along the way:
- the process follows Double Diamond phases;
- the human decides at four gates;
- ComfyUI generates images locally;
- three coded variations are built in git worktrees;
- Impeccable is the design language;
- an independent Review agent checks the work.

**Why it exists.** The prompt was "a creative website that runs through how this works". The site is also the first thing the team built, so it is proof of the process.

**How success is measured (Gate 1, the human's words):** "A highly creative breakdown of how this setup works. The website will be a showcase of its capabilities, so we are measuring how creative, interesting and polished the final output is."

- **Primary measure:** creativity, interest and polish. This outranks restraint, and creative ambition comes first.
- **Secondary signals** (`research/define/metrics.md`):
  - a first-time visitor can name the four gates;
  - visitors copy the setup sentence ("Set up the website building team from BOOTSTRAP.md.");
  - repo stars and clones.

## Positioning

**Every step of the process leaves a file you can read, and this site was made that way.** Agent product sites sell capability with mock-ups, and studio process pages are text only. The acclaimed explainers (Ciechanowski, the Pudding) are not about AI work. No one shows a multi-agent design process end to end and is itself the result *(competitive gap, `research/SUMMARY.md`)*.

The short form, for the meta description and OG card: "Six AI agents, four human gates, one prompt to a launched website. This site is its own case study."

## Operating Context

**How visitors use the site:**
- They read on desktop and mobile, often arriving from a shared link.
- The one action that matters is copying the setup sentence into Claude Code or T3 Code.
- Some visitors will open the GitHub repo in another tab to check claims.

**Vocabulary.** The kit's own words are the site's vocabulary: thread, brief, report, gate, worktree, variation, contact sheet, sidecar, detector. Use them consistently, with a glossary.

**The process the site describes:**
- **Phases:** Intake, Discover, Define, Concept, Design variations, Build, QA and release.
- **Gates:** G1 strategy and scope, G2 creative direction, G3 design selection, G4 release sign-off.
- **Revision:** a gate can say "revise", and the round happens inside the same gate.

## Capabilities and Constraints

- **Pages:**
  - `/`: the story, following this site's own prompt through the team;
  - `/made/`: how this site was made;
  - `/setup/`: requirements, the sentence, what happens, FAQ;
  - `/credits/`: licences, privacy, accessibility statement, AI-imagery disclosure;
  - `404`;
  - plus `/llms.txt` and `/story.md` for agents.
- **Setup sentence.** It appears in the hero and again at the end, with an accessible copy button and a selectable fallback.
- **Story content (Gate 1, Q5).** Dialogue, agent messages and gate decisions on the site are **written for the story, not quoted from the repo**, so no verbatim-excerpt pipeline is needed. Real generated imagery and real screenshots may be used where they look good.
- **Never on the site (Gate 1, Q6):** time, cost or token figures.
- **Hardware (Gate 1, Q7).** The site says plainly that the kit is **not suited to machines without an NVIDIA GPU**, with no fallback marketing.
- **Analytics (Q9):** none. No cookie banner, nothing stored except a visitor-requested motion preference.
- **Images:**
  - Shipped generated images come only from commercially licensed workflows (WEB1 to WEB5 and WEB6b, never WEB6).
  - FLUX Klein images may ship under its revenue condition (Q11).
  - `/credits/` carries the AI-imagery disclosure.
- **Third-party screenshots** of other websites are never shown on the site.
- **Pending artefacts.** Artefacts from later gates appear as the project runs. Until then their place shows an honest "happens at Gate N" state, never lorem ipsum.
- **Repo licence:** Apache-2.0, with Impeccable's NOTICE credited.

## Brand Commitments

- **Name:** "Website Building Team", kept as the product and repo name (Gate 1, Q1). Concept designs the wordmark and voice at Gate 2.
- **Working hero line (Gate 1, Q8):** "This website started as one sentence. Here's everything that happened next." Concept may propose a stronger one at Gate 2.
- **Voice** (`research/define/positioning.md`):
  - It reads like a studio's process notes: precise and warm, a little dry, never selling.
  - It names concrete things and credits the human ("You choose at four gates. Nothing ships without your yes").
  - Banned words: superlatives such as "revolutionary", "supercharge" and "frontier".
- **Credits:** the Double Diamond (Design Council, CC BY 4.0) may be redrawn with credit.
- **No visual world yet.** It is chosen at Gate 2 from Concept's three directions and recorded in `DESIGN.md` then.

## Evidence on Hand

- **Real today:**
  - `BRIEF.md` and the human's original prompt;
  - `research/` (summary, personas, competitors, content inventory, reference board, constraints, define);
  - the Gate 1 packet and decision;
  - `api/stack-proposal.md`;
  - the kit itself (`.team/PLAYBOOK.md`, role files, `BOOTSTRAP.md`, `tools/`, `artgen/`);
  - the git log;
  - the tooling dry-run screenshots (`.team/history/2026-11-01-initial-setup/frontend-dryrun-screenshots/`).
- **Coming later:**
  - Concept's three directions and generated images (Gate 2);
  - the three variations and contact sheets (Gate 3);
  - the Review audit and Gate 4.
- **Must not be fabricated:**
  - testimonials, user counts, star counts, benchmarks, scores not yet measured, and time or cost figures;
  - claims that the kit works without an NVIDIA GPU.

## Product Principles

1. **The artefacts are the spectacle.** Show what the process produced (briefs, directions, variations, gates, reviews) and make it beautiful. Don't describe it with stock mock-ups.
2. **Creativity is the measure.** Every page should be memorable and polished enough to be the strongest argument for the kit. A safe, generic explainer fails the brief even if it is correct.
3. **One sentence, one spine.** The setup sentence is the call to action. The process (phases and four gates) is the structure everything hangs on, and visitors should leave able to name the gates.
4. **The human decides.** The story credits the four human decisions. Agents propose and the human chooses.
5. **Honest about limits.** State the NVIDIA GPU requirement and licence conditions plainly. Never imply the kit is effortless or free of judgement.

## Accessibility & Inclusion

- **Standard:** WCAG 2.2 AA (the team's quality bar), including:
  - 2.5.7 dragging alternatives;
  - 2.4.11 focus not obscured;
  - text contrast of at least 4.5:1;
  - a visible focus style;
  - full keyboard access;
  - alt text.
- **Motion:**
  - Honour `prefers-reduced-motion`, plus a visible on-page "Reduce motion" toggle.
  - In the reduced version every piece of content stays reachable; motion adds emphasis only, never information.
  - Scroll-jacking is out (`research/SUMMARY.md` insight 3).
- **Set pieces:** canvas or WebGL scenes need a static or semantic equivalent, and must not block reading on low-power devices *(inferred from the quality bar and the relaxed budget)*.
