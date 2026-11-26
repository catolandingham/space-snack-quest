/**
 * Where everything is in the evening of Day 2 (Chapter 1, beats 37 to 42; evening.js), and how long each wordless
 * part takes. Game positions (960 x 640) on the locked pictures: the hallway v6, the party hall v2, home closed v6 and
 * the loading bay at night v2. Every number here is a PLACEHOLDER for Brian, chosen so tests/evening.mjs passes its
 * fairness rules (the night robot's cone, the safe places, the way back after the robots wake). Nothing else types
 * these numbers.
 */
import { HALL } from "./party-hall.js";

// ---------- beat 37: the hallway ----------
export const HALLWAY = Object.freeze({
  // they walk in from the loading bay's end (right) after beat 36
  in: Object.freeze({ x: 950, y: 330 }),
  stop: Object.freeze({ x: 760, y: 430 }),
  // Mops walks on to the hall's end and waits there for him
  mops: Object.freeze({ x: 130, y: 300 }),
  // the photo wall (the locked picture's grid, picture 367 to 913 wide, 140 to 279 high): LOOK · photos from below it
  wall: Object.freeze({ x0: 274, x1: 686, y0: 104, y1: 216 }),
  look: Object.freeze({ x: 480, y: 300, r: 70 }),
  // the doorway to the hall (left end) and to the loading bay (right end): walking into one goes through
  left: Object.freeze({ x: 50, y: 330, r: 45 }),
  right: Object.freeze({ x: 910, y: 330, r: 45 }),
  // the robot that rolls through after photo 5 (BEEP BEEP): in at the right end, out at the left, along the front
  robotIn: Object.freeze({ x: 1000, y: 560 }),
  robotOut: Object.freeze({ x: -60, y: 560 }),
});

// ---------- beat 38: the snack bar (party hall v2) ----------
/**
 * They come in through the hallway doorway (top right). Squatch stops in the strip at the counter's top end, Mops
 * goes behind the counter to the aisle's top. Two people stand in line at the counter's front, facing it; their cones
 * point at the counter, below him. HIDE · counter: he steps down into the aisle behind the counter and rolls up into
 * the L2 ball (DECISIONS R107: he can hide there when nobody else is back there). The family comes in at the hallway
 * doorway reading their brochure, looks up into the room, and walks round to the counter's front.
 */
export const BAR = Object.freeze({
  in: Object.freeze({ x: 952, y: 312 }),
  sq: Object.freeze({ x: 852, y: 326 }),
  // Mops stands on the floor left of the stools, not behind the counter (only Squatch hides back there, R107)
  mops: Object.freeze({ x: 640, y: 342 }),
  aisleTop: Object.freeze({ x: 893, y: 340 }),
  // where HIDE · counter is offered (he stands in the strip by the aisle's top), and where he hides, rolled up
  hide: Object.freeze({ x: 862, y: 330, r: 52 }),
  hidden: Object.freeze({ x: 893, y: 470 }),
  // the aisle behind the counter (lunch-sneak-place.js AISLE): hidden in it, nobody sees him
  aisle: Object.freeze({ x0: 862, x1: 924, y0: 352, y1: 548 }),
  // the two people in line (approved guest pictures), and where they leave
  line: Object.freeze([Object.freeze({ id: "backpack", x: 740, y: 474, a: 0 }), Object.freeze({ id: "stilt", x: 742, y: 540, a: 0 })]),
  out: Object.freeze({ x: 477, y: 660 }),
  // the family: a grown-up with the brochure first, then the other grown-up, then their child (an approved guest
  // picture drawn smaller: PLACEHOLDER, a question for Brian); `door` where each stands reading, `at` at the counter
  family: Object.freeze([
    Object.freeze({ id: "camera", door: Object.freeze({ x: 922, y: 312 }), at: Object.freeze({ x: 744, y: 496 }), kid: false }),
    Object.freeze({ id: "teal", door: Object.freeze({ x: 975, y: 318 }), at: Object.freeze({ x: 746, y: 572 }), kid: false }),
    Object.freeze({ id: "octopus-guest", door: Object.freeze({ x: 1010, y: 322 }), at: Object.freeze({ x: 700, y: 548 }), kid: true }),
  ]),
  // the family walks round by the strip (clear of the stools) to the counter's front
  via: Object.freeze({ x: 760, y: 338 }),
  kidK: 0.62,
  // reading the brochure, they look down at it; then up and across the room, toward him in the strip
  read: Math.PI / 2,
  look: Math.PI - 0.12,
  // the brochure, left on the counter's front ledge (GRAB · brochure from the aisle, or the strip)
  brochure: Object.freeze({ x: 834, y: 452, w: 44, h: 58 }),
  grab: Object.freeze({ x: 893, y: 452, r: 56 }),
  // home: the doorway in the front wall
  home: Object.freeze({ x: 477, y: 600, r: 40 }),
  door: HALL.homeDoor,
});
/** The family's rhythm: seconds reading the brochure in the doorway before they look up. */
export const FAMILY = Object.freeze({ read: 4, walk: 95, lineWalk: 120 });

// ---------- beats 40 and 41: home ----------
export const HOME = Object.freeze({
  in: Object.freeze({ x: 930, y: 462 }),
  stop: Object.freeze({ x: 470, y: 470 }),
  mopsIn: Object.freeze({ x: 960, y: 462 }),
  mops: Object.freeze({ x: 690, y: 470 }),
  show: Object.freeze({ x: 560, y: 470, r: 80 }),
  // SLEEP · bed at the bed's right end (bedtime-story.js BEDTIME_SPOTS.side)
  bed: Object.freeze({ x: 330, y: 458, r: 60 }),
  // where Mops falls asleep: on the open floor below the way from the bed to the door, clear of the bed and bucket
  sleep: Object.freeze({ x: 456, y: 572 }),
  sleepVia: Object.freeze({ x: 500, y: 478 }),
  // out of bed at night, beside it
  up: Object.freeze({ x: 340, y: 470 }),
  door: Object.freeze({ x: 870, y: 440, r: 40 }),
  // Mops lying asleep (game positions round `sleep`): his box, so nobody walks through him
  mopsBox: Object.freeze({ x0: 376, x1: 532, y0: 500, y1: 578 }),
});

// ---------- beat 42: the loading bay at night ----------
/**
 * The night robot (one of the three new robots) stands at the ramp's foot on Brian's rhythm (R64): looks down 2 s,
 * turns 0.3 s (no catch while turning), looks up at the back wall 4 s, turns back. Its cone is the standing cone (210,
 * 0.42); only the cone counts (no "this close" circle; Brian 2026-11-22). The other two robots are parked in the mail
 * room (the old storage corner, R17), switched off, until the mailbox's words wake them.
 */
export const BAY = Object.freeze({
  in: Object.freeze({ x: 40, y: 330 }),
  stop: Object.freeze({ x: 92, y: 330 }),
  door: Object.freeze({ x: 70, y: 330, r: 40 }),
  robot: Object.freeze({ id: "night-robot", x: 480, y: 400 }),
  parked: Object.freeze([Object.freeze({ id: "robot-2", x: 770, y: 575 }), Object.freeze({ id: "robot-3", x: 840, y: 585 })]),
  // after the mailbox wakes them they roll out of the mail room to the ramp's foot and look up the ramp at the ship
  // (the right one stands left of the mail room's wall, so the way from the vent down past that wall stays clear)
  woke: Object.freeze([Object.freeze({ x: 372, y: 470 }), Object.freeze({ x: 540, y: 470 })]),
  // the mail room's opening (between its two wall pieces) the woken robots roll out through
  gap: Object.freeze({ x: 688, y: 463 }),
  bin: Object.freeze({ x: 212, y: 398, r: 50, box: Object.freeze({ x0: 186, x1: 240, y0: 312, y1: 376 }) }),
  mail: Object.freeze({ x: 862, y: 500, r: 52, box: Object.freeze({ x0: 838, x1: 914, y0: 366, y1: 480 }) }),
  // the big wall vent (picture 1070 to 1200 wide, 238 to 332 high): he hides under it, it pulls the pink sheet in
  vent: Object.freeze({ x0: 802, x1: 900, y0: 183, y1: 256, mouth: Object.freeze({ x: 851, y: 220 }) }),
  underVent: Object.freeze({ x: 850, y: 334 }),
  // the way he runs from the mailbox to the vent (out of the mail room's opening, then up)
  run: Object.freeze([Object.freeze({ x: 720, y: 466 }), Object.freeze({ x: 760, y: 340 }), Object.freeze({ x: 850, y: 334 })]),
  // the plant (HIDE · plant during an alarm): where he steps in, where his eyes show (12-ch1-redesign.js CH1_PLANT_EYES)
  plant: Object.freeze({ x: 125, y: 388, r: 46, eyes: Object.freeze({ x: 125, y: 308 }), box: Object.freeze({ x0: 70, x1: 180, y0: 244, y1: 382 }) }),
  // the red FUR alarm on the back wall by the door (picture 90 to 127 wide, 178 to 219 high), where a robot runs
  alarm: Object.freeze({ x0: 68, y0: 137, x1: 95, y1: 169 }),
  alarmRun: Object.freeze({ x: 112, y: 330 }),
  guardIn: Object.freeze({ x: 30, y: 330 }),
});
/** R64: the night robot's look (docs/DECISIONS.md, 2026-11-11). Angles: down is +pi/2, the back wall -pi/2. */
export const NIGHT_LOOK = Object.freeze({ down: 2, turn: 0.3, away: 4, faceDown: Math.PI / 2, faceUp: -Math.PI / 2 });
export const NIGHT_CYCLE = NIGHT_LOOK.down + NIGHT_LOOK.turn + NIGHT_LOOK.away + NIGHT_LOOK.turn;
/** Where the night robot looks at robot time `t`: { a, catch, phase }. */
export function nightLook(t) {
  const L = NIGHT_LOOK,
    u = ((((t || 0) % NIGHT_CYCLE) + NIGHT_CYCLE) % NIGHT_CYCLE),
    mix = (a, b, k) => a + (b - a) * (k * k * (3 - 2 * k));
  if (u < L.down) return { a: L.faceDown, catch: true, phase: "down" };
  if (u < L.down + L.turn) return { a: mix(L.faceDown, L.faceUp, (u - L.down) / L.turn), catch: false, phase: "turn" };
  if (u < L.down + L.turn + L.away) return { a: L.faceUp, catch: true, phase: "up" };
  return { a: mix(L.faceUp, L.faceDown, (u - L.down - L.turn - L.away) / L.turn), catch: false, phase: "back" };
}
/**
 * The loading bay's furniture where feet stand (the same strips as the older program's CH1_FURNITURE.hangar,
 * src/game/00-core.js; tests/evening.mjs checks they are the game's own): for the guards' way round it.
 */
export const BAY_FURNITURE = Object.freeze([
  Object.freeze({ x0: 103, x1: 148, y0: 346, y1: 370 }), // plant
  Object.freeze({ x0: 189, x1: 237, y0: 350, y1: 374 }), // bin
  Object.freeze({ x0: 344, x1: 369, y0: 392, y1: 416 }), // scanner arch, left post
  Object.freeze({ x0: 563, x1: 588, y0: 392, y1: 416 }), // scanner arch, right post
  Object.freeze({ x0: 675, x1: 699, y0: 360, y1: 420 }), // mail room wall, above its opening
  Object.freeze({ x0: 675, x1: 699, y0: 507, y1: 609 }), // mail room wall, below its opening
  Object.freeze({ x0: 848, x1: 908, y0: 452, y1: 476 }), // robot mailbox
]);
/** The loading bay's floor at night (feet). */
export const BAY_BOUNDS = Object.freeze({ x0: 60, x1: 900, y0: 320, y1: 590 });
/** Where the guards look round in the bay when nobody has seen him. */
export const BAY_SEARCH = Object.freeze([
  Object.freeze({ x: 260, y: 470 }),
  Object.freeze({ x: 480, y: 560 }),
  Object.freeze({ x: 640, y: 380 }),
  Object.freeze({ x: 300, y: 340 }),
  Object.freeze({ x: 800, y: 560 }),
  Object.freeze({ x: 160, y: 540 }),
]);

/** Timing in seconds and speeds in game pixels a second. PLACEHOLDERS; every wordless part plays 2 to 4 seconds. */
export const EVENING_PACE = Object.freeze({
  walk: 150, // in the hallway and home
  hallWalk: 190,
  mopsWalk: 160,
  robotRoll: 260, // the hallway robot (BEEP BEEP)
  ballIn: 0.35, // he rolls up as it comes
  ballOut: 0.4,
  // the gallery: the crooked photo lifts this long
  lift: 0.6,
  // the line's people leave, the family comes
  leave: 120,
  pictureBubble: 2.8, // the family's wordless picture bubble (pancakes, Mars)
  putDown: 0.6,
  evening: 2.4, // the room warms to evening at home
  hold: 1.0, // he holds the brochure up before Mops's line
  hop: 0.55,
  lie: 1.2,
  lights: 2.4,
  doze: 2.2,
  tip: 2.0,
  tipFall: 0.35,
  roll: 2.0,
  snore: 2.4,
  snores: 2,
  up: 1.4,
  // the paw order close-up: the zoom, the tear, the close
  zoomIn: 0.5,
  zoomOut: 0.4,
  press: 0.35,
  tear: 1.8,
  // the cutscene after the post
  wake: 1.0,
  rollOut: 150,
  runTo: 260,
  suck: 1.3,
  sleepEnd: 2.6,
  robotSee: 0.1, // a robot shows "!" at once (DECISIONS 2026-11-22: robots "!" at once); 0.1 s so a graze of one frame is not a sighting
});
/** Night at home: the dim (bedtime-story.js BEDTIME_NIGHT), and the evening's warm light. */
export const EVENING_LOOK = Object.freeze({ warm: "rgba(255,170,90,1)", warmA: 0.14 });
