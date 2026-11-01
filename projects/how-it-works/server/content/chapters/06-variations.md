---
order: 6
slug: variations
label: Chapter 6
kicker: Variations, then Gate 3
title: Not three mock-ups. Three working websites, built at the same time.
dek: Front-end codes three variations in three git worktrees, checks each against a shared design vocabulary, and photographs all of them at four widths.
phase: develop
diamond: d2-converge
gate: G3
cast: [frontend, backend, review, pm]
scenes: [variations-three-branches]
artefacts:
  - kind: terminal
    command: "node tools/variants.mjs list"
    output:
      - "A  variant/how-it-works-g3-a-field-notes   :4321"
      - "B  variant/how-it-works-g3-b-control-room  :4322"
      - "C  variant/how-it-works-g3-c-pop-up        :4323"
  - kind: slot
    slot: g3-contact-sheet
    caption: Every variation at 390, 768, 1440 and 1920 pixels
draft: true
---

Pictures of websites lie. So Front-end builds three real ones, each on its own git branch in its own folder, each running on its own port, each starting from a written hypothesis about what it's trying to prove.

All three use **Impeccable**: a shared design vocabulary the agents speak, and a detector that flags the tells of generic AI design before a person has to. A variation doesn't reach you until the detector is clean or every finding has a reason.

At **Gate 3** you see a contact sheet: three sites, four screen widths, side by side. Pick one, or name the parts you want combined.
