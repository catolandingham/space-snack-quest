/**
 * "Outline; words if stuck" (Brian, 2026-11-22, his multiple-choice pick): the next place or thing gets a
 * soft outline and no goal line at first; if the kid does nothing useful for about 20 seconds, the short goal
 * line appears. A goal without an outline yet keeps its words from the start (rule 11: the player always
 * knows the goal).
 *   node tests/ch1-words-if-stuck.mjs
 */
import { startGame } from "./game-page.mjs";

const g = await startGame({ port: 8975, name: "ch1-words-if-stuck" });
const { page, ctx, errors } = await g.open("?ch=1");
await page.evaluate(() => window.__ss.lockedReady);

// Day 2 lunch walk (beat 25): the doorway to the hallway is outlined. Squatch stays at the start, unseen.
const outlined = await page.evaluate(() => {
  const ss = window.__ss, n = ss.op;
  ((n.q = []), (n.cur = null), ss.ch1JumpBeat(25));
  // The beat shortcut does not set the step's words; the game does it through ch1Ready.
  n.ch1Chip = "Squatch: take Mops his lunch";
  const words = (t) => {
    for (let i = 0; i < Math.round(t * 30); i++) ss.tick(1 / 30);
    ss.drawFrame();
    return ss.chipDrawn();
  };
  const atStart = words(0.5),
    outline = !!n.lastRing && !!n.lastRing.box,
    at15 = words(15),
    at21 = words(6),
    goal = n.ch1Chip;
  // Moving the story on starts the wait again: a new step has its outline and no words.
  ((n.ch1Step = "give"), (n.room = "passage"), (n.ch1Chip = "Squatch: give Mops his lunch"), (n.mo.x = 500), (n.mo.y = 510), (n.moPose = "stand"));
  const nextStep = words(0.5),
    nextOutline = !!n.lastRing && n.T - n.lastRing.T < 0.3;
  return { atStart, outline, at15, at21, goal, nextStep, nextOutline };
});
g.check("an outlined goal shows its outline", outlined.outline, outlined);
g.check("no goal words at first while the outline shows", outlined.atStart === "", outlined);
g.check("still no goal words after 15 seconds", outlined.at15 === "", outlined);
g.check("after about 20 seconds stuck, the goal words appear", outlined.at21 === outlined.goal && !!outlined.goal, outlined);
g.check("a goal with no outline yet (give Mops his lunch) shows its words at once", !outlined.nextOutline && outlined.nextStep === "Squatch: give Mops his lunch", outlined);
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("ch1-words-if-stuck");
