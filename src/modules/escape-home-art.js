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
const esHomeFont = (size, weight = 900) => `${weight} ${size}px system-ui, -apple-system, sans-serif`;

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
  ctx.font = esHomeFont(46);
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
    ctx.font = esHomeFont(24, 800);
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
      ctx.font = esHomeFont(17);
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
 * Beat 45b on: the crayon plan, a sheet of paper taped up, drawn the way his other crayon pictures are drawn
 * (guardians-drawing.js: each line drawn twice, a little off, the second fainter, shapes coloured in with slanted
 * strokes): 1 the office door with its keypad and the pink paper, 2 the computer, its screen coloured in, 3 the crate
 * with him and Mops peeking out, an arrow up to Mars. Under each, its crayon words (escape-lines.js plan-1 to plan-3, in
 * his crayon hand). `st.has` = { door, computer, crate, ship } says which are drawn (added 3, its arrow to Mars, 2, 1),
 * `st.ticks` which have a green tick. At (x, y), `w` wide; `words` { door, computer, crate }. Returns where each picture
 * is. Final art, Brian's yes 2026-11-27 (round 8; the words were already his pending lines).
 */
export function drawPlan(ctx, x, y, w, st, words = null) {
  const h = w * 0.62,
    has = st.has || {},
    ticks = st.ticks || {},
    cw = w / 3,
    k = w / 600,
    at = { door: { x: cw * 0.5, y: h * 0.55 }, computer: { x: cw * 1.5, y: h * 0.55 }, crate: { x: cw * 2.5, y: h * 0.62 } },
    rnd = planWobble(11);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.02);
  // the sheet, and two strips of tape
  ctx.fillStyle = PAPER;
  ctx.strokeStyle = "#c9c2b0";
  ctx.lineWidth = Math.max(1.5, w / 260);
  ctx.beginPath();
  ctx.rect(0, 0, w, h);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "rgba(240,226,170,.9)";
  for (const tx of [0.08, 0.92]) {
    ctx.save();
    ctx.translate(tx * w, 0);
    ctx.rotate(tx < 0.5 ? -0.3 : 0.3);
    ctx.fillRect(-22 * k, -9 * k, 44 * k, 18 * k);
    ctx.restore();
  }
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const C = { k, rnd, ctx };
  // his crayon numbers
  ["door", "computer", "crate"].forEach((id, i) => has[id] && planWords(C, String(i + 1), cw * (i + 0.13), 34 * k, 34, PLAN_CRAYON.purple));
  if (has.door) planDoor(C, at.door.x, at.door.y);
  if (has.computer) planComputer(C, at.computer.x, at.computer.y);
  if (has.crate) planCrate(C, at.crate.x, at.crate.y, !words);
  if (has.ship && !words) drawPlanShip(ctx, at.crate.x - 10 * k, at.crate.y - 120 * k, 1.1 * k, true);
  if (has.ship && words) planToMars(C, at.crate.x, at.crate.y - 105 * k);
  if (words) for (const id of ["door", "computer", "crate"]) has[id] && words[id] && planWords(C, words[id], at[id].x - 4 * k, h - 22 * k, 25, PLAN_CRAYON.words, cw - 14 * k);
  for (const id of ["door", "computer", "crate"]) if (ticks[id]) planTick(C, at[id].x + cw * 0.3, at[id].y - 60 * k);
  ctx.restore();
  return at;
}
// The plan's crayons.
const PLAN_CRAYON = Object.freeze({
  purple: "#7a4fd1",
  words: "#c2185b",
  door: "#8a5a2b",
  doorFill: "#c99a62",
  keypad: "#3b3f4a",
  pink: "#ff8fbd",
  computer: "#2b6fd6",
  screen: "#8fd0ff",
  button: "#2bb673",
  crate: "#b8742a",
  crateFill: "#e3b77a",
  fur: "#7a4a26",
  goat: "#9aa0ad",
  mars: "#e5533d",
  marsDark: "#a8321f",
  arrow: "#1e2430",
  tick: "#2b9348",
});
const PLAN_FONT = (px) => `700 ${px}px "Chalkboard SE", "Marker Felt", "Comic Sans MS", cursive`;
// A fixed wobble (the same every frame), from a seed.
function planWobble(seed) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0), s / 4294967296 - 0.5);
}
// A crayon line through points (sheet units times k): twice, a little off, the second fainter.
function planLine(C, pts, color, width = 6, close = false) {
  const { ctx, k, rnd } = C;
  for (let i = 0; i < 2; i++) {
    ctx.beginPath();
    pts.forEach(([px, py], j) => {
      const X = px + rnd() * 2.4 * k,
        Y = py + rnd() * 2.4 * k;
      j ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y);
    });
    close && ctx.closePath();
    ctx.strokeStyle = color;
    ctx.globalAlpha = i ? 0.5 : 0.92;
    ctx.lineWidth = width * k * (i ? 0.7 : 1);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}
// A box coloured in with slanted crayon strokes (x0, y0, x1, y1), the crayon's grain showing the paper between.
function planColourIn(C, x0, y0, x1, y1, color) {
  const { ctx, k, rnd } = C;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x0, y0, x1 - x0, y1 - y0);
  ctx.clip();
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 5 * k;
  for (let s = -(y1 - y0); s < x1 - x0; s += 7 * k) {
    ctx.beginPath();
    ctx.moveTo(x0 + s + rnd() * 2 * k, y1);
    ctx.lineTo(x0 + s + (y1 - y0) * 0.5 + rnd() * 2 * k, y0);
    ctx.stroke();
  }
  ctx.restore();
}
const planRect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]];
// His crayon writing: drawn twice, a little off, like a crayon pressed hard.
function planWords(C, text, x, y, px, color, maxW = undefined) {
  const { ctx, k } = C;
  ctx.font = PLAN_FONT(Math.round(px * k));
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.95;
  ctx.fillText(text, x, y, maxW);
  ctx.globalAlpha = 0.45;
  ctx.fillText(text, x + 1.2 * k, y + 0.9 * k, maxW);
  ctx.globalAlpha = 1;
}
function planDoor(C, x, y) {
  const { k } = C,
    P = PLAN_CRAYON;
  planColourIn(C, x - 40 * k, y - 80 * k, x + 30 * k, y + 50 * k, P.doorFill);
  planLine(C, planRect(x - 40 * k, y - 80 * k, x + 30 * k, y + 50 * k), P.door);
  planLine(C, [[x + 18 * k, y - 10 * k], [x + 22 * k, y - 8 * k]], P.door, 7); // the handle
  // the keypad, with its buttons as dots
  planColourIn(C, x + 40 * k, y - 22 * k, x + 64 * k, y + 10 * k, "#c9ccd6");
  planLine(C, planRect(x + 40 * k, y - 22 * k, x + 64 * k, y + 10 * k), P.keypad, 4);
  for (const [dx, dy] of [[47, -14], [57, -14], [47, -4], [57, -4], [52, 4]]) planLine(C, [[x + dx * k, y + dy * k], [x + (dx + 0.5) * k, y + dy * k]], P.keypad, 4);
  // the pink paper with the code (scribbled, no numbers to read)
  C.ctx.save();
  C.ctx.translate(x + 54 * k, y + 40 * k);
  C.ctx.rotate(0.2);
  planColourIn(C, -16 * k, -20 * k, 16 * k, 20 * k, P.pink);
  planLine(C, planRect(-16 * k, -20 * k, 16 * k, 20 * k), "#e0629a", 4);
  planLine(C, [[-9 * k, -6 * k], [-3 * k, -8 * k], [3 * k, -5 * k], [9 * k, -7 * k]], "#e0629a", 3);
  planLine(C, [[-9 * k, 4 * k], [-2 * k, 2 * k], [5 * k, 5 * k], [9 * k, 3 * k]], "#e0629a", 3);
  C.ctx.restore();
}
function planComputer(C, x, y) {
  const { k } = C,
    P = PLAN_CRAYON;
  planColourIn(C, x - 55 * k, y - 70 * k, x + 55 * k, y + 10 * k, P.screen);
  planLine(C, planRect(x - 55 * k, y - 70 * k, x + 55 * k, y + 10 * k), P.computer);
  // the big green button on its screen
  planColourIn(C, x - 30 * k, y - 42 * k, x + 30 * k, y - 20 * k, P.button);
  planLine(C, planRect(x - 30 * k, y - 42 * k, x + 30 * k, y - 20 * k), "#1f8a55", 4);
  // its stand and the desk line
  planLine(C, [[x, y + 10 * k], [x, y + 34 * k]], P.computer);
  planLine(C, [[x - 34 * k, y + 36 * k], [x + 34 * k, y + 36 * k]], P.computer);
}
function planCrate(C, x, y, redDot) {
  const { k } = C,
    P = PLAN_CRAYON;
  // two faces peeking over the top: him (furry, brown) and Mops (grey, two horns)
  const head = (cx, color, horns) => {
    const pts = [];
    for (let i = 0; i <= 12; i++) {
      const a = Math.PI + (i / 12) * Math.PI,
        r = (horns ? 15 : i % 2 ? 19 : 16) * k;
      pts.push([cx + Math.cos(a) * r, y - 34 * k + Math.sin(a) * r]);
    }
    planLine(C, pts, color, 5);
    planLine(C, [[cx - 6 * k, y - 42 * k], [cx - 5 * k, y - 42 * k]], P.arrow, 6);
    planLine(C, [[cx + 6 * k, y - 42 * k], [cx + 7 * k, y - 42 * k]], P.arrow, 6);
    horns && planLine(C, [[cx - 10 * k, y - 46 * k], [cx - 18 * k, y - 62 * k]], P.goat, 5);
    horns && planLine(C, [[cx + 10 * k, y - 46 * k], [cx + 18 * k, y - 62 * k]], P.goat, 5);
  };
  head(x - 34 * k, P.fur, false);
  head(x + 6 * k, P.goat, true);
  planColourIn(C, x - 60 * k, y - 34 * k, x + 36 * k, y + 36 * k, P.crateFill);
  planLine(C, planRect(x - 60 * k, y - 34 * k, x + 36 * k, y + 36 * k), P.crate);
  planLine(C, [[x - 58 * k, y], [x + 34 * k, y]], P.crate, 4);
  if (!redDot) return;
  planLine(C, [[x + 40 * k, y], [x + 78 * k, y - 26 * k]], P.mars);
  planColourIn(C, x + 76 * k, y - 42 * k, x + 96 * k, y - 22 * k, P.mars);
}
// (round 7, q: 132) an arrow up from the crate to the red planet, Mars, with two craters: the ride to Mars
function planToMars(C, x, y) {
  const { k, ctx } = C,
    P = PLAN_CRAYON;
  const curve = [];
  for (let i = 0; i <= 8; i++) {
    const u = i / 8;
    curve.push([x - 40 * k + 46 * k * u, y + 50 * k - 60 * k * Math.sin((u * Math.PI) / 2)]);
  }
  planLine(C, curve, P.arrow, 5);
  planLine(C, [[x - 10 * k, y - 20 * k], [x + 6 * k, y - 10 * k], [x - 6 * k, y + 6 * k]], P.arrow, 5);
  // Mars: coloured in round, a darker crayon ring, two craters
  const mx = x + 44 * k,
    my = y - 22 * k,
    r = 26 * k;
  ctx.save();
  ctx.beginPath();
  ctx.arc(mx, my, r, 0, TAU);
  ctx.clip();
  planColourIn(C, mx - r, my - r, mx + r, my + r, P.mars);
  planColourIn(C, mx - r, my - r, mx + r, my + r, P.mars);
  ctx.restore();
  const ring = [];
  for (let i = 0; i <= 16; i++) ring.push([mx + Math.cos((i / 16) * TAU) * r, my + Math.sin((i / 16) * TAU) * r]);
  planLine(C, ring, P.marsDark, 5);
  for (const [dx, dy, cr] of [[-8, -6, 5], [10, 8, 4]]) {
    const c = [];
    for (let i = 0; i <= 8; i++) c.push([mx + dx * k + Math.cos((i / 8) * TAU) * cr * k, my + dy * k + Math.sin((i / 8) * TAU) * cr * k]);
    planLine(C, c, P.marsDark, 3);
  }
}
function planTick(C, x, y) {
  const { k } = C;
  planLine(C, [[x - 16 * k, y], [x - 4 * k, y + 14 * k], [x + 20 * k, y - 18 * k]], PLAN_CRAYON.tick, 9);
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
