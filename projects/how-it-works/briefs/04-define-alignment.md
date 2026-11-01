# Brief 04-define-alignment (project: how-it-works)

Owners: Research and Backend (sections below). Phase: 2 Define follow-up. Not blocking Gate 1: the packet (`gates/G1-strategy/README.md`) is authoritative for the human's options.

Source: Review's Gate 1 review, `gates/G1-strategy/review.md`. Align your files with the revised packet and the findings, commit with a pathspec, write `reports/04-define-alignment-<role>.md`, send DONE.

## Research

1. `research/define/gate1-questions.md`: make Q1 to Q11 match the packet's options and letters exactly (Q7 now A to D; Q10 now A to D with PM and Review positions; new Q11 on the FLUX Klein revenue condition). Add a line at the top saying the packet is authoritative.
2. MINOR 2: reword the six claims to match their sources (84% "use or plan to use", 2025 survey; drop the Firefox date; Design Council "linear" attribution; Show HN study is one blogger's analysis; Claude Code "agents of choice (66%)"; Thaler rests on the 2025 D.C. Circuit ruling; GoatCounter "free for reasonable public usage").
3. MINOR 3: stale kit facts in `sitemap.md` and `journeys.md`. Better: say `/setup/` takes requirements from `README.md` and `BOOTSTRAP.md` at build time.
4. MINOR 4: positioning: no "open-source" until Q2 and Q4 are settled; "Shipped images use only commercially licensed workflows; see the licence table".
5. MINOR 5: add an accessibility statement (a `/credits/` section) and the AI-imagery disclosure to the sitemap.
6. MINOR 7: the hallway test owner is the human, or drop the target.
7. NITs: "19 references" vs 20 rows; one plain sentence on Impeccable in chapter 6.

## Backend

1. MINOR 1: in `api/stack-proposal.md`, state that required reviewers on the `github-pages` environment need a public repo on Free, Pro and Team, so under Q2 B the approval gate is lost; and under Q2 A, the order is repo public, then reviewer configured, then the deploy workflow merged.
2. MINOR 6: widen the redaction pattern (`[A-Za-z]:[\\/]` and `/[a-z]/(Users|home)/`, plus thread-id and environment-id patterns) and make the licence guard walk nested `source_provenance`, as `docs/review/tools/licences.mjs` does.
3. Note for Q10 D: if the human picks a fresh squashed public repo, the git-log chapter needs a committed snapshot of the log. Say how you'd export it (format, where it lives) so it's ready either way.
