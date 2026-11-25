/**
 * Going home early from the party (Brian 2026-11-25: "any point here he should be able to go back to the room";
 * his answer: "If he goes to closet he can take off costume, but shows mops the flier no matter what"; his click
 * "Worry in the hall, shown at home"). In the party in disguise (P6) his own door is a way home, once he has walked
 * away from it.
 *   Through it he walks home, and the party ends with the same "more to find" card (party-card.js) as after an alarm.
 *   "Back to the party": he walks back out, and the party carries on from where it was (party-free.js `resume`).
 *   "Keep going" (P8c; ↺ restarts it at home in his costume): at home the closet is outlined; OPEN · closet takes the
 *     costume off (the closet opens, the pieces go in, it shuts). Mops comes home after closing time (a little after
 *     the costume comes off, or after HOME_EARLY.wait if he keeps it on), and the talk at home plays (party-talk.js;
 *     with nothing on his head, Mops pats him). Mops still learns from the flyer.
 * Words come only from party-lines.js; this file adds none.
 */
import { HALL_DOOR } from "./party-hall.js";
import { HOME_THINGS, HOME_SPOTS } from "./home-alone.js";
import { partyLine } from "./party-lines.js";
import { anyWorn } from "./party-outfit.js";

// PLACEHOLDERS for Brian: how far he must walk from his door before it takes him home (so walking in does not turn
// him straight round), how long Mops takes to come home once the costume is off, and how long if he keeps it on.
export const HOME_EARLY = Object.freeze({ away: 70, afterCostume: 2.5, wait: 15 });

/** `h`: the party's helpers, with `afterAlarm()` (its card and talk) and `resume (p)` (the party goes on). */
export function createHomeEarly(h) {
  const E = () => h.E();
  const P = () => h.P();

  /** Every frame of P6 in the hall: his door takes him home once he has walked away from it. True when it did. */
  function hallTick(p, s, free) {
    const d = Math.hypot(s.x - HALL_DOOR.x, s.y - HALL_DOOR.y);
    d > HALL_DOOR.r + HOME_EARLY.away && (p.leftDoor = true);
    if (!p.leftDoor || !free || p.pose !== "stand" || p.dance || p.snack || d >= HALL_DOOR.r) return false;
    goHome(p);
    return true;
  }
  /** Through his door: he walks home, and the card. */
  function goHome(p) {
    const e = E(),
      R = h.homeRoom;
    h.control(false);
    p.homeEarly = true;
    p.phase = "walkHome";
    e.walkOff();
    e.queue([
      e.until((dt) => (e.trail(), e.step("sq", HALL_DOOR.x, 636, h.pace.walk, dt))),
      e.run(() => {
        // (the party's music goes on, muffled through his door)
        e.enterRoom("closet", "Q1");
        e.place("sq", R.doorIn.x, R.doorIn.y);
        e.face("sq", -1);
      }),
      e.until((dt) => e.step("sq", R.inside.x, R.inside.y, h.pace.walk, dt)),
      e.run(() => {
        const q = P();
        e.still("sq");
        q.phase = "home";
        h.afterAlarm().underBed(q);
      }),
    ]);
  }
  /** "Back to the party": he walks back out through his door, and the party goes on. */
  function backOut(p) {
    const e = E(),
      R = h.homeRoom;
    p.homeEarly = false;
    p.leftDoor = false;
    p.choice = "";
    h.control(false);
    e.walkOff();
    e.queue([
      e.until((dt) => (e.trail(), e.step("sq", R.doorStep.x, R.doorStep.y, h.pace.walk, dt))),
      e.until((dt) => e.step("sq", R.doorIn.x, R.doorIn.y - 4, h.pace.walk, dt)),
      e.run(() => {
        e.enterRoom("hall", "QA");
        e.place("sq", HALL_DOOR.x, 636);
        e.face("sq", 1);
      }),
      e.until((dt) => e.step("sq", 480, 560, h.pace.walk, dt)),
      e.run(() => P() && h.resume(P())),
    ]);
  }
  /** "Keep going" (and ↺ in it): at home, the party over for him; the closet is his to use; then Mops comes home. */
  function keep(p) {
    const e = E();
    p.scene = "P8c";
    p.phase = "home";
    p.homeEarly = true;
    p.band = false;
    p.choice = "keep";
    p.mopsT = 0;
    p.costumeOffT = null;
    p.mopsComing = false;
    p.doorHeard = false;
    e.forgetSaved();
    e.set("moPose", "hidden");
    e.set("wardrobe", "closed");
    h.chip("");
    h.control(true);
  }
  /** ↺ in "Keep going" home early (or a link to P8c): at home just inside the door, in his costume. */
  function startKeep(p) {
    const e = E(),
      R = h.homeRoom;
    e.room() !== "closet" && e.enterRoom("closet", "Q1");
    e.set("scene", "Q1");
    e.place("sq", R.inside.x, R.inside.y);
    e.face("sq", -1);
    e.set("sqPose", "stand");
    p.pose = "stand";
    p.alarm = null;
    p.tv = null;
    p.lift = null;
    p.take = null;
    p.flyerUp = null;
    p.flyer = "floor";
    p.lostPieces = [];
    keep(p);
  }
  /** OPEN · closet at home early: the costume comes off, piece by piece, into the closet. */
  function costumeOff(p) {
    const e = E(),
      wait = (s) => [e.run(() => (P().pt = 0)), e.until(() => !P() || P().pt >= s)];
    h.control(false);
    e.set("wardrobe", "open");
    e.sfx("open");
    const on = Object.keys(p.outfit).filter((k) => p.outfit[k] && !(p.lostPieces || []).includes(k)),
      steps = [];
    for (const spot of on)
      steps.push(
        ...wait(0.35),
        e.run(() => {
          const q = P();
          q.lostPieces = [...(q.lostPieces || []), spot];
          e.sfx("pickup");
        }),
      );
    steps.push(
      ...wait(0.35),
      e.run(() => {
        e.set("wardrobe", "closed");
        P().costumeOffT = 0;
        h.control(true);
      }),
    );
    e.queue(steps);
  }
  /** Every frame of P8c: Mops comes home after closing time, and the talk. */
  function tick(p, dt) {
    if (p.scene !== "P8c" || p.mopsComing) return;
    p.mopsT += dt;
    p.costumeOffT != null && (p.costumeOffT += dt);
    const e = E(),
      free = e.get("ctrl") && !e.current();
    if (!free) return;
    if ((p.costumeOffT != null && p.costumeOffT >= HOME_EARLY.afterCostume) || p.mopsT >= HOME_EARLY.wait) {
      // Mops's key in the door (heard): Squatch runs for the flyer to show him, and Mops comes in (party-talk.js)
      p.mopsComing = true;
      p.doorHeard = true;
      h.sound.one("door");
      h.control(false);
      e.walkOff();
      e.queue(h.afterAlarm().talk.steps());
    }
  }
  /** The big button at home in P8c: OPEN · closet, while he still has something on. */
  function spots(p) {
    const e = E();
    if (p.scene !== "P8c" || e.room() !== "closet" || p.mopsComing || !anyWorn(p)) return [];
    const [verb, cap] = partyLine("button-closet").split(" · ");
    return [{ id: "undress", verb, cap, who: "sq", x: HOME_SPOTS.closet.x, y: HOME_SPOTS.closet.y, r: HOME_SPOTS.closet.r, thing: HOME_THINGS.closet, f: () => costumeOff(P()) }];
  }
  return { hallTick, goHome, backOut, keep, startKeep, tick, spots };
}
