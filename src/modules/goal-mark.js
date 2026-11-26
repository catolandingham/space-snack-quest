/**
 * The goal outline drawn this frame, with its spot's own place (moved here from src/game/12-ch1-redesign.js on
 * 2026-11-25, Brian's "1"). The older program draws the outline (drawGoalMark) and tells this module what it
 * drew; the walk ring (walk-ring.js) asks what is outlined now, so a tap's ring never sits on a place the outline
 * already marks.
 */
// An outline counts as "on screen now" if it was drawn within this many seconds of game time.
const FRESH = 0.1;

export function createGoalMark() {
  let last = null;
  return Object.freeze({
    /** The older program drew the outline round `box` for `spot` (its verb and its place x, y, r or box) at `time`. */
    drew(box, spot, time) {
      last = box && spot ? { box, T: time || 0, place: { verb: spot.verb || "", x: spot.x, y: spot.y, r: spot.r, box: spot.box } } : null;
    },
    /** The outline on screen at `time`: { box, spot }, or null. */
    now(time) {
      return last && (time || 0) - last.T < FRESH ? { box: last.box, spot: last.place } : null;
    },
  });
}
