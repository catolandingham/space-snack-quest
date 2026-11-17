/**
 * Squatch and Mops do not stand inside each other at the lunch handoff or the snack hall.
 * The snack hall check is the end of the walk after two feeds, not the numbers written beside "mo:".
 *   node tests/apart.mjs
 */
import { readFileSync } from "node:fs";
import { startGame } from "./game-page.mjs";

const src = readFileSync(new URL("../src/game/14-ch1-day2.js", import.meta.url), "utf8");
const give = src.match(/stand: \[(\d+), (\d+)\], mo: \[(\d+), (\d+)\] \}, \(\) => ch1Ready\("give"/);
if (!give) {
  console.error("could not read the lunch handoff stands");
  process.exit(1);
}

const PROPS = [
  { name: "stage", x0: 240, x1: 490, y0: 0, y1: 304 },
  { name: "poster", x0: 490, x1: 582, y0: 0, y1: 300 },
  { name: "bar", x0: 798, x1: 960, y0: 0, y1: 528 },
  { name: "stool", x0: 772, x1: 800, y0: 316, y1: 336 },
  { name: "stool2", x0: 772, x1: 800, y0: 398, y1: 418 },
  { name: "back plant", x0: 72, x1: 136, y0: 330, y1: 372 },
  { name: "plant pot", x0: 412, x1: 476, y0: 520, y1: 552 },
  { name: "snack table", x0: 496, x1: 574, y0: 494, y1: 530 },
  { name: "tripod", x0: 228, x1: 274, y0: 340, y1: 368 },
  { name: "floor vent", x0: 150, x1: 300, y0: 500, y1: 640 },
];
const LIFT = { name: "lift door", x0: 430, x1: 560, y0: 470, y1: 640 };
const photos = src.match(/stand: \[(\d+), (\d+)\], mo: \[(\d+), (\d+)\] \}, \(\) => ch1Ready\("photos"/);
const beep = src.match(/ch1Step\("sq", (\d+), (\d+), 220\)/);
if (!photos || !beep) {
  console.error("could not read the photo-hallway stands");
  process.exit(1);
}

const g = await startGame({ port: 8881, name: "apart" });
const { page } = await g.open("?ch=1");
const out = await page.evaluate(
  (spots) => {
    const ss = window.__ss;
    const n = ss.op;
    const gap = (room) => {
      const sq = (ss.adultPxFor(room) * 0.8) / 45;
      const mo = sq * 1.15;
      return 24 * sq + 30 * mo;
    };
    const onProp = (x, y, pad) => spots.props.find((b) => x > b.x0 - pad && x < b.x1 + pad && y > b.y0 - pad && y < b.y1 + pad);
    const giveCheck = () => {
      const need = gap("passage");
      const dist = Math.hypot(spots.give.sq[0] - spots.give.mo[0], spots.give.sq[1] - spots.give.mo[1]);
      return { dist: Math.round(dist), need: Math.round(need), clear: dist >= need };
    };
    n.ch1Day2 = true;
    n.room = "passage";
    n.scene = "QB";
    n.ch1Step = "feed2";
    n.ch1Fed = 1;
    n.ch1Hold = "lunch";
    n.ch1Zoom = { id: "eat", zoom: 1, paw: { x: 300, y: 580 } };
    n.sqPose = "stand";
    n.moPose = "stand";
    n.sq.x = 240;
    n.sq.y = 520;
    n.mo.x = 720;
    n.mo.y = 540;
    n.mo.walking = false;
    n.ctrl = true;
    n.q = [];
    n.cur = null;
    const act = ss.offerNow();
    if (!act || act.verb !== "FEED") return { error: "no second feed", act: act && act.verb };
    act.f();
    let last = "";
    for (let i = 0; i < 500; i++) {
      ss.tick(0.05);
      if (n.cur && (n.cur.k === "bub" || n.cur.k === "card" || n.cur.k === "wait")) ss.opTap();
      const mark = n.room + "|" + Math.round(n.sq.x) + "|" + Math.round(n.mo.x) + "|" + (n.cur && n.cur.k) + "|" + n.q.length;
      if (n.room === "hall" && n.ch1Step === "snack" && mark === last) break;
      last = mark;
    }
    const need = gap("hall");
    const dist = Math.hypot(n.sq.x - n.mo.x, n.sq.y - n.mo.y);
    const snack = { x: 760, y: 530 };
    const dx = snack.x - n.sq.x,
      dy = snack.y - n.sq.y,
      len2 = dx * dx + dy * dy || 1,
      t = Math.max(0, Math.min(1, ((n.mo.x - n.sq.x) * dx + (n.mo.y - n.sq.y) * dy) / len2)),
      path = Math.hypot(n.mo.x - (n.sq.x + dx * t), n.mo.y - (n.sq.y + dy * t));
    return {
      give: giveCheck(),
      hall: {
        room: n.room,
        step: n.ch1Step,
        sq: [Math.round(n.sq.x), Math.round(n.sq.y)],
        mo: [Math.round(n.mo.x), Math.round(n.mo.y)],
        dist: Math.round(dist),
        need: Math.round(need),
        clear: dist >= need,
        sqProp: (onProp(n.sq.x, n.sq.y, 8) || {}).name || "",
        moProp: (onProp(n.mo.x, n.mo.y, 8) || {}).name || "",
        path: Math.round(path),
        pathClear: path >= need,
      },
      passage: (() => {
        const sq = spots.beep;
        const mo = spots.photos.mo;
        const need = gap("passage");
        const dist = Math.hypot(sq[0] - mo[0], sq[1] - mo[1]);
        const onLift = (p) => p[0] > spots.lift.x0 && p[0] < spots.lift.x1 && p[1] > spots.lift.y0 && p[1] < spots.lift.y1;
        return { sq, mo, dist: Math.round(dist), need: Math.round(need), clear: dist >= need, sqLift: onLift(sq), moLift: onLift(mo) };
      })(),
    };
  },
  {
    give: { sq: [Number(give[1]), Number(give[2])], mo: [Number(give[3]), Number(give[4])] },
    photos: { sq: [Number(photos[1]), Number(photos[2])], mo: [Number(photos[3]), Number(photos[4])] },
    beep: [Number(beep[1]), Number(beep[2])],
    props: PROPS,
    lift: LIFT,
  },
);
g.check("passage: Squatch is not inside Mops", out.give && out.give.clear, out.give || out);
g.check("snack hall: the walk ends with them apart", out.hall && out.hall.room === "hall" && out.hall.clear, out.hall || out);
g.check("snack hall: neither one stands on a prop", out.hall && !out.hall.sqProp && !out.hall.moProp, out.hall || out);
g.check("snack hall: Mops is not in the way of the snack", out.hall && out.hall.pathClear, out.hall || out);
g.check("photo hallway: after the beep they are apart and off the lift", out.passage && out.passage.clear && !out.passage.sqLift && !out.passage.moLift, out.passage || out);
await g.finish("apart");
