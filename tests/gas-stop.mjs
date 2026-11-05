/**
 * Gas-stop stealth checks. Same install as tests/progression.mjs:
 *   npm install --no-save puppeteer-core
 *   CHROME=/usr/bin/google-chrome node tests/gas-stop.mjs
 *
 * Capture restart here is the current section (G1 back at the entrance),
 * not a whole-chapter replay and not a further jail minigame.
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
  console.error("puppeteer-core is not installed, so the gas-stop tests cannot start.");
  console.error("From the repo root: npm install --no-save puppeteer-core");
  console.error("Then: CHROME=/usr/bin/google-chrome node tests/gas-stop.mjs");
  process.exit(1);
}
const chrome = process.env.CHROME || "/usr/bin/google-chrome";
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
    return { ctrl: n.ctrl, sec: window.__ss.ch2.sec && Math.round(window.__ss.ch2.sec.x), live: (n.live[0] && n.live[0].text) || "", x: Math.round(n.sq.x) };
  });
  if (seen.sec) break;
}
await keys([]);
check("sighting sends security without freezing Squatch", !!(seen && seen.sec && seen.ctrl && String(seen.live).includes("SECURITY")), seen);

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
    noMopsCone: html.includes("!x.mops&&!d.nap"),
    botCone: html.includes("f2(A,A.look<=0,A.look<=0)"),
  };
});
check("fuel gauge, Mops-hidden cones, and pump-bot cones are in the gas stop", marks.tank && marks.noMopsCone && marks.botCone, marks);

await keys([]);
await browser.close();
server.close();
if (fails.length) {
  console.error("Failed:", fails.join(", "));
  process.exit(1);
}
console.log("gas-stop checks passed");
