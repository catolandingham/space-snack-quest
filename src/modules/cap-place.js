/**
 * Where a "VERB · thing" label goes (Brian, 2026-11-23, on PR #84: "the places that pop up kind of overlap in
 * weird ways"). One rule for every Chapter 1 label: it sits next to the thing it names, where the thing stays
 * visible, and covers neither Squatch, nor that thing, nor another thing's box.
 *   - A spot that names its thing (`thing`, a box in game positions) gets its label just above the thing (in
 *     line with its middle, else its right edge, else its left edge), else just below it the same way, else to
 *     its left, else to its right: the first place that is on the picture and clear.
 *   - A spot without a thing keeps its own place (36 above `at`, as before) when that place is clear.
 *   - Otherwise the label goes just above Squatch's head; if even that is not clear, the old place is used.
 * The older program's drawCap (src/game/60-frame-draw.js) asks for the place; tests/home-alone.mjs checks it.
 */
const GAP = 8;
// The picture's edges a label must stay inside; the top 44 is where the HUD sits over the picture.
const EDGE = Object.freeze({ x0: 4, x1: 956, y0: 44, y1: 636 });

const hits = (a, b) => !!b && a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;

/**
 * `w`, `h`: the label's size. `at`: the old place's middle ({ x, y }). `thing`: the named thing's box or null.
 * `squatch`: Squatch's box. `avoid`: other boxes to keep clear of. Returns the label's middle { x, y } and box.
 */
export function placeLabel({ w, h, at, thing, squatch, avoid = [] }) {
  const box = (x, y) => ({ x0: x - w / 2, x1: x + w / 2, y0: y - h / 2, y1: y + h / 2 });
  const blocks = [squatch, thing, ...avoid].filter(Boolean);
  const clear = (b) => b.x0 >= EDGE.x0 && b.x1 <= EDGE.x1 && b.y0 >= EDGE.y0 && b.y1 <= EDGE.y1 && !blocks.some((o) => hits(b, o));
  const tries = [];
  if (thing) {
    const cx = Math.min(EDGE.x1 - w / 2, Math.max(EDGE.x0 + w / 2, (thing.x0 + thing.x1) / 2)),
      cy = (thing.y0 + thing.y1) / 2;
    const above = thing.y0 - GAP - h / 2,
      below = thing.y1 + GAP + h / 2,
      // Lined up with the thing's middle, its right edge or its left edge (a wide label beside a small thing).
      xs = [cx, thing.x1 - w / 2, thing.x0 + w / 2];
    for (const y of [above, below]) for (const x of xs) tries.push([x, y]);
    tries.push([thing.x0 - GAP - w / 2, cy], [thing.x1 + GAP + w / 2, cy]);
  } else tries.push([at.x, at.y]);
  if (squatch) tries.push([(squatch.x0 + squatch.x1) / 2, squatch.y0 - GAP - h / 2]);
  for (const [x, y] of tries) {
    const b = box(x, y);
    if (clear(b)) return { x, y, box: b };
  }
  return { x: at.x, y: at.y, box: box(at.x, at.y) };
}
