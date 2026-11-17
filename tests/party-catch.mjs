/**
 * A catch in each party scene shows the lockup card, then restarts that scene.
 * The alarm does not walk Squatch home by himself.
 *   node tests/party-catch.mjs
 */
import { readFileSync } from "node:fs";
import { startGame } from "./game-page.mjs";

const raidSrc = readFileSync(new URL("../src/game/14-ch1-day1.js", import.meta.url), "utf8");
const partySrc = readFileSync(new URL("../src/game/12-ch1-redesign.js", import.meta.url), "utf8");
const snagBlock = partySrc.slice(partySrc.indexOf("const CH1_PARTY_SNAG"), partySrc.indexOf("];", partySrc.indexOf("const CH1_PARTY_SNAG")));
const snags = [...snagBlock.matchAll(/x:\s*(\d+),\s*y:\s*(\d+)/g)].map((m) => [+m[1], +m[2]]);
const conga = raidSrc.slice(raidSrc.indexOf("function ch1Conga"), raidSrc.indexOf("function ch1Chicken"));
const congaEnd = [...conga.matchAll(/ch1Step\("sq",\s*(\d+),\s*(\d+)/g)].map((m) => [+m[1], +m[2]]).pop();
const congaClear = !!congaEnd && snags.every(([x, y]) => Math.hypot(congaEnd[0] - x, congaEnd[1] - y) > 36);
const g = await startGame({ port: 8948, name: "party-catch" });
const { page, errors } = await g.open("?ch=1");
await page.evaluate(() => window.__ss.lockedReady);

const scenes = [
  {
    name: "peek",
    set: { ch1Part: "peek", scene: "QA", room: "hall", ch1Party: true, ch1Peeking: true },
    back: (n) => n.ch1Part === "peek" && n.room === "closet" && n.ch1PeekReady && n.ch1Chip.indexOf("peek") >= 0,
  },
  {
    name: "sneak",
    set: { ch1Part: "sneak", scene: "QA", room: "hall", ch1Party: true, ch1PlantSneak: { t: 1, caught: 0, tries: 0 } },
    back: (n) => n.ch1Part === "sneak" && n.room === "hall" && n.ch1PlantSneak && n.ch1Chip.indexOf("plant") >= 0,
  },
  {
    name: "extras",
    set: { ch1Part: "extras", scene: "QA", room: "hall", ch1Party: true, ch1Disguise: true, ch1Flyer: true },
    back: (n) => n.ch1Part === "extras" && n.room === "hall" && n.ch1Disguise && !n.ch1PartyOver && !n.ch1Raid && !n.ch1Flyer,
  },
  {
    name: "alarm",
    set: { ch1Part: "alarm", scene: "QA", room: "hall", ch1Party: true, ch1PartyOver: true, ch1Disguise: false, sqx: 700, sqy: 540 },
    back: (n) => n.ch1Part === "alarm" && n.room === "hall" && n.ch1Raid && n.ch1Raid.phase === "witness" && n.sq.x < 700,
  },
  {
    name: "home",
    set: { ch1Part: "home", scene: "QH", room: "closet", ch1Search: true, sqx: 700, sqy: 520 },
    back: (n) => n.ch1Part === "home" && n.scene === "QH" && n.room === "closet" && n.ch1Search && n.guard && n.sq.x < 700,
  },
];

const out = await page.evaluate(async (scenes) => {
  const ss = window.__ss;
  const n = ss.op;
  const rows = [];
  for (const sc of scenes) {
    n.q = [];
    n.cur = null;
    n.ctrl = true;
    n.ch1Party = false;
    n.ch1Raid = null;
    n.ch1Search = false;
    n.ch1Disguise = false;
    n.ch1PartyOver = false;
    n.ch1PeekReady = false;
    n.ch1Peeking = false;
    n.ch1PlantSneak = null;
    n.ch1Flyer = false;
    n.guard = null;
    n.sqPose = "stand";
    n.sq.x = sc.set.sqx || 500;
    n.sq.y = sc.set.sqy || 540;
    Object.assign(n, {
      ch1Part: sc.set.ch1Part,
      scene: sc.set.scene,
      room: sc.set.room,
      ch1Party: !!sc.set.ch1Party,
      ch1Peeking: !!sc.set.ch1Peeking,
      ch1Disguise: !!sc.set.ch1Disguise,
      ch1Flyer: !!sc.set.ch1Flyer,
      ch1PartyOver: !!sc.set.ch1PartyOver,
      ch1Search: !!sc.set.ch1Search,
      ch1PlantSneak: sc.set.ch1PlantSneak || null,
    });
    ss.capture("s6");
    ss.tick(0.05);
    const card = n.cur && n.cur.id === "jail" ? n.cur.text : "";
    const restarted = () => {
      if (sc.name === "peek") return n.room === "closet" && n.ch1PeekReady;
      if (sc.name === "sneak") return n.ch1Chip.indexOf("plant") >= 0 && Math.round(n.sq.x) === 470;
      if (sc.name === "extras") return n.ch1Disguise && !n.ch1Flyer && Math.round(n.sq.x) === 560;
      if (sc.name === "alarm") return n.ch1Raid && n.ch1Raid.phase === "witness" && Math.round(n.sq.x) === 560;
      if (sc.name === "home") return n.scene === "QH" && n.guard && Math.round(n.sq.x) === 480;
      return false;
    };
    for (let i = 0; i < 40 && !restarted(); i++) {
      ss.tick(0.4);
      if (n.cur && (n.cur.k === "bub" || n.cur.k === "card" || n.cur.k === "panel" || n.cur.k === "wait")) ss.opTap();
    }
    rows.push({
      name: sc.name,
      card,
      part: n.ch1Part,
      scene: n.scene,
      room: n.room,
      chip: n.ch1Chip || "",
      peek: !!n.ch1PeekReady,
      sneak: !!n.ch1PlantSneak,
      disguise: !!n.ch1Disguise,
      over: !!n.ch1PartyOver,
      flyer: !!n.ch1Flyer,
      raid: n.ch1Raid && n.ch1Raid.phase,
      search: !!n.ch1Search,
      guard: !!n.guard,
      x: Math.round(n.sq.x),
    });
  }
  n.ch1Part = "extras";
  n.scene = "QA";
  n.room = "hall";
  n.ch1Party = true;
  n.ch1Disguise = true;
  n.ch1PartyOver = false;
  n.ch1Raid = null;
  n.cur = null;
  n.q = [];
  ss.drawFrame();
  return rows;
}, scenes);

const want = {
  peek: (r) => r.card === "LOCKUP" && r.part === "peek" && r.room === "closet" && r.peek,
  sneak: (r) => r.card === "LOCKUP" && r.part === "sneak" && r.room === "hall" && r.sneak,
  extras: (r) => r.card === "LOCKUP" && r.part === "extras" && r.room === "hall" && r.disguise && !r.over && !r.raid && !r.flyer,
  alarm: (r) => r.card === "LOCKUP" && r.part === "alarm" && r.room === "hall" && r.raid === "witness" && r.x < 700,
  home: (r) => r.card === "LOCKUP" && r.part === "home" && r.scene === "QH" && r.room === "closet" && r.search && r.guard && r.x < 700,
};
for (const row of out) g.check(row.name + ": lockup, then that scene starts over", want[row.name](row), row);
g.check("the alarm does not walk him home in the code", !/mV\(n\.sq, CH1_HOME_DOOR/.test(raidSrc), "auto-run still in the raid");
g.check("the home guard does not walk him to 760", !/mV\(n\.sq, 760, 540/.test(raidSrc));
const paths = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  const run = (setup, done) => {
    n.q = [];
    n.cur = null;
    n.ctrl = true;
    n.ch1Raid = null;
    n.ch1Search = false;
    n.guard = null;
    n.ch1Cut = null;
    n.ch1Mini = "";
    n.ch1PartyOver = false;
    setup();
    let card = "";
    for (let i = 0; i < 100 && !done(); i++) {
      ss.tick(0.15);
      if (n.cur && n.cur.id === "jail") card = n.cur.text;
      if (n.cur && (n.cur.k === "bub" || n.cur.k === "card" || n.cur.k === "panel" || n.cur.k === "wait")) ss.opTap();
    }
    return { card, part: n.ch1Part, scene: n.scene, room: n.room, x: Math.round(n.sq.x), over: !!n.ch1PartyOver, disguise: !!n.ch1Disguise, raid: n.ch1Raid && n.ch1Raid.phase, search: !!n.ch1Search };
  };
  return {
    sneak: run(() => {
      n.scene = "QA";
      n.room = "hall";
      n.ch1Party = true;
      n.ch1Part = "sneak";
      n.ch1PlantSneak = { t: 4.5, caught: 0, tries: 0 };
      n.sqPose = "stand";
      n.sq.x = 460;
      n.sq.y = 582;
    }, () => n.cur && n.cur.id === "jail"),
    extras: run(() => {
      n.scene = "QA";
      n.room = "hall";
      n.ch1Party = true;
      n.ch1Part = "extras";
      n.ch1Disguise = true;
      n.sqPose = "stand";
      n.sq.x = 370;
      n.sq.y = 538;
    }, () => n.ch1Part === "extras" && n.ch1Disguise && !n.ch1PartyOver && Math.round(n.sq.x) === 560 && !(n.cur && n.cur.id === "jail")),
    alarm: run(() => {
      n.scene = "QA";
      n.room = "hall";
      n.ch1Party = true;
      n.ch1Part = "alarm";
      n.ch1PartyOver = true;
      n.ch1Disguise = false;
      n.sqPose = "stand";
      n.sq.x = 500;
      n.sq.y = 540;
      n.ch1Raid = { phase: "search", guards: [{ x: 520, y: 540, t: 2, face: 0 }], doorT: 0, left: false, witness: { x: 800, y: 430 } };
    }, () => n.ch1Part === "alarm" && n.ch1Raid && n.ch1Raid.phase === "witness"),
    home: run(() => {
      n.scene = "QH";
      n.room = "closet";
      n.ch1Part = "home";
      n.ch1Search = true;
      n.ch1Party = false;
      n.sqPose = "stand";
      n.sq.x = 700;
      n.sq.y = 520;
      n.guard = { x: 720, y: 520, t: 1, seen: 0 };
    }, () => n.ch1Part === "home" && n.scene === "QH" && Math.round(n.sq.x) === 480 && n.guard && !(n.cur && n.cur.id === "jail") && n.ctrl),
    peek: run(() => {
      n.scene = "QA";
      n.room = "hall";
      n.ch1Part = "peek";
      n.ch1Party = true;
      ss.capture("s6");
    }, () => n.ch1Part === "peek" && n.room === "closet" && n.ch1PeekReady),
  };
});
g.check("sneak: the cone calls capture and shows the lockup card", paths.sneak.card === "LOCKUP", paths.sneak);
g.check("extras: walking into the plant is a lockup, then the extras restart", paths.extras.card === "LOCKUP" && paths.extras.part === "extras" && !paths.extras.over, paths.extras);
g.check("alarm: a guard's touch shows the lockup card and restarts the search", paths.alarm.card === "LOCKUP" && paths.alarm.raid === "witness", paths.alarm);
g.check("run home: the guard's touch shows the lockup card and does not walk him to 760", paths.home.card === "LOCKUP" && paths.home.x === 480 && paths.home.search, paths.home);
g.check("peek: a catch shows the lockup card and restarts the peek", paths.peek.card === "LOCKUP" && paths.peek.part === "peek" && paths.peek.room === "closet", paths.peek);
g.check("the conga ends clear of the plant, the vent, and the guard", congaClear, { congaEnd, snags });
g.check("no page errors", errors.length === 0, errors);
await g.finish("party-catch");
