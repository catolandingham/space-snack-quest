/**
 * Runs every test suite in tests/, one at a time, and prints one PASS or FAIL line per suite.
 * Exits non-zero if any suite failed.
 *   npm test
 */
import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
// Helper modules and this runner are not suites.
const notSuites = new Set(["run-all.mjs", "chrome-path.mjs", "game-page.mjs", "route-player.mjs", "chapter-states.mjs"]);
const suites = readdirSync(here)
  .filter((f) => f.endsWith(".mjs") && !notSuites.has(f))
  .sort();

const results = [];
for (const suite of suites) {
  console.log(`\n=== ${suite} ===`);
  const started = Date.now();
  const run = spawnSync(process.execPath, [join(here, suite)], { stdio: "inherit", cwd: join(here, "..") });
  const secs = ((Date.now() - started) / 1000).toFixed(1);
  results.push({ suite, ok: run.status === 0, secs, status: run.status, signal: run.signal });
}

console.log("\n=== Summary ===");
for (const r of results) {
  const why = r.ok ? "" : ` (exit ${r.status ?? r.signal})`;
  console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.suite}  ${r.secs}s${why}`);
}
const failed = results.filter((r) => !r.ok).length;
console.log(failed ? `${failed} of ${results.length} suites failed.` : `All ${results.length} suites passed.`);
process.exit(failed ? 1 : 0);
