/**
 * The party hall is solid (Brian, 2026-11-15: "Make the party hall solid so Squatch can't walk through walls, the stage, or guests").
 * Squatch walks into each thing for a while and must stop at its edge. He can still reach the snack bar's GRAB spot.
 *   node tests/party-solid.mjs
 */
import { startGame } from "./game-page.mjs";

const g = await startGame({ port: 8942, name: "party-solid" });
const { page, ctx } = await g.open("?ch=1");
await page.click("canvas");
const walk = async (x, y, key, steps = 90) => {
  await page.evaluate(([x, y]) => {
    const ss = window.__ss, n = ss.op;
    n.q = []; n.cur = null; n.scene = "QA"; n.room = "hall"; n.ch1Party = true; n.ch1PartyOver = false; n.ch1Disguise = true;
    n.ch1Flyer = true; n.moPose = "hidden"; n.ctrl = true; n.sqPose = "stand"; n.walkTo = null; ss.hall.camX = 0; n.sq.x = x; n.sq.y = y;
  }, [x, y]);
  await page.keyboard.down(key);
  const end = await page.evaluate((steps) => { for (let i = 0; i < steps; i++) window.__ss.tick(1 / 30); return { x: window.__ss.op.sq.x, y: window.__ss.op.sq.y }; }, steps);
  end.moved = Math.round(Math.hypot(end.x - x, end.y - y));
  await page.keyboard.up(key);
  return end;
};
let e;
// First, before any party event takes control away: walk up to the counter. The snack's GRAB spot (860, 430) reaches 90 px.
e = await walk(700, 440, "ArrowRight", 40);
g.check("Squatch can walk up to the counter, close enough to GRAB the snack", e.x >= 790 && Math.hypot(e.x - 860, e.y - 430) < 90, e);
e = await walk(640, 420, "ArrowUp"); g.check("walking up stops on the floor, below the window and back wall", e.moved >= 8 && (e.y >= 300), e);
e = await walk(360, 420, "ArrowUp"); g.check("walking up into the stage stops in front of it", e.moved >= 8 && (e.y >= 304), e);
e = await walk(535, 420, "ArrowUp"); g.check("walking up into the poster stops in front of its legs", e.moved >= 8 && (e.y >= 300), e);
e = await walk(700, 460, "ArrowRight"); g.check("walking right into the snack bar stops at the counter", e.moved >= 8 && (e.x <= 798), e);
e = await walk(700, 300 + 10, "ArrowRight"); g.check("walking right along the back wall stops at the snack bar too", e.moved >= 8 && (e.x <= 798), e);
e = await walk(320, 540, "ArrowUp"); g.check("walking up into the guest at (320, 470) stops below the guest", e.moved >= 8 && (e.y >= 476), e);
e = await walk(150, 400, "ArrowDown"); g.check("walking down into the balloon kid stops above the kid", e.moved >= 8 && (e.y <= 510), e);
e = await walk(440, 600, "ArrowUp", 30); g.check("walking up into the hiding plant stops at its pot", e.moved >= 8 && (e.y >= 552 || e.x < 412 || e.x > 476), e);
e = await walk(600, 512, "ArrowLeft"); g.check("walking left into the snack table stops at its edge", e.moved >= 8 && (e.x >= 574), e);
const old = await page.evaluate(() => { const n = window.__ss.op; n.ch1Party = false; n.scene = "Q1"; const s = window.__ss.solids(); n.ch1Party = true; return s.length; });
g.check("the other hall scenes keep their own solids", old > 0, { old });
await ctx.close();
await g.finish("party-solid");
