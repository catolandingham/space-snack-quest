/**
 * Where everything is in the lunch sneak (Chapter 1, beats 25 to 27; lunch-sneak.js), and the watchers' rhythm. Game
 * positions (960 x 640) on the locked hall picture v2 and the locked hallway picture v6. Every number here is a
 * PLACEHOLDER for Brian, chosen so tests/lunch-sneak.mjs passes its fairness rules (the safe places are never in a
 * cone; leaving a hiding place while its watcher looks away, before his "?" shows, gets him to the next place
 * unseen; going while he looks is seen). Nothing else types these numbers.
 */
import { HALL, SPOTS } from "./party-hall.js";

// The middle plant (locked picture): where he steps into it, and where his eyes show in its leaves.
const PLANT = HALL.plants.find((p) => p.id === "middle");

/** The hiding places and the doorway, in the order he meets them. `stand`: where he stands to use it (his feet). */
export const LUNCH_PLACES = Object.freeze({
  // He comes up through his home doorway (from below the picture) and stops here: the start of the sneak.
  start: Object.freeze({ x: SPOTS.doorway.x, y: SPOTS.doorway.y, from: Object.freeze({ x: SPOTS.doorway.x, y: 640 }) }),
  plant: Object.freeze({ id: "plant", stand: SPOTS.plantMiddle, eyes: PLANT.eyes, thing: PLANT.leaves }),
  // A stack of two crates (PLACEHOLDER drawing, lunch-sneak-art.js), on open floor halfway to the bar.
  // His eyes peek from the middle of the crates' front, at the seam just under the small crate (docs/STYLE-GUIDE.md,
  // peek-eyes; Brian 2026-11-26, lunch note 0:13: "more centrally placed so they're visible like they are in the plant",
  // the same eyes as the plant's). The seam is at 44% of the stack (drawCrates).
  crate: Object.freeze({ id: "crate", stand: Object.freeze({ x: 600, y: 478 }), eyes: Object.freeze({ x: 658, y: 443 }), box: Object.freeze({ x0: 616, x1: 700, y0: 404, y1: 478 }) }),
  // The hallway doorway in the right wall's back corner. It is walk-through (Brian 2026-11-26, #47: "walk through any
  // open doorway"): his feet inside the opening's floor (`opening`, never just near it) take him through. `stand`: the
  // end of the way to it (DOOR_WAY), in the strip of floor before it; `walkTo`: where a test or the robot stands him
  // to go through.
  door: Object.freeze({ id: "door", stand: Object.freeze({ x: 905, y: 320 }), r: 46, box: Object.freeze({ x0: 880, x1: 946, y0: 258, y1: 348 }), opening: Object.freeze({ x0: 914, x1: 960, y0: 286, y1: 346 }), walkTo: Object.freeze({ x: 930, y: 318 }) }),
});
// The way from the crates to the doorway goes up first (clear of the bar stools), then along the strip.
export const DOOR_WAY = Object.freeze([Object.freeze({ x: 740, y: 336 }), LUNCH_PLACES.door.stand]);

/**
 * The watchers (approved guest pictures, guests.js ids): each looks one way (`away`) and then another (`look`, across
 * the stretch he guards), on one rhythm, the same every play: away, then "?" over his head while still away (the
 * warning, as the party's glancer gives it), a turn, the look, a turn back. Angles in radians (0 is right, down is
 * positive). `at`: seconds into his rhythm when the beat starts. W3 stands at the counter only in beat 27.
 */
export const RHYTHM = Object.freeze({ away: 3.0, warn: 0.6, turn: 0.3, look: 2.4 });
export const WATCHERS = Object.freeze([
  // (2026-11-26, round C: moved and turned once sight saw Squatch's whole drawn body, party-watch.js, so the rules in
  // tests/lunch-sneak.mjs still hold; found by trying every place and angle on a grid against those rules)
  // in front of the stage, left of its middle: away = up at the stage; look = down and right, across the way from the
  // plant to the crates
  Object.freeze({ id: "teal", x: 380, y: 355, away: -2.2, look: 0.64, at: 3.6, guards: "plant-crate" }),
  // a step down and right of her: away = up at the stage; look = right and a little up, along the way from the crates
  // up to the doorway
  Object.freeze({ id: "camera", x: 480, y: 400, away: -2.2, look: -0.32, at: 0.6, guards: "crate-door" }),
]);
// (its clock starts as they come into the hall: it is looking at the counter as Squatch ducks, and turns away as Mops's
// picture bubble ends, so TAKE · snack first comes up as he looks away)
export const COUNTER_WATCHER = Object.freeze({ id: "robot", x: 742, y: 500, away: Math.PI, look: 0.02, at: 3.2, guards: "snack" });
/**
 * Beat 28's walk out (Brian 2026-11-27, finish plan: "one lunch guest's cone sweeps toward the doorway now and then, so
 * standing up at the wrong moment can get him caught"; r5 0:20): while Squatch waits behind the counter to walk out, the
 * counter's watcher keeps its rhythm but its look turns up and right, over the top of the counter's aisle and the way
 * to the hallway doorway. Its "?" warns a turn as always. Ducked in the aisle he stays hidden. PLACEHOLDER angle.
 */
export const COUNTER_WATCHER_WALKOUT = Object.freeze({ ...COUNTER_WATCHER, look: -0.78 });

/**
 * Guests milling around (Brian 2026-11-26, lunch note 0:38: "maybe one or two more folks milling around"): each walks
 * slowly from `a` to `b` and back, looking where he walks, and turns round at each end over `turn` seconds, his look
 * sweeping by `sweep` (+1 clockwise on the picture, -1 the other way) at `b` and back the same way at `a`, so at both
 * ends it passes over the hall's left wall, never over Squatch's way. Their cones are as everyone's. Placed by trying every place and length on a grid against the rules
 * in tests/lunch-sneak.mjs: their cones never reach his way (his doorway, the plant, the crates, the hallway doorway
 * and the counter, and the walks between), so the watchers' rhythm stays the whole timing; they are there for life
 * in the hall and for a kid who wanders off the way. Only the left part of the hall leaves room for that (the grid
 * found none elsewhere). PLACEHOLDERS. `v`: game pixels a second; `at`: seconds into the walk as the lunch starts (their clock stops during an alarm).
 */
export const WANDERERS = Object.freeze([
  Object.freeze({ id: "backpack", a: Object.freeze({ x: 240, y: 360 }), b: Object.freeze({ x: 240, y: 575 }), v: 30, turn: 1.4, sweep: 1, at: 2, wander: true }),
  Object.freeze({ id: "stilt", a: Object.freeze({ x: 112, y: 410 }), b: Object.freeze({ x: 112, y: 578 }), v: 24, turn: 1.4, sweep: 1, at: 5, wander: true }),
]);
/** How long one wanderer's walk there and back takes (seconds). */
export function wanderLength(w) {
  return (2 * Math.hypot(w.b.x - w.a.x, w.b.y - w.a.y)) / w.v + 2 * w.turn;
}
/** Where wanderer `w` is at beat time `t`: { x, y, a (where he looks, radians), walking (true while he walks) }. */
export function wandererNow(w, t) {
  const dx = w.b.x - w.a.x,
    dy = w.b.y - w.a.y,
    T = Math.hypot(dx, dy) / w.v,
    L = wanderLength(w),
    s = (((t + (w.at || 0)) % L) + L) % L,
    h = Math.atan2(dy, dx),
    ease = (k) => k * k * (3 - 2 * k);
  if (s < T) return { x: w.a.x + (dx * s) / T, y: w.a.y + (dy * s) / T, a: h, walking: true };
  if (s < T + w.turn) return { x: w.b.x, y: w.b.y, a: h + w.sweep * Math.PI * ease((s - T) / w.turn), walking: false };
  if (s < 2 * T + w.turn) {
    const u = (s - T - w.turn) / T;
    return { x: w.b.x - dx * u, y: w.b.y - dy * u, a: h + w.sweep * Math.PI, walking: true };
  }
  return { x: w.a.x, y: w.a.y, a: h + w.sweep * Math.PI * (1 - ease((s - 2 * T - w.turn) / w.turn)), walking: false };
}

/** One rhythm's length (seconds). */
export const RHYTHM_LENGTH = RHYTHM.away + RHYTHM.warn + RHYTHM.turn + RHYTHM.look + RHYTHM.turn;
/**
 * Where watcher `w` is in his rhythm at beat time `t`: { phase ("away", "warn", "turn", "look", "back"), k (0 to 1
 * through that phase), a (where he looks, radians) }.
 */
export function watcherNow(w, t) {
  const R = RHYTHM,
    L = RHYTHM_LENGTH,
    s = (((t + (w.at || 0)) % L) + L) % L;
  const turn = (from, to, k) => {
    let d = to - from;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    const e = k * k * (3 - 2 * k);
    return from + d * e;
  };
  if (s < R.away) return { phase: "away", k: s / R.away, a: w.away };
  if (s < R.away + R.warn) return { phase: "warn", k: (s - R.away) / R.warn, a: w.away };
  if (s < R.away + R.warn + R.turn) {
    const k = (s - R.away - R.warn) / R.turn;
    return { phase: "turn", k, a: turn(w.away, w.look, k) };
  }
  if (s < R.away + R.warn + R.turn + R.look) return { phase: "look", k: (s - R.away - R.warn - R.turn) / R.look, a: w.look };
  const k = (s - R.away - R.warn - R.turn - R.look) / R.turn;
  return { phase: "back", k, a: turn(w.look, w.away, k) };
}

// ---------- beat 27: behind the snack counter ----------
/**
 * The service aisle between the counter and the right wall (hall v2: the counter's top 1085 to 1145 picture pixels
 * wide, the aisle 1145 to 1235, closed at the bottom by the counter's end). Mops waits at its top, Squatch below him
 * by the counter's end, where the plate of snack cakes (PLACEHOLDER) sits.
 */
export const AISLE = Object.freeze({ x0: 862, x1: 924, y0: 352, y1: 548 });
export const COUNTER_SPOTS = Object.freeze({
  mops: Object.freeze({ x: 893, y: 396 }),
  sq: Object.freeze({ x: 893, y: 506 }),
  // the plate on the counter's end, right of and below the snack cake painted on the counter
  plate: Object.freeze({ x: 884, y: 572 }),
  // walking in from the hallway doorway, down the aisle
  in: Object.freeze({ x: 952, y: 312 }),
  top: Object.freeze({ x: 893, y: 336 }),
});

/**
 * The snack counter close-up (Brian 2026-11-26: "the plate of pies and the ducked Squatch are too small" on a phone):
 * from Mops's line to the chew, the counter's corner of the hall (`src`: the counter guest, Mops, the aisle, Squatch
 * ducked and the plate) is shown again `k` times bigger in a framed close-up on the left of the picture (`dst`, which
 * covers only the hall's left part: nothing there matters at the counter). It grows out of its corner over `grow`
 * seconds, so a kid sees where it is. PLACEHOLDER framing and look.
 */
export const COUNTER_CLOSEUP = Object.freeze({
  src: Object.freeze({ x0: 716, y0: 262, x1: 956, y1: 616 }),
  k: 1.7, // (1.65 until 2026-11-26: a little bigger so his ball, smaller than the old squashed Squatch, is 28 px on a phone)
  dst: Object.freeze({ x0: 24, y0: 34 }),
  grow: 0.4,
  steps: Object.freeze(["one", "snack", "grab", "chew"]),
});

// ---------- beat 26: the hallway ----------
export const HALLWAY_SPOTS = Object.freeze({
  in: Object.freeze({ x: 10, y: 330 }),
  stop: Object.freeze({ x: 210, y: 470 }),
  mops: Object.freeze({ x: 660, y: 480 }),
  // Mops mops his way from here to `mops` (facing away from where Squatch comes in), his beard leaving wet streaks
  // behind him (he has mopped from `wetFrom`); his mop bucket stands beside him (`bucket`: its middle and the floor under its wheels; `k` its size,
  // the home room's bucket made as much bigger as people are in the hallway). PLACEHOLDERS.
  mopFrom: Object.freeze({ x: 590, y: 480 }),
  wetFrom: 500, // he has mopped from here (his feet) along to mopFrom before Squatch comes in (past the front door)
  bucket: Object.freeze({ cx: 800, floor: 492, k: 0.46 }),
  give: Object.freeze({ x: 540, y: 488, r: 70 }),
  // the left opening back to the hall, where Mops waits after lunch, and where the kid walks Squatch
  back: Object.freeze({ x: 50, y: 345, r: 45 }),
  mopsBack: Object.freeze({ x: 130, y: 292 }),
});

/** Feet cannot go here in the hall during the lunch (the party's list, with the strip to the hallway doorway open). */
export const LUNCH_SOLIDS = Object.freeze([
  Object.freeze({ x0: 240, x1: 490, y0: 0, y1: 304 }), // the stage
  Object.freeze({ x0: 806, x1: 862, y0: 350, y1: 606 }), // the counter
  Object.freeze({ x0: 806, x1: 960, y0: 548, y1: 606 }), // the counter's end
  Object.freeze({ x0: 924, x1: 960, y0: 350, y1: 606 }), // the wall past the aisle
  Object.freeze({ x0: 772, x1: 800, y0: 380, y1: 400 }), // the stools
  Object.freeze({ x0: 772, x1: 800, y0: 438, y1: 458 }),
  Object.freeze({ x0: 412, x1: 476, y0: 520, y1: 552 }), // the middle plant's pot
  Object.freeze({ x0: 72, x1: 136, y0: 330, y1: 372 }), // the back plant's pot
  Object.freeze({ x0: 616, x1: 700, y0: 446, y1: 474 }), // the crates' bottom
]);
export const LUNCH_BOUNDS = Object.freeze({ x0: 60, x1: 944, y0: HALL.floorTop, y1: 590 });

/** Timing (seconds) and speeds (game pixels a second). PLACEHOLDERS. */
export const LUNCH_PACE = Object.freeze({
  walk: 190, // Squatch in the hall (as at the party)
  walkIn: 1.0,
  mopsOut: 1.4, // Mops mops his way out through the hallway doorway at the start
  hallwayWalk: 150,
  noticeStop: 0.5, // he stops mopping and lifts his head
  // then turns his whole head slowly to look left, then right, his cone sweeping (Brian 2026-11-26, lunch note 0:17.6:
  // "slow it down, have it be way more obvious"), then turns to Squatch and hearts float up (#48: never "?" or "!")
  lookLeft: 1.2,
  lookRight: 1.2,
  toSquatch: 0.6,
  hearts: 1.2,
  mopWalk: 40, // how fast he mops his way along the hallway floor (his streaks stay while the lunch is on)
  give: 0.5,
  heart: 0.9,
  eat: 3.8, // the wordless eating cutaway
  mopsWalk: 170,
  up: 0.3,
  reach: 0.45,
  back: 0.35,
  down: 0.3,
  chew: 1.2,
});
/** Sizes (game pixels; PLACEHOLDERS), read against the hall's grown-up (adultPxFor("hall"), about 93) and Squatch. */
export const LUNCH_SIZES = Object.freeze({ crate: Object.freeze({ w: 84, h: 74 }), pie: 1.25, plate: Object.freeze({ w: 86, h: 20 }) });
