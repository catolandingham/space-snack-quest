/**
 * How loud music and sound effects sit against each other (sound plan sections 8 and 9, Brian 2026-11-24).
 *
 * The game has one master volume (the sound button: on or off, so it still fades on an iPhone). Under it the
 * older program (src/game/00-core.js) makes two levels: one for music (Joe's theme, Brian's Floating in Space,
 * the made-up tunes) and one for sound effects (every beep, bubble tick, snore and splash). This file says
 * how loud each is (the engine reads MIX through the bridge when it makes them); nothing else types them.
 *
 * Measured with ffmpeg (ebur128, whole file) on 2026-11-24: Joe's theme is -17.1 LUFS, Brian's Floating in
 * Space -27.1 LUFS, so his recording is 10 dB quieter. `floatingMatch` turns it up by those 10 dB, so at the
 * same level the two sound equally loud (home-music.js).
 */
export const MIX = Object.freeze({
  music: 0.8, // music sits a little under the effects, so an effect is always easy to hear over it
  effects: 1,
  floatingMatch: 3.16, // 10 dB: Brian's Floating in Space up to the loudness of Joe's theme
});

/**
 * The two levels under the master, from the engine (`engine` is the bridge's handed-over engine). The engine
 * makes both when sound starts, at the MIX levels (it reads them from the bridge). Null while sound is off.
 * A page with an older engine (no split) plays both through the master.
 */
export function buses(engine) {
  if (!engine || engine.soundState() !== "on") return null;
  const ctx = engine.audioCtx(),
    master = engine.masterGain();
  if (!ctx || !master) return null;
  return { ctx, music: (engine.musicGain && engine.musicGain()) || master, fx: (engine.fxGain && engine.fxGain()) || master };
}
