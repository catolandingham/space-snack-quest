/**
 * The evening of Day 2, Chapter 1 beats 37 to 42 (docs/CH1-STORY-WALKTHROUGH.md, with the newer decisions of
 * 2026-11-22 to 2026-11-26 where they differ): the Employee of the Month wall, the pancake brochure, "Are those other
 * Sasquatches?", the Mars talk, lights out, and night one's paw order. It follows beat 36 (Mops walks him home past
 * the robots: start()) and hands over to beat 43 ("Six days later") as it is today (14-ch1-day2.js ch1SixDays).
 * What the player sees, step by step (every word from evening-lines.js, every place and number from evening-place.js,
 * every new drawing from evening-art.js; steps the player controls are marked *):
 *   walkin   the hallway, wordless: they walk in from the loading bay's end; Mops walks on to the hall's end and waits.
 * * wall     LOOK · photos under the photo wall (optional: no outline); the hall's doorway is outlined. The gallery
 *            (full screen): 5 photos a visit, arrows under the photo and an X always there; photo #4 hangs crooked,
 *            and lifting it shows Squatch's crayon drawing, which stays on the wall. Past photo 5 the gallery closes:
 *   robot    a robot rolls through the hallway, Squatch rolls up into the L2 ball, "BEEP BEEP", it rolls on out.
 *   tohall   walking into the doorway: both walk into the hall at the snack counter's top end; Mops stands by the stools.
 *   line     two people in line at the counter's front: "I swear we had more Moon Pies..." (overheard, the ear); they
 *            leave. A family appears in the hallway doorway reading a brochure; Mops: "Quick, hide."
 * * hide     HIDE · counter: into the aisle behind the counter, rolled up. The family looks up from the brochure after
 *            a few seconds: seen in the open, the one capture rule (FUR!, the alarm, guards, hide, "They lost you.").
 *   watch    hidden, he watches the family walk round to the counter's front, a wordless picture bubble (pancakes, Mars),
 *            the brochure put down on the counter, and the family leaving without it.
 * * brochure GRAB · brochure: the close-up (full screen): a big furry Sasquatch couple behind a pancake counter, Mars in
 *            the window. X closes it. "Are those other Sasquatches?" / "I need to get back to work, we'll talk about it
 *            tonight." Mops goes back to work.
 * * gohome   the home doorway is outlined (the goal words only if he stalls); walking into it takes him home.
 *   evening  home: the light warms to evening, Mops comes home.
 * * show     SHOW · brochure (Mops glows): he holds it up, no words; Mops: "Didn't you hear what the manager said?..."
 * * bed      SLEEP · bed (the bed outlined).
 *   asleep   wordless: he climbs in and lies down; the light goes down; Mops dozes off standing, goes stiff, tips over
 *            like a fainting goat, rolls onto his back with his four feet in the air, and snores (z z z). Squatch
 *            sits up and slips out of bed.
 * * out, nighthall, nightway   night one: out the door, across the hall, along the hallway (each doorway outlined).
 * * bin      the loading bay at night: the night robot looks down 2 s and up at the back wall 4 s (R64). GRAB · copies.
 *   order    the close-up: his paw follows the finger; MARK · order: a paw print presses into the box on the pink
 *            sheet and through onto the yellow copy, which he tears off.
 * * post     POST · mailbox (in the mail room): "Mail scanned. Pawature accepted." Then, wordless and with no control:
 *   robots   the two robots parked in the mail room wake and roll out, he runs to hide under the big wall vent, and the
 *            vent pulls the pink sheet out of his paw.
 * * back, backway, backhall, tobed   he sneaks home past the robots (each doorway outlined) and SLEEP · bed.
 *   sleep    wordless: he lies down, z z z, and beat 43 starts.
 * Seen in the bay: the robot shows "!" and runs to the FUR alarm on the bay's wall (the one capture rule, Call 17).
 * Its progress lives in the game-state field ch1Evening, and ch1Step is "ev-<step>" at each step the player
 * controls, so the step restart (↺) brings back the step he is on; ↺ in a step he does not control goes back to the
 * last one he did (restart()).
 */
import { HALLWAY, BAR, FAMILY, HOME, BAY, BAY_FURNITURE, BAY_BOUNDS, BAY_SEARCH, EVENING_PACE as P, EVENING_LOOK, nightLook } from "./evening-place.js";
import { eveningWords } from "./evening-lines.js";
import { drawPhoto, drawCrayonDrawing, drawBrochure, drawPictureBubble, drawPapers, drawPawPrint, drawFurArm, drawSleepingMops, drawPlaque, drawCutInBack, drawCloseX, drawArrow, fitDesign, PAPERS, PHOTO_POOL, drawHeartShape } from "./evening-art.js";
import { HALL, HALL_PICTURE } from "./party-hall.js";
import { LUNCH_SOLIDS, LUNCH_BOUNDS, LUNCH_PLACES } from "./lunch-sneak-place.js";
import { drawCrates, drawNextGlow, sqPawAt } from "./lunch-sneak-art.js";
import { coneFrom, coneSees, drawCones, lookAt, SEEN_TOO_LONG_SECONDS } from "./party-watch.js";
import { startAlarm, tickAlarm, guardCones, addAlarmPlace, ALARM, GUARD_FEET } from "./party-alarm.js";
import { drawHall, drawOrder } from "./party-draw.js";
import { drawPerson, LOOKS, drawMark, drawAlarmFlash } from "./party-art.js";
import { partyLine } from "./party-lines.js";
import { tickQuestions, questions } from "./party-question.js";
import { openFullScreen, closeFullScreen } from "./fullscreen.js";
import { createPartySound } from "./party-sound.js";
import { createHomeMorningSound, HOME_MORNING_SOUND } from "./home-morning-sound.js";
import { createBedtimeSound } from "./bedtime-story-sound.js";
import { drawBedtimeSquatch, drawBedBlanket, BED_POSES, BEDTIME_NIGHT } from "./bedtime-story.js";
import { footfall } from "./footfalls.js";
import { adultPxFor } from "./room-sizes.js";

export const EVENING_ID = "ch1-evening";
/** The steps the player controls (ch1Step "ev-<step>"), in order. */
export const EVENING_STEPS = Object.freeze(["wall", "hide", "brochure", "gohome", "show", "bed", "out", "nighthall", "nightway", "bin", "post", "back", "backway", "backhall", "tobed"]);
/** Which room each step is in (the step restart and jump() put him there). */
export const STEP_ROOM = Object.freeze({
  walkin: "passage", wall: "passage", gallery: "passage", robot: "passage",
  tohall: "hall", line: "hall", hide: "hall", watch: "hall", brochure: "hall", read: "hall", gohome: "hall",
  evening: "closet", show: "closet", mars: "closet", bed: "closet", asleep: "closet", out: "closet",
  nighthall: "hall", nightway: "passage",
  bin: "hangar", order: "hangar", post: "hangar", robots: "hangar", back: "hangar",
  backway: "passage", backhall: "hall", tobed: "closet", sleep: "closet",
});
/** The debug beats (?beat=evening:37 and ch1JumpBeat): the step each opens at. */
export const BEAT_STEP = Object.freeze({ 37: "wall", 38: "hide", 39: "gohome", 40: "show", 41: "bed", 42: "out", 142: "bin", 143: "post", 144: "back" });
// The loading bay's alarm place (party-alarm.js): the robot runs to the FUR alarm by the door, guards come in there.
addAlarmPlace("bay", {
  room: "hangar",
  run: BAY.alarmRun,
  guardIn: BAY.guardIn,
  search: BAY_SEARCH,
  around: BAY_FURNITURE.map((b) => ({ x0: b.x0 - GUARD_FEET.side, x1: b.x1 + GUARD_FEET.side, y0: b.y0 - GUARD_FEET.down, y1: b.y1 + GUARD_FEET.up })),
  floor: { x0: 20, x1: 920, y0: 310, y1: 600 },
});
const BAY_PICTURE = "docs/locked-rooms/delivery-room-empty-night-v2.png";
const NIGHT_STEPS = ["out", "nighthall", "nightway", "bin", "order", "post", "robots", "back", "backway", "backhall", "tobed", "sleep"];

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
  const live = () => {
    const s = S();
    return s && s.step && s.step !== "done" ? s : null;
  };
  let ff = {},
    pads = 0,
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
    line: null,
    family: null,
    familyT: 0,
    brochure: "",
    bubble: -1,
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
    woke: null,
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
  /** Beat 36's end hands over here: Mops and Squatch come into the hallway from the loading bay. */
  function start() {
    const e = E();
    ff = {};
    e.set("ch1Evening", fresh());
    busy();
    e.set("ch1Sneak", false);
    e.enterRoom("passage", "QB");
    e.set("moPose", "stand");
    e.set("sqPose", "stand");
    e.place("sq", HALLWAY.in.x, HALLWAY.in.y);
    e.place("mops", HALLWAY.in.x + 30, HALLWAY.in.y - 20);
    e.face("sq", -1);
    e.face("mops", -1);
    go("walkin");
    e.queue([
      e.until((dt) => {
        e.trail();
        e.moWalking(true);
        const a = e.step("mops", HALLWAY.mops.x, HALLWAY.mops.y, P.mopsWalk, dt || 0);
        return e.step("sq", HALLWAY.stop.x, HALLWAY.stop.y, P.walk, dt || 0) && a;
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
    s.gallery = { i: 0, lifted: -1, at: E().time() };
    s.looked = true;
    go("gallery");
    sound.effect("grab");
    openView("gallery");
  }
  function galleryEnd(robot) {
    const s = S(),
      e = E();
    closeView();
    s.gallery = null;
    if (!robot) return (go("wall"), control("chip-go-on"));
    // past photo 5: a robot rolls through the hallway; Squatch rolls up as it comes (the L2 ball, DECISIONS C3)
    s.galleryDone = true;
    s.robot = { x: HALLWAY.robotIn.x, y: HALLWAY.robotIn.y - 230, k: 0 };
    go("robot");
    const leg = (x, y) => e.until((dt) => moveRobot(x, y, dt));
    e.queue([
      leg(820, 520),
      e.run(() => (setPose("ball"), sound.effect("hide"))),
      leg(Math.max(240, e.pos("sq").x + 210), 520),
      e.say("robot", eveningWords("robot-beep")),
      leg(150, 520),
      leg(HALLWAY.robotOut.x, 330),
      e.run(() => ((S().robot = null), setPose("stand"))),
      timer(P.ballOut),
      e.run(() => (go("wall"), control("chip-go-on"))),
    ]);
  }
  function moveRobot(x, y, dt) {
    const r = S().robot,
      d = Math.hypot(x - r.x, y - r.y),
      k = Math.min(d, P.robotRoll * dt);
    if (d < 0.5) return true;
    r.x += ((x - r.x) / d) * k;
    r.y += ((y - r.y) / d) * k;
    return false;
  }
  function toHall() {
    const e = E();
    busy();
    go("tohall");
    e.walkOff();
    e.queue([
      e.until((dt) => {
        e.trail();
        e.moWalking(true);
        const a = e.step("mops", 8, HALLWAY.left.y - 20, P.mopsWalk, dt || 0);
        return e.step("sq", 8, HALLWAY.left.y, P.walk, dt || 0) && a;
      }),
      e.run(() => {
        e.moWalking(false);
        e.enterRoom("hall", "QB");
        e.place("mops", BAR.in.x - 30, BAR.in.y);
        e.place("sq", BAR.in.x, BAR.in.y + 6);
        e.face("sq", -1);
        e.face("mops", -1);
        S().line = BAR.line.map((p) => ({ ...p }));
      }),
      e.until((dt) => {
        e.trail();
        e.moWalking(true);
        const a = e.step("mops", BAR.mops.x, BAR.mops.y, P.mopsWalk, dt || 0);
        return e.step("sq", BAR.sq.x, BAR.sq.y, P.hallWalk, dt || 0) && a;
      }),
      e.run(() => {
        e.moWalking(false);
        e.still("mops");
        e.face("mops", -1);
        e.face("sq", -1);
        go("line");
      }),
      ...lineSteps(),
    ]);
  }

  // ---------- beat 38: the snack bar ----------
  function lineSteps() {
    const e = E();
    return [
      timer(0.6),
      // overheard (the ear icon): the first of the two in line, to the other
      e.say("tourist", eveningWords("tourist-moonpies"), "say", true),
      // they leave, through the home doorway
      e.until((dt) => {
        let done = true;
        for (const p of S().line) {
          const d = Math.hypot(BAR.out.x - p.x, BAR.out.y - p.y),
            k = Math.min(d, P.leave * (dt || 0));
          d > 1 && ((p.x += ((BAR.out.x - p.x) / d) * k), (p.y += ((BAR.out.y - p.y) / d) * k), (p.a = Math.atan2(BAR.out.y - p.y, BAR.out.x - p.x)), (done = false));
        }
        return done;
      }),
      e.run(() => {
        const s = S();
        s.line = null;
        // the family comes to the hallway doorway, reading their brochure
        s.family = BAR.family.map((f) => ({ id: f.id, x: f.door.x + 90, y: f.door.y, a: BAR.read, kid: f.kid }));
        s.familyT = 0;
        s.brochure = "family";
      }),
      e.until((dt) => {
        let done = true;
        S().family.forEach((f, i) => {
          const to = BAR.family[i].door,
            d = Math.abs(to.x - f.x);
          d > 1 && ((f.x -= Math.min(d, FAMILY.walk * (dt || 0))), (done = false));
        });
        return done;
      }),
      e.say("mops", eveningWords("mops-hide")),
      e.run(() => {
        S().familyT = 0;
        go("hide");
        control("chip-hide");
      }),
    ];
  }
  /** HIDE · counter: down into the aisle behind the counter, rolled up. */
  function hideCounter() {
    const e = E(),
      s = S();
    s.alarm && (s.alarm.spotted = s.alarm.guards.some((g) => g.sees));
    busy();
    s.hideAt = "counter";
    e.queue([
      // into the aisle at its top (round the counter's corner), then down it
      e.until((dt) => e.step("sq", BAR.aisleTop.x, BAR.aisleTop.y, P.hallWalk * 1.3, dt || 0)),
      e.until((dt) => e.step("sq", BAR.hidden.x, BAR.hidden.y, P.hallWalk * 1.3, dt || 0)),
      e.run(() => {
        setPose("hidden");
        sound.effect("hide");
        e.still("sq");
        if (S().alarm) return void control("");
        watchFamily();
      }),
    ]);
  }
  /** Hidden: the family walks round to the counter's front, talks in pictures, leaves the brochure and goes. */
  function watchFamily() {
    const e = E(),
      s = S();
    go("watch");
    busy();
    s.familyT = 999; // they look up and on
    const walk = (to) =>
      e.until((dt) => {
        let done = true;
        S().family.forEach((f, i) => {
          const T = to(i),
            d = Math.hypot(T.x - f.x, T.y - f.y),
            k = Math.min(d, FAMILY.walk * (dt || 0));
          d > 1 && ((f.x += ((T.x - f.x) / d) * k), (f.y += ((T.y - f.y) / d) * k), (f.a = Math.atan2(T.y - f.y, T.x - f.x)), (done = false));
        });
        return done;
      });
    e.queue([
      walk(() => BAR.via),
      walk((i) => BAR.family[i].at),
      e.run(() => {
        S().family.forEach((f) => (f.a = 0));
        S().bubble = 0;
      }),
      // the wordless picture bubble over the grown-up with the brochure (pancakes, Mars)
      e.until((dt) => ((S().bubble += dt || 0), S().bubble >= P.pictureBubble)),
      // the grown-up puts the brochure down on the counter's ledge (it slides from the hand to the ledge)
      e.run(() => ((S().bubble = -1), (S().brochure = "putting"), (S().t0 = 0), sound.effect("grab"))),
      timer(P.putDown),
      e.run(() => (S().brochure = "counter")),
      resetT(),
      walk(() => BAR.out),
      e.run(() => {
        S().family = null;
        go("brochure");
        control("chip-brochure");
      }),
    ]);
  }
  function grabBrochure() {
    const s = S();
    busy();
    setPose("stand");
    E().place("sq", BAR.grab.x, BAR.grab.y);
    E().face("sq", -1);
    s.brochure = "paw";
    E().set("ch1Brochure", true);
    sound.effect("grab");
    go("read");
    openView("brochure");
  }
  function brochureClosed() {
    const e = E();
    closeView();
    e.queue([
      e.say("sq", eveningWords("sq-other")),
      e.say("mops", eveningWords("mops-work")),
      // Mops goes back to work: up the aisle and out through the hallway doorway
      walkTo("mops", BAR.in.x - 10, BAR.in.y + 4, P.mopsWalk),
      walkTo("mops", 1000, BAR.in.y, P.mopsWalk),
      e.run(() => {
        e.moWalking(false);
        e.set("moPose", "hidden");
        e.place("mops", -400, 0);
        go("gohome");
        control("chip-home");
      }),
    ]);
  }

  // ---------- beats 39 and 40: home ----------
  function toHome(next) {
    const e = E();
    busy();
    e.walkOff();
    e.queue([
      e.until((dt) => (e.trail(), e.step("sq", BAR.home.x, 640, P.hallWalk, dt || 0))),
      e.run(() => {
        e.enterRoom("closet", "QB");
        e.place("sq", HOME.in.x, HOME.in.y);
        e.face("sq", -1);
        next();
      }),
    ]);
  }
  function eveningHome() {
    const e = E(),
      s = S();
    go("evening");
    e.set("moPose", "hidden");
    e.place("mops", HOME.mopsIn.x, HOME.mopsIn.y);
    e.queue([
      walkTo("sq", HOME.stop.x, HOME.stop.y, P.walk),
      // the room warms to evening; Mops comes home through the doorway
      e.until((dt) => ((S().warm = Math.min(1, S().warm + (dt || 0) / P.evening)), S().warm >= 1)),
      e.run(() => (e.set("moPose", "stand"), e.face("mops", -1), sound.morning("door"))),
      walkTo("mops", HOME.mops.x, HOME.mops.y, P.mopsWalk),
      e.run(() => {
        e.moWalking(false);
        e.still("mops");
        e.face("mops", -1);
        e.face("sq", 1);
        go("show");
        control("chip-show");
      }),
    ]);
    s.warm = 0;
  }
  function showBrochure() {
    const e = E();
    busy();
    e.face("sq", 1);
    go("mars");
    S().brochure = "up";
    sound.effect("grab");
    e.queue([
      timer(P.hold),
      e.say("mops", eveningWords("mops-mars")),
      e.run(() => {
        S().brochure = "home";
        go("bed");
        control("chip-bed");
      }),
    ]);
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
          const w = [HOME.sleepVia, HOME.sleep][s.mopsLeg];
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
        // night one: Mops snores on, and Squatch, still in bed, is the kid's to move: the doorway is outlined, and
        // his first step (getUp) gets him out of bed
        e.run(() => {
          const b = S().bed;
          S().zzz = -1;
          b.eyes = "";
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
        b.x = k < 0.5 ? lie.x + (sit.x - lie.x) * q * 2 : sit.x + (HOME.up.x - sit.x) * (q - 0.5) * 2;
        b.y = k < 0.5 ? lie.y + (sit.y - lie.y) * q * 2 : sit.y + (HOME.up.y - sit.y) * (q - 0.5) * 2 - Math.sin((q - 0.5) * 2 * Math.PI) * 24;
        b.cover = Math.max(0, 1 - q * 2);
        b.feet = k > 0.5;
        return k >= 1;
      }),
      e.run(() => {
        S().bed = null;
        e.place("sq", HOME.up.x, HOME.up.y);
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
    out: () => throughDoor({ x: 950, y: 440 }, () => intoRoom("hall", "QB", { x: BAR.home.x, y: 640 }, { x: BAR.home.x, y: 550 }, "chip-bin", { step: "nighthall", speed: P.hallWalk })),
    // the hall -> the hallway (left end)
    nighthall: () => throughDoor({ x: 952, y: 312 }, () => intoRoom("passage", "QB", { x: 8, y: HALLWAY.left.y }, { x: 110, y: HALLWAY.left.y + 20 }, "chip-bin", { step: "nightway" })),
    // the hallway -> the loading bay
    nightway: () => throughDoor({ x: 952, y: HALLWAY.right.y }, () => intoRoom("hangar", "QB", BAY.in, BAY.stop, "chip-bin", { step: "bin" })),
    // and back: the bay -> the hallway (right end) -> the hall -> home
    back: () => throughDoor({ x: 20, y: BAY.in.y }, () => intoRoom("passage", "QB", { x: 952, y: HALLWAY.right.y }, { x: 850, y: HALLWAY.right.y + 20 }, "chip-sneak-home", { step: "backway" })),
    backway: () => throughDoor({ x: 8, y: HALLWAY.left.y }, () => intoRoom("hall", "QB", { x: 952, y: 312 }, LUNCH_PLACES.door.stand, "chip-sneak-home", { step: "backhall", speed: P.hallWalk })),
    backhall: () => throughDoor({ x: BAR.home.x, y: 640 }, () => intoRoom("closet", "QB", HOME.in, { x: 800, y: 470 }, "chip-bed", { step: "tobed" })),
  };
  function grabCopies() {
    const s = S();
    busy();
    s.papers = "paw";
    s.order = { mark: 0, tear: 0, paw: null, pressAt: -1, tearAt: -1 };
    E().paper && E().paper("paws");
    sound.effect("grab");
    go("order");
    openView("order");
  }
  // In the close-up: his paw pressed on the box.
  function markOrder() {
    const o = S().order;
    if (!o || o.pressAt >= 0) return;
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
      // the yellow copy is in his paw: the close-up closes by itself (the story needs it, CUT-IN-SPEC)
      closeView();
      s.papers = "both";
      s.order = null;
      go("post");
      control("chip-post");
    }
  }
  function postYellow() {
    const e = E(),
      s = S();
    busy();
    go("robots");
    s.papers = "pink";
    s.yellow = "mail";
    e.set("ch1Mailed", 1);
    sound.effect("pickup");
    e.queue([
      timer(0.4),
      e.say("ups", eveningWords("ups-scanned")),
      // the parked robots wake (their lights come on) and roll out of the mail room; he runs to the big wall vent
      e.run(() => ((S().woke = BAY.parked.map((r) => ({ x: r.x, y: r.y, lit: 0, leg: 0 }))), e.sfx("bleep"))),
      resetT(),
      e.until((dt) => {
        const s = S();
        s.t0 += dt || 0;
        s.woke.forEach((r) => (r.lit = Math.min(1, s.t0 / P.wake)));
        return s.t0 >= P.wake;
      }),
      e.until((dt) => {
        const robotsThere = wokeRoll(dt || 0);
        const s = S();
        s.runLeg = s.runLeg || 0;
        const w = BAY.run[s.runLeg];
        if (w && e.step("sq", w.x, w.y, P.runTo, dt || 0)) s.runLeg++;
        e.trail();
        return robotsThere && s.runLeg >= BAY.run.length;
      }),
      // hiding under the vent: it pulls the pink sheet out of his paw
      e.run(() => {
        const s = S();
        e.face("sq", 1);
        s.suck = 0;
        s.papers = "";
        s.pink = "flying";
        e.sfx("slurp");
      }),
      e.until((dt) => ((S().suck = Math.min(1, S().suck + (dt || 0) / P.suck)), S().suck >= 1)),
      e.run(() => {
        const s = S();
        s.suck = -1;
        s.pink = "vent";
        e.set("ch1PinkSucked", 1);
        e.paper && e.paper("vent");
        go("back");
        control("chip-sneak-home");
      }),
    ]);
  }
  // the woken robots roll out of the mail room's opening to the ramp's foot; true once both are there
  function wokeRoll(dt) {
    let all = true;
    S().woke.forEach((r, i) => {
      const legs = [BAY.gap, BAY.woke[i]],
        w = legs[r.leg];
      if (!w) return;
      const d = Math.hypot(w.x - r.x, w.y - r.y),
        k = Math.min(d, P.rollOut * dt);
      d > 1 ? ((r.x += ((w.x - r.x) / d) * k), (r.y += ((w.y - r.y) / d) * k), (all = false)) : (r.leg++, (all = all && r.leg >= legs.length));
    });
    return all;
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
      for (const p of [...(s.line || []), ...(s.family || []).filter((f) => f.x < 960)]) {
        const q = at(p);
        out.push({ ...coneFrom(p.id, q.x, q.y, look(p, HALL.alarm), size), always: true, bold: true });
      }
    }
    if (room() === "hangar") {
      const n = nightLook(s.nightT),
        nr = at({ id: BAY.robot.id, x: BAY.robot.x, y: BAY.robot.y, a: n.a });
      out.push({ ...coneFrom(BAY.robot.id, nr.x, nr.y, look({ ...nr, id: BAY.robot.id, a: n.a }, BAY.alarm), size), always: true, bold: true, catch: n.catch || (a && a.w.id === BAY.robot.id), robot: true });
      if (s.woke && s.step !== "robots")
        s.woke.forEach((r, i) => {
          const id = "robot-" + (i + 2),
            q = at({ id, x: r.x, y: r.y });
          out.push({ ...coneFrom(id, q.x, q.y, look({ id, a: -Math.PI / 2 }, BAY.alarm), size), always: true, bold: true, catch: true, robot: true });
        });
    }
    if (s.alarm) out.push(...guardCones(s.alarm, size).map((c) => ({ ...c, catch: true })));
    return out;
  }
  const witnessAt = (s, id) => {
    if (room() === "hangar") {
      if (id === BAY.robot.id) return { id, x: BAY.robot.x, y: BAY.robot.y };
      const i = +id.split("-")[1] - 2;
      return s.woke && s.woke[i] ? { id, x: s.woke[i].x, y: s.woke[i].y } : null;
    }
    const f = (s.family || []).find((q) => q.id === id) || (s.line || []).find((q) => q.id === id);
    return f ? { id, x: f.x, y: f.y } : null;
  };
  function raise(id) {
    const e = E(),
      s = S(),
      w = witnessAt(s, id);
    if (!w) return;
    const bay = room() === "hangar";
    startAlarm(s, w, bay ? "where-bay" : "where-bar", bay ? "who-robot" : "who-tourist", bay ? "bay" : "");
    e.sfx("bleep");
    psound.sting();
    s.seenBy = "";
    s.seenT = 0;
    // the family backs away (the hall); robots stay where they are
    s.people = {};
    if (!bay)
      for (const f of s.family || []) {
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
      hidden: () => (hiddenNow(S()) ? "plant" : ""),
      room: () => e.room(),
      people: () => S().people || {},
      sees: (c, sq) => seesHere(c, sq),
      firstTime: () => false,
      closeUp: (done) => done(),
      bell: () => psound.one("bell"),
      caught(whoId, whereId) {
        const word = (id) => (id.startsWith("who-robot") || id === "where-bay" ? eveningWords(id) : partyLine(id));
        e.catchSquatch(partyLine("lockup-cause").replace("{who}", word(whoId)).replace("{where}", word(whereId)));
      },
      lost() {
        record.lost = (record.lost || 0) + 1;
        psound.one("lost");
        e.lostYou(partyLine("note-lost"));
      },
      calmDone() {
        const s = S();
        // the family's moving cones follow the people who backed away and came back
        for (const f of s.family || []) s.people[f.id] && ((f.x = s.people[f.id].x), (f.y = s.people[f.id].y));
        s.people = {};
        if (s.step === "hide") {
          if (s.pose === "hidden" && s.hideAt === "counter") return watchFamily();
          s.familyT = 0; // they read again, then look up again
          return control("chip-hide");
        }
        control(s.step === "back" || s.step === "post" ? (s.step === "post" ? "chip-post" : "chip-sneak-home") : "chip-bin");
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
    s.step === "hide" && r === "hall" && on && (s.familyT += dt);
    // the family: reading the brochure (down) in the doorway, then looking up across the room
    if (s.step === "hide" && s.family && !s.alarm) s.family.forEach((f) => (f.a = s.familyT < FAMILY.read ? BAR.read : BAR.look));
    view && view.kind === "order" && orderTick();
    // the close-ups end themselves once the game no longer has what opened them (a restart, the LOCKUP card)
    if (view && !((view.kind === "gallery" && s.step === "gallery") || (view.kind === "brochure" && s.step === "read") || (view.kind === "order" && s.step === "order"))) closeView();
    // Night one, still in bed: his first move gets him up.
    if (on && s.step === "out" && s.bed && r === "closet" && e.steering()) return void getUp();
    // Steering steps him out of hiding or unrolls him.
    if (on && (s.pose === "hidden" || s.pose === "ball") && e.steering() && s.step !== "watch") {
      s.hideAt = "";
      s.ballNear = {};
      setPose("stand");
    }
    // Sight: hall watchers and night robots; guests "?" then "!" after SEEN_TOO_LONG_SECONDS, robots "!" at once.
    const showing = {};
    const watching = (r === "hall" || r === "hangar") && !s.alarm && on && s.pose === "stand";
    if (watching) {
      const seen = coneList(s).find((c) => c.catch !== false && seesHere(c, sqAt));
      if (!seen) ((s.seenBy = ""), (s.seenT = 0));
      else {
        s.seenT = s.seenBy === seen.id ? s.seenT + dt : 0;
        s.seenBy = seen.id;
        if (s.seenT >= (seen.robot ? P.robotSee : SEEN_TOO_LONG_SECONDS)) raise(seen.id);
      }
    } else ((s.seenBy = ""), (s.seenT = 0));
    // Rolled up: the ball rule (R43, the lunch's own reading of it): someone looking his way within reach for 2 s
    // notices the ball, the guards of an alarm too (then they see him, and the search goes on). Noticed with no alarm on:
    // the one capture rule, as for being seen standing.
    if ((r === "hangar" || r === "hall") && s.pose === "ball") {
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
    s.seenBy && !(coneList(s).find((c) => c.id === s.seenBy) || {}).robot && (showing[s.seenBy] = s.seenT / SEEN_TOO_LONG_SECONDS);
    tickQuestions(s, dt, showing);
    if (s.alarm && (r === "hall" || r === "hangar")) {
      tickAlarm(s, dt, alarmApi());
      let boot = false;
      for (const g of s.alarm ? s.alarm.guards.filter((q) => q.room === r) : []) footfall(g, g.x, g.y, dt, 0.45) && (boot = true);
      boot && psound.one("step");
    }
    // walking through an open doorway (no button): each door the step leads to
    if (on && !s.alarm) {
      const at = (p) => Math.hypot(sqAt.x - p.x, sqAt.y - p.y) < p.r;
      if (s.step === "wall" && r === "passage" && at(HALLWAY.left)) toHall();
      else if (s.step === "gohome" && r === "hall" && at(BAR.home)) toHome(eveningHome);
      else if (s.step === "out" && r === "closet" && at(HOME.door)) (s.bed && ((s.bed = null), setPose("stand")), NIGHT.out());
      else if (s.step === "nighthall" && r === "hall" && at({ ...LUNCH_PLACES.door.stand, r: LUNCH_PLACES.door.r })) NIGHT.nighthall();
      else if (s.step === "nightway" && r === "passage" && at(HALLWAY.right)) NIGHT.nightway();
      else if (s.step === "back" && r === "hangar" && at(BAY.door)) NIGHT.back();
      else if (s.step === "backway" && r === "passage" && at(HALLWAY.left)) NIGHT.backway();
      else if (s.step === "backhall" && r === "hall" && at(BAR.home)) NIGHT.backhall();
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
    e.place("sq", BAY.plant.x, BAY.plant.y);
    e.still("sq");
    e.stopWalk && e.stopWalk();
    setPose("hidden");
    s.hideAt = "plant";
    sound.effect("hide");
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
      r === "hall" && out.push(spot("ev-counter", "button-counter", BAR.hide, BAR.aisle, hideCounter));
      r === "hangar" && out.push(spot("ev-plant", "button-plant", BAY.plant, BAY.plant.box, hidePlant));
      out.push(ballSpot());
      return out;
    }
    switch (s.step) {
      case "wall": {
        const out = [doorSpot("ev-hall", HALLWAY.left)];
        // the gallery is optional: no outline (it is not the goal), offered under the wall until the robot came
        standing && !s.galleryDone && out.push({ ...spot("ev-photos", "button-photos", HALLWAY.look, HALLWAY.wall, lookPhotos), optional: true });
        return out;
      }
      case "hide":
        return standing ? [spot("ev-counter", "button-counter", BAR.hide, BAR.aisle, hideCounter)] : [];
      case "brochure":
        return [spot("ev-brochure", "button-brochure", BAR.grab, box(BAR.brochure.x, BAR.brochure.y, BAR.brochure.w + 8, BAR.brochure.h + 8), grabBrochure)];
      case "gohome":
        return [doorSpot("ev-home", BAR.home)];
      case "show": {
        // he holds it up where he stands (the action is where he is: no outline, the prompt only)
        const at = e.pos("sq");
        return [spot("ev-show", "button-show", { x: at.x, y: at.y, r: 60 }, null, showBrochure)];
      }
      case "bed":
        return [spot("ev-bed", "button-bed", HOME.bed, null, () => toBed(true))];
      case "out":
        return [doorSpot("ev-out", HOME.door)];
      case "nighthall":
        return [doorSpot("ev-hallway", { ...LUNCH_PLACES.door.stand, r: LUNCH_PLACES.door.r })];
      case "nightway":
        return [doorSpot("ev-bay", HALLWAY.right)];
      case "bin": {
        const out = [spot("ev-bin", "button-copies", BAY.bin, BAY.bin.box, grabCopies)];
        standing && Math.hypot(e.pos("sq").x - BAY.plant.x, e.pos("sq").y - BAY.plant.y) < BAY.plant.r && out.push(spot("ev-plant", "button-plant", BAY.plant, BAY.plant.box, hidePlant));
        standing && out.push(ballSpot());
        return out;
      }
      case "post": {
        const out = [spot("ev-post", "button-post", BAY.mail, BAY.mail.box, postYellow)];
        standing && out.push(ballSpot());
        return out;
      }
      case "back": {
        const out = [doorSpot("ev-bayout", BAY.door)];
        standing && Math.hypot(e.pos("sq").x - BAY.plant.x, e.pos("sq").y - BAY.plant.y) < BAY.plant.r && out.push(spot("ev-plant", "button-plant", BAY.plant, BAY.plant.box, hidePlant));
        standing && out.push(ballSpot());
        return out;
      }
      case "backway":
        return [doorSpot("ev-hall", HALLWAY.left)];
      case "backhall":
        return [doorSpot("ev-home", BAR.home)];
      case "tobed":
        return [spot("ev-bed", "button-bed", HOME.bed, null, () => toBed(false))];
    }
    return [];
  }

  // ---------- the full-screen close-ups ----------
  // The design boxes (evening-art.js fitDesign): the gallery's photo, arrows and X; the brochure; the papers.
  const GALLERY = Object.freeze({ W: 400, H: 700, photo: { x: 40, y: 110, w: 320, h: 250 }, plaque: { x: 200, y: 404, size: 20 }, left: { x: 80, y: 520, r: 40 }, right: { x: 320, y: 520, r: 40 }, close: { x: 352, y: 640, r: 36 }, dots: { x: 200, y: 452 } });
  const BROCHURE = Object.freeze({ W: 360, H: 600, card: { x: 30, y: 40, w: 300, h: 420 }, close: { x: 318, y: 556, r: 34 } });
  const designOf = (kind) => (kind === "gallery" ? GALLERY : kind === "brochure" ? BROCHURE : PAPERS);
  function openView(kind) {
    const at = E().time();
    view = { kind, at, paw: null, down: null };
    record.cutIns.push(kind);
    openFullScreen({
      label: kind === "gallery" ? "photo wall" : kind === "brochure" ? "brochure" : "order papers",
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
      if (kind !== "up") return;
      const g = s.gallery,
        d = view.down || p,
        swipe = p.x - d.x;
      if (hit(p, GALLERY.close)) return galleryEnd(false);
      const next = hit(p, GALLERY.right) || swipe < -50,
        back = hit(p, GALLERY.left) || swipe > 50;
      if (next) return g.i >= 4 ? galleryEnd(true) : ((g.i += 1), sound.effect("grab"));
      if (back && g.i > 0) return ((g.i -= 1), sound.effect("grab"));
      // photo #4 hangs crooked: a tap (or a lift upward) on it lifts it, and his crayon drawing is behind it
      if (g.i === 3 && g.lifted < 0 && inBox(p, GALLERY.photo, 10)) {
        g.lifted = E().time();
        E().set("ch1Crayon", true);
        sound.effect("pickup");
      }
      return;
    }
    if (view.kind === "brochure") {
      if (kind === "up" && hit(p, BROCHURE.close) && E().time() - view.at > P.zoomIn) brochureClosed();
      return;
    }
    if (view.kind === "order" && s.order) {
      const B = PAPERS.box;
      if ((kind === "down" || kind === "up") && E().time() - view.at > P.zoomIn && p.x > B.x - 26 && p.x < B.x + B.s + 26 && p.y > B.y - 26 && p.y < B.y + B.s + 26) markOrder();
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
      now = E().time();
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
        lift = crooked && g.lifted >= 0 ? Math.min(1, (now - g.lifted) / P.lift) : 0;
      // the wall behind, and, behind the crooked photo, his crayon drawing
      ctx.fillStyle = "#f3efe4";
      ctx.fillRect(10, 70, 380, 410);
      crooked && drawCrayonDrawing(ctx, Ph.x + 10, Ph.y + 8, Ph.w - 20, Ph.h - 16);
      ctx.save();
      ctx.translate(Ph.x + Ph.w / 2, Ph.y + Ph.h / 2 - lift * 330);
      ctx.rotate(crooked ? -0.12 * (1 - lift) - lift * 0.5 : 0);
      ctx.translate(-(Ph.x + Ph.w / 2), -(Ph.y + Ph.h / 2));
      ctx.fillStyle = "#e9c46a";
      ctx.fillRect(Ph.x - 10, Ph.y - 10, Ph.w + 20, Ph.h + 20);
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#1e2430";
      ctx.strokeRect(Ph.x - 10, Ph.y - 10, Ph.w + 20, Ph.h + 20);
      drawPhoto(ctx, id, Ph.x, Ph.y, Ph.w, Ph.h, (c, x, y, k, o) => E().drawMopsOn(c, x, y, k, o), now);
      ctx.strokeRect(Ph.x, Ph.y, Ph.w, Ph.h);
      // the crooked one glows: a kid sees it can be moved
      if (crooked && lift === 0) {
        ctx.globalAlpha = 0.55 + 0.35 * Math.sin(now * 5);
        ctx.lineWidth = 8;
        ctx.strokeStyle = "#ffd23f";
        ctx.strokeRect(Ph.x - 18, Ph.y - 18, Ph.w + 36, Ph.h + 36);
        ctx.globalAlpha = 1;
      }
      ctx.restore();
      drawPlaque(ctx, GALLERY.plaque.x, GALLERY.plaque.y, GALLERY.plaque.size);
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(GALLERY.dots.x + (i - 2) * 22, GALLERY.dots.y, i === g.i ? 7 : 5, 0, Math.PI * 2);
        ctx.fillStyle = i === g.i ? "#ffd23f" : "rgba(255,255,255,.8)";
        ctx.fill();
      }
      g.i > 0 && drawArrow(ctx, GALLERY.left.x, GALLERY.left.y, GALLERY.left.r, -1);
      drawArrow(ctx, GALLERY.right.x, GALLERY.right.y, GALLERY.right.r, 1, crooked && lift === 0 ? 0 : 0.5 + 0.5 * Math.sin(now * 4));
      drawCloseX(ctx, GALLERY.close.x, GALLERY.close.y, GALLERY.close.r);
      Object.assign(out, { photo: g.i + 1, id, crooked, lifted: lift >= 1, crayon: crooked });
    } else if (view.kind === "brochure") {
      const C = BROCHURE.card;
      drawBrochure(ctx, C.x, C.y, C.w, C.h);
      drawFurArm(ctx, C.x + C.w * 0.3, D.H + 40, C.x + C.w * 0.12, C.y + C.h - 10, 30);
      drawCloseX(ctx, BROCHURE.close.x, BROCHURE.close.y, BROCHURE.close.r);
      Object.assign(out, { card: C });
    } else if (view.kind === "order" && s.order) {
      const o = s.order,
        B = PAPERS.box;
      drawPapers(ctx, { mark: o.mark, tear: o.tear, glow: o.pressAt < 0 ? 1 : 0, t: now });
      // the prompt beside the box until he presses it
      if (o.pressAt < 0) {
        const label = eveningWords("label-mark");
        ctx.font = "900 20px system-ui, -apple-system, sans-serif";
        const lw = ctx.measureText(label).width + 24;
        ctx.beginPath();
        ctx.roundRect(B.x + B.s / 2 - lw / 2 - 30, B.y + B.s + 14, lw, 34, 10);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#1e2430";
        ctx.stroke();
        ctx.fillStyle = "#1e2430";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, B.x + B.s / 2 - 30, B.y + B.s + 31);
      }
      // his paw: under the finger, or resting; pressed into the box while marking; holding the yellow as it tears
      const rest = o.tear > 0 ? { x: 92, y: 520 + o.tear * 20 } : view.paw || { x: 230, y: 520 },
        pressing = o.pressAt >= 0 && o.mark < 1,
        paw = pressing ? { x: B.x + B.s / 2, y: B.y + B.s / 2 } : rest;
      drawFurArm(ctx, 260, D.H + 40, paw.x, paw.y, 34);
      Object.assign(out, { mark: +o.mark.toFixed(2), tear: +o.tear.toFixed(2), paw });
    }
    ctx.restore();
    view.drew = out;
  }
  /** Where to tap (screen pixels) to do what the open close-up asks next (tests and the kid robot). */
  function viewTargets() {
    const s = live();
    if (!view || !s || !view.w) return null;
    const D = designOf(view.kind),
      f = fitDesign(view.w, view.h, D.W, D.H),
      at = (p) => ({ x: f.x + p.x * f.k, y: f.y + p.y * f.k });
    if (view.kind === "gallery" && s.gallery)
      return { kind: "gallery", i: s.gallery.i, next: at(GALLERY.right), back: at(GALLERY.left), close: at(GALLERY.close), photo: at({ x: GALLERY.photo.x + GALLERY.photo.w / 2, y: GALLERY.photo.y + GALLERY.photo.h / 2 }), lifted: s.gallery.lifted >= 0, ready: E().time() - view.at > P.zoomIn };
    if (view.kind === "brochure") return { kind: "brochure", close: at(BROCHURE.close), ready: E().time() - view.at > P.zoomIn };
    if (view.kind === "order") return { kind: "order", box: at({ x: PAPERS.box.x + PAPERS.box.s / 2, y: PAPERS.box.y + PAPERS.box.s / 2 }), ready: E().time() - view.at > P.zoomIn };
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
    for (const p of s.line || []) guests.push({ id: p.id, x: p.x, y: p.y });
    const extra = [];
    for (const f of s.family || [])
      if (!f.kid) guests.push({ id: f.id, x: f.x, y: f.y });
      else extra.push({ y: f.y, f: () => bridge.guests.drawId(ctx0, f.id, f.x, f.y, adult * BAR.kidK, t) });
    // (the family comes in at the hallway doorway: the wall past it hides them until they are through)
    const over = (id) => bridge.guests.height(id, adult) + adult * 0.27;
    const marks = [];
    for (const q of questions(s)) {
      const id = q.id.replace(/^warn:/, ""),
        g = guests.find((x) => x.id === id);
      g && marks.push({ x: g.x + 26, y: g.y - over(id) + 10, mark: "?", size: Math.round(adult * 0.42), q });
    }
    const a = s.alarm;
    const shout = a && (a.phase === "shout" || (a.phase === "run" && a.t < 0.5)) ? { x: a.w.x, y: a.w.y - over(a.w.id) - 12 } : null;
    a && a.phase === "shout" && marks.push({ x: a.w.x + 40, y: a.w.y - over(a.w.id) + 14, mark: "!", size: Math.round(adult * 0.635) });
    a && a.guards.forEach((g) => g.room === "hall" && g.sees && marks.push({ x: g.x, y: g.y - adult * 1.29, mark: "!", size: Math.round(adult * 0.635) }));
    if (a) for (const g of guests) a.w.id === g.id && ((g.x = a.w.x), (g.y = a.w.y));
    if (a) for (const g of guests) s.people[g.id] && ((g.x = s.people[g.id].x), (g.y = s.people[g.id].y));
    // the crates from the lunch are still there
    extra.push({ y: LUNCH_PLACES.crate.box.y1, f: () => drawCrates(ctx0) });
    // Mops, behind the counter or walking
    if (e.get("moPose") !== "hidden") {
      const mo = e.pos("mops");
      extra.push({ y: mo.y, f: () => e.drawMopsOn(ctx0, mo.x, mo.y, k * 1.15, { f: mo.f || -1, walk: 0 }) });
    }
    // the brochure: in the reading grown-up's hands, on the counter's ledge, in Squatch's paw
    const fam = s.family && s.family[0];
    if (s.brochure === "family" && fam) extra.push({ y: fam.y + 1, f: () => drawBrochure(ctx0, fam.x - 30, fam.y - adult * 0.62, 26, 34, true) });
    if (s.brochure === "putting" && fam) {
      const u = Math.min(1, s.t0 / P.putDown),
        B = BAR.brochure,
        x = fam.x - 17 + (B.x - (fam.x - 17)) * u,
        y = fam.y - adult * 0.62 + 17 + (B.y - (fam.y - adult * 0.62 + 17)) * u,
        w = 26 + (B.w - 26) * u,
        h = 34 + (B.h - 34) * u;
      extra.push({ y: fam.y + 1, f: () => drawBrochure(ctx0, x - w / 2, y - h / 2, w, h, true) });
    }
    if (s.brochure === "counter") extra.push({ y: BAR.brochure.y + 30, f: () => drawBrochure(ctx0, BAR.brochure.x - BAR.brochure.w / 2, BAR.brochure.y - BAR.brochure.h / 2, BAR.brochure.w, BAR.brochure.h, true) });
    if (s.brochure === "paw" && s.pose === "stand" && !view) extra.push({ y: sq.y + 1, f: () => drawBrochure(ctx0, sq.x + (sq.f || -1) * 14 * k - 11, sq.y - 34 * k, 22, 28, true) });
    // the family's picture bubble (pancakes, Mars) over the one with the brochure
    if (s.bubble >= 0 && fam) extra.push({ y: 9999, f: () => drawPictureBubble(ctx0, fam.x, fam.y - over(fam.id) - 46, Math.min(1, s.bubble / 0.25) * Math.min(1, (P.pictureBubble - s.bubble) / 0.3)) });
    // rolled up in the aisle behind the counter
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
      vent: true,
      squatch: s.pose === "stand" ? { x: sq.x, y: sq.y, f: sq.f || -1, walk: e.walkPhase(), pose: "stand" } : { x: sq.x, y: sq.y, pose: "hidden" },
      eyes: null,
      marks,
      shout,
      alarm: !!a && a.phase !== "shout" && a.phase !== "run" && a.phase !== "calm",
      floor: (ctx) => {
        if (s.step === "show" || !e.get("ctrl")) return;
        s.step === "brochure" && drawNextGlow(ctx, box(BAR.brochure.x, BAR.brochure.y, BAR.brochure.w + 6, BAR.brochure.h + 6), t, 0.9);
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
    if (bayPic && bayPic.complete && bayPic.naturalWidth) ctx.drawImage(bayPic, 0, 0, 960, 640);
    else ((ctx.fillStyle = "#7f8597"), ctx.fillRect(0, 0, 960, 640));
    const a = s.alarm;
    a && a.phase !== "shout" && a.phase !== "run" && a.phase !== "calm" && drawAlarmFlash(ctx, BAY.alarm, t);
    const cones = drawCones(ctx, coneList(s).map((c) => (c.catch === false ? { ...c, bold: false, always: true } : c)), sq, hidden || !free(), true, (c) => e.noteCone(c));
    // the two stuck-together copies Mops spat into the bin, sticking up out of it (until he takes them)
    if (s.step === "bin" && !s.papers) {
      const B = BAY.bin.box;
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
    // the next thing glows (on the floor, under everyone)
    e.get("ctrl") && s.step === "bin" && drawNextGlow(ctx, BAY.bin.box, t, 0.6);
    e.get("ctrl") && s.step === "post" && drawNextGlow(ctx, BAY.mail.box, t, 0.6);
    const people = [];
    const robotAt = (id, x, y) => (a && a.w.id === id ? { x: a.w.x, y: a.w.y } : { x, y });
    const nr = robotAt(BAY.robot.id, BAY.robot.x, BAY.robot.y);
    people.push({ y: nr.y, f: () => robot(ctx, nr.x, nr.y, 1) });
    if (s.woke) s.woke.forEach((r, i) => ((p) => people.push({ y: p.y, f: () => robot(ctx, p.x, p.y, r.lit) }))(robotAt("robot-" + (i + 2), r.x, r.y)));
    else BAY.parked.forEach((r) => people.push({ y: r.y, f: () => robot(ctx, r.x, r.y, 0) }));
    for (const g of a ? a.guards.filter((q) => q.room === "hangar") : []) people.push({ y: g.y, f: () => drawPerson(ctx, g.x, g.y, adultPxFor("hangar") * 1.02, LOOKS.guard, Math.cos(g.a) < 0 ? -1 : 1, t) });
    // him: standing (the room's Squatch, wide-eyed under the vent), rolled up, or his eyes in the plant
    if (s.pose === "stand") people.push({ y: sq.y, f: () => (e.drawSquatch(ctx, sq.x, sq.y, k, { f: sq.f || 1, walk: e.walkPhase(), eyes: s.step === "robots" || s.pink === "flying" ? "wide" : undefined }), papersInPaw(ctx, s, sq, k)) });
    s.pose === "ball" && e.ball && people.push({ y: sq.y, f: () => e.ball.drawOn(ctx, sq.x, sq.y - 16 * (k / 1.65), k / 1.65) });
    drawOrder(people).forEach((p) => p.f());
    s.pose === "hidden" && s.hideAt === "plant" && e.drawEyes(ctx, BAY.plant.eyes.x, BAY.plant.eyes.y);
    // the yellow copy going into the mailbox's slot
    if (s.step === "robots" && s.yellow === "mail" && s.t0 < 0.4 && !s.woke) {
      const u = Math.min(1, s.t0 / 0.4);
      paper(ctx, sq.x + (BAY.mail.box.x0 + 40 - sq.x) * u, sq.y - 40 * k + (BAY.mail.box.y0 + 40 - sq.y + 40 * k) * u, "#ffe27a", 16 * (1 - u * 0.6));
    }
    // the pink sheet pulled into the big wall vent, fluttering
    if (s.suck >= 0) {
      const u = s.suck,
        x0 = sq.x + 14,
        y0 = sq.y - 46 * k,
        V = BAY.vent.mouth,
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
    // "!" over a robot that sees him, and over guards who see him
    const adult = adultPxFor("hangar");
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
  function papersInPaw(ctx, s, sq, k) {
    const f = sq.f || 1,
      x = sq.x + f * 16 * k,
      y = sq.y - 26 * k;
    if (s.papers === "both" || s.papers === "paw") (paper(ctx, x + f * 4, y + 4, "#ffe27a", 14 * k), paper(ctx, x, y, "#ff9ec4", 18 * k));
    if (s.papers === "pink") paper(ctx, x, y, "#ff9ec4", 18 * k);
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
    // the brochure: in his paw, or held up high over his head for Mops to see
    const paw = sqPawAt(sq.x, sq.y, sq.f || 1, k);
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
    if (s.mopsSleep) {
      const m = s.mopsSleep;
      drawSleepingMops(ctx, (c, x, y, sc, o) => e.drawMopsOn(c, x, y, sc, { ...o, eyes: m.eyes > 0.6 || m.tip > 0 ? "closed" : "", headDrop: m.tip > 0 ? 0 : m.eyes * 4 }), HOME.sleep.x, HOME.sleep.y, mopsK, m.tip, m.roll, t);
      out.mops = { tip: +m.tip.toFixed(2), roll: +m.roll.toFixed(2) };
    }
    // the night (the bedtime story's dim)
    if (s.dim > 0) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, s.dim * BEDTIME_NIGHT.dim);
      ctx.fillStyle = BEDTIME_NIGHT.color;
      ctx.fillRect(-2000, -2000, 6000, 5000);
      ctx.restore();
      out.dim = +(s.dim * BEDTIME_NIGHT.dim).toFixed(2);
    }
    // him in bed (lying, the blanket), or up and about in the dark: drawn over the night so a kid sees him
    if (s.bed) {
      drawBedtimeSquatch(ctx, s.bed, k, false);
      out.blanket = drawBedBlanket(ctx, s.bed.cover);
      out.bed = { x: Math.round(s.bed.x), y: Math.round(s.bed.y), a: +s.bed.a.toFixed(2) };
    } else if (s.dim > 0 && s.pose === "stand") {
      e.drawSquatch(ctx, sq.x, sq.y, k, { f: sq.f || 1, walk: e.walkPhase() });
      out.squatchLit = true;
    }
    // the snores: "z z z" rising from Mops (the first night) or from him (back in bed)
    if (s.zzz >= 0) {
      // (over his head lying in bed: LIE turned a quarter, his head left of his feet)
      const from = s.step === "sleep" ? { x: BED_POSES.lie.x - 30 * k + 30, y: BED_POSES.lie.y - 10 } : { x: HOME.sleep.x + 30, y: HOME.sleep.y - 50 },
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
      const back = { walkin: "wall", gallery: "wall", robot: "wall", tohall: "wall", line: "hide", watch: "hide", read: "brochure", evening: "show", mars: "show", asleep: "bed", order: "bin", robots: "post", sleep: "tobed" }[s.step];
      return back ? (jump(back), true) : false;
    },
    /** True from beat 37 until beat 43 takes over. */
    active() {
      return !!live();
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
      if (room() === "hall") drew = { step: s.step, cones: drawHall(ctx, E(), bridge.guests, hallView(s, ctx)) };
      else drew = { step: s.step, cones: drawBay(ctx, s) };
      return true;
    },
    /** Over the rooms the older program draws (the hallway and home): the robot, Mops asleep, the night. */
    draw(ctx) {
      const s = live(),
        e = E();
      if (!s) return;
      if (room() === "passage" && s.robot) {
        e.drawRobot && e.drawRobot(ctx, s.robot.x, s.robot.y);
        drew = { step: s.step, robot: { x: Math.round(s.robot.x), y: Math.round(s.robot.y) } };
      } else if (room() === "passage") drew = { step: s.step };
      if (room() === "closet" && STEP_ROOM[s.step] === "closet") drew = { step: s.step, ...drawHome(ctx, s) };
    },
    /** Where a speaker's bubble points: the robot in the hallway, the one in line, Squatch rolled up, the mailbox. */
    speakerAt(who) {
      const s = live(),
        e = E();
      if (!s) return null;
      if (who === "robot" && s.robot) return { x: s.robot.x, y: s.robot.y - 80 };
      if (who === "tourist" && s.line && s.line[0]) return { x: s.line[0].x, y: s.line[0].y - e.hallSizes().adult - 10 };
      if (who === "ups" && room() === "hangar") return { x: (BAY.mail.box.x0 + BAY.mail.box.x1) / 2, y: BAY.mail.box.y0 + 20 };
      return null;
    },
    /** Feet nobody walks through: the hall's furniture (the crates stay) and Mops; the robots in the bay. */
    solids() {
      const s = live();
      if (!s) return [];
      const e = E(),
        feet = (x, y) => ({ x0: x - 25, x1: x + 25, y0: y - 14, y1: y + 8, person: 1 });
      const out = [...LUNCH_SOLIDS];
      e.get("moPose") !== "hidden" && out.push(feet(e.pos("mops").x, e.pos("mops").y));
      // everyone standing in the hall is solid too (the two in line, the family where they stand or back away to)
      for (const p of [...(s.line || []), ...(s.family || []).filter((f) => f.x < 940)]) {
        const q = (s.alarm && s.alarm.w.id === p.id ? s.alarm.w : s.people && s.people[p.id]) || p;
        out.push(feet(q.x, q.y));
      }
      return out;
    },
    /** Extra feet in rooms the older program draws: Mops asleep on the floor at home; the robots in the bay. */
    extraSolids(r) {
      const s = live();
      if (!s) return [];
      if (r === "closet" && s.mopsSleep) return [HOME.mopsBox];
      if (r === "hangar" && STEP_ROOM[s.step] === "hangar") {
        const feet = (x, y) => ({ x0: x - 22, x1: x + 22, y0: y - 14, y1: y + 8, person: 1 });
        return [feet(BAY.robot.x, BAY.robot.y), ...(s.woke || BAY.parked).map((q) => feet(q.x, q.y))];
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
      if (view.kind === "gallery" && s.gallery) return s.gallery.i >= 4 ? (galleryEnd(true), "past 5") : ((s.gallery.i += 1), "next");
      if (view.kind === "brochure") return E().time() - view.at > P.zoomIn ? (brochureClosed(), "X") : "";
      if (view.kind === "order") return s.order && s.order.pressAt < 0 && E().time() - view.at > P.zoomIn ? (markOrder(), "MARK · order") : "";
      return "";
    },
    /** Tests: the places (evening-place.js). */
    place: Object.freeze({ HALLWAY, BAR, HOME, BAY, BAY_FURNITURE, nightLook }),
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
      return { state: s ? JSON.parse(JSON.stringify(s)) : null, active: !!live(), drew, view: view ? { kind: view.kind, drew: view.drew || null } : null, steps: record.steps.slice(), cutIns: record.cutIns.slice(), lost: record.lost || 0, sounds: sound.asked(), snores: bsound.asked(), partySounds: psound.debug().played };
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
        galleryDone: false,
        brochure: after("brochure") ? (after("show") ? "home" : "paw") : "",
        dim: after("bed") ? 1 : 0,
        warm: after("gohome") ? 1 : 0,
        mopsSleep: after("bed") ? { tip: 1, roll: 1, eyes: 1 } : null,
        papers: step === "post" ? "both" : after("post") ? "" : "",
        pink: after("post") ? "vent" : "",
        yellow: after("post") ? "mail" : "",
        woke: after("post") ? BAY.woke.map((w) => ({ x: w.x, y: w.y, lit: 1, leg: 2 })) : null,
      }),
    );
    after("brochure") && e.set("ch1Brochure", true);
    after("bin") && (e.set("ch1Paw", 1), e.set("ch1Signed", 1));
    after("post") && (e.set("ch1Mailed", 1), e.set("ch1PinkSucked", 1));
    const s = S();
    e.set("sqPose", "stand");
    const r = STEP_ROOM[step];
    e.enterRoom(r, "QB");
    r === "hangar" && e.set("ch1D", true);
    const at = {
      wall: HALLWAY.stop,
      hide: BAR.sq,
      brochure: BAR.hidden,
      gohome: BAR.grab,
      show: HOME.stop,
      bed: { x: 560, y: 470 },
      out: HOME.up,
      nighthall: { x: BAR.home.x, y: 556 },
      nightway: { x: 110, y: HALLWAY.left.y + 20 },
      bin: BAY.stop,
      post: BAY.bin,
      back: BAY.underVent,
      backway: { x: 850, y: HALLWAY.right.y + 20 },
      backhall: LUNCH_PLACES.door.stand,
      tobed: { x: 800, y: 470 },
    }[step];
    e.place("sq", at.x, at.y);
    e.face("sq", -1);
    // Mops: waiting at the hallway's end, behind the counter, at home, or asleep on the floor
    const mops = { wall: HALLWAY.mops, hide: BAR.mops, brochure: BAR.mops, show: HOME.mops, bed: HOME.mops }[step];
    e.set("moPose", mops ? "stand" : "hidden");
    mops ? (e.place("mops", mops.x, mops.y), e.face("mops", step === "wall" ? 1 : -1)) : e.place("mops", -400, 0);
    if (step === "hide") {
      s.family = BAR.family.map((f) => ({ id: f.id, x: f.door.x, y: f.door.y, a: BAR.read, kid: f.kid }));
      s.brochure = "family";
    }
    if (step === "brochure") ((s.brochure = "counter"), (s.pose = "hidden"), (s.hideAt = "counter"));
    s.step = step;
    record.steps.push(step);
    setPose(s.pose);
    if (step === "brochure") setPose("hidden");
    control({ wall: "chip-go-on", hide: "chip-hide", brochure: "chip-brochure", gohome: "chip-home", show: "chip-show", bed: "chip-bed", out: "chip-out", nighthall: "chip-bin", nightway: "chip-bin", bin: "chip-bin", post: "chip-post", back: "chip-sneak-home", backway: "chip-sneak-home", backhall: "chip-sneak-home", tobed: "chip-bed" }[step]);
  }
}
