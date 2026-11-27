/**
 * The lunch sneak, Chapter 1 beats 25 to 27 (docs/CH1-STORY-WALKTHROUGH.md): sneak the lunch to Mops, "My lunch!
 * You're the best.", and one snack behind the counter. It follows the home morning (TAKE · lunch, home-morning.js,
 * through 14-ch1-day2.js ch1TakeLunch) and hands over to beat 28 as it is today (the PA, 14-ch1-day2.js ch1ShipCall).
 * What the player sees, step by step (plan reviewed by Fable 2026-11-26; every word from lunch-sneak-lines.js, every
 * place and number from lunch-sneak-place.js, every new drawing from lunch-sneak-art.js):
 *   walkin  wordless: in the hallway doorway (top right) Mops mops his way out of sight; Squatch comes up through his
 *           home doorway with the lunch bag in his paw. The two watchers' cones are drawn whole.
 *   plant   "Squatch: take Mops his lunch"; the middle plant glows. HIDE · plant: only his eyes in the leaves.
 *   crate   the crates glow. The teal guest's cone sweeps across the way to them on her rhythm ("?" warns a turn).
 *   door    the hallway doorway glows. The camera tourist's cone lies along that way on his rhythm. SNEAK · hallway.
 *           Seen (0.8 s in a cone): the party's one capture rule (party-alarm.js), "Squatch: hide", every hiding
 *           place glows; hidden: "They lost you." and on; caught: the LOCKUP card, and the step he was on restarts.
 *   arrive  wordless, the hallway: he walks in from the left; Mops, mopping, stops, looks up at him, looks left and
 *           right (nobody saw), and faces him.
 *   give    "Squatch: give Mops his lunch"; Mops glows. GIVE · lunch: the bag goes from his paw to Mops's hoof, one
 *           heart, "My lunch! You're the best." (NEXT), then the wordless cutaway: Mops eats the lunch, then the bag.
 *   back    "Squatch: go on"; Mops waits in the left doorway, which is outlined; walking there takes them both back
 *           into the hall, down behind the snack counter, where Squatch ducks (only the counter's guest is near).
 *   one     the counter guest's cone lies over the ducked Squatch and stays grey; the plate of Moon Pies glows and
 *           Mops says "...you know the rule, grab one snack." (NEXT).
 *   snack   "Squatch: grab one snack"; TAKE · snack (first offered as the guest turns away): he stands up, reaches,
 *           takes the top pie and ducks. Seen while up: the pie stays on the plate and the same capture rule runs.
 *   chew    wordless: he eats it. Then beat 28, unchanged.
 * Its progress lives in the game-state field ch1Lunch, and ch1Step is "lu-<step>" at each step the player controls,
 * so the step restart (↺, 20-ch2.js) brings back the step he is on.
 */
import { LUNCH_PLACES, DOOR_WAY, WATCHERS, COUNTER_WATCHER, RHYTHM, RHYTHM_LENGTH, watcherNow, AISLE, COUNTER_SPOTS, HALLWAY_SPOTS, LUNCH_SOLIDS, LUNCH_BOUNDS, LUNCH_PACE, LUNCH_SIZES, COUNTER_CLOSEUP } from "./lunch-sneak-place.js";
import { lunchWords } from "./lunch-sneak-lines.js";
import { drawCrates, drawPlate, drawNextGlow, drawHeart, drawBagInPaw, drawReach, drawPie, sqPawAt, pieY, BAG_IN_HALL, drawCounterCloseUp, counterCloseUpBox } from "./lunch-sneak-art.js";
import { drawLunchBag } from "./home-morning-art.js";
import { HALL, HALL_PICTURE, SPOTS } from "./party-hall.js";
import { coneFrom, coneSees, lookAt, SEEN_TOO_LONG_SECONDS } from "./party-watch.js";
import { startAlarm, tickAlarm, guardCones, ALARM } from "./party-alarm.js";
import { drawHall } from "./party-draw.js";
import { drawAlarmCloseUp } from "./party-art.js";
import { partyLine, lockupCause } from "./party-lines.js";
import { tickQuestions, questions } from "./party-question.js";
import { openFullScreen, closeFullScreen } from "./fullscreen.js";
import { createPartySound } from "./party-sound.js";
import { createHomeMorningSound, HOME_MORNING_SOUND } from "./home-morning-sound.js";
import { cutawaySteps, LUNCH_EAT } from "./cutaway.js";
import { footfall } from "./footfalls.js";
import { adultPxFor } from "./room-sizes.js";
import { drawGanitorWall } from "./ganitor.js";

export const LUNCH_ID = "ch1-lunch";
// The eating cutaway (cutaway.js PANELS "lunch") and its sounds: [seconds into it, synth.js sound].
export const LUNCH_EAT_ID = "lunch";
export const EAT_SOUNDS = Object.freeze([...LUNCH_EAT.bites.map((t) => [t, "chomp"]), ...LUNCH_EAT.bagBites.map((t) => [t, "crunch"])]);
// The steps the player controls (ch1Step "lu-<step>"), in order.
export const LUNCH_STEPS = Object.freeze(["plant", "crate", "door", "give", "back", "snack"]);
// Who says who saw him on the LOCKUP card: every guest is "A tourist", as at the party (party.js WITNESS).
const WHO = "who-tourist",
  WHERE = "where-hall";

export function createLunchSneak(bridge) {
  const E = () => bridge.engine();
  const picture = typeof Image !== "undefined" ? Object.assign(new Image(), { src: HALL_PICTURE }) : null;
  const sound = createHomeMorningSound(() => bridge.engine(), bridge.morningSound);
  const psound = createPartySound(() => bridge.engine());
  const firstAlarm = { seen: false };
  const L = () => {
    const e = E();
    return e ? e.get("ch1Lunch") : null;
  };
  const live = () => {
    const l = L(),
      e = E();
    return l && e && e.get("ch1Day2") && l.step && l.step !== "done" ? l : null;
  };
  let ff = {},
    wallDrew = null,
    closeUpNow = null,
    pads = 0,
    drew = null,
    eatHeard = -1,
    record = { steps: [] };
  const inHall = () => E().room() === "hall";

  // ---------- small helpers ----------
  const go = (step, extra) => {
    Object.assign(L(), { step, t0: 0 }, extra || {});
    record.steps.push(step);
  };
  const chip = (id) => (E().set("ch1Chip", id ? lunchWords(id) : ""), E().chipNow());
  const control = (chipId) => {
    const e = E(),
      l = L();
    e.set("ch1Step", "lu-" + l.step);
    chip(chipId);
    e.set("ctrl", true);
    e.set("ch1Sneak", l.step !== "give" && l.step !== "back");
  };
  const busy = () => {
    const e = E();
    e.set("ctrl", false);
    e.set("act", null);
    e.set("ch1Chip", "");
    e.still("sq");
    e.chipNow();
  };
  const sqScale = () => (inHall() ? E().hallSizes().squatch : (adultPxFor(E().room()) * 0.8) / 45);
  const mopsScale = () => sqScale() * 1.15;
  const watchers = (l) => (l.counter ? [...WATCHERS, COUNTER_WATCHER] : WATCHERS);
  function freshPeople(counter) {
    const out = {};
    for (const w of counter ? [...WATCHERS, COUNTER_WATCHER] : WATCHERS) {
      const dx = w.x - 480,
        dy = w.y - 450,
        d = Math.hypot(dx, dy) || 1;
      out[w.id] = { x: w.x, y: w.y, hx: w.x, hy: w.y, ax: (dx / d) * ALARM.backAway, ay: (dy / d) * ALARM.backAway * 0.6 };
    }
    return out;
  }
  const fresh = (extra) => ({
    step: "",
    t: 0,
    t0: 0,
    reached: 0,
    pose: "stand",
    hideAt: "",
    bag: "paw",
    pies: 3,
    pie: "plate",
    grab: null,
    heart: -1,
    alarm: null,
    people: freshPeople(false),
    seenBy: "",
    seenT: 0,
    qs: {},
    counter: false,
    mops: null,
    ballNear: {},
    ...(extra || {}),
  });

  // ---------- beat 25: the hall ----------
  /** TAKE · lunch at home hands over here (14-ch1-day2.js ch1TakeLunch). */
  function start() {
    const e = E();
    ff = {};
    firstAlarm.seen = false; // a new lunch: the first alarm shows its close-up again (as the party's start does)
    eatHeard = -1;
    e.set("ch1Lunch", fresh({ mops: { x: LUNCH_PLACES.door.stand.x + 4, y: 316, f: 1, mop: true } }));
    busy();
    e.set("ch1Sneak", false);
    e.set("moPose", "hidden");
    e.set("sqPose", "stand");
    e.enterRoom("hall", "QB");
    e.place("sq", LUNCH_PLACES.start.from.x, LUNCH_PLACES.start.from.y);
    e.face("sq", -1);
    e.set("scene", "QB");
    go("walkin");
    sound.effect("grab");
    const P = LUNCH_PACE;
    e.queue([
      e.until((dt) => ((L().t0 += dt || 0), e.step("sq", LUNCH_PLACES.start.x, LUNCH_PLACES.start.y, 120, dt || 0) && L().t0 >= 0.5)),
      // Mops mops his way out through the hallway doorway (that is where he is)
      e.until((dt) => {
        const m = L().mops;
        m.walk = true;
        m.x += 90 * (dt || 0);
        return m.x > 1000;
      }),
      e.run(() => {
        L().mops = null;
        go("plant");
        control("chip-sneak");
      }),
    ]);
  }
  // Squatch is hidden (plant, crates, or ducked behind the counter): no cone can see him.
  const inAisle = (p) => p.x > AISLE.x0 && p.x < AISLE.x1 && p.y > AISLE.y0 && p.y < AISLE.y1 + 8;
  // Rolled into a ball he is hidden too, until someone has noticed him by the ball rule (ballNoticed).
  const hiddenNow = (l) => l.pose === "hidden" || (l.pose === "ducked" && inAisle(E().pos("sq"))) || (l.pose === "ball" && !ballNoticed(l));
  // The ball rule (DECISIONS C20, R43; the older program's numbers, engine().ball): a balled-up Squatch is noticed only
  // by someone who stays within `radius` of him for `seconds`, looking his way (his cone would see him standing).
  const BALL = () => E().ball || { radius: 70, seconds: 2 };
  const ballNoticed = (l) => Object.values(l.ballNear || {}).some((t) => t >= BALL().seconds);
  // (Time counts while someone is within reach AND looking his way: R43 reads "within 70 px for 2 s, whose cone would
  // see him"; the older program's night check only asks the cone at the end. Brian's "same ball rule" read this way.)
  function ballWatch(l, dt) {
    const s = sqPoint(),
      B = BALL(),
      near = {};
    for (const c of l.pose === "ball" ? coneList(l) : []) Math.hypot(s.x - c.x, s.y - c.y) <= B.radius && coneSees(c, s) && (near[c.id] = true);
    const was = l.ballNear || {};
    l.ballNear = {};
    for (const id of Object.keys(near)) l.ballNear[id] = (was[id] || 0) + dt;
  }
  /** ROLL · ball (C20, "ball anytime"; Brian 2026-11-26: offered in the lunch sneak): he rolls up where he stands. */
  function rollUp() {
    const e = E(),
      l = L();
    // a guard watching him roll up knows where he is (as stepping into a hiding place)
    l.alarm && (l.alarm.spotted = l.alarm.guards.some((g) => g.sees));
    e.still("sq");
    e.stopWalk && e.stopWalk();
    e.set("sqPose", "ball");
    l.pose = "ball";
    l.hideAt = "";
    l.ballNear = {};
    sound.effect("hide");
  }
  function hideIn(where) {
    const e = E(),
      l = L(),
      place = LUNCH_PLACES[where];
    // A guard watching him step in knows where he is: that hide does not count (as at the party).
    l.alarm && (l.alarm.spotted = l.alarm.guards.some((g) => g.sees));
    e.place("sq", place.stand.x, place.stand.y);
    e.still("sq");
    // (a tap's walk that brought him here ends: still going, it would count as steering and step him out at once)
    e.stopWalk && e.stopWalk();
    e.set("sqPose", "hidden");
    l.pose = "hidden";
    l.hideAt = where;
    sound.effect("hide");
    // a hiding place is a safe spot: the step restart starts here from now on (hidden in it)
    if (!l.alarm) {
      l.reached = Math.max(l.reached, where === "plant" ? 1 : 2);
      go(l.reached === 1 ? "crate" : "door");
      control("chip-sneak");
    }
  }
  function toHallway() {
    const e = E(),
      l = L();
    busy();
    // (never into the hallway rolled up)
    l.pose = "stand";
    l.ballNear = {};
    e.set("sqPose", "stand");
    e.set("ch1Sneak", false);
    go("tohall");
    e.walkOff();
    e.queue([
      e.until((dt) => (e.trail(), e.step("sq", 952, 306, LUNCH_PACE.walk, dt || 0))), // into the doorway (walks stay on the picture)
      e.run(() => {
        e.enterRoom("passage", "QB");
        e.place("sq", HALLWAY_SPOTS.in.x, HALLWAY_SPOTS.in.y);
        e.face("sq", 1);
        e.set("moPose", "hidden");
        e.place("mops", HALLWAY_SPOTS.mops.x, HALLWAY_SPOTS.mops.y);
        e.face("mops", -1);
        L().mops = { x: HALLWAY_SPOTS.mops.x, y: HALLWAY_SPOTS.mops.y, f: -1, mop: true };
        go("arrive");
      }),
      e.until((dt) => e.step("sq", HALLWAY_SPOTS.stop.x, HALLWAY_SPOTS.stop.y, LUNCH_PACE.hallwayWalk, dt || 0)),
      e.run(() => (e.still("sq"), (L().mops.mop = false), (L().t0 = 0))),
      // he stops mopping and looks up; then left, right (nobody saw); then at Squatch
      e.until((dt) => {
        const m = L();
        m.t0 += dt || 0;
        const k = m.t0 - LUNCH_PACE.noticeStop;
        m.mops.f = k < 0 ? -1 : k < LUNCH_PACE.lookBoth / 2 ? 1 : -1;
        return k >= LUNCH_PACE.lookBoth + 0.2;
      }),
      e.run(() => {
        e.set("moPose", "stand");
        e.face("mops", -1);
        L().mops = null;
        go("give");
        control("chip-give");
      }),
    ]);
    l.hideAt = "";
  }

  // ---------- beat 26: the hallway ----------
  function give() {
    const e = E(),
      l = L();
    busy();
    go("given", { give: e.time() });
    sound.effect("pickup");
    e.face("sq", 1);
    e.queue([
      e.until(() => e.time() - L().give >= LUNCH_PACE.give),
      e.run(() => ((L().bag = "mops"), (L().heart = e.time()))),
      e.until(() => e.time() - L().heart >= LUNCH_PACE.heart * 0.6),
      e.say("mops", lunchWords("mops-lunch")),
      e.run(() => ((L().heart = -1), (eatHeard = -1))),
      ...cutawaySteps(LUNCH_EAT_ID),
      e.run(() => {
        L().bag = "eaten";
        // Mops sets off back toward the hall and waits in the left doorway for him
        go("mopsBack");
        e.set("moPose", "stand");
      }),
      e.until((dt) => (e.face("mops", -1), e.moWalking(true), e.step("mops", HALLWAY_SPOTS.mopsBack.x, HALLWAY_SPOTS.mopsBack.y, LUNCH_PACE.mopsWalk, dt || 0))),
      e.run(() => {
        e.moWalking(false);
        e.still("mops");
        e.face("mops", 1);
        go("back");
        control("chip-back");
      }),
    ]);
    l.heart = -1;
  }
  function backToHall() {
    const e = E();
    busy();
    go("tocounter", { counter: true, people: freshPeople(true), counterT: 0 });
    e.walkOff();
    e.queue([
      // both go out through the left doorway, Mops first
      e.until((dt) => {
        e.moWalking(true);
        const a = e.step("mops", 8, HALLWAY_SPOTS.back.y - 30, LUNCH_PACE.mopsWalk, dt || 0);
        return e.step("sq", 8, HALLWAY_SPOTS.back.y, LUNCH_PACE.walk, dt || 0) && a;
      }),
      e.run(() => {
        e.moWalking(false);
        e.enterRoom("hall", "QB");
        e.set("moPose", "stand");
        e.place("mops", COUNTER_SPOTS.in.x + 10, COUNTER_SPOTS.in.y);
        e.place("sq", COUNTER_SPOTS.in.x - 20, COUNTER_SPOTS.in.y + 8);
        e.face("mops", -1);
        e.face("sq", -1);
        L().counterT = 0;
      }),
      // in through the hallway doorway and down behind the counter: Squatch first, Mops after him
      e.until((dt) => e.step("sq", COUNTER_SPOTS.top.x, COUNTER_SPOTS.top.y, LUNCH_PACE.walk, dt || 0)),
      e.until((dt) => {
        const b = e.step("mops", COUNTER_SPOTS.top.x, COUNTER_SPOTS.top.y, LUNCH_PACE.mopsWalk, dt || 0);
        return e.step("sq", COUNTER_SPOTS.sq.x, COUNTER_SPOTS.sq.y, LUNCH_PACE.walk, dt || 0) && b;
      }),
      e.until((dt) => e.step("mops", COUNTER_SPOTS.mops.x, COUNTER_SPOTS.mops.y, LUNCH_PACE.mopsWalk, dt || 0)),
      e.run(() => {
        e.still("sq");
        e.still("mops");
        e.face("mops", 1);
        e.face("sq", -1);
        L().pose = "ducked";
        e.set("sqPose", "stand");
        L().counterT = 0;
        go("one", { oneAt: e.time() });
      }),
      // Mops's one-snack line (Brian 2026-11-26, approved word for word), waiting for NEXT, while the guest at the
      // counter looks over him (the cone stays grey); TAKE · snack comes up as that guest turns away.
      e.say("mops", lunchWords("mops-one-snack")),
      e.until(() => watcherNow(COUNTER_WATCHER, L().counterT).phase === "away"),
      e.run(() => (go("snack"), control("chip-snack"))),
    ]);
  }

  // ---------- beat 27: one snack ----------
  function takeSnack() {
    const e = E(),
      l = L();
    if (l.grab || l.pies < 3) return;
    e.set("ctrl", false);
    e.set("act", null);
    e.still("sq");
    l.grab = { t: 0 };
    l.pose = "up";
    chip("");
    go("grab");
  }
  // Seen while he is up: the pie goes back, he ducks, and the one capture rule runs.
  function grabSeen(w) {
    const l = L();
    l.grab = null;
    // the pie goes back on the plate (none taken)
    l.pie = "plate";
    l.pies = 3;
    l.pose = "ducked";
    go("snack");
    raise(w);
    E().set("ctrl", true);
  }
  function grabTick(dt) {
    const e = E(),
      l = L(),
      P = LUNCH_PACE,
      g = l.grab;
    g.t += dt;
    const reachEnd = P.up + P.reach;
    if (l.pie === "plate" && g.t >= reachEnd) ((l.pie = "paw"), (l.pies = 2), sound.effect("grab"));
    if (g.t >= reachEnd + P.back) l.pose = "ducked";
    if (g.t >= reachEnd + P.back + P.down) {
      l.grab = null;
      go("chew", { chewAt: e.time() });
      sound.morning("chomp");
      e.queue([
        e.until(() => e.time() - L().chewAt >= P.chew),
        e.run(() => {
          L().pie = "eaten";
          handOff();
        }),
      ]);
    }
  }
  function handOff() {
    const e = E();
    // (drawn ducked only while he is still at his place behind the counter: view())
    L().pose = "stand";
    go("handoff");
    e.set("ch1Sneak", false);
    chip("");
    // beat 28, as it is today: the PA, the talk, the walk to the loading bay
    e.shipCall();
  }

  // ---------- sight and the one capture rule ----------
  const sqPoint = () => E().pos("sq");
  function coneList(l) {
    const size = E().coneSize(),
      t = l.t;
    const out = [];
    for (const w of watchers(l)) {
      const at = l.people[w.id] || w;
      const clock = w === COUNTER_WATCHER ? l.counterT || 0 : t;
      out.push({ ...coneFrom(w.id, at.x, at.y, watcherNow(w, clock).a, size), always: true, bold: true });
    }
    if (l.alarm) {
      out.push(...guardCones(l.alarm, size));
      const c = out.find((q) => q.id === l.alarm.w.id);
      c && Object.assign(c, coneFrom(c.id, l.alarm.w.x, l.alarm.w.y, lookAt(l.alarm.w.x, l.alarm.w.y, HALL.alarm), size));
    }
    return out;
  }
  function raise(w) {
    const e = E(),
      l = L(),
      at = l.people[w.id] || w;
    startAlarm(l, { id: w.id, x: at.x, y: at.y }, WHERE, WHO);
    e.sfx("bleep");
    // the FUR! moment's sting, once, as at the party (music-picks.js "caught"); the music stops (alarmOn)
    psound.sting();
    l.seenBy = "";
    l.seenT = 0;
    // behind the counter he is already hidden: no "hide" goal there
    chip(l.counter ? "" : "chip-hide");
  }
  function alarmApi() {
    const e = E(),
      l = L();
    return {
      E: e,
      size: () => e.coneSize(),
      sq: sqPoint,
      hidden: () => (hiddenNow(L()) ? "plant" : ""),
      room: () => e.room(),
      people: () => L().people,
      firstTime: () => !firstAlarm.seen,
      bell: () => psound.one("bell"),
      // Wordless, nothing to tap: it plays itself for ALARM.closeUp seconds of game time (tick ends it), then the bell.
      closeUp(done) {
        firstAlarm.seen = true;
        closeUpNow = { done, at: e.time(), wasCtrl: e.get("ctrl") };
        e.set("ctrl", false);
        let t0 = null;
        openFullScreen({
          label: "fur alarm",
          draw(ctx, w, h, t) {
            t0 == null && (t0 = t);
            drawAlarmCloseUp(ctx, w, h, picture, HALL.alarmPicture, Math.min(1, (t - t0) / 0.8), t);
          },
        });
      },
      caught(whoId, whereId) {
        e.catchSquatch(lockupCause(whoId, whereId));
      },
      lost() {
        psound.one("lost");
        e.lostYou(partyLine("note-lost"));
        chip(L().counter ? "" : "chip-sneak");
      },
      calmDone() {
        const q = L();
        if (q.counter) return chip("chip-snack");
        // hidden through the search in a place further on than he had reached: the glow moves past it
        const k = q.hideAt === "crate" ? 2 : q.hideAt === "plant" ? 1 : 0;
        k > q.reached && ((q.reached = k), go(k === 1 ? "crate" : "door"));
        control("chip-sneak");
      },
    };
  }

  // The snack counter close-up shows from Mops's line to the chew (lunch-sneak-place.js COUNTER_CLOSEUP).
  const closeUpShows = (l) => !!l && l.counter && COUNTER_CLOSEUP.steps.includes(l.step) && inHall();

  // ---------- every frame ----------
  function tick(dt) {
    const l = live(),
      e = E();
    if (!l) return;
    dt = dt || 0;
    closeUpShows(l) ? l.cuAt == null && (l.cuAt = e.time()) : (l.cuAt = null);
    psound.tick(); // (loads the FUR! sting once sound is on; this beat has no band or crowd for it to play)
    const free = e.get("ctrl") && !e.current();
    // the watchers keep their rhythm whenever the hall is on screen
    if (inHall()) {
      l.t += dt;
      l.counter && (l.counterT = (l.counterT || 0) + dt);
    }
    if (l.step === "handoff" && !inHall()) return void (l.step = "done");
    // Out of the aisle behind the counter he is standing again (the counter hides him only there).
    if (l.pose === "ducked" && l.step !== "grab" && free && !inAisle(e.pos("sq"))) ((l.pose = "stand"), e.set("sqPose", "stand"));
    // Steering steps him out of a hiding place (as at the party).
    if (free && inHall() && (l.pose === "hidden" || l.pose === "ball") && e.steering()) {
      l.pose = "stand";
      l.hideAt = "";
      e.set("sqPose", "stand");
    }
    // The grab at the counter.
    l.grab && l.step === "grab" && grabTick(dt);
    // Sight: whoever's cone holds him shows "?", then "!" after SEEN_TOO_LONG_SECONDS, and the alarm starts.
    const s = sqPoint(),
      showing = {};
    const watching = inHall() && !l.alarm && (free || l.step === "grab") && (l.pose === "stand" || l.pose === "up");
    if (watching) {
      const seen = coneList(l).find((c) => coneSees(c, s));
      if (!seen) ((l.seenBy = ""), (l.seenT = 0));
      else {
        l.seenT = l.seenBy === seen.id ? l.seenT + dt : 0;
        l.seenBy = seen.id;
        if (l.seenT >= SEEN_TOO_LONG_SECONDS) {
          const w = watchers(l).find((q) => q.id === seen.id);
          l.step === "grab" ? grabSeen(w) : raise(w);
        }
      }
    } else ((l.seenBy = ""), (l.seenT = 0));
    // Rolled up: the ball rule. Noticed (and no alarm yet): the one capture rule, as for being seen standing.
    inHall() && l.pose === "ball" ? ballWatch(l, dt) : (l.ballNear = {});
    if (inHall() && l.pose === "ball" && free && !l.alarm && ballNoticed(l)) {
      const id = Object.keys(l.ballNear).find((k) => l.ballNear[k] >= BALL().seconds),
        w = watchers(l).find((q) => q.id === id);
      // (noticed where he lies: staying rolled up there does not count as hidden through the search)
      w && (raise(w), (l.alarm.spotted = true));
    }
    l.seenBy && (showing[l.seenBy] = l.seenT / SEEN_TOO_LONG_SECONDS);
    // each watcher's warning: "?" over his head before he turns back to look (as the party's glancer)
    if (inHall() && !l.alarm)
      for (const w of watchers(l)) {
        const n = watcherNow(w, w === COUNTER_WATCHER ? l.counterT || 0 : l.t);
        n.phase === "warn" && !(w.id in showing) && (showing["warn:" + w.id] = n.k);
      }
    tickQuestions(l, dt, showing);
    // a restart (↺, or the step restart) took the alarm away while its close-up was up: close it, nothing follows
    if (closeUpNow && !(l.alarm && l.alarm.phase === "pull")) ((closeUpNow = null), closeFullScreen());
    // the alarm's close-up ends after its time (game time, so it also ends where frames are not drawn)
    if (closeUpNow && e.time() - closeUpNow.at >= ALARM.closeUp) {
      const c = closeUpNow;
      closeUpNow = null;
      closeFullScreen();
      e.set("ctrl", c.wasCtrl || !!(l.alarm && l.alarm.phase !== "caught"));
      psound.one("bell");
      c.done();
    }
    if (l.alarm && inHall()) {
      tickAlarm(l, dt, alarmApi());
      // the guards' boots, only while one walks
      let boot = false;
      for (const g of l.alarm ? l.alarm.guards.filter((q) => q.room === "hall") : []) footfall(g, g.x, g.y, dt, 0.45) && (boot = true);
      boot && psound.one("step");
    }
    // the hallway doorway (SNEAK · hallway is the button; nothing during an alarm)
    // the hallway's left doorway: walking there takes them back
    if (l.step === "back" && free && e.room() === "passage" && Math.hypot(s.x - HALLWAY_SPOTS.back.x, s.y - HALLWAY_SPOTS.back.y) < HALLWAY_SPOTS.back.r) backToHall();
    // reached a place without hiding in it: the glow goes on to the next
    if (l.step === "plant" || l.step === "crate") {
      const k = s.x > LUNCH_PLACES.crate.stand.x + 30 && s.y < LUNCH_PLACES.crate.stand.y + 10 ? 2 : s.x > LUNCH_PLACES.plant.stand.x + 90 ? 1 : 0;
      // (no new step start here: he may be standing in the open, and ↺ must never put him there)
      if (!l.alarm && free && k > l.reached) ((l.reached = k), go(k === 1 ? "crate" : "door"));
    }
    // his footsteps, only while his feet move; Mops's mop while he mops
    if (e.get("sqPose") === "stand" && l.pose !== "ducked" && footfall(ff, s.x, s.y, dt, HOME_MORNING_SOUND.padEvery)) sound.pad(pads++);
    if (l.mops && l.mops.mop) {
      l.mopT = (l.mopT || 0) + dt;
      l.mopT >= 0.6 && ((l.mopT = 0), sound.morning("mopSoft", pads));
    }
    // the eating cutaway's chomps and crunches, each as it is drawn
    const c = e.current();
    if (c && c.k === "cutaway" && c.id === LUNCH_EAT_ID) {
      const el = c.el || 0;
      for (const [at, name] of EAT_SOUNDS) at > eatHeard && at <= el && sound.morning(name);
      eatHeard = el;
    }
  }

  // ---------- spots ----------
  const words = (id) => lunchWords(id).split(" · ");
  function spot(id, wordsId, place, thing, f) {
    const [verb, cap] = wordsId ? words(wordsId) : ["", ""];
    return { id, verb, cap, who: "sq", ...place, at: thing ? [(thing.x0 + thing.x1) / 2, thing.y0] : undefined, thing, f };
  }
  const plantSpot = () => spot("lu-plant", "button-plant", { x: LUNCH_PLACES.plant.stand.x, y: LUNCH_PLACES.plant.stand.y, r: 60 }, LUNCH_PLACES.plant.thing, () => hideIn("plant"));
  const crateSpot = () => spot("lu-crate", "button-crate", { x: LUNCH_PLACES.crate.stand.x, y: LUNCH_PLACES.crate.stand.y, r: 60 }, LUNCH_PLACES.crate.box, () => hideIn("crate"));
  const doorSpot = () => spot("lu-door", "button-door", { x: LUNCH_PLACES.door.stand.x, y: LUNCH_PLACES.door.stand.y, r: LUNCH_PLACES.door.r }, LUNCH_PLACES.door.box, toHallway);
  // ROLL · ball: offered wherever he stands in the hall during the sneak (no ring: it is him), the words as elsewhere.
  const ballSpot = () => {
    const s = E().pos("sq");
    const [verb, cap] = words("button-ball");
    return { id: "lu-ball", verb, cap, who: "sq", at: [s.x, s.y - 70], f: rollUp };
  };
  // The next place to go, after the furthest he has reached: 0 the plant, 1 the crates, 2 the doorway.
  const nextPlace = (l) => ["plant", "crate", "door"][Math.min(2, l.reached)];
  function spots() {
    const l = live(),
      e = E();
    if (!l || !e.get("ctrl")) return [];
    const standing = l.pose === "stand";
    if (inHall() && !l.counter) {
      // the alarm: every hiding place (the doorway waits), and the ball anywhere else
      if (l.alarm) return standing ? [plantSpot(), crateSpot(), ballSpot()] : [];
      const next = nextPlace(l),
        // (rolled up he must unroll first: the doorway is not offered to a ball)
        out = l.pose === "ball" ? [] : [next === "door" ? doorSpot() : next === "crate" ? crateSpot() : plantSpot()];
      // the places behind him still hide him (they do not glow)
      standing && l.reached >= 1 && next !== "plant" && out.push(plantSpot());
      standing && l.reached >= 2 && out.push(crateSpot());
      // anywhere else in the open: ROLL · ball (last, so a place's own button wins where he stands at one)
      standing && out.push(ballSpot());
      return out;
    }
    if (e.room() === "passage" && l.step === "give") return [spot("lu-give", "button-give", { x: HALLWAY_SPOTS.give.x, y: HALLWAY_SPOTS.give.y, r: HALLWAY_SPOTS.give.r }, null, give)];
    if (e.room() === "passage" && l.step === "back") return [spot("lu-back", "", { x: HALLWAY_SPOTS.back.x, y: HALLWAY_SPOTS.back.y, r: HALLWAY_SPOTS.back.r }, null, null)];
    if (inHall() && l.step === "snack" && !l.alarm && l.pies === 3) return [spot("lu-snack", "button-snack", { x: COUNTER_SPOTS.sq.x, y: COUNTER_SPOTS.sq.y, r: 70 }, plateBox(), takeSnack)];
    return [];
  }
  const plateBox = () => ({ x0: COUNTER_SPOTS.plate.x - LUNCH_SIZES.plate.w / 2, x1: COUNTER_SPOTS.plate.x + LUNCH_SIZES.plate.w / 2, y0: pieY(2) - 20, y1: COUNTER_SPOTS.plate.y + LUNCH_SIZES.plate.h / 2 });

  // ---------- drawing ----------
  // What glows now (the next thing; every hiding place during an alarm).
  function glowing(l) {
    const e = E();
    if (!e.get("ctrl") && l.step !== "one") return [];
    if (inHall() && !l.counter) {
      if (l.alarm) return l.alarm.phase === "calm" ? [] : [LUNCH_PLACES.plant.thing, LUNCH_PLACES.crate.box];
      const next = nextPlace(l);
      return [next === "plant" ? LUNCH_PLACES.plant.thing : next === "crate" ? LUNCH_PLACES.crate.box : LUNCH_PLACES.door.box];
    }
    if (inHall() && (l.step === "one" || l.step === "snack") && !l.alarm && l.pies === 3) return [plateBox()];
    return [];
  }
  function view(l, ctx0) {
    const e = E(),
      t = e.time(),
      s = e.pos("sq"),
      sizes = e.hallSizes(),
      adult = sizes.adult,
      k = sizes.squatch;
    const guests = watchers(l).map((w) => {
      const at = l.alarm && l.alarm.w.id === w.id ? l.alarm.w : l.people[w.id] || w;
      return { id: w.id, x: at.x, y: at.y };
    });
    const over = (id) => bridge.guests.height(id, adult) + adult * 0.27;
    const marks = [];
    for (const q of questions(l)) {
      const id = q.id.replace(/^warn:/, ""),
        at = guests.find((g) => g.id === id);
      at && marks.push({ x: at.x + 26, y: at.y - over(id) + 10, mark: "?", size: Math.round(adult * 0.42), q });
    }
    const a = l.alarm;
    const shout = a && (a.phase === "shout" || (a.phase === "run" && a.t < 0.5)) ? { x: a.w.x, y: a.w.y - over(a.w.id) - 12 } : null;
    a && a.phase === "shout" && marks.push({ x: a.w.x + 40, y: a.w.y - over(a.w.id) + 14, mark: "!", size: Math.round(adult * 0.635) });
    a && a.guards.forEach((g) => g.room === "hall" && g.sees && marks.push({ x: g.x, y: g.y - adult * 1.29, mark: "!", size: Math.round(adult * 0.635) }));
    const ducked = l.pose === "ducked" || (l.step === "handoff" && Math.hypot(s.x - COUNTER_SPOTS.sq.x, s.y - COUNTER_SPOTS.sq.y) < 6);
    const hidden = l.pose === "hidden" || l.pose === "ball";
    const extra = [];
    extra.push({ y: LUNCH_PLACES.crate.box.y1, f: () => drawCrates(ctx0) });
    // rolled up: the L2 ball (the older program's drawing, DECISIONS C3) at his size, where he stands. Hidden behind
    // something (the counter, the crates) he is that ball too, never standing or squashed: only in a plant are just his
    // eyes shown (Brian 2026-11-26, the loading bay video at 0:08.7: "If he's hiding, he should be in the ball").
    const balled = l.pose === "ball" || ducked || (l.pose === "hidden" && l.hideAt === "crate");
    balled && e.ball && extra.push({ y: s.y, f: () => e.ball.drawOn(ctx0, s.x, s.y - 16 * (k / 1.65), k / 1.65) });
    l.counter && extra.push({ y: COUNTER_SPOTS.plate.y, f: () => drawPlate(ctx0, l.pies) });
    // what he carries: the lunch bag in his paw on the way to Mops
    !l.counter && !hidden && l.bag === "paw" && extra.push({ y: s.y + 0.5, f: () => drawBagInPaw(ctx0, s.x, s.y, s.f || 1, k) });
    // ducked behind the counter (the room's Squatch, low); standing up at it, reaching over for a pie
    if (l.pose === "up" && l.grab) {
      const P = LUNCH_PACE,
        g = l.grab.t,
        top = { x: COUNTER_SPOTS.plate.x, y: pieY(2) },
        paw = sqPawAt(s.x, s.y, s.f || -1, k),
        out = g < P.up ? 0 : g < P.up + P.reach ? (g - P.up) / P.reach : Math.max(0, 1 - (g - P.up - P.reach) / P.back),
        hand = { x: paw.x + (top.x - paw.x) * out, y: paw.y + (top.y - paw.y) * out };
      extra.push({ y: s.y + 0.6, f: () => (drawReach(ctx0, s.x, s.y, s.f || -1, k, hand.x, hand.y), l.pie === "paw" && drawPie(ctx0, hand.x, hand.y)) });
    }
    if (l.step === "chew") {
      const u = Math.min(1, (t - (l.chewAt || t)) / LUNCH_PACE.chew),
        paw = sqPawAt(s.x, s.y - 14, s.f || -1, k);
      u < 1 && extra.push({ y: s.y + 0.6, f: () => drawPie(ctx0, paw.x, paw.y, 1 - u * 0.85) });
    }
    // Mops: mopping in the hallway doorway at the start; behind the counter with him in beat 27
    const m = l.mops;
    m && extra.push({ y: m.y, f: () => mopsInDoor(ctx0, m, t) });
    if (l.counter && e.get("moPose") !== "hidden") {
      const mo = e.pos("mops");
      extra.push({ y: mo.y, f: () => e.drawMopsOn(ctx0, mo.x, mo.y, k * 1.15, { f: mo.f || 1, walk: 0 }) });
    }
    return {
      t,
      picture,
      banner: false,
      lights: null,
      isfred: null,
      band: null,
      guests,
      bartender: null,
      guards: a ? a.guards.filter((g) => g.room === "hall").map((g) => ({ x: g.x, y: g.y, f: Math.cos(g.a) < 0 ? -1 : 1 })) : [],
      cones: coneList(l),
      allCones: true,
      noteCone: (c) => e.noteCone(c),
      unseen: !(e.get("ctrl") && !e.current()) && l.step !== "grab",
      vent: false,
      squatch: hidden || ducked || l.pose === "up" ? (l.pose === "up" ? { x: s.x, y: s.y, f: s.f || -1, walk: 0, pose: "stand" } : { x: s.x, y: s.y, pose: "hidden" }) : { x: s.x, y: s.y, f: s.f || 1, walk: e.walkPhase(), pose: "stand" },
      eyes: hidden && l.hideAt === "plant" ? { ...LUNCH_PLACES.plant.eyes } : null,
      marks,
      shout,
      alarm: !!a && a.phase !== "shout" && a.phase !== "run" && a.phase !== "calm",
      floor: (ctx) => {
        for (const b of glowing(l)) drawNextGlow(ctx, b, t);
      },
      extra,
    };
  }
  // Mops in the hallway doorway, mopping (head down, beard swishing), then mopping his way out of sight.
  function mopsInDoor(ctx, m, t) {
    const e = E();
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, 946, 640); // the wall past the doorway hides him as he goes
    ctx.clip();
    e.drawMopsOn(ctx, m.x, m.y, e.hallSizes().squatch * 1.15, { f: m.f, walk: m.walk ? t * 8 : 0, headDown: true, sweep: Math.sin(t * 6) * 4 });
    ctx.restore();
  }

  return {
    start,
    /**
     * ↺ in a part where the player has no control yet (no step start was saved for it): the part starts again from
     * its last place he controlled. True when it did (20-ch2.js reSec). In a step he controls, false: the step restart
     * brings it back.
     */
    restart() {
      const l = live();
      if (!l || LUNCH_STEPS.includes(l.step)) return false;
      if (["walkin"].includes(l.step)) return (start(), true);
      if (["tohall", "arrive", "given"].includes(l.step)) return (jump("give"), true);
      if (["mopsBack"].includes(l.step)) return (jump("back"), true);
      if (["tocounter", "one", "grab", "chew"].includes(l.step)) return (jump("snack"), true);
      return false;
    },
    jump,
    /** True while the one capture rule's alarm is on (FUR! to the calm): no music then (bridge.js, music-picks.js hushNow). */
    alarmOn() {
      const l = live();
      return !!(l && l.alarm);
    },
    /** The lunch's state now: when it is a new one (a restart after the LOCKUP card, or ↺) the alarm's quiet ends. */
    alarmKey() {
      return live() || null;
    },
    /** True from TAKE · lunch until beat 28 takes them out of the hall. */
    active() {
      return !!live();
    },
    /** True while this beat draws the hall (beats 25 and 27, and beat 28's start, behind the counter). */
    ownsRoom() {
      return !!live() && E().room() === "hall";
    },
    tick,
    spots,
    /**
     * A tap on the picture (game positions; 14-ch1-day2.js ch1WorldTap). On the counter close-up a tap is a tap on
     * what it shows: on the plate it is TAKE · snack when that is offered; anywhere else on it, nothing (he must not
     * walk off into the hall the close-up covers). True when it was used.
     */
    tap(x, y) {
      const l = live();
      if (!closeUpShows(l)) return false;
      const b = counterCloseUpBox(1),
        C = COUNTER_CLOSEUP;
      if (x < b.x0 || x > b.x1 || y < b.y0 || y > b.y1) return false;
      const gx = C.src.x0 + (x - b.x0) / C.k,
        gy = C.src.y0 + (y - b.y0) / C.k,
        p = plateBox(),
        snack = spots().find((q) => q.id === "lu-snack");
      snack && gx >= p.x0 - 24 && gx <= p.x1 + 24 && gy >= p.y0 - 24 && gy <= p.y1 + 24 && snack.f();
      return true;
    },
    drawRoom(ctx) {
      const l = live();
      if (!l || !inHall()) return false;
      const e = E();
      drew = { step: l.step, cones: drawHall(ctx, e, bridge.guests, view(l, ctx)), glow: glowing(l) };
      // at the snack counter: the close-up of the counter's corner, so a kid on a phone sees the plate, the pie and him
      if (closeUpShows(l)) {
        const u = Math.min(1, Math.max(0, (e.time() - (l.cuAt == null ? e.time() : l.cuAt)) / COUNTER_CLOSEUP.grow));
        drew.closeUp = { ...drawCounterCloseUp(ctx, u), u: +u.toFixed(2) };
      }
      // Hidden, the older program draws no goal outline (it would sit on him): this beat draws the next place's.
      const next = l.pose === "hidden" && e.get("ctrl") && !l.alarm ? spots()[0] : null;
      if (next) {
        const box = bridge.drawGoalOutline(ctx, "hall", next.id, picture, e.time(), []);
        bridge.goalMark.drew(box, next, e.time());
        drew.outline = box && next.id;
      }
      return true;
    },
    /**
     * The hallway's Employee of the Month photo of Mops, MOPS, GANITOR (Brian 2026-11-26, Ganitor C): a layer over the
     * locked hallway picture on every Chapter 1 visit (not the office). The older program paints it right after the
     * picture, before anyone in the hallway (14-ch1-day2.js drawCh1Passage), so people walking by are in front of it
     * (Brian 2026-11-26, the loading bay video at 0:14.8: Mops's horns were drawn behind it). It does not belong to the
     * lunch; it lives here because this beat first drew over the hallway.
     */
    drawWall(ctx) {
      const e = E();
      wallDrew = e && e.room() === "passage" && !e.get("ch1Office") && (e.get("scene") || "")[0] === "Q" ? drawGanitorWall(ctx, e.drawMopsOn) : null;
      return wallDrew;
    },
    /** Over the hallway (the older program draws the room, Squatch and Mops): the bag, the heart, Mops mopping, the glow. */
    draw(ctx) {
      const l = live(),
        e = E();
      if (!l || e.room() !== "passage") return;
      const t = e.time(),
        k = sqScale(),
        s = e.pos("sq"),
        mo = e.pos("mops");
      drew = { step: l.step, things: [] };
      if (l.step === "give" && e.get("ctrl")) {
        const top = mo.y - adultPxFor("passage") * 1.05;
        drew.glow = drawNextGlow(ctx, { x0: mo.x - 40, x1: mo.x + 40, y0: top, y1: mo.y }, t, 1.1);
      }
      if (l.step === "back" && e.get("ctrl")) drew.outline = bridge.drawGoalOutline(ctx, "passage", "lu-back", null, t, []);
      if (l.mops) {
        e.drawMopsOn(ctx, l.mops.x, l.mops.y, mopsScale(), { f: l.mops.f, walk: 0, headDown: !!l.mops.mop, sweep: l.mops.mop ? Math.sin(t * 6) * 4 : 0 });
        drew.things.push("mopsMopping");
      }
      // the bag: in his paw, on its way to Mops (an arc), then in Mops's hoof
      const paw = sqPawAt(s.x, s.y, s.f || 1, k),
        hoof = { x: mo.x + (mo.f || -1) * 16 * mopsScale(), y: mo.y - 16 * mopsScale() },
        bagK = (BAG_IN_HALL * k) / 1.65;
      if (l.bag === "paw" && l.step !== "given") (drawLunchBag(ctx, paw.x, paw.y + 10, bagK), drew.things.push("bagInPaw"));
      if (l.step === "given" && l.bag === "paw") {
        const u = Math.min(1, (t - l.give) / LUNCH_PACE.give),
          x = paw.x + (hoof.x - paw.x) * u,
          y = paw.y + (hoof.y - paw.y) * u - Math.sin(u * Math.PI) * 40;
        drawLunchBag(ctx, x, y + 10, bagK);
        drew.things.push("bagFlying");
      }
      if (l.bag === "mops") (drawLunchBag(ctx, hoof.x, hoof.y + 10, bagK), drew.things.push("bagWithMops"));
      if (l.heart >= 0) {
        const age = t - l.heart,
          y = mo.y - adultPxFor("passage") * 1.1 - Math.min(1, age / 0.8) * 26;
        drawHeart(ctx, mo.x, y, 16);
        drew.heart = { x: mo.x, y };
      }
    },
    /**
     * The hall after the lunch (the older program draws it, 12-ch1-redesign.js drawCh1DayHall): the crates are still
     * there, and the plate on the counter's end has the Moon Pies he left on it.
     */
    drawProps(ctx) {
      const l = L(),
        e = E();
      if (!l || live() || !e.get("ch1Day2") || !inHall()) return;
      drawCrates(ctx);
      drawPlate(ctx, l.pies);
    },
    solids() {
      const l = live();
      if (!l) return [];
      const e = E(),
        feet = (x, y) => ({ x0: x - 25, x1: x + 25, y0: y - 14, y1: y + 8, person: 1 });
      const people = Object.values(l.people).map((g) => feet(g.x, g.y));
      const mops = l.counter && e.get("moPose") !== "hidden" ? [feet(e.pos("mops").x, e.pos("mops").y)] : [];
      return [...LUNCH_SOLIDS, ...people, ...mops];
    },
    bounds() {
      return LUNCH_BOUNDS;
    },
    /** Tests: the places and the watchers' rhythm (lunch-sneak-place.js). */
    place: Object.freeze({ WATCHERS, COUNTER_WATCHER, watcherNow, LUNCH_PLACES, COUNTER_SPOTS }),
    /** Tests: true when a cone holds Squatch standing where he is now (the game's own sight test). */
    seenNow() {
      const l = live();
      return !!l && inHall() && (l.pose === "stand" || l.pose === "up") && coneList(l).some((c) => coneSees(c, sqPoint()));
    },
    /** Tests: the state, what the last frame drew, the cones now, what was heard. */
    debug() {
      const l = L();
      return { state: l ? JSON.parse(JSON.stringify(l)) : null, active: !!live(), drew, wall: wallDrew, steps: record.steps.slice(), sounds: sound.asked(), partySounds: psound.debug().played, cones: l && live() && inHall() ? coneList(l) : [], firstAlarm: firstAlarm.seen };
    },
  };

  /**
   * A test jump (ch1JumpBeat 25 and 27, tests, ↺ in a part with no saved start): straight to one of the player's
   * steps, with everything before it done.
   */
  function jump(step) {
    const e = E();
    e.set("ctrl", false);
    closeFullScreen();
    closeUpNow = null;
    const i = LUNCH_STEPS.indexOf(step);
    if (i < 0) return;
    // the home morning is over: the gift is in the box out on the floor, the bag taken
    const hm = e.get("ch1HomeMorning");
    e.set("ch1HomeMorning", { ...(hm || {}), step: "done", gift: "box", boxOut: true, door: false, bag: "taken", heart: -1 });
    const counter = step === "snack";
    e.set("ch1Lunch", fresh({ reached: step === "crate" ? 1 : step === "door" ? 2 : 0, bag: i >= 4 ? "eaten" : "paw", counter, people: freshPeople(counter), counterT: counter ? RHYTHM_LENGTH - RHYTHM.turn : 0 }));
    e.set("moPose", "hidden");
    e.set("sqPose", "stand");
    if (i <= 2) {
      e.enterRoom("hall", "QB");
      const at = step === "plant" ? LUNCH_PLACES.start : step === "crate" ? LUNCH_PLACES.plant.stand : LUNCH_PLACES.crate.stand;
      e.place("sq", at.x, at.y);
      e.face("sq", 1);
      go(step);
      if (step !== "plant") hideIn(step === "crate" ? "plant" : "crate");
      L().step = step;
      return control("chip-sneak");
    }
    if (i <= 4) {
      e.enterRoom("passage", "QB");
      e.set("moPose", "stand");
      e.place("sq", step === "give" ? HALLWAY_SPOTS.stop.x : HALLWAY_SPOTS.give.x - 30, step === "give" ? HALLWAY_SPOTS.stop.y : HALLWAY_SPOTS.give.y);
      e.place("mops", step === "give" ? HALLWAY_SPOTS.mops.x : HALLWAY_SPOTS.mopsBack.x, step === "give" ? HALLWAY_SPOTS.mops.y : HALLWAY_SPOTS.mopsBack.y);
      e.face("mops", step === "give" ? -1 : 1);
      e.face("sq", step === "give" ? 1 : -1);
      go(step);
      return control(step === "give" ? "chip-give" : "chip-back");
    }
    e.enterRoom("hall", "QB");
    e.set("moPose", "stand");
    e.place("mops", COUNTER_SPOTS.mops.x, COUNTER_SPOTS.mops.y);
    e.place("sq", COUNTER_SPOTS.sq.x, COUNTER_SPOTS.sq.y);
    e.face("mops", 1);
    e.face("sq", -1);
    L().pose = "ducked";
    go("snack");
    control("chip-snack");
  }
}
