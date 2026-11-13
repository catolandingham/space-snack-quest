/**
 * Balance numbers stay put, and the hooks refuse main, locked rooms, and watermarked media.
 *   node tests/rules-guard.mjs
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { startGame } from "./game-page.mjs";

const g = await startGame({ port: 8867, name: "rules-guard" });
const redesign = readFileSync("src/game/12-ch1-redesign.js", "utf8");
const ch2 = readFileSync("src/game/20-ch2.js", "utf8");
const grab = (src, name) => {
  const m = src.match(new RegExp(name + " = ([0-9.]+)"));
  return m ? Number(m[1]) : null;
};
g.check("ball notice radius stays 70", grab(redesign, "BALL_NOTICE_RADIUS") === 70);
g.check("ball notice time stays 2 seconds", grab(redesign, "BALL_NOTICE_SECONDS") === 2);
g.check("a photo that includes him stays 25 points", grab(redesign, "PHOTO_BONUS") === 25);
g.check("the party clock stays 180 seconds", grab(redesign, "COOL_HAT_SECONDS") === 180);
g.check("the balloon still takes 6 seconds", grab(redesign, "BALLOON_GRAB_SECONDS") === 6);
g.check("soup still costs 30", ch2.includes('cap: "soup 30"') && ch2.includes("ch2.reg += 30"));
g.check("the tip jar is still 30", ch2.includes("ch2.jar = 30"));

function hook(event) {
  const run = spawnSync("node", [".cursor/hooks/guard.mjs"], { input: JSON.stringify(event), encoding: "utf8" });
  return JSON.parse(run.stdout || "{}");
}
g.check("a push to main is blocked", hook({ command: "git push origin main" }).permission === "deny");
g.check("merging a pull request is blocked", hook({ command: "gh pr merge 33" }).permission === "deny");
g.check(
  "an edit under docs/locked-rooms is blocked",
  hook({ command: "", tool_input: { path: "docs/locked-rooms/hall-room-empty-v1.png" } }).permission === "deny",
);
g.check("a normal test command is allowed", hook({ command: "npm test" }).permission === "allow");
await g.finish("rules-guard");
