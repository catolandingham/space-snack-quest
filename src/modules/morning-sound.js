/**
 * The morning's two made-up sounds (Brian 20a, 2026-11-23: "I don't know why I'm not hearing music or snoring or
 * something here", "We want like a good morning Stormtop pop"):
 *   - soft snoring while Squatch sleeps (the "This is Squatch" card and the quiet room before the speaker),
 *   - a ding-dong from the wall speaker before "Good morning, Stormtop!".
 * Both are synthesized with the game's sound engine (its AudioContext) and go through the game's master volume,
 * like every sound effect. Nothing plays while sound is off, and nothing here starts the sound engine.
 */
export const MORNING_SOUND = Object.freeze({
  breathEvery: 3.4, // seconds from one snore to the next
  snoreLevel: 0.22, // the snoring bus, before the master volume
  snoreFade: 0.25, // seconds the snoring takes to fade when he wakes
  chimeNotes: [659.25, 523.25], // E5 then C5: "ding", "dong"
  chimeGap: 0.42, // seconds between the two notes
  chimeRing: 1.3, // seconds each note rings
  chimeLevel: 0.3,
  // Seconds the speaker's first words wait after the tap that rings the ding-dong (morning.js).
  wordsAfter: 1.0,
});

export function createMorningSound(getEngine) {
  let bus = null,
    busCtx = null,
    noise = null,
    nextAt = 0,
    want = false,
    breaths = 0,
    chimes = 0,
    via = "";

  function live() {
    const e = getEngine();
    if (!e || e.soundState() !== "on") return null;
    const ctx = e.audioCtx(),
      master = e.masterGain();
    return ctx && master ? { ctx, master } : null;
  }
  function noiseBuffer(ctx) {
    if (noise && noise.sampleRate === ctx.sampleRate) return noise;
    const len = Math.floor(ctx.sampleRate * 1.6);
    noise = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = noise.getChannelData(0);
    // Brown-ish noise: softer and lower than white noise, like breath.
    let last = 0;
    for (let i = 0; i < len; i++) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
      d[i] = last * 3.5;
    }
    return noise;
  }
  // One snore: a rumbling breath in (low noise shaken by a fast flutter, with a low hum), then a soft sigh out.
  function breath(ctx, at) {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx);
    const low = ctx.createBiquadFilter();
    low.type = "lowpass";
    low.frequency.value = 420;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, at);
    env.gain.exponentialRampToValueAtTime(1, at + 0.35);
    env.gain.setValueAtTime(1, at + 0.8);
    env.gain.exponentialRampToValueAtTime(0.0001, at + 1.15);
    // The flutter of the snore: the breath's level shaken about 30 times a second.
    const flutter = ctx.createGain();
    flutter.gain.value = 0.6;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 30;
    const depth = ctx.createGain();
    depth.gain.value = 0.4;
    lfo.connect(depth);
    depth.connect(flutter.gain);
    src.connect(low);
    low.connect(flutter);
    flutter.connect(env);
    env.connect(bus);
    const hum = ctx.createOscillator();
    hum.type = "sine";
    hum.frequency.setValueAtTime(92, at);
    hum.frequency.linearRampToValueAtTime(80, at + 1.1);
    const humEnv = ctx.createGain();
    humEnv.gain.setValueAtTime(0.0001, at);
    humEnv.gain.exponentialRampToValueAtTime(0.25, at + 0.35);
    humEnv.gain.exponentialRampToValueAtTime(0.0001, at + 1.15);
    hum.connect(humEnv);
    humEnv.connect(bus);
    // Out: a short, quiet sigh, higher and smoother.
    const out = ctx.createBufferSource();
    out.buffer = noiseBuffer(ctx);
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 900;
    band.Q.value = 0.7;
    const outEnv = ctx.createGain();
    outEnv.gain.setValueAtTime(0.0001, at + 1.5);
    outEnv.gain.exponentialRampToValueAtTime(0.35, at + 1.75);
    outEnv.gain.exponentialRampToValueAtTime(0.0001, at + 2.3);
    out.connect(band);
    band.connect(outEnv);
    outEnv.connect(bus);
    src.start(at, 0);
    src.stop(at + 1.2);
    lfo.start(at);
    lfo.stop(at + 1.2);
    hum.start(at);
    hum.stop(at + 1.2);
    out.start(at + 1.5, 0.4);
    out.stop(at + 2.35);
    breaths++;
  }
  function stopSnore() {
    if (!bus) return;
    const b = bus,
      ctx = busCtx;
    bus = null;
    busCtx = null;
    try {
      b.gain.setTargetAtTime(0, ctx.currentTime, MORNING_SOUND.snoreFade / 3);
      setTimeout(() => {
        try {
          b.disconnect();
        } catch {}
      }, MORNING_SOUND.snoreFade * 1000 + 2500);
    } catch {}
  }

  return {
    /** Called every frame by the morning: snore (true) or not (false). */
    snore(on) {
      want = !!on;
      const s = want ? live() : null;
      if (!s) return void stopSnore();
      try {
        if (!bus || busCtx !== s.ctx) {
          stopSnore();
          bus = s.ctx.createGain();
          bus.gain.value = MORNING_SOUND.snoreLevel;
          bus.connect(s.master);
          busCtx = s.ctx;
          via = "master";
          nextAt = s.ctx.currentTime + 0.15;
        }
        // Each breath is booked a moment before it is due.
        while (nextAt < s.ctx.currentTime + 0.2) {
          nextAt < s.ctx.currentTime && (nextAt = s.ctx.currentTime + 0.05);
          breath(s.ctx, nextAt);
          nextAt += MORNING_SOUND.breathEvery;
        }
      } catch {
        stopSnore();
      }
    },
    /** The wall speaker's ding-dong (sound on only). */
    chime() {
      const s = live();
      if (!s) return;
      try {
        const t0 = s.ctx.currentTime + 0.02;
        MORNING_SOUND.chimeNotes.forEach((f, i) => {
          const at = t0 + i * MORNING_SOUND.chimeGap;
          // A soft bell: the note, a quieter octave and a faint bright partial, each dying away.
          for (const [mult, level] of [
            [1, 1],
            [2, 0.28],
            [3.01, 0.08],
          ]) {
            const o = s.ctx.createOscillator(),
              env = s.ctx.createGain();
            o.type = "sine";
            o.frequency.value = f * mult;
            env.gain.setValueAtTime(0.0001, at);
            env.gain.exponentialRampToValueAtTime(MORNING_SOUND.chimeLevel * level, at + 0.012);
            env.gain.exponentialRampToValueAtTime(0.0001, at + MORNING_SOUND.chimeRing / mult);
            o.connect(env);
            env.connect(s.master);
            o.start(at);
            o.stop(at + MORNING_SOUND.chimeRing + 0.05);
          }
        });
        chimes++;
        via = "master";
      } catch {}
    },
    /** For tests: whether he is snoring, how many breaths and ding-dongs have played, and through what. */
    debug() {
      return { snoring: !!bus && want, breaths, chimes, via };
    },
  };
}
