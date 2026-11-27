/**
 * The Credits screen (Brian 2026-11-26, #31: "a small Credits screen from the title screen"), at phone size:
 *   - the title screen shows a "Credits" button; a tap on it opens the screen over the whole page;
 *   - it shows every line of src/modules/credits-lines.js (each CC BY track by name, as its licence asks);
 *   - a tap anywhere closes it and the title is back;
 *   - every music file the game plays is credited in music/CREDITS.txt, and every Kevin MacLeod track there is on the
 *     screen.
 *   node tests/credits.mjs
 */
import { join } from "node:path";
import { readFileSync, readdirSync } from "node:fs";
import { startGame, sleep, root } from "./game-page.mjs";

const { CREDITS_LINES, MACLEOD_TRACKS } = await import(join(root, "src", "modules", "credits-lines.js"));
const { CREDITS_BUTTON } = await import(join(root, "src", "modules", "credits.js"));
const credits = readFileSync(join(root, "music", "CREDITS.txt"), "utf8");
const g = await startGame({ port: 9476, name: "credits" });
const { page, errors } = await g.open("", { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
await sleep(1500);
const at = await page.evaluate((b) => {
  const c = document.querySelector("canvas"),
    r = c.getBoundingClientRect();
  return { x: r.x + ((b.x + b.w / 2) * r.width) / 960, y: r.y + ((b.y + b.h / 2) * r.height) / 640, state: window.__ss && window.__ss.state ? window.__ss.state() : "" };
}, CREDITS_BUTTON);
await page.touchscreen.tap(at.x, at.y);
await sleep(600);
const open = await page.evaluate(() => ({ open: !!document.querySelector('canvas[aria-label="credits"]'), shown: window.SSQ.credits.shown() }));
g.check("a tap on the title screen's Credits button opens the Credits screen", open.open && !!open.shown, open.open);
const drawn = ((open.shown && open.shown.lines) || []).join(" ");
g.check("it all fits on a phone screen (375 x 812)", !!open.shown && open.shown.bottom <= open.shown.h - 8, open.shown && [open.shown.bottom, open.shown.h]);
const missing = CREDITS_LINES.filter((l) => l.who !== "button" && !drawn.includes(l.text));
g.check("it shows every line of credits-lines.js, word for word", missing.length === 0, missing.map((l) => l.id));
await page.touchscreen.tap(180, 400);
await sleep(400);
const closed = await page.evaluate(() => !document.querySelector('canvas[aria-label="credits"]'));
g.check("a tap anywhere closes it", closed);
// with a mouse: the click that opens it must not close it (its release lands on the screen just opened)
await page.mouse.click(at.x, at.y);
await sleep(500);
const byMouse = await page.evaluate(() => !!document.querySelector('canvas[aria-label="credits"]'));
await page.mouse.click(180, 400);
await sleep(400);
const byMouseClosed = await page.evaluate(() => !document.querySelector('canvas[aria-label="credits"]'));
g.check("with a mouse too: a click on the button opens it and it stays open; the next click closes it", byMouse && byMouseClosed, { byMouse, byMouseClosed });
const files = readdirSync(join(root, "music")).filter((f) => f.endsWith(".mp3"));
g.check("every music file is credited in music/CREDITS.txt", files.every((f) => credits.includes(f) || MACLEOD_TRACKS.some((t) => credits.includes(`"${t}"`) && f.replace(".mp3", "").replace(/-/g, " ").startsWith(t.toLowerCase().split(" ")[0]))), files);
g.check("every Kevin MacLeod track in music/CREDITS.txt is on the screen", [...credits.matchAll(/"([^"]+)" Kevin MacLeod/g)].every((m) => MACLEOD_TRACKS.includes(m[1])), [...credits.matchAll(/"([^"]+)" Kevin MacLeod/g)].map((m) => m[1]));
g.check("every line waits for Brian's yes (he asked for the screen, not these words), with its source", CREDITS_LINES.every((l) => l.status === "needs-yes" && /#31/.test(l.source)));
g.check("no page errors", errors.length === 0, errors);
await g.finish("credits");
