/**
 * Mops's mop bucket: one drawing for everywhere it shows (Brian, 2026-11-26, phase-3 item 3, video note 0:39: "I like
 * this mop bucket... Let's go with it moving forward."). It is the bucket the bedtime story's bucket pictures drew
 * first (bedtime-story-art.js): yellow, wider at the top, a thick darker rim, two ribs down the side, a wire handle up
 * over the rim and two little grey wheels.
 *   In the bedtime story's pictures: drawn big (k 1), the baby curled up inside it.
 *   In the home room: the locked picture paints an older, smaller bucket (docs/locked-rooms/home_room.py
 *   draw_bucket). The picture is never changed; this bucket is drawn as a layer over the painted one, in the same
 *   place and footprint (HOME_BUCKET), under the people (src/game asks for it through window.SSQ.drawHomeBucket).
 * The wringing close-up of the morning (cutaway.js) keeps its own bucket, which Brian approved separately (a question
 * for him: docs/BRIAN-ASKS-OPEN.md).
 */
import { nightPicture, drawUnderNightTint } from "./night-look.js";

const DARK = "#22242c";
/** The bucket's shape at k 1 (picture pixels): top and bottom widths, body height, wheel size; and its colours. */
export const MOP_BUCKET = Object.freeze({
  wTop: 176,
  wBot: 128,
  h: 132,
  wheel: 12,
  color: "#ffcf33",
  rim: "#e0a81c",
  rib: "#d9a514",
  water: "#8fdcff",
  wheelColor: "#59657d",
});

function rounded(ctx, x, y, w, h, r) {
  const k = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + k, y);
  ctx.arcTo(x + w, y, x + w, y + h, k);
  ctx.arcTo(x + w, y + h, x, y + h, k);
  ctx.arcTo(x, y + h, x, y, k);
  ctx.arcTo(x, y, x + w, y, k);
  ctx.closePath();
}
function fillLine(ctx, fill, line) {
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = DARK;
  ctx.lineWidth = line;
  ctx.lineJoin = "round";
  ctx.stroke();
}
/** The bucket's box (canvas) with its middle at `cx` and its wheels on `floor`, `k` times the k 1 size. */
export function mopBucketBox(cx, floor, k) {
  const B = MOP_BUCKET,
    bottom = floor - B.wheel * k,
    top = bottom - B.h * k;
  return { cx, k, top, bottom, floor, x0: cx - (B.wTop / 2 + 6) * k, x1: cx + (B.wTop / 2 + 6) * k, y0: top - 6 * k };
}
/** The part behind what is in the bucket: the handle (an arc up over the rim). Returns the box. */
export function drawMopBucketBack(ctx, cx, floor, k) {
  const B = MOP_BUCKET,
    b = mopBucketBox(cx, floor, k);
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(cx, b.top + 4 * k, (B.wTop / 2 - 8) * k, 70 * k, 0, Math.PI, 0);
  ctx.strokeStyle = DARK;
  ctx.lineWidth = Math.max(1.5, 5 * k);
  ctx.stroke();
  ctx.restore();
  return b;
}
/**
 * The part in front: the body, the rim, two ribs and the wheels, and with `water` the water's surface inside the rim
 * (seen a little from above, as the room shows it). Returns the box.
 */
export function drawMopBucketFront(ctx, cx, floor, k, { water = false } = {}) {
  const B = MOP_BUCKET,
    b = mopBucketBox(cx, floor, k),
    line = Math.max(1.5, 4.2 * k);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx - (B.wTop / 2) * k, b.top);
  ctx.lineTo(cx + (B.wTop / 2) * k, b.top);
  ctx.lineTo(cx + (B.wBot / 2) * k, b.bottom);
  ctx.lineTo(cx - (B.wBot / 2) * k, b.bottom);
  ctx.closePath();
  fillLine(ctx, B.color, line);
  // the rim: a darker band round the top
  rounded(ctx, cx - (B.wTop / 2 + 6) * k, b.top - 6 * k, (B.wTop + 12) * k, 18 * k, 8 * k);
  fillLine(ctx, B.rim, line);
  if (water) {
    ctx.beginPath();
    ctx.ellipse(cx, b.top + 3 * k, (B.wTop / 2 - 4) * k, 6 * k, 0, 0, Math.PI * 2);
    fillLine(ctx, B.water, Math.max(1.2, 2.5 * k));
  }
  for (const s of [-0.25, 0.25]) {
    ctx.beginPath();
    ctx.moveTo(cx + s * B.wTop * k, b.top + 22 * k);
    ctx.lineTo(cx + s * B.wBot * k, b.bottom - 10 * k);
    ctx.strokeStyle = B.rib;
    ctx.lineWidth = Math.max(1.2, 4 * k);
    ctx.lineCap = "round";
    ctx.stroke();
  }
  for (const wx of [cx - (B.wBot / 2 - 18) * k, cx + (B.wBot / 2 - 18) * k]) {
    ctx.beginPath();
    ctx.arc(wx, b.bottom + (B.wheel / 2) * k, (B.wheel / 2 + 2) * k, 0, Math.PI * 2);
    fillLine(ctx, B.wheelColor, Math.max(1.2, 3 * k));
  }
  ctx.restore();
  return b;
}

/**
 * The bucket in the home room (game positions): over the painted bucket of the locked picture, which stands at about
 * x 532 to 588, y 500 to 568 (its water on top at about y 502 to 512; the morning wrings Mops's beard over that water,
 * morning.js MORNING_PLACES.water). This one keeps that place: its middle at x 559, its wheels on y 568, its rim's top
 * at about y 508, and it stays inside the floor box the room's solids give the bucket (x 536 to 596 at the floor, and
 * no wider than x 522 to 597 at the rim; tests/standing-spots.mjs). `cover`: the painted bucket's box, painted over
 * first with the plain floor just left of it in the same picture (78 px to the left), so the old bucket never shows.
 */
export const HOME_BUCKET = Object.freeze({
  cx: 559,
  floor: 568,
  k: 0.4,
  cover: Object.freeze({ x0: 524, x1: 601, y0: 492, y1: 577, from: 78 }),
  picture: "docs/locked-rooms/home-room-empty-closed-v6.png",
});
const homeImg = typeof Image !== "undefined" ? Object.assign(new Image(), { src: HOME_BUCKET.picture }) : null;
let lastHome = null;
/**
 * Draws the bucket in the home room on `ctx`: the floor over the painted bucket, then this bucket with its water.
 * `front`: only the bucket, again, over Squatch standing behind it (the floor is not painted again over him). `night`:
 * the story is at night (bridge.js passes it): the room's night look (night-look.js).
 * Returns its box, or null while the picture has not loaded (the painted bucket then shows, as before).
 */
export function drawHomeMopBucket(ctx, front = false, night = false) {
  const H = HOME_BUCKET,
    C = H.cover;
  if (!homeImg || !homeImg.complete || !homeImg.naturalWidth) return (lastHome = null);
  // at night the floor comes from the room's night picture and the bucket is under the night tint (night-look.js)
  const pic = nightPicture("home-closed", homeImg, night),
    kx = pic.naturalWidth / 960,
    ky = pic.naturalHeight / 640;
  front || ctx.drawImage(pic, (C.x0 - C.from) * kx, C.y0 * ky, (C.x1 - C.x0) * kx, (C.y1 - C.y0) * ky, C.x0, C.y0, C.x1 - C.x0, C.y1 - C.y0);
  const b = drawUnderNightTint(ctx, night, (ctx) => (drawMopBucketBack(ctx, H.cx, H.floor, H.k), drawMopBucketFront(ctx, H.cx, H.floor, H.k, { water: true })), { x0: C.x0 - 12, x1: C.x1 + 12, y0: C.y0 - 40, y1: C.y1 + 12 });
  return (lastHome = { x0: Math.round(b.x0), x1: Math.round(b.x1), y0: Math.round(b.y0), y1: Math.round(b.floor) });
}
/** Tests: the box the last home bucket was drawn in, or null. */
export function lastHomeMopBucket() {
  return lastHome;
}
