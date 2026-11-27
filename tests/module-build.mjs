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
g.check("the rebuilt beats are the morning, the party night, the TV story, the bedtime story, the home morning, the lunch sneak, the loading bay, the evening, the escape and pickup day", !!bridge && JSON.stringify(bridge.ids) === JSON.stringify(["ch1-morning", "ch1-party", "ch1-tv-story", "ch1-bedtime-story", "ch1-home-morning", "ch1-lunch", "ch1-bay", "ch1-evening", "ch1-escape", "ch1-pickup"]) && bridge.unknown === null, bridge);
g.check("a beat registers once by id; registering it twice throws", !!bridge && bridge.registered === "test" && bridge.twice === "throws", bridge);
g.check("the older program still starts (Chapter 1 state is there)", await page.evaluate(() => !!(window.__ss && window.__ss.op)));
g.check("the older program handed the engine over to the bridge", await page.evaluate(() => !!window.SSQ.engine()));

// (c) The morning (the first rebuilt beat) writes only the game-state fields bridge.js names, and its old
// code is gone from src/game/ while the calendar it shares with Day 2 stays.
const { BEAT_WRITES } = await import(new URL("../src/modules/bridge.js", import.meta.url).href).catch(() => ({}));
// The morning, its home-alone part (home-alone.js) and its mopping loop (mop-loop.js), which write through the
// same engine.
const morningSrc = ["morning.js", "home-alone.js", "mop-loop.js"].map((f) => readFileSync(join(root, "src", "modules", f), "utf8")).join("\n");
const sets = [...morningSrc.matchAll(/\.set\("([A-Za-z0-9]+)"/g)].map((m) => m[1]);
g.check("bridge.js names the fields a beat may write", Array.isArray(BEAT_WRITES) && BEAT_WRITES.length > 0, BEAT_WRITES);
g.check("the morning writes only named fields", Array.isArray(BEAT_WRITES) && sets.length > 0 && sets.every((k) => BEAT_WRITES.includes(k)), sets.filter((k) => !(BEAT_WRITES || []).includes(k)));
g.check("the morning never reaches into the game state another way", !/__ss|\.op\b|window\.n\b/.test(morningSrc));
// The party night (party.js and its parts) writes through the same engine, only named fields.
const partySrc = readdirSync(join(root, "src", "modules"))
  .filter((f) => /^party/.test(f) || f === "dress-up.js")
  .map((f) => readFileSync(join(root, "src", "modules", f), "utf8"))
  .join("\n");
const partySets = [...partySrc.matchAll(/\.set\("([A-Za-z0-9]+)"/g)].map((m) => m[1]);
g.check("the party night writes only named fields", partySets.length > 0 && partySets.every((k) => (BEAT_WRITES || []).includes(k)), partySets.filter((k) => !(BEAT_WRITES || []).includes(k)));
g.check("the party night never reaches into the game state another way", !/__ss|\.op\b|window\.n\b/.test(partySrc));
// The bedtime story (bedtime-story.js) writes through the same engine, only named fields.
const bedSrc = readdirSync(join(root, "src", "modules"))
  .filter((f) => /^bedtime-story/.test(f))
  .map((f) => readFileSync(join(root, "src", "modules", f), "utf8"))
  .join("\n");
const bedSets = [...bedSrc.matchAll(/\.set\("([A-Za-z0-9]+)"/g)].map((m) => m[1]);
g.check("the bedtime story writes only named fields", bedSets.length > 0 && bedSets.every((k) => (BEAT_WRITES || []).includes(k)), bedSets.filter((k) => !(BEAT_WRITES || []).includes(k)));
g.check("the bedtime story never reaches into the game state another way", !/__ss|\.op\b|window\.n\b/.test(bedSrc));
// The home morning (home-morning.js, Day 2's beats 22 to 24) writes through the same engine, only named fields.
const hmSrc = readdirSync(join(root, "src", "modules"))
  .filter((f) => /^home-morning/.test(f))
  .map((f) => readFileSync(join(root, "src", "modules", f), "utf8"))
  .join("\n");
const hmSets = [...hmSrc.matchAll(/\.set\("([A-Za-z0-9]+)"/g)].map((m) => m[1]);
g.check("the home morning writes only named fields", hmSets.length > 0 && hmSets.every((k) => (BEAT_WRITES || []).includes(k)), hmSets.filter((k) => !(BEAT_WRITES || []).includes(k)));
g.check("the home morning never reaches into the game state another way", !/__ss|\.op\b|window\.n\b/.test(hmSrc));
// The lunch sneak (lunch-sneak.js, Day 2's beats 25 to 27) writes through the same engine, only named fields.
const luSrc = readdirSync(join(root, "src", "modules"))
  .filter((f) => /^lunch-sneak/.test(f))
  .map((f) => readFileSync(join(root, "src", "modules", f), "utf8"))
  .join("\n");
const luSets = [...luSrc.matchAll(/\.set\("([A-Za-z0-9]+)"/g)].map((m) => m[1]);
g.check("the lunch sneak writes only named fields", luSets.length > 0 && luSets.every((k) => (BEAT_WRITES || []).includes(k)), luSets.filter((k) => !(BEAT_WRITES || []).includes(k)));
g.check("the lunch sneak never reaches into the game state another way", !/__ss|\.op\b|window\.n\b/.test(luSrc));
// The evening (evening.js, Day 2's beats 37 to 42) too.
const evSrc = readdirSync(join(root, "src", "modules"))
  .filter((f) => /^evening/.test(f))
  .map((f) => readFileSync(join(root, "src", "modules", f), "utf8"))
  .join("\n");
const evSets = [...evSrc.matchAll(/\.set\("([A-Za-z0-9]+)"/g)].map((m) => m[1]);
g.check("the evening writes only named fields", evSets.length > 0 && evSets.every((k) => (BEAT_WRITES || []).includes(k)), evSets.filter((k) => !(BEAT_WRITES || []).includes(k)));
g.check("the evening never reaches into the game state another way", !/__ss|\.op\b|window\.n\b/.test(evSrc));
// The escape (escape.js, beats 43 to 52) writes through the same engine, only named fields.
const esSrc = readdirSync(join(root, "src", "modules"))
  .filter((f) => /^escape/.test(f))
  .map((f) => readFileSync(join(root, "src", "modules", f), "utf8"))
  .join("\n");
const esSets = [...esSrc.matchAll(/\.set\("([A-Za-z0-9]+)"/g)].map((m) => m[1]);
g.check("the escape writes only named fields", esSets.length > 0 && esSets.every((k) => (BEAT_WRITES || []).includes(k)), esSets.filter((k) => !(BEAT_WRITES || []).includes(k)));
g.check("the escape never reaches into the game state another way", !/__ss|\.op\b|window\.n\b/.test(esSrc));
const writes = await page.evaluate(() => window.SSQ.beatWrites());
g.check("in the browser the morning wrote only named fields", Array.isArray(writes) && writes.every((k) => (BEAT_WRITES || []).includes(k)), writes);
const game = readdirSync(join(root, "src", "game"))
  .filter((f) => f.endsWith(".js"))
  .map((f) => readFileSync(join(root, "src", "game", f), "utf8"))
  .join("\n");
// ch1CalendarBitten and the bite on touch went with home alone: the calendar is always bitten (Brian, G 556).
const gone = ["CH1_MOPS_MORNING", "CH1_SONG_MOPS", "CH1_SONG_SQ", "ch1Day1(", "ch1MopsHumTick", "ch1SingAlong", "ch1MopsLeaveTick", "ch1SongSpots", "ch1Song", "ch1MopsLeave", "songTap", "ss-song", "ch1CalendarBitten", "biteAt"];
g.check("the old morning code is gone from src/game/", gone.every((name) => !game.includes(name)), gone.filter((name) => game.includes(name)));
const kept = ["function ch1CalendarAvailable", "function ch1CalendarSpots", "function ch1OpenCalendar", "function ch1CloseCalendar", "function ch1CalendarTap", "let ch1CalendarPaper", "function drawCh1Calendar", "function ch1CalHit", "function co("];
g.check("the calendar and the made-up tune (used elsewhere) stay", kept.every((name) => game.includes(name)), kept.filter((name) => !game.includes(name)));
// The old party peek, sneak and dress-up (party plan P1 to P5) are gone from src/game/: party.js replaced them.
const partyGone = ["function ch1PeekSpots", "function ch1PeekGo", "function ch1PeekLook", "CH1_PEEK_AT", "function ch1SneakStart", "function ch1SneakTick", "function ch1SneakHide", "ch1PlantSneak", "function ch1DressOpen", "function drawCh1Dress", "CH1_DRESS_ITEMS", "function ch1PartyPeek", "drawCh1SliceParty", "ch1Veil"];
g.check("the old party peek, sneak and dress-up code is gone from src/game/", partyGone.every((name) => !game.includes(name)), partyGone.filter((name) => game.includes(name)));
// The old party free play, alarm, home search and homecoming (party plan P6 to P8) are gone from src/game/ too:
// party-free.js, party-toys.js, party-snacks.js, party-dance.js and party-endings.js replaced them.
const freeGone = ["ch1FreePlayStart", "ch1PartySpots", "ch1Raid", "ch1Cut", "COOL_HAT_SECONDS", "CH1_PARTY_CAST", "CH1_GUESTS", "PHOTO_BONUS", "ch1Homecoming", "ch1Search", "n.guard", "ch1PartyCones", "ch1Cones", "askOnly", '"ch1photo"', '"ch1fur"', "ch1Disguise", "ch1HatOff", "ch1PartyTimeUp", "ch1Photo", "ch1Oct", "BALLOON_GRAB", "ch1PartyOver", "ch1PartyDid", "ch1Kara", '"SNAG"', '"SUCK"', '"STAND"'];
g.check("the old party free play, raid, home search and homecoming code is gone from src/game/", freeGone.every((name) => !game.includes(name)), freeGone.filter((name) => game.includes(name)));
const exported = await page.evaluate(() => ["COOL_HAT_SECONDS", "CH1_PARTY_CAST", "CH1_GUESTS", "PHOTO_BONUS", "BALLOON_GRAB_SECONDS", "ch1FreePlayStart"].filter((k) => k in window.__ss));
g.check("the old party's numbers and hooks are gone from window.__ss", exported.length === 0, exported);
g.check("no page errors", errors.length === 0, errors);
await g.finish("module-build");
