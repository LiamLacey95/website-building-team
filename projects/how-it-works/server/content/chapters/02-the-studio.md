---
order: 2
slug: the-studio
label: Chapter 2
kicker: The studio
title: Six threads, each with its own folders and a short list of things it never does.
dek: They don't share a brain. They share a playbook, a status board, and the rule that work is only real once it's a file.
phase: intake
diamond: null
cast: [pm, research, concept, frontend, backend, review]
scenes: [studio-roll-call]
artefacts:
  - kind: file
    path: projects/how-it-works/briefs/01-research-discover.md
    title: A brief, as Research received it
    lang: md
    lines:
      - "# Brief 01-research-discover"
      - "Owner: Research. Phase: 1 Discover."
      - ""
      - "Goal: find out who this site is for and what"
      - "they'd need to see before they believed it."
      - ""
      - "Deliverables: competitors, personas, references,"
      - "constraints. Cite every claim."
      - ""
      - "When done: write your report, send DONE, wait."
  - kind: terminal
    command: "status board"
    output:
      - "Research   01-research-discover   in progress"
      - "Concept    waiting for Gate 1"
      - "Front-end  waiting for Gate 1"
      - "Backend    stack proposal          queued"
      - "Review     reads everything        always"
draft: true
---

Each agent is a long-running thread with a job description, a set of folders it may write to, and a list of folders it may only read. Research can't touch the code. Front-end can't rewrite the research. Review can't fix anything at all, which is exactly why its opinion is worth having.

They talk in two formats. The project manager sends **briefs**: a goal, the inputs, the files to produce, and what "done" means. Agents send back **reports**: what they did, where it is, and what they need. Anything agreed in a conversation gets written to disk, or it didn't happen.

Front-end and Backend are allowed to talk to each other directly, about one thing only: the shape of the data that passes between them.
