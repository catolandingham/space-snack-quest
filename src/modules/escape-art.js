/**
 * The escape's drawings (Chapter 1, beats 43 to 52). Everything here is a PLACEHOLDER drawing in the game's style (dark
 * outlines, flat colours) until Brian approves a look: the pancake brochure on the home wall, the big pink order sheet
 * (the paw print in the ORDER MORE ROBOTS box, the office code written in its corner), the open vent grille, the inside
 * of the vent (no locked picture exists: Mops's secret desk, the IDEAS FOR GUARDIANS board, the detective wall, the
 * TOYS bin), the close-ups (the detective wall, the Mars letter, the new Guardian note, the slip in his paw, the
 * keypad, the Moon Pie site, the snack counter, the Guardian Box) and the wordless thought pictures. Locked room
 * pictures are never redrawn: these are layers on top of them, or whole pictures of their own.
 * Every word comes from escape-lines.js; every place from escape-place.js.
 */
import { escapeWords } from "./escape-lines.js";
import { VENT_ROOM, KEYPAD, keyAt, SITE, SNACKS, OFFICE_CODE, HALLWAY } from "./escape-place.js";
import { drawThought, drawCrate } from "./bedtime-story-art.js";
import { drawGuardiansCrayon } from "./guardians-drawing.js";
import { GUARDIAN_BOX } from "./guardian-box.js";
import { morningWords } from "./home-morning-lines.js";
import { BOX_CLOSEUP, drawRocket, oldNote, furryArm, MORNING_SIZES } from "./home-morning-art.js";
import { drawSnack } from "./party-snacks-art.js";
import { drawHeart } from "./lunch-sneak-art.js";
import { OUTLINE } from "./outline.js";
import { drawPenDigits } from "./pen-digits.js";

const ES_INK = "#1e2430";
const ES_PINK = "#ff9cc2",
  ES_PINK_DARK = "#d9668f",
  ES_CREAM = "#fff4c2",
  ES_PAPER = "#fffdf8",
  ES_FUR = "#6b4428",
  ES_FUR_DARK = "#55351f",
  ES_RED = "#e5533d",
  ES_GOLD = "#ffcf33";
const ES_TAU = Math.PI * 2;
const esClamp = (k) => Math.max(0, Math.min(1, k));

function esRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, Math.max(0, Math.min(r, w / 2, h / 2)));
}
function esPaint(ctx, fill, line, ink = ES_INK) {
  fill && ((ctx.fillStyle = fill), ctx.fill());
  line && ((ctx.strokeStyle = ink), (ctx.lineWidth = line), (ctx.lineJoin = "round"), ctx.stroke());
}
// Every word the escape's drawings have put on screen (tests: tests/escape.mjs, tests/ch1-playthrough.mjs).
const drawnWords = new Set();
export function escapeDrawnWords() {
  return [...drawnWords];
}
/** Words in game pixels (the size is what a test reads). Returns the words. */
export function esWords(ctx, s, x, y, size, color = ES_INK, align = "center", weight = 800) {
  drawnWords.size > 500 && drawnWords.clear();
  drawnWords.add(String(s));
  ctx.font = `${weight} ${size}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.fillText(s, x, y);
  return s;
}
// Words split into lines no wider than `w`.
function esWrap(ctx, s, w, size, weight = 700) {
  ctx.font = `${weight} ${size}px system-ui, -apple-system, sans-serif`;
  const out = [];
  let line = "";
  for (const word of s.split(" ")) {
    const t = line ? line + " " + word : word;
    if (ctx.measureText(t).width > w && line) (out.push(line), (line = word));
    else line = t;
  }
  line && out.push(line);
  return out;
}

/**
 * The one highlight (Brian, 2026-11-26: the dashed gold line, no glow, no ring, no arrow): a dashed line round box `b`,
 * `pad` outside it, with the goal outline's own width, dash and colour (outline.js OUTLINE, which the shared drawing
 * owns) and its gentle pulse (bridge.js drawGoalOutline). Returns the box it went round.
 */
export function markBox(ctx, b, t, pad = 6) {
  const box = { x0: b.x0 - pad, y0: b.y0 - pad, x1: b.x1 + pad, y1: b.y1 + pad };
  ctx.save();
  ctx.globalAlpha = 0.85 + 0.15 * Math.sin((t || 0) * 4);
  ctx.setLineDash([OUTLINE.dash, OUTLINE.dash * 0.7]);
  ctx.lineWidth = OUTLINE.width;
  ctx.strokeStyle = OUTLINE.color;
  ctx.strokeRect(box.x0, box.y0, box.x1 - box.x0, box.y1 - box.y0);
  ctx.restore();
  return box;
}

/** Squatch's paw print: a pad and four toes, his fur colour, its middle at (x, y), `r` its size. */
export function drawPawPrint(ctx, x, y, r, color = ES_FUR) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y + r * 0.25, r * 0.62, r * 0.5, 0, 0, ES_TAU);
  ctx.fill();
  for (const [dx, dy] of [
    [-0.62, -0.42],
    [-0.22, -0.72],
    [0.22, -0.72],
    [0.62, -0.42],
  ]) {
    ctx.beginPath();
    ctx.ellipse(x + dx * r, y + dy * r, r * 0.2, r * 0.25, 0, 0, ES_TAU);
    ctx.fill();
  }
  ctx.restore();
}

/**
 * The big pink order sheet, `w` wide with its top left at (x, y): a header bar, the ORDER MORE ROBOTS box with
 * Squatch's paw print pressed in it (beat 42), grey form lines, and in its bottom corner the office code written by
 * hand beside a little drawing of a door with a keypad. `glowCode` lights the code. Returns where the code and the
 * paw print are.
 */
export function drawPinkSheet(ctx, x, y, w, { glowCode = false, t = 0, paw = true, text = true } = {}) {
  const u = w / 100,
    h = 130 * u;
  ctx.save();
  ctx.translate(x, y);
  esRect(ctx, 0, 0, w, h, 3 * u);
  esPaint(ctx, ES_PINK, Math.max(2, 1.4 * u));
  ctx.fillStyle = ES_PINK_DARK;
  ctx.fillRect(0, 0, w, 9 * u);
  // the ORDER MORE ROBOTS line: its box, with the paw print in it
  const box = { x: 8 * u, y: 16 * u, s: 22 * u };
  esRect(ctx, box.x, box.y, box.s, box.s, 2 * u);
  esPaint(ctx, ES_PAPER, Math.max(2, 1.2 * u));
  paw && drawPawPrint(ctx, box.x + box.s / 2, box.y + box.s / 2 + u, 8.5 * u);
  const order = escapeWords("sheet-order");
  let fit = 10 * u;
  ctx.font = `900 ${fit}px system-ui, -apple-system, sans-serif`;
  const room = w - 40 * u,
    wide = ctx.measureText(order).width;
  wide > room && (fit *= room / wide);
  text ? esWords(ctx, order, 34 * u, box.y + box.s / 2, fit, ES_INK, "left", 900) : ((ctx.fillStyle = "rgba(30,36,48,.55)"), ctx.fillRect(34 * u, box.y + box.s / 2 - 2 * u, w - 44 * u, 4 * u));
  // grey form lines
  ctx.strokeStyle = "rgba(30,36,48,.35)";
  ctx.lineWidth = Math.max(1.5, 1.1 * u);
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(8 * u, 52 * u + i * 12 * u);
    ctx.lineTo(w - 8 * u - (i === 3 ? 30 * u : 0), 52 * u + i * 12 * u);
    ctx.stroke();
  }
  // the code in the corner, and the little door with its keypad drawn beside it
  const code = { x: 66 * u, y: 114 * u, size: 11 * u }; // (in pen: six digits fit between the door drawing and the edge)
  glowCode && markBox(ctx, { x0: 34 * u, y0: 102 * u, x1: 96 * u, y1: 126 * u }, t);
  // written by hand in pen (pen-digits.js; Brian 2026-11-26), so it reads as someone wrote it there
  let pen = null;
  text ? ((pen = drawPenDigits(ctx, OFFICE_CODE, code.x, code.y, code.size, "#1d3fa8")), drawnWords.add("pen:" + OFFICE_CODE)) : ((ctx.fillStyle = "#2b3a67"), ctx.fillRect(code.x - 22 * u, code.y - 3 * u, 44 * u, 6 * u));
  esRect(ctx, 10 * u, 100 * u, 14 * u, 24 * u, u);
  esPaint(ctx, "#8b93a7", Math.max(1.5, u));
  esRect(ctx, 26 * u, 110 * u, 5 * u, 8 * u, u * 0.6);
  esPaint(ctx, "#59657d", Math.max(1, u * 0.7));
  ctx.restore();
  const inSheet = pen && pen.box.x0 > 32 * u && pen.box.x1 < w - 2 * u; // (clear of the door drawing and the sheet's edge)
  return { code: { x: x + code.x, y: y + code.y, size: code.size, pen: !!pen, inSheet }, paw: { x: x + box.x + box.s / 2, y: y + box.y + box.s / 2 }, box: { x0: x, y0: y, x1: x + w, y1: y + h } };
}

/** A small folded pink slip (in a paw, or in Mops's mouth): `k` its size (1 is 24 x 30 game pixels). */
export function drawSlipSmall(ctx, x, y, k = 1, a = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(a);
  esRect(ctx, -12 * k, -15 * k, 24 * k, 30 * k, 2 * k);
  esPaint(ctx, ES_PINK, 2);
  ctx.fillStyle = ES_PINK_DARK;
  ctx.fillRect(-12 * k, -15 * k, 24 * k, 4 * k);
  ctx.restore();
}

/**
 * The pancake brochure (beat 38) pinned on the home wall: PANCAKES over the smiling Sasquatch couple behind a counter.
 * PANCAKES was the brochure's word in the game before (14-ch1-day2.js).
 */
export function drawBrochure(ctx, b) {
  const w = b.x1 - b.x0,
    h = b.y1 - b.y0;
  esRect(ctx, b.x0, b.y0, w, h, 4);
  esPaint(ctx, ES_PAPER, 3);
  ctx.fillStyle = "#b45309";
  ctx.fillRect(b.x0 + 3, b.y0 + 3, w - 6, h * 0.22);
  // the couple: two big furry heads and the counter in front
  const cx = (b.x0 + b.x1) / 2,
    cy = b.y0 + h * 0.62,
    s = w / 100;
  for (const [ox, col] of [
    [-20, "#6b4428"],
    [20, "#7a5233"],
  ]) {
    ctx.beginPath();
    ctx.ellipse(cx + ox * s, cy - 6 * s, 17 * s, 16 * s, 0, 0, ES_TAU);
    esPaint(ctx, col, 2);
    for (const ex of [-6, 6]) (ctx.beginPath(), ctx.arc(cx + (ox + ex) * s, cy - 9 * s, 2.4 * s, 0, ES_TAU), esPaint(ctx, ES_INK));
    ctx.beginPath();
    ctx.arc(cx + ox * s, cy - 2 * s, 5 * s, 0.2, Math.PI - 0.2);
    ctx.strokeStyle = ES_INK;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  esRect(ctx, b.x0 + 8, cy + 8 * s, w - 16, 14 * s, 3);
  esPaint(ctx, "#ffe08a", 2);
  // a red pin
  ctx.beginPath();
  ctx.arc(cx, b.y0 + 2, 5, 0, ES_TAU);
  esPaint(ctx, ES_RED, 2);
}

// ---------- the wordless thought pictures (beats 45 and 46) ----------
/** Mops's plan: the Moon Pie crate, Squatch's and Mops's eyes peeking out, riding up a ramp into the ship. */
export function thinkCrateShip(ctx, head, a = 1) {
  return drawThought(
    ctx,
    head,
    a,
    (c, cx, cy) => {
      // the ship on the right
      c.save();
      esRect(c, cx + 10, cy - 40, 92, 60, 26);
      esPaint(c, "#c5ccd8", 3);
      for (const k of [0, 1]) (c.beginPath(), c.arc(cx + 36 + k * 30, cy - 14, 8, 0, ES_TAU), esPaint(c, "#78b4ea", 2));
      // the crate on the left, two pairs of eyes in its gap
      drawCrate(c, cx - 44, cy + 34, 0.36, { words: false });
      for (const [ex, col] of [
        [-58, "#ffffff"],
        [-32, "#ffffff"],
      ]) {
        for (const d of [-4, 4]) (c.beginPath(), c.arc(cx + ex + d, cy - 2, 3.4, 0, ES_TAU), esPaint(c, col, 1.5));
      }
      // an arrow from the crate to the ship
      c.beginPath();
      c.moveTo(cx - 6, cy + 4);
      c.lineTo(cx + 18, cy - 6);
      c.strokeStyle = ES_RED;
      c.lineWidth = 4;
      c.stroke();
      c.restore();
    },
    { w: 240, h: 150 },
  );
}
/** The office door, shut, with its keypad and a red padlock: they need the code. */
export function thinkLockedDoor(ctx, head, a = 1) {
  return drawThought(
    ctx,
    head,
    a,
    (c, cx, cy) => {
      esRect(c, cx - 34, cy - 46, 52, 86, 3);
      esPaint(c, "#8b93a7", 3);
      c.beginPath();
      c.moveTo(cx - 8, cy - 42);
      c.lineTo(cx - 8, cy + 36);
      c.strokeStyle = "#2b3a67";
      c.lineWidth = 2;
      c.stroke();
      esRect(c, cx + 28, cy - 4, 18, 26, 3);
      esPaint(c, "#59657d", 2);
      for (const [dx, dy] of [
        [33, 3],
        [41, 3],
        [33, 12],
        [41, 12],
      ])
        (c.beginPath(), c.arc(cx + dx, cy + dy, 2, 0, ES_TAU), (c.fillStyle = "#8fdcff"), c.fill());
      // the padlock
      c.beginPath();
      c.arc(cx - 8, cy - 6, 9, Math.PI, 0);
      c.strokeStyle = ES_INK;
      c.lineWidth = 4;
      c.stroke();
      esRect(c, cx - 20, cy - 6, 24, 20, 3);
      esPaint(c, ES_RED, 3);
    },
    { w: 200, h: 140 },
  );
}
/** The pink sheet, its code in the corner, flying into the big wall vent (what he remembers from night one). */
export function thinkSlipVent(ctx, head, a = 1, t = 0) {
  return drawThought(
    ctx,
    head,
    a,
    (c, cx, cy) => {
      // the vent grille on the right
      esRect(c, cx + 24, cy - 34, 64, 50, 4);
      esPaint(c, "#59657d", 3);
      for (let i = 0; i < 5; i++) (c.fillStyle = "#1e2430"), c.fillRect(cx + 30, cy - 28 + i * 9, 52, 4);
      // the sheet on its way in, with swirls behind it
      const k = (t * 0.6) % 1;
      drawPinkSheet(c, cx - 80 + k * 70, cy - 30 + k * 10, 56, { text: false }); // (no words: this picture plays by itself)
      c.strokeStyle = "rgba(52,120,246,.7)";
      c.lineWidth = 3;
      for (const r of [16, 26]) (c.beginPath(), c.arc(cx + 56, cy - 9, r, 2.4, 4.2), c.stroke());
    },
    { w: 230, h: 150 },
  );
}

// ---------- the loading bay ----------
/** The big wall vent's grille swung open: the dark hole behind it, the grille hanging down on its hinge. */
export function drawOpenVent(ctx, v) {
  esRect(ctx, v.x0 + 6, v.y0 + 6, v.x1 - v.x0 - 12, v.y1 - v.y0 - 10, 4);
  esPaint(ctx, "#15181f", 3);
  ctx.save();
  ctx.translate(v.x0 + 6, v.y1 - 2);
  ctx.rotate(0.25);
  esRect(ctx, -6, 0, v.x1 - v.x0 - 12, 18, 3);
  esPaint(ctx, "#8a93a3", 3);
  ctx.restore();
}
/** A "!" over a robot that has seen him (robots show "!" at once: DECISIONS 2026-11-22, sight cones). */
export function drawBang(ctx, x, y, size = 34) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, size * 0.62, 0, ES_TAU);
  esPaint(ctx, ES_GOLD, 4);
  esWords(ctx, "!", x, y + 1, size, ES_RED, "center", 900);
  ctx.restore();
}

// ---------- inside the vent (beat 48; no locked picture: placeholder) ----------
function planet(ctx, x, y, r, col, ring) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, ES_TAU);
  esPaint(ctx, col, 3);
  if (ring) {
    ctx.beginPath();
    ctx.ellipse(x, y, r * 1.7, r * 0.4, -0.3, 0, ES_TAU);
    ctx.strokeStyle = ES_INK;
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }
}
function crossOut(ctx, x, y, r) {
  ctx.save();
  ctx.strokeStyle = ES_RED;
  ctx.lineWidth = Math.max(4, r * 0.22);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x - r, y - r);
  ctx.lineTo(x + r, y + r);
  ctx.moveTo(x + r, y - r);
  ctx.lineTo(x - r, y + r);
  ctx.stroke();
  ctx.restore();
}
function pin(ctx, x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, ES_TAU);
  esPaint(ctx, ES_RED, 1.5);
}
function string(ctx, pts) {
  ctx.save();
  ctx.strokeStyle = "#d63b2a";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (const p of pts.slice(1)) ctx.lineTo(p[0], p[1]);
  ctx.stroke();
  ctx.restore();
}
/** A grown-up furry Sasquatch's head and shoulders, the shape on the HAVE YOU SEEN? flyers. */
function sasquatchShape(ctx, x, y, s) {
  ctx.beginPath();
  ctx.ellipse(x, y + 16 * s, 20 * s, 14 * s, 0, Math.PI, 0);
  ctx.lineTo(x + 20 * s, y + 22 * s);
  ctx.lineTo(x - 20 * s, y + 22 * s);
  ctx.closePath();
  esPaint(ctx, ES_FUR, 2);
  ctx.beginPath();
  ctx.ellipse(x, y, 11 * s, 12 * s, 0, 0, ES_TAU);
  esPaint(ctx, ES_FUR, 2);
  for (const d of [-4, 4]) (ctx.beginPath(), ctx.arc(x + d * s, y - 1 * s, 1.6 * s, 0, ES_TAU), (ctx.fillStyle = "#fff"), ctx.fill());
}
function flyer(ctx, x, y, w, size) {
  esRect(ctx, x, y, w, w * 1.2, 3);
  esPaint(ctx, ES_PAPER, 2.5);
  esWords(ctx, escapeWords("flyer"), x + w / 2, y + size * 0.9, size, ES_RED, "center", 900);
  sasquatchShape(ctx, x + w / 2, y + w * 0.62, w / 70);
  pin(ctx, x + w / 2, y + 4);
}
/** The baby photo: tiny Squatch in a Moon Pie crate, in a white frame. */
function babyPhoto(ctx, x, y, w) {
  esRect(ctx, x, y, w, w * 0.8, 3);
  esPaint(ctx, ES_PAPER, 2.5);
  esRect(ctx, x + 6, y + 6, w - 12, w * 0.8 - 18, 2);
  esPaint(ctx, "#cfe8ff", 1.5);
  esRect(ctx, x + w * 0.22, y + w * 0.44, w * 0.56, w * 0.26, 2);
  esPaint(ctx, "#d9a35b", 2);
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + w * 0.4, w * 0.15, w * 0.13, 0, 0, ES_TAU);
  esPaint(ctx, ES_FUR, 2);
  pin(ctx, x + w / 2, y + 4);
}
/** The reply letter, small on the wall, with its huge red NO stamp. */
function letterSmall(ctx, x, y, w) {
  esRect(ctx, x, y, w, w * 1.25, 3);
  esPaint(ctx, ES_PAPER, 2.5);
  ctx.strokeStyle = "rgba(30,36,48,.4)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 6; i++) (ctx.beginPath(), ctx.moveTo(x + 8, y + 16 + i * 12), ctx.lineTo(x + w - 8, y + 16 + i * 12), ctx.stroke());
  stampNo(ctx, x + w / 2, y + w * 0.78, w * 0.42);
  pin(ctx, x + w / 2, y + 4);
}
function stampNo(ctx, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.28);
  ctx.strokeStyle = "rgba(214,40,40,.9)";
  ctx.lineWidth = Math.max(3, size * 0.1);
  esRect(ctx, -size * 0.95, -size * 0.55, size * 1.9, size * 1.1, size * 0.12);
  ctx.stroke();
  esWords(ctx, escapeWords("label-no"), 0, size * 0.04, size * 0.9, "rgba(214,40,40,.95)", "center", 900);
  ctx.restore();
}
/** The IDEAS FOR GUARDIANS board: its title over small notes nobody can read (S#586). */
function ideasBoard(ctx, b, size = 22) {
  esRect(ctx, b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0, 6);
  esPaint(ctx, "#c9a36b", 4);
  esWords(ctx, escapeWords("board"), (b.x0 + b.x1) / 2, b.y0 + size * 0.95, size, ES_INK, "center", 900);
  const cols = 4,
    w = (b.x1 - b.x0 - 30) / cols;
  for (let i = 0; i < 8; i++) {
    const x = b.x0 + 15 + (i % cols) * w + 4,
      y = b.y0 + size * 1.9 + Math.floor(i / cols) * ((b.y1 - b.y0 - size * 2) / 2.1);
    esRect(ctx, x, y, w - 10, (b.y1 - b.y0 - size * 2.6) / 2.2, 2);
    esPaint(ctx, i % 3 ? ES_CREAM : ES_PAPER, 2);
    ctx.strokeStyle = "rgba(89,101,125,.6)";
    ctx.lineWidth = 2;
    for (let k = 0; k < 2; k++) (ctx.beginPath(), ctx.moveTo(x + 6, y + 10 + k * 9), ctx.lineTo(x + w - 18, y + 10 + k * 9), ctx.stroke());
  }
}
/**
 * The detective wall, inside box `b`: red strings between pinned planets (crossed off), the HAVE YOU SEEN? flyers,
 * the baby photo in the middle, and Mars crossed off with the reply letter stamped NO pinned beside it. `big` draws
 * its words for the close-up. Returns where Mars and the letter are.
 */
function detectiveWall(ctx, b, big) {
  const w = b.x1 - b.x0,
    h = b.y1 - b.y0,
    X = (k) => b.x0 + w * k,
    Y = (k) => b.y0 + h * k,
    s = w / 380;
  esRect(ctx, b.x0, b.y0, w, h, 6);
  esPaint(ctx, "#b98a54", 4);
  const photo = { x: X(0.4), y: Y(0.36) },
    mars = { x: X(0.7), y: Y(0.3), r: 26 * s },
    sat = { x: X(0.14), y: Y(0.25), r: 18 * s },
    nep = { x: X(0.17), y: Y(0.72), r: 16 * s },
    ura = { x: X(0.5), y: Y(0.84), r: 14 * s };
  // strings from the baby photo to every place he searched
  for (const p of [mars, sat, nep, ura]) string(ctx, [[photo.x + 30 * s, photo.y + 20 * s], [p.x, p.y]]);
  string(ctx, [[X(0.28), Y(0.16)], [photo.x + 30 * s, photo.y + 20 * s]]);
  planet(ctx, sat.x, sat.y, sat.r, "#e8c27a", true);
  planet(ctx, nep.x, nep.y, nep.r, "#5b8def");
  planet(ctx, ura.x, ura.y, ura.r, "#8fdcd0");
  planet(ctx, mars.x, mars.y, mars.r, "#d9653b");
  for (const p of [sat, nep, ura, mars]) crossOut(ctx, p.x, p.y, p.r * 1.05);
  esWords(ctx, escapeWords("label-mars"), mars.x, mars.y + mars.r + (big ? 26 : 12) * s, (big ? 32 : 13) * s, ES_INK, "center", 900);
  babyPhoto(ctx, photo.x, photo.y, 60 * s);
  flyer(ctx, X(0.22), Y(0.04), 80 * s, 9 * s);
  flyer(ctx, X(0.6), Y(0.6), 80 * s, 9 * s);
  const letter = { x: X(0.82), y: Y(0.08), w: 56 * s };
  letterSmall(ctx, letter.x, letter.y, letter.w);
  string(ctx, [[mars.x + mars.r, mars.y], [letter.x, letter.y + 20 * s]]);
  return { mars, letter };
}
/** The TOYS bin: a box of old baby toys (a rattle, a ball, a block) with its label. */
function toysBin(ctx, b, size = 22) {
  const w = b.x1 - b.x0;
  ctx.beginPath();
  ctx.arc(b.x0 + w * 0.3, b.y0 + 4, 16, 0, ES_TAU);
  esPaint(ctx, "#ff8fb8", 3);
  esRect(ctx, b.x0 + w * 0.55, b.y0 - 18, 28, 28, 3);
  esPaint(ctx, "#8fdcff", 3);
  esRect(ctx, b.x0, b.y0 + 10, w, b.y1 - b.y0 - 10, 6);
  esPaint(ctx, "#3478f6", 4);
  esWords(ctx, escapeWords("label-toys"), b.x0 + w / 2, (b.y0 + b.y1) / 2 + 6, size, "#ffffff", "center", 900);
}

/**
 * The inside of the big vent: a cramped metal room. The grille on the left (Squatch rolled up behind it, only his eyes
 * between the slats), the IDEAS FOR GUARDIANS board and the detective wall on the back wall, a lamp, the desk on the
 * right with the pink sheet on its left end, the TOYS bin. Mops is drawn by the caller (behind the desk's front).
 * `glowSlip` lights the sheet. Returns what it drew.
 */
export function drawVentRoom(ctx, t, { slip = "desk", glowSlip = false, eyes = true } = {}) {
  const V = VENT_ROOM;
  // the metal walls and floor
  ctx.fillStyle = "#c3c9d4";
  ctx.fillRect(0, 0, 960, 640);
  ctx.fillStyle = "#aab1be";
  ctx.fillRect(0, 470, 960, 170);
  ctx.strokeStyle = "rgba(30,36,48,.25)";
  ctx.lineWidth = 3;
  for (let x = 0; x < 960; x += 120) (ctx.beginPath(), ctx.moveTo(x, 0), ctx.lineTo(x, 470), ctx.stroke());
  ctx.beginPath();
  ctx.moveTo(0, 470);
  ctx.lineTo(960, 470);
  ctx.stroke();
  // the grille, and the dark bay behind it with Squatch's eyes between its slats
  const g = V.grille;
  esRect(ctx, g.x0, g.y0, g.x1 - g.x0, g.y1 - g.y0, 6);
  esPaint(ctx, "#1b1f29", 5);
  if (eyes)
    for (const d of [-14, 14]) {
      ctx.beginPath();
      ctx.ellipse(V.eyes.x + d, V.eyes.y, 9, 11, 0, 0, ES_TAU);
      esPaint(ctx, "#ffffff", 2.5);
      ctx.beginPath();
      ctx.arc(V.eyes.x + d + 2, V.eyes.y + 2, 4.5, 0, ES_TAU);
      esPaint(ctx, ES_INK);
    }
  ctx.fillStyle = "#8a93a3";
  for (let y = g.y0 + 14; y < g.y1 - 8; y += 34) ctx.fillRect(g.x0 + 6, y, g.x1 - g.x0 - 12, 12);
  ideasBoard(ctx, V.board);
  detectiveWall(ctx, V.wall, false);
  // a lamp on the desk, its light on the paper
  const d = V.desk;
  ctx.save();
  ctx.fillStyle = "rgba(255,240,170,.45)";
  ctx.beginPath();
  ctx.moveTo(d.x1 - 90, d.y0 - 120);
  ctx.lineTo(d.x0 + 60, d.y0);
  ctx.lineTo(d.x1 - 20, d.y0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  esRect(ctx, d.x1 - 110, d.y0 - 140, 50, 26, 8);
  esPaint(ctx, "#3478f6", 3);
  ctx.beginPath();
  ctx.moveTo(d.x1 - 85, d.y0 - 114);
  ctx.lineTo(d.x1 - 70, d.y0);
  ctx.strokeStyle = ES_INK;
  ctx.lineWidth = 4;
  ctx.stroke();
  toysBin(ctx, V.toys);
  return { slip, glowSlip };
}
/** The desk's front, over Mops's legs; and the sheet on its left end (lit when `glowSlip`). */
export function drawVentDesk(ctx, t, { slip = "desk", glowSlip = false } = {}) {
  const V = VENT_ROOM,
    d = V.desk;
  esRect(ctx, d.x0, d.y0, d.x1 - d.x0, 22, 4);
  esPaint(ctx, "#c4a574", 4);
  for (const lx of [d.x0 + 16, d.x1 - 34]) (esRect(ctx, lx, d.y0 + 20, 18, 150, 3), esPaint(ctx, "#8a7560", 3));
  // the stack of note paper and a pencil on the right of the desk
  esRect(ctx, d.x1 - 150, d.y0 - 10, 80, 12, 2);
  esPaint(ctx, ES_CREAM, 2);
  let sheet = null;
  if (slip === "desk") {
    glowSlip && markBox(ctx, { x0: V.slip.x - 60, y0: V.slip.y - 50, x1: V.slip.x + 60, y1: V.slip.y + 10 }, t);
    // lying on the desk top (seen from the front, so it is drawn flattened), the paw print side up
    ctx.save();
    ctx.translate(V.slip.x, V.slip.y);
    ctx.scale(1, 0.42);
    ctx.rotate(-0.1);
    sheet = drawPinkSheet(ctx, -55, -130, 110);
    ctx.restore();
  }
  return { sheet: !!sheet };
}

// ---------- the close-ups that fill the screen (cutaway.js PANELS; each waits for NEXT: they have words) ----------
// The detective wall, big: Mars crossed off, the reply letter stamped NO beside it, the flyers, the strings.
function wallPanel(ctx) {
  ctx.fillStyle = "#c3c9d4";
  ctx.fillRect(0, 0, 960, 640);
  const drew = detectiveWall(ctx, { x0: 30, y0: 30, x1: 930, y1: 610 }, true);
  return { pic: "eswall", words: [escapeWords("label-mars"), escapeWords("flyer"), escapeWords("label-no")], mars: drew.mars };
}
// The reply letter from Mars, big enough to read on a phone, with its huge red NO stamp.
function letterPanel(ctx) {
  ctx.fillStyle = "#b98a54";
  ctx.fillRect(0, 0, 960, 640);
  esRect(ctx, 110, 30, 740, 580, 8);
  esPaint(ctx, ES_PAPER, 5);
  pin(ctx, 480, 44);
  const [head, ...rest] = escapeWords("letter").split(". ");
  esWords(ctx, head + ".", 480, 110, 50, ES_INK, "center", 900);
  let y = 200;
  const lines = [];
  for (const s of rest) for (const l of esWrap(ctx, s.endsWith(".") ? s : s + ".", 660, 38)) (lines.push(l), esWords(ctx, l, 160, y, 38, ES_INK, "left", 700), (y += 56));
  stampNo(ctx, 700, 520, 120);
  return { pic: "esletter", head, lines, size: 38 };
}
// Mops writes the new Guardian note at his desk: his hoof with the pencil, the words coming as he writes them, his
// white beard hanging in from above, and one long white hair left on the note (like the gift note's).
function notePanel(ctx, t) {
  ctx.fillStyle = "#c4a574";
  ctx.fillRect(0, 0, 960, 640);
  ideasBoard(ctx, { x0: 60, y0: 10, x1: 520, y1: 150 }, 26);
  esRect(ctx, 120, 170, 720, 420, 8);
  esPaint(ctx, ES_CREAM, 5);
  const text = escapeWords("note"),
    sign = escapeWords("note-sign"),
    k = esClamp(t / 3.2),
    shown = text.slice(0, Math.round(text.length * k));
  const lines = esWrap(ctx, text, 640, 40);
  let left = shown.length,
    y = 250,
    end = { x: 160, y: 250 };
  ctx.save();
  for (const l of lines) {
    const part = l.slice(0, Math.max(0, left));
    left -= l.length + 1;
    if (part) {
      esWords(ctx, part, 160, y, 40, "#2b3a67", "left", 700);
      end = { x: 160 + ctx.measureText(part).width, y };
    }
    y += 62;
  }
  ctx.restore();
  const signed = t >= 3.4;
  signed && esWords(ctx, sign, 800, y + 20, 38, "#2b3a67", "right", 700);
  // the hair, once the note is written
  if (signed) {
    ctx.save();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(300, 540);
    ctx.bezierCurveTo(420, 500, 520, 590, 700, 530);
    ctx.stroke();
    ctx.strokeStyle = "rgba(30,36,48,.35)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }
  // his white beard hanging in from the top right
  ctx.beginPath();
  ctx.moveTo(760, -10);
  ctx.quadraticCurveTo(700, 120, 760, 200);
  ctx.quadraticCurveTo(800, 150, 830, 200);
  ctx.quadraticCurveTo(880, 120, 900, -10);
  ctx.closePath();
  esPaint(ctx, "#f4f5f8", 4);
  // his hoof and the pencil, at the end of the words (resting on the paper once signed)
  const hx = signed ? 860 : Math.min(840, end.x + 30),
    hy = signed ? 470 : end.y - 10;
  ctx.save();
  ctx.translate(hx, hy);
  ctx.rotate(0.5);
  esRect(ctx, -6, -70, 12, 80, 3);
  esPaint(ctx, ES_GOLD, 3);
  ctx.beginPath();
  ctx.moveTo(-6, 10);
  ctx.lineTo(0, 24);
  ctx.lineTo(6, 10);
  esPaint(ctx, "#f2d3a4", 2);
  ctx.restore();
  ctx.beginPath();
  ctx.ellipse(hx + 34, hy - 34, 30, 26, 0.4, 0, ES_TAU);
  esPaint(ctx, "#4a505c", 4);
  ctx.beginPath();
  ctx.moveTo(hx + 44, hy - 58);
  ctx.lineTo(hx + 110, hy - 140);
  ctx.lineTo(hx + 150, hy - 110);
  ctx.lineTo(hx + 62, hy - 28);
  ctx.closePath();
  esPaint(ctx, "#ffffff", 4);
  return { pic: "esnote", shown, signed, size: 40, hair: signed };
}
// The pink sheet in Squatch's paw, close (beat 50): the paw print in the ORDER MORE ROBOTS box, and the office code in
// its corner, lit, beside the little door with its keypad.
function slipPanel(ctx, t) {
  ctx.fillStyle = "#e8e3d6";
  ctx.fillRect(0, 0, 960, 640);
  const s = drawPinkSheet(ctx, 250, 40, 440, { glowCode: true, t });
  furryArm(ctx, { x: 270, y: 560 }, { x: 60, y: 760 });
  return { pic: "esslip", code: OFFICE_CODE, codeSize: s.code.size, codeAt: s.code, paw: s.paw };
}
// The Guardian Box close-up (the home morning's box view: the lid with MY GARDIAN BOX, the older notes, the rocket,
// the crayon drawing MY GUARDIANS): his paw slides the pink slip in under the notes, and it is gone from sight.
function boxPanel(ctx, t) {
  const C = BOX_CLOSEUP,
    B = C.box,
    w = B.x1 - B.x0,
    h = B.y1 - B.y0,
    cx = (B.x0 + B.x1) / 2,
    rim = 46;
  ctx.fillStyle = "#f4f1ea";
  ctx.fillRect(0, 0, 960, 640);
  ctx.fillStyle = "#ebe6da";
  ctx.fillRect(0, C.floor, 960, 640 - C.floor);
  const lid = C.lid;
  ctx.beginPath();
  ctx.moveTo(lid.x0 + 24, lid.y0);
  ctx.lineTo(lid.x1, lid.y0 + 16);
  ctx.lineTo(lid.x1 - 6, lid.y1);
  ctx.lineTo(lid.x0, lid.y1 - 8);
  ctx.closePath();
  esPaint(ctx, GUARDIAN_BOX.fill, 5);
  const lmid = (lid.x0 + lid.x1) / 2 + 4,
    lab = { x0: lmid - 90, x1: lmid + 90, y0: lid.y0 + 56, y1: lid.y0 + 156 };
  esRect(ctx, lab.x0, lab.y0, lab.x1 - lab.x0, lab.y1 - lab.y0, 4);
  esPaint(ctx, ES_PAPER, 3);
  const sign = morningWords("sign-box").split(" ");
  esWords(ctx, sign.slice(0, 2).join(" "), lmid, lab.y0 + 32, 26, ES_INK, "center", 900);
  esWords(ctx, sign.slice(2).join(" "), lmid, lab.y0 + 68, 26, ES_INK, "center", 900);
  ctx.beginPath();
  ctx.moveTo(B.x0, B.y0);
  ctx.lineTo(B.x0 + 26, B.y0 - rim);
  ctx.lineTo(B.x1 - 26, B.y0 - rim);
  ctx.lineTo(B.x1, B.y0);
  ctx.closePath();
  esPaint(ctx, "#1b3f86", 5);
  // the slip: held over the box, then pushed down in among the notes, under them
  const k = esClamp((t - 0.6) / 0.8),
    sy = B.y0 - rim - 70 + k * 190,
    sx = cx - 10;
  k < 1 && drawSlipSmall(ctx, sx, sy, 4.2, -0.1);
  // the older notes (the gift's rocket among them), in front of the slip once it is under them
  const notes = [
    [cx - 100, B.y0 + 30, 150, 140, -0.12],
    [cx + 10, B.y0 + 30, 160, 156, 0.05],
    [cx + 105, B.y0 + 30, 130, 130, 0.16],
  ];
  for (const n of notes) oldNote(ctx, ...n);
  drawRocket(ctx, cx + 120, B.y0 + 90, { k: w / MORNING_SIZES.box.w, a: 0.2, tag: false, lw: 5 });
  k >= 1 && drawSlipSmall(ctx, sx + 6, B.y0 + 4, 4.2, 0.08); // just its top edge shows under the notes
  esRect(ctx, B.x0, B.y0, w, h, 14);
  esPaint(ctx, GUARDIAN_BOX.fill, 6);
  esWords(ctx, "G", cx, B.y0 + h / 2 + 6, Math.round(h * 0.55), "#ffffff", "center", 900);
  const D = C.drawing,
    title = morningWords("sign-drawing");
  drawGuardiansCrayon(ctx, D.x, D.y, D.w, { tilt: D.tilt, title: (x, y, size) => esWords(ctx, title, x, y, size, ES_RED, "center", 900) });
  const paw = { x: sx + 10, y: k < 1 ? sy - 40 : B.y0 - 120 - (t - 1.4) * 80 };
  furryArm(ctx, paw, { x: paw.x + 140, y: -80 });
  return { pic: "esbox", tucked: k >= 1, label: sign.join(" "), title };
}
export const ESCAPE_PANELS = Object.freeze({ eswall: [wallPanel], esletter: [letterPanel], esnote: [notePanel], esslip: [slipPanel], esbox: [boxPanel] });

// ---------- close-ups drawn over the room (the keypad, the Moon Pie site, the snack counter) ----------
/** The room behind a close-up: blurred and darkened, as in the cut-in recipe (docs/CUT-IN-SPEC.md). */
export function blurBehind(ctx) {
  ctx.save();
  ctx.filter = "blur(6px)";
  ctx.drawImage(ctx.canvas, 0, 0, ctx.canvas.width, ctx.canvas.height, 0, 0, 960, 640);
  ctx.restore();
  ctx.fillStyle = "rgba(12,16,28,.45)";
  ctx.fillRect(0, 0, 960, 640);
}
/**
 * The keypad close-up (beat 50): the pink slip on the left, its code lit, and the office door's keypad on the right,
 * big: a screen with four boxes, and ten keys. `typed` the digits typed; `buzz` (0 to 1) the red buzz of a wrong try;
 * `ok` the green of the right code. Returns the keys' places.
 */
export function drawKeypad(ctx, { typed = "", buzz = 0, ok = false, t = 0 } = {}) {
  const K = KEYPAD;
  const s = K.slip;
  ctx.save();
  ctx.translate(s.x0, s.y0);
  ctx.rotate(-0.04);
  drawPinkSheet(ctx, 0, 0, s.x1 - s.x0, { glowCode: !ok, t });
  ctx.restore();
  const p = K.pad;
  esRect(ctx, p.x0, p.y0, p.x1 - p.x0, p.y1 - p.y0, 22);
  esPaint(ctx, "#59657d", 6);
  const sc = K.screen,
    shake = buzz > 0 ? Math.sin(buzz * 40) * 8 * buzz : 0;
  esRect(ctx, sc.x0 + shake, sc.y0, sc.x1 - sc.x0, sc.y1 - sc.y0, 10);
  esPaint(ctx, ok ? "#1f7a4a" : buzz > 0 ? "#8a1f1f" : "#1e2430", 4);
  const n = OFFICE_CODE.length,
    slot = (sc.x1 - sc.x0 - 24) / n;
  for (let i = 0; i < n; i++) {
    const bx = sc.x0 + 12 + i * slot + shake;
    esRect(ctx, bx + 3, sc.y0 + 12, slot - 6, sc.y1 - sc.y0 - 24, 6);
    esPaint(ctx, "rgba(255,255,255,.12)", 2, "#8fdcff");
    typed[i] && esWords(ctx, typed[i], bx + slot / 2, (sc.y0 + sc.y1) / 2, 42, ok ? "#c8ffd9" : "#8fdcff", "center", 900);
  }
  const keys = {};
  for (const d of ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]) {
    const k = keyAt(d);
    ctx.beginPath();
    ctx.arc(k.x, k.y, K.r, 0, ES_TAU);
    esPaint(ctx, ES_PAPER, 5);
    esWords(ctx, d, k.x, k.y + 2, 48, ES_INK, "center", 900);
    keys[d] = { x: k.x, y: k.y, r: K.r };
  }
  return { keys, typed, ok, buzz: buzz > 0 };
}
/** The open office door over the hallway's locked door: the dark room through it. */
export function drawDoorOpen(ctx) {
  const d = HALLWAY.door;
  esRect(ctx, d.x0 + 4, d.y0 + 4, d.x1 - d.x0 - 8, d.y1 - d.y0 - 4, 3);
  esPaint(ctx, "#22252e", 3);
  ctx.beginPath();
  ctx.moveTo(d.x0 + 4, d.y0 + 4);
  ctx.lineTo(d.x0 - 26, d.y0 + 20);
  ctx.lineTo(d.x0 - 26, d.y1);
  ctx.lineTo(d.x0 + 4, d.y1);
  ctx.closePath();
  esPaint(ctx, "#8b93a7", 3);
}
/**
 * The Moon Pie site on the office computer (beat 51), close up: the MOON PIES header, a small grey "Order new box"
 * button and a big lit "Return empty crate" button. `booked` (0 to 1): after the tap, the crate rides up a ramp into
 * the ship and a big green tick comes. Returns the buttons' boxes.
 */
export function drawSite(ctx, { booked = -1, t = 0 } = {}) {
  const S = SITE,
    sc = S.screen;
  esRect(ctx, sc.x0 - 20, sc.y0 - 20, sc.x1 - sc.x0 + 40, sc.y1 - sc.y0 + 40, 18);
  esPaint(ctx, "#2d323e", 6);
  esRect(ctx, sc.x0, sc.y0, sc.x1 - sc.x0, sc.y1 - sc.y0, 8);
  esPaint(ctx, "#eaf4ff", 3);
  ctx.fillStyle = "#8b5a3c";
  ctx.fillRect(sc.x0 + 3, sc.y0 + 3, sc.x1 - sc.x0 - 6, 110);
  esWords(ctx, escapeWords("site"), (sc.x0 + sc.x1) / 2, sc.y0 + 58, 60, "#fff3d6", "center", 900);
  const o = S.order,
    r = S.ret;
  if (booked < 0) {
    esRect(ctx, o.x0, o.y0, o.x1 - o.x0, o.y1 - o.y0, 12);
    esPaint(ctx, "#dfe4ea", 3, "#8a93a3");
    esWords(ctx, escapeWords("site-order"), (o.x0 + o.x1) / 2, (o.y0 + o.y1) / 2, 30, "#59657d", "center", 700);
    markBox(ctx, r, t);
    esRect(ctx, r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0, 18);
    esPaint(ctx, "#2bc48a", 6);
    esWords(ctx, escapeWords("site-return"), (r.x0 + r.x1) / 2, (r.y0 + r.y1) / 2, 50, "#ffffff", "center", 900);
  } else {
    // booked: the crate rides up the ramp into the ship, then a big green tick
    const k = esClamp(booked / 0.7),
      cx = 260 + k * 330,
      cy = 470 - k * 150;
    ctx.beginPath();
    ctx.moveTo(220, 500);
    ctx.lineTo(640, 300);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#8a93a3";
    ctx.stroke();
    esRect(ctx, 560, 180, 240, 160, 60);
    esPaint(ctx, "#c5ccd8", 4);
    for (const kx of [0, 1, 2]) (ctx.beginPath(), ctx.arc(610 + kx * 60, 240, 18, 0, ES_TAU), esPaint(ctx, "#78b4ea", 3));
    k < 1 && drawCrate(ctx, cx, cy, 0.5, { words: false });
    if (booked > 0.9) {
      ctx.beginPath();
      ctx.arc(330, 300, 90, 0, ES_TAU);
      esPaint(ctx, "#2bc48a", 6);
      ctx.beginPath();
      ctx.moveTo(285, 300);
      ctx.lineTo(320, 340);
      ctx.lineTo(385, 260);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 16;
      ctx.lineCap = "round";
      ctx.stroke();
    }
  }
  return { order: o, ret: r, booked: booked >= 0 };
}
/** His big furry arm and paw coming up from below (for the close-ups over the room), the paw at `paw`. */
export function drawArmUp(ctx, paw) {
  furryArm(ctx, paw, { x: paw.x + 120, y: 760 });
}
/**
 * The snack counter close-up (beat 52): the counter's top with what is still on it, his bag bottom left (with a count),
 * the Guardians' plate on the right once it shows (a paper plate with a folded card, a blue G on it, like the Guardian
 * Box's), the snack on its way, and his paw. Returns where things are.
 */
export function drawSnackCounter(ctx, st, t) {
  const S = SNACKS;
  // the counter
  ctx.fillStyle = "#8b5a3c";
  ctx.fillRect(120, S.counter, 840, 640 - S.counter);
  ctx.fillStyle = "#c98a4e";
  ctx.fillRect(120, S.counter - 16, 840, 22);
  ctx.strokeStyle = ES_INK;
  ctx.lineWidth = 4;
  ctx.strokeRect(120, S.counter - 16, 840, 660 - S.counter);
  // the Guardians' plate and its card
  const P = S.plate;
  if (st.plate) {
    st.next === "plate" && markBox(ctx, { x0: P.x - P.r, y0: P.y - 60, x1: P.x + P.r, y1: P.y + 20 }, t);
    ctx.beginPath();
    ctx.ellipse(P.x, P.y, P.r, 18, 0, 0, ES_TAU);
    esPaint(ctx, "#ffffff", 4);
    esRect(ctx, P.x + 16, P.y - 82, 54, 40, 4);
    esPaint(ctx, ES_PAPER, 3);
    esWords(ctx, "G", P.x + 43, P.y - 61, 28, GUARDIAN_BOX.fill, "center", 900);
    st.onPlate.forEach((i, n) => drawSnack(ctx, S.kinds[i], P.x - 30 + n * 46, P.y - 22, 2.2));
  }
  // what is still on the counter (the one he is reaching for stays until his paw has it)
  for (let i = 0; i < S.kinds.length; i++) {
    if (st.gone[i] || (st.carry && st.carry.i === i && st.carry.k > 0.4)) continue;
    st.next && !st.carry && markBox(ctx, { x0: S.at[i].x - 40, y0: S.at[i].y - 40, x1: S.at[i].x + 40, y1: S.at[i].y + 40 }, t);
    drawSnack(ctx, S.kinds[i], S.at[i].x, S.at[i].y, 3.1, 0, 0, 2);
  }
  // the bag: its open top, and how many are in it
  const B = S.bag;
  ctx.beginPath();
  ctx.moveTo(B.x0 + 20, B.y0 + 40);
  ctx.lineTo(B.x0, B.y1);
  ctx.lineTo(B.x1, B.y1);
  ctx.lineTo(B.x1 - 20, B.y0 + 40);
  ctx.closePath();
  esPaint(ctx, "#e7d3a1", 4);
  ctx.beginPath();
  ctx.ellipse((B.x0 + B.x1) / 2, B.y0 + 40, (B.x1 - B.x0) / 2 - 20, 18, 0, 0, ES_TAU);
  esPaint(ctx, "#6b4423", 4);
  ctx.beginPath();
  ctx.arc(B.x1 - 18, B.y0 + 70, 26, 0, ES_TAU);
  esPaint(ctx, "#ffffff", 4);
  esWords(ctx, String(st.bag), B.x1 - 18, B.y0 + 71, 30, ES_INK, "center", 900);
  // his paw: resting, or carrying a snack from the counter to the bag (or the plate)
  let paw = S.rest,
    held = null;
  if (st.carry) {
    const c = st.carry,
      from = S.at[c.i],
      to = c.to === "plate" ? { x: P.x, y: P.y - 30 } : { x: (B.x0 + B.x1) / 2, y: B.y0 + 30 },
      k = c.k,
      out = k < 0.4 ? k / 0.4 : 1,
      back = k < 0.4 ? 0 : (k - 0.4) / 0.6;
    paw = k < 0.4 ? { x: S.rest.x + (from.x - S.rest.x) * out, y: S.rest.y + (from.y - S.rest.y) * out } : { x: from.x + (to.x - from.x) * back, y: from.y + (to.y - from.y) * back - Math.sin(back * Math.PI) * 60 };
    held = k >= 0.4 ? S.kinds[c.i] : null;
  }
  drawArmUp(ctx, { x: paw.x, y: paw.y + 40 });
  held && drawSnack(ctx, held, paw.x, paw.y, 2.6, 0, 0, 2);
  return { paw, bag: st.bag, plate: st.plate ? P : null };
}

/** Hearts rising over Mops (he says nothing: DECISIONS, beat 52). */
export function drawHearts(ctx, x, y, age) {
  for (let i = 0; i < 3; i++) {
    const a = age - i * 0.35;
    if (a < 0) continue;
    const k = esClamp(a / 1.2);
    ctx.save();
    ctx.globalAlpha = 1 - k * 0.7;
    drawHeart(ctx, x + (i - 1) * 26, y - k * 60, 18);
    ctx.restore();
  }
}
