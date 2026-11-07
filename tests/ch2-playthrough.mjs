/**
 * Plays Chapter 2 from ?ch=2 to the Chapter 2 tally card with keys only, the way a person does (task T13).
 *   node tests/ch2-playthrough.mjs          (ROUTE_LOG=1 prints one line per step)
 *
 * The steps are in tests/routes/ch2.json and are played by tests/route-player.mjs. Every move is a
 * real key press sent through Chrome (arrow keys, E, Enter), so the game hears it exactly as it hears
 * a player. Nothing is written to the game's state and nobody is moved by the test.
 *
 * If a step makes no progress for 20 seconds, the test fails with the step number and the state
 * line from the debug strip (task T4).
 */
import { startGame } from "./game-page.mjs";
import { readRoute, playRoute, keyboardInput, look } from "./route-player.mjs";

const route = readRoute("ch2.json");
const g = await startGame({ port: 8790, name: "ch2-playthrough" });
const { ctx, page, errors } = await g.open("?ch=2");

const t0 = Date.now();
const { failed, rolls } = await playRoute(page, keyboardInput(page), route.steps);
const end = await look(page);
const secs = ((Date.now() - t0) / 1000).toFixed(0);
g.check(
  `Chapter 2 plays from ?ch=2 to the tally card with keys only (${route.steps.length} steps, ${secs}s, ${rolls} rolls)`,
  !failed && end.cur === "panel:tally2",
  failed ? `stuck at step ${failed.step} "${failed.say}": ${failed.why}. State: ${failed.state}` : end.line,
);
g.check("the route was played without a capture", !failed && end.caught === 0, { caught: end.caught });
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("ch2-playthrough");
