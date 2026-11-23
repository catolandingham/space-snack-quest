/**
 * Sight cones on everyone at the party (Brian, 2026-11-23: "let's try all of them and then we can adjust"),
 * and the party guests drawn from the six pictures Brian approved on Nov 8 (Squatchbot #1349: "The six
 * approved Nov 8 pictures").
 *   - In disguise: every guest, Isfred, the bartender, the cape guest and the octopus show a faint cone.
 *     Squatch inside one: that cone fills and a "?" shows over that person, and nobody catches him.
 *   - After the snack spill, everyone turns to look at Squatch (their cones point at him).
 *   - The sneak to the plant: everyone faces the stage. The way from his doorway to the plant is outside every
 *     cone. Stepping into a cone shows "?" over that person; staying too long turns it into "!" and he is seen
 *     (Brian, 2026-11-22: "it stats with a question mark and only turns into exclamation after he stays too long").
 *   node tests/ch1-party-cones.mjs
 */
import { startGame } from "./game-page.mjs";

const g = await startGame({ port: 8981, name: "ch1-party-cones" });
const { page, ctx, errors } = await g.open("?ch=1");
await page.evaluate(() => window.__ss.lockedReady);
// Give the guest pictures time to load.
await page.evaluate(() => new Promise((r) => setTimeout(r, 1500)));

const EVERYONE = ["stilt", "backpack", "camera", "teal", "robot", "octopus-guest", "isfred", "bartender", "cape", "octopus"];

const party = await page.evaluate((EVERYONE) => {
  const ss = window.__ss,
    n = ss.op;
  const frame = () => (ss.tick(1 / 30), ss.drawFrame(), (n.ch1Cones || []).map((c) => ({ id: c.id, a: c.a, ox: c.ox, oy: c.oy, inside: c.inside, mark: c.mark })));
  Object.assign(n, { scene: "QA", room: "hall", ch1Party: true, ch1Day2: false, ch1Disguise: true, ch1PartyOver: false, ch1Mini: "", q: [], cur: null, ctrl: true, sqPose: "stand", ch1Look: 0, ch1PlantSneak: null });
  // Out in the open, away from everyone's cone.
  ((n.sq.x = 560), (n.sq.y = 600));
  const open = frame();
  // Right in front of the camera tourist, inside the cone he watches the stage with.
  const cam = open.find((c) => c.id === "camera") || { ox: 740, oy: 442, a: -2.64 }; // where he stands, if no cones are drawn yet
  ((n.sq.x = cam.ox + Math.cos(cam.a) * 90), (n.sq.y = cam.oy + Math.sin(cam.a) * 90 + 20));
  let inCam = frame();
  for (let i = 0; i < 90; i++) ss.tick(1 / 30);
  inCam = frame();
  const caught = { sec: !!ss.secNow(), over: n.ch1PartyOver, disguise: n.ch1Disguise, card: (n.cur && n.cur.k) || "" };
  // The snack spill: everyone turns to look at Squatch.
  n.ch1Look = 2;
  const look = frame().map((c) => {
    const want = Math.atan2(n.sq.y - 20 - c.oy, n.sq.x - c.ox);
    let d = Math.abs(c.a - want) % (2 * Math.PI);
    return { id: c.id, off: Math.min(d, 2 * Math.PI - d) };
  });
  n.ch1Look = 0;
  return { open, inCam, caught, look, art: n.ch1GuestArt, ids: open.map((c) => c.id) };
}, EVERYONE);

g.check(
  "in disguise, everyone at the party shows a sight cone",
  EVERYONE.every((id) => party.ids.includes(id)),
  party.ids,
);
g.check("out in the open, nobody's cone is on him", party.open.every((c) => !c.inside), party.open.filter((c) => c.inside));
const cam = party.inCam.find((c) => c.id === "camera") || {};
g.check('inside the camera tourist\'s cone: it fills and a "?" shows over him', cam.inside === true && cam.mark === "?", cam);
g.check("in disguise, a guest who sees him does not catch him", !party.caught.sec && !party.caught.over && party.caught.disguise, party.caught);
g.check(
  "after the snack spill, everyone turns to look at Squatch",
  party.look.length >= EVERYONE.length && party.look.every((c) => c.off < 0.05),
  party.look.filter((c) => c.off >= 0.05),
);
g.check("the six party guests are drawn from Brian's approved Nov 8 pictures", party.art === 6, party.art);

// The sneak to the plant.
const sneak = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op;
  Object.assign(n, { scene: "QA", room: "hall", ch1Party: true, ch1Disguise: false, ch1PartyOver: false, q: [], cur: null, ctrl: true, sqPose: "stand", ch1Look: 0 });
  // While the door guest faces the stage (the safe time), walk the way from the doorway to the plant.
  const path = [];
  for (const [x0, y0, x1, y1] of [
    [470, 628, 400, 520], // straight
    [470, 628, 410, 568], // the diagonal the arrow keys make
    [410, 568, 400, 520],
  ])
    for (let k = 0; k <= 10; k++) path.push([x0 + ((x1 - x0) * k) / 10, y0 + ((y1 - y0) * k) / 10]);
  const seenOnPath = [];
  for (const [x, y] of path) {
    n.ch1PlantSneak = { t: 0.5, caught: 0, tries: 0 };
    ((n.sq.x = x), (n.sq.y = y), (n.ctrl = !0));
    ss.tick(1 / 30);
    n.ch1PlantSneak.caught && seenOnPath.push([x, y, n.ch1PlantSneak.by]);
  }
  ss.drawFrame();
  const cones = (n.ch1Cones || []).map((c) => ({ id: c.id, a: c.a, ox: c.ox, oy: c.oy }));
  // Step into the camera tourist's cone while the door guest faces the stage.
  const cam = cones.find((c) => c.id === "camera") || { ox: 740, oy: 442, a: -2.64 };
  n.ch1PlantSneak = { t: 0.5, caught: 0, tries: 0 };
  ((n.sq.x = cam.ox + Math.cos(cam.a) * 90), (n.sq.y = cam.oy + Math.sin(cam.a) * 90 + 20), (n.ctrl = !0));
  const mark = () => ((n.ch1Cones || []).find((c) => c.id === "camera") || {}).mark;
  // A moment in his cone: "?" over him, not caught yet.
  (ss.tick(1 / 30), ss.tick(1 / 30), ss.drawFrame());
  const first = { caught: n.ch1PlantSneak.caught, mark: mark() };
  // Staying in it too long: "!" and caught.
  for (let i = 0; i < 60 && !n.ch1PlantSneak.caught; i++) ss.tick(1 / 30);
  ss.drawFrame();
  const s = n.ch1PlantSneak;
  const byCam = { first, caught: s && s.caught, by: s && s.by, mark: mark() };
  n.ch1PlantSneak = null;
  return { seenOnPath, cones: cones.map((c) => c.id), byCam };
});
g.check("during the sneak, everyone faces the stage with a cone", ["stilt", "backpack", "camera", "teal", "octopus-guest", "isfred", "cape"].every((id) => sneak.cones.includes(id)), sneak.cones);
g.check("the way from his doorway to the plant is outside every cone", sneak.seenOnPath.length === 0, sneak.seenOnPath);
g.check('a moment in the camera tourist\'s cone: "?" over him, and Squatch is not caught yet', sneak.byCam.first.caught === 0 && sneak.byCam.first.mark === "?", sneak.byCam);
g.check('staying in his cone too long: the "?" turns into "!" and Squatch is seen', sneak.byCam.caught === 1 && sneak.byCam.by === "camera" && sneak.byCam.mark === "!", sneak.byCam);
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("ch1-party-cones");
