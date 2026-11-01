# Competitor and reference teardown: how-it-works

Date: 2026-11-01. Screenshots in `research/refs/` as `<slug>-desktop.webp` (1440x900 viewport), `<slug>-desktop-scrolled.webp` (about 1.6 screens down) and `<slug>-mobile.webp` (390x844). These were captured with Playwright on 2026-11-01 and are for internal research only.

The set has eight sites. Three are explainers known for interaction or scroll storytelling, three are AI agent / dev-tool product sites, and two are process pages: one book-style, one from a design studio. Two more were consulted but not torn down in full (end of file).

---

## 1. Bartosz Ciechanowski, "Mechanical Watch" (interactive explainer)

- **URL:** https://ciechanow.ski/mechanical-watch/ (May 2022)
- **Targets:** curious generalists and engineers *(inferred)*
- **Positioning line:** The title is "Mechanical Watch". There is no tagline: the essay starts explaining straight away.
- **Page structure:** Power → Gears → Escapement → Balance → Mainplate → Click → Motion Works → Date → Keyless Works → Automatic Winding → The Size of it All → Further reading → Final words
- **Standout patterns:**
  - Each section adds one mechanism and gets its own small live demo, so the whole machine is built up piece by piece.
  - You drag to rotate the 3D models, and sliders scrub through time, reveal hidden parts or zoom in. Readers control the pace, so the scroll is never hijacked.
  - One link at the top pauses every animation on the page.
- **Weaknesses:**
  - About 5,000 words and dozens of demos is a big time commitment.
  - The demos have no text alternatives.
  - There is no `prefers-reduced-motion` support. The global pause is the only motion control.
  - Drag-to-rotate is awkward on a phone *(inferred)*.
- **Conversion path:** a Patreon link at the end and in the header
- **Tech / integrations:** custom WebGL, probably hand-written *(inferred)*. The stack isn't documented.
- **Screenshots:** `refs/ciechanowski-desktop.webp`, `refs/ciechanowski-desktop-scrolled.webp`, `refs/ciechanowski-mobile.webp`

## 2. The Pudding, "Women's Pockets are Inferior" (scrollytelling)

- **URL:** https://pudding.cool/2018/08/pockets/
- **Targets:** general readers interested in culture. The publication's own line is "The Pudding explains ideas debated in culture with visual essays" (https://pudding.cool/about/).
- **Positioning line:** "Women's Pockets are Inferior."
- **Page structure:** epigraph → main finding (front pockets 48% shorter, from 80 pairs across 20 brands) → interactive "what can actually fit?" test → caveats → back pockets → history → call to action → methods with data download
- **Standout patterns:**
  - The headline makes a claim, and the scroll-driven graphics then prove it.
  - Before the animated section starts, the page warns you and offers a "jump ahead" link to the final state: a manual opt-out from motion.
  - The object picker (phone, pen, hand) turns the argument into something you can test yourself.
  - It ends with methods and downloadable data, which earns trust.
- **Weaknesses:**
  - There is no `prefers-reduced-motion` handling, only the manual skip link.
  - The chart images have no alt text.
  - The Pudding's own guide warns that scroll triggers on mobile are fragile, for example vh units "will mess with your scroll triggers" (https://pudding.cool/process/responsive-scrollytelling/).
- **Conversion path:** Patreon or newsletter (https://pudding.cool/)
- **Tech:** d3plus for the fit test. Their current starter is SvelteKit with `Scrolly.svelte`, a `MotionToggle` component, a focus trap and sr-only helpers (https://github.com/the-pudding/svelte-starter). That is a good model of an accessible scrollytelling kit.
- **Screenshots:** `refs/pudding-pockets-desktop.webp`, `refs/pudding-pockets-desktop-scrolled.webp`, `refs/pudding-pockets-mobile.webp`

## 3. Transformer Explainer, Polo Club at Georgia Tech (interactive AI-pipeline explainer)

- **URL:** https://poloclub.github.io/transformer-explainer/ (hosted on GitHub Pages; about 9.1k stars at https://github.com/poloclub/transformer-explainer)
- **Targets:** students and non-experts learning how LLMs work
- **Positioning line:** "Transformer Explainer: LLM Transformer Model Visually Explained"
- **Page structure:**
  - A live tool fills the first screen: prompt box, Generate, temperature and sampling controls, and the full pipeline diagram (Embedding → Attention → MLP → Probabilities).
  - A 20-step guided tour card sits on top of it.
  - Long-form sections follow: What is a Transformer?, Architecture, Embedding, Transformer Block, Output Probabilities, Interactive features, Video, Implementation.
- **Standout patterns:**
  - You type your own input and watch it flow through the whole pipeline. This is the closest analogue to "follow one prompt through the team".
  - It shows the overview first and lets you open any stage for detail.
  - Controls show cause and effect immediately: moving the temperature slider changes the output probabilities live.
  - The "1 / 20" tour card guides first-time visitors without blocking the tool (see screenshot).
- **Weaknesses:**
  - The page says "GPT-2 model is being downloaded (600MB)" on first load (screenshot), which makes it heavy on mobile.
  - Details often appear on hover only, which fails on touch and keyboard *(inferred)*.
  - No accessibility statement.
  - The dense diagram is hard to read at 390 px (`refs/transformer-explainer-mobile.webp`).
- **Conversion path:** none explicit. GitHub, paper and video icons sit top right.
- **Tech:** Svelte, D3, ONNX Runtime running GPT-2 in the browser, Vite, Tailwind (repo README)
- **Screenshots:** `refs/transformer-explainer-desktop.webp`, `refs/transformer-explainer-desktop-scrolled.webp`, `refs/transformer-explainer-mobile.webp`

## 4. Claude Code (AI agent product site)

- **URL:** https://claude.com/product/claude-code
- **Targets:** individual developers, plus teams buying Team/Enterprise plans
- **Positioning line:** "Claude Code", with the subhead "Hand Claude a bug fix, test, or multi-day migration. Steer and review from your terminal, IDE, Slack, or web."
- **Page structure:** hero with app mockup → "Other ways to use Claude Code" surface tiles (Terminal, Web, iOS, Android, GitHub, VS Code, JetBrains) → logo strip → pricing tabs → feature news → install section → use-case tabs with real terminal transcripts → "Meets you where you code" → Slack → testimonials → integrations → FAQ → closing CTA. About 16 sections.
- **Standout patterns:**
  - The claims name concrete tasks ("a bug fix, test, or multi-day migration") rather than adjectives.
  - The use-case tabs show a real transcript of the agent explaining the Excalidraw codebase, so it isn't invented UI.
  - The install command `curl -fsSL https://claude.ai/install.sh | bash` appears twice, mid-page and in the closing section.
  - The hero CTA adapts to the visitor's OS: it showed "Download for Windows" to our Windows user agent, with "Available for macOS, Linux, and Windows" underneath.
- **Weaknesses:**
  - At about 16 sections it is long, and the logo wall and testimonials repeat the same proof.
  - A large cookie-consent dialog covers part of the hero on first visit (screenshot).
  - The CLI install command is below the fold.
- **Conversion path:** "Download for Windows" (OS-aware), with "Read documentation" as the secondary CTA
- **Trust signals:** customer logos (Stripe, Notion, NASA, Uber…) and named quotes. No benchmarks.
- **Screenshots:** `refs/claude-code-desktop.webp`, `refs/claude-code-desktop-scrolled.webp`, `refs/claude-code-mobile.webp`

## 5. Cursor (AI agent product site)

- **URL:** https://cursor.com/
- **Targets:** professional engineers and enterprises
- **Positioning line:** "Cursor is your coding agent for building ambitious software."
- **Page structure:** hero with the desktop app over a painted landscape → logo row → "Works autonomously, runs in parallel" → "In every tool, at every step" → "Hand work to AI teammates" → testimonials → models → "Build with autonomous agents" → enterprise → changelog → research → blog → "Try Cursor now"
- **Standout patterns:**
  - Agents are shown as a status board, not a chat. The hero lists tasks under "IN PROGRESS 1" and "READY FOR REVIEW 4" with time stamps. That is our "six threads, gates where humans review" story told in one picture (see screenshot).
  - The demo inside the hero builds a landing page: it reads brand docs, writes `page.tsx`, and reports "Fonts preload in the head… 280ms first paint". The agent's work is shown with real-looking file diffs.
  - A warm off-white palette with a painted landscape and a serif inside the demo breaks away from the dark-gradient AI look.
  - The install command `curl https://cursor.com/install -fsS | bash` is embedded in a section.
- **Weaknesses:**
  - Many near-identical fake-UI panels.
  - Interchangeable superlatives ("ambitious", "frontier").
  - Two CTAs in the hero, plus "Download" in the header.
  - A cookie banner on first visit (screenshot).
- **Conversion path:** "Download for Windows" (OS-aware), with "Request a demo" as the secondary CTA
- **Trust signals:** famous-name testimonials, "over half of the Fortune 500", SOC 2
- **Screenshots:** `refs/cursor-desktop.webp`, `refs/cursor-desktop-scrolled.webp`, `refs/cursor-mobile.webp`

## 6. Factory (multi-agent "Droids" product site)

- **URL:** https://factory.ai/ (redirects to factory.com)
- **Targets:** engineering organisations; enterprise case studies such as EY with "more than 5,000 engineers" (https://www.factory.ai/)
- **Positioning line:** "MAKE YOUR SOFTWARE IMPROVE ITSELF", then "BUILD YOUR AUTONOMOUS SOFTWARE FACTORY" (screenshot)
- **Page structure:** hero with logo mark → headline → DOWNLOAD and CONTACT SALES → **install command with a copy button directly under the CTAs** → a full-width product view of sessions running
- **Standout patterns:**
  - The CLI command `curl -fsSL https://app.factory.ai/cli | sh` sits in the hero with a copy icon. This is the strongest "one instruction, impossible to miss" pattern in the set.
  - The design deliberately avoids the generic "AI tool" look. The agency calls it "industrial, geometric, and precise" (https://basement.studio/ai/showcase/factory-precision-in-the-age-of-autonomy). It uses all-caps grotesk, mono labels and an off-white background.
  - There is an agent-readable version of the site: when fetched by a tool, the site served a markdown page "for agents" and has an `llms.txt` (https://factory.ai/llms.txt). Our audience will point Claude Code at our site, so this matters.
- **Weaknesses:**
  - The agent-facing copy is all claims ("persistent Droid Computers") with no proof.
  - All-caps headings are tiring to read at length *(inferred)*.
- **Conversion path:** download the CLI, or contact sales
- **Screenshots:** `refs/factory-desktop.webp`, `refs/factory-desktop-scrolled.webp`, `refs/factory-mobile.webp`

## 7. Basecamp, Shape Up (a process taught as a web book)

- **URL:** https://basecamp.com/shapeup
- **Targets:** product teams, designers and programmers, founders *(inferred)*
- **Positioning line:** "Shape Up: Stop Running in Circles and Ship Work that Matters", by Ryan Singer
- **Page structure:** cover → foreword → Part 1 Shaping, Part 2 Betting, Part 3 Building (chapters 2 to 15) → appendices and glossary. Chapters link to each other with "Next:" links.
- **Standout patterns:**
  - The three phase verbs (Shaping, Betting, Building) are the book's top-level structure.
  - It names its pauses: "cool-down" is "a two-week break between cycles" (https://basecamp.com/shapeup/0.3-chapter-01). That maps directly onto naming our four gates.
  - One reusable diagram, the hill chart, is taught first with a homely analogy (cooking dinner) and then shown in real product screenshots (https://basecamp.com/shapeup/3.4-chapter-13).
  - Memorable lines carry the method: "A dot that doesn't move is effectively a raised hand."
- **Weaknesses:**
  - The landing page has no overview diagram, and the hill chart is buried in chapter 13.
  - The table of contents appears twice.
  - No progress indicator on long chapters.
- **Conversion path:** "Start reading", "Buy the print edition", and a soft pitch: "We built Basecamp to execute the techniques in this book."
- **Screenshots:** `refs/shape-up-desktop.webp`, `refs/shape-up-desktop-scrolled.webp`, `refs/shape-up-mobile.webp`

## 8. Work & Co, Process (design studio "how we work")

- **URL:** https://work.co/process/. Most top studios have no dedicated process page: Metalab's and Instrument's likely process URLs return 404, and ustwo, Koto, Locomotive and Clay offer only services pages.
- **Targets:** enterprise clients (the contact form asks for company and role)
- **Positioning line:** "Process", with the deck "The very picture of business success in the 21st century."
- **Page structure:** "Working Together" → "How We Deliver": eight principle blocks ("Small, senior teams", "Clear, ambitious KPIs", "Technology from day one", "20 days to market feedback", "Ongoing validation", "Zero big reveals", "Fully dedicated staffing", "Continuous optimization") → testimonials → newsletter
- **Standout patterns:**
  - Short, scannable principle headlines.
  - One concrete number makes it memorable: "20 days to market feedback".
  - It takes a clear stance. "Zero big reveals" means "fewer presentations and more actual work". That is the opposite of a gate model, and a useful foil when we explain why our four gates exist.
- **Weaknesses:**
  - No diagram, timeline or artefacts. Prototypes are mentioned but never shown.
  - The deck line is vague.
  - The page says nothing about AI, although the homepage promotes "agentic output" (https://work.co).
- **Conversion path:** newsletter subscribe only
- **Runners-up:**
  - **thoughtbot Playbook** (https://thoughtbot.com/playbook): an open playbook licensed CC BY-NC, with Design Sprints broken into eight numbered phases.
  - **ustwo Play Thinking** (https://ustwo.com/play-thinking/): a downloadable playbook PDF.
- **Screenshots:** `refs/workco-process-desktop.webp`, `refs/workco-process-desktop-scrolled.webp`, `refs/workco-process-mobile.webp`

---

## Also consulted

- **Linear Method** (https://linear.app/method):
  - Hero "Practices for building" in a large serif on black, over a faint interlocking-circles diagram (`refs/linear-method-desktop.webp`).
  - Content is numbered chapters (1.1, 2.1…) of imperative principles ("Decide and move on").
  - Chapter pages are text only, and the landing page renders client-side, so text fetchers see "Loading…".
  - Linear's pages also tell AI agents how to connect to the Linear MCP server.
- **Design Council, The Double Diamond** (https://www.designcouncil.org.uk/our-resources/the-double-diamond/):
  - The canonical source for our method: four phases, Discover, Define, Develop, Deliver.
  - The diagram is licensed **CC BY 4.0**, so we may redraw it with attribution.
  - The Council says work on it began in 2003 and it was shown from 2004 (https://www.designcouncil.org.uk/our-resources/the-double-diamond/history-of-the-double-diamond/), and elsewhere that it was "launched in 2004" (https://www.designcouncil.org.uk/our-resources/framework-for-innovation/). Say "2003–04", not the often-quoted 2005.
  - The Double Diamond is often read as a one-way sequence *(inferred)*. The Council's later Framework for Innovation is its expanded model (https://www.designcouncil.org.uk/our-resources/framework-for-innovation/).
  - Screenshots: `refs/design-council-double-diamond-*.webp`.
- **CrewAI** (https://www.crewai.com/): "The Enterprise Agent Build & Runtime for the work your business runs on". The open-source install is hidden behind "Book a Demo", and no crew is ever shown working. This is a pattern to avoid.

## Comparison

| Site | Audience | Positioning | Primary CTA | Strength | Weakness |
|---|---|---|---|---|---|
| Ciechanowski | Curious generalists | Topic as title, no tagline | Patreon | One mechanism per section, each with a live demo the reader controls | Very long; no alt text or reduced-motion support |
| The Pudding | General culture readers | Headline is a claim | Patreon / newsletter | Scroll proves the claim; skip-motion link; methods at the end | Fragile scroll triggers on mobile; no alt text |
| Transformer Explainer | Learners | "LLM Transformer Model Visually Explained" | (Generate) | Your own input flows through the real pipeline; tour card | 600 MB first load; hover-only details |
| Claude Code | Devs, teams | Concrete tasks in the subhead | OS-aware download | Real transcripts; install command printed twice | 16 sections; install below the fold; cookie dialog |
| Cursor | Pro engineers | "your coding agent for building ambitious software" | Download | Agents as a status board; warm non-gradient palette | Fake-UI sameness; superlatives |
| Factory | Eng orgs | "Make your software improve itself" | Download + curl with copy | Install command in the hero; industrial, not AI-generic; agent-readable site | Claims without proof |
| Shape Up | Product teams | "Stop Running in Circles and Ship Work that Matters" | Start reading | Named pauses; one reusable diagram; homely analogy | No overview diagram up front |
| Work & Co | Enterprise clients | "Process" | Newsletter | Principle headlines with one hard number; a clear stance | Text only; no artefacts |

## Patterns to adopt

- **Follow one prompt through the system.** Transformer Explainer shows how strong it is to watch your own input pass through the real pipeline. For us, a single real prompt (this project's own) should travel through the six agents and four gates. (Transformer Explainer, Ciechanowski)
- **One stage per section, overview first.** Ciechanowski adds one mechanism per section, and Transformer Explainer lets you open any stage for detail. Map that onto Discover → Define → Concept → Variations → Build → QA.
- **One master diagram, reused at every scale.** Shape Up does this with the hill chart. The double diamond, with the four gates marked on it, can be the hero, the progress indicator and the navigation. The Design Council's CC BY 4.0 licence lets us redraw it with credit.
- **Named pauses.** Shape Up names "cool-down". Each gate should get a name, what the human sees, and the choices they have (choose A/B/C, combine, or revise).
- **The install instruction in the hero, with a copy button, printed again at the end.** Factory and Claude Code both do this. Ours is a sentence, not a curl command: "Set up the website building team from BOOTSTRAP.md." Show what happens next.
- **Agents as a status board.** Cursor's "In progress / Ready for review" lanes are an obvious picture of six threads and gate pauses.
- **End with proof.** Like the Pudding's methods section, end with real artefacts and the files that produced them. Link to the actual brief, research, gate packets and git log.
- **A motion opt-out on the page as well as the OS setting.** Ciechanowski has a pause-all control and the Pudding a jump-ahead link. Respect `prefers-reduced-motion` too, which none of the three explainers do.
- **An agent-readable version.** Factory has `llms.txt` and Linear gives MCP hints. Our readers will paste the URL into Claude Code.
- **A concrete number or stance in each principle headline.** Work & Co's "20 days to market feedback" is the model, for example "4 gates. 3 directions. 3 coded variations. 1 prompt."

## Patterns to avoid

- **Heavy assets before the first interaction.** Transformer Explainer downloads 600 MB, and Ciechanowski's WebGL is heavy. Use a scripted replay of a real run, not a live model.
- **Hover-only detail and drag-only demos.** They fail on touch screens and keyboards.
- **Scroll-jacking and vh-based scroll triggers.** The Pudding's own guide warns against both.
- **A burying CTA.** CrewAI hides the open-source path behind "Book a Demo", and Claude Code's CLI command is below the fold.
- **Dark-gradient, glowing, fake-UI AI tropes and superlative headlines.** Cursor's sections are interchangeable, and Factory's agency moved away from the "AI tool" look on purpose.
- **Process described in text only, or a static diagram with generic alt text.** Work & Co, Linear Method and the Design Council all fall into this.
- **Implying the process is strictly linear.** A plain double diamond invites that reading *(inferred)*. Show the loop back from a gate ("revise: …").
- **Cookie walls on first visit.** Claude Code and Cursor both show one. A static site with no tracking needs none, which is a small, visible quality win.
- **Sixteen sections.** Aim for 6 to 8 chapters on the main page.
