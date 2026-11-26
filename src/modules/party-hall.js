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
// The banner: one cloth over the stage, hanging from the ceiling in front of the window. (16 higher since
// 2026-11-25: Isfred's antennae touched it once everyone was 40% bigger; tests/party-stage.mjs measures the gap.)
export const BANNER = Object.freeze({ x0: 200, x1: 528, y0: 74, y1: 140 });

/**
 * The cast at the party (feet, game positions). Guests are the six approved pictures (guests.js ids). `pair` names
 * who each guest dances with in P3 and P4 (the pairs Squatch watches from the plant). `face` is where they look
 * before the band plays: the stage, except the glancer, who also glances across the lane (P2).
 */
export const CAST = Object.freeze({
  isfred: Object.freeze({ x: 420, y: 258 }),
  // (18 further from the hallway doorway since everyone grew 40%, so a push back at the doorway lands clear of him)
  isfredBar: Object.freeze({ x: 780, y: 330 }),
  band: Object.freeze([Object.freeze({ x: 258, y: 256 }), Object.freeze({ x: 308, y: 256 }), Object.freeze({ x: 358, y: 256 })]),
  guests: Object.freeze([
    // Partners stand a step apart (72), so no one's body overlaps another's (tests/people-scale.mjs).
    // (The two pairs stand 100 further apart since the flyer sneak, Brian 2026-11-24: the open strip between them,
    // from the floor's front up to the stage's right end, is about 140 wide, 50 px on a phone. Before: 270, 342, 590, 662.)
    Object.freeze({ id: "teal", x: 220, y: 390, pair: "stilt" }),
    Object.freeze({ id: "stilt", x: 292, y: 396, pair: "teal" }),
    Object.freeze({ id: "robot", x: 640, y: 380, pair: "octopus-guest" }),
    Object.freeze({ id: "octopus-guest", x: 712, y: 386, pair: "robot" }),
    Object.freeze({ id: "backpack", x: 600, y: 490, glancer: true }),
    Object.freeze({ id: "camera", x: 400, y: 452 }),
  ]),
  bartender: Object.freeze({ x: 890, y: 482 }),
});
// The flyer sneak (P3 and P4; Brian 2026-11-24, "what if he just leaves one on the side of the stage"; moved
// 2026-11-25, his click "End of the bar, moving cones": "I was hoping that getting to it was more of a maze, so like
// he had navigate all the cones successfully as they're moving"). Isfred holds one flyer through his lines; he walks
// off the stage to his place at the bar's top end (`set`, his CAST.isfredBar), turns to the counter, bends and puts
// it down on the counter's far end (`x`, `y`, `size` across; `box` is the thing GRAB · flyer names), then stands
// there facing the room with his back to it. Squatch takes it from `reach` (within `r`), on the floor in front of
// the counter's end, between the two bar stools (clear of Isfred, who stands a little up the room). Times in seconds: Isfred's walk to the bar (`to`), the
// bend (`down`), Squatch's reach for it (`grab`), and putting it down at home (`put`). PLACEHOLDERS.
export const FLYER = Object.freeze({
  x: 838,
  y: 418,
  size: 34,
  box: Object.freeze({ x0: 816, x1: 860, y0: 392, y1: 442 }),
  reach: Object.freeze({ x: 788, y: 420, r: 30 }),
  set: CAST.isfredBar,
  hand: Object.freeze({ dx: 24, dy: -58, size: 24 }),
  to: 2.1,
  down: 0.8,
  grab: 0.45,
  put: 0.5,
});
/**
 * P4, the moving cones (Brian 2026-11-25): while the band plays, the dancing pairs turn on the spot, the glancer looks
 * round and the bartender looks up and down her bar, so their cones sweep slowly over the floor between the plant and
 * the flyer (the robot never looks up at the counter's end: where he stands to take it, nobody sees him); the camera
 * tourist films the band and Isfred looks into the room. Each sweeper's look is `base + amp * sin(2 pi t / period +
 * phase)` radians, `t` the seconds since P4 began (the same every play). tests/party-flyer.mjs searches the game's
 * own cones over time: from the plant, a kid who waits has a way to the flyer whenever he sets off, and walking
 * straight in from the start is caught. PLACEHOLDERS (numbers from that search).
 */
export const P4_SWEEP = Object.freeze({
  robot: Object.freeze({ base: 1.68, amp: 0.86, period: 8, phase: 6.23 }),
  "octopus-guest": Object.freeze({ base: 2.47, amp: 1.13, period: 9, phase: 3.83 }),
  backpack: Object.freeze({ base: -1.8, amp: 1.06, period: 10, phase: 3.29 }),
  bartender: Object.freeze({ base: 2.66, amp: 0.31, period: 6, phase: 5.7 }),
  teal: Object.freeze({ base: 0.3, amp: 0.6, period: 8, phase: 0.5 }),
  stilt: Object.freeze({ base: 2.84, amp: 0.6, period: 8, phase: 3.64 }),
});
/** Where a P4 sweeper looks `t` seconds into P4 (radians), or null for someone who does not sweep. */
export function sweepAngle(id, t) {
  const w = P4_SWEEP[id];
  return w ? w.base + w.amp * Math.sin((2 * Math.PI * t) / w.period + w.phase) : null;
}
// The glancer's look across the lane (radians; about 174 degrees, down and to the left), and how far it sweeps
// either side. Chosen so the lane between the door and the plant is covered while his doorway and the plant's left
// side, where Squatch steps in, are never in his cone (tests/party-scenes.mjs).
export const GLANCE = Object.freeze({ a: (174 * Math.PI) / 180, sweep: 0.15 });
// The glancer's rhythm (P2): facing the stage, then head turn with "?", then looking across the lane, then back.
export const GLANCE_TIMES = Object.freeze({ stage: 3.5, warn: 0.5, look: 2, back: 0.4 });

// Where feet cannot go in the party hall (one list for every scene; from P6 on the strip to the hallway opens): the stage, the
// snack bar with the wall past it, its two stools, and the two plant pots. People's feet are added by whoever stands
// there. (The camera's tripod is not in the hall until the group photo, Brian 2026-11-25.)
export const HALL_SOLIDS = Object.freeze([
  Object.freeze({ x0: 240, x1: 490, y0: 0, y1: 304 }),
  Object.freeze({ x0: 806, x1: 960, y0: 0, y1: 606 }),
  Object.freeze({ x0: 772, x1: 800, y0: 380, y1: 400 }),
  Object.freeze({ x0: 772, x1: 800, y0: 438, y1: 458 }),
  Object.freeze({ x0: 72, x1: 136, y0: 330, y1: 372 }),
  Object.freeze({ x0: 412, x1: 476, y0: 520, y1: 552 }),
]);
// Where the camera points: the middle of the stage; once the band plays (Isfred has left the stage), the Croc Boys.
export const CAMERA_AIM = Object.freeze({ x: 420, y: 280 });
export const BAND_AIM = Object.freeze({ x: 308, y: 228 });
// The octopus's spot by the snacks (P6): he strolls there from his dance spot and notices Squatch from there.
export const OCTOPUS_SNACKS = Object.freeze({ x: 724, y: 592 }); // the counter's front end, clear of where Squatch reaches in


// ---------- the party in disguise (P6) and the endings (P8): places on the same locked picture ----------
// The wall speaker on the back wall (picture 885 to 933, 135 to 184): the closing line comes from it.
export const HALL_SPEAKER = fromPicture(885, 135, 933, 184);
// Where the guests mill (P6): the dance floor, the bar and the photo spot, each a place a pair can stand in (the
// pair stands 36 either side of it). All clear of the vent, the door strip, the plant pots and the tripod.
export const MILL = Object.freeze([
  // (Spaced out on 2026-11-24, when everyone in the hall grew 40%: a pair in front never covers the pair behind.)
  Object.freeze({ id: "floor-left", x: 285, y: 400 }),
  Object.freeze({ id: "floor-right", x: 620, y: 392 }),
  Object.freeze({ id: "bar-top", x: 725, y: 388 }),
  Object.freeze({ id: "bar-low", x: 700, y: 494 }),
  Object.freeze({ id: "photo", x: 290, y: 524 }),
  Object.freeze({ id: "middle", x: 585, y: 506 }),
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
// The snack bar's pyramid (on the counter's front end) and where Squatch stands to reach into it.
export const PYRAMID = Object.freeze({ x: 868, y: 560 });
export const SNACK_SPOT = Object.freeze({ x: 780, y: 497, r: 60 });
// The hallway doorway's own floor (P6): walking in here he is in the doorway, and is bounced back a short way
// (party-hallway.js). It starts close to the doorway, so he visibly reaches it, and far enough from Isfred at the
// bar's top end that the push back never puts him on Isfred.
export const HALLWAY_ZONE = Object.freeze({ x0: 884, x1: 960, y0: 290, y1: 352 });
// The floor strip from the bar's top end to the hallway doorway (open in P6 to P8, so he can head for it).
export const HALLWAY_LANE = Object.freeze({ x0: 806, x1: 960, y0: 0, y1: 350 });
// Leaving at closing time (P8b): a walk to the hallway doorway, then out through it.
export const EXIT = Object.freeze([Object.freeze({ x: 880, y: 325 }), Object.freeze({ x: 990, y: 310 })]);
// The way into the strip to the hallway doorway, behind Isfred at the bar's top end: everyone leaving from the floor or
// the stage comes here first, so nobody cuts across the bar counter.
export const EXIT_LANE_MOUTH = Object.freeze({ x: 760, y: 300 });
// Mops at closing time (P8b): he comes in from the hallway mopping, and stops here, facing the room.
export const MOPS_IN = Object.freeze({ from: Object.freeze({ x: 990, y: 320 }), at: Object.freeze({ x: 700, y: 400 }) });

// ---------- the home room (locked home picture v6, game positions): one table for every party file ----------
export const HOME_ROOM = Object.freeze({
  doorSpot: Object.freeze({ x: 858, y: 470 }), // walking here takes him out through his door
  doorIn: Object.freeze({ x: 905, y: 470 }), // just inside the door in the right wall
  doorStep: Object.freeze({ x: 840, y: 470 }), // the step before the door, on his way out to the party
  inside: Object.freeze({ x: 790, y: 480 }),
  runTo: Object.freeze({ x: 660, y: 545 }),
  inFront: Object.freeze({ x: 330, y: 410 }), // just right of the bed, clear of it (not on its head end)
  bed: Object.freeze({ x: 205, y: 500 }),
  // the flyer under his bed for Mops (Brian 2026-11-25): a corner peeks out at the crate bed's front right; he
  // stands at `saveAt` (right of it, facing it) to slide it under, and to take it back out in the talk
  flyer: Object.freeze({ x: 270, y: 556 }),
  saveAt: Object.freeze({ x: 350, y: 560 }),
  guardDoor: Object.freeze({ x: 880, y: 470 }), // where a guard comes in, and where he searches from
  guardLook: Object.freeze({ x: 770, y: 470 }),
  mopsDoor: Object.freeze({ x: 935, y: 470 }), // Mops comes in here, inside the picture
  mopsInside: Object.freeze({ x: 850, y: 472 }),
});
// The doorway home in the hall, as a trigger: within `r` of the door spot (SPOTS.doorway) he goes through.
export const HALL_DOOR = Object.freeze({ x: SPOTS.doorway.x, y: SPOTS.doorway.y, r: 36 });

/** Moves `o` toward (x, y) at `speed` for `dt` seconds; true once there. */
export function stepTo(o, x, y, speed, dt) {
  const dx = x - o.x,
    dy = y - o.y,
    d = Math.hypot(dx, dy),
    k = speed * dt;
  if (d <= k || d < 0.5) return ((o.x = x), (o.y = y), true);
  o.x += (dx / d) * k;
  o.y += (dy / d) * k;
  return false;
}

/**
 * Like stepTo, but nobody walks into or through Squatch (`s`): a step that would come within `clear` of him, and
 * closer than before, goes round him instead (sideways, on the side toward the place), and if the place itself is
 * that close to him, the walker waits there for him to move. True once there. Someone in front of him (lower on the
 * picture) is taller than him and would hide him sooner, so in front the distance counts as `FRONT` of itself:
 * they keep about 1.7 times further off there.
 */
const FRONT = 0.6;
// PLACEHOLDER for Brian: how far everyone walking keeps from Squatch (game pixels, side on; further in front).
// (56 since everyone in the hall is 40% bigger, Brian 2026-11-24; it was 40.)
export const CLEAR_OF_SQUATCH = 56;
export function stepClear(o, x, y, speed, dt, s, clear, above = false) {
  const sc = (v) => (v > s.y ? s.y + (v - s.y) * FRONT : v),
    un = (v) => (v > s.y ? s.y + (v - s.y) / FRONT : v),
    far = (px, py) => Math.hypot(px - s.x, sc(py) - s.y);
  const ox = o.x,
    oy = o.y,
    d0 = far(ox, oy);
  const there = stepTo(o, x, y, speed, dt),
    d1 = far(o.x, o.y);
  if (d1 >= clear || d1 >= d0) return ((o.round = 0), there);
  o.x = ox;
  o.y = oy;
  if (far(x, y) < clear) return false;
  // go round him, in the space where "in front" counts less
  const py = sc(oy),
    ux = (ox - s.x) / (d0 || 1),
    uy = (py - s.y) / (d0 || 1),
    // the side is kept until they are past him, so nobody dithers when he stands right on their way
    // (`above`: always go round behind him, up the picture, for someone with a counter beside him: up first, then
    // across toward the place once behind him)
    side = above ? (uy < -0.3 ? Math.sign(x - ox) || 1 : -(Math.sign(ux) || 1)) : (o.round = o.round || (-uy * (x - ox) + ux * (sc(y) - py) >= 0 ? 1 : -1)),
    k = speed * dt;
  let nx = ox - uy * side * k,
    ny = py + ux * side * k;
  const dn = Math.hypot(nx - s.x, ny - s.y) || 1,
    r = Math.min(clear, d0 + k);
  dn < r && ((nx = s.x + ((nx - s.x) / dn) * r), (ny = s.y + ((ny - s.y) / dn) * r));
  // back in game pixels: never faster than walking (the squashed space would stretch the step in front of him)
  let mx = nx - ox,
    my = un(ny) - oy;
  const len = Math.hypot(mx, my);
  len > k && ((mx = (mx / len) * k), (my = (my / len) * k));
  // a shortened step that would still come closer than before and inside the zone: wait instead
  if (far(ox + mx, oy + my) < Math.min(clear, d0)) return false;
  o.x = ox + mx;
  o.y = oy + my;
  return false;
}
