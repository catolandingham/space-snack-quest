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
import { rr, oval, drawBand, drawOutfit } from "./party-art.js";

// Pinned (R60, docs/TUNING-PINS.json): a photo with Squatch in it is 25.
export const PHOTO_BONUS = 25;
// PLACEHOLDERS for Brian: how fast people walk to the row, the longest the gathering may take, the moment the kid
// has once everyone is there, the count, the flash, the pause after the click, how fast Squatch walks to his place,
// and how soon a tap may close the Polaroid.
export const PHOTO = Object.freeze({ walk: 120, gatherMax: 9, settle: 5, count: 3, flash: 0.25, hold: 0.9, join: 240, closeAfter: 0.6, giveWay: 1.2 });
// The two rows in front of the back wall, left of the lane to the hallway doorway and clear of the snack bar: who
// stands where (feet, game positions), the gap for Squatch in the front row, the camera tourist's place facing
// them, where the camera points, and the stage's end, where the band steps down.
export const PHOTO_ROW = Object.freeze({
  back: Object.freeze([["band0", 540], ["band1", 584], ["band2", 628], ["stilt", 672], ["robot", 716]].map(([id, x]) => Object.freeze({ id, x, y: 310 }))),
  front: Object.freeze([["teal", 574], ["backpack", 686], ["octopus-guest", 734]].map(([id, x]) => Object.freeze({ id, x, y: 348 }))),
  squatch: Object.freeze({ x: 630, y: 350 }),
  camera: Object.freeze({ x: 660, y: 486 }),
  aim: Object.freeze({ x: 630, y: 280 }),
  stageEnd: Object.freeze({ x: 514, y: 264 }),
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
 * The group photo as a Polaroid filling the screen (`w` by `h`): the two rows as they stood, Squatch in his outfit
 * in the gap. `art`: { squatch (ctx, x, y, scale), guest (ctx, id, x, y, tall), sqScale } from the game; `worn` is
 * his outfit now. `k` (0 to 1) slides it in.
 */
export function drawGroupPolaroid(ctx, w, h, art, worn, k) {
  ctx.fillStyle = "#1e2430";
  ctx.fillRect(0, 0, w, h);
  const pw = Math.min(w - 28, 560),
    ph = Math.min(h * 0.62, pw * 0.92),
    ease = 1 - (1 - Math.min(1, k)) ** 3;
  ctx.save();
  ctx.translate(w / 2, h * 0.47 + (1 - ease) * h * 0.6);
  ctx.rotate(-0.035 * ease);
  rr(ctx, -pw / 2, -ph / 2, pw, ph, 10, "#fffdf8", 3);
  // the picture: the back wall and the floor, then everyone
  const m = 14,
    iw = pw - m * 2,
    ih = ph - m * 2 - ph * 0.14,
    x0 = -pw / 2 + m,
    y0 = -ph / 2 + m;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x0, y0, iw, ih);
  ctx.clip();
  ctx.fillStyle = "#b9a3ab";
  ctx.fillRect(x0, y0, iw, ih);
  ctx.fillStyle = "#a78f98";
  ctx.fillRect(x0, y0 + ih * 0.8, iw, ih * 0.2);
  // the row is 230 game pixels wide and a grown-up tall: fit it across the picture
  const lo = PHOTO_ROW.back[0].x - 40,
    hi = PHOTO_ROW.front[PHOTO_ROW.front.length - 1].x + 40,
    z = iw / (hi - lo),
    tall = art.adult * z,
    px = (x) => x0 + (x - lo) * z,
    floorBack = y0 + ih * 0.86,
    floorFront = y0 + ih * 0.97;
  drawBand(ctx, PHOTO_ROW.back.slice(0, 3).map((r) => ({ x: px(r.x), y: floorBack })), tall * 0.98, 0, false);
  for (const r of PHOTO_ROW.back.slice(3)) art.guest(ctx, r.id, px(r.x), floorBack, tall);
  for (const r of PHOTO_ROW.front) art.guest(ctx, r.id, px(r.x), floorFront, tall);
  art.squatch(ctx, px(PHOTO_ROW.squatch.x), floorFront, art.sqScale * z);
  drawOutfit(ctx, px(PHOTO_ROW.squatch.x), floorFront, art.sqScale * z, worn, 1);
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
