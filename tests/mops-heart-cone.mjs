/**
 * Mops's warm cone pops a heart when he sees Squatch (C14, Brian 2026-11-13: "when M sees him in cone,
 * hearts come up, when others do it's exclamation points"). A Nov 11 pass switched it off for all of
 * Chapter 1 to hide a stray heart over dress-up. This suite keeps it on in Chapter 1 and keeps the stray
 * heart away:
 *   - at home, with the player in control, Squatch in front of Mops pops a heart
 *   - Squatch behind Mops does not
 *   - a disguised Squatch, dress-up, a cut-in, a story line on screen, or a hidden Squatch: no heart
 *   - Chapter 2 still pops the heart
 *   node tests/mops-heart-cone.mjs
 */
import { startGame } from "./game-page.mjs";

const g = await startGame({ port: 8851, name: "mops-heart-cone" });

// Runs in the page. Puts Squatch in front of (or behind) Mops, applies `extra`, draws a few frames,
// and reports whether a new heart popped.
function probe({ ahead = true, extra = {} }) {
  const ss = window.__ss;
  const n = ss.op;
  n.q = [];
  n.cur = null;
  n.live = [];
  n.ctrl = true;
  n.sqPose = "stand";
  n.moPose = "stand";
  n.ch1Disguise = false;
  n.ch1Dress = null;
  n.ch1Cut = null;
  n.ch1Zoom = null;
  const f = n.mo.f >= 0 ? 1 : -1;
  n.sq.x = n.mo.x + (ahead ? 1 : -1) * f * 110;
  n.sq.y = n.mo.y;
  for (const [k, v] of Object.entries(extra)) n[k] = v;
  n.heartT = -99;
  n.sparks = (n.sparks || []).filter((d) => d.s !== "\u2665");
  for (let i = 0; i < 4; i++) ss.drawFrame();
  return {
    heart: n.heartT > -99,
    hearts: n.sparks.filter((d) => d.s === "\u2665").length,
    scene: n.scene,
    room: n.room,
    mo: { x: Math.round(n.mo.x), y: Math.round(n.mo.y), f: n.mo.f },
    sq: { x: Math.round(n.sq.x), y: Math.round(n.sq.y) },
  };
}

// Chapter 1, home (scene O1), the way ch1-playthrough reaches it.
const one = await g.open("?ch=1");
await one.page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  for (let i = 0; i < 30; i++) {
    if (n.cur && (n.cur.k === "card" || n.cur.k === "bub" || n.cur.k === "wait")) {
      n.bt = 1;
      ss.opTap();
    }
    ss.tick(0.05);
    if (n.scene === "O1" && n.ctrl && !(n.cur && (n.cur.k === "card" || n.cur.k === "bub" || n.cur.k === "wait"))) break;
  }
});

const home = await one.page.evaluate(probe, { ahead: true });
g.check("Chapter 1 home: Squatch in front of Mops pops a heart", home.heart && home.room === "closet", home);

const behind = await one.page.evaluate(probe, { ahead: false });
g.check("Chapter 1 home: Squatch behind Mops pops no heart", !behind.heart, behind);

const disguised = await one.page.evaluate(probe, { extra: { ch1Disguise: true } });
g.check("a disguised Squatch pops no heart", !disguised.heart, disguised);

const dress = await one.page.evaluate(probe, { extra: { ch1Dress: { on: true, head: "", face: "", body: "", legs: "", extra: [] } } });
g.check("dress-up pops no heart (the old stray heart)", !dress.heart && dress.hearts === 0, dress);

const cut = await one.page.evaluate(probe, { extra: { ch1Cut: { id: "test", t: 0 } } });
g.check("a cut-in pops no heart", !cut.heart, cut);

const talking = await one.page.evaluate(probe, { extra: { ctrl: false } });
g.check("no heart while a story line has control", !talking.heart, talking);

const hidden = await one.page.evaluate(probe, { extra: { sqPose: "hidden" } });
g.check("a hidden Squatch pops no heart", !hidden.heart, hidden);

// A heart already floating does not draw over dress-up.
const overlay = await one.page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.ctrl = false;
  n.ch1Dress = { on: true, head: "", face: "", body: "", legs: "", extra: [] };
  n.sparks = [{ x: 510, y: 295, t: 1.6, s: "\u2665" }];
  ss.drawFrame();
  const cv = document.querySelector("canvas[width='960']") || document.querySelector("canvas");
  const k = cv.width / 960;
  const cx = cv.getContext("2d", { willReadFrequently: true });
  let red = 0;
  for (let y = 280; y < 312; y++)
    for (let x = 494; x < 526; x++) {
      const p = cx.getImageData(Math.round(x * k), Math.round(y * k), 1, 1).data;
      if (p[0] > 200 && p[1] < 120 && p[2] < 100) red++;
    }
  n.ch1Dress = null;
  n.sparks = [];
  return { red };
});
g.check("a floating heart is not drawn on top of dress-up", overlay.red === 0, overlay);
await one.ctx.close();

// Chapter 2: the heart still works where it always did.
const two = await g.open("?ch=2");
await two.page.evaluate(() => {
  const ss = window.__ss;
  ss.sceneG0();
  for (let i = 0; i < 10; i++) ss.tick(0.05);
  ss.op.room = "diner";
});
const ch2 = await two.page.evaluate(probe, { ahead: true });
g.check("Chapter 2: Squatch in front of Mops still pops a heart", ch2.heart, ch2);

await g.finish("Mops heart cone");
