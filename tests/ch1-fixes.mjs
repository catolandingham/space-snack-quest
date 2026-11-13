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
  const cv = document.querySelector("canvas");
  const cx = cv.getContext("2d", { willReadFrequently: true });
  n.scene = "Q1";
  n.room = "closet";
  n.ctrl = true;
  n.sqPose = "stand";
  n.moPose = "hidden";
  n.ch1Song = false;
  n.ch1Day2 = false;
  n.ch1PeekReady = true;
  n.ch1Wrung = false;
  n.ch1Beard = null;
  n.ch1Dress = null;
  n.ch1Cut = null;
  n.q = [];
  n.cur = null;
  n.live = [];
  n.sq.x = 566;
  n.sq.y = 540;
  ss.tick(0.05);
  const before = ss.shown().length;
  const spots = ss.spotsNow().map((s) => s && s.verb + " · " + s.cap);
  const act = ss.offerNow();
  if (!act || act.verb !== "DUNK") return { spots, act: act && act.verb };
  act.f();
  ss.tick(0.25);
  const mid = n.ch1Beard && Math.round(n.ch1Beard.zoom * 100) / 100;
  ss.tick(0.25);
  ss.drawFrame();
  const light = (x, y) => {
    const p = cx.getImageData(x, y, 1, 1).data;
    return p[0] > 220 && p[1] > 220 && p[2] > 220;
  };
  const open = {
    zoom: n.ch1Beard && n.ch1Beard.zoom,
    mid,
    ctrl: n.ctrl,
    words: ss.shown().length - before,
    xCenter: light(880, 568 - 22),
    xEdge: light(880 - 30, 568),
    xOutside: light(880 - 50, 568),
  };
  const close = ss.spotsNow().find((s) => s && s.verb === "CLOSE");
  close && close.f();
  ss.tick(0.2);
  const closing = n.ch1Beard && Math.round(n.ch1Beard.zoom * 100) / 100;
  ss.tick(0.25);
  return { spots, open, closing, gone: !n.ch1Beard, ctrl: n.ctrl };
});
g.check(
  "the beard cut-in zooms in over half a second and is not the first prompt",
  dunk.open && dunk.open.mid > 0.4 && dunk.open.mid < 0.7 && dunk.open.zoom === 1 && dunk.open.words === 0 && dunk.spots[0] !== "DUNK · beard",
  dunk,
);
g.check(
  "the cut-in X is a white circle at the bottom right, at least 64 px, and the zoom out finishes in under half a second",
  dunk.open && dunk.open.xCenter && dunk.open.xEdge && !dunk.open.xOutside && dunk.closing > 0.3 && dunk.closing < 0.7 && dunk.gone && dunk.ctrl,
  dunk,
);

g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("ch1-fixes");
