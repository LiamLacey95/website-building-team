# Accessibility (axe-core)

Run: 2026-11-01T11:47:46.692Z. Rules: wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa. axe 4.14.0.
axe catches roughly a third of WCAG issues; a manual keyboard and screen-reader pass is still required.

| URL | Width | Critical | Serious | Moderate | Minor | Needs review | Passed rules |
|---|---|---|---|---|---|---|---|
| file:///F:/ArtGen/Website Test/docs/review/tools/fixtures/bad.html | 1440 | 3 | 4 | 0 | 0 | 1 | 6 |

## file:///F:/ArtGen/Website Test/docs/review/tools/fixtures/bad.html @ 1440px

| Impact | Rule | Nodes | Description | Example target |
|---|---|---|---|---|
| critical | [button-name](https://dequeuniversity.com/rules/axe/4.14/button-name?application=playwright) | 1 | Buttons must have discernible text | `button` |
| critical | [image-alt](https://dequeuniversity.com/rules/axe/4.14/image-alt?application=playwright) | 1 | Images must have alternative text | `img` |
| critical | [label](https://dequeuniversity.com/rules/axe/4.14/label?application=playwright) | 1 | Form elements must have labels | `input` |
| serious | [color-contrast](https://dequeuniversity.com/rules/axe/4.14/color-contrast?application=playwright) | 1 | Elements must meet minimum color contrast ratio thresholds | `div` |
| serious | [document-title](https://dequeuniversity.com/rules/axe/4.14/document-title?application=playwright) | 1 | Documents must have <title> element to aid in navigation | `html` |
| serious | [html-has-lang](https://dequeuniversity.com/rules/axe/4.14/html-has-lang?application=playwright) | 1 | <html> element must have a lang attribute | `html` |
| serious | [link-name](https://dequeuniversity.com/rules/axe/4.14/link-name?application=playwright) | 1 | Links must have discernible text | `a` |
