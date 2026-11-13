/**
 * Zoom-in cards teach a new idea the first time it appears (Brian, 2026-11-07): the opening's
 * "This is Squatch" card technique, reused for the first hide and the first switch in Chapter 1 (Chapter 2
 * gets no hide card: hiding was taught in Chapter 1). Each card darkens the room except a spotlight on the thing, says one line (a row in
 * docs/PHASE-3-LINES-FOR-BRIAN.md), waits for a tap, and shows once per play-through.
 *   node tests/zoom-cards.mjs
 */
import { startGame, sleep, readLines } from "./game-page.mjs";
import { setState } from "./chapter-states.mjs";

const g = await startGame({ port: 8797, name: "zoom-cards" });
const lines = readLines();
const { page, errors } = await g.open("?ch=2");
const focusNow = () =>
  page.evaluate(() => {
    const n = window.__ss.op;
    const c = n.cur && n.cur.id === "focus" ? n.cur : n.q.find((r) => r.id === "focus");
    if (!c) return null;
    window.__ss.drawFrame();
    return { teach: c.teach, text: c.text, faces: !!c.faces, current: c === n.cur };
  });

// Chapter 1, O5: the first hide, on the bed.
await page.evaluate(() => { const ss = window.__ss; ss.startOpening(); ss.drain(); ss.op.taught = null; ss.sceneO5(); });
let f = await focusNow();
g.check("Chapter 1 O5: the first hide shows the zoom-in card on the bed with row 24.1", !!f && f.teach === "hide1" && f.text === lines["24.1"], f);
await page.evaluate(() => { const ss = window.__ss; ss.drain(); ss.op.q = []; ss.op.cur = null; ss.sceneO5(); });
f = await focusNow();
g.check("Chapter 1 O5: the card shows once per play-through", !f, f);

// Chapter 1, S9: the first switch, on the faces (they stay on screen under the spotlight).
await page.evaluate(setState, { kind: "ch1", call: "sceneS9", set: { op: { scene: "S9", room: "hall", sqPose: "hidden", egg: null }, ch: { sing: false, spot: 9 }, swap: false } });
await sleep(200);
await page.evaluate(() => { const ss = window.__ss, a = ss.offerNow(); a && a.verb === "SING" && a.f(); });
await sleep(300);
f = await focusNow();
const facesShown = await page.evaluate(() => { const el = document.getElementById("ss-faces"); return !!el && getComputedStyle(el).display !== "none" && getComputedStyle(document.getElementById("ss-hud")).display !== "none"; });
g.check("Chapter 1 S9: singing for the first time shows the zoom-in card on the faces with row 24.3", !!f && f.teach === "switch1" && f.faces && f.text === lines["24.3"], f);
g.check("Chapter 1 S9: the faces stay on screen under the spotlight", facesShown);
await page.evaluate(() => window.__ss.drain());

// Chapter 2, g1: no card (hiding was taught in Chapter 1; the chip rule says goal only after the first time).
const second = await g.open("?ch=2");
let seen = null, phase = "";
for (let i = 0; i < 80 && phase !== "g1"; i++) {
  ({ seen, phase } = await second.page.evaluate((seen) => {
    const n = window.__ss.op;
    const c = n.cur && n.cur.id === "focus" ? n.cur : n.q.find((r) => r.id === "focus");
    if (n.cur && (n.cur.k === "bub" || n.cur.k === "card" || n.cur.k === "wait")) { n.bt = 1; window.__ss.opTap(); }
    return { seen: seen || (c ? c.teach : null), phase: n.ctrl && !n.cur ? window.__ss.ch2.phase : "" };
  }, seen));
  await sleep(120);
}
g.check("Chapter 2 g1: no zoom-in card for the second chapter's first hide", phase === "g1" && !seen, { phase, seen });
g.check("every teaching line is a row in the lines file", [lines["24.1"], lines["24.3"]].every(Boolean) && !lines["24.2"]);
g.check("no page errors", errors.length === 0 && second.errors.length === 0, [...errors, ...second.errors]);
await g.finish("zoom-cards");
