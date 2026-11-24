/**
 * The one capture rule at the party (party plan, "One capture rule"; Brian 2026-11-23 "Runs to wall alarm"; K10;
 * K29; CLAUDE.md "Capture: one rule everywhere"). The same in P2 and P4 (and P7 in half two):
 *   1. "shout": whoever saw Squatch shouts FUR! (drawn over them) ...
 *   2. "run":   ... and runs to the red FUR alarm on the back wall by the hallway doorway.
 *   3. "pull":  the first time in a play, a full-screen close-up shows a hand pulling it.
 *   4. "ring":  the bell rings, the alarm's own light flashes, the guests back away to the walls, and two guards
 *               in blue come in through the hallway doorway with cones.
 *   5. "search": the guards look for him. A guard that sees him walks at him; one that reaches him catches him
 *               (the LOCKUP card naming who saw him and where; the scene restarts). Hidden in either plant, the
 *               guards search, give up and leave: "They lost you." Through his home door, a guard follows him
 *               home half a second later and searches the room (HIDE · bed): "home".
 *   6. "calm":  shown every time: the alarm stops, the guards walk out through the hallway doorway, the witness
 *               walks back and the guests drift back to their spots. After a hide at home this is watched from
 *               the door gap (the peek view).
 * The state lives in the party's game-state field (P.alarm), so a restart clears it. Numbers marked "pinned" are
 * Brian's approved values (docs/TUNING-PINS.json: guard-speed, guard-catch, home-search-delay, cone-feet).
 */
import { SPOTS, HALL } from "./party-hall.js";
import { coneFrom, coneSees, lookAt } from "./party-watch.js";

export const ALARM = Object.freeze({
  shout: 0.9, // seconds the FUR! shows before the witness runs
  run: 320, // the witness's run to the alarm (pixels a second)
  closeUp: 1.8, // the first alarm's close-up of the hand pulling it
  guardGap: 0.5, // the second guard comes in this long after the first
  guard: 120, // pinned: guard-speed
  reach: 36, // pinned: guard-catch
  feet: 70, // pinned: cone-feet (a guard notices him this close whichever way he faces)
  homeDelay: 0.5, // pinned: home-search-delay (a guard follows him home this long after he goes through)
  search: 3.5, // how long the guards search a hidden Squatch before giving up
  homeSearch: 3, // how long the guard searches the home room
  doorLook: 0.8, // the home guard first looks round from the doorway
  bell: 1.6, // the bell rings again this often while the alarm is on
  backAway: 34, // how far guests back away toward the walls
  calm: 140, // walking back to calm (pixels a second)
});
// The home room: where the guard comes in and where he searches from (game positions in the locked home picture).
export const HOME = Object.freeze({ door: { x: 880, y: 470 }, look: { x: 770, y: 470 } });

const step = (o, x, y, speed, dt) => {
  const dx = x - o.x,
    dy = y - o.y,
    d = Math.hypot(dx, dy),
    k = speed * dt;
  if (d <= k || d < 0.5) return ((o.x = x), (o.y = y), true);
  o.x += (dx / d) * k;
  o.y += (dy / d) * k;
  return false;
};

/** Starts the rule: `witness` is { id, x, y } of who saw him, `where` the lockup card's "where-*" line id. */
export function startAlarm(P, witness, where, who = "who-tourist") {
  P.alarm = { phase: "shout", t: 0, w: { id: witness.id, x: witness.x, y: witness.y, hx: witness.x, hy: witness.y }, where, who, guards: [], bell: 0, last: null, hidden: "", lost: false };
}

/**
 * One frame. `api`: { E, size (the cone size), sq () (Squatch's feet), hidden () ("plant", "bed" or ""), room (),
 * closeUp (done) (shows the close-up, calls done), firstTime (), caught (whoId, whereId), lost (), calmDone (how),
 * people () (P.people: guests who back away and drift back) }.
 */
export function tickAlarm(P, dt, api) {
  const a = P.alarm;
  if (!a) return;
  a.t += dt;
  const E = api.E,
    sq = api.sq(),
    hidden = api.hidden();
  if (a.phase === "shout") {
    a.t >= ALARM.shout && ((a.phase = "run"), (a.t = 0));
    return;
  }
  if (a.phase === "run") {
    if (step(a.w, SPOTS.alarmRun.x, SPOTS.alarmRun.y, ALARM.run, dt)) {
      a.phase = "pull";
      a.t = 0;
      if (api.firstTime()) ((a.closeUp = true), api.closeUp(() => ((a.closeUp = false), ring(a, E))));
      else ring(a, E);
    }
    return;
  }
  if (a.phase === "pull") return;
  // The bell keeps ringing while the alarm is on; the guests back away toward the walls.
  if (a.phase === "ring" || a.phase === "search" || a.phase === "home") {
    a.bell -= dt;
    a.bell <= 0 && ((a.bell = ALARM.bell), E.sfx("alarm"));
    for (const g of Object.values(api.people())) step(g, g.hx + g.ax, g.hy + g.ay, ALARM.calm, dt);
  }
  if (a.phase === "ring") {
    a.guards.length < 2 && a.t >= a.guards.length * ALARM.guardGap && a.guards.push({ x: SPOTS.guardIn.x, y: SPOTS.guardIn.y, a: Math.PI, room: "hall" });
    a.guards.length === 2 && ((a.phase = "search"), (a.t = 0));
  }
  if (a.phase === "ring" || a.phase === "search") {
    if (api.room() !== "hall") {
      // He went through his door: a guard follows him home half a second later.
      a.phase = "home";
      a.t = 0;
      a.homeGuard = null;
      return;
    }
    searchHall(a, dt, api, sq, hidden);
    return;
  }
  if (a.phase === "home") {
    searchHome(a, dt, api, sq, hidden);
    return;
  }
  if (a.phase === "calm") {
    let still = false;
    for (const g of a.guards) {
      const gone = g.room !== "hall" || step(g, SPOTS.guardIn.x + 40, SPOTS.guardIn.y, ALARM.guard, dt);
      g.a = Math.atan2(SPOTS.guardIn.y - g.y, SPOTS.guardIn.x + 40 - g.x);
      gone ? (g.room = "out") : (still = true);
    }
    step(a.w, a.w.hx, a.w.hy, ALARM.calm, dt) || (still = true);
    for (const g of Object.values(api.people())) step(g, g.hx, g.hy, ALARM.calm, dt) || (still = true);
    if (!still && a.t > 0.6) {
      const how = a.hidden;
      P.alarm = null;
      api.calmDone(how);
    }
  }
}

function ring(a, E) {
  a.phase = "ring";
  a.t = 0;
  a.bell = 0;
}

/** The guards' cones (for drawing and for sight). */
export function guardCones(a, size) {
  return (a ? a.guards : []).filter((g) => g.room === "hall").map((g, i) => ({ ...coneFrom("guard" + i, g.x, g.y, g.a, size), hot: !!g.sees }));
}

function searchHall(a, dt, api, sq, hidden) {
  const size = api.size();
  let anySees = false;
  a.guards.forEach((g, i) => {
    const c = coneFrom("guard" + i, g.x, g.y, g.a, size),
      sees = !hidden && (coneSees(c, sq) || Math.hypot(sq.x - g.x, sq.y - g.y) < ALARM.feet);
    g.sees = sees;
    if (sees) ((a.last = { x: sq.x, y: sq.y }), (anySees = true));
    // Walk toward where he was last seen; without one, toward him (they search the hall); hidden, round his plant.
    const to = hidden ? { x: sq.x + (i ? 60 : -60), y: Math.min(HALL.floorBottom, sq.y + 20) } : a.last || { x: sq.x + (i ? 40 : -40), y: sq.y };
    const moving = !step(g, to.x, to.y, ALARM.guard, dt);
    g.a = moving ? Math.atan2(to.y - g.y, to.x - g.x) : g.a + Math.sin(a.t * 2 + i) * dt * 1.5;
    if (!hidden && Math.hypot(sq.x - g.x, sq.y - g.y) < ALARM.reach) {
      api.caught(a.who, a.where);
      a.phase = "caught";
    }
  });
  if (hidden) {
    a.hidden = hidden;
    a.st = (a.st || 0) + dt;
    if (a.st >= ALARM.search) {
      a.phase = "calm";
      a.t = 0;
      api.lost();
    }
  } else a.st = 0;
  return anySees;
}

function searchHome(a, dt, api, sq, hidden) {
  if (!a.homeGuard) {
    if (a.t < ALARM.homeDelay) return;
    a.homeGuard = { x: HOME.door.x + 40, y: HOME.door.y, a: Math.PI, sweep: 0, room: "closet" };
    // the guard in the hall left it to follow him
    a.guards[0] && (a.guards[0].room = "out");
  }
  const g = a.homeGuard;
  if (g.leaving) {
    if (step(g, HOME.door.x + 60, HOME.door.y, ALARM.guard, dt)) {
      a.homeGuard = null;
      a.phase = "calm";
      a.t = 0;
      a.hidden = "bed";
      api.lost();
    }
    g.a = 0;
    return;
  }
  g.door = (g.door || 0) + dt;
  const arrived = g.door > ALARM.doorLook && step(g, HOME.look.x, HOME.look.y, ALARM.guard, dt);
  if (arrived) {
    g.sweep += dt;
    g.a = Math.PI + Math.sin(g.sweep * 1.6) * 0.55;
  } else g.a = g.door > ALARM.doorLook ? Math.atan2(HOME.look.y - g.y, HOME.look.x - g.x) : Math.PI + Math.sin(g.door * 4) * 0.4;
  const c = coneFrom("guard-home", g.x, g.y, g.a, api.size()),
    sees = !hidden && (coneSees(c, sq) || Math.hypot(sq.x - g.x, sq.y - g.y) < ALARM.feet);
  g.sees = sees;
  if (sees) {
    // He walks at Squatch; reaching him is the catch (a guard saw him at home).
    step(g, sq.x, sq.y, ALARM.guard, dt);
    g.a = lookAt(g.x, g.y, { x: sq.x, y: sq.y - 20 });
    if (Math.hypot(sq.x - g.x, sq.y - g.y) < ALARM.reach) {
      api.caught("who-guard", "where-home");
      a.phase = "caught";
    }
  }
  if (hidden && g.sweep >= ALARM.homeSearch) g.leaving = true;
}

/** The home guard's cone, while one is in the home room. */
export function homeGuardCone(a, size) {
  const g = a && a.homeGuard;
  return g ? { ...coneFrom("guard-home", g.x, g.y, g.a, size), hot: !!g.sees } : null;
}
