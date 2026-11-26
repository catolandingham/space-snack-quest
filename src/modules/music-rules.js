/**
 * Singing or music, never both (moved here from src/game/00-core.js on 2026-11-25, Brian's "1"): no background
 * music while a song line is up or its tune is still playing. The music fades back in after.
 *   time       the game clock now
 *   tuneUntil  when the last sung tune ends (game clock)
 *   current    the story step up now ({ k: "bub", b: { style } } for a bubble), or null
 */
export function singingNow(time, tuneUntil, current) {
  return time < (tuneUntil || 0) || !!(current && current.k === "bub" && current.b && current.b.style === "song");
}
