/**
 * A catch at the party stays in the party. It does not restart the bedroom.
 * The party is src/modules/party.js: a guard who reaches Squatch during the FUR alarm (P7) shows the LOCKUP
 * card, and the scene restarts from its own restart point (the alarm ringing, the guards coming in at the
 * hallway doorway, Squatch on the dance floor), never at home. The bartender's catch in the snack close-up
 * (P6) closes the close-up and the party goes on in the hall, into the alarm.
 *   node tests/party-catch.mjs
 */
import { join } from "node:path";
import { startGame, sleep, root } from "./game-page.mjs";

const hall = await import(join(root, "src", "modules", "party-hall.js"));
const g = await startGame({ port: 8948, name: "party-catch" });

// Caught by a guard in P7, standing at (x, y): the card, then everything after it until he has control again.
async function caughtAt(x, y) {
  const { page, ctx, errors } = await g.open("?beat=party:P7");
  await page.evaluate(() => window.__ss.lockedReady);
  await sleep(800);
  const r = await page.evaluate(
    ([x, y]) => {
      const ss = window.__ss,
        n = ss.op,
        b = window.SSQ.beat("ch1-party");
      const jail = () => (n.cur && n.cur.id === "jail" ? n.cur : n.q.find((q) => q.id === "jail")) || null;
      // the guards come in; one walks up beside him
      for (let i = 0; i < 60 && n.ch1PartyNow.alarm.guards.length < 2; i++) ss.tick(1 / 30);
      const a = n.ch1PartyNow.alarm;
      Object.assign(a.guards[0], { x: x - 20, y: y - 6, a: 0 });
      Object.assign(a.guards[1], { x: 900, y: 320 });
      n.sq.x = x;
      n.sq.y = y;
      let card = null;
      for (let i = 0; i < 30 && !card; i++) ((n.sq.x = x), (n.sq.y = y), ss.tick(1 / 30), (card = jail()));
      const during = { scene: n.scene, room: n.room, text: card && card.text, cause: card && card.cause };
      // Tap through the card (and anything after it) until he can move again.
      let i = 0;
      for (; i < 900; i++) {
        if (n.cur && ["bub", "card", "panel"].includes(n.cur.k)) ss.opTap();
        ss.tick(1 / 30);
        if (!n.cur && !jail() && n.ctrl && b.now() && b.now().scene === "P7") break;
      }
      // a moment later (a third of a second): the first guards come in
      for (let k = 0; k < 10; k++) ss.tick(1 / 30);
      const now = b.now(),
        al = n.ch1PartyNow.alarm;
      const solids = ss.solids();
      return {
        during,
        after: {
          ticks: i,
          scene: n.scene,
          room: n.room,
          party: now && now.scene,
          alarm: now && now.alarm,
          ctrl: !!n.ctrl,
          x: Math.round(n.sq.x),
          y: Math.round(n.sq.y),
          verbs: (ss.spotsNow() || []).filter((s) => s && s.verb).map((s) => s.verb + " · " + s.cap),
          guards: al ? al.guards.map((q) => [Math.round(q.x), Math.round(q.y), q.room]) : [],
          inSolid: solids.some((q) => n.sq.x > q.x0 && n.sq.x < q.x1 && n.sq.y > q.y0 && n.sq.y < q.y1),
        },
      };
    },
    [x, y],
  );
  await ctx.close();
  return { ...r, errors };
}

const open = await caughtAt(700, 540);
g.check("a guard who reaches him shows the LOCKUP card, in the hall", open.during.text === "LOCKUP" && open.during.scene === "QA" && open.during.room === "hall", open.during);
g.check("after the card he is back in the party (P7 in the hall), not in the bedroom", open.after.party === "P7" && open.after.scene === "QA" && open.after.room === "hall" && open.after.ctrl, open.after);
g.check(
  "P7 starts again: the alarm ringing, the guards coming in at the hallway doorway",
  ["ring", "search"].includes(open.after.alarm) && open.after.guards.length >= 1 && open.after.guards.every(([gx, gy]) => Math.hypot(gx - hall.SPOTS.guardIn.x, gy - hall.SPOTS.guardIn.y) < 60),
  open.after,
);
g.check(
  "he is set back on the dance floor (the scene's restart point), not where he was caught",
  Math.hypot(open.after.x - hall.DANCE_SPOT.x, open.after.y - hall.DANCE_SPOT.y) < 20 && Math.hypot(open.after.x - 700, open.after.y - 540) > 60,
  open.after,
);
g.check("the party offers a spot again (a plant to hide in)", open.after.verbs.some((v) => v.startsWith("HIDE")), open.after.verbs);
g.check("no page errors", open.errors.length === 0, open.errors);

// Caught right beside the plant: the restart does not leave him standing in the pot (or anything solid).
const plant = await caughtAt(hall.SPOTS.plantMiddle.x + 36, hall.SPOTS.plantMiddle.y + 22);
g.check("caught beside the plant: back in the party, not standing in the pot", plant.during.text === "LOCKUP" && plant.after.party === "P7" && !plant.after.inSolid, plant.after);

// The bartender catches him twice in the snack close-up: the close-up closes and the party goes on in the hall.
{
  const { page, ctx, errors } = await g.open("?beat=party:P6");
  await page.evaluate(() => window.__ss.lockedReady);
  await sleep(1200);
  const now = () => page.evaluate(() => ({ p: window.SSQ.beat("ch1-party").now(), room: window.__ss.op.room, scene: window.__ss.op.scene, cur: window.__ss.op.cur ? window.__ss.op.cur.k : "" }));
  const until = async (f, ms) => {
    const t0 = Date.now();
    for (;;) {
      const s = await now();
      if (f(s)) return s;
      if (Date.now() - t0 > ms) return null;
      await sleep(80);
    }
  };
  const L = await page.evaluate(() => window.SSQ.beat("ch1-party").snackLayout());
  await page.evaluate((p) => ((window.__ss.op.sq.x = p.x - 10), (window.__ss.op.sq.y = p.y + 10)), L.spot);
  const t1 = Date.now();
  while (Date.now() - t1 < 3000 && !(await page.evaluate(() => !!window.__ss.op.act && window.__ss.op.act.verb === "GRAB"))) await sleep(100);
  await page.evaluate(() => (window.__ss.actionDown(), window.__ss.actionUp()));
  let s = await until((q) => q.p.snack, 6000);
  g.check("GRAB · snacks at the bar opens the snack close-up", !!s);
  // Twice: he taps a snack while the bartender faces him, so his paw is out in her sight (Brian 2026-11-24: a
  // tap takes a snack, no dragging; before, the test held a snack while she turned round).
  for (let k = 0; k < 2; k++) {
    await until((q) => q.p.snack && q.p.snack.phase === "face", 15000);
    const [, x, y] = L.cut.snacks[k];
    await page.evaluate((a) => window.__ss.ch1Pointer("down", a[0], a[1]), [x, y]);
    await until((q) => !q.p.snack || q.p.snack.catches > k, 6000);
    // tap through the bartender's line
    await until((q) => q.cur === "bub", 3000);
    await page.evaluate(() => window.__ss.opTap());
  }
  s = await until((q) => q.p && q.p.scene === "P7" && !q.p.snack, 8000);
  g.check("the bartender's second catch closes the close-up and the party goes on in the hall (the alarm, P7)", !!s && s.room === "hall" && s.scene === "QA" && !!s.p.alarm, s && { scene: s.p.scene, alarm: s.p.alarm, room: s.room, snack: s.p.snack });
  g.check("no page errors in the snack catch", errors.length === 0, errors);
  await ctx.close();
}
await g.finish("party-catch");
