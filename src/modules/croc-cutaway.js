/**
 * The Croc Boy close-up: one full-screen picture in the shared cutaway (cutaway.js), right as the band starts its
 * first song in P3 (Brian 2026-11-26, showing 7 at 0:11: "a cutaway to close up cartoon of the croc boy bebopping
 * right at the beginning"). No words and nothing to tap, so it plays by itself (rule 3, "30a": cutaway.js AUTO) and
 * ends on a clear last frame.
 *
 * A PLACEHOLDER drawing, until Brian picks a look: the Croc Boy at the mic (the middle one, blue shirt) drawn big from
 * the shoulders up, with the same shapes and colours as the hall's Croc Boys (party-art.js drawPerson, look B) but
 * with thin outlines. His head bops on Stormtop-Sylvania's beat (music-picks.js bandSong bpm), his jaw opens on each
 * beat, notes rise from his mouth, and the stage light shines on him.
 */
import { rr, oval, line, drawNote, LOOKS } from "./party-art.js";
import { SPANS } from "./music-picks.js";

const INK = "#1e2430",
  STAGE_BACK = "#3b2b5c",
  STAGE_FLOOR = "#5a3f2e",
  LIGHT = "rgba(255,240,190,0.22)",
  G = "#3fae4a",
  D = "#2a7a33",
  WHITE = "#fffdf8";
// The singer, in the close-up: his neck at (x, y), drawn `k` screen pixels to one of his own units (he is 100 tall),
// with outlines `ow` of his units (4 screen pixels).
const CROC = Object.freeze({ x: 400, y: 470, k: 9.5, ow: 4 / 9.5 });
const BPM = SPANS.bandSong.bpm;

/** The close-up at `t` seconds into it. Returns what it drew (tests read it through cutaway.js lastCutaway). */
export function drawCrocBop(ctx, t) {
  const beat = (t * BPM) / 60,
    up = Math.abs(Math.cos(Math.PI * beat)) ** 3, // 1 on each beat
    tilt = Math.sin(Math.PI * beat) * 0.12,
    look = LOOKS.band[1];
  // the stage behind him: dark, with the spotlight on him
  ctx.fillStyle = STAGE_BACK;
  ctx.fillRect(0, 0, 960, 640);
  ctx.fillStyle = STAGE_FLOOR;
  ctx.fillRect(0, 560, 960, 80);
  ctx.beginPath();
  ctx.moveTo(330, 0);
  ctx.lineTo(560, 0);
  ctx.lineTo(760, 640);
  ctx.lineTo(80, 640);
  ctx.closePath();
  ctx.fillStyle = LIGHT;
  ctx.fill();
  const { x, y, k, ow } = CROC;
  ctx.save();
  ctx.translate(x, y + (1 - up) * 10);
  ctx.scale(k, k);
  // his shoulders and shirt (the band's shirt: white stripe with a tooth zig-zag)
  rr(ctx, -30, 2, 60, 40, 10, look.shirt, ow);
  rr(ctx, -30, 14, 60, 8, 1, WHITE);
  line(ctx, [-26, 18, -22, 15, -18, 18, -14, 15, -10, 18, -6, 15, -2, 18, 2, 15, 6, 18, 10, 15, 14, 18, 18, 15, 22, 18, 26, 15], G, 1.2);
  // his head, bopping on the beat about his neck
  ctx.rotate(tilt - up * 0.08);
  const hy = -14,
    jaw = 0.05 + up * 0.32;
  rr(ctx, -16, hy - 11, 26, 24, 8, G, ow); // the back of his head
  ctx.save();
  ctx.translate(4, hy + 6);
  ctx.rotate(jaw); // the lower jaw drops open on the beat
  rr(ctx, 0, 0, 34, 7, 3, G, ow);
  ctx.beginPath();
  ctx.moveTo(3, 0);
  for (let i = 0; i < 7; i++) (ctx.lineTo(5 + i * 4, -2.6), ctx.lineTo(7 + i * 4, 0));
  ctx.closePath();
  ctx.fillStyle = WHITE;
  ctx.fill();
  ctx.lineWidth = ow * 0.6;
  ctx.strokeStyle = INK;
  ctx.stroke();
  ctx.restore();
  // upper jaw, its teeth, nostrils
  rr(ctx, 2, hy - 3, 38, 9, 3, G, ow);
  ctx.beginPath();
  ctx.moveTo(5, hy + 6);
  for (let i = 0; i < 8; i++) (ctx.lineTo(7 + i * 4, hy + 9), ctx.lineTo(9 + i * 4, hy + 6));
  ctx.closePath();
  ctx.fillStyle = WHITE;
  ctx.fill();
  ctx.lineWidth = ow * 0.6;
  ctx.strokeStyle = INK;
  ctx.stroke();
  oval(ctx, 36, hy - 4, 2.8, 2.2, G, ow);
  oval(ctx, 36.5, hy - 4.4, 1, 0.8, INK);
  // eyes on bumps on top, shut happily on the beat
  for (const ex of [-7, 3]) {
    oval(ctx, ex, hy - 12, 4.8, 4.6, G, ow);
    if (up > 0.6) line(ctx, [ex - 2.6, hy - 12, ex, hy - 13.6, ex + 2.6, hy - 12], INK, ow * 1.2);
    else (oval(ctx, ex, hy - 12.5, 2.6, 2.6, WHITE), oval(ctx, ex + 0.9, hy - 12.5, 1.4, 1.7, INK));
  }
  for (const [rx, ry] of [
    [-12, -4],
    [-8, 1],
    [10, -3],
    [17, -3],
    [24, -3],
  ])
    oval(ctx, rx, hy + ry, 1.7, 1.2, D);
  ctx.restore();
  // the mic on its stand, in front of his snout
  const mx = 880,
    my = 330;
  line(ctx, [mx - 40, my + 30, mx - 40, 640], "#8a93a3", 8);
  ctx.save();
  ctx.translate(mx - 40, my + 30);
  ctx.rotate(-0.5);
  rr(ctx, -12, -46, 24, 48, 10, "#4a505c", 4);
  for (let i = 0; i < 3; i++) line(ctx, [-10, -36 + i * 9, 10, -36 + i * 9], "#8a93a3", 2);
  ctx.restore();
  // notes rising from his mouth, one more on every beat
  const notes = [];
  const colors = ["#ff5fa8", "#ffcf33", "#2bc4aa", "#3478f6"];
  for (let i = 0; i < 4; i++) {
    const q = (beat / 2 + i / 4) % 1,
      nx = 720 + q * 140 + Math.sin(q * 8 + i) * 18,
      ny = 380 - q * 330;
    if (beat / 2 + i / 4 < 1) continue; // none before his first notes
    ctx.save();
    ctx.globalAlpha = Math.sin(q * Math.PI);
    drawNote(ctx, nx, ny, 22, colors[i]);
    ctx.restore();
    notes.push({ x: Math.round(nx), y: Math.round(ny) });
  }
  return { croc: { beat: Math.round(beat * 100) / 100, up: Math.round(up * 100) / 100 }, notes };
}

/** The pictures of the close-up, for the shared cutaway (cutaway.js PANELS). */
export const CROC_PANELS = Object.freeze([drawCrocBop]);
