# Report 01-research-setup (Research)

State: DONE

## Delivered

- `F:\ArtGen\Website Test\docs\research\_templates\`: competitor-teardown.md, persona.md, content-inventory.md, reference-board.md, constraints.md, SUMMARY.md (fill-in-the-blanks, no project content)
- `F:\ArtGen\Website Test\docs\research\METHOD.md`: 10-step process, about 4 h 15 min for a brochure / small-business site, with template-to-project file mapping

## Tool check

| Tool | Result |
|---|---|
| WebSearch (standard) | Works. Test query "WCAG 2.2 new success criteria list" returned results. |
| web-fetch agent | Works. Fetched https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/ and extracted the 9 new criteria (4 at AA: 2.4.11, 2.5.7, 2.5.8, 3.3.8) and the removal of 4.1.1 Parsing. |
| Playwright | Works. `npx playwright screenshot` (v1.58.1) captured https://example.com at 1440x900. |
| Node | v24.11.1 |

Not available: authenticated / logged-in pages (web-fetch limitation). WebSearch results are US-located.

## Notes

- The WCAG 2.2 AA additions (focus not obscured, 24x24 px targets, dragging alternatives, accessible authentication) are already reflected in the constraints template via the playbook bar; Review may want them in its checklist.
- Front-end's `tools/screenshot.mjs` exists (uncommitted); I'll switch to it once it is committed.
