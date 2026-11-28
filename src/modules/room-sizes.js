/**
 * How tall people are drawn in each room (moved here from src/game/12-ch1-redesign.js on 2026-11-25, Brian's
 * "1": the party branch's new logic lives in modules; the older program asks through window.SSQ).
 * A grown-up's head height is 85% of the door in the room he is standing in, except in the party hall (room
 * "hall"), where everyone is 40% bigger: 119% of its doorway (Brian 2026-11-24, after the 100/120/140 mock-ups:
 * "40% is what I meant!!"). HALL_BIGGER is the one number for that; no other room uses it.
 *   Hall and loading-bay openings measure 101px on the 830-tall picture (77.9px on the canvas).
 *   The office door and the same door in the hallway are a 160px slab (123.4px on the canvas).
 *   Home's right-wall opening is the 129px cut. A room with no door uses the hall.
 * Alien heads are that height / 84. Qt heads are that height / 50. Squatch is 80% of the adult, / 45.
 */
import { tableAdultPx } from "./room-scale.js";

export const CANVAS_DOOR_PX = Object.freeze({
  hall: 101 * (640 / 830),
  hallway: 160 * (640 / 830),
  office: 160 * (640 / 830),
  delivery: 101 * (640 / 830),
  home: 129 * (640 / 830),
});
export const HALL_BIGGER = 1.4;

// The door a room measures against (the older program's room names).
function roomDoorId(room) {
  return room === "passage" ? "hallway" : room === "hangar" ? "delivery" : room === "closet" ? "home" : room === "office" ? "office" : "hall";
}

/** 85% of the door of `room` (a room with no door of its own measures against the hall's doorway). */
export function doorAdultPx(room) {
  const id = CANVAS_DOOR_PX[room] ? room : roomDoorId(room);
  return (CANVAS_DOOR_PX[id] || CANVAS_DOOR_PX.hall) * 0.85;
}

/** How tall a grown-up is drawn in `room`: 85% of its door, and in the hall itself HALL_BIGGER times that. */
export function adultPxFor(room) {
  // (the one-scale-per-room proposal, room-scale.js: off until Brian's yes)
  const t = tableAdultPx(room);
  if (t) return t;
  return doorAdultPx(room) * (room === "hall" ? HALL_BIGGER : 1);
}
