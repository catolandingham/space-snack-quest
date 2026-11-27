/**
 * The two stamps a crate can carry (Brian, 2026-11-26, question 86, and the family-crate spec, 2.3 and 2.12):
 *   - The station's crates: the snack's name (snack-name.js) in thin blue letters with a blue star. Drawn by
 *     drawStationStamp, which the older program's crate (60-frame-draw.js rq, through the bridge) calls.
 *   - Squatch's own crate bed, his family's crate: big, fat red block letters, worn, with the first letter scraped
 *     off (a bare patch one wide letter across, the two faint red feet of the lost letter at its bottom), so only the
 *     rest of the word shows (snack-name.js FAMILY.FADED), and his old crayon "ST" in the gap. The two stamps never match.
 * The crate bed is part of the locked home pictures (docs/locked-rooms/home-room-empty-closed-v6.png and -open-v6),
 * whose badge still says the old name. The picture files never change: withCrateStamp(id, img) gives a copy of the
 * picture (a canvas that draws like the Image) with the old badge painted out in the crate's own wood and the new
 * stamp drawn over it, a layer for Brian's yes (docs/DECISIONS.md, "The snack renamed, and the crate bed's stamp (question 86)"). Every place that
 * draws a home picture gets it through night-look.js nightPicture, by day and by night.
 * PLACEHOLDER look (letter sizes, the red, the wear, the crayon) for Brian.
 */
import { snackLine } from "./snack-name.js";

/** The locked pictures that show the crate bed. */
export const CRATE_BED_PICTURES = Object.freeze(["home-closed", "home-open"]);

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
let made = null;
let handed = 0;
/** Tests: the layer's parts (null before it was made) and how many times a home picture came with it. */
export function crateStampDrawn() {
  return { made, handed };
}

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
export function drawFamilyStamp(c, { paintOut = true, crayon: withCrayon = true, note = true } = {}) {
  const B = CRATE_BED;
  const faded = snackLine("stamp-family-faded").replace(/^_/, ""),
    crayon = snackLine("stamp-family-crayon");
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
  // 2. sizes: one wide letter's gap plus the letters fill stampW
  let px = 40;
  c.font = FAT(px);
  const fit = () => c.measureText("M").width * 1.04 + c.measureText(faded).width;
  while (px > 16 && fit() > B.stampW) c.font = FAT(--px);
  const gapW = c.measureText("M").width * 1.04,
    textW = c.measureText(faded).width,
    left = Math.round((B.inner.x0 + B.inner.x1) / 2 - (gapW + textW) / 2),
    cap = px * 0.74,
    top = B.stampY - cap / 2,
    base = B.stampY + cap / 2;
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
  const sheet = typeof document !== "undefined" ? document.createElement("canvas") : null;
  const lettersX = left + gapW;
  if (sheet && sheet.getContext) {
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
  const wax = sheet && withCrayon ? document.createElement("canvas") : null;
  if (wax && wax.getContext) {
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
    c.save();
    c.globalAlpha = 0.92;
    c.drawImage(wax, left + gapW / 2 - wax.width / 2 - 1, B.stampY - cap * 0.12 - wax.height / 2);
    c.restore();
  }
  const parts = { gap, feet, letters: { x0: lettersX, x1: lettersX + textW, y0: top, y1: base, px, text: faded }, crayon: withCrayon ? { text: crayon, px: cpx } : null };
  if (note) made = parts; // (tests: the crate bed's, not another crate's)
  return parts;
}

const layered = new Map();
const ready = (img) => !!img && !!img.complete && !!img.naturalWidth;
/**
 * The locked picture `img` for picture id `id`, with the family's stamp layered over the crate bed's old badge: a
 * canvas the picture's size that draws like the Image (complete, naturalWidth, naturalHeight, src), made once. Any
 * other picture, or one still loading, comes back as it is.
 */
export function withCrateStamp(id, img) {
  if (!CRATE_BED_PICTURES.includes(id) || !ready(img) || img.crateStamp) return img;
  const key = id + "|" + img.src;
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
    c.scale(w / CRATE_BED.picture.w, h / CRATE_BED.picture.h);
    drawFamilyStamp(c);
    c.restore();
    Object.assign(cv, { complete: true, naturalWidth: w, naturalHeight: h, src: img.src + "#crate-stamp", crateStamp: true });
    layered.set(key, cv);
  }
  handed++;
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
