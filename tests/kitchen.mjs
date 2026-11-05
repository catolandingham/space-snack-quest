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
for (let i = 0; i < 40; i++) {
  await sleep(100);
  cook = await page.evaluate(() => ({
    state: window.__ss.ch2.cook,
    x: Math.round(window.__ss.ch2.cookX || 0),
    y: Math.round(window.__ss.ch2.cookY || 0),
  }));
  if (!seen.includes(cook.state)) seen.push(cook.state);
  if (cook.state === "gone" && cook.x > 900) break;
}
check("cook stands, runs across the kitchen, and leaves through the door", seen.includes("wake") && seen.includes("run") && cook && cook.state === "gone" && cook.x > 900, { seen, cook });

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
  n.mo.x = 880; n.mo.y = 500; ss.ch2.phase = "wash5"; ss.ch2.jar = 30; ss.ch2.has = "";
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
const ask = await page.evaluate(() => {
  const n = window.__ss.op;
  const before = window.__ss.ch2.jar;
  const verb = n.act && n.act.verb;
  if (verb === "ASK") window.__ss.actionDown();
  return { verb, jar: window.__ss.ch2.jar, before, live: (n.live[0] && n.live[0].text) || "" };
});
check("Mops walks to the front and asks Gloop without spending coins", front.verb === "FRONT" && front.room === "diner" && ask.verb === "ASK" && ask.jar === 30 && ask.live.includes("30") && ask.live.includes("jar"), { front, ask });

await page.evaluate(() => {
  const n = window.__ss.op;
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
  n.mo.x = 480; n.mo.y = 500; ss.ch2.phase = "g4"; ss.ch2.has = "coins"; ss.ch2.jar = 0; ss.ch2.reg = 0;
});
await sleep(80);
await page.evaluate(() => { if (window.__ss.op.act && window.__ss.op.act.verb === "BUY") window.__ss.actionDown(); });
for (let i = 0; i < 4; i++) {
  await page.evaluate(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space", bubbles: true }));
    window.dispatchEvent(new KeyboardEvent("keyup", { code: "Space", bubbles: true }));
  });
  await sleep(350);
}
const paid = await page.evaluate(() => ({ reg: window.__ss.ch2.reg, has: window.__ss.ch2.has }));
check("soup still costs the existing 30 coins", paid.reg === 30 && paid.has === "soup", paid);

await browser.close();
server.close();
if (fails.length) {
  console.error("Failed:", fails.join(", "));
  process.exit(1);
}
console.log("kitchen checks passed");
