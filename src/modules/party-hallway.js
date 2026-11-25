/**
 * The hallway doorway at the party in disguise (P6). He cannot go that way yet, and the game says so the way any
 * game does (Brian 2026-11-24: "it can just be like any other video game where you try to go somewhere that you
 * can't go yet, and you kind of get bounced back slightly"): walking into the doorway he is pushed back a short
 * way, quickly, with a small bump, and then he thinks one line. Every time he tries. Nothing is drawn in the
 * doorway itself (no beard: "the visual of the beard is probably not helpful").
 * The bounce is a small state on the party's game-state object: p.bounce = { x0, y, x1, t }.
 */
import { HALLWAY_ZONE } from "./party-hall.js";
import { line, oval, INK } from "./party-art.js";

// PLACEHOLDERS for Brian: how far back he is pushed (game pixels) and how fast, how high the little hop is, and
// how long the bump mark shows (seconds, from the moment he hits).
export const BOUNCE = Object.freeze({ back: 44, seconds: 0.2, hop: 9, mark: 0.32, markR: 16 });

export const inHallwayZone = (s) => s.x > HALLWAY_ZONE.x0 && s.x < HALLWAY_ZONE.x1 && s.y > HALLWAY_ZONE.y0 && s.y < HALLWAY_ZONE.y1;

/** He walked into the doorway at feet `s`: the push back starts. */
export function startBounce(p, s) {
  p.bounce = { x0: s.x, y: s.y, x1: s.x - BOUNCE.back, t: 0 };
  return p.bounce;
}
/** One frame of the push. Returns { x, y, done }: where his feet are now, and true once the bump is over. */
export function tickBounce(p, dt) {
  const b = p.bounce;
  if (!b) return { done: true };
  b.t += dt;
  const k = Math.min(1, b.t / BOUNCE.seconds),
    e = 1 - (1 - k) * (1 - k); // fast at first, easing to a stop
  return { x: b.x0 + (b.x1 - b.x0) * e, y: b.y, done: b.t >= BOUNCE.mark };
}
/** How far off the floor the bump lifts him now (a small hop while he is pushed back). */
export function bounceHop(p) {
  const b = p.bounce;
  return b ? Math.sin(Math.min(1, b.t / BOUNCE.seconds) * Math.PI) * BOUNCE.hop : 0;
}
/** The bump mark: where it is drawn (at the doorway side of where he hit, at `scale` of his size) and how faded. */
export function bumpMark(p, scale) {
  const b = p.bounce;
  return b ? { x: b.x0 + 20 * scale, y: b.y - 30 * scale, r: BOUNCE.markR, k: Math.max(0, 1 - b.t / BOUNCE.mark) } : null;
}
/** The bump, drawn: a small burst of short rays round a white spark, fading out. No words. */
export function drawBump(ctx, m) {
  if (!m || !(m.k > 0)) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, m.k * 2.5);
  const grow = 0.7 + 0.3 * (1 - m.k);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.3,
      r0 = m.r * 0.45 * grow,
      r1 = m.r * grow,
      pts = [m.x + Math.cos(a) * r0, m.y + Math.sin(a) * r0, m.x + Math.cos(a) * r1, m.y + Math.sin(a) * r1];
    line(ctx, pts, INK, 6);
    line(ctx, pts, "#ffcf33", 3.5);
  }
  oval(ctx, m.x, m.y, m.r * 0.3, m.r * 0.3, "#fffdf8", 2);
  ctx.restore();
}
