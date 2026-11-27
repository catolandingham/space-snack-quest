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

const src = ["game/12-ch1-redesign.js", "game/13-ch1-slice.js", "game/14-ch1-day2.js", "modules/party-lines.js", "modules/home-morning-lines.js", "modules/lunch-sneak-lines.js", "modules/escape-lines.js"]
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
    "Squatch: hide in the plant": { step: "hide", room: "hangar", bay: true, x: 230, y: 400 },
    "Squatch: go on": { step: "photos", room: "passage", x: 480, y: 560 },
    "Squatch: hide": { step: "family", room: "hall", scene: "Q3", x: 520, y: 530 },
    "Squatch: go home": { step: "gohome", room: "hall", scene: "Q3", x: 480, y: 560 },
    "Squatch: get the copies from the bin": { step: "grab", room: "hangar", bay: true, scene: "Q4", x: 212, y: 370 },
    "Squatch: get the yellow copy to the mailbox": { step: "post", room: "hangar", bay: true, scene: "Q4", x: 878, y: 450 },
    "Squatch: check the order": { step: "mark", room: "hangar", bay: true, zoom: "paw", x: 212, y: 370 },
    "Squatch: post the yellow copy": { step: "post", room: "hangar", bay: true, scene: "Q4", x: 878, y: 450 },
    "Squatch: sneak home": { step: "out", room: "hangar", bay: true, x: 90, y: 540 },
    // the escape (src/modules/escape.js), each opened by its own jump with everything before it done; `look` is where
    // its glow or outline is (the vent, the slip in Mops's mouth, the computer, the wardrobe); the close-ups (the
    // keypad, the snacks, the Guardians' plate) are tapped, and their thing glows
    "Squatch: show Mops the brochure": { es: "show", x: 380, y: 556, look: [400, 500] },
    "Squatch: look at your crate": { es: "crate", x: 330, y: 500, look: [184, 392] },
    "Squatch: look at the calendar": { es: "cal", x: 230, y: 392, look: [133, 192] },
    "Squatch: sneak to the big vent": { es: "sneak", walk: true, x: 380, y: 556, look: [916, 362] },
    "Squatch: roll into a ball by the vent": { es: "ball", x: 846, y: 322, look: [800, 220] },
    "Squatch: grab the pink slip": { es: "grab", x: 850, y: 334, look: [796, 290] },
    "Squatch: type the code from the pink slip": { es: "pad", closeUp: true, look: [273, 553] },
    "Squatch: return the empty crate": { es: "computer", x: 610, y: 585, look: [735, 300] },
    "Squatch: take the snacks": { es: "snacks", closeUp: true, look: [330, 400] },
    "Squatch: leave food for the Guardians": { es: "food", closeUp: true, look: [850, 420] },
    "Squatch: hide the pink slip": { es: "closet", x: 300, y: 398, look: [172, 300] },
    "Squatch: pack the crate": { step: "pack1", room: "closet", zoom: "pack", x: 420, y: 520 },
    "Squatch: put on the spare jacket": { step: "jacket", room: "closet", scene: "Q8", x: 160, y: 510 },
    "Squatch: go to the ship": { step: "keepsake", room: "passage", scene: "Q9", x: 820, y: 510 },
    "Squatch: walk through the scanner": { step: "board", room: "hangar", bay: true, scene: "Q9", x: 480, y: 500 },
  };
  // the escape's goals not built yet in the rebuild of 2026-11-26 night (each leaves this list when its step is built)
  const escapeLater = new Set(["Squatch: go to the office door", "Squatch: book the empty crate on the computer", "Squatch: go to the snack bar"]);
  const missing = chips.filter((c) => !play[c] && !story.has(c) && !escapeLater.has(c));
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
  for (const [chip, spec] of Object.entries(play)) {
    if (spec.hm) {
      Object.assign(n, { ch1PartyNow: null, ch1Morning: null, ch1Lunch: null, ch1Zoom: null, ch1PadOn: false, q: [], cur: null });
      ss.ch1JumpBeat(22);
      window.SSQ.beat("ch1-home-morning").jump(spec.hm);
      // at the wardrobe step he has walked there (where OPEN · closet works)
      spec.hm === "closet" && ((n.sq.x = 300), (n.sq.y = 398));
      ((n.chip = chip), (n.moved = 200));
    } else if (spec.lu) {
      Object.assign(n, { ch1PartyNow: null, ch1Morning: null, ch1Zoom: null, ch1PadOn: false, q: [], cur: null });
      ss.ch1JumpBeat(22);
      window.SSQ.beat("ch1-lunch").jump(spec.lu);
      spec.x && ((n.sq.x = spec.x), (n.sq.y = spec.y));
      ((n.chip = chip), (n.moved = 200));
    } else if (spec.es) {
      Object.assign(n, { ch1PartyNow: null, ch1Morning: null, ch1Lunch: null, ch1Zoom: null, ch1PadOn: false, q: [], cur: null, ch1Day2: true });
      window.SSQ.beat("ch1-escape").jump(spec.es === "food" ? "snacks" : spec.es);
      spec.es === "food" && Object.assign(n.ch1Escape, { step: "food" }, { snacks: { ...n.ch1Escape.snacks, plate: true } }) && (n.ch1Step = "es-food");
      spec.x && ((n.sq.x = spec.x), (n.sq.y = spec.y));
      ((n.chip = chip), (n.moved = 200));
    } else if (spec.party) {
      Object.assign(n, { ch1Day2: false, ch1Lunch: null, ch1Zoom: null, ch1PadOn: false, ch1Morning: null, q: [], cur: null, moPose: "hidden" });
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
    n.ch1Escape = null;
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
    const yellow = onSquatch ? 1 : spec.look ? yellowNear(...spec.look) : yellowNear(at.x || spec.x, at.y || spec.y);
    // (an escape close-up is its own prompt: the keys, the snacks and the plate are what he taps)
    const prompt = spec.pad ? n.ch1PadOn : spec.closeUp ? !!(n.ch1Escape && n.ch1Escape.cu) : spec.walk ? true : !!(offer && offer.verb);
    const target = spec.walk || spec.pad || spec.closeUp || spots.length > 0;
    for (const r of ss.rings()) ringed.push(`${chip} -> ${r.box ? "box" : "circle"} ring and arrow on ${r.id}`);
    for (const c of yellowCircles) ringed.push(`${chip} -> yellow ${c === "arrow" ? "arrow" : "circle at " + c}`);
    // Where the goal's thing is away from Squatch, the outline round it (src/modules/goal-targets.js).
    // The outline must be round the goal's own thing: the one whose action is offered where the goal is done.
    if (n.lastRing && n.lastRing.box) {
      outlined.push(chip);
      const offered = offer && offer.verb ? offer.verb + " · " + offer.cap : "";
      offered && offered !== n.lastRing.act && farOutline.push(`${chip}: outline for ${n.lastRing.act}, action offered is ${offered}`);
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
