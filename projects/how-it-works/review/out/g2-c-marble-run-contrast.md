# Contrast check

Thresholds: AA normal 4.5, large 3 (18pt or 14pt bold), ui 3 (WCAG 1.4.11); AAA normal 7, large 4.5. Ratios are truncated, never rounded up.

| Pair | Foreground | Background | Kind | Ratio | AA | AAA |
|---|---|---|---|---|---|---|
| text on surface | `#1C2147` | `#FFFFFF` | normal | 15.46:1 | pass | pass |
| text-muted on surface | `#3A3F63` | `#FFFFFF` | normal | 10.13:1 | pass | pass |
| link on surface | `#1C2147` | `#FFFFFF` | normal | 15.46:1 | pass | pass |
| accent-ink on surface | `#B7321A` | `#FFFFFF` | normal | 6.02:1 | pass | **FAIL** |
| text on surface-2 | `#1C2147` | `#FFFFFF` | normal | 15.46:1 | pass | pass |
| text-muted on surface-2 | `#3A3F63` | `#FFFFFF` | normal | 10.13:1 | pass | pass |
| accent-on-folder on surface-2 | `#B7321A` | `#FFFFFF` | normal | 6.02:1 | pass | **FAIL** |
| text on surface-3 | `#1C2147` | `#FFFFFF` | normal | 15.46:1 | pass | pass |
| text on highlight | `#1C2147` | `#BFE3F2` | normal | 11.40:1 | pass | pass |
| on-bg on bg | `#1C2147` | `#FFC53D` | normal | 9.79:1 | pass | pass |
| on-bg-muted on bg | `#1C2147` | `#FFC53D` | normal | 9.79:1 | pass | pass |
| link-on-bg on bg | `#1C2147` | `#FFC53D` | normal | 9.79:1 | pass | pass |
| on-bg on bg-2 | `#1C2147` | `#BFE3F2` | normal | 11.40:1 | pass | pass |
| on-accent on accent | `#FFFFFF` | `#E8492C` | normal | 3.87:1 | **FAIL** | **FAIL** |
| on-accent-bg on accent-bg | `#FFC53D` | `#1C2147` | normal | 9.79:1 | pass | pass |
| accent on bg | `#E8492C` | `#FFC53D` | large | 2.45:1 | **FAIL** | **FAIL** |
| accent on surface | `#E8492C` | `#FFFFFF` | large | 3.87:1 | pass | **FAIL** |
| focus on surface | `#1C2147` | `#FFFFFF` | ui | 15.46:1 | pass | n/a |
| focus-on-bg on bg | `#1C2147` | `#FFC53D` | ui | 9.79:1 | pass | n/a |
| go on bg | `#4DBF95` | `#FFC53D` | ui | 1.44:1 | **FAIL** | n/a |
| hold on bg | `#E8492C` | `#FFC53D` | ui | 2.45:1 | **FAIL** | n/a |
| gate on bg | `#E8492C` | `#FFC53D` | ui | 2.45:1 | **FAIL** | n/a |
| go on surface | `#4DBF95` | `#FFFFFF` | ui | 2.28:1 | **FAIL** | n/a |
| gate on surface | `#E8492C` | `#FFFFFF` | ui | 3.87:1 | pass | n/a |

**18/24 pairs pass AA.**
