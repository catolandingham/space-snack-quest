/**
 * src/game/ may only shrink (Brian 2026-11-25, "1": new logic goes in src/modules/; CLAUDE.md "Code").
 * Fails if src/game/ as it is on disk now has more lines than at the point this branch left main (the merge base
 * with origin/main), or has a file main does not have. Shrinking is fine. On main itself the base is main, so a
 * push to main compares main with itself.
 *   node tests/game-no-growth.mjs
 * Needs git history. The GitHub check checks out only the newest commit, so when origin/main or the merge base is
 * missing the test fetches what it needs itself (main, then the rest of the history).
 */
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const git = (...a) => execFileSync("git", a, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
let fails = 0;
const check = (name, ok, info) => (console.log(`${ok ? "ok  " : "FAIL"}  ${name}${ok || info == null ? "" : "\n      " + JSON.stringify(info)}`), ok || fails++);

let base = "";
try {
  git("rev-parse", "--verify", "origin/main");
} catch {
  try {
    git("fetch", "--no-tags", "origin", "main:refs/remotes/origin/main");
  } catch {}
}
const mergeBase = () => {
  try {
    return git("merge-base", "HEAD", "origin/main");
  } catch {
    return "";
  }
};
base = mergeBase();
// a shallow checkout (the GitHub check): fetch the whole history, then try again
if (!base) {
  try {
    git("fetch", "--no-tags", "--unshallow", "origin");
  } catch {
    try {
      git("fetch", "--no-tags", "--deepen=1000", "origin");
    } catch {}
  }
  try {
    git("fetch", "--no-tags", "origin", "main:refs/remotes/origin/main");
  } catch {}
  base = mergeBase();
}
if (!check("found where this branch left main (git merge-base HEAD origin/main)", !!base)) process.exit(1);

const lines = (text) => (text.endsWith("\n") ? text.slice(0, -1) : text).split("\n").length;
const dir = join(root, "src", "game");
const now = {},
  then = {};
for (const f of readdirSync(dir).filter((f) => f.endsWith(".js"))) now[f] = lines(readFileSync(join(dir, f), "utf8"));
for (const path of git("ls-tree", "--name-only", base, "src/game/").split("\n").filter((f) => f.endsWith(".js"))) {
  then[path.slice("src/game/".length)] = lines(git("show", `${base}:${path}`));
}
const added = Object.keys(now).filter((f) => !(f in then));
check("src/game/ has no new files", added.length === 0, added);
const sum = (o) => Object.values(o).reduce((a, b) => a + b, 0);
check(`src/game/ has no more lines than main (${sum(now)} now, ${sum(then)} at ${base.slice(0, 7)})`, sum(now) <= sum(then), Object.fromEntries(Object.keys(now).filter((f) => now[f] > (then[f] || 0)).map((f) => [f, { now: now[f], main: then[f] || 0 }])));
console.log(fails ? `${fails} check(s) failed.` : "All checks passed.");
process.exit(fails ? 1 : 0);
