/**
 * The morning's music (the morning's pick in music-picks.js): Brian's Goating in Space (2026-11-26, his remake of
 * his Floating in Space recording, which it replaces everywhere at home). It plays once from the top, fades out at
 * its end, and the room is quiet after it until the next morning (Brian: "I don't think it should play all the way
 * thru a lot of times").
 * Brian, 2026-11-23 (Q8): it plays from the Dog Zylan line until "That evening…", then fades; Joe's theme
 * stays for the title and later home scenes.
 *
 * It plays as a decoded buffer through the game's music level, under the master volume (sound-mix.js), not
 * as a second <audio> element: a buffer needs no extra start inside a tap (the sound button's tap already
 * started the sound engine), it loops without a gap, and the dip under the singing works on iPhones, which
 * ignore an <audio> element's volume. It never starts while sound is off. If the file cannot be fetched or
 * decoded (a page opened straight from disk), it stays silent and nothing else changes.
 *
 * A play starts at `skip`, the start of the picked stretch, just before its first note (Floating in Space's first 3
 * seconds were near silence), and every loop (of a stretch that loops) goes back there (Brian, 2026-11-23: "I should be hearing the song
 * before this", at Mops's song line). Mops's line waits for audible() (morning.js).
 *
 * Loudness (sound plan section 8, Brian 2026-11-24): every level here is multiplied by the file's `match`
 * (music-picks.js MUSIC_FILES: Floating in Space is 10 dB quieter than Joe's theme), so `first` 1 sounds as loud as
 * Joe's theme, and the background level is half of that.
 */
import { buses } from "./sound-mix.js";
import { spanFor, fileFor, matchFor, SPAN_FADE, playSound } from "./music-picks.js";

export const HOME_MUSIC = Object.freeze({
  url: fileFor("morning"), // the morning's pick (music-picks.js; since 2026-11-26 a stand-in with no singing)
  first: 1, // the first play, right after the Dog Zylan line
  background: 0.5, // every later loop, and a start after sound was turned on late: half the featured level
  dip: 0.35, // share of the level kept while a sung line is up
  fade: 1.5, // seconds to fade out on "That evening…"
  skip: spanFor("morning").from, // where the morning's stretch of its file starts (music-picks.js SPANS)
  loopEnd: spanFor("morning").to, // and where it ends (and loops back, unless it plays once)
  once: !!spanFor("morning").once, // plays once from the top, fades out at its end, and the room is quiet after (Brian 2026-11-26)
  match: matchFor("morning"), // how much its file is turned up to sound as loud as Joe's theme
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
    starts = 0,
    playedOut = false;

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
    // a song that plays once fades out over its last moments
    if (HOME_MUSIC.once && src && ctxUsed && ctxUsed.currentTime - startedAt >= length() - SPAN_FADE.out) return 0;
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
      gain.gain.value = target * HOME_MUSIC.match;
      gain.connect(b.music);
      via = b.music === engine().masterGain() ? "master" : "music";
      src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = !HOME_MUSIC.once;
      const end = Math.min(buffer.duration, HOME_MUSIC.loopEnd),
        skip = Math.min(HOME_MUSIC.skip, end - 1);
      src.loopStart = skip;
      src.loopEnd = end;
      src.connect(gain);
      src.start(0, skip);
      ctxUsed = ctx;
      startedAt = ctx.currentTime;
      starts++;
      // Mops's goat bleat in the song's gaps for it (Goating in Space: music-picks.js `bleats`), through the song's
      // own level, so it dips and fades with the song
      for (const at of spanFor("morning").bleats || []) at > skip && playSound(ctx, gain, "mops-bleat", startedAt + (at - skip), 1 / HOME_MUSIC.match);
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
      playedOut = false;
      owning = true;
      fading = dipped = wantFirst = wanted = false;
      load();
    },
    /** A new morning with its opening cards: no recording, and the room's music is free (Joe's theme may play). */
    release() {
      silence();
      playedOut = false;
      owning = fading = dipped = wantFirst = wanted = false;
    },
    /** The Dog Zylan tap: the recording plays from now on, at once if sound is on. */
    start() {
      owning = true;
      playedOut = false;
      wanted = true;
      fading = false;
      // Sound already on: this is the first play, at full level. Off now and on later: background level.
      wantFirst = soundOn();
      askedAt = typeof performance !== "undefined" ? performance.now() : Date.now();
      load();
    },
    /** True once the song can be heard, or when it never will be: sound off, the file failed, or it took too long. */
    audible() {
      if (!wanted || failed || fading || playedOut || !soundOn()) return true;
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
      if (wanted && !src && soundOn() && !fading && !playedOut) {
        load();
        // Started with sound on: the first play. Sound turned on later: from the top, at background level.
        buffer && (play(wantFirst), (wantFirst = false));
      }
      if (src && firstPlay && ctxUsed && ctxUsed.currentTime - startedAt >= length()) firstPlay = false;
      // played once to its end: quiet from now on, until the next morning (it fades out over SPAN_FADE.out first)
      if (HOME_MUSIC.once && src && ctxUsed && ctxUsed.currentTime - startedAt >= length()) ((playedOut = true), silence());
      if (gain && ctxUsed) {
        target = level();
        try {
          gain.gain.setTargetAtTime(target * HOME_MUSIC.match, ctxUsed.currentTime, fading ? HOME_MUSIC.fade / 4 : 0.12);
        } catch {}
      }
    },
    /** For tests: what is playing and how loud it is meant to be. */
    debug() {
      const playedFor = src && ctxUsed ? ctxUsed.currentTime - startedAt : 0;
      return { owns: owning, playing: !!src, target: src ? target : 0, gain: src ? target * HOME_MUSIC.match : 0, background: HOME_MUSIC.background, via, starts, failed, loaded: !!buffer, playedFor, once: HOME_MUSIC.once, playedOut };
    },
  };
}
