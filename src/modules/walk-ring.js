/**
 * The walk-tap ring: the small white ring on the floor that shows where a tap is walking him. It is not drawn on a
 * place the goal's yellow outline already marks (Brian 2026-11-24, on the white ring above his outlined door:
 * "I don't think we need that the circle"): one mark per place.
 *   target  where the tap is heading (game position)
 *   goal    the goal outline on screen this frame, or null: { box (what the outline goes round), spot (the goal's
 *           own spot entry: verb, and its place x, y, r or box) }
 * Both come from the goal's own entries (goal-targets.js and the scene's spot); nothing is typed here.
 */
// How close to the outlined thing a tap's ring would crowd the outline (game pixels: the ring is about 20 across
// each way, plus a small gap).
export const WALK_RING = Object.freeze({ clear: 30 });

export function walkRingShows(target, goal) {
  if (!target || !goal || !goal.box) return true;
  const b = goal.box,
    dx = Math.max(b.x0 - target.x, 0, target.x - b.x1),
    dy = Math.max(b.y0 - target.y, 0, target.y - b.y1);
  if (Math.hypot(dx, dy) <= WALK_RING.clear) return false;
  // A goal he walks into (a doorway: a spot with no button) is marked by its outline; a tap anywhere in the place
  // that takes him through needs no second mark. A button's spot can cover a whole room, so it does not count.
  const s = goal.spot;
  if (s && !s.verb) {
    if (s.box) return !(target.x > s.box.x0 && target.x < s.box.x1 && target.y > s.box.y0 && target.y < s.box.y1);
    if (s.r > 0) return Math.hypot(target.x - s.x, target.y - s.y) >= s.r;
  }
  return true;
}
