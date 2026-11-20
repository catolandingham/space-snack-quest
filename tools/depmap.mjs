/**
 * Dependency map of the 16 game fragments.
 *   npm run depmap           writes docs/depmap.json and docs/DEPMAP.md
 *   npm run depmap -- --check   fails if those files differ from a fresh map
 *
 * tools/build.mjs joins src/vendor-react.js and src/game/*.js, in name order, into one
 * function. A name defined in one fragment is visible to the others. This tool parses
 * that joined program with Babel and lists, exactly:
 *   - the top-level functions and variables each fragment defines
 *   - every shared name it reads or writes, and the properties of n, ch2, B, p, and e
 *   - function calls from one fragment to another
 *   - names only one fragment touches
 *   - load-order links: a name used while the joined function is still starting
 *
 * Load order follows direct calls and immediate function calls. It does not enter a
 * function that is only handed to another function (a listener, for example). Both
 * branches of an if are treated as running. Those limits are counted in the map.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
import { stamp } from "../scripts/md-section.mjs";
import { root, sourceFiles } from "./build.mjs";

const traverse = traverseModule.default || traverseModule;
const TRACKED = ["n", "ch2", "B", "p", "e"];
const TRACKED_SET = new Set(TRACKED);

export function loadSources() {
  return sourceFiles().map((path) => ({
    rel: relative(root, path),
    text: readFileSync(path, "utf8"),
  }));
}

function indexFiles(fileRecords) {
  let at = 0;
  const files = fileRecords.map((f) => {
    const lineStarts = [0];
    for (let i = 0; i < f.text.length; i++) if (f.text.charCodeAt(i) === 10) lineStarts.push(i + 1);
    const rec = { rel: f.rel, text: f.text, start: at, lineStarts };
    at += f.text.length;
    return rec;
  });
  function fileOf(offset) {
    let lo = 0;
    let hi = files.length - 1;
    let ans = 0;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (files[mid].start <= offset) {
        ans = mid;
        lo = mid + 1;
      } else hi = mid - 1;
    }
    return files[ans];
  }
  function lineAt(offset) {
    const f = fileOf(offset);
    const rel = offset - f.start;
    let lo = 0;
    let hi = f.lineStarts.length - 1;
    let ans = 0;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (f.lineStarts[mid] <= rel) {
        ans = mid;
        lo = mid + 1;
      } else hi = mid - 1;
    }
    return { file: f.rel, line: ans + 1 };
  }
  return { files, fileOf, lineAt, program: fileRecords.map((f) => f.text).join("") };
}

function isMember(path) {
  return path.isMemberExpression() || path.isOptionalMemberExpression();
}
function isCall(path) {
  return path.isCallExpression() || path.isOptionalCallExpression() || path.isNewExpression();
}
function isFunctionNode(path) {
  return (
    path.isFunctionDeclaration() ||
    path.isFunctionExpression() ||
    path.isArrowFunctionExpression() ||
    path.isObjectMethod() ||
    path.isClassMethod()
  );
}

/** How an identifier is used. "decl" is where the name is created. null is not a variable (a property name, a label). */
export function accessOf(path) {
  if (!path.isIdentifier()) return null;
  const parent = path.parentPath;
  if (isMember(parent) && path.parentKey === "property" && !parent.node.computed) return null;
  if ((parent.isObjectMethod() || parent.isClassMethod() || parent.isClassProperty()) && path.parentKey === "key" && !parent.node.computed) return null;

  const walked = walkOut(path);
  if (walked.role === "key") return null;
  if (walked.role === "decl") return "decl";
  if (walked.role === "assign-pattern") return "write";

  if (parent.isAssignmentExpression() && parent.node.left === path.node) {
    return parent.node.operator === "=" ? "write" : "readwrite";
  }
  if (parent.isUpdateExpression() && parent.node.argument === path.node) return "readwrite";
  if (parent.isUnaryExpression() && parent.node.operator === "delete" && parent.node.argument === path.node) return "write";
  if ((parent.isForInStatement() || parent.isForOfStatement()) && parent.node.left === path.node) return "write";
  if (path.isReferencedIdentifier()) return "read";
  return null;
}

function walkOut(path) {
  let p = path.parentPath;
  let child = path;
  let sawPattern = false;
  while (p) {
    if (p.isObjectProperty()) {
      if (child.parentKey === "key" && !p.node.computed) return { role: "key" };
      child = p;
      p = p.parentPath;
      continue;
    }
    if (p.isAssignmentPattern()) {
      if (child.parentKey === "right") return { role: "expr" };
      sawPattern = true;
      child = p;
      p = p.parentPath;
      continue;
    }
    if (p.isObjectPattern() || p.isArrayPattern() || p.isRestElement()) {
      sawPattern = true;
      child = p;
      p = p.parentPath;
      continue;
    }
    break;
  }
  if (!sawPattern) {
    if (p && isDeclContext(p, child)) return { role: "decl" };
    return { role: "expr" };
  }
  if (p && p.isVariableDeclarator() && child.parentKey === "id") return { role: "decl" };
  if (p && p.isCatchClause() && (child.parentKey === "param" || p.node.param === child.node)) return { role: "decl" };
  if (p && isFunctionNode(p) && (p.node.params || []).includes(child.node)) return { role: "decl" };
  if (p && p.isAssignmentExpression() && p.node.left === child.node) return { role: "assign-pattern" };
  if (p && (p.isForInStatement() || p.isForOfStatement()) && p.node.left === child.node) return { role: "assign-pattern" };
  return { role: "expr" };
}

function isDeclContext(p, child) {
  if (p.isVariableDeclarator() && p.node.id === child.node) return true;
  if ((p.isFunctionDeclaration() || p.isFunctionExpression() || p.isClassDeclaration() || p.isClassExpression()) && p.node.id === child.node) return true;
  if (p.isCatchClause() && p.node.param === child.node) return true;
  if (isFunctionNode(p) && (p.node.params || []).includes(child.node)) return true;
  return false;
}

function memberPart(memberPath) {
  if (!memberPath.node.computed) return { kind: "id", value: memberPath.node.property.name };
  const prop = memberPath.get("property");
  if (prop.isStringLiteral()) return { kind: "str", value: prop.node.value };
  if (prop.isNumericLiteral()) return { kind: "num", value: prop.node.value };
  if (prop.isTemplateLiteral() && prop.node.expressions.length === 0) return { kind: "str", value: prop.node.quasis[0].value.cooked };
  return { kind: "star" };
}

function formatPart(part) {
  if (part.kind === "star") return "[*]";
  if (part.kind === "num") return `[${part.value}]`;
  if (part.kind === "rest") return "{...}";
  if (part === "...") return "{...}";
  const value = typeof part === "string" ? part : part.value;
  if (typeof part === "object" && part.kind === "id") return value;
  if (typeof part === "string" && /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(part)) return part;
  if (typeof part === "object" && part.kind === "str" && /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(value)) return value;
  return `[${JSON.stringify(value)}]`;
}

function joinParts(parts) {
  let s = "";
  for (const part of parts) {
    const bit = formatPart(part);
    if (!s) s = bit.startsWith("[") || bit.startsWith("{") ? bit : bit;
    else if (bit.startsWith("[") || bit.startsWith("{")) s += bit;
    else s += "." + bit;
  }
  return s;
}

function isOuterMember(path) {
  const p = path.parentPath;
  return !(isMember(p) && p.node.object === path.node);
}

function scopeChainHas(inner, scope) {
  let cursor = inner;
  while (cursor) {
    if (cursor === scope) return true;
    cursor = cursor.parent;
  }
  return false;
}

function classifyBinding(binding) {
  const p = binding.path;
  if (binding.kind === "hoisted" || p.isFunctionDeclaration()) return { bucket: "functions", load: "function" };
  if (p.isClassDeclaration()) return { bucket: "functions", load: "class" };
  if (binding.kind === "param" || p.isIdentifier()) return { bucket: "variables", load: "param" };
  if (p.isVariableDeclarator()) {
    const kind = p.parentPath.node.kind;
    const init = p.get("init");
    const isFn = !!init.node && (init.isFunctionExpression() || init.isArrowFunctionExpression());
    return { bucket: isFn ? "functions" : "variables", load: kind };
  }
  throw new Error(`unexpected binding ${binding.identifier.name} (${binding.kind}, ${p.node.type})`);
}

function functionBody(binding) {
  const p = binding.path;
  if (p.isFunctionDeclaration()) return p;
  if (p.isVariableDeclarator()) {
    const init = p.get("init");
    if (init.node && (init.isFunctionExpression() || init.isArrowFunctionExpression())) return init;
  }
  return null;
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    const out = {};
    for (const key of Object.keys(value).sort()) out[key] = stable(value[key]);
    return out;
  }
  return value;
}

export function stableStringify(value) {
  return JSON.stringify(stable(value), null, 2) + "\n";
}

/**
 * @param {{rel: string, text: string}[]} fileRecords build order, vendor first
 */
export function mapProgram(fileRecords) {
  const { files, fileOf, lineAt, program } = indexFiles(fileRecords);
  const gameFiles = files.filter((f) => f.rel.startsWith("src/game/") && f.rel.endsWith(".js"));
  if (!gameFiles.length) throw new Error("no src/game fragments");
  const ast = parse(program, { sourceType: "script" });

  // The fragments share the innermost function that starts before the second fragment and
  // still covers the last one. In the real program that is s8, which begins partway
  // through 00-core.js. The arrow wrapper around the React runtime is outside it.
  const later = gameFiles[Math.min(1, gameFiles.length - 1)];
  const last = gameFiles[gameFiles.length - 1];
  let sharedFn = null;
  traverse(ast, {
    Function(path) {
      const node = path.node;
      if (node.start < later.start && node.end > last.start && (!sharedFn || node.start > sharedFn.node.start)) sharedFn = path;
    },
  });
  if (!sharedFn) throw new Error("the game fragments are not inside a function");
  const sharedScope = sharedFn.scope;
  function isSharedScope(scope) {
    let cursor = sharedScope;
    while (cursor) {
      if (cursor === scope) return true;
      cursor = cursor.parent;
    }
    return false;
  }
  for (const f of gameFiles) {
    const inside = f.start < sharedFn.node.end && f.start + f.text.length > sharedFn.node.start;
    if (!inside) throw new Error(`${f.rel} is outside the shared function`);
  }

  const definedIn = new Map();
  const bindingFile = new Map();
  const sharedBindings = [];
  {
    const seen = new Set();
    let scope = sharedScope;
    while (scope) {
      for (const binding of Object.values(scope.bindings)) {
        if (seen.has(binding)) continue;
        seen.add(binding);
        const file = fileOf(binding.identifier.start).rel;
        bindingFile.set(binding, file);
        sharedBindings.push(binding);
        // The inner function wins when a name is shadowed, so record game-function bindings last.
      }
      scope = scope.parent;
    }
  }
  for (const binding of sharedBindings) {
    if (binding.scope === sharedScope) definedIn.set(binding.identifier.name, bindingFile.get(binding));
  }
  for (const binding of sharedBindings) {
    if (!definedIn.has(binding.identifier.name)) definedIn.set(binding.identifier.name, bindingFile.get(binding));
  }

  const reads = new Map();
  const writes = new Map();
  const props = new Map();
  const edges = new Map();
  const defines = new Map();
  for (const f of gameFiles) defines.set(f.rel, { functions: new Set(), variables: new Set() });

  function bump(map, file, name) {
    let by = map.get(file);
    if (!by) map.set(file, (by = new Map()));
    by.set(name, (by.get(name) || 0) + 1);
  }
  function bumpProp(file, root, pathKey, kind) {
    let byRoot = props.get(file);
    if (!byRoot) props.set(file, (byRoot = new Map()));
    let byPath = byRoot.get(root);
    if (!byPath) byRoot.set(root, (byPath = new Map()));
    let row = byPath.get(pathKey);
    if (!row) byPath.set(pathKey, (row = { read: 0, write: 0, call: 0 }));
    if (kind === "read" || kind === "readwrite") row.read++;
    if (kind === "write" || kind === "readwrite") row.write++;
    if (kind === "call") row.call++;
  }
  function resolveShared(idPath) {
    const binding = idPath.scope.getBinding(idPath.node.name);
    if (binding && isSharedScope(binding.scope)) return { binding, unresolved: false };
    if (!binding) return { binding: null, unresolved: true };
    return null;
  }
  function staticChain(path) {
    const parts = [];
    let cur = path;
    while (isMember(cur)) {
      parts.push(memberPart(cur));
      cur = cur.get("object");
    }
    if (!cur.isIdentifier()) return null;
    const resolved = resolveShared(cur);
    if (!resolved) return null;
    parts.reverse();
    return { name: cur.node.name, parts, resolved, file: fileOf(path.node.start).rel };
  }
  function addChain(chain, extraParts, kind) {
    const parts = chain.parts.concat(extraParts);
    if (!parts.length) return;
    const key = joinParts(parts);
    bumpProp(chain.file, chain.name, key, kind);
  }

  function walkPattern(patternPath, baseParts, chain) {
    if (patternPath.isObjectPattern()) {
      for (const prop of patternPath.get("properties")) {
        if (prop.isRestElement()) {
          addChain(chain, baseParts.concat([{ kind: "rest" }]), "read");
          continue;
        }
        if (!prop.isObjectProperty()) continue;
        const next = baseParts.concat([keyPart(prop)]);
        addChain(chain, next, "read");
        let value = prop.get("value");
        if (value.isAssignmentPattern()) value = value.get("left");
        if (value.isObjectPattern() || value.isArrayPattern()) walkPattern(value, next, chain);
      }
    } else if (patternPath.isArrayPattern()) {
      let index = 0;
      for (const el of patternPath.get("elements")) {
        if (!el.node) {
          index++;
          continue;
        }
        const rest = el.isRestElement();
        const next = baseParts.concat([rest ? { kind: "rest" } : { kind: "num", value: index }]);
        addChain(chain, next, "read");
        let inner = rest ? el.get("argument") : el;
        if (inner.isAssignmentPattern()) inner = inner.get("left");
        if (inner.isObjectPattern() || inner.isArrayPattern()) walkPattern(inner, next, chain);
        if (!rest) index++;
      }
    }
  }
  function keyPart(prop) {
    if (prop.node.computed) {
      const k = prop.get("key");
      if (k.isStringLiteral()) return { kind: "str", value: k.node.value };
      if (k.isNumericLiteral()) return { kind: "num", value: k.node.value };
      return { kind: "star" };
    }
    return { kind: "id", value: prop.node.key.name };
  }

  for (const binding of sharedBindings) {
    const file = bindingFile.get(binding);
    if (!defines.has(file)) continue;
    const { bucket } = classifyBinding(binding);
    defines.get(file)[bucket].add(binding.identifier.name);
  }

  traverse(ast, {
    Identifier(path) {
      const access = accessOf(path);
      if (!access || access === "decl") return;
      const resolved = resolveShared(path);
      if (!resolved) return;
      const file = fileOf(path.node.start).rel;
      const name = path.node.name;
      if (access === "read" || access === "readwrite") bump(reads, file, name);
      if (access === "write" || access === "readwrite") bump(writes, file, name);
    },
    MemberExpression(path) {
      noteMember(path);
    },
    OptionalMemberExpression(path) {
      noteMember(path);
    },
    CallExpression: { exit(path) { noteCall(path); } },
    OptionalCallExpression: { exit(path) { noteCall(path); } },
    NewExpression: { exit(path) { noteCall(path); } },
    VariableDeclarator(path) {
      notePattern(path.get("id"), path.get("init"));
    },
    AssignmentExpression(path) {
      const left = path.get("left");
      if (left.isObjectPattern() || left.isArrayPattern()) notePattern(left, path.get("right"));
    },
  });

  function noteMember(path) {
    if (!isOuterMember(path)) return;
    const chain = staticChain(path);
    if (!chain || !chain.parts.length) return;
    const parent = path.parentPath;
    let kind = "read";
    if (parent.isAssignmentExpression() && parent.node.left === path.node) kind = parent.node.operator === "=" ? "write" : "readwrite";
    else if (parent.isUpdateExpression() && parent.node.argument === path.node) kind = "readwrite";
    else if (parent.isUnaryExpression() && parent.node.operator === "delete" && parent.node.argument === path.node) kind = "write";
    else if (isCall(parent) && parent.node.callee === path.node) kind = "call";
    else if ((parent.isForInStatement() || parent.isForOfStatement()) && parent.node.left === path.node) kind = "write";
    else if (walkOut(path).role === "assign-pattern") kind = "write";
    for (let i = 1; i < chain.parts.length; i++) bumpProp(chain.file, chain.name, joinParts(chain.parts.slice(0, i)), "read");
    bumpProp(chain.file, chain.name, joinParts(chain.parts), kind);
  }
  function noteCall(path) {
    const callee = path.get("callee");
    if (!callee.isIdentifier()) return;
    const resolved = resolveShared(callee);
    if (!resolved || !resolved.binding) return;
    const from = fileOf(callee.node.start).rel;
    if (classifyBinding(resolved.binding).bucket !== "functions") return;
    const to = bindingFile.get(resolved.binding);
    if (!from.startsWith("src/game/") || !to || !to.startsWith("src/game/") || from === to) return;
    const key = `${from}\0${to}\0${callee.node.name}`;
    edges.set(key, (edges.get(key) || 0) + 1);
  }
  function notePattern(idPath, initPath) {
    if (!initPath.node) return;
    if (!idPath.isObjectPattern() && !idPath.isArrayPattern()) return;
    const chain = staticChain(initPath);
    if (!chain) return;
    chain.file = fileOf(idPath.node.start).rel;
    walkPattern(idPath, [], chain);
  }

  const load = loadOrder({ sharedFn, sharedScope, gameFiles, fileOf, lineAt, sharedBindings, bindingFile });

  const touch = new Map();
  function touchFile(name, file) {
    if (!file) return;
    let set = touch.get(name);
    if (!set) touch.set(name, (set = new Set()));
    set.add(file);
  }
  for (const [name, file] of definedIn) if (file.startsWith("src/game/")) touchFile(name, file);
  for (const [file, by] of reads) for (const name of by.keys()) touchFile(name, file);
  for (const [file, by] of writes) for (const name of by.keys()) touchFile(name, file);

  function rows(map, file) {
    const by = map.get(file) || new Map();
    return [...by.entries()]
      .map(([name, count]) => ({ name, count, definedIn: definedIn.get(name) || null }))
      .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  }
  function propRows(file, root) {
    const byPath = props.get(file)?.get(root);
    if (!byPath) return [];
    return [...byPath.entries()]
      .map(([path, row]) => ({ path, read: row.read, write: row.write, call: row.call }))
      .sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  }

  const fileOut = gameFiles.map((f) => {
    const def = defines.get(f.rel);
    const properties = {};
    for (const rootName of TRACKED) properties[rootName] = propRows(f.rel, rootName);
    const other = {};
    const byRoot = props.get(f.rel);
    if (byRoot) {
      for (const rootName of [...byRoot.keys()].sort()) {
        if (TRACKED_SET.has(rootName)) continue;
        other[rootName] = propRows(f.rel, rootName);
      }
    }
    return {
      file: f.rel,
      defines: {
        functions: [...def.functions].sort(),
        variables: [...def.variables].sort(),
      },
      topLevel: topLevelCounts(sharedFn, f, fileOf),
      prelude: preludeCounts(sharedFn, f, fileOf),
      reads: rows(reads, f.rel),
      writes: rows(writes, f.rel),
      properties,
      otherProperties: other,
    };
  });

  const edgeList = [...edges.entries()]
    .map(([key, count]) => {
      const [from, to, name] = key.split("\0");
      return { from, to, name, count };
    })
    .sort((a, b) => (a.from < b.from ? -1 : a.from > b.from ? 1 : a.to < b.to ? -1 : a.to > b.to ? 1 : a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

  const easyWins = [];
  const easySeen = new Set();
  for (const binding of sharedBindings) {
    const name = binding.identifier.name;
    const decl = bindingFile.get(binding);
    if (!decl || !decl.startsWith("src/game/") || easySeen.has(name)) continue;
    const filesTouched = [...(touch.get(name) || [])].filter((f) => f.startsWith("src/game/"));
    const outside = [...(touch.get(name) || [])].filter((f) => !f.startsWith("src/game/"));
    if (outside.length || filesTouched.length !== 1) continue;
    easySeen.add(name);
    easyWins.push({ name, file: filesTouched[0], kind: classifyBinding(binding).bucket === "functions" ? "function" : "variable" });
  }
  easyWins.sort((a, b) => (a.file < b.file ? -1 : a.file > b.file ? 1 : a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

  const order = gameFiles.map((f) => f.rel);
  const rank = new Map(order.map((f, i) => [f, i]));
  const crossFile = [];
  for (const [name, set] of touch) {
    const gameTouched = [...set].filter((f) => f.startsWith("src/game/"));
    if (gameTouched.length < 2) continue;
    gameTouched.sort((a, b) => rank.get(a) - rank.get(b));
    crossFile.push({ name, definedIn: definedIn.get(name) || null, files: gameTouched });
  }
  crossFile.sort((a, b) => b.files.length - a.files.length || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

  const coupling = order.map((file) => {
    const names = new Set();
    for (const row of rows(reads, file)) if (row.definedIn !== file) names.add(row.name);
    for (const row of rows(writes, file)) if (row.definedIn !== file) names.add(row.name);
    const callsOut = edgeList.filter((e) => e.from === file).length;
    const callsIn = edgeList.filter((e) => e.to === file).length;
    return { file, outsideNames: names.size, callsOut, callsIn };
  });
  coupling.sort((a, b) => b.outsideNames + b.callsOut + b.callsIn - (a.outsideNames + a.callsOut + a.callsIn) || (a.file < b.file ? -1 : 1));

  const scopeAt = lineAt(sharedFn.node.start);
  const unresolved = new Set();
  for (const f of gameFiles) {
    for (const row of rows(reads, f.rel)) if (!row.definedIn) unresolved.add(row.name);
    for (const row of rows(writes, f.rel)) if (!row.definedIn) unresolved.add(row.name);
  }

  return {
    version: 1,
    sharedScope: { type: sharedFn.node.type, name: sharedFn.node.id ? sharedFn.node.id.name : null, file: scopeAt.file, line: scopeAt.line },
    buildOrder: order,
    summary: {
      fragments: order.length,
      closureNames: sharedBindings.filter((b) => bindingFile.get(b).startsWith("src/game/")).length,
      crossFileNames: crossFile.length,
      crossFileClosure: crossFile.filter((row) => row.definedIn && row.definedIn.startsWith("src/game/")).length,
      crossFileVendor: crossFile.filter((row) => row.definedIn && !row.definedIn.startsWith("src/game/")).length,
      crossFileGlobals: crossFile.filter((row) => !row.definedIn).length,
      unresolvedGlobals: unresolved.size,
      easyWins: easyWins.length,
      callEdges: edgeList.length,
      callSites: edgeList.reduce((s, e) => s + e.count, 0),
      loadOrderEdges: load.edges.length,
      loadOrderHazards: load.hazards.length,
      mostCoupled: coupling[0] ? coupling[0].file : null,
    },
    files: fileOut,
    edges: edgeList,
    easyWins,
    crossFile,
    coupling,
    loadOrder: load,
  };
}

function preludeCounts(sharedFn, file, fileOf) {
  const parent = sharedFn.getFunctionParent();
  if (!parent) return {};
  const body = parent.get("body");
  if (!body.isBlockStatement()) return {};
  const counts = {};
  for (const stmt of body.get("body")) {
    if (stmt.node === sharedFn.node) continue;
    if (fileOf(stmt.node.start).rel !== file.rel) continue;
    let kind = stmt.node.type;
    if (stmt.isFunctionDeclaration()) kind = "function";
    else if (stmt.isVariableDeclaration()) kind = stmt.node.kind;
    else if (stmt.isExpressionStatement()) kind = "expression";
    counts[kind] = (counts[kind] || 0) + 1;
  }
  return counts;
}

function topLevelCounts(sharedFn, file, fileOf) {
  const counts = {};
  const body = sharedFn.get("body");
  if (!body.isBlockStatement()) return counts;
  for (const stmt of body.get("body")) {
    if (fileOf(stmt.node.start).rel !== file.rel) continue;
    let kind = stmt.node.type;
    if (stmt.isFunctionDeclaration()) kind = "function";
    else if (stmt.isVariableDeclaration()) kind = stmt.node.kind;
    else if (stmt.isExpressionStatement()) kind = "expression";
    else if (stmt.isClassDeclaration()) kind = "class";
    else if (stmt.isIfStatement()) kind = "if";
    else if (stmt.isForStatement() || stmt.isWhileStatement() || stmt.isForInStatement() || stmt.isForOfStatement() || stmt.isDoWhileStatement()) kind = "loop";
    counts[kind] = (counts[kind] || 0) + 1;
  }
  return counts;
}

function loadOrder({ sharedFn, sharedScope, gameFiles, fileOf, lineAt, sharedBindings, bindingFile }) {
  const declared = new Set();
  const assigned = new Map();
  const edges = new Map();
  const hazards = [];
  const uninitialized = [];
  const notFollowed = new Map();
  let steps = 0;
  let truncated = false;
  const STEP_CAP = 250000;

  for (const binding of sharedBindings) {
    const { load } = classifyBinding(binding);
    const declFile = bindingFile.get(binding);
    if (binding.scope !== sharedScope) {
      declared.add(binding);
      assigned.set(binding, declFile);
      continue;
    }
    if (load === "function" || load === "param") {
      declared.add(binding);
      if (load === "param") assigned.set(binding, declFile);
      continue;
    }
    if (load === "var") {
      declared.add(binding);
      const init = binding.path.isVariableDeclarator() ? binding.path.get("init") : null;
      if (init && init.node && declFile && !declFile.startsWith("src/game/")) assigned.set(binding, declFile);
      continue;
    }
    if (declFile && !declFile.startsWith("src/game/")) {
      declared.add(binding);
      assigned.set(binding, declFile);
    }
  }

  function addEdge(before, after, name) {
    if (!before || !after || before === after) return;
    const key = `${before}\0${after}`;
    let set = edges.get(key);
    if (!set) edges.set(key, (set = new Set()));
    set.add(name);
  }
  function noteUse(path, access) {
    if (truncated) return;
    if (++steps > STEP_CAP) {
      truncated = true;
      return;
    }
    const name = path.node.name;
    const binding = path.scope.getBinding(name);
    if (!binding || !scopeChainHas(sharedScope, binding.scope)) return;
    const { load } = classifyBinding(binding);
    if (load === "function" || load === "param") return;
    const file = fileOf(path.node.start).rel;
    if (!declared.has(binding)) {
      const at = lineAt(path.node.start);
      hazards.push({ file: at.file, line: at.line, name, access });
      return;
    }
    if ((access === "read" || access === "readwrite") && load === "var" && !assigned.has(binding)) {
      const at = lineAt(path.node.start);
      uninitialized.push({ file: at.file, line: at.line, name });
    }
    if (access === "read" || access === "readwrite") addEdge(assigned.get(binding), file, name);
    if (access === "write" || access === "readwrite") assigned.set(binding, file);
  }
  function noteIdent(path) {
    const access = accessOf(path);
    if (!access || access === "decl") return;
    noteUse(path, access);
  }
  function rootIdent(path) {
    let cur = path;
    while (isMember(cur)) cur = cur.get("object");
    return cur.isIdentifier() ? cur : null;
  }

  function run(path, stack) {
    if (!path?.node || truncated) return;
    if (path.isIdentifier()) {
      noteIdent(path);
      return;
    }
    if (path.isFunctionDeclaration() || path.isFunctionExpression() || path.isArrowFunctionExpression()) return;
    if (path.isClassDeclaration() || path.isClassExpression()) {
      if (path.node.superClass) run(path.get("superClass"), stack);
      const id = path.node.id;
      if (id) {
        const binding = path.scope.parent.getBinding(id.name) || path.scope.getBinding(id.name);
        if (binding && binding.scope === sharedScope) {
          declared.add(binding);
          assigned.set(binding, fileOf(id.start).rel);
        }
      }
      return;
    }
    if (path.isVariableDeclaration()) {
      handleVar(path, stack);
      return;
    }
    if (path.isAssignmentExpression()) {
      handleAssign(path, stack);
      return;
    }
    if (path.isUpdateExpression()) {
      const arg = path.get("argument");
      if (arg.isIdentifier()) noteUse(arg, "readwrite");
      else {
        const root = rootIdent(arg);
        if (root) noteIdent(root);
      }
      return;
    }
    path.traverse({
      Function(p) {
        p.skip();
      },
      Class(p) {
        run(p, stack);
        p.skip();
      },
      VariableDeclaration(p) {
        handleVar(p, stack);
        p.skip();
      },
      AssignmentExpression(p) {
        handleAssign(p, stack);
        p.skip();
      },
      UpdateExpression(p) {
        run(p, stack);
        p.skip();
      },
      Identifier(p) {
        noteIdent(p);
      },
      CallExpression: { exit(p) { followCall(p, stack); } },
      OptionalCallExpression: { exit(p) { followCall(p, stack); } },
      NewExpression: { exit(p) { followCall(p, stack); } },
    });
  }

  function handleVar(path, stack) {
    for (const decl of path.get("declarations")) {
      if (decl.node.init) run(decl.get("init"), stack);
      runDefaults(decl.get("id"), stack);
      const ids = decl.get("id").isIdentifier() ? [decl.get("id")] : [];
      if (!decl.get("id").isIdentifier()) {
        decl.get("id").traverse({
          Identifier(p) {
            if (accessOf(p) === "decl") ids.push(p);
          },
        });
      }
      for (const idPath of ids) {
        const binding = idPath.scope.getBinding(idPath.node.name);
        if (!binding || binding.scope !== sharedScope) continue;
        declared.add(binding);
        if (path.node.kind !== "var" || decl.node.init) assigned.set(binding, fileOf(idPath.node.start).rel);
      }
    }
  }
  function runDefaults(patternPath, stack) {
    if (!patternPath?.node) return;
    if (patternPath.isIdentifier()) return;
    patternPath.traverse({
      AssignmentPattern(p) {
        run(p.get("right"), stack);
        p.skip();
      },
    });
  }
  function handleAssign(path, stack) {
    run(path.get("right"), stack);
    const left = path.get("left");
    const writing = path.node.operator === "=" ? "write" : "readwrite";
    if (left.isIdentifier()) noteUse(left, writing);
    else if (isMember(left)) {
      const root = rootIdent(left);
      if (root) noteIdent(root);
    } else if (left.isObjectPattern() || left.isArrayPattern()) {
      left.traverse({
        Function(p) {
          p.skip();
        },
        AssignmentPattern(p) {
          run(p.get("right"), stack);
          p.skip();
        },
        Identifier(p) {
          const access = accessOf(p);
          if (access === "write" || access === "readwrite") noteUse(p, access);
        },
      });
    }
  }
  function followCall(path, stack) {
    if (truncated) return;
    const callee = path.get("callee");
    for (const arg of path.get("arguments")) {
      const isFn = arg.isFunctionExpression() || arg.isArrowFunctionExpression();
      let argName = null;
      if (isFn) argName = "(function)";
      else if (arg.isIdentifier()) {
        const binding = arg.scope.getBinding(arg.node.name);
        if (binding && functionBody(binding)) argName = arg.node.name;
      }
      if (!argName) continue;
      const label = callee.isIdentifier() ? callee.node.name : isMember(callee) ? memberLabel(callee) : "(call)";
      const file = fileOf(path.node.start).rel;
      const key = `${file}\0${label}\0${argName}`;
      notFollowed.set(key, (notFollowed.get(key) || 0) + 1);
    }
    let fn = null;
    if (callee.isFunctionExpression() || callee.isArrowFunctionExpression()) fn = callee;
    else if (callee.isIdentifier()) {
      const binding = callee.scope.getBinding(callee.node.name);
      if (binding && binding.scope === sharedScope) fn = functionBody(binding);
    }
    if (!fn) return;
    if (stack.has(fn.node) || stack.size > 40) {
      if (stack.size > 40) truncated = true;
      return;
    }
    stack.add(fn.node);
    const body = fn.get("body");
    run(body, stack);
    stack.delete(fn.node);
  }
  function memberLabel(path) {
    const chain = [];
    let cur = path;
    while (isMember(cur)) {
      chain.push(formatPart(memberPart(cur)));
      cur = cur.get("object");
    }
    chain.reverse();
    const head = cur.isIdentifier() ? cur.node.name : "(expr)";
    return [head, ...chain].join(".");
  }

  const body = sharedFn.get("body");
  if (body.isBlockStatement()) {
    for (const stmt of body.get("body")) {
      if (stmt.isFunctionDeclaration()) continue;
      const file = fileOf(stmt.node.start).rel;
      if (!file.startsWith("src/game/")) continue;
      run(stmt, new Set());
    }
  }

  const edgeList = [...edges.entries()]
    .map(([key, names]) => {
      const [before, after] = key.split("\0");
      return { before, after, names: [...names].sort() };
    })
    .sort((a, b) => (a.before < b.before ? -1 : a.before > b.before ? 1 : a.after < b.after ? -1 : a.after > b.after ? 1 : 0));
  const hazardList = hazards
    .map((h) => ({ file: h.file, line: h.line, name: h.name, access: h.access }))
    .sort((a, b) => cmpText(a.file, b.file) || a.line - b.line || cmpText(a.name, b.name) || cmpText(a.access, b.access));
  const uninitList = uninitialized
    .map((h) => ({ file: h.file, line: h.line, name: h.name }))
    .sort((a, b) => cmpText(a.file, b.file) || a.line - b.line || cmpText(a.name, b.name));
  const pending = [...notFollowed.entries()]
    .map(([key, count]) => {
      const [file, callee, argument] = key.split("\0");
      return { file, callee, argument, count };
    })
    .sort((a, b) => (a.file < b.file ? -1 : a.file > b.file ? 1 : a.callee < b.callee ? -1 : a.callee > b.callee ? 1 : a.argument < b.argument ? -1 : 1));
  return { edges: edgeList, hazards: dedupe(hazardList), uninitialized: dedupe(uninitList), notFollowed: pending, truncated };
}

function cmpText(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

function dedupe(rows) {
  const seen = new Set();
  const out = [];
  for (const row of rows) {
    const key = JSON.stringify(row);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(row);
  }
  return out;
}

function shortFile(rel) {
  return rel.replace(/^src\/game\//, "");
}

export function renderMarkdown(data) {
  const lines = [];
  const s = data.summary;
  lines.push("# Dependency map");
  lines.push("");
  lines.push("Generated by `npm run depmap`. Do not edit this file by hand.");
  lines.push("");
  lines.push("## What this is");
  lines.push("");
  lines.push(`The game source is ${s.fragments} files in \`src/game/\`. The build joins them, in the order below, into one function. A name created in one file can be read by the others. This map is the list of those names. It is a blueprint for splitting the game into real modules without changing how it plays.`);
  lines.push("");
  const fn = data.sharedScope.name ? `\`${data.sharedScope.name}\`` : "an unnamed function";
  lines.push(`The joined function is ${fn}. It starts in \`${data.sharedScope.file}\` at line ${data.sharedScope.line}. The React runtime wraps that function; it is not itself the shared scope. Anything in \`00-core.js\` above the function is a helper outside it.`);
  lines.push("");
  lines.push("## Counts");
  lines.push("");
  lines.push(`- **${s.crossFileClosure} shared names** are declared in the fragments and used by more than one file.`);
  lines.push(`- **${s.crossFileVendor} names** are declared in the React runtime and used by more than one fragment. They stay in the runtime.`);
  lines.push(`- **${s.crossFileGlobals} globals** (\`Math\`, \`window\`, and the like) are also used by more than one file. The game does not declare them.`);
  lines.push(`- **${s.closureNames} names** are declared in the fragments (the joined function, plus helpers in the wrapper that sit in a fragment). **${s.unresolvedGlobals}** distinct globals appear.`);
  lines.push(`- **${s.easyWins} names** are touched by only one file. Those are the easy ones to move out.`);
  lines.push(`- **${s.callEdges} cross-file calls** (${s.callSites} call sites) go from one file to a function defined in another.`);
  lines.push(`- **${s.loadOrderEdges} load-order links.** A link means file A sets up a name that file B uses while the game is still starting. Function declarations are visible everywhere in the joined function, so a call to one is not a load-order link.`);
  lines.push(`- The most coupled file is \`${s.mostCoupled}\`.`);
  lines.push("");
  lines.push("Join order:");
  lines.push("");
  data.buildOrder.forEach((f, i) => lines.push(`${i + 1}. \`${f}\``));
  lines.push("");
  lines.push("## Most coupled files");
  lines.push("");
  lines.push("Outside names are shared names the file uses that it does not itself define. Calls out are functions it calls in other files. Calls in are its functions called from other files.");
  lines.push("");
  lines.push("| File | Outside names | Calls out | Calls in |");
  lines.push("| --- | --- | --- | --- |");
  for (const row of data.coupling) lines.push(`| \`${shortFile(row.file)}\` | ${row.outsideNames} | ${row.callsOut} | ${row.callsIn} |`);
  lines.push("");
  lines.push("## Shared names");
  lines.push("");
  lines.push("Every name used by two or more files. The fullest list, including counts, is `docs/depmap.json`.");
  lines.push("");
  lines.push("| Name | Defined in | Touched by |");
  lines.push("| --- | --- | --- |");
  for (const row of data.crossFile) {
    lines.push(`| \`${row.name}\` | ${row.definedIn ? `\`${shortFile(row.definedIn)}\`` : "global"} | ${row.files.map(shortFile).join(", ")} |`);
  }
  lines.push("");
  lines.push("## Per file");
  lines.push("");
  for (const file of data.files) {
    lines.push(`### ${file.file}`);
    lines.push("");
    const top = Object.entries(file.topLevel)
      .map(([k, n]) => `${n} ${k}`)
      .join(", ");
    const pre = Object.entries(file.prelude || {})
      .map(([k, n]) => `${n} ${k}`)
      .join(", ");
    lines.push(`Statements inside the joined function: ${top || "none"}.`);
    if (pre) lines.push(`Statements outside it, in the wrapper: ${pre}.`);
    lines.push("");
    lines.push(`Defines functions (${file.defines.functions.length}): ${fmtNames(file.defines.functions)}`);
    lines.push("");
    lines.push(`Defines variables (${file.defines.variables.length}): ${fmtNames(file.defines.variables)}`);
    lines.push("");
    lines.push(`Reads (${file.reads.length}): ${fmtCounted(file.reads)}`);
    lines.push("");
    lines.push(`Writes (${file.writes.length}): ${fmtCounted(file.writes)}`);
    lines.push("");
    lines.push("Properties of `n`, `ch2`, `B`, `p`, and `e`. A call is counted on its own, not also as a read. `+=` counts as both a read and a write.");
    lines.push("");
    for (const rootName of TRACKED) {
      const rows = file.properties[rootName];
      lines.push(`**${rootName}**`);
      lines.push("");
      if (!rows.length) {
        lines.push("none");
        lines.push("");
        continue;
      }
      lines.push("| Property | Reads | Writes | Calls |");
      lines.push("| --- | --- | --- | --- |");
      for (const row of rows) lines.push(`| \`${row.path}\` | ${row.read} | ${row.write} | ${row.call} |`);
      lines.push("");
    }
    const otherRoots = Object.keys(file.otherProperties);
    if (otherRoots.length) {
      const bits = [];
      for (const rootName of otherRoots) {
        for (const row of file.otherProperties[rootName]) bits.push(`${rootName}.${row.path} r${row.read}/w${row.write}/c${row.call}`);
      }
      lines.push(`Other properties: ${bits.join(", ")}`);
      lines.push("");
    }
  }
  lines.push("## Cross-file calls");
  lines.push("");
  lines.push("| Caller | Calls | Defined in | Times |");
  lines.push("| --- | --- | --- | --- |");
  for (const edge of data.edges) lines.push(`| \`${shortFile(edge.from)}\` | \`${edge.name}\` | \`${shortFile(edge.to)}\` | ${edge.count} |`);
  lines.push("");
  lines.push("## Names only one file touches");
  lines.push("");
  lines.push("Nothing else in the game reads or writes these. A function here can move into its own module without dragging other files along. A variable here can move with it.");
  lines.push("");
  let current = "";
  for (const row of data.easyWins) {
    if (row.file !== current) {
      if (current) lines.push("");
      current = row.file;
      lines.push(`**${row.file}**`);
      lines.push("");
    }
    lines.push(`- \`${row.name}\` (${row.kind})`);
  }
  lines.push("");
  lines.push("## Load order");
  lines.push("");
  lines.push("These links are the names one file uses, while the joined function is still starting, that an earlier file set up. Reordering two files that share a link changes the start-up. Files with no link between them can still change behavior if their top-level statements are reordered, because those statements run in join order even when they share no name. Do not reorder files from this list alone.");
  lines.push("");
  lines.push("A function passed into another call (for example a listener) is not entered. Both sides of an if are treated as running.");
  lines.push("");
  if (!data.loadOrder.edges.length) lines.push("No load-order links.");
  else {
    lines.push("| Must come first | Before | Names |");
    lines.push("| --- | --- | --- |");
    for (const edge of data.loadOrder.edges) lines.push(`| \`${shortFile(edge.before)}\` | \`${shortFile(edge.after)}\` | ${edge.names.map((n) => `\`${n}\``).join(", ")} |`);
  }
  lines.push("");
  if (data.loadOrder.hazards.length) {
    lines.push("Uses before the name exists (a temporal-dead-zone hazard):");
    lines.push("");
    for (const h of data.loadOrder.hazards) lines.push(`- \`${h.file}\` line ${h.line}: \`${h.name}\` (${h.access})`);
    lines.push("");
  } else {
    lines.push("No name is used at start-up before it exists.");
    lines.push("");
  }
  if (data.loadOrder.uninitialized.length) {
    lines.push("`var` names read at start-up before any assignment:");
    lines.push("");
    for (const h of data.loadOrder.uninitialized) lines.push(`- \`${h.file}\` line ${h.line}: \`${h.name}\``);
    lines.push("");
  }
  const pending = data.loadOrder.notFollowed.reduce((s, row) => s + row.count, 0);
  lines.push(`Callbacks passed at start-up and not entered: ${pending}.`);
  if (data.loadOrder.truncated) lines.push("The load-order walk hit its safety cap and is incomplete.");
  lines.push("");
  return lines.join("\n");
}

function fmtNames(names) {
  if (!names.length) return "none";
  return names.map((n) => `\`${n}\``).join(", ");
}
function fmtCounted(rows) {
  if (!rows.length) return "none";
  return rows.map((r) => `\`${r.name}\` (${r.count})`).join(", ");
}

function buildDocuments() {
  const data = mapProgram(loadSources());
  const markdown = stamp(renderMarkdown(data) + "\n");
  return { data, json: stableStringify(data), markdown };
}

function main() {
  const check = process.argv.includes("--check");
  const started = Date.now();
  const { json, markdown } = buildDocuments();
  const jsonPath = join(root, "docs", "depmap.json");
  const mdPath = join(root, "docs", "DEPMAP.md");
  if (check) {
    const sameJ = readFileSync(jsonPath, "utf8") === json;
    const sameM = readFileSync(mdPath, "utf8") === markdown;
    if (!sameJ || !sameM) {
      console.error("depmap is stale. Run npm run depmap and commit docs/depmap.json and docs/DEPMAP.md.");
      process.exit(1);
    }
    console.log(`depmap check passed (${Date.now() - started} ms).`);
    return;
  }
  writeFileSync(jsonPath, json);
  writeFileSync(mdPath, markdown);
  console.log(`Wrote docs/depmap.json and docs/DEPMAP.md (${Date.now() - started} ms).`);
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) main();
