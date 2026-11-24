/**
 * The party night, half one (party plan scenes P1 to P5, Brian's approved beats of 2026-11-24): from "That
 * evening…" to Squatch walking into the party in his own outfit. Each scene is a restart point with its own key
 * (party:P1 to party:P5): a catch shows the LOCKUP card and restarts that scene, and holding ↺ restarts it too.
 *   P1 The peek (home, then the hall; no catch). Music notes drift in under his door. PEEK · door: he walks to
 *      it and only his head and paws show in the hall's doorway gap. Isfred, muffled; the banner glows; "Robots?";
 *      the teach card on the glancer's cone. He steps into the doorway (his whole body now) and play begins.
 *   P2 Sneak to the plant (restart: in his doorway, the glancer facing the stage). The glancer warns ("?" and a
 *      blip), looks across the lane, turns back. HIDE · plant: eyes in the leaves. Seen: the one capture rule.
 *   P3 The welcome and the band, watched from the plant (↺ restarts it). Three Isfred lines, flyers flutter (one
 *      lands in the plant), the lights dim, the Croc Boys play, the guests pair off and dance; "I've never gotten to
 *      dance at a party."
 *   P4 Sneak home (restart: eyes in the plant, band playing). The pairs are busy; a flyer sticks to his back fur;
 *      he walks out through his door, and it drops on the floor at home.
 *   P5 Dress up (home; ↺ restarts it with nothing on). OPEN · closet: the full-screen dress-up (dress-up.js). Then
 *      he walks out through his door in his outfit, into the older free play (until half two replaces it).
 * Words come only from party-lines.js. The beat's progress lives in the game state as ch1PartyNow, so a restart
 * and the tests can read it. Everything in the hall is drawn by party-draw.js on the locked picture.
 */
import { partyLine, lockupCause } from "./party-lines.js";
import { HALL, SPOTS, CAST, GLANCE, GLANCE_TIMES, HALL_PICTURE, BANNER } from "./party-hall.js";
import { coneFrom, towardStage, lookAt, coneSees, drawCones, SEEN_TOO_LONG_SECONDS } from "./party-watch.js";
import { drawHall } from "./party-draw.js";
import { drawDoorNotes, drawFlyer, drawOutfit, drawPerson, LOOKS, drawAlarmCloseUp, drawBanner, drawTripod } from "./party-art.js";
import { startAlarm, tickAlarm, guardCones, homeGuardCone } from "./party-alarm.js";
import { tickVent, ventTufts } from "./party-vent.js";
import { openFullScreen, closeFullScreen, fullScreenOpen } from "./fullscreen.js";
import * as dress from "./dress-up.js";

// The home room (locked home picture v6, game positions): the door in the right wall, where Squatch stands after
// coming home, the closet spot, the bed he hides under, and where the flyer lands.
export const HOME_ROOM = Object.freeze({
  door: { x0: 912, x1: 940, y0: 358, y1: 468 },
  doorSpot: { x: 858, y: 470 },
  inside: { x: 790, y: 480 },
  closet: { x: 130, y: 400, r: 70 },
  inFront: { x: 160, y: 430 },
  bed: { x: 205, y: 500 },
  flyer: { x: 868, y: 520 },
});
// How fast scripted walks go (pixels a second) and how long the P3 moments last (seconds).
const PACE = Object.freeze({ walk: 240, peekStep: 120, flyers: 2.2, bandIn: 2.6, watch: 2.5 });
// The doorway home, as a trigger: standing here (during the alarm, or in P4) walks him through it.
const HALL_DOOR = Object.freeze({ x: 477, y: 590, dx: 40 });
// Party solids (feet cannot go here): the plant pots, the bar, its stools, the camera's tripod.
const SOLIDS = Object.freeze([
  { x0: 414, x1: 472, y0: 512, y1: 550 },
  { x0: 80, x1: 124, y0: 345, y1: 372 },
  { x0: 806, x1: 960, y0: 340, y1: 606 },
  { x0: 772, x1: 800, y0: 380, y1: 400 },
  { x0: 772, x1: 800, y0: 438, y1: 458 },
  { x0: 340, x1: 366, y0: 425, y1: 446 },
]);
const BOUNDS = Object.freeze({ x0: 60, x1: 900, y0: HALL.floorTop, y1: 590 });

export function createParty(bridge) {
  const E = () => bridge.engine();
  const picture = typeof Image !== "undefined" ? Object.assign(new Image(), { src: HALL_PICTURE }) : null;
  let closeUpSeen = false; // the alarm close-up shows the first time in a play
  const P = () => {
    const e = E();
    return (e && e.get("ch1PartyNow")) || null;
  };
  const save = (p) => E().set("ch1PartyNow", p);
  const sq = () => E().pos("sq");
  const live = () => {
    const p = P();
    return p && p.scene && p.scene !== "free" && String(E().get("scene") || "")[0] === "Q" ? p : null;
  };
  const say = (who, id, style) => E().say(who, partyLine(id), style);
  const chip = (id) => (E().set("ch1Chip", id ? partyLine(id) : ""), E().chipNow());
  const control = (on) => (E().set("ctrl", !!on), on || E().set("act", null), on || E().still("sq"));

  // ---------- the cast ----------
  function freshPeople() {
    const out = {};
    for (const g of CAST.guests) {
      const dx = g.x - 480,
        dy = g.y - 450,
        d = Math.hypot(dx, dy) || 1;
      out[g.id] = { x: g.x, y: g.y, hx: g.x, hy: g.y, ax: (dx / d) * 34, ay: (dy / d) * 20 };
    }
    return out;
  }
  // Where each person looks now (radians), by what the scene is doing.
  function faceOf(p, id, x, y) {
    const g = CAST.guests.find((q) => q.id === id);
    if (p.mode === "isfred") return lookAt(x, y, { x: p.isfred.x, y: p.isfred.y - 40 });
    if (p.mode === "pairs" && g && g.pair) {
      const to = p.people[g.pair];
      return lookAt(x, y, { x: to.x, y: to.y - 28 });
    }
    if (g && g.glancer && p.scene === "P2") return glancerAngle(p, x, y);
    return towardStage(x, y);
  }
  // The glancer (P2): faces the stage, turns his head with a "?" (the warning), looks across the lane, turns back.
  function glancePhase(p) {
    const T = GLANCE_TIMES,
      k = (p.gt || 0) % (T.stage + T.warn + T.look + T.back);
    if (k < T.stage) return { phase: "stage", k: 0 };
    if (k < T.stage + T.warn) return { phase: "warn", k: (k - T.stage) / T.warn };
    if (k < T.stage + T.warn + T.look) return { phase: "look", k: (k - T.stage - T.warn) / T.look };
    return { phase: "back", k: (k - T.stage - T.warn - T.look) / T.back };
  }
  function glancerAngle(p, x, y) {
    const g = glancePhase(p),
      stage = towardStage(x, y),
      look = GLANCE.a + GLANCE.sweep * Math.sin((g.k - 0.5) * Math.PI);
    // Turning, he passes over the stage side of the room only (stage is up and left, the look is left).
    const mix = (k) => stage + (look - (stage - Math.PI * 2) < Math.PI ? look - stage + Math.PI * 2 : look - stage) * k;
    if (g.phase === "stage") return stage;
    if (g.phase === "warn") return mix(g.k);
    if (g.phase === "look") return look;
    return mix(1 - g.k);
  }
  function cones(p) {
    const size = E().coneSize(),
      out = [];
    for (const g of CAST.guests) {
      const at = p.people[g.id];
      out.push(coneFrom(g.id, at.x, at.y, faceOf(p, g.id, at.x, at.y), size));
    }
    out.push(coneFrom("isfred", p.isfred.x, p.isfred.y, p.isfred.walking ? Math.atan2(CAST.isfredBar.y - p.isfred.y, CAST.isfredBar.x - p.isfred.x) : p.isfred.atBar ? Math.PI : Math.PI / 2, size));
    CAST.band.forEach((b, i) => out.push(coneFrom("band" + i, b.x, b.y, Math.PI / 2 + (i - 1) * 0.25, size)));
    out.push(coneFrom("bartender", CAST.bartender.x, CAST.bartender.y, Math.PI, size));
    p.alarm && out.push(...guardCones(p.alarm, size));
    // During the alarm the witness has left his spot: his cone goes with him (he is looking at the alarm).
    if (p.alarm) {
      const w = out.find((c) => c.id === p.alarm.w.id);
      w && Object.assign(w, coneFrom(w.id, p.alarm.w.x, p.alarm.w.y, lookAt(p.alarm.w.x, p.alarm.w.y, HALL.alarm), size));
    }
    return out;
  }
  const personAt = (p, id) => {
    if (p.alarm && p.alarm.w.id === id) return p.alarm.w;
    if (p.people[id]) return p.people[id];
    if (id === "isfred") return p.isfred;
    if (id === "bartender") return CAST.bartender;
    if (id.startsWith("band")) return CAST.band[+id.slice(4)];
    return null;
  };

  // ---------- scenes ----------
  function base(scene, extra) {
    return {
      scene,
      t: 0,
      gt: 0,
      mode: "stage",
      pose: "stand",
      people: freshPeople(),
      isfred: { x: CAST.isfred.x, y: CAST.isfred.y },
      lights: false,
      band: false,
      glow: 0,
      flyers: -1,
      flyer: "",
      seenBy: "",
      seenT: 0,
      alarm: null,
      vent: null,
      outfit: (P() && P().outfit) || dress.newOutfit(),
      ...(extra || {}),
    };
  }
  const bandOn = (p) => ((p.lights = true), (p.band = true), (p.mode = "pairs"), (p.isfred = { x: CAST.isfredBar.x, y: CAST.isfredBar.y, atBar: true }));
  function startScene(id, opts = {}) {
    const e = E();
    closeFullScreen();
    e.forgetSaved();
    e.set("act", null);
    if (id === "P1") {
      const p = base("P1", { phase: "home" });
      save(p);
      e.room() !== "closet" && e.enterRoom("closet", "Q1");
      e.set("scene", "Q1");
      e.set("wardrobe", "closed");
      e.set("sqPose", "stand");
      opts.restart && (e.place("sq", 640, 480), e.face("sq", 1));
      chip("chip-peek");
      control(true);
      return;
    }
    if (id === "P2") {
      save(base("P2", { phase: "sneak" }));
      inHall();
      e.place("sq", SPOTS.doorway.x, SPOTS.doorway.y);
      e.face("sq", -1);
      e.set("sqPose", "stand");
      chip("chip-plant");
      control(true);
      return;
    }
    if (id === "P3") {
      const p = base("P3", { phase: "watch", pose: "hidden", hideAt: "middle" });
      save(p);
      inHall();
      hideIn("middle");
      chip("");
      control(false);
      p.mode = "isfred";
      e.queue([
        say("official", "isfred-hello"),
        e.run(() => (P().glow = 1)),
        say("official", "isfred-helpers"),
        e.run(() => ((P().glow = 0), (P().flyers = 0), e.sfx("open"))),
        e.until(() => !P() || P().flyers >= PACE.flyers),
        say("official", "isfred-band"),
        e.run(() => {
          const q = P();
          bandOn(q);
          q.isfred = { x: CAST.isfred.x, y: CAST.isfred.y, walking: true };
          q.pt = 0;
          e.sfx("chime");
        }),
        e.until(() => !P() || P().pt >= PACE.bandIn),
        say("band", "band-song", "song"),
        e.run(() => ((P().pt = 0), (P().follow = true))),
        e.until(() => !P() || P().pt >= PACE.watch),
        say("sq", "sq-dance-wish", "whisper"),
        e.run(() => startScene("P4")),
      ]);
      return;
    }
    if (id === "P4") {
      const p = base("P4", { phase: "home", pose: "hidden", hideAt: "middle", flyers: PACE.flyers + 1 });
      bandOn(p);
      save(p);
      inHall();
      hideIn("middle");
      chip("chip-home");
      control(true);
      return;
    }
    if (id === "P5") {
      const p = base("P5", { phase: "closet", flyer: "floor", outfit: dress.newOutfit() });
      save(p);
      e.room() !== "closet" && e.enterRoom("closet", "Q1");
      e.set("scene", "Q1");
      e.set("wardrobe", "closed");
      e.set("sqPose", "stand");
      opts.restart && (e.place("sq", HOME_ROOM.inside.x, HOME_ROOM.inside.y), e.face("sq", -1));
      chip("");
      control(true);
    }
  }
  function inHall() {
    const e = E();
    e.room() !== "hall" && e.enterRoom("hall", "QA");
    e.set("scene", "QA");
  }
  // Squatch steps into a plant: only his eyes show in its leaves.
  function hideIn(plantId) {
    const e = E(),
      p = P(),
      spot = plantId === "back" ? SPOTS.plantBack : SPOTS.plantMiddle;
    e.place("sq", spot.x, spot.y);
    e.set("sqPose", "hidden");
    p.pose = "hidden";
    p.hideAt = plantId;
  }

  // ---------- what the kid does ----------
  function peek() {
    const e = E();
    control(false);
    chip("");
    P().phase = "walk";
    e.walkOff();
    e.queue([
      e.until((dt) => (e.trail(), e.step("sq", 840, 470, PACE.walk, dt))),
      e.until((dt) => e.step("sq", 905, 465, PACE.walk, dt)),
      e.run(() => {
        e.enterRoom("hall", "QA");
        e.place("sq", SPOTS.peek.x, SPOTS.peek.y);
        e.set("sqPose", "hidden");
        const p = P();
        p.phase = "peek";
        p.pose = "peek";
      }),
      say("official", "isfred-muffled", "whisper"),
      e.run(() => (P().glow = 1)),
      say("sq", "sq-robots", "whisper"),
      e.run(() => (P().glow = 0)),
      teachCard(),
      e.run(() => ((P().phase = "stepIn"), (P().pose = "stand"), e.set("sqPose", "stand"))),
      e.until((dt) => e.step("sq", SPOTS.doorway.x, SPOTS.doorway.y, PACE.peekStep, dt)),
      e.run(() => startScene("P2")),
    ]);
  }
  // The teach card (the zoom-in technique): dark except a spotlight on the glancer and his cone, one line.
  function teachCard() {
    const g = CAST.guests.find((q) => q.glancer);
    return { k: "card", id: "focus", text: partyLine("teach-cones"), teach: "party-cones", x: g.x - 70, y: g.y - 10, r: 150 };
  }
  function hide(plantId) {
    const e = E(),
      spot = plantId === "back" ? SPOTS.plantBack : SPOTS.plantMiddle;
    control(false);
    e.queue([
      e.until((dt) => e.step("sq", spot.x, spot.y, PACE.walk, dt)),
      e.run(() => {
        hideIn(plantId);
        e.sfx("hide");
        const p = P();
        p.seenBy = "";
        p.seenT = 0;
        // P2 with no alarm, in the middle plant: he made it; the welcome starts.
        if (p.scene === "P2" && !p.alarm && plantId === "middle") return startScene("P3");
        control(true);
      }),
    ]);
  }
  function hideUnderBed() {
    const e = E();
    e.place("sq", HOME_ROOM.bed.x, HOME_ROOM.bed.y);
    e.set("sqPose", "under");
    P().pose = "bed";
    e.sfx("hide");
    e.set("act", null);
  }
  // Through the doorway home (P4's way home, or running from the alarm).
  function walkHome() {
    const e = E(),
      p = P();
    control(false);
    p.phase = "walkHome";
    e.walkOff();
    e.queue([
      e.until((dt) => (e.trail(), e.step("sq", HALL_DOOR.x, 636, PACE.walk, dt))),
      e.run(() => {
        e.enterRoom("closet", "Q1");
        e.place("sq", 905, 470);
        e.face("sq", -1);
      }),
      e.until((dt) => e.step("sq", HOME_ROOM.inside.x, HOME_ROOM.inside.y, PACE.walk, dt)),
      e.run(() => {
        const q = P();
        // the flyer drops off his back by the door
        q.flyer === "back" && (q.flyer = "floor");
        if (q.alarm) return ((q.phase = "hiding"), control(true));
        startScene("P5");
      }),
    ]);
  }
  function openCloset() {
    const e = E(),
      p = P();
    control(false);
    p.phase = "dressing";
    e.set("wardrobe", "open");
    e.sfx("open");
    const st = { outfit: dress.newOutfit(), drag: null, pop: null },
      t0 = { tada: 0, full: false };
    p.dress = st;
    openFullScreen({
      label: "dress-up",
      draw(ctx, w, h, t) {
        const L = dress.layout(w, h);
        if (dress.meter(st.outfit) >= 1 && !t0.full) ((t0.full = true), (t0.tada = 0.001), e.sfx("chime"));
        t0.tada > 0 && (t0.tada = Math.min(1.01, t0.tada + 1 / 60 / 0.6));
        st.pop && (st.pop.t -= 1 / 60);
        dress.draw(ctx, L, st, t, t0.tada > 1 ? 0 : t0.tada);
      },
      pointer(kind, x, y) {
        const o = fullScreenOpen(),
          L = dress.layout(o.size().w, o.size().h),
          r = dress.pointer(st, L, kind, x, y);
        r === "wear" && e.sfx("pickup");
        dress.meter(st.outfit) < 1 && (t0.full = false);
        r === "go" && dressed();
      },
    });
  }
  function dressed() {
    const e = E(),
      p = P();
    p.outfit = { ...p.dress.outfit };
    p.dress = null;
    closeFullScreen();
    e.set("wardrobe", "closed");
    e.place("sq", HOME_ROOM.inFront.x, HOME_ROOM.inFront.y);
    e.face("sq", 1);
    p.phase = "out";
    control(true);
  }
  function walkToParty() {
    const e = E(),
      p = P();
    control(false);
    p.phase = "walkOut";
    e.walkOff();
    e.queue([
      e.until((dt) => (e.trail(), e.step("sq", 905, 466, PACE.walk, dt))),
      e.run(() => {
        e.enterRoom("hall", "QA");
        e.place("sq", HALL_DOOR.x, 636);
        e.face("sq", 1);
      }),
      e.until((dt) => e.step("sq", 480, 560, PACE.walk, dt)),
      e.run(() => {
        // Half one ends here: the older free play takes over, with the outfit he chose (until half two).
        save({ scene: "free", outfit: P().outfit });
        e.startFreePlay();
      }),
    ]);
  }

  // ---------- the capture rule's hooks ----------
  function alarmApi() {
    const e = E();
    return {
      E: e,
      size: () => e.coneSize(),
      sq,
      hidden: () => (P().pose === "hidden" ? "plant" : P().pose === "bed" ? "bed" : ""),
      room: () => e.room(),
      people: () => P().people,
      firstTime: () => !closeUpSeen,
      closeUp(done) {
        closeUpSeen = true;
        const wasCtrl = e.get("ctrl");
        control(false);
        let t0 = null;
        openFullScreen({
          label: "fur alarm",
          draw(ctx, w, h, t) {
            t0 == null && (t0 = t);
            const k = Math.min(1, (t - t0) / 0.8);
            drawAlarmCloseUp(ctx, w, h, picture, HALL.alarmPicture, k, t);
            if (t - t0 >= 1.8) {
              closeFullScreen();
              control(wasCtrl);
              e.sfx("alarm");
              done();
            }
          },
        });
      },
      caught(whoId, whereId) {
        e.catchSquatch(lockupCause(whoId, whereId));
      },
      lost() {
        e.sfx("chime");
        e.lostYou();
      },
      calmDone(how) {
        const p = P();
        chip(p.scene === "P2" ? "chip-plant" : p.scene === "P4" ? "chip-home" : "");
        if (how === "bed") return calmFromHome();
        // Hidden in the middle plant in P2: he made it, and the welcome starts from there.
        if (p.scene === "P2" && p.hideAt === "middle" && p.pose === "hidden") return startScene("P3");
      },
    };
  }
  // After hiding under the bed: back to calm, watched from the door gap, then back to where he was going.
  function calmFromHome() {
    const e = E(),
      p = P(),
      scene = p.scene;
    control(false);
    e.walkOff();
    e.queue([
      e.until((dt) => e.step("sq", 905, 470, PACE.walk, dt)),
      e.run(() => {
        e.set("sqPose", "hidden");
        e.enterRoom("hall", "QA");
        e.place("sq", SPOTS.peek.x, SPOTS.peek.y);
        P().pose = "peek";
        P().pt = 0;
      }),
      e.until(() => !P() || P().pt >= 1.2),
      e.run(() => {
        if (scene === "P4") {
          // He was on his way home anyway: back inside, to the closet.
          e.enterRoom("closet", "Q1");
          e.place("sq", HOME_ROOM.inside.x, HOME_ROOM.inside.y);
          e.set("sqPose", "stand");
          return startScene("P5");
        }
        P().pose = "stand";
        e.set("sqPose", "stand");
      }),
      e.until((dt) => !P() || P().scene !== "P2" || e.step("sq", SPOTS.doorway.x, SPOTS.doorway.y, PACE.peekStep, dt)),
      e.run(() => P() && P().scene === "P2" && (chip("chip-plant"), control(true))),
    ]);
  }

  // ---------- every frame ----------
  function tick(dt) {
    const p = live();
    if (!p) return;
    const e = E();
    dt = dt || 0;
    p.t += dt;
    p.pt = (p.pt || 0) + dt;
    p.flyers >= 0 && (p.flyers += dt);
    const s = sq(),
      inHallNow = e.room() === "hall";
    // Isfred walks off the stage to the bar's top end once the band plays.
    if (p.isfred.walking) {
      const k = Math.min(1, p.pt / 2.4);
      p.isfred.x = CAST.isfred.x + (CAST.isfredBar.x - CAST.isfred.x) * k;
      p.isfred.y = CAST.isfred.y + (CAST.isfredBar.y - CAST.isfred.y) * k;
      k >= 1 && (p.isfred = { x: CAST.isfredBar.x, y: CAST.isfredBar.y, atBar: true });
    }
    if (p.scene === "P2" && !p.alarm) {
      const before = glancePhase(p).phase;
      p.gt += dt;
      const after = glancePhase(p).phase;
      before !== "warn" && after === "warn" && e.sfx("bleep");
    }
    // In a plant, the kid steering steps him out of it (P2's back plant, P4, or after a search).
    const free = e.get("ctrl") && !e.current();
    if (free && p.pose === "hidden" && inHallNow && (p.scene === "P2" || p.scene === "P4") && e.steering()) {
      p.pose = "stand";
      e.set("sqPose", "stand");
      p.scene === "P4" && !p.flyer && (p.flyer = "back");
    }
    if (free && p.pose === "bed" && !p.alarm && e.steering()) ((p.pose = "stand"), e.set("sqPose", "stand"));
    // Sight: whoever's cone holds him shows "?", then "!" if he stays too long, and the alarm starts.
    if ((p.scene === "P2" || p.scene === "P4") && inHallNow && !p.alarm) {
      const seen = free && p.pose === "stand" ? cones(p).find((c) => coneSees(c, s)) : null;
      if (!seen) ((p.seenBy = ""), (p.seenT = 0));
      else {
        p.seenT = p.seenBy === seen.id ? p.seenT + dt : 0;
        p.seenBy = seen.id;
        if (p.seenT >= SEEN_TOO_LONG_SECONDS) {
          const w = personAt(p, seen.id);
          startAlarm(p, { id: seen.id, x: w.x, y: w.y }, "where-hall");
          raise(p);
        }
      }
      // The vent: too close without a disguise, fur goes in and the nearest guest sees it.
      const v = tickVent(p, dt, s, free && p.pose === "stand");
      v === "warn" && e.sfx("slurp");
      if (v === "fur") {
        e.sfx("zap");
        let best = null;
        for (const g of CAST.guests) {
          const at = p.people[g.id],
            d = Math.hypot(at.x - s.x, at.y - s.y);
          (!best || d < best.d) && (best = { id: g.id, x: at.x, y: at.y, d });
        }
        startAlarm(p, best, "where-vent");
        raise(p);
      }
    }
    if (p.alarm) {
      tickAlarm(p, dt, alarmApi());
      // Running from the alarm: his doorway takes him home.
      if (P() && P().alarm && free && inHallNow && p.pose === "stand" && Math.abs(s.x - HALL_DOOR.x) < HALL_DOOR.dx && s.y >= HALL_DOOR.y - 4 && p.alarm.phase !== "calm") walkHome();
    } else if (p.scene === "P4" && free && inHallNow && p.pose === "stand" && Math.abs(s.x - HALL_DOOR.x) < HALL_DOOR.dx && s.y >= HALL_DOOR.y - 4) walkHome();
    if (p.scene === "P5" && p.phase === "out" && free && Math.hypot(s.x - HOME_ROOM.doorSpot.x, s.y - HOME_ROOM.doorSpot.y) < 40) walkToParty();
  }
  function raise(p) {
    const e = E();
    e.sfx("bleep");
    p.seenBy = "";
    p.seenT = 0;
    chip("chip-run");
  }

  // ---------- spots (the big button's actions, and the doors that take him through) ----------
  function spots() {
    const p = live(),
      e = E();
    if (!p || !e.get("ctrl")) return [];
    const room = e.room(),
      out = [];
    const plant = (id) => {
      const s = id === "back" ? SPOTS.plantBack : SPOTS.plantMiddle,
        pl = HALL.plants.find((q) => q.id === id);
      return { id: id === "middle" ? "hide" : "hide-back", verb: "HIDE", cap: partyLine("button-hide-plant").split(" · ")[1], who: "sq", x: s.x, y: s.y, r: 60, thing: pl.leaves, f: () => hide(id) };
    };
    const door = (id, x, y, r) => ({ id, verb: "", cap: "", who: "sq", x, y, r });
    if (p.scene === "P1" && p.phase === "home" && room === "closet")
      out.push({ id: "peek", verb: "PEEK", cap: partyLine("button-peek").split(" · ")[1], who: "sq", x: 890, y: 480, r: 160, thing: HOME_ROOM.door, f: peek });
    if ((p.scene === "P2" || p.scene === "P4") && room === "hall" && p.pose === "stand") {
      p.scene === "P2" && out.push(plant("middle"));
      out.push(plant("back"));
      p.scene === "P4" && out.push(plant("middle"));
      (p.alarm || p.scene === "P4") && out.push(door("go-home", HALL_DOOR.x, HALL_DOOR.y, 30));
    }
    if (p.alarm && room === "closet" && p.pose !== "bed")
      out.push({ id: "hidebed", verb: "HIDE", cap: partyLine("button-hide-bed").split(" · ")[1], who: "sq", x: HOME_ROOM.bed.x + 110, y: HOME_ROOM.bed.y, r: 420, f: hideUnderBed });
    if (p.scene === "P5" && room === "closet" && p.phase === "closet")
      out.push({ id: "dress", verb: "OPEN", cap: partyLine("button-closet").split(" · ")[1], who: "sq", x: HOME_ROOM.closet.x, y: HOME_ROOM.closet.y, r: HOME_ROOM.closet.r, thing: { x0: 36, x1: 180, y0: 193, y1: 345 }, f: openCloset });
    if (p.scene === "P5" && room === "closet" && p.phase === "out") out.push(door("go-party", HOME_ROOM.doorSpot.x, HOME_ROOM.doorSpot.y, 36));
    return out;
  }
  // The one thing outlined (only what the kid must go to next).
  function goalId(p, room) {
    if (!E().get("ctrl")) return "";
    if (p.alarm) return room === "closet" ? (p.pose === "bed" ? "" : "hidebed") : p.pose === "hidden" ? "" : "go-home";
    if (p.scene === "P1" && room === "closet") return "peek";
    if (p.scene === "P2" && p.pose === "stand") return "hide";
    if (p.scene === "P4" && room === "hall") return "go-home";
    if (p.scene === "P5") return p.phase === "closet" ? "dress" : p.phase === "out" ? "go-party" : "";
    return "";
  }

  // ---------- drawing ----------
  function view(p, t) {
    const s = sq(),
      e = E(),
      dancing = p.mode === "pairs";
    const guests = CAST.guests.map((g) => {
      const at = p.alarm && p.alarm.w.id === g.id ? p.alarm.w : p.people[g.id],
        to = g.pair ? p.people[g.pair] : null;
      return { id: g.id, x: at.x, y: at.y, dance: dancing && !p.alarm ? 1 : 0, lean: to ? Math.sign(to.x - at.x) : 0 };
    });
    const marks = [];
    p.seenBy && (() => {
      const w = personAt(p, p.seenBy);
      w && marks.push({ x: w.x, y: w.y - 84, mark: "?", size: 42 });
    })();
    // the glancer's warning "?" as his head turns
    if (p.scene === "P2" && !p.alarm && glancePhase(p).phase === "warn") {
      const g = p.people.backpack;
      marks.push({ x: g.x, y: g.y - 84, mark: "?", size: 42 });
    }
    const a = p.alarm;
    const shout = a && (a.phase === "shout" || (a.phase === "run" && a.t < 0.5)) ? { x: a.w.x, y: a.w.y - 96 } : null;
    a && a.phase === "shout" && marks.push({ x: a.w.x + 40, y: a.w.y - 70, mark: "!", size: 42 });
    const outlineHidden = p.pose === "hidden" || p.pose === "bed";
    const eyes = p.pose === "hidden" ? eyesAt(p, t) : null;
    return {
      t,
      picture,
      banner: { glow: p.glow },
      lights: p.lights ? { song: 0, dim: 1 } : null,
      isfred: p.isfred,
      band: { look: "B", playing: p.band },
      guests,
      bartender: { x: CAST.bartender.x, y: CAST.bartender.y, f: -1 },
      guards: a ? a.guards.filter((g) => g.room === "hall").map((g) => ({ x: g.x, y: g.y, f: Math.cos(g.a) < 0 ? -1 : 1 })) : [],
      tripod: { ...CAST.guests.find((g) => g.id === "camera").tripod, aim: { x: 330, y: 250 } },
      cones: cones(p),
      allCones: p.scene === "P1",
      noteCone: (c) => e.noteCone(c),
      squatch: outlineHidden ? { x: s.x, y: s.y, pose: "hidden" } : { x: s.x, y: s.y, f: s.f || 1, walk: e.walkPhase(), pose: p.pose === "peek" ? "peek" : "stand", flyer: p.flyer === "back", shake: p.vent && p.vent.shake, outfit: null },
      eyes,
      marks,
      shout,
      alarm: !!a && a.phase !== "shout" && a.phase !== "run" && a.phase !== "calm",
      tufts: ventTufts(p),
      warning: p.vent && p.vent.t > 0 && p.pose === "stand" ? { kind: "tuft", k: Math.min(1, p.vent.t * 4) } : null,
    };
  }
  // His eyes in the plant he hides in; in P3 and P4 they move from pair to pair.
  function eyesAt(p, t) {
    const pl = HALL.plants.find((q) => q.id === (p.hideAt || "middle"));
    const look = p.follow || p.scene === "P4" ? Math.round(Math.sin(t * 0.9)) * 3 : 0;
    return { x: pl.eyes.x + look, y: pl.eyes.y };
  }
  // The flyers Isfred tosses (P3): they flutter down over the crowd; one lands in the plant.
  function drawFlyers(ctx, p) {
    if (p.flyers < 0) return;
    const k = Math.min(1, p.flyers / PACE.flyers);
    const ends = [
      [300, 420],
      [360, 470],
      [520, 440],
      [600, 520],
      [680, 430],
      [441, 470],
      [240, 520],
    ];
    ends.forEach(([x1, y1], i) => {
      const x0 = CAST.isfred.x,
        y0 = CAST.isfred.y - 70,
        x = x0 + (x1 - x0) * k + Math.sin(k * 10 + i) * 14 * (1 - k),
        y = y0 + (y1 - y0) * k - Math.sin(k * Math.PI) * 60;
      // the plant's flyer stays among its leaves; the others lie on the floor
      drawFlyer(ctx, x, y, 11, k * 4 + i);
    });
  }
  function drawRoom(ctx) {
    const p = live(),
      e = E();
    if (!p) return false;
    const t = e.time();
    drawHall(ctx, e, bridge.guests, view(p, t));
    drawFlyers(ctx, p);
    outline(p, "hall");
    return true;
  }
  function outline(p, room) {
    const id = goalId(p, room);
    if (!id) return;
    const s = spots().find((q) => q.id === id) || { id, verb: "", cap: "" };
    E().markGoal(s);
  }
  // Drawn over the home room: the music notes at the door, the flyer on the floor, his outfit, the guard.
  function draw(ctx) {
    const p = live(),
      e = E();
    if (!p || e.room() !== "closet") return;
    const t = e.time();
    p.scene === "P1" && p.phase === "home" && drawDoorNotes(ctx, HOME_ROOM.door, t);
    p.flyer === "floor" && drawFlyer(ctx, HOME_ROOM.flyer.x, HOME_ROOM.flyer.y, 16, 0.5);
    const s = sq();
    p.scene === "P5" && p.pose === "stand" && e.get("sqPose") === "stand" && drawOutfit(ctx, s.x, s.y, e.squatchScale(), p.outfit, s.f || 1);
    const g = p.alarm && p.alarm.homeGuard;
    if (g) {
      const c = homeGuardCone(p.alarm, e.coneSize());
      drawCones(ctx, [c], s, p.pose === "bed", true, (k) => e.noteCone(k));
      drawPerson(ctx, g.x, g.y, e.homeAdult(), LOOKS.guard, Math.cos(g.a) < 0 ? -1 : 1, t);
    }
    outline(p, "closet");
  }

  return {
    /** "That evening…": the party night begins (P1). */
    start() {
      closeUpSeen = false;
      save(null);
      startScene("P1");
    },
    /** Opens a scene straight away (the localhost ?beat=party:P3 link, and tests). */
    jump(scene) {
      closeUpSeen = false;
      save(null);
      startScene(scene || "P1", { restart: true });
    },
    /** True while a half-one scene is on (P1 to P5). */
    active() {
      return !!live();
    },
    /** True while this beat draws the room on screen (the hall). */
    ownsRoom() {
      return !!live() && E().room() === "hall";
    },
    /** The scene, its phase, and what the tests read. */
    now() {
      const p = live();
      return p ? { scene: p.scene, phase: p.phase, pose: p.pose, alarm: p.alarm ? p.alarm.phase : "", seenBy: p.seenBy, glance: p.scene === "P2" ? glancePhase(p).phase : "", outfit: { ...p.outfit }, flyer: p.flyer } : null;
    },
    /** The outfit he chose (the older free play draws it on him). */
    outfit() {
      const p = P();
      return p && p.outfit ? p.outfit : null;
    },
    /** Closes any full-screen view (a restart). */
    closeViews() {
      closeFullScreen();
    },
    /** Restart the scene he is in (a catch's LOCKUP card, or holding ↺). */
    restart() {
      const p = live();
      p && startScene(p.scene, { restart: true });
    },
    tick,
    spots,
    drawRoom,
    draw,
    /** The people and things feet cannot walk through in the hall, and the floor he can walk on. */
    solids() {
      const p = live();
      if (!p) return [];
      const feet = (x, y) => ({ x0: x - 18, x1: x + 18, y0: y - 10, y1: y + 6, person: 1 });
      return [...SOLIDS, ...Object.values(p.people).map((g) => feet(g.x, g.y))];
    },
    bounds() {
      return BOUNDS;
    },
    /** Where a speaker's bubble points (Isfred beside him, the band, Squatch's eyes in the plant). */
    speakerAt(who) {
      const p = live();
      if (!p || E().room() !== "hall") return null;
      const adult = E().hallSizes().adult;
      if (who === "official") return { x: p.isfred.x, y: p.isfred.y - adult - 6 };
      if (who === "band") return { x: CAST.band[1].x, y: CAST.band[1].y - adult - 6 };
      if (who === "sq" && p.pose === "hidden") return eyesAt(p, 0);
      if (who === "sq" && p.pose === "peek") return { x: SPOTS.peek.x, y: 590 };
      return null;
    },
    /** A bubble that sits beside its speaker instead of over them (Isfred's never covers the banner). */
    bubbleBeside(who) {
      const p = live();
      if (!p || E().room() !== "hall") return null;
      const adult = E().hallSizes().adult;
      if (who === "official") return { x0: p.isfred.x - 16, x1: p.isfred.x + 16, y0: p.isfred.y - adult, y1: p.isfred.y, side: "right" };
      if (who === "band") return { x0: CAST.band[0].x - 20, x1: CAST.band[2].x + 20, y0: CAST.band[0].y - adult, y1: CAST.band[0].y, side: "right" };
      return null;
    },
    /** Tests: the dress-up's pieces and body spots, in page pixels, while it is open. */
    dressTargets() {
      const p = live(),
        o = fullScreenOpen();
      if (!p || !p.dress || !o) return null;
      const L = dress.layout(o.size().w, o.size().h);
      return {
        pieces: L.slots.filter((s) => !dress.worn(p.dress.outfit, s.id)).map((s) => ({ id: s.id, x: s.x, y: s.y })),
        spots: Object.fromEntries(dress.SPOT_NAMES.map((n) => [n, dress.spotAt(L, n)])),
        go: dress.meter(p.dress.outfit) >= 1 ? { x: L.go.x + L.go.w / 2, y: L.go.y + L.go.h / 2 } : null,
        outfit: { ...p.dress.outfit },
      };
    },
    // ---- the older free play's hall (until half two replaces it) draws with these ----
    drawBannerOn(ctx) {
      drawBanner(ctx, BANNER, 0, E().time());
    },
    drawPersonOn(ctx, kind, x, y, f) {
      drawPerson(ctx, x, y, E().hallSizes().adult, LOOKS[kind], f, E().time());
    },
    drawTripodOn(ctx, x, y) {
      drawTripod(ctx, x, y, { x: 360, y: 250 }, false, E().time());
    },
    /** His outfit on him (the older free play): a hug from the octopus tips the head piece. */
    drawOutfitOn(ctx, x, y, scale, f, askew) {
      const p = P();
      p && p.outfit && drawOutfit(ctx, x, y, scale, p.outfit, f, askew ? { spot: "head", a: 0.5 } : null);
    },
    drawConesOn(ctx, list, at, hidden) {
      return drawCones(ctx, list, at, hidden, false, (c) => E().noteCone(c));
    },
    /** Tests: the cones now, with their people. */
    cones() {
      const p = live();
      return p ? cones(p) : [];
    },
  };
}
