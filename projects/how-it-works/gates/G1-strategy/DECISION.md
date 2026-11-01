# Gate 1 decision (how-it-works)

Decided by the human on 2026-11-01. These override anything earlier in `BRIEF.md`, `research/define/` or `api/stack-proposal.md`.

| # | Question | Decision | What it means for the team |
|---|---|---|---|
| 1 | Product name | **A. Keep "Website Building Team"** | Concept designs a wordmark and voice |
| 2 | Hosting | **C. Another host: Vercel** ("Vercel maybe") | Static Astro deployed to Vercel at the site root (no GitHub Pages base path). Going live needs the human's Vercel account and approval at Gate 4. The repo doesn't have to be public for hosting |
| 3 | How meta | **A, as a highly creative showcase.** In the human's words: "A highly creative breakdown of how this setup works. The website will be a showcase of its capabilities, so we are measuring how creative, interesting and polished the final output is" | **The success measure is creativity, interest and polish.** Creative ambition comes first; accessibility and reduced motion still apply, and performance stays reasonable, but the 10 KB JS cap and "static first" lean are relaxed where a set piece earns it |
| 4 | Repo licence | Human doesn't mind; **PM chose Apache-2.0** (matches the vendored Impeccable) | PM adds `LICENSE` and `NOTICE` |
| 5 | Quote agents and decisions verbatim | **No: make them up** | Dialogue, agent messages and gate decisions on the site are written for the story, not quoted from the repo. No verbatim-excerpt pipeline needed. Real generated imagery and screenshots may still be used where they look good |
| 6 | Time and cost | **Don't mention either** | No timings, costs or token figures on the site. The PM's timeline stays internal |
| 7 | No NVIDIA GPU | **D. Say it's not suited to machines without an NVIDIA GPU** | Site and README say so plainly; no fallback marketing. The kit's `--skip-comfyui` path stays as it is |
| 8 | Hero line | Human: "you choose". **PM: A, as the working line**: "This website started as one sentence. Here's everything that happened next." | Concept may propose stronger lines at Gate 2 |
| 9 | Analytics | **None** | No analytics, no banner |
| 10 | Third-party screenshots | **C. Rewrite history at G4 to remove them; keep the real log** | PM does it at Gate 4, before anything goes public, with all agents paused |
| 11 | FLUX Klein | **A. Revenue with affiliates under US$5M** | Klein images may ship. Review's G2 visual check is the output review; `/credits/` carries the AI disclosure |
