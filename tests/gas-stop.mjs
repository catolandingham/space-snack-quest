/**
 * Gas-stop stealth checks. Same install as tests/progression.mjs:
 *   npm install --no-save puppeteer-core
 *   CHROME=/usr/bin/google-chrome node tests/gas-stop.mjs
 *
 * Capture restart here is the current section (G1 at the entrance, G6 at the pump),
 * not a whole-chapter replay and not a further jail minigame.
 * Pump bots call that same security loop.
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
  console.error("puppeteer-core is not installed, so the gas-stop tests cannot start.");
  console.error("From the repo root: npm install --no-save puppeteer-core");
  console.error("Then: CHROME=/usr/bin/google-chrome node tests/gas-stop.mjs");
  process.exit(1);
}
const chrome = chromePath();
if (!existsSync(chrome)) {
  console.error(`Chrome was not found at ${chrome}.`);
  console.error("Set CHROME to the Chrome or Chromium binary, then rerun tests/gas-stop.mjs.");
  process.exit(1);
}
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = await readFile(join(root, "index.html"));
const server = http.createServer((req, res) => {
  res.writeHead(req.url === "/" || req.url.startsWith("/index.html") ? 200 : 404, { "content-type": "text/html" });
  res.end(req.url === "/" || req.url.startsWith("/index.html") ? html : "");
});
await new Promise((r) => server.listen(8767, "127.0.0.1", r));
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
const held = new Set();
async function keys(codes) {
  for (const c of [...held]) if (!codes.includes(c)) { await page.keyboard.up(c); held.delete(c); }
  for (const c of codes) if (!held.has(c)) { await page.keyboard.down(c); held.add(c); }
}
await page.goto("http://127.0.0.1:8767/index.html", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.__ss);

await page.evaluate(() => {
  const ss = window.__ss;
  ss.startOpening();
  const n = ss.op;
  n.q = []; n.cur = null; n.scene = "G1"; n.room = "gas"; n.ctrl = true;
  n.sqPose = "stand"; n.sq.x = 200; n.sq.y = 520; ss.swapTo(false);
  Object.assign(ss.ch2.rust, { x: 380, f: 1, alert: 0, chase: false, nap: false, pause: 8 });
  ss.ch2.phase = "g1"; ss.ch2.sec = null; ss.ch2.fuel = false;
});
await keys(["ArrowRight"]);
let seen = null;
for (let i = 0; i < 40; i++) {
  await sleep(80);
  seen = await page.evaluate(() => {
    const n = window.__ss.op;
    return { ctrl: n.ctrl, sec: window.__ss.ch2.sec && Math.round(window.__ss.ch2.sec.x), live: n.live.map((row) => row.text).join("|"), x: Math.round(n.sq.x) };
  });
  if (seen.sec) break;
}
await keys([]);
check(
  "sighting sends security without freezing Squatch",
  !!(seen && seen.sec && seen.ctrl && String(seen.live).includes("SECURITY! A Squatch on the lot!") && String(seen.live).includes("Troopers. I can hide.")),
  seen,
);

await page.evaluate(() => {
  const n = window.__ss.op;
  n.sqPose = "hidden"; n.sq.moving = false;
});
let left = null;
for (let i = 0; i < 30; i++) {
  await sleep(100);
  left = await page.evaluate(() => ({ sec: window.__ss.ch2.sec, scene: window.__ss.op.scene, x: Math.round(window.__ss.op.sq.x) }));
  if (!left.sec) break;
}
check("hiding makes security leave and does not restart the section", !!(left && !left.sec && left.scene === "G1" && left.x !== 760), left);

const los = await page.evaluate(() => {
  const see = (a, b, c, d) => window.__ss.seeLine(a, b, c, d);
  window.__ss.op.room = "gas";
  return { open: see(360, 400, 470, 500), under: see(400, 400, 540, 470), far: see(400, 400, 620, 520) };
});
check("Rusty sees the open lane and not under the pump", los.open === true && los.under === false && los.far === false, los);

await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.scene = "G1"; n.room = "gas"; n.ctrl = true; n.cur = null; n.q = [];
  ss.swapTo(true); ss.ch2.phase = "g1door"; n.chip = "Walk to the diner door";
  n.mo.x = 850; n.mo.y = 545; n.mo.moving = false; ss.ch2.sec = null;
});
const before = await page.evaluate(() => ({ x: Math.round(window.__ss.op.mo.x), scene: window.__ss.op.scene, verb: window.__ss.game.verb }));
await sleep(300);
const still = await page.evaluate(() => ({ x: Math.round(window.__ss.op.mo.x), scene: window.__ss.op.scene }));
check("Mops is not jumped to the door", before.scene === "G1" && still.scene === "G1" && still.x === 850, { before, still });
await keys(["ArrowLeft"]);
await sleep(700);
await keys([]);
const walked = await page.evaluate(() => Math.round(window.__ss.op.mo.x));
check("Mops walks toward the diner door", walked < 780 && walked > 200, walked);
await page.evaluate(() => { window.__ss.op.mo.x = 300; window.__ss.op.mo.y = 470; });
await sleep(80);
const entered = await page.evaluate(() => {
  const n = window.__ss.op;
  const verb = n.act && n.act.verb;
  if (verb === "ENTER") window.__ss.actionDown();
  return { verb, scene: n.scene, room: n.room };
});
check("Mops presses ENTER at the door to go in", entered.verb === "ENTER" && entered.scene === "G2" && entered.room === "diner", entered);

const marks = await page.evaluate(() => {
  const html = document.documentElement.innerHTML;
  return {
    tank: html.includes("TANK EMPTY") && html.includes("TANK FULL"),
    noMopsCone: html.includes("!x.mops&&!d.nap") || html.includes("!__state.x.mops&&!d.nap"),
    botCone: html.includes("f2(A,A.look<=0,A.look<=0)"),
  };
});
check("fuel gauge, Mops-hidden cones, and pump-bot cones are in the gas stop", marks.tank && marks.noMopsCone && marks.botCone, marks);
await page.evaluate(() => {
  const n = window.__ss.op;
  n.scene = "G1"; n.room = "gas"; n.cur = null; n.q = [];
  window.__ss.ch2.fuel = false;
});
await sleep(200);
// Since Phase 3 the TANK label and the chapter tag are page text over the picture (src/game/80-hud.js).
const tank = await page.evaluate(() => {
  const box = (id) => { const el = document.getElementById(id); if (!el || getComputedStyle(el).display === "none") return null; const r = el.getBoundingClientRect(); return { x0: r.left, x1: r.right, y0: r.top, y1: r.bottom, text: el.textContent }; };
  return { banner: box("ss-tank"), pill: box("ss-chapter") };
});
const apart = (a, b) => a.x1 <= b.x0 || b.x1 <= a.x0 || a.y1 <= b.y0 || b.y1 <= a.y0;
check("TANK label is visible and not under the chapter pill", !!tank.banner && tank.banner.text === "TANK EMPTY" && !!tank.pill && apart(tank.banner, tank.pill), tank);

// Full capture, separate from the hide path: security has to walk up and touch him.
await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.q = []; n.cur = null; n.live = [];
  n.scene = "G1"; n.room = "gas"; n.ctrl = true; n.sqPose = "stand";
  n.sq.x = 500; n.sq.y = 540; n.sq.moving = false;
  ss.swapTo(false);
  Object.assign(ss.ch2.rust, { x: 420, f: 1, alert: 0, chase: false, nap: false, pause: 8 });
  ss.ch2.phase = "g1"; ss.ch2.sec = null;
});
let cap = null;
let approached = false;
for (let i = 0; i < 80; i++) {
  await sleep(100);
  cap = await page.evaluate(() => {
    const n = window.__ss.op;
    const s = window.__ss.ch2.sec;
    const cur = n.cur;
    return {
      ctrl: n.ctrl,
      pose: n.sqPose,
      sec: s && Math.round(s.x),
      dist: s ? Math.round(Math.hypot(s.x - n.sq.x, s.y - n.sq.y)) : null,
      cur: cur && (cur.k + ":" + (cur.text || (cur.b && cur.b.text) || "")),
      scene: n.scene,
    };
  });
  if (cap.sec && cap.dist < 400) approached = true;
  if (cap.cur && cap.cur.includes("LOCKUP")) break;
}
check("security walks up to a standing Squatch and opens LOCKUP", !!(approached && cap && cap.cur && cap.cur.includes("LOCKUP") && cap.scene === "G1"), cap);
const rustPen = await page.evaluate(() => {
  const n = window.__ss.op;
  const c = document.querySelector("canvas");
  const g = c.getContext("2d", { willReadFrequently: true });
  const at = (x, y) => { const d = g.getImageData(x, y, 1, 1).data; return [d[0], d[1], d[2]]; };
  return { by: n.cur && n.cur.by, q: n.q.map((row) => (row.b && row.b.text) || "").join("|"), cap: at(340, 375), side: at(420, 400) };
});
check(
  "Rusty's lockup shows his red cap and the coin line",
  rustPen.by === "rust" && rustPen.q.includes("I'll take the pen over the pump.") && rustPen.cap[0] > 180 && rustPen.cap[1] < 120 && rustPen.side[2] < 180,
  rustPen,
);
await sleep(450);
for (let i = 0; i < 4; i++) {
  await page.evaluate(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space", bubbles: true, cancelable: true }));
    window.dispatchEvent(new KeyboardEvent("keyup", { code: "Space", bubbles: true }));
  });
  await sleep(400);
  cap = await page.evaluate(() => {
    const n = window.__ss.op;
    const cur = n.cur;
    return {
      ctrl: n.ctrl, scene: n.scene, phase: window.__ss.ch2.phase,
      pose: n.sqPose, sq: [Math.round(n.sq.x), Math.round(n.sq.y)],
      sec: window.__ss.ch2.sec, chase: window.__ss.ch2.rust.chase,
      cur: cur && cur.k,
    };
  });
  if (cap.ctrl && cap.sq[0] === 760) break;
}
check(
  "LOCKUP restarts this gas section with control restored",
  !!(cap && cap.ctrl && cap.scene === "G1" && cap.phase === "g1" && cap.pose === "stand" && cap.sq[0] === 760 && cap.sq[1] === 540 && !cap.sec && !cap.chase && !cap.cur),
  cap,
);

// Pump bots call the same security loop. Rusty is napping so he is not the spotter.
await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.q = []; n.cur = null; n.live = [];
  n.scene = "G6"; n.room = "gas"; n.ctrl = true; n.sqPose = "stand";
  n.sq.x = 360; n.sq.y = 510; ss.swapTo(false); ss.ch.sing = false;
  ss.ch2.phase = "g6"; ss.ch2.sec = null; ss.ch2.fuel = true;
  ss.ch2.rust.nap = true;
  ss.ch2.bots = [{ x: 480, y: 500, hx: 480, f: -1, look: 0 }];
});
let bot = null;
for (let i = 0; i < 30; i++) {
  await sleep(100);
  bot = await page.evaluate(() => {
    const n = window.__ss.op;
    const live = n.live.map((row) => row.text).join("|");
    return {
      sec: window.__ss.ch2.sec && Math.round(window.__ss.ch2.sec.x),
      ctrl: n.ctrl,
      live,
      x: Math.round(n.sq.x),
      scene: n.scene,
    };
  });
  if (bot.sec !== null && bot.live.includes("Report him")) break;
}
check(
  "a pump bot calls security and keeps control",
  !!(bot && bot.sec !== null && bot.ctrl && bot.live.includes("SQUATCH ON THE LOT! Report him or fuel him!") && bot.scene === "G6"),
  bot,
);
await page.evaluate(() => { window.__ss.op.sqPose = "hidden"; });
let hidden = null;
for (let i = 0; i < 30; i++) {
  await sleep(100);
  hidden = await page.evaluate(() => ({
    sec: window.__ss.ch2.sec,
    scene: window.__ss.op.scene,
    x: Math.round(window.__ss.op.sq.x),
    phase: window.__ss.ch2.phase,
  }));
  if (!hidden.sec) break;
}
check(
  "hiding dismisses the pump-bot security without restarting",
  !!(hidden && !hidden.sec && hidden.scene === "G6" && hidden.phase === "g6" && hidden.x === 360),
  hidden,
);

await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.q = []; n.cur = null; n.live = [];
  n.scene = "G6"; n.room = "gas"; n.ctrl = true; n.sqPose = "stand";
  n.sq.x = 360; n.sq.y = 510; n.sq.moving = false;
  ss.swapTo(false); ss.ch.sing = false;
  ss.ch2.phase = "g6"; ss.ch2.sec = null; ss.ch2.fuel = true;
  ss.ch2.rust.nap = true;
  ss.ch2.bots = [{ x: 480, y: 500, hx: 480, f: -1, look: 0 }];
});
let botCap = null;
for (let i = 0; i < 80; i++) {
  await sleep(100);
  botCap = await page.evaluate(() => {
    const n = window.__ss.op;
    const cur = n.cur;
    return {
      cur: cur && (cur.k + ":" + (cur.text || (cur.b && cur.b.text) || "")),
      scene: n.scene,
      ctrl: n.ctrl,
    };
  });
  if (botCap.cur && botCap.cur.includes("LOCKUP")) break;
}
check("pump-bot security catches a standing Squatch", !!(botCap && botCap.cur && botCap.cur.includes("LOCKUP") && botCap.scene === "G6" && botCap.ctrl === false), botCap);
const pumpPen = await page.evaluate(() => {
  const n = window.__ss.op;
  const c = document.querySelector("canvas");
  const g = c.getContext("2d", { willReadFrequently: true });
  const at = (x, y) => { const d = g.getImageData(x, y, 1, 1).data; return [d[0], d[1], d[2]]; };
  return { by: n.cur && n.cur.by, q: n.q.map((row) => (row.b && row.b.text) || "").join("|"), nozzle: at(420, 470), body: at(355, 515) };
});
check(
  "the pump lockup shows the nozzle and the pancake line",
  pumpPen.by === "pump" && pumpPen.q.includes("Pancakes. Park the nozzle.") && pumpPen.nozzle[0] > 200 && pumpPen.nozzle[1] > 160 && pumpPen.nozzle[2] < 120 && pumpPen.body[0] > 180 && pumpPen.body[1] < 120,
  pumpPen,
);
await sleep(450);
for (let i = 0; i < 4; i++) {
  await page.evaluate(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space", bubbles: true, cancelable: true }));
    window.dispatchEvent(new KeyboardEvent("keyup", { code: "Space", bubbles: true }));
  });
  await sleep(400);
  botCap = await page.evaluate(() => {
    const n = window.__ss.op;
    return {
      ctrl: n.ctrl, scene: n.scene, phase: window.__ss.ch2.phase,
      pose: n.sqPose, sq: [Math.round(n.sq.x), Math.round(n.sq.y)],
      sec: window.__ss.ch2.sec, cur: n.cur && n.cur.k,
    };
  });
  if (botCap.ctrl && botCap.sq[0] === 85) break;
}
check(
  "pump-bot capture restarts the pump section",
  !!(botCap && botCap.ctrl && botCap.scene === "G6" && botCap.phase === "g6" && botCap.pose === "stand" && botCap.sq[0] === 85 && botCap.sq[1] === 470 && !botCap.sec && !botCap.cur),
  botCap,
);

await keys([]);
await browser.close();
server.close();
if (fails.length) {
  console.error("Failed:", fails.join(", "));
  process.exit(1);
}
console.log("gas-stop checks passed");
