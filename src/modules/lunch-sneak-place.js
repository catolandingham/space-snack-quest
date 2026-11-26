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
  crate: Object.freeze({ id: "crate", stand: Object.freeze({ x: 600, y: 478 }), eyes: Object.freeze({ x: 646, y: 408 }), box: Object.freeze({ x0: 616, x1: 700, y0: 404, y1: 478 }) }),
  // The hallway doorway in the right wall's back corner: SNEAK · hallway in its strip of floor.
  door: Object.freeze({ id: "door", stand: Object.freeze({ x: 905, y: 320 }), r: 46, box: Object.freeze({ x0: 880, x1: 946, y0: 258, y1: 348 }) }),
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
 * by the counter's end, where the plate of Moon Pies (PLACEHOLDER) sits.
 */
export const AISLE = Object.freeze({ x0: 862, x1: 924, y0: 352, y1: 548 });
export const COUNTER_SPOTS = Object.freeze({
  mops: Object.freeze({ x: 893, y: 396 }),
  sq: Object.freeze({ x: 893, y: 506 }),
  // the plate on the counter's end, right of and below the Moon Pie painted on the counter
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
  k: 1.65,
  dst: Object.freeze({ x0: 24, y0: 34 }),
  grow: 0.4,
  steps: Object.freeze(["one", "snack", "grab", "chew"]),
});

// ---------- beat 26: the hallway ----------
export const HALLWAY_SPOTS = Object.freeze({
  in: Object.freeze({ x: 10, y: 330 }),
  stop: Object.freeze({ x: 210, y: 470 }),
  mops: Object.freeze({ x: 660, y: 480 }),
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
  noticeStop: 0.5,
  lookBoth: 1.2,
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
