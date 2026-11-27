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
 *   home      45  home that night: Mops comes in; the pancake brochure on the wall is outlined while he says his line (NEXT);
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
 *                 (Mars crossed off) (NEXT), the reply letter stamped NO (NEXT). The pink sheet on the desk is outlined:
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
import { OFFICE_CODE, BAY_DAY, BAY_NIGHT, ES_HOME, BAY, ROBOT_SIGHT, VENT_ROOM, HALLWAY, KEYPAD, keyAt, OFFICE, SITE, ES_BAR, SNACKS, ES_PACE, NIGHT_LIT, WEEK, MOP_CALM, MOPOFF, NEWS, ROUTE_HOME, ROUTE_VENT, HALL_GUEST, PLAQUE, FOLLOW, ES_DOORS } from "./escape-place.js";
import { freshFloor, goatCells, beardAt, mopCalm, mopGoat, goatClean, wheelsAcross, starFor, bars, robotsAt, drawCalmFloor, drawMopFloor, drawBars, drawStarCloseup, markPatch } from "./escape-mopoff.js";
import { doorAt, doorTo, markDoor, freshTrail, followStep } from "./escape-doors.js";
import { drawWeek } from "./escape-home-art.js";
import { LUNCH_SOLIDS, LUNCH_BOUNDS } from "./lunch-sneak-place.js";
import { createGuestArt } from "./guests.js";
import {
  drawBrochure,
  thinkCrateShip,
  thinkLockedDoor,
  thinkSlipVent,
  drawOpenVent,
  drawVentRoom,
  drawVentDesk,
  drawSlipSmall,
  blurBehind,
  drawKeypad,
  drawDoorOpen,
  drawSite,
  drawSnackCounter,
  drawHearts,
  markBox,
  escapeDrawnWords,
} from "./escape-art.js";
import { cutawaySteps } from "./cutaway.js";
import { coneFrom, lookAt } from "./party-watch.js";
import { BAY_SOLIDS, BAY_DOOR, SIGHT, bayPath, coneOnBody, watchTick, drawWatchCone, drawWatchMark, newGuard, guardTick, drawGuard } from "./bay-watch.js";
import { splitLine } from "./line-split.js";
import { drawNightTint } from "./night-look.js";
import { partyLine } from "./party-lines.js";
import { adultPxFor } from "./room-sizes.js";
import { sqPawAt } from "./lunch-sneak-art.js";
import { MORNING_THINGS } from "./home-morning-art.js";

export const ESCAPE_ID = "ch1-escape";
// The steps the player controls (ch1Step "es-<step>"), in order. (jump() takes these, and "start".)
export const ESCAPE_STEPS = Object.freeze(["mop", "mopoff", "walkhome", "ball", "grab", "pad", "computer", "site", "snacks", "food", "closet", "box"]);
// The steps where the stick drives Mops (the rest drive Squatch).
const MOPS_STEPS = Object.freeze(["mop", "mopoff", "walkhome"]);
// Where a step the player does not control goes back to on ↺ (its last step he controlled, or the start).
const RESTART_TO = Object.freeze({
  card: "start",
  mopin: "mop",
  sides: "mopoff",
  buzzer: "mopoff",
  star: "mopoff",
  news: "mopoff",
  homeward: "mopoff",
  home: "walkhome",
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
  let shadowAt = null,
    drew = null,
    record = { steps: [], sounds: [] },
    lastMops = null,
    moMoving = false,
    driving = ""; // "mops" while the stick drives Mops (the escape switched him in; a chapter reset switches back)
  const guests = createGuestArt();

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
    floor: null,
    ct: 0,
    paint: 1,
    talker: 0,
    star: "",
    route: "",
    trail: null,
    waved: false,
    plaque: false,
    ...(extra || {}),
  });
  /** Day 2's morning and lunch are over, the pink sheet is in the vent, the brochure is pinned up at home. */
  function settle() {
    const e = E(),
      hm = e.get("ch1HomeMorning");
    e.set("ch1HomeMorning", { ...(hm || {}), step: "done", gift: "box", boxOut: false, door: false, bag: "taken", heart: -1 });
    e.set("ch1Brochure", false); // (the older program would draw it in his paw: it is on the wall now)
  }

  // ---------- beat 43: "Six days later", on the home calendar ----------
  /** Night one is over (14-ch1-day2.js ch1SixDays hands over here). */
  function start() {
    const e = E();
    record = { steps: [], sounds: [] };
    settle();
    e.set("ch1Escape", fresh());
    busy();
    e.playAs("squatch");
    e.set("ch1D", false);
    e.set("ch1Night", false);
    e.set("sqPose", "stand");
    e.set("wardrobe", "closed");
    e.enterRoom("closet", "QB");
    e.place("sq", ES_HOME.sq.x, ES_HOME.sq.y);
    e.set("moPose", "hidden");
    // the week on the calendar: six days get an X, one at a time; tomorrow says DELIVERY (the one highlight); NEXT
    go("card", { cu: "cal", calAt: e.time() });
    // (NEXT is up from the start; the days are crossed off while it waits)
    e.queue([e.tapWait(), e.run(() => ((L().cu = ""), toWork()))]);
  }

  // ---------- beat 44a: Mops at work (the player is Mops) ----------
  /** Mops, the player, in the bay by day: the switch is announced, then he mops the cart tracks clean. */
  function toWork() {
    const e = E();
    e.enterRoom("hangar", "QB");
    e.set("ch1D", true);
    e.set("ch1Night", false);
    e.set("sqPose", "hidden");
    e.place("sq", -400, -400);
    e.set("moPose", "stand");
    e.place("mops", MOP_CALM.start.x, MOP_CALM.start.y);
    e.face("mops", 1);
    go("mopin", { floor: freshFloor(), night: false });
    e.queue([e.run(() => asMops("switch-work", () => (go("mop"), control("chip-mop"), hum())))]);
  }
  // The switch to Mops, announced ("You are MOPS now." and why), then `then` once the card is gone.
  function asMops(whyId, then) {
    const e = E();
    driving = "mops";
    e.playAs("mops", escapeWords(whyId));
    e.queue([e.run(then)]);
  }
  function asSquatch(whyId, then) {
    const e = E();
    driving = "";
    e.playAs("squatch", escapeWords(whyId));
    e.queue([e.run(then)]);
  }
  // he hums their song as he mops (a line that fades by itself, and his bleat)
  function hum() {
    const e = E();
    e.ambient("mops", escapeWords("mops-hum"));
    record.sounds.push("mops-bleat");
    bridge.playSoundPick("mops-bleat");
  }

  // ---------- beat 44b: the Mop-Off ----------
  function robotsIn() {
    const e = E();
    busy();
    go("sides", { zipAt: e.time(), paint: 0, talker: 0 });
    e.queue([
      e.until(() => e.time() - L().zipAt >= MOPOFF.zip),
      e.until((dt) => (L().paint = Math.min(1, L().paint + (dt || 0) / 0.9)) >= 1),
      ...sayParts("robot", "robot-sides"),
      e.run(() => (go("mopoff", { ct: 0, taunt: 0 }), control("chip-mopoff"))),
    ]);
  }
  function mopoffTick(l, dt) {
    const e = E(),
      m = e.pos("mops");
    l.ct += dt;
    moMoving && mopGoat(l.floor, beardAt(m.x, m.y, m.f), e.time());
    if (!l.floor.wheelsDone && l.ct >= MOPOFF.wheels.at) (wheelsAcross(l.floor), sfx("bleep"));
    const next = MOPOFF.taunts[l.taunt];
    if (next && l.ct >= next.at) {
      l.taunt++;
      l.talker = l.taunt % 3;
      e.ambient("robot", escapeWords(next.id));
    }
    const clean = goatClean(l.floor);
    if (l.ct >= MOPOFF.goatTime || clean.all) buzzer(clean);
  }
  function buzzer(clean) {
    const e = E();
    busy();
    sfx("bzzt");
    go("buzzer", { star: starFor(clean), clean: +clean.k.toFixed(2), talker: 1 });
    e.queue([
      wait(MOPOFF.hold),
      ...sayParts("robot", "robot-time"),
      ...sayParts("robot", "robot-goat"),
      ...sayParts("robot", "robot-hq"),
      e.run(() => (go("star", { cu: "star", starAt: e.time(), star: L().star }), sfx("pickup"))),
      e.until(() => e.time() - L().starAt >= 0.6),
      e.tapWait(),
      e.run(() => ((L().cu = ""), news())),
    ]);
  }

  // ---------- beat 44c: "HQ got the order" ----------
  function news() {
    const e = E();
    go("news", { talker: 0 });
    const by = (i) => e.run(() => (L().talker = i));
    e.queue([
      e.until((dt) => (e.moWalking(true), e.step("mops", NEWS.mops.x, NEWS.mops.y, ES_PACE.walk, dt || 0))),
      e.run(() => (e.moWalking(false), e.still("mops"), e.face("mops", -1))),
      by(0),
      ...sayParts("robot", "robot-enjoy"),
      by(1),
      ...sayParts("robot", "robot-order"),
      by(0),
      ...sayParts("robot", "robot-more"),
      by(1),
      ...sayParts("robot", "robot-no-ganitor"),
      ...sayParts("mops", "mops-who"),
      by(0),
      ...sayParts("robot", "robot-stormtop"),
      ...sayParts("mops", "mops-form"),
      ...sayParts("mops", "mops-replace"),
      ...sayParts("mops", "mops-sent"),
      ...sayParts("mops", "mops-lied"),
      e.run(() => (record.sounds.push("mops-bleat"), bridge.playSoundPick("mops-bleat"))),
      e.run(walkHome),
    ]);
  }

  // ---------- beat 44d: walk home (the player is still Mops) ----------
  function walkHome() {
    const e = E();
    go("homeward", { bots: "gone" });
    e.queue([...sayParts("mops", "mops-right"), ...sayParts("mops", "mops-tell"), e.run(() => (go("walkhome", { route: "home" }), control("chip-home")))]);
  }
  // Through a doorway (escape-doors.js): into the next room, the walker at the door's place, his follower behind him.
  function throughDoor(d) {
    const e = E(),
      l = L(),
      walker = driving === "mops" ? "mops" : "sq";
    // (the walk log follows Squatch's feet: while he is hidden at home and Mops walks, it follows the walker's)
    const sq = e.pos("sq"),
      away = walker === "mops" && sq.x < 0;
    away && e.place("sq", e.pos("mops").x, e.pos("mops").y);
    e.walkOff();
    away && e.place("sq", d.at.x, d.at.y);
    e.enterRoom(d.to, "QB");
    away && e.place("sq", sq.x, sq.y);
    e.set("ch1D", d.to === "hangar");
    e.set("ch1Night", !!l.night);
    e.place(walker, d.at.x, d.at.y);
    e.face(walker, d.f);
    if (walker === "sq" && e.get("moPose") !== "hidden") (e.place("mops", d.at.x - d.f * FOLLOW.gap, d.at.y), e.face("mops", d.f), (l.trail = freshTrail()));
    sfx("open");
  }
  function walkTick(l, dt) {
    const e = E(),
      who = driving === "mops" ? "mops" : "sq",
      p = e.pos(who),
      room = e.room(),
      route = l.route === "home" ? ROUTE_HOME : ROUTE_VENT;
    // Mops behind Squatch, along his trail
    if (who === "sq" && e.get("moPose") !== "hidden" && l.trail) {
      const to = followStep(l.trail, p, e.pos("mops"));
      e.moWalking(!!to);
      to ? e.step("mops", to.x, to.y, FOLLOW.speed, dt) : e.still("mops");
    }
    // a guest in the hall by day waves at Mops
    if (l.step === "walkhome" && room === "hall" && !l.waved && Math.hypot(p.x - HALL_GUEST.x, p.y - HALL_GUEST.y) < HALL_GUEST.near) ((l.waved = true), e.ambient("tourist", escapeWords("guest-hi")));
    const d = doorAt(room, p);
    if (!d) return;
    // home: the walk ends there (44d: Mops comes in)
    if (l.step === "walkhome" && d.to === "closet") return arriveHome(d);
    // only the doors on the way (and back the way he came)
    if (route[room] === d.to || route[d.to] === room) (throughDoor(d), control(l.step === "walkhome" ? "chip-home" : "chip-sneak"));
  }
  function arriveHome(d) {
    throughDoor(d);
    busy();
    homeTalk();
  }
  // LOOK · plaque: his own Employee of the Month photo in the hallway (optional, once)
  function lookPlaque() {
    const e = E();
    busy();
    L().plaque = true;
    e.face("mops", 1);
    e.queue([...sayParts("mops", "mops-plaque"), e.run(() => control("chip-home"))]);
  }

  // ---------- beats 45 and 46: home that night ----------
  // A line in bubbles of at most twelve words each (line-split.js; Brian 2026-11-26): the same words, cut only where a
  // sentence ends. `onPart(i, part)` runs before each part (the brochure's outline comes on with the part that names it).
  function sayParts(who, id, style, onPart) {
    const e = E(),
      parts = splitLine(escapeWords(id));
    return parts.flatMap((part, i) => [...(onPart ? [e.run(() => onPart(i, part))] : []), style ? e.say(who, part, style) : e.say(who, part)]);
  }
  // (beats 45 and 46 are rebuilt in the next step of this round; until then their lines play in order)
  function homeTalk() {
    const e = E();
    e.set("ch1D", false);
    e.set("sqPose", "stand");
    e.place("sq", ES_HOME.sq.x, ES_HOME.sq.y);
    e.face("sq", 1);
    e.set("moPose", "stand");
    go("home", { mopping: false, night: true });
    e.queue([
      e.until((dt) => (e.moWalking(true), e.step("mops", ES_HOME.mops.x, ES_HOME.mops.y, ES_PACE.mopsIn, dt || 0))),
      e.run(() => (e.moWalking(false), e.still("mops"), e.face("mops", -1))),
      e.run(() =>
        asSquatch("switch-home", () =>
          e.queue([
            ...["mops-you-right", "mops-replacing", "mops-ship", "mops-brochure", "mops-pancake-go"].flatMap((id) => sayParts("mops", id)),
            ...sayParts("mops", "mops-ate"),
            ...sayParts("sq", "sq-slip"),
            e.run(() => think("sq", "vent")),
            wait(ES_PACE.think),
            e.run(() => (L().think = null)),
            ...sayParts("sq", "sq-vent"),
            e.run(toBay),
          ]),
        ),
      ),
    ]);
  }
  function think(who, kind) {
    Object.assign(L(), { think: { who, kind, at: E().time() }, t0: 0 });
  }

  // ---------- beat 47: to the vent, and the ball ----------
  // Two people along a route of corners: Squatch to each corner, Mops one corner behind him (so both stay on the
  // route, round the bay's things); Mops's last corner is `mopsEnd`.
  function walkRoute(route, speed, mopsEnd) {
    const e = E();
    return [
      ...route.map((to, i) =>
        e.until((dt) => {
          e.moWalking(true);
          const m = i ? route[i - 1] : e.pos("mops"),
            a = e.step("mops", m.x, m.y, speed, dt || 0);
          return e.step("sq", to.x, to.y, speed, dt || 0) && a;
        }),
      ),
      e.until((dt) => e.step("mops", mopsEnd.x, mopsEnd.y, speed, dt || 0)),
      e.run(() => e.moWalking(false)),
    ];
  }
  function toBay() {
    const e = E();
    go("tobay");
    const f = { who: "both", night: true, scene: "QB" };
    e.goTo("hall", f, () =>
      e.goTo("passage", f, () => {
        // out through the hallway's right doorway, then in at the bay's left doorway (the older program's walk to the
        // bay cuts across its walkway and plant: this one goes round them)
        e.set("ctrl", false);
        e.queue([
          e.until((dt) => (e.moWalking(true), e.step("mops", HALLWAY.right.x - 30, HALLWAY.right.y, ES_PACE.walk, dt || 0) && e.step("sq", HALLWAY.right.x, HALLWAY.right.y, ES_PACE.walk, dt || 0))),
          e.run(() => {
            e.walkOff();
            e.enterRoom("hangar", "QB");
            e.set("ch1D", true);
            e.set("ch1Night", true);
            e.place("sq", BAY_DOOR.out.x, BAY_DOOR.out.y);
            e.place("mops", BAY_DOOR.out.x - 40, BAY_DOOR.out.y);
            e.set("moPose", "stand");
            // the night robot is at the bin end, looking up at the vent, as they come in along the front (its rounds start
            // when he has control)
            L().robot = { ...freshRobot(), phase: "hold" };
          }),
          ...walkRoute(BAY.walkIn, ES_PACE.walk, BAY.mopsVent),
          e.run(() => (e.face("sq", -1), e.face("mops", 1), go("crawl", { crawl: { dir: "in", k: 0 } }))),
          e.until((dt) => ((L().crawl.k += (dt || 0) / ES_PACE.crawl), L().crawl.k >= 1)),
          e.run(() => {
            e.set("moPose", "hidden");
            L().crawl = null;
            L().robot && L().robot.phase === "hold" && (L().robot.phase = "patrol");
            go("ball");
            e.face("sq", -1);
            control("chip-ball");
          }),
        ]);
      }),
    );
  }
  const freshRobot = () => ({ x: BAY.patrol.x0, y: BAY.patrol.y, f: 1, phase: "patrol", t: 0, seenT: 0, near: 0, route: [] });
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
  const atVent = () => Math.hypot(E().pos("sq").x - BAY.ventStand.x, E().pos("sq").y - BAY.ventStand.y) <= BAY.ventReach;
  // The night robot: its cone, its patrol, and the one capture rule when it sees him (bay-watch.js: its drawn cone on
  // him as he is drawn here, for SIGHT.register seconds, a "?" filling in meanwhile).
  const robotCone = (r) => coneFrom("es-robot", r.x, r.y, r.f > 0 ? lookAt(r.x, r.y, BAY.ventStand) : Math.PI, { half: SIGHT.half, len: SIGHT.len });
  const sqHidden = () => L().pose === "ball" || E().get("sqPose") !== "stand";
  // Rolled up, the ball rule (R43): seen only by a robot that stays within 70 of him, its cone on him, for 2 s.
  function robotSees(r, dt) {
    const e = E(),
      s = e.pos("sq"),
      k = sqScale("hangar");
    if (L().pose === "ball") {
      const B = e.ball || { radius: 70, seconds: 2 };
      r.seenT = 0; // (a count from before he rolled up never carries over)
      r.near = coneOnBody(robotCone(r), s, k) && Math.hypot(s.x - r.x, s.y - r.y) <= B.radius ? r.near + dt : 0;
      r.mark = r.near > 0 ? "?" : "";
      r.markK = r.near / B.seconds;
      return r.near >= B.seconds;
    }
    r.near = 0;
    r.mark = watchTick(r, robotCone(r), s, k, sqHidden(), dt);
    r.markK = (r.seenT || 0) / SIGHT.register;
    return r.mark === "!";
  }
  // Rolls along a route of corners; true at its end.
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
      if (e.get("ctrl") && !e.current() && robotSees(r, dt)) Object.assign(r, { phase: "bang", t: 0, saw: { ...e.pos("sq") } });
      else if (!e.get("ctrl") || e.current()) ((r.seenT = 0), (r.mark = ""));
    } else if (r.phase === "bang") {
      // "!" (robots: DECISIONS sight cones, 2026-11-22), then it rolls off round the plant to pull the FUR alarm
      r.mark = "!";
      r.t >= 0.5 && Object.assign(r, { phase: "run", t: 0, route: BAY.toAlarm.map((q) => ({ ...q })) });
    } else if (r.phase === "run") {
      if (roll(r, ROBOT_SIGHT.run, dt)) {
        // the alarm: a guard comes in (the one capture rule; bay-watch.js), toward where the robot saw him
        Object.assign(r, { phase: "pull", t: 0, mark: "" });
        bridge.alarmSound();
        sfx("bleep");
        l.guard = newGuard(r.saw || e.pos("sq"));
      }
    } else if (r.phase === "pull") {
      // it waits by the alarm until security has gone ("They lost you."), then goes back to its patrol
      !l.guard && r.t > 1 && Object.assign(r, { phase: "back", t: 0, route: [...BAY.toAlarm.slice(0, -1).reverse(), { x: P.x0, y: P.y }].map((q) => ({ ...q })) });
    } else if (r.phase === "back") {
      roll(r, P.speed * 2, dt) && Object.assign(r, { phase: "patrol", t: 0, f: 1, seenT: 0 });
    } else if (r.phase === "dock") {
      // once he is rolled up by the vent, the robot ends its rounds: into the mail room, where it docks and powers down
      roll(r, P.speed * 1.5, dt) && Object.assign(r, { phase: "asleep", t: 0, mark: "" });
    }
  }
  // The guard, every frame while he is out (bay-watch.js guardTick): caught, the LOCKUP card; lost, "They lost you.".
  function guardFrame(l, dt) {
    const e = E(),
      res = guardTick(l.guard, e.pos("sq"), sqScale("hangar"), sqHidden(), dt);
    if (res === "caught") {
      l.guard = null;
      e.catchSquatch(escapeWords("lockup-cause"));
    } else if (res === "lost") {
      l.guard = null;
      e.lostYou(partyLine("note-lost"));
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
      // the first view, held still: where they are, and Squatch's eyes at the grille (Brian 2026-11-26, escape 0:56)
      wait(ES_PACE.ventLook),
      e.until((dt) => (e.moWalking(true), e.step("mops", VENT_ROOM.mops.x, VENT_ROOM.mops.y, ES_PACE.walk, dt || 0))),
      e.run(() => (e.moWalking(false), e.still("mops"), e.face("mops", 1), (L().t0 = 0))),
      wait(ES_PACE.atDesk),
      ...cutawaySteps("eswall"),
      ...cutawaySteps("esletter"),
      e.run(() => (L().glow = "slip")),
      ...sayParts("sq", "sq-notice", "whisper"),
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
      ...sayParts("mops", "mops-mmf"),
      e.run(() => ((L().pose = "stand"), e.set("sqPose", "stand"), e.face("sq", -1))),
      ...sayParts("sq", "sq-get-it", "whisper"),
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
    // back the way they came, round the bay's things (BAY.walkIn backwards), out of the left doorway, and into the
    // hallway at its right doorway
    // (from wherever he grabbed it, round the bay's things to the walk's corner by the vent, then the walk in backwards)
    const back = [...bayPath(e.pos("sq"), BAY.walkIn[3]), ...BAY.walkIn.slice(0, 3).reverse(), BAY_DOOR.out];
    e.queue([
      ...walkRoute(back, ES_PACE.walk, { x: BAY_DOOR.out.x - 30, y: BAY_DOOR.out.y }),
      e.run(() => {
        e.walkOff();
        e.enterRoom("passage", "QB");
        e.place("sq", HALLWAY.right.x, HALLWAY.right.y);
        e.place("mops", HALLWAY.right.x + 30, HALLWAY.right.y - 10);
        e.face("sq", -1);
        e.face("mops", -1);
      }),
      e.until((dt) => (e.moWalking(true), e.step("sq", HALLWAY.sq.x, HALLWAY.sq.y, ES_PACE.walk, dt || 0))),
      // Mops goes along the back to the left, where he looks at the photo wall (he never sees the sheet's front)
      e.until((dt) => e.step("mops", HALLWAY.mops.x, HALLWAY.mops.y, ES_PACE.walk, dt || 0)),
      e.run(() => (e.moWalking(false), e.still("mops"), e.face("mops", -1), e.face("sq", -1), go("slipview"))),
      ...cutawaySteps("esslip"),
      e.run(() => (go("pad", { cu: "pad", typed: "" }), control("chip-code"))),
    ]);
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
        e.run(() => (e.moWalking(false), e.face("mops", 1), go("computer"), control("chip-computer"))),
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
    control("chip-computer");
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
      // out round the desk and the chair (OFFICE.out), Mops from where he stood
      ...[...OFFICE.out, OFFICE.door].map((to) =>
        e.until((dt) => {
          e.moWalking(true);
          const a = e.step("mops", OFFICE.door.x - 40, OFFICE.door.y, ES_PACE.walk, dt || 0);
          return e.step("sq", to.x, to.y, ES_PACE.walk, dt || 0) && a;
        }),
      ),
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
            ...sayParts("mops", "mops-all"),
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
      e.queue([...sayParts("sq", "sq-what-guardians"), ...sayParts("sq", "sq-leave-food"), e.run(() => ((L().snacks.plate = true), go("food"), control("chip-food")))]);
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

  // True on a walk between rooms the player walks himself (the hall's walls and solids are then the escape's).
  const walking = (l) => l.step === "walkhome" || l.step === "sneak";

  // ---------- every frame ----------
  function tick(dt) {
    const l = live(),
      e = E();
    if (!l) {
      // the escape ended (a chapter reset, or beat 53) while the stick drove Mops: it drives Squatch again
      if (driving && e) ((driving = ""), e.playAs("squatch"));
      return;
    }
    dt = dt || 0;
    const free = e.get("ctrl") && !e.current();
    // Mops walking, for his legs (the escape draws him in the rooms it owns)
    const m = e.pos("mops");
    moMoving = !!lastMops && Math.hypot(m.x - lastMops.x, m.y - lastMops.y) > 0.3;
    lastMops = m;
    // the player is Mops, mopping: his head down and his beard on the floor while he walks (44a, 44b)
    l.mopping = free && moMoving && (l.step === "mop" || l.step === "mopoff");
    if (free && l.step === "mop" && mopCalm(l.floor, beardAt(m.x, m.y, m.f), e.time()) >= MOP_CALM.patches.length) robotsIn();
    if (free && l.step === "mopoff") mopoffTick(l, dt);
    if (free && (l.step === "walkhome" || l.step === "sneak")) walkTick(l, dt);
    if (l.robot && e.room() === "hangar" && l.robot.phase !== "asleep") robotTick(l, dt);
    // the guard walks while the player has control (as the older program's security did: it waits for a line)
    if (l.guard && e.room() === "hangar" && free) guardFrame(l, dt);
    // Steering steps him out of a ball (as in the lunch sneak).
    if (free && l.pose === "ball" && l.step === "ball" && e.steering()) {
      l.pose = "stand";
      e.set("sqPose", "stand");
    }
    // rolled up at the vent with nothing after him: the robot ends its rounds and docks in the mail room (it rolls past
    // him, not near enough to notice a ball), then the picture goes inside the vent
    if (l.step === "ball" && free && l.pose === "ball" && atVent() && l.robot && l.robot.phase === "patrol" && !l.guard) {
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
    // Where to walk next, with no button (walking there is the action; the playthrough robot stands there too): the
    // next dirty patch or cell under his beard (44a, 44b), the next doorway on a walk between rooms (44d, 47)
    const m = e.pos("mops"),
      f = m.f || 1,
      walkSpot = (id, who, p, r) => ({ id, who, x: p.x, y: p.y, r });
    if (l.step === "mop") {
      const p = MOP_CALM.patches.find((_, i) => !l.floor.calm[i]);
      if (p) return [walkSpot("es-patch", "mo", { x: p.x - 24 * f, y: p.y }, MOP_CALM.r)];
    }
    if (l.step === "mopoff") {
      const cells = goatCells(),
        c = cells.find((q) => l.floor.dirt[q.id] > 0 && q.id !== l.floor.last) || cells.find((q) => q.id !== l.floor.last);
      return [walkSpot("es-cell", "mo", { x: (c.x0 + c.x1) / 2 - 24 * f, y: (c.y0 + c.y1) / 2 }, 14)];
    }
    const door = walking(l) && doorTo(e.room(), (l.route === "home" ? ROUTE_HOME : ROUTE_VENT)[e.room()]);
    const doorSpot = door ? [walkSpot("es-door", driving === "mops" ? "mo" : "sq", { x: (door.box.x0 + door.box.x1) / 2, y: (door.box.y0 + door.box.y1) / 2 }, 20)] : [];
    // 44d: his own Employee of the Month photo in the hallway, optional, once
    if (l.step === "walkhome" && e.room() === "passage" && !l.plaque) return [...doorSpot, { ...spot("es-plaque", "button-plaque", { x: PLAQUE.x, y: PLAQUE.y, r: PLAQUE.r }, null, lookPlaque), who: "mo" }];
    if (doorSpot.length) return doorSpot;
    if (l.step === "ball" && l.pose === "stand") {
      const s = e.pos("sq"),
        [verb, cap] = escapeWords("button-ball").split(" · ");
      // ROLL · ball by the vent (the goal: its outline, goal-targets.js "hangar:es-ball"); while the robot is after him
      // or a guard is out, wherever he stands (C20), so he can always hide
      if (l.guard || (l.robot && l.robot.phase !== "patrol")) return [{ id: "es-ball-any", verb, cap, who: "sq", hot: true, x: s.x, y: s.y, r: 40, at: [s.x, s.y - 70], f: rollUp }];
      return [{ id: "es-ball", verb, cap, who: "sq", x: BAY.ventStand.x, y: BAY.ventStand.y, r: BAY.ventReach, at: [BAY.ventStand.x, BAY.ventStand.y - 70], thing: BAY.vent, f: rollUp }];
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
      // rolled up: the L2 ball sitting on the floor, its shadow under it (on the floor, in front of the wall)
      if (l.pose === "ball" || e.get("sqPose") === "ball") list.push({ y: s.y, f: () => (ballShadow(ctx, s.x, s.y), e.ball.drawOn(ctx, s.x, s.y - 16, 1)) });
      else list.push({ y: s.y, f: () => (e.drawSquatch(ctx, s.x, s.y, ks, { f: s.f || 1, walk: e.walkPhase() }), pawSlip(ctx, l, s, ks)) });
    }
    list.sort((a, b) => a.y - b.y).forEach((p) => p.f());
  }
  // The box of someone's head as the room draws them (the same as the older program's bubbles use: 60-frame-draw.js
  // speakerHead), for placing a thought above it.
  function headBox(who) {
    const e = E(),
      room = e.room();
    if (who === "mops") {
      const m = e.pos("mops"),
        q = moScale(room),
        hx = m.x + 14 * q * (m.f || 1);
      return { x: hx - 22 * q, y: m.y - 82 * q, w: 44 * q, h: 40 * q };
    }
    const s = e.pos("sq"),
      q = sqScale(room);
    return { x: s.x - 20 * q, y: s.y - 78 * q, w: 40 * q, h: 36 * q };
  }
  // The ball's shadow on the floor (so it sits on the floor, not in the wall behind it).
  function ballShadow(ctx, x, y) {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(x, y + 1, 24, 7, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(20,24,36,.35)";
    ctx.fill();
    ctx.restore();
    shadowAt = { x, y };
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
  // The robots in the bay by day, where each is now (44b, 44c).
  function botsNow(l) {
    const e = E(),
      M = MOPOFF,
      wait = M.robotLanes.map((y, i) => ({ x: M.line - 40 - i * 10, y }));
    if (l.step === "sides") {
      const k = Math.min(1, (e.time() - l.zipAt) / M.zip),
        at = wait.map((w, i) => ({ x: 980 + (w.x - 980) * k + i * 30 * (1 - k), y: w.y }));
      // the first one paints the line down the floor
      k >= 1 && l.paint < 1 && (at[0] = { x: M.line, y: M.floor.y0 + (M.floor.y1 - M.floor.y0) * l.paint });
      return at;
    }
    if (l.step === "mopoff") {
      const at = robotsAt(l.ct),
        w = M.wheels,
        u = l.ct - (w.at - 1);
      // once, one of them rolls its dirty wheels across his clean side and back
      if (u > 0 && u < 3) at[2] = { x: M.line + Math.min(M.goat.x1 - M.line, u * w.speed) - Math.max(0, u - 1.5) * w.speed * 1.2, y: w.y };
      return at;
    }
    if (l.step === "buzzer" || l.step === "star") return robotsAt(M.robotsDone);
    if (l.step === "news") return [...NEWS.bots, wait[2]];
    return [];
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
    // 44a and 44b: the floor he mops (escape-mopoff.js), the robots, the two bars
    if (l.floor && (l.step === "mopin" || l.step === "mop")) {
      out.floor = drawCalmFloor(ctx, l.floor, t);
      const next = MOP_CALM.patches.find((_, i) => !l.floor.calm[i]);
      next && e.get("ctrl") && !e.current() && markPatch(ctx, next, t);
    } else if (l.floor && ["sides", "mopoff", "buzzer", "star", "news"].includes(l.step)) {
      out.floor = drawMopFloor(ctx, l.floor, { ct: l.step === "sides" ? 0 : l.ct, paint: l.paint }, t);
      ["mopoff", "buzzer"].includes(l.step) && (out.bars = drawBars(ctx, bars(l.floor, l.ct)));
    }
    const bots = botsNow(l);
    bots.forEach((b) => e.drawRobot(ctx, b.x, b.y, false, adultPxFor("hangar") / 47));
    out.robots = bots.length;
    // the way home: the doorway's outline (44d)
    l.step === "walkhome" && e.get("ctrl") && markDoor(ctx, doorTo("hangar", ROUTE_HOME.hangar), t);
    // the night robot on patrol, its cone (dashed, yellow while he is in it), and its "!"
    const r = l.robot;
    if (r) {
      const c = robotCone(r),
        s = e.pos("sq"),
        awake = r.phase !== "asleep" && r.phase !== "dock";
      // its cone is yellow exactly when it is on him as he is drawn here (bay-watch.js: the same test as its sight)
      if (awake) {
        const inside = !sqHidden() && coneOnBody(c, s, sqScale("hangar"));
        drawWatchCone(ctx, c, inside);
        e.noteCone({ id: c.id, ox: c.ox, oy: c.oy, a: c.a, half: c.half, len: c.len });
        out.cones = [{ ...c, inside }];
      }
      ctx.save();
      // docked in the mail room it powers down (its light out): drawn dimmer, with no cone
      r.phase === "asleep" && (ctx.globalAlpha = 0.75);
      e.drawRobot(ctx, r.x, r.y, false, adultPxFor("hangar") / 47);
      ctx.restore();
      drawWatchMark(ctx, r.x, r.y - 70, r.mark, r.markK || 0, t);
      out.robot = { x: Math.round(r.x), y: Math.round(r.y), phase: r.phase, mark: r.mark || "" };
    }
    // the slip in Mops's mouth is outlined while he is to grab it (it moves with him, so it is not a goal-targets entry)
    l.step === "grab" && e.get("ctrl") && markBox(ctx, mouthBox(), t);
    // (the vent's outline while he is to roll up by it is the goal outline: goal-targets.js "hangar:es-ball")
    people(ctx, l, "hangar");
    // security, as the party's guard, with his flashlight cone the whole time he is out (bay-watch.js)
    if (l.guard) {
      const gd = drawGuard(ctx, l.guard, e.pos("sq"), sqScale("hangar"), sqHidden(), t);
      out.guard = { x: Math.round(l.guard.x), y: Math.round(l.guard.y), phase: l.guard.phase, mark: l.guard.mark || "", coneInside: gd.inside };
    }
    out.ballShadow = shadowAt;
    shadowAt = null;
    // the star on his GANITOR tag, close (44b)
    if (l.cu === "star") out.star = drawStarCloseup(ctx, l.star, t - l.starAt);
    return out;
  }
  function drawVent(ctx, l) {
    const e = E(),
      t = e.time(),
      m = e.pos("mops");
    drawVentRoom(ctx, t, {});
    e.get("moPose") !== "hidden" && e.drawMopsOn(ctx, m.x, m.y, VENT_ROOM.scale, { f: 1, walk: moMoving ? t * 8 : 0 });
    mopsSlip(ctx, l, m, VENT_ROOM.scale);
    const d = drawVentDesk(ctx, t, { slip: l.slip === "desk" ? "desk" : "", glowSlip: false });
    // night in the vent too, the desk lamp's light kept bright; the sheet's outline over it (the one highlight)
    const night = l.night ? drawNightTint(ctx, NIGHT_LIT.duct) : null;
    l.glow === "slip" && markBox(ctx, { x0: VENT_ROOM.slip.x - 58, y0: VENT_ROOM.slip.y - 60, x1: VENT_ROOM.slip.x + 58, y1: VENT_ROOM.slip.y + 4 }, t);
    return { room: "duct", sheet: d.sheet, glowSlip: l.glow === "slip", mopsBack: (m.f || 1) > 0, night: !!night };
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
    // things in the room (under the night tint, like the room)
    room === "closet" && drawBrochure(ctx, ES_HOME.brochure);
    // the slip in his paw (the older program draws him in these rooms)
    room !== "closet" || l.step !== "bed" ? pawSlip(ctx, l, s, sqScale(room)) : null;
    if (room === "passage" && l.door) drawDoorOpen(ctx);
    // the walks between rooms: the next doorway's outline (44d, 47)
    if ((l.step === "walkhome" || l.step === "sneak") && e.get("ctrl")) {
      const route = l.route === "home" ? ROUTE_HOME : ROUTE_VENT,
        d = doorTo(room, route[room]);
      markDoor(ctx, d, t);
      drew.door = d ? d.to : "";
    }
    // the guest in the hall by day, who waves at Mops (44d)
    if (room === "hall" && l.step === "walkhome") (guests.drawId(ctx, HALL_GUEST.kind, HALL_GUEST.x, HALL_GUEST.y, adultPxFor("hall"), t), (drew.guest = true));
    // the office picture's own drawing has no Mops (12-ch1-redesign.js drawCh1OfficeRoom): the escape draws him there
    if (room === "office" && e.get("moPose") !== "hidden") {
      e.drawMopsOn(ctx, m.x, m.y, moScale("office"), { f: m.f || 1, walk: moMoving ? t * 8 : 0 });
      drew.mops = { x: Math.round(m.x), y: Math.round(m.y) };
    }
    // night: the room's night look (night-look.js; Brian 2026-11-26), its lights kept bright
    if (l.night) drew.night = drawNightTint(ctx, NIGHT_LIT[room] || []);
    // the brochure's outline while Mops talks about it (over the tint: the one highlight stays bright)
    if (room === "closet") {
      l.glow === "brochure" && markBox(ctx, ES_HOME.brochure, t);
      drew.brochure = { glow: l.glow === "brochure" };
    }
    // the thought pictures, above the thinker's head with a clear gap (thought-place.js, through drawThought)
    if (l.think && room === "closet") {
      const who = l.think.who,
        head = headBox(who),
        a = Math.min(1, (t - l.think.at) / 0.3),
        kind = l.think.kind;
      const box = kind === "crate" ? thinkCrateShip(ctx, head, a) : kind === "door" ? thinkLockedDoor(ctx, head, a) : thinkSlipVent(ctx, head, a, t - l.think.at);
      drew.think = { who, kind, box, head };
    }
    // hearts over Mops at the snack counter (he says nothing)
    if (l.heartsAt >= 0 && l.step === "hearts" && room === "hall") drawHearts(ctx, m.x, m.y - 46 * moScale("hall"), t - l.heartsAt);
    // the close-ups over the blurred room
    if (l.cu) {
      blurBehind(ctx);
      if (l.cu === "cal") drew.week = drawWeek(ctx, t - l.calAt, t);
      else if (l.cu === "pad") {
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
    // the player is Mops in 44a to 44d (no card on a jump: he is put straight back where he was)
    if (MOPS_STEPS.includes(step)) {
      e.set("ch1Escape", fresh({ floor: freshFloor(), night: false }));
      e.set("sqPose", "hidden");
      e.place("sq", -400, -400);
      e.set("moPose", "stand");
      e.enterRoom("hangar", "QB");
      e.set("ch1D", true);
      e.set("ch1Night", false);
      driving = "mops";
      e.playAs("mops");
      const l = L();
      if (step === "mop") return (e.place("mops", MOP_CALM.start.x, MOP_CALM.start.y), e.face("mops", 1), go("mop"), control("chip-mop"));
      l.floor.calm = l.floor.calm.map(() => 1);
      if (step === "mopoff") return (e.place("mops", MOPOFF.goat.x1 - 20, 500), e.face("mops", -1), go("mopoff", { ct: 0, taunt: 0, paint: 1 }), control("chip-mopoff"));
      // walkhome: after the contest (a jump does not know his star: the middle one)
      Object.keys(l.floor.dirt).forEach((k) => (l.floor.dirt[k] = 0));
      e.place("mops", NEWS.mops.x, NEWS.mops.y);
      e.face("mops", -1);
      go("walkhome", { route: "home", star: "star-great", ct: MOPOFF.goatTime });
      return control("chip-home");
    }
    driving = "";
    e.playAs("squatch");
    const at = { site: "computer", food: "snacks", box: "closet" }[step] || step;
    const i = ["ball", "grab", "pad", "computer", "snacks", "closet"].indexOf(at);
    if (i < 0) return;
    e.set("ch1Escape", fresh({ slip: i >= 1 ? "paw" : "vent", night: true, star: "star-great" })); // (a jump does not know his star)
    e.set("sqPose", "stand");
    e.set("moPose", "stand");
    e.set("wardrobe", "closed");
    if (at === "ball" || at === "grab") {
      e.enterRoom("hangar", "QB");
      e.set("ch1D", true);
      e.set("ch1Night", true);
      e.place("sq", BAY.ventStand.x, BAY.ventStand.y);
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
      return control("chip-computer");
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
    /** The gold star on Mops's GANITOR tag: from the Mop-Off's star (44b) to the end of the chapter (bridge.js). */
    tagStar() {
      const l = L();
      return !!(l && l.star && !["", "card", "mopin", "mop", "sides", "mopoff", "buzzer"].includes(l.step));
    },
    /** True from "Six days later" until he is in bed and beat 53 starts. */
    active() {
      return !!live();
    },
    /** True while the escape draws the room on screen (the loading bay, the inside of the vent). */
    ownsRoom() {
      const l = live(),
        r = l && E().room();
      // (the office, and the hall on a walk between rooms: only for their walls and solids; the older program draws
      // them: drawRoom says no)
      return r === "hangar" || r === "duct" || r === "office" || (r === "hall" && walking(l));
    },
    /** True while the night robot has seen him and security is out (no music then: bridge.js refineCue). */
    alarmOn() {
      const l = live();
      return !!(l && ((l.robot && ["bang", "run", "pull"].includes(l.robot.phase)) || l.guard));
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
      if (room === "hangar" && who === "robot") {
        const b = botsNow(l)[l.talker || 0];
        if (b) return { x: b.x, y: b.y - 80 };
      }
      if (room === "hall" && who === "tourist") return { x: HALL_GUEST.x, y: HALL_GUEST.y - 150 };
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
      const l = live();
      return l && E().room() === "hall" && walking(l) ? LUNCH_BOUNDS : null;
    },
    /** What feet cannot walk through in the rooms the escape owns: the bay's things (bay-watch.js), the office's. */
    solids() {
      const l = live(),
        r = l && E().room();
      if (r === "hall" && walking(l)) {
        const g = HALL_GUEST,
          guest = l.step === "walkhome" ? [{ x0: g.x - 25, x1: g.x + 25, y0: g.y - 14, y1: g.y + 8, person: 1 }] : [];
        return [...LUNCH_SOLIDS.map((b) => ({ ...b })), ...guest];
      }
      // (by day there is no ship, so no walkway: 44 draws the bay without its ramp)
      if (r === "hangar") return BAY_SOLIDS.filter((b) => b.id !== "walkway" || E().get("ch1Night")).map((b) => ({ ...b }));
      return r === "office" ? OFFICE.solids.map((b) => ({ ...b })) : [];
    },
    /** Tests: the code, the places. */
    place: Object.freeze({ OFFICE_CODE, BAY, HALLWAY, OFFICE, BAR: ES_BAR, HOME: ES_HOME, KEYPAD, SITE, SNACKS, VENT_ROOM, keyAt, MOP_CALM, MOPOFF, PLAQUE, ES_DOORS }),
    /** Tests: the state, what the last frame drew, the steps so far. */
    debug() {
      const l = L();
      return { state: l ? JSON.parse(JSON.stringify(l)) : null, active: !!live(), drew, steps: record.steps.slice(), sounds: record.sounds.slice(), words: escapeDrawnWords() };
    },
  };
}
