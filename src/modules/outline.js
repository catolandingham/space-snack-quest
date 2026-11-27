/**
 * Outlines of real things (Brian's rule, raised at least six times): the place the player must go next is
 * shown by a soft yellow dashed line just outside the thing itself, following its shape. Never a circle on
 * the floor, never an arrow ("It's just supposed to be the outline of the actual place we're supposed to
 * go" G#292; "outside of the object and dashed" G#438; "important it's in yellow" G#430).
 *
 * The shape is traced from the pixels of the thing as it is drawn (a locked room picture, or the game's
 * own drawing), so it follows the real outline of whatever is there: a pot and its leaves, a bin, a door.
 *
 *   traceOutline(rgba, w, h, opts) -> Uint8Array mask of the dashed line (1 = yellow, 0 = nothing)
 *   outlineCanvas(source, box, opts) -> { canvas, x, y } ready to draw at (x, y) in game positions
 */

// How far outside the thing the line sits, how thick it is, and how long the dashes are (game pixels).
// The one highlight style of the whole game (Brian 2026-11-26, the outline options: "A is a bit too thick, but B and E
// are too little. So we'd like a thicker dashed line. So E, but thicker, but not quite as thick as A."): this dashed
// gold line, 7.5 game pixels wide (about 3 px on a 375-wide phone; E was 4, about 1.6 px; A about 4 px), no glow.
export const OUTLINE = { gap: 1, width: 7.5, dash: 12, color: "#ffcf33", tolerance: 38 };
// The same line on a full-screen view drawn in screen pixels (the dress-up): 3 px wide, its dashes to scale.
export const OUTLINE_SCREEN = Object.freeze({ width: 3, dash: 5 });

/**
 * Sets up `ctx` to stroke the one highlight line: gold, dashed, `width` wide (OUTLINE unless `screen` is OUTLINE_SCREEN),
 * pulsing gently with the clock `t`. Call inside ctx.save()/restore(); then build a path and stroke it.
 */
export function highlightLine(ctx, t = 0, screen = null) {
  const s = screen || OUTLINE;
  ctx.globalAlpha = 0.85 + 0.15 * Math.sin((t || 0) * 4);
  ctx.setLineDash([s.dash, s.dash * 0.7]);
  ctx.lineWidth = s.width;
  ctx.strokeStyle = OUTLINE.color;
  ctx.lineCap = "butt";
  ctx.shadowBlur = 0;
}
/** The one highlight round a box (x0, y0, x1, y1) with rounded corners, `pad` outside it. */
export function highlightBox(ctx, b, t = 0, pad = 4, screen = null) {
  ctx.save();
  highlightLine(ctx, t, screen);
  ctx.beginPath();
  ctx.roundRect(b.x0 - pad, b.y0 - pad, b.x1 - b.x0 + pad * 2, b.y1 - b.y0 + pad * 2, 8);
  ctx.stroke();
  ctx.restore();
}

const near = (a, b, tol) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) <= tol;

/**
 * The thing is everything inside the box that is not the wall or floor around it. The wall and floor
 * colours are read from the box's own edge (the box must be drawn a little bigger than the thing, so its
 * edge is all background). Background that cannot be reached from the edge (a hole inside the thing) counts
 * as part of the thing, so the line goes round the outside only.
 */
export function thingMask(rgba, w, h, tolerance = OUTLINE.tolerance) {
  const at = (x, y) => {
    const i = (y * w + x) * 4;
    return [rgba[i], rgba[i + 1], rgba[i + 2]];
  };
  const edge = [];
  for (let x = 0; x < w; x++) edge.push(at(x, 0), at(x, h - 1));
  for (let y = 0; y < h; y++) edge.push(at(0, y), at(w - 1, y));
  // The few colours that make up the edge (wall, floor, the floor line between them).
  const bg = [];
  for (const c of edge) if (!bg.some((b) => near(b, c, tolerance))) bg.push(c);
  const isBg = (x, y) => {
    const c = at(x, y);
    return bg.some((b) => near(b, c, tolerance));
  };
  // Flood the background in from the edge; whatever the flood cannot reach is the thing.
  const outside = new Uint8Array(w * h);
  const stack = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const k = y * w + x;
    if (outside[k] || !isBg(x, y)) return;
    outside[k] = 1;
    stack.push(k);
  };
  for (let x = 0; x < w; x++) (push(x, 0), push(x, h - 1));
  for (let y = 0; y < h; y++) (push(0, y), push(w - 1, y));
  while (stack.length) {
    const k = stack.pop(),
      x = k % w,
      y = (k - x) / w;
    (push(x + 1, y), push(x - 1, y), push(x, y + 1), push(x, y - 1));
  }
  const rough = new Uint8Array(w * h);
  for (let k = 0; k < w * h; k++) rough[k] = outside[k] ? 0 : 1;
  // Close small gaps (a bin's rim, the space between wheels) so the line goes round the whole thing,
  // not into it: grow the thing a little, then flood the background in from the edge again.
  const closed = grow(rough, w, h, CLOSE);
  const out2 = new Uint8Array(w * h);
  for (let x = 0; x < w; x++) (fill(x, 0), fill(x, h - 1));
  for (let y = 0; y < h; y++) (fill(0, y), fill(w - 1, y));
  function fill(x0, y0) {
    const st = [[x0, y0]];
    while (st.length) {
      const [x, y] = st.pop();
      if (x < 0 || y < 0 || x >= w || y >= h) continue;
      const k = y * w + x;
      if (out2[k] || closed[k]) continue;
      out2[k] = 1;
      st.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
  }
  const thing = new Uint8Array(w * h);
  for (let k = 0; k < w * h; k++) thing[k] = out2[k] ? 0 : 1;
  return thing;
}
// How wide a gap in the thing's own drawing is closed before tracing (game pixels).
const CLOSE = 4;

// Pixels within r of the mask (a round brush), as a new mask.
function grow(mask, w, h, r) {
  r = Math.round(r); // (whole pixels: the line's width may be a half, 7.5)
  const out = new Uint8Array(w * h);
  const offs = [];
  for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (dx * dx + dy * dy <= r * r) offs.push([dx, dy]);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      if (!mask[y * w + x]) continue;
      for (const [dx, dy] of offs) {
        const X = x + dx,
          Y = y + dy;
        if (X >= 0 && Y >= 0 && X < w && Y < h) out[Y * w + X] = 1;
      }
    }
  return out;
}

/**
 * The dashed line: a band `width` thick, `gap` outside the thing, cut into dashes by the angle around the
 * thing's middle so each dash is about `dash` long along the line.
 */
export function traceOutline(rgba, w, h, opts = {}) {
  const { gap, width, dash, tolerance } = { ...OUTLINE, ...opts };
  const thing = thingMask(rgba, w, h, tolerance);
  let sx = 0,
    sy = 0,
    count = 0;
  for (let k = 0; k < w * h; k++)
    if (thing[k]) {
      sx += k % w;
      sy += Math.floor(k / w);
      count++;
    }
  const line = new Uint8Array(w * h);
  if (!count) return line;
  const cx = sx / count,
    cy = sy / count;
  const inner = grow(thing, w, h, gap),
    outer = grow(thing, w, h, gap + width);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const k = y * w + x;
      if (!outer[k] || inner[k]) continue;
      const r = Math.hypot(x - cx, y - cy) || 1,
        along = Math.atan2(y - cy, x - cx) * r;
      if (Math.floor((along + 1e4 * dash) / dash) % 2 === 0) line[k] = 1;
    }
  return line;
}

/**
 * Traces the thing inside `box` (game positions: { x0, x1, y0, y1 }) of `source`, an image or canvas drawn
 * over the whole 960 x 640 game picture (a locked room picture of any size is scaled to that). The box is
 * padded so the line fits outside the thing. Returns a canvas to draw at (x, y), or null without a document.
 */
export function outlineCanvas(source, box, opts = {}) {
  if (typeof document === "undefined") return null;
  const { gap, width, color } = { ...OUTLINE, ...opts };
  const pad = Math.ceil(gap + width) + 2;
  const x = Math.floor(box.x0) - pad,
    y = Math.floor(box.y0) - pad,
    w = Math.ceil(box.x1 - box.x0) + 2 * pad,
    h = Math.ceil(box.y1 - box.y0) + 2 * pad;
  const sw = source.naturalWidth || source.width,
    sh = source.naturalHeight || source.height;
  const cut = document.createElement("canvas");
  cut.width = w;
  cut.height = h;
  const cx = cut.getContext("2d", { willReadFrequently: true });
  // Copy the box (in game positions) out of the source at game scale.
  cx.drawImage(source, (x * sw) / 960, (y * sh) / 640, (w * sw) / 960, (h * sh) / 640, 0, 0, w, h);
  // The edge of the padded copy must be background; the padding is filled from the box's own edge row.
  const rgba = cx.getImageData(0, 0, w, h).data;
  const line = traceOutline(rgba, w, h, opts);
  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const ox = out.getContext("2d");
  const img = ox.createImageData(w, h);
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16));
  for (let k = 0; k < w * h; k++)
    if (line[k]) {
      img.data[k * 4] = r;
      img.data[k * 4 + 1] = g;
      img.data[k * 4 + 2] = b;
      img.data[k * 4 + 3] = 255;
    }
  ox.putImageData(img, 0, 0);
  return { canvas: out, x, y };
}
