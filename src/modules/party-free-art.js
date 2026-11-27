/**
 * Drawings for the party in disguise and its endings (party plan P6 to P8; picture sheet V8, V10, V13, V14, V15),
 * drawn by the game on top of the locked hall picture, which never changes. Every one is on the picture sheet
 * (tools/party-sheet.mjs) for Brian's eye before it counts as his look. Game positions (960 x 640). No words.
 */
import { rr, oval, line, INK, drawPiece, drawNote, drawFlyer, drawTuft } from "./party-art.js";

const TAU = Math.PI * 2;

import { firstSightHearts } from "./mops-hearts.js";

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

/**
 * Hearts floating up from Mops's head when he sees Squatch (Brian 2026-11-26, #48: hearts, never "?" or "!"). (x, y)
 * is the top of his head, `s` a heart's size, `k` seconds since he saw him: three hearts, one after another, each
 * rising and fading.
 */
export function drawMopsHearts(ctx, x, y, s, k) {
  for (let i = 0; i < 3; i++) {
    const u = (k - i * 0.35) / 1.2;
    if (u <= 0 || u >= 1) continue;
    ctx.save();
    ctx.globalAlpha = u < 0.2 ? u / 0.2 : 1 - (u - 0.2) / 0.8;
    heart(ctx, x + (i - 1) * s * 0.9 + Math.sin(u * 6 + i) * s * 0.3, y - u * s * 4, s * (0.8 + 0.4 * u), "#ff6fa0");
    ctx.restore();
  }
}
// ---------- Mops's heart cone (V13) ----------
/**
 * Mops's warm cone, as big as everyone's (PR #35's look, R98 and R104). Its hearts float up only the first time he
 * sees Squatch in a scene: two or three, once, then the cone stays warm and empty (Brian 2026-11-27, "come on with the
 * hearts"; mops-hearts.js, question 126). `age`: seconds since he first saw him in this scene.
 */
export function drawHeartCone(ctx, ox, oy, a, half, len, t, k = 1, age = -1) {
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
  for (const h of firstSightHearts(age)) {
    const d = 30 + h.rise * (len - 40),
      off = (h.i - 1) * half * 0.5;
    ctx.globalAlpha = k * h.alpha;
    heart(ctx, ox + Math.cos(a + off) * d, oy + Math.sin(a + off) * d - h.rise * 10, 7 + 3 * Math.sin(h.rise * Math.PI), "#ff6fa0");
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

// ---------- the band and the crowd (sound, drawn) ----------
// Where each band member's note floats, as steps of its own height `h`: the first out to the left, the middle one
// forward over the stage's front toward the crowd, the third out to the right. None goes up (the banner hangs just
// over their heads since everyone in the hall grew, Brian 2026-11-24).
const NOTE_PATHS = Object.freeze([
  { x0: -0.2, y0: -0.62, dx: -0.42, dy: -0.12 },
  { x0: 0.1, y0: -0.2, dx: 0.12, dy: 0.5 },
  { x0: 0.34, y0: -0.62, dx: 0.5, dy: -0.12 },
]);
/** Music notes floating out from the band while it plays (the song, drawn). `h` is how tall a band member is drawn. */
export function drawBandNotes(ctx, spots, t, song, h = 66) {
  const colors = [
    ["#ff5fa8", "#ffcf33"],
    ["#2bc4aa", "#3478f6"],
    ["#ffbe3c", "#e5533d"],
  ][song % 3];
  spots.forEach((s, i) => {
    const k = (t * 0.6 + i / 3) % 1;
    ctx.save();
    ctx.globalAlpha = Math.sin(k * Math.PI);
    const n = NOTE_PATHS[i % NOTE_PATHS.length];
    drawNote(ctx, s.x + (n.x0 + n.dx * k) * h + Math.sin(k * 6 + i) * 5, s.y + (n.y0 + n.dy * k) * h, 8, colors[i % 2]);
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
/** Hiccup bubbles rising from the octopus's head top at (x, y) (the hiccup, drawn). */
export function drawHiccups(ctx, x, y, t) {
  for (let i = 0; i < 3; i++) {
    const k = (t * 0.8 + i / 3) % 1;
    ctx.save();
    ctx.globalAlpha = 1 - k;
    oval(ctx, x + 14 + Math.sin(k * 7 + i) * 5, y - 8 - k * 34, 3 + k * 4, 3 + k * 4, "rgba(200,240,255,.7)", 1.5);
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
// ---------- the ending after an alarm, at home ----------
/**
 * Mops gently lifts the piece off Squatch's head: where the piece is at `k` (0 on his head, 1 held low at Mops's
 * side). `from` is where it sits on his head, `to` where Mops holds it; it rises straight up first, then floats
 * over in a soft arc. Returns { x, y, rot }.
 */
export function liftAt(from, to, k) {
  const up = Math.min(1, k / 0.3),
    over = Math.max(0, (k - 0.3) / 0.7),
    ease = over * over * (3 - 2 * over),
    y0 = from.y - 26 * up;
  return { x: from.x + (to.x - from.x) * ease, y: y0 + (to.y - y0) * ease - Math.sin(ease * Math.PI) * 30, rot: Math.sin(ease * Math.PI) * 0.25 };
}
/** Where Mops holds a piece he has lifted off Squatch (by his mouth), from where the two of them stand. */
export const liftTo = (m, s, sk) => ({ x: m.x - Math.sign(m.x - s.x) * 34 * sk * 0.4, y: m.y - 30 * sk });
/** Setting the piece down: from where he holds it to where it rests on the floor, `k` 0 to 1. */
export function setDownAt(held, rest, k) {
  const e = k * k * (3 - 2 * k);
  return { x: held.x + (rest.x - held.x) * e, y: held.y + (rest.y - held.y) * e, rot: 0 };
}
/**
 * The home room's TV for the horn press ("Keep going"). `tv`: { button: { x, y, r }, screen: { x0, x1, y0, y1 } }.
 * Before the press (`lit` null) the screen is the room picture's own (off) and a small red button shows on the
 * frame with a yellow ring pulsing round it (what Mops is walking to). From the press (`lit` seconds ago) the
 * screen is drawn on (pale blue, flickering, lines rolling down it) with a yellow edge; a ring bursts from the
 * button, with nothing drawn on the button itself (his horn is on it); after that the button is green.
 */
export function drawTv(ctx, tv, t, lit) {
  const at = tv.button,
    sc = tv.screen;
  ctx.save();
  if (lit == null) {
    oval(ctx, at.x, at.y, at.r, at.r, "#e5533d", 1.5);
    ctx.strokeStyle = "#ffcf33";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(at.x, at.y, at.r + 6 + 2 * Math.sin(t * 6), 0, Math.PI * 2);
    ctx.stroke();
  } else {
    ctx.fillStyle = Math.sin(t * 23) > 0.2 ? "#bfe9ff" : "#8fdcff";
    ctx.fillRect(sc.x0, sc.y0, sc.x1 - sc.x0, sc.y1 - sc.y0);
    ctx.save();
    ctx.beginPath();
    ctx.rect(sc.x0, sc.y0, sc.x1 - sc.x0, sc.y1 - sc.y0);
    ctx.clip();
    for (let o = 0; o < 5; o++) line(ctx, [sc.x0, sc.y0 + o * 16 + ((t * 40) % 16), sc.x1, sc.y0 + o * 16 + ((t * 40) % 16)], "rgba(255,255,255,.6)", 2);
    ctx.restore();
    ctx.strokeStyle = "#ffcf33";
    ctx.lineWidth = 3;
    ctx.strokeRect(sc.x0 - 1, sc.y0 - 1, sc.x1 - sc.x0 + 2, sc.y1 - sc.y0 + 2);
    if (lit < 0.5) {
      ctx.globalAlpha = 1 - lit / 0.5;
      ctx.beginPath();
      ctx.arc(at.x, at.y, at.r + 6 + lit * 44, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    } else oval(ctx, at.x, at.y, at.r, at.r, "#3fbf6b", 1.5);
  }
  ctx.restore();
}
/** A gentle pat on his head (he wears nothing there): two soft pats, drawn as short curved strokes, and a small heart. */
export function drawPat(ctx, x, y, k, s) {
  const beat = (k * 2) % 1,
    on = k < 1 && beat > 0.15 && beat < 0.7;
  ctx.save();
  if (on) {
    ctx.globalAlpha = 0.9;
    for (const a of [-0.7, 0, 0.7]) line(ctx, [x + Math.sin(a) * s * 0.5, y - s * 0.25 - Math.cos(a) * s * 0.12, x + Math.sin(a) * s * 0.78, y - s * 0.25 - Math.cos(a) * s * 0.42], "#fffdf8", Math.max(2, s * 0.09));
  }
  ctx.restore();
  k > 0.45 && heart(ctx, x + s * 0.7, y - s * 0.7 - (k - 0.45) * s * 0.6, s * 0.22, "#ff5fa8");
}
/** A soft dust puff at a guard's feet as he walks (the footsteps, drawn). */
export function drawStep(ctx, x, y, k) {
  ctx.save();
  ctx.globalAlpha = 0.5 * (1 - k);
  oval(ctx, x, y, 6 + k * 8, 2 + k * 2, "#c9c2b4");
  ctx.restore();
}
export { TAU };
