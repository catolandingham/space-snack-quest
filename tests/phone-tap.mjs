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
 * The picture's top edge is within the HUD bar's height (plus 16 pixels) of the page top.
 * Tap to walk (task T23): a fresh page reaches the diner (g2) with taps on the picture to walk and to say
 * "next", and the ACTION button to act. No joystick.
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

// Sound is off until the player taps the speaker (Brian, 2026-11-23; tests/sound-button.mjs has the rest).
{
  const before = await page.evaluate(() => ({ ...window.__ss.audio(), icon: window.__ss.soundState() }));
  g.check("before any touch, the speaker shows sound off", before.icon === "muted" && before.state !== "running", before);
  await touch.touchStart(at.joy.x, at.joy.y);
  await sleep(60);
  await touch.touchEnd();
  await sleep(400);
  const after = await page.evaluate(() => ({ ...window.__ss.audio(), icon: window.__ss.soundState() }));
  g.check("a joystick touch does not turn sound on", after.state !== "running" && after.icon === "muted", after);
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
  async hold(down) {
    await input.push(0, 0);
    if (down) {
      at = await boxes();
      await touch.touchStart(at.act.x, at.act.y);
    } else await touch.touchEnd();
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

// A tap on the picture does not turn sound on either (a fresh page).
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
  g.check("a picture tap does not turn sound on", before !== "running" && after.state !== "running" && after.icon === "muted", { before, after });
  await second.ctx.close();
}

// Phase 3 pinned the game to the top of a phone screen, under the HUD bar (the chip row sits above the picture).
const top = await page.evaluate(() => ({ pic: Math.round(document.querySelector("canvas").getBoundingClientRect().top + window.scrollY), bar: Math.round(document.getElementById("ss-hudbar").getBoundingClientRect().height) }));
g.check("the picture's top edge is within the HUD bar's height (plus 16 px) of the page top", top.pic <= top.bar + 16, top);

// Tap to walk (task T23, Brian's D11): a fresh phone page reaches the diner (g2) with no joystick at all.
// Taps on the picture walk (and say "next" while a bubble or card is up); the ACTION button acts.
{
  const third = await g.open("?ch=2", { width: 375, height: 812, isMobile: true, hasTouch: true });
  const p3 = third.page;
  const pic = () => p3.evaluate(() => { const r = document.querySelector("canvas").getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
  const tap = async (x, y) => { await p3.touchscreen.touchStart(x, y); await sleep(40); await p3.touchscreen.touchEnd(); };
  // A point on the picture, in game pixels (960 by 640), as a tap on the page.
  const tapGame = async (gx, gy) => { const r = await pic(); await tap(r.x + (gx * r.w) / 960, r.y + (gy * r.h) / 640); };
  const st = () => p3.evaluate(() => { const ss = window.__ss, n = ss.op, c = n.cur; return { phase: ss.ch2.phase, ctrl: n.ctrl, up: !!(c && ["bub", "card", "panel", "fb", "wait"].includes(c.k)), button: String(ss.game.verb || "").replace(/^!/, ""), walking: !!n.walkTo, mops: !!ss.ch.mops, log: n.log.filter((e) => e.k === "hint").length }; });
  async function nextUntil(phase) {
    for (let i = 0; i < 80; i++) {
      const s = await st();
      if (s.phase === phase && s.ctrl && !s.up) return true;
      if (s.up) await tapGame(480, 320);
      await sleep(250);
    }
    return false;
  }
  const pos = () => p3.evaluate(() => { const ss = window.__ss, w = ss.ch.mops ? ss.op.mo : ss.op.sq; return { x: w.x, y: w.y }; });
  // Tap the spot, then require the character to actually move (a tap that does nothing fails the step).
  async function walkTo(gx, gy, until) {
    const from = await pos();
    await tapGame(gx, gy);
    let moved = false;
    for (let i = 0; i < 60; i++) {
      const s = await st(), at = await pos();
      moved = moved || Math.hypot(at.x - from.x, at.y - from.y) > 5;
      if (moved && (until ? s.button === until : !s.walking)) return true;
      if (!moved && i === 14) return false;
      if (moved && !s.walking && until && i % 10 === 9) await tapGame(gx, gy);
      await sleep(150);
    }
    return false;
  }
  async function act(label) {
    // Under a loaded machine the page's button can be a frame behind the game: give it a moment.
    await p3.waitForFunction((label) => (document.querySelector('[role="button"]')?.textContent || "").includes(label), { timeout: 1500 }, label).catch(() => {});
    const b = await p3.evaluate(() => { const r = document.querySelector('[role="button"]').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, text: document.querySelector('[role="button"]').textContent }; });
    await tap(b.x, b.y);
    await sleep(300);
    return b.text.includes(label);
  }
  const steps = [];
  steps.push(["opening lines to g1", await nextUntil("g1")]);
  steps.push(["tap the crate by the pump", await walkTo(690, 470, "HIDE · crate")]);
  const hint = await st();
  steps.push(["the walk hint showed once", hint.log === 1]);
  steps.push(["HIDE with the button", await act("HIDE")]);
  steps.push(["lines to g1door", await nextUntil("g1door")]);
  steps.push(["Mops: tap below the crate", await walkTo(600, 560)]);
  steps.push(["Mops: tap the diner door", await walkTo(300, 470, "ENTER · diner door")]);
  steps.push(["ENTER with the button", await act("ENTER")]);
  steps.push(["into the diner", await nextUntil("g2")]);
  const bad = steps.filter((s) => !s[1]).map((s) => s[0]);
  g.check("a phone player reaches the diner (g2) by tapping the picture to walk and the button to act, no joystick", bad.length === 0, { bad, end: await st() });
  // A tap on a live bubble means "next": it never sets a walk target.
  const onBubble = await p3.evaluate(() => {
    const n = window.__ss.op;
    n.walkTo = null;
    n.q = [{ k: "bub", b: { who: "mops", text: "Two.", style: "say" } }];
    n.cur = { k: "bub", b: { who: "mops", text: "One.", style: "say" } };
    n.bt = 1;
    return true;
  });
  await tapGame(800, 560);
  await sleep(150);
  const afterBubble = await p3.evaluate(() => { const n = window.__ss.op; return { walkTo: !!n.walkTo, text: n.cur && n.cur.b ? n.cur.b.text : null }; });
  g.check("a tap on a live bubble moves to the next line and never sets a walk target", onBubble && !afterBubble.walkTo && afterBubble.text !== "One.", afterBubble);
  await p3.evaluate(() => { const n = window.__ss.op; n.q = []; n.cur = null; n.ctrl = true; });
  // A tap sets a walk target; an arrow key cancels it.
  await tapGame(800, 560);
  await sleep(100);
  const walking = (await st()).walking;
  await p3.evaluate(() => window.dispatchEvent(new KeyboardEvent("keydown", { code: "ArrowLeft", bubbles: true })));
  await sleep(150);
  const after = (await st()).walking;
  await p3.evaluate(() => window.dispatchEvent(new KeyboardEvent("keyup", { code: "ArrowLeft", bubbles: true })));
  g.check("a tap on the picture with no bubble up sets a walk target, and an arrow key cancels it", walking && !after, { walking, after });
  g.check("tap to walk: no page errors", third.errors.length === 0, third.errors);
  await third.ctx.close();
}

await ctx.close();
await g.finish("phone-tap");
