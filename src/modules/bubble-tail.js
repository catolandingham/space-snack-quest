/**
 * Where a bubble's tail goes, and its drawing (Brian 2026-11-26, showing 7 at 0:05: "I would lean toward having
 * like a line coming from the plant... keep it thin... make it more obvious who the speaker or thinker is").
 *   - A speech bubble keeps a pointed tail, from the bubble's edge nearest the speaker to the speaker's head.
 *   - A thought bubble (Squatch thinking: his "whisper" lines) gets the classic thought trail: three small circles,
 *     thin-lined, shrinking from the bubble toward the thinker's head. Hidden in a plant, the plant is where he is,
 *     so the trail ends in its leaves.
 * The older program draws the bubble itself (src/game/60-frame-draw.js) and calls this through the bridge for its
 * tail; the target box comes from whoever places the speaker (the party: party.js speakerBox; the home wall speaker;
 * the speaker's head box; else a small box round the point the bubble points at).
 * Every tail ends inside its target box (tests/speech-voices.mjs with made-up boxes, tests/party-showing7.mjs in P3).
 */
export const TAIL = Object.freeze({
  half: 10, // half the width of a speech tail where it leaves the bubble
  inset: 3, // how far inside the target box the tail ends
  circles: Object.freeze([6, 4.5, 3]), // the thought trail's circles, bubble end first
  thoughtLine: 2, // the thought trail's outline (thin)
  edgeKeep: 24, // a tail leaves a bubble's bottom or top edge at least this far from its corners
  sideKeep: 16, // and a side edge at least this far from its corners
});

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/**
 * Where a tail leaves `bubble` ({ x, y, w, h }) and where it ends in `target` ({ x0, y0, x1, y1 }): the side of the
 * bubble that faces the target, the point on it (base), and the tip (the point of the target box nearest the base,
 * `TAIL.inset` inside it). Also the unit vectors along that side and out of the bubble.
 */
export function tailPlan(bubble, target) {
  const b = bubble,
    t = target,
    cx = (t.x0 + t.x1) / 2,
    cy = (t.y0 + t.y1) / 2,
    below = t.y0 >= b.y + b.h - 4,
    above = t.y1 <= b.y + 4;
  let side = below ? "bottom" : above ? "top" : cx > b.x + b.w ? "right" : cx < b.x ? "left" : "bottom";
  const ek = Math.min(TAIL.edgeKeep, b.w / 2),
    sk = Math.min(TAIL.sideKeep, b.h / 2);
  const base =
    side === "bottom"
      ? { x: clamp(cx, b.x + ek, b.x + b.w - ek), y: b.y + b.h }
      : side === "top"
        ? { x: clamp(cx, b.x + ek, b.x + b.w - ek), y: b.y }
        : side === "right"
          ? { x: b.x + b.w, y: clamp(cy, b.y + sk, b.y + b.h - sk) }
          : { x: b.x, y: clamp(cy, b.y + sk, b.y + b.h - sk) };
  const i = TAIL.inset,
    tip = { x: clamp(base.x, Math.min(t.x0 + i, cx), Math.max(t.x1 - i, cx)), y: clamp(base.y, Math.min(t.y0 + i, cy), Math.max(t.y1 - i, cy)) },
    out = side === "bottom" ? { x: 0, y: 1 } : side === "top" ? { x: 0, y: -1 } : side === "right" ? { x: 1, y: 0 } : { x: -1, y: 0 },
    along = { x: Math.abs(out.y), y: Math.abs(out.x) };
  return { side, base, tip, out, along };
}

/**
 * Draws the tail of the bubble already drawn at `bubble` toward `target`. `kind` is "speech" or "thought"; `fill` the
 * bubble's colour; `ink` and `lw` its outline. Returns what it drew: { kind, side, tip, end (the last point drawn,
 * inside the target), circles }.
 */
export function drawBubbleTail(ctx, bubble, target, kind, fill, ink, lw) {
  if (!ctx || !bubble || !target) return null;
  const pl = tailPlan(bubble, target),
    { base, tip, out, along } = pl;
  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.setLineDash([]);
  if (kind === "thought") {
    // three circles from just outside the bubble to the thinker; the last one sits on his head (or the plant)
    const r = TAIL.circles,
      start = { x: base.x + out.x * (r[0] + 4), y: base.y + out.y * (r[0] + 4) },
      circles = r.map((rad, k) => ({ x: start.x + ((tip.x - start.x) * k) / (r.length - 1), y: start.y + ((tip.y - start.y) * k) / (r.length - 1), r: rad }));
    for (const c of circles) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.lineWidth = TAIL.thoughtLine;
      ctx.strokeStyle = ink;
      ctx.stroke();
    }
    ctx.restore();
    const last = circles[circles.length - 1];
    return { kind, side: pl.side, tip, end: { x: last.x, y: last.y }, circles };
  }
  // a pointed tail: a thin wedge from the bubble's edge to the tip
  const h = TAIL.half,
    a = { x: base.x - along.x * h, y: base.y - along.y * h },
    b = { x: base.x + along.x * h, y: base.y + along.y * h };
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(tip.x, tip.y);
  ctx.lineTo(b.x, b.y);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = lw;
  ctx.strokeStyle = ink;
  ctx.stroke();
  // over the seam: the bubble's own outline between the wedge's two sides is covered, so the tail opens into it
  const k = h - lw * 0.7,
    inn = lw + 1.5,
    o = 1.5;
  ctx.beginPath();
  ctx.moveTo(base.x - along.x * k - out.x * inn, base.y - along.y * k - out.y * inn);
  ctx.lineTo(base.x + along.x * k - out.x * inn, base.y + along.y * k - out.y * inn);
  ctx.lineTo(base.x + along.x * k * 0.8 + out.x * o, base.y + along.y * k * 0.8 + out.y * o);
  ctx.lineTo(base.x - along.x * k * 0.8 + out.x * o, base.y - along.y * k * 0.8 + out.y * o);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  return { kind, side: pl.side, tip, end: tip, circles: [] };
}
