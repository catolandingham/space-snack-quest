/**
 * Proves a change shows nothing new to a player: draws the same game moments from another version's
 * index.html and from the current one, and compares the game pictures pixel for pixel.
 *   node tools/compare-builds.mjs <git ref>        for example: node tools/compare-builds.mjs main
 * Run npm run build first. Time, random numbers and animation frames are frozen in both pages, and
 * each moment is reached with the game's own hooks (window.__ss), so the same steps draw the same
 * frame. Whole-page screenshots are saved to tests/out/compare/ for a person to look at; they can
 * differ by invisible text-smoothing noise, so only the game picture decides pass or fail.
 * Exits 1 if any game picture differs or either page has an error.
 */
import http from "node:http";
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { root } from "./build.mjs";
import { chromePath } from "../tests/chrome-path.mjs";

const ref = process.argv[2];
if (!ref) {
  console.error("Usage: node tools/compare-builds.mjs <git ref>");
  process.exit(2);
}
const puppeteer = (await import("puppeteer-core")).default;
const outDir = join(root, "tests", "out", "compare");
mkdirSync(outDir, { recursive: true });
const html = {
  "/old.html": execFileSync("git", ["-C", root, "show", `${ref}:index.html`], { maxBuffer: 64 * 1024 * 1024 }),
  "/new.html": readFileSync(join(root, "index.html")),
};
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (html[p]) {
    res.writeHead(200, { "content-type": "text/html" });
    return res.end(html[p]);
  }
  const f = join(root, p);
  if ((p.startsWith("/docs/locked-rooms/") || p.startsWith("/music/")) && f.startsWith(root) && existsSync(f)) {
    res.writeHead(200, { "content-type": p.endsWith(".png") ? "image/png" : "audio/mpeg" });
    return res.end(readFileSync(f));
  }
  res.writeHead(404);
  res.end();
});
await new Promise((r) => server.listen(8979, "127.0.0.1", r));
const browser = await puppeteer.launch({ executablePath: chromePath(), headless: "new", args: ["--no-sandbox", "--disable-gpu"] });

// Each moment: a query, then taps through what is on screen, then one drawn frame.
const MOMENTS = [
  { id: "ch1-start", q: "?ch=1", taps: 0 },
  { id: "ch1-morning", q: "?ch=1", taps: 4 },
  { id: "ch2-gas", q: "?ch=2", taps: 0 },
  { id: "q4-hangar", q: "?scene=Q4", taps: 0 },
  { id: "qa-party", q: "?scene=QA", taps: 0 },
];
const VIEWS = [
  { id: "phone", width: 375, height: 812 },
  { id: "desk", width: 1100, height: 800 },
];

async function shoot(file, m, v) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e.message || e)));
  await page.evaluateOnNewDocument(() => {
    const t = 0;
    performance.now = () => t;
    Date.now = () => 1795400000000 + t;
    window.requestAnimationFrame = () => 0;
    let s = 7;
    Math.random = () => (s = (s * 16807) % 2147483647) / 2147483647;
  });
  await page.setViewport({ width: v.width, height: v.height, deviceScaleFactor: 1 });
  await page.goto(`http://127.0.0.1:8979${file}${m.q}`, { waitUntil: "load" });
  await page.waitForFunction(() => window.__ss && window.__ss.op, { timeout: 15000 });
  await page.evaluate(() => window.__ss.lockedReady);
  const picture = await page.evaluate((taps) => {
    const ss = window.__ss;
    const n = ss.op;
    for (let i = 0; i < 20; i++) ss.tick(0.05);
    for (let k = 0; k < taps; k++) {
      n.bt = 1;
      ss.opTap();
      for (let i = 0; i < 10; i++) ss.tick(0.05);
    }
    ss.drawFrame();
    return document.querySelector("canvas").toDataURL("image/png");
  }, m.taps);
  writeFileSync(join(outDir, `${m.id}-${v.id}-${file.slice(1, 4)}.png`), await page.screenshot());
  await ctx.close();
  return { picture, errors };
}

let failed = 0;
for (const m of MOMENTS) {
  for (const v of VIEWS) {
    const a = await shoot("/old.html", m, v);
    const b = await shoot("/new.html", m, v);
    const ok = a.picture === b.picture && !a.errors.length && !b.errors.length;
    if (!ok) failed++;
    console.log(`${ok ? "PASS" : "FAIL"} ${m.id} ${v.id}: game picture ${a.picture === b.picture ? "same" : "DIFFERENT"}, page errors ${ref} ${a.errors.length}, now ${b.errors.length}`);
  }
}
await browser.close();
server.close();
console.log(failed ? `${failed} moments differ from ${ref}.` : `All ${MOMENTS.length * VIEWS.length} moments match ${ref}. Screenshots: tests/out/compare/`);
process.exit(failed ? 1 : 0);
