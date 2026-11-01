# Decision log

Human decisions at gates, and any PM decisions that change scope or licensing. Newest last.

| Date | Project | Gate / topic | Decision | Notes |
|---|---|---|---|---|
| (kit) | kit | Licensing: upscaler | Shipped images use RealESRGAN (`WEB6b`, BSD-3). 4x-UltraSharp (`WEB6`, CC BY-NC-SA) is for concept boards only; `generate.py` enforces it | Inherited from the team that built the kit |
| (kit) | kit | Licensing: generated images | Ship only images from commercially licensed models; FLUX 3 Image Klein is free for commercial use under US$5M revenue | Inherited |
| (kit) | kit | Impeccable telemetry | Off by default (`IMPECCABLE_NO_TELEMETRY=1`) | Inherited; remove the variable to opt in |
| (kit) | kit | Repo layout and ownership | Shared kit at root, one folder per website in `projects/<slug>/`, machine paths only in `team.config.json`; ownership as in the playbook table | Inherited |
| (kit) | kit | Git | Commit only your own paths, named in the commit (`git commit -- <paths>`); only the PM pushes | Inherited |
