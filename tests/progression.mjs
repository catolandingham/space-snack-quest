/**
 * Progression gates for the armature story.
 * Requires puppeteer-core installed where Node can resolve it, and Chrome.
 * Serves index.html itself on 127.0.0.1:8766 and drives the real game loop.
 */
import http from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = await readFile(join(root, "index.html"));
const server = http.createServer((req, res) => {
  if (req.url === "/" || req.url.startsWith("/index.html")) {
    res.writeHead(200, { "content-type": "text/html" });
    res.end(html);
    return;
  }
  res.writeHead(404);
  res.end();
});
await new Promise((r) => server.listen(8766, "127.0.0.1", r));

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME || "/usr/bin/google-chrome",
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu"],
});
const page = await browser.newPage();
const fails = [];
function check(name, ok, detail) {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? " " + JSON.stringify(detail) : ""}`);
  if (!ok) fails.push(name);
}
const held = new Set();
async function keys(codes) {
  for (const c of [...held]) if (!codes.includes(c)) { await page.keyboard.up(c); held.delete(c); }
  for (const c of codes) if (!held.has(c)) { await page.keyboard.down(c); held.add(c); }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

await page.goto("http://127.0.0.1:8766/index.html", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.__ss);

async function boot(sceneFn) {
  await page.evaluate((name) => {
    const ss = window.__ss;
    ss.startOpening();
    ss[name]();
    const n = ss.op;
    n.q = [];
    n.cur = null;
    n.ctrl = true;
  }, sceneFn);
  await sleep(80);
}

// S6: walking up to Mops starts the Mars ask. A straight walk must not softlock on the plant.
await boot("sceneS6");
await keys(["ArrowLeft", "ArrowUp"]);
let s6 = null;
for (let i = 0; i < 80; i++) {
  await sleep(50);
  s6 = await page.evaluate(() => {
    const n = window.__ss.op;
    const cur = n.cur;
    return {
      scene: n.scene,
      sq: [Math.round(n.sq.x), Math.round(n.sq.y)],
      cur: cur && (cur.b ? cur.b.text : cur.k),
    };
  });
  if (s6.cur) break;
}
await keys([]);
check("S6 walk to Mops starts the ask", !!(s6 && s6.cur && s6.scene === "S6"), s6);

// S11: stop the lure while the bot is still clear of the plant, then walk to the keypad.
await boot("sceneS11");
await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.sqPose = "hidden";
  n.sq.x = 900;
  n.sq.y = 346;
  ss.ch.spot = 9;
  ss.ch.sing = true;
  ss.ch.doorOpen = false;
  ss.swapTo(false);
});
let botx = 1320;
for (let i = 0; i < 200 && botx > 1050; i++) {
  await sleep(40);
  botx = await page.evaluate(() => window.__ss.ch.lureBot.x);
}
await page.evaluate(() => { window.__ss.ch.sing = false; window.__ss.swapTo(true); });
await keys(["ArrowUp"]);
await sleep(2300);
await keys(["ArrowRight"]);
await sleep(2200);
await keys([]);
const typed = await page.evaluate(() => {
  const n = window.__ss.op;
  const b = window.__ss.ch.lureBot;
  const before = n.act && n.act.verb;
  if (before === "TYPE") window.__ss.actionDown();
  return {
    before,
    mo: [Math.round(n.mo.x), Math.round(n.mo.y)],
    botLook: Math.round(b.look * 10) / 10,
    q: n.q.map((s) => s.k + ":" + (s.id || "")),
  };
});
check(
  "S11 lure window reaches the keypad",
  typed.before === "TYPE" && typed.q.some((s) => s === "panel:keypad"),
  typed,
);

// Bot on its post: TYPE explains itself and does not open the door.
await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.scene = "S11";
  n.room = "hall";
  n.q = [];
  n.cur = null;
  n.ctrl = true;
  n.live = [];
  ss.ch.doorOpen = false;
  ss.ch.sing = false;
  ss.swapTo(true);
  n.mo.x = 1200;
  n.mo.y = 290;
  ss.ch.lureBot.x = ss.ch.lureBot.home.x;
  ss.ch.lureBot.y = ss.ch.lureBot.home.y;
  ss.ch.lureBot.look = 0;
});
await sleep(120);
const home = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  const act = n.act && n.act.verb;
  ss.actionDown();
  return {
    act,
    door: ss.ch.doorOpen,
    cur: n.cur && (n.cur.id || (n.cur.b && n.cur.b.text) || ""),
    live: (n.live[0] && n.live[0].text) || "",
  };
});
check("S11 bot on the door blocks TYPE with a line", home.door === false && (home.live.includes("Lure") || home.cur.includes("Lure") || home.live.includes("plant")), home);

// M5: holding right from the reunion spawn reaches Mops. The middle can used to stop that lane.
await boot("sceneM5");
await page.evaluate(() => {
  const n = window.__ss.op;
  n.q = [];
  n.cur = null;
  n.ctrl = true;
  window.__ss.ch4.phase = "m5";
  window.__ss.ch4.met = false;
  window.__ss.ch4.wook = true;
  window.__ss.swapTo(false);
  window.__ss.ch.sing = false;
});
await keys(["ArrowRight"]);
let m5 = null;
for (let i = 0; i < 100; i++) {
  await sleep(50);
  m5 = await page.evaluate(() => ({
    x: Math.round(window.__ss.op.sq.x),
    y: Math.round(window.__ss.op.sq.y),
    met: window.__ss.ch4.met,
    cur: window.__ss.op.cur && window.__ss.op.cur.b && window.__ss.op.cur.b.text,
  }));
  if (m5.met || (m5.cur && m5.cur.startsWith("MOPS"))) break;
}
await keys([]);
check("M5 straight walk reaches the reunion", !!(m5 && (m5.met || (m5.cur && m5.cur.startsWith("MOPS")))), m5);

// Chapter 2: Rusty used to reach Squatch's x and orbit there with control locked,
// because the grab required being within 50px of y=470 while Squatch walks near y=540.
await page.evaluate(() => {
  const ss = window.__ss;
  ss.startOpening();
  const n = ss.op;
  n.q = [];
  n.cur = null;
  n.scene = "G1";
  n.room = "gas";
  n.ctrl = false;
  n.sqPose = "stand";
  n.sq.x = 500;
  n.sq.y = 540;
  ss.swapTo(false);
  const r = ss.ch2.rust;
  r.x = 420;
  r.f = 1;
  r.alert = 0;
  r.chase = true;
  r.nap = false;
  r.pause = 0;
  ss.ch2.phase = "g1";
});
let chase = null;
for (let i = 0; i < 40; i++) {
  await sleep(100);
  chase = await page.evaluate(() => {
    const n = window.__ss.op;
    const cur = n.cur;
    return {
      ctrl: n.ctrl,
      chase: window.__ss.ch2.rust.chase,
      cur: cur && (cur.k + ":" + ((cur.b && cur.b.text) || "")),
      sq: [Math.round(n.sq.x), Math.round(n.sq.y)],
      rx: Math.round(window.__ss.ch2.rust.x),
    };
  });
  if (chase.cur && chase.cur.startsWith("bub")) break;
}
check("Rusty grab finishes and starts the return line", !!(chase && chase.cur && chase.cur.includes("Gotcha")), chase);
await sleep(400);
for (let i = 0; i < 4; i++) {
  await page.evaluate(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space", key: " ", bubbles: true, cancelable: true }));
    window.dispatchEvent(new KeyboardEvent("keyup", { code: "Space", key: " ", bubbles: true }));
  });
  await sleep(400);
  chase = await page.evaluate(() => {
    const n = window.__ss.op;
    const cur = n.cur;
    return {
      ctrl: n.ctrl,
      sq: [Math.round(n.sq.x), Math.round(n.sq.y)],
      pose: n.sqPose,
      rx: Math.round(window.__ss.ch2.rust.x),
      cur: cur && (cur.k + ":" + ((cur.b && cur.b.text) || "")),
    };
  });
  if (chase.ctrl && !chase.cur) break;
}
check(
  "Rusty return gives control back at the gas-stop spot",
  !!(chase && chase.ctrl && chase.sq[0] === 760 && chase.sq[1] === 540 && !chase.cur && chase.rx <= 450 && chase.rx >= 330),
  chase,
);

const los = await page.evaluate(() => {
  const n = window.__ss.op;
  n.room = "gas";
  n.scene = "G1";
  n.q = [];
  n.cur = null;
  const see = (ax, ay, bx, by) => window.__ss.seeLine(ax, ay, bx, by);
  return {
    open: see(360, 400, 480, 520),
    underPump: see(400, 400, 540, 470),
    farSide: see(400, 400, 620, 520),
    throughBody: see(400, 400, 700, 500),
  };
});
check("pump blocks sight under it and through it", los.open === true && los.underPump === false && los.farSide === false && los.throughBody === false, los);

// Closet lane just below the G sign and along the bucket used to stop on a lip.
await page.evaluate(() => {
  const n = window.__ss.op;
  n.scene = "O5";
  n.room = "closet";
  n.ctrl = true;
  n.sqPose = "stand";
  n.cur = null;
  n.q = [];
  n.sq.x = 450;
  n.sq.y = 522;
});
await keys(["ArrowLeft"]);
await sleep(900);
await keys([]);
const gsign = await page.evaluate(() => [Math.round(window.__ss.op.sq.x), Math.round(window.__ss.op.sq.y)]);
check("G sign no longer snags the lane under it", gsign[0] < 320, gsign);

await page.evaluate(() => {
  const n = window.__ss.op;
  n.room = "closet";
  n.ctrl = true;
  n.sqPose = "stand";
  n.sq.x = 680;
  n.sq.y = 560;
});
await keys(["ArrowLeft"]);
await sleep(1000);
await keys([]);
const bucket = await page.evaluate(() => [Math.round(window.__ss.op.sq.x), Math.round(window.__ss.op.sq.y)]);
check("bucket no longer snags the bottom walk lane", bucket[0] < 500, bucket);

await browser.close();
server.close();
if (fails.length) {
  console.error("Failed:", fails.join(", "));
  process.exit(1);
}
console.log("all progression gates passed");
