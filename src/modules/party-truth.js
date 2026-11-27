/**
 * Truth or fib (Brian, story pass 28-52, section E2b; his answer to question 12: "A", as written). At home after the
 * party, Mops asks "Did you go to the party?" and the player chooses, with two big buttons on the whole phone screen,
 * each with a small picture so it reads without words:
 *   TELL · the truth        Squatch with his paws open (a heart over him)
 *   FIB · "I stayed in"     Squatch looking at the ceiling, whistling (music notes)
 * Nobody is punished and no points change (party-talk.js plays each path). Words come from party-lines.js. Screen
 * pixels.
 */
import { partyLine } from "./party-lines.js";
import { rr, oval, words, INK, drawNote } from "./party-art.js";
import { heart } from "./party-free-art.js";

export const TRUTH_CHOICES = Object.freeze(["tell", "fib"]);

/** Where the two buttons sit on a screen `w` by `h`: one above the other, each with its picture on the left. */
export function truthLayout(w, h) {
  const m = Math.max(16, Math.round(w * 0.05)),
    bw = Math.min(w - m * 2, 460),
    bh = Math.max(120, Math.min(200, Math.round(h * 0.24))),
    gap = Math.max(18, Math.round(h * 0.04)),
    top = Math.round(h / 2 - bh - gap / 2);
  return { w, h, buttons: TRUTH_CHOICES.map((id, i) => ({ id, x: Math.round(w / 2 - bw / 2), y: top + i * (bh + gap), w: bw, h: bh })) };
}

/** The button under the finger at (x, y): "tell", "fib" or "". */
export function truthButtonAt(L, x, y) {
  const b = L.buttons.find((q) => x >= q.x && x <= q.x + q.w && y >= q.y && y <= q.y + q.h);
  return b ? b.id : "";
}

/** Squatch with his paws open, a heart over him (`s` the picture's height). */
function drawTellPicture(ctx, s, art) {
  for (const k of [-1, 1]) oval(ctx, k * s * 0.3, -s * 0.42, s * 0.07, s * 0.09, "#6b4428", 2);
  art.squatch(ctx, 0, s * 0.42, s / 78);
  heart(ctx, 0, -s * 0.62, s * 0.11, "#ff6fa0");
}
/** Squatch tipped back, looking up at the ceiling, whistling (notes rising beside his mouth). */
function drawFibPicture(ctx, s, art, t) {
  ctx.save();
  ctx.translate(0, s * 0.42);
  ctx.rotate(-0.12);
  art.squatch(ctx, 0, 0, s / 78);
  ctx.restore();
  drawNote(ctx, s * 0.26, -s * 0.36 - Math.sin(t * 3) * 4, s * 0.09, "#3478f6");
  drawNote(ctx, s * 0.38, -s * 0.56 - Math.sin(t * 3 + 1) * 4, s * 0.08, "#ff5fa8");
}

/** Draws the choice. `st`: { pressed ("tell", "fib" or "") }; `art`: { squatch (ctx, x, y, scale) }; `t` seconds. */
export function drawTruthChoice(ctx, L, st, art, t) {
  ctx.fillStyle = "#1e2430";
  ctx.fillRect(0, 0, L.w, L.h);
  for (const b of L.buttons) {
    const down = st.pressed === b.id ? 3 : 0,
      pic = b.h * 0.82;
    rr(ctx, b.x, b.y + down, b.w, b.h, 22, "#fffdf8", 3);
    ctx.save();
    ctx.translate(b.x + pic * 0.62, b.y + b.h / 2 + down);
    b.id === "tell" ? drawTellPicture(ctx, pic, art) : drawFibPicture(ctx, pic, art, t || 0);
    ctx.restore();
    const [verb, thing] = partyLine(b.id === "tell" ? "button-tell" : "button-fib").split(" · "),
      size = Math.max(20, Math.round(Math.min(b.h * 0.2, b.w * 0.075))),
      tx = b.x + pic * 1.2 + (b.w - pic * 1.2) / 2;
    words(ctx, verb + " ·", tx, b.y + b.h / 2 - size * 0.7 + down, Math.round(size * 1.25), b.id === "tell" ? "#2b9a6a" : "#d0662a");
    words(ctx, thing, tx, b.y + b.h / 2 + size * 0.75 + down, size, INK);
  }
}
