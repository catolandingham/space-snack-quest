/**
 * The octopus at the party (party plan P6, "The octopus"; R60(b); Brian 2026-11-24, his click "20 seconds, keep
 * lines, add one"; Brian 2026-11-25, showing-5 note 7): an over-snacked, huggy tourist. Only after Squatch's first
 * minute in the hall he notices him ("*hic* Fellow tourist!"), throws all his arms out and lunges: the first hug is
 * just a hug (a squeeze, his hat tips; nothing comes off). Only then does Squatch think "Those arms will pull off my
 * disguise!" and "I gotta juke this fool.", and the real chase starts: nearly as fast as Squatch, arms reaching,
 * hiccup puffs, for 20 seconds. A second hug knocks a piece of the disguise off. After his 20 seconds he gets bored
 * (his arms drop, a sigh) and walks back to the snacks, where everyone can see him go. Later chases (after a rest)
 * have no lunge and no lines.
 * The state is `p.oct` on the party's game-state object; the drawing is party-octopus-art.js.
 * "Pinned" numbers are Brian's approved values (docs/TUNING-PINS.json).
 */
import { OCTOPUS_SNACKS, stepClear, CLEAR_OF_SQUATCH } from "./party-hall.js";
import { SEEN_TOO_LONG_SECONDS } from "./party-watch.js";

// Pinned: he gives up after 20 seconds (Brian's yes of 2026-11-24 changed R68's 10), chases at 170 (Brian's written
// yes of 2026-11-25, showing-5 note 7: "octopus nearly as fast as Squatch"; R68's 90 before; Squatch walks at 190 in
// the hall), notices within 150 and hugs within 48 (R68).
export const OCT_CHASE_SECONDS = 20,
  OCT_SPEED = 170,
  OCT_NOTICE = 150,
  OCT_CATCH = 48;
// PLACEHOLDERS for Brian: his stroll to the snacks, the wait between chases, how long a hug squeezes, how long he
// hiccups on the spot after letting go (the kid's head start), how long he stands bored before walking back, how
// fast his arms come out and drop, and how fast his first lunge is.
// `notice`: how long his "?" takes to fill before he grabs (the same time a guest's "?" takes to turn into "!").
export const OCT = Object.freeze({ stroll: 40, rest: 14, squeeze: 1.1, letGo: 1.6, bored: 1.4, armsOut: 5, armsDrop: 1.2, lunge: 300, notice: SEEN_TOO_LONG_SECONDS });

/** True while his arms are out for Squatch (the lunge, the chase, a hug, and the pause before the chase). */
export const chasing = (o) => !!o && (o.mode === "chase" || o.mode === "hug" || o.mode === "lunge" || o.mode === "ready");

/**
 * One frame of the octopus (the approved octopus guest). `api`: { firstMinute, canChase (Squatch stands in the hall
 * with nothing else open), hidden (he is in a plant) }. Returns what just happened:
 *   "notice"  he has seen Squatch. The first time, he waits (`ready`) for his line, then lunges when the party says
 *             (lunge (p)); after that the chase starts straight away
 *   "hug"     he has caught him: the squeeze starts (Squatch is held until it ends)
 *   "letgo"   a first hug ends: nothing came off. After the first lunge he waits (`ready`) for Squatch's two
 *             thoughts, then the real chase starts (startChase (p)); otherwise the chase goes on after a hiccup
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
    // Squatch close by: his "?" fills in over OCT.notice seconds (party-question.js); it pops into the grab
    const near = !api.firstMinute && o.rest <= 0 && api.canChase && Math.hypot(s.x - g.x, s.y - g.y) < OCT_NOTICE;
    o.qT = near ? (o.qT || 0) + dt : 0;
    if (o.qT < OCT.notice) return "";
    o.qT = 0;
    // the first time: arms out, and he waits for his line before he lunges; later: the chase at once
    Object.assign(o, o.said ? { mode: "chase", t: 0, wait: 0, arms: 1 } : { mode: "ready", t: 0, wait: 0, arms: 1, first: true });
    return "notice";
  }
  if (o.mode === "ready") {
    g.face = Math.atan2(s.y - g.y, s.x - g.x);
    return "";
  }
  if (o.mode === "lunge") {
    const d = Math.hypot(s.x - g.x, s.y - g.y) || 1;
    g.face = Math.atan2(s.y - g.y, s.x - g.x);
    if (d < OCT_CATCH) return ((o.hugs += 1), (o.mode = "hug"), (o.ht = 0), "hug");
    const k = Math.min(1, (OCT.lunge * dt) / d);
    g.x += (s.x - g.x) * k;
    g.y += (s.y - g.y) * k;
    return "";
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
    // (after the first lunge he waits for Squatch's two thoughts: the party starts the real chase, startChase)
    if (o.first) return ((o.mode = "ready"), (o.first = false), "letgo");
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

/** The first time: his line is over and he lunges at Squatch (the first hug is just a hug). */
export function lunge(p) {
  p.oct && p.oct.mode === "ready" && (p.oct.mode = "lunge");
}
/** After the first hug and Squatch's two thoughts: the real chase starts, his 20 seconds from now. */
export function startChase(p) {
  p.oct && p.oct.mode === "ready" && Object.assign(p.oct, { mode: "chase", t: 0, wait: OCT.letGo });
}
