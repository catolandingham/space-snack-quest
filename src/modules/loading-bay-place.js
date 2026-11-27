/**
 * Where everything is in the loading bay beats (Chapter 1, beats 28 to 36 and 36b; loading-bay.js), and how long things
 * take. Game positions (960 x 640) on the locked loading bay pictures v3 (docs/locked-rooms/delivery-room-empty-day-v3.png
 * and -day-noship-v3.png: picture pixels times 0.75 across and 640/830 down; the plant stands right of the bin since v3),
 * the locked hallway picture v6 and the locked hall picture v2. Every number here is a PLACEHOLDER for Brian unless it
 * says otherwise. Nothing else types these numbers.
 */

/** The parts of the bay that play by themselves (each can be jumped to, and ↺ restarts the one he is in). */
export const BAY_PARTS = Object.freeze(["arrive", "robots", "talk", "promise", "form", "back", "orders", "after"]);
/** The steps the player controls (ch1Step "bay-<step>"), in order. */
export const BAY_STEPS = Object.freeze(["hallway", "cargo", "sneak", "peek", "take", "eat", "talkto", "spit", "box", "give", "home", "walkby", "hall"]);

/** The locked pictures this beat paints (the older program's names for them: 12-ch1-redesign.js ch1DeliveryArt). */
export const BAY_PICTURES = Object.freeze({ noship: "delivery-noship", day: "delivery-day" });

/** Measured on the locked bay pictures v3 (game positions). */
export const BAY = Object.freeze({
  // The doorway in the left wall (picture x 40, y 350 to 455). `off`: out of sight beyond it (Isfred, the workers, a
  // robot); `edge`: where Squatch and Mops cross into the hallway (walks stay on the picture); `step`: the first step in,
  // in front of the cargo.
  door: Object.freeze({ x: 44, y: 336, off: Object.freeze({ x: -40, y: 332 }), edge: Object.freeze({ x: 8, y: 334 }), step: Object.freeze({ x: 60, y: 420 }) }),
  // The potted plant right of the bin (v3): its leaves (the eyes go in their middle), and where he stands to hide in it.
  plant: Object.freeze({ leaves: Object.freeze({ x0: 249, x1: 339, y0: 256, y1: 338 }), eyes: Object.freeze({ x: 294, y: 300 }), stand: Object.freeze({ x: 294, y: 384 }) }),
  // The bin by the doorway (picture 250 to 315, 410 to 485): its opening, where the copies go in.
  bin: Object.freeze({ x: 212, top: 318, box: Object.freeze({ x0: 186, x1: 238, y0: 312, y1: 376 }) }),
  // The cargo stacked by the doorway (a PLACEHOLDER drawing, where the plant stood before v3): two crates. He hides
  // behind it as a ball (`ball`: between the crates and the back wall).
  cargo: Object.freeze({ box: Object.freeze({ x0: 70, x1: 150, y0: 304, y1: 384 }), solid: Object.freeze({ x0: 66, x1: 154, y0: 354, y1: 386 }), ball: Object.freeze({ x: 176, y: 350 }) }), // (the ball tucked against its right side: the cargo hides part of him, never all)
  // The window the ship docks in and the ramp with the fur scanner under it: the parts of "day" that differ from "noship".
  window: Object.freeze({ x0: 135, x1: 795, y0: 66, y1: 230 }),
  ramp: Object.freeze({ x0: 340, x1: 590, y0: 184, y1: 420 }),
  shipDoor: Object.freeze({ x: 465, y: 214 }),
  rampFoot: Object.freeze({ x: 465, y: 404 }),
  // The fur scanner arch (in the "day" picture only), measured on it: its bar and posts stand in front of anyone on the
  // ramp behind them; between the posts, its field.
  arch: Object.freeze({
    bar: Object.freeze({ x0: 344, x1: 587, y0: 303, y1: 326 }),
    posts: Object.freeze([Object.freeze({ x0: 347, x1: 364, y0: 325, y1: 416 }), Object.freeze({ x0: 566, x1: 584, y0: 325, y1: 416 })]),
    field: Object.freeze({ x0: 364, x1: 566, y0: 326, y1: 410 }),
    foot: 412,
  }),
  // The wall speaker, the big wall vent, the red FUR alarm on the left wall (picture 90 to 126, 178 to 218).
  speaker: Object.freeze({ x0: 817, x1: 853, y0: 96, y1: 133 }),
  vent: Object.freeze({ x0: 802, x1: 900, y0: 183, y1: 256 }),
  furAlarm: Object.freeze({ x0: 68, x1: 95, y0: 137, y1: 168 }),
  // The robot mailbox in the mail room: its slot, and where a robot stands to post.
  mailbox: Object.freeze({ x: 878, slot: Object.freeze({ x: 878, y: 420 }), post: Object.freeze({ x: 822, y: 470 }) }),
  // the mail room's doorway (the gap in its left wall), for a robot going in and out
  mailDoor: Object.freeze({ x: 690, y: 466 }),
  floorTop: 320,
});

/** Where people stand (feet), each checked against the bay's furniture in tests/standing-spots.mjs. */
export const BAY_SPOTS = Object.freeze({
  // beat 29: in through the doorway they stop here (Mops ahead); then Squatch hides behind the cargo
  sqIn: Object.freeze({ x: 180, y: 452 }),
  mopsIn: Object.freeze({ x: 250, y: 474 }),
  // beats 30 to 35: Mops waits here, in the open near the bin (he is the janitor)
  mopsWatch: Object.freeze({ x: 250, y: 474 }),
  isfred: Object.freeze({ x: 386, y: 452 }),
  // the three workers (the first one in furthest in)
  // the three workers stand in front of the three robots (each hands his tool to the robot above him)
  workers: Object.freeze([Object.freeze({ x: 520, y: 544, name: "Dot" }), Object.freeze({ x: 580, y: 544, name: "Bob" }), Object.freeze({ x: 640, y: 544, name: "Lou" })]),
  // in from the doorway they go behind Mops, then down and along the front of the room, then up to their places
  workerWay: Object.freeze([Object.freeze({ x: 330, y: 436 }), Object.freeze({ x: 330, y: 588 })]),
  // the robots wait in a row right of the ramp's foot
  robots: Object.freeze([Object.freeze({ x: 520, y: 472 }), Object.freeze({ x: 580, y: 472 }), Object.freeze({ x: 640, y: 472 })]),
  // beat 30, the sneak: one robot rolls to and fro across the floor between the ramp and the plant, looking the way it goes
  patrol: Object.freeze({ y: 486, x0: 330, x1: 470, speed: 70 }),
  // the new crates come down to here (in front of the mail room); the little tagged box is left at the ramp's foot; last
  // week's empty crate waits right of the scanner until it goes up the ramp
  crates: Object.freeze({ x: 180, y: 592 }),
  box: Object.freeze({ x: 448, y: 430 }),
  emptyCrate: Object.freeze({ x: 620, y: 430 }),
  // beat 32: Robot 1 holds the form up to Isfred
  robotSign: Object.freeze({ x: 438, y: 454 }),
  // beat 33: Robot 1 brings the two copies to Mops
  robotToMops: Object.freeze({ x: 316, y: 478 }),
  // beats 34 and 35: Mops talks to the plant here; spits into the bin from here; picks up the box from here
  talk: Object.freeze({ x: 330, y: 404 }),
  spit: Object.freeze({ x: 244, y: 404 }),
  boxPick: Object.freeze({ x: 448, y: 454 }),
  // beat 36: out of the plant
  sqOut: Object.freeze({ x: 300, y: 412 }),
  // walks in and out go behind Mops (he waits at mopsWatch)
  behindMops: Object.freeze([Object.freeze({ x: 196, y: 436 }), Object.freeze({ x: 330, y: 436 })]),
  // the robots that go off to clean, along the front of the room, out through the doorway
  robotsOut: Object.freeze([Object.freeze({ x: 360, y: 560 }), Object.freeze({ x: 120, y: 470 })]),
  // Robot 1 from Isfred to the office, and back: below Isfred, then behind Mops
  officeWay: Object.freeze([Object.freeze({ x: 438, y: 500 }), Object.freeze({ x: 330, y: 500 }), Object.freeze({ x: 330, y: 436 }), Object.freeze({ x: 196, y: 436 })]),
});

/** The hallway (locked v6). */
export const HALLWAY = Object.freeze({
  left: Object.freeze({ x: 14, y: 330 }),
  right: Object.freeze({ x: 946, y: 330 }),
  // the photo wall's floor (the evening's photo wall, beat 37; on the way to the ship nothing happens there now: round 7
  // cut "Later. The ship!", r5 0:27, q: 133)
  photoWall: Object.freeze({ x0: 270, x1: 720, y0: 256, y1: 300 }),
  // the office door in the front wall (picture 575 to 705 at the bottom): it slides open in beat 36
  officeDoor: Object.freeze({ x0: 431, x1: 529, y0: 487, y1: 609 }),
  // beat 36: Robot 1 rolls out of the office to here and looks up the hallway; walking past it (x below `trigger`) opens
  // the door; he has `rollTime` seconds to roll up
  robotOut: Object.freeze({ x: 480, y: 470 }),
  // where walking into the hallway's far ends takes him through (inside the hallway's walk bounds, x 60 to 900)
  exitRight: 880,
  exitLeft: 80,
  trigger: 640,
  // where Mops waits for him at each end
  mopsBay: Object.freeze({ x: 880, y: 352 }),
  mopsHall: Object.freeze({ x: 70, y: 340 }),
});

/** Beat 36b: the party hall (locked v2), three robots mopping in lanes; he crosses from the hallway doorway down to the snack counter's front. */
export const HALL_SNEAK = Object.freeze({
  // (a step in from the doorway, on the strip above the counter's end; Mops a step behind him, just inside the doorway:
  // until 2026-11-27 they stood 12 pixels apart, drawn one on top of the other, and the kid robot counted Squatch as
  // standing inside Mops)
  in: Object.freeze({ x: 850, y: 320 }),
  // (Mops on the strip at the aisle's top, clear of the counter: in the aisle his feet were against it)
  mopsIn: Object.freeze({ x: 905, y: 326 }),
  // the counter's front end, where 38a (the storm) begins: reaching it ends this beat
  goal: Object.freeze({ x: 772, y: 584, r: 46 }),
  goalBox: Object.freeze({ x0: 720, x1: 806, y0: 540, y1: 606 }),
  // when he has reached it, the robots roll out through the hallway doorway (out, then gone past the picture's edge)
  out: Object.freeze({ x: 905, y: 318 }),
  gone: Object.freeze({ x: 1010, y: 314 }),
  // the lanes the robots mop: from x0 to x1 and back, at y; each robot starts at `at` (0 to 1 along its lane), heading `dir`
  lanes: Object.freeze([
    // (the first lane stops short of the doorway, so its cone never reaches him where he comes in)
    Object.freeze({ y: 392, x0: 300, x1: 600, at: 0.1, dir: 1 }),
    // (in front of the lunch's stack of crates, which stays in the hall, lunch-sneak-place.js LUNCH_PLACES.crate: never
    // through it)
    Object.freeze({ y: 500, x0: 150, x1: 744, at: 0.55, dir: -1 }),
    // (in front of the middle plant's pot: never through it)
    Object.freeze({ y: 566, x0: 150, x1: 700, at: 0.85, dir: 1 }),
  ]),
});

/** How long things take (seconds) and how fast people go (game pixels a second). PLACEHOLDERS. */
export const BAY_PACE = Object.freeze({
  walk: 170,
  hurry: 230,
  people: 150,
  robot: 150,
  mop: 120, // a robot mopping a lane
  dock: 1.4,
  ramp: 1.0,
  leave: 1.2,
  shadow: 1.2, // Isfred's shadow in the doorway before the cue
  shake: 0.6,
  sign: 1.0,
  code: 1.6,
  grow: 0.4,
  bite: 0.5,
  spit: 0.6,
  look: 0.6,
  rollTime: 1.5, // the hairball: how long he has to roll up once the robot turns his way
  lookAway: 2, // the hairball: the robot comes out looking the other way this long first (round 7, r5 3:45, q: 133)
  doorOpen: 0.5,
  flash: 0.6, // the scanner's red flash at Lou's hat
});

/** The robots' size (the bay's; other rooms scale it by their grown-ups, room-sizes.js) and their sight. */
export const ROBOT_SIZE = Object.freeze({ h: 58, w: 34 });

/** The close-ups drawn inside the picture (Brian 2026-11-26: the zoom-in cut-in, kept where it helps a kid see). */
export const BAY_CLOSEUPS = Object.freeze({
  // beat 32: the form in the robot's hands, drawn big (its own drawing, not a copy of the room)
  form: Object.freeze({ src: Object.freeze({ x0: 396, y0: 366, x1: 468, y1: 426 }), dst: Object.freeze({ x0: 300, y0: 146, x1: 944, y1: 624 }) }),
  // beat 33: Mops's face as he eats the copies, Squatch's eyes in the plant in the corner (Brian liked it: kept)
  bite: Object.freeze({ src: Object.freeze({ x0: 196, y0: 280, x1: 352, y1: 490 }), dst: Object.freeze({ x0: 420, y0: 150, x1: 720, y1: 554 }) }),
  // beats 34 and 35: Mops at the plant (the eyes in it), the bin, the copies going into it
  plant: Object.freeze({ src: Object.freeze({ x0: 176, y0: 262, x1: 366, y1: 422 }), dst: Object.freeze({ x0: 430, y0: 120, x1: 936, y1: 546 }) }),
  // beat 35: the little box's tag
  tag: Object.freeze({ src: Object.freeze({ x0: 300, y0: 380, x1: 360, y1: 420 }), dst: Object.freeze({ x0: 420, y0: 150, x1: 900, y1: 470 }) }),
});
