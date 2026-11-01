# Contrast check

Thresholds: AA normal 4.5, large 3 (18pt or 14pt bold), ui 3 (WCAG 1.4.11); AAA normal 7, large 4.5. Ratios are truncated, never rounded up.

| Pair | Foreground | Background | Kind | Ratio | AA | AAA |
|---|---|---|---|---|---|---|
| text on surface | `#ECE8DC` | `#181A17` | normal | 14.29:1 | pass | pass |
| text-muted on surface | `#9A9C93` | `#181A17` | normal | 6.29:1 | pass | **FAIL** |
| link on surface | `#FFB224` | `#181A17` | normal | 9.71:1 | pass | pass |
| accent-ink on surface | `#FFB224` | `#181A17` | normal | 9.71:1 | pass | pass |
| text on surface-2 | `#ECE8DC` | `#181A17` | normal | 14.29:1 | pass | pass |
| text-muted on surface-2 | `#9A9C93` | `#181A17` | normal | 6.29:1 | pass | **FAIL** |
| accent-on-folder on surface-2 | `#FFB224` | `#181A17` | normal | 9.71:1 | pass | pass |
| text on surface-3 | `#ECE8DC` | `#060706` | normal | 16.47:1 | pass | pass |
| text on highlight | `#ECE8DC` | `#3A2A06` | normal | 11.32:1 | pass | pass |
| on-bg on bg | `#ECE8DC` | `#0D0E0C` | normal | 15.79:1 | pass | pass |
| on-bg-muted on bg | `#9A9C93` | `#0D0E0C` | normal | 6.95:1 | pass | **FAIL** |
| link-on-bg on bg | `#FFB224` | `#0D0E0C` | normal | 10.73:1 | pass | pass |
| on-bg on bg-2 | `#ECE8DC` | `#131512` | normal | 14.98:1 | pass | pass |
| on-accent on accent | `#0D0E0C` | `#FFB224` | normal | 10.73:1 | pass | pass |
| on-accent-bg on accent-bg | `#0D0E0C` | `#FFB224` | normal | 10.73:1 | pass | pass |
| accent on bg | `#FFB224` | `#0D0E0C` | large | 10.73:1 | pass | pass |
| accent on surface | `#FFB224` | `#181A17` | large | 9.71:1 | pass | pass |
| focus on surface | `#FFB224` | `#181A17` | ui | 9.71:1 | pass | n/a |
| focus-on-bg on bg | `#FFB224` | `#0D0E0C` | ui | 10.73:1 | pass | n/a |
| go on bg | `#6BD38A` | `#0D0E0C` | ui | 10.42:1 | pass | n/a |
| hold on bg | `#FFB224` | `#0D0E0C` | ui | 10.73:1 | pass | n/a |
| gate on bg | `#FF5A47` | `#0D0E0C` | ui | 6.27:1 | pass | n/a |
| go on surface | `#6BD38A` | `#181A17` | ui | 9.43:1 | pass | n/a |
| gate on surface | `#FF5A47` | `#181A17` | ui | 5.67:1 | pass | n/a |

**24/24 pairs pass AA.**
