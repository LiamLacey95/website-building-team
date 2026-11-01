---
order: 9
slug: your-turn
label: Chapter 9
kicker: Your turn
title: Your website starts with a sentence too.
dek: Clone the repo, open it in Claude Code or T3 Code, and say the line below. The project manager takes it from there.
phase: setup
diamond: null
cast: [pm]
scenes: [your-turn]
artefacts:
  - kind: terminal
    command: "node scripts/bootstrap.mjs --check"
    output:
      - "  [ OK ] git, Node.js, npm, Python"
      - "  [ OK ] NVIDIA GPU     12.0 GB VRAM"
      - "  [ OK ] Playwright Chromium, Impeccable"
      - "  [ OK ] ComfyUI and every model, verified"
      - ""
      - "  35 ok, 0 warnings, 0 failures"
draft: true
---

Be honest with your machine first. The kit is built for a Windows PC with an NVIDIA graphics card, because the imagery is rendered locally. It isn't suited to machines without one.

If yours qualifies, the setup is one sentence. The thread you say it to checks your machine, installs what's missing, connects or installs ComfyUI, opens five more threads, and asks what you'd like to build.

After that, you'll be asked four times. Everything in between is the team's job.
