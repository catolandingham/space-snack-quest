/**
 * A catch at the party (docs/CHAPTER-1-PROBLEMS.md, problem 1; Brian, 2026-11-13).
 * A guard sees Squatch in the party raid. The LOCKUP card shows, then Squatch is let out into his bedroom
 * and the guard comes in to look for him: the same place the story reaches after a clean getaway.
 * Before this fix the game went back to the opening bedroom scene with no way forward.
 *   node tests/ch1-party-catch.mjs
 */
import { startGame, sleep } from "./game-page.mjs";

const g = await startGame({ port: 8903, name: "ch1-party-catch" });
const { page, errors } = await g.open("?ch=1", { width: 375, height: 812 });

// The raid as the game has it once the guards are in: Squatch out in the open, a guard walking at him.
const raid = (hidden) =>
  page.evaluate((hidden) => {
    const ss = window.__ss,
      n = ss.op;
    ss.drain();
    Object.assign(n, { scene: "QA", room: "hall", ch1D: false, ch1Party: true, ch1PartyOver: true, ch1Disguise: false, ch1Fur: false, ctrl: true, q: [], cur: null, act: null, walkTo: null });
    n.sqPose = hidden ? "hidden" : "stand";
    n.sq.x = hidden ? 220 : 640;
    n.sq.y = hidden ? 530 : 460;
    n.ch1Raid = { phase: "search", witness: { x: 800, y: 430, x0: 520, y0: 610 }, guards: [{ x: hidden ? 480 : 760, y: hidden ? 570 : 460, t: 1, face: Math.PI }], doorT: 0, left: false };
    return { caught: ss.ch.caught };
  }, hidden);
const snap = () =>
  page.evaluate(() => {
    const ss = window.__ss,
      n = ss.op,
      o = ss.offerNow(),
      inSolid = ss.solids().some((b) => n.sq.x > b.x && n.sq.x < b.x + b.w && n.sq.y > b.y && n.sq.y < b.y + b.h);
    return {
      scene: n.scene, room: n.room, ctrl: !!n.ctrl, search: !!n.ch1Search, guard: !!n.guard, party: !!n.ch1Party, raid: !!n.ch1Raid,
      pose: n.sqPose, mops: n.moPose, x: Math.round(n.sq.x), y: Math.round(n.sq.y), offer: o ? o.verb + " \u00b7 " + o.cap : "", inSolid,
      card: n.cur ? n.cur.id || n.cur.k : "", day2: !!n.ch1Day2,
    };
  });
const ticks = (k) => page.evaluate((k) => { for (let i = 0; i < k; i++) window.__ss.tick(0.05); }, k);

// 1. The clean getaway, for comparison: hidden in the plant, the guards reach the door, Squatch goes home.
await raid(true);
await ticks(60);
await page.evaluate(() => window.__ss.drain());
const clean = await snap();
g.check("clean getaway: the guard search starts in the bedroom", clean.scene === "Q3" && clean.room === "closet" && clean.search && clean.guard && clean.ctrl, clean);

// 2. The catch: a guard sees him.
const before = await raid(false);
let card = "";
for (let i = 0; i < 80 && card !== "jail"; i++) {
  await ticks(1);
  card = (await snap()).card;
}
g.check("a guard who sees Squatch in the raid brings the LOCKUP card", card === "jail", card);
const cardText = await page.evaluate(() => { const c = window.__ss.op.cur; return c ? [c.text, c.cause, c.restart] : []; });
g.check("the card says who saw him", cardText[0] === "LOCKUP" && /tourist saw Squatch in the hall/.test(cardText[1] || ""), cardText);
await page.evaluate(() => window.__ss.drain());
const after = await snap();
const caught = await page.evaluate(() => window.__ss.ch.caught);
g.check("the catch is counted once", caught === before.caught + 1, { before: before.caught, caught });
g.check("after the card Squatch is in his bedroom, not back at the opening", after.scene === "Q3" && after.room === "closet", after);
g.check("the party and the raid are over", !after.party && !after.raid, after);
g.check("the guard comes looking and the player is in control", after.search && after.guard && after.ctrl && after.pose === "stand", after);
g.check("the way forward is offered: HIDE \u00b7 bed", after.offer === "HIDE \u00b7 bed", after);
g.check("Squatch is not standing inside furniture", !after.inSolid, after);
const same = ["scene", "room", "ctrl", "search", "guard", "party", "raid", "pose", "mops", "x", "y", "offer"].filter((k) => clean[k] !== after[k]);
g.check("it is the same place the clean getaway reaches", same.length === 0, same.map((k) => `${k}: ${clean[k]} vs ${after[k]}`));

// 3. The story goes on from there: hide under the bed, Mops comes home, day 2 starts.
await page.evaluate(() => { const ss = window.__ss, o = ss.offerNow(); o && o.f(); ss.drain(); });
await sleep(100);
const on = await snap();
g.check("hiding under the bed leads on to the next day", on.day2 && on.scene !== "O1" && on.scene !== "Q3", on);
g.check("no script errors", errors.length === 0, errors);
await g.finish("ch1-party-catch");
