/**
 * Mops's mop bucket: one drawing for everywhere it shows (Brian, 2026-11-26, phase-3 item 3, video note 0:39: "I like
 * this mop bucket... Let's go with it moving forward."). It is the bucket the bedtime story's bucket pictures drew
 * first (bedtime-story-art.js): yellow, wider at the top, a thick darker rim, two ribs down the side, a wire handle up
 * over the rim and two little grey wheels.
 *   In the bedtime story's pictures: drawn big (k 1), the baby curled up inside it.
 *   In the party hall after the party: Mops's bucket by the hallway doorway, where he wrings his beard while he
 *   cleans (party-cleanup.js). (On feat/ch1-bedtime-story this file also draws it over the home room's painted one.)
 * The wringing close-up of the morning (cutaway.js) keeps its own bucket, which Brian approved separately (a question
 * for him: docs/BRIAN-ASKS-OPEN.md).
 */

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

