/**
 * The joystick and the ACTION button are always on screen (Brian, 2026-11-23: "touch doesn't work at all for
 * singing with mops, so I think controls (joystick, etc.) should just always be shown"). Before, a screen the
 * game did not take for a touch screen hid them behind a "Show touch controls" button, and singing with Mops
 * (an action where Squatch stands, so nothing to tap in the picture) could not be done by touch.
 *   node tests/controls-always.mjs
 */
import { startGame, sleep } from "./game-page.mjs";

const g = await startGame({ port: 8988, name: "controls-always" });
for (const vp of [
  { name: "computer", width: 1100, height: 800 },
  { name: "phone", width: 375, height: 812, isMobile: true, hasTouch: true },
]) {
  const { page, ctx, errors } = await g.open("?ch=1", vp);
  await page.evaluate(() => window.__ss.lockedReady);
  await sleep(500);
  const seen = await page.evaluate(() => {
    const vis = (el) => !!el && el.getBoundingClientRect().width > 0 && getComputedStyle(el).visibility !== "hidden";
    return {
      stick: vis(document.querySelector('[aria-label="Move"]')),
      action: vis(document.querySelector('[role="button"]')),
      toggle: [...document.querySelectorAll("button")].some((b) => /touch controls/i.test(b.textContent || "")),
    };
  });
  g.check(`${vp.name}: the joystick is on screen`, seen.stick, seen);
  g.check(`${vp.name}: the ACTION button is on screen`, seen.action, seen);
  g.check(`${vp.name}: no "Show touch controls" button`, !seen.toggle, seen);
  // The morning song: Squatch can sing along with Mops. The ACTION button says SING; pressing it sings.
  await page.evaluate(() => {
    const ss = window.__ss,
      n = ss.op;
    Object.assign(n, { scene: "Q1", room: "closet", q: [], cur: null, ctrl: true, ch1Song: true, ch1Party: false, ch1Day2: false, sqPose: "stand", moPose: "stand" });
    ((n.sq.x = 400), (n.sq.y = 500), (n.mo.x = 690), (n.mo.y = 560));
    ss.tick(1 / 30);
  });
  await sleep(300);
  const btn = await page.evaluate(() => {
    const el = document.querySelector('[role="button"]');
    el.scrollIntoView({ block: "center" });
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, text: el.textContent };
  });
  g.check(`${vp.name}: at the song, the ACTION button says SING`, /SING/.test(btn.text), btn);
  vp.hasTouch ? await page.touchscreen.tap(btn.x, btn.y) : await page.mouse.click(btn.x, btn.y);
  await sleep(400);
  const sang = await page.evaluate(() => ({ song: window.__ss.op.ch1Song, ctrl: window.__ss.op.ctrl }));
  g.check(`${vp.name}: pressing it starts singing with Mops`, sang.song === false, sang);
  g.check(`no page errors (${vp.name})`, errors.length === 0, errors);
  await ctx.close();
}
await g.finish("controls-always");
