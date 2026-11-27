/**
 * After the party: the player is Mops, cleaning the empty party hall (Brian, story pass 28-52, section E2a, decided
 * 2026-11-26: "have him clean up after the party before he comes back to the room; that is where he sees the
 * Polaroid"). Scene P9 (its own restart point: Mops at the hallway doorway, the hall as the party left it).
 *   The cause: the wall speaker calls "Ganitor Mops to the party hall." (approved words). Squatch is home; the switch
 *   card says "You are MOPS now." Mops comes in from the hallway and the player steers him. No timer, no robots,
 *   nobody to hide from. One new thing at a time:
 *     1 dust and confetti: walk over it and the beard leaves the floor clean (a sparkle where it was);
 *     2 two sticky spills: each needs two passes (it shrinks after one);
 *     3 the floor's corners: the beard reaches past his hooves, so the edges come clean too;
 *     4 a full beard: after a while the beard goes grey and stops cleaning; WRING · beard at his bucket (the first
 *       time, the morning's beard-wringing pictures, cutaway.js "beard");
 *     5 his own mess: if he knocked the snack pyramid over, the snacks lie on the floor by the bar;
 *     6 fur: once he has wrung his beard, a tuft by the floor vent ("Fur?") slides into the vent before he can reach
 *       it ("No, no, no."); then a trail of tufts, one at a time with the dashed outline ("Oh no." at the third,
 *       "Nobody saw that." as he mops it), leads to what Squatch left behind. This is the only required part.
 *     7 the find: the Polaroid under the photo spot if Squatch joined the group photo (PICK UP · photo: a close-up
 *       with the shirt to tap, "That's MY shirt.", then the big furry feet, a heart that pops, "Weee...?!",
 *       "Squatch."); otherwise his top hat where it fell, if it did (PICK UP · hat: "That's MY hat.", the heart, the
 *       gasp, "Squatch."); otherwise a big tuft caught in Squatch's own doorway (PICK UP · fur). The hall all clean:
 *       a "Spotless!" badge (no points).
 *   Then "Mops: go home" and his doorway: he walks in, the card says "You are SQUATCH now.", and the talk at home with
 *   truth or fib (party-talk.js, party-truth.js).
 * Words come only from party-lines.js. Drawing: party-cleanup-art.js and party-view.js. Every number in CLEAN is a
 * PLACEHOLDER for Brian.
 */
import { partyLine } from "./party-lines.js";
import { HALL, HALL_SOLIDS, HALL_DOOR, HALL_DOOR_OPENING, inHallDoorway, MOPS_IN, CAST, HOME_ROOM } from "./party-hall.js";
import { PHOTO_ROW, polaroidLayout } from "./party-photo.js";
import { snackRecord } from "./party-snacks.js";
import { mopBucketBox } from "./mop-bucket.js";
import { cutawaySteps } from "./cutaway.js";

// `cell`: a patch of floor (game px); the floor's dirty part (x0..x1, y0..y1); `reach`: how far round the beard's tip
// a patch comes clean; `full`: how many patches fill the beard; `tuftReach`: how near the beard a tuft is mopped;
// `fur`: seconds after his first wring before the first tuft shows; `slide`: the vent taking the first tuft;
// `heart`: the heart that rises and pops; `walk`: scripted walks; `spark`: a sparkle's life.
export const CLEAN = Object.freeze({ cell: 30, x0: 45, x1: 800, y0: 300, y1: 610, reach: 34, full: 40, tuftReach: 40, fur: 1.5, slide: 1.4, heart: 1.1, walk: 170, spark: 0.6, badge: 2.6 });
// Where the beard's tip is from his feet as the hall draws him (his beard hangs in front of his chest, game px at the
// hall's Mops size): `dx` ahead of him, `dy` down.
export const BEARD_TIP = Object.freeze({ dx: 36, dy: 0 });
// His mop bucket in the hall, by the hallway doorway he comes in at (mop-bucket.js drawing, `k` its size), and where
// he stands to wring (a step left of it, facing it).
export const HALL_BUCKET = Object.freeze({ x: 735, floor: 352, k: 0.32 });
// The bucket's box (its dashed outline when his beard is full: goal-targets.js "hall:wring").
const BUCKET_BOX = mopBucketBox(HALL_BUCKET.x, HALL_BUCKET.floor, HALL_BUCKET.k);
export const WRING_BOX = Object.freeze({ x0: BUCKET_BOX.x0, x1: BUCKET_BOX.x1, y0: BUCKET_BOX.y0, y1: BUCKET_BOX.floor });
export const WRING_AT = Object.freeze({ x: HALL_BUCKET.x - 62, y: HALL_BUCKET.floor + 2, r: 58 });
// The sticky spills (soda) and, if the pyramid fell, where the snacks lie (on the floor in front of the bar).
export const SPILLS = Object.freeze([Object.freeze({ x: 330, y: 446, r: 28, color: "#c2557f" }), Object.freeze({ x: 610, y: 522, r: 26, color: "#8e5bd0" })]);
export const CRUMBS = Object.freeze({ x: 764, y: 548, r: 30 });
// The first tuft, by the floor vent (HALL.vent), and where the trail sets off; the finds.
export const VENT_TUFT = Object.freeze({ x: HALL.vent.x + 74, y: HALL.vent.y - 22 });
export const TRAIL_FROM = Object.freeze({ x: 300, y: 432 });
export const FIND_AT = Object.freeze({
  photo: Object.freeze({ x: PHOTO_ROW.squatch.x, y: PHOTO_ROW.squatch.y + 18 }),
  fur: Object.freeze({ x: HALL_DOOR.x, y: HALL_DOOR.y + 4 }),
});
const TRAIL_TUFTS = 4; // after the one the vent takes

/** The floor patches the beard can clean: every patch of the floor whose middle is not under the stage, the bar, a stool or a pot. */
export function cleanPatches() {
  const out = [],
    C = CLEAN;
  for (let y = C.y0 + C.cell / 2; y < C.y1; y += C.cell)
    for (let x = C.x0 + C.cell / 2; x < C.x1; x += C.cell) HALL_SOLIDS.some((b) => x > b.x0 && x < b.x1 && y > b.y0 && y < b.y1) || out.push({ x, y });
  return out;
}
const PATCHES = cleanPatches();

/** What Squatch left behind for Mops to find: "photo" (he joined the group photo), "hat" (his top hat fell on the hall floor), else "fur". */
export function findFor(p) {
  if (p.shot && p.shot.got) return { kind: "photo", ...FIND_AT.photo };
  const hat = (p.fallen || []).find((f) => f.id === "tophat" && f.to === "floor");
  if (hat) return { kind: "hat", x: hat.x, y: hat.y };
  return { kind: "fur", ...FIND_AT.fur };
}
/** The trail: the tuft the vent takes, then TRAIL_TUFTS tufts from TRAIL_FROM toward the find, the last a step short of it. */
export function furTrail(find) {
  const out = [{ x: VENT_TUFT.x, y: VENT_TUFT.y, rot: 0.4 }],
    d = Math.hypot(find.x - TRAIL_FROM.x, find.y - TRAIL_FROM.y) || 1,
    stop = Math.max(0, d - 70) / d;
  for (let i = 0; i < TRAIL_TUFTS; i++) {
    const k = (stop * i) / (TRAIL_TUFTS - 1);
    out.push({ x: TRAIL_FROM.x + (find.x - TRAIL_FROM.x) * k + (i % 2 ? 14 : -10), y: TRAIL_FROM.y + (find.y - TRAIL_FROM.y) * k + (i % 2 ? -8 : 6), rot: i * 0.9 });
  }
  return out;
}

/** The Polaroid close-up on the game picture (960 x 640): where his shirt and his feet are in it, for the two taps. */
export function polaroidTargets(sqScale) {
  const L = polaroidLayout(960, 640),
    a = -0.035,
    at = L.at(PHOTO_ROW.squatch.x, PHOTO_ROW.squatch.y),
    s = sqScale * L.z,
    turn = (x, y) => ({ x: 480 + x * Math.cos(a) - y * Math.sin(a), y: 640 * 0.47 + x * Math.sin(a) + y * Math.cos(a) }),
    shirt = turn(at.x, at.y - 14 * s),
    feet = turn(at.x, at.y - 1 * s);
  return { shirt: { x: shirt.x, y: shirt.y, x0: shirt.x - 16 * s, x1: shirt.x + 16 * s, y0: shirt.y - 11 * s, y1: shirt.y + 10 * s }, feet: { x: feet.x, y: feet.y, x0: feet.x - 18 * s, x1: feet.x + 18 * s, y0: feet.y - 5 * s, y1: feet.y + 7 * s } };
}

/** `h`: the party's helpers ({ E, P, say, chip, control, sound, homeRoom }) and `home (p)`: Mops is home (the talk). */
export function createCleanup(h) {
  const E = () => h.E();
  const P = () => h.P();
  const line = (id) => partyLine(id);

  /** A fresh cleanup on the party state `p` (the hall as the party left it), from ending `from` ("close", "alarm", "early"). */
  function fresh(p, from) {
    const rec = snackRecord(p.snacks),
      find = findFor(p);
    p.clean = {
      from,
      phase: "mop",
      dirt: PATCHES.map(() => 1),
      spills: SPILLS.map(() => ({ passes: 0, in: false })),
      crumbs: rec.toppled ? { done: false } : null,
      beard: 0,
      wrung: 0,
      sinceWring: 0,
      walk: 0,
      last: null,
      sparks: [],
      find,
      trail: furTrail(find).map((t) => ({ ...t, state: "wait" })),
      ti: -1,
      slide: null,
      picked: false,
      close: null,
      heartAt: null,
      spotlessAt: null,
      done: false,
    };
    // nobody else is in the hall any more: the guests, the bartender, Isfred, the band and the camera have gone
    const gone = Object.fromEntries([...CAST.guests.map((g) => g.id), "bartender", "isfred", "band0", "band1", "band2", "camera"].map((id) => [id, true]));
    p.close = { phase: "clean", t: 0, gi: 0, gt: 0, gone };
    Object.assign(p, { lights: false, lightK: 0, band: false, bandOff: true, mops: null, alarm: null, shot: p.shot ? { ...p.shot, phase: "done" } : p.shot, seenBy: "", seenT: 0, stare: null, oct: null, dance: null, snack: null, speakerOn: false });
  }

  /**
   * The cleanup begins, from wherever Squatch is at home now: the wall speaker calls Mops to the hall (unless it did
   * already), "Stay in here." after an alarm, the switch to Mops, then the hall. `from`: "close", "alarm" or "early".
   */
  function begin(p, from) {
    const e = E();
    h.control(false);
    h.chip("");
    e.walkOff();
    const steps = [];
    p.paCalled ||
      steps.push(
        e.run(() => (h.sound.one("chime"), (P().paCalled = true))),
        h.say("speaker", "pa-mops-hall"),
      );
    // after the alarm Mops is in the room with Squatch under the bed: he tells him to stay, and goes
    from === "alarm" &&
      steps.push(
        e.run(() => e.face("mops", -1)),
        h.say("mops", "mops-stay-in"),
        e.until((dt) => e.step("mops", h.homeRoom.mopsDoor.x, h.homeRoom.mopsDoor.y, CLEAN.walk, dt)),
        e.run(() => (e.set("moPose", "hidden"), h.sound.one("door"))),
      );
    steps.push(
      e.run(() => {
        const q = P();
        q.cleanFrom = from;
        q.scene = "P9";
        e.forgetSaved();
        e.switchTo("mops", line("switch-clean"));
      }),
      e.run(() => enterHall(P())),
    );
    e.queue(steps);
  }
  /** Into the empty hall: Mops comes in from the hallway doorway, humming, and the player takes over. */
  function enterHall(p) {
    const e = E();
    fresh(p, p.cleanFrom || "close");
    e.room() !== "hall" && e.enterRoom("hall", "QA");
    e.set("scene", "QA");
    e.set("moPose", "stand");
    e.place("mops", MOPS_IN.from.x, MOPS_IN.from.y);
    e.face("mops", -1);
    h.sound.hum(1);
    h.sound.one("hooves");
    h.control(false);
    e.queue([
      e.until((dt) => e.step("mops", MOPS_IN.at.x, MOPS_IN.at.y, CLEAN.walk, dt)),
      e.run(() => {
        e.still("mops");
        h.chip("chip-mop");
        h.control(true);
      }),
    ]);
  }
  /** ↺ in the cleanup (or a link to P9): Mops at the hallway doorway, the hall dirty again; he is the player. */
  function restart(p) {
    const e = E();
    e.switchTo("mops", "");
    p.paCalled = true;
    enterHall(p);
  }

  const beardTip = (m) => ({ x: m.x + (m.f || 1) * BEARD_TIP.dx, y: m.y + BEARD_TIP.dy });
  const near = (a, b, r) => Math.hypot(a.x - b.x, a.y - b.y) < r;

  /** True once every patch, spill, the snacks and every tuft is clean. */
  function spotless(c) {
    return c.dirt.every((d) => !d) && c.spills.every((s) => s.passes >= 2) && (!c.crumbs || c.crumbs.done) && c.trail.every((t) => t.state === "gone" || t.state === "vent");
  }

  /** Every frame of P9 in the hall. `free`: the player has control and no line is up. */
  function tick(p, dt, free) {
    const c = p.clean,
      e = E();
    if (!c || e.room() !== "hall") return;
    c.sparks = c.sparks.filter((s) => (s.t += dt) < CLEAN.spark);
    c.slide && c.slide.k < 1 && (c.slide.k = Math.min(1, c.slide.k + dt / CLEAN.slide));
    const m = e.pos("mops");
    c.last && (c.walk += Math.hypot(m.x - c.last.x, m.y - c.last.y));
    c.last = { x: m.x, y: m.y };
    c.sinceWring += dt;
    if (!free || c.close || c.done) return;
    const tip = beardTip(m);
    // the beard cleans while it has room: floor patches, then the spills (a pass is one way over), the snacks
    if (c.beard < 1) {
      PATCHES.forEach((q, i) => {
        if (!c.dirt[i] || !near(q, tip, CLEAN.reach) || c.beard >= 1) return;
        c.dirt[i] = 0;
        c.beard = Math.min(1, c.beard + 1 / CLEAN.full);
        c.sparks.push({ x: q.x, y: q.y, t: 0 });
      });
      SPILLS.forEach((s, i) => {
        const st = c.spills[i],
          inside = st.passes < 2 && near(s, tip, s.r + 8);
        inside && !st.in && ((st.passes += 1), h.sound.one("squish"), c.sparks.push({ x: s.x, y: s.y, t: 0 }));
        st.in = inside;
      });
      c.crumbs && !c.crumbs.done && near(CRUMBS, tip, CRUMBS.r) && ((c.crumbs.done = true), h.sound.one("swish"), c.sparks.push({ x: CRUMBS.x, y: CRUMBS.y, t: 0 }));
      c.beard >= 1 && (h.sound.one("uhoh"), c.found || h.chip("chip-wring"));
    }
    // the fur, once he has wrung his beard (the required part)
    c.wrung >= 1 && c.ti < 0 && c.sinceWring >= CLEAN.fur && startFur(p);
    const tf = c.ti >= 1 ? c.trail[c.ti] : null;
    if (tf && tf.state === "show" && near(tf, tip, CLEAN.tuftReach)) mopTuft(p, c.ti);
    // Spotless! once (no points)
    if (c.spotlessAt == null && spotless(c)) ((c.spotlessAt = e.time()), h.sound.one("tada"));
    // his doorway takes him home once he has found it
    c.found && inHallDoorway(m) && goHome(p);
  }

  /** The goal chip for where the cleanup is: mopping, the fur (and the find at its end), or home. */
  function cleanChip(c) {
    return c.found ? "chip-mops-home" : c.ti >= 0 ? "chip-fur" : "chip-mop";
  }
  /** WRING · beard at the bucket: the first time the morning's pictures, after that a quick squeeze. */
  function wring(p) {
    const e = E(),
      c = p.clean;
    h.control(false);
    e.still("mops");
    e.face("mops", 1);
    const first = c.wrung === 0;
    const steps = first ? [...cutawaySteps("beard")] : [e.run(() => (h.sound.one("squish"), (P().clean.wringT = 0))), e.until((dt) => !P() || !P().clean || (P().clean.wringT += dt) >= 0.7)];
    steps.push(
      e.run(() => {
        const q = P().clean;
        q.beard = 0;
        q.wrung += 1;
        q.sinceWring = 0;
        q.wringT = null;
        h.chip(cleanChip(q));
        h.control(true);
      }),
    );
    e.queue(steps);
  }

  /** The first tuft, by the vent: "Fur?", the vent takes it, "No, no, no.", then the trail begins. */
  function startFur(p) {
    const e = E(),
      c = p.clean;
    c.ti = 0;
    c.phase = "fur";
    c.trail[0].state = "show";
    h.sound.hum(0);
    h.control(false);
    h.chip("");
    e.queue([
      e.run(() => e.face("mops", -1)),
      h.say("mops", "mops-fur"),
      e.run(() => ((P().clean.slide = { k: 0 }), (P().clean.trail[0].state = "slide"), h.sound.one("suckIn"))),
      e.until(() => !P() || !P().clean || P().clean.slide.k >= 1),
      e.run(() => (P().clean.trail[0].state = "vent")),
      h.say("mops", "mops-no-no"),
      e.run(() => showTuft(P(), 1)),
    ]);
  }
  /** The next tuft of the trail shows, with the dashed outline. At the third one: "Oh no." */
  function showTuft(p, i) {
    const e = E(),
      c = p.clean;
    c.ti = i;
    c.phase = "trail";
    c.trail[i].state = "show";
    h.chip("chip-fur");
    if (i === 2) {
      h.control(false);
      e.queue([h.say("mops", "mops-oh-no"), e.run(() => h.control(true))]);
    } else h.control(true);
  }
  /** His beard takes the tuft: the next one shows (or the find). Mopping the third: "Nobody saw that." */
  function mopTuft(p, i) {
    const e = E(),
      c = p.clean,
      t = c.trail[i];
    t.state = "gone";
    h.sound.one("swish");
    c.sparks.push({ x: t.x, y: t.y, t: 0 });
    // (the last tuft lies by the find: the chip stays "mop up the fur" until he picks it up)
    const after = () => (i + 1 < c.trail.length ? showTuft(P(), i + 1) : ((P().clean.phase = "find"), h.chip("chip-fur"), h.control(true)));
    if (i === 2) {
      h.control(false);
      e.queue([h.say("mops", "mops-nobody-saw"), e.run(after)]);
    } else after();
  }

  /** PICK UP · photo, hat or fur. */
  function pickUp(p) {
    const e = E(),
      c = p.clean;
    c.picked = true;
    c.phase = "close-up";
    h.control(false);
    h.chip("");
    e.still("mops");
    h.sound.one("fwip");
    // the hat comes off the floor (it is in his hoof now)
    c.find.kind === "hat" && (p.fallen = (p.fallen || []).filter((f) => !(f.id === "tophat" && f.to === "floor")));
    if (c.find.kind === "photo") {
      // the Polaroid close-up: tap his shirt, then his feet (pointer)
      c.close = { step: "shirt", t: 0 };
      return;
    }
    e.queue([...(c.find.kind === "hat" ? [h.say("mops", "mops-my-hat")] : []), ...gasp()]);
  }
  /** The heart rises and pops, "Weee...?!", "Squatch.", then home. */
  function gasp() {
    const e = E();
    return [
      e.run(() => ((P().clean.heartAt = E().time()), h.sound.one("twinkle"))),
      e.until(() => !P() || !P().clean || E().time() - P().clean.heartAt >= CLEAN.heart),
      e.run(() => (h.sound.one("pop"), h.sound.one("gasp"))),
      h.say("mops", "mops-weee"),
      h.say("mops", "mops-squatch"),
      e.run(() => found(P())),
    ];
  }
  /** He tucks it away: the close-up closes, "Mops: go home", his doorway outlined. */
  function found(p) {
    const c = p.clean;
    c.close = null;
    c.heartAt = null;
    c.found = true;
    c.phase = "home";
    h.chip("chip-mops-home");
    h.control(true);
  }
  /** A tap in the Polaroid close-up (game positions): the shirt, then the feet. True when the close-up took it. */
  function pointer(p, kind, x, y) {
    const c = p.clean;
    if (!c || !c.close) return false;
    if (kind !== "down" || E().current()) return true;
    const T = polaroidTargets(E().hallSizes().squatch),
      pad = 26,
      inBox = (b) => x > b.x0 - pad && x < b.x1 + pad && y > b.y0 - pad && y < b.y1 + pad,
      // (the two boxes touch: a tap counts for the one whose middle is nearer)
      which = [["shirt", T.shirt], ["feet", T.feet]].filter(([, b]) => inBox(b)).sort((a, b) => Math.hypot(x - a[1].x, y - a[1].y) - Math.hypot(x - b[1].x, y - b[1].y))[0],
      hit = (id) => !!which && which[0] === id;
    if (c.close.step === "shirt" && hit("shirt")) {
      c.close.step = "said";
      E().queue([h.say("mops", "mops-my-shirt"), E().run(() => (P().clean.close.step = "feet"))]);
    } else if (c.close.step === "feet" && hit("feet")) {
      c.close.step = "heart";
      E().queue(gasp());
    }
    return true;
  }

  /** Through his doorway: Mops walks home; the switch back to Squatch; Mops comes in (the talk). */
  function goHome(p) {
    const e = E(),
      R = h.homeRoom,
      c = p.clean;
    c.done = true;
    h.control(false);
    h.chip("");
    h.sound.hum(0);
    e.walkOff();
    e.queue([
      e.until((dt) => e.step("mops", HALL_DOOR.x, 640, CLEAN.walk, dt)),
      e.run(() => {
        const q = P();
        h.sound.one("door");
        e.enterRoom("closet", "Q1");
        q.scene = "P9b";
        // Squatch is where Mops left him: under the bed after the alarm, else standing in the room
        e.set("moPose", "hidden");
        e.place("mops", R.mopsDoor.x, R.mopsDoor.y + 6);
        e.face("mops", -1);
        if (q.cleanFrom === "alarm") {
          e.place("sq", R.bed.x, R.bed.y);
          e.set("sqPose", "under");
          q.pose = "bed";
        } else {
          e.place("sq", R.inside.x - 60, R.inside.y + 30);
          e.set("sqPose", "stand");
          q.pose = "stand";
        }
        e.face("sq", 1);
        e.switchTo("sq", line("switch-home"));
      }),
      ...h.home(P()),
    ]);
  }

  /** The big button in the hall (Mops): WRING · beard at the bucket when his beard is full; PICK UP at the find. */
  function spots(p) {
    const c = p.clean;
    if (!c || E().room() !== "hall" || c.done || c.close) return [];
    const out = [],
      [wv, wc] = line("button-wring").split(" · ");
    c.beard >= 1 && out.push({ id: "wring", verb: wv, cap: wc, who: "mo", x: WRING_AT.x, y: WRING_AT.y, r: WRING_AT.r, thing: WRING_BOX, f: () => wring(P()) });
    if (c.phase === "find" && !c.picked) {
      const [v, cap] = line(c.find.kind === "photo" ? "button-pick-photo" : c.find.kind === "hat" ? "button-pick-hat" : "button-pick-fur").split(" · ");
      out.push({ id: "pick-up", verb: v, cap, who: "mo", x: c.find.x, y: c.find.y, r: 64, thing: findBox(c), f: () => pickUp(P()) });
    }
    c.found && out.push({ id: "go-home", verb: "", cap: "", who: "mo", x: (HALL_DOOR_OPENING.x0 + HALL_DOOR_OPENING.x1) / 2, y: HALL_DOOR_OPENING.y0 + 6, r: (HALL_DOOR_OPENING.x1 - HALL_DOOR_OPENING.x0) / 2, box: HALL_DOOR_OPENING });
    return out;
  }
  /** The box round the find on the floor (its dashed outline). */
  function findBox(c) {
    const f = c.find,
      r = f.kind === "fur" ? 20 : 22;
    return { x0: f.x - r, x1: f.x + r, y0: f.y - r - 6, y1: f.y + r - 6 };
  }
  /** The one thing outlined now: the bucket when the beard is full, else the tuft or the find, else his doorway. */
  function goal(p) {
    const c = p.clean;
    if (!c || c.close || c.done) return "";
    if (c.found) return "go-home";
    return c.beard >= 1 ? "wring" : "";
  }
  /** What is outlined by the cleanup's own drawing (a tuft or the find move, so they are not in the goal table). */
  function litBox(p) {
    const c = p.clean;
    if (!c || c.close || c.done || c.beard >= 1 || c.found) return null;
    if (c.phase === "find" && !c.picked) return findBox(c);
    const t = c.ti >= 1 ? c.trail[c.ti] : null;
    return t && t.state === "show" ? { x0: t.x - 18, x1: t.x + 18, y0: t.y - 18, y1: t.y + 14 } : null;
  }

  /** Tests and the robot: the cleanup now (game positions). */
  function state(p) {
    const c = p.clean;
    if (!c) return null;
    const m = E().pos("mops");
    return {
      phase: c.phase,
      from: c.from,
      dirty: c.dirt.reduce((a, d) => a + d, 0),
      patches: PATCHES.length,
      beard: c.beard,
      wrung: c.wrung,
      spills: c.spills.map((s) => s.passes),
      crumbs: c.crumbs ? c.crumbs.done : null,
      find: { ...c.find },
      trail: c.trail.map((t) => ({ x: Math.round(t.x), y: Math.round(t.y), state: t.state })),
      ti: c.ti,
      close: c.close ? c.close.step : "",
      targets: c.close ? polaroidTargets(E().hallSizes().squatch) : null,
      found: !!c.found,
      spotless: c.spotlessAt != null,
      lit: litBox(p),
      mops: { x: Math.round(m.x), y: Math.round(m.y), f: m.f },
      tip: beardTip(m),
      bucket: { ...WRING_AT },
      timer: false,
    };
  }
  /**
   * Tests that are about something else (the talk, the TV): the cleanup done at once, as if played (the find picked
   * up), and Mops walks home through Squatch's door. Only while the player has control in the hall.
   */
  function finish(p) {
    const c = p.clean;
    if (!c || c.done || E().room() !== "hall") return false;
    c.trail.forEach((t, i) => (t.state = i ? "gone" : "vent"));
    c.ti = c.trail.length - 1;
    c.picked = true;
    c.close = null;
    c.found = true;
    h.sound.hum(0);
    E().place("mops", HALL_DOOR.x, HALL_DOOR.y);
    goHome(p);
    return true;
  }
  /** Tests only: the hall all clean at once (Spotless! shows on the next frame). */
  function cleanAll(p) {
    const c = p.clean;
    if (!c) return;
    c.dirt = c.dirt.map(() => 0);
    c.spills.forEach((s) => (s.passes = 2));
    c.crumbs && (c.crumbs.done = true);
  }
  return { begin, enterHall, restart, tick, wring, pickUp, pointer, spots, goal, litBox, state, cleanAll, finish, beardTip, patches: () => PATCHES, home: HOME_ROOM };
}
