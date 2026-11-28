/**
 * The new drawings of the loading bay beats (Chapter 1, beats 28 to 36; loading-bay.js), all PLACEHOLDERS for Brian:
 * the delivery robots, the three-part delivery form (white, the big pink order sheet, the small yellow carbon copy
 * stuck under the pink), the two stuck copies Mops bites and spits into the bin, the form's close-up, and the frame a
 * close-up sits in. The locked room pictures are never redrawn here; these are layers on top of them.
 */
import { ROBOT_SIZE } from "./loading-bay-place.js";
import { highlightBox } from "./outline.js";
import { drawPenDigits } from "./pen-digits.js";
import { drawStationStamp } from "./crate-stamp.js";
import { drawArchGlow } from "./arch-glow.js";
import { LOCKED_LOOK, lookRound, lookFill, lookShine } from "./locked-look.js";

const BAY_INK = "#1e2430";
export const PAPER = Object.freeze({ white: "#fffdf8", pink: "#ff9cc2", yellow: "#ffe27a", carbon: "#7d6f86" });

function bayRound(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function fillStroke(ctx, fill, lw = 2.5) {
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = lw;
  ctx.strokeStyle = BAY_INK;
  ctx.stroke();
}

/**
 * A delivery robot (new, PLACEHOLDER: there is no approved robot drawing yet), feet at (x, y), facing `f` (1 right,
 * -1 left, 0 toward us, 2 away from us), `k` times its size. A white body on two wheels, a dark visor with one blue eye,
 * an antenna with a light. `bob` lifts it a little as it rolls. `arm` (0 to 1) raises its gripper to hold something.
 */
export function drawRobot(ctx, x, y, f = 0, k = 1, bob = 0, arm = 0) {
  const h = ROBOT_SIZE.h,
    w = ROBOT_SIZE.w;
  ctx.save();
  ctx.translate(x, y - bob);
  ctx.scale(k, k);
  // shadow
  ctx.beginPath();
  ctx.ellipse(0, bob / k, w * 0.6, 5, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(30,36,48,.16)";
  ctx.fill();
  // wheels
  for (const dx of [-w * 0.3, w * 0.3]) {
    ctx.beginPath();
    ctx.arc(dx, -5, 5.5, 0, Math.PI * 2);
    fillStroke(ctx, "#59657d", 2);
  }
  // body
  bayRound(ctx, -w / 2, -h * 0.62, w, h * 0.52, 7);
  fillStroke(ctx, "#f3f5f8");
  // head
  bayRound(ctx, -w * 0.42, -h * 0.95, w * 0.84, h * 0.33, 8);
  fillStroke(ctx, "#f3f5f8");
  // antenna and its light
  ctx.beginPath();
  ctx.moveTo(0, -h * 0.95);
  ctx.lineTo(0, -h * 1.08);
  ctx.lineWidth = 2;
  ctx.strokeStyle = BAY_INK;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, -h * 1.1, 3.4, 0, Math.PI * 2);
  fillStroke(ctx, "#e5533d", 1.6);
  // visor: toward us it shows the whole visor and the eye; side on, the eye looks that way; away, the back of the head
  if (f !== 2) {
    const vx = f === 1 ? -w * 0.12 : f === -1 ? -w * 0.32 : -w * 0.3;
    bayRound(ctx, vx, -h * 0.88, w * (f ? 0.44 : 0.6), h * 0.16, 4);
    fillStroke(ctx, "#2b3a67", 1.6);
    ctx.beginPath();
    ctx.arc(f === 1 ? w * 0.18 : f === -1 ? -w * 0.18 : 0, -h * 0.8, 3.2, 0, Math.PI * 2);
    ctx.fillStyle = "#8fdcff";
    ctx.fill();
  }
  // a panel on its chest
  bayRound(ctx, -w * 0.22, -h * 0.5, w * 0.44, h * 0.18, 3);
  fillStroke(ctx, "#dfe4ea", 1.6);
  // its gripper arm, on the side it faces (raised to hold something)
  const side = f === -1 ? -1 : 1,
    sx = side * w * 0.5,
    sy = -h * 0.45,
    ex = sx + side * (8 + 6 * arm),
    ey = sy + 10 - 22 * arm;
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(ex, ey);
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.strokeStyle = BAY_INK;
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#9aa3b2";
  ctx.stroke();
  ctx.restore();
  return { hand: { x: x + (ex * k), y: y - bob + ey * k } };
}

/** Where a robot's gripper is, for feet (x, y), facing `f`, size `k`, arm raised `arm` (the papers it holds go here). */
export function robotHand(x, y, f = 0, k = 1, arm = 1) {
  const w = ROBOT_SIZE.w,
    h = ROBOT_SIZE.h,
    side = f === -1 ? -1 : 1;
  return { x: x + (side * w * 0.5 + side * (8 + 6 * arm)) * k, y: y + (-h * 0.45 + 10 - 22 * arm) * k };
}

/** One sheet of paper, its top-left corner at (x, y), `w` by `h`, a little turned (`rot`), with faint lines on it. */
function baySheet(ctx, x, y, w, h, color, rot = 0, lines = 4) {
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(rot);
  bayRound(ctx, -w / 2, -h / 2, w, h, Math.min(3, w * 0.06));
  fillStroke(ctx, color, Math.max(1, Math.min(2.5, w * 0.08)));
  ctx.strokeStyle = "rgba(30,36,48,.35)";
  ctx.lineWidth = Math.max(0.6, w * 0.03);
  for (let i = 1; i <= lines; i++) {
    const ly = -h / 2 + (h * i) / (lines + 1.5);
    ctx.beginPath();
    ctx.moveTo(-w * 0.32, ly);
    ctx.lineTo(w * 0.32, ly);
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * The whole form set as it is carried, at (x, y) (its middle), `s` game pixels wide for the pink: the white copy behind,
 * the big pink in front, the small yellow peeking out from under the pink. `white` false once the white copy is gone.
 */
export function drawFormSet(ctx, x, y, s = 16, white = true) {
  const w = s,
    h = s * 1.25;
  white && baySheet(ctx, x - w * 0.9, y - h * 0.62, w * 0.95, h * 1.05, PAPER.white, -0.12, 3);
  drawStuck(ctx, x, y, s, 0);
}

/**
 * The two copies still stuck together (the big pink and the small yellow under it), their middle at (x, y), the pink
 * `s` wide. `bite` (0 to 1) takes a bite out of their top corner (both papers, as they are stuck).
 */
export function drawStuck(ctx, x, y, s = 16, bite = 0, rot = 0) {
  const w = s,
    h = s * 1.25;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  if (bite > 0) {
    // the bite: a round notch out of the top right corner, through both copies
    ctx.beginPath();
    ctx.rect(-w, -h, w * 2.4, h * 2.4);
    ctx.arc(w * 0.5, -h * 0.5, w * 0.44 * Math.min(1, bite), 0, Math.PI * 2, true);
    ctx.clip("evenodd");
  }
  baySheet(ctx, -w * 0.2, -h * 0.36, w * 0.75, h * 0.8, PAPER.yellow, 0.1, 2);
  baySheet(ctx, -w / 2, -h / 2, w, h, PAPER.pink, -0.04, 3);
  ctx.restore();
}

/** A few crumbs of paper falling from a bite at (x, y), `u` (0 to 1) of the way through their fall. */
export function drawBiteCrumbs(ctx, x, y, u, s = 1) {
  ctx.save();
  for (let i = 0; i < 4; i++) {
    const dx = (i - 1.5) * 6 * s,
      dy = u * (14 + i * 5) * s;
    ctx.fillStyle = i % 2 ? PAPER.pink : PAPER.yellow;
    ctx.globalAlpha = Math.max(0, 1 - u);
    ctx.fillRect(x + dx, y + dy, 3 * s, 3 * s);
  }
  ctx.restore();
}

/**
 * The form set's close-up (beat 32), drawn big inside `box` (game positions): on the left the white copy, Isfred's
 * signature writing itself along its line (`sign`, 0 to 1); on the right the big pink order sheet with its ORDER MORE
 * ROBOTS box (`words`) and the office code written on it a number at a time (`code` digits shown, of `codeText`);
 * the small yellow copy stuck under the pink's bottom corner, where the same numbers come through grey (the carbon).
 * `pulse` (0 to 1) outlines the ORDER MORE ROBOTS box (dashed gold). Returns where each part was drawn (tests).
 */
export function drawFormCloseUp(ctx, box, { sign = 0, code = 0, codeText = "", pulse = 0, words = "", pen = null, t = 0 }) {
  const W = box.x1 - box.x0,
    H = box.y1 - box.y0,
    k = Math.min(W / 640, H / 600),
    X = (v) => box.x0 + v * k,
    Y = (v) => box.y0 + v * k;
  ctx.save();
  ctx.beginPath();
  ctx.rect(box.x0, box.y0, W, H);
  ctx.clip();
  ctx.fillStyle = "#e8e3d9";
  ctx.fillRect(box.x0, box.y0, W, H);
  // the white copy, behind and to the left
  const white = { x0: X(24), y0: Y(54), x1: X(274), y1: Y(400) };
  ctx.save();
  ctx.translate((white.x0 + white.x1) / 2, (white.y0 + white.y1) / 2);
  ctx.rotate(-0.06);
  bayRound(ctx, -(white.x1 - white.x0) / 2, -(white.y1 - white.y0) / 2, white.x1 - white.x0, white.y1 - white.y0, 8 * k);
  fillStroke(ctx, PAPER.white, 4 * k);
  ctx.strokeStyle = "rgba(30,36,48,.32)";
  ctx.lineWidth = 3 * k;
  for (let i = 0; i < 6; i++) {
    const ly = -130 * k + i * 34 * k;
    ctx.beginPath();
    ctx.moveTo(-90 * k, ly);
    ctx.lineTo(90 * k, ly);
    ctx.stroke();
  }
  // the signature line, and Isfred's signature writing itself along it
  ctx.strokeStyle = BAY_INK;
  ctx.lineWidth = 3 * k;
  ctx.beginPath();
  ctx.moveTo(-95 * k, 118 * k);
  ctx.lineTo(95 * k, 118 * k);
  ctx.stroke();
  if (sign > 0) {
    ctx.beginPath();
    const n = Math.max(2, Math.round(40 * Math.min(1, sign)));
    for (let i = 0; i <= n; i++) {
      const u = i / 40,
        px = (-85 + u * 170) * k,
        py = (104 + Math.sin(u * 24) * 12 - u * 10) * k;
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.lineWidth = 4 * k;
    ctx.strokeStyle = "#2b3a67";
    ctx.stroke();
  }
  ctx.restore();
  // the small yellow copy, stuck under the pink's bottom right corner
  const yellow = { x0: X(420), y0: Y(380), x1: X(616), y1: Y(584) };
  bayRound(ctx, yellow.x0, yellow.y0, yellow.x1 - yellow.x0, yellow.y1 - yellow.y0, 8 * k);
  fillStroke(ctx, PAPER.yellow, 4 * k);
  // the big pink order sheet
  const pink = { x0: X(258), y0: Y(30), x1: X(592), y1: Y(470) };
  bayRound(ctx, pink.x0, pink.y0, pink.x1 - pink.x0, pink.y1 - pink.y0, 10 * k);
  fillStroke(ctx, PAPER.pink, 5 * k);
  // ORDER MORE ROBOTS, and its box (drawn, empty), outlined when it matters
  const boxAt = { x0: X(286), y0: Y(80), x1: X(338), y1: Y(132) };
  ctx.lineWidth = 5 * k;
  ctx.strokeStyle = BAY_INK;
  ctx.fillStyle = "#fffdf8";
  ctx.fillRect(boxAt.x0, boxAt.y0, boxAt.x1 - boxAt.x0, boxAt.y1 - boxAt.y0);
  ctx.strokeRect(boxAt.x0, boxAt.y0, boxAt.x1 - boxAt.x0, boxAt.y1 - boxAt.y0);
  // when it matters, the game's one highlight round the box: the dashed gold outline, no glow (Brian 2026-11-26)
  pulse > 0 && drawDashedOutline(ctx, { x0: boxAt.x0 - 8 * k, y0: boxAt.y0 - 8 * k, x1: boxAt.x1 + 8 * k, y1: boxAt.y1 + 8 * k }, t);
  const wordsAt = { x: X(350), y: Y(106), size: Math.round(32 * k) };
  ctx.font = `900 ${wordsAt.size}px sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = BAY_INK;
  // two lines, so the words stay big inside the sheet
  const [w1, ...rest] = words.split(" ");
  ctx.fillText(w1 + " " + (rest[0] || ""), wordsAt.x, wordsAt.y - 16 * k);
  ctx.fillText(rest.slice(1).join(" "), wordsAt.x, wordsAt.y + 18 * k);
  // the pink's other lines
  ctx.strokeStyle = "rgba(30,36,48,.35)";
  ctx.lineWidth = 3 * k;
  for (let i = 0; i < 4; i++) {
    const ly = Y(180 + i * 34);
    ctx.beginPath();
    ctx.moveTo(X(290), ly);
    ctx.lineTo(X(560), ly);
    ctx.stroke();
  }
  // the office code, written in blue pen a number at a time on the pink, pressing through onto the yellow below it
  // (pen-digits.js: handwriting, so it reads as a secret someone wrote there)
  const shown = codeText.slice(0, Math.max(0, Math.min(codeText.length, Math.floor(code))));
  const codeAt = { x: X(425), y: Y(386), size: Math.round(52 * k) };
  shown && drawPenDigits(ctx, shown, codeAt.x - ((codeText.length - shown.length) * 13 * (codeAt.size / 16)) / 2, codeAt.y, codeAt.size);
  const carbonAt = { x: X(518), y: Y(520), size: Math.round(38 * k) };
  shown && drawPenDigits(ctx, shown, carbonAt.x - ((codeText.length - shown.length) * 13 * (carbonAt.size / 16)) / 2, carbonAt.y, carbonAt.size, PAPER.carbon);
  // Isfred's pen (purple, as he is), at the end of what it is writing
  if (pen) {
    const px = pen === "sign" ? X(24 + 40 + 170 * Math.min(1, sign)) : codeAt.x + (shown.length - codeText.length / 2) * codeAt.size * 0.4,
      py = pen === "sign" ? Y(330) : codeAt.y - 4 * k;
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(0.6);
    bayRound(ctx, -6 * k, -110 * k, 12 * k, 100 * k, 5 * k);
    fillStroke(ctx, "#c9b6f2", 3 * k);
    ctx.beginPath();
    ctx.moveTo(-6 * k, -10 * k);
    ctx.lineTo(0, 0);
    ctx.lineTo(6 * k, -10 * k);
    ctx.closePath();
    fillStroke(ctx, "#2b3a67", 2 * k);
    ctx.restore();
  }
  ctx.restore();
  return { white, pink, yellow, box: boxAt, words: { ...wordsAt, text: words }, code: { ...codeAt, text: shown }, carbon: { ...carbonAt, text: shown } };
}

/**
 * The frame round a close-up: the place it shows framed with a dashed line in the room, two lines from it to the
 * close-up, a shadow, and a thick white frame with a dark edge round `dst`. Drawn under (`back`) and over (`front`) the
 * close-up's picture, so the picture sits inside it. `u` (0 to 1) is how far the close-up has grown out of its place.
 */
export function closeUpBox(src, dst, u) {
  const e = u * u * (3 - 2 * u),
    mix = (a, b) => a + (b - a) * e;
  return { x0: mix(src.x0, dst.x0), y0: mix(src.y0, dst.y0), x1: mix(src.x1, dst.x1), y1: mix(src.y1, dst.y1) };
}
export function drawCloseUpBack(ctx, src, b) {
  ctx.save();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#fffdf8";
  ctx.setLineDash([10, 6]);
  ctx.strokeRect(src.x0, src.y0, src.x1 - src.x0, src.y1 - src.y0);
  ctx.setLineDash([]);
  // two lines from the place to the close-up's near corners
  const right = b.x0 >= src.x1;
  ctx.beginPath();
  ctx.moveTo(right ? src.x1 : src.x0, src.y0);
  ctx.lineTo(right ? b.x0 : b.x1, b.y0);
  ctx.moveTo(right ? src.x1 : src.x0, src.y1);
  ctx.lineTo(right ? b.x0 : b.x1, b.y1);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(255,253,248,.85)";
  ctx.stroke();
  ctx.fillStyle = "rgba(30,36,48,.28)";
  ctx.fillRect(b.x0 + 8, b.y0 + 10, b.x1 - b.x0, b.y1 - b.y0);
  ctx.restore();
}
export function drawCloseUpFront(ctx, b) {
  ctx.save();
  ctx.lineWidth = 10;
  ctx.strokeStyle = "#fffdf8";
  ctx.strokeRect(b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0);
  ctx.lineWidth = 3;
  ctx.strokeStyle = BAY_INK;
  ctx.strokeRect(b.x0 - 5, b.y0 - 5, b.x1 - b.x0 + 10, b.y1 - b.y0 + 10);
  ctx.restore();
}

/**
 * The game's one highlight (Brian 2026-11-26: the dashed gold line, no glow, no ring, no arrow), round `box`, with the
 * goal outline's width, dash and colour (outline.js OUTLINE) and its gentle pulse, for things this beat draws itself.
 */
export function drawDashedOutline(ctx, box, t) {
  highlightBox(ctx, box, t, 0);
  return box;
}

/** Mops waving Squatch out of the plant (wordless): a little curl of motion lines by his raised hoof. */
export function drawWave(ctx, x, y, t) {
  ctx.save();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(30,36,48,.8)";
  ctx.lineCap = "round";
  for (let i = 0; i < 2; i++) {
    const k = (t * 2 + i / 2) % 1;
    ctx.globalAlpha = 1 - k;
    ctx.beginPath();
    ctx.arc(x, y, 8 + i * 7 + k * 4, -2.4, -0.7);
    ctx.stroke();
  }
  ctx.restore();
}

// ---------- the bay's new things (beats 29 to 35; PLACEHOLDERS) ----------
/**
 * One wooden crate, its bottom middle at (x, y), `w` wide; `stamped`: the station's stamp on its front (crate-stamp.js
 * drawStationStamp, the stamp every station crate in the game has).
 */
export function drawBayCrate(ctx, x, y, w = 56, stamped = false) {
  const h = w * 0.62;
  ctx.save();
  bayRound(ctx, x - w / 2, y - h, w, h, 3);
  fillStroke(ctx, "#d9a35b", 2.5);
  ctx.strokeStyle = "rgba(120,72,30,.6)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - w / 2 + 4, y - h / 2);
  ctx.lineTo(x + w / 2 - 4, y - h / 2);
  ctx.stroke();
  stamped && drawStationStamp(ctx, x - (8 * w) / 130, y - h * 0.62, w / 130);
  ctx.restore();
  return { x0: x - w / 2, x1: x + w / 2, y0: y - h, y1: y };
}
/** The cargo stacked by the bay's doorway: two plain crates, one on the other (`box` its outer box). */
export function drawCargo(ctx, box) {
  const w = box.x1 - box.x0,
    x = (box.x0 + box.x1) / 2;
  drawBayCrate(ctx, x, box.y1, w);
  drawBayCrate(ctx, x + 4, box.y1 - w * 0.6, w * 0.86);
}
/** A paper tag on a string at (x, y), with `text` on it (small; its words are read in a close-up). */
export function drawTag(ctx, x, y, text, s = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  bayRound(ctx, -14, -8, 28, 16, 3);
  fillStroke(ctx, "#fffdf8", 1.5);
  ctx.fillStyle = BAY_INK;
  ctx.font = "700 4px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  text && ctx.fillText(text.slice(0, 14), 0, 0);
  ctx.restore();
}
/** The little box on the ship, tagged for S. (`k` its size), its bottom middle at (x, y). */
export function drawTaggedBox(ctx, x, y, k = 1) {
  ctx.save();
  bayRound(ctx, x - 9 * k, y - 12 * k, 18 * k, 12 * k, 2 * k);
  fillStroke(ctx, "#f2d5a8", 2);
  ctx.strokeStyle = "#e5533d";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - 12 * k);
  ctx.lineTo(x, y);
  ctx.stroke();
  // the tag hanging off its corner
  ctx.beginPath();
  ctx.rect(x + 7 * k, y - 16 * k, 8 * k, 5 * k);
  ctx.fillStyle = "#fffdf8";
  ctx.fill();
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = BAY_INK;
  ctx.stroke();
  ctx.restore();
}
/** The tag's close-up: the little box big, its tag's words readable (`words`). Returns where the words were drawn. */
export function drawTagCloseUp(ctx, box, words, t) {
  const W = box.x1 - box.x0,
    H = box.y1 - box.y0;
  ctx.save();
  ctx.beginPath();
  ctx.rect(box.x0, box.y0, W, H);
  ctx.clip();
  ctx.fillStyle = "#e8e3d9";
  ctx.fillRect(box.x0, box.y0, W, H);
  const k = Math.min(W, H) / 60,
    bx = box.x0 + W * 0.3,
    by = box.y0 + H * 0.82;
  drawTaggedBox(ctx, bx, by, k * 2.2);
  // the tag, big, on its string
  const tx = box.x0 + W * 0.66,
    ty = box.y0 + H * 0.42,
    tw = W * 0.56,
    th = H * 0.42;
  ctx.beginPath();
  ctx.moveTo(bx + 15 * k, by - 30 * k);
  ctx.quadraticCurveTo(tx - tw / 2 - 20, ty + th / 2, tx - tw / 2, ty);
  ctx.strokeStyle = BAY_INK;
  ctx.lineWidth = 2;
  ctx.stroke();
  bayRound(ctx, tx - tw / 2, ty - th / 2, tw, th, 8);
  fillStroke(ctx, "#fffdf8", 4);
  const [first, ...rest] = words.split(" — ");
  const size = Math.round(Math.min(th * 0.2, tw / 11));
  ctx.fillStyle = BAY_INK;
  ctx.font = `italic 700 ${size}px "Comic Sans MS", "Chalkboard SE", cursive, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const lines = first.split(". ").map((l, i, a) => (i < a.length - 1 ? l + "." : l));
  lines.forEach((l, i) => ctx.fillText(l, tx, ty - th * 0.22 + i * size * 1.2));
  rest.length && ctx.fillText("— " + rest.join(" — "), tx, ty + th * 0.3);
  ctx.restore();
  return { x: tx, y: ty, size, text: words };
}
/** Isfred's shadow on the floor in the doorway (beat 29), `k` 0 to 1 as he comes nearer. */
export function drawDoorShadow(ctx, x, y, k) {
  ctx.save();
  ctx.globalAlpha = 0.35 * k;
  ctx.fillStyle = "#1e2430";
  ctx.beginPath();
  ctx.ellipse(x + 30 * k, y + 6, 34 * k, 9, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + 50 * k, y - 4, 12 * k, 6, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
/** A tool in a hand, at (x, y): "wrench", "broom" (upside down: `flip`) or "clipboard". */
export function drawTool(ctx, kind, x, y, flip = false, k = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, flip ? -k : k);
  ctx.lineCap = "round";
  if (kind === "wrench") {
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#8a93a3";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -16);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -18, 4, 0.6, Math.PI * 2 - 0.6);
    ctx.stroke();
  } else if (kind === "broom") {
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#8b5a2b";
    ctx.beginPath();
    ctx.moveTo(0, 6);
    ctx.lineTo(0, -22);
    ctx.stroke();
    ctx.fillStyle = "#b8955a"; // (straw tan, not the goal marker's yellow)
    ctx.beginPath();
    ctx.moveTo(-6, -22);
    ctx.lineTo(6, -22);
    ctx.lineTo(8, -32);
    ctx.lineTo(-8, -32);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillStyle = "#fffdf8";
    ctx.strokeStyle = BAY_INK;
    ctx.lineWidth = 1.5;
    ctx.fillRect(-6, -18, 12, 16);
    ctx.strokeRect(-6, -18, 12, 16);
  }
  ctx.restore();
}
/** Lou's fuzzy winter hat, on his head at (x, y) or on the floor. */
export function drawFuzzyHat(ctx, x, y, k = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  ctx.fillStyle = "#c0504d";
  ctx.beginPath();
  ctx.ellipse(0, 0, 11, 7, 0, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = "#f3e6d0";
  for (let i = -10; i <= 10; i += 4) {
    ctx.beginPath();
    ctx.arc(i, 0, 2.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(0, -8, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
/** The scanner arch refusing fur: its field flashes red and a red bar drops across it (`k` 0 to 1). */
export function drawScannerStop(ctx, field, k, t) {
  ctx.save();
  ctx.globalAlpha = (0.25 + 0.2 * Math.abs(Math.sin(t * 12))) * Math.min(1, k * 2);
  ctx.fillStyle = "#e5533d";
  ctx.fillRect(field.x0, field.y0, field.x1 - field.x0, field.y1 - field.y0);
  ctx.globalAlpha = 1;
  const y = field.y0 + (field.y1 - field.y0) * 0.55 * Math.min(1, k * 1.5);
  ctx.fillStyle = "#e5533d";
  ctx.strokeStyle = BAY_INK;
  ctx.lineWidth = 2;
  ctx.fillRect(field.x0, y - 5, field.x1 - field.x0, 10);
  ctx.strokeRect(field.x0, y - 5, field.x1 - field.x0, 10);
  ctx.restore();
}
/**
 * The scanner arch letting hair through (round 7, r5 1:59, q: 116): the arch lights green, its lamp, its scan lines and
 * its floor strip, with a scan bar sweeping down (`k` 0 to 1). Final art, Brian's yes 2026-11-27 (arch-glow.js).
 */
export function drawScannerPass(ctx, field, k, t) {
  drawArchGlow(ctx, field, "green", k, t);
}
/**
 * The mail that came down the ramp with the little box (round 7, r5 3:02 and 3:21, q: 133): two envelopes on the floor
 * beside it, so the box reads as "the mail": a white one with the red and blue airmail border and a cream one with a
 * red stamp, the rooms' ink round each. Final art, Brian's yes 2026-11-27 (round 8).
 */
export function drawMailBeside(ctx, x, y) {
  const L = LOCKED_LOOK,
    env = (ex, ey, rot, fill, airmail) => {
      ctx.save();
      ctx.translate(ex, ey);
      ctx.rotate(rot);
      lookRound(ctx, -9, -6, 18, 12, 1.5);
      lookFill(ctx, fill, 1.6);
      if (airmail) {
        ctx.save();
        ctx.clip();
        ctx.lineWidth = 1.6;
        for (let i = -12; i < 14; i += 3) {
          ctx.strokeStyle = (i / 3) % 2 ? L.red : "rgb(70,110,180)";
          for (const ey2 of [-6, 6]) (ctx.beginPath(), ctx.moveTo(i, ey2 - 1.5), ctx.lineTo(i + 2, ey2 + 1.5), ctx.stroke());
        }
        ctx.restore();
        lookRound(ctx, -9, -6, 18, 12, 1.5);
        lookFill(ctx, "rgba(0,0,0,0)", 1.6);
        // the flap
        ctx.beginPath();
        ctx.moveTo(-8, -5);
        ctx.lineTo(0, 1);
        ctx.lineTo(8, -5);
        ctx.lineWidth = 1.3;
        ctx.stroke();
      } else {
        ctx.fillStyle = L.red;
        ctx.fillRect(4, -4, 4, 4);
        ctx.fillStyle = L.ink;
        ctx.fillRect(-6, 0, 7, 1.2);
        ctx.fillRect(-6, 2.6, 5, 1.2);
      }
      ctx.restore();
    };
  ctx.save();
  env(x - 24, y - 6, -0.22, L.paper, true);
  env(x - 16, y + 2, 0.12, "rgb(246,232,200)", false);
  ctx.restore();
}
/** A letter in a robot's gripper or going into the mailbox's slot. */
export function drawLetter(ctx, x, y, k = 1) {
  ctx.save();
  bayRound(ctx, x - 7 * k, y - 5 * k, 14 * k, 10 * k, 1.5);
  fillStroke(ctx, "#fffdf8", 1.5);
  ctx.beginPath();
  ctx.moveTo(x - 7 * k, y - 5 * k);
  ctx.lineTo(x, y);
  ctx.lineTo(x + 7 * k, y - 5 * k);
  ctx.stroke();
  ctx.restore();
}
/** The mailbox's slot lighting up (`k` 0 to 1). */
export function drawSlotLight(ctx, x, y, k) {
  ctx.save();
  ctx.globalAlpha = k;
  ctx.fillStyle = "#8fdcff";
  ctx.fillRect(x - 18, y - 3, 36, 6);
  ctx.restore();
}
/** A sweat drop by a face at (x, y), falling `u` (0 to 1). */
export function drawSweat(ctx, x, y, u) {
  ctx.save();
  ctx.globalAlpha = 1 - u * 0.6;
  ctx.fillStyle = "#8fdcff";
  ctx.strokeStyle = BAY_INK;
  ctx.lineWidth = 1.5;
  const yy = y + u * 14;
  ctx.beginPath();
  ctx.moveTo(x, yy - 6);
  ctx.quadraticCurveTo(x + 5, yy + 1, x, yy + 3);
  ctx.quadraticCurveTo(x - 5, yy + 1, x, yy - 6);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}
// The locked hallway picture, for the office door's own two grey leaves (docs/locked-rooms; nothing of it changes).
const LB_HALLWAY_PIC = "docs/locked-rooms/hallway-room-empty-v6.png";
const lbHallwayImg = typeof Image !== "undefined" ? Object.assign(new Image(), { src: LB_HALLWAY_PIC }) : null;
/**
 * The hallway's office door open (beat 36): its two doors slid aside `k` (0 to 1) into the wall either side, light
 * spilling out on the hallway floor, and inside the lit office: its back wall, the grey desk with the computer's screen
 * glowing, a filing cabinet, the HANG IN THERE poster's frame (the office picture's own things, office_room_v2.py, in its
 * colours). The two doors are the picture's own grey leaves (Brian r5 3:58: "There's a different hallway door in the
 * scene than in any other scene"), slid inside the doorway so they go into the wall, never over it. Final art, pending
 * Brian's yes (round 8).
 */
export function drawOfficeOpen(ctx, door, k) {
  const L = LOCKED_LOOK,
    w = door.x1 - door.x0,
    h = door.y1 - door.y0,
    gap = w * 0.9 * k,
    cx = door.x0 + w / 2;
  if (k <= 0) return;
  ctx.save();
  // the light on the hallway floor, fanning out from the gap (flat, as the rooms draw light)
  ctx.globalAlpha = 0.4 * Math.min(1, k * 1.5);
  ctx.fillStyle = "rgb(255,240,170)";
  ctx.beginPath();
  ctx.moveTo(cx - gap / 2, door.y0 + 2);
  ctx.lineTo(cx + gap / 2, door.y0 + 2);
  ctx.lineTo(cx + gap / 2 + 46 * k, door.y0 - 64 * k);
  ctx.lineTo(cx - gap / 2 - 46 * k, door.y0 - 64 * k);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;
  // everything else stays inside the doorway
  ctx.beginPath();
  ctx.rect(door.x0, door.y0, w, h);
  ctx.clip();
  // inside: the lit back wall and the floor
  const fy = door.y0 + h * 0.56;
  ctx.fillStyle = "rgb(255,246,214)";
  ctx.fillRect(door.x0, door.y0, w, fy - door.y0);
  ctx.fillStyle = "rgb(240,230,204)";
  ctx.fillRect(door.x0, fy, w, door.y1 - fy);
  ctx.fillStyle = L.line;
  ctx.fillRect(door.x0, fy - 1, w, 2);
  // the poster's frame on the back wall, and the filing cabinet on the left
  lookRound(ctx, cx + 14, door.y0 + 14, 22, 28, 2);
  lookFill(ctx, "rgb(40,48,92)", 2);
  ctx.fillStyle = L.yellow;
  ctx.beginPath();
  ctx.arc(cx + 25, door.y0 + 26, 4, 0, Math.PI * 2);
  ctx.fill();
  lookRound(ctx, door.x0 + 6, fy - 34, 24, 58, 2);
  lookFill(ctx, L.desk, 2.5);
  for (const v of [0.2, 0.52, 0.84]) {
    lookRound(ctx, door.x0 + 10, fy - 34 + 58 * v - 6, 16, 12, 1.5);
    lookFill(ctx, L.deskTop, 1.5);
  }
  // the desk, with the computer on it, its screen lit
  lookRound(ctx, cx - 18, fy - 22, 30, 24, 2);
  lookFill(ctx, L.bezel, 2.5);
  ctx.fillStyle = "rgb(170,215,245)";
  ctx.fillRect(cx - 14, fy - 18, 22, 16);
  lookShine(ctx, cx - 10, fy - 14, 1.6);
  lookRound(ctx, cx - 6, fy + 2, 6, 6, 1);
  lookFill(ctx, L.desk, 1.5);
  lookRound(ctx, cx - 30, fy + 8, w * 0.72, 9, 2);
  lookFill(ctx, L.deskTop, 2.5);
  lookRound(ctx, cx - 26, fy + 17, w * 0.64, 40, 2);
  lookFill(ctx, L.desk, 2.5);
  // the two leaves, cut from the picture where they hang shut, each slid half the gap into the wall
  const img = lbHallwayImg;
  if (img && img.complete && img.naturalWidth) {
    const kx = img.naturalWidth / 960,
      ky = img.naturalHeight / 640,
      half = w / 2;
    ctx.drawImage(img, door.x0 * kx, door.y0 * ky, half * kx, h * ky, door.x0 - gap / 2, door.y0, half, h);
    ctx.drawImage(img, (door.x0 + half) * kx, door.y0 * ky, half * kx, h * ky, door.x0 + half + gap / 2, door.y0, half, h);
    // each leaf's open edge, in the rooms' ink
    ctx.fillStyle = L.ink;
    ctx.fillRect(door.x0 + half - gap / 2 - 1.5, door.y0, 3, h);
    ctx.fillRect(door.x0 + half + gap / 2 - 1.5, door.y0, 3, h);
  }
  ctx.restore();
  // the doorway's own frame, drawn again on top
  ctx.save();
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = L.ink;
  ctx.strokeRect(door.x0, door.y0, w, h);
  ctx.restore();
}
/** A robot's mopping streak on the floor: a grey smear along `pts`. */
export function drawStreak(ctx, pts) {
  if (!pts || pts.length < 2) return;
  ctx.save();
  ctx.strokeStyle = "rgba(120,126,140,.32)";
  ctx.lineWidth = 16;
  ctx.lineCap = "round";
  ctx.beginPath();
  pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
  ctx.stroke();
  ctx.restore();
}

