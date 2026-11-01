# Gate 1: open questions for the human

> **The Gate 1 packet is authoritative.** `gates/G1-strategy/README.md` holds the official options. This file uses the same question numbers and option letters, and adds Research's evidence for each. If the two ever differ, the packet wins.

Where the questions come from:
- Q1 to Q4: `BRIEF.md`.
- Q5 to Q7: Discover.
- Q8 to Q10: Define.
- Q11: Review's Gate 1 review.

The recommended option is listed first in each question's options line and marked. Evidence is in `../SUMMARY.md`, `../constraints.md` and the sibling files.

**How to answer:** "Gate 1: accept all recommendations", or question numbers with letters (for example "Q7 B, Q10 C"), or "revise: …".

---

## Q1. Product name

**Options:**
- **A. Keep "Website Building Team"** (recommended). Concept designs a wordmark and voice.
- B. Name the studio. This adds a naming round to G2.
- C. Keep the name, and add a short nickname for the wordmark.

**Evidence for A:**
- The setup sentence literally says "website building team".
- Sam arrives from the GitHub repo and needs the names to match.
- In our competitor set, concrete names and claims beat invented ones (`../competitors.md`).

## Q2. Hosting and going public

**Options:**
- **A. GitHub Pages. Make the repo public and publish at G4, $0** (recommended).
- B. Keep the repo private and pay for a plan with Pages. The site is still public, and the G4 approval rule is lost.
- C. Another static host (Netlify, Cloudflare Pages).

**Evidence for A:**
- Pages limits are comfortable: 1 GB site and 100 GB/month bandwidth (https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).
- On the Free, Pro and Team plans, GitHub's required-reviewer rule for deployments works only on public repos. So only A keeps Gate 4 enforced by the tooling (Backend, `api/stack-proposal.md`).
- Order under A: make the repo public, set the reviewer on `github-pages`, then merge the deploy workflow.

## Q3. How meta

**Options:**
- **A. Fully meta: this run is the spine** (recommended).
- B. A generic explainer with a "made by the team" strand.
- C. A generic explainer only.

**Evidence for A:**
- In Stack Overflow's 2025 survey, 84% of developers use or plan to use AI tools, but only 3.1% highly trust their output (https://survey.stackoverflow.co/2025/ai).
- None of the competitors we studied shows its own process end to end (insight 1).
- The cost of A: the build must handle slots, and the site can't launch before G4.

## Q4. Repo licence

**Options:**
- **A. Apache-2.0** (recommended). It matches Impeccable. Our NOTICE also carries Impeccable's upstream NOTICE and the two MIT notices.
- B. MIT.
- C. Something else.

**Evidence for A:**
- Impeccable is Apache-2.0 with a NOTICE.md (https://github.com/pbakaus/impeccable).
- Apache-2.0 includes a patent grant.
- MIT and Apache-2.0 can be combined (https://www.apache.org/legal/resolved.html).
- Model weights are not in the repo, so they keep their own licences either way.

## Q5. Quote agents and your gate decisions verbatim?

**Options:**
- A. Yes, everything.
- **B. Yes, curated** (recommended). The PM picks the excerpts. Your decisions are quoted as written. Machine paths, ids and personal details are removed.
- C. Paraphrase only.

**Evidence for B:** verbatim excerpts are the strongest proof (P1). In 2026, 93% of developers said trust requires source attribution (https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/). Curation keeps the quotes readable and private.

## Q6. Publish time and cost?

**Options:**
- A. Time and cost.
- **B. Time now (already being logged); decide on cost at G4. Only you can see your usage** (recommended).
- C. Neither.

**Evidence for B:**
- Token cost is Maya's first objection. Anthropic reports multi-agent systems use about 15x the tokens of a chat (https://www.anthropic.com/engineering/multi-agent-research-system).
- Time costs nothing to measure: git timestamps record it.
- A cost figure depends on your plan, so it's your call later.

## Q7. No NVIDIA GPU

**Scope:** this sets **the kit's scope and what the site tells visitors**. It doesn't affect this project's own imagery, because this machine has a GPU.

**Options:**
- **A. Document the free art-directed path only** (recommended). Concept still delivers three directions with style tiles, code-made art and licensed stock photos.
- B. A, plus rented cloud GPU support. About ½ day of Concept's work; about $1–3 per Gate 2 round (third-party prices).
- C. A, plus a BFL image API adapter. About $0.01–0.04 per image; BFL terms apply; no tuned workflows.
- D. State that an NVIDIA GPU is required.

**Evidence for A:**
- The GPU is Sam's first objection: an RTX 5070 12 GB was listed at $855.99 on US Amazon on 20 Oct 2026 (https://computingforgeeks.com/best-gpu-for-stable-diffusion-comfyui/).
- Macs are 2 to 4 times slower without CUDA (https://insiderllm.com/guides/stable-diffusion-mac-mlx/).
- Bootstrap already supports `--skip-comfyui`, and Concept's no-GPU note defines what it delivers in that mode.

## Q8. Hero line

**Options:**
- **A. "This website started as one sentence. Here's everything that happened next."** (recommended). Share card: "An AI design studio that shows its work."
- B. "One prompt in. A website out. Four times, you decide."
- C. Leave it to Gate 2.

**Evidence for A:** it makes the case study the hook (P1) and leads straight into the story outline. All the options use the setup sentence as the call to action (`positioning.md`).

## Q9. Analytics

**Options:**
- **A. None at launch. Use GitHub stars, clones and views** (recommended).
- B. GoatCounter (free for reasonable public use, cookieless), with a copy-button count.
- C. Conventional analytics. Needs a consent banner; not recommended.

**Evidence for A:**
- Zero tracking and no banner fit the privacy story.
- GitHub's traffic API covers clones and views, but only for 14 days (https://docs.github.com/en/rest/metrics/traffic).
- GoatCounter's hosted service is "free for reasonable public usage" (https://www.goatcounter.com/). Switch to B later if the copy rate turns out to matter (`metrics.md`).

## Q10. Research screenshots of other sites when the repo goes public

What's at stake:
- **The screenshots:** 46 files in `research/refs/`, including Nintendo (Kirby), Kurzgesagt and Monument Valley art.
- **The rest of the history:** it also holds machine paths, thread ids and two ~20 MB `impeccable.exe` blobs (Review's kit audit).

**Options:**
- A. Keep them.
- B. Delete them from the current files only. They stay downloadable from git history.
- C. At G4, rewrite this repo's history to remove them everywhere, then publish. The real commit history stays as proof. **(PM recommends.)**
- D. Publish a fresh repo with one squashed initial commit, and keep this repo private as the working copy. The site's git-log chapter uses a snapshot exported before the squash. **(Review recommends.)** It also removes old machine paths and thread ids from public history.

**The two positions:**
- **PM, for C:** the site's promise is "every step leaves a file you can read", and the honest history, minus the screenshots, is part of that proof.
- **Review, for D:** it is the cleanest public record and the least disruptive operation, with no rewriting of the repo five agents are working in.

**Research's evidence:**
- The research text, with every URL, keeps its value without the images.
- The site never shows them under any option.
- A and B leave third-party art publicly downloadable.

## Q11. FLUX Klein licence

**Options:**
- **A. Confirm that your annual revenue, including affiliates, is under US$5M** (recommended if true). Shipped images may then use FLUX Klein. Review's Gate 2 visual check is the required output review, and `/credits/` carries the AI disclosure.
- B. Not under US$5M, or unsure. Shipped images use Z-Image Turbo (Apache-2.0) only, and Klein stays for concept boards.

**Evidence:** the FLUX Kommunity License allows commercial use of outputs only for "Qualifying Users" with under US$5M gross annualized revenue, including affiliates. It also requires content filtering or output review, and AI disclosure where the law requires it (https://huggingface.co/black-forest-labs/flux-3-image-klein). Z-Image Turbo is Apache-2.0 (https://huggingface.co/Tongyi-MAI/Z-Image-Turbo).
