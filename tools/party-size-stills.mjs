/**
 * Stills of every party scene set in the hall, at phone size (375 x 812), for a before-and-after look when the
 * size of people in the hall changes (Brian 2026-11-24: everyone in the hall 30% bigger). Not a test.
 *   node tools/party-size-stills.mjs <folder> <before|after>
 * Run npm run build first. Each still is the whole phone screen; a "-close" one beside it is the game picture alone,
 * three times bigger, so heads, hats, notes and labels can be checked against the locked room.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { startGame, sleep } from "../tests/game-page.mjs";

const [dir, tag] = process.argv.slice(2);
if (!dir || !tag) {
  console.error("Usage: node tools/party-size-stills.mjs <folder> <before|after>");
  process.exit(2);
}
mkdirSync(dir, { recursive: true });
const g = await startGame({ port: 9320, name: "party-size-stills" });
const set = (page, f, arg) => page.evaluate(`(${f})(window.__ss.op.ch1PartyNow, window.__ss.op, ${JSON.stringify(arg || null)})`);
const run = (page, secs) => page.evaluate((n) => { for (let i = 0; i < n; i++) window.__ss.tick(0.05); }, Math.round(secs / 0.05));
const freeze = (page) => page.evaluate(() => ((window.requestAnimationFrame = () => 0), window.__ss.drawFrame()));
const place = (page, x, y) => page.evaluate((p) => ((window.__ss.op.sq.x = p[0]), (window.__ss.op.sq.y = p[1])), [x, y]);
const tapAll = async (page, n) => { for (let i = 0; i < n; i++) (await page.evaluate(() => window.__ss.op.cur && ["bub", "card", "panel", "wait"].includes(window.__ss.op.cur.k) && window.__ss.opTap()), await run(page, 0.3)); };

// Each scene: its link, then what to do before the still (the clock is the test's own from the freeze on).
const SCENES = {
  "P1-peek": { beat: "party:P1", go: async (page) => { await page.evaluate(() => (window.__ss.actionDown(), window.__ss.actionUp())); await run(page, 4); } },
  "P2-sneak": { beat: "party:P2", go: async (page) => run(page, 1) },
  "P2-in-a-cone": { beat: "party:P2", go: async (page) => { await set(page, (p) => (p.gt = 4.2)); await place(page, 420, 500); await run(page, 0.3); } },
  "P3-band": { beat: "party:P3", go: async (page) => { await tapAll(page, 30); } },
  "P4-sneak-home": { beat: "party:P4", go: async (page) => run(page, 1) },
  "P6-walk-in": { beat: "party:P6", go: async (page) => run(page, 1) },
  "P6-by-the-camera": { beat: "party:P6", go: async (page) => { await place(page, 430, 470); await run(page, 0.4); } },
  "P6-dance-spot": { beat: "party:P6", go: async (page) => { await place(page, 470, 366); await run(page, 0.4); } },
  "P6-at-the-bar": { beat: "party:P6", go: async (page) => { await place(page, 780, 497); await run(page, 0.4); } },
  "P6-milling-20s": { beat: "party:P6", go: async (page) => { await place(page, 150, 585); await run(page, 20); } },
  "P6-conga": { beat: "party:P6", go: async (page) => { await place(page, 150, 585); await set(page, (p) => (p.songT = 12)); await run(page, 14); } },
  "P7-alarm": { beat: "party:P7", go: async (page) => run(page, 2.5) },
  "P8b-closing": { beat: "party:P8b", go: async (page) => { await tapAll(page, 3); await run(page, 4); } },
  "P8b-mops": { beat: "party:P8b", go: async (page) => { await tapAll(page, 3); await place(page, 480, 520); for (let i = 0; i < 80 && !(await page.evaluate(() => { const p = window.__ss.op.ch1PartyNow; return p.mops && p.close.phase === "look" && p.mops.heart >= 1; })); i++) await run(page, 1); } },
};
for (const [name, sc] of Object.entries(SCENES)) {
  const { page, errors } = await g.open("?beat=" + sc.beat, { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 3 });
  await sleep(1500);
  await freeze(page);
  await sc.go(page);
  await page.evaluate(() => window.__ss.drawFrame());
  await page.screenshot({ path: join(dir, `${name}-${tag}.png`) });
  const url = await page.evaluate(() => document.querySelector("canvas").toDataURL("image/png"));
  writeFileSync(join(dir, `${name}-${tag}-close.png`), Buffer.from(url.split(",")[1], "base64"));
  g.check(name + ": no errors", errors.length === 0, errors);
  await page.close();
}
await g.finish("party-size-stills");
