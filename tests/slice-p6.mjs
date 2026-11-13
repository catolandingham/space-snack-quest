/**
 * Playtest 6 on the chapter slice: the picture does not jump when NEXT appears,
 * Isfred's party line sits under the office monitor, and the disguise fades in.
 *   node tests/slice-p6.mjs
 */
import { startGame, sleep } from "./game-page.mjs";

const g = await startGame({ port: 8813, name: "slice-p6" });
const { ctx, page, errors } = await g.open("?ch=1", { width: 1100, height: 800 });
const musicReqs = [];
page.on("request", (req) => {
  if (req.url().includes("main-theme-from-brian.mp3")) musicReqs.push(req.url());
});
const top = () => page.evaluate(() => document.querySelector("canvas").getBoundingClientRect().top);
const withNext = await top();
await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  for (let i = 0; i < 8; i++) {
    if (n.cur && (n.cur.k === "card" || n.cur.k === "bub" || n.cur.k === "wait")) {
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
const desk = { x0: 86, y0: 64, x1: 214, y1: 262 };
const box = bubble.box;
const overDesk =
  box && box.x < desk.x1 && box.x + box.w > desk.x0 && box.y < desk.y1 && box.y + box.h > desk.y0;
g.check(
  "Isfred's party line clears the manager desk",
  bubble.at.y >= 400 && box && box.y >= 168 && !overDesk,
  { ...bubble, overDesk },
);

const dress = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  const fill = () => {
    n.scene = "Q1";
    n.room = "closet";
    n.ctrl = true;
    n.cur = null;
    n.q = [];
    n.live = [];
    n.ch1Cut = null;
    n.ch1Song = false;
    n.ch1Search = false;
    n.ch1Mini = "";
    n.ch1Dress = {
      on: true,
      head: "tophat",
      face: "shades",
      body: "shirt",
      legs: "boots",
      extra: ["scarf", "bow", "nose", "pipe"],
    };
    n.sq.x = 120;
    n.sq.y = 400;
    n.ch1Veil = 0;
    n.ch1VeilTo = 0;
    ss.tick(0.05);
  };
  const press = (code) => document.dispatchEvent(new KeyboardEvent("keydown", { code, bubbles: true }));
  fill();
  const offer = ss.offerNow();
  const dist = Math.hypot(n.sq.x - 460, n.sq.y - 640);
  press("Space");
  const space = { veilTo: n.ch1VeilTo, ctrl: n.ctrl };
  fill();
  press("Enter");
  const enter = { veilTo: n.ch1VeilTo, ctrl: n.ctrl };
  fill();
  ss.actionDown();
  const keyE = { veilTo: n.ch1VeilTo, ctrl: n.ctrl };
  fill();
  ss.ch1Pointer("down", 480, 600);
  const click = { veilTo: n.ch1VeilTo, ctrl: n.ctrl };
  fill();
  ss.ch1Pointer("down", 120, 200);
  const miss = { veilTo: n.ch1VeilTo, on: !!(n.ch1Dress && n.ch1Dress.on) };
  fill();
  ss.ch1Pointer("down", 480, 600);
  for (let i = 0; i < 24; i++) ss.tick(0.05);
  const left = { on: !!(n.ch1Dress && n.ch1Dress.on), veil: n.ch1Veil, room: n.room };
  fill();
  ss.resetHold(true);
  for (let i = 0; i < 20; i++) ss.tick(0.05);
  ss.resetHold(false);
  return {
    verb: offer && offer.verb,
    dist,
    space,
    enter,
    keyE,
    click,
    miss,
    left,
    afterR: { on: !!(n.ch1Dress && n.ch1Dress.on), veil: n.ch1Veil || 0 },
  };
});
g.check(
  "Go! works from a corner by Space, Enter, E, and a click, and R clears the overlay",
  dress.verb === "GO" &&
    dress.dist > 400 &&
    dress.space.veilTo === 1 &&
    dress.enter.veilTo === 1 &&
    dress.keyE.veilTo === 1 &&
    dress.click.veilTo === 1 &&
    dress.miss.veilTo === 0 &&
    dress.miss.on === true &&
    dress.left.on === false &&
    dress.afterR.on === false &&
    dress.afterR.veil === 0,
  dress,
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

const patrol = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.scene = "Q4";
  n.ch1LookT = 2.15;
  const turn = ss.ch1NightLook(2.15);
  const away = ss.ch1NightLook(4);
  return {
    turnCatch: turn.catch,
    turnSeen: ss.ch1CaughtAt(480, 540, "stand"),
    awaySeen: (() => {
      n.ch1LookT = 4;
      return ss.ch1CaughtAt(480, 540, "stand");
    })(),
    face: away.face,
  };
});
g.check(
  "the night robot's turn does not catch, and the back-wall look clears the floor",
  patrol.turnCatch === false && patrol.turnSeen === false && patrol.awaySeen === false && Math.abs(patrol.face + Math.PI / 2) < 0.05,
  patrol,
);

await page.click("canvas");
const music = await page.evaluate(async () => {
  const ss = window.__ss;
  const n = ss.op;
  ss.game.state = "title";
  ss.tick(0.05);
  const titleCue = ss.warmCue;
  for (let i = 0; i < 30 && ss.warmPlay !== "ok"; i++) await new Promise((r) => setTimeout(r, 100));
  n.scene = "Q1";
  n.room = "closet";
  n.ch1Search = false;
  n.ch1Dress = null;
  n.guard = null;
  n.gift = false;
  n.holdToy = false;
  n.roomWalk = null;
  n.ch1Night = false;
  n.ch1Kid = "";
  n.sqPose = "stand";
  ss.game.state = "op";
  ss.tick(0.05);
  const homeCue = ss.warmCue;
  n.room = "hall";
  n.ch1Party = true;
  n.gift = true;
  ss.tick(0.05);
  const giftCue = ss.warmCue;
  n.gift = false;
  n.holdToy = false;
  n.room = "hangar";
  n.ch1Party = false;
  ss.tick(0.5);
  return { titleCue, homeCue, giftCue, play: ss.warmPlay, after: ss.warmCue || "", paused: ss.warmPaused };
});
g.check(
  "Joe's theme is requested and plays for the title, home, and the gift",
  music.titleCue === "title" &&
    music.homeCue === "home" &&
    music.giftCue === "gift" &&
    music.play === "ok" &&
    music.after === "" &&
    music.paused === true &&
    musicReqs.length > 0,
  { music, musicReqs },
);

g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("slice-p6");
