/**
 * Beat 21, the bedtime story: why Moon Pies (docs/CH1-STORY-WALKTHROUGH.md, "21. Bedtime story"). It replaces the
 * caption box the game showed at bedtime ("ch1moon"). After the TV story, at home:
 *   1. Squatch walks to his crate bed and climbs in; Mops comes over beside it (wordless, each part 2 to 4 seconds,
 *      Brian 30a). Then Squatch asks, in one bubble over him: "Tell me about when we first met?" (waits for NEXT;
 *      Brian, 2026-11-26, video note 0:12, in place of the wordless pat and thought bubble).
 *   2. The old crate story from commit 71ec66e, full screen, each picture waiting for NEXT (bedtime-story-art.js;
 *      the words are bedtime-story-lines.js; the fourth, the mop bucket, is on behind BEDTIME_SWITCHES).
 *   3. Back in the room: Mops's bedtime line, as the game showed it before, in one bubble over him (waits for NEXT).
 *      Then a full-screen picture of Squatch's crayon drawing of the Guardians (big furry Sasquatches) with Mops beside
 *      it saying, in a bubble over him, his Guardians line (waits for NEXT; Brian, 2026-11-26: Mops tells him about
 *      the Guardians without hinting it's him; words approved, chat 18b A). The morning (feat/ch1-day2-morning)
 *      shows the same drawing.
 *   4. He falls asleep, every part wordless and playing by itself for 2 to 4 seconds (Brian, 2026-11-26: "should be
 *      a bit more natural transition and then some snoring"): a big yawn and stretch; he lies down; Mops tucks him
 *      in with a blanket; Mops walks to the door, the light goes down to a night-blue dim and Mops goes out; three
 *      snores, each with a "z z z" rising over him; then the room fades to black. The older program then goes on to
 *      Day 2 (14-ch1-day1.js ch1TvEvening), and the room fades in from black.
 * Mops has no sleeping spot at home in the game or the docs, so he goes out through the doorway (a question for
 * Brian). While Squatch climbs into bed, and from the yawn until Day 2, this file draws Squatch (squatch-art.js, the
 * room's Squatch: same shapes, sizes and outline; lying down as the home-alone bed flop draws him, which Brian
 * approved, 14A); the room leaves him out then (sqPose "lie"). No goal chip shows from the start of this beat until
 * Day 2 (the chip is cleared at the start; tests/bedtime-story.mjs reads the page's chip every frame).
 * The older program asks for the steps through window.SSQ.beat("ch1-bedtime-story").steps() and draws what this
 * beat adds to the room with .draw(ctx) (60-frame-draw.js).
 */
import { drawSquatchArt } from "./squatch-art.js";
import { ROOM_SIZES, BEDTIME_PICTURES } from "./bedtime-story-art.js";
import { bedLine } from "./bedtime-story-lines.js";
import { cutawaySteps } from "./cutaway.js";
import { footfall } from "./footfalls.js";
import { createBedtimeSound } from "./bedtime-story-sound.js";

export const BEDTIME_STORY_ID = "moonpie";
/** The picture after Mops's bedtime line: Squatch's crayon drawing of the Guardians (bedtime-story-art.js). */
export const GUARDIANS_ID = "guardians";

/**
 * Where everyone stands at home (game positions; every one is checked against the furniture by
 * tests/standing-spots.mjs). Squatch starts at the couch where the TV story left him (640, 545) and goes up past
 * the bucket (via) to the right end of his bed (side), then hops in. In bed he sits where the room draws him sitting
 * (on the bed on purpose). Mops comes over beside the bed, steps in to the bed's foot to tuck him in (tuck), and
 * walks round the top of the bucket (mopsVia) to the doorway on the right wall (door), where he puts the light out
 * and goes out.
 */
export const BEDTIME_SPOTS = Object.freeze({
  via: Object.freeze({ x: 640, y: 470 }),
  side: Object.freeze({ x: 330, y: 458 }),
  inBed: Object.freeze({ x: 205, y: 470 }),
  // Mops waits by the TV, clear of the bucket (the TV evening's own spot, 520, 545, has him standing on it), and
  // comes to the bed round the top of the bucket.
  mopsStart: Object.freeze({ x: 790, y: 560 }),
  mopsVia: Object.freeze({ x: 660, y: 470 }),
  mops: Object.freeze({ x: 380, y: 460 }),
  tuck: Object.freeze({ x: 325, y: 460 }),
  door: Object.freeze({ x: 880, y: 462 }),
});
// Where the room draws him sitting on the bed (60-frame-draw.js, sqPose "sit" and "sleep": his feet at 205, 444),
// and where his feet are lying on the locked picture's mattress, head to the left, a quarter turn (the home-alone bed
// flop's own spot, home-alone.js LIE).
const SIT = Object.freeze({ x: 205, y: 444 });
const LIE = Object.freeze({ x: 266, y: 386, a: -Math.PI / 2 });
// Out through the doorway on the right wall (x 912 to 940), where Mops goes out after the light.
const DOOR_OUT = Object.freeze({ x: 950, y: 462 });
// The blanket over him lying there: from his neck (x0) to past his feet (x1), from over his body (top) down to the
// mattress (bottom).
const BLANKET = Object.freeze({ x0: 200, x1: 292, top: 342, bottom: 424 });
/**
 * Timing in seconds (placeholders); every wordless part plays 2 to 4 seconds. walk/mops/mopsOut: walking speeds
 * (game pixels a second). mopsGo: when Mops sets off for the bed (into Squatch's walk). hop: his climb into bed.
 * stand: Mops stands beside the bed before Squatch asks. Falling asleep: yawn (arms up and the yawn's open mouth
 * between yawnOpen and yawnShut), lie (tipping over between its two times), tuck (Mops steps in, the blanket comes
 * up between blanket times, then he steps back out of the way), lights (the click, the dim, Mops gone out the
 * door at `out`), snore (one piece a snore, three pieces), fade (to black), fadeIn (the morning comes up from black).
 */
export const BEDTIME_PACE = Object.freeze({
  walk: 160,
  mops: 150,
  mopsOut: 170,
  mopsGo: 0.8,
  hop: 0.55,
  stand: 1.0,
  yawn: 2.4,
  yawnArms: 0.7,
  yawnOpen: 0.5,
  yawnShut: 1.7,
  lie: 2.0,
  lieFrom: 0.3,
  lieTo: 1.2,
  tuck: 2.4,
  tuckStep: 0.5,
  blanket: Object.freeze([0.6, 1.6]),
  lights: 2.2,
  click: 0.3,
  dimFrom: 0.35,
  dimTo: 1.3,
  out: 1.7,
  snores: 3,
  snore: 2.6,
  fade: 2.0,
  fadeIn: 1.2,
});
/** How the room looks at night: the night-blue over the room at full dim (alpha), and the snoring's "z z z". */
export const BEDTIME_NIGHT = Object.freeze({
  color: "rgb(14,22,58)",
  dim: 0.58,
  zzz: Object.freeze({ size: 46, grow: 10, rise: 80, color: "#bcd8ff" }),
});
// His arms (the angle from straight down, squatch-art.js): at rest, and both up for the stretch.
const REST = [{ a: -0.35 }, { a: 0.35 }],
  STRETCH = [{ a: -2.75 }, { a: 2.75 }];
const INK = "#1e2430";
const ease = (k) => {
  const q = Math.max(0, Math.min(1, k));
  return q * q * (3 - 2 * q);
};
const between = (t, a, b) => ease((t - a) / (b - a));
// The wordless parts of falling asleep, in order (the snores are snore1 to snore3).
const ASLEEP_PARTS = ["yawn", "lie", "tuck", "door", "lights", "snore1", "snore2", "snore3", "fade"];

export function createBedtimeStory(bridge) {
  const E = () => bridge.engine();
  const sound = createBedtimeSound(() => bridge.engine());
  let S = null; // this bedtime: { phase, t, sq: how this file draws Squatch, or null, ... }
  let on = false; // from the walk to bed until the fade to black ends (showing(): the bedtime music)
  let drew = null,
    record = { lastPose: "", mopsAt: null, hooves: [], phases: [], tuck: null, door: null };
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
  // Mops walks one frame toward (x, y) at `speed`; his hooves sound only while his feet move (footfalls.js).
  const mopsStep = (x, y, dt, speed) => {
    const e = E(),
      a = e.pos("mops"),
      done = e.step("mops", x, y, speed || BEDTIME_PACE.mops, dt || 0),
      b = e.pos("mops");
    if (footfall(S.ff, b.x, b.y, dt || 0, 0.25)) {
      sound.hoof(S.hooves++);
      record.hooves.push({ t: +S.t.toFixed(2), moved: Math.hypot(b.x - a.x, b.y - a.y) > 0 });
    }
    return done;
  };
  // Mops walks a list of spots in turn; true once he stands on the last one.
  const mopsRoute = (route, dt, speed) => {
    if (S.mopsLeg >= route.length) return true;
    const to = route[S.mopsLeg];
    if (!mopsStep(to.x, to.y, dt, speed)) return false;
    S.mopsLeg++;
    if (S.mopsLeg < route.length) return false;
    E().still("mops");
    return true;
  };

  // Mops comes over to the bed (round the top of the bucket); true once he stands there, facing Squatch.
  const mopsComes = (dt) => {
    if (S.mopsArrived) return true;
    if (!mopsRoute([BEDTIME_SPOTS.mopsVia, BEDTIME_SPOTS.mops], dt)) return false;
    const e = E();
    e.face("mops", -1);
    S.mopsArrived = true;
    const p = e.pos("mops");
    record.mopsAt = { x: Math.round(p.x), y: Math.round(p.y), f: p.f };
    return true;
  };

  function begin() {
    const e = E();
    S = { phase: "", t: 0, at: e.time(), sq: null, leg: 0, mopsLeg: 0, mopsArrived: false, mopsThere: null, ff: {}, hooves: 0, blanket: 0, dim: 0, black: 0, snored: 0, endAt: -1 };
    record = { lastPose: "", mopsAt: null, hooves: [], phases: [], tuck: null, door: null };
    on = true;
    sound.reset();
    e.set("sqPose", "stand");
    e.set("moPose", "stand");
    // No goal while the bedtime story plays and he sleeps (Brian, 2026-11-26: the old video showed the morning's goal).
    e.set("ctrl", false);
    e.set("act", null);
    e.set("ch1Chip", "");
    e.chipNow();
    // (a cut from the TV story's last card: nobody is seen moving here)
    e.place("mops", BEDTIME_SPOTS.mopsStart.x, BEDTIME_SPOTS.mopsStart.y);
    e.face("mops", -1);
    phase("walk");
  }
  // 1a. He walks to the right end of his bed: up past the bucket first, then across. Mops sets off for the bed too.
  function walk(dt) {
    beatFrame(dt);
    const e = E(),
      to = S.leg === 0 ? BEDTIME_SPOTS.via : BEDTIME_SPOTS.side;
    S.t >= BEDTIME_PACE.mopsGo && mopsComes(dt);
    if (!e.step("sq", to.x, to.y, BEDTIME_PACE.walk, dt || 0)) return false;
    if (S.leg === 0) {
      S.leg = 1;
      return false;
    }
    e.still("sq");
    e.face("sq", -1);
    e.set("sqPose", "lie"); // from here this file draws him, hopping into bed
    S.sq = { x: to.x, y: to.y, a: 0, arms: [{ a: 0.35 }, { a: 0.35 }], feet: true, eyes: "", yawn: 0 };
    phase("bed");
    return true;
  }
  // 1b. He climbs into bed (a little hop onto it); Mops comes over and stands beside the bed.
  function bed(dt) {
    beatFrame(dt);
    const e = E(),
      P = BEDTIME_PACE,
      t = S.t;
    mopsComes(dt);
    if (S.sq) {
      const k = Math.min(1, t / P.hop),
        q = ease(k);
      S.sq.x = BEDTIME_SPOTS.side.x + (SIT.x - BEDTIME_SPOTS.side.x) * q;
      S.sq.y = BEDTIME_SPOTS.side.y + (SIT.y - BEDTIME_SPOTS.side.y) * q - Math.sin(k * Math.PI) * 34;
      S.sq.feet = k < 0.5;
      if (k >= 1) {
        // sitting on the bed, as the room draws him
        S.sq = null;
        e.place("sq", BEDTIME_SPOTS.inBed.x, BEDTIME_SPOTS.inBed.y);
        e.face("sq", 1);
        e.set("sqPose", "sit");
      }
      return false;
    }
    if (!S.mopsArrived) return false;
    S.mopsThere == null && (S.mopsThere = t);
    if (t < S.mopsThere + P.stand) return false;
    phase("ask");
    return true;
  }
  // 3. Back in the room after the pictures: he sits in bed, Mops beside him.
  function backInRoom() {
    const e = E();
    S.sq = null;
    e.place("sq", BEDTIME_SPOTS.inBed.x, BEDTIME_SPOTS.inBed.y);
    e.set("sqPose", "sit");
    e.place("mops", BEDTIME_SPOTS.mops.x, BEDTIME_SPOTS.mops.y);
    e.face("mops", -1);
    e.set("moPose", "stand");
    phase("line");
  }
  // 4. Falling asleep. From here this file draws him (the room's sitting Squatch, then lying down).
  function toSleep() {
    const e = E();
    e.set("sqPose", "lie");
    S.sq = { x: SIT.x, y: SIT.y, a: 0, arms: REST, feet: false, eyes: "", yawn: 0 };
    S.yawned = false;
    S.at = e.time(); // drawn from this frame on (the room no longer draws him)
    phase("yawn");
  }
  // 4a. A big yawn and a stretch, sitting up in bed.
  function yawn(dt) {
    beatFrame(dt);
    const P = BEDTIME_PACE,
      t = S.t;
    S.yawned || ((S.yawned = true), sound.yawn());
    const up = Math.min(between(t, 0, P.yawnArms), 1 - between(t, P.yawn - P.yawnArms, P.yawn - 0.15));
    S.sq.arms = REST.map((r, i) => ({ a: r.a + (STRETCH[i].a - r.a) * up }));
    S.sq.yawn = Math.min(between(t, 0, P.yawnOpen), 1 - between(t, P.yawnShut, P.yawnShut + 0.35));
    if (t < P.yawn) return false;
    S.sq.arms = REST;
    S.sq.yawn = 0;
    phase("lie");
    return true;
  }
  // 4b. He lies down on his side on the mattress and his eyes close.
  function lie(dt) {
    beatFrame(dt);
    const P = BEDTIME_PACE,
      k = between(S.t, P.lieFrom, P.lieTo);
    S.sq.x = SIT.x + (LIE.x - SIT.x) * k;
    S.sq.y = SIT.y + (LIE.y - SIT.y) * k;
    S.sq.a = LIE.a * k;
    S.sq.eyes = k > 0.6 ? "closed" : "";
    if (S.t < P.lie) return false;
    S.mopsLeg = 0;
    phase("tuck");
    return true;
  }
  // 4c. Mops steps in to the bed's foot and pulls the blanket up over him, then steps back.
  function tuck(dt) {
    beatFrame(dt);
    const e = E(),
      P = BEDTIME_PACE,
      t = S.t;
    if (t < P.tuckStep) mopsStep(BEDTIME_SPOTS.tuck.x, BEDTIME_SPOTS.tuck.y, dt, P.mops);
    else if (t > P.blanket[1] + 0.15) mopsStep(BEDTIME_SPOTS.mops.x, BEDTIME_SPOTS.mops.y, dt, P.mops);
    else e.still("mops");
    e.face("mops", -1);
    S.rustled || t < P.blanket[0] || ((S.rustled = true), sound.rustle());
    S.blanket = between(t, P.blanket[0], P.blanket[1]);
    if (t < P.tuck) return false;
    e.still("mops");
    const m = e.pos("mops");
    record.tuck = { blanket: S.blanket, mops: { x: Math.round(m.x), y: Math.round(m.y) } };
    S.mopsLeg = 0;
    phase("door");
    return true;
  }
  // 4d. Mops walks to the doorway on the right wall.
  function door(dt) {
    beatFrame(dt);
    if (!mopsRoute([BEDTIME_SPOTS.mopsVia, BEDTIME_SPOTS.door], dt, BEDTIME_PACE.mopsOut)) return false;
    const e = E(),
      m = e.pos("mops");
    e.face("mops", -1);
    record.door = { x: Math.round(m.x), y: Math.round(m.y) };
    phase("lights");
    return true;
  }
  // 4e. At the door he puts the light out (a click; the room goes down to a night-blue dim) and goes out.
  function lights(dt) {
    beatFrame(dt);
    const e = E(),
      P = BEDTIME_PACE,
      t = S.t;
    S.clicked || t < P.click || ((S.clicked = true), sound.click());
    S.dim = between(t, P.dimFrom, P.dimTo);
    // he steps into the doorway and is gone
    t >= P.out - 0.4 && t < P.out && (e.face("mops", 1), mopsStep(DOOR_OUT.x, DOOR_OUT.y, dt, P.mopsOut));
    t >= P.out && e.get("moPose") !== "hidden" && (e.still("mops"), e.set("moPose", "hidden"), e.place("mops", -400, BEDTIME_SPOTS.door.y));
    if (t < P.lights) return false;
    phase("snore1");
    return true;
  }
  // 4f. Three snores, one a part: each one heard (the game's snore), with a "z z z" rising over him.
  function snore(dt) {
    beatFrame(dt);
    S.heard !== S.phase && ((S.heard = S.phase), sound.snore(), S.snored++);
    if (S.t < BEDTIME_PACE.snore) return false;
    const k = S.snored;
    phase(k < BEDTIME_PACE.snores ? "snore" + (k + 1) : "fade");
    return true;
  }
  // 4g. The room fades to black.
  function fade(dt) {
    beatFrame(dt);
    S.black = between(S.t, 0, BEDTIME_PACE.fade);
    if (S.t < BEDTIME_PACE.fade) return false;
    record.lastPose = S.sq && S.sq.eyes === "closed" && S.sq.a === LIE.a ? "asleep, lying down" : E().get("sqPose");
    S.endAt = E().time();
    on = false;
    phase("end");
    return true;
  }

  // Squatch as this file draws him: the room's Squatch, at the room's size, turned by `a` round his feet.
  function drawSquatch(ctx) {
    const s = S.sq,
      scale = (E().squatchScale && E().squatchScale()) || 3;
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.a || 0);
    const d = drawSquatchArt(ctx, 0, 0, scale, { line: 2 * scale, arms: s.arms, feet: s.feet, eyes: s.eyes, shadow: S.phase === "bed" && s.feet });
    // the yawn: his mouth wide open over the smile
    if (s.yawn > 0.05 && d && d.mouth) {
      ctx.beginPath();
      ctx.ellipse(d.mouth.x, d.mouth.y + 1.5 * scale, 4.2 * scale * (0.5 + 0.5 * s.yawn), 5.2 * scale * s.yawn, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#4a1f1a";
      ctx.fill();
      ctx.lineWidth = 1.1 * scale;
      ctx.strokeStyle = INK;
      ctx.stroke();
    }
    ctx.restore();
    return { blanket: drawBlanket(ctx) };
  }
  // The blanket Mops pulls up over him as he lies on the mattress, a soft quilt over his body from beyond his feet to
  // his neck, drawn coming up from the feet end (a placeholder drawing). Game positions round where he lies (LIE).
  function drawBlanket(ctx) {
    if (!(S.blanket > 0)) return null;
    const B = BLANKET,
      left = B.x1 - (B.x1 - B.x0) * S.blanket;
    ctx.save();
    ctx.beginPath();
    ctx.rect(left, 0, 2000, 2000);
    ctx.clip();
    ctx.beginPath();
    ctx.moveTo(B.x0, B.bottom);
    ctx.lineTo(B.x0 - 2, B.top + 18);
    ctx.quadraticCurveTo(B.x0 + 4, B.top, B.x0 + 26, B.top - 2);
    ctx.lineTo(B.x1 - 40, B.top + 4);
    ctx.quadraticCurveTo(B.x1 - 4, B.top + 12, B.x1, B.top + 46);
    ctx.lineTo(B.x1 + 2, B.bottom);
    ctx.quadraticCurveTo((B.x0 + B.x1) / 2, B.bottom + 8, B.x0, B.bottom);
    ctx.closePath();
    ctx.fillStyle = "#6f8fd6";
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = INK;
    ctx.lineJoin = "round";
    ctx.stroke();
    // the turned-down top edge at his neck, and two soft folds
    ctx.beginPath();
    ctx.roundRect(B.x0 - 2, B.top + 2, 16, B.bottom - B.top - 2, 6);
    ctx.fillStyle = "#b8c9f2";
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.stroke();
    for (const fx of [0.45, 0.72]) {
      const x = B.x0 + (B.x1 - B.x0) * fx;
      ctx.beginPath();
      ctx.moveTo(x, B.top + 16);
      ctx.quadraticCurveTo(x + 6, (B.top + B.bottom) / 2, x - 2, B.bottom - 10);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#4f6db3";
      ctx.stroke();
    }
    ctx.restore();
    return { cover: +S.blanket.toFixed(2), x0: Math.round(left), x1: B.x1, top: B.top, bottom: B.bottom };
  }
  // Where his head is now (game positions): over his feet when he sits, to the left of them lying down.
  function headAt() {
    const s = S.sq,
      scale = (E().squatchScale && E().squatchScale()) || 3,
      up = 32 * scale;
    return { x: s.x + Math.sin(s.a || 0) * up, y: s.y - Math.cos(s.a || 0) * up };
  }
  // A colour over the whole picture (the room may be drawn shifted, so it reaches well past the edges).
  const wash = (ctx, color, a) => {
    if (a <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.min(1, a);
    ctx.fillStyle = color;
    ctx.fillRect(-2000, -2000, 6000, 5000);
    ctx.restore();
  };

  return {
    /** The queue steps of the whole bedtime story, from the end of the TV story to the fade to black. */
    steps() {
      const e = E();
      return [
        e.run(begin),
        e.until(walk),
        e.until(bed),
        e.say("sq", bedLine("sq-first-met")),
        e.run(() => phase("story")),
        // the story pictures; as Mops's "...Weeee-eenn-nnttt?" comes up, his bleat
        ...cutawaySteps(BEDTIME_STORY_ID).flatMap((c) => (BEDTIME_PICTURES[c.panel] === "weent" ? [e.run(() => sound.bleat()), c] : [c])),
        e.run(backInRoom),
        e.say("mops", bedLine("mops-moon-pie")),
        e.run(() => phase("guardians")),
        ...cutawaySteps(GUARDIANS_ID),
        e.run(toSleep),
        e.until(yawn),
        e.until(lie),
        e.until(tuck),
        e.until(door),
        e.until(lights),
        ...Array.from({ length: BEDTIME_PACE.snores }, () => e.until(snore)),
        e.until(fade),
      ];
    },
    /**
     * Drawn over the room (60-frame-draw.js, after the people): Squatch while he hops into bed and from the yawn on,
     * the blanket, the night's dim, the "z z z", the fade to black, and, once Day 2 has begun, the fade in from black.
     * Only while one of this beat's wordless parts is the step playing now (or the fade in is still going).
     */
    draw(ctx) {
      drew = null;
      const e = E();
      if (!S || !e || e.room() !== "closet") return;
      const P = BEDTIME_PACE;
      if (S.phase === "end") {
        const k = (e.time() - S.endAt) / P.fadeIn;
        if (S.endAt < 0 || k >= 1 || k < 0) return;
        wash(ctx, "#000", 1 - ease(k));
        drew = { black: +(1 - ease(k)).toFixed(2), fadeIn: true };
        return;
      }
      if (!["bed", ...ASLEEP_PARTS].includes(S.phase) || e.time() - S.at > 0.25) return;
      const c = e.current();
      if (!c || c.k !== "until") return;
      drew = {};
      if (S.sq && e.get("sqPose") === "lie") {
        const d = drawSquatch(ctx);
        drew.squatch = { x: Math.round(S.sq.x), y: Math.round(S.sq.y), a: +(S.sq.a || 0).toFixed(2), eyes: S.sq.eyes, yawn: +S.sq.yawn.toFixed(2), arms: S.sq.arms.map((r) => +r.a.toFixed(2)) };
        d.blanket && (drew.blanket = d.blanket);
      }
      const m = e.pos("mops");
      drew.mops = { x: Math.round(m.x), y: Math.round(m.y), shown: e.get("moPose") !== "hidden" };
      wash(ctx, BEDTIME_NIGHT.color, S.dim * BEDTIME_NIGHT.dim);
      drew.dim = +(S.dim * BEDTIME_NIGHT.dim).toFixed(2);
      if (S.phase.startsWith("snore")) {
        // the "z z z" rises from his head and fades out as the snore ends; each snore's is a little bigger
        const Z = BEDTIME_NIGHT.zzz,
          k = Math.min(1, S.t / (P.snore * 0.85)),
          h = headAt(),
          size = Z.size + Z.grow * (S.snored - 1),
          x = h.x + 30 + 20 * k,
          y = h.y - 60 - Z.rise * k,
          a = Math.min(1, S.t / 0.25) * (1 - between(S.t, P.snore * 0.7, P.snore));
        ctx.save();
        ctx.globalAlpha = a;
        e.text(bedLine("mark-sleep"), x, y, size, Z.color, "center", 900);
        ctx.restore();
        drew.zzz = { x: Math.round(x), y: Math.round(y), size, a: +a.toFixed(2), snore: S.snored };
      }
      wash(ctx, "#000", S.black);
      drew.black = +S.black.toFixed(2);
    },
    /**
     * True while the bedtime story plays, from the walk to bed until the fade to black ends: a step of it is up (its
     * walks and wordless parts, the lines over Squatch and Mops, the story and Guardians pictures), at home, with the
     * player not in control. bridge.js turns the home music cue into "bedtime" then (music-picks.js: Reawakening).
     */
    showing() {
      const e = E();
      // (over once the fade has ended, whatever else happened)
      if (!on || !e || !S || S.phase === "end") return (on = false);
      const c = e.current(),
        mine = !c || c.k === "do" || c.k === "until" || (c.k === "bub" && (c.who === "sq" || c.who === "mops")) || (c.k === "cutaway" && (c.id === BEDTIME_STORY_ID || c.id === GUARDIANS_ID));
      // (something else up, or the player has control, or he is out of the room: cut short by a restart; it is over)
      if (!mine || e.get("ctrl") || e.room() !== "closet") on = false;
      return on;
    },
    /** Tests: the part playing now, what the last frame drew, and what happened. */
    debug() {
      const a = sound.asked();
      return {
        phase: S ? S.phase : "",
        drew,
        mopsAt: record.mopsAt,
        tuck: record.tuck,
        door: record.door,
        hooves: record.hooves.slice(),
        snores: a.snore,
        sounds: a,
        lastPoseBeforeDay2: record.lastPose,
        phases: record.phases.slice(),
        roomSizes: ROOM_SIZES,
      };
    },
  };
}
