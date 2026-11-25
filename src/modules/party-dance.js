/**
 * The dance (party plan P6, "Dance"; Brian 2026-11-23 on the old arrow game: "It's way too fast ... it should be
 * full screen"; Brian 2026-11-24: "different parts of his body are lighting up ... you have to touch each part of
 * his body where he needs to put his hand", then: "can we have it that you can get a certain number of points for
 * doing macarena correctly? And if you don't click the right spot within a certain time period you lose it?" and,
 * on a miss, "Lose that spot, keep dancing").
 *
 * DANCE · circle in the spotlight opens it full screen. One spot on his body glows, with a ring closing round it:
 * the ring is the time left. Tap the spot before the ring closes and he puts his paw there, strikes that pose and
 * scores a few stars, shown by the spot. Too slow, or a tap somewhere else on him: no stars for that spot, a short
 * funny stumble, and the next spot glows. A tap that is not on him does nothing. A routine is eight spots, in a
 * different order for each of the three songs; every spot hit is a bonus and the big cheer, a routine with a miss
 * ends with a smaller cheer, and then it goes round again until the song ends or he closes it. A miss never ends
 * the dance. It reads with the sound off: the glow, the ring, the "+5", the stumble and the cheer are all drawn.
 *
 * This file is the rules and the numbers (no drawing, no browser): party-dance-art.js draws it and
 * party-dance-play.js gives the stars and plays the sounds.
 */
import { armEnds, SQUATCH_LOOK } from "./squatch-art.js";

// `least`, `cheerFade`, `cheerPerMove`, `clap`: as before (the shortest dance, how the crowd's cheer fades and
// grows, how long the guests clap back in the hall).
// NEW PLACEHOLDERS for Brian (2026-11-24; not approved pins):
//   spotSeconds   how long he has to tap a glowing spot (the ring closes over this long)
//   spotStars     stars for a spot tapped in time
//   perfectStars  the bonus for a routine with every spot tapped in time
//   first, hold, stumble, bigCheer, smallCheer   the pauses: before the first spot, after a hit (the pose is held),
//                 the stumble after a miss, the cheer after a whole routine (big with no miss, smaller with one)
//   tried         the dance counts as tried once he has hit this many spots (it was "three moves")
// THE CAP (placeholder too): in each of the three songs the dance pays for one routine's worth of spots (eight)
// and one bonus, however long he dances; a new song pays again. So the most a party's dancing can pay is
// 3 x (8 x 5 + 25) = 195 stars, and dancing on never farms more.
export const DANCE = Object.freeze({ least: 12, cheerFade: 0.35, cheerPerMove: 0.18, clap: 2.5, spotSeconds: 2.5, spotStars: 5, perfectStars: 25, first: 0.9, hold: 0.5, stumble: 0.9, bigCheer: 2, smallCheer: 1.2, tried: 3 });
// The room's light for each of the three songs (party plan V10): pink, teal, amber.
export const SONG_LIGHTS = Object.freeze(["rgba(255,95,168,.16)", "rgba(43,196,170,.16)", "rgba(255,190,60,.18)"]);

// The spots on his body, in his own units (feet at 0, up is negative, x to the right of the screen), each where
// his paw can reach. `r` is how big a spot's glow and target are.
export const SPOT_R = 4.8;
export const SPOTS = Object.freeze({
  headL: Object.freeze({ x: -15, y: -31 }),
  headR: Object.freeze({ x: 15, y: -31 }),
  shoulderL: Object.freeze({ x: -12, y: -19 }),
  shoulderR: Object.freeze({ x: 12, y: -19 }),
  belly: Object.freeze({ x: 0, y: -13 }),
  hipL: Object.freeze({ x: -10, y: -7 }),
  hipR: Object.freeze({ x: 10, y: -7 }),
});
// One routine for each song: eight spots, never the same spot twice running (nor from its end to its start).
export const ROUTINES = Object.freeze([
  Object.freeze(["headR", "shoulderR", "hipR", "belly", "hipL", "shoulderL", "headL", "belly"]),
  Object.freeze(["headL", "headR", "shoulderL", "shoulderR", "hipL", "hipR", "belly", "headR"]),
  Object.freeze(["hipL", "shoulderR", "belly", "headL", "hipR", "shoulderL", "headR", "belly"]),
]);
export const ROUTINE_LENGTH = ROUTINES[0].length;

// ---------- his poses ----------
const Q = Math.PI / 2,
  ARM = SQUATCH_LOOK.arm;
/**
 * The arm ({ a, bend }, as squatch-art.js armEnds reads it) that puts the paw of his left (0) or right (1) arm on
 * the point (x, y) of his own body; out of reach, the arm stretches straight toward it. `out` picks which way the
 * elbow sticks (1 away from his body, -1 across it).
 */
export function armTo(side, x, y, out = 1) {
  const sh = armEnds([{ a: 0 }, { a: 0 }])[side].shoulder,
    dx = x - sh.x,
    dy = y - sh.y,
    d = Math.hypot(dx, dy),
    to = Math.atan2(dx, dy);
  if (d >= ARM - 0.01) return { a: to };
  const k = Math.acos(d / ARM) * (side === 1 ? 1 : -1) * out;
  return { a: to + k, bend: -2 * k };
}
const on = (side, spot, out) => armTo(side, SPOTS[spot].x, SPOTS[spot].y, out);
/**
 * His poses, each a drawing of its own: one for every spot (the paw of that side on the spot, the other arm doing
 * something different each time), then standing ready, the stumble and the cheer. `arms` is [left, right] as
 * armEnds reads them (null: at rest); `rot` leans him. They are his only arms: a pose replaces the arms at rest.
 */
export const POSES = Object.freeze([
  { id: "headL", rot: -0.07, arms: [on(0, "headL"), { a: Math.PI - 0.7 }] }, // left paw to his head, right arm thrown up
  { id: "headR", rot: 0.07, arms: [{ a: -Q }, on(1, "headR")] }, // right paw to his head, left arm straight out
  { id: "shoulderL", rot: 0.04, arms: [on(0, "shoulderL"), { a: 0.9 }] }, // left paw on his shoulder, right arm low and out
  { id: "shoulderR", rot: -0.04, arms: [{ a: -Q, bend: -Q }, on(1, "shoulderR")] }, // right paw on his shoulder, left arm flexed up
  { id: "belly", rot: 0, arms: [on(0, "hipL"), on(1, "belly", -1)] }, // right paw on his belly, left paw on his hip
  { id: "hipL", rot: 0.06, arms: [on(0, "hipL"), { a: Q }] }, // left paw on his hip, right arm straight out
  { id: "hipR", rot: -0.06, arms: [{ a: -(Math.PI - 0.6) }, on(1, "hipR")] }, // right paw on his hip, left arm waving high
  { id: "ready", rot: 0, arms: null },
  { id: "stumble", rot: 0, arms: [{ a: -2.2, bend: 0.9 }, { a: 2.5, bend: 1.1 }] }, // arms flailing
  { id: "cheer", rot: 0, arms: [{ a: -(Math.PI - 0.45) }, { a: Math.PI - 0.45 }] }, // both arms up
]);
export const poseIndex = (id) => POSES.findIndex((q) => q.id === id);
const READY = poseIndex("ready"),
  STUMBLE = poseIndex("stumble"),
  CHEER = poseIndex("cheer");

// ---------- the dance ----------
/** A new dance: standing ready, a quiet crowd, the first spot about to glow. */
export function newDance() {
  return { moves: 0, cheer: 0.2, t: 0, pop: 0, song: 0, i: 0, round: 0, missed: 0, marks: [], live: false, left: 0, hold: DANCE.first, pose: READY, stumble: 0, party: 0, big: false, fx: [] };
}
/** The routine of the song the dance is on. */
export const routineOf = (d) => ROUTINES[(d.song || 0) % ROUTINES.length];
/** The spot glowing now ("" while he holds a pose, stumbles or is cheered). */
export const spotNow = (d) => (d && d.live ? routineOf(d)[d.i] : "");
/** How much of the time to tap the glowing spot is left, 1 down to 0 (the ring is drawn from this). */
export const ringLeft = (d) => (d && d.live ? Math.max(0, d.left / DANCE.spotSeconds) : 0);
/** The timer ring's radius round a spot of radius `r`: it closes from well outside the spot down onto it. */
export const ringRadius = (r, left) => r * (1 + 1.3 * Math.max(0, Math.min(1, left)));
/** True once he has hit enough spots for the dance to count as tried. */
export const danceTried = (d) => !!d && d.moves >= DANCE.tried;
/** The pose he is in now: the stumble, the cheer, or the pose of the last spot he hit. */
export function poseNow(d) {
  if (!d) return POSES[READY];
  if (d.stumble > 0) return POSES[STUMBLE];
  if (d.party > 0) return POSES[CHEER];
  return POSES[d.pose == null ? (d.moves || 0) % POSES.length : d.pose] || POSES[READY];
}
// The spot is done (hit or missed): the next one glows after `wait`; after the last, the routine's cheer first.
function next(d, wait, ev) {
  d.live = false;
  d.seen = null;
  d.i += 1;
  if (d.i >= ROUTINE_LENGTH) {
    d.big = d.missed === 0;
    d.party = d.big ? DANCE.bigCheer : DANCE.smallCheer;
    d.cheer = d.big ? 1.6 : 0.9;
    d.i = 0;
    d.round += 1;
    d.missed = 0;
    wait += d.party;
    ev.push(d.big ? "perfect" : "round");
  }
  d.hold = wait;
}
function hit(d) {
  const spot = spotNow(d),
    ev = ["hit"];
  d.moves += 1;
  d.marks.push(1);
  d.pose = poseIndex(spot);
  d.pop = 1;
  d.cheer = Math.min(1, d.cheer + DANCE.cheerPerMove);
  d.fx.push({ kind: "hit", spot, t: 0, stars: 0 });
  next(d, DANCE.hold, ev);
  return ev;
}
function miss(d, why) {
  const ev = [why];
  d.marks.push(-1);
  d.missed += 1;
  d.stumble = DANCE.stumble;
  d.fx.push({ kind: "miss", spot: spotNow(d), t: 0 });
  next(d, DANCE.stumble, ev);
  return ev;
}
/**
 * One frame. Returns what happened, as a list: "slow" (the ring closed: that spot is lost), then perhaps "round"
 * (the routine is over, with a miss in it) — a "perfect" routine can only end on a tap.
 */
export function tickDance(d, dt) {
  const ev = [];
  d.t += dt;
  d.cheer = Math.max(0.2, d.cheer - DANCE.cheerFade * dt);
  d.pop = Math.max(0, d.pop - dt * 4);
  d.fx = d.fx.filter((f) => (f.t += dt) < 1.1);
  if (d.stumble > 0) d.stumble = Math.max(0, d.stumble - dt);
  else if (d.party > 0) d.party = Math.max(0, d.party - dt);
  if (!d.live) {
    d.hold -= dt;
    if (d.hold <= 0) {
      // the next spot glows; a new routine starts with a clean row of marks
      d.i === 0 && d.marks.length >= ROUTINE_LENGTH && (d.marks = []);
      d.live = true;
      d.left = DANCE.spotSeconds;
    }
    return ev;
  }
  d.left -= dt;
  d.left <= 0 && ev.push(...miss(d, "slow"));
  return ev;
}

// ---------- where things are on the screen ----------
/** How big the dance draws things on a `w` x `h` screen (one unit of the crowd's and the band's sizes). */
export const unit = (w, h) => Math.min(w / 90, h / 120);
// How big he is drawn (in the crowd's units), and the smallest a spot's target may be on the screen (48 px across).
const BIG = 1.5,
  SMALLEST = 24;
/** Where Squatch stands in the dance on a `w` x `h` screen: his feet, his scale, his lean, and his pose now. */
export function danceSquatch(w, h, d) {
  const pose = poseNow(d);
  return { x: w / 2, y: h * 0.9, scale: unit(w, h) * BIG * (1 + (d && d.pop ? d.pop : 0) * 0.05), rot: pose.rot, pose };
}
/** A point of his body (his own units) on the screen, for where he stands (`at`, from danceSquatch). */
export function onScreen(at, x, y) {
  return { x: at.x + (x * Math.cos(at.rot) - y * Math.sin(at.rot)) * at.scale, y: at.y + (x * Math.sin(at.rot) + y * Math.cos(at.rot)) * at.scale };
}
/** A spot's place and size on the screen: { x, y, r }. The target is never under 44 pixels across. */
export function spotOnScreen(w, h, d, spot) {
  const at = danceSquatch(w, h, { ...d, pop: 0 }),
    s = SPOTS[spot];
  return { ...onScreen(at, s.x, s.y), r: Math.max(SMALLEST, SPOT_R * at.scale) };
}
/** The same spot on him standing straight (where a "+5" or a cross is shown, whatever he is doing by then). */
export function spotStanding(w, h, spot) {
  const at = danceSquatch(w, h, null);
  return { ...onScreen({ ...at, rot: 0 }, SPOTS[spot].x, SPOTS[spot].y), r: Math.max(SMALLEST, SPOT_R * at.scale) };
}
/** True when the screen point (x, y) is on him (his head and what he wears on it, his body, his legs). */
export function onHim(w, h, d, x, y) {
  const at = danceSquatch(w, h, { ...d, pop: 0 }),
    dx = (x - at.x) / at.scale,
    dy = (y - at.y) / at.scale,
    ux = dx * Math.cos(at.rot) + dy * Math.sin(at.rot),
    uy = -dx * Math.sin(at.rot) + dy * Math.cos(at.rot),
    inside = (cx, cy, rx, ry) => ((ux - cx) / rx) ** 2 + ((uy - cy) / ry) ** 2 <= 1;
  return inside(0, -37, 18, 21) || inside(0, -14, 15, 10) || (Math.abs(ux) <= 8 && uy >= -8 && uy <= 3);
}
/**
 * A tap on the dance at screen point (x, y). Returns what happened, as a list: "hit" (the glowing spot, in time),
 * or "wrong" (somewhere else on him: that spot is lost), each perhaps followed by "perfect" or "round" when that
 * was the routine's last spot; or nothing (not on him, or no spot is glowing).
 */
export function danceTap(d, x, y, w, h) {
  const spot = spotNow(d);
  if (!spot) return [];
  const s = spotOnScreen(w, h, d, spot);
  if (Math.hypot(x - s.x, y - s.y) <= s.r) return hit(d);
  return onHim(w, h, d, x, y) ? miss(d, "wrong") : [];
}
/**
 * The stars a hit or a bonus pays, under the cap. `pay` is the party's record of what the dance has paid in each
 * song ({ [song]: { spots, bonus } }); it is changed. `what` is "hit" or "perfect".
 */
export function dancePays(pay, song, what) {
  const rec = pay[song] || (pay[song] = { spots: 0, bonus: false });
  if (what === "hit" && rec.spots < ROUTINE_LENGTH) return ((rec.spots += 1), DANCE.spotStars);
  if (what === "perfect" && !rec.bonus) return ((rec.bonus = true), DANCE.perfectStars);
  return 0;
}

/** The dance's way out (the review of PR #87): a close button in the top-right corner, a 44-pixel target or more. */
export function danceClose(w) {
  return { x: w - 36, y: 36, r: 28 };
}
