/**
 * Drawings for the party in disguise and its endings (party plan P6 to P8; picture sheet V8, V10, V13, V14, V15),
 * drawn by the game on top of the locked hall picture, which never changes. Every one is on the picture sheet
 * (tools/party-sheet.mjs) for Brian's eye before it counts as his look. Game positions (960 x 640). No words.
 */
import { rr, oval, line, INK, drawPiece, drawNote, drawFlyer, drawTuft } from "./party-art.js";

const TAU = Math.PI * 2;

export function heart(ctx, x, y, s, fill) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.35);
  ctx.bezierCurveTo(x - s, y - s * 0.3, x - s * 0.45, y - s, x, y - s * 0.45);
  ctx.bezierCurveTo(x + s * 0.45, y - s, x + s, y - s * 0.3, x, y + s * 0.35);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = Math.max(1, s * 0.12);
  ctx.strokeStyle = INK;
  ctx.stroke();
}

// ---------- Mops's heart cone (V13) ----------
/** Mops's warm cone, as big as everyone's, with hearts floating up in it (PR #35's look, R98 and R104). */
export function drawHeartCone(ctx, ox, oy, a, half, len, t, k = 1) {
  ctx.save();
  ctx.globalAlpha = k;
  ctx.beginPath();
  ctx.moveTo(ox, oy);
  ctx.arc(ox, oy, len, a - half, a + half);
  ctx.closePath();
  ctx.fillStyle = "rgba(255,140,180,.30)";
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = "rgba(214,70,120,.8)";
  ctx.stroke();
  for (let i = 0; i < 5; i++) {
    const kk = (t * 0.4 + i / 5) % 1,
      d = 30 + kk * (len - 40),
      off = Math.sin(i * 2.1 + t) * half * 0.6;
    heart(ctx, ox + Math.cos(a + off) * d, oy + Math.sin(a + off) * d - kk * 10, 7 + 3 * Math.sin(kk * Math.PI), "#ff6fa0");
  }
  ctx.restore();
}

// ---------- the camera (V14) ----------
/** The camera's red light counting 3-2-1 (`n` lit dots) on top of the camera, and its flash. */
export function drawCountdown(ctx, x, y, n, t) {
  const on = n > 0 && Math.sin(t * 16) > -0.3;
  oval(ctx, x - 6, y - 51, 4, 4, on ? "#ff3b30" : "#6b1d18", 1.5);
  for (let i = 0; i < 3; i++) oval(ctx, x - 10 + i * 8, y - 62, 2.6, 2.6, i < n ? "#ff3b30" : "#fffdf8", 1);
}
// The flash: how far its glow and its rays reach from the lens (game pixels). Small on purpose: the room never
// goes white (Brian 2026-11-24, on the white screen: "What is the splash").
export const FLASH = Object.freeze({ glow: 20, rays: 30 });
/**
 * The camera's flash: a small bright burst at the lens (`lens`, a game position), for as long as the flash lasts
 * (`k` 1 to 0). Nothing else on the picture changes.
 */
export function drawFlash(ctx, k, lens) {
  if (!(k > 0) || !lens) return;
  const a = Math.min(1, k * 6),
    g = ctx.createRadialGradient(lens.x, lens.y, 1, lens.x, lens.y, FLASH.glow);
  ctx.save();
  ctx.globalAlpha = a;
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.45, "rgba(255,255,240,.95)");
  g.addColorStop(1, "rgba(255,255,240,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(lens.x, lens.y, FLASH.glow, 0, TAU);
  ctx.fill();
  // eight short rays, long and short in turn
  for (let i = 0; i < 8; i++) {
    const r = i % 2 ? FLASH.rays * 0.7 : FLASH.rays,
      an = (i / 8) * TAU;
    line(ctx, [lens.x + Math.cos(an) * 8, lens.y + Math.sin(an) * 8, lens.x + Math.cos(an) * r, lens.y + Math.sin(an) * r], "#ffffff", 3);
  }
  ctx.restore();
}
/**
 * The Polaroid sliding out of the camera with him in it (`k` 0 to 1 over its time): a white card with the band
 * on the stage and Squatch in his outfit in front, drawn by `inside(ctx, x, y, w, h)`.
 */
export function drawPolaroid(ctx, x, y, k, inside) {
  const slide = Math.min(1, k * 4),
    w = 110,
    h = 128,
    px = x - w / 2,
    py = y - 50 - h * slide;
  ctx.save();
  ctx.translate(px + w / 2, py + h / 2);
  ctx.rotate(-0.08 * slide);
  rr(ctx, -w / 2, -h / 2, w, h, 4, "#fffdf8", 3);
  ctx.save();
  ctx.beginPath();
  ctx.rect(-w / 2 + 8, -h / 2 + 8, w - 16, h - 36);
  ctx.clip();
  ctx.fillStyle = "#2a2f4a";
  ctx.fillRect(-w / 2 + 8, -h / 2 + 8, w - 16, h - 36);
  inside && inside(ctx, -w / 2 + 8, -h / 2 + 8, w - 16, h - 36);
  ctx.restore();
  ctx.restore();
}

// ---------- the band and the crowd (sound, drawn) ----------
/** Music notes rising from the band while it plays (the song, drawn). */
export function drawBandNotes(ctx, spots, t, song) {
  const colors = [
    ["#ff5fa8", "#ffcf33"],
    ["#2bc4aa", "#3478f6"],
    ["#ffbe3c", "#e5533d"],
  ][song % 3];
  spots.forEach((s, i) => {
    const k = (t * 0.6 + i / 3) % 1;
    ctx.save();
    ctx.globalAlpha = Math.sin(k * Math.PI);
    drawNote(ctx, s.x + 10 + Math.sin(k * 6 + i) * 8, s.y - 70 - k * 50, 8, colors[i % 2]);
    ctx.restore();
  });
}
/** Clapping over a guest's head: two small hands and burst lines (the clap, drawn). */
export function drawClap(ctx, x, y, t) {
  const k = Math.abs(Math.sin(t * 9));
  oval(ctx, x - 5 - k * 3, y, 4, 5, "#fffdf8", 1.5);
  oval(ctx, x + 5 + k * 3, y, 4, 5, "#fffdf8", 1.5);
  for (const a of [-0.8, 0, 0.8]) line(ctx, [x + Math.sin(a) * 9, y - 8, x + Math.sin(a) * 14, y - 14], "#ffcf33", 2);
}
/** Hiccup bubbles rising from the octopus (the hiccup, drawn). */
export function drawHiccups(ctx, x, y, t) {
  for (let i = 0; i < 3; i++) {
    const k = (t * 0.8 + i / 3) % 1;
    ctx.save();
    ctx.globalAlpha = 1 - k;
    oval(ctx, x + 14 + Math.sin(k * 7 + i) * 5, y - 70 - k * 34, 3 + k * 4, 3 + k * 4, "rgba(200,240,255,.7)", 1.5);
    ctx.restore();
  }
}
/** The wall speaker's ring lines while it speaks or chimes (the chime, drawn). */
export function drawSpeakerRing(ctx, box, t) {
  const cx = box.x1 + 4,
    cy = (box.y0 + box.y1) / 2;
  for (let i = 1; i <= 3; i++) {
    const k = ((t * 1.5 + i / 3) % 1) * 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 8 + k * 26, -0.7, 0.7);
    ctx.lineWidth = 3;
    ctx.strokeStyle = `rgba(30,36,48,${0.7 * (1 - k)})`;
    ctx.stroke();
  }
}
/** Mops out of breath: little puffs by his mouth. */
export function drawPuffs(ctx, x, y, t) {
  for (let i = 0; i < 3; i++) {
    const k = (t * 1.6 + i / 3) % 1;
    ctx.save();
    ctx.globalAlpha = 0.8 * (1 - k);
    oval(ctx, x + 10 + k * 22, y - k * 8, 4 + k * 6, 3 + k * 4, "#fffdf8", 1.5);
    ctx.restore();
  }
}

// ---------- the outfit losing pieces (V15) ----------
/** A piece of the outfit, `w` across, flying or lying where it landed. */
export function drawLoosePiece(ctx, id, x, y, w, rot) {
  drawPiece(ctx, id, x, y, w, rot);
}
/** The flyer Mops finds at home after the alarm: covered in fur and glowing. */
export function drawFurryFlyer(ctx, x, y, t, glow = 1) {
  ctx.save();
  if (glow > 0) {
    ctx.shadowColor = `rgba(255,207,51,${(0.6 + 0.4 * Math.sin(t * 6)) * glow})`;
    ctx.shadowBlur = 22 * glow;
  }
  drawFlyer(ctx, x, y, 20, 0.5);
  ctx.restore();
  for (const [dx, dy, r] of [
    [-6, -4, 0.3],
    [5, 6, -0.6],
    [0, -12, 1.2],
  ])
    drawTuft(ctx, x + dx, y + dy, 8, r);
}
/** A soft dust puff at a guard's feet as he walks (the footsteps, drawn). */
export function drawStep(ctx, x, y, k) {
  ctx.save();
  ctx.globalAlpha = 0.5 * (1 - k);
  oval(ctx, x, y, 6 + k * 8, 2 + k * 2, "#c9c2b4");
  ctx.restore();
}
export { TAU };
