/**
 * Every Chapter 1 goal the player acts on has a highlighted target and an action prompt.
 * Goals whose action happens right where Squatch stands get no ring (Brian, 2026-11-14), only the prompt.
 * Brian's repeat rule (raised at least six times, Nov 8 to Nov 15): the place to go is shown by outlining
 * the real thing in dashed yellow, never by a circle or box on the floor and never by an arrow. No goal may
 * draw a yellow circle or arrow; goals whose thing is in a locked picture are outlined; the rest (props
 * the game draws, Mops) are KNOWN until they get outlines (repeat-issues.md, issue 2).
 *   node tests/every-goal-has-target.mjs
 */
import { readFileSync } from "node:fs";
import { startGame } from "./game-page.mjs";

const src = ["game/12-ch1-redesign.js", "game/13-ch1-slice.js", "game/14-ch1-day2.js", "modules/party-lines.js", "modules/home-morning-lines.js", "modules/lunch-sneak-lines.js", "modules/loading-bay-lines.js", "modules/evening-lines.js", "modules/escape-lines.js", "modules/pickup-lines.js"]
  .map((f) => readFileSync(new URL("../src/" + f, import.meta.url), "utf8"))
  .join("\n");
const chips = [...src.matchAll(/Squatch: [^"]+/g)].map((m) => m[0]);
const unique = [...new Set(chips)];

const g = await startGame({ port: 8833, name: "every-goal" });
const { ctx, page, errors } = await g.open("?ch=1");
await page.evaluate(() => window.__ss.lockedReady);

const report = await page.evaluate(async (chips) => {
  const ss = window.__ss;
  const n = ss.op;
  const story = new Set([
    "Squatch: go with Mops to the ship",
    "Squatch: hide and watch",
    "Squatch: talk with Mops at home",
    "Squatch: watch Mops",
    // (the octopus's chase, Brian 2026-11-25: the goal is to keep away from him; there is no thing to go to)
    "Squatch: get away from the octopus!",
    // (night one's vent cutscene, beat 42, its still: 14-ch1-day2.js ch1JumpBeat 142; the player has no control there)
    "Squatch: hide by the vent",
  ]);
  const play = {
    "Squatch: walk around the room": { scene: "O1", room: "closet", day2: false, walk: true, x: 500, y: 530 },
    "Squatch: sing along with Mops": { scene: "Q1", room: "closet", song: true, day2: false },
    // The party night (src/modules/party.js): each opens its scene. Walking through a doorway is the action
    // there (no button), so those goals count the walk, as "walk around the room" does.
    "Squatch: peek out the door": { party: "P1", x: 860, y: 480 },
    "Squatch: sneak to the plant": { party: "P2", x: 400, y: 552 },
    // he stands a step from his door, outside its trigger (party-hall.js HALL_DOOR, a 36 px circle round the doorway)
    // P4, the flyer sneak: the flyer on the bar counter's far end first (he stands within reach of it), then, with
    // it in his paw, his door.
    "Squatch: grab the flyer": { party: "P4", out: true, x: 788, y: 420 },
    "Squatch: sneak home for a disguise": { party: "P4", out: true, flyer: "paw", walk: true, x: 477, y: 540 },
    "Squatch: run home and hide!": { party: "P2", alarm: true, walk: true, x: 520, y: 560 },
    // home with the flyer (Brian 2026-11-25): his bed glows and SAVE · flyer lays it on top (2026-11-26)
    "Squatch: put the flyer on your bed for Mops": { party: "P4", home: true, flyer: "paw", x: 790, y: 480 },
    // the group photo once the 3-2-1 starts (Brian 2026-11-26, #46): JOIN · photo, the gap glows
    "Squatch: join the group photo": { party: "P6", shot: true, x: 600, y: 470 },
    // the home morning (src/modules/home-morning.js), each opened by its own jump with everything before it done
    "Squatch: pick up the gift": { hm: "rocket" },
    "Squatch: put the gift in the box": { hm: "closet" },
    // (Brian 2026-11-26, video note 0:30: he walks over to the bag and sees it first; the bag is outlined, no button)
    "Squatch: go to the bag by the door": { hm: "toBag", walk: true, x: 846, y: 480 },
    "Squatch: take the lunch": { hm: "lunch" },
    // the lunch sneak (src/modules/lunch-sneak.js), each opened by its own jump with everything before it done; he
    // stands where its button comes up (by Mops; behind the counter). The sneak's goal is the hallway doorway, which
    // is walk-through (Brian #47): he is hidden behind the crates (no button), a step from the doorway's opening.
    "Squatch: take Mops his lunch in the hallway": { lu: "door", walk: true, x: 900, y: 330 },
    "Squatch: give Mops his lunch": { lu: "give", x: 540, y: 488 },
    "Squatch: grab one snack": { lu: "snack" },
    // the loading bay (src/modules/loading-bay.js), each step opened by the beat's own jump; he stands where its button
    // comes up, or (the hallway's far doorway, the bay's doorway home, the snack counter in the party hall: walked
    // into, no button) a step from it
    "Squatch: follow Mops to the ship": { bayStep: "hallway", walk: true, x: 900, y: 330 },
    "Squatch: hide behind the cargo": { bayStep: "cargo", x: 176, y: 350 },
    "Squatch: peek at the form": { bayStep: "peek" },
    "Squatch: go home with Mops": { bayStep: "home", walk: true, x: 90, y: 336 },
    "Squatch: get past the robots": { bayStep: "hall", walk: true, x: 800, y: 560 },
    // the evening and night one (src/modules/evening.js), each opened by its own jump with everything before it done;
    // a doorway walked through is the action there (walk), as at the party
    // (he stands a step from each doorway, outside the circle that takes him through it)
    "Squatch: go on": { ev: "wall", galleryDone: true, walk: true, x: 100, y: 300 },
    "Squatch: look at the photos": { ev: "wall", x: 480, y: 300 }, // (round 7, q: 128: the photos outlined first)
    "Squatch: hide": { ev: "hide", x: 852, y: 326 },
    "Squatch: roll up!": { ev: "dodge", x: 700, y: 430 },
    "Squatch: go on to the hall": { ev: "past", walk: true, x: 100, y: 300 },
    "Squatch: peek at the window": { ev: "peek" },
    "Squatch: duck!": { ev: "duck" },
    "Squatch: grab the brochure": { ev: "brochure" },
    "Squatch: open the box from the Guardians": { ev: "box" },
    "Squatch: bite the cake": { ev: "bite" },
    "Squatch: mark the chart": { ev: "chart", x: 236, y: 440 },
    "Squatch: hold the brochure up to your crate": { ev: "crate", x: 330, y: 458 },
    "Squatch: go home": { ev: "gohome", walk: true, x: 477, y: 555 },
    "Squatch: show Mops the brochure": [{ ev: "show" }, { es: "show", x: 380, y: 556, look: [400, 500] }], // (beat 40, the evening, and beat 45, the escape)
    "Squatch: go to sleep in your bed": { ev: "bed", x: 330, y: 458 },
    "Squatch: sneak out the door": { ev: "out", walk: true, x: 860, y: 380 },
    "Squatch: get the copies from the bin": { ev: "bin", x: 212, y: 398 },
    "Squatch: get the form from the bin": { ev: "bin", x: 212, y: 398 },
    "Squatch: get the yellow copy to the mailbox": { ev: "post", x: 862, y: 500 },
    "Squatch: post the yellow copy": { ev: "post", x: 862, y: 500 },
    // (ROLL · ball works anywhere in the night's loading bay, so it is what the button offers on the way to the doorway)
    "Squatch: sneak home": { ev: "back", walk: true, x: 105, y: 290, anywhere: "ROLL · ball" },
    // the escape (src/modules/escape.js), each opened by its own jump with everything before it done; `look` is where
    // its glow or outline is (the vent, the slip in Mops's mouth, the computer, the wardrobe); the close-ups (the
    // keypad, the snacks, the Guardians' plate) are tapped, and their thing glows
    "Squatch: look at your crate": { es: "crate", x: 330, y: 500, look: [184, 392] },
    "Squatch: look at the calendar": { es: "cal", x: 230, y: 392, look: [133, 192] },
    "Squatch: sneak to the big vent": { es: "sneak", walk: true, x: 380, y: 556, look: [916, 362] },
    "Squatch: go to the office door": { es: "tohall", walk: true, look: [36, 262] },
    "Squatch: book the empty crate on the computer": { es: "computer", x: 610, y: 585, look: [735, 300] },
    "Squatch: hide under the desk": { es: "duck", x: 700, y: 585, look: [600, 446] },
    "Squatch: take the label": { es: "label", closeUp: true, look: [480, 600] },
    "Squatch: go to the snack bar": { es: "tobar", walk: true, look: [480, 133] },
    "Squatch: roll into a ball by the vent": { es: "ball", x: 846, y: 322, look: [800, 220] },
    "Squatch: grab the pink slip": { es: "grab", x: 850, y: 334, look: [796, 290] },
    "Squatch: type the code from the pink slip": { es: "pad", closeUp: true, look: [220, 276] },
    "Squatch: return the empty crate": { es: "computer", x: 610, y: 585, look: [735, 300] },
    "Squatch: take the snacks": { es: "snacks", closeUp: true, look: [330, 400] },
    "Squatch: leave food for the Guardians": { es: "food", closeUp: true, look: [850, 420] },
    "Squatch: hide the pink slip": { es: "closet", x: 300, y: 398, look: [172, 300] },
    // pickup day (src/modules/pickup.js): each opens its step; `thing` looks for the outline round the spot's thing
    "Squatch: read the note": { pk: "note", thing: true },
    "Squatch: open the Guardian Box": { pk: "box", thing: true },
    "Squatch: pack the crate": { pk: "pack", thing: true },
    "Squatch: take the things off the walls": { pk: "walls", thing: true },
    "Squatch: put the label on the crate": { pk: "label", thing: true },
    "Squatch: get in the crate": { pk: "getin", thing: true },
    "Squatch: climb out of the crate": { pk: "climb" },
    "Squatch: hide in the bay's plant": { pk: "sneak", x: 300, y: 560, thing: true },
    "Squatch: walk home with Mops": { pk: "home", walk: true, look: [36, 300] },
    "Squatch: put on the spare jacket": { pk: "dress", closeUp: true },
    "Squatch: practice your bleat": { pk: "practice" },
    "Squatch: walk to the ship": { pk: "lastwalk", walk: true, look: [916, 400] },
    "Squatch: pick up the box": { pk: "pickbox", thing: true },
    "Squatch: walk to the scanner": { pk: "toscan", walk: true, look: [466, 310] },
    "Squatch: walk through the scanner": { pk: "board", thing: true },
    "Squatch: open this week's box": { pk: "cake", thing: true },
    "Squatch: hide in the crate": { pk: "hide", thing: true },
  };
  const missing = chips.filter((c) => !play[c] && !story.has(c));
  const yellowNear = (x, y) => {
    const cv = document.querySelector("canvas[width='960']") || document.querySelector("canvas");
    const k = cv.width / 960;
    const cx = cv.getContext("2d", { willReadFrequently: true });
    let hit = 0;
    for (let dy = -60; dy <= 60; dy += 8)
      for (let dx = -60; dx <= 60; dx += 8) {
        const p = cx.getImageData(Math.round((x + dx) * k), Math.round((y + dy) * k), 1, 1).data;
        if (p[0] > 160 && p[0] > p[2] + 40 && p[1] > 100 && p[1] + 15 > p[2]) hit++;
      }
    return hit;
  };
  const bad = [],
    ringed = [],
    outlined = [],
    unoutlined = [],
    farOutline = [];
  // Every yellow circle the frame draws (radius 30 or more, so eyes and dots are not counted). Chapter 1
  // draws some highlights itself instead of through ringZone, so the drawing calls are watched directly.
  const yellowCircles = new Set();
  const proto = CanvasRenderingContext2D.prototype;
  // Any yellow: hex, rgb() or rgba(), red and green high, blue well below them (the game's yellows include #ffcf33, #ffe08a, #ffd23f).
  const isYellow = (st) => {
    if (typeof st !== "string") return false;
    let m = st.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i),
      c = m ? m.slice(1, 4).map((h) => parseInt(h, 16)) : (st.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/) || []).slice(1, 4).map(Number);
    return c.length === 3 && c[0] > 200 && c[1] > 150 && c[2] < c[1] - 60;
  };
  let arcs = [];
  const { arc, beginPath, stroke, fill } = proto;
  proto.beginPath = function () {
    arcs = [];
    lines = 0;
    return beginPath.apply(this, arguments);
  };
  proto.arc = function (x, y, r, a0, a1) {
    if (r >= 20 && Math.abs(a1 - a0) >= Math.PI) arcs.push(`${Math.round(x)},${Math.round(y)} r${Math.round(r)}`);
    return arc.apply(this, arguments);
  };
  const { ellipse } = proto;
  proto.ellipse = function (x, y, rx, ry, rot, a0, a1) {
    if (Math.min(rx, ry) >= 20 && Math.abs(a1 - a0) >= Math.PI) arcs.push(`${Math.round(x)},${Math.round(y)} e${Math.round(rx)}x${Math.round(ry)}`);
    return ellipse.apply(this, arguments);
  };
  // Mops's mop bucket is yellow (mop-bucket.js, Brian's yes 2026-11-26, "Let's go with it moving forward"): a prop,
  // not a highlight, so its own drawing is not counted (it is found by the bucket's drawing functions on the stack).
  const prop = () => /drawMopBucket(Back|Front)|drawHomeMopBucket/.test(new Error().stack || "");
  proto.stroke = function () {
    if (prop()) return stroke.apply(this, arguments);
    if (isYellow(this.strokeStyle)) arcs.forEach((a) => yellowCircles.add(a));
    // A stroked chevron: two or three straight lines, no curve, not dashed (outlines of doorways use strokeRect).
    if (isYellow(this.strokeStyle) && lines >= 2 && lines <= 4 && !arcs.length && !this.getLineDash().length) yellowCircles.add("arrow");
    return stroke.apply(this, arguments);
  };
  proto.fill = function () {
    if (prop()) return fill.apply(this, arguments);
    if (isYellow(this.fillStyle)) arcs.forEach((a) => yellowCircles.add(a));
    if (isYellow(this.fillStyle) && lines >= 2 && lines <= 4 && !arcs.length) yellowCircles.add("arrow");
    return fill.apply(this, arguments);
  };
  // Yellow arrows: a filled yellow shape of two or three straight lines.
  let lines = 0;
  const { lineTo } = proto;
  proto.lineTo = function () {
    lines++;
    return lineTo.apply(this, arguments);
  };
  // (a chip two beats show has one spec for each)
  for (const [chip, spec] of Object.entries(play).flatMap(([c, s]) => [].concat(s).map((x) => [c, x]))) {
    if (spec.hm) {
      Object.assign(n, { ch1PartyNow: null, ch1Morning: null, ch1Lunch: null, ch1Zoom: null, ch1PadOn: false, ch1Pickup: null, q: [], cur: null });
      ss.ch1JumpBeat(22);
      window.SSQ.beat("ch1-home-morning").jump(spec.hm);
      // at the wardrobe step he has walked there (where OPEN · closet works)
      spec.hm === "closet" && ((n.sq.x = 300), (n.sq.y = 398));
      ((n.chip = chip), (n.moved = 200));
    } else if (spec.lu) {
      Object.assign(n, { ch1PartyNow: null, ch1Morning: null, ch1Zoom: null, ch1PadOn: false, ch1Pickup: null, q: [], cur: null });
      ss.ch1JumpBeat(22);
      window.SSQ.beat("ch1-lunch").jump(spec.lu);
      spec.x && ((n.sq.x = spec.x), (n.sq.y = spec.y));
      ((n.chip = chip), (n.moved = 200));
    } else if (spec.bayStep) {
      Object.assign(n, { ch1PartyNow: null, ch1Morning: null, ch1Zoom: null, ch1PadOn: false, q: [], cur: null });
      ss.ch1JumpBeat(29);
      Object.assign(n, { q: [], cur: null });
      window.SSQ.beat("ch1-bay").jump(spec.bayStep);
      for (let i = 0; i < 400 && !(n.ctrl && !n.cur && window.SSQ.beat("ch1-bay").debug().state.step === spec.bayStep); i++) (ss.tick(0.05), n.cur && n.cur.k === "bub" && ((n.bt = 1), ss.opTap()));
      spec.x && ((n.sq.x = spec.x), (n.sq.y = spec.y));
      ((n.chip = chip), (n.moved = spec.walk ? 0 : 200));
    } else if (spec.ev) {
      Object.assign(n, { ch1PartyNow: null, ch1Morning: null, ch1Zoom: null, ch1PadOn: false, q: [], cur: null });
      ss.ch1JumpBeat(37);
      window.SSQ.beat("ch1-evening").jump(spec.ev);
      spec.galleryDone && (n.ch1Evening.galleryDone = true);
      spec.x && ((n.sq.x = spec.x), (n.sq.y = spec.y));
      ((n.chip = chip), (n.moved = 200));
    } else if (spec.es) {
      // (the beats before it are over: the bay's and the evening's states are cleared, as a jump to the escape does)
      Object.assign(n, { ch1PartyNow: null, ch1Morning: null, ch1Lunch: null, ch1Bay: null, ch1Evening: null, ch1Zoom: null, ch1PadOn: false, ch1Pickup: null, q: [], cur: null, ch1Day2: true });
      window.SSQ.beat("ch1-escape").jump(spec.es === "food" ? "snacks" : spec.es);
      spec.es === "food" && Object.assign(n.ch1Escape, { step: "food" }, { snacks: { ...n.ch1Escape.snacks, plate: true } }) && (n.ch1Step = "es-food");
      spec.x && ((n.sq.x = spec.x), (n.sq.y = spec.y));
      ((n.chip = chip), (n.moved = 200));
    } else if (spec.pk) {
      Object.assign(n, { ch1PartyNow: null, ch1Morning: null, ch1Lunch: null, ch1Bay: null, ch1Evening: null, ch1Escape: null, ch1Zoom: null, ch1PadOn: false, q: [], cur: null, ch1Day2: true });
      window.SSQ.beat("ch1-pickup").jump(spec.pk);
      // he stands where the step's button comes up (the spot's own place), or where the spec says
      const sp0 = (ss.spotsNow() || []).find((q) => q && q.verb && q.who === "sq" && q.r > 0 && !q.hot);
      spec.x ? ((n.sq.x = spec.x), (n.sq.y = spec.y)) : sp0 && ((n.sq.x = sp0.x), (n.sq.y = sp0.y));
      ((n.chip = chip), (n.moved = 200));
    } else if (spec.party) {
      Object.assign(n, { ch1Day2: false, ch1Lunch: null, ch1Bay: null, ch1Zoom: null, ch1PadOn: false, ch1Morning: null, q: [], cur: null, moPose: "hidden" });
      window.SSQ.beat("ch1-party").jump(spec.party);
      const p = n.ch1PartyNow;
      spec.out && ((p.pose = "stand"), (n.sqPose = "stand"));
      spec.flyer && (p.flyer = spec.flyer);
      spec.home && (window.SSQ.engine().enterRoom("closet", "Q1"), (p.phase = "save"), (p.pose = "stand"), (n.sqPose = "stand"));
      spec.shot && ((p.shot = { phase: "count", t: 0, n: 3, in: false, got: false }), (p.bandAt = [[258, 256], [308, 256], [358, 256]].map(([x, y]) => ({ x, y }))));
      spec.alarm && (p.alarm = { phase: "search", t: 0, st: 0, w: { id: "backpack", x: 880, y: 318, hx: 600, hy: 490 }, where: "where-hall", who: "who-tourist", guards: [], bell: 9, last: null, hidden: "" });
      ((n.sq.x = spec.x), (n.sq.y = spec.y), (n.ch1Chip = chip), (n.chip = chip), (n.moved = 200));
    } else {
    n.ch1PartyNow = null;
    n.ch1HomeMorning = null;
    n.ch1Lunch = null;
    n.ch1Bay = null;
    n.ch1Evening = null;
    n.ch1Escape = null;
    n.ch1Pickup = null;
    n.ch1Day2 = spec.day2 !== false;
    // The song step of the morning module (src/modules/morning.js), with Mops beside the bucket.
    n.ch1Morning = spec.song ? { step: "song", t: 0, notes: true } : null;
    spec.song && ((n.mo.x = 690), (n.mo.y = 560));
    n.ch1PadOn = !!spec.pad;
    n.ch1Zoom = spec.zoom ? { id: spec.zoom, zoom: 1, paw: { x: 400, y: 400 }, bag: 0, gone: {} } : null;
    n.scene = spec.scene || "QB";
    n.room = spec.room;
    n.ch1D = !!spec.bay;
    n.ch1Duct = false;
    n.ch1Office = false;
    n.ch1Step = spec.step || "";
    n.ch1Chip = chip;
    n.ctrl = true;
    n.q = [];
    n.cur = null;
    n.sqPose = "stand";
    n.moPose = "stand";
    n.sq.x = spec.x || 400;
    n.sq.y = spec.y || 520;
    n.moved = spec.walk ? 0 : 200;
    n.chip = chip;
    }
    for (let i = 0; i < 12; i++) ss.tick(0.05);
    yellowCircles.clear();
    n.lastRing = null;
    ss.drawFrame();
    const spots = (ss.spotsNow() || []).filter((s) => s && s.verb);
    const offer = ss.offerNow();
    const at = spots[0] || { x: spec.x, y: spec.y };
    // Rule (Brian, 2026-11-14): no ring when the action happens where Squatch stands, so those goals need only the prompt.
    const onSquatch = !!spots[0] && (!!spots[0].hot || (Math.abs(spots[0].x - n.sq.x) < 2 && Math.abs(spots[0].y - n.sq.y) < 2));
    const th = spec.thing && spots[0] && spots[0].thing && [spots[0].thing.x0, spots[0].thing.y0, spots[0].thing.x1, spots[0].thing.y1].every(Number.isFinite) ? spots[0].thing : null;
    spec.thing && !th && bad.push({ chip, thing: "no thing to outline", spot: spots[0] && spots[0].id });
    const noPlace = !onSquatch && !th && !spec.look && !Number.isFinite(at.x || spec.x);
    const yellow = noPlace ? 0 : onSquatch ? 1 : th ? yellowNear((th.x0 + th.x1) / 2, (th.y0 + th.y1) / 2) + yellowNear(th.x0, th.y0) : spec.look ? yellowNear(...spec.look) : yellowNear(at.x || spec.x, at.y || spec.y);
    // (an escape close-up is its own prompt: the keys, the snacks and the plate are what he taps)
    const prompt = spec.pad ? n.ch1PadOn : spec.closeUp ? !!((n.ch1Escape && n.ch1Escape.cu) || (n.ch1Pickup && n.ch1Pickup.cu)) : spec.walk ? true : !!(offer && offer.verb);
    const target = spec.walk || spec.pad || spec.closeUp || spots.length > 0;
    for (const r of ss.rings()) ringed.push(`${chip} -> ${r.box ? "box" : "circle"} ring and arrow on ${r.id}`);
    for (const c of yellowCircles) ringed.push(`${chip} -> yellow ${c === "arrow" ? "arrow" : "circle at " + c}`);
    // Where the goal's thing is away from Squatch, the outline round it (src/modules/goal-targets.js).
    // The outline must be round the goal's own thing: the one whose action is offered where the goal is done.
    if (n.lastRing && n.lastRing.box) {
      outlined.push(chip);
      const offered = offer && offer.verb ? offer.verb + " · " + offer.cap : "";
      offered && offered !== n.lastRing.act && offered !== spec.anywhere && farOutline.push(`${chip}: outline for ${n.lastRing.act}, action offered is ${offered}`);
    } else unoutlined.push(chip);
    if (!target || yellow < 1 || !prompt) bad.push({ chip, target, yellow, prompt, verb: offer && offer.verb, spots: spots.length });
  }
  return { missing, bad, ringed, outlined, unoutlined, farOutline, checked: Object.keys(play).length, story: [...story] };
}, unique);

g.check("every Chapter 1 goal chip is classified", report.missing.length === 0, report.missing);
g.check(
  "every player goal has a highlighted target and an action prompt up close",
  report.bad.length === 0,
  report.bad.slice(0, 8),
);
g.check("no goal is marked with a yellow circle, a floor ring or an arrow", report.ringed.length === 0, report.ringed);
g.check("at least 14 goals outline their real thing (doors, plants, bin, mailbox, vent, calendar, wardrobe)", report.outlined.length >= 14, report.outlined);
g.check("each outline is round the thing whose action is offered where the goal is done", report.farOutline.length === 0, report.farOutline);
g.known(`${report.unoutlined.length} of ${report.checked} goals have no outline yet (props the game draws, Mops, close-ups, and Squatch's own spot)`, report.unoutlined.length > 0, report.unoutlined);
g.check("story goals are named (the four story goals, the octopus chase and night one's vent cutscene)", report.story.length === 6, report.story);
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("every-goal");
