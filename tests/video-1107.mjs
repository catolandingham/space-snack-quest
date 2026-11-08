/**
 * The 2026-11-07 Chapter 1 phone recording, checked on the current build.
 *   node tests/video-1107.mjs
 *
 * Fixes: the closet vent tuft leaves Squatch and the "Oops" line waits until it lands;
 * Mops stands up where he slept instead of popping across the closet.
 * Guards: sneaking onto the deck does not put him in a watcher or a cone; a hall catch
 * does not slide him through the walls; a bubble's fill is not tinted by a cone;
 * the hallway box does not have its own slow walk.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { startGame, sleep, root } from "./game-page.mjs";

const g = await startGame({ port: 8811, name: "video-1107" });
const outDir = join(root, "tests", "out");
mkdirSync(outDir, { recursive: true });
mkdirSync("/opt/cursor/artifacts", { recursive: true });

function savePng(name, dataUrl) {
  const buf = Buffer.from(dataUrl.slice(dataUrl.indexOf(",") + 1), "base64");
  writeFileSync(join(outDir, name), buf);
  writeFileSync(join("/opt/cursor/artifacts", name), buf);
}

const { ctx, page, errors } = await g.open("?ch=1&debug=1", { width: 1100, height: 800 });
await sleep(300);

const fur = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  const vent = { x: 822, y: 560 };
  n.q = [];
  n.cur = null;
  n.live = [];
  n.log = [];
  n.room = "closet";
  n.scene = "O2a";
  n.ctrl = true;
  n.sqPose = "stand";
  n.ventTaught = false;
  n.furVent = false;
  n.furDrift = null;
  n.furP = [];
  n.sq = { x: 780, y: 530, f: 1, walk: 0, moving: false };
  ss.game.state = "op";
  // Outside the 70px reach: nothing starts.
  n.sq.x = 822;
  n.sq.y = 485;
  ss.tick(0.2);
  const far = !n.furDrift && !n.ventTaught;
  n.sq = { x: 780, y: 530, f: 1, walk: 0, moving: false };
  const brown = (x, y) => {
    const p = document.querySelector("canvas").getContext("2d").getImageData(x, y, 1, 1).data;
    let hit = 0;
    for (let dy = -8; dy <= 8; dy += 2)
      for (let dx = -10; dx <= 10; dx += 2) {
        const q = document.querySelector("canvas").getContext("2d").getImageData(x + dx, y + dy, 1, 1).data;
        if (q[0] > 100 && q[0] < 190 && q[1] > 50 && q[1] < 140 && q[2] < 100 && q[0] > q[1] && q[1] > q[2]) hit++;
      }
    return { hit, sample: [p[0], p[1], p[2]] };
  };
  ss.tick(0.05);
  ss.drawFrame();
  const start = n.furDrift && { x: n.furDrift.x, y: n.furDrift.y, x0: n.furDrift.x0, y0: n.furDrift.y0, said: n.furDrift.said };
  const ventBefore = brown(vent.x, vent.y);
  const lineBefore = n.live.some((q) => q.text === "Oops. Fur in the vent.");
  // Mid-flight, still short of the grille, and the line has not been said.
  for (let i = 0; i < 8; i++) ss.tick(0.05);
  ss.drawFrame();
  const mid = n.furDrift && {
    x: +n.furDrift.x.toFixed(1),
    y: +n.furDrift.y.toFixed(1),
    said: n.furDrift.said,
    fromVent: +Math.hypot(n.furDrift.x - vent.x, n.furDrift.y - vent.y).toFixed(1),
    fromStart: +Math.hypot(n.furDrift.x - n.furDrift.x0, n.furDrift.y - n.furDrift.y0).toFixed(1),
  };
  const shot = document.querySelector("canvas").toDataURL("image/png");
  let guard = 0;
  while (n.furDrift && !n.furDrift.said && guard++ < 40) ss.tick(0.05);
  ss.drawFrame();
  const landed = brown(vent.x, vent.y);
  const onVent = n.furDrift && { x: +n.furDrift.x.toFixed(1), y: +n.furDrift.y.toFixed(1), said: n.furDrift.said };
  const line = (n.live.find((q) => q.text === "Oops. Fur in the vent.") || n.log.find((q) => q.text === "Oops. Fur in the vent."));
  return { far, start, ventBefore, lineBefore, mid, landed, onVent, line: line && line.text, taught: !!n.ventTaught, shot };
});
savePng("video-1107-fur.png", fur.shot);
g.check("standing 75px from the closet vent does not start the tuft", fur.far, fur);
g.check(
  "the tuft starts on Squatch, not on the vent",
  fur.start && Math.hypot(fur.start.x0 - 790, fur.start.y0 - 478) < 2 && Math.hypot(fur.start.x - 822, fur.start.y - 560) > 40 && !fur.start.said,
  fur.start,
);
g.check("the vent is not already covered in fur when the tuft leaves him", fur.ventBefore.hit < 4, fur.ventBefore);
g.check("the Oops line is not up while the tuft is still in the air", fur.lineBefore === false && fur.mid && fur.mid.said === false && fur.mid.fromVent > 20 && fur.mid.fromStart > 15, fur.mid);
g.check('when the tuft lands, the line is "Oops. Fur in the vent." and the grille has fur on it', fur.line === "Oops. Fur in the vent." && fur.taught && fur.landed.hit >= 4, { line: fur.line, landed: fur.landed, taught: fur.taught });

const mops = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.q = [];
  n.cur = null;
  n.live = [];
  n.room = "closet";
  n.scene = "O8";
  n.chair = true;
  n.moPose = "sleep";
  n.mo = { x: 640, y: 470, f: -1, walk: 0, moving: false };
  n.sqPose = "sit";
  n.ctrl = false;
  ss.game.state = "op";
  ss.sceneS1();
  let maxStep = 0;
  let prev = { x: n.mo.x, y: n.mo.y };
  let atLine = null;
  for (let i = 0; i < 80 && !atLine; i++) {
    ss.tick(0.05);
    maxStep = Math.max(maxStep, Math.hypot(n.mo.x - prev.x, n.mo.y - prev.y));
    prev = { x: n.mo.x, y: n.mo.y };
    if (n.cur && n.cur.b && n.cur.b.text === "Off to work, buddy. Stay put!")
      atLine = { x: n.mo.x, y: n.mo.y, pose: n.moPose, chair: !!n.chair };
  }
  ss.drawFrame();
  const shot = document.querySelector("canvas").toDataURL("image/png");
  return { maxStep: +maxStep.toFixed(2), atLine, shot };
});
savePng("video-1107-mops.png", mops.shot);
g.check(
  "Mops is still where he slept when he says good morning, and he did not jump there",
  mops.atLine && mops.atLine.x === 640 && mops.atLine.y === 470 && mops.atLine.pose === "stand" && mops.atLine.chair === true && mops.maxStep < 2,
  mops,
);

const entry = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.q = [];
  n.cur = null;
  n.live = [];
  n.scene = "S1";
  n.room = "closet";
  n.ctrl = true;
  n.sqPose = "stand";
  n.lunch = "held";
  n.sq = { x: 790, y: 500, f: 1, walk: 0, moving: false };
  ss.game.state = "op";
  const door = ss.spotsNow().find((s) => s && s.verb === "SNEAK OUT");
  if (!door) return { missing: true };
  door.f();
  let minD = 999;
  let inCone = false;
  let overlap = false;
  let sawDeck = false;
  for (let i = 0; i < 80; i++) {
    ss.tick(0.05);
    if (n.room !== "deck") continue;
    sawDeck = true;
    ss.drawFrame();
    const tour = ss.s1.tour || [];
    for (const t of tour) {
      const d = Math.hypot(n.sq.x - t.x, n.sq.y - t.y);
      if (d < minD) minD = d;
      if (Math.abs(n.sq.x - t.x) < 46 && n.sq.y - 80 < t.y + 30 && n.sq.y > t.y - 90) overlap = true;
    }
    for (const c of ss.conesDrawn()) {
      if (!c.len) continue;
      const dx = n.sq.x - c.ox, dy = n.sq.y - 30 - c.oy, d = Math.hypot(dx, dy);
      let a = Math.atan2(dy, dx) - c.a;
      while (a > Math.PI) a -= 2 * Math.PI;
      while (a < -Math.PI) a += 2 * Math.PI;
      if (d < c.len && Math.abs(a) < c.half) inCone = true;
    }
    if (n.ctrl && !ss.transit().walkIn && i > 30) break;
  }
  return { sawDeck, minD: Math.round(minD), inCone, overlap };
});
g.check("sneaking out the S1 door, Squatch stays clear of both watchers and their cones", entry.sawDeck && entry.minD >= 120 && !entry.inCone && !entry.overlap, entry);

const slide = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  ss.sceneS6();
  ss.drain();
  n.ctrl = true;
  n.sqPose = "stand";
  n.sq.x = 700;
  n.sq.y = 500;
  n.cur = null;
  n.q = [];
  ss.game.state = "op";
  ss.capture("hallbot");
  const during = [];
  for (let i = 0; i < 5; i++) {
    const x = n.sq.x, y = n.sq.y;
    ss.tick(0.05);
    during.push(Math.hypot(n.sq.x - x, n.sq.y - y));
  }
  const steps = [];
  for (let i = 0; i < 8; i++) {
    const x = n.sq.x, y = n.sq.y;
    if (n.cur && (n.cur.k === "card" || n.cur.k === "bub")) {
      n.bt = 1;
      ss.opTap();
    }
    ss.tick(0.05);
    steps.push(Math.round(Math.hypot(n.sq.x - x, n.sq.y - y)));
    if (!n.cur && n.ctrl) break;
  }
  const moved = steps.filter((d) => d > 2);
  return { during, steps, moved, end: { x: Math.round(n.sq.x), y: Math.round(n.sq.y) }, card: during.every((d) => d === 0) };
});
g.check(
  "a hall catch holds still under the lockup card, then appears at the checkpoint in one step",
  slide.card && slide.moved.length === 1 && slide.moved[0] > 50,
  slide,
);

const bubble = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  ss.drain();
  n.room = "hall";
  n.scene = "S6";
  n.ctrl = true;
  n.sqPose = "stand";
  n.sq.x = 400;
  n.sq.y = 500;
  ss.hall.camX = 0;
  n.cur = { k: "bub", b: { who: "tourist", text: "Just a fuzzy mop! Very fuzzy.", style: "say", ear: false } };
  n.bt = 1;
  n.q = [];
  n.live = [];
  ss.game.state = "op";
  ss.drawFrame();
  const bub = ss.lastBubble;
  const cones = ss.conesDrawn();
  const ctx2 = document.querySelector("canvas").getContext("2d");
  const pix = (x, y) => [...ctx2.getImageData(Math.round(x), Math.round(y), 1, 1).data];
  const fill = pix(bub.x + bub.w * 0.25, bub.y + bub.h * 0.55);
  // A cone drawn on top would tint this white toward yellow. Pure white means the bubble is above.
  return { fill, cones: cones.length, bub: bub && { x: Math.round(bub.x), y: Math.round(bub.y), w: Math.round(bub.w), h: Math.round(bub.h) } };
});
g.check("a speech bubble's fill is white, with the cones drawn underneath it", bubble.cones > 0 && bubble.fill[0] === 255 && bubble.fill[1] === 255 && bubble.fill[2] === 255, bubble);

const speed = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.q = [];
  n.cur = null;
  n.live = [];
  n.room = "hall";
  n.scene = "S2";
  n.ctrl = true;
  n.sqPose = "stand";
  ss.ch.mops = false;
  n.sq = { x: 200, y: 500, f: 1, walk: 0, moving: false };
  ss.hall.camX = 0;
  ss.game.state = "op";
  n.walkTo = { x: 700, y: 500, room: "hall", lx: 200, ly: 500, lt: n.T, at: n.T };
  const x0 = n.sq.x;
  for (let i = 0; i < 10; i++) ss.tick(0.05);
  const walk = n.sq.x - x0;
  n.walkTo = null;
  n.scene = "S9";
  n.sqPose = "hidden";
  n.sq.x = 400;
  n.sq.y = 500;
  ss.ch.spot = 9;
  ss.ch.sing = false;
  const h0 = n.sq.x;
  for (let i = 0; i < 10; i++) ss.tick(0.05);
  const hidden = { dx: +(n.sq.x - h0).toFixed(2), pose: n.sqPose };
  ss.ch.lureBot = { x: 1250, y: 470, home: { x: 1250, y: 470 }, look: 0, asked: false };
  ss.ch.sing = true;
  n.sqPose = "hidden";
  n.sq.x = 1050;
  n.sq.y = 566;
  const b0 = { x: ss.ch.lureBot.x, y: ss.ch.lureBot.y };
  for (let i = 0; i < 10; i++) ss.tick(0.05);
  const bot = Math.hypot(ss.ch.lureBot.x - b0.x, ss.ch.lureBot.y - b0.y);
  return { walk: +walk.toFixed(1), hidden, bot: +bot.toFixed(1) };
});
g.check("hall walking covers about 190px in a second (95px in half a second)", speed.walk > 90 && speed.walk < 100, speed);
g.check("hiding in the hallway box does not slide him along; with no direction he stays put", speed.hidden.dx === 0 && speed.hidden.pose === "hidden", speed.hidden);
g.check("the bot walking up to that box covers 60px a second, left as it is", speed.bot > 27 && speed.bot < 33, speed);

g.check("no page errors", errors.length === 0, errors);
await ctx.close();

{
  const phone = await g.open("?ch=1", { width: 375, height: 812, isMobile: true, hasTouch: true });
  await sleep(400);
  const layout = await phone.page.evaluate(() => {
    const n = window.__ss.op;
    n.q = [];
    n.cur = { k: "bub", b: { who: "sq", text: "Hello from the closet.", style: "say", ear: false } };
    n.bt = 1;
    n.scene = n.scene || "O1";
    n.room = "closet";
    window.__ss.game.state = "op";
    window.__ss.tick(0.05);
    window.__ss.drawFrame();
    const canvas = document.querySelector("canvas").getBoundingClientRect();
    const btn = document.querySelector('[role="button"]');
    const br = btn.getBoundingClientRect();
    const top = [];
    for (const id of ["ss-chapter", "ss-reset", "ss-stars", "ss-chip", "ss-face-squatch", "ss-face-mops"]) {
      const el = document.getElementById(id);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const st = getComputedStyle(el);
      if (st.display === "none" || !r.width) continue;
      if (r.top < 40) top.push({ id, top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left) });
    }
    const bub = window.__ss.lastBubble;
    return {
      verb: window.__ss.game.verb,
      btnText: (btn.textContent || "").replace(/@keyframes[\s\S]*?}/, ""),
      btnTop: Math.round(br.top),
      canvasBottom: Math.round(canvas.bottom),
      top,
      bub,
    };
  });
  g.check("on a 375px phone the green button reads NEXT and sits under the picture", layout.verb === "NEXT" && layout.btnText.includes("NEXT") && layout.btnTop >= layout.canvasBottom - 2, layout);
  await phone.page.screenshot({ path: join("/opt/cursor/artifacts", "video-1107-phone-next.png") });
  const tap = await phone.page.evaluate(() => {
    const canvas = document.querySelector("canvas").getBoundingClientRect();
    return { x: canvas.left + canvas.width * 0.5, y: canvas.top + canvas.height * 0.82 };
  });
  await phone.page.mouse.click(tap.x, tap.y);
  await sleep(200);
  const advanced = await phone.page.evaluate(() => window.__ss.op.cur == null);
  g.check("tapping the picture, under the bubble, advances the line", advanced === true, { tap, advanced });
  g.check(
    "the chapter tag, the ↺ button and Squatch's face sit in the top 40px of a 375x812 phone",
    ["ss-chapter", "ss-reset", "ss-face-squatch"].every((id) => layout.top.some((t) => t.id === id)),
    layout.top,
  );
  await phone.ctx.close();
}

await g.finish("video-1107");
