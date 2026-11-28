/**
 * His party shirt's long sleeve (Brian 2026-11-25, paw "C": "his arm in the orange spotted party sleeve with a
 * fur cuff, only a round fuzzy paw out"). One drawing, two sizes: the snack close-up's big arm
 * (party-snacks-paw.js, in game pixels) and the sleeves on Squatch wherever he wears the shirt
 * (party-shirt-art.js, in his own units). A sleeve is a tube along a line of points: orange, outlined, with
 * spots on alternate sides; where it ends, a fuzzy cuff of his fur.
 * It imports nothing (party-art.js draws the shirt through it).
 */
export const INK = "#1e2430";
export const SHIRT = "#ff8a3d";
export const SHIRT_SPOTS = Object.freeze(["#2bc48a", "#3478f6", "#ffcf33", "#ff5fa8"]);
const TAU = Math.PI * 2;

export const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
export const len = (v) => Math.hypot(v.x, v.y);
export const norm = (v) => {
  const l = len(v) || 1;
  return { x: v.x / l, y: v.y / l };
};
/** The angle a line points along (0 = up), from `from` to `to`. */
export const angleOf = (from, to) => Math.atan2(to.x - from.x, -(to.y - from.y));

/** Points along a polyline, every `step` (at least three), from its start to `upTo` along it. */
export function alongLine(corners, step, upTo = Infinity) {
  const segs = [];
  let total = 0;
  for (let i = 1; i < corners.length; i++) {
    const l = len(sub(corners[i], corners[i - 1]));
    segs.push(l);
    total += l;
  }
  const end = Math.min(total, upTo),
    n = Math.max(2, Math.round(end / step)),
    out = [];
  for (let j = 0; j <= n; j++) {
    let d = (end * j) / n,
      i = 0;
    while (i < segs.length - 1 && d > segs[i]) d -= segs[i++];
    const k = segs[i] ? Math.min(1, d / segs[i]) : 0,
      a = corners[i],
      b = corners[i + 1];
    out.push({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k });
  }
  return { pts: out, total };
}
/** Points along a cubic curve, evenly spaced about every `step` (at least three). */
export function alongCurve(p0, p1, p2, p3, step) {
  const raw = [];
  for (let i = 0; i <= 80; i++) {
    const t = i / 80,
      u = 1 - t;
    raw.push({
      x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
      y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
    });
  }
  return alongLine(raw, step);
}
/** The left and right edges of a tube along `pts`, `w(k)` wide at k (0 its start, 1 its end), with outward normals. */
export function edges(pts, w) {
  const L = [],
    R = [];
  pts.forEach((p, i) => {
    const a = pts[Math.max(0, i - 1)],
      b = pts[Math.min(pts.length - 1, i + 1)],
      d = norm(sub(b, a)),
      n = { x: -d.y, y: d.x },
      hw = w(i / (pts.length - 1)) / 2;
    L.push({ x: p.x + n.x * hw, y: p.y + n.y * hw, n });
    R.push({ x: p.x - n.x * hw, y: p.y - n.y * hw, n: { x: -n.x, y: -n.y } });
  });
  return { L, R };
}
/** A tube's outline as a path: scalloped by `amp` (fur) or smooth (0). */
export function tubePath(ctx, pts, w, amp = 0) {
  const { L, R } = edges(pts, w);
  ctx.beginPath();
  ctx.moveTo(L[0].x, L[0].y);
  const run = (E) => {
    for (let i = 1; i < E.length; i++) {
      const a = E[i - 1],
        b = E[i];
      if (amp) ctx.quadraticCurveTo((a.x + b.x) / 2 + b.n.x * amp, (a.y + b.y) / 2 + b.n.y * amp, b.x, b.y);
      else ctx.lineTo(b.x, b.y);
    }
  };
  run(L);
  const Rr = R.slice().reverse();
  ctx.lineTo(Rr[0].x, Rr[0].y);
  run(Rr);
  ctx.closePath();
}
/** A fuzzy oval path (Squatch's furry edge): `n` bumps of `amp` round an ellipse. */
export function fuzzyOval(ctx, cx, cy, rx, ry, n, amp, start = -Math.PI / 2) {
  ctx.beginPath();
  for (let i = 0; i <= n; i++) {
    const a = start + (i / n) * TAU,
      px = cx + Math.cos(a) * rx,
      py = cy + Math.sin(a) * ry;
    if (!i) {
      ctx.moveTo(px, py);
      continue;
    }
    const m = start + ((i - 0.5) / n) * TAU;
    ctx.quadraticCurveTo(cx + Math.cos(m) * (rx + amp), cy + Math.sin(m) * (ry + amp), px, py);
  }
  ctx.closePath();
}
function dot(ctx, x, y, r, color) {
  ctx.beginPath();
  ctx.ellipse(x, y, r, r, 0, 0, TAU);
  ctx.fillStyle = color;
  ctx.fill();
}
/**
 * The sleeve along `pts`, `w(k)` wide, outlined `line` thick, with spots of radius `spot` on alternate sides (the
 * shirt's own four colours, in turn).
 */
export function drawSleeve(ctx, pts, w, line, spot) {
  tubePath(ctx, pts, w, 0);
  ctx.fillStyle = SHIRT;
  ctx.fill();
  ctx.lineWidth = line;
  ctx.strokeStyle = INK;
  ctx.lineJoin = "round";
  ctx.stroke();
  const { L, R } = edges(pts, (k) => w(k) * 0.45);
  for (let i = 1; i < pts.length - 1; i += 2) {
    const p = i % 4 === 1 ? L[i] : R[i];
    dot(ctx, p.x, p.y, spot, SHIRT_SPOTS[i % 4]);
  }
}
/**
 * The fuzzy fur cuff where his paw comes out of the sleeve: at `at`, across the sleeve (`ang` the way the sleeve
 * points, 0 = up), `rx` across and `ry` along it. `pass` 0 draws its outline only, 1 its fill only (so it can be
 * one piece with the paw), and leaving it out draws both.
 */
export function drawCuff(ctx, at, ang, rx, ry, amp, line, fur, pass = -1) {
  ctx.save();
  ctx.translate(at.x, at.y);
  ctx.rotate(ang);
  fuzzyOval(ctx, 0, 0, rx, ry, 10, amp);
  if (pass !== 1) ((ctx.lineWidth = line * 2), (ctx.strokeStyle = INK), (ctx.lineJoin = "round"), ctx.stroke());
  if (pass !== 0) ((ctx.fillStyle = fur), ctx.fill());
  ctx.restore();
}
