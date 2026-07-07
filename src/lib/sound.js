// Tiny WebAudio UI-sound engine. No assets — tones are synthesized.
// Sounds only play while the user has the soundtrack toggled on, so the
// site is silent by default (autoplay policies + basic courtesy).

let enabled = false;
let audioContext = null;

function getContext() {
  if (!audioContext) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    audioContext = new Ctx();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}

export function setSoundEnabled(value) {
  enabled = value;
}

export function isSoundEnabled() {
  return enabled;
}

/** Short high tick for hovers — barely audible, felt more than heard. */
export function playTick() {
  if (!enabled) return;
  try {
    const ctx = getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = 2400;
    gain.gain.setValueAtTime(0.022, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch {
    /* never let UI sound break the page */
  }
}

/** Soft two-note "boop" for the fox easter egg / approvals. */
export function playBoop() {
  if (!enabled) return;
  try {
    const ctx = getContext();
    if (!ctx) return;
    [520, 780].forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const at = ctx.currentTime + index * 0.09;
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(0.05, at + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.22);
      osc.connect(gain).connect(ctx.destination);
      osc.start(at);
      osc.stop(at + 0.24);
    });
  } catch {
    /* noop */
  }
}
