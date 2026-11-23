/**
 * The full-screen cutaway: the room is hidden and one story picture fills the screen, like the Wookiee TV's
 * "full-screen story" (DECISIONS 2026-11-22) and without a TV box (Brian G 213: "maybe it's similar to TV
 * cutaway but wihtout the box?"). Each picture is one queue step: it waits for a tap or NEXT, shows the
 * "tap ▸" cue, and plays a short loop while it waits (an animation, never a step of the story).
 *
 * The morning uses it for Mops wringing his beard (Brian G 561: "then you see him wringing out his beard. I
 * think that would be a good chance to do a cutaway"). Modelled on the reference he picked (G 221, as the bot
 * described it at G 224): he bends over a plain bucket, dunks his beard, and wrings it out right above it so
 * the water pours back in, twice. G 189: Mops is bigger than the bucket and really leans in.
 *
 * Drawn here in the game's style (thick dark outlines, flat colours); Mops himself is the game's own drawing
 * (the engine's drawMops), with his beard drawn by this file so it can dunk and twist.
 */
const INK = "#1e2430";
const WALL = "#f4f1ea",
  FLOOR = "#ebe6da",
  BUCKET = "#ffcf33",
  BUCKET_DARK = "#d9a514",
  WATER = "#8fdcff",
  BEARD = "#f4f5f8",
  BEARD_LINE = "#c9ced8";
// Where things stand in the picture (game positions, 960 x 640).
const FLOOR_Y = 470;
// A close-up: Mops is drawn big with his feet below the bottom edge, the bucket in front of him at the bottom.
const MOPS = { x: 300, y: 640, scale: 12 };
const BUCKET_AT = { x: 655, rim: 520, bottom: 690, top: 165, base: 140 };

let last = null;

/** The queue steps for one cutaway: one per picture, in order. */
export function cutawaySteps(id) {
  const n = PANELS[id] ? PANELS[id].length : 0;
  return Array.from({ length: n }, (_, panel) => ({ k: "cutaway", id, panel }));
}

/** True while a cutaway picture is the thing on screen. */
export function isCutaway(step) {
  return !!step && step.k === "cutaway";
}

/** The pulsing "tap ▸" cue, bottom right of the picture. `words` is the cue's text (from the lines file). */
export function drawTapCue(ctx, engine, t, words) {
  const a = 0.6 + 0.4 * Math.abs(Math.sin(t * 3));
  ctx.save();
  ctx.globalAlpha = a;
  ctx.beginPath();
  ctx.roundRect(790, 566, 120, 44, 22);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = INK;
  ctx.stroke();
  engine.text(words, 850, 588, 22, INK, "center", 800);
  ctx.restore();
}

function room(ctx) {
  ctx.fillStyle = WALL;
  ctx.fillRect(0, 0, 960, FLOOR_Y);
  ctx.fillStyle = FLOOR;
  ctx.fillRect(0, FLOOR_Y, 960, 640 - FLOOR_Y);
  ctx.strokeStyle = "rgba(30,36,48,.18)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, FLOOR_Y);
  ctx.lineTo(960, FLOOR_Y);
  ctx.stroke();
}

// The bucket: back half (inside and water) and front half (the body that hides what is in the water).
function bucketBack(ctx, slosh) {
  const b = BUCKET_AT;
  ctx.beginPath();
  ctx.ellipse(b.x, b.rim, b.top, 20, 0, 0, Math.PI * 2);
  ctx.fillStyle = BUCKET_DARK;
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = INK;
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(b.x, b.rim + 6, b.top - 12, 13 + slosh, 0, 0, Math.PI * 2);
  ctx.fillStyle = WATER;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.stroke();
}
function bucketFront(ctx) {
  const b = BUCKET_AT;
  ctx.beginPath();
  ctx.moveTo(b.x - b.top, b.rim);
  ctx.lineTo(b.x - b.base, b.bottom);
  ctx.quadraticCurveTo(b.x, b.bottom + 16, b.x + b.base, b.bottom);
  ctx.lineTo(b.x + b.top, b.rim);
  ctx.ellipse(b.x, b.rim, b.top, 20, 0, 0, Math.PI, false);
  ctx.closePath();
  ctx.fillStyle = BUCKET;
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = INK;
  ctx.stroke();
  // Two bands round the bucket, a shine, and the handle.
  ctx.lineWidth = 3;
  for (const k of [0.38, 0.72]) {
    const y = b.rim + (b.bottom - b.rim) * k,
      hw = b.top + (b.base - b.top) * k;
    ctx.beginPath();
    ctx.ellipse(b.x, y, hw, 12, 0, 0.15, Math.PI - 0.15);
    ctx.strokeStyle = BUCKET_DARK;
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(b.x - 60, b.rim + 34);
  ctx.lineTo(b.x - 52, b.bottom - 22);
  ctx.lineWidth = 7;
  ctx.lineCap = "round";
  ctx.strokeStyle = "rgba(255,255,255,.55)";
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(b.x, b.rim + 2, b.top + 6, 62, 0, Math.PI * 1.05, Math.PI * 1.95);
  ctx.lineWidth = 4;
  ctx.strokeStyle = INK;
  ctx.stroke();
  return { x0: b.x - b.top, x1: b.x + b.top, y0: b.rim - 64, y1: Math.min(640, b.bottom + 16) };
}

// Where a point of Mops's own drawing (his units, feet at 0, 0, facing right) lands in the picture when he
// leans forward by `lean` radians (his drawing turns round his feet, as the engine's lean does).
function at(x, y, lean) {
  const c = Math.cos(lean),
    sn = Math.sin(lean),
    s = MOPS.scale;
  return { x: MOPS.x + (x * c - y * sn) * s, y: MOPS.y + (x * sn + y * c) * s };
}
// His chin (where the beard grows) for a lean.
function chin(lean) {
  const a = at(14.5, -25, lean),
    b = at(23.5, -25, lean);
  return { x0: a.x, x1: b.x, y: (a.y + b.y) / 2 };
}
// The part of Mops that shows (his legs are below the bottom edge).
function mopsBox() {
  const top = at(29, -45, 0),
    tail = at(-23, -24, 0);
  return { x0: tail.x - 30, x1: at(26, -29, 0).x + 20, y0: top.y, y1: 640 };
}

// His beard, the way the game draws it (white, narrow, grey hair lines, a ragged end), but long and big:
// from his chin down to `bottom`. Its sides wave a little, like hair.
function beard(ctx, c, bottom, sway) {
  const w = c.x1 - c.x0,
    len = bottom - c.y,
    tips = 7,
    waves = Math.max(2, Math.round(len / 46));
  ctx.beginPath();
  ctx.moveTo(c.x0, c.y - 6);
  for (let i = 1; i <= waves; i++) {
    const y0 = c.y + ((i - 1) * len) / waves,
      y1 = c.y + (i * len) / waves;
    ctx.quadraticCurveTo(c.x0 - 9 + (sway * i) / waves, (y0 + y1) / 2, c.x0 + (sway * i) / waves, y1 - (i === waves ? 8 : 0));
  }
  for (let i = 0; i <= tips; i++) ctx.lineTo(c.x0 + sway + (w * i) / tips, bottom + (i % 2 ? 10 : -6));
  for (let i = waves; i >= 1; i--) {
    const y0 = c.y + ((i - 1) * len) / waves,
      y1 = c.y + (i * len) / waves;
    ctx.quadraticCurveTo(c.x1 + 9 + (sway * i) / waves, (y0 + y1) / 2, c.x1 + (sway * (i - 1)) / waves, y0 - (i === 1 ? 6 : 0));
  }
  ctx.closePath();
  ctx.fillStyle = BEARD;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = INK;
  ctx.stroke();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = BEARD_LINE;
  for (const k of [0.25, 0.5, 0.75]) {
    ctx.beginPath();
    ctx.moveTo(c.x0 + w * k, c.y + 16);
    ctx.quadraticCurveTo(c.x0 + w * k + 6, (c.y + bottom) / 2, c.x0 + w * k + sway * 0.8, bottom - 18);
    ctx.stroke();
  }
}

function drop(ctx, x, y, r) {
  ctx.beginPath();
  ctx.moveTo(x, y - r * 1.8);
  ctx.quadraticCurveTo(x + r, y - r * 0.2, x, y + r);
  ctx.quadraticCurveTo(x - r, y - r * 0.2, x, y - r * 1.8);
  ctx.fillStyle = WATER;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = INK;
  ctx.stroke();
}

// Picture 1: he bends far over the bucket and dunks his beard, again and again (1.8 s a dunk).
function dunk(ctx, engine, t) {
  const k = (t % 1.8) / 1.8;
  // 0 to .35 bending down, .35 to .6 under, .6 to 1 back up and dripping.
  const down = k < 0.35 ? k / 0.35 : k < 0.6 ? 1 : 1 - (k - 0.6) / 0.4;
  const ease = down * down * (3 - 2 * down);
  const lean = 0.06 + 0.3 * ease;
  room(ctx);
  bucketBack(ctx, k > 0.3 && k < 0.7 ? 3 * Math.sin(k * 40) : 0);
  engine.drawMops(MOPS.x, MOPS.y, MOPS.scale, { f: 1, noBeard: true, sway: lean });
  const c = chin(lean);
  // The beard hangs from his chin; bent over, its end is deep in the water (hidden by the bucket).
  const bottom = BUCKET_AT.rim - 20 + ease * 150;
  beard(ctx, c, bottom, 0);
  const bucket = bucketFront(ctx);
  if (k > 0.28 && k < 0.52) {
    const s = (k - 0.28) / 0.24;
    for (const [dx, h] of [
      [-110, 70],
      [-60, 105],
      [70, 95],
      [120, 60],
    ])
      drop(ctx, (c.x0 + c.x1) / 2 + dx * (0.6 + s * 0.6), BUCKET_AT.rim - h * Math.sin(s * Math.PI), 10);
  }
  if (k > 0.65) {
    const s = (k - 0.65) / 0.35;
    for (let i = 0; i < 4; i++) drop(ctx, c.x0 + 16 + i * 26, Math.min(BUCKET_AT.rim - 4, bottom + 16 + ((s * 120 + i * 30) % 60)), 8);
  }
  return bucket;
}

// Picture 2: upright, he grips his beard with a front hoof right above the bucket and wrings it: two hard
// twists with the water pouring back into the bucket, then a rest (2.8 s a loop).
function wring(ctx, engine, t) {
  const k = (t % 2.8) / 2.8;
  const twist = k < 0.28 ? k / 0.28 : k > 0.36 && k < 0.64 ? (k - 0.36) / 0.28 : 0;
  const twisting = twist > 0;
  const lean = 0.1;
  room(ctx);
  bucketBack(ctx, twisting ? 2 * Math.sin(t * 30) : 0);
  engine.drawMops(MOPS.x, MOPS.y, MOPS.scale, { f: 1, noBeard: true, sway: lean, mouth: twisting ? "o" : "" });
  const c = chin(lean);
  const bottom = BUCKET_AT.rim - 18;
  const squeeze = twisting ? Math.sin(twist * Math.PI) * 18 : 0;
  const narrow = { x0: c.x0 + squeeze, x1: c.x1 - squeeze, y: c.y };
  beard(ctx, narrow, bottom, 0);
  // The twist: diagonal stripes round the beard that slide while he wrings.
  ctx.save();
  ctx.beginPath();
  ctx.rect(narrow.x0 - 4, c.y + 24, narrow.x1 - narrow.x0 + 8, bottom - c.y - 30);
  ctx.clip();
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#9aa3b3";
  const off = (twisting ? twist * 2 : 0) * 30;
  for (let y = c.y - 30 + (off % 30); y < bottom + 30; y += 30) {
    ctx.beginPath();
    ctx.moveTo(narrow.x0 - 6, y);
    ctx.lineTo(narrow.x1 + 6, y + 26);
    ctx.stroke();
  }
  ctx.restore();
  // His near front leg comes up and grips the beard; the hoof wraps round it.
  const shoulder = at(13, -14, lean),
    grip = { x: (narrow.x0 + narrow.x1) / 2 - 4, y: c.y + (bottom - c.y) * 0.8 };
  ctx.lineCap = "round";
  ctx.lineWidth = 3.4 * MOPS.scale + 8;
  ctx.strokeStyle = INK;
  ctx.beginPath();
  ctx.moveTo(shoulder.x, shoulder.y);
  ctx.quadraticCurveTo(shoulder.x + 40, grip.y + 40, grip.x - 16, grip.y);
  ctx.stroke();
  ctx.lineWidth = 3.4 * MOPS.scale;
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(grip.x, grip.y, 26, 20, 0.3, 0, Math.PI * 2);
  ctx.fillStyle = "#4a505c";
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = INK;
  ctx.stroke();
  // Cartoon twist marks either side of the grip while he wrings.
  if (twisting) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = INK;
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(grip.x + side * 92, grip.y, 28, side < 0 ? Math.PI * 0.6 : -Math.PI * 0.4, side < 0 ? Math.PI * 1.4 : Math.PI * 0.4);
      ctx.stroke();
    }
  }
  const bucket = bucketFront(ctx);
  // The water pours back into the bucket while he wrings; a drip while he rests.
  const n = twisting ? 7 : 1;
  for (let i = 0; i < n; i++) drop(ctx, narrow.x0 + 12 + ((i * 37) % Math.max(20, narrow.x1 - narrow.x0 - 12)), bottom + 4 + ((t * 300 + i * 41) % 60), 9);
  return bucket;
}

const PANELS = {
  beard: [dunk, wring],
};

/** Draws the cutaway picture `step` fills the screen with. `cue` is the "tap ▸" words. */
export function drawCutaway(ctx, engine, step, t, cue) {
  const panels = PANELS[step.id];
  if (!panels || !panels[step.panel]) return;
  ctx.save();
  ctx.fillStyle = WALL;
  ctx.fillRect(0, 0, 960, 640);
  const bucket = panels[step.panel](ctx, engine, t);
  ctx.restore();
  drawTapCue(ctx, engine, t, cue);
  const m = mopsBox();
  last = {
    id: step.id,
    panel: step.panel,
    full: true,
    mops: { w: m.x1 - m.x0, h: m.y1 - m.y0 },
    bucket: { w: bucket.x1 - bucket.x0, h: bucket.y1 - bucket.y0 },
  };
}

/** What the last cutaway frame drew (tests). */
export function lastCutaway() {
  return last;
}
