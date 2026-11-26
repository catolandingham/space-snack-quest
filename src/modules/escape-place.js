/**
 * Where things are and how long things take in the escape (Chapter 1, beats 43 to 52). Game positions are the 960 x 640
 * picture, read off the locked room pictures (docs/locked-rooms/: the picture is 1280 x 830, so x * 0.75 and y * 0.771).
 * Every number here is a PLACEHOLDER for Brian to see in play, except the office code: 169556 (Brian, chat, 2026-11-26:
 * six digits, replacing the old 4723), for the office door only (Brian 2026-11-22: "We need the code for the office
 * door, not the hangar").
 */
export const OFFICE_CODE = "169556";

// The loading bay pictures the escape draws (the older program's LOCKED_ROOMS names the same files).
export const BAY_DAY = "docs/locked-rooms/delivery-room-empty-day-noship-v2.png";
export const BAY_NIGHT = "docs/locked-rooms/delivery-room-empty-night-v2.png";

// Home (home-room-empty-*-v6): Squatch by the bed's foot, Mops comes in through the door on the right. The pancake
// brochure (beat 38) is pinned on the wall above the desk.
export const HOME = Object.freeze({
  sq: Object.freeze({ x: 380, y: 556 }),
  door: Object.freeze({ x: 905, y: 470 }),
  mops: Object.freeze({ x: 700, y: 536 }),
  brochure: Object.freeze({ x0: 396, y0: 146, x1: 486, y1: 232 }),
  closet: Object.freeze({ x: 300, y: 398 }), // where he stands at the wardrobe (home-morning.js HOME_MORNING_SPOTS.closet)
  bedFoot: Object.freeze({ x: 330, y: 560 }),
  bed: Object.freeze({ x: 205, y: 470 }), // lying in bed (the room draws him there: sqPose "sleep")
  mopsNight: Object.freeze({ x: 640, y: 470 }), // Mops at the end of the day, by the TV, his back to the closet
});
// The wardrobe and the Guardian Box in it (home-morning-art.js MORNING_THINGS.boxIn) are read from there.

// The loading bay. The big wall vent (the grille under the speaker, right wall): picture x 1070-1200, y 237-332.
export const BAY = Object.freeze({
  vent: Object.freeze({ x0: 802, y0: 183, x1: 900, y1: 256 }),
  ventStand: Object.freeze({ x: 850, y: 334 }), // just below the grille, on the floor (the bay's floor starts at y 320)
  mopsVent: Object.freeze({ x: 806, y: 336 }), // where Mops starts his crawl, left of Squatch
  enter: Object.freeze({ x: 150, y: 400 }), // where they come in from the hallway (the left doorway)
  // the tease (beat 44): Mops mops in the middle, the three robots round him
  teaseMops: Object.freeze({ x: 470, y: 470 }),
  teaseBots: Object.freeze([Object.freeze({ x: 330, y: 440 }), Object.freeze({ x: 610, y: 430 }), Object.freeze({ x: 560, y: 560 })]),
  // the night robot on patrol across the bay below the ramp's frame, from the bin toward the vent and back; going right
  // it looks up at the vent, going left the way it goes
  patrol: Object.freeze({ x0: 250, x1: 700, y: 446, speed: 42 }),
  furAlarm: Object.freeze({ x: 81, y: 153, under: Object.freeze({ x: 110, y: 330 }) }), // the FUR alarm on the left wall
});

// The night robot's sight (the older program's standing cone: 210 long, 0.42 each side; party-watch.js coneFrom).
export const ROBOT_SIGHT = Object.freeze({ len: 210, half: 0.42, seen: 0.8, run: 170, eyeUp: 28 });

// Inside the vent (no locked picture: a placeholder room, drawn by escape-art.js). The grille is on the left (Squatch
// outside it, rolled up, his eyes between the slats); Mops's desk on the right, his back to the grille.
export const VENT_ROOM = Object.freeze({
  grille: Object.freeze({ x0: 24, y0: 250, x1: 150, y1: 470 }),
  eyes: Object.freeze({ x: 86, y: 384 }),
  desk: Object.freeze({ x0: 560, y0: 430, x1: 920, y1: 470 }),
  mops: Object.freeze({ x: 470, y: 600 }), // his feet, at the desk's left end, facing right (back to the grille)
  mopsIn: Object.freeze({ x: 200, y: 600 }),
  slip: Object.freeze({ x: 650, y: 432 }), // the pink sheet on the left of the desk, right beside him (lying on its top)
  wall: Object.freeze({ x0: 560, y0: 50, x1: 940, y1: 330 }),
  board: Object.freeze({ x0: 210, y0: 50, x1: 520, y1: 250 }),
  toys: Object.freeze({ x0: 200, y0: 380, x1: 320, y1: 466 }), // on the floor at the back, under the board
  scale: 4.2, // Mops drawn big in the cramped vent (his units to game pixels)
});

// The hallway at night (hallway-room-empty-v6): the office door on the front wall and its keypad, right of it.
export const HALLWAY = Object.freeze({
  door: Object.freeze({ x0: 433, y0: 487, x1: 529, y1: 609 }),
  keypad: Object.freeze({ x0: 543, y0: 567, x1: 569, y1: 601 }),
  sq: Object.freeze({ x: 630, y: 548 }),
  mops: Object.freeze({ x: 330, y: 470 }), // off to the left, facing the photo wall (he never sees the slip's front)
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
  monitor: Object.freeze({ x0: 664, y0: 303, x1: 806, y1: 412 }),
  sq: Object.freeze({ x: 610, y: 585 }),
  mops: Object.freeze({ x: 380, y: 470 }),
});
// The Moon Pie site close-up (over the blurred office): the screen, its header and two buttons.
export const SITE = Object.freeze({
  screen: Object.freeze({ x0: 110, y0: 40, x1: 850, y1: 600 }),
  order: Object.freeze({ x0: 200, y0: 210, x1: 760, y1: 290 }),
  ret: Object.freeze({ x0: 200, y0: 330, x1: 760, y1: 500 }),
  booked: 2.4, // seconds the booked picture (the crate rides to the ship) plays before the close-up closes
});

// The snack bar at night (the party hall, hall-room-empty-v2): the counter's aisle (lunch-sneak-place.js COUNTER_SPOTS).
export const BAR = Object.freeze({
  sq: Object.freeze({ x: 893, y: 506 }),
  mops: Object.freeze({ x: 893, y: 396 }),
  top: Object.freeze({ x: 893, y: 336 }),
  out: Object.freeze({ x: 700, y: 420 }),
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
export const PACE = Object.freeze({
  tease: 2.4, // the robots circle Mops, laughing, before the first line
  sad: 1.0,
  mopsIn: 150,
  think: 2.6, // a wordless thought picture over someone's head
  crawl: 1.2, // Mops crawling into (or out of) the vent
  ballWait: 2.2, // rolled up at the vent, the robot rolls by, then the picture goes inside
  writeNote: 3.2,
  hop: 0.5,
  grab: 0.45,
  walk: 150,
  hearts: 1.8,
  lie: 1.0,
});
