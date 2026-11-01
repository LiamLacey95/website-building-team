---
order: 8
slug: the-record
label: Chapter 8
kicker: The record
title: Every step left a file you can open.
dek: Briefs, reports, gate packets, image labels and commits, each one signed by the role that made it.
phase: deliver
diamond: null
cast: [pm, research, concept, frontend, backend, review]
scenes: []
artefacts:
  - kind: terminal
    command: "git log --oneline"
    output:
      - "pm: gate 4 decided; launch"
      - "review: G4 audit (PASS, second round)"
      - "frontend: dark-mode contrast and focus fixes"
      - "backend: credits licence; build fails if one is missing"
      - "concept: final key art, upscaled with WEB6b"
      - "frontend: variation A merged to master"
      - "pm: gate 3 decided"
      - "research: define (positioning, sitemap, story)"
      - "pm: project brief from the human's prompt"
draft: true
---

Every commit in this project starts with the name of the role that made it. Read the history from the bottom up and you can watch the website assemble itself: a brief, then research, then a stack, then three directions, three variations, an audit, a launch.

Nothing important lives only in a chat. If the team agreed it, it's in a file. If a person decided it, it's in the decision log. If an image is on this site, its recipe is in the repo next to it.

The numbers beside this chapter are counted from the repo when the site is built.
