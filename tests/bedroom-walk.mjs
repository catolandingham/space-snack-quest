/**
 * Beat 1 bedroom: Squatch walks smoothly around his crate bed, and the Guardian Box
 * is in the closet until Day 2 (Brian, 2026-11-16).
 *   node tests/bedroom-walk.mjs
 */
import { startGame, toMorningSong } from "./game-page.mjs";

const g = await startGame({ port: 8946, name: "bedroom walk" });
const { page } = await g.open("?ch=1");
await page.click("canvas");

// Play the real start (the morning, src/modules/morning.js) until Squatch can walk: he is out of bed,
// on the floor in front of it, and the song plays.
await toMorningSong(page);
const ready = await page.evaluate(() => window.__ss.op.ctrl && window.__ss.op.sqPose === "stand");
g.check("the start reaches the first goal with Squatch out of bed", ready);

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

// Mops walking out past Squatch at the end of the morning does not shove him (he used to jump out of Mops's way).
const shove = await page.evaluate(() => {
  const n = window.__ss.op;
  Object.assign(n, { q: [], cur: null, scene: "Q1", room: "closet", ctrl: true, sqPose: "stand", moPose: "stand", ch1Morning: { step: "leave", t: 0, notes: true } });
  n.mo.walking = true;
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

// Day 2: the box comes out of the closet while Squatch puts the gift in it (src/modules/home-morning.js), then goes
// back in (Brian, 2026-11-26).
await page.evaluate(() => {
  const n = window.__ss.op;
  Object.assign(n, { q: [], cur: null, ch1Morning: null });
  window.__ss.ch1JumpBeat(22);
  window.SSQ.beat("ch1-home-morning").jump("box");
  for (let i = 0; i < 4; i++) window.__ss.tick(0.05);
});
g.check("Day 2 before PUT: still in the closet (none on the floor)", !(await blueAt(198, 368)));
const put = await page.evaluate(() => (window.__ss.spotsNow() || []).find((s) => s.verb === "PUT IN"));
g.check("Day 2: PUT IN · box is at the closet", put && put.x < 330 && put.y < 410, await page.evaluate(() => JSON.stringify(window.__ss.spotsNow()) + " " + window.__ss.op.scene + " " + window.__ss.op.ch1Step));
await page.evaluate(() => window.SSQ.beat("ch1-home-morning").jump("cal"));
g.check("Day 2 after PUT: the box is back in the closet (none on the floor)", !(await blueAt(198, 368)));
const solids2 = await page.evaluate(() => window.__ss.solids());
g.check("Day 2 after PUT: nothing solid where it stood", !solids2.some((o) => o.x0 === 188));

await g.finish("bedroom-walk");
