# Key journeys: how-it-works

There is one journey per persona (`../personas.md`). Each step names the page and section (`sitemap.md`, `story-outline.md`) and the objection it answers. Arrival sources are *(inferred)*.

## Maya, agent-native builder: from a shared link to "copied the setup sentence"

**Arrives:** from Hacker News, X or a Discord link. Desktop. She has ~3 minutes of patience.

| Step | Where | What she does / sees | Objection answered |
|---|---|---|---|
| 1 | Home, hero | Reads "This website started as one sentence…". Sees the diagram with four gates and the setup block | "Is this just another AI site builder?" The meta claim is different, and checkable |
| 2 | Home, ch. 2 The studio | Scans the six lanes and opens one real brief | "Agents lose context between handoffs." Briefs, reports and STATUS on disk carry the context |
| 3 | Home, ch. 6 Variations | Sees three real variations side by side and the Impeccable detector result | "It'll still look like AI slop." Detector result and three distinct designs |
| 4 | Home, ch. 8 The receipt | Sees the commit strip and the time and cost figure (if Q6 approved) | "Six threads will burn my limits." An honest figure, or an honest "we didn't measure" |
| 5 | Home, hero or ch. 9 | Clicks **Copy** on the setup sentence (or selects it without JS) | n/a. **Success: copy** |
| 5b | (alt) footer / ch. 9 | Clicks the repo link and stars it, intending to try later | **Success: star** |

Risk: she bounces at step 1 if the hero looks like generic AI marketing. That is P3 and Impeccable's job.

## Tomás, studio owner: from curiosity to "starred the repo, shared with a partner"

**Arrives:** from a newsletter or a colleague's message. Evaluates on desktop, shares on mobile.

| Step | Where | What he does / sees | Objection answered |
|---|---|---|---|
| 1 | Home, hero | "One prompt in… four times, you decide" (or the chosen line). Gates are visible on the diagram | "Do I lose control?" There are four named human decisions |
| 2 | Home, ch. 4 to 7 gate cards | Reads what the human saw, the options and the choice at each gate | "Is this billable quality?" Three options per creative step, plus a decision record |
| 3 | `/made/` | Opens the full Gate 2 and Gate 3 packets and the Review verdict | "Who checks the work?" An independent Review agent, plus Lighthouse and axe scores |
| 4 | `/credits/` | Reads the model licence table: FLUX Klein under US$5M revenue, Z-Image Apache-2.0, upscaler rule | "Can I use the images for clients? Who owns them?" Plain licences, plus an honest note on AI authorship |
| 5 | `/made/` or home | Shares the URL with a partner. The OG card reads well | n/a |
| 6 | Footer | Stars the repo | **Success: star** (or copy, later) |

Risk: if the gate slots are still empty (pre-Phase 5), he finds no proof. That's why the site must not go public before G4 (Q2).

## Sam, handed the repo: from "what is this?" to "copied the setup sentence, knowing it will work"

**Arrives:** from the GitHub README link or a message. Starts on mobile, sets up on desktop.

| Step | Where | What Sam does / sees | Objection answered |
|---|---|---|---|
| 1 | Home, hero + ch. 2 | Gets the overview in one diagram and six role cards | "What even is this?" |
| 2 | `/setup/` requirements card | Checks the GPU, OS and disk needs up front | "Will my machine run it? I'm on a Mac." Honest table, plus the no-GPU path (Q7) |
| 3 | `/setup/` "Claude Code alone vs T3 Code" | Learns that T3 Code is optional | "What's T3 Code, and do I need it?" |
| 4 | `/setup/` glossary + FAQ | Looks up "worktree" and "gate" | Jargon |
| 5 | `/setup/` what happens next + health check | Sees that bootstrap asks before downloading ~20 GB and reports green/amber/red | "ComfyUI setup is painful." Pinned install and a health check |
| 6 | `/setup/` copy block | Copies the sentence on desktop | **Success: copy** |

Risk: a long requirements list could scare Sam off. Lead with "Most of it installs itself; you need a GPU, Node, Python and git".

## Objection to answer map

| Objection | Answered at |
|---|---|
| Token cost / usage limits | Home ch. 8; `/setup/` §5 |
| Context loss between agents | Home ch. 2 |
| AI slop | Home ch. 6; `/made/` §6 |
| Gates are bureaucracy | Home gate cards (what changed because of each decision) |
| Billable quality / control | Home ch. 4 to 7; `/made/` |
| Image licences and ownership | `/credits/`; Home ch. 5 guardrail note |
| GPU, Mac, ComfyUI pain | `/setup/` §2, §3, §6 |
| What is T3 Code | `/setup/` §4 |
