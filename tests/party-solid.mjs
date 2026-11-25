/**
 * The party hall is solid (Brian, 2026-11-15: "Make the party hall solid so Squatch can't walk through walls, the stage, or guests").
 * Squatch walks into each thing for a while and must stop at its edge. He can still reach the snack bar, where the
 * paw icon walks him to open the snack close-up. Checked in the party in disguise (P6, src/modules/party.js), where
 * the kid walks the whole hall, and in the sneak (P2) for the hallway lane that P6 opens.
 *   node tests/party-solid.mjs
 */
import { join } from "node:path";
import { startGame, root } from "./game-page.mjs";

const hall = await import(join(root, "src", "modules", "party-hall.js"));
const hallway = await import(join(root, "src", "modules", "party-hallway.js"));
const g = await startGame({ port: 8942, name: "party-solid" });
const { page, ctx, errors } = await g.open("?ch=1");
await page.evaluate(() => window.__ss.lockedReady);
await page.click("canvas");
// Opens the party scene fresh (as ?beat=party:P6 does), stands him at (x, y), holds an arrow key for `steps` frames.
const walk = async (x, y, key, steps = 90, scene = "P6") => {
  await page.evaluate(
    ([x, y, scene]) => {
      const ss = window.__ss,
        n = ss.op;
      n.q = [];
      n.cur = null;
      window.SSQ.beat("ch1-party").jump(scene);
      Object.assign(n, { ctrl: true, sqPose: "stand", walkTo: null });
      n.sq.x = x;
      n.sq.y = y;
    },
    [x, y, scene],
  );
  await page.keyboard.down(key);
  const end = await page.evaluate((steps) => {
    const ss = window.__ss,
      n = ss.op;
    let maxX = n.sq.x;
    for (let i = 0; i < steps; i++) (ss.tick(1 / 30), (maxX = Math.max(maxX, n.sq.x)));
    return { x: n.sq.x, y: n.sq.y, maxX, scene: window.SSQ.beat("ch1-party").now().scene, room: n.room };
  }, steps);
  end.moved = Math.round(Math.hypot(end.x - x, end.y - y));
  await page.keyboard.up(key);
  return end;
};
let e;
// The snack bar: he can walk to the spot by the bar the paw icon takes him to.
e = await walk(hall.SNACK_SPOT.x - 120, hall.SNACK_SPOT.y, "ArrowRight", 40);
g.check("Squatch can walk up to the snack bar, to where the paw icon takes him", e.x >= hall.SNACK_SPOT.x - 10 && Math.hypot(e.x - hall.SNACK_SPOT.x, e.y - hall.SNACK_SPOT.y) < hall.SNACK_SPOT.r, e);
e = await walk(640, 420, "ArrowUp");
g.check("walking up stops on the floor, below the window and back wall", e.moved >= 8 && e.y >= 300, e);
e = await walk(360, 420, "ArrowUp");
g.check("walking up into the stage stops in front of it", e.moved >= 8 && e.y >= 304, e);
e = await walk(535, 420, "ArrowUp");
g.check("walking up beside the stage (the poster is gone) stops on the floor", e.moved >= 8 && e.y >= 300, e);
// The bar's left edge: x 806 in hall v2 (2026-11-23, the long bar moved down below the corner doorway).
e = await walk(700, 460, "ArrowRight");
g.check("walking right into the snack bar stops at the counter", e.moved >= 8 && e.x <= 806, e);
// In the sneak the hallway lane above the bar is shut: along the back wall he stops at the bar's end too.
e = await walk(700, 300 + 10, "ArrowRight", 90, "P2");
g.check("in the sneak (P2), walking right along the back wall stops at the snack bar too", e.moved >= 8 && e.maxX <= 806, e);
// In disguise the lane to the hallway doorway is open, but he cannot go through it yet: walking into the doorway he
// is bounced back a short way and never goes through.
e = await walk(700, 300 + 10, "ArrowRight", 150);
e.after = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op;
  let maxX = n.sq.x;
  for (let i = 0; i < 90; i++) {
    n.cur && n.cur.k === "bub" && ss.opTap();
    ss.tick(1 / 30);
    maxX = Math.max(maxX, n.sq.x);
  }
  return { x: Math.round(n.sq.x), y: Math.round(n.sq.y), maxX: Math.round(maxX), room: n.room, hallway: window.SSQ.beat("ch1-party").now().bounced > 0 };
});
g.check(
  "in disguise (P6), walking right along the back wall he reaches the hallway doorway, is bounced back, and never goes through",
  e.room === "hall" && e.maxX > 806 && hallway.inHallwayZone({ x: e.maxX, y: e.y }) && e.after.hallway && e.after.room === "hall" && e.after.maxX < 960 && e.after.x < hall.HALLWAY_ZONE.x0 && e.after.x > hall.HALLWAY_ZONE.x0 - 70,
  e,
);
e = await walk(150, 400, "ArrowDown");
g.check("the balloon kid is gone: walking down by the back plant reaches the front of the hall", e.moved >= 8 && e.y >= 580, e);
e = await walk(440, 600, "ArrowUp", 30);
g.check("walking up into the hiding plant stops at its pot", e.moved >= 8 && (e.y >= 552 || e.x < 412 || e.x > 476), e);
e = await walk(600, 580, "ArrowLeft");
g.check("the cake table is gone: walking left in front of the plant passes where it stood", e.moved >= 8 && e.x < 496, e);

// A guest: once a guest has stopped somewhere to dance, walking up into them from below stops at their feet.
const guest = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op;
  n.q = [];
  n.cur = null;
  window.SSQ.beat("ch1-party").jump("P6");
  n.sq.x = 120;
  n.sq.y = 585;
  // Let the guests mill until the robot guest (he is not in the conga line) stops somewhere to dance.
  const p = n.ch1PartyNow;
  let last = null;
  for (let i = 0; i < 30 * 20; i++) {
    ss.tick(1 / 30);
    const t = p.people.robot,
      lead = p.people.robot;
    // he stays there while the test walks into him (his stop's clock is set long)
    if (lead.arrived && lead.wait > 2.5 && t.y > 360 && t.y < 520) return ((lead.wait = 99), { x: t.x, y: t.y });
    last = { x: t.x, y: t.y };
  }
  return { none: true, last };
});
if (guest.none) g.check("the robot guest stops somewhere to dance (so the test can walk into him)", false, guest);
else {
  const t0 = await page.evaluate((gx) => ((window.__ss.op.sq.x = gx), (window.__ss.op.sq.y = Math.min(585, window.__ss.op.ch1PartyNow.people.robot.y + 70)), { x: window.__ss.op.sq.x, y: window.__ss.op.sq.y }), guest.x);
  await page.keyboard.down("ArrowUp");
  e = await page.evaluate(() => {
    const ss = window.__ss,
      n = ss.op;
    for (let i = 0; i < 40; i++) ss.tick(1 / 30);
    const t = n.ch1PartyNow.people.robot;
    return { x: n.sq.x, y: n.sq.y, guest: { x: t.x, y: t.y } };
  });
  await page.keyboard.up("ArrowUp");
  e.moved = Math.round(Math.hypot(e.x - t0.x, e.y - t0.y));
  g.check("walking up into a guest stops below the guest (the guest stood still)", e.moved >= 8 && e.y >= e.guest.y + 6 && Math.hypot(e.guest.x - guest.x, e.guest.y - guest.y) < 2, { ...e, was: guest });
}

const other = await page.evaluate(() => {
  const n = window.__ss.op,
    p = n.ch1PartyNow,
    room = n.room,
    scene = n.scene;
  const party = window.__ss.solids().length;
  // A hall scene that is not the party night (Day 2's lunch): the party is over, the hall keeps its own solids.
  n.ch1PartyNow = null;
  n.scene = "Q3";
  n.room = "hall";
  const s = window.__ss.solids().length;
  n.ch1PartyNow = p;
  n.scene = scene;
  n.room = room;
  return { party, other: s };
});
g.check("the other hall scenes keep their own solids", other.other > 0, other);
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("party-solid");
