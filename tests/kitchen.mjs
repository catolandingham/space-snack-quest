/**
 * Kitchen and departure checks.
 *   npm install --no-save puppeteer-core
 *   CHROME=/usr/bin/google-chrome node tests/kitchen.mjs
 *
 * Story beats the transcript did not pin to coordinates are checked by the
 * lines and state they produce. Interaction polish stays with the QA pass.
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

await page.evaluate(() => {
  const ss = window.__ss;
  ss.startOpening();
  const n = ss.op;
  n.q = []; n.cur = null; n.scene = "G2k"; n.room = "kitchen"; n.ctrl = true;
  n.sqPose = "stand"; n.sq.x = 560; n.sq.y = 420; ss.swapTo(false);
  ss.ch2.phase = "wash1"; ss.ch2.peek = 2; ss.ch2.peekT = 0; ss.ch2.warn = 0; ss.ch2.cook = "";
});
let faint = null;
for (let i = 0; i < 25; i++) {
  await sleep(80);
  faint = await page.evaluate(() => {
    const n = window.__ss.op;
    const cur = n.cur;
    const q = n.q.map((s) => (s.b && s.b.text) || s.text || "").join("|");
    return { cur: cur && ((cur.b && cur.b.text) || cur.text || ""), q };
  });
  if ((faint.cur && faint.cur.includes("faints")) || faint.q.includes("faints")) break;
}
check("cook sees Squatch and faints", !!(faint && ((faint.cur || "") + faint.q).includes("faints")), faint);

const src = await page.evaluate(() => document.documentElement.innerHTML);
check("soup stays on the head and says so", src.includes("The bowl is on my head.") && src.includes("ON MY HEAD"));
check("hoof stamp is spoken", src.includes("A hoof stamp. Mops signed it."));
check("hunger and prices are spoken", src.includes("I'm hungry. Gas is 30 coins. Soup is 5.") && src.includes("SOUP 5"));
check("oven takes a ticket", src.includes('verb:"OVEN"') && src.includes("in the oven"));
check("Mops out-front tip-jar scene is gone", !src.includes("Tip jar's empty"));
check("dishwashing shows a sponge in the paw", src.includes('r("#f2c14e",2),m(n.sq.x+6,n.sq.y-34,12,8,4),r("#e7b08a",2)'));
check("boarding agrees on Phobos, then Mars", src.includes('v("sq","Next stop: Phobos!")') && src.includes("The board says Phobos. Then Mars."));
check("chapter 1 exit caption names the gas stop", src.includes("Next stop: the gas stop. Chapter 2 is coming soon."));
check("stomach rumble wakes the cook", src.includes("*stomach rumble*") && src.includes("The janitor is cooking and washing?"));

await browser.close();
server.close();
if (fails.length) {
  console.error("Failed:", fails.join(", "));
  process.exit(1);
}
console.log("kitchen checks passed");
