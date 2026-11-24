/**
 * Brian's Floating in Space recording (music/floating-in-space.mp3, his own Nov 4 recording) in the morning.
 * Brian, 2026-11-23 (Q8): it plays from the Dog Zylan line until "That evening…", then fades; Joe's theme
 * stays for the title and later home scenes.
 *
 * It plays as a decoded buffer through the game's master volume (the same gain every sound effect uses), not
 * as a second <audio> element: a buffer needs no extra start inside a tap (the sound button's tap already
 * started the sound engine), it loops without a gap, and the dip under the singing works on iPhones, which
 * ignore an <audio> element's volume. It never starts while sound is off. If the file cannot be fetched or
 * decoded (a page opened straight from disk), it stays silent and nothing else changes.
 */
export const HOME_MUSIC = Object.freeze({
  url: "music/floating-in-space.mp3",
  first: 1, // the first play, right after the Dog Zylan line
  background: 0.4, // every later loop, and a start after sound was turned on late
  dip: 0.35, // share of the level kept while a sung line is up
  fade: 1.5, // seconds to fade out on "That evening…"
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
      master = engine() && engine().masterGain();
    if (!ctx || !master || !buffer || src) return;
    try {
      gain = ctx.createGain();
      firstPlay = asFirst;
      target = level();
      gain.gain.value = target;
      gain.connect(master);
      via = "master";
      src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      src.connect(gain);
      src.start(0, 0);
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
    wanted = false;
  return {
    load,
    /** The morning starts: it has the room's music from now on (quiet until the song; no Joe's theme). */
    hold() {
      silence();
      owning = true;
      fading = dipped = wantFirst = wanted = false;
      load();
    },
    /** The Dog Zylan tap: the recording plays from now on, at once if sound is on. */
    start() {
      owning = true;
      wanted = true;
      fading = false;
      // Sound already on: this is the first play, at full level. Off now and on later: background level.
      wantFirst = soundOn();
      load();
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
    /** True once the first play has run its full length. */
    ended() {
      return !!(src && ctxUsed && ctxUsed.currentTime - startedAt >= buffer.duration);
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
      if (src && firstPlay && ctxUsed && ctxUsed.currentTime - startedAt >= buffer.duration) firstPlay = false;
      if (gain && ctxUsed) {
        target = level();
        try {
          gain.gain.setTargetAtTime(target, ctxUsed.currentTime, fading ? HOME_MUSIC.fade / 4 : 0.12);
        } catch {}
      }
    },
    /** For tests: what is playing and how loud it is meant to be. */
    debug() {
      return { owns: owning, playing: !!src, target: src ? target : 0, background: HOME_MUSIC.background, via, starts, failed, loaded: !!buffer };
    },
  };
}
