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
// A cone starts this far above a person's feet, as every standing cone in the game does. This is where the sight
// test measures from, in every room.
export const EYE_ABOVE_FEET = 28;
/**
 * A cone can be DRAWN somewhere other than where sight is measured from: `draw` = { dx, dy } moves the drawing only
 * (Brian 2026-11-24, on the guard in Squatch's room, drawn almost three times hall size: "it comes from his feet";
 * his cone is now his flashlight's beam, drawn from the flashlight in his hand: party-guard-look.js). The sight test
 * is not changed by this: the cone and the point on Squatch that is tested move by the same amount (seenPointDrawn),
 * so who is seen, and from where, is exactly as before. What changes is what the kid reads off the picture: the
 * beam is drawn higher than the patch of floor sight is measured on, so it finds him when it lands on his head (at
 * home he is drawn three times hall size), not on his feet. Brian is told this in the PR.
 */
export function seenPointDrawn(sq, draw) {
  return { x: sq.x + ((draw && draw.dx) || 0), y: sq.y - SQUATCH_SEEN_ABOVE_FEET + ((draw && draw.dy) || 0) };
}
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

/**
 * A cone from a person standing at feet (x, y), looking at angle `a`. (ox, oy) is where sight is measured from.
 * `draw` ({ dx, dy }, optional) only moves where the cone is drawn (see seenPointDrawn).
 */
export function coneFrom(id, x, y, a, size, draw = null) {
  return { id, x, y, ox: x, oy: y - EYE_ABOVE_FEET, a, half: size.half, len: size.len, ...(draw ? { draw } : {}) };
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
 * `fooled` (he is in a whole disguise, nobody knows him): a cone that holds him stays a dashed outline, and only
 * the "?" over that guest shows; yellow comes back the moment fur shows (Brian 2026-11-24, "No yellow in disguise",
 * which replaces his 2026-11-22 "Yellow, then suspicion"). A guard who sees him (`hot`) is always yellow.
 * `all` draws every cone fully (the peek, which teaches cones); otherwise a cone shows only as Squatch comes near
 * it (the approved distance fade, coneShow). Returns the cones as drawn, each with its `show` and `inside`.
 */
export function drawCones(ctx, cones, sq, hidden, all, note, fooled = false) {
  const out = [];
  ctx.save();
  ctx.beginPath();
  ctx.rect(ROOM_INSIDE.x0, ROOM_INSIDE.y0, ROOM_INSIDE.x1 - ROOM_INSIDE.x0, ROOM_INSIDE.y1 - ROOM_INSIDE.y0);
  ctx.clip();
  for (const c of cones) {
    // (for a cone drawn elsewhere, `draw`, the point of him it is drawn to see moves with it: the same test)
    const dx = c.ox + ((c.draw && c.draw.dx) || 0),
      dy = c.oy + ((c.draw && c.draw.dy) || 0),
      pt = seenPointDrawn(sq, c.draw),
      edge = distToCone(pt.x, pt.y, dx, dy, c.a, c.half, c.len),
      inside = !hidden && edge <= 0,
      show = all || c.always ? 1 : coneShow(edge);
    out.push({ ...c, edge, inside, show });
    if (!(show > 0)) continue;
    // Only a cone on screen is told to the tests (what a kid can see): the numbers it is drawn from.
    note && note({ ox: dx, oy: dy, a: c.a, half: c.half, len: c.len, ...(c.draw ? { draw: c.draw } : {}) });
    ctx.save();
    ctx.globalAlpha = show;
    ctx.beginPath();
    ctx.moveTo(dx, dy);
    ctx.arc(dx, dy, c.len, c.a - c.half, c.a + c.half);
    ctx.closePath();
    if (c.beam && !((inside && !fooled) || c.hot)) {
      // a flashlight's beam: soft light, always showing where he is looking, whether or not it has found anyone
      const g = ctx.createRadialGradient(dx, dy, 4, dx, dy, c.len);
      g.addColorStop(0, "rgba(255,248,200,.6)");
      g.addColorStop(1, "rgba(255,248,200,.14)");
      ctx.fillStyle = g;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(190,160,60,.5)";
      ctx.stroke();
    } else if ((inside && !fooled) || c.hot) {
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
