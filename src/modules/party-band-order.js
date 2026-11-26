/**
 * Which of the band's tracks plays (Brian 2026-11-26, band order): "Funky Chunk until he dances; his dance starts
 * Stormtop-Sylvania; after his dance back to Funky Chunk; never restart a song from the top" (party-sound.js carries
 * each track on where it stopped). The tracks are the band's list in music-picks.js.
 */
import { listFor } from "./music-picks.js";

// Seconds the band's song takes to fade out when it ends (the photo, closing time): never a dead stop (Brian
// 2026-11-26: "really abrupt transition from them singing to stopping").
export const BAND_FADE = 1.5;

export const BAND_ORDER = Object.freeze({ idle: "funkySong", dance: "bandSong" });

/** The band's track now (its place in the band's list): Stormtop-Sylvania while he dances, else Funky Chunk. */
export function bandTrackNow(p) {
  const list = listFor("band"),
    i = list.indexOf(p && p.dance ? BAND_ORDER.dance : BAND_ORDER.idle);
  return i < 0 ? 0 : i;
}

/**
 * True while the party is going on in the hall (Brian 2026-11-26: "Anytime the party's going on in the other room,
 * should be muted music and we should see notes floating in through the door"): the band from P3 to P6 while it plays,
 * and P8c (home early, "Keep going") until Mops comes home after closing time. At home the band is heard muffled then,
 * notes drift in under his door, and the home music waits (party.js musicCue).
 */
export function partyOnNow(p) {
  if (!p || p.alarm) return false;
  if (["P3", "P4", "P5", "P6"].includes(p.scene)) return !!p.band;
  return p.scene === "P8c" && !p.mopsComing;
}
