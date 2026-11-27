/**
 * Hiding in a plant shows Squatch's two eyes in the plant's leaves (Brian, C21: "The two eyes sit LOW, in the
 * two lower-front clumps (eye centre 50% down from the top of the leaves)"). Brian raised eyes sitting off the
 * plant more than once (repeat-issues.md, issue 3). Before this, the loading bay eyes sat on the pot and the
 * Day 2 hall hide showed no eyes at all.
 *   node tests/ch1-plant-eyes.mjs
 */
import { startGame } from "./game-page.mjs";

// The leaves of each plant in the locked pictures (game positions), and where Squatch stands when hidden there.
const CASES = [
  // (the bay plant moved along the wall in the delivery pictures v3, Brian's yes, question 75: loading-bay-place.js BAY.plant)
  { id: "loading bay plant (Day 2, hide and watch)", beat: 33, leaves: { x0: 249, x1: 339, y0: 256, y1: 338 } },
  { id: "hall middle plant (Day 2, hide from the family)", beat: 38, set: { ch1Step: "family", room: "hall", scene: "Q3", x: 430, y: 530 }, leaves: { x0: 400, x1: 484, y0: 440, y1: 520 } },
];

const g = await startGame({ port: 8978, name: "ch1-plant-eyes" });
const { page, ctx, errors } = await g.open("?ch=1");
await page.evaluate(() => window.__ss.lockedReady);
for (const c of CASES) {
  const eyes = await page.evaluate((c) => {
    const ss = window.__ss, n = ss.op;
    ((n.q = []), (n.cur = null), ss.ch1JumpBeat(c.beat));
    if (c.set) (Object.assign(n, { ch1Step: c.set.ch1Step, room: c.set.room, scene: c.set.scene }), (n.sqPose = "hidden"), (n.sq.x = c.set.x), (n.sq.y = c.set.y));
    for (let i = 0; i < 3; i++) ss.tick(0.05);
    // The eyes are two small white ellipses (ga in 10-ch1.js): record every ellipse of radius 5 to 8 drawn this frame.
    const P = CanvasRenderingContext2D.prototype, el = P.ellipse, got = [];
    P.ellipse = function (x, y, rx, ry) {
      rx >= 5 && rx <= 8 && got.push([Math.round(x), Math.round(y)]);
      return el.apply(this, arguments);
    };
    ss.drawFrame();
    P.ellipse = el;
    return { hidden: n.sqPose, got };
  }, c);
  const inLeaves = eyes.got.filter(([x, y]) => x > c.leaves.x0 && x < c.leaves.x1 && y > c.leaves.y0 && y < c.leaves.y1);
  g.check(`${c.id}: two eyes show in the leaves`, eyes.hidden === "hidden" && inLeaves.length >= 2, eyes);
}
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("ch1-plant-eyes");
