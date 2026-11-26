/**
 * P0 reliability. Checkpoints, one-shot hold, dialogue cancel, pump cover.
 *   CHROME=/usr/bin/google-chrome node tests/reliability.mjs
 */
import http from "node:http";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromePath } from "./chrome-path.mjs";

let puppeteer;
try {
  puppeteer = (await import("puppeteer-core")).default;
} catch {
  console.error("puppeteer-core is not installed, so the reliability tests cannot start.");
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
await new Promise((r) => server.listen(8769 + Number(process.env.SSQ_PORT_OFFSET || 0), "127.0.0.1", r));
let browser;
try {
  browser = await puppeteer.launch({ executablePath: chrome, headless: "new", args: ["--no-sandbox", "--disable-gpu"] });
} catch (err) {
  server.close();
  console.error(`Chrome at ${chrome} did not start: ${err instanceof Error ? err.message : err}`);
  process.exit(1);
}
const page = await browser.newPage();
await page.setViewport({ width: 1100, height: 800, deviceScaleFactor: 1 });
await page.goto(`http://127.0.0.1:${8769 + Number(process.env.SSQ_PORT_OFFSET || 0)}/index.html`, { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.__ss);
const fails = [];
const check = (name, ok, detail) => {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? " " + JSON.stringify(detail) : ""}`);
  if (!ok) fails.push(name);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

await page.evaluate(() => {
  const ss = window.__ss;
  ss.startOpening();
  const n = ss.op;
  n.q = []; n.cur = null; n.scene = "G1"; n.room = "gas"; n.ctrl = true;
  n.sqPose = "stand"; n.sq.x = 760; n.sq.y = 540; n.sq.moving = false;
  ss.swapTo(false);
  ss.ch2.phase = "g1"; ss.ch2.jar = 12; ss.ch2.reg = 4; ss.ch2.has = "coins";
  n.stars = 40;
  n.found.add("keep-me");
  ss.ch2.sec = null;
});
await sleep(300);

const noted = await page.evaluate(() => {
  const n = window.__ss.op;
  n.sq.x = 400; n.sq.y = 520;
  n.cur = { k: "bub", b: { who: "sq", text: "Stuck line", style: "say" } };
  n.q = [{ k: "bub", b: { text: "And another" } }];
  window.__ss.ch2.cookT = 9; window.__ss.ch2.peekT = 1; window.__ss.ch2.timer = 3;
  const before = { stars: n.stars, jar: window.__ss.ch2.jar, has: window.__ss.ch2.has, found: n.found.has("keep-me") };
  window.__ss.sectionReset();
  return {
    before,
    scene: n.scene, phase: window.__ss.ch2.phase, x: Math.round(n.sq.x), y: Math.round(n.sq.y),
    ctrl: n.ctrl, cur: n.cur, q: n.q.length, jar: window.__ss.ch2.jar, reg: window.__ss.ch2.reg,
    has: window.__ss.ch2.has, stars: n.stars, found: n.found.has("keep-me"),
    cookT: window.__ss.ch2.cookT, timer: window.__ss.ch2.timer,
  };
});
check(
  "dialogue cancel restarts the gas entrance without paying or wiping the jar",
  noted.scene === "G1" && noted.phase === "g1" && noted.x === 760 && noted.y === 540 && noted.ctrl === true && !noted.cur && noted.q === 0 && noted.jar === 12 && noted.reg === 4 && noted.has === "coins" && noted.stars === 40 && noted.found === true && noted.cookT === 0 && noted.timer === 0,
  noted,
);

await page.evaluate(() => {
  window.__ss.op.sq.x = 200;
  window.__ss.ch2.phase = "g1";
  window.__ss.op.scene = "G1";
  window.__ss.resetHold(true);
});
await sleep(900);
await page.evaluate(() => window.__ss.resetHold(false));
await page.evaluate(() => { window.__ss.op.sq.x = 200; });
await sleep(600);
const once = await page.evaluate(() => Math.round(window.__ss.op.sq.x));
check("a finished hold does not keep restarting", once === 200, { once });

await page.evaluate(() => {
  const n = window.__ss.op;
  n.q = []; n.cur = null; n.scene = "G5k"; n.room = "kitchen"; n.ctrl = true;
  n.sqPose = "stand"; n.sq.x = 230; n.sq.y = 520;
  window.__ss.ch2.phase = "wash5"; window.__ss.ch2.peekT = 4.5; window.__ss.ch2.jar = 12;
  window.__ss.ch2.noted = "";
});
await sleep(250);
await page.evaluate(() => {
  window.__ss.op.sq.x = 700;
  window.__ss.ch2.phase = "nope";
  window.__ss.sectionReset();
});
const unknown = await page.evaluate(() => ({
  scene: window.__ss.op.scene, phase: window.__ss.ch2.phase, room: window.__ss.op.room,
  x: Math.round(window.__ss.op.sq.x), jar: window.__ss.ch2.jar,
}));
check(
  "an unknown phase returns to the latest kitchen section, not the gas entrance",
  unknown.scene === "G5k" && unknown.phase === "wash5" && unknown.room === "kitchen" && unknown.x === 230 && unknown.jar === 12,
  unknown,
);

await page.evaluate(() => {
  const n = window.__ss.op;
  n.q = []; n.cur = null; n.scene = "S5"; n.room = "window"; n.ctrl = true;
  n.sqPose = "stand"; n.sq.x = 140; n.sq.y = 540;
  window.__ss.ch2.phase = ""; window.__ss.ch2.noted = "";
});
await sleep(250);
await page.evaluate(() => { window.__ss.op.sq.x = 500; window.__ss.sectionReset(); });
const ch1 = await page.evaluate(() => ({
  scene: window.__ss.op.scene, room: window.__ss.op.room, x: Math.round(window.__ss.op.sq.x), y: Math.round(window.__ss.op.sq.y),
}));
check("Chapter 1 reset stays on that scene", ch1.scene === "S5" && ch1.room === "window" && ch1.x === 140 && ch1.y === 540, ch1);

await page.evaluate(() => {
  const n = window.__ss.op;
  n.q = []; n.cur = null; n.scene = "G1"; n.room = "gas"; n.ctrl = true;
  window.__ss.swapTo(true);
  n.mo.x = 300; n.mo.y = 470; n.moPose = "stand";
  window.__ss.ch2.phase = "g1door";
});
await sleep(200);
const door = await page.evaluate(() => {
  const act = window.__ss.op.act;
  const c = document.querySelector("canvas");
  const g = c.getContext("2d", { willReadFrequently: true });
  const at = (x, y) => { const d = g.getImageData(x, y, 1, 1).data; return [d[0], d[1], d[2]]; };
  let cream = 0;
  if (act) {
    const y = Math.max(28, act.y - 36);
    for (let x = act.x - 70; x < act.x + 70; x += 4) {
      const p = at(x, y - 8);
      if (p[0] > 245 && p[1] > 240 && p[2] > 220) cream++;
    }
  }
  return { verb: act && act.verb, cap: act && act.cap, x: act && act.x, y: act && act.y, cream };
});
check(
  "the diner door says where ENTER goes",
  door.verb === "ENTER" && door.cap === "diner door" && door.cream > 2,
  door,
);

const los = await page.evaluate(() => {
  const see = (ax, ay, bx, by) => window.__ss.seeLine(ax, ay, bx, by);
  window.__ss.op.room = "gas";
  return {
    open: see(360, 400, 480, 520),
    underPump: see(400, 400, 540, 470),
    farSide: see(400, 400, 620, 520),
    throughBody: see(400, 400, 700, 500),
  };
});
check("pump cover still blocks sight under it and through it", los.open === true && los.underPump === false && los.farSide === false && los.throughBody === false, los);

// Since Phase 3 the restart is the small round ↺ over the picture (#ss-reset, src/game/80-hud.js).
const deskBtn = await page.$("#ss-reset");
check("desktop shows the ↺ restart button", !!deskBtn, {});
await page.setViewport({ width: 396, height: 844, deviceScaleFactor: 1 });
await sleep(200);
const phoneBtn = await page.$("#ss-reset");
const phoneBox = phoneBtn ? await phoneBtn.boundingBox() : null;
check("phone shows the ↺ restart button, a 44 by 44 touch target", !!(phoneBox && phoneBox.width >= 44 && phoneBox.height >= 44), phoneBox);

await page.evaluate(() => {
  const n = window.__ss.op;
  n.q = []; n.cur = null; n.scene = "G1"; n.room = "gas"; n.ctrl = true; n.sqPose = "stand";
  n.sq.x = 760; n.sq.y = 540; window.__ss.swapTo(false);
  window.__ss.ch2.phase = "g1"; window.__ss.ch2.sec = null; window.__ss.ch2.jar = 12;
});
await sleep(200);
const png = await page.evaluate(() => document.querySelector("canvas").toDataURL("image/png"));
const outDir = join(root, "tests", "out");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "reliability_gas_restart.png"), Buffer.from(png.slice(png.indexOf(",") + 1), "base64"));
await page.screenshot({ path: join(outDir, "reliability_phone_reset.png") });

await browser.close();
server.close();
if (fails.length) {
  console.error("Failed:", fails.join(", "));
  process.exit(1);
}
console.log("reliability checks passed");
