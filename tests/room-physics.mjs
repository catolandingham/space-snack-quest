/**
 * Nobody walks, rolls or pushes through anything, and a thing in a locked picture never covers someone standing in front
 * of it (src/modules/room-model.js; Brian's video notes of 2026-11-27: r5 4:38 "the janitor is walking on the bar", r5
 * 9:29 "the robot appears to just be able to move through things", r5 12:08 and r6 2:26 Mops hidden by the crate bed,
 * r6 3:07 to 3:19 the crate pushed through the bar, the robot, the crates and the wall).
 * The room model writes down every move that could not keep out of a solid (physicsLog) and checks where everyone and
 * the pushed crate stand (physicsNow); every part below samples it the whole time and fails on any entry.
 *   1. the model itself (node): a walk round a box, out of a box first, a place in a box written down;
 *   2. the push (pickup:push): Mops pushes his crate home to the mail room, shoved first into the snack counter: the
 *      crate never touches a solid, the counter stops it, and it arrives;
 *   3. 36b (bay:hall): Squatch walks along the counter's front; Mops follows him and never stands in the counter;
 *   4. night one's alarm (evening:143, POST · mailbox): the night robot runs to the FUR alarm round the walkway, the
 *      plant and the bin, never through them;
 *   5. home (pickup:mop): Squatch behind the crate bed, Mops in front of it: Mops is drawn (his pixels over the bed),
 *      and the bed is painted over Squatch alone.
 *   SSQ_PORT_OFFSET=800 node tests/room-physics.mjs
 */
import { startGame, sleep, root } from "./game-page.mjs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const mod = (f) => import(pathToFileURL(join(root, "src", "modules", f)).href);
const RM = await mod("room-model.js");
const { BAY_SOLIDS } = await mod("bay-watch.js");

const { open, check, finish } = await startGame({ port: 9861, name: "room physics" });
const PHONE = { width: 375, height: 812 };

// ---------- 1. the model ----------
{
  const box = { x0: 100, x1: 200, y0: 100, y1: 200 },
    bounds = { x0: 0, x1: 400, y0: 0, y1: 400 };
  const way = [];
  let at = { x: 50, y: 150 };
  for (let i = 0; i < 400 && Math.hypot(at.x - 300, at.y - 150) > 1; i++) {
    const w = RM.waypointAmong("t1", at, 300, 150, "test", [box], bounds) || { x: 300, y: 150 },
      d = Math.hypot(w.x - at.x, w.y - at.y),
      s = Math.min(d, 4);
    at = d ? { x: at.x + ((w.x - at.x) / d) * s, y: at.y + ((w.y - at.y) / d) * s } : at;
    way.push(at);
  }
  check("the model: a walk past a box goes round it, never into it", way.every((p) => !RM.blockedAt([box], p.x, p.y)) && Math.hypot(at.x - 300, at.y - 150) <= 1, way.find((p) => RM.blockedAt([box], p.x, p.y)));
  // a second walk by the same walker to the same place, from somewhere else, works its way out again (the reviewer's
  // case: an old way round, reused, cut through the box)
  const walk = (id, from) => {
    let p = { ...from };
    const pts = [];
    for (let i = 0; i < 400 && Math.hypot(p.x - 300, p.y - 150) > 1; i++) {
      const w = RM.waypointAmong(id, p, 300, 150, "test", [box], bounds) || { x: 300, y: 150 },
        d = Math.hypot(w.x - p.x, w.y - p.y),
        s = Math.min(d, 4);
      p = d ? { x: p.x + ((w.x - p.x) / d) * s, y: p.y + ((w.y - p.y) / d) * s } : p;
      pts.push(p);
    }
    return pts;
  };
  walk("t4", { x: 50, y: 150 });
  const again = walk("t4", { x: 50, y: 195 });
  check("the model: a later walk to the same place never reuses an old way through the box", again.every((p) => !RM.blockedAt([box], p.x, p.y)), again.find((p) => RM.blockedAt([box], p.x, p.y)));
  const out = RM.waypointAmong("t2", { x: 150, y: 190 }, 300, 150, "test", [box], bounds);
  check("the model: someone standing inside a thing walks out of it the shortest way first", !!out && out.y >= 200 && Math.abs(out.x - 150) < 8, out);
  check("the model: a clear walk goes straight (no corner)", RM.waypointAmong("t3", { x: 50, y: 300 }, 350, 300, "test", [box], bounds) === null);
  check("the model: Mops is wider than a feet box in the party hall, Squatch is not", RM.bodyExtra("mops", "hall") > 0 && RM.bodyExtra("sq", "hall") <= 8);
}

const press = (page) =>
  page.evaluate(() => {
    const b = document.querySelector('[role="button"]');
    b && b.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    b && b.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
  });
const tapAt = (page, x, y) => page.evaluate(([x, y]) => window.__ss.tapAt(x, y, false), [x, y]);
const now = (page) => page.evaluate(() => ({ v: window.SSQ.physicsNow(), log: window.SSQ.physicsLog() }));

// ---------- 2. the push ----------
{
  const { page, errors } = await open("?beat=pickup:push", PHONE);
  const st = () =>
    page.evaluate(() => {
      const n = window.__ss.op,
        c = n.cur,
        d = window.SSQ.beat("ch1-pickup").debug().state || {};
      return { room: n.room, ctrl: !!n.ctrl, cur: c ? c.k : "", mo: { x: n.mo.x, y: n.mo.y }, step: d.step, stops: d.crateStops || 0, v: window.SSQ.physicsNow(), spots: window.__ss.spotsNow().map((q) => ({ id: q.id, x: q.x, y: q.y })) };
    });
  const viol = [],
    rooms = [];
  let last = 0,
    shoved = false,
    stopsAtCounter = 0,
    atCounter = null,
    s = null;
  const end = Date.now() + 90000;
  while (Date.now() < end) {
    s = await st();
    viol.push(...s.v);
    rooms[rooms.length - 1] !== s.room && rooms.push(s.room);
    if (s.step !== "push") break;
    if (["bub", "card"].includes(s.cur)) {
      await sleep(250);
      await press(page);
      continue;
    }
    if (s.ctrl && Date.now() - last > 900) {
      last = Date.now();
      // in the hall: first held straight right, at the snack counter (the arrow key), for two seconds
      if (s.room === "hall" && !shoved) {
        shoved = true;
        const before = s.stops;
        await page.evaluate(() => window.dispatchEvent(new KeyboardEvent("keydown", { code: "ArrowRight", bubbles: true })));
        for (let k = 0; k < 20; k++) (viol.push(...(await st()).v), await sleep(100));
        await page.evaluate(() => window.dispatchEvent(new KeyboardEvent("keyup", { code: "ArrowRight", bubbles: true })));
        const after = await st();
        stopsAtCounter = after.stops - before;
        atCounter = after.mo;
      } else {
        const sp = s.spots.find((q) => q.id === "pk-door" || q.id === "pk-row");
        sp && (await tapAt(page, sp.x, sp.y));
      }
    }
    await sleep(110);
  }
  const p = await now(page);
  check("the push: Mops takes his crate from home through the hall and the hallway to the mail room", s.step !== "push" && rooms.join(">") === "closet>hall>passage>hangar", { step: s.step, rooms });
  check("the push: his crate never stands in anything (the counter, the guests, the hallway robot, the walkway, the walls)", viol.length === 0, viol.slice(0, 4));
  check("the push: shoved at the snack counter, the counter stops the crate (Mops stays a crate's length from it)", stopsAtCounter > 0 && atCounter && atCounter.x < 806 - 60, { stopsAtCounter, atCounter });
  check("the push: no move went through a solid (the model's record)", p.log.length === 0, p.log.slice(0, 4));
  check("the push: no page errors", errors.length === 0, errors);
  await page.close();
}

// ---------- 3. 36b: Mops follows along the counter ----------
{
  const { page, errors } = await open("?beat=bay:hall", PHONE);
  const pts = [
      [850, 340],
      [700, 330],
      [700, 520],
      [760, 560],
      [700, 590],
      [772, 584],
    ],
    viol = [];
  let i = 0,
    last = 0;
  const end = Date.now() + 40000;
  while (Date.now() < end && i <= pts.length + 2) {
    const s = await page.evaluate(() => ({ ctrl: !!window.__ss.op.ctrl, cur: window.__ss.op.cur ? window.__ss.op.cur.k : "", v: window.SSQ.physicsNow() }));
    viol.push(...s.v);
    if (s.cur === "bub") {
      await press(page);
      await sleep(250);
      continue;
    }
    if (s.ctrl && Date.now() - last > 1200) ((last = Date.now()), await tapAt(page, ...pts[Math.min(i++, pts.length - 1)]));
    await sleep(110);
  }
  const p = await now(page);
  check("36b: Mops following Squatch along the snack counter never stands in it (or in anyone)", viol.length === 0 && i > pts.length, { viol: viol.slice(0, 4), taps: i });
  check("36b: no move went through a solid", p.log.length === 0, p.log.slice(0, 4));
  check("36b: no page errors", errors.length === 0, errors);
  await page.close();
}

// ---------- 4. night one's alarm: the robot runs round things ----------
{
  const { page, errors } = await open("?beat=evening:143", PHONE);
  await page.waitForFunction(() => window.__ss.op.ctrl && window.__ss.spotsNow().some((q) => q.verb === "POST"), { timeout: 15000 });
  const sp = await page.evaluate(() => window.__ss.spotsNow().find((q) => q.verb === "POST"));
  // (put by hand at the mailbox only to start the alarm: this part is about the robot's run, not his walk there)
  await page.evaluate(([x, y]) => ((window.__ss.op.sq.x = x), (window.__ss.op.sq.y = y)), [sp.x, sp.y]);
  await sleep(200);
  await press(page);
  const track = [];
  const end = Date.now() + 12000;
  while (Date.now() < end) {
    const s = await page.evaluate(() => {
      const n = window.__ss.op,
        a = n.ch1Evening && n.ch1Evening.alarm;
      return { cur: n.cur ? n.cur.k : "", w: a ? { x: a.w.x, y: a.w.y, phase: a.phase } : null };
    });
    if (s.cur === "bub") await press(page);
    s.w && track.push(s.w);
    if (s.w && ["search", "home"].includes(s.w.phase)) break;
    await sleep(60);
  }
  const start = track[0],
    startIn = start ? BAY_SOLIDS.filter((b) => start.x > b.x0 && start.x < b.x1 && start.y > b.y0 && start.y < b.y1) : [];
  // once out of the walkway it stood on, it never steps into a thing
  let left = false;
  const bad = [];
  for (const p of track) {
    const inside = BAY_SOLIDS.filter((b) => p.x > b.x0 && p.x < b.x1 && p.y > b.y0 && p.y < b.y1);
    left = left || !inside.some((b) => startIn.includes(b));
    left && inside.length && bad.push({ x: Math.round(p.x), y: Math.round(p.y), in: inside.map((b) => b.id) });
  }
  const ran = track.some((p) => p.phase === "run") && track.some((p) => Math.hypot(p.x - 112, p.y - 330) < 4);
  check("night one: the robot runs from the scanner to the FUR alarm", ran, track.slice(-2));
  check("night one: on its run it never rolls over the walkway, the plant, the bin or a wall", bad.length === 0, bad.slice(0, 4));
  check("night one: no move went through a solid", (await now(page)).log.length === 0, (await now(page)).log.slice(0, 4));
  check("night one: no page errors", errors.length === 0, errors);
  await page.close();
}

// ---------- 5. home: the crate bed covers only who is behind it ----------
{
  const { page, errors } = await open("?beat=pickup:mop", PHONE);
  await page.waitForFunction(() => window.__ss.op.room === "closet", { timeout: 15000 });
  const r = await page.evaluate(() => {
    const n = window.__ss.op,
      c = document.querySelector("canvas").getContext("2d");
    // (Squatch behind the bed, Mops in front of it at the first tuft, as in r6 2:26 and r5 12:08)
    Object.assign(n.sq, { x: 180, y: 392 });
    n.sqPose = "stand";
    Object.assign(n.mo, { x: 250, y: 572, f: -1 });
    n.moPose = "stand";
    const grab = () => (window.__ss.drawFrame(), c.getImageData(200, 470, 80, 55).data);
    const shown = grab(),
      depth = window.SSQ.homeDepthDrawn();
    n.moPose = "hidden";
    const hidden = grab();
    n.moPose = "stand";
    let diff = 0;
    for (let i = 0; i < shown.length; i += 4) Math.abs(shown[i] - hidden[i]) + Math.abs(shown[i + 1] - hidden[i + 1]) + Math.abs(shown[i + 2] - hidden[i + 2]) > 60 && diff++;
    return { diff, depth };
  });
  check("home: Mops standing in front of the crate bed is drawn over it (his pixels show where the bed is)", r.diff > 600, r);
  const bed = r.depth.find((d) => d.id === "bed");
  check("home: the bed is painted again over Squatch behind it, never over Mops in front", !!bed && bed.over.includes("sq") && !bed.over.includes("mops") && bed.front.includes("mops"), r.depth);
  check("home: no page errors", errors.length === 0, errors);
  await page.close();
}

await finish("room physics");
