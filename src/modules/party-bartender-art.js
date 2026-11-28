/**
 * The bartender in the snack close-up (Brian 2026-11-25: "1", the same bartender, drawn properly for the
 * close-up): red shirt, white apron, dark hair in a bun with a yellow star clip, her waist at the counter and her
 * whole body inside the picture, clear of LEAVE · bar. Whether she is looking is carried by her body alone (Brian:
 * no eye sign beside her):
 *   - her back: busy at the shelf, one arm up putting a cup away, humming (music notes);
 *   - turning: side-on, looking toward the snacks, with motion arcs round her;
 *   - facing him: her face and wide eyes on the pyramid; when she sees his paw out, her eyes go wider, her brows
 *     shoot up and her mouth opens in a gasp.
 * The hall's bartender is unchanged (party-art.js LOOKS.bartender). Drawn from the designer's option sheet
 * (tests/out/for-brian-2026-11-24/paw-bartender-options, b1). The close-up draws the counter after her.
 */
import { rr, oval, line, INK, drawNote } from "./party-art.js";

const RED = "#e5533d",
  WHITE = "#fffdf8",
  SKIN = "#e7b48f",
  HAIR = "#4a3020",
  STRAND = "#6b4a33",
  CLIP = "#ffcf33",
  CUP = "#8fdcff",
  BLUSH = "#f2a08a",
  GASP = "#8a2b22",
  OW = 5;
// Her head's middle (y) in the picture; her body runs from her shoulders (322) down behind the counter.
export const BAR_HEAD_Y = 236;
/** Which drawing she is in at `turn` (0 her back, 1 facing him): "back", "side" or "front". */
export const barView = (turn) => (turn < 0.34 ? "back" : turn < 0.72 ? "side" : "front");

function fillOutlined(ctx, color, lw = OW) {
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = lw;
  ctx.strokeStyle = INK;
  ctx.lineJoin = "round";
  ctx.stroke();
}
// An arm: a round-ended thick line with an outline.
function capsule(ctx, x0, y0, x1, y1, w, color) {
  for (const [lw, c] of [
    [w + OW * 2, INK],
    [w, color],
  ])
    line(ctx, [x0, y0, x1, y1], c, lw);
}
function star(ctx, x, y, r) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5,
      d = i % 2 ? r * 0.45 : r;
    ctx.lineTo(x + Math.cos(a) * d, y + Math.sin(a) * d);
  }
  ctx.closePath();
  fillOutlined(ctx, CLIP, 3);
}
// Motion arcs round her as she spins.
function whoosh(ctx, cx, cy) {
  for (const [r, a0, a1, w] of [
    [150, -0.5, 0.6, 7],
    [176, -0.3, 0.4, 5],
    [150, Math.PI - 0.6, Math.PI + 0.5, 7],
    [176, Math.PI - 0.4, Math.PI + 0.3, 5],
  ]) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, a0, a1);
    ctx.lineWidth = w;
    ctx.strokeStyle = INK;
    ctx.lineCap = "round";
    ctx.stroke();
  }
}
// She hums at her shelf: three notes drifting up and away.
function hum(ctx, x, y, t) {
  ["#ff5fa8", "#3478f6", "#2bc48a"].forEach((col, i) => {
    const k = (t * 0.4 + i / 3) % 1;
    ctx.save();
    ctx.globalAlpha *= k < 0.2 ? k / 0.2 : k > 0.8 ? (1 - k) / 0.2 : 1;
    drawNote(ctx, x - k * 60 - i * 10, y - k * 90, 18, col);
    ctx.restore();
  });
}
function back(ctx, X, HY, t) {
  capsule(ctx, X - 92, 360, X - 104, 520, 40, RED); // her far arm, down
  rr(ctx, X - 88, 322, 176, 220, 46, RED, OW);
  // her arm up at the shelf, putting a cup away
  capsule(ctx, X + 66, 352, X + 52, 150, 40, RED);
  oval(ctx, X + 50, 128, 20, 20, SKIN, OW);
  rr(ctx, X + 30, 74, 40, 48, 6, CUP, OW);
  rr(ctx, X + 26, 66, 48, 14, 4, WHITE, 3.5);
  // the apron's strings, tied in a bow at her back
  rr(ctx, X - 88, 470, 176, 16, 4, WHITE, 3.5);
  oval(ctx, X - 22, 476, 24, 15, WHITE, 3.5);
  oval(ctx, X + 22, 476, 24, 15, WHITE, 3.5);
  capsule(ctx, X - 6, 484, X - 20, 530, 11, WHITE);
  capsule(ctx, X + 6, 484, X + 20, 530, 11, WHITE);
  oval(ctx, X, 477, 9, 10, WHITE, 3.5);
  rr(ctx, X - 18, 296, 36, 34, 8, SKIN, OW); // neck
  // the back of her head: all hair, the bun, her star clip
  oval(ctx, X, HY, 64, 66, HAIR, OW);
  oval(ctx, X, HY - 80, 30, 26, HAIR, OW);
  star(ctx, X + 24, HY - 92, 15);
  line(ctx, [X - 30, HY - 30, X - 12, HY + 20], STRAND, 5);
  line(ctx, [X + 26, HY - 34, X + 14, HY + 14], STRAND, 5);
  hum(ctx, X - 70, HY - 40, t);
}
function side(ctx, X, HY) {
  whoosh(ctx, X, 330);
  rr(ctx, X - 60, 322, 120, 220, 40, RED, OW);
  rr(ctx, X - 66, 360, 34, 180, 8, WHITE, OW); // the apron's front edge
  capsule(ctx, X + 4, 350, X - 14, 500, 38, RED);
  rr(ctx, X - 16, 296, 32, 34, 8, SKIN, OW);
  // her head side-on, looking left, toward the snacks
  oval(ctx, X - 4, HY, 56, 64, SKIN, OW);
  ctx.beginPath();
  ctx.moveTo(X - 26, HY - 58);
  ctx.quadraticCurveTo(X + 30, HY - 84, X + 56, HY - 10);
  ctx.quadraticCurveTo(X + 60, HY + 40, X + 30, HY + 58);
  ctx.quadraticCurveTo(X + 10, HY + 10, X + 6, HY - 30);
  ctx.quadraticCurveTo(X - 10, HY - 40, X - 26, HY - 58);
  fillOutlined(ctx, HAIR);
  oval(ctx, X + 34, HY - 76, 28, 24, HAIR, OW);
  star(ctx, X + 50, HY - 88, 14);
  oval(ctx, X - 64, HY + 12, 10, 12, SKIN, OW); // her nose
  oval(ctx, X - 30, HY - 6, 12, 15, WHITE, 4);
  oval(ctx, X - 36, HY - 3, 6, 7, INK);
  line(ctx, [X - 44, HY - 30, X - 18, HY - 34], INK, 5);
  line(ctx, [X - 50, HY + 34, X - 34, HY + 34], INK, 4);
}
function front(ctx, X, HY, alarmed) {
  // both hands on the counter, her face and wide eyes on the snacks
  for (const s of [-1, 1]) {
    capsule(ctx, X + s * 84, 356, X + s * 108, 490, 40, RED);
    oval(ctx, X + s * 110, 498, 22, 16, SKIN, OW);
  }
  rr(ctx, X - 88, 322, 176, 220, 46, RED, OW);
  rr(ctx, X - 58, 352, 116, 190, 14, WHITE, OW);
  rr(ctx, X - 30, 420, 60, 34, 6, "#e8e2d4", 3.5);
  line(ctx, [X - 56, 354, X - 30, 318], INK, 4);
  line(ctx, [X + 56, 354, X + 30, 318], INK, 4);
  rr(ctx, X - 18, 296, 36, 34, 8, SKIN, OW);
  oval(ctx, X, HY - 80, 30, 26, HAIR, OW);
  star(ctx, X + 24, HY - 92, 15);
  oval(ctx, X, HY, 60, 64, SKIN, OW);
  // her hair: a fringe across the top, down the sides
  ctx.beginPath();
  ctx.moveTo(X - 62, HY + 10);
  ctx.quadraticCurveTo(X - 66, HY - 66, X, HY - 66);
  ctx.quadraticCurveTo(X + 66, HY - 66, X + 62, HY + 10);
  ctx.quadraticCurveTo(X + 48, HY - 24, X + 10, HY - 30);
  ctx.quadraticCurveTo(X - 4, HY - 14, X - 30, HY - 26);
  ctx.quadraticCurveTo(X - 52, HY - 20, X - 62, HY + 10);
  fillOutlined(ctx, HAIR);
  oval(ctx, X - 38, HY + 26, 10, 7, BLUSH);
  oval(ctx, X + 38, HY + 26, 10, 7, BLUSH);
  const big = alarmed ? 1.25 : 1;
  for (const ex of [-22, 22]) {
    oval(ctx, X + ex, HY + 4, 14 * big, 17 * big, WHITE, 4);
    oval(ctx, X + ex - 6, HY + 8, 7, 8, INK); // looking down and left, at the snacks
    oval(ctx, X + ex - 8, HY + 5, 2.4, 2.4, WHITE);
    alarmed ? line(ctx, [X + ex - 14, HY - 24, X + ex + 12, HY - 30 + (ex < 0 ? 4 : 0)], INK, 6) : line(ctx, [X + ex - 12, HY - 16, X + ex + 12, HY - 16], INK, 5);
  }
  if (alarmed) oval(ctx, X, HY + 38, 8, 10, GASP, 4); // the gasp
  else {
    ctx.beginPath();
    ctx.arc(X, HY + 28, 14, 0.3, Math.PI - 0.3);
    ctx.lineWidth = 5;
    ctx.strokeStyle = INK;
    ctx.stroke();
  }
}
/**
 * The bartender standing at `at.x` behind the counter, turned by `turn` (0 her back to him, 1 facing him): her
 * back, side-on, or her front (barView), bobbing a little as she works. `alarmed`: she sees his paw out.
 * Returns the view drawn.
 */
export function drawBartender(ctx, at, turn, t, alarmed) {
  const view = barView(turn);
  ctx.save();
  ctx.translate(0, Math.sin(t * 2) * 3);
  view === "back" ? back(ctx, at.x, BAR_HEAD_Y, t) : view === "side" ? side(ctx, at.x, BAR_HEAD_Y) : front(ctx, at.x, BAR_HEAD_Y, alarmed);
  ctx.restore();
  return view;
}
