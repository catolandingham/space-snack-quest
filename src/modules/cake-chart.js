/**
 * The crayon chart over Squatch's bed (Brian, story pass 28-52, section E4, and the snack thread (docs: the crate-kind thread), 2026-11-26):
 * a sheet taped to the wall above his crate bed, titled in his crayon with the snack's name, a row of the little cakes
 * he has tasted, each crossed out with a red crayon X (no fizz), and at the far end one empty circle with a red dot in
 * the middle and sparks, labelled THE CRATE KIND: the one he is still looking for. It is there from the first minute
 * of the game.
 * The home room is a locked picture (docs/locked-rooms/home-room-empty-closed-v6.png and -open-v6). The picture never
 * changes: the chart is drawn as a layer over a copy of it (crate-stamp.js withSnackLayers, with the crate bed's stamp),
 * on the bare wall between the closet and the desk. It needs Brian's yes (docs/DECISIONS.md). PLACEHOLDER look.
 * Its words are snack-name.js lines ("chart-title", "chart-crate-kind").
 */
import { snackLine } from "./snack-name.js";

/** Where the sheet hangs, in the home picture's pixels (1280 x 830): on the bare wall over the crate bed. */
export const CAKE_CHART = Object.freeze({
  x0: 246,
  y0: 300,
  w: 196,
  h: 112,
  tilt: -0.03,
  paper: "#fffdf3",
  ink: "#1e2430",
  crayonRed: "rgb(214,46,38)",
  crayonBlue: "rgb(52,84,214)",
  // the kinds he has tried (placeholders from the thread, drawn only as colours: no names)
  tried: Object.freeze(["#ffd84a", "#5aa0ff", "#9a6a3a", "#f2b24a", "#c48ad8", "#2b2b33"]),
});

const CRAYON = (px) => `700 ${px}px "Chalkboard SE", "Marker Felt", "Comic Sans MS", cursive`;
let drawn = null;
/** Tests: what the chart layer drew last ({ box, title, label, tried, crossed }), or null before it was drawn. */
export function cakeChartDrawn() {
  return drawn;
}

function chartCake(c, x, y, r, color) {
  c.beginPath();
  c.ellipse(x, y, r, r * 0.72, 0, 0, Math.PI * 2);
  c.fillStyle = color;
  c.fill();
  c.lineWidth = 2;
  c.strokeStyle = CAKE_CHART.ink;
  c.stroke();
}
function crayonX(c, x, y, r) {
  c.strokeStyle = CAKE_CHART.crayonRed;
  c.lineWidth = 3.2;
  c.lineCap = "round";
  c.beginPath();
  c.moveTo(x - r, y - r * 0.8);
  c.lineTo(x + r, y + r * 0.8);
  c.moveTo(x + r, y - r * 0.8);
  c.lineTo(x - r, y + r * 0.8);
  c.stroke();
}

/** Draws the chart on `c`, in the home picture's pixels. */
export function drawCakeChart(c) {
  const K = CAKE_CHART,
    title = snackLine("chart-title"),
    label = snackLine("chart-crate-kind");
  c.save();
  c.translate(K.x0 + K.w / 2, K.y0 + K.h / 2);
  c.rotate(K.tilt);
  // the sheet, and two strips of tape at its top
  c.fillStyle = K.paper;
  c.strokeStyle = K.ink;
  c.lineWidth = 2.5;
  c.beginPath();
  c.rect(-K.w / 2, -K.h / 2, K.w, K.h);
  c.fill();
  c.stroke();
  for (const tx of [-0.38, 0.38]) {
    c.save();
    c.translate(tx * K.w, -K.h / 2);
    c.rotate(tx * 0.6);
    c.fillStyle = "rgba(240,226,170,.9)";
    c.fillRect(-14, -6, 28, 12);
    c.restore();
  }
  // the title, in his blue crayon
  c.fillStyle = K.crayonBlue;
  c.font = CRAYON(20);
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.fillText(title, 0, -K.h / 2 + 18);
  // the kinds tried: two rows of three little cakes, each crossed out
  const r = 11,
    xs = [-72, -42, -12],
    rows = [-4, 26];
  K.tried.forEach((col, i) => {
    const x = xs[i % 3],
      y = rows[Math.floor(i / 3)];
    chartCake(c, x, y, r, col);
    crayonX(c, x, y, r + 2);
  });
  // the crate kind: an empty circle with a red dot and sparks, still to find
  const cx = 52,
    cy = 6;
  c.beginPath();
  c.arc(cx, cy, 20, 0, Math.PI * 2);
  c.setLineDash([5, 4]);
  c.lineWidth = 2.5;
  c.strokeStyle = K.ink;
  c.stroke();
  c.setLineDash([]);
  c.beginPath();
  c.arc(cx, cy, 6, 0, Math.PI * 2);
  c.fillStyle = K.crayonRed;
  c.fill();
  c.strokeStyle = "#ffb400";
  c.lineWidth = 2;
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3 + 0.3;
    c.beginPath();
    c.moveTo(cx + Math.cos(a) * 9, cy + Math.sin(a) * 9);
    c.lineTo(cx + Math.cos(a) * 15, cy + Math.sin(a) * 15);
    c.stroke();
  }
  c.fillStyle = K.crayonRed;
  c.font = CRAYON(12);
  c.fillText(label, cx, cy + 34);
  c.restore();
  drawn = { box: { x0: K.x0, y0: K.y0, x1: K.x0 + K.w, y1: K.y0 + K.h }, title, label, tried: K.tried.length, crossed: K.tried.length };
  return drawn;
}
