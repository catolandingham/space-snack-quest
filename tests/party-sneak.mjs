/**
 * The flyer sneak's moving cones, for tests and tools (party P4; Brian 2026-11-25, "End of the bar, moving cones").
 * Not a test on its own: tests/party-flyer.mjs, tests/ch1-kid-play.mjs and tools/party-showing.mjs use it.
 *   coneTimeline(page, secs)  the game's own cones, every STEP seconds of P4's clock from 0 (read from the running
 *                             game by setting its P4 clock, then put back), and the floor's solids and bounds
 *   planSneak(tl, from, t0, to, opts)  a way from `from` (feet) to within `to.r` of `to`, setting off at P4 time
 *                             `t0`, that is never in or near a cone; the kid may wait anywhere (and in the plant he
 *                             starts in, with opts.hidden, until he steps out). A list of
 *                             { x, y, t } one STEP apart, or null. A search over time on a GRID-pixel floor plan.
 *   walkPlan(page, plan)      the game steps (its clock stopped, the test's ticks only) as he is walked along it,
 *                             a tap a step, as a kid taps his way; returns what happened (seen, alarm, where he ended)
 *   straightIn(tl, from, t0, to, speed)  walking straight in without waiting: how long one cone holds him at most
 *   sneakTo(page, to, opts)   plans from where he is and P4's clock now, and walks it; resume(page) / stopLoop(page)
 *                             start and stop the game's own frame loop
 */
import { join } from "node:path";
import { root } from "./game-page.mjs";

export const STEP = 0.1;
const GRID = 10;
const watch = await import(join(root, "src", "modules", "party-watch.js"));
const vent = await import(join(root, "src", "modules", "party-vent.js"));

/** The game's cones every STEP seconds of P4's clock (it is set, read and put back), and the floor plan. */
export async function coneTimeline(page, secs) {
  return page.evaluate(
    (n, step) => {
      const b = window.SSQ.beat("ch1-party"),
        p = window.__ss.op.ch1PartyNow,
        was = p.sweepT || 0,
        out = [];
      for (let i = 0; i < n; i++) {
        p.sweepT = i * step;
        out.push(b.cones().map((c) => ({ id: c.id, ox: c.ox, oy: c.oy, a: c.a, half: c.half, len: c.len })));
      }
      p.sweepT = was;
      return { cones: out, solids: b.solids(), bounds: b.bounds(), now: was };
    },
    Math.ceil(secs / STEP),
    STEP,
  );
}
// How far Squatch (his whole outline, party-watch.js coneEdge) is from the nearest cone at timeline step k (0 in one).
function nearest(tl, k, x, y) {
  const cs = tl.cones[Math.min(k, tl.cones.length - 1)];
  let d = 1e9;
  for (const c of cs) d = Math.min(d, watch.coneEdge(c, { x, y }));
  return d;
}
// (the vent counts as a wall: lingering by it with no disguise starts the fur alarm, party-vent.js)
// A person's feet box is small; a kid does not walk Squatch behind or in front of someone so close that the two are
// drawn over each other, so the plan keeps a body's width off each person (PERSON_ROOM: sideways, behind, in front).
const PERSON_ROOM = { side: 30, back: 34, front: 16 };
const freeAt = (tl, x, y) =>
  x >= tl.bounds.x0 &&
  x <= tl.bounds.x1 &&
  y >= tl.bounds.y0 &&
  y <= tl.bounds.y1 &&
  !tl.solids.some((b) => (b.person ? x > b.x0 - PERSON_ROOM.side && x < b.x1 + PERSON_ROOM.side && y > b.y0 - PERSON_ROOM.back && y < b.y1 + PERSON_ROOM.front : x > b.x0 && x < b.x1 && y > b.y0 && y < b.y1)) &&
  vent.ventDistance({ x, y }) > vent.VENT.near + 10;

/**
 * A way from `from` to `to` (within to.r), setting off at P4 time t0, never within `margin` of a cone at that step
 * or the next. `speed`: the most he walks a second (a little under the game's, so a kid keeps up).
 */
export function planSneak(tl, from, t0, to, opts = {}) {
  const { speed = 160, margin = 10, maxT = 60 } = opts;
  const k0 = Math.round(t0 / STEP),
    reach = speed * STEP,
    r = Math.ceil(reach / GRID),
    moves = [];
  for (let i = -r; i <= r; i++) for (let j = -r; j <= r; j++) Math.hypot(i, j) * GRID <= reach + 0.01 && moves.push([i, j]);
  // (each place's distance to the cones at each step is worked out once: the search asks for it many times)
  const memo = tl.memo || (tl.memo = new Map()),
    far = (x, y, k) => {
      const key = k * 1e6 + x * 1000 + y;
      let d = memo.get(key);
      d === undefined && memo.set(key, (d = nearest(tl, k, x, y)));
      return d;
    },
    safe = (x, y, k) => far(x, y, k) > margin && far(x, y, k + 1) > margin;
  const start = [Math.round(from.x / GRID), Math.round(from.y / GRID)];
  // (`hidden`: he starts in the plant, where nobody sees him, and may wait there until he steps out)
  let front = new Map([["hid", { i: start[0], j: start[1], back: null, x: from.x, y: from.y, hidden: !!opts.hidden }]]);
  for (let k = k0; (k - k0) * STEP < maxT && k + 1 < tl.cones.length; k++) {
    const next = new Map();
    for (const c of front.values()) {
      if (c.hidden) next.set("hid", { ...c, back: c, k: k + 1 });
      for (const [di, dj] of moves) {
        const i = c.i + di,
          j = c.j + dj,
          x = i * GRID,
          y = j * GRID,
          key = i + "," + j;
        if (next.has(key) || !freeAt(tl, x, y) || !safe(x, y, k + 1)) continue;
        const n = { i, j, x, y, back: c, k: k + 1 };
        if (Math.hypot(x - to.x, y - to.y) <= to.r - 4) {
          const out = [];
          for (let q = n; q; q = q.back) out.unshift({ x: q.x, y: q.y, t: (q.k == null ? k0 : q.k) * STEP });
          return out;
        }
        next.set(key, n);
      }
    }
    if (!next.size) return null;
    front = next;
  }
  return null;
}

/** Walking straight along `pts` from `from` at `speed`, setting off at t0: the longest any one cone holds him. */
export function straightIn(tl, from, t0, pts, speed = 190, standAfter = 0.6) {
  let x = from.x,
    y = from.y,
    k = Math.round(t0 / STEP),
    who = "",
    held = 0,
    most = 0;
  const look = () => {
    const cs = tl.cones[Math.min(k, tl.cones.length - 1)].filter((c) => watch.coneSees(c, { x, y })).map((c) => c.id);
    if (!cs.length) return ((who = ""), (held = 0));
    held = cs.includes(who) ? held + STEP : STEP;
    who = cs.includes(who) ? who : cs[0];
    most = Math.max(most, held);
  };
  for (const [px, py] of pts)
    while (Math.hypot(px - x, py - y) > 0.5) {
      const d = Math.hypot(px - x, py - y),
        s = Math.min(1, (speed * STEP) / d);
      x += (px - x) * s;
      y += (py - y) * s;
      k++;
      look();
    }
  for (let i = 0; i < standAfter / STEP; i++) (k++, look());
  return Math.round(most * 10) / 10;
}

/**
 * Walks him along `plan` in the running game: its frame loop is stopped and each STEP is six ticks of 1/60, with a
 * tap on that step's point (as a kid taps his way). Returns { seen (anyone's cone held him at some tick), alarm,
 * at: { x, y }, sweepT }.
 */
export async function walkPlan(page, plan) {
  return page.evaluate(
    (plan, step) => {
      // the game's own frame loop waits (its next frame is kept) while the test ticks it; resume() starts it again
      window.__rafOrig = window.__rafOrig || window.requestAnimationFrame;
      window.requestAnimationFrame = (f) => ((window.__rafPending = f), 0);
      const n = window.__ss.op,
        b = window.SSQ.beat("ch1-party");
      let seen = "",
        alarm = false,
        maxStep = 0,
        was = [n.sq.x, n.sq.y];
      // (the last point a few more times: he arrives, as a kid's last tap lands)
      const last = plan[plan.length - 1];
      for (const q of [...plan.slice(1), last, last, last, last, last]) {
        window.__ss.tapAt(q.x, q.y);
        for (let i = 0; i < Math.round(step * 60); i++) {
          window.__ss.tick(1 / 60);
          n.room === "hall" && (maxStep = Math.max(maxStep, Math.hypot(n.sq.x - was[0], n.sq.y - was[1])));
          was = [n.sq.x, n.sq.y];
          const s = b.now();
          s && s.seenBy && !seen && (seen = s.seenBy + "@" + (n.ch1PartyNow.sweepT || 0).toFixed(1));
          s && s.alarm && (alarm = true);
        }
      }
      // (a test sampling the game in real time skips over this stretch: it ran faster than real time)
      const tr = window.__trail,
        lastSample = tr && tr.length ? tr[tr.length - 1] : null;
      lastSample && tr.push(Array.isArray(lastSample) ? [lastSample[0], lastSample[1], "break"] : { ...lastSample, room: "break", seen: "", alarm: false });
      return { seen, alarm, maxStep: Math.round(maxStep * 10) / 10, at: { x: n.sq.x, y: n.sq.y }, sweepT: n.ch1PartyNow.sweepT, act: n.act ? n.act.verb + " · " + n.act.cap : "" };
    },
    plan,
    STEP,
  );
}

/** The game's own frame loop again, after walkPlan (or stopLoop) kept it waiting. */
export function resume(page) {
  return page.evaluate(() => {
    if (!window.__rafOrig) return;
    window.requestAnimationFrame = window.__rafOrig;
    const f = window.__rafPending;
    window.__rafPending = null;
    f && window.requestAnimationFrame(f);
  });
}
/** Stops the game's own frame loop (the test ticks it), as walkPlan does. */
export function stopLoop(page) {
  return page.evaluate(() => {
    window.__rafOrig = window.__rafOrig || window.requestAnimationFrame;
    window.requestAnimationFrame = (f) => ((window.__rafPending = f), 0);
  });
}
/**
 * In P4: plans a way from where he is now to `to` with the game's own cones (from P4's clock now) and walks it.
 * `hidden`: he is in the plant. Returns { plan, walked } (walked: what walkPlan saw), or { plan: null }. The game's
 * frame loop is left stopped; call resume() to go on in real time.
 */
export async function sneakTo(page, to, { hidden = false, upTo = 1 } = {}) {
  await stopLoop(page);
  const now = await page.evaluate(() => window.__ss.op.ch1PartyNow.sweepT || 0),
    tl = await coneTimeline(page, now + 70),
    from = await page.evaluate(() => ({ x: window.__ss.op.sq.x, y: window.__ss.op.sq.y })),
    plan = planSneak(tl, from, now, to, { hidden });
  if (!plan) return { plan: null };
  const part = plan.slice(0, Math.max(2, Math.round(plan.length * upTo)));
  return { plan, walked: await walkPlan(page, part) };
}
