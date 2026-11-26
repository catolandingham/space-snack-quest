/**
 * The party's sounds (party plan, "Sounds, named so each step makes them"; the sound plan of 2026-11-24, section 5;
 * Brian 2026-11-24: "34(A)" use every sound tagged MY PICK on the sound board, "35 (A)" real recordings from the
 * Kenney Impact Sounds pack for the pyramid's crash and the footsteps; K 341: "it's not making any noise music when
 * it's happening"). Everything plays through the game's master volume (its AudioContext and master gain, as
 * morning-sound.js does); nothing plays while sound is off, and nothing here starts the sound engine. Sound starts
 * off (PR #77), so every sound here also has a drawing (notes over the band, the cheer lines, the camera's red
 * light, the hiccup bubbles, the alarm's flashing light).
 *   one(name)     a sound by name (party-board-sounds.js BOARD; "crash" and "step" play recordings once loaded)
 *   song(i, fade) the Croc Boys: i plays the ith track of the band's list in music-picks.js (party-band-order.js
 *                 picks which); -1 stops, fading out over about `fade` seconds (0.4 if not given). A track that
 *                 comes back carries on where it stopped, never from the top (Brian 2026-11-26). Until a recording
 *                 has loaded, SONGS[i] plays in its place
 *   chase(on)     the octopus chase's music (music-picks.js "chase", Run Amok), looping while on
 *   sting()       the FUR! moment's sting, once
 *   muffle(on)    the band heard through his door when he is at home
 *   ambience(k)   "door" (the party through his door before the peek), "murmur" (the crowd), or "" (none)
 *   hum(level)    Mops humming as he mops his way in at closing time: the closing hum's pick (music-picks.js), quiet
 *   takeBreak()   true once each time the band stops dead and shouts, or (the recording) sings out its line: the
 *                 game shows the band's line then
 */
import { BOARD, tone, nz, muffled, kick, snare, hat, midi } from "./party-board-sounds.js";
import { spanFor, fileFor, matchFor, listFor, SOUND_PICKS } from "./music-picks.js";
import { buses } from "./sound-mix.js";

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
export const RECORDING_LATER = Object.freeze(["murmur", "cheer", "clap", "gasp", "shout", "rustle", "huff", "door", "hiccup"]);
export const PARTY_SOUND = Object.freeze({
  // The Croc Boys' songs: the band's list in music-picks.js (Stormtop-Sylvania, then Funky Chunk, round the list), each
  // looping while its song lasts, through the band's bus (so it is muffled through his door at home), at `level` times
  // the file's loudness match. Until a song's file has loaded, and if it cannot be, the made-up songs below play in
  // its place. `shouts`: seconds into Stormtop-Sylvania where the band sings out "Stormtop-Sylvania! One, two, three,
  // four, five!" (from a speech-to-text pass, to about a second): the band's line shows over them then, as in the
  // made-up songs' breaks. (Funky Chunk has no words: no line.)
  band: Object.freeze({ level: 0.6, shouts: Object.freeze({ bandSong: Object.freeze([5, 29, 39, 96, 105]) }) }),
  // (the file and where it starts: the closing hum's pick in music-picks.js; null, silence, until Brian picks one:
  // the hum was Floating in Space, which is sung)
  hum: Object.freeze({ url: fileFor("closing-hum"), skip: spanFor("closing-hum") ? spanFor("closing-hum").from : 0, level: 0.18, muffle: 520 }),
  ahead: 0.3, // seconds of song notes scheduled ahead
  // the crowd's recording at home, through his door: this share of its level (and muffled)
  crowdHome: 0.6,
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
    muffled_ = false,
    bandSrc = null,
    bandGain = null,
    bandAt = 0,
    bandPos = 0,
    bandTrack = -1,
    bandOff = 0,
    chaseSrc = null,
    chaseGain = null,
    chaseBuf = null,
    chaseLoading = false,
    chaseOn = false,
    stingBuf = null,
    stingLoading = false;
  const bandBufs = {},
    bandLoading = {},
    // where each track was when it stopped (seconds into its file): it carries on from there next time
    resumeAt = {};
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
      // the band is music: it goes through the music level under the master (sound-mix.js), as all music does
      const b = buses(getEngine());
      low.connect(b ? b.music : A.o);
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
  // The band's recordings (the band's list in music-picks.js; song i plays its ith track, round the list): each loaded
  // once sound is on; started from its top when a song starts; stopped with a short fade when the band stops.
  function bandLoad(A, n) {
    const url = fileFor("band", n);
    if (!url || bandBufs[url] || bandLoading[url] || typeof fetch !== "function") return;
    bandLoading[url] = true;
    fetch(url)
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error("band " + r.status))))
      .then((b) => A.c.decodeAudioData(b))
      .then((b) => (bandBufs[url] = b))
      .catch(() => {});
  }
  function bandStart(A, n) {
    const out = songOut(A),
      sp = spanFor("band", n),
      buf = bandBufs[fileFor("band", n)];
    bandSrc = A.c.createBufferSource();
    bandSrc.buffer = buf;
    bandSrc.loop = true;
    bandSrc.loopStart = sp.from;
    bandSrc.loopEnd = Math.min(sp.to, buf.duration);
    bandGain = A.c.createGain();
    bandGain.gain.value = PARTY_SOUND.band.level * matchFor("band", n);
    bandSrc.connect(bandGain);
    bandGain.connect(out.o);
    bandOff = resumeAt[n] != null && resumeAt[n] >= sp.from && resumeAt[n] < bandSrc.loopEnd ? resumeAt[n] : sp.from;
    bandSrc.start(0, bandOff);
    bandAt = A.c.currentTime;
    bandPos = 0;
    bandTrack = n;
    note("band-recording:" + fileFor("band", n));
  }
  // Where the playing track is now, seconds into its file.
  function bandWhere() {
    const sp = spanFor("band", bandTrack),
      len = bandSrc.loopEnd - sp.from;
    return sp.from + ((bandOff - sp.from + bandGain.context.currentTime - bandAt) % len);
  }
  function bandStop(fade) {
    if (!bandSrc) return;
    try {
      const t = bandGain.context.currentTime,
        f = fade == null ? 0.4 : fade;
      resumeAt[bandTrack] = bandWhere();
      bandGain.gain.setTargetAtTime(0, t, f / 5);
      bandSrc.stop(t + f + 0.2);
    } catch {}
    bandSrc = null;
    bandGain = null;
  }
  // The sting (the FUR! moment): loaded once sound is on, played once each time (music-picks.js "caught").
  function stingLoad(A) {
    const url = fileFor("caught");
    if (!url || stingBuf || stingLoading || typeof fetch !== "function") return;
    stingLoading = true;
    fetch(url)
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error("sting " + r.status))))
      .then((b) => A.c.decodeAudioData(b))
      .then((b) => (stingBuf = b))
      .catch(() => {});
  }
  // The party's crowd (music-picks.js SOUND_PICKS.crowd: Brian's pick of 2026-11-26, a real recording, "crowd 1 with
  // the band on top"): looped whenever guests are in the hall (crowd(on, muffled) says so every frame), quietly under
  // the band, muffled through his door at home; loaded once sound is on. Until it has loaded (or with no file), the
  // made-up murmur plays in its place (the ambience below).
  let crowdBuf = null,
    crowdLoading = false,
    crowdSrc = null,
    crowdGain = null,
    crowdLow = null,
    crowdWant = false,
    crowdMuffled = false;
  function crowdLoad(A) {
    const pick = SOUND_PICKS.crowd;
    if (!pick || !pick.url || crowdBuf || crowdLoading || typeof fetch !== "function") return;
    crowdLoading = true;
    fetch(pick.url)
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error("crowd " + r.status))))
      .then((b) => A.c.decodeAudioData(b))
      .then((b) => (crowdBuf = b))
      .catch(() => (crowdLoading = false));
  }
  // Every frame: the crowd's loop at its level while wanted (faded out otherwise). True while the recording plays.
  function crowdTick(A) {
    crowdLoad(A);
    if (!crowdBuf) return false;
    if (!crowdSrc || crowdSrc.context !== A.c) {
      const b = buses(getEngine());
      crowdSrc = A.c.createBufferSource();
      crowdSrc.buffer = crowdBuf;
      crowdSrc.loop = true;
      crowdLow = A.c.createBiquadFilter();
      crowdLow.type = "lowpass";
      crowdLow.frequency.value = 12000;
      crowdGain = A.c.createGain();
      crowdGain.gain.value = 0.0001;
      crowdSrc.connect(crowdLow);
      crowdLow.connect(crowdGain);
      crowdGain.connect(b ? b.fx : A.o);
      crowdSrc.start(0, Math.random() * Math.max(0, crowdBuf.duration - 1));
      note("crowd-recording:" + SOUND_PICKS.crowd.url);
    }
    crowdLow.frequency.setTargetAtTime(crowdMuffled ? 420 : 12000, A.c.currentTime, 0.1);
    crowdGain.gain.setTargetAtTime(crowdWant ? SOUND_PICKS.crowd.level * (crowdMuffled ? PARTY_SOUND.crowdHome : 1) : 0.0001, A.c.currentTime, 0.25);
    return true;
  }
  // The chase music: loaded once sound is on, started (from its top) while the chase is on.
  function chaseTick(A) {
    const url = fileFor("chase");
    if (!url) return;
    if (!chaseBuf && !chaseLoading && typeof fetch === "function") {
      chaseLoading = true;
      fetch(url)
        .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error("chase " + r.status))))
        .then((b) => A.c.decodeAudioData(b))
        .then((b) => (chaseBuf = b))
        .catch(() => {});
    }
    if (!chaseOn || !chaseBuf || (chaseSrc && chaseSrc.context === A.c)) return;
    const sp = spanFor("chase"),
      b = buses(getEngine());
    chaseSrc = A.c.createBufferSource();
    chaseSrc.buffer = chaseBuf;
    chaseSrc.loop = true;
    chaseSrc.loopStart = sp.from;
    chaseSrc.loopEnd = Math.min(sp.to, chaseBuf.duration);
    chaseGain = A.c.createGain();
    chaseGain.gain.value = 0.0001;
    chaseGain.gain.setTargetAtTime(PARTY_SOUND.band.level * matchFor("chase"), A.c.currentTime, 0.05);
    chaseSrc.connect(chaseGain);
    chaseGain.connect(b ? b.music : A.o);
    chaseSrc.start(0, sp.from);
    note("chase-recording:" + url);
  }
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
    /** The FUR! moment: the sting, once (music-picks.js "caught"; silent until it has loaded, and while sound is off). */
    sting() {
      note("sting");
      const A = live();
      if (!A || !stingBuf) return;
      const src = A.c.createBufferSource(),
        g = A.c.createGain(),
        b = buses(getEngine());
      src.buffer = stingBuf;
      g.gain.value = matchFor("caught");
      src.connect(g);
      g.connect(b ? b.music : A.o);
      src.start();
    },
    /** The band: `i` plays the ith track of the band's list; -1 stops, fading over `fade` seconds. */
    song(i, fade) {
      i !== song && (bandStop(fade), (song = i), (beatNo = 0), (nextBeat = 0), i >= 0 && note("song" + i), i < 0 && fade != null && note("fade"));
    },
    /** The octopus chase's music, Run Amok (music-picks.js "chase"): on starts it, off stops it with a short fade. */
    chase(on) {
      on = !!on;
      if (on === chaseOn) return;
      chaseOn = on;
      note(on ? "chase" : "chase-off");
      if (!on && chaseSrc) {
        try {
          const t = chaseGain.context.currentTime;
          chaseGain.gain.setTargetAtTime(0, t, 0.08);
          chaseSrc.stop(t + 0.6);
        } catch {}
        chaseSrc = null;
        chaseGain = null;
      }
    },
    /**
     * The crowd: `on` while guests are in the hall (the band playing or not), `muffled` while he hears it through his
     * door at home. Its recording plays; until it has loaded, the made-up stand-ins do (the ambience).
     */
    crowd(on, muffledNow) {
      crowdWant = !!on;
      crowdMuffled = !!muffledNow;
      crowdBuf || this.ambience(on ? (muffledNow ? "door" : "murmur") : "");
    },
    /** The party heard through his door ("door"), the crowd ("murmur"), or nothing (""): the stand-ins. */
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
    /** Mops's humming as he mops his way in at closing time, at `level` (0 to 1): his own recording, quiet and muffled. */
    hum(level) {
      if (!PARTY_SOUND.hum.url) return; // the closing hum's pick is silence (music-picks.js)
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
      stingLoad(A);
      chaseTick(A);
      // (the crowd's recording, once loaded, takes the place of the made-up murmur and the party through his door)
      crowdTick(A) && amb && ((amb = ""), ambGain && ambGain.gain.setTargetAtTime(0, ambGain.context.currentTime, 0.05), (ambGain = null));
      if (amb) {
        ambNext < now && (ambNext = now + 0.05);
        if (ambNext < now + PARTY_SOUND.ahead) {
          if (!ambGain || ambGain.context !== A.c) ((ambGain = A.c.createGain()), ambGain.connect(A.o));
          const B = { c: A.c, o: ambGain };
          // (the crowd: its recording, once Brian picks one and it has loaded, round and round; until then the
          // made-up murmur: crowdTick)
          amb === "door" ? throughDoor(B, ambNext) : BOARD.murmur(muffled(B, 900), ambNext, PARTY_SOUND.murmur + 0.4);
          ambNext += amb === "door" ? PARTY_SOUND.door : PARTY_SOUND.murmur;
        }
      }
      if (song < 0) return;
      // this song's recording (Stormtop-Sylvania, Funky Chunk, ...), once it has loaded (the made-up song plays until
      // then); the next song's is loaded ahead
      bandLoad(A, song);
      bandLoad(A, song + 1);
      const buf = bandBufs[fileFor("band", song)];
      if (buf) {
        bandSrc && (bandSrc.context !== A.c || bandTrack !== song) && bandStop();
        bandSrc || bandStart(A, song);
        // where the recording is now (it loops): crossing one of its shouts shows the band's line
        const sp = spanFor("band", song),
          len = Math.min(sp.to, buf.duration) - sp.from,
          pos = (bandOff - sp.from + now - bandAt) % len,
          crossed = (x) => (pos >= bandPos ? x > bandPos && x <= pos : x > bandPos || x <= pos);
        (PARTY_SOUND.band.shouts[listFor("band")[song % listFor("band").length]] || []).some(crossed) && (breakDue = true);
        bandPos = pos;
        return;
      }
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
      bandStop();
      crowdWant = false;
      crowdGain && crowdGain.gain.setTargetAtTime(0, crowdGain.context.currentTime, 0.2);
      this.chase(false);
      song = -1;
      amb = "";
      ambGain && ambGain.gain.setTargetAtTime(0, ambGain.context.currentTime, 0.05);
      ambGain = null;
      humGain && humGain.gain.setTargetAtTime(0, humGain.context.currentTime, 0.1);
    },
    /** Tests: every sound asked for, in order, the song now, and which recordings have loaded. */
    debug() {
      return { played: played.slice(), song, ambience: amb, recordings: Object.keys(recs), band: { loaded: Object.keys(bandBufs), playing: bandSrc ? fileFor("band", bandTrack) : "", at: bandSrc ? Math.round(bandWhere() * 10) / 10 : null, resumeAt: { ...resumeAt }, level: PARTY_SOUND.band.level }, chase: { on: chaseOn, playing: !!chaseSrc }, crowd: { want: crowdWant, muffled: crowdMuffled, playing: !!crowdSrc && crowdWant, loaded: !!crowdBuf }, sting: !!stingBuf };
    },
  };
}
