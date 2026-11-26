// Stills of the home morning (Chapter 1 beats 22 to 24) at phone size (375 x 812, as tests/game-page.mjs opens), for
// Brian's picture check. Plays the bedtime story's end and the morning through with the test hooks and saves the page
// at each moment named below.
//   SSQ_PORT_OFFSET=5000 node tools/morning-stills.mjs <out folder> [moment ...]
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { startGame, sleep } from "../tests/game-page.mjs";

const out = process.argv[2] || "tests/out/morning-stills";
const only = process.argv.slice(3);
mkdirSync(out, { recursive: true });
const g = await startGame({ port: 9755, name: "morning-stills" });
const { page } = await g.open("?ch=1", { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
await page.evaluate(() => window.__ss.lockedReady);
await sleep(1200);
await page.evaluate(() => (window.requestAnimationFrame = () => 0));
const snap = async (name) => {
  if (only.length && !only.includes(name)) return;
  await page.evaluate(() => window.__ss.drawFrame());
  await page.screenshot({ path: join(out, name + ".png") });
  console.log("saved", join(out, name + ".png"));
};
// Each moment: a function run in the page that plays on to it (returns false when it could not get there).
const go = (fn, arg) => page.evaluate(fn, arg);
const H = `
  const ss = window.__ss, n = ss.op, hm = window.SSQ.beat("ch1-home-morning");
  const step = () => ((hm.debug().state || {}).step || "");
  const tick = (s) => { for (let i = 0; i < Math.round(s / 0.05); i++) ss.tick(0.05); };
  const next = () => ((n.bt = 1), ss.opTap());
  const press = () => { const s = (hm.spots() || [])[0]; s && s.f(); return !!s; };
  const until = (f, s = 30) => { for (let i = 0; i < s / 0.05 && !f(); i++) ss.tick(0.05); return f(); };
`;
const play = (body) => page.evaluate(new Function(H + body));
// from the TV story through bedtime to Day 2
await play(`n.q = []; n.cur = null; window.SSQ.engine().tvStory();
  const bed = window.SSQ.beat("ch1-bedtime-story");
  for (let i = 0; i < 6000 && bed.debug().phase !== "fade"; i++) { ss.tick(0.05); const c = n.cur; c && ["card","cutaway","bub","panel","wait"].includes(c.k) && ((n.bt = 1), ss.opTap()); }
  until(() => n.ch1Day2, 30); tick(0.2);`);
await snap("01-night-dark");
const moments = (globalThis.MOMENTS = []);
const shots = [
  ["02-night-up", `until(() => step() !== "night" || hm.debug().drew && hm.debug().drew.dark < 0.05, 8);`],
  ["03-pa", `until(() => n.cur && n.cur.k === "bub", 8); tick(0.4);`],
  ["04-mops-up", `n.cur && n.cur.k === "bub" && next(); tick(1.6);`],
  ["05-mops-leaves", `tick(1.6);`],
  ["06-wake", `until(() => step() === "wake", 12); tick(1.2);`],
  ["07-out-of-bed", `until(() => step() === "wake" && (hm.debug().state || {}).phase === "out", 8); tick(0.3);`],
  ["08-rocket", `until(() => step() === "rocket" && n.ctrl, 12); tick(0.3);`],
  ["09-note", `press(); until(() => n.cur && n.cur.k === "cutaway", 3); tick(0.6);`],
  ["10-hold-thought", `until(() => step() === "hold", 2) || (next(), until(() => step() === "hold", 3)); tick(1.4);`],
  ["11-guardians-line", `until(() => n.cur && n.cur.k === "bub", 6); tick(0.3);`],
  ["12-box-thought", `next(); tick(0.8);`],
  ["13-closet-goal", `until(() => step() === "closet" && n.ctrl, 6); tick(0.3);`],
  ["14-walk-to-closet", `press(); tick(0.5);`],
  ["15-box-goal", `until(() => step() === "box" && n.ctrl, 8); tick(0.3);`],
  ["16-box-closeup", `press(); until(() => n.cur && n.cur.k === "cutaway", 4); tick(1.0);`],
  ["17-box-closeup-landed", `tick(1.0);`],
  ["18-bag-goal", `next(); until(() => step() === "toBag" || step() === "lunch" && n.ctrl, 8); tick(0.3);`],
  ["19-bag-arrive", `for (let i = 0; i < 400 && !(n.cur && n.cur.k === "bub"); i++) { window.SSQ.engine().step("sq", 760, 505, 200, 0.05); ss.tick(0.05); } tick(0.3);`],
  ["20-lunch", `next(); until(() => step() === "lunch" && n.ctrl, 4); tick(0.3);`],
];
for (const [name, body] of shots) {
  await play(body);
  await snap(name);
}
process.exit(0);
