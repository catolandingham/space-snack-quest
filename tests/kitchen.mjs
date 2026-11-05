/**
 * Kitchen corrections. State and pixels, not caption searches.
 *   npm install --no-save puppeteer-core
 *   CHROME=/usr/bin/google-chrome node tests/kitchen.mjs
 */
import http from "node:http";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

let puppeteer;
try {
  puppeteer = (await import("puppeteer-core")).default;
} catch {
  console.error("puppeteer-core is not installed, so the kitchen tests cannot start.");
  console.error("From the repo root: npm install --no-save puppeteer-core");
  process.exit(1);
}
const chrome = process.env.CHROME || "/usr/bin/google-chrome";
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
  const box = g.getImageData(370, 330, 60, 40).data;
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
const door = await px(28, 265);
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
  n.room = "kitchen"; n.mo.x = 250; n.mo.y = 500; window.__ss.ch2.phase = "wash5";
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
  ss.ch2.phase = "g6"; ss.ch2.bots = []; ss.ch2.sec = null; ss.ch.sing = false;
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
let paid = null;
for (let i = 0; i < 8; i++) {
  await sleep(400);
  await page.evaluate(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space", bubbles: true }));
    window.dispatchEvent(new KeyboardEvent("keyup", { code: "Space", bubbles: true }));
  });
  paid = await page.evaluate(() => {
    const n = window.__ss.op;
    const said = n.log.map((row) => row.text || "").join("|");
    return { reg: window.__ss.ch2.reg, has: window.__ss.ch2.has, jar: window.__ss.ch2.jar, said, verb: n.act && n.act.verb };
  });
  if (paid.has === "soup" && paid.reg === 30) break;
}
check(
  "the jar buys soup instead of gas, once",
  grabbed.verb === "GRAB" && grabbed.has === "coins" && grabbed.jar === 0 && buyVerb === "BUY" && paid && paid.has === "soup" && paid.jar === 0 && paid.reg === 30 && paid.said.includes("Soup instead of gas") && paid.verb !== "BUY",
  { grabbed, buyVerb, paid },
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
check("stacked captions each count down together", stacked.length === 3 && stacked.every((t) => t < 2.8 && t > 0.5), stacked);

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
  ss.ch2.phase = "wash1"; ss.ch2.peek = 2; ss.ch2.cook = ""; ss.ch2.sec = null;
});
await sleep(250);
const peek = await page.evaluate(() => {
  const n = window.__ss.op;
  const cur = (n.cur && n.cur.b && n.cur.b.text) || "";
  const q = n.q.map((row) => (row.b && row.b.text) || "").join("|");
  return { text: cur + "|" + q, sec: window.__ss.ch2.sec };
});
check(
  "Gloop startles when she sees Squatch and does not raise the alarm yet",
  peek.text.includes("What is that by the sink?!") && peek.text.includes("A WOOKIE!") && !peek.text.includes("Pump bots") && !peek.sec,
  peek,
);

check(
  "arrivals separate local fear from the trooper danger",
  arrivals.gas.includes("Locals still fear Sasquatches. Troopers are the greater danger. Neither is safe.") && arrivals.gas.includes("Not the scrubbers?") && arrivals.phobos.includes("Folks here still jump at a Squatch.") && arrivals.phobos.includes("lock you up") && arrivals.mars.includes("Locals are scared of a Squatch.") && arrivals.mars.includes("I'll use them on purpose.") && !arrivals.gas.includes("Locals and troopers use this stop"),
  arrivals,
);

await browser.close();
server.close();
if (fails.length) {
  console.error("Failed:", fails.join(", "));
  process.exit(1);
}
console.log("kitchen checks passed");
