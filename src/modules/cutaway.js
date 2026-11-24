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
 * Drawn here in the game's style (dark outlines, flat colours). Mops is drawn by this file too, from the same
 * shapes as the engine's drawMops but with outlines as thin as in Brian's approved picture (see "Mops in the
 * close-up"), and his beard so it can dunk and twist.
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
// A close-up: Mops is drawn big with his hooves at the bottom edge, the bucket in front of him at the bottom.
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
  ctx.lineWidth = 4;
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
  ctx.lineWidth = 4;
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

// Mops in the close-up. He is drawn here, not by the engine's drawMops: that function scales its outlines with
// him, so at this size they came out 24 px thick and his legs read as black-and-white stripes. This drawing
// follows the same shapes (src/game/60-frame-draw.js, "Near legs white, far legs light grey") and Brian's
// approved picture (mops-approved-nov8.png): thin dark outlines, white legs with dark grey hooves, a blue
// shirt with a two-point collar and a pocket with a small white name patch, fluffy white head, tan curled
// horns, pink inner ears, a short tail, closed eyes as a line, a pink nose and a small smile.
const S = MOPS.scale;
// Outline widths in picture pixels, like the approved picture at this size.
const LINE = 4,
  FINE = 3;
const SHIRT = "#3478f6",
  WHITE = "#ffffff",
  FAR_LEG = "#dfe3e8",
  HOOF = "#4a505c",
  HORN = "#c9ad84",
  EAR_PINK = "#f6b3c2",
  NOSE = "#f2a7b6",
  NOSE_LINE = "#d9879a";
// He bends forward round his front hip; his feet stay on the floor.
const PIVOT = { x: 10, y: -10 };
// The widest outline this frame drew on Mops, in picture pixels (tests).
let widest = 0;

// Where a point of Mops's own drawing (his units, feet at 0, 0, facing right) lands in the picture when he
// bends forward by `lean` radians.
function at(x, y, lean) {
  const c = Math.cos(lean),
    sn = Math.sin(lean),
    dx = x - PIVOT.x,
    dy = y - PIVOT.y;
  return { x: MOPS.x + (PIVOT.x + dx * c - dy * sn) * S, y: MOPS.y + (PIVOT.y + dx * sn + dy * c) * S };
}
// His chin (where the beard grows, under his snout) for a lean.
function chin(lean) {
  const a = at(13.5, -24.5, lean),
    b = at(22, -24.5, lean);
  return { x0: a.x, x1: b.x, y: (a.y + b.y) / 2 };
}
// The part of Mops that shows.
function mopsBox() {
  const top = at(29, -45, 0),
    tail = at(-23, -24, 0);
  return { x0: tail.x - 30, x1: at(28, -29, 0).x + 20, y0: top.y, y1: 640 };
}

// Builds a path in Mops's units (bent by `lean`), then fills and outlines it in picture pixels, so the
// outline stays thin however big he is drawn.
function shape(ctx, lean, build, fill, line = LINE, ink = INK) {
  ctx.save();
  ctx.translate(MOPS.x, MOPS.y);
  ctx.scale(S, S);
  ctx.translate(PIVOT.x, PIVOT.y);
  ctx.rotate(lean);
  ctx.translate(-PIVOT.x, -PIVOT.y);
  ctx.beginPath();
  build(ctx);
  ctx.restore();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (line) {
    ctx.lineWidth = line;
    ctx.strokeStyle = ink;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();
    if (ink === INK) widest = Math.max(widest, line);
  }
}
// A fluffy blob (the engine's fluff shape): `n` bumps round an ellipse.
function fluff(ctx, x, y, rx, ry, n, d) {
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2,
      px = x + Math.cos(a) * rx,
      py = y + Math.sin(a) * ry;
    if (i === 0) {
      ctx.moveTo(px, py);
      continue;
    }
    const m = ((i - 0.5) / n) * Math.PI * 2;
    ctx.quadraticCurveTo(x + Math.cos(m) * (rx + d * 1.6), y + Math.sin(m) * (ry + d * 1.6), px, py);
  }
  ctx.closePath();
}
// A thick round-ended band (a leg, a horn): a dark band `LINE` wider on each side, then the colour on top.
function band(ctx, pts, width, colour) {
  const draw = () => {
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      const p = pts[i];
      p.cx != null ? ctx.quadraticCurveTo(p.cx, p.cy, p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
  };
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  draw();
  ctx.lineWidth = width + LINE * 2;
  ctx.strokeStyle = INK;
  ctx.stroke();
  ctx.lineWidth = width;
  ctx.strokeStyle = colour;
  ctx.stroke();
  widest = Math.max(widest, LINE);
}
// One leg from under his body down to the floor, white or light grey, with a dark grey hoof.
function leg(ctx, x, lean, colour) {
  const top = at(x, -12, lean),
    foot = { x: MOPS.x + x * S, y: MOPS.y },
    w = 3.4 * S;
  band(ctx, [top, foot], w, colour);
  const h = 2.6 * S;
  ctx.beginPath();
  ctx.roundRect(foot.x - w / 2, foot.y - h, w, h + w / 2, [6, 6, w / 2, w / 2]);
  ctx.fillStyle = HOOF;
  ctx.fill();
  ctx.lineWidth = LINE;
  ctx.strokeStyle = INK;
  ctx.stroke();
}

// His legs, tail, body and shirt. `lifted` leaves out the near front leg (it is up, gripping his beard).
function mopsBody(ctx, lean, lifted) {
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(MOPS.x, MOPS.y + 6, 22 * S, 3.5 * S, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(30,36,48,.12)";
  ctx.fill();
  // Far legs light grey, near legs white (mops-approved-nov8.png); far ones first.
  for (const [x, c] of [
    [-12, FAR_LEG],
    [6, FAR_LEG],
    [-6, WHITE],
    [12, WHITE],
  ])
    if (!(lifted && x === 12)) leg(ctx, x, lean, c);
  // His short tail, up at the rump, then his fluffy white body.
  shape(ctx, lean, (c) => fluff(c, -19, -24, 3, 4.5, 6, 1), WHITE);
  shape(ctx, lean, (c) => fluff(c, 0, -17, 17, 9, 14, 2), WHITE);
  // The blue work shirt over his back, white belly below.
  shape(
    ctx,
    lean,
    (c) => {
      c.ellipse(0, -17, 18, 10, 0, Math.PI * 1.09, Math.PI * 1.91);
      c.lineTo(16, -12);
      c.quadraticCurveTo(0, -10, -16, -12);
      c.closePath();
    },
    SHIRT,
  );
  // The two-point collar at his neck.
  for (const [a, b, c2, d2, f2, g2] of [
    [4, -24.6, 8, -18.6, 10.5, -23.8],
    [9.5, -24.2, 12.5, -18.8, 14.5, -24.6],
  ])
    shape(
      ctx,
      lean,
      (c) => {
        c.moveTo(a, b);
        c.lineTo(c2, d2);
        c.lineTo(f2, g2);
        c.closePath();
      },
      SHIRT,
    );
  // The chest pocket, with the small white oval name patch along its top.
  shape(
    ctx,
    lean,
    (c) => {
      c.moveTo(2.8, -19.4);
      c.lineTo(9.2, -19.4);
      c.lineTo(9.2, -15);
      c.quadraticCurveTo(6, -13, 2.8, -15);
      c.closePath();
    },
    SHIRT,
    FINE,
  );
  shape(ctx, lean, (c) => c.ellipse(6, -19.4, 2.3, 1.1, 0, 0, Math.PI * 2), WHITE, FINE);
  ctx.restore();
}

// His head: pink-lined ears, fluffy white head, snout with a pink nose and a small smile, closed eyes as a
// line, tan curled horns. Drawn after the beard so the beard grows from under his chin.
function mopsHead(ctx, lean) {
  ctx.save();
  for (const [x0, rot, k] of [
    [8.5, -0.35, -1],
    [25.5, 0.35, 1],
  ]) {
    shape(ctx, lean, (c) => c.ellipse(x0, -31, 5, 2.4, rot, 0, Math.PI * 2), WHITE);
    shape(ctx, lean, (c) => c.ellipse(x0 + k * 0.8, -30.8, 3, 1.1, rot, 0, Math.PI * 2), EAR_PINK, 0);
  }
  shape(ctx, lean, (c) => fluff(c, 17, -29, 7, 7, 10, 1.6), WHITE);
  // The snout: filled over the head's outline, outlined only on its outer side.
  shape(ctx, lean, (c) => c.ellipse(24, -26.2, 3.6, 2.7, 0.1, 0, Math.PI * 2), WHITE, 0);
  shape(ctx, lean, (c) => c.ellipse(24, -26.2, 3.6, 2.7, 0.1, -Math.PI * 0.62, Math.PI * 0.72), null);
  shape(ctx, lean, (c) => c.ellipse(26.7, -26.9, 1.25, 1, 0.2, 0, Math.PI * 2), NOSE, 2, NOSE_LINE);
  // Closed eyes, a flat line, as in the approved picture; a small smile under the nose.
  shape(
    ctx,
    lean,
    (c) => {
      c.moveTo(17.3, -29.3);
      c.lineTo(21, -29.3);
    },
    null,
  );
  shape(
    ctx,
    lean,
    (c) => {
      c.moveTo(22.6, -25);
      c.quadraticCurveTo(24.4, -23.5, 26.3, -24.7);
    },
    null,
    FINE,
  );
  // Tan horns curling back and down at their tips.
  const hw = 2.6 * S;
  for (const h of [
    [13, -34, 10, -44, 5, -44, 2, -43, 3, -40],
    [20, -35, 22, -45, 27, -45, 30, -44, 29, -41],
  ]) {
    const p = (i) => at(h[i], h[i + 1], lean);
    const a = p(0),
      c1 = p(2),
      b = p(4),
      c2 = p(6),
      e = p(8);
    band(ctx, [a, { cx: c1.x, cy: c1.y, x: b.x, y: b.y }, { cx: c2.x, cy: c2.y, x: e.x, y: e.y }], hw, HORN);
  }
  ctx.restore();
}

// His beard, the way the game draws it (white, narrow, grey hair lines, a ragged end), but long and big:
// from his chin down to `bottom`. Its sides wave a little, like hair. With `twist` (the wring), the hair lines
// run round it instead of down it.
function beard(ctx, c, bottom, sway, twist) {
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
  ctx.lineCap = "round";
  ctx.strokeStyle = BEARD_LINE;
  if (twist == null) {
    for (const k of [0.25, 0.5, 0.75]) {
      ctx.beginPath();
      ctx.moveTo(c.x0 + w * k, c.y + 16);
      ctx.quadraticCurveTo(c.x0 + w * k + 6, (c.y + bottom) / 2, c.x0 + w * k + sway * 0.8, bottom - 18);
      ctx.stroke();
    }
    return;
  }
  // Wrung: the hair runs round the beard in curved diagonal strands, like a twisted rope; `twist` slides them.
  ctx.save();
  ctx.clip();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#9aa3b3";
  for (let y = c.y - 30 + (twist % 30); y < bottom + 30; y += 30) {
    ctx.beginPath();
    ctx.moveTo(c.x0 - 6, y);
    ctx.quadraticCurveTo((c.x0 + c.x1) / 2, y + 22, c.x1 + 6, y + 20);
    ctx.stroke();
  }
  ctx.restore();
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

// Picture 1: he bends over the bucket and dunks his beard, again and again (1.8 s a dunk).
function dunk(ctx, t) {
  const k = (t % 1.8) / 1.8;
  // 0 to .35 bending down, .35 to .6 under, .6 to 1 back up and dripping.
  const down = k < 0.35 ? k / 0.35 : k < 0.6 ? 1 : 1 - (k - 0.6) / 0.4;
  const ease = down * down * (3 - 2 * down);
  const lean = 0.04 + 0.22 * ease;
  room(ctx);
  bucketBack(ctx, k > 0.3 && k < 0.7 ? 3 * Math.sin(k * 40) : 0);
  mopsBody(ctx, lean, false);
  const c = chin(lean);
  // The beard hangs from his chin; bent over, its end is deep in the water (hidden by the bucket).
  const bottom = BUCKET_AT.rim - 20 + ease * 150;
  beard(ctx, c, bottom, 0);
  mopsHead(ctx, lean);
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
  return { bucket, lean };
}

// Picture 2: standing on three legs, he grips his beard with his near front hoof right above the bucket and
// wrings it: two hard twists with the water pouring back into the bucket, then a rest (2.8 s a loop).
function wring(ctx, t) {
  const k = (t % 2.8) / 2.8;
  const twist = k < 0.28 ? k / 0.28 : k > 0.36 && k < 0.64 ? (k - 0.36) / 0.28 : 0;
  const twisting = twist > 0;
  const lean = 0.06;
  room(ctx);
  bucketBack(ctx, twisting ? 2 * Math.sin(t * 30) : 0);
  mopsBody(ctx, lean, true);
  const c = chin(lean);
  const bottom = BUCKET_AT.rim - 18;
  const squeeze = twisting ? Math.sin(twist * Math.PI) * 18 : 0;
  const narrow = { x0: c.x0 + squeeze, x1: c.x1 - squeeze, y: c.y };
  beard(ctx, narrow, bottom, 0, (twisting ? twist * 2 : 0) * 30);
  mopsHead(ctx, lean);
  // His near front leg comes up from under the shirt and grips the beard; the dark grey hoof wraps round it.
  const shoulder = at(12, -13, lean),
    grip = { x: (narrow.x0 + narrow.x1) / 2 - 4, y: c.y + (bottom - c.y) * 0.8 };
  band(ctx, [shoulder, { cx: shoulder.x + 40, cy: grip.y + 40, x: grip.x - 16, y: grip.y }], 3.4 * S, WHITE);
  ctx.beginPath();
  ctx.ellipse(grip.x, grip.y, 26, 20, 0.3, 0, Math.PI * 2);
  ctx.fillStyle = HOOF;
  ctx.fill();
  ctx.lineWidth = LINE;
  ctx.strokeStyle = INK;
  ctx.stroke();
  // Cartoon twist marks either side of the grip while he wrings.
  if (twisting) {
    ctx.lineWidth = LINE;
    ctx.lineCap = "round";
    ctx.strokeStyle = INK;
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(grip.x + side * 92, grip.y, 28, side < 0 ? Math.PI * 0.6 : -Math.PI * 0.4, side < 0 ? Math.PI * 1.4 : Math.PI * 0.4);
      ctx.stroke();
    }
  }
  const bucket = bucketFront(ctx);
  // The water drips back into the bucket while he wrings; a drip while he rests.
  const n = twisting ? 7 : 1;
  for (let i = 0; i < n; i++) drop(ctx, narrow.x0 + 12 + ((i * 37) % Math.max(20, narrow.x1 - narrow.x0 - 12)), bottom + 4 + ((t * 300 + i * 41) % 60), 9);
  return { bucket, lean };
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
  widest = 0;
  const { bucket, lean } = panels[step.panel](ctx, t);
  ctx.restore();
  drawTapCue(ctx, engine, t, cue);
  const m = mopsBox();
  last = {
    id: step.id,
    panel: step.panel,
    full: true,
    mops: { w: m.x1 - m.x0, h: m.y1 - m.y0, outline: widest, nose: at(26.7, -26.9, lean) },
    bucket: { w: bucket.x1 - bucket.x0, h: bucket.y1 - bucket.y0 },
  };
}

/** What the last cutaway frame drew (tests). */
export function lastCutaway() {
  return last;
}
