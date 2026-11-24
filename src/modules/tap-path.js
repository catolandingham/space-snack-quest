/**
 * Tap to walk goes around furniture (docs/CHAPTER-1-PROBLEMS.md, problem 2: "tap the calendar. Squatch walks
 * straight at it, bumps the bed, and stops").
 *
 * findPath(from, to, bounds, solids) returns the corners to walk through, ending at the tapped point, or at the
 * free floor nearest to it when the tap lands on furniture. A tap on open floor returns just [to]: straight
 * there, as before. Feet are a point; solids are boxes { x0, x1, y0, y1 } (the game's ih() list, plus a standing
Mops when the walker is Squatch: walkSolids in 00-core.js).
 * Returns null when no walk is possible, and the caller walks straight as before.
 */

// Grid step and how far the path keeps from furniture (game pixels). The game pushes feet out of a box as soon
// as they are inside it, so a small margin is enough to keep the walk from scraping along an edge.
const CELL = 10;
const MARGIN = 6;

export function findPath(from, to, bounds, solids) {
  const near = (x, y, m) => solids.some((q) => x > q.x0 - m && x < q.x1 + m && y > q.y0 - m && y < q.y1 + m);
  const blocked = (x, y) => near(x, y, MARGIN);
  // A straight line is clear if no box (grown by the margin) crosses it.
  const clear = (ax, ay, bx, by) => {
    const steps = Math.ceil(Math.hypot(bx - ax, by - ay) / 4);
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      if (blocked(ax + (bx - ax) * t, ay + (by - ay) * t)) return false;
    }
    return true;
  };
  const goalFree = !blocked(to.x, to.y);
  if (goalFree && clear(from.x, from.y, to.x, to.y)) return [{ x: to.x, y: to.y }];

  const W = Math.floor((bounds.x1 - bounds.x0) / CELL) + 1,
    H = Math.floor((bounds.y1 - bounds.y0) / CELL) + 1;
  const cx = (i) => bounds.x0 + i * CELL,
    cy = (j) => bounds.y0 + j * CELL;
  const cellOf = (x, y) => Math.max(0, Math.min(H - 1, Math.round((y - bounds.y0) / CELL))) * W + Math.max(0, Math.min(W - 1, Math.round((x - bounds.x0) / CELL)));
  const free = new Uint8Array(W * H);
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) free[j * W + i] = blocked(cx(i), cy(j)) ? 0 : 1;
  // He may start right against (or a little inside) a box, where the margin blocks every cell around him: the
  // start cell counts as free, and so does each cell next to it that is not inside a box itself.
  const start = cellOf(from.x, from.y),
    si = start % W,
    sj = (start - si) / W;
  free[start] = 1;
  for (let dj = -1; dj <= 1; dj++)
    for (let di = -1; di <= 1; di++) {
      const i = si + di,
        j = sj + dj;
      i >= 0 && j >= 0 && i < W && j < H && !near(cx(i), cy(j), 0) && (free[j * W + i] = 1);
    }

  // Shortest walk on the grid (8 directions), cheapest first.
  const cost = new Float64Array(W * H).fill(Infinity),
    prev = new Int32Array(W * H).fill(-1),
    done = new Uint8Array(W * H);
  cost[start] = 0;
  const open = [start];
  while (open.length) {
    let bi = 0;
    for (let k = 1; k < open.length; k++) if (cost[open[k]] < cost[open[bi]]) bi = k;
    const cur = open[bi];
    open[bi] = open[open.length - 1];
    open.pop();
    if (done[cur]) continue;
    done[cur] = 1;
    const ci = cur % W,
      cj = (cur - ci) / W;
    for (let dj = -1; dj <= 1; dj++)
      for (let di = -1; di <= 1; di++) {
        if (!di && !dj) continue;
        const ni = ci + di,
          nj = cj + dj;
        if (ni < 0 || nj < 0 || ni >= W || nj >= H) continue;
        const nk = nj * W + ni;
        // No cutting a corner between two blocked cells.
        if (!free[nk] || (di && dj && (!free[cj * W + ni] || !free[nj * W + ci]))) continue;
        const c2 = cost[cur] + (di && dj ? Math.SQRT2 : 1);
        if (c2 < cost[nk]) ((cost[nk] = c2), (prev[nk] = cur), open.push(nk));
      }
  }

  // The goal: the tapped cell if it can be reached, else the reachable cell nearest the tap.
  let goal = -1,
    best = Infinity;
  for (let k = 0; k < W * H; k++) {
    if (cost[k] === Infinity) continue;
    const d = Math.hypot(cx(k % W) - to.x, cy((k - (k % W)) / W) - to.y);
    if (d < best - 1e-9 || (Math.abs(d - best) < 1e-9 && cost[k] < cost[goal])) ((best = d), (goal = k));
  }
  if (goal < 0) return null;
  const cells = [];
  for (let k = goal; k !== -1 && k !== start; k = prev[k]) cells.push(k);
  cells.reverse();
  const pts = cells.map((k) => ({ x: cx(k % W), y: cy((k - (k % W)) / W) }));
  // The last point is the tap itself when the tapped spot is open floor.
  if (goalFree && best <= CELL) pts.length ? (pts[pts.length - 1] = { x: to.x, y: to.y }) : pts.push({ x: to.x, y: to.y });
  // Nowhere better to go than where he stands: walk straight at the tap, as before this file existed.
  if (!pts.length) return null;
  // Keep only the corners: skip every point he can reach in a straight line from the last kept one.
  const out = [];
  let at = from,
    i = 0;
  while (i < pts.length) {
    let j = pts.length - 1;
    while (j > i && !clear(at.x, at.y, pts[j].x, pts[j].y)) j--;
    out.push(pts[j]);
    at = pts[j];
    i = j + 1;
  }
  return out;
}
