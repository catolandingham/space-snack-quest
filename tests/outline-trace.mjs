/**
 * The outline tracer (src/modules/outline.js) on a made-up picture, without a browser: a dark-edged square
 * with a gap in its edge, on a two-colour wall and floor. The dashed line must sit just outside the square
 * (never on it or inside it), go all the way round (the gap is closed), and be dashed (not solid).
 *   node tests/outline-trace.mjs
 */
import { traceOutline, thingMask, OUTLINE } from "../src/modules/outline.js";

let failed = 0;
const check = (label, ok, detail) => {
  console.log(`${ok ? "PASS" : "FAIL"} ${label}${ok || detail === undefined ? "" : " " + JSON.stringify(detail)}`);
  ok || failed++;
};

const w = 120, h = 100;
const rgba = new Uint8ClampedArray(w * h * 4);
const put = (x, y, c) => rgba.set([...c, 255], (y * w + x) * 4);
for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) put(x, y, y < 40 ? [245, 242, 235] : [232, 226, 214]); // wall, floor
// A square from (40,30) to (80,70): dark edge 2 px, filled with the floor colour inside, and a 3 px gap in its top edge.
for (let y = 30; y < 70; y++)
  for (let x = 40; x < 80; x++) {
    const edge = x < 42 || x >= 78 || y < 32 || y >= 68;
    const gap = y < 32 && x >= 58 && x < 61;
    if (edge && !gap) put(x, y, [30, 36, 48]);
  }

const thing = thingMask(rgba, w, h);
const inside = (x, y) => x >= 40 && x < 80 && y >= 30 && y < 70;
check("the whole square counts as the thing, its middle included (the gap is closed)", thing[50 * w + 60] === 1 && thing[31 * w + 59] === 1);
check("the wall and floor around it are not the thing", thing[5 * w + 5] === 0 && thing[95 * w + 115] === 0);

const line = traceOutline(rgba, w, h);
let onOrIn = 0, total = 0, far = 0;
const sides = { top: 0, bottom: 0, left: 0, right: 0 };
for (let y = 0; y < h; y++)
  for (let x = 0; x < w; x++) {
    if (!line[y * w + x]) continue;
    total++;
    if (inside(x, y)) onOrIn++;
    const d = Math.max(40 - x, x - 79, 30 - y, y - 69);
    if (d > OUTLINE.gap + OUTLINE.width + 6) far++;
    if (y < 30) sides.top++;
    if (y >= 70) sides.bottom++;
    if (x < 40) sides.left++;
    if (x >= 80) sides.right++;
  }
check("the line is drawn", total > 100, total);
check("no part of the line is on or inside the square", onOrIn === 0, onOrIn);
check("the line stays close to the square (just outside it)", far === 0, far);
check("the line goes round all four sides", Object.values(sides).every((v) => v > 10), sides);
// Dashed: along the top side, the row through the line has both drawn and empty runs.
let row = 0;
for (let y = 0, best = -1; y < 30; y++) {
  let c = 0;
  for (let x = 40; x < 80; x++) c += line[y * w + x];
  c > best && ((best = c), (row = y));
}
let runs = 0;
for (let x = 41; x < 80; x++) if (!!line[row * w + x] !== !!line[row * w + x - 1]) runs++;
check("the line is dashed, not solid", runs >= 4, runs);

if (failed) {
  console.error(`Failed: ${failed} checks`);
  process.exit(1);
}
console.log("outline-trace checks passed");
