/**
 * The home morning, Chapter 1 beats 22 to 24 (docs/CH1-STORY-WALKTHROUGH.md): a gift from the Guardians, the
 * calendar (delivery day, there to look at), and Mops's forgotten lunch. It follows the bedtime story (beat 21, bedtime-story.js) and
 * hands over to today's lunch sneak (src/game/14-ch1-day2.js ch1TakeLunch). What the player sees, step by step
 * (plan reviewed 2026-11-26; every word is from home-morning-lines.js, every drawing from home-morning-art.js):
 *   night   wordless: the night the bedtime story ended on goes on: the room is dark, Squatch asleep in his crate bed
 *           under the blanket and Mops asleep on his back beside it, feet in the air (as bedtime-story.js left them;
 *           Brian 2026-11-26, #33); the room comes up.
 *   pa      the wall speaker's ding-dong, sound lines round it, and its line (suggested words, Brian 2026-11-26, #41):
 *           "Good morning, Stormtop! Ganitor Mops to the party hall. The new robot janitors arrive today!" (NEXT);
 *           then the music comes from the speaker (notes rise from it): Kevin MacLeod's "Morning" (music-picks.js,
 *           the "day2am" row).
 *   mopsUp  wordless: the PA wakes Mops: he opens his eyes, rolls onto his side and gets up, looks at Squatch asleep
 *           (a heart: Brian 2026-11-26, #48), and walks out of the door (round the bucket and the bag).
 *   wake    wordless: Squatch sits up in the crate (the blanket slides off), stretches both arms up, hops out over the
 *           crate's side and walks round its foot to beside the rocket (the note tied on).
 *   rocket  "Squatch: pick up the gift"; only the rocket is outlined and glows. PICK UP · rocket.
 *   note    the note tied to it opens, a close-up with its approved words "Brave Sasquatches stay hidden. — The
 *           Guardians" (NEXT) (Brian 2026-11-26, video note 0:24: "when he picks up the rocket, he should also read
 *           the note at that moment").
 *   hold    he holds it up high, one heart, and a thought bubble shows his crayon drawing of the Guardians (who he
 *           thinks they are), wordless; then "The Guardians came! They always come when I'm scared." (NEXT)
 *   think   wordless: a thought bubble shows the Guardian Box, so the box is seen before the chip names it.
 *   closet  "Squatch: put the gift in the box"; the wardrobe (taller on Day 2: tall-closet.js) is outlined.
 *           OPEN · closet (he walks round the bed's corner to its right).
 *   box     the door is open; the G box on the closet floor, under the clothes, is outlined. PUT IN · box.
 *   lift    he takes the box out onto the floor; the close-up (the first build's box view): the open box with the
 *           older notes, its lid labelled MY GARDIAN BOX, his crayon drawing MY GUARDIANS, and the gift drops in with
 *           the folded note still tied on, not read again (NEXT).
 *   putBack back in the room he puts the box, the gift in it, back in the closet (Brian, 2026-11-26);
 *   shut    and shuts the closet: the calendar on its door is back.
 *   toBag   the lunch bag by the door (MOPS on it) glows and is outlined; the player walks him to it (Brian
 *           2026-11-26, video note 0:30: "he should have to walk over to the lunch and see it first"); the goal
 *           words come up after 20 seconds, as everywhere.
 *   notice  as he gets there: "He forgot his lunch!" (NEXT)
 *   lunch   "Squatch: take the lunch"; TAKE · lunch hands over to the lunch sneak (the bag in his paw). The calendar
 *           is not a step (Brian, 2026-11-26: optional): LOOK · calendar, by the wardrobe, opens the older program's
 *           close-up with today's marks (home-morning-art.js drawCalendarToday) and comes back to this step.
 * Its progress lives in the game-state field ch1HomeMorning (and ch1Step, "hm-<step>"), so the step restart (↺)
 * brings back the step the player is on. While he sleeps, wakes, stretches, hops out of bed and holds the gift up
 * this file draws Squatch (squatch-art.js, the room's Squatch: same shapes, size and outline; in the crate bed as the
 * bedtime story draws him, the crate's front wall over him) and the room leaves him out (sqPose "lie"). Mops is drawn
 * here while he is asleep and getting up (mops-asleep-art.js, the room's own drawing of him, turned), and by the room
 * while he walks out.
 * Every walk here goes round the furniture (HOME_MORNING_WALKS; docs/REVIEW-RULES.md, "Nobody walks through
 * furniture"; tests/scripted-walks.mjs).
 */
import { drawSquatchArt, armEnds } from "./squatch-art.js";
import { morningWords } from "./home-morning-lines.js";
import { MORNING_THINGS, MORNING_SIZES, TRACE, drawRocket, drawLunchBag, drawGuardianBox, drawBoxWithGift, drawBoxThought, drawCrayonThought, drawCalendarToday, BOX_CLOSEUP, GBOX_ID, NOTE_ID } from "./home-morning-art.js";
import { drawBedtimeSquatch, drawBedBlanket, drawCrateFront, BED_POSES, BEDTIME_SPOTS, CRATE_FRONT } from "./bedtime-story.js";
import { MOPS_ASLEEP, drawMopsTurned } from "./mops-asleep-art.js";
import { drawTallCloset } from "./tall-closet.js";
import { HOME_THINGS } from "./home-alone.js";
import { cutawaySteps } from "./cutaway.js";
import { footfall } from "./footfalls.js";
import { createHomeMorningSound, HOME_MORNING_SOUND } from "./home-morning-sound.js";

export const HOME_MORNING_ID = "ch1-home-morning";

/**
 * Where Squatch stands (game positions; tests/standing-spots.mjs checks each against the furniture). bed: where the
 * room keeps him while this file draws him in the crate bed; side: beside the crate's right end, where he hops out to
 * (the bedtime story's own spot, where he climbed in); woke: beside the rocket, where getting up ends; closet: right
 * of the wardrobe and the bed's corner, facing left, so neither the box nor the calendar is ever under him (Fable's
 * review, 2026-11-26); lunch: left of the bag, so he never stands on it.
 */
export const HOME_MORNING_SPOTS = Object.freeze({
  bed: Object.freeze({ x: 205, y: 470 }),
  side: BEDTIME_SPOTS.side,
  woke: Object.freeze({ x: 250, y: 580 }),
  closet: Object.freeze({ x: 300, y: 398 }),
  lunch: Object.freeze({ x: 760, y: 505 }),
  // Mops: where he lies asleep (the bedtime story's MOPS_ASLEEP), and out through the doorway in the right wall
  mopsBed: Object.freeze({ x: MOPS_ASLEEP.x, y: MOPS_ASLEEP.floor }),
  mopsOut: Object.freeze({ x: 960, y: 430 }),
});
/**
 * Every walk this file makes, as the corners each one goes through after its start (game positions): round the crate
 * bed, the bucket and the lunch bag, never through them (Brian, 2026-11-26, video note 0:18: "he kind of glitches
 * through the crate"; docs/REVIEW-RULES.md "Nobody walks through furniture"; tests/scripted-walks.mjs samples each).
 *   getUp     Squatch, from beside the crate's right end round its foot to beside the rocket
 *   toCloset  Squatch, from beside the rocket round the crate's foot and up its right side to the wardrobe
 *   mopsOut   Mops, from where he slept, along the back of the room (behind the bucket and the bag) and out the door
 */
export const HOME_MORNING_WALKS = Object.freeze({
  getUp: Object.freeze({ who: "sq", from: HOME_MORNING_SPOTS.side, via: Object.freeze([{ x: 315, y: 560 }, HOME_MORNING_SPOTS.woke]) }),
  toCloset: Object.freeze({ who: "sq", from: HOME_MORNING_SPOTS.woke, via: Object.freeze([{ x: 320, y: 562 }, { x: 335, y: 400 }, HOME_MORNING_SPOTS.closet]) }),
  mopsOut: Object.freeze({ who: "mops", from: HOME_MORNING_SPOTS.mopsBed, via: Object.freeze([{ x: 520, y: 440 }, { x: 900, y: 430 }, HOME_MORNING_SPOTS.mopsOut]) }),
});
// Where the room draws him sitting in the crate bed (the bedtime story's SIT).
const BED_SIT = BED_POSES.sit;
// Standing anywhere here counts as "at the wardrobe" (right of it, behind or beside the bed's top corner).
const AT_CLOSET = Object.freeze({ x0: 150, x1: 440, y0: 350, y1: 480 });
// Walking within this many game pixels of where TAKE · lunch works (HOME_MORNING_SPOTS.lunch, its range LUNCH_R) is
// "at the bag": he sees it, and TAKE · lunch works where he stands, from whichever side he came (code review).
const LUNCH_R = 110,
  AT_BAG = LUNCH_R - 10;
const CALENDAR = HOME_THINGS.calendar;
const WARDROBE = HOME_THINGS.closet;
const SPEAKER_BOX = HOME_THINGS.speaker;

/**
 * Timing in seconds and speeds in game pixels a second (placeholders). Each wordless part plays 2 to 4 seconds.
 * night: dark (held, from the bedtime story's black), up (back to light). pa: the ding-dong, then the speaker's line
 * after dingWait. mopsUp: Mops opens his eyes (eyes), rolls onto his side (side), gets up (stand), looks at Squatch
 * with a heart (look), all within mopsUp; mopsWalk: his walking speed out. wake: sitUp (from lying asleep to sitting,
 * the blanket sliding off), stretch (arms up), hop (out over the crate's side), then a walk to beside the rocket.
 * hold: he holds the gift up; the crayon thought bubble comes up at thought (fading in over thinkIn). notes: a music
 * note leaves the speaker every notesEvery seconds and lives noteLife.
 */
export const HOME_MORNING_PACE = Object.freeze({
  dark: 1.4,
  up: 1.2,
  dingWait: 0.7,
  mopsUp: 2.6,
  eyes: 0.25,
  side: Object.freeze([0.3, 0.9]),
  stand: Object.freeze([1.1, 1.6]),
  look: 1.75,
  mopsWalk: 190,
  sitUp: 0.9,
  stretch: 0.8,
  hop: 0.55,
  walk: 160,
  hold: 2.8,
  thought: 0.5,
  think: 2.2,
  thinkIn: 0.25,
  toCloset: 220,
  boxOut: 0.5,
  shut: 0.5,
  notesEvery: 1.1,
  noteLife: 2.6,
});
// His arms (the angle from straight down, squatch-art.js): both up to stretch; holding the gift up high.
const STRETCH = [{ a: -2.75 }, { a: 2.75 }],
  HOLD_UP = [{ a: -2.45 }, { a: 2.95 }];
const HM_NOTE_COLORS = ["#3478f6", "#e5533d", "#2bb673"];

export function createHomeMorning(bridge) {
  const E = () => bridge.engine();
  const sound = createHomeMorningSound(() => bridge.engine(), bridge.morningSound);
  const H = () => {
    const e = E();
    return e ? e.get("ch1HomeMorning") : null;
  };
  let drew = null,
    boxDrawn = null,
    closetDrawn = null,
    ff = {},
    mff = {},
    pads = 0,
    hooves = 0,
    record = { steps: [], heart: 0, walks: [] };
  const live = () => {
    const h = H(),
      e = E();
    return h && e && e.get("ch1Day2") && h.step !== "done" ? h : null;
  };
  // A new step: its name and a fresh clock.
  const go = (step, extra) => {
    Object.assign(H(), { step, t: 0, phase: "" }, extra || {});
    record.steps.push(step);
  };
  // The player has Squatch: the chip for this step comes up. Only these steps set ch1Step ("hm-<step>"), so the step
  // restart (↺, 20-ch2.js) saves each of them, and ↺ in a part between them (the line, the close-up, the calendar)
  // goes back to the last one, with what was true then (code review, 2026-11-26).
  const control = (chip) => {
    const e = E();
    e.set("ch1Step", "hm-" + H().step);
    e.set("sqPose", "stand");
    e.set("ch1Chip", morningWords(chip));
    e.set("ctrl", true);
    e.chipNow();
  };
  const busy = () => {
    const e = E();
    e.set("ctrl", false);
    e.set("act", null);
    e.set("ch1Chip", "");
    e.still("sq");
    e.chipNow();
  };
  // Walks `who` along a walk of HOME_MORNING_WALKS, leg by leg (h.leg); true once at its last corner. Each position is
  // kept for the tests (record.walks).
  const walkAlong = (name, speed, dt) => {
    const e = E(),
      h = H(),
      W = HOME_MORNING_WALKS[name],
      to = W.via[h.leg || 0];
    const done = e.step(W.who, to.x, to.y, speed, dt || 0);
    const p = e.pos(W.who);
    record.walks.push({ walk: name, x: Math.round(p.x), y: Math.round(p.y) });
    record.walks.length > 4000 && record.walks.shift();
    if (!done) return false;
    h.leg = (h.leg || 0) + 1;
    if (h.leg < W.via.length) return false;
    e.still(W.who);
    return true;
  };

  /**
   * Day 2 begins (14-ch1-day2.js ch1Day2Begin). From the bedtime story, the night-to-morning, the PA, Mops leaving and
   * the wake play first; with `awake` (the ?beat=day2 test link, a jump) Squatch is already up beside the rocket with
   * the goal, and Mops has gone.
   */
  function start({ awake = false } = {}) {
    const e = E();
    ff = {};
    mff = {};
    e.set("ch1HomeMorning", { step: "", t: 0, phase: "", gift: "floor", bag: "floor", boxOut: false, door: false, heart: -1, leg: 0, mo: null, music: false });
    e.set("wardrobe", "closed");
    e.set("ctrl", false);
    e.set("ch1Chip", "");
    e.set("sqLift", 0);
    if (awake) {
      e.set("moPose", "hidden");
      H().music = true;
      H().musicAt = e.time();
      e.place("sq", HOME_MORNING_SPOTS.woke.x, HOME_MORNING_SPOTS.woke.y);
      e.face("sq", 1);
      go("rocket");
      return control("chip-gift");
    }
    // Asleep in bed under the blanket, in the dark, as the bedtime story left him; Mops asleep on his back by the bed
    // (this file draws him: the room leaves him out).
    e.set("sqPose", "lie");
    e.place("sq", HOME_MORNING_SPOTS.bed.x, HOME_MORNING_SPOTS.bed.y);
    e.set("moPose", "hidden");
    e.place("mops", MOPS_ASLEEP.x, MOPS_ASLEEP.floor);
    e.face("mops", MOPS_ASLEEP.f);
    H().mo = { turn: MOPS_ASLEEP.turn, eyes: "closed", headDrop: MOPS_ASLEEP.headDrop, jitter: 0 };
    go("night");
    e.queue([
      e.until(night),
      e.run(() => (go("pa"), sound.morning("dingDong"))),
      e.until((dt) => (H().t += dt || 0) >= HOME_MORNING_PACE.dingWait),
      e.say("speaker", morningWords("pa-morning")),
      // the PA is over: the music comes from the speaker, and Mops wakes
      e.run(() => (H().music = true, H().musicAt = e.time(), go("mopsUp"))),
      e.until(mopsUp),
      e.until(mopsOut),
      e.until(wake),
      e.run(() => (go("rocket"), control("chip-gift"))),
    ]);
  }
  // Night to morning: still dark, then light again. The music is the music table's (music-picks.js, Brian 2026-11-26):
  // the bedtime music goes on while it is dark (musicCue "bedtime"), it is quiet as the room comes up and while the
  // speaker talks, then the speaker plays "Morning" (the "day2am" row).
  function night(dt) {
    const h = H(),
      P = HOME_MORNING_PACE;
    h.t += dt || 0;
    return h.t >= P.dark + P.up;
  }
  // Mops wakes and gets up (this file draws him: the room's drawing, turned), looks at Squatch (a heart), then stands
  // as the room draws him.
  function mopsUp(dt) {
    const e = E(),
      h = H(),
      P = HOME_MORNING_PACE,
      t = (h.t += dt || 0),
      k = (a, b) => {
        const q = Math.max(0, Math.min(1, (t - a) / (b - a)));
        return q * q * (3 - 2 * q);
      };
    const m = h.mo;
    m.eyes = t >= P.eyes ? "" : "closed";
    // on his back (1), onto his side (0.5), up on his feet (0)
    m.turn = 1 - 0.5 * k(P.side[0], P.side[1]) - 0.5 * k(P.stand[0], P.stand[1]);
    m.headDrop = MOPS_ASLEEP.headDrop * (1 - k(P.side[0], P.stand[1]));
    m.jitter = t > P.stand[1] && t < P.stand[1] + 0.15 ? Math.sin(t * 70) * 1.4 : 0;
    // up: he looks at Squatch asleep, and a heart floats up from him (whenever Mops sees Squatch: Brian 2026-11-26, #48)
    if (t >= P.look && h.mopsHeart == null) ((h.mopsHeart = e.time()), record.heart++);
    if (t < P.mopsUp) return false;
    // from here the room draws him, walking out
    h.mo = null;
    e.set("moPose", "stand");
    e.face("mops", 1);
    h.leg = 0;
    go("mopsOut");
    return true;
  }
  function mopsOut(dt) {
    const e = E(),
      h = H();
    h.t += dt || 0;
    e.moWalking && e.moWalking(true);
    const done = walkAlong("mopsOut", HOME_MORNING_PACE.mopsWalk, dt);
    const p = e.pos("mops");
    footfall(mff, p.x, p.y, dt || 0, 0.3) && sound.morning("hoof", hooves++);
    if (!done) return false;
    e.moWalking && e.moWalking(false);
    e.set("moPose", "hidden");
    e.place("mops", -400, p.y);
    sound.morning("door");
    go("wake");
    return true;
  }
  // He wakes: sits up in the crate, a big stretch, hops out over its side and walks round its foot to the rocket.
  function wake(dt) {
    const e = E(),
      h = H(),
      P = HOME_MORNING_PACE;
    h.t += dt || 0;
    const t = h.t;
    if (h.phase === "") ((h.phase = "sitUp"), e.set("sqPose", "lie"));
    if (h.phase === "sitUp") {
      if (t >= P.sitUp) h.phase = "stretch";
    } else if (h.phase === "stretch") {
      if (t >= P.sitUp + P.stretch) h.phase = "hop";
    } else if (h.phase === "hop") {
      if (t >= P.sitUp + P.stretch + P.hop) {
        h.phase = "out";
        h.leg = 0;
        e.set("sqPose", "stand");
        e.place("sq", HOME_MORNING_SPOTS.side.x, HOME_MORNING_SPOTS.side.y);
        e.face("sq", 1);
      }
    } else if (h.phase === "out") {
      if (walkAlong("getUp", P.walk, dt)) {
        e.face("sq", 1);
        return true;
      }
    }
    return false;
  }

  // ---------- the player's actions ----------
  function pickUp() {
    const e = E();
    busy();
    sound.effect("grab");
    // the note tied to it, read first (a close-up, NEXT), then he holds the gift up
    go("note", { gift: "held" });
    e.face("sq", 1);
    e.queue([
      ...cutawaySteps(NOTE_ID),
      e.run(() => {
        go("hold", { heart: e.time() });
        record.heart++;
        e.set("sqPose", "lie"); // this file draws him holding it up
      }),
      e.until((dt) => (H().t += dt || 0) >= HOME_MORNING_PACE.hold),
      e.say("sq", morningWords("sq-guardians")),
      e.run(() => {
        H().heart = -1;
        e.set("sqPose", "stand");
        e.face("sq", -1);
        go("think", { thinkAt: e.time() });
      }),
      e.until((dt) => (H().t += dt || 0) >= HOME_MORNING_PACE.think),
      e.run(() => (go("closet"), control("chip-box"))),
    ]);
  }
  function openCloset() {
    busy();
    go("toCloset", { leg: 0 });
  }
  function putIn() {
    const e = E();
    busy();
    e.face("sq", -1);
    go("lift");
    e.queue([
      e.until((dt) => (H().t += dt || 0) >= HOME_MORNING_PACE.boxOut),
      e.run(() => {
        H().boxOut = true;
        H().closeUpAt = 0;
        H().thunked = false;
        go("closeup");
      }),
      ...cutawaySteps(GBOX_ID),
      // the box, the gift in it, goes back in the closet (Brian, 2026-11-26), and he shuts the door
      e.run(() => {
        H().gift = "box";
        go("putBack");
      }),
      e.until((dt) => (H().t += dt || 0) >= HOME_MORNING_PACE.boxOut),
      e.run(() => {
        H().boxOut = false;
        go("shut");
      }),
      e.until((dt) => (H().t += dt || 0) >= HOME_MORNING_PACE.shut),
      e.run(() => {
        H().door = false;
        e.set("wardrobe", "closed");
        sound.morning("closetShut");
        // the lunch bag by the door glows: he walks over to it and sees it (Brian 2026-11-26, video note 0:30)
        go("toBag");
        control("chip-bag");
      }),
    ]);
  }
  // At the bag: he sees it is Mops's lunch, his line, then the goal.
  function seeBag() {
    const e = E();
    busy();
    e.face("sq", 1);
    go("notice");
    e.queue([e.say("sq", morningWords("sq-lunch")), e.run(() => (go("lunch"), control("chip-lunch")))]);
  }
  // LOOK · calendar, any time on the lunch step (Brian, 2026-11-26: the calendar is optional): today's close-up, then
  // back to the lunch goal.
  function lookCalendar() {
    const e = E();
    H().calSeen = true;
    busy();
    go("calendar");
    e.openCalendar(() => (go("lunch"), control("chip-lunch")));
  }
  function takeLunch() {
    const e = E(),
      h = H();
    busy();
    h.bag = "taken";
    go("done");
    e.takeLunch();
  }

  // ---------- spots ----------
  const words = (id) => morningWords(id).split(" · ");
  const avoid = Object.values(HOME_THINGS);
  function spot(id, wordsId, place, thing, f) {
    const [verb, cap] = words(wordsId);
    return { id, verb, cap, who: "sq", ...place, at: [(thing.x0 + thing.x1) / 2, thing.y0], thing, avoid, f };
  }
  const rocketBox = () => TRACE.rocket;
  const bagBox = () => {
    const b = MORNING_THINGS.bag,
      s = MORNING_SIZES.bag;
    return { x0: b.x - s.w / 2, x1: b.x + s.w / 2, y0: b.y - s.h, y1: b.y };
  };
  const atCloset = { x: HOME_MORNING_SPOTS.closet.x, y: HOME_MORNING_SPOTS.closet.y, box: AT_CLOSET };

  // Squatch's box on screen now (for keeping outlines off him).
  const sqBox = () => {
    const p = E().pos("sq"),
      k = (E().squatchScale && E().squatchScale()) || 3;
    return { x0: p.x - 18 * k, x1: p.x + 18 * k, y0: p.y - 50 * k, y1: p.y + 2 * k };
  };

  // ---------- drawing ----------
  // One red heart (a drawn shape, not a letter), its middle at (x, y).
  function heart(ctx, x, y, r) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(0, r * 0.9);
    ctx.bezierCurveTo(-r * 1.4, -r * 0.1, -r * 0.7, -r * 1.2, 0, -r * 0.45);
    ctx.bezierCurveTo(r * 0.7, -r * 1.2, r * 1.4, -r * 0.1, 0, r * 0.9);
    ctx.closePath();
    ctx.fillStyle = "#e5533d";
    ctx.fill();
    ctx.strokeStyle = "#1e2430";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  }
  // Where his near paw is while the room draws him standing (his arms at rest), for what he carries.
  const pawNow = () => {
    const p = E().pos("sq"),
      k = (E().squatchScale && E().squatchScale()) || 3,
      hand = armEnds()[1].hand,
      f = p.f || 1;
    return { x: p.x + f * hand.x * k, y: p.y + hand.y * k };
  };
  const floorThings = (h) => {
    const out = [];
    h.gift === "floor" && out.push({ id: "rocket", y: MORNING_THINGS.rocket.y, draw: (ctx) => drawRocket(ctx, MORNING_THINGS.rocket.x, MORNING_THINGS.rocket.y) });
    h.bag === "floor" && out.push({ id: "bag", y: MORNING_THINGS.bag.y, draw: (ctx) => drawLunchBag(ctx, MORNING_THINGS.bag.x, MORNING_THINGS.bag.y) });
    return out;
  };
  // A soft pulsing glow behind a thing while it is the goal (well bigger than it, so it shows on a phone).
  function glow(ctx, box) {
    const cx = (box.x0 + box.x1) / 2,
      cy = (box.y0 + box.y1) / 2,
      rad = Math.max(box.x1 - box.x0, box.y1 - box.y0) * 0.95,
      a = 0.5 + 0.25 * Math.sin(E().time() * 4),
      g = ctx.createRadialGradient(cx, cy, 4, cx, cy, rad);
    g.addColorStop(0, `rgba(255,214,80,${a})`);
    g.addColorStop(0.55, `rgba(255,224,110,${a * 0.55})`);
    g.addColorStop(1, "rgba(255,224,110,0)");
    ctx.fillStyle = g;
    ctx.fillRect(cx - rad, cy - rad, rad * 2, rad * 2);
  }
  // Where the box is now: in the closet, on its way out or back in, or out on the floor.
  function boxPlace(h) {
    const a = MORNING_THINGS.boxIn,
      b = MORNING_THINGS.boxOut;
    if (h.step === "lift" || h.step === "putBack") {
      const back = h.step === "putBack",
        k0 = Math.min(1, h.t / HOME_MORNING_PACE.boxOut),
        k = back ? 1 - k0 : k0,
        ease = k * k * (3 - 2 * k),
        up = Math.sin(k * Math.PI) * 30;
      const x0 = a.x0 + (b.x0 - a.x0) * ease,
        y0 = a.y0 + (b.y0 - a.y0) * ease - up;
      return { x0, y0, x1: x0 + (a.x1 - a.x0), y1: y0 + (a.y1 - a.y0) };
    }
    return h.boxOut ? b : a;
  }

  return {
    /**
     * The music for the home morning (bridge.js refineCue), or null when it has no say: "bedtime" while the night is
     * still dark (the bedtime music goes on), "" (quiet) as the room comes up and while the speaker talks, then
     * "day2am" (music-picks.js: Kevin MacLeod's "Morning", from the speaker) until he takes the lunch.
     */
    musicCue() {
      const h = live();
      if (!h) return null;
      if (h.step === "night" && h.t < HOME_MORNING_PACE.dark) return "bedtime";
      return h.music ? "day2am" : "";
    },
    /** True while the night is still dark (tests; the music: musicCue). */
    nightNow() {
      const h = live();
      return !!h && h.step === "night" && h.t < HOME_MORNING_PACE.dark;
    },
    start,
    /**
     * ↺ while the morning plays with no control yet (the night, the PA, Mops getting up and leaving, the wake): no
     * step start is saved then, so the morning starts again from Squatch and Mops asleep. True when it did (20-ch2.js
     * reSec).
     */
    restart() {
      const h = live();
      if (!h || !["night", "pa", "mopsUp", "mopsOut", "wake"].includes(h.step)) return false;
      const e = E();
      e.moWalking && e.moWalking(false);
      start();
      return true;
    },
    /**
     * A test jump (ch1JumpBeat 23, tests): straight to one of the player's steps ("rocket", "closet", "box",
     * "toBag", "lunch"), with everything before it done (the gift held, then in the box back in the closet). "cal"
     * (beat 23, the calendar) is the lunch step with him standing by the wardrobe, where LOOK · calendar is offered.
     */
    jump(asked) {
      const e = E(),
        h = H(),
        step = asked === "cal" ? "lunch" : asked,
        order = ["rocket", "closet", "box", "toBag", "lunch"];
      const at = { rocket: "woke", closet: "woke", box: "closet", toBag: "closet", lunch: asked === "cal" ? "closet" : "lunch" }[step];
      if (!h || !at) return;
      const before = (s) => order.indexOf(step) > order.indexOf(s);
      Object.assign(h, { gift: before("box") ? "box" : before("rocket") ? "held" : "floor", boxOut: false, door: step === "box", heart: -1, mo: null, music: true, musicAt: e.time(), leg: 0 });
      e.set("wardrobe", step === "box" ? "open" : "closed");
      e.set("moPose", "hidden");
      e.place("sq", HOME_MORNING_SPOTS[at].x, HOME_MORNING_SPOTS[at].y);
      e.face("sq", at === "closet" ? -1 : 1);
      go(step);
      control({ rocket: "chip-gift", closet: "chip-box", box: "chip-box", toBag: "chip-bag", lunch: "chip-lunch" }[step]);
    },
    /** True from Day 2's start until he takes the lunch. */
    active() {
      return !!live();
    },
    /**
     * True while the Guardian Box is in the closet on Day 2 (60-frame-draw.js gboxOut): all of Day 2 except the moment
     * he has it out on the floor to put the gift in.
     */
    boxInCloset() {
      const h = live();
      return !(h && (h.boxOut || h.step === "lift"));
    },
    /**
     * The spots for the step the player is on: one at a time, its thing outlined (goal-targets.js "closet:hm-...").
     * On the way to the bag there is no button: a place to walk to (with no verb), and seeing the bag there is the next
     * step (tick).
     */
    spots() {
      const h = live(),
        e = E();
      if (!h || !e.get("ctrl")) return [];
      if (h.step === "rocket") return [spot("hm-rocket", "button-rocket", { ...MORNING_THINGS.rocket, r: 140 }, rocketBox(), pickUp)];
      if (h.step === "closet") return [spot("hm-closet", "button-closet", atCloset, WARDROBE, openCloset)];
      if (h.step === "box") return [spot("hm-box", "button-box", atCloset, MORNING_THINGS.boxIn, putIn)];
      // on the way to the bag: a place to walk to, no button (standing there is the action: he sees the bag, tick)
      if (h.step === "toBag") return [{ id: "bag", who: "sq", x: HOME_MORNING_SPOTS.lunch.x, y: HOME_MORNING_SPOTS.lunch.y, r: AT_BAG, thing: bagBox(), avoid }];
      // the lunch bag is the goal (listed first: the only thing outlined); the calendar is there to look at too, offered
      // on the button by the wardrobe until he has looked once (so a kid pressing the button is not sent back to it
      // again and again), and opened any time by a tap on it (tap below)
      if (h.step === "lunch") {
        const lunch = spot("hm-lunch", "button-lunch", { x: HOME_MORNING_SPOTS.lunch.x, y: HOME_MORNING_SPOTS.lunch.y, r: LUNCH_R }, bagBox(), takeLunch);
        return h.calSeen ? [lunch] : [lunch, spot("hm-calendar", "button-cal", atCloset, CALENDAR, lookCalendar)];
      }
      return [];
    },
    /**
     * A tap on the picture (game positions): a tap on the thing the goal outlines does its action, as the button
     * would, when the button is offered there now (a kid taps the glowing calendar). True when it was used.
     */
    tap(x, y) {
      const e = E(),
        o = e.offer && e.offer(),
        h = live();
      // on the lunch goal a tap on the calendar itself always opens it (it is there to look at)
      const near = (t) => x >= t.x0 - 24 && x <= t.x1 + 24 && y >= t.y0 - 24 && y <= t.y1 + 24;
      if (h && h.step === "lunch" && e.get("ctrl") && near(CALENDAR)) return (lookCalendar(), true);
      if (!h || !o || !o.spot || !o.spot.thing) return false;
      const t = o.spot.thing;
      if (x < t.x0 - 24 || x > t.x1 + 24 || y < t.y0 - 24 || y > t.y1 + 24) return false; // a finger is not exact
      o.spot.f();
      return true;
    },
    /** Every frame: the walks, the closet door, arriving at the bag, his footsteps, the close-up's thunk. */
    tick(dt) {
      const h = live(),
        e = E();
      if (!h || e.room() !== "closet") return;
      dt = dt || 0;
      // The closet door is open from OPEN · closet until he shuts it.
      const door = h.door ? "open" : "closed";
      e.get("wardrobe") !== door && e.set("wardrobe", door);
      if (h.step === "toCloset") {
        h.t += dt;
        if (walkAlong("toCloset", HOME_MORNING_PACE.toCloset, dt)) {
          e.face("sq", -1);
          h.door = true;
          e.set("wardrobe", "open");
          sound.morning("closetOpen");
          go("box");
          control("chip-box");
        }
      }
      // On the way to the bag (the player walks him: the stick, the keys, or a tap, which goes round furniture:
      // tap-path.js): once he is beside it, he sees it.
      if (h.step === "toBag" && e.get("ctrl")) {
        const p = e.pos("sq"),
          b = HOME_MORNING_SPOTS.lunch;
        if (Math.hypot(p.x - b.x, p.y - b.y) <= AT_BAG) seeBag();
      }
      // the gift lands in the box in the close-up: the box's thunk
      const c = e.current();
      if (h.step === "closeup" && c && c.k === "cutaway" && c.id === GBOX_ID && !h.thunked && (c.el || 0) >= BOX_CLOSEUP.hold + BOX_CLOSEUP.fall) {
        h.thunked = true;
        sound.effect("hide");
      }
      // his footsteps, only while his feet move
      const p = e.pos("sq");
      if (e.get("sqPose") === "stand" && footfall(ff, p.x, p.y, dt, HOME_MORNING_SOUND.padEvery)) sound.pad(pads++);
    },
    /**
     * The Guardian Box on Day 2: in the closet (seen only with the door open), out on the floor by the closet while he
     * puts the gift in, then back in the closet with the gift in it (Brian, 2026-11-26). Also drawn again over Squatch
     * when he stands behind it (60-frame-draw.js).
     */
    drawBox(ctx) {
      const e = E();
      boxDrawn = null;
      if (!e || e.room() !== "closet" || !e.get("ch1Day2")) return;
      const h = H(),
        on = live();
      const gift = !on || h.gift === "box";
      if (on && (h.boxOut || h.step === "lift" || h.step === "putBack")) {
        const b = boxPlace(h);
        gift ? drawBoxWithGift(ctx, b) : drawGuardianBox(ctx, b.x0, b.y0);
        boxDrawn = { where: h.step === "lift" || h.step === "putBack" ? "moving" : "floor", x0: Math.round(b.x0), y0: Math.round(b.y0), gift };
      } else if (e.get("wardrobe") === "open") {
        // in the closet (seen only with the door open), on its floor under the clothes: before the gift, and back in
        // with it after
        gift ? drawBoxWithGift(ctx, MORNING_THINGS.boxIn) : drawGuardianBox(ctx, MORNING_THINGS.boxIn.x0, MORNING_THINGS.boxIn.y0);
        boxDrawn = { where: "closet", gift };
      }
    },
    /** Drawn on the room picture under the people: the taller closet, the box, and things on the floor behind Squatch. */
    drawOnRoom(ctx) {
      const e = E();
      // Day 2 at home: the closet is taller (tall-closet.js), open or shut
      closetDrawn = e && e.room() === "closet" && e.get("ch1Day2") ? drawTallCloset(ctx, e.get("wardrobe") === "open") : null;
      this.drawBox(ctx);
      const h = H(),
        on = live();
      if (!on || e.room() !== "closet") return;
      const sy = e.pos("sq").y;
      on.step === "rocket" && e.get("ctrl") && glow(ctx, TRACE.rocket);
      (on.step === "toBag" || on.step === "notice" || on.step === "lunch") && glow(ctx, TRACE.bag);
      for (const t of floorThings(h)) t.y <= sy && t.draw(ctx);
    },
    /** Drawn over the room after the people: things in front of him, his poses, what he carries, the dark. */
    draw(ctx) {
      drew = null;
      const h = live(),
        e = E();
      if (!h || e.room() !== "closet") return;
      const P = HOME_MORNING_PACE,
        k = (e.squatchScale && e.squatchScale()) || 3,
        p = e.pos("sq");
      drew = { step: h.step, things: [] };
      for (const t of floorThings(h)) {
        t.y > p.y && t.draw(ctx);
        drew.things.push(t.id);
      }
      // Mops asleep on his back by the bed, then getting up (the room's drawing of him, turned: mops-asleep-art.js),
      // and the heart that floats up from him as he looks at Squatch asleep
      if (h.mo) {
        const m = E().pos("mops");
        drew.mops = { ...drawMopsTurned(ctx, e, { x: m.x, floor: m.y, scale: k, f: MOPS_ASLEEP.f, turn: h.mo.turn, eyes: h.mo.eyes, headDrop: h.mo.headDrop, jitter: h.mo.jitter }), eyes: h.mo.eyes };
      }
      if (h.mopsHeart != null && e.time() - h.mopsHeart < 1.6 && (h.step === "mopsUp" || h.step === "mopsOut")) {
        const m = E().pos("mops"),
          age = e.time() - h.mopsHeart;
        heart(ctx, m.x - 10, m.y - 44 * k - Math.min(1, age / 0.8) * 30, 14);
        drew.mopsHeart = { x: Math.round(m.x - 10), age: +age.toFixed(2) };
      }
      // Squatch as this file draws him: asleep under the blanket in the crate bed until Mops has gone, sitting up as he
      // wakes (the blanket sliding off), stretching in bed, hopping out over the crate's side, or holding the gift up
      // high (with one heart and the crayon thought bubble). In the bed, the crate's front wall is drawn over him.
      const asleep = ["night", "pa", "mopsUp", "mopsOut"].includes(h.step);
      if (e.get("sqPose") === "lie" && (asleep || (h.step === "wake" && h.phase === "sitUp"))) {
        const L = BED_POSES.lie,
          S0 = BED_POSES.sit,
          up = asleep ? 0 : Math.max(0, Math.min(1, h.t / (P.sitUp * 0.8))),
          q = up * up * (3 - 2 * up),
          pose = { x: L.x + (S0.x - L.x) * q, y: L.y + (S0.y - L.y) * q, a: L.a * (1 - q), arms: null, feet: false, eyes: asleep ? "closed" : "", yawn: 0 };
        drawBedtimeSquatch(ctx, pose, k);
        const b = drawBedBlanket(ctx, 1 - q);
        drew.crateFront = drawCrateFront(ctx);
        drew.pose = asleep ? "asleep" : "sitUp";
        drew.inBed = { x: Math.round(pose.x), y: Math.round(pose.y), a: +pose.a.toFixed(2), eyes: pose.eyes, blanket: b ? b.cover : 0 };
      }
      if (e.get("sqPose") === "lie" && h.step === "wake" && h.phase === "stretch") {
        drawSquatchArt(ctx, BED_SIT.x, BED_SIT.y, k, { line: 2 * k, arms: STRETCH, feet: false, shadow: false });
        drew.crateFront = drawCrateFront(ctx);
        drew.pose = "stretch";
      }
      if (e.get("sqPose") === "lie" && h.step === "wake" && h.phase === "hop") {
        // out over the crate's right side, as he climbed in at bedtime (backwards): a little hop up and over
        const kk = Math.max(0, Math.min(1, (h.t - P.sitUp - P.stretch) / P.hop)),
          q = kk * kk * (3 - 2 * kk),
          to = HOME_MORNING_SPOTS.side,
          pose = { x: BED_SIT.x + (to.x - BED_SIT.x) * q, y: BED_SIT.y + (to.y - BED_SIT.y) * q - Math.sin(kk * Math.PI) * 34, a: 0, arms: [{ a: -0.35 }, { a: 0.35 }], feet: kk > 0.5, eyes: "", yawn: 0 };
        drawBedtimeSquatch(ctx, pose, k);
        pose.x < CRATE_FRONT.x1 + 10 && (drew.crateFront = drawCrateFront(ctx));
        drew.pose = "hopOut";
        drew.hop = { x: Math.round(pose.x), y: Math.round(pose.y) };
      }
      if (e.get("sqPose") === "lie" && h.step === "hold") {
        drawSquatchArt(ctx, p.x, p.y, k, { line: 2 * k, arms: HOLD_UP });
        const hand = armEnds(HOLD_UP)[1].hand;
        const at = { x: p.x + hand.x * k, y: p.y + hand.y * k };
        const r = drawRocket(ctx, at.x, at.y + 4, {});
        drew.pose = "holdUp";
        drew.heldUp = { rocket: r, paw: at, head: p.y - 48.5 * k };
      }
      // carried at his side while he walks to the wardrobe and opens it
      if (h.gift === "held" && e.get("sqPose") === "stand") {
        const at = pawNow();
        drew.carried = drawRocket(ctx, at.x, at.y + 16, {});
      }
      // (gone once he speaks: one bubble at a time)
      const now = e.current();
      if (h.step === "hold" && h.t >= P.thought && !(now && now.k === "bub")) {
        const head = { x: p.x, y: p.y - 48.5 * k },
          th = drawCrayonThought(ctx, head, Math.min(1, (h.t - P.thought) / P.thinkIn));
        drew.crayonThought = { box: th.box, drawing: th.drawing, content: th.content, oval: th.oval, trail: th.trail, head };
      }
      if (h.heart >= 0) {
        const age = e.time() - h.heart,
          y = p.y - 48.5 * k - 26 - Math.min(1, age / 0.8) * 30;
        // (beside his head while the crayon thought bubble is up over it)
        heart(ctx, p.x - (h.step === "hold" && h.t >= P.thought ? 70 : 0), y, 15);
        drew.heart = { x: p.x, y };
      }
      if (h.step === "think") {
        const head = { x: p.x, y: p.y - 48.5 * k };
        const th = drawBoxThought(ctx, head, Math.min(1, (e.time() - (h.thinkAt || 0)) / P.thinkIn));
        drew.thought = { box: th.box, content: th.content, oval: th.oval, trail: th.trail, head };
      }
      // the lunch bag is outlined while he walks to it and while he says it (no action yet, so the goal outline is
      // not drawn by the room)
      // (through the room's goal mark, so the goal words wait while it shows, then come up after 20 s: words if stuck)
      if (h.step === "toBag" && e.get("ctrl") && e.markGoal) {
        const [verb, cap] = words("button-lunch");
        e.markGoal({ id: "hm-lunch", verb, cap, x: MORNING_THINGS.bag.x, y: MORNING_THINGS.bag.y, r: AT_BAG });
        drew.bagOutline = TRACE.bag;
      }
      if (h.step === "notice") {
        const c = e.current();
        c && c.k === "bub" && (drew.bagOutline = bridge.drawGoalOutline(ctx, "closet", "hm-lunch", null, e.time(), [sqBox()]));
      }
      // the wall speaker: sound lines round it while it rings and talks, then music notes rising from it while it plays
      const sp = SPEAKER_BOX,
        scx = (sp.x0 + sp.x1) / 2,
        scy = (sp.y0 + sp.y1) / 2,
        talking = h.step === "pa" && (!now || now.k !== "bub" || now.who === "speaker");
      if (talking) {
        ctx.save();
        ctx.lineWidth = 3.5;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#1e2430";
        for (let i = 0; i < 3; i++) {
          const r = 30 + i * 10 + 3 * Math.sin(e.time() * 8 - i);
          ctx.globalAlpha = 0.9 - i * 0.22;
          ctx.beginPath();
          ctx.arc(scx, scy, r, Math.PI * 0.78, Math.PI * 1.22);
          ctx.stroke();
          // on the right only the smallest arc: the room's right wall is close
          i === 0 && (ctx.beginPath(), ctx.arc(scx, scy, 24 + 2 * Math.sin(e.time() * 8), -Math.PI * 0.22, Math.PI * 0.22), ctx.stroke());
        }
        ctx.restore();
        drew.speakerLines = true;
      }
      if (h.music && h.musicAt != null) {
        const since = e.time() - h.musicAt;
        let shown = 0;
        for (let i = Math.max(0, Math.floor((since - P.noteLife) / P.notesEvery)); i * P.notesEvery <= since; i++) {
          const age = since - i * P.notesEvery;
          if (age < 0 || age > P.noteLife) continue;
          ctx.save();
          ctx.globalAlpha = Math.min(1, age * 4) * (1 - age / P.noteLife);
          e.text(i % 2 ? "\u266b" : "\u266a", sp.x0 - 6 - age * 46, scy - age * 40 + Math.sin(age * 5 + i) * 8, 28, HM_NOTE_COLORS[i % HM_NOTE_COLORS.length], "center", 900);
          ctx.restore();
          shown++;
        }
        drew.speakerNotes = shown;
      }
      if (h.step === "night") {
        // dark as the bedtime story's fade left it, then the room comes up
        const t = h.t,
          a = t < P.dark ? 1 : Math.max(0, 1 - (t - P.dark) / P.up);
        ctx.fillStyle = `rgba(0,0,0,${a.toFixed(3)})`;
        ctx.fillRect(-2000, -2000, 6000, 5000);
        drew.dark = a;
      }
    },
    /** Over the calendar close-up (15-ch1-scene1.js drawCh1Calendar): today's marks, on Day 2's look only. */
    drawCalendar(ctx, zoom) {
      const h = live();
      if (!h || h.step !== "calendar") return null;
      return (drew = { step: h.step, calendar: drawCalendarToday(ctx, zoom, E().time()) });
    },
    /** The lunch bag in his paw (the older program draws it while he carries it to Mops: 14-ch1-day2.js). */
    drawHeldBag(ctx, x, y) {
      drawLunchBag(ctx, x, y);
    },
    /** Tests: the step, what the last frame drew, and what was heard. */
    debug() {
      const h = H();
      return { state: h ? { ...h, mo: h.mo ? { ...h.mo } : null } : null, active: !!live(), drew, box: boxDrawn, closet: closetDrawn, steps: record.steps.slice(), walks: record.walks.slice(), hearts: record.heart, sounds: sound.asked(), sizes: MORNING_SIZES, things: MORNING_THINGS, spots: HOME_MORNING_SPOTS };
    },
  };
}
