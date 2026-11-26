/**
 * The home morning, Chapter 1 beats 22 to 24 (docs/CH1-STORY-WALKTHROUGH.md): a gift from the Guardians, the
 * calendar (delivery day), and Mops's forgotten lunch. It follows the bedtime story (beat 21, bedtime-story.js) and
 * hands over to today's lunch sneak (src/game/14-ch1-day2.js ch1TakeLunch). What the player sees, step by step
 * (plan reviewed 2026-11-26; every word is from home-morning-lines.js, every drawing from home-morning-art.js):
 *   night   wordless: the room dims and comes back up; while it is dark Mops's hooves walk away and the door shuts;
 *           the morning song starts. Mops is gone; the rocket (the note tied on) stands at the foot of the bed.
 *   wake    wordless: "z z z" stops, he lifts his head, stretches both arms up, gets up and steps down beside the rocket.
 *   rocket  "Squatch: pick up the gift"; only the rocket is outlined and glows. PICK UP · rocket.
 *   hold    he holds it up high, one heart; "The Guardians came! They always come when I'm scared." (NEXT)
 *   think   wordless: a thought bubble shows the Guardian Box, so the box is seen before the chip names it.
 *   closet  "Squatch: put the gift in the box"; the wardrobe is outlined. OPEN · closet (he steps to its right).
 *   box     the door is open; the G box on the closet floor is outlined. PUT IN · box.
 *   lift    he takes the box out onto the floor; the close-up: the box big, "MY GARDIANS", the gift drops in (NEXT).
 *   shut    back in the room the gift sticks out of the box on the floor; he shuts the closet: the calendar is back.
 *   cal     "Squatch: look at the calendar"; the calendar is outlined. LOOK · calendar opens the older program's
 *           close-up, with today's marks (home-morning-art.js drawCalendarToday).
 *   notice  the lunch bag by the door is outlined; "He forgot his lunch!" (NEXT)
 *   lunch   "Squatch: take the lunch"; TAKE · lunch hands over to the lunch sneak (the bag in his paw).
 * Its progress lives in the game-state field ch1HomeMorning (and ch1Step, "hm-<step>"), so the step restart (↺)
 * brings back the step the player is on. While he wakes, stretches and holds the gift up this file draws Squatch
 * (squatch-art.js, the room's Squatch: same shapes, size and outline) and the room leaves him out (sqPose "lie").
 */
import { drawSquatchArt, armEnds } from "./squatch-art.js";
import { morningWords } from "./home-morning-lines.js";
import { MORNING_THINGS, MORNING_SIZES, drawRocket, drawLunchBag, drawGuardianBox, drawBoxWithGift, drawBoxThought, drawCalendarToday, BOX_CLOSEUP, GBOX_ID } from "./home-morning-art.js";
import { HOME_THINGS } from "./home-alone.js";
import { cutawaySteps } from "./cutaway.js";
import { footfall } from "./footfalls.js";
import { createHomeMorningSound, HOME_MORNING_SOUND } from "./home-morning-sound.js";

export const HOME_MORNING_ID = "ch1-home-morning";

/**
 * Where Squatch stands (game positions; tests/standing-spots.mjs checks each against the furniture). bed: his feet as
 * the room draws him getting up; woke: beside the rocket, where getting up ends; closet: right of the wardrobe and the
 * bed's corner, facing left, so neither the box nor the calendar is ever under him (Fable's review, 2026-11-26).
 * mops: where the bedtime story left Mops (beside the bed), for the moment before the room goes dark.
 */
export const HOME_MORNING_SPOTS = Object.freeze({
  bed: Object.freeze({ x: 205, y: 470 }),
  woke: Object.freeze({ x: 250, y: 580 }),
  closet: Object.freeze({ x: 300, y: 398 }),
  lunch: Object.freeze({ x: 820, y: 478 }),
});
const MOPS_AT_BED = Object.freeze({ x: 380, y: 460 });
// Where the room draws him sitting on the bed (60-frame-draw.js, sqPose "sit" and "sleep").
const BED_SIT = Object.freeze({ x: 205, y: 444 });
// Standing anywhere here counts as "at the wardrobe" (right of it, behind or beside the bed's top corner).
const AT_CLOSET = Object.freeze({ x0: 150, x1: 440, y0: 350, y1: 480 });
const CALENDAR = HOME_THINGS.calendar;
const WARDROBE = HOME_THINGS.closet;

/**
 * Timing in seconds and speeds in game pixels a second (placeholders). Each wordless part plays 2 to 4 seconds.
 * night: dim (to dark), dark (held), up (back to light); hooves while it is dark, the door after them, the song as
 * it comes back up. wake: lift (head up), stretch (arms up), rise (getting up), then a walk to beside the rocket.
 */
export const HOME_MORNING_PACE = Object.freeze({
  dim: 0.6,
  dark: 0.3,
  up: 0.6,
  hooves: Object.freeze([0.6, 0.85, 1.1]),
  door: 1.3,
  lift: 0.45,
  stretch: 0.8,
  rise: 0.45,
  walk: 160,
  hold: 0.9,
  think: 1.6,
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
  // A new step: its name, a fresh clock, and ch1Step so the step restart saves each step on its own.
  const go = (step, extra) => {
    const e = E(),
      h = H();
    Object.assign(h, { step, t: 0, phase: "" }, extra || {});
    e.set("ch1Step", "hm-" + step);
    record.steps.push(step);
  };
  // The player has Squatch: the chip for this step comes up.
  const control = (chip) => {
    const e = E();
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
    if (awake) {
      e.set("moPose", "hidden");
      e.place("sq", HOME_MORNING_SPOTS.woke.x, HOME_MORNING_SPOTS.woke.y);
      e.face("sq", 1);
      bridge.homeMusic.start("home-morning");
      go("rocket");
      return control("chip-gift");
    }
    // Asleep in bed as the bedtime story left him, Mops beside the bed.
    e.set("sqPose", "sleep");
    e.place("sq", HOME_MORNING_SPOTS.bed.x, HOME_MORNING_SPOTS.bed.y);
    e.set("moPose", "stand");
    e.place("mops", MOPS_AT_BED.x, MOPS_AT_BED.y);
    e.face("mops", -1);
    go("night");
    e.queue([e.until(night), e.until(wake), e.run(() => (go("rocket"), control("chip-gift")))]);
  }
  // Night to morning: dark, Mops leaves (heard, not seen), light again, the morning song.
  function night(dt) {
    const e = E(),
      h = H(),
      P = HOME_MORNING_PACE,
      t0 = h.t;
    h.t += dt || 0;
    e.set("zzz", (e.get("zzz") || 0) + (dt || 0));
    const past = (at) => t0 < at && h.t >= at;
    if (past(P.dim)) e.set("moPose", "hidden");
    P.hooves.forEach((at, i) => past(at) && sound.morning("hoof", i));
    if (past(P.door)) (sound.morning("door"), bridge.homeMusic.start("home-morning"));
    if (h.t < P.dim + P.dark + P.up) return false;
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
    if (h.phase === "") ((h.phase = "lift"), e.set("sqPose", "sit"), e.set("sqLift", -1));
    if (h.phase === "lift") {
      e.set("sqLift", Math.min(0, -1 + t / P.lift));
      if (t >= P.lift) ((h.phase = "stretch"), e.set("sqLift", 0), e.set("sqPose", "lie"));
    } else if (h.phase === "stretch") {
      if (t >= P.lift + P.stretch) ((h.phase = "rise"), e.set("sqPose", "sit"));
    } else if (h.phase === "rise") {
      e.set("sqLift", Math.min(1, (t - P.lift - P.stretch) / P.rise));
      if (t >= P.lift + P.stretch + P.rise) {
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
      e.run(() => {
        H().gift = "box";
        go("shut");
      }),
      e.until((dt) => (H().t += dt || 0) >= HOME_MORNING_PACE.shut),
      e.run(() => {
        H().door = false;
        e.set("wardrobe", "closed");
        sound.morning("closetShut");
        go("cal");
        control("chip-cal");
      }),
    ]);
  }
  function lookCalendar() {
    const e = E();
    busy();
    go("calendar");
    e.openCalendar(() => {
      busy();
      go("notice");
      e.face("sq", 1);
      e.queue([e.say("sq", morningWords("sq-lunch")), e.run(() => (go("lunch"), control("chip-lunch")))]);
    });
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
  const rocketBox = () => {
    const r = MORNING_THINGS.rocket;
    return { x0: r.x - 12, x1: r.x + 25, y0: r.y - MORNING_SIZES.rocket, y1: r.y };
  };
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
    // they are left there in the night: none before the room is dark (Mops is still beside the bed)
    if (h.step === "night" && h.t < HOME_MORNING_PACE.dim) return out;
    h.gift === "floor" && out.push({ id: "rocket", y: MORNING_THINGS.rocket.y, draw: (ctx) => drawRocket(ctx, MORNING_THINGS.rocket.x, MORNING_THINGS.rocket.y) });
    h.bag === "floor" && out.push({ id: "bag", y: MORNING_THINGS.bag.y, draw: (ctx) => drawLunchBag(ctx, MORNING_THINGS.bag.x, MORNING_THINGS.bag.y) });
    return out;
  };
  // The gift's soft glow while it is the goal (bigger than the rocket, so it shows on a phone).
  function glow(ctx) {
    const r = MORNING_THINGS.rocket,
      a = 0.35 + 0.25 * Math.sin(E().time() * 4),
      g = ctx.createRadialGradient(r.x + 4, r.y - 24, 4, r.x + 4, r.y - 24, 56);
    g.addColorStop(0, `rgba(255,224,110,${a})`);
    g.addColorStop(1, "rgba(255,224,110,0)");
    ctx.fillStyle = g;
    ctx.fillRect(r.x - 60, r.y - 84, 128, 120);
  }
  // Where the box is now: in the closet, on its way out, or out on the floor.
  function boxPlace(h) {
    const a = MORNING_THINGS.boxIn,
      b = MORNING_THINGS.boxOut;
    if (h.step === "lift") {
      const k = Math.min(1, h.t / HOME_MORNING_PACE.boxOut),
        ease = k * k * (3 - 2 * k),
        up = Math.sin(k * Math.PI) * 30;
      return { x0: a.x0 + (b.x0 - a.x0) * ease, y0: a.y0 + (b.y0 - a.y0) * ease - up };
    }
    return h.boxOut ? b : a;
  }

  return {
    start,
    /**
     * A test jump (ch1JumpBeat 23, tests): straight to one of the player's steps ("rocket", "closet", "box", "cal",
     * "lunch"), with everything before it done (the gift held, then in the box out on the floor).
     */
    jump(step) {
      const e = E(),
        h = H();
      const at = { rocket: "woke", closet: "woke", box: "closet", cal: "closet", lunch: "lunch" }[step];
      if (!h || !at) return;
      const before = (s) => ["rocket", "closet", "box", "cal", "lunch"].indexOf(step) > ["rocket", "closet", "box", "cal", "lunch"].indexOf(s);
      Object.assign(h, { gift: before("box") ? "box" : before("rocket") ? "held" : "floor", boxOut: before("box"), door: step === "box", heart: -1 });
      e.set("wardrobe", step === "box" ? "open" : "closed");
      e.set("moPose", "hidden");
      e.place("sq", HOME_MORNING_SPOTS[at].x, HOME_MORNING_SPOTS[at].y);
      e.face("sq", at === "closet" ? -1 : 1);
      go(step);
      control({ rocket: "chip-gift", closet: "chip-box", box: "chip-box", cal: "chip-cal", lunch: "chip-lunch" }[step]);
    },
    /** True from Day 2's start until he takes the lunch. */
    active() {
      return !!live();
    },
    /** True while the Guardian Box is still in the closet on Day 2 (60-frame-draw.js gboxOut). */
    boxInCloset() {
      const h = live();
      return !!h && !h.boxOut;
    },
    /** The spots for the step the player is on: one at a time, its thing outlined (goal-targets.js "closet:hm-..."). */
    spots() {
      const h = live(),
        e = E();
      if (!h || !e.get("ctrl")) return [];
      if (h.step === "rocket") return [spot("hm-rocket", "button-rocket", { ...MORNING_THINGS.rocket, r: 120 }, rocketBox(), pickUp)];
      if (h.step === "closet") return [spot("hm-closet", "button-closet", atCloset, WARDROBE, openCloset)];
      if (h.step === "box") return [spot("hm-box", "button-box", atCloset, MORNING_THINGS.boxIn, putIn)];
      if (h.step === "cal") return [spot("hm-calendar", "button-cal", atCloset, CALENDAR, lookCalendar)];
      if (h.step === "lunch") return [spot("hm-lunch", "button-lunch", { ...HOME_MORNING_SPOTS.lunch, r: 100 }, bagBox(), takeLunch)];
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
     * The Guardian Box on Day 2: in the closet (seen only with the door open) until he takes it out, then on the floor
     * by the closet for good, the gift in it. Also drawn again over Squatch when he stands behind it (60-frame-draw.js).
     */
    drawBox(ctx) {
      const e = E();
      boxDrawn = null;
      if (!e || e.room() !== "closet" || !e.get("ch1Day2")) return;
      const h = H(),
        on = live();
      if (!on || h.boxOut || h.step === "lift") {
        const b = on ? boxPlace(h) : MORNING_THINGS.boxOut,
          gift = !(on && h.gift !== "box");
        gift ? drawBoxWithGift(ctx, MORNING_THINGS.boxOut) : drawGuardianBox(ctx, b.x0, b.y0);
        boxDrawn = { where: gift || h.boxOut ? "floor" : "moving", x0: Math.round(b.x0), y0: Math.round(b.y0), gift };
      } else if (e.get("wardrobe") === "open") {
        drawGuardianBox(ctx, MORNING_THINGS.boxIn.x0, MORNING_THINGS.boxIn.y0);
        boxDrawn = { where: "closet", gift: false };
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
      on.step === "rocket" && e.get("ctrl") && glow(ctx);
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
      // Squatch as this file draws him: stretching in bed, or holding the gift up high (with one heart).
      if (e.get("sqPose") === "lie" && h.step === "wake") {
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
      if (h.heart >= 0) {
        const age = e.time() - h.heart,
          y = p.y - 48.5 * k - 26 - Math.min(1, age / 0.8) * 30;
        heart(ctx, p.x, y, 15);
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
        const t = h.t,
          a = t < P.dim ? t / P.dim : t < P.dim + P.dark ? 1 : Math.max(0, 1 - (t - P.dim - P.dark) / P.up);
        ctx.fillStyle = `rgba(14,18,32,${(0.92 * a).toFixed(3)})`;
        ctx.fillRect(0, 0, 960, 640);
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
      return { state: h ? { ...h } : null, active: !!live(), drew, box: boxDrawn, steps: record.steps.slice(), sounds: sound.asked(), sizes: MORNING_SIZES, things: MORNING_THINGS, spots: HOME_MORNING_SPOTS };
    },
  };
}
