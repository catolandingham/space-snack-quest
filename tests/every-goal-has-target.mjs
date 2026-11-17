/**
 * Every Chapter 1 goal the player acts on has a highlighted target and an action prompt.
 * Goals whose action happens right where Squatch stands get no ring (Brian, 2026-11-14), only the prompt.
 *   node tests/every-goal-has-target.mjs
 */
import { readFileSync } from "node:fs";
import { startGame } from "./game-page.mjs";

const src = ["12-ch1-redesign.js", "13-ch1-slice.js", "14-ch1-day2.js"]
  .map((f) => readFileSync(new URL("../src/game/" + f, import.meta.url), "utf8"))
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
    "Squatch: peek out the door": { scene: "Q1", room: "closet", peek: true, day2: false, x: 890, y: 480 },
    "Squatch: look around the party": { scene: "QA", room: "hall", party: true, day2: false, x: 480, y: 430 },
    "Squatch: hide from security": { scene: "QA", room: "hall", party: true, day2: false, raid: true, x: 220, y: 530 },
    "Squatch: hide under the bed": { scene: "QH", room: "closet", day2: false, search: true, x: 480, y: 520 },
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
  const bad = [];
  for (const [chip, spec] of Object.entries(play)) {
    n.ch1Day2 = spec.day2 !== false;
    n.ch1Party = !!spec.party;
    n.ch1PartyOver = false;
    n.ch1Disguise = !!spec.party;
    n.ch1Flyer = false;
    n.ch1Song = !!spec.song;
    n.ch1PeekReady = !!spec.peek;
    n.ch1Search = !!spec.search;
    n.ch1Part = spec.raid ? "alarm" : spec.search ? "home" : "";
    n.ch1Raid = spec.raid ? { phase: "search", guards: [], doorT: 0, left: false, witness: { x: 800, y: 430 } } : null;
    n.guard = spec.search ? { x: 900, y: 520, t: 0, seen: 0 } : null;
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
    n.ch1Veil = 0;
    n.chip = chip;
    for (let i = 0; i < 12; i++) ss.tick(0.05);
    ss.drawFrame();
    const spots = (ss.spotsNow() || []).filter((s) => s && s.verb);
    const offer = ss.offerNow();
    const at = spots[0] || { x: spec.x, y: spec.y };
    // Rule (Brian, 2026-11-14): no ring when the action happens where Squatch stands, so those goals need only the prompt.
    const onSquatch = !!spots[0] && (!!spots[0].hot || (Math.abs(spots[0].x - n.sq.x) < 2 && Math.abs(spots[0].y - n.sq.y) < 2));
    const yellow = onSquatch ? 1 : yellowNear(at.x || spec.x, at.y || spec.y);
    const prompt = spec.pad ? n.ch1PadOn : spec.walk ? true : !!(offer && offer.verb);
    const target = spec.walk || spec.pad || spots.length > 0;
    if (!target || yellow < 1 || !prompt) bad.push({ chip, target, yellow, prompt, verb: offer && offer.verb, spots: spots.length });
  }
  return { missing, bad, checked: Object.keys(play).length, story: [...story] };
}, unique);

g.check("every Chapter 1 goal chip is classified", report.missing.length === 0, report.missing);
g.check(
  "every player goal has a highlighted target and an action prompt up close",
  report.bad.length === 0,
  report.bad.slice(0, 8),
);
g.check("story goals are named", report.story.length === 4, report.story);
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("every-goal");
