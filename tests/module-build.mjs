/**
 * New code can live in real modules (src/modules/) without changing the older program.
 * (a) index.html holds the bundled modules (strict) in their own <script>, then, in its own <script>, the
 *     older program exactly as tools/build.mjs compacts it from the current src/game/. This proves where
 *     each part goes, not that src/game/ is unchanged from an earlier version: for that, compare builds
 *     with tools/compare-builds.mjs.
 * (b) In the browser, window.SSQ is the bridge: frozen, not replaceable, version 1, beats register once
 *     by id, and the game still starts with no page errors.
 *   node tests/module-build.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { startGame, root } from "./game-page.mjs";
import { buildModules, buildProgram } from "../tools/build.mjs";

const g = await startGame({ port: 8961, name: "module-build" });

// (a) The built page.
const html = readFileSync(join(root, "index.html"), "utf8");
const modules = await buildModules();
const program = await buildProgram();
const modTag = `<script>${modules}</script>`;
const progTag = `<script>${program}</script>`;
g.check("index.html holds the program built from src/game/, unaltered, in its own script", html.includes(progTag));
g.check("index.html holds the bundled modules in their own script", html.includes(modTag));
g.check("the modules run before the older program", html.indexOf(modTag) >= 0 && html.indexOf(modTag) < html.indexOf(progTag));
g.check("the module script runs in strict mode", modules.startsWith('"use strict";'));

// (b) In the browser.
const { page, errors } = await g.open("?ch=1");
const bridge = await page.evaluate(() => {
  const s = window.SSQ;
  if (!s) return null;
  const d = Object.getOwnPropertyDescriptor(window, "SSQ");
  const out = { version: s.version, frozen: Object.isFrozen(s), locked: !d.writable && !d.configurable, ids: s.beatIds(), unknown: s.beat("no-such-beat") };
  s.registerBeat("test-beat", { name: "test" });
  out.registered = s.beat("test-beat") && s.beat("test-beat").name;
  try {
    s.registerBeat("test-beat", { name: "again" });
    out.twice = "allowed";
  } catch {
    out.twice = "throws";
  }
  return out;
});
g.check("window.SSQ is the bridge: frozen, not replaceable, version 1", !!bridge && bridge.version === 1 && bridge.frozen && bridge.locked, bridge);
g.check("the morning is the one rebuilt beat", !!bridge && JSON.stringify(bridge.ids) === JSON.stringify(["ch1-morning"]) && bridge.unknown === null, bridge);
g.check("a beat registers once by id; registering it twice throws", !!bridge && bridge.registered === "test" && bridge.twice === "throws", bridge);
g.check("the older program still starts (Chapter 1 state is there)", await page.evaluate(() => !!(window.__ss && window.__ss.op)));
g.check("the older program handed the engine over to the bridge", await page.evaluate(() => !!window.SSQ.engine()));

// (c) The morning (the first rebuilt beat) writes only the game-state fields bridge.js names, and its old
// code is gone from src/game/ while the calendar it shares with Day 2 stays.
const { BEAT_WRITES } = await import(new URL("../src/modules/bridge.js", import.meta.url).href).catch(() => ({}));
const morningSrc = readFileSync(join(root, "src", "modules", "morning.js"), "utf8");
const sets = [...morningSrc.matchAll(/\.set\("([A-Za-z0-9]+)"/g)].map((m) => m[1]);
g.check("bridge.js names the fields a beat may write", Array.isArray(BEAT_WRITES) && BEAT_WRITES.length > 0, BEAT_WRITES);
g.check("the morning writes only named fields", Array.isArray(BEAT_WRITES) && sets.length > 0 && sets.every((k) => BEAT_WRITES.includes(k)), sets.filter((k) => !(BEAT_WRITES || []).includes(k)));
g.check("the morning never reaches into the game state another way", !/__ss|\.op\b|window\.n\b/.test(morningSrc));
const writes = await page.evaluate(() => window.SSQ.beatWrites());
g.check("in the browser the morning wrote only named fields", Array.isArray(writes) && writes.every((k) => (BEAT_WRITES || []).includes(k)), writes);
const game = readdirSync(join(root, "src", "game"))
  .filter((f) => f.endsWith(".js"))
  .map((f) => readFileSync(join(root, "src", "game", f), "utf8"))
  .join("\n");
const gone = ["CH1_MOPS_MORNING", "CH1_SONG_MOPS", "CH1_SONG_SQ", "ch1Day1(", "ch1MopsHumTick", "ch1SingAlong", "ch1MopsLeaveTick", "ch1SongSpots", "ch1Song", "ch1MopsLeave", "songTap", "ss-song"];
g.check("the old morning code is gone from src/game/", gone.every((name) => !game.includes(name)), gone.filter((name) => game.includes(name)));
const kept = ["function ch1CalendarAvailable", "function ch1CalendarSpots", "function ch1OpenCalendar", "function ch1CloseCalendar", "function ch1CalendarTap", "let ch1CalendarPaper", "function drawCh1Calendar", "function ch1CalHit", "function ch1PeekSpots", "function ch1SneakStart", "function co("];
g.check("the calendar, the peek and the made-up tune (used elsewhere) stay", kept.every((name) => game.includes(name)), kept.filter((name) => !game.includes(name)));
g.check("no page errors", errors.length === 0, errors);
await g.finish("module-build");
