/**
 * The night look, one rule for every room (Brian, 2026-11-26: "Make sure it's not just the hall dark at night, but all
 * rooms are different at night versus daytime."): whenever the story is at night, the room shown has its night look.
 *   - A room with a locked night picture shows it (the loading bay: delivery-room-empty-night-v2.png).
 *   - Every other room (home, the party hall, the hallway, the office, any new room) shows its day picture under a dim
 *     blue night tint (the bedtime story's night colour, bedtime-story.js BEDTIME_NIGHT), with the things that give
 *     light kept bright (the hall's window onto space and its FUR alarm lamp, the office's screen).
 *   - Characters are drawn after the tint, so they stay lit and readable.
 * Day is the normal picture. A beat at night calls nightPictureFor(room) for its picture, then drawNightTint over the
 * room before it draws the people (or, where the older program has already drawn them, draws the tint and then the
 * people again over it). PLACEHOLDER look (the tint's strength and the lit boxes) for Brian.
 */
export const NIGHT_TINT = Object.freeze({ color: "rgb(14,22,58)", alpha: 0.58 });
/** Rooms with a locked night picture of their own (game room names). */
export const NIGHT_PICTURES = Object.freeze({ hangar: "docs/locked-rooms/delivery-room-empty-night-v2.png" });
/**
 * What keeps its light at night, per room, in game positions on the room's locked picture: drawn again over the tint
 * from the picture itself (nothing is redrawn by hand).
 */
export const LIT_BY_NIGHT = Object.freeze({
  // the party hall v2: the big window onto space (picture 47 to 828 wide, 95 to 298 high) and the red FUR alarm
  hall: Object.freeze([Object.freeze({ x0: 36, y0: 74, x1: 620, y1: 229 }), Object.freeze({ x0: 876, y0: 145, x1: 911, y1: 185 })]),
  // the office v2: the computer's screen (PLACEHOLDER box, read off the picture by eye)
  office: Object.freeze([Object.freeze({ x0: 640, y0: 330, x1: 760, y1: 420 })]),
  closet: Object.freeze([]),
  passage: Object.freeze([]),
  hangar: Object.freeze([]),
});
/** The room's own night picture (a path), or null when it has none and takes the tint. */
export function nightPictureFor(room) {
  return NIGHT_PICTURES[room] || null;
}
// Tests: the night look drawn since the last call, by room ({ room: { tint, lit } }).
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
/**
 * The tint over a room drawn from its day picture (game positions, 960 x 640), `k` (0 to 1) how far night has come
 * (1 at night); `picture` is the room's locked picture (an Image), whose lit parts are drawn again over the tint.
 */
export function drawNightTint(ctx, room, picture, k = 1) {
  if (!(k > 0)) return null;
  ctx.save();
  ctx.globalAlpha = Math.min(1, k) * NIGHT_TINT.alpha;
  ctx.fillStyle = NIGHT_TINT.color;
  ctx.fillRect(-2000, -2000, 6000, 5000);
  ctx.restore();
  const lit = [];
  if (picture && picture.complete && picture.naturalWidth)
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
