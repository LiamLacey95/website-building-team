// Applies the visitor's saved "Reduce motion" choice before first paint (no flash). Loaded synchronously
// in <head> as an external file, so it passes a CSP of script-src 'self' with no inline scripts.
try { if (localStorage.getItem('wbt-motion') === 'off') document.documentElement.dataset.motion = 'off'; } catch (e) {}
