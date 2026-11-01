/**
 * The one site-wide module (stack proposal §4): copy button and motion toggle. Progressive enhancement only.
 * The motion preference is applied before first paint by the inline snippet in Base.astro; this module
 * keeps the toggle in sync and handles clicks.
 */
const MOTION_KEY = 'wbt-motion';
const root = document.documentElement;
root.classList.add('js');

function setMotion(off: boolean): void {
  if (off) root.dataset.motion = 'off';
  else delete root.dataset.motion;
  try {
    if (off) localStorage.setItem(MOTION_KEY, 'off');
    else localStorage.removeItem(MOTION_KEY);
  } catch {
    // Storage blocked: the choice still applies for this page view.
  }
  document
    .querySelectorAll<HTMLButtonElement>('[data-motion-toggle]')
    .forEach((b) => b.setAttribute('aria-pressed', String(off)));
}

document.querySelectorAll<HTMLButtonElement>('[data-motion-toggle]').forEach((button) => {
  button.setAttribute('aria-pressed', String(root.dataset.motion === 'off'));
  button.addEventListener('click', () => setMotion(root.dataset.motion !== 'off'));
});

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
      // Clipboard unavailable (permissions or an insecure context): select the text instead.
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
