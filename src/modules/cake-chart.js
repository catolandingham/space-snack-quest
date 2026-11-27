/**
 * The crayon chart over Squatch's bed (Brian, story pass 28-52, section E4, and the snack thread (docs: the crate-kind thread), 2026-11-26):
 * a sheet taped to the wall above his crate bed, titled in his crayon with the snack's name, and two rows of little
 * cakes, each a different kind, each crossed out with a red crayon X (no fizz). A picture only since 2026-11-27 (Brian,
 * video note r5 6:51; question 129): no empty circle, no "THE CRATE KIND" label, and nobody marks it. It is there from
 * the first minute of the game.
 * The home room is a locked picture (docs/locked-rooms/home-room-empty-closed-v6.png and -open-v6). The picture never
 * changes: the chart is drawn as a layer over a copy of it (crate-stamp.js withSnackLayers, with the crate bed's stamp),
 * on the bare wall between the closet and the desk. It needs Brian's yes (docs/DECISIONS.md). PLACEHOLDER look.
 * Its only words are snack-name.js's "chart-title".
 */
import { snackLine } from "./snack-name.js";

/** Where the sheet hangs, in the home picture's pixels (1280 x 830): on the bare wall over the crate bed. */
export const CAKE_CHART = Object.freeze({
  x0: 262,
  y0: 300,
  w: 196,
  h: 112,
  tilt: -0.03,
  paper: "#fffdf3",
  ink: "#1e2430",
  crayonRed: "rgb(214,46,38)",
  crayonBlue: "rgb(52,84,214)",
  // the kinds he has tried (placeholders from the thread, drawn only as colours: no names)
  tried: Object.freeze(["#ffd84a", "#5aa0ff", "#9a6a3a", "#f2b24a", "#c48ad8", "#2b2b33", "#9ad46a", "#ff8fb0"]),
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
    title = snackLine("chart-title");
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
  // the kinds tried: two rows of little cakes, each a different colour, each crossed out. Nothing else: no empty
  // circle, no label (Brian 2026-11-27, r5 6:51; q: 129, the pick A. Option B, no chart at all: crate-stamp.js
  // LAYERS, leave drawCakeChart out of the two home pictures.)
  const r = 12,
    xs = [-60, -20, 20, 60],
    rows = [0, 30];
  K.tried.forEach((col, i) => {
    const x = xs[i % 4],
      y = rows[Math.floor(i / 4)];
    chartCake(c, x, y, r, col);
    crayonX(c, x, y, r + 2);
  });
  c.restore();
  drawn = { box: { x0: K.x0, y0: K.y0, x1: K.x0 + K.w, y1: K.y0 + K.h }, title, label: "", tried: K.tried.length, crossed: K.tried.length };
  return drawn;
}
