/**
 * The kitchen window warning can be seen, and a good hide is confirmed (task T20).
 * (a) When Gloop is about to look through the order window, the window's frame changes color and stays
 *     changed for at least 2.5 seconds before she looks, and stays changed until her look ends.
 * (b) The warning itself lasts 2.5 seconds in both dish sets (it was 1.1 and 1.5).
 * (c) When security comes for Squatch in the kitchen and he rolls into a ball, security leaves and
 *     "They lost you." shows (row 19.16).
 *   node tests/kitchen-warning.mjs
 */
import { startGame, sleep, readLines } from "./game-page.mjs";
import { setState } from "./chapter-states.mjs";

const g = await startGame({ port: 8795, name: "kitchen-warning" });
const lines = readLines();
const { page, errors } = await g.open("?ch=2");
// A spot on the window frame's left side, in canvas pixels; dark (#2c3544) when Gloop is not coming.
const FRAME = [503, 150];
const pixel = () =>
  page.evaluate(([x, y]) => {
    window.__ss.drawFrame();
    const d = document.querySelector("canvas").getContext("2d").getImageData(x, y, 1, 1).data;
    const ch2 = window.__ss.ch2;
    return { rgb: [d[0], d[1], d[2]], warn: ch2.warn, peek: ch2.peek, eye: ch2.eye || 0 };
  }, FRAME);
const dark = (p) => Math.abs(p.rgb[0] - 0x2c) < 24 && Math.abs(p.rgb[1] - 0x35) < 24 && Math.abs(p.rgb[2] - 0x44) < 24;

for (const ph of ["wash1", "wash5"]) {
  await page.evaluate(setState, { kind: "ch2", steps: [["set", { done: ph === "wash5" ? 3 : 0, held: -1, greasy: false, cook: "gone" }], ["reset", ph], ["set", { cook: "gone" }]] });
  // Squatch rolls into a ball so Gloop's look finds nothing.
  // Let the room's fade-in finish before reading the frame.
  await page.evaluate(() => { window.__ss.op.sqPose = "ball"; window.__ss.ch2.peekT = 99; });
  await sleep(1500);
  const before = await pixel();
  await page.evaluate(() => { window.__ss.ch2.peekT = 0.05; });
  const samples = [];
  const t0 = Date.now();
  while (Date.now() - t0 < 6000) {
    const p = await pixel();
    samples.push({ t: Date.now() - t0, changed: !dark(p), warn: p.warn, peek: p.peek, eye: p.eye });
    await sleep(80);
  }
  const warnStart = samples.find((s) => s.warn > 0);
  const lookEnd = samples.find((s, i) => i > 0 && samples[i - 1].peek > 0 && s.peek <= 0 && s.warn <= 0);
  const firstWarnT = warnStart ? warnStart.t : -1;
  const changedFrom = samples.find((s) => s.changed);
  let run = 0;
  for (const s of samples) if (s.t >= (changedFrom ? changedFrom.t : 0)) { if (s.changed) run = s.t - changedFrom.t; else break; }
  const maxWarn = Math.max(...samples.map((s) => s.warn));
  g.check(`${ph}: before the warning the window frame is dark`, dark(before), before);
  g.check(`${ph}: the warning lasts 2.5 seconds (it was 1.1 to 1.5)`, maxWarn > 2.3 && maxWarn <= 2.5, { maxWarn });
  g.check(`${ph}: the window frame changes color when the warning starts and stays changed at least 2.5 seconds`, !!warnStart && !!changedFrom && Math.abs(changedFrom.t - firstWarnT) < 300 && run >= 2500, { firstWarnT, changedAt: changedFrom && changedFrom.t, run });
  const during = samples.filter((s) => s.warn > 0 || s.peek > 0);
  g.check(`${ph}: the window stays changed until Gloop's look ends`, during.length > 0 && during.every((s) => s.changed), during.filter((s) => !s.changed).slice(0, 3));
  g.check(`${ph}: after the look the frame is dark again`, !!lookEnd && !samples.at(-1).changed, { lookEnd, last: samples.at(-1) });
}

// "They lost you." in the kitchen.
await page.evaluate(setState, { kind: "ch2", steps: [["set", { done: 0, held: -1, cook: "gone" }], ["reset", "wash1"], ["set", { cook: "gone" }]] });
await page.evaluate(() => {
  const ss = window.__ss, n = ss.op;
  n.log.length = 0; ss.ch2.peekT = 99;
  ss.startSec("sink");
  n.sqPose = "ball";
});
let lost = false;
for (let i = 0; i < 80 && !lost; i++) {
  await sleep(100);
  lost = await page.evaluate(() => !window.__ss.ch2.sec && window.__ss.op.log.some((e) => e.text === "They lost you."));
}
g.check("kitchen: rolling into a ball while security comes sends it away and shows \"They lost you.\"", lost && lines["19.16"] === "They lost you.");
g.check("no page errors", errors.length === 0, errors);
await g.finish("kitchen-warning");
