/**
 * The drawn sight cone is the place that sees Squatch (Phase 3, T19 addition, Brian's play of 2026-11-07:
 * "Rusty seems to catch Squatch only when he is directly in front").
 * For Rusty, a pump bot, Gloop's kitchen window, the deck tourist, the three rover cones, the port bot and
 * the Chapter 1 hall bot's circle: sample points just inside and just outside the drawn
 * cone's edges and just past its far end. "Drawn" is read from the picture (the pixel changes when the
 * cone is drawn). "Seen" is the game's own reaction to a standing Squatch whose eye point is that spot
 * (security starts, or Gloop's eye opens). Inside must see him and be drawn, unless the sight line is
 * blocked (the pump and crates block as today): then neither. Outside must be neither. Since this test the
 * cone is drawn cut short behind pumps and crates (seenCone in 20-ch2.js); no width or range changed.
 * Squatch's eye point is 40 px above his feet (50 for the window), the point the game checks.
 *   node tests/cone-match.mjs
 */
import { startGame, sleep } from "./game-page.mjs";
import { setState } from "./chapter-states.mjs";

const g = await startGame({ port: 8798, name: "cone-match" });
const { page, errors } = await g.open("?ch=2");

// The cones as the game draws them (origin, facing, half-angle, length), read from the state.
const CONES = {
  rusty: { setup: { kind: "ch2", steps: [["reset", "back"]] }, eye: 40 },
  pumpbot: { setup: { kind: "ch2", steps: [["set", { jar: 30, has: "" }], ["reset", "g6"], ["call", "g6Out"], ["swap", false]] }, eye: 40 },
  window: { setup: { kind: "ch2", steps: [["set", { done: 0, held: -1, cook: "gone" }], ["reset", "wash1"], ["set", { cook: "gone" }]] }, eye: 50 },
};

async function prepare(name, face) {
  await page.evaluate(setState, CONES[name].setup);
  // Let the room's fade-in finish: under the dark fade the cone's tint is too faint to read from the picture.
  await sleep(1500);
  return page.evaluate((name, face) => {
    const ss = window.__ss, n = ss.op, k = ss.ch2;
    n.q = []; n.cur = null; n.live = []; n.ctrl = true; ss.swapTo(false); n.sqPose = "stand";
    k.sec = null; k.peekT = 999; k.timer = 999;
    if (name === "rusty") {
      Object.assign(k.rust, { x: 450, f: face, pause: 1e6, alert: 0, chase: false, nap: false });
      return { ox: 450, oy: 400, a: face > 0 ? 0.5 : Math.PI - 0.5, half: 0.85, len: 280 };
    }
    if (name === "pumpbot") {
      k.bots = k.bots.slice(0, 1);
      k.rust.nap = true; // Rusty asleep, so only the bot can see Squatch here
      const b = k.bots[0];
      Object.assign(b, { x: 600, look: 0, hx: 600 });
      b.f = face;
      return { ox: b.x, oy: b.y - 40, a: face > 0 ? 0 : Math.PI, half: 0.6, len: 230 };
    }
    k.warn = 0; k.peek = 0; k.eye = 0;
    return { ox: 690, oy: 220, a: 1.95, half: 0.75, len: 520 };
  }, name, face);
}

// One sample, all inside one page task, so no animation frame can run between "seen" and "drawn":
// freeze the watcher, put a standing Squatch with his eye point at (x, y), run two game updates (__ss.tick)
// and read whether the watcher saw him; then move him away and compare two frames, with and without the
// cone (only the cone changes between them); and read whether the sight line is clear.
async function sampleGas(name, x, y, eye, ox, oy) {
  return page.evaluate((name, x, y, eye, ox, oy) => {
    const ss = window.__ss, n = ss.op, k = ss.ch2, cv = document.querySelector("canvas").getContext("2d");
    const freeze = () => {
      if (name === "window") Object.assign(k, { warn: 0, peek: 99, eye: 0, peekT: 999 });
      else if (name === "rusty") Object.assign(k.rust, { nap: false, pause: 1e6, alert: 0 });
      else Object.assign(k.bots[0], { look: 0, x: k.bots[0].hx });
    };
    freeze();
    n.q = []; n.cur = null; n.live = []; n.sparks = [];
    Object.assign(n.sq, { x, y: y + eye, moving: false }); n.sqPose = "stand"; n.ctrl = true;
    k.sec = null; k.eye = 0;
    ss.tick(1 / 60); ss.tick(1 / 60);
    const seen = name === "window" ? k.eye > 0 || !!k.sec : !!k.sec;
    k.sec = null; k.eye = 0; n.live = []; n.sparks = [];
    freeze();
    // Squatch away, and no action label (the updates above may have offered one where he stood).
    n.sq.x = -500; n.act = null;
    const px = () => { ss.drawFrame(); return [...cv.getImageData(Math.round(x), Math.round(y), 1, 1).data].slice(0, 3); };
    let on, off;
    if (name === "window") { k.peek = 99; on = px(); k.peek = 0; off = px(); }
    else if (name === "rusty") { k.rust.nap = false; on = px(); k.rust.nap = true; off = px(); k.rust.nap = false; }
    else { k.bots[0].look = 0; on = px(); k.bots[0].look = 0.5; off = px(); k.bots[0].look = 0; }
    name === "window" && (k.peek = 0);
    return { seen, drawn: on.some((v, i) => Math.abs(v - off[i]) > 6), clear: ss.seeLine(ox, oy, x, y) };
  }, name, x, y, eye, ox, oy);
}

const report = [];
for (const [name, faces] of [["rusty", [1, -1]], ["pumpbot", [1, -1]], ["window", [0]]]) {
  for (const face of faces) {
    const c = await prepare(name, face);
    const b = await page.evaluate(() => window.__ss.walkBounds());
    const solids = await page.evaluate(() => window.__ss.solids());
    const samples = [];
    for (const side of [-1, 1])
      for (const [dA, kind] of [[-0.07, "inside"], [0.07, "outside"]])
        for (const f of [0.35, 0.55, 0.75, 0.92]) samples.push({ ang: c.a + side * (c.half + dA), dist: c.len * f, kind });
    for (const dA of [-0.3, 0, 0.3]) samples.push({ ang: c.a + dA * c.half, dist: c.len + 25, kind: "outside" }, { ang: c.a + dA * c.half, dist: c.len - 25, kind: "inside" });
    let checked = 0,
      blocked = 0;
    for (const s of samples) {
      const x = c.ox + Math.cos(s.ang) * s.dist, y = c.oy + Math.sin(s.ang) * s.dist;
      const feetY = y + CONES[name].eye;
      if (x < b.x0 + 2 || x > b.x1 - 2 || feetY < b.y0 + 2 || feetY > b.y1 - 2) continue; // Squatch cannot stand there
      if (solids.some((q) => x > q.x0 && x < q.x1 && feetY > q.y0 && feetY < q.y1)) continue; // inside a solid
      const { drawn, clear, seen } = await sampleGas(name, x, y, CONES[name].eye, c.ox, c.oy);
      checked++;
      s.kind === "inside" && !clear && blocked++;
      // Inside: seen and drawn, unless the sight line is blocked (by a pump or crate): then neither.
      const ok = s.kind === "inside" ? (clear ? drawn && seen : !drawn && !seen) : !drawn && !seen;
      if (!ok) report.push({ name, face, kind: s.kind, x: Math.round(x), y: Math.round(y), drawn, seen, clear, cur: await page.evaluate(() => { const n = window.__ss.op; return [n.cur && n.cur.k, n.q.length, n.ctrl, window.__ss.ch2.phase, n.room]; }) });
    }
    console.log(`  ${name}${face ? (face > 0 ? " facing right" : " facing left") : ""}: ${blocked} of the inside points are blocked by a solid (neither drawn nor seen)`);
    g.check(`${name}${face ? (face > 0 ? " facing right" : " facing left") : ""}: ${checked} sample points, the drawn cone and the seeing area agree`, checked >= 4 && !report.some((r) => r.name === name && r.face === face), report.filter((r) => r.name === name && r.face === face));
  }
}
// More watchers (review, 2026-11-07): the deck tourist, the three rover cones (pad 200, temple 240, ramp
// 230), the port bot, and the Chapter 1 hall bot (its cone and the 70 px circle round its feet). Here "drawn"
// is read from the shapes the frame actually drew (__ss.conesDrawn: origin, facing, width, length, and
// whether the drawing is cut where the sight line is blocked), so sprites drawn over a cone do not hide it.
const insideDrawn = (cones, x, y, feetY, clear) =>
  cones.some((c) => {
    if (c.circle) return Math.hypot(x - c.ox, feetY - c.oy) < c.len;
    const py = c.feet ? feetY : y, d = Math.hypot(x - c.ox, py - c.oy);
    let t = Math.atan2(py - c.oy, x - c.ox) - c.a;
    while (t > Math.PI) t -= 2 * Math.PI;
    while (t < -Math.PI) t += 2 * Math.PI;
    return d <= c.len && Math.abs(t) <= c.half && (!c.blocked || clear);
  });
const MORE = {
  tourist: {
    setup: { kind: "ch1", call: "sceneS1L", set: { op: { scene: "S1L", room: "deck", sqPose: "stand" } } },
    prep: () => {
      const ss = window.__ss, a = ss.s1, t = a.tour[0];
      a.tour = [t]; Object.assign(t, { sp: 0, alert: 0, run: null });
      a._home = { x: t.x, y: t.y };
      ss.op.mo.x = 2000;
      return { ox: t.x, oy: t.y - 30, a: -Math.PI / 2, half: 0.62, len: 185, eye: 0, avoid: [{ x: 790, y: 232, r: 90 }] };
    },
    freeze: () => { const a = window.__ss.s1, t = a.tour[0]; Object.assign(t, { alert: 0, run: null, x: a._home.x, y: a._home.y, sp: 0 }); a.alertBy = -1; a.seen = false; a.sec.on = false; },
    seen: () => { const a = window.__ss.s1, t = a.tour[0]; const v = a.alertBy >= 0 || a.seen; a.alertBy = -1; a.seen = false; Object.assign(t, { alert: 0, run: null, x: a._home.x, y: a._home.y }); a.sec.on = false; window.__ss.op.live = []; return v; },
  },
};
const rover = (phase, room, half, len) => ({
  setup: { kind: "ch3", room, phase, mops: false, extra: {} },
  prep: (phase, half, len) => {
    const ss = window.__ss, k = ss.ch3;
    const r = { x: 600, y: 500, hx: 600, hf: -1, f: -1, look: 0, pause: 1e6, alert: 0 };
    k.rov = [r]; k.phase = phase;
    return { ox: r.x, oy: r.y - 40, a: Math.PI - 0.15, half, len, eye: 40, avoid: [] };
  },
  args: [phase, half, len],
  seen: () => { const k = window.__ss.ch2; const v = !!k.sec; k.sec = null; window.__ss.ch3.rov.forEach((r) => Object.assign(r, { alert: 0, x: 600, f: -1, look: 0 })); return v; },
  freeze: () => { window.__ss.ch3.rov.forEach((r) => Object.assign(r, { alert: 0, x: 600, hx: 600, f: -1, look: 0, pause: 1e6 })); },
});
MORE["rover, pad"] = rover("p1", "pad", 0.55, 200);
MORE["rover, temple"] = rover("p3", "temple", 0.55, 240);
MORE["rover, ramp"] = rover("p4a", "pad", 0.6, 230);
MORE["port bot"] = {
  setup: { kind: "ch4", room: "port", phase: "m1", mops: false, extra: {}, found: [] },
  prep: () => {
    const ss = window.__ss, k = ss.ch4;
    k.bot = { x: 600, y: 500, hx: 600, hf: -1, f: -1, look: 0 };
    return { ox: 600, oy: 460, a: Math.PI - 0.15, half: 0.55, len: 220, eye: 40, avoid: [], light: true };
  },
  seen: () => { const k = window.__ss.ch2; const v = !!k.sec; k.sec = null; Object.assign(window.__ss.ch4.bot, { x: 600, f: -1, look: 0 }); return v; },
  freeze: () => { Object.assign(window.__ss.ch4.bot, { x: 600, hx: 600, f: -1, look: 0 }); },
};
// One sample in one page task (see sampleGas): two game updates with Squatch standing there, read "seen";
// then, with him moved away, draw one frame and read the drawn shapes from that same frame.
async function judge(geo, x, y, feetY, seenFn, freezeFn) {
  return page.evaluate((ox, oy, x, y, feetY, seenSrc, freezeSrc, insideSrc) => {
    const ss = window.__ss, n = ss.op;
    const freeze = freezeSrc ? new Function("return (" + freezeSrc + ")()") : () => {};
    freeze();
    n.q = []; n.cur = null; n.live = []; n.sparks = [];
    Object.assign(n.sq, { x, y: feetY, moving: false }); n.sqPose = "stand"; n.ctrl = true; ss.ch2.sec = null;
    ss.tick(1 / 60); ss.tick(1 / 60);
    const seen = new Function("return (" + seenSrc + ")()")();
    freeze();
    n.sq.x = -500; n.live = []; n.act = null;
    ss.drawFrame();
    const cones = ss.conesDrawn(), clear = ss.seeLine(ox, oy, x, y);
    const drawn = new Function("return (" + insideSrc + ")")()(cones, x, y, feetY, clear);
    return { drawn, seen, clear, cones: cones.length };
  }, geo.ox, geo.oy, x, y, feetY, seenFn.toString(), freezeFn ? freezeFn.toString() : "", insideDrawn.toString());
}
for (const [name, c] of Object.entries(MORE)) {
  await page.evaluate(setState, c.setup);
  const geo = await page.evaluate(c.prep, ...(c.args || []));
  const b = await page.evaluate(() => window.__ss.walkBounds());
  const solids = await page.evaluate(() => window.__ss.solids());
  const pts = [];
  for (const side of [-1, 1])
    for (const [dA, kind] of [[-0.08, "inside"], [0.08, "outside"]])
      for (const f of [0.45, 0.7, 0.9]) pts.push({ ang: geo.a + side * (geo.half + dA), dist: geo.len * f, kind });
  for (const dA of [-0.3, 0.3]) pts.push({ ang: geo.a + dA * geo.half, dist: geo.len + 25, kind: "outside" }, { ang: geo.a + dA * geo.half, dist: geo.len - 25, kind: "inside" });
  const bad = [];
  let checked = 0;
  for (const s0 of pts) {
    const x = geo.ox + Math.cos(s0.ang) * s0.dist, y = geo.oy + Math.sin(s0.ang) * s0.dist, feetY = y + geo.eye;
    if (x < b.x0 + 2 || x > b.x1 - 2 || feetY < b.y0 + 2 || feetY > b.y1 - 2) continue;
    if (solids.some((q) => x > q.x0 && x < q.x1 && feetY > q.y0 && feetY < q.y1)) continue;
    if (geo.avoid.some((v) => Math.hypot(x - v.x, feetY - v.y) < v.r)) continue;
    if (geo.light && (await page.evaluate(([x, y]) => window.__ss.inLight4(x, y), [x, feetY]))) continue; // the searchlight is its own watcher
    const r = await judge(geo, x, y, feetY, c.seen, c.freeze);
    checked++;
    if (r.drawn !== r.seen) bad.push({ kind: s0.kind, x: Math.round(x), y: Math.round(y), ...r });
  }
  g.check(`${name}: ${checked} sample points, the drawn cone and the seeing area agree`, checked >= 4 && bad.length === 0, bad);
}

// The Chapter 1 hall bot: its cone and the 70 px circle round its feet.
{
  await page.evaluate(setState, { kind: "ch1", call: "sceneS6", set: { op: { scene: "S7", room: "hall", sqPose: "stand" } } });
  await page.evaluate(() => { const ss = window.__ss; ss.hall.bots = [{ x: 700, y: 470, light: true, on: true }]; ss.op.seeGrace = 0; });
  const hallFreeze = () => { const ss = window.__ss; ss.hallAlarm.on = false; ss.hall.freakT = -9; Object.assign(ss.hall.bots[0], { x: 700, y: 470, light: true, on: true }); ss.op.seeGrace = 0; };
  const hallSeen = () => { const ss = window.__ss, v = ss.hallAlarm.on; ss.hallAlarm.on = false; ss.hall.freakT = -9; ss.hall.bots[0].x = 700; ss.hall.bots[0].y = 470; return v; };
  const res = [];
  for (const [dx, dy] of [[0, -58], [0, -84], [-58, 0], [-84, -20]]) {
    const r = await judge({ ox: 700, oy: 420 }, 700 + dx, 470 + dy - 30, 470 + dy, hallSeen, hallFreeze);
    res.push({ dx, dy, ...r });
  }
  g.check("Chapter 1 hall bot: inside its drawn cone or 70 px circle it sees Squatch, outside it does not", res.every((r) => r.drawn === r.seen) && res.some((r) => r.seen) && res.some((r) => !r.seen), res);
}

g.check("no page errors", errors.length === 0, errors);
await g.finish("cone-match");
