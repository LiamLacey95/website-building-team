# Contrast check

Thresholds: AA normal 4.5, large 3 (18pt or 14pt bold), ui 3 (WCAG 1.4.11); AAA normal 7, large 4.5. Ratios are truncated, never rounded up.

| Pair | Foreground | Background | Kind | Ratio | AA | AAA |
|---|---|---|---|---|---|---|
| text on surface | `#1F1C17` | `#F7F2E7` | normal | 15.20:1 | pass | pass |
| text-muted on surface | `#5B564C` | `#F7F2E7` | normal | 6.53:1 | pass | **FAIL** |
| link on surface | `#2C4A75` | `#F7F2E7` | normal | 8.02:1 | pass | pass |
| accent-ink on surface | `#B8321B` | `#F7F2E7` | normal | 5.35:1 | pass | **FAIL** |
| text on surface-2 | `#1F1C17` | `#E2C98F` | normal | 10.49:1 | pass | pass |
| text-muted on surface-2 | `#5B564C` | `#E2C98F` | normal | 4.50:1 | pass | **FAIL** |
| accent-on-folder on surface-2 | `#8F2412` | `#E2C98F` | normal | 5.34:1 | pass | **FAIL** |
| text on surface-3 | `#1F1C17` | `#FFFDF8` | normal | 16.70:1 | pass | pass |
| text on highlight | `#1F1C17` | `#F3D77A` | normal | 11.97:1 | pass | pass |
| on-bg on bg | `#F7F2E7` | `#24412F` | normal | 10.04:1 | pass | pass |
| on-bg-muted on bg | `#CFDCCB` | `#24412F` | normal | 7.87:1 | pass | pass |
| link-on-bg on bg | `#E0B04A` | `#24412F` | normal | 5.59:1 | pass | **FAIL** |
| on-bg on bg-2 | `#F7F2E7` | `#2F5240` | normal | 7.83:1 | pass | pass |
| on-accent on accent | `#F7F2E7` | `#B8321B` | normal | 5.35:1 | pass | **FAIL** |
| on-accent-bg on accent-bg | `#24412F` | `#E0B04A` | normal | 5.59:1 | pass | **FAIL** |
| accent on bg | `#B8321B` | `#24412F` | large | 1.87:1 | **FAIL** | **FAIL** |
| accent on surface | `#B8321B` | `#F7F2E7` | large | 5.35:1 | pass | pass |
| focus on surface | `#B8321B` | `#F7F2E7` | ui | 5.35:1 | pass | n/a |
| focus-on-bg on bg | `#E0B04A` | `#24412F` | ui | 5.59:1 | pass | n/a |
| go on bg | `#2C4A75` | `#24412F` | ui | 1.25:1 | **FAIL** | n/a |
| hold on bg | `#B8321B` | `#24412F` | ui | 1.87:1 | **FAIL** | n/a |
| gate on bg | `#B8321B` | `#24412F` | ui | 1.87:1 | **FAIL** | n/a |
| go on surface | `#2C4A75` | `#F7F2E7` | ui | 8.02:1 | pass | n/a |
| gate on surface | `#B8321B` | `#F7F2E7` | ui | 5.35:1 | pass | n/a |

**20/24 pairs pass AA.**
