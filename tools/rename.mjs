/**
 * Renames one variable everywhere it is used, and nowhere else (task T16).
 *   npm run rename                                   applies every rename in tools/renames.json not yet applied
 *   npm run rename -- <old> <new> <file>:<line>      adds that rename to tools/renames.json, then applies it
 *
 * <file>:<line> is a line in src/game/ where <old> appears, for example src/game/20-ch2.js:12.
 * The tool reads the whole program the way the build joins it, finds the variable that <old>
 * means on that line using Babel's scope analysis, and changes only that variable: its
 * declaration and every use. Another variable that happens to have the same short name in
 * another function is left alone. Object keys like `ch2:` in `{ ch2: k }` are not variables
 * and are never touched.
 *
 * It refuses when <new> is already a name the renamed variable could collide with, so a rename
 * never changes what the program does. tools/renames.json is the record: each entry says what
 * was renamed, where, why, and when it was applied, so renames are reviewable in a pull request.
 * After renaming: npm run build && npm test.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
import { root, sourceFiles } from "./build.mjs";

const traverse = traverseModule.default || traverseModule;
const MAP = join(root, "tools", "renames.json");
const isName = (s) => /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(s);

function load() {
  const files = sourceFiles().map((path) => ({ path, rel: relative(root, path), text: readFileSync(path, "utf8") }));
  let at = 0;
  for (const f of files) {
    f.start = at;
    at += f.text.length;
  }
  return { files, program: files.map((f) => f.text).join("") };
}

function lineRange(files, rel, line) {
  const f = files.find((x) => x.rel === rel);
  if (!f) throw new Error(`${rel} is not one of the build's source files`);
  const lines = f.text.split("\n");
  if (line < 1 || line > lines.length) throw new Error(`${rel} has no line ${line}`);
  const a = f.start + lines.slice(0, line - 1).reduce((s, l) => s + l.length + 1, 0);
  return [a, a + lines[line - 1].length];
}

function renameOnce({ old, to, at }) {
  const { files, program } = load();
  const [rel, lineText] = at.split(/:(?=\d+$)/);
  const [a, b] = lineRange(files, rel, Number(lineText));
  const ast = parse(program, { sourceType: "script" });

  // The identifier named <old> on that line, used as a variable (not an object key or a .property).
  let target = null;
  traverse(ast, {
    Identifier(path) {
      if (target || path.node.name !== old || path.node.start < a || path.node.end > b) return;
      if (!path.isReferencedIdentifier() && !path.isBindingIdentifier()) return;
      target = path;
      path.stop();
    },
  });
  if (!target) throw new Error(`no variable called ${old} on ${at}`);
  const binding = target.scope.getBinding(old);
  if (!binding) throw new Error(`${old} on ${at} is a global, not a variable this program declares`);

  // Every place the variable is written: the declaration, each use, each assignment.
  const ids = new Set([binding.identifier]);
  for (const r of binding.referencePaths) ids.add(r.node);
  for (const c of binding.constantViolations) {
    const left = c.isAssignmentExpression() ? c.get("left") : c.isUpdateExpression() ? c.get("argument") : c;
    const found = left.isIdentifier() ? [left.node] : Object.values(left.getBindingIdentifiers ? left.getBindingIdentifiers() : {});
    for (const n of found) if (n.name === old) ids.add(n);
  }

  // Refuse a rename that could change meaning: <to> already declared where the variable is seen,
  // or <to> already used inside the variable's scope to mean something else.
  const clash = [];
  if (binding.scope.hasBinding(to)) clash.push(`${to} is already declared where ${old} is declared`);
  for (const r of binding.referencePaths) if (r.scope.hasBinding(to)) { clash.push(`${to} is declared where ${old} is used (offset ${r.node.start})`); break; }
  binding.scope.path.traverse({
    Identifier(p) {
      if (p.node.name === to && (p.isReferencedIdentifier() || p.isBindingIdentifier())) clash.push(`${to} is already used inside ${old}'s scope (offset ${p.node.start})`);
    },
  });
  if (clash.length) throw new Error(`refusing to rename ${old} to ${to}: ${clash[0]}`);

  // Shorthand properties { k } must become { k: ch2 } so the object key stays the same.
  const shorthand = new Set();
  traverse(ast, {
    ObjectProperty(p) {
      if (p.node.shorthand && ids.has(p.node.value)) shorthand.add(p.node.value);
    },
  });

  // Edit the text in place, last change first, so offsets stay right and formatting is kept.
  const edits = [...ids].map((n) => [n.start, n.end, shorthand.has(n) ? `${old}: ${to}` : to]).sort((x, y) => y[0] - x[0]);
  const out = new Map(files.map((f) => [f.rel, f.text]));
  for (const [s, e, text] of edits) {
    const f = files.find((x) => s >= x.start && e <= x.start + x.text.length);
    const cur = out.get(f.rel);
    out.set(f.rel, cur.slice(0, s - f.start) + text + cur.slice(e - f.start));
  }
  let changed = 0;
  for (const f of files)
    if (out.get(f.rel) !== f.text) {
      writeFileSync(f.path, out.get(f.rel));
      changed++;
    }
  return { count: edits.length, files: changed };
}

const map = existsSync(MAP) ? JSON.parse(readFileSync(MAP, "utf8")) : { about: "", renames: [] };
const args = process.argv.slice(2);
if (args.length) {
  const [old, to, at] = args;
  if (!old || !to || !at || !isName(old) || !isName(to) || !/:\d+$/.test(at)) {
    console.error("Usage: npm run rename -- <old> <new> <file>:<line>   (for example: npm run rename -- k ch2 src/game/20-ch2.js:12)");
    process.exit(1);
  }
  map.renames.push({ old, new: to, at, why: process.env.WHY || "" });
}
let failed = false;
for (const r of map.renames) {
  if (r.applied) continue;
  try {
    const { count, files } = renameOnce({ old: r.old, to: r.new, at: r.at });
    r.applied = new Date().toISOString().slice(0, 10);
    console.log(`renamed ${r.old} to ${r.new} (${count} places in ${files} file${files === 1 ? "" : "s"})`);
  } catch (err) {
    console.error(String(err.message || err));
    // A rename typed just now that cannot be done is not kept in the record.
    if (args.length && r === map.renames.at(-1)) map.renames.pop();
    failed = true;
    break;
  }
}
writeFileSync(MAP, JSON.stringify(map, null, 2) + "\n");
if (failed) process.exit(1);
console.log("Now run: npm run build && npm test");
