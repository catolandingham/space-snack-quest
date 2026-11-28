/**
 * The octopus with all his arms out (Brian 2026-11-24: "arms out", so the chase reads as a chase), his hug, and his
 * bored sigh. His head, hat and collar are the approved picture, untouched (docs/approved-art/guests/octopus.png,
 * drawn by guests.js drawTop); only his arms are drawn here, in the picture's own colours, swinging from hanging down
 * (as in the picture) to thrown out wide. Game positions (960 x 640). No words. For Brian's eye before it counts as
 * his look (a still goes to him).
 */
import { TEAL_PX } from "./guests.js";
import { heart, drawPuffs } from "./party-free-art.js";

// The approved picture, in its own pixels (253 x 583): where the collar ends, how wide an arm and its dark edge are,
// and its colours.
const PIC = Object.freeze({ h: 583, cut: 300, root: 288, arm: 30, edge: 9, len: 285, pink: "#dc7896", dark: "#22242c", sucker: "#ffb4be" });
// His six arms, left to right: where each joins under the collar (picture pixels from his middle) and how far it
// swings out from hanging straight down (radians; over a quarter turn points up). The middle two are the ones he
// walks on.
const ARMS = Object.freeze([
  { x: -84, out: -2.15, wave: 0.22 },
  { x: -56, out: -1.35, wave: 0.16 },
  { x: -22, out: -0.2, wave: 0.3, leg: true },
  { x: 22, out: 0.2, wave: 0.3, leg: true },
  { x: 56, out: 1.35, wave: 0.16 },
  { x: 84, out: 2.15, wave: 0.22 },
]);

// One arm as a bent, round-ended strip from (x0, y0) to (x1, y1), `bend` pushing its middle sideways, with two suckers.
function arm(ctx, k, x0, y0, x1, y1, bend) {
  const mx = (x0 + x1) / 2,
    my = (y0 + y1) / 2,
    len = Math.hypot(x1 - x0, y1 - y0) || 1,
    cx = mx - ((y1 - y0) / len) * bend,
    cy = my + ((x1 - x0) / len) * bend;
  ctx.lineCap = "round";
  for (const [color, w] of [[PIC.dark, PIC.arm + PIC.edge * 2], [PIC.pink, PIC.arm]]) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo(cx, cy, x1, y1);
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(color === PIC.dark ? 3 : 1.6, w * k);
    ctx.stroke();
  }
  for (const u of [0.45, 0.8]) {
    const v = 1 - u,
      px = v * v * x0 + 2 * v * u * cx + u * u * x1,
      py = v * v * y0 + 2 * v * u * cy + u * u * y1;
    ctx.beginPath();
    ctx.arc(px, py, Math.max(1, 5 * k), 0, Math.PI * 2);
    ctx.fillStyle = PIC.sucker;
    ctx.fill();
  }
}

/**
 * Where arm `i` joins him and where its tip is, with his arms `out` (0 hanging as in the picture, 1 thrown out) at
 * time `t`. `toward` (-1 or 1) is the side Squatch is on: the arms on that side reach a little further.
 */
export function armAt(i, x, y, adult, out, t, toward = 0) {
  const k = adult / TEAL_PX,
    a = ARMS[i],
    side = Math.sign(a.x),
    reach = a.leg ? 1 : 1 + 0.12 * out * (side === toward ? 1 : 0),
    ang = (a.out + Math.sin(t * (a.leg ? 9 : 7) + i * 1.9) * a.wave) * out,
    x0 = x + a.x * k,
    y0 = y - (PIC.h - PIC.root) * k,
    len = PIC.len * k * reach * (a.leg ? 1 : 1 - 0.1 * out);
  return { x0, y0, x1: x0 + Math.sin(ang) * len, y1: y0 + Math.cos(ang) * len, bend: Math.sin(t * 5 + i) * 10 * k * out + side * 14 * k * out * (a.leg ? 0 : 1) };
}

/**
 * The octopus standing at feet (x, y) with his arms `g.arms.k` out (the teal guest `adult` tall). In a hug the two
 * arms on Squatch's side are left for drawHug, which draws them round Squatch, on top of him. Returns false when his
 * picture is not ready.
 */
export function drawOctopusArmsOut(ctx, guestArt, g, adult, t) {
  const k = adult / TEAL_PX,
    A = g.arms;
  ctx.save();
  ARMS.forEach((a, i) => {
    if (A.hug && !a.leg && Math.sign(a.x) === A.toward) return;
    const p = armAt(i, g.x, g.y, adult, A.k, t, A.toward);
    arm(ctx, k, p.x0, p.y0, p.x1, p.y1, p.bend);
  });
  ctx.restore();
  const ok = guestArt.drawTop(ctx, g.id, g.x, g.y, adult, t, PIC.cut);
  // bored: a sigh by his mouth as his arms drop
  A.bored && drawPuffs(ctx, g.x + 12, g.y - 0.62 * adult, t);
  return ok;
}

/**
 * The hug: his two arms on Squatch's side wrapped round Squatch's middle (drawn over Squatch, below his face), and
 * two small hearts popping up between them. `sq` is Squatch's feet and `sk` his scale; `h` runs 0 to 1 over the squeeze.
 */
export function drawHug(ctx, g, sq, sk, adult, t, h) {
  const k = adult / TEAL_PX,
    side = g.arms.toward || 1,
    pulse = 1 + Math.sin(t * 16) * 0.06,
    y0 = g.y - (PIC.h - PIC.root) * k;
  ctx.save();
  // round his chest and round his middle, ending just past his far side
  [
    [84, -27],
    [56, -13],
  ].forEach(([rx, up], i) => {
    const x0 = g.x + side * rx * k,
      x1 = sq.x + side * 21 * sk * pulse,
      y1 = sq.y + up * sk;
    arm(ctx, k, x0, y0, x1, y1, side * (i ? 9 : -7) * sk);
  });
  ctx.restore();
  const mx = (g.x + sq.x) / 2,
    top = Math.min(g.y - 0.95 * adult, sq.y - 58 * sk);
  for (const [dx, ph] of [[-9, 0], [9, 0.45]]) {
    const u = (h * 1.4 + ph) % 1;
    ctx.save();
    ctx.globalAlpha = 1 - u * 0.8;
    heart(ctx, mx + dx, top - 4 - u * 16, 6 + u * 2, "#ff5fa8");
    ctx.restore();
  }
}
