/**
 * A thought bubble sized to what is in it (Brian, 2026-11-26, video note 0:11: "The thought bubble is smaller than the
 * drawing"): a white cloud clearly bigger than the drawing inside it, with a margin all round, and the classic thought
 * trail, three small circles shrinking down to the thinker's head (phase-3 notes 0:11 and 0:05: "a line coming from
 * the plant... keep it thin... make it more obvious who the speaker or thinker is"). The home morning's two thought
 * bubbles use it (home-morning-art.js: the crayon Guardians and the Guardian Box). No words.
 *
 * The cloud is an oval of puffs. The drawing's box (content w x h plus THOUGHT.margin on every side) fits inside the
 * oval's inner edge (where the puffs dip in), so no corner of the drawing reaches the cloud's edge.
 */
export const THOUGHT = Object.freeze({
  margin: 16, // game pixels of white between the drawing's box and the cloud's inner edge, at the least
  puffs: 11,
  dip: 10, // how far in from the cloud's size the puffs dip
  bulge: 6, // how far out the puffs bulge
  line: 3.5,
  // the trail: three circles from the cloud down to the head, each smaller (radius, and where along the way: 0 at the
  // cloud, 1 at the head)
  trail: Object.freeze([
    Object.freeze({ r: 11, at: 0.22 }),
    Object.freeze({ r: 7.5, at: 0.56 }),
    Object.freeze({ r: 4.5, at: 0.86 }),
  ]),
  gapOverHead: 30, // game pixels between the top of his head and the cloud's bottom (room for the trail)
});
const TB_INK = "#1e2430";

/** The cloud's size (w, h) for a drawing w x h: its inner oval holds the drawing's box plus the margin. */
export function thoughtCloudSize(content) {
  const T = THOUGHT,
    iw = content.w + 2 * T.margin,
    ih = content.h + 2 * T.margin;
  // a rectangle W x H fits inside the oval with half-axes a, b when a = W / sqrt 2 and b = H / sqrt 2
  return { w: Math.ceil(iw * Math.SQRT2 + 2 * T.dip), h: Math.ceil(ih * Math.SQRT2 + 2 * T.dip) };
}

/**
 * Draws the bubble over `head` (the top of the thinker's head, game positions): the cloud above and a little to the
 * right of him, kept on the picture, the trail down to his head, then `inside(ctx, cx, cy)` at the cloud's middle.
 * `a` fades it in (0 to 1). Returns the cloud's box, the drawing's box, the inner oval and the trail (tests).
 */
export function drawThoughtCloud(ctx, head, a, content, inside) {
  const T = THOUGHT,
    { w, h } = thoughtCloudSize(content),
    cx = Math.min(950 - w / 2, Math.max(10 + w / 2, head.x + 60)),
    cy = Math.max(8 + h / 2, head.y - T.gapOverHead - h / 2);
  ctx.save();
  ctx.globalAlpha = a;
  ctx.beginPath();
  for (let i = 0; i <= T.puffs; i++) {
    const q = (i / T.puffs) * Math.PI * 2,
      px = cx + Math.cos(q) * (w / 2 - T.dip),
      py = cy + Math.sin(q) * (h / 2 - T.dip);
    if (i === 0) ctx.moveTo(px, py);
    else {
      const m = ((i - 0.5) / T.puffs) * Math.PI * 2;
      ctx.quadraticCurveTo(cx + Math.cos(m) * (w / 2 + T.bulge), cy + Math.sin(m) * (h / 2 + T.bulge), px, py);
    }
  }
  ctx.closePath();
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.lineWidth = T.line;
  ctx.strokeStyle = TB_INK;
  ctx.lineJoin = "round";
  ctx.stroke();
  // the trail starts at the cloud's lower edge, on the line from its middle to his head
  const dx = head.x - cx,
    dy = head.y - cy,
    len = Math.hypot(dx, dy) || 1,
    // where that line leaves the oval (its inner edge)
    k = 1 / Math.sqrt((dx / len / (w / 2 - T.dip)) ** 2 + (dy / len / (h / 2 - T.dip)) ** 2),
    from = { x: cx + (dx / len) * k, y: cy + (dy / len) * k },
    to = { x: head.x, y: head.y - 6 };
  const trail = T.trail.map(({ r, at }) => {
    const x = from.x + (to.x - from.x) * at,
      y = from.y + (to.y - from.y) * at;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.stroke();
    return { x: Math.round(x), y: Math.round(y), r };
  });
  inside && inside(ctx, cx, cy);
  ctx.restore();
  return {
    box: { x0: cx - w / 2 - T.bulge, y0: cy - h / 2 - T.bulge, x1: cx + w / 2 + T.bulge, y1: cy + h / 2 + T.bulge },
    content: { x0: cx - content.w / 2, x1: cx + content.w / 2, y0: cy - content.h / 2, y1: cy + content.h / 2 },
    oval: { cx, cy, rx: w / 2 - T.dip, ry: h / 2 - T.dip },
    trail,
    head: { x: head.x, y: head.y },
  };
}
