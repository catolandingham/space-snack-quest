/**
 * The ↺ hold restarts the part of Chapter 1 the player is in, and never leaves a dead end.
 * Brian's rule (K29): ↺ restarts the current scene. A restart that jumps back to the opening, or that
 * does nothing, leaves a stuck kid with no way forward (docs/CHAPTER-1-PROBLEMS.md, problem 1;
 * repeat-issues.md, issue 9).
 *
 * For each Chapter 1 beat the game can open (the Day 1 party's scenes P2, P6 and P7 by its own jump, as
 * ?beat=party:P6 opens them; Day 2 and the night by window.__ss.ch1JumpBeat): walk Squatch away from where the beat starts, hold ↺, and check
 *   (a) he stays in Chapter 1's same part (not the opening in the bedroom),
 *   (b) he has control and a goal afterwards,
 *   (c) ↺ puts him back where the step he is on began (the party and the night use their own restarts).
 *   node tests/ch1-restart.mjs
 */
import { startGame } from "./game-page.mjs";

const BEATS = [22, 23, 25, 27, 29, 33, 37, 38, 42, 43, 44, 45, 47, 48, 49, 50, 51, 53];

const g = await startGame({ port: 8966, name: "ch1-restart" });
const errors = [];

// Each beat gets a fresh page, so nothing one beat leaves behind changes the next.
async function tryRestart(label, setUp) {
  const { page, ctx, errors: pageErrors } = await g.open("?ch=1");
  await page.evaluate(() => window.__ss.lockedReady);
  const r = await page.evaluate(
    ([label, setUp]) => {
      const ss = window.__ss, n = ss.op;
      if (String(setUp).startsWith("party:")) {
        // A party scene (src/modules/party.js), opened the way ?beat=party:P6 opens it.
        ((n.q = []), (n.cur = null), window.SSQ.beat("ch1-party").jump(setUp.slice(6)));
      } else ((n.q = []), (n.cur = null), ss.ch1JumpBeat(setUp));
      for (let i = 0; i < 10; i++) ss.tick(1 / 30);
      const playing = !!n.ctrl && !n.cur && !n.q.length;
      const before = { scene: n.scene, room: n.room, step: n.ch1Step || "", x: Math.round(n.sq.x), y: Math.round(n.sq.y), chip: n.ch1Chip || n.chip || "" };
      // Wander off: 200 px across the floor from where the beat put him.
      Object.assign(n, { q: [], cur: null, ctrl: true, sqPose: "stand", walkTo: null });
      n.sq.x = before.x < 480 ? before.x + 200 : before.x - 200;
      const moved = { x: Math.round(n.sq.x), y: Math.round(n.sq.y) };
      ss.sectionReset();
      for (let i = 0; i < 10; i++) ss.tick(1 / 30);
      // (cut: a part that is a cutscene, the loading bay's beats 30 to 36, plays again from its start: the story queue
      // has its steps; loading-bay.js restart; up: a card, a line or a picture waiting for NEXT, as at a beat that opens with
      // one: the escape's "Six days later" on the home calendar)
      const after = { scene: n.scene, room: n.room, step: n.ch1Step || "", x: Math.round(n.sq.x), y: Math.round(n.sq.y), ctrl: !!n.ctrl, up: !!(n.cur && ["card", "bub", "wait"].includes(n.cur.k)), chip: n.ch1Chip || n.chip || "", cut: !n.ctrl && !!(n.cur || n.q.length) && !!(window.SSQ.beat("ch1-bay") && window.SSQ.beat("ch1-bay").active()) };
      const putBack = after.x !== moved.x || after.y !== moved.y || after.step !== before.step;
      return { label, playing, before, moved, after, putBack };
    },
    [label, setUp],
  );
  errors.push(...pageErrors);
  await ctx.close();
  return r;
}

const results = [await tryRestart("Day 1 party, the sneak (P2)", "party:P2"), await tryRestart("Day 1 party in disguise (P6)", "party:P6"), await tryRestart("Day 1 party, the FUR alarm (P7)", "party:P7")];
for (const b of BEATS) results.push(await tryRestart(`beat ${b}`, b));

const toOpening = results.filter((r) => r.before.scene !== "O1" && r.after.scene === "O1");
g.check("↺ never sends him back to the opening from a later part of Chapter 1", toOpening.length === 0, toOpening);
const otherPart = results.filter((r) => r.after.scene !== r.before.scene && r.after.scene !== "O1");
g.check("↺ keeps him in the same part of the chapter", otherPart.length === 0, otherPart);
const stuck = results.filter((r) => (!r.after.ctrl && !r.after.cut && !r.after.up) || (r.before.chip && !r.after.chip));
g.check("after ↺ he can move and has a goal (or, in the loading bay's cutscene, the part plays again; or the card or line his part opens with waits for NEXT)", stuck.length === 0, stuck);
// The party (QA) and the night (Q4) keep their own restarts (CH1_CHECKPOINTS). Everywhere else ↺ puts
// him back where the step he is on began, on that same step (noteCh1Step in src/game/20-ch2.js).
// Only beats that open with the player in control: a beat that opens in a cutscene has no step start yet.
const own = results.filter((r) => r.playing && r.before.scene !== "QA" && r.before.scene !== "Q4");
const notBack = own.filter((r) => r.after.step !== r.before.step || Math.abs(r.after.x - r.before.x) > 2 || Math.abs(r.after.y - r.before.y) > 2);
g.check(`↺ puts him back where his step began, on the same step (${own.length} beats)`, notBack.length === 0, notBack);
const handMade = results.filter((r) => (r.before.scene === "QA" || r.before.scene === "Q4") && !r.putBack);
g.check("↺ at the party and at night puts him back (their own restarts)", handMade.length === 0, handMade);
g.check("no page errors", errors.length === 0, errors);
await g.finish("ch1-restart");
