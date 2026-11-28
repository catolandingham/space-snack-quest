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
import { adultPxFor, doorAdultPx, HALL_BIGGER } from "./room-sizes.js";

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
// At home (the guard's flashlight beam, Brian's approved home rule) the point on Squatch that is seen: this far above
// his feet. In the hall sight sees his whole outline (SQUATCH_OUTLINE below).
export const SQUATCH_SEEN_ABOVE_FEET = 20;
// Distance fade (Brian, 2026-11-23: "Add the distance fade"): a cone shows only when Squatch is near the cone
// itself, so only the cones he could walk into are on screen. Distances run from the point on Squatch that is
// seen to the nearest point of the cone (0 inside it). Fully shown within `full`, so a cone that sees him is
// always fully drawn (rule 8); gone beyond `gone`; fading in between. The fade ignores walls; the drawn cone is
// still cut short at them. Measured from the watcher instead, nearly every cone showed from the middle of the
// hall, which is small next to a 210-long cone. Both numbers are placeholders for Brian to tune.
export const CONE_FADE = { full: 40, gone: 120 };
// A dashed cone this close to him (or closer) is drawn darker and thicker, the closer the more (drawCones). PLACEHOLDER.
export const CONE_NEAR = 60;

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
/**
 * Squatch's outline as he is drawn standing in the party hall, in game pixels from his feet (x right, y down),
 * measured from his drawing at hall size (2026-11-26: the widest he is drawn on each row, standing or at any step of
 * his walk, either way he faces, plus a pixel; tests/party-showing6.mjs checks it against the drawing). Because it
 * holds his widest step, a cone up to about 4 pixels off his standing drawing (1.5 on a phone) still sees him. Sight in the hall is tested against this whole
 * outline (Brian 2026-11-26, showing 6: "It looks like he's right in the octopus' cone, what am I missing??"): a cone
 * drawn on any part of him sees him, and a cone that sees him is drawn on him. Before, sight was tested at one point
 * 20 above his feet, a quarter of the way up him, so a cone across his head or chest was drawn on him and did not
 * see him.
 */
const HALF_OUTLINE = [
  [0, -80], [10, -78], [12, -76], [19, -74], [20, -72], [21, -70], [23, -68], [25, -66], [26, -64], [26, -62], [27, -60],
  [30, -58], [31, -56], [32, -54], [32, -52], [32, -50], [31, -48], [30, -46], [27, -44], [26, -42], [25, -40],
  [21, -38], [23, -36], [24, -34], [25, -32], [27, -30], [28, -28], [29, -26], [30, -24], [32, -22], [33, -20],
  [34, -18], [35, -16], [35, -14], [35, -12], [35, -10], [34, -8], [30, -6], [26, -4], [18, -2], [18, 0], [18, 2],
  [17, 4], [16, 6], [0, 8],
];
// The outline was measured at the hall's size of 2026-11-26 (Squatch 1.65: 85% of the hall's door, 1.4 times); the
// room table (room-scale.js, Brian's yes of 2026-11-27) sets the hall's people now, so it is scaled round his feet to
// that size (the hall's sizes are fixed when the game loads).
const OUTLINE_K = adultPxFor("hall") / (doorAdultPx("hall") * HALL_BIGGER);
export const SQUATCH_OUTLINE = Object.freeze([
  ...HALF_OUTLINE.map(([x, y]) => Object.freeze([x * OUTLINE_K, y * OUTLINE_K])),
  ...HALF_OUTLINE.slice(1, -1).reverse().map(([x, y]) => Object.freeze([-x * OUTLINE_K, y * OUTLINE_K])),
]);
// Points along the outline every 2 pixels or less: a cone that crosses him crosses his outline, so it holds one of
// these (a cone on him by less than 2 pixels is not one a kid could see).
const OUTLINE_PTS = (() => {
  const out = [];
  for (let i = 0; i < SQUATCH_OUTLINE.length; i++) {
    const [x0, y0] = SQUATCH_OUTLINE[i],
      [x1, y1] = SQUATCH_OUTLINE[(i + 1) % SQUATCH_OUTLINE.length],
      n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 2));
    for (let k = 0; k < n; k++) out.push([x0 + ((x1 - x0) * k) / n, y0 + ((y1 - y0) * k) / n]);
  }
  return out;
})();
// The middle of him, and how far the outline reaches from it at most (a quick "nowhere near" before the full test).
const BODY_MID = -36 * OUTLINE_K,
  BODY_REACH = Math.max(...OUTLINE_PTS.map(([x, y]) => Math.hypot(x, y - BODY_MID))) + 0.5;
/** True when (px, py) is inside his outline standing at feet `sq`. */
function insideOutline(px, py, sq) {
  const x = px - sq.x,
    y = py - sq.y;
  let inside = false;
  for (let i = 0, j = SQUATCH_OUTLINE.length - 1; i < SQUATCH_OUTLINE.length; j = i++) {
    const [xi, yi] = SQUATCH_OUTLINE[i],
      [xj, yj] = SQUATCH_OUTLINE[j];
    yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi && (inside = !inside);
  }
  return inside;
}
/**
 * How far the cone is from Squatch at feet `sq` (0 when it is on him). In the hall: from any part of his outline.
 * A cone drawn somewhere other than where sight is measured from (`draw`, only the home guard's flashlight beam,
 * where Squatch is drawn three times hall size) keeps Brian's approved home rule: the one point of him the beam is
 * drawn to see (seenPointDrawn, on his head as drawn at home).
 */
export function coneEdge(c, sq) {
  if (c.draw) return distToCone(sq.x, sq.y - SQUATCH_SEEN_ABOVE_FEET, c.ox, c.oy, c.a, c.half, c.len);
  const mid = distToCone(sq.x, sq.y + BODY_MID, c.ox, c.oy, c.a, c.half, c.len);
  // (far beyond the distance fade, a lower bound is enough: nothing is drawn or seen out there)
  if (mid - BODY_REACH > CONE_FADE.gone) return mid - BODY_REACH;
  if (insideOutline(c.ox, c.oy, sq)) return 0;
  let d = Infinity;
  for (const [x, y] of OUTLINE_PTS) {
    const e = distToCone(sq.x + x, sq.y + y, c.ox, c.oy, c.a, c.half, c.len);
    if (e <= 0) return 0;
    e < d && (d = e);
  }
  return d;
}
/** True when the cone sees Squatch standing at feet `sq` (not hidden): it is on him (coneEdge). */
export function coneSees(c, sq) {
  return coneEdge(c, sq) <= 0;
}
/** The home rule as Brian approved it (2026-11-25): the guard's look sees the one point 20 above his feet. */
export function coneSeesPoint(c, sq) {
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
    // (the cone and the point of him it is drawn to see move together: coneEdge's test is the same)
    const dx = c.ox + ((c.draw && c.draw.dx) || 0),
      dy = c.oy + ((c.draw && c.draw.dy) || 0),
      edge = coneEdge(c, sq),
      inside = !hidden && edge <= 0,
      show = all || c.always ? 1 : coneShow(edge);
    out.push({ ...c, edge, inside, show });
    if (!(show > 0)) continue;
    // Only a cone on screen is told to the tests (what a kid can see): the numbers it is drawn from.
    note && note({ id: c.id, ox: dx, oy: dy, a: c.a, half: c.half, len: c.len, ...(c.draw ? { draw: c.draw } : {}) });
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
    } else if (c.bold) {
      // (bold: the lunch sneak's watchers, whose cones a kid plans the whole sneak by: a darker dashed edge and a
      // pale fill, so the cone reads on a phone; PLACEHOLDER look for Brian)
      ctx.setLineDash([10, 6]);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(70,76,92,.9)";
      ctx.fillStyle = "rgba(255,244,200,.28)";
      ctx.fill();
      ctx.stroke();
    } else {
      // a cone close to him stands out (darker, thicker dashes, a lighter inside), so a kid sees on a phone which
      // cone is about to touch him and where its edge is (Brian 2026-11-26, showing 6: "It looks like he's right in
      // the octopus' cone, what am I missing??"); far cones stay faint
      const near = Math.max(0, Math.min(1, 1 - edge / CONE_NEAR));
      ctx.setLineDash([8 + 4 * near, 7]);
      ctx.lineWidth = 2 + 2.5 * near;
      ctx.strokeStyle = `rgba(${Math.round(90 - 40 * near)},${Math.round(96 - 40 * near)},${Math.round(110 - 30 * near)},${(0.6 + 0.35 * near).toFixed(2)})`;
      ctx.fillStyle = `rgba(255,255,255,${(0.08 + 0.17 * near).toFixed(2)})`;
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }
  ctx.restore();
  return out;
}
