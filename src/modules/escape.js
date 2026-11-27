/**
 * The escape, Chapter 1 beats 43 to 52, rebuilt from the story pass of 2026-11-26 (Brian: "Build this pass: yes"; its
 * CHANGED and NEW lines are pending until he says yes as he watches). It follows night one (beat 42: 14-ch1-day2.js
 * ch1SixDays) and hands over to pickup day (beat 53: 14-ch1-day2.js ch1PackStart) with Squatch asleep the night before.
 * Walk by default: every walk between rooms is the player's (escape-doors.js); scripted moves are a few steps only.
 *   43   "Six days later" on the home calendar: six days crossed off, tomorrow DELIVERY (escape-home-art.js); NEXT.
 *   44a  the player is Mops (the switch announced): he mops the bay's cart tracks with his beard; he hums.
 *   44b  the Mop-Off (escape-mopoff.js): ROBOT SIDE and GOAT SIDE; the robots done in 15 seconds, streaky; his side
 *        cell by cell (sticky twice, the corners); their wheels across his clean side once; FAST and SPARKLE; the
 *        buzzer; GOOD, GREAT or STAR GANITOR, and a gold star that stays on his tag (bridge.js drawGanitorTag).
 *   44c  "HQ got the order form." ... "The manager lied to me."
 *   44d  Mops walks home himself (LOOK · plaque, optional; a guest's "Hi, Mops!").
 *   45a  the switch back to Squatch; "Squatch. You were right." in short bubbles; his gulp; SHOW · brochure; Mops touches
 *        his crate's worn letter (the family stamp's scraped first letter): "...Mars."
 *   45b  the crayon plan: LOOK · crate, LOOK · calendar, and the talk add its pictures one at a time.
 *   46   the almost-slip.
 *   47   Squatch walks to the bay himself, Mops behind him; the night robot on its rounds (the one capture rule);
 *        "Goat-sized. You keep watch."; ROLL · ball at the vent.
 *   48   the player is Mops in the vent (escape-vent-art.js; the room is the locked picture vent-room-empty-v1.png): the
 *        tunnel, LIGHT · lamp, LOOK · wall, LOOK · toy bin, LOOK · stubs (ST crossed out for M), WRITE · note one line a
 *        tap, Squatch's eyes at the grille twice, "I hope Mops doesn't notice...", TAKE · pink slip.
 *   49   out in the bay, Squatch again: "Mmf! Mmf mmf!", "You're gumbling again!", GRAB · pink slip, the fold, the plan's
 *        tick.
 *   50   Squatch walks to the office door ("CLOSED. Back at 9."); TYPE · code: the keypad and the folded slip (tap it
 *        bigger); a wrong code buzzes, "Shh! Try again."; the office code (office-code.js) opens it.
 *   51   the office (escape-office-art.js): SPIN · chair, LOOK · mug, OPEN · drawer, LOOK · frame (+50), each optional;
 *        the first try at the computer, "Robot! Duck!" and HIDE · desk; RETURN · empty crate: "ghjk", "Hooves. You do
 *        it.", "Not that one!", "Pickup booked." / "Tomorrow's ship.", TAKE · label, the plan's tick, "We're really
 *        going."
 *   52   Squatch walks to the snack bar; Mops's lines; the snacks into his bag; his last snack cake on the Guardians'
 *        plate ("Their favorite. I think."); he walks home; OPEN · closet, PUT IN · box, "Mops can never see this.",
 *        "Big day tomorrow.", their song; bed; beat 53.
 * Its progress lives in the game-state field ch1Escape, and ch1Step is "es-<step>" at each step the player controls,
 * so the step restart (↺, 20-ch2.js) brings back the step he is on; the steps he does not control go back to the last
 * one he did (RESTART_TO). Words: escape-lines.js; places and times: escape-place.js; the snack's names:
 * snack-name.js. Every drawing and number is a PLACEHOLDER for Brian.
 */
import { personBox } from "./room-model.js";
import { escapeWords } from "./escape-lines.js";
import { OFFICE_CODE, BAY_DAY, BAY_NIGHT, ES_HOME, ES_BAY, ROBOT_SIGHT, VENT_ROOM, VENT_TUNNEL, ES_HALLWAY, KEYPAD, keyAt, OFFICE, SITE, ES_BAR, SNACKS, ES_PACE, WEEK, MOP_CALM, MOPOFF, NEWS, ROUTE_HOME, ROUTE_VENT, ROUTE_OFFICE, ROUTE_BAR, ROUTE_HOME_NIGHT, HALL_GUEST, PLAQUE, FOLLOW, ES_DOORS } from "./escape-place.js";
import { freshFloor, goatCells, beardAt, mopCalm, mopGoat, goatClean, wheelsAcross, starFor, bars, robotsAt, drawCalmFloor, drawMopFloor, drawBars, drawStarCloseup, markPatch } from "./escape-mopoff.js";
import { doorAt, doorTo, markDoor, freshTrail, followStep } from "./escape-doors.js";
import { drawWeek, drawStampTouch, drawPlan, drawGulpSweat } from "./escape-home-art.js";
import { drawClosedSign, drawOfficeThings, drawSpinStars, drawPassingLight } from "./escape-office-art.js";
import { drawTunnel, drawDark, drawDeskThings, drawNotePad, drawEyesInset, drawNoteCloseup, drawFoldCloseup } from "./escape-vent-art.js";
import { LUNCH_SOLIDS, LUNCH_BOUNDS } from "./lunch-sneak-place.js";
import { createGuestArt } from "./guests.js";
import {
  drawPinnedBrochure,
  thinkSlipVent,
  drawOpenVent,
  drawVentRoomPicture,
  drawLampBeam,
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
import { BAY_SOLIDS, SIGHT, bayPath, coneOnBody, watchTick, drawWatchCone, drawWatchMark, newGuard, guardTick, drawGuard } from "./bay-watch.js";
import { splitLine } from "./line-split.js";
import { nightPicture, nightPictureFor, noteNightPicture, isNightNow } from "./night-look.js";
import { partyLine } from "./party-lines.js";
import { adultPxFor } from "./room-sizes.js";
import { sqPawAt } from "./lunch-sneak-art.js";
import { MORNING_THINGS } from "./home-morning-art.js";

export const ESCAPE_ID = "ch1-escape";
// The steps the player controls (ch1Step "es-<step>"), in order. (jump() takes these, and "start".)
export const ESCAPE_STEPS = Object.freeze(["mop", "mopoff", "walkhome", "show", "crate", "cal", "sneak", "ball", "tunnel", "lamp", "wall", "toys", "stubs", "note", "slip", "grab", "tohall", "pad", "computer", "duck", "site", "label", "tobar", "snacks", "food", "gohome", "closet", "box"]);
// The steps where the stick drives Mops (the rest drive Squatch).
const MOPS_STEPS = Object.freeze(["mop", "mopoff", "walkhome"]);
// The steps in the vent, where the player is Mops too (48).
const VENT_STEPS = Object.freeze(["tunnel", "lamp", "wall", "toys", "stubs", "note", "slip"]);
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
  shown: "show",
  plan0: "show",
  crated: "crate",
  caled: "cal",
  slip46: "cal",
  togoat: "sneak",
  crawl: "sneak",
  rolled: "ball",
  inside: "ball",
  lit: "lamp",
  walled: "wall",
  toyed: "toys",
  stubbed: "stubs",
  noted: "note",
  slipped: "slip",
  out: "slip",
  grabbed: "grab",
  open: "pad",
  spin: "computer",
  mugged: "computer",
  drawered: "computer",
  framed: "computer",
  hidden: "duck",
  duckcall: "computer",
  ghjk: "computer",
  notthat: "site",
  booked: "site",
  labeled: "label",
  atbar: "tobar",
  guardians: "snacks",
  favorite: "food",
  hearts: "food",
  arrive: "gohome",
  boxview: "closet",
  bed: "closet",
});

export function createEscape(bridge) {
  const E = () => bridge.engine();
  const pic = (src) => (typeof Image !== "undefined" ? Object.assign(new Image(), { src }) : null);
  const pics = { day: pic(BAY_DAY), night: pic(BAY_NIGHT), vent: pic(VENT_ROOM.picture) };
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
    framePaid = false, // the frame's +50 is paid once an escape (a ↺ does not take stars back, so it must not pay again)
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
    brochure: "wall",
    gulpAt: -1,
    touchAt: -1,
    plan: null,
    planAt: -1,
    vent: "",
    lamp: true,
    eyesAt: -1,
    noteLines: 0,
    foldAt: -1,
    folded: false,
    found: {},
    ducked: false,
    ghjkAt: -1,
    labelAt: -1,
    label: false,
    slipBig: false,
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
    framePaid = false;
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
      ...bayPath(e.pos("mops"), NEWS.mops).map((to) => e.until((dt) => (e.moWalking(true), e.step("mops", to.x, to.y, ES_PACE.walk, dt || 0)))),
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
    // into the bay at night: the night robot on its rounds (47)
    if (d.to === "hangar" && l.step === "sneak" && !l.robot) l.robot = freshRobot();
    sfx("open");
  }
  function walkTick(l, dt) {
    const e = E(),
      who = driving === "mops" ? "mops" : "sq",
      p = e.pos(who),
      room = e.room(),
      route = routeOf(l);
    // Mops behind Squatch, along his trail
    if (who === "sq" && e.get("moPose") !== "hidden" && l.trail) {
      const to = followStep(l.trail, p, e.pos("mops"));
      // (a follower is never solid: standing a step behind him, he would box Squatch in and a tap's walk would find
      // no way round; found recording the walk out of the bay, 2026-11-26)
      e.moWalking(true);
      to ? e.step("mops", to.x, to.y, FOLLOW.speed, dt) : e.still("mops");
    }
    // a guest in the hall by day waves at Mops
    if (l.step === "walkhome" && room === "hall" && !l.waved && Math.hypot(p.x - HALL_GUEST.x, p.y - HALL_GUEST.y) < HALL_GUEST.near) ((l.waved = true), e.ambient("tourist", escapeWords("guest-hi")));
    const d = doorAt(room, p);
    if (!d) return;
    // home: the walk ends there (44d: Mops comes in)
    if (l.step === "walkhome" && d.to === "closet") return arriveHome(d);
    if (l.step === "gohome" && d.to === "closet") return arriveNight(d);
    // only the doors on the way (and back the way he came)
    if (route[room] === d.to || route[d.to] === room) (throughDoor(d), control(WALK_CHIP[l.step]));
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
  // ---------- beat 45a: "You were right" ----------
  // Mops walks in (the player brought him to the door); Squatch is by his crate bed with the brochure, soft from a week
  // of looking. The switch back to Squatch is announced; Mops says it in short bubbles; SHOW · brochure.
  function homeTalk() {
    const e = E();
    e.set("ch1D", false);
    e.set("sqPose", "stand");
    e.place("sq", ES_HOME.sq.x, ES_HOME.sq.y);
    e.face("sq", 1);
    e.set("ch1Brochure", true); // (in his paw: the older program draws it there, 14-ch1-day2.js)
    e.set("moPose", "stand");
    go("home", { mopping: false, night: true, brochure: "paw" });
    e.queue([
      e.until((dt) => (e.moWalking(true), e.step("mops", ES_HOME.mops.x, ES_HOME.mops.y, ES_PACE.mopsIn, dt || 0))),
      e.run(() => (e.moWalking(false), e.still("mops"), e.face("mops", -1))),
      e.run(() =>
        asSquatch("switch-home", () =>
          e.queue([
            ...sayParts("mops", "mops-you-right"),
            ...sayParts("mops", "mops-replacing"),
            ...sayParts("mops", "mops-ship"),
            // a gulp and one sweat drop, no words (he sent that order)
            e.run(() => (L().gulpAt = e.time())),
            e.until(() => e.time() - L().gulpAt >= ES_PACE.gulp),
            ...sayParts("mops", "mops-brochure"),
            e.run(() => (go("show"), control("chip-show"))),
          ]),
        ),
      ),
    ]);
  }
  function showBrochure() {
    const e = E();
    busy();
    e.face("sq", 1);
    go("shown", { brochure: "up", heartsAt: e.time() });
    sfx("pickup");
    e.queue([
      ...sayParts("mops", "mops-pancake-go"),
      // Mops looks at the crate, and touches the worn letter with a hoof (a week ago he would not look)
      e.run(() => (L().heartsAt = -1)),
      e.until((dt) => (e.moWalking(true), e.step("mops", ES_HOME.stamp.x, ES_HOME.stamp.y, ES_PACE.mopsIn, dt || 0))),
      e.run(() => (e.moWalking(false), e.still("mops"), e.face("mops", -1), (L().touchAt = e.time()))),
      e.until(() => e.time() - L().touchAt >= ES_PACE.touch),
      ...sayParts("mops", "mops-mars"),
      e.run(plan),
    ]);
  }

  // ---------- beat 45b: the plan, in crayon ----------
  // Each step of the plan is found by looking at one outlined thing in the room (LOOK · crate, LOOK · calendar), and
  // each adds a crayon picture to the sheet Squatch draws on; the talk gives the other two.
  function plan() {
    const e = E();
    go("plan0", { plan: { has: {}, ticks: {} } });
    e.queue([...sayParts("sq", "sq-how"), ...sayParts("mops", "mops-crate"), e.run(() => (go("crate"), control("chip-crate-look")))]);
  }
  const planShow = (add) => E().run(() => (Object.assign(L().plan.has, add), (L().cu = "plan"), (L().planAt = E().time()), sfx("pickup")));
  function lookCrate() {
    const e = E();
    busy();
    go("crated");
    e.queue([planShow({ crate: true }), e.until(() => e.time() - L().planAt >= 0.4), ...sayParts("sq", "sq-leave"), ...sayParts("mops", "mops-empties"), e.run(() => ((L().cu = ""), go("cal"), control("chip-cal-look")))]);
  }
  function lookCalendar() {
    const e = E();
    busy();
    go("caled");
    e.queue([
      planShow({ ship: true }),
      e.until(() => e.time() - L().planAt >= 0.4),
      ...sayParts("mops", "mops-book"),
      planShow({ computer: true }),
      ...sayParts("mops", "mops-computer"),
      ...sayParts("sq", "sq-office"),
      ...sayParts("sq", "sq-locked"),
      planShow({ door: true }),
      ...sayParts("mops", "mops-code"),
      ...sayParts("mops", "mops-pen"),
      e.run(() => (L().cu = "")),
      e.run(almostSlip),
    ]);
  }

  // ---------- beat 46: the almost-slip ----------
  function almostSlip() {
    const e = E();
    go("slip46");
    e.queue([
      ...sayParts("mops", "mops-ate"),
      ...sayParts("mops", "mops-bin"),
      ...sayParts("sq", "sq-slip"),
      ...sayParts("mops", "mops-hm"),
      // what he remembers comes first, then he says it (the vent is shown before the line names it)
      e.run(() => think("sq", "vent")),
      wait(ES_PACE.think),
      e.run(() => (L().think = null)),
      ...sayParts("sq", "sq-vent"),
      ...sayParts("mops", "mops-big-vent"),
      ...sayParts("mops", "mops-lost"),
      ...sayParts("mops", "mops-know"),
      e.run(() => e.set("ch1Brochure", false)),
      e.run(toBay),
    ]);
  }
  function think(who, kind) {
    Object.assign(L(), { think: { who, kind, at: E().time() }, t0: 0 });
  }

  // ---------- beat 47: to the vent, and the ball ----------
  // The player walks Squatch from home to the bay himself, Mops behind him (47; escape-doors.js); the night robot
  // patrols the bay. At the vent Mops goes in, and Squatch rolls up to keep watch.
  function toBay() {
    const e = E();
    go("sneak", { route: "vent", trail: freshTrail(), night: true });
    e.moWalking(true); // (he follows: never solid, see walkTick)
    e.set("ch1Night", true);
    control("chip-sneak");
  }
  // at the vent: Mops comes over (round the bay's things), "Goat-sized. You keep watch.", and crawls in
  function toVent() {
    const e = E();
    busy();
    e.face("sq", -1);
    go("togoat");
    const way = bayPath(e.pos("mops"), ES_BAY.mopsVent);
    e.queue([
      ...way.map((to) => e.until((dt) => (e.moWalking(true), e.step("mops", to.x, to.y, ES_PACE.walk, dt || 0)))),
      e.run(() => (e.moWalking(false), e.still("mops"), e.face("mops", 1))),
      ...sayParts("mops", "mops-goat-sized"),
      e.run(() => go("crawl", { crawl: { dir: "in", k: 0 } })),
      e.until((dt) => ((L().crawl.k += (dt || 0) / ES_PACE.crawl), L().crawl.k >= 1)),
      e.run(() => {
        e.set("moPose", "hidden");
        L().crawl = null;
        go("ball");
        e.face("sq", -1);
        control("chip-ball");
      }),
    ]);
  }
  const freshRobot = () => ({ x: ES_BAY.patrol.x0, y: ES_BAY.patrol.y, f: 1, phase: "patrol", t: 0, seenT: 0, near: 0, route: [] });
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
  const atVent = () => Math.hypot(E().pos("sq").x - ES_BAY.ventStand.x, E().pos("sq").y - ES_BAY.ventStand.y) <= ES_BAY.ventReach;
  // The night robot: its cone, its patrol, and the one capture rule when it sees him (bay-watch.js: its drawn cone on
  // him as he is drawn here, for SIGHT.register seconds, a "?" filling in meanwhile).
  const robotCone = (r) => coneFrom("es-robot", r.x, r.y, r.f > 0 ? lookAt(r.x, r.y, ES_BAY.ventStand) : Math.PI, { half: SIGHT.half, len: SIGHT.len });
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
      P = ES_BAY.patrol;
    r.t += dt;
    if (r.phase === "patrol") {
      r.x += r.f * P.speed * dt;
      if (r.x > P.x1) ((r.x = P.x1), (r.f = -1));
      if (r.x < P.x0) ((r.x = P.x0), (r.f = 1));
      if (e.get("ctrl") && !e.current() && robotSees(r, dt)) Object.assign(r, { phase: "bang", t: 0, saw: { ...e.pos("sq") } });
      else if (!e.get("ctrl") || e.current()) ((r.seenT = 0), (r.mark = ""));
    } else if (r.phase === "bang") {
      // "!" (robots: DECISIONS sight cones, 2026-11-22), then it rolls off round the bin to pull the FUR alarm
      r.mark = "!";
      r.t >= 0.5 && Object.assign(r, { phase: "run", t: 0, route: ES_BAY.toAlarm.map((q) => ({ ...q })) });
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
      !l.guard && r.t > 1 && Object.assign(r, { phase: "back", t: 0, route: [...ES_BAY.toAlarm.slice(0, -1).reverse(), { x: P.x0, y: P.y }].map((q) => ({ ...q })) });
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
  // ---------- beat 48: Mops's secret desk (the player is Mops) ----------
  // Rolled up at the vent: the picture goes inside; the switch to Mops is announced; he crawls the tunnel himself.
  function inside() {
    const e = E();
    busy();
    go("inside", { slip: "desk", pose: "ball", vent: "tunnel", lamp: false });
    e.enterRoom("duct", "QB");
    e.set("sqPose", "hidden");
    e.place("sq", VENT_ROOM.eyes.x, VENT_ROOM.eyes.y + 40);
    e.set("moPose", "stand");
    e.place("mops", VENT_TUNNEL.finds[0].x - 180, VENT_TUNNEL.y);
    e.face("mops", 1);
    e.queue([e.run(() => asMops("switch-vent", () => (go("tunnel"), control("chip-crawl"))))]);
  }
  // the end of the tunnel: into the dark room
  function roomIn() {
    const e = E();
    busy();
    e.place("mops", VENT_ROOM.mopsIn.x, VENT_ROOM.mopsIn.y);
    e.face("mops", 1);
    go("lamp", { vent: "room" });
    control("chip-lamp");
  }
  // Squatch's eyes at the grille, in their small round picture, for a moment (no words)
  const eyesPop = () => [E().run(() => (L().eyesAt = E().time())), E().until(() => E().time() - L().eyesAt >= ES_PACE.eyes)];
  function lightLamp() {
    const e = E();
    busy();
    go("lit", { lamp: true });
    sfx("key");
    // the room lit, held still a breath before anything can be tapped
    e.queue([wait(ES_PACE.lampHold), ...eyesPop(), e.run(() => (go("wall"), control("chip-wall")))]);
  }
  function lookWall() {
    const e = E();
    busy();
    go("walled");
    e.queue([...cutawaySteps("eswall"), ...cutawaySteps("esletter"), ...sayParts("mops", "mops-asked"), ...sayParts("mops", "mops-cooks"), e.run(() => (go("toys"), control("chip-toys")))]);
  }
  function lookToys() {
    const e = E();
    busy();
    go("toyed");
    e.queue([...cutawaySteps("estoys"), e.run(() => (go("stubs"), control("chip-stubs")))]);
  }
  function lookStubs() {
    const e = E();
    busy();
    go("stubbed");
    e.queue([...cutawaySteps("esstubs"), ...sayParts("mops", "mops-wrong"), ...sayParts("mops", "mops-one-kind"), e.run(() => (go("note", { cu: "", noteLines: 0 }), control("chip-note")))]);
  }
  // WRITE · note: the note close; each tap writes one line, the fourth signs it
  function writeLine() {
    const e = E(),
      l = L();
    if (l.step !== "note" || l.noteLines >= 4) return;
    l.cu = "note";
    l.noteLines++;
    sfx("key");
    if (l.noteLines < 4) return;
    busy();
    go("noted", { cu: "note", noteAt: e.time() });
    e.queue([
      e.until(() => e.time() - L().noteAt >= 0.9),
      e.run(() => (L().cu = "")),
      ...eyesPop(),
      ...sayParts("sq", "sq-notice", "whisper"),
      e.run(() => (go("slip"), control("chip-slip-take"))),
    ]);
  }
  function takeSlip() {
    const e = E();
    busy();
    go("slipped");
    e.queue([
      ...cutawaySteps("esslipdesk"),
      ...sayParts("mops", "mops-slip"),
      ...sayParts("mops", "mops-code-pen"),
      // he takes it in his teeth by the pen corner, and goes back the way he came
      e.run(() => ((L().slip = "mops"), sfx("grab"), e.face("mops", -1))),
      e.until((dt) => (e.moWalking(true), e.step("mops", VENT_ROOM.mopsIn.x, VENT_ROOM.mopsIn.y, ES_PACE.walk, dt || 0))),
      e.run(crawlOut),
    ]);
  }

  // ---------- beat 49: "You're gumbling again!" ----------
  function crawlOut() {
    const e = E();
    e.moWalking(false);
    e.enterRoom("hangar", "QB");
    e.set("ch1D", true);
    e.set("ch1Night", true);
    e.set("sqPose", "ball");
    e.place("sq", ES_BAY.ventStand.x, ES_BAY.ventStand.y);
    e.set("moPose", "stand");
    e.place("mops", ES_BAY.mopsVent.x, ES_BAY.mopsVent.y);
    e.face("mops", -1);
    go("out", { crawl: { dir: "out", k: 0 }, slip: "mops", vent: "" });
    e.queue([
      e.until((dt) => ((L().crawl.k += (dt || 0) / ES_PACE.crawl), L().crawl.k >= 1)),
      e.run(() => ((L().crawl = null), (L().pose = "stand"), e.set("sqPose", "stand"), e.face("sq", -1))),
      e.run(() =>
        asSquatch("switch-out", () =>
          e.queue([...sayParts("mops", "mops-mmf"), ...sayParts("sq", "sq-gumbling"), ...sayParts("sq", "sq-get-it", "whisper"), e.run(() => (go("grab"), control("chip-grab")))]),
        ),
      ),
    ]);
  }
  // GRAB · pink slip: from Mops's mouth, gently; folded so the paw print is inside and the pen corner shows
  function grab() {
    const e = E();
    busy();
    go("grabbed", { grabAt: e.time() });
    sfx("grab");
    e.queue([
      e.until(() => e.time() - L().grabAt >= ES_PACE.grab),
      e.run(() => ((L().slip = "paw"), (L().cu = "fold"), (L().foldAt = e.time()))),
      e.until(() => e.time() - L().foldAt >= ES_PACE.fold),
      e.run(() => ((L().cu = ""), (L().folded = true))),
      ...sayParts("mops", "mops-got-it"),
      ...sayParts("sq", "sq-carry"),
      ...planTick("door"),
      e.run(toHallway),
    ]);
  }
  // The crayon plan pops up for a moment and a crayon tick lands on one picture (no words: it plays by itself).
  function planTick(id) {
    const e = E();
    return [
      e.run(() => {
        const l = L();
        l.plan = l.plan || { has: { crate: true, ship: true, computer: true, door: true }, ticks: {} };
        Object.assign(l.plan.has, { crate: true, ship: true, computer: true, door: true });
        l.plan.ticks[id] = true;
        Object.assign(l, { cu: "plan", planAt: e.time() });
        sfx("pickup");
      }),
      e.until(() => e.time() - L().planAt >= ES_PACE.planPop),
      e.run(() => (L().cu = "")),
    ];
  }
  // ---------- beat 50: the office keypad ----------
  // The player walks Squatch back out of the bay to the office door in the hallway, Mops behind him.
  function toHallway() {
    const e = E();
    go("tohall", { route: "office", trail: freshTrail() });
    e.moWalking(true); // (he follows: never solid, see walkTick)
    control("chip-door");
  }
  // TYPE · code: the keypad, close, with the folded slip beside it (its pen corner showing; a tap makes it bigger)
  function openPad() {
    const e = E();
    e.still("sq");
    e.stopWalk && e.stopWalk();
    e.face("sq", 1);
    e.still("mops");
    e.moWalking(false);
    go("pad", { cu: "pad", typed: "", slipBig: false });
    control("chip-code");
  }
  function press(d) {
    const e = E(),
      l = L();
    if (l.cu !== "pad" || l.okAt >= 0 || (l.buzzAt >= 0 && e.time() - l.buzzAt < KEYPAD.buzz)) return;
    if (OFFICE_CODE[l.typed.length] !== d) {
      // a wrong key: a buzz, the screen flashes red and clears; Mops whispers; try again (nothing worse)
      l.typed += d;
      l.buzzAt = e.time();
      sfx("bzzt");
      e.ambient("mops", escapeWords("mops-shh"), "whisper");
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
          const a = e.step("mops", ES_HALLWAY.doorIn.x - 40, ES_HALLWAY.doorIn.y - 30, ES_PACE.walk, dt || 0);
          return e.step("sq", ES_HALLWAY.doorIn.x, ES_HALLWAY.doorIn.y, ES_PACE.walk, dt || 0) && a;
        }),
        e.run(() => {
          e.moWalking(false);
          e.enterRoom("office", "QB");
          e.set("ch1Night", true);
          e.place("sq", OFFICE.door.x + 20, OFFICE.door.y);
          e.place("mops", OFFICE.door.x - 40, OFFICE.door.y);
          e.face("sq", 1);
          e.set("moPose", "stand");
        }),
        // Mops keeps watch at the door
        e.until((dt) => (e.moWalking(true), e.step("mops", OFFICE.watch.x, OFFICE.watch.y, ES_PACE.walk, dt || 0))),
        e.run(() => (e.moWalking(false), e.face("mops", -1), go("computer", { trail: null }), control("chip-computer"))),
      ]);
    }
  }

  // ---------- beat 51: the manager's office ----------
  // The fun things, each optional and quick (once each).
  function spinChair() {
    const e = E();
    busy();
    L().found.chair = true;
    go("spin", { spinAt: e.time() });
    sfx("hide");
    e.queue([e.until(() => e.time() - L().spinAt >= ES_PACE.spin), e.run(() => (go("computer"), control("chip-computer")))]);
  }
  function lookMug() {
    const e = E();
    busy();
    L().found.mug = true;
    go("mugged");
    e.queue([...cutawaySteps("esmug"), e.run(() => (go("computer"), control("chip-computer")))]);
  }
  function openDrawer() {
    const e = E();
    busy();
    L().found.drawer = true;
    go("drawered");
    sfx("pickup");
    e.queue([...cutawaySteps("esdrawer"), ...sayParts("sq", "sq-no-fizz", "whisper"), ...sayParts("sq", "sq-one-snack"), e.run(() => (go("computer"), control("chip-computer")))]);
  }
  function lookFrame() {
    const e = E();
    busy();
    L().found.frame = true;
    go("framed");
    e.queue([
      ...cutawaySteps("esframe"),
      // a gulp and one sweat drop; he looks at Mops's back in the doorway (a secret: +50)
      e.run(() => ((L().gulpAt = e.time()), e.face("sq", -1), framePaid || ((framePaid = true), e.addStars(50)), sfx("pickup"))),
      e.until(() => e.time() - L().gulpAt >= ES_PACE.gulp),
      e.run(() => (go("computer"), control("chip-computer"))),
    ]);
  }
  // Once, as he heads for the computer, a robot's light comes past the open door: "Robot! Duck!"
  function duckCall() {
    const e = E();
    busy();
    L().ducked = true;
    go("duckcall");
    sfx("bleep");
    e.queue([...sayParts("mops", "mops-duck"), e.run(() => (go("duck"), control("chip-hide-desk")))]);
  }
  function hideDesk() {
    const e = E();
    busy();
    const H = OFFICE.hide;
    e.place("sq", H.under.x, H.under.y);
    e.set("sqPose", "hidden");
    go("hidden", { sweepAt: e.time() });
    sfx("hide");
    e.queue([
      e.until(() => e.time() - L().sweepAt >= OFFICE.sweep),
      e.run(() => (e.set("sqPose", "stand"), e.place("sq", H.at.x, H.at.y), go("computer"), control("chip-computer"))),
    ]);
  }
  // RETURN · empty crate: Mops tries first ("ghjk"), then the player taps the screen
  function openSite() {
    const e = E();
    // the first time: before he can touch it, the robot's light comes by the open door
    if (!L().ducked) return duckCall();
    busy();
    e.face("sq", 1);
    go("ghjk", { cu: "site", ghjkAt: e.time() });
    sfx("bzzt");
    e.queue([e.until(() => e.time() - L().ghjkAt >= ES_PACE.ghjk), ...sayParts("mops", "mops-hooves"), e.run(() => (go("site"), control("chip-computer")))]);
  }
  // "Order new box" is the button the manager presses for Mops each week: Squatch must not see that
  function orderBox() {
    const e = E();
    busy();
    go("notthat");
    e.queue([...sayParts("mops", "mops-not-that"), e.run(() => (go("site"), control("chip-computer")))]);
  }
  function returnCrate() {
    const e = E();
    if (L().bookAt >= 0) return;
    busy();
    go("booked", { cu: "site", bookAt: e.time() });
    sfx("pickup");
    e.queue([
      e.until(() => e.time() - L().bookAt >= SITE.booked),
      e.run(() => ((L().labelAt = e.time()), sfx("key"))),
      e.until(() => e.time() - L().labelAt >= ES_PACE.label),
      e.run(() => (go("label"), control("chip-label"))),
    ]);
  }
  function takeLabel() {
    const e = E();
    busy();
    go("labeled", { cu: "", label: true });
    sfx("grab");
    e.queue([
      ...planTick("computer"),
      e.run(() => (L().heartsAt = e.time())),
      ...sayParts("sq", "sq-going"),
      ...sayParts("mops", "mops-going"),
      e.run(() => (L().heartsAt = -1)),
      e.run(toBar),
    ]);
  }
  // ---------- beat 52: all the snacks, and one secret ----------
  // The player walks Squatch out of the office, through the hallway, to the party hall's snack bar; Mops behind him.
  function toBar() {
    const e = E();
    go("tobar", { route: "bar", trail: freshTrail(), door: true });
    e.moWalking(true); // (he follows: never solid, see walkTick)
    control("chip-bar");
  }
  // behind the counter: Mops breaks his own one-snack rule
  function atBar() {
    const e = E();
    busy();
    e.face("sq", -1);
    go("atbar");
    e.queue([
      e.until((dt) => (e.moWalking(true), e.step("mops", ES_BAR.mops.x, ES_BAR.mops.y, ES_PACE.walk, dt || 0))),
      e.run(() => (e.moWalking(false), e.still("mops"), e.face("mops", 1))),
      ...sayParts("mops", "mops-one"),
      ...sayParts("mops", "mops-long"),
      ...sayParts("mops", "mops-all"),
      e.run(() => (go("snacks", { cu: "snacks" }), control("chip-snacks"))),
    ]);
  }
  function takeSnack(i) {
    const l = L(),
      s = l.snacks;
    if (s.carry || s.gone[i]) return;
    // his last snack cake is kept for the Guardians' plate: the bag takes the others
    const cake = SNACKS.kinds.lastIndexOf("cake");
    if (l.step === "snacks" && i === cake) i = SNACKS.kinds.findIndex((_, j) => j !== cake && !s.gone[j]);
    if (l.step === "food") i = cake;
    if (i < 0 || s.gone[i]) return;
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
    } else if (l.step === "food") {
      // his last snack cake on their plate: "Their favorite. I think."; Mops says nothing, one heart
      busy();
      go("favorite");
      e.queue([...sayParts("sq", "sq-favorite"), e.run(() => go("hearts", { cu: "", heartsAt: e.time() })), e.until(() => e.time() - L().heartsAt >= ES_PACE.hearts), e.run(toHome)]);
    }
  }
  // home: the player walks him there
  function toHome() {
    const e = E();
    go("gohome", { route: "homeN", trail: freshTrail(), heartsAt: -1 });
    e.moWalking(true); // (he follows: never solid, see walkTick)
    control("chip-home-night");
  }
  function arriveNight(d) {
    const e = E();
    throughDoor(d);
    busy();
    go("arrive");
    e.queue([
      // Mops goes over by the TV, his back to the closet
      e.until((dt) => (e.moWalking(true), e.step("mops", ES_HOME.mopsNight.x, ES_HOME.mopsNight.y, ES_PACE.walk, dt || 0))),
      e.run(() => (e.moWalking(false), e.face("mops", 1), go("closet"), control("chip-slip"))),
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
      ...sayParts("sq", "sq-never", "whisper"),
      e.run(() => {
        L().slip = "box";
        e.set("wardrobe", "closed");
        go("bed");
      }),
      ...sayParts("mops", "mops-big-day"),
      // their song, back (it was missing on the night of the fight)
      ...sayParts("sq", "sq-sing"),
      e.run(() => (record.sounds.push("mops-bleat"), bridge.playSoundPick("mops-bleat"))),
      ...sayParts("mops", "mops-sing"),
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
    // beat 53: pickup day (pickup.js)
    const pk = bridge.beat("ch1-pickup");
    pk ? pk.start() : e.chapterEnd();
  }

  // True on a walk between rooms the player walks himself (the hall's walls and solids are then the escape's).
  const routeOf = (l) => ({ home: ROUTE_HOME, office: ROUTE_OFFICE, bar: ROUTE_BAR, homeN: ROUTE_HOME_NIGHT })[l.route] || ROUTE_VENT;
  const walking = (l) => ["walkhome", "sneak", "tohall", "tobar", "gohome"].includes(l.step);
  const WALK_CHIP = Object.freeze({ walkhome: "chip-home", sneak: "chip-sneak", tohall: "chip-door", tobar: "chip-bar", gohome: "chip-home-night" });

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
    if (free && walking(l)) walkTick(l, dt);

    // 47: at the vent, with nothing after him, Mops comes over and goes in
    if (free && l.step === "sneak" && e.room() === "hangar" && l.pose === "stand" && atVent() && l.robot && l.robot.phase === "patrol" && !l.guard) toVent();
    // 52: behind the snack counter
    if (free && l.step === "tobar" && e.room() === "hall" && Math.hypot(e.pos("sq").x - ES_BAR.sq.x, e.pos("sq").y - ES_BAR.sq.y) < ES_BAR.r) atBar();
    // 48: in the room, the toy bin and the grille make a wall on his left (nobody walks over anything)
    if (e.room() === "duct" && l.vent === "room" && m.x < VENT_ROOM.wallX) e.place("mops", VENT_ROOM.wallX, m.y);
    // 48: the end of the tunnel
    if (free && l.step === "tunnel" && m.x >= VENT_TUNNEL.end) roomIn();
    if (l.robot && e.room() === "hangar" && l.robot.phase !== "asleep") robotTick(l, dt);
    // the guard walks while the player has control (as the older program's security did: it waits for a line)
    if (l.guard && e.room() === "hangar" && free) guardFrame(l, dt);
    // Steering steps him out of a ball (as in the lunch sneak).
    if (free && l.pose === "ball" && (l.step === "ball" || l.step === "sneak") && e.steering()) {
      l.pose = "stand";
      e.set("sqPose", "stand");
    }
    // rolled up at the vent with nothing after him: the robot ends its rounds and docks in the mail room (it rolls past
    // him, not near enough to notice a ball), then the picture goes inside the vent
    if (l.step === "ball" && free && l.pose === "ball" && atVent() && l.robot && l.robot.phase === "patrol" && !l.guard) {
      busy();
      go("rolled");
      const r = l.robot;
      Object.assign(r, { phase: "dock", t: 0, route: [{ x: Math.max(r.x, ES_BAY.patrol.x0), y: ES_BAY.patrol.y }, ...ES_BAY.toDock].map((q) => ({ ...q })) });
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
  const noteBox = () => ({ x0: VENT_ROOM.note.x - 46, y0: VENT_ROOM.note.y - 30, x1: VENT_ROOM.note.x + 46, y1: VENT_ROOM.note.y + 6 });
  const slipBox = () => ({ x0: VENT_ROOM.slip.x - 58, y0: VENT_ROOM.slip.y - 60, x1: VENT_ROOM.slip.x + 58, y1: VENT_ROOM.slip.y + 4 });
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
      if (l.step === "label") return hot("es-label", "button-label", takeLabel);
      if (l.step === "note" && l.cu === "note") return [{ ...hot("es-note", "button-note", writeLine)[0], who: "mo", x: e.pos("mops").x, y: e.pos("mops").y }];
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
    // 47: in the bay, the vent is where he is going; 48: the tunnel's far end
    if (l.step === "sneak" && e.room() === "hangar" && l.pose === "stand" && !l.guard && !(l.robot && l.robot.phase !== "patrol")) return [walkSpot("es-vent", "sq", ES_BAY.ventStand, ES_BAY.ventReach - 10)];
    if (l.step === "tunnel") return [walkSpot("es-tunnel", "mo", { x: VENT_TUNNEL.end + 24, y: VENT_TUNNEL.y }, 16)];
    if (l.step === "tobar" && e.room() === "hall") return [{ ...walkSpot("es-bar", "sq", ES_BAR.sq, ES_BAR.r - 6), thing: ES_BAR.aisle }];
    const door = walking(l) && doorTo(e.room(), routeOf(l)[e.room()]);
    const doorSpot = door ? [walkSpot("es-door", driving === "mops" ? "mo" : "sq", { x: (door.box.x0 + door.box.x1) / 2, y: (door.box.y0 + door.box.y1) / 2 }, 20)] : [];
    // 45a, 45b: SHOW · brochure where he stands; LOOK · crate; LOOK · calendar
    if (l.step === "show") {
      const s = e.pos("sq"),
        [verb, cap] = escapeWords("button-show").split(" · ");
      return [{ id: "es-show", verb, cap, who: "sq", hot: true, x: s.x, y: s.y, r: 40, at: [s.x, s.y - 70], f: showBrochure }];
    }
    if (l.step === "crate") return [spot("es-crate", "button-crate", { x: ES_HOME.crateAt.x, y: ES_HOME.crateAt.y, r: 90 }, ES_HOME.crate, lookCrate)];
    if (l.step === "cal") return [spot("es-cal", "button-calendar", { x: ES_HOME.calAt.x, y: ES_HOME.calAt.y, r: 60 }, ES_HOME.calendar, lookCalendar)];
    // 44d: his own Employee of the Month photo in the hallway, optional, once
    if (l.step === "walkhome" && e.room() === "passage" && !l.plaque) return [...doorSpot, { ...spot("es-plaque", "button-plaque", { x: PLAQUE.x, y: PLAQUE.y, r: PLAQUE.r }, null, lookPlaque), who: "mo" }];
    if (doorSpot.length) return doorSpot;
    if (l.step === "sneak" && e.room() === "hangar" && l.pose === "stand" && (l.guard || (l.robot && l.robot.phase !== "patrol"))) {
      const s = e.pos("sq"),
        [verb, cap] = escapeWords("button-ball").split(" · ");
      return [{ id: "es-ball-any", verb, cap, who: "sq", hot: true, x: s.x, y: s.y, r: 40, at: [s.x, s.y - 70], f: rollUp }];
    }
    // 48: the vent's things, one at a time, each where Mops stands to reach it
    const at = VENT_ROOM.at,
      vent = (id, wordsId, x, thing, f) => ({ ...spot(id, wordsId, { x, y: at.y, r: at.r }, thing, f), who: "mo" });
    if (l.step === "lamp") return [vent("es-lamp", "button-lamp", at.lamp, VENT_ROOM.lamp, lightLamp)];
    if (l.step === "wall") return [vent("es-wall", "button-wall", at.wall, VENT_ROOM.wall, lookWall)];
    if (l.step === "toys") return [vent("es-toys", "button-toys", at.toys, VENT_ROOM.toys, lookToys)];
    if (l.step === "stubs") return [vent("es-stubs", "button-stubs", at.stubs, VENT_ROOM.stubs, lookStubs)];
    if (l.step === "note") return [{ ...vent("es-note", "button-note", at.note, noteBox(), writeLine), hot: l.noteLines > 0 }];
    if (l.step === "slip") return [vent("es-slip", "button-slip-take", at.slip, slipBox(), takeSlip)];
    if (l.step === "ball" && l.pose === "stand") {
      const s = e.pos("sq"),
        [verb, cap] = escapeWords("button-ball").split(" · ");
      // ROLL · ball by the vent (the goal: its outline, goal-targets.js "hangar:es-ball"); while the robot is after him
      // or a guard is out, wherever he stands (C20), so he can always hide
      if (l.guard || (l.robot && l.robot.phase !== "patrol")) return [{ id: "es-ball-any", verb, cap, who: "sq", hot: true, x: s.x, y: s.y, r: 40, at: [s.x, s.y - 70], f: rollUp }];
      return [{ id: "es-ball", verb, cap, who: "sq", x: ES_BAY.ventStand.x, y: ES_BAY.ventStand.y, r: ES_BAY.ventReach, at: [ES_BAY.ventStand.x, ES_BAY.ventStand.y - 70], thing: ES_BAY.vent, f: rollUp }];
    }
    if (l.step === "grab" && e.room() === "hangar") {
      const m = e.pos("mops");
      return [spot("es-grab", "button-grab", { x: m.x + 30, y: m.y, r: 90 }, mouthBox(), grab)];
    }
    // 50: TYPE · code at the keypad by the office door
    if (l.step === "tohall" && e.room() === "passage") return [spot("es-pad", "button-code", { x: ES_HALLWAY.sq.x, y: ES_HALLWAY.sq.y, r: 70 }, ES_HALLWAY.keypad, openPad)];
    // 51: the computer (the goal), and the fun things, each once
    if (l.step === "duck" && e.room() === "office") return [spot("es-hide", "button-hide-desk", { x: OFFICE.hide.at.x, y: OFFICE.hide.at.y, r: 70 }, OFFICE.hide.thing, hideDesk)];
    if (l.step === "computer" && e.room() === "office") {
      const O = OFFICE,
        fun = [
          ["chair", "button-chair", spinChair],
          ["mug", "button-mug", lookMug],
          ["drawer", "button-drawer", openDrawer],
          ["frame", "button-frame", lookFrame],
        ]
          .filter(([id]) => !l.found[id])
          .map(([id, w, f]) => ({ ...spot("es-" + id, w, { x: O[id].at.x, y: O[id].at.y, r: O.r }, O[id].thing, f), extra: true }));
      return [spot("es-computer", "button-computer", { x: O.sq.x, y: O.sq.y, r: 90 }, O.monitor, openSite), ...fun];
    }
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
    night && noteNightPicture("hangar"); // (the bay's night look is its locked night picture)
    const out = { room: "hangar", night };
    // the grille swung open while Mops goes in or comes out; him, half in the dark hole
    if (l.crawl) {
      drawOpenVent(ctx, ES_BAY.vent);
      const v = ES_BAY.vent,
        k = l.crawl.dir === "in" ? l.crawl.k : 1 - l.crawl.k,
        km = moScale("hangar"),
        x = ES_BAY.mopsVent.x + (((v.x0 + v.x1) / 2) - ES_BAY.mopsVent.x) * k,
        y = ES_BAY.mopsVent.y + (v.y1 - 8 - ES_BAY.mopsVent.y) * k;
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
    // robots always show their cones (they are not looking for anyone by day)
    bots.forEach((b, i) => {
      const c = coneFrom("es-bot" + i, b.x, b.y, (b.f || -1) > 0 ? 0 : Math.PI, { half: SIGHT.half, len: SIGHT.len * 0.6 });
      drawWatchCone(ctx, c, false);
      e.drawRobot(ctx, b.x, b.y, false, adultPxFor("hangar") / 47);
    });
    out.robots = bots.length;
    // a walk between rooms: the next doorway's outline (44d, 50)
    walking(l) && e.get("ctrl") && markDoor(ctx, doorTo("hangar", routeOf(l).hangar), t);
    // 47: in the bay the vent is where he is going
    l.step === "sneak" && e.get("ctrl") && !e.current() && (out.ventMark = markBox(ctx, ES_BAY.vent, t));
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
    // the star on his GANITOR tag, close (44b); the slip folded in his paw (49); the crayon plan's tick
    if (l.cu === "star") out.star = drawStarCloseup(ctx, l.star, t - l.starAt);
    if (l.cu === "fold") (blurBehind(ctx), (out.fold = drawFoldCloseup(ctx, t - l.foldAt)));
    if (l.cu === "plan") (blurBehind(ctx), (out.plan = { at: drawPlan(ctx, 180, 90, 600, l.plan), has: { ...l.plan.has }, ticks: { ...l.plan.ticks } }));
    return out;
  }
  function drawVent(ctx, l) {
    const e = E(),
      t = e.time(),
      m = e.pos("mops"),
      out = { room: "duct", vent: l.vent || "room" };
    // 48: the tunnel, side view, Mops crawling through it
    if (l.vent === "tunnel") {
      out.tunnel = drawTunnel(ctx, t, m.x);
      e.drawMopsOn(ctx, m.x, m.y, VENT_TUNNEL.scale, { f: m.f || 1, walk: moMoving ? t * 8 : 0, headDown: true });
      return out;
    }
    // the room: its locked picture (the room drawn the same way until the picture has loaded), then what changes on it
    // (at night, after the lamp, the room's night look: night-look.js, the one rule; the people are drawn over it, lit)
    const p = pics.vent && nightPicture("duct", pics.vent, !!l.night && l.lamp !== false);
    p && p.complete && p.naturalWidth ? ctx.drawImage(p, 0, 0, 960, 640) : drawVentRoomPicture(ctx);
    out.night = !!(p && p.nightLook);
    out.picture = !!(p && p.complete && p.naturalWidth);
    drawVentEyes(ctx);
    l.lamp !== false && drawLampBeam(ctx);
    drawDeskThings(ctx);
    (l.step === "note" || l.step === "noted") && drawNotePad(ctx);
    e.get("moPose") !== "hidden" && e.drawMopsOn(ctx, m.x, m.y, VENT_ROOM.scale, { f: m.f || 1, walk: moMoving ? t * 8 : 0 });
    mopsSlip(ctx, l, m, VENT_ROOM.scale);
    const d = drawVentDesk(ctx, t, { slip: l.slip === "desk" ? "desk" : "", glowSlip: false });
    // before the lamp: dark (after it, the room's own night look, drawn with its picture above)
    if (l.lamp === false) drawDark(ctx);
    out.lamp = l.lamp !== false;
    // the one highlight on the next thing (over the dark: it stays bright)
    if (e.get("ctrl") && !e.current() && !l.cu) {
      const sp = spots()[0];
      sp && sp.thing && (out.mark = markBox(ctx, sp.thing, t, 6, e.get("moPose") !== "hidden" ? [personBox("mops", m.x, m.y, VENT_ROOM.scale)] : []));
      out.next = sp ? sp.id : "";
    }
    if (l.eyesAt >= 0 && t - l.eyesAt < ES_PACE.eyes) out.eyes = drawEyesInset(ctx, t - l.eyesAt);
    if (l.cu === "note") (blurBehind(ctx), (out.note = drawNoteCloseup(ctx, l.noteLines, t)));
    return { ...out, sheet: d.sheet, mopsBack: (m.f || 1) > 0 };
  }
  // Squatch's eyes between the grille's slats (he is rolled up outside it), in the room's picture's grille
  function drawVentEyes(ctx) {
    const V = VENT_ROOM;
    ctx.save();
    for (const d of [-14, 14]) {
      ctx.beginPath();
      ctx.ellipse(V.eyes.x + d, V.eyes.y, 9, 11, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(V.eyes.x + d + 2, V.eyes.y + 2, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = "#1e2430";
      ctx.fill();
    }
    ctx.restore();
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
    // home: the brochure on the wall (in his paw from 45a to 46); his crate bed's stamp (the home picture's layer, crate-stamp.js)
    room === "closet" && l.brochure !== "paw" && l.brochure !== "up" && drawPinnedBrochure(ctx, ES_HOME.brochure);
    room === "closet" && (drew.stamp = drawStampTouch(ctx, l.touchAt >= 0));
    // the slip in his paw (the older program draws him in these rooms)
    room !== "closet" || l.step !== "bed" ? pawSlip(ctx, l, s, sqScale(room)) : null;
    if (room === "passage" && l.door) drawDoorOpen(ctx);
    // 50: the sign on the office door; 51: the office's things, his stars after the spin, the passing light, his eyes
    // under the desk
    room === "passage" && !l.door && (drew.sign = drawClosedSign(ctx));
    room === "passage" && l.step === "tohall" && e.get("ctrl") && !e.current() && (drew.mark = markBox(ctx, ES_HALLWAY.keypad, t));
    if (room === "office") {
      drawOfficeThings(ctx);
      l.step === "spin" && drawSpinStars(ctx, headBox("sq"), t - l.spinAt, t);
      // the robot's light at the open door from Mops's warning on; it passes once he is hidden
      (l.step === "duckcall" || l.step === "duck") && (drew.light = drawPassingLight(ctx, 0.04 * Math.sin(t * 3)));
      l.step === "hidden" && ((drew.light = drawPassingLight(ctx, Math.min(1, (t - l.sweepAt) / OFFICE.sweep))), e.drawEyes(ctx, OFFICE.hide.under.x, OFFICE.hide.under.y - 30));
      l.gulpAt >= 0 && t - l.gulpAt < ES_PACE.gulp && (drew.sweat = drawGulpSweat(ctx, headBox("sq"), t - l.gulpAt));
      if (e.get("ctrl") && !e.current() && !l.cu) {
        const sp = spots().filter((q) => q.thing && !q.extra)[0];
        sp && (drew.mark = markBox(ctx, sp.thing, t));
        drew.fun = spots().filter((q) => q.extra).map((q) => q.id);
      }
      l.heartsAt >= 0 && drawHearts(ctx, m.x, m.y - 46 * moScale("office"), t - l.heartsAt);
    }
    // the walks between rooms: the next doorway's outline (44d, 47)
    if (walking(l) && e.get("ctrl")) {
      const route = routeOf(l),
        d = doorTo(room, route[room]);
      markDoor(ctx, d, t);
      drew.door = d ? d.to : "";
    }
    // 52: the counter's aisle is where he is going
    room === "hall" && l.step === "tobar" && e.get("ctrl") && (drew.mark = markBox(ctx, ES_BAR.aisle, t));
    // the guest in the hall by day, who waves at Mops (44d)
    if (room === "hall" && l.step === "walkhome") (guests.drawId(ctx, HALL_GUEST.kind, HALL_GUEST.x, HALL_GUEST.y, adultPxFor("hall"), t), (drew.guest = true));
    // the office picture's own drawing has no Mops (12-ch1-redesign.js drawCh1OfficeRoom): the escape draws him there
    if (room === "office" && e.get("moPose") !== "hidden") {
      e.drawMopsOn(ctx, m.x, m.y, moScale("office"), { f: m.f || 1, walk: moMoving ? t * 8 : 0 });
      drew.mops = { x: Math.round(m.x), y: Math.round(m.y) };
    }
    // night: the room the older program draws has its night look already (night-look.js, from ch1Night: its picture
    // under the tint, its lights kept bright; the people drawn over it stay lit)
    if (l.night) drew.night = isNightNow(e.get);
    // the brochure's outline while Mops talks about it (over the tint: the one highlight stays bright)
    if (room === "closet") {
      l.glow === "brochure" && markBox(ctx, ES_HOME.brochure, t);
      drew.brochure = { glow: l.glow === "brochure" };
    }
    if (room === "closet" && e.get("ctrl") && !e.current()) {
      // the one highlight on the next thing to look at (45a: the brochure in his paw; 45b: the crate, the calendar)
      if (l.step === "show") {
        const p = sqPawAt(s.x, s.y, s.f || 1, sqScale("closet"));
        drew.mark = markBox(ctx, { x0: p.x - 6, y0: p.y - 70, x1: p.x + 30, y1: p.y - 36 }, t);
      }
      l.step === "crate" && (drew.mark = markBox(ctx, ES_HOME.crate, t));
      l.step === "cal" && (drew.mark = markBox(ctx, ES_HOME.calendar, t));
    }
    // 45a: a gulp and one sweat drop (he sent that order); the brochure held up, big; hearts over Mops
    if (room === "closet" && l.gulpAt >= 0 && t - l.gulpAt < ES_PACE.gulp) drew.sweat = drawGulpSweat(ctx, headBox("sq"), t - l.gulpAt);
    if (room === "closet" && l.step === "shown" && l.heartsAt >= 0) {
      drawHearts(ctx, m.x, m.y - 46 * moScale("closet"), t - l.heartsAt);
      t - l.heartsAt < ES_PACE.brochureUp && (drew.brochureUp = drawPinnedBrochure(ctx, ES_HOME.brochureUp, true));
    }
    // the thought pictures, above the thinker's head with a clear gap (thought-place.js, through drawThought)
    if (l.think && room === "closet") {
      const who = l.think.who,
        head = headBox(who),
        a = Math.min(1, (t - l.think.at) / 0.3),
        kind = l.think.kind;
      const box = thinkSlipVent(ctx, head, a, t - l.think.at);
      drew.think = { who, kind, box, head };
    }
    // hearts over Mops at the snack counter (he says nothing)
    if (l.heartsAt >= 0 && l.step === "hearts" && room === "hall") drawHearts(ctx, m.x, m.y - 46 * moScale("hall"), t - l.heartsAt);
    // the close-ups over the blurred room
    if (l.cu) {
      blurBehind(ctx);
      if (l.cu === "cal") drew.week = drawWeek(ctx, t - l.calAt, t);
      else if (l.cu === "plan") drew.plan = { at: drawPlan(ctx, 180, 90, 600, l.plan), has: { ...l.plan.has }, ticks: { ...l.plan.ticks } };
      else if (l.cu === "pad") {
        const buzz = l.buzzAt >= 0 ? Math.max(0, 1 - (t - l.buzzAt) / KEYPAD.buzz) : 0;
        drew.pad = drawKeypad(ctx, { typed: l.typed, buzz, ok: l.okAt >= 0, t, big: !!l.slipBig });
      } else if (l.cu === "site") drew.site = drawSite(ctx, { booked: l.bookAt >= 0 ? t - l.bookAt : -1, t, ghjk: l.ghjkAt >= 0, label: l.labelAt >= 0 ? t - l.labelAt : -1 });
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
    // the Guardian note: a tap anywhere on it writes the next line (48)
    if (l.cu === "note") return (l.step === "note" && writeLine(), true);
    if (l.cu === "pad" && l.step === "pad" && x < KEYPAD.pad.x0) return ((l.slipBig = !l.slipBig), true); // the slip, bigger (or back)
    if (l.cu === "pad" && l.step === "pad") {
      for (const d of ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]) {
        const k = keyAt(d);
        if (Math.hypot(x - k.x, y - k.y) <= KEYPAD.r + 6) return (press(d), true);
      }
      return true;
    }
    if (l.cu === "site" && l.step === "site") {
      const r = SITE.ret,
        o = SITE.order,
        on = (b) => x >= b.x0 && x <= b.x1 && y >= b.y0 && y <= b.y1;
      on(r) ? returnCrate() : on(o) ? orderBox() : E().sfx("bzzt");
      return true;
    }
    if (l.cu === "site" && l.step === "label") return (y > 520 && takeLabel(), true);
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
    // (an unknown step changes nothing: the game keeps its control)
    if (step !== "start" && !ESCAPE_STEPS.includes(step) && !RESTART_TO[step]) return;
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
    // 48: in the vent, the player as Mops (the tunnel, or the room at the thing he is on)
    if (VENT_STEPS.includes(step)) {
      e.set("ch1Escape", fresh({ night: true, star: "star-great", slip: "desk", pose: "ball", vent: step === "tunnel" ? "tunnel" : "room", lamp: step !== "tunnel" && step !== "lamp", plan: { has: { crate: true, ship: true, computer: true, door: true }, ticks: {} } }));
      e.enterRoom("duct", "QB");
      e.set("ch1Night", true);
      e.set("sqPose", "hidden");
      e.place("sq", VENT_ROOM.eyes.x, VENT_ROOM.eyes.y + 40);
      e.set("moPose", "stand");
      driving = "mops";
      e.playAs("mops");
      const x = step === "tunnel" ? VENT_TUNNEL.finds[0].x - 180 : step === "lamp" ? VENT_ROOM.mopsIn.x : VENT_ROOM.at[step] || VENT_ROOM.mopsIn.x;
      e.place("mops", x, step === "tunnel" ? VENT_TUNNEL.y : VENT_ROOM.at.y);
      e.face("mops", 1);
      go(step);
      const chips = { tunnel: "chip-crawl", lamp: "chip-lamp", wall: "chip-wall", toys: "chip-toys", stubs: "chip-stubs", note: "chip-note", slip: "chip-slip-take" };
      return control(chips[step]);
    }
    driving = "";
    e.playAs("squatch");
    // 47: home at night, after the plan, Mops beside him; the walk to the vent is his
    if (step === "sneak") {
      e.set("ch1Escape", fresh({ night: true, star: "star-great", plan: { has: { crate: true, ship: true, computer: true, door: true }, ticks: {} } }));
      e.enterRoom("closet", "QB");
      e.set("ch1Night", true);
      e.set("sqPose", "stand");
      e.set("moPose", "stand");
      e.place("sq", ES_HOME.sq.x, ES_HOME.sq.y);
      e.place("mops", ES_HOME.mops.x, ES_HOME.mops.y);
      e.face("sq", 1);
      return toBay();
    }
    // 45a, 45b: home at night, Mops just in, the brochure in Squatch's paw
    if (step === "show" || step === "crate" || step === "cal") {
      e.set("ch1Escape", fresh({ night: true, star: "star-great", brochure: "paw", plan: { has: {}, ticks: {} } }));
      e.enterRoom("closet", "QB");
      e.set("sqPose", "stand");
      e.set("moPose", "stand");
      e.set("ch1Brochure", true);
      e.place("sq", ES_HOME.sq.x, ES_HOME.sq.y);
      e.face("sq", 1);
      const mo = step === "show" ? ES_HOME.mops : ES_HOME.stamp;
      e.place("mops", mo.x, mo.y);
      e.face("mops", -1);
      step === "cal" && (L().plan.has.crate = true);
      go(step);
      return control(step === "show" ? "chip-show" : step === "crate" ? "chip-crate-look" : "chip-cal-look");
    }
    const at = { site: "computer", duck: "computer", label: "computer", tobar: "computer", food: "snacks", gohome: "snacks", box: "closet" }[step] || step;
    const i = ["ball", "grab", "tohall", "pad", "computer", "snacks", "closet"].indexOf(at);
    if (i < 0) return;
    e.set("ch1Escape", fresh({ slip: i >= 1 ? "paw" : "vent", night: true, star: "star-great" })); // (a jump does not know his star)
    e.set("sqPose", "stand");
    e.set("moPose", "stand");
    e.set("wardrobe", "closed");
    if (at === "ball" || at === "grab") {
      e.enterRoom("hangar", "QB");
      e.set("ch1D", true);
      e.set("ch1Night", true);
      e.place("sq", ES_BAY.ventStand.x, ES_BAY.ventStand.y);
      e.face("sq", -1);
      if (at === "ball") (e.set("moPose", "hidden"), go("ball", { robot: freshRobot() }));
      else (e.place("mops", ES_BAY.mopsVent.x, ES_BAY.mopsVent.y), e.face("mops", -1), go("grab", { slip: "mops", robot: { ...freshRobot(), ...ES_BAY.toDock[ES_BAY.toDock.length - 1], phase: "asleep" } }));
      return control(at === "ball" ? "chip-ball" : "chip-grab");
    }
    if (at === "tohall") {
      e.enterRoom("hangar", "QB");
      e.set("ch1D", true);
      e.set("ch1Night", true);
      e.place("sq", ES_BAY.ventStand.x - 40, ES_BAY.ventStand.y + 10);
      e.place("mops", ES_BAY.mopsVent.x - 30, ES_BAY.mopsVent.y + 10);
      e.face("sq", -1);
      e.face("mops", -1);
      Object.assign(L(), { folded: true, robot: { ...freshRobot(), ...ES_BAY.toDock[ES_BAY.toDock.length - 1], phase: "asleep" } });
      return toHallway();
    }
    if (at === "pad") {
      e.enterRoom("passage", "QB");
      e.place("sq", ES_HALLWAY.sq.x, ES_HALLWAY.sq.y);
      e.place("mops", ES_HALLWAY.mops.x, ES_HALLWAY.mops.y);
      e.face("sq", -1);
      e.face("mops", -1);
      go("pad", { cu: "pad" });
      return control("chip-code");
    }
    if (at === "computer") {
      e.enterRoom("office", "QB");
      e.place("sq", OFFICE.door.x + 20, OFFICE.door.y);
      e.place("mops", OFFICE.watch.x, OFFICE.watch.y);
      e.face("sq", 1);
      e.face("mops", -1);
      go("computer", { door: true });
      // straight to the site (Mops has tried the keys, the robot's light has been by)
      if (step === "site") return (Object.assign(L(), { ducked: true, ghjkAt: e.time() - 5 }), e.place("sq", OFFICE.sq.x, OFFICE.sq.y), go("site", { cu: "site" }), control("chip-computer"));
      // the label taken: out to the snack bar
      if (step === "tobar") return (Object.assign(L(), { ducked: true, label: true }), e.place("sq", OFFICE.sq.x, OFFICE.sq.y), toBar());
      // the robot's light coming by: hide under the desk
      if (step === "duck") return (Object.assign(L(), { ducked: true }), e.place("sq", OFFICE.sq.x, OFFICE.sq.y), go("duck"), control("chip-hide-desk"));
      // the crate booked, the label printed
      if (step === "label") return (Object.assign(L(), { ducked: true, ghjkAt: e.time() - 5, bookAt: e.time() - 5, labelAt: e.time() - 5 }), e.place("sq", OFFICE.sq.x, OFFICE.sq.y), go("label", { cu: "site" }), control("chip-label"));
      return control("chip-computer");
    }
    if (at === "snacks") {
      e.enterRoom("hall", "QB");
      e.place("sq", ES_BAR.sq.x, ES_BAR.sq.y);
      e.place("mops", ES_BAR.mops.x, ES_BAR.mops.y);
      e.face("sq", -1);
      e.face("mops", 1);
      if (step === "food") return (Object.assign(L().snacks, { bag: SNACKS.forBag, plate: true, gone: Object.fromEntries([...Array(SNACKS.forBag).keys()].map((k) => [k, 1])) }), go("food", { cu: "snacks" }), control("chip-food"));
      if (step === "gohome") return (e.place("sq", ES_BAR.top.x, ES_BAR.top.y + 40), e.place("mops", ES_BAR.top.x - 40, ES_BAR.top.y + 40), toHome());
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
      // over the crayon plan (45b): the bubbles go under the sheet, clear of its pictures
      if (room === "closet" && l.cu === "plan" && (who === "sq" || who === "mops")) return { x: who === "sq" ? 330 : 630, y: 640 };
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
    /** Every escape beat comes after he rubbed his crayon out of the crate bed's stamp (39b): none in the stamp. */
    crayonGone() {
      return !!E().get("ch1Escape");
    },
    place: Object.freeze({ OFFICE_CODE, BAY: ES_BAY, ES_BAY, HALLWAY: ES_HALLWAY, ES_HALLWAY, OFFICE, BAR: ES_BAR, HOME: ES_HOME, KEYPAD, SITE, SNACKS, VENT_ROOM, keyAt, MOP_CALM, MOPOFF, PLAQUE, ES_DOORS }),
    /** Tests: the state, what the last frame drew, the steps so far. */
    debug() {
      const l = L();
      return { state: l ? JSON.parse(JSON.stringify(l)) : null, active: !!live(), drew, steps: record.steps.slice(), sounds: record.sounds.slice(), words: escapeDrawnWords() };
    },
  };
}
