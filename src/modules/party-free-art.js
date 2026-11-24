/**
 * Drawings for the party in disguise and its endings (party plan P6 to P8; picture sheet V8, V10, V13, V14, V15),
 * drawn by the game on top of the locked hall picture, which never changes. Every one is on the picture sheet
 * (tools/party-sheet.mjs) for Brian's eye before it counts as his look. Game positions (960 x 640). No words.
 */
import { rr, oval, line, INK, drawPiece, PIECES, drawWarning, drawNote, drawFlyer, drawTuft } from "./party-art.js";

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

// ---------- the hallway doorway (V8) ----------
/**
 * Mops's long white beard swishing past the hallway doorway (`door`), seen only inside the doorway. `show` (0 to 1)
 * is how far it is in; `yank` (0 to 1, or -1) pulls it out of the doorway fast when the bell rings.
 */
export function drawBeardInDoorway(ctx, door, t, show = 1, yank = -1) {
  if (show <= 0 && yank < 0) return;
  const swing = Math.sin(t * 1.6),
    out = yank >= 0 ? yank * yank * 80 : 0;
  ctx.save();
  ctx.beginPath();
  ctx.rect(door.x0 - 30, door.y0, door.x1 - door.x0 + 60, door.y1 - door.y0);
  ctx.clip();
  const bx = door.x0 + 6 + swing * 18 + (1 - Math.max(show, yank >= 0 ? 1 : 0)) * 40 + out,
    by = door.y1 - 6;
  ctx.globalAlpha = yank >= 0 ? 1 : Math.max(0, Math.min(1, show * 1.5));
  ctx.beginPath();
  ctx.moveTo(bx - 26, door.y0 + 10);
  ctx.quadraticCurveTo(bx - 32, by - 30, bx - 14 + swing * 8, by);
  ctx.quadraticCurveTo(bx + 2, by - 10, bx + 14 - swing * 6, by + 2);
  ctx.quadraticCurveTo(bx + 18, by - 40, bx + 10, door.y0 + 10);
  ctx.closePath();
  ctx.fillStyle = "#f4f5f8";
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = "#9aa1ad";
  ctx.stroke();
  for (let i = 0; i < 3; i++) line(ctx, [bx - 18 + i * 9, door.y0 + 26, bx - 14 + i * 9 + swing * 4, by - 14], "#c9ced8", 1.5);
  ctx.restore();
  // his humming comes through the doorway (drawn, since sound starts off)
  if (show > 0.2 && yank < 0)
    for (let i = 0; i < 2; i++) {
      const k = (t * 0.5 + i / 2) % 1;
      ctx.save();
      ctx.globalAlpha = Math.sin(k * Math.PI) * show;
      drawNote(ctx, door.x0 - 8 - k * 40, door.y0 + 30 - k * 36 + i * 14, 8, "#2bc48a");
      ctx.restore();
    }
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
/** The flash: the whole picture goes white for a moment (`k` 1 to 0). */
export function drawFlash(ctx, k) {
  if (!(k > 0)) return;
  ctx.fillStyle = `rgba(255,255,255,${Math.min(0.85, k * 3.4)})`;
  ctx.fillRect(0, 0, 960, 640);
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
/** The vent tugging a piece: the piece, drawn big over him, tipping (the warning's big icon). */
export function drawTugWarning(ctx, x, y, piece, t) {
  drawWarning(
    ctx,
    x,
    y,
    46,
    (c, s) => {
      const p = PIECES.find((q) => q.id === piece);
      drawPiece(c, piece, 0, 0, s * (p && p.h > 0.7 ? 0.7 : 0.9), Math.sin(t * 8) * 0.35);
    },
    1,
    t,
  );
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
