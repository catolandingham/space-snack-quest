/**
 * The snack bar (party plan P6, "Snacks"; settled 2026-11-22: "a few stars per swiped snack, with the topple as
 * the risk"; Brian 2026-11-24: "tap a snack and his paw takes it; she turns in a way you can't miss; the bag gets
 * a label and a count", and "it just depends on what he takes"). At the bar a paw icon opens the close-up, inside
 * the picture: the bartender behind the counter, the pyramid of ten snacks (the same ten the hall draws, from
 * party-snacks-stack.js), his paw, his bag with a count, and LEAVE · bar.
 *   - Tap a snack: his paw reaches out, takes it and puts it in the bag. Each one is a few stars.
 *   - The pyramid follows the rule in party-snacks-stack.js: nothing on a snack, it comes out free; one snack on
 *     it, that one slides down into the gap; two on it, the pile falls. The fall is the hall's topple: the zoom
 *     pulls back, a flying cup knocks a piece of his outfit off, everyone stares for 4 seconds (R60, approved).
 *   - The bartender turns her whole body. His paw out while she faces him is a catch: "...Nice gloves."; the
 *     second time "Wait a second... fur!" and she runs to the alarm.
 *   - Every snack taken is remembered for the end of Chapter 1 ("Snack Bandit") and for Day 2 (snackRecord).
 *
 * State on the party's game-state object `p`: p.snack (the open close-up, or null) and p.snacks (kept on a
 * restart: the pile, what is in the bag, whether the pile fell, the chain's progress). Words come from
 * party-lines.js; the drawings are in party-snacks-art.js; the sounds and lines are started in party-snacks-play.js.
 */
import { SLOTS, fullStack, pull, snacksLeft, SNACK_COUNT } from "./party-snacks-stack.js";

// PLACEHOLDERS for Brian: stars per snack ("a few"); the bartender's rhythm (seconds with her back turned, then
// her turn, then facing him, and how long she still looks after a catch); how long his paw takes (out to the
// snack, back to the bag, home); how long a slide and the last moment before the fall show; the chain's length.
export const SNACK_STARS = 5;
export const BAR = Object.freeze({ backs: [5, 4, 6, 4.5], glance: 0.9, face: 2, away: 0.35, afterCatch: 0.6, zoom: 0.4, chain: 1.8, cupAt: 0.45, reach: 0.3, seen: 0.12, carry: 0.4, home: 0.25, settle: 0.45, fall: 0.8 });
// Pinned (R60): how long everyone stares after the spill.
export const SNACK_LOOK_SECONDS = 4;

// The close-up's layout, in game positions (the picture is 960 x 640; on a phone it is about 360 wide, so one
// snack's place, CELL, is 44 phone pixels each way, and so is LEAVE · bar's height). The pyramid stands on the
// counter left of the middle, the bartender behind the counter on the right, the bag bottom left, LEAVE · bar
// bottom right, his paw from below.
const CELL = Object.freeze({ w: 118, h: 118, x: 400, y: 456 });
/** Where slot `i` of the pyramid is drawn in the close-up (its centre). */
export function slotAt(i) {
  return { x: CELL.x + (SLOTS[i].col - 3) * (CELL.w / 2), y: CELL.y - SLOTS[i].row * CELL.h };
}
const LEAVE = Object.freeze({ x0: 640, y0: 516, x1: 948, y1: 636 });
export const CUT = Object.freeze({
  cell: CELL,
  counter: 514, // the counter's top edge, where the bottom row stands
  // every slot, top down: [the kind of snack it starts with, x, y]
  snacks: Object.freeze(SLOTS.map((s, i) => [s.kind, slotAt(i).x, slotAt(i).y])),
  bag: Object.freeze({ x0: 8, y0: 400, x1: 176, y1: 632 }),
  mouth: Object.freeze({ x: 92, y: 392 }), // the bag's open top, where his paw drops a snack
  leave: LEAVE,
  // (the old close button's place: the middle of LEAVE · bar)
  close: Object.freeze({ x: (LEAVE.x0 + LEAVE.x1) / 2, y: (LEAVE.y0 + LEAVE.y1) / 2, r: 44 }),
  // her feet (below the picture: the counter hides her legs) and her height; her bubble sits over her head
  bartender: Object.freeze({ x: 800, y: 700, h: 500 }),
  rest: Object.freeze({ x: 400, y: 596 }), // his paw waiting
  hide: Object.freeze({ x: 400, y: 690 }), // his paw pulled back out of sight while she faces him
});

/** The pile and the bag (p.snacks), with the pile made the first time it is asked for. */
export function stock(p) {
  const s = p.snacks || (p.snacks = { bag: 0, taken: [], toppled: false, chain: -1 });
  s.slots || (s.slots = fullStack());
  return s;
}
/** Opens the close-up (the paw icon at the bar). */
export function openSnacks(p) {
  const s = stock(p);
  p.snack = { zoom: 0, paw: { ...CUT.rest }, held: -1, phase: "back", t: BAR.away, back: 0, catches: s.catches || 0, reach: null, slides: [], fall: -1, landed: 0 };
  return p.snack;
}
/** How many bagged snacks have not been paid for yet; asking pays them off (the play module adds the stars). */
export function takeOwed(p) {
  const n = (p.snacks && p.snacks.owed) || 0;
  n && (p.snacks.owed = 0);
  return n;
}
/**
 * Closes the close-up. A snack still in his paw goes into the bag (its stars stay owed). A pile already falling
 * is down: the close-up only closes mid-fall when the party is leaving P6 (closing time, an alarm), where the
 * hall's chain does not run, so the pile is shown fallen and no cup flies.
 */
export function closeSnacks(p) {
  const c = p.snack,
    s = p.snacks;
  if (s && c) {
    s.catches = c.catches;
    c.held >= 0 && bagIt(s, c);
    c.fall >= 0 && !s.toppled && ((s.toppled = true), (s.chain = 1));
  }
  p.snack = null;
}
const backFor = (c) => BAR.backs[c.back % BAR.backs.length];
const ease = (k) => k * k * (3 - 2 * k);
const mix = (a, b, k) => ({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k });
// A snack goes into the bag. Its stars are owed until the play module pays them (takeOwed), so a snack bagged
// as the close-up closes is paid like any other.
function bagIt(s, c) {
  s.taken.push(c.held);
  s.bag += 1;
  s.owed = (s.owed || 0) + 1;
  c.held = -1;
  c.landed = 1;
  snacksLeft(s.slots) === 0 && !s.toppled && (s.all = true);
}
/** Where his paw is now: waiting (or pulled back while she faces him), reaching out, carrying, or coming home. */
export function pawAt(c) {
  // (waiting, it slips down out of sight as she comes to face him, and comes back up as she turns away)
  const down = c.phase === "face" ? Math.min(1, c.t / 0.2) : c.phase === "back" ? 1 - Math.min(1, c.t / BAR.away) : 0,
    home = mix(CUT.rest, CUT.hide, ease(down)),
    r = c.reach;
  if (!r) return { ...home };
  if (r.stage === "out") return mix(r.from, slotAt(r.slot), ease(Math.min(1, r.t / BAR.reach)));
  if (r.stage === "carry") return mix(slotAt(r.slot), CUT.mouth, ease(Math.min(1, r.t / BAR.carry)));
  return mix(r.from, home, ease(Math.min(1, r.t / BAR.home)));
}
/** True while his paw is out where she can see it (reaching for a snack or carrying one). */
export function pawOut(c) {
  return !!c.reach && (c.reach.stage === "carry" || (c.reach.stage === "out" && c.reach.t >= BAR.seen));
}
/**
 * One frame of the close-up: the bartender's rhythm, his paw, the pile. Returns what happened this frame, in
 * order, as a list of:
 *   "turn"    she starts to turn round            "grab"    his paw closes on the snack
 *   "settle"  a snack slides down into the gap    "crack"   he pulled a snack two were on: the pile starts to go
 *   "bag"     a snack lands in the bag            "all"     that was the last snack on the bar
 *   "catch1", "catch2"  she faces him and his paw is out
 *   "topple"  the pile falls: the close-up is over (the hall's chain takes it from here)
 */
export function tickSnacks(p, dt) {
  const c = p.snack,
    ev = [];
  if (!c) return ev;
  const s = stock(p);
  // (a close-up made by hand, as some tests make it, gets what it lacks)
  c.slides || Object.assign(c, { reach: null, slides: [], fall: -1, landed: 0 });
  c.zoom = Math.min(1, c.zoom + dt / BAR.zoom);
  if (c.zoom < 1) return ev;
  c.landed = Math.max(0, c.landed - dt * 3);
  c.slides = c.slides.filter((m) => (m.t += dt) < BAR.settle);
  // The pile going: the last moment in the close-up, then the hall's topple.
  if (c.fall >= 0) {
    c.fall += dt;
    c.reach && (c.reach.t += dt);
    c.paw = pawAt(c);
    c.fall >= BAR.fall && ev.push("topple");
    return ev;
  }
  // the bartender
  c.t += dt;
  if (c.phase === "back" && c.t >= BAR.away + backFor(c)) ((c.phase = "glance"), (c.t = 0), ev.push("turn"));
  else if (c.phase === "glance" && c.t >= BAR.glance) ((c.phase = "face"), (c.t = 0));
  else if (c.phase === "face" && c.t >= BAR.face) ((c.phase = "back"), (c.t = 0), (c.back += 1));
  // his paw
  const r = c.reach;
  if (r) {
    r.t += dt;
    if (r.stage === "out" && r.t >= BAR.reach) {
      // his paw closes on the snack and it comes out of the pile: the rule decides what the pile does
      const res = pull(s.slots, r.slot);
      s.slots = res.slots;
      ev.push("grab");
      if (res.result === "crash") {
        // the pile is going: he lets go (no snack, no stars)
        c.fall = 0;
        c.gap = r.slot;
        c.dropped = res.id;
        c.reach = { stage: "home", t: 0, from: slotAt(r.slot) };
        ev.push("crack");
        c.paw = pawAt(c);
        return ev;
      }
      c.held = res.id;
      r.stage = "carry";
      r.t = 0;
      res.result === "settle" && (c.slides.push(...res.moves.map((m) => ({ ...m, t: 0 }))), ev.push("settle"));
    } else if (r.stage === "carry" && r.t >= BAR.carry) {
      bagIt(s, c);
      ev.push("bag");
      s.all && ev.push("all");
      c.reach = { stage: "home", t: 0, from: { ...CUT.mouth } };
    } else if (r.stage === "home" && r.t >= BAR.home) c.reach = null;
  }
  // caught: she faces him and his paw is out. A snack already in his paw still goes in the bag (the pile has
  // moved on without it); she looks a moment longer, then turns back to her shelf.
  if (c.phase === "face" && pawOut(c)) {
    const from = pawAt(c);
    if (c.held >= 0) {
      bagIt(s, c);
      ev.push("bag");
      s.all && ev.push("all");
    }
    c.reach = { stage: "home", t: 0, from };
    c.catches += 1;
    c.t = Math.max(c.t, BAR.face - BAR.afterCatch);
    ev.push(c.catches === 1 ? "catch1" : "catch2");
  }
  c.paw = pawAt(c);
  return ev;
}
/** The snack whose place a tap at (x, y) is in, or -1: the nearest one within its own cell. */
export function snackUnder(s, x, y) {
  let best = -1,
    bd = Infinity;
  s.slots.forEach((id, i) => {
    const at = slotAt(i),
      dx = Math.abs(x - at.x),
      dy = Math.abs(y - at.y);
    id >= 0 && dx <= CELL.w / 2 && dy <= CELL.h / 2 && dx + dy < bd && ((bd = dx + dy), (best = i));
  });
  return best;
}
/**
 * A tap in the close-up (game positions). Returns "close" (LEAVE · bar), "reach" (his paw goes for that snack)
 * or "". No dragging: only the finger going down counts. One snack at a time.
 */
export function snackPointer(p, kind, x, y) {
  const c = p.snack;
  if (!c || c.zoom < 1 || kind !== "down" || c.fall >= 0) return "";
  const L = CUT.leave;
  if (x >= L.x0 && x <= L.x1 && y >= L.y0 && y <= L.y1) return "close";
  // one snack at a time; a paw already on its way home can turn straight round for the next one
  if (c.reach && c.reach.stage !== "home") return "";
  const slot = snackUnder(stock(p), x, y);
  if (slot < 0) return "";
  c.reach = { stage: "out", slot, t: 0, from: pawAt(c) };
  return "reach";
}
/** The pile falls: the chain at the bar starts (the close-up closes). */
export function startTopple(p) {
  p.snacks.toppled = true;
  p.snacks.chain = 0;
}
/** Every frame: the chain's progress (0 to 1). Returns "cup" the frame the flying cup reaches him, "crash" on each fall. */
export function tickTopple(p, dt) {
  const s = p.snacks;
  if (!s || s.chain < 0 || s.chain >= 1) return "";
  const was = s.chain;
  s.chain = Math.min(1, s.chain + dt / BAR.chain);
  for (const at of [0.05, 0.3, 0.55, 0.8]) if (was < at && s.chain >= at) return at === 0.55 ? "cup" : "crash";
  return "";
}
/**
 * What the party remembers about the snacks, for the end of Chapter 1 and for Day 2: { all (he took every snack),
 * left (how many are still on the bar), bag (how many he took), toppled (the pile fell) }. `s` is p.snacks, or a
 * record made before (the party keeps only the record once it is over).
 */
export function snackRecord(s) {
  if (!s) return { all: false, left: SNACK_COUNT, bag: 0, toppled: false };
  if (!s.slots) return { all: !!s.all, left: s.left == null ? SNACK_COUNT - (s.bag || 0) : s.left, bag: s.bag || 0, toppled: !!s.toppled };
  return { all: !!s.all, left: snacksLeft(s.slots), bag: s.bag, toppled: !!s.toppled };
}
