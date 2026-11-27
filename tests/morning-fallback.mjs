/**
 * If the module script (src/modules/, bundled into the first <script> of index.html) fails to load, the game
 * must still play (CLAUDE.md: the older program guards every use of window.SSQ). The morning is a module now,
 * so without it Chapter 1 skips from the opening cards to "That evening…". The party night is a module too
 * (src/modules/party.js), so without it the evening goes on to Day 2. Day 2's home morning is a module too
 * (src/modules/home-morning.js), and so is the lunch sneak (src/modules/lunch-sneak.js), so without them Day 2 goes on
 * from TAKE · lunch straight to beat 28 (the ship is coming), which still plays.
 *   node tests/morning-fallback.mjs
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { startGame, root, sleep } from "./game-page.mjs";

const g = await startGame({ port: 8973, name: "morning-fallback" });
const html = readFileSync(join(root, "index.html"), "utf8");
const first = html.indexOf("<script>"),
  end = html.indexOf("</script>", first);
const noModules = html.slice(0, first) + "<script>" + html.slice(end);
g.check("the test can cut the module script out of the page", first > 0 && end > first && !noModules.includes("registerBeat"));

const browser = g.browser;
const ctx = await browser.createBrowserContext();
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e && e.message ? e.message : e)));
await page.setRequestInterception(true);
page.on("request", (req) => {
  if (new URL(req.url()).pathname === "/index.html") req.respond({ status: 200, contentType: "text/html", body: noModules });
  else req.continue();
});
await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
await page.goto(`http://127.0.0.1:${8973 + Number(process.env.SSQ_PORT_OFFSET || 0)}/index.html?ch=1`, { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.__ss && window.__ss.op, { timeout: 15000 });
await sleep(300);
g.check("no bridge on the page", await page.evaluate(() => !window.SSQ));
const st = () =>
  page.evaluate(() => {
    const n = window.__ss.op,
      c = n.cur;
    return { k: c ? c.k : "", text: c ? (c.b ? c.b.text : c.text || "") : "", ctrl: n.ctrl, chip: window.__ss.chipNow() };
  });
const seen = [];
let s = await st();
for (let i = 0; i < 20 && !(s.ctrl && s.chip); i++) {
  if (s.k) seen.push(s.k + ":" + s.text);
  await page.touchscreen.tap(187, 300);
  await sleep(400);
  s = await st();
}
g.check("without the module the cards still play, then \"That evening…\"", seen.length >= 3 && /^card:Stormtop/.test(seen[0]) && seen.some((t) => /^card:That evening/.test(t)), seen);
// (with no module, beat 28's lines come up at once: tap through them to its goal)
for (let i = 0; i < 12 && !(s.ctrl && s.chip); i++) {
  await page.touchscreen.tap(187, 300);
  await sleep(400);
  s = await st();
}
g.check("then the game goes on: without the party, home morning and lunch modules, Day 2 goes on to beat 28 and its goal", s.ctrl && /hide in the plant/.test(s.chip), s);
g.check("no page errors without the module", errors.length === 0, errors);
await ctx.close();
await g.finish("morning-fallback");
