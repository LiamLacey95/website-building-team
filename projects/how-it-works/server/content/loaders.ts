/**
 * Astro Content Loader API objects for the collections that are computed, not authored:
 * requirements (BOOTSTRAP.md section 1), slots (real imagery) and numbers (paper-trail counts).
 *
 * Use in web/src/content.config.ts:
 *   requirements: defineCollection({ loader: requirementsLoader(), schema: requirementSchema }),
 *   slots:        defineCollection({ loader: slotsLoader(), schema: ({ image }) => slotSchema(image) }),
 *   numbers:      defineCollection({ loader: numbersLoader(), schema: numbersSchema }),
 *
 * The context type is declared locally (structurally compatible with astro/loaders) so this file has no
 * dependency on Astro and works from outside web/.
 */
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { numbers, requirements, SNAPSHOTS } from './kit-facts.ts';
import { resolveSlots } from './slots.ts';
import { CONTENT, REPO, repoAvailable } from './paths.ts';

type Data = Record<string, unknown>;
type LoaderContext = {
  store: { clear(): void; set(entry: { id: string; data: Data; digest?: string | number }): boolean };
  parseData(props: { id: string; data: Data }): Promise<Data>;
  generateDigest(data: Data | string): string;
  logger: { info(msg: string): void; warn(msg: string): void };
  watcher?: { add(path: string | string[]): void };
  config?: { root: URL };
};
export type Loader = { name: string; load(ctx: LoaderContext): Promise<void> };

async function put(ctx: LoaderContext, id: string, data: Data, filePath?: string): Promise<void> {
  const parsed = await ctx.parseData({ id, data, ...(filePath ? { filePath } : {}) } as { id: string; data: Data });
  ctx.store.set({ id, data: parsed, digest: ctx.generateDigest(data), ...(filePath ? { filePath } : {}) } as { id: string; data: Data });
}

const fwd = (p: string) => p.replace(/\\/g, '/');

export function requirementsLoader(): Loader {
  return {
    name: 'how-it-works:requirements',
    async load(ctx) {
      const { source, rows } = requirements();
      ctx.store.clear();
      for (const r of rows) await put(ctx, String(r.order), r as unknown as Data);
      ctx.logger.info(`requirements: ${rows.length} rows from ${source === 'live' ? 'BOOTSTRAP.md' : 'snapshot'}`);
      ctx.watcher?.add(repoAvailable() ? join(REPO, 'BOOTSTRAP.md') : SNAPSHOTS.requirements);
    },
  };
}

export function slotsLoader(): Loader {
  return {
    name: 'how-it-works:slots',
    async load(ctx) {
      const slots = resolveSlots();
      ctx.store.clear();
      // Astro's image() resolves paths relative to the entry's file, so every slot entry points at
      // slots.json (relative to the Astro root) and its image paths are relative to server/content/.
      const registry = join(CONTENT, 'slots.json');
      const root = ctx.config ? fileURLToPath(ctx.config.root) : CONTENT;
      const filePath = fwd(relative(root, registry));
      for (const [id, s] of Object.entries(slots)) {
        const items = s.items.map((it) => {
          const r = fwd(relative(CONTENT, it.src));
          return { ...it, src: r.startsWith('.') ? r : `./${r}` };
        });
        await put(ctx, id, { ...s, items } as unknown as Data, filePath);
      }
      const filled = Object.values(slots).filter((s) => s.status === 'filled').length;
      ctx.logger.info(`slots: ${filled}/${Object.keys(slots).length} filled (CONTENT_SLOTS=${process.env.CONTENT_SLOTS ?? 'auto'})`);
      ctx.watcher?.add(join(CONTENT, 'slots.json'));
    },
  };
}

export function numbersLoader(): Loader {
  return {
    name: 'how-it-works:numbers',
    async load(ctx) {
      const n = numbers();
      ctx.store.clear();
      await put(ctx, 'main', n as unknown as Data);
      ctx.logger.info(`numbers: ${n.commits} commits (${n.source})`);
    },
  };
}
