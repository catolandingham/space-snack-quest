/**
 * The home morning, Chapter 1 beats 22 to 24 (docs/CH1-STORY-WALKTHROUGH.md): a gift from the Guardians, the
 * calendar (delivery day, there to look at), and Mops's forgotten lunch. It follows the bedtime story (beat 21, bedtime-story.js) and
 * hands over to the lunch sneak (lunch-sneak.js, through src/game/14-ch1-day2.js ch1TakeLunch). What the player sees, step by step
 * (plan reviewed 2026-11-26; every word is from home-morning-lines.js, every drawing from home-morning-art.js):
 *   night   wordless: the night the bedtime story ended on goes on: the room is dark, Squatch asleep in bed under the
 *           blanket (as bedtime-story.js left him); Mops's hooves walk away and the door shuts in the dark; the room
 *           comes up and the morning song starts. Mops is gone; the rocket (the note tied on) stands at the foot of
 *           the bed.
 *   wake    wordless: he sits up in bed (the blanket slides off), stretches both arms up, gets up and steps down beside
 *           the rocket.
 *   rocket  "Squatch: pick up the gift"; only the rocket is outlined and glows. PICK UP · rocket.
 *   hold    he holds it up high, one heart, and a thought bubble shows his crayon drawing of the Guardians (who he
 *           thinks they are; the same drawing as at bedtime and in the box), wordless; then "The Guardians came! They
 *           always come when I'm scared." (NEXT)
 *   think   wordless: a thought bubble shows the Guardian Box, so the box is seen before the chip names it.
 *   closet  "Squatch: put the gift in the box"; the wardrobe is outlined. OPEN · closet (he steps to its right).
 *   box     the door is open; the G box on the closet floor is outlined. PUT IN · box.
 *   lift    he takes the box out onto the floor; the close-up (the first build's box view): the open box with the
 *           older notes, its lid labelled MY GARDIAN BOX, his crayon drawing MY GUARDIANS, the gift drops in and the note's
 *           words show: "Brave Sasquatches stay hidden. — The Guardians" (NEXT).
 *   putBack back in the room he puts the box, the gift in it, back in the closet (Brian, 2026-11-26);
 *   shut    and shuts the closet: the calendar on its door is back.
 *   notice  the lunch bag by the door (MOPS on it) is outlined; "He forgot his lunch!" (NEXT)
 *   lunch   "Squatch: take the lunch"; TAKE · lunch hands over to the lunch sneak (lunch-sneak.js; the bag in his paw). The calendar
 *           is not a step (Brian, 2026-11-26: optional): LOOK · calendar, by the wardrobe, opens the older program's
 *           close-up with today's marks (home-morning-art.js drawCalendarToday) and comes back to this step.
 * Its progress lives in the game-state field ch1HomeMorning (and ch1Step, "hm-<step>"), so the step restart (↺)
 * brings back the step the player is on. While he sleeps, wakes, stretches and holds the gift up this file draws
 * Squatch (squatch-art.js, the room's Squatch: same shapes, size and outline; asleep and sitting up as the bedtime
 * story draws him) and the room leaves him out (sqPose "lie").
 */
import { drawSquatchArt, armEnds } from "./squatch-art.js";
import { morningWords } from "./home-morning-lines.js";
import { MORNING_THINGS, MORNING_SIZES, TRACE, drawRocket, drawLunchBag, drawGuardianBox, drawBoxWithGift, drawBoxThought, drawCrayonThought, drawCalendarToday, BOX_CLOSEUP, GBOX_ID } from "./home-morning-art.js";
import { drawBedtimeSquatch, drawBedBlanket, BED_POSES } from "./bedtime-story.js";
import { HOME_THINGS } from "./home-alone.js";
import { cutawaySteps } from "./cutaway.js";
import { footfall } from "./footfalls.js";
import { createHomeMorningSound, HOME_MORNING_SOUND } from "./home-morning-sound.js";

export const HOME_MORNING_ID = "ch1-home-morning";

/**
 * Where Squatch stands (game positions; tests/standing-spots.mjs checks each against the furniture). bed: his feet as
 * the room draws him getting up; woke: beside the rocket, where getting up ends; closet: right of the wardrobe and the
 * bed's corner, facing left, so neither the box nor the calendar is ever under him (Fable's review, 2026-11-26).
 */
export const HOME_MORNING_SPOTS = Object.freeze({
  bed: Object.freeze({ x: 205, y: 470 }),
  woke: Object.freeze({ x: 250, y: 580 }),
  closet: Object.freeze({ x: 300, y: 398 }),
  lunch: Object.freeze({ x: 760, y: 505 }), // left of the bag, so he never stands on it
});
// Where the room draws him sitting on the bed (60-frame-draw.js, sqPose "sit" and "sleep").
const BED_SIT = BED_POSES.sit;
// Standing anywhere here counts as "at the wardrobe" (right of it, behind or beside the bed's top corner).
const AT_CLOSET = Object.freeze({ x0: 150, x1: 440, y0: 350, y1: 480 });
const CALENDAR = HOME_THINGS.calendar;
const WARDROBE = HOME_THINGS.closet;

/**
 * Timing in seconds and speeds in game pixels a second (placeholders). Each wordless part plays 2 to 4 seconds.
 * night: dark (held, from the bedtime story's black), up (back to light); hooves while it is dark, the door after
 * them, the song as it comes up. wake: sitUp (from lying asleep to sitting, the blanket sliding off), stretch (arms
 * up), rise (getting up), then a walk to beside the rocket. hold: he holds the gift up; the crayon thought bubble comes
 * up at thought (fading in over thinkIn).
 */
export const HOME_MORNING_PACE = Object.freeze({
  dark: 1.4,
  up: 1.2,
  hooves: Object.freeze([0.2, 0.45, 0.7]),
  door: 0.95,
  sitUp: 0.9,
  stretch: 0.8,
  rise: 0.45,
  walk: 160,
  hold: 2.8,
  thought: 0.5,
  think: 2.2,
  thinkIn: 0.25,
  toCloset: 220,
  boxOut: 0.5,
  shut: 0.5,
});
// His arms (the angle from straight down, squatch-art.js): both up to stretch; holding the gift up high.
const STRETCH = [{ a: -2.75 }, { a: 2.75 }],
  HOLD_UP = [{ a: -2.45 }, { a: 2.95 }];

export function createHomeMorning(bridge) {
  const E = () => bridge.engine();
  const sound = createHomeMorningSound(() => bridge.engine(), bridge.morningSound);
  const H = () => {
    const e = E();
    return e ? e.get("ch1HomeMorning") : null;
  };
  let drew = null,
    boxDrawn = null,
    ff = {},
    pads = 0,
    record = { steps: [], heart: 0 };
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

  /**
   * Day 2 begins (14-ch1-day2.js ch1Day2Begin). From the bedtime story, the night-to-morning and the wake play first;
   * with `awake` (the ?beat=day2 test link, a jump) Squatch is already up beside the rocket with the goal.
   */
  function start({ awake = false } = {}) {
    const e = E();
    ff = {};
    e.set("ch1HomeMorning", { step: "", t: 0, phase: "", gift: "floor", bag: "floor", boxOut: false, door: false, heart: -1 });
    e.set("wardrobe", "closed");
    e.set("ctrl", false);
    e.set("ch1Chip", "");
    e.set("sqLift", 0);
    if (awake) {
      e.set("moPose", "hidden");
      e.place("sq", HOME_MORNING_SPOTS.woke.x, HOME_MORNING_SPOTS.woke.y);
      e.face("sq", 1);
      bridge.homeMusic.start("home-morning");
      go("rocket");
      return control("chip-gift");
    }
    // Asleep in bed under the blanket, in the dark, as the bedtime story left him; Mops went out at bedtime.
    e.set("sqPose", "lie");
    e.place("sq", HOME_MORNING_SPOTS.bed.x, HOME_MORNING_SPOTS.bed.y);
    e.set("moPose", "hidden");
    e.place("mops", -400, HOME_MORNING_SPOTS.bed.y);
    go("night");
    e.queue([e.until(night), e.until(wake), e.run(() => (go("rocket"), control("chip-gift")))]);
  }
  // Night to morning: still dark, Mops leaves for work (heard, not seen), light again, the morning song.
  function night(dt) {
    const h = H(),
      P = HOME_MORNING_PACE,
      t0 = h.t;
    h.t += dt || 0;
    const past = (at) => t0 < at && h.t >= at;
    P.hooves.forEach((at, i) => past(at) && sound.morning("hoof", i));
    if (past(P.door)) sound.morning("door");
    if (past(P.dark)) bridge.homeMusic.start("home-morning");
    if (h.t < P.dark + P.up) return false;
    go("wake");
    return true;
  }
  // He wakes: head up, a big stretch, up out of bed and down beside the rocket.
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
      if (t >= P.sitUp + P.stretch) ((h.phase = "rise"), e.set("sqPose", "sit"));
    } else if (h.phase === "rise") {
      e.set("sqLift", Math.min(1, (t - P.sitUp - P.stretch) / P.rise));
      if (t >= P.sitUp + P.stretch + P.rise) {
        h.phase = "out";
        e.set("sqLift", 0);
        e.set("sqPose", "stand");
        e.place("sq", HOME_MORNING_SPOTS.bed.x, HOME_MORNING_SPOTS.bed.y);
        e.face("sq", 1);
      }
    } else if (h.phase === "out") {
      const to = HOME_MORNING_SPOTS.woke;
      if (e.step("sq", to.x, to.y, P.walk, dt || 0)) {
        e.still("sq");
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
    go("hold", { gift: "held", heart: e.time() });
    record.heart++;
    e.face("sq", 1);
    e.set("sqPose", "lie"); // this file draws him holding it up
    e.queue([
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
    go("toCloset");
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
        // the lunch bag by the door: his line, then the goal (the calendar stays there to look at, not a step)
        go("notice");
        e.face("sq", 1);
      }),
      e.say("sq", morningWords("sq-lunch")),
      e.run(() => (go("lunch"), control("chip-lunch"))),
    ]);
  }
  // LOOK · calendar, any time on the lunch step (Brian, 2026-11-26: the calendar is optional): today's close-up, then
  // back to the lunch goal.
  function lookCalendar() {
    const e = E();
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
    bridge.homeMusic.stop("home-morning");
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
    start,
    /**
     * ↺ while the morning plays with no control yet (the night, the wake): no step start is saved then, so the
     * morning starts again from Squatch asleep. True when it did (20-ch2.js reSec).
     */
    restart() {
      const h = live();
      if (!h || !["night", "wake"].includes(h.step)) return false;
      start();
      return true;
    },
    /**
     * A test jump (ch1JumpBeat 23, tests): straight to one of the player's steps ("rocket", "closet", "box",
     * "lunch"), with everything before it done (the gift held, then in the box back in the closet). "cal" (beat 23,
     * the calendar) is the lunch step with him standing by the wardrobe, where LOOK · calendar is offered.
     */
    jump(asked) {
      const e = E(),
        h = H(),
        step = asked === "cal" ? "lunch" : asked;
      const at = { rocket: "woke", closet: "woke", box: "closet", lunch: asked === "cal" ? "closet" : "lunch" }[step];
      if (!h || !at) return;
      const before = (s) => ["rocket", "closet", "box", "lunch"].indexOf(step) > ["rocket", "closet", "box", "lunch"].indexOf(s);
      Object.assign(h, { gift: before("box") ? "box" : before("rocket") ? "held" : "floor", boxOut: false, door: step === "box", heart: -1 });
      e.set("wardrobe", step === "box" ? "open" : "closed");
      e.set("moPose", "hidden");
      e.place("sq", HOME_MORNING_SPOTS[at].x, HOME_MORNING_SPOTS[at].y);
      e.face("sq", at === "closet" ? -1 : 1);
      go(step);
      control({ rocket: "chip-gift", closet: "chip-box", box: "chip-box", lunch: "chip-lunch" }[step]);
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
    /** The spots for the step the player is on: one at a time, its thing outlined (goal-targets.js "closet:hm-..."). */
    spots() {
      const h = live(),
        e = E();
      if (!h || !e.get("ctrl")) return [];
      if (h.step === "rocket") return [spot("hm-rocket", "button-rocket", { ...MORNING_THINGS.rocket, r: 140 }, rocketBox(), pickUp)];
      if (h.step === "closet") return [spot("hm-closet", "button-closet", atCloset, WARDROBE, openCloset)];
      if (h.step === "box") return [spot("hm-box", "button-box", atCloset, MORNING_THINGS.boxIn, putIn)];
      // the lunch bag is the goal (listed first: the only thing outlined); the calendar is there to look at too
      if (h.step === "lunch")
        return [spot("hm-lunch", "button-lunch", { x: MORNING_THINGS.bag.x - 40, y: MORNING_THINGS.bag.y, r: 110 }, bagBox(), takeLunch), spot("hm-calendar", "button-cal", atCloset, CALENDAR, lookCalendar)];
      return [];
    },
    /**
     * A tap on the picture (game positions): a tap on the thing the goal outlines does its action, as the button
     * would, when the button is offered there now (a kid taps the glowing calendar). True when it was used.
     */
    tap(x, y) {
      const e = E(),
        o = e.offer && e.offer();
      if (!live() || !o || !o.spot || !o.spot.thing) return false;
      const t = o.spot.thing;
      if (x < t.x0 - 24 || x > t.x1 + 24 || y < t.y0 - 24 || y > t.y1 + 24) return false; // a finger is not exact
      o.spot.f();
      return true;
    },
    /** Every frame: the walk to the wardrobe, the closet door, his footsteps, the close-up's thunk. */
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
        const to = HOME_MORNING_SPOTS.closet;
        if (e.step("sq", to.x, to.y, HOME_MORNING_PACE.toCloset, dt)) {
          e.still("sq");
          e.face("sq", -1);
          h.door = true;
          e.set("wardrobe", "open");
          sound.morning("closetOpen");
          go("box");
          control("chip-box");
        }
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
        // in the closet (seen only with the door open): before the gift, and back in with it after
        gift ? drawBoxWithGift(ctx, MORNING_THINGS.boxIn) : drawGuardianBox(ctx, MORNING_THINGS.boxIn.x0, MORNING_THINGS.boxIn.y0);
        boxDrawn = { where: "closet", gift };
      }
    },
    /** Drawn on the room picture under the people: the box, and things on the floor behind Squatch. */
    drawOnRoom(ctx) {
      this.drawBox(ctx);
      const e = E(),
        h = H(),
        on = live();
      if (!on || e.room() !== "closet") return;
      const sy = e.pos("sq").y;
      on.step === "rocket" && e.get("ctrl") && glow(ctx, TRACE.rocket);
      (on.step === "notice" || on.step === "lunch") && glow(ctx, TRACE.bag);
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
      // Squatch as this file draws him: asleep under the blanket in the night, sitting up as he wakes (the blanket
      // sliding off), stretching in bed, or holding the gift up high (with one heart and the crayon thought bubble).
      if (e.get("sqPose") === "lie" && (h.step === "night" || (h.step === "wake" && h.phase === "sitUp"))) {
        const L = BED_POSES.lie,
          S0 = BED_POSES.sit,
          up = h.step === "night" ? 0 : Math.max(0, Math.min(1, h.t / (P.sitUp * 0.8))),
          q = up * up * (3 - 2 * up),
          pose = { x: L.x + (S0.x - L.x) * q, y: L.y + (S0.y - L.y) * q, a: L.a * (1 - q), arms: null, feet: false, eyes: h.step === "night" ? "closed" : "", yawn: 0 };
        drawBedtimeSquatch(ctx, pose, k);
        const b = drawBedBlanket(ctx, 1 - q);
        drew.pose = h.step === "night" ? "asleep" : "sitUp";
        drew.inBed = { x: Math.round(pose.x), y: Math.round(pose.y), a: +pose.a.toFixed(2), eyes: pose.eyes, blanket: b ? b.cover : 0 };
      }
      if (e.get("sqPose") === "lie" && h.step === "wake" && h.phase === "stretch") {
        drawSquatchArt(ctx, BED_SIT.x, BED_SIT.y, k, { line: 2 * k, arms: STRETCH, feet: false, shadow: false });
        drew.pose = "stretch";
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
        drew.crayonThought = { box: th.box, drawing: th.drawing, head };
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
        drew.thought = { box: drawBoxThought(ctx, head, Math.min(1, (e.time() - (h.thinkAt || 0)) / P.thinkIn)), head };
      }
      // the lunch bag is outlined while he says it (no action yet, so the goal outline is not drawn by the room)
      if (h.step === "notice") {
        const c = e.current();
        c && c.k === "bub" && (drew.bagOutline = bridge.drawGoalOutline(ctx, "closet", "hm-lunch", null, e.time(), [sqBox()]));
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
    /** Tests: the step, what the last frame drew, and what was heard. */
    debug() {
      const h = H();
      return { state: h ? { ...h } : null, active: !!live(), drew, box: boxDrawn, steps: record.steps.slice(), sounds: sound.asked(), sizes: MORNING_SIZES, things: MORNING_THINGS, spots: HOME_MORNING_SPOTS };
    },
  };
}
