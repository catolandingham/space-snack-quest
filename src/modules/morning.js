/**
 * The morning (Chapter 1, walkthrough beats 1 and 2), rebuilt as a module: from Squatch waking up to Mops
 * leaving for work. Brian's order (docs/BRIAN-ASKS-OPEN.md "Build next" item 1, G 547 to 567) with his
 * answers of 2026-11-23 (Q1 to Q8 in the private MORNING-PLAN.md):
 *   cards (Joe's theme plays on the first, if sound is on); Squatch asleep and snoring, Mops mopping with his
 *   beard, round and round: along the floor to his bucket, a wring over it, back out (mop-loop.js); the wall
 *   speaker's ding-dong, then its party news wakes Squatch; Mops "Morning, Squatch."; Squatch "Party?"; Mops
 *   mops from where he stands along the floor to his bucket, leaving a wet streak (Brian 21a); the
 *   beard-wringing cutaway (the dunk plays by itself, Brian 30a; in the wringing picture a tap on his glowing
 *   beard makes it squirt and Mops says "Hey, stop that!", Brian 31a); the speaker announces Dog Zylan;
 *   the tap starts Brian's recording, the notes and Squatch getting out of bed; Mops "Floating in space!...";
 *   the kid sings (SING ALONG) or walks to Mops (TALK · Mops); the goodbye; Mops walks out; Squatch home alone
 *   (home-alone.js: the homework, and the closet, bed and calendar if the kid wants); "That evening…".
 * Every step waits for a tap (one bubble at a time), except a cutaway picture with no words and nothing to tap
 * (Brian 30a). Animations a tap started (the ding-dong and waking, the mopping, the stand-up, the beard shake,
 * the walk out) may lead straight to the next step. The NEXT button is the only "tap" cue (Brian 18a).
 * Its sounds (Brian 34A, the sound board's picks) play from tick() and the steps (morning-sound.js).
 *
 * Words come only from morning-lines.js. Game state is written only through the bridge's engine.set with
 * the fields bridge.js names (BEAT_WRITES), and the few hand-over functions (place, face, step).
 * The beat's own progress lives in the game state as ch1Morning, so the step restart (↺) keeps it.
 */
import { line } from "./morning-lines.js";
import { cutawaySteps, drawCutaway, soundsBetween, beardTarget, closeUpSpeaker, SQUIRT } from "./cutaway.js";
import { createHomeAlone } from "./home-alone.js";
import { MORNING_SOUND } from "./morning-sound.js";
import { createMopLoop, drawWet } from "./mop-loop.js";
import { mopsBeardLook } from "./mops-beard.js";

// The wooden speaker in the locked home picture v6 (x 1141 to 1191, y 210 to 263 of 1280 x 830), in game
// positions. Nothing else types these numbers: the bubble placement asks for them through the bridge.
export const SPEAKER = Object.freeze({ x0: 856, y0: 162, x1: 893, y1: 203 });
// Where people stand, and how fast things move (game positions, pixels a second, seconds).
export const MORNING_PLACES = Object.freeze({
  bed: { x: 205, y: 470 }, // Squatch's feet while he is in the crate bed
  outOfBed: { x: 250, y: 574 }, // the floor in front of the bed, where getting up ends
  mops: { x: 690, y: 560 }, // beside the painted bucket
  mopFrom: { x: 830, y: 560 }, // the door end of the floor Mops mops; his loop starts here (mop-loop.js)
  wring: { x: 675, y: 528 }, // a step up to the painted bucket: from here his wrung beard reaches over its rim
  water: { x0: 545, x1: 586, y: 508 }, // the water in the painted bucket (locked home picture v6), for the drips
  beardTip: 50, // how far in front of Mops (game pixels) his beard sweeps the floor
  door: { x: 880, y: 458 }, // the right-wall opening Mops leaves by
  talkReach: 200, // how near Mops Squatch must stand for TALK · Mops
  talkGap: 180, // feet apart (left to right) when they talk, so their drawings do not overlap
  talkFloor: 595, // the floor line in front of the bucket, where Squatch steps back to
});
const PACE = Object.freeze({ wake: 0.45, rise: 0.5, standUp: 150, shake: 0.7, leave: 160, notesEvery: 0.5, noteLife: 2.4, mop: 70, mopAtLeast: 1, wetDries: 12 });
const NOTE_COLORS = ["#ff5fa8", "#3478f6", "#e07b00", "#2bc48a"];

// Brian 31a: seconds after the beard's squirt that Mops says "Hey, stop that!" (the water has landed by then).
const STOP_AFTER = SQUIRT.fly + 0.3;

export function createMorning(bridge) {
  const E = () => bridge.engine();
  const sound = bridge.morningSound;
  // When the step sounds last played (not game state: ↺ starts them again with the step).
  const cue = { step: "", t: 0, k: 0, cut: "", el: 0 };
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
  // The ding-dong is ringing (the tap on the sleeping room rang it; the speaker's words wait for it).
  const ringing = (m) => !!m && m.step === "waking" && m.chimeAt != null && E().time() - m.chimeAt < MORNING_SOUND.wordsAfter;
  // Squatch snores while he sleeps, from the "This is Squatch" card on (the first card is the resort).
  const snoring = (m) => {
    if (!m || m.step !== "asleep") return false;
    const c = E().current();
    return !(c && c.k === "card" && c.id === "jupiter");
  };
  // The room with no words is up (Squatch asleep, waiting for the tap): Mops goes round his mopping loop.
  const quiet = (m) => {
    const c = E().current();
    return !!m && m.step === "asleep" && !!c && c.k === "wait";
  };
  // The tap on the sleeping room: the speaker's ding-dong (sound on), Squatch starts to sit up, and Mops stops
  // where he is (still mopping, on the spot).
  function ding() {
    const e = E();
    sound.chime();
    loop.hold(M());
    e.set("sqPose", "sit");
    step("waking", { chimeAt: e.time() });
  }
  // The tap on "Party?": Mops goes back to mopping, from where he stands along the floor to his bucket (Brian
  // 21a: the close-up "would only make sense if he was just mopping the floor just beforehand"). The tap came
  // anywhere in his loop, so he may stand on either side of the bucket spot: out along his stretch, or a step
  // past it at the wring spot. He faces the bucket all the way (from the wring spot he just steps back), and
  // if he is already at the spot he still mops two strokes there first (PACE.mopAtLeast).
  function mopAlong() {
    const e = E(),
      tip = e.pos("mops").x - MORNING_PLACES.beardTip,
      y = MORNING_PLACES.mops.y + 12; // just below his hooves, so the streak shows along his whole length
    e.set("moPose", "mop");
    e.face("mops", -1);
    step("mopping", { wet: { x0: tip, x1: tip + 24, y, dryAt: -1 } });
  }

  function faceEachOther() {
    const e = E(),
      sq = e.pos("sq"),
      mo = e.pos("mops");
    e.face("mops", sq.x < mo.x ? -1 : 1);
    e.face("sq", mo.x > sq.x ? 1 : -1);
  }
  // The Dog Zylan tap: Brian's recording (sound on only), the notes, and Squatch getting out of bed. Mops's song
  // line waits until the recording can be heard (it starts past the file's quiet first seconds, home-music.js).
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
    sound.play("door");
    e.set("moPose", "hidden");
    e.moWalking(false);
    home.start();
  }
  function evening() {
    const e = E();
    step("evening");
    e.queue([
      // Q8: the recording fades out on "That evening…", under a soft whoosh and two bell notes.
      e.run(() => (bridge.homeMusic.stop(), sound.play("evening"))),
      e.card("later", line("card-evening")),
      e.run(() => (e.set("ch1Morning", null), e.eveningStarts())),
    ]);
  }
  const home = createHomeAlone({ E, M, step, done: evening, sound });
  const loop = createMopLoop({ E, places: MORNING_PLACES, sound });

  // The sounds of the step on now: a stroke a step as he mops along, the beard shake, hooves as he walks out,
  // and each cutaway picture's own sounds. (The quiet room's swishes and drips are the loop's, mop-loop.js.)
  function stepSounds(m, dt) {
    const e = E(),
      c = e.current();
    if (m.step !== cue.step) ((cue.step = m.step), (cue.t = 0), (cue.k = 0), m.step === "shake" && sound.play("shake"));
    cue.t -= dt;
    // A stroke a step as he mops along (none in the last quarter second: he has reached the bucket), a hoof a
    // step as he walks out.
    const mo = e.pos("mops"),
      left = m.step === "mopping" ? Math.max(Math.hypot(mo.x - MORNING_PLACES.mops.x, mo.y - MORNING_PLACES.mops.y) / PACE.mop, PACE.mopAtLeast - m.t) : 1;
    const every = m.step === "mopping" ? MORNING_SOUND.mopEvery : m.step === "leave" ? MORNING_SOUND.hoofEvery : 0;
    every && cue.t <= 0 && left > 0.25 && (sound.play(m.step === "mopping" ? "mop" : "hoof", cue.k++), (cue.t += every));
    if (!c || c.k !== "cutaway") return;
    const key = c.id + ":" + c.panel;
    // A new picture (or the same one again after ↺): its time starts from 0.
    (key !== cue.cut || c.el < cue.el) && ((cue.cut = key), (cue.el = -0.001));
    soundsBetween(c.id, c.panel, cue.el, c.el).forEach((name) => sound.play(name));
    cue.el = c.el;
  }
  // Brian 31a, the first squirt: the water flies and lands over the picture (nothing to tap meanwhile, and the
  // wringing sounds wait), then Mops says it, once ("Hey, stop that!"), over the picture; then the picture
  // comes back. The wait moves the picture's own time on, so the squirt is drawn flying.
  function stopThat(at) {
    const e = E();
    const wait = {
      ...e.until((dt) => {
        const o = wait.over;
        o.el = (o.el || 0) + (dt || 0);
        // The wringing sounds of this stretch are skipped, not saved up for when the picture comes back.
        cue.el = o.el;
        return o.el - at >= STOP_AFTER;
      }),
      over: true,
    };
    e.cutIn([wait, { ...e.say("mops", line("mops-stop")), over: true }]);
  }

  return {
    /** A new Chapter 1. With { restart: true } (the ↺ hold before the song): the morning again, without the cards. */
    start(opts) {
      const e = E(),
        cards = !(opts && opts.restart);
      e.resetChapter();
      // With the cards, Joe's theme (from the title) carries on over the first card, then the room is quiet
      // (no Joe's theme) until the speaker plays the song. Without the cards (↺) it is quiet at once.
      cards ? bridge.homeMusic.release() : bridge.homeMusic.hold();
      sound.newMorning();
      Object.assign(cue, { step: "", t: 0, k: 0, cut: "", el: 0 });
      e.set("scene", "Q1");
      e.set("ctrl", false);
      e.set("ch1Chip", "");
      e.set("sqPose", "sleep");
      e.set("sqLift", -1);
      e.set("zzz", 0);
      e.set("moPose", "mop");
      e.place("sq", MORNING_PLACES.bed.x, MORNING_PLACES.bed.y);
      e.face("sq", 1);
      e.place("mops", MORNING_PLACES.mopFrom.x, MORNING_PLACES.mopFrom.y);
      e.face("mops", -1);
      e.still("sq");
      e.still("mops");
      e.set("ch1Morning", { step: "asleep", t: 0, notes: false });
      loop.start(M());
      e.queue([
        ...(cards ? [e.card("jupiter", line("card-jupiter")), e.run(() => bridge.homeMusic.hold()), e.card("squatch", line("card-squatch"))] : []),
        // The room, no words: Squatch asleep and snoring, Mops mopping round his loop. A tap rings the
        // speaker's ding-dong (the room waits for it; nothing here moves the story on).
        e.tapWait(),
        e.run(ding),
        e.until(() => !ringing(M())),
        e.say("speaker", line("speaker-party")),
        e.say("speaker", line("speaker-invite")),
        e.run(() => (e.set("moPose", "stand"), faceEachOther())),
        e.say("mops", line("mops-morning")),
        e.say("sq", line("sq-party")),
        e.run(mopAlong),
        e.until(() => !M() || M().step !== "mopping"),
        ...cutawaySteps("beard"),
        // Back in the room: Mops shakes his beard fluffy, then stands still facing Squatch.
        e.run(() => (e.set("moPose", "shake"), step("shake"))),
        e.until(() => !M() || M().step !== "shake"),
        e.say("speaker", line("speaker-song")),
        e.run(songStarts),
        e.until(() => !M() || (M().step !== "standup" && bridge.homeMusic.audible())),
        e.say("mops", line("mops-song")),
        e.run(() => (step("song", { notes: true }), e.set("ch1Chip", line("chip-sing")), e.set("ctrl", true), e.chipNow())),
      ]);
    },
    /** Every frame, paused or not (animations and the music; never a new step). */
    tick(dt) {
      const m = live(),
        e = E();
      // Left the morning some other way (another chapter, a debug jump): the recording fades out.
      if (!m) return void (bridge.homeMusic.stop("morning"), sound.snore(false));
      m.t = (m.t || 0) + (dt || 0);
      sound.snore(snoring(m));
      stepSounds(m, dt || 0);
      const music = bridge.homeMusic;
      const c = e.current();
      music.dip(!!c && c.k === "bub" && c.style === "song");
      music.load();
      loop.settle(m, dt || 0);
      switch (m.step) {
        case "asleep":
          e.set("zzz", (e.get("zzz") || 0) + (dt || 0));
          quiet(m) && loop.tick(m, dt || 0);
          break;
        case "waking":
          e.set("sqLift", Math.min(0, -1 + m.t / PACE.wake));
          break;
        case "mopping": {
          // Head down, beard sweeping, legs walking: the wet streak grows behind his beard.
          const done = e.step("mops", MORNING_PLACES.mops.x, MORNING_PLACES.mops.y, PACE.mop, dt || 0);
          e.face("mops", -1);
          m.wet && (m.wet.x0 = Math.min(m.wet.x0, e.pos("mops").x - MORNING_PLACES.beardTip));
          if (done && m.t >= PACE.mopAtLeast) {
            e.still("mops");
            m.wet && (m.wet.dryAt = e.time() + PACE.wetDries);
            m.step = "mopped";
          }
          break;
        }
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
      return !!m && ["asleep", "waking", "mopping", "mopped", "awake", "shake", "standup", "up"].includes(m.step);
    },
    /** True while Squatch is home alone and free to walk about (the calendar may be looked at then). */
    homeAlone() {
      return !!live() && home.free();
    },
    /** Drawn on the room picture under the people: the G box in the open closet (home alone). */
    drawOnRoom(ctx) {
      const m = live();
      if (!m) return;
      home.drawOnRoom(ctx);
      // The shine his beard leaves as he goes round in the quiet room; it dries from its old end.
      loop.drawShine(ctx, m);
      // The wet streak Mops's beard leaves on the floor after "Party?"; it dries away a while after he stops.
      const w = m.wet,
        t = E().time();
      if (w && (w.dryAt < 0 || t < w.dryAt)) {
        const a = w.dryAt < 0 ? 1 : Math.min(1, (w.dryAt - t) / 3);
        drawWet(ctx, [{ x: w.x0, a }, { x: w.x1, a }], w.y);
      }
    },
    /** How Mops's head and beard are drawn while he mops or wrings (the engine's drawMops options), or null. */
    mopsLook() {
      const m = live();
      return (m && loop.look(m)) || mopsBeardLook();
    },
    /** True while Mops walks out (the goal chip hides). */
    leaving() {
      const m = live();
      return !!m && m.step === "leave";
    },
    /** Drawn over the room: the wet floor where Mops mops, sound lines and music notes at the speaker, and
     * Squatch while he flops on the bed (home alone). */
    draw(ctx) {
      const m = live(),
        e = E();
      if (!m) return;
      home.draw(ctx);
      const t = e.time();
      if (e.get("moPose") === "mop") {
        // The wet under his beard, wherever the beard is in its sweep.
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(loop.tipX(m), e.pos("mops").y + 8, 34, 5, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(143,220,255,.45)";
        ctx.fill();
        ctx.restore();
      }
      loop.drawWring(ctx, m);
      const cx = (SPEAKER.x0 + SPEAKER.x1) / 2,
        cy = (SPEAKER.y0 + SPEAKER.y1) / 2;
      if (speakerTalking() || ringing(m)) {
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
    /** A cutaway picture of the morning, full screen. */
    drawCutaway(ctx, cutStep) {
      const m = M();
      drawCutaway(ctx, E(), cutStep, { now: E().time(), squirt: m && m.squirt });
    },
    /**
     * A tap on the picture (game positions). Brian 31a: on the wringing close-up, a tap on the beard makes it
     * squirt (every tap); the first time, Mops then says "Hey, stop that!". True when the tap was used here.
     */
    pictureTap(x, y) {
      const m = live(),
        c = E().current();
      if (!m || !c || c.k !== "cutaway" || c.id !== "beard" || c.panel !== 1) return false;
      const b = beardTarget();
      if (x < b.x0 || x > b.x1 || y < b.y0 || y > b.y1) return false;
      if (m.squirt && c.el - m.squirt.at < SQUIRT.fly + 0.1) return true; // still flying
      const first = !m.squirt;
      m.squirt = { at: c.el, said: true, taps: ((m.squirt && m.squirt.taps) || 0) + 1 };
      sound.play("squirt");
      first && stopThat(c.el);
      return true;
    },
    /** Where a speaker is when its bubble is over a close-up (31a): Mops's snout in the picture. */
    closeUpSpeaker(who) {
      return who === "mops" ? closeUpSpeaker().at : null;
    },
    /** The box a bubble over a close-up sits beside: right of Mops's head, over the wall. */
    closeUpBeside(who) {
      return who === "mops" ? closeUpSpeaker().beside : null;
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
      const w = m && m.wet;
      return {
        step: m ? m.step : "",
        fx: !m ? "" : speakerTalking() || ringing(m) ? "lines" : m.notes ? "notes" : "",
        lift: E() ? E().get("sqLift") : 0,
        flop: m ? home.flop() : null,
        wet: w ? { x0: w.x0, x1: w.x1, y: w.y } : null,
        ...(m && E() ? loop.debug(m) : { loop: null, shine: null }),
        squirt: m && m.squirt ? { ...m.squirt } : null,
        beard: beardTarget(),
      };
    },
  };
}
