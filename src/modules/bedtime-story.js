/**
 * Beat 21, the bedtime story: why Moon Pies (docs/CH1-STORY-WALKTHROUGH.md, "21. Bedtime story"). It replaces the
 * caption box the game showed at bedtime ("ch1moon"). After the TV story, at home:
 *   1. Squatch asks for the story with no words: he walks to his crate bed and pats it, and a thought bubble shows a
 *      little Moon Pie crate (no words). He climbs into bed; Mops comes over beside it. Each of these wordless parts
 *      plays by itself for 2 to 4 seconds (Brian 30a: nothing to read and nothing to tap).
 *   2. The old crate story from commit 71ec66e, full screen, each picture waiting for NEXT (bedtime-story-art.js;
 *      the words are bedtime-story-lines.js; the bucket picture is off behind BEDTIME_SWITCHES).
 *   3. Back in the room: Mops's bedtime line, as the game showed it before, in one bubble over him (waits for NEXT).
 *   4. Squatch falls asleep (the room's sleep pose and its "z z z") with a gentle snore, for a few seconds, then the
 *      older program goes on to Day 2 as before (14-ch1-day1.js ch1TvEvening).
 * While he pats and climbs into bed this file draws Squatch (squatch-art.js, the room's Squatch: same shapes, sizes
 * and outline), so his arm can move; the room leaves him out then (sqPose "lie", as for his bed flop home alone).
 * The older program asks for the steps through window.SSQ.beat("ch1-bedtime-story").steps() and draws what this
 * beat adds to the room with .draw(ctx) (60-frame-draw.js).
 */
import { drawSquatchArt, armEnds } from "./squatch-art.js";
import { drawThought, ROOM_SIZES } from "./bedtime-story-art.js";
import { bedLine } from "./bedtime-story-lines.js";
import { cutawaySteps } from "./cutaway.js";
import { footfall } from "./footfalls.js";
import { createBedtimeSound } from "./bedtime-story-sound.js";

export const BEDTIME_STORY_ID = "moonpie";

/**
 * Where everyone stands at home (game positions; every one is checked against the furniture by
 * tests/standing-spots.mjs). Squatch starts at the couch where the TV story left him (640, 545) and goes up past
 * the bucket (via) to the right end of his bed (pat), where his paw reaches the mattress. In bed he sits where the
 * room draws him sitting (on the bed on purpose). Mops sees the thought bubble and comes over beside the bed.
 */
export const BEDTIME_SPOTS = Object.freeze({
  via: Object.freeze({ x: 640, y: 470 }),
  pat: Object.freeze({ x: 330, y: 458 }),
  inBed: Object.freeze({ x: 205, y: 470 }),
  // Mops waits by the TV, clear of the bucket (the TV evening's own spot, 520, 545, has him standing on it), and
  // comes to the bed round the top of the bucket.
  mopsStart: Object.freeze({ x: 790, y: 560 }),
  mopsVia: Object.freeze({ x: 660, y: 470 }),
  mops: Object.freeze({ x: 380, y: 460 }),
});
// Where the room draws him sitting on the bed (60-frame-draw.js, sqPose "sit" and "sleep": his feet at 205, 444).
const SIT = Object.freeze({ x: 205, y: 444 });
/**
 * Timing in seconds (placeholders), each wordless part 2 to 4 seconds in all. walk/mops: walking speeds (game
 * pixels a second). pats: when each pat lands; think: when the thought bubble comes up (and fades in over
 * thinkIn); mopsGo: when Mops sets off (he has seen it). hop: his climb into bed. stand: Mops stands beside the
 * bed before the story starts.
 * asleep: how long he sleeps before Day 2, snores: when each snore starts.
 */
export const BEDTIME_PACE = Object.freeze({
  walk: 160,
  mops: 150,
  pats: Object.freeze([0.35, 0.85, 1.35]),
  patUp: 0.22,
  think: 0.6,
  thinkIn: 0.25,
  mopsGo: 1.0,
  patEnd: 2.4,
  hop: 0.55,
  stand: 0.7,
  asleep: 3.4,
  snores: Object.freeze([0.15, 1.75]),
});
// His far arm on the bed (pat down) and lifted between pats: the angle from straight down (squatch-art.js).
const ARM = Object.freeze({ down: -1.14, up: -1.65 });

export function createBedtimeStory(bridge) {
  const E = () => bridge.engine();
  const sound = createBedtimeSound(() => bridge.engine());
  let S = null; // this bedtime: { phase, t, sq: how this file draws Squatch, or null, think: when the bubble came up }
  let drew = null,
    record = { lastPose: "", mopsAt: null, hooves: [], phases: [] };
  const phase = (p) => {
    S.phase = p;
    S.t = 0;
    record.phases.push(p);
  };
  // One frame of one of this beat's wordless parts: time goes on and the frame is marked as this beat's.
  const beatFrame = (dt) => {
    S.t += dt || 0;
    S.at = E().time();
  };
  // Mops walks one frame toward (x, y); his hooves sound only while his feet move (footfalls.js).
  const mopsStep = (x, y, dt) => {
    const e = E(),
      a = e.pos("mops"),
      done = e.step("mops", x, y, BEDTIME_PACE.mops, dt || 0),
      b = e.pos("mops");
    if (footfall(S.ff, b.x, b.y, dt || 0, 0.25)) {
      sound.hoof(S.hooves++);
      record.hooves.push({ t: +S.t.toFixed(2), moved: Math.hypot(b.x - a.x, b.y - a.y) > 0 });
    }
    return done;
  };

  // Mops comes over to the bed (round the top of the bucket); true once he stands there, facing Squatch.
  const mopsComes = (dt) => {
    if (S.mopsArrived) return true;
    const to = S.mopsLeg === 0 ? BEDTIME_SPOTS.mopsVia : BEDTIME_SPOTS.mops;
    if (!mopsStep(to.x, to.y, dt)) return false;
    if (S.mopsLeg === 0) {
      S.mopsLeg = 1;
      return false;
    }
    const e = E();
    e.still("mops");
    e.face("mops", -1);
    S.mopsArrived = true;
    const p = e.pos("mops");
    record.mopsAt = { x: Math.round(p.x), y: Math.round(p.y), f: p.f };
    return true;
  };

  function begin() {
    const e = E();
    S = { phase: "", t: 0, at: e.time(), sq: null, think: -1, leg: 0, mopsLeg: 0, mopsArrived: false, mopsThere: null, ff: {}, hooves: 0, patted: 0, snored: 0 };
    record = { lastPose: "", mopsAt: null, hooves: [], phases: [] };
    e.set("sqPose", "stand");
    e.set("moPose", "stand");
    // (a cut from the TV story's last card: nobody is seen moving here)
    e.place("mops", BEDTIME_SPOTS.mopsStart.x, BEDTIME_SPOTS.mopsStart.y);
    e.face("mops", -1);
    phase("walk");
  }
  // 1a. He walks to the right end of his bed: up past the bucket first, then across.
  function walk(dt) {
    beatFrame(dt);
    const e = E(),
      to = S.leg === 0 ? BEDTIME_SPOTS.via : BEDTIME_SPOTS.pat;
    if (!e.step("sq", to.x, to.y, BEDTIME_PACE.walk, dt || 0)) return false;
    if (S.leg === 0) {
      S.leg = 1;
      return false;
    }
    e.still("sq");
    e.face("sq", -1);
    e.set("sqPose", "lie"); // from here this file draws him (his arm pats the bed)
    S.sq = { x: to.x, y: to.y, arm: ARM.up, feet: true };
    phase("pat");
    return true;
  }
  // 1b. He pats the bed; the thought bubble with the little crate comes up and stays.
  function pat(dt) {
    beatFrame(dt);
    const P = BEDTIME_PACE,
      t = S.t;
    // each pat: the paw comes down on the bed at its time and lifts again
    let arm = ARM.up;
    for (const at of P.pats) if (t >= at - P.patUp && t < at + P.patUp) arm = ARM.down + (ARM.up - ARM.down) * Math.min(1, Math.abs(t - at) / P.patUp);
    S.sq.arm = arm;
    while (S.patted < P.pats.length && t >= P.pats[S.patted]) (sound.pat(), S.patted++);
    t >= P.think && S.think < 0 && (S.think = E().time());
    t >= P.mopsGo && mopsComes(dt);
    if (t < P.patEnd) return false;
    S.sq.arm = ARM.up;
    phase("bed");
    return true;
  }
  // 1c. He climbs into bed (a little hop onto it); Mops sees him and comes over beside the bed.
  function bed(dt) {
    beatFrame(dt);
    const e = E(),
      P = BEDTIME_PACE,
      t = S.t;
    if (S.sq) {
      const k = Math.min(1, t / P.hop),
        ease = k * k * (3 - 2 * k);
      S.sq.x = BEDTIME_SPOTS.pat.x + (SIT.x - BEDTIME_SPOTS.pat.x) * ease;
      S.sq.y = BEDTIME_SPOTS.pat.y + (SIT.y - BEDTIME_SPOTS.pat.y) * ease - Math.sin(k * Math.PI) * 34;
      S.sq.arm = 0.35;
      mopsComes(dt);
      if (k >= 1) {
        // sitting on the bed, as the room draws him
        S.sq = null;
        e.place("sq", BEDTIME_SPOTS.inBed.x, BEDTIME_SPOTS.inBed.y);
        e.face("sq", 1);
        e.set("sqPose", "sit");
      }
      return false;
    }
    if (!mopsComes(dt)) return false;
    S.mopsThere == null && (S.mopsThere = t);
    if (t < S.mopsThere + P.stand) return false;
    phase("story");
    return true;
  }
  // 3. Back in the room after the pictures: the thought bubble is gone, he sits in bed, Mops beside him.
  function backInRoom() {
    const e = E();
    S.think = -1;
    S.sq = null;
    e.place("sq", BEDTIME_SPOTS.inBed.x, BEDTIME_SPOTS.inBed.y);
    e.set("sqPose", "sit");
    e.place("mops", BEDTIME_SPOTS.mops.x, BEDTIME_SPOTS.mops.y);
    e.face("mops", -1);
    e.set("moPose", "stand");
    phase("line");
  }
  // 4. He falls asleep: the room's sleep pose and its z z z, a gentle snore.
  function fallAsleep() {
    E().set("sqPose", "sleep");
    E().set("zzz", 0);
    phase("asleep");
  }
  function asleep(dt) {
    beatFrame(dt);
    const e = E();
    e.set("zzz", (e.get("zzz") || 0) + (dt || 0));
    while (S.snored < BEDTIME_PACE.snores.length && S.t >= BEDTIME_PACE.snores[S.snored]) (sound.snore(), S.snored++);
    if (S.t < BEDTIME_PACE.asleep) return false;
    record.lastPose = e.get("sqPose");
    phase("end");
    return true;
  }

  // Squatch as this file draws him (patting, climbing into bed): the room's Squatch, at the room's size.
  function drawSquatch(ctx) {
    const s = S.sq,
      scale = (E().squatchScale && E().squatchScale()) || 3,
      inBed = s.x <= SIT.x + 1;
    const arms = [{ a: s.arm }, { a: 0.35 }];
    drawSquatchArt(ctx, s.x, s.y, scale, { line: 2 * scale, arms, feet: !inBed, shadow: S.phase === "pat" });
    // the paw that pats: his far arm's, on the bed's side
    const h = armEnds(arms)[0].hand;
    return { paw: { x: s.x + h.x * scale, y: s.y + h.y * scale } };
  }
  // The top of his head where the room draws him now (for the thought bubble).
  function headNow(ctx) {
    const e = E(),
      scale = (e.squatchScale && e.squatchScale()) || 3,
      top = (y) => ({ y: y - 48.5 * scale });
    if (S.sq) return { x: S.sq.x, ...top(S.sq.y) };
    const pose = e.get("sqPose");
    if (pose === "sit" || pose === "sleep") return { x: SIT.x, ...top(SIT.y) };
    const p = e.pos("sq");
    return { x: p.x, ...top(p.y) };
  }

  return {
    /** The queue steps of the whole bedtime story, from the end of the TV story to Squatch asleep. */
    steps() {
      const e = E();
      return [
        e.run(begin),
        e.until(walk),
        e.until(pat),
        e.until(bed),
        ...cutawaySteps(BEDTIME_STORY_ID),
        e.run(backInRoom),
        e.say("mops", bedLine("mops-moon-pie")),
        e.run(fallAsleep),
        e.until(asleep),
      ];
    },
    /**
     * Drawn over the room (60-frame-draw.js, after the people): Squatch while he pats and climbs into bed, and the
     * thought bubble. Only while one of this beat's wordless parts is the step playing now.
     */
    draw(ctx) {
      drew = null;
      const e = E();
      if (!S || !e || e.room() !== "closet" || !["pat", "bed"].includes(S.phase) || e.time() - S.at > 0.25) return;
      const c = e.current();
      if (!c || c.k !== "until") return;
      drew = {};
      if (S.sq && e.get("sqPose") === "lie") {
        const d = drawSquatch(ctx);
        drew.squatch = { x: Math.round(S.sq.x), y: Math.round(S.sq.y), paw: { x: Math.round(d.paw.x), y: Math.round(d.paw.y) } };
      }
      if (S.think >= 0) {
        const head = headNow(ctx),
          box = drawThought(ctx, head, Math.min(1, (e.time() - S.think) / BEDTIME_PACE.thinkIn));
        drew.thought = { box, head, crate: true };
      }
    },
    /** Tests: the part playing now, what the last frame drew, and what happened. */
    debug() {
      return {
        phase: S ? S.phase : "",
        drew,
        mopsAt: record.mopsAt,
        hooves: record.hooves.slice(),
        snores: sound.asked().snore,
        pats: sound.asked().pat,
        lastPoseBeforeDay2: record.lastPose,
        phases: record.phases.slice(),
        roomSizes: ROOM_SIZES,
      };
    },
  };
}
