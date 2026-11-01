/**
 * The marble run engine (Direction C), shared by the Gate 3 variations.
 *
 * - The marble follows an SVG <path> by getPointAtLength (works in every engine; CSS offset-path plus scroll
 *   timelines is Chromium-only in practice, per the brief 05 spikes and Review's G2 notes).
 * - A progress source (0..1: scroll through a container, or a variation's own driver) sets the target
 *   distance. The marble eases toward it, but WAITS just short of any barrier whose level crossing is still
 *   down, even while the page keeps scrolling. Lifting the barrier lets it roll on.
 * - freeRun() is "run it without humans": barriers ignored, the marble accelerates down the whole track,
 *   leaves the end along its tangent and falls (a parabola) towards an optional bin element.
 * - Motion off: no easing, no flight; the marble is placed at its resting point at once.
 * Positions are written through the CSSOM (style.setProperty), which the strict CSP allows.
 */
import { motionOff } from './site';

export interface Stop {
  /** Fraction of the track length where the barrier stands (0..1). */
  at: number;
  /** Gate id of the level crossing that controls it ('G1'..'G4'). */
  gate: string;
}

export interface RunOptions {
  track: SVGPathElement;
  marble: HTMLElement;
  /** Desired progress 0..1. Called every frame while the run is active. */
  progress: () => number;
  stops: Stop[];
  /** Where the marble lands in freeRun (an element in the same positioned box), optional. */
  bin?: HTMLElement | null;
  /** Marble radius in CSS px, used to stop it short of a barrier and to roll it. */
  radius?: number;
  onState?: (s: RunState) => void;
}

export interface RunState {
  distance: number;
  fraction: number;
  waitingAt: string | null;
  mode: 'normal' | 'free' | 'flown';
}

export interface Run {
  /** Point on the track at a fraction, in the marble's positioned box (for placing barriers, figures). */
  pointAt(fraction: number): { x: number; y: number };
  freeRun(): Promise<void>;
  reset(): void;
  destroy(): void;
  state(): RunState;
  /** Replace the stops after a layout change, keeping the run (and a flown marble) as it is. */
  setStops(stops: Stop[]): void;
}

export function createRun(o: RunOptions): Run {
  const svg = o.track.ownerSVGElement!;
  const radius = o.radius ?? 14;
  let stops = [...o.stops];
  const lifted = new Map<string, boolean>(stops.map((s) => [s.gate, false]));
  document.querySelectorAll<HTMLElement>('[data-crossing]').forEach((el) => {
    if (lifted.has(el.dataset.crossing!)) lifted.set(el.dataset.crossing!, el.dataset.state === 'lifted');
  });

  let len = o.track.getTotalLength();
  let d = 0;
  let mode: RunState['mode'] = 'normal';
  let waitingAt: string | null = null;
  let raf = 0;
  let alive = true;

  /** Track point -> px in the marble's offset parent (the box that holds both the svg and the marble). */
  const toBox = (p: DOMPoint) => {
    const m = o.track.getScreenCTM();
    const box = (o.marble.offsetParent as HTMLElement | null) ?? document.body;
    const b = box.getBoundingClientRect();
    const s = m ? p.matrixTransform(m) : p;
    return { x: s.x - b.left, y: s.y - b.top };
  };
  const pointAt = (fraction: number) => toBox(o.track.getPointAtLength(Math.max(0, Math.min(1, fraction)) * len));

  const place = (x: number, y: number, spin: number) => {
    o.marble.style.setProperty('--x', `${x}px`);
    o.marble.style.setProperty('--y', `${y}px`);
    o.marble.style.setProperty('--spin', `${spin}rad`);
  };
  const placeAt = (dist: number) => {
    const p = toBox(o.track.getPointAtLength(dist));
    place(p.x, p.y, dist / radius);
  };
  const emit = () => o.onState?.({ distance: d, fraction: len ? d / len : 0, waitingAt, mode });

  /** Path distance that covers `px` on screen just before `at` (the track may be scaled non-uniformly). */
  const backOff = (at: number, px: number) => {
    const a = toBox(o.track.getPointAtLength(at));
    const b = toBox(o.track.getPointAtLength(Math.max(0, at - 10)));
    const pxPerUnit = Math.hypot(a.x - b.x, a.y - b.y) / 10 || 1;
    return px / pxPerUnit;
  };

  /** Target distance: scroll progress, held short of the first barrier that is still down. */
  const target = () => {
    let t = Math.max(0, Math.min(1, o.progress())) * len;
    waitingAt = null;
    for (const s of [...stops].sort((a, b) => a.at - b.at)) {
      const stopAt = s.at * len - backOff(s.at * len, radius * 1.8);
      if (t > stopAt && !lifted.get(s.gate)) { t = stopAt; waitingAt = s.gate; break; }
    }
    return Math.max(0, t);
  };

  const tick = () => {
    if (!alive) return;
    if (mode === 'normal') {
      const t = target();
      // Exponential ease toward the target: rolls decelerate (ease-out), as the direction asks.
      d = motionOff() ? t : d + (t - d) * 0.14;
      if (Math.abs(t - d) < 0.3) d = t;
      placeAt(d);
      emit();
    }
    raf = requestAnimationFrame(tick);
  };

  const onCrossing = (e: Event) => {
    const { gate, state } = (e as CustomEvent<{ gate: string; state: string }>).detail;
    if (lifted.has(gate)) lifted.set(gate, state === 'lifted');
  };
  let landed: (() => void) | null = null;
  const onResize = () => {
    len = o.track.getTotalLength();
    if (mode === 'flown' && landed) landed();
    else placeAt(Math.min(d, len));
  };
  const ro = new ResizeObserver(onResize);
  ro.observe((o.marble.offsetParent as HTMLElement | null) ?? document.body);
  document.addEventListener('crossing:change', onCrossing);
  addEventListener('resize', onResize);
  raf = requestAnimationFrame(tick);

  async function freeRun(): Promise<void> {
    mode = 'free';
    emit();
    const start = d;
    const finish = () => {
      // Off the end of the table: continue along the tangent, then fall into the bin (or just down).
      const end = toBox(o.track.getPointAtLength(len));
      const before = toBox(o.track.getPointAtLength(Math.max(0, len - 2)));
      const vx = (end.x - before.x) / 2;
      const vy = (end.y - before.y) / 2;
      const bin = o.bin?.getBoundingClientRect();
      const box = ((o.marble.offsetParent as HTMLElement | null) ?? document.body).getBoundingClientRect();
      const land = bin ? { x: bin.left - box.left + bin.width / 2, y: bin.top - box.top + bin.height * 0.35 } : { x: end.x + vx * 120, y: end.y + 240 };
      return { end, vx, vy, land };
    };
    landed = () => { const { land } = finish(); place(land.x, land.y, 0); };
    if (motionOff()) {
      landed();
      d = len;
      mode = 'flown';
      emit();
      return;
    }
    // 1) Down the whole track with gravity: accelerating (ease-in), ignoring every barrier.
    const t0 = performance.now();
    const dur = Math.min(2600, 900 + (len - start) * 0.9);
    await new Promise<void>((resolve) => {
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / dur);
        d = start + (len - start) * k * k;
        placeAt(d);
        if (k < 1) requestAnimationFrame(step); else resolve();
      };
      requestAnimationFrame(step);
    });
    // 2) Fly off the end: linear in x, parabolic in y, landing on the bin.
    const { end, land } = finish();
    const t1 = performance.now();
    const flight = 700;
    const lift = Math.min(80, Math.abs(land.x - end.x) * 0.25);
    await new Promise<void>((resolve) => {
      const step = (now: number) => {
        const k = Math.min(1, (now - t1) / flight);
        const x = end.x + (land.x - end.x) * k;
        const y = end.y + (land.y - end.y) * k * k - lift * 4 * k * (1 - k);
        place(x, y, (len + (land.x - end.x) * k) / radius);
        if (k < 1) requestAnimationFrame(step); else resolve();
      };
      requestAnimationFrame(step);
    });
    mode = 'flown';
    emit();
  }

  return {
    pointAt,
    freeRun,
    reset() { mode = 'normal'; landed = null; d = 0; placeAt(0); emit(); },
    destroy() { alive = false; cancelAnimationFrame(raf); ro.disconnect(); document.removeEventListener('crossing:change', onCrossing); removeEventListener('resize', onResize); },
    state: () => ({ distance: d, fraction: len ? d / len : 0, waitingAt, mode }),
    setStops(next) {
      stops = [...next];
      for (const s of stops) {
        if (!lifted.has(s.gate)) lifted.set(s.gate, document.querySelector<HTMLElement>(`[data-crossing="${s.gate}"]`)?.dataset.state === 'lifted');
      }
    },
  };
}
