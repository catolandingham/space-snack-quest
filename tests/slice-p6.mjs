/**
 * Playtest 6 on the chapter slice: the picture does not jump when NEXT appears,
 * and Isfred's party line points at him on the stage (at the mic, party plan cast).
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
// Since PR 51 (Brian, 2026-11-15) Isfred stands on the party stage and his line points at him there.
// The old check (bubble low in the room, clear of an office desk at the top left) described the room before the stage fix.
const box = bubble.box;
g.check(
  "Isfred's party line points at him on the stage and stays on screen",
  bubble.at.x === 420 && bubble.at.y === 190 && box && box.y >= 0 && box.x >= 0 && box.x + box.w <= 960 && box.y + box.h <= bubble.at.y,
  bubble,
);

// The dress-up and the "PUT ON · tourist disguise" fade went with the party rebuild (src/modules/dress-up.js):
// tests/party-scenes.mjs checks the full-screen dress-up, its GO · party button and ↺.

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

// Sound is off until the speaker is tapped (Brian, 2026-11-23): turn it on, as a player would.
await page.click("#ss-sound");
await page.click("canvas");
const music = await page.evaluate(async () => {
  const ss = window.__ss;
  const n = ss.op;
  ss.game.state = "title";
  ss.tick(0.05);
  const titleCue = ss.warmCue;
  for (let i = 0; i < 30 && ss.warmPlay !== "ok"; i++) await new Promise((r) => setTimeout(r, 100));
  // The morning's own recording hands the room back once its fade-out has run (it began at the title).
  for (let i = 0; i < 80 && window.SSQ.homeMusic.owns(); i++) ss.tick(0.05);
  n.scene = "Q1";
  n.room = "closet";
  // Past the morning (its own music owns the home room until "That evening…"), with no bubble up.
  n.ch1Morning = null;
  n.cur = null;
  n.q = [];
  n.ch1Party = false;
  n.ch1Search = false;
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
