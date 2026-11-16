/**
 * Beat 1 bedroom: Squatch walks smoothly around the Moon Pie crate bed, and the Guardian Box
 * is in the closet until Day 2 (Brian, 2026-11-16).
 *   node tests/bedroom-walk.mjs
 */
import { startGame, sleep } from "./game-page.mjs";

const g = await startGame({ port: 8946, name: "bedroom walk" });
const { page } = await g.open("?ch=1");
await page.click("canvas");

// Play the real start until Squatch can walk.
let ready = false;
for (let i = 0; i < 60 && !ready; i++) {
  ready = await page.evaluate(() => window.__ss.op.scene === "O1" && window.__ss.op.ctrl);
  if (!ready) {
    await page.keyboard.press("Space");
    await sleep(500);
  }
}
g.check("the start reaches the walk-around goal", ready);

const BED = { x0: 83, x1: 286, y0: 409, y1: 526 };
const BUCKET = { x0: 536, x1: 596, y0: 500, y1: 571 };
const solids = await page.evaluate(() => window.__ss.solids());
const has = (b) => solids.some((o) => o.x0 === b.x0 && o.x1 === b.x1 && o.y0 === b.y0 && o.y1 === b.y1);
g.check("the bed stops Squatch where the picture draws it", has(BED), solids);
g.check("the bucket stops Squatch where the picture draws it", has(BUCKET), solids);
g.check("no Guardian Box on the floor in beat 1", !solids.some((o) => o.x0 === 307), solids);

// Walk a loop: off the bed, around its right side, behind it, back, and under it.
const legs = [
  [["ArrowRight"], 25],
  [["ArrowUp"], 40],
  [["ArrowRight"], 25],
  [["ArrowUp"], 45],
  [["ArrowLeft"], 70],
  [["ArrowRight"], 70],
  [["ArrowDown"], 60],
  [["ArrowLeft"], 60],
  [["ArrowUp", "ArrowRight"], 40],
  [["ArrowUp", "ArrowLeft"], 60],
];
const path = [];
for (const [keys, ticks] of legs) {
  for (const k of keys) await page.keyboard.down(k);
  path.push(
    ...(await page.evaluate((ticks) => {
      const out = [];
      for (let i = 0; i < ticks; i++) {
        window.__ss.tick(1 / 30);
        out.push({ x: window.__ss.op.sq.x, y: window.__ss.op.sq.y, hop: window.__ss.op.hopOut, first: i === 0 });
      }
      return out;
    }, ticks)),
  );
  for (const k of keys) await page.keyboard.up(k);
}
const walk = path.filter((p) => p.hop < 0);
let maxStep = 0;
let where = null;
// Steps are measured inside each leg only: between legs the page's own clock also moves him.
for (let i = 1; i < walk.length; i++) {
  if (walk[i].first) continue;
  const st = Math.hypot(walk[i].x - walk[i - 1].x, walk[i].y - walk[i - 1].y);
  if (st > maxStep) ((maxStep = st), (where = [walk[i - 1], walk[i]]));
}
const inside = (p, b) => p.x > b.x0 + 1 && p.x < b.x1 - 1 && p.y > b.y0 + 1 && p.y < b.y1 - 1;
// One frame of walking in the bedroom is about 7.7 pixels; sliding round a corner adds a little. The old snaps were 11 and more.
g.check("no jumps while walking around the bed (largest step under 10.5)", maxStep < 10.5, { step: maxStep.toFixed(2), where });
g.check("never inside the bed", !walk.some((p) => inside(p, BED)));
g.check("never inside the bucket", !walk.some((p) => inside(p, BUCKET)));
g.check("he gets behind the bed", walk.some((p) => p.y < BED.y0 && p.x < 160));
g.check("he gets in front of the bed", walk.some((p) => p.y > BED.y1 && p.x < 200));

// Mops walking to the door past Squatch does not shove him (he used to jump out of Mops's way).
const shove = await page.evaluate(() => {
  const n = window.__ss.op;
  Object.assign(n, { q: [], cur: null, scene: "Q1", room: "closet", ch1Song: true, ctrl: true, sqPose: "stand", moPose: "stand" });
  ((n.mo.x = 690), (n.mo.y = 560), (n.sq.x = 745), (n.sq.y = 515));
  let big = 0, px = n.sq.x, py = n.sq.y;
  for (let i = 0; i < 90; i++) {
    window.__ss.tick(1 / 30);
    big = Math.max(big, Math.hypot(n.sq.x - px, n.sq.y - py));
    ((px = n.sq.x), (py = n.sq.y));
  }
  return { big, mo: [n.mo.x, n.mo.y] };
});
g.check("Mops walking past does not shove Squatch", shove.big < 1, shove);

// The picture itself: floor where the box used to sit.
const blueAt = (x, y) =>
  page.evaluate(
    ([x, y]) => {
      const ss = window.__ss;
      ss.op.sq.x = 800;
      ss.op.sq.y = 560;
      ss.drawFrame();
      const cv = document.querySelector("canvas"),
        k = cv.width / 960,
        d = cv.getContext("2d").getImageData(Math.round(x * k), Math.round(y * k), 1, 1).data;
      return d[2] > 180 && d[0] < 120;
    },
    [x, y],
  );
g.check("beat 1: the Guardian Box is not drawn", !(await blueAt(335, 510)));

// Day 2: the box comes out of the closet when Squatch puts the gift in it.
await page.evaluate(() => {
  const n = window.__ss.op;
  Object.assign(n, { q: [], cur: null, ch1Song: false, ch1Day2: true, ch1Step: "box", scene: "QB", room: "closet", ctrl: true, sqPose: "stand", wardrobe: "closed" });
});
g.check("Day 2 before PUT: still in the closet", !(await blueAt(335, 510)));
const put = await page.evaluate(() => (window.__ss.spotsNow() || []).find((s) => s.verb === "PUT"));
g.check("Day 2: PUT · box is at the closet", put && put.x < 260 && put.y < 410, await page.evaluate(() => JSON.stringify(window.__ss.spotsNow()) + " " + window.__ss.op.scene + " " + window.__ss.op.ch1Step));
await page.evaluate(() => (window.__ss.op.ch1Step = "cal"));
g.check("Day 2 after PUT: the box is on the floor", await blueAt(335, 510));
const solids2 = await page.evaluate(() => window.__ss.solids());
g.check("Day 2 after PUT: the box is solid", solids2.some((o) => o.x0 === 307));

await g.finish("bedroom-walk");
