/**
 * The snack bar (party plan P6, "Snacks"; CUT-IN-SPEC; settled 2026-11-22: "a few stars per swiped snack, with
 * the topple as the risk"). At the bar a paw icon opens the close-up, inside the picture as before: the bartender
 * behind the counter, the snack pyramid, his paw. Drag snacks into the bag while her back is turned; each one is a
 * few stars. If she turns while his paw holds a snack: "...Nice gloves."; the second time: "Wait a second... fur!"
 * and she runs to the alarm. After about five snacks the pyramid topples in a chain: the zoom pulls back, a flying
 * cup knocks a piece of his outfit off so fur shows, and everyone turns to stare for 4 seconds (R60, approved).
 *
 * State on the party's game-state object `p`: p.snack (the open close-up, or null) and p.snacks (kept on a
 * restart: how many he took, whether the pyramid fell, the chain's progress). Words come from party-lines.js.
 */
import { rr, oval, line, INK, drawPerson, LOOKS } from "./party-art.js";
import { PYRAMID } from "./party-hall.js";

// PLACEHOLDERS for Brian: stars per snack ("a few"), how many snacks before the pyramid topples ("about five"),
// the bartender's rhythm (seconds with her back turned, then a glance, then facing the room), and the chain's length.
export const SNACK_STARS = 5;
export const TOPPLE_AFTER = 5;
export const BAR = Object.freeze({ backs: [5, 4, 6, 4.5], glance: 0.9, face: 2, zoom: 0.4, chain: 1.8, cupAt: 0.45 });
// Pinned (R60): how long everyone stares after the spill.
export const SNACK_LOOK_SECONDS = 4;

// The close-up's layout, in game positions: the pyramid of ten snacks, the bag, the close button, the bartender.
export const CUT = Object.freeze({
  snacks: Object.freeze([
    ["cake", 480, 250],
    ["cup", 456, 292],
    ["pie", 504, 292],
    ["apple", 432, 334],
    ["pie", 480, 334],
    ["cup", 528, 334],
    ["pie", 408, 382],
    ["apple", 456, 382],
    ["cake", 504, 382],
    ["cup", 552, 382],
  ]),
  bag: Object.freeze({ x0: 24, y0: 470, x1: 190, y1: 626 }),
  close: Object.freeze({ x: 880, y: 560, r: 44 }),
  bartender: Object.freeze({ x: 760, y: 470, h: 250 }),
  grab: 30,
});

/** Opens the close-up (the paw icon at the bar). */
export function openSnacks(p) {
  const s = p.snacks || (p.snacks = { bag: 0, taken: [], toppled: false, chain: -1 });
  p.snack = { zoom: 0, paw: { x: 480, y: 560 }, held: -1, phase: "back", t: 0, back: 0, catches: s.catches || 0 };
  return p.snack;
}
export function closeSnacks(p) {
  p.snacks && p.snack && (p.snacks.catches = p.snack.catches);
  p.snack = null;
}
const backFor = (c) => BAR.backs[c.back % BAR.backs.length];
/**
 * One frame of the bartender in the close-up. Returns "catch1" or "catch2" when she turns and sees his paw
 * holding a snack, else "".
 */
export function tickSnacks(p, dt) {
  const c = p.snack;
  if (!c) return "";
  c.zoom = Math.min(1, c.zoom + dt / BAR.zoom);
  if (c.zoom < 1) return "";
  c.t += dt;
  if (c.phase === "back" && c.t >= backFor(c)) ((c.phase = "glance"), (c.t = 0));
  else if (c.phase === "glance" && c.t >= BAR.glance) ((c.phase = "face"), (c.t = 0));
  else if (c.phase === "face") {
    if (c.held >= 0) {
      c.held = -1;
      c.catches += 1;
      c.phase = "back";
      c.t = 0;
      c.back += 1;
      return c.catches === 1 ? "catch1" : "catch2";
    }
    c.t >= BAR.face && ((c.phase = "back"), (c.t = 0), (c.back += 1));
  }
  return "";
}
/** A finger or the mouse in the close-up (game positions). Returns "close", "grab", "bag", "topple" or "". */
export function snackPointer(p, kind, x, y) {
  const c = p.snack,
    s = p.snacks;
  if (!c || c.zoom < 1) return "";
  c.paw = { x, y };
  if (kind === "down" && Math.hypot(x - CUT.close.x, y - CUT.close.y) < CUT.close.r) return "close";
  if (kind === "down") {
    let best = -1,
      bd = CUT.grab;
    CUT.snacks.forEach(([, sx, sy], i) => {
      const d = Math.hypot(x - sx, y - sy);
      !s.taken.includes(i) && d < bd && ((bd = d), (best = i));
    });
    c.held = best;
    return best >= 0 ? "grab" : "";
  }
  if (kind === "up" && c.held >= 0) {
    const i = c.held;
    c.held = -1;
    const b = CUT.bag;
    if (x > b.x0 && x < b.x1 && y > b.y0 && y < b.y1) {
      s.taken.push(i);
      s.bag += 1;
      return s.bag >= TOPPLE_AFTER ? "topple" : "bag";
    }
  }
  return "";
}
/** The pyramid falls: the chain at the bar starts (the close-up closes). */
export function startTopple(p) {
  p.snacks.toppled = true;
  p.snacks.chain = 0;
}
/** Every frame: the chain's progress (0 to 1). Returns "cup" the frame the flying cup reaches him, "crash" on each fall. */
export function tickTopple(p, dt) {
  const s = p.snacks;
  if (!s || s.chain < 0 || s.chain >= 1) return "";
  const was = s.chain;
  s.chain = Math.min(1, s.chain + dt / BAR.chain);
  for (const at of [0.05, 0.3, 0.55, 0.8]) if (was < at && s.chain >= at) return at === 0.55 ? "cup" : "crash";
  return "";
}

// ---------- drawing ----------
/** One snack, `sc` times its close-up size, at (x, y). */
export function drawSnack(ctx, kind, x, y, sc = 1, rot = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(sc, sc);
  if (kind === "pie") {
    oval(ctx, 0, 0, 18, 18, "#e7c08a", 3);
    oval(ctx, 0, 0, 8, 8, "#6b3a1c");
    line(ctx, [-6, -2, 6, 2], "#fff3d6", 2);
  } else if (kind === "cup") {
    rr(ctx, -12, -16, 24, 28, 4, "#8fdcff", 3);
    rr(ctx, -14, -22, 28, 8, 3, "#ffffff", 2);
  } else if (kind === "cake") {
    rr(ctx, -20, -12, 40, 24, 4, "#fffdf8", 3);
    oval(ctx, 0, -18, 5, 5, "#e5533d");
    oval(ctx, -8, -4, 3, 3, "#3478f6");
  } else {
    oval(ctx, 0, 0, 16, 16, "#e5533d", 3);
    line(ctx, [0, -14, 6, -24], "#3f8f4a", 3);
    oval(ctx, -4, -2, 3, 3, "#fff3d6");
  }
  ctx.restore();
}
/** The bartender seen from behind (her back turned to the room, working the shelf): apron ties and her hair bun. */
export function drawBartenderBack(ctx, x, y, h) {
  const k = h / 100,
    L = LOOKS.bartender;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  const ow = Math.max(1, h * 0.022) / k;
  rr(ctx, -9, -34, 8, 32, 2, L.pants, ow);
  rr(ctx, 1, -34, 8, 32, 2, L.pants, ow);
  rr(ctx, -21, -70, 7, 30, 3, L.shirt, ow);
  rr(ctx, 14, -70, 7, 30, 3, L.shirt, ow);
  rr(ctx, -15, -72, 30, 40, 7, L.shirt, ow);
  // the apron's bow at the back
  line(ctx, [-12, -46, 12, -46], "#fffdf8", 3);
  oval(ctx, -4, -46, 4, 3, "#fffdf8", ow * 0.7);
  oval(ctx, 4, -46, 4, 3, "#fffdf8", ow * 0.7);
  oval(ctx, 0, -84, 12, 12, L.hair, ow);
  oval(ctx, 0, -99, 5, 4, L.hair, ow);
  ctx.restore();
}
/** The paw icon over the bar that opens the close-up: a big paw in a white disc, pulsing gently. */
export function drawPawIcon(ctx, x, y, t) {
  const s = 1 + 0.06 * Math.sin(t * 4);
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  oval(ctx, 0, 0, 22, 22, "#fffdf8", 3);
  oval(ctx, 0, 5, 9, 7, "#6b4428", 2);
  for (const [dx, dy] of [
    [-9, -5],
    [-3, -10],
    [3, -10],
    [9, -5],
  ])
    oval(ctx, dx, dy, 3.4, 4, "#6b4428", 1.5);
  ctx.restore();
}
/** The pyramid on the bar's counter, standing or falling (`k` 0 to 1 is the chain), and the flying cup. */
export function drawPyramid(ctx, p, sq, t) {
  const s = p.snacks || { bag: 0, chain: -1, toppled: false },
    k = s.chain < 0 ? 0 : s.chain,
    left = Math.max(0, 10 - s.bag);
  const x = PYRAMID.x,
    y = PYRAMID.y;
  if (!s.toppled) {
    // teetering more as more are taken
    const wob = Math.sin(t * 5) * 0.01 * s.bag;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(wob);
    let i = 0;
    for (const [row, n] of [
      [0, 4],
      [1, 3],
      [2, 2],
      [3, 1],
    ])
      for (let j = 0; j < n && i < left; j++, i++) drawSnack(ctx, ["cup", "pie", "cup", "cake"][row], (j - (n - 1) / 2) * 15, -8 - row * 13, 0.45);
    ctx.restore();
    return;
  }
  // The chain: the stack tips, a cup rolls off, the tray slides, the Moon Pie tin falls last.
  const tip = Math.min(1, k / 0.25),
    roll = Math.max(0, Math.min(1, (k - 0.25) / 0.3)),
    tray = Math.max(0, Math.min(1, (k - 0.45) / 0.3)),
    tin = Math.max(0, Math.min(1, (k - 0.7) / 0.3));
  ctx.save();
  ctx.translate(x - 10, y);
  ctx.rotate(tip * 1.2);
  drawSnack(ctx, "cup", 0, -10, 0.45);
  drawSnack(ctx, "pie", 12, -10, 0.45);
  ctx.restore();
  roll > 0 && drawSnack(ctx, "cup", x - 20 - roll * 60, y + 10 + roll * 30, 0.5, roll * 8);
  tray > 0 && (ctx.save(), ctx.translate(x + 6, y + tray * 34), ctx.rotate(-tray * 0.9), rr(ctx, -22, -4, 44, 8, 2, "#cdbb98", 2), ctx.restore());
  tin > 0 && drawSnack(ctx, "pie", x + 20 + tin * 20, y - 30 + tin * 70, 0.6, tin * 5);
  // the flying cup, arcing from the pyramid to Squatch
  const fly = Math.max(0, Math.min(1, (k - 0.25) / 0.3));
  if (fly > 0 && fly < 1 && sq) drawSnack(ctx, "cup", x + (sq.x - x) * fly, y - 20 + (sq.y - 50 - (y - 20)) * fly - Math.sin(fly * Math.PI) * 70, 0.55, fly * 9);
}
/**
 * The close-up, drawn over the picture (inside it, as built before): the room blurred behind, the counter, the
 * bartender (back turned, glancing, or facing the room), the pyramid, the bag with what he took, the close button,
 * and his paw (the engine's paw arm, `drawPawArm`).
 */
export function drawSnackCloseUp(ctx, p, t, drawPawArm) {
  const c = p.snack,
    s = p.snacks;
  if (!c) return;
  const z = Math.min(1, c.zoom);
  ctx.save();
  ctx.filter = "blur(6px)";
  ctx.globalAlpha = 0.92;
  ctx.drawImage(ctx.canvas, 0, 0, ctx.canvas.width, ctx.canvas.height, 0, 0, 960, 640);
  ctx.restore();
  ctx.fillStyle = "rgba(12,16,28,.32)";
  ctx.fillRect(0, 0, 960, 640);
  ctx.save();
  ctx.globalAlpha = 0.35 + 0.65 * z;
  rr(ctx, 80, 80, 800, 360, 18, "rgba(255,253,248,.18)");
  const B = CUT.bartender;
  if (c.phase === "face") drawPerson(ctx, B.x, B.y, B.h, LOOKS.bartender, -1, t);
  else {
    drawBartenderBack(ctx, B.x, B.y, B.h);
    // the glance: her head turns, a "?" would be words, so her face shows in profile at the side of her head
    c.phase === "glance" && (oval(ctx, B.x - 18, B.y - B.h * 0.84, 9, 11, LOOKS.bartender.skin, 3), oval(ctx, B.x - 22, B.y - B.h * 0.85, 2, 2, INK));
  }
  rr(ctx, 120, 430, 720, 48, 10, "#d7c4a3", 5);
  rr(ctx, 150, 478, 660, 22, 6, "#b08968", 3);
  CUT.snacks.forEach(([kind, x, y], i) => s.taken.includes(i) || i === c.held || drawSnack(ctx, kind, x, y, 1));
  ctx.restore();
  // the bag, with what he took in it
  const b = CUT.bag;
  rr(ctx, b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0, 14, "#e9dcc4", 4);
  line(ctx, [b.x0 + 14, b.y0 + 16, b.x1 - 14, b.y0 + 16], "#b08968", 3);
  s.taken.forEach((i, j) => drawSnack(ctx, CUT.snacks[i][0], b.x0 + 34 + (j % 3) * 48, b.y1 - 34 - Math.floor(j / 3) * 40, 0.8));
  // the close button: a white disc with a cross
  oval(ctx, CUT.close.x, CUT.close.y, CUT.close.r, CUT.close.r, "#ffffff", 4);
  line(ctx, [CUT.close.x - 16, CUT.close.y - 16, CUT.close.x + 16, CUT.close.y + 16], INK, 7);
  line(ctx, [CUT.close.x + 16, CUT.close.y - 16, CUT.close.x - 16, CUT.close.y + 16], INK, 7);
  const paw = c.paw || { x: 480, y: 560 };
  drawPawArm && drawPawArm(ctx, paw);
  c.held >= 0 && drawSnack(ctx, CUT.snacks[c.held][0], paw.x, paw.y - 8, 1);
}
