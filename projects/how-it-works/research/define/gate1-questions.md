# Gate 1: open questions for the human

These are all the open questions for the human, in one list.
- Q1 to Q4 come from `BRIEF.md`.
- Q5 to Q7 are new from Discover.
- Q8 to Q10 came up during Define.

Each has options and a recommendation. Evidence is in `../SUMMARY.md`, `../constraints.md` and the sibling files.

**Quick answer:** to take every recommendation, reply "Gate 1: accept all recommendations". Otherwise, give the question number and an option letter.

---

## Q1. Product name

| Option | What it means |
|---|---|
| **A. Keep "Website Building Team"** (recommended) | Same name as the repo and the setup sentence. Concept gives it a wordmark and voice |
| B. Name the studio | A new brand name, with "a website building team" as the descriptor. It costs a naming round inside G2 |
| C. Keep the name, add a short nickname for the wordmark | A middle path |

**Why A:** the setup sentence literally says "website building team". Sam arrives from the GitHub repo and needs the names to match. Our research found concrete names beat invented ones in this category (`../competitors.md`).

## Q2. Hosting, and when it goes public

| Option | What it means |
|---|---|
| **A. GitHub Pages from this repo, deployed by Actions; make the repo public and publish at G4** (recommended) | Free with HTTPS. Pages for a **private** repo needs a paid GitHub plan, so publishing free means making the repo public. Backend's stack proposal covers the details |
| B. Keep the repo private; pay for a GitHub plan that allows Pages on private repos | The site is public, the code isn't. That contradicts "anyone can clone it" |
| C. Another static host (Netlify, Cloudflare Pages) | Works from a private repo. Another account to manage |

**Why A:**
- The kit is meant to be cloned, so the repo has to be public anyway.
- Pages limits are comfortable (1 GB, 100 GB/month).
- Going live at G4 keeps empty case-study slots off the public web.

## Q3. How meta should the site be?

| Option | What it means |
|---|---|
| **A. Fully meta: the site's own run is the spine** (recommended) | The home page follows this project's prompt. `/made/` holds every gate packet. Later gates fill slots at Phase 5 |
| B. Explain the system generically, with a "made by the team" strand | Easier to write; weaker proof |
| C. Generic explainer only | No case study |

**Why A:**
- Trust is the bottleneck: 3.1% of developers highly trust AI output, and 93% want attribution.
- No competitor shows its own process end to end (insight 1).
- Cost: the build must handle slots, and the site can't launch before G4.

## Q4. Repo licence

| Option | What it means |
|---|---|
| **A. Apache-2.0** (recommended) | Same licence as Impeccable. One LICENSE plus a NOTICE file covers everything, and it includes a patent grant |
| B. MIT | Shorter and very common. Impeccable stays Apache-2.0 inside the repo with its own LICENSE and NOTICE |
| C. Something else (for example, source-available) | The site must explain the restrictions |

**Why A:** it matches the bundled Apache-2.0 skills and makes attribution simple (`../constraints.md`). Model weights aren't in the repo and keep their own licences either way.

## Q5. May the site quote agent messages, reports and your gate decisions word for word?

| Option | What it means |
|---|---|
| A. Yes, all of it | Maximum proof. Some messages may be messy |
| **B. Yes, curated** (recommended) | The PM picks excerpts. Your gate decisions are quoted as you wrote them. Machine paths, thread ids and anything personal are removed |
| C. Paraphrase only | Safer, less convincing |

**Why B:** verbatim excerpts are the strongest proof (P1). Curation keeps them readable and private.

## Q6. Should the site publish what the run took (time, and possibly cost)?

| Option | What it means |
|---|---|
| A. Time and cost | The most honest answer to the biggest objection, token cost. Needs you to report your usage or billing at the end, because only you can see it |
| **B. Time now; decide on cost at G4** (recommended) | Wall-clock time per phase comes free from git timestamps. At G4 you decide whether to add a cost or usage figure |
| C. Neither | Chapter 8 shows only the commit log |

**Why B:** time costs nothing to measure and is already being recorded. The cost figure is persuasive (Maya's first objection) but personal to your plan, so it's your call later. **Action if A or B:** the PM keeps a note of phase start and end times from now on.

## Q7. What does the site say to people without an NVIDIA GPU (or on a Mac)?

The facts:
- Bootstrap already has `--skip-comfyui` ("image generation unavailable").
- `BOOTSTRAP.md` says macOS works for everything except fast image generation.
- Klein also needs a free Hugging Face account and token.

| Option | What it means |
|---|---|
| **A. Document a supported no-GPU path** (recommended) | Concept works from the client's own photos, stock or illustration, and everything else runs. Concept and the PM confirm what the Concept role does in that mode before G4 |
| B. State that a GPU is required | Simple and honest. Turns away Mac users and people with laptops |
| C. Add a cloud GPU option | Out of scope for this project |

**Why A:** the switch already exists, and the GPU is Sam's first objection (a 12 GB card was about US$856 in Oct 2026). It needs the Concept role to confirm, so it is flagged to the PM.

## Q8. Hero line (can be deferred to Gate 2)

| Option | Line |
|---|---|
| **A** (recommended for home) | "This website started as one sentence. Here's everything that happened next." |
| B | "One prompt in. A website out. Four times, you decide." |
| C (recommended for the share card) | "An AI design studio that shows its work." |

All three use the setup sentence as the call to action (`positioning.md`). It's fine to leave this to Concept and Gate 2.

## Q9. Analytics

| Option | What it means |
|---|---|
| **A. None at launch; use GitHub stars, clones and views** (recommended) | Zero tracking, no banner. We can't count setup-sentence copies |
| B. Cookieless analytics with a copy-button event | GoatCounter (free for non-commercial use) or Plausible (paid, about US$9/month). Prices are from aggregators and unverified. Still no banner |
| C. Conventional analytics | Needs a consent banner. Not recommended |

**Why A:** it is the simplest and cleanest option and fits the privacy story. Switch to B later if the copy rate turns out to matter (`metrics.md`).

## Q10. Third-party reference screenshots when the repo goes public

`projects/how-it-works/research/refs/` has 46 screenshots of other companies' sites (2.4 MB), captured for internal research.

| Option | What it means |
|---|---|
| A. Keep them in the public repo | Research and commentary use. Low risk, but not our content |
| **B. Remove them from the tree before going public; keep the links and descriptions** (recommended) | They stay in git history unless history is rewritten. That is acceptable for research screenshots in our view, but it is your call |
| C. Remove them and rewrite history before publishing | Cleanest, but a disruptive operation for the PM |

**Why B:** the research text, which carries all the URLs, keeps its value without the images. The site never shows them either way.
