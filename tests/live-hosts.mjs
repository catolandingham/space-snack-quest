/**
 * The game is played at two addresses (Brian, 2026-11-23: squatch.onrender.com points at this game too).
 * Both must count as the live site, so test links (?beat=42, ?beat=day2) do nothing there and saves use the
 * live keys. No browser: reads the source.
 *   node tests/live-hosts.mjs
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { root } from "./game-page.mjs";

const core = readFileSync(join(root, "src/game/00-core.js"), "utf8");
const shell = readFileSync(join(root, "src/game/90-input-shell.js"), "utf8");
const list = (core.match(/const LIVE_HOSTS = \[([^\]]*)\]/) || [])[1] || "";
const fails = [];
const check = (name, ok, detail) => (console.log(`${ok ? "PASS" : "FAIL"} ${name}${ok ? "" : " " + JSON.stringify(detail)}`), ok || fails.push(name));
check("space-snack-quest.onrender.com is a live address", list.includes('"space-snack-quest.onrender.com"'), list);
check("squatch.onrender.com is a live address", list.includes('"squatch.onrender.com"'), list);
check("saves use the live list", /LIVE_HOSTS\.includes\(host\)/.test(core.slice(core.indexOf("function ssqKey"), core.indexOf("function ssqKey") + 400)), "ssqKey");
check("test links use the live list", /live = LIVE_HOSTS\.includes\(host\)/.test(shell), "90-input-shell.js");
check("no other place names a live address by itself", !/=== "space-snack-quest\.onrender\.com"/.test(core + shell), "a hard-coded host check");
if (fails.length) (console.log("Failed: " + fails.join(", ")), process.exit(1));
console.log("live-hosts checks passed");
