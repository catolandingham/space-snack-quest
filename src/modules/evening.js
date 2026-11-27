/**
 * The evening of Day 2, Chapter 1 beats 37 to 42c, rebuilt from the story pass of 2026-11-26 (Brian: "Go! Go as far as
 * you can without me."): the Employee of the Month wall, Jupiter's big red storm, "They said they were Sasquatches",
 * the brochure, home alone (no fizz, the missing letter), the fight, lights out and the idea, and night one's choice.
 * It follows beat 36 (start()) and hands over to beat 43 ("Six days later") as it is today (14-ch1-day2.js
 * ch1SixDays). Every word comes from evening-lines.js, every place and number from evening-place.js, the new drawings
 * from evening-pictures.js and evening-art.js. Steps the player controls are marked *:
 *   walkin   the hallway, wordless: they walk in from the loading bay's end; Mops waits at the hall's end.
 * * wall     LOOK · photos (optional, no outline); the hall's doorway outlined. The gallery (full screen): holding LIFT ·
 *            photo swings the crooked photo 4 up like a flap over his crayon drawing (ME and MOPS, each with an arrow),
 *            his thought. Past photo 5:
 * * dodge    a robot comes in through the hall's doorway with its cone: ROLL · ball (a ball fools a quick look) or back
 *            through the doorway; seen, the one capture rule in the hallway. BEEP BEEP as it passes.
 *   (36b, loading-bay.js: the hall's three cleaning robots; Mops: "Behind the bar. Quick."; HIDE · bar hands over here)
 * * hide     HIDE · bar (only without the bay's 36b: a jump, a test): he rolls up behind the bar.
 *   tostorm, storm   Mops goes to the bar's front; "You missed a corner."; Jupiter's big red storm rolls into the big
 *            window; the PA; the robots stop and roll out; "You are MOPS now."
 *   window   the guests walk in to the window; the family talks (overheard); the kid sees the goat; they come over.
 * * greet    GREET · kid (as Mops): the kid pets him; "Come on. Bedtime."; they turn to go.
 * * ask      TALK · family (as Mops): "What were you saying about Mars Cakes?"; Wookiees; only at their stand; Dad
 *            hands him the brochure (the close-up, read: it waits for a tap); they leave; "You are SQUATCH now.";
 *            Mops passes the brochure down behind the bar (pass): "Take this home." "We'll talk tonight."
 * * gohome   the home doorway outlined.
 * * box, bite, chart, crate   home alone: OPEN · box, BITE · cake, "No fizz.", X · chart (the close-up: two taps draw
 *            the X), HOLD UP · brochure (the close-up: slide it along the crate's worn family stamp; "MARS!").
 * * show, choose   "That evening…", Mops comes home; SHOW · brochure; the fight; ASK · again or STOMP · to bed; he
 *            turns his back (the close-up); "Bed. The floors don't mop themselves."
 * * bed      SLEEP · bed: lights out, no song; Mops's fainting-goat sleep by the bucket; the idea in pictures.
 * * out, nighthall, nightway   night one: past Mops (a bump on the bucket: "Weee...?"), the hall (its floor vent on),
 *            the hallway, the bay.
 * * bin      GRAB · copies: his whisper; the close-up (order): MARK · box, or PUT BACK · bin (the happily-ish ending,
 *            GO BACK · to the form). MARK: his paw print, the yellow tears off.
 * * post     POST · mailbox: loud; "Shhh!"; the night robot hears: the alarm; HIDE · crate by the big wall vent; the vent
 *            takes the pink sheet; "They lost you."; "...The yellow one got mailed." "It's done."
 * * back, backway, backhall, tobed   home past the night robot; SLEEP · bed; then beat 43.
 * Its progress lives in the game-state field ch1Evening, and ch1Step is "ev-<step>" at each step the player
 * controls, so the step restart (↺) brings back the step he is on; ↺ in a step he does not control goes back to the
 * last one he did (restart()).
 */
import { EV_HALLWAY, EV_BAR, STORM, EV_HOME, HOME_ALONE, EV_BAY, BAY_FURNITURE, BAY_EXTRA, BAY_BOUNDS, BAY_SEARCH, BAY_VENT, EVENING_PACE as P, EVENING_LOOK, nightLook, mopsSleepAt, mopsSleepBox, robotLook } from "./evening-place.js";
import { drawJupiterStorm, drawStormGlow, drawCounterBin, drawEveningThought, drawGuardiansBox, drawWeekCake, drawEveningChart, CHART, drawIdeaPicture, drawYearsLater, drawVentCrate, BAY_CRATE } from "./evening-pictures.js";
import { placeThought } from "./thought-place.js";
import { drawFamilyStampAt, drawFatLetters, familyStampOnRoom } from "./crate-stamp.js";
import { FAMILY } from "./snack-name.js";
import { HALLWAY_CRAYON } from "./ganitor.js";
import { drawNightTint, noteNightPicture, nightDrawn, nightPictureFor } from "./night-look.js";
import { VENT } from "./party-vent.js";
import { eveningWords } from "./evening-lines.js";
import { bayWords } from "./loading-bay-lines.js";
import { HALL_SNEAK, BAY_PACE } from "./loading-bay-place.js";
import { drawRobot as drawCleaner, drawStreak } from "./loading-bay-art.js";
import { drawPat } from "./party-free-art.js";
import { BLEAT_HOOK } from "./bedtime-story-sound.js";
import { drawPhoto, drawCrayonDrawing, drawBrochure, drawPapers, drawPawPrint, drawFurArm, drawSleepingMops, drawPlaque, drawCutInBack, drawCloseX, drawArrow, fitDesign, PAPERS, PHOTO_POOL, drawHeartShape } from "./evening-art.js";
import { HALL, HALL_PICTURE } from "./party-hall.js";
import { LUNCH_SOLIDS, LUNCH_BOUNDS, LUNCH_PLACES } from "./lunch-sneak-place.js";
import { drawCrates, sqPawAt } from "./lunch-sneak-art.js";
import { OUTLINE } from "./outline.js";
import { coneFrom, coneSees, coneSeesPoint, drawCones, lookAt, SEEN_TOO_LONG_SECONDS } from "./party-watch.js";
import { startAlarm, tickAlarm, guardCones, addAlarmPlace, ALARM, GUARD_FEET } from "./party-alarm.js";
import { drawHall, drawOrder } from "./party-draw.js";
import { drawPerson, LOOKS, drawMark, drawAlarmFlash, drawVentSwirl, drawTuft } from "./party-art.js";
import { partyLine } from "./party-lines.js";
import { tickQuestions, questions } from "./party-question.js";
import { openFullScreen, closeFullScreen } from "./fullscreen.js";
import { createPartySound } from "./party-sound.js";
import { createHomeMorningSound, HOME_MORNING_SOUND } from "./home-morning-sound.js";
import { createBedtimeSound } from "./bedtime-story-sound.js";
import { drawBedtimeSquatch, drawBedBlanket, BED_POSES, BEDTIME_NIGHT } from "./bedtime-story.js";
import { footfall } from "./footfalls.js";
import { adultPxFor } from "./room-sizes.js";
import { findPath } from "./tap-path.js";

export const EVENING_ID = "ch1-evening";
/** The steps the player controls (ch1Step "ev-<step>"), in order. */
export const EVENING_STEPS = Object.freeze(["wall", "dodge", "past", "hide", "greet", "ask", "gohome", "box", "bite", "chart", "crate", "show", "choose", "bed", "out", "nighthall", "nightway", "bin", "post", "back", "backway", "backhall", "tobed"]);
/** Which room each step is in (the step restart and jump() put him there). */
export const STEP_ROOM = Object.freeze({
  walkin: "passage", wall: "passage", gallery: "passage", dodge: "passage", past: "passage",
  tohall: "hall", tostorm: "hall", storm: "hall", hide: "hall", window: "hall", greet: "hall", pet: "hall", ask: "hall", talk: "hall", read: "hall", leaving: "hall", pass: "hall", gohome: "hall",
  homein: "closet", box: "closet", bite: "closet", chart: "closet", xchart: "closet", crate: "closet", slide: "closet", mars: "closet",
  evening: "closet", show: "closet", fight: "closet", choose: "closet", fightend: "closet", bed: "closet", asleep: "closet", idea: "closet", out: "closet",
  nighthall: "hall", nightway: "passage",
  bin: "hangar", choosing: "hangar", order: "hangar", post: "hangar", posted: "hangar", back: "hangar",
  backway: "passage", backhall: "hall", tobed: "closet", sleep: "closet",
});
/** The debug beats (?beat=evening:37 and ch1JumpBeat): the step each opens at. */
export const BEAT_STEP = Object.freeze({ 37: "wall", 38: "hide", 39: "ask", 40: "show", 41: "bed", 42: "out", 138: "greet", 139: "gohome", 140: "box", 141: "crate", 145: "choose", 142: "bin", 143: "post", 144: "back" });
// The loading bay's alarm place (party-alarm.js): the robot runs to the FUR alarm by the door, guards come in there.
addAlarmPlace("bay", {
  room: "hangar",
  run: EV_BAY.alarmRun,
  guardIn: EV_BAY.guardIn,
  search: BAY_SEARCH,
  around: [...BAY_FURNITURE, ...BAY_EXTRA].map((b) => ({ x0: b.x0 - GUARD_FEET.side, x1: b.x1 + GUARD_FEET.side, y0: b.y0 - GUARD_FEET.down, y1: b.y1 + GUARD_FEET.up })),
  floor: { x0: 20, x1: 920, y0: 310, y1: 600 },
  // a guard sees him only once his drawn cone has been on him a moment (no "this close" circle: Brian 2026-11-26)
  feet: 0,
  register: P.robotSee,
});
const BAY_PICTURE = nightPictureFor("hangar");
const NIGHT_STEPS = ["out", "nighthall", "nightway", "bin", "choosing", "order", "post", "posted", "back", "backway", "backhall", "tobed", "sleep"];

// The hallway's alarm place (beat 37): the robot that saw him rolls back to the hall's doorway and calls security, who
// come in from the hall; the hallway has nowhere to hide (a ball never fools a search), so being seen there is caught.
addAlarmPlace("hallway", {
  room: "passage",
  run: EV_HALLWAY.robotDoorL,
  guardIn: { x: 20, y: 330 },
  search: [{ x: 300, y: 450 }, { x: 600, y: 420 }, { x: 820, y: 500 }, { x: 480, y: 330 }],
  around: [],
  floor: { x0: 40, x1: 920, y0: 270, y1: 590 },
  feet: 0,
  register: P.robotSee,
});

export function createEvening(bridge) {
  const E = () => bridge.engine();
  const hallPic = typeof Image !== "undefined" ? Object.assign(new Image(), { src: HALL_PICTURE }) : null;
  const bayPic = typeof Image !== "undefined" ? Object.assign(new Image(), { src: BAY_PICTURE }) : null;
  const sound = createHomeMorningSound(() => bridge.engine(), bridge.morningSound);
  const psound = createPartySound(() => bridge.engine());
  const bsound = createBedtimeSound(() => bridge.engine());
  const S = () => {
    const e = E();
    return e ? e.get("ch1Evening") : null;
  };
  // (while the bay's 36b plays, "hallsneak", this beat waits: the bay draws the hall and takes the player's steps)
  const live = () => {
    const s = S();
    return s && s.step && s.step !== "done" && s.step !== "hallsneak" ? s : null;
  };
  let ff = {},
    bayDrew = {},
    pads = 0,
    mopsWas = { x: 0, y: 0 },
    drew = null,
    view = null, // the full-screen close-up open now: { kind, at } (the gallery, the brochure, the papers)
    record = { steps: [], cutIns: [] };
  const room = () => E().room();

  // ---------- small helpers ----------
  const go = (step, extra) => {
    Object.assign(S(), { step, t0: 0 }, extra || {});
    record.steps.push(step);
  };
  const chip = (id) => (E().set("ch1Chip", id ? eveningWords(id) : ""), E().chipNow());
  const control = (chipId) => {
    const e = E(),
      s = S();
    e.set("ch1Step", "ev-" + s.step);
    chip(chipId);
    e.set("act", null);
    e.set("ctrl", true);
    e.set("ch1Sneak", NIGHT_STEPS.includes(s.step));
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
  const timer = (secs) => E().until((dt) => ((S().t0 += dt || 0), S().t0 >= secs));
  const resetT = () => E().run(() => (S().t0 = 0));
  const walkTo = (who, x, y, speed) => E().until((dt) => (E().trail(), who === "mops" && E().moWalking(true), E().step(who, x, y, speed, dt || 0)));
  const sqScale = (r = room()) => (r === "hall" ? E().hallSizes().squatch : r === "closet" ? (E().squatchScale && E().squatchScale()) || (adultPxFor("closet") * 0.8) / 45 : (adultPxFor(r) * 0.8) / 45);
  // (at home the room draws Mops at Squatch's own home size, 60-frame-draw.js)
  const mopsScale = (r = room()) => (r === "hall" ? E().hallSizes().squatch * 1.15 : r === "closet" ? sqScale("closet") : ((adultPxFor(r) * 0.8) / 45) * 1.15);
  const fresh = (extra) => ({
    step: "",
    t0: 0,
    pose: "stand",
    hideAt: "",
    gallery: null,
    looked: false,
    galleryDone: false,
    robot: null,
    storm: -1,
    guests: null,
    cleaners: [],
    cornerSaid: false,
    talker: "",
    pat: -1,
    mopsWide: false,
    brochure: "",
    warm: 0,
    dim: 0,
    mopsSleep: null,
    bed: null,
    zzz: -1,
    order: null,
    papers: "",
    yellow: "",
    pink: "",
    suck: -1,
    nightT: 0,
    alarm: null,
    people: {},
    seenBy: "",
    seenT: 0,
    qs: {},
    ballNear: {},
    seed: Math.floor(Math.random() * 1000),
    ...(extra || {}),
  });
  // His pose for the room's drawing: at home in the dark or in bed this file draws him ("lie": the room leaves him out);
  // elsewhere the room (or this file, in the rooms it draws) draws him standing, rolled up or hidden.
  const setPose = (pose) => {
    const s = S();
    s.pose = pose;
    E().set("sqPose", room() === "closet" ? (pose === "stand" && !(s.dim > 0) && !s.bed ? "stand" : "lie") : pose);
  };

  // ---------- beat 37: the hallway ----------
  /**
   * Beat 36's end hands over here. After the loading bay's walk home (loading-bay.js) they are in the hallway already,
   * at its hall end: they go on from where they stand (he steps clear of the hall's doorway, Mops to his place by it).
   * Otherwise (a test, the older program without the bay) they come in from the loading bay's end.
   */
  function start() {
    const e = E(),
      already = e.room() === "passage";
    ff = {};
    e.set("ch1Evening", fresh());
    busy();
    e.set("ch1Sneak", false);
    already || e.enterRoom("passage", "QB");
    e.set("moPose", "stand");
    e.set("sqPose", "stand");
    if (!already) {
      e.place("sq", EV_HALLWAY.in.x, EV_HALLWAY.in.y);
      e.place("mops", EV_HALLWAY.in.x + 30, EV_HALLWAY.in.y - 20);
      e.face("sq", -1);
      e.face("mops", -1);
    }
    const stop = already ? EV_HALLWAY.fromBay : EV_HALLWAY.stop;
    go("walkin");
    e.queue([
      e.until((dt) => {
        e.trail();
        e.moWalking(true);
        const a = e.step("mops", EV_HALLWAY.mops.x, EV_HALLWAY.mops.y, P.mopsWalk, dt || 0);
        return e.step("sq", stop.x, stop.y, P.walk, dt || 0) && a;
      }),
      e.run(() => {
        e.moWalking(false);
        e.still("mops");
        e.face("mops", 1);
        go("wall");
        control("chip-go-on");
      }),
    ]);
  }
  // the gallery's five photos this visit: four from the pool and the crooked one at #4 (R56, R57)
  const photos = (s) => {
    const pool = PHOTO_POOL.slice(),
      out = [];
    let k = s.seed || 0;
    while (out.length < 5 && pool.length) out.push(pool.splice((k = (k * 7 + 3) % 997) % pool.length, 1)[0]);
    return out;
  };
  function lookPhotos() {
    const s = S();
    busy();
    s.gallery = { i: 0, lift: 0, holding: false, lifted: false, thoughtAt: -1, at: E().time() };
    s.looked = true;
    go("gallery");
    sound.effect("grab");
    openView("gallery");
  }
  // Photo 4: holding LIFT · photo (or the photo) swings the frame up on its nail like a flap, about a second; letting go
  // swings it back (story pass beat 37). The first time it is all the way up, his thought.
  function galleryTick(dt) {
    const g = S().gallery;
    if (!g) return;
    const was = g.lift;
    g.lift = Math.max(0, Math.min(1, g.lift + ((g.holding && g.i === 3 ? 1 : -1) * dt) / P.lift));
    if (was < 1 && g.lift >= 1 && !g.lifted) {
      g.lifted = true;
      g.thoughtAt = E().time();
      E().set("ch1Crayon", true);
      sound.effect("pickup");
    }
  }
  function galleryEnd(robot) {
    const s = S();
    closeView();
    s.gallery = null;
    if (!robot) return (go("wall"), control("chip-go-on"));
    // past photo 5: a robot comes in through the hall's doorway (the hall end), on the floor, with its cone; the player
    // has a real second to act: ROLL · ball (a ball fools a quick look), or be seen (the one capture rule)
    s.galleryDone = true;
    s.robot = { x: EV_HALLWAY.robotOut.x, y: EV_HALLWAY.robotOut.y, a: 0, leg: 0, wait: P.robotWait, beeped: false };
    go("dodge");
    control("chip-roll");
  }
  // the hallway robot's way: in through the hall's doorway, along the floor's middle, out through the bay's doorway
  const ROBOT_LEGS = [EV_HALLWAY.robotDoorL, { x: 200, y: EV_HALLWAY.robotLane }, { x: 800, y: EV_HALLWAY.robotLane }, EV_HALLWAY.robotDoorR, EV_HALLWAY.robotIn];
  function moveRobot(x, y, dt) {
    const r = S().robot,
      d = Math.hypot(x - r.x, y - r.y),
      k = Math.min(d, P.robotRoll * dt);
    if (d < 0.5) return true;
    r.a = Math.atan2(y - r.y, x - r.x); // it looks where it rolls
    r.x += ((x - r.x) / d) * k;
    r.y += ((y - r.y) / d) * k;
    return false;
  }
  // Every frame of "dodge": the robot rolls on (it waits a second just outside first); once it is past him, BEEP BEEP;
  // once it is out, the hallway is his again.
  function robotTick(dt) {
    const e = E(),
      s = S(),
      r = s.robot;
    if (!r || s.alarm || e.current()) return;
    if (r.wait > 0) return void (r.wait -= dt);
    const w = ROBOT_LEGS[r.leg];
    if (!w) {
      s.robot = null;
      s.pose === "ball" && setPose("stand");
      go("past");
      return void control("chip-to-hall");
    }
    moveRobot(w.x, w.y, dt) && r.leg++;
    if (!r.beeped && r.x > e.pos("sq").x + 120) ((r.beeped = true), e.queue([e.say("robot", eveningWords("robot-beep"))]));
  }
  function toHall() {
    const e = E();
    busy();
    go("tohall");
    e.walkOff();
    // the party hall's three cleaning robots come next (36b, loading-bay.js startHallSneak), when that beat is there:
    // this beat waits, and the bay's HIDE · bar hands back to the storm (startStorm)
    const bay = bridge.beat("ch1-bay");
    e.queue([
      e.until((dt) => {
        e.trail();
        e.moWalking(true);
        const a = e.step("mops", 8, EV_HALLWAY.left.y - 20, P.mopsWalk, dt || 0);
        return e.step("sq", 8, EV_HALLWAY.left.y, P.walk, dt || 0) && a;
      }),
      ...(bay && bay.startHallSneak ? [e.run(() => (e.moWalking(false), go("hallsneak"), bay.startHallSneak()))] : [
        e.run(() => {
          e.moWalking(false);
          e.enterRoom("hall", "QB");
          e.place("mops", EV_BAR.in.x - 30, EV_BAR.in.y);
          e.place("sq", EV_BAR.in.x, EV_BAR.in.y + 6);
          e.face("sq", -1);
          e.face("mops", -1);
        }),
        walkTo("sq", EV_BAR.sq.x, EV_BAR.sq.y, P.hallWalk),
        e.run(() => (e.moWalking(false), e.still("mops"), offerHide())),
      ]),
    ]);
  }
  // Without the bay's cleaning robots (the older program without the bay, a jump, a test): Mops says where, and HIDE ·
  // bar is his (36b, Brian r5 4:49: they hide behind the bar when they walk in).
  function offerHide() {
    const e = E();
    busy();
    go("tostorm");
    e.queue([e.say("mops", eveningWords("mops-behind-bar")), e.run(() => (go("hide"), control("chip-hide")))]);
  }

  /**
   * Beat 36b's HIDE · bar (the party hall's cleaning robots, loading-bay.js hideBehindBar) hands over here with its
   * robots (`from.robots`: where each is and its grey streak; `from.said`: the corner exchange has been said already).
   * He goes down behind the bar and rolls up; Mops goes to the bar's front; the storm begins (38a).
   */
  function startStorm(from) {
    const e = E(),
      was = S();
    ff = {};
    e.set(
      "ch1Evening",
      fresh({
        galleryDone: true,
        looked: !!(was && was.looked),
        cleaners: ((from && from.robots) || []).map((r) => ({ id: r.id, x: r.x, y: r.y, f: r.f, dir: r.dir, lane: r.lane, streak: (r.streak || []).slice(), route: null, stop: false })),
        cornerSaid: !!(from && from.said),
      }),
    );
    busy();
    e.set("ch1Sneak", false);
    e.room() !== "hall" && e.enterRoom("hall", "QB");
    e.set("moPose", "stand");
    e.set("sqPose", "stand");
    hideBehindBar();
  }
  // each walks its way round the counter, the stools and the crates (tap-path.js; the solids grown by a person's feet,
  // so the feet never touch them)
  const FEET_SOLIDS = LUNCH_SOLIDS.map((b) => ({ x0: b.x0 - 25, x1: b.x1 + 25, y0: b.y0 - 8, y1: b.y1 + 14 }));
  const legs = (who, way, speed) => {
    const e = E();
    let route = null;
    return [
      e.run(() => {
        let at = e.pos(who);
        route = [];
        for (const w of way) (route.push(...(findPath(at, w, LUNCH_BOUNDS, FEET_SOLIDS) || [w])), (at = w));
      }),
      e.until((dt) => {
        e.trail();
        who === "mops" && e.moWalking(true);
        const w = route[0];
        return !w || (e.step(who, w.x, w.y, speed, dt || 0) && (route.shift(), !route.length));
      }),
    ];
  };
  /** HIDE · bar: down into the aisle behind the bar, rolled up; Mops to the bar's front; then the storm (38a). */
  function hideBehindBar() {
    const e = E(),
      s = S();
    busy();
    go("tostorm");
    s.hideAt = "counter";
    // the robot that mops the lane by the bar's front waits clear of Mops's way down to it
    const near = cornerRobot(s);
    near && (near.route = [{ x: STORM.cornerWait.x, y: near.y }]);
    e.queue([
      // into the aisle at its top (round the bar's corner), then down it
      e.until((dt) => e.step("sq", EV_BAR.aisleTop.x, EV_BAR.aisleTop.y, P.hallWalk * 1.3, dt || 0)),
      e.until((dt) => e.step("sq", EV_BAR.hidden.x, EV_BAR.hidden.y, P.hallWalk * 1.3, dt || 0)),
      e.run(() => (setPose("hidden"), sound.effect("hide"), e.still("sq"))),
      ...legs("mops", [...STORM.mopsVia, STORM.mops], P.mopsWalk),
      e.run(() => (e.moWalking(false), e.still("mops"), e.face("mops", -1))),
      // the corner exchange (36b's, the Mop-Off's setup), if a robot has not said it to him already
      ...(near && !s.cornerSaid
        ? [
            e.run(() => ((near.route = [{ x: STORM.cornerAt.x, y: near.y }]), (S().talker = near.id))),
            e.until(() => !near.route),
            e.say("robot", bayWords("robot-move")),
            e.say("mops", bayWords("mops-corner")),
            e.say("robot", bayWords("robot-corners")),
            e.run(() => (S().cornerSaid = true)),
          ]
        : []),
      e.run(() => stormStarts()),
    ]);
  }
  const cornerRobot = (s) => (s.cleaners || []).find((r) => r.lane === STORM.cornerLane) || null;
  // Every frame in the hall while 36b's robots are still there: each mops its lane to and fro (as loading-bay.js
  // hallTick), or rolls along its route (to Mops, or out through the hallway doorway).
  function cleanersTick(dt) {
    const s = S();
    for (const r of s.cleaners || []) {
      if (r.route) {
        const w = r.route[0];
        if (!w) {
          r.route = null;
          r.stop = true;
          continue;
        }
        const d = Math.hypot(w.x - r.x, w.y - r.y),
          k = Math.min(d, BAY_PACE.robot * dt);
        d > 0.5 && ((r.x += ((w.x - r.x) / d) * k), (r.y += ((w.y - r.y) / d) * k));
        Math.abs(w.x - r.x) > Math.abs(w.y - r.y) ? (r.f = w.x > r.x ? 1 : -1) : d > 0.5 && (r.f = w.y > r.y ? 0 : 2);
        d - k < 0.5 && r.route.shift();
        r.moving = true;
        continue;
      }
      r.moving = !r.stop;
      if (r.stop) continue;
      const L = HALL_SNEAK.lanes[r.lane];
      r.y += (L.y - r.y) * Math.min(1, dt * 2);
      r.x += r.dir * BAY_PACE.mop * dt;
      r.f = r.dir;
      if (r.x > L.x1 || r.x < L.x0) ((r.x = Math.max(L.x0, Math.min(L.x1, r.x))), (r.dir = -r.dir), (r.f = r.dir));
      r.streak.push({ x: r.x, y: r.y + 4 });
      r.streak.length > 40 && r.streak.shift();
    }
  }

  // ---------- beat 38a: the big red storm ----------
  // Jupiter rolls into the big window; the PA calls everyone to it; the cleaning robots stop and roll out; the player
  // is Mops at the bar's front; the guests come in to the window.
  function stormStarts() {
    const e = E(),
      s = S();
    go("storm");
    s.storm = 0;
    const way = (a, z) => findPath(a, z, LUNCH_BOUNDS, FEET_SOLIDS) || [z]; // (clear of the crates and stools by a robot's width)
    e.queue([
      timer(1.2),
      e.say("pa", eveningWords("pa-storm"), "pa", true),
      e.say("pa", eveningWords("pa-window"), "pa", true),
      ...((s.cleaners || []).length
        ? [
            e.run(() => (S().talker = (cornerRobot(S()) || S().cleaners[0]).id)),
            e.say("robot", eveningWords("robots-paused")),
            // they roll out through the hallway doorway, round the counter, the stools and the crates (nobody vanishes)
            e.run(() => {
              for (const r of S().cleaners) {
                const up = { x: r.x, y: HALL_SNEAK.out.y + 12 };
                r.stop = false;
                r.route = [...way({ x: r.x, y: r.y }, up), ...way(up, HALL_SNEAK.out), HALL_SNEAK.gone];
              }
            }),
            e.until(() => S().cleaners.every((r) => !r.route)),
            e.run(() => ((S().cleaners = []), (S().talker = ""))),
          ]
        : []),
      // the switch, announced: the player is Mops now (Squatch stays rolled up behind the bar)
      e.run(() => {
        e.playAs("mops", eveningWords("switch-mops"));
        e.queue(windowTalk());
      }),
    ]);
  }
  // The guests come in through the hallway doorway and walk to the window; the family talks there (overheard), the kid
  // sees the goat, and the family comes over to the bar.
  function windowTalk() {
    const e = E();
    return [
      e.run(() => {
        e.face("mops", -1);
        S().guests = ["dad", "mom", "kid", "guest"].map((role, i) => ({ role, id: STORM.ids[role], x: STORM.in.x + i * 46, y: STORM.in.y + i * 4, a: Math.PI, kid: role === "kid", to: "window", wait: 0.6 + i * 0.9 }));
        go("window");
      }),
      e.until(() => guestsAt("window")),
      timer(0.6),
      e.say("kid", eveningWords("kid-red"), "say", true),
      e.say("mom", eveningWords("mom-mars"), "say", true),
      e.say("dad", eveningWords("dad-loved"), "say", true),
      e.say("mom", eveningWords("mom-best"), "say", true),
      e.say("kid", eveningWords("kid-mars-cakes"), "say", true),
      // the kid turns round and sees the goat at the bar
      e.run(() => lookAtMops(["kid"])),
      e.say("kid", eveningWords("kid-goat")),
      e.run(() => lookAtMops(["mom", "dad"])),
      e.say("mom", eveningWords("mom-ganitor")),
      e.say("mom", eveningWords("mom-only-goat")),
      // the family comes over to the bar (the other guest stays at the window)
      e.run(() => S().guests.forEach((g) => g.role !== "guest" && (g.to = "bar"))),
      e.until(() => familyAt("bar")),
      e.run(() => {
        lookAtMops(["dad", "mom", "kid"]);
        go("greet");
        control("chip-greet");
      }),
    ];
  }
  const lookAtMops = (roles) => {
    const m = E().pos("mops");
    for (const g of S().guests || []) roles.includes(g.role) && ((g.a = Math.atan2(m.y - g.y, m.x - g.x)), (g.look = true));
  };
  // Every frame: each guest walks (in along the floor's back strip, to the window or the bar, a few steps away, or
  // out), looking where he walks; standing at the window he looks up at it; at the bar, at Mops.
  function guestsTick(dt) {
    const s = S();
    for (const g of s.guests || []) {
      if (g.wait > 0) {
        g.wait -= dt;
        continue;
      }
      // the way there: in and out along the floor's back strip (under the window and the bench); to the bar along the
      // strip and down the floor left of the stools and the crates (STORM.barVia), never over them
      if (g.wayTo !== g.to) {
        const from = g.wayTo;
        g.wayTo = g.to;
        g.look = false;
        const T = g.to === "window" ? STORM.window[g.role] : g.to === "bar" ? STORM.bar[g.role] : g.to === "pet" ? STORM.pet : g.to === "leave" ? STORM.leave[g.role] : { x: STORM.in.x + 80, y: STORM.in.y };
        g.way =
          g.to === "window"
            ? [{ x: T.x, y: STORM.lane }, T]
            : g.to === "bar" && from === "window"
              ? [{ x: g.x, y: STORM.barLane }, { x: STORM.barVia.x, y: STORM.barLane }, { x: STORM.barVia.x, y: T.y }, T]
              : g.to === "out"
                ? [...(g.y > STORM.lane + 30 ? [{ x: STORM.barVia.x, y: g.y }] : []), { x: g.y > STORM.lane + 30 ? STORM.barVia.x : g.x, y: STORM.lane }, T]
                : [T]; // (a step or two by the bar: straight there)
      }
      const via = g.way[0];
      if (!via) {
        g.moving = false;
        g.look || (g.a = g.to === "window" ? -Math.PI / 2 : g.a);
        continue;
      }
      const d = Math.hypot(via.x - g.x, via.y - g.y),
        k = Math.min(d, STORM.walk * dt);
      g.moving = true;
      if (d > 0.5) {
        g.a = Math.atan2(via.y - g.y, via.x - g.x);
        g.x += ((via.x - g.x) / d) * k;
        g.y += ((via.y - g.y) / d) * k;
      } else g.way.shift();
    }
  }
  const guestThere = (g) => g.wayTo === g.to && !g.moving && g.wait <= 0 && !(g.way || []).length;
  const guestsAt = (where) => (S().guests || []).every((g) => g.to === where && guestThere(g));
  const familyAt = (where) => (S().guests || []).filter((g) => g.role !== "guest").every((g) => g.to === where && guestThere(g));
  const guestBy = (role) => (S().guests || []).find((g) => g.role === role);

  // ---------- beat 38b: pet the goat, and Mops asks about the cakes (Brian r5 5:34 to 6:08; q: 119) ----------
  /** GREET · kid (the player is Mops): the kid steps up and pets him; then the family turns to go. */
  function greetKid() {
    const e = E();
    busy();
    go("pet");
    e.face("mops", -1);
    sound.effect("grab");
    e.queue([
      e.run(() => (guestBy("kid").to = "pet")),
      e.until(() => guestThere(guestBy("kid"))),
      // wordless, about 2 seconds: two soft pats on his head, and his bleat
      e.run(() => (lookAtMops(["kid"]), (S().pat = 0), bridge.playSoundPick && bridge.playSoundPick(BLEAT_HOOK))),
      e.until((dt) => ((S().pat += (dt || 0) / STORM.pat), S().pat >= 1)),
      e.run(() => (S().pat = -1)),
      e.say("mom", eveningWords("mom-bedtime")),
      // they turn to go: a few steps up the floor toward the doorway
      e.run(() => S().guests.forEach((g) => g.role !== "guest" && (g.to = "leave"))),
      e.until(() => familyAt("leave")),
      e.run(() => {
        go("ask");
        control("chip-ask");
      }),
    ]);
  }
  /** TALK · family (the player is Mops): what were they saying about Mars Cakes? Dad hands him a brochure. */
  function askFamily() {
    const e = E();
    busy();
    go("talk");
    e.face("mops", -1);
    e.queue([
      e.say("mops", eveningWords("mops-what")),
      // they turn back and come to the bar again
      e.run(() => S().guests.forEach((g) => g.role !== "guest" && (g.to = "bar"))),
      e.until(() => familyAt("bar")),
      e.run(() => lookAtMops(["dad", "mom", "kid"])),
      e.say("dad", eveningWords("dad-best-had")),
      e.say("kid", eveningWords("kid-fizzy")),
      // at "fizzy" he stops dead, his eyes wide (no words)
      e.run(() => ((S().mopsWide = true), (S().t0 = 0), sound.effect("slip"))),
      timer(P.stare),
      e.run(() => (S().mopsWide = false)),
      e.say("dad", eveningWords("dad-wookiees")),
      e.say("dad", eveningWords("dad-only-stand")),
      // Dad holds the brochure up, its picture toward the player, then hands it to Mops
      e.run(() => ((S().brochure = "up"), (S().t0 = 0), sound.effect("grab"))),
      timer(STORM.holdUp),
      e.say("dad", eveningWords("dad-brochure")),
      // the brochure, close: it waits for a tap
      e.run(() => {
        S().brochure = "mops";
        sound.effect("pickup");
        go("read");
        openView("brochure");
      }),
      e.until(() => !view),
      e.run(() => go("leaving")),
      // they all leave the way they came, through the hallway doorway
      e.run(() => S().guests.forEach((g) => ((g.to = "out"), (g.wait = STORM.outWait[g.role])))),
      e.until(() => S().guests.every((g) => g.x > 960)),
      // the switch back, announced; then Mops passes the brochure down behind the bar
      e.run(() => {
        S().guests = null;
        e.playAs("squatch", eveningWords("switch-squatch"));
        e.queue(passDown());
      }),
    ]);
  }
  // ---------- beat 39: Mops passes the brochure down ----------
  function passDown() {
    const e = E();
    return [
      e.run(() => {
        go("pass");
        // he stands up behind the bar; Mops turns to him
        setPose("stand");
        e.place("sq", STORM.grab.x, STORM.grab.y);
        e.face("sq", -1);
        e.face("mops", 1);
        sound.effect("slip");
      }),
      e.say("mops", eveningWords("mops-take-home")),
      // over the bar, from Mops to his paw
      e.run(() => ((S().brochure = "toss"), (S().t0 = 0), sound.effect("slip"))),
      timer(STORM.toss),
      e.run(() => ((S().brochure = "paw"), e.set("ch1Brochure", true), sound.effect("grab"))),
      e.say("mops", eveningWords("mops-tonight")),
      // Mops goes back to work: up past the bar's top end and out through the hallway doorway
      walkTo("mops", STORM.mopsVia[1].x, STORM.mopsVia[1].y, P.mopsWalk),
      walkTo("mops", STORM.mopsVia[0].x, STORM.mopsVia[0].y, P.mopsWalk),
      walkTo("mops", EV_BAR.in.x - 30, EV_BAR.in.y + 20, P.mopsWalk),
      walkTo("mops", 1000, EV_BAR.in.y, P.mopsWalk),
      e.run(() => {
        e.moWalking(false);
        e.set("moPose", "hidden");
        e.place("mops", -400, 0);
        go("gohome");
        control("chip-home");
      }),
    ];
  }

  // ---------- beat 39b: home alone (no fizz, and the missing letter) ----------
  function toHome(next) {
    const e = E();
    busy();
    e.walkOff();
    e.queue([
      e.until((dt) => (e.trail(), e.step("sq", EV_BAR.home.x, 640, P.hallWalk, dt || 0))),
      e.run(() => {
        e.enterRoom("closet", "QB");
        e.place("sq", EV_HOME.in.x, EV_HOME.in.y);
        e.face("sq", -1);
        next();
      }),
    ]);
  }
  // Late afternoon, before Mops is back: the Guardians' box (this week's kind), the bite, the chart, the crate.
  function homeAlone() {
    const e = E(),
      s = S();
    go("homein");
    e.set("moPose", "hidden");
    e.place("mops", -400, 0);
    s.warm = 0.4;
    s.box = "paw";
    e.queue([
      walkTo("sq", EV_HOME.stop.x, EV_HOME.stop.y, P.walk),
      e.run(() => {
        e.face("sq", -1);
        go("box");
        control("chip-box");
      }),
    ]);
  }
  /** OPEN · box: the Guardians' little box opens; this week's kind is inside. */
  function openBox() {
    const e = E(),
      s = S();
    busy();
    s.box = "open";
    s.t0 = 0;
    sound.effect("grab");
    e.queue([
      e.until((dt) => ((S().t0 += dt || 0), S().t0 >= P.boxOpen)),
      e.run(() => {
        S().cake = 0;
        go("bite");
        control("chip-bite");
      }),
    ]);
  }
  /** BITE · cake: a crunch, then silence: a small "..." where a fizz would be. "No fizz." */
  function biteCake() {
    const e = E(),
      s = S();
    busy();
    s.cake = 1;
    s.t0 = 0;
    sound.effect("key");
    e.queue([
      e.until((dt) => ((S().t0 += dt || 0), S().t0 >= P.silence)),
      e.say("sq", eveningWords("sq-no-fizz")),
      e.run(() => {
        S().cake = -1;
        S().box = "floor";
        go("chart");
        control("chip-chart");
      }),
    ]);
  }
  /** X · chart: the chart close-up; the player draws this week's X himself (two strokes). */
  function lookChart() {
    const s = S();
    busy();
    s.xMark = 0;
    s.xStroke = 0;
    sound.effect("grab");
    go("xchart");
    openView("chart");
  }
  function chartTick(dt) {
    const s = S();
    // each tap on the cake draws one stroke of the X (0 to 0.5, then 0.5 to 1)
    const want = s.xStroke * 0.5;
    if (s.xMark < want) s.xMark = Math.min(want, s.xMark + dt / P.xStroke);
    if (s.xMark >= 1 && view && view.kind === "chart") {
      s.xDone = (s.xDone || 0) + dt;
      if (s.xDone >= 0.8) {
        closeView();
        s.xDone = 0;
        s.chartX = true;
        go("crate");
        control("chip-crate");
      }
    }
  }
  /** HOLD UP · brochure at the crate: the close-up; sliding the brochure along the stamp lines the letters up. */
  function holdUpBrochure() {
    const s = S();
    busy();
    s.slide = 0;
    s.click = 0;
    s.rub = 0;
    sound.effect("grab");
    go("slide");
    openView("crate");
  }
  function slideTick(dt) {
    const s = S();
    if (!view || view.kind !== "crate") return;
    if (s.slide >= 1 && s.click < 1) {
      s.click = Math.min(1, s.click + dt / 0.35);
      s.click >= 1 && sound.effect("key");
    }
    // he licks his thumb and rubs out his crayon "ST"
    if (s.click >= 1 && s.rub < 1) s.rub = Math.min(1, s.rub + dt / P.rub);
    if (s.rub >= 1) {
      s.rubDone = (s.rubDone || 0) + dt;
      if (s.rubDone >= 0.6) {
        const e = E();
        closeView();
        s.rubDone = 0;
        s.stampST = 0;
        go("mars");
        e.queue([
          e.say("sq", eveningWords("sq-not-stars")),
          e.say("sq", eveningWords("sq-mars-crate")),
          e.run(() => fightStarts()),
        ]);
      }
    }
  }

  // ---------- beat 40: the fight ----------
  function fightStarts() {
    const e = E(),
      s = S();
    go("evening");
    e.queue([
      e.card("later", eveningWords("card-evening")),
      // the room warms to evening; Mops comes home through the doorway, his hearts floating as he sees him
      e.until((dt) => ((S().warm = Math.min(1, S().warm + (dt || 0) / P.evening)), S().warm >= 1)),
      e.run(() => (e.set("moPose", "stand"), e.place("mops", EV_HOME.mopsIn.x, EV_HOME.mopsIn.y), e.face("mops", -1), sound.morning("door"), (S().hearts = 1))),
      walkTo("mops", EV_HOME.mops.x, EV_HOME.mops.y, P.mopsWalk),
      e.run(() => {
        e.moWalking(false);
        e.still("mops");
        e.face("mops", -1);
        e.face("sq", 1);
        go("show");
        control("chip-show");
      }),
    ]);
  }
  function showBrochure() {
    const e = E();
    busy();
    e.face("sq", 1);
    go("fight");
    S().brochure = "up";
    S().t0 = 0;
    sound.effect("grab");
    e.queue([
      timer(P.hold),
      e.say("sq", eveningWords("sq-crate-mars")),
      e.say("mops", eveningWords("mops-stars")),
      e.say("sq", eveningWords("sq-can-we")),
      e.say("mops", eveningWords("mops-no-others")),
      e.say("mops", eveningWords("mops-one-kind")),
      e.say("mops", eveningWords("mops-know")),
      e.say("sq", eveningWords("sq-man-said")),
      e.say("sq", eveningWords("sq-like-me-2")),
      e.say("mops", eveningWords("mops-manager")),
      e.say("mops", eveningWords("mops-need-me")),
      e.say("sq", eveningWords("sq-replace")),
      e.say("mops", eveningWords("mops-wont")),
      e.say("mops", eveningWords("mops-safe")),
      e.say("sq", eveningWords("sq-hide-here")),
      e.say("mops", eveningWords("mops-guardians")),
      // the player picks: ASK · again (where he stands), or STOMP · to bed (at the bed); both reach the same lines
      e.run(() => {
        S().brochure = "home";
        go("choose");
        control("");
      }),
    ]);
  }
  function fightEnds(stomped) {
    const e = E(),
      s = S();
    busy();
    go("fightend");
    e.face("sq", 1);
    stomped && sound.effect("hide");
    e.queue([
      ...(stomped ? [e.say("mops", eveningWords("mops-wait"))] : []),
      e.say("sq", eveningWords("sq-why")),
      // he stops. He turns his back. No hearts. (the close-up: his turned back, Squatch small behind him)
      e.say("mops", eveningWords("mops-already")),
      e.run(() => {
        S().hearts = 0;
        S().turned = true;
        e.face("mops", 1);
        openView("back");
      }),
      e.until(() => !view),
      e.say("mops", eveningWords("mops-family")),
      e.say("sq", eveningWords("sq-real")),
      e.say("sq", eveningWords("sq-didnt")),
      // one small heart comes back
      e.run(() => (S().hearts = 0.4)),
      e.say("mops", eveningWords("mops-we-say")),
      e.say("mops", eveningWords("mops-bed")),
      // he walks to bed himself, past Mops's turned back
      e.run(() => {
        go("bed");
        control("chip-bed");
      }),
    ]);
    s.brochure = "home";
  }

  // ---------- beat 41: lights out ----------
  /** SLEEP · bed: he climbs in and lies down. `then` (the first night): the light goes down and Mops falls asleep. */
  function toBed(first) {
    const e = E(),
      s = S();
    busy();
    go(first ? "asleep" : "sleep");
    first || e.set("ch1Sneak", false);
    const from = e.pos("sq");
    s.bed = { x: from.x, y: from.y, a: 0, eyes: "", feet: true, yawn: 0, arms: [{ a: -0.35 }, { a: 0.35 }], cover: 0 };
    setPose("lie");
    e.set("sqPose", "lie");
    const sit = BED_POSES.sit,
      lie = BED_POSES.lie;
    const part = (secs, f) => e.until((dt) => ((S().t0 += dt || 0), f(Math.min(1, S().t0 / secs)), S().t0 >= secs));
    const steps = [
      resetT(),
      part(P.hop, (k) => {
        const b = S().bed;
        b.x = from.x + (sit.x - from.x) * k;
        b.y = from.y + (sit.y - from.y) * k - Math.sin(k * Math.PI) * 34;
      }),
      resetT(),
      part(P.lie, (k) => {
        const b = S().bed,
          q = k * k * (3 - 2 * k);
        b.x = sit.x + (lie.x - sit.x) * q;
        b.y = sit.y + (lie.y - sit.y) * q;
        b.a = lie.a * q;
        b.feet = false;
        b.cover = q;
        k > 0.7 && (b.eyes = "closed");
      }),
    ];
    if (first)
      steps.push(
        resetT(),
        // the light goes down while Mops walks to his place on the floor
        e.run(() => e.set("moPose", "stand")),
        e.until((dt) => {
          const s = S();
          s.t0 += dt || 0;
          s.dim = Math.min(1, s.t0 / P.lights);
          e.moWalking(true);
          // (round the bucket: along above it first, then down to his place)
          s.mopsLeg = s.mopsLeg || 0;
          const w = [EV_HOME.sleepVia, mopsSleepAt(mopsScale("closet"))][s.mopsLeg];
          w && e.step("mops", w.x, w.y, P.mopsWalk * 0.8, dt || 0) && s.mopsLeg++;
          return s.mopsLeg >= 2 && s.t0 >= P.lights;
        }),
        e.run(() => {
          e.moWalking(false);
          e.still("mops");
          e.set("moPose", "hidden");
          S().mopsSleep = { tip: 0, roll: 0, eyes: 0 };
        }),
        resetT(),
        // he dozes off standing
        part(P.doze, (k) => (S().mopsSleep.eyes = k)),
        resetT(),
        // stiff, he tips over sideways like a fainting goat
        part(P.tip, (k) => {
          const q = Math.min(1, k * (P.tip / P.tipFall));
          S().mopsSleep.tip = q * q;
          k * P.tip >= P.tipFall && !S().mopsSleep.thud && ((S().mopsSleep.thud = 1), sound.effect("hide"));
        }),
        resetT(),
        // and rolls onto his back, four feet in the air
        part(P.roll, (k) => (S().mopsSleep.roll = k * k * (3 - 2 * k))),
        ...Array.from({ length: P.snores }, () => [resetT(), e.run(() => ((S().zzz = 0), bsound.snore())), part(P.snore, (k) => (S().zzz = k))]).flat(),
        // his eyes open in the dark; the idea, in pictures above his head (wordless, about 4 seconds), then in his words
        e.run(() => {
          S().zzz = -1;
          S().bed.eyes = "";
          go("idea");
        }),
        timer(0.6),
        ...["mopping", "robots", "ship"].flatMap((id) => [resetT(), e.run(() => (S().idea = { id, at: E().time() })), timer(P.idea)]),
        e.run(() => (S().idea = null)),
        e.say("sq", eveningWords("sq-floors"), "whisper"),
        e.say("sq", eveningWords("sq-robots-do"), "whisper"),
        resetT(),
        e.run(() => (S().idea = { id: "form", at: E().time() })),
        timer(P.idea),
        e.say("sq", eveningWords("sq-the-form"), "whisper"),
        // night one: Mops snores on, and Squatch, still in bed, is the kid's to move: the doorway is outlined, and
        // his first step (getUp) gets him out of bed
        e.run(() => {
          S().idea = null;
          go("out");
          control("chip-out");
        }),
      );
    else
      steps.push(
        resetT(),
        e.run(() => (S().zzz = 0)),
        part(P.sleepEnd, (k) => (S().zzz = k)),
        e.run(() => handOff()),
      );
    e.queue(steps);
  }

  /** Night one: the kid's first move gets him out of bed (he sits up and slips out beside it), then he is his to walk. */
  function getUp() {
    const e = E(),
      sit = BED_POSES.sit,
      lie = BED_POSES.lie;
    busy();
    S().t0 = 0;
    e.queue([
      e.until((dt) => {
        const s = S(),
          b = s.bed;
        s.t0 += dt || 0;
        const k = Math.min(1, s.t0 / P.up),
          q = k * k * (3 - 2 * k);
        b.a = lie.a * (1 - Math.min(1, q * 2));
        b.x = k < 0.5 ? lie.x + (sit.x - lie.x) * q * 2 : sit.x + (EV_HOME.up.x - sit.x) * (q - 0.5) * 2;
        b.y = k < 0.5 ? lie.y + (sit.y - lie.y) * q * 2 : sit.y + (EV_HOME.up.y - sit.y) * (q - 0.5) * 2 - Math.sin((q - 0.5) * 2 * Math.PI) * 24;
        b.cover = Math.max(0, 1 - q * 2);
        b.feet = k > 0.5;
        return k >= 1;
      }),
      e.run(() => {
        S().bed = null;
        e.place("sq", EV_HOME.up.x, EV_HOME.up.y);
        e.face("sq", 1);
        setPose("stand");
        control("chip-out");
      }),
    ]);
  }

  // ---------- beat 42: night one ----------
  // Into the next room on the way: the step changes as the room does (so the room is always the step's own: the
  // drawing and ↺ both go by it), and he walks in; control comes once he is in.
  function intoRoom(to, scene, at, stop, next, opts = {}) {
    const e = E();
    go(opts.step);
    e.enterRoom(to, scene);
    to === "hangar" && e.set("ch1D", true);
    e.place("sq", at.x, at.y);
    e.face("sq", stop.x >= at.x ? 1 : -1);
    setPose("stand");
    e.queue([walkTo("sq", stop.x, stop.y, opts.speed || P.walk), e.run(() => control(next))]);
  }
  function throughDoor(exit, then) {
    const e = E();
    busy();
    e.walkOff();
    e.queue([e.until((dt) => (e.trail(), e.step("sq", exit.x, exit.y, P.walk, dt || 0))), e.run(then)]);
  }
  const NIGHT = {
    // home -> the hall (up through its doorway in the front wall)
    out: () => throughDoor({ x: 950, y: 440 }, () => intoRoom("hall", "QB", { x: EV_BAR.home.x, y: 640 }, { x: EV_BAR.home.x, y: 550 }, "chip-bin", { step: "nighthall", speed: P.hallWalk })),
    // the hall -> the hallway (left end)
    nighthall: () => throughDoor({ x: 952, y: 312 }, () => intoRoom("passage", "QB", { x: 8, y: EV_HALLWAY.left.y }, { x: 110, y: EV_HALLWAY.left.y + 20 }, "chip-bin", { step: "nightway" })),
    // the hallway -> the loading bay
    nightway: () => throughDoor({ x: 952, y: EV_HALLWAY.right.y }, () => intoRoom("hangar", "QB", EV_BAY.in, EV_BAY.stop, "chip-bin", { step: "bin" })),
    // and back: the bay -> the hallway (right end) -> the hall -> home
    back: () => throughDoor({ x: 20, y: EV_BAY.in.y }, () => intoRoom("passage", "QB", { x: 952, y: EV_HALLWAY.right.y }, { x: 850, y: EV_HALLWAY.right.y + 20 }, "chip-sneak-home", { step: "backway" })),
    backway: () => throughDoor({ x: 8, y: EV_HALLWAY.left.y }, () => intoRoom("hall", "QB", { x: 952, y: 312 }, LUNCH_PLACES.door.stand, "chip-sneak-home", { step: "backhall", speed: P.hallWalk })),
    backhall: () => throughDoor({ x: EV_BAR.home.x, y: 640 }, () => intoRoom("closet", "QB", EV_HOME.in, { x: 800, y: 470 }, "chip-bed", { step: "tobed" })),
  };
  /** GRAB · copies: the two stuck-together copies from the bin; his whispered idea; then the choice, in the close-up. */
  function grabCopies() {
    const e = E(),
      s = S();
    busy();
    s.papers = "paw";
    E().paper && E().paper("paws");
    sound.effect("grab");
    go("choosing");
    e.queue([
      e.say("sq", eveningWords("sq-if-replace"), "whisper"),
      e.say("sq", eveningWords("sq-come-with"), "whisper"),
      e.say("sq", eveningWords("sq-or-stay"), "whisper"),
      e.run(() => openChoice()),
    ]);
  }
  function openChoice() {
    const s = S();
    s.order = { chose: "", mark: 0, tear: 0, paw: null, pressAt: -1, tearAt: -1 };
    s.ending = null;
    go("order");
    openView("order");
  }
  // MARK · box: his paw on the box. PUT BACK · bin: the short ending (story pass 42b; decided 2026-11-26, question 6).
  function chooseMark() {
    S().order.chose = "mark";
    sound.effect("grab");
  }
  function choosePutBack() {
    const s = S();
    s.order = null;
    s.papers = "";
    // he drops the copies back in the bin and sneaks home (a wordless cutaway), then years later, then the cards
    s.ending = { at: E().time(), card: -1 };
    sound.effect("slip");
  }
  /** The ending's taps: the cards one at a time, then GO BACK · to the form (back to the choice; nothing lost). */
  function endingTap(p) {
    const s = S(),
      g = s.ending,
      t = E().time() - g.at;
    if (t < P.cutaway + P.zoomIn) return;
    if (g.card < ENDING_CARDS.length - 1) return void (g.card += 1);
    if (inBox(p, ORDERV.goBack, 10)) {
      s.papers = "paw";
      s.ending = null;
      s.order = { chose: "", mark: 0, tear: 0, paw: null, pressAt: -1, tearAt: -1 };
      view.at = E().time();
      sound.effect("grab");
    }
  }
  const ENDING_CARDS = ["card-put-back", "card-kept", "card-happily", "card-end"];
  // In the close-up: his paw pressed on the box.
  function markOrder() {
    const o = S().order;
    if (!o || o.chose !== "mark" || o.pressAt >= 0) return;
    o.pressAt = E().time();
    sound.effect("key");
    E().set("ch1Paw", 1);
    E().set("ch1Signed", 1);
  }
  function orderTick() {
    const s = S(),
      o = s.order,
      t = E().time();
    if (!o) return;
    if (o.pressAt >= 0) o.mark = Math.min(1, (t - o.pressAt) / P.press);
    if (o.pressAt >= 0 && o.mark >= 1 && o.tearAt < 0) ((o.tearAt = t), sound.effect("slip"));
    if (o.tearAt >= 0) o.tear = Math.min(1, (t - o.tearAt) / P.tear);
    if (o.tear >= 1 && view && view.kind === "order") {
      // the yellow copy is in his paw: the close-up closes by itself; the mailbox gets the outline
      closeView();
      s.papers = "both";
      s.order = null;
      go("post");
      control("chip-post");
    }
  }
  /** POST · mailbox: it is loud. The night robot hears; the alarm (the one capture rule); the crate by the vent. */
  function postYellow() {
    const e = E(),
      s = S();
    busy();
    go("posted");
    s.papers = "pink";
    s.yellow = "mail";
    s.t0 = 0;
    e.set("ch1Mailed", 1);
    sound.effect("pickup");
    e.queue([
      timer(0.4),
      e.say("ups", eveningWords("ups-scanned")),
      e.say("ups", eveningWords("ups-accepted")),
      e.say("sq", eveningWords("sq-shhh"), "whisper"),
      // the night robot turns: "!", it rolls to the FUR alarm; guards come. He has to hide, and the crate is the place
      e.run(() => {
        S().postAlarm = true;
        // (control without a new saved step: caught now, the step restarts at POST · mailbox)
        e.set("ctrl", true);
        chip("chip-hide");
        raise(EV_BAY.robot.id, "where-bay");
      }),
    ]);
  }
  /** HIDE · crate (by the big wall vent): crouched in it, the vent's swirls catch the pink sheet and take it. */
  function hideCrate() {
    const e = E(),
      s = S();
    s.alarm && (s.alarm.spotted = s.alarm.guards.some((g) => g.sees));
    e.place("sq", EV_BAY.underVent.x, EV_BAY.underVent.y);
    e.still("sq");
    e.stopWalk && e.stopWalk();
    setPose("hidden");
    s.hideAt = "crate";
    sound.effect("hide");
    if (s.papers === "pink" && s.suck < 0) ((s.suck = 0), (s.pink = "flying"), e.sfx("slurp"));
  }
  // Every frame: the vent pulling the pink sheet out of his paws (wordless, about 3 seconds), then his whisper.
  function suckTick(dt) {
    const e = E(),
      s = S();
    if (s.suck < 0) return;
    s.suck = Math.min(1, s.suck + dt / P.suck);
    if (s.suck >= 1) {
      s.suck = -1;
      s.papers = "";
      s.pink = "vent";
      e.set("ch1PinkSucked", 1);
      e.paper && e.paper("vent");
      e.queue([e.say("sq", eveningWords("sq-pink"), "whisper")]);
    }
  }
  // after "They lost you.": the yellow one got mailed. It's done. Then the way home.
  function postAlarmDone() {
    const e = E(),
      s = S();
    s.postAlarm = false;
    busy();
    e.queue([
      e.say("sq", eveningWords("sq-mailed"), "whisper"),
      e.say("sq", eveningWords("sq-done"), "whisper"),
      e.run(() => {
        go("back");
        control("chip-sneak-home");
      }),
    ]);
  }
  /** Night one: he bumps the mop bucket: a clang, Mops snorts and rolls over, and he tiptoes back beside his bed. */
  function bumpBucket() {
    const e = E(),
      s = S();
    busy();
    s.bumping = true;
    sound.effect("key");
    e.sfx("bleep");
    s.mopsSleep.wake = 0;
    e.queue([
      e.until((dt) => ((S().mopsSleep.wake = Math.min(1, S().mopsSleep.wake + (dt || 0) / 0.4)), S().mopsSleep.wake >= 1)),
      // (Mops asleep is drawn by this file, so the room counts him as not drawn: his bubble goes by his own speaker id)
      e.say("sleeping-mops", eveningWords("mops-weee")),
      e.until((dt) => ((S().mopsSleep.wake = Math.max(0, S().mopsSleep.wake - (dt || 0) / 0.6)), S().mopsSleep.wake <= 0)),
      e.run(() => {
        S().bumping = false;
        S().bumps = (S().bumps || 0) + 1;
        e.place("sq", EV_HOME.up.x, EV_HOME.up.y);
        e.face("sq", 1);
        control("chip-out");
      }),
    ]);
  }
  function handOff() {
    const e = E();
    go("done");
    e.set("ch1Sneak", false);
    e.set("ch1Lights", 1);
    chip("");
    // beat 43 as it is today ("Six days later")
    e.sixDays && e.sixDays();
  }

  // ---------- sight and the one capture rule ----------
  // Sight in a room where Squatch is drawn smaller than in the hall: the cone is measured against his outline at his
  // own size (the hall's outline, party-watch.js, scaled round his feet).
  const seesHere = (c, sq) => {
    const k = sqScale() / E().hallSizes().squatch;
    if (Math.abs(k - 1) < 0.01) return coneSees(c, sq);
    return coneSees({ ...c, ox: sq.x + (c.ox - sq.x) / k, oy: sq.y + (c.oy - sq.y) / k, len: c.len / k }, sq);
  };
  const free = () => E().get("ctrl") && !E().current();
  const BALL = () => E().ball || { radius: 70, seconds: 2 };
  const ballNoticed = (s) => Object.values(s.ballNear || {}).some((t) => t >= BALL().seconds);
  const hiddenNow = (s) => s.pose === "hidden" || (s.pose === "ball" && !ballNoticed(s));
  /** Every cone that can see him now (and is drawn): the watchers of this room, and the guards during an alarm. */
  function coneList(s) {
    const e = E(),
      size = e.coneSize(),
      out = [];
    // During an alarm each cone goes with its person (backing away), and the witness looks at the alarm as he runs.
    const a = s.alarm,
      at = (p) => (a && a.w.id === p.id ? a.w : (s.people && s.people[p.id]) || p),
      look = (p, alarm) => (a && a.w.id === p.id ? lookAt(a.w.x, a.w.y, { x: (alarm.x0 + alarm.x1) / 2, y: (alarm.y0 + alarm.y1) / 2 }) : p.a);
    if (room() === "hall") {
      for (const p of (s.guests || []).filter((g) => g.x < 960 && g.wait <= 0)) {
        const q = at(p);
        out.push({ ...coneFrom(p.id, q.x, q.y, look(p, HALL.alarm), size), always: true, bold: true });
      }
    }
    // 36b's cleaning robots while they are still in the hall (he is rolled up behind the bar: they catch nobody)
    if (room() === "hall") for (const r of s.cleaners || []) out.push({ ...coneFrom(r.id, r.x, r.y, r.f === 1 ? 0 : r.f === -1 ? Math.PI : r.f === 2 ? -Math.PI / 2 : Math.PI / 2, size), always: true, robot: true, catch: false });
    // the hallway robot (beat 37): its cone goes where it looks (every robot shows its cone, rule 8)
    // (only once it is in the hallway: waiting outside the doorway it is not in the picture)
    if (room() === "passage" && s.robot && s.robot.wait <= 0) {
      const q = at({ id: "hallway-robot", x: s.robot.x, y: s.robot.y });
      out.push({ ...coneFrom("hallway-robot", q.x, q.y, look({ id: "hallway-robot", a: s.robot.a }, { x0: 60, x1: 100, y0: 280, y1: 320 }), size), always: true, bold: true, robot: true });
    }
    if (room() === "hangar") {
      const n = nightLook(s.nightT),
        nr = at({ id: EV_BAY.robot.id, x: EV_BAY.robot.x, y: EV_BAY.robot.y, a: n.a });
      out.push({ ...coneFrom(EV_BAY.robot.id, nr.x, nr.y, look({ ...nr, id: EV_BAY.robot.id, a: n.a }, EV_BAY.alarm), size), always: true, bold: true, catch: n.catch || (a && a.w.id === EV_BAY.robot.id), robot: true });
      // parked in the mail room on standby (switched off): their cones along its bottom wall
      EV_BAY.parked.forEach((r) => out.push({ ...coneFrom(r.id, r.x, r.y, robotLook(r.id), size), always: true, bold: true, catch: true, robot: true }));
    }
    if (s.alarm) out.push(...guardCones(s.alarm, size).map((c) => ({ ...c, catch: true })));
    return out;
  }
  const witnessAt = (s, id) => {
    if (room() === "hangar") {
      if (id === EV_BAY.robot.id) return { id, x: EV_BAY.robot.x, y: EV_BAY.robot.y };
      const i = +id.split("-")[1] - 2,
        r = EV_BAY.parked[i];
      return r ? { id, x: r.x, y: r.y } : null;
    }
    if (room() === "passage") return s.robot && id === "hallway-robot" ? { id, x: s.robot.x, y: s.robot.y } : null;
    if (id === "fur-alarm") return { id, x: (HALL.alarm.x0 + HALL.alarm.x1) / 2, y: HALL.alarm.y1 + 120 };
    const f = (s.guests || []).find((q) => q.id === id);
    return f ? { id, x: f.x, y: f.y } : null;
  };
  function raise(id, whereId) {
    const e = E(),
      s = S(),
      w = witnessAt(s, id);
    if (!w) return;
    const bay = room() === "hangar",
      hallway = room() === "passage";
    startAlarm(s, w, whereId || (bay ? "where-bay" : hallway ? "where-hallway" : "where-bar"), bay || hallway ? "who-robot" : id === "fur-alarm" ? "who-guard" : "who-tourist", bay ? "bay" : hallway ? "hallway" : "");
    e.sfx("bleep");
    psound.sting();
    s.seenBy = "";
    s.seenT = 0;
    // the family backs away (the hall); robots stay where they are
    s.people = {};
    if (!bay && !hallway)
      for (const f of s.guests || []) {
        const dx = f.x - 480,
          dy = f.y - 450,
          d = Math.hypot(dx, dy) || 1;
        s.people[f.id] = { x: f.x, y: f.y, hx: f.x, hy: f.y, ax: (dx / d) * ALARM.backAway, ay: (dy / d) * ALARM.backAway * 0.6 };
      }
    chip("chip-hide");
  }
  function alarmApi() {
    const e = E();
    return {
      E: e,
      size: () => e.coneSize(),
      sq: () => e.pos("sq"),
      // (a ball fools a quick look, never a search: decided 2026-11-26, question 1: A)
      hidden: () => (S().pose === "hidden" ? "plant" : ""),
      room: () => e.room(),
      people: () => S().people || {},
      sees: (c, sq) => seesHere(c, sq),
      firstTime: () => false,
      closeUp: (done) => done(),
      bell: () => psound.one("bell"),
      caught(whoId, whereId) {
        const word = (id) => (id.startsWith("who-robot") || id === "where-bay" || id === "where-hallway" ? eveningWords(id) : partyLine(id));
        e.catchSquatch(partyLine("lockup-cause").replace("{who}", word(whoId)).replace("{where}", word(whereId)));
      },
      lost() {
        record.lost = (record.lost || 0) + 1;
        psound.one("lost");
        e.lostYou(partyLine("note-lost"));
      },
      calmDone() {
        const s = S();
        // the guests' moving cones follow the people who backed away and came back
        for (const f of s.guests || []) s.people[f.id] && ((f.x = s.people[f.id].x), (f.y = s.people[f.id].y));
        s.people = {};
        if (s.postAlarm) return postAlarmDone();
        // the hallway: the robot rolls on out (it has done its job), and the hallway is his again
        if (room() === "passage") return ((s.robot = null), go("past"), control("chip-to-hall"));
        if (s.step === "hide") return control("chip-hide");
        control(s.step === "post" ? "chip-post" : ["back", "backway", "backhall", "tobed"].includes(s.step) ? "chip-sneak-home" : "chip-bin");
      },
    };
  }

  // ---------- every frame ----------
  function tick(dt) {
    const s = live(),
      e = E();
    // a close-up open when the evening is gone (a chapter reset, a jump elsewhere) ends itself
    if (!s) return void (view && closeView());
    dt = dt || 0;
    psound.tick();
    const r = room(),
      sqAt = e.pos("sq"),
      on = free();
    // the night robot keeps its rhythm whenever the bay is on screen
    r === "hangar" && (s.nightT += dt);
    // beat 37: the gallery's flap, and the robot rolling through
    view && view.kind === "gallery" && galleryTick(dt);
    s.step === "dodge" && r === "passage" && robotTick(dt);
    // beat 38a: Jupiter's storm fills the window; the guests walk (not while an alarm moves them)
    r === "hall" && s.storm >= 0 && (s.storm = Math.min(1, s.storm + dt / STORM.stormIn));
    r === "hall" && s.guests && !s.alarm && guestsTick(dt);
    r === "hall" && (s.cleaners || []).length && cleanersTick(dt);
    view && view.kind === "order" && orderTick();
    view && view.kind === "chart" && chartTick(dt);
    r === "hangar" && suckTick(dt);
    // the pink sheet flutters toward the big wall vent as he carries it past (the danger shown before it bites)
    if (r === "hangar" && (s.papers === "both" || s.papers === "paw") && Math.hypot(sqAt.x - EV_BAY.vent.mouth.x, sqAt.y - EV_BAY.vent.mouth.y) < P.flutterNear) !s.fluttered && ((s.fluttered = true), sound.effect("slip"));
    // night one at home: bumping Mops's bucket clangs; he snorts and rolls over (funny, no capture), and back he goes
    if (on && r === "closet" && s.step === "out" && !s.bed && s.mopsSleep && !s.bumping) {
      const B = EV_HOME.bucket;
      if (sqAt.x > B.x0 - 16 && sqAt.x < B.x1 + 16 && sqAt.y > B.y0 - 18 && sqAt.y < B.y1 + 14) bumpBucket();
    }
    view && view.kind === "crate" && slideTick(dt);
    // the close-ups end themselves once the game no longer has what opened them (a restart, the LOCKUP card)
    if (view && !((view.kind === "gallery" && s.step === "gallery") || (view.kind === "brochure" && s.step === "read") || (view.kind === "chart" && s.step === "xchart") || (view.kind === "crate" && s.step === "slide") || (view.kind === "back" && s.step === "fightend") || (view.kind === "order" && s.step === "order"))) closeView();
    // Night one, still in bed: his first move gets him up.
    if (on && s.step === "out" && s.bed && r === "closet" && e.steering()) return void getUp();
    // Steering steps him out of hiding or unrolls him.
    if (on && (s.pose === "hidden" || s.pose === "ball") && e.steering() && e.playing() !== "mops") {
      s.hideAt = "";
      s.ballNear = {};
      setPose("stand");
    }
    // Sight: hall watchers and night robots; guests "?" then "!" after SEEN_TOO_LONG_SECONDS, robots "!" at once.
    const showing = {};
    const watching = (r === "hall" || r === "hangar" || (r === "passage" && s.robot)) && !s.alarm && on && s.pose === "stand";
    if (watching) {
      const seen = coneList(s).find((c) => c.catch !== false && seesHere(c, sqAt));
      if (!seen) ((s.seenBy = ""), (s.seenT = 0));
      else {
        s.seenT = s.seenBy === seen.id ? s.seenT + dt : 0;
        s.seenBy = seen.id;
        if (s.seenT >= (seen.robot ? P.robotSee : SEEN_TOO_LONG_SECONDS)) raise(seen.id);
      }
    } else ((s.seenBy = ""), (s.seenT = 0));
    // The bay's floor vent is on (its swirl is in the locked night picture): the party's vent rule (party-vent.js VENT).
    // Standing too close, a tuft of his fur lifts off him and drifts in; staying, the fur goes in and the night robot
    // sounds the alarm ("by the vent"). Rolled up or hidden, the vent takes nothing.
    const v = s.vent || (s.vent = { t: 0, tufts: [] });
    for (const tf of v.tufts) tf.k += dt / VENT.drift;
    v.tufts = v.tufts.filter((tf) => tf.k < 1);
    // (the party hall's floor vent is on at night one too: one vent rule everywhere, PLACEHOLDER, coordinator 2026-11-26)
    const fv = r === "hangar" ? BAY_VENT.floor : r === "hall" && NIGHT_STEPS.includes(s.step) ? HALL.vent : null;
    if (fv && on && s.pose === "stand" && !s.alarm && Math.hypot(sqAt.x - fv.x, (sqAt.y - fv.y) * 1.4) <= VENT.near) {
      const first = v.t === 0;
      v.t += dt;
      (first || !v.tufts.length) && v.tufts.push({ k: 0, x0: sqAt.x, y0: sqAt.y - 30 });
      first && sound.effect("slip");
      if (v.t >= VENT.stay) {
        v.t = 0;
        for (let i = 0; i < 6; i++) v.tufts.push({ k: -i * 0.08, x0: sqAt.x + (i % 3) * 6 - 6, y0: sqAt.y - 20 - i * 4 });
        // in the bay the night robot sees the fur go in; in the empty hall the vent's own FUR alarm goes off
        raise(r === "hangar" ? EV_BAY.robot.id : "fur-alarm", "where-vent");
      }
    } else v.t = 0;
    // Rolled up: the ball rule (R43, the lunch's own reading of it): someone looking his way within reach for 2 s
    // notices the ball, the guards of an alarm too (then they see him, and the search goes on). Noticed with no alarm on:
    // the one capture rule, as for being seen standing.
    if ((r === "hangar" || r === "hall" || r === "passage") && s.pose === "ball") {
      const near = {};
      for (const c of coneList(s)) c.catch !== false && Math.hypot(sqAt.x - c.x, sqAt.y - c.y) <= BALL().radius && seesHere(c, sqAt) && (near[c.id] = true);
      const was = s.ballNear || {};
      s.ballNear = {};
      for (const id of Object.keys(near)) s.ballNear[id] = (was[id] || 0) + dt;
      if (on && !s.alarm && ballNoticed(s)) {
        const id = Object.keys(s.ballNear).find((k) => s.ballNear[k] >= BALL().seconds);
        raise(id);
        s.alarm && (s.alarm.spotted = true);
      }
    } else s.ballNear = {};
    // the "?" while a watcher registers him (a guest until it turns to "!", a robot for its half second)
    s.seenBy && (showing[s.seenBy] = s.seenT / ((coneList(s).find((c) => c.id === s.seenBy) || {}).robot ? P.robotSee : SEEN_TOO_LONG_SECONDS));
    tickQuestions(s, dt, showing);
    if (s.alarm && (r === "hall" || r === "hangar" || r === "passage")) {
      tickAlarm(s, dt, alarmApi());
      let boot = false;
      for (const g of s.alarm ? s.alarm.guards.filter((q) => q.room === r) : []) footfall(g, g.x, g.y, dt, 0.45) && (boot = true);
      boot && psound.one("step");
    }
    // walking through an open doorway (no button): each door the step leads to
    if (on && !s.alarm) {
      const at = (p) => Math.hypot(sqAt.x - p.x, sqAt.y - p.y) < p.r;
      if ((s.step === "wall" || s.step === "dodge" || s.step === "past") && r === "passage" && at(EV_HALLWAY.left)) ((s.robot = null), toHall());
      else if (s.step === "gohome" && r === "hall" && at(EV_BAR.home)) toHome(homeAlone);
      else if (s.step === "out" && r === "closet" && at(EV_HOME.door)) (s.bed && ((s.bed = null), setPose("stand")), NIGHT.out());
      else if (s.step === "nighthall" && r === "hall" && at({ ...LUNCH_PLACES.door.stand, r: LUNCH_PLACES.door.r })) NIGHT.nighthall();
      else if (s.step === "nightway" && r === "passage" && at(EV_HALLWAY.right)) NIGHT.nightway();
      else if (s.step === "back" && r === "hangar" && at(EV_BAY.door)) NIGHT.back();
      else if (s.step === "backway" && r === "passage" && at(EV_HALLWAY.left)) NIGHT.backway();
      else if (s.step === "backhall" && r === "hall" && at(EV_BAR.home)) NIGHT.backhall();
    }
    // his footsteps, only while his feet move
    if (s.pose === "stand" && footfall(ff, sqAt.x, sqAt.y, dt, HOME_MORNING_SOUND.padEvery)) sound.pad(pads++);
  }

  // ---------- spots ----------
  function spot(id, wordsId, place, thing, f) {
    const [verb, cap] = wordsId ? eveningWords(wordsId).split(" · ") : ["", ""];
    return { id, verb, cap, who: "sq", x: place.x, y: place.y, r: place.r, at: thing ? [(thing.x0 + thing.x1) / 2, thing.y0] : undefined, thing, f, walk: !wordsId };
  }
  const box = (x, y, w, h) => ({ x0: x - w / 2, x1: x + w / 2, y0: y - h / 2, y1: y + h / 2 });
  const ballSpot = () => {
    const s = E().pos("sq");
    const [verb, cap] = eveningWords("button-ball").split(" · ");
    return { id: "ev-ball", verb, cap, who: "sq", at: [s.x, s.y - 60], f: rollUp };
  };
  function rollUp() {
    const e = E(),
      s = S();
    s.alarm && (s.alarm.spotted = s.alarm.guards.some((g) => g.sees));
    e.still("sq");
    e.stopWalk && e.stopWalk();
    setPose("ball");
    s.ballNear = {};
    sound.effect("hide");
  }
  function hidePlant() {
    const e = E(),
      s = S();
    s.alarm && (s.alarm.spotted = s.alarm.guards.some((g) => g.sees));
    e.place("sq", EV_BAY.plant.x, EV_BAY.plant.y);
    e.still("sq");
    e.stopWalk && e.stopWalk();
    setPose("hidden");
    s.hideAt = "plant";
    sound.effect("hide");
  }
  // an action of Mops's, offered wherever he stands (the player is Mops), its prompt over the one it is about
  const mopsSpot = (id, wordsId, at, f) => {
    const [verb, cap] = eveningWords(wordsId).split(" · "),
      m = E().pos("mops");
    return { id, verb, cap, who: "mo", x: m.x, y: m.y, r: 60, at, f, hot: true };
  };
  /** HIDE · bar while an alarm is on (night one in the hall): down into the aisle behind the bar, rolled up. */
  function hideFromAlarm() {
    const e = E(),
      s = S();
    s.alarm && (s.alarm.spotted = s.alarm.guards.some((g) => g.sees));
    busy();
    s.hideAt = "counter";
    e.queue([
      e.until((dt) => e.step("sq", EV_BAR.aisleTop.x, EV_BAR.aisleTop.y, P.hallWalk * 1.3, dt || 0)),
      e.until((dt) => e.step("sq", EV_BAR.hidden.x, EV_BAR.hidden.y, P.hallWalk * 1.3, dt || 0)),
      e.run(() => (setPose("hidden"), sound.effect("hide"), e.still("sq"), control(""))),
    ]);
  }
  const doorSpot = (id, p) => spot(id, "", { x: p.x, y: p.y, r: p.r }, null, null);
  function spots() {
    const s = live(),
      e = E();
    if (!s || !e.get("ctrl")) return [];
    const r = room(),
      standing = s.pose === "stand";
    // during an alarm: every hiding place, and the ball anywhere else
    if (s.alarm) {
      if (!standing) return [];
      const out = [];
      r === "hall" && out.push(spot("ev-counter", "button-counter", EV_BAR.hide, EV_BAR.aisle, hideFromAlarm));
      // after the loud post the crate by the big wall vent is the one hiding place (story pass 42c)
      if (r === "hangar" && s.postAlarm) return [spot("ev-bay-crate", "button-crate", { x: EV_BAY.underVent.x, y: EV_BAY.underVent.y, r: 56 }, BAY_CRATE, hideCrate)];
      r === "hangar" && out.push(spot("ev-plant", "button-plant", EV_BAY.plant, EV_BAY.plant.box, hidePlant), spot("ev-bay-crate", "button-crate", { x: EV_BAY.underVent.x, y: EV_BAY.underVent.y, r: 56 }, BAY_CRATE, hideCrate));
      // (no ball once the alarm has rung: a ball never fools a search)
      return out;
    }
    switch (s.step) {
      // the robot has gone: the hall's doorway (the gallery is not offered again this visit)
      case "past":
        return [doorSpot("ev-hall", EV_HALLWAY.left)];
      case "wall": {
        const out = [doorSpot("ev-hall", EV_HALLWAY.left)];
        // the gallery is optional: no outline (it is not the goal), offered under the wall until the robot came
        standing && !s.galleryDone && out.push({ ...spot("ev-photos", "button-photos", EV_HALLWAY.look, EV_HALLWAY.wall, lookPhotos), optional: true });
        return out;
      }
      // the robot rolls through: ROLL · ball wherever he is (a ball fools a quick look)
      case "dodge":
        return standing ? [ballSpot()] : [];
      case "hide":
        return standing ? [spot("ev-counter", "button-counter", EV_BAR.hide, EV_BAR.aisle, hideBehindBar)] : [];
      // 38b (the player is Mops; each is offered where he stands, its words over the kid or the family)
      case "greet": {
        const kid = guestBy("kid");
        return kid ? [mopsSpot("ev-greet", "button-greet", [kid.x, kid.y - e.hallSizes().adult * EV_BAR.kidK - 10], greetKid)] : [];
      }
      case "ask": {
        const dad = guestBy("dad");
        return dad ? [mopsSpot("ev-talk", "button-talk", [dad.x, dad.y - bridge.guests.height(dad.id, e.hallSizes().adult) - 10], askFamily)] : [];
      }
      case "gohome":
        return [doorSpot("ev-home", EV_BAR.home)];
      // 39b: the Guardians' box in his paw, the bite, the chart above his bed, the crate
      case "box":
        return [spot("ev-box", "button-open-box", { x: e.pos("sq").x, y: e.pos("sq").y, r: 60 }, null, openBox)];
      case "bite":
        return [spot("ev-bite", "button-bite", { x: e.pos("sq").x, y: e.pos("sq").y, r: 60 }, null, biteCake)];
      case "chart": {
        const C = HOME_ALONE.chart;
        return [spot("ev-chart", "button-chart", HOME_ALONE.chartSpot, { x0: C.x, x1: C.x + C.w, y0: C.y, y1: C.y + C.h }, lookChart)];
      }
      case "crate":
        return [spot("ev-crate", "button-hold-up", HOME_ALONE.crateSpot, HOME_ALONE.crate, holdUpBrochure)];
      // 40: ASK · again where he stands, or STOMP · to bed at the bed (both reach the same lines)
      case "choose":
        return [spot("ev-ask", "button-ask", { x: EV_HOME.stop.x, y: EV_HOME.stop.y, r: 70 }, null, () => fightEnds(false)), spot("ev-stomp", "button-stomp", EV_HOME.bed, null, () => fightEnds(true))];
      case "show": {
        // he holds it up where he stands (the action is where he is: no outline, the prompt only)
        const at = e.pos("sq");
        return [spot("ev-show", "button-show", { x: at.x, y: at.y, r: 60 }, null, showBrochure)];
      }
      case "bed":
        return [spot("ev-bed", "button-bed", EV_HOME.bed, null, () => toBed(true))];
      case "out":
        return [doorSpot("ev-out", EV_HOME.door)];
      case "nighthall":
        return [doorSpot("ev-hallway", { ...LUNCH_PLACES.door.stand, r: LUNCH_PLACES.door.r })];
      case "nightway":
        return [doorSpot("ev-bay", EV_HALLWAY.right)];
      // (the plant is a hiding place during an alarm only: on the way past it, the button stays on the next thing)
      case "bin": {
        const out = [spot("ev-bin", "button-copies", EV_BAY.bin, EV_BAY.bin.box, grabCopies)];
        standing && out.push(ballSpot());
        return out;
      }
      case "post": {
        const out = [spot("ev-post", "button-post", EV_BAY.mail, EV_BAY.mail.box, postYellow)];
        standing && out.push(ballSpot());
        return out;
      }
      case "back": {
        const out = [doorSpot("ev-bayout", EV_BAY.door)];
        standing && out.push(ballSpot());
        return out;
      }
      case "backway":
        return [doorSpot("ev-hall", EV_HALLWAY.left)];
      case "backhall":
        return [doorSpot("ev-home", EV_BAR.home)];
      case "tobed":
        return [spot("ev-bed", "button-bed", EV_HOME.bed, null, () => toBed(false))];
    }
    return [];
  }

  // ---------- the full-screen close-ups ----------
  // The design boxes (evening-art.js fitDesign): the gallery's photo, arrows and X; the brochure; the papers.
  const GALLERY = Object.freeze({ W: 400, H: 700, photo: { x: 40, y: 110, w: 320, h: 250 }, plaque: { x: 200, y: 404, size: 20 }, left: { x: 80, y: 520, r: 40 }, right: { x: 320, y: 520, r: 40 }, close: { x: 352, y: 640, r: 36 }, dots: { x: 200, y: 452 }, lift: { x: 130, y: 496, w: 140, h: 48 }, thought: { x: 160, y: 596, w: 280, h: 92 } });
  const BROCHURE = Object.freeze({ W: 360, H: 600, card: { x: 30, y: 60, w: 300, h: 420 }, close: { x: 318, y: 556, r: 34 } });
  // 39b: the chart close-up (this week's cake to X), the crate close-up (the brochure slid along the stamp)
  const CHARTV = Object.freeze({ W: 400, H: 700, chart: { x: 20, y: 170, w: 360, h: 260 }, close: { x: 352, y: 640, r: 36 } });
  const CRATEV = Object.freeze({ W: 400, H: 700, crate: { x: 10, y: 150, w: 380, h: 230 }, stamp: { x: 40, y: 290, h: 40 }, card: { y: 420, w: 220, h: 300 }, close: { x: 352, y: 640, r: 36 } });
  // 40: Mops's turned back, Squatch small behind him
  const BACKV = Object.freeze({ W: 400, H: 700, mops: { x: 270, y: 520, k: 4.2 }, sq: { x: 80, y: 540, k: 1.4 }, close: { x: 352, y: 640, r: 36 } });
  // 42b: the choice above the papers (two thought pictures, each with its button); the papers below; the don't-send ending
  const ORDERV = Object.freeze({
    W: 400,
    H: 800,
    papers: { x: 20, y: 250 },
    go: { cx: 102, cy: 100, w: 180, h: 140, button: { x: 22, y: 186, w: 160, h: 48 } },
    stay: { cx: 298, cy: 100, w: 180, h: 140, button: { x: 218, y: 186, w: 160, h: 48 } },
    years: { x: 20, y: 70, w: 360, h: 300 },
    card: { y: 470 },
    goBack: { x: 70, y: 600, w: 260, h: 56 },
  });
  const designOf = (kind) => ({ gallery: GALLERY, brochure: BROCHURE, chart: CHARTV, crate: CRATEV, back: BACKV, order: ORDERV })[kind] || PAPERS;
  function openView(kind) {
    const at = E().time();
    view = { kind, at, paw: null, down: null };
    record.cutIns.push(kind);
    openFullScreen({
      label: { gallery: "photo wall", brochure: "brochure", chart: "cake chart", crate: "crate", back: "Mops" }[kind] || "order papers",
      draw: (ctx, w, h, t) => drawView(ctx, w, h, t),
      pointer: (k, x, y) => pointer(k, x, y),
      restart: () => E().restartPart && E().restartPart(),
    });
  }
  function closeView() {
    view && closeFullScreen();
    view = null;
  }
  // Screen point -> design point of the open view.
  function toDesign(x, y) {
    const D = designOf(view.kind),
      f = fitDesign(view.w || 375, view.h || 812, D.W, D.H);
    return { x: (x - f.x) / f.k, y: (y - f.y) / f.k };
  }
  const hit = (p, c, pad = 10) => Math.hypot(p.x - c.x, p.y - c.y) <= c.r + pad;
  const inBox = (p, b, pad = 0) => p.x >= b.x - pad && p.x <= b.x + b.w + pad && p.y >= b.y - pad && p.y <= b.y + b.h + pad;
  function pointer(kind, x, y) {
    if (!view) return;
    const p = toDesign(x, y),
      s = live();
    if (!s) return;
    view.paw = kind === "up" ? null : p;
    if (kind === "down") view.down = p;
    if (view.kind === "gallery" && s.gallery) {
      const g = s.gallery;
      // photo #4: holding LIFT · photo (or the photo itself) swings it up; letting go swings it back
      const onLift = g.i === 3 && (inBox(p, GALLERY.lift, 8) || inBox(p, GALLERY.photo, 10));
      if (kind === "down") g.holding = onLift;
      if (kind !== "up") return;
      const wasHolding = g.holding;
      g.holding = false;
      if (wasHolding) return;
      const d = view.down || p,
        swipe = p.x - d.x;
      if (hit(p, GALLERY.close)) return galleryEnd(false);
      const next = hit(p, GALLERY.right) || swipe < -50,
        back = hit(p, GALLERY.left) || swipe > 50;
      if (next) return g.i >= 4 ? galleryEnd(true) : ((g.i += 1), (g.lift = 0), sound.effect("grab"));
      if (back && g.i > 0) return ((g.i -= 1), (g.lift = 0), sound.effect("grab"));
      return;
    }
    // the brochure in Mops's keeping, and Mops's turned back: a tap anywhere (once it has zoomed in) goes on
    if (view.kind === "brochure" || view.kind === "back") {
      if (kind === "up" && E().time() - view.at > P.zoomIn) closeView();
      return;
    }
    if (view.kind === "chart") {
      // a tap on this week's cake draws one stroke of the X (two taps, two strokes)
      const C = CHARTV.chart,
        k = C.w / CHART.W,
        cx = C.x + (CHART.cell.x0 + CHART.tried * CHART.cell.step) * k,
        cy = C.y + CHART.cell.y * k;
      if (kind === "up" && E().time() - view.at > P.zoomIn && Math.hypot(p.x - cx, p.y - cy) <= CHART.cell.r * k + 30 && s.xStroke < 2 && s.xMark >= s.xStroke * 0.5) ((s.xStroke += 1), sound.effect("slip"));
      return;
    }
    if (view.kind === "crate") {
      // dragging the brochure left along the stamp (or tapping it, a step at a time) slides it
      if (E().time() - view.at <= P.zoomIn || s.slide >= 1) return;
      if (kind === "move" && view.down) s.slide = Math.max(s.slide, Math.min(1, (view.down.x - p.x) / 200 + (view.from || 0)));
      if (kind === "down") view.from = s.slide;
      if (kind === "up" && view.down && Math.abs(view.down.x - p.x) < 8) s.slide = Math.min(1, s.slide + 0.34);
      kind === "up" && (view.down = null);
      s.slide >= 1 && sound.effect("grab");
      return;
    }
    if (view.kind === "order") {
      if (E().time() - view.at <= P.zoomIn) return;
      if (s.ending) return void (kind === "up" && endingTap(p));
      if (!s.order) return;
      if (!s.order.chose) {
        if (kind !== "up") return;
        if (inBox(p, ORDERV.go.button, 8)) return chooseMark();
        if (inBox(p, ORDERV.stay.button, 8)) return choosePutBack();
        return;
      }
      const B = PAPERS.box,
        q = { x: p.x - ORDERV.papers.x, y: p.y - ORDERV.papers.y };
      if ((kind === "down" || kind === "up") && q.x > B.x - 26 && q.x < B.x + B.s + 26 && q.y > B.y - 26 && q.y < B.y + B.s + 26) markOrder();
    }
  }
  function drawView(ctx, w, h, t) {
    if (!view) return;
    view.w = w;
    view.h = h;
    const s = live();
    drawCutInBack(ctx, w, h);
    if (!s) return;
    const D = designOf(view.kind),
      f = fitDesign(w, h, D.W, D.H),
      zoom = Math.min(1, (E().time() - view.at) / P.zoomIn),
      z = 0.6 + 0.4 * (zoom * zoom * (3 - 2 * zoom)),
      now = E().time(),
      px = 1 / (f.k * z); // one screen pixel in the close-up's own units
    ctx.save();
    ctx.translate(f.x + (D.W * f.k * (1 - z)) / 2, f.y + (D.H * f.k * (1 - z)) / 2);
    ctx.scale(f.k * z, f.k * z);
    const out = { kind: view.kind };
    if (view.kind === "gallery" && s.gallery) {
      const g = s.gallery,
        list = photos(s),
        id = list[g.i],
        Ph = GALLERY.photo,
        crooked = g.i === 3,
        lift = crooked ? g.lift : 0,
        q = lift * lift * (3 - 2 * lift);
      // the wall behind, and, behind the crooked photo, his crayon drawing
      ctx.fillStyle = "#f3efe4";
      ctx.fillRect(10, 70, 380, 410);
      crooked && drawCrayonDrawing(ctx, Ph.x + 10, Ph.y + 8, Ph.w - 20, Ph.h - 16);
      // a corner of crayon paper pokes out below the crooked frame before anyone touches it
      if (crooked && q < 0.5) {
        ctx.save();
        ctx.translate(Ph.x + Ph.w - 60, Ph.y + Ph.h + 10);
        ctx.rotate(0.18);
        ctx.fillStyle = "#fffdf2";
        ctx.fillRect(0, 0, 44, 22);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#1e2430";
        ctx.strokeRect(0, 0, 44, 22);
        ctx.strokeStyle = "#e5533d";
        ctx.beginPath();
        ctx.moveTo(6, 8);
        ctx.quadraticCurveTo(20, 2, 34, 12);
        ctx.stroke();
        ctx.restore();
      }
      // the frame: hanging (crooked on #4), or swinging up on its nail at the top like a flap
      ctx.save();
      ctx.translate(Ph.x + Ph.w / 2, Ph.y - 10);
      ctx.rotate(crooked ? -0.12 * (1 - q) : 0);
      ctx.scale(1, 1 - 0.92 * q);
      ctx.translate(-(Ph.x + Ph.w / 2), -(Ph.y - 10));
      ctx.fillStyle = "#e9c46a";
      ctx.fillRect(Ph.x - 10, Ph.y - 10, Ph.w + 20, Ph.h + 20);
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#1e2430";
      ctx.strokeRect(Ph.x - 10, Ph.y - 10, Ph.w + 20, Ph.h + 20);
      drawPhoto(ctx, id, Ph.x, Ph.y, Ph.w, Ph.h, (c, x, y, k, o) => E().drawMopsOn(c, x, y, k, o), now);
      ctx.strokeRect(Ph.x, Ph.y, Ph.w, Ph.h);
      // the crooked one gets the game's one highlight, the dashed gold outline just outside it (Brian 2026-11-26)
      crooked && q === 0 && !g.lifted && dashedOutline(ctx, Ph.x - 16, Ph.y - 16, Ph.w + 32, Ph.h + 32, px, now);
      ctx.restore();
      // the nail it hangs from
      ctx.beginPath();
      ctx.arc(Ph.x + Ph.w / 2, Ph.y - 14, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#8a93a6";
      ctx.fill();
      drawPlaque(ctx, GALLERY.plaque.x, GALLERY.plaque.y, GALLERY.plaque.size);
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(GALLERY.dots.x + (i - 2) * 22, GALLERY.dots.y, i === g.i ? 7 : 5, 0, Math.PI * 2);
        ctx.fillStyle = i === g.i ? "#ffd23f" : "rgba(255,255,255,.8)";
        ctx.fill();
      }
      g.i > 0 && drawArrow(ctx, GALLERY.left.x, GALLERY.left.y, GALLERY.left.r, -1);
      drawArrow(ctx, GALLERY.right.x, GALLERY.right.y, GALLERY.right.r, 1);
      drawCloseX(ctx, GALLERY.close.x, GALLERY.close.y, GALLERY.close.r);
      // LIFT · photo: held down, the frame swings up
      if (crooked) viewButton(ctx, GALLERY.lift, eveningWords("button-lift"), g.holding);
      // his thought, the first time it is all the way up
      if (g.thoughtAt >= 0 && now - g.thoughtAt < 4) viewThought(ctx, GALLERY.thought, eveningWords("sq-hid-it"), Math.min(1, (now - g.thoughtAt) / 0.25));
      Object.assign(out, { photo: g.i + 1, id, crooked, lift: +q.toFixed(2), lifted: g.lifted, crayon: crooked, thought: g.thoughtAt >= 0 && now - g.thoughtAt < 4 });
    } else if (view.kind === "brochure") {
      // a brochure for the stand (Brian r5 6:08: no cooks on it): the stand, Mars behind it, the cake box, the cake fizzing
      const C = BROCHURE.card;
      drawBrochure(ctx, C.x, C.y, C.w, C.h, false, 1, now);
      drawCloseX(ctx, BROCHURE.close.x, BROCHURE.close.y, BROCHURE.close.r);
      Object.assign(out, { card: C });
    } else if (view.kind === "chart") {
      const C = CHARTV.chart;
      drawEveningChart(ctx, C.x, C.y, C.w, C.h, s.xMark || 0, false, eveningWords("sign-crate-kind"));
      // this week's cake gets the one highlight until its X is drawn
      if ((s.xStroke || 0) < 2) {
        const k = C.w / CHART.W;
        ctx.save();
        ctx.setLineDash([OUTLINE.dash * 1.4 * px, OUTLINE.dash * px]);
        ctx.lineWidth = 3 * px;
        ctx.strokeStyle = OUTLINE.color;
        ctx.beginPath();
        ctx.arc(C.x + (CHART.cell.x0 + CHART.tried * CHART.cell.step) * k, C.y + CHART.cell.y * k, CHART.cell.r * k + 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      // his paw with the crayon
      drawFurArm(ctx, 300, D.H + 40, 290, 470, 30);
      drawCloseX(ctx, CHARTV.close.x, CHARTV.close.y, CHARTV.close.r);
      Object.assign(out, { x: +(s.xMark || 0).toFixed(2), strokes: s.xStroke || 0 });
    } else if (view.kind === "crate") {
      const C = CRATEV.crate,
        T = CRATEV.stamp;
      // the crate's side, big: wood slats, and its family stamp with his crayon (crate-stamp.js, the same look as on the
      // crate bed in the room)
      ctx.fillStyle = "#d9a35b";
      ctx.fillRect(C.x, C.y, C.w, C.h);
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#1e2430";
      ctx.strokeRect(C.x, C.y, C.w, C.h);
      ctx.strokeStyle = "#8b5a2b";
      ctx.lineWidth = 2;
      for (let i = 1; i < 4; i++) (ctx.beginPath(), ctx.moveTo(C.x, C.y + (C.h * i) / 4), ctx.lineTo(C.x + C.w, C.y + (C.h * i) / 4), ctx.stroke());
      const lit = Math.min(8, Math.floor((s.slide || 0) * 4) * 2);
      const stamp = drawFamilyStampAt(ctx, T.x, T.y, T.h, { crayon: 1 - (s.rub || 0), lit, click: s.click || 0 });
      // the brochure under it, its cake box's family name lined up below the stamp as it slides left; at the end its M
      // sits under the scraped patch
      const Cd = CRATEV.card,
        u = s.slide || 0,
        shift = (1 - u) * 160,
        bx = stamp.patch.x - 34 + shift;
      drawBrochure(ctx, bx, Cd.y + 40, Cd.w, Cd.h, false, 0, now);
      // the brochure's cake box, held up close under the stamp: the same fat red letters, his family's name, sliding
      // left until its first letter sits under the scraped patch and the rest under the crate's
      ctx.beginPath();
      ctx.roundRect(stamp.patch.x - 10 + shift, T.y + 18, stamp.end - stamp.patch.x + 20, T.h + 22, 6);
      ctx.fillStyle = "#f6e7c8";
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#1e2430";
      ctx.stroke();
      drawFatLetters(ctx, FAMILY.NAME, stamp.patch.x + shift, T.y + 18 + T.h + 8, T.h);
      // the M's two feet landing on the two faint marks: a soft click
      if ((s.click || 0) > 0) {
        ctx.save();
        ctx.globalAlpha = 1 - Math.abs(s.click - 0.5) * 2;
        ctx.strokeStyle = "#ffd23f";
        ctx.lineWidth = 3 * px;
        ctx.beginPath();
        ctx.arc(stamp.patch.x + stamp.patch.w / 2, T.y - T.h * 0.4, 30 + 20 * s.click, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      // his paw: holding the brochure, then his thumb rubbing the crayon ST out
      const rubbing = (s.click || 0) >= 1 && (s.rub || 0) < 1;
      drawFurArm(ctx, 300, D.H + 40, rubbing ? stamp.patch.x + stamp.patch.w / 2 + Math.sin(now * 20) * 8 : bx + Cd.w * 0.8, rubbing ? T.y - T.h * 0.3 : Cd.y + Cd.h * 0.6, 30);
      drawCloseX(ctx, CRATEV.close.x, CRATEV.close.y, CRATEV.close.r);
      Object.assign(out, { slide: +u.toFixed(2), lit, click: +(s.click || 0).toFixed(2), rub: +(s.rub || 0).toFixed(2), letters: stamp.letters.map((l) => l.c).join("") });
    } else if (view.kind === "back") {
      ctx.fillStyle = "#efe6d2";
      ctx.fillRect(10, 70, 380, 560);
      E().drawSquatch(ctx, BACKV.sq.x, BACKV.sq.y, BACKV.sq.k, { f: 1 });
      E().drawMopsOn(ctx, BACKV.mops.x, BACKV.mops.y, BACKV.mops.k, { f: 1 });
      drawCloseX(ctx, BACKV.close.x, BACKV.close.y, BACKV.close.r);
      Object.assign(out, { back: true });
    } else if (view.kind === "order" && s.ending) {
      // the don't-send ending: a wordless cutaway (he puts the copies back and sneaks home), years later, the cards
      const g = s.ending,
        t = now - g.at,
        Y = ORDERV.years;
      if (t < P.cutaway) {
        const u = t / P.cutaway;
        ctx.fillStyle = "#3b4256";
        ctx.fillRect(Y.x, Y.y, Y.w, Y.h);
        drawCounterBin(ctx, Y.x + 90, Y.y + 230, 2.2);
        E().drawSquatch(ctx, Y.x + 150 + u * 200, Y.y + 260, 1.6, { f: 1, walk: now * 6 });
        Object.assign(out, { ending: "cutaway" });
      } else {
        drawYearsLater(ctx, Y.x, Y.y, Y.w, Y.h, (c, x, y, k, o) => E().drawMopsOn(c, x, y, k, o), "STAY IN HERE!");
        const words = g.card >= 0 ? eveningWords(ENDING_CARDS[g.card]) : "";
        if (words) {
          ctx.fillStyle = "#1e2430";
          ctx.fillRect(10, ORDERV.card.y - 44, 380, 88);
          ctx.fillStyle = "#ffffff";
          ctx.font = "800 22px system-ui, -apple-system, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(words, 200, ORDERV.card.y);
        }
        g.card >= ENDING_CARDS.length - 1 && viewButton(ctx, ORDERV.goBack, eveningWords("button-go-back"), false);
        Object.assign(out, { ending: "years", card: words, goBack: g.card >= ENDING_CARDS.length - 1 });
      }
    } else if (view.kind === "order" && s.order) {
      const o = s.order,
        B = PAPERS.box;
      // the choice: two thought pictures above the papers, each with its button (gone once he has picked MARK · box)
      if (!o.chose) {
        for (const [id, C, word] of [["go", ORDERV.go, "button-mark"], ["stay", ORDERV.stay, "button-put-back"]]) {
          drawEveningThought(ctx, C.cx, C.cy, C.w, C.h, C.cx, C.cy + C.h / 2 + 4, 1);
          drawIdeaPicture(ctx, id, C.cx, C.cy, 110, (c, x, y, k, op) => E().drawMopsOn(c, x, y, k, op), now);
          viewButton(ctx, C.button, eveningWords(word), false);
        }
      }
      ctx.save();
      ctx.translate(ORDERV.papers.x, ORDERV.papers.y);
      const papers = drawPapers(ctx, { mark: o.mark, tear: o.tear });
      // the box gets the dashed gold outline once he has picked MARK · box, until his paw is on it
      o.chose && o.pressAt < 0 && dashedOutline(ctx, B.x - 8, B.y - 8, B.s + 16, B.s + 16, px, now);
      // his paw: under the finger, or resting; pressed into the box while marking; holding the yellow as it tears
      const rest = o.tear > 0 ? { x: 92, y: 520 + o.tear * 20 } : view.paw && o.chose ? { x: view.paw.x - ORDERV.papers.x, y: view.paw.y - ORDERV.papers.y } : { x: 230, y: 470 },
        pressing = o.pressAt >= 0 && o.mark < 1,
        paw = pressing ? { x: B.x + B.s / 2, y: B.y + B.s / 2 } : rest;
      drawFurArm(ctx, 260, D.H - ORDERV.papers.y + 40, paw.x, paw.y, 34);
      ctx.restore();
      Object.assign(out, { choose: !o.chose, mark: +o.mark.toFixed(2), tear: +o.tear.toFixed(2), paw, pen: papers.pen });
    }
    ctx.restore();
    view.drew = out;
  }
  /** The crayon card on the hallway's wall (ganitor.js HALLWAY_CRAYON's place): ME and MOPS, each with an arrow. */
  function drawCrayonCard(ctx) {
    const C = HALLWAY_CRAYON;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(C.x0, C.y0, C.w, C.h, 6);
    ctx.fillStyle = "#fffdf8";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#1e2430";
    ctx.stroke();
    ctx.font = `800 ${C.size - 2}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#1e2430";
    const words = [eveningWords("sign-me"), eveningWords("sign-mops")];
    words.forEach((t, k) => {
      const x = C.x0 + C.w * (k ? 0.7 : 0.22),
        y = C.y0 + 22;
      ctx.fillText(t, x, y);
      // the arrow down to the figure
      ctx.beginPath();
      ctx.moveTo(x, y + 14);
      ctx.lineTo(x, y + 46);
      ctx.moveTo(x - 6, y + 38);
      ctx.lineTo(x, y + 46);
      ctx.lineTo(x + 6, y + 38);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#3478f6";
      ctx.stroke();
    });
    ctx.restore();
    return words;
  }
  /** A big button inside a close-up (LIFT · photo): a white pill, the words, pressed in while held. */
  function viewButton(ctx, B, label, down) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(B.x, B.y + (down ? 3 : 0), B.w, B.h, B.h / 2);
    ctx.fillStyle = down ? "#ffd23f" : "#2bc48a";
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#1e2430";
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 20px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, B.x + B.w / 2, B.y + B.h / 2 + (down ? 3 : 0));
    ctx.restore();
  }
  /** Squatch's thought inside a close-up: a cloud with his words, its trail going down to him (the bottom left). */
  function viewThought(ctx, T, words, a) {
    drawEveningThought(ctx, T.x, T.y, T.w, T.h, 30, T.y + T.h / 2 + 60, a);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = "#1e2430";
    // (sized to fit inside the cloud with room to spare)
    ctx.font = "800 22px system-ui, -apple-system, sans-serif";
    const size = Math.min(22, Math.floor((22 * (T.w * 0.72)) / ctx.measureText(words).width));
    ctx.font = `800 ${size}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(words, T.x, T.y);
    ctx.restore();
  }
  /**
   * The game's one highlight in a close-up (Brian 2026-11-26): the goal outline's dashed gold line (outline.js OUTLINE:
   * its colour and dashes) just outside the thing, about 3 screen pixels wide whatever the close-up's size (`px` is one
   * screen pixel in its units), pulsing gently as the room's outlines do. No glow, ring or arrow.
   */
  function dashedOutline(ctx, x, y, w, h, px, t) {
    ctx.save();
    ctx.globalAlpha = 0.85 + 0.15 * Math.sin((t || 0) * 4);
    ctx.setLineDash([OUTLINE.dash * 1.4 * px, OUTLINE.dash * px]);
    ctx.lineWidth = 3 * px;
    ctx.strokeStyle = OUTLINE.color;
    ctx.strokeRect(x, y, w, h);
    ctx.restore();
  }
  /** Where to tap (screen pixels) to do what the open close-up asks next (tests and the kid robot). */
  function viewTargets() {
    const s = live();
    if (!view || !s || !view.w) return null;
    const D = designOf(view.kind),
      f = fitDesign(view.w, view.h, D.W, D.H),
      at = (p) => ({ x: f.x + p.x * f.k, y: f.y + p.y * f.k });
    if (view.kind === "gallery" && s.gallery)
      return { kind: "gallery", i: s.gallery.i, next: at(GALLERY.right), back: at(GALLERY.left), close: at(GALLERY.close), photo: at({ x: GALLERY.photo.x + GALLERY.photo.w / 2, y: GALLERY.photo.y + GALLERY.photo.h / 2 }), lift: at({ x: GALLERY.lift.x + GALLERY.lift.w / 2, y: GALLERY.lift.y + GALLERY.lift.h / 2 }), lifted: s.gallery.lifted, ready: E().time() - view.at > P.zoomIn };
    if (view.kind === "brochure" || view.kind === "back") return { kind: view.kind, close: at(designOf(view.kind).close), ready: E().time() - view.at > P.zoomIn };
    if (view.kind === "chart") {
      const C = CHARTV.chart,
        k = C.w / CHART.W;
      return { kind: "chart", cake: at({ x: C.x + (CHART.cell.x0 + CHART.tried * CHART.cell.step) * k, y: C.y + CHART.cell.y * k }), ready: E().time() - view.at > P.zoomIn };
    }
    if (view.kind === "crate") return { kind: "crate", card: at({ x: CRATEV.stamp.x + 120, y: CRATEV.card.y + 120 }), ready: E().time() - view.at > P.zoomIn };
    if (view.kind === "order") {
      const btn = (B) => at({ x: B.x + B.w / 2, y: B.y + B.h / 2 });
      return { kind: "order", choose: !!(s.order && !s.order.chose), mark: btn(ORDERV.go.button), putBack: btn(ORDERV.stay.button), box: at({ x: ORDERV.papers.x + PAPERS.box.x + PAPERS.box.s / 2, y: ORDERV.papers.y + PAPERS.box.y + PAPERS.box.s / 2 }), ending: s.ending ? (s.ending.card >= ENDING_CARDS.length - 1 ? "last" : "card") : "", tap: at({ x: 200, y: ORDERV.card.y }), goBack: btn(ORDERV.goBack), ready: E().time() - view.at > P.zoomIn };
    }
    return null;
  }

  // ---------- drawing ----------
  // The hall (beats 38 and 39, and the hall at night): the party's hall drawing with this beat's people.
  function hallView(s, ctx0) {
    const e = E(),
      t = e.time(),
      sq = e.pos("sq"),
      sizes = e.hallSizes(),
      adult = sizes.adult,
      k = sizes.squatch;
    const guests = [];
    const extra = [];
    const a = s.alarm;
    const at = (g) => (a && a.w.id === g.id ? a.w : (s.people && s.people[g.id]) || g);
    // the guests (beat 38a): grown-ups as the party draws them; the kid an approved guest picture drawn smaller
    for (const g of (s.guests || []).filter((q) => q.wait <= 0)) {
      const p = at(g);
      if (!g.kid) guests.push({ id: g.id, x: p.x, y: p.y });
      else extra.push({ y: p.y, f: () => bridge.guests.drawId(ctx0, g.id, p.x, p.y, adult * EV_BAR.kidK, t) });
    }
    const over = (id) => (id === "fur-alarm" ? 0 : bridge.guests.height(id, adult) + adult * 0.27);
    const marks = [];
    for (const q of questions(s)) {
      const id = q.id.replace(/^warn:/, ""),
        g = guests.find((x) => x.id === id);
      g && marks.push({ x: g.x + 26, y: g.y - over(id) + 10, mark: "?", size: Math.round(adult * 0.42), q });
    }
    const shout = a && (a.phase === "shout" || (a.phase === "run" && a.t < 0.5)) ? { x: a.w.x, y: a.w.y - over(a.w.id) - 12 } : null;
    a && a.phase === "shout" && marks.push({ x: a.w.x + 40, y: a.w.y - over(a.w.id) + 14, mark: "!", size: Math.round(adult * 0.635) });
    a && a.guards.forEach((g) => g.room === "hall" && g.sees && marks.push({ x: g.x, y: g.y - adult * 1.29, mark: "!", size: Math.round(adult * 0.635) }));
    // the crates from the lunch are still there
    extra.push({ y: LUNCH_PLACES.crate.box.y1, f: () => drawCrates(ctx0) });
    // 36b's cleaning robots, still mopping or rolling out
    const rk = adultPxFor("hall") / adultPxFor("hangar");
    for (const r of s.cleaners || []) extra.push({ y: r.y, f: () => drawCleaner(ctx0, r.x, r.y, r.f, rk, r.moving ? Math.abs(Math.sin(t * 14)) * 2 * rk : 0, 0) });
    // Mops: at the bar's front wiping it with his beard (it stops dead at "fizzy", his eyes wide), walking, or the
    // player's to move
    if (e.get("moPose") !== "hidden") {
      const mo = e.pos("mops"),
        moved = Math.hypot(mo.x - mopsWas.x, mo.y - mopsWas.y) > 0.2,
        mine = e.playing() === "mops",
        wiping = !mine && !moved && ["tostorm", "storm"].includes(s.step) && Math.hypot(mo.x - STORM.mops.x, mo.y - STORM.mops.y) < 2 && !e.current(),
        dx = wiping ? Math.sin(t * 5) * 4 : 0,
        mk = k * 1.15;
      mopsWas = { x: mo.x, y: mo.y };
      extra.push({ y: mo.y, f: () => e.drawMopsOn(ctx0, mo.x + dx, mo.y, mk, { f: mo.f || -1, walk: moved ? t * 9 : 0, eyes: s.mopsWide ? "wide" : "" }) });
      // the kid's pats on his head (wordless)
      s.pat >= 0 && extra.push({ y: 9998, f: () => drawPat(ctx0, mo.x + (mo.f || -1) * 17 * mk, mo.y - 40 * mk, s.pat, 30) });
      // the brochure Dad handed him, in his mouth
      s.brochure === "mops" && !view && extra.push({ y: mo.y + 1, f: () => drawBrochure(ctx0, mo.x + (mo.f || -1) * 26 * mk - 11, mo.y - 30 * mk, 22, 28, true) });
    }
    // the brochure: held up by Dad (its picture toward the player), passed over the bar by Mops, in Squatch's paw
    const dad = (s.guests || []).find((g) => g.role === "dad");
    const brochureAt = (x, y, w, h) => drawBrochure(ctx0, x - w / 2, y - h / 2, w, h, true);
    if (s.brochure === "up" && dad) extra.push({ y: 9998, f: () => brochureAt(dad.x, dad.y - over(dad.id) - 30, 60, 80) });
    if (s.brochure === "toss") {
      const mo = e.pos("mops"),
        u = Math.min(1, s.t0 / STORM.toss),
        x0 = mo.x + 20,
        y0 = mo.y - 30 * k,
        x = x0 + (sq.x - 14 * k - x0) * u,
        y = y0 + (sq.y - 34 * k - y0) * u - Math.sin(u * Math.PI) * 60;
      extra.push({ y: 9998, f: () => {
        ctx0.save();
        ctx0.translate(x, y);
        ctx0.rotate(u * Math.PI * 2);
        brochureAt(0, 0, 26, 34);
        ctx0.restore();
      } });
    }
    if (s.brochure === "paw" && s.pose === "stand" && !view) extra.push({ y: sq.y + 1, f: () => brochureAt(sq.x + (sq.f || -1) * 14 * k, sq.y - 34 * k, 22, 28) });
    // rolled up in the aisle behind the bar (no peeking eyes: Brian r5 5:07)
    s.pose === "hidden" && s.hideAt === "counter" && e.ball && extra.push({ y: sq.y, f: () => e.ball.drawOn(ctx0, sq.x, sq.y - 16 * (k / 1.65), k / 1.65) });
    s.pose === "ball" && e.ball && extra.push({ y: sq.y, f: () => e.ball.drawOn(ctx0, sq.x, sq.y - 16 * (k / 1.65), k / 1.65) });
    return {
      t,
      picture: hallPic,
      banner: false,
      lights: null,
      isfred: null,
      band: null,
      guests,
      bartender: null,
      guards: a ? a.guards.filter((g) => g.room === "hall").map((g) => ({ x: g.x, y: g.y, f: Math.cos(g.a) < 0 ? -1 : 1 })) : [],
      cones: coneList(s),
      allCones: true,
      noteCone: (c) => e.noteCone(c),
      unseen: !free(),
      // (Day 2's hall vent is off by day, as in the lunch sneak; on at night one, PLACEHOLDER: one vent rule everywhere)
      vent: NIGHT_STEPS.includes(s.step),
      tufts: (s.vent && s.vent.tufts ? s.vent.tufts : []).filter((tf) => tf.k >= 0).map((tf) => ({ x: tf.x0 + (HALL.vent.x - tf.x0) * tf.k * tf.k, y: tf.y0 + (HALL.vent.y - tf.y0) * tf.k * tf.k, s: 9 * (1 - tf.k * 0.6), rot: tf.k * 6 })),
      squatch: s.pose === "stand" ? { x: sq.x, y: sq.y, f: sq.f || -1, walk: e.walkPhase(), pose: "stand" } : { x: sq.x, y: sq.y, pose: "hidden" },
      eyes: null,
      marks,
      shout,
      alarm: !!a && a.phase !== "shout" && a.phase !== "run" && a.phase !== "calm",
      // under the people: Jupiter's storm in the big window and its red glow (38a), or the hall's night look (night one)
      floor: NIGHT_STEPS.includes(s.step)
        ? (ctx) => drawNightTint(ctx, "hall", hallPic, 1)
        : (ctx) => {
            if (s.storm >= 0) (drawJupiterStorm(ctx, s.storm, t), drawStormGlow(ctx, s.storm));
            for (const r of s.cleaners || []) drawStreak(ctx, r.streak);
            // HIDE · bar (36b without the bay): the game's one highlight round the aisle behind the bar
            s.step === "hide" && e.get("ctrl") && !e.current() && dashedOutline(ctx, EV_BAR.aisle.x0, EV_BAR.aisle.y0, EV_BAR.aisle.x1 - EV_BAR.aisle.x0, EV_BAR.aisle.y1 - EV_BAR.aisle.y0, 1, t);
          },
      extra,
    };
  }
  // The loading bay at night: the locked night picture, the robots and their cones, him, the papers, the alarm.
  function drawBay(ctx, s) {
    const e = E(),
      t = e.time(),
      sq = e.pos("sq"),
      k = sqScale("hangar"),
      hidden = hiddenNow(s);
    // (the bay is only ever shown at night here: its own locked night picture is its night look, night-look.js)
    if (bayPic && bayPic.complete && bayPic.naturalWidth) ctx.drawImage(bayPic, 0, 0, 960, 640);
    else ((ctx.fillStyle = "#7f8597"), ctx.fillRect(0, 0, 960, 640));
    noteNightPicture("hangar");
    // the big wall vent shows the same swirl as every vent while it sucks
    const sucking = s.suck >= 0 || !!s.postAlarm;
    sucking && drawVentSwirl(ctx, BAY_VENT.wall, t);
    bayDrew = { swirl: sucking };
    const a = s.alarm;
    a && a.phase !== "shout" && a.phase !== "run" && a.phase !== "calm" && drawAlarmFlash(ctx, EV_BAY.alarm, t);
    const cones = drawCones(ctx, coneList(s).map((c) => (c.catch === false ? { ...c, bold: false, always: true } : c)), sq, hidden || !free(), true, (c) => e.noteCone(c));
    // the two stuck-together copies Mops spat into the bin, sticking up out of it (until he takes them)
    if (s.step === "bin" && !s.papers) {
      const B = EV_BAY.bin.box;
      ctx.save();
      ctx.translate(B.x0 + 22, B.y0 + 6);
      ctx.rotate(-0.25);
      paper(ctx, 0, 0, "#ff9ec4", 20);
      ctx.restore();
      ctx.save();
      ctx.translate(B.x0 + 34, B.y0 + 10);
      ctx.rotate(0.3);
      paper(ctx, 0, 0, "#ffe27a", 14);
      ctx.restore();
    }
    // the crate under the big wall vent (a hiding place; PLACEHOLDER drawing)
    drawVentCrate(ctx);
    const people = [];
    const robotAt = (id, x, y) => (a && a.w.id === id ? { x: a.w.x, y: a.w.y } : { x, y });
    const nr = robotAt(EV_BAY.robot.id, EV_BAY.robot.x, EV_BAY.robot.y);
    people.push({ y: nr.y, f: () => robot(ctx, nr.x, nr.y, 1) });
    EV_BAY.parked.forEach((r) => people.push({ y: r.y, f: () => robot(ctx, r.x, r.y, 0) }));
    for (const g of a ? a.guards.filter((q) => q.room === "hangar") : []) people.push({ y: g.y, f: () => drawPerson(ctx, g.x, g.y, adultPxFor("hangar") * 1.02, LOOKS.guard, Math.cos(g.a) < 0 ? -1 : 1, t) });
    // him: standing (the room's Squatch, wide-eyed under the vent), rolled up, or his eyes in the plant
    if (s.pose === "stand") people.push({ y: sq.y, f: () => (e.drawSquatch(ctx, sq.x, sq.y, k, { f: sq.f || 1, walk: e.walkPhase(), eyes: s.pink === "flying" ? "wide" : undefined }), papersInPaw(ctx, s, sq, k, t)) });
    s.pose === "ball" && e.ball && people.push({ y: sq.y, f: () => e.ball.drawOn(ctx, sq.x, sq.y - 16 * (k / 1.65), k / 1.65) });
    drawOrder(people).forEach((p) => p.f());
    s.pose === "hidden" && s.hideAt === "plant" && e.drawEyes(ctx, EV_BAY.plant.eyes.x, EV_BAY.plant.eyes.y);
    s.pose === "hidden" && s.hideAt === "crate" && e.drawEyes(ctx, (BAY_CRATE.x0 + BAY_CRATE.x1) / 2, BAY_CRATE.y0 + 6);
    // the yellow copy going into the mailbox's slot
    if (s.step === "posted" && s.yellow === "mail" && s.t0 < 0.4) {
      const u = Math.min(1, s.t0 / 0.4);
      paper(ctx, sq.x + (EV_BAY.mail.box.x0 + 40 - sq.x) * u, sq.y - 40 * k + (EV_BAY.mail.box.y0 + 40 - sq.y + 40 * k) * u, "#ffe27a", 16 * (1 - u * 0.6));
    }
    // the pink sheet pulled into the big wall vent, fluttering
    if (s.suck >= 0) {
      const u = s.suck,
        x0 = s.hideAt === "crate" ? (BAY_CRATE.x0 + BAY_CRATE.x1) / 2 : sq.x + 14,
        y0 = s.hideAt === "crate" ? BAY_CRATE.y0 : sq.y - 46 * k,
        V = EV_BAY.vent.mouth,
        x = x0 + (V.x - x0) * u + Math.sin(u * 18) * 10 * (1 - u),
        y = y0 + (V.y - y0) * u;
      for (let i = 1; i <= 4; i++) {
        const q = Math.max(0, u - i * 0.07);
        ctx.strokeStyle = `rgba(255,143,184,${(0.8 - i * 0.15).toFixed(2)})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x0 + (V.x - x0) * q - 12, y0 + (V.y - y0) * q + 6);
        ctx.lineTo(x0 + (V.x - x0) * q + 6, y0 + (V.y - y0) * q - 6);
        ctx.stroke();
      }
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.sin(u * 16) * 0.5);
      paper(ctx, 0, 0, "#ff9ec4", 30 * (1 - u * 0.5));
      ctx.restore();
    }
    // his fur drifting into the floor vent
    for (const tf of (s.vent && s.vent.tufts) || []) {
      if (tf.k < 0) continue;
      const kk = tf.k * tf.k,
        V = BAY_VENT.floor;
      drawTuft(ctx, tf.x0 + (V.x - tf.x0) * kk + Math.sin(tf.k * 8) * 10 * (1 - tf.k), tf.y0 + (V.y - tf.y0) * kk, 9 * (1 - tf.k * 0.6), tf.k * 6);
    }
    const adult = adultPxFor("hangar");
    // "?" over a robot (or a guard) while its cone is on him and it is registering him
    for (const q of questions(s)) {
      const id = q.id.replace(/^warn:/, ""),
        w = id === EV_BAY.robot.id ? nr : EV_BAY.parked.find((p) => p.id === id);
      w && drawMark(ctx, w.x + 22, w.y - adult * 1.1, "?", Math.round(adult * 0.45), t, q);
    }
    for (const g of a ? a.guards : []) g.room === "hangar" && !g.sees && g.seeT > 0 && drawMark(ctx, g.x + 20, g.y - adult * 1.29, "?", Math.round(adult * 0.45), t, null);
    // "!" over a robot that sees him, and over guards who see him
    a && (a.phase === "shout" || a.phase === "run") && drawMark(ctx, a.w.x + 24, a.w.y - adult * 1.1, "!", Math.round(adult * 0.6), t, null);
    a && a.guards.forEach((g) => g.room === "hangar" && g.sees && drawMark(ctx, g.x, g.y - adult * 1.29, "!", Math.round(adult * 0.6), t, null));
    return cones;
  }
  // A station robot: the older program's drawing (handed over), dimmed and with its light off while it sleeps.
  function robot(ctx, x, y, lit) {
    const e = E();
    ctx.save();
    ctx.globalAlpha = 0.55 + 0.45 * lit;
    e.drawRobot && e.drawRobot(ctx, x, y);
    ctx.restore();
    if (lit < 1) {
      ctx.save();
      ctx.globalAlpha = 0.6 * (1 - lit);
      ctx.fillStyle = "#1e2430";
      ctx.beginPath();
      ctx.arc(x, y - 38 * 1.6, 4 * 1.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  function paper(ctx, x, y, color, size) {
    ctx.beginPath();
    ctx.roundRect(x - size / 2, y - size * 0.62, size, size * 1.24, 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#1e2430";
    ctx.stroke();
  }
  function papersInPaw(ctx, s, sq, k, t = 0) {
    const f = sq.f || 1,
      x = sq.x + f * 16 * k,
      y = sq.y - 26 * k;
    // near the big wall vent the pink sheet flutters toward it (its swirls pull loose paper)
    const V = EV_BAY.vent.mouth,
      d = Math.hypot(sq.x - V.x, sq.y - V.y),
      pull = d < P.flutterNear ? (1 - d / P.flutterNear) * 10 * (1 + Math.sin(t * 18)) : 0,
      px = x + ((V.x - x) / (d || 1)) * pull,
      py = y + ((V.y - y) / (d || 1)) * pull;
    if (s.papers === "both" || s.papers === "paw") (paper(ctx, x + f * 4, y + 4, "#ffe27a", 14 * k), paper(ctx, px, py, "#ff9ec4", 18 * k));
    if (s.papers === "pink") paper(ctx, px, py, "#ff9ec4", 18 * k);
    if (s.papers === "both" && s.order === null) drawPawPrint(ctx, x, y, 8 * k);
  }
  // The home room: the brochure (in his paw, held up), the evening light, Mops asleep, the night, him in bed.
  function drawHome(ctx, s) {
    const e = E(),
      t = e.time(),
      sq = e.pos("sq"),
      k = sqScale("closet");
    if (s.warm > 0 && !(s.dim > 0)) {
      ctx.save();
      ctx.globalAlpha = EVENING_LOOK.warmA * s.warm;
      ctx.fillStyle = EVENING_LOOK.warm;
      ctx.fillRect(-2000, -2000, 6000, 5000);
      ctx.restore();
    }
    const out = {};
    // his crate bed's family stamp is part of the home picture as the game draws it (crate-stamp.js, a layer over the
    // locked picture; his crayon goes once he has rubbed it out, crayonGone below); the crayon chart of kinds tried
    // above the bed, this week's X drawn once he has drawn it
    const onRoom = familyStampOnRoom();
    out.stamp = onRoom ? onRoom.text.replace(/[_ ]/g, "").length : 0;
    const Ch = HOME_ALONE.chart;
    drawEveningChart(ctx, Ch.x, Ch.y, Ch.w, Ch.h, s.chartX ? 1 : 0, true);
    // the brochure: in his paw, or held up high over his head for Mops to see
    const paw = sqPawAt(sq.x, sq.y, sq.f || 1, k);
    // the Guardians' little box: in his other paw, opening, or put down on the floor; this week's cake, bitten
    if (s.box === "paw" && e.get("sqPose") === "stand") drawGuardiansBox(ctx, sq.x - (sq.f || 1) * 16 * k, sq.y - 26 * k, k * 0.55, 0);
    if (s.box === "open" && e.get("sqPose") === "stand") drawGuardiansBox(ctx, paw.x, paw.y + 6, k * 0.7, Math.min(1, s.t0 / P.boxOpen), true);
    if (s.box === "floor") drawGuardiansBox(ctx, 620, 486, 0.9, 1, false);
    if (s.cake >= 0 && e.get("sqPose") === "stand") {
      drawWeekCake(ctx, paw.x, paw.y - 18, 10 * (k / 1.65), s.cake);
      // the silence where a fizz would be
      s.cake >= 1 && s.t0 > 0.4 && e.text("...", paw.x + 14, paw.y - 46, 26, "#1e2430", "center", 900);
      out.cake = s.cake;
    }
    if (s.brochure === "paw" && e.get("sqPose") === "stand") (drawBrochure(ctx, paw.x - 15, paw.y - 20, 30, 40, true), (out.inPaw = paw));
    if (s.brochure === "up" && e.get("sqPose") === "stand") {
      // held up high in front of him, big enough for Mops (and a kid on a phone) to see the couple on it
      const u = Math.min(1, s.t0 / 0.3),
        w = 30 + 34 * u,
        h = 40 + 46 * u,
        x = paw.x + (sq.f || 1) * 12 * u,
        y = paw.y - (paw.y - (sq.y - 40 * k)) * u;
      drawBrochure(ctx, x - w / 2, y - h / 2, w, h, true);
      out.held = { x, y, w, h };
    }
    const mopsK = mopsScale("closet");
    // the night: the one night look (night-look.js), the room under the tint, the people over it, lit
    if (s.dim > 0) out.night = drawNightTint(ctx, "closet", null, s.dim);
    const people = [];
    // him in bed (lying, the blanket), or up and about in the dark
    if (s.bed) {
      people.push({ y: 470, f: () => {
        drawBedtimeSquatch(ctx, s.bed, k, false);
        out.blanket = drawBedBlanket(ctx, s.bed.cover);
        out.bed = { x: Math.round(s.bed.x), y: Math.round(s.bed.y), a: +s.bed.a.toFixed(2) };
      } });
    } else if (s.dim > 0 && s.pose === "stand") {
      people.push({ y: sq.y, f: () => e.drawSquatch(ctx, sq.x, sq.y, k, { f: sq.f || 1, walk: e.walkPhase() }) });
      out.squatchLit = true;
    }
    // Mops's hearts float while he looks at him (none once he turns his back; one small one at the end)
    if (s.hearts > 0 && e.get("moPose") === "stand") {
      const mo = e.pos("mops"),
        n = s.hearts >= 1 ? 3 : 1;
      for (let i = 0; i < n; i++) {
        const u = (t * 0.6 + i / n) % 1;
        ctx.save();
        ctx.globalAlpha = Math.sin(u * Math.PI);
        drawHeartShape(ctx, mo.x - 10 + i * 12, mo.y - 52 * mopsK - u * 30, (s.hearts >= 1 ? 7 : 5) * (mopsK / 1.6));
        ctx.restore();
      }
      out.hearts = n;
    }
    // Mops asleep on his back on the floor, his head on his bucket (in front of anyone further back)
    if (s.mopsSleep) {
      const m = s.mopsSleep,
        at = mopsSleepAt(mopsK);
      people.push({ y: at.y, f: () => {
        const d = drawSleepingMops(ctx, (c, x, y, sc, o) => e.drawMopsOn(c, x, y, sc, { ...o, eyes: m.eyes > 0.6 || m.tip > 0 ? "closed" : "", headDrop: m.tip > 0 ? 0 : m.eyes * 4 }), at.x, at.y, mopsK, m.tip, m.roll - (m.wake || 0) * 0.35, t);
        out.mops = { tip: +m.tip.toFixed(2), roll: +m.roll.toFixed(2), head: { x: Math.round(d.head.x), y: Math.round(d.head.y) } };
      } });
    }
    drawOrder(people).forEach((q) => q.f());
    // the idea: wordless pictures in a thought bubble above his head in bed (thought-place.js: a gap, a trail)
    if (s.idea && s.bed) {
      const head = { x: BED_POSES.lie.x - 70, y: BED_POSES.lie.y - 40, w: 44, h: 40 },
        place = placeThought(head, { w: 170, h: 130 }),
        u = Math.min(1, (t - s.idea.at) / 0.25);
      drawEveningThought(ctx, place.cx, place.cy, place.w, place.h, place.to.x, place.to.y, u);
      ctx.save();
      ctx.globalAlpha = u;
      drawIdeaPicture(ctx, s.idea.id, place.cx, place.cy + 6, 100, (c, x, y, sc, o) => e.drawMopsOn(c, x, y, sc, o), t, s.idea.id === "form" ? 0.6 + 0.4 * Math.sin(t * 5) : 0);
      ctx.restore();
      out.idea = s.idea.id;
    }
    // the snores: "z z z" rising from Mops (the first night) or from him (back in bed)
    if (s.zzz >= 0) {
      // (over his head lying in bed: LIE turned a quarter, his head left of his feet)
      const mh = out.mops && out.mops.head,
        from = s.step === "sleep" || !mh ? { x: BED_POSES.lie.x - 30 * k + 30, y: BED_POSES.lie.y - 10 } : { x: mh.x - 10, y: mh.y - 40 },
        Z = BEDTIME_NIGHT.zzz;
      ctx.save();
      ctx.globalAlpha = Math.min(1, s.zzz * 4) * (1 - Math.max(0, (s.zzz - 0.7) / 0.3));
      e.text(eveningWords("mark-sleep"), from.x + 20 * s.zzz, from.y - 60 - Z.rise * s.zzz, Z.size, Z.color, "center", 900);
      ctx.restore();
      out.zzz = +s.zzz.toFixed(2);
    }
    return out;
  }

  return {
    start,
    startStorm,
    /** 36b (loading-bay.js): Mops's line as they walk in, and the HIDE · bar spot (its words, place and thing). */
    barLine: () => eveningWords("mops-behind-bar"),
    barChip: () => eveningWords("chip-hide"),
    barSpot() {
      const [verb, cap] = eveningWords("button-counter").split(" · ");
      return { verb, cap, x: EV_BAR.hide.x, y: EV_BAR.hide.y, r: EV_BAR.hide.r, thing: EV_BAR.aisle };
    },
    jump,
    /** The debug beats (?beat=evening:<beat>, ch1JumpBeat): BEAT_STEP's step for that beat. */
    jumpBeat(b) {
      BEAT_STEP[b] && jump(BEAT_STEP[b]);
    },
    /**
     * ↺ in a part where the player has no control (no step start was saved for it): back to the last step he did
     * control. True when it did (20-ch2.js reSec). In a step he controls, false: the step restart brings it back.
     */
    restart() {
      const s = live();
      if (!s) return false;
      // (a step he controls in a room that is not its own cannot be: back to its start)
      if (EVENING_STEPS.includes(s.step)) return STEP_ROOM[s.step] !== room() ? (jump(s.step), true) : false;
      const back = { walkin: "wall", gallery: "wall", tohall: "wall", tostorm: "hide", storm: "hide", window: "greet", pet: "greet", talk: "ask", read: "ask", leaving: "ask", pass: "gohome", homein: "box", xchart: "chart", slide: "crate", mars: "crate", evening: "show", fight: "show", fightend: "choose", asleep: "bed", idea: "bed", choosing: "bin", order: "bin", posted: "post", sleep: "tobed" }[s.step];
      return back ? (jump(back), true) : false;
    },
    /** True once he has rubbed his crayon out of the crate bed's stamp (39b): the home picture's stamp has none. */
    crayonGone() {
      const s = S();
      return !!s && s.stampST === 0;
    },
    /** True from beat 37 until beat 43 takes over. */
    active() {
      return !!live();
    },
    /** The loading bay at night has the ship docked (its locked night picture): its fur scanner's posts are solid. */
    docked() {
      return !!live() && room() === "hangar";
    },
    /** True while this beat draws the room: the hall and the loading bay in its steps there. */
    ownsRoom() {
      const s = live();
      return !!s && (room() === "hall" || room() === "hangar") && STEP_ROOM[s.step] === room();
    },
    /** The night at home (from lights out until he is back in bed): the music's cue is "bedtime" then (bridge.js). */
    nightNow() {
      const s = live();
      return !!s && room() === "closet" && s.dim > 0 && !E().get("ch1Sneak");
    },
    /** True while the one capture rule's alarm is on: no music then (bridge.js). */
    alarmOn() {
      const s = live();
      return !!(s && s.alarm);
    },
    alarmKey() {
      return live() || null;
    },
    tick,
    spots,
    tap() {
      return false;
    },
    drawRoom(ctx) {
      const s = live();
      if (!s || !this.ownsRoom()) return false;
      if (room() === "hall") {
        drew = { step: s.step, cones: drawHall(ctx, E(), bridge.guests, hallView(s, ctx)), cleaners: (s.cleaners || []).length, brochure: s.brochure, pat: s.pat >= 0, wide: !!s.mopsWide };
      }
      else drew = { step: s.step, cones: drawBay(ctx, s), ...bayDrew };
      return true;
    },
    /** Over the rooms the older program draws (the hallway and home): the robot, Mops asleep, the night. */
    draw(ctx) {
      const s = live(),
        e = E();
      if (!s) return;
      if (room() === "passage" && (s.robot || s.alarm)) {
        // the robot's cone goes where it looks (every robot shows its cone, rule 8), and during an alarm the guards'
        const sq = e.pos("sq"),
          t = e.time(),
          a = s.alarm,
          adult = adultPxFor("passage"),
          cones = drawCones(ctx, coneList(s), sq, hiddenNow(s) || !free(), true, (c) => e.noteCone(c));
        const r = a && a.w.id === "hallway-robot" ? a.w : s.robot;
        const people = [];
        r && people.push({ y: r.y, f: () => e.drawRobot && e.drawRobot(ctx, r.x, r.y) });
        for (const g of a ? a.guards.filter((q) => q.room === "passage") : []) people.push({ y: g.y, f: () => drawPerson(ctx, g.x, g.y, adult * 1.02, LOOKS.guard, Math.cos(g.a) < 0 ? -1 : 1, t) });
        s.pose === "ball" && e.ball && people.push({ y: sq.y, f: () => e.ball.drawOn(ctx, sq.x, sq.y - 16 * (sqScale("passage") / 1.65), sqScale("passage") / 1.65) });
        drawOrder(people).forEach((q) => q.f());
        // "?" over the robot while it registers him, "!" once it has
        r && questions(s).some((q) => q.id.replace(/^warn:/, "") === "hallway-robot") && drawMark(ctx, r.x + 22, r.y - adult * 1.1, "?", Math.round(adult * 0.45), t, questions(s).find((q) => q.id.replace(/^warn:/, "") === "hallway-robot"));
        a && (a.phase === "shout" || a.phase === "run") && r && drawMark(ctx, r.x + 24, r.y - adult * 1.1, "!", Math.round(adult * 0.6), t, null);
        a && a.guards.forEach((g) => g.room === "passage" && g.sees && drawMark(ctx, g.x, g.y - adult * 1.29, "!", Math.round(adult * 0.6), t, null));
        drew = { step: s.step, robot: r ? { x: Math.round(r.x), y: Math.round(r.y) } : null, robotCone: s.robot ? { a: +s.robot.a.toFixed(2) } : null, cones };
      } else if (room() === "passage") drew = { step: s.step };
      // night one in the hallway: its night look, then him again over it, lit
      if (room() === "passage" && NIGHT_STEPS.includes(s.step)) {
        drew.night = drawNightTint(ctx, "passage", null, 1);
        const sq = e.pos("sq");
        s.pose === "stand" && e.drawSquatch(ctx, sq.x, sq.y, sqScale("passage"), { f: sq.f || 1, walk: e.walkPhase() });
      }
      // the crayon drawing on the hallway's wall, once lifted: its tags as decided (ME and MOPS, each with an arrow)
      if (room() === "passage" && e.get("ch1Crayon")) (drew = drew || { step: s.step }).crayon = drawCrayonCard(ctx);
      if (room() === "closet" && STEP_ROOM[s.step] === "closet") drew = { step: s.step, ...drawHome(ctx, s) };
    },
    /** Where a speaker's bubble points: the robot in the hallway, the one in line, Squatch rolled up, the mailbox. */
    speakerAt(who) {
      const s = live(),
        e = E();
      if (!s) return null;
      if (who === "robot" && s.robot) return { x: s.robot.x, y: s.robot.y - 80 };
      const cl = who === "robot" && room() === "hall" ? (s.cleaners || []).find((r) => r.id === s.talker) : null;
      if (cl) return { x: cl.x, y: cl.y - 70 };
      if (who === "sleeping-mops" && s.mopsSleep) {
        const at = mopsSleepAt(mopsScale("closet"));
        return { x: at.x - 10, y: at.y - 70 };
      }
      // the family and the guest (38a, 38b): over each one's head
      const g = (s.guests || []).find((q) => q.role === who);
      if (g && room() === "hall") return { x: g.x, y: g.y - (g.kid ? e.hallSizes().adult * EV_BAR.kidK : bridge.guests.height(g.id, e.hallSizes().adult)) - 16 };
      if (who === "ups" && room() === "hangar") return { x: (EV_BAY.mail.box.x0 + EV_BAY.mail.box.x1) / 2, y: EV_BAY.mail.box.y0 + 20 };
      return null;
    },
    /** Feet nobody walks through: the hall's furniture (the crates stay) and Mops; the robots in the bay. */
    /**
     * What feet cannot walk through in the hall while this beat draws it. (The older program asks the beat that draws
     * the room in every room since the join: in the loading bay at night the bay's own furniture and extraSolids are
     * the walls, so the hall's counter and stools are not.)
     */
    solids() {
      const s = live();
      if (!s || room() !== "hall") return [];
      const e = E(),
        feet = (x, y) => ({ x0: x - 25, x1: x + 25, y0: y - 14, y1: y + 8, person: 1 });
      const out = [...LUNCH_SOLIDS];
      e.get("moPose") !== "hidden" && e.playing() !== "mops" && out.push(feet(e.pos("mops").x, e.pos("mops").y));
      for (const r of s.cleaners || []) out.push(feet(r.x, r.y));
      // everyone standing in the hall is solid too (the two in line, the family where they stand or back away to)
      for (const p of (s.guests || []).filter((f) => f.x < 940 && f.wait <= 0)) {
        const q = (s.alarm && s.alarm.w.id === p.id ? s.alarm.w : s.people && s.people[p.id]) || p;
        out.push(feet(q.x, q.y));
      }
      return out;
    },
    /** Extra feet in rooms the older program draws: Mops asleep on the floor at home; the robots in the bay. */
    extraSolids(r) {
      const s = live();
      if (!s) return [];
      if (r === "closet" && s.mopsSleep) return [mopsSleepBox(mopsScale("closet"))];
      if (r === "hangar" && STEP_ROOM[s.step] === "hangar") {
        const feet = (x, y) => ({ x0: x - 22, x1: x + 22, y0: y - 14, y1: y + 8, person: 1 });
        return [feet(EV_BAY.robot.x, EV_BAY.robot.y), ...EV_BAY.parked.map((q) => feet(q.x, q.y)), ...BAY_EXTRA];
      }
      return [];
    },
    bounds() {
      return room() === "hangar" ? BAY_BOUNDS : LUNCH_BOUNDS;
    },
    /** The open close-up's taps (tests and the kid robot), or null. */
    viewTargets,
    /** The close-up open now ("gallery", "brochure", "order"), or "" (tests). */
    viewOpen() {
      return view ? view.kind : "";
    },
    /**
     * Tests that step the game without drawing frames: does what the open close-up asks next, as a tap would (the
     * gallery's next photo, the brochure's X once it has zoomed in, the paw on the order's box). The words it did.
     */
    viewAct() {
      const s = live();
      if (!view || !s) return "";
      if (view.kind === "gallery" && s.gallery) {
        const g = s.gallery;
        // photo 4: lift it all the way first (as holding LIFT · photo for a second does), then on
        if (g.i === 3 && !g.lifted) return ((g.lift = 0.999), (g.holding = true), galleryTick(0.01), (g.holding = false), "LIFT · photo");
        return g.i >= 4 ? (galleryEnd(true), "past 5") : ((g.i += 1), (g.lift = 0), "next");
      }
      if (view.kind === "brochure" || view.kind === "back") return E().time() - view.at > P.zoomIn ? (closeView(), "X") : "";
      if (view.kind === "chart") return E().time() - view.at > P.zoomIn && s.xStroke < 2 ? ((s.xStroke = 2), (s.xMark = 1), "X") : "";
      if (view.kind === "crate") return E().time() - view.at > P.zoomIn && s.slide < 1 ? ((s.slide = 1), "slide") : "";
      if (view.kind === "order") {
        if (E().time() - view.at <= P.zoomIn || !s.order) return "";
        if (!s.order.chose) return (chooseMark(), "MARK · box");
        return s.order.pressAt < 0 ? (markOrder(), "paw") : "";
      }
      return "";
    },
    /** Tests: the places (evening-place.js). */
    place: Object.freeze({ HALLWAY: EV_HALLWAY, BAR: EV_BAR, HOME: EV_HOME, BAY: EV_BAY, BAY_FURNITURE, nightLook }),
    /** Tests: true when a cone holds Squatch standing where he is now (the game's own sight test). */
    seenNow() {
      const s = live();
      return !!s && s.pose === "stand" && coneList(s).some((c) => c.catch !== false && seesHere(c, E().pos("sq")));
    },
    /** Tests: the cones now (the game's own list). */
    cones() {
      const s = live();
      return s ? coneList(s) : [];
    },
    /** Tests: the state, what the last frame drew, the steps, the close-ups opened, what was heard. */
    debug() {
      const s = S();
      return { state: s ? JSON.parse(JSON.stringify(s)) : null, active: !!live(), drew, night: nightDrawn(), view: view ? { kind: view.kind, drew: view.drew || null } : null, steps: record.steps.slice(), cutIns: record.cutIns.slice(), lost: record.lost || 0, sounds: sound.asked(), snores: bsound.asked(), partySounds: psound.debug().played };
    },
  };

  /**
   * A jump (the debug link ?beat=evening:<beat>, ch1JumpBeat 37 to 42, tests, ↺ in a part with no saved start):
   * straight to one of the player's steps, with everything before it done.
   */
  function jump(step) {
    const e = E();
    if (!EVENING_STEPS.includes(step)) return;
    closeView();
    e.set("ctrl", false);
    const i = EVENING_STEPS.indexOf(step),
      after = (name) => i > EVENING_STEPS.indexOf(name);
    e.set(
      "ch1Evening",
      fresh({
        galleryDone: step === "dodge" || step === "past",
        storm: STEP_ROOM[step] === "hall" && !NIGHT_STEPS.includes(step) ? 1 : -1,
        brochure: after("ask") ? (after("show") ? "home" : "paw") : "",
        dim: after("bed") ? 1 : 0,
        warm: after("crate") ? 1 : 0,
        stampST: after("crate") ? 0 : 1, // (his crayon in the stamp: rubbed out at the crate, 39b)
        mopsSleep: after("bed") ? { tip: 1, roll: 1, eyes: 1 } : null,
        papers: step === "post" ? "both" : after("post") ? "" : "",
        pink: after("post") ? "vent" : "",
        yellow: after("post") ? "mail" : "",
      }),
    );
    // (the record of what he has done is only what comes before this step: a jump back forgets what came after)
    e.set("ch1Crayon", after("wall"));
    e.set("ch1Mailed", after("post") ? 1 : 0);
    e.set("ch1PinkSucked", after("post") ? 1 : 0);
    e.set("ch1Brochure", after("ask"));
    after("bin") && (e.set("ch1Paw", 1), e.set("ch1Signed", 1));
    after("post") && (e.set("ch1Mailed", 1), e.set("ch1PinkSucked", 1));
    const s = S();
    e.set("sqPose", "stand");
    const r = STEP_ROOM[step];
    e.enterRoom(r, "QB");
    r === "hangar" && e.set("ch1D", true);
    const at = {
      wall: EV_HALLWAY.stop,
      dodge: EV_HALLWAY.stop,
      past: EV_HALLWAY.stop,
      hide: EV_BAR.sq,
      greet: EV_BAR.hidden,
      ask: EV_BAR.hidden,
      gohome: STORM.grab,
      box: EV_HOME.stop,
      bite: EV_HOME.stop,
      chart: EV_HOME.stop,
      crate: EV_HOME.stop,
      choose: EV_HOME.stop,
      show: EV_HOME.stop,
      bed: { x: 560, y: 470 },
      out: EV_HOME.up,
      nighthall: { x: EV_BAR.home.x, y: 556 },
      nightway: { x: 110, y: EV_HALLWAY.left.y + 20 },
      bin: EV_BAY.stop,
      post: EV_BAY.bin,
      back: EV_BAY.underVent,
      backway: { x: 850, y: EV_HALLWAY.right.y + 20 },
      backhall: LUNCH_PLACES.door.stand,
      tobed: { x: 800, y: 470 },
    }[step];
    e.place("sq", at.x, at.y);
    e.face("sq", -1);
    // Mops: waiting at the hallway's end, behind the counter, at home, or asleep on the floor
    const mops = { wall: EV_HALLWAY.mops, dodge: EV_HALLWAY.mops, past: EV_HALLWAY.mops, hide: STORM.mops, greet: STORM.mops, ask: STORM.mops, show: EV_HOME.mops, choose: EV_HOME.mops, bed: EV_HOME.mops }[step];
    // 39b and 40 at home: the box, the cake, the chart's X, the stamp's ST, the light, Mops's hearts
    if (["box", "bite", "chart", "crate"].includes(step)) ((s.warm = 0.4), (s.box = { box: "paw", bite: "open", chart: "floor", crate: "floor" }[step]));
    step === "bite" && ((s.cake = 0), (s.t0 = P.boxOpen));
    (after("chart") || step === "crate") && (s.chartX = true);
    after("crate") && ((s.stampST = 0), (s.box = s.box || "floor"));
    (step === "show" || step === "choose") && (s.hearts = 1);
    step === "bed" && ((s.hearts = 0.4), (s.turned = true));
    e.set("moPose", mops ? "stand" : "hidden");
    mops ? (e.place("mops", mops.x, mops.y), e.face("mops", step === "wall" || step === "dodge" || step === "past" ? 1 : -1)) : e.place("mops", -400, 0);
    // the family: at the bar (greet), a few steps away, turned to go (ask); the other guest at the window
    const guestsWhere = (to) => ["dad", "mom", "kid", "guest"].map((role) => {
      const at = role === "guest" ? STORM.window.guest : STORM[to][role];
      return { role, id: STORM.ids[role], x: at.x, y: at.y, a: role === "guest" ? -Math.PI / 2 : Math.atan2(STORM.mops.y - at.y, STORM.mops.x - at.x), look: role !== "guest", kid: role === "kid", to: role === "guest" ? "window" : to, wayTo: role === "guest" ? "window" : to, way: [], wait: 0 };
    });
    if (step === "greet") s.guests = guestsWhere("bar");
    if (step === "ask") s.guests = guestsWhere("leave");
    if (step === "dodge") s.robot = { x: EV_HALLWAY.robotOut.x, y: EV_HALLWAY.robotOut.y, a: 0, leg: 0, wait: P.robotWait, beeped: false };
    if (step === "greet" || step === "ask") ((s.pose = "hidden"), (s.hideAt = "counter"));
    // who the player is: Mops while the family is at the bar, Squatch everywhere else (no card: a jump announces nothing)
    e.playAs(step === "greet" || step === "ask" ? "mops" : "squatch");
    s.step = step;
    record.steps.push(step);
    setPose(s.pose);
    control({ wall: "chip-go-on", dodge: "chip-roll", past: "chip-to-hall", hide: "chip-hide", greet: "chip-greet", ask: "chip-ask", gohome: "chip-home", box: "chip-box", bite: "chip-bite", chart: "chip-chart", crate: "chip-crate", choose: "", show: "chip-show", bed: "chip-bed", out: "chip-out", nighthall: "chip-bin", nightway: "chip-bin", bin: "chip-bin", post: "chip-post", back: "chip-sneak-home", backway: "chip-sneak-home", backhall: "chip-sneak-home", tobed: "chip-bed" }[step]);
  }
}
