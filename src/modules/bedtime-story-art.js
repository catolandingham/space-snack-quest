/**
 * The bedtime story's pictures (Chapter 1, beat 21: why Moon Pies), full screen, in the old story pictures' look
 * (the washed-out "years ago" colours and frame, tv-story-art.js storyWash). Brian, 2026-11-25: the old crate story
 * from commit 71ec66e "is the bedtime story (beat 21) and gets the same sizing fix" ("Look at how small mops and
 * squatch are versus box."). The old pictures, by name and in order:
 *   crate   a delivery crate of Moon Pies, three Moon Pies on its lid
 *   baby    the crate open, a sleeping baby Sasquatch in it covered in crumbs, Mops beside it with a "!"
 *   beard   the baby out of the crate, holding Mops's beard and giggling
 *   weent   the same picture, Mops's "...Weeee-eenn-nnttt?" in a bubble over him (one bubble, no caption: the TV
 *           story split its "*gasp*" off the same way; the old picture had "...Baaa?", Brian 2026-11-26: "Goats say
 *           "weeeent" not baaaah")
 *   bucket, hide   Mops beside his mop bucket, the baby hidden in it (BEDTIME_SWITCHES.bucketPicture, on since
 *                  Brian's answer of 2026-11-26)
 * Only Mops and baby Squatch are in the pictures (docs/GUARDIANS-STORY-BRIEF.md: the story is only about Mops finding
 * him; no parents, no other Sasquatches, no hints of them).
 * Sizes: everything is drawn as the home room draws it, 1.6 times bigger (BED_STORY.k). Mops is the room's Mops (the
 * engine's own drawing, the approved one: a goat whose beard is his mop, down to the floor; no mop prop). The crate is
 * the crate bed of the locked home room (docs/locked-rooms/home_room.py draw_bed_crate: the same planks, cross braces,
 * grey corner posts, Moon Pie badge and short legs), without the bed's purple pillow, since it was not a bed yet. So
 * Mops stands against the crate exactly as he does in the room. Baby Squatch is BED_STORY.baby of a grown Squatch.
 * The old pictures had the characters far smaller than the crate (a crate 80 units wide, Mops about 30).
 * Drawn here, new, for Brian's yes: the crate's shape in a picture, the Moon Pies on the lid, the lid leaning on the
 * crate, the crumbs, the baby's pose and the bucket picture.
 */
import { placeThought } from "./thought-place.js";
import { caption, bubble, storyWash } from "./tv-story-art.js";
import { drawSquatchArt, armEnds } from "./squatch-art.js";
import { bedLine, BEDTIME_SWITCHES } from "./bedtime-story-lines.js";
import { drawGuardiansCrayon } from "./guardians-drawing.js";

const INK = "#1e2430";
// Canvas pixels to one unit of docs/locked-rooms/home_room.py (its S maps a unit to 1.4286 picture pixels, and the
// 1280-wide locked picture is drawn 960 wide).
const ROOM_UNIT = (1200 / 840) * 0.75;
/**
 * The pictures' sizes. k: how much bigger than the home room everything is drawn. floor: where feet and the crate's
 * legs stand (canvas y). roomScale: the home room's scale for Mops and Squatch (the engine's wl). tall: Mops's and
 * Squatch's height in their own units. baby: a baby Squatch's height as a share of a grown one (a placeholder).
 */
export const BED_STORY = Object.freeze({ k: 1.6, floor: 470, roomScale: 3, tall: 45, baby: 0.45 });
const MOPS_SCALE = BED_STORY.roomScale * BED_STORY.k,
  BABY_SCALE = MOPS_SCALE * BED_STORY.baby,
  U = ROOM_UNIT * BED_STORY.k;
// The crate bed in the home room (home_room.py units): 190 x 106, on legs 18 tall.
export const CRATE = Object.freeze({ w: 190, body: 106, legs: 18 });
const CRATE_COLOR = "#d9a35b",
  CRATE_LINE = "#a9743a",
  BRACE = "#785028",
  POST = "#b9b9b9",
  DARK = "#22242c";

/** Sizes in canvas pixels: in the room (k = 1) and in the pictures (tests compare them). */
export function sizesAt(k) {
  const u = ROOM_UNIT * k;
  return { mops: BED_STORY.tall * BED_STORY.roomScale * k, crate: { w: CRATE.w * u, h: (CRATE.body + CRATE.legs) * u }, baby: BED_STORY.tall * BED_STORY.roomScale * k * BED_STORY.baby };
}

function round(ctx, x, y, w, h, r) {
  const k = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + k, y);
  ctx.arcTo(x + w, y, x + w, y + h, k);
  ctx.arcTo(x + w, y + h, x, y + h, k);
  ctx.arcTo(x, y + h, x, y, k);
  ctx.arcTo(x, y, x + w, y, k);
  ctx.closePath();
}
function paint(ctx, fill, line, ink = INK) {
  fill && ((ctx.fillStyle = fill), ctx.fill());
  line && ((ctx.strokeStyle = ink), (ctx.lineWidth = line), (ctx.lineJoin = "round"), ctx.stroke());
}
function seg(ctx, x0, y0, x1, y1, color, width) {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.stroke();
}
const disc = (ctx, x, y, r) => (ctx.beginPath(), ctx.arc(x, y, r, 0, Math.PI * 2));

/**
 * The Moon Pie crate, as the home room's crate bed is drawn (home_room.py draw_bed_crate and its Moon Pie badge),
 * with its middle at `cx` and its legs on `bottom`, `u` canvas pixels to a unit. `words`: the badge says MOON PIES
 * (left out in the little crate of the thought bubble, which has no words). Returns its box.
 */
export function drawCrate(ctx, cx, bottom, u, { words = true } = {}) {
  const w = CRATE.w * u,
    h = CRATE.body * u,
    x0 = cx - w / 2,
    y0 = bottom - (CRATE.body + CRATE.legs) * u,
    s = u / ROOM_UNIT; // line widths grow with the crate
  // its short legs and the dark board between them
  ctx.fillStyle = "#2d323e";
  ctx.fillRect(x0 + 18 * u, y0 + h, 154 * u, CRATE.legs * u);
  for (const lx of [2, 172]) (round(ctx, x0 + lx * u, y0 + h, 16 * u, CRATE.legs * u, 2 * s), paint(ctx, "#c98a3a", 1.5 * s, DARK));
  round(ctx, x0, y0, w, h, 3 * s);
  paint(ctx, CRATE_COLOR, 3 * s, DARK);
  for (const a of [1, 2, 3]) seg(ctx, x0 + 4 * u, y0 + (a * h) / 4, x0 + w - 4 * u, y0 + (a * h) / 4, CRATE_LINE, 1.5 * s);
  seg(ctx, x0 + 7 * u, y0 + 7 * u, x0 + w - 7 * u, y0 + h - 7 * u, BRACE, 2.2 * s);
  seg(ctx, x0 + 7 * u, y0 + h - 7 * u, x0 + w - 7 * u, y0 + 7 * u, BRACE, 2.2 * s);
  for (const px of [x0, x0 + w - 12 * u]) (ctx.beginPath(), ctx.rect(px, y0, 12 * u, h), paint(ctx, POST, 1.5 * s, DARK));
  // the Moon Pie badge: a navy pill with a Moon Pie on the left, a little yellow moon on the right
  const bx = cx,
    by = y0 + h * 0.42,
    bs = 0.55 * u,
    bw = 124 * bs,
    bh = 30 * bs;
  round(ctx, bx - bw / 2, by - bh / 2, bw, bh, 15 * bs);
  paint(ctx, "#2b3a67", 2.2 * s, DARK);
  disc(ctx, bx - 47 * bs, by, 10 * bs);
  paint(ctx, "#8b5a3c", 1.5 * s, DARK);
  ctx.beginPath();
  ctx.arc(bx - 47 * bs, by, 9 * bs, -0.7, 2.4);
  ctx.strokeStyle = "#fff3d6";
  ctx.lineWidth = 1.8 * s;
  ctx.stroke();
  disc(ctx, bx + 50 * bs, by - 3 * bs, 6 * bs);
  paint(ctx, "#f4c430", 1.5 * s, DARK);
  disc(ctx, bx + 53 * bs, by - 5 * bs, 5 * bs);
  paint(ctx, "#2b3a67", 0);
  // The badge's words are painted on, as in the locked picture (drawn straight, at the badge's own size: the
  // game's text would grow them past the badge on a phone).
  if (words) {
    ctx.save();
    ctx.font = `800 ${Math.round(14 * bs)}px Nunito, system-ui, sans-serif`;
    ctx.fillStyle = "#f4c430";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(bedLine("sign-moon-pies"), bx + 1 * bs, by + 1 * bs);
    ctx.restore();
  }
  return { x0, y0, x1: x0 + w, y1: bottom, top: y0 };
}

// A soft shadow under something standing on the floor.
function shadow(ctx, cx, w) {
  ctx.beginPath();
  ctx.ellipse(cx, BED_STORY.floor + 2, w / 2, 7, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(30,36,48,.15)";
  ctx.fill();
}
// A Moon Pie: a round brown cookie with a pale rim, sitting on `y`.
function moonPie(ctx, x, y, r) {
  disc(ctx, x, y - r, r);
  paint(ctx, "#8b5a3c", 3, INK);
  ctx.beginPath();
  ctx.arc(x, y - r, r * 0.72, -0.7, 2.4);
  ctx.strokeStyle = "#fff3d6";
  ctx.lineWidth = 3;
  ctx.stroke();
}
// Crumbs: little brown dots round (x, y).
function crumbs(ctx, x, y, spread, n) {
  for (let i = 0; i < n; i++) {
    const a = i * 2.39996,
      r = spread * (0.3 + ((i * 37) % 70) / 100);
    disc(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r * 0.6, 2.6 + (i % 3));
    paint(ctx, "#8b5a3c", 0);
  }
}

// Mops as the room draws him (the engine's approved drawing), on this picture, `f` 1 facing right.
function mops(ctx, engine, x, f, opts) {
  const o = { f, walk: 0, mop: false, ...(opts || {}) };
  if (engine && engine.drawMopsOn) engine.drawMopsOn(ctx, x, BED_STORY.floor, MOPS_SCALE, o);
  else if (engine && engine.drawMops) engine.drawMops(x, BED_STORY.floor, MOPS_SCALE, o);
  // where the top of his head is, and his mouth (facing right; mirrored facing left)
  return { head: { x: x + 17 * MOPS_SCALE * f, y: BED_STORY.floor - BED_STORY.tall * MOPS_SCALE }, mouth: { x: x + 22 * MOPS_SCALE * f, y: BED_STORY.floor - 24 * MOPS_SCALE } };
}
// Baby Squatch, the room's Squatch drawn small, his feet at (x, y).
function baby(ctx, x, y, opts) {
  return drawSquatchArt(ctx, x, y, BABY_SCALE, { line: 5, ...(opts || {}) });
}
// The arm angle (from straight down, squatch-art.js armEnds) that points his far arm from its shoulder at a point.
function reach(x, y, tx, ty) {
  const sh = armEnds()[0].shoulder;
  return Math.atan2(tx - (x + sh.x * BABY_SCALE), ty - (y + sh.y * BABY_SCALE));
}

// A picture: the scene on the pale story background, then the "years ago" wash and frame (no YEARS AGO mark:
// the old crate story had none), then its words over the wash.
function storyPicture(ctx, scene, words) {
  ctx.fillStyle = "#f1f3f6";
  ctx.fillRect(0, 0, 960, 640);
  const drew = scene() || {};
  storyWash(ctx);
  return { ...drew, ...(words ? words() : {}) };
}
const sizes = () => sizesAt(BED_STORY.k);

// The scenes (canvas pixels, feet on BED_STORY.floor).
const CRATE_AT = { solo: 480, baby: 625, beard: 765 };
function crateScene(ctx) {
  shadow(ctx, CRATE_AT.solo, CRATE.w * U + 30);
  const c = drawCrate(ctx, CRATE_AT.solo, BED_STORY.floor, U);
  for (const dx of [-80, 0, 80]) moonPie(ctx, CRATE_AT.solo + dx, c.top + 2, 30);
  return { cast: [] };
}
function babyScene(ctx, engine, t) {
  const cx = CRATE_AT.baby;
  shadow(ctx, cx, CRATE.w * U + 30);
  // the lid, off and leaning on the crate's right side
  ctx.save();
  ctx.translate(cx + (CRATE.w * U) / 2 + 30, BED_STORY.floor);
  ctx.rotate(-1.32);
  round(ctx, 0, -6, (CRATE.w - 40) * U, 16 * U, 4);
  paint(ctx, CRATE_COLOR, 4.2, DARK);
  ctx.restore();
  const top = BED_STORY.floor - (CRATE.body + CRATE.legs) * U,
    feet = top + 39;
  // asleep in the crate, his head and shoulders over its edge, covered in crumbs
  const b = baby(ctx, cx, feet, { eyes: "closed", shadow: false });
  const c = drawCrate(ctx, cx, BED_STORY.floor, U);
  crumbs(ctx, cx, b.box.y0 + 26, 30, 9);
  crumbs(ctx, cx, c.top + 4, 70, 10);
  const m = mops(ctx, engine, 235, 1);
  return { cast: ["mops", "baby"], zzz: { x: cx + 66, y: b.box.y0 - 6 + Math.sin(t * 2) * 3 }, surprise: { x: m.head.x - 10, y: m.head.y - 30 }, mopsHead: m.head };
}
// Mops and the baby holding the bottom of his beard, his other arm up as he giggles. `t` makes him bounce.
function beardScene(ctx, engine, t) {
  shadow(ctx, CRATE_AT.beard, CRATE.w * U + 30);
  drawCrate(ctx, CRATE_AT.beard, BED_STORY.floor, U);
  const mx = 300,
    m = mops(ctx, engine, mx, 1),
    bx = 448,
    by = BED_STORY.floor - Math.abs(Math.sin(t * 7)) * 5,
    // the front edge of his beard, low down (the engine's drawMops: the beard runs from 14 to 23.5 of his units)
    grab = { x: mx + 21.5 * MOPS_SCALE, y: BED_STORY.floor - 10 * MOPS_SCALE };
  baby(ctx, bx, by, { arms: [{ a: reach(bx, by, grab.x, grab.y) }, { a: Math.PI - 0.45 + Math.sin(t * 7) * 0.15 }] });
  return { cast: ["mops", "baby"], mopsHead: m.head, mouth: m.mouth };
}
function bucketScene(ctx, engine) {
  // his mop bucket as the home room draws it (yellow), drawn so it reads as a bucket: wider at the top, a thick rim,
  // a wire handle and two little wheels; the baby's eyes over its rim
  const cx = 560,
    wTop = 176,
    wBot = 128,
    h = 132,
    wheel = 12,
    bottom = BED_STORY.floor - wheel,
    top = bottom - h;
  shadow(ctx, cx, wTop + 10);
  // the handle, behind (an arc up over the rim)
  ctx.beginPath();
  ctx.ellipse(cx, top + 4, wTop / 2 - 8, 70, 0, Math.PI, 0);
  ctx.strokeStyle = DARK;
  ctx.lineWidth = 5;
  ctx.stroke();
  baby(ctx, cx, top + 46, { shadow: false });
  ctx.beginPath();
  ctx.moveTo(cx - wTop / 2, top);
  ctx.lineTo(cx + wTop / 2, top);
  ctx.lineTo(cx + wBot / 2, bottom);
  ctx.lineTo(cx - wBot / 2, bottom);
  ctx.closePath();
  paint(ctx, "#ffcf33", 4.2, DARK);
  // the rim, a darker band round the top, and two ribs down the side
  round(ctx, cx - wTop / 2 - 6, top - 6, wTop + 12, 18, 8);
  paint(ctx, "#e0a81c", 4.2, DARK);
  for (const k of [-0.25, 0.25]) seg(ctx, cx + k * wTop, top + 22, cx + k * wBot, bottom - 10, "#d9a514", 4);
  for (const wx of [cx - wBot / 2 + 18, cx + wBot / 2 - 18]) (disc(ctx, wx, bottom + wheel / 2, wheel / 2 + 2), paint(ctx, "#59657d", 3, DARK));
  const m = mops(ctx, engine, 330, 1);
  return { cast: ["mops", "baby"], mopsHead: m.head, mouth: m.mouth };
}

const word = (engine, text, x, y, size, color) => engine.text(text, x, y, size, color, "center", 900);

/** The pictures, in order (cutaway.js draws them as cutaway "moonpie"). Each returns what it drew (tests). */
const ALL = [
  {
    pic: "crate",
    draw: (ctx, t, engine) => storyPicture(ctx, () => crateScene(ctx), () => ({ caption: caption(ctx, engine, bedLine("cap-crate")) })),
  },
  {
    pic: "baby",
    draw: (ctx, t, engine) => {
      let d = null;
      return storyPicture(
        ctx,
        () => (d = babyScene(ctx, engine, t)),
        () => {
          word(engine, bedLine("mark-sleep"), d.zzz.x, d.zzz.y, 26, "#3478f6");
          word(engine, bedLine("mark-surprise"), d.surprise.x, d.surprise.y, 44, "#e5533d");
          return { caption: caption(ctx, engine, bedLine("cap-baby")) };
        },
      );
    },
  },
  {
    pic: "beard",
    draw: (ctx, t, engine) => storyPicture(ctx, () => beardScene(ctx, engine, t), () => ({ caption: caption(ctx, engine, bedLine("cap-beard")) })),
  },
  {
    pic: "weent",
    draw: (ctx, t, engine) => {
      let d = null;
      return storyPicture(
        ctx,
        () => (d = beardScene(ctx, engine, t)),
        () => ({ caption: null, bubble: bubble(ctx, engine, bedLine("mops-weent"), d.mouth.x - 8, d.mopsHead.y, 28, 300, "", "", 70) }),
      );
    },
  },
  {
    pic: "bucket",
    off: !BEDTIME_SWITCHES.bucketPicture,
    draw: (ctx, t, engine) => storyPicture(ctx, () => bucketScene(ctx, engine), () => ({ caption: caption(ctx, engine, bedLine("cap-bucket")) })),
  },
  {
    pic: "hide",
    off: !BEDTIME_SWITCHES.bucketPicture,
    draw: (ctx, t, engine) => {
      let d = null;
      return storyPicture(
        ctx,
        () => (d = bucketScene(ctx, engine)),
        () => ({ caption: null, bubble: bubble(ctx, engine, bedLine("mops-nothing"), d.mouth.x - 8, d.mopsHead.y, 28, 340, "", "", 70) }),
      );
    },
  },
].filter((p) => !p.off);

/** The names of the pictures that show, in order. */
export const BEDTIME_PICTURES = Object.freeze(ALL.map((p) => p.pic));

/** The pictures as the cutaway draws them: (ctx, t, engine) => what was drawn. */
export const BEDTIME_PANELS = Object.freeze(ALL.map((p) => (ctx, t, engine) => ({ pic: p.pic, sizes: sizes(), ...p.draw(ctx, t, engine) })));

/**
 * After Mops's bedtime line, one more picture (Brian, 2026-11-26): Squatch's crayon drawing of the Guardians, big, and
 * Mops beside it saying his Guardians line in a bubble over him (waits for NEXT). It is now, not years ago, so it has
 * no wash. Mops is the room's Mops exactly as the room draws him (no pose, face or look of his own here, no wink),
 * facing the drawing: nothing hints that he writes the notes (the player learns that at the vent, beat 48). The
 * cutaway "guardians".
 */
export const GUARDIANS_PICTURE = Object.freeze({ sheet: Object.freeze({ x: 330, y: 300, w: 500, tilt: -0.035 }), mops: Object.freeze({ x: 790, floor: 560 }) });
function guardiansPicture(ctx, t, engine) {
  const G = GUARDIANS_PICTURE;
  ctx.fillStyle = "#f4f1ea";
  ctx.fillRect(0, 0, 960, 640);
  ctx.fillStyle = "#ebe6da";
  ctx.fillRect(0, G.mops.floor - 40, 960, 640);
  // the sheet, held up to the wall with two strips of tape
  const sheet = drawGuardiansCrayon(ctx, G.sheet.x, G.sheet.y, G.sheet.w, { tilt: G.sheet.tilt });
  for (const tx of [-0.36, 0.36]) {
    ctx.save();
    ctx.translate(G.sheet.x + tx * G.sheet.w, sheet.y0 + 6);
    ctx.rotate(tx * 0.5);
    ctx.fillStyle = "rgba(240,226,170,.85)";
    ctx.fillRect(-34, -12, 68, 24);
    ctx.restore();
  }
  const f = -1,
    x = G.mops.x,
    floor = G.mops.floor;
  ctx.beginPath();
  ctx.ellipse(x, floor + 2, 90, 8, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(30,36,48,.15)";
  ctx.fill();
  const o = { f, walk: 0, mop: false };
  if (engine && engine.drawMopsOn) engine.drawMopsOn(ctx, x, floor, MOPS_SCALE, o);
  else if (engine && engine.drawMops) engine.drawMops(x, floor, MOPS_SCALE, o);
  const head = { x: x + 17 * MOPS_SCALE * f, y: floor - BED_STORY.tall * MOPS_SCALE },
    mouth = { x: x + 22 * MOPS_SCALE * f, y: floor - 24 * MOPS_SCALE };
  const b = bubble(ctx, engine, bedLine("mops-guardians"), mouth.x + 30, head.y, 28, 330, "", "", 24);
  return { pic: "guardians", cast: ["mops"], drawing: sheet, bubble: b, mopsHead: head, caption: null, mopsLook: Object.keys(o).sort().join(",") };
}
/** The Guardians picture as the cutaway draws it (cutaway "guardians"). */
export const GUARDIANS_PANELS = Object.freeze([(ctx, t, engine) => guardiansPicture(ctx, t, engine)]);

/**
 * The thought bubble over Squatch's head in the room, with a little Moon Pie crate in it and no words. `head` is
 * the top of his head (canvas). Returns its box. `a` fades it in (0 to 1). `inside(ctx, cx, cy)` draws something else
 * in it instead of the crate (the home morning's Guardian Box and crayon drawing, home-morning-art.js); `size` ({ w, h })
 * makes the cloud bigger than its usual 172 x 118.
 */
export function drawThought(ctx, head, a = 1, inside = null, size = null) {
  const w = (size && size.w) || 172,
    h = (size && size.h) || 118,
    // A head given as its drawn box ({ x, y, w, h }) follows the one placement rule (thought-place.js: above it with a
    // clear gap, never over the face; Brian 2026-11-26); a head given as a point keeps this picture's own place.
    placed = head.w != null ? placeThought(head, { w, h }) : null,
    cx = placed ? placed.cx : Math.min(940 - w / 2, Math.max(20 + w / 2, head.x + 70)),
    cy = placed ? placed.cy : Math.max(20 + h / 2, head.y - 34 - h / 2),
    tail = placed ? placed.to : { x: head.x, y: head.y - 4 };
  ctx.save();
  ctx.globalAlpha = a;
  // the cloud: puffs round an oval, then two small puffs down to his head
  ctx.beginPath();
  const n = 9;
  for (let i = 0; i <= n; i++) {
    const q = (i / n) * Math.PI * 2,
      px = cx + Math.cos(q) * (w / 2 - 10),
      py = cy + Math.sin(q) * (h / 2 - 10);
    if (i === 0) ctx.moveTo(px, py);
    else {
      const m = ((i - 0.5) / n) * Math.PI * 2;
      ctx.quadraticCurveTo(cx + Math.cos(m) * (w / 2 + 6), cy + Math.sin(m) * (h / 2 + 6), px, py);
    }
  }
  ctx.closePath();
  paint(ctx, "#ffffff", 3.5, INK);
  const bx = placed && placed.beside ? (tail.x > cx ? cx + w * 0.4 : cx - w * 0.4) : placed ? cx : cx - w * 0.28,
    by = placed && placed.beside ? cy + h * 0.2 : cy + h / 2 + 6;
  for (const [k, r] of [
    [0.35, 9],
    [0.75, 6],
  ]) {
    ctx.beginPath();
    ctx.ellipse(bx + (tail.x - bx) * k, by + (tail.y - by) * k, r * 1.3, r, 0, 0, Math.PI * 2);
    paint(ctx, "#ffffff", 3, INK);
  }
  // the little Moon Pie crate (his bed, before it was a bed), with no words
  const u = 0.4;
  inside ? inside(ctx, cx, cy) : drawCrate(ctx, cx, cy + ((CRATE.body + CRATE.legs) * u) / 2, u, { words: false });
  ctx.restore();
  return { x0: cx - w / 2 - 6, y0: cy - h / 2 - 6, x1: cx + w / 2 + 6, y1: cy + h / 2 + 6 };
}

/** The room's crate and Mops (k = 1) for tests: the story keeps their proportion. */
export const ROOM_SIZES = Object.freeze(sizesAt(1));
