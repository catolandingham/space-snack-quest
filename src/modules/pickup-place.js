/**
 * Where things are and how long things take on pickup day (Chapter 1, beats 53 to 61). Game positions are the 960 x 640
 * picture, read off the locked room pictures (docs/locked-rooms/: the pictures are 1280 x 830, so x * 0.75 and
 * y * 0.771). Every number here is a PLACEHOLDER for Brian to see in play.
 */
import { ES_HOME } from "./escape-place.js";

// The loading bay on pickup day: the locked picture with the ship docked and the mail room full of crates and bags
// (delivery-room-empty-pickup-v3.png, story pass 54). After the ship has gone, the same bay with no ship.
export const PK_BAY_PICKUP = "docs/locked-rooms/delivery-room-empty-pickup-v3.png";
export const PK_BAY_GONE = "docs/locked-rooms/delivery-room-empty-day-noship-v2.png";

// Home on pickup morning (home-room-empty-open-v6).
export const PK_HOME = Object.freeze({
  // the note the player wrote in the vent, folded on his pillow (the crate bed's purple pad: picture x 128-368, y 518-565)
  note: Object.freeze({ x0: 112, y0: 400, x1: 160, y1: 428 }),
  wake: Object.freeze({ x: 330, y: 556 }), // where he stands up, by the bed's foot
  noteAt: Object.freeze({ x: 330, y: 556 }),
  // the wardrobe (open) and the Guardian Box in it (home-morning-art.js MORNING_THINGS.boxIn), where he stands for it
  closet: ES_HOME.closet,
  // the crate bed (the locked picture's crate, its posts included): the fur on it, where Mops stands to wipe each tuft
  // with his beard (facing left), and the one long white hair left on the wood
  crate: ES_HOME.crate,
  bedBox: Object.freeze({ x0: 80, y0: 396, x1: 290, y1: 548 }),
  floorAt: Object.freeze({ x: 760, y: 600 }), // a spot of bare floor in the locked picture (the floor's colour)
  tufts: Object.freeze([
    Object.freeze({ x: 118, y: 462 }),
    Object.freeze({ x: 166, y: 494 }),
    Object.freeze({ x: 222, y: 458 }),
    Object.freeze({ x: 262, y: 500 }),
  ]),
  tuftStand: 72, // Mops stands this far right of a tuft (his beard reaches it)
  tuftY: 572,
  tuftR: 30,
  hair: Object.freeze({ x: 196, y: 480 }),
  crateAt: Object.freeze({ x: 330, y: 520 }), // where Squatch stands to pack it
  // Mops's mop bucket (the locked picture's bucket: home-furniture.json "bucket")
  bucket: Object.freeze({ x0: 536, y0: 500, x1: 596, y1: 571 }),
  bucketAt: Object.freeze({ x: 640, y: 560 }),
  // the things on the walls he takes down (layers on the locked picture: his crayon chart of cake kinds, the pancake
  // brochure from beat 38, two of his drawings), each with where he stands for it
  walls: Object.freeze([
    Object.freeze({ id: "chart", box: Object.freeze({ x0: 322, y0: 104, x1: 416, y1: 196 }), at: Object.freeze({ x: 370, y: 470 }) }),
    Object.freeze({ id: "brochure", box: ES_HOME.brochure, at: Object.freeze({ x: 320, y: 470 }) }),
    Object.freeze({ id: "drawing", box: Object.freeze({ x0: 432, y0: 112, x1: 506, y1: 176 }), at: Object.freeze({ x: 470, y: 470 }) }),
    Object.freeze({ id: "drawing2", box: Object.freeze({ x0: 718, y0: 96, x1: 790, y1: 158 }), at: Object.freeze({ x: 750, y: 470 }) }),
  ]),
  wallR: 70,
  // the crate on its pallet once it is packed, out on the floor (its bottom middle), and its label
  packed: Object.freeze({ x: 470, y: 560 }),
  pushFrom: Object.freeze({ x: 660, y: 592 }), // Mops starts the push here (clear of the bucket's place), facing the door
  sq: Object.freeze({ x: 400, y: 556 }),
  mops: Object.freeze({ x: 640, y: 470 }),
  bed: ES_HOME.bed,
  bedFoot: ES_HOME.bedFoot,
  // 56: the wardrobe's mirror (a layer on the inside of the open door, for Brian's yes); where each stands for it
  mirror: Object.freeze({ x0: 182, y0: 200, x1: 236, y1: 340 }),
  mirrorSq: Object.freeze({ x: 330, y: 470 }),
  mirrorMops: Object.freeze({ x: 430, y: 470 }),
});

// The crate on its pallet as it is drawn anywhere (game pixels at a room's grown-up size 1: a home-sized crate).
export const PK_CRATE = Object.freeze({ w: 150, h: 96, pallet: 14, ahead: 40 });

// Walking between rooms (escape-place.js ES_DOORS): the push to the mail room, the sneak home, the last walk.
export const ROUTE_PUSH = Object.freeze({ closet: "hall", hall: "passage", passage: "hangar" });
export const ROUTE_SNEAK = Object.freeze({ hangar: "passage", passage: "hall", hall: "closet" });
export const ROUTE_LAST = Object.freeze({ closet: "hall", hall: "passage", passage: "hangar" });

// The party hall by day (53, 57): the guests there. Each looks round, its cone sweeping slowly (`sweep` radians either
// side of `a`, `period` seconds a sweep). In 53 they only wave at Mops.
export const PK_HALL = Object.freeze({
  guests: Object.freeze([
    Object.freeze({ id: "g1", kind: "teal", x: 600, y: 440, a: Math.PI * 0.75, sweep: 0.55, period: 5 }),
    Object.freeze({ id: "g2", kind: "teal", x: 250, y: 470, a: 0.25, sweep: 0.5, period: 6 }),
  ]),
  hiNear: 170, // this near a guest, Mops gets a "Hi, Mops!"
  // 53: a bump while pushing (the crate stopped by a solid) says "Oof!"; again only after this long
  bumpEvery: 2.2,
  // 57: the plate on the snack bar (the Guardians' plate from beat 52), and where he stands to look at it
  plate: Object.freeze({ x0: 822, y0: 354, x1: 856, y1: 374 }),
  plateAt: Object.freeze({ x: 740, y: 420 }),
  plateR: 56,
});
// 57: the costume's rule (decided 2026-11-24): a cone on him stays dashed with "?"; BLEAT pops it; too long in a cone
// without a bleat and the beard slips (fur shows, the cone fills); fur in a cone this long is a catch.
export const COSTUME = Object.freeze({ slipAfter: 3.0, furCatch: 2.5, popFor: 2.0 });

// The hallway by day (hallway-room-empty-v6): the office door (its sign and the camera's flash under it), the crayon
// drawing on the photo wall (ganitor.js HALLWAY_CRAYON) and where he stands to take it.
export const PK_HALLWAY = Object.freeze({
  door: Object.freeze({ x0: 433, y0: 487, x1: 529, y1: 609 }),
  sign: Object.freeze({ x0: 448, y0: 506, x1: 514, y1: 540 }),
  under: Object.freeze({ x0: 440, y0: 600, x1: 522, y1: 609 }),
  crayon: Object.freeze({ x0: 586, y0: 110, x1: 694, y1: 194 }),
  crayonAt: Object.freeze({ x: 640, y: 340 }),
  crayonR: 70,
  robot: Object.freeze({ x: 560, y: 360 }), // 53: the robot that reads the label as the crate rolls by
});

// The loading bay on pickup day (delivery-room-empty-pickup-v3): the walkway (ramp and scanner arch), the plant, the
// bin, the mail room and its row of crates (layers on the picture: a mail bag, a crate, his crate, third).
export const PK_BAY = Object.freeze({
  arch: Object.freeze({ x0: 345, y0: 302, x1: 587, y1: 416 }),
  archFront: Object.freeze({ x: 466, y: 446 }),
  rampFoot: Object.freeze({ x: 466, y: 404 }),
  rampTop: Object.freeze({ x: 466, y: 232 }),
  // where things are scanned: put down at the foot of the ramp, under the arch
  scanAt: Object.freeze({ x: 466, y: 444 }),
  plant: Object.freeze({ x0: 81, y0: 254, x1: 170, y1: 372 }),
  plantAt: Object.freeze({ x: 126, y: 396 }),
  plantR: 60,
  eyes: Object.freeze({ x: 125, y: 318 }),
  bin: Object.freeze({ x: 212, y: 318 }),
  door: Object.freeze({ x: 50, y: 330 }), // in from the hallway
  // the mail room's row (bottom middles), left to right; his crate third (the kid can count)
  row: Object.freeze([
    Object.freeze({ kind: "bag", x: 752, y: 560 }),
    Object.freeze({ kind: "crate", x: 822, y: 560 }),
    Object.freeze({ kind: "his", x: 894, y: 560 }),
  ]),
  mailIn: Object.freeze({ x: 700, y: 462 }), // the mail room's opening
  pushTo: Object.freeze({ x: 848, y: 584 }), // where Mops leaves his crate (it goes to the row's third place)
  pushR: 40,
  knockAt: Object.freeze({ x: 850, y: 584 }),
  knockR: 56,
  bleatAt: Object.freeze({ x: 706, y: 470 }), // Mops at the opening, left of the robots
  bleatR: 50,
  climbOut: Object.freeze({ x: 884, y: 584 }), // (in the bay's walking bounds: x up to 900, y up to 590)
  mopsAside: Object.freeze({ x: 612, y: 560 }), // after his bleat Mops steps out of the mail room's opening (he is solid to Squatch)
  // the robots: where the old three stand in a line by the ramp, where the two new ones work
  oldLine: Object.freeze([Object.freeze({ x: 600, y: 470 }), Object.freeze({ x: 640, y: 500 }), Object.freeze({ x: 680, y: 530 })]),
  botsBack: Object.freeze([Object.freeze({ x: 770, y: 606 }), Object.freeze({ x: 800, y: 580 })]),
  // a carry from the row out through the opening to the scan place (round the mail room's walls), and back
  carry: Object.freeze([Object.freeze({ x: 790, y: 520 }), Object.freeze({ x: 700, y: 462 }), Object.freeze({ x: 600, y: 452 }), Object.freeze({ x: 500, y: 446 })]),
  // 58: the week's box comes down the ramp to here; the robot at the foot of the ramp; Mops waits at the top
  box: Object.freeze({ x: 380, y: 548 }),
  boxR: 60,
  rampBot: Object.freeze({ x: 600, y: 452 }),
  mopsTop: Object.freeze({ x: 500, y: 250 }),
  camera: Object.freeze({ x: 540, y: 288 }), // the camera with a red light over the ramp (a layer, for Brian's yes)
});
// The robots' sight (bay-watch.js SIGHT; the night robot's): new robots carrying a crate look where they roll.
export const PK_SIGHT = Object.freeze({ len: 200, half: 0.42 });

// The ship's cargo hold (61; a drawing of its own: no locked picture exists): their crate, stamp side out, a small
// round window with stars.
export const PK_HOLD = Object.freeze({
  crate: Object.freeze({ x: 480, y: 560 }),
  sq: Object.freeze({ x: 400, y: 560 }),
  mops: Object.freeze({ x: 600, y: 566 }),
  window: Object.freeze({ x: 760, y: 200, r: 64 }),
  stairs: Object.freeze({ x0: 40, y0: 120, x1: 200, y1: 560 }),
});

// The office on photo day (59) and that evening (60): the frame on the desk, the camera on its tripod, a stool, Isfred,
// the new robot; the tape screen.
export const PK_OFFICE = Object.freeze({
  frame: Object.freeze({ x0: 846, y0: 396, x1: 884, y1: 444 }),
  isfred: Object.freeze({ x: 430, y: 520 }),
  robot: Object.freeze({ x: 280, y: 520 }),
  tripod: Object.freeze({ x: 640, y: 560 }),
  stool: Object.freeze({ x: 760, y: 570 }),
  // the tape close-up: the screen and its three big buttons
  screen: Object.freeze({ x0: 120, y0: 40, x1: 840, y1: 470 }),
  buttons: Object.freeze([
    Object.freeze({ id: "play", x0: 120, y0: 500, x1: 340, y1: 610 }),
    Object.freeze({ id: "zoom", x0: 370, y0: 500, x1: 590, y1: 610 }),
    Object.freeze({ id: "next", x0: 620, y0: 500, x1: 840, y1: 610 }),
  ]),
});

// Timing (seconds) and speeds (game pixels a second).
export const PK_PACE = Object.freeze({
  walk: 150,
  roll: 70, // a robot carrying
  newIn: 2.2, // the new robots roll down the ramp
  scan: 1.4, // the blue scan line goes in
  claw: 1.0,
  hold: 1.2, // a held picture (the white hair, the empty plate)
  think: 2.6, // a wordless thought picture
  eyes: 2.4,
  snip: 1.2,
  shake: 0.6,
  scanDown: 1.8, // 58: the scan line from the horns down to the beard
  rampUp: 2.4,
  slip: 2.6, // 58: the beard in his paws, the camera's red light (a wordless close-up)
  gone: 2.4, // 58: the ship slides away; the empty bay
  tape: 2.4, // 60: a tape clip plays
  lid: 1.0,
  faceMops: 4.0, // 55: the robots keep telling Mops off this long after he can climb out
});
