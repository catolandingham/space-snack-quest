/**
 * P5, the dress-up (party plan P5; Brian 2026-11-23: "let's try to have them snap but be okay with absurdist
 * results, for instance, pants on the head"; G 603 and S 996). Full screen: the whole phone screen, with the
 * stick and the action button hidden (fullscreen.js). The open closet on the left holds eight pieces as big real
 * things on its shelves, no round buttons and no labels; Squatch stands big on white on the right.
 *   - Drag a piece and drop it: it snaps to the body spot (head, face, body, legs) nearest where it was dropped,
 *     sized to fit, whatever it is (boots dropped by his head go on his head). Dropped on the closet, it goes back.
 *   - A new piece on a taken spot sends the old one back to the closet.
 *   - Each covered spot fills a quarter of the "Disguised enough" meter. No timer, no fail, no SHUFFLE.
 *   - The party shirt must be on his body (Brian 2026-11-26, showing 7 at 1:05: "he probably has to put on the shirt
 *     or it's not disguised enough, and then it's a combo of everything else"). Until it is, the meter stops at three
 *     quarters and the shirt glows, wherever it is. Before, any four pieces on the four spots filled it.
 *   - Meter full (all four spots covered, the shirt on his body): a ta-da hop, and one big GO · party button under
 *     him (never on him).
 * The layout works for any screen: `layout(w, h)` places everything in screen pixels.
 */
import { partyLine } from "./party-lines.js";
import { drawSquatchArt } from "./squatch-art.js";
import { PIECES, BODY_SPOTS, drawPiece, drawOutfit, words, INK } from "./party-art.js";

export const SPOT_NAMES = Object.freeze(["head", "face", "body", "legs"]);

/** Where everything sits on a `w` x `h` screen (pixels). */
export function layout(w, h) {
  const portrait = h > w,
    top = Math.round(h * (portrait ? 0.13 : 0.15)),
    closet = { x0: Math.round(w * 0.02), x1: Math.round(w * (portrait ? 0.42 : 0.44)), y0: top, y1: Math.round(h * (portrait ? 0.84 : 0.94)) },
    right = { x0: closet.x1 + w * 0.01, x1: w * 0.99 },
    scale = Math.min((right.x1 - right.x0) / 40, (h * (portrait ? 0.42 : 0.62)) / 60),
    sq = { x: (right.x0 + right.x1) / 2, y: top + (portrait ? h * 0.52 : h * 0.68), scale },
    cols = 2,
    rows = 4,
    pad = (closet.x1 - closet.x0) * 0.08,
    cw = (closet.x1 - closet.x0 - pad * 2) / cols,
    ch = (closet.y1 - closet.y0 - pad * 2) / rows,
    slots = PIECES.map((p, i) => ({ id: p.id, x: closet.x0 + pad + cw * (i % cols) + cw / 2, y: closet.y0 + pad + ch * Math.floor(i / cols) + ch / 2, w: Math.min(cw * 0.78, (ch * 0.78) / p.h) })),
    go = { w: Math.min(w * 0.42, 260), h: Math.max(56, h * 0.07) };
  go.x = sq.x - go.w / 2;
  go.y = Math.min(h - go.h - h * 0.025, sq.y + scale * 6);
  const meter = { x0: w * 0.2, x1: w * 0.8, y: Math.round(h * (portrait ? 0.085 : 0.095)), title: Math.round(h * (portrait ? 0.04 : 0.045)) };
  return { w, h, portrait, closet, sq, slots, go, meter };
}

/** Screen position of a body spot (its middle) on the big Squatch. */
export function spotAt(L, spot) {
  const s = BODY_SPOTS[spot];
  return { x: L.sq.x + s.x * L.sq.scale, y: L.sq.y + s.y * L.sq.scale };
}
/** The body spot nearest (x, y). */
export function nearestSpot(L, x, y) {
  let best = SPOT_NAMES[0],
    d = Infinity;
  for (const s of SPOT_NAMES) {
    const p = spotAt(L, s),
      k = Math.hypot(p.x - x, p.y - y);
    k < d && ((d = k), (best = s));
  }
  return best;
}

/** A fresh dress-up: nothing on. */
export function newOutfit() {
  return { head: "", face: "", body: "", legs: "" };
}
/** The piece every disguise needs, and where (Brian 2026-11-26: "he probably has to put on the shirt"). */
export const MUST_WEAR = Object.freeze({ id: "shirt", spot: "body" });
/** True once the shirt is on his body. */
export function shirtOn(outfit) {
  return outfit[MUST_WEAR.spot] === MUST_WEAR.id;
}
/**
 * How full the "Disguised enough" meter is, 0 to 1: a quarter for each covered spot, but never full without the
 * shirt on his body (three quarters at most until then).
 */
export function meter(outfit) {
  const k = SPOT_NAMES.filter((s) => outfit[s]).length / 4;
  return shirtOn(outfit) ? k : Math.min(k, 0.75);
}
/** Puts `id` on `spot`; whatever was there goes back to the closet (and the piece leaves any other spot). */
export function wear(outfit, id, spot) {
  for (const s of SPOT_NAMES) outfit[s] === id && (outfit[s] = "");
  outfit[spot] = id;
  return outfit;
}
/** True when the piece is on him (not in the closet). */
export function worn(outfit, id) {
  return SPOT_NAMES.some((s) => outfit[s] === id);
}

/**
 * The dress-up's pointer: "down" picks up the piece under the finger (from the closet or off Squatch), "move"
 * drags it, "up" drops it. `st` is { outfit, drag: { id, x, y } | null, pop: { spot, t } }. Returns "go" when the
 * GO · party button is pressed with the meter full.
 */
export function pointer(st, L, kind, x, y) {
  if (kind === "down") {
    if (meter(st.outfit) >= 1 && x > L.go.x && x < L.go.x + L.go.w && y > L.go.y && y < L.go.y + L.go.h) return "go";
    const inCloset = L.slots.find((s) => !worn(st.outfit, s.id) && Math.abs(x - s.x) < s.w * 0.6 && Math.abs(y - s.y) < s.w * 0.6);
    if (inCloset) return void (st.drag = { id: inCloset.id, x, y, from: "" });
    // a piece already on him can be pulled off again
    const on = SPOT_NAMES.find((s) => {
      if (!st.outfit[s]) return false;
      const p = spotAt(L, s);
      return Math.hypot(p.x - x, p.y - y) < BODY_SPOTS[s].w * L.sq.scale * 0.6;
    });
    if (on) {
      st.drag = { id: st.outfit[on], x, y, from: on };
      st.outfit[on] = "";
    }
    return;
  }
  if (!st.drag) return;
  st.drag.x = x;
  st.drag.y = y;
  if (kind !== "up") return;
  const c = L.closet,
    id = st.drag.id;
  st.drag = null;
  // dropped on the closet: back on its shelf
  if (x > c.x0 && x < c.x1 && y > c.y0 && y < c.y1) return "back";
  const spot = nearestSpot(L, x, y);
  wear(st.outfit, id, spot);
  st.pop = { spot, t: 0.35 };
  return "wear";
}

/** Draws the whole dress-up screen. `t` is the clock; `tada` (0 to 1) the hop when the meter fills. */
export function draw(ctx, L, st, t, tada = 0) {
  const { w, h, closet: c } = L;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  // the meter
  const m = L.meter,
    full = meter(st.outfit);
  words(ctx, partyLine("meter-disguised"), w / 2, m.title, Math.max(20, Math.round(h * 0.03)), INK);
  ctx.beginPath();
  ctx.roundRect(m.x0, m.y - 9, m.x1 - m.x0, 18, 9);
  ctx.fillStyle = "#e6e0d4";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = INK;
  ctx.stroke();
  if (full > 0) {
    ctx.beginPath();
    ctx.roundRect(m.x0 + 3, m.y - 6, (m.x1 - m.x0 - 6) * full, 12, 6);
    ctx.fillStyle = full >= 1 ? "#2bc48a" : "#3478f6";
    ctx.fill();
  }
  // the open closet: a wooden frame, both doors swung open, shelves, the pieces on them
  const dw = (c.x1 - c.x0) * 0.12;
  ctx.fillStyle = "#c98f5a";
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  for (const [x0, x1] of [
    [c.x0 - dw * 0.2, c.x0 + dw * 0.6],
    [c.x1 - dw * 0.6, c.x1 + dw * 0.2],
  ]) {
    ctx.beginPath();
    ctx.roundRect(x0, c.y0 + 6, x1 - x0, c.y1 - c.y0 - 12, 4);
    ctx.fill();
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.roundRect(c.x0 + dw * 0.6, c.y0, c.x1 - c.x0 - dw * 1.2, c.y1 - c.y0, 6);
  ctx.fillStyle = "#f3e3c8";
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.stroke();
  for (let r = 1; r <= 4; r++) {
    const y = c.y0 + ((c.y1 - c.y0) * r) / 4.05;
    ctx.beginPath();
    ctx.moveTo(c.x0 + dw * 0.6, y);
    ctx.lineTo(c.x1 - dw * 0.6, y);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#8b5a3c";
    ctx.stroke();
  }
  // the shirt glows until it is on his body (in the closet, or on another spot of him)
  const glow = shirtOn(st.outfit) || (st.drag && st.drag.id === MUST_WEAR.id) ? 0 : 0.75 + 0.25 * Math.sin(t * 6);
  const lit = (f) => (ctx.save(), glow && ((ctx.shadowColor = `rgba(255,207,51,${glow})`), (ctx.shadowBlur = 30)), f(), ctx.restore());
  for (const s of L.slots) worn(st.outfit, s.id) || (st.drag && st.drag.id === s.id) || (s.id === MUST_WEAR.id ? lit(() => drawPiece(ctx, s.id, s.x, s.y, s.w)) : drawPiece(ctx, s.id, s.x, s.y, s.w));
  // Squatch big on white, with what he has on; a ta-da hop when he is disguised enough
  const hop = tada > 0 ? Math.sin(Math.min(1, tada) * Math.PI) * h * 0.03 : 0,
    pop = st.pop && st.pop.t > 0 ? st.pop : null;
  drawSquatchArt(ctx, L.sq.x, L.sq.y - hop, L.sq.scale, { line: Math.max(2, L.sq.scale * 0.9) });
  drawOutfit(ctx, L.sq.x, L.sq.y - hop, L.sq.scale, st.outfit, 1, pop ? { spot: pop.spot, a: Math.sin(pop.t * 30) * 0.15 } : null);
  // the shirt on him, but not on his body (on his head, say): it glows there too
  const wrongSpot = SPOT_NAMES.find((s) => s !== MUST_WEAR.spot && st.outfit[s] === MUST_WEAR.id);
  wrongSpot && glow && lit(() => drawOutfit(ctx, L.sq.x, L.sq.y - hop, L.sq.scale, { [wrongSpot]: MUST_WEAR.id }, 1, null));
  if (full >= 1) {
    // sparkles round him, and the one big GO · party button below him
    for (let i = 0; i < 6; i++) {
      const a = t * 1.5 + (i * Math.PI) / 3,
        r = L.sq.scale * 30;
      words(ctx, "✦", L.sq.x + Math.cos(a) * r, L.sq.y - L.sq.scale * 28 + Math.sin(a) * r * 0.8, Math.max(18, L.sq.scale * 5), "#ffcf33");
    }
    const g = L.go;
    ctx.beginPath();
    ctx.roundRect(g.x, g.y, g.w, g.h, g.h / 2);
    ctx.fillStyle = "#2bc48a";
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = INK;
    ctx.stroke();
    words(ctx, partyLine("button-go"), g.x + g.w / 2, g.y + g.h / 2 + 1, Math.max(22, Math.round(g.h * 0.42)), "#ffffff");
  }
  if (st.drag) {
    const p = PIECES.find((q) => q.id === st.drag.id),
      sw = L.slots.find((s) => s.id === st.drag.id).w;
    drawPiece(ctx, st.drag.id, st.drag.x, st.drag.y - sw * (p ? p.h : 0.5) * 0.6, sw * 1.05);
  }
}
