/**
 * The party night, half one (party plan scenes P1 to P5, Brian's approved beats of 2026-11-24): from "That
 * evening…" to Squatch walking into the party in his own outfit. Each scene is a restart point with its own key
 * (party:P1 to party:P5): a catch shows the LOCKUP card and restarts that scene, and holding ↺ restarts it too.
 *   P1 The peek (home, then the hall; no catch). Music notes drift in under his door. PEEK · door: he walks to
 *      it and only his head and paws show in the hall's doorway gap. Isfred, muffled; the banner glows; "Robots?";
 *      the teach card on the glancer's cone. He steps into the doorway (his whole body now) and play begins.
 *   P2 Sneak to the plant (restart: in his doorway, the glancer facing the stage). The glancer warns ("?" and a
 *      blip), looks across the lane, turns back. HIDE · plant: eyes in the leaves. Seen: the one capture rule.
 *   P3 The welcome and the band, watched from the plant (↺ restarts it). Isfred's lines (he holds one flyer); after
 *      the robots line Squatch thinks "Robots for the heavy work? That's Mops's job!" (the banner glows) and "I have
 *      to show Mops." (the flyer in Isfred's hand glows); the lights dim, the Croc Boys walk on and take their places
 *      while Isfred carries a mic stand to the singer and sets it down, then he walks off and sets the flyer down at
 *      the bar; a beat; the band plays, a wordless close-up of a Croc Boy bopping plays by itself (croc-cutaway.js),
 *      and back in the hall the guests pair off and dance (Brian 2026-11-26, showing 7 at 0:11).
 *   P4 The flyer sneak (restart: eyes in the plant, band playing, the flyer on the bar counter's far end). He sneaks
 *      to it past the dancers' sweeping cones (every cone drawn whole; party-hall.js P4_SWEEP), GRAB · flyer, carries
 *      it in his paw home through his door (his door is not the goal, and does nothing, until he has it). At home:
 *      "Phew, made it!", his bed glows, SAVE · flyer lays it on top of the bed (Brian 2026-11-26, #42), and he thinks
 *      "That party looked so fun." and "I'll sneak back in a costume and dance!".
 *      Seen: the one capture rule; a restart puts the flyer back on the counter.
 *   P5 Dress up (home; ↺ restarts it with nothing on). OPEN · closet: the full-screen dress-up (dress-up.js). Then
 *      he walks out through his door in his outfit.
 *   P6 The party in disguise (restart: just inside his door, same outfit, the song that was playing): free play,
 *      the toys and the three songs (party-free.js, party-toys.js, party-snacks.js, party-dance.js).
 *   P7 The FUR alarm and the run home (restart: the alarm ringing, guards coming in, Squatch on the dance floor
 *      with the pieces he lost still gone): the one capture rule. Under his bed, the "more to find" card: back to
 *      the party (P6 goes on), or keep going (party-after-alarm.js).
 *   P8a / P8b / P8c The endings: after an alarm ("Keep going"), at closing time, or after going home early through
 *      his own door ("Keep going"); all three end with the talk at home and beat 20 (party-after-alarm.js,
 *      party-endings.js, party-home-early.js, party-talk.js).
 * Words come only from party-lines.js. The beat's progress lives in the game state as ch1PartyNow, so a restart
 * and the tests can read it. Everything in the hall is drawn by party-draw.js on the locked picture (the view is
 * built in party-view.js); the capture rule's hooks are in party-capture.js.
 */
import { partyLine } from "./party-lines.js";
import { HALL, SPOTS, CAST, GLANCE, GLANCE_TIMES, HALL_PICTURE, HALL_SOLIDS, HALLWAY_LANE, DANCE_SPOT, HALL_SPEAKER, BANNER, HOME_ROOM, HALL_DOOR, HALL_DOOR_OPENING, inHallDoorway, SNACK_SPOT, FLYER, PYRAMID, BAND_AIM, P4_SWEEP, sweepAngle } from "./party-hall.js";
export { HOME_ROOM };
import { HOME_THINGS, HOME_SPOTS } from "./home-alone.js";
import { GOAL_TARGETS } from "./goal-targets.js";
import { coneFrom, towardStage, lookAt, coneSees, SEEN_TOO_LONG_SECONDS } from "./party-watch.js";
import { startAlarm, tickAlarm, guardCones, ALARM } from "./party-alarm.js";
import { tickVent, moveTufts, ventTufts } from "./party-vent.js";
import { openFullScreen, closeFullScreen, fullScreenOpen } from "./fullscreen.js";
import * as dress from "./dress-up.js";
import { createCapture } from "./party-capture.js";
import { createView } from "./party-view.js";
import { createFreePlay } from "./party-free.js";
import { createEndings } from "./party-endings.js";
import { createAfterAlarm } from "./party-after-alarm.js";
import { createHomeEarly } from "./party-home-early.js";
import { tickStageWalks, bandOffStage } from "./party-stage-walks.js";
import { cutawaySteps } from "./cutaway.js";
import { bandTrackNow, partyOnNow, guestsInHall } from "./party-band-order.js";
import { createPartySound } from "./party-sound.js";
import { furShows } from "./party-outfit.js";
import { CUT, snackRecord } from "./party-snacks.js";
import { lateState } from "./party-now.js";
import { tickQuestions } from "./party-question.js";
import { footfall } from "./footfalls.js";
import { bandOnStageForPhoto } from "./party-photo.js";
import { OCT, chasing } from "./party-octopus.js";

// His home door in the right wall: the one box its outline uses too (goal-targets.js).
const HOME_DOOR = GOAL_TARGETS["closet:peek"].rect;
// How fast scripted walks go (pixels a second) and how long the P3 moments last (seconds).
// (`see`: the beat after Isfred has set the flyer down, before the band starts; Brian 2026-11-26. `bandIn`, 2.6 s,
// went the same day: the band's coming on is now its walk, the mic and the flyer, party-stage-walks.js)
const PACE = Object.freeze({ walk: 240, scurry: 330, peekStep: 120, see: 0.8, watch: 2.5 });
// What he wears when a link opens P6 to P8 with no dress-up before it.
export const JUMP_OUTFIT = Object.freeze({ head: "tophat", face: "shades", body: "shirt", legs: "boots" });
const BOUNDS = Object.freeze({ x0: 60, x1: 900, y0: HALL.floorTop, y1: 590 });
// Who can raise the alarm, and how the LOCKUP card names them (party-lines.js "who-*").
const WITNESS = Object.freeze({ ...Object.fromEntries(CAST.guests.map((g) => [g.id, "who-tourist"])), bartender: "who-bartender" });

export function createParty(bridge) {
  const E = () => bridge.engine();
  const picture = typeof Image !== "undefined" ? Object.assign(new Image(), { src: HALL_PICTURE }) : null;
  const firstAlarm = { seen: false }; // the alarm close-up shows the first time in a play
  const P = () => {
    const e = E();
    return (e && e.get("ch1PartyNow")) || null;
  };
  const save = (p) => E().set("ch1PartyNow", p);
  const sq = () => E().pos("sq");
  const live = () => {
    const p = P();
    return p && p.scene && p.scene !== "done" && String(E().get("scene") || "")[0] === "Q" ? p : null;
  };
  const say = (who, id, style) => E().say(who, partyLine(id), style);
  const chip = (id) => (E().set("ch1Chip", id ? partyLine(id) : ""), E().chipNow());
  // A guard reached him: the LOCKUP card is on its way, so nothing hands control back first.
  const caught = () => !!(P() && P().alarm && P().alarm.phase === "caught");
  const control = (on) => (E().set("ctrl", !!on), on || E().set("act", null), on || E().still("sq"));

  const sound = createPartySound(E);
  const late = (p) => p.scene === "P6" || p.scene === "P7" || p.scene === "P8a" || p.scene === "P8b" || p.scene === "P8c";

  // ---------- the cast ----------
  function freshPeople() {
    const out = {};
    for (const g of CAST.guests) {
      const dx = g.x - 480,
        dy = g.y - 450,
        d = Math.hypot(dx, dy) || 1;
      out[g.id] = { x: g.x, y: g.y, hx: g.x, hy: g.y, ax: (dx / d) * ALARM.backAway, ay: (dy / d) * ALARM.backAway * 0.6 };
    }
    return out;
  }
  // Where each person looks now (radians), by what the scene is doing.
  function faceOf(p, id, x, y) {
    const g = CAST.guests.find((q) => q.id === id);
    // After the topple everyone stares at where he stood (party-snacks.js); otherwise from P6 on each guest looks
    // where the free play turned them (walking, dancing, in the conga).
    if (late(p) && p.stare) return lookAt(x, y, p.stare.at);
    if (late(p) && p.people[id] && p.people[id].face != null) return p.people[id].face;
    if (p.mode === "isfred") return lookAt(x, y, { x: p.isfred.x, y: p.isfred.y - 40 });
    // Once the band plays (P3's end) the dancers are busy: the pairs look at each other, the robot at the octopus,
    // who eyes the snack bar, the glancer watches Isfred go to the bar, the camera tourist films the band. In P4 the
    // pairs and the glancer turn (P4_SWEEP below) and their cones sweep the floor on the way to the flyer.
    // (the camera turns back to the stage's middle for the party in disguise, as it always was there)
    // P4: the pairs turn on the spot and the glancer looks round (party-hall.js P4_SWEEP), so their cones sweep
    if (p.scene === "P4" && P4_SWEEP[id]) return sweepAngle(id, p.sweepT || 0);
    if (p.mode === "pairs" && !late(p) && id === "camera") return lookAt(x, y, BAND_AIM);
    if (p.mode === "pairs" && id === "octopus-guest") return lookAt(x, y, { x: PYRAMID.x, y: PYRAMID.y - 28 });
    if (p.mode === "pairs" && g && g.glancer) return lookAt(x, y, { x: p.isfred.x, y: p.isfred.y - 40 });
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
    // Turning, he takes the short way round, over the stage side of the room only (up and left, then left).
    let turn = look - stage;
    while (turn > Math.PI) turn -= Math.PI * 2;
    while (turn < -Math.PI) turn += Math.PI * 2;
    const mix = (k) => stage + turn * k;
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
    const stare = (x, y, a) => (late(p) && p.stare ? lookAt(x, y, p.stare.at) : a);
    const isf = p.isfred.face != null ? p.isfred.face : p.isfred.walking ? Math.atan2(CAST.isfredBar.y - p.isfred.y, CAST.isfredBar.x - p.isfred.x) : p.isfred.atBar ? Math.PI : Math.PI / 2;
    out.push(coneFrom("isfred", p.isfred.x, p.isfred.y, stare(p.isfred.x, p.isfred.y, isf), size));
    // While the band plays on the stage, the stage lights are in their eyes: no cones (Brian 2026-11-25, showing-5
    // note 1, a small exception to rule 8). Their cones come back when they step down for the group photo, and when
    // the music stops (the alarm).
    const blinded = p.lights && (p.band || p.scene === "P3" || bandOnStageForPhoto(p));
    p.bandOff || blinded || (p.bandAt || CAST.band).forEach((b, i) => out.push(coneFrom("band" + i, b.x, b.y, b.face != null ? b.face : stare(b.x, b.y, Math.PI / 2 + (i - 1) * 0.25), size)));
    const bt = p.bartenderAt || CAST.bartender;
    const btFace = bt.face != null ? bt.face : p.scene === "P4" ? sweepAngle("bartender", p.sweepT || 0) : stare(bt.x, bt.y, Math.PI);
    out.push(coneFrom("bartender", bt.x, bt.y, btFace, size));
    p.alarm && out.push(...guardCones(p.alarm, size));
    // During the alarm the witness has left his spot: his cone goes with him (he is looking at the alarm).
    if (p.alarm) {
      const w = out.find((c) => c.id === p.alarm.w.id);
      w && Object.assign(w, coneFrom(w.id, p.alarm.w.x, p.alarm.w.y, lookAt(p.alarm.w.x, p.alarm.w.y, HALL.alarm), size));
    }
    return out;
  }
  // The guest standing nearest Squatch: { id, x, y }.
  function nearestGuest(p, s) {
    let best = null;
    for (const g of CAST.guests) {
      const at = p.people[g.id],
        d = Math.hypot(at.x - s.x, at.y - s.y);
      (!best || d < best.d) && (best = { id: g.id, x: at.x, y: at.y, d });
    }
    return best;
  }
  const personAt = (p, id) => {
    if (p.alarm && p.alarm.w.id === id) return p.alarm.w;
    if (p.people[id]) return p.people[id];
    if (id === "isfred") return p.isfred;
    if (id === "bartender") return p.bartenderAt || CAST.bartender;
    if (id.startsWith("band")) return (p.bandAt || CAST.band)[+id.slice(4)];
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
      flyer: "",
      seenBy: "",
      seenT: 0,
      alarm: null,
      vent: null,
      outfit: (P() && P().outfit) || dress.newOutfit(),
      sceneT: 0,
      ...(extra || {}),
    };
  }
  const bandOn = (p) => ((p.lights = true), (p.band = true), (p.mic = true), (p.bandOff = false), (p.mode = "pairs"), (p.isfred = { x: CAST.isfredBar.x, y: CAST.isfredBar.y, atBar: true }));
  function startScene(id, opts = {}) {
    const e = E();
    closeFullScreen();
    e.forgetSaved();
    e.set("act", null);
    if (id === "P1") {
      const p = base("P1", { phase: "home", bandOff: true });
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
      save(base("P2", { phase: "sneak", bandOff: true }));
      inHall();
      e.place("sq", SPOTS.doorway.x, SPOTS.doorway.y);
      e.face("sq", -1);
      e.set("sqPose", "stand");
      chip("chip-plant");
      control(true);
      return;
    }
    if (id === "P3") {
      const p = base("P3", { phase: "watch", pose: "hidden", hideAt: "middle", bandOff: true });
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
        // his worry, while the banner still glows; then the flyer in Isfred's hand glows (Brian 2026-11-25:
        // "Worry in the hall, shown at home")
        say("sq", "sq-robots-job", "whisper"),
        e.run(() => ((P().glow = 0), (P().flyerGlow = true))),
        say("sq", "sq-show-mops", "whisper"),
        say("official", "isfred-band"),
        e.run(() => {
          const q = P();
          // Isfred has announced alone; now the Croc Boys walk on from the stage's left end and take their places
          // (tick), and only then play (Brian 2026-11-25: "Shouldn't he be doing announcement alone and then have
          // them join?")
          q.lights = true;
          q.bandOff = false;
          q.bandAt = bandOffStage();
          // he walks off to the bar, and on the way sets his flyer down (tick)
          q.isfred = { x: CAST.isfred.x, y: CAST.isfred.y, walking: true, wt: 0 };
          q.pt = 0;
          sound.one("cheer");
          sound.one("dim");
        }),
        // the Croc Boys walk on, Isfred sets the mic stand in front of the singer, then the flyer down at the bar
        // (party-stage-walks.js), and a beat to see it all (Brian 2026-11-26: "Take a moment for us to see what's happening")
        e.until(() => !P() || (!P().isfred.walking && !P().bandAt)),
        e.until((dt) => !P() || (P().see = (P().see || 0) + dt) >= PACE.see),
        // they start to play, and the wordless close-up of the singer bopping to the first notes (croc-cutaway.js;
        // it plays by itself, rule 3), then back to the hall: the guests pair off and dance
        e.run(() => {
          const q = P();
          q.band = true;
          q.mode = "pairs";
          q.bandT = 0;
        }),
        ...cutawaySteps("croc"),
        say("band", "band-song", "song"),
        e.run(() => ((P().pt = 0), (P().follow = true))),
        e.until(() => !P() || P().pt >= PACE.watch),
        // watching them dance, before the flyer sneak (Brian 2026-11-26: put it back where it was before the dance)
        say("sq", "sq-dance-wish", "whisper"),
        e.run(() => startScene("P4")),
      ]);
      return;
    }
    if (id === "P4") {
      // (a restart puts the flyer back on the counter, whether or not he had it)
      const p = base("P4", { phase: "home", pose: "hidden", hideAt: "middle", flyer: "stage" });
      bandOn(p);
      save(p);
      inHall();
      hideIn("middle");
      chip("chip-flyer");
      control(true);
      return;
    }
    if (id === "P6") {
      // Walking in after the dress-up, or a restart just inside his door: the hall as P4 left it (lights down,
      // the band playing, Isfred at the bar, everyone where they danced), the song that was playing, his outfit.
      const was = P() || {};
      const p = base("P6", { phase: "free" });
      // Opened straight from a link (?beat=party:P6, tests) there is no dress-up yet: he wears a whole outfit.
      Object.values(p.outfit).some(Boolean) || (p.outfit = { ...JUMP_OUTFIT });
      bandOn(p);
      save(p);
      inHall();
      freePlay.start(p, { song: was.song, done: was.done, snacks: was.snacks, shot: was.shot, danceLevel: was.danceLevel, dancePay: was.dancePay });
      opts.restart && (e.place("sq", SPOTS.doorway.x, SPOTS.doorway.y), e.face("sq", 1));
      e.set("sqPose", "stand");
      chip("");
      control(true);
      return;
    }
    if (id === "P7") {
      // Restart: the alarm ringing, the guards coming in at the hallway doorway, Squatch on the dance floor with the
      // pieces he lost still gone.
      const was = P() || {};
      const p = base("P7", { phase: "run" });
      Object.values(p.outfit).some(Boolean) || (p.outfit = { ...JUMP_OUTFIT });
      bandOn(p);
      save(p);
      inHall();
      freePlay.start(p, { song: was.song, done: was.done, snacks: was.snacks, shot: was.shot, danceLevel: was.danceLevel, dancePay: was.dancePay });
      p.lostPieces = (was.lostPieces || []).slice();
      p.fallen = (was.fallen || []).slice();
      p.band = false;
      sound.song(-1);
      startAlarm(p, { id: "backpack", x: SPOTS.alarmRun.x, y: SPOTS.alarmRun.y }, "where-dance");
      p.alarm.w.hx = p.people.backpack.x;
      p.alarm.w.hy = p.people.backpack.y;
      p.alarm.phase = "ring";
      p.alarm.t = 0;
      e.place("sq", DANCE_SPOT.x, DANCE_SPOT.y + 10);
      e.set("sqPose", "stand");
      chip("chip-run");
      control(true);
      return;
    }
    if (id === "P8a" || id === "P8b" || id === "P8c") {
      const was = P() || {};
      const p = base(id, { phase: "end", flyer: "bed" });
      Object.values(p.outfit).some(Boolean) || (p.outfit = { ...JUMP_OUTFIT });
      bandOn(p);
      Object.assign(p, { lostPieces: (was.lostPieces || []).slice(), song: 2, done: was.done || {}, snacks: was.snacks || null, flying: [], fallen: (was.fallen || []).slice() });
      save(p);
      // "Keep going" from its start: under the bed, Mops in the room, the guard gone; then the talk
      if (id === "P8a") return afterAlarm.startKeep(p);
      // "Keep going" after going home early: at home in his costume, Mops not home yet
      if (id === "P8c") return homeEarly.startKeep(p);
      inHall();
      opts.restart && e.place("sq", DANCE_SPOT.x, DANCE_SPOT.y + 10);
      e.set("sqPose", "stand");
      return endings.startClosing(p);
    }
    if (id === "P5") {
      // the band plays on, heard muffled through his door
      const p = base("P5", { phase: "closet", flyer: "bed", outfit: dress.newOutfit() });
      // The hall as P4 left it (lights down, Isfred at the bar), so walking back in nobody jumps.
      bandOn(p);
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
    // A guard watching him step into the plant knows where he is: that hide does not count.
    p.alarm && (p.alarm.spotted = p.alarm.guards.some((g) => g.sees));
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
      e.until((dt) => (e.trail(), e.step("sq", HOME_ROOM.doorStep.x, HOME_ROOM.doorStep.y, PACE.walk, dt))),
      e.until((dt) => e.step("sq", HOME_ROOM.doorIn.x, HOME_ROOM.doorIn.y - 5, PACE.walk, dt)),
      e.run(() => {
        e.enterRoom("hall", "QA");
        e.place("sq", SPOTS.peek.x, SPOTS.peek.y);
        e.set("sqPose", "hidden");
        const p = P();
        p.phase = "peek";
        p.pose = "peek";
      }),
      e.run(() => sound.one("isfredMuffled")),
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
        sound.one("rustle");
        const p = P();
        p.seenBy = "";
        p.seenT = 0;
        // P2 with no alarm, in the middle plant: he made it; the welcome starts.
        if (p.scene === "P2" && !p.alarm && plantId === "middle") return startScene("P3");
        caught() || control(true);
      }),
    ]);
  }
  // HIDE · bed: he scurries to the bed and under it (nobody teleports).
  function hideUnderBed() {
    const e = E();
    control(false);
    e.queue([
      e.until((dt) => e.step("sq", HOME_ROOM.bed.x + 100, HOME_ROOM.bed.y + 40, PACE.scurry, dt)),
      e.run(() => {
        e.place("sq", HOME_ROOM.bed.x, HOME_ROOM.bed.y);
        e.set("sqPose", "under");
        P().pose = "bed";
        sound.one("underBed");
        caught() || control(true);
      }),
    ]);
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
        e.place("sq", HOME_ROOM.doorIn.x, HOME_ROOM.doorIn.y);
        e.face("sq", -1);
      }),
      // Running from the alarm he runs well into the room; on his way home he stops just inside.
      e.until((dt) => (P().alarm ? e.step("sq", HOME_ROOM.runTo.x, HOME_ROOM.runTo.y, PACE.scurry, dt) : e.step("sq", HOME_ROOM.inside.x, HOME_ROOM.inside.y, PACE.walk, dt))),
      e.run(() => {
        const q = P();
        if (q.alarm) return ((q.phase = "hiding"), caught() || control(true));
        // P7 with the hall already calm: through his door a guard follows a moment later all the same
        if (q.scene === "P7") return afterAlarm.follow(q);
        flyerHome();
      }),
    ]);
  }
  // GRAB · flyer: he turns to the counter's end and takes the flyer in his paw; then his door is the goal.
  function grabFlyer() {
    const e = E();
    control(false);
    e.walkOff();
    // (the flyer is on the counter, to his right)
    e.face("sq", 1);
    P().grab = 0;
    sound.one("fwip");
    e.queue([
      e.until(() => !P() || P().grab == null || P().grab >= 1),
      e.run(() => {
        const q = P();
        if (!q) return;
        q.grab = null;
        q.flyer = "paw";
        q.flyerGlow = false;
        // (an alarm that began just before the grab keeps its own chip)
        q.alarm || chip("chip-home");
        caught() || control(true);
      }),
    ]);
  }
  // Home with the flyer (P4's end; Brian 2026-11-25, showing-5 note 2): "Phew, made it!", then his bed glows and
  // the chip asks him to put the flyer on it for Mops; SAVE · flyer at the bed lays it on top (Brian 2026-11-26, #42);
  // then he thinks about the party, and the closet is next (P5). The party's music keeps coming through his
  // doorway the whole time. Also where the calm after hiding at home hands back when he has the flyer.
  function flyerHome() {
    const e = E();
    control(false);
    e.queue([
      say("sq", "sq-phew", "whisper"),
      e.run(() => {
        const q = P();
        q.phase = "save";
        chip("chip-save-flyer");
        caught() || control(true);
      }),
    ]);
  }
  // SAVE · flyer: he walks to the bed's front corner and lays the flyer on top of it.
  function saveFlyer() {
    const e = E();
    control(false);
    chip("");
    P().phase = "saving";
    e.walkOff();
    e.queue([
      e.until((dt) => (e.trail(), e.step("sq", HOME_ROOM.saveAt.x, HOME_ROOM.saveAt.y, PACE.walk, dt))),
      e.run(() => {
        const q = P();
        e.still("sq");
        e.face("sq", -1);
        q.flyer === "paw" && ((q.flyer = "down"), (q.put = 0), sound.one("fwip"));
      }),
      e.until(() => !P() || P().put == null || P().put >= 1),
      e.run(() => {
        const q = P();
        q.put = null;
        q.flyer = "bed";
      }),
      say("sq", "sq-party-fun", "whisper"),
      say("sq", "sq-sneak-back", "whisper"),
      e.run(() => startScene("P5")),
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
      // Holding ↺ restarts the dress-up with nothing on (the page's ↺ is under the full-screen view).
      restart: () => e.restartPart(),
      draw(ctx, w, h, t) {
        const L = dress.layout(w, h);
        if (dress.meter(st.outfit) >= 1 && !t0.full) ((t0.full = true), (t0.tada = 0.001), sound.one("tada"));
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
      e.until((dt) => (e.trail(), e.step("sq", HOME_ROOM.doorIn.x, HOME_ROOM.doorIn.y - 4, PACE.walk, dt))),
      e.run(() => {
        e.enterRoom("hall", "QA");
        e.place("sq", HALL_DOOR.x, 636);
        e.face("sq", 1);
      }),
      e.until((dt) => e.step("sq", 480, 560, PACE.walk, dt)),
      e.run(() => startScene("P6")),
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
    p.grab != null && (p.grab = Math.min(1, p.grab + dt / FLYER.grab));
    p.put != null && (p.put = Math.min(1, p.put + dt / FLYER.put));
    moveTufts(p, dt);
    const s = sq(),
      inHallNow = e.room() === "hall";
    // Isfred's walk to the bar, the Croc Boys walking on, P4's clock (party-stage-walks.js)
    tickStageWalks(p, dt, sound);
    if (p.scene === "P2" && !p.alarm) {
      const before = glancePhase(p).phase;
      p.gt += dt;
      const after = glancePhase(p).phase;
      before !== "warn" && after === "warn" && sound.one("hm");
    }
    // In a plant, the kid steering steps him out of it (P2's back plant, P4, or after a search).
    const free = e.get("ctrl") && !e.current();
    const sneak = p.scene === "P2" || p.scene === "P4" || p.scene === "P6" || p.scene === "P7";
    if (free && p.pose === "hidden" && inHallNow && sneak && e.steering()) {
      p.pose = "stand";
      e.set("sqPose", "stand");
    }
    if (free && p.pose === "bed" && !p.alarm && e.steering()) ((p.pose = "stand"), e.set("sqPose", "stand"));
    // Anything else that stood him up (the game's own walk out of a hiding place) counts as stepping out too.
    if (free && p.pose === "hidden" && inHallNow && e.get("sqPose") === "stand" && sneak) {
      p.pose = "stand";
    }
    // Sight: whoever's cone holds him shows "?", then "!" if he stays too long, and the alarm starts.
    if ((p.scene === "P2" || p.scene === "P4") && inHallNow && !p.alarm) {
      // A cone of someone who can raise the alarm wins over Isfred's or the band's (who only show "?").
      const all = free && p.pose === "stand" ? cones(p).filter((c) => coneSees(c, s)) : [];
      const seen = all.find((c) => WITNESS[c.id]) || all[0] || null;
      if (!seen) ((p.seenBy = ""), (p.seenT = 0));
      else {
        p.seenT = p.seenBy === seen.id ? p.seenT + dt : 0;
        p.seenBy = seen.id;
        // Guests and the bartender run to the alarm (the lockup card names which). Isfred and the band stay on the
        // stage: when one of them stares at him too long, the guest nearest Squatch turns, sees him too and runs
        // (nobody "randomly doesn't care", review rule 19; the card stays right: a tourist saw him).
        if (p.seenT >= SEEN_TOO_LONG_SECONDS) {
          const id = WITNESS[seen.id] ? seen.id : nearestGuest(p, s).id,
            w = personAt(p, id);
          startAlarm(p, { id, x: w.x, y: w.y }, "where-hall", WITNESS[id]);
          raise(p);
        }
      }
      // The vent: too close without a disguise, fur goes in and the nearest guest sees it.
      const v = tickVent(p, dt, s, free && p.pose === "stand");
      // the vent's pull: a rising rush of air, never a squeak (party-board-sounds.js suction)
      v === "warn" && sound.one("suction");
      if (v === "fur") {
        sound.one("suckIn");
        startAlarm(p, nearestGuest(p, s), "where-vent");
        raise(p);
      }
    }
    // The party's music: the Croc Boys from the band's first song (P3) until the alarm or closing time, muffled
    // through his door whenever he is at home (the sound plan, 2026-11-24); silent while the alarm rings.
    // Which track: party-band-order.js (Funky Chunk, Stormtop-Sylvania while he dances). The octopus chase: the band
    // fades out and Run Amok plays until the chase ends (Brian 2026-11-26).
    const chaseNow = p.scene === "P6" && !p.alarm && e.room() === "hall" && chasing(p.oct);
    sound.song(!chaseNow && partyOnNow(p) ? bandTrackNow(p) : -1);
    sound.chase(chaseNow);
    sound.muffle(e.room() === "closet");
    // before the band plays: the party heard through his door at home, the crowd's murmur in the hall. The murmur is
    // off whenever the band plays (Brian 2026-11-25, showing-5 note 3: the swishing under the music).
    // the crowd (its recording, Brian 2026-11-26): whenever guests are in the hall, with the band or without it,
    // quietly under it; muffled through his door at home; quiet with the alarm, and gone once the hall has emptied
    sound.crowd(guestsInHall(p), e.room() === "closet");
    sound.tick();
    // the guards' boots, only while a guard in the room he is in actually walks (footfalls.js; footstep recordings)
    if (p.alarm) {
      const here = e.room() === "hall" ? p.alarm.guards.filter((g) => g.room === "hall") : p.alarm.homeGuard ? [p.alarm.homeGuard] : [];
      let boot = false;
      for (const g of here) footfall(g, g.x, g.y, dt, 0.45) && (boot = true);
      boot && sound.one("step");
    }
    // the band stops dead in each song's break and shouts its line (only in the hall, where the kid can see them)
    sound.takeBreak() && p.scene === "P6" && e.room() === "hall" && !e.current() && e.ambient("band", partyLine("band-song"), "song");
    // P6 to P8: the free play, the alarm's extras and the endings. Story lines pause it (rule 13 of the review
    // checklist: the game pauses until the tap); scripted walks do not.
    if (late(p)) {
      const cur = e.current(),
        paused = !!cur && ["bub", "card", "panel", "wait"].includes(cur.k);
      inHallNow && (p.scene === "P6" || p.scene === "P7") && freePlay.tick(p, dt, s, free, paused);
      // his own door takes him home early (party-home-early.js)
      if (inHallNow && p.scene === "P6" && !p.alarm && !paused && homeEarly.hallTick(p, s, free)) return;
      paused || endings.tick(p, dt, s, free);
      if (!live()) return;
    }
    late(p) && (afterAlarm.tick(p, dt), homeEarly.tick(p, dt));
    // the "?" marks: whoever is looking at him, the glancer's warning, the octopus about to grab (party-question.js)
    const showing = {};
    p.seenBy && (showing[p.seenBy] = p.seenT / SEEN_TOO_LONG_SECONDS);
    p.scene === "P2" && !p.alarm && glancePhase(p).phase === "warn" && (showing.glance = glancePhase(p).k);
    p.oct && p.oct.mode === "snacks" && p.oct.qT > 0 && (showing["octopus-guest"] = p.oct.qT / OCT.notice);
    tickQuestions(p, dt, showing);
    // (the game waits behind the "more to find" card)
    if (p.alarm && !p.card) {
      tickAlarm(p, dt, capture.api());
      // Running from the alarm: his doorway takes him home.
      if (P() && P().alarm && free && inHallNow && p.pose === "stand" && inHallDoorway(s) && p.alarm.phase !== "calm") walkHome();
      // (P4: only with the flyer in his paw; without it his doorway does nothing and the chip still says to grab it)
    } else if (((p.scene === "P4" && p.flyer === "paw") || p.scene === "P7") && free && inHallNow && p.pose === "stand" && inHallDoorway(s)) walkHome();
    if (p.scene === "P5" && p.phase === "out" && free && Math.hypot(s.x - HOME_ROOM.doorSpot.x, s.y - HOME_ROOM.doorSpot.y) < 40) walkToParty();
  }
  function raise(p) {
    const e = E();
    // the band stops dead: a record scratch (the alarm's bell takes over)
    p.band && sound.one("scratch");
    e.sfx("bleep");
    // the FUR! moment's sting, once (music-picks.js "caught")
    sound.sting();
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
    // (a doorway he walks into: the opening itself is the spot, the same box the walk-in uses, party-hall.js)
    const doorBox = (id, box) => ({ id, verb: "", cap: "", who: "sq", x: (box.x0 + box.x1) / 2, y: box.y0 + 6, r: (box.x1 - box.x0) / 2, box });
    if (p.scene === "P1" && p.phase === "home" && room === "closet")
      out.push({ id: "peek", verb: "PEEK", cap: partyLine("button-peek").split(" · ")[1], who: "sq", x: 890, y: 480, r: 160, thing: HOME_DOOR, f: peek });
    if ((p.scene === "P2" || p.scene === "P4") && room === "hall" && p.pose === "stand") {
      // P2: the plant is the goal (both plants hide him). P4: his door is the goal; the plants hide him only
      // while the alarm rings.
      p.scene === "P2" && out.push(plant("middle"), plant("back"));
      p.scene === "P4" && p.alarm && out.push(plant("middle"), plant("back"));
      p.alarm && out.push(doorBox("go-home", HALL_DOOR_OPENING));
    }
    // P4: the flyer on the bar counter's far end is the goal, even while he is still in the plant (stepping out is walking
    // there); GRAB · flyer is offered only within reach of it. With the flyer in his paw, his door is the goal.
    if (p.scene === "P4" && room === "hall" && !p.alarm) {
      const [verb, cap] = partyLine("button-grab-flyer").split(" · ");
      if (p.flyer === "stage" && p.grab == null) out.push({ id: "grab-flyer", verb, cap, who: "sq", x: FLYER.reach.x, y: FLYER.reach.y, r: FLYER.reach.r, thing: FLYER.box, f: grabFlyer });
      p.flyer === "paw" && out.push(doorBox("go-home", HALL_DOOR_OPENING));
    }
    // P4 at home with the flyer: SAVE · flyer at his bed (it glows: the goal outline)
    if (p.scene === "P4" && room === "closet" && p.phase === "save" && !p.alarm && p.flyer === "paw") {
      const [verb, cap] = partyLine("button-save-flyer").split(" · ");
      out.push({ id: "save-flyer", verb, cap, who: "sq", x: HOME_ROOM.saveAt.x, y: HOME_ROOM.saveAt.y, r: 700, thing: HOME_THINGS.bed, f: saveFlyer });
    }
    if (p.alarm && room === "closet" && p.pose !== "bed")
      out.push({ id: "hidebed", verb: "HIDE", cap: partyLine("button-hide-bed").split(" · ")[1], who: "sq", x: HOME_ROOM.bed.x, y: HOME_ROOM.bed.y, r: 700, thing: HOME_THINGS.bed, f: hideUnderBed });
    if (p.scene === "P5" && room === "closet" && p.phase === "closet")
      out.push({ id: "dress", verb: "OPEN", cap: partyLine("button-closet").split(" · ")[1], who: "sq", x: HOME_SPOTS.closet.x, y: HOME_SPOTS.closet.y, r: HOME_SPOTS.closet.r, thing: HOME_THINGS.closet, f: openCloset });
    if (p.scene === "P5" && room === "closet" && p.phase === "out") out.push(door("go-party", HOME_ROOM.doorSpot.x, HOME_ROOM.doorSpot.y, 36));
    // P6: the dance in the spotlight; once fur shows, the plants hide him again.
    if (p.scene === "P6" && room === "hall") {
      out.push(...freePlay.spots(p));
      p.pose === "stand" && furShows(p) && !p.dance && !p.snack && out.push(plant("middle"), plant("back"));
    }
    // P8b, closing time: after the speaker's line his door takes him home on his own (party-endings.js; Brian #50)
    p.scene === "P8b" && room === "hall" && p.close && !["cheer", "dim", "speak", "home"].includes(p.close.phase) && out.push(doorBox("go-home", HALL_DOOR_OPENING));
    // P8c (home early): OPEN · closet takes the costume off.
    out.push(...homeEarly.spots(p));
    // P7: both plants hide him while the alarm rings; his door is the way home, alarm or not.
    if (p.scene === "P7" && room === "hall" && p.pose === "stand") {
      p.alarm && out.push(plant("middle"), plant("back"));
      out.push(doorBox("go-home", HALL_DOOR_OPENING));
    }
    return out;
  }
  // The one thing outlined (only what the kid must go to next).
  function goalId(p, room) {
    if (!E().get("ctrl")) return "";
    if (p.alarm) return room === "closet" ? (p.pose === "bed" ? "" : "hidebed") : p.pose === "hidden" ? "" : "go-home";
    if (p.scene === "P1" && room === "closet") return "peek";
    if (p.scene === "P2" && p.pose === "stand") return "hide";
    if (p.scene === "P4" && room === "hall") return p.flyer === "paw" ? "go-home" : p.flyer === "stage" && p.grab == null ? "grab-flyer" : "";
    if (p.scene === "P4" && room === "closet") return p.phase === "save" && p.flyer === "paw" ? "save-flyer" : "";
    if (p.scene === "P5") return p.phase === "closet" ? "dress" : p.phase === "out" ? "go-party" : "";
    // P6 has no outlines ("Optional things: They discover them"); P7 after the search: home through his door.
    // P7 after the search (standing, or still hidden in a plant): home through his door is the next step
    if (p.scene === "P7" && room === "hall") return "go-home";
    // home early: the closet, while he still has his costume on and Mops is not home yet
    if (p.scene === "P8c" && homeEarly.spots(p).length) return "undress";
    return "";
  }

  /** The people and things feet cannot walk through in the hall. */
  function solids() {
    const p = live();
    if (!p) return [];
    // (a person's feet take up 40% more floor since everyone in the hall grew, Brian 2026-11-24)
    const feet = (x, y) => ({ x0: x - 25, x1: x + 25, y0: y - 14, y1: y + 8, person: 1 }),
      gone = (p.close && p.close.gone) || {};
    // From P6 on, the floor strip from the bar's top end to the hallway doorway is open (he can head for it).
    const fixed = late(p) ? [...HALL_SOLIDS.filter((b) => !(b.x0 === HALLWAY_LANE.x0 && b.y0 === 0)), { ...HALL_SOLIDS.find((b) => b.x0 === HALLWAY_LANE.x0 && b.y0 === 0), y0: HALLWAY_LANE.y1 }] : HALL_SOLIDS;
    const people = Object.entries(p.people).filter(([id, g]) => !gone[id] && g.task !== "conga" && !(p.oct && ["chase", "hug", "lunge", "ready"].includes(p.oct.mode) && id === "octopus-guest"));
    // Isfred (by the bar's top end from P3 on) and Mops at closing time are solid too: nobody stands inside anybody
    const more = [gone.isfred ? null : p.isfred, p.mops].filter(Boolean);
    return [...fixed, ...people.map(([, g]) => feet(g.x, g.y)), ...more.map((g) => feet(g.x, g.y))];
  }

  // ---------- the pieces ----------
  const helpers = { E, P, sq, say, chip, control, startScene, picture, homeRoom: HOME_ROOM, homeThings: HOME_THINGS, pace: PACE, firstAlarm, homeDoor: HOME_DOOR, sound, afterAlarm: () => afterAlarm, flyerHome: () => flyerHome() };
  const capture = createCapture(helpers);
  const freePlay = createFreePlay({
    ...helpers,
    cones,
    nearestGuest,
    personAt,
    witness: WITNESS,
    raise,
    sound,
    guests: bridge.guests,
    // Closing time from P6 goes on from the hall as it is (nobody jumps); a restart of P8b starts it fresh.
    toClosing: () => {
      closeFullScreen();
      endings.startClosing(P());
    },
  });
  const endings = createEndings({
    ...helpers,
    sound,
    // Both endings hand over to beat 20 (the TV story) as today; the party night is over.
    finish: () => finish(),
  });
  const finish = () => {
    sound.stop();
    save({ scene: "done", outfit: P() && P().outfit, snacks: snackRecord(P() && P().snacks) });
    E().tvStory();
  };
  const afterAlarm = createAfterAlarm({ ...helpers, guests: bridge.guests, finish, resume: (p) => freePlay.resume(p), homeEarly: () => homeEarly });
  const homeEarly = createHomeEarly({ ...helpers, resume: (p) => freePlay.resume(p) });
  const views = createView({ ...helpers, guests: bridge.guests, cones, glancePhase, personAt, spots, goalId });
  const eyesAt = (p, t) => views.eyesAt(p, t);
  const seenByNow = (p) => p.seenBy;

  return {
    /** "That evening…": the party night begins (P1). */
    start() {
      firstAlarm.seen = false;
      save(null);
      startScene("P1");
    },
    /** Opens a scene straight away (the localhost ?beat=party:P3 link, and tests). */
    jump(scene) {
      firstAlarm.seen = false;
      save(null);
      startScene(scene || "P1", { restart: true });
    },
    /** True while a party scene is on (P1 to P8). */
    active() {
      return !!live();
    },
    /**
     * The older program's music cue while the party is on (music-picks.js): "sneak" for P2's sneak to the plant (no
     * band yet; in P4 the band plays, and its song wins), "home" for the talk at home after the party (P8a to P8c, no
     * alarm), otherwise "" (the party's own sounds: the band, the crowd, the party through his door).
     */
    /** True while the one capture rule's alarm is on at the party (FUR! to the calm): no music then (bridge.js). */
    alarmOn() {
      const p = live();
      return !!(p && p.alarm);
    },
    /** The party's state now (its alarm's music quiet ends when this is a new one: a restart). */
    alarmKey() {
      return live() || null;
    },
    musicCue() {
      const p = live();
      if (!p || p.alarm) return "";
      if (p.scene === "P2" && E().room() === "hall" && !p.band) return "sneak";
      // (home early, the party still on: the band through his door, not the home music)
      if ((p.scene === "P8a" || p.scene === "P8b" || p.scene === "P8c") && E().room() === "closet" && !partyOnNow(p)) return "home";
      return "";
    },
    /** The guest saying a guest's line now (party state `talker`), or "" (speech-voice.js, each guest's voice). */
    talker() {
      const p = live();
      return (p && p.talker) || "";
    },
    /** The locked hall picture this beat draws the hall on (goal outlines are traced from it), or null. */
    roomPicture() {
      return live() && E().room() === "hall" ? picture : null;
    },
    /** True while this beat draws the room on screen (the hall). */
    ownsRoom() {
      return !!live() && E().room() === "hall";
    },
    /** The scene, its phase, and what the tests read. */
    now() {
      const p = live();
      if (!p) return null;
      const out = { isfred: { x: Math.round(p.isfred.x), y: Math.round(p.isfred.y), walking: !!p.isfred.walking, bend: p.isfred.bend || 0 }, flyerGlow: !!p.flyerGlow, bannerGlow: p.glow || 0, bandState: p.bandOff ? "off" : p.bandAt && p.bandAt.some((b) => b.walk) ? "walking" : "on", bandPlaying: !!p.band, bandAt: p.bandAt ? p.bandAt.map((b) => ({ x: Math.round(b.x), y: Math.round(b.y) })) : null, grab: p.grab == null ? null : p.grab, put: p.put == null ? null : p.put, scene: p.scene, phase: p.phase, pose: p.pose, alarm: p.alarm ? p.alarm.phase : "", seenBy: seenByNow(p), glance: p.scene === "P2" ? glancePhase(p).phase : "", outfit: { ...p.outfit }, flyer: p.flyer, tufts: ventTufts(p), eyes: p.pose === "hidden" ? eyesAt(p, 0) : null, lost: !!p.lost, sound: sound.debug() };
      return late(p) ? { ...out, ...lateState(p, { scale: E().hallSizes().squatch, guardTall: views.homeGuardHeight() }) } : out;
    },
    /** The outfit he chose. */
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
    drawRoom(ctx) {
      const p = live();
      return p ? views.drawRoom(ctx, p) : false;
    },
    draw(ctx) {
      const p = live();
      p && views.draw(ctx, p);
    },
    /** A finger in the snack close-up (game positions): true when the close-up took it. */
    pointer(kind, x, y) {
      const p = live();
      return !!p && freePlay.pointer(p, kind, x, y);
    },
    /** True while the snack close-up is open (taps go to it). */
    cutOpen() {
      const p = live();
      return !!(p && p.snack);
    },
    solids,
    bounds() {
      return BOUNDS;
    },
    /** Where a speaker's bubble points (Isfred beside him, the band, Squatch's eyes in the plant, the wall speaker). */
    speakerAt(who) {
      const p = live();
      // the guard who followed him home: over his head (the home room draws him big)
      if (p && who === "guard" && E().room() === "closet" && p.alarm && p.alarm.homeGuard) return { x: p.alarm.homeGuard.x, y: p.alarm.homeGuard.y - views.homeGuardHeight() - 6 };
      if (!p || E().room() !== "hall") return null;
      const adult = E().hallSizes().adult;
      if (who === "official") return { x: p.isfred.x, y: p.isfred.y - adult - 6 };
      if (who === "band") return { x: CAST.band[1].x, y: CAST.band[1].y - adult - 6 };
      if (who === "sq" && p.pose === "hidden") return eyesAt(p, 0);
      if (who === "sq" && p.pose === "peek") return { x: SPOTS.peek.x, y: 590 };
      // in the snack close-up only his paw shows: his thought sits over it
      if (who === "sq" && p.snack) return { x: p.snack.paw.x, y: p.snack.paw.y - 60 };
      if (who === "pa") return { x: HALL_SPEAKER.x0, y: (HALL_SPEAKER.y0 + HALL_SPEAKER.y1) / 2 };
      if (who === "tourist" && p.talker && p.people[p.talker]) return { x: p.people[p.talker].x, y: p.people[p.talker].y - adult - 6 };
      if (who === "bartender") return p.snack ? { x: CUT.bartender.x, y: CUT.bartender.y - CUT.bartender.h - 6 } : { x: (p.bartenderAt || CAST.bartender).x, y: (p.bartenderAt || CAST.bartender).y - adult - 6 };
      return null;
    },
    /**
     * The box a bubble's tail ends in (bubble-tail.js): the speaker's head, the plant he hides in, his head in the
     * doorway gap, his paw in the snack close-up, the wall speaker. Null where the older program knows its speaker.
     */
    speakerBox(who) {
      const p = live(),
        at = this.speakerAt(who);
      if (!p || !at) return null;
      if (who === "sq" && p.pose === "hidden") return HALL.plants.find((q) => q.id === (p.hideAt || "middle")).leaves;
      if (who === "pa") return HALL_SPEAKER;
      if (who === "sq" && p.pose === "peek") return { x0: HALL.homeDoor.x0, x1: HALL.homeDoor.x1, y0: HALL.homeDoor.y0 - 20, y1: HALL.homeDoor.y1 };
      if (who === "sq" && p.snack) return { x0: at.x - 24, x1: at.x + 24, y0: at.y + 30, y1: at.y + 90 };
      // a person: `at` is just over the head; the head is the top fifth of a grown-up's height
      // (at home only the guard who followed him has a box here: the home room draws him big)
      const adult = E().room() === "hall" ? E().hallSizes().adult : views.homeGuardHeight(),
        r = adult * 0.14;
      return { x0: at.x - r, x1: at.x + r, y0: at.y + 6, y1: at.y + 6 + adult * 0.22 };
    },
    /** The name over a party speaker's bubble the game has no name for (the band), or "". */
    speakerName(who) {
      // The bartender's tag is the LOCKUP card's approved "The bartender" (listed for Brian to confirm as a tag).
      // The guard's tag is the LOCKUP card's approved "A guard", used the same way.
      return !live() ? "" : who === "band" ? partyLine("tag-band") : who === "bartender" ? partyLine("who-bartender") : who === "guard" ? partyLine("who-guard") : "";
    },
    /** A bubble that sits beside its speaker instead of over them (Isfred's never covers the banner). */
    bubbleBeside(who) {
      const p = live();
      if (!p || E().room() !== "hall") return null;
      const adult = E().hallSizes().adult;
      if (who === "official") return { x0: p.isfred.x - 16, x1: p.isfred.x + 16, y0: p.isfred.y - adult, y1: p.isfred.y, side: "right" };
      if (who === "band") return { x0: CAST.band[0].x - 20, x1: CAST.band[2].x + 20, y0: CAST.band[0].y - adult, y1: CAST.band[0].y, side: "right" };
      // the wall speaker's closing line: to its left, below the banner (never over its words)
      if (who === "pa") return { ...HALL_SPEAKER, y0: BANNER.y1 + 40, side: "left" };
      // the camera tourist's "Say cheese!" sits to his left, clear of the row
      if (who === "tourist" && p.talker === "camera") return { x0: p.people.camera.x - 16, x1: p.people.camera.x + 16, y0: p.people.camera.y - adult, y1: p.people.camera.y, side: "left" };
      return null;
    },
    /** Tests: the dress-up's pieces (with how wide each is drawn), body spots and Squatch, in page pixels, while it is open. */
    dressTargets() {
      const p = live(),
        o = fullScreenOpen();
      if (!p || !p.dress || !o) return null;
      const L = dress.layout(o.size().w, o.size().h);
      return {
        pieces: L.slots.filter((s) => !dress.worn(p.dress.outfit, s.id)).map((s) => ({ id: s.id, x: s.x, y: s.y, w: s.w })),
        sq: { x: L.sq.x, y: L.sq.y, scale: L.sq.scale },
        spots: Object.fromEntries(dress.SPOT_NAMES.map((n) => [n, dress.spotAt(L, n)])),
        go: dress.meter(p.dress.outfit) >= 1 ? { x: L.go.x + L.go.w / 2, y: L.go.y + L.go.h / 2 } : null,
        // the shirt glows until it is on his body (dress-up.js MUST_WEAR)
        shirtGlows: !dress.shirtOn(p.dress.outfit),
        meter: dress.meter(p.dress.outfit),
        outfit: { ...p.dress.outfit },
      };
    },
    /** Tests and the robot: the "more to find" card's buttons on the screen, while it is up; and pressing one. */
    cardTargets() {
      return live() ? afterAlarm.cardTargets() : null;
    },
    /** Tests that tick the game themselves (no finger): answers the card, "back" or "keep". */
    cardChoose(id) {
      const p = live();
      p && p.card && afterAlarm.choose(p, id);
    },
    /** Tests: where the flyer is drawn now ({ x, y, size }), or null. */
    flyerAt() {
      const p = live();
      return p ? views.flyerAt(p) : null;
    },
    /** Tests: the cones now, with their people. */
    cones() {
      const p = live();
      return p ? cones(p) : [];
    },
    /**
     * What the party remembers about the snacks, for Day 2: { all (he took every snack), left (how many are still
     * on the bar), bag (how many he took), toppled (the pile fell) }. It stays readable after the party is over.
     */
    snackRecord() {
      const p = P();
      return snackRecord(p && p.snacks);
    },
    /** The line for the end of Chapter 1 when he took every snack at the party ("Snack Bandit"), or "". */
    snackHonor() {
      const p = P();
      return snackRecord(p && p.snacks).all ? partyLine("honor-snack-bandit") : "";
    },
    /** Tests: what the snack close-up drew last frame (its sleeve's middle line, the bartender's view), or null. */
    snackDrawn() {
      return P() ? views.snackDrawn() : null;
    },
    /** Tests: where he stands at the snack bar, and the snack close-up's layout (game positions). */
    snackLayout() {
      return { spot: SNACK_SPOT, cut: CUT };
    },
  };
}
