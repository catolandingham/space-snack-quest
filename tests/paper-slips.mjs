/**
 * The pink and yellow copies sit in the hangar bin. They do not draw in the passage,
 * including over Squatch after BEEP BEEP.
 *   node tests/paper-slips.mjs
 */
import { readFileSync } from "node:fs";
import { startGame } from "./game-page.mjs";

const src = readFileSync(new URL("../src/game/14-ch1-day2.js", import.meta.url), "utf8");
const binLine = src.split("\n").find((line) => line.includes('n.ch1Paper === "bin"'));
if (!binLine || !binLine.includes('n.room === "hangar"')) {
  console.error("the bin slips are not limited to the hangar");
  process.exit(1);
}

const g = await startGame({ port: 8944, name: "paper-slips" });
const { page, errors } = await g.open("?ch=1");
const slip = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  const pink = (p) => p[0] > 220 && p[2] > 140 && p[0] > p[1] + 40;
  const yellow = (p) => p[0] > 220 && p[1] > 180 && p[2] < 170;
  const count = () => {
    const c = document.querySelector("canvas");
    const k = c.width / 960;
    const cx = c.getContext("2d");
    let rose = 0;
    let gold = 0;
    for (let y = 465; y <= 500; y += 4)
      for (let x = 228; x <= 270; x += 4) {
        const p = cx.getImageData(Math.round(x * k), Math.round(y * k), 1, 1).data;
        if (pink(p)) rose++;
        if (yellow(p)) gold++;
      }
    return { rose, gold };
  };
  const place = (room, paper) => {
    n.ch1Day2 = true;
    n.room = room;
    n.scene = "QB";
    n.ch1D = room === "hangar";
    n.ch1Paper = paper;
    n.ch1Beep = false;
    n.sqPose = "stand";
    n.moPose = "hidden";
    n.sq.x = room === "passage" ? 240 : -400;
    n.sq.y = 540;
    n.mo.x = -400;
    n.cur = null;
    n.q = [];
    n.ctrl = true;
    ss.drawFrame();
    return count();
  };
  const rooms = ["passage", "hall", "closet", "office", "hangar"].map((room) => {
    const bare = place(room, "");
    const bin = place(room, "bin");
    return { room, added: bin.rose + bin.gold - bare.rose - bare.gold, bare, bin };
  });
  n.room = "passage";
  n.ch1Paper = "bin";
  n.sqPose = "stand";
  n.sq.x = 240;
  n.sq.y = 540;
  ss.drawFrame();
  const face = count();
  n.ch1Paper = "";
  ss.drawFrame();
  const faceBare = count();
  return { rooms, face, faceBare };
});
for (const row of slip.rooms)
  g.check(
    row.room === "hangar" ? "the bin slips are in the hangar" : "no paper slips in the " + row.room,
    row.room === "hangar" ? row.added > 0 : row.added === 0,
    row,
  );
g.check(
  "the slips do not cover Squatch after BEEP BEEP",
  slip.face.rose + slip.face.gold === slip.faceBare.rose + slip.faceBare.gold,
  { face: slip.face, bare: slip.faceBare },
);
g.check("no page errors", errors.length === 0, errors);
await g.finish("paper-slips");
