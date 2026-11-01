# Success metrics: how-it-works

We measure without cookies and without anything stored on the visitor's device (`../constraints.md`). Some signals come free from GitHub. One needs cookieless analytics, which only happens if the human approves it (`gate1-questions.md` Q9).

## What success looks like

| Goal (from BRIEF) | Success signal | Target *(inferred; first-launch guesses to revisit)* |
|---|---|---|
| Visitors understand the system | A first-time reader can name the four gates and say what happens at each | 4 of 5 people in an informal hallway test before G4 (Review or the human runs it) |
| People try it | Setup-sentence copies; repo clones | Copy rate ≥ 5% of home visits (if measured); clones rising in the 14 days after launch |
| People trust it | Stars; inbound links from discussions; time on `/made/` | Stars growing week on week; at least one unsolicited share |
| The site is proof of the quality bar | Published Lighthouse, accessibility and detector results | Lighthouse mobile ≥ 90 on all four categories; LCP < 2.5 s; CLS < 0.1; 0 axe violations; Impeccable detector clean or justified |
| Honesty | No support questions caused by hidden requirements | GitHub issues about "doesn't work on my machine" point to something `/setup/` already says |

## How we observe each one

| Signal | Source | Cookies? | Cost | Notes |
|---|---|---|---|---|
| Stars, forks, watchers | GitHub repo page / REST API | n/a | free | Public counts. Can be read at build time for the footer |
| Clones, views, top referrers, top paths | GitHub traffic API: `/repos/{owner}/{repo}/traffic/clones`, `/views`, `/popular/referrers`, `/popular/paths` | n/a | free | **Only the last 14 days** are kept, and reading them needs write access to the repo (https://docs.github.com/en/rest/metrics/traffic). Archive weekly if we want history: a scheduled Action writing JSON, which is Backend's call |
| Site page views and referrers | Cookieless analytics (Q9), or nothing | No | GoatCounter hosted is free for non-commercial use. Plausible is paid only, from about US$9/month. Both figures come from aggregators (https://toolradar.com/compare/goatcounter-vs-plausible) and need checking on vendor pages | GitHub Pages itself gives site owners no analytics |
| Setup-sentence copy events | A custom event on the copy button, sent to cookieless analytics | No | as above | The single most useful number. Without analytics, use clones as the proxy |
| Lighthouse and axe scores | Review's tools (`docs/review/tools/`) at G4, published on `/made/` | n/a | free | The scores are the proof (P1). Re-run after any content update |
| Impeccable detector | `npx impeccable detect`, published on `/made/` | n/a | free | |
| Understanding test | 5-person informal test with the question "name the gates" | n/a | free | Qualitative. Results go in `review/` |

## What we will *not* measure

- **Scroll depth, heatmaps, session recordings.** They need client-side tracking and storage, and don't justify the privacy cost.
- **Anything that would require a consent banner.** Having no banner is part of the quality story (`../competitors.md`: Claude Code and Cursor open with consent dialogs).

## Reporting

- **One week after launch:** Research or the PM writes `review/launch-week.md`. It covers stars, clones and views (from the 14-day window), top referrers, and copy events if available.
- **Lighthouse and axe scores** are published on `/made/` at G4 and updated on each content release.
