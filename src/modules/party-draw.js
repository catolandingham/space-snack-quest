/**
 * Draws the party hall at night from one description of what is on screen (a "view"), so the game (party.js)
 * and the picture sheet for Brian (tools/party-sheet.mjs) draw it the same way. The locked hall picture is drawn
 * first and never changed; everything else goes on top of it.
 *   view = { t, picture, banner: { glow }, lights: { song, dim } | null, isfred: { x, y, f }, band: { look,
 *            playing }, guests: [{ id, x, y, dance, lean }], bartender: { x, y, f }, guards: [{ x, y, f }],
 *            tripod: { x, y, aim, counting }, cones: [cone], allCones, squatch: { x, y, f, walk, pose ("stand",
 *            "peek" or "hidden"), outfit, flyer, tip, shake } | null, eyes: { x, y } | null, marks: [{ x, y,
 *            mark }], shout: { x, y } | null, alarm: bool, beard: 0 to 1, vent: bool, tufts: [{ x, y, s, rot }],
 *            warning: { kind: "tuft" | "piece", piece, k } | null, unseen (nobody can see him now) }
 * Returns the cones as drawn (party-watch.js drawCones).
 */
import { HALL, BANNER, CAST, DANCE_SPOT } from "./party-hall.js";
import { drawSquatchArt } from "./squatch-art.js";
import { drawCones } from "./party-watch.js";
import { drawBanner, drawBand, drawPerson, LOOKS, drawTripod, drawVentSwirl, drawAlarmFlash, drawBeardInDoorway, drawPartyLights, drawOutfit, drawFlyer, drawTuft, drawMark, drawShout, drawWarning, drawPiece, PIECES } from "./party-art.js";

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
  const shake = sq.shake > 0 ? Math.sin(t * 60) * 2.5 : 0;
  E.drawSquatch(ctx, sq.x + shake, sq.y, scale, { f: sq.f || 1, walk: sq.walk || 0 });
  sq.outfit && drawOutfit(ctx, sq.x + shake, sq.y, scale, sq.outfit, sq.f || 1, sq.tip);
  // the flyer stuck to his back fur: on the side away from where he faces, big enough to see
  sq.flyer && drawFlyer(ctx, sq.x + shake - (sq.f || 1) * 9 * scale, sq.y - 24 * scale, 15 * scale, -(sq.f || 1) * 0.35);
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
  view.beard > 0 && drawBeardInDoorway(ctx, HALL.hallwayDoor, t, view.beard);
  view.lights && drawPartyLights(ctx, DANCE_SPOT, view.lights.song, t, view.lights.dim);
  const sq = view.squatch;
  const drawn = drawCones(ctx, view.cones || [], sq || { x: -999, y: -999 }, !sq || sq.pose !== "stand" || !!view.unseen, !!view.allCones, view.noteCone);
  // Everyone, back to front.
  const people = [];
  for (const g of view.guests || []) people.push({ y: g.y, f: () => guestArt.drawId(ctx, g.id, g.x, g.y, adult, t, g.dance || 0, g.lean || 0) });
  view.isfred && people.push({ y: view.isfred.y, f: () => E.drawIsfred(ctx, view.isfred.x, view.isfred.y, view.isfred.f || 1) });
  if (view.band) {
    const spots = view.band.spots || CAST.band;
    people.push({ y: spots[0].y, f: () => drawBand(ctx, spots, adult * 0.98, view.band.look || "A", t, !!view.band.playing) });
  }
  view.bartender && people.push({ y: view.bartender.y, f: () => drawPerson(ctx, view.bartender.x, view.bartender.y, adult, LOOKS.bartender, view.bartender.f || -1, t) });
  for (const g of view.guards || []) people.push({ y: g.y, f: () => drawPerson(ctx, g.x, g.y, adult * 1.02, LOOKS.guard, g.f || 1, t) });
  view.tripod && people.push({ y: view.tripod.y, f: () => drawTripod(ctx, view.tripod.x, view.tripod.y, view.tripod.aim, view.tripod.counting, t) });
  if (sq && sq.pose === "stand") people.push({ y: sq.y, f: () => drawSquatchInHall(ctx, E, sq, sqScale, t) });
  people.sort((a, b) => a.y - b.y).forEach((p) => p.f());
  sq && sq.pose === "peek" && drawPeek(ctx, E, sq, sqScale);
  view.eyes && E.drawEyes(ctx, view.eyes.x, view.eyes.y);
  for (const tf of view.tufts || []) drawTuft(ctx, tf.x, tf.y, tf.s || 10, tf.rot || 0);
  // Over everything: the "?" and "!" over watchers, the shout, and the warning sign over Squatch.
  for (const m of view.marks || []) drawMark(ctx, m.x, m.y, m.mark, m.size || 30, t);
  view.shout && drawShout(ctx, view.shout.x, view.shout.y, t);
  if (view.warning && sq) {
    const w = view.warning,
      size = 46,
      wy = sq.y - 50 * sqScale - size * 0.75;
    drawWarning(
      ctx,
      sq.x,
      wy,
      size,
      (c, s) => {
        if (w.kind === "tuft") drawTuft(c, 0, 0, s * 0.85, Math.sin(t * 6) * 0.3);
        else {
          const p = PIECES.find((q) => q.id === w.piece);
          drawPiece(c, w.piece, 0, 0, s * (p && p.h > 0.7 ? 0.7 : 0.9), Math.sin(t * 8) * 0.35);
        }
      },
      w.k,
      t,
    );
  }
  return drawn;
}

/**
 * The dance, full screen (party plan P6, V5; half two): Squatch big in his outfit in the spotlight, a ring of
 * guests clapping behind him, the band at the back. `move` counts his robot moves (each tap is the next one).
 */
export function drawDanceCloseUp(ctx, w, h, guestArt, outfit, t, move = 0, song = 0) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#1b1f3a");
  g.addColorStop(1, "#3a2d55");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const floorY = h * 0.62,
    s = Math.min(w / 90, h / 120);
  ctx.fillStyle = ["#5a2c4f", "#1f4f52", "#5a4a22"][song % 3];
  ctx.fillRect(0, floorY, w, h - floorY);
  // the band at the back, small, on a strip of stage
  ctx.fillStyle = "#b08968";
  ctx.fillRect(w * 0.1, floorY - h * 0.08, w * 0.8, h * 0.03);
  drawBand(ctx, [0.3, 0.5, 0.7].map((k) => ({ x: w * k, y: floorY - h * 0.08 })), s * 26, "B", t, true);
  // the spotlight
  const sp = ctx.createRadialGradient(w / 2, h * 0.8, 10, w / 2, h * 0.8, w * 0.45);
  sp.addColorStop(0, "rgba(255,250,210,.6)");
  sp.addColorStop(1, "rgba(255,250,210,0)");
  ctx.fillStyle = sp;
  ctx.beginPath();
  ctx.ellipse(w / 2, h * 0.8, w * 0.45, h * 0.09, 0, 0, Math.PI * 2);
  ctx.fill();
  // the ring of guests, clapping (they bounce on the beat)
  const ring = ["teal", "camera", "backpack", "stilt", "octopus-guest", "robot"];
  ring.forEach((id, i) => {
    const k = i / (ring.length - 1),
      x = w * (0.08 + 0.84 * k),
      y = floorY + h * 0.07 + Math.sin(k * Math.PI) * -h * 0.04;
    guestArt.drawId(ctx, id, x, y, s * 30, t * 1.5, 1, 0);
  });
  // Squatch big, doing the robot: arms snap to a new pose on each move
  const sx = w / 2,
    sy = h * 0.86,
    sc = s * 0.9,
    pose = move % 4;
  ctx.save();
  ctx.translate(sx, sy);
  ctx.rotate([0, 0.08, 0, -0.08][pose]);
  drawSquatchArt(ctx, 0, 0, sc, { line: Math.max(2, sc * 0.9) });
  drawOutfit(ctx, 0, 0, sc, outfit, 1);
  ctx.restore();
}
