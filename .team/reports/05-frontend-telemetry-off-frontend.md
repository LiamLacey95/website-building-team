# Report 05-frontend-telemetry-off (Front-end)

State: DONE. Date: 2026-11-01. Impeccable telemetry is off by default for the kit.

## Where it is set

| Where | How |
|---|---|
| `.claude/settings.json` | `"env": {"IMPECCABLE_NO_TELEMETRY": "1"}`. Applies to Claude Code sessions and their hooks once a session starts with this file |
| `.codex/config.toml` (new) | `[shell_environment_policy] set = { IMPECCABLE_NO_TELEMETRY = "1" }`. Codex reads project config only for trusted projects |
| `tools/impeccable-hook.mjs` | Passes the variable to every engine call, so hooks stay telemetry-off in both harnesses regardless of the two settings above |
| `tools/selftest.mjs` | Sets the variable for its own engine calls |
| Each machine | `impeccable telemetry off` writes `"telemetry": false` to `~/.impeccable/config.json`. I asked Backend to run it in bootstrap. I already ran it on this machine, where `telemetry status` reports `off` |

`tools/README.md` documents all of the above. The selftest still passes 9 of 9 checks.

## Open point

I haven't tested the Codex config in a Codex session. The key name follows Codex's documented `shell_environment_policy.set`. The hook-gate and per-machine settings cover Codex either way.
