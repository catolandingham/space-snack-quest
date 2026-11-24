/**
 * The party's hooks into the one capture rule (party-alarm.js): the close-up of the hand pulling the alarm, the
 * LOCKUP card, "They lost you.", and the return to calm, including the calm seen from the door gap after hiding
 * under the bed at home. Split out of party.js (half-one review: "split the capture hooks out").
 *   P2: hidden in the middle plant, the welcome (P3) starts from there.
 *   P4: after hiding at home, on to the dress-up (P5).
 *   P7: after hiding at home, the ending after an alarm (P8a); after a plant, he walks home himself.
 */
import { partyLine, lockupCause } from "./party-lines.js";
import { HALL, SPOTS } from "./party-hall.js";
import { ALARM } from "./party-alarm.js";
import { drawAlarmCloseUp } from "./party-art.js";
import { openFullScreen, closeFullScreen } from "./fullscreen.js";

/**
 * `h`: { E, P, sq, chip, control, startScene (id), picture, homeRoom, pace, firstAlarm: { seen } }.
 * Returns { api () (what tickAlarm needs), calmFromHome () }.
 */
export function createCapture(h) {
  const E = () => h.E();
  function api() {
    const e = E();
    return {
      E: e,
      size: () => e.coneSize(),
      sq: h.sq,
      hidden: () => (h.P().pose === "hidden" ? "plant" : h.P().pose === "bed" ? "bed" : ""),
      room: () => e.room(),
      people: () => h.P().people,
      firstTime: () => !h.firstAlarm.seen,
      // the FUR alarm's ringing bell (the sound board's pick)
      bell: () => h.sound.one("bell"),
      // Wordless, nothing to tap: it plays itself and ends on its clear last frame (Brian 30a, 2026-11-24).
      closeUp(done) {
        h.firstAlarm.seen = true;
        const wasCtrl = e.get("ctrl");
        h.control(false);
        let t0 = null;
        openFullScreen({
          label: "fur alarm",
          draw(ctx, w, hgt, t) {
            t0 == null && (t0 = t);
            const k = Math.min(1, (t - t0) / 0.8);
            drawAlarmCloseUp(ctx, w, hgt, h.picture, HALL.alarmPicture, k, t);
            if (t - t0 >= ALARM.closeUp) {
              closeFullScreen();
              h.control(wasCtrl);
              h.sound.one("bell");
              done();
            }
          },
        });
      },
      caught(whoId, whereId) {
        e.catchSquatch(lockupCause(whoId, whereId));
      },
      lost() {
        h.P().lost = true;
        // "They lost you.": the run-and-hide goal is over while the room calms down.
        h.chip("");
        h.sound.one("lost");
        e.lostYou(partyLine("note-lost"));
      },
      calmDone(how) {
        const p = h.P();
        h.chip(p.scene === "P2" ? "chip-plant" : p.scene === "P4" ? "chip-home" : "");
        if (how === "home") return calmFromHome();
        // Hidden in the middle plant in P2: he made it, and the welcome starts from there.
        if (p.scene === "P2" && p.hideAt === "middle" && p.pose === "hidden") return h.startScene("P3");
        // P7, hidden in a plant: the guests drift back and he walks home himself (his door is the goal).
        if (p.scene === "P7") ((p.band = false), (p.calmed = true));
      },
    };
  }
  // After hiding under the bed: back to calm, watched from the door gap, then back to where he was going.
  function calmFromHome() {
    const e = E(),
      p = h.P(),
      scene = p.scene;
    h.control(false);
    // Out from under the bed first (he does not slide across the room lying down).
    e.set("sqPose", "stand");
    p.pose = "stand";
    e.walkOff();
    e.queue([
      e.until((dt) => e.step("sq", h.homeRoom.doorIn.x, h.homeRoom.doorIn.y, h.pace.walk, dt)),
      e.run(() => {
        e.set("sqPose", "hidden");
        e.enterRoom("hall", "QA");
        e.place("sq", SPOTS.peek.x, SPOTS.peek.y);
        h.P().pose = "peek";
        h.P().pt = 0;
      }),
      e.until(() => !h.P() || h.P().pt >= 1.2),
      e.run(() => {
        if (scene === "P4" || scene === "P7") {
          // P4: he was on his way home anyway, to the closet. P7: home is where he was running; Mops is coming.
          e.enterRoom("closet", "Q1");
          e.place("sq", h.homeRoom.inside.x, h.homeRoom.inside.y);
          e.set("sqPose", "stand");
          return h.startScene(scene === "P4" ? "P5" : "P8a");
        }
        h.P().pose = "stand";
        e.set("sqPose", "stand");
      }),
      e.until((dt) => !h.P() || h.P().scene !== "P2" || e.step("sq", SPOTS.doorway.x, SPOTS.doorway.y, h.pace.peekStep, dt)),
      e.run(() => h.P() && h.P().scene === "P2" && (h.chip("chip-plant"), h.control(true))),
    ]);
  }
  return { api, calmFromHome };
}
