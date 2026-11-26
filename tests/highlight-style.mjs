/**
 * One highlight style for the whole game (Brian 2026-11-26, the outline options: "A is a bit too thick, but B and E
 * are too little. So we'd like a thicker dashed line. So E, but thicker, but not quite as thick as A."): the dashed
 * gold line of src/modules/outline.js, 7.5 game pixels wide (about 3 px on a 375-wide phone), no glow. At phone size,
 * with the canvas hooked while a frame is drawn, for each thing the game marks:
 *   - the goal outline round the flyer on the counter (P4), the banner while a line names it (P3), the flyer in
 *     Isfred's hand (P3), the gap in the photo row (P6) and the shirt in the dress-up (P5): no shadow-blur glow and
 *     no radial glow is drawn there, and a dashed gold line of the one width is;
 *   - the line's width is the new one (7.5 game pixels; 3 screen pixels in a full-screen view);
 *   - the home morning (Day 2): the rocket and the lunch bag, while each is the goal, have the one dashed line and no
 *     glow behind them (home-morning.js drew a pulsing radial glow there until 2026-11-26).
 *   node tests/highlight-style.mjs
 */
import { join } from "node:path";
import { startGame, sleep, root } from "./game-page.mjs";

const { OUTLINE, OUTLINE_SCREEN } = await import(join(root, "src", "modules", "outline.js"));
const photo = await import(join(root, "src", "modules", "party-photo.js"));
const hall = await import(join(root, "src", "modules", "party-hall.js"));
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
const g = await startGame({ port: 9477, name: "highlight-style" });
g.check("the one highlight is 7.5 game pixels wide (about 3 px on a phone), dashed, gold; 3 screen pixels in a full-screen view", OUTLINE.width === 7.5 && OUTLINE.color === "#ffcf33" && OUTLINE.dash > 0 && OUTLINE_SCREEN.width === 3, OUTLINE);

// In the page: hook the canvas, run `setup`, draw one frame, and report what was drawn.
const HOOK = () => {
  const P = CanvasRenderingContext2D.prototype,
    blur = Object.getOwnPropertyDescriptor(P, "shadowBlur"),
    log = (window.__hl = { blur: 0, radial: [], gold: [] });
  Object.defineProperty(P, "shadowBlur", { configurable: true, get: blur.get, set(v) { v > 0 && log.blur++; blur.set.call(this, v); } });
  const rg = P.createRadialGradient;
  P.createRadialGradient = function (x0, y0, r0, x1, y1, r1) { log.radial.push([Math.round(x1), Math.round(y1), Math.round(r1)]); return rg.apply(this, arguments); };
  const st = P.stroke,
    sr = P.strokeRect;
  const note = (ctx) => String(ctx.strokeStyle).toLowerCase() === "#ffcf33" && log.gold.push({ w: ctx.lineWidth, dashed: ctx.getLineDash().length > 0 });
  P.stroke = function () { note(this); return st.apply(this, arguments); };
  P.strokeRect = function () { note(this); return sr.apply(this, arguments); };
};
async function frame(page, setup) {
  await page.evaluate(`window.__hooked || ((window.__hooked = true), (${HOOK})())`);
  return page.evaluate(`(() => { const ss = window.__ss, n = ss.op, p = n.ch1PartyNow; (${setup})(ss, n, p); const h = window.__hl; h.blur = 0; h.radial.length = 0; h.gold.length = 0; ss.drawFrame(); return { blur: h.blur, radial: h.radial.slice(), gold: h.gold.slice() }; })()`);
}
async function open(beat) {
  const o = await g.open("?beat=" + beat, PHONE);
  await sleep(1500);
  await o.page.evaluate(() => (window.requestAnimationFrame = () => 0));
  return o;
}
const oneStyle = (h, w = OUTLINE.width) => h.blur === 0 && h.gold.length > 0 && h.gold.every((s) => s.dashed && Math.abs(s.w - w) < 0.01);

{
  const { page, errors } = await open("party:P3");
  const banner = await frame(page, "(ss, n, p) => { p.glow = 1; p.flyerGlow = false; }");
  g.check("P3: the banner, while a line names it, has the one dashed line and no glow", oneStyle(banner), banner);
  const fl = await frame(page, "(ss, n, p) => { p.glow = 0; p.flyerGlow = true; }");
  g.check("P3: the flyer in Isfred's hand, while it matters, has the one dashed line and no glow", oneStyle(fl), fl);
  g.check("no page errors (P3)", errors.length === 0, errors);
}
{
  // the plant's goal outline in P2 is traced from the party's own hall picture (it drew nothing before: traced from
  // another room's picture)
  const { page, errors } = await open("party:P2");
  const gold = await page.evaluate((L) => {
    const ss = window.__ss;
    ss.op.sq.x = 300;
    ss.op.sq.y = 560;
    for (let i = 0; i < 4; i++) ss.tick(0.05);
    ss.drawFrame();
    const c = document.querySelector("canvas"),
      k = c.width / 960,
      d = c.getContext("2d").getImageData(Math.round((L.x0 - 16) * k), Math.round((L.y0 - 16) * k), Math.round((L.x1 - L.x0 + 32) * k), Math.round((L.y1 - L.y0 + 40) * k)).data;
    let n = 0;
    for (let i = 0; i < d.length; i += 4) d[i] > 240 && d[i + 1] > 190 && d[i + 1] < 220 && d[i + 2] < 90 && n++;
    return n / (k * k);
  }, hall.HALL.plants.find((q) => q.id === "middle").leaves);
  g.check("P2: the plant's goal outline is drawn round it (the one line)", gold > 150, gold);
  g.check("no page errors (P2)", errors.length === 0, errors);
}
{
  const { page, errors } = await open("party:P4");
  const goal = await frame(page, "(ss, n, p) => { p.pose = 'stand'; n.sqPose = 'stand'; n.sq.x = 600; n.sq.y = 470; for (let i = 0; i < 3; i++) ss.tick(0.05); }");
  g.check("P4: the goal outline round the flyer on the counter is the one dashed line (the new width), no glow", oneStyle(goal), goal);
  g.check("no page errors (P4)", errors.length === 0, errors);
}
{
  const { page, errors } = await open("party:P6");
  const gap = await frame(page, "(ss, n, p) => { p.shot = { phase: 'count', t: 0.2, n: 3, in: false, got: false }; }");
  const G = photo.PHOTO_ROW.squatch;
  const glowAtGap = gap.radial.filter(([x, y]) => Math.abs(x - G.x) < 4 && Math.abs(y - G.y) < 4);
  g.check("P6: the gap in the photo row is the one dashed line, with no radial glow there", glowAtGap.length === 0 && gap.blur === 0 && gap.gold.some((s) => s.dashed && s.w === OUTLINE.width), { glowAtGap, gold: gap.gold });
  g.check("no page errors (P6)", errors.length === 0, errors);
}
{
  // the dress-up is a full-screen view drawn by its own frame loop: hook it and let it draw
  const o = await g.open("?beat=party:P5", PHONE);
  await sleep(1400);
  await o.page.evaluate(() => (window.__ss.tapAt(140, 410)));
  await o.page.waitForFunction(() => window.__ss.op.act && window.__ss.op.act.verb === "OPEN", { timeout: 8000 });
  await o.page.evaluate(HOOK);
  await o.page.evaluate(() => (window.__ss.actionDown(), window.__ss.actionUp()));
  await sleep(700);
  const dress = await o.page.evaluate(() => window.__hl);
  g.check("P5: in the dress-up the shirt is marked by the one dashed line (3 screen px) and no radial glow or blur", dress.radial.length === 0 && dress.blur === 0 && dress.gold.some((s) => s.dashed && s.w === OUTLINE_SCREEN.width), { radial: dress.radial.length, blur: dress.blur, gold: dress.gold.slice(0, 4) });
  g.check("no page errors (P5)", o.errors.length === 0, o.errors);
}
{
  // the home morning: the rocket (PICK UP · rocket) and the lunch bag (the walk to it), each while it is the goal
  const { page, errors } = await open("day2");
  const { TRACE } = await import(join(root, "src", "modules", "home-morning-art.js"));
  const near = (h, b) => h.radial.filter(([x, y]) => x >= b.x0 - 40 && x <= b.x1 + 40 && y >= b.y0 - 40 && y <= b.y1 + 40);
  for (const [step, box, x, y] of [["rocket", TRACE.rocket, 300, 470], ["toBag", TRACE.bag, 600, 470]]) {
    const h = await frame(page, `(ss, n) => { n.q = []; n.cur = null; ss.ch1JumpBeat(22); const hm = window.SSQ.beat("ch1-home-morning"); hm.jump(${JSON.stringify(step)}); n.sq.x = ${x}; n.sq.y = ${y}; for (let i = 0; i < 6; i++) ss.tick(0.05); }`);
    const st = await page.evaluate(() => (window.SSQ.beat("ch1-home-morning").debug().state || {}).step);
    // the goal line is a traced picture (outline.js) drawn as an image: count its gold on the screen round the thing
    const gold = await page.evaluate((L) => {
      const c = document.querySelector("canvas"),
        k = c.width / 960,
        d = c.getContext("2d").getImageData(Math.round((L.x0 - 16) * k), Math.round((L.y0 - 16) * k), Math.round((L.x1 - L.x0 + 32) * k), Math.round((L.y1 - L.y0 + 32) * k)).data;
      let n = 0;
      for (let i = 0; i < d.length; i += 4) d[i] > 240 && d[i + 1] > 190 && d[i + 1] < 220 && d[i + 2] < 90 && n++;
      return Math.round(n / (k * k));
    }, box);
    g.check(`home morning (${step}): the goal thing has the one dashed line and no glow behind it (no radial glow, no blur)`, st === step && near(h, box).length === 0 && h.blur === 0 && gold > 60 && h.gold.every((s) => s.dashed && Math.abs(s.w - OUTLINE.width) < 0.01), { st, radial: near(h, box), blur: h.blur, gold, strokes: h.gold.slice(0, 4) });
  }
  g.check("no page errors (home morning)", errors.length === 0, errors);
}
await g.finish("highlight-style");
