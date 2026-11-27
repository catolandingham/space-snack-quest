/**
 * The loading bay's watchers, shared by every beat in the bay (the escape, beats 47 to 49; night one, beat 42, when it
 * is rebuilt). Brian, 2026-11-26 (escape video notes 0:38, escape-seen 0:05, 0:09, 0:11, 0:26):
 *   - the bay's walkway (the ramp and its scanner frame), the plant, the bin, the mail room's walls and the mailbox are
 *     solid: nobody walks over them; walks go round (BAY_SOLIDS, feet-sized boxes; tap-path.js findPath).
 *   - a robot or a guard reacts only once its drawn cone is on him (the points of him as he is drawn in this room) and
 *     stays on him for SIGHT.register seconds, a "?" filling in over it meanwhile; never when the cone stops short.
 *   - security looks like security (the party's guard: party-art.js LOOKS.guard, blue uniform and cap), walks round the
 *     bay's things, and its flashlight cone shows the whole time it is out, searching included.
 * Game positions are the 960 x 640 picture (the locked bay pictures are 1280 x 830: x * 0.75, y * 0.771). Places are
 * PLACEHOLDERS for Brian, except what the locked picture fixes.
 */
import { distToCone, coneFrom, SQUATCH_OUTLINE } from "./party-watch.js";
import { findPath } from "./tap-path.js";
import { drawPerson, LOOKS, drawMark } from "./party-art.js";
import { adultPxFor } from "./room-sizes.js";

/**
 * What feet cannot walk through in the bay (each box already grown by a person's feet: 25 either side, 14 behind,
 * 8 in front). The plant and the walkway are in the locked picture. The plant stands right of the bin, a few steps
 * along the back wall from the left doorway (the locked bay pictures v3, Brian's yes to question 75, 2026-11-26: the
 * older program's CH1_FURNITURE.hangar plant, x 273 to 318, grown by the feet), so a walk in from the doorway goes round
 * the bin's front.
 */
export const BAY_SOLIDS = Object.freeze([
  Object.freeze({ id: "plant", x0: 248, x1: 343, y0: 300, y1: 380 }),
  Object.freeze({ id: "bin", x0: 162, x1: 262, y0: 326, y1: 384 }),
  Object.freeze({ id: "walkway", x0: 322, x1: 612, y0: 280, y1: 428 }),
  Object.freeze({ id: "mail room wall", x0: 660, x1: 946, y0: 345, y1: 377 }),
  Object.freeze({ id: "mail room wall, left", x0: 655, x1: 719, y0: 345, y1: 432 }),
  Object.freeze({ id: "mail room wall, low", x0: 655, x1: 719, y0: 492, y1: 640 }),
  Object.freeze({ id: "mailbox", x0: 822, x1: 934, y0: 430, y1: 486 }),
]);
/** The left doorway, from the hallway (picture y 350 to 455), and the way in round the bin's front. */
export const BAY_DOOR = Object.freeze({ out: Object.freeze({ x: 6, y: 318 }), in: Object.freeze({ x: 50, y: 330 }), round: Object.freeze({ x: 52, y: 430 }) });
/** The corners of a walk from `a` to `b` round the bay's things (tap-path.js), or the straight line when it is clear. */
export function bayPath(a, b) {
  return findPath(a, b, { x0: 0, x1: 960, y0: 290, y1: 620 }, BAY_SOLIDS) || [{ x: b.x, y: b.y }];
}

/**
 * Sight: a cone sees him when it is on any point of him as he is drawn in this room (`k`: his drawing's scale there,
 * his units to game pixels; his feet at `sq`), so what the drawn cone covers is what it sees.
 *   register  seconds the cone must stay on him before the watcher reacts ("?" filling in meanwhile)
 */
export const SIGHT = Object.freeze({ register: 0.5, len: 210, half: 0.42 });
// His drawn outline (party-watch.js SQUATCH_OUTLINE, measured at the party hall's size, HALL_K), every 2 pixels or less,
// plus points inside him: scaled to the room's size, these are where a cone is on him.
const HALL_K = 1.648;
const BODY = (() => {
  const out = [];
  for (let i = 0; i < SQUATCH_OUTLINE.length; i++) {
    const [x0, y0] = SQUATCH_OUTLINE[i],
      [x1, y1] = SQUATCH_OUTLINE[(i + 1) % SQUATCH_OUTLINE.length],
      n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 2));
    for (let k = 0; k < n; k++) out.push([(x0 + ((x1 - x0) * k) / n) / HALL_K, (y0 + ((y1 - y0) * k) / n) / HALL_K]);
  }
  for (const [x, y] of [[0, -2], [0, -22], [0, -40], [-10, -30], [10, -30]]) out.push([x, y]);
  return out;
})();
/** The points of him (his outline and inside it) at feet `sq`, drawn at scale `k` (his units to game pixels). */
export function bodyPoints(sq, k) {
  return BODY.map(([x, y]) => ({ x: sq.x + x * k, y: sq.y + y * k }));
}
/** True when cone `c` (party-watch.js coneFrom) is on him as drawn at scale `k`. */
export function coneOnBody(c, sq, k) {
  return bodyPoints(sq, k).some((p) => distToCone(p.x, p.y, c.ox, c.oy, c.a, c.half, c.len) <= 0);
}
/**
 * One watcher's sight, every frame: `w.seenT` grows while its cone is on him (and he is not hidden), and falls back to
 * 0 the moment it is not. Returns "" (nothing), "?" (registering) or "!" (seen: SIGHT.register reached).
 */
export function watchTick(w, cone, sq, k, hidden, dt) {
  w.seenT = !hidden && coneOnBody(cone, sq, k) ? (w.seenT || 0) + dt : 0;
  return w.seenT >= SIGHT.register ? "!" : w.seenT > 0 ? "?" : "";
}
/** The cone drawn: dashed edge, a pale fill, yellow while it is on him (the same test as sight). Returns `inside`. */
export function drawWatchCone(ctx, c, inside, beam = false) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(c.ox, c.oy);
  ctx.arc(c.ox, c.oy, c.len, c.a - c.half, c.a + c.half);
  ctx.closePath();
  ctx.fillStyle = inside ? "rgba(255,214,60,.62)" : beam ? "rgba(255,246,200,.42)" : "rgba(255,240,170,.28)";
  ctx.fill();
  ctx.setLineDash([10, 7]);
  ctx.lineWidth = 3;
  ctx.strokeStyle = inside ? "rgba(170,110,10,.95)" : "rgba(120,100,60,.75)";
  ctx.stroke();
  ctx.restore();
  return inside;
}
/** The "?" filling in while a cone registers him (k 0 to 1), or the "!" once it has: over the watcher's head. */
export function drawWatchMark(ctx, x, y, mark, k = 1, t = 0) {
  if (!mark) return;
  mark === "?" ? drawMark(ctx, x, y, "?", 30, t, { k: Math.min(1, k) }) : drawMark(ctx, x, y, "!", 34, t);
}

/**
 * A guard (the one capture rule's security): he comes in through the bay's left doorway, round the plant, and searches
 * toward where he was told the sighting was, his flashlight cone in front of him all the way. Seen (his cone on him for
 * SIGHT.register) he goes for him, round the bay's things; reaching him is the catch. If Squatch is hidden (rolled up)
 * when the guard gets to the place, the guard looks round there for GUARD.look seconds and leaves the way he came:
 * "They lost you.". Speeds in game pixels a second; PLACEHOLDERS.
 */
export const GUARD = Object.freeze({ walk: 120, run: 150, reach: 34, look: 2.2 });
export function newGuard(to) {
  return { x: BAY_DOOR.out.x, y: BAY_DOOR.out.y, a: 0, f: 1, phase: "in", t: 0, seenT: 0, to: { x: to.x, y: to.y }, route: [BAY_DOOR.in, BAY_DOOR.round].map((q) => ({ ...q })) };
}
function rollAlong(g, speed, dt) {
  const to = g.route[0];
  if (!to) return true;
  const d = Math.hypot(to.x - g.x, to.y - g.y);
  if (d > 0.5) ((g.a = Math.atan2(to.y - g.y, to.x - g.x)), (g.f = to.x < g.x ? -1 : 1));
  if (d <= speed * dt) ((g.x = to.x), (g.y = to.y), g.route.shift());
  else ((g.x += ((to.x - g.x) * speed * dt) / d), (g.y += ((to.y - g.y) * speed * dt) / d));
  return !g.route.length;
}
/** The guard's flashlight cone (from his eyes, the way he looks). */
export function guardCone(g) {
  const c = coneFrom("guard", g.x, g.y, g.a, { half: SIGHT.half, len: SIGHT.len }),
    eye = g.y - adultPxFor("hangar") * 0.82; // (his flashlight at his eyes as the bay draws him)
  return { ...c, oy: eye, beam: true };
}
/**
 * One frame of the guard. `sq` his feet, `k` his drawn scale, `hidden` true while he is rolled up or hidden. Returns
 * "caught" when the guard reaches him standing, "lost" when the guard has given up and gone, else "".
 */
export function guardTick(g, sq, k, hidden, dt) {
  g.t += dt;
  const mark = g.phase === "leave" ? "" : watchTick(g, guardCone(g), sq, k, hidden, dt);
  g.mark = mark;
  if (g.phase !== "leave" && g.phase !== "chase" && mark === "!") Object.assign(g, { phase: "chase", t: 0, route: [] });
  if (g.phase === "in") {
    if (rollAlong(g, GUARD.walk, dt)) Object.assign(g, { phase: "search", t: 0, route: bayPath(g, g.to) });
  } else if (g.phase === "search") {
    if (rollAlong(g, GUARD.walk, dt)) {
      // at the place: he turns his light from side to side, then gives up
      g.a = Math.sin(g.t * 2.2) * 1.2 + (g.f < 0 ? Math.PI : 0);
      g.look = (g.look || 0) + dt;
      g.look >= GUARD.look && Object.assign(g, { phase: "leave", t: 0, route: [...bayPath(g, BAY_DOOR.round), BAY_DOOR.in, BAY_DOOR.out].map((q) => ({ ...q })) });
    }
  } else if (g.phase === "chase") {
    if (hidden) return (Object.assign(g, { phase: "search", t: 0, look: 0, to: { x: sq.x, y: sq.y }, route: bayPath(g, sq) }), "");
    // (the path is worked out again every half second as he moves)
    if (!g.route.length || g.t - (g.planned || 0) > 0.5) ((g.route = bayPath(g, sq)), (g.planned = g.t));
    rollAlong(g, GUARD.run, dt);
    if (Math.hypot(sq.x - g.x, sq.y - g.y) <= GUARD.reach) return "caught";
  } else if (g.phase === "leave") {
    if (rollAlong(g, GUARD.walk, dt)) return "lost";
  }
  return "";
}
/** The guard drawn as the party's guard (blue uniform and cap), at the bay's grown-up size, and his flashlight cone. */
export function drawGuard(ctx, g, sq, k, hidden, t) {
  const c = guardCone(g),
    inside = !hidden && coneOnBody(c, sq, k);
  g.phase !== "leave" || g.x > 0 ? drawWatchCone(ctx, c, inside, true) : null;
  drawPerson(ctx, g.x, g.y, adultPxFor("hangar") * 1.02, LOOKS.guard, g.f || 1, t);
  drawWatchMark(ctx, g.x + 18, g.y - adultPxFor("hangar") * 1.25, g.mark, (g.seenT || 0) / SIGHT.register, t);
  return { cone: c, inside };
}
