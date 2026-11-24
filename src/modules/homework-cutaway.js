/**
 * The homework cutaway: two full-screen pictures, shown in the shared cutaway (cutaway.js) when Squatch does
 * his homework at the desk on the home-alone morning. Brian G 567: "maybe there's a little cutaway of
 * Sasquatch doing homework there", "at the top of the homework it should say something like I sweaty instead of
 * I ready"; G 576: "do something fun, you come up with whatever you think makes sense".
 *   Picture 1: Squatch at the little desk, pencil in his paw, tongue out, scribbling.
 *   Picture 2: the sheet up close: "I SWEATY" in wobbly kid letters, "Name: Squatch", the sums, a muddy paw print.
 * Squatch is the game's own drawing (the engine's drawSquatch, handed over through the bridge), so he stays on
 * model. Every word comes from home-alone-lines.js.
 */
import { homeLine } from "./home-alone-lines.js";

const INK = "#1e2430",
  WALL = "#f4f1ea",
  FLOOR = "#ebe6da",
  DESK = "#cdbb98",
  DESK_DARK = "#a8916a",
  PAPER = "#fffdf8",
  RULE = "#b9d3f0",
  MARGIN = "#f2a7a7",
  PENCIL = "#ffcf33",
  PENCIL_WOOD = "#f4d7a8",
  ERASER = "#f6b3c2",
  LEAD = "#4a505c",
  TONGUE = "#f27a95",
  MUD = "#7a5230",
  WRITING = "#3a3f4b";

// Picture 1: where Squatch stands behind the desk (his feet, hidden by the desk) and how big he is drawn.
// At this size his outlines are under twice as thick as the room's people at their usual size; bigger would
// make them heavy (the beard cutaway's lesson: tests/morning-order.mjs). His feet are behind the desk and his
// near paw rests on its top.
const SQ = { x: 480, y: 520, scale: 5.4 };
// His near paw (the engine's Squatch, arm at rest): body width 11.5 - 1 + sin(.35) x arm 12, and
// leg 7 + body 14 - 3 - cos(.35) x 12 above his feet, in his own units.
const PAW = { x: 14.6, y: -6.7 };
// His mouth, in his own units (head 15 tall, centred 32.25 above his feet).
const MOUTH = { x: 2.6, y: -26 };
const DESK_TOP = { x0: 230, x1: 730, y0: 470, y1: 506 };

// The wall and floor behind him (the floor line sits above the desk top, so the desk stands on the floor).
const FLOOR_Y = 420;
function room(ctx) {
  ctx.fillStyle = WALL;
  ctx.fillRect(0, 0, 960, FLOOR_Y);
  ctx.fillStyle = FLOOR;
  ctx.fillRect(0, FLOOR_Y, 960, 640 - FLOOR_Y);
  ctx.strokeStyle = "rgba(30,36,48,.18)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, FLOOR_Y);
  ctx.lineTo(960, FLOOR_Y);
  ctx.stroke();
}

function pencil(ctx, x, y, angle, len) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.lineJoin = "round";
  ctx.lineWidth = 3;
  ctx.strokeStyle = INK;
  // Tip at 0, 0, pointing left; eraser at the far end.
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(18, -6);
  ctx.lineTo(18, 6);
  ctx.closePath();
  ctx.fillStyle = PENCIL_WOOD;
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(6, -2);
  ctx.lineTo(6, 2);
  ctx.closePath();
  ctx.fillStyle = LEAD;
  ctx.fill();
  ctx.fillStyle = PENCIL;
  ctx.fillRect(18, -6, len - 30, 12);
  ctx.strokeRect(18, -6, len - 30, 12);
  ctx.fillStyle = ERASER;
  ctx.fillRect(len - 12, -6, 12, 12);
  ctx.strokeRect(len - 12, -6, 12, 12);
  ctx.restore();
}

// Picture 1: Squatch at the desk, scribbling (the pencil wiggles; a few lines appear on the sheet and start over).
function atDesk(ctx, t, engine) {
  room(ctx);
  const s = SQ.scale;
  engine.drawSquatch(SQ.x, SQ.y, s, { f: 1 });
  // Tongue out of the corner of his mouth while he concentrates.
  ctx.beginPath();
  ctx.ellipse(SQ.x + MOUTH.x * s, SQ.y + MOUTH.y * s + 4, 7, 5.5, 0.4, 0, Math.PI * 2);
  ctx.fillStyle = TONGUE;
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = INK;
  ctx.stroke();
  // The desk in front of him: the top (seen a little from above) with the sheet on it, and two legs.
  const d = DESK_TOP;
  ctx.lineWidth = 4;
  ctx.strokeStyle = INK;
  ctx.fillStyle = DESK_DARK;
  for (const x of [d.x0 + 30, d.x1 - 52]) (ctx.fillRect(x, d.y1, 22, 640 - d.y1), ctx.strokeRect(x, d.y1, 22, 650 - d.y1));
  ctx.beginPath();
  ctx.moveTo(d.x0 + 40, d.y0);
  ctx.lineTo(d.x1 - 40, d.y0);
  ctx.lineTo(d.x1, d.y1);
  ctx.lineTo(d.x0, d.y1);
  ctx.closePath();
  ctx.fillStyle = DESK;
  ctx.fill();
  ctx.stroke();
  // The sheet, flat on the desk, and the lines he has written so far.
  const scribble = (t % 3) / 3;
  ctx.beginPath();
  ctx.moveTo(470, d.y0 + 4);
  ctx.lineTo(610, d.y0 + 4);
  ctx.lineTo(630, d.y1 - 4);
  ctx.lineTo(452, d.y1 - 4);
  ctx.closePath();
  ctx.fillStyle = PAPER;
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.strokeStyle = WRITING;
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    const k = Math.max(0, Math.min(1, scribble * 3 - i));
    if (!k) continue;
    const y = d.y0 + 11 + i * 8,
      x0 = 478 - i * 4;
    ctx.beginPath();
    ctx.moveTo(x0, y);
    for (let x = 0; x <= 110 * k; x += 6) ctx.lineTo(x0 + x, y + Math.sin(x * 0.7 + i) * 1.6);
    ctx.stroke();
  }
  // The pencil in his near paw, its tip on the sheet, wiggling as he writes.
  const paw = { x: SQ.x + PAW.x * s, y: SQ.y + PAW.y * s };
  const wiggle = Math.sin(t * 14) * 0.08;
  pencil(ctx, paw.x - 34, d.y0 + 14, -0.9 + wiggle, 96);
  // His paw closes round the pencil (the game's paw colour).
  ctx.beginPath();
  ctx.arc(paw.x - 8, paw.y + 4, 11, 0, Math.PI * 2);
  ctx.fillStyle = "#f4c39a";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = INK;
  ctx.stroke();
  return { squatch: { x: SQ.x, y: SQ.y, scale: s }, pencil: true };
}

// One line of kid writing: the whole line tilted a little, as a kid writes.
function write(ctx, engine, words, x, y, size, tilt, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tilt);
  engine.text(words, 0, 0, size, color || WRITING, "left", 900);
  ctx.restore();
}

// A muddy paw print: a pad and four toes.
function pawPrint(ctx, x, y, k) {
  ctx.save();
  ctx.globalAlpha = 0.78;
  ctx.fillStyle = MUD;
  ctx.beginPath();
  ctx.ellipse(x, y, 30 * k, 24 * k, 0, 0, Math.PI * 2);
  ctx.fill();
  for (const [dx, dy, r] of [
    [-30, -34, 10],
    [-11, -46, 11],
    [11, -46, 11],
    [30, -34, 10],
  ]) {
    ctx.beginPath();
    ctx.ellipse(x + dx * k, y + dy * k, r * k, r * 1.2 * k, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // A couple of mud specks.
  for (const [dx, dy, r] of [
    [44, 18, 4],
    [-46, 22, 3],
  ]) {
    ctx.beginPath();
    ctx.arc(x + dx * k, y + dy * k, r * k, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// Picture 2: the sheet up close, lying on the desk.
function sheet(ctx, t, engine) {
  ctx.fillStyle = DESK;
  ctx.fillRect(0, 0, 960, 640);
  ctx.strokeStyle = DESK_DARK;
  ctx.lineWidth = 3;
  for (let y = 40; y < 640; y += 90) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(300, y + 14, 640, y - 12, 960, y + 6);
    ctx.stroke();
  }
  ctx.save();
  ctx.translate(480, 320);
  ctx.rotate(-0.025);
  const W = 620,
    H = 560;
  ctx.beginPath();
  ctx.roundRect(-W / 2, -H / 2, W, H, 8);
  ctx.fillStyle = PAPER;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = INK;
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.strokeStyle = RULE;
  for (let y = -H / 2 + 150; y < H / 2 - 20; y += 52) {
    ctx.beginPath();
    ctx.moveTo(-W / 2 + 10, y);
    ctx.lineTo(W / 2 - 10, y);
    ctx.stroke();
  }
  ctx.strokeStyle = MARGIN;
  ctx.beginPath();
  ctx.moveTo(-W / 2 + 70, -H / 2 + 8);
  ctx.lineTo(-W / 2 + 70, H / 2 - 8);
  ctx.stroke();
  // The heading, big and wobbly; his name; the subject and the two sums on the lines.
  write(ctx, engine, homeLine("sheet-heading"), -W / 2 + 96, -H / 2 + 62, 58, -0.04, INK);
  write(ctx, engine, homeLine("sheet-name"), -W / 2 + 96, -H / 2 + 124, 30, 0.02);
  // The writing sits just above the ruled lines (at 150, 202, 254, ... from the top).
  write(ctx, engine, homeLine("sheet-subject"), -W / 2 + 96, -H / 2 + 234, 32, -0.015);
  write(ctx, engine, homeLine("sheet-sum"), -W / 2 + 96, -H / 2 + 286, 34, 0.02);
  write(ctx, engine, homeLine("sheet-take"), -W / 2 + 96, -H / 2 + 338, 34, -0.025);
  pawPrint(ctx, W / 2 - 110, H / 2 - 90, 1.1);
  ctx.restore();
  // His pencil lying across the corner of the sheet.
  pencil(ctx, 170, 590, -0.35, 170);
  return { sheet: true, paw: true };
}

/** The two homework pictures, in order. Each is (ctx, t, engine) -> what it drew (for tests). */
export const HOMEWORK_PANELS = [atDesk, sheet];
