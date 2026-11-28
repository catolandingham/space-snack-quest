/**
 * The locked rooms' look, for drawings laid over them (round 8 final art, 2026-11-27): the colours the room scripts use
 * (docs/locked-rooms/*_room.py: delivery_room.py, office_room_v2.py, hallway_room.py, home_room.py), and their way of
 * drawing: flat fills, one dark ink outline about 3 to 5 picture pixels wide (2 to 4 on the 960 x 640 canvas), rounded
 * corners, and a small white shine dot on round glassy things. No gradients, no soft shading.
 */
export const LOCKED_LOOK = Object.freeze({
  ink: "rgb(34,36,44)", // DARK
  wall: "rgb(244,241,234)", // WALL
  floor: "rgb(234,229,218)", // FLOOR
  line: "rgb(200,197,190)", // LINE (floor seams, faint marks)
  navy: "rgb(50,56,96)", // NAVY (space through the window)
  star: "rgb(235,235,245)", // STAR
  hull: "rgb(196,200,210)", // SHIP
  hullDark: "rgb(150,156,170)", // SHIPD
  port: "rgb(120,170,220)", // PORT (glass, lenses)
  portShine: "rgb(200,220,240)",
  desk: "rgb(138,147,163)", // DESK (grey metal)
  deskTop: "rgb(181,188,200)", // DESK_TOP
  bezel: "rgb(89,101,125)", // BEZEL
  seam: "rgb(43,58,103)", // DOOR_SEAM
  red: "rgb(229,83,61)", // RED
  green: "rgb(43,196,138)", // GREEN
  yellow: "rgb(244,196,48)", // YEL
  crate: "rgb(206,176,136)", // CRATE
  crateDark: "rgb(170,140,100)", // CRATED
  wood: "rgb(120,100,70)",
  paper: "rgb(255,253,243)",
  feedWall: "rgb(220,216,208)", // the security feeds' wall
  feedFloor: "rgb(206,200,188)", // the security feeds' floor
  feedLine: "rgb(80,86,100)", // the security feeds' thin outlines
});

/** A rounded-rectangle path (x, y, w, h, r). */
export function lookRound(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2));
}
/** Fills the current path with `fill` and outlines it in the rooms' ink, `lw` wide. */
export function lookFill(ctx, fill, lw = 2.5) {
  ctx.fillStyle = fill;
  ctx.fill();
  if (lw > 0) {
    ctx.lineWidth = lw;
    ctx.strokeStyle = LOCKED_LOOK.ink;
    ctx.lineJoin = "round";
    ctx.stroke();
  }
}
/** The rooms' white shine dot on glass, at (x, y), radius r. */
export function lookShine(ctx, x, y, r) {
  ctx.fillStyle = LOCKED_LOOK.portShine;
  ctx.beginPath();
  ctx.ellipse(x, y, r, r, 0, 0, Math.PI * 2);
  ctx.fill();
}
