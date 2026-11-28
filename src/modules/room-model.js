/**
 * The room model: one answer, for every room, to "where can feet go?" and "who is in front of what?" (Brian's video
 * notes of 2026-11-27: "the janitor is walking on the bar", "the robot appears to just be able to move through
 * things", "Mops's face all of a sudden is behind the crate again", "he shouldn't be able to just push it through the
 * bar"; the review: scratchpad review-nov27/physics-review.md).
 *
 * Before this file only the player's own walk asked the room what is solid (00-core.js R0 and the tap's findPath).
 * Every scripted move (Mops following Squatch, a robot running to the FUR alarm, the pushed crate) went in a straight
 * line through whatever stood there. Now:
 *   - WALKING: the engine's `step` (every scripted move of Squatch and Mops, in every beat) asks `roomWaypoint` for
 *     the next corner. A walk whose straight line is clear goes straight, exactly as before; one that would cross a
 *     solid goes round it (tap-path.js findPath). Module robots and the alarm's runner use `stepRound` the same way.
 *   - WIDTH: a body is wider than the point its feet are. The solid lists allow for about 25 either side of the feet
 *     (a grown-up's feet box); Mops is longer than that (his body reaches about 24 x his scale either side), so his
 *     solids grow by the difference (`BODY`), for his own walk and his scripted ones.
 *   - THE CRATE: a pushed thing has a box of its own; `boxFits` says whether it may stand there.
 *   - DEPTH: the things in a locked picture that people stand behind (the home room's crate bed and bucket) each have
 *     a floor line (`HOME_BASELINES`, the "baseline"): they are drawn in the same back-to-front order as the people,
 *     by that line, so whoever stands in front of one is drawn over it, whoever stands behind it is drawn under it.
 *   - THE RECORD: every move that could not keep out of a solid is written down (`physicsLog`), and
 *     `physicsNow()` checks where everyone stands this frame; tests/room-physics.mjs fails on either.
 * The solid lists themselves still live where each room's beat keeps them (the older program's ih(), the beat that
 * owns the room): this file is the one place that reads them for a move.
 */
import { findPath } from "./tap-path.js";
import { adultPxFor } from "./room-sizes.js";

// How far a body reaches past the feet box the solid lists already count (25 either side), in game pixels, per room.
// Squatch's body (19 x his scale either side) fits the lists everywhere; Mops's (24 x his scale, 1.15 Squatch's) is
// about 20 wider in the party hall and the hallway. At home every list is already for the room's big people.
const FEET_SIDE = 25;
/** The drawn half-width of a walker, in game pixels, in `room`. */
export function bodyHalf(who, room) {
  if (room === "closet") return FEET_SIDE;
  const sq = (adultPxFor(room) * 0.8) / 45;
  return who === "mops" ? 24 * sq * 1.15 : 19 * sq;
}
/** How much wider than the lists' feet box a walker is, each side (0 to 20), and more while he pushes something. */
export function bodyExtra(who, room) {
  // (Squatch's body fits the lists' feet box: only Mops grows them)
  return who === "mops" ? Math.max(0, Math.min(20, Math.round(bodyHalf(who, room) - FEET_SIDE))) : 0;
}
// What a walker pushes in front of him reaches this far past the lists' feet box (a module says: setCarry).
let carryFn = null;
/**
 * A module tells the model how far past his feet box a walker's load reaches, and on which side: fn(who, room) gives
 * { reach, f } (f 1: the load is to his right, -1: to his left) or null.
 */
export function setCarry(fn) {
  carryFn = typeof fn === "function" ? fn : null;
}
function carrying(who, room) {
  const c = carryFn ? carryFn(who, room) : null;
  if (!c || !(c.reach > 0)) return null;
  const out = { reach: Math.round(c.reach), f: c.f < 0 ? -1 : 1 };
  // (the load's own floor, when the module says where it is: from `near` to `far` ahead of his feet, `up` behind them
  // and `down` in front; a load that reaches up the floor further than his feet hits a table his feet pass under)
  if (c.far > 0) Object.assign(out, { near: c.near || 0, far: c.far, up: c.up || 0, down: c.down || 0 });
  return out;
}

let engine = null;
/** The bridge hands over the engine (pos, room, roomSolids, roomBounds) once it has it. */
export function setRoomEngine(e) {
  engine = e;
  paths.clear();
}
const inBox = (b, x, y) => x > b.x0 && x < b.x1 && y > b.y0 && y < b.y1;
// A person's feet box built round the walker himself (a beat lists everyone standing in the room, him too): centred
// on his feet. Somebody else's box with his feet pressed into it is not his.
// (a feet box runs 14 behind the feet and 8 in front: its middle is 3 behind them)
const ownBox = (b, at) => !!(b && b.person && at && Math.abs((b.x0 + b.x1) / 2 - at.x) < 2 && Math.abs((b.y0 + b.y1) / 2 - at.y) < 6);

/**
 * The solids a walker's feet keep out of: `list` (the room's), without the box of the walker himself (a person's
 * feet box with his feet in it), each grown sideways by how much wider than the lists' feet box his body is.
 */
export function moverSolids(who, at, list, room, keepOwn = false) {
  const extra = bodyExtra(who, room),
    load = carrying(who, room),
    exact = !!(load && load.far),
    // (a load in front of him reaches past him on that side only: a thing to his right grows leftward by it)
    left = Math.max(extra, load && !exact && load.f > 0 ? load.reach : 0),
    right = Math.max(extra, load && !exact && load.f < 0 ? load.reach : 0);
  const out = [];
  for (const b of list || []) {
    if (!b) continue;
    const own = ownBox(b, at);
    if (!keepOwn && own) continue;
    out.push(left || right ? { ...b, x0: b.x0 - left, x1: b.x1 + right } : b);
    // the load's floor: the feet may not stand where it would touch this box (the pushed crate under a table's edge,
    // pickup.js keepCrateClear, which takes back any step that puts it there: before 2026-11-27 the way round was
    // worked out for his feet alone and walked him under the hall's table, where every step but one was taken back)
    if (exact && !own)
      out.push({
        x0: load.f > 0 ? b.x0 - load.far : b.x0 + load.near,
        x1: load.f > 0 ? b.x1 - load.near : b.x1 + load.far,
        y0: b.y0 - load.down,
        y1: b.y1 + load.up,
        load: true,
      });
  }
  return out;
}
/** True when feet at (x, y) are inside one of `solids`. */
export function blockedAt(solids, x, y) {
  return solids.some((b) => inBox(b, x, y));
}
/** The first solid the straight walk from a to b enters (checked every 2 px), or null. */
export function firstHit(solids, a, b) {
  const n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 2));
  const startIn = solids.filter((q) => inBox(q, a.x, a.y));
  for (let i = 1; i <= n; i++) {
    const x = a.x + ((b.x - a.x) * i) / n,
      y = a.y + ((b.y - a.y) * i) / n;
    // (a walker already standing in a box may walk out of it: only boxes he was not in count)
    const q = solids.find((s) => !startIn.includes(s) && inBox(s, x, y));
    if (q) return q;
  }
  return null;
}
/** The free floor nearest (x, y) inside `bounds`, searched in rings 6 px apart, or (x, y) itself when it is free. */
export function freeNear(solids, bounds, x, y) {
  if (!blockedAt(solids, x, y)) return { x, y };
  for (let r = 6; r < 400; r += 6)
    for (let k = 0; k < 24; k++) {
      const a = (k / 24) * Math.PI * 2,
        p = { x: x + Math.cos(a) * r, y: y + Math.sin(a) * r };
      if (bounds && (p.x < bounds.x0 || p.x > bounds.x1 || p.y < bounds.y0 || p.y > bounds.y1)) continue;
      if (!blockedAt(solids, p.x, p.y)) return p;
    }
  return { x, y };
}

// ---------- the record ----------
const log = [];
const seen = new Set();
/** Writes down a move that went through a solid (once per mover, room and solid). */
function note(kind, who, room, at, solid) {
  const key = kind + "|" + who + "|" + room + "|" + (solid ? [solid.id || "", solid.x0, solid.y0].join(",") : "");
  if (seen.has(key)) return;
  seen.add(key);
  const step = engine && engine.get ? engine.get("ch1Step") || "" : "";
  log.push({ kind, who, room, x: Math.round(at.x), y: Math.round(at.y), solid: solid ? { id: solid.id || "", x0: solid.x0, x1: solid.x1, y0: solid.y0, y1: solid.y1 } : null, step });
}
/** Tests: every move that went through a solid since the last clear. */
export function physicsLog() {
  return log.slice();
}
export function clearPhysicsLog() {
  log.length = 0;
  seen.clear();
}

// ---------- walking round ----------
const paths = new Map();
/**
 * The next corner for `who` (a key: "sq", "mops", a robot's id) at feet `at` walking to (x, y) in `room` among
 * `solids` (already the walker's own: moverSolids) inside `bounds`, or null to walk straight there. Straight when
 * the line is clear. A place outside the floor (a walk off through a doorway) is walked to round the solids as far
 * as the floor's edge, then straight. A place inside a solid is walked to round the others; the last stretch in is
 * written down (it is the place's fault, and the walk must still arrive).
 */
export function waypointAmong(who, at, x, y, room, solids, bounds) {
  if (!solids.length || !bounds) return null;
  const off = (p, m = 2) => p.x < bounds.x0 - m || p.x > bounds.x1 + m || p.y < bounds.y0 - m || p.y > bounds.y1 + m;
  // somebody off the picture, or out past its edge (in a doorway), walks as before
  if (off(at, 30)) return null;
  const to = { x: Math.max(bounds.x0, Math.min(bounds.x1, x)), y: Math.max(bounds.y0, Math.min(bounds.y1, y)) };
  // standing inside a thing (a robot parked on the scanner's walkway) and going somewhere outside it: out of it the
  // shortest way first
  const inside = solids.filter((q) => inBox(q, at.x, at.y));
  if (inside.length && !inside.some((q) => inBox(q, to.x, to.y))) {
    const out = freeNear(solids, bounds, at.x, at.y);
    if (out.x !== at.x || out.y !== at.y) return (paths.delete(who), out);
  }
  if (!firstHit(solids, at, to)) return (paths.delete(who), null);
  let p = paths.get(who);
  if (!p || p.room !== room || Math.hypot(p.to.x - to.x, p.to.y - to.y) > 12) {
    const way = findPath(at, to, bounds, solids);
    p = { room, to, way: way ? way.slice() : null };
    paths.set(who, p);
  }
  if (!p.way) return (note("no way round", who, room, at, firstHit(solids, at, to)), null);
  while (p.way.length && Math.hypot(p.way[0].x - at.x, p.way[0].y - at.y) < 2.5) p.way.shift();
  if (!p.way.length) {
    // at the end of the way round: the place itself is in a solid (or past the floor's edge)
    const hit = firstHit(solids, at, to);
    hit && !off({ x, y }) && note("place in a solid", who, room, { x, y }, hit);
    return null;
  }
  // (a way worked out before, from somewhere else, that now crosses a solid: worked out again from here)
  if (firstHit(solids, at, p.way[0])) {
    const way = findPath(at, to, bounds, solids);
    p.way = way ? way.slice() : [];
    if (!p.way.length) return (note("no way round", who, room, at, firstHit(solids, at, to)), null);
  }
  return p.way[0];
}
/** Forget a walker's way (a jump, a new room). */
export function forgetWay(who) {
  paths.delete(who);
}

/**
 * The engine's scripted step for Squatch or Mops (15-ch1-scene1.js step): the next corner toward (x, y), or null to
 * walk straight there. Uses the room's own solids (the engine's roomSolids: the older program's ih(), with the beat
 * that owns the room) and its walls (roomBounds).
 */
export function roomWaypoint(who, at, x, y) {
  if (!engine || !engine.roomSolids || !engine.roomBounds) return null;
  const room = engine.room();
  if (who === "sq" && engine.get && engine.get("sqPose") !== "stand") return null;
  if (who === "mops" && engine.get && ["hidden", "sleep"].includes(engine.get("moPose"))) return null;
  return waypointAmong(who, at, x, y, room, moverSolids(who, at, engine.roomSolids(), room), engine.roomBounds());
}
/** The room's solids for a walker's own walk (00-core.js walkSolids): grown by how much wider than a feet box he is. */
export function walkerSolids(who, at, list) {
  const room = engine ? engine.room() : "";
  // (every box kept, as the walk always had them: walking up to someone at his own x puts the feet where his own box's
  // middle would be, so "his own box" cannot be told from somebody else's there)
  return moverSolids(who, at, list, room, true);
}
/** The free floor nearest (x, y) for `who` in the room now (a follower's spot that fell on the counter, say). */
export function freeSpot(who, x, y) {
  if (!engine || !engine.roomSolids) return { x, y };
  const room = engine.room(),
    at = engine.pos(who === "mops" ? "mops" : "sq");
  return freeNear(moverSolids(who, at, engine.roomSolids(), room), engine.roomBounds(), x, y);
}

/**
 * A follower's next trail point (escape-doors.js followStep), moved onto free floor for Mops: the leader's feet can pass
 * closer to a thing than Mops's wider body can (the hall's snack bar end by the hallway doorway, 2026-11-27).
 */
export function freeFollow(to) {
  return to ? freeSpot("mops", to.x, to.y) : to;
}

/**
 * One step of a thing a module moves itself (a robot, a guard, the alarm's runner) toward (x, y) at `speed`, round
 * `solids` inside `bounds`: `step(obj, x, y, speed, dt)` is the module's own straight step (returns true when there).
 * True once at (x, y).
 */
export function stepRound(id, obj, x, y, speed, dt, room, solids, bounds, step) {
  const w = waypointAmong(id, obj, x, y, room, solids || [], bounds);
  if (!w) return step(obj, x, y, speed, dt);
  step(obj, w.x, w.y, speed, dt);
  return false;
}

/**
 * The furniture a module's own mover (a robot) keeps out of in `room` now: the room's solids as the engine has them
 * (the older program's ih() with the beat that owns the room), without anyone's feet box (robots never walked round
 * people, and two robots' routes that cross would bend), and without what `keep(box)` says no to (a robot that rides
 * the scanner's walkway on purpose leaves the walkway out). Empty when `room` is not the room on screen.
 */
export function robotSolids(room, keep) {
  if (!engine || !engine.roomSolids || engine.room() !== room) return [];
  return engine.roomSolids().filter((b) => b && !b.person && (!keep || keep(b)));
}
/**
 * One step of a module's own mover (pickup day's robots, the bay's robots and Isfred, the escape's night robot, the
 * evening's hallway robot) toward (x, y): `step(obj, x, y, speed, dt)` is the module's own straight step. Straight
 * where the line is clear (every route that was clear rolls exactly as before), round the room's furniture where it is
 * not. A mover in a room not on screen rolls straight (nobody sees it). True once at (x, y).
 */
export function robotStep(id, obj, x, y, speed, dt, room, step, keep) {
  const solids = robotSolids(room, keep);
  if (!solids.length) return step(obj, x, y, speed, dt);
  return stepRound(id, obj, x, y, speed, dt, room, solids, engine.roomBounds(), step);
}
const robotList = [];
/**
 * A module tells the model about its robots for the check of everyone this frame: fn() returns
 * [{ who, room, x, y, keep? }], checked against robotSolids(room, keep).
 */
export function addRobots(fn) {
  robotList.push(fn);
}

/** A box (a pushed crate's floor) may stand there: inside `bounds`, touching none of `solids`. */
export function boxFits(box, solids, bounds) {
  if (bounds && (box.x0 < bounds.x0 - 40 || box.x1 > bounds.x1 + 60 || box.y1 > bounds.y1 + 30)) return false;
  return !solids.some((b) => box.x0 < b.x1 && box.x1 > b.x0 && box.y0 < b.y1 && box.y1 > b.y0);
}
/** The solid a box touches, or null. */
export function boxHit(box, solids) {
  return solids.find((b) => box.x0 < b.x1 && box.x1 > b.x0 && box.y0 < b.y1 && box.y1 > b.y0) || null;
}

// ---------- depth: the baselines of a locked picture's things ----------
/**
 * The home room's things people stand behind, in the locked home pictures (v6), in game positions: the piece of the
 * picture painted again over whoever is behind it (`x, y, w, h`), and its floor line (`back`): feet above that line
 * are behind it. (These were the older program's HOME_FRONT, which painted a piece over everyone whenever Squatch
 * alone stood behind it.)
 */
export const HOME_BASELINES = Object.freeze({
  bucket: Object.freeze({ x: 530, y: 506, w: 72, h: 66, back: 566 }),
  bed: Object.freeze({ x: 92, y: 396, w: 188, h: 132, back: 526 }),
  gbox: Object.freeze({ x: 188, y: 356, w: 48, h: 40, back: 390 }),
});
/**
 * The vent room's desk (the locked vent-room-empty-v1 picture, in game positions): its top to the feet of its legs,
 * and its floor line at the feet of its front legs. Mops's walk along the back wall (y 400 to 470) is behind that line,
 * so the desk is in front of him: before 2026-11-27 he was drawn over it, standing on it (Brian's video notes, beat 48).
 */
export const VENT_BASELINES = Object.freeze({
  desk: Object.freeze({ x: 552, y: 424, w: 378, h: 182, back: 598 }),
});
/**
 * The same rule for a room whose things are painted once over everyone: the things in `baselines` that someone in
 * `people` ({ who, x, y, half }) stands behind (feet above the thing's floor line, overlapping it): [{ id, p, over }].
 */
export function thingsInFrontOf(baselines, people) {
  const out = [];
  for (const [id, p] of Object.entries(baselines)) {
    const behind = people.filter((q) => q.y < p.back && q.x + q.half > p.x && q.x - q.half < p.x + p.w);
    behind.length && out.push({ id, p, over: behind.map((q) => q.who) });
  }
  return out;
}
let depthNow = [];
/**
 * The depth items for the home room's things (for the people's back-to-front list): each is drawn at its floor line,
 * by `paint(id)`, but only when someone drawn before it (behind it) overlaps it; `people` are { who, x, y, half }.
 * `skip(id)` leaves a thing out (gone, or not out yet).
 */
export function homeDepthItems(people, paint, skip) {
  const out = [];
  depthNow = [];
  for (const [id, p] of Object.entries(HOME_BASELINES)) {
    if (skip && skip(id)) continue;
    out.push({
      // (just before anyone standing on the line itself: feet pushed out of the bed stop exactly on it, in front)
      y: p.back - 0.01,
      d: () => {
        const behind = people.filter((q) => q.y < p.back && q.x + q.half > p.x && q.x - q.half < p.x + p.w);
        if (!behind.length) return;
        paint(id, p);
        depthNow.push({ id, over: behind.map((q) => q.who), front: people.filter((q) => q.y >= p.back).map((q) => q.who) });
      },
    });
  }
  return out;
}
/** Tests: which home things were painted over whom this frame (and who stood in front of them). */
export function homeDepthDrawn() {
  return depthNow.slice();
}

// ---------- the check of everyone this frame ----------
const movers = [];
/** A module tells the model about things it moves itself: fn() returns [{ who, room, x, y, solids? }]. */
export function addMovers(fn) {
  movers.push(fn);
}
/**
 * Where everyone stands this frame, checked against the room: [{ who, room, x, y, solid }] for each one whose feet
 * are in a solid (Squatch standing, Mops standing or walking, and the things modules move: the pushed crate).
 */
export function physicsNow() {
  if (!engine || !engine.roomSolids) return [];
  const room = engine.room(),
    list = engine.roomSolids(),
    bounds = engine.roomBounds(),
    out = [];
  const on = (p) => bounds && p.x > bounds.x0 - 30 && p.x < bounds.x1 + 30 && p.y > bounds.y0 - 30 && p.y < bounds.y1 + 30;
  const check = (who, p) => {
    if (!on(p)) return;
    // (the walker's own list, not grown: his feet; the body's width is the walk's business)
    const q = list.find((b) => b && !ownBox(b, p) && inBox(b, p.x, p.y));
    q && out.push({ who, room, x: Math.round(p.x), y: Math.round(p.y), solid: { id: q.id || "", x0: q.x0, x1: q.x1, y0: q.y0, y1: q.y1 } });
  };
  engine.get("sqPose") === "stand" && check("sq", engine.pos("sq"));
  !["hidden", "sleep"].includes(engine.get("moPose")) && check("mops", engine.pos("mops"));
  for (const fn of movers)
    for (const m of fn() || [])
      if (m && m.room === room) {
        const q = (m.solids || list).find((b) => (m.box ? m.box.x0 < b.x1 && m.box.x1 > b.x0 && m.box.y0 < b.y1 && m.box.y1 > b.y0 : inBox(b, m.x, m.y)));
        q && out.push({ who: m.who, room, x: Math.round(m.x), y: Math.round(m.y), solid: { id: q.id || "", x0: q.x0, x1: q.x1, y0: q.y0, y1: q.y1 } });
      }
  // the modules' robots, against the furniture they keep out of (robotSolids): only on the floor, not out past its edge
  for (const fn of robotList)
    for (const m of fn() || [])
      if (m && m.room === room && on(m)) {
        const q = robotSolids(room, m.keep).find((b) => inBox(b, m.x, m.y));
        q && out.push({ who: m.who, room, x: Math.round(m.x), y: Math.round(m.y), solid: { id: q.id || "", x0: q.x0, x1: q.x1, y0: q.y0, y1: q.y1 } });
      }
  return out;
}

// ---------- people's boxes, for things drawn over the room (the one highlight) ----------
/**
 * The box a person's drawing takes up, feet at (x, y), drawn at scale `k` (the scale his own drawing is drawn at, as
 * 12-ch1-redesign.js sqBox and moBox count it, with his horns and ears). A highlight leaves these out (Brian r5 13:40:
 * "the yellow dashes went over Mops").
 */
export function personBox(who, x, y, k) {
  return who === "mops" ? { x0: x - 27 * k, x1: x + 27 * k, y0: y - 62 * k, y1: y + 4 } : { x0: x - 21 * k, x1: x + 21 * k, y0: y - 54 * k, y1: y + 4 };
}

// ---------- after a walker's own step ----------
const keepers = [];
/**
 * A module that moves something with a walker (the crate Mops pushes) checks it right after his step, in the same
 * frame, before anything is drawn: fn(who) may put him back (pickup.js keepCrateClear).
 */
export function addKeeper(fn) {
  keepers.push(fn);
}
/** The older program calls this at every walker's own step (00-core.js R0). */
export function afterMove(who) {
  for (const k of keepers) k(who);
}

/** How wide `who` is drawn in `room`, each side of his feet (personBox's width at the room's drawing scale). */
export function drawnHalf(who, room) {
  const k = room === "closet" ? 3 : (adultPxFor(room) * 0.8) / 45;
  return who === "mops" ? 27 * k * (room === "closet" ? 1 : 1.15) : 21 * k;
}
/**
 * How far behind Squatch Mops walks when he follows him along a row (escape-doors.js followStep, a doorway's arrival):
 * at least `min`, and far enough that their drawings do not cover each other side by side (most of both bodies:
 * horns and beard tips may touch). Depth by the feet orders two people in a column; side by side on one line it cannot,
 * so the follower keeps this gap (before 2026-11-27 a fixed 60, in every room: at home, drawn three times bigger, Mops
 * walked inside Squatch on the way home at night, beat 52).
 */
/**
 * Where a follower comes in behind a walker who has just come through a doorway into `room` at `at`, facing `f`: the
 * room's follow gap behind him, but on the floor (bounds), so a wide gap does not start him off the picture.
 */
export function followSpot(room, at, f) {
  const b = engine && engine.roomBounds ? engine.roomBounds() : null,
    x = at.x - f * followGap(room),
    p = { x: b ? Math.max(b.x0, Math.min(b.x1, x)) : x, y: at.y };
  // (and on free floor: in the party hall the floor's edge by the hallway doorway is the snack bar's end)
  return b && engine.roomSolids ? freeNear(moverSolids("mops", p, engine.roomSolids(), room), b, p.x, p.y) : p;
}
export function followGap(room, min = 60) {
  return Math.max(min, Math.round(0.9 * (drawnHalf("sq", room) + drawnHalf("mops", room))));
}

/**
 * The boxes of Squatch and Mops as the room on screen draws them (home draws its people at three times their scale;
 * elsewhere the room rule: room-sizes.js), for a highlight to leave out. Empty before the engine is there, and in the
 * vent's room, whose drawing passes its own.
 */
export function peopleBoxesNow() {
  if (!engine) return [];
  const room = engine.room(),
    out = [];
  if (room === "duct") return out;
  const k = room === "closet" ? 3 : (adultPxFor(room) * 0.8) / 45,
    s = engine.pos("sq"),
    m = engine.pos("mops");
  engine.get("sqPose") === "stand" && out.push(personBox("sq", s.x, s.y, k));
  !["hidden", "sleep"].includes(engine.get("moPose")) && out.push(personBox("mops", m.x, m.y, room === "closet" ? 3 : k * 1.15));
  return out;
}
