/**
 * The octopus at the party (party plan P6, "The octopus"; R60(b); Brian 2026-11-24, his click "20 seconds, keep
 * lines, add one"): an over-snacked, huggy tourist. Only after Squatch's first minute in the hall he notices him
 * ("*hic* Fellow tourist!"), throws all his arms out and chases him for 20 seconds. The first hug is just a hug (a
 * squeeze; nothing comes off) and the chase goes on; a second hug knocks a piece of the disguise off. After his 20
 * seconds he gets bored (his arms drop, a sigh) and walks back to the snacks, where everyone can see him go.
 * The state is `p.oct` on the party's game-state object; the drawing is party-octopus-art.js.
 * "Pinned" numbers are Brian's approved values (docs/TUNING-PINS.json).
 */
import { OCTOPUS_SNACKS, stepClear, CLEAR_OF_SQUATCH } from "./party-hall.js";

// Pinned: he gives up after 20 seconds (Brian's yes of 2026-11-24 changed R68's 10), walks at 90, notices within 150
// and hugs within 48 (R68).
export const OCT_CHASE_SECONDS = 20,
  OCT_SPEED = 90,
  OCT_NOTICE = 150,
  OCT_CATCH = 48;
// PLACEHOLDERS for Brian: his stroll to the snacks, the wait between chases, how long a hug squeezes, how long he
// hiccups on the spot after letting go (the kid's head start), how long he stands bored before walking back, and how
// fast his arms come out and drop.
export const OCT = Object.freeze({ stroll: 40, rest: 14, squeeze: 1.1, letGo: 1.6, bored: 1.4, armsOut: 5, armsDrop: 1.2 });

/** True while his arms are out for Squatch (the chase, a hug). */
export const chasing = (o) => !!o && (o.mode === "chase" || o.mode === "hug");

/**
 * One frame of the octopus (the approved octopus guest). `api`: { firstMinute, canChase (Squatch stands in the hall
 * with nothing else open), hidden (he is in a plant) }. Returns what just happened:
 *   "notice"  he has seen Squatch: the chase starts
 *   "hug"     he has caught him: the squeeze starts (Squatch is held until it ends)
 *   "letgo"   a first hug ends: nothing came off, the chase goes on after a hiccup
 *   "off"     a second hug (or a later one) ends: it knocks a piece off, and he goes back to the snacks
 *   "bored"   his 20 seconds are up: his arms drop, then he walks back to the snacks
 *   or "".
 */
export function tickOctopus(p, dt, s, api) {
  const g = p.people["octopus-guest"];
  if (!g) return "";
  const o = p.oct || (p.oct = { mode: "stroll", t: 0, hugs: 0, rest: 0, said: false, arms: 0, wait: 0, ht: 0 });
  o.rest = Math.max(0, o.rest - dt);
  // his arms come out fast for a chase and drop slowly when it is over
  o.arms = chasing(o) ? Math.min(1, o.arms + OCT.armsOut * dt) : Math.max(0, o.arms - OCT.armsDrop * dt);
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
    Object.assign(o, { mode: "chase", t: 0, wait: 0, arms: 1 });
    return "notice";
  }
  if (o.mode === "bored") {
    o.bt += dt;
    o.bt >= OCT.bored && ((o.mode = "back"), (o.rest = OCT.rest));
    return "";
  }
  const d = Math.hypot(s.x - g.x, s.y - g.y) || 1;
  g.face = Math.atan2(s.y - g.y, s.x - g.x);
  if (o.mode === "hug") {
    o.t += dt;
    o.ht += dt;
    if (o.ht < OCT.squeeze) return "";
    // a first hug is just a hug: he lets go, hiccups a moment and the chase goes on; a later one knocks a piece off
    if (o.hugs >= 2) return ((o.mode = "back"), (o.rest = OCT.rest), "off");
    return ((o.mode = "chase"), (o.wait = OCT.letGo), "letgo");
  }
  if (o.mode === "chase") {
    o.t += dt;
    // He gives up if Squatch hides; after his 20 seconds he is bored.
    if (api.hidden) return ((o.mode = "back"), (o.rest = OCT.rest), "");
    if (o.t >= OCT_CHASE_SECONDS) return ((o.mode = "bored"), (o.bt = 0), "bored");
    if (!api.canChase) return "";
    if (o.wait > 0) return ((o.wait -= dt), "");
    g.x += ((s.x - g.x) / d) * OCT_SPEED * dt;
    g.y += ((s.y - g.y) / d) * OCT_SPEED * dt;
    if (d < OCT_CATCH) return ((o.hugs += 1), (o.mode = "hug"), (o.ht = 0), "hug");
  }
  return "";
}
