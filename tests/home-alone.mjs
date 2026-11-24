/**
 * Squatch home alone after Mops leaves for work, before "That evening…" (docs/BRIAN-ASKS-OPEN.md "Build next"
 * item 1, the morning plan's PR 3, with Brian's answers of 2026-11-23). Played on a phone (375x812) by touch.
 * - Once Mops is gone the kid has control (no "That evening…" yet); the chip reads "Squatch: do your homework"
 *   and only the desk gets the yellow outline. Nothing moves on by itself (40 seconds later, still home alone).
 * - The calendar (LOOK · calendar) opens already bitten: the nibble is out of the paper before any tap, and
 *   touching the printed Moon Pie changes nothing.
 * - OPEN · closet: the door opens (the locked open-closet picture, unchanged) with the small blue G box on the
 *   closet floor, drawn like Brian's approved picture (docs/approved-art/closet/); Squatch stands clear of it
 *   and says "Mops's costumes. And my Guardian Box."; the line waits for a tap; the tap shuts the door and the
 *   calendar is offered again (Q7).
 * - FLOP · bed: Squatch flops onto the bed and gets back up without jumping between frames, then says
 *   "Not sleepy anymore." (waits for a tap), then control is back.
 * - DO · homework: straight into the homework cutaway (no pop-up first): picture 1 Squatch at the desk, picture
 *   2 the sheet with its words from the lines file; each waits for a tap with NEXT and the "tap ▸" cue; then
 *   "That evening…" and the peek goal.
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
      peek: !!n.ch1PeekReady,
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
  // The nibble out of the paper's right edge, beside the Moon Pie row (the same spots tests/calendar-closeup.mjs uses).
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
g.check("touching the printed Moon Pie takes no bite (nothing on the calendar changes)", changed < 40, changed);
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
    path = [];
  let sat = false;
  for (let i = 0; i < 600 && !(n.cur && n.cur.k === "bub"); i++) {
    ss.tick(1 / 60);
    // Where his drawing stands: on the bed (sitting at 205, 444, shifted by sqBedX and raised by sqLift; see
    // the bed drawing in src/game/60-frame-draw.js), or at his feet when he stands.
    const sit = n.sqPose === "sit";
    sat = sat || sit;
    path.push(sit ? [205 + (n.sqBedX || 0), 444 - (n.sqLift || 0) * 22] : [n.sq.x, n.sq.y]);
  }
  let maxStep = 0;
  for (let i = 1; i < path.length; i++) maxStep = Math.max(maxStep, Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]));
  return { frames: path.length, maxStep, sat, text: n.cur && n.cur.b ? n.cur.b.text : "", pose: n.sqPose, hop: n.hopOut };
});
g.check("FLOP · bed: Squatch flops onto the bed and gets back up, no jump between frames", flop.sat && flop.maxStep < 8 && flop.hop < 0, flop);
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
    const beat = window.SSQ.beat("ch1-morning"),
      before = beat.debug().cue;
    window.__ss.drawFrame();
    return { last: window.SSQ.cutaway.last(), cue: beat.debug().cue > before, printed: [...window.__printed] };
  });
  cut.push({ panel: s.panel, btn: s.btn, still: await stillAfter6s(), ...info });
  await tapAt(480, 330);
  await sleep(400);
}
g.check("the homework cutaway has two full-screen pictures, in order", cut.length === 2 && cut.every((c, i) => c.panel === i && c.last && c.last.id === "homework" && c.last.full === true), cut.map((c) => c.last));
g.check("each picture waits for a tap, NEXT on the button and the tap cue drawn", cut.every((c) => c.still && /NEXT$/.test(c.btn) && c.cue), cut.map((c) => [c.still, c.btn, c.cue]));
g.check("picture 1 shows Squatch at the desk with his pencil", !!cut[0] && !!cut[0].last.squatch && cut[0].last.pencil === true, cut[0] && cut[0].last);
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
      return { k: n.cur ? n.cur.k : "", step: n.ch1Morning ? n.ch1Morning.step : "", look: n.ch1Morning ? n.ch1Morning.look : "", wardrobe: n.wardrobe, pose: n.sqPose, bedX: n.sqBedX || 0, lift: n.sqLift || 0, moPose: n.moPose, chip: ss.chipNow(), ctrl: n.ctrl, sq: [n.sq.x, n.sq.y] };
    });
  const home = (r) => r.step === "home" && !r.look && !r.k && r.ctrl && r.wardrobe === "closed" && r.pose === "stand" && !r.bedX && !r.lift && r.moPose === "hidden" && r.chip === L["chip-homework"];
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
