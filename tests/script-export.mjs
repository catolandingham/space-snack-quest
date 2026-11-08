/**
 * The as-built script export runs, and the page it writes has all four chapters.
 *   node tests/script-export.mjs
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const docPath = join(root, "docs", "SCRIPT-AS-BUILT.md");

function fail(msg) {
  console.error("FAIL", msg);
  process.exit(1);
}

const run = spawnSync(process.execPath, ["tools/export-script.mjs"], { cwd: root, encoding: "utf8" });
if (run.status !== 0) fail(run.stderr || run.stdout || "export-script exited " + run.status);

const md = readFileSync(docPath, "utf8");
const again = spawnSync(process.execPath, ["tools/export-script.mjs"], { cwd: root, encoding: "utf8" });
if (again.status !== 0) fail("second run failed");
if (readFileSync(docPath, "utf8") !== md) fail("export is not stable");

for (const ch of [1, 2, 3, 4]) {
  const heading = `## Chapter ${ch}`;
  if (!md.includes(heading)) fail("missing " + heading);
  const start = md.indexOf(heading);
  const next = md.indexOf("\n## ", start + heading.length);
  const section = md.slice(start, next === -1 ? undefined : next);
  if (!section.includes("| bubble |")) fail("chapter " + ch + " has no speech bubble");
  if (!section.includes("| chip |")) fail("chapter " + ch + " has no goal chip");
  if (!section.includes("| prompt |")) fail("chapter " + ch + " has no VERB · thing prompt");
}

const must = [
  "This is Squatch. He's a Sasquatch.",
  "ROBOT JANITORS",
  "Squatch: wash the dishes at the sink",
  "WOOKIE SPOTTED IN SPACE!",
  "LOCKUP",
  "They lost you.",
  "TANK EMPTY",
  "Chapter 3 · Phobos",
  "You are MOPS now.",
  "FUR IN THE VENT!",
  "Never caught! +250",
];
for (const line of must) if (!md.includes(line)) fail("missing line: " + line);

const counts = [...md.matchAll(/\| Chapter (\d) \| (\d+) \|/g)].map((m) => `Chapter ${m[1]}: ${m[2]}`);
if (counts.length !== 4) fail("line-count table is missing a chapter");
console.log("script export covers four chapters");
console.log(counts.join(", "));
