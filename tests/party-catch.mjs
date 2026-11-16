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
  };
});
g.check("a party catch does not send Squatch back to the bedroom", after.scene === "QA" && after.room === "hall" && after.scene !== "O1", after);
g.check("the party offers a spot again and the guards are gone", after.ctrl && !after.raid && !after.over && after.disguise && after.verbs.length > 0, after);
g.check("he is a little back from where he was caught", after.x < 719 && after.x > 40, after);
g.check("no page errors", errors.length === 0, errors);
await g.finish("party-catch");
