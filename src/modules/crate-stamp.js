/**
 * The two stamps a crate can carry (Brian, 2026-11-26, question 86, and the family-crate spec, 2.3 and 2.12):
 *   - The station's crates: the snack's name (snack-name.js) in thin blue letters with a blue star. Drawn by
 *     drawStationStamp, which the older program's crate (60-frame-draw.js rq, through the bridge) calls.
 *   - Squatch's own crate bed, his family's crate: big, fat red block letters, worn, with the first letter scraped
 *     off (a bare patch one wide letter across, the two faint red feet of the lost letter at its bottom), so only the
 *     rest of the word shows (snack-name.js FAMILY.FADED), and his old crayon "ST" in the gap. The two stamps never match.
 * The crate bed is part of the locked home pictures (docs/locked-rooms/home-room-empty-closed-v6.png and -open-v6),
 * whose badge still says the old name, and the party hall picture's snack tin (HALL_TIN) still has the old name on its
 * lid. The picture files never change: withSnackLayers(id, img) gives a copy of the
 * picture (a canvas that draws like the Image) with the old badge painted out in the crate's own wood and the new
 * stamp drawn over it (and the tin's lid painted again with the new name), a layer for Brian's yes (docs/DECISIONS.md, "The snack renamed, and the crate bed's stamp (question 86)"). Every place that
 * draws a home picture gets it through night-look.js nightPicture, by day and by night.
 * PLACEHOLDER look (letter sizes, the red, the wear, the crayon) for Brian.
 */
import { snackLine } from "./snack-name.js";
import { drawCakeChart } from "./cake-chart.js";

/**
 * The crate bed in the locked home picture, in that picture's pixels (1280 x 830), from docs/locked-rooms/home_room.py
 * draw_bed_crate: the crate's front, its corner posts, the old badge, the slat line under the badge and the two
 * braces across the front.
 */
export const CRATE_BED = Object.freeze({
  picture: Object.freeze({ w: 1280, h: 830 }),
  front: Object.freeze({ x0: 111, y0: 531, x1: 382, y1: 682 }),
  inner: Object.freeze({ x0: 128, x1: 365 }), // between the grey corner posts
  badge: Object.freeze({ x0: 194, y0: 580, x1: 298, y1: 609 }), // the old badge, with its outline, and a little more
  slatY: 606,
  braces: Object.freeze([Object.freeze([121, 541, 372, 672]), Object.freeze([121, 672, 372, 541])]),
  stampY: 596, // the middle of the new letters
  stampW: 222, // the scraped gap and the letters together
  wood: "rgb(217,163,91)",
  woodDark: "rgb(169,116,58)",
  brace: "rgb(120,80,40)",
  bare: "rgb(236,203,148)",
  red: "rgb(198,38,30)",
  crayon: "rgb(52,84,214)",
});

const FAT = (px) => `900 ${px}px "Arial Black", Impact, system-ui, sans-serif`;
const CRAYON_FONT = (px) => `700 ${px}px "Chalkboard SE", "Marker Felt", "Comic Sans MS", cursive`;

// Tests: what the layer drew, and how often a home picture was handed out with it.
let made = null,
  madeCrayon = null;
let handed = 0;
let last = null,
  stamps = 0;
/**
 * Tests: the crate bed layer's parts (null before it was made) and how many times a home picture came with it; the
 * hall tin's lid (null before it was made) and how many times the hall picture came with it; the family stamp drawn
 * last on any crate (the bedtime story's too) and how many times it has been drawn.
 */
export function crateStampDrawn() {
  return { made, madeCrayon, handed, tin: tinMade, handedHall, last, stamps, byLunch, crayonNow: lastCrayon };
}

// The stamp's letter sheets, made once each (drawFamilyStamp).
const STAMP_SHEETS = new Map();

// A small fixed sequence for the wear, so the stamp looks the same every time.
function wearDots(n, seed) {
  const out = [];
  let s = seed;
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280;
    const a = s / 233280;
    s = (s * 9301 + 49297) % 233280;
    const b = s / 233280;
    s = (s * 9301 + 49297) % 233280;
    out.push([a, b, 0.6 + (s / 233280) * 1.6]);
  }
  return out;
}

/**
 * Draws the family's stamp on `c` (a 2D context in the home picture's pixels, CRATE_BED): paints out the old badge
 * (`paintOut`), then the scraped gap, the lost letter's feet, the fat red letters with their wear, and his crayon
 * (`crayon`: false for the crate as it arrived, before he could hold a crayon). Another crate drawn in the same shape
 * (the bedtime story's) moves and scales `c` onto this crate's front first, with `note` false. Returns its parts.
 */
export function drawFamilyStamp(c, { paintOut = true, crayon: withCrayon = true, crayonAlpha = 1, note = true } = {}) {
  const B = CRATE_BED;
  const { faded, crayon, px, gapW, textW, left, cap, top, base } = stampLayout(c);
  // 1. the old badge goes, under the crate's own wood, slat line and braces
  c.save();
  if (paintOut) {
    c.fillStyle = B.wood;
    c.fillRect(B.badge.x0, B.badge.y0, B.badge.x1 - B.badge.x0, B.badge.y1 - B.badge.y0);
    c.beginPath();
    c.rect(B.badge.x0, B.badge.y0, B.badge.x1 - B.badge.x0, B.badge.y1 - B.badge.y0);
    c.clip();
    c.strokeStyle = B.woodDark;
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(B.badge.x0, B.slatY);
    c.lineTo(B.badge.x1, B.slatY);
    c.stroke();
    c.strokeStyle = B.brace;
    c.lineWidth = 3;
    for (const [x0, y0, x1, y1] of B.braces) {
      c.beginPath();
      c.moveTo(x0, y0);
      c.lineTo(x1, y1);
      c.stroke();
    }
  }
  c.restore();
  // 2. sizes: stampLayout (one wide letter's gap plus the letters fill stampW)
  c.font = FAT(px);
  // 3. the scraped gap: bare, paler wood with scratches, a little wider than the letter it lost
  const gap = { x0: left - 2, y0: top - 4, x1: left + gapW, y1: base + 4 };
  c.save();
  c.fillStyle = B.bare;
  c.globalAlpha = 0.92;
  c.fillRect(gap.x0, gap.y0, gap.x1 - gap.x0, gap.y1 - gap.y0);
  c.globalAlpha = 0.55;
  c.strokeStyle = B.woodDark;
  c.lineWidth = 1.2;
  for (const [a, b] of wearDots(7, 11)) {
    const y = gap.y0 + 3 + a * (gap.y1 - gap.y0 - 6);
    c.beginPath();
    c.moveTo(gap.x0 + 2 + b * 6, y);
    c.lineTo(gap.x1 - 2 - a * 6, y + (b - 0.5) * 5);
    c.stroke();
  }
  // the two faint red feet of the lost letter, at the bottom of the gap
  c.globalAlpha = 0.5;
  c.fillStyle = B.red;
  const footW = Math.max(4, Math.round(gapW * 0.2)),
    footH = Math.round(cap * 0.22);
  const feet = [
    { x: left + 1, y: base - footH, w: footW, h: footH },
    { x: left + gapW - footW - 3, y: base - footH, w: footW, h: footH },
  ];
  for (const f of feet) c.fillRect(f.x, f.y, f.w, f.h);
  c.restore();
  // 4. the fat red letters, worn: drawn on their own sheet, nicked with little holes, then laid on the crate
  // (made once for its words and size, then reused: the bedtime story draws this crate every frame)
  const sheetKey = faded + "|" + px;
  let sheet = STAMP_SHEETS.get(sheetKey) || null;
  const fresh = !sheet && typeof document !== "undefined";
  fresh && (sheet = document.createElement("canvas"));
  const lettersX = left + gapW;
  if (sheet && sheet.getContext) {
    if (fresh) {
      sheet.pictureLayer = true; // (tests/canvas-text.mjs: part of the picture, not words on the game canvas)
      sheet.width = Math.ceil(textW + 8);
      sheet.height = Math.ceil(px * 1.4);
      const s = sheet.getContext("2d");
      s.font = FAT(px);
      s.textAlign = "left";
      s.textBaseline = "alphabetic";
      s.fillStyle = B.red;
      s.fillText(faded, 4, sheet.height / 2 + cap / 2);
      s.globalCompositeOperation = "destination-out";
      for (const [a, b, r] of wearDots(90, 7)) {
        s.beginPath();
        s.arc(a * sheet.width, b * sheet.height, r, 0, Math.PI * 2);
        s.fill();
      }
      STAMP_SHEETS.set(sheetKey, sheet);
    }
    c.save();
    c.globalAlpha = 0.86;
    c.drawImage(sheet, lettersX - 4, B.stampY - sheet.height / 2);
    c.restore();
  }
  // 5. his crayon, years ago: two wobbly letters squeezed into the one-letter gap, above the lost letter's feet,
  //    each tipped its own way, waxy (little gaps where the crayon skipped)
  let cpx = Math.round(cap * 0.95);
  c.font = CRAYON_FONT(cpx);
  while (cpx > 10 && c.measureText(crayon).width * 1.1 > gapW - 2) c.font = CRAYON_FONT(--cpx);
  const waxKey = crayon + "|" + cpx + "|" + Math.round(gapW);
  let wax = withCrayon ? STAMP_SHEETS.get(waxKey) || null : null;
  const freshWax = withCrayon && !wax && typeof document !== "undefined";
  freshWax && (wax = document.createElement("canvas"));
  if (wax && wax.getContext) {
    if (freshWax) {
      wax.pictureLayer = true;
      wax.width = Math.ceil(gapW + 12);
      wax.height = Math.ceil(cpx * 1.6);
      const w = wax.getContext("2d");
      w.font = CRAYON_FONT(cpx);
      w.textAlign = "center";
      w.textBaseline = "middle";
      w.fillStyle = B.crayon;
      w.strokeStyle = B.crayon;
      w.lineWidth = Math.max(1, cpx * 0.06);
      const step = c.measureText(crayon).width / crayon.length;
      [...crayon].forEach((ch, i) => {
        w.save();
        w.translate(wax.width / 2 + (i - (crayon.length - 1) / 2) * step * 1.05, wax.height / 2 + (i % 2 ? -1.5 : 1.5));
        w.rotate(i % 2 ? 0.14 : -0.2);
        w.fillText(ch, 0, 0);
        w.strokeText(ch, 0.6, -0.4);
        w.restore();
      });
      w.globalCompositeOperation = "destination-out";
      for (const [a, b2, r] of wearDots(40, 3)) {
        w.beginPath();
        w.arc(a * wax.width, b2 * wax.height, r * 0.6, 0, Math.PI * 2);
        w.fill();
      }
      STAMP_SHEETS.set(waxKey, wax);
    }
    c.save();
    c.globalAlpha = 0.92 * Math.max(0, Math.min(1, crayonAlpha));
    c.drawImage(wax, left + gapW / 2 - wax.width / 2 - 1, B.stampY - cap * 0.12 - wax.height / 2);
    c.restore();
  }
  const parts = { gap, feet, letters: { x0: lettersX, x1: lettersX + textW, y0: top, y1: base, px, text: faded }, crayon: withCrayon ? { text: crayon, px: cpx } : null };
  if (note) made = parts; // (tests: the crate bed's, not another crate's)
  if (note && withCrayon) madeCrayon = parts; // (tests: the crate bed's last one with his crayon, however late a crayonless one was made)
  last = parts; // (tests: whichever crate drew it last, and how often)
  stamps++;
  return parts;
}

/**
 * Where the family stamp's parts go on the crate bed (CRATE_BED, the home picture's pixels): the letters' size `px`
 * (the biggest that fits stampW with the gap), the scraped gap's width, the letters' width, and the left edge, cap
 * height, top and baseline. Measured with `c`'s own fonts, so every drawing of the stamp has the same shape.
 */
function stampLayout(c) {
  const B = CRATE_BED;
  const faded = snackLine("stamp-family-faded").replace(/^_/, ""),
    crayon = snackLine("stamp-family-crayon");
  c.save();
  let px = 40;
  c.font = FAT(px);
  const fit = () => c.measureText("M").width * 1.04 + c.measureText(faded).width;
  while (px > 16 && fit() > B.stampW) c.font = FAT(--px);
  const gapW = c.measureText("M").width * 1.04,
    textW = c.measureText(faded).width,
    left = Math.round((B.inner.x0 + B.inner.x1) / 2 - (gapW + textW) / 2),
    cap = px * 0.74;
  // (each letter's left edge and width, for a drawing that lights them one by one)
  const letters = [...faded].map((ch, i) => ({ c: ch, x: left + gapW + c.measureText(faded.slice(0, i)).width, w: c.measureText(ch).width }));
  c.restore();
  return { faded, crayon, px, gapW, textW, left, cap, top: B.stampY - cap / 2, base: B.stampY + cap / 2, letters };
}

/** Fat red block letters, the family stamp's look, `h` tall (font size), left edge at x, baseline at y. Returns the width. */
export function drawFatLetters(ctx, text, x, y, h, color = CRATE_BED.red, a = 1) {
  ctx.save();
  ctx.globalAlpha *= a;
  ctx.font = FAT(h);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  const w = ctx.measureText(text).width;
  ctx.restore();
  return w;
}

/**
 * The same family stamp (drawFamilyStamp: the scraped gap, the lost letter's feet, the worn fat letters, his crayon)
 * drawn somewhere else and at another size, for a close-up of the crate bed: the gap's left edge at x, the letters'
 * baseline at y, the letters `h` tall (font size). `crayon` 0 to 1: how much of his crayon is left (he rubs it out,
 * the evening's 39b); `lit`: how many letters glow behind (the brochure slid along them); `click` 0 to 1: the
 * brochure's M landing on the lost letter's two feet. Returns, in the caller's positions: the gap (`patch`), each
 * letter ({ c, x, w }) and where the letters end.
 */
export function drawFamilyStampAt(ctx, x, y, h, { crayon = 1, lit = 0, click = 0 } = {}) {
  const L = stampLayout(ctx),
    k = h / L.px,
    X = (px) => x + (px - (L.left - 2)) * k,
    Y = (py) => y + (py - L.base) * k;
  ctx.save();
  // the letters that glow, behind them
  ctx.fillStyle = "rgba(255,230,120,.75)";
  L.letters.forEach((l, i) => i < lit && l.c !== " " && ctx.fillRect(X(l.x) - 2, Y(L.top) - 4 * k, l.w * k + 4, (L.base - L.top) * k + 8 * k));
  ctx.translate(x - (L.left - 2) * k, y - L.base * k);
  ctx.scale(k, k);
  const parts = drawFamilyStamp(ctx, { paintOut: false, crayon: crayon > 0, crayonAlpha: crayon, note: false });
  // the brochure's M landing: its two feet on the lost letter's
  if (click > 0) {
    ctx.fillStyle = `rgba(198,38,30,${(0.5 * click).toFixed(2)})`;
    for (const f of parts.feet) ctx.fillRect(f.x, f.y, f.w, f.h);
  }
  ctx.restore();
  return {
    patch: { x: X(parts.gap.x0), y: Y(parts.gap.y0), w: (parts.gap.x1 - parts.gap.x0) * k, h: (parts.gap.y1 - parts.gap.y0) * k },
    letters: L.letters.filter((l) => l.c !== " ").map((l) => ({ c: l.c, x: X(l.x), w: l.w * k })),
    end: X(parts.letters.x1),
  };
}

/**
 * The crate bed's stamp on the home picture as the game draws it (960 x 640 game positions), once the layer is made:
 * the scraped gap and the letters' box, and the words. Null before the home picture was first drawn.
 */
export function familyStampOnRoom() {
  if (!made) return null;
  const kx = 960 / CRATE_BED.picture.w,
    ky = 640 / CRATE_BED.picture.h,
    box = (b) => ({ x0: b.x0 * kx, x1: b.x1 * kx, y0: b.y0 * ky, y1: b.y1 * ky });
  return { gap: box(made.gap), letters: box(made.letters), text: "_" + made.letters.text };
}

/**
 * The snack tin painted on the party hall's snack bar (docs/locked-rooms/hall-room-empty-v2.png), in that picture's
 * pixels: its blue lid still says the old name in white script. The layer paints the lid blue again and puts the new
 * name on it (two thin white lines under a little yellow star), tipped the way the tin sits.
 */
export const HALL_TIN = Object.freeze({
  picture: Object.freeze({ w: 1280, h: 830 }),
  lid: Object.freeze({ cx: 1106, cy: 659, rx: 13.5, ry: 11.5, tilt: -0.35 }),
  blue: "rgb(27,69,131)",
});
let tinMade = null;
/** Draws the tin's new lid on `c` (a 2D context in the hall picture's pixels). Returns its parts. */
export function drawTinLid(c) {
  const T = HALL_TIN.lid,
    words = snackLine("tin-label").split(" ");
  c.save();
  c.translate(T.cx, T.cy);
  c.rotate(T.tilt);
  c.beginPath();
  c.ellipse(0, 0, T.rx, T.ry, 0, 0, Math.PI * 2);
  c.fillStyle = HALL_TIN.blue;
  c.fill();
  // the little star
  c.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? 1.2 : 2.8,
      a = -Math.PI / 2 + (i * Math.PI) / 5;
    c.lineTo(r * Math.cos(a), -6.6 + r * Math.sin(a));
  }
  c.closePath();
  c.fillStyle = "#ffcf33";
  c.fill();
  // the name, two thin white lines
  c.fillStyle = "#ffffff";
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.font = `600 7px system-ui, -apple-system, sans-serif`;
  words.forEach((w, i) => c.fillText(w, 0, -0.6 + i * 7, T.rx * 2 - 3));
  c.restore();
  tinMade = { words };
  return tinMade;
}

// What each locked picture gets layered over it (picture id: the size the drawing is in, and the drawing).
const LAYERS = {
  // (and the crayon chart over his bed, cake-chart.js: story pass 28-52, E4; for Brian's yes)
  "home-closed": [CRATE_BED.picture, (c, crayon) => (drawFamilyStamp(c, { crayon }), drawCakeChart(c))],
  "home-open": [CRATE_BED.picture, (c, crayon) => (drawFamilyStamp(c, { crayon }), drawCakeChart(c))],
  hall: [HALL_TIN.picture, drawTinLid],
};
/** The locked pictures that get a layer for the snack's name: the two home pictures (the crate bed) and the hall (the tin). */
export const SNACK_LAYER_PICTURES = Object.freeze(Object.keys(LAYERS));

/**
 * His old crayon "ST" in the stamp's scraped gap: off everywhere in the chapter (Brian, 2026-11-27, video note r5 7:00:
 * "I don't like the hand-drawn ST. It should just be faded"; question 121, the pick A, a placeholder until he answers).
 * q: 121. To bring the crayon layer back, set this to true.
 */
export const STAMP_CRAYON = false;
const layered = new Map();
// Whether his crayon is still in the stamp's gap (he rubs it out in the evening of Day 2, 39b): asked of the rebuilt
// beats through the bridge (setCrayonSource), true until one says it is gone.
let crayonNow = () => true;
/** The bridge tells the layer how to know whether his crayon is still there (a function returning true or false). */
export function setCrayonSource(fn) {
  crayonNow = typeof fn === "function" ? fn : () => true;
}
const ready = (img) => !!img && !!img.complete && !!img.naturalWidth;
// (tests: whether the home picture handed out last had his crayon)
let lastCrayon = null;
let handedHall = 0,
  byLunch = 0; // (tests: the lunch sneak's own hall drawing)
/**
 * The locked picture `img` for picture id `id` with its layer for the snack's name: the family's stamp over the crate
 * bed's old badge (the home pictures), the new lid on the snack bar's tin (the hall). A canvas the picture's size that
 * draws like the Image (complete, naturalWidth, naturalHeight, src), made once. Any other picture, or one still
 * loading, comes back as it is. `by` names the caller for the tests ("lunch": the lunch sneak draws the hall itself).
 */
export function withSnackLayers(id, img, by = "") {
  const layer = LAYERS[id];
  if (!layer || !ready(img) || img.snackLayer) return img;
  const crayon = STAMP_CRAYON && !!crayonNow(),
    key = id + "|" + img.src + "|" + crayon;
  if (!layered.has(key)) {
    if (typeof document === "undefined") return img;
    const w = img.naturalWidth,
      h = img.naturalHeight,
      cv = document.createElement("canvas");
    cv.width = w;
    cv.height = h;
    cv.pictureLayer = true;
    const c = cv.getContext("2d");
    if (!c) return img;
    c.drawImage(img, 0, 0);
    c.save();
    c.scale(w / layer[0].w, h / layer[0].h);
    layer[1](c, crayon);
    c.restore();
    // (its own src for each crayon: the night tint is cached by the picture's src, night-look.js)
    Object.assign(cv, { complete: true, naturalWidth: w, naturalHeight: h, src: img.src + "#snack-layer" + (crayon ? "" : "-nocrayon"), snackLayer: true, crayon });
    layered.set(key, cv);
  }
  id === "hall" ? handedHall++ : ((handed++), (lastCrayon = crayon));
  by === "lunch" && byLunch++;
  return layered.get(key);
}

/**
 * The station's stamp on a crate the game draws (60-frame-draw.js Xn and the old calendar), centred at (x, y),
 * `s` times its size: a blue star and the snack's name in thin blue letters (about 124 by 30 at s = 1, the old
 * badge's room). Returns its words (tests).
 */
export function drawStationStamp(ctx, x, y, s) {
  const words = snackLine("stamp-station");
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  // the star
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? 3.4 : 8,
      a = -Math.PI / 2 + (i * Math.PI) / 5;
    ctx.lineTo(-52 + r * Math.cos(a), r * Math.sin(a));
  }
  ctx.closePath();
  ctx.fillStyle = "#2f6fd6";
  ctx.fill();
  // the name, thin
  ctx.font = `500 15px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  let w = ctx.measureText(words).width;
  const room = 96;
  if (w > room) ctx.font = `500 ${Math.floor((15 * room) / w)}px system-ui, -apple-system, sans-serif`;
  ctx.fillStyle = "#2f6fd6";
  ctx.fillText(words, 8, 1);
  // a thin line under it
  w = Math.min(room, ctx.measureText(words).width);
  ctx.strokeStyle = "#2f6fd6";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(8 - w / 2, 10);
  ctx.lineTo(8 + w / 2, 10);
  ctx.stroke();
  ctx.restore();
  return words;
}
