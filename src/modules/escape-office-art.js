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
 * Every drawing is a PLACEHOLDER for Brian, except the dust puff and the drawer's cake (round 8 final art, pending his
 * yes); every word from escape-lines.js.
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
/**
 * Dust off the filing cabinet as the office robot wipes it (round 7, r6 0:37: a robot comes in and dusts one thing):
 * little cartoon dust clouds (three bumps each, pale grey, the rooms' ink round them) rising and fading, and a few specks.
 * Final art, Brian's yes 2026-11-27 (round 8).
 */
export function drawDustPuff(ctx, x, y, t) {
  ctx.save();
  for (let i = 0; i < 4; i++) {
    const u = (t * 1.3 + i / 4) % 1,
      cx = x + (i - 1.5) * 13 + Math.sin(u * 6 + i) * 4,
      cy = y - u * 34,
      r = 5 + u * 5;
    ctx.globalAlpha = 0.9 * (1 - u) * Math.min(1, u * 6);
    ctx.beginPath();
    for (const [dx, dy, k] of [[-0.8, 0.2, 0.75], [0, -0.25, 1], [0.85, 0.2, 0.7]]) {
      ctx.moveTo(cx + dx * r + k * r, cy + dy * r);
      ctx.arc(cx + dx * r, cy + dy * r, k * r, 0, TAU);
    }
    ctx.fillStyle = "rgb(214,214,206)";
    ctx.lineWidth = 3.2;
    ctx.strokeStyle = "rgb(34,36,44)";
    // (the outline round the whole cloud, not each bump: stroke, then fill again over the inner lines)
    ctx.stroke();
    ctx.fill();
    ctx.fillStyle = "rgb(150,150,142)";
    for (const [dx, dy] of [[-r * 1.6, -r], [r * 1.7, -r * 0.6], [0, -r * 1.9]]) ctx.fillRect(cx + dx, cy + dy, 2, 2);
  }
  ctx.restore();
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
// The bite out of the drawer's cake: a round bite with three tooth bumps along its edge (a path, `ox`/`oy` its middle).
function biteShape(ctx, ox, oy, r) {
  ctx.beginPath();
  ctx.moveTo(ox + r, oy);
  for (let i = 1; i <= 36; i++) {
    const a = (i / 36) * TAU,
      bump = 1 + 0.09 * Math.max(0, Math.cos(a * 3 + 1.4));
    ctx.lineTo(ox + Math.cos(a) * r * bump, oy + Math.sin(a) * r * bump);
  }
  ctx.closePath();
}
/**
 * LOOK · cabinet: the drawer, open, and in it one snack cake with a bite out of it, on its torn wrapper. The cake is a
 * round chocolate snack cake (a darker side, a white icing squiggle on top), the bite cut out of it with tooth bumps, its
 * inside showing (sponge and a white cream layer). Its outline is drawn round what is left of the cake, so no ink line
 * crosses the bite (round 8: the faint ink edge across the bite is gone). The drawer is the office's filing cabinet's
 * grey (office_room_v2.py DESK, DESK_TOP, BEZEL). Final art, Brian's yes 2026-11-27 (round 8).
 */
function drawerPanel(ctx) {
  const INKD = "rgb(34,36,44)";
  ctx.fillStyle = "rgb(138,147,163)";
  ctx.fillRect(0, 0, 960, 640);
  // the drawer's inside and its two sides
  esRect(ctx, 120, 120, 720, 400, 12);
  esPaint(ctx, "rgb(70,80,102)", 6, INKD);
  ctx.fillStyle = "rgb(89,101,125)";
  ctx.beginPath();
  ctx.moveTo(126, 126);
  ctx.lineTo(834, 126);
  ctx.lineTo(800, 170);
  ctx.lineTo(160, 170);
  ctx.closePath();
  ctx.fill();
  // the wrapper, torn open, under the cake
  ctx.beginPath();
  ctx.moveTo(270, 430);
  ctx.lineTo(300, 300);
  ctx.lineTo(340, 318);
  ctx.lineTo(380, 286);
  ctx.lineTo(640, 290);
  ctx.lineTo(700, 330);
  ctx.lineTo(690, 452);
  ctx.closePath();
  esPaint(ctx, "rgb(206,214,226)", 4, INKD);
  ctx.strokeStyle = "rgb(255,255,255)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(320, 410);
  ctx.lineTo(340, 340);
  ctx.moveTo(650, 320);
  ctx.lineTo(670, 420);
  ctx.stroke();
  // the cake, drawn on its own sheet so the bite can be cut out of it
  const cv = document.createElement("canvas");
  cv.width = 960;
  cv.height = 640;
  const c = cv.getContext("2d");
  if (c) {
    const cx = 480,
      cy = 340,
      rx = 170,
      ry = 96,
      side = 40,
      bx = 620,
      by = 312,
      br = 62;
    // the side, then the top
    c.beginPath();
    c.ellipse(cx, cy + side, rx, ry, 0, 0, TAU);
    c.rect(cx - rx, cy, rx * 2, side);
    c.fillStyle = "rgb(84,50,28)";
    c.fill();
    c.beginPath();
    c.ellipse(cx, cy, rx, ry, 0, 0, TAU);
    c.fillStyle = "rgb(122,74,42)";
    c.fill();
    // the white icing squiggle
    c.beginPath();
    for (let i = 0; i <= 60; i++) {
      const u = i / 60,
        px = cx - 120 + 240 * u;
      c.lineTo(px, cy - 8 + Math.sin(u * TAU * 3.5) * 22 * Math.sin(u * Math.PI));
    }
    c.strokeStyle = "rgb(255,253,243)";
    c.lineWidth = 9;
    c.lineCap = "round";
    c.stroke();
    // the bite: cut out, then its inside drawn where it meets the cake
    c.globalCompositeOperation = "destination-out";
    biteShape(c, bx, by, br);
    c.fill();
    c.globalCompositeOperation = "source-atop";
    c.save();
    biteShape(c, bx - 6, by + 10, br);
    c.lineWidth = 34;
    c.strokeStyle = "rgb(186,132,82)";
    c.stroke();
    c.lineWidth = 9;
    c.strokeStyle = "rgb(255,253,243)";
    c.translate(0, 4);
    biteShape(c, bx - 6, by + 10, br + 4);
    c.stroke();
    c.restore();
    c.globalCompositeOperation = "source-over";
    // one ink line round what is left of the cake (its whole edge, bite included), nothing across the bite
    const edge = document.createElement("canvas");
    edge.width = 960;
    edge.height = 640;
    const e = edge.getContext("2d");
    if (e) {
      for (const [dx, dy] of [[-6, 0], [6, 0], [0, -6], [0, 6], [-4, -4], [4, 4], [-4, 4], [4, -4]]) e.drawImage(cv, dx, dy);
      e.globalCompositeOperation = "source-in";
      e.fillStyle = INKD;
      e.fillRect(0, 0, 960, 640);
      ctx.drawImage(edge, 0, 0);
    }
    ctx.drawImage(cv, 0, 0);
  }
  // the drawer's front, with its handle
  esRect(ctx, 90, 500, 780, 110, 10);
  esPaint(ctx, "rgb(181,188,200)", 6, INKD);
  esRect(ctx, 400, 540, 160, 26, 13);
  esPaint(ctx, "rgb(138,147,163)", 4, INKD);
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
