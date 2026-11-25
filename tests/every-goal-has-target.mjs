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

const src = ["game/12-ch1-redesign.js", "game/13-ch1-slice.js", "game/14-ch1-day2.js", "modules/party-lines.js"]
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
  ]);
  const play = {
    "Squatch: walk around the room": { scene: "O1", room: "closet", day2: false, walk: true, x: 500, y: 530 },
    "Squatch: sing along with Mops": { scene: "Q1", room: "closet", song: true, day2: false },
    // The party night (src/modules/party.js): each opens its scene. Walking through a doorway is the action
    // there (no button), so those goals count the walk, as "walk around the room" does.
    "Squatch: peek out the door": { party: "P1", x: 860, y: 480 },
    "Squatch: sneak to the plant": { party: "P2", x: 400, y: 552 },
    // he stands a step from his door, outside its trigger (party-hall.js HALL_DOOR, a 36 px circle round the doorway)
    // P4, the flyer sneak: the flyer on the stage's end first (he stands within reach of it), then, with it in his
    // paw, his door.
    "Squatch: grab the flyer": { party: "P4", out: true, x: 524, y: 332 },
    "Squatch: sneak home for a disguise": { party: "P4", out: true, flyer: "paw", walk: true, x: 477, y: 540 },
    "Squatch: run home and hide!": { party: "P2", alarm: true, walk: true, x: 520, y: 560 },
    "Squatch: pick up the gift": { step: "gift", room: "closet", x: 340, y: 520 },
    "Squatch: put the gift in the box": { step: "box", room: "closet", x: 230, y: 392 },
    "Squatch: look at the calendar": { step: "cal", room: "closet", x: 230, y: 392 },
    "Squatch: circle delivery day": { step: "cal", room: "closet", x: 230, y: 392 },
    "Squatch: take the lunch": { step: "lunch", room: "closet", x: 500, y: 520 },
    "Squatch: take Mops his lunch": { step: "sneak", room: "hall", x: 700, y: 540 },
    "Squatch: give Mops his lunch": { step: "give", room: "passage", x: 500, y: 510 },
    "Squatch: feed Mops": { step: "feed1", room: "passage", zoom: "eat", x: 240, y: 510 },
    "Squatch: grab one snack": { step: "snack", room: "hall", scene: "Q3", x: 760, y: 530 },
    "Squatch: hide in the plant": { step: "hide", room: "hangar", bay: true, x: 230, y: 400 },
    "Squatch: go on": { step: "photos", room: "passage", x: 480, y: 560 },
    "Squatch: hide": { step: "family", room: "hall", scene: "Q3", x: 520, y: 530 },
    "Squatch: go home": { step: "gohome", room: "hall", scene: "Q3", x: 480, y: 560 },
    "Squatch: get the copies from the bin": { step: "grab", room: "hangar", bay: true, scene: "Q4", x: 212, y: 370 },
    "Squatch: get the yellow copy to the mailbox": { step: "post", room: "hangar", bay: true, scene: "Q4", x: 878, y: 450 },
    "Squatch: check the order": { step: "mark", room: "hangar", bay: true, zoom: "paw", x: 212, y: 370 },
    "Squatch: post the yellow copy": { step: "post", room: "hangar", bay: true, scene: "Q4", x: 878, y: 450 },
    "Squatch: sneak home": { step: "out", room: "hangar", bay: true, x: 90, y: 540 },
    "Squatch: roll into a ball by the vent": { step: "roll", room: "hangar", bay: true, scene: "Q5", x: 820, y: 470 },
    "Squatch: hide by the vent": { step: "roll", room: "hangar", bay: true, scene: "Q5", x: 820, y: 470 },
    "Squatch: grab the pink slip": { step: "pink", room: "hangar", bay: true, scene: "Q6", x: 640, y: 500 },
    "Squatch: type the code from the pink slip": { step: "pad", room: "passage", pad: true, x: 480, y: 250 },
    "Squatch: return the empty crate": { step: "crate", room: "hall", scene: "Q7", x: 480, y: 500 },
    "Squatch: take the snacks": { step: "all1", room: "hall", zoom: "all", x: 700, y: 520 },
    "Squatch: leave food for the Guardians": { step: "all2", room: "hall", zoom: "all", x: 700, y: 520 },
    "Squatch: hide the pink slip": { step: "slip", room: "closet", x: 350, y: 520 },
    "Squatch: pack the crate": { step: "pack1", room: "closet", zoom: "pack", x: 420, y: 520 },
    "Squatch: put on the spare jacket": { step: "jacket", room: "closet", scene: "Q8", x: 160, y: 510 },
    "Squatch: go to the ship": { step: "keepsake", room: "passage", scene: "Q9", x: 820, y: 510 },
    "Squatch: walk through the scanner": { step: "board", room: "hangar", bay: true, scene: "Q9", x: 480, y: 500 },
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
  proto.stroke = function () {
    if (isYellow(this.strokeStyle)) arcs.forEach((a) => yellowCircles.add(a));
    // A stroked chevron: two or three straight lines, no curve, not dashed (outlines of doorways use strokeRect).
    if (isYellow(this.strokeStyle) && lines >= 2 && lines <= 4 && !arcs.length && !this.getLineDash().length) yellowCircles.add("arrow");
    return stroke.apply(this, arguments);
  };
  proto.fill = function () {
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
    if (spec.party) {
      Object.assign(n, { ch1Day2: false, ch1Zoom: null, ch1PadOn: false, ch1Morning: null, q: [], cur: null, moPose: "hidden" });
      window.SSQ.beat("ch1-party").jump(spec.party);
      const p = n.ch1PartyNow;
      spec.out && ((p.pose = "stand"), (n.sqPose = "stand"));
      spec.flyer && (p.flyer = spec.flyer);
      spec.alarm && (p.alarm = { phase: "search", t: 0, st: 0, w: { id: "backpack", x: 880, y: 318, hx: 600, hy: 490 }, where: "where-hall", who: "who-tourist", guards: [], bell: 9, last: null, hidden: "" });
      ((n.sq.x = spec.x), (n.sq.y = spec.y), (n.ch1Chip = chip), (n.chip = chip), (n.moved = 200));
    } else {
    n.ch1PartyNow = null;
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
    const yellow = onSquatch ? 1 : yellowNear(at.x || spec.x, at.y || spec.y);
    const prompt = spec.pad ? n.ch1PadOn : spec.walk ? true : !!(offer && offer.verb);
    const target = spec.walk || spec.pad || spots.length > 0;
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
g.check("story goals are named", report.story.length === 4, report.story);
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("every-goal");
