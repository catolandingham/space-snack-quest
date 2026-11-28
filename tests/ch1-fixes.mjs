/**
 * Thin Chapter 1 fixes on the locked rooms: the bedroom stops you on the
 * blue G box and the mop bucket. The bucket does not open a cut-in.
 *   node tests/ch1-fixes.mjs
 */
import { startGame } from "./game-page.mjs";

const g = await startGame({ port: 8834, name: "ch1-fixes" });
const { ctx, page, errors } = await g.open("?ch=1", { width: 1100, height: 800 });

async function walk(x, y, frames, day2 = false) {
  return page.evaluate(
    async (x, y, frames, day2) => {
      const n = window.__ss.op;
      n.scene = "Q1";
      n.room = "closet";
      n.ctrl = true;
      n.sqPose = "stand";
      n.moPose = "hidden";
      n.mo.x = -400;
      n.q = [];
      n.cur = null;
      n.ch1Morning = null;
      n.ch1Day2 = day2;
      n.ch1Step = day2 ? "hm-lunch" : "";
      n.ch1PartyNow = null;
      n.sq.x = x;
      n.sq.y = y;
      window.dispatchEvent(new KeyboardEvent("keydown", { code: "ArrowLeft", bubbles: true }));
      window.__trail = [];
      for (let i = 0; i < frames; i++) (window.__ss.tick(0.05), window.__trail.push([n.sq.x, n.sq.y]));
      window.dispatchEvent(new KeyboardEvent("keyup", { code: "ArrowLeft", bubbles: true }));
      window.__ss.tick(0.05);
      return [Math.round(n.sq.x), Math.round(n.sq.y)];
    },
    x,
    y,
    frames,
    day2,
  );
}

// The G box is in the closet on day 1 (Brian, 2026-11-15); on day 2 it comes out only while he puts the gift in, then
// goes back in the closet (Brian, 2026-11-26; src/modules/home-morning.js), so nothing on the floor there stops a walk.
const gbox = await walk(320, 384, 50, true);
const through = await page.evaluate(() => window.__trail.filter(([x, y]) => x > 188 && x < 236 && y > 366 && y < 394));
g.check("day 2, after the gift: the box is back in the closet, so a walk by the wardrobe goes through where it stood", gbox[0] < 236 && through.length > 0, { end: gbox, through: through.length });
// while it is out on the floor (he is putting the gift in) it is solid: a walk there stops at it
await page.evaluate(() => {
  window.__ss.ch1JumpBeat(22);
  window.SSQ.beat("ch1-home-morning").jump("box");
  Object.assign(window.__ss.op.ch1HomeMorning, { boxOut: true, step: "closeup" });
});
const gboxOut = await walk(320, 384, 50, true);
const throughOut = await page.evaluate(() => window.__trail.filter(([x, y]) => x > 188 && x < 236 && y > 366 && y < 394));
g.check("day 2, while the box is out on the floor: it stops a walk through it", gboxOut[0] < 320 && throughOut.length === 0, { end: gboxOut, through: throughOut.length });
await page.evaluate(() => window.__ss.op.ch1HomeMorning && (window.__ss.op.ch1HomeMorning.step = "done"));
const bed = await walk(320, 450, 30);
g.check("the bed stops a walk through it", bed[0] >= 280 && bed[0] < 320, bed);
const floor = await walk(420, 540, 50);
g.check("the open floor below the bed and the G box stays open", floor[0] < 200, floor);
const bucket = await walk(680, 540, 50);
g.check("the mop bucket stops a walk through it", bucket[0] >= 590 && bucket[0] < 680, bucket);
const past = await walk(680, 576, 60);
g.check("the lane under the bucket stays open", past[0] < 520, past);

const atBucket = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.scene = "Q1";
  n.room = "closet";
  n.ctrl = true;
  n.sqPose = "stand";
  n.moPose = "hidden";
  n.ch1Morning = null;
  n.ch1Day2 = false;
  // The evening (party P1, src/modules/party.js).
  window.SSQ.beat("ch1-party").jump("P1");
  n.q = [];
  n.cur = null;
  n.live = [];
  n.sq.x = 566;
  n.sq.y = 540;
  ss.tick(0.05);
  return ss.spotsNow().map((s) => s && s.verb + " · " + s.cap);
});
g.check("the bucket does not open a beard cut-in", !atBucket.some((s) => s && s.startsWith("DUNK")), atBucket);

g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("ch1-fixes");
