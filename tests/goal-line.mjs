/**
 * The longest goal stays on one line, in the top row, clear of the party balloon.
 *   node tests/goal-line.mjs
 */
import { startGame, sleep } from "./game-page.mjs";

const LINE = "Squatch: grab a dish from the rack by the window";
const g = await startGame({ port: 8887, name: "goal-line" });
for (const [name, vp] of [
  ["1024x768", { width: 1024, height: 768, isMobile: true, hasTouch: true, deviceScaleFactor: 1 }],
  ["768x1024", { width: 768, height: 1024, isMobile: true, hasTouch: true, deviceScaleFactor: 1 }],
]) {
  const { page } = await g.open("?ch=1", vp);
  await page.evaluate((line) => {
    const n = window.__ss.op;
    n.scene = "QA";
    n.room = "hall";
    n.ch1Party = true;
    n.ctrl = true;
    n.cur = null;
    n.q = [];
    n.chip = line;
    n.starOn = true;
    n.stars = 1250;
    window.__ss.drawFrame();
  }, LINE);
  await sleep(3800);
  const out = await page.evaluate((line) => {
    const ss = window.__ss;
    const n = ss.op;
    n.scene = "QA";
    n.room = "hall";
    n.ch1Party = true;
    n.ctrl = true;
    n.cur = null;
    n.q = [];
    n.chip = line;
    n.starOn = true;
    n.stars = 1250;
    ss.drawFrame();
    ss.tick(0.05);
    const chip = document.getElementById("ss-chip");
    const canvas = document.querySelector("canvas");
    const cr = chip.getBoundingClientRect();
    const cv = canvas.getBoundingClientRect();
    const cs = getComputedStyle(chip);
    const k = cv.width / 960;
    const balloonTop = cv.top + (80 - 18) * k;
    const where = document.getElementById("ss-where").getBoundingClientRect();
    const faces = document.getElementById("ss-faces").getBoundingClientRect();
    const overlap = (a, b) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 0.5 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 0.5;
    return {
      text: chip.textContent,
      font: parseFloat(cs.fontSize),
      white: cs.whiteSpace,
      oneLine: cr.height < parseFloat(cs.fontSize) * 2.6,
      aboveBalloon: cr.bottom < balloonTop,
      clearWhere: !overlap(cr, where),
      clearFaces: !overlap(cr, faces),
      h: Math.round(cr.height),
      bottom: Math.round(cr.bottom),
      balloon: Math.round(balloonTop),
    };
  }, LINE);
  g.check(name + ": the long goal is one line, at least 14px, and clear of the balloon", out.text === LINE && out.font >= 14 && out.white === "nowrap" && out.oneLine && out.aboveBalloon && out.clearWhere && out.clearFaces, out);
  await page.close();
}
await g.finish("goal-line");
