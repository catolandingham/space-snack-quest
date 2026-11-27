/**
 * Nobody walks through furniture (docs/REVIEW-RULES.md, Brian 2026-11-26, video note 0:18: "he kind of glitches
 * through the crate... is there a physics rule we can adopt for the future?"): every scripted walk in the home
 * morning (home-morning.js HOME_MORNING_WALKS) and the bedtime story (bedtime-story.js BEDTIME_WALKS) is sampled every
 * 2 game pixels along its legs, and at each point the walker's feet (as tests/standing-spots.mjs counts them at home)
 * touch no furniture: the crate bed, the bucket, the Guardian box out on the floor (tests/data/home-furniture.json),
 * and in the morning the things on the floor while they are there (the lunch bag all morning; the rocket until he
 * picks it up). The code walks these same lists, so a walk changed in the code is a walk changed here.
 *   node tests/scripted-walks.mjs
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const mod = (f) => import(pathToFileURL(join(root, "src", "modules", f)).href);
const { HOME_MORNING_WALKS, HOME_MORNING_SPOTS } = await mod("home-morning.js");
const { BEDTIME_WALKS, BEDTIME_SPOTS } = await mod("bedtime-story.js");
const { MORNING_THINGS, MORNING_SIZES } = await mod("home-morning-art.js");
const FURN = JSON.parse(readFileSync(join(root, "tests", "data", "home-furniture.json"), "utf8"));
const F = FURN.foot.home;

let fails = 0;
const check = (name, ok, info) => (console.log(`${ok ? "PASS" : "FAIL"} ${name}${ok || info == null ? "" : "\n      " + JSON.stringify(info)}`), ok || fails++);
const hit = (a, b) => a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;
const feet = (p) => ({ x0: p.x - F.side, x1: p.x + F.side, y0: p.y - F.up, y1: p.y + F.down });
// A thing standing on the floor takes up the floor under its bottom (12 game pixels deep), its width across.
const floorOf = (x, y, w) => ({ x0: x - w / 2, x1: x + w / 2, y0: y - 12, y1: y });
const BAG = floorOf(MORNING_THINGS.bag.x, MORNING_THINGS.bag.y, MORNING_SIZES.bag.w),
  ROCKET = floorOf(MORNING_THINGS.rocket.x, MORNING_THINGS.rocket.y, MORNING_SIZES.rocketW);

/** Every point every 2 px along a walk (its start, then each corner in turn). */
function samples(walk) {
  const pts = [],
    corners = [walk.from, ...walk.via];
  for (let i = 1; i < corners.length; i++) {
    const a = corners[i - 1],
      b = corners[i],
      n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 2));
    for (let k = 0; k <= n; k++) pts.push({ x: a.x + ((b.x - a.x) * k) / n, y: a.y + ((b.y - a.y) * k) / n });
  }
  return pts;
}
/** The points of a walk whose feet touch a thing, each as { at, thing } (the first few). */
function bumps(walk, things) {
  const out = [];
  for (const p of samples(walk))
    for (const [name, b] of Object.entries(things)) hit(feet(p), b) && out.length < 6 && out.push({ at: [Math.round(p.x), Math.round(p.y)], thing: name });
  return out;
}

const furniture = FURN.home;
const walks = [
  ["home morning: Squatch gets up (from beside the crate round its foot to the rocket)", HOME_MORNING_WALKS.getUp, { ...furniture, "lunch bag": BAG, rocket: ROCKET }],
  ["home morning: Squatch to the wardrobe (round the crate's foot and up its right side)", HOME_MORNING_WALKS.toCloset, { ...furniture, "lunch bag": BAG }],
  ["home morning: Mops out of the door (behind the bucket and the bag)", HOME_MORNING_WALKS.mopsOut, { ...furniture, "lunch bag": BAG }],
  ["bedtime: Squatch from the TV to the crate's right end", BEDTIME_WALKS.squatch, furniture],
  ["bedtime: Mops from the TV to beside the bed", BEDTIME_WALKS.mops, furniture],
  ["bedtime: Mops steps in to tuck him in and back", BEDTIME_WALKS.tuck, furniture],
];
let n = 0;
for (const [name, walk, things] of walks) {
  const b = bumps(walk, things);
  n += samples(walk).length;
  check(`${name}: no step touches ${Object.keys(things).join(", ")}`, b.length === 0, b);
}
check(`every scripted walk at home is checked (${walks.length} walks, ${n} points)`, Object.keys(HOME_MORNING_WALKS).length === 3 && Object.keys(BEDTIME_WALKS).length === 3 && n > 500);

// The walks start where the beat has them standing.
const tv = readFileSync(join(root, "src", "game", "14-ch1-day1.js"), "utf8").match(/n\.sq\.x = (\d+)\), \(n\.sq\.y = (\d+)\)/);
check("bedtime: Squatch's walk starts where the TV evening seats him (14-ch1-day1.js ch1TvEvening)", tv && +tv[1] === BEDTIME_WALKS.squatch.from.x && +tv[2] === BEDTIME_WALKS.squatch.from.y, tv && tv.slice(1));
check("home morning: getting up starts beside the crate where he climbed in at bedtime, and ends beside the rocket; the walk to the wardrobe starts there", HOME_MORNING_WALKS.getUp.from === BEDTIME_SPOTS.side && HOME_MORNING_WALKS.getUp.via.at(-1) === HOME_MORNING_SPOTS.woke && HOME_MORNING_WALKS.toCloset.from === HOME_MORNING_SPOTS.woke && HOME_MORNING_WALKS.toCloset.via.at(-1) === HOME_MORNING_SPOTS.closet);

// The check catches what Brian saw: the old walks straight from the bed to the rocket, and from the rocket to the
// wardrobe, went through the crate bed.
const old1 = bumps({ from: { x: 205, y: 470 }, via: [{ x: 250, y: 580 }] }, furniture),
  old2 = bumps({ from: { x: 250, y: 580 }, via: [{ x: 300, y: 398 }] }, furniture);
check("the check catches the old straight walks through the crate bed (bed to rocket, rocket to wardrobe)", old1.some((b) => b.thing === "bed") && old2.some((b) => b.thing === "bed"), { old1, old2 });

console.log(fails ? `${fails} check(s) failed.` : "scripted-walks checks passed");
process.exit(fails ? 1 : 0);
