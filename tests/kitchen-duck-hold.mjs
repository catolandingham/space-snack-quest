/**
 * The kitchen duck is press-and-hold, and Gloop's look is shown before it lands (R99, Brian 2026-11-13).
 *   - when Gloop calls "Order up?", the button offers the ball; holding the action button keeps Squatch
 *     in the ball, and letting go stands him up (no more stuck ball with no button)
 *   - a quick tap is a quick duck: he is back up as soon as the button is let go
 *   - the same works with the real action button on a phone (touch down, touch up)
 *   - during the warning a faint preview of Gloop's cone is drawn where her look will land, and it is
 *     not counted as a catching cone; during her look the real cone is drawn and counted
 *   - a ball the game sets by itself (no hold) is not stood up by this rule
 *   node tests/kitchen-duck-hold.mjs
 */
import { startGame, sleep } from "./game-page.mjs";
import { setState } from "./chapter-states.mjs";

const g = await startGame({ port: 8852, name: "kitchen-duck-hold" });
const ROLL = "ROLL \u00b7 into a ball";

async function warnUp(page) {
  await page.evaluate(setState, { kind: "ch2", steps: [[ "set", { done: 0, held: -1, greasy: false, cook: "gone" }], ["reset", "wash1"], ["set", { cook: "gone" }]] });
  await sleep(1500);
  return page.evaluate(async () => {
    const ss = window.__ss, n = ss.op, k = ss.ch2;
    n.q = []; n.cur = null; n.live = []; n.ctrl = true; ss.swapTo(false); n.sqPose = "stand"; n.duckHold = false;
    k.sec = null; k.peek = 0; k.eye = 0; k.peekT = 999; k.warn = 60;
    for (let i = 0; i < 12; i++) await new Promise((r) => requestAnimationFrame(r));
    return String(ss.game.verb || "").replace(/^!/, "");
  });
}
const pose = (page, frames = 6) =>
  page.evaluate(async (frames) => {
    for (let i = 0; i < frames; i++) await new Promise((r) => requestAnimationFrame(r));
    return window.__ss.op.sqPose;
  }, frames);

// Keyboard (E).
const kb = await g.open("?ch=2");
const verb = await warnUp(kb.page);
g.check("when Gloop calls, the button offers the ball", verb === ROLL, { verb });
await kb.page.keyboard.down("KeyE");
const down1 = await pose(kb.page);
await sleep(1200);
const down2 = await pose(kb.page);
g.check("holding the action key keeps Squatch in the ball", down1 === "ball" && down2 === "ball", { down1, down2 });
await kb.page.keyboard.up("KeyE");
const up = await pose(kb.page);
g.check("letting go stands Squatch up", up === "stand", { up });

await warnUp(kb.page);
await kb.page.keyboard.down("KeyE");
await sleep(60);
await kb.page.keyboard.up("KeyE");
const tapped = await pose(kb.page, 10);
g.check("a quick tap is only a quick duck", tapped === "stand", { tapped });

// A ball the game sets on its own is left alone.
const own = await kb.page.evaluate(async () => {
  const n = window.__ss.op;
  n.sqPose = "ball"; n.duckHold = false; window.__ss.ch2.warn = 0;
  for (let i = 0; i < 8; i++) await new Promise((r) => requestAnimationFrame(r));
  return n.sqPose;
});
g.check("a ball set by the story is not stood up by the hold rule", own === "ball", { own });

// Cones: preview during the warning, real cone during the look.
await warnUp(kb.page);
const cones = await kb.page.evaluate(() => {
  const ss = window.__ss, k = ss.ch2;
  const cv = document.querySelector("canvas");
  const cx = cv.getContext("2d", { willReadFrequently: true });
  // A floor point inside Gloop's cone (the window cone's own numbers: facing 1.95, length 520).
  const read = () => {
    ss.drawFrame();
    const c = ss.conesDrawn().find((c) => Math.abs(c.a - 1.95) < 0.01 && c.len === 520);
    return { counted: !!c, cones: ss.conesDrawn().length };
  };
  k.warn = 60; k.peek = 0;
  const warn = read();
  k.warn = 0; k.peek = 0;
  const none = read();
  k.warn = 0; k.peek = 60; ss.op.sqPose = "hidden";
  const look = read();
  k.peek = 0; ss.op.sqPose = "stand";
  return { warn, none, look };
});
g.check("the warning preview is not counted as a catching cone", !cones.warn.counted, cones);
g.check("Gloop's look draws and counts the real cone", cones.look.counted, cones);

// The preview is really drawn: the floor under it changes while the warning is up.
const preview = await kb.page.evaluate(async () => {
  const ss = window.__ss, k = ss.ch2;
  k.warn = 0; k.peek = 60; ss.op.sqPose = "hidden"; ss.drawFrame();
  const c = ss.conesDrawn().find((c) => Math.abs(c.a - 1.95) < 0.01 && c.len === 520);
  k.peek = 0; ss.op.sqPose = "stand";
  if (!c) return { ok: false, why: "no look cone to aim at" };
  const cv = document.querySelector("canvas");
  const cx = cv.getContext("2d", { willReadFrequently: true });
  const kx = cv.width / 960;
  const pts = [];
  for (let t = -0.6; t <= 0.6; t += 0.2) for (const d of [180, 260, 340]) pts.push([c.ox + Math.cos(c.a + t) * d, c.oy + Math.sin(c.a + t) * d]);
  const grab = () => pts.map(([x, y]) => Array.from(cx.getImageData(Math.round(x * kx), Math.round(y * kx), 1, 1).data.slice(0, 3)));
  k.warn = 0; ss.drawFrame();
  const plain = grab();
  k.warn = 60; ss.drawFrame();
  const warned = grab();
  k.warn = 0;
  const changed = plain.filter((p, i) => p.some((v, j) => Math.abs(v - warned[i][j]) > 6)).length;
  return { ok: changed >= 3, changed, of: pts.length };
});
g.check("a faint preview of Gloop's look is drawn during \"Order up?\"", preview.ok, preview);
await kb.ctx.close();

// Phone: the real action button, held with a finger.
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true };
const ph = await g.open("?ch=2", PHONE);
await warnUp(ph.page);
const btn = await ph.page.evaluate(() => {
  const el = document.querySelector('[role="button"]');
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
});
await ph.page.touchscreen.touchStart(btn.x, btn.y);
const tDown = await pose(ph.page);
await sleep(900);
const tStill = await pose(ph.page);
await ph.page.touchscreen.touchEnd();
const tUp = await pose(ph.page);
g.check("phone: a finger on the button keeps the ball, lifting it stands him up", tDown === "ball" && tStill === "ball" && tUp === "stand", { tDown, tStill, tUp });

g.check("no page errors", ph.errors.length === 0 && kb.errors.length === 0, [...kb.errors, ...ph.errors]);
await g.finish("kitchen duck hold");
