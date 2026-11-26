/**
 * Squatch's crayon drawing of the Guardians: who he thinks they are (docs/CH1-STORY-WALKTHROUGH.md beat 22: "He
 * pictures the Guardians as big furry Sasquatches, like his crayon drawing in the box"). A kid's crayon picture on a
 * sheet of paper: two big furry Sasquatches, a little Squatch between them holding their hands, a red heart over him,
 * green grass and a sun. No words on it. A placeholder drawing, waiting for Brian's eye.
 * One drawing, used everywhere it shows (Brian, 2026-11-26): the bedtime story's picture as Mops talks about the
 * Guardians (bedtime-story-art.js), and, on the morning's branch (feat/ch1-day2-morning, home-morning-art.js), the
 * thought bubble over Squatch and the Guardian Box close-up.
 * The crayon wobble comes from a fixed seed, so the drawing is the same every frame and everywhere.
 */
const INK = "#1e2430";
export const CRAYON = Object.freeze({
  paper: "#fffdf6",
  fur: "#7a4a26",
  furDark: "#4e2e16",
  face: "#f2b887",
  grass: "#3fa34d",
  sun: "#f6c21c",
  heart: "#e5533d",
  // the sheet's shape: height for width
  aspect: 0.72,
});

// A fixed wobble: the same "random" numbers every time, from a seed.
function wobbler(seed) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0), s / 4294967296 - 0.5);
}

/**
 * Draws the drawing on its sheet, the sheet's middle at (cx, cy), `w` canvas pixels wide, turned by `tilt`
 * (radians). `paper: false` leaves the sheet out (the drawing alone). Returns the sheet's box (unturned) and where
 * the figures are, for tests. `title(x, y, size)`, when given, writes the drawing's crayon title across its top (the
 * caller writes it with the game's text, so the words are counted like every word on screen).
 */
export function drawGuardiansCrayon(ctx, cx, cy, w, { tilt = 0, paper = true, edge = true, title = null } = {}) {
  const h = w * CRAYON.aspect,
    u = w / 100, // one unit of the drawing (the sheet is 100 x 72 units)
    rnd = wobbler(7),
    line = Math.max(1.2, u * 1.1);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(tilt);
  ctx.translate(-w / 2, -h / 2);
  if (paper) {
    ctx.fillStyle = CRAYON.paper;
    ctx.fillRect(0, 0, w, h);
    if (edge) {
      ctx.lineWidth = Math.max(1.5, u * 0.6);
      ctx.strokeStyle = "#c9c2b0";
      ctx.strokeRect(0, 0, w, h);
    }
  }
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const P = (x, y) => [x * u, y * u];
  // A crayon stroke through points (drawing units): drawn twice, a little off each time, like a crayon line.
  const stroke = (pts, color, width = 1) => {
    for (let k = 0; k < 2; k++) {
      ctx.beginPath();
      pts.forEach(([x, y], i) => {
        const [px, py] = P(x + rnd() * 0.9, y + rnd() * 0.9);
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      });
      ctx.strokeStyle = color;
      ctx.globalAlpha = k ? 0.55 : 0.9;
      ctx.lineWidth = line * width;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };
  // A round shape's outline as a crayon loop (n points round an oval), optionally furry (zigzag).
  const loop = (x, y, rx, ry, n, fur) =>
    Array.from({ length: n + 1 }, (_, i) => {
      const a = (i / n) * Math.PI * 2,
        r = fur && i % 2 ? 1.18 : 1;
      return [x + Math.cos(a) * rx * r, y + Math.sin(a) * ry * r];
    });
  // A coloured-in oval: a solid crayon fill, then a few slanted strokes of `hatch` over it for the crayon's grain.
  const scribble = (x, y, rx, ry, color, hatch) => {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(x * u, y * u, rx * u, ry * u, 0, 0, Math.PI * 2);
    ctx.globalAlpha = 0.92;
    ctx.fillStyle = color;
    ctx.fill();
    ctx.clip();
    if (hatch) {
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = hatch;
      ctx.lineWidth = line * 0.8;
      for (let k = -rx - ry; k <= rx + ry; k += 2.6) {
        ctx.beginPath();
        ctx.moveTo((x + k - ry) * u, (y + ry) * u);
        ctx.lineTo((x + k + ry) * u, (y - ry) * u);
        ctx.stroke();
      }
    }
    ctx.restore();
  };
  // The grass and the sun.
  stroke(Array.from({ length: 21 }, (_, i) => [i * 5, 64 + (i % 2 ? -2.5 : 0)]), CRAYON.grass, 1.2);
  scribble(88, 11, 6, 6, CRAYON.sun);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    stroke([[88 + Math.cos(a) * 8, 11 + Math.sin(a) * 8], [88 + Math.cos(a) * 11.5, 11 + Math.sin(a) * 11.5]], CRAYON.sun);
  }
  // One furry Sasquatch: its feet on the grass at x, `tall` units tall.
  const sasquatch = (x, tall) => {
    const k = tall / 46,
      feet = 63,
      body = { x, y: feet - 17 * k, rx: 10 * k, ry: 15 * k },
      head = { x, y: feet - 36 * k, r: 8.5 * k };
    // legs
    stroke([[x - 4 * k, feet - 5 * k], [x - 4.5 * k, feet]], CRAYON.furDark, 1.6);
    stroke([[x + 4 * k, feet - 5 * k], [x + 4.5 * k, feet]], CRAYON.furDark, 1.6);
    scribble(body.x, body.y, body.rx, body.ry, CRAYON.fur, CRAYON.furDark);
    stroke(loop(body.x, body.y, body.rx, body.ry, 22, true), CRAYON.furDark);
    scribble(head.x, head.y, head.r, head.r, CRAYON.fur, CRAYON.furDark);
    stroke(loop(head.x, head.y, head.r, head.r, 18, true), CRAYON.furDark);
    // the face: a pale patch, two dots, a smile
    scribble(head.x, head.y + 1.5 * k, 5 * k, 4.2 * k, CRAYON.face);
    for (const ex of [-2.2, 2.2]) {
      ctx.beginPath();
      ctx.arc((x + ex * k) * u, (head.y + 0.2 * k) * u, Math.max(1, 0.9 * k * u), 0, Math.PI * 2);
      ctx.fillStyle = INK;
      ctx.fill();
    }
    stroke([[x - 2.4 * k, head.y + 2.6 * k], [x, head.y + 3.8 * k], [x + 2.4 * k, head.y + 2.6 * k]], INK, 0.8);
    return { x, top: head.y - head.r, feet, hand: { l: [x - body.rx - 6 * k, body.y], r: [x + body.rx + 6 * k, body.y] }, shoulder: { l: [x - body.rx + 1, body.y - 7 * k], r: [x + body.rx - 1, body.y - 7 * k] } };
  };
  const big1 = sasquatch(25, 48),
    big2 = sasquatch(75, 48),
    little = sasquatch(50, 22);
  // arms: the big ones reach down to hold the little one's hands
  stroke([big1.shoulder.r, [little.x - 6, little.feet - 9]], CRAYON.furDark, 1.6);
  stroke([big2.shoulder.l, [little.x + 6, little.feet - 9]], CRAYON.furDark, 1.6);
  stroke([big1.shoulder.l, [big1.x - 16, 40]], CRAYON.furDark, 1.6);
  stroke([big2.shoulder.r, [big2.x + 16, 40]], CRAYON.furDark, 1.6);
  // a red heart over the little one
  const hx = 50,
    hy = 30;
  ctx.beginPath();
  ctx.moveTo(hx * u, (hy + 4) * u);
  ctx.bezierCurveTo((hx - 7) * u, (hy - 1) * u, (hx - 3) * u, (hy - 6) * u, hx * u, (hy - 2.5) * u);
  ctx.bezierCurveTo((hx + 3) * u, (hy - 6) * u, (hx + 7) * u, (hy - 1) * u, hx * u, (hy + 4) * u);
  ctx.fillStyle = CRAYON.heart;
  ctx.fill();
  title && title(44 * u, 8 * u, Math.round(6.5 * u));
  ctx.restore();
  return { x0: cx - w / 2, y0: cy - h / 2, x1: cx + w / 2, y1: cy + h / 2, figures: { guardians: 2, squatch: 1 }, big: 48, little: 22 };
}
