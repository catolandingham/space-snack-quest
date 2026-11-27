/**
 * Beats 44a and 44b (story pass 2026-11-26): the player is Mops, mopping the loading bay by day with his beard, then
 * the Mop-Off against the robots (Brian, question 7: "clean better", not faster).
 *   44a  cart tracks cross the floor with dirty patches on them; his beard passing over a patch leaves it white and
 *        sparkling. About ten calm seconds.
 *   44b  a robot paints a line: ROBOT SIDE on the left, GOAT SIDE on the right. The robots do their side in straight
 *        lines in 15 seconds, leaving grey streaks, missing every corner, knocking a stack of boxes over, then chant
 *        "DONE." The player mops the goat side's cells (sticky ones need two passes; the corners count) for up to 45
 *        seconds. Once, a robot rolls its dirty wheels across the clean part. Two bars on the back wall: FAST (the
 *        robots' full at once; his creeps) and SPARKLE (his climbs; theirs stays low). The buzzer, the robots' lines,
 *        and a gold star on his GANITOR tag that stays for the rest of the chapter: GOOD, GREAT or STAR GANITOR by how
 *        much of his side sparkles.
 * The logic is plain functions over a state object (kept in the escape's ch1Escape field); the drawings are on top of the
 * locked bay picture, which is never changed. Every drawing and number is a PLACEHOLDER for Brian.
 */
import { MOP_CALM, MOPOFF } from "./escape-place.js";
import { escapeWords } from "./escape-lines.js";
import { highlightLine } from "./outline.js";

const INK = "#1e2430";
const GOLD = "#ffcf33";
const GRIME = "rgba(118,104,84,.55)";
const TAU = Math.PI * 2;

// ---------- the floor ----------
/** The goat side's cells: { id "c,r", x0, y0, x1, y1, need (passes), corner }. */
export function goatCells() {
  const G = MOPOFF.goat,
    F = MOPOFF.floor,
    w = (G.x1 - G.x0) / G.cols,
    h = (F.y1 - F.y0) / G.rows,
    out = [];
  for (let r = 0; r < G.rows; r++)
    for (let c = 0; c < G.cols; c++) {
      const id = c + "," + r;
      out.push({ id, x0: G.x0 + c * w, x1: G.x0 + (c + 1) * w, y0: F.y0 + r * h, y1: F.y0 + (r + 1) * h, need: MOPOFF.sticky.includes(id) ? 2 : 1, corner: (c === 0 || c === G.cols - 1) && (r === 0 || r === G.rows - 1) });
    }
  return out;
}
/** A fresh floor: the calm patches (44a) and the goat side's dirt (44b), all dirty. */
export function freshFloor() {
  return { calm: MOP_CALM.patches.map(() => 0), dirt: Object.fromEntries(goatCells().map((c) => [c.id, c.need])), last: "", wheelsDone: false, sparkles: [] };
}
/** Where his beard is, from his feet (x, y) and facing f: just in front of him, on the floor. */
export const beardAt = (x, y, f) => ({ x: x + (f || 1) * 24, y: y + 2 });
/** 44a: the beard at `b` cleans the patches it passes over. Returns how many are clean now. */
export function mopCalm(floor, b, time) {
  MOP_CALM.patches.forEach((p, i) => {
    if (!floor.calm[i] && Math.hypot(b.x - p.x, b.y - p.y) <= MOP_CALM.r) ((floor.calm[i] = 1), floor.sparkles.push({ x: p.x, y: p.y, at: time }));
  });
  return floor.calm.filter(Boolean).length;
}
/** 44b: the cell under the beard, or null. */
export function cellAt(b) {
  return goatCells().find((c) => b.x >= c.x0 && b.x < c.x1 && b.y >= c.y0 && b.y < c.y1) || null;
}
/** 44b: one pass of the beard (entering a cell takes one layer of dirt off it). */
export function mopGoat(floor, b, time) {
  const c = cellAt(b),
    id = c ? c.id : "";
  if (id && id !== floor.last && floor.dirt[id] > 0) {
    floor.dirt[id]--;
    floor.dirt[id] === 0 && floor.sparkles.push({ x: (c.x0 + c.x1) / 2, y: (c.y0 + c.y1) / 2, at: time });
  }
  floor.last = id;
}
/** The share of the goat side that sparkles (0 to 1), and whether every cell does (corners too). */
export function goatClean(floor) {
  const ids = Object.keys(floor.dirt),
    clean = ids.filter((id) => floor.dirt[id] === 0).length;
  return { k: clean / ids.length, all: clean === ids.length };
}
/** The robot's dirty wheels across the goat side: every cell its row crosses gets a layer of dirt back. */
export function wheelsAcross(floor) {
  goatCells()
    .filter((c) => MOPOFF.wheels.y >= c.y0 && MOPOFF.wheels.y < c.y1)
    .forEach((c) => (floor.dirt[c.id] = Math.max(floor.dirt[c.id], 1)));
  floor.wheelsDone = true;
}
/** The star's words by how much of his side sparkles (story pass 44b). */
export function starFor(clean) {
  return clean.all ? "star-star" : clean.k >= 0.5 ? "star-great" : "star-good";
}
/** The two bars at time `t` of the contest: { fast: [robots, goat], sparkle: [robots, goat] }. */
export function bars(floor, t) {
  const g = goatClean(floor).k;
  return { fast: [Math.min(1, t / MOPOFF.robotsDone), g * MOPOFF.goatFast], sparkle: [Math.min(MOPOFF.robotSparkle, (t / MOPOFF.robotsDone) * MOPOFF.robotSparkle), g] };
}
/** Where each robot is at time `t` of the contest (straight lanes, back and forth, then still at the line). */
export function robotsAt(t) {
  const [a, b] = MOPOFF.robotX,
    k = Math.min(1, t / MOPOFF.robotsDone);
  return MOPOFF.robotLanes.map((y, i) => {
    // two passes along its lane: out, back, out; then it waits by the line
    const u = k * 3,
      leg = Math.min(2, Math.floor(u)),
      f = u - leg,
      x = leg % 2 === 0 ? a + (b - a) * f : b - (b - a) * f;
    return k >= 1 ? { x: MOPOFF.line - 40 - i * 10, y, f: 1 } : { x: i === 1 ? a + b - x : x, y, f: (leg % 2 === 0) === (i !== 1) ? 1 : -1 };
  });
}

// ---------- drawing ----------
function sparkle(ctx, x, y, s, a) {
  ctx.save();
  ctx.globalAlpha = a;
  ctx.translate(x, y);
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const r = i % 2 ? s * 0.35 : s;
    ctx.lineTo(Math.cos((i * TAU) / 8 - TAU / 4) * r, Math.sin((i * TAU) / 8 - TAU / 4) * r);
  }
  ctx.closePath();
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.strokeStyle = "rgba(52,120,246,.8)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}
function smudge(ctx, x, y, rx, ry, thick) {
  ctx.save();
  ctx.fillStyle = GRIME;
  for (let k = 0; k < (thick ? 3 : 2); k++) {
    ctx.beginPath();
    ctx.ellipse(x + (k - 1) * rx * 0.4, y + ((k % 2) - 0.5) * ry * 0.5, rx * (0.7 - k * 0.1), ry * (0.8 - k * 0.15), 0.2 * k, 0, TAU);
    ctx.fill();
  }
  if (thick) {
    // sticky: a darker sheen with a glint (it needs two passes)
    ctx.beginPath();
    ctx.ellipse(x, y, rx * 0.4, ry * 0.4, 0, 0, TAU);
    ctx.fillStyle = "rgba(122,70,40,.55)";
    ctx.fill();
  }
  ctx.restore();
}
/** 44a: the cart tracks and the dirty patches (sparkling once clean). Returns what it drew. */
export function drawCalmFloor(ctx, floor, t) {
  ctx.save();
  ctx.strokeStyle = "rgba(118,104,84,.28)";
  ctx.lineWidth = 7;
  for (const tr of MOP_CALM.tracks) for (const d of [-9, 9]) (ctx.beginPath(), ctx.moveTo(70, tr.y + d), ctx.lineTo(650, tr.y + d), ctx.stroke());
  ctx.restore();
  MOP_CALM.patches.forEach((p, i) => (floor.calm[i] ? null : smudge(ctx, p.x, p.y, 30, 13, false)));
  drawSparkles(ctx, floor, t);
  return { dirty: floor.calm.filter((c) => !c).length };
}
function drawSparkles(ctx, floor, t) {
  for (const s of floor.sparkles) {
    const age = t - s.at;
    // a burst as it gets clean, then a soft twinkle that stays
    const big = age < 0.6 ? 14 + age * 20 : 9 + Math.sin(t * 4 + s.x) * 2;
    sparkle(ctx, s.x, s.y - 4, big, age < 0.6 ? 1 : 0.8);
  }
}
/** 44b: the line and the two sides' words, the boxes, the robots' streaks, the goat side's dirt, the wheel marks. */
export function drawMopFloor(ctx, floor, st, t) {
  const F = MOPOFF.floor,
    L = MOPOFF.line,
    paint = st.paint == null ? 1 : st.paint;
  // the robots' streaks behind them: grey lines along their lanes, as far as they have gone, corners missed
  const along = Math.min(1, (st.ct || 0) / MOPOFF.robotsDone);
  if (st.ct > 0) {
    ctx.save();
    ctx.strokeStyle = "rgba(96,104,120,.45)";
    ctx.lineWidth = 9;
    for (const y of MOPOFF.robotLanes) (ctx.beginPath(), ctx.moveTo(MOPOFF.robotX[0] + 20, y + 6), ctx.lineTo(MOPOFF.robotX[0] + 20 + (MOPOFF.robotX[1] - MOPOFF.robotX[0] - 40) * along, y + 6), ctx.stroke());
    ctx.restore();
    // the sticky spots on their side, smeared wider (straight lines spread them)
    for (const [x, y] of [[150, 500], [330, 575]]) smudge(ctx, x, y, 26 + 22 * along, 11 + 4 * along, true);
    // the corners they miss
    for (const [x, y] of [[80, 445], [80, 585], [450, 585]]) smudge(ctx, x, y, 22, 9, false);
  }
  // the stack of boxes, knocked over by a robot
  drawBoxes(ctx, st.ct >= MOPOFF.boxes.at, t);
  // the painted line, growing down the floor as the robot paints it
  ctx.save();
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(L, F.y0);
  ctx.lineTo(L, F.y0 + (F.y1 - F.y0) * paint);
  ctx.stroke();
  ctx.restore();
  if (paint >= 1) {
    floorWords(ctx, escapeWords("floor-robot"), L - 110, F.y1 - 6);
    floorWords(ctx, escapeWords("floor-goat"), (MOPOFF.goat.x0 + MOPOFF.goat.x1) / 2 + 6, F.y1 - 8);
  }
  // the goat side's dirt (sticky cells darker), and its sparkles
  for (const c of goatCells()) {
    const d = floor.dirt[c.id];
    if (d > 0) smudge(ctx, (c.x0 + c.x1) / 2, (c.y0 + c.y1) / 2, (c.x1 - c.x0) * 0.42, (c.y1 - c.y0) * 0.36, d > 1);
  }
  // the dirty wheel marks across the goat side
  if (floor.wheelsDone) {
    ctx.save();
    ctx.strokeStyle = "rgba(60,50,40,.35)";
    ctx.lineWidth = 6;
    for (const d of [-8, 8]) (ctx.beginPath(), ctx.moveTo(L + 4, MOPOFF.wheels.y + d), ctx.lineTo(MOPOFF.goat.x1, MOPOFF.wheels.y + d), ctx.stroke());
    ctx.restore();
  }
  drawSparkles(ctx, floor, t);
  return { clean: goatClean(floor), boxesDown: st.ct >= MOPOFF.boxes.at };
}
function floorWords(ctx, s, x, y) {
  ctx.save();
  ctx.font = "900 26px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,207,51,.92)";
  ctx.strokeStyle = "rgba(30,36,48,.55)";
  ctx.lineWidth = 3;
  ctx.strokeText(s, x, y);
  ctx.fillText(s, x, y);
  ctx.restore();
}
function drawBoxes(ctx, down, t) {
  const B = MOPOFF.boxes;
  const box = (x, y, a) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(a);
    ctx.fillStyle = "#d9a35b";
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.fillRect(-22, -36, 44, 36);
    ctx.strokeRect(-22, -36, 44, 36);
    ctx.beginPath();
    ctx.moveTo(-22, -18);
    ctx.lineTo(22, -18);
    ctx.stroke();
    ctx.restore();
  };
  if (!down) [0, 1, 2].forEach((i) => box(B.x + (i === 2 ? 0 : (i - 0.5) * 46), B.y - (i === 2 ? 36 : 0), 0));
  else [[-50, 0.4], [0, -0.2], [56, 1.3]].forEach(([dx, a], i) => box(B.x + dx, B.y + i * 8, a));
}
/** The two bars on the bay's back wall: FAST and SPARKLE, the robots' (grey) over the goat's (gold). */
export function drawBars(ctx, b) {
  const B = MOPOFF.board;
  ctx.save();
  ctx.fillStyle = "rgba(30,36,48,.88)";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(B.x0, B.y0, B.x1 - B.x0, B.y1 - B.y0, 12);
  ctx.fill();
  ctx.stroke();
  const rows = [["bar-fast", b.fast], ["bar-sparkle", b.sparkle]];
  rows.forEach(([id, [robots, goat]], i) => {
    const y = B.y0 + 16 + i * 52;
    ctx.font = "900 22px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(escapeWords(id), B.x0 + 12, y + 18);
    const x0 = B.x0 + 112,
      w = B.x1 - x0 - 14;
    for (const [k, col, dy, who] of [[robots, "#9aa3b5", 0, "robot"], [goat, GOLD, 20, "goat"]]) {
      ctx.fillStyle = "rgba(255,255,255,.18)";
      ctx.fillRect(x0 + 20, y + dy, w - 20, 14);
      ctx.fillStyle = col;
      ctx.fillRect(x0 + 20, y + dy, (w - 20) * Math.max(0, Math.min(1, k)), 14);
      icon(ctx, x0 + 8, y + dy + 7, who);
    }
  });
  ctx.restore();
  return { fast: b.fast.map((k) => +k.toFixed(2)), sparkle: b.sparkle.map((k) => +k.toFixed(2)) };
}
// a tiny robot head or goat head beside each bar (no words: the kid sees whose bar it is)
function icon(ctx, x, y, who) {
  ctx.save();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#ffffff";
  if (who === "robot") {
    ctx.fillStyle = "#9aa3b5";
    ctx.fillRect(x - 7, y - 7, 14, 13);
    ctx.strokeRect(x - 7, y - 7, 14, 13);
    ctx.fillStyle = "#7fd1ff";
    ctx.fillRect(x - 4, y - 3, 8, 4);
  } else {
    ctx.fillStyle = "#f4f5f8";
    ctx.beginPath();
    ctx.ellipse(x, y, 7, 7, 0, 0, TAU);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 2, y + 6);
    ctx.lineTo(x, y + 12);
    ctx.lineTo(x + 2, y + 6);
    ctx.fill();
  }
  ctx.restore();
}
/** A gold five-pointed star at (x, y), radius r. */
export function drawGoldStar(ctx, x, y, r, line = 2) {
  ctx.save();
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 ? r * 0.45 : r,
      a = (i * TAU) / 10 - TAU / 4;
    ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fillStyle = GOLD;
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = line;
  ctx.stroke();
  ctx.restore();
}
/** The star's close-up: his GANITOR tag, big, the gold star landing on it, and the words under it. */
export function drawStarCloseup(ctx, starId, age) {
  ctx.save();
  ctx.fillStyle = "#3a6fd8";
  ctx.fillRect(0, 0, 960, 640);
  // the tag on his shirt, big
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#1d4fb8";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.roundRect(230, 170, 500, 200, 26);
  ctx.fill();
  ctx.stroke();
  ctx.font = "900 92px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = INK;
  ctx.fillText("GANITOR", 480, 302);
  // the star drops onto its corner
  const k = Math.min(1, age / 0.5);
  drawGoldStar(ctx, 700, 175 - (1 - k) * 160, 64 + (1 - k) * 30, 5);
  ctx.font = "900 64px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = GOLD;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 6;
  const words = escapeWords(starId);
  ctx.strokeText(words, 480, 500);
  ctx.fillText(words, 480, 500);
  ctx.restore();
  return { words, landed: k >= 1 };
}
/** The star on his GANITOR tag (drawn in his own units, after the tag: bridge.js drawGanitorTag). */
export function drawTagStar(ctx, tag) {
  drawGoldStar(ctx, tag.x0 + tag.w, tag.y0, 2.6, 0.5);
}
/** The calm hum, and the outline of the next dirty patch (the one highlight: OUTLINE's dashed line). */
export function markPatch(ctx, p, t) {
  ctx.save();
  highlightLine(ctx, t);
  ctx.beginPath();
  ctx.ellipse(p.x, p.y, 40, 18, 0, 0, TAU);
  ctx.stroke();
  ctx.restore();
}
