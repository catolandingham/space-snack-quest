/**
 * Where everything is in the loading bay beats (Chapter 1, beats 28 to 36; loading-bay.js), and how long things take.
 * Game positions (960 x 640) on the locked loading bay pictures (docs/locked-rooms/delivery-room-empty-day-noship-v2.png
 * and -day-v2.png; picture pixels times 0.75 across and 640/830 down) and the locked hallway picture v6. Every number
 * here is a PLACEHOLDER for Brian unless it says otherwise. Nothing else types these numbers.
 */

/** The parts of the cutscene from the plant to the hallway, in order (each can be jumped to, and ↺ restarts the one he is in). */
export const BAY_PARTS = Object.freeze(["arrive", "dock", "robots", "shake", "promise", "sign", "call", "back", "vent", "plant", "home"]);

/** The locked pictures this beat paints (the older program's names for them: 12-ch1-redesign.js ch1DeliveryArt). */
export const BAY_PICTURES = Object.freeze({ noship: "delivery-noship", day: "delivery-day" });

/** Measured on the locked bay pictures (game positions). */
export const BAY = Object.freeze({
  // The doorway in the left wall (picture x 40, y 350 to 455): where people come in from the hallway and go out.
  // `step`: the first step in from it, left of the plant's pot and in front of it (nobody walks through the pot or the
  // bin, which stand right beside the doorway).
  // `off`: out of sight beyond it (Isfred, the workers, a robot); `edge`: where Squatch and Mops cross into the next room
  // (walks stay on the picture: tests/ch1-playthrough.mjs).
  door: Object.freeze({ x: 44, y: 336, off: Object.freeze({ x: -40, y: 332 }), edge: Object.freeze({ x: 8, y: 334 }), step: Object.freeze({ x: 72, y: 416 }) }),
  // The potted plant by the doorway: its leaves (the eyes go in their middle, Brian's brief 2026-11-26: "only his
  // eyes show, centered in the plant"), and where he stands to hide in it (in front of the pot).
  plant: Object.freeze({ leaves: Object.freeze({ x0: 81, x1: 170, y0: 256, y1: 338 }), eyes: Object.freeze({ x: 125, y: 300 }), stand: Object.freeze({ x: 126, y: 384 }) }),
  // The bin beside the plant (picture 250 to 315, 410 to 485): its opening, where the copies go in.
  bin: Object.freeze({ x: 212, top: 318, box: Object.freeze({ x0: 186, x1: 238, y0: 312, y1: 376 }) }),
  // The window the ship docks in (picture 180 to 1060, 88 to 297) and the ramp with the fur scanner under it (picture 455
  // to 785, 240 to 540): the parts of the "day" picture that differ from the "noship" one.
  window: Object.freeze({ x0: 135, x1: 795, y0: 66, y1: 230 }),
  ramp: Object.freeze({ x0: 340, x1: 590, y0: 184, y1: 420 }),
  // The ship's door at the top of the ramp, and the ramp's foot (inside the scanner arch).
  shipDoor: Object.freeze({ x: 465, y: 214 }),
  // The fur scanner arch at the ramp's foot (in the "day" picture only), measured on it: its top bar and two posts stand
  // in front of anyone on the ramp behind them (feet above `foot`); between the posts, the scanner's field.
  arch: Object.freeze({
    bar: Object.freeze({ x0: 344, x1: 587, y0: 303, y1: 326 }),
    posts: Object.freeze([Object.freeze({ x0: 347, x1: 364, y0: 325, y1: 416 }), Object.freeze({ x0: 566, x1: 584, y0: 325, y1: 416 })]),
    field: Object.freeze({ x0: 364, x1: 566, y0: 326, y1: 410 }),
    foot: 412,
  }),
  rampFoot: Object.freeze({ x: 465, y: 404 }),
  // The wall speaker (picture 1090 to 1138, 125 to 173) and the big wall vent under it (picture 1070 to 1200, 238 to 332).
  speaker: Object.freeze({ x0: 817, x1: 853, y0: 96, y1: 133 }),
  vent: Object.freeze({ x0: 802, x1: 900, y0: 183, y1: 256 }),
});

/** Where people stand (feet), each checked against the bay's furniture in tests/loading-bay.mjs. */
export const BAY_SPOTS = Object.freeze({
  // beat 29: walking in, they stop here; then the kid walks Squatch back to the plant
  sqIn: Object.freeze({ x: 236, y: 470 }),
  mopsIn: Object.freeze({ x: 318, y: 446 }),
  // beats 30 to 35: Mops waits here, between the plant and the ramp, looking at the ship
  mopsWatch: Object.freeze({ x: 250, y: 470 }),
  isfred: Object.freeze({ x: 330, y: 440 }),
  // (in the order they come in, the first one furthest in, so nobody walks through the one before him)
  workers: Object.freeze([Object.freeze({ x: 480, y: 520, name: "Dot" }), Object.freeze({ x: 420, y: 540, name: "Bob" }), Object.freeze({ x: 360, y: 520, name: "Lou" })]),
  // the robots wait right of the ramp's foot, so the workers have a clear way up it
  robots: Object.freeze([Object.freeze({ x: 534, y: 468 }), Object.freeze({ x: 588, y: 470 }), Object.freeze({ x: 560, y: 532 })]),
  // beat 32: the robot holds the form set up to Isfred
  robotSign: Object.freeze({ x: 384, y: 448 }),
  // beat 33: the robot brings the other two copies back to Mops
  robotToMops: Object.freeze({ x: 314, y: 474 }),
  // beat 33: Mops by the big wall vent, his back to the robots; the way there goes round the robots and the scanner
  mopsVent: Object.freeze({ x: 848, y: 334 }),
  ventWay: Object.freeze([Object.freeze({ x: 330, y: 588 }), Object.freeze({ x: 640, y: 588 }), Object.freeze({ x: 640, y: 340 })]),
  // beats 34 and 35: Mops beside the plant (talking to the eyes), the bin just behind him
  mopsPlant: Object.freeze({ x: 196, y: 404 }),
  plantWay: Object.freeze([Object.freeze({ x: 640, y: 340 }), Object.freeze({ x: 640, y: 588 }), Object.freeze({ x: 330, y: 588 }), Object.freeze({ x: 300, y: 520 })]),
  // people coming in past Mops (who waits at mopsWatch) go behind him, then on to their places
  behindMops: Object.freeze([Object.freeze({ x: 196, y: 436 }), Object.freeze({ x: 330, y: 436 })]),
  // the two robots that go off into the hallway in beat 36: in front of Mops and the plant, then out by the doorway
  robotsOut: Object.freeze([Object.freeze({ x: 640, y: 584 }), Object.freeze({ x: 360, y: 584 }), Object.freeze({ x: 120, y: 470 })]),
  // beat 36: out of the plant, then out through the doorway
  sqOut: Object.freeze({ x: 150, y: 420 }),
});

/** The hallway (locked v6): its doorways at both ends, the office door in the front wall, where the robots wait. */
export const HALLWAY = Object.freeze({
  left: Object.freeze({ x: 14, y: 330 }),
  right: Object.freeze({ x: 946, y: 330 }),
  // the robots wait on the floor either side of the office door (picture 575 to 705 at the bottom), turned to it,
  // never on the door or a wall (Brian 2026-11-26, the video at 1:37.2)
  robots: Object.freeze([Object.freeze({ x: 356, y: 548, f: 1 }), Object.freeze({ x: 612, y: 548, f: -1 })]),
  officeDoor: Object.freeze({ x0: 431, x1: 529, y0: 487, y1: 609 }),
  // beat 36: in from the bay (Mops's line about the robots), where they pass the robots (the two lines), and where they
  // stop for beat 37. Low enough on the floor that a bubble over a head stays under the photo wall's heading; Mops on
  // the front side, between Squatch and the robots.
  in: Object.freeze({ sq: Object.freeze({ x: 850, y: 374 }), mops: Object.freeze({ x: 760, y: 436 }) }),
  pass: Object.freeze({ sq: Object.freeze({ x: 600, y: 372 }), mops: Object.freeze({ x: 680, y: 432 }) }),
  stop: Object.freeze({ sq: Object.freeze({ x: 330, y: 372 }), mops: Object.freeze({ x: 410, y: 432 }) }),
});

/** How long things take (seconds) and how fast people go (game pixels a second). PLACEHOLDERS. */
export const BAY_PACE = Object.freeze({
  walk: 170, // Squatch and Mops walking together
  hurry: 230, // Mops hurrying across the bay
  people: 150, // Isfred and the workers
  robot: 150, // a robot rolling
  dock: 1.4, // the ship slides into the window
  ramp: 1.0, // the ramp comes down (and goes back up into the ship before it leaves)
  leave: 1.2, // the ship fades out of the window
  shake: 0.6, // one handshake
  sign: 1.0, // Isfred's signature on the white copy
  code: 1.6, // the office code's numbers on the pink, one after another, copying through to the yellow
  box: 1.0, // the ORDER MORE ROBOTS box pulses
  grow: 0.4, // a close-up growing out of its place
  chime: 1.2, // the wall speaker's chime
  office: 1.4, // the robot is out of sight in the office
  bite: 0.5, // the bite out of the corner
  spit: 0.6, // the copies flying into the bin
  look: 0.6, // a little pause to look
});

/** The robots' sight (the older program's standing cone, 210 long, 0.42 each side, as every Chapter 1 robot). */
export const ROBOT_SIZE = Object.freeze({ h: 58, w: 34 });

/**
 * The close-ups drawn inside the picture (Brian's brief 2026-11-26: a 10-year-old must see the three copies, the bite
 * and which bin): `src` the part of the room shown, `dst` where it is drawn bigger, framed and joined to `src`.
 */
export const BAY_CLOSEUPS = Object.freeze({
  // beat 32: the form set in the robot's hands, drawn big (its own drawing, not a copy of the room)
  // (below the top strip, where Mops's paper joke sits over it)
  form: Object.freeze({ src: Object.freeze({ x0: 340, y0: 360, x1: 412, y1: 420 }), dst: Object.freeze({ x0: 300, y0: 146, x1: 944, y1: 624 }) }),
  // beat 33: Mops's head by the vent as he bites the two stuck copies
  bite: Object.freeze({ src: Object.freeze({ x0: 790, y0: 244, x1: 914, y1: 340 }), dst: Object.freeze({ x0: 300, y0: 250, x1: 748, y1: 597 }) }),
  // beats 34 and 35: Mops at the plant (the eyes in it), the bin, the copies going into it
  plant: Object.freeze({ src: Object.freeze({ x0: 70, y0: 252, x1: 260, y1: 412 }), dst: Object.freeze({ x0: 430, y0: 120, x1: 936, y1: 546 }) }),
});
