/**
 * The party's sounds (party plan, "Sounds, named so each step makes them"; the sound plan of 2026-11-24, section 5;
 * Brian 2026-11-24: "34(A)" use every sound tagged MY PICK on the sound board, "35 (A)" real recordings from the
 * Kenney Impact Sounds pack for the pyramid's crash and the footsteps; K 341: "it's not making any noise music when
 * it's happening"). Everything plays through the game's master volume (its AudioContext and master gain, as
 * morning-sound.js does); nothing plays while sound is off, and nothing here starts the sound engine. Sound starts
 * off (PR #77), so every sound here also has a drawing (notes over the band, the cheer lines, the camera's red
 * light, the hiccup bubbles, the notes from the hallway, the alarm's flashing light).
 *   one(name)     a sound by name (party-board-sounds.js BOARD; "crash" and "step" play recordings once loaded)
 *   song(i)       the Croc Boys: 0, 1 or 2 plays that song; -1 stops (see SONGS)
 *   muffle(on)    the band heard through his door when he is at home
 *   ambience(k)   "door" (the party through his door before the peek), "murmur" (the crowd), or "" (none)
 *   hum(level)    Mops humming Floating in Space in the hallway: Brian's recording, quiet and muffled
 *   takeBreak()   true once each time the band stops dead and shouts (the game shows the band's line then)
 */
import { BOARD, tone, nz, muffled, kick, snare, hat, midi } from "./party-board-sounds.js";

/**
 * The Croc Boys' three songs (Brian 2026-11-24, question 36, "Yes": "an original swing big-band tune with the same
 * feel as 'Pennsylvania 6-5000' but none of its melody; a brassy riff, then the band stops dead and shouts
 * 'Stormtop-vania 1-2-3-4-5!', then kicks back in; three versions for the three songs"). These riffs are written for
 * this game; none is that song's melody. Each song is a 12-bar blues in swing time: a one-bar brass riff moved to
 * the chord of each bar, a walking bass, brushed drums; then two bars where the band stops dead, shouts the line,
 * and a drum fill kicks it back in. A riff note is [beat in the bar, semitones above the root, length in beats].
 */
export const SONGS = Object.freeze([
  Object.freeze({ bpm: 168, root: 53, riff: [[0, 12, 0.6], [0.67, 16, 0.3], [1, 19, 0.6], [1.67, 21, 0.3], [2, 19, 1], [3.67, 16, 0.3]], level: 0.07 }),
  Object.freeze({ bpm: 176, root: 55, riff: [[0, 19, 0.6], [0.67, 19, 0.3], [1, 17, 0.6], [1.67, 16, 0.3], [2, 12, 1.4], [3.67, 14, 0.3]], level: 0.07 }),
  Object.freeze({ bpm: 152, root: 50, riff: [[0, 12, 0.9], [1, 15, 0.6], [1.67, 17, 0.3], [2, 19, 0.9], [3, 22, 0.6], [3.67, 19, 0.3]], level: 0.07 }),
]);
// The chord of each bar (semitones above the root), then the two break bars.
export const FORM = Object.freeze([0, 0, 0, 0, 5, 5, 0, 0, 7, 5, 0, 0, "break", "break"]);
// Recordings (sounds/, CC0, Kenney Impact Sounds; sounds/CREDITS.txt).
export const RECORDINGS = Object.freeze({
  crash: ["sounds/impactPlate_light_000.mp3", "sounds/impactGlass_light_001.mp3", "sounds/impactMetal_light_000.mp3", "sounds/impactPlate_light_002.mp3"],
  step: ["sounds/footstep_concrete_000.mp3", "sounds/footstep_concrete_001.mp3", "sounds/footstep_concrete_002.mp3", "sounds/footstep_concrete_003.mp3", "sounds/footstep_concrete_004.mp3"],
});
// Made-up stand-ins a real recording would do better (for Brian; none downloaded without his yes).
export const RECORDING_LATER = Object.freeze(["murmur", "cheer", "clap", "gasp", "shout", "rustle", "huff", "door", "flyers", "hiccup"]);
export const PARTY_SOUND = Object.freeze({
  hum: Object.freeze({ url: "music/floating-in-space.mp3", skip: 2.95, level: 0.18, muffle: 520 }),
  ahead: 0.3, // seconds of song notes scheduled ahead
  door: 3.9, // the party through his door repeats this often
  murmur: 2.8,
});

export function createPartySound(getEngine) {
  let song = -1,
    nextBeat = 0,
    beatNo = 0,
    breakDue = false,
    humSrc = null,
    humGain = null,
    humBuf = null,
    humLoading = false,
    amb = "",
    ambNext = 0,
    bus = null,
    low = null,
    muffled_ = false;
  const recs = {},
    loading = {};
  const played = []; // tests: what was asked to play (the last 300)
  const note = (name) => (played.push(name), played.length > 300 && played.shift());
  let ambGain = null;
  function live() {
    const e = getEngine();
    if (!e || !e.soundState || e.soundState() !== "on") return null;
    const c = e.audioCtx(),
      master = e.masterGain();
    return c && master ? { c, o: master } : null;
  }
  // The band's bus: through a low-pass filter, opened in the hall and closed (muffled) at home.
  function songOut(A) {
    if (!bus || bus.context !== A.c) {
      low = A.c.createBiquadFilter();
      low.type = "lowpass";
      low.frequency.value = muffled_ ? 420 : 12000;
      bus = A.c.createGain();
      bus.connect(low);
      low.connect(A.o);
    }
    return { c: A.c, o: bus };
  }
  // Recordings load the first time sound is on; until then their made-up stand-in plays.
  function load(A, name) {
    if (recs[name] || loading[name] || typeof fetch !== "function") return;
    loading[name] = true;
    Promise.all(RECORDINGS[name].map((u) => fetch(u).then((r) => r.arrayBuffer()).then((b) => A.c.decodeAudioData(b))))
      .then((bufs) => (recs[name] = bufs))
      .catch(() => {});
  }
  let recNo = 0;
  function playRec(A, name, t, v) {
    const bufs = recs[name];
    if (!bufs) return false;
    const src = A.c.createBufferSource(),
      g = A.c.createGain();
    src.buffer = bufs[recNo++ % bufs.length];
    g.gain.value = v;
    src.connect(g);
    g.connect(A.o);
    src.start(t);
    return true;
  }
  const RECORDED = {
    // the chain: plates, glass and metal, one after another
    crash: (A, t) => [0, 0.22, 0.42, 0.66].every((s, i) => playRec(A, "crash", t + s, 0.6 - i * 0.08)),
    step: (A, t) => playRec(A, "step", t, 0.5),
  };
  // One bar of the band at time t (bar = index in FORM).
  function bar(A, S, b, t) {
    const beat = 60 / S.bpm,
      chord = FORM[b],
      out = songOut(A);
    if (chord === "break") {
      // the band stops dead; the first break bar is the shout, the second ends in a drum fill
      if (FORM[b - 1] !== "break") return BOARD.shout(out, t, beat), (breakDue = true);
      [3, 3.33, 3.67].forEach((x, i) => snare(out, t + x * beat, 0.8 + i * 0.2));
      return;
    }
    for (let i = 0; i < 4; i++) {
      const at = t + i * beat;
      // walking bass: root, third, fifth, sixth of the bar's chord
      tone(out, { t: at, f: midi(S.root - 12 + chord + [0, 4, 7, 9][i]), d: beat * 0.85, type: "triangle", v: S.level * 1.8 });
      i % 2 === 0 ? kick(out, at, 0.45) : snare(out, at, 0.55);
      hat(out, at, 0.7);
      i % 2 === 1 && hat(out, at + beat * 0.67, 0.5);
    }
    // the brass riff: a lead and a fourth below it, brassy (sawtooth, a little vibrato)
    for (const [x, semi, len] of S.riff) {
      const at = t + x * beat,
        f = midi(S.root + chord + semi);
      tone(out, { t: at, f, d: len * beat, type: "sawtooth", v: S.level * 0.5, a: 0.02, vib: 4, vibF: 6 });
      tone(out, { t: at, f: f * 0.75, d: len * beat, type: "sawtooth", v: S.level * 0.35, a: 0.02 });
      tone(out, { t: at, f: f / 2, d: len * beat, type: "triangle", v: S.level * 0.4, a: 0.02 });
    }
  }
  function throughDoor(A, t) {
    const M = muffled(A, 330),
      beat = 60 / 124,
      bass = [45, 45, 52, 52, 50, 50, 52, 47];
    for (let n = 0; n < 8; n++) (kick(M, t + n * beat, 0.5), tone(M, { t: t + n * beat, f: midi(bass[n]), d: beat * 0.8, type: "triangle", v: 0.12 }));
    nz(muffled(A, 600), { t, d: 3.9, v: 0.05, f: 500, q: 0.5, a: 0.4, hold: 3 });
  }
  return {
    /** One sound by name (party-board-sounds.js). Silent while sound is off. */
    one(name) {
      note(name);
      const A = live();
      if (!A) return;
      const t = A.c.currentTime + 0.01;
      if (RECORDINGS[name]) {
        load(A, name);
        if (RECORDED[name](A, t)) return;
        return name === "step" ? BOARD.boots(A, t) : BOARD.crash(A, t);
      }
      BOARD[name] && BOARD[name](A, t);
    },
    /** The band: `i` 0, 1 or 2 plays that song; -1 stops. */
    song(i) {
      i !== song && ((song = i), (beatNo = 0), (nextBeat = 0), i >= 0 && note("song" + i));
    },
    /** The party heard through his door ("door"), the crowd ("murmur"), or nothing (""). */
    ambience(k) {
      if (k === amb) return;
      amb = k;
      ambNext = 0;
      k && note("ambience-" + k);
      // what is already scheduled stops at once (its own gain fades out); a new ambience gets a new gain
      ambGain && ambGain.gain.setTargetAtTime(0, ambGain.context.currentTime, 0.05);
      ambGain = null;
    },
    /** True once each time the band stops dead and shouts (then the game shows the band's line). */
    takeBreak() {
      const b = breakDue;
      breakDue = false;
      return b;
    },
    /** Mops's humming from the hallway, at `level` (0 to 1): his own recording, quiet and muffled. */
    hum(level) {
      const A = live();
      if (!A || !(level > 0)) {
        humGain && humGain.gain.setTargetAtTime(0, humGain.context.currentTime, 0.2);
        return;
      }
      if (!humBuf) {
        if (!humLoading && typeof fetch === "function") {
          humLoading = true;
          fetch(PARTY_SOUND.hum.url)
            .then((r) => r.arrayBuffer())
            .then((b) => A.c.decodeAudioData(b))
            .then((buf) => (humBuf = buf))
            .catch(() => {});
        }
        return;
      }
      if (!humSrc || humSrc.context !== A.c) {
        humSrc = A.c.createBufferSource();
        humSrc.buffer = humBuf;
        humSrc.loop = true;
        humSrc.loopStart = PARTY_SOUND.hum.skip;
        const lp = A.c.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = PARTY_SOUND.hum.muffle;
        humGain = A.c.createGain();
        humGain.gain.value = 0;
        humSrc.connect(lp);
        lp.connect(humGain);
        humGain.connect(A.o);
        humSrc.start(0, PARTY_SOUND.hum.skip);
        note("hum");
      }
      humGain.gain.setTargetAtTime(PARTY_SOUND.hum.level * level, A.c.currentTime, 0.2);
    },
    /** The band through his door (at home) or in the room. */
    muffle(on) {
      muffled_ = !!on;
      low && low.frequency.setTargetAtTime(muffled_ ? 420 : 12000, low.context.currentTime, 0.1);
    },
    /** Every frame: schedules the band's next bars and the ambience ahead (nothing while sound is off). */
    tick() {
      const A = live();
      if (!A) return;
      const now = A.c.currentTime;
      if (amb) {
        ambNext < now && (ambNext = now + 0.05);
        if (ambNext < now + PARTY_SOUND.ahead) {
          if (!ambGain || ambGain.context !== A.c) ((ambGain = A.c.createGain()), ambGain.connect(A.o));
          const B = { c: A.c, o: ambGain };
          amb === "door" ? throughDoor(B, ambNext) : BOARD.murmur(muffled(B, 900), ambNext, PARTY_SOUND.murmur + 0.4);
          ambNext += amb === "door" ? PARTY_SOUND.door : PARTY_SOUND.murmur;
        }
      }
      if (song < 0) return;
      const S = SONGS[song],
        barLen = (60 / S.bpm) * 4;
      nextBeat < now && (nextBeat = now + 0.05);
      while (nextBeat < now + PARTY_SOUND.ahead) {
        bar(A, S, beatNo % FORM.length, nextBeat);
        nextBeat += barLen;
        beatNo++;
      }
    },
    /** Stops the band, the ambience and the humming (the party is over, or a restart). */
    stop() {
      song = -1;
      amb = "";
      ambGain && ambGain.gain.setTargetAtTime(0, ambGain.context.currentTime, 0.05);
      ambGain = null;
      humGain && humGain.gain.setTargetAtTime(0, humGain.context.currentTime, 0.1);
    },
    /** Tests: every sound asked for, in order, the song now, and which recordings have loaded. */
    debug() {
      return { played: played.slice(), song, ambience: amb, recordings: Object.keys(recs) };
    },
  };
}
