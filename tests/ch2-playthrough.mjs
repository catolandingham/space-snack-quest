/**
 * Plays Chapter 2 from ?ch=2 to the tally card on a phone, with taps only.
 *   node tests/ch2-playthrough.mjs          (ROUTE_LOG=1 prints one line per step)
 *
 * The steps are in tests/routes/ch2.json. Every move is a touch: the joystick, the big
 * button, a tap on the picture, and a tap on each goal chip. Nothing is written into the
 * game's state. The video and the screenshots go to tests/out/ for CI.
 *
 * If a step makes no progress for 20 seconds, the test fails with the step number and the state
 * line from the debug strip (task T4).
 */
import { mkdirSync } from "node:fs";
import { startGame, readLines } from "./game-page.mjs";
import { readRoute, playRoute, touchInput, PHONE, look } from "./route-player.mjs";

const route = readRoute("ch2.json");
const g = await startGame({ port: 8790, name: "ch2-playthrough" });
const { ctx, page, errors } = await g.open("?ch=2", PHONE);
mkdirSync("tests/out", { recursive: true });
const rec = await page.screencast({ path: "tests/out/ch2-playthrough.webm" });
await page.screenshot({ path: "tests/out/ch2-start.png" });

const t0 = Date.now();
const input = await touchInput(page);
let failed, rolls;
try {
  ({ failed, rolls } = await playRoute(page, input, route.steps));
  await page.screenshot({ path: "tests/out/ch2-end.png" });
} finally {
  await rec.stop();
}
const end = await look(page);
const secs = ((Date.now() - t0) / 1000).toFixed(0);
g.check(
  `Chapter 2 plays from ?ch=2 to the tally card with phone taps (${route.steps.length} steps, ${secs}s, ${rolls} rolls, ${input.chips.length} chips)`,
  !failed && end.cur === "panel:tally2" && input.chips.length > 0,
  failed ? `stuck at step ${failed.step} "${failed.say}": ${failed.why}. State: ${failed.state}` : { line: end.line, chips: input.chips },
);
const catches = await page.evaluate(() => window.__ss.op.log.filter((e) => e.k === "caught" || e.k === "shoo").map((e) => e.text));
g.check("the route is never caught", !failed && end.caught === 0 && catches.length === 0, { caught: end.caught, catches });
const tally = await page.evaluate(() => window.__ss.ch2Tally());
g.check("the tally card shows the +250 bonus earned (Never caught!)", tally.includes(readLines()["22.1"]), tally);
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("ch2-playthrough");
