/**
 * ONE SCALE PER ROOM: a PROPOSAL, switched off (Brian, 2026-11-27: "scale people and room together right? Meaning in
 * the hall they'd be smaller and in the bedroom or office they'd be larger since it's smaller rooms?"). Not on until
 * Brian writes yes in the PR: it changes two approved numbers (docs/TUNING-PINS.json `adult-door-share` and
 * `hall-bigger`).
 *
 * Today a grown-up is 85% of the door in the room he stands in (room-sizes.js), the party hall 40% bigger again, home
 * a fixed 3 (00-core.js, pickup.js) and the vent room a fixed 4.2 for Mops (escape-place.js VENT_ROOM.scale). The
 * table below is how big Squatch is drawn in each room (his drawing's scale, his units to game pixels: today's
 * sqScale), one number per room, judged from stills of each locked room at phone size: the small rooms (home, the
 * office, the vent room) big, the big rooms (the party hall, the loading bay) small. Everyone else in a room follows
 * from it as today (a grown-up is Squatch / 0.8, Mops Squatch x 1.15).
 *
 *   room (game name)      today   proposed
 *   closet  (home)        3.00    3.00
 *   office                1.86    2.60   bigger: a small room (its desk and chair came to his shoulder)
 *   duct    (vent room)   3.65    3.65   (Mops 4.2, as today)
 *   passage (hallway)     1.86    1.86
 *   hall    (party hall)  1.65    1.30   smaller: the biggest room people walk about in
 *   hangar  (loading bay, the delivery room)  1.18  1.18
 *
 * The sheet that shows today beside the proposal: the PR (scratchpad r8-scale-sheet.jpg).
 */
export const ROOM_SCALE_ON = false;
export const ROOM_SCALE = Object.freeze({ closet: 3, office: 2.6, duct: 3.65, passage: 1.86, hall: 1.3, hangar: 1.18 });

let tableOn = ROOM_SCALE_ON;
/** Tools and tests only (the proposal's picture sheet): turn the table on or off in this page. */
export function showRoomScaleTable(on) {
  tableOn = !!on;
}
/** A grown-up's height in `room` from the table (Squatch's scale / 0.8 x 45), or null while the table is off. */
export function tableAdultPx(room) {
  const s = tableOn ? ROOM_SCALE[room] : 0;
  return s ? (s * 45) / 0.8 : null;
}
