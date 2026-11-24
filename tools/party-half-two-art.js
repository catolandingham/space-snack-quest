// Drawings for half two of the party rebuild (P6 to P8) and the band look Brian did not pick, kept out of the game's
// code: only the picture sheet (tools/party-sheet-page.js) draws them, so Brian could see every new picture at
// showing 1. Half two moves what it uses into src/modules/ when it builds those scenes.
import { rr, oval, line, INK, drawPerson, drawBand, drawOutfit, drawWarning, drawPiece, PIECES } from "../src/modules/party-art.js";
import { drawSquatchArt } from "../src/modules/squatch-art.js";

// The Croc Boys, look A (not picked): three guest types in matching band shirts and green Crocs.
export const BAND_A = [
  { skin: "#8b5a3c", shirt: "#3fae4a", pants: "#2b2f3c", hair: "#2b1d14", bandShirt: true, crocs: true, instrument: "guitar" },
  { skin: "#8ea6bf", shirt: "#3fae4a", pants: "#2b2f3c", antennae: true, bandShirt: true, crocs: true, instrument: "keytar" },
  { skin: "#e7b48f", shirt: "#3fae4a", pants: "#2b2f3c", hair: "#7a4a24", bandShirt: true, crocs: true, instrument: "drum" },
];
// The room's light for the second and third songs.
export const MORE_SONG_LIGHTS = ["rgba(43,196,170,.16)", "rgba(255,190,60,.18)"];

export function heart(ctx, x, y, s, fill) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.35);
  ctx.bezierCurveTo(x - s, y - s * 0.3, x - s * 0.45, y - s, x, y - s * 0.45);
  ctx.bezierCurveTo(x + s * 0.45, y - s, x + s, y - s * 0.3, x, y + s * 0.35);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = Math.max(1, s * 0.12);
  ctx.strokeStyle = INK;
  ctx.stroke();
}

// ---------- the hallway doorway (V8) ----------
/** Mops's long white beard swishing past the hallway doorway (`door`), seen only inside the doorway. */
export function drawBeardInDoorway(ctx, door, t, show = 1) {
  if (show <= 0) return;
  const swing = Math.sin(t * 1.6);
  ctx.save();
  ctx.beginPath();
  ctx.rect(door.x0 - 30, door.y0, door.x1 - door.x0 + 60, door.y1 - door.y0);
  ctx.clip();
  const bx = door.x0 + 6 + swing * 18,
    by = door.y1 - 6;
  ctx.globalAlpha = show;
  ctx.beginPath();
  ctx.moveTo(bx - 26, door.y0 + 10);
  ctx.quadraticCurveTo(bx - 32, by - 30, bx - 14 + swing * 8, by);
  ctx.quadraticCurveTo(bx + 2, by - 10, bx + 14 - swing * 6, by + 2);
  ctx.quadraticCurveTo(bx + 18, by - 40, bx + 10, door.y0 + 10);
  ctx.closePath();
  ctx.fillStyle = "#f4f5f8";
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = "#9aa1ad";
  ctx.stroke();
  for (let i = 0; i < 3; i++) line(ctx, [bx - 18 + i * 9, door.y0 + 26, bx - 14 + i * 9 + swing * 4, by - 14], "#c9ced8", 1.5);
  ctx.restore();
}


// ---------- Mops's heart cone (V13) ----------
/** Mops's warm cone, as big as everyone's, with hearts floating up in it (PR #35's look, R98 and R104). */
export function drawHeartCone(ctx, ox, oy, a, half, len, t) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(ox, oy);
  ctx.arc(ox, oy, len, a - half, a + half);
  ctx.closePath();
  ctx.fillStyle = "rgba(255,140,180,.30)";
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = "rgba(214,70,120,.8)";
  ctx.stroke();
  for (let i = 0; i < 5; i++) {
    const k = (t * 0.4 + i / 5) % 1,
      d = 30 + k * (len - 40),
      off = Math.sin(i * 2.1 + t) * half * 0.6;
    heart(ctx, ox + Math.cos(a + off) * d, oy + Math.sin(a + off) * d - k * 10, 7 + 3 * Math.sin(k * Math.PI), "#ff6fa0");
  }
  ctx.restore();
}


/** The camera's red countdown light. */
export function drawCountdownLight(ctx, x, y) {
  oval(ctx, x - 6, y - 51, 3, 3, "#ff3b30", 1);
}
/** The vent tugging a piece (half two): the piece, drawn big over him, tipping. */
export function drawTugWarning(ctx, x, y, piece, t) {
  drawWarning(ctx, x, y, 46, (c, s) => {
    const p = PIECES.find((q) => q.id === piece);
    drawPiece(c, piece, 0, 0, s * (p && p.h > 0.7 ? 0.7 : 0.9), Math.sin(t * 8) * 0.35);
  }, 1, t);
}

/**
 * The dance, full screen (party plan P6, V5; half two): Squatch big in his outfit in the spotlight, a ring of
 * guests clapping behind him, the band at the back. `move` counts his robot moves (each tap is the next one).
 */
export function drawDanceCloseUp(ctx, w, h, guestArt, outfit, t, move = 0, song = 0) {
  // (half two moves this into the game)
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
  drawBand(ctx, [0.3, 0.5, 0.7].map((k) => ({ x: w * k, y: floorY - h * 0.08 })), s * 26, t, true);
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
