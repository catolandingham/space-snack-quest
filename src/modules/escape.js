/**
 * The escape, Chapter 1 beats 43 to 52 (docs/CH1-STORY-WALKTHROUGH.md "One week later: the escape", with the newer
 * decisions of 2026-11-22 to 11-26 over it). It follows night one (beat 42: 14-ch1-day2.js ch1SixDays) and hands over
 * to pickup day (beat 53, as it is today: 14-ch1-day2.js ch1PackStart) with Squatch asleep in bed the night before.
 * What the player sees, step by step (every word from escape-lines.js, every place and number from escape-place.js,
 * every new drawing from escape-art.js; all PLACEHOLDERS for Brian):
 *   card      43  the card "Six days later" (NEXT).
 *   tease     44  the loading bay by day, no Squatch: Mops mops the floor with his beard, three robots circle him,
 *                 bobbing and mimicking him; "HQ sent us a message..." (NEXT), then Mops: "Replaced? The manager was
 *                 lying to me." (NEXT), a sad bleat.
 *   home      45  home that night: Mops comes in; the pancake brochure on the wall glows while he says his line (NEXT);
 *                 wordless thought pictures over Mops: the Moon Pie crate, both of them peeking out, going into the ship;
 *                 then the office door with its keypad and a red padlock.
 *             46  Squatch: "Oh, it was on the form I sent..." (NEXT), "Didn't a copy get sucked into the vent?" (NEXT),
 *                 and his thought picture: the pink sheet, its code in the corner, flying into the big wall vent.
 *   tobay         they walk out together, at night, through the hall and the hallway to the loading bay's wall vent;
 *                 Mops swings the grille open and crawls in.
 *   ball      47  "Squatch: roll into a ball by the vent" (goal words after 20 s): the vent is outlined, ROLL · ball. A
 *                 night robot patrols the back of the bay with its cone; standing in its cone, it shows "!" at once,
 *                 rolls to the FUR alarm on the wall and pulls it (the one capture rule: a guard comes; rolled up or
 *                 hidden, "They lost you."; reached, the LOCKUP card, and this step starts again).
 *   rolled        rolled up at the vent, the robot rolls on; then the picture goes inside the vent.
 *   vent      48  inside the vent (no locked picture: a placeholder room): the grille on the left with Squatch's eyes
 *                 between its slats; Mops walks to his desk, his back to the grille. Close-ups: the detective wall
 *                 (Mars crossed off) (NEXT), the reply letter stamped NO (NEXT). The pink sheet on the desk glows:
 *                 Squatch, thinking: "I hope Mops doesn't notice..." (NEXT). Close-up: Mops writes the new Guardian note,
 *                 signs it "— The Guardians", a white hair on it (NEXT). He takes the pink sheet in his mouth without
 *                 looking at it.
 *   out       49  the bay: Mops crawls out with the sheet in his mouth: "Hurry, hurry, pink slip, got it!" (NEXT); Squatch
 *                 unrolls: "Get it before he sees it." (NEXT, a thought).
 *   grab          "Squatch: grab the pink slip": the slip in Mops's mouth is outlined; GRAB · pink slip.
 *   tohall        to the hallway: Squatch by the office door's keypad, Mops off to the left looking at the photo wall.
 *   slipview  50  close-up of the sheet in his paw: the paw print in the ORDER MORE ROBOTS box and the code, 169556, lit
 *                 in its corner (NEXT).
 *   pad           the keypad close-up over the blurred hallway: the sheet (code lit) on the left, the keypad on the right.
 *                 A wrong key buzzes red and the screen clears for another try (no penalty); the right code turns it
 *                 green, the door opens, and they walk in.
 *   computer  51  the office: "Squatch: return the empty crate"; the computer is outlined; RETURN · empty crate.
 *   site          the Moon Pie site close-up: MOON PIES, a small grey "Order new box", a big lit "Return empty crate".
 *                 Tapped: the crate rides up a ramp into the ship and a big green tick comes (wordless, plays itself).
 *   tobar     52  out through the hallway to the party hall's snack counter (the lunch's aisle); Mops: "This time, take
 *                 all the snacks you want." (NEXT).
 *   snacks        the counter close-up: tap a snack, his paw puts it in his bag (a count). After four, Squatch: "I'm
 *                 worried about the Guardians. I'll leave them some food." (NEXT), and the Guardians' plate shows.
 *   food          the last two snacks go on the Guardians' plate. The close-up closes; hearts rise over Mops (no words).
 *   tohome        home. "Squatch: hide the pink slip": the wardrobe is outlined; OPEN · closet; the Guardian Box in it is
 *   closet/box    outlined; PUT IN · box: the box close-up (the home morning's box view): his paw tucks the slip in
 *                 under the notes (NEXT). The door shuts; he goes to bed, asleep; then beat 53.
 * Its progress lives in the game-state field ch1Escape, and ch1Step is "es-<step>" at each step the player controls,
 * so the step restart (↺, 20-ch2.js) brings back the step he is on.
 */
import { escapeWords } from "./escape-lines.js";
import { OFFICE_CODE, BAY_DAY, BAY_NIGHT, ES_HOME, BAY, ROBOT_SIGHT, VENT_ROOM, HALLWAY, KEYPAD, keyAt, OFFICE, SITE, ES_BAR, SNACKS, ES_PACE } from "./escape-place.js";
import {
  drawBrochure,
  thinkCrateShip,
  thinkLockedDoor,
  thinkSlipVent,
  drawOpenVent,
  drawBang,
  drawVentRoom,
  drawVentDesk,
  drawSlipSmall,
  blurBehind,
  drawKeypad,
  drawDoorOpen,
  drawSite,
  drawSnackCounter,
  drawHearts,
  glowBox,
  escapeDrawnWords,
} from "./escape-art.js";
import { cutawaySteps } from "./cutaway.js";
import { coneFrom, coneSees, drawCones, lookAt } from "./party-watch.js";
import { adultPxFor } from "./room-sizes.js";
import { sqPawAt } from "./lunch-sneak-art.js";
import { MORNING_THINGS } from "./home-morning-art.js";

export const ESCAPE_ID = "ch1-escape";
// The steps the player controls (ch1Step "es-<step>"), in order. (jump() takes these, and "start".)
export const ESCAPE_STEPS = Object.freeze(["ball", "grab", "pad", "computer", "site", "snacks", "food", "closet", "box"]);
// Where a step the player does not control goes back to on ↺ (its last step he controlled, or the start).
const RESTART_TO = Object.freeze({
  card: "start",
  tease: "start",
  home: "start",
  tobay: "ball",
  crawl: "ball",
  rolled: "ball",
  vent: "ball",
  out: "ball",
  tohall: "grab",
  slipview: "grab",
  open: "pad",
  booked: "computer",
  tobar: "computer",
  mopsall: "computer",
  guardians: "snacks",
  hearts: "snacks",
  tohome: "snacks",
  boxview: "closet",
  bed: "closet",
});

export function createEscape(bridge) {
  const E = () => bridge.engine();
  const pic = (src) => (typeof Image !== "undefined" ? Object.assign(new Image(), { src }) : null);
  const pics = { day: pic(BAY_DAY), night: pic(BAY_NIGHT) };
  const L = () => {
    const e = E();
    return e ? e.get("ch1Escape") : null;
  };
  const live = () => {
    const l = L(),
      e = E();
    return l && e && e.get("ch1Day2") && l.step && l.step !== "done" ? l : null;
  };
  let drew = null,
    record = { steps: [], sounds: [] },
    lastMops = null,
    moMoving = false;

  // ---------- small helpers ----------
  // A sound effect (synth.js, through the older program), remembered for the tests.
  const sfx = (name) => (record.sounds.push(name), E().sfx(name));
  const go = (step, extra) => {
    Object.assign(L(), { step, t0: 0 }, extra || {});
    record.steps.push(step);
  };
  const chip = (id) => (E().set("ch1Chip", id ? escapeWords(id) : ""), E().chipNow());
  const control = (chipId) => {
    const e = E();
    e.set("ch1Step", "es-" + L().step);
    chip(chipId);
    e.set("ctrl", true);
  };
  const busy = () => {
    const e = E();
    e.set("ctrl", false);
    e.set("act", null);
    e.set("ch1Chip", "");
    e.still("sq");
    e.stopWalk && e.stopWalk();
    e.chipNow();
  };
  const sqScale = (room) => (adultPxFor(room || E().room()) * 0.8) / 45;
  const moScale = (room) => sqScale(room) * 1.15;
  const wait = (s) => E().until((dt) => (L().t0 += dt || 0) >= s);
  const fresh = (extra) => ({
    step: "",
    t0: 0,
    slip: "vent",
    pose: "stand",
    glow: "",
    think: null,
    crawl: null,
    robot: null,
    typed: "",
    buzzAt: -1,
    okAt: -1,
    door: false,
    cu: "",
    bookAt: -1,
    snacks: { gone: {}, bag: 0, plate: false, onPlate: [], carry: null },
    heartsAt: -1,
    grabAt: -1,
    ...(extra || {}),
  });
  /** Day 2's morning and lunch are over, the pink sheet is in the vent, the brochure is pinned up at home. */
  function settle() {
    const e = E(),
      hm = e.get("ch1HomeMorning");
    e.set("ch1HomeMorning", { ...(hm || {}), step: "done", gift: "box", boxOut: false, door: false, bag: "taken", heart: -1 });
    e.set("ch1Brochure", false); // (the older program would draw it in his paw: it is on the wall now)
  }

  // ---------- beat 43: the card ----------
  /** Night one is over (14-ch1-day2.js ch1SixDays hands over here). */
  function start() {
    const e = E();
    record = { steps: [], sounds: [] };
    settle();
    e.set("ch1Escape", fresh());
    busy();
    e.set("ch1D", false);
    e.set("ch1Night", false);
    e.set("sqPose", "stand");
    e.set("wardrobe", "closed");
    e.enterRoom("closet", "QB");
    e.place("sq", ES_HOME.sq.x, ES_HOME.sq.y);
    e.set("moPose", "hidden");
    go("card");
    e.queue([e.card("time", escapeWords("card-six-days")), e.run(tease)]);
  }

  // ---------- beat 44: the robots tease Mops ----------
  function tease() {
    const e = E();
    e.enterRoom("hangar", "QB");
    e.set("ch1D", true);
    e.set("ch1Night", false);
    e.set("sqPose", "hidden");
    e.place("sq", -400, -400);
    e.set("moPose", "stand");
    e.place("mops", BAY.teaseMops.x, BAY.teaseMops.y);
    e.face("mops", 1);
    go("tease", { mopping: true });
    e.queue([
      wait(ES_PACE.tease),
      e.say("robot", escapeWords("robot-replaced")),
      e.run(() => ((L().mopping = false), (L().sad = true), (L().t0 = 0))),
      e.say("mops", escapeWords("mops-lying")),
      e.run(() => ((record.sounds.push("mops-bleat"), bridge.playSoundPick("mops-bleat")), (L().t0 = 0))),
      wait(ES_PACE.sad),
      e.run(homeTalk),
    ]);
  }

  // ---------- beats 45 and 46: home that night ----------
  function homeTalk() {
    const e = E();
    e.place("sq", ES_HOME.sq.x, ES_HOME.sq.y); // (he was at home all along: the walk log has him there)
    e.enterRoom("closet", "QB");
    e.set("ch1D", false);
    e.set("sqPose", "stand");
    e.face("sq", 1);
    e.set("moPose", "stand");
    e.place("mops", ES_HOME.door.x, ES_HOME.door.y);
    e.face("mops", -1);
    go("home", { mopping: false, sad: false });
    e.queue([
      e.until((dt) => (e.moWalking(true), e.step("mops", ES_HOME.mops.x, ES_HOME.mops.y, ES_PACE.mopsIn, dt || 0))),
      e.run(() => (e.moWalking(false), e.still("mops"), e.face("mops", -1), (L().glow = "brochure"))),
      e.say("mops", escapeWords("mops-pancake")),
      e.run(() => ((L().glow = ""), think("mops", "crate"))),
      wait(ES_PACE.think),
      e.run(() => think("mops", "door")),
      wait(ES_PACE.think),
      e.run(() => (L().think = null)),
      e.say("sq", escapeWords("sq-slip")),
      // what he remembers comes first, then he says it (the vent is shown before the line names it)
      e.run(() => think("sq", "vent")),
      wait(ES_PACE.think),
      e.run(() => (L().think = null)),
      e.say("sq", escapeWords("sq-vent")),
      e.run(toBay),
    ]);
  }
  function think(who, kind) {
    Object.assign(L(), { think: { who, kind, at: E().time() }, t0: 0 });
  }

  // ---------- beat 47: to the vent, and the ball ----------
  function toBay() {
    const e = E();
    go("tobay");
    const f = { who: "both", night: true, scene: "QB" };
    e.goTo("hall", f, () =>
      e.goTo("passage", f, () =>
        e.goTo("delivery", { ...f, stand: [BAY.enter.x, BAY.enter.y] }, () => {
          e.set("ctrl", false);
          // the night robot is on its rounds as they come in
          L().robot = freshRobot();
          e.queue([
            // along the back of the bay, above the mail room's wall (BAY.toVent), to the vent
            e.until((dt) => {
              e.moWalking(true);
              const a = e.step("mops", BAY.toVent.x - 20, BAY.toVent.y - 4, ES_PACE.walk, dt || 0);
              return e.step("sq", BAY.toVent.x, BAY.toVent.y, ES_PACE.walk, dt || 0) && a;
            }),
            e.until((dt) => {
              const a = e.step("mops", BAY.mopsVent.x, BAY.mopsVent.y, ES_PACE.walk, dt || 0);
              return e.step("sq", BAY.ventStand.x, BAY.ventStand.y + 40, ES_PACE.walk, dt || 0) && a;
            }),
            e.run(() => (e.moWalking(false), e.face("sq", -1), e.face("mops", 1), go("crawl", { crawl: { dir: "in", k: 0 } }))),
            e.until((dt) => ((L().crawl.k += (dt || 0) / ES_PACE.crawl), L().crawl.k >= 1)),
            e.run(() => {
              e.set("moPose", "hidden");
              L().crawl = null;
              go("ball");
              e.face("sq", -1);
              control("chip-ball");
            }),
          ]);
        }),
      ),
    );
  }
  const freshRobot = () => ({ x: BAY.patrol.x0, y: BAY.patrol.y, f: 1, phase: "patrol", t: 0, near: 0, route: [] });
  function rollUp() {
    const e = E(),
      l = L();
    e.still("sq");
    e.stopWalk && e.stopWalk();
    l.pose = "ball";
    e.set("sqPose", "ball");
    e.set("ch1DidBall", true); // (the chapter's record that he hid as a ball: 90-input-shell.js ch1State)
    sfx("hide");
  }
  const atVent = () => Math.hypot(E().pos("sq").x - BAY.ventStand.x, E().pos("sq").y - BAY.ventStand.y) < 70;
  // The night robot: its cone, its patrol, and the one capture rule when it sees him.
  const robotCone = (r) => coneFrom("es-robot", r.x, r.y, r.f > 0 ? lookAt(r.x, r.y, BAY.ventStand) : Math.PI, { half: ROBOT_SIGHT.half, len: ROBOT_SIGHT.len });
  // What the cone is drawn yellow on is what it sees (party-watch.js coneSees, his whole outline; REVIEW-RULES,
  // showing 6). Rolled up, the ball rule (R43): seen only by a robot that stays within 70 of him for 2 s.
  const robotSees = (r, dt) => {
    const e = E(),
      s = e.pos("sq"),
      inCone = coneSees(robotCone(r), s);
    if (L().pose === "ball" && e.get("sqPose") === "ball") {
      const B = e.ball || { radius: 70, seconds: 2 };
      r.near = inCone && Math.hypot(s.x - r.x, s.y - r.y) <= B.radius ? r.near + dt : 0;
      return r.near >= B.seconds;
    }
    r.near = 0;
    return L().pose === "stand" && e.get("sqPose") === "stand" && inCone;
  };
  // Rolls along a route of corners (round the bin, the plant, the mail room's wall: BAY's routes); true at its end.
  function roll(r, speed, dt) {
    const to = r.route[0];
    if (!to) return true;
    const d = Math.hypot(to.x - r.x, to.y - r.y);
    Math.abs(to.x - r.x) > 1 && (r.f = to.x < r.x ? -1 : 1);
    if (d <= speed * dt) ((r.x = to.x), (r.y = to.y), r.route.shift());
    else ((r.x += ((to.x - r.x) * speed * dt) / d), (r.y += ((to.y - r.y) * speed * dt) / d));
    return !r.route.length;
  }
  function robotTick(l, dt) {
    const e = E(),
      r = l.robot,
      P = BAY.patrol;
    r.t += dt;
    if (r.phase === "patrol") {
      r.x += r.f * P.speed * dt;
      if (r.x > P.x1) ((r.x = P.x1), (r.f = -1));
      if (r.x < P.x0) ((r.x = P.x0), (r.f = 1));
      if (e.get("ctrl") && !e.current() && robotSees(r, dt)) Object.assign(r, { phase: "bang", t: 0 });
    } else if (r.phase === "bang") {
      // "!" at once (robots: DECISIONS sight cones, 2026-11-22), then it rolls off to pull the FUR alarm
      r.t >= 0.5 && Object.assign(r, { phase: "run", t: 0, route: BAY.toAlarm.map((q) => ({ ...q })) });
    } else if (r.phase === "run") {
      roll(r, ROBOT_SIGHT.run, dt) && (Object.assign(r, { phase: "pull", t: 0 }), e.callSecurity("delivery"));
    } else if (r.phase === "pull") {
      // it waits by the alarm until security has gone ("They lost you."), then goes back to its patrol
      !e.secOn() && r.t > 1 && Object.assign(r, { phase: "back", t: 0, route: [...BAY.toAlarm.slice(0, -1).reverse(), { x: P.x0, y: P.y }].map((q) => ({ ...q })) });
    } else if (r.phase === "back") {
      roll(r, P.speed * 2, dt) && Object.assign(r, { phase: "patrol", t: 0, f: 1 });
    } else if (r.phase === "dock") {
      // once he is rolled up by the vent, the robot ends its rounds: into the mail room, where it docks and powers down
      roll(r, P.speed * 1.5, dt) && Object.assign(r, { phase: "asleep", t: 0 });
    }
  }
  function inside() {
    const e = E();
    busy();
    go("vent", { slip: "desk", pose: "ball" });
    e.queue([
      e.run(() => {
        e.enterRoom("duct", "QB");
        e.set("sqPose", "hidden");
        e.place("sq", VENT_ROOM.eyes.x, VENT_ROOM.eyes.y + 40);
        e.set("moPose", "stand");
        e.place("mops", VENT_ROOM.mopsIn.x, VENT_ROOM.mopsIn.y);
        e.face("mops", 1);
      }),
      e.until((dt) => (e.moWalking(true), e.step("mops", VENT_ROOM.mops.x, VENT_ROOM.mops.y, ES_PACE.walk, dt || 0))),
      e.run(() => (e.moWalking(false), e.still("mops"), e.face("mops", 1), (L().t0 = 0))),
      wait(0.6),
      ...cutawaySteps("eswall"),
      ...cutawaySteps("esletter"),
      e.run(() => (L().glow = "slip")),
      e.say("sq", escapeWords("sq-notice"), "whisper"),
      e.run(() => ((L().glow = ""), (L().writing = true))),
      ...cutawaySteps("esnote"),
      e.run(() => ((L().writing = false), (L().t0 = 0))),
      wait(0.4),
      // he takes the sheet in his mouth without looking at it (his back to the grille the whole time)
      e.run(() => ((L().slip = "mops"), sfx("grab"), (L().t0 = 0))),
      wait(0.6),
      e.run(() => {
        e.enterRoom("hangar", "QB");
        e.set("ch1D", true);
        e.set("ch1Night", true);
        e.set("sqPose", "ball");
        e.place("sq", BAY.ventStand.x, BAY.ventStand.y);
        e.set("moPose", "stand");
        e.place("mops", BAY.mopsVent.x, BAY.mopsVent.y);
        e.face("mops", -1);
        go("out", { crawl: { dir: "out", k: 0 }, slip: "mops" });
      }),
      e.until((dt) => ((L().crawl.k += (dt || 0) / ES_PACE.crawl), L().crawl.k >= 1)),
      e.run(() => (L().crawl = null)),
      e.say("mops", escapeWords("mops-hurry")),
      e.run(() => ((L().pose = "stand"), e.set("sqPose", "stand"), e.face("sq", -1))),
      e.say("sq", escapeWords("sq-get-it"), "whisper"),
      e.run(() => (go("grab"), control("chip-grab"))),
    ]);
  }

  // ---------- beat 49: grab the pink slip ----------
  function grab() {
    const e = E();
    busy();
    go("grabbed", { grabAt: e.time() });
    sfx("grab");
    e.queue([
      e.until(() => e.time() - L().grabAt >= ES_PACE.grab),
      e.run(() => ((L().slip = "paw"), toHallway())),
    ]);
  }
  function toHallway() {
    const e = E();
    go("tohall");
    e.goTo("passage", { who: "both", night: true, scene: "QB", stand: [HALLWAY.sq.x, HALLWAY.sq.y] }, () => {
      e.set("ctrl", false);
      e.queue([
        // Mops goes along the back to the left, where he looks at the photo wall (he never sees the sheet's front)
        e.until((dt) => (e.moWalking(true), e.step("mops", e.pos("mops").x, HALLWAY.mops.y, ES_PACE.walk, dt || 0))),
        e.until((dt) => e.step("mops", HALLWAY.mops.x, HALLWAY.mops.y, ES_PACE.walk, dt || 0)),
        e.run(() => (e.moWalking(false), e.still("mops"), e.face("mops", -1), e.face("sq", -1), go("slipview"))),
        ...cutawaySteps("esslip"),
        e.run(() => (go("pad", { cu: "pad", typed: "" }), control("chip-code"))),
      ]);
    });
  }

  // ---------- beat 50: the keypad ----------
  function press(d) {
    const e = E(),
      l = L();
    if (l.cu !== "pad" || l.okAt >= 0 || (l.buzzAt >= 0 && e.time() - l.buzzAt < KEYPAD.buzz)) return;
    if (OFFICE_CODE[l.typed.length] !== d) {
      // a wrong key: a buzz, the screen flashes red and clears; try again (no penalty)
      l.typed += d;
      l.buzzAt = e.time();
      sfx("bzzt");
      return;
    }
    l.typed += d;
    sfx("key");
    if (l.typed === OFFICE_CODE) {
      l.okAt = e.time();
      busy();
      go("open", { cu: "pad" });
      e.queue([
        e.until(() => e.time() - L().okAt >= KEYPAD.open),
        e.run(() => (Object.assign(L(), { cu: "", door: true }), sfx("open"))),
        e.until((dt) => {
          e.moWalking(true);
          const a = e.step("mops", HALLWAY.doorIn.x - 40, HALLWAY.doorIn.y - 30, ES_PACE.walk, dt || 0);
          return e.step("sq", HALLWAY.doorIn.x, HALLWAY.doorIn.y, ES_PACE.walk, dt || 0) && a;
        }),
        e.run(() => {
          e.moWalking(false);
          e.enterRoom("office", "QB");
          e.place("sq", OFFICE.door.x + 20, OFFICE.door.y);
          e.place("mops", OFFICE.door.x - 40, OFFICE.door.y);
          e.face("sq", 1);
          e.set("moPose", "stand");
        }),
        e.until((dt) => (e.moWalking(true), e.step("mops", OFFICE.mops.x, OFFICE.mops.y, ES_PACE.walk, dt || 0))),
        e.run(() => (e.moWalking(false), e.face("mops", 1), go("computer"), control("chip-crate"))),
      ]);
    }
  }

  // ---------- beat 51: the Moon Pie site ----------
  function openSite() {
    const e = E();
    e.still("sq");
    e.stopWalk && e.stopWalk();
    e.face("sq", 1);
    go("site", { cu: "site" });
    control("chip-crate");
  }
  function returnCrate() {
    const e = E();
    if (L().bookAt >= 0) return;
    busy();
    go("booked", { cu: "site", bookAt: e.time() });
    sfx("pickup");
    e.queue([e.until(() => e.time() - L().bookAt >= SITE.booked), e.run(() => ((L().cu = ""), toBar()))]);
  }
  function toBar() {
    const e = E();
    go("tobar");
    e.queue([
      e.until((dt) => {
        e.moWalking(true);
        const a = e.step("mops", OFFICE.door.x - 40, OFFICE.door.y, ES_PACE.walk, dt || 0);
        return e.step("sq", OFFICE.door.x, OFFICE.door.y, ES_PACE.walk, dt || 0) && a;
      }),
      e.run(() => {
        e.moWalking(false);
        e.enterRoom("passage", "QB");
        L().door = true;
        e.place("sq", HALLWAY.doorIn.x, HALLWAY.doorIn.y);
        e.place("mops", HALLWAY.doorIn.x - 50, HALLWAY.doorIn.y - 20);
        e.goTo("hall", { who: "both", night: true, scene: "QB", stand: [ES_BAR.out.x, ES_BAR.out.y] }, () => {
          e.set("ctrl", false);
          e.queue([
            e.until((dt) => e.step("sq", ES_BAR.top.x, ES_BAR.top.y, ES_PACE.walk, dt || 0)),
            e.until((dt) => {
              e.moWalking(true);
              const a = e.step("mops", ES_BAR.top.x, ES_BAR.top.y, ES_PACE.walk, dt || 0);
              return e.step("sq", ES_BAR.sq.x, ES_BAR.sq.y, ES_PACE.walk, dt || 0) && a;
            }),
            e.until((dt) => e.step("mops", ES_BAR.mops.x, ES_BAR.mops.y, ES_PACE.walk, dt || 0)),
            e.run(() => (e.moWalking(false), e.face("mops", 1), e.face("sq", -1), go("mopsall"))),
            e.say("mops", escapeWords("mops-all")),
            e.run(() => (go("snacks", { cu: "snacks" }), control("chip-snacks"))),
          ]);
        });
      }),
    ]);
  }

  // ---------- beat 52: all the snacks ----------
  function takeSnack(i) {
    const l = L(),
      s = l.snacks;
    if (s.carry || s.gone[i]) return;
    s.carry = { i, k: 0, to: l.step === "food" ? "plate" : "bag" };
  }
  function snackTick(l, dt) {
    const e = E(),
      s = l.snacks,
      c = s.carry;
    if (!c) return;
    c.k += dt / SNACKS.carry;
    if (c.k < 1) return;
    s.carry = null;
    s.gone[c.i] = 1;
    c.to === "plate" ? s.onPlate.push(c.i) : s.bag++;
    sfx("hide");
    if (l.step === "snacks" && s.bag >= SNACKS.forBag) {
      busy();
      go("guardians");
      e.queue([e.say("sq", escapeWords("sq-guardians")), e.run(() => ((L().snacks.plate = true), go("food"), control("chip-food")))]);
    } else if (l.step === "food" && Object.keys(s.gone).length >= SNACKS.kinds.length) {
      busy();
      go("hearts", { cu: "", heartsAt: e.time() });
      e.queue([e.until(() => e.time() - L().heartsAt >= ES_PACE.hearts), e.run(toHome)]);
    }
  }
  function toHome() {
    const e = E();
    go("tohome");
    e.queue([
      e.until((dt) => {
        e.moWalking(true);
        const a = e.step("mops", ES_BAR.out.x + 50, ES_BAR.out.y - 30, ES_PACE.walk, dt || 0);
        return e.step("sq", ES_BAR.top.x, ES_BAR.top.y + 10, ES_PACE.walk, dt || 0) && a;
      }),
      e.until((dt) => e.step("sq", ES_BAR.out.x, ES_BAR.out.y, ES_PACE.walk, dt || 0)),
      e.run(() => {
        e.moWalking(false);
        e.goTo("closet", { who: "both", scene: "QB", stand: [ES_HOME.sq.x, ES_HOME.sq.y] }, () => {
          e.set("ctrl", false);
          e.queue([
            // Mops goes over by the TV, his back to the closet
            e.until((dt) => (e.moWalking(true), e.step("mops", ES_HOME.mopsNight.x, ES_HOME.mopsNight.y, ES_PACE.walk, dt || 0))),
            e.run(() => (e.moWalking(false), e.face("mops", 1), go("closet"), control("chip-slip"))),
          ]);
        });
      }),
    ]);
  }
  function openCloset() {
    const e = E();
    e.still("sq");
    e.stopWalk && e.stopWalk();
    e.face("sq", -1);
    e.set("wardrobe", "open");
    sfx("pickup");
    go("box");
    control("chip-slip");
  }
  function putIn() {
    const e = E();
    busy();
    go("boxview");
    e.queue([
      ...cutawaySteps("esbox"),
      e.run(() => {
        L().slip = "box";
        e.set("wardrobe", "closed");
        go("bed");
      }),
      e.until((dt) => e.step("sq", ES_HOME.bedFoot.x, ES_HOME.bedFoot.y, ES_PACE.walk, dt || 0)),
      e.run(() => {
        e.set("sqPose", "sleep");
        e.place("sq", ES_HOME.bed.x, ES_HOME.bed.y);
        sfx("snore");
        L().t0 = 0;
      }),
      wait(ES_PACE.lie * 2),
      e.run(handOff),
    ]);
  }
  function handOff() {
    const e = E();
    L().step = "done";
    record.steps.push("done");
    e.set("sqPose", "stand");
    chip("");
    // beat 53, as it is today (14-ch1-day2.js ch1PackStart)
    e.packStart();
  }

  // ---------- every frame ----------
  function tick(dt) {
    const l = live(),
      e = E();
    if (!l) return;
    dt = dt || 0;
    const free = e.get("ctrl") && !e.current();
    // Mops walking, for his legs (the escape draws him in the rooms it owns)
    const m = e.pos("mops");
    moMoving = !!lastMops && Math.hypot(m.x - lastMops.x, m.y - lastMops.y) > 0.3;
    lastMops = m;
    if (l.robot && e.room() === "hangar" && l.robot.phase !== "asleep") robotTick(l, dt);
    // Steering steps him out of a ball (as in the lunch sneak).
    if (free && l.pose === "ball" && l.step === "ball" && e.steering()) {
      l.pose = "stand";
      e.set("sqPose", "stand");
    }
    // rolled up at the vent with nothing after him: the robot ends its rounds and docks in the mail room (it rolls past
    // him, not near enough to notice a ball), then the picture goes inside the vent
    if (l.step === "ball" && free && l.pose === "ball" && atVent() && l.robot && l.robot.phase === "patrol" && !e.secOn()) {
      busy();
      go("rolled");
      const r = l.robot;
      Object.assign(r, { phase: "dock", t: 0, route: [{ x: Math.max(r.x, BAY.patrol.x0), y: BAY.patrol.y }, ...BAY.toDock].map((q) => ({ ...q })) });
    }
    if (l.step === "rolled" && l.robot && l.robot.phase === "asleep" && (l.t0 += dt) >= ES_PACE.ballWait) inside();
    // a close-up is open: he stays where he is (the stick does not walk him off behind it)
    if (l.cu && free) e.still("sq");
    if (l.step === "food" || l.step === "snacks") snackTick(l, dt);
    // a wrong try on the keypad: after the buzz the screen clears
    if (l.cu === "pad" && l.buzzAt >= 0 && e.time() - l.buzzAt >= KEYPAD.buzz) ((l.buzzAt = -1), (l.typed = ""));
  }

  // ---------- spots ----------
  function spot(id, wordsId, place, thing, f) {
    const [verb, cap] = escapeWords(wordsId).split(" · ");
    return { id, verb, cap, who: "sq", ...place, at: thing ? [(thing.x0 + thing.x1) / 2, thing.y0] : undefined, thing, f };
  }
  const mouthBox = () => {
    const m = E().pos("mops"),
      k = moScale("hangar");
    return { x0: m.x - 34 * k, x1: m.x + 4 * k, y0: m.y - 44 * k, y1: m.y - 18 * k };
  };
  function spots() {
    const l = live(),
      e = E();
    if (!l || !e.get("ctrl")) return [];
    // in a close-up the big button does the next thing too (for a keyboard, or a kid who presses it): the site's big
    // button, the next snack (TAKE · snack, then LEAVE · food); the keypad takes the keyboard's digits
    if (l.cu) {
      const s = e.pos("sq"),
        left = SNACKS.kinds.findIndex((_, i) => !l.snacks.gone[i]),
        hot = (id, wordsId, f) => [{ id, verb: escapeWords(wordsId).split(" · ")[0], cap: escapeWords(wordsId).split(" · ")[1], who: "sq", hot: true, x: s.x, y: s.y, r: 40, f }];
      if (l.step === "site") return hot("es-site", "button-computer", returnCrate);
      if (l.step === "snacks" && left >= 0 && !l.snacks.carry) return hot("es-snack", "button-snack", () => takeSnack(left));
      if (l.step === "food" && left >= 0 && !l.snacks.carry) return hot("es-food", "button-food", () => takeSnack(left));
      return [];
    }
    if (l.step === "ball" && l.pose === "stand") {
      const s = e.pos("sq"),
        [verb, cap] = escapeWords("button-ball").split(" · ");
      // ROLL · ball by the vent (the goal: its outline, goal-targets.js "hangar:es-ball"); while the robot is after him
      // or a guard is out, wherever he stands (C20), so he can always hide
      if (e.secOn() || (l.robot && l.robot.phase !== "patrol")) return [{ id: "es-ball-any", verb, cap, who: "sq", hot: true, x: s.x, y: s.y, r: 40, at: [s.x, s.y - 70], f: rollUp }];
      return [{ id: "es-ball", verb, cap, who: "sq", x: BAY.ventStand.x, y: BAY.ventStand.y, r: 60, at: [BAY.ventStand.x, BAY.ventStand.y - 70], thing: BAY.vent, f: rollUp }];
    }
    if (l.step === "grab" && e.room() === "hangar") {
      const m = e.pos("mops");
      return [spot("es-grab", "button-grab", { x: m.x + 30, y: m.y, r: 90 }, mouthBox(), grab)];
    }
    if (l.step === "computer" && e.room() === "office") return [spot("es-computer", "button-computer", { x: OFFICE.sq.x, y: OFFICE.sq.y, r: 90 }, OFFICE.monitor, openSite)];
    if (l.step === "closet" && e.room() === "closet") return [spot("es-closet", "button-closet", { x: ES_HOME.closet.x, y: ES_HOME.closet.y, r: 90 }, ES_HOME.wardrobe, openCloset)];
    if (l.step === "box" && e.room() === "closet") return [spot("es-box", "button-box", { x: ES_HOME.closet.x, y: ES_HOME.closet.y, r: 90 }, MORNING_THINGS.boxIn, putIn)];
    return [];
  }

  // ---------- drawing ----------
  // Squatch and Mops in a room the escape draws itself (the bay, the vent), at that room's size.
  function people(ctx, l, room) {
    const e = E(),
      t = e.time(),
      s = e.pos("sq"),
      m = e.pos("mops"),
      ks = sqScale(room),
      km = moScale(room);
    const list = [];
    if (e.get("moPose") !== "hidden" && !l.crawl)
      list.push({ y: m.y, f: () => (e.drawMopsOn(ctx, m.x, m.y, km, { f: m.f || 1, walk: l.mopping || moMoving ? t * 8 : 0, headDown: !!l.mopping, sweep: l.mopping ? Math.sin(t * 6) * 4 : 0 }), mopsSlip(ctx, l, m, km)) });
    if (room === "hangar" && e.get("sqPose") !== "hidden" && s.x > -100) {
      if (l.pose === "ball" || e.get("sqPose") === "ball") list.push({ y: s.y, f: () => e.ball.drawOn(ctx, s.x, s.y - 16, 1) });
      else list.push({ y: s.y, f: () => (e.drawSquatch(ctx, s.x, s.y, ks, { f: s.f || 1, walk: e.walkPhase() }), pawSlip(ctx, l, s, ks)) });
    }
    list.sort((a, b) => a.y - b.y).forEach((p) => p.f());
  }
  // The slip in Mops's mouth, and in Squatch's paw.
  function mopsSlip(ctx, l, m, k) {
    if (l.slip !== "mops") return;
    const f = m.f || 1;
    drawSlipSmall(ctx, m.x + f * 22 * k, m.y - 30 * k, Math.max(0.9, k * 0.7), 0.3 * f);
  }
  function pawSlip(ctx, l, s, k) {
    if (l.slip !== "paw" || l.cu) return;
    const p = sqPawAt(s.x, s.y, s.f || 1, k);
    drawSlipSmall(ctx, p.x, p.y + 4, Math.max(0.9, k * 0.6), 0.1);
  }
  function drawBay(ctx, l) {
    const e = E(),
      t = e.time(),
      night = !!e.get("ch1Night"),
      p = night ? pics.night : pics.day;
    p && p.complete && p.naturalWidth ? ctx.drawImage(p, 0, 0, 960, 640) : ((ctx.fillStyle = "#8a8fa0"), ctx.fillRect(0, 0, 960, 640));
    const out = { room: "hangar", night };
    // the grille swung open while Mops goes in or comes out; him, half in the dark hole
    if (l.crawl) {
      drawOpenVent(ctx, BAY.vent);
      const v = BAY.vent,
        k = l.crawl.dir === "in" ? l.crawl.k : 1 - l.crawl.k,
        km = moScale("hangar"),
        x = BAY.mopsVent.x + (((v.x0 + v.x1) / 2) - BAY.mopsVent.x) * k,
        y = BAY.mopsVent.y + (v.y1 - 8 - BAY.mopsVent.y) * k;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, k > 0.6 ? 0 : 0, 960, k > 0.6 ? v.y1 : 640);
      ctx.clip();
      e.drawMopsOn(ctx, x, y, km * (1 - k * 0.25), { f: 1, walk: t * 10 });
      mopsSlip(ctx, l, { x, y, f: 1 }, km);
      ctx.restore();
      out.crawl = +k.toFixed(2);
    }
    // the tease: three robots circle Mops, bobbing; the near one sweeps a white tuft the way he mops with his beard
    if (l.step === "tease") {
      BAY.teaseBots.forEach((b, i) => {
        const bob = Math.abs(Math.sin(t * 7 + i)) * 8,
          dx = Math.sin(t * 1.5 + i * 2) * 14;
        e.drawRobot(ctx, b.x + dx, b.y - bob, false, adultPxFor("hangar") / 47);
        if (i === 2) {
          ctx.beginPath();
          ctx.ellipse(b.x + dx + 26 + Math.sin(t * 6) * 8, b.y + 4, 16, 6, 0, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.fill();
          ctx.strokeStyle = "#1e2430";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
      out.robots = BAY.teaseBots.length;
    }
    // the night robot on patrol, its cone (dashed, yellow while he is in it), and its "!"
    const r = l.robot;
    if (r) {
      const c = robotCone(r),
        s = e.pos("sq"),
        awake = r.phase !== "asleep" && r.phase !== "dock";
      awake && (out.cones = drawCones(ctx, [{ ...c, always: true, bold: true }], s, l.pose !== "stand", true, (q) => e.noteCone(q)));
      ctx.save();
      // docked in the mail room it powers down (its light out): drawn dimmer, with no cone
      r.phase === "asleep" && (ctx.globalAlpha = 0.75);
      e.drawRobot(ctx, r.x, r.y, false, adultPxFor("hangar") / 47);
      ctx.restore();
      (r.phase === "bang" || r.phase === "run") && drawBang(ctx, r.x, r.y - 70);
      out.robot = { x: Math.round(r.x), y: Math.round(r.y), phase: r.phase };
    }
    // the slip in Mops's mouth glows while he is to grab it
    l.step === "grab" && e.get("ctrl") && glowBox(ctx, mouthBox(), t, 1);
    // the vent glows while he is to roll up by it
    l.step === "ball" && e.get("ctrl") && l.pose === "stand" && glowBox(ctx, BAY.vent, t, 0.8);
    people(ctx, l, "hangar");
    return out;
  }
  function drawVent(ctx, l) {
    const e = E(),
      t = e.time(),
      m = e.pos("mops");
    drawVentRoom(ctx, t, {});
    e.get("moPose") !== "hidden" && e.drawMopsOn(ctx, m.x, m.y, VENT_ROOM.scale, { f: 1, walk: moMoving ? t * 8 : 0 });
    mopsSlip(ctx, l, m, VENT_ROOM.scale);
    const d = drawVentDesk(ctx, t, { slip: l.slip === "desk" ? "desk" : "", glowSlip: l.glow === "slip" });
    return { room: "duct", sheet: d.sheet, glowSlip: l.glow === "slip", mopsBack: (m.f || 1) > 0 };
  }

  /** The rooms the escape draws itself: the loading bay (by day and at night) and the inside of the vent. */
  function drawRoom(ctx) {
    const l = live();
    if (!l) return false;
    const room = E().room();
    if (room === "hangar") return ((drew = { step: l.step, ...drawBay(ctx, l) }), true);
    if (room === "duct") return ((drew = { step: l.step, ...drawVent(ctx, l) }), true);
    return false;
  }
  /** Over the rooms the older program draws (home, the hallway, the office, the hall): the escape's things. */
  function draw(ctx) {
    const l = live(),
      e = E();
    if (!l) return;
    const room = e.room(),
      t = e.time(),
      s = e.pos("sq"),
      m = e.pos("mops");
    if (room === "hangar" || room === "duct") return;
    drew = { step: l.step, room };
    if (room === "closet") {
      // the pancake brochure on the wall (lit while Mops talks about it)
      l.glow === "brochure" && glowBox(ctx, ES_HOME.brochure, t, 1.1);
      drawBrochure(ctx, ES_HOME.brochure);
      drew.brochure = { glow: l.glow === "brochure" };
    }
    // the thought pictures over a head
    if (l.think && room === "closet") {
      const who = l.think.who,
        p = who === "mops" ? m : s,
        k = who === "mops" ? moScale("closet") : sqScale("closet"),
        head = { x: p.x, y: p.y - 46 * k },
        a = Math.min(1, (t - l.think.at) / 0.3),
        kind = l.think.kind;
      const box = kind === "crate" ? thinkCrateShip(ctx, head, a) : kind === "door" ? thinkLockedDoor(ctx, head, a) : thinkSlipVent(ctx, head, a, t - l.think.at);
      drew.think = { who, kind, box };
    }
    // the slip in his paw (the older program draws him in these rooms)
    room !== "closet" || l.step !== "bed" ? pawSlip(ctx, l, s, sqScale(room)) : null;
    if (room === "passage" && l.door) drawDoorOpen(ctx);
    // the office picture's own drawing has no Mops (12-ch1-redesign.js drawCh1OfficeRoom): the escape draws him there
    if (room === "office" && e.get("moPose") !== "hidden") {
      e.drawMopsOn(ctx, m.x, m.y, moScale("office"), { f: m.f || 1, walk: moMoving ? t * 8 : 0 });
      drew.mops = { x: Math.round(m.x), y: Math.round(m.y) };
    }
    // hearts over Mops at the snack counter (he says nothing)
    if (l.heartsAt >= 0 && l.step === "hearts" && room === "hall") drawHearts(ctx, m.x, m.y - 46 * moScale("hall"), t - l.heartsAt);
    // the close-ups over the blurred room
    if (l.cu) {
      blurBehind(ctx);
      if (l.cu === "pad") {
        const buzz = l.buzzAt >= 0 ? Math.max(0, 1 - (t - l.buzzAt) / KEYPAD.buzz) : 0;
        drew.pad = drawKeypad(ctx, { typed: l.typed, buzz, ok: l.okAt >= 0, t });
      } else if (l.cu === "site") drew.site = drawSite(ctx, { booked: l.bookAt >= 0 ? t - l.bookAt : -1, t });
      else if (l.cu === "snacks") {
        const st = { ...l.snacks, next: l.step === "food" ? "plate" : l.step === "snacks" ? "snack" : "" };
        drew.snacks = drawSnackCounter(ctx, st, t);
      }
    }
  }

  // ---------- taps on the close-ups ----------
  /** A tap on the picture (game positions; 14-ch1-day2.js ch1WorldTap). True when the escape used it. */
  function tap(x, y) {
    const l = live();
    if (!l || !l.cu) return false;
    if (l.cu === "pad" && l.step === "pad") {
      for (const d of ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]) {
        const k = keyAt(d);
        if (Math.hypot(x - k.x, y - k.y) <= KEYPAD.r + 6) return (press(d), true);
      }
      return true;
    }
    if (l.cu === "site" && l.step === "site") {
      const r = SITE.ret;
      x >= r.x0 && x <= r.x1 && y >= r.y0 && y <= r.y1 ? returnCrate() : E().sfx("bzzt");
      return true;
    }
    if (l.cu === "snacks" && (l.step === "snacks" || l.step === "food")) {
      for (let i = 0; i < SNACKS.kinds.length; i++) if (!l.snacks.gone[i] && Math.hypot(x - SNACKS.at[i].x, y - SNACKS.at[i].y) <= SNACKS.r + 8) return (takeSnack(i), true);
      // the Guardians' plate: a tap on it puts the next snack left on it
      const P = SNACKS.plate,
        left = SNACKS.kinds.findIndex((_, i) => !l.snacks.gone[i]);
      l.step === "food" && left >= 0 && Math.hypot(x - P.x, y - (P.y - 30)) <= P.r + 20 && takeSnack(left);
      return true;
    }
    return true;
  }

  // ---------- a jump (the localhost link, tests, ↺) ----------
  /**
   * Straight to `step` ("start", or one of ESCAPE_STEPS' main steps: ball, grab, pad, computer, snacks, closet), with
   * everything before it done. The older program has set Day 2 (ch1Day2) already.
   */
  function jump(step) {
    const e = E();
    busy();
    settle();
    e.set("ch1Journey", false); // (a restart in the middle of a walk between rooms: that walk is over)
    if (step === "start") return start();
    const at = { site: "computer", food: "snacks", box: "closet" }[step] || step;
    const i = ["ball", "grab", "pad", "computer", "snacks", "closet"].indexOf(at);
    if (i < 0) return;
    e.set("ch1Escape", fresh({ slip: i >= 1 ? "paw" : "vent" }));
    e.set("sqPose", "stand");
    e.set("moPose", "stand");
    e.set("wardrobe", "closed");
    if (at === "ball" || at === "grab") {
      e.enterRoom("hangar", "QB");
      e.set("ch1D", true);
      e.set("ch1Night", true);
      e.place("sq", BAY.ventStand.x, BAY.ventStand.y + (at === "ball" ? 40 : 0));
      e.face("sq", -1);
      if (at === "ball") (e.set("moPose", "hidden"), go("ball", { robot: freshRobot() }));
      else (e.place("mops", BAY.mopsVent.x, BAY.mopsVent.y), e.face("mops", -1), go("grab", { slip: "mops", robot: { ...freshRobot(), ...BAY.toDock[BAY.toDock.length - 1], phase: "asleep" } }));
      return control(at === "ball" ? "chip-ball" : "chip-grab");
    }
    if (at === "pad") {
      e.enterRoom("passage", "QB");
      e.place("sq", HALLWAY.sq.x, HALLWAY.sq.y);
      e.place("mops", HALLWAY.mops.x, HALLWAY.mops.y);
      e.face("sq", -1);
      e.face("mops", -1);
      go("pad", { cu: "pad" });
      return control("chip-code");
    }
    if (at === "computer") {
      e.enterRoom("office", "QB");
      e.place("sq", OFFICE.door.x + 20, OFFICE.door.y);
      e.place("mops", OFFICE.mops.x, OFFICE.mops.y);
      e.face("sq", 1);
      e.face("mops", 1);
      go("computer");
      return control("chip-crate");
    }
    if (at === "snacks") {
      e.enterRoom("hall", "QB");
      e.place("sq", ES_BAR.sq.x, ES_BAR.sq.y);
      e.place("mops", ES_BAR.mops.x, ES_BAR.mops.y);
      e.face("sq", -1);
      e.face("mops", 1);
      go("snacks", { cu: "snacks" });
      return control("chip-snacks");
    }
    e.enterRoom("closet", "QB");
    e.place("sq", ES_HOME.sq.x, ES_HOME.sq.y);
    e.place("mops", ES_HOME.mopsNight.x, ES_HOME.mopsNight.y);
    e.face("mops", 1);
    go("closet");
    control("chip-slip");
  }

  return {
    start,
    jump,
    /**
     * ↺ in a part where the player has no control (no step start was saved for it): back to its last step he
     * controlled (RESTART_TO). True when it did. In a step he controls, false: the step restart brings it back.
     */
    restart() {
      const l = live();
      if (!l || ESCAPE_STEPS.includes(l.step)) return false;
      const to = RESTART_TO[l.step];
      if (!to) return false;
      jump(to);
      return true;
    },
    /** True from "Six days later" until he is in bed and beat 53 starts. */
    active() {
      return !!live();
    },
    /** True while the escape draws the room on screen (the loading bay, the inside of the vent). */
    ownsRoom() {
      const r = live() && E().room();
      return r === "hangar" || r === "duct";
    },
    /** True while the night robot has seen him and security is out (no music then: bridge.js refineCue). */
    alarmOn() {
      const l = live();
      return !!(l && l.robot && l.robot.phase !== "patrol" && l.robot.phase !== "back");
    },
    alarmKey() {
      return live() || null;
    },
    /** Where a speaker's bubble points, in the rooms and close-ups the escape draws (bridge.js speakerAt). */
    speakerAt(who) {
      const l = live(),
        e = E();
      if (!l) return null;
      const room = e.room();
      if (room === "duct") {
        if (who === "sq") return { x: VENT_ROOM.eyes.x, y: VENT_ROOM.eyes.y - 20 };
        if (who === "mops") return { x: e.pos("mops").x, y: e.pos("mops").y - 46 * VENT_ROOM.scale };
      }
      if (room === "hangar" && who === "robot" && l.step === "tease") return { x: BAY.teaseBots[1].x, y: BAY.teaseBots[1].y - 80 };
      if (room === "hall" && who === "sq" && l.cu === "snacks") return { x: SNACKS.rest.x, y: SNACKS.rest.y - 160 };
      return null;
    },
    tick,
    spots,
    tap,
    /** True while the keypad close-up takes keys (the older program sends the keyboard's digits to key()). */
    padOpen() {
      const l = live();
      return !!(l && l.cu === "pad" && l.step === "pad");
    },
    /** One digit from the keyboard on the keypad close-up. */
    key(d) {
      this.padOpen() && press(String(d));
    },
    draw,
    drawRoom,
    bounds() {
      return null;
    },
    solids() {
      return [];
    },
    /** Tests: the code, the places. */
    place: Object.freeze({ OFFICE_CODE, BAY, HALLWAY, OFFICE, BAR: ES_BAR, HOME: ES_HOME, KEYPAD, SITE, SNACKS, VENT_ROOM, keyAt }),
    /** Tests: the state, what the last frame drew, the steps so far. */
    debug() {
      const l = L();
      return { state: l ? JSON.parse(JSON.stringify(l)) : null, active: !!live(), drew, steps: record.steps.slice(), sounds: record.sounds.slice(), words: escapeDrawnWords() };
    },
  };
}
