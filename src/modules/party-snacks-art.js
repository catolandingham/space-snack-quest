/**
 * The snack bar's drawings (party-snacks.js is the rules; party-snacks-stack.js the one table of snacks). The
 * hall's small pyramid and the close-up's big one are drawn from the same table and the same pile, with the same
 * snack shapes, so they are the same snacks in the same places (Brian 2026-11-24: "make sure that the snacks
 * actually look like the ones that are in the bar in the other shot").
 *
 * The close-up must be "painstakingly obvious" (Brian, 2026-11-24). What a kid reads off it, with no words:
 *   - Is she looking? Her whole body turns. Back turned: her bun and apron bow, an arm up at the shelf, a closed
 *     eye beside her. Facing him: her face with wide eyes, an open eye beside her, and her sight (the game's
 *     yellow cone) lying over the pyramid. While she turns, the cone swings round to it.
 *   - Which snack is safe? A snack with nothing on it jiggles. A snack with one snack on it sits pressed. A snack
 *     with two on it is squashed flat, with strain marks: pull it and the pile falls.
 *   - What did the pile just do? A snack that slides down is drawn sliding, with a puff where it lands; a pile
 *     about to fall leans and a burst shows the gap.
 *   - His bag is a paper bag with snacks poking out and a count; LEAVE · bar is always on screen.
 */
import { rr, oval, line, words, INK, drawPerson, LOOKS } from "./party-art.js";
import { PYRAMID } from "./party-hall.js";
import { partyLine } from "./party-lines.js";
import { SLOTS, kindOf, load, fullStack } from "./party-snacks-stack.js";
import { CUT, BAR, slotAt, pawOut } from "./party-snacks.js";

const TAU = Math.PI * 2;
const ease = (k) => k * k * (3 - 2 * k);
const clamp = (k) => Math.max(0, Math.min(1, k));
// How big a snack is drawn in the close-up and in the hall (one shape, two sizes), and the hall's spacing.
export const SNACK_SIZE = Object.freeze({ cut: 2.7, hall: 0.45, hallCol: 7.5, hallRow: 13 });

/**
 * One snack, `sc` times its own size, centred at (x, y). `press` squashes it (0 loose, 1 one snack on it, 2 two
 * on it); `ow` is its outline in its own units (thinner when it is drawn big).
 */
export function drawSnack(ctx, kind, x, y, sc = 1, rot = 0, press = 0, ow = 3) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(sc * (1 + press * 0.05), sc * (1 - press * 0.1));
  if (kind === "pie") {
    oval(ctx, 0, 0, 18, 18, "#e7c08a", ow);
    oval(ctx, 0, 0, 8, 8, "#6b3a1c");
    line(ctx, [-6, -2, 6, 2], "#fff3d6", 2);
  } else if (kind === "cup") {
    rr(ctx, -12, -11, 24, 28, 4, "#8fdcff", ow);
    rr(ctx, -14, -17, 28, 8, 3, "#ffffff", ow * 0.7);
  } else if (kind === "cake") {
    rr(ctx, -20, -6, 40, 24, 4, "#fffdf8", ow);
    oval(ctx, 0, -12, 5, 5, "#e5533d");
    oval(ctx, -8, 2, 3, 3, "#3478f6");
  } else {
    oval(ctx, 0, 0, 16, 16, "#e5533d", ow);
    line(ctx, [0, -14, 6, -24], "#3f8f4a", 3);
    oval(ctx, -4, -2, 3, 3, "#fff3d6");
  }
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
/** Where slot `i` is drawn on the hall's counter. */
export function hallSlotAt(i) {
  return { x: PYRAMID.x + (SLOTS[i].col - 3) * SNACK_SIZE.hallCol, y: PYRAMID.y - 8 - SLOTS[i].row * SNACK_SIZE.hallRow };
}
/**
 * The pyramid on the hall's counter: the pile as it stands now (the same pile the close-up shows), or falling
 * (`chain` 0 to 1), with the flying cup.
 */
export function drawPyramid(ctx, p, sq, t) {
  const s = p.snacks || { chain: -1, toppled: false },
    k = s.chain < 0 ? 0 : s.chain,
    slots = s.slots || fullStack();
  const x = PYRAMID.x,
    y = PYRAMID.y;
  if (!s.toppled) {
    // bottom row first, so each snack sits in front of the ones it stands on
    for (let i = slots.length - 1; i >= 0; i--) slots[i] >= 0 && drawSnack(ctx, kindOf(slots[i]), hallSlotAt(i).x, hallSlotAt(i).y, SNACK_SIZE.hall);
    return;
  }
  // The chain: the stack tips, a cup rolls off, the tray slides, the Moon Pie tin falls last.
  const tip = Math.min(1, k / 0.25),
    roll = clamp((k - 0.25) / 0.3),
    tray = clamp((k - 0.45) / 0.3),
    tin = clamp((k - 0.7) / 0.3);
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
  const fly = clamp((k - 0.25) / 0.3);
  if (fly > 0 && fly < 1 && sq) drawSnack(ctx, "cup", x + (sq.x - x) * fly, y - 20 + (sq.y - 50 - (y - 20)) * fly - Math.sin(fly * Math.PI) * 70, 0.55, fly * 9);
}

// ---------- the bartender ----------
/**
 * How far round she is: 0 her back to him, 1 facing him. She turns to face over the "glance" and turns away
 * again at the start of "back".
 */
export function bartenderTurn(c) {
  if (c.phase === "face") return 1;
  if (c.phase === "glance") return ease(clamp(c.t / BAR.glance));
  return 1 - ease(clamp(c.t / BAR.away));
}
/** Her back: the bun, the apron's bow, one arm up at the shelf with a cup (she is busy, not looking). */
function bartenderBack(ctx, h, t) {
  const k = h / 100,
    L = LOOKS.bartender,
    ow = 5 / k,
    lift = Math.sin(t * 3) * 1.5;
  ctx.save();
  ctx.scale(k, k);
  rr(ctx, -9, -34, 8, 32, 2, L.pants, ow);
  rr(ctx, 1, -34, 8, 32, 2, L.pants, ow);
  rr(ctx, -21, -70, 7, 30, 3, L.shirt, ow);
  // her other arm reaches up to the shelf, a cup in her hand
  ctx.save();
  ctx.translate(17.5, -68);
  ctx.rotate(-2.5 + lift * 0.03);
  rr(ctx, -3.5, -2, 7, 30, 3, L.shirt, ow);
  oval(ctx, 0, 30, 3.6, 3.6, L.skin, ow);
  rr(ctx, -5, 30, 10, 11, 2, "#8fdcff", ow * 0.8);
  ctx.restore();
  rr(ctx, -15, -72, 30, 40, 7, L.shirt, ow);
  // the apron's strings, tied in a bow at her back
  line(ctx, [-13, -50, 13, -50], "#fffdf8", 2.4);
  oval(ctx, -4.5, -50, 4.5, 3.2, "#fffdf8", ow * 0.7);
  oval(ctx, 4.5, -50, 4.5, 3.2, "#fffdf8", ow * 0.7);
  line(ctx, [-2, -48, -4, -40], "#fffdf8", 2);
  line(ctx, [2, -48, 4, -40], "#fffdf8", 2);
  // the back of her head: all hair, and the bun
  oval(ctx, 0, -84, 12, 12, L.hair, ow);
  oval(ctx, 0, -99, 5, 4, L.hair, ow);
  ctx.restore();
}
/** Her front (the approved bartender, drawPerson), with wide eyes on the pyramid; brows up when she sees his paw. */
function bartenderFront(ctx, h, t, alarmed) {
  drawPerson(ctx, 0, 0, h, LOOKS.bartender, 1, 0);
  const k = h / 100,
    hy = -84 * k;
  for (const ex of [-4.6, 4.6]) {
    oval(ctx, ex * k, hy + 1 * k, 3.1 * k, (alarmed ? 4 : 3.4) * k, "#ffffff", 4);
    oval(ctx, (ex - 1) * k, hy + 1.8 * k, 1.5 * k, 1.7 * k, INK);
    alarmed && line(ctx, [(ex - 3) * k, hy - 5.5 * k, (ex + 3) * k, hy - 6.5 * k - ex * 0.2 * k], INK, 5);
  }
}
/** The bartender at `at` ({ x, y, h }), turned by `turn` (0 her back, 1 her front): her whole body swings round. */
export function drawBartender(ctx, at, turn, t, alarmed) {
  const wide = Math.abs(Math.cos(turn * Math.PI));
  ctx.save();
  ctx.translate(at.x, at.y + Math.sin(t * 2) * 3);
  ctx.scale(Math.max(0.12, wide), 1);
  turn < 0.5 ? bartenderBack(ctx, at.h, t) : bartenderFront(ctx, at.h, t, alarmed);
  ctx.restore();
}
/** Her eyes, where her sight starts. */
const eyesOf = (at) => ({ x: at.x, y: at.y - at.h * 0.83 });
/**
 * Her sight: the game's cone, from her eyes. Facing him it lies over the pyramid; while she turns it swings round
 * from the shelf. Yellow fills it when his paw is out in it (fur showing), as the hall's cones do.
 */
export function drawBarSight(ctx, c, t) {
  const turn = bartenderTurn(c);
  if (turn <= 0.02) return null;
  const e = eyesOf(CUT.bartender),
    aim = Math.atan2(CUT.cell.y - 150 - e.y, CUT.cell.x - e.x), // the middle of the pyramid
    a = aim + (1 - turn) * 2.2, // swinging down from the shelf side
    half = 0.5,
    len = 760,
    seen = c.phase === "face" && pawOut(c);
  ctx.save();
  ctx.globalAlpha *= 0.25 + 0.75 * turn;
  // (it starts a little way out from her face, so her eyes stay clear)
  ctx.beginPath();
  ctx.arc(e.x, e.y, 84, a + half, a - half, true);
  ctx.arc(e.x, e.y, len, a - half, a + half);
  ctx.closePath();
  ctx.fillStyle = seen ? "rgba(255,207,51,.55)" : "rgba(255,207,51,.3)";
  ctx.fill();
  ctx.setLineDash([18, 12]);
  ctx.lineDashOffset = -t * 30;
  ctx.lineWidth = 5;
  ctx.strokeStyle = seen ? "#e5533d" : "#d99a00";
  ctx.stroke();
  ctx.restore();
  return { x: e.x, y: e.y, a, half, len };
}
/** The eye beside her: shut while her back is turned, opening as she turns, wide open (ringed red) facing him. */
export function drawEyeSign(ctx, x, y, open, t) {
  const r = 40,
    lid = clamp(open);
  ctx.save();
  ctx.translate(x, y);
  oval(ctx, 0, 0, r, r, "#fffdf8", 5);
  if (lid > 0.9) ((ctx.lineWidth = 7), (ctx.strokeStyle = "#e5533d"), ctx.beginPath(), ctx.arc(0, 0, r + 6 + Math.sin(t * 10) * 2, 0, TAU), ctx.stroke());
  // the eye: an almond that opens
  const hgt = 3 + 15 * lid;
  ctx.beginPath();
  ctx.moveTo(-26, 0);
  ctx.quadraticCurveTo(0, -hgt * 2, 26, 0);
  ctx.quadraticCurveTo(0, hgt * 2, -26, 0);
  ctx.closePath();
  ctx.fillStyle = lid > 0.3 ? "#ffffff" : "#d8cdbd";
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = INK;
  ctx.stroke();
  if (lid > 0.3) (oval(ctx, 0, 0, 8 * lid + 2, 8 * lid + 2, "#4a3020"), oval(ctx, 0, 0, 4 * lid, 4 * lid, INK));
  else for (const lx of [-16, -6, 6, 16]) line(ctx, [lx, 5, lx * 1.15, 13], INK, 4); // shut: lashes hang down
  ctx.restore();
}

// ---------- the close-up ----------
function drawBag(ctx, s, landed) {
  const b = CUT.bag,
    w = b.x1 - b.x0,
    top = b.y0 + 34;
  // what he took last pokes out of the top
  s.taken.slice(-3).forEach((id, j) => drawSnack(ctx, kindOf(id), b.x0 + 36 + j * 44, top - 6 - (j % 2) * 10, 1.5, (j - 1) * 0.25, 0, 2.4));
  // a paper bag: its body, the zig-zag cut along its open top, a fold down the side, two string handles
  ctx.beginPath();
  ctx.moveTo(b.x0 + 6, top);
  for (let i = 0; i <= 8; i++) ctx.lineTo(b.x0 + 6 + ((w - 12) * i) / 8, top + (i % 2 ? -10 : 0));
  ctx.lineTo(b.x1 - 14, b.y1 + 20);
  ctx.lineTo(b.x0 + 14, b.y1 + 20);
  ctx.closePath();
  ctx.fillStyle = "#c9a26b";
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = INK;
  ctx.lineJoin = "round";
  ctx.stroke();
  line(ctx, [b.x1 - 34, top + 2, b.x1 - 42, b.y1 + 20], "#a9814c", 4);
  for (const hx of [b.x0 + 44, b.x1 - 44]) (ctx.beginPath(), ctx.arc(hx, top - 2, 20, Math.PI, 0), (ctx.lineWidth = 5), (ctx.strokeStyle = "#8b5a3c"), ctx.stroke());
  // the count: a number on the bag (no words), popping as a snack lands
  const cx = (b.x0 + b.x1) / 2 - 6,
    cy = (top + b.y1) / 2 + 12,
    pop = 1 + landed * 0.25;
  oval(ctx, cx, cy, 40 * pop, 40 * pop, "#fffdf8", 5);
  words(ctx, String(s.bag), cx, cy + 3, 56 * pop, INK);
}
function drawLeave(ctx) {
  const L = CUT.leave;
  rr(ctx, L.x0, L.y0, L.x1 - L.x0, L.y1 - L.y0, 28, "#2457c5", 6);
  words(ctx, partyLine("button-leave-bar"), (L.x0 + L.x1) / 2, (L.y0 + L.y1) / 2 + 2, 44, "#ffffff");
}
// The wall behind the bar, her shelf of cups and bottles, and the counter the pyramid stands on.
function drawBarRoom(ctx) {
  ctx.fillStyle = "#f1e3ea";
  ctx.fillRect(0, 0, 960, 640);
  ctx.fillStyle = "#e3cfd9";
  ctx.fillRect(0, 380, 960, 140);
  rr(ctx, 640, 118, 330, 16, 4, "#b08968", 4);
  [
    ["#8fdcff", 672, 30, 44],
    ["#ffcf33", 728, 26, 62],
    ["#e5533d", 876, 26, 58],
    ["#8fdcff", 926, 30, 44],
  ].forEach(([col, bx, bw, bh]) => rr(ctx, bx - bw / 2, 118 - bh, bw, bh, 5, col, 4));
}
function drawCounter(ctx) {
  rr(ctx, -10, CUT.counter, 980, 44, 8, "#d7c4a3", 5);
  rr(ctx, -10, CUT.counter + 42, 980, 120, 4, "#b08968", 4);
}
// One snack of the pile in the close-up: jiggling if loose, pressed or squashed if stood on, sliding if it just
// moved, leaning if the pile is going. Returns nothing; `fall` is 0 to 1 once the pile is going.
function drawPileSnack(ctx, c, slots, i, t, fall) {
  const id = slots[i],
    at = slotAt(i),
    how = load(slots, i),
    press = how === "squashed" ? 2 : how === "pressed" ? 1 : 0,
    row = SLOTS[i].row;
  let x = at.x,
    y = at.y,
    rot = 0;
  const slide = c.slides.find((m) => m.to === i);
  if (slide) {
    // it drops into the gap with a small bounce
    const k = clamp(slide.t / BAR.settle),
      from = slotAt(slide.from),
      d = k < 0.7 ? ease(k / 0.7) : 1 - Math.sin(((k - 0.7) / 0.3) * Math.PI) * 0.08;
    x = from.x + (at.x - from.x) * d;
    y = from.y + (at.y - from.y) * d;
    rot = (1 - k) * 0.3 * Math.sign(at.x - from.x);
  } else if (fall > 0) {
    // the pile leans toward the gap, the higher rows furthest
    const dir = Math.sign(slotAt(c.gap).x - CUT.cell.x) || 1,
      above = row - SLOTS[c.gap].row;
    if (above > 0) ((x += dir * fall * fall * 34 * above), (y += fall * fall * 26 * above), (rot = dir * fall * 0.5 * above));
    else rot = Math.sin(t * 40 + i) * 0.04 * fall;
  } else if (press === 0) {
    // loose: it jiggles
    rot = Math.sin(t * 9 + i * 1.7) * 0.09;
    y -= Math.abs(Math.sin(t * 9 + i * 1.7)) * 4;
    for (const sx of [-1, 1]) (ctx.beginPath(), ctx.arc(x + sx * 58, y - 6, 12, sx > 0 ? -0.7 : Math.PI - 0.7, sx > 0 ? 0.7 : Math.PI + 0.7), (ctx.lineWidth = 4), (ctx.strokeStyle = "rgba(30,36,48,.45)"), ctx.stroke());
  }
  // a squashed snack carries two: strain marks at its sides
  if (press === 2 && !slide && fall <= 0) for (const sx of [-1, 1]) (line(ctx, [x + sx * 50, y + 30, x + sx * 62, y + 38], "#e5533d", 5), line(ctx, [x + sx * 52, y + 14, x + sx * 66, y + 14], "#e5533d", 5));
  drawSnack(ctx, kindOf(id), x, y + press * 4, SNACK_SIZE.cut, rot, slide || fall > 0 ? 0 : press, 2);
  // a puff where a sliding snack lands
  if (slide && slide.t / BAR.settle > 0.65) {
    const k = clamp((slide.t / BAR.settle - 0.65) / 0.35);
    for (const sx of [-1, 1]) oval(ctx, at.x + sx * (40 + 24 * k), at.y + 40, 10 * (1 - k) + 4, 8 * (1 - k) + 3, `rgba(255,253,248,${0.9 * (1 - k)})`, 2);
  }
}
/**
 * The close-up, drawn over the whole picture, bright and sharp: the wall and her shelf, the bartender (her back,
 * turning, or facing him), her sight, the counter, the pyramid, his bag with its count, LEAVE · bar, and his paw
 * (the engine's paw arm, `drawPawArm`) with the snack it carries. Returns what was drawn where (tests).
 */
export function drawSnackCloseUp(ctx, p, t, drawPawArm) {
  const c = p.snack,
    s = p.snacks;
  if (!c || !s) return null;
  const slots = s.slots || fullStack(),
    fall = c.fall >= 0 ? clamp(c.fall / BAR.fall) : 0,
    turn = bartenderTurn(c);
  ctx.save();
  ctx.globalAlpha = ease(clamp(c.zoom));
  drawBarRoom(ctx);
  drawBartender(ctx, CUT.bartender, turn, t, c.phase === "face" && pawOut(c));
  drawCounter(ctx);
  const sight = drawBarSight(ctx, c, t);
  // bottom row first, so each snack sits in front of the ones it stands on
  for (let i = slots.length - 1; i >= 0; i--) slots[i] >= 0 && drawPileSnack(ctx, c, slots, i, t, fall);
  if (fall > 0) {
    // the gap he made: a burst, and the snack he let go of dropping away
    const g = slotAt(c.gap);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU + 0.3;
      line(ctx, [g.x + Math.cos(a) * 34, g.y + Math.sin(a) * 30, g.x + Math.cos(a) * (52 + 26 * fall), g.y + Math.sin(a) * (46 + 22 * fall)], "#e5533d", 7);
    }
    drawSnack(ctx, kindOf(c.dropped), g.x + 30 * fall, g.y + 150 * fall * fall, SNACK_SIZE.cut, fall * 3, 0, 2);
  }
  drawEyeSign(ctx, CUT.bartender.x - 118, CUT.bartender.y - CUT.bartender.h * 0.92, turn, t);
  drawLeave(ctx);
  const paw = c.paw || CUT.rest;
  drawPawArm && drawPawArm(ctx, paw);
  c.held >= 0 && drawSnack(ctx, kindOf(c.held), paw.x, paw.y - 30, SNACK_SIZE.cut, 0, 0, 2);
  // the bag is in front of his arm: his paw dips into it from behind, and the count is never covered
  drawBag(ctx, s, c.landed || 0);
  ctx.restore();
  return { sight, turn, fall };
}
