/**
 * Mops falling asleep and asleep on the floor at bedtime (Brian, 2026-11-26, #33: "Let's have him fall asleep standing
 * and then tip over onto his side and sleep upside down with his feet in the air", like a fainting goat). A placeholder:
 * Mops is the room's own drawing (the older program's Fe, through the drawMopsOn hand-over), never redrawn here, only
 * turned round the middle of his body with canvas transforms and set down so his lowest point rests on the floor:
 *   turn 0     standing (as the room draws him)
 *   turn 0.5   tipped over onto his side, stiff legs straight out sideways (he sleeps a little past this: MOPS_SLEEP)
 *   turn 1     on his back, his four feet in the air (not used since 2026-11-27, question 127)
 * The bedtime story (bedtime-story.js) draws him with this from the moment his eyes droop until the fade to black. The
 * morning after (feat/ch1-day2-morning) can draw him still asleep the same way (MOPS_ASLEEP: where and how), until he
 * gets up after the PA.
 */

// Points round the outside of his drawing, in his own units (feet at 0, 0, facing right; the older program's Fe): his
// hooves, his body and tail, his beard's end, and his head, ears and horns (these move down by headDrop).
const HULL = Object.freeze({
  body: Object.freeze([
    [-14, 0], [-8, 0], [8, 0], [14, 0],
    [-21, -17], [-19, -25], [-12, -27], [0, -28], [12, -27], [-23, -28], [-21, -9], [0, -7], [15, -9],
    [14, 0], [22, 0],
  ]),
  head: Object.freeze([
    [10, -29], [17, -38], [26, -30], [28, -26], [24, -21], [5, -44], [2, -42], [27, -45], [30, -43], [3, -31], [30, -31],
  ]),
});
// The middle of his body, in his units: he turns round it.
const MIDDLE = -17;

/**
 * How far round Mops ends up asleep, everywhere he sleeps (Day 1's bedtime, the morning after, the evening of Day 2 and
 * night one): tipped over onto his side, a little past flat, and no further (Brian, 2026-11-27, video note r5 8:24:
 * "just tip over and sleep. The whole sleeping upside down thing just doesn't work"; question 127, the pick A, a
 * placeholder pose until he answers). `side` is the stiff fall onto his side; `turn` where he settles.
 * q: 127. Option B (as built before: he rolls on onto his back, feet in the air): turn: 1.
 */
export const MOPS_SLEEP = Object.freeze({ side: 0.5, turn: 0.58 });
/**
 * Where Mops lies asleep after the bedtime story (game positions: his feet before he tips, left of his mop bucket, so
 * that tipped over his head comes down on the bucket's rim; the same place as in the evening of Day 2,
 * evening-place.js mopsSleepAt) and how he is drawn there (eyes closed).
 */
export const MOPS_ASLEEP = Object.freeze({ x: 492, floor: 584, f: -1, turn: MOPS_SLEEP.turn, headDrop: 12 });
/**
 * Where his head is, turned (game position): the middle of his head in his own units is (17, -29) facing right
 * (evening-art.js measured it), turned with him round his middle.
 */
export function mopsTurnedHead(x, floor, scale, f, turn, headDrop = 0) {
  const T = mopsTurnedBox(x, floor, scale, f, turn, headDrop),
    dx = 17 * f * scale,
    dy = (-29 + headDrop - MIDDLE) * scale;
  return { x: x + dx * Math.cos(T.a) - dy * Math.sin(T.a), y: T.mid + dx * Math.sin(T.a) + dy * Math.cos(T.a) };
}

/**
 * Where his drawing's points land for `turn` (0 standing, 1 on his back), turned clockwise as seen, with his lowest
 * point on `floor`. Returns the offset to draw him at (dy: how far his feet's line moves) and his box.
 */
export function mopsTurnedBox(x, floor, scale, f, turn, headDrop = 0) {
  const a = turn * Math.PI,
    c = Math.cos(a),
    s = Math.sin(a),
    pts = [...HULL.body.map(([u, v]) => [u, v]), ...HULL.head.map(([u, v]) => [u, v + headDrop])].map(([u, v]) => {
      const dx = u * f * scale,
        dy = (v - MIDDLE) * scale;
      return [dx * c - dy * s, dx * s + dy * c];
    });
  const low = Math.max(...pts.map((p) => p[1])),
    mid = floor - low; // where the middle of his body goes
  const xs = pts.map((p) => x + p[0]),
    ys = pts.map((p) => mid + p[1]);
  return { mid, a, box: { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) } };
}

/**
 * Draws Mops at (x, floor), `scale` his room scale, facing `f`, turned by `turn` (0 to 1), with options for the room's
 * drawing (eyes, headDrop). `jitter` shakes him sideways a little (going stiff). Returns his box (game positions).
 */
export function drawMopsTurned(ctx, engine, { x, floor, scale, f = -1, turn = 0, eyes = "", headDrop = 0, jitter = 0 }) {
  if (!engine || !engine.drawMopsOn) return null;
  const T = mopsTurnedBox(x, floor, scale, f, turn, headDrop),
    lying = turn >= MOPS_SLEEP.side - 0.01;
  // his shadow on the floor: under his feet while he stands, the length of his body once he lies on his side (round 8
  // final art, pending Brian's yes: the rooms' flat shadow, the ink at a low alpha)
  ctx.save();
  ctx.beginPath();
  lying
    ? ctx.ellipse((T.box.x0 + T.box.x1) / 2, floor + 1, (T.box.x1 - T.box.x0) / 2 + 2 * scale, 3.5 * scale, 0, 0, Math.PI * 2)
    : ctx.ellipse(x, floor + 1, Math.max(22 * scale, (T.box.x1 - T.box.x0) / 2), 3.5 * scale, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(34,36,44,.16)";
  ctx.fill();
  ctx.translate(x + jitter, T.mid);
  ctx.rotate(T.a);
  // asleep, he breathes: his body rises and falls a little, slowly (the drawing itself is the room's own Mops)
  if (lying && eyes === "closed" && typeof performance !== "undefined") {
    const b = 1 + 0.018 * Math.sin(performance.now() / 1000 * 2.1);
    ctx.scale(1, b);
  }
  // (the room's drawing puts his feet at y 0: his middle is MIDDLE units above them)
  engine.drawMopsOn(ctx, 0, -MIDDLE * scale, scale, { f, walk: 0, mop: false, eyes, headDrop });
  ctx.restore();
  return { x0: Math.round(T.box.x0), x1: Math.round(T.box.x1), y0: Math.round(T.box.y0), y1: Math.round(T.box.y1), turn: +turn.toFixed(2), scale: +scale.toFixed(2) };
}
