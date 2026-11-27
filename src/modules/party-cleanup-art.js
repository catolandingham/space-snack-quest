/**
 * What the party-hall cleanup draws (party-cleanup.js; Brian, story pass 28-52, section E2a): the mess on the floor
 * (dust and confetti on each dirty patch, the sticky spills, the snacks he knocked down), the clean sparkle his beard
 * leaves, the grey beard once it is full, a heart that floats up and pops, the Polaroid lying on the floor, and the
 * found thing in Mops's hoof at home. Nothing here is a locked room picture: every piece is drawn over the locked
 * hall or home picture, which stays as it is. No words are drawn here.
 */
import { heart } from "./party-free-art.js";

const INK = "#1e2430";
// The floor's dust: a pale grey film with specks and a few confetti bits on each dirty patch (PLACEHOLDER colours).
const DUST = "rgba(104,90,70,.42)",
  SPECK = "rgba(84,70,54,.55)",
  CONFETTI = ["#ff6fa0", "#ffcf33", "#8fdcff", "#7ee08a", "#b48cff"];

/** A small fixed number for patch `i` (the same every frame, so specks never jump). */
function cleanHash(i, k) {
  const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

/** One dirty patch of floor, `size` across, centred at (x, y): a dusty film, specks and one or two confetti bits. */
export function drawDirtPatch(ctx, x, y, size, i) {
  const r = size / 2;
  ctx.fillStyle = DUST;
  ctx.beginPath();
  ctx.ellipse(x, y, r * 1.1, r * 0.85, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = SPECK;
  for (let k = 0; k < 4; k++) {
    ctx.beginPath();
    ctx.arc(x + (cleanHash(i, k) - 0.5) * size * 0.9, y + (cleanHash(i, k + 7) - 0.5) * size * 0.5, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let k = 0; k < 2; k++) {
    if (cleanHash(i, k + 20) < 0.45) continue;
    const cx = x + (cleanHash(i, k + 30) - 0.5) * size * 0.8,
      cy = y + (cleanHash(i, k + 40) - 0.5) * size * 0.45;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(cleanHash(i, k + 50) * 3);
    ctx.fillStyle = CONFETTI[Math.floor(cleanHash(i, k + 60) * CONFETTI.length)];
    ctx.fillRect(-4.5, -2, 9, 4);
    ctx.restore();
  }
}

/** A sticky spill (a soda puddle): `left` is how much is left, 1 whole, 0.5 after one pass. */
export function drawSpill(ctx, x, y, r, left, color) {
  const k = 0.45 + 0.55 * left;
  ctx.save();
  ctx.globalAlpha = 0.55 + 0.4 * left;
  ctx.beginPath();
  ctx.ellipse(x, y, r * k, r * k * 0.5, 0, 0, Math.PI * 2);
  ctx.ellipse(x + r * 0.55 * k, y + r * 0.18 * k, r * 0.4 * k, r * 0.22 * k, 0, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(30,36,48,.5)";
  ctx.stroke();
  // its wet shine
  ctx.fillStyle = "rgba(255,255,255,.6)";
  ctx.beginPath();
  ctx.ellipse(x - r * 0.3 * k, y - r * 0.12 * k, r * 0.22 * k, r * 0.07 * k, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** The snacks he knocked off the pyramid, lying on the floor (crumbs and three little cakes). */
export function drawCrumbs(ctx, x, y) {
  for (let k = 0; k < 9; k++) {
    ctx.fillStyle = "#c98a4a";
    ctx.beginPath();
    ctx.arc(x + (cleanHash(k, 3) - 0.5) * 50, y + (cleanHash(k, 9) - 0.5) * 18, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  for (const [dx, dy, rot] of [[-14, -2, 0.4], [6, 4, -0.3], [18, -4, 0.9]]) {
    ctx.save();
    ctx.translate(x + dx, y + dy);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.ellipse(0, 0, 8, 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#b8743a";
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = INK;
    ctx.stroke();
    ctx.restore();
  }
}

/** The clean sparkle his beard leaves: a little four-pointed star that grows and fades (`k` 0 to 1). */
export function drawCleanSparkle(ctx, x, y, k) {
  const s = 4 + 7 * Math.sin(Math.PI * Math.min(1, k));
  ctx.save();
  ctx.globalAlpha = 1 - k;
  ctx.translate(x, y);
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4,
      r = i % 2 ? s * 0.3 : s;
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#8fdcff";
  ctx.stroke();
  ctx.restore();
}

/**
 * His beard gone grey with dirt (`load` 0 to 1 shows it greying; 1 is full), drawn over the beard the game drew, with
 * the same shape (src/game's drawMops: chin to floor in front of his chest). (x, y) his feet, `scale`, `f` facing.
 */
export function drawDirtyBeard(ctx, x, y, scale, f, load, headDown) {
  if (load <= 0.05) return;
  const A = headDown ? 6 : 0;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * (f || 1), scale);
  ctx.beginPath();
  ctx.moveTo(14.5, -25 + A);
  ctx.quadraticCurveTo(12.5, -12, 14, -2);
  ctx.lineTo(15, 1);
  ctx.lineTo(16.5, -2.5);
  ctx.lineTo(18, 1.5);
  ctx.lineTo(19.5, -2);
  ctx.lineTo(21, 1);
  ctx.lineTo(22.5, -3);
  ctx.quadraticCurveTo(25, -13, 23.5, -25 + A);
  ctx.closePath();
  ctx.globalAlpha = Math.min(0.95, load * 0.95);
  ctx.fillStyle = "#6f6658";
  ctx.fill();
  ctx.restore();
}

/** One heart rising from (x, y) for `k` 0 to 0.75, then a pop (small burst) to 1. */
export function drawHeartPop(ctx, x, y, s, k) {
  if (k < 0 || k > 1) return;
  if (k < 0.75) {
    const u = k / 0.75;
    heart(ctx, x, y - u * s * 2.2, s * (0.7 + 0.5 * u), "#ff6fa0");
    return;
  }
  const u = (k - 0.75) / 0.25,
    cy = y - s * 2.2;
  ctx.save();
  ctx.globalAlpha = 1 - u;
  ctx.strokeStyle = "#ff6fa0";
  ctx.lineWidth = Math.max(2, s * 0.15);
  ctx.lineCap = "round";
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * s * (0.4 + u), cy + Math.sin(a) * s * (0.4 + u));
    ctx.lineTo(x + Math.cos(a) * s * (0.8 + 1.2 * u), cy + Math.sin(a) * s * (0.8 + 1.2 * u));
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * A small Polaroid, `w` wide, centred at (x, y), turned `rot`: a white frame with the group as little coloured
 * figures and one tall furry one in a shirt (it lies on the hall floor, and Mops holds it up at home).
 */
export function drawLittlePolaroid(ctx, x, y, w, rot) {
  const h = w * 1.1;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot || 0);
  ctx.fillStyle = "#fffdf8";
  ctx.strokeStyle = INK;
  ctx.lineWidth = Math.max(1.5, w * 0.05);
  ctx.beginPath();
  ctx.rect(-w / 2, -h / 2, w, h);
  ctx.fill();
  ctx.stroke();
  const m = w * 0.1,
    iw = w - m * 2,
    ih = h * 0.68;
  ctx.fillStyle = "#b9a3ab";
  ctx.fillRect(-w / 2 + m, -h / 2 + m, iw, ih);
  const base = -h / 2 + m + ih;
  for (const [fx, c, tall] of [[0.12, "#2bb3a8", 0.55], [0.3, "#7a8aa0", 0.6], [0.7, "#e07a4a", 0.55], [0.88, "#6d5bd0", 0.5]]) {
    ctx.fillStyle = c;
    ctx.fillRect(-w / 2 + m + iw * fx - w * 0.05, base - ih * tall, w * 0.1, ih * tall);
  }
  // the tall furry one in the middle, in a bright shirt
  ctx.fillStyle = "#6b4428";
  ctx.fillRect(-w * 0.09, base - ih * 0.88, w * 0.18, ih * 0.88);
  ctx.fillStyle = "#ff8a3d";
  ctx.fillRect(-w * 0.1, base - ih * 0.62, w * 0.2, ih * 0.3);
  ctx.restore();
}
