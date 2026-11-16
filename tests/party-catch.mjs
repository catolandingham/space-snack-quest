/**
 * A catch at the party stays in the party. It does not restart the bedroom.
 *   node tests/party-catch.mjs
 */
import { startGame } from "./game-page.mjs";

const g = await startGame({ port: 8948, name: "party-catch" });
const { page, errors } = await g.open("?ch=1");
await page.evaluate(() => window.__ss.lockedReady);
const after = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.scene = "QA";
  n.room = "hall";
  n.ch1Party = true;
  n.ch1Disguise = false;
  n.ch1PartyOver = true;
  n.ch1Fur = true;
  n.ch1Raid = { phase: "search", guards: [{ x: 700, y: 540, t: 2, face: 0 }], doorT: 0, left: false };
  n.sqPose = "stand";
  n.sq.x = 719;
  n.sq.y = 542;
  n.ctrl = true;
  n.q = [];
  n.cur = null;
  ss.capture("s6");
  ss.tick(0.05);
  const card = n.cur && n.cur.id === "jail" && n.cur.text === "LOCKUP" ? n.cur.text : "";
  for (let i = 0; i < 40; i++) {
    ss.tick(0.4);
    if (n.cur && (n.cur.k === "bub" || n.cur.k === "card" || n.cur.k === "panel")) ss.opTap();
  }
  const spots = (ss.spotsNow() || []).filter((s) => s && s.verb);
  return {
    scene: n.scene,
    room: n.room,
    raid: !!n.ch1Raid,
    over: !!n.ch1PartyOver,
    disguise: !!n.ch1Disguise,
    ctrl: !!n.ctrl,
    x: Math.round(n.sq.x),
    y: Math.round(n.sq.y),
    verbs: spots.map((s) => s.verb),
    cur: n.cur ? n.cur.k : "",
    left: n.q.length,
    lockup: card,
  };
});
g.check("the lockup card shows before he is set back in the party", after.lockup === "LOCKUP" && after.scene === "QA", after);
g.check("the party offers a spot again and the guards are gone", after.ctrl && !after.raid && !after.over && after.disguise && after.verbs.length > 0, after);
g.check("he is a little back from where he was caught", after.x < 719 && after.x > 40, after);
g.check("no page errors", errors.length === 0, errors);
const cut = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.scene = "QA";
  n.room = "hall";
  n.ch1Party = true;
  n.ch1Disguise = true;
  n.ch1Cut = { id: "bar", zoom: 1, paw: { x: 480, y: 520 }, held: "", bag: 0, back: 5, glance: 0, face: 0, catches: 0, drag: false };
  n.sqPose = "stand";
  n.sq.x = 500;
  n.sq.y = 530;
  n.ctrl = true;
  n.q = [];
  n.cur = null;
  ss.capture("s6");
  for (let i = 0; i < 40; i++) {
    ss.tick(0.4);
    if (n.cur && (n.cur.k === "bub" || n.cur.k === "card" || n.cur.k === "panel")) ss.opTap();
  }
  return { scene: n.scene, cut: n.ch1Cut && n.ch1Cut.id };
});
g.check("a catch closes the snack cut-in and stays in the party", cut.scene === "QA" && !cut.cut, cut);
const plant = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.scene = "QA";
  n.room = "hall";
  n.ch1Party = true;
  n.ch1Disguise = true;
  n.ch1PartyOver = true;
  n.ch1Raid = { phase: "search", guards: [{ x: 400, y: 560, t: 2, face: 0 }], doorT: 0, left: false };
  n.sqPose = "stand";
  n.sq.x = 432;
  n.sq.y = 574;
  n.ctrl = true;
  n.q = [];
  n.cur = null;
  ss.capture("s6");
  for (let i = 0; i < 40; i++) {
    ss.tick(0.4);
    if (n.cur && (n.cur.k === "bub" || n.cur.k === "card" || n.cur.k === "panel")) ss.opTap();
  }
  const solids = ss.solids ? ss.solids() : [];
  const inside = solids.some((b) => n.sq.x > b.x0 && n.sq.x < b.x1 && n.sq.y > b.y0 && n.sq.y < b.y1);
  return { scene: n.scene, x: Math.round(n.sq.x), y: Math.round(n.sq.y), inside };
});
g.check("a catch from beside the plant does not leave him standing in the pot", plant.scene === "QA" && !plant.inside && !(plant.x > 412 && plant.x < 476 && plant.y > 520 && plant.y < 552), plant);
await g.finish("party-catch");
