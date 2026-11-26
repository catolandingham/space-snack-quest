/**
 * The loading bay, Chapter 1 beats 28 to 36 (docs/CH1-STORY-WALKTHROUGH.md; the newest decisions per beat as read on
 * 2026-11-26). It follows the lunch sneak (lunch-sneak.js hands over at its end through 14-ch1-day2.js ch1ShipCall) and
 * ends in the hallway, where beat 37 follows: the end of beat 36 calls the engine's walkHomeDone (the older program's
 * ch1WalkHomeDone), today Squatch's "go on" step in the hallway.
 * What the player sees, step by step (every word from loading-bay-lines.js, every place and number from
 * loading-bay-place.js, every new drawing from loading-bay-art.js; the drawings are PLACEHOLDERS):
 *   pa       (28) still behind the snack counter: the wall speaker, with sound waves coming off it, "Universal Postal
 *            Service ship arriving!" beside it; Mops "I better go see what that is."; Squatch "Please let me follow
 *            you, I'll be really sneaky."; Mops "Okay, just this time, but hide carefully." (each waits for NEXT)
 *   walk     (29) wordless: Mops leads him up the aisle and out through the hallway doorway, along the hallway (the
 *            first walk there is a cutscene: nothing in it can be used yet), into the loading bay. No ship yet.
 *   hide     (29) "Squatch: hide in the plant": the plant by the doorway is outlined; HIDE · plant: only his eyes, in the
 *            middle of the leaves. Nobody but Mops is in the bay yet (Mops's cone shows hearts), so nothing can catch him.
 *   arrive.. (30 to 35, watched from the plant; the kid taps NEXT through the lines, nothing else to do)
 *            arrive  Isfred and the three workers who are leaving (Dot, Bob, Lou) walk in past the plant
 *            dock    the ship glides into the window (the locked "day" picture fades in there), the ramp comes down
 *            robots  three robots roll down the ramp through the fur scanner
 *            shake   Isfred shakes each worker's hand; they walk up the ramp into the ship
 *            promise Isfred turns to Mops: "Mops, don't worry, ..."
 *            sign    a robot holds up the form set; a close-up grows out of it: the white copy, the big pink order
 *                    sheet with ORDER MORE ROBOTS and its box, the small yellow copy stuck under the pink. Isfred signs
 *                    the white, writes his office code on the pink, the numbers come through grey on the yellow, the
 *                    box is outlined; Mops: "So futuristic and we still order on paper."
 *            call    wordless: the wall speaker chimes (sound waves); Isfred looks up at it, gives the robot the papers,
 *                    points at the doorway and hurries out; the robot rolls out after him with the whole set
 *            back    the robot rolls back in holding only the pink and the yellow, stuck together, and stops by Mops:
 *                    "Left one of the copies in the office. What do I do with the other two?"; Mops "I'll take care of
 *                    it." takes them; the robot rolls back to the others
 *            vent    Mops walks round to the big wall vent and turns his back on the robots; a close-up of him biting
 *                    the corner off both copies: "Delicious." (nothing goes into the vent)
 *            plant   he walks over to the plant, the copies in his mouth; a close-up of him and the eyes in the leaves:
 *                    "Mmf mrrf!"; Squatch "You're gumbling! (goat mumbling)"; he turns and spits both copies, still
 *                    stuck, into the bin by the plant: "Ptoo!" (they stay there, poking out of the bin)
 *   home     (36) two robots roll out into the hallway; Mops waves him out of the plant (hearts: Mops sees him); they
 *            walk out together. In the hallway the two robots wait at the office door, turned to it: "We got to
 *            watch out for these robots." (they are outlined); as they pass, Squatch "What's the difference between fur and
 *            hair?", Mops "Paperwork."; the robots roll away into the bay; then beat 37 (walkHomeDone).
 * Nobody who could see Squatch is in the bay while he can move, and in beats 30 to 36 he has no control, so this beat
 * needs no capture of its own (CLAUDE.md, one capture rule): every cone is drawn, and tests/loading-bay.mjs checks that
 * none of them ever holds him. Its progress lives in the game-state field ch1Bay; ch1Step is "bay-hide" at the one step
 * the player controls, so the step restart (↺) brings that back. ↺ in a part he does not control: restart().
 */
import { BAY, BAY_SPOTS, HALLWAY, BAY_PACE, BAY_PICTURES, BAY_CLOSEUPS, BAY_PARTS } from "./loading-bay-place.js";
import { bayWords } from "./loading-bay-lines.js";
import { drawRobot, robotHand, drawFormSet, drawStuck, drawCrumbs, drawFormCloseUp, closeUpBox, drawCloseUpBack, drawCloseUpFront, drawWave, drawDashedOutline } from "./loading-bay-art.js";
import { drawSpeakerRing, drawHeartCone } from "./party-free-art.js";
import { HALL_SPEAKER } from "./party-hall.js";
import { COUNTER_SPOTS } from "./lunch-sneak-place.js";
import { coneFrom, coneSees, drawCones } from "./party-watch.js";
import { createHomeMorningSound, HOME_MORNING_SOUND } from "./home-morning-sound.js";
import { footfall } from "./footfalls.js";
import { adultPxFor } from "./room-sizes.js";

export const BAY_ID = "ch1-bay";
/** Which walkthrough beat each part plays (tests, ch1JumpBeat). */
export const BAY_BEATS = Object.freeze({ pa: 28, walk: 29, hide: 29, arrive: 30, dock: 30, robots: 30, shake: 30, promise: 31, sign: 32, call: 32, back: 33, vent: 33, plant: 34, home: 36 });
const SQ_K = () => (adultPxFor("hangar") * 0.8) / 45;
const MOPS_K = () => SQ_K() * 1.15;
// Isfred is drawn at the hall's size by the older program: in the bay he is the bay's grown-up.
const ISFRED_K = () => adultPxFor("hangar") / adultPxFor("hall");
const CONE = { half: 0.42, len: 210 };

export function createLoadingBay(bridge) {
  const E = () => bridge.engine();
  const sound = createHomeMorningSound(() => bridge.engine(), bridge.morningSound);
  const B = () => {
    const e = E();
    return e ? e.get("ch1Bay") : null;
  };
  const live = () => {
    const b = B(),
      e = E();
    return b && e && e.get("ch1Day2") && b.step && b.step !== "done" ? b : null;
  };
  let drew = null,
    ff = {},
    moFF = {},
    pads = 0,
    moLast = null,
    moMoving = false,
    record = { steps: [] };

  // ---------- small helpers ----------
  const go = (step) => {
    Object.assign(B(), { step, t0: E().time() });
    record.steps.push(step);
  };
  const busy = () => {
    const e = E();
    e.set("ctrl", false);
    e.set("act", null);
    e.set("ch1Chip", "");
    e.still("sq");
    e.chipNow();
  };
  // (the wall speaker's line too is an ordinary bubble, beside the speaker with sound waves coming off it: Brian's rule
  // for every speaker; the older program's "pa" style is a banner in the middle of the picture)
  const say = (who, id) => E().say(who, bayWords(id), "say");
  const wait = (s) => {
    const e = E();
    let t0 = null;
    return e.until(() => (t0 == null && (t0 = e.time()), e.time() - t0 >= s));
  };
  // someone of this beat's own (Isfred, a worker, a robot) walks to (x, y); true there
  const moveTo = (o, x, y, speed, dt) => {
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
  };
  // one frame of `o` going along `way` (it keeps its place on the way in o.wi); true at the end
  const along = (o, way, speed, dt) => {
    o.wi = o.wi || 0;
    while (o.wi < way.length && moveTo(o, way[o.wi].x, way[o.wi].y, speed, dt)) o.wi++;
    return o.wi >= way.length ? ((o.wi = 0), true) : false;
  };
  // in through the bay's doorway to `to`, and out of it from wherever one stands
  const inWay = (to) => [BAY.door, BAY.door.step, to];
  // in through the doorway once Mops waits by the plant: behind him, then on
  const pastMops = (to) => [BAY.door, BAY.door.step, ...BAY_SPOTS.behindMops, to];
  const outWay = () => [BAY.door.step, BAY.door, BAY.door.off];
  // Squatch and Mops go only as far as the doorway's edge (walks stay on the picture)
  const edgeWay = () => [BAY.door.step, BAY.door, BAY.door.edge];
  // Mops or Squatch (the engine's people) along a way; Mops is not solid while he walks
  const engineWay = (who, way, speed) => {
    const e = E();
    let i = 0;
    return e.until((dt) => {
      who === "mops" && e.moWalking(true);
      const p = way[Math.min(i, way.length - 1)];
      const at = e.pos(who);
      Math.abs(p.x - at.x) > 1 && e.face(who, p.x > at.x ? 1 : -1);
      if (e.step(who, p.x, p.y, speed, dt || 0)) i++;
      if (i >= way.length) return (who === "mops" && e.moWalking(false), e.still(who), true);
      return false;
    });
  };
  // Mops and Squatch together, each along his own way (Mops is not solid while he walks); true when both are there
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
      if (done) (e.moWalking(false), e.still("mops"), e.still("sq"));
      return done;
    });
  };
  const robot = (i) => B().robots[i];

  // ---------- the world at the start of each part (jumps and ↺) ----------
  function freshWorld() {
    return {
      step: "",
      t0: 0,
      ship: 0,
      ramp: 0,
      isfred: { x: BAY.door.off.x, y: BAY.door.off.y, f: 1, show: false, look: 0 },
      workers: BAY_SPOTS.workers.map((w) => ({ x: BAY.door.off.x, y: BAY.door.off.y, f: 1, show: false, a: 1, name: w.name })),
      robots: BAY_SPOTS.robots.map(() => ({ x: BAY.shipDoor.x, y: BAY.shipDoor.y, f: 0, show: false, room: "hangar", arm: 0, a: 0 })),
      papers: { where: "none", white: true, bite: 0, flyAt: -1 },
      sign: -1, // when the signing began (the close-up's clock)
      closeUp: null, // { id, at }
      chime: -1,
      wave: -1,
      point: false,
      outline: false,
      hidden: false,
    };
  }
  // Each part's end, set at once (a jump to a later part sets every earlier part's end).
  const FINISH = {
    arrive(b) {
      b.isfred = { ...b.isfred, ...BAY_SPOTS.isfred, show: true, f: 1 };
      b.workers.forEach((w, i) => Object.assign(w, BAY_SPOTS.workers[i], { show: true, f: 1, a: 1 }));
    },
    dock(b) {
      b.ship = 1;
      b.ramp = 1;
    },
    robots(b) {
      b.robots.forEach((r, i) => Object.assign(r, BAY_SPOTS.robots[i], { show: true, f: 2 }));
    },
    shake(b) {
      b.workers.forEach((w) => ((w.show = false), (w.x = BAY.shipDoor.x), (w.y = BAY.shipDoor.y)));
      Object.assign(b.isfred, BAY_SPOTS.isfred, { f: 1 });
    },
    promise(b) {
      b.isfred.f = 1;
    },
    sign(b) {
      Object.assign(b.robots[0], BAY_SPOTS.robotSign, { f: -1, arm: 1 });
      b.papers.where = "robot0";
      b.sign = -1;
      b.closeUp = null;
    },
    call(b) {
      b.isfred.show = false;
      Object.assign(b.isfred, BAY.door.off);
      Object.assign(b.robots[0], BAY.door.off, { show: false });
      b.papers.where = "office";
      b.chime = -1;
      b.point = false;
    },
    back(b) {
      Object.assign(b.robots[0], BAY_SPOTS.robots[0], { show: true, f: 2, arm: 0 });
      b.papers = { where: "mops-hoof", white: false, bite: 0, flyAt: -1 };
    },
    vent(b, e) {
      e.place("mops", BAY_SPOTS.mopsVent.x, BAY_SPOTS.mopsVent.y);
      e.face("mops", 1);
      b.papers.where = "mops-mouth";
      b.papers.bite = 1;
      b.closeUp = null;
    },
    plant(b, e) {
      e.place("mops", BAY_SPOTS.mopsPlant.x, BAY_SPOTS.mopsPlant.y);
      e.face("mops", 1);
      b.papers.where = "bin";
      b.closeUp = null;
    },
  };
  /** Sets the bay as it is at the start of `part`, with Squatch hidden in the plant and Mops watching. */
  function worldAt(part) {
    const e = E(),
      b = freshWorld();
    e.set("ch1Bay", b);
    e.enterRoom("hangar", "QB");
    e.place("sq", BAY.plant.stand.x, BAY.plant.stand.y);
    e.face("sq", 1);
    e.set("sqPose", "hidden");
    b.hidden = true;
    e.set("moPose", "stand");
    e.place("mops", BAY_SPOTS.mopsWatch.x, BAY_SPOTS.mopsWatch.y);
    e.face("mops", 1);
    for (const p of BAY_PARTS) {
      if (p === part) break;
      FINISH[p] && FINISH[p](b, e);
    }
    return b;
  }

  // ---------- beat 28: the ship is coming (behind the snack counter) ----------
  /** The lunch sneak's end hands over here (14-ch1-day2.js ch1ShipCall). */
  function start() {
    const e = E();
    ff = {};
    moFF = {};
    e.set("ch1Bay", freshWorld());
    busy();
    go("pa");
    e.queue([say("pa", "pa-ship"), say("mops", "mops-see"), say("sq", "sq-follow"), say("mops", "mops-ok"), e.run(walkToBay)]);
  }

  // ---------- beat 29: the walk (a cutscene), then hide in the plant ----------
  function walkToBay() {
    const e = E();
    busy();
    go("walk");
    e.set("sqPose", "stand");
    e.walkOff();
    const door = { x: 952, y: 312 };
    e.queue([
      // Mops first, up the aisle and into the hallway doorway; Squatch after him
      engineWay("mops", [COUNTER_SPOTS.top, door], BAY_PACE.walk),
      e.run(() => e.set("moPose", "hidden")),
      engineWay("sq", [COUNTER_SPOTS.top, door], BAY_PACE.walk),
      // the hallway: in at the left end, out at the right, Mops leading (nothing here can be used yet: R55)
      e.run(() => {
        e.enterRoom("passage", "QB");
        e.set("moPose", "stand");
        e.place("mops", HALLWAY.left.x + 50, HALLWAY.left.y - 6);
        e.place("sq", HALLWAY.left.x, HALLWAY.left.y);
        e.face("mops", 1);
        e.face("sq", 1);
      }),
      bothWays([{ x: HALLWAY.right.x, y: HALLWAY.right.y - 6 }], [{ x: HALLWAY.right.x - 50, y: HALLWAY.right.y }], BAY_PACE.walk),
      e.run(() => e.walkOff()),
      // the loading bay, no ship yet: in through the doorway by the plant
      e.run(() => {
        e.enterRoom("hangar", "QB");
        e.place("mops", BAY.door.edge.x + 24, BAY.door.edge.y);
        e.place("sq", BAY.door.edge.x, BAY.door.edge.y + 4);
        e.face("mops", 1);
        e.face("sq", 1);
      }),
      bothWays(inWay(BAY_SPOTS.mopsIn), inWay(BAY_SPOTS.sqIn), BAY_PACE.walk),
      e.run(() => {
        e.moWalking(false);
        e.still("mops");
        e.still("sq");
        e.face("mops", 1);
        e.face("sq", -1);
        go("hide");
        control();
      }),
    ]);
  }
  function control() {
    const e = E();
    e.set("ch1Step", "bay-hide");
    e.set("ch1Chip", bayWords("chip-hide"));
    e.chipNow();
    e.set("ctrl", true);
  }
  /** HIDE · plant: into the plant, only his eyes in its leaves; then beats 30 to 35 play, watched from there. */
  function hide() {
    const e = E(),
      b = B();
    e.place("sq", BAY.plant.stand.x, BAY.plant.stand.y);
    e.still("sq");
    e.stopWalk && e.stopWalk();
    e.set("sqPose", "hidden");
    b.hidden = true;
    e.sfx("hide");
    busy();
    // Mops goes to wait between the plant and the ramp, looking at the window
    e.queue([wait(BAY_PACE.look), engineWay("mops", [BAY_SPOTS.mopsWatch], BAY_PACE.walk), e.run(() => e.face("mops", 1)), ...partsFrom("arrive")]);
  }

  // ---------- beats 30 to 36: the parts ----------
  function partsFrom(part) {
    const e = E(),
      out = [];
    for (const p of BAY_PARTS.slice(BAY_PARTS.indexOf(part))) out.push(e.run(() => go(p)), ...PARTS[p]());
    return out;
  }
  const PARTS = {
    // Isfred and the workers walk in past the plant, one after another
    arrive() {
      const e = E();
      return [
        e.run(() => {
          const b = B();
          b.isfred.show = true;
          b.workers.forEach((w) => (w.show = true));
        }),
        e.until((dt) => {
          const b = B();
          const ways = [b.isfred, ...b.workers].map((o, i) => [o, pastMops(i ? BAY_SPOTS.workers[i - 1] : BAY_SPOTS.isfred), i]);
          let all = true;
          for (const [o, way, i] of ways) {
            // each sets off once the one before him is through the doorway
            const before = i ? ways[i - 1][0] : null;
            if (o.done || (before && !before.done && before.x < BAY.door.step.x + 10 && before.y < BAY.door.step.y - 4)) {
              all = all && !!o.done;
              continue;
            }
            along(o, way, BAY_PACE.people, dt) && (o.done = true);
            all = all && !!o.done;
          }
          return all;
        }),
        e.run(() => {
          const b = B();
          [b.isfred, ...b.workers].forEach((o) => ((o.f = 1), (o.done = false), (o.moving = false)));
        }),
      ];
    },
    // the ship glides into the window, then its ramp comes down
    dock() {
      const e = E();
      return [
        e.run(() => sound.morning("door")),
        e.until((dt) => ((B().ship = Math.min(1, B().ship + (dt || 0) / BAY_PACE.dock)), B().ship >= 1)),
        e.until((dt) => ((B().ramp = Math.min(1, B().ramp + (dt || 0) / BAY_PACE.ramp)), B().ramp >= 1)),
      ];
    },
    // three robots roll down the ramp, one after another, through the scanner to their places, and turn to the ship
    robots() {
      const e = E();
      return [
        e.until((dt) => {
          const b = B();
          let all = true;
          b.robots.forEach((r, i) => {
            if (r.done) return;
            if (e.time() - b.t0 < i * 0.7) return void (all = false);
            if (!r.show) ((r.show = true), (r.x = BAY.shipDoor.x), (r.y = BAY.shipDoor.y), (r.f = 0), e.sfx("bleep"));
            along(r, [BAY.rampFoot, BAY_SPOTS.robots[i]], BAY_PACE.robot, dt) && ((r.done = true), (r.f = 2));
            // (down the ramp it faces us; across the floor it faces the way it rolls)
            r.done || r.y < BAY.rampFoot.y - 1 ? r.done || (r.f = 0) : null;
            all = all && !!r.done;
          });
          return all;
        }),
        e.run(() => B().robots.forEach((r) => ((r.done = false), (r.moving = false), (r.f = 2)))),
      ];
    },
    // Isfred shakes each worker's hand; then they walk up the ramp into the ship, one after another
    shake() {
      const e = E(),
        steps = [];
      BAY_SPOTS.workers.forEach((w, i) => {
        steps.push(
          e.until((dt) => moveTo(B().isfred, w.x - 36, w.y - 4, BAY_PACE.people, dt)),
          e.run(() => ((B().isfred.f = 1), (B().workers[i].f = -1), (B().shakeAt = e.time()), (B().shaking = i))),
          wait(BAY_PACE.shake),
          e.run(() => ((B().shaking = -1), (B().workers[i].f = 1))),
        );
      });
      steps.push(
        e.until((dt) => {
          const b = B();
          let all = moveTo(b.isfred, BAY_SPOTS.isfred.x, BAY_SPOTS.isfred.y, BAY_PACE.people, dt);
          b.workers.forEach((w, i) => {
            if (!w.show) return;
            const before = b.workers[i - 1];
            if (before && before.show && before.y > BAY.rampFoot.y - 60) return void (all = false);
            const there = along(w, [BAY.rampFoot, BAY.shipDoor], BAY_PACE.people, dt);
            // up the ramp he goes into the ship's dark doorway, and is gone
            w.a = w.y < BAY.rampFoot.y ? Math.max(0, (w.y - BAY.shipDoor.y) / (BAY.rampFoot.y - BAY.shipDoor.y)) : 1;
            (there || w.a <= 0.02) && (w.show = false);
            all = all && !w.show;
          });
          return all;
        }),
        e.run(() => (B().isfred.f = 1)),
      );
      return steps;
    },
    // Isfred turns to Mops: the promise
    promise() {
      const e = E();
      return [e.run(() => (B().isfred.f = -1)), wait(0.3), say("official", "isfred-promise")];
    },
    // the form set: the robot holds it up, Isfred signs the white, writes the code on the pink (through to the yellow)
    sign() {
      const e = E(),
        P = BAY_PACE;
      return [
        e.run(() => ((B().papers.where = "robot0"), (B().papers.white = true))),
        e.until((dt) => {
          const r = robot(0);
          r.arm = Math.min(1, r.arm + (dt || 0) * 2);
          const there = moveTo(r, BAY_SPOTS.robotSign.x, BAY_SPOTS.robotSign.y, BAY_PACE.robot, dt);
          return there && ((r.f = -1), r.arm >= 1);
        }),
        e.run(() => {
          const b = B();
          b.isfred.f = 1;
          b.sign = e.time();
          b.closeUp = { id: "form", at: e.time() };
          sound.morning("rustle");
        }),
        // the signature, then the code a number at a time (a scribble each), then the box is outlined
        e.until(() => {
          const b = B(),
            el = e.time() - b.sign - P.grow,
            n = Math.floor(Math.max(0, el - P.sign) / (P.code / Math.max(1, codeText().length)));
          if (el > 0 && b.scribbled == null) ((b.scribbled = 0), sound.morning("scribble"));
          if (el > P.sign && n + 1 > (b.scribbled || 0) && n < codeText().length) ((b.scribbled = n + 1), sound.morning("scribble"));
          return el >= P.sign + P.code + P.box;
        }),
        say("mops", "paper-joke"),
        e.run(() => {
          B().closeUp = null;
          B().scribbled = null;
        }),
      ];
    },
    // wordless: the wall speaker chimes, Isfred looks up at it, points the robot at the doorway and hurries out; the
    // robot rolls out after him with the whole set (a question for Brian: what calls Isfred away)
    call() {
      const e = E();
      return [
        e.run(() => ((B().chime = e.time()), sound.morning("dingDong"))),
        e.until(() => ((B().isfred.look = 1), e.time() - B().chime >= BAY_PACE.chime)),
        e.run(() => ((B().chime = -1), (B().isfred.look = 0), (B().isfred.f = -1), (B().point = true))),
        wait(0.8),
        e.run(() => (B().point = false)),
        e.until((dt) => {
          const b = B(),
            r = robot(0),
            I = b.isfred;
          I.show && along(I, outWay(), BAY_PACE.hurry, dt) && (I.show = false);
          const go = !I.show || I.x < BAY_SPOTS.robotSign.x - 100;
          r.show && go && along(r, outWay(), BAY_PACE.robot, dt) && ((r.show = false), (b.papers.where = "office"));
          return !I.show && !r.show;
        }),
        // the robot is in the office, out of sight
        wait(BAY_PACE.office),
      ];
    },
    // the robot rolls back with only the two stuck copies; Mops takes them
    back() {
      const e = E();
      return [
        e.run(() => {
          Object.assign(robot(0), BAY.door.off, { show: true, arm: 1, wi: 0 });
          B().papers = { where: "robot0", white: false, bite: 0, flyAt: -1 };
        }),
        e.until((dt) => along(robot(0), pastMops(BAY_SPOTS.robotToMops), BAY_PACE.robot, dt)),
        e.run(() => ((robot(0).f = -1), e.face("mops", 1))),
        say("robot", "robot-copies"),
        say("mops", "mops-take"),
        e.run(() => ((B().papers.where = "mops-hoof"), (robot(0).arm = 0), sound.morning("rustle"))),
        e.until((dt) => moveTo(robot(0), BAY_SPOTS.robots[0].x, BAY_SPOTS.robots[0].y, BAY_PACE.robot, dt)),
        e.run(() => (robot(0).f = 2)),
      ];
    },
    // round to the big wall vent, his back to the robots, and a bite: "Delicious."
    vent() {
      const e = E();
      return [
        engineWay("mops", [...BAY_SPOTS.ventWay, BAY_SPOTS.mopsVent], BAY_PACE.hurry),
        e.run(() => {
          e.face("mops", 1);
          B().closeUp = { id: "bite", at: e.time() };
        }),
        wait(BAY_PACE.grow + 0.2),
        e.run(() => ((B().papers.where = "mops-mouth"), (B().biteAt = e.time()))),
        e.until(() => {
          const b = B(),
            k = Math.min(1, (e.time() - b.biteAt) / BAY_PACE.bite);
          k >= 0.5 && b.papers.bite === 0 && sound.morning("chomp");
          b.papers.bite = k >= 0.5 ? 1 : 0;
          return k >= 1;
        }),
        say("mops", "mops-delicious"),
        e.run(() => (B().closeUp = null)),
      ];
    },
    // over to the plant, the copies in his mouth: "Mmf mrrf!", then spit them into the bin
    plant() {
      const e = E();
      return [
        e.run(() => (B().papers.where = "mops-mouth")),
        engineWay("mops", [...BAY_SPOTS.plantWay, BAY_SPOTS.mopsPlant], BAY_PACE.hurry),
        e.run(() => {
          e.face("mops", -1);
          B().closeUp = { id: "plant", at: e.time() };
        }),
        wait(BAY_PACE.grow),
        say("mops", "mops-gumble"),
        say("sq", "sq-gumbling"),
        // he turns to the bin and spits: the copies fly in, still stuck together
        e.run(() => (e.face("mops", 1), (B().papers.where = "flying"), (B().papers.flyAt = e.time()))),
        e.until(() => e.time() - B().papers.flyAt >= BAY_PACE.spit),
        e.run(() => ((B().papers.where = "bin"), sound.morning("flop"))),
        say("mops", "mops-ptoo"),
        e.run(() => (B().closeUp = null)),
      ];
    },
    // beat 36: out of the plant and home past the robots
    home() {
      const e = E();
      return [
        // two of the robots roll off into the hallway (in front of the plant and the bin, out through the doorway)
        e.until((dt) => {
          const b = B();
          let all = true;
          [1, 2].forEach((i) => {
            const r = robot(i);
            if (!r.show || r.room !== "hangar") return;
            if (e.time() - b.t0 < (i - 1) * 0.8) return void (all = false);
            along(r, [...BAY_SPOTS.robotsOut, ...outWay()], BAY_PACE.robot, dt) && (r.show = false);
            all = all && !r.show;
          });
          return all;
        }),
        // Mops waves him out (wordless)
        e.run(() => (e.face("mops", -1), (B().wave = e.time()))),
        wait(0.9),
        e.run(() => {
          const b = B();
          b.wave = -1;
          b.hidden = false;
          e.set("sqPose", "stand");
          e.place("sq", BAY.plant.stand.x, BAY.plant.stand.y + 8);
          e.face("sq", 1);
          sound.effect("hide");
        }),
        e.until((dt) => e.step("sq", BAY_SPOTS.sqOut.x, BAY_SPOTS.sqOut.y, BAY_PACE.walk, dt || 0)),
        wait(0.5),
        // out together through the doorway
        e.run(() => e.walkOff()),
        bothWays(edgeWay(), [BAY_SPOTS.sqOut, ...edgeWay()], BAY_PACE.walk),
        // the hallway: the two robots wait at the office door, turned to it
        e.run(() => {
          e.enterRoom("passage", "QB");
          e.place("sq", HALLWAY.right.x, HALLWAY.right.y);
          e.place("mops", HALLWAY.right.x + 20, HALLWAY.right.y + 40);
          e.face("sq", -1);
          e.face("mops", -1);
          HALLWAY.robots.forEach((p, k) => Object.assign(robot(k + 1), p, { show: true, room: "passage", f: 0, wi: 0 }));
        }),
        bothWays([HALLWAY.in.mops], [HALLWAY.in.sq], BAY_PACE.walk),
        e.run(() => (B().outline = true)),
        say("mops", "mops-robots"),
        e.run(() => (B().outline = false)),
        // Mops walks on the robots' side, Squatch along the back wall
        bothWays([HALLWAY.pass.mops], [HALLWAY.pass.sq], BAY_PACE.walk * 0.8),
        e.run(() => (e.face("sq", 1), e.face("mops", -1))),
        say("sq", "sq-fur"),
        say("mops", "mops-paperwork"),
        bothWays([HALLWAY.stop.mops], [HALLWAY.stop.sq], BAY_PACE.walk),
        // the robots roll away into the bay
        e.until((dt) => {
          let all = true;
          [1, 2].forEach((i) => {
            const r = robot(i);
            if (!r.show || r.room !== "passage") return;
            moveTo(r, HALLWAY.right.x + 70, HALLWAY.right.y + 16, BAY_PACE.robot, dt) && (r.show = false);
            all = all && !r.show;
          });
          return all;
        }),
        e.run(finish),
      ];
    },
  };
  // The end of beat 36: beat 37 follows (the engine's walkHomeDone, the older program's ch1WalkHomeDone).
  function finish() {
    const e = E();
    go("done");
    e.face("sq", 1);
    e.face("mops", -1);
    e.walkHomeDone && e.walkHomeDone();
  }
  const codeText = () => {
    const e = E();
    return (e && e.officeCode && e.officeCode()) || "";
  };

  // ---------- every frame ----------
  function tick(dt) {
    const b = live(),
      e = E();
    if (!b) return;
    dt = dt || 0;
    // Mops: walking or not (his legs move only while his feet do), his hooves; Squatch's footsteps
    const mo = e.pos("mops");
    moMoving = !!moLast && Math.hypot(mo.x - moLast.x, mo.y - moLast.y) > 0.3;
    moLast = { x: mo.x, y: mo.y };
    if (e.room() === "hangar" || e.room() === "passage") {
      const s = e.pos("sq");
      if (e.get("sqPose") === "stand" && footfall(ff, s.x, s.y, dt, HOME_MORNING_SOUND.padEvery)) sound.pad(pads++);
      e.get("moPose") !== "hidden" && footfall(moFF, mo.x, mo.y, dt, 0.32) && sound.morning("hoof", pads);
    }
  }
  // Squatch is seen when standing (not hidden) and a cone holds his drawn outline (scaled to the room: SQUATCH_OUTLINE
  // is his hall size, which in the bay and hallway is a little bigger than he is drawn, so it errs toward "seen").
  const sqStanding = (b) => !b.hidden && E().get("sqPose") === "stand";
  function mopsCone() {
    const e = E(),
      m = e.pos("mops");
    return coneFrom("mops", m.x, m.y, (m.f || 1) > 0 ? 0 : Math.PI, CONE);
  }
  function mopsSees(b) {
    const e = E();
    if (!sqStanding(b) || e.get("moPose") === "hidden" || !(e.room() === "hangar" || e.room() === "passage")) return false;
    return coneSees(mopsCone(), e.pos("sq"));
  }
  /** The cones of everyone in this room who could see Squatch (robots, Isfred, the workers): never Mops's (hearts). */
  function watcherCones(b) {
    const e = E(),
      room = e.room(),
      out = [];
    const angle = (f, up) => (f === 2 ? Math.PI / 2 : f === 0 ? (up ? -Math.PI / 2 : Math.PI / 2) : f > 0 ? 0 : Math.PI);
    for (const [i, r] of b.robots.entries()) if (r.show && r.room === room) out.push(coneFrom("robot" + i, r.x, r.y, robotAngle(r), CONE));
    if (room === "hangar") {
      b.isfred.show && out.push(coneFrom("isfred", b.isfred.x, b.isfred.y, b.isfred.look ? -1.2 : angle(b.isfred.f), CONE));
      b.workers.forEach((w, i) => w.show && w.a > 0.5 && out.push(coneFrom("worker" + i, w.x, w.y, angle(w.f, w.y < BAY.rampFoot.y + 4), CONE)));
    }
    return out;
  }
  // A robot looks the way it faces: standing in the bay, up the ramp at its ship; in the hallway, at the office door.
  // (f: 1 right, -1 left, 0 toward us, so down the picture; 2 away from us, up it)
  function robotAngle(r) {
    return r.f === 1 ? 0 : r.f === -1 ? Math.PI : r.f === 2 ? -Math.PI / 2 : Math.PI / 2;
  }

  // ---------- spots ----------
  function spots() {
    const b = live(),
      e = E();
    if (!b || !e.get("ctrl") || b.step !== "hide" || e.room() !== "hangar" || e.get("sqPose") !== "stand") return [];
    const [verb, cap] = bayWords("button-hide").split(" · ");
    const L = BAY.plant.leaves;
    // (the id is the one the loading bay's plant outline is filed under: goal-targets.js "hangar:d2-HIDE-plant")
    return [{ id: "d2-HIDE-plant", verb, cap, who: "sq", x: BAY.plant.stand.x, y: BAY.plant.stand.y, r: 70, at: [(L.x0 + L.x1) / 2, L.y0], thing: L, f: hide }];
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
    // the copies in the bin (only here, in the bay: poking out of its opening)
    if (b.papers.where === "bin") {
      ctx.save();
      ctx.beginPath();
      ctx.rect(BAY.bin.box.x0 - 30, 0, 100, BAY.bin.top + 2);
      ctx.clip();
      drawStuck(ctx, BAY.bin.x + 2, BAY.bin.top - 4, 22, b.papers.bite, 0.35);
      ctx.restore();
    }
  }
  function mouthAt() {
    const m = E().pos("mops"),
      k = MOPS_K(),
      f = m.f || 1;
    return { x: m.x + f * 24 * k, y: m.y - 25 * k };
  }
  function hoofAt() {
    const m = E().pos("mops"),
      k = MOPS_K(),
      f = m.f || 1;
    return { x: m.x + f * 16 * k, y: m.y - 16 * k };
  }
  // Everyone in the bay, back to front, with what each carries.
  function drawPeople(ctx, b, t) {
    const e = E(),
      s = e.pos("sq"),
      m = e.pos("mops"),
      list = [];
    if (sqStanding(b)) list.push({ y: s.y, f: () => e.drawSquatch(ctx, s.x, s.y, SQ_K(), { f: s.f || 1, walk: e.walkPhase() }) });
    if (e.get("moPose") !== "hidden")
      list.push({
        y: m.y,
        f: () => {
          const mouth = b.papers.where === "mops-mouth" || b.papers.where === "flying" ? "o" : undefined;
          e.drawMopsOn(ctx, m.x, m.y, MOPS_K(), { f: m.f || 1, walk: moMoving ? t * 9 : 0, mouth });
          if (b.papers.where === "mops-hoof") {
            const h = hoofAt();
            drawStuck(ctx, h.x, h.y, 13, 0, 0.2);
          }
          if (b.papers.where === "mops-mouth") {
            const p = mouthAt();
            drawStuck(ctx, p.x + (m.f || 1) * 6, p.y + 2, 17, b.papers.bite, (m.f || 1) * 0.25);
            b.biteAt != null && drawCrumbs(ctx, p.x, p.y + 6, Math.min(1, (t - b.biteAt) / 0.9), 0.8);
          }
          if (b.papers.where === "flying") {
            const p = mouthAt(),
              u = Math.min(1, (t - b.papers.flyAt) / BAY_PACE.spit),
              x = p.x + (BAY.bin.x - p.x) * u,
              y = p.y + (BAY.bin.top - 4 - p.y) * u - Math.sin(u * Math.PI) * 40;
            drawStuck(ctx, x, y, 14, b.papers.bite, u * 4);
          }
          // Mops waving Squatch out of the plant
          b.wave >= 0 && drawWave(ctx, m.x + (m.f || 1) * 22 * MOPS_K(), m.y - 30 * MOPS_K(), t);
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
          // pointing at the doorway (the office), a hand out that way
          if (b.point) {
            ctx.save();
            ctx.lineCap = "round";
            ctx.lineWidth = 5;
            ctx.strokeStyle = "#1e2430";
            ctx.beginPath();
            ctx.moveTo(I.x - 8, I.y - 40);
            ctx.lineTo(I.x - 38, I.y - 52);
            ctx.stroke();
            ctx.lineWidth = 3;
            ctx.strokeStyle = "#c9b6f2";
            ctx.stroke();
            ctx.restore();
          }
        },
      });
    b.workers.forEach((w, i) => {
      if (!w.show) return;
      list.push({
        y: w.y,
        f: () => {
          ctx.save();
          ctx.globalAlpha = Math.max(0, Math.min(1, w.a));
          const bob = b.shaking === i ? Math.sin((t - (b.shakeAt || 0)) * 22) * 3 : 0;
          e.drawWorker(ctx, w.x, w.y - bob, "");
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
          drawRobot(ctx, r.x, r.y, r.f, 1, bob, r.arm);
          if (i === 0 && (b.papers.where === "robot0") && r.arm > 0.5) {
            const h = robotHand(r.x, r.y - bob, r.f, 1, r.arm);
            b.papers.white ? drawFormSet(ctx, h.x, h.y - 8, 16, true) : drawStuck(ctx, h.x, h.y - 8, 14, 0, 0);
          }
        },
      });
    });
    // the handshake: a little burst between the two hands
    if (b.shaking >= 0 && b.workers[b.shaking]) {
      const w = b.workers[b.shaking];
      list.push({ y: w.y + 1, f: () => drawShake(ctx, (b.isfred.x + w.x) / 2, w.y - 34, t) });
    }
    list.sort((a, c) => a.y - c.y).forEach((p) => p.f());
  }
  function drawShake(ctx, x, y, t) {
    ctx.save();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(30,36,48,.8)";
    ctx.lineCap = "round";
    const j = Math.sin(t * 22) * 2;
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(x + s * 10, y - 8 + j);
      ctx.lineTo(x + s * 16, y - 14 + j);
      ctx.stroke();
    }
    ctx.restore();
  }
  /**
   * Everyone's cones (dashed, yellow on him), and Mops's: dashed, and while it holds Squatch his warm cone with hearts
   * floating up in it (the party's look, PR #35, R98 and R104), never yellow. Returns the cones as drawn.
   */
  function drawAllCones(ctx, b, t, again = false) {
    const e = E(),
      s = e.pos("sq"),
      mops = e.get("moPose") !== "hidden" ? mopsCone() : null,
      warm = mops && mopsSees(b);
    // (`again`: the room drawn a second time inside a close-up; its cones are not told to the tests twice)
    const out = drawCones(ctx, [...watcherCones(b), ...(mops && !warm ? [mops] : [])], s, !sqStanding(b), false, again ? null : (c) => e.noteCone(c));
    warm && (drawHeartCone(ctx, mops.ox, mops.oy, mops.a, mops.half, mops.len, t, 1), out.push({ ...mops, inside: false, show: 1, hearts: true }));
    return out;
  }
  /** The bay: the locked picture(s), the bin's copies, the cones, the eyes in the plant, everyone, the close-up. */
  function drawScene(ctx, b, t, again = false) {
    const e = E();
    drawPicture(ctx, b);
    const cones = drawAllCones(ctx, b, t, again);
    b.hidden && e.drawEyes(ctx, BAY.plant.eyes.x, BAY.plant.eyes.y);
    drawPeople(ctx, b, t);
    b.chime >= 0 && drawSpeakerRing(ctx, BAY.speaker, t);
    return cones;
  }
  function drawCloseUp(ctx, b, t) {
    const c = b.closeUp;
    if (!c) return null;
    const C = BAY_CLOSEUPS[c.id],
      u = Math.min(1, (t - c.at) / BAY_PACE.grow),
      box = closeUpBox(C.src, C.dst, u);
    drawCloseUpBack(ctx, C.src, box);
    let parts = null;
    ctx.save();
    ctx.beginPath();
    ctx.rect(box.x0, box.y0, box.x1 - box.x0, box.y1 - box.y0);
    ctx.clip();
    if (c.id === "form") {
      const P = BAY_PACE,
        el = b.sign >= 0 ? t - b.sign - P.grow : 0,
        text = codeText();
      parts = drawFormCloseUp(ctx, box, {
        sign: Math.max(0, Math.min(1, el / P.sign)),
        code: Math.max(0, Math.min(text.length, ((el - P.sign) / P.code) * text.length + 1)) * (el > P.sign ? 1 : 0),
        codeText: text,
        pulse: el > P.sign + P.code ? 1 : 0,
        words: bayWords("order-box"),
        pen: el < P.sign ? "sign" : el < P.sign + P.code ? "code" : null,
        t,
      });
    } else {
      // the room itself, drawn again bigger (the people are drawn, not copied, so they stay sharp)
      const k = (box.x1 - box.x0) / (C.src.x1 - C.src.x0);
      ctx.translate(box.x0 - C.src.x0 * k, box.y0 - C.src.y0 * k);
      ctx.scale(k, k);
      drawScene(ctx, b, t, true);
    }
    ctx.restore();
    drawCloseUpFront(ctx, box);
    return { id: c.id, box, u: +u.toFixed(2), parts };
  }

  /** Over the hall (beat 28: the speaker's sound waves) and the hallway (beat 36: the robots at the office door). */
  function drawOver(ctx) {
    const b = live(),
      e = E();
    if (!b) return;
    const t = e.time(),
      cur = e.current();
    if (e.room() === "hall" && b.step === "pa" && cur && cur.who === "pa") {
      drawSpeakerRing(ctx, HALL_SPEAKER, t);
      drew = { step: b.step, ring: "hall" };
    }
    if (e.room() === "passage") {
      const s = e.pos("sq"),
        robots = b.robots.filter((r) => r.show && r.room === "passage");
      const cones = drawAllCones(ctx, b, t);
      robots.forEach((r) => drawRobot(ctx, r.x, r.y, r.f, 1, r.moving ? Math.abs(Math.sin(t * 14)) * 2 : 0, 0));
      // while Mops's line names them, the robots get the game's one highlight: the dashed gold outline (no glow)
      const outlined = b.outline ? robots.map((r) => drawDashedOutline(ctx, { x0: r.x - 26, x1: r.x + 26, y0: r.y - 74, y1: r.y + 8 }, t)) : [];
      drew = { step: b.step, room: "passage", outlined, cones: cones.map((c) => ({ id: c.id, inside: c.inside, show: c.show, hearts: !!c.hearts })), robots: robots.map((r) => ({ x: r.x, y: r.y, f: r.f })) };
    }
  }

  return {
    start,
    /**
     * ↺ in a part where the player has no control (no step start was saved for it): the part starts again (beat 28's
     * lines from the first; the walk from the hide step). True when it did (20-ch2.js reSec). At the hide step false:
     * the step restart brings it back.
     */
    restart() {
      const b = live();
      if (!b) return false;
      // behind the counter (beat 28): its lines again from the first; the hide step has its own saved start
      if (b.step === "pa") return (jump("pa"), true);
      if (b.step === "hide") return false;
      if (b.step === "walk") return (jump("hide"), true);
      if (BAY_PARTS.includes(b.step)) return (jump(b.step), true);
      return false;
    },
    jump,
    /** True from beat 28's first line until beat 37 begins. */
    active() {
      return !!live();
    },
    /** True while this beat draws the loading bay. */
    ownsRoom() {
      return !!live() && E().room() === "hangar";
    },
    tick,
    spots,
    drawRoom(ctx) {
      const b = live();
      if (!b || E().room() !== "hangar") return false;
      const t = E().time();
      const cones = drawScene(ctx, b, t);
      const closeUp = drawCloseUp(ctx, b, t);
      drew = { step: b.step, room: "hangar", cones: cones.map((c) => ({ id: c.id, inside: c.inside, show: c.show, hearts: !!c.hearts })), closeUp, papers: b.papers.where };
      return true;
    },
    draw: drawOver,
    solids() {
      const b = live();
      if (!b || E().room() !== "hangar") return [];
      const feet = (x, y) => ({ x0: x - 22, x1: x + 22, y0: y - 12, y1: y + 8, person: 1 });
      return [...(b.isfred.show ? [feet(b.isfred.x, b.isfred.y)] : []), ...b.workers.filter((w) => w.show).map((w) => feet(w.x, w.y)), ...b.robots.filter((r) => r.show && r.room === "hangar").map((r) => feet(r.x, r.y))];
    },
    /** True once the ship's ramp is down (the fur scanner's posts are there, and solid: 00-core.js CH1_FURNITURE). */
    docked() {
      const b = live();
      return !!b && b.ramp > 0.5;
    },
    /** Where a speaker's bubble points: the wall speakers, Isfred, the robot, Squatch's eyes in the plant. */
    speakerAt(who) {
      const b = live(),
        e = E();
      if (!b) return null;
      const room = e.room();
      if (who === "pa" && room === "hall") return { x: HALL_SPEAKER.x0, y: (HALL_SPEAKER.y0 + HALL_SPEAKER.y1) / 2 };
      if (room !== "hangar") return null;
      const adult = adultPxFor("hangar");
      if (who === "official" && b.isfred.show) return { x: b.isfred.x, y: b.isfred.y - adult - 4 };
      if (who === "robot" && robot(0).show) return { x: robot(0).x, y: robot(0).y - 70 };
      if (who === "sq" && b.hidden) return { x: BAY.plant.eyes.x, y: BAY.plant.eyes.y - 8 };
      return null;
    },
    /** A bubble that sits beside its speaker: the wall speaker's (left of it, level with it); Mops's over the form close-up (top left). */
    bubbleBeside(who) {
      const b = live(),
        e = E();
      if (!b) return null;
      if (who === "pa" && e.room() === "hall") return { ...HALL_SPEAKER, side: "left" };
      // (top right, over the close-up's top edge: the top left is the HUD's corner on a computer)
      if (who === "mops" && b.closeUp && b.closeUp.id === "form") return { x0: 950, x1: 955, y0: 40, y1: 80, side: "left" };
      // the walk home in the hallway: beside the speaker's head, on the side away from the other one (never over him)
      if (e.room() === "passage" && b.step === "home" && (who === "sq" || who === "mops")) {
        const s = e.pos("sq"),
          m = e.pos("mops"),
          me = who === "sq" ? s : m,
          other = who === "sq" ? m : s,
          tall = adultPxFor("passage") * (who === "sq" ? 0.8 : 0.92);
        // (the box takes in his whole head: facing left, Mops's head reaches well left of his feet)
        const reach = (f) => (who === "mops" && f ? tall * 0.85 : 26);
        return { x0: me.x - reach((me.f || 1) < 0), x1: me.x + reach((me.f || 1) > 0), y0: me.y - tall, y1: me.y, side: other.x > me.x ? "left" : "right" };
      }
      return null;
    },
    /** Where things are, for tests. */
    place: Object.freeze({ BAY, BAY_SPOTS, HALLWAY, BAY_CLOSEUPS, BAY_PARTS, BAY_BEATS }),
    /** Tests: true when any cone of a watcher (not Mops) holds Squatch now. */
    seenNow() {
      const b = live();
      return !!b && sqStanding(b) && watcherCones(b).some((c) => coneSees(c, E().pos("sq")));
    },
    /** Tests: true while Mops's cone holds Squatch (his hearts). */
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
   * A test jump (ch1JumpBeat 28 to 36, ?beat=bay:<part>, tests, ↺): "pa" behind the counter, "hide" in the bay with
   * control, or the start of any part in BAY_PARTS with everything before it done.
   */
  function jump(part) {
    const e = E();
    e.set("ctrl", false);
    ff = {};
    moFF = {};
    // after beat 28 the lunch is over: nothing of it is drawn or ticked
    const lu = e.get("ch1Lunch");
    part !== "pa" && lu && e.set("ch1Lunch", { ...lu, step: "done" });
    if (part === "pa") {
      // behind the counter as the lunch leaves it: its own jump to the snack step, then the snack eaten
      const lunch = bridge.beat("ch1-lunch");
      if (lunch) {
        lunch.jump("snack");
        Object.assign(e.get("ch1Lunch"), { step: "handoff", pose: "stand", pie: "eaten", pies: 2 });
      } else {
        e.enterRoom("hall", "QB");
        e.set("moPose", "stand");
        e.place("mops", COUNTER_SPOTS.mops.x, COUNTER_SPOTS.mops.y);
        e.place("sq", COUNTER_SPOTS.sq.x, COUNTER_SPOTS.sq.y);
      }
      e.set("ctrl", false);
      e.set("ch1Chip", "");
      return start();
    }
    if (part === "hide") {
      const b = freshWorld();
      e.set("ch1Bay", b);
      e.enterRoom("hangar", "QB");
      e.set("sqPose", "stand");
      e.set("moPose", "stand");
      e.place("sq", BAY_SPOTS.sqIn.x, BAY_SPOTS.sqIn.y);
      e.place("mops", BAY_SPOTS.mopsIn.x, BAY_SPOTS.mopsIn.y);
      e.face("sq", -1);
      e.face("mops", 1);
      go("hide");
      return control();
    }
    // (any other name: the start, behind the counter)
    if (!BAY_PARTS.includes(part)) return jump("pa");
    worldAt(part);
    busy();
    e.queue(partsFrom(part));
  }
}
