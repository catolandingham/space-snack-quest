/**
 * The one capture rule at the party (party plan, "One capture rule"; Brian 2026-11-23 "Runs to wall alarm"; K10;
 * K29; CLAUDE.md "Capture: one rule everywhere"). The same in P2 and P4 (and P7 in half two):
 *   1. "shout": whoever saw Squatch shouts FUR! (drawn over them) ...
 *   2. "run":   ... and runs to the red FUR alarm on the back wall by the hallway doorway.
 *   3. "pull":  the first time in a play, a full-screen close-up shows a hand pulling it.
 *   4. "ring":  the bell rings, the alarm's own light flashes, the guests back away to the walls, and two guards
 *               in blue come in through the hallway doorway with cones.
 *   5. "search": the guards walk the hall from point to point, looking round. A guard that sees him walks at him;
 *               one that reaches him catches him (the LOCKUP card naming who saw him and where; the scene restarts).
 *               (At home only the guard's beam finds him; after a party alarm the guard looks round until he is
 *               under the bed.)
 *               Hidden in either plant while no guard is looking, the guards search, give up and leave: "They lost
 *               you." Through his home door, a guard follows him home half a second later and searches the room
 *               (HIDE · bed); not seeing him, he gives up and leaves: "home".
 *   6. "calm":  shown every time: the alarm stops, the guards walk out through the hallway doorway, the witness
 *               walks back and the guests drift back to their spots. After a hide at home this is watched from
 *               the door gap (the peek view).
 * The state lives in the party's game-state field (P.alarm), so a restart clears it. Numbers marked "pinned" are
 * Brian's approved values (docs/TUNING-PINS.json: guard-speed, guard-catch, home-search-delay, cone-feet).
 */
import { SPOTS, HALL, HOME_ROOM, stepTo } from "./party-hall.js";
import { coneFrom, coneSees, lookAt } from "./party-watch.js";

export const ALARM = Object.freeze({
  shout: 0.9, // seconds the FUR! shows before the witness runs
  run: 420, // PLACEHOLDER (was 320; a guest across the hall took 1.7 s, over the old 1.5 s rule) the witness's run to the alarm (pixels a second)
  closeUp: 2.4, // the first alarm's close-up of the hand pulling it: wordless, so it plays itself (Brian 30a: about 2 to 4 seconds)
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
// The home room: where the guard comes in and where he searches from (party-hall.js HOME_ROOM).
const HOME = Object.freeze({ door: HOME_ROOM.guardDoor, look: HOME_ROOM.guardLook });

const step = stepTo;

/** Starts the rule: `witness` is { id, x, y } of who saw him, `where` the lockup card's "where-*" line id. */
export function startAlarm(P, witness, where, who = "who-tourist") {
  P.alarm = { phase: "shout", t: 0, w: { id: witness.id, x: witness.x, y: witness.y, hx: witness.x, hy: witness.y }, where, who, guards: [], bell: 0, last: null, hidden: "", lost: false };
}

/**
 * One frame. `api`: { E, size (the cone size), sq () (Squatch's feet), hidden () ("plant", "bed" or ""), room (),
 * closeUp (done) (shows the close-up, calls done), firstTime (), caught (whoId, whereId), lost (), calmDone (how),
 * people () (P.people: guests who back away and drift back), guardSearched (g) (optional: the home guard has
 * finished looking; true keeps him standing there, `held`, until someone sets him leaving) }.
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
  // The bell keeps ringing while the alarm is on; the guests back away toward the walls. (Not for a guard who
  // follows him home after the hall has calmed down, `quiet`, nor while the guard at home stands talking, `held`.)
  // `over`: Mops has sent the guard off (party-after-alarm.js); the alarm is over for good, nothing rings again.
  if ((a.phase === "ring" || a.phase === "search" || a.phase === "home") && !a.quiet && !a.over && !(a.homeGuard && a.homeGuard.held)) {
    a.bell -= dt;
    a.bell <= 0 && ((a.bell = ALARM.bell), api.bell ? api.bell() : E.sfx("alarm"));
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

// Where the guards look when nobody has seen him: they walk the hall from point to point, looking round at each.
const SEARCH = Object.freeze([
  { x: 470, y: 460 },
  { x: 300, y: 520 },
  { x: 650, y: 540 },
  { x: 480, y: 575 },
  { x: 220, y: 430 },
  { x: 700, y: 430 },
]);

function searchHall(a, dt, api, sq, hidden) {
  const size = api.size();
  // A hide only counts if no guard was looking at him as he stepped in (a.spotted is set then).
  const safe = !!hidden && !a.spotted;
  a.guards.forEach((g, i) => {
    const c = coneFrom("guard" + i, g.x, g.y, g.a, size),
      sees = !safe && (coneSees(c, sq) || Math.hypot(sq.x - g.x, sq.y - g.y) < ALARM.feet);
    g.sees = sees;
    sees && (a.last = { x: sq.x, y: sq.y });
    // Seen: at him. Lost him: to where he was last seen. Otherwise the search walk, point to point.
    g.next = g.next == null ? i * 3 : g.next;
    const to = sees || (a.last && !safe) ? a.last : SEARCH[g.next % SEARCH.length];
    const there = step(g, to.x, to.y, ALARM.guard, dt);
    if (there && !sees) {
      a.last && Math.hypot(a.last.x - g.x, a.last.y - g.y) < 2 && (a.last = null);
      g.look = (g.look || 0) + dt;
      g.a += Math.sin(g.look * 3) * dt * 2.5;
      g.look > 1.2 && ((g.look = 0), (g.next = g.next + 1));
    } else g.a = Math.atan2(to.y - g.y, to.x - g.x);
    if (!safe && a.phase !== "caught" && Math.hypot(sq.x - g.x, sq.y - g.y) < ALARM.reach) {
      api.caught(a.who, a.where);
      a.phase = "caught";
    }
  });
  if (safe) {
    a.hidden = hidden;
    a.st = (a.st || 0) + dt;
    if (a.st >= ALARM.search) {
      a.phase = "calm";
      a.t = 0;
      api.lost();
    }
  } else a.st = 0;
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
    // (by the way he is given, `exit`, first: along the back of the room, clear of Mops)
    if (g.exit && g.exit.length) {
      const w = g.exit[0];
      step(g, w.x, w.y, ALARM.guard, dt) && g.exit.shift();
      g.a = Math.atan2(w.y - g.y, w.x - g.x);
      return;
    }
    if (step(g, HOME.door.x + 60, HOME.door.y, ALARM.guard, dt)) {
      a.homeGuard = null;
      a.phase = "calm";
      a.t = 0;
      a.hidden = "home";
      api.lost();
    }
    g.a = 0;
    return;
  }
  // Held: his search is over and someone has come in to talk to him (party-after-alarm.js lets him go, and may
  // send him a step aside first, `to`).
  if (g.held) {
    g.sees = false;
    if (g.to) {
      g.a = Math.atan2(g.to.y - g.y, g.to.x - g.x);
      step(g, g.to.x, g.to.y, ALARM.guard, dt) && ((g.to = null), g.faceTo != null && (g.a = g.faceTo));
    }
    return;
  }
  // While he sees Squatch (`after`: he saw him last frame) he does not look round or walk back to his looking
  // place: his light stays on Squatch and he keeps coming. Out of his light (under the bed, behind him, too far)
  // Squatch is lost again and he goes back to looking round. (Before, he stepped at Squatch and then back to his
  // looking place every frame, gave up, and "They lost you." was said to a kid standing in his flashlight's light.)
  if (!g.after) {
    g.door = (g.door || 0) + dt;
    const arrived = g.door > ALARM.doorLook && step(g, HOME.look.x, HOME.look.y, ALARM.guard, dt);
    // `turn` (-1 to 1) is how far his head is turned as he looks round: it follows the very swing his cone makes.
    if (arrived) {
      g.sweep += dt;
      g.turn = Math.sin(g.sweep * 1.6);
      // `back`: after a look round with Squatch not under the bed he turns and looks round the other way (the door
      // side), and so on, until he finds him or he is hidden (Brian 2026-11-25: only his beam finds him)
      g.a = (g.back ? 0 : Math.PI) + g.turn * 0.55 * (g.back ? -1 : 1);
    } else if (g.door > ALARM.doorLook) ((g.a = Math.atan2(HOME.look.y - g.y, HOME.look.x - g.x)), (g.turn = 0));
    else ((g.turn = Math.sin(g.door * 4)), (g.a = Math.PI + g.turn * 0.4));
  } else g.turn = 0;
  // At home only his flashlight's beam finds him (Brian 2026-11-25: "It's only if you're in the cone of the
  // security, they see you"): no "this close whichever way he faces" rule here, so he need not be under the bed
  // before the guard walks in.
  const c = coneFrom("guard-home", g.x, g.y, g.a, api.size()),
    sees = !hidden && !a.over && coneSees(c, sq);
  g.sees = sees;
  g.after = sees;
  if (sees) {
    // He walks at Squatch; reaching him is the catch (a guard saw him at home).
    step(g, sq.x, sq.y, ALARM.guard, dt);
    g.a = lookAt(g.x, g.y, { x: sq.x, y: sq.y - 20 });
    if (Math.hypot(sq.x - g.x, sq.y - g.y) < ALARM.reach) {
      api.caught("who-guard", "where-home");
      a.phase = "caught";
    }
  }
  // He gives up after a search with Squatch under the bed. He leaves, unless the party has something to say to him
  // first (`api.guardSearched`: Mops comes in, party-after-alarm.js).
  // Not seeing him, he gives up after a look round (under the bed or not: only the beam finds him). After a party
  // alarm (`api.hideFirst`: Mops comes in and sends him off, and the card waits under the bed) he gives up only once
  // Squatch is under the bed; until then he turns and looks round the other way.
  if (!sees && g.sweep >= ALARM.homeSearch) {
    if (hidden !== "bed" && api.hideFirst && api.hideFirst()) return void ((g.sweep = 0), (g.back = !g.back));
    api.guardSearched && api.guardSearched(g) ? ((g.held = true), (g.turn = null)) : (g.leaving = true);
  }
}

/** The home guard's cone, while one is in the home room; `draw` moves where it is drawn (his flashlight). */
export function homeGuardCone(a, size, draw = null) {
  const g = a && a.homeGuard;
  return g ? { ...coneFrom("guard-home", g.x, g.y, g.a, size, draw), hot: !!g.sees } : null;
}
