/**
 * Squatch and Mops do not stand inside each other at the lunch handoff (the hallway) or behind the snack counter
 * (the hall), in the lunch sneak (src/modules/lunch-sneak.js): the places come from lunch-sneak-place.js, and the hall's
 * walk ends where the game really leaves them. Neither stands on the counter, the stools, the plants or the crates
 * (LUNCH_SOLIDS, read off the locked hall picture v2), and Mops is not between Squatch and the plate of snack cakes.
 *   node tests/apart.mjs
 */
import { join } from "node:path";
import { startGame, root } from "./game-page.mjs";

const P = await import(join(root, "src", "modules", "lunch-sneak-place.js"));

const g = await startGame({ port: 8881, name: "apart" });
const { page } = await g.open("?ch=1");
await page.evaluate(() => window.__ss.lockedReady);
const out = await page.evaluate(
  ({ give, mopsAt, solids, plate }) => {
    const ss = window.__ss,
      n = ss.op;
    const gap = (room) => {
      const sq = (ss.adultPxFor(room) * 0.8) / 45;
      return 24 * sq + 30 * sq * 1.15;
    };
    const onProp = (x, y, pad) => solids.find((b) => x > b.x0 - pad && x < b.x1 + pad && y > b.y0 - pad && y < b.y1 + pad);
    const hallway = { dist: Math.round(Math.hypot(give.x - mopsAt.x, give.y - mopsAt.y)), need: Math.round(gap("passage")) };
    // the walk behind the counter, played: from the hallway's left doorway after lunch
    n.q = [];
    n.cur = null;
    ss.ch1JumpBeat(22);
    window.SSQ.beat("ch1-lunch").jump("back");
    ss.tick(0.05);
    n.sq.x = 50;
    n.sq.y = 345;
    for (let i = 0; i < 300 && !(n.ctrl && n.ch1Lunch && n.ch1Lunch.step === "snack"); i++) ss.tick(0.05);
    const need = gap("hall"),
      dist = Math.hypot(n.sq.x - n.mo.x, n.sq.y - n.mo.y);
    // Mops is not on the way from Squatch's paw down to the plate
    const dx = plate.x - n.sq.x,
      dy = plate.y - n.sq.y,
      t = Math.max(0, Math.min(1, ((n.mo.x - n.sq.x) * dx + (n.mo.y - n.sq.y) * dy) / (dx * dx + dy * dy || 1))),
      path = Math.hypot(n.mo.x - (n.sq.x + dx * t), n.mo.y - (n.sq.y + dy * t));
    return {
      hallway: { ...hallway, clear: hallway.dist >= hallway.need },
      hall: {
        room: n.room,
        step: n.ch1Lunch && n.ch1Lunch.step,
        sq: [Math.round(n.sq.x), Math.round(n.sq.y)],
        mo: [Math.round(n.mo.x), Math.round(n.mo.y)],
        dist: Math.round(dist),
        need: Math.round(need),
        clear: dist >= need,
        sqProp: !!onProp(n.sq.x, n.sq.y, 0),
        moProp: !!onProp(n.mo.x, n.mo.y, 0),
        path: Math.round(path),
        pathClear: path >= need,
      },
    };
  },
  { give: P.HALLWAY_SPOTS.give, mopsAt: P.HALLWAY_SPOTS.mops, solids: P.LUNCH_SOLIDS, plate: P.COUNTER_SPOTS.plate },
);
g.check("hallway: where GIVE · lunch is offered, Squatch is not inside Mops", out.hallway.clear, out.hallway);
// (the walk ends at "one": Mops's one-snack line, Brian 2026-11-26, waits for NEXT before TAKE · snack)
g.check("behind the counter: the walk ends with them apart", out.hall.room === "hall" && ["one", "snack"].includes(out.hall.step) && out.hall.clear, out.hall);
g.check("behind the counter: neither one stands on the counter, a stool, a plant or the crates", !out.hall.sqProp && !out.hall.moProp, out.hall);
g.check("behind the counter: Mops is not in the way of the plate", out.hall.pathClear, out.hall);
await g.finish("apart");
