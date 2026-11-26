/**
 * The bedtime story's sounds: soft pats on the crate bed, Mops's hooves as he comes over (the morning's hoof,
 * synth.js), and a gentle snore as Squatch falls asleep (Brian asked for a snore at bedtime, Nov 8 playtest
 * P L119). The snore is made here, softer and lower than the morning's whistling one (synth.js "snore"): a slow
 * breath in through a low rumble and a quiet sigh out, no whistle. Levels are placeholders.
 * Every sound goes through the effects level under the game's master volume (sound-mix.js); nothing plays while
 * sound is off. Each sound asked for is counted, sound on or off (tests).
 */
import { buses } from "./sound-mix.js";
import { SOUNDS } from "./synth.js";

export const BEDTIME_SOUND = Object.freeze({
  snore: 0.32, // the breath's loudest point
  snoreLen: 1.6, // seconds one breath takes, in and out
  pat: 0.45,
});

const BROWN = new WeakMap();
// Two seconds of brown noise (a soft rumble), made once per audio context.
function brown(c) {
  if (BROWN.has(c)) return BROWN.get(c);
  const len = Math.floor(c.sampleRate * 2),
    b = c.createBuffer(1, len, c.sampleRate),
    d = b.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) d[i] = (last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02) * 3.5;
  BROWN.set(c, b);
  return b;
}
// Noise through a low-pass filter, swelling from silence to `v` over `rise` seconds and back over `fall`.
function breath(c, o, t, { f, v, rise, fall }) {
  const src = c.createBufferSource(),
    lp = c.createBiquadFilter(),
    g = c.createGain();
  src.buffer = brown(c);
  lp.type = "lowpass";
  lp.frequency.value = f;
  g.gain.value = 0.0001;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(v, t + rise);
  g.gain.exponentialRampToValueAtTime(0.0001, t + rise + fall);
  src.connect(lp);
  lp.connect(g);
  g.connect(o);
  src.start(t);
  src.stop(t + rise + fall + 0.05);
}
// A low hum under the breath in, gently shaken (the snore's purr).
function purr(c, o, t, d, v) {
  const os = c.createOscillator(),
    g = c.createGain(),
    lfo = c.createOscillator(),
    lg = c.createGain();
  os.frequency.value = 78;
  lfo.frequency.value = 22;
  lg.gain.value = v * 0.5;
  lfo.connect(lg);
  lg.connect(g.gain);
  g.gain.value = 0.0001;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(v, t + d * 0.6);
  g.gain.linearRampToValueAtTime(0.0001, t + d);
  os.connect(g);
  g.connect(o);
  os.start(t);
  lfo.start(t);
  os.stop(t + d + 0.05);
  lfo.stop(t + d + 0.05);
}

export function createBedtimeSound(getEngine) {
  const asked = { snore: 0, pat: 0, hoof: 0 };
  const out = () => {
    const b = buses(getEngine());
    return b ? { c: b.ctx, o: b.fx } : null;
  };
  const safe = (f) => {
    const A = out();
    if (!A) return;
    try {
      f(A, A.c.currentTime + 0.02);
    } catch {}
  };
  return {
    /** One gentle snore: a breath in with a low purr, a soft sigh out. */
    snore() {
      asked.snore++;
      const L = BEDTIME_SOUND.snoreLen;
      safe(({ c, o }, t) => {
        breath(c, o, t, { f: 320, v: BEDTIME_SOUND.snore, rise: L * 0.4, fall: L * 0.2 });
        purr(c, o, t, L * 0.55, BEDTIME_SOUND.snore * 0.25);
        breath(c, o, t + L * 0.62, { f: 700, v: BEDTIME_SOUND.snore * 0.35, rise: 0.15, fall: L * 0.3 });
      });
    },
    /** One soft pat of his paw on the crate bed. */
    pat() {
      asked.pat++;
      safe(({ c, o }, t) => {
        breath(c, o, t, { f: 500, v: BEDTIME_SOUND.pat, rise: 0.006, fall: 0.08 });
        const os = c.createOscillator(),
          g = c.createGain();
        os.frequency.setValueAtTime(140, t);
        os.frequency.exponentialRampToValueAtTime(70, t + 0.09);
        g.gain.setValueAtTime(BEDTIME_SOUND.pat * 0.5, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
        os.connect(g);
        g.connect(o);
        os.start(t);
        os.stop(t + 0.12);
      });
    },
    /** One of Mops's hooves (the morning's, synth.js), `k` counting his steps. */
    hoof(k) {
      asked.hoof++;
      safe(({ c, o }, t) => SOUNDS.hoof.play({ c, o }, t, k % 2));
    },
    /** Tests: how many of each sound were asked for. */
    asked() {
      return { ...asked };
    },
  };
}
