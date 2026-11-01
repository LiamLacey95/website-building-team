# Accessibility (axe-core)

Run: 2026-11-01T17:46:48.495Z. Rules: wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa. axe 4.14.0.
axe catches roughly a third of WCAG issues; a manual keyboard and screen-reader pass is still required.

| URL | Width | Critical | Serious | Moderate | Minor | Needs review | Passed rules |
|---|---|---|---|---|---|---|---|
| projects/how-it-works/concepts/a-paper-trail/style-tile.html | 390 | 0 | 0 | 0 | 0 | 1 | 26 |
| projects/how-it-works/concepts/a-paper-trail/style-tile.html | 1440 | 0 | 0 | 0 | 0 | 1 | 26 |
| projects/how-it-works/concepts/b-signal-path/style-tile.html | 390 | 0 | 0 | 0 | 0 | 1 | 26 |
| projects/how-it-works/concepts/b-signal-path/style-tile.html | 1440 | 0 | 0 | 0 | 0 | 1 | 26 |
| projects/how-it-works/concepts/c-marble-run/style-tile.html | 390 | 0 | 0 | 0 | 0 | 1 | 24 |
| projects/how-it-works/concepts/c-marble-run/style-tile.html | 1440 | 0 | 0 | 0 | 0 | 1 | 24 |
| projects/how-it-works/concepts/contact-sheet.html | 390 | 0 | 1 | 0 | 0 | 0 | 20 |
| projects/how-it-works/concepts/contact-sheet.html | 1440 | 0 | 1 | 0 | 0 | 0 | 20 |

## projects/how-it-works/concepts/contact-sheet.html @ 390px

| Impact | Rule | Nodes | Description | Example target |
|---|---|---|---|---|
| serious | [aria-prohibited-attr](https://dequeuniversity.com/rules/axe/4.14/aria-prohibited-attr?application=playwright) | 3 | Elements must only use permitted ARIA attributes | `.a > .in > .pair > div > .chips` |

## projects/how-it-works/concepts/contact-sheet.html @ 1440px

| Impact | Rule | Nodes | Description | Example target |
|---|---|---|---|---|
| serious | [aria-prohibited-attr](https://dequeuniversity.com/rules/axe/4.14/aria-prohibited-attr?application=playwright) | 3 | Elements must only use permitted ARIA attributes | `.a > .in > .pair > div > .chips` |
