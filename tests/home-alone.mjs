/**
 * Squatch home alone after Mops leaves for work, before "That evening…" (docs/BRIAN-ASKS-OPEN.md "Build next"
 * item 1, the morning plan's PR 3, with Brian's answers of 2026-11-23). Played on a phone (375x812) by touch.
 * - Once Mops is gone the kid has control (no "That evening…" yet); the chip reads "Squatch: do your homework"
 *   and only the desk gets the yellow outline. Nothing moves on by itself (40 seconds later, still home alone).
 * - The calendar (LOOK · calendar) opens already bitten: the nibble is out of the paper before any tap, and
 *   touching the printed snack cake changes nothing.
 * - OPEN · closet: the door opens (the locked open-closet picture, unchanged) with the small blue G box on the
 *   closet floor, drawn like Brian's approved picture (docs/approved-art/closet/); Squatch stands clear of it
 *   and says "Mops's costumes. And my Guardian Box."; the line waits for a tap; the tap shuts the door and the
 *   calendar is offered again (Q7).
 * - Brian's feedback of 2026-11-23 on PR #84: each "VERB · thing" label sits next to the thing it names and
 *   covers neither Squatch nor that thing nor another home object; the desk's dashed outline never draws over
 *   Squatch; no purple bar across the bed in front of Squatch; the homework close-up's Squatch has thin outlines
 *   in the room's colours; FLOP · bed is a real lying-down pose (14A).
 * - FLOP · bed: Squatch flops onto the bed, lies down on it, and hops back off without jumping between frames, then says
 *   "Not sleepy anymore." (waits for a tap), then control is back.
 * - DO · homework: straight into the homework cutaway (no pop-up first): picture 1 Squatch at the desk, picture
 *   2 the sheet with its words from the lines file; no "tap ▸" cue (Brian 18a). Picture 1 has no words and nothing
 *   to tap, so it plays by itself and moves on within 4 seconds (Brian 30a, 2026-11-24); the sheet has words, so
 *   it waits for a tap with NEXT; then "That evening…" and the peek goal.
 * - Every action reads "VERB · thing" from the lines file. Hold ↺ at home: still home alone, door shut.
 *   node tests/home-alone.mjs
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { startGame, sleep, toHomeAlone } from "./game-page.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { HOME_ALONE_LINES } = await import(pathToFileURL(join(root, "src", "modules", "home-alone-lines.js")).href);
const L = Object.fromEntries(HOME_ALONE_LINES.map((l) => [l.id, l.text]));
const APPROVED = "data:image/png;base64," + readFileSync(join(root, "docs", "approved-art", "closet", "closet-gbox-approved-2026-11-23.png")).toString("base64");
const g = await startGame({ port: 8973, name: "home-alone" });
// 14A: the close-up Squatch (src/modules/squatch-art.js) keeps the room Squatch's look: same colours and sizes
// as the engine's (m5 in src/game/60-frame-draw.js).
{
  const { SQUATCH_LOOK } = await import(pathToFileURL(join(root, "src", "modules", "squatch-art.js")).href);
  const src = readFileSync(join(root, "src", "game", "60-frame-draw.js"), "utf8");
  const m5 = (src.match(/m5 = \{([\s\S]*?)\}/) || [])[1] || "";
  const differ = Object.entries(SQUATCH_LOOK).filter(([k, v]) => !new RegExp(`\\b${k}: ${typeof v === "string" ? `"${v}"` : v.toString().replace(".", "\\.")},`).test(m5));
  g.check("the close-up Squatch has the room Squatch's colours and sizes", m5.length > 0 && differ.length === 0, differ);
  // At the room's size and outline (scale 3, outline 2 units) the face mask and smile lines are the engine's
  // (wV(q.mask, 1.5) and the smile's lineWidth 1.1, in his units).
  const { drawSquatchArt } = await import(pathToFileURL(join(root, "src", "modules", "squatch-art.js")).href);
  const noop = () => {};
  const fake = new Proxy({}, { get: (t, k) => (k in t ? t[k] : noop), set: (t, k, v) => ((t[k] = v), true) });
  const art = drawSquatchArt(fake, 0, 0, 3, { line: 6 });
  const engineMask = /wV\(q\.mask, 1\.5\)/.test(src),
    engineSmile = /e\.lineWidth = 1\.1\)\);\s*for \(let Qe of \[-1, 1\]\)/.test(src) || /\(e\.lineWidth = 1\.1\), e\.stroke\(\)/.test(src);
  g.check("at the room's size its face mask and smile lines match the engine's (1.5 and 1.1 units)", engineMask && engineSmile && Math.abs(art.lines.mask - 4.5) < 0.01 && Math.abs(art.lines.face - 3.3) < 0.01, { art: art.lines, engineMask, engineSmile });
}
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 };

const { page, errors } = await g.open("?ch=1", PHONE);
const canvasBox = await page.evaluate(() => {
  const r = document.querySelector("canvas").getBoundingClientRect();
  return { x: r.x, y: r.y, w: r.width, h: r.height };
});
const tapAt = async (x, y) => {
  await page.touchscreen.touchStart(canvasBox.x + (x / 960) * canvasBox.w, canvasBox.y + (y / 640) * canvasBox.h);
  await sleep(40);
  await page.touchscreen.touchEnd();
};
const st = () =>
  page.evaluate(() => {
    const ss = window.__ss,
      n = ss.op,
      c = n.cur;
    const b = document.querySelector('[role="button"]');
    const btn = b
      ? [...b.childNodes]
          .filter((x) => x.nodeType === 3 || (x.nodeType === 1 && x.tagName !== "STYLE"))
          .map((x) => x.textContent)
          .join("")
          .trim()
          .replace(/^!/, "")
      : "";
    const r = b && b.getBoundingClientRect();
    return {
      k: c ? c.k : "",
      who: c && c.b ? c.b.who : "",
      text: c ? (c.b ? c.b.text : c.text || "") : "",
      id: c ? c.id || "" : "",
      panel: c && c.panel !== undefined ? c.panel : null,
      ctrl: !!n.ctrl,
      chip: ss.chipNow() || "",
      btn,
      btnAt: r ? [r.x + r.width / 2, r.y + r.height / 2] : null,
      pose: n.sqPose,
      moPose: n.moPose,
      wardrobe: n.wardrobe,
      sq: [n.sq.x, n.sq.y, n.sq.f],
      step: n.ch1Morning ? n.ch1Morning.step : "",
      spots: (ss.spotsNow() || []).filter((s) => s.when !== false).map((s) => s.id + "=" + s.verb + " · " + s.cap),
      cal: !!n.ch1Calendar,
      peek: ((window.SSQ.beat("ch1-party").now() || {}).scene === "P1"),
    };
  });
const stillAfter6s = () =>
  page.evaluate(() => {
    const ss = window.__ss,
      n = ss.op,
      c = n.cur;
    if (!c) return false;
    const mark = {};
    c.__mark = mark;
    for (let i = 0; i < 60; i++) ss.tick(0.1);
    return n.cur === c && n.cur.__mark === mark;
  });
const pressButton = async () => {
  const s = await st();
  await page.touchscreen.tap(s.btnAt[0], s.btnAt[1]);
  await sleep(350);
};
// Taps the floor at (x, y) until the action button offers `words` (or gives up).
async function walkTo(x, y, words) {
  let s = await st();
  for (let i = 0; i < 40 && s.btn !== words; i++) {
    if (i % 8 === 0) await tapAt(x, y);
    await sleep(200);
    s = await st();
  }
  return s;
}

// ---------- Home alone ----------
const chip = await toHomeAlone(page);
await sleep(300);
let s = await st();
g.check("once Mops is gone the kid has control, no card yet", s.ctrl && !s.k && s.moPose === "hidden" && s.step === "home", s);
g.check("the chip reads: Squatch: do your homework", chip === L["chip-homework"] && s.chip === L["chip-homework"], { chip, now: s.chip });
for (const [id, words] of [
  ["homework", L["button-homework"]],
  ["closet", L["button-closet"]],
  ["bed", L["button-bed"]],
  ["home-calendar", "LOOK · calendar"],
])
  g.check(`home alone offers ${words}`, s.spots.includes(id + "=" + words), s.spots);
// Only the desk is outlined, wherever Squatch stands.
const rings = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op,
    out = [];
  for (const [x, y] of [
    [250, 574],
    [140, 390],
    [320, 480],
    [700, 450],
  ]) {
    n.sq.x = x;
    n.sq.y = y;
    n.lastRing = null;
    ss.tick(0.02);
    ss.drawFrame();
    out.push(n.lastRing ? { id: n.lastRing.id, box: n.lastRing.box } : null);
  }
  n.sq.x = 250;
  n.sq.y = 574;
  ss.tick(0.02);
  return out;
});
g.check("only the desk gets the yellow outline, wherever Squatch stands", rings.every((r) => r && r.id === "homework" && r.box.x0 < 410 && r.box.x1 > 510 && r.box.y0 < 250), rings);
// Brian 2026-11-23: "the places that pop up kind of overlap in weird ways". Each "VERB · thing" label sits next
// to the thing it names and covers neither Squatch, nor that thing, nor another home object. The boxes are read
// off the locked home picture v6 (game positions), here in the test, not taken from the game's code.
const HOME = {
  closet: { x0: 36, x1: 180, y0: 193, y1: 345 },
  calendar: { x0: 99, x1: 167, y0: 196, y1: 279 },
  desk: { x0: 403, x1: 515, y0: 245, y1: 345 },
  bed: { x0: 84, x1: 286, y0: 395, y1: 545 },
  tv: { x0: 545, x1: 705, y0: 135, y1: 238 },
  bucket: { x0: 536, x1: 596, y0: 500, y1: 571 },
  poster: { x0: 834, x1: 914, y0: 244, y1: 324 },
  speaker: { x0: 856, x1: 893, y0: 162, y1: 203 },
};
const hit = (a, b) => a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;
const gap = (a, b) => Math.max(0, a.x0 - b.x1, b.x0 - a.x1, a.y0 - b.y1, b.y0 - a.y1);
const labels = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op,
    out = {};
  for (const id of ["homework", "closet", "bed", "home-calendar"]) {
    const sp = (ss.spotsNow() || []).find((x) => x.id === id);
    if (!sp) continue;
    n.sq.x = sp.x;
    n.sq.y = sp.y;
    n.walkTo = null;
    ss.tick(0.02);
    n.lastCap = null;
    ss.drawFrame();
    out[id] = { sq: [n.sq.x, n.sq.y], act: n.act ? n.act.verb + " · " + n.act.cap : "", cap: n.lastCap };
  }
  n.sq.x = 250;
  n.sq.y = 574;
  ss.tick(0.02);
  return out;
});
for (const [id, thing] of [
  ["homework", "desk"],
  ["closet", "closet"],
  ["bed", "bed"],
  ["home-calendar", "calendar"],
]) {
  const l = labels[id],
    box = l && l.cap && l.cap.box;
  const sq = l && { x0: l.sq[0] - 56, x1: l.sq[0] + 56, y0: l.sq[1] - 150, y1: l.sq[1] + 6 };
  const covers = box ? Object.entries(HOME).filter(([k, b]) => hit(box, b)).map(([k]) => k) : ["no label"];
  // (Brian #110, 2026-11-27: no "VERB · thing" words beside things in Chapter 1; the dashed gold line alone, cap-place.js THING_WORDS)
  g.check(`${l && l.act}: no words are drawn beside the ${thing} (the gold line alone, #110)`, !!l && !!l.act && !box, { act: l && l.act, box });
}
{
  // (the control: the rule is Chapter 1's alone; Chapter 2's scenes still get words beside things)
  const rule = await page.evaluate(() => ({ home: window.SSQ.noThingWords(window.__ss.op.scene), ch2: window.SSQ.noThingWords("G1"), ch3: window.SSQ.noThingWords("P1") }));
  g.check("#110 applies in Chapter 1 and not in Chapters 2 and 3 (outside the party)", rule.home === true && rule.ch2 === false && rule.ch3 === false, rule);
}
// Brian: "The dash outline drawing over him doesn't work." Squatch at the desk: no outline yellow on him.
const overHim = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op;
  n.sq.x = 459;
  n.sq.y = 385;
  ss.tick(0.02);
  ss.drawFrame();
  const cv = document.querySelector("canvas"),
    k = cv.width / 960,
    px = cv.getContext("2d").getImageData(0, 0, cv.width, cv.height).data;
  const yellow = (x, y) => {
    const i = (Math.round(y * k) * cv.width + Math.round(x * k)) * 4;
    return Math.abs(px[i] - 255) + Math.abs(px[i + 1] - 207) + Math.abs(px[i + 2] - 51) < 60;
  };
  let on = 0,
    off = 0;
  for (let y = 230; y < 360; y += 1 / k)
    for (let x = 390; x < 530; x += 1 / k) {
      const inSq = x > 459 - 56 && x < 459 + 56 && y > 385 - 150;
      yellow(x, y) && (inSq ? on++ : off++);
    }
  n.sq.x = 250;
  n.sq.y = 574;
  ss.tick(0.02);
  return { on, off, ring: n.lastRing && n.lastRing.id };
});
g.check("the desk's dashed outline is drawn, but never over Squatch standing at the desk", overHim.ring === "homework" && overHim.off > 20 && overHim.on === 0, overHim);
const idle = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op;
  for (let i = 0; i < 400; i++) ss.tick(0.1);
  return { ctrl: n.ctrl, cur: n.cur ? n.cur.k : "", step: n.ch1Morning && n.ch1Morning.step };
});
g.check("nothing moves on by itself (40 seconds later, still home alone with control)", idle.ctrl && !idle.cur && idle.step === "home", idle);

// ---------- The calendar, already bitten ----------
await tapAt(179, 214);
await sleep(400);
s = await st();
g.check("tapping the calendar opens its close-up", s.cal, s);
const biteBefore = await page.evaluate(() => {
  window.__ss.drawFrame();
  const cv = document.querySelector("canvas"),
    k = cv.width / 960,
    ctx = cv.getContext("2d");
  // The nibble out of the paper's right edge, beside the snack cake row (the same spots tests/calendar-closeup.mjs uses).
  const px = (x, y) => [...ctx.getImageData(Math.round(x * k), Math.round(y * k), 1, 1).data].slice(0, 3);
  return { edge: px(808, 390), deep: px(798, 391), pie: [...ctx.getImageData(Math.round(560 * k), Math.round(350 * k), Math.round(64 * k), Math.round(70 * k)).data] };
});
const nibbled = (p) => p[0] < 220 && p[1] < 220 && p[2] < 220;
g.check("the calendar is already bitten before any tap (Brian: it should just have a bite out already)", nibbled(biteBefore.edge) && nibbled(biteBefore.deep), biteBefore);
await tapAt(592, 385);
await sleep(900);
const pieAfter = await page.evaluate(() => {
  window.__ss.drawFrame();
  const cv = document.querySelector("canvas"),
    k = cv.width / 960;
  return [...cv.getContext("2d").getImageData(Math.round(560 * k), Math.round(350 * k), Math.round(64 * k), Math.round(70 * k)).data];
});
// The paw follows the finger, so compare once it has gone back: count pixels that changed a lot.
const changed = pieAfter.reduce((a, v, i) => a + (Math.abs(v - biteBefore.pie[i]) > 40 ? 1 : 0), 0);
g.check("touching the printed snack cake takes no bite (nothing on the calendar changes)", changed < 40, changed);
await tapAt(880, 540);
await sleep(400);
s = await st();
g.check("X closes the calendar; still home alone", !s.cal && s.ctrl && s.step === "home", s);

// ---------- The closet ----------
s = await walkTo(130, 385, L["button-closet"]);
g.check("at the closet the action button reads OPEN · closet", s.btn === L["button-closet"], s);
await pressButton();
for (let i = 0; i < 30 && !(await st()).k; i++) await sleep(150);
s = await st();
g.check("OPEN · closet opens the door and Squatch says his line, word for word", s.wardrobe === "open" && s.k === "bub" && s.who === "sq" && s.text === L["sq-closet"], s);
const box = await page.evaluate(async (approvedUrl) => {
  const ss = window.__ss;
  ss.drawFrame();
  const cv = document.querySelector("canvas"),
    k = cv.width / 960;
  const load = (src) =>
    new Promise((ok, no) => {
      const im = new Image();
      im.onload = () => ok(im);
      im.onerror = no;
      im.src = src;
    });
  const [approved, plain] = await Promise.all([load(approvedUrl), load("docs/locked-rooms/home-room-empty-open-v6.png")]);
  // The box's area in game positions (x 114.75 to 153.75, y 310 to 338), with a little room round it.
  const x0 = Math.round(108 * k),
    y0 = Math.round(304 * k),
    w = Math.round(52 * k),
    h = Math.round(40 * k);
  const game = cv.getContext("2d").getImageData(x0, y0, w, h).data;
  const as = (im) => {
    const o = document.createElement("canvas");
    o.width = cv.width;
    o.height = cv.height;
    const c = o.getContext("2d");
    c.drawImage(im, 0, 0, cv.width, cv.height);
    return c.getImageData(x0, y0, w, h).data;
  };
  const a = as(approved),
    p = as(plain);
  const diff = (u, v) => {
    let d = 0;
    for (let i = 0; i < u.length; i += 4) d += Math.abs(u[i] - v[i]) + Math.abs(u[i + 1] - v[i + 1]) + Math.abs(u[i + 2] - v[i + 2]);
    return d / (u.length / 4) / 3;
  };
  let blue = 0;
  for (let i = 0; i < game.length; i += 4) blue += Math.abs(game[i] - 52) + Math.abs(game[i + 1] - 120) + Math.abs(game[i + 2] - 246) < 30 ? 1 : 0;
  return { toApproved: diff(game, a), toPlain: diff(game, p), approvedVsPlain: diff(a, p), blue, area: game.length / 4 };
}, APPROVED);
g.check("the G box is drawn on the closet floor like Brian's approved picture", box.toApproved < 12 && box.toPlain > box.approvedVsPlain * 0.6 && box.blue > box.area * 0.3, box);
g.check("Squatch stands clear of the G box while he names it", s.sq[0] - 40 > 160, s.sq);
g.check("the closet line waits for a tap", await stillAfter6s(), s);
await tapAt(480, 330);
await sleep(400);
s = await st();
g.check("tapping the line away shuts the door and gives control back", s.wardrobe === "closed" && !s.k && s.ctrl && s.step === "home", s);
g.check("with the door shut the calendar is offered again", s.spots.some((x) => x.startsWith("home-calendar=")), s.spots);

// ---------- The bed ----------
s = await walkTo(315, 480, L["button-bed"]);
g.check("beside the bed the action button reads FLOP · bed", s.btn === L["button-bed"], s);
await page.touchscreen.tap(s.btnAt[0], s.btnAt[1]);
const flop = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op,
    beat = window.SSQ.beat("ch1-morning"),
    path = [];
  let lay = null,
    drawnTwice = false;
  for (let i = 0; i < 600 && !(n.cur && n.cur.k === "bub"); i++) {
    ss.tick(1 / 60);
    // Where his drawing is: the module draws him while he flops (feet x, y and the angle he is turned by);
    // otherwise he stands at his feet, upright.
    const f = beat.debug().flop;
    if (f && n.sqPose === "stand") drawnTwice = true;
    path.push(f ? [f.x, f.y, f.a] : [n.sq.x, n.sq.y, 0]);
    if (f && Math.abs(f.a) > 1.4 && !lay) {
      ss.drawFrame();
      lay = { ...f, box: f.box };
    }
  }
  let maxStep = 0,
    maxTurn = 0;
  for (let i = 1; i < path.length; i++) {
    maxStep = Math.max(maxStep, Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]));
    maxTurn = Math.max(maxTurn, Math.abs(path[i][2] - path[i - 1][2]));
  }
  return { frames: path.length, maxStep, maxTurn, lay, drawnTwice, text: n.cur && n.cur.b ? n.cur.b.text : "", pose: n.sqPose, hop: n.hopOut };
});
g.check("FLOP · bed: Squatch lies down on the bed (turned on his side, wider than tall, on the mattress)", !!flop.lay && flop.lay.box.x1 - flop.lay.box.x0 > flop.lay.box.y1 - flop.lay.box.y0 && flop.lay.box.x0 > 80 && flop.lay.box.x1 < 300 && flop.lay.box.y1 < 445, flop.lay);
g.check("the flop and the hop off have no jump between frames, and he is never drawn twice", flop.maxStep < 8 && flop.maxTurn < 0.15 && !flop.drawnTwice && flop.hop < 0, flop);
g.check('then he says "Not sleepy anymore." standing', flop.text === L["sq-bed"] && flop.pose === "stand", flop);
g.check("the bed line waits for a tap", await stillAfter6s());
await tapAt(480, 330);
await sleep(400);
s = await st();
g.check("then control is back, still home alone", !s.k && s.ctrl && s.step === "home", s);

// ---------- Hold ↺ at home ----------
const restart = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op;
  ss.resetHold(true);
  for (let i = 0; i < 20; i++) ss.tick(0.05);
  ss.resetHold(false);
  for (let i = 0; i < 4; i++) ss.tick(0.05);
  return { k: n.cur ? n.cur.k : "", step: n.ch1Morning ? n.ch1Morning.step : "", moPose: n.moPose, wardrobe: n.wardrobe, chip: ss.chipNow(), ctrl: n.ctrl };
});
g.check("↺ at home keeps Squatch home alone (Mops stays gone, door shut, homework goal)", restart.step === "home" && restart.moPose === "hidden" && restart.wardrobe === "closed" && restart.chip === L["chip-homework"] && restart.ctrl, restart);

// ---------- The homework ----------
s = await walkTo(459, 380, L["button-homework"]);
g.check("at the desk the action button reads DO · homework", s.btn === L["button-homework"], s);
await page.evaluate(() => {
  window.__printed = new Set();
  const draw = CanvasRenderingContext2D.prototype.fillText;
  CanvasRenderingContext2D.prototype.fillText = function (text, ...args) {
    window.__printed.add(String(text));
    return draw.call(this, text, ...args);
  };
});
await pressButton();
await sleep(200);
s = await st();
g.check("DO · homework goes straight to the homework cutaway (no pop-up first)", s.k === "cutaway" && s.id === "homework" && s.panel === 0, s);
const cut = [];
for (let i = 0; i < 2; i++) {
  s = await st();
  if (s.k !== "cutaway") break;
  const info = await page.evaluate(() => {
    window.__ss.drawFrame();
    const printed = [...window.__printed];
    return { last: window.SSQ.cutaway.last(), cue: printed.some((t) => /^tap\b/i.test(t)), printed };
  });
  if (s.panel === 0) {
    // Brian 30a: no words, nothing to tap: it plays by itself (a tap does not skip it).
    const alone = await page.evaluate(() => {
      const ss = window.__ss,
        n = ss.op,
        c = n.cur,
        el0 = c.el || 0;
      ss.opTap();
      const skipped = n.cur !== c;
      let t = 0;
      for (; t < 8 && n.cur === c; t += 0.05) ss.tick(0.05);
      ss.tick(0.05);
      return { skipped, t: el0 + t, next: n.cur ? n.cur.k + ":" + n.cur.panel : "" };
    });
    cut.push({ panel: s.panel, btn: s.btn, alone, ...info });
    // Let a frame or two draw the sheet (the button's word changes on the next frame).
    await sleep(250);
    continue;
  }
  cut.push({ panel: s.panel, btn: s.btn, still: await stillAfter6s(), ...info });
  await tapAt(480, 330);
  await sleep(400);
}
g.check("the homework cutaway has two full-screen pictures, in order", cut.length === 2 && cut.every((c, i) => c.panel === i && c.last && c.last.id === "homework" && c.last.full === true), cut.map((c) => c.last));
g.check('no "tap ▸" cue on either picture (Brian 18a)', cut.length === 2 && cut.every((c) => !c.cue), cut.map((c) => c.cue));
g.check(
  "Brian 30a: picture 1 (no words, nothing to tap) plays by itself, moves on to the sheet after 2 to 4 seconds, a tap does not skip it, and the button does not say NEXT",
  !!cut[0] && !!cut[0].alone && cut[0].alone.t >= 2 && cut[0].alone.t <= 4 && cut[0].alone.next === "cutaway:1" && !cut[0].alone.skipped && !/NEXT/.test(cut[0].btn),
  cut[0] && [cut[0].alone, cut[0].btn],
);
g.check("picture 2 (the sheet, words to read) waits for a tap with NEXT on the button", !!cut[1] && cut[1].still && /NEXT$/.test(cut[1].btn), cut[1] && [cut[1].still, cut[1].btn]);
g.check("picture 1 shows Squatch at the desk with his pencil", !!cut[0] && !!cut[0].last.squatch && cut[0].last.pencil === true, cut[0] && cut[0].last);
// 14A: thin outlines like the room's Squatch at his size (the beard close-up's rule: 5 px or less).
g.check("picture 1: Squatch's outlines are thin (5 px or less), not scaled up", !!cut[0] && cut[0].last.squatch.outline > 0 && cut[0].last.squatch.outline <= 5, cut[0] && cut[0].last.squatch);
{
  const want = ["sheet-heading", "sheet-name", "sheet-subject", "sheet-sum", "sheet-take"].map((id) => L[id]);
  const printed = (cut[1] && cut[1].printed) || [];
  g.check("picture 2 is the sheet, its words from the lines file (I SWEATY, Name: Squatch, ...)", want.every((w) => printed.includes(w)), { want, printed: printed.slice(-20) });
  g.check("the sheet has the muddy paw print", !!cut[1] && cut[1].last.paw === true, cut[1] && cut[1].last);
}
s = await st();
g.check('then the "That evening…" card', s.k === "card" && /^That evening/.test(s.text), s);
g.check("the card waits for a tap", await stillAfter6s());
await tapAt(480, 330);
for (let i = 0; i < 20 && !(await st()).ctrl; i++) await sleep(150);
s = await st();
g.check("then the evening: the peek goal, the home-alone part is over", s.ctrl && s.peek && /peek out the door/.test(s.chip) && s.step === "", s);
g.check("no page errors", errors.length === 0, errors);

// ---------- Hold ↺ in the middle of each thing, and after a ↺ while Mops walked out ----------
{
  const R = await g.open("?ch=1", PHONE);
  const hold = () =>
    R.page.evaluate(() => {
      const ss = window.__ss,
        n = ss.op;
      ss.resetHold(true);
      for (let i = 0; i < 20; i++) ss.tick(0.05);
      ss.resetHold(false);
      for (let i = 0; i < 4; i++) ss.tick(0.05);
      return { k: n.cur ? n.cur.k : "", step: n.ch1Morning ? n.ch1Morning.step : "", look: n.ch1Morning ? n.ch1Morning.look : "", wardrobe: n.wardrobe, pose: n.sqPose, lift: n.sqLift || 0, moPose: n.moPose, chip: ss.chipNow(), ctrl: n.ctrl, sq: [n.sq.x, n.sq.y] };
    });
  const home = (r) => r.step === "home" && !r.look && !r.k && r.ctrl && r.wardrobe === "closed" && r.pose === "stand" && !r.lift && r.moPose === "hidden" && r.chip === L["chip-homework"];
  // ↺ while Mops walks out, then on home alone: still home alone, Squatch where home alone began.
  await R.page.evaluate(() => {
    const ss = window.__ss,
      n = ss.op;
    for (let i = 0; i < 2000 && !(n.ctrl && n.ch1Morning && n.ch1Morning.step === "song"); i++) (n.cur && ((n.bt = 1), ss.opTap()), ss.tick(0.05));
    (ss.spotsNow() || []).find((x) => x.id === "sing").f();
    for (let i = 0; i < 400 && !(n.ch1Morning && n.ch1Morning.step === "leave"); i++) (n.cur && ((n.bt = 1), ss.opTap()), ss.tick(0.05));
    for (let i = 0; i < 10; i++) ss.tick(0.05);
  });
  await hold();
  const began = await R.page.evaluate(() => {
    const ss = window.__ss,
      n = ss.op;
    for (let i = 0; i < 400 && !(n.ch1Morning && n.ch1Morning.step === "home"); i++) ss.tick(0.05);
    ss.tick(0.05);
    const at = [n.sq.x, n.sq.y];
    n.sq.x = 700;
    n.sq.y = 450;
    ss.tick(0.05);
    return at;
  });
  let r = await hold();
  g.check("↺ at home after a ↺ while Mops walked out: home alone as it began", home(r) && Math.abs(r.sq[0] - began[0]) < 1 && Math.abs(r.sq[1] - began[1]) < 1, { r, began });
  const start = (id, until) =>
    R.page.evaluate(
      ([id, until]) => {
        const ss = window.__ss,
          n = ss.op;
        (ss.spotsNow() || []).find((x) => x.id === id).f();
        for (let i = 0; i < 400; i++) {
          ss.tick(1 / 30);
          const m = n.ch1Morning || {};
          if (until === "open" ? n.wardrobe === "open" : until === "rest" ? m.phase === "rest" : n.cur && n.cur.k === "cutaway") break;
        }
        return { wardrobe: n.wardrobe, phase: (n.ch1Morning || {}).phase, k: n.cur ? n.cur.k : "" };
      },
      [id, until],
    );
  const mid = {};
  mid.closet = await start("closet", "open");
  r = await hold();
  g.check("↺ with the closet open: home alone, door shut", mid.closet.wardrobe === "open" && home(r), { mid: mid.closet, r });
  mid.bed = await start("bed", "rest");
  r = await hold();
  g.check("↺ mid-flop: home alone, standing, nothing left shifted", mid.bed.phase === "rest" && home(r), { mid: mid.bed, r });
  mid.homework = await start("homework", "cutaway");
  r = await hold();
  g.check("↺ during the homework cutaway: home alone again, homework still to do", mid.homework.k === "cutaway" && home(r), { mid: mid.homework, r });
  g.check("no page errors (↺ run)", R.errors.length === 0, R.errors);
}
await g.finish("home-alone");
