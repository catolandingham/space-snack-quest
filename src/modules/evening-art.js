/**
 * The drawings the evening of Day 2 adds (beats 37 to 42; evening.js). Every one is a PLACEHOLDER waiting for Brian's
 * eye; none of them changes a locked room picture (they are layers over it, or full-screen close-ups).
 *   the Employee of the Month gallery's photos: movie scenes Mops and Squatch made with station props (Brian's newest
 *     gags: Karate Kid, Darth Vader with Squatch behind the mask, E.T. with Squatch in the basket, Lion King on a rock
 *     of crates, a minion, a goat dunk, and one with Squatch rolled up as a ball in the back); the approved pictures
 *     are not in the repo yet, so these are stand-ins
 *   Squatch's crayon drawing behind the crooked photo #4: him and Mops, TIED TOGETHER FOREVER, two tags ME and MOPS
 *     each with an arrow (decided 2026-11-26), and a dotted look from Mops to him with hearts (R63)
 *   the brochure for the family's cake stand on Mars: the stand, Mars behind it, a cake box and a cut-open cake (nobody on it)
 *   the order papers: the big pink sheet with ORDER MORE ROBOTS and its box, the office code, and the small yellow
 *     carbon copy stuck under it; Squatch's paw print
 *   his furry arm and paw in the close-ups
 */
import { ganitorWords } from "./ganitor.js";
import { eveningWords } from "./evening-lines.js";
import { drawPenDigits } from "./pen-digits.js";
import { drawBrochureExtras } from "./evening-pictures.js";

const INK = "#1e2430"; // (the evening's ink; its own name inside this file only)
const TAU = Math.PI * 2;
const FUR = "#6b4428",
  FUR_DARK = "#4e3019";

/** Fits a design box (W x H) into the screen (w x h), centred: { k, x, y } (screen = x + design * k). */
export function fitDesign(w, h, W, H, pad = 0.94) {
  const k = Math.min((w * pad) / W, (h * pad) / H);
  return { k, x: (w - W * k) / 2, y: (h - H * k) / 2 };
}
const font = (ctx, size, weight = 900) => (ctx.font = `${weight} ${size}px system-ui, -apple-system, sans-serif`);
function text(ctx, t, x, y, size, color = INK, weight = 900, align = "center") {
  font(ctx, size, weight);
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.fillText(t, x, y);
}
function rrect(ctx, x, y, w, h, r, fill, line, lw = 3) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  fill && ((ctx.fillStyle = fill), ctx.fill());
  line && ((ctx.lineWidth = lw), (ctx.strokeStyle = line), ctx.stroke());
}
function evDisc(ctx, x, y, r, fill, line, lw = 3) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  fill && ((ctx.fillStyle = fill), ctx.fill());
  line && ((ctx.lineWidth = lw), (ctx.strokeStyle = line), ctx.stroke());
}

/** The blurred, darkened room behind a close-up (CUT-IN-SPEC: blur about 6 px, darken about 35%, a vignette). */
export function drawCutInBack(ctx, w, h) {
  const game = typeof document !== "undefined" ? [...document.querySelectorAll("canvas")].find((c) => c.style.position !== "fixed") : null;
  ctx.fillStyle = "#20263a";
  ctx.fillRect(0, 0, w, h);
  if (game && game.width) {
    const k = Math.max(w / game.width, h / game.height);
    ctx.save();
    ctx.filter = "blur(6px)";
    ctx.drawImage(game, (w - game.width * k) / 2, (h - game.height * k) / 2, game.width * k, game.height * k);
    ctx.restore();
  }
  ctx.fillStyle = "rgba(12,16,28,.35)";
  ctx.fillRect(0, 0, w, h);
  const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,.5)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

/** The round white X of every close-up (CUT-IN-SPEC: bottom right, at least 64 px). */
export function drawCloseX(ctx, x, y, r) {
  evDisc(ctx, x, y, r, "#ffffff", INK, 4);
  ctx.save();
  ctx.lineWidth = Math.max(4, r * 0.16);
  ctx.lineCap = "round";
  ctx.strokeStyle = INK;
  ctx.beginPath();
  ctx.moveTo(x - r * 0.38, y - r * 0.38);
  ctx.lineTo(x + r * 0.38, y + r * 0.38);
  ctx.moveTo(x + r * 0.38, y - r * 0.38);
  ctx.lineTo(x - r * 0.38, y + r * 0.38);
  ctx.stroke();
  ctx.restore();
}
/** A round arrow button (the gallery's left and right). */
export function drawArrow(ctx, x, y, r, dir) {
  evDisc(ctx, x, y, r, "#fffaf0", INK, 4);
  ctx.beginPath();
  ctx.moveTo(x - dir * r * 0.3, y - r * 0.42);
  ctx.lineTo(x + dir * r * 0.38, y);
  ctx.lineTo(x - dir * r * 0.3, y + r * 0.42);
  ctx.closePath();
  ctx.fillStyle = INK;
  ctx.fill();
}

// ---------- the gallery's photos ----------
/**
 * The pool of photos (Brian: about 16; these seven are stand-ins). Each draws inside (x, y, w, h) with
 * `mops(ctx, x, y, scale, opts)` (the engine's Mops; his feet at x, y, about 60 of his units tall).
 */
export const PHOTO_POOL = Object.freeze(["karate", "vader", "et", "lion", "minion", "dunk", "ball"]);
function sky(ctx, x, y, w, h, top, bottom) {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
}
function stars(ctx, x, y, w, h, n = 14) {
  for (let i = 0; i < n; i++) evDisc(ctx, x + ((i * 53) % w), y + ((i * 37) % (h * 0.6)), 1.6, "#ffffff");
}
// A small Squatch face (his brown head with ears and two eyes), for the photos.
function squatchHead(ctx, x, y, r, eyes = true) {
  evDisc(ctx, x - r * 0.85, y - r * 0.55, r * 0.35, FUR, INK, 2);
  evDisc(ctx, x + r * 0.85, y - r * 0.55, r * 0.35, FUR, INK, 2);
  evDisc(ctx, x, y, r, FUR, INK, 2.5);
  eyes && (evDisc(ctx, x - r * 0.35, y - r * 0.1, r * 0.16, INK), evDisc(ctx, x + r * 0.35, y - r * 0.1, r * 0.16, INK));
}
function crate(ctx, x, y, w, h) {
  rrect(ctx, x, y, w, h, 3, "#d9a35b", INK, 2.5);
  ctx.beginPath();
  ctx.moveTo(x + 4, y + 4);
  ctx.lineTo(x + w - 4, y + h - 4);
  ctx.moveTo(x + w - 4, y + 4);
  ctx.lineTo(x + 4, y + h - 4);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#8b5a2b";
  ctx.stroke();
}
export function drawPhoto(ctx, id, x, y, w, h, mops, t = 0) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  const k = h / 120, // Mops's size in the photo
    floor = y + h * 0.9;
  if (id === "karate") {
    // the crane on a crate at sunset, a red headband
    sky(ctx, x, y, w, h, "#ff9a5a", "#ffd27a");
    evDisc(ctx, x + w * 0.75, y + h * 0.35, h * 0.16, "#fff3b0");
    crate(ctx, x + w * 0.3, floor - h * 0.22, w * 0.3, h * 0.22);
    mops(ctx, x + w * 0.38, floor - h * 0.22, k, { f: 1, walk: 0.6 });
    ctx.fillStyle = "#e5533d";
    ctx.fillRect(x + w * 0.38 + 6 * k, floor - h * 0.22 - 52 * k, 20 * k, 4 * k);
  } else if (id === "vader") {
    // the dark helmet with Squatch inside (his fur sticking out under it), Mops with a glowing red bar
    sky(ctx, x, y, w, h, "#11152a", "#2b3155");
    stars(ctx, x, y, w, h);
    const hx = x + w * 0.33,
      hy = y + h * 0.5;
    for (let i = -4; i <= 4; i++) evDisc(ctx, hx + i * 7, hy + h * 0.28, 7, FUR);
    ctx.beginPath();
    ctx.moveTo(hx - h * 0.3, hy + h * 0.3);
    ctx.quadraticCurveTo(hx - h * 0.32, hy - h * 0.35, hx, hy - h * 0.36);
    ctx.quadraticCurveTo(hx + h * 0.32, hy - h * 0.35, hx + h * 0.3, hy + h * 0.3);
    ctx.closePath();
    ctx.fillStyle = "#15171c";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#5b6070";
    ctx.stroke();
    evDisc(ctx, hx - h * 0.1, hy - h * 0.02, h * 0.04, "#ffcf33");
    evDisc(ctx, hx + h * 0.1, hy - h * 0.02, h * 0.04, "#ffcf33");
    mops(ctx, x + w * 0.62, floor, k, { f: -1 });
    ctx.save();
    ctx.shadowColor = "#ff3b3b";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#ff5050";
    ctx.fillRect(x + w * 0.58, y + h * 0.3, 5, h * 0.36);
    ctx.restore();
  } else if (id === "et") {
    // the bike across the big moon: Mops pedalling, a blanket-wrapped Squatch in the front basket (silhouettes)
    sky(ctx, x, y, w, h, "#0e1a3a", "#25366a");
    stars(ctx, x, y, w, h, 18);
    const mx = x + w * 0.52,
      my = y + h * 0.46;
    evDisc(ctx, mx, my, h * 0.36, "#f3f0dc");
    ctx.save();
    ctx.translate(mx - w * 0.06, my + h * 0.06);
    ctx.fillStyle = "#101421";
    evDisc(ctx, -h * 0.17, h * 0.14, h * 0.09, null, "#101421", 3);
    evDisc(ctx, h * 0.17, h * 0.14, h * 0.09, null, "#101421", 3);
    ctx.fillRect(-h * 0.17, h * 0.1, h * 0.34, 3);
    ctx.fillRect(h * 0.13, -h * 0.02, h * 0.14, h * 0.07); // the basket
    evDisc(ctx, h * 0.2, -h * 0.05, h * 0.06, "#101421"); // Squatch's head in the basket
    evDisc(ctx, h * 0.16, -h * 0.1, h * 0.025, "#101421");
    evDisc(ctx, h * 0.24, -h * 0.1, h * 0.025, "#101421");
    ctx.beginPath();
    ctx.ellipse(-h * 0.04, -h * 0.06, h * 0.1, h * 0.12, 0, 0, TAU); // Mops pedalling
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-h * 0.04, -h * 0.17);
    ctx.lineTo(-h * 0.1, -h * 0.28);
    ctx.lineTo(-h * 0.0, -h * 0.2);
    ctx.fill();
    ctx.restore();
  } else if (id === "lion") {
    // on a rock made of crates on the stage: Mops holds up a bundled Squatch (a little of him showing)
    sky(ctx, x, y, w, h, "#fbe7c2", "#f3c98b");
    crate(ctx, x + w * 0.2, floor - h * 0.2, w * 0.28, h * 0.2);
    crate(ctx, x + w * 0.3, floor - h * 0.38, w * 0.26, h * 0.18);
    mops(ctx, x + w * 0.38, floor - h * 0.38, k * 0.8, { f: 1 });
    const bx = x + w * 0.56,
      by = y + h * 0.22;
    ctx.beginPath();
    ctx.ellipse(bx, by, h * 0.09, h * 0.12, 0.3, 0, TAU);
    ctx.fillStyle = "#f6f1e4";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = INK;
    ctx.stroke();
    squatchHead(ctx, bx + 2, by - h * 0.09, h * 0.05);
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(bx, by - h * 0.2);
      ctx.lineTo(bx + Math.cos(-0.5 - i * 0.4) * h * 0.4, by - h * 0.2 + Math.sin(-0.5 - i * 0.4) * h * 0.4);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(255,230,140,.6)";
      ctx.stroke();
    }
  } else if (id === "minion") {
    // one big yellow goggle and blue overalls
    sky(ctx, x, y, w, h, "#bfe3ff", "#e8f5ff");
    mops(ctx, x + w * 0.42, floor, k, { f: 1 });
    rrect(ctx, x + w * 0.42 - 2 * k, floor - 34 * k, 26 * k, 22 * k, 4, "rgba(52,120,246,.85)", INK, 2);
    evDisc(ctx, x + w * 0.42 + 20 * k, floor - 50 * k, 7 * k, "#ffe066", INK, 3);
    evDisc(ctx, x + w * 0.42 + 20 * k, floor - 50 * k, 3 * k, INK);
  } else if (id === "dunk") {
    // the goat dunk: Mops in the air at a hoop
    sky(ctx, x, y, w, h, "#ffe3c4", "#ffd0a0");
    rrect(ctx, x + w * 0.66, y + h * 0.14, w * 0.22, h * 0.2, 2, "#ffffff", INK, 2.5);
    ctx.beginPath();
    ctx.ellipse(x + w * 0.72, y + h * 0.36, w * 0.08, h * 0.03, 0, 0, TAU);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#e5533d";
    ctx.stroke();
    mops(ctx, x + w * 0.42, floor - h * 0.28, k, { f: 1, walk: 1.2 });
    evDisc(ctx, x + w * 0.68, y + h * 0.3, h * 0.07, "#f08a2a", INK, 2);
  } else {
    // "ball": Mops holding up his trophy, and in the back Squatch rolled up as a ball (S#843)
    sky(ctx, x, y, w, h, "#e6f0d8", "#cfe3b8");
    ctx.save();
    ctx.globalAlpha = 0.95;
    evDisc(ctx, x + w * 0.82, floor - h * 0.1, h * 0.1, FUR, INK, 2.5);
    evDisc(ctx, x + w * 0.79, floor - h * 0.12, h * 0.018, INK);
    evDisc(ctx, x + w * 0.85, floor - h * 0.12, h * 0.018, INK);
    ctx.restore();
    mops(ctx, x + w * 0.36, floor, k, { f: 1 });
    rrect(ctx, x + w * 0.52, y + h * 0.3, w * 0.08, h * 0.16, 3, "#e9c46a", INK, 2);
  }
  ctx.restore();
}

/**
 * Squatch's crayon drawing (made at age 5) inside (x, y, w, h): him and Mops holding hands with a loop of string
 * round both their hands, TIED TOGETHER FOREVER over them, ME and MOPS THE GANITOR under them, and a dotted look from
 * Mops's eye to him with small hearts along it (R63). Drawn in crayon, the way his other crayon pictures are
 * (guardians-drawing.js): every line twice, a little off, the second fainter; shapes coloured in with slanted strokes
 * that leave the paper showing; his crayon writing pressed hard. Final art, Brian's yes 2026-11-27 (round 8; the words and
 * what is in it are as approved, 2026-11-13).
 */
export function drawCrayonDrawing(ctx, x, y, w, h) {
  const s = Math.min(w / 300, h / 230),
    rnd = cdWobble(13);
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  rrect(ctx, 0, 0, 300, 230, 6, "#fffdf2", INK, 3);
  // tape at the top corners
  ctx.fillStyle = "rgba(240,230,180,.85)";
  ctx.fillRect(10, -8, 40, 18);
  ctx.fillRect(250, -8, 40, 18);
  const crayon = (t, cx, cy, size, color) => {
    for (const [dx, dy, a] of [[0, 0, 0.95], [0.9, 0.7, 0.45]]) (ctx.save(), (ctx.globalAlpha = a), text(ctx, t, cx + dx, cy + dy, size, color, 800), ctx.restore());
  };
  crayon(eveningWords("sign-tied"), 150, 26, 22, "#e5533d");
  // Squatch: a brown body, head and ears coloured in, a darker brown line round them, two eyes and a big smile
  const SQ = "#8a5a36",
    SQL = "#5a3418";
  cdColourOval(ctx, rnd, 82, 130, 34, 44, SQ);
  cdColourOval(ctx, rnd, 82, 78, 24, 24, SQ);
  for (const ex of [62, 102]) cdColourOval(ctx, rnd, ex, 62, 8, 8, SQ);
  cdOval(ctx, rnd, 82, 130, 34, 44, SQL, 3);
  for (const ex of [62, 102]) cdOval(ctx, rnd, ex, 62, 8, 8, SQL, 3);
  cdOval(ctx, rnd, 82, 78, 24, 24, SQL, 3);
  evDisc(ctx, 74, 76, 3.5, INK);
  evDisc(ctx, 90, 76, 3.5, INK);
  cdLine(ctx, rnd, cdArcPts(82, 84, 9, 0.2, Math.PI - 0.2), INK, 3);
  // Mops: a white goat (grey crayon round him, a little grey shading), horns, a long beard, his blue name tag
  const GL = "#3b3f4a";
  cdColourOval(ctx, rnd, 214, 132, 34, 42, "#d9dce3", 0.45);
  cdOval(ctx, rnd, 214, 132, 34, 42, GL, 3);
  cdOval(ctx, rnd, 214, 80, 22, 22, GL, 3);
  cdLine(ctx, rnd, [[200, 62], [192, 46], [202, 34]], "#a07a4a", 4);
  cdLine(ctx, rnd, [[228, 62], [236, 46], [226, 34]], "#a07a4a", 4);
  cdLine(ctx, rnd, [[206, 96], [214, 128], [222, 96]], "#9a9ea8", 3);
  for (const bx of [210, 214, 218]) cdLine(ctx, rnd, [[bx, 100], [214 + (bx - 214) * 0.4, 122]], "#b8bcc6", 2);
  evDisc(ctx, 207, 78, 3, INK);
  evDisc(ctx, 221, 78, 3, INK);
  cdLine(ctx, rnd, [[224, 118], [242, 118], [242, 127], [224, 127], [224, 118]], "#1d4fb8", 2.5);
  // holding hands, a loop of string round both
  cdLine(ctx, rnd, [[112, 128], [148, 129], [184, 128]], SQL, 4);
  cdOval(ctx, rnd, 148, 128, 14, 8, "#e5533d", 3);
  // the dotted look from Mops's eye to Squatch: crayon dabs along it, and hearts coloured in
  for (let i = 0; i <= 10; i++) {
    const u = i / 10,
      px = (1 - u) * (1 - u) * 204 + 2 * (1 - u) * u * 150 + u * u * 98,
      py = (1 - u) * (1 - u) * 74 + 2 * (1 - u) * u * 46 + u * u * 72;
    i % 2 || cdLine(ctx, rnd, [[px - 1.5, py], [px + 1.5, py]], "#e5533d", 3);
  }
  drawHeartShape(ctx, 150, 54, 6);
  drawHeartShape(ctx, 124, 60, 5);
  // the labels: two crayon tags, each with its own arrow (decided 2026-11-26, question 2: A; "Ganitor" stays on the
  // brass plaque only)
  const tagArrow = (x0, y0, x1, y1) => {
    const a = Math.atan2(y1 - y0, x1 - x0);
    cdLine(ctx, rnd, [[x0, y0], [(x0 + x1) / 2 + 5, (y0 + y1) / 2], [x1, y1]], "#3478f6", 3);
    cdLine(ctx, rnd, [[x1 - Math.cos(a - 0.5) * 12, y1 - Math.sin(a - 0.5) * 12], [x1, y1], [x1 - Math.cos(a + 0.5) * 12, y1 - Math.sin(a + 0.5) * 12]], "#3478f6", 3);
  };
  crayon(eveningWords("sign-me"), 40, 204, 24, "#3478f6");
  tagArrow(48, 190, 60, 172);
  crayon(eveningWords("sign-mops"), 262, 204, 24, "#3478f6");
  tagArrow(250, 190, 238, 170);
  ctx.restore();
}
// His crayon: a fixed wobble (the same every frame), from a seed.
function cdWobble(seed) {
  let n = seed >>> 0 || 1;
  return () => ((n = (n * 1664525 + 1013904223) >>> 0), n / 4294967296 - 0.5);
}
// A crayon line through points: twice, a little off, the second fainter.
function cdLine(ctx, rnd, pts, color, width) {
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (let i = 0; i < 2; i++) {
    ctx.beginPath();
    pts.forEach(([px, py], j) => (j ? ctx.lineTo(px + rnd() * 1.6, py + rnd() * 1.6) : ctx.moveTo(px + rnd() * 1.6, py + rnd() * 1.6)));
    ctx.strokeStyle = color;
    ctx.globalAlpha = i ? 0.5 : 0.92;
    ctx.lineWidth = width * (i ? 0.75 : 1);
    ctx.stroke();
  }
  ctx.restore();
}
const cdArcPts = (cx, cy, r, a0, a1, n = 10) => Array.from({ length: n + 1 }, (_, i) => [cx + Math.cos(a0 + ((a1 - a0) * i) / n) * r, cy + Math.sin(a0 + ((a1 - a0) * i) / n) * r]);
// A crayon oval's outline.
function cdOval(ctx, rnd, cx, cy, rx, ry, color, width) {
  cdLine(ctx, rnd, Array.from({ length: 19 }, (_, i) => [cx + Math.cos((i / 18) * TAU) * rx, cy + Math.sin((i / 18) * TAU) * ry]), color, width);
}
// An oval coloured in with slanted crayon strokes, the paper showing between them.
function cdColourOval(ctx, rnd, cx, cy, rx, ry, color, alpha = 0.7) {
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, TAU);
  ctx.clip();
  ctx.strokeStyle = color;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = 3.2;
  ctx.lineCap = "round";
  for (let k = -rx - ry; k < rx + ry; k += 3.6) {
    ctx.beginPath();
    ctx.moveTo(cx + k + rnd() * 1.5, cy + ry);
    ctx.lineTo(cx + k + ry * 0.6 + rnd() * 1.5, cy - ry);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawHeartShape(ctx, x, y, r, color = "#e5533d") {
  ctx.beginPath();
  ctx.moveTo(x, y + r);
  ctx.bezierCurveTo(x - r * 2, y - r * 0.4, x - r * 0.6, y - r * 1.8, x, y - r * 0.5);
  ctx.bezierCurveTo(x + r * 0.6, y - r * 1.8, x + r * 2, y - r * 0.4, x, y + r);
  ctx.fillStyle = color;
  ctx.fill();
}

// ---------- the stand's brochure ----------
// One grown-up Sasquatch behind the counter (bigger than Squatch, a different fur: not him; Brian P 33:05 to 33:58).
/** Mars: a red planet with craters. */
export function drawMars(ctx, x, y, r) {
  evDisc(ctx, x, y, r, "#d9583b", INK, Math.max(1.5, r * 0.08));
  evDisc(ctx, x - r * 0.3, y - r * 0.2, r * 0.18, "#b8432c");
  evDisc(ctx, x + r * 0.35, y + r * 0.25, r * 0.13, "#b8432c");
  evDisc(ctx, x + r * 0.05, y + r * 0.45, r * 0.09, "#b8432c");
}
/**
 * The brochure's front inside (x, y, w, h), a brochure for the stand (Brian, 2026-11-27, r5 6:08: "just more of a
 * brochure for the stand", nobody on it): the stand with its striped awning, Mars big in the sky behind it, on its
 * counter one cake box stamped with his family's name (snack-name.js FAMILY) in fat red letters, and one cake cut
 * open, red inside (`fizz` 0 to 1: its sparks). No cooks, no paw print, no other words (DECISIONS: its only words are
 * the family name on the box). Drawn in the locked rooms' way (flat fills, one dark ink line, white shine): the folded paper
 * (a crease near its right edge), space flat navy with four-point sparkles, Mars with craters and a lit edge, the red
 * ground, the awning's scallops, the counter's planks. Final art, Brian's yes 2026-11-27 (round 8).
 * `small` leaves out the fine parts (the brochure in a paw or held up in the room).
 */
export function drawBrochure(ctx, x, y, w, h, small = false, fizz = 0, t = 0) {
  const lw = Math.max(1.5, w * 0.012),
    ink = "rgb(34,36,44)";
  ctx.save();
  rrect(ctx, x, y, w, h, Math.max(2, w * 0.03), "#fffaf0", ink, lw);
  ctx.beginPath();
  ctx.rect(x + w * 0.04, y + w * 0.04, w * 0.92, h - w * 0.08);
  ctx.clip();
  // space: flat navy (the rooms' window), sparkles
  ctx.fillStyle = "rgb(50,56,96)";
  ctx.fillRect(x, y, w, h * 0.62);
  if (!small)
    for (const [u, v, r] of [[0.12, 0.08, 1], [0.3, 0.2, 0.7], [0.22, 0.34, 0.8], [0.45, 0.07, 0.6], [0.92, 0.42, 0.7], [0.1, 0.5, 0.6], [0.4, 0.42, 0.5]]) {
      const sx = x + w * u,
        sy = y + h * v,
        k = w * 0.016 * r;
      ctx.fillStyle = "rgb(235,235,245)";
      ctx.beginPath();
      ctx.moveTo(sx, sy - k * 2);
      ctx.lineTo(sx + k * 0.5, sy - k * 0.5);
      ctx.lineTo(sx + k * 2, sy);
      ctx.lineTo(sx + k * 0.5, sy + k * 0.5);
      ctx.lineTo(sx, sy + k * 2);
      ctx.lineTo(sx - k * 0.5, sy + k * 0.5);
      ctx.lineTo(sx - k * 2, sy);
      ctx.lineTo(sx - k * 0.5, sy - k * 0.5);
      ctx.closePath();
      ctx.fill();
    }
  // Mars, big behind the stand: a lit edge on its upper left
  const mx = x + w * 0.68,
    my = y + h * 0.2,
    mr = w * 0.26;
  drawMars(ctx, mx, my, mr);
  if (!small) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(mx, my, mr - lw / 2, 0, TAU);
    ctx.clip();
    ctx.beginPath();
    ctx.arc(mx - mr * 0.1, my - mr * 0.1, mr, Math.PI * 0.95, Math.PI * 1.55);
    ctx.strokeStyle = "rgba(255,190,150,.8)";
    ctx.lineWidth = mr * 0.12;
    ctx.stroke();
    ctx.restore();
  }
  // the red ground, a darker line where it meets the sky
  ctx.fillStyle = "#c86a48";
  ctx.fillRect(x, y + h * 0.6, w, h * 0.4);
  ctx.fillStyle = "#a8503a";
  ctx.fillRect(x, y + h * 0.6, w, Math.max(1, h * 0.012));
  // the stand: two posts, a striped awning with scalloped edge, a counter of planks
  const sx = x + w * 0.12,
    sw = w * 0.76,
    top = y + h * 0.36,
    ct = y + h * 0.62;
  for (const px of [sx + sw * 0.04, sx + sw * 0.96 - w * 0.03]) rrect(ctx, px, top, w * 0.03, h * 0.5, 1, "#8b5a2b", ink, lw);
  const n = small ? 4 : 6;
  rrect(ctx, sx - w * 0.02, top - h * 0.03, sw + w * 0.04, h * 0.035, 2, "#e0303a", ink, lw);
  for (let i = 0; i < n; i++) {
    ctx.beginPath();
    ctx.moveTo(sx + (sw * i) / n, top);
    ctx.lineTo(sx + (sw * (i + 1)) / n, top);
    ctx.lineTo(sx + (sw * (i + 1)) / n, top + h * 0.09);
    ctx.quadraticCurveTo(sx + (sw * (i + 0.5)) / n, top + h * 0.14, sx + (sw * i) / n, top + h * 0.09);
    ctx.closePath();
    ctx.fillStyle = i % 2 ? "#fffaf0" : "#e0303a";
    ctx.fill();
    ctx.lineWidth = lw;
    ctx.strokeStyle = ink;
    ctx.stroke();
  }
  rrect(ctx, sx - w * 0.04, ct, sw + w * 0.08, h * 0.3, 2, "#b0784a", ink, lw);
  ctx.fillStyle = "#c98c58";
  ctx.fillRect(sx - w * 0.04 + lw, ct + lw, sw + w * 0.08 - lw * 2, h * 0.035);
  if (!small) {
    ctx.strokeStyle = "#8b5a2b";
    ctx.lineWidth = lw * 0.6;
    for (const v of [0.1, 0.2]) (ctx.beginPath(), ctx.moveTo(sx - w * 0.03, ct + h * v), ctx.lineTo(sx + sw + w * 0.03, ct + h * v), ctx.stroke());
  }
  // on the counter: the cake box stamped with his family's name, and the cake cut open, red and fizzing
  drawBrochureExtras(ctx, x, y, w, h, small ? 0 : fizz, t, small);
  ctx.restore();
  // the fold: a crease near the right edge, the folded part a shade darker
  if (!small) {
    ctx.save();
    ctx.fillStyle = "rgba(34,36,44,.08)";
    ctx.fillRect(x + w * 0.9, y + lw, w * 0.1 - lw, h - lw * 2);
    ctx.strokeStyle = "rgba(34,36,44,.35)";
    ctx.lineWidth = lw * 0.5;
    ctx.beginPath();
    ctx.moveTo(x + w * 0.9, y + lw);
    ctx.lineTo(x + w * 0.9, y + h - lw);
    ctx.stroke();
    ctx.restore();
  }
}

// ---------- the order papers ----------
/** The design box of the papers close-up. */
export const PAPERS = Object.freeze({
  W: 360,
  H: 600,
  pink: Object.freeze({ x: 40, y: 70, w: 270, h: 340 }),
  yellow: Object.freeze({ dx: 18, dy: 22 }),
  box: Object.freeze({ x: 244, y: 178, s: 48 }),
  code: Object.freeze({ x: 150, y: 330 }),
  close: Object.freeze({ x: 318, y: 556, r: 34 }),
});
/** A paw print (a big pad and four toes) at (x, y), `s` across. */
export function drawPawPrint(ctx, x, y, s, color = "#5a3418", a = 1) {
  ctx.save();
  ctx.globalAlpha = a;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y + s * 0.12, s * 0.28, s * 0.22, 0, 0, TAU);
  ctx.fill();
  for (const [dx, dy] of [[-0.3, -0.16], [-0.1, -0.3], [0.1, -0.3], [0.3, -0.16]]) {
    ctx.beginPath();
    ctx.ellipse(x + dx * s, y + dy * s, s * 0.09, s * 0.12, dx * 0.6, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}
// One sheet's printing (pink or its yellow carbon copy): grey lines, the order row with its box, the office code
// written by hand, a signature; `ink` is the carbon's own colour on the copy.
// (tests: the office codes written in pen since the last drawPapers)
const penWrote = new Set();
function sheetPrint(ctx, x, y, w, h, ink, mark, code) {
  ctx.save();
  ctx.fillStyle = ink;
  for (let i = 0; i < 4; i++) ctx.fillRect(x + 22, y + 28 + i * 18, w * (0.7 - i * 0.1), 4);
  const B = PAPERS.box,
    bx = x + B.x - PAPERS.pink.x,
    by = y + B.y - PAPERS.pink.y;
  text(ctx, eveningWords("sign-order"), x + 16, by + B.s / 2, 16, ink, 900, "left");
  rrect(ctx, bx, by, B.s, B.s, 4, "rgba(255,255,255,.6)", ink, 3);
  // the office code, written in blue pen in the corner (story pass beat 42b): Isfred's own pen strokes, as on the
  // same sheet in the loading bay (beat 32) and in the escape (pen-digits.js)
  if (code) {
    ctx.save();
    ctx.translate(x + w * 0.7, y + h - 34);
    ctx.rotate(-0.06);
    drawPenDigits(ctx, eveningWords("sign-code"), 0, 0, 24, "#1d4fb8");
    ctx.restore();
    penWrote.add(eveningWords("sign-code"));
  }
  ctx.beginPath();
  ctx.moveTo(x + 40, y + h - 40);
  ctx.bezierCurveTo(x + 70, y + h - 70, x + 90, y + h - 10, x + 120, y + h - 45);
  ctx.bezierCurveTo(x + 140, y + h - 60, x + 150, y + h - 30, x + 180, y + h - 42);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = ink;
  ctx.stroke();
  mark > 0 && drawPawPrint(ctx, bx + B.s / 2, by + B.s / 2, B.s * 0.9, ink === "#1e2430" ? "#5a3418" : ink, mark);
  ctx.restore();
}
/**
 * The two stuck-together copies in the close-up (design units, PAPERS): the yellow under the pink, peeking out below
 * and to the right. `mark` (0 to 1): his paw print in the box; `tear` (0 to 1): the yellow sliding out from under the
 * pink and away down to his paw (from 0.3 on it shows its own carbon print).
 */
export function drawPapers(ctx, { mark = 0, tear = 0 } = {}) {
  penWrote.clear();
  const P = PAPERS.pink,
    Y = PAPERS.yellow;
  // (it slides down out from under the pink, so its own carbon print shows, then a little further to his paw)
  const out = Math.max(0, Math.min(1, tear)),
    down = Math.min(1, out / 0.45);
  const yx = P.x + Y.dx - out * 10,
    yy = P.y + Y.dy + (down * down * (3 - 2 * down)) * 250 + Math.max(0, out - 0.75) * 60;
  // the yellow copy (under), torn edge once it is out
  ctx.save();
  ctx.translate(yx + P.w / 2, yy + P.h / 2);
  ctx.rotate(out * 0.18);
  ctx.translate(-(yx + P.w / 2), -(yy + P.h / 2));
  rrect(ctx, yx, yy, P.w, P.h, 4, "#ffe27a", INK, 3);
  out > 0.3 && sheetPrint(ctx, yx, yy, P.w, P.h, "#3a4a9a", mark, true);
  if (out > 0) {
    ctx.beginPath();
    for (let i = 0; i <= 18; i++) ctx.lineTo(yx + (P.w * i) / 18, yy + (i % 2 ? 6 : 0));
    ctx.lineWidth = 2;
    ctx.strokeStyle = INK;
    ctx.stroke();
  }
  ctx.restore();
  // the pink sheet (over)
  rrect(ctx, P.x, P.y, P.w, P.h, 4, "#ff9ec4", INK, 3);
  sheetPrint(ctx, P.x, P.y, P.w, P.h, INK, mark, true);
  // (what was written in pen, for the tests)
  return { pen: [...penWrote] };
}

/** Squatch's furry arm in a close-up: from the bottom of the screen (bx, by) to his paw at (x, y), `r` the paw's size. */
export function drawFurArm(ctx, bx, by, x, y, r) {
  ctx.save();
  ctx.lineCap = "round";
  ctx.strokeStyle = INK;
  ctx.lineWidth = r * 1.5 + 6;
  ctx.beginPath();
  ctx.moveTo(bx, by);
  ctx.quadraticCurveTo((bx + x) / 2 + r, (by + y) / 2 + r, x, y);
  ctx.stroke();
  ctx.strokeStyle = FUR;
  ctx.lineWidth = r * 1.5;
  ctx.stroke();
  evDisc(ctx, x, y, r, FUR, INK, 3);
  for (const [dx, dy] of [[-0.55, -0.7], [0, -0.9], [0.55, -0.7]]) evDisc(ctx, x + dx * r, y + dy * r, r * 0.32, FUR, INK, 2.5);
  evDisc(ctx, x, y + r * 0.1, r * 0.4, FUR_DARK);
  ctx.restore();
}

// ---------- the plaque under each photo ----------
export function drawPlaque(ctx, x, y, size) {
  font(ctx, size);
  const word = ganitorWords("sign-wall"),
    w = ctx.measureText(word).width + size * 1.4;
  rrect(ctx, x - w / 2, y - size * 0.8, w, size * 1.6, size * 0.35, "#3a2a18", "#e9c46a", 3);
  text(ctx, word, x, y + 1, size, "#fff6d8");
  return { x0: x - w / 2, x1: x + w / 2, word };
}
