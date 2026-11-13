/**
 * Kitchen corrections. State and pixels, not caption searches.
 * Composition C hit map, radii unchanged:
 * COOK is the range at Hn (800, 430); stand within 110 of (800, 500).
 * GRAB stays at (660, 430) radius 80, the pass window.
 * Sink KV (480, 430), FRONT door (53, 500), and the cone from (690, 220) stay put.
 * Oven glass is the range door at (804, 348). Tickets hang in the 300px pass.
 * LEAVE SOUP chip is beside the full-height door; the hotspot x stays 180.
 *   npm install --no-save puppeteer-core
 *   CHROME=/usr/bin/google-chrome node tests/kitchen.mjs
 */
import http from "node:http";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromePath } from "./chrome-path.mjs";

let puppeteer;
try {
  puppeteer = (await import("puppeteer-core")).default;
} catch {
  console.error("puppeteer-core is not installed, so the kitchen tests cannot start.");
  console.error("From the repo root: npm install --no-save puppeteer-core");
  process.exit(1);
}
const chrome = chromePath();
if (!existsSync(chrome)) {
  console.error(`Chrome was not found at ${chrome}.`);
  process.exit(1);
}
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = await readFile(join(root, "index.html"));
const server = http.createServer((req, res) => {
  res.writeHead(200, { "content-type": "text/html" });
  res.end(html);
});
await new Promise((r) => server.listen(8768, "127.0.0.1", r));
let browser;
try {
  browser = await puppeteer.launch({ executablePath: chrome, headless: "new", args: ["--no-sandbox", "--disable-gpu"] });
} catch (err) {
  server.close();
  console.error(`Chrome at ${chrome} did not start: ${err instanceof Error ? err.message : err}`);
  process.exit(1);
}
const page = await browser.newPage();
const fails = [];
const check = (name, ok, detail) => {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? " " + JSON.stringify(detail) : ""}`);
  if (!ok) fails.push(name);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await page.goto("http://127.0.0.1:8768/index.html", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.__ss);

function px(x, y) {
  return page.evaluate((x, y) => {
    const c = document.querySelector("canvas");
    const g = c.getContext("2d", { willReadFrequently: true });
    const d = g.getImageData(x, y, 1, 1).data;
    return [d[0], d[1], d[2]];
  }, x, y);
}

await page.evaluate(() => {
  const ss = window.__ss;
  ss.startOpening();
  const n = ss.op;
  n.q = []; n.cur = null; n.scene = "G1"; n.room = "gas"; n.ctrl = true;
  ss.swapTo(true);
  n.mo.x = 400; n.mo.y = 520; n.mo.f = 1; n.moPose = "stand";
  ss.ch2.has = "soup"; ss.ch2.phase = "g1"; ss.ch2.sec = null;
});
await sleep(400);
const bowl = await page.evaluate(() => {
  const c = document.querySelector("canvas");
  const g = c.getContext("2d", { willReadFrequently: true });
  let soup = 0;
  // T10: the bowl rests on his head. Mops at (400, 520) facing right: head top (431, 451), soup surface near y 431.
  const box = g.getImageData(407, 420, 48, 22).data;
  for (let i = 0; i < box.length; i += 4) {
    const r = box[i], gv = box[i + 1], b = box[i + 2];
    if (r > 200 && gv > 140 && gv < 220 && b < 130) soup++;
  }
  const hand = g.getImageData(430, 450, 1, 1).data;
  return { soup, hand: [hand[0], hand[1], hand[2]] };
});
check("a readable soup bowl covers Mops's head", bowl.soup > 40, bowl);
check("the hand is not wearing that soup bowl", !(bowl.hand[0] > 200 && bowl.hand[1] > 140 && bowl.hand[2] < 130), bowl);

await page.evaluate(() => {
  const n = window.__ss.op;
  n.cur = { k: "panel", id: "stamp" };
  n.panelT = 0.05;
  n.q = [];
});
await sleep(200);
const early = await px(504, 356);
await page.evaluate(() => { window.__ss.op.panelT = 2.4; });
await sleep(250);
const late = await px(504, 356);
const brown = (c) => c[0] > 90 && c[0] > c[2] + 20 && c[1] < 140;
check("hoof stamp darkens the note as the panel plays", !brown(early) && brown(late), { early, late });

await page.evaluate(() => {
  const n = window.__ss.op;
  n.cur = null; n.q = []; n.scene = "G2k"; n.room = "kitchen"; n.ctrl = true;
  window.__ss.ch2.phase = "wash1";
  window.__ss.ch2.cook = "down";
  window.__ss.ch2.cookT = 5.95;
  window.__ss.ch2.cookX = 640;
  window.__ss.ch2.cookY = 530;
  window.__ss.ch2.cookLine = 0;
  window.__ss.ch2.cookTold = 0;
  window.__ss.ch2.peekT = 99;
  window.__ss.ch2.peek = 0;
  window.__ss.ch2.warn = 0;
  window.__ss.ch2.eye = 0;
  window.__ss.ch2.sec = null;
});
const seen = [];
let cook = null;
let running = null;
for (let i = 0; i < 70; i++) {
  await sleep(100);
  cook = await page.evaluate(() => ({
    state: window.__ss.ch2.cook,
    x: Math.round(window.__ss.ch2.cookX || 0),
    y: Math.round(window.__ss.ch2.cookY || 0),
  }));
  if (!seen.includes(cook.state)) seen.push(cook.state);
  if (cook.state === "run") running = cook;
  if (cook.state === "gone" && cook.x < 100) break;
}
// The exit line sits over the cook at the door, so the red check is the door above that bubble.
const door = await px(50, 180);
const doorRed = door[0] > 200 && door[1] < 120 && door[2] < 100;
check(
  "cook wakes, screams, and runs out the left diner door",
  seen.includes("wake") && seen.includes("scream") && seen.includes("run") && cook && cook.state === "gone" && cook.x < 100 && running && running.x < 640 && running.y > 390 && running.y < 450 && doorRed,
  { seen, cook, running, door },
);

await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.cur = null; n.q = []; n.scene = "G2k"; n.room = "kitchen"; n.ctrl = true;
  n.sqPose = "stand"; n.sq.x = 400; n.sq.y = 500; ss.swapTo(false);
  ss.ch2.phase = "wash1"; ss.ch2.warn = 1; ss.ch2.peek = 0;
});
await sleep(80);
const roll = await page.evaluate(() => {
  const verb = window.__ss.op.act && window.__ss.op.act.verb;
  if (verb === "ROLL") window.__ss.actionDown();
  return { verb, pose: window.__ss.op.sqPose };
});
check("kitchen duck is a roll into a ball", roll.verb === "ROLL" && roll.pose === "ball", roll);

await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.cur = null; n.q = []; n.live = [];
  n.scene = "G5k"; n.room = "kitchen"; n.ctrl = true; ss.swapTo(true);
  n.mo.x = 70; n.mo.y = 500; ss.ch2.phase = "wash5"; ss.ch2.jar = 30; ss.ch2.has = "";
  ss.ch2.cooked = 0;
});
await sleep(80);
const front = await page.evaluate(() => {
  const n = window.__ss.op;
  const verb = n.act && n.act.verb;
  if (verb === "FRONT") window.__ss.actionDown();
  return { verb, room: n.room, x: Math.round(n.mo.x) };
});
// FRONT walks out of the kitchen and in through the diner door before control returns.
for (let i = 0; i < 40 && (await page.evaluate(() => !!window.__ss.op.roomWalk || !window.__ss.op.ctrl)); i++) await sleep(100);
await page.evaluate(() => {
  const n = window.__ss.op;
  n.sq.x = -300; n.sqPose = "hidden";
  n.mo.x = 480; n.mo.y = 500; n.live = [];
  window.__ss.ch2.phase = "g4";
});
await sleep(80);
const askPrompt = await page.evaluate(() => {
  const act = window.__ss.op.act;
  return { verb: act && act.verb, y: act && Math.round(act.y) };
});
await page.evaluate(() => {
  if (window.__ss.op.act && window.__ss.op.act.verb === "ASK") window.__ss.actionDown();
});
await sleep(150);
const askLines = await page.evaluate(() => {
  const n = window.__ss.op;
  const cur = (n.cur && n.cur.b && n.cur.b.text) || "";
  const q = n.q.map((s) => (s.b && s.b.text) || "").join("|");
  return { jar: window.__ss.ch2.jar, has: window.__ss.ch2.has, text: cur + "|" + q };
});
const ask = { ...askPrompt, ...askLines };
check(
  "Mops uses the left kitchen door, then hears soup and gas are both 30",
  front.verb === "FRONT" && front.room === "diner" && ask.verb === "ASK" && ask.y === 210 && ask.jar === 30 && ask.has === "" && ask.text.includes("jar") && ask.text.includes("Soup is 30") && ask.text.includes("tank is 30") && ask.text.includes("Soup instead of gas"),
  { front, ask },
);

await page.evaluate(() => {
  const n = window.__ss.op;
  n.q = []; n.cur = null; n.ctrl = true;
  n.room = "kitchen"; n.mo.x = 800; n.mo.y = 500; window.__ss.ch2.phase = "wash5";
  window.__ss.ch2.jar = 30; window.__ss.ch2.cooked = 0; n.live = [];
});
await sleep(80);
const cookTicket = await page.evaluate(() => {
  const n = window.__ss.op;
  const verb = n.act && n.act.verb;
  const jar = window.__ss.ch2.jar;
  if (verb === "COOK") window.__ss.actionDown();
  return { verb, jar: window.__ss.ch2.jar, was: jar, cooked: window.__ss.ch2.cooked, live: (n.live[0] && n.live[0].text) || "" };
});
check("cooking a ticket does not change the jar", cookTicket.verb === "COOK" && cookTicket.jar === 30 && cookTicket.cooked === 1, cookTicket);

await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.q = []; n.cur = null; n.scene = "G6"; n.room = "gas"; n.ctrl = true;
  n.sqPose = "stand"; n.sq.x = 780; n.sq.y = 500; ss.swapTo(false);
  ss.ch2.phase = "g6"; ss.ch2.bots = []; ss.ch2.sec = null; ss.ch.sing = false; ss.ch2.fuel = true;
});
await sleep(100);
await page.evaluate(() => {
  const verb = window.__ss.op.act && window.__ss.op.act.verb;
  if (verb === "BOARD") window.__ss.actionDown();
});
let aboard = null;
for (let i = 0; i < 40; i++) {
  await sleep(80);
  aboard = await page.evaluate(() => {
    const n = window.__ss.op;
    const cur = n.cur;
    return {
      x: Math.round(n.sq.x),
      pose: n.sqPose,
      text: (cur && cur.b && cur.b.text) || "",
      who: cur && cur.b && cur.b.who,
    };
  });
  if (aboard.text.includes("Phobos") && aboard.who === "sq") break;
}
const bubble = await page.evaluate(() => {
  const c = document.querySelector("canvas");
  const g = c.getContext("2d", { willReadFrequently: true });
  const white = (x0, x1, y0, y1) => {
    const d = g.getImageData(x0, y0, x1 - x0, y1 - y0).data;
    let n = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i] > 245 && d[i + 1] > 245 && d[i + 2] > 245) n++;
    return n;
  };
  return { left: white(10, 100, 250, 480), ship: white(600, 920, 250, 480) };
});
check("Phobos line is spoken at the ship, not off the left edge", !!(aboard && aboard.who === "sq" && aboard.x > 600 && bubble.ship > bubble.left), { aboard, bubble });

await page.evaluate(() => { window.__ss.sceneG4(); });
await sleep(200);
const scared = await page.evaluate(() => {
  const n = window.__ss.op;
  const cur = n.cur;
  const q = n.q.map((s) => (s.b && s.b.text) || "").join("|");
  return ((cur && cur.b && cur.b.text) || "") + "|" + q;
});
check("diner no longer opens on the scared-first-night line", !scared.includes("scared") && scared.includes("hungry"), scared);

await page.evaluate(() => {
  const n = window.__ss.op;
  n.q = []; n.cur = null; n.live = [];
  n.scene = "G6"; n.room = "diner"; n.ctrl = true;
  window.__ss.swapTo(true);
  n.mo.x = 48; n.mo.y = 500;
  window.__ss.ch2.phase = "g6d"; window.__ss.ch2.has = "coins";
  n.pulse.add("dfront");
});
await sleep(80);
const exitAt = await page.evaluate(() => {
  const act = window.__ss.op.act;
  window.__ss.op.mo.x = 90; window.__ss.op.mo.y = 560;
  return { verb: act && act.verb, x: act && Math.round(act.x), y: act && Math.round(act.y) };
});
await sleep(80);
const floor = await page.evaluate(() => window.__ss.op.act && window.__ss.op.act.verb);
check("EXIT is the red door, not the floor corner", exitAt.verb === "EXIT" && exitAt.x === 48 && floor !== "EXIT", { exitAt, floor });

await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.q = []; n.cur = null; n.live = [];
  n.room = "diner"; n.scene = "G4"; n.ctrl = true; ss.swapTo(true);
  n.mo.x = 360; n.mo.y = 460;
  ss.ch2.phase = "g4"; ss.ch2.has = ""; ss.ch2.jar = 30; ss.ch2.reg = 0; ss.ch2.fuel = false;
});
await sleep(80);
const grabbed = await page.evaluate(() => {
  const act = window.__ss.op.act;
  if (act && act.verb === "GRAB") window.__ss.actionDown();
  return { verb: act && act.verb, jar: window.__ss.ch2.jar, has: window.__ss.ch2.has };
});
await page.evaluate(() => { window.__ss.op.mo.x = 480; window.__ss.op.mo.y = 500; });
await sleep(80);
const buyVerb = await page.evaluate(() => window.__ss.op.act && window.__ss.op.act.verb);
await page.evaluate(() => { if (window.__ss.op.act && window.__ss.op.act.verb === "BUY") window.__ss.actionDown(); });
let committed = null;
for (let i = 0; i < 8; i++) {
  await sleep(400);
  await page.evaluate(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space", bubbles: true }));
    window.dispatchEvent(new KeyboardEvent("keyup", { code: "Space", bubbles: true }));
  });
  committed = await page.evaluate(() => {
    const n = window.__ss.op;
    const said = n.log.map((row) => row.text || "").join("|");
    return { reg: window.__ss.ch2.reg, has: window.__ss.ch2.has, jar: window.__ss.ch2.jar, said };
  });
  if (committed.has === "soup" && committed.reg === 30) break;
}
await sleep(250);
const after = await page.evaluate(() => {
  const verb = window.__ss.op.act && window.__ss.op.act.verb;
  if (verb === "BUY") window.__ss.actionDown();
  return { verb, reg: window.__ss.ch2.reg, has: window.__ss.ch2.has, jar: window.__ss.ch2.jar };
});
await sleep(300);
const repressed = await page.evaluate(() => ({ reg: window.__ss.ch2.reg, has: window.__ss.ch2.has, verb: window.__ss.op.act && window.__ss.op.act.verb }));
check(
  "the jar buys soup instead of gas, once",
  grabbed.verb === "GRAB" && grabbed.has === "coins" && grabbed.jar === 0 && buyVerb === "BUY" && committed && committed.has === "soup" && committed.jar === 0 && committed.reg === 30 && committed.said.includes("Soup instead of gas") && after.verb !== "BUY" && after.reg === 30 && repressed.reg === 30 && repressed.has === "soup" && repressed.verb !== "BUY",
  { grabbed, buyVerb, committed, after, repressed },
);

await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.q = []; n.cur = null; n.live = []; n.ctrl = true;
  n.room = "diner"; n.mo.x = 360; n.mo.y = 460;
  ss.ch2.phase = "g6d"; ss.ch2.jar = 30; ss.ch2.has = "";
});
await sleep(80);
const second = await page.evaluate(() => {
  const act = window.__ss.op.act;
  if (act && act.verb === "GRAB") window.__ss.actionDown();
  return { verb: act && act.verb, jar: window.__ss.ch2.jar, has: window.__ss.ch2.has, reg: window.__ss.ch2.reg };
});
await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.q = []; n.cur = null; n.ctrl = true; n.room = "gas"; n.scene = "G6";
  n.mo.x = 450; n.mo.y = 500;
  ss.ch2.phase = "g6"; ss.ch2.rust.x = 450; ss.ch2.rust.nap = true; ss.ch2.bots = []; ss.ch2.sec = null;
});
await sleep(80);
await page.evaluate(() => { if (window.__ss.op.act && window.__ss.op.act.verb === "GIVE") window.__ss.actionDown(); });
await sleep(400);
await page.evaluate(() => {
  window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space", bubbles: true }));
  window.dispatchEvent(new KeyboardEvent("keyup", { code: "Space", bubbles: true }));
});
await sleep(250);
const fueled = await page.evaluate(() => ({
  fuel: window.__ss.ch2.fuel,
  has: window.__ss.ch2.has,
  reg: window.__ss.ch2.reg,
  jar: window.__ss.ch2.jar,
  verb: window.__ss.op.act && window.__ss.op.act.verb,
}));
check(
  "a later jar buys gas and the soup payment stays in the register",
  second.verb === "GRAB" && second.has === "coins" && second.jar === 0 && second.reg === 30 && fueled.fuel === true && fueled.has === "" && fueled.reg === 30,
  { second, fueled },
);

await page.evaluate(() => {
  const n = window.__ss.op;
  n.q = []; n.cur = null; n.live = []; n.egg = null; n.ctrl = true;
  n.scene = "G2k"; n.room = "kitchen";
  window.__ss.swapTo(false);
  window.__ss.ch2.peek = 3; window.__ss.ch2.cook = "gone";
});
await sleep(150);
const coneOn = await px(624, 387);
await page.evaluate(() => { window.__ss.ch2.peek = 0; });
await sleep(150);
const coneOff = await px(624, 387);
check(
  "Gloop's kitchen cone is visibly darker red while he is peeking",
  coneOn[0] - coneOn[2] > coneOff[0] - coneOff[2] + 15,
  { coneOn, coneOff },
);

await page.evaluate(() => {
  const n = window.__ss.op;
  n.q = []; n.cur = { k: "card", id: "jail", text: "LOCKUP" }; n.egg = null;
});
await sleep(150);
const bars = await px(238, 300);
const pen = await px(400, 250);
check("the lockup card draws a holding pen", bars[0] > 180 && bars[1] > 180 && pen[0] < 80 && pen[2] < 120, { bars, pen });

await page.evaluate(() => {
  const n = window.__ss.op;
  n.cur = null; n.q = []; n.egg = null;
  n.live = [
    { who: "bot", text: "ONE", style: "say", live: 3 },
    { who: "bot2", text: "TWO", style: "say", live: 3 },
    { who: "sq", text: "THREE", style: "say", live: 3 },
  ];
});
await sleep(500);
const stacked = await page.evaluate(() => window.__ss.op.live.map((row) => Math.round(row.live * 10) / 10));
// T9: one bubble at a time. The first caption counts down; the others wait their turn at full time.
check("queued captions wait their turn: only the first counts down", stacked.length === 3 && stacked[0] < 2.8 && stacked[0] > 0.5 && stacked[1] === 3 && stacked[2] === 3, stacked);

await page.evaluate(() => {
  const n = window.__ss.op;
  n.live = []; n.egg = null; n.ctrl = false;
  n.q = [
    { k: "bub", b: { who: "sq", text: "Line one", style: "say" } },
    { k: "bub", b: { who: "mops", text: "Line two", style: "say" } },
    { k: "bub", b: { who: "gloop", text: "Line three", style: "say" } },
  ];
  n.cur = null;
});
await sleep(450);
await page.evaluate(() => {
  window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space", bubbles: true }));
  window.dispatchEvent(new KeyboardEvent("keyup", { code: "Space", bubbles: true }));
});
await sleep(200);
const stepped = await page.evaluate(() => {
  const n = window.__ss.op;
  return {
    cur: n.cur && n.cur.b && n.cur.b.text,
    left: n.q.map((row) => row.b && row.b.text),
  };
});
check("NEXT advances one bubble and leaves the rest", stepped.cur === "Line two" && stepped.left.length === 1 && stepped.left[0] === "Line three", stepped);

await page.evaluate(() => {
  const n = window.__ss.op;
  n.q = []; n.cur = { k: "bub", b: { who: "sq", text: "Stay put", style: "say" } };
});
await sleep(200);
await page.evaluate(() => {
  window.dispatchEvent(new KeyboardEvent("keydown", { code: "Escape", bubbles: true }));
  window.dispatchEvent(new KeyboardEvent("keyup", { code: "Escape", bubbles: true }));
});
await sleep(150);
const kept = await page.evaluate(() => window.__ss.op.cur && window.__ss.op.cur.b && window.__ss.op.cur.b.text);
await page.evaluate(() => {
  const n = window.__ss.op;
  n.q = []; n.cur = { k: "fb", pic: "tour", cap: "Skip me" }; n.fbN = 3; n.fbI = 1;
});
await sleep(150);
const dot = await px(480, 24);
await page.evaluate(() => {
  window.dispatchEvent(new KeyboardEvent("keydown", { code: "Escape", bubbles: true }));
  window.dispatchEvent(new KeyboardEvent("keyup", { code: "Escape", bubbles: true }));
});
await sleep(150);
const skipped = await page.evaluate(() => window.__ss.op.cur);
check(
  "skip and flashback dots stay on flashbacks",
  kept === "Stay put" && !skipped && dot[2] > 180 && dot[2] > dot[0],
  { kept, skipped, dot },
);

await page.evaluate(() => {
  const n = window.__ss.op;
  n.q = []; n.cur = null; n.egg = null;
  n.sq.x = 480; n.sq.y = 420;
  n.q.push({ k: "bub", b: { who: "sq", text: "La la la", style: "song" } });
});
await sleep(200);
const song = await page.evaluate(() => {
  const n = window.__ss.op;
  const row = n.log[n.log.length - 1];
  return { style: row && row.style, text: n.cur && n.cur.b && n.cur.b.text };
});
const pink = await px(480, 300);
check("a song line is logged as a song and draws pink", song.style === "song" && song.text === "La la la" && pink[0] > 220 && pink[2] > 180, { song, pink });

await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.q = []; n.cur = null; n.egg = null; n.live = []; n.ctrl = true;
  n.scene = "S9"; n.room = "hall"; n.sqPose = "stand";
  n.sq.x = 800; n.sq.y = 300; ss.swapTo(false);
  n.found.delete("goatspace");
});
await sleep(120);
const pull = await page.evaluate(() => {
  const act = window.__ss.op.act;
  if (act && act.verb === "PULL") window.__ss.actionDown();
  return act && act.verb;
});
await sleep(200);
const air = await page.evaluate(() => ({ egg: !!window.__ss.op.egg }));
const airPx = await px(480, 120);
check("the airlock pull still opens the egg", pull === "PULL" && air.egg && airPx[0] < 40 && airPx[2] < 70, { pull, air, airPx });

await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.q = []; n.cur = null; n.egg = null; n.ctrl = true; n.sqPose = "stand";
  n.scene = "M4"; n.room = "inside";
  n.sq.x = 420; n.sq.y = 540; ss.swapTo(false);
  ss.ch4.phase = "m4a"; ss.ch4.beam = 1;
});
await sleep(120);
const mars = await page.evaluate(() => {
  const act = window.__ss.op.act;
  if (act && act.verb === "ROLL") window.__ss.actionDown();
  return { verb: act && act.verb, beam: window.__ss.ch4.beam };
});
await sleep(200);
await page.evaluate(() => { window.__ss.op.q = []; window.__ss.op.cur = null; });
await sleep(150);
const balled = await page.evaluate(() => ({ pose: window.__ss.op.sqPose, beam: window.__ss.ch4.beam }));
const ballPx = await px(420, 524);
check(
  "Mars duck is a roll that stops the beam",
  mars.verb === "ROLL" && mars.beam === -1 && balled.pose === "ball" && balled.beam === -1 && ballPx[0] > 70 && ballPx[0] < 150 && ballPx[2] < 60,
  { mars, balled, ballPx },
);

const arrivals = await page.evaluate(() => {
  const ss = window.__ss;
  const read = () => {
    const n = ss.op;
    const cur = (n.cur && ((n.cur.b && n.cur.b.text) || n.cur.text)) || "";
    const q = n.q.map((row) => (row.b && row.b.text) || row.text || "").join("|");
    return cur + "|" + q;
  };
  ss.sceneG0();
  const gas = read();
  ss.sceneP0();
  const phobos = read();
  ss.sceneM0();
  const mars = read();
  return { gas, phobos, mars };
});
await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.q = []; n.cur = null; n.live = []; n.egg = null; n.ctrl = true;
  n.scene = "G2k"; n.room = "kitchen"; n.sqPose = "stand";
  n.sq.x = 624; n.sq.y = 437; ss.swapTo(false);
  ss.ch2.phase = "wash1"; ss.ch2.peek = 3; ss.ch2.eye = 0; ss.ch2.cook = "";
  ss.ch2.sec = null; ss.ch2.jar = 30; ss.ch2.reg = 12; ss.ch2.has = "soup";
});
await sleep(200);
const unsure = await page.evaluate(() => {
  const n = window.__ss.op;
  const cur = (n.cur && n.cur.b && n.cur.b.text) || "";
  const q = n.q.map((row) => (row.b && row.b.text) || "").join("|");
  return { live: n.live.map((row) => row.text).join("|"), text: cur + "|" + q, sec: window.__ss.ch2.sec };
});
let recognized = null;
for (let i = 0; i < 20; i++) {
  await sleep(100);
  recognized = await page.evaluate(() => {
    const n = window.__ss.op;
    const cur = (n.cur && n.cur.b && n.cur.b.text) || "";
    const q = n.q.map((row) => (row.b && row.b.text) || "").join("|");
    return { live: n.live.map((row) => row.text).join("|"), text: cur + "|" + q, sec: !!window.__ss.ch2.sec, jar: window.__ss.ch2.jar, reg: window.__ss.ch2.reg };
  });
  if (recognized.sec && recognized.text.includes("A WOOKIE!")) break;
}
check(
  "Gloop's window look startles, then recognition calls security",
  unsure.live.includes("What is that by the sink?!") && !unsure.sec && !unsure.text.includes("A WOOKIE!") && recognized.sec && recognized.text.includes("A WOOKIE!") && !recognized.text.includes("*faints*") && recognized.live.includes("SECURITY!") && recognized.jar === 30 && recognized.reg === 12,
  { unsure, recognized },
);
await page.evaluate(() => { window.__ss.op.q = []; window.__ss.op.cur = null; window.__ss.op.sqPose = "ball"; window.__ss.op.ctrl = true; });
let windowHid = null;
for (let i = 0; i < 30; i++) {
  await sleep(100);
  windowHid = await page.evaluate(() => ({ sec: window.__ss.ch2.sec, scene: window.__ss.op.scene, phase: window.__ss.ch2.phase, jar: window.__ss.ch2.jar }));
  if (!windowHid.sec) break;
}
check(
  "rolling in the kitchen sends that security away",
  !!(windowHid && !windowHid.sec && windowHid.scene === "G2k" && windowHid.phase === "wash1" && windowHid.jar === 30),
  windowHid,
);

await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.q = []; n.cur = null; n.live = []; n.ctrl = true; n.sqPose = "stand";
  n.scene = "G2k"; n.room = "kitchen"; n.sq.x = 624; n.sq.y = 437; ss.swapTo(false);
  ss.ch2.phase = "wash1"; ss.ch2.peek = 3; ss.ch2.eye = 0; ss.ch2.cook = "";
  ss.ch2.sec = null; ss.ch2.jar = 30; ss.ch2.reg = 12; ss.ch2.has = "soup";
});
let windowCap = null;
for (let i = 0; i < 40; i++) {
  await sleep(100);
  windowCap = await page.evaluate(() => window.__ss.op.cur && window.__ss.op.cur.b && window.__ss.op.cur.b.text);
  if (windowCap === "A WOOKIE!") break;
}
for (let i = 0; i < 6; i++) {
  await page.evaluate(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space", bubbles: true }));
    window.dispatchEvent(new KeyboardEvent("keyup", { code: "Space", bubbles: true }));
  });
  await sleep(400);
}
for (let i = 0; i < 40 && !(windowCap && String(windowCap).includes("LOCKUP")); i++) {
  await sleep(100);
  windowCap = await page.evaluate(() => {
    const n = window.__ss.op;
    const cur = n.cur;
    return cur && (cur.k + ":" + (cur.text || (cur.b && cur.b.text) || ""));
  });
}
check("kitchen recognition capture opens LOCKUP", !!(windowCap && String(windowCap).includes("LOCKUP")), windowCap);
const sinkPen = await page.evaluate(() => {
  const n = window.__ss.op;
  const c = document.querySelector("canvas");
  const g = c.getContext("2d", { willReadFrequently: true });
  const at = (x, y) => { const d = g.getImageData(x, y, 1, 1).data; return [d[0], d[1], d[2]]; };
  return { by: n.cur && n.cur.by, q: n.q.map((row) => (row.b && row.b.text) || "").join("|"), cook: at(350, 500), win: at(560, 250) };
});
check(
  "the window lockup shows the cook down and the orders window",
  sinkPen.by === "sink" && sinkPen.q.includes("Next time I roll.") && sinkPen.cook[1] > 150 && sinkPen.cook[1] > sinkPen.cook[0] && sinkPen.win[2] > 200,
  sinkPen,
);
await sleep(450);
for (let i = 0; i < 4; i++) {
  await page.evaluate(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space", bubbles: true }));
    window.dispatchEvent(new KeyboardEvent("keyup", { code: "Space", bubbles: true }));
  });
  await sleep(400);
  windowCap = await page.evaluate(() => ({
    ctrl: window.__ss.op.ctrl, scene: window.__ss.op.scene, phase: window.__ss.ch2.phase,
    sq: [Math.round(window.__ss.op.sq.x), Math.round(window.__ss.op.sq.y)],
    sec: window.__ss.ch2.sec, jar: window.__ss.ch2.jar, reg: window.__ss.ch2.reg, has: window.__ss.ch2.has,
    cur: window.__ss.op.cur && window.__ss.op.cur.k,
  }));
  if (windowCap.ctrl && windowCap.sq[0] === 480 && windowCap.sq[1] === 430) break;
}
await sleep(400);
const sinkStay = await page.evaluate(() => ({
  ctrl: window.__ss.op.ctrl,
  sec: window.__ss.ch2.sec,
  peek: window.__ss.ch2.peek,
  eye: window.__ss.ch2.eye || 0,
  sq: [Math.round(window.__ss.op.sq.x), Math.round(window.__ss.op.sq.y)],
}));
check(
  "kitchen capture restarts at the sink with control and keeps the jar",
  !!(windowCap && windowCap.ctrl && windowCap.scene === "G2k" && windowCap.phase === "wash1" && windowCap.sq[0] === 480 && windowCap.sq[1] === 430 && !windowCap.sec && windowCap.jar === 30 && windowCap.reg === 12 && windowCap.has === "soup" && sinkStay.ctrl && !sinkStay.sec && !sinkStay.peek && !sinkStay.eye && sinkStay.sq[0] === 480 && sinkStay.sq[1] === 430),
  { windowCap, sinkStay },
);

const counterBefore = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.q = []; n.cur = null; n.live = []; n.ctrl = true; n.sqPose = "stand";
  n.scene = "G4"; n.room = "diner"; ss.swapTo(false);
  n.sq.x = 373; n.sq.y = 300;
  ss.ch2.phase = "g4"; ss.ch2.sec = null; ss.ch2.jar = 30; ss.ch2.reg = 12; ss.ch2.has = "coins";
  n.sq._seen = ss.inWedge(n.sq.x, n.sq.y - 40, 468, 230, Math.PI - 0.3, 0.42, 165);
  return Math.round(n.sq.x);
});
let counter = null;
for (let i = 0; i < 16; i++) {
  await sleep(100);
  counter = await page.evaluate(() => {
    const n = window.__ss.op;
    return {
      live: n.live.map((row) => row.text).join("|"),
      sec: !!window.__ss.ch2.sec,
      x: Math.round(n.sq.x),
      seen: n.sq._seen,
      jar: window.__ss.ch2.jar,
    };
  });
  if (counter.sec) break;
}
check(
  "Gloop at the counter startles, shoves, and calls security",
  !!(counter.seen && counter.live.includes("A Squatch?! Back from the counter!") && counter.live.includes("SECURITY!") && counter.sec && Math.abs(counter.x - counterBefore) >= 20 && counter.jar === 30),
  { counterBefore, counter },
);
await page.evaluate(() => { window.__ss.op.sqPose = "hidden"; window.__ss.op.q = []; window.__ss.op.cur = null; });
let counterHid = null;
for (let i = 0; i < 30; i++) {
  await sleep(100);
  counterHid = await page.evaluate(() => ({ sec: window.__ss.ch2.sec, scene: window.__ss.op.scene, phase: window.__ss.ch2.phase, jar: window.__ss.ch2.jar, reg: window.__ss.ch2.reg }));
  if (!counterHid.sec) break;
}
check(
  "hiding from counter security does not restart the diner or spend the jar",
  !!(counterHid && !counterHid.sec && counterHid.scene === "G4" && counterHid.phase === "g4" && counterHid.jar === 30 && counterHid.reg === 12),
  counterHid,
);

await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.q = []; n.cur = null; n.live = []; n.ctrl = true; n.sqPose = "stand";
  n.scene = "G4"; n.room = "diner"; ss.swapTo(false);
  n.sq.x = 373; n.sq.y = 300; n.sq.moving = false;
  ss.ch2.phase = "g4"; ss.ch2.sec = null; ss.ch2.jar = 30; ss.ch2.reg = 12; ss.ch2.has = "coins";
});
let counterCap = null;
for (let i = 0; i < 60; i++) {
  await sleep(100);
  counterCap = await page.evaluate(() => {
    const cur = window.__ss.op.cur;
    return cur && (cur.k + ":" + (cur.text || (cur.b && cur.b.text) || ""));
  });
  if (counterCap && String(counterCap).includes("LOCKUP")) break;
}
check("counter recognition capture opens LOCKUP", !!(counterCap && String(counterCap).includes("LOCKUP")), counterCap);
const dinerPen = await page.evaluate(() => {
  const n = window.__ss.op;
  const c = document.querySelector("canvas");
  const g = c.getContext("2d", { willReadFrequently: true });
  const at = (x, y) => { const d = g.getImageData(x, y, 1, 1).data; return [d[0], d[1], d[2]]; };
  return { by: n.cur && n.cur.by, q: n.q.map((row) => (row.b && row.b.text) || "").join("|"), blorp: at(420, 400) };
});
check(
  "the counter lockup shows Blorp and the to-go line",
  dinerPen.by === "diner" && dinerPen.q.includes("I'll take it to go.") && dinerPen.blorp[2] > 200 && dinerPen.blorp[2] > dinerPen.blorp[0],
  dinerPen,
);
await sleep(450);
for (let i = 0; i < 4; i++) {
  await page.evaluate(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space", bubbles: true }));
    window.dispatchEvent(new KeyboardEvent("keyup", { code: "Space", bubbles: true }));
  });
  await sleep(400);
  counterCap = await page.evaluate(() => ({
    ctrl: window.__ss.op.ctrl, scene: window.__ss.op.scene, phase: window.__ss.ch2.phase,
    sec: window.__ss.ch2.sec, jar: window.__ss.ch2.jar, reg: window.__ss.ch2.reg, has: window.__ss.ch2.has,
    cur: window.__ss.op.cur && window.__ss.op.cur.k,
  }));
  if (counterCap.ctrl && counterCap.phase === "g4") break;
}
check(
  "counter capture restarts the diner section and keeps the coins",
  !!(counterCap && counterCap.ctrl && counterCap.scene === "G4" && counterCap.phase === "g4" && !counterCap.sec && counterCap.jar === 30 && counterCap.reg === 12 && counterCap.has === "coins" && !counterCap.cur),
  counterCap,
);

const blorpBefore = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.q = []; n.cur = null; n.live = []; n.ctrl = true; n.sqPose = "stand";
  n.scene = "G4"; n.room = "diner"; ss.swapTo(false);
  n.sq.x = 319; n.sq.y = 471;
  ss.ch2.phase = "g4"; ss.ch2.sec = null; ss.ch2.jar = 30;
  return Math.round(n.sq.x);
});
let blorp = null;
for (let i = 0; i < 16; i++) {
  await sleep(100);
  blorp = await page.evaluate(() => {
    const n = window.__ss.op;
    return { live: n.live.map((row) => row.text).join("|"), sec: !!window.__ss.ch2.sec, x: Math.round(n.sq.x), jar: window.__ss.ch2.jar };
  });
  if (blorp.sec) break;
}
check(
  "Blorp startles, shoves, and calls security",
  !!(blorp && blorp.live.includes("EEK! A Squatch near my soup!") && blorp.live.includes("SECURITY!") && blorp.sec && Math.abs(blorp.x - blorpBefore) >= 20 && blorp.jar === 30),
  { blorpBefore, blorp },
);

check(
  "arrivals separate local fear from the trooper danger",
  arrivals.gas.includes("Locals still fear Sasquatches. Troopers are the greater danger. Neither is safe.") && arrivals.gas.includes("Not the scrubbers?") && arrivals.phobos.includes("Folks here still jump at a Squatch.") && arrivals.phobos.includes("lock you up") && arrivals.mars.includes("Locals are scared of a Squatch.") && arrivals.mars.includes("I'll use them on purpose.") && !arrivals.gas.includes("Locals and troopers use this stop"),
  arrivals,
);

await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.q = []; n.cur = null; n.live = []; n.ctrl = true; n.egg = null;
  n.scene = "G2k"; n.room = "kitchen"; n.sqPose = "stand";
  n.sq.x = 480; n.sq.y = 500; ss.swapTo(false);
  ss.ch2.phase = "wash1"; ss.ch2.held = 1; ss.ch2.done = 0; ss.ch2.scrub = 0;
  ss.ch2.dishT = 0; ss.ch2.jar = 0; ss.ch2.reg = 4; ss.ch2.has = "";
  ss.ch2.cook = ""; ss.ch2.peek = 0; ss.ch2.warn = 0; ss.ch2.eye = 0; ss.ch2.peekT = 99; ss.ch2.sec = null;
  // A sight hop from the previous check is still moving him. Stop it so he stays at the sink.
  n.walkTo = null; n.sqHop = null; n.sq.moving = false;
});
await sleep(100);
const scrub = [];
for (let i = 0; i < 3; i++) {
  await page.evaluate(() => { if (window.__ss.op.act && window.__ss.op.act.verb === "SCRUB") window.__ss.actionDown(); });
  await sleep(80);
  scrub.push(await page.evaluate(() => {
    const c = document.querySelector("canvas");
    const g = c.getContext("2d", { willReadFrequently: true });
    const at = (x, y) => { const d = g.getImageData(x, y, 1, 1).data; return [d[0], d[1], d[2]]; };
    return {
      stage: window.__ss.ch2.dishN, scrub: window.__ss.ch2.scrub, dish: window.__ss.ch2.dishT > 0,
      sponge: at(490, 222), pore: at(478, 226), dirt: at(268, 214),
      jar: window.__ss.ch2.jar, reg: window.__ss.ch2.reg,
    };
  }));
}
const third = scrub[2];
const dirtBrown = (c) => c && c[0] > 70 && c[0] < 160 && c[1] < 120 && c[2] < 80;
const yellow = (c) => c && c[0] > 200 && c[1] > 150 && c[1] < 230 && c[2] < 120;
await sleep(1300);
const cleared = await page.evaluate(() => ({ dish: window.__ss.ch2.dishT > 0, held: window.__ss.ch2.held, done: window.__ss.ch2.done, jar: window.__ss.ch2.jar }));
check(
  "each scrub shows the paw and a real sponge, and the third stays 3/3 until the card clears",
  scrub.length === 3 && scrub[0].stage === 1 && scrub[0].dish && yellow(scrub[0].sponge) && dirtBrown(scrub[0].pore) && dirtBrown(scrub[0].dirt) && scrub[0].jar === 0 && third.stage === 3 && third.dish && third.scrub === 0 && !dirtBrown(third.dirt) && yellow(third.sponge) && dirtBrown(third.pore) && cleared.held === -1 && cleared.done === 1 && !cleared.dish && cleared.jar === 0,
  { scrub, cleared },
);
await page.evaluate(() => {
  const n = window.__ss.op;
  n.q = []; n.cur = null; n.ctrl = true; n.sq.x = 480; n.sq.y = 500;
  window.__ss.ch2.phase = "wash5"; window.__ss.ch2.held = 6; window.__ss.ch2.scrub = 2; window.__ss.ch2.mopN = 0; window.__ss.ch2.greasy = false; window.__ss.ch2.dishT = 0;
});
await sleep(80);
await page.evaluate(() => { if (window.__ss.op.act && window.__ss.op.act.verb === "SCRUB") window.__ss.actionDown(); });
await sleep(80);
const greasyCard = await page.evaluate(() => {
  const n = window.__ss.op;
  const c = document.querySelector("canvas");
  const g = c.getContext("2d", { willReadFrequently: true });
  const d = g.getImageData(200, 150, 1, 1).data;
  const cur = (n.cur && n.cur.b && n.cur.b.text) || "";
  const q = n.q.map((row) => (row.b && row.b.text) || "").join("|");
  return { stage: window.__ss.ch2.dishN, dish: window.__ss.ch2.dishT > 0, greasy: window.__ss.ch2.greasy, text: cur + "|" + q, cover: [d[0], d[1], d[2]] };
});
check(
  "the greasy pot closes the scrub card before the handoff lines",
  greasyCard.stage === 3 && !greasyCard.dish && greasyCard.greasy === true && greasyCard.text.includes("This pot is GLUED with grease!") && !(greasyCard.cover[0] > 250 && greasyCard.cover[1] > 245 && greasyCard.cover[2] > 230),
  greasyCard,
);
await page.evaluate(() => {
  const n = window.__ss.op;
  n.q = []; n.cur = null; n.ctrl = true; n.sq.x = 480; n.sq.y = 500;
  window.__ss.ch2.phase = "wash1"; window.__ss.ch2.done = 2; window.__ss.ch2.held = 3; window.__ss.ch2.scrub = 2; window.__ss.ch2.greasy = false; window.__ss.ch2.jar = 0; window.__ss.ch2.reg = 4;
});
await sleep(80);
await page.evaluate(() => { if (window.__ss.op.act && window.__ss.op.act.verb === "SCRUB") window.__ss.actionDown(); });
await sleep(100);
const fastLine = await page.evaluate(() => {
  const n = window.__ss.op;
  const cur = (n.cur && n.cur.b && n.cur.b.text) || "";
  const q = n.q.map((row) => (row.b && row.b.text) || "").join("|");
  return { dish: window.__ss.ch2.dishT > 0, text: cur + "|" + q };
});
check(
  "the wash-set line is not covered by the scrub card",
  !fastLine.dish && fastLine.text.includes("That goat washes FAST."),
  fastLine,
);
let jar = null;
for (let i = 0; i < 8; i++) {
  await sleep(400);
  await page.evaluate(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space", bubbles: true }));
    window.dispatchEvent(new KeyboardEvent("keyup", { code: "Space", bubbles: true }));
  });
  jar = await page.evaluate(() => ({ jar: window.__ss.ch2.jar, reg: window.__ss.ch2.reg, has: window.__ss.ch2.has }));
  if (jar.jar === 30) break;
}
check("a finished wash set still fills the jar with 30", !!(jar && jar.jar === 30 && jar.reg === 4 && jar.has === ""), jar);

await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.q = []; n.cur = null; n.live = []; n.ctrl = true;
  n.scene = "G2k"; n.room = "kitchen"; n.sq.x = 400; n.sq.y = 500;
  ss.ch2.phase = "wash1"; ss.ch2.cook = "down"; ss.ch2.cookT = 5.05; ss.ch2.rumbled = 0; ss.ch2.rumbleT = 0;
  ss.ch2.cookX = 640; ss.ch2.cookY = 530;
});
await sleep(250);
const rumble = await page.evaluate(() => {
  const c = document.querySelector("canvas");
  const g = c.getContext("2d", { willReadFrequently: true });
  const d = g.getImageData(330, 118, 1, 1).data; // the RUMBLE banner sits under the goal chip
  return { cook: window.__ss.ch2.cook, rumbled: window.__ss.ch2.rumbled, live: window.__ss.op.live.map((row) => row.text).join("|"), banner: [d[0], d[1], d[2]] };
});
await sleep(1100);
const woke = await page.evaluate(() => window.__ss.ch2.cook);
check(
  "the stomach rumble plays while the cook is still down, then she wakes",
  rumble.cook === "down" && !rumble.live.includes("*RUMBLE*") && rumble.rumbled === 1 && ["wake", "scream", "run", "gone"].includes(woke),
  { rumble, woke },
);

await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.q = []; n.cur = null; n.ctrl = true;
  n.scene = "G5k"; n.room = "kitchen"; n.moPose = "stand"; n.sq.x = 80; ss.swapTo(true);
  n.mo.x = 700; n.mo.y = 520; n.mo.f = 1;
  ss.ch2.phase = "wash5"; ss.ch2.greasy = false; ss.ch2.cooked = 0; ss.ch2.sec = null; ss.ch2.cook = "";
});
await sleep(120);
const hatOn = await px(729, 427);
await page.evaluate(() => { window.__ss.ch2.greasy = true; });
await sleep(120);
const hatOff = await px(729, 427);
const oven = await px(804, 348);
const hatWhere = await page.evaluate(() => ({ x: Math.round(window.__ss.op.mo.x), y: Math.round(window.__ss.op.mo.y), pose: window.__ss.op.moPose, phase: window.__ss.ch2.phase, room: window.__ss.op.room }));
check(
  "Mops wears the chef hat only while cooking, and the oven door is on the range",
  hatOn[0] > 180 && hatOn[1] < 120 && !(hatOff[0] > 180 && hatOff[1] < 120) && oven[0] < 100 && oven[2] < 140,
  { hatOn, hatOff, oven, hatWhere },
);

await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.q = []; n.cur = null; n.ctrl = true;
  n.scene = "G5k"; n.room = "kitchen"; n.moPose = "stand"; n.sq.x = 80; ss.swapTo(true);
  n.mo.x = 150; n.mo.y = 450;
  ss.ch2.phase = "g4k"; ss.ch2.has = "soup"; ss.ch2.greasy = false; ss.ch2.peek = 0; ss.ch2.warn = 0;
  ss.ch2.sec = null; ss.ch2.botsIn = false; ss.ch2.argueT = 9; ss.ch2.cook = "";
});
await sleep(100);
const leave = await page.evaluate(() => {
  const n = window.__ss.op;
  const act = n.act;
  return { verb: act && act.verb, x: act && Math.round(act.x), y: act && Math.round(act.y), mo: [Math.round(n.mo.x), Math.round(n.mo.y)], phase: window.__ss.ch2.phase, ctrl: n.ctrl };
});
const leavePx = await px(136, 304);
const bowlClear = await px(150, 250);
check(
  "LEAVE SOUP sits on the crate, not off to the side",
  leave.verb === "LEAVE SOUP" && leave.x === 180 && leavePx[0] > 245 && leavePx[1] > 240 && leavePx[2] > 220 && !(bowlClear[0] > 245 && bowlClear[1] > 240 && bowlClear[2] > 220),
  { leave, leavePx },
);

await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.q = []; n.cur = null; n.live = []; n.ctrl = true;
  n.scene = "G5k"; n.room = "kitchen"; ss.swapTo(true);
  n.mo.x = 480; n.mo.y = 500;
  ss.ch2.phase = "wash5"; ss.ch2.greasy = true; ss.ch2.mopN = 2; ss.ch2.jar = 30; ss.ch2.reg = 4;
});
await sleep(100);
const mopBring = await px(480, 430);
await page.evaluate(() => { if (window.__ss.op.act && window.__ss.op.act.verb === "MOP") window.__ss.actionDown(); });
for (let i = 0; i < 4; i++) {
  await sleep(400);
  await page.evaluate(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space", bubbles: true }));
    window.dispatchEvent(new KeyboardEvent("keyup", { code: "Space", bubbles: true }));
  });
}
let mopStay = null;
for (let i = 0; i < 30; i++) {
  await sleep(100);
  mopStay = await page.evaluate(() => ({ x: Math.round(window.__ss.op.mo.x), y: Math.round(window.__ss.op.mo.y), jar: window.__ss.ch2.jar, reg: window.__ss.ch2.reg }));
  if (mopStay.x === 760) break;
}
check(
  "Mops brings the mop and stays in the kitchen",
  mopBring[2] > 200 && mopBring[1] > 180 && mopStay && mopStay.x === 760 && mopStay.y === 520 && mopStay.jar === 30 && mopStay.reg === 4,
  { mopBring, mopStay },
);

async function railMeasure() {
  return page.evaluate(() => {
    const c = document.querySelector("canvas");
    const g = c.getContext("2d", { willReadFrequently: true });
    const at = (x, y) => {
      const d = g.getImageData(x, y, 1, 1).data;
      return [d[0], d[1], d[2]];
    };
    const dark = (p) => p[0] < 140 && p[1] < 150 && p[2] < 160;
    const rail = (p) => p[0] > 45 && p[0] < 80 && p[1] > 60 && p[1] < 100 && p[2] > 80 && p[2] < 130;
    const box = (x0, y0, w, h) => {
      let top = 999;
      let bot = -1;
      let n = 0;
      for (let y = y0; y < y0 + h; y++) {
        for (let x = x0; x < x0 + w; x++) {
          if (!dark(at(x, y))) continue;
          n++;
          if (y < top) top = y;
          if (y > bot) bot = y;
        }
      }
      return { n, h: bot < 0 ? 0 : bot - top + 1 };
    };
    return {
      left: box(520, 112, 56, 48),
      right: box(664, 112, 56, 48),
      railWide: rail(at(530, 96)),
      railNear: rail(at(700, 96)),
      railPx: at(530, 96),
    };
  });
}
await page.evaluate(() => {
  const n = window.__ss.op;
  n.q = []; n.cur = null; n.live = []; n.ctrl = true; n.sqPose = "stand";
  n.scene = "G5k"; n.room = "kitchen"; n.sq.x = 160; n.sq.y = 540;
  n.mo.x = 900; n.mo.y = 560; n.mo.f = -1;
  window.__ss.ch2.phase = "wash5";
  window.__ss.ch2.cooked = 0; window.__ss.ch2.done = 0; window.__ss.ch2.held = -1;
  window.__ss.ch2.peek = 0; window.__ss.ch2.peekT = 99; window.__ss.ch2.greasy = false; window.__ss.ch2.dishT = 0;
});
await sleep(180);
const rail3 = await railMeasure();
await page.evaluate(() => { window.__ss.ch2.cooked = 5; });
await sleep(180);
const rail1 = await railMeasure();
const dark = (p) => p && p[0] < 55 && p[1] < 70 && p[2] < 90;
check(
  "the order rail matches the tickets that are up, and the number is large",
  rail3.left.n > 40 && rail3.left.h >= 16 && rail3.right.n > 20 && rail3.railWide && rail3.railNear && rail1.left.n < 8 && rail1.right.n > 20 && !rail1.railWide && rail1.railNear,
  { rail3, rail1 },
);
await page.evaluate(() => { window.__ss.ch2.cooked = 0; });
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
await sleep(200);
const phoneRead = await page.evaluate(() => {
  const canvas = document.querySelector("canvas");
  const rect = canvas.getBoundingClientRect();
  const g = canvas.getContext("2d", { willReadFrequently: true });
  let top = 999;
  let bot = -1;
  for (let y = 112; y < 170; y++) {
    for (let x = 520; x < 576; x++) {
      const d = g.getImageData(x, y, 1, 1).data;
      if (d[0] < 140 && d[1] < 150 && d[2] < 160) {
        if (y < top) top = y;
        if (y > bot) bot = y;
      }
    }
  }
  const inkH = bot < 0 ? 0 : bot - top + 1;
  return { cssW: Math.round(rect.width), cssH: Math.round(rect.height), inkH, phonePx: Math.round(inkH * rect.width / 960) };
});
check(
  "ticket numbers stay readable on a 390 phone",
  phoneRead.cssW >= 350 && phoneRead.cssW <= 390 && phoneRead.cssH >= 230 && phoneRead.cssH <= 270 && phoneRead.phonePx >= 8,
  phoneRead,
);
await page.setViewport({ width: 1100, height: 800, deviceScaleFactor: 1 });
await page.evaluate(() => {
  window.__ss.ch2.cooked = 0;
  window.__ss.op.live = [{ who: "gloop", text: "What is that by the sink?!", style: "say", live: 8 }];
  window.__ss.op.cur = null;
  window.__ss.op.q = [];
});
await sleep(200);
const sinkLine = await page.evaluate(() => {
  const c = document.querySelector("canvas");
  const g = c.getContext("2d", { willReadFrequently: true });
  const at = (x, y) => { const d = g.getImageData(x, y, 1, 1).data; return [d[0], d[1], d[2]]; };
  const b = window.__ss.lastBubble;
  return { ticket: at(530, 112), bubble: b && { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.w), h: Math.round(b.h), who: b.who } };
});
const paper = (c) => c[0] > 240 && c[1] > 235 && c[2] > 220;
// T9: bubbles sit over the speaker, so Gloop's line is up by her order window, not in a bottom band.
const nearWindow = (b) => !!b && b.who === "gloop" && b.y + b.h < 300 && b.x < 690 + 220 && b.x + b.w > 690 - 220;
check(
  "the sink line sits by Gloop's window and leaves the tickets clear",
  paper(sinkLine.ticket) && nearWindow(sinkLine.bubble),
  sinkLine,
);

const sectionRows = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  const k = ss.ch2;
  const run = (phase, scene) => {
    n.q = [{ f() { k.jar = 99; } }];
    n.cur = { k: "bub", b: { text: "stuck line" } };
    n.live = [{ text: "live" }];
    k.jar = 12;
    k.reg = 4;
    k.has = "coins";
    // The lure checkpoint needs a full tank (Phase 3 review); before the tank, g6 restarts with Mops and the coins.
    k.fuel = phase === "g6" || phase === "g6d";
    n.stars = 40;
    k.phase = phase;
    n.scene = scene;
    n.room = "kitchen";
    n.sq.x = 10;
    n.sq.y = 10;
    n.sqPose = "stand";
    ss.sectionReset();
    return {
      phase: k.phase,
      scene: n.scene,
      room: n.room,
      x: Math.round(n.sq.x),
      y: Math.round(n.sq.y),
      pose: n.sqPose,
      mo: Math.round(n.mo.x),
      jar: k.jar,
      reg: k.reg,
      has: k.has,
      stars: n.stars,
      q: n.q.length,
      cur: n.cur,
      peekT: k.peekT,
      sec: k.sec,
      timer: k.timer,
    };
  };
  return {
    back: run("back", "G2b"),
    door: run("g1door", "G1"),
    g6: run("g6", "G6"),
    g6d: run("g6d", "G6"),
    hide: run("g3hide", "G3"),
    wash1: run("wash1", "G2k"),
    wash5: run("wash5", "G5k"),
    g4: run("g4", "G4"),
    g1: run("g1", "G1"),
    g4k: run("g4k", "G5k"),
  };
});
const sameSpot = (a, b) => a.scene === b.scene && a.room === b.room && a.phase === b.phase && a.x === b.x && a.y === b.y;
const keptPay = (row) => row.jar === 12 && row.reg === 4 && row.has === "coins" && row.stars === 40 && row.q === 0 && !row.cur;
check(
  "Reset section uses the capture checkpoint for every mapped section and keeps the jar",
  keptPay(sectionRows.back) && sectionRows.back.scene === "G2b" && sectionRows.back.phase === "back" && sectionRows.back.pose === "hidden" &&
    sameSpot(sectionRows.door, sectionRows.back) &&
    keptPay(sectionRows.g6) && sectionRows.g6.scene === "G6" && sectionRows.g6.phase === "g6" && sectionRows.g6.room === "gas" && sectionRows.g6.x === 85 &&
    sameSpot(sectionRows.g6d, sectionRows.g6) &&
    keptPay(sectionRows.hide) && sectionRows.hide.phase === "g3hide" && sectionRows.hide.scene === "G3" && sectionRows.hide.x === 300 && sectionRows.hide.y === 520 && sectionRows.hide.timer === 5.5 &&
    keptPay(sectionRows.wash1) && sectionRows.wash1.scene === "G2k" && sectionRows.wash1.room === "kitchen" && sectionRows.wash1.x === 480 && sectionRows.wash1.y === 430 && sectionRows.wash1.peekT === 7 && !sectionRows.wash1.sec &&
    keptPay(sectionRows.wash5) && sectionRows.wash5.scene === "G5k" && sectionRows.wash5.x === 230 && sectionRows.wash5.y === 520 && sectionRows.wash5.peekT === 4.5 &&
    keptPay(sectionRows.g4) && sectionRows.g4.scene === "G4" && sectionRows.g4.room === "diner" && sectionRows.g4.x === 170 && sectionRows.g4.pose === "hidden" && sectionRows.g4.mo === 600 &&
    keptPay(sectionRows.g1) && sectionRows.g1.scene === "G1" && sectionRows.g1.x === 760 && sectionRows.g1.y === 540 &&
    sectionRows.g4k.scene === "G4" && sectionRows.g4k.room === "kitchen" && sectionRows.g4k.phase === "g4k" && sectionRows.g4k.jar === 12,
  sectionRows,
);
const stillSees = await page.evaluate(() => window.__ss.inWedge(624, 387, 690, 220, 1.95, 0.75, 520));
check("a section reset does not turn off the window cone", stillSees === true, { stillSees });

await page.evaluate(() => {
  const n = window.__ss.op;
  n.scene = "G1"; n.room = "gas"; n.ctrl = true; n.sqPose = "stand";
  n.sq.x = 100; n.sq.y = 540;
  window.__ss.ch2.phase = "g1"; window.__ss.ch2.jar = 12;
  window.__ss.resetHold(true);
});
await sleep(200);
await page.evaluate(() => window.__ss.resetHold(false));
await sleep(700);
const released = await page.evaluate(() => ({ x: Math.round(window.__ss.op.sq.x), jar: window.__ss.ch2.jar }));
// Since Phase 3 the restart is the small round ↺ over the picture (#ss-reset), held the same way.
const resetBtn = await page.$("#ss-reset");
await page.evaluate(() => document.getElementById("ss-reset").scrollIntoView({ block: "center" }));
await page.evaluate(() => { window.__ss.op.sq.x = 100; window.__ss.ch2.phase = "g1"; window.__ss.op.scene = "G1"; });
await resetBtn.click({ delay: 200 });
const tap = await page.evaluate(() => Math.round(window.__ss.op.sq.x));
await page.evaluate(() => { window.__ss.op.sq.x = 100; window.__ss.ch2.phase = "g1"; window.__ss.op.scene = "G1"; });
await resetBtn.click({ delay: 1000 });
const held = await page.evaluate(() => ({ x: Math.round(window.__ss.op.sq.x), y: Math.round(window.__ss.op.sq.y), jar: window.__ss.ch2.jar, phase: window.__ss.ch2.phase }));
await page.evaluate(() => window.__ss.sectionReset());
const again = await page.evaluate(() => ({ x: Math.round(window.__ss.op.sq.x), y: Math.round(window.__ss.op.sq.y), jar: window.__ss.ch2.jar, phase: window.__ss.ch2.phase }));
check(
  "Reset section confirms only after a hold, then repeats the same checkpoint",
  released.x === 100 && released.jar === 12 && tap === 100 && held.x === 760 && held.y === 540 && held.jar === 12 && held.phase === "g1" && again.x === 760 && again.y === 540 && again.jar === 12,
  { released, tap, held, again },
);

await browser.close();
server.close();
if (fails.length) {
  console.error("Failed:", fails.join(", "));
  process.exit(1);
}
console.log("kitchen checks passed");
