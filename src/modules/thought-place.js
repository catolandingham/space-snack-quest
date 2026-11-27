/**
 * Where a thought bubble goes (Brian, 2026-11-26, escape video 0:25), one rule everywhere: above the thinker's head with
 * a clear gap, never over the face, its trail of circles going down to the head. `head` is the box of the thinker's
 * head as drawn ({ x, y, w, h }, y its top); `size` the cloud's { w, h }. With no room above (the top of the picture),
 * it sits beside the head instead, on the side with more room, never over it. Returns the cloud's middle (cx, cy), its
 * size, and the point its trail goes down to.
 */
export const THOUGHT_PLACE = Object.freeze({ gap: 30, edge: 14 });
export function placeThought(head, size) {
  const hx = head.x + head.w / 2,
    top = head.y,
    w = size.w,
    h = size.h;
  let cx = Math.min(960 - THOUGHT_PLACE.edge - w / 2, Math.max(THOUGHT_PLACE.edge + w / 2, hx)),
    cy = top - THOUGHT_PLACE.gap - h / 2,
    beside = false;
  if (cy - h / 2 < THOUGHT_PLACE.edge) {
    beside = true;
    const right = head.x + head.w + THOUGHT_PLACE.gap + w <= 960 - THOUGHT_PLACE.edge;
    cx = right ? head.x + head.w + THOUGHT_PLACE.gap + w / 2 : head.x - THOUGHT_PLACE.gap - w / 2;
    cy = Math.max(THOUGHT_PLACE.edge + h / 2, top + head.h / 3 - h / 2);
  }
  return { cx, cy, w, h, beside, to: { x: hx, y: beside ? top + head.h * 0.2 : top - 12 } };
}
