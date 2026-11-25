/**
 * The party's made-up sounds, ported from the sound board Brian chose from (2026-11-24, "34(A)": "use every sound
 * tagged MY PICK"; tests/out/for-brian-2026-11-24/sound-plan/sound-board.html, by the sound agent). Each sound is a
 * small Web Audio function `(A, t)`, where A = { c: the AudioContext, o: where it goes (the master volume, or a
 * muffled or quieter path) } and t is when it starts. Every noise and tone is silent before it starts and fades in
 * over a few milliseconds, so nothing clicks on its first sample. Nothing here starts the sound engine.
 * Which of these a real recording would do better is listed in party-sound.js (RECORDING_LATER).
 */
const NB = new WeakMap();
const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);
// A fixed little random series (the board used Math.random; a series keeps the sounds the same every run).
let seed = 7;
const rnd = (a, b) => ((seed = (seed * 16807) % 2147483647), a + (seed / 2147483647) * (b - a));

function noiseBuf(c, kind) {
  let m = NB.get(c);
  if (!m) NB.set(c, (m = {}));
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
    else if (kind === "brown") ((last = (last + 0.02 * w) / 1.02), (d[i] = last * 3.5));
    else ((b0 = 0.99765 * b0 + w * 0.099046), (b1 = 0.963 * b1 + w * 0.2965164), (b2 = 0.57 * b2 + w * 1.0526913), (d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.2));
  }
  return (m[kind] = b);
}
function env(g, t, a, d, v, hold) {
  v = Math.max(v, 0.0002);
  hold = hold || 0;
  g.gain.value = 0.0001; // silent before it starts too (otherwise a one-sample click at full level)
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(v, t + a);
  if (hold > 0) g.gain.setValueAtTime(v, t + a + hold);
  g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(d, a + hold + 0.01));
}
export function tone(A, o) {
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
  g.connect(o.to || A.o);
  os.start(t);
  os.stop(t + d + 0.05);
  return g;
}
export function nz(A, o) {
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
  if (o.f1) fl.frequency.exponentialRampToValueAtTime(o.f1, t + d);
  fl.Q.value = o.q == null ? 1 : o.q;
  env(g, t, o.a || 0.01, d, o.v == null ? 0.2 : o.v, o.hold);
  src.connect(fl);
  fl.connect(g);
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
  out.connect(o.to || A.o);
  src.start(t, rnd(0, 1.5));
  src.stop(t + d + 0.05);
  return g;
}
/** A muffling filter (sound through a wall or a door). */
export function muffled(A, f) {
  const fl = A.c.createBiquadFilter();
  fl.type = "lowpass";
  fl.frequency.value = f || 400;
  fl.Q.value = 0.7;
  fl.connect(A.o);
  return { c: A.c, o: fl };
}
export function quieter(A, v) {
  const g = A.c.createGain();
  g.gain.value = v;
  g.connect(A.o);
  return { c: A.c, o: g };
}
export { midi };

// ---------- drums (the band uses them too) ----------
export function kick(A, t, v) {
  tone(A, { t, f: 130, f1: 45, d: 0.14, v: 0.45 * (v || 1), a: 0.003 });
}
export function snare(A, t, v) {
  nz(A, { t, d: 0.12, v: 0.18 * (v || 1), f: 1800, q: 0.7, a: 0.002 });
}
export function hat(A, t, v) {
  nz(A, { t, d: 0.04, v: 0.07 * (v || 1), kind: "white", ft: "highpass", f: 7000, a: 0.001 });
}

// ---------- the board's picks and the party's other sounds ----------
function rustle(A, t, n, f, v) {
  for (let i = 0; i < (n || 8); i++) nz(A, { t: t + rnd(0, 0.5), d: rnd(0.02, 0.06), v: v || 0.35, f: f || 2500, q: 1.2, a: 0.003 });
}
function wah(A, t, d, f, peak) {
  const c = A.c,
    os = c.createOscillator(),
    fl = c.createBiquadFilter(),
    g = c.createGain();
  os.type = "sawtooth";
  os.frequency.setValueAtTime(f, t);
  os.frequency.linearRampToValueAtTime(f * 0.88, t + d);
  fl.type = "lowpass";
  fl.Q.value = 5;
  fl.frequency.setValueAtTime(250, t);
  fl.frequency.linearRampToValueAtTime(peak, t + d * 0.4);
  fl.frequency.linearRampToValueAtTime(250, t + d);
  env(g, t, 0.03, d, 0.14, d * 0.5);
  os.connect(fl);
  fl.connect(g);
  g.connect(A.o);
  os.start(t);
  os.stop(t + d + 0.05);
}
function shimmer(A, t) {
  [1568, 2093, 2637, 3136, 2637, 3520].forEach((f, i) => tone(A, { t: t + i * 0.07, f, d: 0.6, v: 0.035, a: 0.01 }));
}
function clap1(A, t, v) {
  nz(A, { t, d: 0.05, v: 0.2 * (v || 1), f: 1500, q: 0.8, a: 0.002 });
  nz(A, { t: t + 0.01, d: 0.04, v: 0.1 * (v || 1), kind: "white", ft: "highpass", f: 3000, a: 0.002 });
}
function fwip(A, t, up) {
  nz(A, { t, d: 0.22, v: 0.45, f: up ? 800 : 2500, f1: up ? 2500 : 600, q: 1.2, a: 0.02 });
}
function clang(A, t, f, v) {
  [1, 2.7, 5.1].forEach((r, i) => tone(A, { t, f: f * r, d: 0.45 / (i + 1), v: (v || 0.12) / (i + 1), a: 0.002 }));
}
function clop(A, t, f) {
  tone(A, { t, f, d: 0.06, v: 0.22, a: 0.002 });
  nz(A, { t, d: 0.02, v: 0.08, kind: "white", ft: "highpass", f: 3000, a: 0.001 });
}

/** Every one-shot sound by name: (A, t). */
export const BOARD = Object.freeze({
  // P1 to P5 (the board's picks)
  murmur(A, t, d = 3) {
    const M = muffled(A, 1100);
    nz(M, { t, d, v: 0.15, f: 600, q: 0.5, a: 0.4, hold: d - 0.8, trem: 0.3, tremF: 3 });
    for (let i = 0; i < 14; i++) {
      const at = t + rnd(0, d - 0.4),
        f = rnd(140, 260);
      tone(M, { t: at, f, f1: f * rnd(0.85, 1.2), d: rnd(0.15, 0.35), type: "sawtooth", v: 0.04, a: 0.03 });
    }
  },
  isfredMuffled(A, t) {
    const M = muffled(A, 900);
    [
      [0, 0.22, 170, 800],
      [0.3, 0.2, 160, 700],
      [0.85, 0.14, 175, 650],
      [1.02, 0.3, 165, 850],
      [1.55, 0.32, 200, 1000],
    ].forEach(([s, d, f, p]) => wah(M, t + s, d, f, p));
  },
  hm(A, t) {
    tone(A, { t, f: 330, d: 0.13, type: "triangle", v: 0.16, a: 0.02 });
    tone(A, { t: t + 0.15, f: 330, f1: 540, d: 0.18, type: "triangle", v: 0.16, a: 0.02 });
  },
  rustle: (A, t) => rustle(A, t, 10, 3000, 0.4),
  bell(A, t, d = 1.8) {
    const c = A.c,
      g = c.createGain(),
      am = c.createGain(),
      l = c.createOscillator(),
      lg = c.createGain();
    env(g, t, 0.01, d, 0.12, d - 0.35);
    am.gain.value = 0.5;
    l.type = "square";
    l.frequency.value = 19;
    lg.gain.value = 0.5;
    l.connect(lg);
    lg.connect(am.gain);
    [1, 2.32, 4.25, 6.63].forEach((r, i) => {
      const o = c.createOscillator(),
        og = c.createGain();
      o.frequency.value = 880 * r;
      og.gain.value = [1, 0.55, 0.3, 0.15][i];
      o.connect(og);
      og.connect(am);
      o.start(t);
      o.stop(t + d + 0.05);
    });
    am.connect(g);
    g.connect(A.o);
    l.start(t);
    l.stop(t + d + 0.05);
  },
  lost(A, t) {
    tone(A, { t, f: 1300, f1: 600, d: 0.45, v: 0.06, a: 0.03 });
    [
      [79, 0.5],
      [84, 0.75],
    ].forEach(([m, s]) => (tone(A, { t: t + s, f: midi(m), d: 1.0, v: 0.14 }), tone(A, { t: t + s, f: midi(m) * 2, d: 0.5, v: 0.03 })));
  },
  tada(A, t) {
    [
      [72, 0, 0.12],
      [76, 0.12, 0.12],
      [79, 0.24, 0.12],
      [84, 0.36, 0.7],
    ].forEach(([m, s, d]) => (tone(A, { t: t + s, f: midi(m), d, type: "square", v: 0.06 }), tone(A, { t: t + s, f: midi(m - 12), d, type: "triangle", v: 0.1 })));
    shimmer(A, t + 0.4);
  },
  scratch(A, t) {
    nz(A, { t, d: 0.35, v: 0.45, f: 3000, f1: 500, q: 2, a: 0.005 });
    tone(A, { t, f: 600, f1: 90, d: 0.35, type: "sawtooth", v: 0.07, a: 0.005 });
  },
  dim: (A, t) => (tone(A, { t, f: 240, f1: 70, d: 0.8, v: 0.14, a: 0.02 }), nz(A, { t, d: 0.8, v: 0.08, ft: "lowpass", f: 500, f1: 100, a: 0.02 })),
  sparkle: shimmer,
  // a button's click, then an old TV waking up
  click: (A, t) => (tone(A, { t, f: 1800, d: 0.03, type: "square", v: 0.12, a: 0.001 }), nz(A, { t, d: 0.03, v: 0.2, kind: "white", ft: "highpass", f: 3000, a: 0.001 }), tone(A, { t: t + 0.06, f: 300, f1: 1200, d: 0.35, v: 0.06, a: 0.02 })),
  pop: (A, t) => tone(A, { t, f: 400, f1: 900, d: 0.07, v: 0.12, a: 0.003 }),
  door: (A, t) => (nz(A, { t, d: 0.45, v: 0.2, f: 400, f1: 1800, q: 1, a: 0.05 }), tone(A, { t: t + 0.45, f: 120, f1: 60, d: 0.12, v: 0.25, a: 0.003 })),
  hooves(A, t) {
    for (let i = 0; i < 6; i++) clop(quieter(A, 1 - i / 8), t + i * 0.25, i % 2 ? 560 : 700);
  },
  // P6 to P8
  cheer(A, t) {
    nz(A, { t, d: 1.7, a: 0.15, v: 0.25, f: 1100, f1: 900, q: 0.5, hold: 0.4 });
    const M = muffled(A, 1500);
    for (let i = 0; i < 7; i++) {
      const f = rnd(260, 520);
      tone(M, { t: t + rnd(0, 0.25), f, f1: f * 1.35, d: rnd(0.6, 1.1), type: "sawtooth", v: 0.03, a: 0.08, vib: f * 0.03, vibF: rnd(5, 8) });
    }
  },
  clap(A, t) {
    for (let p = 0; p < 4; p++) {
      const off = rnd(0, 0.06);
      for (let i = 0; i < 6; i++) clap1(A, t + off + i * 0.3 + rnd(-0.02, 0.02), 0.7);
    }
  },
  robot: (A, t) => (tone(A, { t, f: 120, f1: 160, d: 0.18, type: "sawtooth", v: 0.12, a: 0.01 }), nz(A, { t, d: 0.18, v: 0.15, f: 900, f1: 1600, q: 4 }), tone(A, { t: t + 0.18, f: 700, d: 0.05, type: "square", v: 0.05 })),
  conga(A, t) {
    [
      [0, 210, 160],
      [0.24, 210, 160],
      [0.48, 300, 230],
    ].forEach(([s, f, f1]) => tone(A, { t: t + s, f, f1, d: 0.16, v: 0.3, a: 0.003 }));
  },
  beep: (A, t) => tone(A, { t, f: 1000, d: 0.08, type: "square", v: 0.06 }),
  flash(A, t) {
    tone(A, { t, f: 2000, d: 0.1, type: "square", v: 0.06 });
    nz(A, { t, d: 0.03, v: 0.3, kind: "white", ft: "highpass", f: 2500, a: 0.001 });
    nz(A, { t: t + 0.07, d: 0.04, v: 0.25, kind: "white", ft: "highpass", f: 1800, a: 0.001 });
    tone(A, { t: t + 0.05, f: 5000, f1: 1500, d: 0.4, v: 0.03 });
  },
  zzzt(A, t) {
    const c = A.c,
      o = c.createOscillator(),
      fl = c.createBiquadFilter(),
      g = c.createGain();
    o.type = "square";
    o.frequency.value = 62;
    fl.type = "bandpass";
    fl.frequency.value = 900;
    fl.Q.value = 1;
    env(g, t, 0.02, 0.8, 0.12, 0.6);
    o.connect(fl);
    fl.connect(g);
    g.connect(A.o);
    o.start(t);
    o.stop(t + 0.85);
  },
  crinkle(A, t) {
    for (let i = 0; i < 16; i++) nz(A, { t: t + rnd(0, 0.5), d: rnd(0.008, 0.03), v: 0.16, kind: "white", ft: "highpass", f: 4000, a: 0.001 });
  },
  dun: (A, t) => (tone(A, { t, f: 196, d: 0.25, type: "triangle", v: 0.18 }), tone(A, { t: t + 0.3, f: 185, d: 0.45, type: "triangle", v: 0.18 })),
  tink(A, t) {
    for (let i = 0; i < 9; i++) tone(A, { t: t + i * 0.11, f: i % 2 ? 2200 : 2600, d: 0.05, v: 0.08, a: 0.002 });
  },
  // The crash's stand-in (a recording plays instead when it has loaded: party-sound.js).
  crash(A, t) {
    [0, 0.22, 0.4, 0.62, 0.8].forEach((s, i) => (nz(A, { t: t + s, d: 0.25, v: 0.22, kind: "white", ft: "highpass", f: 2500, a: 0.002 }), clang(A, t + s, [523, 700, 440, 620, 390][i])));
  },
  hiccup: (A, t) => (nz(A, { t, d: 0.04, v: 0.15, f: 1200, q: 1, a: 0.002 }), tone(A, { t, f: 500, f1: 1100, d: 0.07, v: 0.16, a: 0.003 })),
  squish: (A, t) => (nz(A, { t, d: 0.28, v: 0.25, f: 1500, f1: 220, q: 5, a: 0.01 }), tone(A, { t: t + 0.05, f: 200, f1: 120, d: 0.3, v: 0.12, vib: 25, vibF: 12 })),
  pieceOff: (A, t) => (tone(A, { t, f: 200, f1: 800, d: 0.06, v: 0.25, a: 0.002 }), fwip(A, t + 0.05, true)),
  fwip: (A, t) => fwip(A, t, false),
  gasp(A, t) {
    nz(A, { t, d: 0.5, v: 0.4, f: 800, f1: 2000, q: 0.7, a: 0.03 });
    const M = muffled(A, 1800);
    for (let i = 0; i < 5; i++) {
      const f = rnd(300, 500);
      tone(M, { t: t + rnd(0, 0.08), f, f1: f * 1.15, d: 0.35, type: "sawtooth", v: 0.02, a: 0.02 });
    }
  },
  whoosh: (A, t) => nz(A, { t, d: 1.2, v: 0.16, ft: "lowpass", f: 500, f1: 250, q: 2, a: 0.3, hold: 0.4 }),
  rip: (A, t) => (nz(A, { t, d: 0.2, v: 0.22, f: 2500, q: 1, a: 0.003, trem: 0.6, tremF: 60 }), tone(A, { t: t + 0.05, f: 400, f1: 250, d: 0.25, type: "triangle", v: 0.08 })),
  swish: (A, t) => nz(A, { t, d: 0.32, a: 0.09, v: 0.3, f: 800, f1: 1500, q: 0.8 }),
  uhoh: (A, t) => (tone(A, { t, f: midi(79), d: 0.14, type: "square", v: 0.1 }), tone(A, { t: t + 0.17, f: midi(76), d: 0.28, type: "square", v: 0.1 })),
  // The hallway doorway's push back: a soft, low thump (new 2026-11-24, not yet picked by Brian on the sound board).
  bump: (A, t) => (nz(A, { t, d: 0.09, v: 0.35, ft: "lowpass", f: 300, a: 0.003 }), tone(A, { t, f: 150, f1: 70, d: 0.14, v: 0.25, a: 0.003 })),
  underBed: (A, t) => (rustle(A, t, 10, 2000, 0.3), nz(A, { t: t + 0.55, d: 0.14, v: 0.35, ft: "lowpass", f: 400, a: 0.003 })),
  huff(A, t) {
    for (let i = 0; i < 6; i++) nz(A, { t: t + i * 0.33, d: 0.2, v: 0.35, f: i % 2 ? 900 : 1500, q: 1, a: 0.04 });
  },
  twinkle(A, t) {
    for (let i = 0; i < 7; i++) tone(A, { t: t + i * 0.16, f: rnd(2000, 3400), d: 0.18, v: 0.035, a: 0.005 });
    tone(A, { t, f: midi(60), d: 1.6, type: "triangle", v: 0.06, a: 0.3 });
    tone(A, { t, f: midi(64), d: 1.6, type: "triangle", v: 0.05, a: 0.3 });
  },
  chime: (A, t) => (tone(A, { t, f: 659.25, d: 1.2, v: 0.18 }), tone(A, { t: t + 0.42, f: 523.25, d: 1.3, v: 0.18 })),
  // Boots on the floor (the stand-in until the footstep recordings load).
  boots: (A, t) => (nz(A, { t, d: 0.1, v: 0.4, ft: "lowpass", f: 320, a: 0.003 }), tone(A, { t, f: 95, f1: 50, d: 0.1, v: 0.25, a: 0.003 })),
  // The band's shout in the break ("Stormtop-vania 1-2-3-4-5!"): a gang shout of eleven syllables in rhythm.
  shout(A, t, beat = 0.4) {
    const M = muffled(A, 2400),
      rhythm = [0, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5],
      pitch = [62, 62, 64, 67, 64, 60, 62, 64, 65, 67, 72];
    rhythm.forEach((b, i) => {
      for (const oct of [-12, 0]) tone(M, { t: t + b * beat, f: midi(pitch[i] + oct), f1: midi(pitch[i] + oct) * 0.96, d: beat * 0.42, type: "sawtooth", v: 0.05, a: 0.01, vib: 6, vibF: 9 });
      nz(M, { t: t + b * beat, d: 0.05, v: 0.12, f: 2500, q: 1, a: 0.002 });
    });
  },
});
