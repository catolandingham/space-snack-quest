/**
 * The voices under speech bubbles (Brian 2026-11-26, showing 7 at 0:05: "We don't hear something happen when he's
 * talking from the stage... like the Charlie Brown teacher noise... maybe we can do that anytime there's someone
 * speaking"): a short muffled-trombone "wah-wah" babble, made up here (no recording), under every speech bubble.
 *   - Its length follows the line's: a syllable or so a word, a little over a second for a long line.
 *   - Each speaker has a pitch: Isfred in the middle, the Croc Boys low, the guests each a little different, Squatch
 *     higher, the wall speaker a tinny middle (VOICES).
 *   - Mops keeps his own goat "meh" and bleat (morning-sound.js): no babble for him.
 *   - None over a sung line, and none for a thought (Squatch's "whisper" lines are thoughts: nobody says them).
 *   - Quiet against the music: it plays through the sound effects level at MIX.voices (sound-mix.js).
 *   - A new bubble stops the one before it.
 * The older program calls bridge.js bubbleSound for every bubble that opens; that plays this.
 */
import { MIX, buses } from "./sound-mix.js";

/**
 * Each bubble speaker (the older program's names: "official" is Isfred, "tourist" a party guest, "pa" the party
 * hall's wall speaker). `f` is the voice's middle pitch (Hz); `spread` how far a guest's pitch moves line to line (a
 * different guest, a different voice); `bright` how open the trombone's mute gets (1 is the usual); `own` a voice of
 * the speaker's own, played elsewhere ("meh": Mops, morning-sound.js).
 */
export const VOICES = Object.freeze({
  official: Object.freeze({ f: 196, bright: 1 }), // Isfred, in the middle
  band: Object.freeze({ f: 98, bright: 0.85 }), // the Croc Boys, low
  tourist: Object.freeze({ f: 175, spread: 0.35, bright: 1 }), // the party guests, each a little different
  bartender: Object.freeze({ f: 233, bright: 1.05 }),
  guard: Object.freeze({ f: 131, bright: 0.9 }),
  sq: Object.freeze({ f: 294, bright: 1.15 }), // Squatch, higher
  speaker: Object.freeze({ f: 220, bright: 1.4 }), // the wall speaker at home: tinny
  pa: Object.freeze({ f: 220, bright: 1.4 }), // the party hall's wall speaker
  mops: Object.freeze({ own: "meh" }),
});

/**
 * The lines files' speakers (who: in party-lines.js, morning-lines.js, home-alone-lines.js, tv-story-lines.js) and
 * the bubble speakers they show as. tests/speech-voices.mjs checks each has a voice.
 */
export const LINE_SPEAKERS = Object.freeze({
  isfred: Object.freeze(["official"]),
  official: Object.freeze(["official"]),
  sq: Object.freeze(["sq"]),
  guest: Object.freeze(["tourist"]),
  tourist: Object.freeze(["tourist"]),
  octopus: Object.freeze(["tourist"]),
  bartender: Object.freeze(["bartender"]),
  band: Object.freeze(["band"]),
  guard: Object.freeze(["guard"]),
  speaker: Object.freeze(["speaker", "pa"]),
  mops: Object.freeze(["mops"]),
});

// PLACEHOLDERS: seconds a syllable lasts, the most syllables a line gets, and the syllables a word.
export const BABBLE = Object.freeze({ syllable: 0.15, gap: 0.03, most: 10, perWord: 0.8, level: 0.5 });

const hash = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

/**
 * The babble a bubble gets, or null for none: { who, voice, syllables: [{ at, d, f }] (seconds from its start, how
 * long, pitch), len (seconds) }.
 */
export function babbleFor(b) {
  if (!b || !b.text || b.style === "song") return null;
  if (b.style === "whisper" && b.who === "sq") return null; // a thought
  const v = VOICES[b.who];
  if (!v || v.own) return null;
  const words = b.text.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length || 1,
    n = Math.max(2, Math.min(BABBLE.most, Math.round(words * BABBLE.perWord))),
    seed = hash(b.text),
    base = v.f * (v.spread ? 1 + v.spread * (((seed % 1000) / 1000) * 2 - 1) : 1),
    syllables = [];
  let at = 0;
  for (let i = 0; i < n; i++) {
    // a talking tune: up and down round the voice's pitch, falling at the end of the line
    const wob = [0, 2, -1, 3, 1, -2, 2, 0, -3][(i + seed) % 9],
      fall = i === n - 1 ? -3 : 0,
      d = BABBLE.syllable * (i === n - 1 ? 1.5 : 0.8 + ((seed >> i) % 5) * 0.1);
    syllables.push({ at: Math.round(at * 1000) / 1000, d: Math.round(d * 1000) / 1000, f: Math.round(base * 2 ** ((wob + fall) / 12) * 10) / 10 });
    at += d + BABBLE.gap;
  }
  return { who: b.who, voice: v, syllables, len: Math.round(at * 1000) / 1000 };
}

/**
 * Plays a babble (babbleFor) into A = { c: an AudioContext, o: the node it plays into } from time t: each syllable a
 * sawtooth through a low filter that opens and closes ("wah"), like a trombone with a plunger mute. Returns the gain
 * node it all goes through.
 */
export function playBabble(A, t, plan) {
  const c = A.c,
    out = c.createGain();
  out.gain.value = 1;
  out.connect(A.o);
  const bright = plan.voice.bright || 1;
  for (const s of plan.syllables) {
    const t0 = t + s.at,
      os = c.createOscillator(),
      lp = c.createBiquadFilter(),
      g = c.createGain();
    os.type = "sawtooth";
    os.frequency.setValueAtTime(s.f * 1.03, t0);
    os.frequency.exponentialRampToValueAtTime(s.f * 0.97, t0 + s.d);
    lp.type = "lowpass";
    lp.Q.value = 7;
    lp.frequency.setValueAtTime(260 * bright, t0);
    lp.frequency.exponentialRampToValueAtTime(900 * bright, t0 + s.d * 0.4);
    lp.frequency.exponentialRampToValueAtTime(320 * bright, t0 + s.d);
    g.gain.value = 0.0001; // silent before it starts (no click)
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(BABBLE.level, t0 + 0.03);
    g.gain.setValueAtTime(BABBLE.level, t0 + s.d * 0.7);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + s.d);
    os.connect(lp);
    lp.connect(g);
    g.connect(out);
    os.start(t0);
    os.stop(t0 + s.d + 0.05);
  }
  return out;
}

/** The voices for the game: speak(b) when a bubble opens (bridge.js bubbleSound). `getEngine` is the bridge's engine. */
export function createSpeechVoice(getEngine) {
  let now = null,
    nowCtx = null;
  const log = [];
  function stop() {
    if (!now) return;
    try {
      now.gain.setTargetAtTime(0.0001, nowCtx.currentTime, 0.03);
      const n = now;
      setTimeout(() => {
        try {
          n.disconnect();
        } catch {}
      }, 400);
    } catch {}
    now = null;
  }
  return {
    /** A bubble opens: the one before stops, and this one's babble plays (if it gets one and sound is on). */
    speak(b) {
      stop();
      const plan = babbleFor(b),
        bus = buses(getEngine());
      if (!plan || !bus) return false;
      try {
        const lvl = bus.ctx.createGain();
        lvl.gain.value = MIX.voices;
        lvl.connect(bus.fx);
        playBabble({ c: bus.ctx, o: lvl }, bus.ctx.currentTime + 0.02, plan);
        now = lvl;
        nowCtx = bus.ctx;
        log.push({ who: plan.who, n: plan.syllables.length, len: plan.len });
        log.length > 200 && log.shift();
        return true;
      } catch {
        return false;
      }
    },
    /** For tests: every babble played (who, how many syllables, how long). */
    debug() {
      return { log: log.slice() };
    },
  };
}
