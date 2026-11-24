/**
 * Brian's 2026-11-13 gameplay: a story wait needs a tap, a sight is a short hop,
 * and Zip calls security.
 * The yellow arrow his Nov 13 ask put on story waits is gone, replaced by his newer words: 18a, 2026-11-23,
 * "I don't want next and tap here, just next", and his playthrough comment at the party, "The yellow
 * flashing light on the bottom right doesn't make sense". The NEXT button is the only cue now.
 *   node tests/brian-1113.mjs
 */
import { startGame } from "./game-page.mjs";

const g = await startGame({ port: 8841, name: "brian-1113" });
const { ctx, page, errors } = await g.open("?ch=1");

const wait = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.q = [];
  n.cur = { k: "wait", t: 9 };
  n.bt = 0;
  n.waitDone = false;
  n.q.push({ k: "do", f: () => (n.waitDone = true) });
  for (let i = 0; i < 40; i++) ss.tick(0.05);
  const held = n.cur && n.cur.k === "wait" && n.waitDone === false;
  ss.drawFrame();
  const cv = document.querySelector("canvas");
  const g2 = cv.getContext("2d", { willReadFrequently: true });
  let arrow = false;
  for (let y = cv.height - 110; y < cv.height - 40 && !arrow; y += 2) {
    for (let x = cv.width - 110; x < cv.width - 40; x += 2) {
      const px = g2.getImageData(x, y, 1, 1).data;
      if (px[0] > 200 && px[1] > 160 && px[2] < 80) arrow = true;
    }
  }
  n.bt = 1;
  ss.opTap();
  ss.tick(0.05);
  return { held, arrow, done: n.waitDone === true, cur: n.cur && n.cur.k };
});
g.check("a story wait does not end by itself", wait.held, wait);
g.check("the wait shows no yellow arrow and no words (Brian 18a: just NEXT)", !wait.arrow, wait);
g.check("a tap ends the story wait", wait.done && !wait.cur, wait);

await ctx.close();
const late = await g.open("?ch=3");
const hop = await late.page.evaluate(() => {
  const ss = window.__ss;
  ss.sceneP0();
  const n = ss.op;
  const Q = ss.ch3 || null;
  n.q = [];
  n.cur = null;
  n.ctrl = true;
  n.on = true;
  n.scene = "P1";
  n.room = "pad";
  n.sqPose = "stand";
  n.sqHop = null;
  const zipX = 400;
  if (ss.ch3) {
    ss.ch3.zip = true;
    ss.ch3.phase = "p1";
    ss.ch3.zipX = zipX;
  }
  n.sq.x = zipX + 90;
  n.sq.y = 360;
  const x0 = n.sq.x;
  ss.drawFrame();
  const started = !!n.sqHop;
  const sec = !!(ss.ch2 && ss.ch2.sec);
  const shouted = (n.live || []).some((row) => row.text === "SECURITY!");
  ss.tick(0.05);
  const mid = Math.abs(n.sq.x - x0);
  for (let i = 0; i < 8; i++) ss.tick(0.05);
  const end = Math.abs(n.sq.x - x0);
  return { started, sec, shouted, mid, end, x0, x: n.sq.x, scene: n.scene, zip: ss.ch3 && ss.ch3.zip };
});
g.check("Zip's sight starts a hop instead of a one-step jump", hop.started && hop.mid > 2 && hop.mid < 60, hop);
g.check("the hop finishes about 70 pixels away in a quarter second", hop.end > 40 && hop.end < 90, hop);
g.check("Zip's sight calls security", hop.sec && hop.shouted, hop);

g.check("no page errors", errors.length === 0 && late.errors.length === 0, { first: errors, late: late.errors });
await late.ctx.close();
await g.finish("brian-1113");
