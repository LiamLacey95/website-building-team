#!/usr/bin/env node
/**
 * impeccable-hook.mjs: team gate in front of Impeccable's design-detector hook.
 *
 * Wired in .claude/settings.json (Claude Code) and .codex/hooks.json (Codex) for PostToolUse and Stop.
 * Every agent's edits pass through here, so it stays silent and cheap for anything that is not site code:
 *
 *   - PostToolUse: forwards only edits to files under projects/<slug>/web/ (in the main repo or in any
 *     variant worktree). Everything else (Backend's server/, Concept's artgen/, Review's docs/, briefs,
 *     reports) exits 0 with no output after ~0.2 s of Node startup.
 *   - The payload's cwd is rewritten to the checkout that owns the file, so edits inside a variant
 *     worktree are scanned against that worktree's own .impeccable/config.json. Impeccable's hook
 *     ignores files outside its cwd, which would otherwise make worktree edits invisible.
 *   - Stop: runs Impeccable's deep pass only in the checkouts this session edited site files in, and
 *     merges their reminders into one response. Sessions that never touched site code stop silently.
 *
 * Never blocks: any error, timeout or missing engine exits 0 with no output. Disable for one shell with
 * IMPECCABLE_HOOK_DISABLED=1, or for the project with `impeccable hooks off` (writes .impeccable/config.json).
 *
 * Do NOT run `impeccable hooks on` / `doctor --fix` to "repair" the hook: they write Impeccable's own
 * ungated manifest into .claude/settings.local.json, which would fire on every agent's edits twice.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = /^(.*?)[\\/]projects[\\/][^\\/]+[\\/]web[\\/]/i;
const kitRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const stateDir = path.join(os.tmpdir(), 'impeccable-team-hook');

function readStdin() {
  try { return fs.readFileSync(0, 'utf8'); } catch { return ''; }
}

/** All file paths an edit touched: Claude Edit/Write/MultiEdit, Codex apply_patch. */
function editedFiles(input, cwd) {
  const ti = input.tool_input ?? {};
  const files = [ti.file_path, ti.path, ti.notebook_path].filter((f) => typeof f === 'string');
  const patch = typeof ti.command === 'string' ? ti.command : typeof ti.input === 'string' ? ti.input : '';
  for (const m of patch.matchAll(/^\*\*\* (?:Add|Update) File: (.+)$/gm)) files.push(m[1].trim());
  return files.map((f) => path.resolve(cwd, f));
}

/** Prefer the POSIX launcher (sh exists on Unix and wherever Git Bash is installed), else the .cmd one. */
function runLauncher(root, payload, timeout) {
  const dir = path.join(kitRoot, '.claude', 'skills', 'impeccable', 'scripts');
  const opts = { cwd: root, input: payload, encoding: 'utf8', timeout, windowsHide: true,
    env: { ...process.env, IMPECCABLE_NO_TELEMETRY: '1' } }; // kit default: telemetry off
  let r = spawnSync('sh', [path.join(dir, 'impeccable'), 'hook'], opts);
  if (r.error && process.platform === 'win32') {
    r = spawnSync(process.env.ComSpec ?? 'cmd.exe', ['/d', '/s', '/c', `""${path.join(dir, 'impeccable.cmd')}" hook"`],
      { ...opts, windowsVerbatimArguments: true });
  }
  return r.status === 0 && !r.error ? r.stdout.trim() : '';
}

/**
 * One launcher output passes through verbatim (keeps the harness-specific shape). Several (site edits in
 * more than one checkout) are merged into the first one's shape with their reminders joined.
 */
function emit(outputs) {
  const parsed = outputs.filter(Boolean).map((o) => { try { return JSON.parse(o); } catch { return null; } }).filter(Boolean);
  if (!parsed.length) return;
  if (parsed.length > 1 && parsed[0].hookSpecificOutput) {
    parsed[0].hookSpecificOutput.additionalContext = parsed
      .map((p) => p.hookSpecificOutput?.additionalContext).filter(Boolean).join('\n\n');
  }
  process.stdout.write(JSON.stringify(parsed[0]));
}

function main() {
  if (process.env.IMPECCABLE_HOOK_DISABLED === '1') return;
  const raw = readStdin();
  let input;
  try { input = JSON.parse(raw); } catch { return; }
  const event = input.hook_event_name;
  const session = String(input.session_id ?? 'nosession').replace(/[^\w.-]/g, '_');
  const stateFile = path.join(stateDir, `${session}.json`);
  const cwd = input.cwd ?? process.cwd();

  if (event === 'Stop') {
    if (input.reason === 'shutdown') return;
    let roots = [];
    try { roots = JSON.parse(fs.readFileSync(stateFile, 'utf8')); } catch { return; }
    const outputs = roots.map((root) => runLauncher(root, JSON.stringify({ ...input, cwd: root }), 25000));
    try { fs.rmSync(stateFile); } catch {}
    emit(outputs);
    return;
  }

  const roots = [...new Set(editedFiles(input, cwd).map((f) => f.match(SITE)?.[1]).filter(Boolean))];
  if (!roots.length) return;

  fs.mkdirSync(stateDir, { recursive: true });
  let seen = [];
  try { seen = JSON.parse(fs.readFileSync(stateFile, 'utf8')); } catch {}
  fs.writeFileSync(stateFile, JSON.stringify([...new Set([...seen, ...roots])]));

  emit(roots.map((root) => runLauncher(root, JSON.stringify({ ...input, cwd: root }), 9000)));
}

try { main(); } catch { /* never get in an agent's way */ }
process.exit(0);
