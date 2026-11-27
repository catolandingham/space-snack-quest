/**
 * The voices under speech bubbles (Brian 2026-11-26, showing 7 at 0:05: "We don't hear something happen when he's
 * talking from the stage... like the Charlie Brown teacher noise... maybe we can do that anytime there's someone
 * speaking"). Brian's pick of 2026-11-26 (the music page, "a man" style): recorded syllables (OpenGameArt "Dialog
 * vocal samples", CC0; sounds/voices/), a random one from the speaker's set about every 0.09 s for the line's length,
 * a short pause every 5 (SYLLABLES, VOICE_SETS). The made-up "wah-wah" options (A, B, C) stay as one-line switches.
 *   - Its length follows the line's.
 *   - Each speaker has a set and a pitch: most grown-ups (Isfred, the guests, the bartender, security, the speakers)
 *     a man's standard voice, each a little shifted; the Croc Boys the deep one; some guests a woman's (standard or
 *     light); the robot guest the robot voice; Squatch the standard one pitched up a little (VOICES, GUEST_VOICES).
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
  official: Object.freeze({ f: 196, bright: 1, set: "male_standard", rate: 1 }), // Isfred, in the middle
  band: Object.freeze({ f: 98, bright: 0.85, set: "male_deep", rate: 1 }), // the Croc Boys, low
  // the party guests, each a little different (which guest: GUEST_VOICES)
  tourist: Object.freeze({ f: 175, spread: 0.35, bright: 1, set: "male_standard", rate: 1.05 }),
  bartender: Object.freeze({ f: 233, bright: 1.05, set: "female_standard", rate: 1 }),
  guard: Object.freeze({ f: 131, bright: 0.9, set: "male_standard", rate: 0.9 }),
  sq: Object.freeze({ f: 294, bright: 1.15, set: "male_standard", rate: 1.22 }), // Squatch, higher
  speaker: Object.freeze({ f: 220, bright: 1.4, set: "male_standard", rate: 1.02 }), // the wall speaker at home
  pa: Object.freeze({ f: 220, bright: 1.4, set: "male_standard", rate: 1.02 }), // the party hall's wall speaker
  mops: Object.freeze({ own: "meh" }),
  // the evening of Day 2 (evening.js): the station robots and the robot mailbox; the family and the guest at the storm
  robot: Object.freeze({ f: 180, bright: 1.2, set: "robot", rate: 1 }),
  ups: Object.freeze({ f: 160, bright: 1.2, set: "robot", rate: 0.95 }),
  dad: Object.freeze({ f: 160, bright: 1, set: "male_standard", rate: 1.04 }),
  mom: Object.freeze({ f: 233, bright: 1.05, set: "female_standard", rate: 1 }),
  kid: Object.freeze({ f: 300, bright: 1.15, set: "female_light", rate: 1.15 }),
  guest: Object.freeze({ f: 210, bright: 1, set: "female_light", rate: 1 }),
});
/** The party's guests (party.js `talker`, the one saying a "tourist" line): each one's set and pitch. */
export const GUEST_VOICES = Object.freeze({
  teal: Object.freeze({ set: "female_standard", rate: 1 }),
  stilt: Object.freeze({ set: "male_standard", rate: 0.93 }),
  robot: Object.freeze({ set: "robot", rate: 1 }),
  "octopus-guest": Object.freeze({ set: "male_standard", rate: 1.1 }),
  backpack: Object.freeze({ set: "female_light", rate: 1 }),
  camera: Object.freeze({ set: "male_standard", rate: 1.04 }),
});
/** The recorded syllables: four of each set (sounds/voices/<set>_<1..4>.mp3). */
export const VOICE_SETS = Object.freeze(["male_standard", "male_deep", "female_standard", "female_light", "robot"]);
export const voiceFile = (set, i) => `sounds/voices/${set}_${i + 1}.mp3`;
// PLACEHOLDERS: a syllable every `every` seconds, a pause of `pause` after each `group`, about `chars` letters a
// syllable, at most `most`, each at `level` (under MIX.voices), its pitch moved up to `wobble` either way.
export const SYLLABLES = Object.freeze({ every: 0.09, pause: 0.16, group: 5, chars: 3.2, least: 3, most: 30, level: 0.7, wobble: 0.04 });

/**
 * The syllables a bubble gets, or null for none (a sung line, a thought, Mops): { who, set, rate, at: [seconds from
 * its start], len }. `guest` is the guest saying a "tourist" line (GUEST_VOICES), if known.
 */
export function syllablesFor(b, guest) {
  const plan = babbleFor(b);
  if (!plan) return null;
  const v = (b.who === "tourist" && GUEST_VOICES[guest]) || plan.voice,
    n = Math.max(SYLLABLES.least, Math.min(SYLLABLES.most, Math.round(b.text.replace(/[^A-Za-z0-9]/g, "").length / SYLLABLES.chars))),
    at = [];
  let t = 0;
  for (let i = 0; i < n; i++) {
    at.push(Math.round(t * 1000) / 1000);
    t += SYLLABLES.every + ((i + 1) % SYLLABLES.group === 0 ? SYLLABLES.pause : 0);
  }
  return { who: b.who, guest: guest || "", set: v.set, rate: v.rate, at, len: Math.round(t * 1000) / 1000 };
}

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
 * The voice under bubbles, three ways for Brian to choose from (Brian 2026-11-26; samples in
 * tests/out/.../round-d/sounds/): "A" a muted trombone's "wah-wah" (the default), "B" a mumbly hum, "C" a short blip
 * a syllable. One line to switch.
 */
export const VOICE_STYLE = "S"; // "S": the recorded syllables (Brian's pick); "A", "B", "C": the made-up ones

/**
 * Plays a babble (babbleFor) into A = { c: an AudioContext, o: the node it plays into } from time t, in `style`
 * (VOICE_STYLE unless given). Returns the gain node it all goes through.
 */
export function playBabble(A, t, plan, style = VOICE_STYLE) {
  return (VOICE_PLAYERS[style] || VOICE_PLAYERS.A)(A, t, plan);
}
// One syllable's level: silent before it starts (no click), up quickly, held, then away by its end.
function syllableGain(c, t0, d, level, hold = 0.7) {
  const g = c.createGain();
  g.gain.value = 0.0001;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(level, t0 + Math.min(0.03, d * 0.3));
  g.gain.setValueAtTime(level, t0 + d * hold);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
  return g;
}
// B: a mumbly hum, "mm-hm-mm": a soft triangle through a low, closed filter, each syllable gliding into the next.
function playHum(A, t, plan) {
  const c = A.c,
    out = c.createGain();
  out.connect(A.o);
  for (const s of plan.syllables) {
    const t0 = t + s.at,
      os = c.createOscillator(),
      lp = c.createBiquadFilter(),
      g = syllableGain(c, t0, s.d + 0.03, BABBLE.level * 0.9, 0.8);
    os.type = "triangle";
    os.frequency.setValueAtTime(s.f * 0.98, t0);
    os.frequency.linearRampToValueAtTime(s.f * 1.02, t0 + s.d);
    lp.type = "lowpass";
    lp.Q.value = 2;
    lp.frequency.value = 480;
    os.connect(lp);
    lp.connect(g);
    g.connect(out);
    os.start(t0);
    os.stop(t0 + s.d + 0.08);
  }
  return out;
}
// C: a short square blip a syllable, like an old game's talking text.
function playBlips(A, t, plan) {
  const c = A.c,
    out = c.createGain();
  out.connect(A.o);
  for (const s of plan.syllables) {
    const t0 = t + s.at,
      d = Math.min(0.07, s.d * 0.5),
      os = c.createOscillator(),
      g = syllableGain(c, t0, d, BABBLE.level * 0.35, 0.6);
    os.type = "square";
    os.frequency.setValueAtTime(s.f * 2, t0);
    os.connect(g);
    g.connect(out);
    os.start(t0);
    os.stop(t0 + d + 0.03);
  }
  return out;
}
// A: the muted trombone: each syllable a sawtooth through a low filter that opens and closes ("wah").
function playWah(A, t, plan) {
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
const VOICE_PLAYERS = Object.freeze({ A: playWah, B: playHum, C: playBlips });

/** The voices for the game: speak(b) when a bubble opens (bridge.js bubbleSound). `getEngine` is the bridge's engine. */
export function createSpeechVoice(getEngine, getGuest = () => "") {
  let now = null,
    nowCtx = null;
  const log = [],
    bufs = {},
    loading = {};
  // the syllables of a set, loaded once sound is on (four files a set)
  function loadSet(c, set) {
    if (loading[set] || typeof fetch !== "function") return loading[set] || Promise.resolve();
    bufs[set] = [];
    loading[set] = Promise.all(
      [0, 1, 2, 3].map((i) =>
        fetch(voiceFile(set, i))
          .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error("voice " + r.status))))
          .then((b) => c.decodeAudioData(b))
          .then((d) => bufs[set].push(d))
          .catch(() => {}),
      ),
    );
    return loading[set];
  }
  // the recorded syllables into `out` from time t; false while the set has not loaded (then the made-up voice plays)
  function playSyllables(c, out, t, plan) {
    const set = bufs[plan.set];
    if (!set || !set.length) return false;
    for (const s of plan.at) {
      const src = c.createBufferSource(),
        g = c.createGain();
      src.buffer = set[Math.floor(Math.random() * set.length)];
      src.playbackRate.value = plan.rate * (1 + (Math.random() * 2 - 1) * SYLLABLES.wobble);
      g.gain.value = SYLLABLES.level;
      src.connect(g);
      g.connect(out);
      src.start(t + s);
    }
    return true;
  }
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
        const lvl = bus.ctx.createGain(),
          t = bus.ctx.currentTime + 0.02;
        lvl.gain.value = MIX.voices;
        lvl.connect(bus.fx);
        const syl = VOICE_STYLE === "S" ? syllablesFor(b, b.who === "tourist" ? getGuest() : "") : null;
        now = lvl;
        nowCtx = bus.ctx;
        if (syl) {
          // the first line of a voice waits a moment for its syllables to load (the bubble is up meanwhile)
          const c = bus.ctx,
            entry = { who: plan.who, n: syl.at.length, len: syl.len, set: syl.set, rate: syl.rate, recorded: false };
          log.push(entry);
          playSyllables(c, lvl, t, syl)
            ? (entry.recorded = true)
            : loadSet(c, syl.set).then(() => now === lvl && playSyllables(c, lvl, c.currentTime + 0.02, syl) && (entry.recorded = true));
        } else {
          playBabble({ c: bus.ctx, o: lvl }, t, plan, VOICE_STYLE);
          log.push({ who: plan.who, n: plan.syllables.length, len: plan.len, recorded: false });
        }
        log.length > 200 && log.shift();
        return true;
      } catch {
        return false;
      }
    },
    /** For tests: every voice played (who, how many syllables, how long, which set, recorded or made up). */
    debug() {
      return { log: log.slice(), loaded: Object.fromEntries(Object.entries(bufs).map(([k, v]) => [k, v.length])) };
    },
  };
}
