// Sound Manager (subtle OS UI sounds) - Web Audio API
// - No audio files: generates clicks/chimes using oscillators + filtered noise.
// - Respects OS preferences: soundEnabled + soundVolume.

const SoundManager = (function() {
  let ctx = null;
  let masterGain = null;
  let isUnlocked = false;
  let lastPlayByEvent = new Map(); // eventName -> ms
  const tones = new Map(); // key -> { osc, gain }

  const DEFAULT_VOLUME = 0.5;
  const DEFAULT_ENABLED = true;

  function nowMs() {
    return (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
  }

  function getPrefs() {
    const enabled = (window.OSState && typeof OSState.getPreference === 'function')
      ? (OSState.getPreference('soundEnabled') !== false)
      : DEFAULT_ENABLED;

    let vol = DEFAULT_VOLUME;
    if (window.OSState && typeof OSState.getPreference === 'function') {
      const v = OSState.getPreference('soundVolume');
      if (typeof v === 'number') vol = v;
    }
    vol = Math.max(0, Math.min(1, vol));

    return { enabled, vol };
  }

  function ensureContext() {
    if (ctx) return ctx;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;

    ctx = new AudioCtx();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.0001; // ramped on play
    masterGain.connect(ctx.destination);
    return ctx;
  }

  async function ensureStarted() {
    const c = ensureContext();
    if (!c) return false;

    try {
      if (c.state === 'suspended') {
        await c.resume();
      }
      isUnlocked = true;
      applyVolume();
      return true;
    } catch (e) {
      // Some browsers may still block; fail silently.
      return false;
    }
  }

  function applyVolume() {
    if (!masterGain) return;
    const { enabled, vol } = getPrefs();
    const target = enabled ? Math.max(0.0001, vol) : 0.0001;
    const t = ctx ? ctx.currentTime : 0;
    try {
      masterGain.gain.cancelScheduledValues(t);
      masterGain.gain.setTargetAtTime(target, t, 0.015);
    } catch (_) {}
  }

  function shouldThrottle(eventName, throttleMs) {
    const t = nowMs();
    const last = lastPlayByEvent.get(eventName) || 0;
    if (t - last < throttleMs) return true;
    lastPlayByEvent.set(eventName, t);
    return false;
  }

  function createNoiseBuffer(durationSec = 0.04) {
    const c = ensureContext();
    if (!c) return null;
    const sampleRate = c.sampleRate || 44100;
    const len = Math.max(1, Math.floor(sampleRate * durationSec));
    const buffer = c.createBuffer(1, len, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.6;
    }
    return buffer;
  }

  function playClick({ freq = 1200, duration = 0.035, gain = 0.12 } = {}) {
    const c = ensureContext();
    if (!c || !masterGain) return;

    const t0 = c.currentTime;

    // Tone click
    const osc = c.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t0);

    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    osc.connect(g);
    g.connect(masterGain);
    osc.start(t0);
    osc.stop(t0 + duration + 0.01);

    // Tiny noise for texture
    const noiseBuf = createNoiseBuffer(duration);
    if (noiseBuf) {
      const src = c.createBufferSource();
      src.buffer = noiseBuf;
      const bp = c.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(1800, t0);
      bp.Q.setValueAtTime(2.2, t0);
      const ng = c.createGain();
      ng.gain.setValueAtTime(0.0001, t0);
      ng.gain.exponentialRampToValueAtTime(gain * 0.35, t0 + 0.004);
      ng.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
      src.connect(bp);
      bp.connect(ng);
      ng.connect(masterGain);
      src.start(t0);
      src.stop(t0 + duration + 0.01);
    }
  }

  function playChime({ freq = 740, duration = 0.12, gain = 0.12 } = {}) {
    const c = ensureContext();
    if (!c || !masterGain) return;

    const t0 = c.currentTime;
    const osc = c.createOscillator();
    osc.type = 'sine';

    // slight upward pitch for a pleasant “launch” feel
    osc.frequency.setValueAtTime(freq, t0);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.18, t0 + duration);

    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(2200, t0);
    lp.Q.setValueAtTime(0.8, t0);

    osc.connect(lp);
    lp.connect(g);
    g.connect(masterGain);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  function playError({ freq = 180, duration = 0.12, gain = 0.14 } = {}) {
    const c = ensureContext();
    if (!c || !masterGain) return;

    const t0 = c.currentTime;
    const osc = c.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, t0);
    osc.frequency.setValueAtTime(freq * 0.85, t0 + duration * 0.5);

    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    osc.connect(g);
    g.connect(masterGain);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  function setTone(key, on, { freq = 440, type = 'square', gain = 0.08 } = {}) {
    const c = ensureContext();
    if (!c || !masterGain) return;

    if (!on) {
      const existing = tones.get(key);
      if (existing) {
        try {
          const t = c.currentTime;
          existing.gain.gain.cancelScheduledValues(t);
          existing.gain.gain.setTargetAtTime(0.0001, t, 0.02);
          existing.osc.stop(t + 0.05);
        } catch (_) {}
        tones.delete(key);
      }
      return;
    }

    if (tones.has(key)) return;

    const t0 = c.currentTime;
    const osc = c.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
    osc.connect(g);
    g.connect(masterGain);
    osc.start(t0);
    tones.set(key, { osc, gain: g });
  }

  function play(eventName, opts = {}) {
    const { enabled } = getPrefs();
    if (!enabled) return;

    // If audio context hasn’t been unlocked, we still try to create it,
    // but sounds may not play until a user gesture calls ensureStarted().
    ensureContext();
    applyVolume();

    const throttleMs = typeof opts.throttleMs === 'number' ? opts.throttleMs : 70;
    if (throttleMs > 0 && shouldThrottle(eventName, throttleMs)) return;

    switch (eventName) {
      case 'os_launch':
        playChime({ freq: 660, duration: 0.14, gain: 0.12 });
        break;
      case 'os_exit':
        playChime({ freq: 520, duration: 0.10, gain: 0.09 });
        break;
      case 'dock_click':
        playClick({ freq: 1400, duration: 0.03, gain: 0.10 });
        break;
      case 'window_open':
        playClick({ freq: 1200, duration: 0.035, gain: 0.11 });
        break;
      case 'window_close':
        playClick({ freq: 900, duration: 0.04, gain: 0.10 });
        break;
      case 'window_minimize':
        playClick({ freq: 980, duration: 0.03, gain: 0.09 });
        break;
      case 'window_maximize':
        playClick({ freq: 1350, duration: 0.03, gain: 0.10 });
        break;
      case 'menu_open':
        playClick({ freq: 1550, duration: 0.025, gain: 0.08 });
        break;
      case 'menu_select':
        playClick({ freq: 1700, duration: 0.02, gain: 0.08 });
        break;
      case 'notify_info':
        playChime({ freq: 720, duration: 0.09, gain: 0.09 });
        break;
      case 'notify_success':
        playChime({ freq: 820, duration: 0.10, gain: 0.10 });
        break;
      case 'notify_warning':
        playChime({ freq: 610, duration: 0.10, gain: 0.10 });
        break;
      case 'notify_error':
        playError({ freq: 170, duration: 0.12, gain: 0.13 });
        break;
      case 'pet_action':
        playClick({ freq: 1600, duration: 0.03, gain: 0.09 });
        break;
      default:
        playClick({ freq: 1300, duration: 0.03, gain: 0.09 });
    }
  }

  return {
    ensureStarted,
    applyVolume,
    play,
    setTone
  };
})();

window.SoundManager = SoundManager;


