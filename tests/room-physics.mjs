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
 *   4. night one's alarm (evening:143, POST · mailbox wakes the robots, then he stands in the night robot's look): it
 *      runs to the FUR alarm round the walkway, the
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
const { adultPxFor } = await mod("room-sizes.js");
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
  // a load pushed ahead of him (a crate to his right, its floor 18 behind his feet): his feet may not pass just in
  // front of a table whose box ends above them, because the load would touch it (2026-11-27, the kid robot's pickup day)
  RM.setCarry(() => ({ reach: 100, f: 1, near: 20, far: 120, up: 18, down: 6 }));
  const table = { x0: 300, x1: 380, y0: 100, y1: 160 },
    grown = RM.moverSolids("sq", { x: 0, y: 0 }, [table], "test");
  check("the model: a pushed load's floor keeps his feet from walking it into a table's front (feet 10 below the table's box, the load just past it)", RM.blockedAt(grown, 300 - 30, 170) && !RM.blockedAt(grown, 300 - 30, 180) && !RM.blockedAt(grown, 300 - 125, 170), grown);
  RM.setCarry(null);
  // two people side by side on one row: the follower keeps far enough back that their drawings do not cover each other
  // (beat 52, home at night: a fixed 60 had Mops inside Squatch at home, where both are drawn three times bigger)
  const sideBySide = (room) => {
    // (the scales the game draws them at: three at home, the older program's wl; elsewhere the room rule, Mops 1.15
    // times Squatch: escape.js and pickup.js sqScale, moScale)
    const sq = room === "closet" ? 3 : (adultPxFor(room) * 0.8) / 45,
      mo = room === "closet" ? 3 : sq * 1.15,
      g = RM.followGap(room),
      a = RM.personBox("sq", 500, 400, sq),
      b = RM.personBox("mops", 500 - g, 400, mo);
    return Math.max(0, b.x1 - a.x0) / (a.x1 - a.x0);
  };
  check("the model: Mops following Squatch on a row covers at most a sixth of him, at home, in the hall, the hallway and the bay", ["closet", "hall", "passage", "hangar"].every((r) => sideBySide(r) <= 1 / 6), ["closet", "hall", "passage", "hangar"].map((r) => [r, RM.followGap(r), sideBySide(r).toFixed(2)]));
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
  // under the table's front with the crate (where the kid robot's tap walked him on 2026-11-27): a tap at the doorway
  // still takes him there (before, every step but one was taken back, and he stood there for good)
  const second = await open("?beat=pickup:push", PHONE);
  let t = null;
  for (let i = 0; i < 200; i++) {
    t = await second.page.evaluate(() => ({ room: window.__ss.op.room, ctrl: !!window.__ss.op.ctrl, cur: window.__ss.op.cur ? window.__ss.op.cur.k : "", door: window.__ss.spotsNow().find((q) => q.id === "pk-door") || null }));
    if (t.room === "hall" && t.ctrl && !t.cur) break;
    if (["bub", "card"].includes(t.cur)) await press(second.page);
    else if (t.ctrl && t.door) await tapAt(second.page, t.door.x, t.door.y);
    await sleep(300);
  }
  await second.page.evaluate(() => Object.assign(window.__ss.op.mo, { x: 688, y: 480, f: 1 }));
  await sleep(100);
  const door = await second.page.evaluate(() => window.__ss.spotsNow().find((q) => q.id === "pk-door"));
  let left = null;
  for (let i = 0; i < 30 && door; i++) {
    left = await second.page.evaluate(() => ({ room: window.__ss.op.room, x: window.__ss.op.mo.x, y: window.__ss.op.mo.y }));
    if (left.room !== "hall") break;
    i % 6 === 0 && (await tapAt(second.page, door.x, door.y));
    await sleep(250);
  }
  check("the push: from under the hall table's front, a tap at the doorway takes Mops and his crate out of the hall", !!left && left.room === "passage", left);
  await second.page.close();
  const p = await now(page);
  check("the push: Mops takes his crate from home through the hall and the hallway to the mail room", s.step !== "push" && rooms.join(">") === "closet>hall>passage>hangar", { step: s.step, rooms });
  check("the push: his crate never stands in anything (the counter, the guests, the hallway robot, the walkway, the walls)", viol.length === 0, viol.slice(0, 4));
  // (since 2026-11-27 his own walk keeps the crate's floor off the counter, so the push's take-back may never be needed)
  check("the push: shoved at the snack counter, the counter stops the crate (Mops stays a crate's length from it)", atCounter && atCounter.x < 806 - 60 && atCounter.x > 600, { stopsAtCounter, atCounter });
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
  const end = Date.now() + 16000;
  let placed = false;
  while (Date.now() < end) {
    const s = await page.evaluate(() => {
      const n = window.__ss.op,
        a = n.ch1Evening && n.ch1Evening.alarm;
      return { cur: n.cur ? n.cur.k : "", awake: !!(n.ch1Evening && n.ch1Evening.awake), ctrl: !!n.ctrl, w: a ? { x: a.w.x, y: a.w.y, phase: a.phase } : null };
    });
    if (s.cur === "bub") await press(page);
    // (round 7, q: 125: the post only wakes the robots; once awake, he stands along the front in the night robot's
    // look, as tools/evening-showing.mjs "seen" walks him, so the robot sees him and runs to the alarm)
    if (!placed && s.awake && s.ctrl && !s.cur && !s.w) {
      placed = true;
      await page.evaluate(() => ((window.__ss.op.sq.x = 450), (window.__ss.op.sq.y = 585)));
    }
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
