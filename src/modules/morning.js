/**
 * The morning (Chapter 1, walkthrough beats 1 and 2), rebuilt as a module: from Squatch waking up to Mops
 * leaving for work. Brian's order (docs/BRIAN-ASKS-OPEN.md "Build next" item 1, G 547 to 567) with his
 * answers of 2026-11-23 (Q1 to Q8 in the private MORNING-PLAN.md):
 *   cards; Squatch asleep, Mops mopping with his beard; the wall speaker wakes Squatch with the party news;
 *   Mops "Morning, Squatch."; Squatch "Party?"; the beard-wringing cutaway; the speaker announces Dog Zylan;
 *   the tap starts Brian's recording, the notes and Squatch getting out of bed; Mops "Floating in space!...";
 *   the kid sings (SING ALONG) or walks to Mops (TALK · Mops); the goodbye; Mops walks out; Squatch home alone
 *   (home-alone.js: the homework, and the closet, bed and calendar if the kid wants); "That evening…".
 * Every step waits for a tap (one bubble at a time, nothing moves on by itself). Animations a tap started
 * (waking, the stand-up, the beard shake, the walk out) may lead straight to the next step.
 *
 * Words come only from morning-lines.js. Game state is written only through the bridge's engine.set with
 * the fields bridge.js names (BEAT_WRITES), and the few hand-over functions (place, face, step).
 * The beat's own progress lives in the game state as ch1Morning, so the step restart (↺) keeps it.
 */
import { line } from "./morning-lines.js";
import { cutawaySteps, drawCutaway, drawTapCue } from "./cutaway.js";
import { createHomeAlone } from "./home-alone.js";

// The wooden speaker in the locked home picture v6 (x 1141 to 1191, y 210 to 263 of 1280 x 830), in game
// positions. Nothing else types these numbers: the bubble placement asks for them through the bridge.
export const SPEAKER = Object.freeze({ x0: 856, y0: 162, x1: 893, y1: 203 });
// Where people stand, and how fast things move (game positions, pixels a second, seconds).
export const MORNING_PLACES = Object.freeze({
  bed: { x: 205, y: 470 }, // Squatch's feet while he is in the crate bed
  outOfBed: { x: 250, y: 574 }, // the floor in front of the bed, where getting up ends
  mops: { x: 690, y: 560 }, // beside the painted bucket
  door: { x: 880, y: 458 }, // the right-wall opening Mops leaves by
  talkReach: 200, // how near Mops Squatch must stand for TALK · Mops
  talkGap: 180, // feet apart (left to right) when they talk, so their drawings do not overlap
  talkFloor: 595, // the floor line in front of the bucket, where Squatch steps back to
});
const PACE = Object.freeze({ wake: 0.45, rise: 0.5, standUp: 150, shake: 0.7, leave: 160, notesEvery: 0.5, noteLife: 2.4 });
const NOTE_COLORS = ["#ff5fa8", "#3478f6", "#e07b00", "#2bc48a"];

export function createMorning(bridge) {
  let cue = 0;
  const E = () => bridge.engine();
  const M = () => {
    const e = E();
    return (e && e.get("ch1Morning")) || null;
  };
  // The beat's progress, while the morning is on screen (Chapter 1, at home); otherwise null.
  const live = () => {
    const m = M(),
      e = E();
    return m && e.room() === "closet" && String(e.get("scene") || "")[0] === "Q" ? m : null;
  };
  const step = (name, extra) => E().set("ch1Morning", { ...(M() || {}), step: name, t: 0, ...(extra || {}) });
  const speakerTalking = () => {
    const c = E().current();
    return !!c && c.k === "bub" && c.who === "speaker";
  };

  function faceEachOther() {
    const e = E(),
      sq = e.pos("sq"),
      mo = e.pos("mops");
    e.face("mops", sq.x < mo.x ? -1 : 1);
    e.face("sq", mo.x > sq.x ? 1 : -1);
  }
  // The Dog Zylan tap: Brian's recording (sound on only), the notes, and Squatch getting out of bed.
  function songStarts() {
    bridge.homeMusic.start();
    step("standup", { notes: true, notesAt: E().time(), phase: "rise" });
  }
  function goodbye() {
    const e = E();
    return [e.say("mops", line("mops-work")), e.say("mops", line("mops-stay")), e.run(leave)];
  }
  function sing() {
    const e = E();
    e.set("ctrl", false);
    e.set("act", null);
    e.still("sq");
    faceEachOther();
    e.set("sqPose", "sing");
    step("sing");
    e.queue([
      e.say("sq", line("sq-sing"), "song"),
      e.run(() => (e.set("sqPose", "stand"), e.set("moPose", "sing"))),
      e.say("mops", line("mops-sing"), "song"),
      e.run(() => e.set("moPose", "stand")),
      ...goodbye(),
    ]);
  }
  function talk() {
    const e = E(),
      sq = e.pos("sq"),
      mo = e.pos("mops"),
      side = sq.x < mo.x ? -1 : 1;
    e.set("ctrl", false);
    e.set("act", null);
    e.still("sq");
    // Too close to talk without standing inside Mops's drawing: Squatch steps back first (the tap started it).
    const back = Math.abs(sq.x - mo.x) < MORNING_PLACES.talkGap ? { x: mo.x + side * MORNING_PLACES.talkGap, y: Math.max(sq.y, MORNING_PLACES.talkFloor) } : null;
    back || faceEachOther();
    step("goodbye", { backTo: back, down: back ? false : true });
    e.queue([e.until(() => !M() || !M().backTo), ...goodbye()]);
  }
  function leave() {
    const e = E();
    e.set("ctrl", false);
    e.set("ch1Chip", "");
    e.set("moPose", "stand");
    e.face("mops", 1);
    e.moWalking(true);
    e.forgetSaved();
    step("leave");
  }
  // Mops is out of the door: Squatch is home alone until he has done his homework.
  function gone() {
    const e = E();
    e.set("moPose", "hidden");
    e.moWalking(false);
    home.start();
  }
  function evening() {
    const e = E();
    step("evening");
    e.queue([
      // Q8: the recording fades out on "That evening…".
      e.run(() => bridge.homeMusic.stop()),
      e.card("later", line("card-evening")),
      e.run(() => (e.set("ch1Morning", null), e.eveningStarts())),
    ]);
  }
  const home = createHomeAlone({ E, M, step, done: evening });

  return {
    /** A new Chapter 1. With { restart: true } (the ↺ hold before the song): the morning again, without the cards. */
    start(opts) {
      const e = E(),
        cards = !(opts && opts.restart);
      e.resetChapter();
      // The room stays quiet (no Joe's theme) until the speaker plays the song.
      bridge.homeMusic.hold();
      e.set("scene", "Q1");
      e.set("ctrl", false);
      e.set("ch1Chip", "");
      e.set("sqPose", "sleep");
      e.set("sqLift", -1);
      e.set("zzz", 0);
      e.set("moPose", "mop");
      e.place("sq", MORNING_PLACES.bed.x, MORNING_PLACES.bed.y);
      e.face("sq", 1);
      e.place("mops", MORNING_PLACES.mops.x, MORNING_PLACES.mops.y);
      e.face("mops", -1);
      e.still("sq");
      e.still("mops");
      e.set("ch1Morning", { step: "asleep", t: 0, notes: false });
      e.queue([
        ...(cards ? [e.card("jupiter", line("card-jupiter")), e.card("squatch", line("card-squatch"))] : []),
        // The room, no words: Squatch asleep, Mops mopping. A tap wakes the speaker.
        e.tapWait(),
        e.run(() => (e.chime(), e.set("sqPose", "sit"), step("waking"))),
        e.say("speaker", line("speaker-party")),
        e.say("speaker", line("speaker-invite")),
        e.run(() => (e.set("moPose", "stand"), faceEachOther())),
        e.say("mops", line("mops-morning")),
        e.say("sq", line("sq-party")),
        ...cutawaySteps("beard"),
        // Back in the room: Mops shakes his beard fluffy, then stands still facing Squatch.
        e.run(() => (e.set("moPose", "shake"), step("shake"))),
        e.until(() => !M() || M().step !== "shake"),
        e.say("speaker", line("speaker-song")),
        e.run(songStarts),
        e.until(() => !M() || M().step !== "standup"),
        e.say("mops", line("mops-song")),
        e.run(() => (step("song", { notes: true }), e.set("ch1Chip", line("chip-sing")), e.set("ctrl", true), e.chipNow())),
      ]);
    },
    /** Every frame, paused or not (animations and the music; never a new step). */
    tick(dt) {
      const m = live(),
        e = E();
      // Left the morning some other way (another chapter, a debug jump): the recording fades out.
      if (!m) return void bridge.homeMusic.stop();
      m.t = (m.t || 0) + (dt || 0);
      const music = bridge.homeMusic;
      const c = e.current();
      music.dip(!!c && c.k === "bub" && c.style === "song");
      music.load();
      switch (m.step) {
        case "asleep":
          e.set("zzz", (e.get("zzz") || 0) + (dt || 0));
          break;
        case "waking":
          e.set("sqLift", Math.min(0, -1 + m.t / PACE.wake));
          break;
        case "shake":
          m.t >= PACE.shake && (e.set("moPose", "stand"), (m.step = "awake"));
          break;
        case "standup":
          if (m.phase === "rise") {
            e.set("sqLift", Math.min(1, m.t / PACE.rise));
            if (m.t >= PACE.rise) {
              e.set("sqLift", 0);
              e.set("sqPose", "stand");
              e.place("sq", MORNING_PLACES.bed.x, MORNING_PLACES.bed.y);
              e.face("sq", 1);
              m.phase = "out";
            }
          } else if (e.step("sq", MORNING_PLACES.outOfBed.x, MORNING_PLACES.outOfBed.y, PACE.standUp, dt || 0)) {
            e.still("sq");
            m.step = "up";
          }
          break;
        case "goodbye":
          // Stepping back from Mops before the goodbye: straight down in front of the bucket, then across.
          if (m.backTo) {
            const sq = e.pos("sq"),
              to = m.down ? m.backTo : { x: sq.x, y: m.backTo.y };
            e.step("sq", to.x, to.y, PACE.standUp, dt || 0) && (m.down ? (e.still("sq"), faceEachOther(), (m.backTo = null)) : (m.down = true));
          }
          break;
        case "song":
        case "sing":
          // Mops stays put and keeps facing Squatch wherever the kid walks him. (After a ↺ during his walk out
          // the song step comes back: he is solid again.)
          if (m.step === "song") {
            e.moWalking(false);
            const sq = e.pos("sq"),
              mo = e.pos("mops");
            e.face("mops", sq.x < mo.x ? -1 : 1);
          }
          break;
        case "leave":
          e.step("mops", MORNING_PLACES.door.x, MORNING_PLACES.door.y, PACE.leave, dt || 0) && gone();
          break;
        case "home":
          home.tick(dt);
          break;
      }
    },
    /** The spots the song step offers (SING ALONG anywhere, TALK · Mops beside him), or home alone's. */
    spots() {
      const m = live(),
        e = E();
      if (m && m.step === "home") return home.spots();
      if (!m || m.step !== "song" || !e.get("ctrl")) return null;
      const mo = e.pos("mops"),
        sq = e.pos("sq"),
        near = Math.hypot(sq.x - mo.x, sq.y - mo.y) < MORNING_PLACES.talkReach,
        [verb, cap] = line("button-talk").split(" \u00b7 ");
      // SING ALONG works anywhere (it happens where Squatch stands: no ring, the button pulses) except beside
      // Mops, where the button offers TALK · Mops instead.
      return [
        { id: "sing", verb: line("button-sing"), who: "sq", hot: true, when: !near, f: sing },
        { id: "talk", verb, cap, who: "sq", x: mo.x, y: mo.y, r: MORNING_PLACES.talkReach, at: [mo.x, mo.y - 170], f: talk },
      ];
    },
    /** True while the beat runs (from start() to "That evening…") and Chapter 1 is at home. */
    active() {
      return !!live();
    },
    /** True while the morning is before its song step (the ↺ hold then restarts the morning). */
    beforeSong() {
      const m = live();
      return !!m && ["asleep", "waking", "awake", "shake", "standup", "up"].includes(m.step);
    },
    /** True while Squatch is home alone and free to walk about (the calendar may be looked at then). */
    homeAlone() {
      return !!live() && home.free();
    },
    /** Drawn on the room picture under the people: the G box in the open closet (home alone). */
    drawOnRoom(ctx) {
      live() && home.drawOnRoom(ctx);
    },
    /** True while Mops walks out (the goal chip hides). */
    leaving() {
      const m = live();
      return !!m && m.step === "leave";
    },
    /** Drawn over the room: the wet floor where Mops mops, sound lines and music notes at the speaker. */
    draw(ctx) {
      const m = live(),
        e = E();
      if (!m) return;
      const t = e.time();
      if (e.get("moPose") === "mop") {
        const mo = e.pos("mops");
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(mo.x - 50, mo.y + 8, 34, 5, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(143,220,255,.45)";
        ctx.fill();
        ctx.restore();
      }
      const cx = (SPEAKER.x0 + SPEAKER.x1) / 2,
        cy = (SPEAKER.y0 + SPEAKER.y1) / 2;
      if (speakerTalking()) {
        ctx.save();
        ctx.lineWidth = 3.5;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#1e2430";
        for (let k = 0; k < 3; k++) {
          const r = 30 + k * 10 + 3 * Math.sin(t * 8 - k);
          ctx.globalAlpha = 0.9 - k * 0.22;
          ctx.beginPath();
          ctx.arc(cx, cy, r, Math.PI * 0.78, Math.PI * 1.22);
          ctx.stroke();
          // On the right only the smallest arc: the room's right wall is close.
          k === 0 && (ctx.beginPath(), ctx.arc(cx, cy, 24 + 2 * Math.sin(t * 8), -Math.PI * 0.22, Math.PI * 0.22), ctx.stroke());
        }
        ctx.restore();
      }
      if (m.notes) {
        const since = t - (m.notesAt || 0);
        for (let i = Math.max(0, Math.floor((since - PACE.noteLife) / PACE.notesEvery)); i * PACE.notesEvery <= since; i++) {
          const age = since - i * PACE.notesEvery;
          if (age < 0 || age > PACE.noteLife) continue;
          const k = age / PACE.noteLife;
          ctx.save();
          ctx.globalAlpha = Math.min(1, age * 4) * (1 - k);
          e.text(i % 2 ? "♫" : "♪", SPEAKER.x0 - 6 - age * 46, cy - age * 40 + Math.sin(age * 5 + i) * 8, 28, NOTE_COLORS[i % NOTE_COLORS.length], "center", 900);
          ctx.restore();
        }
      }
    },
    /** The "tap ▸" cue on any morning card, bubble or wait (cutaway pictures draw their own). */
    drawCue(ctx) {
      if (!live()) return;
      drawTapCue(ctx, E(), E().time(), line("cue-tap"));
      cue++;
    },
    /** A cutaway picture of the morning, full screen, with its cue. */
    drawCutaway(ctx, cutStep) {
      drawCutaway(ctx, E(), cutStep, E().time(), line("cue-tap"));
      cue++;
    },
    /** The anchor the speaker's bubble points at (the bubble sits to the left of it). */
    speaker() {
      return SPEAKER;
    },
    /** Who speaks for the speaker's bubbles: the name tag. */
    speakerName() {
      return line("tag-speaker");
    },
    /** For tests: where the beat is and what it draws. */
    debug() {
      const m = M();
      return { step: m ? m.step : "", fx: !m ? "" : speakerTalking() ? "lines" : m.notes ? "notes" : "", cue, lift: E() ? E().get("sqLift") : 0 };
    },
  };
}
