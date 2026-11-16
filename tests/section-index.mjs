/**
 * The section index at the top of a long doc matches the headings in the file.
 *   node tests/section-index.mjs
 */
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { headingsOf, parseIndex, sectionRows } from "../scripts/md-section.mjs";

const files = [
  "docs/DECISIONS.md",
  "docs/CH1-LINES-FOR-BRIAN.md",
  "docs/MASTER-BACKLOG.md",
  "docs/STATE.md",
  "docs/CH1-STORY-WALKTHROUGH.md",
];

let failed = 0;
function check(name, ok, detail) {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}`);
  if (!ok) {
    failed++;
    console.log(JSON.stringify(detail));
  }
}

for (const file of files) {
  const text = readFileSync(file, "utf8");
  const indexed = parseIndex(text);
  const expected = sectionRows(text);
  check(
    file + " index matches its headings",
    indexed.length === expected.length && indexed.every((row, i) => row.start === expected[i].start && row.end === expected[i].end && row.title === expected[i].title && row.marks === expected[i].marks),
    { indexed: indexed.length, expected: expected.length, first: indexed[0], want: expected[0] },
  );
  const heads = headingsOf(text).filter((h) => h.title !== "Section index");
  check(file + " lists every heading", heads.length === indexed.length, { heads: heads.length, indexed: indexed.length });
}

const listed = spawnSync(process.execPath, ["scripts/md-section.mjs", "list", "docs/STATE.md"], { encoding: "utf8" });
check("list prints the STATE index", listed.status === 0 && listed.stdout.includes("The game"), listed.stderr || listed.stdout.slice(0, 200));
const pulled = spawnSync(process.execPath, ["scripts/md-section.mjs", "extract", "docs/STATE.md", "The game"], { encoding: "utf8" });
check(
  "extract returns one STATE section",
  pulled.status === 0 && pulled.stdout.startsWith("## The game") && !pulled.stdout.includes("## Chapter 1 cartoon"),
  pulled.stdout.slice(0, 180),
);

if (failed) {
  console.error(failed + " section-index checks failed");
  process.exit(1);
}
console.log("section-index checks passed");
