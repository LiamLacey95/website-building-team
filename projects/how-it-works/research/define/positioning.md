# Positioning: how-it-works

Builds on `../SUMMARY.md`. Its three insights are the working design principles:

- **P1 Proof over claims.** Follow this site's own prompt through the team and show the real files.
- **P2 One sentence, one diagram.** The setup sentence is the call to action; the double diamond with four named gates is the spine.
- **P3 Creative, not heavy.** Static by default, motion optional, CSS first.

## Positioning sentence

**For people who build websites with AI agents and want work they'd put their name to, Website Building Team is a studio of six agent threads you run on your own machine that turns one prompt into a launched site through research, three creative directions, three coded variations and four human decisions. Unlike one-shot generators, every step leaves a file you can read, and this site is the proof: it was made that way.**

Short form, for the meta description and OG card: *Six AI agents, four human gates, one prompt to a launched website. This site is its own case study.*

## Value proposition per persona

| Persona | Their job | What we offer | Proof the site shows |
|---|---|---|---|
| **Maya**, agent-native builder | "Get better than one-shot output without babysitting the agent." | A ready-made process for the agents she already uses. Six roles, briefs and reports on disk, Impeccable's design vocabulary and slop detector built in. Setup is one sentence. | This project's briefs, reports and git log; the detector result; the three variations side by side |
| **Tomás**, studio owner or freelancer | "Know whether this produces work I can bill for, and that I stay in charge." | Humans decide at exactly four points, with three real options each time, an independent Review agent, and a published quality bar (WCAG 2.2 AA, Lighthouse budget). Shipped images use only commercially licensed workflows; see the licence table. | The four gate packets with the human's actual decisions; Review verdicts; Lighthouse and axe scores; the licence table |
| **Sam**, handed the repo | "Understand what this is and whether my machine can run it before I touch anything." | One diagram, plain definitions, honest requirements, and a health-check script that tells you what's missing. | Requirements card (GPU, disk, OS), `bootstrap --check` output, FAQ, glossary |

## Tone of voice

The voice is a studio's process notes: precise and warm, a little dry, never selling. It talks like the PLAYBOOK, not like a launch tweet.

| Do | Don't |
|---|---|
| Name the concrete thing: "Three coded variations, each on its own git branch, screenshotted at four widths." | Use superlatives: "ambitious", "frontier", "revolutionary", "supercharge" (the Cursor and CrewAI pattern in `../competitors.md`) |
| Point at the evidence: "Here is the brief Research received" (link to the file). | Claim without showing: "produces client-grade work" with no artefact beside it |
| Be honest about cost and limits: "Local image generation needs an NVIDIA GPU. Without one, Concept still delivers three directions with code-made art and licensed stock photos." (wording follows the human's answer to Q7) | Hide the requirements in an FAQ, or imply that it's free and effortless |
| Credit the humans: "You choose at four gates. Nothing ships without your yes." | Imply the AI replaces the designer ("no designers needed") |
| Use the team's own words consistently: brief, gate, thread, worktree, variation, with a glossary. | Invent marketing names for the parts, or swap synonyms between sections |

## Candidate hero lines

Each makes the setup sentence the call to action, shown in a copyable block directly below. *What happens next* line under the block: "That thread becomes your project manager. It sets up the tools, creates five agent threads, and asks for your first website prompt."

1. **"One prompt in. A website out. Four times, you decide."**
   *Setup block:* `Set up the website building team from BOOTSTRAP.md.`
   Why: states the whole system, including the human gates, in nine words. Strongest for Tomás.

2. **"This website started as one sentence. Here's everything that happened next."**
   *Setup block, introduced as:* "Yours starts with this one:" `Set up the website building team from BOOTSTRAP.md.`
   Why: makes the meta case study the hook (P1), and sets up the story outline directly. Strongest for Maya.

3. **"An AI design studio that shows its work."**
   *Subline:* "Six agent threads, three directions, three coded variations, four human gates. Runs on your machine." (add "Open source" once Q2 and Q4 are settled)
   *Setup block:* `Set up the website building team from BOOTSTRAP.md.`
   Why: names the category and the differentiator (transparency) in one short line. Strongest for Sam and for sharing.

Research recommends **2** for the home hero, because it sets up the story outline, and **3** as the OG card and meta title. The human or Concept may overrule this at G1/G2.
