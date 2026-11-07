/**
 * Zoom-in cards teach a new idea the first time it appears (Brian, 2026-11-07): the opening's
 * "This is Squatch" card technique, reused for the first hide in Chapters 1 and 2 and the first switch in
 * Chapter 1. Each card darkens the room except a spotlight on the thing, says one line (a row in
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

// Chapter 2, g1: the first hide in Chapter 2, on the crate by the pump (a fresh chapter start).
const second = await g.open("?ch=2");
let seen = null;
for (let i = 0; i < 80 && !seen; i++) {
  seen = await second.page.evaluate(() => {
    const n = window.__ss.op;
    const c = n.cur && n.cur.id === "focus" ? n.cur : n.q.find((r) => r.id === "focus");
    if (c) return { teach: c.teach, text: c.text, phase: window.__ss.ch2.phase };
    if (n.cur && (n.cur.k === "bub" || n.cur.k === "card")) { n.bt = 1; window.__ss.opTap(); }
    return null;
  });
  await sleep(120);
}
g.check("Chapter 2 g1: the first hide shows the zoom-in card on the crate with row 24.2", !!seen && seen.teach === "hide2" && seen.text === lines["24.2"] && seen.phase === "g1", seen);
g.check("every teaching line is a row in the lines file", [lines["24.1"], lines["24.2"], lines["24.3"]].every(Boolean));
g.check("no page errors", errors.length === 0 && second.errors.length === 0, [...errors, ...second.errors]);
await g.finish("zoom-cards");
