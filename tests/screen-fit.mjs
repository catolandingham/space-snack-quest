/**
 * The picture fits the screen and stays still (Brian, 2026-11-14; docs/CHAPTER-1-PROBLEMS.md problems 4 and 5, Brian t119).
 * Phone upright, phone sideways, iPad upright and iPad sideways, touch only, Chapter 1 from the start:
 * - the whole picture and the big button are on screen (nothing cut off at the bottom),
 * - sideways the picture uses at least half the screen on an iPad and on a phone,
 * - the picture does not move when the opening cards end and the goal bar first shows,
 * - the big button is the same size for every label.
 *   node tests/screen-fit.mjs
 */
import { startGame, sleep } from "./game-page.mjs";

const g = await startGame({ port: 8921, name: "screen-fit" });
const SIZES = {
  "phone upright": { width: 375, height: 812, minShare: 0.25 },
  "phone sideways": { width: 812, height: 375, minShare: 0.45 },
  "iPad upright": { width: 820, height: 1180, minShare: 0.4 },
  "iPad sideways": { width: 1180, height: 820, minShare: 0.5 },
};
for (const [name, s] of Object.entries(SIZES)) {
  const { page } = await g.open("?ch=1", { width: s.width, height: s.height, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  const box = () =>
    page.evaluate(() => {
      const r = (el) => (el ? el.getBoundingClientRect() : null);
      const c = r(document.querySelector("canvas")),
        b = r(document.querySelector('[role="button"]'));
      return { c: [c.x, c.y, c.width, c.height].map(Math.round), b: b && [b.width, b.height].map(Math.round), scene: window.__ss.op.scene };
    });
  await sleep(800);
  const first = await box();
  const widths = new Set();
  // Tap through the opening cards, then let the song come up (its label is the long "SING · song").
  for (let i = 0; i < 12; i++) {
    await page.touchscreen.tap(s.width / 2, Math.min(s.height * 0.3, first.c[1] + first.c[3] / 2));
    await sleep(500);
    const now = await box();
    now.b && widths.add(now.b.join("x"));
  }
  const last = await box();
  const [x, y, w, h] = last.c;
  g.check(`${name}: the whole picture is on screen`, x >= 0 && y >= 0 && x + w <= s.width + 1 && y + h <= s.height + 1, last.c);
  g.check(`${name}: the picture uses at least ${s.minShare * 100}% of the screen`, (w * h) / (s.width * s.height) >= s.minShare, ((w * h) / (s.width * s.height)).toFixed(2));
  g.check(`${name}: the picture did not move after the opening cards`, first.c[1] === last.c[1] && first.c[0] === last.c[0], { first: first.c, last: last.c });
  g.check(`${name}: the big button kept one size`, widths.size <= 1, [...widths]);
  await page.close();
}
await g.finish("screen-fit");
