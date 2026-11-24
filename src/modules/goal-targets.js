/**
 * What the yellow outline goes round for each Chapter 1 goal, keyed "room:spot id" (the spot the goal's
 * action comes from). Positions are game positions (960 x 640), read off the locked room pictures.
 *   trace: the thing inside this box is traced from the locked picture (the box must be a little bigger
 *          than the thing and must not touch any other line).
 *   rect:  a doorway or opening, or a flat rectangle on a wall: the dashed line goes round this box.
 * A goal with no entry gets no outline (optional things, close-ups, and props the game draws itself,
 * which are still to do: see README "Brian's repeat complaints, as tests").
 */
// Doorways more than one goal outlines: each typed once.
const HOME_DOOR = { rect: { x0: 912, x1: 940, y0: 358, y1: 468 } }, // home: the doorway in the right wall
  HALL_HOME_DOOR = { rect: { x0: 426, x1: 528, y0: 600, y1: 622 } }; // the hall: the doorway home, in the front wall
export const GOAL_TARGETS = {
  // Home
  "closet:peek": HOME_DOOR,
  "closet:hidebed": { trace: { x0: 76, x1: 294, y0: 390, y1: 552 } }, // the bed
  "closet:homework": { trace: { x0: 396, x1: 522, y0: 238, y1: 352 } }, // the desk (home alone: do your homework)
  "closet:dress": { trace: { x0: 30, x1: 172, y0: 188, y1: 352 } }, // the closet (party P5: dress up)
  "closet:go-party": HOME_DOOR, // party P5, dressed: out through it
  "closet:d2-PUT-box": { trace: { x0: 30, x1: 172, y0: 188, y1: 352 } }, // the wardrobe (the box is in it)
  "closet:d2-LOOK-calendar": { rect: { x0: 99, x1: 167, y0: 196, y1: 279 } }, // the calendar on the wardrobe door
  // Party hall
  "hall:hide": { trace: { x0: 392, x1: 494, y0: 432, y1: 556 } }, // the plant in the middle (party sneak)
  "hall:go-home": HALL_HOME_DOOR, // party P4, and the alarm
  "hall:d2-HIDE-plant": { trace: { x0: 392, x1: 494, y0: 432, y1: 556 } }, // the same plant (Day 2)
  "hall:d2-SNEAK-hallway": { rect: { x0: 912, x1: 940, y0: 257, y1: 345 } }, // the doorway to the hallway (hall v2, back corner)
  "hall:d2-GO-home": HALL_HOME_DOOR,
  // Hallway
  "passage:d2-GO-hall": { rect: { x0: 20, x1: 48, y0: 266, y1: 354 } }, // the doorway to the hall (left; the walk uses it)
  "passage:d2-GO-ship": { rect: { x0: 912, x1: 940, y0: 266, y1: 354 } }, // the doorway to the loading bay
  // Loading bay
  "hangar:d2-HIDE-plant": { trace: { x0: 70, x1: 180, y0: 244, y1: 382 } },
  "hangar:d2-GRAB-copies": { trace: { x0: 178, x1: 248, y0: 304, y1: 390 } }, // the bin
  "hangar:d2-POST-mailbox": { trace: { x0: 834, x1: 920, y0: 368, y1: 486 } }, // the robot mailbox
  "hangar:d2-GO-door": { rect: { x0: 20, x1: 48, y0: 266, y1: 354 } }, // the doorway home
  "hangar:d2-ROLL-ball": { trace: { x0: 796, x1: 906, y0: 178, y1: 262 } }, // the big wall vent
  "hangar:d2-BOARD-scanner": { rect: { x0: 340, x1: 590, y0: 298, y1: 418 } }, // the scanner arch
};
