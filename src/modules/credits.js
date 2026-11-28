/**
 * The Credits screen (Brian 2026-11-26, #31): a "Credits" button on the title screen opens a small full-screen list of
 * who made the music and the sounds (credits-lines.js); a tap anywhere closes it. The older program draws the title
 * and asks here for the button (titleExtras) and for a tap on it (titleTap), guarded through window.SSQ.
 */
import { CREDITS_LINES, creditsLine } from "./credits-lines.js";
import { openFullScreen, closeFullScreen, fullScreenOpen } from "./fullscreen.js";

const INK = "#1e2430";
/** The button on the title screen (game positions, 960 x 640): left of the walking Squatch, clear of the chapters. */
export const CREDITS_BUTTON = Object.freeze({ x: 24, y: 388, w: 140, h: 44 });
let shown = null;

/** Draws the "Credits" button on the title screen. */
export function drawCreditsButton(ctx) {
  const b = CREDITS_BUTTON;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(b.x, b.y, b.w, b.h, b.h / 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = INK;
  ctx.stroke();
  ctx.font = "800 20px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = INK;
  ctx.fillText(creditsLine("button-credits"), b.x + b.w / 2, b.y + b.h / 2 + 1);
  ctx.restore();
}

// Lines of `text` no wider than `width` at the current font.
function wrapText(ctx, text, width) {
  const out = [];
  let line = "";
  for (const w of text.split(" ")) {
    const next = line ? line + " " + w : w;
    if (line && ctx.measureText(next).width > width) ((out.push(line)), (line = w));
    else line = next;
  }
  line && out.push(line);
  return out;
}

/** Draws the Credits screen on a `w` x `h` page. Returns every line it drew and how far down it went (tests). */
export function drawCreditsScreen(ctx, w, h) {
  ctx.fillStyle = "#eef3fb";
  ctx.fillRect(0, 0, w, h);
  const m = Math.max(16, w * 0.05),
    width = Math.min(w - m * 2, 720),
    x = w / 2,
    drew = [];
  let y = Math.max(40, h * 0.06);
  for (const l of CREDITS_LINES) {
    if (l.who === "button") continue;
    const size = l.who === "title" ? 32 : l.who === "head" ? 22 : 16,
      weight = l.who === "credit" ? 600 : 900;
    ctx.font = `${weight} ${size}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = l.who === "head" ? "#3478f6" : INK;
    l.who === "head" && (y += 8);
    for (const part of wrapText(ctx, l.text, width)) {
      ctx.fillText(part, x, y);
      drew.push(part);
      y += size * 1.35;
    }
    y += l.who === "title" ? 10 : 4;
  }
  // a close mark in the corner: a tap anywhere closes the screen
  const r = 22,
    cx = w - m - r,
    cy = m + r;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = INK;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 8, cy - 8);
  ctx.lineTo(cx + 8, cy + 8);
  ctx.moveTo(cx + 8, cy - 8);
  ctx.lineTo(cx - 8, cy + 8);
  ctx.lineWidth = 4;
  ctx.stroke();
  return { lines: drew, bottom: Math.round(y), h };
}

/** Opens the Credits screen (a tap anywhere closes it). */
export function openCredits() {
  // (a tap closes it: a finger down and up on the screen itself; the press that opened it does not count)
  let down = false;
  openFullScreen({
    label: "credits",
    draw(ctx, w, h) {
      shown = drawCreditsScreen(ctx, w, h);
    },
    pointer(kind) {
      kind === "down" && (down = true);
      kind === "up" && down && closeFullScreen();
    },
  });
}

/** A tap on the title screen at (x, y), game positions: true when it was on the Credits button (it opens). */
export function creditsTap(x, y) {
  const b = CREDITS_BUTTON;
  if (fullScreenOpen() || x < b.x || x > b.x + b.w || y < b.y || y > b.y + b.h) return false;
  openCredits();
  return true;
}
/** Tests: what the Credits screen drew last ({ lines, bottom, h }), or null. */
export function creditsShown() {
  return shown ? { ...shown, lines: shown.lines.slice() } : null;
}
