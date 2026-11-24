/**
 * His outfit during the party in disguise (party plan P6, "Losing pieces"; "Fair in the first minute"). The kid
 * chose it in the dress-up (dress-up.js): { head, face, body, legs } -> piece id. Things at the party can tip a
 * piece crooked (a warning) and then knock it off. A piece knocked off flies off on screen (rule 13: never an
 * outcome without its event) and fur shows at that spot; from then on guests treat him as in P2 ("?" then "!").
 * In his first minute in the hall nothing can knock a piece off: everything only tips it.
 *
 * The state lives on the party's game-state object `p`:
 *   p.outfit  what he chose (kept whole for a P6 restart)
 *   p.lostPieces the spots whose piece is gone (kept for a P7 restart)
 *   p.tip     { spot, a } the one piece hanging crooked, or null
 *   p.flying  pieces in the air: { id, spot, x0, y0, x1, y1, k, to ("floor", "vent" or "plant") }
 *   p.fallen  pieces lying where they landed: { id, x, y, rot, to }
 */
import { HALL } from "./party-hall.js";
import { BODY_SPOTS, PIECES } from "./party-art.js";

// Which piece goes first: what sticks out most (a plant snags the hat, walkthrough beat 16).
export const KNOCK_ORDER = Object.freeze(["head", "body", "face", "legs"]);
export const PIECE_FLY = Object.freeze({ seconds: 0.7, tipAngle: 0.5 });

/** What he has on now: the chosen outfit without the lost pieces. */
export function wornNow(p) {
  const out = {};
  for (const spot of Object.keys(BODY_SPOTS)) out[spot] = p.outfit && p.outfit[spot] && !(p.lostPieces || []).includes(spot) ? p.outfit[spot] : "";
  return out;
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
/** The spot a bump takes: the crooked piece first, else the first worn piece in KNOCK_ORDER. */
export function bumpSpot(p) {
  const w = wornNow(p);
  if (p.tip && w[p.tip.spot]) return p.tip.spot;
  return KNOCK_ORDER.find((s) => w[s]) || "";
}

/**
 * Something bumps him: the first bump tips a piece crooked, the next one on the same piece knocks it off (to
 * "floor", "vent" or "plant", landing at `land`). In his first minute it only ever tips. Returns "tip", "off" or "".
 */
export function bump(p, sq, scale, to, land, firstMinute) {
  const spot = bumpSpot(p);
  if (!spot) return "";
  if (firstMinute || !p.tip || p.tip.spot !== spot) {
    p.tip = { spot, a: PIECE_FLY.tipAngle };
    p.tipT = 0;
    return "tip";
  }
  knockOff(p, spot, sq, scale, to, land);
  return "off";
}
/** Tips the next piece crooked (a warning) without knocking anything off. */
export function tipNext(p) {
  const spot = bumpSpot(p);
  spot && ((p.tip = { spot, a: PIECE_FLY.tipAngle }), (p.tipT = 0));
  return spot;
}
/** Knocks the piece at `spot` off: it flies from his body to `land` (the vent's grille, the floor, the plant). */
export function knockOff(p, spot, sq, scale, to, land) {
  const id = p.outfit[spot],
    s = BODY_SPOTS[spot];
  (p.lostPieces = p.lostPieces || []).push(spot);
  p.tip && p.tip.spot === spot && (p.tip = null);
  const x0 = sq.x + s.x * scale,
    y0 = sq.y + s.y * scale,
    at = to === "vent" ? HALL.vent : land || { x: sq.x + 50 * (sq.f || 1), y: sq.y + 6 };
  (p.flying = p.flying || []).push({ id, spot, x0, y0, x1: at.x, y1: at.y, k: 0, to });
}
/** Every frame: pieces in the air keep flying until they land (alarm or not). */
export function tickPieces(p, dt) {
  for (const f of p.flying || []) f.k += dt / PIECE_FLY.seconds;
  const landed = (p.flying || []).filter((f) => f.k >= 1);
  p.flying = (p.flying || []).filter((f) => f.k < 1);
  // A piece sucked into the vent is gone; one that lands on the floor or in a plant stays there.
  for (const f of landed) f.to !== "vent" && (p.fallen = p.fallen || []).push({ id: f.id, x: f.x1, y: f.y1, rot: 0.6, to: f.to });
}
/** Where each flying piece is now (for drawing): an arc from his body to where it lands, spinning. */
export function flyingNow(p) {
  return (p.flying || []).map((f) => {
    const k = Math.min(1, f.k),
      arc = f.to === "vent" ? 0 : Math.sin(k * Math.PI) * 60;
    const piece = PIECES.find((q) => q.id === f.id);
    return { id: f.id, x: f.x0 + (f.x1 - f.x0) * k, y: f.y0 + (f.y1 - f.y0) * k - arc, rot: k * 7, w: 26 * (piece && piece.h > 0.7 ? 0.8 : 1) * (f.to === "vent" ? 1 - k * 0.6 : 1) };
  });
}
