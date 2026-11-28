/**
 * Draws the party hall at night from one description of what is on screen (a "view"), so the game (party.js)
 * and the picture sheet for Brian (tools/party-sheet.mjs) draw it the same way. The locked hall picture is drawn
 * first and never changed; everything else goes on top of it.
 *   view = { t, picture, banner: { glow }, lights: { dim } | null, isfred: { x, y, f }, band: { playing }, guests: [{ id, x, y, dance, lean, arms (the octopus's, out for a chase) }], bartender: { x, y, f }, guards: [{ x, y, f }],
 *            tripod: { x, y, aim, counting }, mic: { x, y, carried } | null (the mic stand), cones: [cone], allCones, squatch: { x, y, f, walk, pose ("stand",
 *            "peek" or "hidden"), outfit, flyer, shake, hop } | null, eyes: { x, y } | null, marks: [{ x, y,
 *            mark }], shout: { x, y } | null, alarm: bool, vent: bool, tufts: [{ x, y, s, rot }],
 *            warning: { k } | null (the vent's fur sign), unseen (nobody can see him now), fooled (in a whole
 *            disguise: a cone that holds him stays a dashed outline), floor (ctx) (drawn under
 *            everyone), extra: [{ y, f }] (more people, sorted by their feet: Mops at closing time) }
 * Returns the cones as drawn (party-watch.js drawCones).
 */
import { HALL, BANNER, CAST, DANCE_SPOT } from "./party-hall.js";
import { OUTLINE, highlightLine } from "./outline.js";
import { drawCones } from "./party-watch.js";
import { drawOctopusArmsOut, drawHug } from "./party-octopus-art.js";
import { walkArms } from "./party-shirt-art.js";
import { drawBanner, drawBand, drawPerson, LOOKS, drawTripod, drawVentSwirl, drawAlarmFlash, drawPartyLights, drawOutfit, drawFlyer, drawTuft, drawMark, drawShout, drawWarning, drawMicStand } from "./party-art.js";

// Peeking, the top of his head shows this far above the doorway gap's top edge.
const PEEK_OVER_DOOR = 13;
/** Squatch peeking: only his head and his paws on the door frame show in the doorway gap (Brian S 1372). */
function drawPeek(ctx, E, sq, scale) {
  const d = HALL.homeDoor,
    // however big the hall draws him, the top of his head comes just over the doorway's top edge and no higher
    y = d.y0 - PEEK_OVER_DOOR + 50 * scale;
  ctx.save();
  ctx.beginPath();
  ctx.rect(d.x0 + 3, d.y0 - 30, d.x1 - d.x0 - 6, 80);
  ctx.clip();
  E.drawSquatch(ctx, sq.x, y, scale, { f: 1, eyes: "wide" });
  ctx.restore();
  // his paws round the door frame
  for (const px of [d.x0 + 6, d.x1 - 6]) {
    ctx.beginPath();
    ctx.ellipse(px, y - 38 * scale, 4.2 * scale, 3.4 * scale, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#6b4428";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#1e2430";
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(px, y - 37 * scale, 2.2 * scale, 1.8 * scale, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#f4c39a";
    ctx.fill();
  }
}

/** Where the flyer is in his paw (held out in front of him, where it can be seen), for his feet, facing and size. */
export const flyerInPaw = (x, y, f, scale) => ({ x: x + f * 13 * scale, y: y - 17 * scale, size: 13 * scale, rot: f * 0.15 });
/** Squatch standing in the hall, with what he wears, the flyer in his paw and a warning shake. */
export function drawSquatchInHall(ctx, E, sq, scale, t) {
  const shake = sq.shake > 0 ? Math.sin(t * 60) * 2.5 : 0,
    y = sq.y - (sq.hop || 0); // a bump lifts him off the floor for a moment (the hallway doorway's push back)
  E.drawSquatch(ctx, sq.x + shake, y, scale, { f: sq.f || 1, walk: sq.walk || 0 });
  sq.outfit && drawOutfit(ctx, sq.x + shake, y, scale, sq.outfit, sq.f || 1, { arms: walkArms(sq.walk || 0), hatTip: sq.hatTip || 0 });
  // the flyer he carries: in his paw, in front of him
  if (sq.flyer) {
    const at = flyerInPaw(sq.x + shake, y, sq.f || 1, scale);
    drawFlyer(ctx, at.x, at.y, at.size, at.rot);
  }
}

export function drawHall(ctx, E, guestArt, view) {
  const t = view.t || 0,
    sizes = E.hallSizes(),
    adult = sizes.adult,
    sqScale = sizes.squatch;
  const pic = view.picture;
  if (pic && pic.complete && pic.naturalWidth) ctx.drawImage(pic, 0, 0, 960, 640);
  else ((ctx.fillStyle = "#e2e5ed"), ctx.fillRect(0, 0, 960, 640));
  view.vent !== false && drawVentSwirl(ctx, HALL.vent, t);
  // (banner: false, the day after the party: the lunch sneak's hall has no party banner)
  view.banner !== false && drawBanner(ctx, BANNER, view.banner ? view.banner.glow || 0 : 0, t);
  view.alarm && drawAlarmFlash(ctx, HALL.alarm, t);
  view.lights && drawPartyLights(ctx, DANCE_SPOT, t, view.lights.dim, view.lights.color);
  // the dance spot's gold dashed outline, pulsing gently like every usable thing's, whenever he can dance there
  view.danceRing && drawDanceRing(ctx, t);
  const sq = view.squatch;
  const drawn = drawCones(ctx, view.cones || [], sq || { x: -999, y: -999 }, !sq || sq.pose !== "stand" || !!view.unseen, !!view.allCones, view.noteCone, !!view.fooled);
  // On the floor, under everyone: what P6 to P8 leave there (fallen pieces, Mops's wet streak, his heart cone).
  view.floor && view.floor(ctx);
  // Everyone, back to front.
  const people = [];
  for (const g of view.guests || []) {
    // the octopus with his arms out for a chase (party-octopus-art.js); everyone else is their approved picture
    people.push({ y: g.y, f: () => (g.arms ? drawOctopusArmsOut(ctx, guestArt, g, adult, t) : guestArt.drawId(ctx, g.id, g.x, g.y, adult, t, g.dance || 0, g.lean || 0)) });
    // his hug: two arms round Squatch, drawn over both of them
    g.arms && g.arms.hug && sq && sq.pose === "stand" && people.push({ y: Math.max(g.y, sq.y) + 0.5, f: () => drawHug(ctx, g, sq, sqScale, adult, t, g.arms.hugK) });
  }
  view.isfred && people.push({ y: view.isfred.y, f: () => E.drawIsfred(ctx, view.isfred.x, view.isfred.y, view.isfred.f || 1) });
  if (view.band) {
    const spots = view.band.spots || CAST.band;
    people.push({ y: spots[0].y, f: () => drawBand(ctx, spots, adult * 0.98, t, !!view.band.playing, view.band.looks, view.band.gone, !!view.band.pose, view.band.beat) });
  }
  view.mic && people.push({ y: view.mic.y, f: () => drawMicStand(ctx, view.mic.x, view.mic.y, adult, view.mic.carried) });
  view.bartender && people.push({ y: view.bartender.y, f: () => drawPerson(ctx, view.bartender.x, view.bartender.y, adult, LOOKS.bartender, view.bartender.f || -1, t) });
  for (const g of view.guards || []) people.push({ y: g.y, f: () => drawPerson(ctx, g.x, g.y, adult * 1.02, LOOKS.guard, g.f || 1, t) });
  view.tripod && people.push({ y: view.tripod.y, f: () => drawTripod(ctx, view.tripod.x, view.tripod.y, view.tripod.aim) });
  if (sq && sq.pose === "stand") people.push({ y: sq.y, f: () => drawSquatchInHall(ctx, E, sq, sqScale, t) });
  for (const x of view.extra || []) people.push(x);
  drawOrder(people).forEach((p) => p.f());
  sq && sq.pose === "peek" && drawPeek(ctx, E, sq, sqScale);
  view.eyes && E.drawEyes(ctx, view.eyes.x, view.eyes.y);
  for (const tf of view.tufts || []) drawTuft(ctx, tf.x, tf.y, tf.s || 10, tf.rot || 0);
  // Over everything: the "?" and "!" over watchers, the shout, and the warning sign over Squatch.
  for (const m of view.marks || []) drawMark(ctx, m.x, m.y, m.mark, m.size || 30, t, m.q || null);
  view.shout && drawShout(ctx, view.shout.x, view.shout.y, t);
  // The vent's warning: a big fur tuft over him, wobbling.
  if (view.warning && sq) drawWarning(ctx, sq.x, sq.y - 50 * sqScale - 46 * 0.75, 46, (c, s) => drawTuft(c, 0, 0, s * 0.85, Math.sin(t * 6) * 0.3), view.warning.k, t);
  return drawn;
}

/**
 * The order people are drawn in: by their feet, front last; two on the same feet line keep the order they were listed
 * in, every frame (Brian 2026-11-25, showing-5 note 11: ties always resolve the same way).
 */
export function drawOrder(people) {
  return people.map((p, i) => ({ p, i })).sort((a, b) => a.p.y - b.p.y || a.i - b.i).map((x) => x.p);
}

/**
 * The dance spot on the floor outlined the way the game outlines every usable thing (outline.js OUTLINE: gold,
 * dashed, outside the spot, pulsing gently as bridge.js drawGoalOutline does). Brian 2026-11-25, showing-5 note 4.
 */
export function drawDanceRing(ctx, t) {
  ctx.save();
  highlightLine(ctx, t);
  ctx.beginPath();
  ctx.ellipse(DANCE_SPOT.x, DANCE_SPOT.y, DANCE_SPOT.rx + OUTLINE.width, DANCE_SPOT.ry + OUTLINE.width, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}
