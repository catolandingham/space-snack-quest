/**
 * Squatch and Mops do not stand inside each other at the lunch handoff or the snack hall.
 *   node tests/apart.mjs
 */
import { readFileSync } from "node:fs";
import { startGame } from "./game-page.mjs";

const src = readFileSync(new URL("../src/game/14-ch1-day2.js", import.meta.url), "utf8");
const give = src.match(/stand: \[(\d+), (\d+)\], mo: \[(\d+), (\d+)\] \}, \(\) => ch1Ready\("give"/);
const snack = src.match(/stand: \[(\d+), (\d+)\], mo: \[(\d+), (\d+)\] \}, \(\) => \{\s*\(\(n\.ctrl/);
if (!give || !snack) {
  console.error("could not read the handoff stands");
  process.exit(1);
}

const g = await startGame({ port: 8881, name: "apart" });
const { page } = await g.open("?ch=1");
const out = await page.evaluate(
  (spots) => {
    const n = window.__ss.op;
    const gap = (room) => {
      const sq = (window.__ss.adultPxFor(room) * 0.8) / 45;
      const mo = sq * 1.15;
      return 24 * sq + 30 * mo;
    };
    const check = (room, sq, mo) => {
      n.room = room;
      n.scene = room === "passage" ? "QB" : "Q3";
      n.sqPose = "stand";
      n.moPose = "stand";
      n.sq.x = sq[0];
      n.sq.y = sq[1];
      n.mo.x = mo[0];
      n.mo.y = mo[1];
      n.mo.walking = false;
      const need = gap(room);
      const dist = Math.hypot(sq[0] - mo[0], sq[1] - mo[1]);
      return { room, dist: Math.round(dist), need: Math.round(need), clear: dist >= need };
    };
    return [check("passage", spots.give.sq, spots.give.mo), check("hall", spots.snack.sq, spots.snack.mo)];
  },
  {
    give: { sq: [Number(give[1]), Number(give[2])], mo: [Number(give[3]), Number(give[4])] },
    snack: { sq: [Number(snack[1]), Number(snack[2])], mo: [Number(snack[3]), Number(snack[4])] },
  },
);
for (const row of out) g.check(row.room + ": Squatch is not inside Mops", row.clear, row);
await g.finish("apart");
