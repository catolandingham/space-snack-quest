/**
 * The ↺ hold restarts the part of Chapter 1 the player is in, and never leaves a dead end.
 * Brian's rule (K29): ↺ restarts the current scene. A restart that jumps back to the opening, or that
 * does nothing, leaves a stuck kid with no way forward (docs/CHAPTER-1-PROBLEMS.md, problem 1;
 * repeat-issues.md, issue 9).
 *
 * For each Chapter 1 beat the game can open (the Day 1 party by ?scene=QA, Day 2 and the night by
 * window.__ss.ch1JumpBeat): walk Squatch away from where the beat starts, hold ↺, and check
 *   (a) he stays in Chapter 1's same part (not the opening in the bedroom),
 *   (b) he has control and a goal afterwards,
 *   (c) ↺ actually put him back (his place or the beat's step changed back). Parts with no restart point
 *       yet are on KNOWN below.
 *   node tests/ch1-restart.mjs
 */
import { startGame } from "./game-page.mjs";

// Scenes whose ↺ does nothing today (no entry in CH1_CHECKPOINTS, src/game/25-capture.js).
// Take one off in the change that gives it a restart point.
const KNOWN_NO_RESTART = new Set(["Q3", "Q5", "Q6", "Q7", "Q8", "Q9", "QP"]);
const BEATS = [22, 23, 25, 27, 29, 33, 37, 38, 42, 43, 44, 45, 47, 48, 49, 50, 51, 53];

const g = await startGame({ port: 8966, name: "ch1-restart" });
const { page, ctx, errors } = await g.open("?ch=1");
await page.evaluate(() => window.__ss.lockedReady);

async function tryRestart(label, setUp) {
  return page.evaluate(
    ([label, setUp]) => {
      const ss = window.__ss, n = ss.op;
      if (setUp === "party") {
        // The party as ?scene=QA opens it, with control.
        ss.sceneQA ? ss.sceneQA() : null;
        Object.assign(n, { scene: "QA", room: "hall", ch1Party: true, ch1Disguise: true, ch1PartyOver: false, q: [], cur: null, ctrl: true });
      } else ((n.q = []), (n.cur = null), ss.ch1JumpBeat(setUp));
      for (let i = 0; i < 10; i++) ss.tick(1 / 30);
      const before = { scene: n.scene, room: n.room, step: n.ch1Step || "", x: Math.round(n.sq.x), y: Math.round(n.sq.y), chip: n.ch1Chip || n.chip || "" };
      // Wander off: 200 px across the floor from where the beat put him.
      Object.assign(n, { q: [], cur: null, ctrl: true, sqPose: "stand", walkTo: null });
      n.sq.x = before.x < 480 ? before.x + 200 : before.x - 200;
      const moved = { x: Math.round(n.sq.x), y: Math.round(n.sq.y) };
      ss.sectionReset();
      for (let i = 0; i < 10; i++) ss.tick(1 / 30);
      const after = { scene: n.scene, room: n.room, step: n.ch1Step || "", x: Math.round(n.sq.x), y: Math.round(n.sq.y), ctrl: !!n.ctrl, chip: n.ch1Chip || n.chip || "" };
      const putBack = after.x !== moved.x || after.y !== moved.y || after.step !== before.step;
      return { label, before, moved, after, putBack };
    },
    [label, setUp],
  );
}

const results = [await tryRestart("Day 1 party", "party")];
for (const b of BEATS) results.push(await tryRestart(`beat ${b}`, b));

const toOpening = results.filter((r) => r.before.scene !== "O1" && r.after.scene === "O1");
g.check("↺ never sends him back to the opening from a later part of Chapter 1", toOpening.length === 0, toOpening);
const otherPart = results.filter((r) => r.after.scene !== r.before.scene && r.after.scene !== "O1");
g.check("↺ keeps him in the same part of the chapter", otherPart.length === 0, otherPart);
const stuck = results.filter((r) => !r.after.ctrl || (r.before.chip && !r.after.chip));
g.check("after ↺ he can move and has a goal", stuck.length === 0, stuck);
const nothing = results.filter((r) => !r.putBack);
const knownNothing = nothing.filter((r) => KNOWN_NO_RESTART.has(r.before.scene));
const newNothing = nothing.filter((r) => !KNOWN_NO_RESTART.has(r.before.scene));
g.check("↺ puts him back in every part that has a restart point", newNothing.length === 0, newNothing);
g.known(
  `↺ does nothing in ${knownNothing.length} of ${results.length} beats checked (scenes ${[...new Set(knownNothing.map((r) => r.before.scene))].join(", ")} have no restart point)`,
  knownNothing.length > 0,
  knownNothing.map((r) => r.label),
);
const fixed = [...KNOWN_NO_RESTART].filter((s) => results.some((r) => r.before.scene === s) && !knownNothing.some((r) => r.before.scene === s));
fixed.length && console.log(`NOTE ↺ now works in ${fixed.join(", ")}: take them off KNOWN_NO_RESTART.`);
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("ch1-restart");
