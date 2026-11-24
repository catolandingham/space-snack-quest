/**
 * Tap to walk goes around furniture (docs/CHAPTER-1-PROBLEMS.md, problem 2: "tap the calendar. Squatch walks
 * straight at it, bumps the bed, and stops. Nothing happens. The kid has to steer around with the stick.").
 * A tap on a point behind the bed, the bin or Mops walks Squatch around them to it. A tap on the furniture
 * itself walks him to its edge. A tap on open floor still walks straight there.
 *   node tests/ch1-tap-path.mjs
 */
import { startGame } from "./game-page.mjs";

const g = await startGame({ port: 8984, name: "ch1-tap-path" });
const { page, ctx, errors } = await g.open("?ch=1");
await page.evaluate(() => window.__ss.lockedReady);

// Each case: a room, where Squatch starts, where the player taps. Returns where he ends up after 5 seconds.
const walk = (c) =>
  page.evaluate((c) => {
    const ss = window.__ss,
      n = ss.op;
    Object.assign(n, { scene: c.scene, room: c.room, q: [], cur: null, ctrl: true, act: null, sqPose: "stand", ch1Party: false, ch1D: c.room === "hangar", walkTo: null });
    ss.ch.mops = false;
    if (c.mops) Object.assign(n.mo, { x: c.mops[0], y: c.mops[1] }), (n.moPose = "stand"), (n.mo.walking = false);
    else ((n.mo.x = -500), (n.moPose = "hidden"));
    ((n.sq.x = c.from[0]), (n.sq.y = c.from[1]));
    ss.tick(1 / 30);
    ss.tapAt(c.tap[0], c.tap[1], false);
    const path = ((n.walkTo && n.walkTo.path) || []).length;
    for (let i = 0; i < 150; i++) ss.tick(1 / 30);
    const solids = ss.solids();
    const inSolid = solids.some((q) => n.sq.x > q.x0 + 1 && n.sq.x < q.x1 - 1 && n.sq.y > q.y0 + 1 && n.sq.y < q.y1 - 1);
    return { at: [Math.round(n.sq.x), Math.round(n.sq.y)], off: Math.round(Math.hypot(n.sq.x - c.tap[0], n.sq.y - c.tap[1])), path, inSolid };
  }, c);

// Home: the bed runs from x 83 to 286 and y 409 to 526 (ih, the locked home picture). He stands right of it.
const overBed = await walk({ scene: "Q1", room: "closet", from: [330, 480], tap: [150, 390] });
g.check("home: a tap on the far side of the bed walks him around the bed to it", overBed.off <= 10 && !overBed.inSolid, overBed);
const belowBed = await walk({ scene: "Q1", room: "closet", from: [330, 400], tap: [150, 560] });
g.check("home: a tap below the bed from above it walks him around too", belowBed.off <= 10 && !belowBed.inSolid, belowBed);
// Loading bay: the bin (x 189 to 237, y 350 to 374). Tap just above it from just below it.
const bin = await walk({ scene: "Q4", room: "hangar", from: [213, 400], tap: [213, 335] });
g.check("loading bay: a tap behind the bin walks him around the bin", bin.off <= 10 && !bin.inSolid, bin);
// Mops standing between Squatch and the tapped point.
const mops = await walk({ scene: "Q1", room: "closet", from: [420, 470], tap: [620, 470], mops: [520, 470] });
g.check("a tap past Mops walks Squatch around him", mops.off <= 10 && !mops.inSolid, mops);
// A tap on the bed itself: he ends on the free floor nearest the tap, just off the bed (here below it,
// 56 under the tap; the right edge is 86 away), not stuck partway.
const onBed = await walk({ scene: "Q1", room: "closet", from: [450, 470], tap: [200, 470] });
g.check("a tap on the bed walks him to the floor right next to it", !onBed.inSolid && onBed.off <= 70, onBed);
// Standing flush against the bed's side (where the game leaves feet it pushes out of a box), a tap away walks.
for (const x of [286, 287, 290, 291]) {
  const flush = await walk({ scene: "Q1", room: "closet", from: [x, 470], tap: [450, 470] });
  g.check(`standing against the bed at x ${x}, a tap away walks him there`, flush.off <= 10, flush);
}
// Open floor: straight there, no detour.
const open = await walk({ scene: "Q1", room: "closet", from: [400, 450], tap: [700, 440] });
g.check("a tap on open floor still walks straight there", open.off <= 10 && open.path <= 1, open);
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("ch1-tap-path");
