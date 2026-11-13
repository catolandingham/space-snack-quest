/**
 * Measurements for the 2026-11-13 play rules, on a 375x812 phone.
 *   node tests/play-measure.mjs
 */
import { startGame } from "./game-page.mjs";
import { PHONE } from "./route-player.mjs";

const g = await startGame({ port: 8866, name: "play-measure" });
const { ctx, page, errors } = await g.open("?ch=1", PHONE);

const measured = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  const hits = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  n.q = [];
  n.cur = { k: "bub", b: { who: "sq", text: "I can see the plant from here.", style: "say" } };
  n.room = "closet";
  n.scene = "Q1";
  n.ctrl = true;
  ss.drawFrame();
  const bub = ss.lastBubble;
  const bubbleClear = !!(bub && bub.head && !hits(bub, bub.head));

  n.cur = { k: "wait", t: 9 };
  n.bt = 0;
  n.waitDone = false;
  n.q = [{ k: "do", f: () => (n.waitDone = true) }];
  for (let i = 0; i < 40; i++) ss.tick(0.05);
  const waitHeld = n.cur && n.cur.k === "wait" && n.waitDone === false;

  n.cur = null;
  n.q = [];
  n.ch1Veil = 0;
  n.cutOn = false;
  n.cur = { k: "card", text: "A quiet card.", id: "note" };
  for (let i = 0; i < 10; i++) ss.tick(0.05);
  const veil = n.ch1Veil || 0;

  n.cur = null;
  n.room = "closet";
  n.scene = "Q1";
  n.ctrl = true;
  n.sqPose = "stand";
  n.sq.x = 220;
  n.sq.y = 420;
  n.walkTo = null;
  const x0 = n.sq.x;
  const y0 = n.sq.y;
  for (let i = 0; i < 20; i++) ss.tick(0.05);
  const stayed = Math.hypot(n.sq.x - x0, n.sq.y - y0) < 3;
  const homeSpots = ss.spotsNow().map((s) => (s.id || "") + " " + (s.cap || "") + " " + (s.verb || ""));
  const homeVent = homeSpots.some((s) => /vent/i.test(s));

  n.room = "hall";
  n.scene = "QA";
  n.sqPose = "hidden";
  n.ctrl = false;
  n.cur = null;
  ss.drawFrame();
  const cv = document.querySelector("canvas");
  const ctx2 = cv.getContext("2d", { willReadFrequently: true });
  const scale = cv.width / 960;
  const pix = (x, y) => ctx2.getImageData(Math.round(x * scale), Math.round(y * scale), 1, 1).data;
  let eyeY = [];
  let plantTop = 999;
  let plantBot = 0;
  for (let y = 420; y < 580; y += 2) {
    for (let x = 360; x < 470; x += 3) {
      const p = pix(x, y);
      if (p[0] > 230 && p[1] > 230 && p[2] > 230) eyeY.push(y);
      if (p[1] > p[0] + 25 && p[1] > 80 && p[1] > p[2]) {
        plantTop = Math.min(plantTop, y);
        plantBot = Math.max(plantBot, y);
      }
    }
  }
  const eye = eyeY.length ? eyeY.reduce((a, b) => a + b, 0) / eyeY.length : 0;
  const low = plantBot > plantTop && eye > plantTop + (plantBot - plantTop) * 0.55;

  n.ctrl = true;
  n.ch1PeekReady = true;
  n.ch1Party = false;
  n.ch1Song = false;
  n.ch1Day2 = false;
  n.ch1PadOn = false;
  n.ch1Zoom = null;
  n.room = "closet";
  n.scene = "Q1";
  n.sqPose = "stand";
  ss.drawFrame();
  const yellow = [];
  for (let y = 80; y < 600; y += 2) {
    for (let x = 40; x < 920; x += 3) {
      const p = pix(x, y);
      if (p[0] > 220 && p[1] > 170 && p[2] < 90) yellow.push([x, y]);
    }
  }
  let outline = false;
  if (yellow.length > 12) {
    const cx = yellow.reduce((s, p) => s + p[0], 0) / yellow.length;
    const cy = yellow.reduce((s, p) => s + p[1], 0) / yellow.length;
    const rs = yellow.map((p) => Math.hypot(p[0] - cx, p[1] - cy));
    const min = Math.min(...rs);
    const max = Math.max(...rs);
    outline = max - min > 10;
  }

  const box = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height) };
  };
  return {
    bubbleClear,
    bub,
    waitHeld,
    veil,
    stayed,
    homeVent,
    homeSpots,
    low,
    eye: Math.round(eye),
    plantTop,
    plantBot,
    eyes: eyeY.length,
    outline,
    yellow: yellow.length,
    faces: box("#ss-face-squatch"),
    reset: box("#ss-reset"),
    act: box('[role="button"]'),
  };
});

g.check("a bubble does not cover the speaker's face", measured.bubbleClear, measured.bub);
g.check("a story wait stays up until a tap", measured.waitHeld, measured);
g.check("a card does not fade the room from black", measured.veil < 0.05, measured.veil);
g.check("the player is not walked to a goal on his own", measured.stayed, measured);
g.check("the home room's spots do not include a vent", measured.homeVent === false, measured.homeSpots);
g.check("plant eyes sit in the lower part of the leaves", measured.low, measured);
g.check("the goal hint is an outline, not a circle", measured.outline, { yellow: measured.yellow });
g.check("the face button is at least 44 pixels", measured.faces && measured.faces.w >= 44 && measured.faces.h >= 44, measured.faces);
g.check("the restart button is at least 44 pixels", measured.reset && measured.reset.w >= 44 && measured.reset.h >= 44, measured.reset);
g.check("the action button is at least 44 pixels", measured.act && measured.act.w >= 44 && measured.act.h >= 44, measured.act);
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("play-measure");
