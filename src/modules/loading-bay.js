/**
 * The loading bay, Chapter 1 beats 28 to 36, and 36b (the story pass of 2026-11-26: Brian, "Build this pass"; every
 * CHANGED or NEW line is pending until he says yes as he watches). It follows the lunch sneak (lunch-sneak.js hands over
 * through 14-ch1-day2.js ch1ShipCall) and ends in the hallway, where beat 37 follows (the rebuilt evening's start() when
 * that beat is there, else the older program's ch1WalkHomeDone). Beat 36b, the party hall's three cleaning robots, is
 * started by the evening when the player walks into the hall after the photo wall (startHallSneak), or straight after
 * 36 when no evening module is there; reaching the snack counter ends it (the evening's startStorm, 38a, or the older
 * program's ch1SnackLine).
 * What the player sees, step by step (* the player controls it; every word from loading-bay-lines.js, every place and
 * number from loading-bay-place.js, every new drawing from loading-bay-art.js, all PLACEHOLDERS):
 *   pa       28, behind the snack counter: the PA, beside the hall's speaker with sound waves, then the talk (9 bubbles)
 *   walk     29: up the aisle into the hallway doorway, Mops first (the counter hides them: a few held seconds)
 * * hallway  29: he walks the hallway himself; Mops waits at the bay's end, its doorway outlined. Up to the photo wall:
 *            Mops, "Later. The ship!", and he is turned back. The office door is shut.
 *   arrive   29: into the bay; the ship docks, the ramp comes down; footsteps and Isfred's shadow in the doorway; Mops:
 *            "Quick! The manager is coming!" "Hide!"
 * * cargo    the cargo by the doorway outlined: ROLL · ball, behind it (the ball, never standing "hidden")
 *   robots   30: Isfred walks in; three robots roll down under the scanner arch (its field shimmers; "NO FUR. PROCEED."),
 *            new crates with the station's stamp come down with a little tagged box; last week's empty crate goes up the ramp; Isfred,
 *            far away: "Mmf mmf... mmf!" (muffled: he is behind the cargo)
 * * sneak    the plant by the bin outlined: he unrolls and sneaks to it past the robots' cones (seen: "?", then "!", the
 *            robot runs to the bay's FUR alarm: the one capture rule); HIDE · plant, eyes only, and now the words are clear
 *   talk     30: a robot posts a letter ("Mail scanned."); Isfred says why the robots came; Squatch's thought, a sweat
 *            drop; Dot, Bob and Lou come in, Isfred thanks them, each hands a tool to a robot (the broom upside down);
 *            Lou's fuzzy hat: the arch stops him ("FUR. STOP." "It's a HAT." "FUR. STOP."), he leaves it; "Weee...?"
 *   promise  31: Isfred's promise, three bubbles; Mops's happy bleat
 * * peek     32: PEEK · form, from the plant
 *   form     the close-up: "Sign here." / "Tick the box..." (the box outlined) / Isfred waves it away in three bubbles and
 *            signs, the box empty / "Please put this in my office." (the robot starts off) / "Oh, wait." / the code in
 *            blue pen, through to the yellow / the robot rolls off to the office; "Isfred! We're leaving!"; Isfred waves,
 *            the ramp goes back up into the ship and the ship leaves
 *   back     33: "You are MOPS now." The robot comes back with the pink and the yellow: its line, "I'll take care of it."
 * * take     TAKE · copies (the player is Mops)
 * * eat      EAT · copies: the close-up you liked (his face, the copies going in, Squatch's eyes in the plant): "Delicious."
 *   orders   34: "Unit 1: clean the office." "Units 2 and 3: clean the great hall." "CLEANING." All three roll out.
 * * talkto   the plant outlined: walk Mops to it, TALK · Squatch: the mumble, whispered; "You're gumbling!..."; "I can't
 *            understand you with paper in your mouth."
 * * spit     SPIT · bin: "Ptoo!" (the copies into the bin by the plant; they stay there); "See, Squatch? Nothing to worry about."
 * * box      PICK UP · box at the ramp's foot (the little tagged box)
 * * give     GIVE · box at the plant: "Mail for you." The tag, close up; "They never forget." One heart. "The robots are
 *            gone. Let's get you home." "Stay close to me." "You are SQUATCH now."
 * * home     36: out of the plant, through the bay's doorway with Mops
 * * walkby   the hallway: halfway along the office door slides open (inside: a desk, a glowing computer), Robot 1 rolls
 *            out; ROLL · ball flashes and he has about a second and a half. Rolled: a close-up of the robot's eye, Mops and
 *            the hairball: "What's that?" "Big hairball." "Does not compute." Too slow: "!", the one capture rule, and the
 *            hallway starts again.
 *   after    "We have to watch out for these robots." "What's the difference between fur and hair?" "Paperwork." Beat 37.
 * * hall     36b: the party hall, three robots mopping in lanes (cones the way they roll, grey streaks, "CLEANING." at each
 *            turn); he crosses to the snack counter's front with Mops alongside; a robot that meets Mops stops ("MOVE,
 *            GOAT." / "You missed a corner." / "CORNERS ARE NOT EFFICIENT.") and goes round. Seen: the one capture rule.
 * Its progress lives in the game-state field ch1Bay; ch1Step is "bay-<step>" at each step the player controls, so the step
 * restart (↺) brings back the step he is on; ↺ in a part he does not control starts that part again (restart()).
 */
import { BAY, BAY_SPOTS, HALLWAY, HALL_SNEAK, BAY_PACE as P, BAY_PICTURES, BAY_CLOSEUPS, BAY_PARTS, BAY_STEPS, ROBOT_SIZE } from "./loading-bay-place.js";
import { bayWords, bayLine, BAY_SPEAKER_NAMES } from "./loading-bay-lines.js";
import { OFFICE_CODE } from "./office-code.js";
import { CAMERA_INSTALL_SCENE, BAY_CAMERA, drawBayCamera } from "./bay-camera.js";
import { findPath } from "./tap-path.js";
import { drawRobot, robotHand, drawFormSet, drawStuck, drawBiteCrumbs, drawFormCloseUp, closeUpBox, drawCloseUpBack, drawCloseUpFront, drawWave, drawDashedOutline, drawBayCrate, drawCargo, drawTag, drawTaggedBox, drawTagCloseUp, drawDoorShadow, drawTool, drawFuzzyHat, drawScannerStop, drawScannerPass, drawMailBeside, drawLetter, drawSlotLight, drawSweat, drawOfficeOpen, drawStreak } from "./loading-bay-art.js";
import { drawSpeakerRing, drawHeartCone } from "./party-free-art.js";
import { firstSightHeartsUp } from "./mops-hearts.js";
import { HALL, HALL_PICTURE, HALL_SPEAKER } from "./party-hall.js";
import { COUNTER_SPOTS, LUNCH_SOLIDS, LUNCH_BOUNDS, LUNCH_PLACES, AISLE } from "./lunch-sneak-place.js";
import { coneFrom, drawCones, distToCone, SQUATCH_OUTLINE, SEEN_TOO_LONG_SECONDS } from "./party-watch.js";
import { startAlarm, tickAlarm, guardCones, addAlarmPlace, ALARM, GUARD_FEET } from "./party-alarm.js";
import { drawHall } from "./party-draw.js";
import { drawMark, drawPerson, LOOKS } from "./party-art.js";
import { drawHeart, drawCrates } from "./lunch-sneak-art.js";
import { partyLine } from "./party-lines.js";
import { tickQuestions, questions } from "./party-question.js";
import { createHomeMorningSound, HOME_MORNING_SOUND } from "./home-morning-sound.js";
import { createPartySound } from "./party-sound.js";
import { footfall } from "./footfalls.js";
import { adultPxFor } from "./room-sizes.js";
import { robotStep, addRobots } from "./room-model.js";
// someone of the bay's own (Isfred, a worker, a robot) one straight step toward (x, y); true there
function bayStepStraight(o, x, y, speed, dt) {
  const dx = x - o.x,
    dy = y - o.y,
    d = Math.hypot(dx, dy),
    k = speed * (dt || 0);
  Math.abs(dx) > 1 && (o.f = dx > 0 ? 1 : -1);
  o.moving = d > 0.5;
  if (d <= k || d < 0.5) return ((o.x = x), (o.y = y), (o.moving = false), true);
  o.x += (dx / d) * k;
  o.y += (dy / d) * k;
  return false;
}

export const BAY_ID = "ch1-bay";
/** Which walkthrough beat each step or part plays (tests, ch1JumpBeat). */
export const BAY_BEATS = Object.freeze({ pa: 28, walk: 29, hallway: 29, arrive: 29, cargo: 29, robots: 30, sneak: 30, talk: 30, promise: 31, peek: 32, form: 32, back: 33, take: 33, eat: 33, orders: 34, talkto: 34, spit: 35, box: 35, give: 35, home: 36, walkby: 36, after: 36, hall: "36b" });
const SQ_K = (room) => (room === "hall" ? null : (adultPxFor(room) * 0.8) / 45);
const ISFRED_K = () => adultPxFor("hangar") / adultPxFor("hall");
const ROBOT_K = (room) => adultPxFor(room) / adultPxFor("hangar");
const CONE = { half: 0.42, len: 210 };
// A cone holds him this long ("?" filling) before anyone has seen him (the shared rule, 2026-11-26).
const BAY_HOLD = 0.5;
const TOOLS = ["wrench", "broom", "clipboard"];

// The bay's own place for the one capture rule (party-alarm.js): the robot runs to the red FUR alarm on the bay's left
// wall, guards come in at the doorway and search round the bay's things. Its own id ("bay-day": the evening's night
// bay is "bay").
const BAY_AROUND = [
  { x0: 66, x1: 154, y0: 354, y1: 386 }, // the cargo
  { x0: 189, x1: 237, y0: 350, y1: 374 }, // the bin
  { x0: 273, x1: 318, y0: 346, y1: 370 }, // the plant (v3)
  { x0: 344, x1: 588, y0: 392, y1: 416 }, // the scanner's foot
  { x0: 675, x1: 699, y0: 360, y1: 420 },
  { x0: 675, x1: 699, y0: 507, y1: 609 },
  { x0: 848, x1: 908, y0: 452, y1: 476 }, // the mailbox
].map((b) => ({ x0: b.x0 - GUARD_FEET.side, x1: b.x1 + GUARD_FEET.side, y0: b.y0 - GUARD_FEET.down, y1: b.y1 + GUARD_FEET.up }));
addAlarmPlace("bay-day", {
  room: "hangar",
  run: { x: 82, y: 330 },
  guardIn: { x: 30, y: 336 },
  search: [{ x: 200, y: 470 }, { x: 420, y: 560 }, { x: 640, y: 400 }, { x: 340, y: 430 }, { x: 760, y: 560 }],
  around: BAY_AROUND,
  floor: { x0: 20, x1: 920, y0: 310, y1: 600 },
  feet: 0,
  register: BAY_HOLD,
});
// the hallway: the robot rolls to the bay's end to raise it; guards come in from the hall's end
addAlarmPlace("bay-hallway", {
  room: "passage",
  run: { x: 930, y: 330 },
  guardIn: { x: 20, y: 330 },
  search: [{ x: 300, y: 340 }, { x: 600, y: 420 }, { x: 800, y: 360 }, { x: 200, y: 480 }],
  around: [],
  floor: { x0: 20, x1: 940, y0: 270, y1: 590 },
  feet: 0,
  register: BAY_HOLD,
});

export function createLoadingBay(bridge) {
  const E = () => bridge.engine();
  const hallPic = typeof Image !== "undefined" ? Object.assign(new Image(), { src: HALL_PICTURE }) : null;
  const sound = createHomeMorningSound(() => bridge.engine(), bridge.morningSound);
  const psound = createPartySound(() => bridge.engine());
  const B = () => {
    const e = E();
    return e ? e.get("ch1Bay") : null;
  };
  const live = () => {
    const b = B(),
      e = E();
    return b && e && e.get("ch1Day2") && b.step && b.step !== "done" ? b : null;
  };
  let mailDrawn = false; // (tests: the mail was drawn beside the little box)
  let drew = null,
    ff = {},
    moFF = {},
    pads = 0,
    moLast = null,
    moMoving = false,
    closeAlarmView = null,
    record = { steps: [] };
  const room = () => E().room();
  // the bay's robots, Isfred and the workers, for the room model's check of everyone (room-model.js addRobots)
  addRobots(() => {
    const b = live();
    if (!b) return [];
    return [...b.robots.filter((r) => r.show).map((r, i) => ({ who: "bay robot " + i, room: r.room || "hangar", x: r.x, y: r.y })), ...(b.isfred.show ? [{ who: "isfred", room: "hangar", x: b.isfred.x, y: b.isfred.y }] : []), ...b.workers.filter((w) => w.show).map((w, i) => ({ who: "worker " + i, room: "hangar", x: w.x, y: w.y }))];
  });

  // ---------- small helpers ----------
  const go = (step, extra) => {
    Object.assign(B(), { step, t0: E().time() }, extra || {});
    record.steps.push(step);
  };
  const busy = () => {
    const e = E();
    e.set("ctrl", false);
    e.set("act", null);
    e.set("ch1Chip", "");
    e.still("sq");
    e.still("mops");
    e.chipNow();
  };
  const CHIPS = { counter: "chip-follow", hallway: "chip-follow", cargo: "chip-cargo", sneak: "chip-plant", peek: "chip-peek", take: "chip-take", eat: "chip-eat", talkto: "chip-talk", spit: "chip-spit", box: "chip-box", give: "chip-give", home: "chip-home", walkby: "chip-home", hall: "chip-hall" };
  /** Control at one of the player's steps. */
  function control(step) {
    const e = E();
    go(step);
    e.set("ch1Step", "bay-" + step);
    e.set("ch1Chip", bayWords(CHIPS[step]));
    e.chipNow();
    e.set("ctrl", true);
  }
  // A line: its words, its style ("say", the thought's "whisper", the ear's overheard bubble).
  const say = (id) => {
    const l = bayLine(id),
      e = E();
    return e.say(l.who, l.text, l.style === "think" || l.style === "whisper" ? "whisper" : "say", l.style === "ear");
  };
  const wait = (s) => {
    const e = E();
    let t0 = null;
    return e.until(() => (t0 == null && (t0 = e.time()), e.time() - t0 >= s));
  };
  // someone of this beat's own (Isfred, a worker, a robot) walks to (x, y); true there
  // (round the room's furniture where the straight line would cross it, room-model.js robotStep: every walker and
  // robot of this beat, in the room it is in; a straight line that is clear walks exactly as before)
  const moverIds = new WeakMap();
  let moverCount = 0;
  const moverId = (o) => (moverIds.has(o) || moverIds.set(o, "bay-mover-" + moverCount++), moverIds.get(o));
  const moveTo = (o, x, y, speed, dt) => robotStep(moverId(o), o, x, y, speed, dt || 0, o.room || "hangar", bayStepStraight);
  const along = (o, way, speed, dt) => {
    o.wi = o.wi || 0;
    while (o.wi < way.length && moveTo(o, way[o.wi].x, way[o.wi].y, speed, dt)) o.wi++;
    return o.wi >= way.length ? ((o.wi = 0), true) : false;
  };
  const pastMops = (to) => [BAY.door, BAY.door.step, ...BAY_SPOTS.behindMops, to];
  const outWay = () => [BAY.door.step, BAY.door, BAY.door.off];
  // Mops or Squatch (the engine's people) along a way
  const engineWay = (who, way, speed) => {
    const e = E();
    let i = 0;
    return e.until((dt) => {
      who === "mops" && e.moWalking(true);
      const p = way[Math.min(i, way.length - 1)],
        at = e.pos(who);
      Math.abs(p.x - at.x) > 1 && e.face(who, p.x > at.x ? 1 : -1);
      e.step(who, p.x, p.y, speed, dt || 0) && i++;
      e.trail();
      if (i >= way.length) return (who === "mops" && e.moWalking(false), e.still(who), true);
      return false;
    });
  };
  const bothWays = (mWay, sWay, speed) => {
    const e = E(),
      at = { mops: 0, sq: 0 };
    return e.until((dt) => {
      e.moWalking(true);
      let done = true;
      for (const [who, way] of [["mops", mWay], ["sq", sWay]]) {
        if (at[who] >= way.length) continue;
        const p = way[at[who]],
          now = e.pos(who);
        Math.abs(p.x - now.x) > 1 && e.face(who, p.x > now.x ? 1 : -1);
        e.step(who, p.x, p.y, speed, dt || 0) && at[who]++;
        done = done && at[who] >= way.length;
      }
      e.trail();
      done && (e.moWalking(false), e.still("mops"), e.still("sq"));
      return done;
    });
  };
  const robot = (i) => B().robots[i];
  // a worker walks left along the front to below the ramp, up it and into the ship (fading in its doorway)
  const climb = (i) =>
    E().until((dt) => {
      const w = B().workers[i];
      if (!w.show) return true;
      const there = along(w, [{ x: BAY.rampFoot.x, y: w.y > BAY.arch.foot + 10 ? BAY_SPOTS.workers[i].y : w.y }, BAY.rampFoot, BAY.shipDoor], P.people, dt);
      w.a = w.y < BAY.rampFoot.y ? Math.max(0, (w.y - BAY.shipDoor.y) / (BAY.rampFoot.y - BAY.shipDoor.y)) : 1;
      (there || w.a <= 0.02) && (w.show = false);
      return !w.show;
    });
  const codeText = () => {
    const e = E();
    return OFFICE_CODE;
  };
  const playAs = (who, cardId) => {
    const e = E();
    e.switchTo && e.switchTo(who === "mops" ? "mops" : "squatch", cardId ? bayWords(cardId) : "");
    B().asMops = who === "mops";
  };

  // ---------- the world at the start of each part (jumps and ↺) ----------
  function freshWorld() {
    return {
      step: "",
      t0: 0,
      ship: 0,
      ramp: 0,
      isfred: { x: BAY.door.off.x, y: BAY.door.off.y, f: 1, show: false, look: 0 },
      workers: BAY_SPOTS.workers.map((w, i) => ({ x: BAY.door.off.x, y: BAY.door.off.y, f: 1, show: false, a: 1, name: w.name, tool: TOOLS[i], hat: i === 2 })),
      robots: BAY_SPOTS.robots.map(() => ({ x: BAY.shipDoor.x, y: BAY.shipDoor.y, f: 0, show: false, room: "hangar", arm: 0, carry: "" })),
      crates: 0, // the new crates: 0 on the ship, then down the ramp (1)
      emptyCrate: { x: BAY_SPOTS.emptyCrate.x, y: BAY_SPOTS.emptyCrate.y, show: true },
      box: "ship", // the little tagged box: on the ship, at the ramp's foot, in Mops's hoof, with Squatch
      hatOnFloor: false,
      papers: { where: "none", white: true, bite: 0, flyAt: -1 },
      sign: -1,
      formStage: 0,
      closeUp: null,
      point: false,
      outline: false,
      shadow: 0,
      hidden: false,
      ball: false,
      sweatAt: -1,
      slotAt: -1,
      letter: null,
      stopAt: -1,
      passAt: -1,
      camera: !CAMERA_INSTALL_SCENE, // the security camera is up (round 7, q: 123; bay-camera.js)
      installAt: -1,
      turnAt: -1,
      shimmer: false,
      asMops: false,
      office: 0,
      officeShut: 0, // (round 7, r5 3:58: the office door slides shut again once the robot is gone, so the hallway's door looks as in every other scene)
      rollBy: -1,
      alarm: null,
      people: {},
      seenBy: "",
      seenT: 0,
      qs: {},
      hall: null,
      laterSaid: false,
      waveAt: -1,
    };
  }
  // Each part's end, set at once (a jump to a later part sets every earlier part's end).
  const FINISH = {
    arrive(b) {
      b.ship = 1;
      b.ramp = 1;
      b.ball = true;
    },
    robots(b) {
      b.isfred = { ...b.isfred, ...BAY_SPOTS.isfred, show: true, f: 1 };
      b.robots.forEach((r, i) => Object.assign(r, BAY_SPOTS.robots[i], { show: true, f: 2 }));
      b.crates = 1;
      b.box = "ramp";
      b.emptyCrate.show = false;
    },
    talk(b, e) {
      b.ball = false;
      b.hidden = true;
      e.place("sq", BAY.plant.stand.x, BAY.plant.stand.y);
      e.set("sqPose", "hidden");
      b.workers.forEach((w) => (w.show = false));
      b.hatOnFloor = true;
      b.camera = true;
      b.robots.forEach((r, i) => (r.carry = TOOLS[i]));
    },
    promise(b) {
      b.isfred.f = 1;
    },
    form(b) {
      b.ship = 0;
      b.ramp = 0;
      Object.assign(b.robots[0], BAY.door.off, { show: false });
      b.papers.where = "office";
    },
    back(b) {
      Object.assign(b.robots[0], BAY_SPOTS.robotToMops, { show: true, f: -1, arm: 0 });
      b.papers = { where: "mops-mouth", white: false, bite: 1, flyAt: -1 };
      b.asMops = true;
    },
    orders(b) {
      b.robots.forEach((r) => (r.show = false));
    },
  };
  /** Sets the bay as it is at the start of `part`: Squatch behind the cargo or in the plant, Mops watching. */
  function worldAt(part) {
    const e = E(),
      b = freshWorld();
    e.set("ch1Bay", b);
    e.enterRoom("hangar", "QB");
    e.place("sq", BAY.cargo.ball.x, BAY.cargo.ball.y);
    e.face("sq", 1);
    e.set("sqPose", "stand");
    e.set("moPose", "stand");
    e.place("mops", BAY_SPOTS.mopsWatch.x, BAY_SPOTS.mopsWatch.y);
    e.face("mops", 1);
    for (const p of BAY_PARTS) {
      if (p === part) break;
      FINISH[p] && FINISH[p](b, e);
    }
    b.ball && e.set("sqPose", "ball");
    return b;
  }

  // ---------- 28: the snack's ship (behind the snack counter) ----------
  /** The lunch sneak's end hands over here (14-ch1-day2.js ch1ShipCall). */
  function start() {
    const e = E();
    ff = {};
    moFF = {};
    e.set("ch1Bay", freshWorld());
    busy();
    go("pa");
    e.queue([...["pa-ship", "sq-stars-ship", "sq-new-kind", "sq-crate-kind", "mops-maybe", "mops-see", "sq-come", "mops-once", "mops-hide-when"].map(say), e.run(walkToHallway)]);
  }

  // ---------- 29: up into the hallway (held), the hallway (walked), into the bay ----------
  // (round 7, r5 0:20: "The players should have the options to stand up and walk. This shouldn't be a cut scene
  // because if they get up at the wrong time they could get caught." Mops goes on ahead; then the player has him behind
  // the counter, ducked, and he stands up and walks out to the hallway doorway himself when he chooses, under the
  // lunch crowd's own cones and the one capture rule (lunch-sneak.js runs the hall's sight until he is out of it).)
  const HALL_DOOR = { x: 952, y: 312 };
  function walkToHallway() {
    const e = E();
    busy();
    go("walk");
    e.walkOff();
    e.queue([engineWay("mops", [COUNTER_SPOTS.top, HALL_DOOR], P.walk), e.run(() => e.set("moPose", "hidden")), e.run(atCounter)]);
  }
  /** The counter step: ducked behind the counter (the lunch's own ducked pose), the hallway doorway outlined. */
  function atCounter() {
    const e = E(),
      lu = e.get("ch1Lunch");
    lu && (lu.pose = "ducked");
    e.set("sqPose", "stand");
    control("counter");
  }
  // the lunch's sight is on in the hall until he walks out (its alarm, its hiding: ducked in the counter's aisle)
  const lunchNow = () => {
    const lu = E().get("ch1Lunch");
    return lu && lu.step === "handoff" ? lu : null;
  };
  // seen standing at the counter: "Squatch: hide", and the place to hide is back down behind the counter (its aisle)
  const COUNTER_HIDE = { x0: AISLE.x0, x1: AISLE.x1, y0: AISLE.y0, y1: AISLE.y0 + 90 };
  const counterHide = () => {
    const lu = lunchNow();
    return !!lu && !!lu.alarm && lu.alarm.phase !== "calm" && lu.alarm.phase !== "caught" && lu.pose === "stand";
  };
  const inCounterAisle = (p) => p.x > AISLE.x0 && p.x < AISLE.x1 && p.y > AISLE.y0 && p.y < AISLE.y1 + 8;
  function counterTick(b, dt, free) {
    const e = E(),
      lu = lunchNow(),
      s = e.pos("sq");
    const O = LUNCH_PLACES.door.opening,
      atDoor = s.x >= O.x0 && s.x <= O.x1 && s.y >= O.y0 && s.y <= O.y1;
    // (never stuck: with the lunch's sight gone, the doorway still takes him through)
    if (!lu) return void (free && atDoor && throughHallDoor());
    // back in the aisle he ducks behind the counter again (the lunch stands him up once he is out of it)
    free && lu.pose === "stand" && inCounterAisle(s) && (lu.pose = "ducked");
    // after the lunch's alarm (seen, then hidden through the search): the goal is the doorway again
    const follow = bayWords("chip-follow");
    if (!lu.alarm && free && e.get("ch1Chip") !== follow) (e.set("ch1Chip", follow), e.chipNow());
    if (free && !lu.alarm && atDoor) throughHallDoor();
  }
  function throughHallDoor() {
    const e = E();
    busy();
    go("walk");
    e.walkOff();
    e.queue([
      engineWay("sq", [HALL_DOOR], P.walk),
      e.run(() => {
        e.enterRoom("passage", "QB");
        e.set("moPose", "stand");
        // (Mops went through first: a stride ahead of him, not on him)
        e.place("mops", HALLWAY.left.x + 100, HALLWAY.left.y + 6);
        e.place("sq", HALLWAY.left.x, HALLWAY.left.y);
        e.face("mops", 1);
        e.face("sq", 1);
      }),
      // Mops goes on ahead to the bay's end and waits there; the hallway is his to walk
      e.run(() => control("hallway")),
    ]);
  }
  function intoBay() {
    const e = E();
    busy();
    go("arrive");
    e.walkOff();
    e.queue([
      bothWays([{ x: HALLWAY.right.x, y: HALLWAY.right.y }], [{ x: HALLWAY.right.x, y: HALLWAY.right.y + 4 }], P.walk),
      e.run(() => {
        e.enterRoom("hangar", "QB");
        e.place("mops", BAY.door.edge.x + 24, BAY.door.edge.y);
        e.place("sq", BAY.door.edge.x, BAY.door.edge.y + 4);
      }),
      bothWays([BAY.door, BAY.door.step, BAY_SPOTS.mopsIn], [BAY.door, BAY.door.step, BAY_SPOTS.sqIn], P.walk),
      e.run(() => (e.face("mops", 1), e.face("sq", 1), sound.morning("door"))),
      ...partsFrom("arrive"),
    ]);
  }
  /** ROLL · ball behind the cargo: then the robots come. */
  function rollBehindCargo() {
    const e = E(),
      b = B();
    e.place("sq", BAY.cargo.ball.x, BAY.cargo.ball.y);
    e.still("sq");
    e.stopWalk && e.stopWalk();
    e.set("sqPose", "ball");
    b.ball = true;
    e.sfx("hide");
    busy();
    e.queue(partsFrom("robots"));
  }
  /** HIDE · plant: into the plant, eyes only; the words are clear now. */
  function hideInPlant() {
    const e = E(),
      b = B();
    e.place("sq", BAY.plant.stand.x, BAY.plant.stand.y);
    e.still("sq");
    e.stopWalk && e.stopWalk();
    e.set("sqPose", "hidden");
    b.hidden = true;
    b.ball = false;
    b.seenBy = "";
    b.seenT = 0;
    e.sfx("hide");
    busy();
    e.queue(partsFrom("talk"));
  }

  // ---------- the parts that play by themselves ----------
  function partsFrom(part) {
    const e = E(),
      out = [];
    for (const p of BAY_PARTS.slice(BAY_PARTS.indexOf(part))) {
      out.push(e.run(() => go(p)), ...PARTS[p]());
      // a part that ends in a step the player controls stops the run here
      if (STOPS[p]) {
        out.push(e.run(STOPS[p]));
        break;
      }
    }
    return out;
  }
  const STOPS = {
    arrive: () => control("cargo"),
    robots: () => control("sneak"),
    promise: () => control("peek"),
    back: () => control("take"),
    orders: () => control("talkto"),
  };
  // 30 (round 7, q: 123): "And a camera. Just in case." Robot 3 rolls under the big wall vent, its arm reaches up and
  // the camera goes on the wall; "I never watch the tapes. Unless something goes wrong."
  const CAMERA_BOX = { x0: BAY_CAMERA.game.x - 44, x1: BAY_CAMERA.game.x + 14, y0: BAY_CAMERA.game.y - 16, y1: BAY_CAMERA.game.y + 28 };
  function putUpCamera(r) {
    const e = E();
    return [
      e.run(() => (B().isfred.f = 1)),
      say("isfred-camera"),
      e.run(() => (r().f = 2)),
      e.until((dt) => along(r(), BAY_SPOTS.cameraWay, P.robot, dt)),
      e.run(() => ((r().f = 2), (r().arm = 1), (B().installAt = e.time()), sound.morning("rustle"))),
      e.until(() => e.time() - B().installAt >= P.install),
      e.run(() => ((B().camera = true), (B().installAt = -1), (r().arm = 0), e.sfx("bleep"))),
      e.until((dt) => along(r(), [...BAY_SPOTS.cameraWay].reverse().concat([BAY_SPOTS.robots[2]]), P.robot, dt)),
      e.run(() => ((r().f = 2), (B().isfred.f = 1), (B().camGlow = true))),
      say("isfred-tapes"),
      e.run(() => ((B().isfred.f = -1), (B().camGlow = false))),
    ];
  }
  const PARTS = {
    // 29: the ship docks as they come in; footsteps and Isfred's shadow in the doorway; Mops's cue
    arrive() {
      const e = E();
      return [
        e.until((dt) => ((B().ship = Math.min(1, B().ship + (dt || 0) / P.dock)), B().ship >= 1)),
        e.until((dt) => ((B().ramp = Math.min(1, B().ramp + (dt || 0) / P.ramp)), B().ramp >= 1)),
        e.run(() => sound.morning("hoof")),
        e.until((dt) => ((B().shadow = Math.min(1, B().shadow + (dt || 0) / P.shadow)), B().shadow >= 1)),
        e.run(() => (e.face("mops", -1), e.face("sq", -1))),
        say("mops-manager"),
        say("mops-hide"),
      ];
    },
    // 30: Isfred in; the robots down under the arch; crates down, the empty crate up; Isfred, muffled
    robots() {
      const e = E();
      return [
        e.until((dt) => {
          const b = B();
          let all = true;
          b.robots.forEach((r, i) => {
            if (r.done) return;
            // (the far one first, so nobody rolls through a robot already standing in its place)
            if (e.time() - b.t0 < (b.robots.length - 1 - i) * 0.7) return void (all = false);
            if (!r.show) ((r.show = true), (r.x = BAY.shipDoor.x), (r.y = BAY.shipDoor.y), (r.f = 0), e.sfx("bleep"));
            along(r, [BAY.rampFoot, BAY_SPOTS.robots[i]], P.robot, dt) && ((r.done = true), (r.f = 2));
            if (!r.done && r.y < BAY.rampFoot.y - 1) r.f = 0;
            all = all && !!r.done;
          });
          return all;
        }),
        e.run(() => B().robots.forEach((r) => ((r.done = false), (r.moving = false)))),
        say("scanner-proceed"),
        // the new crates slide down the ramp, the little tagged box last; last week's empty crate goes up it
        e.until((dt) => ((B().crates = Math.min(1, B().crates + (dt || 0) / 1.4)), B().crates >= 1)),
        e.run(() => (B().box = "ramp")),
        e.until((dt) => {
          const c = B().emptyCrate;
          const there = along(c, [BAY.rampFoot, BAY.shipDoor], P.robot * 0.8, dt);
          there && (c.show = false);
          return there;
        }),
        // the shadow was Isfred's: he walks in past Mops to the ramp's foot
        e.run(() => ((B().isfred.show = true), (B().shadow = 0))),
        e.until((dt) => along(B().isfred, pastMops(BAY_SPOTS.isfred), P.people, dt)),
        e.run(() => (B().isfred.f = 1)),
        say("isfred-muffled"),
      ];
    },
    // 30, from the plant: the letter, why the robots came, the workers' goodbye, Lou's hat
    talk() {
      const e = E();
      const r2 = () => robot(2);
      return [
        // the robot that patrolled goes back to its place
        e.until((dt) => moveTo(robot(1), BAY_SPOTS.robots[1].x, BAY_SPOTS.robots[1].y, P.robot, dt) && ((robot(1).f = 2), true)),
        // (round 7, r5 3:21, q: 133: no robot posts a letter at the mailbox any more; the mail came down the ramp with
        // the little box, and stays beside it)
        // why the robots came, and the thought
        e.run(() => (B().isfred.f = -1)),
        say("isfred-not-sure"),
        say("isfred-fur"),
        say("isfred-convinced"),
        e.run(() => (B().sweatAt = e.time())),
        say("sq-was-me"),
        // (round 7, r6 7:46, q: 123: Isfred adds a camera, and Robot 3 puts it up, upper right by the speaker; from now on it
        // is on every picture of the bay, its red light on: bay-camera.js)
        ...(CAMERA_INSTALL_SCENE ? putUpCamera(r2) : []),
        // the three workers come in carrying their things, past Mops
        e.run(() => B().workers.forEach((w) => ((w.show = true), (w.done = false)))),
        e.until((dt) => {
          const b = B();
          let all = true;
          b.workers.forEach((w, i) => {
            const before = b.workers[i - 1];
            if (w.done) return;
            if (before && !before.done && before.x < BAY.door.step.x + 10) return void (all = false);
            along(w, [BAY.door, BAY.door.step, BAY_SPOTS.behindMops[0], ...BAY_SPOTS.workerWay, { x: BAY_SPOTS.workers[i].x, y: BAY_SPOTS.workerWay[1].y }, BAY_SPOTS.workers[i]], P.people, dt) && (w.done = true);
            all = all && !!w.done;
          });
          return all;
        }),
        e.run(() => B().workers.forEach((w) => ((w.f = -1), (w.done = false), (w.wi = 0)))),
        e.run(() => (B().isfred.f = 1)),
        say("isfred-names"),
        say("isfred-thanks"),
        say("isfred-take-it"),
        // each hands a tool to a robot (Bob's broom upside down)
        ...[0, 1, 2].flatMap((i) => [
          e.run(() => (robot(i).f = 0)),
          e.until((dt) => moveTo(robot(i), BAY_SPOTS.robots[i].x, BAY_SPOTS.robots[i].y + 22, P.robot, dt)),
          e.run(() => ((robot(i).f = 0), (B().workers[i].f = 2), (B().workers[i].tool = ""), (robot(i).carry = TOOLS[i]), sound.morning("rustle"))),
          ...(i === 0 ? [say("dot-toaster")] : i === 1 ? [say("bob-way-up")] : []),
          e.until((dt) => moveTo(robot(i), BAY_SPOTS.robots[i].x, BAY_SPOTS.robots[i].y, P.robot, dt) && ((robot(i).f = 2), true)),
        ]),
        // they walk to the ramp (left along the front, then up it) and into the ship; the arch stops Lou's fuzzy hat
        ...[0, 1].map((i) => climb(i)),
        e.until((dt) => along(B().workers[2], [{ x: BAY.rampFoot.x, y: BAY_SPOTS.workers[2].y }, { x: BAY.rampFoot.x, y: BAY.arch.foot + 8 }], P.people, dt)),
        e.run(() => ((B().stopAt = e.time()), e.sfx("bleep"))),
        say("scanner-stop"),
        say("lou-hat"),
        // (round 7, r5 1:59, q: 116: fur stops, hair goes. He takes the hat off and leaves it; the arch lets his hair through)
        e.run(() => ((B().workers[2].hat = false), (B().hatOnFloor = true), (B().stopAt = -1), sound.morning("rustle"))),
        wait(0.5),
        e.run(() => ((B().passAt = e.time()), e.sfx("bleep"))),
        say("scanner-hair"),
        say("lou-hair"),
        e.run(() => ((B().passAt = -1), (B().workers[2].wi = 0))),
        climb(2),
        e.run(() => playBleat()),
        say("mops-bleat-short"),
      ];
    },
    // 31: the promise
    promise() {
      const e = E();
      return [e.run(() => (B().isfred.f = -1)), wait(0.3), say("isfred-dont-worry"), say("isfred-love"), say("isfred-visitors"), e.run(() => playBleat()), say("mops-bleat-happy")];
    },
    // 32: the form in the close-up, one thing a tap, then the robot off to the office, the workers' call, the ship goes
    form() {
      const e = E(),
        stage = (n) => e.run(() => (B().formStage = n));
      return [
        e.run(() => {
          const b = B();
          b.papers.where = "robot0";
          b.papers.white = true;
          Object.assign(robot(0), BAY_SPOTS.robotSign, { f: -1, arm: 1, show: true });
          b.isfred.f = 1;
          b.closeUp = { id: "form", at: e.time() };
          b.formStage = 0;
          sound.morning("rustle");
        }),
        wait(P.grow),
        say("robot-sign"),
        e.run(() => (B().formStage = 1)), // the box is outlined
        say("robot-tick"),
        stage(2),
        say("isfred-no-need"),
        say("isfred-ganitor"),
        e.run(() => ((B().formStage = 3), (B().sign = e.time()), sound.morning("scribble"))), // he signs; the box stays empty
        say("isfred-attraction"),
        e.run(() => ((B().formStage = 4), (robot(0).f = 1))), // he hands it over; the robot turns to go
        say("isfred-office"),
        e.run(() => ((B().formStage = 5), (robot(0).f = -1))),
        say("isfred-wait"),
        e.run(() => ((B().formStage = 6), (B().codeAt = e.time()), sound.morning("scribble"))),
        say("isfred-code"),
        e.until(() => e.time() - B().codeAt >= P.code + 0.3),
        e.run(() => ((B().closeUp = null), (B().formStage = 7))),
        // the robot rolls off to the office with the whole form
        e.until((dt) => {
          const r = robot(0);
          const there = along(r, [...BAY_SPOTS.officeWay, BAY.door.step, BAY.door, BAY.door.off], P.robot, dt);
          there && ((r.show = false), (B().papers.where = "office"));
          return there;
        }),
        // (round 7, r5 2:26, q: 133: Dot's "Isfred! We're leaving!" is cut; Isfred just waves them off)
        // Isfred waves at the ramp's foot; the workers are aboard; the ramp goes up, the ship leaves
        e.run(() => ((B().isfred.f = 1), (B().point = true))),
        e.until((dt) => moveTo(B().isfred, BAY.rampFoot.x - 70, BAY.rampFoot.y + 40, P.people, dt)),
        e.run(() => sound.morning("door")),
        e.until((dt) => ((B().ramp = Math.max(0, B().ramp - (dt || 0) / P.ramp)), B().ramp <= 0)),
        e.until((dt) => ((B().ship = Math.max(0, B().ship - (dt || 0) / P.leave)), B().ship <= 0)),
        e.run(() => (B().point = false)),
        e.until((dt) => moveTo(B().isfred, BAY_SPOTS.isfred.x, BAY_SPOTS.isfred.y, P.people, dt)),
        // Isfred goes back to work, out by the doorway
        e.until((dt) => {
          const I = B().isfred;
          const there = along(I, outWay(), P.people, dt);
          there && (I.show = false);
          return there;
        }),
      ];
    },
    // 33: the player is Mops; the robot comes back with the two other copies
    back() {
      const e = E();
      return [
        e.run(() => playAs("mops", "card-mops")),
        e.run(() => {
          Object.assign(robot(0), BAY.door.off, { show: true, arm: 1, wi: 0 });
          B().papers = { where: "robot0", white: false, bite: 0, flyAt: -1 };
        }),
        e.until((dt) => along(robot(0), pastMops(BAY_SPOTS.robotToMops), P.robot, dt)),
        e.run(() => ((robot(0).f = -1), e.face("mops", 1))),
        say("robot-copies"),
        say("mops-take"),
      ];
    },
    // 34: the robots' orders, and they leave by the doorway
    orders() {
      const e = E();
      return [
        say("robot-office"),
        say("robot-hall"),
        say("robots-cleaning"),
        e.until((dt) => {
          const b = B();
          let all = true;
          b.robots.forEach((r, i) => {
            if (!r.show) return;
            if (e.time() - b.t0 < [0, 1.6, 0.6][i]) return void (all = false);
            const way = i === 0 ? [BAY_SPOTS.behindMops[1], BAY_SPOTS.behindMops[0], BAY.door.step, BAY.door, BAY.door.off] : [{ x: r.x, y: BAY_SPOTS.robotsOut[0].y }, ...BAY_SPOTS.robotsOut, BAY.door.step, BAY.door, BAY.door.off];
            along(r, way, P.robot, dt) && (r.show = false);
            all = all && !r.show;
          });
          return all;
        }),
      ];
    },
    // 36, the hallway's end: the lines, then beat 37
    after() {
      const e = E();
      return [say("mops-robots"), say("sq-fur"), say("mops-paperwork"), e.run(finish36)];
    },
  };
  function playBleat() {
    bridge.playSoundPick && bridge.playSoundPick("mops-bleat");
  }

  // ---------- 33 to 35: the player is Mops ----------
  function takeCopies() {
    const b = B();
    busy();
    b.papers.where = "mops-hoof";
    robot(0).arm = 0;
    sound.morning("rustle");
    control("eat");
  }
  function eatCopies() {
    const e = E(),
      b = B();
    busy();
    b.closeUp = { id: "bite", at: e.time() };
    e.queue([
      wait(P.grow + 0.2),
      e.run(() => ((B().papers.where = "mops-mouth"), (B().biteAt = e.time()))),
      e.until(() => {
        const q = B(),
          k = Math.min(1, (e.time() - q.biteAt) / P.bite);
        k >= 0.5 && q.papers.bite === 0 && sound.morning("chomp");
        q.papers.bite = k >= 0.5 ? 1 : 0;
        return k >= 1;
      }),
      say("mops-delicious"),
      e.run(() => (B().closeUp = null)),
      ...partsFrom("orders"),
    ]);
  }
  function talkToSquatch() {
    const e = E();
    busy();
    e.face("mops", -1);
    B().closeUp = { id: "plant", at: e.time() };
    e.queue([wait(P.grow), say("mops-mumble"), say("sq-gumbling"), say("sq-paper-mouth"), e.run(() => control("spit"))]);
  }
  function spitInBin() {
    const e = E();
    busy();
    e.face("mops", -1);
    Object.assign(B().papers, { where: "flying", flyAt: e.time() });
    e.queue([
      e.until(() => e.time() - B().papers.flyAt >= P.spit),
      e.run(() => ((B().papers.where = "bin"), sound.morning("flop"))),
      say("mops-ptoo"),
      say("mops-see-squatch"),
      e.run(() => ((B().closeUp = null), control("box"))),
    ]);
  }
  function pickUpBox() {
    busy();
    B().box = "mops";
    sound.morning("rustle");
    control("give");
  }
  function giveBox() {
    const e = E();
    busy();
    e.face("mops", -1);
    B().box = "sq";
    e.queue([
      say("mops-mail"),
      e.run(() => (B().closeUp = { id: "tag", at: e.time() })),
      wait(P.grow + 0.6),
      say("sq-never-forget"),
      e.run(() => ((B().closeUp = null), (B().heartAt = e.time()))),
      wait(1.0),
      say("mops-home"),
      say("mops-close"),
      e.run(() => {
        playAs("squatch", "card-squatch");
        const b = B();
        b.hidden = false;
        e.set("sqPose", "stand");
        e.place("sq", BAY_SPOTS.sqOut.x, BAY_SPOTS.sqOut.y);
        e.face("sq", -1);
        sound.effect("hide");
        control("home");
      }),
    ]);
  }

  // ---------- 36: the hallway, the hairball ----------
  function intoHallway() {
    const e = E();
    busy();
    e.walkOff();
    e.queue([
      bothWays([BAY.door, BAY.door.edge], [BAY.door, BAY.door.edge], P.walk),
      e.run(() => {
        e.enterRoom("passage", "QB");
        // (inside the hallway's walk bounds, x 60 to 900: the player steers from here)
        e.place("sq", HALLWAY.exitRight, HALLWAY.right.y);
        e.place("mops", HALLWAY.exitRight - 70, HALLWAY.right.y + 40); // (beside him, not on him)
        e.face("sq", -1);
        e.face("mops", -1);
        const b = B();
        b.office = 0;
        b.officeShut = 0;
        b.rollBy = -1;
        // Robot 1 is in the office, cleaning it, with the door shut
        Object.assign(robot(0), { x: HALLWAY.robotOut.x, y: HALLWAY.officeDoor.y0 + 30, show: false, room: "passage", f: 2 });
        control("walkby");
      }),
    ]);
  }
  function doorOpens() {
    const e = E(),
      b = B();
    b.office = 0.001;
    // (round 7, r5 3:45, q: 133: the robot comes out looking the other way first, so the player has a moment to see it
    // and curl up himself; then it turns up the hallway toward him and he has rollTime more)
    b.turnAt = e.time() + P.lookAway;
    b.rollBy = b.turnAt + P.rollTime;
    Object.assign(robot(0), { show: true, x: HALLWAY.robotOut.x, y: HALLWAY.officeDoor.y0 + 20, f: 0 }); // (0: facing out of the picture, away from the hallway's floor)
    sound.morning("door");
  }
  // rolled up in time: the robot looks at the ball, Mops answers for it
  function hairball() {
    const e = E();
    busy();
    e.set("sqPose", "ball");
    B().ball = true;
    B().rollBy = -1;
    const s = e.pos("sq");
    e.queue([
      // Mops steps up beside the ball, between it and the robot
      e.until((dt) => (e.moWalking(true), e.face("mops", -1), e.step("mops", s.x + 52, s.y + 36, P.hurry, dt || 0) && (e.moWalking(false), e.still("mops"), true))),
      e.run(() => (B().closeUp = { id: "hairball", at: e.time() })),
      wait(P.grow),
      say("robot-what"),
      say("mops-hairball"),
      say("robot-compute"),
      e.run(() => (B().closeUp = null)),
      // the robot rolls off to the great hall; he unrolls
      e.until((dt) => {
        const r = robot(0);
        const there = moveTo(r, HALLWAY.left.x - 60, HALLWAY.left.y, P.robot, dt);
        there && (r.show = false);
        return there;
      }),
      e.run(() => {
        B().ball = false;
        e.set("sqPose", "stand");
        e.face("sq", -1);
        e.face("mops", -1);
      }),
      ...partsFrom("after"),
    ]);
  }
  function finish36() {
    const e = E();
    // beat 37 follows: the rebuilt evening when it is there (its start() walks on from here), else the older program
    const evening = bridge.beat("ch1-evening");
    go("done");
    e.face("sq", 1);
    e.face("mops", -1);
    if (evening && evening.start) return evening.start();
    // no evening module: on to 36b at once (the photo wall is the evening's)
    startHallSneak();
  }

  // ---------- 36b: the party hall, three cleaning robots ----------
  /** The evening calls this when the player walks into the hall after the photo wall (beat 37). */
  function startHallSneak() {
    const e = E(),
      b = B() && B().step ? B() : (e.set("ch1Bay", freshWorld()), B());
    b.alarm = null;
    b.seenBy = "";
    b.seenT = 0;
    b.qs = {};
    b.hidden = false;
    b.ball = false;
    b.warmRoom = ""; // (a new scene: his first-sight hearts again, mops-hearts.js)
    b.hall = {
      robots: HALL_SNEAK.lanes.map((L, i) => ({ id: "cleaner" + i, x: L.x0 + (L.x1 - L.x0) * L.at, y: L.y, dir: L.dir, lane: i, f: L.dir, stop: 0, streak: [] })),
      blockedSaid: false,
      t: 0,
    };
    b.people = Object.fromEntries(b.hall.robots.map((r) => [r.id, { x: r.x, y: r.y, hx: r.x, hy: r.y, ax: 0, ay: 0 }]));
    e.enterRoom("hall", "QB");
    e.set("sqPose", "stand");
    e.set("moPose", "stand");
    e.place("sq", HALL_SNEAK.in.x, HALL_SNEAK.in.y);
    e.place("mops", HALL_SNEAK.mopsIn.x, HALL_SNEAK.mopsIn.y);
    e.face("sq", -1);
    e.face("mops", -1);
    // round 7 (Brian r5 4:49; q: 119): Mops says where to hide as they walk in, and HIDE · bar is the goal
    const ev = bridge.beat("ch1-evening"),
      line = ev && ev.barLine && ev.barLine();
    if (!line) return control("hall");
    go("hall");
    busy();
    e.queue([e.say("mops", line), e.run(() => (control("hall"), e.set("ch1Chip", ev.barChip()), e.chipNow()))]);
  }
  /** HIDE · bar (the evening's words and place, evening.js barSpot): the evening takes over, with the robots where they are. */
  function hideBehindBar() {
    const b = B(),
      ev = bridge.beat("ch1-evening");
    busy();
    go("done");
    ev.startStorm({ robots: b.hall.robots.map((r) => ({ id: r.id, x: r.x, y: r.y, f: r.f, dir: r.dir, lane: r.lane, streak: r.streak.slice() })), said: !!b.hall.blockedSaid });
  }
  // (without the evening module: he crosses to the counter's front, and the robots roll out)
  function hallDone() {
    const b = B();
    busy();
    // the robots' cleaning is done: they roll out of the hall through the hallway doorway before the storm (nobody
    // vanishes: the evening's hall has no cleaning robots), round the counter, the stools and the crates
    go("hallout");
    // (first up from its lane to the back strip, then along it: its cone, the way it rolls, points away from him at the
    // counter's front)
    const way = (a, z) => findPath(a, z, LUNCH_BOUNDS, LUNCH_SOLIDS) || [z];
    for (const r of b.hall.robots) {
      const up = { x: r.x, y: HALL_SNEAK.out.y + 12 };
      r.stop = 0;
      r.route = [...way({ x: r.x, y: r.y }, up), ...way(up, HALL_SNEAK.out), HALL_SNEAK.gone];
    }
  }
  // every frame of "hallout": the robots roll on along their ways; once all are out, the storm (38a) begins
  function hallOutTick(b, dt) {
    for (const r of b.hall.robots) {
      const w = r.route[0];
      if (!w) continue;
      const d = Math.hypot(w.x - r.x, w.y - r.y),
        k = Math.min(d, P.robot * dt);
      d > 0.5 && ((r.x += ((w.x - r.x) / d) * k), (r.y += ((w.y - r.y) / d) * k));
      Math.abs(w.x - r.x) > Math.abs(w.y - r.y) ? (r.f = w.x > r.x ? 1 : -1) : (r.f = w.y > r.y ? 0 : 2);
      d - k < 0.5 && r.route.shift();
    }
    b.hall.robots.every((r) => !r.route.length) && hallOver();
  }
  function hallOver() {
    const e = E();
    go("done");
    const evening = bridge.beat("ch1-evening");
    if (evening && evening.startStorm) return evening.startStorm();
    e.sixDays && e.sixDays();
  }

  // ---------- sight and the one capture rule (the bay's sneak, the hallway, the hall) ----------
  // Squatch's drawn outline at this room's size (the hall's outline scaled round his feet), as the cones see him.
  function outlineSees(c, sq, k) {
    for (const [ox, oy] of SQUATCH_OUTLINE) {
      const x = sq.x + ox * k,
        y = sq.y + oy * k;
      if (distToCone(x, y, c.ox, c.oy, c.a, c.half, c.len) <= 0 && !plantBetween(c.ox, c.oy, x, y)) return true;
    }
    return false;
  }
  // In the party hall the plants block sight (36b): a look that passes through a plant's leaves or pot stops there.
  function plantBetween(x0, y0, x1, y1) {
    if (room() !== "hall") return false;
    for (const pl of HALL.plants)
      for (const L of [pl.leaves, pl.pot])
        for (let i = 1; i < 12; i++) {
          const x = x0 + ((x1 - x0) * i) / 12,
            y = y0 + ((y1 - y0) * i) / 12;
          if (x > L.x0 && x < L.x1 && y > L.y0 && y < L.y1) return true;
        }
    return false;
  }
  const outlineK = () => (room() === "hall" ? 1 : SQ_K(room()) / E().hallSizes().squatch);
  const sqStanding = (b) => !b.hidden && !b.ball && E().get("sqPose") === "stand";
  const angleOf = (f) => (f === 1 ? 0 : f === -1 ? Math.PI : f === 2 ? -Math.PI / 2 : Math.PI / 2);
  /** The cones of everyone in this room who could see Squatch (robots, Isfred, the workers); never Mops's. */
  function watcherCones(b) {
    const r = room(),
      out = [];
    if (r === "hall" && b.hall) {
      // (robots always show their cones, near him or not: the shared rule)
      for (const q of b.hall.robots) out.push({ ...coneFrom(q.id, q.x, q.y, angleOf(q.f), CONE), who: "robot", always: true });
      return out;
    }
    for (const [i, q] of b.robots.entries()) if (q.show && q.room === r) out.push({ ...coneFrom("robot" + i, q.x, q.y, angleOf(q.f), CONE), who: "robot", always: true });
    if (r === "hangar") {
      b.isfred.show && out.push({ ...coneFrom("isfred", b.isfred.x, b.isfred.y, b.isfred.look ? -1.2 : angleOf(b.isfred.f), CONE), who: "official" });
      b.workers.forEach((w, i) => w.show && w.a > 0.5 && out.push({ ...coneFrom("worker" + i, w.x, w.y, angleOf(w.f), CONE), who: "worker" }));
    }
    return out;
  }
  function mopsCone() {
    const m = E().pos("mops");
    return coneFrom("mops", m.x, m.y, (m.f || 1) > 0 ? 0 : Math.PI, CONE);
  }
  function mopsSees(b) {
    const e = E();
    if (!sqStanding(b) || e.get("moPose") === "hidden" || b.asMops) return false;
    return outlineSees(mopsCone(), e.pos("sq"), outlineK());
  }
  // Where sight runs: the bay's sneak, the hallway walk, the hall's robots (the player controls him there)
  const SIGHT_STEPS = new Set(["sneak", "home", "walkby", "hall", "cargo"]);
  function sightTick(b, dt) {
    const e = E(),
      free = e.get("ctrl") && !e.current();
    if (b.alarm || !free || !SIGHT_STEPS.has(b.step) || b.asMops) return ((b.seenBy = ""), (b.seenT = 0), {});
    const s = e.pos("sq"),
      showing = {};
    const seen = sqStanding(b) ? watcherCones(b).find((c) => outlineSees(c, s, outlineK())) : null;
    // the ball fools a quick look, never a stare (R43: within 70 for 2 s)
    const ballSeen = b.ball ? watcherCones(b).find((c) => Math.hypot(c.x - s.x, c.y - s.y) < 70 && outlineSees(c, s, outlineK())) : null;
    const who = seen || ballSeen;
    if (!who) ((b.seenBy = ""), (b.seenT = 0));
    else {
      b.seenT = b.seenBy === who.id ? b.seenT + dt : 0;
      b.seenBy = who.id;
      showing[who.id] = b.seenT / (ballSeen && !seen ? 2 : BAY_HOLD);
      if (b.seenT >= (ballSeen && !seen ? 2 : BAY_HOLD)) raise(b, who);
    }
    return showing;
  }
  function placeId() {
    return room() === "hall" ? "" : room() === "passage" ? "bay-hallway" : "bay-day";
  }
  function raise(b, c) {
    const e = E(),
      at = c.id.startsWith("cleaner") ? b.hall.robots.find((r) => r.id === c.id) : c.id === "isfred" ? b.isfred : c.id.startsWith("worker") ? b.workers[+c.id.slice(6)] : robot(+c.id.slice(5));
    b.people[c.id] = b.people[c.id] || { x: at.x, y: at.y, hx: at.x, hy: at.y, ax: 0, ay: 0 };
    startAlarm(b, { id: c.id, x: at.x, y: at.y }, room() === "hall" ? "where-hall" : room() === "passage" ? "lockup-hallway" : "lockup-bay", c.who === "robot" ? "lockup-robot" : c.who === "official" ? "lockup-manager" : "lockup-worker", placeId());
    e.sfx("bleep");
    psound.sting();
    b.seenBy = "";
    b.seenT = 0;
  }
  // (the lockup card's who and where: the bay's own from its lines file, the hall's from the party's)
  const word = (id) => (id.startsWith("lockup-") ? bayWords(id) : partyLine(id));
  function alarmApi(b) {
    const e = E();
    return {
      E: e,
      size: () => ({ half: CONE.half, len: CONE.len }),
      sq: () => e.pos("sq"),
      hidden: () => (b.hidden ? "plant" : b.ball ? "ball" : ""),
      room: () => e.room(),
      people: () => b.people,
      firstTime: () => false,
      bell: () => psound.one("bell"),
      closeUp(done) {
        done();
      },
      sees: (c, sq) => outlineSees(c, sq, outlineK()),
      caught(whoId, whereId) {
        e.catchSquatch(partyLine("lockup-cause").replace("{who}", word(whoId)).replace("{where}", word(whereId)));
      },
      lost() {
        psound.one("lost");
        e.lostYou(partyLine("note-lost"));
      },
      calmDone() {
        b.alarm = null;
        control(b.step);
      },
    };
  }

  // ---------- every frame ----------
  function tick(dt) {
    const b = live(),
      e = E();
    if (!b) return;
    dt = dt || 0;
    const mo = e.pos("mops");
    moMoving = !!moLast && Math.hypot(mo.x - moLast.x, mo.y - moLast.y) > 0.3;
    moLast = { x: mo.x, y: mo.y };
    const s = e.pos("sq"),
      free = e.get("ctrl") && !e.current();
    if (["hangar", "passage", "hall"].includes(room())) {
      if (e.get("sqPose") === "stand" && footfall(ff, s.x, s.y, dt, HOME_MORNING_SOUND.padEvery)) sound.pad(pads++);
      e.get("moPose") !== "hidden" && footfall(moFF, mo.x, mo.y, dt, 0.32) && sound.morning("hoof", pads);
    }
    psound.tick();
    // moving takes him out of the ball (as the lunch's ROLL · ball)
    if (free && b.ball && e.steering() && b.step !== "cargo") ((b.ball = false), e.set("sqPose", "stand"));
    // the player's steps
    if (b.step === "counter" && room() === "hall") counterTick(b, dt, free);
    if (free && b.step === "hallway") hallwayTick(b, s);
    if (free && b.step === "home" && room() === "hangar" && s.x < BAY.door.x + 26 && Math.abs(s.y - BAY.door.y) < 40) intoHallway();
    // Mops follows him (the walk home, the hall)
    if (["home", "walkby", "hall"].includes(b.step) && !b.alarm && free) followSquatch(dt);
    if (b.step === "walkby" && room() === "passage") walkbyTick(b, s, dt, free);
    // (round 7, r5 3:58: "a different hallway door in the scene than in any other scene": once the robot has rolled
    // off, the office door slides shut again, the hallway's own grey door as everywhere else)
    if ((b.step === "walkby" || b.step === "after") && room() === "passage" && b.office >= 1 && !robot(0).show && b.rollBy < 0 && b.officeShut < 1)
      (b.officeShut === 0 && sound.morning("door"), (b.officeShut = Math.min(1, b.officeShut + dt / P.doorOpen)));
    if (b.step === "hall" && room() === "hall") hallTick(b, s, dt, free);
    if (b.step === "hallout" && room() === "hall") hallOutTick(b, dt);
    // the sneak: one robot rolls to and fro across the floor, looking the way it goes
    if (b.step === "sneak" && room() === "hangar" && !b.alarm && free) {
      const r = robot(1),
        Pt = BAY_SPOTS.patrol;
      r.dir = r.dir || -1;
      moveTo(r, r.dir < 0 ? Pt.x0 : Pt.x1, Pt.y, Pt.speed, dt) && (r.dir = -r.dir);
      r.f = r.dir < 0 ? -1 : 1;
    }
    // sight and the one capture rule
    const showing = sightTick(b, dt);
    tickQuestions(b, dt, showing);
    if (b.alarm) {
      tickAlarm(b, dt, alarmApi(b));
      if (b.alarm) for (const g of b.alarm.guards) footfall(g, g.x, g.y, dt, 0.45) && psound.one("step");
    }
  }
  function hallwayTick(b, s) {
    const e = E();
    // Mops goes ahead to the bay's end
    const m = e.pos("mops");
    if (Math.hypot(m.x - HALLWAY.mopsBay.x, m.y - HALLWAY.mopsBay.y) > 2) {
      e.moWalking(true);
      e.face("mops", 1);
      e.step("mops", HALLWAY.mopsBay.x, HALLWAY.mopsBay.y, P.walk, 1 / 60) && (e.moWalking(false), e.still("mops"), e.face("mops", -1));
    }
    // (round 7, r5 0:27, q: 133: "Later. The ship!" is cut, and with it the turn back at the photo wall)
    if (s.x > HALLWAY.exitRight && Math.abs(s.y - HALLWAY.right.y) < 46) intoBay();
  }
  function followSquatch(dt) {
    const e = E(),
      s = e.pos("sq"),
      m = e.pos("mops"),
      d = Math.hypot(s.x - m.x, s.y - m.y);
    if (d > 80) {
      e.moWalking(true);
      // (his spot beside Squatch moved off anything solid, the counter say: room-model.js; Brian r5 4:38, "the janitor is walking on the bar")
      const spot = bridge.freeSpot ? bridge.freeSpot("mops", s.x + (m.x > s.x ? 56 : -56), s.y + 30) : { x: s.x + (m.x > s.x ? 56 : -56), y: s.y + 30 },
        tx = spot.x,
        ty = spot.y;
      e.face("mops", tx > m.x ? 1 : -1);
      e.step("mops", tx, ty, P.walk, dt);
    } else (e.moWalking(false), e.still("mops"));
  }
  function walkbyTick(b, s, dt, free) {
    const e = E();
    if (b.office === 0 && s.x < HALLWAY.trigger && free) doorOpens();
    if (b.office > 0) b.office = Math.min(1, b.office + dt / P.doorOpen);
    const r = robot(0);
    if (r.show && b.rollBy > 0) moveTo(r, HALLWAY.robotOut.x, HALLWAY.robotOut.y, P.robot, dt) && (r.f = e.time() < (b.turnAt || 0) ? 0 : 2);
    // too slow: the robot sees fur
    if (b.rollBy > 0 && e.time() > b.rollBy && !b.ball && !b.alarm) {
      b.rollBy = -1;
      raise(b, { id: "robot0", who: "robot" });
    }
    // past the robot and on to the hall's end: beat 37
    if (free && !b.alarm && b.rollBy < 0 && b.office >= 1 && !robot(0).show && s.x < HALLWAY.exitLeft) partsFromAfter();
  }
  function partsFromAfter() {
    busy();
    E().queue(partsFrom("after"));
  }
  function hallTick(b, s, dt, free) {
    const e = E(),
      h = b.hall;
    if (!h) return;
    h.t += dt;
    const m = e.pos("mops");
    for (const r of h.robots) {
      const L = HALL_SNEAK.lanes[r.lane];
      if (b.alarm) continue;
      if (r.stop > 0) {
        r.stop -= dt;
        continue;
      }
      // a robot that meets Mops in its lane stops, says its line, and goes round him
      const ahead = { x: r.x + r.dir * 40, y: r.y };
      if (free && Math.hypot(ahead.x - m.x, ahead.y - m.y) < 34) {
        r.stop = 0.6;
        if (!h.blockedSaid) {
          h.blockedSaid = true;
          e.set("ctrl", false);
          e.queue([say("robot-move"), say("mops-corner"), say("robot-corners"), e.run(() => e.set("ctrl", true))]);
        }
        r.y += r.y < m.y ? -1 : 1; // (round him)
        continue;
      }
      r.y += (L.y - r.y) * Math.min(1, dt * 2);
      r.x += r.dir * P.mop * dt;
      r.f = r.dir;
      if (r.x > L.x1 || r.x < L.x0) {
        r.x = Math.max(L.x0, Math.min(L.x1, r.x));
        r.dir = -r.dir;
        r.f = r.dir;
        e.ambient && e.ambient("robot", bayWords("robot-turn"), "say");
      }
      r.streak.push({ x: r.x, y: r.y + 4 });
      r.streak.length > 40 && r.streak.shift();
      // the first grey streak Mops walks by: he looks at it and shakes his head (the Mop-Off's setup, no words)
      if (!h.shookAt && r.streak.some((q) => Math.hypot(q.x - m.x, q.y - m.y) < 40)) h.shookAt = h.t;
      b.people[r.id] && Object.assign(b.people[r.id], { x: r.x, y: r.y, hx: r.x, hy: r.y });
    }
    if (h.shookAt && h.t - h.shookAt < 0.9) e.face("mops", Math.floor((h.t - h.shookAt) / 0.15) % 2 ? 1 : -1);
    // the snack counter's front: the storm (38a) begins
    if (!barSpot() && free && !b.alarm && Math.hypot(s.x - HALL_SNEAK.goal.x, s.y - HALL_SNEAK.goal.y) < HALL_SNEAK.goal.r) hallDone();
  }

  // ---------- spots ----------
  // 36b's goal when the evening is there: HIDE · bar (evening.js barSpot), else null (the counter's front, walked to)
  const barSpot = () => {
    const ev = bridge.beat("ch1-evening");
    return ev && ev.barSpot ? ev.barSpot() : null;
  };
  function spots() {
    const b = live(),
      e = E();
    if (!b || !e.get("ctrl") || b.alarm) return [];
    const s = e.pos("sq"),
      words = (id) => bayWords(id).split(" · ");
    const spot = (id, wordId, who, x, y, r, f, extra) => {
      const [verb, cap] = words(wordId);
      return { id, verb, cap, who, x, y, r, f, ...(extra || {}) };
    };
    const L = BAY.plant.leaves;
    if (b.step === "cargo" && room() === "hangar") return [spot("bay-cargo", "button-ball", "sq", BAY.cargo.ball.x, BAY.cargo.ball.y, 48, rollBehindCargo, { thing: BAY.cargo.box, at: [(BAY.cargo.box.x0 + BAY.cargo.box.x1) / 2, BAY.cargo.box.y0] })];
    // (the plant's id is the one its outline is filed under: goal-targets.js "hangar:d2-HIDE-plant")
    if (b.step === "sneak" && room() === "hangar") return [spot("d2-HIDE-plant", "button-hide", "sq", BAY.plant.stand.x, BAY.plant.stand.y, 60, hideInPlant, { thing: L, at: [(L.x0 + L.x1) / 2, L.y0] })];
    if (b.step === "peek") return [spot("bay-peek", "button-peek", "sq", s.x, s.y, 40, () => (busy(), E().queue(partsFrom("form"))), { hot: true, at: [BAY.plant.eyes.x, BAY.plant.eyes.y - 30] })];
    const mo = "mo";
    if (b.step === "take") return [spot("bay-take", "button-take", mo, BAY_SPOTS.mopsWatch.x, BAY_SPOTS.mopsWatch.y, 70, takeCopies, { hot: true })];
    if (b.step === "eat") return [spot("bay-eat", "button-eat", mo, BAY_SPOTS.mopsWatch.x, BAY_SPOTS.mopsWatch.y, 90, eatCopies, { hot: true })];
    if (b.step === "talkto") return [spot("bay-talk", "button-talk", mo, BAY_SPOTS.talk.x, BAY_SPOTS.talk.y, 56, talkToSquatch, { thing: L, at: [(L.x0 + L.x1) / 2, L.y0] })];
    if (b.step === "spit") return [spot("bay-spit", "button-spit", mo, BAY_SPOTS.spit.x, BAY_SPOTS.spit.y, 110, spitInBin, { thing: BAY.bin.box, at: [BAY.bin.x, BAY.bin.box.y0] })];
    if (b.step === "box") return [spot("bay-box", "button-box", mo, BAY_SPOTS.boxPick.x, BAY_SPOTS.boxPick.y, 52, pickUpBox, { at: [BAY_SPOTS.box.x, BAY_SPOTS.box.y - 30] })];
    if (b.step === "give") return [spot("bay-give", "button-give", mo, BAY_SPOTS.talk.x, BAY_SPOTS.talk.y, 60, giveBox, { thing: L, at: [(L.x0 + L.x1) / 2, L.y0] })];
    if (b.step === "walkby" && b.rollBy > 0 && !b.ball) return [{ ...spot("bay-roll", "button-ball", "sq", s.x, s.y, 40, hairball), hot: true, at: [s.x, s.y - 80] }];
    // places walked into, no button (as the lunch's doorway): the hallway's far doorway, the bay's doorway home, along
    // the hallway home (past the office door, then its far end), the snack counter in the party hall
    const walkTo = (id, x, y, r) => ({ id, verb: "", cap: "", who: "sq", x, y, r });
    if (b.step === "counter" && room() === "hall" && counterHide()) return [walkTo("bay-counter-hide", COUNTER_SPOTS.sq.x, AISLE.y0 + 40, 24)];
    if (b.step === "counter" && room() === "hall" && !(lunchNow() && lunchNow().alarm)) return [walkTo("bay-hall-door", LUNCH_PLACES.door.walkTo.x, LUNCH_PLACES.door.walkTo.y, 24)];
    if (b.step === "hallway" && room() === "passage") return [walkTo("bay-door", HALLWAY.exitRight + 12, HALLWAY.right.y, 24)];
    if (b.step === "home" && room() === "hangar") return [walkTo("bay-home", BAY.door.x + 18, BAY.door.y, 24)];
    if (b.step === "walkby" && room() === "passage" && b.office === 0) return [walkTo("bay-walk", HALLWAY.trigger - 40, HALLWAY.right.y + 30, 24)];
    if (b.step === "walkby" && room() === "passage" && b.rollBy < 0 && !robot(0).show) return [walkTo("bay-walk", HALLWAY.exitLeft - 12, HALLWAY.left.y + 10, 24)];
    if (b.step === "hall" && room() === "hall") {
      const H = barSpot();
      const out = [H ? { id: "bay-hide-bar", verb: H.verb, cap: H.cap, who: "sq", x: H.x, y: H.y, r: H.r, thing: H.thing, at: [(H.thing.x0 + H.thing.x1) / 2, H.thing.y0], f: hideBehindBar } : walkTo("bay-counter", HALL_SNEAK.goal.x, HALL_SNEAK.goal.y, 24)];
      !b.ball && out.push({ ...spot("bay-ball", "button-ball", "sq", s.x, s.y, 40, () => ((B().ball = true), E().set("sqPose", "ball"), E().sfx("hide"))), hot: true, at: [s.x, s.y - 80] });
      return out;
    }
    return [];
  }
  // what the player must go to next: the one highlight round it (the plant's is the older program's traced outline)
  function highlightNow(b) {
    const e = E();
    // the camera glows while Isfred talks about it (rule 4; round 7, q: 123)
    if (b.camGlow && room() === "hangar") return CAMERA_BOX;
    if (!e.get("ctrl") || b.alarm || e.current()) return null;
    if (b.step === "counter" && room() === "hall") return counterHide() ? COUNTER_HIDE : lunchNow() && lunchNow().alarm ? null : LUNCH_PLACES.door.box;
    if (b.step === "hallway" && room() === "passage") return { x0: 912, x1: 948, y0: 266, y1: 354 };
    if (b.step === "cargo" && room() === "hangar") return BAY.cargo.box;
    if ((b.step === "talkto" || b.step === "give") && room() === "hangar") return { x0: BAY.plant.leaves.x0, x1: BAY.plant.leaves.x1, y0: BAY.plant.leaves.y0, y1: 372 };
    if (b.step === "spit") return BAY.bin.box;
    if (b.step === "box" && b.box === "ramp") return { x0: BAY_SPOTS.box.x - 16, x1: BAY_SPOTS.box.x + 16, y0: BAY_SPOTS.box.y - 22, y1: BAY_SPOTS.box.y + 4 };
    if (b.step === "home" && room() === "hangar") return { x0: 20, x1: 48, y0: 266, y1: 354 };
    if (b.step === "hall" && room() === "hall") return barSpot() ? barSpot().thing : HALL_SNEAK.goalBox;
    return null;
  }

  // ---------- drawing ----------
  const ease = (u) => u * u * (3 - 2 * u);
  function drawPicture(ctx, b) {
    const e = E();
    e.drawLocked(ctx, BAY_PICTURES.noship);
    if (b.ship > 0) {
      const W = BAY.window;
      ctx.save();
      ctx.globalAlpha = ease(Math.min(1, b.ship));
      ctx.beginPath();
      ctx.rect(W.x0, W.y0, W.x1 - W.x0, W.y1 - W.y0);
      ctx.clip();
      e.drawLocked(ctx, BAY_PICTURES.day);
      ctx.restore();
    }
    if (b.ramp > 0) {
      const R = BAY.ramp;
      ctx.save();
      ctx.beginPath();
      ctx.rect(R.x0, R.y0, R.x1 - R.x0, (R.y1 - R.y0) * ease(Math.min(1, b.ramp)));
      ctx.clip();
      e.drawLocked(ctx, BAY_PICTURES.day);
      ctx.restore();
    }
    if (b.papers.where === "bin") {
      ctx.save();
      ctx.beginPath();
      ctx.rect(BAY.bin.box.x0 - 30, 0, 100, BAY.bin.top + 2);
      ctx.clip();
      drawStuck(ctx, BAY.bin.x + 2, BAY.bin.top - 4, 22, b.papers.bite, 0.35);
      ctx.restore();
    }
    b.shadow > 0 && drawDoorShadow(ctx, BAY.door.x, BAY.door.y + 8, b.shadow);
  }
  const mopsK = (r = room()) => (r === "hall" ? E().hallSizes().squatch * 1.15 : SQ_K(r) * 1.15);
  function mouthAt() {
    const m = E().pos("mops"),
      k = mopsK(),
      f = m.f || 1;
    return { x: m.x + f * 24 * k, y: m.y - 25 * k };
  }
  function hoofAt() {
    const m = E().pos("mops"),
      k = mopsK(),
      f = m.f || 1;
    return { x: m.x + f * 16 * k, y: m.y - 16 * k };
  }
  // Everyone in the bay, back to front, with what each carries.
  function drawPeople(ctx, b, t) {
    const e = E(),
      s = e.pos("sq"),
      m = e.pos("mops"),
      list = [];
    if (sqStanding(b)) list.push({ y: s.y, f: () => e.drawSquatch(ctx, s.x, s.y, SQ_K("hangar"), { f: s.f || 1, walk: e.walkPhase() }) });
    if (b.ball && e.ball) list.push({ y: s.y, f: () => e.ball.drawOn(ctx, s.x, s.y - 16 * (SQ_K("hangar") / 1.65), SQ_K("hangar") / 1.65) });
    // the cargo by the doorway: in front of the ball behind it
    list.push({ y: BAY.cargo.box.y1, f: () => drawCargo(ctx, BAY.cargo.box) });
    // the new crates, down the ramp; the little box; last week's empty crate; Lou's hat on the floor
    if (b.crates > 0) {
      const u = ease(Math.min(1, b.crates)),
        x = BAY.rampFoot.x + (BAY_SPOTS.crates.x - BAY.rampFoot.x) * u,
        y = BAY.shipDoor.y + (BAY_SPOTS.crates.y - BAY.shipDoor.y) * u;
      list.push({ y, f: () => (drawBayCrate(ctx, x, y, 54, true), drawBayCrate(ctx, x + 2, y - 34, 48, true)) });
    }
    // the little box came down the ramp with the mail: two letters lie beside it (round 7, r5 3:02, q: 133)
    b.box === "ramp" && list.push({ y: BAY_SPOTS.box.y, f: () => (drawMailBeside(ctx, BAY_SPOTS.box.x, BAY_SPOTS.box.y), drawTaggedBox(ctx, BAY_SPOTS.box.x, BAY_SPOTS.box.y), (mailDrawn = true)) });
    if (b.emptyCrate.show) {
      const c = b.emptyCrate,
        a = c.y < BAY.rampFoot.y ? Math.max(0, (c.y - BAY.shipDoor.y) / (BAY.rampFoot.y - BAY.shipDoor.y)) : 1;
      list.push({ y: c.y, f: () => (ctx.save(), (ctx.globalAlpha = a), drawBayCrate(ctx, c.x, c.y, 46), drawTag(ctx, c.x + 20, c.y - 20, bayWords("crate-empty")), ctx.restore()) });
    }
    b.hatOnFloor && list.push({ y: BAY.arch.foot + 14, f: () => drawFuzzyHat(ctx, BAY.rampFoot.x - 40, BAY.arch.foot + 14, 1.7) }); // (big enough to read as a hat on a phone)
    if (e.get("moPose") !== "hidden")
      list.push({
        y: m.y,
        f: () => {
          const mouth = b.papers.where === "mops-mouth" || b.papers.where === "flying" ? "o" : undefined;
          e.drawMopsOn(ctx, m.x, m.y, mopsK("hangar"), { f: m.f || 1, walk: moMoving ? t * 9 : 0, mouth });
          if (b.papers.where === "mops-hoof") {
            const h = hoofAt();
            drawStuck(ctx, h.x, h.y, 13, 0, 0.2);
          }
          if (b.papers.where === "mops-mouth") {
            const p = mouthAt();
            drawStuck(ctx, p.x + (m.f || 1) * 6, p.y + 2, 17, b.papers.bite, (m.f || 1) * 0.25);
            b.biteAt != null && drawBiteCrumbs(ctx, p.x, p.y + 6, Math.min(1, (t - b.biteAt) / 0.9), 0.8);
          }
          if (b.papers.where === "flying") {
            const p = mouthAt(),
              u = Math.min(1, (t - b.papers.flyAt) / P.spit),
              x = p.x + (BAY.bin.x - p.x) * u,
              y = p.y + (BAY.bin.top - 4 - p.y) * u - Math.sin(u * Math.PI) * 40;
            drawStuck(ctx, x, y, 14, b.papers.bite, u * 4);
          }
          b.box === "mops" && drawTaggedBox(ctx, hoofAt().x, hoofAt().y + 6, 1);
        },
      });
    if (b.isfred.show)
      list.push({
        y: b.isfred.y,
        f: () => {
          const I = b.isfred,
            k = ISFRED_K();
          ctx.save();
          ctx.translate(I.x, I.y);
          ctx.scale(k, k);
          e.drawIsfred(ctx, 0, 0, I.f || 1);
          ctx.restore();
          b.point && drawWave(ctx, I.x + 14, I.y - 64, t);
        },
      });
    b.workers.forEach((w) => {
      if (!w.show) return;
      list.push({
        y: w.y,
        f: () => {
          ctx.save();
          ctx.globalAlpha = Math.max(0, Math.min(1, w.a));
          e.drawWorker(ctx, w.x, w.y, "");
          w.tool && drawTool(ctx, w.tool, w.x + 14, w.y - 22, false, 1);
          w.hat && drawFuzzyHat(ctx, w.x, w.y - 52, 1.6); // (round 7, r5 1:59: big enough to see on a phone)
          ctx.restore();
        },
      });
    });
    b.robots.forEach((r, i) => {
      if (!r.show || r.room !== "hangar") return;
      list.push({
        y: r.y,
        f: () => {
          const bob = r.moving ? Math.abs(Math.sin(t * 14)) * 2 : 0;
          drawRobot(ctx, r.x, r.y, r.f, 1, bob, r.arm || (r.carry ? 1 : 0));
          const h = robotHand(r.x, r.y - bob, r.f, 1, r.arm || (r.carry ? 1 : 0));
          if (i === 0 && b.papers.where === "robot0" && r.arm > 0.5) b.papers.white ? drawFormSet(ctx, h.x, h.y - 8, 16, true) : drawStuck(ctx, h.x, h.y - 8, 14, 0, 0);
          r.carry === "letter" && drawLetter(ctx, h.x, h.y - 6);
          r.carry && r.carry !== "letter" && drawTool(ctx, r.carry, h.x, h.y, r.carry === "broom", 1);
        },
      });
    });
    b.ramp >= 0.999 && list.push({ y: BAY.arch.foot, f: () => drawArchFront(ctx, b, t) });
    // the camera going up (round 7, q: 123): Robot 3's arm stretches up to the wall and the camera fades on
    if (b.installAt >= 0) {
      const r = robot(2),
        u = Math.min(1, (t - b.installAt) / P.install),
        h = robotHand(r.x, r.y, r.f, 1, 1),
        c = BAY_CAMERA.game;
      list.push({
        y: 9999,
        f: () => {
          ctx.save();
          ctx.strokeStyle = "#5b6475";
          ctx.lineWidth = 4;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(h.x, h.y);
          ctx.lineTo(h.x + (c.x - 6 - h.x) * u, h.y + (c.y + 14 - h.y) * u);
          ctx.stroke();
          ctx.restore();
          drawBayCamera(ctx, c.x, c.y, 0.98, u >= 1, Math.max(0, (u - 0.5) * 2));
        },
      });
    }
    list.sort((a, c) => a.y - c.y).forEach((p) => p.f());
    b.slotAt >= 0 && t - b.slotAt < 1.2 && drawSlotLight(ctx, BAY.mailbox.slot.x, BAY.mailbox.slot.y, 1 - (t - b.slotAt) / 1.2);
    b.sweatAt >= 0 && t - b.sweatAt < 2 && b.hidden && drawSweat(ctx, BAY.plant.eyes.x + 18, BAY.plant.eyes.y - 6, Math.min(1, (t - b.sweatAt) / 2));
    b.stopAt >= 0 && drawScannerStop(ctx, BAY.arch.field, Math.min(1, (t - b.stopAt) / P.flash), t);
    b.passAt >= 0 && drawScannerPass(ctx, BAY.arch.field, Math.min(1, (t - b.passAt) / P.flash), t);
  }
  function underArch(b) {
    const A = BAY.arch,
      inField = (o) => o.show && o.x > A.field.x0 && o.x < A.field.x1 && o.y > A.field.y0 + 4 && o.y < A.foot + 8;
    return [...b.robots.filter((r) => r.room === "hangar"), ...b.workers].find(inField) || null;
  }
  function drawArchFront(ctx, b, t) {
    const A = BAY.arch,
      e = E();
    ctx.save();
    ctx.beginPath();
    for (const r of [A.bar, ...A.posts]) ctx.rect(r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0);
    ctx.clip();
    e.drawLocked(ctx, BAY_PICTURES.day);
    ctx.restore();
    const who = underArch(b);
    b.shimmer = !!who && b.stopAt < 0;
    if (b.shimmer) {
      const F = A.field;
      ctx.save();
      ctx.beginPath();
      ctx.rect(F.x0, F.y0, F.x1 - F.x0, F.y1 - F.y0);
      ctx.clip();
      ctx.fillStyle = `rgba(140,215,255,${(0.22 + 0.08 * Math.sin(t * 20)).toFixed(3)})`;
      ctx.fillRect(F.x0, F.y0, F.x1 - F.x0, F.y1 - F.y0);
      ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        const y = F.y0 + (((t * 90 + i * ((F.y1 - F.y0) / 5)) % (F.y1 - F.y0)) | 0);
        ctx.strokeStyle = `rgba(110,200,255,${(0.75 - i * 0.08).toFixed(2)})`;
        ctx.beginPath();
        for (let x = F.x0; x <= F.x1; x += 12) ctx.lineTo(x, y + Math.sin(x * 0.08 + t * 14) * 2.5);
        ctx.stroke();
      }
      ctx.restore();
    }
  }
  /** Everyone's cones (dashed, yellow on him), and Mops's warm cone with hearts while it holds Squatch. */
  function drawAllCones(ctx, b, t, again = false) {
    const e = E(),
      s = e.pos("sq"),
      mops = e.get("moPose") !== "hidden" && !b.asMops ? mopsCone() : null,
      warm = mops && mopsSees(b);
    const cones = [...watcherCones(b), ...(b.alarm ? guardCones(b.alarm, { half: CONE.half, len: CONE.len }) : [])];
    const out = drawCones(ctx, [...cones, ...(mops && !warm ? [mops] : [])], s, !sqStanding(b), false, again ? null : (c) => e.noteCone(c));
    // (his hearts only the first time his cone holds Squatch in this room: mops-hearts.js, question 126)
    warm && b.warmRoom !== room() && ((b.warmRoom = room()), (b.warmAt = t));
    warm && (drawHeartCone(ctx, mops.ox, mops.oy, mops.a, mops.half, mops.len, t, 1, t - b.warmAt), out.push({ ...mops, inside: false, show: 1, hearts: true, heartsUp: firstSightHeartsUp(t - b.warmAt) }));
    return out;
  }
  // the "?" filling over whoever is looking at him, and "!" over the one who saw him
  function drawMarks(ctx, b, t) {
    const cones = watcherCones(b);
    for (const q of questions(b)) {
      const c = cones.find((x) => x.id === q.id);
      c && drawMark(ctx, c.x + 16, c.y - 72, "?", 26, t, q);
    }
    const a = b.alarm;
    a && a.phase === "shout" && drawMark(ctx, a.w.x + 18, a.w.y - 76, "!", 34, t);
  }
  function drawScene(ctx, b, t, again = false) {
    const e = E();
    drawPicture(ctx, b);
    const cones = drawAllCones(ctx, b, t, again);
    b.hidden && e.drawEyes(ctx, BAY.plant.eyes.x, BAY.plant.eyes.y);
    drawPeople(ctx, b, t);
    if (b.alarm) for (const g of b.alarm.guards.filter((q) => q.room === "hangar")) drawPerson(ctx, g.x, g.y, adultPxFor("hangar") * 1.02, LOOKS.guard, Math.cos(g.a) < 0 ? -1 : 1, t);
    drawMarks(ctx, b, t);
    // one heart over Mops after he gives the box (hearts are for Squatch)
    if (b.heartAt != null && t - b.heartAt < 1.5) {
      const m = e.pos("mops");
      drawHeart(ctx, m.x, m.y - 74 - (t - b.heartAt) * 14, 8);
    }
    return cones;
  }
  function drawCloseUp(ctx, b, t) {
    const c = b.closeUp;
    if (!c || !BAY_CLOSEUPS[c.id]) return null;
    const C = BAY_CLOSEUPS[c.id],
      u = Math.min(1, (t - c.at) / P.grow),
      box = closeUpBox(C.src, C.dst, u);
    drawCloseUpBack(ctx, C.src, box);
    let parts = null;
    ctx.save();
    ctx.beginPath();
    ctx.rect(box.x0, box.y0, box.x1 - box.x0, box.y1 - box.y0);
    ctx.clip();
    if (c.id === "form") {
      const st = b.formStage,
        signEl = b.sign >= 0 ? t - b.sign : 0,
        codeEl = st >= 6 ? t - (b.codeAt || t) : 0,
        text = codeText();
      parts = drawFormCloseUp(ctx, box, {
        sign: st >= 3 ? Math.max(0, Math.min(1, signEl / P.sign)) : 0,
        code: st >= 6 ? Math.max(0, Math.min(text.length, (codeEl / P.code) * text.length + 1)) : 0,
        codeText: text,
        pulse: st >= 1 && st < 3 ? 1 : 0,
        words: bayWords("order-box"),
        pen: st === 3 && signEl < P.sign ? "sign" : st >= 6 && codeEl < P.code ? "code" : null,
        t,
      });
    } else if (c.id === "tag") parts = drawTagCloseUp(ctx, box, bayWords("box-tag"), t);
    else {
      const k = (box.x1 - box.x0) / (C.src.x1 - C.src.x0);
      ctx.translate(box.x0 - C.src.x0 * k, box.y0 - C.src.y0 * k);
      ctx.scale(k, k);
      drawScene(ctx, b, t, true);
    }
    ctx.restore();
    drawCloseUpFront(ctx, box);
    return { id: c.id, box, u: +u.toFixed(2), parts };
  }
  // the hallway's close-up of the hairball: the robot's eye, Mops's face, the ball between (a copy of the picture, bigger)
  let hairCopy = null;
  function drawHairballCloseUp(ctx, b, t) {
    const c = b.closeUp;
    if (!c || c.id !== "hairball") return null;
    const s = E().pos("sq"),
      src = { x0: s.x - 90, y0: s.y - 150, x1: s.x + 150, y1: s.y + 30 },
      dst = { x0: 40, y0: 40, x1: 400, y1: 310 },
      u = Math.min(1, (t - c.at) / P.grow),
      box = closeUpBox(src, dst, u);
    if (typeof document === "undefined") return { id: "hairball", box };
    const m = ctx.getTransform(),
      sx = Math.round(m.a * src.x0 + m.e),
      sy = Math.round(m.d * src.y0 + m.f),
      sw = Math.max(1, Math.round(m.a * (src.x1 - src.x0))),
      sh = Math.max(1, Math.round(m.d * (src.y1 - src.y0)));
    hairCopy = hairCopy || document.createElement("canvas");
    (hairCopy.width !== sw || hairCopy.height !== sh) && ((hairCopy.width = sw), (hairCopy.height = sh));
    const cc = hairCopy.getContext("2d");
    cc.clearRect(0, 0, sw, sh);
    cc.drawImage(ctx.canvas, sx, sy, sw, sh, 0, 0, sw, sh);
    drawCloseUpBack(ctx, src, box);
    ctx.drawImage(hairCopy, 0, 0, sw, sh, box.x0, box.y0, box.x1 - box.x0, box.y1 - box.y0);
    drawCloseUpFront(ctx, box);
    return { id: "hairball", box, u: +u.toFixed(2) };
  }

  /** Over the hall (the PA's sound waves) and the hallway (the office door, Robot 1, the cones, the hairball close-up). */
  function drawOver(ctx) {
    const b = live(),
      e = E();
    if (!b) return;
    const t = e.time(),
      cur = e.current();
    if (room() === "hall" && b.step === "pa" && cur && cur.who === "pa") {
      drawSpeakerRing(ctx, HALL_SPEAKER, t);
      drew = { step: b.step, ring: "hall" };
    }
    if (room() === "hall" && b.step === "counter") {
      const hl = highlightNow(b);
      hl && drawDashedOutline(ctx, hl, t);
      drew = { step: b.step, room: "hall", outline: hl };
    }
    if (room() === "passage") {
      const hl = highlightNow(b);
      hl && drawDashedOutline(ctx, hl, t);
      b.office > 0 && b.officeShut < 1 && drawOfficeOpen(ctx, HALLWAY.officeDoor, b.office * (1 - b.officeShut));
      const k = ROBOT_K("passage"),
        robots = b.robots.filter((r) => r.show && r.room === "passage");
      const cones = drawAllCones(ctx, b, t);
      robots.forEach((r) => drawRobot(ctx, r.x, r.y, r.f, k, r.moving ? Math.abs(Math.sin(t * 14)) * 2 * k : 0, 0));
      b.ball && e.ball && drawBallAt(ctx, e, "passage");
      if (b.alarm) for (const g of b.alarm.guards.filter((q) => q.room === "passage")) drawPerson(ctx, g.x, g.y, adultPxFor("passage") * 1.02, LOOKS.guard, Math.cos(g.a) < 0 ? -1 : 1, t);
      drawMarks(ctx, b, t);
      const closeUp = drawHairballCloseUp(ctx, b, t);
      drew = { step: b.step, room: "passage", office: b.office, officeDrawn: b.officeShut < 1 ? b.office * (1 - b.officeShut) : 0, rollBy: b.rollBy, closeUp, outline: hl, cones: cones.map((c) => ({ id: c.id, inside: c.inside, show: c.show, hearts: !!c.hearts })), robots: robots.map((r) => ({ x: r.x, y: r.y, f: r.f, k })) };
    }
  }
  function drawBallAt(ctx, e, r) {
    const s = e.pos("sq"),
      k = SQ_K(r) / 1.65;
    e.ball.drawOn(ctx, s.x, s.y - 16 * k, k);
  }
  // 36b: the hall, drawn on the locked picture (the party's drawing), with the cleaning robots and their streaks
  function drawHallSneak(ctx, b) {
    const e = E(),
      t = e.time(),
      s = e.pos("sq"),
      k = e.hallSizes().squatch,
      h = b.hall,
      rk = ROBOT_K("hall");
    // (the lunch's stack of crates stays in the hall through the afternoon: the storm's hall has it too, evening.js)
    const extra = [{ y: LUNCH_PLACES.crate.box.y1, f: () => drawCrates(ctx) }];
    for (const r of h.robots) extra.push({ y: r.y, f: () => drawRobot(ctx, r.x, r.y, r.f, rk, r.stop > 0 ? 0 : Math.abs(Math.sin(t * 14)) * 2 * rk, 0) });
    b.ball && e.ball && extra.push({ y: s.y, f: () => e.ball.drawOn(ctx, s.x, s.y - 16 * (k / 1.65), k / 1.65) });
    const mo = e.pos("mops");
    extra.push({ y: mo.y, f: () => e.drawMopsOn(ctx, mo.x, mo.y, k * 1.15, { f: mo.f || 1, walk: moMoving ? t * 9 : 0 }) });
    const a = b.alarm;
    const hl = highlightNow(b);
    const cones = drawHall(ctx, e, bridge.guests, {
      t,
      picture: hallPic,
      banner: false,
      lights: null,
      isfred: null,
      band: null,
      guests: [],
      bartender: null,
      guards: a ? a.guards.filter((g) => g.room === "hall").map((g) => ({ x: g.x, y: g.y, f: Math.cos(g.a) < 0 ? -1 : 1 })) : [],
      cones: [...watcherCones(b), ...(a ? guardCones(a, CONE) : [])],
      noteCone: (c) => e.noteCone(c),
      unseen: !(e.get("ctrl") && !e.current()),
      vent: false,
      squatch: b.ball ? null : { x: s.x, y: s.y, f: s.f || 1, walk: e.walkPhase(), pose: "stand" },
      marks: [],
      floor: (c) => {
        for (const r of h.robots) drawStreak(c, r.streak);
        hl && drawDashedOutline(c, hl, t);
      },
      extra,
    });
    drawMarks(ctx, b, t);
    return cones;
  }

  return {
    start,
    startHallSneak,
    /**
     * ↺ in a part he does not control (no step start was saved for it): that part again. True when it did (20-ch2.js
     * reSec). At a step he controls false: the step restart brings it back.
     */
    restart() {
      const b = live();
      if (!b) return false;
      if (b.step === "pa") return (jump("pa"), true);
      if (b.step === "counter") return (jump("counter"), true);
      if (b.step === "walk") return (jump("hallway"), true);
      // (the lines after the hairball play in the hallway: ↺ there is the walk home through it again)
      if (b.step === "after") return (jump("walkby"), true);
      if (BAY_PARTS.includes(b.step)) return (jump(b.step), true);
      // (36b before control: ↺ during Mops's "Behind the bar. Quick." starts 36b again)
      if (b.step === "hall" && !E().get("ctrl")) return (startHallSneak(), true);
      return false;
    },
    jump,
    /** True while the one capture rule's alarm is on (no music then: bridge.js). */
    alarmOn() {
      const b = live();
      return !!(b && b.alarm);
    },
    alarmKey() {
      return live() || null;
    },
    /** True from beat 28's first line until beat 37 (and through 36b). */
    active() {
      return !!live();
    },
    /** True while this beat draws the room: the bay, and the hall in 36b. */
    ownsRoom() {
      const b = live();
      return !!b && (room() === "hangar" || (room() === "hall" && (b.step === "hall" || b.step === "hallout")));
    },
    tick,
    spots,
    drawRoom(ctx) {
      const b = live(),
        e = E();
      if (!b) return false;
      const t = e.time();
      if (room() === "hall" && (b.step === "hall" || b.step === "hallout")) {
        const cones = drawHallSneak(ctx, b);
        drew = { step: b.step, room: "hall", outline: highlightNow(b), cones: cones.map((c) => ({ id: c.id, inside: c.inside, show: c.show })), robots: b.hall.robots.map((r) => ({ x: r.x, y: r.y, f: r.f })) };
        return true;
      }
      if (room() !== "hangar") return false;
      const cones = drawScene(ctx, b, t);
      const hl = highlightNow(b);
      hl && drawDashedOutline(ctx, hl, t);
      const closeUp = drawCloseUp(ctx, b, t);
      drew = { step: b.step, room: "hangar", shimmer: !!b.shimmer, outline: hl, cones: cones.map((c) => ({ id: c.id, inside: c.inside, show: c.show, hearts: !!c.hearts, heartsUp: !!c.heartsUp })), closeUp, papers: b.papers.where, box: b.box, formStage: b.formStage, mail: mailDrawn, passing: b.passAt >= 0 };
      return true;
    },
    draw: drawOver,
    solids() {
      const b = live();
      if (!b) return [];
      const feet = (x, y) => ({ x0: x - 22, x1: x + 22, y0: y - 12, y1: y + 8, person: 1 });
      if (room() === "hall" && (b.step === "hall" || b.step === "hallout")) return [...LUNCH_SOLIDS, ...b.hall.robots.map((r) => feet(r.x, r.y))];
      if (room() !== "hangar") return [];
      return [BAY.cargo.solid, ...(b.isfred.show ? [feet(b.isfred.x, b.isfred.y)] : []), ...b.workers.filter((w) => w.show).map((w) => feet(w.x, w.y)), ...b.robots.filter((r) => r.show && r.room === "hangar").map((r) => feet(r.x, r.y))];
    },
    bounds() {
      return room() === "hall" ? LUNCH_BOUNDS : { x0: 60, x1: 900, y0: BAY.floorTop, y1: 590 };
    },
    /** True once the ship's ramp is down (the fur scanner's posts are there, and solid: 00-core.js CH1_FURNITURE). */
    docked() {
      const b = live();
      return !!b && b.ramp > 0.5;
    },
    /** Where a speaker's bubble points: the wall speakers, Isfred, the workers, the robot, the arch, Squatch's eyes. */
    speakerAt(who) {
      const b = live(),
        e = E();
      if (!b) return null;
      const r = room();
      if (who === "pa" && r === "hall") return { x: HALL_SPEAKER.x0, y: (HALL_SPEAKER.y0 + HALL_SPEAKER.y1) / 2 };
      if (r === "hall" && who === "robot" && b.hall) {
        const q = b.hall.robots.find((x) => x.stop > 0) || b.hall.robots[0];
        return { x: q.x, y: q.y - 80 };
      }
      if (r === "passage" && who === "robot" && robot(0).show) return { x: robot(0).x, y: robot(0).y - 100 };
      if (r !== "hangar") return null;
      const adult = adultPxFor("hangar");
      if (who === "official" && b.isfred.show) return { x: b.isfred.x, y: b.isfred.y - adult - 4 };
      if (who === "robot") {
        const q = b.robots.find((x) => x.show && x.room === "hangar");
        if (q) return { x: q.x, y: q.y - 70 };
      }
      if (["dot", "bob", "lou"].includes(who)) {
        const w = b.workers[["dot", "bob", "lou"].indexOf(who)];
        return { x: w.x, y: w.y - adult - 4 };
      }
      if (who === "scanner") return { x: (BAY.arch.bar.x0 + BAY.arch.bar.x1) / 2, y: BAY.arch.bar.y0 };
      if (who === "ups") return { x: BAY.mailbox.x, y: BAY.mailbox.slot.y - 30 };
      if (who === "sq" && b.hidden) return { x: BAY.plant.eyes.x, y: BAY.plant.eyes.y - 8 };
      if (who === "sq" && b.ball) return { x: e.pos("sq").x, y: e.pos("sq").y - 40 };
      return null;
    },
    /** The name over a speaker's bubble the game has no name for (the workers). */
    speakerName(who) {
      return live() ? BAY_SPEAKER_NAMES[who] || "" : "";
    },
    /** A bubble that sits beside its speaker: the hall speaker's (left of it); over the form close-up, at the top right. */
    bubbleBeside(who) {
      const b = live(),
        e = E();
      if (!b) return null;
      if (who === "pa" && room() === "hall") return { ...HALL_SPEAKER, side: "left" };
      if (b.closeUp && b.closeUp.id === "form" && ["official", "robot", "mops", "dot"].includes(who)) {
        // (top right, clear of the close-up; a short line sits further in, so the speaker's name tag over its left
        // edge stays on the picture)
        const cur = e.current && e.current(),
          text = (cur && cur.text) || "",
          right = text.length < 24 ? 800 : 950;
        return { x0: right, x1: right + 5, y0: 40, y1: 80, side: "left" };
      }
      if (room() === "passage" && ["after", "walkby", "hallway"].includes(b.step) && (who === "sq" || who === "mops")) {
        const s = e.pos("sq"),
          m = e.pos("mops"),
          me = who === "sq" ? s : m,
          other = who === "sq" ? m : s,
          tall = adultPxFor("passage") * (who === "sq" ? 0.8 : 0.92),
          reach = (f) => (who === "mops" && f ? tall * 0.85 : 26);
        return { x0: me.x - reach((me.f || 1) < 0), x1: me.x + reach((me.f || 1) > 0), y0: me.y - tall, y1: me.y, side: other.x > me.x ? "left" : "right" };
      }
      return null;
    },
    place: Object.freeze({ BAY, BAY_SPOTS, HALLWAY, HALL_SNEAK, BAY_CLOSEUPS, BAY_PARTS, BAY_STEPS, BAY_BEATS }),
    /** Tests: true when any watcher's cone holds Squatch now (his drawn outline at this room's size). */
    seenNow() {
      const b = live();
      return !!b && sqStanding(b) && watcherCones(b).some((c) => outlineSees(c, E().pos("sq"), outlineK()));
    },
    mopsSees() {
      const b = live();
      return !!b && mopsSees(b);
    },
    debug() {
      const b = B();
      return { state: b ? JSON.parse(JSON.stringify(b)) : null, active: !!live(), drew, steps: record.steps.slice(), sounds: sound.asked(), code: codeText() };
    },
  };

  /**
   * A test jump (ch1JumpBeat 28 to 36, ?beat=bay:<part or step>, tests, ↺): "pa" behind the counter, a step the player
   * controls with everything before it done, or the start of a part.
   */
  function jump(part) {
    const e = E();
    e.set("ctrl", false);
    // (a jump back forgets what came after: the evening, beats 37 to 42c, starts again from beat 36's end)
    e.set("ch1Evening", null);
    ff = {};
    moFF = {};
    const lu = e.get("ch1Lunch");
    part !== "pa" && part !== "counter" && lu && e.set("ch1Lunch", { ...lu, step: "done" });
    B() && B().asMops && playAs("squatch", "");
    if (part === "pa" || part === "counter") {
      const lunch = bridge.beat("ch1-lunch");
      if (lunch) {
        lunch.jump("snack");
        Object.assign(e.get("ch1Lunch"), { step: "handoff", pose: "stand", pie: "eaten", pies: 2 });
      }
      e.set("ctrl", false);
      e.set("ch1Chip", "");
      if (part === "pa") return start();
      // (the counter step again: Mops gone on ahead, Squatch ducked at his place behind the counter)
      e.set("ch1Bay", freshWorld());
      e.set("moPose", "hidden");
      e.place("mops", HALL_DOOR.x, HALL_DOOR.y);
      return atCounter();
    }
    if (part === "hallway") {
      e.set("ch1Bay", freshWorld());
      e.enterRoom("passage", "QB");
      e.set("sqPose", "stand");
      e.set("moPose", "stand");
      e.place("sq", HALLWAY.left.x + 60, HALLWAY.left.y + 20);
      e.place("mops", HALLWAY.left.x + 110, HALLWAY.left.y + 26);
      return control("hallway");
    }
    if (part === "hall") {
      e.set("ch1Bay", freshWorld());
      return startHallSneak();
    }
    // a step the player controls: its part's start, played to that step at once
    const atStep = { cargo: "arrive", sneak: "robots", peek: "promise", take: "back", eat: "back", talkto: "orders", spit: "orders", box: "orders", give: "orders", home: "orders", walkby: "orders" };
    if (atStep[part]) {
      const b = worldAt(atStep[part]);
      const before = BAY_PARTS.indexOf(atStep[part]);
      FINISH[atStep[part]] && FINISH[atStep[part]](b, e);
      b.ball = part === "cargo" ? false : b.ball;
      e.set("sqPose", b.hidden ? "hidden" : b.ball ? "ball" : "stand");
      if (part === "cargo") e.place("sq", BAY_SPOTS.sqIn.x, BAY_SPOTS.sqIn.y);
      if (part === "sneak") e.set("sqPose", "ball");
      if (before >= BAY_PARTS.indexOf("back")) playAs("mops", "");
      if (["eat"].includes(part)) b.papers.where = "mops-hoof";
      if (["talkto", "spit", "box", "give", "home", "walkby"].includes(part)) Object.assign(b.papers, { where: "mops-mouth", bite: 1 });
      if (["box", "give", "home", "walkby"].includes(part)) b.papers.where = "bin";
      if (part === "give") b.box = "mops";
      if (part === "talkto" || part === "spit" || part === "give") e.place("mops", BAY_SPOTS.talk.x, BAY_SPOTS.talk.y);
      if (part === "box") e.place("mops", BAY_SPOTS.spit.x, BAY_SPOTS.spit.y);
      if (part === "home" || part === "walkby") {
        playAs("squatch", "");
        b.hidden = false;
        b.box = "sq";
        e.set("sqPose", "stand");
        e.place("sq", BAY_SPOTS.sqOut.x, BAY_SPOTS.sqOut.y);
        e.place("mops", BAY_SPOTS.talk.x + 40, BAY_SPOTS.talk.y + 20);
      }
      if (part === "walkby") {
        control("home");
        return intoHallway();
      }
      return control(part);
    }
    if (!BAY_PARTS.includes(part)) return jump("pa");
    // (the part is on from now, not only once its first queued step runs)
    const b = worldAt(part);
    Object.assign(b, { step: part, t0: e.time() });
    if (BAY_PARTS.indexOf(part) > BAY_PARTS.indexOf("form")) playAs("mops", "");
    busy();
    e.queue(partsFrom(part));
  }
}
