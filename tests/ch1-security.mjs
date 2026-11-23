/**
 * Security in Chapter 1 follows Brian's one capture rule every time: seen, someone sounds the alarm,
 * security comes right away, hiding gets him away, and only a guard who sees him catches him.
 * Brian raised this again and again: "we still need the officer to come out way sooner" (S#175),
 * "it's been so inconsistent with security coming and actually catching him" (S#398), "when the robots
 * spot you, shouldn't they set off the security alarm every time and you have to hide" (K#159).
 * See docs/ch1-design-audit-2026-11-22/angles/repeat-issues.md, issue 6.
 *
 * (a) The party: the guest who saw him reaches the alarm and the first guard walks in within 1.5 seconds,
 *     a second guard follows, a guard who sees him catches him (LOCKUP), and hiding sends the guards
 *     to search his home instead of catching him.
 * (b) Every other place in Chapter 1 that can see Squatch (the Day 2 lunch guests, the night robot)
 *     must not go straight to LOCKUP with no alarm and no guard. Today they do; that is on KNOWN below.
 *   node tests/ch1-security.mjs
 */
import { startGame } from "./game-page.mjs";

// Problems Brian knows about. Take one off this list in the change that fixes it.
const KNOWN = {
  lunch: "Day 2 lunch: a guest who sees Squatch sends him straight to LOCKUP. No alarm, no guard, no chance to hide.",
  night: "Night loading bay: the delivery robot that sees Squatch sends him straight to LOCKUP. No alarm, no guard, no chance to hide.",
};
const ALARM_WITHIN_S = 1.5;

const g = await startGame({ port: 8965, name: "ch1-security" });

// (a) The party raid, set up the way the game starts it when the hat comes off (ch1RaidBegin).
async function party(hide) {
  const { page, ctx, errors } = await g.open("?ch=1");
  await page.evaluate(() => window.__ss.lockedReady);
  const r = await page.evaluate(
    ([hide, ALARM_WITHIN_S]) => {
      const ss = window.__ss, n = ss.op;
      const lockedUp = () => (n.cur && n.cur.id === "jail") || n.q.some((q) => q.id === "jail");
      Object.assign(n, { scene: "QA", room: "hall", ch1Party: true, ch1Disguise: false, ch1PartyOver: true, ch1Fur: false, q: [], cur: null, ctrl: true, walkTo: null });
      n.ch1Raid = { phase: "witness", witness: { x: 520, y: 610, x0: 520, y0: 610 }, guards: [], doorT: 0, left: false };
      Object.assign(n, hide ? { sqPose: "hidden" } : { sqPose: "stand" });
      n.sq.x = hide ? 220 : 760;
      n.sq.y = hide ? 530 : 400;
      let t = 0, alarmAt = null, guardAt = null, secondAt = null, lockupAt = null, homeAt = null;
      for (let i = 0; i < 30 * 30 && lockupAt === null && homeAt === null; i++) {
        ss.tick(1 / 30);
        t += 1 / 30;
        const raid = n.ch1Raid;
        if (alarmAt === null && raid && raid.phase === "search") alarmAt = t;
        if (guardAt === null && raid && raid.guards.length) guardAt = t;
        if (secondAt === null && raid && raid.guards.length > 1) secondAt = t;
        if (lockedUp()) lockupAt = t;
        if (!n.ch1Party && n.room === "closet") homeAt = t;
        // Standing case: keep him in the open, in front of where the guards come in (a player who walks into them).
        if (!hide && raid && raid.phase === "search") ((n.sq.x = 760), (n.sq.y = 400));
      }
      const round = (v) => (v === null ? null : Math.round(v * 100) / 100);
      return { alarmAt: round(alarmAt), guardAt: round(guardAt), secondAt: round(secondAt), lockupAt: round(lockupAt), homeAt: round(homeAt), scene: n.scene, room: n.room, ALARM_WITHIN_S };
    },
    [hide, ALARM_WITHIN_S],
  );
  await ctx.close();
  return { r, errors };
}

const open = await party(false);
g.check(`party: the guest reaches the alarm within ${ALARM_WITHIN_S} s`, open.r.alarmAt !== null && open.r.alarmAt <= ALARM_WITHIN_S, open.r);
g.check("party: the first guard walks in the moment the alarm sounds", open.r.guardAt !== null && open.r.guardAt === open.r.alarmAt, open.r);
g.check("party: a second guard follows within a second", open.r.secondAt !== null && open.r.secondAt - open.r.guardAt <= 1, open.r);
g.check("party: a guard who sees him catches him (LOCKUP)", open.r.lockupAt !== null && open.r.lockupAt > open.r.guardAt, open.r);
const hid = await party(true);
g.check("party: hiding is never a catch; the guards go and search his home", hid.r.lockupAt === null && hid.r.homeAt !== null, hid.r);
g.check("party: no page errors", open.errors.length === 0 && hid.errors.length === 0, [...open.errors, ...hid.errors]);

// (b) Places that can see him outside the party: stand him on a grid until one sees him, then look at
// what came first. Brian's rule needs an alarm and a guard before any LOCKUP.
async function watched(id, beat, grid) {
  // ?beat= works only on a preview host, so open Chapter 1 and jump to the beat the same way it does.
  const { page, ctx, errors } = await g.open("?ch=1");
  await page.evaluate(() => window.__ss.lockedReady);
  const r = await page.evaluate(
    ([grid, beat]) => {
      const ss = window.__ss, n = ss.op;
      const lockedUp = () => (n.cur && n.cur.id === "jail") || n.q.some((q) => q.id === "jail");
      ((n.q = []), (n.cur = null), ss.ch1JumpBeat(beat));
      const start = { scene: n.scene, room: n.room, step: n.ch1Step };
      for (const [x, y] of grid) {
        Object.assign(n, { q: [], cur: null, ctrl: true, sqPose: "stand", walkTo: null, ch1Zoom: null });
        n.sq.x = x;
        n.sq.y = y;
        for (let i = 0; i < 6; i++) {
          ss.tick(1 / 30);
          if (lockedUp()) return { start, seenAt: [x, y], lockupAfterFrames: i + 1, guards: n.ch1Raid ? n.ch1Raid.guards.length : 0 };
        }
      }
      return { start, seenAt: null };
    },
    [grid, beat],
  );
  await ctx.close();
  g.check(`${id}: beat ${beat} opens where someone can see Squatch`, r.seenAt !== null, r);
  const instant = r.seenAt !== null && r.guards === 0;
  if (KNOWN[id]) g.known(KNOWN[id], instant, r);
  else g.check(`${id}: being seen brings the alarm and a guard before any LOCKUP`, !instant, r);
  g.check(`${id}: no page errors`, errors.length === 0, errors);
}
const grid = [];
for (let y = 300; y <= 580; y += 40) for (let x = 120; x <= 860; x += 60) grid.push([x, y]);
await watched("lunch", 25, grid);
await watched("night", 42, grid);

await g.finish("ch1-security");
