/**
 * The party's wordless toys (party plan P6, "The toys"): the conga line (the group photo is party-photo.js,
 * the octopus party-octopus.js, the hallway doorway's bounce party-hallway.js). The plants and the vent do nothing to his disguise (Brian
 * 2026-11-24, "Lose it all"). Each is a small state on the party's game-state
 * object `p` and one tick function. All are optional, and nothing here gives a goal chip or an outline.
 * Numbers marked PLACEHOLDER are the builder's guesses for Brian to tune; "pinned" ones are his approved values
 * (docs/TUNING-PINS.json).
 */
import { CONGA_ROUTE, stepTo, stepClear, CLEAR_OF_SQUATCH } from "./party-hall.js";

// ---------- the conga line ----------
// PLACEHOLDERS: when in each song the conga forms (seconds into the song), how long it lasts, how fast it goes,
// how far apart the dancers are, and how close Squatch must come to its tail to join.
// (gap and join were 34 until everyone in the hall grew 40%, Brian 2026-11-24.)
export const CONGA = Object.freeze({ start: 12, length: 34, speed: 55, gap: 48, join: 44, catchUp: 90, leaveAfter: 0.6 });
export const CONGA_DANCERS = Object.freeze(["teal", "stilt", "backpack"]);
const routeLength = (() => {
  let d = 0;
  for (let i = 0; i < CONGA_ROUTE.length; i++) {
    const a = CONGA_ROUTE[i],
      b = CONGA_ROUTE[(i + 1) % CONGA_ROUTE.length];
    d += Math.hypot(b.x - a.x, b.y - a.y);
  }
  return d;
})();
/** The point `d` along the conga's loop (it wraps), and the way the line faces there. */
export function congaAt(d) {
  d = ((d % routeLength) + routeLength) % routeLength;
  for (let i = 0; i < CONGA_ROUTE.length; i++) {
    const a = CONGA_ROUTE[i],
      b = CONGA_ROUTE[(i + 1) % CONGA_ROUTE.length],
      len = Math.hypot(b.x - a.x, b.y - a.y);
    if (d <= len) return { x: a.x + ((b.x - a.x) * d) / len, y: a.y + ((b.y - a.y) * d) / len, a: Math.atan2(b.y - a.y, b.x - a.x) };
    d -= len;
  }
  return { x: CONGA_ROUTE[0].x, y: CONGA_ROUTE[0].y, a: 0 };
}
/** Where the tail of the line is: the place Squatch joins. */
export function congaTail(c) {
  return congaAt(c.d - CONGA.gap * CONGA_DANCERS.length);
}
const step = stepTo;
/**
 * One frame of the conga. `songT` is the seconds into the current song. Moves the dancers in `p.people` (they walk
 * to their places first, so nobody jumps), and tows Squatch while he is in it. Returns "join", "leave" or "".
 */
export function tickConga(p, dt, songT, s, api) {
  const c = p.conga || (p.conga = { on: false, d: 0, formed: false, joined: false, jt: 0 });
  const want = songT >= CONGA.start && songT < CONGA.start + CONGA.length && !p.closing;
  if (want && !c.on) Object.assign(c, { on: true, d: CONGA.gap * CONGA_DANCERS.length, formed: false });
  if (!want && c.on) {
    c.on = false;
    const was = c.joined;
    c.joined = false;
    for (const id of CONGA_DANCERS) p.people[id] && (p.people[id].task = "");
    return was ? "leave" : "";
  }
  if (!c.on) return "";
  let all = true;
  CONGA_DANCERS.forEach((id, i) => {
    const g = p.people[id];
    if (!g) return;
    g.task = "conga";
    const at = congaAt(c.d - CONGA.gap * i);
    // the line bends round Squatch when he is not in it (nobody walks through him)
    const v = c.formed ? CONGA.speed * 1.6 : CONGA.catchUp,
      there = c.joined ? step(g, at.x, at.y, v, dt) : stepClear(g, at.x, at.y, v, dt, s, CLEAR_OF_SQUATCH);
    g.face = at.a;
    g.dance = 1;
    all = all && there;
  });
  c.formed = c.formed || all;
  c.formed && (c.d += CONGA.speed * dt);
  // Squatch: walking into its tail joins it; then he is towed along, kicking; steering away leaves it.
  let out = "";
  const tail = congaTail(c);
  if (!c.joined && c.formed && api.canJoin && Math.hypot(s.x - tail.x, s.y - tail.y) < CONGA.join) ((c.joined = true), (c.jt = 0), (out = "join"));
  if (c.joined) {
    c.jt += dt;
    if (c.jt > CONGA.leaveAfter && api.steering) return ((c.joined = false), "leave");
    api.tow(tail, CONGA.speed * 2.2, dt);
  }
  return out;
}
