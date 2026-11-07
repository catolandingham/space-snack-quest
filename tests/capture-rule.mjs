/**
 * One capture rule everywhere (task T19, Brian's D1, 2026-11-07).
 * (a) The source has one capture: no other code makes a LOCKUP card or takes stars, every catch site calls
 *     capture() or shoo(), and every captor has a cause line that matches docs/PHASE-*-LINES-FOR-BRIAN.md.
 * (b) Every captor, in a scene of its chapter, runs the same sequence: LOCKUP card with the cause and the
 *     restart line, then the joke, then the section restarts with the player in control, stars and coins kept.
 * (c) Real sightings in Chapters 1, 3 and 4 call security first; hiding brings "They lost you.", standing still
 *     brings the LOCKUP card and a restart at the section's checkpoint.
 *   node tests/capture-rule.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { startGame, sleep, readLines, root } from "./game-page.mjs";
import { setState } from "./chapter-states.mjs";

const g = await startGame({ port: 8794, name: "capture-rule" });
const lines = readLines();

// (a) Source checks.
const dir = join(root, "src", "game");
const src = readdirSync(dir).filter((f) => f.endsWith(".js")).map((f) => [f, readFileSync(join(dir, f), "utf8")]);
const all = src.map(([, s]) => s).join("\n");
g.check("no old capture paths (Pn, df, L0, m2) are left", !/function (Pn|df|L0|m2)\(/.test(all));
g.check("no code takes stars away", !/stars\s*-\s*100|n\.stars = Math\.max\(0, n\.stars -/.test(all));
g.check("only capture() makes the LOCKUP card", (all.match(/id: "jail"/g) || []).length === 1 && /function capture\(by\)[\s\S]*?id: "jail"/.test(all));
const ROWS = {
  deck: "19.1", vent: "19.2", hallvent: "19.18", s6: "19.3", hallbot: "19.4", lure9: "19.5", lure11: "19.6",
  pump: "8.1", diner: "8.2", blorp: "8.3", sink: "8.4", rust: "8.5", lure: "19.7", bots3: "19.8",
  rover1: "19.9", "rover-s": "19.10", lure3: "19.11", rover4: "19.12", light4: "19.13", gate4: "19.14",
};
// Each catch site, by the words it calls with.
const SITES = [
  ["10-ch1.js", /capture\(aV\.secBy === "vent" \? "vent" : "deck"\)/, "Chapter 1 deck guard"],
  ["11-ch1-hall.js", /capture\("s6"\)/, "Chapter 1 S6 tourist alarm"],
  ["11-ch1-hall.js", /capture\(s === "S9" \? "lure9" : "lure11"\)/, "Chapter 1 S9 and S11 lure"],
  ["11-ch1-hall.js", /shoo\(Fs, kh\(\)\)/, "Chapter 1 S9 shoo (Mops)"],
  ["11-ch1-hall.js", /shoo\(Js, kh\(\)\)/, "Chapter 1 S11 shoo (Mops)"],
  ["40-ch4.js", /capture\(FV\.why === "vent" \? "hallvent" : "hallbot"\)/, "Chapter 1 hall alarm"],
  ["20-ch2.js", /d < 48 && capture\(/, "Chapter 2 security (pump, diner, Blorp, sink, Rusty)"],
  ["20-ch2.js", /capture\("lure"\)/, "Chapter 2 lure"],
  ["20-ch2.js", /capture\("bots3"\)/, "Chapter 2 kitchen search"],
  ["20-ch2.js", /shoo\(\s*\(\) => \{\s*\(\(n\.mo\.x = Ln\.x\)/, "Chapter 2 kitchen shoo (Mops)"],
  ["30-ch3.js", /sSec\("rover1"\)/, "Chapter 3 pad rover"],
  ["30-ch3.js", /sSec\("rover-s"\)/, "Chapter 3 temple rovers"],
  ["30-ch3.js", /shoo\(CH3_CHECKPOINTS\.p3/, "Chapter 3 temple shoo (Mops)"],
  ["30-ch3.js", /capture\("lure3"\)/, "Chapter 3 ramp lure"],
  ["30-ch3.js", /sSec\("rover4"\)/, "Chapter 3 ramp rover"],
  ["40-ch4.js", /sSec\("light4"\)/, "Chapter 4 searchlight"],
  ["40-ch4.js", /sSec\("gate4"\)/, "Chapter 4 port bot"],
];
for (const [file, re, label] of SITES) g.check(`catch site goes through the rule: ${label}`, re.test(src.find(([f]) => f === file)[1]));

const { page, errors } = await g.open("?ch=2");
const causes = await page.evaluate(() => Object.fromEntries(Object.entries(window.__ss.CAPTURES).map(([k, c]) => [k, c.cause])));
g.check("every captor has a lines-file row", Object.keys(causes).every((k) => ROWS[k]), Object.keys(causes).filter((k) => !ROWS[k]));
for (const [k, row] of Object.entries(ROWS))
  g.check(`cause line for ${k} is row ${row} word for word`, causes[k] === lines[row], { game: causes[k], file: lines[row] });
g.check("the card's restart line is row 19.15", (await page.evaluate(() => window.__ss.LOCKUP_RESTART)) === lines["19.15"]);

// (b) The same sequence for every captor.
const SCENES = {
  1: { kind: "ch1", call: "sceneS1L", set: { op: { scene: "S1L", room: "deck", sqPose: "stand" } } },
  "1h": { kind: "ch1", call: "sceneS9", set: { op: { scene: "S9", room: "hall", sqPose: "stand", egg: null }, swap: false } },
  2: { kind: "ch2", steps: [["set", { jar: 12, has: "coins", reg: 4 }], ["reset", "g6"]] },
  3: { kind: "ch3", room: "pad", phase: "p1", mops: false, extra: {} },
  4: { kind: "ch4", room: "port", phase: "m1", mops: false, extra: {}, found: [] },
};
const CHAPTER = { deck: 1, vent: 1, s6: "1h", hallbot: "1h", hallvent: "1h", lure9: "1h", lure11: "1h", rover1: 3, "rover-s": 3, lure3: 3, rover4: 3, light4: 4, gate4: 4 };
async function runCapture(key) {
  await page.evaluate(setState, SCENES[CHAPTER[key] || 2]);
  return page.evaluate((key) => {
    const ss = window.__ss, n = ss.op;
    n.stars = 500; n.starOn = true; ss.ch2.jar = 12; ss.ch2.has = "coins"; ss.ch2.reg = 4;
    const scene = n.scene;
    ss.capture(key);
    const c = n.cur && n.cur.k === "card" ? n.cur : n.q.find((r) => r.k === "card");
    const card = c ? { id: c.id, text: c.text, cause: c.cause, restart: c.restart, first: c === n.cur || c === n.q[0] } : null;
    const jokes = n.q.filter((r) => r.k === "bub").map((r) => r.b.text);
    const ctrlDuring = n.ctrl;
    ss.drain();
    return { scene, card, jokes, ctrlDuring, after: { scene: n.scene, ctrl: n.ctrl, cur: !!n.cur, q: n.q.length, stars: n.stars, jar: ss.ch2.jar, has: ss.ch2.has, sec: !!ss.ch2.sec } };
  }, key);
}
for (const key of Object.keys(ROWS)) {
  const r = await runCapture(key);
  const ok =
    r.card && r.card.first && r.card.id === "jail" && r.card.text === "LOCKUP" && r.card.cause === causes[key] && r.card.restart === lines["19.15"] &&
    r.jokes.length > 0 && !r.ctrlDuring &&
    r.after.ctrl && !r.after.cur && r.after.q === 0 && r.after.scene === r.scene && r.after.stars === 500 && r.after.jar === 12 && r.after.has === "coins" && !r.after.sec;
  g.check(`${key}: LOCKUP with its cause, the joke, then the section restarts with stars and coins kept`, ok, r);
}

// Shoo: Mops goes back, no card, no stars lost.
{
  await page.evaluate(setState, SCENES[3]);
  const r = await page.evaluate(() => {
    const ss = window.__ss, n = ss.op;
    n.stars = 500;
    ss.shoo(ss.CH3_CHECKPOINTS.p3, []);
    const card = !!(n.cur && n.cur.k === "card");
    ss.drain();
    return { card, stars: n.stars, ctrl: n.ctrl };
  });
  g.check("shoo: no LOCKUP card, no stars lost, control back", !r.card && r.stars === 500 && r.ctrl, r);
}

// (c) Real sightings.
async function frames(test, ms) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    const v = await page.evaluate(test);
    if (v) return v;
    await sleep(100);
  }
  return null;
}
const cardNow = () => {
  const n = window.__ss.op;
  return n.cur && n.cur.k === "card" && n.cur.id === "jail" ? n.cur.cause : null;
};
const logHas = (text) => window.__ss.op.log.some((e) => e.text === text);

// Chapter 3 pad: the rover sees Squatch. Security comes and control stays on (no instant catch).
async function padSighting() {
  await page.evaluate(() => {
    const ss = window.__ss, n = ss.op;
    ss.sceneP0(); ss.drain();
    n.q = []; n.cur = null; n.live = []; n.ctrl = true; n.stars = 300;
    const o = ss.ch3.rov[0];
    Object.assign(o, { x: 600, f: -1, pause: 5, alert: 0 });
    Object.assign(n.sq, { x: 470, y: 520 });
  });
  return frames(() => (window.__ss.ch2.sec ? { by: window.__ss.ch2.sec.by, ctrl: window.__ss.op.ctrl, card: !!window.__ss.op.cur } : null), 3000);
}
let seen = await padSighting();
g.check("Chapter 3: the rover's sighting calls security, and the player still has control", !!seen && seen.by === "rover1" && seen.ctrl && !seen.card, seen);
const caught3 = await frames(cardNow, 12000);
g.check("Chapter 3: security reaches a standing Squatch and the LOCKUP card names the rover", caught3 === causes.rover1, caught3);
await page.evaluate(() => window.__ss.drain());
const back3 = await page.evaluate(() => ({ x: Math.round(window.__ss.op.sq.x), y: Math.round(window.__ss.op.sq.y), ctrl: window.__ss.op.ctrl, stars: window.__ss.op.stars, phase: window.__ss.ch3.phase }));
g.check("Chapter 3: the pad restarts at its checkpoint (880, 560), stars kept", back3.x === 880 && back3.y === 560 && back3.ctrl && back3.stars === 300 && back3.phase === "p1", back3);

seen = await padSighting();
await page.evaluate(() => { window.__ss.op.sqPose = "hidden"; window.__ss.ch.spot = 70; });
const lost3 = await frames(() => (!window.__ss.ch2.sec && window.__ss.op.log.some((e) => e.text === "They lost you.") ? true : null), 12000);
g.check("Chapter 3: hiding after the sighting sends security away and shows \"They lost you.\"", !!seen && lost3 === true && lines["19.16"] === "They lost you.");

// Chapter 4 dock: the port bot sees Squatch. Security comes.
await page.evaluate(() => {
  const ss = window.__ss, n = ss.op;
  ss.sceneM0(); ss.drain();
});
await frames(() => (window.__ss.ch4.phase === "m1" && window.__ss.ch4.bot ? true : null), 3000);
const m1 = await page.evaluate(() => {
  const ss = window.__ss, n = ss.op, o = ss.ch4.bot;
  if (!o) return null;
  n.q = []; n.cur = null; n.live = []; n.ctrl = true;
  o.look = 0; o.x = o.hx; o.f = -1;
  const d = { ox: o.x, oy: o.y - 40, a: Math.PI - 0.15 };
  // Find a floor point in the bot's cone and out of the searchlights.
  for (let x = o.x - 60; x > o.x - 220; x -= 10) for (let y = 440; y < 600; y += 10)
    if (ss.inWedge(x, y - 40, d.ox, d.oy, d.a, 0.55, 220) && !ss.inLight4(x, y)) { n.sq.x = x; n.sq.y = y; n.sqPose = "stand"; return { x, y }; }
  return { none: true };
});
const sec4 = await frames(() => (window.__ss.ch2.sec ? { by: window.__ss.ch2.sec.by, ctrl: window.__ss.op.ctrl } : null), 3000);
g.check("Chapter 4: the port bot's sighting calls security, and the player still has control", !!sec4 && (sec4.by === "gate4" || sec4.by === "light4") && sec4.ctrl, { m1, sec4 });
const caught4 = await frames(cardNow, 12000);
g.check("Chapter 4: security reaches Squatch and the LOCKUP card names who saw him", caught4 === causes.gate4 || caught4 === causes.light4, caught4);

// Chapter 1 deck: a tourist sees Squatch, the guard comes, LOCKUP, the deck restarts, no stars lost.
await page.evaluate(setState, SCENES[1]);
await page.evaluate(() => {
  const ss = window.__ss, n = ss.op;
  n.stars = 200;
  Object.assign(n.sq, { x: 300, y: 330 });
});
const deckSec = await frames(() => (window.__ss.s1.sec.on ? { ctrl: window.__ss.op.ctrl } : null), 6000);
g.check("Chapter 1 deck: the tourist's sighting brings the guard while the player keeps control", !!deckSec && deckSec.ctrl, deckSec);
const caught1 = await frames(cardNow, 12000);
g.check("Chapter 1 deck: the guard reaches Squatch and the LOCKUP card names the tourist", caught1 === causes.deck, caught1);
await page.evaluate(() => window.__ss.drain());
const back1 = await page.evaluate(() => ({ scene: window.__ss.op.scene, stars: window.__ss.op.stars, ctrl: window.__ss.op.ctrl, x: window.__ss.op.sq.x, y: window.__ss.op.sq.y }));
g.check("Chapter 1 deck: the deck restarts, stars kept (no −100)", back1.scene === "S1L" && back1.stars === 200 && back1.ctrl && back1.x === 480 && back1.y === 560, back1);

// Chapter 1 hall alarm: hidden for 2 seconds is "They lost you."; not hidden at the end of the run is LOCKUP.
async function hallAlarm(hide) {
  await page.evaluate(setState, SCENES["1h"]);
  await page.evaluate((hide) => {
    const ss = window.__ss, n = ss.op;
    n.seeGrace = 0; n.log.length = 0;
    const bot = ss.ch.lureBot;
    ss.hallAlarmStart(bot);
    hide && ((n.sqPose = "hidden"), (ss.ch.spot = 9));
  }, hide);
  // The bot runs to the alarm and pulls it; then the run's 10 seconds are skipped when not hiding.
  await frames(() => (window.__ss.hallAlarm.pulled >= 0 ? true : null), 6000);
  hide || (await page.evaluate(() => { window.__ss.op.T += 11; }));
  return frames(() => {
    const n = window.__ss.op;
    if (n.cur && n.cur.id === "jail") return { card: n.cur.cause };
    if (n.log.some((e) => e.text === "They lost you.")) return { lost: true };
    return null;
  }, 6000);
}
const hallCaught = await hallAlarm(false);
g.check("Chapter 1 hall alarm: not hidden at the end of the run is the LOCKUP card", !!hallCaught && hallCaught.card === causes.hallbot, hallCaught);
await page.evaluate(() => window.__ss.drain());
const hallLost = await hallAlarm(true);
g.check("Chapter 1 hall alarm: hidden for 2 seconds shows \"They lost you.\"", !!hallLost && hallLost.lost === true, hallLost);

// Review fixes (2026-11-07): restarts never skip the tank, the soup or the lure reset, and Chapter 1 hall
// restarts give a moment before the next alarm.
const restartIn = (setup, before) =>
  page.evaluate(setState, setup).then(() =>
    page.evaluate((before) => {
      const ss = window.__ss, n = ss.op, k = ss.ch2;
      before && Object.assign(k, before);
      ss.sectionReset();
      ss.drain();
      const ship = ss.spotsNow().find((sp) => sp.verb === "BOARD");
      n.sq.x = 780; n.sq.y = 500; n.sqPose = "stand";
      const offer = ss.offerNow();
      return { phase: k.phase, room: n.room, mops: !!ss.ch.mops, has: k.has, key: ss.ch2ChipKey(), board: !!(offer && offer.verb === "BOARD"), shipUsable: !!(ship && ship.when !== false) };
    }, before));
for (const [label, has] of [["g6d with no coins", ""], ["g6d with the coins", "coins"]]) {
  const r = await restartIn({ kind: "ch2", steps: [["set", { fuel: false, has, jar: 30 }], ["reset", "wash5"], ["call", "sceneG6"], ["set", { has }]] });
  g.check(`restart in ${label}: no BOARD, and the next chip is the jar or coins step`, !r.board && !r.shipUsable && ["g6d", "g6d:coins"].includes(r.key) && r.room === "diner", r);
}
{
  const r = await restartIn({ kind: "ch2", steps: [["set", { fuel: false, jar: 0, has: "coins" }], ["reset", "wash5"], ["call", "g6Out"], ["swap", true], ["set", { has: "coins" }]] });
  g.check("restart in g6 before the tank: Mops with the coins at the pump, no BOARD", !r.board && !r.shipUsable && r.key === "g6:mops" && r.mops && r.has === "coins" && r.room === "gas", r);
}
{
  const r = await restartIn({ kind: "ch2", steps: [["set", { fuel: false, has: "" }], ["reset", "g6"]], }, { phase: "g6", fuel: false });
  g.check("BOARD is never offered before the tank is full", !r.board && !r.shipUsable, r);
}
{
  const r = await page.evaluate(setState, { kind: "ch2", steps: [["set", { has: "soup" }], ["reset", "g4l"], ["set", { has: "" }]] }).then(() =>
    page.evaluate(() => { const ss = window.__ss; ss.ch2.has = ""; ss.capture("bots3"); ss.drain(); return { phase: ss.ch2.phase, has: ss.ch2.has }; }));
  g.check("restart from g4l lands on wash5 without the soup handed back", r.phase === "wash5" && r.has === "", r);
}
{
  await page.evaluate(setState, { kind: "ch2", steps: [["set", { fuel: true }], ["reset", "g6"]] });
  const r = await page.evaluate(() => {
    const ss = window.__ss, k = ss.ch2;
    k.bots = [{ x: 300, y: 500, hx: 700, f: -1, look: 4 }, { x: 320, y: 520, hx: 900, f: -1, look: 4 }];
    ss.capture("lure"); ss.drain();
    return k.bots.map((b) => ({ x: b.x, hx: b.hx, look: b.look }));
  });
  g.check("after a lure capture the pump bots are home and not looking", r.length === 2 && r.every((b) => b.x === b.hx && b.look === 0), r);
}
for (const [label, setup] of [
  ["S4", { kind: "ch1", call: "sceneS4", set: { op: { scene: "S4", room: "hall", sqPose: "stand" }, s4: { inCrate: false, botsOut: false } } }],
  ["S7", { kind: "ch1", call: "sceneS6", set: { op: { scene: "S7", room: "hall", sqPose: "stand" } } }],
  ["S7b", { kind: "ch1", call: "sceneS6", set: { op: { scene: "S7b", room: "hall", sqPose: "stand" } } }],
]) {
  await page.evaluate(setState, setup);
  await sleep(200); // the scene's checkpoint is saved on the next frame
  const before = await page.evaluate(() => { const ss = window.__ss; ss.capture("hallbot"); ss.drain(); return ss.ch.caught + ss.s1.caught; });
  await sleep(2000);
  const after = await page.evaluate(() => { const ss = window.__ss, n = ss.op; return { caught: ss.ch.caught + ss.s1.caught, card: !!(n.cur && n.cur.id === "jail") || n.q.some((q) => q.id === "jail"), alarm: ss.hallAlarm.on, grace: n.seeGrace - n.T, scene: n.scene }; });
  g.check(`Chapter 1 ${label}: after a restart there is no catch for 2 seconds`, after.caught === before && !after.card && !after.alarm && after.scene === label, { before, after });
}

// Tallies no longer show stars taken away.
g.check("no tally adds a star loss to Times caught", !/Times caught " \+ s \+ \(s \?/.test(all));

g.check("no page errors", errors.length === 0, errors);
await g.finish("capture-rule");
