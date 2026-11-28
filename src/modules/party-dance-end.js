/**
 * The end of a dance routine (Brian 2026-11-25, his click "One routine, then dance again faster"): once the
 * routine's cheer is over, two big buttons show over the dance, under the row of marks and above the band's heads,
 * clear of Squatch: the green one shows the next speed's word ("Faster!", "Super fast!", "Top speed!": Brian
 * 2026-11-26, #45; the same routine one speed faster, party-dance.js danceAgain) and "Back to the party" (it closes
 * the dance, as the corner's X does). Two fast-forward arrows on the green button show "faster" too. Words come only from party-lines.js. Screen pixels.
 */
import { partyLine } from "./party-lines.js";
import { rr, words, INK } from "./party-art.js";
import { danceBand, SPEED_LINES } from "./party-dance.js";

// How tall a button is, and the gap between them (a 44-pixel target or more).
const BH = 54,
  GAP = 10;

/** Where the two buttons are on a `w` x `h` dance: [{ id: "again" | "back", x, y, w, h }]. Side by side when wide. */
export function danceEndButtons(w, h) {
  const m = Math.max(16, Math.round(w * 0.05)),
    B = danceBand(w, h),
    // under the row of marks, and never down onto the band's heads (on a short, wide screen the row is higher)
    top = Math.round(Math.min(Math.max(86, h * 0.105) + 26, B.feet - B.tall * 1.02 - BH - 6));
  if (w >= 600) {
    const bw = Math.min(300, (w - m * 2 - GAP) / 2);
    return [
      { id: "again", x: w / 2 - GAP / 2 - bw, y: top, w: bw, h: BH },
      { id: "back", x: w / 2 + GAP / 2, y: top, w: bw, h: BH },
    ];
  }
  const bw = Math.min(w - m * 2, 340);
  return [
    { id: "again", x: w / 2 - bw / 2, y: top, w: bw, h: BH },
    { id: "back", x: w / 2 - bw / 2, y: top + BH + GAP, w: bw, h: BH },
  ];
}
/** The button under a finger at (x, y): "again", "back" or "". */
export function danceEndAt(w, h, x, y) {
  const b = danceEndButtons(w, h).find((q) => x >= q.x && x <= q.x + q.w && y >= q.y && y <= q.y + q.h);
  return b ? b.id : "";
}
/** The green button's words: the next speed's word (Brian 2026-11-26, #45), the fastest's at top speed. */
export const againWords = (level) => partyLine(SPEED_LINES[Math.min(SPEED_LINES.length - 1, (level || 0) + 1)]);
/** Draws the two buttons (`pressed`: the one a finger is on, drawn pushed in). `level` is the speed just danced. */
export function drawDanceEnd(ctx, w, h, pressed = "", level = 0) {
  for (const b of danceEndButtons(w, h)) {
    const main = b.id === "again",
      down = pressed === b.id ? 2 : 0;
    rr(ctx, b.x, b.y + down, b.w, b.h, b.h / 2, main ? "#2bc48a" : "#fffdf8", 3);
    words(ctx, main ? againWords(level) : partyLine("button-back"), b.x + b.w / 2, b.y + b.h / 2 + down + 1, 22, main ? "#ffffff" : INK);
    // "faster", drawn, not written: two fast-forward arrows at the green button's right end
    if (main) {
      const cy = b.y + b.h / 2 + down,
        x0 = b.x + b.w - 44;
      ctx.fillStyle = "#ffffff";
      for (const dx of [0, 13]) {
        ctx.beginPath();
        ctx.moveTo(x0 + dx, cy - 9);
        ctx.lineTo(x0 + dx + 13, cy);
        ctx.lineTo(x0 + dx, cy + 9);
        ctx.closePath();
        ctx.fill();
      }
    }
  }
}
