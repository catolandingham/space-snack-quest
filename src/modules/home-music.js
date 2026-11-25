/**
 * Brian's Floating in Space recording (music/floating-in-space.mp3, his own Nov 4 recording) in the morning.
 * Brian, 2026-11-23 (Q8): it plays from the Dog Zylan line until "That evening…", then fades; Joe's theme
 * stays for the title and later home scenes.
 *
 * It plays as a decoded buffer through the game's music level, under the master volume (sound-mix.js), not
 * as a second <audio> element: a buffer needs no extra start inside a tap (the sound button's tap already
 * started the sound engine), it loops without a gap, and the dip under the singing works on iPhones, which
 * ignore an <audio> element's volume. It never starts while sound is off. If the file cannot be fetched or
 * decoded (a page opened straight from disk), it stays silent and nothing else changes.
 *
 * The file's first 3 seconds are near silence (measured with ffmpeg: below -50 dB until 3.05 s), so a
 * play starts at `skip`, just before the first note, and every loop goes back there (Brian, 2026-11-23: "I
 * should be hearing the song before this", at Mops's song line). Mops's line waits for audible() (morning.js).
 *
 * Loudness (sound plan section 8, Brian 2026-11-24): the file is 10 dB quieter than Joe's theme, so every level
 * here is multiplied by MIX.floatingMatch (sound-mix.js); `first` 1 then sounds as loud as Joe's theme, and the
 * background level is half of that.
 */
import { MIX, buses } from "./sound-mix.js";

export const HOME_MUSIC = Object.freeze({
  url: "music/floating-in-space.mp3",
  first: 1, // the first play, right after the Dog Zylan line
  background: 0.5, // every later loop, and a start after sound was turned on late: half the featured level
  dip: 0.35, // share of the level kept while a sung line is up
  fade: 1.5, // seconds to fade out on "That evening…"
  skip: 2.95, // seconds of near silence at the start of the file, skipped (the first note is at 3.05 s)
  loopEnd: 29.6, // the song's last note dies away by here; the rest of the file is silence
  heardAfter: 1.5, // seconds the song plays (its first notes, past the quiet start) before Mops sings along
  waitAtMost: 5, // seconds Mops's song line waits for the song at most (slow loading must not stall the game)
});

export function createHomeMusic(getEngine) {
  let buffer = null,
    loading = false,
    failed = false,
    owning = false,
    fading = false,
    fadeLeft = 0,
    dipped = false,
    src = null,
    gain = null,
    ctxUsed = null,
    startedAt = 0,
    firstPlay = false,
    target = 0,
    via = "",
    starts = 0;

  const engine = () => getEngine();
  function audio() {
    const e = engine();
    return e ? e.audioCtx() : null;
  }
  function soundOn() {
    const e = engine();
    return !!e && e.soundState() === "on";
  }
  /** Fetch and decode the file once (needs the sound engine, which exists only once sound was turned on). */
  function load() {
    const ctx = audio();
    if (!ctx || buffer || loading || failed) return;
    loading = true;
    try {
      fetch(HOME_MUSIC.url)
        .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error("music " + r.status))))
        .then((data) => new Promise((ok, bad) => ctx.decodeAudioData(data, ok, bad)))
        .then((b) => ((buffer = b), (loading = false)))
        .catch(() => ((failed = true), (loading = false)));
    } catch {
      failed = true;
      loading = false;
    }
  }
  function level() {
    if (fading) return 0;
    return (firstPlay ? HOME_MUSIC.first : HOME_MUSIC.background) * (dipped ? HOME_MUSIC.dip : 1);
  }
  function play(asFirst) {
    const ctx = audio(),
      b = buses(engine());
    if (!ctx || !b || !buffer || src) return;
    try {
      gain = ctx.createGain();
      firstPlay = asFirst;
      target = level();
      gain.gain.value = target * MIX.floatingMatch;
      gain.connect(b.music);
      via = b.music === engine().masterGain() ? "master" : "music";
      src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      const end = Math.min(buffer.duration, HOME_MUSIC.loopEnd),
        skip = Math.min(HOME_MUSIC.skip, end - 1);
      src.loopStart = skip;
      src.loopEnd = end;
      src.connect(gain);
      src.start(0, skip);
      ctxUsed = ctx;
      startedAt = ctx.currentTime;
      starts++;
    } catch {
      src = null;
    }
  }
  function silence() {
    try {
      src && src.stop();
    } catch {}
    try {
      gain && gain.disconnect();
    } catch {}
    src = null;
    gain = null;
  }
  let wantFirst = false,
    wanted = false,
    askedAt = -1;
  const length = () => (buffer ? Math.min(buffer.duration, HOME_MUSIC.loopEnd) - Math.min(HOME_MUSIC.skip, buffer.duration - 1) : 0);
  return {
    load,
    /** The morning starts: it has the room's music from now on (quiet until the song; no Joe's theme). */
    hold() {
      silence();
      owning = true;
      fading = dipped = wantFirst = wanted = false;
      load();
    },
    /** A new morning with its opening cards: no recording, and the room's music is free (Joe's theme may play). */
    release() {
      silence();
      owning = fading = dipped = wantFirst = wanted = false;
    },
    /** The Dog Zylan tap: the recording plays from now on, at once if sound is on. */
    start() {
      owning = true;
      wanted = true;
      fading = false;
      // Sound already on: this is the first play, at full level. Off now and on later: background level.
      wantFirst = soundOn();
      askedAt = typeof performance !== "undefined" ? performance.now() : Date.now();
      load();
    },
    /** True once the song can be heard, or when it never will be: sound off, the file failed, or it took too long. */
    audible() {
      if (!wanted || failed || fading || !soundOn()) return true;
      const now = typeof performance !== "undefined" ? performance.now() : Date.now();
      if (askedAt >= 0 && now - askedAt > HOME_MUSIC.waitAtMost * 1000) return true;
      return !!(src && ctxUsed && ctxUsed.currentTime - startedAt >= HOME_MUSIC.heardAfter);
    },
    /** Lower the recording while a sung line is up (true), and bring it back (false). */
    dip(on) {
      dipped = !!on;
    },
    /** "That evening…": fade out, then give the room back to Joe's theme. */
    stop() {
      if (!owning || fading) return;
      fading = true;
      fadeLeft = HOME_MUSIC.fade;
    },
    /** True while the morning has the home room's music (Joe's theme stays quiet). */
    owns() {
      return owning;
    },
    tick(dt) {
      if (!owning) return;
      if (fading) {
        fadeLeft -= dt || 0;
        if (fadeLeft <= 0) {
          silence();
          owning = wanted = false;
          fading = false;
          return;
        }
      }
      if (wanted && !src && soundOn() && !fading) {
        load();
        // Started with sound on: the first play. Sound turned on later: from the top, at background level.
        buffer && (play(wantFirst), (wantFirst = false));
      }
      if (src && firstPlay && ctxUsed && ctxUsed.currentTime - startedAt >= length()) firstPlay = false;
      if (gain && ctxUsed) {
        target = level();
        try {
          gain.gain.setTargetAtTime(target * MIX.floatingMatch, ctxUsed.currentTime, fading ? HOME_MUSIC.fade / 4 : 0.12);
        } catch {}
      }
    },
    /** For tests: what is playing and how loud it is meant to be. */
    debug() {
      const playedFor = src && ctxUsed ? ctxUsed.currentTime - startedAt : 0;
      return { owns: owning, playing: !!src, target: src ? target : 0, gain: src ? target * MIX.floatingMatch : 0, background: HOME_MUSIC.background, via, starts, failed, loaded: !!buffer, playedFor };
    },
  };
}
