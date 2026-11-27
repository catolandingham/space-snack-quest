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
 *     glow behind them (home-morning.js drew a pulsing radial glow there until 2026-11-26);
 *   - the lunch sneak (Day 2): the hallway doorway, Mops at GIVE · lunch, the plate behind the counter, and during an
 *     alarm the plant and the crates have the one dashed line and no glow (lunch-sneak-art.js drawNextGlow drew a
 *     pulsing radial glow behind each until 2026-11-26).
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
    log = (window.__hl = { blur: 0, radial: [], gold: [], traced: [] });
  Object.defineProperty(P, "shadowBlur", { configurable: true, get: blur.get, set(v) { v > 0 && log.blur++; blur.set.call(this, v); } });
  const rg = P.createRadialGradient;
  P.createRadialGradient = function (x0, y0, r0, x1, y1, r1) { log.radial.push([Math.round(x1), Math.round(y1), Math.round(r1)]); return rg.apply(this, arguments); };
  const st = P.stroke,
    sr = P.strokeRect;
  // (a rounded box's place, for the gold line that strokes it: outline.js highlightBox)
  const rr = P.roundRect;
  let lastBox = null;
  P.beginPath = ((bp) => function () { lastBox = null; return bp.apply(this, arguments); })(P.beginPath);
  P.roundRect = function (x, y, w, h) { lastBox = [Math.round(x), Math.round(y), Math.round(x + w), Math.round(y + h)]; return rr.apply(this, arguments); };
  const note = (ctx) => String(ctx.strokeStyle).toLowerCase() === "#ffcf33" && log.gold.push({ w: ctx.lineWidth, dashed: ctx.getLineDash().length > 0, box: lastBox });
  P.stroke = function () { note(this); return st.apply(this, arguments); };
  // a traced outline (outline.js outlineCanvas) is a small canvas drawn as an image: where it went
  const di = P.drawImage;
  P.drawImage = function (src, x, y) { src instanceof HTMLCanvasElement && arguments.length === 3 && log.traced.push([Math.round(x), Math.round(y), src.width, src.height]); return di.apply(this, arguments); };
  P.strokeRect = function () { note(this); return sr.apply(this, arguments); };
};
async function frame(page, setup) {
  await page.evaluate(`window.__hooked || ((window.__hooked = true), (${HOOK})())`);
  return page.evaluate(`(() => { const ss = window.__ss, n = ss.op, p = n.ch1PartyNow; (${setup})(ss, n, p); const h = window.__hl; h.blur = 0; h.radial.length = 0; h.gold.length = 0; h.traced.length = 0; ss.drawFrame(); return { blur: h.blur, radial: h.radial.slice(), gold: h.gold.slice(), traced: h.traced.slice() }; })()`);
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
{
  // the lunch sneak: each goal thing while it is the goal, and the hiding places during an alarm
  const { page, errors } = await open("day2");
  const P = await import(join(root, "src", "modules", "lunch-sneak-place.js"));
  const near = (h, b) => h.radial.filter(([x, y]) => x >= b.x0 - 60 && x <= b.x1 + 60 && y >= b.y0 - 60 && y <= b.y1 + 60);
  const goldAt = (L) =>
    page.evaluate((L) => {
      const c = document.querySelector("canvas"),
        k = c.width / 960,
        d = c.getContext("2d").getImageData(Math.round((L.x0 - 16) * k), Math.round((L.y0 - 16) * k), Math.round((L.x1 - L.x0 + 32) * k), Math.round((L.y1 - L.y0 + 32) * k)).data;
      let n = 0;
      // (the line pulses between 0.7 and 1 opaque over the hall's dark wall and floor: gold-ish, not exact)
      for (let i = 0; i < d.length; i += 4) d[i] > 170 && d[i + 1] > 125 && d[i + 2] < 90 && d[i] - d[i + 2] > 120 && d[i] >= d[i + 1] && n++;
      return Math.round(n / (k * k));
    }, L);
  const jump = (step, more = "") => `(ss, n) => { n.q = []; n.cur = null; ss.ch1JumpBeat(22); window.SSQ.beat("ch1-lunch").jump(${JSON.stringify(step)}); for (let i = 0; i < 6; i++) ss.tick(0.05); ${more} }`;
  const same = (h) => h.blur === 0 && h.gold.every((q) => q.dashed && Math.abs(q.w - OUTLINE.width) < 0.01);
  const door = P.LUNCH_PLACES.door.box;
  const a = await frame(page, jump("plant", "n.sq.x = 300; n.sq.y = 560; ss.tick(0.05);"));
  const aGold = await goldAt(door);
  g.check("lunch sneak: the hallway doorway, the goal, has the one dashed line and no glow", same(a) && near(a, door).length === 0 && aGold > 40 && a.gold.length > 0, { radial: near(a, door), gold: aGold, strokes: a.gold.slice(0, 3), blur: a.blur });
  const b = await frame(page, jump("give"));
  const mo = await page.evaluate(() => window.SSQ.engine().pos("mops"));
  const round = (h, x0, y0, x1, y1) => h.gold.some((q) => q.box && q.box[0] <= x0 && q.box[1] <= y0 && q.box[2] >= x1 && q.box[3] >= y1 && q.box[2] - q.box[0] < x1 - x0 + 60);
  g.check("lunch sneak: Mops at GIVE · lunch has the one dashed line round him and no glow", same(b) && b.radial.length === 0 && round(b, mo.x - 40, mo.y - 60, mo.x + 40, mo.y), { radial: b.radial, strokes: b.gold.slice(0, 3), blur: b.blur, mo });
  // the plate: its traced line (a small picture round it), while Mops says his line (no control yet) and on the snack
  // step (the goal mark)
  const plate = { x0: P.COUNTER_SPOTS.plate.x - 50, x1: P.COUNTER_SPOTS.plate.x + 50, y0: P.COUNTER_SPOTS.plate.y - 50, y1: P.COUNTER_SPOTS.plate.y + 20 };
  const px = P.COUNTER_SPOTS.plate.x,
    py = P.COUNTER_SPOTS.plate.y;
  const plateLine = (h) => h.traced.some(([x, y, w, hh]) => x < px && x + w > px && y < py && y + hh > py - 10 && w < 220);
  const c1 = await frame(page, jump("snack", 'n.ch1Lunch.step = "one"; n.ctrl = false;'));
  g.check("lunch sneak: the plate behind the counter, while Mops says his line, has the one dashed line and no glow", same(c1) && near(c1, plate).length === 0 && plateLine(c1), { radial: near(c1, plate), traced: c1.traced, blur: c1.blur });
  const c = await frame(page, jump("snack"));
  g.check("lunch sneak: the plate behind the counter, the goal, has the one dashed line and no glow", same(c) && near(c, plate).length === 0 && plateLine(c), { radial: near(c, plate), traced: c.traced, blur: c.blur });
  // an alarm: hide in the plant, step out into the teal guest's look, and wait for the guards (as tests/lunch-sneak.mjs)
  const alarm = `(ss, n) => {
    const st = () => n.ch1Lunch, P = window.SSQ.beat("ch1-lunch").place;
    const until = (f, s) => { for (let i = 0; i < s / 0.05 && !f(); i++) ss.tick(0.05); return !!f(); };
    n.q = []; n.cur = null; ss.ch1JumpBeat(25);
    n.sq.x = 396; n.sq.y = 552; ss.tick(0.05); ss.offerNow().f(); ss.tick(0.1);
    until(() => P.watcherNow(P.WATCHERS[0], st().t).phase === "look", 8);
    n.ch1Lunch.pose = "stand"; n.sqPose = "stand"; n.sq.x = 498; n.sq.y = 520;
    until(() => !!st().alarm, 2);
    until(() => st().alarm && st().alarm.guards.length === 2 && n.ctrl && st().alarm.phase !== "calm", 8);
    window.__alarmPhase = st().alarm ? st().alarm.phase : "";
  }`;
  const d = await frame(page, alarm);
  const phase = await page.evaluate(() => window.__alarmPhase);
  const plant = P.LUNCH_PLACES.plant.thing,
    crate = P.LUNCH_PLACES.crate.box;
  // (the plant's line is its traced outline, drawn as a small picture round it; the crates' a dashed stroke)
  const plantLine = d.traced.some(([x, y, w, h]) => x <= plant.x0 && y <= plant.y0 && x + w >= plant.x1 && y + h >= plant.y1 && w < plant.x1 - plant.x0 + 60);
  g.check("lunch sneak alarm: the plant and the crates, where he can hide, have the one dashed line and no glow", !!phase && same(d) && near(d, plant).length === 0 && near(d, crate).length === 0 && plantLine && round(d, crate.x0, crate.y0, crate.x1, crate.y1), { phase, plantLine, traced: d.traced, radial: d.radial, strokes: d.gold.slice(0, 3), blur: d.blur });
  g.check("no page errors (lunch sneak)", errors.length === 0, errors);
}
await g.finish("highlight-style");
