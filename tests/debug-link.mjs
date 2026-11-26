/**
 * Debug link (task T4).
 * index.html?ch=2&phase=wash1&debug=1 opens the kitchen sink checkpoint with the state strip under the game.
 * index.html with no parameters stays on the title with no strip.
 *   npm run test:one tests/debug-link.mjs
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
  console.error("puppeteer-core is not installed, so the debug-link tests cannot start. From the repo root: npm install");
  process.exit(1);
}
const chrome = chromePath();
if (!existsSync(chrome)) {
  console.error(`Chrome was not found at ${chrome}. Set CHROME to the Chrome or Chromium binary.`);
  process.exit(1);
}
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = await readFile(join(root, "index.html"));
const server = http.createServer((req, res) => {
  res.writeHead(200, { "content-type": "text/html" });
  res.end(html);
});
await new Promise((r) => server.listen(8772, "127.0.0.1", r));
let browser;
try {
  browser = await puppeteer.launch({ executablePath: chrome, headless: "new", args: ["--no-sandbox", "--disable-gpu"] });
} catch (err) {
  server.close();
  console.error(`Chrome at ${chrome} did not start: ${err instanceof Error ? err.message : err}`);
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fails = [];
const check = (name, ok, detail) => {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail === undefined ? "" : " " + JSON.stringify(detail)}`);
  if (!ok) fails.push(name);
};

async function open(query, consoleErrors = false) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e && e.message ? e.message : e)));
  consoleErrors &&
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
  await page.setViewport({ width: 1100, height: 800, deviceScaleFactor: 1 });
  await page.goto(`http://127.0.0.1:8772/index.html${query}`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.__ss && window.__ss.op, { timeout: 15000 });
  await sleep(700);
  return { ctx, page, errors };
}

// The link opens the sink checkpoint, with Squatch in control, and the strip says so.
{
  const { ctx, page, errors } = await open("?ch=2&phase=wash1&debug=1");
  const s = await page.evaluate(() => {
    const strip = document.getElementById("ss-debug-line");
    return {
      state: window.__ss.game.state,
      scene: window.__ss.op.scene,
      phase: window.__ss.ch2.phase,
      mops: window.__ss.ch.mops,
      strip: strip ? strip.textContent : null,
      stripInCanvas: !!(strip && strip.closest("canvas")),
    };
  });
  check("link starts the story", s.state === "op", s.state);
  check("link lands on scene G2k", s.scene === "G2k", s.scene);
  check("link lands on phase wash1", s.phase === "wash1", s.phase);
  check("Squatch is the one in control", s.mops === false, s.mops);
  check("state strip shows wash1", !!s.strip && s.strip.includes("phase wash1"), s.strip);
  check("state strip shows who is controlled", !!s.strip && s.strip.includes("control Squatch"), s.strip);
  check("state strip shows the chip and the prompt", !!s.strip && s.strip.includes("chip ") && s.strip.includes("prompt "));
  await page.keyboard.press("Backquote");
  await sleep(100);
  const hidden = await page.evaluate(() => getComputedStyle(document.getElementById("ss-debug")).display);
  check("backtick hides the strip", hidden === "none", hidden);
  check("no page errors on the debug link", errors.length === 0, errors.length ? errors : undefined);
  await ctx.close();
}

// No parameters: the title stays put and there is no strip.
{
  const { ctx, page, errors } = await open("", true);
  const s = await page.evaluate(() => ({ state: window.__ss.game.state, strip: !!document.getElementById("ss-debug") }));
  check("no parameters: the game stays on the title", s.state === "title", s.state);
  check("no parameters: no state strip", s.strip === false, s.strip);
  check("the title draws without Va is not defined", !errors.some((e) => /Va is not defined/.test(e)), errors.slice(0, 3));
  check("no page errors without parameters", errors.length === 0, errors.length ? errors.slice(0, 3) : undefined);
  await ctx.close();
}

// Localhost: ?beat=day2 opens Day 2 at the gift (src/modules/home-morning.js, awake beside the rocket). A numbered beat still does nothing here.
{
  const { ctx, page, errors } = await open("?beat=day2");
  const s = await page.evaluate(() => {
    const n = window.__ss.op;
    for (let i = 0; i < 20; i++) window.__ss.tick(0.2);
    return { day2: !!n.ch1Day2, room: n.room, scene: n.scene, step: n.ch1Step, chip: n.ch1Chip, ctrl: n.ctrl };
  });
  check("day2 jump opens Day 2", s.day2 === true, s);
  check("day2 jump is in the closet", s.room === "closet" && s.scene === "QB", s);
  check("day2 jump is at the gift (the home morning: the rocket, then the box, the calendar and the lunch)", s.step === "hm-rocket" && s.chip === "Squatch: pick up the gift" && s.ctrl === true, s);
  check("day2 jump adds no page errors", errors.length === 0, errors.slice(0, 3));
  await ctx.close();
}
{
  const { ctx, page } = await open("?beat=42");
  const s = await page.evaluate(() => window.__ss.game.state);
  check("a numbered beat does nothing on localhost", s === "title", s);
  await ctx.close();
}

await browser.close();
server.close();
if (fails.length) {
  console.error("Failed:", fails.join(", "));
  process.exit(1);
}
console.log("debug-link checks passed");
