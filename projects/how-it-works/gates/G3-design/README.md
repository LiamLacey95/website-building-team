# Gate 3: Design selection (how-it-works)

**What you're deciding:** which of the three Marble Run layouts becomes the site, and whether to fold the best parts of the other two into it. After this, Phase 5 builds the full site on the chosen layout, and Gate 4 is the release sign-off.

**How to answer:** "Gate 3: accept the recommendation", or question numbers with option letters (for example "Q1 A, Q2 B"), or "revise: …".

## Try them

They run locally while the dev servers are up: A on http://localhost:4321/, B on :4322, C on :4323 (add `/setup/` for the setup page). Evidence: `screenshots/g3/contact-sheet.html` (24 screenshots at 390, 768, 1440 and 1920) and the motion clips in `screenshots/g3/motion/`. First screens side by side: `contact-sheet.html` in this folder.

## The three variations

All three use the same design system (Direction C's tokens, fonts and clay cast), the same copy and the same marble engine. They differ in structure.

| | A · The long run | B · Stations | C · The table |
|---|---|---|---|
| Idea | One continuous scroll-driven track down a long page; the marble waits at each barrier | A full-screen scene per station, Previous/Next; Next stays locked until you lift the barrier | The whole run on one tabletop: drop the marble, open any station in place, lift the barriers |
| Tests | Does one unbroken journey feel physical? | Do framed shots feel more cinematic? | Does play-first beat scroll-first for memorability? |
| Review score (bar 7.0, no axis below 6) | **7.05** · passes | **6.65** · fails (usability 5) | **7.85** · passes |
| Axes D / C / S / P / U | 8 / 7 / 8 / 6 / 6 | 8 / 6 / 7 / 7 / 5 | 8 / 9 / 7 / 7 / 8 |
| Strength | The deepest story: gate cards, the "second opinion" exchange | The most cinematic single frames | The most original, and the first screen *is* the explanation; performance 96, axe 0 |
| Weakness | 25,000 px tall; 5.4 s blocking time on mobile; overflows at 390 | Reads as a slide deck; slow first image; tiny dots | Story is thinner than A; small station portholes; label collision at 390 |

Axes: D design, C creativity, S storytelling, P polish, U usability (`docs/review/checklists/creativity.md`). Full scorecards and evidence: `review.md`.

## Recommendation

**C · The table, with Review's hybrid additions.** Review estimates 8.2 or more once they land. The hybrid keeps C's structure and adds:
- A's gate cards ("What you see", "Your options") and the invented "second opinion" exchange inside the opened stations;
- B's full-bleed stage image for each opened station;
- "Drop the marble" pauses at each crossing and lights the station it passes, so playing the run also tells the story;
- bigger station portholes, the 390 label fix, and station markers in HTML so the table works without JS.

A's long scroll is the one part Review would not carry over.

## The questions

**Q1. Which layout?**
- **C · The table** (recommended)
- **A · The long run**
- **B · Stations** (fails the bar today; would need the LCP, tap-target and image fixes first)

**Q2. Fold in the best of the others?** (applies to whichever layout you pick)
- **A · Yes, Review's hybrid** (recommended): A's gate cards and dialogue, B's stage images, the marble that pauses and lights each station.
- **B · Only the fixes:** keep the chosen layout as it is and fix the findings, nothing borrowed.
- **C · Your own mix:** tell us what to borrow.

## Fixed in Phase 5 whatever you choose

- `<pre>` blocks on /setup/ aren't keyboard-scrollable (axe serious): add `tabindex="0"` and a name.
- Favicon 404, the CLS outlier, and the remaining minors in `review.md`.
- Re-check the security header on the Vercel preview at Gate 4.

## Already true

- Every Gate 2 finding on Direction C is fixed: exactly six figures in all 18 images, distinct Front-end and Review colours, token contrast, no fake text in shipped images.
- The four gate hands are clean at 100%. Licences: 18 of 18 images on a commercially licensed chain.
- Review verdict: **PASS WITH NOTES**.
