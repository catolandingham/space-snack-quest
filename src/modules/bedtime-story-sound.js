/**
 * The bedtime story's sounds: Mops's hooves as he walks (the morning's hoof, synth.js), and as Squatch falls asleep
 * a big yawn, the blanket's rustle as Mops tucks him in, the light switch's click, and three snores (Brian asked
 * for a snore at bedtime, Nov 8 playtest P L119, and on 2026-11-26: "some snoring"). The snore is the game's snore
 * (synth.js "snore", the morning's, with its whistle), played louder than the morning's so it is clearly heard over
 * the bedtime song. Levels are placeholders.
 * Every sound goes through the effects level under the game's master volume (sound-mix.js); nothing plays while
 * sound is off. Each sound asked for is counted, sound on or off (tests).
 */
import { buses } from "./sound-mix.js";
import { SOUNDS } from "./synth.js";

export const BEDTIME_SOUND = Object.freeze({
  snore: 2.5, // the snore's level, clearly over the bedtime song (the morning plays the same snore at 0.4, morning-sound.js snoreLevel)
  yawn: 0.22,
  rustle: 0.3,
  click: 0.25,
});

/** The sound pick Mops's bleat is asked for by (the party branch's music-picks.js SOUND_PICKS "mops-bleat"). */
export const BLEAT_HOOK = "mops-bleat";

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
// A tone gliding from f to f1 over d seconds, rising over `a` and dying away (the yawn's voice, the click).
function glide(c, o, t, { f, f1, d, v, a, type = "sine" }) {
  const os = c.createOscillator(),
    g = c.createGain();
  os.type = type;
  os.frequency.setValueAtTime(f, t);
  os.frequency.exponentialRampToValueAtTime(f1, t + d);
  g.gain.value = 0.0001;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(v, t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  os.connect(g);
  g.connect(o);
  os.start(t);
  os.stop(t + d + 0.05);
}

export function createBedtimeSound(getEngine) {
  const asked = { snore: 0, yawn: 0, rustle: 0, click: 0, hoof: 0, bleat: 0 };
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
    /** One snore: the game's snore (synth.js), at the bedtime level. */
    snore() {
      asked.snore++;
      safe(({ c, o }, t) => {
        const g = c.createGain();
        g.gain.value = BEDTIME_SOUND.snore;
        g.connect(o);
        SOUNDS.snore.play({ c, o: g }, t);
        setTimeout(() => {
          try {
            g.disconnect();
          } catch {}
        }, (SOUNDS.snore.len + 1) * 1000);
      });
    },
    /** A big yawn: a breath in, then a long open "aaah" that falls away. */
    yawn() {
      asked.yawn++;
      safe(({ c, o }, t) => {
        breath(c, o, t, { f: 900, v: BEDTIME_SOUND.yawn * 0.6, rise: 0.35, fall: 0.2 });
        glide(c, o, t + 0.45, { f: 330, f1: 150, d: 1.3, v: BEDTIME_SOUND.yawn, a: 0.25, type: "triangle" });
      });
    },
    /** The blanket pulled up: a soft cloth rustle. */
    rustle() {
      asked.rustle++;
      safe(({ c, o }, t) => {
        breath(c, o, t, { f: 2400, v: BEDTIME_SOUND.rustle, rise: 0.25, fall: 0.5 });
      });
    },
    /** The light switch by the door. */
    click() {
      asked.click++;
      safe(({ c, o }, t) => glide(c, o, t, { f: 2200, f1: 900, d: 0.05, v: BEDTIME_SOUND.click, a: 0.002, type: "square" }));
    },
    /**
     * Mops's bleat, under his "...Weeee-eenn-nnttt?" (Brian 2026-11-26: Mops's bleat lines get a real goat bleat). It
     * asks for the sound by its hook name, BLEAT_HOOK, from whatever plays the game's sound picks (window.SSQ.playSoundPick,
     * which the party branch's music table brings, with its file still to be chosen); until then it plays nothing.
     */
    bleat() {
      asked.bleat++;
      try {
        const play = typeof window !== "undefined" && window.SSQ && window.SSQ.playSoundPick;
        play && play(BLEAT_HOOK);
      } catch {}
    },
    /** One of Mops's hooves (the morning's, synth.js), `k` counting his steps. */
    hoof(k) {
      asked.hoof++;
      safe(({ c, o }, t) => SOUNDS.hoof.play({ c, o }, t, k % 2));
    },
    /** A new bedtime: the counts start again. */
    reset() {
      for (const k of Object.keys(asked)) asked[k] = 0;
    },
    /** Tests: how many of each sound were asked for. */
    asked() {
      return { ...asked };
    },
  };
}
