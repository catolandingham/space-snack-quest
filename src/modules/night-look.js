/**
 * Every room looks different at night (Brian, 2026-11-26: "Make sure it's not just the hall dark at night, but all rooms
 * are different at night versus daytime."). A room with a locked night picture (the loading bay) uses that picture; any
 * other room at night gets this: a dim blue tint over the whole picture, with the things that give light kept bright
 * (a window, a screen, a lamp: `lit`, boxes in game positions; `round: true` for an ellipse). PLACEHOLDER strength.
 */
export const NIGHT = Object.freeze({ tint: "rgba(18,28,70,.36)" });
/** Draws the night tint over the picture as it is now, leaving each `lit` box as it is. */
export function drawNightTint(ctx, lit = []) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, 960, 640);
  for (const b of lit) {
    if (b.round) {
      ctx.moveTo(b.x1, (b.y0 + b.y1) / 2);
      ctx.ellipse((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, (b.x1 - b.x0) / 2, (b.y1 - b.y0) / 2, 0, 0, Math.PI * 2);
    } else ctx.rect(b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0);
  }
  ctx.fillStyle = NIGHT.tint;
  ctx.fill("evenodd");
  ctx.restore();
  return { lit: lit.length };
}
