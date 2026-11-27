/**
 * Beat 48, inside the big vent, the player as Mops (story pass 2026-11-26): drawings over the locked vent room picture
 * (docs/locked-rooms/vent-room-empty-v1.png; the picture itself is never changed) and the close-ups.
 *   tunnel   a short tunnel, side view, before the room: lost things stuck along it (a party hat, a sock, a fork),
 *            each bobbing as he crawls past; the vent's swirls at the far end
 *   dark     the room before LIGHT · lamp: dark, only the grille's dim light
 *   desk     his things on the desk: the tag stack, the spike of pay stubs, his own chart
 *   eyes     twice, a small round picture of Squatch's two eyes at the grille (he sees Mops's back and the lamp only)
 *   estoys   the toy bin close: the twin of the toy rocket Squatch got, under the IDEAS FOR GUARDIANS board
 *   esstubs  the stubs close: blank tags, pay stubs, his chart with every kind crossed off; then his pen crosses out the
 *            ST at its top and writes M
 *   note     the Guardian note close, written one line per tap, signed by the fourth (the same blue handwriting as the
 *            gift note)
 *   esslipdesk  the pink slip on the desk, close: the paw print in its box, his eyes on the pen corner
 * Every drawing is a PLACEHOLDER for Brian; every word from escape-lines.js.
 */
import { escapeWords } from "./escape-lines.js";
import { VENT_ROOM, VENT_TUNNEL } from "./escape-place.js";
import { esRect, esPaint, esWords, esWrap, ES_INK, ideasBoard, toysBin, drawPinkSheet } from "./escape-art.js";
import { drawRocket } from "./home-morning-art.js";
import { SNACK } from "./snack-name.js";
import { OFFICE_CODE } from "./escape-place.js";

const TAU = Math.PI * 2;
const BLUE_PEN = "#2b3a67";
const CREAM = "#fff4c2";
const PAPER = "#fffdf8";

// ---------- the tunnel ----------
/** The tunnel, side view; `mx` is where Mops is (the finds bob as he passes). Returns what it drew. */
export function drawTunnel(ctx, t, mx) {
  const T = VENT_TUNNEL;
  ctx.save();
  ctx.fillStyle = "#1b1f29";
  ctx.fillRect(0, 0, 960, 640);
  // the pipe: metal top and bottom, ribs
  ctx.fillStyle = "#8a93a3";
  ctx.fillRect(0, T.top, 960, T.floor - T.top);
  ctx.fillStyle = "#aab1be";
  ctx.fillRect(0, T.floor, 960, 40);
  ctx.strokeStyle = "rgba(30,36,48,.35)";
  ctx.lineWidth = 6;
  for (let x = 40; x < 960; x += 110) (ctx.beginPath(), ctx.moveTo(x, T.top), ctx.lineTo(x, T.floor + 40), ctx.stroke());
  // the swirls at the far end: the vent pulls
  ctx.strokeStyle = "rgba(143,220,255,.7)";
  ctx.lineWidth = 4;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(915, (T.top + T.floor) / 2, 24 + i * 18, t * 3 + i, t * 3 + i + 4);
    ctx.stroke();
  }
  const found = [];
  for (const f of T.finds) {
    const near = Math.abs(mx - f.x) < 70,
      bob = near ? Math.abs(Math.sin(t * 9)) * 10 : 0;
    near && found.push(f.kind);
    find(ctx, f.kind, f.x, T.floor - 8 - bob);
  }
  ctx.restore();
  return { found };
}
function find(ctx, kind, x, y) {
  ctx.save();
  ctx.translate(x, y);
  if (kind === "hat") {
    ctx.beginPath();
    ctx.moveTo(-26, 0);
    ctx.lineTo(0, -60);
    ctx.lineTo(26, 0);
    ctx.closePath();
    esPaint(ctx, "#ff5fa8", 4);
    ctx.beginPath();
    ctx.arc(0, -62, 8, 0, TAU);
    esPaint(ctx, "#ffcf33", 3);
  } else if (kind === "sock") {
    ctx.beginPath();
    ctx.moveTo(-10, -56);
    ctx.lineTo(12, -56);
    ctx.lineTo(12, -16);
    ctx.lineTo(36, -10);
    ctx.lineTo(34, 2);
    ctx.lineTo(-10, 2);
    ctx.closePath();
    esPaint(ctx, "#5b8def", 4);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-8, -48, 18, 8);
  } else {
    ctx.rotate(-0.5);
    esRect(ctx, -4, -60, 8, 50, 3);
    esPaint(ctx, "#cfd3dc", 3);
    for (const dx of [-9, -3, 3, 9]) (ctx.beginPath(), ctx.moveTo(dx, -60), ctx.lineTo(dx, -78), (ctx.lineWidth = 3), (ctx.strokeStyle = ES_INK), ctx.stroke());
  }
  ctx.restore();
}

// ---------- the room's layers ----------
/** Before the lamp: the room dark, the grille's dim light only. */
export function drawDark(ctx) {
  ctx.save();
  ctx.fillStyle = "rgba(8,10,18,.86)";
  ctx.fillRect(0, 0, 960, 640);
  const g = VENT_ROOM.grille;
  ctx.fillStyle = "rgba(143,160,190,.25)";
  ctx.fillRect(g.x1, g.y0, 140, g.y1 - g.y0);
  ctx.restore();
}
/** His things on the desk: the tag stack, the spike of pay stubs, his chart (small; their close-up reads them). */
export function drawDeskThings(ctx) {
  const D = VENT_ROOM.stubs;
  esRect(ctx, D.x0, D.y1 - 18, 40, 18, 2);
  esPaint(ctx, CREAM, 2);
  ctx.beginPath();
  ctx.moveTo(D.x0 + 70, D.y1);
  ctx.lineTo(D.x0 + 70, D.y0);
  ctx.strokeStyle = ES_INK;
  ctx.lineWidth = 3;
  ctx.stroke();
  for (let i = 0; i < 4; i++) (esRect(ctx, D.x0 + 54, D.y0 + 10 + i * 9, 32, 7, 1), esPaint(ctx, PAPER, 1.5));
  esRect(ctx, D.x1 - 38, D.y0 - 6, 38, 46, 2);
  esPaint(ctx, PAPER, 2);
}
/** The Guardian note on the desk while he writes it (48), and its lines so far. */
export function drawNotePad(ctx) {
  const N = VENT_ROOM.note;
  ctx.save();
  ctx.translate(N.x, N.y);
  ctx.scale(1, 0.45);
  esRect(ctx, -44, -60, 88, 70, 3);
  esPaint(ctx, CREAM, 3);
  ctx.restore();
}
/** Squatch's two eyes at the grille, in a small round picture (twice, 2 seconds each). */
export function drawEyesInset(ctx, age) {
  const k = Math.min(1, age / 0.25, Math.max(0, (2 - age) / 0.25)),
    x = 120,
    y = 120,
    r = 86 * k;
  if (r <= 2) return null;
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fillStyle = "#1b1f29";
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();
  ctx.clip();
  // the grille's slats, his eyes between them
  for (const d of [-26, 26]) {
    ctx.beginPath();
    ctx.ellipse(x + d * k, y, 18 * k, 22 * k, 0, 0, TAU);
    esPaint(ctx, "#ffffff", 3);
    ctx.beginPath();
    ctx.arc(x + d * k + 6 * k, y + 4 * k, 9 * k, 0, TAU);
    esPaint(ctx, ES_INK);
  }
  ctx.fillStyle = "#8a93a3";
  for (const dy of [-46, 34]) ctx.fillRect(x - r, y + dy * k, r * 2, 14 * k);
  ctx.restore();
  return { x, y, r };
}

// ---------- the close-ups (cutaway.js PANELS; each waits for NEXT: they have words) ----------
// The toy bin, close: the twin rocket, the board above it.
function toysPanel(ctx) {
  ctx.fillStyle = "#c3c9d4";
  ctx.fillRect(0, 0, 960, 640);
  ideasBoard(ctx, { x0: 160, y0: 20, x1: 800, y1: 260 }, 40);
  toysBin(ctx, { x0: 300, y0: 380, x1: 660, y1: 620 }, 48);
  drawRocket(ctx, 480, 330, { k: 2.2, a: -0.35, tag: false, lw: 6 });
  return { pic: "estoys", words: [escapeWords("board"), escapeWords("label-toys")], rocket: true };
}
// The stubs, close: the blank tags, the spike of pay stubs, and his chart; then the pen strokes ST out and writes M.
/** A tag's words in two lines: up to the first ". " (the name), then the rest. */
export function tagLines(s) {
  const i = String(s).indexOf(". ");
  return i < 0 ? [String(s)] : [s.slice(0, i + 1), s.slice(i + 2)];
}
function stubsPanel(ctx, t) {
  ctx.fillStyle = "#c4a574";
  ctx.fillRect(0, 0, 960, 640);
  // blank tags
  for (let i = 0; i < 3; i++) {
    esRect(ctx, 40 + i * 8, 60 + i * 10, 260, 70, 6);
    esPaint(ctx, CREAM, 3);
  }
  // (round 7: the longer tag, "For S. A new kind to try.", on two lines so it fits the tag: the name, then the rest)
  for (const [i, part] of tagLines(escapeWords("blank-tag")).entries()) esWords(ctx, part, 186, 98 + i * 30, 24, BLUE_PEN, "center", 700);
  // the spike of pay stubs
  ctx.beginPath();
  ctx.moveTo(170, 600);
  ctx.lineTo(170, 220);
  ctx.strokeStyle = ES_INK;
  ctx.lineWidth = 6;
  ctx.stroke();
  // (round 7, r5 13:57, q: 133: two short lines, the kind and who paid)
  const stub = escapeWords("stub"),
    a = stub,
    b = escapeWords("stub-paid");
  for (let i = 0; i < 3; i++) {
    const y = 250 + i * 110;
    esRect(ctx, 24, y, 300, 92, 4);
    esPaint(ctx, "#ffffff", 3);
    esWords(ctx, a, 174, y + 36, 19, ES_INK, "center", 800);
    esWords(ctx, b, 174, y + 70, 19, ES_INK, "center", 800);
  }
  // his chart: the same kinds as Squatch's, every one crossed off in pen
  const C = { x0: 380, y0: 40, x1: 920, y1: 600 };
  esRect(ctx, C.x0, C.y0, C.x1 - C.x0, C.y1 - C.y0, 6);
  esPaint(ctx, "#fffdf8", 4);
  const title = escapeWords("chart"),
    k = Math.max(0, Math.min(1, (t - 1.2) / 0.8)),
    m = Math.max(0, Math.min(1, (t - 2.2) / 0.6));
  esWords(ctx, title, (C.x0 + C.x1) / 2, C.y0 + 70, 54, BLUE_PEN, "center", 900);
  ctx.font = "900 54px system-ui, -apple-system, sans-serif";
  const tw = ctx.measureText(title).width,
    st = ctx.measureText("ST").width,
    sx = (C.x0 + C.x1) / 2 - tw / 2;
  // the pen crosses out ST...
  if (k > 0) {
    ctx.beginPath();
    ctx.moveTo(sx - 4, C.y0 + 52);
    ctx.lineTo(sx - 4 + (st + 8) * k, C.y0 + 52);
    ctx.strokeStyle = BLUE_PEN;
    ctx.lineWidth = 7;
    ctx.stroke();
  }
  // ...and writes M over it
  m > 0 && (ctx.save(), (ctx.globalAlpha = m), esWords(ctx, "M", sx + st / 2, C.y0 + 10, 52, BLUE_PEN, "center", 700), ctx.restore());
  for (let i = 0; i < 8; i++) {
    const x = C.x0 + 70 + (i % 4) * 125,
      y = C.y0 + 190 + Math.floor(i / 4) * 170;
    ctx.beginPath();
    ctx.ellipse(x, y, 42, 30, 0, 0, TAU);
    esPaint(ctx, ["#c98b4a", "#e0b070", "#9b6b3c", "#f0c890"][i % 4], 3);
    ctx.beginPath();
    ctx.moveTo(x - 46, y - 36);
    ctx.lineTo(x + 46, y + 36);
    ctx.moveTo(x + 46, y - 36);
    ctx.lineTo(x - 46, y + 36);
    ctx.strokeStyle = BLUE_PEN;
    ctx.lineWidth = 6;
    ctx.stroke();
  }
  return { pic: "esstubs", title, crossed: k >= 1, m: m >= 1, stub, tag: escapeWords("blank-tag"), names: SNACK.NAME };
}
// The pink slip on the desk, close: the paw print in its box; Mops's eyes on the pen corner only.
function slipDeskPanel(ctx, t) {
  ctx.fillStyle = "#c4a574";
  ctx.fillRect(0, 0, 960, 640);
  const s = drawPinkSheet(ctx, 260, 30, 440, { glowCode: true, t });
  // Mops's eye, top right: his look goes to the pen corner only, never to the paw print
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(880, 90, 46, 34, 0, 0, TAU);
  esPaint(ctx, "#ffffff", 4);
  ctx.beginPath();
  ctx.arc(866, 104, 14, 0, TAU);
  esPaint(ctx, ES_INK);
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(850, 124);
  ctx.lineTo(s.code.x + 40, s.code.y - 20);
  ctx.strokeStyle = "rgba(30,36,48,.6)";
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.restore();
  // (round 7, r5 14:17, q: 133: no Squatch eyes in this close-up: he is outside and cannot see the desk)
  return { pic: "esslipdesk", code: s.code, paw: s.paw, mopsLooks: "code", eyes: false };
}
export const VENT_PANELS = Object.freeze({ estoys: [toysPanel], esstubs: [stubsPanel], esslipdesk: [slipDeskPanel] });

/** The Guardian note, close, while he writes it: `lines` of the four written so far (the fourth is the signature). */
export function drawNoteCloseup(ctx, lines, t) {
  ctx.save();
  ctx.fillStyle = "rgba(12,16,28,.55)";
  ctx.fillRect(0, 0, 960, 640);
  esRect(ctx, 140, 60, 680, 520, 8);
  esPaint(ctx, CREAM, 5);
  const ids = ["note-1", "note-2", "note-3", "note-sign"],
    shown = ids.slice(0, lines).map((id) => escapeWords(id));
  // (the first line is the long one: on two rows)
  const rows = shown.flatMap((s, i) => (i === 0 ? esWrap(ctx, s, 600, 38) : [s]).map((r) => ({ r, sign: i === 3 })));
  rows.forEach(({ r, sign }, i) => esWords(ctx, r, sign ? 780 : 180, 150 + i * 92, 38, BLUE_PEN, sign ? "right" : "left", 700));
  // his hoof with the pencil, at the next line
  const hx = 560 + (lines % 2) * 60,
    hy = 150 + Math.min(lines + 1, 4) * 92 + 20;
  ctx.save();
  ctx.translate(hx, hy);
  ctx.rotate(0.5);
  esRect(ctx, -6, -70, 12, 80, 3);
  esPaint(ctx, "#ffcf33", 3);
  ctx.restore();
  ctx.beginPath();
  ctx.ellipse(hx + 34, hy - 34, 30, 26, 0.4, 0, TAU);
  esPaint(ctx, "#4a505c", 4);
  ctx.restore();
  return { shown, signed: lines >= 4 };
}

/** Beat 49: the slip folded in his paw, close: the paw print goes inside, the pen corner stays out (`age` 0 to 1 s). */
export function drawFoldCloseup(ctx, age) {
  const k = Math.max(0, Math.min(1, age / 0.8));
  ctx.save();
  ctx.fillStyle = "rgba(12,16,28,.55)";
  ctx.fillRect(0, 0, 960, 640);
  // the slip: its right half folds over its left (the paw print side), leaving the pen corner showing
  const x = 300,
    y = 150,
    w = 360,
    h = 300;
  esRect(ctx, x, y, w / 2, h, 4);
  esPaint(ctx, "#ff9cc2", 4);
  ctx.save();
  ctx.translate(x + w / 2, y);
  ctx.scale(1 - 2 * k, 1);
  esRect(ctx, 0, 0, w / 2, h, 4);
  esPaint(ctx, k < 0.5 ? "#ff9cc2" : "#d9668f", 4);
  ctx.restore();
  // the pen corner: the code's corner, still out
  esWords(ctx, OFFICE_CODE.slice(0, 3), x + 70, y + h - 30, 34, "#2b3a67", "center", 700);
  // his furry paw holding it
  ctx.beginPath();
  ctx.ellipse(x + 40, y + h + 10, 70, 46, -0.3, 0, TAU);
  esPaint(ctx, "#6b4428", 4);
  ctx.restore();
  return { folded: k >= 1 };
}
