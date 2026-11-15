// Takes a full-size still of the party hall during the peek, for the picture check in docs/START-HERE.md.
//   CHROME=/path/to/chrome node tools/hall-still.mjs   ->  tests/out/hall-still.png
import { startGame, sleep } from "../tests/game-page.mjs";
const g = await startGame({ port: 8933, name: "hall-still" });
const { page } = await g.open("?ch=1", { width: 1280, height: 800, deviceScaleFactor: 1 });
await sleep(1200);
// Skip the morning: put Squatch at his door, ready to peek, then take the peek.
await page.evaluate(() => { const n = window.__ss.op; n.q = []; n.cur = null; n.scene = "Q1"; n.room = "closet"; n.moPose = "hidden"; n.sqPose = "stand"; n.sq.x = 820; n.sq.y = 480; n.ch1PeekReady = true; n.ctrl = true; });
await sleep(300);
await page.evaluate(() => { const o = window.__ss.offerNow(); o && o.f(); });
for (let i = 0; i < 40; i++) {
  const s = await page.evaluate(() => { const n = window.__ss.op, c = n.cur || {}; return { r: n.room, t: (c.b && c.b.text) || "" }; });
  if (s.r === "hall" && /Mmf/.test(s.t)) break;
  await sleep(250);
}
await sleep(400);
await (await page.$("canvas")).screenshot({ path: "tests/out/hall-still.png" });
console.log("saved tests/out/hall-still.png");
process.exit(0);
