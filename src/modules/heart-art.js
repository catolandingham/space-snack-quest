/**
 * Mops's heart: the one heart drawing the whole game uses (final art, Brian's yes 2026-11-27; round 8, placeholder 18).
 * Every heart that floats up over Mops (the first sight in a scene, the three story hearts, the pats and hugs at the
 * party) is this shape, so it reads as the same feeling everywhere: a round, full heart in warm pink, the game's dark
 * outline, and a small white shine on its upper left lobe, like the shine on the locked rooms' plastic and glass.
 * How many hearts, and when, is mops-hearts.js; this file only draws one.
 */
const HEART_INK = "#1e2430",
  HEART_FILL = "#ff5a8c",
  HEART_SHADE = "#e23c70";

/** The heart's outline, its middle at (0, 0), `w` wide (about as tall). */
function heartPath(ctx, w) {
  const r = w * 0.27; // each lobe's radius
  ctx.beginPath();
  ctx.moveTo(0, w * 0.48);
  ctx.bezierCurveTo(-w * 0.2, w * 0.3, -w * 0.5, w * 0.12, -w * 0.5, -w * 0.12);
  ctx.arc(-r * 0.86, -w * 0.12, r, Math.PI, Math.PI * 2.02);
  ctx.arc(r * 0.86, -w * 0.12, r, Math.PI * 0.98, Math.PI * 2);
  ctx.bezierCurveTo(w * 0.5, w * 0.12, w * 0.2, w * 0.3, 0, w * 0.48);
  ctx.closePath();
}

/**
 * One heart, its middle at (x, y), `w` wide. `alpha` fades it (0 to 1). `tilt` turns it a little (radians), so a row
 * of rising hearts does not look stamped.
 */
export function drawMopsHeart(ctx, x, y, w, alpha = 1, tilt = 0) {
  if (!(w > 0) || alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha *= Math.min(1, alpha);
  ctx.translate(x, y);
  tilt && ctx.rotate(tilt);
  heartPath(ctx, w);
  ctx.fillStyle = HEART_FILL;
  ctx.fill();
  // a darker crescent along the bottom right, the flat shading the locked rooms use
  ctx.save();
  ctx.clip();
  ctx.beginPath();
  ctx.ellipse(w * 0.16, w * 0.24, w * 0.46, w * 0.34, -0.5, 0, Math.PI * 2);
  ctx.fillStyle = HEART_SHADE;
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(-w * 0.04, w * 0.02, w * 0.42, w * 0.34, -0.5, 0, Math.PI * 2);
  ctx.fillStyle = HEART_FILL;
  ctx.fill();
  ctx.restore();
  heartPath(ctx, w);
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(1.2, w * 0.1);
  ctx.strokeStyle = HEART_INK;
  ctx.stroke();
  // the shine
  ctx.beginPath();
  ctx.ellipse(-w * 0.22, -w * 0.2, w * 0.09, w * 0.055, -0.7, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,.9)";
  ctx.fill();
  ctx.restore();
}
