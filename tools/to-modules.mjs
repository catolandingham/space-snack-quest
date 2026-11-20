/**
 * Turns the joined game into real modules at build time.
 * The files in src/game/ are not edited. They are still slices of one function, s8.
 * This tool reads that joined text, lifts each slice into a module, and esbuild
 * bundles the modules. The modules run in the same order, and they share one object
 * (__state) so a name created in one file is the same name in the others.
 *
 * Function declarations are installed before any other line, matching the way one
 * function hoists them. A `let` read before its line is a throw in the old program
 * and `undefined` here. The dependency map found no such read at start-up.
 */
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
import generateModule from "@babel/generator";
import * as t from "@babel/types";
import { build } from "esbuild";

const traverse = traverseModule.default || traverseModule;
const generate = generateModule.default || generateModule;

function gen(node) {
  return generate(node, { comments: false, compact: false, jsescOption: { minimal: true } }).code;
}

function member(name) {
  return t.memberExpression(t.identifier("__state"), t.identifier(name));
}

function isFunctionPath(path) {
  return path.isFunctionDeclaration() || path.isFunctionExpression() || path.isArrowFunctionExpression() || path.isObjectMethod() || path.isClassMethod();
}

function isDeclId(path) {
  const parent = path.parentPath;
  const key = path.parentKey;
  if ((parent.isFunctionDeclaration() || parent.isFunctionExpression() || parent.isClassDeclaration() || parent.isClassExpression()) && key === "id") return true;
  if (parent.isVariableDeclarator() && key === "id") return true;
  if (parent.isCatchClause() && key === "param") return true;
  if (parent.isRestElement()) return isDeclId(parent);
  if (isFunctionPath(parent) && key === "params") return true;
  let child = path;
  let p = parent;
  let sawPattern = false;
  while (p && (p.isArrayPattern() || p.isObjectPattern() || p.isObjectProperty() || p.isRestElement() || p.isAssignmentPattern())) {
    if (p.isAssignmentPattern() && child.parentKey === "right") return false;
    if (p.isObjectProperty() && child.parentKey === "key" && !p.node.computed) return false;
    sawPattern = true;
    child = p;
    p = p.parentPath;
  }
  if (!sawPattern || !p) return false;
  if (p.isVariableDeclarator() && child.parentKey === "id") return true;
  if (p.isCatchClause() && (child.parentKey === "param" || p.node.param === child.node)) return true;
  if (isFunctionPath(p) && (p.node.params || []).includes(child.node)) return true;
  return false;
}

function rewriteKind(path, s8Scope) {
  if (!path.isIdentifier()) return null;
  const parent = path.parentPath;
  const key = path.parentKey;
  if ((parent.isMemberExpression() || parent.isOptionalMemberExpression()) && key === "property" && !parent.node.computed) return null;
  if ((parent.isObjectProperty() || parent.isObjectMethod() || parent.isClassMethod() || parent.isClassProperty()) && key === "key" && !parent.node.computed) return null;
  if (parent.isLabeledStatement() || parent.isBreakStatement() || parent.isContinueStatement()) return null;
  if (isDeclId(path)) return null;
  const binding = path.scope.getBinding(path.node.name);
  if (!binding) return null;
  if (binding.scope === s8Scope) return "state";
  let scope = s8Scope.parent;
  while (scope) {
    if (binding.scope === scope) return "outer";
    scope = scope.parent;
  }
  return null;
}

function rewriteInside(path, s8Scope, outers) {
  if (!path || !path.node) return;
  const visit = (p) => {
    const kind = rewriteKind(p, s8Scope);
    if (!kind) return;
    if (kind === "outer") outers.add(p.node.name);
    const prop = p.parentPath;
    if (prop.isObjectProperty() && p.parentKey === "value" && prop.node.shorthand) prop.node.shorthand = false;
    p.replaceWith(member(p.node.name));
    p.skip();
  };
  if (path.isIdentifier()) {
    visit(path);
    return;
  }
  path.traverse({
    Identifier(p) {
      visit(p);
    },
  });
}

function fileOf(files, offset) {
  let ans = files[0];
  for (const file of files) if (file.start <= offset) ans = file;
  return ans;
}

/**
 * @param {string} program joined source, vendor first
 * @param {{ rel: string, text: string, start: number }[]} files
 * @returns {Promise<string>} the script to drop into index.html
 */
export async function bundleProgram(program, files) {
  const ast = parse(program, { sourceType: "script" });
  let s8 = null;
  traverse(ast, {
    FunctionDeclaration(path) {
      if (path.node.id && path.node.id.name === "s8") s8 = path;
    },
  });
  if (!s8) throw new Error("the joined program has no function s8");
  const s8Scope = s8.scope;
  if (s8Scope.hasBinding("__state")) throw new Error("s8 already has a binding named __state");

  const outers = new Set();
  const groups = new Map();
  const order = [];
  function group(rel) {
    let g = groups.get(rel);
    if (!g) {
      g = { rel, declare: [], run: [] };
      groups.set(rel, g);
      order.push(rel);
    }
    return g;
  }

  for (const stmt of s8.get("body").get("body")) {
    const file = fileOf(files, stmt.node.start);
    if (!file.rel.startsWith("src/game/")) throw new Error("an s8 statement starts outside src/game: " + file.rel);
    const g = group(file.rel);
    if (stmt.isFunctionDeclaration()) {
      rewriteInside(stmt, s8Scope, outers);
      const fn = stmt.node;
      const expr = t.functionExpression(fn.id, fn.params, fn.body, fn.generator, fn.async);
      g.declare.push(gen(t.expressionStatement(t.assignmentExpression("=", member(fn.id.name), expr))));
      continue;
    }
    if (stmt.isVariableDeclaration()) {
      for (const decl of stmt.get("declarations")) {
        if (!decl.get("id").isIdentifier()) throw new Error("s8 has a top-level destructure at " + decl.node.start);
        if (decl.node.init) rewriteInside(decl.get("init"), s8Scope, outers);
        const init = decl.node.init || t.unaryExpression("void", t.numericLiteral(0));
        g.run.push(gen(t.expressionStatement(t.assignmentExpression("=", member(decl.node.id.name), init))));
      }
      continue;
    }
    if (stmt.isReturnStatement()) {
      if (stmt.node.argument) rewriteInside(stmt.get("argument"), s8Scope, outers);
      const arg = stmt.node.argument || t.unaryExpression("void", t.numericLiteral(0));
      g.run.push(gen(t.returnStatement(t.objectExpression([t.objectProperty(t.identifier("__ssqReturn"), arg)]))));
      continue;
    }
    rewriteInside(stmt, s8Scope, outers);
    g.run.push(gen(stmt.node));
  }

  const dir = mkdtempSync(join(tmpdir(), "ssq-mod-"));
  try {
    const parts = [];
    order.forEach((rel, i) => {
      const g = groups.get(rel);
      const name = `part-${i}.js`;
      parts.push(name);
      const body = `export function declare(__state) {\n${g.declare.join("\n")}\n}\nexport function run(__state) {\n${g.run.join("\n")}\n}\n`;
      writeFileSync(join(dir, name), body);
    });
    const entry = parts.map((name, i) => `import * as p${i} from "./${name}";`).join("\n") +
      `\nconst parts = [${parts.map((_, i) => `p${i}`).join(", ")}];\n` +
      `export function boot(__state) {\n  for (const p of parts) p.declare(__state);\n  for (const p of parts) {\n    const r = p.run(__state);\n    if (r && Object.prototype.hasOwnProperty.call(r, "__ssqReturn")) return r.__ssqReturn;\n  }\n}\n`;
    writeFileSync(join(dir, "entry.js"), entry);

    const params = s8.node.params.map((p) => p.name);
    const lives = [...outers].sort().map((name) => `Object.defineProperty(__state, ${JSON.stringify(name)}, { get() { return ${name}; }, set(v) { ${name} = v; }, enumerable: true, configurable: true });`);
    const init = params.map((name) => `__state.${name} = ${name};`).join("\n");
    const body = `\nconst __state = {};\n${init}\n${lives.join("\n")}\nreturn boot(__state);\n`;
    const shell = `import { boot } from "./entry.js";\n` + program.slice(0, s8.node.body.start + 1) + body + program.slice(s8.node.body.end - 1);
    writeFileSync(join(dir, "shell.js"), shell);

    const result = await build({
      entryPoints: [join(dir, "shell.js")],
      bundle: true,
      format: "iife",
      platform: "browser",
      minifyWhitespace: true,
      minifySyntax: true,
      legalComments: "inline",
      write: false,
      logLevel: "silent",
    });
    return result.outputFiles[0].text;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
