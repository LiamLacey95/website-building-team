/**
 * Content collections, wired to Backend's contract (projects/how-it-works/api/contract.md, 0.2.0).
 * Schemas and loaders live in ../server (Backend). This file only connects them; do not add schemas here.
 */
import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import {
  siteSchema, chapterSchema, roleSchema, gateSchema, sceneSchema, setupSchema,
  creditsSchema, requirementSchema, slotSchema, numbersSchema,
} from '../../server/contracts/schema.ts';
import { requirementsLoader, slotsLoader, numbersLoader } from '../../server/content/loaders.ts';

const C = '../server/content'; // relative to web/

export const collections = {
  site: defineCollection({ loader: file(`${C}/site.json`), schema: siteSchema }),
  chapters: defineCollection({ loader: glob({ base: `${C}/chapters`, pattern: '*.md' }), schema: chapterSchema }),
  roles: defineCollection({ loader: file(`${C}/roles.json`), schema: roleSchema }),
  gates: defineCollection({ loader: file(`${C}/gates.json`), schema: gateSchema }),
  scenes: defineCollection({ loader: file(`${C}/scenes.json`), schema: sceneSchema }),
  setup: defineCollection({ loader: file(`${C}/setup.json`), schema: setupSchema }),
  credits: defineCollection({ loader: file(`${C}/credits.json`), schema: creditsSchema }),
  requirements: defineCollection({ loader: requirementsLoader(), schema: requirementSchema }),
  slots: defineCollection({ loader: slotsLoader(), schema: ({ image }) => slotSchema(image) }),
  numbers: defineCollection({ loader: numbersLoader(), schema: numbersSchema }),
};
