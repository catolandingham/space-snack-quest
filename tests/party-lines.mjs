/**
 * The party night: its words live in one lines file the game reads (src/modules/party-lines.js) and in one sheet for
 * Brian (docs/PARTY-LINES-FOR-BRIAN.md). They must say the same thing, line for line:
 * - same count, same order, same words, speaker, half, status and source,
 * - every approved line names where the yes came from,
 * - the sheet's list of lines that need Brian's yes is right,
 * - the party code (every module that reads party-lines.js) types no words of its own, uses every line of the halves
 *   built so far, and asks only for lines that exist.
 *   node tests/party-lines.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
// The halves built so far: their lines must all be used by the party code.
const BUILT_HALVES = [1];
const fails = [];
const check = (label, ok, detail) => {
  console.log(`${ok ? "PASS" : "FAIL"} ${label}${ok || detail === undefined ? "" : " " + JSON.stringify(detail).slice(0, 600)}`);
  ok || fails.push(label);
};

const { PARTY_LINES, partyLine, lockupCause } = await import(pathToFileURL(join(root, "src", "modules", "party-lines.js")).href);
const sheet = readFileSync(join(root, "docs", "PARTY-LINES-FOR-BRIAN.md"), "utf8");
const rows = sheet
  .split("\n")
  .map((l) => l.match(/^\| (\d+) \| ([^|]*) \| ([^|]*) \| ([^|]*) \| ([^|]*) \| ([^|]*) \| ([^|]*) \|$/))
  .filter(Boolean)
  .map((m) => ({ n: +m[1], where: m[2].trim(), text: m[3].trim(), who: m[4].trim(), half: m[5].trim(), status: m[6].trim(), source: m[7].trim() }));

check("the sheet has one numbered row per line in the lines file", rows.length === PARTY_LINES.length, { sheet: rows.length, file: PARTY_LINES.length });
check("rows are numbered 1, 2, 3, ... in order", rows.every((r, i) => r.n === i + 1));
check("line ids are unique", new Set(PARTY_LINES.map((l) => l.id)).size === PARTY_LINES.length);
const differ = [];
PARTY_LINES.forEach((l, i) => {
  const r = rows[i];
  const status = l.status === "approved" ? "approved" : "needs your yes";
  const half = l.half === 1 ? "one" : "two";
  if (!r || r.text !== l.text || r.who !== l.who || r.half !== half || r.status !== status || r.source !== l.source)
    differ.push({ n: i + 1, id: l.id, file: [l.text, l.who, half, status, l.source], sheet: r && [r.text, r.who, r.half, r.status, r.source] });
});
check("every line says the same words, speaker, half, status and source in both", differ.length === 0, differ);
check("every row says where it appears", rows.every((r) => r.where.length > 5), rows.filter((r) => r.where.length <= 5));
check("every approved line names where the yes came from", PARTY_LINES.filter((l) => l.status === "approved").every((l) => l.source.length > 5));
check("status is approved or needs-yes", PARTY_LINES.every((l) => l.status === "approved" || l.status === "needs-yes"));
check("every line is in half one or half two", PARTY_LINES.every((l) => l.half === 1 || l.half === 2));
const need = PARTY_LINES.map((l, i) => (l.status === "needs-yes" ? i + 1 : 0)).filter(Boolean);
const said = (sheet.match(/Lines that need your yes: ([0-9, ]+) \(/) || [])[1];
const saidNone = /Lines that need your yes: none left/.test(sheet);
check(
  "the sheet's list of lines that need Brian's yes is right",
  need.length === 0 ? saidNone : !!said && said.split(",").map((s) => +s.trim()).join(",") === need.join(","),
  { said, saidNone, need },
);
let threw = false;
try {
  partyLine("no-such-line");
} catch {
  threw = true;
}
check("asking for a line that does not exist stops with an error", threw);
check("the lockup card fills its pattern", lockupCause("who-tourist", "where-hall") === "A tourist saw Squatch in the hall. Security caught him.", lockupCause("who-tourist", "where-hall"));

// The party code: every module (other than the lines file) that imports party-lines.js.
const dir = join(root, "src", "modules");
const party = readdirSync(dir)
  .filter((f) => f.endsWith(".js") && f !== "party-lines.js")
  .map((f) => ({ f, src: readFileSync(join(dir, f), "utf8") }))
  .filter((m) => /from "\.\/party-lines\.js"/.test(m.src));
check("the party code reads the lines file", party.length > 0);
const code = party.map((m) => m.src).join("\n").replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
const ids = [...code.matchAll(/(?:partyLine|line|say|think|chip)\("([a-z0-9-]+)"/g)].map((m) => m[1]).filter((id) => PARTY_LINES.some((l) => l.id === id));
const asked = [...code.matchAll(/partyLine\("([a-z0-9-]+)"\)/g)].map((m) => m[1]);
const used = new Set([...ids, ...[...code.matchAll(/"((?:who|where)-[a-z]+)"/g)].map((m) => m[1])]);
const unused = PARTY_LINES.filter((l) => BUILT_HALVES.includes(l.half) && !used.has(l.id)).map((l) => l.id);
check("the party code uses every line of the halves built so far", unused.length === 0, unused);
check("the party code asks only for lines that exist", asked.every((id) => PARTY_LINES.some((l) => l.id === id)), asked.filter((id) => !PARTY_LINES.some((l) => l.id === id)));
const typed = PARTY_LINES.filter((l) => l.text.length > 3 && (code.includes(JSON.stringify(l.text)) || code.includes(`"${l.text}"`) || code.includes(`'${l.text}'`)));
check("the party code never types a line's words itself", typed.length === 0, typed.map((l) => l.id));

if (fails.length) {
  console.error("Failed:", fails.join(", "));
  process.exit(1);
}
console.log("party-lines checks passed");
