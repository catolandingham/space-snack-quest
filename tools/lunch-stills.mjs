// Stills of the lunch sneak (Chapter 1 beats 25 to 27, src/modules/lunch-sneak.js) at phone size (375 x 812, as
// tests/game-page.mjs opens), for Brian's picture check. Jumps to the lunch with the test hooks and saves the page at
// each moment named below.
//   SSQ_PORT_OFFSET=4000 node tools/lunch-stills.mjs <out folder> [moment ...]
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { startGame, sleep } from "../tests/game-page.mjs";

const out = process.argv[2] || "tests/out/lunch-stills";
const only = process.argv.slice(3);
mkdirSync(out, { recursive: true });
const g = await startGame({ port: 9757, name: "lunch-stills" });
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
const H = `
  const ss = window.__ss, n = ss.op, lu = window.SSQ.beat("ch1-lunch");
  const st = () => lu.debug().state || {};
  const tick = (s) => { for (let i = 0; i < Math.round(s / 0.05); i++) ss.tick(0.05); };
  const next = () => ((n.bt = 1), ss.opTap());
  const press = () => { const o = ss.offerNow(); o && o.f && o.f(); return !!o; };
  const until = (f, s = 30) => { for (let i = 0; i < s / 0.05 && !f(); i++) ss.tick(0.05); return f(); };
  const walkTo = (x, y, s = 8) => until(() => (window.SSQ.engine().step("sq", x, y, 190, 0.05), Math.hypot(n.sq.x - x, n.sq.y - y) < 3), s);
`;
const play = (body) => page.evaluate(new Function(H + body));
const shots = [
  // the start: TAKE · lunch at home, the walk in
  ["01-walk-in", `ss.ch1JumpBeat(22); window.SSQ.beat("ch1-home-morning").jump("lunch"); tick(0.3); press(); tick(1.2);`],
  ["02-plant-step", `until(() => n.ctrl && st().step === "plant", 6); tick(0.3);`],
  ["03-hidden-plant", `n.sq.x = 396; n.sq.y = 552; tick(0.1); press(); tick(0.4);`],
  ["04-hidden-crates", `lu.jump("door"); tick(0.6);`],
  ["05-door-step", `n.ch1Lunch.pose = "stand"; n.sqPose = "stand"; walkTo(740, 336); tick(0.1);`],
  ["06-door-goal-words", `tick(21);`],
  ["07-hallway-arrive", `walkTo(905, 320, 3); walkTo(930, 318, 2); until(() => n.room === "passage", 4); tick(0.6);`],
  ["08-mops-stops", `until(() => (st().mops || {}).mop === false, 6); tick(0.3);`],
  ["09-mops-looks-left", `tick(0.8);`],
  ["10-mops-looks-right", `tick(1.2);`],
  ["11-mops-hearts", `until(() => st().step === "give" || (st().mops || {}).hearts >= 0, 6); tick(0.5);`],
  ["12-give", `until(() => n.ctrl && st().step === "give", 6); tick(0.3);`],
  ["13-counter-ball", `lu.jump("snack"); tick(0.6);`],
];
for (const [name, body] of shots) {
  await play(body);
  await snap(name);
}
process.exit(0);
