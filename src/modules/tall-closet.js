/**
 * The taller closet on Day 2 (Brian, 2026-11-26, video note 0:20: "We should make the closet taller... the box is
 * taking up way too much space... and the clothes should be over the box"; his note is his yes to the change, recorded
 * in docs/DECISIONS.md). A drawn layer over the locked home picture (docs/locked-rooms/README.md: the picture files
 * are not changed): the wardrobe is made TALL_CLOSET.grow game pixels taller, upward, with pieces of the locked
 * picture itself, so its look is the approved one:
 *   closed  its top edge is drawn higher and the plain doors run up to it (a plain row of the doors, below the
 *           calendar, stretched); the calendar on the door stays where it is
 *   open    the rail, the hangers and the clothes move up with the top; below them the closet's back wall runs down
 *           to its floor (a plain row of the inside, stretched), so the Guardian Box sits on the closet floor under
 *           the clothes, with room to spare
 * Drawn on Day 2 at home (home-morning.js drawOnRoom, before the box). Day 1's closet (home alone, the dress-up at the
 * party) is unchanged: a question for Brian whether it should be taller there too.
 * Rows and columns are picture pixels of the locked pictures (1280 x 830); everything is drawn at game positions.
 */
const PIC_W = 1280,
  PIC_H = 830,
  GX = 960 / PIC_W,
  GY = 640 / PIC_H;

import { nightPicture } from "./night-look.js";

export const TALL_CLOSET = Object.freeze({
  // how much taller, in picture pixels (110 is about 85 game pixels; the wall above it is clear to about row 75)
  growPic: 110,
  // the wardrobe's columns (open: with its open door on the right) and rows
  x0: 47,
  x1: 222,
  x1Open: 242,
  top: 250, // above its top edge
  topEdge: 259, // the closed doors start under this row (the calendar starts at about 260)
  clothesEnd: 382, // open: the rail, hangers and clothes are all above this row
  plainRow: 400, // a row of plain doors (closed) and of the plain inside (open), stretched to fill
  pictures: Object.freeze({ closed: "docs/locked-rooms/home-room-empty-closed-v6.png", open: "docs/locked-rooms/home-room-empty-open-v6.png" }),
});
/** How many game pixels taller the closet is. */
export const TALL_GROW = TALL_CLOSET.growPic * GY;
/** The taller wardrobe's box on the game picture (the closed one; open, its door reaches TALL_BOX_OPEN.x1). */
export const TALL_BOX = Object.freeze({ x0: TALL_CLOSET.x0 * GX, x1: TALL_CLOSET.x1 * GX, y0: (TALL_CLOSET.top - TALL_CLOSET.growPic) * GY, y1: 446 * GY });
export const TALL_BOX_OPEN = Object.freeze({ ...TALL_BOX, x1: TALL_CLOSET.x1Open * GX });

// Both pictures load as the game loads (as the bedtime story's crate front does), so the closet is tall from Day 2's
// first frame and does not pop up when the door opens (code review).
const tcImgs = typeof Image === "undefined" ? {} : { closed: Object.assign(new Image(), { src: TALL_CLOSET.pictures.closed }), open: Object.assign(new Image(), { src: TALL_CLOSET.pictures.open }) };
function tcImg(which) {
  const im = tcImgs[which];
  if (!im) return null;
  return im.complete && im.naturalWidth ? im : null;
}
// Copies picture rows [r0, r1) of columns [x0, x1) to game position (x0, to) and stretches them to `rows` picture rows.
function tcCopy(ctx, img, x0, x1, r0, r1, to, rows = r1 - r0) {
  const kx = img.naturalWidth / PIC_W,
    ky = img.naturalHeight / PIC_H;
  ctx.drawImage(img, x0 * kx, r0 * ky, (x1 - x0) * kx, (r1 - r0) * ky, x0 * GX, to * GY, (x1 - x0) * GX, rows * GY);
}

/**
 * Draws the taller closet over the home picture, `open` or closed; `night`: cut from the room's night look
 * (night-look.js). Returns its box, or null while not ready.
 */
export function drawTallCloset(ctx, open, night = false) {
  const T = TALL_CLOSET,
    day = tcImg(open ? "open" : "closed");
  if (!day) return null;
  const img = nightPicture(open ? "home-open" : "home-closed", day, night);
  const g = T.growPic,
    x1 = open ? T.x1Open : T.x1;
  if (open) {
    // the top, the rail, the hangers and the clothes, all moved up
    tcCopy(ctx, img, T.x0, x1, T.top, T.clothesEnd, T.top - g);
    // the plain inside, stretched from under the clothes down to where the picture's own plain inside starts
    tcCopy(ctx, img, T.x0, x1, T.plainRow, T.plainRow + 1, T.clothesEnd - g, g + 1);
  } else {
    // the top edge, moved up, and the plain doors stretched down from it to the picture's own doors
    tcCopy(ctx, img, T.x0, x1, T.top, T.topEdge, T.top - g);
    tcCopy(ctx, img, T.x0, x1, T.plainRow, T.plainRow + 1, T.topEdge - g, g);
  }
  return { open: !!open, ...(open ? TALL_BOX_OPEN : TALL_BOX) };
}
const tcSources = {};
/**
 * A canvas the size of the game picture: the locked home picture with the taller closet on it (closed or open), for
 * tracing the goal outline round the closet as it is drawn (goal-targets.js).
 */
export function tallClosetSource(open = false) {
  const which = open ? "open" : "closed";
  if (tcSources[which]) return tcSources[which];
  const img = tcImg(which);
  if (!img || typeof document === "undefined") return null;
  const c = document.createElement("canvas");
  c.width = 960;
  c.height = 640;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, 960, 640);
  drawTallCloset(ctx, open);
  return (tcSources[which] = c);
}
