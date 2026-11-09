/**
 * Later-chapter room changes walk out through the door and in from the matching side.
 * Records each fixed change and checks the picture shows the character walking on both sides,
 * with control off the whole time.
 *   node tests/room-walk.mjs
 */
import { startGame, sleep } from "./game-page.mjs";

const g = await startGame({ port: 8791, name: "room-walk" });

// Each row is one door. setup() puts the character in the old room, away from the door, and starts the change.
// M6 (port to stand) walks the real feet; the others draw a roomWalk over the destination.
const ROWS = [
  ["20-ch2.js diner to kitchen", "diner", "kitchen", "mo", () => {
    const ss = window.__ss, n = ss.op;
    quiet();
    ss.ch2.has = "soup";
    n.scene = "G4"; n.room = "diner"; ss.ch2.phase = "g4k";
    ss.swapTo(true);
    n.moPose = "stand"; n.mo.x = 480; n.mo.y = 520; n.ctrl = true;
    return go("BACK");
  }],
  ["20-ch2.js kitchen to diner", "kitchen", "diner", "mo", () => {
    const ss = window.__ss, n = ss.op;
    quiet();
    n.scene = "G5k"; n.room = "kitchen"; ss.ch2.phase = "wash5";
    ss.swapTo(true);
    n.moPose = "stand"; n.mo.x = 400; n.mo.y = 520; n.ctrl = true;
    return go("FRONT");
  }],
  ["20-ch2.js gas to diner", "gas", "diner", "mo", () => {
    const ss = window.__ss, n = ss.op;
    quiet();
    n.scene = "G1"; n.room = "gas"; ss.ch2.phase = "g1door";
    ss.swapTo(true);
    n.moPose = "stand"; n.mo.x = 560; n.mo.y = 520; n.ctrl = true;
    return go("ENTER");
  }],
  ["20-ch2.js gas to kitchen", "gas", "kitchen", "sq", () => {
    const ss = window.__ss, n = ss.op;
    quiet();
    n.scene = "G2b"; n.room = "gas"; ss.ch2.phase = "back";
    ss.swapTo(false);
    n.sqPose = "stand"; n.sq.x = 400; n.sq.y = 500; n.ctrl = true;
    return go("ENTER");
  }],
  ["20-ch2.js diner to kitchen with the soup", "diner", "kitchen", "mo", () => {
    const ss = window.__ss, n = ss.op;
    quiet();
    ss.ch2.has = "soup";
    n.scene = "G4"; n.room = "diner"; ss.ch2.phase = "g4";
    ss.swapTo(true);
    n.moPose = "stand"; n.mo.x = 400; n.mo.y = 520; n.ctrl = true;
    return go("ENTER");
  }],
  ["30-ch3.js pad to temple", "pad", "temple", "mo", () => {
    const ss = window.__ss, n = ss.op;
    quiet();
    n.scene = "P2"; n.room = "pad"; ss.ch3.phase = "p2";
    ss.swapTo(true);
    n.moPose = "stand"; n.mo.x = 400; n.mo.y = 520; n.sqPose = "hidden"; n.ctrl = true;
    ss.sceneP3();
    return "";
  }],
  ["30-ch3.js temple to pad", "temple", "pad", "mo", () => {
    const ss = window.__ss, n = ss.op;
    quiet();
    n.scene = "P3"; n.room = "temple"; ss.ch3.phase = "p3x";
    ss.swapTo(true);
    n.moPose = "stand"; n.mo.x = 240; n.mo.y = 540; n.ctrl = true;
    ss.sceneP4();
    return "";
  }],
  ["40-ch4.js port to stand", "port", "stand", "sq", () => {
    const ss = window.__ss, n = ss.op;
    quiet();
    n.scene = "M1"; n.room = "port"; ss.ch4.phase = "m1"; ss.ch4.miss = 1;
    ss.ch4.bot = { x: 200, y: 500, hx: 200, hf: -1, f: -1, look: 0, pause: 0, alert: 0 };
    ss.swapTo(false);
    n.sqPose = "stand"; n.sq.x = 880; n.sq.y = 500; n.ctrl = true;
    window.__bodyWatch = "sq";
    return "";
  }],
  ["40-ch4.js stand to van", "stand", "van", "mo", () => {
    const ss = window.__ss, n = ss.op;
    quiet();
    n.scene = "M2"; n.room = "stand"; ss.ch4.phase = "m2";
    ss.swapTo(true);
    n.moPose = "stand"; n.mo.x = 400; n.mo.y = 540; n.ctrl = true;
    ss.sceneM3();
    return "";
  }],
  ["40-ch4.js van to inside", "van", "inside", "mo", () => {
    const ss = window.__ss, n = ss.op;
    quiet();
    n.scene = "M3"; n.room = "van"; ss.ch4.phase = "m3";
    ss.swapTo(true);
    n.moPose = "stand"; n.mo.x = 400; n.mo.y = 560; n.sqPose = "stand"; n.sq.x = 200; n.sq.y = 540; n.ctrl = true;
    ss.sceneM4();
    return "";
  }],
  ["40-ch4.js inside to van", "inside", "van", "sq", () => {
    const ss = window.__ss, n = ss.op;
    quiet();
    n.scene = "M4"; n.room = "inside"; ss.ch4.phase = "m4b";
    ss.swapTo(false);
    n.sqPose = "stand"; n.sq.x = 300; n.sq.y = 540; n.ctrl = true;
    return go("EXIT");
  }],
  ["40-ch4.js van to port", "van", "port", "sq", () => {
    const ss = window.__ss, n = ss.op;
    quiet();
    n.scene = "M4v"; n.room = "van"; ss.ch4.phase = "m4v";
    ss.swapTo(false);
    n.sqPose = "stand"; n.sq.x = 400; n.sq.y = 540; n.moPose = "stand"; n.ctrl = true;
    ss.sceneM5();
    return "";
  }],
];

function travel(samples, from, to) {
  const span = (room) => {
    const rows = samples.filter((s) => s.room === room && s.moving);
    if (rows.length < 2) return 0;
    let d = 0;
    for (let i = 1; i < rows.length; i++) d += Math.hypot(rows[i].x - rows[i - 1].x, rows[i].y - rows[i - 1].y);
    return d;
  };
  const walking = samples.filter((s) => s.moving);
  return {
    out: span(from),
    inn: span(to),
    ctrlOn: walking.filter((s) => s.ctrl).length,
    n: samples.length,
  };
}

const { ctx, page, errors } = await g.open("?ch=2");
await page.evaluate(() => {
  window.__walkSamples = [];
  window.__bodyWatch = "";
  const watch = () => {
    const n = window.__ss.op;
    const w = n.roomWalk;
    if (w) {
      window.__walkSamples.push({
        room: w.phase === "out" ? w.fromRoom : w.toRoom,
        phase: w.phase,
        x: w.x,
        y: w.y,
        moving: !!w.moving,
        ctrl: !!n.ctrl,
        who: w.phase === "out" ? w.outWho : w.inWho,
      });
    } else if (window.__bodyWatch) {
      const who = window.__bodyWatch === "mo" ? n.mo : n.sq;
      window.__walkSamples.push({
        room: n.room,
        phase: "body",
        x: who.x,
        y: who.y,
        moving: !!who.moving,
        ctrl: !!n.ctrl,
        who: window.__bodyWatch,
      });
    }
    requestAnimationFrame(watch);
  };
  requestAnimationFrame(watch);
  window.quiet = () => {
    const n = window.__ss.op;
    n.q = []; n.cur = null; n.live = []; n.roomWalk = null; n.ctrl = true;
    window.__bodyWatch = "";
    window.__walkSamples = [];
  };
  window.go = (verb) => {
    const s = window.__ss.spotsNow().find((sp) => sp && sp.verb === verb && sp.when);
    if (!s) return "no " + verb;
    s.f();
    return "";
  };
});

for (const [name, from, to, who, setup] of ROWS) {
  const err = await page.evaluate(setup);
  let samples = [];
  for (let i = 0; i < 80; i++) {
    await sleep(100);
    const snap = await page.evaluate(() => ({
      samples: window.__walkSamples.slice(),
      walk: !!window.__ss.op.roomWalk,
      room: window.__ss.op.room,
      body: !!window.__bodyWatch,
      hidden: window.__ss.op.sqPose === "hidden",
    }));
    samples = snap.samples;
    const seenOut = samples.some((s) => s.room === from && s.moving);
    const seenIn = samples.some((s) => s.room === to && s.moving);
    // Port to stand walks the real feet, then hides behind the crate when the walk-in ends.
    const settled = snap.body ? snap.room === "stand" && snap.hidden : !snap.walk && seenOut && seenIn;
    if (settled && i > 5) break;
  }
  const t = travel(samples, from, to);
  g.check(
    `${name}: walking on both sides, control off`,
    !err && t.out > 20 && t.inn > 20 && t.ctrlOn === 0,
    { err, t, from, to, who },
  );
}
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("room-walk");
