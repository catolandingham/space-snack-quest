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
});

// The dance spotlight on the floor in front of the stage (party lighting, not an outline).
export const DANCE_SPOT = Object.freeze({ x: 470, y: 360, rx: 95, ry: 38 });
// The banner: one cloth over the stage, hanging from the ceiling in front of the window.
export const BANNER = Object.freeze({ x0: 200, x1: 528, y0: 90, y1: 156 });

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
    // Partners stand a step apart (72), so no one's body overlaps another's (tests/people-scale.mjs).
    Object.freeze({ id: "teal", x: 270, y: 390, pair: "stilt" }),
    Object.freeze({ id: "stilt", x: 342, y: 396, pair: "teal" }),
    Object.freeze({ id: "robot", x: 590, y: 380, pair: "octopus-guest" }),
    Object.freeze({ id: "octopus-guest", x: 662, y: 386, pair: "robot" }),
    Object.freeze({ id: "backpack", x: 600, y: 490, glancer: true }),
    Object.freeze({ id: "camera", x: 400, y: 452, tripod: Object.freeze({ x: 372, y: 458 }) }),
  ]),
  bartender: Object.freeze({ x: 890, y: 482 }),
});
// The glancer's look across the lane (radians; about 174 degrees, down and to the left), and how far it sweeps
// either side. Chosen so the lane between the door and the plant is covered while his doorway and the plant's left
// side, where Squatch steps in, are never in his cone (tests/party-scenes.mjs).
export const GLANCE = Object.freeze({ a: (174 * Math.PI) / 180, sweep: 0.15 });
// The glancer's rhythm (P2): facing the stage, then head turn with "?", then looking across the lane, then back.
export const GLANCE_TIMES = Object.freeze({ stage: 3.5, warn: 0.5, look: 2, back: 0.4 });

// Where feet cannot go in the party hall (one list for every scene; from P6 on the strip to the hallway opens): the stage, the
// snack bar with the wall past it, its two stools, the two plant pots, and the camera's tripod. People's feet are
// added by whoever stands there.
export const HALL_SOLIDS = Object.freeze([
  Object.freeze({ x0: 240, x1: 490, y0: 0, y1: 304 }),
  Object.freeze({ x0: 806, x1: 960, y0: 0, y1: 606 }),
  Object.freeze({ x0: 772, x1: 800, y0: 380, y1: 400 }),
  Object.freeze({ x0: 772, x1: 800, y0: 438, y1: 458 }),
  Object.freeze({ x0: 72, x1: 136, y0: 330, y1: 372 }),
  Object.freeze({ x0: 412, x1: 476, y0: 520, y1: 552 }),
  Object.freeze({ x0: 360, x1: 386, y0: 447, y1: 468 }),
]);
// Where the camera points: the middle of the stage, where the band plays.
export const CAMERA_AIM = Object.freeze({ x: 420, y: 280 });
// The octopus's spot by the snacks (P6): he strolls there from his dance spot and notices Squatch from there.
export const OCTOPUS_SNACKS = Object.freeze({ x: 760, y: 555 });


// ---------- the party in disguise (P6) and the endings (P8): places on the same locked picture ----------
// The wall speaker on the back wall (picture 885 to 933, 135 to 184): the closing line comes from it.
export const HALL_SPEAKER = fromPicture(885, 135, 933, 184);
// Where the guests mill (P6): the dance floor, the bar and the photo spot, each a place a pair can stand in (the
// pair stands 36 either side of it). All clear of the vent, the door strip, the plant pots and the tripod.
export const MILL = Object.freeze([
  Object.freeze({ id: "floor-left", x: 300, y: 405 }),
  Object.freeze({ id: "floor-right", x: 610, y: 400 }),
  Object.freeze({ id: "bar-top", x: 720, y: 405 }),
  Object.freeze({ id: "bar-low", x: 700, y: 510 }),
  Object.freeze({ id: "photo", x: 305, y: 478 }),
  Object.freeze({ id: "middle", x: 560, y: 470 }),
]);
// The conga line's loop round the floor (P6). It passes near the vent once (the third point), so staying in the
// line is not free.
export const CONGA_ROUTE = Object.freeze([
  Object.freeze({ x: 330, y: 405 }),
  Object.freeze({ x: 250, y: 440 }),
  Object.freeze({ x: 240, y: 515 }),
  Object.freeze({ x: 320, y: 545 }),
  Object.freeze({ x: 380, y: 505 }),
  Object.freeze({ x: 540, y: 490 }),
  Object.freeze({ x: 600, y: 430 }),
  Object.freeze({ x: 470, y: 415 }),
]);
// The band photo: the floor between the camera's lens and the stage. Standing here when the flash goes, Squatch
// is in the picture.
export const PHOTO_FRAME = Object.freeze({ x0: 390, x1: 450, y0: 330, y1: 400 });
// The snack bar's pyramid (on the counter's front end) and where Squatch stands to reach into it.
export const PYRAMID = Object.freeze({ x: 868, y: 560 });
export const SNACK_SPOT = Object.freeze({ x: 770, y: 540, r: 60 });
// The floor in front of the hallway doorway (P6): walking in here, he meets Mops's beard and steps back.
export const HALLWAY_ZONE = Object.freeze({ x0: 850, x1: 960, y0: 290, y1: 352 });
export const HALLWAY_BACK = Object.freeze({ x: 812, y: 322 });
// The floor strip from the bar's top end to the hallway doorway (open in P6 to P8, so he can head for it).
export const HALLWAY_LANE = Object.freeze({ x0: 806, x1: 960, y0: 0, y1: 350 });
// Leaving at closing time (P8b): a walk to the hallway doorway, then out through it.
export const EXIT = Object.freeze([Object.freeze({ x: 880, y: 325 }), Object.freeze({ x: 990, y: 310 })]);
// Mops at closing time (P8b): he comes in from the hallway mopping, and stops here, facing the room.
export const MOPS_IN = Object.freeze({ from: Object.freeze({ x: 990, y: 320 }), at: Object.freeze({ x: 700, y: 400 }) });
