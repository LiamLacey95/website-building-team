---
order: 7
slug: build-and-review
label: Chapter 7
kicker: Build, review, then Gate 4
title: Nothing ships without a second opinion from someone who can't touch the code.
dek: Front-end and Backend build the chosen variation into the whole site. Review audits all of it, and sends back whatever isn't ready.
phase: deliver
diamond: d2-converge
gate: G4
cast: [frontend, backend, concept, review, pm]
scenes: [build-second-opinion]
artefacts:
  - kind: file
    path: projects/how-it-works/review/g4-audit.md
    title: Review's verdict
    lang: md
    lines:
      - "# Gate 4 audit"
      - ""
      - "Verdict: PASS (second round)"
      - ""
      - "| Check                  | Result |"
      - "|------------------------|--------|"
      - "| WCAG 2.2 AA (axe)      | 0 violations |"
      - "| Lighthouse, mobile     | within budget |"
      - "| Contrast, both themes  | all pairs pass |"
      - "| Slop detector          | 0 findings |"
      - "| Image licences         | every chain clean |"
  - kind: slot
    slot: g4-review
    caption: The audit, as the human saw it
draft: true
---

The chosen variation becomes the real site: every page, real words, the final art, and the plumbing behind it. Backend builds the content pipeline, the deploy, and the checks that fail the build if an image's licence chain isn't clean.

**Review** reads everything and can change nothing. It runs the accessibility audit, measures performance on a phone-sized screen, checks every colour pair in both themes, runs the slop detector again, and walks every image's history back to the model that made it. Then it writes down what's wrong and who owns it.

Only after Review passes does the project manager bring you **Gate 4**: the finished site on a private link, and one question. Is it ready?
