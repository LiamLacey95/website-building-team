# Content inventory: how-it-works

Each concept below is paired with a real artefact from this repo that can illustrate it. **Exists now** means the file is on disk today (2026-11-01). **Produced later** means the process itself will create it, so the site can only show it once that phase has run. Paths are relative to the repo root.

## Concepts the site must explain

| # | Concept | What to say (the gist) | Real artefact that illustrates it | Status | Copy we must write |
|---|---|---|---|---|---|
| 1 | **The prompt** | It all starts from one sentence | `projects/how-it-works/BRIEF.md`, which quotes it verbatim: "your first website that i want you to build is a creative website that runs through how this works." | Exists now | Hero framing; "this site started as this sentence" |
| 2 | **The six roles** | PM plus five long-lived specialist threads, each owning its own folders | `.team/PLAYBOOK.md` team table; `.team/roles/*.md`; the STATUS.md roster | Exists now | One card per role: what it does, what it owns, one real output |
| 3 | **Threads and messaging** | Each agent is a top-level thread. The PM briefs it, it reports back DONE/BLOCKED/QUESTION, and everything lands on disk | `projects/how-it-works/briefs/01-research-discover.md`; `projects/how-it-works/reports/01-research-discover-research.md`; the report format in the PLAYBOOK | Exists now (report: when this brief closes) | A short "life of a brief" explainer; the message format |
| 4 | **Double Diamond phases** | Discover → Define → Develop → Deliver, mapped onto 0 Intake to 6 QA | PLAYBOOK Method table; Design Council diagram (CC BY 4.0, redraw with credit) | Exists now | One line per phase plus its output |
| 5 | **The four human gates** | G1 Strategy and scope, G2 Creative direction, G3 Design selection, G4 Release sign-off. Max four; a revision round stays inside its gate | `projects/how-it-works/gates/G1…G4/` (README, contact-sheet.html, review.md); `.team/DECISIONS.md` | Produced later (G1 after Define) | Per gate: what you see, what you decide, the options (A/B/C, combine, "revise: …") |
| 6 | **Research** | Competitors, personas, content, references, constraints, all cited | This folder: `projects/how-it-works/research/` (SUMMARY, screenshots in `refs/`) | Exists now | "What Research found for this very site" |
| 7 | **ComfyUI image pipeline** | Local generation on your own GPU; WEB1 to WEB6b workflows; every image has a JSON sidecar recording its prompt and settings | `artgen/README.md` workflow table and timings (for example WEB3 ~6 s per draft, WEB1 ~30 s at 2 MP); `artgen/output/_smoke/*.png` and `.json` | Exists now (smoke tests are git-ignored outputs; Concept to supply a committed pick) | How a direction goes from drafts to a hero image; why "no text in prompts" |
| 8 | **Commercial-licence guardrail** | Shipped images use commercially licensed models only; the non-commercial upscaler is for boards only and `generate.py` enforces it | `artgen/output/_smoke/upscaler_side_by_side.png`; the shipping-rule paragraph in `artgen/README.md` | Exists now | A short, honest licence note |
| 9 | **Three creative directions** | Concept makes three distinct directions: moodboard, palette, type, key art and a style tile each | `projects/how-it-works/concepts/<direction>/` | Produced later (Phase 3, G2) | Caption per direction; why three |
| 10 | **Variations in worktrees** | Three coded versions of home plus one interior page, each on its own git branch and worktree, running side by side on ports 4321 to 4323 | `tools/variants.mjs`; branches `variant/how-it-works-g3-{a,b,c}-*`; `projects/how-it-works/variants/*.md` hypothesis files | Produced later (Phase 4, G3). A dry-run precedent exists in `.team/history/2026-11-01-initial-setup/frontend-dryrun-screenshots/` | Plain explanation of a worktree (a second checkout of the same repo on another branch) |
| 11 | **Screenshots and contact sheets** | Every variation is captured at 390, 768, 1440 and 1920 px and laid out on one page | `tools/screenshot.mjs`, `tools/contact-sheet.mjs`; dry-run `contact-sheet.html` in the history folder | Exists now (dry run); real ones produced later | Caption: "what the human actually sees at Gate 3" |
| 12 | **Impeccable** | Shared design vocabulary (`/impeccable shape`, `critique`, `audit`, `polish`) plus a deterministic AI-slop detector (`npx impeccable detect`) | `projects/how-it-works/PRODUCT.md`, `DESIGN.md`; detector output in `review/` | Produced later (after G1/G2) | What "slop" means, with 3 to 4 named tells; credit (Apache-2.0) |
| 13 | **Review** | An independent agent that is read-only outside its own folder and checks every gate packet: WCAG 2.2 AA, Lighthouse, axe, contrast, detector, code review | `docs/review/checklists/`, `docs/review/tools/`; `projects/how-it-works/review/*.md`; `gates/G*/review.md` | Tools exist now; verdicts produced later | "Nothing reaches you without passing Review" |
| 14 | **Build and release** | Front-end and Backend build the chosen variation; static on GitHub Pages | `projects/how-it-works/web/`; `api/` stack proposal; deploy notes | Produced later | Short; this is the least novel part |
| 15 | **Git as the record** | Each role commits only its own paths; the PM merges and pushes; history is the audit trail | `git log` (16 commits so far, each prefixed with its role, for example `research: …`, `concept: …`) | Exists now (grows) | "Every step is a commit" plus a live-looking log strip |
| 16 | **Setup** | Clone, open in Claude Code or T3 Code, say "Set up the website building team from BOOTSTRAP.md." That thread becomes the PM | `README.md` Set it up; `BOOTSTRAP.md` steps 0 to 5; `node scripts/bootstrap.mjs --check` | Exists now (bootstrap script is being built under the 03 kit briefs) | The install block, plus "what happens next" in 4 to 5 steps |
| 17 | **Requirements and honesty** | Windows or Linux; NVIDIA GPU with 12 GB VRAM (8 GB reduced); ~40 GB disk; Node 20+; Python 3.11/3.12; humans decide at the gates; model licences apply | `README.md` Requirements; `BOOTSTRAP.md` §1 | Exists now | Requirements card; "what it won't do" list |
| 18 | **Licences and credits** | Repo licence (to be decided); Impeccable Apache-2.0; models and their terms; Double Diamond CC BY 4.0; fonts (OFL) | `README.md` Licences; `artgen/README.md` Models and licences | Partly (repo licence open) | Credits page or footer section |

## Pages

The working assumption is a single long story page plus a few short pages *(inferred; IA is decided in Define)*.

| Page | Purpose | Key content blocks | Priority | Source |
|---|---|---|---|---|
| Home (the story) | Explain the system by following this site's own prompt through it | Hero + install block; overview diagram; roles; phases and gates; image pipeline; variations; Impeccable and Review; proof; setup again | must | draft + generate + artefacts |
| Case study: "How this site was made" | Proof: the real artefacts of this run, gate by gate | Brief, research summary, 3 directions, 3 variations, review verdicts, decisions, timings | must (can be a deep section of Home) | artefacts (produced later) |
| Set up | Requirements, steps, FAQ, troubleshooting | Requirements card, the sentence, what bootstrap does, FAQ | must | draft from README and BOOTSTRAP |
| Roles (or a section) | One card or anchor per agent, with its files | 6 role cards | should | draft from roles/*.md |
| Credits and licences | Attribution and licences | Table | must (can be the footer) | draft |
| `llms.txt` / markdown twin | Agent-readable summary | Plain text | could | draft |
| 404 | | | could | draft |

## Client must supply (here the "client" is the human)

- [ ] Product name decision: keep "Website Building Team" or choose a studio name (G1)
- [ ] Repo licence (G1)
- [ ] Hosting decision and public URL (G1); the GitHub repo URL and owner name for links
- [ ] Approval to show real thread transcripts or messages, if we want to quote them *(inferred)*
- [ ] Any personal credit line ("made by …") and social links
- [ ] Honest run figures if wanted: wall-clock time, token or cost estimate for this project (only the human sees billing)

## We can draft

- All explanatory copy, from PLAYBOOK, README, BOOTSTRAP, roles and artgen README (accurate to the kit after the 03 briefs)
- Role cards, gate cards, the phase timeline, glossary, FAQ, requirements card, credits table
- Image prompts for key art (Concept)
- Captions for every artefact shown

## Open questions for the human

- How meta: a full case study, or a light "made by the team" strand? (Recommendation in SUMMARY)
- May we publish excerpts of agent messages and reports verbatim?
- Do we show a cost or time figure? If so, who measures it?
