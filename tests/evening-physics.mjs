/**
 * The evening's physics and looks (src/modules/evening.js; Brian's notes on the beats 37 to 42 videos, 2026-11-26):
 *   - every room shown at night has the night look (night-look.js): the bay its locked night picture, home, the hall
 *     and the hallway their day picture under the one night tint (darker than by day, measured on the canvas), the
 *     hall's window kept bright, Squatch lit over it; the bedtime story's night colour is the same tint;
 *   - every robot shows its cone (the hallway's, the bay's night robot, the two parked in the mail room, the woken
 *     ones), and the hallway robot rolls along the floor's middle and out through a doorway, never over the office
 *     door in the front wall or through a wall;
 *   - nobody walks through anything: every scripted walk (the two in line, the family, Mops, the run to the vent, the
 *     woken robots) keeps its feet off the room's furniture and walls (the mail room's fence too), and Squatch's walk
 *     from his bed to the door goes round Mops asleep on the floor;
 *   - Mops asleep: on his back, his head against his bucket, his feet in the air;
 *   - the vents: the bay's floor vent pulls his fur in (the party's vent rule) and the alarm follows ("by the vent");
 *     the big wall vent has no swirl (round 7: the floor vent takes the pink sheet).
 *   node tests/evening-physics.mjs
 */
import { join } from "node:path";
import { startGame, root } from "./game-page.mjs";

const M = (f) => join(root, "src", "modules", f);
const PL = await import(M("evening-place.js"));
const NL = await import(M("night-look.js"));
const LP = await import(M("lunch-sneak-place.js"));
const g = await startGame({ port: 9783, name: "evening-physics" });
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true };

const { page, errors } = await g.open("?beat=evening:37", PHONE);
await new Promise((r) => setTimeout(r, 900));
await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op;
  window.__run = (secs, until, each) => {
    for (let i = 0; i < secs * 20; i++) {
      if (until && until()) return true;
      if (n.cur && (n.cur.k === "bub" || n.cur.k === "card") && (n.bt || 0) > 0.6) ((n.bt = 1), ss.opTap());
      ss.tick(0.05);
      each && each();
    }
    return until ? !!until() : true;
  };
  window.__st = () => (n.ch1Evening || {}).step;
  window.__jump = (b) => ((n.q = []), (n.cur = null), ss.ch1JumpBeat(b), ss.tick(0.05));
  // the mean brightness of the canvas over a box of game positions
  window.__light = (b) => {
    const cv = [...document.querySelectorAll("canvas")].find((c) => c.style.position !== "fixed"),
      k = cv.width / 960,
      cx = cv.getContext("2d", { willReadFrequently: true }),
      d = cx.getImageData(Math.round(b.x0 * k), Math.round(b.y0 * k), Math.round((b.x1 - b.x0) * k), Math.round((b.y1 - b.y0) * k)).data;
    let sum = 0;
    for (let i = 0; i < d.length; i += 4) sum += (d[i] + d[i + 1] + d[i + 2]) / 3;
    return sum / (d.length / 4);
  };
});
const ev = (f, a) => page.evaluate(f, a);
const { BEDTIME_NIGHT } = await import(M("bedtime-story.js"));
// (the strength is the night look's own, night-look.js NIGHT_TINT on the lowest branch; the bedtime story's lights-out
// dim goes on top of it)
g.check("the bedtime story's night colour is the night look's (one rule)", BEDTIME_NIGHT.color === NL.NIGHT_TINT.color);

// ---------- night: every room shown has the night look ----------
const night = await ev(() => {
  const n = window.__ss.op,
    b = window.SSQ.beat("ch1-evening"),
    out = {};
  // by day: the same places in the hall (beat 39), the hallway (37) and home (40)
  const floorOf = { hall: { x0: 60, y0: 520, x1: 300, y1: 600 }, passage: { x0: 100, y0: 430, x1: 400, y1: 470 }, closet: { x0: 620, y0: 486, x1: 860, y1: 575 } };
  const day = {};
  for (const [beat, room] of [[39, "hall"], [37, "passage"], [40, "closet"]]) {
    window.__jump(beat);
    window.__run(0.3);
    window.__ss.drawFrame();
    day[room] = window.__light(floorOf[room]);
  }
  // night one, room by room as he sneaks
  const at = (step, room, beat, x, y) => {
    window.__jump(beat);
    if (x != null) {
      n.sq.x = x;
      n.sq.y = y;
      window.__run(10, () => window.__st() === step && n.ctrl);
    }
    window.__run(0.2);
    b.debug();
    window.__ss.drawFrame();
    const d = b.debug();
    out[step] = { room: n.room, night: d.night[n.room] || null, light: floorOf[n.room] ? +window.__light(floorOf[n.room]).toFixed(1) : null, day: floorOf[n.room] ? +day[n.room].toFixed(1) : null };
  };
  at("out", "closet", 42);
  at("nighthall", "hall", 42, 860, 440);
  at("nightway", "passage", 42, 860, 440);
  // (on into the hallway)
  window.__jump(42);
  n.sq.x = 860;
  n.sq.y = 440;
  window.__run(10, () => window.__st() === "nighthall" && n.ctrl);
  n.sq.x = 905;
  n.sq.y = 320;
  window.__run(10, () => window.__st() === "nightway" && n.ctrl);
  window.__run(0.2);
  b.debug();
  window.__ss.drawFrame();
  out.nightway = { room: n.room, night: b.debug().night.passage || null, light: +window.__light(floorOf.passage).toFixed(1), day: +day.passage.toFixed(1) };
  at("bin", "hangar", 142);
  // the hall's window stays bright at night
  window.__jump(42);
  n.sq.x = 860;
  n.sq.y = 440;
  window.__run(10, () => window.__st() === "nighthall" && n.ctrl);
  window.__run(0.2);
  window.__ss.drawFrame();
  out.window = +window.__light({ x0: 100, y0: 180, x1: 500, y1: 220 }).toFixed(1);
  window.__jump(39);
  window.__run(0.2);
  // (by day the window here has Jupiter's storm in it, beat 38a: compare with the window as the picture has it)
  n.ch1Evening.storm = -1;
  window.__ss.drawFrame();
  out.windowDay = +window.__light({ x0: 100, y0: 180, x1: 500, y1: 220 }).toFixed(1);
  return out;
});
// (the joined night look's tint is the lowest branch's, 0.5; the evening's own copy had 0.58, so its floors are about
// three quarters of the day's light, not under 0.7 of it)
for (const [step, room] of [["out", "closet"], ["nighthall", "hall"], ["nightway", "passage"]]) {
  const r = night[step];
  g.check(`night one, ${room}: the night look (the one tint), the floor clearly darker than by day`, r.room === room && r.night && r.night.tint >= NL.NIGHT_TINT.alpha - 0.01 && r.light < r.day * 0.8, r);
}
g.check("night one, the loading bay: its own locked night picture", night.bin.room === "hangar" && night.bin.night && night.bin.night.picture, night.bin);
g.check("the hall's window onto space keeps its light at night", Math.abs(night.window - night.windowDay) < 6, { night: night.window, day: night.windowDay });

// ---------- robots: every one shows its cone; the hallway robot rolls along the floor ----------
const robots = await ev(() => {
  const n = window.__ss.op,
    b = window.SSQ.beat("ch1-evening"),
    out = { path: [], cones: [] };
  window.__jump(37);
  // past photo 5: the robot rolls through
  b.debug();
  const s = n.ch1Evening;
  n.sq.x = 480;
  n.sq.y = 300;
  window.__ss.tick(0.05);
  const look = window.__ss.offerNow();
  look && look.f();
  for (let i = 0; i < 6; i++) b.viewAct();
  window.__run(25, () => window.__st() === "wall" && n.ctrl, () => {
    const r = n.ch1Evening.robot;
    if (!r) return;
    out.path.push([Math.round(r.x), Math.round(r.y)]);
    window.__ss.drawFrame();
    // (in the hallway: waiting outside the hall's doorway first, it is not in the picture)
    r.x > 20 && r.x < 940 && out.cones.push(window.__ss.conesDrawn().some((c) => c.id === "hallway-robot"));
  });
  // the bay: before the post (the night robot, the two parked), after (the night robot, the two woken)
  window.__jump(142);
  window.__run(0.2);
  window.__ss.drawFrame();
  out.bayBefore = window.__ss.conesDrawn().map((c) => c.id);
  // the way in to the mailbox (the showing's and a kid's: along the front, up to the mail room's opening, in):
  // no parked robot's cone is on him anywhere along it
  window.__jump(143);
  window.__run(0.2);
  const way = [[300, 585], [640, 585], [690, 470], [760, 490], [862, 500]];
  out.wayIn = [];
  for (let i = 0; i + 1 < way.length; i++)
    for (let t = 0; t <= 1; t += 0.1) {
      n.sq.x = way[i][0] + (way[i + 1][0] - way[i][0]) * t;
      n.sq.y = way[i][1] + (way[i + 1][1] - way[i][1]) * t;
      window.__ss.drawFrame();
      const on = (window.SSQ.beat("ch1-evening").debug().drew.cones || []).filter((c) => (c.id === "robot-2" || c.id === "robot-3") && c.inside).map((c) => c.id);
      on.length && out.wayIn.push([Math.round(n.sq.x), Math.round(n.sq.y), on]);
    }
  window.__jump(144);
  window.__run(0.2);
  window.__ss.drawFrame();
  out.bayAfter = window.__ss.conesDrawn().map((c) => c.id);
  return out;
});
const door = PL.EV_HALLWAY.officeDoor,
  onDoor = robots.path.filter(([x, y]) => x + 22 > door.x0 && x - 22 < door.x1 && y + 8 > door.y0),
  offFloor = robots.path.filter(([x, y]) => x > 48 && x < 912 && (y < 256 || y > 590)),
  throughWall = robots.path.filter(([x, y]) => (x <= 48 || x >= 912) && (y < 266 || y > 354));
g.check("the hallway robot rolls along the floor and out through a doorway: never over the office door, never through a wall", robots.path.length > 20 && !onDoor.length && !offFloor.length && !throughWall.length, { onDoor: onDoor.slice(0, 3), offFloor: offFloor.slice(0, 3), throughWall: throughWall.slice(0, 3), n: robots.path.length });
g.check("the hallway robot shows its cone the whole time it is in the hallway", robots.cones.length > 20 && robots.cones.every(Boolean), { frames: robots.cones.length, without: robots.cones.filter((x) => !x).length });
// (round 7, r5 9:29, q: 125: the bay's robots sleep, zzz and no cones, until the loud post wakes them; awake, every one
// shows its cone)
g.check("in the bay the robots sleep with no cones before the post, and once awake every robot shows its cone (the night robot and the two in the mail room)", !["night-robot", "robot-2", "robot-3"].some((id) => robots.bayBefore.includes(id)) && ["night-robot", "robot-2", "robot-3"].every((id) => robots.bayAfter.includes(id)), { before: robots.bayBefore, after: robots.bayAfter });
g.check("the way in to the mailbox is clear of the two parked robots' cones (they look along the mail room's bottom wall)", robots.wayIn.length === 0, robots.wayIn.slice(0, 5));
g.check("after the post, the night robot and the two parked robots still show their cones", ["night-robot", "robot-2", "robot-3"].every((id) => robots.bayAfter.includes(id)), robots.bayAfter);

// ---------- nobody walks through anything ----------
const walks = await ev(() => {
  const n = window.__ss.op,
    b = window.SSQ.beat("ch1-evening"),
    out = { hall: [], homeMops: [] };
  // the snack bar: the guests coming in to the window, to the bar and out, Mops coming and going
  window.__jump(37);
  n.sq.x = 60;
  n.sq.y = 330;
  // (the hall's doorway starts 36b, the bay's cleaning robots, loading-bay.js: he crosses to the counter's front, and
  // the storm follows; the bay's own walks are its tests')
  const bay = window.SSQ.beat("ch1-bay");
  window.__run(120, () => window.__st() === "brochure" && n.ctrl, () => {
    const s = n.ch1Evening;
    if (bay.active()) return void (n.ctrl && !n.cur && ((n.sq.x = bay.place.HALL_SNEAK.goal.x), (n.sq.y = bay.place.HALL_SNEAK.goal.y)));
    if (n.room !== "hall" || !b.active()) return;
    const st = window.__st();
    if (n.ctrl && (st === "hide" || st === "peek" || (st === "duck" && s.peek))) {
      const o = window.__ss.offerNow();
      o && o.f();
    }
    b.viewOpen() === "shock" && b.viewAct();
    for (const p of (s.guests || []).filter((f) => f.x < 940 && f.wait <= 0)) out.hall.push({ who: p.id, x: Math.round(p.x), y: Math.round(p.y), kid: !!p.kid });
    n.moPose !== "hidden" && out.hall.push({ who: "mops", x: Math.round(n.mo.x), y: Math.round(n.mo.y) });
  });
  out.reached = window.__st();
  window.__run(30, () => window.__st() === "gohome", () => {
    n.moPose !== "hidden" && n.room === "hall" && out.hall.push({ who: "mops", x: Math.round(n.mo.x), y: Math.round(n.mo.y) });
    b.viewOpen() && b.viewAct();
  });
  window.__jump(143);
  window.__run(0.1);
  out.baySolids = window.__ss.solids();
  // home: Mops's walk to his sleeping place
  window.__jump(41);
  n.sq.x = 330;
  n.sq.y = 458;
  window.__ss.tick(0.05);
  const bed = window.__ss.offerNow();
  bed && bed.f();
  window.__run(30, () => window.__st() === "out" && n.ctrl, () => n.moPose !== "hidden" && out.homeMops.push({ x: Math.round(n.mo.x), y: Math.round(n.mo.y) }));
  // asleep: the kid's walk from beside his bed to the door goes round him (the game's own path round the solids)
  const solids = window.__ss.solids(),
    box = solids.find((q) => q.x1 === 536 && q.y1 === 580);
  const path = window.SSQ.findPath({ x: 340, y: 470 }, { x: 860, y: 440 }, window.__ss.walkBounds(), solids) || [];
  out.mopsBox = box;
  out.walkHome = [{ x: 340, y: 470 }, ...path];
  return out;
});
const hit = (a, b) => a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;
const feetOf = (p, w = 25) => ({ x0: p.x - w, x1: p.x + w, y0: p.y - 14, y1: p.y + 8 });
const hallFurniture = LP.LUNCH_SOLIDS;
const hallBad = walks.hall.filter((p) => hallFurniture.some((b) => hit(feetOf(p, p.kid ? 16 : 25), b)));
g.check("at the snack bar the two in line, the family and Mops never walk on the counter, the stools, the crates or a plant", walks.hall.length > 100 && hallBad.length === 0, hallBad.slice(0, 5));
const bayFurniture = [...PL.BAY_FURNITURE, ...PL.BAY_EXTRA];
g.check("the scripted walk at the snack bar got all the way to the brochure", walks.reached === "brochure", walks.reached);
g.check("the crate by the floor vent is reached on open floor (where he hides is clear of the furniture, the fence and walls)", !bayFurniture.some((b) => hit(feetOf(PL.EV_BAY.crate.stand, 18), b)));
g.check("the mail room's fence is solid (nobody walks through it)", PL.BAY_EXTRA.every((f) => walks.baySolids.some((q) => q.x0 === f.x0 && q.y0 === f.y0)), walks.baySolids.length);
const HOME_FURNITURE = [{ x0: 83, x1: 286, y0: 409, y1: 526 }, { x0: 536, x1: 596, y0: 500, y1: 571 }];
const mopsBad = walks.homeMops.filter((p) => HOME_FURNITURE.some((b) => hit(feetOf(p), b)));
g.check("at home Mops walks to his sleeping place round the bed and the bucket", walks.homeMops.length > 10 && mopsBad.length === 0, mopsBad.slice(0, 5));
const seg = walks.walkHome,
  over = [];
for (let i = 1; i < seg.length; i++)
  for (let k = 0; k <= 20; k++) {
    const p = { x: seg[i - 1].x + ((seg[i].x - seg[i - 1].x) * k) / 20, y: seg[i - 1].y + ((seg[i].y - seg[i - 1].y) * k) / 20 };
    walks.mopsBox && hit(feetOf(p, 20), walks.mopsBox) && over.push(p);
  }
g.check("Mops asleep is solid, and Squatch's walk from his bed to the door goes round him, never over him", !!walks.mopsBox && seg.length >= 2 && over.length === 0, { box: walks.mopsBox, path: seg, over: over.slice(0, 3) });

// ---------- Mops asleep: on his back, his head on his bucket ----------
const sleep = await ev(() => {
  const n = window.__ss.op,
    b = window.SSQ.beat("ch1-evening");
  window.__jump(42);
  window.__run(0.2);
  b.debug();
  window.__ss.drawFrame();
  return b.debug().drew.mops;
});
g.check("Mops sleeps on his back (turned all the way over), his head against his mop bucket", sleep && sleep.tip === 1 && sleep.roll === 1 && sleep.head.x >= 515 && sleep.head.x <= 545 && sleep.head.y > 500 && sleep.head.y < 571, sleep);

// ---------- vents ----------
const vents = await ev(() => {
  const n = window.__ss.op,
    b = window.SSQ.beat("ch1-evening"),
    V = b.place.BAY;
  window.__jump(142);
  window.__run(0.2);
  n.sq.x = 165;
  n.sq.y = 545;
  let tufts = 0;
  for (let i = 0; i < 45 && !n.ch1Evening.alarm; i++) (window.__ss.tick(0.05), (tufts = Math.max(tufts, ((n.ch1Evening.vent || {}).tufts || []).length)));
  const a = n.ch1Evening.alarm;
  const out = { tufts, alarm: !!a, where: a && a.where, by: a && a.w.id };
  // the wall vent: its swirl while it takes the pink sheet, none before
  window.__jump(143);
  window.__ss.drawFrame();
  out.swirlBefore = !!b.debug().drew.swirl;
  n.sq.x = 862;
  n.sq.y = 500;
  window.__ss.tick(0.05);
  const post = window.__ss.offerNow();
  post && post.f();
  window.__run(8, () => !!n.ch1Evening.alarm);
  n.sq.x = 850;
  n.sq.y = 334;
  window.__ss.tick(0.05);
  const hide = window.__ss.offerNow();
  hide && hide.f();
  let swirl = false;
  window.__run(4, () => n.ch1Evening.suck < 0 && n.ch1Evening.pink === "vent", () => n.ch1Evening.suck >= 0 && (window.__ss.drawFrame(), (swirl = swirl || !!b.debug().drew.swirl)));
  out.swirlSucking = swirl;
  // the party hall's floor vent at night one (on, PLACEHOLDER: one vent rule everywhere): his fur drifts in; staying,
  // the hall's FUR alarm goes off
  window.__jump(42);
  n.sq.x = 860;
  n.sq.y = 440;
  window.__run(10, () => window.__st() === "nighthall" && n.ctrl);
  n.sq.x = 188;
  n.sq.y = 494;
  let hallTufts = 0;
  for (let i = 0; i < 45 && !n.ch1Evening.alarm; i++) (window.__ss.tick(0.05), (hallTufts = Math.max(hallTufts, ((n.ch1Evening.vent || {}).tufts || []).length)));
  window.__ss.drawFrame();
  out.hall = { tufts: hallTufts, alarm: n.ch1Evening.alarm && { by: n.ch1Evening.alarm.w.id, where: n.ch1Evening.alarm.where } };
  return out;
});
g.check("the bay's floor vent pulls his fur in (tufts drift in), and staying there sets off the alarm, \"by the vent\"", vents.tufts > 0 && vents.alarm && vents.where === "where-vent" && vents.by === "fur-alarm", vents); // (round 7, r5 9:57, q: 125: fur in a vent always rings the room's own FUR alarm)
// (round 7, r5 13:18, q: 125: the floor vent takes the pink sheet; the big wall vent never gets a swirl)
g.check("the big wall vent never shows a swirl (the floor vent takes the pink sheet)", !vents.swirlBefore && !vents.swirlSucking, vents);
g.check("the party hall's floor vent is on at night: his fur drifts in, and staying sets off the hall's FUR alarm, \"by the vent\"", vents.hall.tufts > 0 && vents.hall.alarm && vents.hall.alarm.by === "fur-alarm" && vents.hall.alarm.where === "where-vent", vents.hall);

g.check("no page errors", errors.length === 0, errors.slice(0, 5));
await g.finish("evening-physics");
