/**
 * Every switch between Squatch and Mops in Chapter 1 is announced with a reason (Chapter 1 pass, items 2
 * and 4; the Chapter 2 checks are tests/ch2-switch.mjs).
 *   node tests/ch1-switch.mjs
 *
 * The card is the Phase 1 shape: "You are MOPS now." or "You are SQUATCH now.", then the why, word for
 * word from docs/CHAPTER-1-LINES-FOR-BRIAN.md (rows 26.x). The first switch (to Mops in S9) has no card,
 * because the zoom-in card (row 24.3) taught it; every later face tap in S9, S10 and S11 has one, and so
 * do the three switches the story makes (into S10, into S11, and when the hangar door opens). A restart
 * after a catch switches back silently, as Reset section does in Chapter 2. In the source, every
 * Chapter 1 switchTo either passes a why or is a scene set-up where the player is already Squatch.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { startGame, readLines, root } from "./game-page.mjs";
import { setState } from "./chapter-states.mjs";

const L = readLines();
const g = await startGame({ port: 8803, name: "ch1-switch" });

// Source: Chapter 1 switches with no why are only the set-ups Gh (S6), Fs (S9) and Xh (S12).
{
  const lines = ["10-ch1.js", "11-ch1-hall.js"].flatMap((f) => readFileSync(join(root, "src", "game", f), "utf8").split("\n"));
  const owner = (i) => { for (let j = i; j >= 0; j--) { const m = lines[j].match(/^\s*function ([A-Za-z0-9_$]+)\(/); if (m) return m[1]; } return ""; };
  const bare = lines.map((l, i) => [i, l]).filter(([, l]) => /switchTo\("(mops|squatch)"\)/.test(l)).map(([i]) => owner(i));
  g.check("Chapter 1 switches without a why are only the set-ups Gh, Fs and Xh", bare.every((f) => ["Gh", "Fs", "Xh"].includes(f)), bare);
  const yfs = lines.filter((l) => /\byf\(!?[01]\)|\byf\(!x\.mops\)/.test(l));
  g.check("every Chapter 1 yf call passes a why", yfs.length === 0, yfs);
}

const { page, errors } = await g.open("?ch=2");
// Plays the story queue, tapping past bubbles and panels, and returns every switch card in order.
const play = () =>
  page.evaluate(() => {
    const ss = window.__ss, n = ss.op, cards = [], seen = [];
    for (let i = 0; i < 3000 && (n.cur || n.q.length || !n.ctrl); i++) {
      const c = n.cur;
      if (c && ["bub", "card", "panel", "fb"].includes(c.k)) {
        c.k === "card" && c.id === "switch" && cards.push({ text: c.text, by: c.by, after: seen.slice(-1)[0] || "" });
        c.k === "bub" && seen.push(c.b.text);
        n.bt = 1; ss.opTap();
      } else ss.tick(0.05);
    }
    return { cards, mops: !!ss.ch.mops, scene: n.scene, ctrl: n.ctrl };
  });
const face = () => page.evaluate(() => window.__ss.picSwap());
const want = (row, who) => ({ text: `You are ${who} now.`, by: L[row] });
const same = (c, w) => !!c && c.text === w.text && c.by === w.by;

// S9: the first switch has no card; later face taps do.
await page.evaluate(setState, { kind: "ch1", call: "sceneS9", set: { op: { scene: "S9", room: "hall", sqPose: "hidden", egg: null }, ch: { sing: false, spot: 9 }, swap: false } });
await page.evaluate(() => { const n = window.__ss.op; n.taught = new Set(["switch1"]); n.sw1Done = false; });
await face();
let r = await play();
g.check("S9, the first switch (taught by the zoom-in card): no switch card, Mops in control", r.cards.length === 0 && r.mops && r.ctrl, r);
await face();
r = await play();
g.check("S9, back to Squatch: row 26.2", r.cards.length === 1 && same(r.cards[0], want("26.2", "SQUATCH")) && !r.mops, r);
await face();
r = await play();
g.check("S9, Mops again: row 26.1", r.cards.length === 1 && same(r.cards[0], want("26.1", "MOPS")) && r.mops, r);

// S9 -> S10: Mops grabs the trash half.
await page.evaluate(() => { const ss = window.__ss, n = ss.op; ss.ch.lureBot.look = 8; n.mo.x = 1300; n.mo.y = 540; const a = ss.offerNow(); a && a.verb === "GRAB" && a.f(); });
r = await play();
g.check("S9 into S10, after the slip: row 26.3", r.scene === "S10" && r.cards.length === 1 && same(r.cards[0], want("26.3", "SQUATCH")) && !r.mops, r);

// S10: face taps.
await face();
r = await play();
g.check("S10, Mops's face: row 26.4", r.cards.length === 1 && same(r.cards[0], want("26.4", "MOPS")) && r.mops, r);
await face();
r = await play();
g.check("S10, Squatch's face: row 26.5", r.cards.length === 1 && same(r.cards[0], want("26.5", "SQUATCH")) && !r.mops, r);

// S10d -> S11: Mops climbs out with both halves.
await page.evaluate(setState, { kind: "ch1", call: "sceneS10", set: { op: { scene: "S10d", room: "duct" }, ch: { notesBall: false, got2: true }, swap: true } });
await page.evaluate(() => { const ss = window.__ss, n = ss.op; n.mo.x = 140; n.mo.y = 430; const a = ss.offerNow(); a && a.verb === "EXIT" && a.f(); });
r = await play();
g.check("S10d into S11, out of the duct: row 26.6, before Mops's plan", r.scene === "S11" && r.cards.length === 1 && same(r.cards[0], want("26.6", "SQUATCH")) && r.cards[0].after === "" && !r.mops, r);

// S11: face taps, then the door.
await face();
r = await play();
g.check("S11, Mops's face: row 26.7", r.cards.length === 1 && same(r.cards[0], want("26.7", "MOPS")) && r.mops, r);
await face();
r = await play();
g.check("S11, Squatch's face: row 26.8", r.cards.length === 1 && same(r.cards[0], want("26.8", "SQUATCH")) && !r.mops, r);
await face();
await play();
await page.evaluate(() => { const ss = window.__ss, n = ss.op; ss.ch.lureBot.x = 950; ss.ch.lureBot.y = 340; ss.ch.lureBot.look = 8; n.mo.x = 1300; n.mo.y = 290; const a = ss.offerNow(); a && a.verb === "TYPE" && a.f(); });
r = await play();
g.check('S11, the door opens: row 26.9, right after "Door open! Uh oh... a fur scanner."', r.cards.length === 1 && same(r.cards[0], want("26.9", "SQUATCH")) && r.cards[0].after === "Door open! Uh oh... a fur scanner." && !r.mops, r);

// A restart after a catch is silent.
await page.evaluate(setState, { kind: "ch1", call: "sceneS9", set: { op: { scene: "S9", room: "hall" }, ch: { got1: false }, swap: true } });
await page.evaluate(() => window.__ss.capture("lure9"));
r = await play();
g.check("a restart after a catch switches back to Squatch with no switch card", r.cards.length === 0 && !r.mops && r.scene === "S9", r);

g.check("every Chapter 1 why line is a row in the lines file", ["26.1", "26.2", "26.3", "26.4", "26.5", "26.6", "26.7", "26.8", "26.9"].every((k) => !!L[k]));
g.check("no page errors", errors.length === 0, errors);
await g.finish("ch1-switch");
