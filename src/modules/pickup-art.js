/**
 * Pickup day's drawings (Chapter 1, beats 53 to 61). Every one is a PLACEHOLDER drawing in the game's style (dark
 * outlines, flat colours) until Brian approves a look. Locked room pictures are never redrawn: these are layers on top
 * of them (listed for Brian's yes: the camera with a red light upper right in the bay, the mirror in the wardrobe, the
 * spill by the floor vent, the things on the home walls and the pale squares they leave (the eaten STAY IN HERE poster
 * too), Mops's beard hair over the crate bed, the floor where the crate bed and the bucket stood) or close-ups and
 * pictures of their own (the cargo hold, the tape screen).
 * Every word comes from pickup-lines.js (or escape-lines.js for the Guardian note and the frame); every place from
 * pickup-place.js.
 */
import { drawFamilyStampAt } from "./crate-stamp.js";
import { pickupWords } from "./pickup-lines.js";
import { esRect, esPaint, esWords, ES_INK, drawPinkSheet } from "./escape-art.js";
import { drawSnack } from "./party-snacks-art.js";
import { drawGuardianBox } from "./home-morning-art.js";
import { drawMopBucketBack, drawMopBucketFront, MOP_BUCKET } from "./mop-bucket.js";
import { drawBrochure } from "./evening-art.js";
import { adultPxFor } from "./room-sizes.js";
import { drawGoatBeard as drawGoatBeardOnTape, drawSnippedBeard } from "./pickup-people-art.js";
import { PK_OFFICE, PK_HOLD, PK_CRATE } from "./pickup-place.js";

const PK_TAU = Math.PI * 2;
const pkClamp = (k) => Math.max(0, Math.min(1, k));
const PK_FUR = "#6b4428",
  PK_WOOD = "#d9a35b",
  PK_WOOD_DARK = "#b9813d",
  PK_PAPER = "#fffdf8",
  PK_BLUE = "#3478f6",
  PK_RED = "#e5533d",
  PK_GREEN = "#2bc48a",
  PK_GOLD = "#ffcf33",
  PK_PINK = "#ff9cc2";

// ---------- small things ----------
/** A tuft of his fur (53: on the crate bed). */
export function drawPkTuft(ctx, x, y, k = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  ctx.beginPath();
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * PK_TAU;
    ctx.ellipse(Math.cos(a) * 7, Math.sin(a) * 5, 7, 5, a, 0, PK_TAU);
  }
  esPaint(ctx, PK_FUR, 2);
  ctx.restore();
}
/**
 * The floor where something painted in the locked picture has gone (the crate bed, the bucket): the floor's own colour,
 * read once from the locked home picture at a spot of bare floor (pickup-place.js PK_HOME.floorAt). A layer: listed for
 * Brian's yes.
 */
let pkFloor = "";
const pkHomePic = typeof Image !== "undefined" ? Object.assign(new Image(), { src: "docs/locked-rooms/home-room-empty-open-v6.png" }) : null;
export function drawFloorPatch(ctx, b, at) {
  if (!pkFloor && pkHomePic && pkHomePic.complete && pkHomePic.naturalWidth) {
    try {
      const c = document.createElement("canvas");
      c.width = c.height = 1;
      const x = c.getContext("2d");
      x.drawImage(pkHomePic, Math.round((at.x * pkHomePic.naturalWidth) / 960), Math.round((at.y * pkHomePic.naturalHeight) / 640), 1, 1, 0, 0, 1, 1);
      const d = x.getImageData(0, 0, 1, 1).data;
      pkFloor = `rgb(${d[0]},${d[1]},${d[2]})`;
    } catch (err) {
      pkFloor = "#e8e3d9"; // (a picture the browser will not let us read: the usual floor colour)
    }
  }
  ctx.save();
  ctx.fillStyle = pkFloor || "#e8e3d9";
  ctx.fillRect(b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0);
  ctx.restore();
}
// The family stamp's width for its height (crate-stamp.js draws it from its left edge; measured once, off screen).
let pkStampRatio = 0;
/**
 * His crate on its pallet (final art, pending Brian's yes; round 8, placeholder 23): drawn like the crate bed in the
 * locked home picture, a wooden crate of wide boards in the crate bed's two woods (home_room.py CRATE and CRATED), a
 * darker board framing each edge, the board seams across, nail heads at the corners, a soft shadow under the pallet;
 * the worn family stamp (crate-stamp.js, the one stamp layer), its label once it is on, the bucket on top, the lid.
 */
export function drawPkCrate(ctx, cx, bottom, k, { label = false, bucket = false, open = 0, eyes = false, glow = 0 } = {}) {
  const w = PK_CRATE.w * k,
    h = PK_CRATE.h * k,
    p = PK_CRATE.pallet * k,
    x0 = cx - w / 2,
    y0 = bottom - p - h,
    lw = Math.max(1.5, 3 * k),
    fr = Math.max(3, 11 * k); // the frame board's width
  ctx.save();
  // the shadow on the floor
  ctx.beginPath();
  ctx.ellipse(cx, bottom + 1 * k, w * 0.56, Math.max(2, 5 * k), 0, 0, PK_TAU);
  ctx.fillStyle = "rgba(30,36,48,.16)";
  ctx.fill();
  // the pallet: a top board on three blocks
  esRect(ctx, x0 - 4 * k, bottom - p, w + 8 * k, p * 0.45, 2 * k);
  esPaint(ctx, PK_WOOD_DARK, lw);
  for (const u of [0.02, 0.5, 0.98]) {
    esRect(ctx, x0 - 4 * k + (w + 8 * k) * u - 9 * k, bottom - p * 0.58, 18 * k, p * 0.58, 1.5 * k);
    esPaint(ctx, PK_WOOD_DARK, lw * 0.8);
  }
  // the crate: the boards
  esRect(ctx, x0, y0, w, h, 3 * k);
  esPaint(ctx, PK_WOOD, lw);
  ctx.save();
  esRect(ctx, x0, y0, w, h, 3 * k);
  ctx.clip();
  // a lighter top edge on each board, its seam under it, and a few grain lines
  const boards = 3,
    bh = h / boards;
  for (let i = 0; i < boards; i++) {
    const by = y0 + i * bh;
    ctx.fillStyle = "rgba(255,240,210,.35)";
    ctx.fillRect(x0, by + 1, w, Math.max(1, 3 * k));
    if (i) {
      ctx.beginPath();
      ctx.moveTo(x0, by);
      ctx.lineTo(x0 + w, by);
      ctx.strokeStyle = PK_WOOD_DARK;
      ctx.lineWidth = Math.max(1, 2 * k);
      ctx.stroke();
    }
    ctx.beginPath();
    for (const [u, v, len] of [
      [0.22, 0.45, 0.16],
      [0.6, 0.7, 0.12],
      [0.78, 0.35, 0.1],
    ]) {
      const gx = x0 + w * ((u + i * 0.17) % 1),
        gy = by + bh * v;
      ctx.moveTo(gx, gy);
      ctx.quadraticCurveTo(gx + (w * len) / 2, gy - 2 * k, gx + w * len, gy);
    }
    ctx.strokeStyle = "rgba(169,116,58,.55)";
    ctx.lineWidth = Math.max(0.8, 1.4 * k);
    ctx.stroke();
  }
  ctx.restore();
  // the frame: a darker board up each side and along the top and the bottom
  for (const [fx, fy, fw, fh] of [
    [x0, y0, fr, h],
    [x0 + w - fr, y0, fr, h],
    [x0, y0, w, fr * 0.8],
    [x0, y0 + h - fr * 0.8, w, fr * 0.8],
  ]) {
    esRect(ctx, fx, fy, fw, fh, 2 * k);
    esPaint(ctx, "#c48a46", lw * 0.7);
  }
  // nail heads at the frame's corners
  for (const nx of [x0 + fr / 2, x0 + w - fr / 2])
    for (const ny of [y0 + fr * 0.4, y0 + h - fr * 0.4]) {
      ctx.beginPath();
      ctx.arc(nx, ny, Math.max(0.8, 1.8 * k), 0, PK_TAU);
      ctx.fillStyle = "#6e5236";
      ctx.fill();
    }
  // the stamp: the family stamp the home picture's crate bed carries (crate-stamp.js), his crayon gone since he rubbed
  // it out in the evening of Day 2 (39b)
  const sh = 18 * k;
  if (!pkStampRatio) {
    // (measured on a canvas of its own: the stamp sets its own transparency, so it would show on the game's)
    const scratch = typeof document !== "undefined" ? document.createElement("canvas").getContext("2d") : null;
    pkStampRatio = (scratch && drawFamilyStampAt(scratch, 0, 0, 100, { crayon: 0 }).end / 100) || 4.6;
  }
  drawFamilyStampAt(ctx, cx - (pkStampRatio * sh) / 2, y0 + h * 0.3 + sh * 0.8, sh, { crayon: 0 });
  // the label: the same tag as last week's crate
  if (label) {
    esRect(ctx, cx - 50 * k, y0 + h * 0.62, 100 * k, 22 * k, 2 * k);
    esPaint(ctx, PK_PAPER, lw * 0.6);
    esWords(ctx, pickupWords("label"), cx, y0 + h * 0.62 + 11 * k, Math.max(6, 9 * k), ES_INK, "center", 900);
  }
  // the lid, lifting (0 shut, 1 open): one board with its frame
  if (open > 0) {
    ctx.save();
    ctx.translate(x0, y0);
    ctx.rotate(-open * 1.1);
    esRect(ctx, 0, -10 * k, w, 12 * k, 2 * k);
    esPaint(ctx, PK_WOOD, lw);
    esRect(ctx, 0, -10 * k, fr, 12 * k, 2 * k);
    esPaint(ctx, "#c48a46", lw * 0.6);
    esRect(ctx, w - fr, -10 * k, fr, 12 * k, 2 * k);
    esPaint(ctx, "#c48a46", lw * 0.6);
    ctx.restore();
  }
  // Squatch's eyes in the dark gap under the top board (hidden in it, the bucket's shadow on top)
  if (eyes) {
    esRect(ctx, cx - 22 * k, y0 + h * 0.18 - 7 * k, 44 * k, 14 * k, 4 * k);
    esPaint(ctx, "#2a1d12", 0);
    for (const d of [-9, 9]) {
      ctx.beginPath();
      ctx.ellipse(cx + d * k, y0 + h * 0.18, 5 * k, 5.5 * k, 0, 0, PK_TAU);
      esPaint(ctx, "#ffffff", lw * 0.4);
      ctx.beginPath();
      ctx.arc(cx + d * k + 1, y0 + h * 0.18 + 1, 2.4 * k, 0, PK_TAU);
      esPaint(ctx, ES_INK, 0);
    }
  }
  if (bucket) drawBucket(ctx, cx + w * 0.22, y0, k);
  ctx.restore();
  return { x0, y0, x1: x0 + w, y1: bottom };
}
/**
 * Mops's mop bucket standing on something at `bottom` (final art, pending Brian's yes): the one approved mop bucket
 * (mop-bucket.js, Brian 2026-11-26 "Let's go with it moving forward"), about 40 k wide, its water showing.
 */
export const PK_BUCKET_K = 0.23;
export function drawBucket(ctx, cx, bottom, k) {
  const q = PK_BUCKET_K * k;
  drawMopBucketBack(ctx, cx, bottom, q);
  drawMopBucketFront(ctx, cx, bottom, q, { water: true });
}
/**
 * His snack bag from the snack bar (beat 52; final art, pending Brian's yes; round 8, placeholder 22): a brown paper
 * bag inside `b`, its top rolled down twice and crimped, a little wider at the bottom, its shaded side, and the snack
 * bar's round blue sticker with a yellow star (the snack tin's colours, crate-stamp.js drawTinLid) holding it shut.
 */
export function drawSnackBag(ctx, b) {
  const w = b.x1 - b.x0,
    h = b.y1 - b.y0,
    lw = Math.max(1.5, w * 0.05),
    top = b.y0 + h * 0.3;
  ctx.save();
  // its shadow
  ctx.beginPath();
  ctx.ellipse(b.x0 + w / 2, b.y1, w * 0.55, Math.max(2, h * 0.06), 0, 0, PK_TAU);
  ctx.fillStyle = "rgba(30,36,48,.16)";
  ctx.fill();
  // the body, a little wider at the bottom
  ctx.beginPath();
  ctx.moveTo(b.x0 + w * 0.08, top);
  ctx.lineTo(b.x0 + w * 0.92, top);
  ctx.lineTo(b.x1, b.y1);
  ctx.lineTo(b.x0, b.y1);
  ctx.closePath();
  esPaint(ctx, "#d4a874", lw); // (a brown with enough blue in it that the goal test never reads it as a yellow arrow)
  // the shaded side panel and the bottom fold
  ctx.beginPath();
  ctx.moveTo(b.x0 + w * 0.7, top + 1);
  ctx.lineTo(b.x0 + w * 0.92, top + 1);
  ctx.lineTo(b.x1 - lw / 2, b.y1 - lw / 2);
  ctx.lineTo(b.x0 + w * 0.76, b.y1 - lw / 2);
  ctx.closePath();
  ctx.fillStyle = "#bf8f52";
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(b.x0 + w * 0.7, top);
  ctx.lineTo(b.x0 + w * 0.76, b.y1);
  ctx.moveTo(b.x0 + w * 0.06, b.y1 - h * 0.1);
  ctx.lineTo(b.x0 + w * 0.3, b.y1 - h * 0.02);
  ctx.strokeStyle = "#9c6f3a";
  ctx.lineWidth = Math.max(1, lw * 0.5);
  ctx.stroke();
  // the rolled top: two rolls, crimped along the top edge
  for (let r = 0; r < 2; r++) {
    const ry = top - (r + 1) * h * 0.11;
    esRect(ctx, b.x0 + w * (0.06 + r * 0.03), ry, w * (0.88 - r * 0.06), h * 0.13, h * 0.05);
    esPaint(ctx, r ? "#e3bb84" : "#cf9e5e", lw * 0.8);
  }
  ctx.beginPath();
  const cy = top - h * 0.22;
  for (let i = 0; i <= 8; i++) ctx.lineTo(b.x0 + w * (0.12 + (i * 0.76) / 8), cy - (i % 2 ? h * 0.035 : 0));
  ctx.strokeStyle = "#9c6f3a";
  ctx.lineWidth = Math.max(1, lw * 0.45);
  ctx.stroke();
  // the sticker over the roll: blue, a yellow star
  const sx = b.x0 + w * 0.45,
    sy = top + h * 0.02,
    sr = w * 0.17;
  ctx.beginPath();
  ctx.arc(sx, sy, sr, 0, PK_TAU);
  esPaint(ctx, "#2f6fd6", lw * 0.6);
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 ? sr * 0.32 : sr * 0.72,
      a = -Math.PI / 2 + (i * Math.PI) / 5;
    ctx.lineTo(sx + Math.cos(a) * rr, sy + Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fillStyle = PK_GOLD;
  ctx.fill();
  ctx.restore();
  return b;
}
/**
 * The stand's brochure sticking out of his jacket pocket (a Chapter 2 plant; final art, pending Brian's yes; round 8,
 * placeholder 28): the top of the very brochure from beat 38 (evening-art.js drawBrochure, so it always matches it: the
 * night sky and Mars big over the stand), tipped a little, its lower part down inside a jacket pocket drawn over it.
 * (x, y) is the pocket's top middle; `k` the size (1: a pocket 18 game pixels wide).
 */
export function drawBrochureCorner(ctx, x, y, k = 1) {
  const pw = 18 * k,
    ph = 14 * k,
    bw = 17 * k,
    bh = 24 * k;
  ctx.save();
  ctx.translate(x, y);
  // the brochure, standing in the pocket, tipped back
  ctx.save();
  ctx.beginPath();
  ctx.rect(-pw, -bh, pw * 2, bh + 1);
  ctx.clip();
  ctx.rotate(-0.28);
  drawBrochure(ctx, -bw / 2, -bh * 0.8, bw, bh, true);
  ctx.restore();
  // the pocket in front: the jacket's blue, a darker flap edge, a stitch line
  esRect(ctx, -pw / 2, 0, pw, ph, 2 * k);
  esPaint(ctx, "#3a76d6", Math.max(1, 1.6 * k));
  ctx.beginPath();
  ctx.moveTo(-pw / 2 + 2 * k, 2.6 * k);
  ctx.lineTo(pw / 2 - 2 * k, 2.6 * k);
  ctx.strokeStyle = "rgba(255,255,255,.55)";
  ctx.setLineDash([2 * k, 1.6 * k]);
  ctx.lineWidth = Math.max(0.6, 0.8 * k);
  ctx.stroke();
  ctx.restore();
}
/**
 * 55: Mops's spill by the floor vent (round 7, #118; final art, pending Brian's yes; round 8, placeholder 26): his
 * own mop bucket (mop-bucket.js) tipped on its side on the floor right of the puddle, its open top toward it, soapy
 * water running out of it into a wide, uneven puddle: pale blue with a darker edge, white shine streaks, soap bubbles
 * and one slow ring where the last drips land. A layer over the pickup-day bay.
 */
export function drawPuddle(ctx, p, t) {
  const rx = p.rx,
    ry = p.ry;
  ctx.save();
  // the puddle: a few lobes in one shape
  const lobes = [
    [0, 0, 1, 1],
    [-0.55, 0.15, 0.55, 0.75],
    [0.5, -0.1, 0.6, 0.8],
    [-0.15, 0.35, 0.5, 0.6],
    [0.95, 0.05, 0.35, 0.55],
  ];
  const lobePath = (grow) => {
    ctx.beginPath();
    for (const [u, v, a, b] of lobes) {
      ctx.moveTo(p.x + u * rx + a * rx * 0.62 + grow, p.y + v * ry);
      ctx.ellipse(p.x + u * rx, p.y + v * ry, a * rx * 0.62 + grow, b * ry + grow * 0.5, 0, 0, PK_TAU);
    }
  };
  lobePath(2.5);
  ctx.fillStyle = "#4a90d9";
  ctx.fill();
  lobePath(0);
  ctx.fillStyle = "#a8dcff";
  ctx.fill();
  // shine streaks
  ctx.strokeStyle = "rgba(255,255,255,.9)";
  ctx.lineCap = "round";
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(p.x - rx * 0.55, p.y - ry * 0.2);
  ctx.lineTo(p.x - rx * 0.25, p.y - ry * 0.35);
  ctx.moveTo(p.x + rx * 0.1, p.y + ry * 0.35);
  ctx.lineTo(p.x + rx * 0.3, p.y + ry * 0.25);
  ctx.stroke();
  // the ring where it drips
  const u = (t * 0.6) % 1;
  ctx.globalAlpha = 1 - u;
  ctx.beginPath();
  ctx.ellipse(p.x + rx * 0.62, p.y + 1, 4 + u * rx * 0.35, 1.5 + u * ry * 0.35, 0, 0, PK_TAU);
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.globalAlpha = 1;
  // soap bubbles
  for (const [u2, v2, r] of [
    [-0.35, -0.05, 3.2],
    [-0.28, 0.12, 2.2],
    [0.2, -0.3, 2.6],
    [0.82, -0.25, 2.4],
    [0.7, 0.2, 3],
  ]) {
    ctx.beginPath();
    ctx.arc(p.x + u2 * rx, p.y + v2 * ry, r, 0, PK_TAU);
    ctx.fillStyle = "rgba(255,255,255,.85)";
    ctx.fill();
    ctx.strokeStyle = "#5aa9e6";
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }
  // the bucket on its side: its bottom to the right, its open top facing the puddle, lying on the floor
  const q = PK_BUCKET_K * 0.62,
    B = MOP_BUCKET;
  ctx.translate(p.x + rx * 1.05 + (B.h * q) / 2 + 10, p.y + 2 - (B.wTop / 2 + 6) * q);
  ctx.rotate(-Math.PI / 2 + 0.06);
  drawMopBucketFront(ctx, 0, (B.h / 2 + B.wheel) * q, q, { water: false });
  ctx.restore();
  // the water running out of its mouth into the puddle
  ctx.save();
  ctx.beginPath();
  const mx = p.x + rx * 1.05 + 6,
    my = p.y - 6;
  ctx.moveTo(mx + 4, my - 10);
  ctx.quadraticCurveTo(mx - 6, my - 4, p.x + rx * 0.7, p.y);
  ctx.quadraticCurveTo(mx - 4, my + 6, mx + 4, my + 6);
  ctx.closePath();
  ctx.fillStyle = "#a8dcff";
  ctx.fill();
  ctx.strokeStyle = "#4a90d9";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
  return true;
}
/** The weekly box on the ship, tagged with escape-lines.js blank-tag. */
export function drawTagBox(ctx, x, y, k = 1, glow = false) {
  const lw = Math.max(1.5, 3 * k);
  esRect(ctx, x - 22 * k, y - 26 * k, 44 * k, 26 * k, 3 * k);
  esPaint(ctx, "#f2d7a6", lw);
  ctx.beginPath();
  ctx.moveTo(x, y - 26 * k);
  ctx.lineTo(x, y);
  ctx.strokeStyle = PK_RED;
  ctx.lineWidth = lw;
  ctx.stroke();
  esRect(ctx, x + 14 * k, y - 18 * k, 18 * k, 12 * k, 2 * k);
  esPaint(ctx, PK_PAPER, lw * 0.6);
  return { x0: x - 24 * k, y0: y - 28 * k, x1: x + 34 * k, y1: y + 2 };
}
/**
 * The upgraded robot's new parts (final art, pending Brian's yes; round 8, placeholder 24), drawn over the older
 * program's robot picture (feet at (x, y), `k` its size, the same units): Mops's complaint got them "upgraded" to
 * "check every corner", so it wears what checks corners. A bolted-on chrome band round its middle with rivets and a
 * green light that blinks; a periscope up from its dome with a round corner mirror on top; and on its other side a
 * second arm with a round scrub brush that turns. `f` is unused (the robot picture never turns).
 */
export function drawNewRobotBits(ctx, x, y, k, f = 1, t = 0) {
  const lw = Math.max(1, 1.6 * k);
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  const ow = lw / k;
  // the brush arm (behind the body) and its turning brush
  ctx.beginPath();
  ctx.moveTo(-13, -14);
  ctx.lineTo(-24, -3);
  ctx.strokeStyle = ES_INK;
  ctx.lineWidth = 4.6;
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.strokeStyle = "#b9c0cc";
  ctx.lineWidth = 2.6;
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(-26, 0.5, 7, 3, 0, 0, PK_TAU);
  esPaint(ctx, "#5c86d6", ow);
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = t * 9 + (i * PK_TAU) / 6;
    ctx.moveTo(-26 + Math.cos(a) * 3, 0.5 + Math.sin(a) * 1.2);
    ctx.lineTo(-26 + Math.cos(a) * 7.5, 0.5 + Math.sin(a) * 3.2);
  }
  ctx.strokeStyle = "#e8edf6";
  ctx.lineWidth = 0.9;
  ctx.stroke();
  // the chrome band round its middle, three rivets, the green light
  esRect(ctx, -15.5, -22, 31, 6, 1.5);
  esPaint(ctx, "#cfd5df", ow);
  ctx.fillStyle = "rgba(255,255,255,.8)";
  ctx.fillRect(-13, -21, 22, 1.2);
  for (const rx of [-11, -4, 3]) {
    ctx.beginPath();
    ctx.arc(rx, -19, 0.9, 0, PK_TAU);
    ctx.fillStyle = "#7d8696";
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(9.5, -19, 1.9, 0, PK_TAU);
  esPaint(ctx, Math.sin(t * 5) > -0.3 ? "#2bc48a" : "#1b7a57", ow * 0.7);
  // the periscope: a pole up from the dome's side, bent over, a round mirror looking round the corner
  ctx.beginPath();
  ctx.moveTo(-5, -44);
  ctx.lineTo(-5, -56);
  ctx.quadraticCurveTo(-5, -60, -1, -60);
  ctx.strokeStyle = ES_INK;
  ctx.lineWidth = 3.4;
  ctx.stroke();
  ctx.strokeStyle = "#b9c0cc";
  ctx.lineWidth = 1.6;
  ctx.stroke();
  ctx.save();
  ctx.translate(3, -60);
  ctx.rotate(Math.sin(t * 1.3) * 0.35);
  ctx.beginPath();
  ctx.ellipse(0, 0, 4.4, 3.4, 0, 0, PK_TAU);
  esPaint(ctx, "#8fdcff", ow);
  ctx.beginPath();
  ctx.ellipse(-1.3, -1, 1.4, 0.8, -0.5, 0, PK_TAU);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.restore();
  // a shine on its dome
  ctx.beginPath();
  ctx.ellipse(-4, -41, 2.6, 1.5, -0.6, 0, PK_TAU);
  ctx.fillStyle = "rgba(255,255,255,.9)";
  ctx.fill();
  ctx.restore();
}
/** The blue scan line going into something (0 to 1 down `box`), and the arch's light: "red", "yellow", "green" or "". */
export function drawScanLine(ctx, box, k, color = "rgba(80,170,255,.9)") {
  const y = box.y0 + (box.y1 - box.y0) * pkClamp(k);
  ctx.save();
  ctx.fillStyle = "rgba(80,170,255,.18)";
  ctx.fillRect(box.x0, box.y0, box.x1 - box.x0, y - box.y0);
  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(box.x0 - 10, y);
  ctx.lineTo(box.x1 + 10, y);
  ctx.stroke();
  ctx.restore();
}
import { drawArchGlow } from "./arch-glow.js";
// The arch's light on pickup day ("red", "yellow" or "green", or nothing): its lamp, scan lines and floor strip in that
// colour, a scan bar sweeping down (arch-glow.js; round 8 final art, pending Brian's yes, ART-A). `arch` is the whole
// arch (bar and posts); its field is between the posts, under the bar.
export function drawArchLight(ctx, arch, light, t) {
  if (!light) return;
  drawArchGlow(ctx, { x0: arch.x0 + 19, x1: arch.x1 - 21, y0: arch.y0 + 24, y1: arch.y1 - 6 }, light, 1, t);
}

// ---------- 53: home ----------
// (his crayon chart over the bed is the home picture's own layer, cake-chart.js)
/** One of his crayon drawings on the home wall (a layer): Mops and him, a rocket. */
export function drawKidDrawing(ctx, b, kind = 0) {
  esRect(ctx, b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0, 3);
  esPaint(ctx, PK_PAPER, 3);
  const cx = (b.x0 + b.x1) / 2,
    cy = (b.y0 + b.y1) / 2;
  ctx.save();
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  if (kind === 0) {
    ctx.strokeStyle = PK_FUR;
    ctx.beginPath();
    ctx.arc(cx - 14, cy, 12, 0, PK_TAU);
    ctx.stroke();
    ctx.strokeStyle = PK_GREEN;
    ctx.beginPath();
    ctx.arc(cx + 14, cy, 10, 0, PK_TAU);
    ctx.stroke();
  } else {
    ctx.strokeStyle = PK_RED;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 20);
    ctx.lineTo(cx + 10, cy + 12);
    ctx.lineTo(cx - 10, cy + 12);
    ctx.closePath();
    ctx.stroke();
    ctx.strokeStyle = "#ff8a3d";
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy + 16);
    ctx.lineTo(cx, cy + 26);
    ctx.lineTo(cx + 6, cy + 16);
    ctx.stroke();
  }
  ctx.restore();
}
/**
 * Where a thing hung (final art, pending Brian's yes; round 8, placeholder 20): the wall behind it kept its first
 * colour, so a square a little whiter than the wall round it, a faint grey line of dust along its top and left edges,
 * and a little bit of tape left at its top corners. `eaten` (the STAY IN HERE poster Mops ate, 53): the paper's
 * corners are still under the tape, their inner edges bitten off in a row of small bites.
 */
export function drawPaleSquare(ctx, b, eaten = false) {
  const w = b.x1 - b.x0,
    h = b.y1 - b.y0,
    tp = Math.max(6, w * 0.16);
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,.42)";
  ctx.fillRect(b.x0, b.y0, w, h);
  ctx.beginPath();
  ctx.moveTo(b.x0, b.y1);
  ctx.lineTo(b.x0, b.y0);
  ctx.lineTo(b.x1, b.y0);
  ctx.strokeStyle = "rgba(140,128,104,.38)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(b.x1, b.y0);
  ctx.lineTo(b.x1, b.y1);
  ctx.lineTo(b.x0, b.y1);
  ctx.strokeStyle = "rgba(140,128,104,.18)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  for (const s of [-1, 1]) {
    const cx = s < 0 ? b.x0 : b.x1;
    if (eaten) {
      // the torn paper corner left under the tape, bitten along its inner edge
      ctx.beginPath();
      ctx.moveTo(cx, b.y0);
      ctx.lineTo(cx - s * tp * 1.5, b.y0);
      for (let i = 1; i <= 4; i++) {
        const u = i / 4;
        ctx.quadraticCurveTo(cx - s * tp * (1.5 - u * 1.5 + 0.35), b.y0 + tp * (u * 1.5 - 0.2), cx - s * tp * (1.5 - u * 1.5), b.y0 + tp * u * 1.5);
      }
      ctx.closePath();
      ctx.fillStyle = "#fffdf8";
      ctx.fill();
      ctx.strokeStyle = ES_INK;
      ctx.lineWidth = 1.5;
      ctx.lineJoin = "round";
      ctx.stroke();
      // a corner of the poster's red border
      ctx.beginPath();
      ctx.moveTo(cx - s * 2, b.y0 + 2);
      ctx.lineTo(cx - s * tp * 0.9, b.y0 + 2);
      ctx.moveTo(cx - s * 2, b.y0 + 2);
      ctx.lineTo(cx - s * 2, b.y0 + tp * 0.9);
      ctx.strokeStyle = PK_RED;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }
    // the bit of tape, across the corner
    ctx.save();
    ctx.translate(cx - s * tp * 0.3, b.y0 + tp * 0.3);
    ctx.rotate(s * -0.78);
    ctx.fillStyle = "rgba(255,246,200,.85)";
    ctx.fillRect(-tp * 0.55, -tp * 0.2, tp * 1.1, tp * 0.4);
    ctx.strokeStyle = "rgba(160,140,90,.6)";
    ctx.lineWidth = 1;
    ctx.strokeRect(-tp * 0.55, -tp * 0.2, tp * 1.1, tp * 0.4);
    ctx.restore();
  }
  ctx.restore();
}
/**
 * Something painted on the locked home picture's wall, gone (53: the STAY IN HERE poster Mops ate): the wall's own
 * colour, read once from the picture at a spot of bare wall `at`, then the pale square a thing leaves. A layer, for
 * Brian's yes.
 */
const pkWall = {};
export function drawWallPatch(ctx, b, at) {
  const key = at.x + "," + at.y;
  if (!pkWall[key] && pkHomePic && pkHomePic.complete && pkHomePic.naturalWidth) {
    try {
      const c = document.createElement("canvas");
      c.width = c.height = 1;
      const x = c.getContext("2d");
      x.drawImage(pkHomePic, Math.round((at.x * pkHomePic.naturalWidth) / 960), Math.round((at.y * pkHomePic.naturalHeight) / 640), 1, 1, 0, 0, 1, 1);
      const d = x.getImageData(0, 0, 1, 1).data;
      pkWall[key] = `rgb(${d[0]},${d[1]},${d[2]})`;
    } catch (err) {
      pkWall[key] = "#f4efe4";
    }
  }
  ctx.save();
  ctx.fillStyle = pkWall[key] || "#f4efe4";
  ctx.fillRect(b.x0 - 3, b.y0 - 3, b.x1 - b.x0 + 6, b.y1 - b.y0 + 6);
  ctx.restore();
  drawPaleSquare(ctx, b, true);
}
/** The note folded on his pillow. */
export function drawFoldedNote(ctx, b) {
  ctx.save();
  ctx.translate((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2);
  ctx.rotate(-0.12);
  esRect(ctx, -(b.x1 - b.x0) / 2, -(b.y1 - b.y0) / 2, b.x1 - b.x0, b.y1 - b.y0, 2);
  esPaint(ctx, "#fff4c2", 2.5);
  ctx.beginPath();
  ctx.moveTo(0, -(b.y1 - b.y0) / 2);
  ctx.lineTo(0, (b.y1 - b.y0) / 2);
  ctx.strokeStyle = "rgba(30,36,48,.35)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}
/**
 * The Guardian Box, open, close (53): the old Guardian notes inside, one pink corner showing under them (the slip he hid
 * in 52); `cover` (0 to 1) the new note coming down on top until the pink is gone.
 */
export function drawBoxCloseup(ctx, cover, t) {
  ctx.save();
  ctx.fillStyle = "rgba(12,16,28,.55)";
  ctx.fillRect(0, 0, 960, 640);
  // the box, big and open
  esRect(ctx, 220, 200, 520, 340, 14);
  esPaint(ctx, PK_BLUE, 6);
  esRect(ctx, 250, 226, 460, 290, 8);
  esPaint(ctx, "#1f4fae", 4);
  // the pink corner under the notes
  ctx.save();
  ctx.beginPath();
  ctx.rect(250, 226, 460, 290);
  ctx.clip();
  ctx.beginPath();
  ctx.moveTo(610, 520);
  ctx.lineTo(700, 520);
  ctx.lineTo(700, 440);
  ctx.closePath();
  esPaint(ctx, PK_PINK, 4);
  // the old notes
  for (const [x, y, a] of [
    [380, 330, -0.08],
    [520, 360, 0.1],
    [450, 420, -0.03],
  ]) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(a);
    esRect(ctx, -90, -60, 180, 120, 4);
    esPaint(ctx, "#fff4c2", 3);
    ctx.restore();
  }
  // the new note coming down on top (it covers the pink corner)
  if (cover > 0) {
    const y = 120 + (460 - 120) * pkClamp(cover);
    ctx.save();
    ctx.translate(600, y);
    ctx.rotate(-0.05);
    esRect(ctx, -140, -80, 280, 160, 4);
    esPaint(ctx, "#fff4c2", 4);
    ctx.restore();
  }
  ctx.restore();
  ctx.restore();
  return { pinkShows: cover < 1 };
}
// ---------- 56: the costume ----------
/** The scissors at Mops's beard, his GANITOR tag with its gold star at the edge of the frame; `cut` once snipped. */
export function drawSnipCloseup(ctx, cut, age, star) {
  ctx.save();
  ctx.fillStyle = "#2bc48a";
  ctx.fillRect(0, 0, 960, 640);
  // the beard: long and white, ragged at the end once cut
  ctx.beginPath();
  ctx.moveTo(380, 0);
  ctx.lineTo(580, 0);
  ctx.lineTo(560, cut ? 330 : 520);
  for (let i = 0; i < 6; i++) ctx.lineTo(540 - i * 25, (cut ? 330 : 520) + (i % 2 ? 18 : -6));
  ctx.lineTo(400, cut ? 330 : 520);
  ctx.closePath();
  esPaint(ctx, "#ffffff", 6);
  // the piece cut off, falling
  if (cut) {
    const y = 360 + Math.min(1, age) * 160;
    ctx.beginPath();
    ctx.moveTo(400, y);
    ctx.lineTo(560, y);
    ctx.lineTo(500, y + 150);
    ctx.lineTo(460, y + 150);
    ctx.closePath();
    esPaint(ctx, "#ffffff", 5);
  }
  // the scissors
  const open = cut ? 0.05 : 0.35 + 0.1 * Math.sin(age * 8);
  ctx.save();
  ctx.translate(700, 340);
  for (const s of [-1, 1]) {
    ctx.save();
    ctx.rotate(Math.PI + s * open);
    esRect(ctx, 0, -8, 260, 16, 8);
    esPaint(ctx, "#c9ced8", 4);
    ctx.restore();
  }
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(60, s * 40, 30, 0, PK_TAU);
    esPaint(ctx, PK_RED, 5);
  }
  ctx.restore();
  // his GANITOR tag at the edge, its gold star
  esRect(ctx, 30, 470, 220, 110, 10);
  esPaint(ctx, PK_PAPER, 5);
  esWords(ctx, "GANITOR", 140, 525, 36, "#1d4fb8", "center", 900);
  if (star) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? 14 : 30,
        a = -Math.PI / 2 + (i * Math.PI) / 5;
      ctx.lineTo(250 + Math.cos(a) * r, 470 + Math.sin(a) * r);
    }
    ctx.closePath();
    esPaint(ctx, PK_GOLD, 4);
  }
  ctx.restore();
}
// The costume pieces in the dress-up close-up: where each sits on him (his units), and its home on the left.
export const COSTUME_PIECES = Object.freeze([
  Object.freeze({ id: "beard", spot: "chin" }),
  Object.freeze({ id: "horns", spot: "head" }),
  Object.freeze({ id: "jacket", spot: "body" }),
]);
// (r6 6:12, Brian: the beard should sit under his chin, not over his face: the chin spot sits below his mouth)
export const COSTUME_SPOTS = Object.freeze({ head: { x: 0, y: -52 }, chin: { x: 0, y: -17 }, body: { x: 0, y: -10 } });
export const DRESS = Object.freeze({ sq: { x: 640, y: 560, scale: 7 }, shelf: Object.freeze([{ x: 170, y: 170 }, { x: 170, y: 320 }, { x: 170, y: 470 }]), r: 70 });
export function costumeSpotAt(spot) {
  const s = COSTUME_SPOTS[spot];
  return { x: DRESS.sq.x + s.x * DRESS.sq.scale, y: DRESS.sq.y + s.y * DRESS.sq.scale };
}
/** One costume piece at (x, y), `k` its size. */
export function drawCostumePiece(ctx, id, x, y, k = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  if (id === "beard") {
    ctx.beginPath();
    ctx.moveTo(-40, -20);
    ctx.lineTo(40, -20);
    ctx.lineTo(8, 70);
    ctx.lineTo(-8, 70);
    ctx.closePath();
    esPaint(ctx, "#ffffff", 4);
  } else if (id === "horns") {
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(s * 20, 20);
      ctx.quadraticCurveTo(s * 60, -10, s * 40, -60);
      ctx.quadraticCurveTo(s * 34, -14, s * 6, 12);
      ctx.closePath();
      esPaint(ctx, "#d9c9a8", 4);
    }
  } else {
    esRect(ctx, -60, -50, 120, 110, 14);
    esPaint(ctx, "#4d8be8", 4);
    ctx.beginPath();
    ctx.moveTo(-14, -50);
    ctx.lineTo(0, -22);
    ctx.lineTo(14, -50);
    esPaint(ctx, null, 3);
  }
  ctx.restore();
}
/**
 * The dress-up close-up (56): Squatch big on white on the right, the three pieces on the left, the "Disguised enough"
 * meter. `st.on` maps a piece to the spot it was dropped on; `st.held` the piece in his paw. Returns the meter (0 to 1).
 */
export function drawDressCloseup(ctx, engine, st, t) {
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 960, 640);
  esRect(ctx, 60, 90, 220, 520, 12);
  esPaint(ctx, "#efe6d6", 4);
  engine.drawSquatch(ctx, DRESS.sq.x, DRESS.sq.y, DRESS.sq.scale, { f: 1 });
  let right = 0;
  // (the beard is drawn last, so the jacket never covers it)
  const order = [...COSTUME_PIECES.keys()].sort((a, b) => (COSTUME_PIECES[a].id === "beard") - (COSTUME_PIECES[b].id === "beard"));
  order.forEach((i) => {
    const p = COSTUME_PIECES[i],
      on = st.on[p.id];
    if (on) {
      const at = costumeSpotAt(on);
      drawCostumePiece(ctx, p.id, at.x, at.y, 1.3);
      on === p.spot && right++;
    } else if (st.held !== p.id) drawCostumePiece(ctx, p.id, DRESS.shelf[i].x, DRESS.shelf[i].y, 0.9);
  });
  // the brochure goes into the jacket's pocket (a Chapter 2 plant)
  if (st.on.jacket === "body") {
    const j = costumeSpotAt("body");
    drawBrochureCorner(ctx, j.x + 40, j.y + 10, 2.2);
  }
  if (st.held) drawCostumePiece(ctx, st.held, DRESS.sq.x - 200, 300 + Math.sin(t * 4) * 6, 1.1);
  // the meter
  const k = right / COSTUME_PIECES.length;
  esWords(ctx, pickupWords("meter"), 640, 40, 30, ES_INK, "center", 900);
  esRect(ctx, 420, 64, 440, 26, 13);
  esPaint(ctx, "#e2e5ed", 3);
  k > 0 && (esRect(ctx, 420, 64, 440 * k, 26, 13), esPaint(ctx, PK_GREEN, 3));
  ctx.restore();
  return { meter: k, right };
}
/** The mirror on the inside of the wardrobe's open door (a layer, for Brian's yes): the two goats in it, small. */
export function drawMirror(ctx, engine, b, t, show, snipped = false) {
  esRect(ctx, b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0, 6);
  esPaint(ctx, "#cfe8f7", 4);
  if (!show) return;
  ctx.save();
  ctx.beginPath();
  ctx.rect(b.x0 + 3, b.y0 + 3, b.x1 - b.x0 - 6, b.y1 - b.y0 - 6);
  ctx.clip();
  const mid = (b.x0 + b.x1) / 2;
  engine.drawMopsOn(ctx, mid + 12, b.y1 - 10, 0.9, { f: -1, noBeard: snipped });
  snipped && drawSnippedBeard(ctx, mid + 12, b.y1 - 10, 0.9, -1);
  engine.drawSquatch(ctx, mid - 12, b.y1 - 10, 1.0, { f: 1, jacket: true, goatBeard: true, horns: true });
  ctx.restore();
}

// ---------- 57 ----------
/** The Guardians' plate on the snack bar (52's plate): empty now, a few crumbs. */
export function drawPkPlate(ctx, b) {
  const cx = (b.x0 + b.x1) / 2,
    cy = (b.y0 + b.y1) / 2;
  ctx.beginPath();
  ctx.ellipse(cx, cy, (b.x1 - b.x0) / 2, (b.y1 - b.y0) / 2, 0, 0, PK_TAU);
  esPaint(ctx, "#ffffff", 2.5);
  for (const [dx, dy] of [
    [-5, 1],
    [4, -2],
    [7, 3],
  ]) {
    ctx.beginPath();
    ctx.arc(cx + dx, cy + dy, 1.6, 0, PK_TAU);
    ctx.fillStyle = "#8b5a3c";
    ctx.fill();
  }
}
/** The empty plate, close: crumbs. */
export function drawPlateCloseup(ctx) {
  ctx.save();
  ctx.fillStyle = "#c9ced8";
  ctx.fillRect(0, 0, 960, 640);
  ctx.beginPath();
  ctx.ellipse(480, 330, 300, 170, 0, 0, PK_TAU);
  esPaint(ctx, "#ffffff", 7);
  ctx.beginPath();
  ctx.ellipse(480, 330, 210, 110, 0, 0, PK_TAU);
  esPaint(ctx, null, 3);
  for (let i = 0; i < 14; i++) {
    ctx.beginPath();
    ctx.arc(380 + ((i * 53) % 220), 290 + ((i * 37) % 90), 5 + (i % 3) * 2, 0, PK_TAU);
    ctx.fillStyle = "#8b5a3c";
    ctx.fill();
  }
  ctx.restore();
}
/** The paper sign on the office door, and a camera flash blinking under the door. */
export function drawPhotoSign(ctx, sign, under, t) {
  esRect(ctx, sign.x0, sign.y0, sign.x1 - sign.x0, sign.y1 - sign.y0, 2);
  esPaint(ctx, PK_PAPER, 2.5);
  esWords(ctx, pickupWords("sign-photo"), (sign.x0 + sign.x1) / 2, (sign.y0 + sign.y1) / 2, 13, ES_INK, "center", 900);
  const flash = t % 2.2 < 0.12;
  if (flash) {
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,.95)";
    ctx.fillRect(under.x0, under.y0, under.x1 - under.x0, under.y1 - under.y0);
    ctx.restore();
  }
  return { flash };
}
/** The crayon drawing coming off the wall, close: the two of them, tied together. */
export function drawCrayonCloseup(ctx, age) {
  ctx.save();
  ctx.fillStyle = "rgba(12,16,28,.55)";
  ctx.fillRect(0, 0, 960, 640);
  ctx.translate(480, 320 - pkClamp(age) * 20);
  ctx.rotate(-0.04);
  esRect(ctx, -300, -220, 600, 440, 6);
  esPaint(ctx, PK_PAPER, 5);
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.strokeStyle = PK_FUR;
  ctx.beginPath();
  ctx.arc(-110, -10, 70, 0, PK_TAU);
  ctx.stroke();
  ctx.strokeStyle = PK_GREEN;
  ctx.beginPath();
  ctx.arc(110, -10, 60, 0, PK_TAU);
  ctx.stroke();
  ctx.strokeStyle = PK_RED;
  ctx.beginPath();
  ctx.moveTo(-40, 20);
  ctx.bezierCurveTo(-10, 50, 10, -10, 50, 20);
  ctx.stroke();
  const w = pickupWords("crayon-words").split(", ");
  esWords(ctx, w[0], -110, -110, 34, PK_FUR, "center", 900);
  esWords(ctx, w[1], 110, -110, 34, PK_GREEN, "center", 900);
  esWords(ctx, w.slice(2).join(", "), 0, 160, 34, PK_RED, "center", 900);
  ctx.restore();
}

// ---------- 58 ----------
/** The scan line at the glued beard, close: one corner peeling; `pressed` once he presses it back. */
export function drawPeelCloseup(ctx, pressed, t) {
  ctx.save();
  ctx.fillStyle = PK_FUR;
  ctx.fillRect(0, 0, 960, 640);
  ctx.beginPath();
  ctx.moveTo(300, 120);
  ctx.lineTo(660, 120);
  ctx.lineTo(520, 600);
  ctx.lineTo(440, 600);
  ctx.closePath();
  esPaint(ctx, "#ffffff", 7);
  if (!pressed) {
    // the corner peeling off, his fur under it
    ctx.beginPath();
    ctx.moveTo(600, 120);
    ctx.lineTo(660, 120);
    ctx.lineTo(700 + Math.sin(t * 6) * 8, 70);
    ctx.closePath();
    esPaint(ctx, "#ffffff", 6);
  }
  drawScanLine(ctx, { x0: 0, y0: 0, x1: 960, y1: 640 }, 0.32);
  ctx.restore();
}
/** The ship sliding away past the big window (the ramp in, the bay empty): 0 to 1. */
export function drawShipAway(ctx, k) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(140, 70, 650, 160);
  ctx.clip();
  const x = 300 + k * 700;
  esRect(ctx, x, 82, 340, 140, 60);
  esPaint(ctx, "#c3c8d2", 4);
  ctx.restore();
}

// ---------- 59, 60: the office ----------
/** The camera on its tripod and the little stool (photo day). */
export function drawPhotoCorner(ctx) {
  const T = PK_OFFICE.tripod,
    S = PK_OFFICE.stool;
  ctx.save();
  ctx.strokeStyle = ES_INK;
  ctx.lineWidth = 4;
  for (const dx of [-30, 0, 30]) (ctx.beginPath(), ctx.moveTo(T.x, T.y - 120), ctx.lineTo(T.x + dx, T.y), ctx.stroke());
  esRect(ctx, T.x - 34, T.y - 150, 68, 40, 6);
  esPaint(ctx, "#2d323e", 4);
  ctx.beginPath();
  ctx.arc(T.x - 34, T.y - 130, 12, 0, PK_TAU);
  esPaint(ctx, "#8a93a3", 3);
  esRect(ctx, S.x - 30, S.y - 50, 60, 12, 4);
  esPaint(ctx, "#b9813d", 3);
  for (const dx of [-24, 24]) (ctx.beginPath(), ctx.moveTo(S.x + dx, S.y - 38), ctx.lineTo(S.x + dx, S.y), ctx.stroke());
  ctx.restore();
}
/**
 * The tape screen, filling the picture, with the REC badge and its two big buttons (PLAY · tape, ZOOM · in; the one to
 * press now bright). One clip (round 7, #123 pick A; final art, pending Brian's yes; round 8, placeholder 31): the
 * security camera's own picture of the pickup-day bay (the locked picture itself, greyed and a little green, with the
 * tape's scan lines and a rolling band), seen from its corner: a goat (Mops) walks up the ramp to the ship, then a very
 * tall goat, and halfway up his beard falls off and he catches it. `k` how far it has played (0 to 1); `zoom` "tall":
 * close on the very tall goat on the ramp, the beard in his paws, his fur showing.
 */
const pkBayPic = typeof Image !== "undefined" ? Object.assign(new Image(), { src: "docs/locked-rooms/delivery-room-empty-pickup-v4.png" }) : null;
// the part of the bay the camera sees (game positions), and, zoomed, the part round the ramp's middle
const PK_TAPE_VIEW = Object.freeze({ x0: 230, y0: 160, x1: 730, y1: 456 }),
  PK_TAPE_ZOOM = Object.freeze({ x0: 391, y0: 238, x1: 541, y1: 327 }),
  PK_TAPE_RAMP = Object.freeze([Object.freeze({ x: 466, y: 446 }), Object.freeze({ x: 466, y: 250 })]);
function pkTapeLook(ctx, S, t) {
  // the tape's look over the picture: a green-grey tint, scan lines, a slow rolling band, a dark edge
  ctx.fillStyle = "rgba(40,80,60,.18)";
  ctx.fillRect(S.x0, S.y0, S.x1 - S.x0, S.y1 - S.y0);
  ctx.fillStyle = "rgba(0,0,0,.12)";
  for (let y = S.y0; y < S.y1; y += 4) ctx.fillRect(S.x0, y, S.x1 - S.x0, 1.5);
  const band = S.y0 + (((t * 60) % (S.y1 - S.y0 + 80)) - 40);
  ctx.fillStyle = "rgba(255,255,255,.07)";
  ctx.fillRect(S.x0, band, S.x1 - S.x0, 26);
  const g = ctx.createRadialGradient((S.x0 + S.x1) / 2, (S.y0 + S.y1) / 2, (S.y1 - S.y0) * 0.35, (S.x0 + S.x1) / 2, (S.y0 + S.y1) / 2, (S.x1 - S.x0) * 0.62);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,.45)");
  ctx.fillStyle = g;
  ctx.fillRect(S.x0, S.y0, S.x1 - S.x0, S.y1 - S.y0);
}
export function drawTapeScreen(ctx, engine, { k, zoom, next }, t) {
  const S = PK_OFFICE.screen,
    I = { x0: S.x0 + 4, y0: S.y0 + 4, x1: S.x1 - 4, y1: S.y1 - 4 };
  ctx.save();
  ctx.fillStyle = "#1c2030";
  ctx.fillRect(0, 0, 960, 640);
  esRect(ctx, S.x0, S.y0, S.x1 - S.x0, S.y1 - S.y0, 10);
  esPaint(ctx, "#8c94a6", 6);
  ctx.save();
  ctx.beginPath();
  ctx.rect(I.x0, I.y0, I.x1 - I.x0, I.y1 - I.y0);
  ctx.clip();
  // the camera's picture: the bay, grey (`V` the part of the bay shown; game positions map into the screen)
  const V = zoom ? PK_TAPE_ZOOM : PK_TAPE_VIEW,
    sc = (I.x1 - I.x0) / (V.x1 - V.x0),
    at = (p) => ({ x: I.x0 + (p.x - V.x0) * sc, y: I.y0 + (p.y - V.y0) * sc });
  ctx.fillStyle = "#cfcabb";
  ctx.fillRect(I.x0, I.y0, I.x1 - I.x0, I.y1 - I.y0);
  ctx.save();
  ctx.filter = "grayscale(0.85) contrast(1.1)";
  pkBayPic && pkBayPic.complete && pkBayPic.naturalWidth && ctx.drawImage(pkBayPic, (V.x0 / 960) * pkBayPic.naturalWidth, (V.y0 / 640) * pkBayPic.naturalHeight, ((V.x1 - V.x0) / 960) * pkBayPic.naturalWidth, ((V.y1 - V.y0) / 640) * pkBayPic.naturalHeight, I.x0, I.y0, I.x1 - I.x0, I.y1 - I.y0);
  ctx.filter = "grayscale(0.7)";
  // the two of them on the ramp, at the bay's size (pickup.js sqScale and moScale: Squatch 0.8 of a grown-up)
  const sqK = ((adultPxFor("hangar") * 0.8) / 45) * sc,
    moK = sqK * 1.15,
    up = (u) => at({ x: PK_TAPE_RAMP[0].x + (PK_TAPE_RAMP[1].x - PK_TAPE_RAMP[0].x) * u, y: PK_TAPE_RAMP[0].y + (PK_TAPE_RAMP[1].y - PK_TAPE_RAMP[0].y) * u });
  if (!zoom) {
    // the goat first, then the very tall goat; past halfway the very tall one's beard falls and he catches it
    const mk = Math.min(1, k * 2),
      sk = Math.max(0, k * 2 - 1);
    mk > 0 && mk < 1 && ((p) => engine.drawMopsOn(ctx, p.x, p.y, moK, { f: -1, walk: t * 8 }))(up(mk));
    if (sk > 0) {
      const p = up(sk * 0.85),
        off = sk > 0.45,
        fall = Math.min(1, (sk - 0.45) * 4);
      engine.drawSquatch(ctx, p.x, p.y, sqK, { f: -1, walk: off ? 0 : t * 8, jacket: true, horns: true, goatBeard: !off });
      off && drawGoatBeardOnTape(ctx, p.x - 2 * sqK - fall * 5 * sqK, p.y - 44 * sqK + fall * 22 * sqK, sqK, -fall * 1.4);
    }
  } else {
    // close on the very tall goat: horns, a jacket, big furry feet, the beard in his paws, his fur showing
    const p = up(0.85 * 0.85);
    engine.drawSquatch(ctx, p.x, p.y, sqK, { f: -1, jacket: true, horns: true, goatBeard: false });
    drawGoatBeardOnTape(ctx, p.x - 8 * sqK, p.y - 22 * sqK, sqK, -1.4);
  }
  ctx.restore();
  pkTapeLook(ctx, I, t);
  ctx.restore();
  // the REC badge and the tape's label
  esRect(ctx, S.x0 + 20, S.y0 + 18, 90, 40, 8);
  esPaint(ctx, "#7a1210", 3);
  esWords(ctx, pickupWords("rec"), S.x0 + 65, S.y0 + 38, 22, "#ffffff", "center", 900);
  esWords(ctx, pickupWords("tape-bay"), S.x1 - 30, S.y0 + 38, 24, "#ffffff", "right", 900);
  // the two buttons
  const W = { play: "button-play", zoom: "button-zoom" };
  for (const b of PK_OFFICE.buttons) {
    ctx.save();
    ctx.globalAlpha = b.id === next ? 1 : 0.35;
    esRect(ctx, b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0, 16);
    esPaint(ctx, b.id === next ? PK_GOLD : "#e2e5ed", 4);
    esWords(ctx, pickupWords(W[b.id]), (b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, 28, ES_INK, "center", 900);
    ctx.restore();
  }
  ctx.restore();
}

// ---------- 61: the cargo hold ----------
/** The ship's cargo hold (a picture of its own, a PLACEHOLDER): metal walls, a small round window with stars, stairs. */
export function drawHold(ctx, t) {
  const H = PK_HOLD;
  ctx.save();
  ctx.fillStyle = "#5c6476";
  ctx.fillRect(0, 0, 960, 640);
  ctx.fillStyle = "#4a5263";
  ctx.fillRect(0, 470, 960, 170);
  ctx.strokeStyle = "#3a4150";
  ctx.lineWidth = 4;
  for (let x = 0; x < 960; x += 120) (ctx.beginPath(), ctx.moveTo(x, 0), ctx.lineTo(x, 470), ctx.stroke());
  // the round window, stars going by
  ctx.beginPath();
  ctx.arc(H.window.x, H.window.y, H.window.r, 0, PK_TAU);
  esPaint(ctx, "#1c2140", 6);
  ctx.save();
  ctx.beginPath();
  ctx.arc(H.window.x, H.window.y, H.window.r - 4, 0, PK_TAU);
  ctx.clip();
  for (let i = 0; i < 9; i++) {
    const x = H.window.x - 70 + ((i * 41 + t * 40) % 140),
      y = H.window.y - 50 + ((i * 29) % 100);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x, y, 3, 3);
  }
  ctx.restore();
  // the stairs up to the deck
  ctx.fillStyle = "#3a4150";
  for (let i = 0; i < 8; i++) ctx.fillRect(H.stairs.x0 + i * 18, H.stairs.y1 - (i + 1) * 52, 60, 10);
  ctx.restore();
}
/** This week's box opened in his paws, and the bite out of the cake (61), close. */
export function drawBiteCloseup(ctx, bitten) {
  ctx.save();
  ctx.fillStyle = "#5c6476";
  ctx.fillRect(0, 0, 960, 640);
  drawSnack(ctx, "pie", 480, 330, 9, 0, 0, 6);
  if (bitten) {
    ctx.fillStyle = "#5c6476";
    ctx.beginPath();
    ctx.arc(640, 230, 110, 0, PK_TAU);
    ctx.fill();
  }
  ctx.restore();
}
/** Inside the crate in the dark: a strip of light; then the lid lifts (0 to 1) and light floods in, a hand on the edge. */
export function drawLidView(ctx, lift) {
  ctx.save();
  ctx.fillStyle = "#0e0a06";
  ctx.fillRect(0, 0, 960, 640);
  const h = 8 + pkClamp(lift) * 560;
  ctx.fillStyle = "rgba(255,240,200,.95)";
  ctx.fillRect(0, 40, 960, h);
  if (lift > 0.4) {
    ctx.beginPath();
    ctx.ellipse(700, 40 + h - 20, 70, 30, 0, 0, PK_TAU);
    esPaint(ctx, "#c9b6f2", 5);
  }
  ctx.restore();
}
