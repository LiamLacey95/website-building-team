# Contrast check

Thresholds: AA normal 4.5, large 3 (18pt or 14pt bold), ui 3 (WCAG 1.4.11); AAA normal 7, large 4.5. Ratios are truncated, never rounded up.

| Pair | Foreground | Background | Kind | Ratio | AA | AAA |
|---|---|---|---|---|---|---|
| Body text on white | `#0b0c0c` | `#ffffff` | normal | 19.58:1 | pass | pass |
| Secondary text on white | `#505a5f` | `#ffffff` | normal | 7.07:1 | pass | pass |
| Link on white | `#1d70b8` | `#ffffff` | normal | 5.16:1 | pass | **FAIL** |
| Body text on light grey | `#0b0c0c` | `#f3f2f1` | normal | 17.51:1 | pass | pass |
| Button text on green | `#ffffff` | `#00703c` | normal | 6.20:1 | pass | **FAIL** |
| Error text on white | `#d4351c` | `#ffffff` | normal | 4.85:1 | pass | **FAIL** |
| Focus text on yellow | `#0b0c0c` | `#ffdd00` | normal | 14.54:1 | pass | pass |
| Yellow focus ring vs white | `#ffdd00` | `#ffffff` | ui | 1.34:1 | **FAIL** | n/a |
| Input border on white | `#0b0c0c` | `#ffffff` | ui | 19.58:1 | pass | n/a |
| White on brand blue header | `#ffffff` | `#1d70b8` | large | 5.16:1 | pass | pass |

**9/10 pairs pass AA.**
