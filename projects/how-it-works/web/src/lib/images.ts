/**
 * Concept's Marble Run imagery (concepts/c-marble-run/images/). One registry so every variation uses the
 * same picks, and swapping in a re-render is a one-line change here. Alt text comes from each sidecar.
 * Licence: FLUX 3 Klein outputs (allowed under Gate 1 Q11 A); credited on /credits/.
 */
import type { ImageMetadata } from 'astro';
import hero from '../../../concepts/c-marble-run/images/c-hero.webp';
import heroMeta from '../../../concepts/c-marble-run/images/c-hero.json';
import cast from '../../../concepts/c-marble-run/images/c-cast.webp';
import castMeta from '../../../concepts/c-marble-run/images/c-cast.json';
import hand from '../../../concepts/c-marble-run/images/c-hand.webp';
import handMeta from '../../../concepts/c-marble-run/images/c-hand.json';
import research from '../../../concepts/c-marble-run/images/c-research.webp';
import researchMeta from '../../../concepts/c-marble-run/images/c-research.json';
import diverge from '../../../concepts/c-marble-run/images/c-diverge.webp';
import divergeMeta from '../../../concepts/c-marble-run/images/c-diverge.json';
import studio from '../../../concepts/c-marble-run/images/c-studio.webp';
import studioMeta from '../../../concepts/c-marble-run/images/c-studio.json';

export interface Art {
  src: ImageMetadata;
  alt: string;
}
const art = (src: ImageMetadata, meta: { alt?: string }): Art => ({ src, alt: meta.alt ?? '' });

export const ART = {
  hero: art(hero, heroMeta),
  cast: art(cast, castMeta),
  hand: art(hand, handMeta),
  research: art(research, researchMeta),
  diverge: art(diverge, divergeMeta),
  studio: art(studio, studioMeta),
} as const;

export type ArtKey = keyof typeof ART;

/**
 * The picture for each chapter (by contract slug). Chapters without their own station shot yet reuse the
 * nearest one; Concept's station re-renders (requested 2026-11-01) replace these entries.
 */
export const CHAPTER_ART: Record<string, ArtKey | undefined> = {
  'the-sentence': 'hero',
  'the-studio': 'studio',
  discover: 'research',
  define: 'diverge',
  concept: 'cast',
  variations: 'diverge',
  'build-and-review': 'hand',
  'the-record': 'cast',
  'your-turn': 'hero',
};
