/**
 * The home morning's drawings (Chapter 1, beats 22 to 24). Everything here is a PLACEHOLDER drawing in the game's
 * style (dark outlines, flat colours) until Brian approves a look: the toy rocket with the folded note tied on as a
 * gift tag, Mops's paper lunch bag, the Guardian Box close-up (the box big, its approved blue "G" front, a taped
 * "MY GARDIANS" label on the lid), the thought bubble with the box in it, and today's marks on the calendar
 * close-up (the days before the circled Moon Pie day crossed off). The Guardian Box in the room is the approved
 * one (docs/approved-art/closet/, home-alone.js GUARDIAN_BOX), at exactly its approved size.
 * Sizes are read against the home room: Squatch is 48.5 of his units at the room's scale 3 (about 145 px), and every
 * thing here is a share of that (MORNING_SIZES). Game positions are the 960 x 640 picture.
 */
import { GUARDIAN_BOX } from "./guardian-box.js";
import { drawThought } from "./bedtime-story-art.js";

const HM_INK = "#1e2430";
const ROCKET_RED = "#e5533d";
// The locked home picture is 1280 x 830; the game picture 960 x 640.
const PIC_X = 960 / 1280,
  PIC_Y = 640 / 830;
// The approved box in picture pixels (outline included) and on the game picture.
const BOX_PIC = Object.freeze({ w: GUARDIAN_BOX.x1 - GUARDIAN_BOX.x0, h: GUARDIAN_BOX.y1 - GUARDIAN_BOX.y0 });
const BOX_W = BOX_PIC.w * PIC_X,
  BOX_H = BOX_PIC.h * PIC_Y;

/**
 * How big each thing is in the room (game pixels; placeholders, Brian to approve): Squatch is the room's own size;
 * the rocket a third of him; the lunch bag about a quarter; the box exactly the approved one.
 */
export const MORNING_SIZES = Object.freeze({
  squatch: 48.5 * 3,
  rocket: 46,
  rocketW: 24, // fin tip to fin tip
  bag: { w: 30, h: 38 },
  box: Object.freeze({ w: BOX_W, h: BOX_H }),
});

/**
 * Where things are in the room (game positions; placeholders). The rocket stands on the floor at the foot of the bed
 * (in front of its right end); the lunch bag sits on the floor just inside the doorway, where Mops put it down; the
 * Guardian Box is on the closet floor (the approved place) until Squatch takes it out and sets it on the floor
 * between the wardrobe and him (BOX_OUT), where it stays.
 */
export const MORNING_THINGS = Object.freeze({
  rocket: Object.freeze({ x: 322, y: 592 }), // the middle of its base
  bag: Object.freeze({ x: 866, y: 474 }), // the middle of its bottom
  boxIn: Object.freeze({ x0: GUARDIAN_BOX.x0 * PIC_X, y0: GUARDIAN_BOX.y0 * PIC_Y, x1: GUARDIAN_BOX.x1 * PIC_X, y1: GUARDIAN_BOX.y1 * PIC_Y }),
  boxOut: Object.freeze({ x0: 192, y0: 362, x1: 192 + BOX_W, y1: 362 + BOX_H }),
});
/** The boxes the dashed outline traces each drawn thing inside (a little bigger than the thing, nothing else in them). */
export const TRACE = Object.freeze({
  rocket: Object.freeze({ x0: 298, x1: 366, y0: 536, y1: 602 }),
  bag: Object.freeze({ x0: 840, x1: 892, y0: 424, y1: 484 }),
});

function hmRound(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, Math.max(0, Math.min(r, w / 2, h / 2)));
}
function hmPaint(ctx, fill, line) {
  fill && ((ctx.fillStyle = fill), ctx.fill());
  line && ((ctx.strokeStyle = HM_INK), (ctx.lineWidth = line), (ctx.lineJoin = "round"), ctx.stroke());
}

/** The folded note: a cream paper folded once, no words and no marks. Its middle at (0, 0), in rocket units. */
function giftNote(ctx, lw) {
  ctx.save();
  ctx.rotate(0.18);
  hmRound(ctx, -7, -5, 14, 10, 1.2);
  hmPaint(ctx, "#fff4c2", lw);
  ctx.beginPath();
  ctx.moveTo(-7, 0.5);
  ctx.lineTo(7, 0.5);
  ctx.strokeStyle = "rgba(30,36,48,.45)";
  ctx.lineWidth = lw * 0.6;
  ctx.stroke();
  ctx.restore();
}

/**
 * The toy rocket with the note tied on as a gift tag, the middle of its base at (x, y), `k` times its room size,
 * turned by `a`. `tag`: the note hangs from it on a string (false: drawn by the caller elsewhere). `lw`: outline width
 * in game pixels. Returns its box (game positions, unturned).
 */
export function drawRocket(ctx, x, y, { k = 1, a = 0, tag = true, lw = 2.5 } = {}) {
  const u = k,
    w = lw / u;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(a);
  ctx.scale(u, u);
  // fins
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(s * 6, -16);
    ctx.lineTo(s * 12, -2);
    ctx.lineTo(s * 12, 0);
    ctx.lineTo(s * 5, -4);
    ctx.closePath();
    hmPaint(ctx, ROCKET_RED, w);
  }
  // the body, the nose cone, the round window
  hmRound(ctx, -7, -36, 14, 34, 6);
  hmPaint(ctx, "#fffdf8", w);
  ctx.beginPath();
  ctx.moveTo(-6.4, -34);
  ctx.quadraticCurveTo(0, -50, 6.4, -34);
  ctx.closePath();
  hmPaint(ctx, ROCKET_RED, w);
  ctx.beginPath();
  ctx.arc(0, -24, 3.6, 0, Math.PI * 2);
  hmPaint(ctx, "#8fdcff", w);
  // the exhaust at the bottom
  hmRound(ctx, -4, -4, 8, 4, 1);
  hmPaint(ctx, "#59657d", w);
  if (tag) {
    // the string from the body to the note, then the note
    ctx.beginPath();
    ctx.moveTo(6.5, -20);
    ctx.quadraticCurveTo(13, -16, 15, -11);
    ctx.strokeStyle = HM_INK;
    ctx.lineWidth = w * 0.5;
    ctx.stroke();
    ctx.translate(17, -6);
    giftNote(ctx, w);
  }
  ctx.restore();
  return { x0: x - 12 * k, x1: x + (tag ? 25 : 12) * k, y0: y - 46 * k, y1: y };
}

/** Just the note (in the box close-up, where it hangs over the rim). (x, y) its middle, `k` the rocket's scale. */
export function drawGiftNote(ctx, x, y, k, lw = 2.5) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  giftNote(ctx, lw / k);
  ctx.restore();
}

/** Mops's paper lunch bag, the middle of its bottom at (x, y): a brown bag with its top folded over. No words. */
export function drawLunchBag(ctx, x, y, k = 1) {
  const W = MORNING_SIZES.bag.w,
    H = MORNING_SIZES.bag.h;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  const w = 2.5 / k;
  hmRound(ctx, -W / 2, -H + 8, W, H - 8, 2);
  hmPaint(ctx, "#c9a06b", w);
  // the folded top: a little narrower, darker, with a crinkled edge
  ctx.beginPath();
  ctx.moveTo(-W / 2 + 2, -H + 9);
  ctx.lineTo(-W / 2 + 2, -H);
  for (let i = 0; i <= 6; i++) ctx.lineTo(-W / 2 + 2 + ((W - 4) * i) / 6, -H + (i % 2 ? 2 : 0));
  ctx.lineTo(W / 2 - 2, -H + 9);
  ctx.closePath();
  hmPaint(ctx, "#a87f4b", w);
  // a crease down the middle
  ctx.beginPath();
  ctx.moveTo(0, -H + 12);
  ctx.lineTo(0, -4);
  ctx.strokeStyle = "rgba(30,36,48,.3)";
  ctx.lineWidth = w;
  ctx.stroke();
  ctx.restore();
}

/**
 * The approved Guardian Box (home-alone.js GUARDIAN_BOX: Brian's look of 2026-11-23), its top left at (x0, y0) on
 * the game picture, `k` times its approved size. Drawn exactly as home-alone.js draws it on the closet floor.
 */
export function drawGuardianBox(ctx, x0, y0, k = 1) {
  const b = GUARDIAN_BOX,
    half = b.line / 2;
  ctx.save();
  ctx.translate(x0, y0);
  ctx.scale(PIC_X * k, PIC_Y * k);
  ctx.beginPath();
  ctx.roundRect(half, half, BOX_PIC.w - b.line, BOX_PIC.h - b.line, b.radius);
  ctx.fillStyle = b.fill;
  ctx.fill();
  ctx.lineWidth = b.line;
  ctx.strokeStyle = b.ink;
  ctx.stroke();
  // The letter is part of the approved picture, not reading text.
  ctx.font = `900 ${b.letter}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("G", BOX_PIC.w / 2, BOX_PIC.h / 2 + 1);
  ctx.restore();
}

/**
 * The box out on the floor with the gift in it: the rocket stands in it, leaning, its top half sticking out over the
 * front, the note hanging over the rim. `box` is the box's place (game positions).
 */
export function drawBoxWithGift(ctx, box) {
  const cx = (box.x0 + box.x1) / 2;
  drawRocket(ctx, cx - 2, box.y1 - 4, { a: -0.22, tag: false });
  drawGuardianBox(ctx, box.x0, box.y0);
  drawGiftNote(ctx, box.x1 - 9, box.y0 + 3, 1);
}

/** The thought bubble over Squatch's head with the Guardian Box in it (no words). Returns its box. */
export function drawBoxThought(ctx, head, a = 1) {
  return drawThought(ctx, head, a, (c, cx, cy) => drawGuardianBox(c, cx - BOX_W * 1.1, cy - BOX_H * 1.1, 2.2));
}

// ---------- the outlines' sources: each drawn thing alone on a plain floor, once ----------
const SOURCES = {};
/** A canvas the size of the game picture with only `id` ("rocket" or "bag") drawn at its place, for the dashed outline. */
export function outlineSource(id) {
  if (SOURCES[id]) return SOURCES[id];
  if (typeof document === "undefined") return null;
  const c = document.createElement("canvas");
  c.width = 960;
  c.height = 640;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.fillStyle = "#e8e3d9";
  ctx.fillRect(0, 0, 960, 640);
  const t = MORNING_THINGS[id];
  id === "rocket" ? drawRocket(ctx, t.x, t.y) : drawLunchBag(ctx, t.x, t.y);
  return (SOURCES[id] = c);
}

// ---------- the calendar close-up's marks for today ----------
/**
 * Over the older program's calendar close-up (src/game/15-ch1-scene1.js drawCh1Calendar, its paper 720 x 530 drawn
 * at (460, 320) scaled by 0.92 + 0.08 * zoom): days 1 to 13 crossed off in pencil, so the circled Moon Pie day (14)
 * is the first day not crossed off, today; and that circle pulses. Placeholder marks. Returns what it drew.
 */
export const CALENDAR_TODAY = Object.freeze({ day: 14, circle: Object.freeze({ x: 492, y: 330 }) });
export function drawCalendarToday(ctx, zoom, time) {
  const s = 0.92 + 0.08 * Math.min(1, zoom || 0);
  ctx.save();
  ctx.translate(460, 320);
  ctx.scale(s, s);
  ctx.translate(-360, -265);
  ctx.lineCap = "round";
  ctx.strokeStyle = "rgba(70,78,92,.5)";
  ctx.lineWidth = 3;
  const crossed = [];
  for (let day = 1; day < CALENDAR_TODAY.day; day++) {
    const x = 30 + ((day - 1) % 5) * 132,
      y = 130 + Math.floor((day - 1) / 5) * 80;
    ctx.beginPath();
    ctx.moveTo(x + 26, y + 12);
    ctx.lineTo(x + 112, y + 70);
    ctx.moveTo(x + 112, y + 12);
    ctx.lineTo(x + 26, y + 70);
    ctx.stroke();
    crossed.push(day);
  }
  // today's circle pulses: a second red ring breathing out from the crayon circle
  const p = 0.5 + 0.5 * Math.sin((time || 0) * 4);
  ctx.strokeStyle = `rgba(229,83,61,${0.35 + 0.45 * p})`;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(CALENDAR_TODAY.circle.x, CALENDAR_TODAY.circle.y, 44 + 6 * p, 41 + 6 * p, -0.15, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
  return { crossed, today: CALENDAR_TODAY.day };
}

// ---------- the Guardian Box close-up (one full-screen cutaway picture, waits for NEXT) ----------
/**
 * The close-up's timing (seconds; placeholders): his paw holds the gift over the open box until `hold`, lets go, and
 * the gift drops in over `fall` (the thunk at `hold + fall`); then it stays.
 * k: how much bigger than the room everything in it is (the box and the rocket keep their room proportion).
 */
export const BOX_CLOSEUP = Object.freeze({ k: 5.5, hold: 1.0, fall: 0.42, floor: 470, x: 560 });

function gboxCloseUp(ctx, t, engine) {
  const K = BOX_CLOSEUP.k,
    w = BOX_W * K,
    h = BOX_H * K,
    cx = BOX_CLOSEUP.x,
    x0 = cx - w / 2,
    y0 = 600 - h;
  // the floor under the box
  ctx.fillStyle = "#ebe6da";
  ctx.fillRect(0, BOX_CLOSEUP.floor, 960, 640 - BOX_CLOSEUP.floor);
  ctx.strokeStyle = "rgba(30,36,48,.18)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, BOX_CLOSEUP.floor);
  ctx.lineTo(960, BOX_CLOSEUP.floor);
  ctx.stroke();
  // the lid, folded open against the box's left side, with its taped label (never behind the gift)
  const lid = { x0: x0 - 214, x1: x0 - 8, y0: y0 - 40, y1: y0 + 70 };
  ctx.beginPath();
  ctx.moveTo(lid.x1, lid.y0 + 18);
  ctx.lineTo(lid.x0, lid.y0);
  ctx.lineTo(lid.x0 + 10, lid.y1);
  ctx.lineTo(lid.x1, lid.y1 + 8);
  ctx.closePath();
  hmPaint(ctx, GUARDIAN_BOX.fill, 5);
  const lab = { x0: lid.x0 + 16, y0: lid.y0 + 34, x1: lid.x1 - 12, y1: lid.y0 + 82 };
  hmRound(ctx, lab.x0, lab.y0, lab.x1 - lab.x0, lab.y1 - lab.y0, 3);
  hmPaint(ctx, "#fffdf8", 3);
  ctx.fillStyle = "rgba(255,248,200,.9)";
  ctx.fillRect(lab.x0 - 8, lab.y0 - 7, 28, 14);
  ctx.fillRect(lab.x1 - 20, lab.y0 - 7, 28, 14);
  const label = engine && engine.text ? (engine.text("MY GARDIANS", (lab.x0 + lab.x1) / 2, (lab.y0 + lab.y1) / 2 + 2, 24, HM_INK, "center", 900), "MY GARDIANS") : "";
  // the open top: the dark inside of the box
  ctx.beginPath();
  ctx.moveTo(x0 + 8, y0 + 6);
  ctx.lineTo(x0 + 22, y0 - 30);
  ctx.lineTo(x0 + w - 22, y0 - 30);
  ctx.lineTo(x0 + w - 8, y0 + 6);
  ctx.closePath();
  hmPaint(ctx, "#1b3f86", 5);
  // the gift: held over the box, falling in, then standing in it
  const T = BOX_CLOSEUP,
    fallK = Math.max(0, Math.min(1, (t - T.hold) / T.fall)),
    landed = t >= T.hold + T.fall,
    held = { y: y0 - 70 },
    rest = { y: 600 - 22 },
    by = held.y + (rest.y - held.y) * fallK * fallK,
    a = 0.16 * Math.min(1, fallK * 1.4);
  const rocketH = MORNING_SIZES.rocket * K;
  drawRocket(ctx, cx - 8, by, { k: K, a, tag: !landed, lw: 5 });
  // the box's front over the gift's lower half (the approved look, made big)
  drawGuardianBox(ctx, x0, y0, K);
  landed && drawGiftNote(ctx, x0 + w * 0.8, y0 + 4, K * 0.9, 5);
  // his arm reaching in from the top, his paw round the rocket, then letting go and lifting away
  const lift = Math.max(0, Math.min(1, (t - T.hold) / 0.3)),
    paw = { x: cx - 8 + 9 * K, y: held.y - 24 * K - lift * 140 };
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(paw.x, paw.y);
  ctx.lineTo(paw.x + 70, -40);
  ctx.strokeStyle = HM_INK;
  ctx.lineWidth = 58;
  ctx.stroke();
  ctx.strokeStyle = "#6b4428";
  ctx.lineWidth = 48;
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(paw.x, paw.y, 32, 26, 0, 0, Math.PI * 2);
  hmPaint(ctx, "#6b4428", 5);
  ctx.beginPath();
  ctx.ellipse(paw.x - 6, paw.y + 4, 15, 11, 0, 0, Math.PI * 2);
  hmPaint(ctx, "#f4c39a", 3);
  return {
    pic: "gbox",
    label,
    labelBox: lab,
    held: t < T.hold,
    landed,
    sizes: { k: K, box: { w, h }, rocket: rocketH },
  };
}

/** The close-up as the cutaway draws it (cutaway.js PANELS "gbox"): one picture, waiting for NEXT (it has words). */
export const GBOX_PANELS = Object.freeze([gboxCloseUp]);
export const GBOX_ID = "gbox";
