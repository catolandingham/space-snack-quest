/**
 * Draws the party hall at night from one description of what is on screen (a "view"), so the game (party.js)
 * and the picture sheet for Brian (tools/party-sheet.mjs) draw it the same way. The locked hall picture is drawn
 * first and never changed; everything else goes on top of it.
 *   view = { t, picture, banner: { glow }, lights: { dim } | null, isfred: { x, y, f }, band: { playing }, guests: [{ id, x, y, dance, lean }], bartender: { x, y, f }, guards: [{ x, y, f, look }],
 *            tripod: { x, y, aim, counting }, cones: [cone], allCones, squatch: { x, y, f, walk, pose ("stand",
 *            "peek" or "hidden"), outfit, flyer, tip, shake, hop } | null, eyes: { x, y } | null, marks: [{ x, y,
 *            mark }], shout: { x, y } | null, alarm: bool, vent: bool, tufts: [{ x, y, s, rot }],
 *            warning: { k } | null (the vent's fur sign), unseen (nobody can see him now), fooled (in a whole
 *            disguise: a cone that holds him stays a dashed outline), floor (ctx) (drawn under
 *            everyone), extra: [{ y, f }] (more people, sorted by their feet: Mops at closing time) }
 * Returns the cones as drawn (party-watch.js drawCones).
 */
import { HALL, BANNER, CAST, DANCE_SPOT } from "./party-hall.js";
import { drawCones } from "./party-watch.js";
import { drawBanner, drawBand, drawPerson, LOOKS, drawTripod, drawVentSwirl, drawAlarmFlash, drawPartyLights, drawOutfit, drawFlyer, drawTuft, drawMark, drawShout, drawWarning } from "./party-art.js";

/** Squatch peeking: only his head and his paws on the door frame show in the doorway gap (Brian S 1372). */
function drawPeek(ctx, E, sq, scale) {
  const d = HALL.homeDoor;
  ctx.save();
  ctx.beginPath();
  ctx.rect(d.x0 + 3, d.y0 - 30, d.x1 - d.x0 - 6, 80);
  ctx.clip();
  E.drawSquatch(ctx, sq.x, sq.y, scale, { f: 1, eyes: "wide" });
  ctx.restore();
  // his paws round the door frame
  for (const px of [d.x0 + 6, d.x1 - 6]) {
    ctx.beginPath();
    ctx.ellipse(px, sq.y - 38 * scale, 4.2 * scale, 3.4 * scale, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#6b4428";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#1e2430";
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(px, sq.y - 37 * scale, 2.2 * scale, 1.8 * scale, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#f4c39a";
    ctx.fill();
  }
}

/** Squatch standing in the hall, with what he wears, a flyer on his back and a warning shake. */
export function drawSquatchInHall(ctx, E, sq, scale, t) {
  const shake = sq.shake > 0 ? Math.sin(t * 60) * 2.5 : 0,
    y = sq.y - (sq.hop || 0); // a bump lifts him off the floor for a moment (the hallway doorway's push back)
  E.drawSquatch(ctx, sq.x + shake, y, scale, { f: sq.f || 1, walk: sq.walk || 0 });
  sq.outfit && drawOutfit(ctx, sq.x + shake, y, scale, sq.outfit, sq.f || 1, sq.tip);
  // the flyer stuck to his back fur: on the side away from where he faces, big enough to see
  sq.flyer && drawFlyer(ctx, sq.x + shake - (sq.f || 1) * 9 * scale, y - 24 * scale, 15 * scale, -(sq.f || 1) * 0.35);
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
  drawBanner(ctx, BANNER, view.banner ? view.banner.glow || 0 : 0, t);
  view.alarm && drawAlarmFlash(ctx, HALL.alarm, t);
  view.lights && drawPartyLights(ctx, DANCE_SPOT, t, view.lights.dim, view.lights.color);
  const sq = view.squatch;
  const drawn = drawCones(ctx, view.cones || [], sq || { x: -999, y: -999 }, !sq || sq.pose !== "stand" || !!view.unseen, !!view.allCones, view.noteCone, !!view.fooled);
  // On the floor, under everyone: what P6 to P8 leave there (fallen pieces, Mops's wet streak, his heart cone).
  view.floor && view.floor(ctx);
  // Everyone, back to front.
  const people = [];
  for (const g of view.guests || []) people.push({ y: g.y, f: () => guestArt.drawId(ctx, g.id, g.x, g.y, adult, t, g.dance || 0, g.lean || 0) });
  view.isfred && people.push({ y: view.isfred.y, f: () => E.drawIsfred(ctx, view.isfred.x, view.isfred.y, view.isfred.f || 1) });
  if (view.band) {
    const spots = view.band.spots || CAST.band;
    people.push({ y: spots[0].y, f: () => drawBand(ctx, spots, adult * 0.98, t, !!view.band.playing, view.band.looks, view.band.gone) });
  }
  view.bartender && people.push({ y: view.bartender.y, f: () => drawPerson(ctx, view.bartender.x, view.bartender.y, adult, LOOKS.bartender, view.bartender.f || -1, t) });
  for (const g of view.guards || []) people.push({ y: g.y, f: () => drawPerson(ctx, g.x, g.y, adult * 1.02, g.look || LOOKS.guard, g.f || 1, t) });
  view.tripod && people.push({ y: view.tripod.y, f: () => drawTripod(ctx, view.tripod.x, view.tripod.y, view.tripod.aim) });
  if (sq && sq.pose === "stand") people.push({ y: sq.y, f: () => drawSquatchInHall(ctx, E, sq, sqScale, t) });
  for (const x of view.extra || []) people.push(x);
  people.sort((a, b) => a.y - b.y).forEach((p) => p.f());
  sq && sq.pose === "peek" && drawPeek(ctx, E, sq, sqScale);
  view.eyes && E.drawEyes(ctx, view.eyes.x, view.eyes.y);
  for (const tf of view.tufts || []) drawTuft(ctx, tf.x, tf.y, tf.s || 10, tf.rot || 0);
  // Over everything: the "?" and "!" over watchers, the shout, and the warning sign over Squatch.
  for (const m of view.marks || []) drawMark(ctx, m.x, m.y, m.mark, m.size || 30, t);
  view.shout && drawShout(ctx, view.shout.x, view.shout.y, t);
  // The vent's warning: a big fur tuft over him, wobbling.
  if (view.warning && sq) drawWarning(ctx, sq.x, sq.y - 50 * sqScale - 46 * 0.75, 46, (c, s) => drawTuft(c, 0, 0, s * 0.85, Math.sin(t * 6) * 0.3), view.warning.k, t);
  return drawn;
}
