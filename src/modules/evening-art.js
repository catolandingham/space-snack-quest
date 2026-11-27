/**
 * The drawings the evening of Day 2 adds (beats 37 to 42; evening.js). Every one is a PLACEHOLDER waiting for Brian's
 * eye; none of them changes a locked room picture (they are layers over it, or full-screen close-ups).
 *   the Employee of the Month gallery's photos: movie scenes Mops and Squatch made with station props (Brian's newest
 *     gags: Karate Kid, Darth Vader with Squatch behind the mask, E.T. with Squatch in the basket, Lion King on a rock
 *     of crates, a minion, a goat dunk, and one with Squatch rolled up as a ball in the back); the approved pictures
 *     are not in the repo yet, so these are stand-ins
 *   Squatch's crayon drawing behind the crooked photo #4: him and Mops, TIED TOGETHER FOREVER, two tags ME and MOPS
 *     each with an arrow (decided 2026-11-26), and a dotted look from Mops to him with hearts (R63)
 *   the pancake brochure: a big furry Sasquatch couple behind a pancake counter, Mars in the window behind them (no
 *     words: what it says is still Brian's to pick)
 *   the family's wordless picture bubble (pancakes, Mars)
 *   the order papers: the big pink sheet with ORDER MORE ROBOTS and its box, the office code, and the small yellow
 *     carbon copy stuck under it; Squatch's paw print
 *   his furry arm and paw in the close-ups; Mops asleep on his back with his four feet in the air
 */
import { ganitorWords } from "./ganitor.js";
import { eveningWords } from "./evening-lines.js";
import { drawBrochureExtras } from "./evening-pictures.js";

export const INK = "#1e2430";
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
 * Mops's eye to him with small hearts along it (R63).
 */
export function drawCrayonDrawing(ctx, x, y, w, h) {
  const s = Math.min(w / 300, h / 230);
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  rrect(ctx, 0, 0, 300, 230, 6, "#fffdf2", INK, 3);
  // tape at the top corners
  ctx.fillStyle = "rgba(240,230,180,.85)";
  ctx.fillRect(10, -8, 40, 18);
  ctx.fillRect(250, -8, 40, 18);
  const crayon = (t, cx, cy, size, color) => {
    for (const [dx, dy] of [[0, 0], [0.8, 0.6]]) text(ctx, t, cx + dx, cy + dy, size, color, 800);
  };
  crayon(eveningWords("sign-tied"), 150, 26, 22, "#e5533d");
  // Squatch: a scribbly brown body, head, ears, two eyes and a big smile
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#5a3418";
  ctx.fillStyle = "#8a5a36";
  ctx.beginPath();
  ctx.ellipse(82, 130, 34, 44, 0, 0, TAU);
  ctx.fill();
  ctx.stroke();
  evDisc(ctx, 82, 78, 24, "#8a5a36", "#5a3418", 3);
  evDisc(ctx, 62, 62, 8, "#8a5a36", "#5a3418", 3);
  evDisc(ctx, 102, 62, 8, "#8a5a36", "#5a3418", 3);
  evDisc(ctx, 74, 76, 3.5, INK);
  evDisc(ctx, 90, 76, 3.5, INK);
  ctx.beginPath();
  ctx.arc(82, 84, 9, 0.2, Math.PI - 0.2);
  ctx.lineWidth = 3;
  ctx.strokeStyle = INK;
  ctx.stroke();
  // Mops: a white goat with horns, a long beard and his name tag
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#3b3f4a";
  ctx.beginPath();
  ctx.ellipse(214, 132, 34, 42, 0, 0, TAU);
  ctx.fill();
  ctx.stroke();
  evDisc(ctx, 214, 80, 22, "#ffffff", "#3b3f4a", 3);
  ctx.beginPath();
  ctx.moveTo(200, 62);
  ctx.quadraticCurveTo(190, 40, 202, 34);
  ctx.moveTo(228, 62);
  ctx.quadraticCurveTo(238, 40, 226, 34);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#a07a4a";
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(206, 96);
  ctx.lineTo(214, 128);
  ctx.lineTo(222, 96);
  ctx.closePath();
  ctx.fillStyle = "#d8d8d8";
  ctx.fill();
  evDisc(ctx, 207, 78, 3, INK);
  evDisc(ctx, 221, 78, 3, INK);
  rrect(ctx, 224, 118, 18, 9, 2, "#ffffff", "#1d4fb8", 2);
  // holding hands, a loop of string round both
  ctx.beginPath();
  ctx.moveTo(112, 128);
  ctx.lineTo(184, 128);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#5a3418";
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(148, 128, 14, 8, 0, 0, TAU);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#e5533d";
  ctx.stroke();
  // the dotted look from Mops's eye to Squatch, with hearts
  ctx.setLineDash([3, 6]);
  ctx.beginPath();
  ctx.moveTo(204, 74);
  ctx.quadraticCurveTo(150, 46, 98, 72);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = "#e5533d";
  ctx.stroke();
  ctx.setLineDash([]);
  drawHeartShape(ctx, 150, 54, 6);
  drawHeartShape(ctx, 124, 60, 5);
  // the labels: two crayon tags, each with its own arrow (decided 2026-11-26, question 2: A; "Ganitor" stays on the
  // brass plaque only)
  const tagArrow = (x0, y0, x1, y1) => {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo((x0 + x1) / 2 + 10, (y0 + y1) / 2, x1, y1);
    const a = Math.atan2(y1 - y0, x1 - x0);
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - Math.cos(a - 0.5) * 12, y1 - Math.sin(a - 0.5) * 12);
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - Math.cos(a + 0.5) * 12, y1 - Math.sin(a + 0.5) * 12);
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#3478f6";
    ctx.stroke();
  };
  crayon(eveningWords("sign-me"), 40, 204, 24, "#3478f6");
  tagArrow(48, 190, 60, 172);
  crayon(eveningWords("sign-mops"), 262, 204, 24, "#3478f6");
  tagArrow(250, 190, 238, 170);
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

// ---------- the pancake brochure ----------
// One grown-up Sasquatch behind the counter (bigger than Squatch, a different fur: not him; Brian P 33:05 to 33:58).
function bigSasquatch(ctx, x, y, s, fur, dark, hat) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  // shoulders and arms
  ctx.beginPath();
  ctx.ellipse(0, 40, 46, 40, 0, 0, TAU);
  ctx.fillStyle = fur;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = INK;
  ctx.stroke();
  // fur tufts round the head
  for (let i = 0; i < 10; i++) evDisc(ctx, Math.cos((i / 10) * TAU) * 30, -6 + Math.sin((i / 10) * TAU) * 30, 9, fur, null);
  evDisc(ctx, -30, -24, 9, fur, INK, 3);
  evDisc(ctx, 30, -24, 9, fur, INK, 3);
  evDisc(ctx, 0, -6, 30, fur, INK, 3);
  // a lighter face, two kind eyes, a big smile
  ctx.beginPath();
  ctx.ellipse(0, 0, 20, 18, 0, 0, TAU);
  ctx.fillStyle = "#c79a72";
  ctx.fill();
  evDisc(ctx, -8, -4, 3.6, INK);
  evDisc(ctx, 8, -4, 3.6, INK);
  evDisc(ctx, -6.8, -5.2, 1.1, "#ffffff");
  evDisc(ctx, 9.2, -5.2, 1.1, "#ffffff");
  ctx.beginPath();
  ctx.arc(0, 4, 9, 0.15, Math.PI - 0.15);
  ctx.lineWidth = 3;
  ctx.strokeStyle = INK;
  ctx.stroke();
  if (hat === "chef") {
    rrect(ctx, -18, -50, 36, 16, 4, "#ffffff", INK, 2.5);
    evDisc(ctx, -10, -56, 10, "#ffffff", INK, 2.5);
    evDisc(ctx, 10, -56, 10, "#ffffff", INK, 2.5);
    evDisc(ctx, 0, -62, 11, "#ffffff", INK, 2.5);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-16, -52, 32, 8);
  } else if (hat === "flower") {
    for (let i = 0; i < 5; i++) evDisc(ctx, 24 + Math.cos((i / 5) * TAU) * 7, -32 + Math.sin((i / 5) * TAU) * 7, 5, "#ff5fa8", INK, 1.5);
    evDisc(ctx, 24, -32, 4, "#ffcf33");
  }
  // a waving paw
  evDisc(ctx, hat === "chef" ? -44 : 44, 6, 11, dark, INK, 3);
  ctx.restore();
}
function pancakes(ctx, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  rrect(ctx, -30, 4, 60, 8, 4, "#e8eef5", INK, 2);
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.ellipse(0, -i * 9, 24, 7, 0, 0, TAU);
    ctx.fillStyle = "#e0a050";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#8a5a2b";
    ctx.stroke();
  }
  rrect(ctx, -6, -40, 12, 7, 2, "#ffe066", INK, 1.5);
  ctx.beginPath();
  ctx.moveTo(-20, -30);
  ctx.quadraticCurveTo(-24, -14, -18, -4);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(150,70,20,.8)";
  ctx.stroke();
  ctx.restore();
}
/** Mars: a red planet with craters. */
export function drawMars(ctx, x, y, r) {
  evDisc(ctx, x, y, r, "#d9583b", INK, Math.max(1.5, r * 0.08));
  evDisc(ctx, x - r * 0.3, y - r * 0.2, r * 0.18, "#b8432c");
  evDisc(ctx, x + r * 0.35, y + r * 0.25, r * 0.13, "#b8432c");
  evDisc(ctx, x + r * 0.05, y + r * 0.45, r * 0.09, "#b8432c");
}
/**
 * The brochure's front inside (x, y, w, h): a big furry Sasquatch couple smiling behind a pancake counter, a stack of
 * pancakes, Mars in the round window behind them, and (evening-pictures.js) one cake box stamped MARS CAKES, a
 * cut-open cake with a red middle (`fizz`: its sparks) and a round paw print. No other words (decided 2026-11-26).
 * `small` leaves out the fine parts (the brochure in a paw or on the counter).
 */
export function drawBrochure(ctx, x, y, w, h, small = false, fizz = 0, t = 0) {
  ctx.save();
  rrect(ctx, x, y, w, h, Math.max(2, w * 0.03), "#fffaf0", INK, Math.max(1.5, w * 0.012));
  ctx.beginPath();
  ctx.rect(x + w * 0.04, y + w * 0.04, w * 0.92, h - w * 0.08);
  ctx.clip();
  // the night sky with Mars in a round window
  const sh = h * 0.5;
  sky(ctx, x, y, w, sh + h * 0.1, "#1b2350", "#4b3a7a");
  !small && stars(ctx, x, y, w, sh, 12);
  drawMars(ctx, x + w * 0.5, y + h * 0.2, w * 0.14);
  // the two grown-ups behind the counter
  const s = w / 300;
  bigSasquatch(ctx, x + w * 0.3, y + h * 0.5, s * 1.25, "#7a4a2a", "#5a3418", "chef");
  bigSasquatch(ctx, x + w * 0.7, y + h * 0.5, s * 1.2, "#9a5a32", "#6e3d1e", "flower");
  // the counter
  rrect(ctx, x - 4, y + h * 0.7, w + 8, h * 0.32, 2, "#b0784a", INK, Math.max(1.5, w * 0.012));
  ctx.fillStyle = "#c98c58";
  ctx.fillRect(x, y + h * 0.7, w, h * 0.04);
  pancakes(ctx, x + w * 0.5, y + h * 0.72, s * 1.4);
  // the cake box stamped MARS CAKES, the cut-open cake, the round paw print (story pass beat 39)
  !small && drawBrochureExtras(ctx, x, y, w, h, fizz, t);
  ctx.restore();
  // the fold
  if (!small) {
    ctx.save();
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(x + w * 0.66, y + 4);
    ctx.lineTo(x + w * 0.66, y + h * 0.12);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(30,36,48,.35)";
    ctx.stroke();
    ctx.restore();
  }
}
/** The family's wordless bubble over the speaker: pancakes and Mars (nobody says where; Call 16 cut the words). */
export function drawPictureBubble(ctx, x, y, a = 1) {
  ctx.save();
  ctx.globalAlpha = a;
  rrect(ctx, x - 62, y - 50, 124, 74, 22, "#ffffff", INK, 3);
  ctx.beginPath();
  ctx.moveTo(x - 10, y + 24);
  ctx.lineTo(x, y + 40);
  ctx.lineTo(x + 12, y + 24);
  ctx.closePath();
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.stroke();
  pancakes(ctx, x - 26, y - 2, 0.75);
  drawMars(ctx, x + 30, y - 12, 18);
  ctx.restore();
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
function sheetPrint(ctx, x, y, w, h, ink, mark, code) {
  ctx.save();
  ctx.fillStyle = ink;
  for (let i = 0; i < 4; i++) ctx.fillRect(x + 22, y + 28 + i * 18, w * (0.7 - i * 0.1), 4);
  const B = PAPERS.box,
    bx = x + B.x - PAPERS.pink.x,
    by = y + B.y - PAPERS.pink.y;
  text(ctx, eveningWords("sign-order"), x + 16, by + B.s / 2, 16, ink, 900, "left");
  rrect(ctx, bx, by, B.s, B.s, 4, "rgba(255,255,255,.6)", ink, 3);
  code && text(ctx, eveningWords("sign-code"), x + w * 0.42, y + PAPERS.code.y - PAPERS.pink.y, 34, ink, 700);
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

// ---------- Mops asleep ----------
/** Where Mops's head is in his own units (his drawing faces right, feet at 0, 0; the face buttons' framing). */
export const MOPS_HEAD = Object.freeze({ x: 17, y: -29 });
/** The middle of his body in his own units: he turns round it as he tips over, so his back comes to rest on the floor. */
export const MOPS_MIDDLE = Object.freeze({ x: 0, y: -20 });
/**
 * Mops falling asleep the fainting-goat way (Brian, 2026-11-26): standing with his eyes shut, then stiff and tipped
 * over (`tip` 0 to 1, a quarter turn: his legs stick out stiff), then over onto his back with his four feet in the air
 * (`roll` 0 to 1). He faces left (toward the bed) as he stands, so on his back his head lies to the right, resting
 * against his mop bucket (Brian, [42 0:00]: "maybe [Mops] rests his head on the bucket"); his back is on the floor
 * (his feet's line `y`), with a shadow under him. `x` is where his feet stand. `mops` is the engine's Mops drawing.
 * PLACEHOLDER pose: his own drawing turned, no new art. Returns his drawn box (game positions), lying, for tests.
 */
export function drawSleepingMops(ctx, mops, x, y, scale, tip, roll, t = 0) {
  const a = -(Math.PI / 2) * (tip + roll),
    lie = Math.min(1, tip + roll),
    c = { x: x + MOPS_MIDDLE.x * scale, y: y + MOPS_MIDDLE.y * scale };
  // the shadow on the floor under him, wider as he comes down, breathing slowly once he lies there
  ctx.save();
  ctx.globalAlpha = 0.22 + 0.1 * lie;
  ctx.beginPath();
  ctx.ellipse(x + 2 * scale * lie, y + 3, (14 + 12 * lie) * scale + (lie > 0.9 ? Math.sin(t * 2) * 2 : 0), 3.2 * scale, 0, 0, TAU);
  ctx.fillStyle = INK;
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.translate(c.x, c.y);
  ctx.rotate(a);
  ctx.translate(-c.x, -c.y);
  mops(ctx, x, y, scale, { f: -1, walk: 0, eyes: "closed" });
  ctx.restore();
  // his head, turned with him (the left-facing drawing has it at -MOPS_HEAD.x)
  const hx = -MOPS_HEAD.x * scale + x - c.x,
    hy = MOPS_HEAD.y * scale + y - c.y;
  return { head: { x: c.x + hx * Math.cos(a) - hy * Math.sin(a), y: c.y + hx * Math.sin(a) + hy * Math.cos(a) } };
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
