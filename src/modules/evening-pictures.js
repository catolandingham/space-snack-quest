/**
 * New drawings for the rebuilt evening (story pass 2026-11-26, beats 37 to 42c; evening.js). Every one is a
 * PLACEHOLDER for Brian's eye, drawn as a layer over a locked room picture or in a close-up; none changes a locked
 * picture's file.
 *   Jupiter's big red storm rolling past the hall's big window, and the red glow it gives the hall (38a)
 *   the bin behind the snack counter the brochure lands in (38b); the coffee stain on the brochure
 *   the brochure's picture parts a kid taps (39): Mars in the window, the pancakes, the cut-open cake that fizzes, the
 *     paw print, the two cooks, and one cake box stamped MARS CAKES (the brochure's only words)
 *   the Guardians' mark (their "paw" print, slightly off: made with a hoof)
 *   the Guardians' little box with its tag, and this week's cake (39b); the crayon chart of kinds tried (39b)
 *   the thought pictures (41: the idea; 42b: the choice) and the "years later" picture of the don't-send ending
 *   the crate beside the loading bay's big wall vent (42c)
 */
import { MARS_CAKES, STARS_CAKES, drawFatLetters } from "./stars-cakes.js";

const INK = "#1e2430",
  TAU = Math.PI * 2,
  FUR = "#6b4428";
function pRect(ctx, x, y, w, h, r, fill, line, lw = 3) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  fill && ((ctx.fillStyle = fill), ctx.fill());
  line && ((ctx.lineWidth = lw), (ctx.strokeStyle = line), ctx.stroke());
}
function pDisc(ctx, x, y, r, fill, line, lw = 3) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  fill && ((ctx.fillStyle = fill), ctx.fill());
  line && ((ctx.lineWidth = lw), (ctx.strokeStyle = line), ctx.stroke());
}
function pWords(ctx, t, x, y, size, color = INK, weight = 900, align = "center", fontFace = "system-ui, -apple-system, sans-serif") {
  ctx.font = `${weight} ${size}px ${fontFace}`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.fillText(t, x, y);
}
const CRAYON_FONT = '"Comic Sans MS", "Chalkboard SE", system-ui, sans-serif';

// ---------- 38a: Jupiter's big red storm ----------
/** The hall's big window in game positions (the locked hall v2 picture's window, picture 47 to 828 by 95 to 298). */
export const HALL_WINDOW = Object.freeze({ x0: 35, y0: 73, x1: 621, y1: 230 });
/**
 * Jupiter slides into the window and its big red storm rolls past: `k` 0 (not there) to 1 (the storm in the middle),
 * `t` the time (the bands turn). Drawn over the window only. Returns where the storm's middle is.
 */
export function drawJupiterStorm(ctx, k, t) {
  const W = HALL_WINDOW,
    q = Math.max(0, Math.min(1, k)),
    e = q * q * (3 - 2 * q);
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(W.x0 + 2, W.y0 + 2, W.x1 - W.x0 - 4, W.y1 - W.y0 - 4, [4, 22, 22, 4]);
  ctx.clip();
  // the planet's striped body fills the window from the right as it comes
  const left = W.x1 + 40 - e * (W.x1 - W.x0 + 120);
  const bands = ["#e9c89a", "#c98a52", "#f1dcb8", "#b8653a", "#e8c08e", "#c47a46", "#f0d6ae"];
  const bh = (W.y1 - W.y0) / bands.length;
  bands.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    for (let x = left; x <= W.x1 + 8; x += 12) ctx.lineTo(x, W.y0 + i * bh + Math.sin(x / 40 + i + t * 0.3) * 4);
    for (let x = W.x1 + 8; x >= left; x -= 12) ctx.lineTo(x, W.y0 + (i + 1) * bh + Math.sin(x / 40 + i + 1 + t * 0.3) * 4 + 1);
    ctx.closePath();
    ctx.fill();
  });
  // the edge of the planet, curved
  ctx.beginPath();
  ctx.ellipse(left + 260, (W.y0 + W.y1) / 2, 260, 190, 0, Math.PI * 0.62, Math.PI * 1.38);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(90,40,20,.5)";
  ctx.stroke();
  // the big red storm, a swirling oval, turning
  const cx = left + 220,
    cy = W.y0 + (W.y1 - W.y0) * 0.58;
  for (let i = 5; i >= 0; i--) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, 34 + i * 16, 18 + i * 9, Math.sin(t * 0.6 + i) * 0.05, 0, TAU);
    ctx.fillStyle = ["#7a1a12", "#9d2418", "#bf3322", "#d9482e", "#e8673e", "#f08a58"][i];
    ctx.fill();
  }
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 4; i++) {
    const a0 = t * 1.2 + i * 1.6;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 30 + i * 18, 15 + i * 10, 0, a0, a0 + 2.2);
    ctx.strokeStyle = "rgba(255,220,190,.7)";
    ctx.stroke();
  }
  ctx.restore();
  return { x: cx, y: cy };
}
/** The storm's red glow over the whole hall (`k` how far it has come). */
export function drawStormGlow(ctx, k) {
  ctx.save();
  ctx.globalAlpha = 0.16 * Math.max(0, Math.min(1, k));
  ctx.fillStyle = "#e5333d";
  ctx.fillRect(-2000, -2000, 6000, 5000);
  ctx.restore();
}

// ---------- 38b: the bin behind the counter ----------
export function drawCounterBin(ctx, x, y, s = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.beginPath();
  ctx.moveTo(-16, -34);
  ctx.lineTo(16, -34);
  ctx.lineTo(12, 0);
  ctx.lineTo(-12, 0);
  ctx.closePath();
  ctx.fillStyle = "#8a93a6";
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = INK;
  ctx.stroke();
  pRect(ctx, -19, -38, 38, 6, 2, "#a7b0c2", INK, 2.5);
  ctx.restore();
}
/** A brown coffee splash on the brochure (inside its box). */
export function drawCoffeeStain(ctx, x, y, w, h) {
  ctx.save();
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = "#6b3f1d";
  ctx.beginPath();
  ctx.ellipse(x + w * 0.72, y + h * 0.3, w * 0.2, h * 0.12, 0.4, 0, TAU);
  ctx.fill();
  pDisc(ctx, x + w * 0.5, y + h * 0.22, w * 0.05, "#6b3f1d");
  pDisc(ctx, x + w * 0.86, y + h * 0.48, w * 0.04, "#6b3f1d");
  ctx.restore();
}

// ---------- 39: the brochure's picture parts ----------
/**
 * Where each thing a kid taps sits on the brochure's front, as fractions of its box (evening-art.js drawBrochure):
 * Mars in the window, the pancakes, the cut-open cake, the paw print, the two cooks; and the cake box stamped
 * MARS CAKES. Each is { fx, fy, fr } (middle and reach, fractions of the width).
 */
export const BROCHURE_PARTS = Object.freeze({
  window: Object.freeze({ fx: 0.5, fy: 0.2, fr: 0.17 }),
  pancakes: Object.freeze({ fx: 0.5, fy: 0.68, fr: 0.13 }),
  cake: Object.freeze({ fx: 0.82, fy: 0.84, fr: 0.11 }),
  paw: Object.freeze({ fx: 0.86, fy: 0.95, fr: 0.07 }),
  cooks: Object.freeze({ fx: 0.5, fy: 0.45, fr: 0.3 }),
  box: Object.freeze({ fx: 0.2, fy: 0.84, fw: 0.32, fh: 0.13 }),
});
/**
 * The brochure's extra things, drawn over its front (x, y, w, h): the cake box stamped MARS CAKES on the counter, the
 * cake cut open with its red middle (`fizz` 0 to 1: little sparks), and the round real paw print in the corner.
 */
export function drawBrochureExtras(ctx, x, y, w, h, fizz = 0, t = 0) {
  const B = BROCHURE_PARTS.box,
    bx = x + w * (B.fx - B.fw / 2),
    by = y + h * (B.fy - B.fh / 2),
    bw = w * B.fw,
    bh = h * B.fh;
  pRect(ctx, bx, by, bw, bh, 3, "#f6e7c8", INK, Math.max(1.2, w * 0.006));
  const size = bh * 0.42;
  ctx.save();
  ctx.font = `900 ${size}px "Arial Black", Impact, system-ui, sans-serif`;
  const tw = ctx.measureText(MARS_CAKES).width,
    sk = Math.min(1, (bw * 0.9) / tw);
  ctx.translate(bx + bw / 2 - (tw * sk) / 2, by + bh * 0.68);
  ctx.scale(sk, 1);
  drawFatLetters(ctx, MARS_CAKES, 0, 0, size);
  ctx.restore();
  // the cut-open cake: a round cake with a slice out, the red marshmallow middle showing
  const C = BROCHURE_PARTS.cake,
    cx = x + w * C.fx,
    cy = y + h * C.fy,
    r = w * C.fr * 0.62;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, r, 0.5, TAU - 0.3);
  ctx.closePath();
  ctx.fillStyle = "#8a5228";
  ctx.fill();
  ctx.lineWidth = Math.max(1.2, w * 0.006);
  ctx.strokeStyle = INK;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, r * 0.55, 0.5, TAU - 0.3);
  ctx.closePath();
  ctx.fillStyle = "#e0303a";
  ctx.fill();
  if (fizz > 0)
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * TAU + t * 3,
        d = r * (0.9 + 0.5 * ((t * 2 + i * 0.3) % 1));
      ctx.save();
      ctx.globalAlpha = fizz;
      ctx.strokeStyle = "#ffd23f";
      ctx.lineWidth = Math.max(1.5, w * 0.008);
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * d * 0.8, cy + Math.sin(a) * d * 0.8);
      ctx.lineTo(cx + Math.cos(a) * d * 1.1, cy + Math.sin(a) * d * 1.1);
      ctx.stroke();
      ctx.restore();
    }
  // the round, real paw print in the corner
  const P = BROCHURE_PARTS.paw;
  drawRealPaw(ctx, x + w * P.fx, y + h * P.fy, w * P.fr * 1.3);
}
/** A round, real paw print: a big pad and four round toes. */
export function drawRealPaw(ctx, x, y, s, color = "#5a3418") {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y + s * 0.12, s * 0.32, s * 0.26, 0, 0, TAU);
  ctx.fill();
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(x + (i - 1.5) * s * 0.22, y - s * 0.26 - (i === 1 || i === 2 ? s * 0.06 : 0), s * 0.1, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}
/** The Guardians' mark, slightly off: made with a hoof, so the pad is a split heart and the toes are two half-moons. */
export function drawGuardianMark(ctx, x, y, s, color = "#5a3418") {
  ctx.save();
  ctx.fillStyle = color;
  for (const d of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(x + d * s * 0.14, y + s * 0.12, s * 0.15, s * 0.26, d * 0.25, 0, TAU);
    ctx.fill();
  }
  for (const d of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(x + d * s * 0.22, y - s * 0.3, s * 0.12, s * 0.07, d * 0.5, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

// ---------- 39b: the Guardians' box, this week's cake, the chart ----------
/** The little box from the Guardians (its paper tag hangs off it, scribbled: the tag's words are beat 28's), `open` 0 to 1. */
export function drawGuardiansBox(ctx, x, y, s = 1, open = 0, cake = true) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  pRect(ctx, -22, -26, 44, 26, 3, "#e9d3a8", INK, 2.5);
  ctx.beginPath();
  ctx.moveTo(0, -26);
  ctx.lineTo(0, 0);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#e5533d";
  ctx.stroke();
  // the lid, tipping back as it opens
  ctx.save();
  ctx.translate(-22, -26);
  ctx.rotate(-open * 1.9);
  pRect(ctx, 0, -6, 44, 7, 2, "#f2e0bc", INK, 2.5);
  ctx.restore();
  if (open > 0.5 && cake) {
    pDisc(ctx, 0, -28, 9, "#f0c94a", INK, 2);
    pDisc(ctx, 0, -28, 4, "#fff3c4");
  }
  // the tag on a string
  ctx.beginPath();
  ctx.moveTo(18, -20);
  ctx.lineTo(30, -8);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = INK;
  ctx.stroke();
  pRect(ctx, 26, -10, 20, 13, 2, "#fffdf2", INK, 1.5);
  ctx.fillStyle = "#3478f6";
  ctx.fillRect(29, -6, 13, 1.6);
  ctx.fillRect(29, -2, 9, 1.6);
  ctx.restore();
}
/** This week's cake in his paw, bitten (`bite` 0 to 1: the bite's size). */
export function drawWeekCake(ctx, x, y, r, bite = 0) {
  ctx.save();
  pDisc(ctx, x, y, r, "#f0c94a", INK, 2);
  pDisc(ctx, x, y, r * 0.45, "#fff3c4");
  if (bite > 0) {
    ctx.globalCompositeOperation = "destination-out";
    for (const [dx, dy] of [[0.7, -0.5], [0.95, 0], [0.7, 0.5]]) pDisc(ctx, x + dx * r, y + dy * r, r * 0.38 * bite, "#000");
  }
  ctx.restore();
}
/** The chart's layout in its own units (360 x 260). */
export const CHART = Object.freeze({ W: 360, H: 260, tried: 5, cell: Object.freeze({ x0: 34, y: 140, step: 48, r: 18 }), crate: Object.freeze({ x: 330, y: 140, r: 22 }) });
/**
 * The crayon chart above his bed, in (x, y, w, h): "STARS CAKES", a row of little cakes each with an X (`tried`), this
 * week's cake with `newX` (0 to 1) of its X drawn, and at the end one empty circle with a red dot and sparks, "THE CRATE
 * KIND". `small` draws it as it hangs on the wall (no fine lines).
 */
export function drawCakeChart(ctx, x, y, w, h, newX = 0, small = false, crateKind = "") {
  const k = Math.min(w / CHART.W, h / CHART.H);
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  pRect(ctx, 0, 0, CHART.W, CHART.H, 6, "#fffdf2", INK, 3);
  ctx.fillStyle = "rgba(240,230,180,.85)";
  ctx.fillRect(12, -8, 40, 18);
  ctx.fillRect(CHART.W - 52, -8, 40, 18);
  pWords(ctx, STARS_CAKES, CHART.W / 2, 44, 34, "#e5533d", 800, "center", CRAYON_FONT);
  const C = CHART.cell;
  const xMark = (cx, cy, r, u) => {
    ctx.save();
    ctx.strokeStyle = "#1e2430";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    const a = Math.min(1, u * 2),
      b = Math.max(0, u * 2 - 1);
    ctx.beginPath();
    ctx.moveTo(cx - r, cy - r);
    ctx.lineTo(cx - r + 2 * r * a, cy - r + 2 * r * a);
    if (b > 0) {
      ctx.moveTo(cx + r, cy - r);
      ctx.lineTo(cx + r - 2 * r * b, cy - r + 2 * r * b);
    }
    ctx.stroke();
    ctx.restore();
  };
  const colors = ["#f0c94a", "#6fa8ff", "#a8784a", "#ffb347", "#c38cff", "#3b3b3b", "#9ad46a"];
  for (let i = 0; i <= CHART.tried; i++) {
    const cx = C.x0 + i * C.step;
    pDisc(ctx, cx, C.y, C.r, colors[i], INK, 2.5);
    if (i < CHART.tried) xMark(cx, C.y, C.r * 0.8, 1);
    else newX > 0 && xMark(cx, C.y, C.r * 0.8, newX);
  }
  // the crate kind: an empty circle with a red dot and sparks
  const K = CHART.crate;
  pDisc(ctx, K.x, K.y, K.r, null, INK, 3);
  pDisc(ctx, K.x, K.y, 6, "#e0303a");
  if (!small)
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU;
      ctx.beginPath();
      ctx.moveTo(K.x + Math.cos(a) * (K.r + 4), K.y + Math.sin(a) * (K.r + 4));
      ctx.lineTo(K.x + Math.cos(a) * (K.r + 12), K.y + Math.sin(a) * (K.r + 12));
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#ffb000";
      ctx.stroke();
    }
  crateKind && pWords(ctx, crateKind, K.x - 76, K.y + 62, 22, "#3478f6", 800, "center", CRAYON_FONT);
  ctx.restore();
}

// ---------- 41 and 42b: the thought pictures ----------
/**
 * One small wordless picture inside a thought cloud (x, y the middle, s the size, about 100 units across): "mopping"
 * (Mops mopping, they need him), "robots" (robots mopping, Mops with nothing to do), "ship" (the two of them on a ship,
 * a red dot ahead), "form" (the pink form in the bin, its empty box glowing), "go" (robots mopping, and the two flying
 * to the red dot: MARK · box), "stay" (Mops mopping, Squatch peeking out of the home door: PUT BACK · bin).
 * `mops(ctx, x, y, scale, opts)` draws Mops (the engine's); `glow` 0 to 1 the form's box.
 */
export function drawIdeaPicture(ctx, id, x, y, s, mops, t = 0, glow = 0) {
  ctx.save();
  ctx.translate(x, y);
  const k = s / 100;
  ctx.scale(k, k);
  const floor = () => pRect(ctx, -50, 22, 100, 18, 3, "#d9d4c8", null);
  const smallRobot = (rx, ry) => {
    pRect(ctx, rx - 9, ry - 26, 18, 22, 5, "#2d4f8a", INK, 2);
    pDisc(ctx, rx, ry - 30, 3, "#7fd0ff", INK, 1.5);
    ctx.beginPath();
    ctx.moveTo(rx + 6, ry - 8);
    ctx.lineTo(rx + 16, ry + 4);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#c0c6d4";
    ctx.stroke();
  };
  const sqFace = (fx, fy, r) => {
    pDisc(ctx, fx - r * 0.85, fy - r * 0.55, r * 0.35, FUR, INK, 1.5);
    pDisc(ctx, fx + r * 0.85, fy - r * 0.55, r * 0.35, FUR, INK, 1.5);
    pDisc(ctx, fx, fy, r, FUR, INK, 2);
    pDisc(ctx, fx - r * 0.35, fy - r * 0.1, r * 0.16, INK);
    pDisc(ctx, fx + r * 0.35, fy - r * 0.1, r * 0.16, INK);
  };
  const ship = (sx, sy) => {
    pRect(ctx, sx - 26, sy - 10, 52, 20, 10, "#dfe4ee", INK, 2);
    pDisc(ctx, sx - 8, sy, 4, "#7fb6ff", INK, 1.2);
    pDisc(ctx, sx + 6, sy, 4, "#7fb6ff", INK, 1.2);
    ctx.beginPath();
    ctx.moveTo(sx - 26, sy);
    ctx.lineTo(sx - 38, sy - 6);
    ctx.lineTo(sx - 38, sy + 6);
    ctx.closePath();
    ctx.fillStyle = "#ffb347";
    ctx.fill();
  };
  if (id === "mopping" || id === "stay") {
    floor();
    mops && mops(ctx, id === "stay" ? 14 : 0, 30, 0.85, { f: Math.sin(t * 6) > 0 ? 1 : -1, walk: t * 3 });
    if (id === "stay") {
      pRect(ctx, -46, -40, 22, 62, 2, "#c9a77c", INK, 2);
      sqFace(-30, -6, 8);
    }
  } else if (id === "robots" || id === "go") {
    floor();
    smallRobot(-24 + Math.sin(t * 3) * 4, 30);
    smallRobot(18 + Math.cos(t * 3) * 4, 30);
    if (id === "robots") mops && mops(ctx, 40, 30, 0.6, { f: -1 });
    if (id === "go") {
      ship(-6, -26);
      pDisc(ctx, 40, -34, 7, "#e0303a", INK, 1.5);
      sqFace(-14, -40, 5);
    }
  } else if (id === "ship") {
    for (let i = 0; i < 10; i++) pDisc(ctx, -46 + ((i * 37) % 92), -36 + ((i * 23) % 70), 1.4, "#ffffff");
    pDisc(ctx, 38, -20, 8, "#e0303a", INK, 1.5);
    ship(-8, 6);
    sqFace(-16, -10, 6);
    pDisc(ctx, 2, -12, 6, "#ffffff", INK, 1.5);
  } else if (id === "form") {
    ctx.beginPath();
    ctx.moveTo(-20, -4);
    ctx.lineTo(20, -4);
    ctx.lineTo(15, 34);
    ctx.lineTo(-15, 34);
    ctx.closePath();
    ctx.fillStyle = "#8a93a6";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = INK;
    ctx.stroke();
    ctx.save();
    ctx.translate(-4, -16);
    ctx.rotate(-0.2);
    pRect(ctx, -14, -18, 28, 36, 2, "#ff9ec4", INK, 2);
    pRect(ctx, -6, -6, 12, 12, 1, "#ffffff", INK, 1.5);
    if (glow > 0) {
      ctx.globalAlpha = glow;
      pRect(ctx, -9, -9, 18, 18, 2, null, "#ffd23f", 3);
    }
    ctx.restore();
  }
  ctx.restore();
}
/** A thought cloud with a trail of circles going down to (tx, ty): middle (cx, cy), size (w, h). */
export function drawThoughtCloud(ctx, cx, cy, w, h, tx, ty, a = 1) {
  ctx.save();
  ctx.globalAlpha = a;
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  ctx.beginPath();
  const n = 12;
  for (let i = 0; i < n; i++) {
    const t0 = (i / n) * TAU,
      px = cx + Math.cos(t0) * (w / 2 - 10),
      py = cy + Math.sin(t0) * (h / 2 - 10);
    ctx.moveTo(px + 14, py);
    ctx.arc(px, py, 14, 0, TAU);
  }
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(cx, cy, w / 2 - 8, h / 2 - 8, 0, 0, TAU);
  ctx.fill();
  // the trail
  const bottom = { x: cx + (tx - cx) * 0.2, y: cy + h / 2 + 4 };
  [9, 6, 4].forEach((r, i) => {
    const u = (i + 1) / 4;
    pDisc(ctx, bottom.x + (tx - bottom.x) * u, bottom.y + (ty - bottom.y) * u, r, "#ffffff", INK, 2);
  });
  ctx.restore();
}

// ---------- 42b: the don't-send ending ----------
/**
 * Years later, the same little room: Mops's beard grey, Squatch huge and grey at the muzzle, still peeking round the
 * door under the yellowed STAY IN HERE poster. In (x, y, w, h). `mops` draws Mops.
 */
export function drawYearsLater(ctx, x, y, w, h, mops, poster) {
  ctx.save();
  pRect(ctx, x, y, w, h, 10, "#efe6d2", INK, 4);
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.fillStyle = "#e2d8c0";
  ctx.fillRect(x, y + h * 0.62, w, h * 0.38);
  // the yellowed poster
  pRect(ctx, x + w * 0.62, y + h * 0.14, w * 0.28, h * 0.26, 3, "#f3e3a2", INK, 2.5);
  poster && pWords(ctx, poster, x + w * 0.76, y + h * 0.25, Math.round(w * 0.05), "#c84a2e", 900);
  // the door, and Squatch, huge, peeking round it, his muzzle grey
  pRect(ctx, x + w * 0.62, y + h * 0.42, w * 0.3, h * 0.5, 3, "#c9a77c", INK, 3);
  const fx = x + w * 0.6,
    fy = y + h * 0.56,
    r = w * 0.1;
  pDisc(ctx, fx - r * 0.85, fy - r * 0.6, r * 0.35, FUR, INK, 2.5);
  pDisc(ctx, fx, fy, r, FUR, INK, 3);
  ctx.beginPath();
  ctx.ellipse(fx - r * 0.05, fy + r * 0.35, r * 0.55, r * 0.4, 0, 0, TAU);
  ctx.fillStyle = "#b9b4ad";
  ctx.fill();
  pDisc(ctx, fx - r * 0.38, fy - r * 0.12, r * 0.14, INK);
  pDisc(ctx, fx + r * 0.3, fy - r * 0.12, r * 0.14, INK);
  // Mops, old, mopping
  mops && mops(ctx, x + w * 0.3, y + h * 0.86, w / 260, { f: 1, beard: "#bdbdbd" });
  ctx.restore();
}

// ---------- 42c: the crate by the big wall vent ----------
/** The crate under the loading bay's big wall vent (a hiding place): its box in game positions. */
export const BAY_CRATE = Object.freeze({ x0: 818, x1: 884, y0: 268, y1: 322 });
export function drawBayCrate(ctx) {
  const B = BAY_CRATE;
  pRect(ctx, B.x0, B.y0, B.x1 - B.x0, B.y1 - B.y0, 3, "#b98a4e", INK, 2.5);
  ctx.beginPath();
  ctx.moveTo(B.x0 + 4, B.y0 + 4);
  ctx.lineTo(B.x1 - 4, B.y1 - 4);
  ctx.moveTo(B.x1 - 4, B.y0 + 4);
  ctx.lineTo(B.x0 + 4, B.y1 - 4);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#7a5228";
  ctx.stroke();
}
