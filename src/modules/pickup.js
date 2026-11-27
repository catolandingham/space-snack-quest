/**
 * Pickup day, Chapter 1 beats 53 to 61, built from the story pass for beats 53 to 61 (2026-11-26, Snack Quest Chat; its
 * CHANGED and NEW lines are pending until Brian says yes as he watches; its eight questions are open, and pick A of each
 * is built as a placeholder: pickup-lines.js marks the lines that hang on one with `q`). It follows the escape (beat 52:
 * escape.js hands over here with Squatch asleep the night before) and hands over to Chapter 2 (the older program's
 * chapter end: the tally card, then the Gas Stop).
 *   53   READ · note: the Guardian note on his pillow (the one the player wrote in the vent), close; "They know!";
 *        OPEN · box: the Guardian Box close, a pink corner under the old notes; PACK · note covers it ("Safe.");
 *        the player is Mops (announced): he wipes the fur out of the crate bed with his beard (MOP · crate, a walk), one
 *        long white hair left behind, held close; Squatch again: PACK · box, PACK · bucket, the things off the walls
 *        (pale squares), "It looks so empty.", the ship's PA, PUT ON · label, GET IN · crate; the player is Mops:
 *        PUSH · pallet through the hall and the hallway to the mail room (a bump: "Oof!", a guest's "?", his bleat).
 *   54   Squatch in the crate: the view through a slat (his eyes in the corner); the new robots roll down the ramp
 *        ("NO FUR. PROCEED."), "NEW ROBOTS. NEW RULE." ... they open the first thing in the row, a mail bag: "FUR. STOP.",
 *        Lou's hat; his thoughts.
 *   55   the player is Mops: walk to the crate, KNOCK · crate, BLEAT · robot from the opening (the robots turn to him);
 *        Squatch: CLIMB OUT · crate, ROLL · ball or sneak (the robots' cones; the one capture rule), HIDE · plant; from
 *        the plant the robots open his crate: one white hair, "GOAT HAIR. PROCEED.", it goes up the ramp; the idea in
 *        three thought pictures; he walks home (Mops behind him); "So make me a goat."
 *   56   the player is Mops: SNIP · beard, close (his GANITOR tag and its gold star at the edge); Squatch: the dress-up
 *        (beard, horns, the spare plain blue jacket: tap a piece, tap him; "Disguised enough"); BLEAT · Mops three times
 *        (a roar, closer, a bleat), "More bleat. Less roar."; the mirror inside the wardrobe door: "Two goats."
 *   57   the last walk out the front way: the hall's guests and the costume's rule (a dashed cone and "?", BLEAT · guest
 *        pops it; too long and the beard slips: PRESS · beard; fur in a cone too long, the LOCKUP card); LOOK · plate
 *        (optional: empty, crumbs); the hallway's PHOTO DAY door and its flash; TAKE · drawing (optional).
 *   58   the bay: the week's box comes down the ramp, PICK UP · box (Mops takes the mail); at the arch the robot's cone:
 *        "TWO GOATS?", BLEAT · robot; the player is Mops: GO · ship ("It's attached."), "GOAT. PROCEED."; Squatch:
 *        BOARD · scanner, the scan line down to the peeling beard, PRESS · beard, "HAIR..." "...PROBABLY." "PROCEED.";
 *        CLIMB · ramp, "Weent.", the beard in his paws under the camera's red light; the ship goes.
 *   59   the office (a cutscene): the frame close, the tripod and stool, Isfred's five lines; "Later that evening..."
 *   60   the tape screen: PLAY · tape, ZOOM · in (the paw), NEXT · tape, PLAY · tape, ZOOM · in (the star), ZOOM · in
 *        (the feet), Isfred's lines, "Get me that ship."
 *   61   the cargo hold: OPEN · box, BITE · cake ("No fizz."), the call, HIDE · crate, the lid lifts: "Found him.",
 *        "He's with me.", "Then you're both off."; the chapter's end (14-ch1-day2.js ch1ChapterEnd: the tally card, then
 *        Chapter 2's Gas Stop).
 * Its progress lives in the game-state field ch1Pickup, and ch1Step is "pk-<step>" at each step the player controls, so
 * the step restart (↺) brings back the step he is on; the steps he does not control go back to the last one he did
 * (PK_RESTART_TO). Words: pickup-lines.js; places and times: pickup-place.js; drawings: pickup-art.js. Every drawing and
 * number is a PLACEHOLDER for Brian.
 */
import { personBox, boxHit, addMovers, setCarry, addKeeper } from "./room-model.js";
import { pickupWords } from "./pickup-lines.js";
import { PK_HOME, PK_HALL, PK_HALLWAY, PK_BAY, PK_BAY_PICKUP, PK_BAY_GONE, PK_SIGHT, PK_PACE, PK_CRATE, ROUTE_PUSH, ROUTE_SNEAK, ROUTE_LAST, COSTUME, PK_OFFICE, PK_HOLD } from "./pickup-place.js";
import { drawPkTuft, drawHair, drawFloorPatch, drawPkCrate, drawBucket, drawMailBag, drawHat, drawNewRobotBits, drawScanLine, drawArchLight, drawCamera, drawKidDrawing, drawPaleSquare, drawFoldedNote, drawBoxCloseup, drawHairCloseup, drawSlatFrame, SLAT, drawIdea, drawSnipCloseup, drawDressCloseup, drawMirror, COSTUME_PIECES, DRESS, costumeSpotAt, drawPkPlate, drawPlateCloseup, drawPhotoSign, drawCrayonCloseup, drawTagBox, drawPeelCloseup, drawSlipCloseup, drawShipAway, drawPhotoCorner, drawTapeScreen, drawHold, drawBiteCloseup, drawLidView } from "./pickup-art.js";
import { OFFICE_PANELS } from "./escape-office-art.js";
import { escapeWords } from "./escape-lines.js";
import { drawPerson, LOOKS } from "./party-art.js";
import { drawGulpSweat } from "./escape-home-art.js";
import { ES_HOME, ES_DOORS, FOLLOW } from "./escape-place.js";
import { doorAt, doorTo, markDoor, freshTrail, followStep } from "./escape-doors.js";
import { markBox, blurBehind, drawHearts, drawPinnedBrochure, esWords } from "./escape-art.js";
import { drawNoteCloseup } from "./escape-vent-art.js";
import { MORNING_THINGS } from "./home-morning-art.js";
import { LUNCH_SOLIDS, LUNCH_BOUNDS } from "./lunch-sneak-place.js";
import { createGuestArt } from "./guests.js";
import { coneFrom } from "./party-watch.js";
import { BAY_SOLIDS, coneOnBody, watchTick, drawWatchCone, drawWatchMark, newGuard, guardTick, drawGuard } from "./bay-watch.js";
import { splitLine } from "./line-split.js";
import { partyLine } from "./party-lines.js";
import { adultPxFor } from "./room-sizes.js";

export const PICKUP_ID = "ch1-pickup";
// The steps the player controls (ch1Step "pk-<step>"), in order. (jump() takes these, and "start".)
export const PICKUP_STEPS = Object.freeze(["note", "box", "packnote", "mop", "pack", "bucket", "walls", "label", "getin", "push", "warn", "knock", "bleat", "climb", "sneak", "home", "snip", "dress", "practice", "lastwalk", "pickbox", "toscan", "botbleat", "goship", "board", "peel", "ramp", "tape", "cake", "bite", "hide"]);
// The steps where the stick drives Mops (the rest drive Squatch).
const PK_MOPS_STEPS = Object.freeze(["mop", "push", "warn", "knock", "bleat", "snip", "goship"]);
// Where a step the player does not control goes back to on ↺.
const PK_RESTART_TO = Object.freeze({
  wake: "note",
  noted: "note",
  boxed: "packnote",
  tomop: "packnote",
  mopped: "mop",
  emptied: "walls",
  inside: "getin",
  arrive: "push",
  slat: "push",
  knocked: "knock",
  bleated: "bleat",
  held: "sneak",
  idea: "sneak",
  athome: "home",
  tosnip: "snip",
  snipped: "snip",
  dresstalk: "dress",
  dressed: "practice",
  practiced: "practice",
  mirror: "practice",
  plate: "lastwalk",
  keepsake: "lastwalk",
  boxed58: "pickbox",
  seen58: "toscan",
  bleated58: "botbleat",
  claw: "goship",
  scanning: "board",
  proceed: "peel",
  climbing: "ramp",
  gone: "ramp",
  photo: "tape",
  taping: "tape",
  biting: "bite",
  call: "hide",
  found: "hide",
});
// The doorway walks: which route each walking step follows, and its goal line.
const PK_ROUTES = Object.freeze({ push: ROUTE_PUSH, home: ROUTE_SNEAK, lastwalk: ROUTE_LAST });
const PK_WALK_CHIP = Object.freeze({ push: "chip-push", home: "chip-sneak-home", lastwalk: "chip-last-walk" });

// How long his crate takes to slide from the mail room's opening into its place in the row (seconds). PLACEHOLDER.
const PK_SLIDE = 0.6;
export function createPickup(bridge) {
  const E = () => bridge.engine();
  const pic = (src) => (typeof Image !== "undefined" ? Object.assign(new Image(), { src }) : null);
  const pics = { pickup: pic(PK_BAY_PICKUP), gone: pic(PK_BAY_GONE) };
  const L = () => {
    const e = E();
    return e ? e.get("ch1Pickup") : null;
  };
  const live = () => {
    const l = L(),
      e = E();
    return l && e && l.step && l.step !== "done" ? l : null;
  };
  // The room model (room-model.js): while Mops pushes his crate, his walk keeps the crate's reach off things too, and
  // the crate's floor is checked with everyone else's.
  const pushing = () => {
    const l = live();
    return !!(l && l.step === "push" && l.crate === "push" && E().get("moPose") !== "hidden");
  };
  setCarry((who, room) => (who === "mops" && pushing() ? (PK_CRATE.w + PK_CRATE.ahead + 4) * crateK(room) - 25 : 0));
  addKeeper((who) => who === "mops" && pushing() && lastMops && keepCrateClear(L(), lastMops, lastMops.f || 1));
  addMovers(() => (pushing() ? [{ who: "crate", room: E().room(), ...pushedCrate(), box: crateFoot(pushedCrate()) }] : []));
  const guests = createGuestArt();
  let drew = null,
    record = { steps: [], sounds: [] },
    lastMops = null,
    moMoving = false,
    driving = "";

  // ---------- small helpers ----------
  const sfx = (name) => (record.sounds.push(name), E().sfx(name));
  const pick = (name) => (record.sounds.push(name), bridge.playSoundPick(name));
  const go = (step, extra) => {
    Object.assign(L(), { step, t0: 0 }, extra || {});
    record.steps.push(step);
  };
  const chip = (id) => (E().set("ch1Chip", id ? pickupWords(id) : ""), E().chipNow());
  const control = (chipId) => {
    const e = E();
    e.set("ch1Step", "pk-" + L().step);
    chip(chipId);
    e.set("ctrl", true);
  };
  const busy = () => {
    const e = E();
    e.set("ctrl", false);
    e.set("act", null);
    e.set("ch1Chip", "");
    e.still("sq");
    e.stopWalk && e.stopWalk();
    e.chipNow();
  };
  const sqScale = (room) => (adultPxFor(room || E().room()) * 0.8) / 45;
  const moScale = (room) => sqScale(room) * 1.15;
  const botK = () => adultPxFor("hangar") / 47;
  const wait = (s) => E().until((dt) => (L().t0 += dt || 0) >= s);
  const at = (p, q, r) => Math.hypot(p.x - q.x, p.y - q.y) <= r;
  // A line split into bubbles of a readable length (line-split.js), each waiting for NEXT. `ear`: overheard.
  function sayP(who, id, style, ear) {
    const e = E();
    return splitLine(pickupWords(id)).map((part) => e.say(who, part, style || "say", !!ear));
  }
  const by = (i) => E().run(() => (L().talker = i));
  const fresh = (extra) => ({
    step: "",
    t0: 0,
    cu: "",
    cuAt: -1,
    cover: 0,
    heartsAt: -1,
    tufts: PK_HOME.tufts.map(() => 0),
    packed: { box: false, bucket: false, label: false, top: false },
    walls: {},
    crate: "bed", // where his crate is: "bed" (home), "push", "row", "carry", "scan", "up", "ship"
    crateAt: null,
    hairOut: false,
    trail: null,
    route: "",
    waved: {},
    bump: { still: 0, at: -10, by: "" },
    robotRead: false,
    bots: [],
    things: null,
    hat: null,
    light: "",
    scan: null,
    talker: 0,
    guard: null,
    pose: "stand",
    faceT: 0,
    two: "row",
    ideaAt: -1,
    lidOpen: 0,
    roarAt: -1,
    crumbAt: -1,
    gulpAt: -1,
    scanSq: -1,
    place: "",
    box: null,
    claw: false,
    watch: null,
    fur: false,
    furT: 0,
    ...(extra || {}),
  });
  // The bay's row in the mail room: a mail bag, a crate, his crate third (pickup-place.js PK_BAY.row).
  const freshThings = () => Object.fromEntries(PK_BAY.row.map((r) => [r.kind, { x: r.x, y: r.y, where: "row", open: 0 }]));
  const robot = (id, kind, p, f) => ({ id, kind, x: p.x, y: p.y, f: f || -1, a: null, route: [], speed: PK_PACE.roll, carry: "", seenT: 0, mark: "", phase: "idle" });

  // ---------- beat 53: the note ----------
  /** The escape is over: Squatch asleep at home the night before pickup day (escape.js handOff hands over here). */
  function start() {
    const e = E();
    record = { steps: [], sounds: [] };
    e.set("ch1Pickup", fresh());
    busy();
    driving = "";
    e.playAs("squatch");
    e.set("ch1D", false);
    e.set("ch1Night", false);
    e.set("costumeOn", false);
    e.enterRoom("closet", "QB");
    e.set("wardrobe", "closed");
    e.set("sqPose", "sleep");
    e.place("sq", PK_HOME.bed.x, PK_HOME.bed.y);
    e.set("moPose", "stand");
    e.place("mops", PK_HOME.mops.x, PK_HOME.mops.y);
    e.face("mops", -1);
    go("wake");
    e.queue([
      wait(1.0),
      e.run(() => {
        e.set("sqPose", "stand");
        e.place("sq", PK_HOME.wake.x, PK_HOME.wake.y);
        e.face("sq", -1);
        go("note");
        control("chip-note");
      }),
    ]);
  }
  // READ · note: the note, close (the one the player wrote in the vent, in the same hand); his two lines; Mops's heart
  function readNote() {
    const e = E();
    busy();
    sfx("pickup");
    go("noted", { cu: "note", cuAt: e.time() });
    e.queue([
      e.tapWait(),
      e.run(() => (L().cu = "")),
      ...sayP("sq", "sq-know"),
      ...sayP("sq", "sq-not-mad"),
      e.run(() => ((L().heartsAt = e.time()), (L().t0 = 0))),
      wait(PK_PACE.hold + 0.6),
      e.run(() => {
        L().heartsAt = -1;
        e.set("wardrobe", "open");
        go("box");
        control("chip-box");
      }),
    ]);
  }
  // OPEN · box: the Guardian Box, close; one pink corner under the old notes
  function openBox() {
    busy();
    sfx("open");
    go("packnote", { cu: "box", cover: 0 });
    control("chip-box");
  }
  // PACK · note: the new note comes down on top and the pink is gone ("Safe."); Mops's two lines; the switch to Mops
  function packNote() {
    const e = E();
    busy();
    sfx("pickup");
    go("boxed", { cu: "box", cover: 0 });
    e.queue([
      e.until((dt) => (L().cover = Math.min(1, L().cover + (dt || 0) / 0.8)) >= 1),
      ...sayP("sq", "sq-safe", "whisper"),
      e.run(() => ((L().cu = ""), e.set("wardrobe", "closed"), go("tomop"))),
      ...sayP("mops", "mops-scanner"),
      ...sayP("mops", "mops-tuft"),
      e.run(() => asMops("switch-mop", () => (go("mop"), control("chip-mop")))),
    ]);
  }
  // The switch to Mops, announced ("You are MOPS now." and why), then `then` once the card is gone.
  function asMops(whyId, then) {
    const e = E();
    driving = "mops";
    e.playAs("mops", pickupWords(whyId));
    e.queue([e.run(then)]);
  }
  function asSquatch(whyId, then) {
    const e = E();
    driving = "";
    e.playAs("squatch", pickupWords(whyId));
    e.queue([e.run(then)]);
  }
  const tuftStand = (i) => ({ x: PK_HOME.tufts[i].x + PK_HOME.tuftStand, y: PK_HOME.tuftY });
  // MOP · crate: the next tuft is wiped when his beard passes it (he stands right of it, facing it)
  function mopTick(l) {
    const e = E(),
      m = e.pos("mops"),
      i = l.tufts.findIndex((v) => !v);
    if (i < 0) return;
    if (at(m, tuftStand(i), PK_HOME.tuftR)) {
      l.tufts[i] = 1;
      e.face("mops", -1);
      sfx("slurp");
      if (l.tufts.every(Boolean)) mopped();
    }
  }
  // all the fur is off: one long white hair is left on the wood, held close for a second; then Squatch packs
  function mopped() {
    const e = E();
    busy();
    go("mopped", { hairOut: true, cu: "hair", cuAt: e.time() });
    e.queue([
      wait(PK_PACE.hold),
      e.run(() => ((L().cu = ""), asSquatch("switch-pack", () => (e.place("sq", PK_HOME.crateAt.x, PK_HOME.crateAt.y), go("pack"), control("chip-pack"))))),
    ]);
  }
  function packBox() {
    busy();
    sfx("pickup");
    L().packed.box = true;
    go("bucket");
    control("chip-pack");
  }
  function packBucket() {
    busy();
    sfx("pickup");
    L().packed.bucket = true;
    go("walls");
    control("chip-walls");
  }
  // TAKE · <thing>: each thing off the wall leaves a pale square; when the walls are bare, their two lines and the PA
  function takeWall(id) {
    const e = E(),
      l = L();
    sfx("grab");
    l.walls[id] = 1;
    if (PK_HOME.walls.some((w) => !l.walls[w.id])) return;
    busy();
    go("emptied");
    e.queue([
      ...sayP("sq", "sq-empty"),
      ...sayP("mops", "mops-empty"),
      e.run(() => ((L().heartsAt = e.time()), (L().t0 = 0))),
      wait(1.0),
      e.run(() => (L().heartsAt = -1)),
      ...sayP("pa", "pa-ship", "pa", true),
      e.run(() => (go("label"), control("chip-label"))),
    ]);
  }
  function putLabel() {
    busy();
    sfx("grab");
    L().packed.label = true;
    go("getin");
    control("chip-get-in");
  }
  // GET IN · crate: he curls up beside the Box; Mops: "In you go." / "Not a sound."; the bucket on top; the push
  function getIn() {
    const e = E();
    busy();
    sfx("hide");
    e.set("sqPose", "hidden");
    // (inside the crate: off the picture, so no room draws him; his bubbles point at the crate: speakerAt)
    e.place("sq", -400, -400);
    go("inside");
    e.queue([
      ...bridgeWalk("mops", [{ x: PK_HOME.crateAt.x + 40, y: PK_HOME.crateAt.y + 40 }]),
      e.run(() => e.face("mops", -1)),
      ...sayP("mops", "mops-in"),
      ...sayP("mops", "mops-sound"),
      e.run(() => ((L().packed.top = true), sfx("grab"))),
      e.run(() => asMops("switch-push", startPush)),
    ]);
  }
  // A scripted walk of a few steps along `pts` (Mops never solid while he walks).
  function bridgeWalk(who, pts) {
    const e = E();
    return [
      ...pts.map((to) => e.until((dt) => (who === "mops" && e.moWalking(true), e.step(who, to.x, to.y, PK_PACE.walk, dt || 0)))),
      e.run(() => (who === "mops" && e.moWalking(false), e.still(who))),
    ];
  }
  // PUSH · pallet: the crate rolls out of the bed onto the floor, in front of Mops; the player walks him to the mail room
  function startPush() {
    const e = E(),
      l = L();
    l.crate = "push";
    e.place("mops", PK_HOME.pushFrom.x, PK_HOME.pushFrom.y);
    e.face("mops", 1);
    go("push", { route: "push" });
    control("chip-push");
  }

  // ---------- walking between rooms (the push, the sneak home) ----------
  function throughDoor(d) {
    const e = E(),
      l = L(),
      walker = driving === "mops" ? "mops" : "sq";
    const sq = e.pos("sq"),
      away = walker === "mops" && e.get("sqPose") === "hidden";
    away && e.place("sq", e.pos("mops").x, e.pos("mops").y);
    e.walkOff();
    away && e.place("sq", d.at.x, d.at.y);
    e.enterRoom(d.to, "QB");
    away && e.place("sq", sq.x, sq.y);
    e.set("ch1D", d.to === "hangar");
    e.place(walker, d.at.x, d.at.y);
    e.face(walker, d.f);
    if (walker === "sq" && e.get("moPose") !== "hidden") (e.place("mops", d.at.x - d.f * FOLLOW.gap, d.at.y), e.face("mops", d.f), (l.trail = freshTrail()));
    sfx("open");
  }
  const walking = (l) => l.step === "push" || l.step === "home" || l.step === "lastwalk";
  const routeOf = (l) => PK_ROUTES[l.step] || {};
  function walkTick(l, dt) {
    const e = E(),
      who = driving === "mops" ? "mops" : "sq",
      p = e.pos(who),
      room = e.room();
    if (who === "sq" && e.get("moPose") !== "hidden" && l.trail) {
      const to = followStep(l.trail, p, e.pos("mops"));
      e.moWalking(true);
      to ? e.step("mops", to.x, to.y, FOLLOW.speed, dt) : e.still("mops");
    }
    // 53: the push: guests wave at Mops; a bump; the hallway robot reads the label
    if (l.step === "push") pushTick(l, dt, room, p);
    // 57: the costume's rule in the hall; in the hallway, the photo-day door (a gulp if he saw the frame) and Mops's wall
    if (l.step === "lastwalk" && room === "hall") costumeTick(l, dt);
    if (l.step === "lastwalk" && room === "passage" && !l.hallwaySaid) {
      l.hallwaySaid = true;
      const es = e.get("ch1Escape");
      es && es.found && es.found.frame && ((l.gulpAt = e.time()), sfx("hide"));
      e.ambient("mops", pickupWords("mops-good-wall"));
    }
    if (l.step === "push" && room === "hangar" && at(p, PK_BAY.pushTo, PK_BAY.pushR)) return arriveRow();
    const d = doorAt(room, p);
    if (!d) return;
    if (l.step === "home" && d.to === "closet") return arriveHome(d);
    if (l.step === "lastwalk" && d.to === "hangar") return toBay(d);
    const route = routeOf(l);
    if (route[room] === d.to || route[d.to] === room) (throughDoor(d), control(PK_WALK_CHIP[l.step]));
  }
  function pushTick(l, dt, room, m) {
    const e = E(),
      t = e.time();
    if (room === "hall") {
      for (const g of PK_HALL.guests) if (!l.waved[g.id] && at(m, g, PK_HALL.hiNear)) ((l.waved[g.id] = 1), e.ambient("tourist", pickupWords("guest-hi")));
      // a bump: he steers and the crate does not move (a table leg, a spill, a guest in the way)
      const moved = lastMops && Math.hypot(m.x - lastMops.x, m.y - lastMops.y) > 0.3;
      l.bump.still = e.steering() && !moved ? l.bump.still + dt : 0;
      if (l.bump.still > 0.25 && t - l.bump.at > PK_HALL.bumpEvery) {
        const g = PK_HALL.guests.slice().sort((a, b) => Math.hypot(a.x - m.x, a.y - m.y) - Math.hypot(b.x - m.x, b.y - m.y))[0];
        Object.assign(l.bump, { at: t, by: g.id, still: 0 });
        sfx("pop");
        e.ambient("sq", pickupWords("crate-oof"));
        e.ambient("mops", pickupWords("mops-weent"));
        pick("mops-bleat");
      }
    }
    if (room === "passage" && !l.robotRead && at(m, PK_HALLWAY.robot, 200)) ((l.robotRead = true), e.ambient("robot", pickupWords("robot-label")));
  }
  // The crate is in the mail room, third in the row. Mops walks out; the player is Squatch, inside it (54).
  function arriveRow() {
    const e = E(),
      l = L();
    busy();
    sfx("grab");
    const c = pushedCrate();
    l.crate = "row";
    l.things = freshThings();
    // (one last shove: the crate slides from where he left it in the opening to its place in the row)
    l.slideHis = { x: c.x, y: c.y, t: 0 };
    l.bots = PK_BAY.oldLine.map((p, i) => robot("old" + i, "old", p, -1));
    e.face("mops", -1);
    go("arrive");
    e.queue([
      // (out along the front of the walkway, clear of the old robots' line and the open crate)
      ...bridgeWalk("mops", [PK_BAY.mailIn, { x: 600, y: 440 }, { x: 380, y: 440 }, { x: 200, y: 440 }, { x: 52, y: 430 }, PK_BAY.door]),
      e.run(() => {
        e.set("moPose", "hidden");
        e.place("mops", -400, -400);
        asSquatch("switch-crate", slatView);
      }),
    ]);
  }

  // ---------- beat 54: the robots open a crate (through a slat) ----------
  const moveTo = (b, to) => (b.route = [{ ...to }]);
  // a robot rolls along its route; true at its end. A thing it carries goes with it.
  function roll(b, dt) {
    const to = b.route[0];
    if (!to) return true;
    const d = Math.hypot(to.x - b.x, to.y - b.y);
    Math.abs(to.x - b.x) > 1 && (b.f = to.x < b.x ? -1 : 1);
    if (d <= b.speed * dt) ((b.x = to.x), (b.y = to.y), b.route.shift());
    else ((b.x += ((to.x - b.x) * b.speed * dt) / d), (b.y += ((to.y - b.y) * b.speed * dt) / d));
    return !b.route.length;
  }
  const bots = (...ids) => L().bots.filter((b) => ids.includes(b.id));
  // the new robots' carry of one thing from the row to the scan place under the arch
  function carrySteps(kind, ids) {
    const e = E(),
      th = () => L().things[kind];
    return [
      e.run(() => bots(...ids).forEach((b, i) => (b.route = [{ x: th().x - 40 + i * 80, y: th().y + 30 }]))),
      e.until((dt) => bots(...ids).map((b) => roll(b, dt || 0)).every(Boolean)),
      e.run(() => {
        th().where = "carry";
        bots(...ids).forEach((b, i) => (b.route = PK_BAY.carry.map((q) => ({ x: q.x - 30 + i * 60, y: q.y + 10 }))));
      }),
      e.until((dt) => {
        const bs = bots(...ids),
          done = bs.map((b) => roll(b, dt || 0)).every(Boolean);
        Object.assign(th(), { x: (bs[0].x + bs[1].x) / 2, y: (bs[0].y + bs[1].y) / 2 - 4 });
        return done;
      }),
      e.run(() => (Object.assign(th(), { where: "scan", ...PK_BAY.scanAt }), bots(...ids).forEach((b) => (b.a = -Math.PI / 2)))),
    ];
  }
  function scanSteps(color) {
    const e = E();
    return [
      e.run(() => (L().scan = { k: 0 })),
      e.until((dt) => (L().scan.k = Math.min(1, L().scan.k + (dt || 0) / PK_PACE.scan)) >= 1),
      e.run(() => ((L().scan = null), (L().light = color), sfx(color === "red" ? "bzzt" : "bleep"))),
    ];
  }
  // a thing goes up the ramp onto the ship
  function upRamp(kind) {
    const e = E(),
      th = () => L().things[kind];
    return [
      e.run(() => (th().where = "up")),
      e.until((dt) => {
        const t = th();
        t.y -= (dt || 0) * 90;
        return t.y <= PK_BAY.rampTop.y;
      }),
      e.run(() => ((th().where = "ship"), (L().light = ""))),
    ];
  }
  function slatView() {
    const e = E(),
      l = L();
    go("slat", { cu: "slat", cuAt: e.time() });
    e.set("ch1Ship", true);
    const nw = [robot("new0", "new", PK_BAY.rampTop, 1), robot("new1", "new", { x: PK_BAY.rampTop.x + 30, y: PK_BAY.rampTop.y + 10 }, 1)];
    l.bots.push(...nw);
    l.hat = { where: "bag" };
    e.queue([
      // the new robots roll down the ramp and through the arch
      e.run(() => bots("new0", "new1").forEach((b, i) => (b.route = [{ x: PK_BAY.rampFoot.x - 20 + i * 40, y: PK_BAY.rampFoot.y }, { x: 520 + i * 50, y: 470 + i * 20 }]))),
      e.until((dt) => bots("new0", "new1").map((b) => roll(b, dt || 0)).every(Boolean)),
      e.run(() => (L().light = "green")),
      ...sayP("scanner", "scan-no-fur", "say", true),
      e.run(() => (L().light = "")),
      by(3),
      ...sayP("robot", "bot-new-rule", "say", true),
      ...sayP("robot", "bot-scan-every", "say", true),
      by(0),
      ...sayP("robot", "bot-never", "say", true),
      by(3),
      ...sayP("robot", "bot-why-here", "say", true),
      // the first thing in the row: the big mail bag
      ...carrySteps("bag", ["new0", "new1"]),
      ...scanSteps("red"),
      ...sayP("scanner", "scan-fur-stop", "say", true),
      e.run(() => ((L().hat = { where: "claw" }), sfx("grab"))),
      by(3),
      ...sayP("robot", "bot-hat", "say", true),
      by(4),
      ...sayP("robot", "bot-fur-stop", "say", true),
      e.run(() => ((L().hat = { where: "bin" }), (L().light = ""), sfx("pop"))),
      ...upRamp("bag"),
      ...sayP("sq", "sq-look-inside", "whisper"),
      ...sayP("sq", "sq-all-fur", "whisper"),
      ...sayP("sq", "sq-that-was-me", "whisper"),
      e.run(warn),
    ]);
  }

  // ---------- beat 55: Mops warns him ----------
  function warn() {
    const e = E(),
      l = L();
    l.cu = "";
    // the new robots roll back for the next crate, cones forward
    bots("new0", "new1").forEach((b, i) => ((b.a = null), (b.route = [PK_BAY.carry[2], PK_BAY.carry[1], PK_BAY.botsBack[i]].map((q) => ({ ...q }))), (b.speed = 45)));
    e.set("moPose", "stand");
    e.place("mops", PK_BAY.door.x, PK_BAY.door.y + 60);
    e.face("mops", 1);
    asMops("switch-warn", () => (go("warn"), control("chip-warn")));
  }
  function knock() {
    const e = E();
    busy();
    sfx("key");
    go("knocked");
    e.queue([
      ...sayP("mops", "mops-get-out"),
      ...sayP("mops", "mops-opening"),
      e.run(() => (go("bleat"), control("chip-bleat-robot"))),
    ]);
  }
  // BLEAT · robot: the bucket lid's clang and his bleat; the robots turn to him and tell him off; Squatch's turn
  function bleat() {
    const e = E();
    busy();
    pick("clang");
    go("bleated");
    bots("new0", "new1").forEach((b) => ((b.route = []), (b.f = -1), (b.a = Math.PI), (b.phase = "mops")));
    e.queue([
      ...sayP("mops", "mops-bleat-clang"),
      e.run(() => pick("mops-bleat")),
      by(3),
      ...sayP("robot", "bot-replaced"),
      ...sayP("robot", "bot-stop-helping"),
      // Mops steps out of the opening, so the way out of the mail room is clear
      ...bridgeWalk("mops", [PK_BAY.mopsAside]),
      e.run(() => (e.face("mops", 1), asSquatch("switch-out", () => (go("climb"), control("chip-climb"))))),
    ]);
  }
  function climbOut() {
    const e = E(),
      l = L();
    sfx("hide");
    e.set("sqPose", "stand");
    e.place("sq", PK_BAY.climbOut.x, PK_BAY.climbOut.y);
    e.face("sq", -1);
    l.pose = "stand";
    go("sneak", { faceT: 0, two: "row", climbed: true });
    control("chip-plant");
  }
  function rollUp() {
    const e = E(),
      l = L();
    e.still("sq");
    e.stopWalk && e.stopWalk();
    l.pose = "ball";
    e.set("sqPose", "ball");
    e.set("ch1DidBall", true);
    sfx("hide");
  }
  // The new robots' sight while he sneaks (bay-watch.js: the drawn cone on him for SIGHT.register seconds, "?" meanwhile);
  // rolled up, the ball rule (R43): only a robot within 70 of him, its cone on him, for 2 s.
  const botCone = (b) => coneFrom("pk-" + b.id, b.x, b.y - 20, b.a != null ? b.a : b.f > 0 ? 0 : Math.PI, { half: PK_SIGHT.half, len: PK_SIGHT.len });
  function botSees(b, dt) {
    const e = E(),
      s = e.pos("sq"),
      k = sqScale("hangar"),
      l = L();
    if (l.pose === "ball") {
      const B = e.ball || { radius: 70, seconds: 2 };
      b.seenT = 0;
      b.near = coneOnBody(botCone(b), s, k) && Math.hypot(s.x - b.x, s.y - b.y) <= B.radius ? (b.near || 0) + dt : 0;
      b.mark = b.near > 0 ? "?" : "";
      return b.near >= B.seconds;
    }
    b.near = 0;
    b.mark = watchTick(b, botCone(b), s, k, e.get("sqPose") !== "stand", dt);
    return b.mark === "!";
  }
  // 55: after he is out, the robots tell Mops off a little longer, then carry crate two out to the ramp, scan it (it
  // passes) and send it up; they wait at the ramp, facing it. Any robot that sees him: the FUR alarm, a guard.
  function sneakTick(l, dt) {
    const e = E();
    l.faceT += dt;
    if (l.two === "row" && l.faceT >= PK_PACE.faceMops) {
      l.two = "going";
      bots("new0", "new1").forEach((b, i) => ((b.a = null), (b.phase = "carry"), (b.route = [{ x: l.things.crate.x - 40 + i * 80, y: l.things.crate.y + 30 }])));
    }
    const nw = bots("new0", "new1");
    if (l.two === "going" && nw.map((b) => roll(b, dt)).every(Boolean)) {
      l.two = "carry";
      l.things.crate.where = "carry";
      nw.forEach((b, i) => (b.route = PK_BAY.carry.map((q) => ({ x: q.x - 30 + i * 60, y: q.y + 10 }))));
    } else if (l.two === "carry") {
      const done = nw.map((b) => roll(b, dt)).every(Boolean);
      Object.assign(l.things.crate, { x: (nw[0].x + nw[1].x) / 2, y: (nw[0].y + nw[1].y) / 2 - 4 });
      if (done) ((l.two = "scan"), Object.assign(l.things.crate, { where: "scan", ...PK_BAY.scanAt }), (l.scan = { k: 0 }), nw.forEach((b) => (b.a = -Math.PI / 2)));
    } else if (l.two === "scan") {
      l.scan.k += dt / PK_PACE.scan;
      if (l.scan.k >= 1) ((l.scan = null), (l.light = "green"), (l.two = "up"), (l.things.crate.where = "up"));
    } else if (l.two === "up") {
      l.things.crate.y -= dt * 90;
      if (l.things.crate.y <= PK_BAY.rampTop.y) ((l.things.crate.where = "ship"), (l.light = ""), (l.two = "done"));
    }
    // their sight, while he is out and nobody is after him
    if (!l.guard && e.get("ctrl") && !e.current() && e.get("sqPose") !== "hidden")
      for (const b of nw) {
        if (b.phase === "mops" && l.faceT < PK_PACE.faceMops) continue;
        if (botSees(b, dt)) return alarm(b);
      }
    if (l.guard && e.get("ctrl")) guardFrame(l, dt);
  }
  // The one capture rule: a robot sees him; the FUR alarm; a guard comes in from the hallway toward where he was seen.
  function alarm(b) {
    const e = E(),
      l = L();
    b.mark = "!";
    bridge.alarmSound();
    sfx("bleep");
    l.guard = newGuard(e.pos("sq"));
  }
  function guardFrame(l, dt) {
    const e = E(),
      res = guardTick(l.guard, e.pos("sq"), sqScale("hangar"), e.get("sqPose") !== "stand", dt);
    if (res === "caught") {
      l.guard = null;
      e.catchSquatch(pickupWords("lockup-cause"));
    } else if (res === "lost") {
      l.guard = null;
      bots("new0", "new1").forEach((b) => ((b.mark = ""), (b.seenT = 0)));
      e.lostYou(partyLine("note-lost"));
    }
  }
  // HIDE · plant: eyes only. The robots go back and carry his crate to the ramp; he watches it opened (the held moment).
  function hidePlant() {
    const e = E(),
      l = L();
    busy();
    sfx("hide");
    l.pose = "stand";
    e.set("sqPose", "hidden");
    e.place("sq", PK_BAY.plantAt.x, PK_BAY.plantAt.y);
    go("held");
    e.queue([
      // crate two is on its way up first
      e.until((dt) => (L().two === "done" || sneakTick(L(), dt || 0), L().two === "done")),
      e.run(() => bots("new0", "new1").forEach((b, i) => ((b.a = null), (b.route = [PK_BAY.carry[2], PK_BAY.carry[1], PK_BAY.botsBack[i]].map((q) => ({ ...q }))), (b.speed = PK_PACE.roll)))),
      e.until((dt) => bots("new0", "new1").map((b) => roll(b, dt || 0)).every(Boolean)),
      by(3),
      ...sayP("robot", "bot-read-label", "say", true),
      ...sayP("robot", "bot-stars-loading", "say", true),
      ...carrySteps("his", ["new0", "new1"]),
      by(4),
      ...sayP("robot", "bot-scan-first", "say", true),
      e.run(() => ((L().things.his.open = 1), sfx("open"))),
      by(3),
      ...sayP("robot", "bot-one-box", "say", true),
      by(4),
      ...sayP("robot", "bot-label-empty", "say", true),
      by(0),
      ...sayP("robot", "bot-goat-stuff", "say", true),
      ...scanSteps("yellow"),
      ...sayP("scanner", "scan-hair", "say", true),
      e.run(() => ((L().cu = "hairclaw"), (L().cuAt = e.time()), (L().t0 = 0), sfx("grab"))),
      wait(PK_PACE.hold),
      e.run(() => ((L().cu = ""), (L().light = "green"))),
      ...sayP("scanner", "scan-goat-hair", "say", true),
      e.run(() => ((L().things.his.open = 0), sfx("pickup"))),
      ...upRamp("his"),
      ...sayP("sq", "sq-on-ship", "whisper"),
      e.run(() => (go("idea", { ideaAt: e.time() }), (L().t0 = 0))),
      wait(PK_PACE.think + 0.2),
      e.run(sneakHome),
    ]);
  }
  // the walk home: out of the plant; Mops at the doorway, behind him on the way
  function sneakHome() {
    const e = E(),
      l = L();
    l.ideaAt = -1;
    e.set("sqPose", "stand");
    e.place("sq", PK_BAY.plantAt.x, PK_BAY.plantAt.y);
    e.set("moPose", "stand");
    e.place("mops", PK_BAY.plantAt.x + 70, PK_BAY.plantAt.y + 30);
    l.trail = freshTrail();
    go("home", { route: "home" });
    control("chip-sneak-home");
  }
  function arriveHome(d) {
    const e = E();
    throughDoor(d);
    busy();
    go("athome");
    e.queue([
      ...sayP("sq", "sq-stopped-hat"),
      ...sayP("sq", "sq-passed-hair"),
      ...sayP("sq", "sq-lets-goats"),
      ...sayP("mops", "mops-every-day"),
      ...sayP("sq", "sq-make-goat"),
      e.run(costume),
    ]);
  }
  // ---------- beat 56: the goat costume ----------
  // The player is Mops: SNIP · beard, close (the scissors, his GANITOR tag and its gold star at the edge)
  function costume() {
    const e = E();
    busy();
    e.set("sqPose", "stand");
    e.place("sq", PK_HOME.mirrorSq.x, PK_HOME.mirrorSq.y + 40);
    e.place("mops", PK_HOME.mirrorMops.x + 40, PK_HOME.mirrorMops.y + 40);
    e.face("mops", -1);
    go("tosnip");
    asMops("switch-snip", () => (go("snip", { cu: "snip", cuAt: e.time(), cut: false }), control("chip-snip")));
  }
  function snip() {
    const e = E();
    busy();
    sfx("grab");
    go("snipped", { cu: "snip", cut: true, cuAt: e.time() });
    e.queue([
      wait(PK_PACE.snip + PK_PACE.hold),
      e.run(() => ((L().cu = ""), e.set("wardrobe", "open"), asSquatch("switch-dress", dressTalk))),
    ]);
  }
  // (the lines come after the switch card: asSquatch queues its card at the end of the queue)
  function dressTalk() {
    const e = E();
    go("dresstalk");
    e.queue([
      ...sayP("mops", "mops-wardrobe"),
      ...sayP("sq", "sq-your-beard"),
      ...sayP("mops", "mops-grows"),
      e.run(() => (go("dress", { cu: "dress", dress: { on: {}, held: "" } }), control("chip-jacket"))),
    ]);
  }
  // the dress-up: a tap on a piece takes it, a tap on him puts it on the body spot nearest the tap (silly results
  // allowed: horns on his chin stay there, and the meter fills only for a piece on its own spot)
  const dressRight = (st) => COSTUME_PIECES.filter((p) => st.on[p.id] === p.spot).length;
  function wearPiece(id, spot) {
    const l = L(),
      st = l.dress;
    for (const k of Object.keys(st.on)) st.on[k] === spot && k !== id && delete st.on[k];
    st.on[id] = spot;
    st.held = "";
    sfx("grab");
    dressRight(st) === COSTUME_PIECES.length && dressed();
  }
  // the big button puts the next piece on its own spot (for a keyboard, or a kid who presses it)
  function wearNext() {
    const st = L().dress,
      p = COSTUME_PIECES.find((q) => st.on[q.id] !== q.spot);
    p && wearPiece(p.id, p.spot);
  }
  function dressed() {
    const e = E();
    busy();
    sfx("pickup");
    e.set("costumeOn", true);
    go("dressed", { cu: "", bleats: 0 });
    e.queue([wait(0.6), e.run(() => (go("practice"), control("chip-bleat")))]);
  }
  // BLEAT · Mops: the first is a roar with a squeak on the end; the second is closer; the third is a bleat, more or less
  function practice() {
    const e = E(),
      l = L();
    busy();
    l.bleats++;
    l.roarAt = e.time();
    go("practiced");
    if (l.bleats === 1) {
      pick("squatch-roar");
      return e.queue([...sayP("sq", "sq-bleat-1"), ...sayP("mops", "mops-less-roar"), ...sayP("sq", "sq-dont-weent"), ...sayP("mops", "mops-goats-do"), e.run(() => (go("practice"), control("chip-bleat")))]);
    }
    if (l.bleats === 2) return (sfx("baa"), e.queue([wait(0.8), e.run(() => (go("practice"), control("chip-bleat")))]));
    pick("mops-bleat");
    e.queue([
      ...sayP("sq", "sq-bleat-3"),
      ...sayP("mops", "mops-close-enough"),
      // the mirror on the inside of the wardrobe door: two goats
      e.run(() => go("mirror")),
      ...bridgeWalk("sq", [PK_HOME.mirrorSq]),
      ...bridgeWalk("mops", [PK_HOME.mirrorMops]),
      e.run(() => (e.face("sq", -1), e.face("mops", -1), (L().mirrorOn = true))),
      ...sayP("mops", "mops-two-goats"),
      e.run(() => (L().heartsAt = e.time())),
      ...sayP("mops", "mops-not-one"),
      ...sayP("sq", "sq-itches"),
      e.run(lastWalk),
    ]);
  }

  // ---------- beat 57: the last walk ----------
  function lastWalk() {
    const e = E(),
      l = L();
    l.heartsAt = -1;
    l.mirrorOn = false;
    e.set("wardrobe", "closed");
    l.trail = freshTrail();
    l.watch = Object.fromEntries(PK_HALL.guests.map((g) => [g.id, { seenT: 0, mark: "", fooled: false, met: false }]));
    l.fur = false;
    l.furT = 0;
    go("lastwalk", { route: "last" });
    control("chip-last-walk");
  }
  // a guest's cone now (each looks round slowly)
  const guestCone = (g, t) => coneFrom("pk-" + g.id, g.x, g.y - adultPxFor("hall") * 0.9, g.a + g.sweep * Math.sin((t * Math.PI * 2) / g.period), { half: PK_SIGHT.half, len: PK_SIGHT.len });
  // The costume's rule (decided 2026-11-24): a cone on him stays dashed and its guest shows "?"; BLEAT pops it; too long
  // in a cone without a bleat and the beard slips (fur shows, the cone fills); fur in a cone too long is a catch.
  function costumeTick(l, dt) {
    const e = E(),
      t = e.time(),
      s = e.pos("sq"),
      k = sqScale("hall");
    let inAny = false;
    for (const g of PK_HALL.guests) {
      const w = l.watch[g.id],
        on = e.get("sqPose") === "stand" && coneOnBody(guestCone(g, t), s, k);
      // a guest says hello to Mops as he passes (57: "Hi, Mops!")
      if (!w.waved && at(e.pos("mops"), g, PK_HALL.hiNear)) ((w.waved = true), e.ambient("tourist", pickupWords("guest-hi-57")));
      if (!on || w.fooled) {
        w.seenT = 0;
        w.mark = "";
        continue;
      }
      inAny = true;
      w.seenT += dt;
      w.mark = "?";
      if (!w.met) ((w.met = true), e.ambient("tourist", pickupWords("guest-other-mops")));
      if (!l.fur && w.seenT >= COSTUME.slipAfter) ((l.fur = true), sfx("slip"));
    }
    l.furT = l.fur && inAny ? l.furT + dt : 0;
    if (l.furT >= COSTUME.furCatch) ((l.furT = 0), (l.fur = false), e.catchSquatch(pickupWords("lockup-hall")));
  }
  function bleatGuest() {
    const e = E(),
      l = L();
    sfx("baa");
    e.ambient("sq", pickupWords("sq-bleat-guest"));
    for (const g of PK_HALL.guests) {
      const w = l.watch[g.id];
      if (w.mark === "?") ((w.fooled = true), (w.mark = ""), (w.seenT = 0), l.twoSaid || ((l.twoSaid = true), e.ambient("tourist", pickupWords("guest-two"))));
    }
  }
  function pressBeard() {
    const l = L();
    sfx("grab");
    l.fur = false;
    l.furT = 0;
    for (const w of Object.values(l.watch || {})) w.seenT = 0;
  }
  // LOOK · plate (optional): the Guardians' plate is empty; crumbs; Mops has one in his beard
  function lookPlate() {
    const e = E();
    busy();
    go("plate", { cu: "plate", plateSeen: true });
    e.queue([
      ...sayP("sq", "sq-came"),
      ...sayP("sq", "sq-ate"),
      e.run(() => ((L().cu = ""), (L().heartsAt = e.time()), (L().crumbAt = e.time()), (L().t0 = 0))),
      wait(PK_PACE.hold + 0.6),
      e.run(() => ((L().heartsAt = -1), go("lastwalk"), control("chip-last-walk"))),
    ]);
  }
  // TAKE · drawing (optional): the crayon drawing behind the crooked photo comes off the wall, close
  function takeKeepsake() {
    const e = E();
    busy();
    sfx("pickup");
    e.set("ch1Keepsake", true);
    go("keepsake", { cu: "crayon", cuAt: e.time(), kept: true });
    e.queue([...sayP("sq", "sq-comes-with"), ...sayP("mops", "mops-tied"), e.run(() => ((L().cu = ""), go("lastwalk"), control("chip-last-walk")))]);
  }

  // ---------- beat 58: through the scanner ----------
  function toBay(d) {
    const e = E(),
      l = L();
    throughDoor(d);
    e.set("ch1Ship", true);
    l.place = "bay";
    l.things = null;
    l.bots = [Object.assign(robot("r0", "new", PK_BAY.rampBot, -1), { a: Math.PI * 0.92 }), robot("old0", "old", { x: 760, y: 520 }, 1), robot("old1", "old", { x: 820, y: 600 }, 1)];
    l.box = { x: PK_BAY.rampTop.x, y: PK_BAY.rampTop.y, where: "ramp" };
    l.trail = freshTrail();
    go("pickbox");
    control("chip-box58");
  }
  function pickBox() {
    const e = E();
    busy();
    sfx("grab");
    L().box.where = "sq";
    go("boxed58");
    e.queue([...sayP("sq", "sq-my-box"), e.run(() => (L().box.where = "mops")), ...sayP("mops", "mops-mail"), e.run(() => (go("toscan"), control("chip-scanner")))]);
  }
  // at the foot of the ramp, the robot's cone holds him: "?"
  function heldAtRamp() {
    const e = E();
    busy();
    const r = bots("r0")[0];
    r.mark = "?";
    L().talker = 0;
    go("seen58");
    e.queue([...sayP("robot", "bot-two-goats"), e.run(() => (go("botbleat"), control("chip-scanner")))]);
  }
  function bleatRobot() {
    const e = E();
    busy();
    pick("squatch-roar");
    go("bleated58", { roarAt: e.time() });
    e.queue([
      ...sayP("sq", "sq-bleat-ramp"),
      ...sayP("robot", "bot-odd-goat"),
      ...sayP("mops", "mops-cousin"),
      ...sayP("robot", "bot-compute"),
      e.run(() => ((bots("r0")[0].mark = ""), asMops("switch-board-mops", () => (go("goship"), control("chip-go-ship"))))),
    ]);
  }
  // GO · ship (the player is Mops): a robot holds out a claw for his tool, the way Dot, Bob and Lou handed theirs over
  function goShip() {
    const e = E(),
      l = L(),
      es = e.get("ch1Escape"),
      star = !!(es && es.star);
    busy();
    go("claw", { claw: true });
    e.queue([
      ...sayP("robot", "bot-tool"),
      ...sayP("mops", "mops-attached"),
      ...sayP("robot", "bot-beard-mop"),
      ...(star ? sayP("robot", "bot-stars-count") : []),
      e.run(() => (L().claw = false)),
      ...bridgeWalk("mops", [PK_BAY.archFront, PK_BAY.rampFoot]),
      e.run(() => ((L().light = "green"), sfx("bleep"))),
      ...sayP("scanner", "scan-goat", "say", true),
      e.run(() => (L().light = "")),
      ...bridgeWalk("mops", [PK_BAY.mopsTop]),
      e.run(() => asSquatch("switch-board-sq", () => (go("board"), control("chip-board")))),
    ]);
    l.mopsBox = true;
  }
  // BOARD · scanner: he walks in; the scan line comes down from his horns; at the beard, close: one corner peeling
  function board() {
    const e = E();
    busy();
    go("scanning", { scanSq: 0 });
    e.queue([
      ...bridgeWalk("sq", [PK_BAY.archFront, PK_BAY.rampFoot]),
      e.until((dt) => (L().scanSq = Math.min(1, L().scanSq + (dt || 0) / PK_PACE.scanDown)) >= 1),
      e.run(() => (go("peel", { cu: "peel", cuAt: e.time(), pressed: false }), control("chip-board"))),
    ]);
  }
  function pressPeel() {
    const e = E();
    busy();
    sfx("grab");
    go("proceed", { cu: "peel", pressed: true });
    e.queue([
      wait(0.5),
      e.run(() => ((L().cu = ""), (L().light = "yellow"))),
      ...sayP("scanner", "scan-hair-58", "say", true),
      ...sayP("scanner", "scan-probably", "say", true),
      e.run(() => ((L().light = "green"), sfx("bleep"))),
      ...sayP("scanner", "scan-proceed", "say", true),
      e.run(() => ((L().light = ""), (L().scanSq = -1), go("ramp"), control("chip-board"))),
    ]);
  }
  // CLIMB · ramp: halfway up, "Weent.", the beard drops into his paws under the camera's red light; on, crooked
  function climbRamp() {
    const e = E(),
      half = { x: PK_BAY.rampFoot.x, y: (PK_BAY.rampFoot.y + PK_BAY.rampTop.y) / 2 };
    busy();
    go("climbing");
    e.queue([
      ...bridgeWalk("sq", [half]),
      ...sayP("sq", "sq-weent", "whisper"),
      e.run(() => ((L().cu = "slip"), (L().cuAt = e.time()), (L().t0 = 0), sfx("slip"))),
      wait(PK_PACE.slip),
      e.run(() => ((L().cu = ""), (L().crooked = true))),
      ...bridgeWalk("sq", [PK_BAY.rampTop]),
      e.run(() => {
        e.set("sqPose", "hidden");
        e.set("moPose", "hidden");
        e.place("sq", -400, -400);
        e.place("mops", -400, -400);
        go("gone", { place: "gone", goneAt: e.time(), bots: [] });
        L().t0 = 0;
      }),
      wait(PK_PACE.gone),
      e.run(toOffice),
    ]);
  }

  // ---------- beat 59: where's Mops? (a cutscene) ----------
  // The office on photo day: the frame on the desk, close, then the camera on its tripod, the stool, Isfred, the new robot.
  function toOffice(noFrame) {
    const e = E();
    busy();
    // (the walk log follows his feet: he leaves the bay from the top of the ramp, and nobody is drawn in the office)
    e.set("sqPose", "hidden");
    e.place("sq", PK_BAY.rampTop.x, PK_BAY.rampTop.y);
    e.enterRoom("office", "QB");
    e.set("ch1D", false);
    e.set("ch1Ship", false);
    // (the office's own drawing draws Isfred and a robot while ch1Office is on: 12-ch1-redesign.js drawCh1OfficeRoom)
    e.set("ch1Office", true);
    e.set("sqPose", "hidden");
    e.set("moPose", "hidden");
    // (nobody of theirs is in the office; Squatch's place, hidden, is where the tape's big button works)
    e.place("sq", 480, 560);
    e.place("mops", -400, -400);
    go("photo", { place: "", bots: [], box: null, cu: noFrame === true ? "" : "frame", cuAt: e.time() });
    L().t0 = 0;
    e.queue([
      wait(noFrame === true ? 0 : PK_PACE.hold + 0.6),
      e.run(() => (L().cu = "")),
      ...sayP("official", "isfred-photo"),
      ...sayP("robot", "bot-not-here"),
      ...sayP("official", "isfred-not-here"),
      ...sayP("robot", "bot-replaced-shipment"),
      ...sayP("official", "isfred-tapes"),
      e.card("later", pickupWords("card-later")),
      e.run(() => (go("tape", { cu: "tape", tape: { clip: "night", k: 0, zoom: "", next: "play" } }), control("chip-tapes"))),
    ]);
  }

  // ---------- beat 60: the security tapes ----------
  // The tape screen with its three big buttons; the one to press now is bright. Each ZOOM is the cut-in.
  const starWord = () => {
    const es = E().get("ch1Escape"),
      star = (es && es.star) || "star-great";
    return { line: { "star-good": "isfred-good-ganitor", "star-great": "isfred-great-ganitor", "star-star": "isfred-star-ganitor" }[star] || "isfred-great-ganitor", tag: escapeWords(star).split(" ")[0] };
  };
  function tapePress(id) {
    const e = E(),
      l = L(),
      tp = l.tape;
    if (id !== tp.next) return;
    busy();
    sfx("key");
    go("taping");
    const back = (next) => e.run(() => ((L().tape.next = next), go("tape"), control("chip-tapes")));
    if (id === "play") return e.queue([e.until((dt) => (L().tape.k = Math.min(1, L().tape.k + (dt || 0) / PK_PACE.tape)) >= 1), back("zoom")]);
    if (id === "next") return (Object.assign(tp, { clip: "today", k: 0, zoom: "" }), e.queue([back("play")]));
    if (tp.clip === "night") return ((tp.zoom = "paw"), e.queue([...sayP("official", "isfred-what"), ...sayP("official", "isfred-ordered"), back("next")]));
    if (!tp.zoom) return ((tp.zoom = "star"), e.queue([...sayP("official", starWord().line), ...sayP("official", "isfred-best"), back("zoom")]));
    tp.zoom = "feet";
    e.queue([...sayP("official", "isfred-not-goat"), ...sayP("official", "isfred-wookiee"), ...sayP("official", "isfred-ship"), e.run(toHold)]);
  }

  // ---------- beat 61: the call to the ship ----------
  // The cargo hold: their crate, stamp side out; the beard off and in his lap (it itches); this week's box on the crate.
  function toHold() {
    const e = E(),
      l = L();
    busy();
    e.set("ch1Office", false);
    e.place("sq", PK_HOLD.sq.x, PK_HOLD.sq.y);
    e.enterRoom("hangar", "QB");
    e.set("ch1D", true);
    e.set("costumeOn", true);
    Object.assign(l, { place: "hold", crate: "ship", cu: "", tape: null, bots: [], things: null, box: { ...PK_HOLD.crate, where: "crate" } });
    e.set("sqPose", "stand");
    e.set("moPose", "stand");
    e.place("sq", PK_HOLD.sq.x, PK_HOLD.sq.y);
    e.place("mops", PK_HOLD.mops.x, PK_HOLD.mops.y);
    e.face("sq", 1);
    e.face("mops", -1);
    go("cake");
    control("chip-hold");
  }
  function openCake() {
    busy();
    sfx("open");
    L().box.where = "open";
    go("bite", { cu: "bite", bitten: false });
    control("chip-hold");
  }
  function biteCake() {
    const e = E();
    busy();
    sfx("slurp");
    go("biting", { bitten: true });
    e.queue([
      wait(0.6),
      ...sayP("sq", "sq-no-fizz"),
      e.run(() => (L().cu = "")),
      ...sayP("sq", "sq-fizzy-mars"),
      e.run(() => (L().heartsAt = e.time())),
      ...sayP("mops", "mops-going-there"),
      e.run(() => ((L().heartsAt = -1), go("call"), sfx("bleep"))),
      ...sayP("ups", "ship-call", "say", true),
      ...sayP("ups", "ship-tapes", "say", true),
      ...sayP("ups", "ship-wookiee", "say", true),
      ...sayP("ups", "ship-search", "say", true),
      ...sayP("sq", "sq-where"),
      ...sayP("mops", "mops-mean-you"),
      ...sayP("sq", "sq-sasquatch"),
      e.run(() => (go("hide"), control("chip-hide-crate"))),
    ]);
  }
  // HIDE · crate: inside, dark, a strip of light; boots; the lid lifts. A search always finds; no lockup card.
  function hideCrate() {
    const e = E();
    busy();
    sfx("hide");
    e.set("sqPose", "hidden");
    go("found", { cu: "lid", lift: 0 });
    L().t0 = 0;
    e.queue([
      wait(0.5),
      e.run(() => sfx("key")),
      wait(0.5),
      e.run(() => sfx("key")),
      wait(0.6),
      e.until((dt) => (L().lift = Math.min(1, L().lift + (dt || 0) / PK_PACE.lid)) >= 1),
      ...sayP("ups", "crew-found"),
      e.run(() => {
        Object.assign(L(), { cu: "", crew: true });
        e.set("sqPose", "stand");
        e.place("sq", PK_HOLD.crate.x - 40, PK_HOLD.crate.y + 10);
      }),
      ...sayP("ups", "crew-stay"),
      // Mops steps between them
      ...bridgeWalk("mops", [{ x: PK_HOLD.crate.x + 90, y: PK_HOLD.crate.y + 20 }]),
      e.run(() => e.face("mops", 1)),
      ...sayP("mops", "mops-with-me"),
      e.run(() => (L().heartsAt = e.time())),
      ...sayP("ups", "crew-both-off"),
      e.run(chapterEnd),
    ]);
  }
  // The end of Chapter 1: the older program's tally card, then Chapter 2's Gas Stop (14-ch1-day2.js ch1ChapterEnd).
  function chapterEnd() {
    const e = E();
    L().heartsAt = -1;
    L().step = "done";
    record.steps.push("done");
    chip("");
    e.chapterEnd();
  }

  // ---------- every frame ----------
  function tick(dt) {
    const l = live(),
      e = E();
    if (!l) {
      if (driving && e) ((driving = ""), e.playAs("squatch"));
      return;
    }
    dt = dt || 0;
    const free = e.get("ctrl") && !e.current();
    // the pushed crate is solid: a step that would put it in something is taken back (room-model.js)
    l.step === "push" && l.crate === "push" && lastMops && keepCrateClear(l, lastMops, lastMops.f || 1);
    const m = e.pos("mops");
    moMoving = !!lastMops && Math.hypot(m.x - lastMops.x, m.y - lastMops.y) > 0.3;
    l.mopping = free && moMoving && l.step === "mop";
    if (free && l.step === "mop") mopTick(l);
    if (free && walking(l)) walkTick(l, dt);
    l.slideHis && (l.slideHis.t += dt) >= PK_SLIDE && (l.slideHis = null);
    lastMops = m;
    // 55: the robots roll back while Mops walks in; the sneak to the plant
    if (["warn", "knock", "bleat"].includes(l.step) && free) bots("new0", "new1").forEach((b) => roll(b, dt));
    if (l.step === "warn" && free && at(m, PK_BAY.knockAt, PK_BAY.knockR)) (go("knock"), control("chip-warn"));
    if (l.step === "sneak" && free) sneakTick(l, dt);
    if (free && l.pose === "ball" && l.step === "sneak" && e.steering()) ((l.pose = "stand"), e.set("sqPose", "stand"));
    if (l.cu && free) e.still("sq");
    // 58: the week's box comes down the ramp; at the foot of the ramp the robot's cone holds him
    if (l.box && l.box.where === "ramp") {
      l.box.y += dt * 110;
      l.box.x += ((PK_BAY.box.x - PK_BAY.rampTop.x) / (PK_BAY.box.y - PK_BAY.rampTop.y)) * dt * 110;
      l.box.y >= PK_BAY.box.y && Object.assign(l.box, { ...PK_BAY.box, where: "floor" });
    }
    if (l.step === "toscan" && free && at(e.pos("sq"), PK_BAY.archFront, 50)) heldAtRamp();
    // 58: Mops stays a step behind him in the bay until the scanner (he carries the mail)
    if (free && (l.step === "pickbox" || l.step === "toscan") && l.trail && e.get("moPose") !== "hidden") {
      const to = followStep(l.trail, e.pos("sq"), e.pos("mops"));
      e.moWalking(true);
      to ? e.step("mops", to.x, to.y, FOLLOW.speed, dt) : e.still("mops");
    }
  }

  // ---------- spots ----------
  function spot(id, wordsId, place, thing, f, who = "sq") {
    const [verb, cap] = pickupWords(wordsId).split(" · ");
    return { id, verb, cap, who, ...place, at: thing ? [(thing.x0 + thing.x1) / 2, thing.y0] : undefined, thing, f };
  }
  function hot(id, wordsId, f, who = "sq") {
    const e = E(),
      p = e.pos(who === "mo" ? "mops" : "sq"),
      [verb, cap] = pickupWords(wordsId).split(" · ");
    return { id, verb, cap, who, hot: true, x: p.x, y: p.y, r: 40, at: [p.x, p.y - 70], f };
  }
  const walkSpot = (id, who, p, r) => ({ id, who, x: p.x, y: p.y, r });
  const hisCrateBox = () => {
    const t = L().things && L().things.his;
    return t ? { x0: t.x - 40, y0: t.y - 64, x1: t.x + 40, y1: t.y } : null;
  };
  function spots() {
    const l = live(),
      e = E();
    if (!l || !e.get("ctrl")) return [];
    if (l.step === "packnote" && l.cu === "box") return [hot("pk-pack-note", "button-pack-note", packNote)];
    if (l.step === "snip" && l.cu === "snip") return [hot("pk-snip", "button-snip", snip, "mo")];
    if (l.step === "dress" && l.cu === "dress") {
      const p = COSTUME_PIECES.find((q) => l.dress.on[q.id] !== q.spot);
      return p ? [hot("pk-wear", "button-wear-" + p.id, wearNext)] : [];
    }
    if (l.step === "peel" && l.cu === "peel") return [hot("pk-peel", "button-press-beard", pressPeel)];
    if (l.step === "tape" && l.cu === "tape") {
      const id = l.tape.next;
      return [{ id: "pk-tape-" + id, verb: pickupWords({ play: "button-play", zoom: "button-zoom", next: "button-next-tape" }[id]).split(" · ")[0], cap: pickupWords({ play: "button-play", zoom: "button-zoom", next: "button-next-tape" }[id]).split(" · ")[1], who: "sq", hot: true, x: 480, y: 560, r: 40, f: () => tapePress(id) }];
    }
    if (l.step === "bite" && l.cu === "bite") return [hot("pk-bite", "button-bite", biteCake)];
    if (l.cu) return [];
    if (l.step === "practice") return [hot("pk-practice", "button-bleat-mops", practice)];
    if (l.step === "lastwalk") {
      const out = [];
      // where he is going (the next doorway), then the costume's own buttons: the beard slipped (PRESS · beard), a
      // guest's "?" (BLEAT · guest)
      const door = doorTo(e.room(), ROUTE_LAST[e.room()]);
      door && out.push(walkSpot("pk-door", "sq", { x: (door.box.x0 + door.box.x1) / 2, y: (door.box.y0 + door.box.y1) / 2 }, 20));
      if (l.fur) out.push(hot("pk-press-beard", "button-press-beard", pressBeard));
      else if (Object.values(l.watch || {}).some((w) => w.mark === "?")) out.push(hot("pk-bleat-guest", "button-bleat-guest", bleatGuest));
      // optional: the plate on the snack bar, the drawing on the photo wall (no outline: they are optional)
      e.room() === "hall" && !l.plateSeen && out.push({ ...spot("pk-plate", "button-plate", { x: PK_HALL.plateAt.x, y: PK_HALL.plateAt.y, r: PK_HALL.plateR }, PK_HALL.plate, lookPlate), extra: true });
      e.room() === "passage" && !l.kept && out.push({ ...spot("pk-keepsake", "button-take-keepsake", { x: PK_HALLWAY.crayonAt.x, y: PK_HALLWAY.crayonAt.y, r: PK_HALLWAY.crayonR }, PK_HALLWAY.crayon, takeKeepsake), extra: true });
      return out;
    }
    if (l.step === "pickbox" && l.box && l.box.where === "ramp") return [walkSpot("pk-box", "sq", { x: PK_BAY.box.x + 40, y: PK_BAY.box.y + 10 }, 20)];
    if (l.step === "pickbox" && l.box && l.box.where === "floor") return [spot("pk-pick-box", "button-pick-box", { x: l.box.x + 40, y: l.box.y + 10, r: PK_BAY.boxR }, { x0: l.box.x - 24, y0: l.box.y - 28, x1: l.box.x + 34, y1: l.box.y }, pickBox)];
    if (l.step === "toscan") return [{ ...walkSpot("pk-to-scan", "sq", PK_BAY.archFront, 40), thing: PK_BAY.arch }];
    if (l.step === "botbleat") return [hot("pk-bleat-robot", "button-bleat-robot", bleatRobot)];
    if (l.step === "goship") return [spot("pk-go-ship", "button-go-ship", { x: PK_BAY.archFront.x + 60, y: PK_BAY.archFront.y + 20, r: 80 }, PK_BAY.arch, goShip, "mo")];
    if (l.step === "board") return [spot("pk-board", "button-board", { x: PK_BAY.archFront.x, y: PK_BAY.archFront.y + 10, r: 90 }, PK_BAY.arch, board)];
    if (l.step === "ramp") return [hot("pk-ramp", "button-ramp", climbRamp)];
    const holdCrate = { x0: PK_HOLD.crate.x - 90, y0: PK_HOLD.crate.y - 132, x1: PK_HOLD.crate.x + 90, y1: PK_HOLD.crate.y };
    if (l.step === "cake") return [spot("pk-cake", "button-open-cake", { x: PK_HOLD.sq.x, y: PK_HOLD.sq.y, r: 80 }, { x0: PK_HOLD.crate.x - 30, y0: PK_HOLD.crate.y - 184, x1: PK_HOLD.crate.x + 70, y1: PK_HOLD.crate.y - 132 }, openCake)];
    if (l.step === "hide") return [spot("pk-hide", "button-hide-crate", { x: PK_HOLD.sq.x, y: PK_HOLD.sq.y, r: 80 }, holdCrate, hideCrate)];
    if (l.step === "note") return [spot("pk-note", "button-note", { x: PK_HOME.noteAt.x, y: PK_HOME.noteAt.y, r: 90 }, PK_HOME.note, readNote)];
    if (l.step === "box") return [spot("pk-box", "button-open-box", { x: PK_HOME.closet.x, y: PK_HOME.closet.y, r: 90 }, MORNING_THINGS.boxIn, openBox)];
    if (l.step === "mop") {
      const i = l.tufts.findIndex((v) => !v),
        q = PK_HOME.tufts[i];
      return i >= 0 ? [{ ...walkSpot("pk-tuft", "mo", tuftStand(i), PK_HOME.tuftR - 6), thing: { x0: q.x - 16, y0: q.y - 12, x1: q.x + 16, y1: q.y + 12 } }] : [];
    }
    if (l.step === "pack") return [spot("pk-pack-box", "button-pack-box", { x: PK_HOME.crateAt.x, y: PK_HOME.crateAt.y, r: 90 }, PK_HOME.crate, packBox)];
    if (l.step === "bucket") return [spot("pk-pack-bucket", "button-pack-bucket", { x: PK_HOME.bucketAt.x, y: PK_HOME.bucketAt.y, r: 70 }, PK_HOME.bucket, packBucket)];
    if (l.step === "walls")
      return PK_HOME.walls
        .filter((w) => !l.walls[w.id])
        .map((w) => spot("pk-wall-" + w.id, "button-take-" + w.id.replace(/\d$/, ""), { x: w.at.x, y: w.at.y, r: PK_HOME.wallR }, w.box, () => takeWall(w.id)));
    if (l.step === "label") return [spot("pk-label", "button-label", { x: PK_HOME.crateAt.x, y: PK_HOME.crateAt.y, r: 90 }, PK_HOME.crate, putLabel)];
    if (l.step === "getin") return [spot("pk-get-in", "button-get-in", { x: PK_HOME.crateAt.x, y: PK_HOME.crateAt.y, r: 90 }, PK_HOME.crate, getIn)];
    if (l.step === "push" && e.room() === "hangar") return [walkSpot("pk-row", "mo", PK_BAY.pushTo, PK_BAY.pushR - 6)];
    if (l.step === "warn") return [walkSpot("pk-to-crate", "mo", PK_BAY.knockAt, PK_BAY.knockR - 8)];
    if (l.step === "knock") return [spot("pk-knock", "button-knock", { x: PK_BAY.knockAt.x, y: PK_BAY.knockAt.y, r: PK_BAY.knockR + 10 }, hisCrateBox(), knock, "mo")];
    if (l.step === "bleat") {
      const b = bots("new0")[0];
      return [spot("pk-bleat", "button-bleat-robot", { x: PK_BAY.bleatAt.x, y: PK_BAY.bleatAt.y, r: PK_BAY.bleatR }, b ? { x0: b.x - 30, y0: b.y - 80, x1: b.x + 30, y1: b.y } : null, bleat, "mo")];
    }
    if (l.step === "climb") return [hot("pk-climb", "button-climb", climbOut)];
    if (l.step === "sneak" && l.pose === "stand") {
      const out = [];
      !l.guard && out.push(spot("pk-plant", "button-plant", { x: PK_BAY.plantAt.x, y: PK_BAY.plantAt.y, r: PK_BAY.plantR }, PK_BAY.plant, hidePlant));
      // he can always roll up where he stands (the ball fools a look)
      const s = e.pos("sq");
      at(s, PK_BAY.plantAt, PK_BAY.plantR) || out.push({ ...hot("pk-ball", "button-ball", rollUp), extra: true });
      return out;
    }
    const door = walking(l) && doorTo(e.room(), routeOf(l)[e.room()]);
    if (door) return [walkSpot("pk-door", driving === "mops" ? "mo" : "sq", { x: (door.box.x0 + door.box.x1) / 2, y: (door.box.y0 + door.box.y1) / 2 }, 20)];
    return [];
  }

  // ---------- drawing ----------
  // where his crate is drawn while Mops pushes it: in front of Mops, the way he faces
  // One size for his crate in every room, the size of the row's crates in the bay (Brian r6 3:07: "Crate is way too
  // large"): it was sized against home by the room rule, but home draws its people at three times their scale, so
  // the pushed crate came out about twice the size of the crates it joins.
  const crateK = (room) => (sqScale(room) / sqScale("closet")) * 0.55;
  // The floor his crate stands on while pushed (its pallet's width, a strip at its bottom), for the room's solids.
  function crateFoot(c) {
    const half = (PK_CRATE.w / 2 + 4) * c.k;
    return { x0: c.x - half, x1: c.x + half, y0: c.y - 22, y1: c.y + 2 };
  }
  // The solids his crate keeps out of: the room's (the engine's, with the beat's), people's feet included, not Mops's own.
  function crateSolids() {
    const e = E(),
      m = e.pos("mops");
    return (e.roomSolids ? e.roomSolids() : []).filter((b) => b && !(b.person && Math.abs((b.x0 + b.x1) / 2 - m.x) < 2 && Math.abs((b.y0 + b.y1) / 2 - m.y) < 6));
  }
  /**
   * Normal physics for the push (Brian r6 3:07 to 3:19: "he shouldn't be able to just push it through the bar", "pushes
   * right through the robot", "through the other crates and over the wall"): a step (or a turn) that would put the
   * crate in something solid does not happen; along a wall he slides on the way that is free. True when it stopped him.
   */
  function keepCrateClear(l, was, wasF) {
    const e = E(),
      m = e.pos("mops"),
      solids = crateSolids(),
      fits = (x, y, f) => !boxHit(crateFoot({ ...pushedCrateAt(x, y, f) }), solids);
    if (fits(m.x, m.y, m.f || 1)) return false;
    // (a turn that would swing the crate into something: he keeps facing the way he was)
    const f = fits(m.x, m.y, wasF) ? wasF : null;
    if (f != null) return (e.face("mops", f), false);
    const tries = [
      [m.x, was.y, m.f || 1],
      [was.x, m.y, m.f || 1],
      [was.x, was.y, wasF],
    ];
    const ok = tries.find(([x, y, q]) => fits(x, y, q)) || [was.x, was.y, wasF];
    e.place("mops", ok[0], ok[1]);
    e.face("mops", ok[2]);
    l.crateStops = (l.crateStops || 0) + 1;
    return true;
  }
  function pushedCrate() {
    const m = E().pos("mops");
    return pushedCrateAt(m.x, m.y, m.f || 1);
  }
  function pushedCrateAt(x, y, f) {
    const k = crateK(E().room());
    return { x: x + f * ((PK_CRATE.w / 2 + PK_CRATE.ahead) * k), y: y + 4, k };
  }
  function headBox(who) {
    const e = E(),
      room = e.room();
    if (who === "mops") {
      const m = e.pos("mops"),
        q = moScale(room),
        hx = m.x + 14 * q * (m.f || 1);
      return { x: hx - 22 * q, y: m.y - 82 * q, w: 44 * q, h: 40 * q };
    }
    const s = e.pos("sq"),
      q = sqScale(room);
    return { x: s.x - 20 * q, y: s.y - 78 * q, w: 40 * q, h: 36 * q };
  }
  // the boxes of Squatch and Mops as the room draws them (the highlight leaves them out: room-model.js personBox)
  function peopleBoxes(room) {
    const e = E(),
      s = e.pos("sq"),
      m = e.pos("mops"),
      out = [];
    e.get("sqPose") === "stand" && out.push(personBox("sq", s.x, s.y, sqScale(room)));
    e.get("moPose") !== "hidden" && out.push(personBox("mops", m.x, m.y, moScale(room)));
    return out;
  }
  // the bay's people and robots, back to front
  function bayPeople(ctx, l) {
    const e = E(),
      t = e.time(),
      s = e.pos("sq"),
      m = e.pos("mops"),
      list = [];
    if (e.get("moPose") !== "hidden") list.push({ y: m.y, f: () => e.drawMopsOn(ctx, m.x, m.y, moScale("hangar"), { f: m.f || 1, walk: moMoving ? t * 8 : 0 }) });
    if (e.get("sqPose") === "ball" || l.pose === "ball") list.push({ y: s.y, f: () => e.ball.drawOn(ctx, s.x, s.y - 16, 1) });
    else if (e.get("sqPose") === "stand" && s.x > -100) {
      const c = !!e.get("costumeOn");
      list.push({ y: s.y, f: () => e.drawSquatch(ctx, s.x, s.y, sqScale("hangar"), { f: s.f || 1, walk: e.walkPhase(), jacket: c, goatBeard: c, horns: c }) });
    }
    for (const b of l.bots || []) list.push({ y: b.y, f: () => drawBot(ctx, b, t) });
    for (const [kind, th] of Object.entries(l.things || {})) if (th.where !== "ship") list.push({ y: th.y + (th.where === "carry" ? 2 : 0), f: () => drawThing(ctx, kind, th, l) });
    list.sort((a, b) => a.y - b.y).forEach((p) => p.f());
  }
  function drawBot(ctx, b, t) {
    const e = E(),
      k = botK();
    // robots always show their cones
    const c = botCone(b),
      inside = !!(L().step === "sneak" && e.get("sqPose") === "stand" && coneOnBody(c, e.pos("sq"), sqScale("hangar")));
    drawWatchCone(ctx, c, inside);
    e.noteCone({ id: c.id, ox: c.ox, oy: c.oy, a: c.a, half: c.half, len: c.len });
    e.drawRobot(ctx, b.x, b.y, false, k);
    b.kind === "new" && drawNewRobotBits(ctx, b.x, b.y, k, b.f, t);
    b.mark && drawWatchMark(ctx, b.x, b.y - 70, b.mark, Math.min(1, (b.seenT || 0) / 0.5), t);
  }
  function drawThing(ctx, kind, th, l) {
    const k = crateK("hangar");
    if (kind === "bag") return drawMailBag(ctx, th.x, th.y, 0.8);
    const sl = kind === "his" && l.slideHis,
      u = sl ? Math.min(1, sl.t / PK_SLIDE) : 1;
    sl && (th = { ...th, x: sl.x + (th.x - sl.x) * u, y: sl.y + (th.y - sl.y) * u });
    drawPkCrate(ctx, th.x, th.y, k, { label: kind === "his", bucket: kind === "his" && l.packed.top, open: th.open || 0, eyes: kind === "his" && l.crate === "row" && ["warn", "knock", "bleat", "bleated", "climb"].includes(l.step) });
  }
  const m0 = () => E().pos("mops");
  function drawBay(ctx, l) {
    if (l.place === "hold") return drawHoldNow(ctx, l);
    const e = E(),
      t = e.time(),
      p = l.place === "gone" ? pics.gone : pics.pickup;
    p && p.complete && p.naturalWidth ? ctx.drawImage(p, 0, 0, 960, 640) : ((ctx.fillStyle = "#8a8fa0"), ctx.fillRect(0, 0, 960, 640));
    const out = { room: "hangar" };
    // the camera with a red light over the ramp (a layer, for Brian's yes)
    out.camera = drawCamera(ctx, PK_BAY.camera.x, PK_BAY.camera.y, t);
    drawArchLight(ctx, PK_BAY.arch, l.light, t);
    out.light = l.light;
    // Lou's hat: in the bag, in the claw, in the bin
    if (l.hat && l.hat.where === "bin") drawHat(ctx, PK_BAY.bin.x, PK_BAY.bin.y + 8, 0.8);
    bayPeople(ctx, l);
    if (l.scan) {
      const th = Object.values(l.things || {}).find((q) => q.where === "scan");
      th && drawScanLine(ctx, { x0: th.x - 44, y0: th.y - 70, x1: th.x + 44, y1: th.y }, l.scan.k);
      out.scan = +l.scan.k.toFixed(2);
    }
    if (l.hat && l.hat.where === "claw") drawHat(ctx, PK_BAY.scanAt.x, PK_BAY.scanAt.y - 110, 1.2);
    // 55: he hides in the plant: his eyes in its leaves
    if (e.get("sqPose") === "hidden" && ["held", "idea"].includes(l.step)) e.drawEyes(ctx, PK_BAY.eyes.x, PK_BAY.eyes.y);
    if (l.guard) out.guard = drawGuard(ctx, l.guard, e.pos("sq"), sqScale("hangar"), e.get("sqPose") !== "stand", t).inside;
    // the goal's outline
    if (e.get("ctrl") && !e.current() && !l.cu) {
      const sp = spots().find((q) => q.thing && !q.extra);
      sp && (out.mark = markBox(ctx, sp.thing, t, 6, peopleBoxes("hangar")));
      walking(l) && markDoor(ctx, doorTo("hangar", routeOf(l).hangar), t);
      l.step === "push" && (out.mark = markBox(ctx, { x0: PK_BAY.row[2].x - 40, y0: PK_BAY.row[2].y - 64, x1: PK_BAY.row[2].x + 40, y1: PK_BAY.row[2].y }, t));
      l.step === "warn" && (out.mark = markBox(ctx, hisCrateBox(), t));
    }
    // 58: the week's box (on the ramp, on the floor, under Mops's arm); the robot's claw out for his tool
    if (l.box && l.box.where !== "sq" && l.box.where !== "mops") out.box = drawTagBox(ctx, l.box.x, l.box.y, 1);
    if (l.box && l.box.where === "mops" && e.get("moPose") !== "hidden") drawTagBox(ctx, m0().x + 18, m0().y - 30, 0.7);
    if (l.claw) {
      const r = bots("r0")[0];
      r && (ctx.save(), (ctx.strokeStyle = "#8a93a3"), (ctx.lineWidth = 6), ctx.beginPath(), ctx.moveTo(r.x - 20, r.y - 40), ctx.lineTo(r.x - 70, r.y - 44), ctx.stroke(), ctx.restore());
    }
    if (l.scanSq >= 0 && l.step === "scanning") {
      const s = e.pos("sq"),
        k = sqScale("hangar");
      drawScanLine(ctx, { x0: s.x - 26 * k, y0: s.y - 70 * k, x1: s.x + 26 * k, y1: s.y - 70 * k + 40 * k }, l.scanSq);
      out.scanSq = +l.scanSq.toFixed(2);
    }
    if (l.place === "gone") out.shipAway = (drawShipAway(ctx, Math.min(1, (t - l.goneAt) / PK_PACE.gone)), true);
    // the push: his crate in front of Mops
    if (l.crate === "push") {
      const c = pushedCrate();
      drawPkCrate(ctx, c.x, c.y, c.k, { label: true, bucket: true });
    }
    // 55: the idea, three thought pictures over the plant
    if (l.ideaAt >= 0) out.idea = drawIdea(ctx, { x: PK_BAY.eyes.x - 20, y: PK_BAY.plant.y0 - 6, w: 40, h: 30 }, t - l.ideaAt).picture;
    // the close-ups
    if (l.cu === "slat") ((out.slat = drawSlatFrame(ctx, t)), (out.slatStrip = { ...SLAT }));
    if (l.cu === "hairclaw") (drawHairCloseup(ctx, t, { wood: false }), (out.hair = "claw"));
    if (l.cu === "peel") (drawPeelCloseup(ctx, !!l.pressed, t), (out.peel = !l.pressed));
    if (l.cu === "slip") (drawSlipCloseup(ctx, t), (out.slip = true));
    return out;
  }
  // 61: the cargo hold (a drawing of its own, a PLACEHOLDER), their crate, the two of them, the crew once found
  function drawHoldNow(ctx, l) {
    const e = E(),
      t = e.time(),
      s = e.pos("sq"),
      m = e.pos("mops"),
      out = { room: "hangar", place: "hold" };
    drawHold(ctx, t);
    const k = 1.1;
    out.crate = drawPkCrate(ctx, PK_HOLD.crate.x, PK_HOLD.crate.y, k, { label: true, bucket: !l.crew, open: l.crew ? 1 : 0 });
    l.box && l.box.where === "crate" && drawTagBox(ctx, PK_HOLD.crate.x + 10, PK_HOLD.crate.y - 136, 1.6);
    // (the hold is close up: the two of them drawn bigger than in the bay)
    const sk = sqScale("hangar") * 2.2,
      mk = moScale("hangar") * 2.2;
    e.get("moPose") !== "hidden" && e.drawMopsOn(ctx, m.x, m.y, mk, { f: m.f || -1, walk: moMoving ? t * 8 : 0 });
    if (e.get("sqPose") === "stand") {
      e.drawSquatch(ctx, s.x, s.y, sk, { f: s.f || 1, jacket: true, horns: true, goatBeard: false });
      // the beard, off, in his lap
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(s.x + 6, s.y - 26 * sk);
      ctx.lineTo(s.x + 30, s.y - 26 * sk);
      ctx.lineTo(s.x + 18, s.y - 10 * sk);
      ctx.closePath();
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#1e2430";
      ctx.lineWidth = 2.5;
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    // the crew (a PLACEHOLDER: the party's guard look until the ship's crew has a look)
    if (l.crew) (drawPerson(ctx, PK_HOLD.crate.x + 230, PK_HOLD.crate.y + 20, adultPxFor("hangar") * 1.5, LOOKS.guard, -1, t), (out.crew = true));
    if (l.heartsAt >= 0) drawHearts(ctx, m.x, m.y - 50 * mk, t - l.heartsAt);
    if (e.get("ctrl") && !e.current() && !l.cu) {
      const sp = spots().find((q) => q.thing);
      sp && (out.mark = markBox(ctx, sp.thing, t));
    }
    if (l.cu === "bite") (drawBiteCloseup(ctx, !!l.bitten), (out.bite = !!l.bitten));
    if (l.cu === "lid") (drawLidView(ctx, l.lift || 0), (out.lid = +(l.lift || 0).toFixed(2)));
    return out;
  }
  /** The room pickup day draws itself: the loading bay. */
  function drawRoom(ctx) {
    const l = live();
    if (!l) return false;
    if (E().room() === "hangar") return ((drew = { step: l.step, ...drawBay(ctx, l) }), true);
    return false;
  }
  /** Over the rooms the older program draws (home, the hall, the hallway): pickup day's things. */
  function draw(ctx) {
    const l = live(),
      e = E();
    if (!l) return;
    const room = e.room(),
      t = e.time(),
      m = e.pos("mops");
    if (room === "hangar") return;
    drew = { step: l.step, room, ...(drewHome || {}) };
    // the hall by day: its guests (53), each with a cone (they only wave at Mops)
    if (room === "hall" && l.step === "push") {
      drew.guests = PK_HALL.guests.map((g) => {
        guests.drawId(ctx, g.kind, g.x, g.y, adultPxFor("hall"), t);
        const bumped = l.bump.by === g.id && t - l.bump.at < 1.6;
        bumped && drawWatchMark(ctx, g.x, g.y - adultPxFor("hall") * 1.2, "?", 1, t);
        return { id: g.id, mark: bumped ? "?" : "" };
      });
    }
    // the hallway robot that reads the label as the crate rolls by
    if (room === "passage" && l.step === "push") e.drawRobot(ctx, PK_HALLWAY.robot.x, PK_HALLWAY.robot.y, false, adultPxFor("passage") / 47);
    // the push: his crate on its pallet in front of Mops
    if (l.crate === "push" && e.get("moPose") !== "hidden") {
      const c = pushedCrate();
      drew.crate = drawPkCrate(ctx, c.x, c.y, c.k, { label: true, bucket: true });
    }
    // the walks: the next doorway's outline
    if (walking(l) && e.get("ctrl")) {
      const d = doorTo(room, routeOf(l)[room]);
      markDoor(ctx, d, t);
      drew.door = d ? d.to : "";
    }
    // the one highlight on the next thing
    if (e.get("ctrl") && !e.current() && !l.cu) {
      const sp = spots().find((q) => q.thing && !q.extra);
      sp && (drew.mark = markBox(ctx, sp.thing, t));
      drew.next = sp ? sp.id : "";
    }
    // 56: the mirror inside the open wardrobe door (a layer, for Brian's yes); his roar's lines
    if (room === "closet" && e.get("wardrobe") === "open" && ["snip", "snipped", "dresstalk", "dress", "dressed", "practice", "practiced", "mirror"].includes(l.step)) drawMirror(ctx, e, PK_HOME.mirror, t, !!l.mirrorOn), (drew.mirror = !!l.mirrorOn);
    if (l.roarAt >= 0 && t - l.roarAt < PK_PACE.shake && room === "closet") drew.roar = roarLines(ctx, headBox("sq"), t - l.roarAt);
    // 57: the hall's guests and their cones (the costume's rule); the plate; the slipped beard
    if (room === "hall" && l.step !== "push" && l.watch) drew.guests = drawHallGuests(ctx, l, t);
    if (room === "hall" && (l.step === "lastwalk" || l.step === "plate")) drawPkPlate(ctx, PK_HALL.plate);
    if (l.fur && room === "hall") drew.fur = slippedBeard(ctx, t);
    if (l.crumbAt >= 0 && t - l.crumbAt < PK_PACE.hold + 0.6) (ctx.save(), (ctx.fillStyle = "#8b5a3c"), ctx.beginPath(), ctx.arc(m.x + 14 * moScale(room), m.y - 34 * moScale(room), 4, 0, 7), ctx.fill(), ctx.restore());
    // 57: the hallway: the office door's sign and the flash under it; a gulp if he saw the frame in the office
    if (room === "passage" && l.step !== "push") drew.sign = drawPhotoSign(ctx, PK_HALLWAY.sign, PK_HALLWAY.under, t);
    if (l.gulpAt >= 0 && t - l.gulpAt < 1.2) drew.sweat = drawGulpSweat(ctx, headBox("sq"), t - l.gulpAt);
    if (l.heartsAt >= 0) drawHearts(ctx, m.x, m.y - 46 * moScale(room), t - l.heartsAt);
    // 59, 60: the office on photo day: the camera on its tripod and the stool; the robot is one of the new ones
    if (room === "office") {
      drawPhotoCorner(ctx);
      drawNewRobotBits(ctx, 280, 500, adultPxFor("office") / 47, 1, t);
      if (l.cu === "frame") (OFFICE_PANELS.esframe[0](ctx), (drew.frame = true));
      if (l.cu === "tape") drew.tape = (drawTapeScreen(ctx, e, { ...l.tape, star: starWord().tag }, t), { ...l.tape });
    }
    // close-ups over the blurred room
    if (l.cu === "note") (blurBehind(ctx), (drew.note = drawNoteCloseup(ctx, 4, t)));
    if (l.cu === "box") (blurBehind(ctx), (drew.box = drawBoxCloseup(ctx, l.cover, t)));
    if (l.cu === "hair") (drawHairCloseup(ctx, t), (drew.hair = "wood"));
    if (l.cu === "snip") (drawSnipCloseup(ctx, !!l.cut, t - l.cuAt, !!(e.get("ch1Escape") && e.get("ch1Escape").star)), (drew.snip = { cut: !!l.cut }));
    if (l.cu === "dress") drew.dress = drawDressCloseup(ctx, e, l.dress, t);
    if (l.cu === "plate") (drawPlateCloseup(ctx), (drew.plate = true));
    if (l.cu === "crayon") (drawCrayonCloseup(ctx, t - l.cuAt), (drew.crayon = true));
  }
  // Home: the things on the room, under the people (the older program calls this as it draws the home picture)
  let drewHome = null;
  function drawOnRoom(ctx) {
    const l = live(),
      e = E();
    drewHome = null;
    if (!l || !e || e.room() !== "closet") return;
    const d = {};
    // the things on the walls, or the pale squares where they hung
    // (the chart is the home picture's own layer, cake-chart.js, there since the first minute; once taken, a pale square)
    PK_HOME.walls.forEach((w, i) => (l.walls[w.id] ? drawPaleSquare(ctx, w.box) : w.id === "chart" ? null : w.id === "brochure" ? drawPinnedBrochure(ctx, w.box) : drawKidDrawing(ctx, w.box, i % 2)));
    d.walls = PK_HOME.walls.filter((w) => !l.walls[w.id]).map((w) => w.id);
    // the crate bed: the note on the pillow, the fur, the white hair; once it is pushed out, the floor where it stood
    if (l.crate !== "bed") drawFloorPatch(ctx, PK_HOME.bedBox, PK_HOME.floorAt);
    else {
      ["wake", "note"].includes(l.step) && drawFoldedNote(ctx, PK_HOME.note);
      PK_HOME.tufts.forEach((q, i) => l.tufts[i] || drawPkTuft(ctx, q.x, q.y, 1.4));
      l.hairOut && !l.packed.box && drawHair(ctx, PK_HOME.hair.x, PK_HOME.hair.y, 46, 2.5);
      l.packed.box && markPacked(ctx, l);
    }
    d.tufts = l.tufts.filter((v) => !v).length;
    // the bucket packed: the floor where it stood (the painted bucket and the bucket drawn over it)
    if (l.packed.bucket) drawFloorPatch(ctx, PK_HOME.bucketPatch, PK_HOME.floorAt);
    drewHome = d;
  }
  // the guests in the hall by day and their cones: dashed with "?" while one holds him; filled once fur shows
  function drawHallGuests(ctx, l, t) {
    const e = E(),
      s = e.pos("sq");
    return PK_HALL.guests.map((g) => {
      const w = l.watch[g.id],
        c = guestCone(g, t),
        on = e.get("sqPose") === "stand" && coneOnBody(c, s, sqScale("hall"));
      drawWatchCone(ctx, c, on && l.fur);
      e.noteCone({ id: c.id, ox: c.ox, oy: c.oy, a: c.a, half: c.half, len: c.len });
      guests.drawId(ctx, g.kind, g.x, g.y, adultPxFor("hall"), t);
      w.mark && drawWatchMark(ctx, g.x, g.y - adultPxFor("hall") * 1.2, w.mark, Math.min(1, w.seenT / COSTUME.slipAfter), t);
      return { id: g.id, mark: w.mark, on, filled: on && l.fur };
    });
  }
  // the beard slipped: it hangs off one side, his fur showing (a PLACEHOLDER drawing over him)
  function slippedBeard(ctx, t) {
    const h = headBox("sq");
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(h.x + h.w / 2, h.y + h.h * 1.05, h.w * 0.35, h.h * 0.3, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#6b4428";
    ctx.fill();
    ctx.translate(h.x + h.w * 0.95, h.y + h.h * 1.1);
    ctx.rotate(0.9 + Math.sin(t * 5) * 0.1);
    ctx.beginPath();
    ctx.moveTo(-8, 0);
    ctx.lineTo(8, 0);
    ctx.lineTo(0, 22);
    ctx.closePath();
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#1e2430";
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    return true;
  }
  // his first bleat comes out a roar: lines round his mouth
  function roarLines(ctx, h, age) {
    ctx.save();
    ctx.globalAlpha = 1 - age / PK_PACE.shake;
    ctx.strokeStyle = "#1e2430";
    ctx.lineWidth = 3;
    for (let i = 1; i <= 3; i++) (ctx.beginPath(), ctx.arc(h.x + h.w, h.y + h.h * 0.8, 10 + i * 10 + age * 30, -0.6, 0.6), ctx.stroke());
    ctx.restore();
    return true;
  }
  // what is packed in the crate bed, drawn on it: the Box on top, the bucket beside it, the label on its front
  function markPacked(ctx, l) {
    const c = PK_HOME.crate;
    ctx.save();
    ctx.fillStyle = "rgb(52,120,246)";
    ctx.strokeStyle = "#1e2430";
    ctx.lineWidth = 3;
    ctx.fillRect(c.x0 + 40, c.y0 + 2, 52, 28);
    ctx.strokeRect(c.x0 + 40, c.y0 + 2, 52, 28);
    ctx.restore();
    l.packed.bucket && drawBucket(ctx, c.x0 + 150, c.y0 + 24, 0.9);
    if (l.packed.label) {
      ctx.save();
      ctx.fillStyle = "#fffdf8";
      ctx.fillRect(c.x0 + 56, c.y1 - 42, 94, 22);
      ctx.strokeRect(c.x0 + 56, c.y1 - 42, 94, 22);
      ctx.restore();
      esWords(ctx, pickupWords("label"), c.x0 + 103, c.y1 - 31, 9, "#1e2430", "center", 900);
    }
  }

  // ---------- taps on the close-ups ----------
  function tap(x, y) {
    const l = live();
    if (!l || !l.cu) return false;
    if (l.cu === "box" && l.step === "packnote") return (packNote(), true);
    if (l.cu === "snip" && l.step === "snip") return (snip(), true);
    if (l.cu === "peel" && l.step === "peel") return (pressPeel(), true);
    if (l.cu === "tape" && l.step === "tape") {
      const b = PK_OFFICE.buttons.find((q) => x >= q.x0 && x <= q.x1 && y >= q.y0 && y <= q.y1);
      b && tapePress(b.id);
      return true;
    }
    if (l.cu === "bite" && l.step === "bite") return (biteCake(), true);
    if (l.cu === "dress" && l.step === "dress") {
      const st = l.dress,
        i = DRESS.shelf.findIndex((p) => Math.hypot(x - p.x, y - p.y) <= DRESS.r);
      if (i >= 0 && !st.on[COSTUME_PIECES[i].id]) return ((st.held = COSTUME_PIECES[i].id), sfx("grab"), true);
      // a piece on him back to the shelf: tap it while holding nothing
      if (!st.held) {
        const k = COSTUME_PIECES.find((p) => st.on[p.id] && Math.hypot(x - costumeSpotAt(st.on[p.id]).x, y - costumeSpotAt(st.on[p.id]).y) < 60);
        k && delete st.on[k.id];
        return true;
      }
      if (x > 400) {
        const spot = ["head", "chin", "body"].sort((a, b) => Math.hypot(x - costumeSpotAt(a).x, y - costumeSpotAt(a).y) - Math.hypot(x - costumeSpotAt(b).x, y - costumeSpotAt(b).y))[0];
        wearPiece(st.held, spot);
      }
      return true;
    }
    return true;
  }

  // ---------- a jump (the localhost link, tests, ↺) ----------
  /** Straight to `step` ("start", or one of PICKUP_STEPS), with everything before it done. */
  function jump(step) {
    const e = E();
    if (step !== "start" && step !== "isfred" && !PICKUP_STEPS.includes(step) && !PK_RESTART_TO[step]) return;
    busy();
    e.set("ch1Journey", false);
    // Day 2's morning is long over (a jump from a link or a test: the home morning's ↺ must not take over)
    const hm = e.get("ch1HomeMorning");
    e.set("ch1HomeMorning", { ...(hm || {}), step: "done", gift: "box", boxOut: false, door: false, bag: "taken", heart: -1 });
    if (step === "start") return start();
    if (!PICKUP_STEPS.includes(step) && step !== "isfred") step = PK_RESTART_TO[step];
    const i = PICKUP_STEPS.indexOf(step);
    const done = (s) => i > PICKUP_STEPS.indexOf(s);
    const l = fresh({
      tufts: PK_HOME.tufts.map(() => (done("mop") ? 1 : 0)),
      hairOut: done("mop"),
      packed: { box: done("pack"), bucket: done("bucket"), label: done("label"), top: done("getin") },
      walls: done("walls") ? Object.fromEntries(PK_HOME.walls.map((w) => [w.id, 1])) : {},
      crate: done("getin") ? "push" : "bed",
    });
    e.set("ch1Pickup", l);
    e.set("ch1D", false);
    e.set("ch1Night", false);
    e.set("costumeOn", false);
    e.set("wardrobe", step === "box" || step === "packnote" ? "open" : "closed");
    e.set("sqPose", "stand");
    e.set("moPose", "stand");
    driving = PK_MOPS_STEPS.includes(step) ? "mops" : "";
    e.playAs(driving ? "mops" : "squatch");
    if (step === "isfred") return (Object.assign(L(), { crate: "ship" }), toOffice(true)); // (59 from Isfred's first line)
    if (i <= PICKUP_STEPS.indexOf("getin")) {
      e.enterRoom("closet", "QB");
      e.place("sq", step === "box" || step === "packnote" ? PK_HOME.closet.x : step === "note" ? PK_HOME.wake.x : PK_HOME.crateAt.x, step === "box" || step === "packnote" ? PK_HOME.closet.y : step === "note" ? PK_HOME.wake.y : PK_HOME.crateAt.y);
      e.place("mops", step === "mop" ? tuftStand(0).x + 60 : PK_HOME.mops.x, step === "mop" ? PK_HOME.tuftY : PK_HOME.mops.y);
      e.face("mops", -1);
      go(step, step === "packnote" ? { cu: "box" } : {});
      return control({ note: "chip-note", box: "chip-box", packnote: "chip-box", mop: "chip-mop", pack: "chip-pack", bucket: "chip-pack", walls: "chip-walls", label: "chip-label", getin: "chip-get-in" }[step]);
    }
    if (step === "tape") return (Object.assign(L(), { crate: "ship" }), toOffice());
    if (step === "cake" || step === "bite" || step === "hide") {
      Object.assign(L(), { crate: "ship" });
      toHold();
      if (step !== "cake") (L().box.where = "open");
      if (step === "bite") return (go("bite", { cu: "bite", bitten: false }), control("chip-hold"));
      if (step === "hide") return (go("hide"), control("chip-hide-crate"));
      return;
    }
    if (i >= PICKUP_STEPS.indexOf("snip")) return jumpLater(step);
    if (step === "push") {
      e.enterRoom("closet", "QB");
      e.set("sqPose", "hidden");
      e.place("sq", -400, -400);
      return startPush();
    }
    // the bay: his crate third in the row; the old robots by the ramp; the new robots back from the scan
    e.enterRoom("hangar", "QB");
    e.set("ch1D", true);
    e.set("ch1Ship", true);
    Object.assign(L(), { crate: "row", things: freshThings(), hat: { where: "bin" } });
    L().things.bag.where = "ship";
    L().bots = [...PK_BAY.oldLine.map((p, k) => robot("old" + k, "old", p, -1)), robot("new0", "new", PK_BAY.botsBack[0], 1), robot("new1", "new", PK_BAY.botsBack[1], 1)];
    e.set("sqPose", "hidden");
    e.place("sq", PK_BAY.row[2].x, PK_BAY.row[2].y);
    e.place("mops", step === "warn" ? PK_BAY.door.x : step === "bleat" ? PK_BAY.bleatAt.x : PK_BAY.knockAt.x, step === "warn" ? PK_BAY.door.y + 60 : step === "bleat" ? PK_BAY.bleatAt.y : PK_BAY.knockAt.y);
    if (step === "warn" || step === "knock" || step === "bleat") return (go(step), control(step === "bleat" ? "chip-bleat-robot" : "chip-warn"));
    bots("new0", "new1").forEach((b) => ((b.f = -1), (b.a = Math.PI), (b.phase = "mops")));
    e.place("mops", PK_BAY.mopsAside.x, PK_BAY.mopsAside.y);
    if (step === "climb") return (go("climb"), control("chip-climb"));
    if (step === "sneak") return climbOut();
    // home: the crate is on the ship; he walks home from the plant
    L().things.his.where = "ship";
    L().things.crate.where = "ship";
    L().two = "done";
    sneakHome();
  }

  // 56 to 58: the costume, the last walk, the scanner (everything before done: the crate is on the ship)
  function jumpLater(step) {
    const e = E(),
      l = L();
    Object.assign(l, { crate: "ship" });
    const i = PICKUP_STEPS.indexOf(step);
    e.set("costumeOn", i > PICKUP_STEPS.indexOf("dress"));
    if (i <= PICKUP_STEPS.indexOf("lastwalk")) {
      e.enterRoom("closet", "QB");
      e.set("wardrobe", step === "lastwalk" ? "closed" : "open");
      e.place("sq", PK_HOME.mirrorSq.x, PK_HOME.mirrorSq.y + 40);
      e.place("mops", PK_HOME.mirrorMops.x + 40, PK_HOME.mirrorMops.y + 40);
      e.face("mops", -1);
      if (step === "snip") return (go("snip", { cu: "snip", cut: false }), control("chip-snip"));
      if (step === "dress") return (go("dress", { cu: "dress", dress: { on: {}, held: "" } }), control("chip-jacket"));
      if (step === "practice") return (go("practice", { bleats: 0 }), control("chip-bleat"));
      return lastWalk();
    }
    e.enterRoom("hangar", "QB");
    e.set("ch1D", true);
    e.set("ch1Ship", true);
    Object.assign(l, { place: "bay", things: null, bots: [Object.assign(robot("r0", "new", PK_BAY.rampBot, -1), { a: Math.PI * 0.92 }), robot("old0", "old", { x: 760, y: 520 }, 1), robot("old1", "old", { x: 820, y: 600 }, 1)], box: { ...PK_BAY.box, where: step === "pickbox" ? "floor" : "mops" } });
    e.place("sq", step === "pickbox" ? PK_BAY.door.x + 80 : step === "toscan" ? PK_BAY.box.x : PK_BAY.archFront.x - 40, step === "pickbox" ? PK_BAY.door.y + 100 : step === "toscan" ? PK_BAY.box.y + 30 : PK_BAY.archFront.y + 20);
    e.place("mops", step === "pickbox" ? PK_BAY.door.x + 20 : PK_BAY.archFront.x + 30, step === "pickbox" ? PK_BAY.door.y + 110 : PK_BAY.archFront.y + 40);
    if (["board", "peel", "ramp"].includes(step)) e.place("mops", PK_BAY.mopsTop.x, PK_BAY.mopsTop.y);
    if (step === "peel" || step === "ramp") (e.place("sq", PK_BAY.rampFoot.x, PK_BAY.rampFoot.y), (l.scanSq = step === "peel" ? 1 : -1));
    l.trail = freshTrail();
    step === "botbleat" && (l.bots[0].mark = "?");
    go(step, step === "peel" ? { cu: "peel", pressed: false } : {});
    control({ pickbox: "chip-box58", toscan: "chip-scanner", botbleat: "chip-scanner", goship: "chip-go-ship", board: "chip-board", peel: "chip-board", ramp: "chip-board" }[step]);
  }

  return {
    start,
    jump,
    /** ↺ in a part where the player has no control: back to its last step he controlled. True when it did. */
    restart() {
      const l = live();
      if (!l || PICKUP_STEPS.includes(l.step)) return false;
      const to = PK_RESTART_TO[l.step];
      if (!to) return false;
      jump(to);
      return true;
    },
    /** True from the morning of pickup day until it hands over. */
    active() {
      return !!live();
    },
    /** True while pickup day draws the room on screen (the loading bay; the hall on a walk: only its walls and solids). */
    ownsRoom() {
      const l = live(),
        r = l && E().room();
      return r === "hangar" || (r === "hall" && walking(l));
    },
    /** True while a robot has seen him and security is out (no music then: bridge.js refineCue). */
    alarmOn() {
      const l = live();
      return !!(l && l.guard);
    },
    alarmKey() {
      return live() || null;
    },
    /** Where a speaker's bubble points, in the rooms and close-ups pickup day draws (bridge.js speakerAt). */
    speakerAt(who) {
      const l = live(),
        e = E();
      if (!l) return null;
      const room = e.room();
      if (who === "sq" && l.cu === "slat") return { x: 110, y: 500 };
      if (who === "sq" && e.get("sqPose") === "hidden") {
        if (room === "hangar" && ["held", "idea"].includes(l.step)) return { x: PK_BAY.eyes.x, y: PK_BAY.eyes.y - 20 };
        if (l.crate === "push") {
          const c = pushedCrate();
          return { x: c.x, y: c.y - 100 * c.k };
        }
        if (room === "hangar" && l.things) return { x: l.things.his.x, y: l.things.his.y - 70 };
        return { x: PK_HOME.crate.x0 + 100, y: PK_HOME.crate.y0 - 20 };
      }
      if (room === "hangar" && who === "robot") {
        const b = l.bots[l.talker || 0];
        if (b) return { x: b.x, y: b.y - 80 };
      }
      if (room === "hangar" && who === "scanner") return { x: (PK_BAY.arch.x0 + PK_BAY.arch.x1) / 2, y: PK_BAY.arch.y0 - 10 };
      if (room === "hall" && who === "tourist") {
        const m = e.pos("mops"),
          g = PK_HALL.guests.slice().sort((a, b) => Math.hypot(a.x - m.x, a.y - m.y) - Math.hypot(b.x - m.x, b.y - m.y))[0];
        return { x: g.x, y: g.y - adultPxFor("hall") * 1.3 };
      }
      if (room === "passage" && who === "robot") return { x: PK_HALLWAY.robot.x, y: PK_HALLWAY.robot.y - 80 };
      if (room === "office" && who === "robot") return { x: 280, y: 400 };
      if (room === "office" && who === "official") return l.cu === "tape" ? { x: 480, y: 640 } : { x: 430, y: 390 };
      if (room === "hangar" && l.place === "hold" && who === "ups") return l.crew ? { x: PK_HOLD.crate.x + 230, y: PK_HOLD.crate.y - 220 } : { x: 120, y: 120 };
      // over a close-up (the snip, the dress-up, the plate, the drawing, the peel): the bubbles go along the bottom
      if (l.cu && l.cu !== "slat" && (who === "sq" || who === "mops")) return { x: who === "sq" ? 330 : 630, y: 640 };
      return null;
    },
    tick,
    spots,
    tap,
    draw,
    drawOnRoom,
    /** True when the home picture's bed or bucket is gone (pushed out, packed): the older program does not draw it over him. */
    gone(id) {
      const l = live();
      return !!(l && E().room() === "closet" && ((id === "bed" && l.crate !== "bed") || (id === "bucket" && l.packed.bucket)));
    },
    drawRoom,
    bounds() {
      const l = live();
      return l && E().room() === "hall" && walking(l) ? LUNCH_BOUNDS : null;
    },
    /** What feet cannot walk through in the rooms pickup day owns: the bay's things and the mail room's row; the hall's. */
    solids() {
      const l = live(),
        r = l && E().room();
      // (the guests stand in the hall on the push and the last walk; on the walk home in 55 the hall is empty)
      if (r === "hall" && walking(l)) return [...LUNCH_SOLIDS.map((b) => ({ ...b })), ...(l.step === "home" ? [] : PK_HALL.guests.map((g) => ({ x0: g.x - 25, x1: g.x + 25, y0: g.y - 14, y1: g.y + 8, person: 1 })))];
      if (r === "hangar") {
        const row = Object.entries(l.things || {})
          .filter(([, th]) => th.where === "row")
          .map(([, th]) => ({ id: "row", x0: th.x - 60, x1: th.x + 60, y0: th.y - 20, y1: th.y + 8 }));
        return [...BAY_SOLIDS.map((b) => ({ ...b })), { id: "open crate", x0: 232, x1: 370, y0: 470, y1: 509 }, ...row];
      }
      return [];
    },
    /** Feet nobody walks through in rooms another drawing owns: the hallway robot that reads the label on the push. */
    extraSolids(r) {
      const l = live();
      if (!(l && l.step === "push" && r === "passage")) return [];
      const q = PK_HALLWAY.robot;
      return [{ id: "hallway robot", x0: q.x - 25, x1: q.x + 25, y0: q.y - 14, y1: q.y + 8, person: 1 }];
    },
    /** Pickup day comes after he rubbed his crayon out of the crate bed's stamp (39b): none in the stamp. */
    crayonGone() {
      return !!E().get("ch1Pickup");
    },
    /** Tests: the places. */
    place: Object.freeze({ PK_HOME, PK_HALL, PK_HALLWAY, PK_BAY, ES_DOORS, tuftStand }),
    /** Tests: the state, what the last frame drew, the steps so far. */
    debug() {
      const l = L();
      return { state: l ? JSON.parse(JSON.stringify(l)) : null, active: !!live(), drew, steps: record.steps.slice(), sounds: record.sounds.slice(), driving };
    },
  };
}
