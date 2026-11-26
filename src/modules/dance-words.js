/**
 * The dance's words over the close-up (Brian 2026-11-26, #45): the speed word popping up as each routine starts
 * ("Dance!", "Faster!", "Super fast!", "Top speed!") and the gold "Super dancer!" badge after a perfect routine at top
 * speed, kept while the dance is open. Words come only from party-lines.js. Screen pixels.
 */
import { partyLine } from "./party-lines.js";
import { SPEED_LINES, SPEED_POP } from "./party-dance.js";

const GOLD = "#ffcf33",
  INK = "#1e2430";

// Big words with a dark edge, so they read on anything.
function bigWords(ctx, text, x, y, size, fill, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.font = `900 ${size}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.lineWidth = size * 0.2;
  ctx.strokeStyle = INK;
  ctx.strokeText(text, x, y);
  ctx.fillStyle = fill;
  ctx.fillText(text, x, y);
  ctx.restore();
}

/** Where the speed word and the badge sit on a `w` x `h` dance (tests). */
export function danceWordsAt(w, h) {
  return { pop: { x: w / 2, y: h * 0.43 }, badge: { x: w / 2, y: h * 0.37, w: Math.min(w * 0.7, 300), h: Math.max(44, h * 0.06) } };
}

/** Draws the speed word (while it is up) and the badge (once earned). Returns what it drew (tests). */
export function drawDanceWords(ctx, w, h, d) {
  if (!d) return null;
  const at = danceWordsAt(w, h),
    k = (d.t || 0) - (d.popAt || 0),
    out = { pop: "", badge: false };
  if (!d.over && k >= 0 && k < SPEED_POP) {
    const word = partyLine(SPEED_LINES[Math.max(0, Math.min(SPEED_LINES.length - 1, d.level || 0))]),
      grow = Math.min(1, k / 0.2),
      size = Math.max(36, Math.round(Math.min(w, h) * 0.12)) * (0.7 + 0.3 * grow);
    bigWords(ctx, word, at.pop.x, at.pop.y, size, "#ffffff", k > SPEED_POP - 0.4 ? (SPEED_POP - k) / 0.4 : 1);
    out.pop = word;
  }
  if (d.superDancer) {
    const b = at.badge;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h, b.h / 2);
    ctx.fillStyle = GOLD;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = INK;
    ctx.stroke();
    ctx.restore();
    bigWords(ctx, partyLine("badge-super-dancer"), b.x, b.y + 1, Math.round(b.h * 0.48), "#ffffff");
    out.badge = true;
  }
  return out;
}
