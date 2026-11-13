/**
 * Thin Chapter 1 fixes on the locked rooms: the bedroom stops you on the
 * blue G box and the mop bucket, and the beard dunk is a short close-up.
 *   node tests/ch1-fixes.mjs
 */
import { startGame } from "./game-page.mjs";

const g = await startGame({ port: 8834, name: "ch1-fixes" });
const { ctx, page, errors } = await g.open("?ch=1", { width: 1100, height: 800 });

async function walk(x, y, frames) {
  return page.evaluate(
    async (x, y, frames) => {
      const n = window.__ss.op;
      n.scene = "Q1";
      n.room = "closet";
      n.ctrl = true;
      n.sqPose = "stand";
      n.moPose = "hidden";
      n.mo.x = -400;
      n.q = [];
      n.cur = null;
      n.ch1Song = false;
      n.ch1Day2 = false;
      n.ch1PeekReady = false;
      n.ch1Dress = null;
      n.ch1Search = false;
      n.guard = null;
      n.sq.x = x;
      n.sq.y = y;
      window.dispatchEvent(new KeyboardEvent("keydown", { code: "ArrowLeft", bubbles: true }));
      for (let i = 0; i < frames; i++) window.__ss.tick(0.05);
      window.dispatchEvent(new KeyboardEvent("keyup", { code: "ArrowLeft", bubbles: true }));
      window.__ss.tick(0.05);
      return [Math.round(n.sq.x), Math.round(n.sq.y)];
    },
    x,
    y,
    frames,
  );
}

const gbox = await walk(420, 500, 50);
g.check("the blue G box stops a walk through it", gbox[0] >= 370 && gbox[0] < 420, gbox);
const bed = await walk(320, 450, 30);
g.check("the bed stops a walk through it", bed[0] >= 280 && bed[0] < 320, bed);
const floor = await walk(420, 540, 50);
g.check("the open floor below the bed and the G box stays open", floor[0] < 200, floor);
const bucket = await walk(680, 540, 50);
g.check("the mop bucket stops a walk through it", bucket[0] >= 590 && bucket[0] < 680, bucket);
const past = await walk(680, 576, 60);
g.check("the lane under the bucket stays open", past[0] < 520, past);

const dunk = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.scene = "Q1";
  n.room = "closet";
  n.ctrl = true;
  n.sqPose = "stand";
  n.moPose = "hidden";
  n.ch1Song = false;
  n.ch1Day2 = false;
  n.ch1PeekReady = true;
  n.ch1Wrung = false;
  n.ch1Dress = null;
  n.ch1Cut = null;
  n.q = [];
  n.cur = null;
  n.sq.x = 566;
  n.sq.y = 540;
  ss.tick(0.05);
  const act = ss.offerNow();
  const spots = ss.spotsNow().map((s) => s && s.verb + " · " + s.cap);
  if (!act || act.verb !== "DUNK") return { spots, act: act && act.verb };
  act.f();
  ss.tick(0.05);
  ss.drawFrame();
  return { spots, panel: n.cur && n.cur.id, ctrl: n.ctrl, wrung: n.ch1Wrung };
});
g.check(
  "dunking the beard opens a wordless close-up and is not the first prompt",
  dunk.panel === "ch1wring" && dunk.ctrl === false && dunk.wrung === true && dunk.spots[0] !== "DUNK · beard",
  dunk,
);

g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("ch1-fixes");
