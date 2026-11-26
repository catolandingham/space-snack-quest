/**
 * The TV story's pictures (Chapter 1, beat 20), full screen: the old Wookiee picture story Brian brought back on
 * 2026-11-25 ("Use the old drawings and captions as they were"). Ported from commit 71ec66e's single-file
 * index.html (its flashback drawing and its Wookiee), rewritten readably; the shapes, colours and places are the
 * old ones. Each picture is drawn on a 960 x 640 canvas around the point (480, 300), STORY.unit pixels to a unit
 * (the old picture's own scale), then washed pale and framed with "YEARS AGO", as before.
 *   tour    three Wookiees (one with a camera, one with a flag, one in sunglasses) and a caption
 *   shed    the same three with fur flying off them
 *   clog    the AIR SCRUBBER clogged with a ball of fur, a tourist gasping on each side
 *   gasp    the same picture, the left tourist's "*gasp*" in a bubble
 *   banish  the Station Official points the Wookiees onto the TOURS ship; they walk in, one after another
 * Sizes (Brian 2026-11-25: "a few design issues, like character sizing"): every grown-up stands on one floor
 * line and is drawn the same height in every picture (STORY.adult units), a Wookiee 1.36 times that, and the
 * TOURS ship's door is made for a Wookiee: a Wookiee is 85% of its height, the game's rule for a grown-up and a
 * door (12-ch1-redesign.js doorAdultPx). Before, the Wookiees shrank to 0.7 in the last picture, smaller than
 * the official, and were taller than the ship's whole door.
 */
import { tvLine } from "./tv-story-lines.js";

const INK = "#1e2430";
// The old picture's scale and middle, where everyone's feet stand (units), and how tall they are (units).
export const STORY = Object.freeze({ unit: 3, cx: 480, cy: 300, feet: 44, adult: 58, wookiee: 79, official: 64 });
// The TOURS ship (units): its hull runs off the right edge of the picture; its door is a Wookiee's door.
export const SHIP = Object.freeze({ x0: 55, top: -90, bottom: 40, door: Object.freeze({ x0: 66, w: 36, h: Math.round(STORY.wookiee / 0.85) }) });
// The AIR SCRUBBER (units), on the wall between the two tourists.
export const SCRUBBER = Object.freeze({ x0: -44, y0: -64, w: 88, h: 56 });
// The banish picture: where the official stands, where the Wookiees start, and how fast they walk to the door (units a second).
export const BANISH = Object.freeze({ official: -100, start: Object.freeze([-40, -2, 36]), walk: 36 });

// ---------- shapes (the old drawing's helpers, by name) ----------
function round(ctx, x, y, w, h, r) {
  const k = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + k, y);
  ctx.arcTo(x + w, y, x + w, y + h, k);
  ctx.arcTo(x + w, y + h, x, y + h, k);
  ctx.arcTo(x, y + h, x, y, k);
  ctx.arcTo(x, y, x + w, y, k);
  ctx.closePath();
}
// Fill the path, then outline it in ink.
function paint(ctx, fill, line = 2) {
  fill && ((ctx.fillStyle = fill), ctx.fill());
  line && ((ctx.strokeStyle = INK), (ctx.lineWidth = line), (ctx.lineJoin = "round"), (ctx.lineCap = "round"), ctx.stroke());
}
function stroke(ctx, pts, color, width) {
  ctx.beginPath();
  ctx.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();
}
// A fluffy outline: `n` bumps round an ellipse.
function fluff(ctx, x, y, rx, ry, n, bump) {
  ctx.beginPath();
  for (let q = 0; q <= n; q++) {
    const a = (q / n) * Math.PI * 2,
      px = x + Math.cos(a) * rx,
      py = y + Math.sin(a) * ry;
    if (q === 0) {
      ctx.moveTo(px, py);
      continue;
    }
    const m = ((q - 0.5) / n) * Math.PI * 2;
    ctx.quadraticCurveTo(x + Math.cos(m) * (rx + bump * 1.6), y + Math.sin(m) * (ry + bump * 1.6), px, py);
  }
  ctx.closePath();
}
function fluffPaint(ctx, fill, line) {
  ctx.fillStyle = fill;
  ctx.fill();
  line && ((ctx.lineWidth = line), (ctx.strokeStyle = INK), (ctx.lineJoin = "round"), ctx.stroke());
}
// An arm or a leg: a thick line with an ink edge.
function limb(ctx, x1, y1, x2, y2, width, color, edge) {
  ctx.lineCap = "round";
  if (edge) {
    ctx.strokeStyle = INK;
    ctx.lineWidth = width + edge * 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
const circle = (ctx, x, y, r) => (ctx.beginPath(), ctx.arc(x, y, Math.abs(r), 0, Math.PI * 2));
const dot = (ctx, x, y, r, color) => (ctx.beginPath(), ctx.arc(x, y, r, 0, 7), (ctx.fillStyle = color), ctx.fill());
const oval = (ctx, x, y, rx, ry) => (ctx.beginPath(), ctx.ellipse(x, y, Math.abs(rx), Math.abs(ry), 0, 0, Math.PI * 2));

// ---------- the people ----------
/**
 * A Wookiee standing with his feet at (x, y + 10), `t` his sway. Kind 0 wears a camera on his bandolier, kind 1
 * holds up the tour flag, kind 2 wears sunglasses. 79 units tall (STORY.wookiee).
 */
export function wookiee(ctx, x, y, t, kind = 0) {
  const fur = "#9a4a1c",
    dark = "#5e2a0c",
    sway = Math.sin(t) * 1.5;
  round(ctx, x - 12, y - 6, 10, 16, 4);
  paint(ctx, fur, 2);
  round(ctx, x + 2, y - 6, 10, 16, 4);
  paint(ctx, fur, 2);
  fluff(ctx, x, y - 20, 17, 22, 18, 3);
  fluffPaint(ctx, fur, 2.5);
  for (let i = 0; i < 6; i++) stroke(ctx, [x - 12 + i * 5, y - 30 + (i % 2) * 4, x - 13 + i * 5 + sway, y - 6 + (i % 3) * 3], dark, 1.1);
  limb(ctx, x - 15, y - 30, x - 20, y - 8 + Math.sin(t) * 2, 5, fur, 2);
  kind === 1 ? limb(ctx, x + 15, y - 30, x + 22, y - 60, 5, fur, 2) : limb(ctx, x + 15, y - 30, x + 20, y - 8 - Math.sin(t) * 2, 5, fur, 2);
  // the bandolier
  ctx.save();
  ctx.translate(x, y - 22);
  ctx.rotate(-0.75);
  round(ctx, -20, -3, 40, 6, 1.5);
  paint(ctx, "#6b4429", 1.5);
  for (let i = -16; i <= 14; i += 6) (round(ctx, i, -2.2, 3.5, 4.4, 0.5), paint(ctx, "#d8d8d8", 0.8));
  ctx.restore();
  // head and muzzle
  fluff(ctx, x, y - 50, 17, 15, 16, 2.6);
  fluffPaint(ctx, fur, 2.5);
  fluff(ctx, x, y - 40, 15, 7, 12, 2.2);
  fluffPaint(ctx, fur, 1.5);
  for (let i = 0; i < 5; i++) stroke(ctx, [x - 10 + i * 5, y - 62, x - 11 + i * 5, y - 55], dark, 1);
  if (kind === 2) {
    round(ctx, x - 11, y - 53, 9, 5, 2);
    paint(ctx, INK, 0);
    round(ctx, x + 2, y - 53, 9, 5, 2);
    paint(ctx, INK, 0);
    stroke(ctx, [x - 2, y - 51, x + 2, y - 51], INK, 1.5);
  } else {
    for (const ex of [-5, 5]) (circle(ctx, x + ex, y - 51, 2.4), paint(ctx, "#ffffff", 1.2), dot(ctx, x + ex, y - 51, 1.3, INK));
  }
  oval(ctx, x, y - 46, 2.5, 1.5);
  paint(ctx, INK, 0);
  oval(ctx, x, y - 41, 5, 3.2);
  paint(ctx, "#3a1405", 1.5);
  stroke(ctx, [x - 3, y - 43, x + 3, y - 43], "#ffffff", 1);
  if (kind === 0) {
    stroke(ctx, [x - 10, y - 38, x, y - 22, x + 10, y - 38], INK, 1.2);
    round(ctx, x - 7, y - 26, 14, 10, 2);
    paint(ctx, "#b8bcc4", 1.5);
    circle(ctx, x, y - 21, 3);
    paint(ctx, "#3a3f4b", 1);
  }
  if (kind === 1) {
    stroke(ctx, [x + 22, y - 58, x + 22, y - 88], INK, 1.8);
    ctx.beginPath();
    ctx.moveTo(x + 22, y - 88);
    ctx.lineTo(x + 44, y - 81);
    ctx.lineTo(x + 22, y - 74);
    ctx.closePath();
    paint(ctx, "#ff6a3d", 1.5);
    stroke(ctx, [x + 24, y - 84, x + 32, y - 80, x + 25, y - 77], "#3478f6", 1.5);
  }
}
// The three Wookiees of the tour group, side by side.
function tourGroup(ctx, t) {
  [-50, 0, 50].forEach((x, i) => wookiee(ctx, x, STORY.feet - 10, t * 3, i));
}
// A gasping tourist with his feet on the floor line at x, in his shirt colour.
function tourist(ctx, x, shirt) {
  ctx.save();
  ctx.translate(x, STORY.feet - 12);
  round(ctx, -7, -2, 6, 14, 2);
  paint(ctx, "#59657d", 2);
  round(ctx, 1, -2, 6, 14, 2);
  paint(ctx, "#59657d", 2);
  round(ctx, -11, -28, 22, 28, 7);
  paint(ctx, shirt, 2.5);
  limb(ctx, -8, -24, -3, -33, 3.5, shirt, 1.5);
  limb(ctx, 8, -24, 3, -33, 3.5, shirt, 1.5);
  circle(ctx, 0, -37, 9);
  paint(ctx, "#f0bf93", 2.5);
  oval(ctx, 0, -33, 2.2, 3);
  paint(ctx, INK, 0);
  dot(ctx, -3, -39, 1.2, INK);
  dot(ctx, 3, -39, 1.2, INK);
  ctx.restore();
}
// The Station Official in his white coat and red sash, pointing right (at the ship).
function official(ctx, x) {
  ctx.save();
  ctx.translate(x, STORY.feet - 12);
  round(ctx, -6, -2, 5, 14, 2);
  paint(ctx, "#1e2a4a", 1.5);
  round(ctx, 1, -2, 5, 14, 2);
  paint(ctx, "#1e2a4a", 1.5);
  round(ctx, -11, -30, 22, 30, 6);
  paint(ctx, "#ffffff", 2);
  stroke(ctx, [-10, -28, 10, -4], "#e5533d", 4);
  limb(ctx, 9, -26, 34, -34, 3.5, "#ffffff", 1.5);
  circle(ctx, 0, -40, 9);
  paint(ctx, "#f0bf93", 2);
  round(ctx, -9, -52, 18, 6, 2);
  paint(ctx, "#1e2a4a", 1.5);
  dot(ctx, 3, -41, 1.3, INK);
  stroke(ctx, [-1, -36, 5, -36], INK, 1.3);
  ctx.restore();
}

// ---------- the pictures (units, around the picture's middle) ----------
function scrubber(ctx) {
  const s = SCRUBBER;
  round(ctx, s.x0, s.y0, s.w, s.h, 4);
  paint(ctx, "#dfe4ea", 2.5);
  for (let x = s.x0 + 8; x <= s.x0 + s.w - 8; x += 9) stroke(ctx, [x, s.y0 + 6, x, s.y0 + s.h - 6], INK, 1.5);
  fluff(ctx, 0, s.y0 + 28, 22, 20, 14, 3);
  fluffPaint(ctx, "#a0703f", 2.5);
}
function clogPicture(ctx) {
  scrubber(ctx);
  tourist(ctx, -72, "#7fd1ff");
  tourist(ctx, 72, "#a98bff");
}
// Where each Wookiee is in the banish picture at time t (units; past the door's far edge he is inside).
export function banishWalkers(t) {
  const end = SHIP.door.x0 + SHIP.door.w + 20;
  return BANISH.start.map((x0, i) => ({ i, x: x0 + t * BANISH.walk, inside: x0 + t * BANISH.walk >= end }));
}
function ship(ctx) {
  const d = SHIP.door,
    floor = STORY.feet;
  round(ctx, SHIP.x0, SHIP.top, 200, SHIP.bottom - SHIP.top, 16);
  paint(ctx, "#dfe4ea", 2.5);
  // a stripe along the hull and its round windows
  round(ctx, d.x0 + d.w + 6, -14, 200, 7, 2);
  paint(ctx, "#3478f6", 1.5);
  for (const wx of [118, 140]) (circle(ctx, wx, SHIP.top + 18, 6), paint(ctx, "#a7e2ff", 2));
  // the open door, standing on the floor
  round(ctx, d.x0, floor - d.h, d.w, d.h, 3);
  paint(ctx, "#2b3a67", 2);
}
function banishPicture(ctx, t) {
  ship(ctx);
  official(ctx, BANISH.official);
  // the Wookiees walk through the door: past its far edge they are inside the ship, behind its hull
  const d = SHIP.door;
  ctx.save();
  ctx.beginPath();
  ctx.rect(-400, -400, 400 + d.x0 + d.w, 800);
  ctx.clip();
  for (const w of banishWalkers(t)) w.inside || wookiee(ctx, w.x, STORY.feet - 10, t * 4, w.i);
  ctx.restore();
}

// ---------- words ----------
// The game's own text (engine.text: its font, and the 14 CSS px floor on a small screen).
function words(engine, text, x, y, size, color = INK, align = "center", weight = 800) {
  engine.text(text, x, y, size, color, align, weight);
}
// Lines of `text` no wider than `width` at the game's font for `size`.
function wrap(ctx, engine, text, width, size, weight = 800) {
  engine.text("", -999, -999, size, INK, "left", weight);
  const out = [];
  let line = "";
  for (const w of text.split(" ")) {
    const next = line ? line + " " + w : w;
    ctx.measureText(next).width > width && line ? (out.push(line), (line = w)) : (line = next);
  }
  line && out.push(line);
  return out;
}
// Point in the picture's units -> canvas pixels.
const px = (x, y) => ({ x: STORY.cx + x * STORY.unit, y: STORY.cy + y * STORY.unit });

/** The white caption box under a story picture (the bedtime story uses it too: bedtime-story-art.js). */
export function caption(ctx, engine, text) {
  const lines = wrap(ctx, engine, text, 820, 28, 700),
    h = 36 + lines.length * 34,
    y = 640 - h - 28;
  round(ctx, 40, y, 880, h, 16);
  paint(ctx, "#ffffff", 3);
  lines.forEach((l, i) => words(engine, l, 480, y + 30 + i * 34, 28, INK, "center", 700));
  return { x0: 40, y0: y, x1: 920, y1: y + h };
}
// A name tag over a bubble's top left corner.
function tag(ctx, engine, name, color, x, y) {
  engine.text("", -999, -999, 15, INK, "left", 800);
  const w = ctx.measureText(name).width + 22,
    h = Math.max(26, parseInt(ctx.font.match(/(\d+)px/)[1], 10) + 10);
  round(ctx, x, y - h / 2, w, h, 12);
  paint(ctx, color, 3);
  words(engine, name, x + w / 2, y, 15, "#ffffff");
}
/**
 * A speech bubble with its tail on (sx, sy), its top no higher than `top`, and a name tag when `name` is given (the
 * bedtime story uses it too, with no tag: bedtime-story-art.js).
 */
export function bubble(ctx, engine, text, sx, sy, size, maxW, name, nameColor, top) {
  const lines = wrap(ctx, engine, text, maxW, size, 800),
    lineH = Math.max(size, parseInt(ctx.font.match(/(\d+)px/)[1], 10)) + 6,
    textW = Math.max(...lines.map((l) => ctx.measureText(l).width)),
    nameW = name ? (engine.text("", -999, -999, 15, INK, "left", 800), ctx.measureText(name).width + 22) : 0,
    w = Math.max(110, textW + 44, nameW + 28),
    h = lines.length * lineH + 40,
    x = Math.min(Math.max(sx - w / 2, 10), 960 - w - 10),
    y = Math.max(top, sy - h - 24),
    mid = Math.min(Math.max(sx, x + 24), x + w - 24);
  ctx.beginPath();
  ctx.moveTo(mid - 11, y + h - 2);
  ctx.lineTo(sx, Math.min(sy - 4, y + h + 22));
  ctx.lineTo(mid + 11, y + h - 2);
  ctx.closePath();
  paint(ctx, "#ffffff", 4);
  round(ctx, x, y, w, h, 18);
  paint(ctx, "#ffffff", 4);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(mid - 9, y + h - 5, 18, 7);
  lines.forEach((l, i) => words(engine, l, x + w / 2, y + 24 + lineH / 2 + i * lineH, size));
  name && tag(ctx, engine, name, nameColor, x + 14, y);
  return { x0: x, y0: y, x1: x + w, y1: y + h };
}

// ---------- one picture ----------
function picture(ctx, engine, t, scene, after) {
  ctx.fillStyle = "#f1f3f6";
  ctx.fillRect(0, 0, 960, 640);
  ctx.save();
  ctx.translate(STORY.cx, STORY.cy);
  ctx.scale(STORY.unit, STORY.unit);
  scene(ctx, t);
  ctx.restore();
  storyWash(ctx);
  words(engine, tvLine("label-years-ago"), 40, 36, 16, "#59657d", "left", 800);
  return after ? after() : null;
}
/**
 * "Years ago": the colours of the picture drawn so far washed out and warmed, and a frame round it all (the old
 * story pictures' look; the bedtime story's pictures have it too, bedtime-story-art.js).
 */
export function storyWash(ctx) {
  ctx.save();
  ctx.globalCompositeOperation = "saturation";
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, 960, 640);
  ctx.restore();
  ctx.fillStyle = "rgba(240,226,200,.2)";
  ctx.fillRect(0, 0, 960, 640);
  ctx.strokeStyle = "#59657d";
  ctx.lineWidth = 6;
  ctx.strokeRect(9, 9, 942, 622);
}
// Sizes drawn in every picture, in canvas pixels (tests/tv-story.mjs checks them against the size rule).
const sizes = () => ({ unit: STORY.unit, adult: STORY.adult * STORY.unit, official: STORY.official * STORY.unit, wookiee: STORY.wookiee * STORY.unit });

/** The five pictures, in order. Each draws itself full screen and returns what it drew (tests). */
export const WOOKIEE_PANELS = Object.freeze([
  // tour
  (ctx, t, engine) => (picture(ctx, engine, t, tourGroup, () => caption(ctx, engine, tvLine("cap-tour"))), { pic: "tour", wookiees: 3, ...sizes() }),
  // shed
  (ctx, t, engine) => (
    picture(
      ctx,
      engine,
      t,
      (c, tt) => {
        tourGroup(c, tt);
        for (let i = 0; i < 30; i++) {
          const x = ((i * 37 + (tt + 10) * 30) % 220) - 110,
            y = ((i * 23 + (tt + 10) * 18) % 120) - 80;
          c.beginPath();
          c.arc(x, y, 4, 0, 2.2);
          c.strokeStyle = "#8b5a3c";
          c.lineWidth = 1.5;
          c.stroke();
        }
      },
      () => caption(ctx, engine, tvLine("cap-shed")),
    ),
    { pic: "shed", wookiees: 3, ...sizes() }
  ),
  // clog
  (ctx, t, engine) => {
    picture(ctx, engine, t, clogPicture, () => {
      const s = px(0, SCRUBBER.y0 - 6);
      words(engine, tvLine("sign-scrubber"), s.x, s.y, 18, INK);
      caption(ctx, engine, tvLine("cap-clog"));
    });
    return { pic: "clog", ...sizes(), scrubber: { w: SCRUBBER.w * STORY.unit, h: SCRUBBER.h * STORY.unit } };
  },
  // gasp: the same picture, the left tourist gasps
  (ctx, t, engine) => {
    let b = null;
    picture(ctx, engine, t, clogPicture, () => {
      const s = px(0, SCRUBBER.y0 - 6);
      words(engine, tvLine("sign-scrubber"), s.x, s.y, 18, INK);
      const head = px(-72, STORY.feet - 12 - 46);
      b = bubble(ctx, engine, tvLine("tourist-gasp"), head.x, head.y, 26, 300, tvLine("tag-tourist"), "#a98bff", 84);
    });
    return { pic: "gasp", ...sizes(), bubble: b };
  },
  // banish: the official points them onto the TOURS ship
  (ctx, t, engine) => {
    let b = null;
    const head = px(BANISH.official, STORY.feet - 12 - 52);
    picture(ctx, engine, t, banishPicture, () => {
      const sign = px(SHIP.door.x0 + SHIP.door.w + 34, -40);
      words(engine, tvLine("sign-tours"), sign.x, sign.y, 18, INK, "center", 900);
      b = bubble(ctx, engine, tvLine("official-no-fur"), head.x, head.y, 27, 500, tvLine("tag-official"), "#e5533d", 84);
    });
    const walkers = banishWalkers(t);
    return { pic: "banish", ...sizes(), door: { w: SHIP.door.w * STORY.unit, h: SHIP.door.h * STORY.unit }, outside: walkers.filter((w) => !w.inside).length, bubble: b, head };
  },
]);
