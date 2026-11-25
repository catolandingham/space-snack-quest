/**
 * The group photo (Brian 2026-11-24: "maybe it's a group photo. There's room in front of the wall next to the fire
 * alarm, and maybe the band's in it"; his click "Guests and the band"; it replaces the looping camera and plan
 * decision 16, "the photo is of the band"). One clear moment, once a party, when the first song ends:
 *   gather   the guests walk into two rows in front of the back wall beside the alarm box, the Croc Boys walk off
 *            the stage's end and squeeze in, and the camera tourist carries his tripod over and faces the wall;
 *   settle   a moment for the kid: JOIN · photo marks the gap left for Squatch in the front row;
 *   count    "Say cheese!", three red lights on the camera, a beep each second: 3, 2, 1;
 *   flash    the click: a small burst at the lens. In his place, the photo has him in it (+25, once): the whole
 *            screen shows the Polaroid of the group with him in costume, closed with a tap. Not there: the photo
 *            is taken without him and no close-up shows;
 *   back     everyone walks back, the band onto the stage; then the second song starts.
 * No camera countdown and no flash at any other time. The state is `p.shot`; party-free.js runs it.
 */
import { CAST, stepTo, stepClear, CLEAR_OF_SQUATCH } from "./party-hall.js";
import { rr, oval, drawBand, drawOutfit, LOOKS } from "./party-art.js";

// Pinned (R60, docs/TUNING-PINS.json): a photo with Squatch in it is 25.
export const PHOTO_BONUS = 25;
// PLACEHOLDERS for Brian: how fast people walk to the row, the longest the gathering may take, the moment the kid
// has once everyone is there (his time to join: 8 s since 2026-11-25, it was 5; a starting number), the count, the flash, the pause after the click, how fast Squatch walks to his place,
// and how soon a tap may close the Polaroid.
export const PHOTO = Object.freeze({ walk: 120, gatherMax: 9, settle: 8, count: 3, flash: 0.25, hold: 0.9, join: 240, closeAfter: 0.6, giveWay: 1.2 });
// The two rows in front of the back wall, left of the lane to the hallway doorway and clear of the snack bar: who
// stands where (feet, game positions), the gap for Squatch in the front row, the camera tourist's place facing
// them, where the camera points, and the stage's end, where the band steps down.
// Spread wider and staggered since 2026-11-25 (Brian: "make the fixes you think best"; the row was hard to read on
// a phone): 64 apart along each row, the front row in the gaps of the back one, the tallest (the stilt-walker) and
// the Croc Boys at the back; the rows 54 apart, so every face is above the heads in front of it (and above Squatch's
// top hat); Squatch in front, one place left of the middle, so his hat sits between faces.
export const PHOTO_ROW = Object.freeze({
  back: Object.freeze([["stilt", 506], ["robot", 570], ["band0", 634], ["band1", 698], ["band2", 762]].map(([id, x]) => Object.freeze({ id, x, y: 302 }))),
  front: Object.freeze([["teal", 538], ["backpack", 666], ["octopus-guest", 730]].map(([id, x]) => Object.freeze({ id, x, y: 356 }))),
  squatch: Object.freeze({ x: 602, y: 356 }),
  camera: Object.freeze({ x: 634, y: 486 }),
  aim: Object.freeze({ x: 634, y: 280 }),
  stageEnd: Object.freeze({ x: 514, y: 264 }),
});
/**
 * Where each face is (tests: no face is hidden), as shares of how tall they are drawn, from their feet: x across
 * from their middle, y up (negative). Read off the approved guest pictures (docs/approved-art/guests) and the Croc
 * Boys' side-on crocodile head (party-art.js drawPerson: its snout points right).
 */
export const PHOTO_FACES = Object.freeze({
  teal: Object.freeze({ x0: -0.1, x1: 0.1, y0: -0.93, y1: -0.73 }),
  backpack: Object.freeze({ x0: -0.1, x1: 0.1, y0: -0.98, y1: -0.76 }),
  "octopus-guest": Object.freeze({ x0: -0.2, x1: 0.2, y0: -0.93, y1: -0.54 }),
  robot: Object.freeze({ x0: -0.14, x1: 0.14, y0: -0.93, y1: -0.74 }),
  stilt: Object.freeze({ x0: -0.08, x1: 0.08, y0: -0.95, y1: -0.81 }),
  band: Object.freeze({ x0: -0.13, x1: 0.36, y0: -0.98, y1: -0.73 }),
});
const ROW = [...PHOTO_ROW.back, ...PHOTO_ROW.front];
const DOWN = Math.PI / 2;

/** True from the first song's end until everyone is back (the Polaroid included). */
export const photoActive = (p) => !!p.shot && p.shot.phase !== "done";
/** True while he can still walk into the photo (JOIN · photo shows). */
export const photoOpen = (p) => !!p.shot && ["gather", "settle", "count"].includes(p.shot.phase) && !p.shot.in;
/** True once the party's one photo moment is over. */
export const photoDone = (p) => !!p.shot && p.shot.phase === "done";

// The person object for an id in the row (a guest, or a band member's own spot).
const body = (p, id) => (id.startsWith("band") ? p.bandAt[+id.slice(4)] : p.people[id]);

/** The first song has ended: everyone sets off for the row. */
export function startPhoto(p) {
  p.shot = { phase: "gather", t: 0, n: 0, in: false, got: false };
  p.bandAt = (p.bandAt || CAST.band).map((b) => ({ x: b.x, y: b.y }));
  for (const r of ROW) {
    const b = body(p, r.id);
    if (!b) continue;
    b.task = "photo";
    b.dance = 0;
    // the band walks along the stage to its end, steps down, then into the row
    b.way = r.id.startsWith("band") ? [{ x: PHOTO_ROW.stageEnd.x, y: b.y }, PHOTO_ROW.stageEnd, { x: r.x, y: r.y }] : [{ x: r.x, y: r.y }];
  }
  const cam = p.people.camera;
  cam && Object.assign(cam, { task: "photo", dance: 0, way: [{ ...PHOTO_ROW.camera }] });
}

// One person one step along their way; true once there. Guests go round Squatch (the band, on the stage and in the
// row, has no need); someone he blocks waits a moment, then walks on.
function walkWay(b, dt, s, round) {
  if (!b.way || !b.way.length) return true;
  const to = b.way[0],
    x0 = b.x,
    y0 = b.y;
  b.face = Math.atan2(to.y - b.y, to.x - b.x);
  const there = round && (b.wayT || 0) < PHOTO.giveWay ? stepClear(b, to.x, to.y, PHOTO.walk, dt, s, CLEAR_OF_SQUATCH) : stepTo(b, to.x, to.y, PHOTO.walk, dt);
  b.wayT = !there && b.x === x0 && b.y === y0 ? (b.wayT || 0) + dt : 0;
  there && b.way.shift();
  return !b.way.length;
}

/**
 * One frame of the photo moment. `s` is Squatch's feet. Returns what just happened: "cheese" (the count starts),
 * "beep" (2 and 1), "click" (the photo is taken without him), "photo" (he is in it), "close-up" (time to show the
 * Polaroid), "back" (everyone sets off back), "done" (the band is on the stage again), or "".
 */
export function tickPhoto(p, dt, s) {
  const sh = p.shot;
  if (!sh || sh.phase === "done" || sh.phase === "polaroid") return "";
  sh.t += dt;
  const cam = p.people.camera;
  if (sh.phase === "gather" || sh.phase === "settle" || sh.phase === "count" || sh.phase === "flash") {
    let all = true;
    for (const r of ROW) {
      const b = body(p, r.id);
      if (!b) continue;
      walkWay(b, dt, s, !r.id.startsWith("band")) ? (b.face = DOWN) : (all = false);
    }
    if (cam) walkWay(cam, dt, s, true) ? (cam.face = -DOWN) : (all = false);
    if (sh.phase === "gather" && (all || sh.t >= PHOTO.gatherMax)) ((sh.phase = "settle"), (sh.t = 0));
    else if (sh.phase === "settle" && sh.t >= PHOTO.settle) return ((sh.phase = "count"), (sh.t = 0), (sh.n = 3), "cheese");
    else if (sh.phase === "count") {
      const n = 3 - Math.floor(sh.t);
      if (n !== sh.n && n > 0) return ((sh.n = n), "beep");
      if (sh.t >= PHOTO.count) {
        sh.phase = "flash";
        sh.t = 0;
        sh.n = 0;
        // in the picture only if he stands in his place in the row
        sh.got = sh.in && Math.hypot(s.x - PHOTO_ROW.squatch.x, s.y - PHOTO_ROW.squatch.y) < 14;
        return sh.got ? "photo" : "click";
      }
    } else if (sh.phase === "flash" && sh.t >= PHOTO.hold) {
      if (sh.got) return ((sh.phase = "polaroid"), (sh.t = 0), "close-up");
      return goBack(p);
    }
    return "";
  }
  if (sh.phase === "back") {
    let all = true;
    for (let i = 0; i < p.bandAt.length; i++) walkWay(p.bandAt[i], dt, s, false) || (all = false);
    // (the camera tourist walks back whenever he still has a way to go, whatever an alarm did to his task meanwhile)
    if (cam && cam.way && cam.way.length) walkWay(cam, dt, s, true) ? ((cam.task = ""), (cam.face = null)) : (all = false);
    if (all) {
      for (const b of p.bandAt) ((b.face = null), (b.task = ""));
      cam && (cam.task = "");
      sh.phase = "done";
      return "done";
    }
  }
  return "";
}
/** The photo is over (or the Polaroid has been closed): everyone walks back; the guests go back to milling. */
export function goBack(p) {
  const sh = p.shot;
  if (!sh || sh.phase === "back" || sh.phase === "done") return "";
  sh.phase = "back";
  sh.t = 0;
  sh.in = false;
  for (const r of ROW) {
    const b = body(p, r.id);
    if (!b) continue;
    const i = r.id.startsWith("band") ? +r.id.slice(4) : -1;
    if (i < 0) ((b.task = ""), (b.way = null), (b.face = null));
    else b.way = [PHOTO_ROW.stageEnd, { x: PHOTO_ROW.stageEnd.x, y: CAST.band[i].y }, { x: CAST.band[i].x, y: CAST.band[i].y }];
  }
  const cam = p.people.camera,
    home = CAST.guests.find((g) => g.id === "camera");
  cam && (cam.way = [{ x: home.x, y: home.y }]);
  return "back";
}

// ---------- the Polaroid, the whole screen ----------
/**
 * Where the Polaroid's picture is on a `w` x `h` screen, and how the row maps into it: one scale `z` for across and
 * up, so the photo is the row as it stood (back row 54 behind, faces above the heads in front). `at(x, y)` is a
 * game position's place in the picture, in the Polaroid's own frame (its middle at 0, 0, before it is tilted).
 */
export function polaroidLayout(w, h) {
  const pw = Math.min(w - 28, 560),
    ph = Math.min(h * 0.62, pw * 0.92),
    m = 14,
    iw = pw - m * 2,
    ih = ph - m * 2 - ph * 0.14,
    x0 = -pw / 2 + m,
    y0 = -ph / 2 + m,
    all = [...PHOTO_ROW.back, ...PHOTO_ROW.front, PHOTO_ROW.squatch],
    lo = Math.min(...all.map((r) => r.x)) - 50,
    hi = Math.max(...all.map((r) => r.x)) + 50,
    z = iw / (hi - lo),
    front = PHOTO_ROW.squatch.y,
    floor = y0 + ih * 0.97;
  return { pw, ph, iw, ih, x0, y0, z, at: (x, y) => ({ x: x0 + (x - lo) * z, y: floor - (front - y) * z }) };
}
/**
 * The group photo as a Polaroid filling the screen (`w` by `h`): the two rows as they stood, Squatch in his outfit
 * in his place. `art`: { squatch (ctx, x, y, scale), guest (ctx, id, x, y, tall), adult, sqScale } from the game;
 * `worn` is his outfit now. `k` (0 to 1) slides it in.
 */
export function drawGroupPolaroid(ctx, w, h, art, worn, k) {
  ctx.fillStyle = "#1e2430";
  ctx.fillRect(0, 0, w, h);
  const L = polaroidLayout(w, h),
    { pw, ph, iw, ih, x0, y0, z } = L,
    ease = 1 - (1 - Math.min(1, k)) ** 3;
  ctx.save();
  ctx.translate(w / 2, h * 0.47 + (1 - ease) * h * 0.6);
  ctx.rotate(-0.035 * ease);
  rr(ctx, -pw / 2, -ph / 2, pw, ph, 10, "#fffdf8", 3);
  // the picture: the back wall and the floor, then everyone, back row first
  ctx.save();
  ctx.beginPath();
  ctx.rect(x0, y0, iw, ih);
  ctx.clip();
  ctx.fillStyle = "#b9a3ab";
  ctx.fillRect(x0, y0, iw, ih);
  ctx.fillStyle = "#a78f98";
  ctx.fillRect(x0, y0 + ih * 0.8, iw, ih * 0.2);
  const tall = art.adult * z;
  for (const r of PHOTO_ROW.back) {
    const at = L.at(r.x, r.y);
    r.id.startsWith("band") ? drawBand(ctx, [at], tall * 0.98, 0, false, [LOOKS.band[+r.id.slice(4)]]) : art.guest(ctx, r.id, at.x, at.y, tall);
  }
  for (const r of PHOTO_ROW.front) art.guest(ctx, r.id, L.at(r.x, r.y).x, L.at(r.x, r.y).y, tall);
  const sq = L.at(PHOTO_ROW.squatch.x, PHOTO_ROW.squatch.y);
  art.squatch(ctx, sq.x, sq.y, art.sqScale * z);
  drawOutfit(ctx, sq.x, sq.y, art.sqScale * z, worn, 1);
  ctx.restore();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#1e2430";
  ctx.strokeRect(x0, y0, iw, ih);
  // a camera's glint in the corner of the white border
  oval(ctx, pw / 2 - 30, ph / 2 - ph * 0.08, 7, 7, "#ffcf33", 2);
  ctx.restore();
}
/** The full-screen view's name (the page's label for it). */
export const POLAROID_LABEL = "group photo";
