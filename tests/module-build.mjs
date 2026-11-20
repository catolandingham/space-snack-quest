/**
 * The module build plays a tiny copy of the game the same way the old joined program does.
 *   node tests/module-build.mjs
 */
import vm from "node:vm";
import { transform } from "esbuild";
import { ESBUILD_OPTIONS } from "../tools/build.mjs";
import { bundleProgram } from "../tools/to-modules.mjs";

let failed = 0;
function check(name, ok, detail) {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}`);
  if (!ok) {
    failed++;
    console.log(typeof detail === "string" ? detail : JSON.stringify(detail));
  }
}

function filesFrom(parts) {
  let at = 0;
  return parts.map((p) => {
    const rec = { rel: p.rel, text: p.text, start: at };
    at += p.text.length;
    return rec;
  });
}

async function both(parts) {
  const files = filesFrom(parts);
  const program = files.map((f) => f.text).join("");
  const oldCode = (await transform(program, ESBUILD_OPTIONS)).code;
  const neu = await bundleProgram(program, files);
  const run = (code, label) => {
    const sandbox = { Math, Object, JSON, Array, Number, String, Boolean, Error, TypeError, RegExp, performance: { now: () => 0 } };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    try {
      vm.runInContext(code, sandbox, { timeout: 2000 });
    } catch (err) {
      throw new Error(label + ": " + err.message + "\n" + code.slice(0, 500));
    }
    return sandbox.__out;
  };
  return { old: run(oldCode, "old"), neu: run(neu, "new") };
}

const base = [
  { rel: "src/vendor-react.js", text: `"use strict";\n(() => {\nfunction Mb() { return 9; }\n` },
  {
    rel: "src/game/00-core.js",
    text: `function s8(V, t) {
  let n = { scene: "a", sq: {} };
  function helper(x) { return n.scene + x + Mb(); }
  function shadow() { let e = 1; return e; }
  function inc() { n = { scene: n.scene + "!", sq: n.sq, stars: n.stars }; return n.scene; }
  n.scene = "b";
  n.sq.x = 2;
  n.stars = (n.stars || 0) + 1;
  const only = helper(3);
  const bumped = inc();
  return { scene: n.scene, x: n.sq.x, stars: n.stars, only, bumped, shadow: shadow(), v: V, k: t.k };
}
`,
  },
  { rel: "src/game/90-input-shell.js", text: `globalThis.__out = s8("canvas", { k: 7 });\n})();\n` },
];

const got = await both(base);
check("module build matches the joined program", JSON.stringify(got.old) === JSON.stringify(got.neu), got);

const hoist = [
  { rel: "src/vendor-react.js", text: `"use strict";\n(() => {\n` },
  {
    rel: "src/game/00-core.js",
    text: `function s8(V, t) {
  function early() { return later(); }
  let n = 4;
  function later() { return n + V; }
  return early();
}
`,
  },
  { rel: "src/game/10-ch1.js", text: "" },
  { rel: "src/game/90-input-shell.js", text: `globalThis.__out = s8(5, {}); })();\n` },
];
const hoisted = await both(hoist);
check("a function can call one that is written further down", hoisted.old === 9 && hoisted.neu === 9, hoisted);

if (failed) {
  console.error(failed + " module-build checks failed");
  process.exit(1);
}
console.log("module-build checks passed");
