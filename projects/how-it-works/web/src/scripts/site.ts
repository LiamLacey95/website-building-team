/**
 * The one site-wide module (stack proposal §4, relaxed after Gate 1): copy button, motion toggle, level
 * crossings and the Gate 2 re-skin. Progressive enhancement only: without it every page reads in full.
 * The motion preference is applied before first paint by public/motion.js; this module keeps it in sync.
 * Variation set pieces live in their own modules and listen for the events fired here.
 */
const MOTION_KEY = 'wbt-motion';
const root = document.documentElement;
root.classList.add('js');

export const motionOff = (): boolean =>
  root.dataset.motion === 'off' || matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Run a DOM change through a same-document View Transition when motion is on and supported. */
export function transition(update: () => void): void {
  if (motionOff() || !('startViewTransition' in document)) { update(); return; }
  // A newer transition skips an older one (fast paging, a re-skin mid-change): the DOM update still runs,
  // so the rejected animation promises are expected and must not surface as errors.
  const t = document.startViewTransition(update);
  t.ready.catch(() => {});
  t.finished.catch(() => {});
  t.updateCallbackDone.catch(() => {});
}

// --- Reduce motion ---------------------------------------------------------------------------
function setMotion(off: boolean): void {
  if (off) root.dataset.motion = 'off';
  else delete root.dataset.motion;
  try {
    if (off) localStorage.setItem(MOTION_KEY, 'off');
    else localStorage.removeItem(MOTION_KEY);
  } catch {
    // Storage blocked: the choice still applies for this page view.
  }
  document.querySelectorAll<HTMLButtonElement>('[data-motion-toggle]').forEach((b) => b.setAttribute('aria-pressed', String(off)));
  document.dispatchEvent(new CustomEvent('motion:change', { detail: { off } }));
}
document.querySelectorAll<HTMLButtonElement>('[data-motion-toggle]').forEach((button) => {
  button.setAttribute('aria-pressed', String(root.dataset.motion === 'off'));
  button.addEventListener('click', () => setMotion(root.dataset.motion !== 'off'));
});

// --- Copy the setup sentence -------------------------------------------------------------------
document.querySelectorAll<HTMLElement>('[data-copy-block]').forEach((block) => {
  const button = block.querySelector<HTMLButtonElement>('[data-copy-target]');
  const status = block.querySelector<HTMLElement>('[data-copy-status]');
  const source = button ? document.getElementById(button.dataset.copyTarget ?? '') : null;
  if (!button || !source) return;
  let reset: number | undefined;
  button.addEventListener('click', async () => {
    const text = source.textContent?.trim() ?? '';
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = 'Copied';
      button.dataset.state = 'copied';
      if (status) status.textContent = 'Setup sentence copied to the clipboard.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(source);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      if (status) status.textContent = 'Copying is blocked here. The sentence is selected: press Control or Command and C.';
    }
    window.clearTimeout(reset);
    reset = window.setTimeout(() => {
      button.textContent = 'Copy';
      delete button.dataset.state;
    }, 2400);
  });
});

// --- Level crossings (the four gates) ------------------------------------------------------------
export type CrossingState = 'waiting' | 'lifted' | 'revised';
export function setCrossing(el: HTMLElement, state: CrossingState, announce = true): void {
  el.dataset.state = state;
  const lift = el.querySelector<HTMLButtonElement>('[data-crossing-lift]');
  const revise = el.querySelector<HTMLButtonElement>('[data-crossing-revise]');
  lift?.setAttribute('aria-expanded', String(state === 'lifted'));
  revise?.setAttribute('aria-expanded', String(state === 'revised'));
  if (lift) lift.textContent = state === 'lifted' ? 'Lower the barrier' : 'Lift the barrier';
  const status = el.querySelector<HTMLElement>('[data-crossing-status]');
  if (announce && status) {
    status.textContent =
      state === 'lifted' ? 'Barrier lifted. The marble rolls on; the decision is shown below.'
      : state === 'revised' ? 'Sent back. The marble rides the lift to an earlier station; what happens next is shown below.'
      : 'Barrier down. The marble waits.';
  }
  document.dispatchEvent(new CustomEvent('crossing:change', { detail: { gate: el.dataset.crossing, state } }));
}
document.querySelectorAll<HTMLElement>('[data-crossing]').forEach((el) => {
  setCrossing(el, motionOff() ? 'lifted' : 'waiting', false);
  el.querySelector('[data-crossing-lift]')?.addEventListener('click', () =>
    setCrossing(el, el.dataset.state === 'lifted' ? 'waiting' : 'lifted'));
  el.querySelector('[data-crossing-revise]')?.addEventListener('click', () =>
    setCrossing(el, el.dataset.state === 'revised' ? 'waiting' : 'revised'));
});

// --- Gate 2: wear the other two -----------------------------------------------------------------
const THEME_NAMES: Record<string, string> = { 'paper-trail': 'Paper Trail', 'signal-path': 'Signal Path', 'marble-run': 'Marble Run' };
document.querySelectorAll<HTMLElement>('[data-wear]').forEach((block) => {
  const status = block.querySelector<HTMLElement>('[data-wear-status]');
  block.querySelectorAll<HTMLButtonElement>('[data-wear-theme]').forEach((button) => {
    button.addEventListener('click', () => {
      const theme = button.dataset.wearTheme ?? 'marble-run';
      transition(() => { root.dataset.theme = theme; });
      block.querySelectorAll('[data-wear-theme]').forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
      if (status) {
        status.textContent = theme === 'marble-run'
          ? 'Back in Marble Run, the direction the human chose.'
          : `The page is now wearing ${THEME_NAMES[theme]}. The human picked Marble Run.`;
      }
      document.dispatchEvent(new CustomEvent('theme:change', { detail: { theme } }));
    });
  });
});
