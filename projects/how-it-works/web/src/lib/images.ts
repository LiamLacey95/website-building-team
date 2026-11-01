/**
 * Concept's Marble Run production imagery (concepts/c-marble-run/production/): one six-figure cast in every
 * shot. One registry so every variation uses the same picks, and swapping in a re-render is a one-line change
 * here. Alt text comes from each sidecar.
 * Licence: FLUX 3 Klein outputs (allowed under Gate 1 Q11 A), the heroes upscaled with RealESRGAN (BSD-3);
 * credited on /credits/. Licence report: concepts/c-marble-run/production/licences.md.
 */
import type { ImageMetadata } from 'astro';
import hero from '../../../concepts/c-marble-run/production/c-hero-2x.webp';
import heroMeta from '../../../concepts/c-marble-run/production/c-hero-2x.json';
import heroMarble from '../../../concepts/c-marble-run/production/c-hero.marble.json';
import cast from '../../../concepts/c-marble-run/production/c-cast.webp';
import castMeta from '../../../concepts/c-marble-run/production/c-cast.json';
import pm from '../../../concepts/c-marble-run/production/c-station-pm.webp';
import pmMeta from '../../../concepts/c-marble-run/production/c-station-pm.json';
import research from '../../../concepts/c-marble-run/production/c-station-research.webp';
import researchMeta from '../../../concepts/c-marble-run/production/c-station-research.json';
import concept from '../../../concepts/c-marble-run/production/c-station-concept.webp';
import conceptMeta from '../../../concepts/c-marble-run/production/c-station-concept.json';
import frontend from '../../../concepts/c-marble-run/production/c-station-frontend.webp';
import frontendMeta from '../../../concepts/c-marble-run/production/c-station-frontend.json';
import backend from '../../../concepts/c-marble-run/production/c-station-backend.webp';
import backendMeta from '../../../concepts/c-marble-run/production/c-station-backend.json';
import review from '../../../concepts/c-marble-run/production/c-station-review.webp';
import reviewMeta from '../../../concepts/c-marble-run/production/c-station-review.json';
import gate1 from '../../../concepts/c-marble-run/production/c-gate-1.webp';
import gate1Meta from '../../../concepts/c-marble-run/production/c-gate-1.json';
import gate2 from '../../../concepts/c-marble-run/production/c-gate-2.webp';
import gate2Meta from '../../../concepts/c-marble-run/production/c-gate-2.json';
import gate3 from '../../../concepts/c-marble-run/production/c-gate-3.webp';
import gate3Meta from '../../../concepts/c-marble-run/production/c-gate-3.json';
import gate4 from '../../../concepts/c-marble-run/production/c-gate-4.webp';
import gate4Meta from '../../../concepts/c-marble-run/production/c-gate-4.json';
import nohumans from '../../../concepts/c-marble-run/production/c-nohumans.webp';
import nohumansMeta from '../../../concepts/c-marble-run/production/c-nohumans.json';
import landing from '../../../concepts/c-marble-run/production/c-landing.webp';
import landingMeta from '../../../concepts/c-marble-run/production/c-landing.json';

export interface Art {
  src: ImageMetadata;
  alt: string;
}
const art = (src: ImageMetadata, meta: { alt?: string }): Art => ({ src, alt: meta.alt ?? '' });

export const ART = {
  hero: art(hero, heroMeta),
  cast: art(cast, castMeta),
  pm: art(pm, pmMeta),
  research: art(research, researchMeta),
  concept: art(concept, conceptMeta),
  frontend: art(frontend, frontendMeta),
  backend: art(backend, backendMeta),
  review: art(review, reviewMeta),
  gate1: art(gate1, gate1Meta),
  gate2: art(gate2, gate2Meta),
  gate3: art(gate3, gate3Meta),
  gate4: art(gate4, gate4Meta),
  /** The hand lifting the first barrier. */
  hand: art(gate1, gate1Meta),
  nohumans: art(nohumans, nohumansMeta),
  landing: art(landing, landingMeta),
} as const;

export type ArtKey = keyof typeof ART;

/** Where the glass marble sits in the hero photograph (fractions of its width and height; r of its width). */
export const HERO_MARBLE: { x: number; y: number; r: number } = heroMarble['c-hero-2x'];

/** The station shot for each chapter (by contract slug): the agent who does that chapter's work. */
export const CHAPTER_ART: Record<string, ArtKey | undefined> = {
  'the-sentence': 'hero',
  'the-studio': 'cast',
  discover: 'research',
  define: 'pm',
  concept: 'concept',
  variations: 'frontend',
  'build-and-review': 'review',
  'the-record': 'backend',
  'your-turn': 'landing',
};

/** A different angle on a barrier for each gate. */
export const GATE_ART: Record<string, ArtKey> = { G1: 'gate1', G2: 'gate2', G3: 'gate3', G4: 'gate4' };
