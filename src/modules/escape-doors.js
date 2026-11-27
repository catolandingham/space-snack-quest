/**
 * Walking between rooms yourself (story pass 2026-11-26, the rule "walk by default": no scripted walk moves Squatch for
 * the player). Each room's doorways (escape-place.js ES_DOORS) are walk-through: the walker's feet in a doorway's
 * opening take him through, and he comes in at that door's place on the other side. Used for Mops's walk home (44d) and
 * Squatch's walks with Mops behind him (47, 50, 52).
 * Mops follows Squatch along Squatch's own trail, a step behind (FOLLOW.gap), so he goes round whatever Squatch went
 * round. Through a door he comes in just behind him.
 */
import { ES_DOORS, FOLLOW } from "./escape-place.js";
import { highlightBox } from "./outline.js";

/** The doorway in `room` whose opening holds the feet `p`, or null. `only` (a room name) limits it to the door there. */
export function doorAt(room, p, only) {
  return (ES_DOORS[room] || []).find((d) => (!only || d.to === only) && p.x >= d.box.x0 && p.x <= d.box.x1 && p.y >= d.box.y0 && p.y <= d.box.y1) || null;
}
/** The doorway from `room` toward `to`, or null. */
export const doorTo = (room, to) => (ES_DOORS[room] || []).find((d) => d.to === to) || null;
/** The one highlight round the next doorway of a walk (the dashed gold line). */
export function markDoor(ctx, d, t) {
  d && highlightBox(ctx, d.mark, t, 2);
}

/** A fresh trail for a follower. */
export const freshTrail = () => ({ pts: [] });
/**
 * One frame of Mops following: the leader's feet `lead` go on the trail; Mops (feet `m`) walks toward the oldest trail
 * point more than FOLLOW.gap behind the leader. Returns where Mops should step to, or null to stand still.
 */
export function followStep(trail, lead, m) {
  const pts = trail.pts,
    last = pts[pts.length - 1];
  (!last || Math.hypot(lead.x - last.x, lead.y - last.y) > 6) && pts.push({ x: lead.x, y: lead.y });
  if (Math.hypot(lead.x - m.x, lead.y - m.y) <= FOLLOW.gap) return null;
  // the first trail point Mops has not reached that is still more than a gap from the leader
  while (pts.length > 1 && Math.hypot(pts[0].x - m.x, pts[0].y - m.y) < 6) pts.shift();
  const to = pts[0];
  return to && Math.hypot(lead.x - to.x, lead.y - to.y) > FOLLOW.gap * 0.5 ? to : null;
}
