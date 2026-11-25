/**
 * The game's made-up sounds for the morning and home alone, ported from the sound board Brian listened to
 * (tests/out/for-brian-2026-11-24/sound-plan/sound-board.html in the main checkout). Brian, 2026-11-24, "34(A)":
 * use every sound tagged MY PICK on the board. Each recipe is the board's own, note for note.
 *
 * A recipe is (A, t) => void, where A = { c: an AudioContext, o: the node it plays into } and t is the start
 * time on that context's clock. Nothing here decides when a sound plays (morning-sound.js does).
 *
 * Every envelope starts silent before its start time too (env below): a gain node left at its default level
 * until then made a one-sample click at the start of a noise sound (sound plan section 9, item 11).
 */
const NOISE = new WeakMap();
// Two seconds of pink, white or brown noise, made once per audio context.
function noiseBuf(c, kind) {
  let m = NOISE.get(c);
  m || NOISE.set(c, (m = {}));
  if (m[kind]) return m[kind];
  const len = Math.floor(c.sampleRate * 2),
    b = c.createBuffer(1, len, c.sampleRate),
    d = b.getChannelData(0);
  let last = 0,
    b0 = 0,
    b1 = 0,
    b2 = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    if (kind === "white") d[i] = w;
    else if (kind === "brown") d[i] = (last = (last + 0.02 * w) / 1.02) * 3.5;
    else {
      b0 = 0.99765 * b0 + w * 0.099046;
      b1 = 0.963 * b1 + w * 0.2965164;
      b2 = 0.57 * b2 + w * 1.0526913;
      d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.2;
    }
  }
  return (m[kind] = b);
}
// A rise over `a` seconds to `v`, an optional hold, then a fall that ends `d` seconds after `t`.
function env(g, t, a, d, v, hold) {
  v = Math.max(v, 0.0002);
  hold = hold || 0;
  g.gain.value = 0.0001; // silent before it starts too (otherwise a one-sample click at full level)
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(v, t + a);
  hold > 0 && g.gain.setValueAtTime(v, t + a + hold);
  g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(d, a + hold + 0.01));
}
// One oscillator note: f (to f1), d seconds, type, level v, attack a, vibrato vib (Hz deep) at vibF.
function tone(A, o) {
  const c = A.c,
    t = o.t,
    d = o.d || 0.2,
    os = c.createOscillator(),
    g = c.createGain();
  os.type = o.type || "sine";
  os.frequency.setValueAtTime(o.f, t);
  if (o.f1) o.lin ? os.frequency.linearRampToValueAtTime(o.f1, t + d) : os.frequency.exponentialRampToValueAtTime(o.f1, t + d);
  if (o.vib) {
    const l = c.createOscillator(),
      lg = c.createGain();
    l.frequency.value = o.vibF || 6;
    lg.gain.value = o.vib;
    l.connect(lg);
    lg.connect(os.frequency);
    l.start(t);
    l.stop(t + d + 0.05);
  }
  env(g, t, o.a || 0.01, d, o.v == null ? 0.2 : o.v, o.hold);
  os.connect(g);
  g.connect(A.o);
  os.start(t);
  os.stop(t + d + 0.05);
}
// Filtered noise: kind, filter type ft at f (to f1), q, level v, attack a, hold, tremolo trem at tremF; `top`
// cuts everything above it as well (a second, low-pass filter).
function nz(A, o) {
  const c = A.c,
    t = o.t,
    d = o.d || 0.2,
    src = c.createBufferSource(),
    fl = c.createBiquadFilter(),
    g = c.createGain();
  src.buffer = noiseBuf(c, o.kind || "pink");
  src.loop = true;
  fl.type = o.ft || "bandpass";
  fl.frequency.setValueAtTime(o.f || 1000, t);
  o.f1 && fl.frequency.exponentialRampToValueAtTime(o.f1, t + d);
  fl.Q.value = o.q == null ? 1 : o.q;
  env(g, t, o.a || 0.01, d, o.v == null ? 0.2 : o.v, o.hold);
  src.connect(fl);
  if (o.top) {
    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = o.top;
    fl.connect(lp);
    lp.connect(g);
  } else fl.connect(g);
  let out = g;
  if (o.trem) {
    const tg = c.createGain(),
      l = c.createOscillator(),
      lg = c.createGain();
    tg.gain.value = 1 - o.trem;
    l.frequency.value = o.tremF || 10;
    lg.gain.value = o.trem;
    l.connect(lg);
    lg.connect(tg.gain);
    l.start(t);
    l.stop(t + d + 0.05);
    g.connect(tg);
    out = tg;
  }
  out.connect(A.o);
  src.start(t, Math.random() * 1.5);
  src.stop(t + d + 0.05);
}
const quieter = (A, v) => {
  const g = A.c.createGain();
  g.gain.value = v;
  g.connect(A.o);
  return { c: A.c, o: g };
};
const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);
const rnd = (a, b) => a + Math.random() * (b - a);

// A goat "meh": a buzzy note shaken about nine times a second, through a mouth-like filter.
function bleat(A, t, f, d, v) {
  const c = A.c,
    os = c.createOscillator(),
    fl = c.createBiquadFilter(),
    g = c.createGain(),
    tg = c.createGain(),
    l = c.createOscillator(),
    lg = c.createGain();
  os.type = "sawtooth";
  os.frequency.setValueAtTime(f, t);
  os.frequency.linearRampToValueAtTime(f * 0.92, t + d);
  fl.type = "bandpass";
  fl.frequency.value = 1100;
  fl.Q.value = 1.4;
  tg.gain.value = 0.55;
  l.frequency.value = 9;
  lg.gain.value = 0.45;
  l.connect(lg);
  lg.connect(tg.gain);
  env(g, t, 0.03, d, v || 0.16, d * 0.5);
  os.connect(fl);
  fl.connect(g);
  g.connect(tg);
  tg.connect(A.o);
  os.start(t);
  os.stop(t + d + 0.05);
  l.start(t);
  l.stop(t + d + 0.05);
}
const stroke = (A, t, up, v) => nz(A, { t, d: 0.32, a: 0.09, v: 0.45 * (v || 1), f: up ? 800 : 1500, f1: up ? 1500 : 800, q: 0.9 });
// A stroke with no squeak, for the quiet room (Brian, 2026-11-24: "It's hard to tell the difference between the
// whistle and the squeaking"; swish only, his yes the same day): low, soft and wet, all of it under the snore's
// whistle (1100 to 1700 Hz). Not from the sound board: a placeholder until Brian has heard it.
const swish = (A, t, up) => nz(A, { t, d: 0.55, a: 0.18, v: 0.2, f: up ? 420 : 640, f1: up ? 640 : 420, q: 1.1, top: 800, trem: 0.3, tremF: 14 });
const squeak = (A, t, v) => tone(A, { t, f: 1700, f1: 2300, d: 0.11, type: "triangle", v: 0.07 * (v || 1), vib: 70, vibF: 35, a: 0.02 });
const plink = (A, t, f, v) => tone(A, { t, f: f || 900, f1: (f || 900) * 1.7, d: 0.09, v: 0.12 * (v || 1), a: 0.003 });
const pour = (A, t, d) => {
  nz(A, { t, d, a: 0.08, v: 0.13, f: 1700, q: 0.6, hold: d * 0.6, trem: 0.25, tremF: 11 });
  for (let i = 0; i < 4; i++) plink(A, t + rnd(0.05, d - 0.05), rnd(800, 1400), 0.5);
};
const splat = (A, t) => {
  nz(A, { t, d: 0.12, v: 0.35, ft: "lowpass", f: 900, a: 0.003 });
  tone(A, { t, f: 170, f1: 70, d: 0.1, v: 0.18, a: 0.003 });
};
const rustle = (A, t, n, f, v) => {
  for (let i = 0; i < n; i++) nz(A, { t: t + rnd(0, 0.5), d: rnd(0.02, 0.06), v, f, q: 1.2, a: 0.003 });
};

/**
 * Every sound by name, with how long it lasts (seconds, for tests and logs). The name is what the morning asks
 * for and what the test log records.
 */
export const SOUNDS = Object.freeze({
  // Every speech bubble (in place of the old click): softer and shorter. The board's tick, a little quieter
  // (0.035 for 0.05) so it sits well under the music (sound plan section 8, rule 5; tests/sound-cues.mjs).
  tick: { len: 0.05, play: (A, t) => tone(A, { t, f: 1500, f1: 1100, d: 0.04, v: 0.035 }) },
  // Mops's first line in a scene.
  meh: { len: 0.45, play: (A, t) => bleat(A, t, 330, 0.38) },
  // Under "Hey, stop that!" (Brian 31a), in place of the meh.
  grumpy: {
    len: 0.55,
    play: (A, t) => {
      bleat(A, t, 250, 0.14, 0.16);
      bleat(A, t + 0.17, 290, 0.32, 0.18);
      tone(A, { t: t + 0.17, f: 290, f1: 170, d: 0.32, type: "sawtooth", v: 0.02 });
    },
  },
  // One snore with the cartoon whistle on the way out: a rumbling breath in (low noise shaken by a fast
  // flutter, with a low hum), then a soft sigh and the whistle.
  snore: {
    len: 2.3,
    play: (A, t) => {
      const c = A.c,
        src = c.createBufferSource(),
        low = c.createBiquadFilter(),
        e1 = c.createGain(),
        fl = c.createGain(),
        lfo = c.createOscillator(),
        dp = c.createGain();
      src.buffer = noiseBuf(c, "brown");
      low.type = "lowpass";
      low.frequency.value = 420;
      e1.gain.value = 0.0001;
      e1.gain.setValueAtTime(0.0001, t);
      e1.gain.exponentialRampToValueAtTime(1, t + 0.35);
      e1.gain.setValueAtTime(1, t + 0.8);
      e1.gain.exponentialRampToValueAtTime(0.0001, t + 1.15);
      fl.gain.value = 0.6;
      lfo.frequency.value = 30;
      dp.gain.value = 0.4;
      lfo.connect(dp);
      dp.connect(fl.gain);
      src.connect(low);
      low.connect(fl);
      fl.connect(e1);
      e1.connect(A.o);
      src.start(t);
      src.stop(t + 1.2);
      lfo.start(t);
      lfo.stop(t + 1.2);
      tone(A, { t, f: 92, f1: 80, lin: true, d: 1.15, v: 0.25, a: 0.35 });
      nz(A, { t: t + 1.5, d: 0.8, v: 0.35, a: 0.25, kind: "brown", f: 900, q: 0.7 });
      tone(A, { t: t + 1.55, f: 1100, f1: 1700, d: 0.55, v: 0.12, a: 0.15 });
    },
  },
  // The wall speaker before "Good morning, Stormtop!": E5 then C5, each a soft bell dying away.
  dingDong: {
    len: 2,
    play: (A, t) =>
      [659.25, 523.25].forEach((f, i) => {
        const at = t + i * 0.42;
        for (const [m, l] of [
          [1, 1],
          [2, 0.28],
          [3.01, 0.08],
        ])
          tone(A, { t: at, f: f * m, d: 1.3 / m, v: 0.3 * l, a: 0.012 });
      }),
  },
  // Mopping "B. Swish, squeak": one stroke of the beard on the wet floor (one a step as he mops along).
  mop: {
    len: 0.4,
    play: (A, t, k) => {
      stroke(A, t, (k || 0) % 2 === 0);
      squeak(A, t + 0.27);
    },
  },
  // One stroke while Squatch is still asleep (under the snoring): a low, soft, wet swish, no squeak.
  mopSoft: { len: 0.6, play: (A, t, k) => swish(A, t, (k || 0) % 2 === 0) },
  // The quiet room's wring at the bucket (mop-loop.js): one short, quiet, rubbery squeeze with a little water.
  // The squeak lives here now, low and soft, all of it under the snore's whistle (the close-up's "twist" is the
  // big one). A placeholder too.
  squeeze: {
    len: 0.5,
    play: (A, t) => {
      tone(A, { t, f: 380, f1: 700, d: 0.4, type: "sine", v: 0.035, vib: 45, vibF: 24, a: 0.05, hold: 0.18 });
      nz(A, { t: t + 0.08, d: 0.4, a: 0.08, v: 0.05, f: 650, q: 0.7, top: 900, trem: 0.25, tremF: 11 });
    },
  },
  // One drop landing in the bucket as he wrings there in the quiet room: a small, low "plop" that falls in
  // pitch (k: which drop), so it cannot be taken for the snore's rising whistle.
  dripSoft: { len: 0.12, play: (A, t, k) => tone(A, { t, f: [640, 580, 700, 540, 610][(k || 0) % 5], f1: 340, d: 0.11, v: 0.045, a: 0.01 }) },
  // The dunk, "C. Bloop, glug glug, drip drip": in, two bubbles while it soaks, drips as he comes up.
  bloop: { len: 0.25, play: (A, t) => tone(A, { t, f: 700, f1: 150, d: 0.22, v: 0.28, a: 0.005 }) },
  glug: { len: 0.12, play: (A, t) => tone(A, { t, f: 170, f1: 280, d: 0.1, v: 0.22, a: 0.01 }) },
  drips: { len: 0.7, play: (A, t) => [0, 0.2, 0.42, 0.58].forEach((dt, i) => plink(A, t + dt, [950, 1150, 880, 1250][i], 1 - i * 0.12)) },
  // The wring, "A. Squeeeak, shhhh": a rubbery squeak rising as he twists, water pouring back into the bucket.
  twist: {
    len: 0.85,
    play: (A, t) => {
      const d = 0.72;
      tone(A, { t, f: 480, f1: 1250, d, type: "triangle", v: 0.09, vib: 90, vibF: 24, a: 0.05, hold: d * 0.5 });
      tone(A, { t, f: 960, f1: 2500, d, type: "sine", v: 0.03, vib: 160, vibF: 24, a: 0.05, hold: d * 0.5 });
      pour(A, t + 0.1, 0.7);
    },
  },
  plink: { len: 0.1, play: (A, t) => plink(A, t, 1000) },
  plinkSoft: { len: 0.1, play: (A, t) => plink(A, t, 1200, 0.7) },
  // Brian 31a, "A. Pssht! ...splat": the beard squirts and the water lands.
  squirt: {
    len: 0.55,
    play: (A, t) => {
      nz(A, { t, d: 0.24, v: 0.3, kind: "white", f: 1200, f1: 4500, q: 2.5, a: 0.01 });
      splat(A, t + 0.38);
    },
  },
  // Back in the room, he shakes his beard fluffy: brrrrp, fluff.
  shake: {
    len: 0.8,
    play: (A, t) => {
      nz(A, { t, d: 0.6, v: 0.22, f: 900, q: 0.8, a: 0.05, hold: 0.35, trem: 0.5, tremF: 18 });
      nz(A, { t: t + 0.6, d: 0.15, v: 0.18, ft: "lowpass", f: 500, a: 0.01 });
    },
  },
  // One hoof as he walks out (clip, clop); k counts his steps, and each is a little quieter (walking away).
  hoof: {
    len: 0.07,
    play: (A, t, k) => {
      const B = quieter(A, Math.max(0.35, 1 - (k || 0) / 8));
      tone(B, { t, f: (k || 0) % 2 ? 560 : 700, d: 0.06, v: 0.22, a: 0.002 });
      nz(B, { t, d: 0.02, v: 0.08, kind: "white", ft: "highpass", f: 3000, a: 0.001 });
    },
  },
  // The station door as he leaves: shhhk, thunk.
  door: {
    len: 0.6,
    play: (A, t) => {
      nz(A, { t, d: 0.45, v: 0.2, f: 400, f1: 1800, q: 1, a: 0.05 });
      tone(A, { t: t + 0.45, f: 120, f1: 60, d: 0.12, v: 0.25, a: 0.003 });
    },
  },
  // Home alone. The closet door: a squeaky hinge then a bump; shut, just the bump.
  closetOpen: {
    len: 0.65,
    play: (A, t) => {
      tone(A, { t, f: 600, f1: 880, d: 0.45, type: "triangle", v: 0.045, vib: 40, vibF: 14, a: 0.05, hold: 0.2 });
      tone(A, { t: t + 0.5, f: 140, f1: 80, d: 0.12, v: 0.2, a: 0.003 });
    },
  },
  closetShut: { len: 0.15, play: (A, t) => tone(A, { t, f: 140, f1: 80, d: 0.12, v: 0.2, a: 0.003 }) },
  // He lands on the bed: fwump, boing.
  flop: {
    len: 0.75,
    play: (A, t) => {
      nz(A, { t, d: 0.16, v: 0.4, ft: "lowpass", f: 450, a: 0.004 });
      tone(A, { t: t + 0.02, f: 150, f1: 120, d: 0.7, v: 0.2, vib: 35, vibF: 9, a: 0.01 });
    },
  },
  // Homework: scritch scratch with a pencil, one line of writing.
  scribble: {
    len: 1.1,
    play: (A, t) => {
      let s = t;
      for (let i = 0; i < 9; i++) {
        const d = rnd(0.06, 0.15);
        nz(A, { t: s, d, v: 0.3, f: rnd(3000, 4200), q: 1.5, a: 0.01 });
        s += d + rnd(0.01, 0.06);
      }
    },
  },
  // A paper rustle: the homework sheet up close, and the calendar close-up.
  rustle: { len: 0.6, play: (A, t) => rustle(A, t, 8, 2800, 0.35) },
  // "That evening…": a soft whoosh and two quiet bell notes.
  evening: {
    len: 1.7,
    play: (A, t) => {
      nz(A, { t, d: 1.1, v: 0.08, ft: "lowpass", f: 700, f1: 200, a: 0.3 });
      tone(A, { t: t + 0.1, f: midi(67), d: 1.4, v: 0.08, a: 0.02 });
      tone(A, { t: t + 0.55, f: midi(72), d: 1.6, v: 0.07, a: 0.02 });
    },
  },
});
