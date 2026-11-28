/**
 * The crayon chart over Squatch's bed (Brian, story pass 28-52, section E4, and the snack thread (docs: the crate-kind thread), 2026-11-26):
 * a sheet taped to the wall above his crate bed, titled in his crayon with the snack's name, and two rows of little
 * cakes, each a different kind, each crossed out with a red crayon X (no fizz). A picture only since 2026-11-27 (Brian,
 * video note r5 6:51; question 129): no empty circle, no "THE CRATE KIND" label, and nobody marks it. It is there from
 * the first minute of the game.
 * The home room is a locked picture (docs/locked-rooms/home-room-empty-closed-v6.png and -open-v6). The picture never
 * changes: the chart is drawn as a layer over a copy of it (crate-stamp.js withSnackLayers, with the crate bed's stamp),
 * on the bare wall between the closet and the desk. It needs Brian's yes (docs/DECISIONS.md). Final art, pending his yes.
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

// A fixed wobble (the same every frame), from a seed: his crayon lines (guardians-drawing.js's way).
function chartWobble(seed) {
  let n = seed >>> 0 || 1;
  return () => ((n = (n * 1664525 + 1013904223) >>> 0), n / 4294967296 - 0.5);
}
// A crayon line through points: drawn twice, a little off, the second fainter.
function chartLine(c, rnd, pts, color, width) {
  c.lineCap = "round";
  c.lineJoin = "round";
  for (let i = 0; i < 2; i++) {
    c.beginPath();
    pts.forEach(([x, y], j) => (j ? c.lineTo(x + rnd() * 1.4, y + rnd() * 1.4) : c.moveTo(x + rnd() * 1.4, y + rnd() * 1.4)));
    c.strokeStyle = color;
    c.globalAlpha = i ? 0.5 : 0.92;
    c.lineWidth = width * (i ? 0.7 : 1);
    c.stroke();
  }
  c.globalAlpha = 1;
}
// One little cake in his crayon: a round cake from the side (its top, its side), coloured in with slanted strokes in
// the kind's colour, a dark crayon outline.
function chartCake(c, rnd, x, y, r, color) {
  const top = y - r * 0.35,
    ry = r * 0.36,
    h = r * 0.75;
  c.save();
  c.beginPath();
  c.ellipse(x, top, r, ry, 0, Math.PI, 0);
  c.lineTo(x + r, top + h);
  c.ellipse(x, top + h, r, ry, 0, 0, Math.PI);
  c.closePath();
  c.clip();
  c.strokeStyle = color;
  c.globalAlpha = 0.75;
  c.lineWidth = 3;
  for (let s = -r * 2; s < r * 2; s += 4) (c.beginPath(), c.moveTo(x + s, top + h + ry), c.lineTo(x + s + r, top - ry), c.stroke());
  c.restore();
  const ring = [];
  for (let i = 0; i <= 14; i++) {
    const a = Math.PI + (i / 14) * Math.PI;
    ring.push([x + Math.cos(a) * r, top + Math.sin(a) * ry]);
  }
  for (let i = 0; i <= 14; i++) {
    const a = (i / 14) * Math.PI;
    ring.push([x + Math.cos(a) * r, top + h + Math.sin(a) * ry]);
  }
  ring.push(ring[0]);
  chartLine(c, rnd, ring, CAKE_CHART.ink, 1.8);
  const lid = [];
  for (let i = 0; i <= 10; i++) lid.push([x - r + (2 * r * i) / 10, top + Math.sin((i / 10) * Math.PI) * ry]);
  chartLine(c, rnd, lid, CAKE_CHART.ink, 1.4);
}
function crayonX(c, rnd, x, y, r) {
  chartLine(c, rnd, [[x - r, y - r * 0.8], [x + r, y + r * 0.8]], CAKE_CHART.crayonRed, 3.4);
  chartLine(c, rnd, [[x + r, y - r * 0.8], [x - r, y + r * 0.8]], CAKE_CHART.crayonRed, 3.4);
}

/**
 * Draws the chart on `c`, in the home picture's pixels: the sheet taped up, its title in his blue crayon, two rows of
 * little cakes in his crayon, each a different kind's colour, each crossed out with a red crayon X. Final art, pending
 * Brian's yes (round 8; drawn the way his other crayon pictures are, each line twice, coloured in with slanted strokes).
 */
export function drawCakeChart(c) {
  const K = CAKE_CHART,
    title = snackLine("chart-title"),
    rnd = chartWobble(5);
  c.save();
  c.translate(K.x0 + K.w / 2, K.y0 + K.h / 2);
  c.rotate(K.tilt);
  // the sheet, its dark outline (the room's ink, as everything on the wall), and two strips of tape at its top
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
  // the title, in his blue crayon (pressed hard: twice, a little off)
  c.fillStyle = K.crayonBlue;
  c.font = CRAYON(20);
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.fillText(title, 0, -K.h / 2 + 18);
  c.globalAlpha = 0.45;
  c.fillText(title, 1, -K.h / 2 + 19);
  c.globalAlpha = 1;
  // the kinds tried: two rows of little cakes, each a different colour, each crossed out. Nothing else: no empty
  // circle, no label (Brian 2026-11-27, r5 6:51; q: 129, the pick A. Option B, no chart at all: crate-stamp.js
  // LAYERS, leave drawCakeChart out of the two home pictures.)
  const r = 13,
    xs = [-66, -22, 22, 66],
    rows = [2, 34];
  K.tried.forEach((col, i) => {
    const x = xs[i % 4],
      y = rows[Math.floor(i / 4)];
    chartCake(c, rnd, x, y, r, col);
    crayonX(c, rnd, x, y, r + 1);
  });
  c.restore();
  drawn = { box: { x0: K.x0, y0: K.y0, x1: K.x0 + K.w, y1: K.y0 + K.h }, title, label: "", tried: K.tried.length, crossed: K.tried.length };
  return drawn;
}
