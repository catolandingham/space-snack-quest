/**
 * The party shirt has long sleeves (Brian 2026-11-25, picking paw "C" for the snack close-up, after being told
 * "his party shirt gets long sleeves to match"). Wherever Squatch wears it (the hall, home, the dress-up closet,
 * the full-screen dance, the Polaroid), each sleeve runs down his arm, drawn the way the close-up's sleeve is
 * (sleeve-art.js: orange, outlined, spotted), with a fuzzy fur cuff and his paw out of it. On its own (in the
 * closet, flying off him, lying on the floor) the shirt hangs with both long sleeves down its sides.
 * Sizes here are in the piece's own box (`w` across, `h` tall) or in Squatch's own units (squatch-art.js).
 */
import { INK, SHIRT, SHIRT_SPOTS, sub, len, angleOf, alongLine, drawSleeve, drawCuff } from "./sleeve-art.js";
import { armEnds, SQUATCH_LOOK } from "./squatch-art.js";

const TAU = Math.PI * 2;
// On Squatch, in his units: the sleeve's width where it leaves the shoulder and at the cuff, how far before his
// paw the cuff sits, the cuff's size, and the spots' size. His paw is the room's paw (2.2, his pad colour).
export const SLEEVE = Object.freeze({ wide: 5.4, narrow: 4.6, pawGap: 3, cuff: { rx: 3.1, ry: 1.4, amp: 0.6 }, spot: 0.8, paw: 2.2, fur: 3.6, step: 1.6 });

function dot(ctx, x, y, r, color, lw) {
  ctx.beginPath();
  ctx.ellipse(x, y, r, r, 0, 0, TAU);
  ctx.fillStyle = color;
  ctx.fill();
  lw && ((ctx.lineWidth = lw), (ctx.strokeStyle = INK), ctx.stroke());
}
function body(ctx, w, h, lw, caps) {
  ctx.beginPath();
  ctx.moveTo(-w * 0.22, -h * 0.5);
  if (caps) (ctx.lineTo(-w * 0.5, -h * 0.28), ctx.lineTo(-w * 0.38, -h * 0.05), ctx.lineTo(-w * 0.3, -h * 0.12));
  else (ctx.lineTo(-w * 0.4, -h * 0.4), ctx.lineTo(-w * 0.3, -h * 0.12));
  ctx.lineTo(-w * 0.3, h * 0.5);
  ctx.lineTo(w * 0.3, h * 0.5);
  ctx.lineTo(w * 0.3, -h * 0.12);
  if (caps) (ctx.lineTo(w * 0.38, -h * 0.05), ctx.lineTo(w * 0.5, -h * 0.28));
  else ctx.lineTo(w * 0.4, -h * 0.4);
  ctx.lineTo(w * 0.22, -h * 0.5);
  ctx.quadraticCurveTo(0, -h * 0.3, -w * 0.22, -h * 0.5);
  ctx.closePath();
  ctx.fillStyle = SHIRT;
  ctx.fill();
  ctx.lineWidth = lw;
  ctx.strokeStyle = INK;
  ctx.lineJoin = "round";
  ctx.stroke();
  for (const [fx, fy, c] of [
    [-0.15, -0.05, 0],
    [0.14, 0.18, 1],
    [-0.1, 0.32, 2],
    [0.16, -0.2, 3],
  ])
    dot(ctx, w * fx, h * fy, w * 0.07, SHIRT_SPOTS[c]);
}
/**
 * The shirt, centred at (0, 0) in a box `w` across and `h` tall, outline `lw`. `onBody`: it is on Squatch's body,
 * so its sleeves follow his arms (drawShirtSleeves, drawn after); only the shoulders are drawn here. Otherwise
 * it is on its own and both long sleeves hang down its sides.
 */
export function drawShirt(ctx, w, h, lw, onBody = false) {
  if (onBody) return body(ctx, w, h, lw, true);
  for (const s of [-1, 1]) {
    const { pts } = alongLine([{ x: s * w * 0.36, y: -h * 0.36 }, { x: s * w * 0.47, y: h * 0.44 }], w * 0.12);
    drawSleeve(ctx, pts, (k) => w * (0.2 - k * 0.03), lw, w * 0.045);
  }
  body(ctx, w, h, lw, false);
}
/** His arms (as armEnds reads them) while he walks, as the room draws him: `walk` is the room's walk phase. */
export function walkArms(walk = 0) {
  const A = Math.sin(walk) * 0.5;
  return [{ a: -0.35 - A * 0.4 }, { a: 0.35 + A * 0.4 }];
}
/**
 * The long sleeves on Squatch, in his units (feet at 0, facing us; the caller has scaled and mirrored), over
 * his arms `arms` (armEnds: null is at rest): each sleeve from his shoulder to just before his paw, a fur cuff,
 * and his paw out of it. `lw` the outline; `pawLine` outlines the paw too (the dance's paws are outlined), and
 * `pawR` sizes it. Drawn over what he wears, as his arms are (a paw on his belly is on top of the shirt).
 */
export function drawShirtSleeves(ctx, arms, lw, { pawLine = 0, pawR = SLEEVE.paw } = {}) {
  const q = SQUATCH_LOOK,
    S = SLEEVE;
  armEnds(arms).forEach((a, i) => {
    const fur = i === 0 ? q.dark : q.fur,
      corners = a.elbow === a.hand ? [a.shoulder, a.hand] : [a.shoulder, a.elbow, a.hand],
      total = corners.slice(1).reduce((n, c, j) => n + len(sub(c, corners[j])), 0),
      { pts } = alongLine(corners, S.step, total - S.pawGap),
      cuff = pts[pts.length - 1],
      along = angleOf(pts[pts.length - 2], cuff);
    // his arm from the cuff to his paw, then the sleeve, the cuff over where they meet, and his paw
    ctx.lineCap = "round";
    for (const [w, c] of [
      [S.fur + lw * 2, INK],
      [S.fur, fur],
    ]) {
      ctx.beginPath();
      ctx.moveTo(cuff.x, cuff.y);
      ctx.lineTo(a.hand.x, a.hand.y);
      ctx.lineWidth = w;
      ctx.strokeStyle = c;
      ctx.stroke();
    }
    drawSleeve(ctx, pts, (k) => S.wide - k * (S.wide - S.narrow), lw, S.spot);
    drawCuff(ctx, cuff, along, S.cuff.rx, S.cuff.ry, S.cuff.amp, lw, fur);
    dot(ctx, a.hand.x, a.hand.y, pawR, q.mask, pawLine);
  });
}
