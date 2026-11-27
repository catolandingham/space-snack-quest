/**
 * The night look, one rule for every room (Brian, 2026-11-26: "Make sure it's not just the hall dark at night, but all
 * rooms are different at night versus daytime."): whenever the story is at night, the room shown has its night look.
 *   - A room with a locked night picture shows it (the loading bay: delivery-room-empty-night-v2.png).
 *   - Every other room (home, the party hall, the hallway, the office) shows its day picture under a dim blue night
 *     tint (the bedtime story's night colour, BEDTIME_NIGHT on feat/ch1-bedtime-story), with the things that give light kept bright: drawn again over the tint,
 *     cut from the same locked picture (the hall's window onto space and its FUR alarm lamp, home's TV screen, the office's screens and
 *     keypad, the hallway's keypad). The picture files never change.
 *   - Characters are drawn after the room, so they stay lit and readable. The bedtime story's lights-out dim
 *     (bedtime-story.js BEDTIME_NIGHT) goes on top of this, over everything.
 * When it is night (isNightNow): from the party night's start ("That evening...", the party beat's state ch1PartyNow
 * is set) until Day 2 begins (ch1Day2), so the party P1 to P8, Mops's homecoming, the TV story and bedtime; and
 * whenever the older program marks a night scene (ch1Night: the night mail run, the escape).
 * One shared module (feat/ch1-evening has its own copy with NIGHT_TINT, LIT_BY_NIGHT, nightPictureFor, drawNightTint,
 * nightDrawn and noteNightPicture, which this one keeps with the same meaning; the two are meant to become one file). PLACEHOLDER look (the tint's strength and the lit boxes) for Brian.
 */
import { withCrateStamp } from "./crate-stamp.js";

export const NIGHT_TINT = Object.freeze({ color: "rgb(14,22,58)", alpha: 0.5 });
/** Rooms with a locked night picture of their own (game room names). */
export const NIGHT_PICTURES = Object.freeze({ hangar: "docs/locked-rooms/delivery-room-empty-night-v2.png" });
/** The older program's locked picture ids (12-ch1-redesign.js LOCKED_ROOMS) and the game room each one is. */
export const ROOM_OF_PICTURE = Object.freeze({
  hall: "hall",
  hallway: "passage",
  office: "office",
  "home-closed": "closet",
  "home-open": "closet",
  "delivery-day": "hangar",
  "delivery-noship": "hangar",
  "delivery-pickup": "hangar",
  "delivery-night": "hangar",
});
// Pictures that already are night (shown as they are).
const NIGHT_ALREADY = new Set(["delivery-night"]);
/**
 * What keeps its light at night, per room, in game positions on the room's locked picture (picture pixels times 0.75
 * across and 640 / 830 down): drawn again over the tint from the picture itself (nothing is redrawn by hand).
 */
export const LIT_BY_NIGHT = Object.freeze({
  // the party hall v2: the big window onto space (picture 47 to 828 wide, 93 to 298 high) and the red FUR alarm
  hall: Object.freeze([Object.freeze({ x0: 35, y0: 72, x1: 621, y1: 230 }), Object.freeze({ x0: 878, y0: 148, x1: 908, y1: 182 })]),
  // the office v2: the four security screens, the computer's screen, the keypad by the door
  office: Object.freeze([Object.freeze({ x0: 60, y0: 83, x1: 254, y1: 231 }), Object.freeze({ x0: 664, y0: 303, x1: 806, y1: 413 }), Object.freeze({ x0: 542, y0: 211, x1: 570, y1: 247 })]),
  // the hallway v6: the keypad by the office door
  passage: Object.freeze([Object.freeze({ x0: 542, y0: 567, x1: 570, y1: 603 })]),
  // home v6: no window or lamp; the TV's screen (picture 762 to 904 wide, 182 to 277 high; party-talk.js TV.screen)
  closet: Object.freeze([Object.freeze({ x0: 572, y0: 141, x1: 678, y1: 213 })]),
  hangar: Object.freeze([]),
});

/**
 * True while the story is at night. `get(field)` reads the game state (the bridge's engine().get).
 */
export function isNightNow(get) {
  if (typeof get !== "function") return false;
  if (get("ch1Night")) return true;
  return !!get("ch1PartyNow") && !get("ch1Day2");
}

/** The room's own night picture (a path), or null when it has none and takes the tint. */
export function nightPictureFor(room) {
  return NIGHT_PICTURES[room] || null;
}

// Tests: the night look drawn since the last call, by room ({ room: { tint, lit } } or { picture: true }).
let drawn = {};
/** Tests: which rooms have drawn their night look since the last call (and forgets it). */
export function nightDrawn() {
  const d = drawn;
  drawn = {};
  return d;
}
/** Tells the tests a room showed its locked night picture (the bay). */
export function noteNightPicture(room) {
  drawn[room] = { picture: true };
}

const nightReady = (img) => !!img && !!img.complete && !!img.naturalWidth;
// The rooms' night pictures (loaded once, when first asked for), and the tinted pictures made from day ones.
const nightImgs = {};
const tinted = new Map();
function loadNight(room) {
  const src = nightPictureFor(room);
  if (!src || typeof Image === "undefined") return null;
  return nightImgs[room] || (nightImgs[room] = Object.assign(new Image(), { src }));
}
// (loaded at the start, so the first night frame has them)
for (const room of Object.keys(NIGHT_PICTURES)) loadNight(room);
/**
 * The day picture `img` (an Image) with the night tint over it and its lit parts cut from it again on top, made once
 * at the picture's own size: a canvas that draws like the Image (it carries complete, naturalWidth, naturalHeight and
 * src), so anything that draws the room picture, or cuts a piece of it to draw over someone, draws the night one.
 */
function tintedPicture(room, img) {
  const key = room + "|" + img.src;
  if (tinted.has(key)) return tinted.get(key);
  if (typeof document === "undefined") return null;
  const w = img.naturalWidth,
    h = img.naturalHeight,
    cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const c = cv.getContext("2d");
  if (!c) return null;
  c.drawImage(img, 0, 0);
  c.globalAlpha = NIGHT_TINT.alpha;
  c.fillStyle = NIGHT_TINT.color;
  c.fillRect(0, 0, w, h);
  c.globalAlpha = 1;
  const kx = w / 960,
    ky = h / 640;
  for (const b of LIT_BY_NIGHT[room] || []) {
    const sx = Math.round(b.x0 * kx),
      sy = Math.round(b.y0 * ky),
      sw = Math.round((b.x1 - b.x0) * kx),
      sh = Math.round((b.y1 - b.y0) * ky);
    c.drawImage(img, sx, sy, sw, sh, sx, sy, sw, sh);
  }
  Object.assign(cv, { complete: true, naturalWidth: w, naturalHeight: h, src: img.src + "#night", nightLook: true });
  tinted.set(key, cv);
  return cv;
}

/**
 * The picture to draw for a room: at night (`night`), the room's locked night picture if it has one, else the tinted
 * day picture; by day, `img` itself. `id` is a game room name or the older program's locked picture id
 * (ROOM_OF_PICTURE). Falls back to `img` while a picture is still loading. The home pictures come with the crate
 * bed's new stamp layered over them, by day and by night (crate-stamp.js withCrateStamp; the files never change).
 */
export function nightPicture(id, img, night = true) {
  if (!nightReady(img)) return img;
  img = withCrateStamp(id, img);
  if (!night) return img;
  const room = ROOM_OF_PICTURE[id] || id;
  if (NIGHT_ALREADY.has(id)) return noteNightPicture(room), img;
  const own = loadNight(room);
  // (its night picture; while it loads, the day one; if it cannot load, the tint below)
  if (own && !(own.complete && !own.naturalWidth)) return nightReady(own) ? (noteNightPicture(room), own) : img;
  const cv = tintedPicture(room, img);
  if (!cv) return img;
  drawn[room] = { tint: NIGHT_TINT.alpha, lit: (LIT_BY_NIGHT[room] || []).length };
  return cv;
}

/**
 * The tint over a room already drawn from its day picture (game positions, 960 x 640), `k` (0 to 1) how far night has
 * come; `picture` is the room's locked picture (an Image), whose lit parts are drawn again over the tint. For a beat
 * that has drawn its room already; otherwise draw nightPicture(...) in place of the picture.
 */
export function drawNightTint(ctx, room, picture, k = 1) {
  if (!(k > 0)) return null;
  ctx.save();
  ctx.globalAlpha = Math.min(1, k) * NIGHT_TINT.alpha;
  ctx.fillStyle = NIGHT_TINT.color;
  ctx.fillRect(-2000, -2000, 6000, 5000);
  ctx.restore();
  const lit = [];
  if (nightReady(picture))
    for (const b of LIT_BY_NIGHT[room] || []) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0);
      ctx.clip();
      ctx.globalAlpha = Math.min(1, k);
      ctx.drawImage(picture, 0, 0, 960, 640);
      ctx.restore();
      lit.push(b);
    }
  drawn[room] = { tint: +(Math.min(1, k) * NIGHT_TINT.alpha).toFixed(2), lit: lit.length };
  return drawn[room];
}
