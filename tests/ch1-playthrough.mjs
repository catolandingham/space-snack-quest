/**
 * Plays Chapter 1 from ?ch=1 to the Chapter 1 tally card, the way a person does (Chapter 1 pass, item 4).
 *   node tests/ch1-playthrough.mjs          (ROUTE_LOG=1 prints one line per step)
 *
 * The steps are in tests/routes/ch1.json and are played by tests/route-player.mjs. Every move is a real
 * key press sent through Chrome (arrows, E, Enter), and the three face taps (S9, S10, S11) are real mouse
 * clicks on the face buttons, because the game has no key for switching. Nothing is written to the
 * game's state and nobody is moved by the test. The route crosses the lobby vent's pull twice without
 * stopping, and must end never caught.
 *
 * Then the story order is checked from the game's own log of what was shown:
 *   - "robot" is not spoken before the notice is read (D15), and "Wookie" not before the O7 flashback;
 *   - the heart lines come in the spine's order (O3 "...Everybody has somebody.", O6 "Everybody out
 *     there has somebody." then "You have me.");
 *   - what Squatch brings back is used: O6 and S3 talk about the notice, after it was read.
 */
import { startGame, readLines } from "./game-page.mjs";
import { readRoute, playRoute, keyboardInput, look } from "./route-player.mjs";

const L = readLines();
const route = readRoute("ch1.json");
const g = await startGame({ port: 8801, name: "ch1-playthrough" });
const { ctx, page, errors } = await g.open("?ch=1");
await page.waitForFunction(() => String(window.__ss.op.scene || "").startsWith("O"), { timeout: 15000 });

const t0 = Date.now();
const { failed } = await playRoute(page, keyboardInput(page), route.steps);
const end = await look(page);
const secs = ((Date.now() - t0) / 1000).toFixed(0);
g.check(
  `Chapter 1 plays from ?ch=1 to the tally card with keys and face clicks (${route.steps.length} steps, ${secs}s)`,
  !failed && end.cur === "panel:tally",
  failed ? `stuck at step ${failed.step} "${failed.say}": ${failed.why}. State: ${failed.state}` : end.line,
);
const log = await page.evaluate(() => window.__ss.op.log.map((e) => ({ k: e.k, text: String(e.text || "") })));
const catches = log.filter((e) => e.k === "caught" || e.k === "shoo").map((e) => e.text);
const caught = await page.evaluate(() => window.__ss.ch.caught + window.__ss.s1.caught);
g.check("the route is never caught", !failed && caught === 0 && catches.length === 0, { caught, catches });
const tally = await page.evaluate(() => window.__ss.chTally());
g.check("the tally card shows the +250 bonus earned (Never caught!)", tally.includes(L["22.1"]), tally);

// Story order, from the log (bubbles, ambient lines, panels and flashback frames, in the order shown).
const said = (e) => e.k === "bub" || e.k === "live";
const at = (pred) => log.findIndex(pred);
const line = (text) => at((e) => said(e) && e.text === text);
const notice = at((e) => e.k === "panel" && e.text === "notice");
const firstRobot = at((e) => said(e) && /robot/i.test(e.text));
const firstWookie = at((e) => said(e) && /wookie/i.test(e.text));
const flashback = at((e) => e.k === "fb" && /Wookie tour/.test(e.text));
g.check("the notice is read on the way (its panel shows)", notice >= 0, { notice });
g.check('nobody says "robot" before the notice is read', notice >= 0 && firstRobot > notice, log[firstRobot]);
g.check('nobody says "Wookie" before the O7 flashback explains it', flashback >= 0 && (firstWookie < 0 || firstWookie > flashback), { flashback, first: log[firstWookie] });
g.check("the first robot line is Squatch's whisper after the notice (row 25.8)", firstRobot >= 0 && log[firstRobot].text === L["25.8"], log[firstRobot]);
const order = ["25.1", "25.8", "25.14", "25.15", "25.16", "25.17", "25.18", "25.19"].map((r) => [r, line(L[r])]);
g.check("O3, the notice, O5, O6 and S3 lines all show, in that order", order.every(([, i], j) => i >= 0 && (j === 0 || i > order[j - 1][1])), order);
g.check("the clean night out gets the all-clear report in S3 (row 25.23)", line(L["25.23"]) > notice && line(L["25.24"]) < 0 && line(L["25.25"]) < 0, { clear: line(L["25.23"]) });
g.check("O3's heart line comes before the night out, the O6 ones after the notice", order[0][1] < notice && order[3][1] > notice);
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("ch1-playthrough");
