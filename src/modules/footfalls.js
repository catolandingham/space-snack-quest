/**
 * Footsteps only while someone actually moves (Brian 2026-11-25, showing-5 note 9: at 2:10 of the keep-going video
 * boots kept sounding while the guard stood still talking to Mops). One rule for everyone who has footsteps: a
 * footfall every `every` seconds while that person's feet moved this frame, none while they stand. Checked across
 * Chapter 1 by tests/footsteps.mjs.
 */
// How far (game pixels) feet must move in a frame to count as walking.
export const FOOTFALL = Object.freeze({ moved: 0.3 });

/**
 * One frame for a walker `o` (any object: it keeps `ffT`, `ffX`, `ffY` on it) whose feet are at (x, y) now. True
 * when a footfall should sound now. Standing still sounds nothing and starts the count over, so the first footfall
 * comes `every` seconds after setting off.
 */
export function footfall(o, x, y, dt, every) {
  const moved = o.ffX != null && Math.hypot(x - o.ffX, y - o.ffY) > FOOTFALL.moved;
  o.ffX = x;
  o.ffY = y;
  if (!moved) return ((o.ffT = 0), false);
  o.ffT = (o.ffT || 0) + dt;
  return o.ffT >= every ? ((o.ffT = 0), true) : false;
}
