# Decision log

Human decisions at gates, and any PM decisions that change scope. Newest last.

| Date | Project | Gate / topic | Decision | Notes |
|---|---|---|---|---|
| 2026-11-01 | kit | Team setup | Five agent threads, four human gates, Double Diamond process | See PLAYBOOK.md |
| 2026-11-01 | kit | Licensing: upscaler | Shipped assets use RealESRGAN_x4plus (BSD-3), installed in `artgen\models\` with extra_model_paths. 4x-UltraSharp (CC BY-NC-SA) is for concept boards only. | PM decision; shared ComfyUI install untouched |
| 2026-11-01 | kit | Human request | Front-end uses Impeccable (impeccable.style) for all design work; Review uses its detector as evidence | Human instruction |
| 2026-11-01 | kit | Human request | Publish the system as GitHub repo "website-building-team", bootstrappable by a fresh PM thread via BOOTSTRAP.md | Human instruction. Repo created private; human decides public |
| 2026-11-01 | kit | Repo layout | Shared kit at root, one folder per website in `projects/<slug>/`, machine paths in git-ignored `team.config.json` | PM decision |
| 2026-11-01 | how-it-works | Intake | First project: creative site explaining how the team works, built by the process it describes | Human prompt |
| 2026-11-01 | kit | Impeccable telemetry | Off by default (`IMPECCABLE_NO_TELEMETRY=1`) for anyone running the kit | PM decision: opt-in is the safer default for a handed-off kit |
| 2026-11-01 | kit | Ownership | Front-end owns Impeccable's install and config: `.claude/` (skills, agents, settings), `.agents/`, `.codex/`, `.impeccable/` | PM decision |
| 2026-11-01 | how-it-works | **Gate 1** | Q1 A keep name · Q2 C Vercel · Q3 A as a highly creative showcase: success measured on creativity, interest and polish · Q4 PM chose Apache-2.0 · Q5 make quotes up · Q6 no time or cost on the site · Q7 D not suited to non-NVIDIA GPUs · Q8 PM chose A as working line · Q9 none · Q10 C rewrite history at G4 · Q11 A Klein may ship | `projects/how-it-works/gates/G1-strategy/DECISION.md` |
| 2026-11-01 | kit | Repo licence | Apache-2.0, with LICENSE and NOTICE at the root | From Gate 1 Q4 |
