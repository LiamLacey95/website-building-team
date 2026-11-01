---
order: 5
slug: concept
label: Chapter 5
kicker: Concept, then Gate 2
title: Three directions, painted on a graphics card under a desk.
dek: Concept makes three genuinely different looks, renders key art locally in ComfyUI, and pins a label to every image saying exactly how it was made.
phase: develop
diamond: d2-diverge
gate: G2
cast: [concept, review, pm]
scenes: [concept-three-roads]
artefacts:
  - kind: slot
    slot: g2-style-tiles
    caption: Three directions, side by side
  - kind: slot
    slot: g2-key-art
    caption: Key art, with its label
  - kind: file
    path: projects/how-it-works/concepts/b/key-art.json
    title: The label on the back of the picture
    lang: json
    lines:
      - "{"
      - "  \"workflow\": \"WEB1 Klein - Key Art\","
      - "  \"model\": \"flux3_image_klein\","
      - "  \"seed\": 418,"
      - "  \"prompt\": \"A control room at dawn, every screen showing"
      - "             the same diamond, warm paper light…\","
      - "  \"licence\": \"FLUX Kommunity License v1.0\""
      - "}"
draft: true
---

The second diamond opens wide again. Concept makes three directions that would each be a reasonable website on their own, then pushes them apart until choosing between them actually means something.

Each direction gets a moodboard, a palette, a type pairing, a style tile and a piece of key art. The art is rendered here, on a local GPU, with ComfyUI. Every image gets a sidecar file: the workflow, the model, the seed, the prompt and the licence. If an image can't say where it came from, it doesn't ship.

At **Gate 2** you see all three side by side. Pick one, or take one's palette and another's type and let Concept merge them.
