/**
 * The loading bay's security camera (round 7, Brian's video notes 2026-11-27: r6 7:46 "we actually need to add the
 * camera to the loading bay hangar for the whole time... we actually need to show it" being installed; r5 0:40 and
 * 11:20 "the upper right side of the room, up to the right of the speaker box"; q: 123, option A, built before his answer).
 *   - On Day 2 (beat 30) Isfred says "And a camera. Just in case." and a robot puts it up, upper right by the speaker.
 *   - From then on it hangs in every picture of the loading bay, its red light on (a layer over the locked picture,
 *     made the way crate-stamp.js layers the crate bed: the picture files never change).
 *   - The office's wall of security screens shows the bay on its bottom-right screen (the one that was dark), so the
 *     tapes on pickup day have a cause the player has seen (topic K, LOOK · screens in the escape's office).
 * Final art, pending Brian's yes (round 8, drawn in the locked rooms' look: locked-look.js): the camera, its red light,
 * the little bay on the screen. Layers on locked pictures, waiting for Brian's yes to the layer (question 123 asks it). Option B of q 123 ("camera just there, no words") is
 * CAMERA_INSTALL_SCENE = false: the camera then hangs from the start of Day 2 and nobody puts it up.
 */

import { LOCKED_LOOK, lookRound, lookFill, lookShine } from "./locked-look.js";

/** q: 123. true: a robot puts the camera up on Day 2 after Isfred's line (option A). false: it is just there (option B). */
export const CAMERA_INSTALL_SCENE = true;

/** Where the camera hangs, in the bay pictures' own pixels (1280 x 830): right of the speaker box (picture 1085 to 1160). */
export const BAY_CAMERA = Object.freeze({
  picture: Object.freeze({ w: 1280, h: 830 }),
  x: 1203, // the wall plate's middle
  y: 128,
  // in game positions (960 x 640), for the robot that puts it up and anything drawn over it
  game: Object.freeze({ x: 902, y: 99 }),
});
/** The office's bottom-right security screen (office_room_v2.py, picture pixels), which shows the bay. */
export const OFFICE_BAY_SCREEN = Object.freeze({ x0: 221, y0: 216, x1: 317, y1: 279 });

const BAY_IDS = new Set(["delivery-day", "delivery-noship", "delivery-pickup", "delivery-night"]);

/**
 * Draws the camera at (x, y) (the middle of its wall plate) in the units of `ctx`; `k` its size; `light` whether the red
 * light is lit; `a` (0 to 1) how far it is up (the install: it fades in).
 */
export function drawBayCamera(ctx, x, y, k = 1, light = true, a = 1) {
  const L = LOCKED_LOOK;
  ctx.save();
  ctx.globalAlpha *= Math.max(0, Math.min(1, a));
  ctx.translate(x, y);
  ctx.scale(k, k);
  ctx.lineCap = "round";
  // the wall plate, two screws
  lookRound(ctx, -8, -15, 16, 26, 4);
  lookFill(ctx, L.hullDark, 2.2);
  ctx.fillStyle = L.ink;
  for (const sy of [-10, 6]) (ctx.beginPath(), ctx.arc(0, sy, 1.4, 0, Math.PI * 2), ctx.fill());
  // the arm out from the wall: an outlined bar, and a ball joint
  ctx.strokeStyle = L.ink;
  ctx.lineWidth = 6.4;
  ctx.beginPath();
  ctx.moveTo(-3, -3);
  ctx.lineTo(-12, 5);
  ctx.stroke();
  ctx.strokeStyle = L.desk;
  ctx.lineWidth = 2.6;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(-12, 5, 3.6, 0, Math.PI * 2);
  lookFill(ctx, L.deskTop, 1.8);
  // the body, tipped down toward the room (to the left)
  ctx.save();
  ctx.translate(-14, 8);
  ctx.rotate(0.38);
  lookRound(ctx, -32, -8, 32, 18, 5);
  lookFill(ctx, L.hull, 2.4);
  ctx.fillStyle = L.hullDark;
  ctx.fillRect(-29, 4, 26, 3);
  // the sun hood over the lens
  lookRound(ctx, -42, -13, 38, 7, 3);
  lookFill(ctx, L.desk, 2.2);
  // the lens: a dark ring, blue glass, the rooms' white shine dot
  lookRound(ctx, -40, -6, 9, 15, 3);
  lookFill(ctx, L.bezel, 2);
  ctx.beginPath();
  ctx.arc(-37.5, 1.5, 4, 0, Math.PI * 2);
  lookFill(ctx, L.port, 1.6);
  lookShine(ctx, -38.8, 0, 1.3);
  // the red light on its back
  if (light) {
    ctx.save();
    ctx.globalAlpha *= 0.3;
    ctx.fillStyle = L.red;
    ctx.beginPath();
    ctx.arc(-7, -1, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.beginPath();
  ctx.arc(-7, -1, 3.6, 0, Math.PI * 2);
  lookFill(ctx, light ? "rgb(255,59,48)" : "rgb(122,42,38)", 1.6);
  light && lookShine(ctx, -8.2, -2.2, 1.1);
  ctx.restore();
  ctx.restore();
}

/**
 * Robot 3 putting the camera up (Day 2, beat 30), `u` 0 to 1 of the install: its arm telescopes up out of its gripper at
 * `hand` (three grey tubes, each thinner, the rooms' ink round each), carrying the camera in its claw to the wall; the
 * plate meets the wall at u 0.6, two little click marks show it fixed, and the red light comes on at the end.
 * Game positions (960 x 640). Final art, pending Brian's yes.
 */
export function drawCameraInstall(ctx, hand, u) {
  const L = LOCKED_LOOK,
    c = BAY_CAMERA.game,
    reach = 1 - Math.pow(1 - Math.min(1, u / 0.6), 2),
    tip = { x: hand.x + (c.x - 4 - hand.x) * reach, y: hand.y + (c.y + 16 - hand.y) * reach };
  ctx.save();
  ctx.lineCap = "round";
  // three tubes, from the gripper up, each a third of the way and thinner
  for (let i = 0; i < 3; i++) {
    const a = i / 3,
      b = (i + 1) / 3,
      x0 = hand.x + (tip.x - hand.x) * a,
      y0 = hand.y + (tip.y - hand.y) * a,
      x1 = hand.x + (tip.x - hand.x) * b,
      y1 = hand.y + (tip.y - hand.y) * b,
      wdt = 7 - i * 1.6;
    ctx.strokeStyle = L.ink;
    ctx.lineWidth = wdt + 3.4;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.strokeStyle = i % 2 ? L.deskTop : L.desk;
    ctx.lineWidth = wdt;
    ctx.stroke();
  }
  // the claw round the camera's arm
  ctx.lineWidth = 2.4;
  ctx.strokeStyle = L.ink;
  ctx.beginPath();
  ctx.arc(tip.x, tip.y - 2, 5, Math.PI * 0.15, Math.PI * 0.85, true);
  ctx.stroke();
  ctx.restore();
  // the camera rides the claw up, then hangs on the wall
  drawBayCamera(ctx, tip.x + 4, tip.y - 16, 0.98, u >= 1, 1);
  if (u >= 0.6 && u < 0.9) {
    // "click": two short marks either side of the plate
    ctx.save();
    ctx.strokeStyle = L.ink;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    for (const sx of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(c.x + sx * 12, c.y - 10);
      ctx.lineTo(c.x + sx * 18, c.y - 15);
      ctx.moveTo(c.x + sx * 13, c.y - 2);
      ctx.lineTo(c.x + sx * 20, c.y - 2);
      ctx.stroke();
    }
    ctx.restore();
  }
}

/**
 * The bay on the office's bottom-right security screen, drawn in the office picture's own feed language
 * (office_room_v2.py feed_bay, feed_hallway: flat fills, thin grey outlines, white star dots): the window with the
 * ship docked, the ramp and the scanner arch, the plant, the robot mailbox. The bezel's red REC dot is the picture's own.
 */
function drawBayOnScreen(c) {
  const L = LOCKED_LOOK,
    s = OFFICE_BAY_SCREEN,
    w = s.x1 - s.x0,
    h = s.y1 - s.y0,
    X = (u) => s.x0 + w * u,
    Y = (v) => s.y0 + h * v;
  const box = (u0, v0, u1, v1, fill, r = 1) => {
    c.beginPath();
    c.roundRect(X(u0), Y(v0), X(u1) - X(u0), Y(v1) - Y(v0), r);
    c.fillStyle = fill;
    c.fill();
    c.lineWidth = 1;
    c.strokeStyle = L.feedLine;
    c.stroke();
  };
  c.save();
  c.beginPath();
  c.rect(s.x0, s.y0, w, h);
  c.clip();
  c.fillStyle = L.feedWall;
  c.fillRect(s.x0, s.y0, w, h * 0.5);
  c.fillStyle = L.feedFloor;
  c.fillRect(s.x0, Y(0.5), w, h * 0.5);
  c.fillStyle = "rgb(170,166,158)";
  c.fillRect(s.x0, Y(0.5), w, 1);
  // the window onto space, with stars, and the ship docked in it
  box(0.1, 0.07, 0.8, 0.44, L.navy, 2);
  c.fillStyle = L.star;
  for (const [u, v] of [[0.14, 0.12], [0.2, 0.33], [0.7, 0.11], [0.75, 0.3], [0.17, 0.22], [0.67, 0.38], [0.73, 0.2]]) c.fillRect(X(u), Y(v), 1.5, 1.5);
  box(0.25, 0.13, 0.63, 0.4, L.hull, 4);
  c.fillStyle = L.port;
  for (const u of [0.32, 0.4, 0.48, 0.56]) (c.beginPath(), c.arc(X(u), Y(0.24), 1.8, 0, Math.PI * 2), c.fill());
  // the ramp down from the ship's door
  c.beginPath();
  c.moveTo(X(0.4), Y(0.4));
  c.lineTo(X(0.48), Y(0.4));
  c.lineTo(X(0.58), Y(0.74));
  c.lineTo(X(0.3), Y(0.74));
  c.closePath();
  c.fillStyle = "rgb(168,172,182)";
  c.fill();
  c.strokeStyle = L.feedLine;
  c.stroke();
  // the scanner arch over the ramp's foot
  c.lineWidth = 2.4;
  c.strokeStyle = L.desk;
  c.beginPath();
  c.moveTo(X(0.26), Y(0.82));
  c.lineTo(X(0.26), Y(0.56));
  c.lineTo(X(0.62), Y(0.56));
  c.lineTo(X(0.62), Y(0.82));
  c.stroke();
  // the plant by the wall, and the blue robot mailbox on the right
  box(0.08, 0.6, 0.15, 0.72, "rgb(196,120,80)", 1);
  c.fillStyle = L.green;
  c.beginPath();
  c.arc(X(0.115), Y(0.53), w * 0.055, 0, Math.PI * 2);
  c.fill();
  c.lineWidth = 1;
  c.strokeStyle = L.feedLine;
  c.stroke();
  box(0.83, 0.5, 0.92, 0.78, "rgb(70,110,180)", 2);
  c.fillStyle = "rgb(30,40,60)";
  c.fillRect(X(0.85), Y(0.57), w * 0.05, 1.5);
  c.restore();
}
let cameraNow = () => false;
/** The bridge tells the layer how to know whether the camera is up (a function returning true or false). */
export function setCameraSource(fn) {
  cameraNow = typeof fn === "function" ? fn : () => false;
}
/**
 * Whether the camera is up, from the game state (`get` reads a field): once the bay beat says so on Day 2
 * (ch1Bay.camera), and in every beat after the bay (the evening, the escape, pickup day).
 */
export function cameraUpFrom(get) {
  if (typeof get !== "function") return false;
  if (get("ch1Evening") || get("ch1Escape") || get("ch1Pickup")) return true;
  const bay = get("ch1Bay");
  return !!(bay && bay.camera);
}

const cameraPicReady = (img) => !!img && !!img.complete && !!img.naturalWidth;
const cameraLayered = new Map();
let handed = 0;
/** Tests: how many pictures were handed out with the camera layer, and the last one's id. */
let lastId = "";
export function cameraLayerDrawn() {
  return { handed, lastId };
}
/**
 * The locked picture `img` (id `id`, the older program's picture id, or "office") with the camera's layer when the camera
 * is up: the camera on the bay pictures, the bay on the office's screen. Any other picture, or the camera not up yet:
 * `img` itself. The layered copy is a canvas that draws like the Image (complete, naturalWidth, naturalHeight, src).
 */
export function withCameraLayer(id, img) {
  const bay = BAY_IDS.has(id);
  if (!(bay || id === "office") || !cameraPicReady(img) || img.cameraLayer || !cameraNow()) return img;
  const key = id + "|" + img.src;
  if (!cameraLayered.has(key)) {
    if (typeof document === "undefined") return img;
    const w = img.naturalWidth,
      h = img.naturalHeight,
      cv = document.createElement("canvas");
    cv.width = w;
    cv.height = h;
    const c = cv.getContext("2d");
    if (!c) return img;
    c.drawImage(img, 0, 0);
    c.save();
    c.scale(w / BAY_CAMERA.picture.w, h / BAY_CAMERA.picture.h);
    if (bay && (id === "delivery-night" || img.nightLook)) {
      // at night the camera sits in the dark like the room: the night picture's own dimming over it (delivery_room.py
      // apply_night, 20,24,60 at 120 of 255), drawn on a small canvas of its own so only the camera is dimmed
      const cam = document.createElement("canvas"),
        g = cam.getContext("2d");
      cam.width = 140;
      cam.height = 110;
      if (g) {
        drawBayCamera(g, 110, 40, 1.3);
        g.globalCompositeOperation = "source-atop";
        g.fillStyle = "rgba(20,24,60,0.47)";
        g.fillRect(0, 0, cam.width, cam.height);
        c.drawImage(cam, BAY_CAMERA.x - 110, BAY_CAMERA.y - 40);
        // its red light stays bright in the dark
        const k = 1.3,
          a = 0.38,
          lx = BAY_CAMERA.x + k * (-14 + Math.cos(a) * -7 - Math.sin(a) * -1),
          ly = BAY_CAMERA.y + k * (8 + Math.sin(a) * -7 + Math.cos(a) * -1);
        c.fillStyle = "rgba(255,59,48,0.35)";
        c.beginPath();
        c.arc(lx, ly, 10 * k, 0, Math.PI * 2);
        c.fill();
        c.beginPath();
        c.arc(lx, ly, 3.6 * k, 0, Math.PI * 2);
        lookFill(c, "rgb(255,59,48)", 1.6 * k);
        lookShine(c, lx - 1.2 * k, ly - 1.2 * k, 1.1 * k);
      }
    } else bay ? drawBayCamera(c, BAY_CAMERA.x, BAY_CAMERA.y, 1.3) : drawBayOnScreen(c);
    c.restore();
    Object.assign(cv, { complete: true, naturalWidth: w, naturalHeight: h, src: img.src + "#camera", cameraLayer: true, nightLook: !!img.nightLook, snackLayer: !!img.snackLayer });
    cameraLayered.set(key, cv);
  }
  handed++;
  lastId = id;
  return cameraLayered.get(key);
}
