/**
 * The drawn sight cone is the place that sees Squatch (Phase 3, T19 addition, Brian's play of 2026-11-07:
 * "Rusty seems to catch Squatch only when he is directly in front").
 * For Rusty, a pump bot and Gloop's kitchen window: sample points just inside and just outside the drawn
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

// Was the cone drawn at (x, y)? Compare the picture with and without the cone, Squatch out of the way.
async function drawnAt(name, x, y) {
  return page.evaluate((name, x, y) => {
    const ss = window.__ss, n = ss.op, k = ss.ch2, cv = document.querySelector("canvas").getContext("2d");
    const keep = { x: n.sq.x, y: n.sq.y };
    n.sq.x = -500; n.live = []; n.sparks = [];
    const px = () => { ss.drawFrame(); return [...cv.getImageData(Math.round(x), Math.round(y), 1, 1).data].slice(0, 3); };
    let on, off;
    // Only the cone changes between the two frames: the window's look, Rusty's nap, the bot's look.
    if (name === "window") { k.peek = 99; on = px(); k.peek = 0; off = px(); }
    else if (name === "rusty") { k.rust.nap = false; on = px(); k.rust.nap = true; off = px(); k.rust.nap = false; }
    else { k.bots[0].look = 0; on = px(); k.bots[0].look = 0.5; off = px(); k.bots[0].look = 0; }
    n.sq.x = keep.x; n.sq.y = keep.y;
    return on.some((v, i) => Math.abs(v - off[i]) > 6);
  }, name, x, y);
}

// Does the game see a standing Squatch whose eye point is (x, y)?
async function seenAt(name, x, y, eye) {
  await page.evaluate((name, x, y, eye) => {
    const ss = window.__ss, n = ss.op, k = ss.ch2;
    Object.assign(n.sq, { x, y: y + eye, moving: false }); n.sqPose = "stand"; n.ctrl = true;
    k.sec = null; k.eye = 0;
    if (name === "window") { k.warn = 0; k.peek = 99; }
  }, name, x, y, eye);
  await sleep(140);
  return page.evaluate((name) => {
    const k = window.__ss.ch2;
    const seen = name === "window" ? k.eye > 0 || !!k.sec : !!k.sec;
    k.sec = null; k.eye = 0; k.peek = 0;
    return seen;
  }, name);
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
      const drawn = await drawnAt(name, x, y);
      const clear = await page.evaluate(([ox, oy, x, y]) => window.__ss.seeLine(ox, oy, x, y), [c.ox, c.oy, x, y]);
      const seen = await seenAt(name, x, y, CONES[name].eye);
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
g.check("no page errors", errors.length === 0, errors);
await g.finish("cone-match");
