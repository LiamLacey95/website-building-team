/**
 * Content contract for how-it-works: one Zod schema per content collection.
 *
 * Human-readable version: projects/how-it-works/api/contract.md. If the two disagree, this file wins.
 *
 * Front-end imports these from web/src/content.config.ts. web's astro.config sets
 * `vite.resolve.dedupe: ['zod']`, so `zod` here resolves to the same copy Astro uses ('astro/zod').
 * Server tests resolve it from server/node_modules.
 *
 * Gate 1 (gates/G1-strategy/DECISION.md) shapes this contract:
 * - Q5: quotes, dialogue and gate decisions are written for the story. Nothing here is mined from the repo.
 * - Q6: no time, duration, cost or token fields anywhere.
 * - Q7 D: the site says plainly that the kit needs an NVIDIA GPU.
 */
import { z } from 'zod';

// ---------------------------------------------------------------------------------------------
// Shared vocabularies
// ---------------------------------------------------------------------------------------------

export const ROLE_IDS = ['pm', 'research', 'concept', 'frontend', 'backend', 'review'] as const;
export const GATE_IDS = ['G1', 'G2', 'G3', 'G4'] as const;
export const PHASES = ['intake', 'discover', 'define', 'develop', 'deliver', 'setup'] as const;
/** Where a chapter sits on the double diamond. `null` = off the diagram (intake, the paper trail, setup). */
export const DIAMOND_STAGES = ['d1-diverge', 'd1-converge', 'd2-diverge', 'd2-converge'] as const;
export const SLOT_IDS = [
  'g1-packet',        // Gate 1 contact sheet / packet thumbnail
  'g2-style-tiles',   // the three creative directions' style tiles
  'g2-key-art',       // one hero image from ComfyUI, shown with its provenance "label"
  'g3-contact-sheet', // three variations at 390/768/1440/1920
  'g4-review',        // Review's audit summary image (scores, detector), if any
] as const;

export const roleId = z.enum(ROLE_IDS);
export const gateId = z.enum(GATE_IDS);
export const slotId = z.enum(SLOT_IDS);
/** Who speaks in a scene: an agent, the human, or the system (tool output, git). */
export const speaker = z.union([roleId, z.literal('human'), z.literal('system')]);

const nonEmpty = z.string().trim().min(1);
/** Repo-relative path, forward slashes, no leading slash, no machine paths. */
const repoPath = z.string().regex(/^(?![A-Za-z]:|\/)[\w.@-]+(\/[\w. @<>-]+)*\/?$/, 'repo-relative path, forward slashes');

// ---------------------------------------------------------------------------------------------
// site: one entry, id "main"
// ---------------------------------------------------------------------------------------------

export const siteSchema = z.object({
  name: nonEmpty,                       // "Website Building Team" (G1 Q1 A)
  heroLine: nonEmpty,                   // working line (G1 Q8, PM's pick A); Concept may replace at G2
  shareLine: nonEmpty,                  // OG card / meta title line
  setupSentence: nonEmpty,              // the call to action, copied verbatim by visitors
  setupIntro: nonEmpty,                 // "Yours starts with this one:"
  whatHappensNext: nonEmpty,            // one sentence under the setup block
  gpuNotice: nonEmpty,                  // G1 Q7 D, shown beside every setup block
  repoUrl: z.url(),
  meta: z.object({ title: nonEmpty, description: z.string().min(50).max(170) }),
  status: z.enum(['draft', 'final']),
});

// ---------------------------------------------------------------------------------------------
// chapters: Markdown, one file per chapter (0 to 9); frontmatter below, narrative in the body
// ---------------------------------------------------------------------------------------------

/** A file shown on screen. The path is real; the lines are written for the story (G1 Q5). */
const fileArtefact = z.object({
  kind: z.literal('file'),
  path: repoPath,
  title: nonEmpty,
  lang: z.enum(['md', 'json', 'text', 'yaml']),
  lines: z.array(z.string()).min(1).max(40),
});
/** A terminal moment: a command and what it printed (written for the story unless noted). */
const terminalArtefact = z.object({
  kind: z.literal('terminal'),
  command: nonEmpty,
  output: z.array(z.string()).max(40),
});
/** Real imagery or screenshots, filled at Phase 5 (see the `slots` collection). */
const slotArtefact = z.object({ kind: z.literal('slot'), slot: slotId, caption: nonEmpty });
/** The double-diamond diagram (inline SVG owned by Front-end). */
const diagramArtefact = z.object({ kind: z.literal('diagram'), id: z.literal('double-diamond') });

export const artefact = z.discriminatedUnion('kind', [fileArtefact, terminalArtefact, slotArtefact, diagramArtefact]);

export const chapterSchema = z.object({
  order: z.number().int().min(0).max(9),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  label: nonEmpty,                      // "Chapter 3" / "Prologue"
  kicker: nonEmpty.optional(),          // optional since 0.2.0: Front-end doesn't render eyebrows (Impeccable)
  title: nonEmpty,
  dek: z.string().trim().min(1).max(220), // one-sentence summary under the title
  phase: z.enum(PHASES),
  diamond: z.enum(DIAMOND_STAGES).nullable(),
  gate: gateId.optional(),              // chapters 4 to 7 end at a gate
  cast: z.array(roleId),                // roles that appear, in order of appearance
  scenes: z.array(nonEmpty),            // ids in the `scenes` collection
  artefacts: z.array(artefact),
  draft: z.boolean(),
});

// ---------------------------------------------------------------------------------------------
// roles: six entries keyed by role id
// ---------------------------------------------------------------------------------------------

export const roleSchema = z.object({
  name: nonEmpty,                       // "Front-end design"
  short: nonEmpty,                      // "Front-end"
  threadTitle: nonEmpty,                // "Team · Front-end Design"
  oneLiner: z.string().trim().min(1).max(140),
  does: z.array(nonEmpty).min(2).max(6),
  owns: z.array(repoPath).min(1),       // real folders from the playbook's ownership table
  neverDoes: nonEmpty,
  signatureLine: nonEmpty,              // a line in their voice, written for the story
  tools: z.array(nonEmpty),
});

// ---------------------------------------------------------------------------------------------
// gates: four entries keyed G1..G4. Options and decisions are written for the story (G1 Q5).
// ---------------------------------------------------------------------------------------------

export const gateSchema = z.object({
  number: z.number().int().min(1).max(4),
  name: nonEmpty,                       // "Creative direction"
  where: nonEmpty,                      // where it sits on the diamond
  question: nonEmpty,                   // what the human is asked
  packet: z.array(nonEmpty).min(1),     // what the human sees
  options: z.array(z.object({ letter: z.string().regex(/^[A-Z]$/), label: nonEmpty, detail: nonEmpty })).min(2),
  decision: z.object({ choice: nonEmpty, quote: nonEmpty, consequence: nonEmpty }),
  revise: z.object({ quote: nonEmpty, outcome: nonEmpty }), // the loop-back, shown as an arc
});

// ---------------------------------------------------------------------------------------------
// scenes: short exchanges between agents and the human, keyed by scene id
// ---------------------------------------------------------------------------------------------

export const sceneSchema = z.object({
  chapter: z.number().int().min(0).max(9),
  title: nonEmpty,
  lines: z.array(z.object({
    speaker,
    to: z.union([speaker, z.literal('all')]).optional(),
    kind: z.enum(['message', 'brief', 'report', 'aside', 'command']),
    text: nonEmpty,
  })).min(1),
});

// ---------------------------------------------------------------------------------------------
// setup: one entry, id "main" (requirements come from the `requirements` collection)
// ---------------------------------------------------------------------------------------------

export const setupSchema = z.object({
  steps: z.array(z.object({ title: nonEmpty, detail: nonEmpty })).min(3),
  commands: z.array(z.object({ label: nonEmpty, command: nonEmpty })),
  /** A real `node scripts/bootstrap.mjs --check` run, redacted. Not written for the story. */
  checkOutput: z.array(z.string()).min(5),
  faq: z.array(z.object({ q: nonEmpty, a: nonEmpty })).min(3),
});

// ---------------------------------------------------------------------------------------------
// requirements: one entry per row of BOOTSTRAP.md section 1 (custom loader; snapshot fallback)
// ---------------------------------------------------------------------------------------------

export const requirementSchema = z.object({
  order: z.number().int().min(0),
  need: nonEmpty,       // "GPU"
  minimum: nonEmpty,    // markdown inline allowed (bold, code)
  notes: z.string(),    // may be empty
});

// ---------------------------------------------------------------------------------------------
// credits: one entry, id "main"
// ---------------------------------------------------------------------------------------------

export const creditsSchema = z.object({
  licences: z.array(z.object({
    name: nonEmpty,
    what: nonEmpty,       // what it is used for on the site or in the kit
    licence: nonEmpty,
    url: z.url(),
    note: z.string(),
  })).min(3),
  aiDisclosure: nonEmpty,  // G1 Q11 A: required on /credits/
  diamondCredit: nonEmpty, // "Double Diamond by the Design Council, CC BY 4.0, adapted."
  privacy: nonEmpty,       // no analytics (G1 Q9); Vercel's own logs
  accessibility: nonEmpty, // the accessibility statement
});

// ---------------------------------------------------------------------------------------------
// slots: real imagery for later gates (custom loader). Pass Astro's `image` helper so <Picture> can
// optimise the files: schema: ({ image }) => slotSchema(image)
// ---------------------------------------------------------------------------------------------

export function slotSchema(image?: () => z.ZodType) {
  const src = image ? image() : z.string();
  return z.object({
    gate: gateId,
    chapter: z.number().int().min(0).max(9),
    label: nonEmpty,                     // what the slot shows ("The three directions")
    pendingLabel: nonEmpty,              // shown while empty: "This happens at Gate 2"
    status: z.enum(['filled', 'pending']),
    items: z.array(z.object({
      src,
      alt: nonEmpty,
      caption: z.string().optional(),
      /** For generated images: workflow and model chain from the sidecar, already licence-checked. */
      provenance: z.object({ workflows: z.array(z.string()), models: z.array(z.string()) }).optional(),
    })),
  });
}

// ---------------------------------------------------------------------------------------------
// numbers: one entry, id "main" (custom loader; snapshot fallback). Counts only: no dates,
// durations or costs (G1 Q6).
// ---------------------------------------------------------------------------------------------

export const numbersSchema = z.object({
  commits: z.number().int().min(0),
  commitsByRole: z.record(z.string(), z.number().int().min(0)), // pm, research, ..., other
  briefs: z.number().int().min(0),
  reports: z.number().int().min(0),
  conceptImages: z.number().int().min(0),
  gatesDecided: z.number().int().min(0).max(4),
  source: z.enum(['live', 'snapshot']),
});

// ---------------------------------------------------------------------------------------------
// Types for components
// ---------------------------------------------------------------------------------------------

export type RoleId = z.infer<typeof roleId>;
export type GateId = z.infer<typeof gateId>;
export type SlotId = z.infer<typeof slotId>;
export type Site = z.infer<typeof siteSchema>;
export type Artefact = z.infer<typeof artefact>;
export type Chapter = z.infer<typeof chapterSchema>;
export type Role = z.infer<typeof roleSchema>;
export type Gate = z.infer<typeof gateSchema>;
export type Scene = z.infer<typeof sceneSchema>;
export type Setup = z.infer<typeof setupSchema>;
export type Requirement = z.infer<typeof requirementSchema>;
export type Credits = z.infer<typeof creditsSchema>;
export type Slot = z.infer<ReturnType<typeof slotSchema>>;
export type Numbers = z.infer<typeof numbersSchema>;
