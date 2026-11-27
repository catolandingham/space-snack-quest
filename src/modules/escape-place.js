/**
 * Where things are and how long things take in the escape (Chapter 1, beats 43 to 52). Game positions are the 960 x 640
 * picture, read off the locked room pictures (docs/locked-rooms/: the picture is 1280 x 830, so x * 0.75 and y * 0.771).
 * Every number here is a PLACEHOLDER for Brian to see in play. The office code is office-code.js's (one place for
 * beats 32, 42b and 50), passed on here for the escape's keypad.
 */
import { nightPictureFor } from "./night-look.js";
export { OFFICE_CODE } from "./office-code.js";

// The loading bay pictures the escape draws (the older program's LOCKED_ROOMS names the same files: the locked bay
// pictures v3, the plant moved along the wall; the night one is night-look.js's, the bay's night look).
export const BAY_DAY = "docs/locked-rooms/delivery-room-empty-day-noship-v3.png";
export const BAY_NIGHT = nightPictureFor("hangar");

// Home (home-room-empty-*-v6): Squatch by the bed's foot, Mops comes in through the door on the right. The pancake
// brochure (beat 38) is pinned on the wall above the bed, where Mops's bubble never covers it.
export const ES_HOME = Object.freeze({
  sq: Object.freeze({ x: 380, y: 556 }),
  door: Object.freeze({ x: 905, y: 470 }),
  mops: Object.freeze({ x: 700, y: 536 }),
  brochure: Object.freeze({ x0: 236, y0: 132, x1: 306, y1: 228 }), // above the bed, clear of Mops's bubble on the right (the evening's brochure, its shape: 220 by 300)
  closet: Object.freeze({ x: 300, y: 398 }), // where he stands at the wardrobe (home-morning.js HOME_MORNING_SPOTS.closet)
  bedFoot: Object.freeze({ x: 330, y: 560 }),
  wardrobe: Object.freeze({ x0: 30, x1: 172, y0: 188, y1: 352 }), // the wardrobe in the locked home picture (its outline traces it)
  bed: Object.freeze({ x: 205, y: 470 }), // lying in bed (the room draws him there: sqPose "sleep")
  mopsNight: Object.freeze({ x: 640, y: 470 }), // Mops at the end of the day, by the TV, his back to the closet
  // 45a, 45b (the rebuild of 2026-11-26 night): his crate bed (the locked picture's crate, x 83-286), its stamp (the
  // home picture's layer, crate-stamp.js), where Mops stands to touch it; the calendar; the brochure held up
  crate: Object.freeze({ x0: 84, y0: 396, x1: 286, y1: 530 }),
  crateAt: Object.freeze({ x: 330, y: 500 }),
  stamp: Object.freeze({ x: 300, y: 556 }),
  calendar: Object.freeze({ x0: 99, y0: 196, x1: 167, y1: 279 }),
  calAt: Object.freeze({ x: 230, y: 392 }),
  // round 7 (r5 12:19, q: 132): the plan is drawn at his homework desk (home-alone.js's homework spot)
  desk: Object.freeze({ x: 550, y: 392, r: 60, box: Object.freeze({ x0: 396, x1: 522, y0: 238, y1: 352 }) }),
  brochureUp: Object.freeze({ x0: 385, y0: 90, x1: 575, y1: 349 }), // (the evening's brochure, its shape)
});
// The wardrobe and the Guardian Box in it (home-morning-art.js MORNING_THINGS.boxIn) are read from there.

// The loading bay. The big wall vent (the grille under the speaker, right wall): picture x 1070-1200, y 237-332. Its things
// are solid (bay-watch.js BAY_SOLIDS: the walkway, the plant, the bin, the mail room's walls); every walk here is a
// list of corners that goes round them (tests/escape.mjs walks each one).
export const ES_BAY = Object.freeze({
  vent: Object.freeze({ x0: 802, y0: 183, x1: 900, y1: 256 }),
  // where he rolls up: on the floor in front of the vent's wall, clear of the wall's foot (y 254) and of the mail room's
  // wall in front (y 359), with a shadow under him (Brian 2026-11-26, escape 0:47: not looking inside the wall)
  ventStand: Object.freeze({ x: 846, y: 322 }),
  mopsVent: Object.freeze({ x: 800, y: 326 }), // where Mops starts his crawl, left of Squatch
  // how near the vent he must be to roll up there (the ROLL spot's circle, and "at the vent")
  ventReach: 60,
  // the night robot on patrol across the bay in front of the walkway, from the bin toward the vent and back; going
  // right it looks up at the vent, going left the way it goes
  patrol: Object.freeze({ x0: 250, x1: 630, y: 452, speed: 42 }),
  furAlarm: Object.freeze({ x: 81, y: 153 }), // the FUR alarm on the left wall (picture x 92-126, y 178-218)
  toAlarm: Object.freeze([Object.freeze({ x: 52, y: 452 }), Object.freeze({ x: 52, y: 330 })]), // under the FUR alarm, left of the bin
  toDock: Object.freeze([Object.freeze({ x: 640, y: 462 }), Object.freeze({ x: 760, y: 462 }), Object.freeze({ x: 790, y: 560 })]), // in through the mail room's opening
});

// The night robot's sight (the older program's standing cone: 210 long, 0.42 each side; party-watch.js coneFrom).
export const ROBOT_SIGHT = Object.freeze({ run: 170 }); // (its cone: bay-watch.js SIGHT)

// Inside the vent (its locked picture since 2026-11-26: docs/locked-rooms/vent-room-empty-v1.png, drawn by escape-art.js
// drawVentRoomPicture). The grille is on the left (Squatch
// outside it, rolled up, his eyes between the slats); Mops's desk on the right, his back to the grille.
export const VENT_ROOM = Object.freeze({
  grille: Object.freeze({ x0: 24, y0: 250, x1: 150, y1: 470 }),
  eyes: Object.freeze({ x: 86, y: 384 }),
  desk: Object.freeze({ x0: 560, y0: 430, x1: 920, y1: 470 }),
  mops: Object.freeze({ x: 470, y: 462 }), // his feet, at the desk's left end, facing right (back to the grille)
  mopsIn: Object.freeze({ x: 360, y: 462 }), // in from the tunnel, right of the toy bin
  wallX: 350, // he cannot walk left of here (the toy bin, then the grille)
  slip: Object.freeze({ x: 600, y: 432 }), // the pink sheet on the left of the desk, right beside him (lying on its top)
  // 48 (the rebuild of 2026-11-26 night): the player walks Mops (the vent's floor strip, y 400 to 470) to each thing
  // in turn; each has its outline and its place to stand
  lamp: Object.freeze({ x0: 800, y0: 338, x1: 870, y1: 432 }),
  stubs: Object.freeze({ x0: 690, y0: 386, x1: 800, y1: 430 }),
  note: Object.freeze({ x: 655, y: 430 }),
  at: Object.freeze({ lamp: 800, wall: 720, toys: 380, stubs: 700, note: 630, slip: 540, y: 462, r: 64 }),
  picture: "docs/locked-rooms/vent-room-empty-v1.png",
  wall: Object.freeze({ x0: 560, y0: 50, x1: 940, y1: 330 }),
  board: Object.freeze({ x0: 210, y0: 50, x1: 520, y1: 250 }),
  toys: Object.freeze({ x0: 200, y0: 380, x1: 320, y1: 466 }), // on the floor at the back, under the board
  scale: 4.2, // Mops drawn big in the cramped vent (his units to game pixels)
});

// The hallway at night (hallway-room-empty-v6): the office door on the front wall and its keypad, right of it.
export const ES_HALLWAY = Object.freeze({
  door: Object.freeze({ x0: 433, y0: 487, x1: 529, y1: 609 }),
  keypad: Object.freeze({ x0: 543, y0: 567, x1: 569, y1: 601 }),
  sq: Object.freeze({ x: 630, y: 548 }),
  mops: Object.freeze({ x: 330, y: 470 }), // off to the left, facing the photo wall (he never sees the slip's front)
  right: Object.freeze({ x: 930, y: 330 }), // the right doorway, from the loading bay
  doorIn: Object.freeze({ x: 481, y: 590 }),
});

// The keypad close-up (drawn over the blurred hallway): the pink slip on the left with the code, the keypad on the
// right. Keys are 120 across (about 43 phone pixels, a finger) on 132 spacing.
export const KEYPAD = Object.freeze({
  slip: Object.freeze({ x0: 30, y0: 120, x1: 410, y1: 600 }),
  pad: Object.freeze({ x0: 448, y0: 8, x1: 876, y1: 636 }),
  screen: Object.freeze({ x0: 470, y0: 22, x1: 854, y1: 104 }),
  key0: Object.freeze({ x: 530, y: 174 }),
  step: 132,
  r: 60,
  buzz: 0.6, // seconds the red buzz shows before the screen clears for another try
  open: 0.9, // seconds the green screen shows before the door opens
});
export function keyAt(d) {
  const K = KEYPAD;
  if (d === "0") return { x: K.key0.x + K.step, y: K.key0.y + 3 * K.step };
  const i = +d - 1;
  return { x: K.key0.x + (i % 3) * K.step, y: K.key0.y + Math.floor(i / 3) * K.step };
}

// The office (office-room-empty-v2): in through the back-wall door; the computer on the desk.
export const OFFICE = Object.freeze({
  door: Object.freeze({ x: 480, y: 300 }),
  // the walk out from the computer to the door, round the desk and the chair
  out: Object.freeze([Object.freeze({ x: 440, y: 585 }), Object.freeze({ x: 440, y: 300 })]),
  monitor: Object.freeze({ x0: 664, y0: 303, x1: 806, y1: 412 }),
  // what feet cannot walk through in the office (the locked picture's desk, chair and filing cabinet; feet-sized)
  solids: Object.freeze([
    Object.freeze({ id: "desk", x0: 561, x1: 910, y0: 430, y1: 559 }),
    Object.freeze({ id: "chair", x0: 470, x1: 580, y0: 480, y1: 525 }),
    Object.freeze({ id: "cabinet", x0: 33, x1: 193, y0: 470, y1: 517 }),
  ]),
  sq: Object.freeze({ x: 610, y: 585 }),
  mops: Object.freeze({ x: 380, y: 470 }),
  // 51 (the rebuild of 2026-11-26 night): Mops keeps watch at the door; the fun things, each where he stands for it
  watch: Object.freeze({ x: 420, y: 300 }),
  chair: Object.freeze({ at: Object.freeze({ x: 486, y: 560 }), thing: Object.freeze({ x0: 491, y0: 409, x1: 559, y1: 517 }) }),
  mug: Object.freeze({ at: Object.freeze({ x: 120, y: 440 }), thing: Object.freeze({ x0: 70, y0: 300, x1: 112, y1: 336 }) }),
  drawer: Object.freeze({ at: Object.freeze({ x: 230, y: 500 }), thing: Object.freeze({ x0: 68, y0: 352, x1: 158, y1: 396 }) }),
  frame: Object.freeze({ at: Object.freeze({ x: 905, y: 585 }), thing: Object.freeze({ x0: 846, y0: 396, x1: 884, y1: 444 }) }),
  hide: Object.freeze({ at: Object.freeze({ x: 700, y: 585 }), thing: Object.freeze({ x0: 600, y0: 444, x1: 870, y1: 552 }), under: Object.freeze({ x: 735, y: 520 }) }),
  // round 7 (r5 15:01, q: 124): the wall of security screens (they show the bay: bay-camera.js) and the NO FUR poster
  screens: Object.freeze({ at: Object.freeze({ x: 160, y: 300 }), thing: Object.freeze({ x0: 60, y0: 83, x1: 254, y1: 231 }) }),
  poster: Object.freeze({ at: Object.freeze({ x: 650, y: 300 }), thing: Object.freeze({ x0: 606, y0: 96, x1: 700, y1: 210 }) }),
  r: 45,
  // round 7 (r6 0:37, q: 133): a robot comes in through the door, dusts the filing cabinet and goes; `sweep` seconds in
  // all. Its cone shows once it is in the room (below `inside`); in the doorway it has none yet.
  sweep: 5,
  robotWay: Object.freeze([Object.freeze({ x: 480, y: 300 }), Object.freeze({ x: 470, y: 400 }), Object.freeze({ x: 250, y: 470 })]),
  inside: 340,
});
// The way from the bay to the office door (50): the hallway, where the keypad is.
export const ROUTE_OFFICE = Object.freeze({ hangar: "passage" });
// The snack site close-up (over the blurred office): the screen, its header and two buttons.
// Round 7 (r5 15:23 and 15:29, q: 124): a Universal Postal Service page, three pages: SCHEDULE A PICKUP; How big?;
// What's inside? (`schedule`, `sizes`, `inside`: the buttons' boxes on each page).
export const SITE = Object.freeze({
  screen: Object.freeze({ x0: 110, y0: 40, x1: 850, y1: 600 }),
  schedule: Object.freeze({ x0: 200, y0: 260, x1: 760, y1: 430 }),
  sizes: Object.freeze([
    Object.freeze({ id: "size-small", x0: 150, y0: 300, x1: 340, y1: 470 }),
    Object.freeze({ id: "size-medium", x0: 385, y0: 300, x1: 575, y1: 470 }),
    Object.freeze({ id: "size-big", x0: 620, y0: 300, x1: 810, y1: 470 }),
  ]),
  inside: Object.freeze([
    Object.freeze({ id: "in-old", x0: 200, y0: 250, x1: 760, y1: 325 }),
    Object.freeze({ id: "in-goat", x0: 200, y0: 345, x1: 760, y1: 420 }),
    Object.freeze({ id: "in-sq", x0: 200, y0: 440, x1: 760, y1: 515 }),
  ]),
  booked: 2.4, // seconds the booked picture (the crate rides to the ship) plays before the close-up closes
});

// The snack bar at night (the party hall, hall-room-empty-v2): the counter's aisle (lunch-sneak-place.js COUNTER_SPOTS).
export const ES_BAR = Object.freeze({
  sq: Object.freeze({ x: 893, y: 506 }),
  mops: Object.freeze({ x: 893, y: 396 }),
  top: Object.freeze({ x: 893, y: 336 }),
  out: Object.freeze({ x: 700, y: 420 }),
  r: 46, // this near his place behind the counter, the snacks begin (52)
  aisle: Object.freeze({ x0: 862, y0: 352, x1: 924, y1: 548 }), // the counter's aisle (lunch-sneak-place.js AISLE)
});
// The snack close-up: six snacks on the counter (one row of four, two on top), the bag bottom left, the Guardians'
// plate on the counter's right end (it shows once Squatch has said his line).
export const SNACKS = Object.freeze({
  kinds: Object.freeze(["pie", "cup", "cake", "apple", "pie", "cake"]),
  at: Object.freeze([
    Object.freeze({ x: 330, y: 400 }),
    Object.freeze({ x: 460, y: 400 }),
    Object.freeze({ x: 590, y: 400 }),
    Object.freeze({ x: 720, y: 400 }),
    Object.freeze({ x: 395, y: 282 }),
    Object.freeze({ x: 655, y: 282 }),
  ]),
  r: 56,
  counter: 460,
  bag: Object.freeze({ x0: 16, y0: 420, x1: 196, y1: 632 }),
  plate: Object.freeze({ x: 850, y: 440, r: 70 }),
  forBag: 4, // snacks into his bag before he thinks of the Guardians; the rest go on their plate
  carry: 0.45,
  rest: Object.freeze({ x: 470, y: 600 }),
});

// Timing (seconds) and walking speeds (game pixels a second).
export const ES_PACE = Object.freeze({
  mopsIn: 150,
  think: 2.6, // a wordless thought picture over someone's head
  crawl: 1.2, // Mops crawling into (or out of) the vent
  ballWait: 2.2, // rolled up at the vent, the robot rolls by, then the picture goes inside
  grab: 0.45,
  walk: 150,
  hearts: 1.8,
  lie: 1.0,
  gulp: 1.2, // 45a: his gulp and sweat drop
  touch: 1.0, // 45a: Mops's hoof on the crate's worn letter before "...Mars."
  brochureUp: 2.6, // 45a: the brochure held up, big
  lampHold: 1.4, // 48: the room lit, held still before anything can be tapped
  eyes: 2.0, // 48: Squatch's eyes at the grille, in their small round picture
  fold: 1.0, // 49: the slip folded, the paw print inside
  planPop: 2.4, // the crayon plan pops up with a tick
  ghjk: 1.4, // 51: Mops's hooves on the keys before "Hooves. You do it."
  label: 1.2, // 51: the label slides out of the printer
  spin: 1.6, // 51: SPIN · chair
});

// ---------- the rebuild of 2026-11-26 night (the story pass): every number a PLACEHOLDER for Brian ----------
// Beat 43: the home calendar close-up. Seven squares for the week; six get a red X, one at a time; the seventh says
// DELIVERY and has the one highlight.
export const WEEK = Object.freeze({ x0: 120, y0: 170, w: 102, h: 150, gap: 10, xEvery: 0.45, settle: 0.6 });
// Beat 44a: Mops mops the bay by day. Cart tracks across the floor, with dirty patches on them (one pass cleans each).
export const MOP_CALM = Object.freeze({
  start: Object.freeze({ x: 160, y: 520 }),
  patches: Object.freeze([
    Object.freeze({ x: 250, y: 520 }),
    Object.freeze({ x: 360, y: 470 }),
    Object.freeze({ x: 470, y: 540 }),
    Object.freeze({ x: 600, y: 480 }),
  ]),
  r: 34, // a patch is cleaned when his beard passes within this of it
  tracks: Object.freeze([Object.freeze({ y: 470 }), Object.freeze({ y: 540 })]),
});
// Beat 44b: the Mop-Off. The line splits the front floor: the robots' side on the left, the goat's side on the right
// (cells of floor; sticky ones need two passes; the four corner cells are its corners).
export const MOPOFF = Object.freeze({
  line: 470, // x of the painted line
  floor: Object.freeze({ y0: 432, y1: 590 }),
  goat: Object.freeze({ x0: 476, x1: 650, cols: 3, rows: 4 }),
  sticky: Object.freeze(["1,1", "2,2", "0,2"]),
  robotLanes: Object.freeze([460, 510, 560]), // y of each robot's lane on its side
  robotX: Object.freeze([90, 450]),
  robotsDone: 15, // seconds the robots take for their side
  goatTime: 45, // seconds until the buzzer
  // his mop bucket, on the goat side's far edge (round 7, r5 10:24: "shouldn't he have his bucket?"; mop-bucket.js)
  bucket: Object.freeze({ cx: 676, floor: 450, k: 0.28 }),
  wheels: Object.freeze({ at: 24, y: 510, speed: 160 }), // a robot rolls its dirty wheels across the goat side, once
  boxes: Object.freeze({ x: 230, y: 455, at: 6 }), // a stack of boxes the robots knock over
  taunts: Object.freeze([
    Object.freeze({ at: 15, id: "robot-done" }),
    Object.freeze({ at: 19, id: "robot-slow" }),
    Object.freeze({ at: 24.5, id: "robot-efficient" }),
    Object.freeze({ at: 30, id: "robot-done" }),
    Object.freeze({ at: 34, id: "robot-beard" }),
    Object.freeze({ at: 40, id: "robot-corners" }),
  ]),
  board: Object.freeze({ x0: 640, y0: 14, x1: 944, y1: 128 }), // the two bars, on the bay's back wall (top right)
  robotSparkle: 0.3, // the robots' side never sparkles more than this
  goatFast: 0.3, // the goat's FAST bar creeps: at most this, all clean
  hold: 2.0, // the picture holds on the two sides after the buzzer
  zip: 1.6, // the robots zip in
});
// Mops's place in the bay when the robots tell him the news (44c), and the robots round him.
export const NEWS = Object.freeze({ mops: Object.freeze({ x: 560, y: 520 }), bots: Object.freeze([Object.freeze({ x: 400, y: 500, f: 1 }), Object.freeze({ x: 630, y: 590, f: -1 })]) });
// Walking between rooms (44d, 47, 50, 52): each doorway's opening (his feet in it take him through) and where he comes in
// on the other side. Doors join home and the hall, the hall and the hallway, the hallway and the bay.
export const ES_DOORS = Object.freeze({
  closet: Object.freeze([Object.freeze({ to: "hall", box: Object.freeze({ x0: 836, x1: 900, y0: 436, y1: 504 }), at: Object.freeze({ x: 476, y: 556 }), f: 1, mark: Object.freeze({ x0: 872, y0: 360, x1: 960, y1: 500 }) })]),
  hall: Object.freeze([
    Object.freeze({ to: "closet", box: Object.freeze({ x0: 432, x1: 522, y0: 572, y1: 640 }), at: Object.freeze({ x: 820, y: 470 }), f: -1, mark: Object.freeze({ x0: 430, y0: 584, x1: 524, y1: 638 }) }),
    Object.freeze({ to: "passage", box: Object.freeze({ x0: 912, x1: 960, y0: 286, y1: 346 }), at: Object.freeze({ x: 96, y: 345 }), f: 1, mark: Object.freeze({ x0: 880, y0: 258, x1: 946, y1: 348 }) }),
  ]),
  passage: Object.freeze([
    Object.freeze({ to: "hall", box: Object.freeze({ x0: 0, x1: 78, y0: 318, y1: 374 }), at: Object.freeze({ x: 880, y: 318 }), f: -1, mark: Object.freeze({ x0: 14, y0: 250, x1: 72, y1: 372 }) }),
    Object.freeze({ to: "hangar", box: Object.freeze({ x0: 882, x1: 960, y0: 300, y1: 364 }), at: Object.freeze({ x: 70, y: 400 }), f: 1, mark: Object.freeze({ x0: 890, y0: 250, x1: 950, y1: 362 }) }),
  ]),
  office: Object.freeze([Object.freeze({ to: "passage", box: Object.freeze({ x0: 440, x1: 522, y0: 240, y1: 296 }), at: Object.freeze({ x: 570, y: 560 }), f: 1, mark: Object.freeze({ x0: 432, y0: 131, x1: 529, y1: 255 }) })]),
  hangar: Object.freeze([Object.freeze({ to: "passage", box: Object.freeze({ x0: 0, x1: 78, y0: 318, y1: 352 }), at: Object.freeze({ x: 860, y: 332 }), f: -1, mark: Object.freeze({ x0: 8, y0: 260, x1: 64, y1: 352 }) })]),
});
// The way home through the rooms (44d: from the bay), and out to the vent (47: from home).
export const ROUTE_HOME = Object.freeze({ hangar: "passage", passage: "hall", hall: "closet" });
export const ROUTE_VENT = Object.freeze({ closet: "hall", hall: "passage", passage: "hangar" });
// 52: from the office to the snack bar (the hall), and from there home.
export const ROUTE_BAR = Object.freeze({ office: "passage", passage: "hall" });
export const ROUTE_HOME_NIGHT = Object.freeze({ hall: "closet" });
// The hall by day on the walk home: the guest who waves at Mops, and how near Mops must be for her "Hi, Mops!".
export const HALL_GUEST = Object.freeze({ x: 560, y: 450, near: 170, kind: "teal" });
// The hallway's Employee of the Month wall (the locked picture's photo grid): walking Mops past it (x0 to x1) says his
// line (round 7, r5 11:22, q: 128: LOOK · plaque is gone, and so is the big photo of him).
export const PLAQUE = Object.freeze({ x: 480, y: 300, x0: 300, x1: 660 });
// Mops follows Squatch this far behind along his trail (47, 50, 52).
export const FOLLOW = Object.freeze({ gap: 60, speed: 190 });
// 48: the short tunnel, side view, Mops crawling through it before the room; the lost things along it.
export const VENT_TUNNEL = Object.freeze({
  top: 300,
  floor: 470,
  y: 462,
  end: 830, // he reaches the room here (a tap on the far end stops a few steps short of it)
  scale: 2.6,
  finds: Object.freeze([Object.freeze({ x: 300, kind: "hat" }), Object.freeze({ x: 480, kind: "sock" }), Object.freeze({ x: 650, kind: "fork" })]),
});
