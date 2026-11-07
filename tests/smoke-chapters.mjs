/**
 * Smoke test: every chapter starts from the title and its opening lines advance without a page error.
 * For chapters 1 to 4: press the chapter number on the title, press Enter 12 times, then check that
 * no page error happened and that the story scene is a chapter scene (O, G, P or M).
 *   npm run test:one tests/smoke-chapters.mjs
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
  console.error("puppeteer-core is not installed, so the smoke tests cannot start. From the repo root: npm install");
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
await new Promise((r) => server.listen(8770, "127.0.0.1", r));
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

for (const chapter of [1, 2, 3, 4]) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e && e.message ? e.message : e)));
  // All four chapters open on the title, as if they were already unlocked.
  await page.evaluateOnNewDocument(() => {
    try {
      localStorage.setItem("ssq-unlocked", "4");
    } catch {}
  });
  await page.setViewport({ width: 1100, height: 800, deviceScaleFactor: 1 });
  await page.goto("http://127.0.0.1:8770/index.html", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.__ss && window.__ss.op, { timeout: 15000 });
  await sleep(300);
  await page.keyboard.press(`Digit${chapter}`);
  for (let i = 0; i < 12; i++) {
    await sleep(300);
    await page.keyboard.press("Enter");
  }
  await sleep(300);
  const scene = await page.evaluate(() => window.__ss.op.scene);
  check(`chapter ${chapter} starts and advances with no page error`, errors.length === 0, errors.length ? errors : undefined);
  check(`chapter ${chapter} is in a story scene`, typeof scene === "string" && /^[OGPM]/.test(scene), { scene });
  await ctx.close();
}

await browser.close();
server.close();
if (fails.length) {
  console.error("Failed:", fails.join(", "));
  process.exit(1);
}
console.log("smoke chapter checks passed");
