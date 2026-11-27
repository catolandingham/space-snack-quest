/**
 * What the yellow outline goes round for each Chapter 1 goal, keyed "room:spot id" (the spot the goal's
 * action comes from). Positions are game positions (960 x 640), read off the locked room pictures.
 *   trace: the thing inside this box is traced from the locked picture (the box must be a little bigger
 *          than the thing and must not touch any other line).
 *   rect:  a doorway or opening, or a flat rectangle on a wall: the dashed line goes round this box.
 *   source: with trace, a thing the game draws itself, traced from its own drawing (a canvas the size of the game
 *          picture with only that thing on it: home-morning-art.js outlineSource). line: a thicker dashed line for it.
 * A goal with no entry gets no outline (optional things, close-ups, and props the game draws itself,
 * which are still to do: see README "Brian's repeat complaints, as tests").
 */
import { FLYER } from "./party-hall.js";
import { TRACE, MORNING_THINGS, DRAWN_OUTLINE, outlineSource } from "./home-morning-art.js";
import { LUNCH_TRACE, lunchOutlineSource } from "./lunch-sneak-art.js";
import { ES_BAY, OFFICE, ES_HOME } from "./escape-place.js";
import { TALL_BOX, tallClosetSource } from "./tall-closet.js";

// Doorways more than one goal outlines: each typed once.
const HOME_DOOR = { rect: { x0: 912, x1: 940, y0: 358, y1: 468 } }, // home: the doorway in the right wall
  HALL_HOME_DOOR = { rect: { x0: 426, x1: 528, y0: 600, y1: 622 } }; // the hall: the doorway home, in the front wall
// A box `k` pixels bigger all round (the line sits outside the thing).
function pad(b, k) {
  return { x0: b.x0 - k, x1: b.x1 + k, y0: b.y0 - k, y1: b.y1 + k };
}
export const GOAL_TARGETS = {
  // Home
  "closet:peek": HOME_DOOR,
  "closet:hidebed": { trace: { x0: 76, x1: 294, y0: 390, y1: 552 } }, // the bed
  "closet:save-flyer": { trace: { x0: 76, x1: 294, y0: 390, y1: 552 } }, // the bed (party P4: put the flyer under it for Mops)
  "closet:homework": { trace: { x0: 396, x1: 522, y0: 238, y1: 352 } }, // the desk (home alone: do your homework)
  "closet:dress": { trace: { x0: 30, x1: 172, y0: 188, y1: 352 } }, // the closet (party P5: dress up)
  "closet:go-party": HOME_DOOR, // party P5, dressed: out through it
  "closet:undress": { trace: { x0: 30, x1: 172, y0: 188, y1: 352 } }, // the closet (party P8c, home early: costume off)
  // The home morning, Day 2 (home-morning.js): one thing at a time
  "closet:hm-rocket": { trace: TRACE.rocket, source: () => outlineSource("rocket"), line: DRAWN_OUTLINE }, // the Guardians' toy rocket
  // the wardrobe (the box is in it), taller on Day 2 (tall-closet.js): traced from the home picture with it drawn on
  "closet:hm-closet": { trace: { x0: 30, x1: 172, y0: Math.floor(TALL_BOX.y0) - 8, y1: 352 }, source: () => tallClosetSource(false) },
  "closet:hm-box": { rect: pad(MORNING_THINGS.boxIn, 4) }, // the Guardian Box on the closet floor, door open
  "closet:hm-calendar": { rect: { x0: 99, x1: 167, y0: 196, y1: 279 } }, // the calendar on the wardrobe door
  "closet:hm-lunch": { trace: TRACE.bag, source: () => outlineSource("bag"), line: DRAWN_OUTLINE }, // Mops's lunch bag by the door
  // Party hall
  "hall:hide": { trace: { x0: 392, x1: 494, y0: 432, y1: 556 } }, // the plant in the middle (party sneak)
  "hall:go-home": HALL_HOME_DOOR, // party P4, and the alarm
  "hall:grab-flyer": { rect: FLYER.box }, // party P4: the flyer on the bar counter's far end (the party's own table)
  "hall:d2-HIDE-plant": { trace: { x0: 392, x1: 494, y0: 432, y1: 556 } }, // the same plant (Day 2, beat 38)
  // The lunch sneak, Day 2 (lunch-sneak.js): one thing at a time
  // (in the sneak only the hallway doorway is outlined, Brian 2026-11-26, lunch note 0:38; the plant and the crates
  // still hide him, and get the line only during an alarm: the plant's is "hall:hide", the crates' a drawn box)
  "hall:lu-door": { rect: { x0: 912, x1: 940, y0: 257, y1: 345 } }, // the doorway to the hallway (hall v2, back corner)
  "hall:lu-snack": { trace: LUNCH_TRACE.plate, source: () => lunchOutlineSource("plate"), line: DRAWN_OUTLINE }, // the plate of snack cakes
  "hall:d2-GO-home": HALL_HOME_DOOR,
  // Hallway
  "passage:d2-GO-hall": { rect: { x0: 20, x1: 48, y0: 266, y1: 354 } }, // the doorway to the hall (left; the walk uses it)
  // The escape (escape.js): the big wall vent, the slip in Mops's mouth (a box round where it is drawn), the office
  // computer, the wardrobe, the Guardian Box in it
  "hangar:es-ball": { rect: pad(ES_BAY.vent, 6) },
  "office:es-computer": { rect: pad(OFFICE.monitor, 6) },
  "closet:es-closet": { trace: ES_HOME.wardrobe },
  "closet:es-box": { rect: pad(MORNING_THINGS.boxIn, 4) },
  "passage:lu-back": { rect: { x0: 20, x1: 48, y0: 266, y1: 354 } }, // the doorway to the hall (left), after lunch
  "passage:d2-GO-ship": { rect: { x0: 912, x1: 940, y0: 266, y1: 354 } }, // the doorway to the loading bay
  // The evening and night one, Day 2 (evening.js): doorways walked through and the things the next step needs. The
  // photo wall is optional and gets no outline. (Rects only: in the hall and the loading bay that beat draws the
  // picture itself.)
  "passage:ev-hall": { rect: { x0: 20, x1: 48, y0: 266, y1: 354 } }, // the hallway's doorway to the hall (left)
  "passage:ev-bay": { rect: { x0: 912, x1: 940, y0: 266, y1: 354 } }, // its doorway to the loading bay (right)
  "hall:ev-counter": { rect: { x0: 864, x1: 924, y0: 344, y1: 436 } }, // the aisle behind the snack counter (HIDE · counter)
  "hall:ev-brochure": { rect: { x0: 872, x1: 920, y0: 490, y1: 545 } }, // the brochure in the bin behind the counter (38b)
  "hall:ev-home": HALL_HOME_DOOR,
  "hall:ev-hallway": { rect: { x0: 912, x1: 940, y0: 257, y1: 345 } },
  "closet:ev-bed": { trace: { x0: 76, x1: 294, y0: 390, y1: 552 } }, // the bed
  "closet:ev-out": HOME_DOOR,
  "closet:ev-chart": { rect: { x0: 170, x1: 286, y0: 256, y1: 343 } }, // the crayon chart above his bed (39b)
  "closet:ev-crate": { rect: { x0: 92, x1: 279, y0: 433, y1: 528 } }, // his crate bed's side, its stamp (39b)
  "hangar:ev-bin": { rect: { x0: 182, x1: 244, y0: 308, y1: 380 } }, // the bin by the plant
  "hangar:ev-post": { rect: { x0: 834, x1: 918, y0: 362, y1: 484 } }, // the robot mailbox
  "hangar:ev-bay-crate": { rect: { x0: 814, x1: 888, y0: 264, y1: 326 } }, // the crate under the big wall vent (42c)
  "hangar:ev-bayout": { rect: { x0: 20, x1: 48, y0: 266, y1: 354 } }, // the loading bay's doorway (left)
  // Loading bay
  "hangar:d2-HIDE-plant": { trace: { x0: 242, x1: 350, y0: 244, y1: 382 } }, // the plant (locked bay pictures v3: right of the bin)
  "hangar:d2-GRAB-copies": { trace: { x0: 178, x1: 248, y0: 304, y1: 390 } }, // the bin
  "hangar:d2-POST-mailbox": { trace: { x0: 834, x1: 920, y0: 368, y1: 486 } }, // the robot mailbox
  "hangar:d2-GO-door": { rect: { x0: 20, x1: 48, y0: 266, y1: 354 } }, // the doorway home
  "hangar:d2-ROLL-ball": { trace: { x0: 796, x1: 906, y0: 178, y1: 262 } }, // the big wall vent
  "hangar:d2-BOARD-scanner": { rect: { x0: 340, x1: 590, y0: 298, y1: 418 } }, // the scanner arch
};
