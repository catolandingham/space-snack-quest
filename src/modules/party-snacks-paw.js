/**
 * His paw in the snack close-up (Brian 2026-11-25: "C"): his arm in the orange spotted party sleeve, coming up
 * from below the picture, with a fuzzy fur cuff and only a round furry mitten paw out. It looks like a glove,
 * which sets up the bartender's "...Nice gloves." No bare arm shows anywhere. The paw draws the snack it holds,
 * between his palm and his fingers (party-snacks-art.js then does not draw it again).
 * Drawn from the designer's option sheet (tests/out/for-brian-2026-11-24/paw-bartender-options, PAW_C).
 * The party passes drawSnackPaw to the close-up in place of the engine's paw arm; Day 2's cut-ins keep that one.
 */
import { INK, sub, len, norm, angleOf, alongCurve, drawSleeve, drawCuff } from "./sleeve-art.js";
import { drawSnack, SNACK_SIZE } from "./party-snacks-art.js";
import { sleeveEnds } from "./party-snacks.js";

const TAU = Math.PI * 2;
// Squatch's own colours (squatch-art.js SQUATCH_LOOK).
const FUR = "#6b4428",
  DARK = "#55351f",
  HI = "#8a5a36";
const OW = 5; // outline, game pixels (2 on a phone)
// The sleeve: how wide where it comes in and at the cuff, the cuff's size, and how often a point is placed along
// it (where it starts and ends: party-snacks.js sleeveEnds).
export const PAW_ART = Object.freeze({ wide: 92, narrow: 76, cuff: { rx: 48, ry: 22, amp: 9 }, step: 26 });
// How far a held snack's sides reach out from its middle, by kind (his fingers curl round there).
const HALF = { pie: 56, cup: 44, cake: 62, apple: 50 };

// Shapes outlined first and filled second, so the outline runs round the whole mitten and not between its parts.
function blob(ctx, shapes, color, ow, passes = [0, 1]) {
  for (const pass of passes)
    for (const s of shapes) {
      ctx.beginPath();
      ctx.ellipse(s.x, s.y, s.rx, s.ry, s.r || 0, 0, TAU);
      if (pass) ((ctx.fillStyle = color), ctx.fill());
      else ((ctx.lineWidth = ow * 2), (ctx.strokeStyle = INK), ctx.stroke());
    }
}
function stroke(ctx, pts, color, w) {
  ctx.beginPath();
  ctx.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
  ctx.lineWidth = w;
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  ctx.stroke();
}
/**
 * His paw, a round furry mitten, the back of his hand to us: (x, y) its middle, `ang` the way his fingers point
 * (0 = up), `s` its size, `mode` "rest" (relaxed) or "reach" (fingers a little apart). `passes` [0] draws only its
 * outline, [1] only its fill.
 */
export function drawMitten(ctx, x, y, ang, s, mode = "rest", passes = [0, 1]) {
  const open = mode === "reach" ? 1 : 0;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ang);
  ctx.scale(s, s);
  blob(
    ctx,
    [
      { x: 0, y: 6, rx: 36, ry: 31 },
      { x: -22 - open * 3, y: -20, rx: 14, ry: 15 },
      { x: 0, y: -27 - open * 3, rx: 15, ry: 15 },
      { x: 22 + open * 3, y: -20, rx: 14, ry: 15 },
      { x: -38 - open * 4, y: 8, rx: 12, ry: 17, r: -0.6 - open * 0.3 },
    ],
    FUR,
    OW / s,
    passes,
  );
  if (passes.includes(1)) {
    // a lighter patch on the back of his hand, creases between the fingers, fur wisps at the wrist
    ctx.beginPath();
    ctx.ellipse(10, -2, 13, 9, 0, 0, TAU);
    ctx.fillStyle = HI;
    ctx.fill();
    for (const cx of [-11, 11]) stroke(ctx, [cx, -22, cx * 0.9, -11], DARK, 3.5);
    for (const [a, b, c, d] of [
      [-28, 30, -36, 44],
      [-8, 36, -10, 50],
      [12, 36, 14, 50],
      [30, 28, 40, 40],
    ])
      stroke(ctx, [a, b, c, d], FUR, 7);
  }
  ctx.restore();
}
// Further into the picture (higher up), the paw is a little smaller.
const depth = (y) => 1.12 - Math.max(0, Math.min(1, (640 - y) / 540)) * 0.22;
// The arm bows out sideways a little, more for a longer reach.
function bow(root, end, k = 0.18) {
  const d = sub(end, root),
    L = len(d),
    n = norm({ x: -d.y, y: d.x }),
    s = n.x + n.y >= 0 ? 1 : -1;
  return [
    { x: root.x + d.x * 0.33 + n.x * L * k * s, y: root.y + d.y * 0.33 + n.y * L * k * s },
    { x: root.x + d.x * 0.7 + n.x * L * k * 0.6 * s, y: root.y + d.y * 0.7 + n.y * L * k * 0.6 * s },
  ];
}
/**
 * His sleeved arm and paw, the paw's middle at `paw`. `held` is the kind of snack in it (or null); `reaching`
 * opens his fingers. Returns what it drew: { snack: true } (it draws the held snack itself), the sleeve's middle
 * line `sleeve` (from below the picture to the cuff) and the `cuff` (its middle, and `low`, its lowest point).
 */
export function drawSnackPaw(ctx, paw, held, reaching) {
  const { root, cuff } = sleeveEnds(paw),
    [c1, c2] = bow(root, cuff),
    { pts } = alongCurve(root, c1, c2, cuff, PAW_ART.step),
    end = pts[pts.length - 1],
    along = angleOf(pts[pts.length - 2], end),
    s = depth(paw.y),
    ang = held ? 0 : angleOf(cuff, paw),
    py = held ? paw.y + 6 : paw.y,
    ps = held ? s * 0.95 : s,
    mode = held || !reaching ? "rest" : "reach",
    C = PAW_ART.cuff;
  ctx.save();
  drawSleeve(ctx, pts, (k) => PAW_ART.wide - k * (PAW_ART.wide - PAW_ART.narrow), OW, 9);
  // the cuff and the paw are one furry piece: both outlined, then both filled (no line across his wrist)
  drawCuff(ctx, end, along, C.rx, C.ry, C.amp, OW, FUR, 0);
  drawMitten(ctx, paw.x, py, ang, ps, mode, [0]);
  drawCuff(ctx, end, along, C.rx, C.ry, C.amp, OW, FUR, 1);
  drawMitten(ctx, paw.x, py, ang, ps, mode, [1]);
  if (held) {
    // the snack sits in his palm, his fingers curled round its sides
    const sy = paw.y - 34,
      hw = HALF[held] || 50;
    drawSnack(ctx, held, paw.x, sy, SNACK_SIZE.cut, 0, 0, 2);
    ctx.translate(paw.x, sy);
    blob(ctx, [{ x: -hw + 4, y: 14, rx: 13, ry: 17, r: 0.4 }], FUR, OW);
    blob(ctx, [{ x: hw - 4, y: 2, rx: 13, ry: 14 }, { x: hw - 2, y: 24, rx: 13, ry: 14 }], FUR, OW);
  }
  ctx.restore();
  // (the cuff's lowest point: below it only sleeve shows)
  const low = end.y + Math.hypot((C.ry + C.amp) * Math.cos(along), (C.rx + C.amp) * Math.sin(along));
  return { snack: true, sleeve: pts.map((q) => ({ x: Math.round(q.x), y: Math.round(q.y) })), cuff: { x: Math.round(end.x), y: Math.round(end.y), low: Math.ceil(low) } };
}
