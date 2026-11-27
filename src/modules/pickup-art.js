/**
 * Pickup day's drawings (Chapter 1, beats 53 to 61). Every one is a PLACEHOLDER drawing in the game's style (dark
 * outlines, flat colours) until Brian approves a look. Locked room pictures are never redrawn: these are layers on top
 * of them (listed for Brian's yes: the camera with a red light over the ramp, the mirror in the wardrobe, Lou's hat on
 * the bay floor, the things on the home walls and the pale squares they leave, the floor where the crate bed and the
 * bucket stood) or close-ups and pictures of their own (the slat view, the cargo hold, the tape screen).
 * Every word comes from pickup-lines.js (or escape-lines.js for the Guardian note and the frame); every place from
 * pickup-place.js.
 */
import { STARS_CAKES } from "./stars-cakes.js";
import { pickupWords } from "./pickup-lines.js";
import { esRect, esPaint, esWords, ES_INK, drawPawPrint, drawPinkSheet } from "./escape-art.js";
import { drawThought } from "./bedtime-story-art.js";
import { drawSnack } from "./party-snacks-art.js";
import { drawGuardianBox } from "./home-morning-art.js";
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
/** One long white hair from Mops's beard (53, 55). */
export function drawHair(ctx, x, y, len = 40, lw = 2.5) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x - len / 2, y);
  ctx.bezierCurveTo(x - len / 6, y - len / 5, x + len / 6, y + len / 5, x + len / 2, y - len / 10);
  ctx.lineCap = "round";
  ctx.strokeStyle = ES_INK;
  ctx.lineWidth = lw + 2;
  ctx.stroke();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = lw;
  ctx.stroke();
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
/** His crate on its pallet: the worn stamp "_ARS CAKES", its label once it is on, the bucket on top, the lid. */
export function drawPkCrate(ctx, cx, bottom, k, { label = false, bucket = false, open = 0, eyes = false, glow = 0 } = {}) {
  const w = PK_CRATE.w * k,
    h = PK_CRATE.h * k,
    p = PK_CRATE.pallet * k,
    x0 = cx - w / 2,
    y0 = bottom - p - h,
    lw = Math.max(1.5, 3 * k);
  ctx.save();
  // the pallet
  esRect(ctx, x0 - 4 * k, bottom - p, w + 8 * k, p, 2 * k);
  esPaint(ctx, PK_WOOD_DARK, lw);
  // the crate
  esRect(ctx, x0, y0, w, h, 3 * k);
  esPaint(ctx, PK_WOOD, lw);
  ctx.beginPath();
  ctx.moveTo(x0 + 6 * k, y0 + 6 * k);
  ctx.lineTo(x0 + w - 6 * k, y0 + h - 6 * k);
  ctx.moveTo(x0 + 6 * k, y0 + h - 6 * k);
  ctx.lineTo(x0 + w - 6 * k, y0 + 6 * k);
  ctx.strokeStyle = PK_WOOD_DARK;
  ctx.lineWidth = lw * 0.8;
  ctx.stroke();
  // the stamp (stars-cakes.js: its first letter worn off)
  esRect(ctx, cx - 46 * k, y0 + h * 0.3, 92 * k, 20 * k, 10 * k);
  esPaint(ctx, "#2b3a67", lw * 0.6);
  esWords(ctx, STARS_CAKES.faded, cx, y0 + h * 0.3 + 10 * k, Math.max(6, 11 * k), PK_GOLD, "center", 900);
  // the label: the same tag as last week's crate
  if (label) {
    esRect(ctx, cx - 50 * k, y0 + h * 0.62, 100 * k, 22 * k, 2 * k);
    esPaint(ctx, PK_PAPER, lw * 0.6);
    esWords(ctx, pickupWords("label"), cx, y0 + h * 0.62 + 11 * k, Math.max(6, 9 * k), ES_INK, "center", 900);
  }
  // the lid, lifting (0 shut, 1 open)
  if (open > 0) {
    ctx.save();
    ctx.translate(x0, y0);
    ctx.rotate(-open * 1.1);
    esRect(ctx, 0, -8 * k, w, 10 * k, 2 * k);
    esPaint(ctx, PK_WOOD, lw);
    ctx.restore();
  }
  // Squatch's eyes between the slats (hidden in it, the bucket's shadow on top)
  if (eyes) {
    for (const d of [-9, 9]) {
      ctx.beginPath();
      ctx.ellipse(cx + d * k, y0 + h * 0.18, 5 * k, 6 * k, 0, 0, PK_TAU);
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
/** Mops's mop bucket (sitting on something at `bottom`). */
export function drawBucket(ctx, cx, bottom, k) {
  const lw = Math.max(1.5, 3 * k);
  esRect(ctx, cx - 18 * k, bottom - 40 * k, 36 * k, 40 * k, 4 * k);
  esPaint(ctx, "#ffd23f", lw);
  esRect(ctx, cx - 18 * k, bottom - 46 * k, 36 * k, 10 * k, 3 * k);
  esPaint(ctx, "#8fd8ff", lw * 0.7);
}
/** A big mail bag (the row in the mail room; the first thing the robots open). */
export function drawMailBag(ctx, cx, bottom, k) {
  const lw = Math.max(1.5, 3 * k);
  ctx.beginPath();
  ctx.ellipse(cx, bottom - 30 * k, 34 * k, 30 * k, 0, 0, PK_TAU);
  esPaint(ctx, "#a98a5e", lw);
  ctx.beginPath();
  ctx.moveTo(cx - 12 * k, bottom - 58 * k);
  ctx.lineTo(cx, bottom - 70 * k);
  ctx.lineTo(cx + 12 * k, bottom - 58 * k);
  ctx.closePath();
  esPaint(ctx, "#8a6c42", lw);
}
/** Lou's fuzzy winter hat (beat 30's hat, held up, then in the bin). */
export function drawHat(ctx, x, y, k = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  ctx.beginPath();
  ctx.ellipse(0, 0, 22, 16, 0, Math.PI, 0);
  ctx.closePath();
  esPaint(ctx, "#e86f4a", 3);
  esRect(ctx, -24, -2, 48, 10, 5);
  esPaint(ctx, "#ffffff", 3);
  ctx.beginPath();
  ctx.arc(0, -18, 7, 0, PK_TAU);
  esPaint(ctx, "#ffffff", 3);
  ctx.restore();
}
/** The weekly box on the ship, tagged "For S. A new kind." (stars-cakes.js). */
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
/** A plain new robot, shinier than the first three, with a small mop arm (the ones his paw print sent for). */
export function drawNewRobotBits(ctx, x, y, k, f = 1, t = 0) {
  // a shine on its dome and a mop arm (drawn over the older program's robot picture)
  ctx.save();
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.ellipse(x - 10 * k, y - 40 * k, 5 * k, 3 * k, -0.5, 0, PK_TAU);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.restore();
  const ax = x + f * 24 * k,
    ay = y - 22 * k;
  ctx.beginPath();
  ctx.moveTo(x + f * 14 * k, y - 26 * k);
  ctx.lineTo(ax, ay + 18 * k);
  ctx.strokeStyle = "#8a93a3";
  ctx.lineWidth = Math.max(2, 4 * k);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(ax, ay + 22 * k, 7 * k, 4 * k, Math.sin(t * 6) * 0.3, 0, PK_TAU);
  esPaint(ctx, "#f4f0e6", Math.max(1.5, 2 * k));
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
export function drawArchLight(ctx, arch, light, t) {
  if (!light) return;
  const c = { red: "rgba(229,83,61,", yellow: "rgba(255,207,51,", green: "rgba(43,196,138," }[light];
  ctx.save();
  ctx.fillStyle = c + (0.35 + 0.2 * Math.sin(t * 12)).toFixed(2) + ")";
  ctx.fillRect(arch.x0 + 14, arch.y0 + 20, arch.x1 - arch.x0 - 28, arch.y1 - arch.y0 - 24);
  ctx.beginPath();
  ctx.arc((arch.x0 + arch.x1) / 2, arch.y0 + 10, 9, 0, PK_TAU);
  ctx.fillStyle = c + "1)";
  ctx.fill();
  ctx.restore();
}
/** The camera with a red light over the ramp (a layer on the bay picture, for Brian's yes; it blinks). */
export function drawCamera(ctx, x, y, t, k = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  esRect(ctx, -4, -26, 8, 20, 2);
  esPaint(ctx, "#59657d", 2);
  esRect(ctx, -22, -10, 40, 22, 4);
  esPaint(ctx, "#2d323e", 3);
  ctx.beginPath();
  ctx.arc(-26, 1, 7, 0, PK_TAU);
  esPaint(ctx, "#8a93a3", 3);
  ctx.beginPath();
  ctx.arc(12, -4, 4, 0, PK_TAU);
  ctx.fillStyle = Math.sin(t * 5) > 0 ? "#ff3b30" : "#7a1210";
  ctx.fill();
  ctx.restore();
  return { x0: x - 34 * k, y0: y - 26 * k, x1: x + 20 * k, y1: y + 12 * k };
}

// ---------- 53: home ----------
/** His crayon chart of cake kinds (a layer on the home wall). */
export function drawChart(ctx, b) {
  esRect(ctx, b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0, 3);
  esPaint(ctx, PK_PAPER, 3);
  const kinds = ["pie", "cake", "cup", "pie"];
  kinds.forEach((kind, i) => {
    const x = b.x0 + 24 + (i % 2) * 46,
      y = b.y0 + 26 + Math.floor(i / 2) * 42;
    drawSnack(ctx, kind, x, y, 0.32, 0, 0, 2);
    ctx.beginPath();
    ctx.moveTo(x + 12, y + 4);
    ctx.lineTo(x + 16, y + 10);
    ctx.lineTo(x + 24, y - 6);
    ctx.strokeStyle = i === 3 ? PK_RED : PK_GREEN;
    ctx.lineWidth = 3;
    ctx.stroke();
  });
}
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
/** Where a thing hung: a pale square on the wall. */
export function drawPaleSquare(ctx, b) {
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,.55)";
  ctx.fillRect(b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0);
  ctx.strokeStyle = "rgba(120,110,90,.25)";
  ctx.lineWidth = 2;
  ctx.strokeRect(b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0);
  ctx.restore();
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
/** The white hair on the crate's wood, held close for a second (53, 55). */
export function drawHairCloseup(ctx, t, { wood = true } = {}) {
  ctx.save();
  ctx.fillStyle = wood ? PK_WOOD : "#2d323e";
  ctx.fillRect(0, 0, 960, 640);
  if (wood) {
    ctx.strokeStyle = PK_WOOD_DARK;
    ctx.lineWidth = 6;
    for (let y = 80; y < 640; y += 140) (ctx.beginPath(), ctx.moveTo(0, y), ctx.lineTo(960, y), ctx.stroke());
  } else {
    // the robot's claw holding it up
    esRect(ctx, 440, 0, 80, 300, 10);
    esPaint(ctx, "#8a93a3", 6);
    esRect(ctx, 420, 290, 40, 70, 8);
    esPaint(ctx, "#8a93a3", 6);
    esRect(ctx, 500, 290, 40, 70, 8);
    esPaint(ctx, "#8a93a3", 6);
  }
  drawHair(ctx, 480, wood ? 330 : 390, 420, 9);
  ctx.restore();
}

// ---------- 54: through a slat ----------
/**
 * The view through a slat in the crate (the cut-in rule: someone secretly watching): the whole picture dark but a strip
 * across the middle, where `scene(ctx)` (the bay, already drawn) shows through; his two eyes in the corner.
 */
export const SLAT = Object.freeze({ y0: 250, y1: 430 });
export function drawSlatFrame(ctx, t) {
  ctx.save();
  ctx.fillStyle = "#17110b";
  ctx.fillRect(0, 0, 960, SLAT.y0);
  ctx.fillRect(0, SLAT.y1, 960, 640 - SLAT.y1);
  // the wood grain round the slat
  ctx.strokeStyle = "rgba(185,129,61,.5)";
  ctx.lineWidth = 8;
  for (const y of [SLAT.y0 - 10, SLAT.y1 + 10]) (ctx.beginPath(), ctx.moveTo(0, y), ctx.lineTo(960, y), ctx.stroke());
  // his eyes in the bottom corner, blinking now and then
  const blink = Math.sin(t * 1.3) > 0.97;
  for (const d of [-26, 26]) {
    ctx.beginPath();
    ctx.ellipse(110 + d, 540, 20, blink ? 3 : 24, 0, 0, PK_TAU);
    esPaint(ctx, "#ffffff", 3);
    if (!blink) {
      ctx.beginPath();
      ctx.arc(116 + d, 540, 9, 0, PK_TAU);
      esPaint(ctx, ES_INK, 0);
    }
  }
  ctx.restore();
  return { eyes: { x: 110, y: 540 } };
}

// ---------- 55: the idea ----------
/** The three wordless thought pictures over the plant: the hat with a red X, the hair with a green tick, Squatch with a beard and "?". */
export function drawIdea(ctx, head, age) {
  const a = pkClamp(age / 0.3),
    i = Math.min(2, Math.floor(age / 0.9));
  drawThought(ctx, head, a, (c, cx, cy) => {
    if (i === 0) {
      drawHat(c, cx, cy + 10, 1.4);
      c.strokeStyle = PK_RED;
      c.lineWidth = 7;
      c.beginPath();
      c.moveTo(cx - 34, cy - 30);
      c.lineTo(cx + 34, cy + 30);
      c.moveTo(cx + 34, cy - 30);
      c.lineTo(cx - 34, cy + 30);
      c.stroke();
    } else if (i === 1) {
      drawHair(c, cx - 10, cy, 70, 4);
      c.strokeStyle = PK_GREEN;
      c.lineWidth = 7;
      c.beginPath();
      c.moveTo(cx + 20, cy + 4);
      c.lineTo(cx + 32, cy + 20);
      c.lineTo(cx + 54, cy - 20);
      c.stroke();
    } else {
      // Squatch with a beard: his round face, a white beard, a question mark
      c.beginPath();
      c.arc(cx - 10, cy - 4, 26, 0, PK_TAU);
      esPaint(c, PK_FUR, 3);
      c.beginPath();
      c.moveTo(cx - 26, cy + 10);
      c.lineTo(cx + 6, cy + 10);
      c.lineTo(cx - 10, cy + 44);
      c.closePath();
      esPaint(c, "#ffffff", 3);
      esWords(c, "?", cx + 44, cy - 8, 40, ES_INK, "center", 900);
    }
  });
  return { picture: ["hat", "hair", "beard"][i] };
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
export const COSTUME_SPOTS = Object.freeze({ head: { x: 0, y: -52 }, chin: { x: 0, y: -30 }, body: { x: 0, y: -16 } });
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
  COSTUME_PIECES.forEach((p, i) => {
    const on = st.on[p.id];
    if (on) {
      const at = costumeSpotAt(on);
      drawCostumePiece(ctx, p.id, at.x, at.y, 1.3);
      on === p.spot && right++;
    } else if (st.held !== p.id) drawCostumePiece(ctx, p.id, DRESS.shelf[i].x, DRESS.shelf[i].y, 0.9);
  });
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
export function drawMirror(ctx, engine, b, t, show) {
  esRect(ctx, b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0, 6);
  esPaint(ctx, "#cfe8f7", 4);
  if (!show) return;
  ctx.save();
  ctx.beginPath();
  ctx.rect(b.x0 + 3, b.y0 + 3, b.x1 - b.x0 - 6, b.y1 - b.y0 - 6);
  ctx.clip();
  const mid = (b.x0 + b.x1) / 2;
  engine.drawMopsOn(ctx, mid + 12, b.y1 - 10, 0.9, { f: -1 });
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
/** Halfway up the ramp the beard drops into his paws; in the corner, the camera's red light, blinking. */
export function drawSlipCloseup(ctx, t) {
  ctx.save();
  ctx.fillStyle = "#9aa3b5";
  ctx.fillRect(0, 0, 960, 640);
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(480 + s * 150, 460, 120, 90, s * 0.3, 0, PK_TAU);
    esPaint(ctx, PK_FUR, 6);
  }
  ctx.beginPath();
  ctx.moveTo(400, 330);
  ctx.lineTo(560, 330);
  ctx.lineTo(500, 470);
  ctx.lineTo(460, 470);
  ctx.closePath();
  esPaint(ctx, "#ffffff", 6);
  drawCamera(ctx, 830, 110, t, 3);
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
 * The tape screen, filling the picture, with the REC badge and the three big buttons (PLAY · tape, ZOOM · in,
 * NEXT · tape; the one to press now bright, the others dim). `clip`: "night" (a furry ball at the bin posts a paper) or
 * "today" (Mops up the ramp, then a very tall goat); `k` how far it has played (0 to 1); `zoom`: "", "paw", "star",
 * "feet".
 */
export function drawTapeScreen(ctx, engine, { clip, k, zoom, next, star }, t) {
  const S = PK_OFFICE.screen;
  ctx.save();
  ctx.fillStyle = "#1c2030";
  ctx.fillRect(0, 0, 960, 640);
  esRect(ctx, S.x0, S.y0, S.x1 - S.x0, S.y1 - S.y0, 10);
  esPaint(ctx, clip === "night" ? "#2b3350" : "#8c94a6", 6);
  ctx.save();
  ctx.beginPath();
  ctx.rect(S.x0 + 4, S.y0 + 4, S.x1 - S.x0 - 8, S.y1 - S.y0 - 8);
  ctx.clip();
  if (!zoom && clip === "night") {
    // the bin, the robot mailbox; a round furry ball unrolls at the bin, presses a paw on a paper, posts it
    esRect(ctx, 260, 280, 70, 90, 6);
    esPaint(ctx, "#8a93a3", 4);
    esRect(ctx, 620, 250, 90, 120, 10);
    esPaint(ctx, PK_BLUE, 4);
    const x = 340 + Math.min(1, k * 1.6) * 230;
    ctx.beginPath();
    ctx.arc(x, 340, 34, 0, PK_TAU);
    esPaint(ctx, PK_FUR, 4);
    k > 0.3 && k < 0.8 && (esRect(ctx, x + 10, 290, 34, 44, 2), esPaint(ctx, "#ffe08a", 3));
  } else if (!zoom && clip === "today") {
    // the ramp; Mops walks up; then a very tall goat
    ctx.beginPath();
    ctx.moveTo(380, 450);
    ctx.lineTo(580, 450);
    ctx.lineTo(530, 80);
    ctx.lineTo(430, 80);
    ctx.closePath();
    esPaint(ctx, "#6b7385", 4);
    const mk = Math.min(1, k * 2),
      sk = Math.max(0, k * 2 - 1);
    mk < 1 && engine.drawMopsOn(ctx, 470, 430 - mk * 300, 2.6, { f: 1, walk: t * 8 });
    sk > 0 && engine.drawSquatch(ctx, 490, 440 - sk * 200, 3.4, { f: 1, walk: t * 8, jacket: true, horns: true });
  } else if (zoom === "paw") {
    esRect(ctx, 300, 120, 360, 300, 4);
    esPaint(ctx, "#ffe08a", 5);
    drawPawPrint(ctx, 480, 270, 90);
  } else if (zoom === "star") {
    esRect(ctx, 220, 150, 520, 220, 16);
    esPaint(ctx, PK_PAPER, 6);
    esWords(ctx, "GANITOR", 480, 260, 64, "#1d4fb8", "center", 900);
    star && (esWords(ctx, star, 480, 340, 30, ES_INK, "center", 900));
  } else if (zoom === "feet") {
    // the beard in two furry paws, two big furry feet
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(480 + s * 120, 420, 100, 50, 0, 0, PK_TAU);
      esPaint(ctx, PK_FUR, 5);
    }
    ctx.beginPath();
    ctx.moveTo(420, 110);
    ctx.lineTo(540, 110);
    ctx.lineTo(500, 250);
    ctx.lineTo(460, 250);
    ctx.closePath();
    esPaint(ctx, "#ffffff", 5);
    for (const s of [-1, 1]) (ctx.beginPath(), ctx.ellipse(480 + s * 110, 200, 60, 46, 0, 0, PK_TAU), esPaint(ctx, PK_FUR, 5));
  }
  ctx.restore();
  // the REC badge and the tape's label
  esRect(ctx, S.x0 + 20, S.y0 + 18, 90, 40, 8);
  esPaint(ctx, "#7a1210", 3);
  esWords(ctx, pickupWords("rec"), S.x0 + 65, S.y0 + 38, 22, "#ffffff", "center", 900);
  esWords(ctx, pickupWords(clip === "night" ? "tape-night" : "tape-today"), S.x1 - 30, S.y0 + 38, 24, "#ffffff", "right", 900);
  // the three buttons
  const W = { play: "button-play", zoom: "button-zoom", next: "button-next-tape" };
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
  drawSnack(ctx, "pie", 480, 330, 3.2, 0, 0, 5);
  if (bitten) {
    ctx.fillStyle = "#5c6476";
    ctx.beginPath();
    ctx.arc(620, 260, 70, 0, PK_TAU);
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
