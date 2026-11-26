/**
 * The party's hooks into the one capture rule (party-alarm.js): the close-up of the hand pulling the alarm, the
 * LOCKUP card, "They lost you.", and the return to calm, including the calm seen from the door gap after hiding
 * under the bed at home. Split out of party.js (half-one review: "split the capture hooks out").
 *   P2: hidden in the middle plant, the welcome (P3) starts from there.
 *   P4: after hiding at home, on to the dress-up (P5) if he has the flyer; without it he steps back out into his
 *       doorway, and the flyer is still the goal.
 *   P7: at home Mops sending the guard off, the card and what follows are party-after-alarm.js; after a plant, he
 *       walks home himself.
 */
import { partyLine, lockupCause } from "./party-lines.js";
import { HALL, SPOTS } from "./party-hall.js";
import { ALARM } from "./party-alarm.js";
import { drawAlarmCloseUp } from "./party-art.js";
import { openFullScreen, closeFullScreen } from "./fullscreen.js";

/**
 * `h`: { E, P, sq, chip, control, startScene (id), picture, homeRoom, pace, firstAlarm: { seen }, afterAlarm () }.
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
      // the home guard has finished looking: with "Keep going" chosen, Mops comes in and the guard stays to talk
      guardSearched: (g) => h.afterAlarm().guardSearched(g),
      // after a party alarm (P7) the guard looks round until Squatch is under the bed (Mops comes in next)
      hideFirst: () => h.P().scene === "P7",
      firstTime: () => !h.firstAlarm.seen,
      // the FUR alarm ringing: the one alarm of Chapter 1, the red alert whoop (Brian 2026-11-26)
      bell: () => h.sound.one("alarm"),
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
              // He has control again if he had it, and also if a scripted walk that was running when the close-up
              // opened (his walk in through his own door) has finished meanwhile: that walk gave him control, and
              // putting it back to "off" left him at home with no button while the guard came.
              const q = h.P(),
                caught = !!(q && q.alarm && q.alarm.phase === "caught");
              h.control(wasCtrl || (!e.current() && !caught && !(q && q.card)));
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
        // After a party alarm the guard leaves because Mops sent him off, and the scene goes straight on (no note).
        if (h.P().choice === "keep" || h.P().mopsIn) return;
        // A guard who follows him home after the hall has already calmed down (`quiet`): "They lost you." was said
        // in the hall; it is not said twice for one alarm.
        if (h.P().alarm && h.P().alarm.quiet) return void h.chip("");
        h.P().lost = true;
        // "They lost you.": the run-and-hide goal is over while the room calms down.
        h.chip("");
        h.sound.one("lost");
        e.lostYou(partyLine("note-lost"));
      },
      calmDone(how) {
        const p = h.P();
        h.chip(p.scene === "P2" ? "chip-plant" : p.scene === "P4" ? (p.flyer === "paw" ? "chip-home" : "chip-flyer") : "");
        // P7 and P8a at home: Mops sent the guard off, and the card decides (party-after-alarm.js).
        if (how === "home" && (p.scene === "P7" || p.scene === "P8a")) return;
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
        if (scene === "P4" && h.P().flyer === "paw") {
          // he was on his way home anyway with the flyer: "Phew, made it!", then SAVE · flyer at his bed
          e.enterRoom("closet", "Q1");
          e.place("sq", h.homeRoom.inside.x, h.homeRoom.inside.y);
          e.set("sqPose", "stand");
          h.P().pose = "stand";
          return h.flyerHome();
        }
        h.P().pose = "stand";
        e.set("sqPose", "stand");
      }),
      // P2, and P4 without the flyer: he steps back out into his doorway and goes on from there
      e.until((dt) => !h.P() || !back(h.P()) || e.step("sq", SPOTS.doorway.x, SPOTS.doorway.y, h.pace.peekStep, dt)),
      e.run(() => h.P() && back(h.P()) && (h.chip(h.P().scene === "P2" ? "chip-plant" : "chip-flyer"), h.control(true))),
    ]);
  }
  const back = (p) => p.scene === "P2" || (p.scene === "P4" && p.flyer !== "paw");
  return { api, calmFromHome };
}
