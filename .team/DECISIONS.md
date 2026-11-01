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
