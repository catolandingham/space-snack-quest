/**
 * The party's wordless toys (party plan P6, "The toys"): the conga line, the band photo, the octopus, the plants
 * that snag, and the vent's tug (the hallway doorway's bounce is party-hallway.js). Each is a small state on the party's game-state
 * object `p` and one tick function. All are optional, and nothing here gives a goal chip or an outline.
 * Numbers marked PLACEHOLDER are the builder's guesses for Brian to tune; "pinned" ones are his approved values
 * (docs/TUNING-PINS.json).
 */
import { CONGA_ROUTE, PHOTO_FRAME, HALL, OCTOPUS_SNACKS, stepTo, stepClear, CLEAR_OF_SQUATCH } from "./party-hall.js";
import { VENT, ventDistance } from "./party-vent.js";
import { bump, tipNext, knockOff, bumpSpot, anyWorn, furShows } from "./party-outfit.js";

// ---------- the conga line ----------
// PLACEHOLDERS: when in each song the conga forms (seconds into the song), how long it lasts, how fast it goes,
// how far apart the dancers are, and how close Squatch must come to its tail to join.
export const CONGA = Object.freeze({ start: 12, length: 34, speed: 55, gap: 34, join: 34, catchUp: 90, leaveAfter: 0.6 });
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

// ---------- the band photo ----------
// PLACEHOLDERS: the camera's rhythm (seconds waiting, then the 3-2-1 count), and how long the Polaroid shows.
// The bonus is pinned (R60, PHOTO_BONUS in docs/TUNING-PINS.json).
export const PHOTO = Object.freeze({ wait: 6, count: 3, flash: 0.25, polaroid: 3.2, cheeseNear: 230 });
export const PHOTO_BONUS = 25;
export const inPhoto = (s) => s.x > PHOTO_FRAME.x0 && s.x < PHOTO_FRAME.x1 && s.y > PHOTO_FRAME.y0 && s.y < PHOTO_FRAME.y1;
/** One frame of the camera. Returns "count" when the 3-2-1 starts, "beep" on each count, "flash", "photo" (he is in it), or "". */
export function tickPhoto(p, dt, s, visible) {
  const ph = p.photo || (p.photo = { t: 0, phase: "wait", n: 0, taken: false, pol: 0 });
  ph.pol = Math.max(0, ph.pol - dt);
  ph.t += dt;
  if (ph.phase === "wait" && ph.t >= PHOTO.wait) return ((ph.phase = "count"), (ph.t = 0), (ph.n = 3), "count");
  if (ph.phase === "count") {
    const n = 3 - Math.floor(ph.t);
    if (n !== ph.n && n > 0) return ((ph.n = n), "beep");
    if (ph.t >= PHOTO.count) {
      ph.phase = "flash";
      ph.t = 0;
      if (!ph.taken && visible && inPhoto(s)) return ((ph.taken = true), (ph.pol = PHOTO.polaroid), "photo");
      return "flash";
    }
  }
  if (ph.phase === "flash" && ph.t >= PHOTO.flash) ((ph.phase = "wait"), (ph.t = 0));
  return "";
}

// ---------- the octopus ----------
// Pinned (R68): he gives up after 10 seconds, walks at 90, notices within 150 and hugs within 48. PLACEHOLDERS:
// the wait between chases and his stroll to the snacks. He never starts in Squatch's first minute in the hall.
export const OCT_CHASE_SECONDS = 10,
  OCT_SPEED = 90,
  OCT_NOTICE = 150,
  OCT_CATCH = 48;
export const OCT = Object.freeze({ stroll: 40, rest: 14 });
/** One frame of the octopus (the approved octopus guest). Returns "notice", "hug" or "". */
export function tickOctopus(p, dt, s, api) {
  const g = p.people["octopus-guest"];
  if (!g) return "";
  const o = p.oct || (p.oct = { mode: "stroll", t: 0, hugs: 0, rest: 0, said: false });
  o.rest = Math.max(0, o.rest - dt);
  if (o.mode === "stroll" || o.mode === "back") {
    g.task = "octopus";
    const gx = g.x,
      gy = g.y,
      // round Squatch, never through him; if he stands on the snack spot, the octopus stops where he is
      there = stepClear(g, OCTOPUS_SNACKS.x, OCTOPUS_SNACKS.y, OCT.stroll, dt, s, CLEAR_OF_SQUATCH) || (g.x === gx && g.y === gy && Math.hypot(s.x - OCTOPUS_SNACKS.x, s.y - OCTOPUS_SNACKS.y) < CLEAR_OF_SQUATCH * 2);
    g.face = Math.atan2(OCTOPUS_SNACKS.y - g.y, OCTOPUS_SNACKS.x - g.x);
    there && ((o.mode = "snacks"), (g.face = Math.PI));
    return "";
  }
  if (o.mode === "snacks") {
    if (api.firstMinute || o.rest > 0 || !api.canChase || Math.hypot(s.x - g.x, s.y - g.y) >= OCT_NOTICE) return "";
    o.mode = "chase";
    o.t = 0;
    return "notice";
  }
  if (o.mode === "chase") {
    o.t += dt;
    const d = Math.hypot(s.x - g.x, s.y - g.y) || 1;
    g.face = Math.atan2(s.y - g.y, s.x - g.x);
    // He waits while the lines are up; he gives up after his time, or if Squatch hides.
    if (o.t >= OCT_CHASE_SECONDS || api.hidden) return ((o.mode = "back"), (o.rest = OCT.rest), "");
    if (!api.canChase) return "";
    g.x += ((s.x - g.x) / d) * OCT_SPEED * dt;
    g.y += ((s.y - g.y) / d) * OCT_SPEED * dt;
    if (d < OCT_CATCH) return ((o.hugs += 1), (o.mode = "back"), (o.rest = OCT.rest), "hug");
  }
  return "";
}

// ---------- the plants (in disguise they snag a piece) ----------
// PLACEHOLDER: how close to a plant's leaves his feet come to brush past it.
export const PLANT_BRUSH = 14;
/** The plant Squatch's feet are brushing past now, or "". */
export function brushing(s) {
  for (const pl of HALL.plants) {
    const b = pl.leaves,
      pot = pl.pot;
    if (s.x > b.x0 - PLANT_BRUSH && s.x < b.x1 + PLANT_BRUSH && s.y > b.y1 - 24 && s.y < pot.y1 + PLANT_BRUSH) return pl.id;
  }
  return "";
}
/** One frame: a new brush past a plant tips a piece, a second knocks it off into the leaves. Returns "tip", "off" or "". */
export function tickPlants(p, s, scale, firstMinute) {
  const id = brushing(s),
    was = p.brush || "";
  p.brush = id;
  if (!id || id === was || furShows(p)) return "";
  const pl = HALL.plants.find((q) => q.id === id);
  return bump(p, s, scale, "plant", { x: (pl.leaves.x0 + pl.leaves.x1) / 2, y: pl.leaves.y0 + 18 }, firstMinute);
}

// ---------- the vent, in disguise: it tugs a piece ----------
/**
 * One frame of the vent's tug (Brian 2026-11-23: "No, it tugs the disguise"): close to it, the next piece tips
 * toward the vent (the warning: a sound, a shake and the piece drawn big over him); if he stays, the piece is
 * sucked in. In his first minute it only tips. With nothing left on, the no-disguise fur rule takes over
 * (party-vent.js). Returns "warn", "off" or "".
 */
export function tickTug(p, dt, s, scale, firstMinute) {
  const v = p.tug || (p.tug = { t: 0, shake: 0, spot: "" });
  v.shake = Math.max(0, v.shake - dt);
  if (!anyWorn(p) || ventDistance(s) > VENT.near) return ((v.t = 0), (v.spot = ""), "");
  const first = v.t === 0;
  v.t += dt;
  if (first) return ((v.spot = tipNext(p)), (v.shake = 0.4), "warn");
  if (v.t >= VENT.stay && !firstMinute) {
    v.t = 0;
    const spot = bumpSpot(p);
    spot && knockOff(p, spot, s, scale, "vent");
    v.spot = "";
    return "off";
  }
  return "";
}
