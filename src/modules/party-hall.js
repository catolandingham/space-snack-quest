/**
 * The party hall at night: where every fixed thing is in the locked hall picture v2 (docs/locked-rooms/
 * hall-room-empty-v2.png, 1280 x 830, unchanged), and where everyone stands (party plan, "The cast"). Game
 * positions (960 x 640): x is picture x times 0.75, y is picture y times 640 / 830. Nothing else types these numbers.
 */
export const HALL_PICTURE = "docs/locked-rooms/hall-room-empty-v2.png";
const PX = 960 / 1280,
  PY = 640 / 830;
const fromPicture = (x0, y0, x1, y1) => Object.freeze({ x0: x0 * PX, y0: y0 * PY, x1: x1 * PX, y1: y1 * PY });

export const HALL = Object.freeze({
  // The doorway home, in the front (bottom) wall, and the doorway to the hallway, in the right wall.
  homeDoor: fromPicture(572, 778, 700, 830),
  hallwayDoor: fromPicture(1235, 338, 1262, 443),
  // The red FUR / PULL DOWN alarm on the back wall by the hallway doorway, in picture pixels and game positions.
  alarmPicture: Object.freeze({ x0: 1168, y0: 188, x1: 1214, y1: 240 }),
  alarm: fromPicture(1168, 188, 1214, 240),
  stage: fromPicture(331, 318, 640, 380),
  bar: fromPicture(1085, 456, 1235, 785),
  vent: Object.freeze({ x: 251 * PX, y: 641 * PY }),
  // The two plants (both hide him): leaves, pot, and where his eyes show in the leaves (Brian C21, "The very original").
  plants: Object.freeze([
    Object.freeze({ id: "middle", leaves: fromPicture(533, 570, 645, 672), pot: fromPicture(560, 655, 622, 708), eyes: Object.freeze({ x: 441, y: 486 }) }),
    Object.freeze({ id: "back", leaves: fromPicture(90, 368, 180, 452), pot: fromPicture(112, 445, 160, 478), eyes: Object.freeze({ x: 101, y: 318 }) }),
  ]),
  // The floor's back edge (feet never stand on the window or the back wall) and the front wall.
  floorTop: 300,
  floorBottom: 612,
});

// Where Squatch stands: peeking (only his head and paws in the doorway gap), in his doorway (his whole body, the
// restart spot of the sneak), and by each plant to step into it.
export const SPOTS = Object.freeze({
  peek: Object.freeze({ x: 477, y: 646 }),
  doorway: Object.freeze({ x: 477, y: 590 }),
  plantMiddle: Object.freeze({ x: 396, y: 552 }),
  plantBack: Object.freeze({ x: 150, y: 384 }),
  // Under the wall alarm, where a guest who saw him runs to pull it; guards come in at the hallway doorway.
  alarmRun: Object.freeze({ x: 880, y: 318 }),
  guardIn: Object.freeze({ x: 950, y: 302 }),
  guardStep: Object.freeze({ x: 880, y: 320 }),
});

// The dance spotlight on the floor in front of the stage (party lighting, not an outline).
export const DANCE_SPOT = Object.freeze({ x: 470, y: 360, rx: 95, ry: 38 });
// The banner: one cloth over the stage, hanging from the ceiling in front of the window.
export const BANNER = Object.freeze({ x0: 200, x1: 528, y0: 92, y1: 152 });

/**
 * The cast at the party (feet, game positions). Guests are the six approved pictures (guests.js ids). `pair` names
 * who each guest dances with in P3 and P4 (the pairs Squatch watches from the plant). `face` is where they look
 * before the band plays: the stage, except the glancer, who also glances across the lane (P2).
 */
export const CAST = Object.freeze({
  isfred: Object.freeze({ x: 420, y: 258 }),
  isfredBar: Object.freeze({ x: 800, y: 330 }),
  band: Object.freeze([Object.freeze({ x: 258, y: 256 }), Object.freeze({ x: 308, y: 256 }), Object.freeze({ x: 358, y: 256 })]),
  guests: Object.freeze([
    Object.freeze({ id: "teal", x: 290, y: 390, pair: "stilt" }),
    Object.freeze({ id: "stilt", x: 336, y: 396, pair: "teal" }),
    Object.freeze({ id: "robot", x: 600, y: 380, pair: "octopus-guest" }),
    Object.freeze({ id: "octopus-guest", x: 646, y: 386, pair: "robot" }),
    Object.freeze({ id: "backpack", x: 600, y: 490, glancer: true }),
    Object.freeze({ id: "camera", x: 380, y: 430, tripod: Object.freeze({ x: 352, y: 436 }) }),
  ]),
  bartender: Object.freeze({ x: 890, y: 482 }),
});
// The glancer's look across the lane (radians; about 174 degrees, down and to the left), and how far it sweeps
// either side. Chosen so the lane between the door and the plant is covered while his doorway and the plant's left
// side, where Squatch steps in, are never in his cone (tests/party-scenes.mjs).
export const GLANCE = Object.freeze({ a: (174 * Math.PI) / 180, sweep: 0.15 });
// The glancer's rhythm (P2): facing the stage, then head turn with "?", then looking across the lane, then back.
export const GLANCE_TIMES = Object.freeze({ stage: 3.5, warn: 0.5, look: 2, back: 0.4 });

/** The cast as the sight code wants it: [{ id, x, y }]. */
export function castPeople(withBand = true) {
  const out = CAST.guests.map((g) => ({ id: g.id, x: g.x, y: g.y }));
  out.push({ id: "isfred", x: CAST.isfred.x, y: CAST.isfred.y });
  out.push({ id: "bartender", x: CAST.bartender.x, y: CAST.bartender.y });
  withBand && CAST.band.forEach((b, i) => out.push({ id: "band" + i, x: b.x, y: b.y }));
  return out;
}
