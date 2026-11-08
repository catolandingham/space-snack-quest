/**
 * The cook is on screen before she says "A WOOKIE!", and she is on the floor for "*faints*".
 * No new words. The lines and the security call stay as they were.
 *   node tests/cook-order.mjs
 */
import { startGame } from "./game-page.mjs";

const g = await startGame({ port: 8807, name: "cook-order" });
const { page, errors } = await g.open("?ch=2");

const green = (rgb) => rgb && rgb[1] > 140 && rgb[1] > rgb[0] + 30 && rgb[1] > rgb[2] + 20;

const seen = await page.evaluate(async () => {
  const ss = window.__ss;
  const n = ss.op;
  n.q = [];
  n.cur = null;
  n.live = [];
  n.egg = null;
  n.ctrl = true;
  n.sqPose = "stand";
  n.scene = "G2k";
  n.room = "kitchen";
  n.sq.x = 624;
  n.sq.y = 437;
  ss.swapTo(false);
  Object.assign(ss.ch2, {
    phase: "wash1",
    peek: 0.2,
    eye: 0,
    warn: 0,
    cook: "",
    cookT: 0,
    sec: null,
    jar: 30,
    reg: 12,
    has: "soup",
    peekT: 99,
  });
  let hit = null;
  for (let i = 0; i < 180 && !hit; i++) {
    ss.tick(1 / 30);
    const cur = n.cur && n.cur.b && n.cur.b.text;
    if (cur === "A WOOKIE!") hit = true;
  }
  ss.drawFrame();
  const cv = document.querySelector("canvas").getContext("2d");
  const at = (x, y) => {
    const d = cv.getImageData(x, y, 1, 1).data;
    return [d[0], d[1], d[2]];
  };
  const body = at(640, 478);
  return {
    cur: n.cur && n.cur.b && n.cur.b.text,
    cook: ss.ch2.cook,
    x: ss.ch2.cookX,
    y: ss.ch2.cookY,
    body,
    queued: n.q.map((row) => (row.b && row.b.text) || row.k).join("|"),
  };
});

g.check(
  "while she says A WOOKIE! the cook is drawn standing, not missing and not already on the floor",
  seen.cur === "A WOOKIE!" && seen.cook === "seen" && seen.x === 640 && seen.y === 530 && green(seen.body),
  seen,
);

const faint = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space", bubbles: true }));
  window.dispatchEvent(new KeyboardEvent("keyup", { code: "Space", bubbles: true }));
  // A tap in the first 0.3s of a bubble is kept, then applied. Advance that clock here.
  for (let i = 0; i < 20; i++) ss.tick(1 / 30);
  ss.drawFrame();
  const d = document.querySelector("canvas").getContext("2d").getImageData(640, 530, 1, 1).data;
  return {
    cur: n.cur && n.cur.b && n.cur.b.text,
    cook: ss.ch2.cook,
    floor: [d[0], d[1], d[2]],
    queued: n.q.map((row) => (row.b && row.b.text) || row.k).join("|"),
  };
});

g.check(
  "on *faints* she is the same cook, on the floor, and the line is unchanged",
  faint.cur === "*faints*" && faint.cook === "down" && green(faint.floor),
  faint,
);

g.check("the page threw no errors", errors.length === 0, errors);
await g.finish("cook-order");
