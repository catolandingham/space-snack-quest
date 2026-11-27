/**
 * The Stars Cakes / Mars Cakes thread's shared names and the stamp on Squatch's crate bed (decided 2026-11-26, the
 * Mars Cakes thread): the station's snack is STARS CAKES (many kinds); his family makes MARS CAKES; his crate's stamp
 * has faded to "_ARS CAKES" (a scraped, bare patch one wide letter across, with two faint red marks, the feet of the
 * lost M), and years ago he wrote a wobbly crayon "ST" in the gap. One file, so the rename lands in one place.
 * PLACEHOLDER drawings for Brian (the stamp sits as a layer on the locked home picture's crate: his yes first).
 */
export const STARS_CAKES = "STARS CAKES";
export const MARS_CAKES = "MARS CAKES";
/** The crate's stamp: the letters left after the scraped first one. */
export const CRATE_STAMP_LETTERS = "ARS CAKES";
const STAMP_RED = "#d8342c";

/** Fat red block letters (the Mars Cakes stamp's look), `h` tall, left edge at x, baseline at y. Returns the width. */
export function drawFatLetters(ctx, text, x, y, h, color = STAMP_RED, a = 1) {
  ctx.save();
  ctx.globalAlpha *= a;
  ctx.font = `900 ${h}px "Arial Black", Impact, system-ui, sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(1, h * 0.1);
  ctx.strokeStyle = "rgba(90,20,16,.55)";
  ctx.strokeText(text, x, y);
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  const w = ctx.measureText(text).width;
  ctx.restore();
  return w;
}

/**
 * The crate's stamp, its letters `h` tall, the scraped patch's left edge at x, baseline y. `st` (0 to 1) how much of
 * his crayon "ST" is still there (1, until he rubs it out); `lit` how many of the stamp's letters glow (the brochure
 * slid along them, 39b); `click` (0 to 1) the brochure's M landing on the two faint marks. Returns the boxes: the
 * patch and each letter (the close-up lines the brochure's letters up with them).
 */
export function drawCrateStamp(ctx, x, y, h, { st = 1, lit = 0, click = 0 } = {}) {
  ctx.save();
  ctx.font = `900 ${h}px "Arial Black", Impact, system-ui, sans-serif`;
  const mW = ctx.measureText("M").width,
    letters = [];
  // the scraped patch: bare wood, scratched, with the two faint red feet of the lost M
  ctx.fillStyle = "rgba(232,196,140,.9)";
  ctx.fillRect(x - 2, y - h * 0.86, mW + 4, h * 0.92);
  ctx.strokeStyle = "rgba(120,80,40,.45)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(x + i * (mW / 5), y - h * 0.8);
    ctx.lineTo(x + i * (mW / 5) + mW * 0.3, y - h * 0.1);
    ctx.stroke();
  }
  ctx.fillStyle = `rgba(216,52,44,${(0.35 + 0.65 * click).toFixed(2)})`;
  ctx.fillRect(x + mW * 0.06, y - h * 0.16, mW * 0.18, h * 0.16);
  ctx.fillRect(x + mW * 0.76, y - h * 0.16, mW * 0.18, h * 0.16);
  // his crayon ST in the gap, wobbly
  if (st > 0) {
    ctx.save();
    ctx.globalAlpha = st;
    ctx.font = `800 ${Math.round(h * 0.62)}px "Comic Sans MS", "Chalkboard SE", system-ui, sans-serif`;
    ctx.fillStyle = "#3478f6";
    ctx.translate(x + mW / 2, y - h * 0.22);
    ctx.rotate(-0.12);
    ctx.textAlign = "center";
    ctx.fillText("ST", 0, 0);
    ctx.restore();
  }
  // the letters left
  let cx = x + mW + h * 0.08;
  for (let i = 0; i < CRATE_STAMP_LETTERS.length; i++) {
    const c = CRATE_STAMP_LETTERS[i],
      w = ctx.measureText(c).width;
    if (c !== " ") {
      i < lit && ((ctx.fillStyle = "rgba(255,230,120,.75)"), ctx.fillRect(cx - 2, y - h * 0.9, w + 4, h * 1.0));
      drawFatLetters(ctx, c, cx, y, h);
      letters.push({ c, x: cx, w });
    }
    cx += w + (c === " " ? h * 0.12 : h * 0.04);
  }
  ctx.restore();
  return { patch: { x: x - 2, y: y - h * 0.86, w: mW + 4, h: h * 0.92 }, letters, end: cx };
}
