/**
 * The party hall stage (Chapter 1, walkthrough beats 3 and 5; CHAPTER-1-PROBLEMS "Stage" item).
 * Isfred stands on the stage, the ROBOTICS DELEGATION! banner hangs above it, the approved
 * "COMING SOON!" robot poster (Brian yes, 2026-11-15) stands beside it, and his peek line points at him.
 *   node tests/party-stage.mjs
 */
import { startGame, sleep } from "./game-page.mjs";

const g = await startGame({ port: 8937, name: "party-stage" });
const { page, errors } = await g.open("?ch=1", { width: 1280, height: 800, deviceScaleFactor: 1 });
await sleep(1200);
await page.evaluate(() => { const n = window.__ss.op; n.q = []; n.cur = null; n.scene = "Q1"; n.room = "closet"; n.moPose = "hidden"; n.sqPose = "stand"; n.sq.x = 820; n.sq.y = 480; n.ch1PeekReady = true; n.ctrl = true; });
await sleep(300);
await page.evaluate(() => { const o = window.__ss.offerNow(); o && o.f(); });
// game-space pixel at (x, y): the canvas is drawn at 960 wide
const px = (x, y) => page.evaluate(([x, y]) => { const c = document.querySelector("canvas"), k = c.width / 960; return Array.from(c.getContext("2d").getImageData(Math.round(x * k), Math.round(y * k), 1, 1).data).slice(0, 3); }, [x, y]);
const near = (a, hex, tol = 40) => { const b = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)); return a.every((v, i) => Math.abs(v - b[i]) <= tol); };
let state = {};
for (let i = 0; i < 60; i++) {
  state = await page.evaluate(() => { const n = window.__ss.op, c = n.cur || {}; return { r: n.room, k: c.k, t: (c.b && c.b.text) || "" }; });
  if (state.r === "hall" && state.k === "wait") break;
  await sleep(200);
}
g.check("the peek reaches the party hall", state.r === "hall", state);
await sleep(300);
g.check("the banner hangs above the stage (blue at its left end, y 134)", near(await px(262, 134), "#3478f6"), await px(262, 134));
g.check("the poster beside the stage is drawn (paper at 500, 205)", near(await px(500, 205), "#fffaf0", 20), await px(500, 205));
const guests = await page.evaluate(() => window.__ss.CH1_GUESTS.map((x) => x[2]));
g.check("Isfred is not also standing among the guests", !guests.includes("horns"), guests);
// Isfred's body: sample a column through x=360 between the banner and the stage top for any lavender
const col = [];
for (let y = 170; y <= 255; y += 3) col.push(await px(360, y));
g.check("Isfred is drawn on the stage (x 360, above the stage top)", col.some((c) => near(c, "#c9b6f2", 45)), col.slice(0, 4));
await page.click("text=NEXT").catch(() => {});
for (let i = 0; i < 20; i++) { const t = await page.evaluate(() => (window.__ss.op.cur && window.__ss.op.cur.b && window.__ss.op.cur.b.text) || ""); if (/Mmf/.test(t)) break; await sleep(200); }
await sleep(500);
const tail = await page.evaluate(() => window.__ss.bubbleAt ? window.__ss.bubbleAt("official") : null);
if (tail) g.check("Isfred's line points at the stage", tail.x > 250 && tail.x < 470 && tail.y < 262, tail);
g.check("no page errors", errors.length === 0, errors);
await g.finish("party stage");
