/**
 * Security in Chapter 1 follows Brian's one capture rule every time: seen, someone sounds the alarm,
 * security comes right away, hiding gets him away, and only a guard who sees him catches him.
 * Brian raised this again and again: "we still need the officer to come out way sooner" (S#175),
 * "it's been so inconsistent with security coming and actually catching him" (S#398), "when the robots
 * spot you, shouldn't they set off the security alarm every time and you have to hide" (K#159).
 * See docs/ch1-design-audit-2026-11-22/angles/repeat-issues.md, issue 6.
 *
 * (a) The party (src/modules/party.js, party-alarm.js): in the party in disguise (P6) with fur showing, the
 *     guest who sees him shouts FUR! and reaches the wall alarm within 1.5 seconds of starting to run; when the
 *     bell rings the first guard walks in at once and a second follows within a second; a guard who sees him
 *     catches him (the LOCKUP card names who saw him and where); hidden in a plant he is never caught, and the
 *     guards give up ("They lost you."). The first alarm's close-up of the hand (wordless, about 2.4 s, Brian 30a)
 *     plays between the run and the bell.
 * (b) The Day 2 lunch sneak (src/modules/lunch-sneak.js) uses (a)'s rule: the witness runs to the FUR alarm, the
 *     guards come, hidden in the plant he gets away, standing he is caught. The night robot: the alarm and a guard
 *     come first, rolling into a ball gets him away, standing gets him caught.
 *   node tests/ch1-security.mjs
 */
import { join } from "node:path";
import { startGame, sleep, root } from "./game-page.mjs";

const ALARM_WITHIN_S = 1.5;

const g = await startGame({ port: 8965, name: "ch1-security" });
const lines = await import(join(root, "src", "modules", "party-lines.js"));
const watch = await import(join(root, "src", "modules", "party-watch.js"));

// (a) The party: P6 with one piece of his outfit gone (fur shows), standing in a guest's cone.
async function party(hide) {
  const { page, ctx, errors } = await g.open("?beat=party:P6");
  await page.evaluate(() => window.__ss.lockedReady);
  await sleep(1200);
  // Seen: tick the game with him held inside the cone of the first guest found who can see him alone.
  const seen = await page.evaluate(
    ([hide, at]) => {
      const ss = window.__ss,
        n = ss.op,
        b = window.SSQ.beat("ch1-party"),
        p = n.ch1PartyNow;
      p.lostPieces = ["head"]; // his hat is gone: fur shows (the cause; the test never sets the alarm)
      const W = ["teal", "stilt", "robot", "octopus-guest", "backpack", "camera", "bartender"];
      const inside = (c, x, y) => {
        const dx = x - c.ox,
          dy = y - at - c.oy;
        let a = Math.atan2(dy, dx) - c.a;
        while (a > Math.PI) a -= 2 * Math.PI;
        while (a < -Math.PI) a += 2 * Math.PI;
        return Math.abs(a) < c.half && Math.hypot(dx, dy) < c.len;
      };
      const pick = () => {
        const cones = b.cones();
        for (const id of W) {
          const c = cones.find((k) => k.id === id);
          for (const d of [90, 120, 70, 150])
            for (const da of [0, 0.2, -0.2]) {
              const x = c.ox + Math.cos(c.a + da) * d,
                y = c.oy + Math.sin(c.a + da) * d + at;
              if (y < 310 || y > 585 || x < 70 || x > 890) continue;
              if (cones.every((k) => k.id === id || !inside(k, x, y))) return { id, x, y };
            }
        }
        return null;
      };
      let t = 0,
        seenBy = "",
        seenAt = null,
        who = null;
      for (let i = 0; i < 30 * 8 && !p.alarm; i++) {
        who = pick() || who;
        who && ((n.sq.x = who.x), (n.sq.y = who.y));
        ss.tick(1 / 30);
        t += 1 / 30;
        if (seenAt === null && p.seenBy) ((seenAt = t), (seenBy = p.seenBy));
      }
      const a = p.alarm;
      return { spot: who, seenBy, seenAt, shoutAt: a ? t : null, witness: a ? a.w.id : "", from: a ? [Math.round(a.w.x), Math.round(a.w.y)] : null, who: a ? a.who : "", where: a ? a.where : "", scene: p.scene, phase: a ? a.phase : "" };
    },
    [hide, watch.SQUATCH_SEEN_ABOVE_FEET],
  );
  // Hiding: while the witness shouts, he steps into the middle plant (HIDE · plant, the action button).
  let hid = null;
  if (hide && seen.shoutAt !== null) {
    await page.evaluate((spot) => ((window.__ss.op.sq.x = spot.x), (window.__ss.op.sq.y = spot.y)), { x: 396, y: 552 });
    hid = await page.evaluate(() => {
      const ss = window.__ss,
        n = ss.op;
      ss.tick(1 / 30);
      const offer = n.act ? n.act.verb + " · " + n.act.cap : "";
      ss.actionDown();
      ss.actionUp();
      for (let i = 0; i < 30 && n.ch1PartyNow.pose !== "hidden"; i++) ss.tick(1 / 30);
      return { offer, pose: n.ch1PartyNow.pose, phase: n.ch1PartyNow.alarm && n.ch1PartyNow.alarm.phase };
    });
  }
  // The run to the wall alarm, in game time.
  const run = await page.evaluate(() => {
    const ss = window.__ss,
      p = ss.op.ch1PartyNow;
    let t = 0,
      runAt = null,
      pullAt = null;
    for (let i = 0; i < 30 * 10 && p.alarm && pullAt === null; i++) {
      ss.tick(1 / 30);
      t += 1 / 30;
      if (runAt === null && p.alarm.phase === "run") runAt = t;
      if (p.alarm.phase !== "shout" && p.alarm.phase !== "run") pullAt = t;
    }
    return { runAt, pullAt, phase: p.alarm && p.alarm.phase, reached: p.alarm && Math.hypot(p.alarm.w.x - 880, p.alarm.w.y - 318) < 6 };
  });
  // The first alarm's close-up plays itself in real time; watch closely for the bell.
  let ring = null;
  for (let i = 0; i < 600 && !ring; i++) {
    ring = await page.evaluate(() => {
      const a = window.__ss.op.ch1PartyNow.alarm;
      return a && a.phase !== "pull" ? { phase: a.phase, t: a.t, guards: a.guards.length } : null;
    });
    ring || (await sleep(10));
  }
  // From the bell: the guards, and then (standing in front of where they come in) the catch, or (hidden) "They lost you."
  const after = await page.evaluate(
    ([hide]) => {
      const ss = window.__ss,
        n = ss.op,
        p = n.ch1PartyNow,
        a = p.alarm;
      const lockedUp = () => (n.cur && n.cur.id === "jail") || n.q.some((q) => q.id === "jail");
      let t = a ? a.t : 0,
        secondAt = a && a.guards.length > 1 ? t : null,
        lockupAt = null,
        lostAt = null,
        first = null;
      for (let i = 0; i < 30 * 30 && lockupAt === null && lostAt === null; i++) {
        hide || ((n.sq.x = 760), (n.sq.y = 330));
        ss.tick(1 / 30);
        t += 1 / 30;
        const al = n.ch1PartyNow && n.ch1PartyNow.alarm;
        first || (first = al ? { t: Math.round(al.t * 100) / 100, guards: al.guards.length } : { t, guards: 0 });
        if (secondAt === null && al && al.guards.length > 1) secondAt = t;
        if (lockedUp()) lockupAt = t;
        if (n.ch1PartyNow && n.ch1PartyNow.lost) lostAt = t;
      }
      const card = (n.cur && n.cur.id === "jail" && n.cur) || n.q.find((q) => q.id === "jail") || null;
      return { first, secondAt, lockupAt, lostAt, cause: card ? card.cause || "" : "", scene: n.ch1PartyNow && n.ch1PartyNow.scene };
    },
    [hide],
  );
  await ctx.close();
  return { seen, hid, run, ring, after, errors };
}

const round = (v) => (v === null || v === undefined ? v : Math.round(v * 100) / 100);
const open = await party(false);
g.check("party: with fur showing, a guest who sees him shouts FUR! (the alarm starts, P7)", open.seen.shoutAt !== null && open.seen.scene === "P7", open.seen);
const runFor = open.run.runAt !== null && open.run.pullAt !== null ? open.run.pullAt - open.run.runAt : null;
g.check(`party: the guest reaches the wall alarm within ${ALARM_WITHIN_S} s of starting to run`, runFor !== null && runFor <= ALARM_WITHIN_S && open.run.reached, { runFor: round(runFor), witness: open.seen.witness, from: open.seen.from, run: open.run });
// The bell rings in the close-up's last frame; the next game frame (1/30 s) brings the first guard in.
g.check("party: the first guard walks in the moment the bell rings", !!open.ring && open.ring.phase === "ring" && !!open.after.first && open.after.first.guards >= 1 && open.after.first.t <= open.ring.t + 0.05, { ring: open.ring, first: open.after.first });
g.check("party: a second guard follows within a second", open.after.secondAt !== null && open.after.secondAt <= 1, open.after);
const cause = open.seen.who ? lines.lockupCause(open.seen.who, open.seen.where) : "?";
g.check("party: a guard who sees him catches him (LOCKUP), and the card names who saw him and where", open.after.lockupAt !== null && open.after.cause === cause, { ...open.after, want: cause });
const hid = await party(true);
g.check("party: during the alarm the plant offers HIDE · plant and he hides in it", !!hid.hid && hid.hid.offer === "HIDE · plant" && hid.hid.pose === "hidden", hid.hid);
g.check('party: hidden in the plant he is never caught; the guards give up ("They lost you.")', hid.after.lockupAt === null && hid.after.lostAt !== null, hid.after);
g.check("party: no page errors", open.errors.length === 0 && hid.errors.length === 0, [...open.errors, ...hid.errors]);

// (b) Places that can see him outside the party: stand him on a grid until one sees him. Brian's rule:
// the alarm and a guard come first (no instant LOCKUP); rolled into a ball he gets away ("They lost
// you."); standing in the open the guard reaches him (LOCKUP).
async function watched(id, beat, grid) {
  // ?beat= works only on a preview host, so open Chapter 1 and jump to the beat the same way it does.
  const { page, ctx, errors } = await g.open("?ch=1");
  await page.evaluate(() => window.__ss.lockedReady);
  const run = (roll) =>
    page.evaluate(
      ([grid, beat, roll]) => {
        const ss = window.__ss, n = ss.op;
        const lockedUp = () => (n.cur && n.cur.id === "jail") || n.q.some((q) => q.id === "jail");
        ((n.q = []), (n.cur = null), ss.ch1JumpBeat(beat));
        const start = { scene: n.scene, room: n.room, step: n.ch1Step };
        let seenAt = null;
        for (const [x, y] of grid) {
          Object.assign(n, { q: [], cur: null, ctrl: true, sqPose: "stand", walkTo: null, ch1Zoom: null });
          n.sq.x = x;
          n.sq.y = y;
          ss.tick(1 / 30);
          if (lockedUp() || ss.secNow() || n.ch1LunchRun) {
            seenAt = [x, y];
            break;
          }
        }
        if (!seenAt) return { start, seenAt };
        const instant = lockedUp();
        // A guest who saw him runs to the FUR alarm first (lunch); then the alarm and the guard, within 1.5 s.
        const witnessRan = !!n.ch1LunchRun && !ss.secNow();
        let guardAfter = null;
        for (let i = 0; i <= 45 && guardAfter === null && !lockedUp(); i++) {
          if (ss.secNow()) guardAfter = Math.round((i / 30) * 100) / 100;
          else ss.tick(1 / 30);
        }
        const alarmGuard = guardAfter !== null;
        // While the guard is coming the only way out is to hide: nothing walks him out of the room.
        const offers = (ss.spotsNow() || []).filter((o) => o && o.verb).map((o) => o.verb);
        let t = 0, lockupAt = null, lostAt = null;
        if (roll) n.sqPose = "ball";
        // Hold still (rolled up, or standing where he was seen) for up to 12 seconds.
        for (let i = 0; i < 360 && lockupAt === null && lostAt === null; i++) {
          if (n.cur && n.cur.id !== "jail") ((n.cur = null), (n.q = n.q.filter((q) => q.id === "jail")));
          ss.tick(1 / 30);
          t += 1 / 30;
          if (lockedUp()) lockupAt = Math.round(t * 10) / 10;
          if (!ss.secNow() && n.log.some((l) => l.text === "They lost you.")) lostAt = Math.round(t * 10) / 10;
        }
        // After the guard gives up, the guest who ran to the alarm walks back to his place (lunch).
        let homeAfter = null;
        if (roll && lostAt !== null)
          for (let i = 0; i < 300 && homeAfter === null; i++) {
            ss.tick(1 / 30);
            if (!n.ch1LunchRun) homeAfter = Math.round((i / 30) * 10) / 10;
          }
        return { start, seenAt, instant, witnessRan, guardAfter, alarmGuard, offers, lockupAt, lostAt, homeAfter };
      },
      [grid, beat, roll],
    );
  const stand = await run(false);
  g.check(`${id}: beat ${beat} opens where someone can see Squatch`, stand.seenAt !== null, stand);
  g.check(`${id}: being seen brings the alarm and a guard within 1.5 s, not an instant LOCKUP`, stand.seenAt && !stand.instant && stand.alarmGuard, stand);
  id === "lunch" && g.check("lunch: the guest who saw him runs to the FUR alarm before the guard comes", stand.witnessRan, stand);
  g.check(`${id}: standing in the open, the guard reaches him (LOCKUP)`, stand.lockupAt !== null, stand);
  g.check(`${id}: while the guard is coming, no action walks him out of the room`, stand.offers && !stand.offers.some((v) => v === "SNEAK" || v === "GO"), stand.offers);
  // A guard stays in the room he came into: if the story moves Squatch to another room, the guard is gone.
  const left = await page.evaluate(
    ([grid, beat]) => {
      const ss = window.__ss, n = ss.op;
      ((n.q = []), (n.cur = null), ss.ch1JumpBeat(beat));
      for (const [x, y] of grid) {
        Object.assign(n, { q: [], cur: null, ctrl: true, sqPose: "stand", walkTo: null, ch1Zoom: null });
        n.sq.x = x;
        n.sq.y = y;
        ss.tick(1 / 30);
        if (ss.secNow() || n.ch1LunchRun) break;
      }
      for (let i = 0; i < 60 && !ss.secNow(); i++) ss.tick(1 / 30);
      const came = !!ss.secNow();
      n.room = n.room === "hall" ? "passage" : "hall";
      ss.tick(1 / 30);
      return { came, after: ss.secNow() };
    },
    [grid, beat],
  );
  g.check(`${id}: a guard does not follow him into another room`, left.came && !left.after, left);
  const roll = await run(true);
  g.check(`${id}: rolled into a ball, he gets away ("They lost you.")`, roll.lostAt !== null && roll.lockupAt === null, roll);
  id === "lunch" && g.check("lunch: after the guard gives up, the guest walks back to his place", roll.homeAfter !== null, roll);
  await ctx.close();
  g.check(`${id}: no page errors`, errors.length === 0, errors);
}
const grid = [];
for (let y = 300; y <= 580; y += 40) for (let x = 120; x <= 860; x += 60) grid.push([x, y]);
// The Day 2 lunch sneak (src/modules/lunch-sneak.js) uses the party's own rule (party-alarm.js), as in (a): seen in the
// teal guest's look, the witness runs to the FUR alarm, the bell, the guards; hidden in the plant they give up;
// standing in the open a guard catches him (LOCKUP). No action walks him out of the hall while the alarm is on.
{
  const { page, ctx, errors } = await g.open("?ch=1");
  await page.evaluate(() => window.__ss.lockedReady);
  const lunch = (hide) =>
    page.evaluate((hide) => {
      const ss = window.__ss,
        n = ss.op,
        beat = window.SSQ.beat("ch1-lunch"),
        lu = beat.place,
        st = () => n.ch1Lunch || {},
        lockedUp = () => (n.cur && n.cur.id === "jail") || n.q.some((q) => q.id === "jail");
      ((n.q = []), (n.cur = null), ss.ch1JumpBeat(25));
      for (let i = 0; i < 300 && lu.watcherNow(lu.WATCHERS[0], st().t).phase !== "look"; i++) ss.tick(1 / 30);
      n.sq.x = 498;
      n.sq.y = 520;
      let shoutAt = null,
        runAt = null,
        ringAt = null,
        guardAt = null,
        lockupAt = null,
        lostAt = null,
        offers = [],
        t = 0;
      for (let i = 0; i < 30 * 30 && lockupAt === null && lostAt === null; i++) {
        ss.tick(1 / 30);
        t += 1 / 30;
        const a = st().alarm;
        a && shoutAt === null && (shoutAt = t);
        a && a.phase === "run" && runAt === null && (runAt = t);
        a && a.phase === "ring" && ringAt === null && ((ringAt = t), (offers = (ss.spotsNow() || []).filter((o) => o && o.verb).map((o) => o.verb + " · " + o.cap)));
        a && a.guards.length && guardAt === null && (guardAt = t);
        if (hide && a && a.phase === "ring" && n.sqPose === "stand") {
          n.sq.x = 396;
          n.sq.y = 552;
          ss.tick(1 / 30);
          const o = ss.offerNow();
          o && o.verb === "HIDE" && o.f();
        }
        if (n.cur && n.cur.id !== "jail") ((n.cur = null), (n.q = n.q.filter((q) => q.id === "jail")));
        lockedUp() && (lockupAt = t);
        shoutAt !== null && !st().alarm && (lostAt = t);
      }
      return { shoutAt, runAt, ringAt, guardAt, lockupAt, lostAt, offers };
    }, hide);
  const stand = await lunch(false);
  g.check("lunch: seen, the witness shouts FUR! and runs to the wall alarm before any guard comes", stand.shoutAt !== null && stand.runAt !== null && stand.guardAt > stand.runAt, stand);
  g.check("lunch: the first guard walks in as the bell rings", stand.ringAt !== null && stand.guardAt !== null && stand.guardAt - stand.ringAt < 0.1, stand);
  g.check("lunch: while the alarm rings, only hiding places are offered (nothing walks him out of the hall)", stand.offers.every((v) => /^HIDE/.test(v)), stand.offers);
  g.check("lunch: standing in the open, a guard reaches him (LOCKUP)", stand.lockupAt !== null, stand);
  const hid = await lunch(true);
  g.check('lunch: hidden in the plant he is never caught; the guards give up ("They lost you.")', hid.lockupAt === null && hid.lostAt !== null, hid);
  await ctx.close();
  g.check("lunch: no page errors", errors.length === 0, errors);
}
await watched("night", 42, grid);

await g.finish("ch1-security");
