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
  // (a step in from the doorway, clear of the way the robot rolls out through it)
  mops: Object.freeze({ x: 210, y: 300 }),
  // the photo wall (the locked picture's grid, picture 367 to 913 wide, 140 to 279 high): LOOK · photos from below it
  wall: Object.freeze({ x0: 274, x1: 686, y0: 104, y1: 216 }),
  look: Object.freeze({ x: 480, y: 300, r: 70 }),
  // the doorway to the hall (left end) and to the loading bay (right end): walking into one goes through
  left: Object.freeze({ x: 50, y: 330, r: 45 }),
  right: Object.freeze({ x: 910, y: 330, r: 45 }),
  // the robot that rolls through after photo 5 (BEEP BEEP): in through the hall's doorway (the hall end, left: story
  // pass beat 37, "the robot comes in through the doorway at the hall end, on the floor, with a cone"), along the
  // middle of the floor (clear of the office door in the front wall, picture 575 to 705 wide, from 630 down), and out
  // through the loading bay's doorway (right end); it looks where it rolls
  robotIn: Object.freeze({ x: 990, y: 310 }),
  // just inside each doorway (the robot comes and goes straight through it)
  robotDoorR: Object.freeze({ x: 880, y: 310 }),
  robotDoorL: Object.freeze({ x: 80, y: 310 }),
  robotLane: 400,
  robotOut: Object.freeze({ x: -60, y: 310 }),
  officeDoor: Object.freeze({ x0: 431, x1: 529, y0: 486, y1: 609 }),
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
  // the family walks round by the strip, then down the floor left of the stools, to the counter's front
  via: Object.freeze({ x: 728, y: 338 }),
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

// ---------- beats 38a and 38b: the storm at the big window (story pass 2026-11-26) ----------
/**
 * Jupiter's big red storm at the hall's big window. The family (dad, mom, their kid: approved guest pictures, the kid
 * drawn smaller) and one more guest come in through the hallway doorway (top right) and walk to the window, under it
 * below the bench, looking up at it (their cones point at the window, away from the counter). Mops wipes the counter's
 * front with his beard. Behind the counter Squatch is rolled up in the aisle; PEEK · window raises his eyes over the
 * counter's edge (`eyes`, where sight looks for him while he peeks). When the kid is hungry they all turn and walk to
 * the counter's front (`bar`), the guest to the stools. The guest tosses the brochure over the counter into the bin
 * beside him (`bin`).
 */
export const STORM = Object.freeze({
  in: Object.freeze({ x: 990, y: 314 }),
  door: Object.freeze({ x: 940, y: 314 }),
  // where each stands at the window (feet), clear of the bench (the locked picture's, game 248 to 480 by 245 to 293)
  window: Object.freeze({
    dad: Object.freeze({ x: 330, y: 330 }),
    mom: Object.freeze({ x: 392, y: 338 }),
    kid: Object.freeze({ x: 270, y: 344 }),
    guest: Object.freeze({ x: 520, y: 326 }),
  }),
  // at the snack bar: the family at the counter's front, the guest by the stools
  bar: Object.freeze({
    dad: Object.freeze({ x: 730, y: 470 }),
    mom: Object.freeze({ x: 742, y: 566 }),
    kid: Object.freeze({ x: 690, y: 520 }),
    guest: Object.freeze({ x: 740, y: 404 }),
  }),
  // they walk in along the floor's back strip, under the window and the bench, and leave the same way; to the bar they
  // go down the floor between the lunch's crates and the stools
  lane: 320,
  barVia: Object.freeze({ x: 730 }),
  ids: Object.freeze({ dad: "camera", mom: "teal", kid: "octopus-guest", guest: "backpack" }),
  // Mops at the counter's front below the stools (picture's, game x 772 to 800 at y 390 and 447), wiping it
  mops: Object.freeze({ x: 778, y: 510 }),
  // his way to and from it: along the strip above the counter's top end, then down the floor left of the stools
  mopsVia: Object.freeze([Object.freeze({ x: 730, y: 330 }), Object.freeze({ x: 730, y: 510 })]),
  // his eyes over the counter's edge while he peeks
  eyes: Object.freeze({ x: 866, y: 446 }),
  bin: Object.freeze({ x: 896, y: 540 }),
  // GRAB · brochure from where he is rolled up, beside the bin
  grab: Object.freeze({ x: 893, y: 490, r: 70 }),
  // the storm takes this long to fill the window; the family turns this long before they walk to the bar
  stormIn: 4.0,
  turn: 1.6,
  walk: 95,
  // the brochure held up (picture toward the player), then the coffee, then the toss over the counter
  holdUp: 1.6,
  toss: 0.7,
});

// ---------- beats 40 and 41: home ----------
export const HOME = Object.freeze({
  in: Object.freeze({ x: 930, y: 462 }),
  stop: Object.freeze({ x: 470, y: 470 }),
  mopsIn: Object.freeze({ x: 960, y: 462 }),
  mops: Object.freeze({ x: 690, y: 470 }),
  show: Object.freeze({ x: 560, y: 470, r: 80 }),
  // SLEEP · bed at the bed's right end (bedtime-story.js BEDTIME_SPOTS.side)
  bed: Object.freeze({ x: 330, y: 458, r: 60 }),
  // where Mops falls asleep: on his back on the floor, his head resting against the left side of his mop bucket (the
  // locked picture's bucket, 536 to 596 wide, 500 to 571 high); his feet stand where mopsSleepAt says
  sleepHead: Object.freeze({ x: 530, y: 572 }),
  sleepVia: Object.freeze({ x: 500, y: 478 }),
  // out of bed at night, beside it
  up: Object.freeze({ x: 340, y: 470 }),
  door: Object.freeze({ x: 870, y: 440, r: 40 }),
  // Mops's mop bucket on the floor (the room's solid for it, mop-bucket.js): bumping it at night clangs
  bucket: Object.freeze({ x0: 536, x1: 596, y0: 500, y1: 571 }),
});
/** Where Mops stands before he tips over (his feet), so that on his back his head rests at HOME.sleepHead (`k`: his scale at home). */
export function mopsSleepAt(k) {
  return { x: HOME.sleepHead.x - 17 * k, y: HOME.sleepHead.y };
}
/** The floor Mops takes up lying on his back (a solid while he sleeps, so nobody walks through him). */
export function mopsSleepBox(k) {
  const at = mopsSleepAt(k);
  return { x0: Math.round(at.x - 26 * k), x1: 536, y0: at.y - 22, y1: at.y + 8 };
}

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
  gap: Object.freeze({ x: 700, y: 463 }),
  bin: Object.freeze({ x: 212, y: 398, r: 50, box: Object.freeze({ x0: 186, x1: 240, y0: 312, y1: 376 }) }),
  mail: Object.freeze({ x: 862, y: 500, r: 52, box: Object.freeze({ x0: 838, x1: 914, y0: 366, y1: 480 }) }),
  // the big wall vent (picture 1070 to 1200 wide, 238 to 332 high): he hides under it, it pulls the pink sheet in
  vent: Object.freeze({ x0: 802, x1: 900, y0: 183, y1: 256, mouth: Object.freeze({ x: 851, y: 220 }) }),
  underVent: Object.freeze({ x: 850, y: 334 }),
  // the way he runs from the mailbox to the vent: out of the mail room through its opening (never through its fence),
  // up outside it, then along above the fence to under the vent
  run: Object.freeze([Object.freeze({ x: 720, y: 466 }), Object.freeze({ x: 645, y: 463 }), Object.freeze({ x: 645, y: 336 }), Object.freeze({ x: 850, y: 334 })]),
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
/**
 * Walls the older program's furniture list leaves out, in the bay: the mail room's fence along its top (picture 915 to
 * 1230 wide at 470 high; 24 deep so nobody pops through it). Nobody walks through it (Brian, [42 0:26]).
 */
export const BAY_EXTRA = Object.freeze([Object.freeze({ x0: 683, x1: 930, y0: 352, y1: 376 })]);
/**
 * The bay's floor vent (the locked night picture paints its swirl: it is on), and the big wall vent (its swirl shows
 * while it sucks). The floor vent's rule is the party hall's (party-vent.js VENT): too close, fur lifts off him and
 * drifts in; staying, the fur goes in and the robot that watches sounds the alarm.
 */
export const BAY_VENT = Object.freeze({ floor: Object.freeze({ x: 165, y: 540 }), wall: Object.freeze({ x: 851, y: 220 }) });
/**
 * Where each robot parked in the mail room looks while it stands there: both right along the room's bottom wall, so
 * their cones show on the floor and stay clear of the way in to the mailbox (2026-11-26: the left one looked down and
 * left, and its cone reached out past the mail room's wall onto the way in; tests/evening-physics.mjs walks that way).
 */
export function robotLook(id) {
  return 0.2;
}
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

// ---------- beat 39b: home alone (story pass 2026-11-26) ----------
/**
 * Home, late afternoon. His crate bed is the locked picture's crate (picture 112 to 382 by 517 to 706); its faded stamp
 * "_ARS CAKES" (stars-cakes.js) is drawn across its side over the old label. The crayon chart of kinds tried hangs on
 * the wall above the bed. X · chart from below it; HOLD UP · brochure in front of the crate.
 */
export const HOME_ALONE = Object.freeze({
  stamp: Object.freeze({ x: 112, y: 472, h: 20 }),
  chart: Object.freeze({ x: 176, y: 262, w: 104, h: 75 }),
  chartSpot: Object.freeze({ x: 236, y: 440, r: 60 }),
  crateSpot: Object.freeze({ x: 330, y: 458, r: 60 }),
  // the crate's side, where the close-up holds the brochure against it
  crate: Object.freeze({ x0: 96, x1: 275, y0: 437, y1: 524 }),
});

/** Timing in seconds and speeds in game pixels a second. PLACEHOLDERS; every wordless part plays 2 to 4 seconds. */
export const EVENING_PACE = Object.freeze({
  walk: 150, // in the hallway and home
  hallWalk: 190,
  mopsWalk: 160,
  robotRoll: 260, // the hallway robot (BEEP BEEP)
  robotWait: 1.0, // it waits just outside the hall's doorway first: the player's real second to act
  ballIn: 0.35, // he rolls up as it comes
  ballOut: 0.4,
  // the gallery: the crooked photo swings up on its nail like a flap this long (about a second), and back
  lift: 1.0,
  // the line's people leave, the family comes
  leave: 120,
  pictureBubble: 2.8, // the family's wordless picture bubble (pancakes, Mars)
  stare: 1.6, // Mops looks at the brochure a moment too long (39)
  putDown: 0.6,
  evening: 2.4, // the room warms to evening at home
  hold: 1.0, // he holds the brochure up before his first line
  // 39b: the box opens; after the crunch, the silence where a fizz would be; one stroke of the X; he rubs out "ST"
  boxOpen: 0.6,
  silence: 1.4,
  xStroke: 0.35,
  rub: 1.2,
  // 41: each picture of the idea; 42b: the don't-send ending's cutaway; 42c: how near the big wall vent the form flutters
  idea: 1.4,
  cutaway: 3.0,
  flutterNear: 300,
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
  suck: 3.0, // 42c: the vent pulls the pink sheet out of his paws in the crate (a wordless cutaway, about 3 s)
  sleepEnd: 2.6,
  // a robot or a guard reacts only once its drawn cone has been on him this long (a short "?" while it registers;
  // Brian 2026-11-26: never when the cone stops short)
  robotSee: 0.5,
});
/** Night at home: the dim (bedtime-story.js BEDTIME_NIGHT), and the evening's warm light. */
export const EVENING_LOOK = Object.freeze({ warm: "rgba(255,170,90,1)", warmA: 0.14 });
