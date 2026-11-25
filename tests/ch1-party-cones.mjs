/**
 * Sight cones on everyone at the party (Brian, 2026-11-23: "let's try all of them and then we can adjust"),
 * and the party guests drawn from the six pictures Brian approved on Nov 8 (Squatchbot #1349: "The six
 * approved Nov 8 pictures"). Checked in P6, the party in disguise (src/modules/party-free.js), from what is
 * really drawn on the canvas (the cones' arcs, the "?" marks, the guest pictures), not from the source.
 *   - In disguise every guest, Isfred, the band and the bartender has a cone, drawn whole (a cone's arc is its
 *     full length: furniture never cuts it short).
 *     Squatch inside one, in a whole disguise: that cone stays a dashed outline (no yellow) and a "?" is drawn over
 *     that person, and nobody catches him (Brian 2026-11-24, "No yellow in disguise", replacing "Yellow, then
 *     suspicion" of 2026-11-22). The moment fur shows, the cone that holds him fills yellow.
 *   - After the snack pyramid topples, everyone turns to look at Squatch (their cones point at him).
 *   - Distance fade (Brian, 2026-11-23: "Add the distance fade"): a cone shows only when Squatch is near the
 *     cone itself: gone beyond 120 from it, fully shown within 40, fading in between, so every cone that can
 *     see him is fully drawn (rule 8).
 *   - The sneak to the plant is checked in tests/party-scenes.mjs.
 *   node tests/ch1-party-cones.mjs
 */
import { join } from "node:path";
import { startGame, sleep, root } from "./game-page.mjs";

const watch = await import(join(root, "src", "modules", "party-watch.js"));
const g = await startGame({ port: 8981, name: "ch1-party-cones" });
const { page, ctx, errors } = await g.open("?beat=party:P6");
await page.evaluate(() => window.__ss.lockedReady);
// Give the guest pictures time to load.
await sleep(1500);

// Everyone who should show a cone in the free play.
const EVERYONE = ["teal", "stilt", "robot", "octopus-guest", "backpack", "camera", "isfred", "band0", "band1", "band2", "bartender"];

// Record what the canvas really draws: every arc (with its alpha and the fill that follows), every "?" or "!"
// (in canvas pixels), and every approved guest picture drawn (where its feet land, in canvas pixels).
await page.evaluate(() => {
  const C = CanvasRenderingContext2D.prototype,
    arc = C.arc,
    fill = C.fill,
    text = C.fillText;
  const px = (m, x, y) => ({ px: m.a * x + m.c * y + m.e, py: m.b * x + m.d * y + m.f });
  C.arc = function (x, y, r, a0, a1, ...rest) {
    window.__rec && window.__rec.arcs.push({ x, y, r, alpha: this.globalAlpha, fill: "" });
    return arc.call(this, x, y, r, a0, a1, ...rest);
  };
  C.fill = function (...a) {
    const arcs = window.__rec && window.__rec.arcs,
      last = arcs && arcs[arcs.length - 1];
    last && !last.fill && (last.fill = String(this.fillStyle));
    return fill.apply(this, a);
  };
  C.fillText = function (t, x, y, ...rest) {
    window.__rec && (t === "?" || t === "!") && window.__rec.marks.push({ t, ...px(this.getTransform(), x, y) });
    return text.call(this, t, x, y, ...rest);
  };
  const G = window.SSQ.guests,
    drawId = G.drawId;
  G.drawId = function (c, id, x, y, ...rest) {
    const ok = drawId.call(this, c, id, x, y, ...rest);
    window.__rec && ok && window.__rec.guests.push({ id, ...px(c.getTransform(), x, y) });
    return ok;
  };
});

// Ticks the game `n` frames with Squatch held at (x, y), then draws one frame and returns what was drawn.
const frameAt = (x, y, n = 1) =>
  page.evaluate(
    (a) => {
      const ss = window.__ss,
        o = ss.op,
        b = window.SSQ.beat("ch1-party");
      for (let i = 0; i < a.n; i++) ((o.sq.x = a.x), (o.sq.y = a.y), ss.tick(1 / 30));
      ((o.sq.x = a.x), (o.sq.y = a.y));
      window.__rec = { arcs: [], marks: [], guests: [] };
      ss.tick(1 / 60);
      ss.drawFrame();
      const rec = window.__rec;
      window.__rec = null;
      const now = b.now();
      return { ...rec, cones: b.cones(), drawn: ss.conesDrawn().filter((k) => k.room === "hall").length, now: { scene: now.scene, alarm: now.alarm, seenBy: now.seenBy, stare: now.stare, pose: now.pose }, sq: { x: o.sq.x, y: o.sq.y }, sec: !!ss.secNow(), card: (o.cur && o.cur.k) || "" };
    },
    { x, y, n },
  );
// The arc a cone was drawn with (same centre and radius), or null when it was not drawn.
const arcOf = (f, c) => f.arcs.find((a) => Math.abs(a.x - c.ox) < 0.01 && Math.abs(a.y - c.oy) < 0.01 && Math.abs(a.r - c.len) < 0.01) || null;
const edgeOf = (c, s) => watch.distToCone(s.x, s.y - watch.SQUATCH_SEEN_ABOVE_FEET, c.ox, c.oy, c.a, c.half, c.len);
const yellow = (a) => !!a && /255,\s*234,\s*120/.test(a.fill);

// Out in the open first, to read where everyone stands.
const open = await frameAt(480, 600, 2);
g.check("the party in disguise is on (P6)", open.now.scene === "P6", open.now);
const ids = open.cones.map((c) => c.id);
g.check("in disguise, everyone at the party has a sight cone", EVERYONE.every((id) => ids.includes(id)), ids);
const lens = [...new Set(open.cones.map((c) => c.len))];
g.check("every cone is the same full length", lens.length === 1 && lens[0] > 100, lens);

// A place inside the camera tourist's cone and no one else's (he stays by his camera; his cone is steady).
const spot = (() => {
  const cam = open.cones.find((c) => c.id === "camera");
  for (const d of [90, 110, 70, 130, 60, 150])
    for (const da of [0, 0.15, -0.15, 0.3, -0.3]) {
      const x = cam.ox + Math.cos(cam.a + da) * d,
        y = cam.oy + Math.sin(cam.a + da) * d + watch.SQUATCH_SEEN_ABOVE_FEET;
      if (y < 310 || y > 585 || x < 70 || x > 890) continue;
      const s = { x, y };
      if (edgeOf(cam, s) <= 0 && open.cones.filter((c) => c.id !== "camera").every((c) => edgeOf(c, s) > 0)) return s;
    }
  return null;
})();
g.check("there is floor inside the camera tourist's cone only (the test can stand there)", !!spot, spot);

if (spot) {
  // About 1.5 seconds inside it.
  const inCam = await frameAt(spot.x, spot.y, 45);
  const cam = inCam.cones.find((c) => c.id === "camera"),
    camArc = arcOf(inCam, cam),
    camGuest = inCam.guests.find((q) => q.id === "camera"),
    q = inCam.marks.filter((m) => m.t === "?");
  g.check("inside the camera tourist's cone, he is the one who sees him", inCam.now.seenBy === "camera", inCam.now);
  g.check("in a whole disguise, inside the camera tourist's cone: it is drawn fully and stays a dashed outline (no yellow)", !!camArc && camArc.alpha === 1 && !yellow(camArc), camArc);
  // Since the pairs stand further apart (the flyer sneak, 2026-11-24) the only floor that is his cone's alone is
  // straight in front of him, where Squatch stands over the tourist's head: there the game moves the "?" beside
  // his head, off Squatch (the mark rule). So: one "?", at his head (over it, or just beside it), never on Squatch.
  const sqBox = { x0: spot.x - 34, x1: spot.x + 34, y0: spot.y - 110, y1: spot.y + 2 };
  g.check(
    'inside the camera tourist\'s cone: one "?" is drawn at his head (over it, or just beside it when Squatch stands there), never on Squatch',
    !!camGuest && q.length === 1 && Math.abs(q[0].px - camGuest.px) < 60 && q[0].py < camGuest.py - 20 && !(q[0].px > sqBox.x0 && q[0].px < sqBox.x1 && q[0].py > sqBox.y0 && q[0].py < sqBox.y1),
    { camGuest, q, spot },
  );
  g.check('in disguise it is only a "?": no "!" is drawn', !inCam.marks.some((m) => m.t === "!"), inCam.marks);
  // Another 1.5 seconds: three in all. Nobody catches him for being seen in disguise.
  const later = await frameAt(spot.x, spot.y, 45);
  g.check("in disguise, a guest who sees him does not catch him at once (no alarm in 3 seconds)", later.now.scene === "P6" && !later.now.alarm && !later.sec && later.card !== "card", later.now);
}

// Distance fade, from three places on the floor: which cones are drawn this frame, and how strongly.
const fade = [];
// (not in his own doorway at the front, 477,590: since 2026-11-25 standing there in the party takes him home early)
for (const [x, y] of [
  [400, 600],
  [200, 520],
  [800, 560],
  [470, 470],
]) {
  const f = await frameAt(x, y, 1);
  const cones = f.cones.map((c) => {
    const a = arcOf(f, c);
    return { at: [x, y], id: c.id, d: Math.round(edgeOf(c, f.sq) * 10) / 10, alpha: a ? a.alpha : 0, whole: !a || a.r === c.len, yellow: yellow(a) };
  });
  fade.push({ at: [x, y], cones, drawn: f.drawn, shown: cones.filter((c) => c.alpha > 0).length });
}
const all = fade.flatMap((f) => f.cones);
g.check("far from a cone (over 120), it is not drawn", all.filter((c) => c.d >= 120).every((c) => c.alpha === 0), all.filter((c) => c.d >= 120 && c.alpha !== 0));
g.check("close to a cone (within 40), it is drawn fully", all.filter((c) => c.d <= 40).every((c) => c.alpha === 1), all.filter((c) => c.d <= 40 && c.alpha !== 1));
g.check(
  "in between, the cone fades in as he comes closer",
  all.some((c) => c.d > 40 && c.d < 120) && all.filter((c) => c.d > 40 && c.d < 120).every((c) => c.alpha > 0 && c.alpha < 1),
  all.filter((c) => c.d > 40 && c.d < 120),
);
g.check("every cone that holds him is drawn fully (rule 8), and in a whole disguise none of them is yellow", all.filter((c) => c.d <= 0).every((c) => c.alpha === 1 && !c.yellow), all.filter((c) => c.d <= 0));
g.check("every cone is drawn whole (its full length)", all.every((c) => c.whole), all.filter((c) => !c.whole));
g.check(
  "only the shown cones are drawn, so far-away cones do not clutter the screen",
  fade.every((f) => f.drawn === f.shown) && fade.some((f) => f.shown < f.cones.length),
  fade.map((f) => ({ at: f.at, drawn: f.drawn, shown: f.shown })),
);
g.check("the six party guests are drawn from Brian's approved Nov 8 pictures", new Set(open.guests.map((q) => q.id)).size === 6, open.guests.map((q) => q.id));

// The snack pyramid topples (he pulls out a snack two others stand on; Brian 2026-11-24: "it just depends on what
// he takes", not a count of five): everyone turns to look at him.
{
  const L = await page.evaluate(() => window.SSQ.beat("ch1-party").snackLayout());
  // at the bar the action button offers GRAB · snacks; pressing it opens the close-up
  await page.evaluate((p) => ((window.__ss.op.sq.x = p.x - 10), (window.__ss.op.sq.y = p.y + 10)), L.spot);
  const t0 = Date.now();
  while (Date.now() - t0 < 3000 && !(await page.evaluate(() => !!window.__ss.op.act && window.__ss.op.act.verb === "GRAB"))) await sleep(100);
  await page.evaluate(() => (window.__ss.actionDown(), window.__ss.actionUp()));
  let last = null;
  const open2 = async (f, ms) => {
    const t1 = Date.now();
    while (Date.now() - t1 < ms) {
      const v = (last = await page.evaluate(() => window.SSQ.beat("ch1-party").now()));
      if (f(v)) return v;
      await sleep(100);
    }
    return null;
  };
  g.check("GRAB · snacks opens the snack close-up", !!(await open2((v) => v && v.snack, 6000)));
  await sleep(800); // the close-up zooms in before it takes a finger
  {
    // a middle cup of the counter row (two pies stand on it), tapped while her back is turned
    await open2((v) => v && v.snack && v.snack.phase === "back", 12000);
    const [, x, y] = L.cut.snacks[7];
    await page.evaluate((a) => window.__ss.ch1Pointer("down", a[0], a[1]), [x, y]);
  }
  const v = await open2((q) => q && q.stare > 0, 6000);
  g.check("pulling a snack two others stand on topples the pyramid and everyone stares", !!v && v.snacks.toppled, last && { scene: last.scene, alarm: last.alarm, snack: last.snack, snacks: last.snacks, stare: last.stare, curious: last.curious });
  const at = await page.evaluate(() => ({ x: window.__ss.op.sq.x, y: window.__ss.op.sq.y }));
  const f = await frameAt(at.x, at.y, 0);
  const look = f.cones
    .filter((c) => EVERYONE.includes(c.id))
    .map((c) => {
      const want = Math.atan2(at.y - c.oy, at.x - c.ox);
      const d = Math.abs(c.a - want) % (2 * Math.PI);
      return { id: c.id, off: Math.round(Math.min(d, 2 * Math.PI - d) * 1000) / 1000 };
    });
  g.check(
    "after the pyramid topples, everyone turns to look at Squatch",
    f.now.stare > 0 && look.length === EVERYONE.length && look.every((c) => c.off < 0.05),
    { stare: f.now.stare, off: look.filter((c) => c.off >= 0.05) },
  );
}

// Fur shows (a piece of his outfit is gone): the cones that hold him fill yellow again, at once.
{
  const at = await page.evaluate(() => {
    window.__ss.op.ch1PartyNow.lostPieces = ["head"];
    return { x: window.__ss.op.sq.x, y: window.__ss.op.sq.y, fur: window.SSQ.beat("ch1-party").now().fur };
  });
  const f = await frameAt(at.x, at.y, 0);
  const holding = f.cones.filter((c) => EVERYONE.includes(c.id) && edgeOf(c, at) <= 0).map((c) => arcOf(f, c));
  g.check("once fur shows, every cone that holds him fills yellow", at.fur && holding.length > 0 && holding.every((a) => !!a && yellow(a)), { fur: at.fur, holding: holding.length });
}

g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("ch1-party-cones");
