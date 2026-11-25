/**
 * Squatch drawn big, for close-ups (the homework cutaway). The engine's own Squatch drawing (Re in
 * src/game/60-frame-draw.js) scales its outlines with him, so at close-up size they come out thick and heavy;
 * the beard close-up met the same problem with Mops (cutaway.js, "Mops in the close-up"). This file draws the
 * same Squatch, from the same shapes, sizes and colours, with outlines as thin as the room's Squatch has at
 * his usual size (Brian, 2026-11-23, 14A). He stands facing us, arms at rest, as the room draws him. The bed
 * flop (home-alone.js) uses it too, at the room's size and outline, turned on his side.
 * tests/home-alone.mjs checks the colours here against the engine's (SQUATCH_LOOK and m5) and the outline width.
 */
export const SQUATCH_LOOK = Object.freeze({
  fur: "#6b4428",
  dark: "#55351f",
  mask: "#f4c39a",
  ear: "#d98c62",
  head: 15,
  bodyW: 11.5,
  bodyH: 14,
  arm: 12,
  leg: 7,
  amp: 2.2,
});
const INK = "#1e2430";
// In the engine the outline is 2 of his units, the face mask's 1.5 and the eyes' and mouth's 1.1: here the
// mask's and the smile's lines are the same fractions of the outline.
const MASK_LINE = 1.5 / 2,
  FACE_LINE = 1.1 / 2;

// His arms at rest (the angle from straight down, as the engine has it): the far one, then the near one.
const REST_ARMS = Object.freeze([{ a: -0.35 }, { a: 0.35 }]);
/**
 * Where his two arms are, in his own units (feet at 0, up is negative): the far arm, then the near arm, each
 * { shoulder, elbow, hand }. `arms` is [far, near], each { a, bend }: `a` is the arm's angle from straight down
 * (0.35 hangs at rest; half a turn points straight up), and `bend` turns the forearm at the elbow (0 or left out:
 * a straight arm). With no `arms`, he stands with both at rest. One pair of arms is all he ever has: a pose's
 * arms are drawn in place of the rest arms, never over them (Brian 2026-11-24: "two sets of arms").
 */
export function armEnds(arms) {
  const q = SQUATCH_LOOK,
    sh = -q.leg - q.bodyH + 3;
  return (arms || REST_ARMS).map((arm, i) => {
    const sx = i === 0 ? -q.bodyW + 1 : q.bodyW - 1,
      bent = !!arm.bend,
      upper = bent ? q.arm / 2 : q.arm,
      elbow = { x: sx + Math.sin(arm.a) * upper, y: sh + Math.cos(arm.a) * upper },
      fa = arm.a + (arm.bend || 0),
      hand = bent ? { x: elbow.x + Math.sin(fa) * (q.arm / 2), y: elbow.y + Math.cos(fa) * (q.arm / 2) } : elbow;
    return { shoulder: { x: sx, y: sh }, elbow, hand };
  });
}

/**
 * Draws Squatch with his feet at (x, y), `scale` game pixels to one of his units, facing us. `line` is his
 * outline in game pixels (the room's Squatch: 2 units at scale 3 = 6). `arms` poses his arms (see armEnds; left
 * out, they hang at rest). `feet: false` leaves his legs and feet out, for boots that stand where they are.
 * Returns where his near paw is and his mouth (game positions) and the outline drawn, for props and tests.
 */
export function drawSquatchArt(ctx, x, y, scale, { line = 4, shadow = true, arms = null, feet = true } = {}) {
  const q = SQUATCH_LOOK,
    o = line / scale; // outline in his units
  const T = q.leg,
    R = q.bodyH,
    P = -T - R - q.head * 0.75;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.lineJoin = "round";
  // A wavy furry outline round an ellipse (the engine's XV).
  const fuzzy = (cx, cy, rx, ry, n, amp, start) => {
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const a = start + (i / n) * Math.PI * 2,
        px = cx + Math.cos(a) * rx,
        py = cy + Math.sin(a) * ry;
      if (i === 0) {
        ctx.moveTo(px, py);
        continue;
      }
      const m = start + ((i - 0.5) / n) * Math.PI * 2;
      ctx.quadraticCurveTo(cx + Math.cos(m) * (rx + amp * 1.6), cy + Math.sin(m) * (ry + amp * 1.6), px, py);
    }
    ctx.closePath();
  };
  const fill = (color, width) => {
    ctx.fillStyle = color;
    ctx.fill();
    if (width) {
      ctx.lineWidth = width;
      ctx.strokeStyle = INK;
      ctx.stroke();
    }
  };
  // A limb: a thick round-ended line with an outline (the engine's St).
  const limb = (x0, y0, x1, y1, w, color) => {
    ctx.lineCap = "round";
    ctx.strokeStyle = INK;
    ctx.lineWidth = w + o * 2;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  };
  const dot = (cx, cy, r, color) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  };
  // Shadow (not when he lies down: it would stand on end) and legs.
  if (shadow) {
    ctx.beginPath();
    ctx.ellipse(0, 1, q.bodyW + 5, 3, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(30,36,48,.15)";
    ctx.fill();
  }
  if (feet) {
    limb(-3, -T, -3, 0, 4.2, q.dark);
    limb(3, -T, 3, 0, 4.2, q.dark);
    dot(-2.5, 0, 2.4, q.mask);
    dot(3.5, 0, 2.4, q.mask);
  }
  // Far arm, body, near arm: at rest, or in the pose given (one pair, never both).
  const [farArm, nearArm] = armEnds(arms);
  // An arm: one thick round-ended line through the elbow (so a bent arm has no seam there), then the paw.
  const arm = (a, color) => {
    ctx.lineCap = "round";
    for (const [w, c] of [
      [3.6 + o * 2, INK],
      [3.6, color],
    ]) {
      ctx.strokeStyle = c;
      ctx.lineWidth = w;
      ctx.beginPath();
      ctx.moveTo(a.shoulder.x, a.shoulder.y);
      ctx.lineTo(a.elbow.x, a.elbow.y);
      ctx.lineTo(a.hand.x, a.hand.y);
      ctx.stroke();
    }
    dot(a.hand.x, a.hand.y, 2.2, q.mask);
  };
  arm(farArm, q.dark);
  fuzzy(0, -T - R / 2, q.bodyW, R / 2 + 1, 11, q.amp * 0.8, 0.3);
  fill(q.fur, o);
  const nx = nearArm.hand.x,
    ny = nearArm.hand.y;
  arm(nearArm, q.fur);
  // Ears, head, face mask, eyes, smile.
  for (const ex of [-q.head * 0.95, q.head * 0.95]) {
    ctx.beginPath();
    ctx.arc(ex, P + 1, 3.4, 0, Math.PI * 2);
    fill(q.ear, o);
  }
  fuzzy(0, P, q.head * 0.92, q.head * 0.85, 14, q.amp, -Math.PI / 2);
  fill(q.fur, o);
  const mx = 0,
    my = P + q.head * 0.18,
    mw = q.head * 1.25,
    mh = q.head * 1.05;
  ctx.beginPath();
  ctx.moveTo(mx, my - mh * 0.28);
  ctx.bezierCurveTo(mx - mw * 0.15, my - mh * 0.62, mx - mw * 0.62, my - mh * 0.55, mx - mw * 0.5, my - mh * 0.05);
  ctx.bezierCurveTo(mx - mw * 0.45, my + mh * 0.4, mx - mw * 0.2, my + mh * 0.52, mx, my + mh * 0.52);
  ctx.bezierCurveTo(mx + mw * 0.2, my + mh * 0.52, mx + mw * 0.45, my + mh * 0.4, mx + mw * 0.5, my - mh * 0.05);
  ctx.bezierCurveTo(mx + mw * 0.62, my - mh * 0.55, mx + mw * 0.15, my - mh * 0.62, mx, my - mh * 0.28);
  ctx.closePath();
  fill(q.mask, o * MASK_LINE);
  dot(-q.head * 0.27, P + q.head * 0.12, 1.5, INK);
  dot(q.head * 0.27, P + q.head * 0.12, 1.5, INK);
  ctx.beginPath();
  ctx.arc(0, P + q.head * 0.38, 2.2, 0.2, Math.PI - 0.2);
  ctx.strokeStyle = INK;
  ctx.lineWidth = o * FACE_LINE;
  ctx.stroke();
  ctx.restore();
  return {
    paw: { x: x + nx * scale, y: y + ny * scale },
    mouth: { x, y: y + (P + q.head * 0.38) * scale },
    outline: line,
    // The face mask's and the smile's line, in game pixels (at the room's size: 1.5 and 1.1 of his units).
    lines: { mask: o * MASK_LINE * scale, face: o * FACE_LINE * scale },
    box: { x0: x - (q.head * 0.95 + 3.4 + o) * scale, x1: x + (q.head * 0.95 + 3.4 + o) * scale, y0: y + (P - q.head * 0.85 - q.amp * 1.6) * scale, y1: y + 4 * scale },
  };
}
