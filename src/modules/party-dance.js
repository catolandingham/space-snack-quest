/**
 * The free dance (party plan P6, "Dance"; decision 2026-11-22: "A free dance ... no game, no points, no fail";
 * Brian 2026-11-23 on the old arrow game: "It's way too fast ... it should be full screen"). DANCE · circle in the
 * spotlight opens it full screen (the whole phone screen, the stick and the action button hidden): Squatch big in
 * his outfit in the spotlight, a ring of guests clapping behind him, the band at the back. Every tap anywhere is
 * his next robot move and the crowd cheers louder. No arrows, no speed, no fail, no points. It ends with the song.
 */
import { drawBand, drawOutfit, oval, line } from "./party-art.js";
import { drawSquatchArt } from "./squatch-art.js";

// PLACEHOLDERS: the shortest dance (if the song is nearly over when he starts, the band plays on this long), how
// fast the crowd's cheer fades, and how long the guests clap back in the hall.
export const DANCE = Object.freeze({ least: 12, cheerFade: 0.35, cheerPerMove: 0.18, clap: 2.5 });
// The room's light for each of the three songs (party plan V10): pink, teal, amber.
export const SONG_LIGHTS = Object.freeze(["rgba(255,95,168,.16)", "rgba(43,196,170,.16)", "rgba(255,190,60,.18)"]);
const FLOORS = ["#5a2c4f", "#1f4f52", "#5a4a22"];

/** A new dance: no moves yet, a quiet crowd. */
export function newDance(endAt) {
  return { moves: 0, cheer: 0.2, t: 0, endAt, pop: 0 };
}
/** A tap: his next robot move, and the crowd cheers louder. */
export function danceMove(d) {
  d.moves += 1;
  d.cheer = Math.min(1, d.cheer + DANCE.cheerPerMove);
  d.pop = 1;
}
export function tickDance(d, dt) {
  d.t += dt;
  d.cheer = Math.max(0.2, d.cheer - DANCE.cheerFade * dt);
  d.pop = Math.max(0, d.pop - dt * 4);
}

// His four robot poses, one per move: arms out straight, one arm up, arms bent, a lean.
const POSES = Object.freeze([
  { rot: 0, arms: [-0.2, 0.2] },
  { rot: 0.06, arms: [-1.4, 0.3] },
  { rot: 0, arms: [-0.9, 0.9] },
  { rot: -0.08, arms: [0.3, 1.4] },
]);

/**
 * Draws the dance on a `w` x `h` screen. `guestArt` draws the approved guests; `outfit` is what he has on now;
 * `d` is the dance (moves, cheer); `song` picks the floor and the light.
 */
export function drawDanceCloseUp(ctx, w, h, guestArt, outfit, t, d, song = 0) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#1b1f3a");
  g.addColorStop(1, "#3a2d55");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const floorY = h * 0.62,
    s = Math.min(w / 90, h / 120);
  ctx.fillStyle = FLOORS[song % 3];
  ctx.fillRect(0, floorY, w, h - floorY);
  ctx.fillStyle = SONG_LIGHTS[song % 3];
  ctx.fillRect(0, 0, w, h);
  // the band at the back, small, on a strip of stage
  ctx.fillStyle = "#b08968";
  ctx.fillRect(w * 0.1, floorY - h * 0.08, w * 0.8, h * 0.03);
  drawBand(ctx, [0.3, 0.5, 0.7].map((k) => ({ x: w * k, y: floorY - h * 0.08 })), s * 26, t, true);
  // the spotlight
  const sp = ctx.createRadialGradient(w / 2, h * 0.8, 10, w / 2, h * 0.8, w * 0.45);
  sp.addColorStop(0, "rgba(255,250,210,.6)");
  sp.addColorStop(1, "rgba(255,250,210,0)");
  ctx.fillStyle = sp;
  ctx.beginPath();
  ctx.ellipse(w / 2, h * 0.8, w * 0.45, h * 0.09, 0, 0, Math.PI * 2);
  ctx.fill();
  // the ring of guests, clapping: they bounce higher and their cheer lines grow as the crowd cheers louder
  const ring = ["teal", "camera", "backpack", "stilt", "octopus-guest", "robot"],
    cheer = d ? d.cheer : 0.4;
  ring.forEach((id, i) => {
    const k = i / (ring.length - 1),
      x = w * (0.08 + 0.84 * k),
      hop = Math.abs(Math.sin(t * (4 + cheer * 6) + i)) * h * 0.012 * (1 + cheer * 2),
      y = floorY + h * 0.07 + Math.sin(k * Math.PI) * -h * 0.04 - hop;
    guestArt.drawId(ctx, id, x, y, s * 30, t * 1.5, 1, 0);
    // the cheer, drawn (sound may be off): lines bursting over each head, longer when it is louder
    const top = y - s * 34;
    for (const a of [-0.6, 0, 0.6]) line(ctx, [x + Math.sin(a) * s * 3, top - s * 2, x + Math.sin(a) * s * (3 + 5 * cheer), top - s * (2 + 6 * cheer)], "#ffcf33", Math.max(2, s * 0.6));
  });
  // Squatch big, doing the robot: arms snap to a new pose on each move
  const pose = POSES[(d ? d.moves : 0) % POSES.length],
    sx = w / 2,
    sy = h * 0.86,
    sc = s * 0.9 * (1 + (d ? d.pop : 0) * 0.05);
  ctx.save();
  ctx.translate(sx, sy);
  ctx.rotate(pose.rot);
  drawSquatchArt(ctx, 0, 0, sc, { line: Math.max(2, sc * 0.9) });
  // his arms in the pose (fur-brown, over his own)
  for (const [side, a] of [
    [-1, pose.arms[0]],
    [1, pose.arms[1]],
  ]) {
    ctx.save();
    ctx.translate(side * 15 * sc, -28 * sc);
    ctx.rotate(side * (Math.PI / 2) - a * side);
    oval(ctx, 0, 9 * sc, 3.6 * sc, 9 * sc, "#6b4428", Math.max(2, sc * 0.7));
    ctx.restore();
  }
  drawOutfit(ctx, 0, 0, sc, outfit, 1);
  ctx.restore();
}
