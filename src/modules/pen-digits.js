/**
 * Numbers written by hand in pen (Brian, 2026-11-26, note on beat 42: the office code on the pink slip is written in
 * pen, so it reads as someone wrote it there). Each digit is a few pen strokes (not a font), a little uneven, in blue
 * ink. Shared by the pink sheet wherever it is drawn (the escape; night one's close-up when it is rebuilt).
 */
// Each digit's strokes in a 10 x 16 box (x right, y down): "M" move, "L" line to, "Q" a curve (control, then end).
const STROKES = {
  0: [["M", 5, 0, "Q", 0, 0, 0, 8, "Q", 0, 16, 5, 16, "Q", 10, 16, 10, 8, "Q", 10, 0, 5, 0]],
  1: [["M", 2, 4, "L", 6, 0, "L", 6, 16]],
  2: [["M", 0, 4, "Q", 1, 0, 5, 0, "Q", 10, 0, 9, 5, "Q", 7, 9, 0, 16, "L", 10, 16]],
  3: [["M", 0, 2, "Q", 5, -2, 9, 2, "Q", 10, 7, 4, 8, "Q", 11, 9, 9, 14, "Q", 5, 18, 0, 14]],
  4: [["M", 7, 16, "L", 7, 0, "L", 0, 11, "L", 10, 11]],
  5: [["M", 9, 0, "L", 1, 0, "L", 0, 7, "Q", 5, 4, 9, 8, "Q", 11, 15, 5, 16, "Q", 1, 16, 0, 14]],
  6: [["M", 8, 1, "Q", 1, 2, 0, 10, "Q", 0, 16, 5, 16, "Q", 10, 16, 10, 11, "Q", 9, 6, 4, 7, "Q", 1, 8, 0, 11]],
  7: [["M", 0, 0, "L", 10, 0, "L", 3, 16]],
  8: [["M", 5, 8, "Q", 1, 6, 1, 3, "Q", 2, 0, 5, 0, "Q", 9, 0, 9, 3, "Q", 10, 6, 5, 8, "Q", 0, 10, 0, 13, "Q", 1, 16, 5, 16, "Q", 10, 16, 10, 12, "Q", 10, 9, 5, 8]],
  9: [["M", 10, 5, "Q", 9, 9, 5, 9, "Q", 0, 9, 0, 5, "Q", 0, 0, 5, 0, "Q", 10, 0, 10, 5, "L", 9, 16]],
};
/** Writes `text` (digits) in pen, its middle at (x, y), each digit `h` tall. Returns what it wrote and its box. */
export function drawPenDigits(ctx, text, x, y, h, color = "#1d3fa8") {
  const k = h / 16,
    step = 13 * k,
    w = step * String(text).length - 3 * k;
  let px = x - w / 2,
    n = 0;
  ctx.save();
  ctx.lineWidth = Math.max(1.6, k * 1.9);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = color;
  for (const d of String(text)) {
    // a hand: each digit leans a little and sits a little up or down
    const lean = 0.06 + ((n * 37) % 5) * 0.012,
      dy = (((n * 53) % 3) - 1) * k * 0.8;
    ctx.save();
    ctx.translate(px, y - h / 2 + dy);
    ctx.transform(1, 0, -lean, 1, lean * h, 0);
    for (const s of STROKES[d] || []) {
      ctx.beginPath();
      for (let i = 0; i < s.length; ) {
        const op = s[i];
        if (op === "M") (ctx.moveTo(s[i + 1] * k, s[i + 2] * k), (i += 3));
        else if (op === "L") (ctx.lineTo(s[i + 1] * k, s[i + 2] * k), (i += 3));
        else (ctx.quadraticCurveTo(s[i + 1] * k, s[i + 2] * k, s[i + 3] * k, s[i + 4] * k), (i += 5));
      }
      ctx.stroke();
    }
    ctx.restore();
    px += step;
    n++;
  }
  ctx.restore();
  return { text: String(text), pen: true, box: { x0: x - w / 2, x1: x + w / 2, y0: y - h / 2, y1: y + h / 2 } };
}
