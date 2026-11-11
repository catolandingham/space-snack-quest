/**
 * Playtest 6 on the chapter slice: the picture does not jump when NEXT appears,
 * Isfred's party line sits under the office monitor, and the disguise fades in.
 *   node tests/slice-p6.mjs
 */
import { startGame, sleep } from "./game-page.mjs";

const g = await startGame({ port: 8813, name: "slice-p6" });
const { ctx, page, errors } = await g.open("?ch=1", { width: 1100, height: 800 });
const top = () => page.evaluate(() => document.querySelector("canvas").getBoundingClientRect().top);
const withNext = await top();
await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  for (let i = 0; i < 8; i++) {
    if (n.cur && (n.cur.k === "card" || n.cur.k === "bub")) {
      n.bt = 1;
      ss.opTap();
    }
    ss.tick(0.05);
  }
});
await sleep(250);
const without = await top();
g.check("the picture stays put when NEXT hides", Math.abs(withNext - without) < 2, { withNext, without });

const bubble = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.scene = "QA";
  n.room = "hall";
  n.ch1Party = true;
  n.ch1Office = false;
  n.ch1D = false;
  n.cur = { k: "bub", b: { who: "official", text: "Welcome, everybody, to the Stormtop Space Party!", style: "say" } };
  n.q = [];
  ss.hall.camX = 0;
  ss.drawFrame();
  return { at: ss.bubbleAt("official"), box: ss.lastBubble };
});
g.check(
  "Isfred's party line starts below the office monitor",
  bubble.at.y >= 300 && bubble.box && bubble.box.y >= 168,
  bubble,
);

const veil = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.scene = "QA";
  n.room = "hall";
  n.ch1Party = true;
  n.ch1Disguise = false;
  n.ch1PartyOver = false;
  n.ch1Dress = null;
  n.ch1Cut = null;
  n.ctrl = true;
  n.cur = null;
  n.q = [];
  n.sqPose = "stand";
  n.sq.x = 220;
  n.sq.y = 530;
  const spot = ss.spotsNow().find((s) => s && s.cap === "tourist disguise");
  if (!spot) return { missing: true };
  spot.f();
  const before = { veil: n.ch1Veil, on: !!n.ch1Disguise };
  for (let i = 0; i < 20; i++) ss.tick(0.05);
  const mid = { veil: n.ch1Veil, on: !!n.ch1Disguise };
  for (let i = 0; i < 20; i++) ss.tick(0.05);
  return { before, mid, after: { veil: n.ch1Veil, on: !!n.ch1Disguise, ctrl: n.ctrl } };
});
g.check("the disguise fades in instead of popping on", veil.mid && veil.mid.on === true && veil.before.on === false && veil.after.veil < 0.05 && veil.after.ctrl === true, veil);

g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("slice-p6");
