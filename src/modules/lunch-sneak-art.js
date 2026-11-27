/**
 * The lunch sneak's own drawings (Chapter 1, beats 25 to 27). Every drawing here is a PLACEHOLDER in the game's style
 * (dark outlines, flat colours) until Brian approves a look: the stack of two crates in the hall, the plate of Moon
 * Pies on the snack counter's end, the dashed goal line round a thing it draws itself, one heart, his arm reaching over the counter, and
 * Mops's wet streaks, look cone and hearts in the hallway. The lunch bag is the home morning's (home-morning-art.js), the snack cake is the party's snack
 * (party-snacks-art.js).
 */
import { drawSnack } from "./party-snacks-art.js";
import { drawLunchBag } from "./home-morning-art.js";
import { armEnds } from "./squatch-art.js";
import { highlightBox } from "./outline.js";
import { LUNCH_PLACES, COUNTER_SPOTS, LUNCH_SIZES, COUNTER_CLOSEUP } from "./lunch-sneak-place.js";

const LU_INK = "#1e2430";
const CARD = "#c99a5b",
  CARD_DARK = "#a97b42",
  TAPE = "#e8d6a8",
  PLATE = "#fffdf8",
  FUR = "#6b4428";

function luBox(ctx, x, y, w, h, fill, line) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 3);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = line;
  ctx.strokeStyle = LU_INK;
  ctx.lineJoin = "round";
  ctx.stroke();
}

/** One cardboard crate, top left (x, y): a lid line, a strip of tape across it, no words. */
function luCrate(ctx, x, y, w, h) {
  luBox(ctx, x, y, w, h, CARD, 3);
  // the lid's edge, a little darker
  ctx.fillStyle = CARD_DARK;
  ctx.fillRect(x + 2, y + 2, w - 4, Math.min(8, h * 0.2));
  ctx.beginPath();
  ctx.moveTo(x + 2, y + Math.min(10, h * 0.22));
  ctx.lineTo(x + w - 2, y + Math.min(10, h * 0.22));
  ctx.lineWidth = 2;
  ctx.strokeStyle = LU_INK;
  ctx.stroke();
  // tape down the middle
  ctx.fillStyle = TAPE;
  ctx.fillRect(x + w / 2 - 5, y + 1.5, 10, h - 3);
  ctx.strokeStyle = "rgba(30,36,48,.35)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x + w / 2 - 5, y + 1.5, 10, h - 3);
}
/** The stack of two crates in the hall (LUNCH_PLACES.crate.box): a big one on the floor, a smaller one on it. */
export function drawCrates(ctx) {
  const b = LUNCH_PLACES.crate.box,
    w = b.x1 - b.x0,
    h = b.y1 - b.y0;
  // a soft shadow on the floor
  ctx.beginPath();
  ctx.ellipse((b.x0 + b.x1) / 2, b.y1 + 2, w * 0.55, 6, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(30,36,48,.16)";
  ctx.fill();
  luCrate(ctx, b.x0, b.y0 + h * 0.44, w, h * 0.56);
  luCrate(ctx, b.x0 + w * 0.12, b.y0, w * 0.76, h * 0.46);
  return b;
}

/** The plate of snack cakes on the counter's end: `n` pies stacked on it (3, then 2 once he has taken one). */
export function drawPlate(ctx, n) {
  const p = COUNTER_SPOTS.plate,
    s = LUNCH_SIZES.plate;
  ctx.beginPath();
  ctx.ellipse(p.x, p.y, s.w / 2, s.h / 2, 0, 0, Math.PI * 2);
  ctx.fillStyle = PLATE;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = LU_INK;
  ctx.stroke();
  for (let i = 0; i < n; i++) drawSnack(ctx, "pie", p.x, pieY(i), LUNCH_SIZES.pie);
  return { x0: p.x - s.w / 2, x1: p.x + s.w / 2, y0: pieY(Math.max(0, n - 1)) - 18 * LUNCH_SIZES.pie, y1: p.y + s.h / 2 };
}
/** Where pie `i` (0 at the bottom) sits in the stack on the plate. */
export const pieY = (i) => COUNTER_SPOTS.plate.y - 5 - i * 11;

/**
 * The one highlight (Brian 2026-11-26: "So E, but thicker, but not quite as thick as A"; outline.js): the dashed gold
 * line round `box` (game positions), for a goal thing the lunch draws itself (the crates during an alarm, Mops at
 * GIVE · lunch). No glow. Returns the box it went round.
 */
export function drawLunchGoalLine(ctx, box, time, pad = 6) {
  highlightBox(ctx, box, time || 0, pad);
  return { x0: box.x0 - pad, y0: box.y0 - pad, x1: box.x1 + pad, y1: box.y1 + pad };
}

/** One red heart (a drawn shape, not a letter), its middle at (x, y). */
export function drawHeart(ctx, x, y, r) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.moveTo(0, r * 0.9);
  ctx.bezierCurveTo(-r * 1.4, -r * 0.1, -r * 0.7, -r * 1.2, 0, -r * 0.45);
  ctx.bezierCurveTo(r * 0.7, -r * 1.2, r * 1.4, -r * 0.1, 0, r * 0.9);
  ctx.closePath();
  ctx.fillStyle = "#e5533d";
  ctx.fill();
  ctx.strokeStyle = LU_INK;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
}

/** Where Squatch's near paw is (arms at rest) for feet (x, y), facing `f`, at `scale` (game pixels to his unit). */
export function sqPawAt(x, y, f, scale) {
  const hand = armEnds()[1].hand;
  return { x: x + (f || 1) * hand.x * scale, y: y + hand.y * scale };
}
/** The lunch bag in his paw, at his size (a big bag, about three quarters of him, so MOPS on it reads). */
export function drawBagInPaw(ctx, x, y, f, scale) {
  const p = sqPawAt(x, y, f, scale);
  drawLunchBag(ctx, p.x, p.y + 10 * (scale / 1.65), BAG_IN_HALL * (scale / 1.65));
  return p;
}
// The bag's size in the hall (a share of its home-room size; the hall's Squatch is about half the home room's): big
// enough that MOPS on it is about 14 CSS px on an iPad standing up (Brian 2026-11-26: MOPS readable). PLACEHOLDER.
export const BAG_IN_HALL = 0.88;

// (Squatch ducked behind the counter is the approved L2 ball, the older program's drawL2Ball through
// engine().ball.drawOn (DECISIONS C3; Brian 2026-11-26, lunch notes 0:38 and 0:39.8: "he goes into the ball, not this
// weird look"). The squashed Squatch that stood here (C5, superseded) is gone; tests/lunch-sneak.mjs checks it stays
// gone.) The ball's drawn height at scale 1 (game pixels: its scalloped head's top at 21 above its middle line, its
// bottom at 22 below), drawn at the hall Squatch's scale / 1.65, as ROLL · ball.
export const BALL_UNITS_TALL = 43;

// ---------- the hallway: Mops mopping with his beard, looking round, the hearts ----------
/**
 * Mops's wet streaks on the hallway floor: where his beard mopped (Brian 2026-11-26, lunch note 0:17.9: "we should see
 * streaks of him wiping his beard on the floor"). `wet`: the spots his beard tip passed, each { x, y }. `avoid`: boxes
 * of people standing on them (the streak is on the floor, under their feet). PLACEHOLDER look.
 */
export function drawWetStreaks(ctx, wet, avoid = []) {
  if (!wet || !wet.length) return;
  ctx.save();
  for (const b of avoid) {
    if (!b) continue;
    ctx.beginPath();
    ctx.rect(-4000, -4000, 9000, 9000);
    ctx.rect(b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0);
    ctx.clip("evenodd");
  }
  // a wavy wet band (each beard swish a little higher or lower), then a shine on every other swish
  wet.forEach((w, i) => {
    ctx.beginPath();
    ctx.ellipse(w.x, w.y + ((i % 3) - 1) * 3.5, 14, 7, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(96,160,220,.42)";
    ctx.fill();
  });
  wet.forEach((w, i) => {
    if (i % 2) return;
    ctx.beginPath();
    ctx.ellipse(w.x - 2, w.y + ((i % 3) - 1) * 3.5 - 2, 6, 1.8, -0.1, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,.7)";
    ctx.fill();
  });
  ctx.restore();
}
/**
 * Mops's cone while he looks round (as everyone's: a dashed outline from his eyes, `len` long, `half` wide each side
 * of `a`). It never sees anyone: it is where he is looking. When he faces Squatch it becomes his heart cone
 * (party-free-art.js drawHeartCone, R98 and R104), with hearts floating up.
 */
export function drawLookCone(ctx, ox, oy, a, half, len) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(ox, oy);
  ctx.arc(ox, oy, len, a - half, a + half);
  ctx.closePath();
  ctx.fillStyle = "rgba(255,253,248,.28)";
  ctx.fill();
  ctx.setLineDash([9, 6]);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = "rgba(30,36,48,.6)";
  ctx.stroke();
  ctx.restore();
}
/** Hearts floating up from over Mops's head (`age` seconds since they began): three, rising and fading. */
export function drawHeartsUp(ctx, x, y, age) {
  for (let i = 0; i < 3; i++) {
    const k = (age * 0.8 + i / 3) % 1;
    ctx.save();
    ctx.globalAlpha = 1 - k * 0.7;
    drawHeart(ctx, x + Math.sin(i * 2.3 + age * 2) * 14 + (i - 1) * 14, y - k * 46, 10 + 4 * (1 - k));
    ctx.restore();
  }
}

/** His near arm reaching from his shoulder to (tx, ty), furry, outlined (standing up at the counter). */
export function drawReach(ctx, x, y, f, scale, tx, ty) {
  const sh = { x: x + f * 10 * scale, y: y - 18 * scale };
  ctx.save();
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(sh.x, sh.y);
  ctx.lineTo(tx, ty);
  ctx.lineWidth = 4.2 * scale + 4;
  ctx.strokeStyle = LU_INK;
  ctx.stroke();
  ctx.lineWidth = 4.2 * scale;
  ctx.strokeStyle = FUR;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(tx, ty, 2.6 * scale, 0, Math.PI * 2);
  ctx.fillStyle = "#f4c39a";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = LU_INK;
  ctx.stroke();
  ctx.restore();
}
/** One snack cake (in his paw, or flying from the plate to it). */
export function drawPie(ctx, x, y, k = 1) {
  drawSnack(ctx, "pie", x, y, LUNCH_SIZES.pie * k);
}


/** Where the counter close-up sits on the picture (game positions), grown `u` of the way (0 to 1) out of its corner. */
export function counterCloseUpBox(u = 1) {
  const C = COUNTER_CLOSEUP,
    w = (C.src.x1 - C.src.x0) * C.k,
    h = (C.src.y1 - C.src.y0) * C.k,
    e = u * u * (3 - 2 * u),
    mix = (a, b) => a + (b - a) * e;
  return { x0: mix(C.src.x0, C.dst.x0), y0: mix(C.src.y0, C.dst.y0), x1: mix(C.src.x1, C.dst.x0 + w), y1: mix(C.src.y1, C.dst.y0 + h) };
}
let closeUpCopy = null;
/**
 * The counter close-up, drawn over the hall once the hall is drawn: the counter's corner (COUNTER_CLOSEUP.src) copied
 * from the picture as it is now and drawn bigger in a white frame, with the corner it shows framed too and joined to it,
 * so it reads as "this, close up". `u`: how far it has grown (0 to 1). Returns the box it sits in.
 */
export function drawCounterCloseUp(ctx, u) {
  const C = COUNTER_CLOSEUP,
    s = C.src,
    m = ctx.getTransform(),
    sx = Math.round(m.a * s.x0 + m.e),
    sy = Math.round(m.d * s.y0 + m.f),
    sw = Math.max(1, Math.round(m.a * (s.x1 - s.x0))),
    sh = Math.max(1, Math.round(m.d * (s.y1 - s.y0))),
    b = counterCloseUpBox(u);
  if (typeof document === "undefined") return b;
  closeUpCopy = closeUpCopy || document.createElement("canvas");
  (closeUpCopy.width !== sw || closeUpCopy.height !== sh) && ((closeUpCopy.width = sw), (closeUpCopy.height = sh));
  const cc = closeUpCopy.getContext("2d");
  cc.clearRect(0, 0, sw, sh);
  cc.drawImage(ctx.canvas, sx, sy, sw, sh, 0, 0, sw, sh);
  ctx.save();
  // the corner it shows, framed, and two lines from it to the close-up
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#fffdf8";
  ctx.setLineDash([10, 6]);
  ctx.strokeRect(s.x0, s.y0, s.x1 - s.x0, s.y1 - s.y0);
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(b.x1, b.y0);
  ctx.lineTo(s.x0, s.y0);
  ctx.moveTo(b.x1, b.y1);
  ctx.lineTo(s.x0, s.y1);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(255,253,248,.85)";
  ctx.stroke();
  // the close-up: a shadow, the picture bigger, a thick white frame with a dark edge
  ctx.fillStyle = "rgba(30,36,48,.28)";
  ctx.fillRect(b.x0 + 8, b.y0 + 10, b.x1 - b.x0, b.y1 - b.y0);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(closeUpCopy, 0, 0, sw, sh, b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0);
  ctx.lineWidth = 10;
  ctx.strokeStyle = "#fffdf8";
  ctx.strokeRect(b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0);
  ctx.lineWidth = 3;
  ctx.strokeStyle = LU_INK;
  ctx.strokeRect(b.x0 - 5, b.y0 - 5, b.x1 - b.x0 + 10, b.y1 - b.y0 + 10);
  ctx.restore();
  return b;
}

// ---------- the outline's source: the plate alone on a plain floor, once ----------
// (the crates have no outline: only the hallway doorway is lit up in the sneak, Brian 2026-11-26)
const LU_SOURCES = {};
/** A canvas the size of the game picture with only `id` ("plate") drawn, for the dashed goal outline. */
export function lunchOutlineSource(id) {
  if (LU_SOURCES[id]) return LU_SOURCES[id];
  if (typeof document === "undefined") return null;
  const c = document.createElement("canvas");
  c.width = 960;
  c.height = 640;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.fillStyle = "#e8e3d9";
  ctx.fillRect(0, 0, 960, 640);
  drawPlate(ctx, 3);
  return (LU_SOURCES[id] = c);
}
/** The box the dashed outline traces the drawn plate inside (a little bigger than it, nothing else in it). */
export const LUNCH_TRACE = Object.freeze({
  plate: Object.freeze({ x0: COUNTER_SPOTS.plate.x - LUNCH_SIZES.plate.w / 2 - 10, x1: COUNTER_SPOTS.plate.x + LUNCH_SIZES.plate.w / 2 + 10, y0: pieY(2) - 30, y1: COUNTER_SPOTS.plate.y + 20 }),
});
