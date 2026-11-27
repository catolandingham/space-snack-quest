/**
 * The loading bay's security camera (round 7, Brian's video notes 2026-11-27: r6 7:46 "we actually need to add the
 * camera to the loading bay hangar for the whole time... we actually need to show it" being installed; r5 0:40 and
 * 11:20 "the upper right side of the room, up to the right of the speaker box"; q: 123, option A, built before his answer).
 *   - On Day 2 (beat 30) Isfred says "And a camera. Just in case." and a robot puts it up, upper right by the speaker.
 *   - From then on it hangs in every picture of the loading bay, its red light on (a layer over the locked picture,
 *     made the way crate-stamp.js layers the crate bed: the picture files never change).
 *   - The office's wall of security screens shows the bay on its bottom-right screen (the one that was dark), so the
 *     tapes on pickup day have a cause the player has seen (topic K, LOOK · screens in the escape's office).
 * PLACEHOLDER drawings (the camera, its red light, the little bay on the screen): layers on locked pictures, waiting for
 * Brian's yes to the layer (question 123 asks it). Option B of q 123 ("camera just there, no words") is
 * CAMERA_INSTALL_SCENE = false: the camera then hangs from the start of Day 2 and nobody puts it up.
 */

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
const INK = "#2a2f3a";

/**
 * Draws the camera at (x, y) (the middle of its wall plate) in the units of `ctx`; `k` its size; `light` whether the red
 * light is lit; `a` (0 to 1) how far it is up (the install: it fades in).
 */
export function drawBayCamera(ctx, x, y, k = 1, light = true, a = 1) {
  ctx.save();
  ctx.globalAlpha *= Math.max(0, Math.min(1, a));
  ctx.translate(x, y);
  ctx.scale(k, k);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = INK;
  // the wall plate
  ctx.fillStyle = "#8e96a6";
  ctx.beginPath();
  ctx.roundRect(-8, -14, 16, 22, 3);
  ctx.fill();
  ctx.stroke();
  // the arm out from the wall
  ctx.beginPath();
  ctx.moveTo(-2, -2);
  ctx.lineTo(-10, 6);
  ctx.stroke();
  // the body, tipped down toward the room (to the left)
  ctx.save();
  ctx.translate(-14, 8);
  ctx.rotate(0.38);
  ctx.fillStyle = "#d9dde6";
  ctx.beginPath();
  ctx.roundRect(-30, -10, 34, 20, 4);
  ctx.fill();
  ctx.stroke();
  // the lens
  ctx.fillStyle = "#3a4152";
  ctx.beginPath();
  ctx.roundRect(-38, -8, 10, 16, 3);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#7fb2e5";
  ctx.beginPath();
  ctx.arc(-35, 0, 3.2, 0, Math.PI * 2);
  ctx.fill();
  // the red light on its back
  ctx.fillStyle = light ? "#ff3b30" : "#7a2a26";
  ctx.beginPath();
  ctx.arc(-4, -4, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.stroke();
  if (light) {
    ctx.globalAlpha *= 0.35;
    ctx.beginPath();
    ctx.arc(-4, -4, 9, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  ctx.restore();
}

/** The little bay on the office's security screen: the window onto space, the floor, the ramp, the plant. */
function drawBayOnScreen(c) {
  const s = OFFICE_BAY_SCREEN,
    w = s.x1 - s.x0,
    h = s.y1 - s.y0;
  c.save();
  c.beginPath();
  c.rect(s.x0, s.y0, w, h);
  c.clip();
  c.fillStyle = "#e8e3d6";
  c.fillRect(s.x0, s.y0, w, h);
  c.fillStyle = "#2f3560";
  c.fillRect(s.x0 + w * 0.12, s.y0 + h * 0.08, w * 0.72, h * 0.34);
  c.fillStyle = "#fff";
  for (const [u, v] of [[0.2, 0.15], [0.35, 0.3], [0.7, 0.18], [0.78, 0.32], [0.5, 0.12]]) c.fillRect(s.x0 + w * u, s.y0 + h * v, 1.6, 1.6);
  // the ramp and the arch
  c.fillStyle = "#9aa1af";
  c.beginPath();
  c.moveTo(s.x0 + w * 0.45, s.y0 + h * 0.42);
  c.lineTo(s.x0 + w * 0.55, s.y0 + h * 0.42);
  c.lineTo(s.x0 + w * 0.62, s.y0 + h * 0.75);
  c.lineTo(s.x0 + w * 0.38, s.y0 + h * 0.75);
  c.closePath();
  c.fill();
  // the plant
  c.fillStyle = "#2fbf7a";
  c.beginPath();
  c.arc(s.x0 + w * 0.27, s.y0 + h * 0.52, w * 0.05, 0, Math.PI * 2);
  c.fill();
  // grey scan lines, and CAM in the corner with a red dot
  c.globalAlpha = 0.18;
  c.fillStyle = "#000";
  for (let y = s.y0; y < s.y1; y += 4) c.fillRect(s.x0, y, w, 1.5);
  c.globalAlpha = 1;
  c.fillStyle = "#ff3b30";
  c.beginPath();
  c.arc(s.x1 - 9, s.y0 + 8, 3, 0, Math.PI * 2);
  c.fill();
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
const layered = new Map();
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
  if (!layered.has(key)) {
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
    bay ? drawBayCamera(c, BAY_CAMERA.x, BAY_CAMERA.y, 1.3) : drawBayOnScreen(c);
    c.restore();
    Object.assign(cv, { complete: true, naturalWidth: w, naturalHeight: h, src: img.src + "#camera", cameraLayer: true, nightLook: !!img.nightLook, snackLayer: !!img.snackLayer });
    layered.set(key, cv);
  }
  handed++;
  lastId = id;
  return layered.get(key);
}
