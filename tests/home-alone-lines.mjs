/**
 * Home alone (after Mops leaves): its words live in one lines file the game reads (src/modules/home-alone-lines.js) and in one sheet
 * for Brian (docs/HOME-ALONE-LINES-FOR-BRIAN.md). They must say the same thing, line for line:
 * - same count, same order, same words, same speaker, same status,
 * - every approved line names where the yes came from,
 * - the sheet's count of lines that need Brian's yes is right,
 * - the home-alone code (src/modules/home-alone.js, homework-cutaway.js) types no words of its own: every string it shows
 *   comes from the lines file (it calls homeLine("id")).
 *   node tests/home-alone-lines.mjs
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fails = [];
const check = (label, ok, detail) => {
  console.log(`${ok ? "PASS" : "FAIL"} ${label}${ok || detail === undefined ? "" : " " + JSON.stringify(detail)}`);
  ok || fails.push(label);
};

const { HOME_ALONE_LINES: MORNING_LINES, homeLine: line } = await import(pathToFileURL(join(root, "src", "modules", "home-alone-lines.js")).href);
const sheet = readFileSync(join(root, "docs", "HOME-ALONE-LINES-FOR-BRIAN.md"), "utf8");
const rows = sheet
  .split("\n")
  .map((l) => l.match(/^\| (\d+) \| ([^|]*) \| ([^|]*) \| ([^|]*) \| ([^|]*) \| ([^|]*) \|$/))
  .filter(Boolean)
  .map((m) => ({ n: +m[1], where: m[2].trim(), text: m[3].trim(), who: m[4].trim(), status: m[5].trim(), source: m[6].trim() }));

check("the sheet has one numbered row per line in the lines file", rows.length === MORNING_LINES.length, { sheet: rows.length, file: MORNING_LINES.length });
check("rows are numbered 1, 2, 3, ... in order", rows.every((r, i) => r.n === i + 1), rows.map((r) => r.n));
const differ = [];
MORNING_LINES.forEach((l, i) => {
  const r = rows[i];
  const status = l.status === "approved" ? "approved" : "needs your yes";
  if (!r || r.text !== l.text || r.who !== l.who || r.status !== status || r.source !== l.source) differ.push({ n: i + 1, id: l.id, file: [l.text, l.who, status, l.source], sheet: r && [r.text, r.who, r.status, r.source] });
});
check("every line says the same words, speaker, status and source in both", differ.length === 0, differ);
check("every row says where it appears", rows.every((r) => r.where.length > 5), rows.filter((r) => r.where.length <= 5));
check(
  "every approved line names where the yes came from",
  MORNING_LINES.filter((l) => l.status === "approved").every((l) => l.source.length > 5),
  MORNING_LINES.filter((l) => l.status === "approved" && l.source.length <= 5),
);
check("status is approved or needs-yes", MORNING_LINES.every((l) => l.status === "approved" || l.status === "needs-yes"));
const need = MORNING_LINES.map((l, i) => (l.status === "needs-yes" ? i + 1 : 0)).filter(Boolean);
const said = (sheet.match(/Lines that need your yes: ([0-9, ]+) \(/) || [])[1];
const saidNone = /Lines that need your yes: none left/.test(sheet);
check(
  "the sheet's list of lines that need Brian's yes is right",
  need.length === 0 ? saidNone : said && said.split(",").map((s) => +s.trim()).join(",") === need.join(","),
  { said, saidNone, need },
);
let threw = false;
try {
  line("no-such-line");
} catch {
  threw = true;
}
check("asking for a line that does not exist stops with an error", threw);

// The home-alone code types no words: every string literal it draws or says comes from homeLine("id").
const beat = ["home-alone.js", "homework-cutaway.js"]
  .map((f) => readFileSync(join(root, "src", "modules", f), "utf8"))
  .join("\n")
  .replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
const ids = [...beat.matchAll(/homeLine\("([a-z-]+)"\)/g)].map((m) => m[1]);
check("the home-alone code uses every line in the lines file", MORNING_LINES.every((l) => ids.includes(l.id)), MORNING_LINES.filter((l) => !ids.includes(l.id)).map((l) => l.id));
check("the home-alone code asks only for lines that exist", ids.every((id) => MORNING_LINES.some((l) => l.id === id)), ids.filter((id) => !MORNING_LINES.some((l) => l.id === id)));
const typed = MORNING_LINES.filter((l) => beat.includes(JSON.stringify(l.text)) || beat.includes(`"${l.text}"`));
check("the home-alone code never types a line's words itself", typed.length === 0, typed.map((l) => l.id));

if (fails.length) {
  console.error("Failed:", fails.join(", "));
  process.exit(1);
}
console.log("home-alone-lines checks passed");
