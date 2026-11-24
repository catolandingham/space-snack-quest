/**
 * The morning's words live in one lines file the game reads (src/modules/morning-lines.js) and in one sheet
 * for Brian (docs/MORNING-LINES-FOR-BRIAN.md). They must say the same thing, line for line:
 * - same count, same order, same words, same speaker, same status,
 * - every approved line names where the yes came from,
 * - the sheet's count of lines that need Brian's yes is right,
 * - the morning beat (src/modules/morning.js) types no words of its own: every quoted string it shows
 *   comes from the lines file (it calls line("id")),
 * - a line Brian took out stays on the sheet as "removed" (so the numbers do not shift) and the game never
 *   shows it: the small "tap ▸" note (row 18) is gone, only the NEXT button is left (Brian 18a, 2026-11-23).
 *   node tests/morning-lines.mjs
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

const { MORNING_LINES, line } = await import(pathToFileURL(join(root, "src", "modules", "morning-lines.js")).href);
const sheet = readFileSync(join(root, "docs", "MORNING-LINES-FOR-BRIAN.md"), "utf8");
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
  const status = l.status === "approved" ? "approved" : l.status === "removed" ? "removed" : "needs your yes";
  if (!r || r.text !== l.text || r.who !== l.who || r.status !== status || r.source !== l.source) differ.push({ n: i + 1, id: l.id, file: [l.text, l.who, status, l.source], sheet: r && [r.text, r.who, r.status, r.source] });
});
check("every line says the same words, speaker, status and source in both", differ.length === 0, differ);
check("every row says where it appears", rows.every((r) => r.where.length > 5), rows.filter((r) => r.where.length <= 5));
check(
  "every approved line names where the yes came from",
  MORNING_LINES.filter((l) => l.status === "approved").every((l) => l.source.length > 5),
  MORNING_LINES.filter((l) => l.status === "approved" && l.source.length <= 5),
);
check("status is approved, needs-yes or removed", MORNING_LINES.every((l) => ["approved", "needs-yes", "removed"].includes(l.status)));
check('Brian 18a: the "tap ▸" note is marked removed', !!MORNING_LINES.find((l) => l.id === "cue-tap" && l.status === "removed" && /18a/.test(l.source)), MORNING_LINES.find((l) => l.id === "cue-tap"));
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

// The beat types no words: every string literal it draws or says comes from line("id").
const beat = readFileSync(join(root, "src", "modules", "morning.js"), "utf8").replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
const ids = [...beat.matchAll(/line\("([a-z-]+)"\)/g)].map((m) => m[1]);
const live = MORNING_LINES.filter((l) => l.status !== "removed");
check("the beat uses every line in the lines file that is not removed", live.every((l) => ids.includes(l.id)), live.filter((l) => !ids.includes(l.id)).map((l) => l.id));
check("the beat never asks for a removed line", ids.every((id) => !MORNING_LINES.some((l) => l.id === id && l.status === "removed")), ids.filter((id) => MORNING_LINES.some((l) => l.id === id && l.status === "removed")));
check("the beat asks only for lines that exist", ids.every((id) => MORNING_LINES.some((l) => l.id === id)), ids.filter((id) => !MORNING_LINES.some((l) => l.id === id)));
const typed = MORNING_LINES.filter((l) => beat.includes(JSON.stringify(l.text)) || beat.includes(`"${l.text}"`));
check("the beat never types a line's words itself", typed.length === 0, typed.map((l) => l.id));

if (fails.length) {
  console.error("Failed:", fails.join(", "));
  process.exit(1);
}
console.log("morning-lines checks passed");
