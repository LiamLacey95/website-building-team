# Personas: how-it-works

These follow the three audiences in `BRIEF.md`. Each claim cites its source. Anything not directly sourced is marked *(inferred)*.

## Market context

- **AI use is near-universal, trust is low.**
  - 84% of developers use AI tools or plan to, but only 3.1% "highly trust" their accuracy. The top frustration (66%) is answers that are "almost right, but not quite" (https://survey.stackoverflow.co/2025/ai).
  - By 2026, 66% of AI-assistant users use coding agents, and Claude Code is the most-used agent at about 66%. 93% say trust requires source attribution (https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/).
  - JetBrains reports 90% of professional developers using coding agents at least weekly (https://adtmag.com/articles/jetbrains-survey-finds-ai-coding-agents-becoming-routine-developer-tools.aspx).
- **"AI slop" in web design is a named, measured problem.**
  - A study of 500 Show HN sites found gradients on 28%, default shadcn/ui on 23.5%, identical icon-card grids on 20.1% and purple or indigo CTAs on 10.7% (https://www.gigazine.net/gsc_news/en/20260423-design-slop).
  - HN commenters describe the shared look as "italic serif headings, blue, purple and green palettes, and heavy glow effects" (https://northeasttimes.com/2026/07/31/ai-design-tools-are-making-every-website-look-the-same/).
  - Impeccable sells itself on exactly this: "Turn AI slop into interfaces you're proud to ship" (https://impeccable.style).
- **Multi-agent setups cost real tokens.**
  - Anthropic reports multi-agent systems use about 15x the tokens of a chat (https://www.anthropic.com/engineering/multi-agent-research-system).
  - Cognition's "Don't Build Multi-Agents" argued that subagents working from partial context make conflicting choices (https://cognition.ai/blog/multi-agents-working).

## Persona 1: Maya, the agent-native builder

- **Context:** A front-end developer or design engineer, 25 to 40. She already uses Claude Code or Cursor every day and has shipped one-shot generated landing pages she wasn't proud of *(inferred, from the survey shares above)*.
- **Goal on our site:** Work out whether this is a better process than one-shot prompting, and get it running tonight.
- **Needs:**
  - To see the actual mechanics: threads, briefs, files on disk, how agents hand work to each other.
  - Proof that the output doesn't look generic.
  - The setup instruction.
- **Objections:**
  - "Six threads will burn my usage limits." (15x tokens: https://www.anthropic.com/engineering/multi-agent-research-system)
  - "Agents will lose context between handoffs." (https://cognition.ai/blog/multi-agents-working)
  - "It'll still look like AI slop." (https://www.gigazine.net/gsc_news/en/20260423-design-slop)
  - "Four gates is just bureaucracy." *(inferred)*
- **What convinces her:**
  - Real artefacts from a real run: the brief, STATUS board and git log.
  - A clean Impeccable detector result.
  - The handoff files that carry context between threads (briefs, reports, DESIGN.md).
  - An honest token, time or cost figure from this project's run *(inferred)*.
  - A side-by-side of the team's output against a one-shot prompt *(inferred)*.
- **Devices and moment:** desktop, often with the repo open in another window. She may arrive by pasting the URL into an agent, which is why an `llms.txt` or markdown version helps (see Factory in `competitors.md`).

## Persona 2: Tomás, the studio owner or freelancer

- **Context:** Runs a two- to ten-person web studio, or works as a freelance designer. AI is already pressuring prices:
  - 57.5% of people who needed creative work in 2026 did it themselves with AI, and only 19.1% hired someone (https://pymnts.com/consumer-insights/2026/digital-freelancers-find-more-work-and-new-pressure-on-pay).
  - 75% of web designers in one survey say AI competition has already hit their business (https://www.techradar.com/pro/website-hosting/75-percent-of-web-designers-now-fear-ai-more-than-shrinking-budgets-how-ai-is-reshaping-web-design-and-how-web-pros-can-adapt).
- **Goal on our site:** Decide whether an agent team can produce client-grade work, and whether he stays in control.
- **Needs:**
  - To see that human decisions sit at the right moments: the four gates.
  - Three real options at each creative step.
  - The quality bar (WCAG 2.2 AA, Lighthouse).
  - Image licensing he can explain to a client.
- **Objections:**
  - "Is this billable quality?" *(inferred)*
  - "Who owns AI images?" US law still requires a human author, after the Supreme Court declined Thaler v. Perlmutter on 2 March 2026 (https://www.mayerbrown.com/en/insights/publications/2026/03/supreme-court-denies-review-in-ai-authorship-case).
  - "Are the image models licensed for commercial use?" FLUX 3 Image Klein is free for commercial output only under US$5M revenue (https://huggingface.co/black-forest-labs/flux-3-image-klein).
  - "Will this commoditise my work?" *(inferred)*
- **What convinces him:**
  - The gate packets themselves: README, contact sheet and review verdict.
  - Before and after screenshots at four widths.
  - A plain-English licence table.
  - That he can swap in a client's own photos and brand *(inferred)*.
- **Devices and moment:** desktop for evaluation. He shares the link with a partner or client on mobile *(inferred)*.

## Persona 3: Sam, handed the repo

- **Context:** A colleague, client or curious reader has been given the GitHub link and wants to understand it before running anything. Sam may not be a heavy agent user.
- **Goal on our site:** Understand the system in a few minutes, check what's needed, and know the single first step.
- **Needs:**
  - One overview picture.
  - Plain definitions of the jargon: thread, worktree, gate, ComfyUI.
  - Hardware and software requirements up front.
  - What a run costs in time and money.
  - Whether T3 Code is required: no, Claude Code alone works, according to `BOOTSTRAP.md` §4.
- **Objections:**
  - "I don't have a 12 GB NVIDIA GPU," or "I'm on a Mac." Apple's GPU backend is reported 2 to 4 times slower than CUDA, and fp8 models aren't supported (https://insiderllm.com/guides/stable-diffusion-mac-mlx/, https://huggingface.co/Kijai/flux-fp8/discussions/14).
  - "A 12 GB card costs how much?" An RTX 5070 12 GB was listed at $855.99 on US Amazon on 20 Oct 2026 (https://computingforgeeks.com/best-gpu-for-stable-diffusion-comfyui/).
  - "ComfyUI is fiddly." Its own docs call dependency conflicts "a common issue" (https://docs.comfy.org/basic-concepts/dependencies).
  - "What is T3 Code?" It is an MIT-licensed "control plane for coding agents" from Theo Browne's team (https://t3.codes).
- **What convinces Sam:**
  - A requirements card that is honest about the hardware.
  - A note on what still works without a GPU *(inferred: whether the kit can run without image generation needs confirming with Concept/PM)*.
  - The bootstrap health check (`node scripts/bootstrap.mjs --check`).
  - An FAQ.
- **Devices and moment:** mobile first, from a shared link, then desktop to set it up *(inferred)*.

## Jobs to be done

| When I... | I want to... | So I can... | Page or section that serves it |
|---|---|---|---|
| see yet another "AI builds your website" claim | see how this one is different, with evidence | decide if it's worth my evening | Hero, "follow one prompt" story, proof section |
| am about to try it | copy the exact setup sentence and see the requirements | get it running first time | Hero install block, Setup section, Requirements card |
| worry about cost and quality | see real gate packets, detector results and a run log | trust it with a client or my own project | Gates section, "Made by the process" case study |
| need to explain it to a client or partner | share one page that names the roles and four gates | get buy-in | Overview diagram, Gates section, shareable OG card |
| have been handed the repo | understand the folder layout and who owns what | not break anything when I start | Roles section, "What's in the repo" |
| want to adapt it | know the licences and what I may change | ship client work legally | Licences and credits, FAQ |
