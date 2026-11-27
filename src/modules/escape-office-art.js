/**
 * Beats 50 and 51 (story pass 2026-11-26): drawings over the locked hallway and office pictures (never changed) and the
 * office's close-ups.
 *   sign     a small sign on the office door: "CLOSED. Back at 9." (why it is empty)
 *   things   the manager's mug on the filing cabinet; a photo frame on the desk (empty, a brass tag)
 *   spin     stars circling his head after SPIN · chair
 *   light    once, a robot's flashlight cone sliding past the open door while he hides under the desk
 *   esmug    the mug, close: GALAXY'S OKAYEST MANAGER
 *   esdrawer the drawer, close: one snack cake, a bite out of it
 *   esframe  the frame, close: empty, its brass tag NEXT MONTH: MOPS
 * Every drawing is a PLACEHOLDER for Brian; every word from escape-lines.js.
 */
import { escapeWords } from "./escape-lines.js";
import { ES_HALLWAY, OFFICE } from "./escape-place.js";
import { esRect, esPaint, esWords, ES_INK } from "./escape-art.js";

const TAU = Math.PI * 2;

/** The sign on the office door (50). */
export function drawClosedSign(ctx) {
  const d = ES_HALLWAY.door,
    cx = (d.x0 + d.x1) / 2,
    y = d.y0 + 20;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx - 20, y - 12);
  ctx.lineTo(cx, y - 24);
  ctx.lineTo(cx + 20, y - 12);
  ctx.strokeStyle = ES_INK;
  ctx.lineWidth = 2;
  ctx.stroke();
  esRect(ctx, cx - 44, y - 12, 88, 40, 4);
  esPaint(ctx, "#fffdf8", 2.5);
  const [a, b] = escapeWords("sign-closed").split(". ");
  esWords(ctx, a + ".", cx, y + 3, 14, "#e5533d", "center", 900);
  esWords(ctx, b, cx, y + 19, 12, ES_INK, "center", 800);
  ctx.restore();
  return escapeWords("sign-closed");
}
/** The mug on the filing cabinet and the photo frame on the desk (51). */
export function drawOfficeThings(ctx) {
  const m = OFFICE.mug.thing,
    f = OFFICE.frame.thing;
  esRect(ctx, m.x0 + 4, m.y0 + 8, m.x1 - m.x0 - 12, m.y1 - m.y0 - 8, 4);
  esPaint(ctx, "#ffffff", 2.5);
  ctx.beginPath();
  ctx.arc(m.x1 - 8, (m.y0 + m.y1) / 2 + 4, 7, -1.2, 1.2);
  ctx.strokeStyle = ES_INK;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  esRect(ctx, f.x0, f.y0, f.x1 - f.x0, f.y1 - f.y0, 2);
  esPaint(ctx, "#c9a36b", 2.5);
  esRect(ctx, f.x0 + 5, f.y0 + 5, f.x1 - f.x0 - 10, f.y1 - f.y0 - 16, 1);
  esPaint(ctx, "#eef2f8", 1.5);
  ctx.fillStyle = "#e9c46a";
  ctx.fillRect(f.x0 + 8, f.y1 - 9, f.x1 - f.x0 - 16, 5);
}
/** Stars circling his head after SPIN · chair. */
export function drawSpinStars(ctx, head, age, t) {
  const cx = head.x + head.w / 2,
    cy = head.y - 6;
  ctx.save();
  ctx.globalAlpha = Math.max(0, 1 - age / 1.6);
  for (let i = 0; i < 3; i++) {
    const a = t * 5 + (i * TAU) / 3,
      x = cx + Math.cos(a) * 26,
      y = cy + Math.sin(a) * 8;
    ctx.beginPath();
    for (let k = 0; k < 10; k++) {
      const r = k % 2 ? 3 : 8,
        b = (k * TAU) / 10 - TAU / 4;
      ctx.lineTo(x + Math.cos(b) * r, y + Math.sin(b) * r);
    }
    ctx.closePath();
    esPaint(ctx, "#ffcf33", 1.5);
  }
  ctx.restore();
}
/** A robot's flashlight cone sliding past the open door, across the floor (`k` 0 to 1 of its pass). */
export function drawPassingLight(ctx, k) {
  const ox = OFFICE.door.x,
    oy = OFFICE.door.y - 30,
    a = 0.6 + k * 1.9;
  ctx.save();
  ctx.fillStyle = "rgba(214,232,255,.42)"; // (a cold white flashlight, not the goal's gold)
  ctx.beginPath();
  ctx.moveTo(ox, oy);
  ctx.lineTo(ox + Math.cos(a - 0.22) * 420, oy + Math.sin(a - 0.22) * 420);
  ctx.lineTo(ox + Math.cos(a + 0.22) * 420, oy + Math.sin(a + 0.22) * 420);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  return { a: +a.toFixed(2) };
}

// ---------- the close-ups (cutaway.js PANELS; each waits for NEXT) ----------
function mugPanel(ctx) {
  ctx.fillStyle = "#8b93a7";
  ctx.fillRect(0, 0, 960, 640);
  esRect(ctx, 270, 120, 380, 420, 30);
  esPaint(ctx, "#ffffff", 6);
  ctx.beginPath();
  ctx.arc(660, 330, 90, -1.3, 1.3);
  ctx.strokeStyle = ES_INK;
  ctx.lineWidth = 16;
  ctx.stroke();
  const words = escapeWords("mug").split(" ");
  esWords(ctx, words[0], 460, 260, 52, "#3478f6", "center", 900);
  esWords(ctx, words[1], 460, 330, 52, "#3478f6", "center", 900);
  esWords(ctx, words[2], 460, 400, 52, "#3478f6", "center", 900);
  return { pic: "esmug", words: escapeWords("mug") };
}
function drawerPanel(ctx) {
  ctx.fillStyle = "#59657d";
  ctx.fillRect(0, 0, 960, 640);
  esRect(ctx, 120, 140, 720, 420, 12);
  esPaint(ctx, "#2d323e", 6);
  // one snack cake, a bite out of it
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(480, 360, 170, 110, 0, 0, TAU);
  ctx.arc(620, 300, 60, 0, TAU, true);
  ctx.fillStyle = "#c98b4a";
  ctx.fill("evenodd");
  ctx.strokeStyle = ES_INK;
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.restore();
  return { pic: "esdrawer", bite: true };
}
function framePanel(ctx) {
  ctx.fillStyle = "#c4a574";
  ctx.fillRect(0, 0, 960, 640);
  esRect(ctx, 250, 60, 460, 480, 10);
  esPaint(ctx, "#c9a36b", 8);
  esRect(ctx, 300, 110, 360, 330, 4);
  esPaint(ctx, "#eef2f8", 4);
  esRect(ctx, 320, 470, 320, 54, 6);
  esPaint(ctx, "#e9c46a", 4);
  esWords(ctx, escapeWords("frame"), 480, 497, 34, ES_INK, "center", 900);
  return { pic: "esframe", words: escapeWords("frame") };
}
export const OFFICE_PANELS = Object.freeze({ esmug: [mugPanel], esdrawer: [drawerPanel], esframe: [framePanel] });
