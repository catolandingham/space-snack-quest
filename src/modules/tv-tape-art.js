/**
 * The start of the TV story (Brian 2026-11-26, #39: "yes to the tape and a news report"): two full-screen pictures in
 * the shared cutaway (cutaway.js, id "tvtape") before "Years ago, on Stormtop...".
 *   tape  Squatch's paw pushes an old tape into the player under the TV, and its light comes on. No words and
 *         nothing to tap: it plays by itself (rule 3, "30a").
 *   news  The old news report's title card on the TV screen: "STORMTOP NEWS" (a suggestion: the title words wait for
 *         Brian's yes, tv-story-lines.js), with a little planet and scan lines. It has words, so it waits for NEXT.
 * PLACEHOLDER drawings, in the game's style (dark outlines, flat colours). Words come only from tv-story-lines.js.
 */
import { tvLine } from "./tv-story-lines.js";

const INK = "#1e2430",
  FUR = "#8b5a3c",
  FUR_DARK = "#6b4428",
  PAD = "#f4c39a";

function box(ctx, x, y, w, h, r, fill, lw = 4) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
  if (lw) {
    ctx.lineWidth = lw;
    ctx.strokeStyle = INK;
    ctx.stroke();
  }
}

/** The tape going in: `t` seconds into the picture. Returns what it drew (tests). */
export function drawTapeIn(ctx, t) {
  ctx.fillStyle = "#e9e3d6";
  ctx.fillRect(0, 0, 960, 640);
  ctx.fillStyle = "#cdbb98";
  ctx.fillRect(0, 430, 960, 210);
  // the TV above (its bottom edge), the player under it on the shelf
  box(ctx, 220, -40, 520, 210, 18, "#2b2f3c");
  box(ctx, 250, -20, 460, 160, 10, "#4a505c", 3);
  box(ctx, 200, 230, 560, 190, 16, "#9aa3b2");
  box(ctx, 290, 300, 380, 36, 6, "#2b2f3c", 3); // the slot
  const k = Math.min(1, Math.max(0, (t - 0.3) / 1.1)),
    ease = k * k * (3 - 2 * k),
    lit = t > 1.5;
  // the light: green once the tape is in
  ctx.beginPath();
  ctx.arc(720, 380, 12, 0, Math.PI * 2);
  ctx.fillStyle = lit ? "#2bc48a" : "#59657d";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = INK;
  ctx.stroke();
  // the tape, sliding into the slot (it disappears into it from the top down)
  const ty = 470 - ease * 150;
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 318, 960, 400);
  ctx.clip();
  box(ctx, 300, ty, 360, 150, 8, "#1f2230");
  box(ctx, 380, ty + 36, 200, 56, 6, "#fffdf8", 3); // its blank label
  for (const cx of [430, 530]) {
    ctx.beginPath();
    ctx.arc(cx, ty + 64, 16, 0, Math.PI * 2);
    ctx.fillStyle = "#4a505c";
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
  // Squatch's paw pushing it, from below
  const py = ty + 150;
  ctx.beginPath();
  ctx.ellipse(480, py + 40, 120, 70, 0, 0, Math.PI * 2);
  ctx.fillStyle = FUR;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = INK;
  ctx.stroke();
  for (const [dx, dy] of [[-70, -40], [-24, -54], [24, -54], [70, -40]]) {
    ctx.beginPath();
    ctx.ellipse(480 + dx, py + 40 + dy, 26, 22, 0, 0, Math.PI * 2);
    ctx.fillStyle = FUR_DARK;
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(480 + dx, py + 44 + dy, 13, 10, 0, 0, Math.PI * 2);
    ctx.fillStyle = PAD;
    ctx.fill();
  }
  return { pic: "tape", tape: Math.round(ease * 100) / 100, lit };
}

/** The news report's title card on the TV screen. Returns what it drew (tests). */
export function drawNewsCard(ctx, t, engine) {
  ctx.fillStyle = "#1e2430";
  ctx.fillRect(0, 0, 960, 640);
  box(ctx, 60, 40, 840, 560, 40, "#3f5878", 8);
  // a little planet with a ring, turning
  ctx.save();
  ctx.translate(480, 250);
  ctx.beginPath();
  ctx.arc(0, 0, 92, 0, Math.PI * 2);
  ctx.fillStyle = "#e0a96d";
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = INK;
  ctx.stroke();
  ctx.rotate(-0.25 + 0.05 * Math.sin(t * 2));
  ctx.beginPath();
  ctx.ellipse(0, 0, 150, 34, 0, 0, Math.PI * 2);
  ctx.lineWidth = 8;
  ctx.strokeStyle = "#fff3b0";
  ctx.stroke();
  ctx.restore();
  const title = tvLine("news-title");
  engine && engine.text(title, 480, 450, 64, "#ffffff", "center", 900);
  // old-TV scan lines over it all
  ctx.fillStyle = "rgba(0,0,0,.12)";
  for (let y = 46 + ((t * 40) % 6); y < 596; y += 6) ctx.fillRect(64, y, 832, 2);
  return { pic: "news", news: title };
}

/** The two pictures, for the shared cutaway (cutaway.js PANELS "tvtape"). */
export const TAPE_PANELS = Object.freeze([(ctx, t) => drawTapeIn(ctx, t), (ctx, t, engine) => drawNewsCard(ctx, t, engine)]);
