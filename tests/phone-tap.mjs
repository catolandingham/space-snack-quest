/**
 * A phone player gets through the gas stop and into the kitchen with touch alone (task T14).
 *   node tests/phone-tap.mjs          (ROUTE_LOG=1 prints one line per step)
 *
 * A 375 by 812 phone with touch on. The only input is touches sent through Chrome: a finger held on
 * the joystick to walk, a tap on the big ACTION button to act, and a tap on the picture for the next
 * line. It plays the start of tests/routes/ch2.json (the same route the keyboard test plays) from
 * ?ch=2 through the diner (phase g2) and the first kitchen dish (phase wash1).
 *
 * Sound: before any touch the sound icon shows "blocked"; the first touch on the joystick starts the
 * game's AudioContext ("running", icon "on"). On a second, fresh page the first tap on the picture
 * does the same.
 *
 * Expected to fail until task T21: the picture's top edge is within 16 pixels of the page top.
 * That check is printed but does not fail the suite yet.
 */
import { startGame, sleep } from "./game-page.mjs";
import { readRoute, playRoute, look } from "./route-player.mjs";

const route = readRoute("ch2.json");
const last = route.steps.findIndex((s) => s.say === "Dish 1: scrub");
const steps = route.steps.slice(0, last + 1);

const g = await startGame({ port: 8791, name: "phone-tap" });
const { ctx, page, errors } = await g.open("?ch=2", { width: 375, height: 812, isMobile: true, hasTouch: true });

// Where the joystick, the ACTION button and the picture are on the page, in CSS pixels.
const boxes = () =>
  page.evaluate(() => {
    const box = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height, top: r.top, bottom: r.bottom };
    };
    return {
      joy: box(document.querySelector('[aria-label="Move"]')),
      act: box(document.querySelector('[role="button"]')),
      pic: box(document.querySelector("canvas")),
      vh: window.innerHeight,
    };
  });

let at = await boxes();
g.check("the joystick, the ACTION button and the picture are on the page", !!(at.joy && at.act && at.pic), at);
// Bring the controls into view the way a player scrolls, if they sit below the fold.
if (at.joy && at.joy.bottom > at.vh) {
  await page.evaluate(() => document.querySelector('[aria-label="Move"]').scrollIntoView({ block: "end" }));
  await sleep(200);
  at = await boxes();
}

const touch = page.touchscreen;

// Sound starts on the first touch of the joystick.
{
  const before = await page.evaluate(() => ({ ...window.__ss.audio(), icon: window.__ss.soundState() }));
  g.check("before any touch, the sound icon shows blocked (no sound yet)", before.icon === "blocked" && before.state !== "running", before);
  await touch.touchStart(at.joy.x, at.joy.y);
  await sleep(60);
  await touch.touchEnd();
  await sleep(400);
  const after = await page.evaluate(() => ({ ...window.__ss.audio(), icon: window.__ss.soundState() }));
  g.check("after the first joystick touch, the AudioContext is running and the icon shows on", after.state === "running" && after.icon === "on", after);
}
let finger = null; // where the joystick finger is, or null
const input = {
  async push(dx, dy) {
    const j = at.joy;
    if (!dx && !dy) {
      if (finger) { await touch.touchEnd(); finger = null; }
      return;
    }
    const len = Math.hypot(dx, dy);
    const to = { x: j.x + (dx / len) * j.w * 0.4, y: j.y + (dy / len) * j.h * 0.4 };
    if (!finger) { await touch.touchStart(j.x, j.y); finger = { x: j.x, y: j.y }; }
    if (Math.abs(finger.x - to.x) > 0.5 || Math.abs(finger.y - to.y) > 0.5) { await touch.touchMove(to.x, to.y); finger = to; }
  },
  async act() {
    await input.push(0, 0);
    at = await boxes(); // the button grows into a pill for long labels
    await touch.touchStart(at.act.x, at.act.y);
    await sleep(40);
    await touch.touchEnd();
  },
  async next() {
    await input.push(0, 0);
    await touch.touchStart(at.pic.x, at.pic.y);
    await sleep(40);
    await touch.touchEnd();
  },
};

const { failed, rolls } = await playRoute(page, input, steps);
const end = await look(page);
g.check(
  `a phone player walks with the joystick and acts with the button from ?ch=2 to the first kitchen dish (${steps.length} steps, ${rolls} rolls)`,
  !failed && end.phase === "wash1" && end.done >= 1,
  failed ? `stuck at step ${failed.step} "${failed.say}": ${failed.why}. State: ${failed.state}` : end.line,
);
g.check("no page errors", errors.length === 0, errors);

// Sound starts on the first tap of the picture too (a fresh page).
{
  const second = await g.open("?ch=2", { width: 375, height: 812, isMobile: true, hasTouch: true });
  const pic = await second.page.evaluate(() => {
    const r = document.querySelector("canvas").getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  const before = await second.page.evaluate(() => window.__ss.audio().state);
  await second.page.touchscreen.touchStart(pic.x, pic.y);
  await sleep(60);
  await second.page.touchscreen.touchEnd();
  await sleep(400);
  const after = await second.page.evaluate(() => ({ ...window.__ss.audio(), icon: window.__ss.soundState() }));
  g.check("after the first picture tap, the AudioContext is running and the icon shows on", before !== "running" && after.state === "running" && after.icon === "on", { before, after });
  await second.ctx.close();
}

// Expected to fail until T21 pins the game to the top of a phone screen.
const top = await page.evaluate(() => document.querySelector("canvas").getBoundingClientRect().top + window.scrollY);
console.log(`${top <= 16 ? "PASS (T21 has landed: make this a real check)" : "EXPECTED FAIL (until T21)"} the picture's top edge is within 16 px of the page top (it is ${Math.round(top)} px)`);

await ctx.close();
await g.finish("phone-tap");
