/**
 * Folder layout, computed from this file's location so nothing depends on the working directory.
 *
 * On Vercel the project's Root Directory is projects/how-it-works, so REPO (the kit root) is not
 * available there. Loaders that read kit files check `repoAvailable()` and fall back to the committed
 * snapshots in server/content/generated/.
 */
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const CONTENT = dirname(fileURLToPath(import.meta.url));   // server/content
export const SERVER = resolve(CONTENT, '..');                     // server
export const PROJECT = resolve(SERVER, '..');                     // projects/how-it-works
export const REPO = resolve(PROJECT, '..', '..');                 // kit root (local only)
export const GENERATED = join(CONTENT, 'generated');
export const FIXTURES = join(SERVER, 'contracts', 'fixtures');

/** True when the whole kit checkout is present (local builds), false on Vercel. */
export function repoAvailable(): boolean {
  return existsSync(join(REPO, 'BOOTSTRAP.md')) && existsSync(join(REPO, '.team'));
}

/** Forward-slash path relative to `base`, for messages and data. */
export function rel(base: string, p: string): string {
  return p.slice(base.length + 1).replace(/\\/g, '/');
}
