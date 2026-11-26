/**
 * The home morning's drawings (Chapter 1, beats 22 to 24). Everything here is a PLACEHOLDER drawing in the game's
 * style (dark outlines, flat colours) until Brian approves a look: the toy rocket with the folded note tied on as a
 * gift tag, Mops's paper lunch bag, the Guardian Box close-up (the first build's box view: the open box, the older
 * notes, the lid's taped MY GARDIAN BOX label, Squatch's crayon drawing MY GUARDIANS), the thought bubbles (the box;
 * his crayon Guardians), and today's marks on the calendar close-up (the days before the circled Moon Pie day crossed
 * off). The Guardian Box in the room is the approved one (docs/approved-art/closet/, home-alone.js GUARDIAN_BOX) in its
 * approved look, DAY2_BOX times its approved size.
 * Sizes are read against the home room: Squatch is 48.5 of his units at the room's scale 3 (about 145 px), and every
 * thing here is a share of that (MORNING_SIZES). Game positions are the 960 x 640 picture.
 */
import { GUARDIAN_BOX } from "./guardian-box.js";
import { drawThought } from "./bedtime-story-art.js";
import { drawGuardiansCrayon } from "./guardians-drawing.js";
import { morningWords } from "./home-morning-lines.js";

const HM_INK = "#1e2430";
const ROCKET_RED = "#e5533d";
// The locked home picture is 1280 x 830; the game picture 960 x 640.
const PIC_X = 960 / 1280,
  PIC_Y = 640 / 830;
// The approved box in picture pixels (outline included) and on the game picture.
const BOX_PIC = Object.freeze({ w: GUARDIAN_BOX.x1 - GUARDIAN_BOX.x0, h: GUARDIAN_BOX.y1 - GUARDIAN_BOX.y0 });
/**
 * On Day 2 the Guardian Box is drawn DAY2_BOX times its approved size, in the closet and out on the floor, so it reads
 * clearly bigger than the toy rocket, a box the rocket fits in (Brian, 2026-11-26, video note 0:21: "Box shouldn't look
 * so small versus the rocket"). In the closet it keeps its approved bottom-right corner and grows up and left, under
 * the shirts. Its look is the approved one. Day 1's closet (home-alone.js) keeps the approved size: a question for
 * Brian whether it should match.
 */
export const DAY2_BOX = 2.4;
const BOX_W = BOX_PIC.w * PIC_X * DAY2_BOX,
  BOX_H = BOX_PIC.h * PIC_Y * DAY2_BOX;

/**
 * How big each thing is in the room (game pixels; placeholders, Brian to approve): Squatch is the room's own size;
 * the rocket about two fifths of him (a big toy he can hold up; coordinator, 2026-11-26: at a third it was about 10 px
 * tall on a phone), the lunch bag about a third (a paper bag drawn a little big so it reads on a phone); the box the
 * approved one, DAY2_BOX times bigger, so the rocket fits in it.
 */
export const MORNING_SIZES = Object.freeze({
  squatch: 48.5 * 3,
  rocket: 64,
  rocketW: 34, // fin tip to fin tip
  bag: { w: 40, h: 52 },
  box: Object.freeze({ w: BOX_W, h: BOX_H }),
});

/**
 * Where things are in the room (game positions; placeholders). The rocket stands on the floor at the foot of the bed
 * (in front of its right end); the lunch bag sits on the floor just inside the doorway, where Mops put it down; the
 * Guardian Box is on the closet floor (the approved place) until Squatch takes it out and sets it on the floor
 * between the wardrobe and him (BOX_OUT), where it stays.
 */
export const MORNING_THINGS = Object.freeze({
  rocket: Object.freeze({ x: 352, y: 600 }), // the middle of its base: open floor in front of the bed's right end
  bag: Object.freeze({ x: 846, y: 505 }), // the middle of its bottom: open floor just inside the doorway
  boxIn: Object.freeze({ x0: GUARDIAN_BOX.x1 * PIC_X - BOX_W, y0: GUARDIAN_BOX.y1 * PIC_Y - BOX_H, x1: GUARDIAN_BOX.x1 * PIC_X, y1: GUARDIAN_BOX.y1 * PIC_Y }),
  boxOut: Object.freeze({ x0: 160, y0: 338, x1: 160 + BOX_W, y1: 338 + BOX_H }),
});
/** The boxes the dashed outline traces each drawn thing inside (a little bigger than the thing, nothing else in them). */
export const TRACE = Object.freeze({
  rocket: Object.freeze({ x0: 322, x1: 400, y0: 520, y1: 610 }),
  bag: Object.freeze({ x0: 814, x1: 878, y0: 442, y1: 514 }),
});
/** The dashed outline round the things the game draws: thicker than a room thing's, so it shows on a phone. */
export const DRAWN_OUTLINE = Object.freeze({ width: 7, dash: 14, gap: 3 });
// The rocket is drawn in 46 units (base to nose); this many game pixels to a unit at its room size.
const ROCKET_UNIT = MORNING_SIZES.rocket / 46;

function hmRound(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, Math.max(0, Math.min(r, w / 2, h / 2)));
}
function hmPaint(ctx, fill, line) {
  fill && ((ctx.fillStyle = fill), ctx.fill());
  line && ((ctx.strokeStyle = HM_INK), (ctx.lineWidth = line), (ctx.lineJoin = "round"), ctx.stroke());
}

/** The folded note: a cream paper folded once, no words and no marks. Its middle at (0, 0), in rocket units. */
function giftNote(ctx, lw) {
  ctx.save();
  ctx.rotate(0.18);
  hmRound(ctx, -7, -5, 14, 10, 1.2);
  hmPaint(ctx, "#fff4c2", lw);
  ctx.beginPath();
  ctx.moveTo(-7, 0.5);
  ctx.lineTo(7, 0.5);
  ctx.strokeStyle = "rgba(30,36,48,.45)";
  ctx.lineWidth = lw * 0.6;
  ctx.stroke();
  ctx.restore();
}

/**
 * The toy rocket with the note tied on as a gift tag, the middle of its base at (x, y), `k` times its room size,
 * turned by `a`. `tag`: the note hangs from it on a string (false: drawn by the caller elsewhere). `lw`: outline width
 * in game pixels. Returns its box (game positions, unturned).
 */
export function drawRocket(ctx, x, y, { k = 1, a = 0, tag = true, lw = 2.5 } = {}) {
  const u = k * ROCKET_UNIT,
    w = lw / u;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(a);
  ctx.scale(u, u);
  // fins
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(s * 6, -16);
    ctx.lineTo(s * 12, -2);
    ctx.lineTo(s * 12, 0);
    ctx.lineTo(s * 5, -4);
    ctx.closePath();
    hmPaint(ctx, ROCKET_RED, w);
  }
  // the body, the nose cone, the round window
  hmRound(ctx, -7, -36, 14, 34, 6);
  hmPaint(ctx, "#fffdf8", w);
  ctx.beginPath();
  ctx.moveTo(-6.4, -34);
  ctx.quadraticCurveTo(0, -50, 6.4, -34);
  ctx.closePath();
  hmPaint(ctx, ROCKET_RED, w);
  ctx.beginPath();
  ctx.arc(0, -24, 3.6, 0, Math.PI * 2);
  hmPaint(ctx, "#8fdcff", w);
  // the exhaust at the bottom
  hmRound(ctx, -4, -4, 8, 4, 1);
  hmPaint(ctx, "#59657d", w);
  if (tag) {
    // the string from the body to the note, then the note
    ctx.beginPath();
    ctx.moveTo(6.5, -20);
    ctx.quadraticCurveTo(13, -16, 15, -11);
    ctx.strokeStyle = HM_INK;
    ctx.lineWidth = w * 0.5;
    ctx.stroke();
    ctx.translate(17, -6);
    giftNote(ctx, w);
  }
  ctx.restore();
  return { x0: x - 12 * u, x1: x + (tag ? 25 : 12) * u, y0: y - 46 * u, y1: y };
}

/** Just the note (in the box close-up, where it hangs over the rim). (x, y) its middle, `k` the rocket's scale. */
export function drawGiftNote(ctx, x, y, k, lw = 2.5) {
  ctx.save();
  const u = k * ROCKET_UNIT;
  ctx.translate(x, y);
  ctx.scale(u, u);
  giftNote(ctx, lw / u);
  ctx.restore();
}

/** Mops's paper lunch bag, the middle of its bottom at (x, y): a brown bag with its top folded over. No words. */
export function drawLunchBag(ctx, x, y, k = 1) {
  const W = MORNING_SIZES.bag.w,
    H = MORNING_SIZES.bag.h;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  const w = 2.5 / k;
  hmRound(ctx, -W / 2, -H + 8, W, H - 8, 2);
  hmPaint(ctx, "#c9a06b", w);
  // the folded top: a little narrower, darker, with a crinkled edge
  ctx.beginPath();
  ctx.moveTo(-W / 2 + 2, -H + 9);
  ctx.lineTo(-W / 2 + 2, -H);
  for (let i = 0; i <= 6; i++) ctx.lineTo(-W / 2 + 2 + ((W - 4) * i) / 6, -H + (i % 2 ? 2 : 0));
  ctx.lineTo(W / 2 - 2, -H + 9);
  ctx.closePath();
  hmPaint(ctx, "#a87f4b", w);
  // a crease down the middle
  ctx.beginPath();
  ctx.moveTo(0, -H + 12);
  ctx.lineTo(0, -4);
  ctx.strokeStyle = "rgba(30,36,48,.3)";
  ctx.lineWidth = w;
  ctx.stroke();
  ctx.restore();
}

/**
 * The approved Guardian Box (home-alone.js GUARDIAN_BOX: Brian's look of 2026-11-23), its top left at (x0, y0) on
 * the game picture, `k` times its approved size (Day 2's size unless told). Drawn as home-alone.js draws it on the
 * closet floor.
 */
export function drawGuardianBox(ctx, x0, y0, k = DAY2_BOX) {
  const b = GUARDIAN_BOX,
    half = b.line / 2;
  ctx.save();
  ctx.translate(x0, y0);
  ctx.scale(PIC_X * k, PIC_Y * k);
  ctx.beginPath();
  ctx.roundRect(half, half, BOX_PIC.w - b.line, BOX_PIC.h - b.line, b.radius);
  ctx.fillStyle = b.fill;
  ctx.fill();
  ctx.lineWidth = b.line;
  ctx.strokeStyle = b.ink;
  ctx.stroke();
  // The letter is part of the approved picture, not reading text.
  ctx.font = `900 ${b.letter}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("G", BOX_PIC.w / 2, BOX_PIC.h / 2 + 1);
  ctx.restore();
}

/**
 * The box out on the floor with the gift in it: the rocket lies in it on the older notes, leaning, its nose sticking out
 * over the front, the note hanging over the rim. `box` is the box's place (game positions).
 */
export function drawBoxWithGift(ctx, box) {
  const cx = (box.x0 + box.x1) / 2;
  drawRocket(ctx, cx - 6, box.y1 - 30, { a: -0.18, tag: false });
  drawGuardianBox(ctx, box.x0, box.y0);
  drawGiftNote(ctx, box.x1 - 9, box.y0 + 3, 1);
}

/** The thought bubble over Squatch's head with the Guardian Box in it (no words). Returns its box. */
export function drawBoxThought(ctx, head, a = 1) {
  const k = 2.2,
    w = BOX_PIC.w * PIC_X * k,
    h = BOX_PIC.h * PIC_Y * k;
  return drawThought(ctx, head, a, (c, cx, cy) => drawGuardianBox(c, cx - w / 2, cy - h / 2, k));
}

/**
 * The thought bubble over Squatch's head with his crayon drawing of the Guardians in it (guardians-drawing.js, the
 * same drawing as in the box and at bedtime): who he thinks they are, as he holds up their gift (no words).
 */
export const CRAYON_THOUGHT = Object.freeze({ w: 210, cloud: Object.freeze({ w: 270, h: 196 }) });
export function drawCrayonThought(ctx, head, a = 1) {
  let drawing = null;
  const box = drawThought(ctx, head, a, (c, cx, cy) => (drawing = drawGuardiansCrayon(c, cx, cy, CRAYON_THOUGHT.w)), CRAYON_THOUGHT.cloud);
  return { box, drawing };
}

// ---------- the outlines' sources: each drawn thing alone on a plain floor, once ----------
const SOURCES = {};
/** A canvas the size of the game picture with only `id` ("rocket" or "bag") drawn at its place, for the dashed outline. */
export function outlineSource(id) {
  if (SOURCES[id]) return SOURCES[id];
  if (typeof document === "undefined") return null;
  const c = document.createElement("canvas");
  c.width = 960;
  c.height = 640;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.fillStyle = "#e8e3d9";
  ctx.fillRect(0, 0, 960, 640);
  const t = MORNING_THINGS[id];
  id === "rocket" ? drawRocket(ctx, t.x, t.y) : drawLunchBag(ctx, t.x, t.y);
  return (SOURCES[id] = c);
}

// ---------- the calendar close-up's marks for today ----------
/**
 * Over the older program's calendar close-up (src/game/15-ch1-scene1.js drawCh1Calendar, its paper 720 x 530 drawn
 * at (460, 320) scaled by 0.92 + 0.08 * zoom): days 1 to 13 crossed off in pencil, so the circled Moon Pie day (14)
 * is the first day not crossed off, today; and that circle pulses. Placeholder marks. Returns what it drew.
 */
export const CALENDAR_TODAY = Object.freeze({ day: 14, circle: Object.freeze({ x: 492, y: 330 }) });
export function drawCalendarToday(ctx, zoom, time) {
  const s = 0.92 + 0.08 * Math.min(1, zoom || 0);
  ctx.save();
  ctx.translate(460, 320);
  ctx.scale(s, s);
  ctx.translate(-360, -265);
  ctx.lineCap = "round";
  ctx.strokeStyle = "rgba(70,78,92,.5)";
  ctx.lineWidth = 3;
  const crossed = [];
  for (let day = 1; day < CALENDAR_TODAY.day; day++) {
    const x = 30 + ((day - 1) % 5) * 132,
      y = 130 + Math.floor((day - 1) / 5) * 80;
    ctx.beginPath();
    ctx.moveTo(x + 26, y + 12);
    ctx.lineTo(x + 112, y + 70);
    ctx.moveTo(x + 112, y + 12);
    ctx.lineTo(x + 26, y + 70);
    ctx.stroke();
    crossed.push(day);
  }
  // today's circle pulses: a second red ring breathing out from the crayon circle
  const p = 0.5 + 0.5 * Math.sin((time || 0) * 4);
  ctx.strokeStyle = `rgba(229,83,61,${0.35 + 0.45 * p})`;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(CALENDAR_TODAY.circle.x, CALENDAR_TODAY.circle.y, 44 + 6 * p, 41 + 6 * p, -0.15, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
  return { crossed, today: CALENDAR_TODAY.day };
}

// ---------- the Guardian Box close-up (one full-screen cutaway picture, waits for NEXT) ----------
/**
 * The close-up, brought back from the first build's box view (commit 18c9157, 2026-11-02, its "gbox" panel; Brian,
 * 2026-11-26, video note 0:21: "I thought the view we had in much earlier versions was better - when we also had the
 * note and you could see the my guardians drawing etc"): the box open and big on the left, the older notes standing in
 * it, its lid open behind it with the taped label MY GARDIAN BOX, and Squatch's crayon drawing of the Guardians (MY
 * GUARDIANS) leaning against its side (guardians-drawing.js, the same drawing as the bedtime picture and the thought
 * bubble). His furry paw holds the gift over the box until `hold`, lets go, and the rocket drops in over `fall` (the
 * thunk at `hold + fall`), the note tied on going in with it and then hanging over the rim. The old notes show no
 * readable words (their lines are pending). Timing in seconds and places in game pixels are placeholders.
 *   box      the box's front (game pixels); the rocket is drawn in the room's proportion to it (a box it fits in)
 *   drawing  the crayon drawing: its middle, width and tilt
 */
export const BOX_CLOSEUP = Object.freeze({
  hold: 1.0,
  fall: 0.45,
  floor: 540,
  box: Object.freeze({ x0: 215, y0: 362, x1: 575, y1: 602 }),
  lid: Object.freeze({ x0: 8, x1: 206, y0: 250, y1: 560 }),
  drawing: Object.freeze({ x: 770, y: 300, w: 330, tilt: 0.05 }),
});

// One of the older notes standing in the box: a white paper, a little turned, with grey pencil lines and no words.
function oldNote(ctx, x, y, w, h, a) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(a);
  hmRound(ctx, -w / 2, -h, w, h, 4);
  hmPaint(ctx, "#ffffff", 3);
  ctx.strokeStyle = "rgba(89,101,125,.55)";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  for (let i = 0; i < 3; i++) {
    const ly = -h + 22 + i * 18;
    ctx.beginPath();
    ctx.moveTo(-w / 2 + 16, ly);
    ctx.lineTo(w / 2 - 16 - (i === 2 ? w * 0.3 : 0), ly);
    ctx.stroke();
  }
  ctx.restore();
}

function gboxCloseUp(ctx, t, engine) {
  const C = BOX_CLOSEUP,
    B = C.box,
    w = B.x1 - B.x0,
    h = B.y1 - B.y0,
    cx = (B.x0 + B.x1) / 2,
    rim = 46; // how far back the box's open top reaches
  const say = (text, x, y, size, color) => (engine && engine.text ? (engine.text(text, x, y, size, color, "center", 900), text) : "");
  // the wall and the floor
  ctx.fillStyle = "#f4f1ea";
  ctx.fillRect(0, 0, 960, 640);
  ctx.fillStyle = "#ebe6da";
  ctx.fillRect(0, C.floor, 960, 640 - C.floor);
  // the lid, off and leaning against the box's left side, its label taped on (clear of the gift and his arm)
  const lid = C.lid;
  ctx.beginPath();
  ctx.moveTo(lid.x0 + 24, lid.y0);
  ctx.lineTo(lid.x1, lid.y0 + 16);
  ctx.lineTo(lid.x1 - 6, lid.y1);
  ctx.lineTo(lid.x0, lid.y1 - 8);
  ctx.closePath();
  hmPaint(ctx, GUARDIAN_BOX.fill, 5);
  const lmid = (lid.x0 + lid.x1) / 2 + 4,
    lab = { x0: lmid - 90, x1: lmid + 90, y0: lid.y0 + 56, y1: lid.y0 + 156 };
  hmRound(ctx, lab.x0, lab.y0, lab.x1 - lab.x0, lab.y1 - lab.y0, 4);
  hmPaint(ctx, "#fffdf8", 3);
  ctx.fillStyle = "rgba(255,248,200,.9)";
  ctx.fillRect(lab.x0 - 10, lab.y0 - 8, 34, 16);
  ctx.fillRect(lab.x1 - 24, lab.y0 - 8, 34, 16);
  // MY GARDIAN BOX in his hand, on two lines so it is big on a phone
  const [l1, l2] = [morningWords("sign-box").split(" ").slice(0, 2).join(" "), morningWords("sign-box").split(" ").slice(2).join(" ")];
  say(l1, lmid, lab.y0 + 32, 26, HM_INK);
  say(l2, lmid, lab.y0 + 68, 26, HM_INK);
  const label = l1 + " " + l2;
  // the open top: the dark inside, back rim higher than the front
  ctx.beginPath();
  ctx.moveTo(B.x0, B.y0);
  ctx.lineTo(B.x0 + 26, B.y0 - rim);
  ctx.lineTo(B.x1 - 26, B.y0 - rim);
  ctx.lineTo(B.x1, B.y0);
  ctx.closePath();
  hmPaint(ctx, "#1b3f86", 5);
  // the older notes, standing in the box
  const notes = [
    [cx - 100, B.y0 + 30, 150, 140, -0.12],
    [cx + 10, B.y0 + 30, 160, 156, 0.05],
    [cx + 105, B.y0 + 30, 130, 130, 0.16],
  ];
  for (const n of notes) oldNote(ctx, ...n);
  // the gift: held over the box, falling in, then standing in it among the notes
  const K = w / BOX_W, // the room's proportion: the box here is K times the box in the room, and so is the rocket
    fallK = Math.max(0, Math.min(1, (t - C.hold) / C.fall)),
    landed = t >= C.hold + C.fall,
    held = { y: B.y0 - rim - 6 },
    rest = { y: B.y0 + 100 },
    by = held.y + (rest.y - held.y) * fallK * fallK,
    a = 0.14 * Math.min(1, fallK * 1.4),
    rx = cx - 30;
  const rocket = drawRocket(ctx, rx, by, { k: K, a, tag: !landed, lw: 5 });
  // the box's front over the notes and the gift's lower part: the approved look (the white G), made big
  hmRound(ctx, B.x0, B.y0, w, h, 14);
  hmPaint(ctx, GUARDIAN_BOX.fill, 6);
  ctx.font = `900 ${Math.round(h * 0.55)}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("G", cx, B.y0 + h / 2 + 6); // the approved box's letter, part of its picture
  landed && drawGiftNote(ctx, rx + 70, B.y0 + 8, K * 0.9, 5);
  // the crayon drawing, leaning on the box's right side, with its title in crayon
  const D = C.drawing,
    title = morningWords("sign-drawing");
  const sheet = drawGuardiansCrayon(ctx, D.x, D.y, D.w, {
    tilt: D.tilt,
    title: (x, y, size) => say(title, x, y, size, "#e5533d"),
  });
  // his furry arm reaching in from the top, his paw round the rocket, then letting go and lifting away
  const lift = Math.max(0, Math.min(1, (t - C.hold) / 0.3)),
    paw = { x: rx + 2 * K * ROCKET_UNIT, y: by - 30 * K * ROCKET_UNIT - lift * 160 };
  furryArm(ctx, paw, { x: paw.x + 120, y: -60 });
  return {
    pic: "gbox",
    label,
    labelBox: lab,
    title,
    drawing: sheet,
    notes: notes.length,
    held: t < C.hold,
    landed,
    sizes: { k: K, box: { w, h }, rocket: MORNING_SIZES.rocket * K },
  };
}

// Squatch's fur and paw colours and his outline (squatch-art.js SQUATCH_LOOK), for his arm in the close-up.
const FUR = "#6b4428",
  FUR_DARK = "#55351f",
  PAD = "#f4c39a";
/**
 * Squatch's arm, big, from `from` (off the top of the picture) to his paw at `paw`, closed round something: a furry
 * outline (little tufts along both sides), his fur colour, a round paw with three knuckles and a pale palm pad.
 * A placeholder drawing.
 */
function furryArm(ctx, paw, from) {
  const dx = from.x - paw.x,
    dy = from.y - paw.y,
    len = Math.hypot(dx, dy),
    nx = -dy / len,
    ny = dx / len,
    half = 30;
  // the arm: two furry sides, tufts every 22 px
  const side = (s) => {
    const pts = [];
    for (let d = 0; d <= len; d += 22) {
      const k = d / len,
        bump = (d / 22) % 2 ? 6 : 0;
      pts.push({ x: paw.x + dx * k + nx * s * (half + bump), y: paw.y + dy * k + ny * s * (half + bump) });
    }
    return pts;
  };
  const a = side(1),
    b = side(-1).reverse();
  ctx.beginPath();
  ctx.moveTo(a[0].x, a[0].y);
  for (const p of a.slice(1)) ctx.lineTo(p.x, p.y);
  for (const p of b) ctx.lineTo(p.x, p.y);
  ctx.closePath();
  hmPaint(ctx, FUR, 5);
  // a darker streak of fur down the arm
  ctx.beginPath();
  ctx.moveTo(paw.x + dx * 0.25 + nx * 8, paw.y + dy * 0.25 + ny * 8);
  ctx.lineTo(paw.x + dx * 0.9 + nx * 8, paw.y + dy * 0.9 + ny * 8);
  ctx.strokeStyle = FUR_DARK;
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.stroke();
  // the paw: round, with three knuckles on top, wrapped round the rocket, and its pale palm pad showing
  ctx.beginPath();
  ctx.ellipse(paw.x, paw.y, 40, 34, 0, 0, Math.PI * 2);
  hmPaint(ctx, FUR, 5);
  for (const k of [-1, 0, 1]) {
    ctx.beginPath();
    ctx.arc(paw.x + k * 22 - 6, paw.y + 26, 13, 0, Math.PI * 2);
    hmPaint(ctx, FUR, 4);
  }
  ctx.beginPath();
  ctx.ellipse(paw.x + 10, paw.y - 2, 17, 13, 0.2, 0, Math.PI * 2);
  hmPaint(ctx, PAD, 3);
}

/** The close-up as the cutaway draws it (cutaway.js PANELS "gbox"): one picture, waiting for NEXT (it has words). */
export const GBOX_PANELS = Object.freeze([gboxCloseUp]);
export const GBOX_ID = "gbox";
