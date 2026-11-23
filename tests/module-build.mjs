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
import { readFileSync } from "node:fs";
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
g.check("no beats are rebuilt yet", !!bridge && bridge.ids.length === 0 && bridge.unknown === null, bridge);
g.check("a beat registers once by id; registering it twice throws", !!bridge && bridge.registered === "test" && bridge.twice === "throws", bridge);
g.check("the older program still starts (Chapter 1 state is there)", await page.evaluate(() => !!(window.__ss && window.__ss.op)));
g.check("no page errors", errors.length === 0, errors);
await g.finish("module-build");
