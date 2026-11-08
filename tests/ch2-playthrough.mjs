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
import { startGame, readLines } from "./game-page.mjs";
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
const catches = await page.evaluate(() => window.__ss.op.log.filter((e) => e.k === "caught" || e.k === "shoo").map((e) => e.text));
g.check("the route is never caught", !failed && end.caught === 0 && catches.length === 0, { caught: end.caught, catches });
const tally = await page.evaluate(() => window.__ss.ch2Tally());
g.check("the tally card shows the +250 bonus earned (Never caught!)", tally.includes(readLines()["22.1"]), tally);
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("ch2-playthrough");
