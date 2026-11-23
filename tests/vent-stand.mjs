/**
 * A party-night walk must not finish inside Mops.
 * The morning hum used to leave n.mo.walking on; the rebuilt morning (src/modules/morning.js) sets it only while
 * Mops walks out, and clears it when he is gone. At the vent, Squatch then walked
 * through him and stopped at 815, 470, inside his body (CI run 43954456685).
 * The home-room picture is not involved: the hangar has no furniture solids.
 *   node tests/vent-stand.mjs
 */
import { startGame, toMorningSong } from "./game-page.mjs";

const g = await startGame({ port: 8879, name: "vent stand" });
const { page } = await g.open("?ch=1");
await toMorningSong(page);
const out = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op;
  const inside = (x, y, b, pad = -6) => x > b.x0 - pad && x < b.x1 + pad && y > b.y0 - pad && y < b.y1 + pad;
  // TALK · Mops (or SING ALONG), then tap through his goodbye until he walks out.
  (ss.spotsNow() || []).find((s) => s.id === "sing").f();
  for (let i = 0; i < 400 && !(n.ch1Morning && n.ch1Morning.step === "leave"); i++) {
    n.cur && n.cur.k === "bub" && ((n.bt = 1), ss.opTap());
    ss.tick(0.05);
  }
  const started = !!n.mo.walking;
  for (let i = 0; i < 400 && n.moPose !== "hidden"; i++) ss.tick(1 / 30);
  const cleared = n.moPose === "hidden" && !n.mo.walking;
  Object.assign(n, { q: [], cur: null, ch1Morning: null });
  Object.assign(n, {
    ch1Day2: true,
    ch1D: true,
    ch1Night: true,
    room: "hangar",
    scene: "Q5",
    ctrl: true,
    sqPose: "stand",
    moPose: "stand",
    ch1Step: "roll",
  });
  n.sq.x = 790;
  n.sq.y = 470;
  n.mo.x = 838;
  n.mo.y = 470;
  n.walkTo = { x: 820, y: 470, lx: 790, ly: 470, lt: n.T, room: "hangar" };
  let entered = false;
  for (let i = 0; i < 30; i++) {
    window.__ss.tick(1 / 30);
    const m = { x0: n.mo.x - 46, x1: n.mo.x + 46, y0: n.mo.y - 46, y1: n.mo.y + 46 };
    if (inside(n.sq.x, n.sq.y, m)) entered = true;
  }
  // The home room's bed, bucket and Guardian box (00-core.js ih(), closet) must not leak into the loading bay.
  // The loading bay's own furniture (CH1_FURNITURE.hangar) is allowed.
  const home = ["536,596,500,571", "307,375,473,522", "83,286,409,526"];
  const hangarSolids = window.__ss.solids().map((b) => [b.x0, b.x1, b.y0, b.y1].join(","));
  return { started, cleared, entered, x: Math.round(n.sq.x), homeInHangar: hangarSolids.filter((b) => home.includes(b)) };
});
g.check("Mops walking out at the end of the morning is marked as walking", out.started === true, out);
g.check("once he is gone the walking flag is cleared", out.cleared === true, out);
g.check("the vent step does not finish inside Mops", out.entered === false, out);
g.check("the hangar adds no home-room furniture", out.homeInHangar.length === 0, out);
await g.finish("vent stand");
