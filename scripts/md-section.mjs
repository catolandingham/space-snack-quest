/**
 * Headings for the long docs. Read the index, then one section.
 *   node scripts/md-section.mjs list docs/STATE.md
 *   node scripts/md-section.mjs extract docs/STATE.md "The game"
 *   node scripts/md-section.mjs stamp docs/STATE.md
 */
import { readFileSync, writeFileSync } from "node:fs";

const START = "<!-- section-index -->";
const END = "<!-- /section-index -->";

export function stripIndex(text) {
  const a = text.indexOf(START);
  const b = text.indexOf(END);
  if (a === -1 || b === -1 || b < a) return text;
  const after = text.slice(b + END.length).replace(/^\n/, "");
  return (text.slice(0, a) + after).replace(/^\n/, "");
}

export function headingsOf(text) {
  const lines = text.split("\n");
  const heads = [];
  lines.forEach((line, i) => {
    const m = /^(#{1,3}) (.+)$/.exec(line);
    if (m) heads.push({ line: i + 1, level: m[1].length, title: m[2].trim(), marks: m[1] });
  });
  return heads;
}

function indexOffset(count) {
  // comment, intro, blank, header, rule, one row each, end comment
  return 6 + count;
}

export function sectionRows(text) {
  const body = stripIndex(text);
  const heads = headingsOf(body);
  const offset = indexOffset(heads.length);
  const bodyLines = body.split("\n").length;
  return heads.map((h, i) => {
    const start = h.line + offset;
    const end = i + 1 < heads.length ? heads[i + 1].line + offset - 1 : bodyLines + offset;
    return { start, end, marks: h.marks, title: h.title };
  });
}

export function indexBlock(text) {
  const rows = sectionRows(text);
  const lines = [
    START,
    "**Section index.** Read this index, then only the section you need. Do not read this file whole.",
    "",
    "| Lines | Heading |",
    "| --- | --- |",
    ...rows.map((r) => `| ${r.start}–${r.end} | ${r.marks} ${r.title.replace(/\|/g, "\\|")} |`),
    END,
  ];
  return lines.join("\n");
}

export function stamp(text) {
  const body = stripIndex(text).replace(/^\n/, "");
  return indexBlock(body) + "\n" + body;
}

export function parseIndex(text) {
  const a = text.indexOf(START);
  const b = text.indexOf(END);
  if (a === -1 || b === -1) return [];
  const rows = [];
  for (const line of text.slice(a, b).split("\n")) {
    const m = /^\| (\d+)–(\d+) \| (#{1,3}) (.+) \|$/.exec(line);
    if (m) rows.push({ start: Number(m[1]), end: Number(m[2]), marks: m[3], title: m[4].replace(/\\\|/g, "|").trim() });
  }
  return rows;
}

export function extractSection(text, query) {
  const heads = headingsOf(text);
  const want = query.trim().toLowerCase();
  const hit = heads.find((h) => h.title.toLowerCase() === want) || heads.find((h) => h.title.toLowerCase().includes(want));
  if (!hit) return "";
  const lines = text.split("\n");
  const next = heads.find((h) => h.line > hit.line && h.level <= hit.level);
  const end = next ? next.line - 1 : lines.length;
  return lines.slice(hit.line - 1, end).join("\n");
}

function main() {
  const [cmd, file, ...rest] = process.argv.slice(2);
  if (!cmd || !file || (cmd !== "list" && cmd !== "extract" && cmd !== "stamp")) {
    console.error("usage: node scripts/md-section.mjs list|extract|stamp <file> [heading]");
    process.exit(2);
  }
  const text = readFileSync(file, "utf8");
  if (cmd === "list") {
    for (const r of parseIndex(text).length ? parseIndex(text) : sectionRows(text)) console.log(`${r.start}–${r.end}\t${r.marks} ${r.title}`);
    return;
  }
  if (cmd === "extract") {
    const out = extractSection(text, rest.join(" "));
    if (!out) {
      console.error("no heading: " + rest.join(" "));
      process.exit(1);
    }
    process.stdout.write(out.endsWith("\n") ? out : out + "\n");
    return;
  }
  writeFileSync(file, stamp(text));
}

if (process.argv[1] && process.argv[1].endsWith("md-section.mjs")) main();
