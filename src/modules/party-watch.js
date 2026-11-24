/**
 * Who watches Squatch at the party, and which way each one looks (Brian, 2026-11-23, on sight cones for
 * everyone: "let's try all of them and then we can adjust").
 *
 * Everyone faces the stage, except Isfred, who stands on it facing the guests, and the bartender, who faces
 * the room from behind the bar. After the snack spill everyone turns to look at Squatch.
 *
 * This file says where each cone starts, which way it points, and how strongly it shows (the distance fade
 * below), and draws the cones whole (drawCones, at the end): the party night draws with it, and the sight check uses the same shape, so the shaded area is exactly where Squatch is seen.
 */

// The middle of the stage, in game positions (hall-room-empty-v2 and the party drawing).
export const PARTY_STAGE = { x: 448, y: 280 };
// A cone starts this far above a person's feet, as every standing cone in the game does.
export const EYE_ABOVE_FEET = 28;
// How long a guest watches Squatch before "?" turns into "!" (Brian, 2026-11-22: "it stats with a question mark
// and only turns into exclamation after he stays too long"). PROVISIONAL: Brian has not set this number
// yet (docs/DECISIONS.md, Sight cones); it is not a tuning pin until he does.
export const SEEN_TOO_LONG_SECONDS = 0.8;
// The point on Squatch that is seen: this far above his feet.
export const SQUATCH_SEEN_ABOVE_FEET = 20;
// Distance fade (Brian, 2026-11-23: "Add the distance fade"): a cone shows only when Squatch is near the cone
// itself, so only the cones he could walk into are on screen. Distances run from the point on Squatch that is
// seen to the nearest point of the cone (0 inside it). Fully shown within `full`, so a cone that sees him is
// always fully drawn (rule 8); gone beyond `gone`; fading in between. The fade ignores walls; the drawn cone is
// still cut short at them. Measured from the watcher instead, nearly every cone showed from the middle of the
// hall, which is small next to a 210-long cone. Both numbers are placeholders for Brian to tune.
export const CONE_FADE = { full: 40, gone: 120 };

/** How strongly a cone shows (0 to 1) with Squatch this far from the cone. */
export function coneShow(d) {
  if (d <= CONE_FADE.full) return 1;
  if (d >= CONE_FADE.gone) return 0;
  return (CONE_FADE.gone - d) / (CONE_FADE.gone - CONE_FADE.full);
}

/** Distance from point (px, py) to the cone from (ox, oy) facing `a`, `half` wide each side, `len` long. */
export function distToCone(px, py, ox, oy, a, half, len) {
  const dx = px - ox,
    dy = py - oy;
  let t = Math.atan2(dy, dx) - a;
  while (t > Math.PI) t -= 2 * Math.PI;
  while (t < -Math.PI) t += 2 * Math.PI;
  if (Math.abs(t) <= half) return Math.max(0, Math.hypot(dx, dy) - len);
  const toEdge = (ang) => {
    const ux = Math.cos(ang),
      uy = Math.sin(ang),
      s = Math.max(0, Math.min(len, dx * ux + dy * uy));
    return Math.hypot(dx - ux * s, dy - uy * s);
  };
  return Math.min(toEdge(a - half), toEdge(a + half));
}

// ---------- the party night's cones (party plan "Rules that hold in every scene", Sight) ----------
// Only a plant he is hiding in blocks sight; furniture never chops a cone. The room's walls still end cones:
// cones are drawn clipped to the room inside its walls, and Squatch is always inside it, so the drawn cone is
// exactly where he is seen (tests/party-scenes.mjs).
export const ROOM_INSIDE = Object.freeze({ x0: 34, y0: 200, x1: 926, y1: 613 });

/** A cone from a person standing at feet (x, y), looking at angle `a`. */
export function coneFrom(id, x, y, a, size) {
  return { id, x, y, ox: x, oy: y - EYE_ABOVE_FEET, a, half: size.half, len: size.len };
}
/** The angle from a person at feet (x, y) to a point. */
export function lookAt(x, y, to) {
  return Math.atan2(to.y - (y - EYE_ABOVE_FEET), to.x - x);
}
/** The angle a stage-facing guest looks (the middle of the stage). */
export function towardStage(x, y) {
  return lookAt(x, y, PARTY_STAGE);
}
/** True when the cone sees Squatch standing at feet `sq` (not hidden). */
export function coneSees(c, sq) {
  return distToCone(sq.x, sq.y - SQUATCH_SEEN_ABOVE_FEET, c.ox, c.oy, c.a, c.half, c.len) <= 0;
}

/**
 * Draws the cones whole (walls end them). Each is dashed while Squatch is outside it and yellow while he is in it.
 * `all` draws every cone fully (the peek, which teaches cones); otherwise a cone shows only as Squatch comes near
 * it (the approved distance fade, coneShow). Returns the cones as drawn, each with its `show` and `inside`.
 */
export function drawCones(ctx, cones, sq, hidden, all, note) {
  const out = [];
  ctx.save();
  ctx.beginPath();
  ctx.rect(ROOM_INSIDE.x0, ROOM_INSIDE.y0, ROOM_INSIDE.x1 - ROOM_INSIDE.x0, ROOM_INSIDE.y1 - ROOM_INSIDE.y0);
  ctx.clip();
  for (const c of cones) {
    const edge = distToCone(sq.x, sq.y - SQUATCH_SEEN_ABOVE_FEET, c.ox, c.oy, c.a, c.half, c.len),
      inside = !hidden && edge <= 0,
      show = all || c.always ? 1 : coneShow(edge);
    out.push({ ...c, edge, inside, show });
    if (!(show > 0)) continue;
    // Only a cone on screen is told to the tests (what a kid can see).
    note && note({ ox: c.ox, oy: c.oy, a: c.a, half: c.half, len: c.len });
    ctx.save();
    ctx.globalAlpha = show;
    ctx.beginPath();
    ctx.moveTo(c.ox, c.oy);
    ctx.arc(c.ox, c.oy, c.len, c.a - c.half, c.a + c.half);
    ctx.closePath();
    if (inside || c.hot) {
      ctx.fillStyle = "rgba(255,234,120,.55)";
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(160,100,10,.95)";
      ctx.stroke();
    } else {
      ctx.setLineDash([8, 7]);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(90,96,110,.6)";
      ctx.fillStyle = "rgba(255,255,255,.08)";
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }
  ctx.restore();
  return out;
}
