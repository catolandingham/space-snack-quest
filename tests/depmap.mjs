/**
 * The dependency map matches the joined game, and a small fixture locks the rules.
 *   node tests/depmap.mjs
 */
import { readFileSync } from "node:fs";
import { stamp } from "../scripts/md-section.mjs";
import { sourceFiles } from "../tools/build.mjs";
import { loadSources, mapProgram, renderMarkdown, stableStringify } from "../tools/depmap.mjs";

let failed = 0;
function check(name, ok, detail) {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}`);
  if (!ok) {
    failed++;
    if (detail !== undefined) console.log(typeof detail === "string" ? detail : JSON.stringify(detail, null, 2).slice(0, 4000));
  }
}

function prop(file, root, path) {
  return file.properties[root].find((row) => row.path === path) || { read: 0, write: 0, call: 0 };
}
function count(rows, name) {
  return rows.find((row) => row.name === name)?.count || 0;
}

const fixture = [
  { rel: "src/vendor-react.js", text: "(() => {\n" },
  {
    rel: "src/game/00-core.js",
    text: `
  let n = { scene: "a", sq: {} };
  let e = { beginPath() {}, fillStyle: "" };
  let ch2 = { phase: "" };
  let B = { camX: 0 };
  let p = { verb: "" };
  function helper(x) { return x; }
  function onlyHere() { return n.scene; }
  function shadow() { let e = { fillStyle: "" }; e.fillStyle = "nope"; }
  function take() { const { scene } = n; return scene; }
  n.scene = "b";
  n.sq.x = 2;
  n.stars += 1;
  e.fillStyle = "red";
  e.beginPath();
`,
  },
  {
    rel: "src/game/10-ch1.js",
    text: `
  function qh() { helper(n.scene); n.scene = "c"; e.beginPath(); }
  function later() { n.stars += 1; }
  function reset() { n = { scene: "z" }; }
  const ONLY10 = 1;
  qh();
  const z = n.scene;
  window.addEventListener("x", helper);
  helper?.();
`,
  },
  { rel: "src/game/90-input-shell.js", text: "})();\n" },
];

const mapped = mapProgram(fixture);
const core = mapped.files.find((f) => f.file === "src/game/00-core.js");
const ch1 = mapped.files.find((f) => f.file === "src/game/10-ch1.js");

check("fixture defines the shared functions and variables", core.defines.functions.join() === ["helper", "onlyHere", "shadow", "take"].join() && core.defines.variables.join() === ["B", "ch2", "e", "n", "p"].join() && ch1.defines.functions.join() === ["later", "qh", "reset"].join() && ch1.defines.variables.join() === ["ONLY10", "z"].join(), { core: core.defines, ch1: ch1.defines });

check("fixture counts reads and writes of n and e", count(core.reads, "n") === 5 && count(core.writes, "n") === 0 && count(core.reads, "e") === 2 && count(ch1.reads, "n") === 4 && count(ch1.writes, "n") === 1 && count(ch1.reads, "helper") === 3 && count(ch1.reads, "e") === 1, {
  coreN: count(core.reads, "n"),
  ch1Nread: count(ch1.reads, "n"),
  ch1Nwrite: count(ch1.writes, "n"),
  helper: count(ch1.reads, "helper"),
  coreReads: core.reads,
  ch1Reads: ch1.reads,
  ch1Writes: ch1.writes,
});

const scene0 = prop(core, "n", "scene");
const stars0 = prop(core, "n", "stars");
const sq0 = prop(core, "n", "sq");
const sqx0 = prop(core, "n", "sq.x");
const fill0 = prop(core, "e", "fillStyle");
const begin0 = prop(core, "e", "beginPath");
check(
  "fixture separates property reads, writes, and calls",
  scene0.read === 2 && scene0.write === 1 && scene0.call === 0 && stars0.read === 1 && stars0.write === 1 && sq0.read === 1 && sq0.write === 0 && sqx0.write === 1 && sqx0.read === 0 && fill0.write === 1 && fill0.read === 0 && begin0.call === 1 && begin0.read === 0,
  { scene0, stars0, sq0, sqx0, fill0, begin0, props: core.properties }
);
check("a shadowed e is not the canvas", prop(core, "e", "fillStyle").write === 1, prop(core, "e", "fillStyle"));
check("destructure reads n.scene", prop(core, "n", "scene").read === 2, prop(core, "n", "scene"));

const edge = mapped.edges.find((e) => e.name === "helper");
check("fixture cross-file call edge", !!edge && edge.from.endsWith("10-ch1.js") && edge.to.endsWith("00-core.js") && edge.count === 2 && mapped.edges.length === 1, mapped.edges);

const easy = new Set(mapped.easyWins.map((w) => w.name));
check(
  "fixture easy wins are the names one file touches",
  ["onlyHere", "shadow", "take", "ch2", "B", "p", "ONLY10", "z", "qh", "later", "reset"].every((n) => easy.has(n)) && !easy.has("helper") && !easy.has("n") && !easy.has("e"),
  [...easy]
);

const link = mapped.loadOrder.edges.find((e) => e.before.endsWith("00-core.js") && e.after.endsWith("10-ch1.js"));
check("fixture load-order link is n and e, not a hoisted function", !!link && link.names.join() === ["e", "n"].join() && mapped.loadOrder.hazards.length === 0, mapped.loadOrder);
check("fixture remembers the callback it did not enter", mapped.loadOrder.notFollowed.some((row) => row.argument === "helper" && row.callee === "window.addEventListener"), mapped.loadOrder.notFollowed);

const mini = mapProgram([
  { rel: "src/vendor-react.js", text: "(() => {\n" },
  {
    rel: "src/game/00-core.js",
    text: `let n = { scene: 1, sq: { x: 1 } }; function a() { const { scene } = n; n["sq"].x = 3; }`,
  },
  { rel: "src/game/90-input-shell.js", text: "})();\n" },
]);
const miniCore = mini.files[0];
check("computed member and destructure stay exact", prop(miniCore, "n", "scene").read === 1 && prop(miniCore, "n", "sq").read === 1 && prop(miniCore, "n", "sq.x").write === 1 && prop(miniCore, "n", "sq.x").read === 0, miniCore.properties.n);

check("the map is deterministic", stableStringify(mapProgram(fixture)) === stableStringify(mapped));

const data = mapProgram(loadSources());
const json = stableStringify(data);
const markdown = stamp(renderMarkdown(data) + "\n");
const haveJ = readFileSync(new URL("../docs/depmap.json", import.meta.url), "utf8");
const haveM = readFileSync(new URL("../docs/DEPMAP.md", import.meta.url), "utf8");
check("docs/depmap.json matches the source", haveJ === json, haveJ === json ? "" : `generated ${json.length} bytes, committed ${haveJ.length} bytes`);
check("docs/DEPMAP.md matches the source", haveM === markdown, haveM === markdown ? "" : `generated ${markdown.length} bytes, committed ${haveM.length} bytes`);

check("real map lists every fragment in build order", data.buildOrder.length === 16 && data.buildOrder.every((rel, i) => sourceFiles()[i + 1].endsWith(rel.slice("src/".length)) || sourceFiles()[i + 1].endsWith(rel)), data.buildOrder);
check("every cross-file call points at a function that file defines", data.edges.every((e) => data.files.find((f) => f.file === e.to).defines.functions.includes(e.name)), data.edges.find((e) => !data.files.find((f) => f.file === e.to).defines.functions.includes(e.name)));
check("an easy win is not a cross-file call", data.easyWins.every((w) => !data.edges.some((e) => e.name === w.name)), "overlap");
check("shared-name count matches the cross-file list", data.summary.crossFileNames === data.crossFile.length && data.summary.easyWins === data.easyWins.length && data.summary.callEdges === data.edges.length);
check(
  "fragment names are counted apart from the React runtime",
  data.summary.crossFileClosure === data.crossFile.filter((row) => row.definedIn && row.definedIn.startsWith("src/game/")).length &&
    data.summary.crossFileVendor === data.crossFile.filter((row) => row.definedIn && !row.definedIn.startsWith("src/game/")).length &&
    data.summary.crossFileGlobals === data.crossFile.filter((row) => !row.definedIn).length &&
    data.crossFile.filter((row) => row.definedIn && !row.definedIn.startsWith("src/game/")).every((row) => row.definedIn === "src/vendor-react.js")
);

if (failed) {
  console.error(failed + " depmap checks failed");
  process.exit(1);
}
console.log("depmap checks passed");
