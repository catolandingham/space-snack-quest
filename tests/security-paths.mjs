/**
 * No security walk in Chapter 1 enters a solid (Brian 2026-11-28: "look at security because they keep walking over the
 * bar and causing issues there"). Before round 9 the hall's guards and the alarm's witness kept out of the stage, the
 * stools and the plant pots but not the snack bar's counter: one after Squatch behind the counter, or walking out
 * after a search, went straight over it (33 of the walks below did).
 *
 * For every room the one capture rule runs in (party-alarm.js alarmPlaceList: the party hall, the hall from the lunch on
 * (with the lunch's stack of crates), the loading bay by day
 * and at night, the hallway twice), guards are walked, as the game walks them (guardStep), from where they come in,
 * from each search point and from spots all over the floor, to each search point, to their way out and to spots all
 * over the floor (where Squatch was last seen). The alarm's witness is walked from where each hall watcher stands to
 * the FUR alarm and back. Each step's feet must stay out of the room's solids: the guards' own list (`around`) and,
 * in the hall, the furniture itself (the stage, stools, plant pots and the counter, its end and the wall past its
 * aisle, party-hall.js HALL_COUNTER). A guard must also still reach a Squatch in the aisle behind the counter.
 *   node tests/security-paths.mjs
 */
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(import.meta.url), "..", "..");
const mod = (f) => import(join(root, "src", "modules", f));
// (the rooms register their alarm places as they load)
await mod("evening.js");
await mod("loading-bay.js");
const { alarmPlaceList, guardStep, ALARM, SEARCH, HALL_FROM_LUNCH } = await mod("party-alarm.js");
const { HALL_SOLIDS, HALL_COUNTER, CAST, MILL } = await mod("party-hall.js");
const { stepRound } = await mod("room-model.js");
const { stepTo } = await mod("party-hall.js");
const { EV_BAR, STORM } = await mod("evening-place.js");
const { WATCHERS, COUNTER_WATCHER, COUNTER_SPOTS, LUNCH_SOLIDS } = await mod("lunch-sneak-place.js");

const inB = (b, p) => p.x > b.x0 + 0.5 && p.x < b.x1 - 0.5 && p.y > b.y0 + 0.5 && p.y < b.y1 - 0.5;
const HALL_FURNITURE = [...HALL_SOLIDS.filter((b) => !b.bar), ...HALL_COUNTER];
// (from the lunch on, the lunch's stack of crates stands in the hall too)
const furnitureOf = (id) => (id === HALL_FROM_LUNCH ? [...HALL_FURNITURE, ...LUNCH_SOLIDS.filter((b) => b.id === "crates")] : HALL_FURNITURE);
let fails = 0,
  walks = 0;
const fail = (m) => (fails++, fails <= 20 && console.log("FAIL " + m));
const P = (p) => `(${Math.round(p.x)}, ${Math.round(p.y)})`;

for (const [id, PL] of alarmPlaceList()) {
  const name = id || "hall",
    around = PL.around || [],
    search = PL.search || SEARCH,
    solids = PL.room === "hall" ? [...around, ...furnitureOf(id)] : around,
    f = PL.floor,
    grid = [];
  for (let x = f.x0 + 20; x < f.x1; x += 70) for (let y = f.y0 + 15; y < f.y1; y += 55) grid.push({ x, y });
  const free = grid.filter((p) => !solids.some((b) => inB(b, p)));
  const out = { x: PL.guardIn.x + (PL.room === "hall" ? 40 : -40), y: PL.guardIn.y };
  // (a guard never stands in a solid to start from: a search point in one, the hall's first, by the middle plant's
  // leaves, is walked to as near as the floor lets him)
  const starts = [PL.guardIn, ...search, ...free.filter((_, i) => i % 5 === 0)].filter((p) => !solids.some((b) => inB(b, p)));
  const targets = [...search, out, ...grid, ...(PL.room === "hall" ? [COUNTER_SPOTS.sq, COUNTER_SPOTS.mops, EV_BAR.hidden] : [])];
  let bad = 0;
  for (const s of starts)
    for (const t of targets) {
      const g = { x: s.x, y: s.y };
      walks++;
      for (let i = 0; i < 900; i++) {
        if (guardStep(g, t.x, t.y, ALARM.guard, 1 / 60, around, f)) break;
        const hit = solids.find((b) => inB(b, g));
        if (hit) {
          bad++;
          fail(`${name}: a guard walking ${P(s)} to ${P(t)} stepped into ${hit.id || JSON.stringify(hit)} at ${P(g)}`);
          break;
        }
      }
    }
  console.log(`${bad ? "FAIL" : "PASS"} ${name}: ${starts.length * targets.length} guard walks stay out of its ${solids.length} solids`);
}

// The witness in the hall (both lists: the party's, and from the lunch on): from where each watcher stands to the FUR
// alarm, and back (stepRound, as party-alarm.js witnessStep walks it).
const watchers = [...CAST.guests, ...MILL, ...EV_BAR.line, ...EV_BAR.family.map((q) => q.at), ...Object.values(STORM.bar), COUNTER_WATCHER, ...WATCHERS];
for (const [id, PL] of alarmPlaceList().filter(([, q]) => q.room === "hall")) {
  const furniture = furnitureOf(id);
  let wbad = 0;
  for (const w of watchers.filter((q) => !furniture.some((b) => inB(b, q)))) {
    for (const [a, b] of [
      [w, PL.run],
      [PL.run, w],
    ]) {
      const m = { x: a.x, y: a.y };
      walks++;
      for (let i = 0; i < 900; i++) {
        if (stepRound("test-witness", m, b.x, b.y, ALARM.run, 1 / 60, "hall", PL.around, PL.floor, stepTo)) break;
        const hit = furniture.find((q) => inB(q, m));
        if (hit) {
          wbad++;
          fail(`${id || "hall"}: the witness running ${P(a)} to ${P(b)} stepped into ${hit.id || JSON.stringify(hit)} at ${P(m)}`);
          break;
        }
      }
    }
  }
  console.log(`${wbad ? "FAIL" : "PASS"} ${id || "hall"}: the alarm's witness runs from the watchers' spots to the FUR alarm and back round the furniture`);
}

// A guard still reaches Squatch in the aisle behind the counter (the catch is the one rule; the counter must not make
// the aisle a place no guard can follow him into).
const [, HALLP] = alarmPlaceList().find(([id]) => id === HALL_FROM_LUNCH);
for (const t of [COUNTER_SPOTS.sq, COUNTER_SPOTS.mops, EV_BAR.hidden]) {
  const g = { x: HALLP.guardIn.x, y: HALLP.guardIn.y };
  for (let i = 0; i < 900 && !guardStep(g, t.x, t.y, ALARM.guard, 1 / 60, HALLP.around, HALLP.floor); i++);
  const d = Math.hypot(g.x - t.x, g.y - t.y);
  d < ALARM.reach ? console.log(`PASS a guard reaches ${P(t)} in the counter's aisle`) : fail(`a guard stops ${Math.round(d)} short of ${P(t)} in the counter's aisle`);
}

console.log(`${walks} walks checked.`);
if (fails) {
  console.log(`${fails} problem(s).`);
  process.exit(1);
}
console.log("All security walks keep out of the solids.");
