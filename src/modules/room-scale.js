/**
 * ONE SCALE PER ROOM, switched ON (Brian, 2026-11-27: "scale people and room together right? Meaning in the hall
 * they'd be smaller and in the bedroom or office they'd be larger since it's smaller rooms?"; and on PR #103, the
 * same day: "Yes, turn it on"). It retires two approved numbers (docs/TUNING-PINS.json `adult-door-share` and
 * `hall-bigger`; DECISIONS.md); the table below is the pin now (`room-scale-table`).
 *
 * Before the table, a grown-up is 85% of the door in the room he stands in (room-sizes.js), the party hall 40% bigger again, home
 * a fixed 3 (00-core.js, pickup.js) and the vent room a fixed 4.2 for Mops (escape-place.js VENT_ROOM.scale). The
 * table below is how big Squatch is drawn in each room (his drawing's scale, his units to game pixels: today's
 * sqScale), one number per room, judged from stills of each locked room at phone size: the small rooms (home, the
 * office, the vent room) big, the big rooms (the party hall, the loading bay) small. Everyone else in a room follows
 * from it as today (a grown-up is Squatch / 0.8, Mops Squatch x 1.15).
 *
 *   room (game name)      before  the table
 *   closet  (home)        3.00    3.00
 *   office                1.86    2.60   bigger: a small room (its desk and chair came to his shoulder)
 *   duct    (vent room)   3.65    3.65   (Mops 4.2, as today)
 *   passage (hallway)     1.86    1.86
 *   hall    (party hall)  1.65    1.30   smaller: the biggest room people walk about in
 *   hangar  (loading bay, the delivery room)  1.18  1.18
 *
 * The sheet Brian said yes to (the old sizes beside the table, at phone size): PR #103.
 */
export const ROOM_SCALE_ON = true;
export const ROOM_SCALE = Object.freeze({ closet: 3, office: 2.6, duct: 3.65, passage: 1.86, hall: 1.3, hangar: 1.18 });

let tableOn = ROOM_SCALE_ON;
/** Tools and tests only: turn the table on or off in this page (people sized at load keep the size they had). */
export function showRoomScaleTable(on) {
  tableOn = !!on;
}
/** A grown-up's height in `room` from the table (Squatch's scale / 0.8 x 45), or null while the table is off. */
export function tableAdultPx(room) {
  const s = tableOn ? ROOM_SCALE[room] : 0;
  return s ? (s * 45) / 0.8 : null;
}
