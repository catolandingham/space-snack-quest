/**
 * Drawings for the escape's evenings at home (story pass 2026-11-26), on top of the locked home picture (never changed):
 *   43   the week on the home calendar, close: "Six days later" across its top, six days crossed off one at a time, and
 *        tomorrow's square saying DELIVERY with the one highlight (not a cold start: Brian, escape video 0:03).
 *   45a  his crate bed's family stamp is the home picture's own layer (crate-stamp.js, the same in every beat): when
 *        Mops touches its scraped first letter with a hoof, the scraped gap lights up (drawStampTouch).
 *   45b  the crayon plan: a sheet of paper with three crayon pictures (1 the door with its keypad and the pink paper,
 *        2 the computer, 3 the crate with two faces peeking out and an arrow to a red dot, the ship above it), each
 *        drawn as the talk gets to it, and a crayon tick on each when its step is done.
 * Every drawing is a PLACEHOLDER for Brian.
 */
import { WEEK } from "./escape-place.js";
import { escapeWords } from "./escape-lines.js";
import { highlightBox } from "./outline.js";
import { familyStampOnRoom } from "./crate-stamp.js";

const INK = "#1e2430";
const RED = "#d62828";
const PAPER = "#fffdf6";
const TAU = Math.PI * 2;
const font = (size, weight = 900) => `${weight} ${size}px system-ui, -apple-system, sans-serif`;

/** Beat 43: the week, close. `age` seconds since it opened. Returns what it drew. */
export function drawWeek(ctx, age, t) {
  const W = WEEK;
  ctx.save();
  ctx.fillStyle = "rgba(12,16,28,.55)";
  ctx.fillRect(0, 0, 960, 640);
  const x0 = W.x0 - 40,
    w = 7 * W.w + 6 * W.gap + 80;
  ctx.fillStyle = PAPER;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.roundRect(x0, W.y0 - 120, w, W.h + 190, 14);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#e0533a";
  ctx.fillRect(x0 + 3, W.y0 - 117, w - 6, 70);
  ctx.font = font(46);
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  const card = escapeWords("card-six-days");
  ctx.fillText(card, 480, W.y0 - 66);
  let xs = 0;
  for (let i = 0; i < 7; i++) {
    const x = W.x0 + i * (W.w + W.gap),
      y = W.y0;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, W.w, W.h);
    ctx.font = font(24, 800);
    ctx.textAlign = "left";
    ctx.fillStyle = INK;
    ctx.fillText(String(i + 1), x + 8, y + 28);
    if (i < 6) {
      const k = Math.max(0, Math.min(1, (age - W.settle - i * W.xEvery) / 0.25));
      if (k > 0) {
        xs++;
        ctx.strokeStyle = RED;
        ctx.lineWidth = 9;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x + 16, y + 40);
        ctx.lineTo(x + 16 + (W.w - 32) * Math.min(1, k * 2), y + 40 + (W.h - 56) * Math.min(1, k * 2));
        if (k > 0.5) (ctx.moveTo(x + W.w - 16, y + 40), ctx.lineTo(x + W.w - 16 - (W.w - 32) * (k * 2 - 1), y + 40 + (W.h - 56) * (k * 2 - 1)));
        ctx.stroke();
      }
    } else {
      // tomorrow: DELIVERY, with a little ship
      ctx.font = font(17);
      ctx.textAlign = "center";
      ctx.fillStyle = RED;
      ctx.fillText(escapeWords("cal-delivery"), x + W.w / 2, y + W.h - 18);
      drawPlanShip(ctx, x + W.w / 2, y + 78, 0.9);
      age >= W.settle + W.xEvery * 6 && highlightBox(ctx, { x0: x, y0: y, x1: x + W.w, y1: y + W.h }, t, 6);
    }
  }
  ctx.restore();
  return { card, xs, delivery: age >= W.settle + W.xEvery * 6 };
}
// a little cargo ship, side on (the calendar's DELIVERY square, the crayon plan)
function drawPlanShip(ctx, x, y, k, crayon) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  ctx.lineWidth = crayon ? 5 : 3;
  ctx.strokeStyle = crayon ? "#3478f6" : INK;
  ctx.fillStyle = crayon ? "rgba(52,120,246,.15)" : "#9fb3d1";
  ctx.beginPath();
  ctx.moveTo(-36, -8);
  ctx.lineTo(30, -8);
  ctx.lineTo(40, 6);
  ctx.lineTo(30, 18);
  ctx.lineTo(-36, 18);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(-6, -8, 12, Math.PI, 0);
  ctx.stroke();
  ctx.restore();
}

/**
 * Beat 45a: the crate bed's stamp is drawn with the home picture (crate-stamp.js); once Mops touches its scraped first
 * letter (`touched`), a soft light over that gap shows where his hoof is. Returns the stamp's words as the room shows them.
 */
export function drawStampTouch(ctx, touched) {
  const st = familyStampOnRoom();
  if (!st) return "";
  if (touched) {
    const g = st.gap;
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,.45)";
    ctx.beginPath();
    ctx.ellipse((g.x0 + g.x1) / 2, (g.y0 + g.y1) / 2, (g.x1 - g.x0) / 2 + 4, (g.y1 - g.y0) / 2 + 4, 0, 0, TAU);
    ctx.fill();
    ctx.restore();
  }
  return st.text;
}

/**
 * Beat 45b on: the crayon plan, a sheet of paper. `st.pics` is how many of the three pictures are drawn (they are added
 * in the order 3, the ship over it, 2, 1: st.has = { crate, ship, computer, door }), `st.ticks` which have a tick.
 * At (x, y), `w` wide. Returns where each picture is.
 */
export function drawPlan(ctx, x, y, w, st) {
  const h = w * 0.62,
    has = st.has || {},
    ticks = st.ticks || {};
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.02);
  ctx.fillStyle = PAPER;
  ctx.strokeStyle = INK;
  ctx.lineWidth = Math.max(2, w / 160);
  ctx.beginPath();
  ctx.rect(0, 0, w, h);
  ctx.fill();
  ctx.stroke();
  const cw = w / 3,
    k = w / 600,
    at = { door: { x: cw * 0.5, y: h * 0.55 }, computer: { x: cw * 1.5, y: h * 0.55 }, crate: { x: cw * 2.5, y: h * 0.62 } };
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  // crayon numbers
  ctx.font = font(Math.round(30 * k));
  ctx.textAlign = "center";
  ctx.fillStyle = "#7a4fd1";
  ["1", "2", "3"].forEach((n, i) => (has[["door", "computer", "crate"][i]] ? ctx.fillText(n, cw * (i + 0.15), 36 * k) : null));
  if (has.door) crayonDoor(ctx, at.door.x, at.door.y, k);
  if (has.computer) crayonComputer(ctx, at.computer.x, at.computer.y, k);
  if (has.crate) crayonCrate(ctx, at.crate.x, at.crate.y, k);
  if (has.ship) drawPlanShip(ctx, at.crate.x - 10 * k, at.crate.y - 120 * k, 1.1 * k, true);
  for (const id of ["door", "computer", "crate"]) if (ticks[id]) tick(ctx, at[id].x + cw * 0.3, at[id].y - 60 * k, k);
  ctx.restore();
  return at;
}
function crayon(ctx, col, k) {
  ctx.strokeStyle = col;
  ctx.lineWidth = 6 * k;
}
function crayonDoor(ctx, x, y, k) {
  crayon(ctx, "#8a5a2b", k);
  ctx.strokeRect(x - 40 * k, y - 80 * k, 70 * k, 130 * k);
  crayon(ctx, INK, k);
  ctx.strokeRect(x + 40 * k, y - 20 * k, 22 * k, 30 * k); // the keypad
  // the pink paper
  ctx.fillStyle = "#ff9cc2";
  ctx.save();
  ctx.translate(x + 52 * k, y + 40 * k);
  ctx.rotate(0.2);
  ctx.fillRect(-16 * k, -20 * k, 32 * k, 40 * k);
  ctx.restore();
}
function crayonComputer(ctx, x, y, k) {
  crayon(ctx, "#2b9348", k);
  ctx.strokeRect(x - 55 * k, y - 70 * k, 110 * k, 80 * k);
  ctx.beginPath();
  ctx.moveTo(x, y + 10 * k);
  ctx.lineTo(x, y + 34 * k);
  ctx.moveTo(x - 34 * k, y + 36 * k);
  ctx.lineTo(x + 34 * k, y + 36 * k);
  ctx.stroke();
}
function crayonCrate(ctx, x, y, k) {
  crayon(ctx, "#c77d2a", k);
  ctx.strokeRect(x - 60 * k, y - 34 * k, 96 * k, 70 * k);
  // two faces peeking out over the top: a furry one and a goat
  for (const [dx, col] of [[-34, "#a07a52"], [6, "#cfd3dc"]]) {
    ctx.beginPath();
    ctx.arc(x + dx * k, y - 44 * k, 16 * k, Math.PI, 0);
    crayon(ctx, col, k);
    ctx.stroke();
  }
  // an arrow to a red dot
  crayon(ctx, RED, k);
  ctx.beginPath();
  ctx.moveTo(x + 40 * k, y);
  ctx.lineTo(x + 78 * k, y - 26 * k);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + 86 * k, y - 32 * k, 10 * k, 0, TAU);
  ctx.fillStyle = RED;
  ctx.fill();
}
function tick(ctx, x, y, k) {
  crayon(ctx, "#2b9348", k * 1.6);
  ctx.beginPath();
  ctx.moveTo(x - 16 * k, y);
  ctx.lineTo(x - 4 * k, y + 14 * k);
  ctx.lineTo(x + 20 * k, y - 18 * k);
  ctx.stroke();
}

/** Beat 45a: one sweat drop by his head while he gulps (no words). `head` is his head's box. */
export function drawGulpSweat(ctx, head, age) {
  const x = head.x + head.w + 4,
    y = head.y + 6 + Math.min(1, age / 1.0) * 14;
  ctx.save();
  ctx.fillStyle = "#8fdcff";
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - 12);
  ctx.quadraticCurveTo(x + 8, y, x, y + 4);
  ctx.quadraticCurveTo(x - 8, y, x, y - 12);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  return { x: Math.round(x), y: Math.round(y) };
}
