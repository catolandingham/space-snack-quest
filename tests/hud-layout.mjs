/**
 * The HUD over the picture (Phase 3, Brian's HUD decisions of 2026-11-07).
 * (a) At 375 by 812 (a phone) and at desktop width, in states from every chapter: no two HUD boxes overlap,
 *     every HUD box sits on the picture, and every HUD text is at least 14 CSS px.
 * (b) On the phone the picture's top edge is within 16 px of the page top.
 * (c) Who: where both characters are playable there are two faces (the active one bright) and a tap on the
 *     other face switches; elsewhere only the active face shows, smaller, in the same spot.
 * (d) The ↺ button restarts the section when held; the old "Reset section" button is gone; the sound button
 *     is in the controls row under the picture.
 * (e) The stall hint: after 60 seconds with no progress the chip shows the method line; progress brings
 *     the goal line back. Every method line is a row in docs/PHASE-3-LINES-FOR-BRIAN.md.
 *   node tests/hud-layout.mjs
 */
import { startGame, sleep, readLines } from "./game-page.mjs";
import { setState } from "./chapter-states.mjs";

const g = await startGame({ port: 8792, name: "hud-layout" });
const lines = readLines({ where: true });
const words = Object.values(lines).map((r) => r.words);

const STATES = [
  ["Chapter 1 S9, both faces", { kind: "ch1", call: "sceneS9", set: { op: { scene: "S9", room: "hall", sqPose: "stand", egg: null }, swap: false } }],
  ["Chapter 1 S12 hangar", { kind: "ch1", call: "sceneS12", set: { op: { scene: "S12", room: "hangar", sqPose: "stand" }, ch: { coolers: [false, false, false], tarp: true, crates: true }, trip: 0 } }],
  ["Chapter 2 g4 with soup (long chip)", { kind: "ch2", steps: [["set", { jar: 0, has: "soup" }], ["reset", "g4"]] }],
  ["Chapter 2 g6 on the lot (tank)", { kind: "ch2", steps: [["set", { jar: 30, has: "", fuel: true }], ["reset", "g6"]] }],
  ["Chapter 2 kitchen as Mops (both faces, glowing)", { kind: "ch2", steps: [["set", { cook: "gone" }], ["reset", "wash1"], ["set", { cook: "gone" }], ["swap", true]] }],
  ["Chapter 3 temple", { kind: "ch3", room: "temple", phase: "p3", mops: false, extra: {} }],
  ["Chapter 4 dock", { kind: "ch4", room: "port", phase: "m1", mops: false, extra: {}, found: [] }],
];
const HUD_IDS = ["ss-chapter", "ss-reset", "ss-stars", "ss-chip", "ss-count", "ss-tank", "ss-pop", "ss-face-squatch", "ss-face-mops"];

async function measure(page) {
  return page.evaluate((ids) => {
    const pic = document.querySelector("canvas").getBoundingClientRect();
    const out = [];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height || getComputedStyle(el).display === "none") continue;
      out.push({ id, x0: r.left, y0: r.top, x1: r.right, y1: r.bottom, font: parseFloat(getComputedStyle(el).fontSize), text: el.textContent });
    }
    return { boxes: out, pic: { x0: pic.left, y0: pic.top, x1: pic.right, y1: pic.bottom } };
  }, HUD_IDS);
}
const overlap = (a, b) => Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0) > 0.5 && Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0) > 0.5;

for (const [vname, viewport] of [
  ["375x812", { width: 375, height: 812, isMobile: true, hasTouch: true }],
  ["desktop 1100x800", { width: 1100, height: 800 }],
]) {
  const { ctx, page, errors } = await g.open("?ch=2", viewport);
  for (const [label, setup] of STATES) {
    await page.evaluate(setState, setup);
    await page.evaluate(() => {
      const n = window.__ss.op;
      n.stars = 1250; n.starOn = true;
      n.sparks.push({ x: 300, y: 80, t: 2.4, s: "Hidden in time! +100" });
      window.__ss.ch2.phase === "wash1" || window.__ss.ch2.phase === "g4" || (window.__ss.ch2.timer = 4);
    });
    await sleep(350);
    const m = await measure(page);
    const pairs = [];
    for (let i = 0; i < m.boxes.length; i++) for (let j = i + 1; j < m.boxes.length; j++) if (overlap(m.boxes[i], m.boxes[j])) pairs.push(m.boxes[i].id + " / " + m.boxes[j].id);
    g.check(`${vname}, ${label}: no two HUD boxes overlap`, m.boxes.length >= 4 && pairs.length === 0, { pairs, boxes: m.boxes.map((b) => [b.id, Math.round(b.x0), Math.round(b.y0), Math.round(b.x1), Math.round(b.y1)]) });
    const off = m.boxes.filter((b) => b.x0 < m.pic.x0 - 0.5 || b.x1 > m.pic.x1 + 0.5 || b.y0 < m.pic.y0 - 0.5 || b.y1 > m.pic.y1 + 0.5);
    g.check(`${vname}, ${label}: every HUD box sits on the picture`, off.length === 0, off);
    const small = m.boxes.filter((b) => b.text && b.font < 14);
    g.check(`${vname}, ${label}: every HUD text is at least 14 CSS px`, small.length === 0, small);
  }
  if (vname === "375x812") {
    const top = await page.evaluate(() => document.querySelector("canvas").getBoundingClientRect().top + window.scrollY);
    g.check("375x812: the picture's top edge is within 16 px of the page top", top <= 16, { top });
    const help = await page.evaluate(() => { const el = document.getElementById("ss-help"); return el ? parseFloat(getComputedStyle(el).fontSize) : 0; });
    g.check("375x812: the help line is at least 14 CSS px", help >= 14, { help });
  }
  // (d) Controls: no Reset section button; the sound button is under the picture.
  const ctl = await page.evaluate(() => {
    const pic = document.querySelector("canvas").getBoundingClientRect();
    const snd = document.getElementById("ss-sound");
    const r = snd && snd.getBoundingClientRect();
    return {
      oldReset: [...document.querySelectorAll("button")].some((b) => /Reset section/.test(b.textContent || "") || b.getAttribute("aria-label") === "Reset section"),
      sound: !!snd, under: !!r && r.top >= pic.bottom - 1, insideHud: !!(snd && snd.closest("#ss-hud")),
    };
  });
  g.check(`${vname}: the big "Reset section" button is gone`, !ctl.oldReset, ctl);
  g.check(`${vname}: the sound button sits in the controls row under the picture`, ctl.sound && ctl.under && !ctl.insideHud, ctl);
  g.check(`${vname}: no page errors`, errors.length === 0, errors);
  await ctx.close();
}

// (c) Faces and (d) the ↺ hold, on a phone.
{
  const { ctx, page, errors } = await g.open("?ch=2", { width: 375, height: 812, isMobile: true, hasTouch: true });
  const faces = () => page.evaluate(() => {
    const f = (id) => { const el = document.getElementById(id); const st = el && getComputedStyle(el); return el && st.display !== "none" ? { w: Math.round(el.getBoundingClientRect().width), op: parseFloat(st.opacity), right: Math.round(el.getBoundingClientRect().right) } : null; };
    return { sq: f("ss-face-squatch"), mo: f("ss-face-mops"), mops: window.__ss.ch.mops };
  });
  await page.evaluate(setState, STATES[4][1]);
  await sleep(300);
  let s = await faces();
  g.check("kitchen as Mops: two faces, Mops bright and Squatch dim", !!(s.sq && s.mo && s.mo.op === 1 && s.sq.op < 1 && s.mops), s);
  await page.evaluate(() => document.getElementById("ss-face-squatch").dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })));
  await sleep(200);
  s = await faces();
  g.check("a tap on Squatch's face switches to Squatch", !!(s.sq && s.sq.op === 1 && !s.mops), s);
  await page.evaluate(setState, STATES[3][1]);
  await sleep(300);
  const one = await faces();
  g.check("on the lot (no switching): only Squatch's face shows, smaller, in the same corner", !!(one.sq && !one.mo && one.sq.w < s.sq.w && Math.abs(one.sq.right - s.sq.right) <= 2), { one, two: s });

  // The ↺ hold restarts the section.
  await page.evaluate(() => { const ss = window.__ss; ss.ch2.resetHold = null; ss.op.sq.x = 700; });
  await page.evaluate(() => document.getElementById("ss-reset").dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })));
  await sleep(1000);
  const held = await page.evaluate(() => ({ fired: !!(window.__ss.ch2.resetHold && window.__ss.ch2.resetHold.fired), x: Math.round(window.__ss.op.sq.x) }));
  await page.evaluate(() => document.getElementById("ss-reset").dispatchEvent(new PointerEvent("pointerup", { bubbles: true })));
  g.check("holding ↺ restarts the section", held.fired && held.x !== 700, held);

  // (e) The stall hint.
  await page.evaluate(setState, STATES[3][1]);
  await sleep(3600); // the "★ = points for finds" hint has had its 3.5 seconds
  const goal = await page.evaluate(() => document.getElementById("ss-chip").textContent);
  await page.evaluate(() => window.__ss.stallFor(61));
  await sleep(250);
  const method = await page.evaluate(() => ({ chip: document.getElementById("ss-chip").textContent, line: window.__ss.methodLine() }));
  g.check("after 60 s with no progress the chip shows the method line", method.chip === method.line && method.line !== goal && method.line !== "", { goal, method });
  await page.evaluate(() => { window.__ss.op.found.add("progress-test"); });
  await sleep(250);
  const back = await page.evaluate(() => document.getElementById("ss-chip").textContent);
  g.check("progress brings the goal line back", back === goal, { back, goal });
  await page.evaluate(() => { window.__ss.stallFor(30); });
  await sleep(250);
  g.check("30 s without progress is not a stall", (await page.evaluate(() => document.getElementById("ss-chip").textContent)) === goal);
  const all = await page.evaluate(() => window.__ss.METHOD_LINES);
  const missing = all.filter((t) => !words.includes(t));
  g.check("every method line is a row in the lines file, word for word", missing.length === 0, missing);
  g.check("every method line starts with Squatch: or Mops:", all.every((t) => /^(Squatch|Mops): /.test(t)), all);
  g.check("faces, ↺ and stall: no page errors", errors.length === 0, errors);
  await ctx.close();
}
await g.finish("hud-layout");
