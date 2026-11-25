/**
 * His outfit during the party in disguise (party plan P6, "Losing pieces"). The kid chose it in the dress-up
 * (dress-up.js): { head, face, body, legs } -> piece id. Nothing tips or hangs crooked (Brian 2026-11-24, his click
 * "Lose it all": "nothing tips. Pieces only come off in the big moments: the snack pyramid falling and the
 * octopus's second hug"). A piece knocked off flies off on screen (rule 13: never an outcome without its event)
 * and fur shows at that spot; from then on guests treat him as in P2 ("?" then "!").
 *
 * The state lives on the party's game-state object `p`:
 *   p.outfit  what he chose (kept whole for a P6 restart)
 *   p.lostPieces the spots whose piece is gone (kept for a P7 restart)
 *   p.flying  pieces in the air: { id, spot, x0, y0, x1, y1, k, to ("floor") }
 *   p.fallen  pieces lying where they landed: { id, x, y, rot, to }
 */
import { BODY_SPOTS, PIECES } from "./party-art.js";

// Which piece goes first: what sticks out most (the hat).
export const KNOCK_ORDER = Object.freeze(["head", "body", "face", "legs"]);
export const PIECE_FLY = Object.freeze({ seconds: 0.7 });

/** What he has on now: the chosen outfit without the lost pieces. */
export function wornNow(p) {
  const out = {};
  for (const spot of Object.keys(BODY_SPOTS)) out[spot] = p.outfit && p.outfit[spot] && !(p.lostPieces || []).includes(spot) ? p.outfit[spot] : "";
  return out;
}
/**
 * True when the boots are on his legs: they stand where his feet are, so a drawing that can leave his own legs and
 * feet out does (the dance), and he is drawn once. Boots worn anywhere else leave his feet alone.
 */
export function bootsOnFeet(worn) {
  return !!worn && worn.legs === "boots";
}
/** True once any piece is gone (or he has nothing on): fur shows, and guests see him as in P2. */
export function furShows(p) {
  const w = wornNow(p);
  return !Object.values(w).every(Boolean);
}
/** True while he still has at least one piece on. */
export function anyWorn(p) {
  return Object.values(wornNow(p)).some(Boolean);
}
/** The piece the next big moment takes: the first one he still wears, in KNOCK_ORDER ("" with nothing on). */
export function nextSpot(p) {
  const w = wornNow(p);
  return KNOCK_ORDER.find((s) => w[s]) || "";
}
/** A big moment knocks his next piece off (it lands on the floor beside him). Returns the spot, or "" with nothing on. */
export function knockNext(p, sq, scale) {
  const spot = nextSpot(p);
  spot && knockOff(p, spot, sq, scale, "floor");
  return spot;
}
/** Knocks the piece at `spot` off: it flies from his body to the floor beside him (or to `land`). */
export function knockOff(p, spot, sq, scale, to, land) {
  const id = p.outfit[spot],
    s = BODY_SPOTS[spot];
  (p.lostPieces = p.lostPieces || []).push(spot);
  const x0 = sq.x + s.x * scale,
    y0 = sq.y + s.y * scale,
    at = land || { x: sq.x + 50 * (sq.f || 1), y: sq.y + 6 };
  (p.flying = p.flying || []).push({ id, spot, x0, y0, x1: at.x, y1: at.y, k: 0, to });
}
/** Every frame: pieces in the air keep flying until they land (alarm or not). */
export function tickPieces(p, dt) {
  for (const f of p.flying || []) f.k += dt / PIECE_FLY.seconds;
  const landed = (p.flying || []).filter((f) => f.k >= 1);
  p.flying = (p.flying || []).filter((f) => f.k < 1);
  // A piece that lands stays where it fell.
  for (const f of landed) (p.fallen = p.fallen || []).push({ id: f.id, x: f.x1, y: f.y1, rot: 0.6, to: f.to });
}
/** Where each flying piece is now (for drawing): an arc from his body to where it lands, spinning. */
export function flyingNow(p) {
  return (p.flying || []).map((f) => {
    const k = Math.min(1, f.k),
      arc = Math.sin(k * Math.PI) * 60;
    const piece = PIECES.find((q) => q.id === f.id);
    return { id: f.id, x: f.x0 + (f.x1 - f.x0) * k, y: f.y0 + (f.y1 - f.y0) * k - arc, rot: k * 7, w: 26 * (piece && piece.h > 0.7 ? 0.8 : 1) };
  });
}
