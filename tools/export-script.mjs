/**
 * Writes docs/SCRIPT-AS-BUILT.md: every on-screen line in src/game, in play order.
 *
 *   npm run export-script
 *
 * Lines come from the source, not from playing the game. Kinds:
 *   bubble   a speech bubble (v or kV)
 *   card     a card that waits for a tap
 *   chip     the goal line, including the line that replaces it when the player is stuck
 *   prompt   a "VERB · thing" button
 *   PA       a loudspeaker or a TV
 *   caption  a sign, a flashback caption, a room-change line, or a help line
 *   banner   a big line: the title, a tank, a countdown, an award
 *   lockup   the LOCKUP card (the title, who saw him, and the restart line)
 *
 * Order: tests/routes/ch1.json and tests/routes/ch2.json, then any scene the
 * code enters between those steps. Chapters 3 and 4 have no play-through route,
 * so they follow the order the scenes hand off to each other.
 */
import { parse } from "@babel/parser";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "docs", "SCRIPT-AS-BUILT.md");

const SPEAKER_FALLBACK = {
  sq: "Squatch",
  mo: "Mops",
  mops: "Mops",
  bot: "Security",
  pa: "Station PA",
  kid: "Kid",
  exec: "Exec",
  demo: "Snack Clerk",
  scrub: "Air Scrubber",
  tourist: "Tourist",
  gary: "Gary",
  linda: "Linda",
  official: "Station Official",
  scanner: "Fur Scanner",
  gloop: "Gloop",
  cook: "Cook",
  rust: "Rusty",
  blorp: "Blorp",
  tv: "Diner TV",
  bot2: "Pump Bot",
  zip: "Zip",
  rover: "Rover",
  rover2: "Rover",
  pbot: "Port Bot",
  mom: "Mom",
  dad: "Dad",
  ctl: "You",
};

const PANEL_FNS = new Set(["gq", "n5", "$A", "p6", "v2"]);

function loadSource() {
  const files = readdirSync(join(root, "src", "game"))
    .filter((f) => f.endsWith(".js"))
    .sort();
  let src = "(() => {\n";
  const ranges = [];
  for (const file of files) {
    const text = readFileSync(join(root, "src", "game", file), "utf8");
    const start = src.split("\n").length;
    src += text.endsWith("\n") ? text : text + "\n";
    const end = src.split("\n").length - 1;
    ranges.push({ file, start, end });
  }
  return { src, ranges };
}

function locate(ranges, line) {
  const r = ranges.find((x) => line >= x.start && line <= x.end);
  if (!r) return { file: "?", line };
  return { file: r.file, line: line - r.start + 1 };
}

function chapterOfFile(file) {
  if (file.startsWith("10-") || file.startsWith("11-") || file.startsWith("50-")) return 1;
  if (file.startsWith("20-")) return 2;
  if (file.startsWith("30-")) return 3;
  if (file.startsWith("40-")) return 4;
  return 0;
}

function chapterOfScene(scene) {
  if (!scene) return 0;
  const c = scene[0];
  if (c === "O" || c === "S") return 1;
  if (c === "G") return 2;
  if (c === "P") return 3;
  if (c === "M") return 4;
  if (scene === "title") return 0;
  return 0;
}

function isPlayerText(s) {
  if (typeof s !== "string") return false;
  const t = s.trim();
  if (t.length < 2 || t.length > 220) return false;
  if (/^#[0-9a-f]{3,8}$/i.test(t)) return false;
  if (/rgba?\(|\bpx\b|stroke|fill=|data:|function\s*\(/i.test(t)) return false;
  if (!/[A-Za-z]/.test(t) && !(/\d/.test(t) && /\s/.test(t))) return false;
  if (!/\s/.test(t) && t.length > 28) return false;
  return true;
}

function sceneFromSpotFn(name) {
  const m = /^([osgpm])(\d+)([a-zA-Z]*)Spots$/.exec(name || "");
  if (!m) return "";
  const letter = { o: "O", s: "S", g: "G", p: "P", m: "M" }[m[1]];
  const suffix = m[3] === "l" ? "L" : m[3];
  return letter + m[2] + suffix;
}

function fnName(node) {
  if (!node) return "";
  if (node.type === "Identifier") return node.name;
  if (node.id && node.id.type === "Identifier") return node.id.name;
  return "";
}

function isSceneMember(node) {
  return (
    node &&
    node.type === "MemberExpression" &&
    !node.computed &&
    node.object.type === "Identifier" &&
    node.object.name === "n" &&
    node.property.type === "Identifier" &&
    node.property.name === "scene"
  );
}

function isPhaseMember(node) {
  if (!node || node.type !== "MemberExpression" || node.computed) return "";
  const o = node.object.type === "Identifier" ? node.object.name : "";
  const p = node.property.type === "Identifier" ? node.property.name : "";
  if ((o === "ch2" || o === "Q" || o === "H") && p === "phase") return o;
  return "";
}

function stringLiteral(node) {
  if (!node) return null;
  if (node.type === "StringLiteral") return node.value;
  if (node.type === "TemplateLiteral" && node.expressions.length === 0) return node.quasis[0].value.cooked;
  return null;
}

function collectStrings(node, env) {
  if (!node) return [];
  const lit = stringLiteral(node);
  if (lit != null) return [lit];
  if (node.type === "Identifier" && env && Object.prototype.hasOwnProperty.call(env, node.name)) {
    const v = env[node.name];
    return typeof v === "string" ? [v] : [];
  }
  if (node.type === "ConditionalExpression") {
    const test = evalBool(node.test, env);
    if (test === true) return collectStrings(node.consequent, env);
    if (test === false) return collectStrings(node.alternate, env);
    return [...collectStrings(node.consequent, env), ...collectStrings(node.alternate, env)];
  }
  if (node.type === "BinaryExpression" && node.operator === "+") {
    const l = collectStrings(node.left, env);
    const r = collectStrings(node.right, env);
    if (l.length && r.length) return l.flatMap((a) => r.map((b) => a + b));
    if (l.length && node.left.type === "StringLiteral" && /CHAPTER /.test(l[0])) return ["CHAPTER 1", "CHAPTER 2", "CHAPTER 3", "CHAPTER 4"];
    if (l.length) return l.map((a) => a.replace(/\s+$/, "") + "…");
    if (r.length) return r.map((a) => "…" + a);
    return [];
  }
  if (node.type === "TemplateLiteral") {
    let parts = [""];
    for (let i = 0; i < node.quasis.length; i++) {
      const bit = node.quasis[i].value.cooked;
      parts = parts.map((p) => p + bit);
      if (i < node.expressions.length) {
        const ex = collectStrings(node.expressions[i], env);
        parts = ex.length ? parts.flatMap((p) => ex.map((e) => p + e)) : parts.map((p) => p + "…");
      }
    }
    return parts;
  }
  return [];
}

function evalBool(node, env) {
  if (!node) return null;
  if (node.type === "BooleanLiteral") return node.value;
  if (node.type === "UnaryExpression" && node.operator === "!") {
    const v = evalBool(node.argument, env);
    return v == null ? null : !v;
  }
  if (node.type === "BinaryExpression" && (node.operator === "===" || node.operator === "==")) {
    const l = collectStrings(node.left, env);
    const r = collectStrings(node.right, env);
    if (l.length === 1 && r.length === 1) return l[0] === r[0];
  }
  return null;
}

function zipPair(whoNode, textNode, env) {
  if (whoNode && textNode && whoNode.type === "ConditionalExpression" && textNode.type === "ConditionalExpression") {
    return [
      ...zipPair(whoNode.consequent, textNode.consequent, env),
      ...zipPair(whoNode.alternate, textNode.alternate, env),
    ];
  }
  const whos = collectStrings(whoNode, env);
  const texts = collectStrings(textNode, env);
  if (!texts.length) return [];
  const w = whos.length ? whos : [""];
  if (w.length === texts.length) return w.map((who, i) => ({ who, text: texts[i] }));
  if (w.length === 1) return texts.map((text) => ({ who: w[0], text }));
  return w.flatMap((who) => texts.map((text) => ({ who, text })));
}

function phasesIn(node, locals) {
  const found = [];
  const seen = new Set();
  function rec(n, depth) {
    if (!n || depth > 8 || seen.has(n)) return;
    if (n.type === "Identifier" && locals && locals.has(n.name)) {
      seen.add(n);
      rec(locals.get(n.name), depth + 1);
      return;
    }
    if (n.type === "BinaryExpression" && (n.operator === "===" || n.operator === "==")) {
      const s = stringLiteral(n.left) || stringLiteral(n.right);
      if (s && /^(g|p|m|wash|back|diner|kitchen|O|S)/.test(s)) found.push(s);
    }
    if (n.type === "MemberExpression" && isSceneMember(n)) return;
    for (const k of ["left", "right", "consequent", "alternate", "argument", "object", "property"]) {
      if (n[k]) rec(n[k], depth + 1);
    }
    if (n.expressions) n.expressions.forEach((e) => rec(e, depth + 1));
  }
  rec(node, 0);
  return [...new Set(found)];
}

function scenesInTest(node) {
  const out = [];
  function rec(n) {
    if (!n) return;
    if (n.type === "BinaryExpression" && (n.operator === "===" || n.operator === "==")) {
      if (isSceneMember(n.left) && stringLiteral(n.right)) out.push(stringLiteral(n.right));
      if (isSceneMember(n.right) && stringLiteral(n.left)) out.push(stringLiteral(n.left));
    }
    if (n.type === "LogicalExpression") {
      rec(n.left);
      rec(n.right);
    }
  }
  rec(node);
  return [...new Set(out)];
}

function panelIdsInTest(node) {
  const out = [];
  function rec(n) {
    if (!n) return;
    if (n.type === "BinaryExpression" && (n.operator === "===" || n.operator === "==")) {
      const id = n.left.type === "Identifier" ? n.left.name : n.right.type === "Identifier" ? n.right.name : "";
      const s = stringLiteral(n.left) || stringLiteral(n.right);
      if (s && (id === "l" || id === "id")) out.push(s);
    }
    if (n.type === "LogicalExpression") {
      rec(n.left);
      rec(n.right);
    }
  }
  rec(node);
  return [...new Set(out)];
}

function lastSceneAssign(node) {
  let last = "";
  function rec(n) {
    if (!n || typeof n !== "object") return;
    if (n.type === "AssignmentExpression" && isSceneMember(n.left)) {
      const s = stringLiteral(n.right);
      if (s) last = s;
      else if (n.right.type === "ConditionalExpression") {
        const a = stringLiteral(n.right.consequent);
        const b = stringLiteral(n.right.alternate);
        if (b) last = b;
        if (a) last = a;
      }
    }
    for (const k of Object.keys(n)) {
      if (k === "loc" || k === "range" || k === "leadingComments" || k === "trailingComments") continue;
      const v = n[k];
      if (Array.isArray(v)) v.forEach(rec);
      else if (v && typeof v === "object" && v.type) rec(v);
    }
  }
  rec(node);
  return last;
}

function prop(obj, name) {
  if (!obj || obj.type !== "ObjectExpression") return null;
  for (const p of obj.properties) {
    if (p.type !== "ObjectProperty") continue;
    const key = p.key.type === "Identifier" ? p.key.name : stringLiteral(p.key);
    if (key === name) return p.value;
  }
  return null;
}

function staticObject(node) {
  if (!node || node.type !== "ObjectExpression") return null;
  const o = {};
  for (const p of node.properties) {
    if (p.type !== "ObjectProperty" || p.computed) return null;
    const key = p.key.type === "Identifier" ? p.key.name : stringLiteral(p.key);
    if (key == null) return null;
    const s = stringLiteral(p.value);
    if (s == null) {
      const inner = staticObject(p.value);
      if (!inner) return null;
      o[key] = inner;
    } else o[key] = s;
  }
  return o;
}

function looksLikeCodeKey(s) {
  return /^[a-z][a-z0-9:-]{0,24}$/.test(s) && !s.includes(" ");
}

const PHASE_SCENE = {
  g1: "G1",
  g1door: "G1",
  back: "G2b",
  g2: "G2",
  wash1: "G2k",
  wash5: "G5k",
  g3: "G3",
  g3hide: "G3",
  g3h: "G3",
  g4: "G4",
  g4k: "G4",
  g4l: "G4",
  g6: "G6",
  g6d: "G6",
  p1: "P1",
  p2: "P2",
  p3: "P3",
  p3x: "P3",
  p4a: "P4",
  p4b: "P4",
  m1: "M1",
  m2: "M2",
  m2h: "M2",
  m3: "M3",
  m4a: "M4",
  m4b: "M4",
  m4: "M4",
  m4v: "M4v",
  m5: "M5",
  m5d: "M5",
};

function checkpointPhase(phase) {
  return PHASE_SCENE[phase] || "";
}

function captureChapter(key) {
  if (/^(lobby|deck|vent$|s6|hall|lure9|lure11)/.test(key)) return 1;
  if (/^(pump|diner|blorp|sink|rust|lure$|bots3)/.test(key)) return 2;
  if (/^(rover|lure3)/.test(key)) return 3;
  if (/^(light4|gate4)/.test(key)) return 4;
  return 0;
}

export function extractScript() {
  const { src, ranges } = loadSource();
  const ast = parse(src, { sourceType: "script", plugins: ["jsx"], errorRecovery: false });
  const lines = [];
  const panelLines = new Map();
  const panelFns = new Map();
  const calls = [];
  const funcScene = new Map();
  const follows = new Map();
  const phaseAt = [];
  const sceneOrderSeen = [];
  const unresolved = [];
  const funcParams = new Map();
  let seq = 0;
  const speakers = { ...SPEAKER_FALLBACK };
  const bindings = new Map();

  function addFollow(from, to) {
    if (!from || !to || from === to) return;
    if (!follows.has(from)) follows.set(from, []);
    const list = follows.get(from);
    if (!list.includes(to)) list.push(to);
  }

  function noteScene(scene, state) {
    if (!scene) return;
    if (!sceneOrderSeen.includes(scene)) sceneOrderSeen.push(scene);
    if (state.func && !funcScene.has(state.func)) funcScene.set(state.func, scene);
    if (state.scene && state.scene !== scene) addFollow(state.scene, scene);
  }

  function pushLine(state, item) {
    const at = locate(ranges, state.loc || item.loc || 1);
    const scene = item.scene || state.scene || sceneFromSpotFn(state.func) || "";
    lines.push({
      seq: seq++,
      who: item.who || "",
      line: item.line,
      kind: item.kind,
      scene,
      phaseHint: item.phaseHint || state.captureKey || "",
      chapter: item.chapter || state.chapter || chapterOfScene(scene) || chapterOfFile(at.file),
      file: at.file,
      loc: at.line,
      func: state.func || "",
      panels: item.panels || null,
    });
  }

  function speakerName(code) {
    if (!code) return "";
    if (code === "mo") return "Mops";
    if (code === "sq") return "Squatch";
    return speakers[code] || code;
  }

  function addSpeech(state, pairs, styleNode, env) {
    const styles = collectStrings(styleNode, env);
    const style = styles[0] || "say";
    for (const pair of pairs) {
      if (pair.text !== "..." && !isPlayerText(pair.text)) {
        unresolved.push({ file: locate(ranges, state.loc).file, line: locate(ranges, state.loc).line, why: "speech was not a fixed line" });
        continue;
      }
      const who = pair.who;
      const kind = style === "pa" || who === "pa" || who === "tv" ? "PA" : "bubble";
      pushLine(state, { who: speakerName(who) || "Someone", line: pair.text, kind });
    }
  }

  function addPrompt(state, obj, env) {
    const verbNode = prop(obj, "verb");
    const capNode = prop(obj, "cap");
    const whoNode = prop(obj, "who");
    const whenNode = prop(obj, "when");
    if (!verbNode) return;
    const verbs = collectStrings(verbNode, env);
    const caps = capNode ? collectStrings(capNode, env) : [""];
    let pairs = [];
    if (verbNode.type === "ConditionalExpression" && capNode && capNode.type === "ConditionalExpression") {
      const zip = (a, b) => {
        if (a.type === "ConditionalExpression" && b.type === "ConditionalExpression") return [...zip(a.consequent, b.consequent), ...zip(a.alternate, b.alternate)];
        return collectStrings(a, env).flatMap((v) => collectStrings(b, env).map((c) => ({ verb: v, cap: c })));
      };
      pairs = zip(verbNode, capNode);
    } else if (verbs.length && (caps.length || !capNode)) {
      const cs = caps.length ? caps : [""];
      pairs = verbs.flatMap((v) => cs.map((c) => ({ verb: v, cap: c })));
    }
    const whos = whoNode ? collectStrings(whoNode, env) : [];
    const who = speakerName(whos[0] || "");
    const phases = whenNode ? phasesIn(whenNode, state.locals) : [];
    const phaseHint = phases.find((p) => /^(g\d|g6d|p\d|m\d|wash|back)/.test(p)) || "";
    const sceneHint = phases.find((p) => /^(O|S|G|P|M)/.test(p)) || "";
    if (!pairs.length) {
      unresolved.push({ file: locate(ranges, obj.loc.start.line).file, line: locate(ranges, obj.loc.start.line).line, why: "a button label was not a fixed line" });
      return;
    }
    for (const pair of pairs) {
      const thing = pair.cap ? `${pair.verb} · ${pair.cap}` : pair.verb;
      if (!isPlayerText(thing) && !pair.verb) continue;
      pushLine(state, {
        who: who || "You",
        line: thing,
        kind: "prompt",
        scene: sceneHint,
        phaseHint,
      });
    }
  }

  function walk(node, state) {
    if (!node || typeof node !== "object" || !node.type) return;
    const here = { ...state, loc: node.loc ? node.loc.start.line : state.loc };

    if (node.type === "FunctionDeclaration" || node.type === "FunctionExpression" || node.type === "ArrowFunctionExpression") {
      const name = fnName(node) || here.pendingName || "";
      const params = (node.params || []).map((p) => (p.type === "Identifier" ? p.name : "")).filter(Boolean);
      if (name) funcParams.set(name, params);
      const namedScene = sceneFromSpotFn(name);
      const child = {
        ...here,
        func: name || here.func,
        scene: namedScene || (name === "up" ? "title" : here.scene),
        locals: new Map(here.locals || []),
        panels: here.panels,
        pendingName: "",
      };
      if (name && panelFns.has(name)) child.panels = panelFns.get(name);
      if (node.body.type === "BlockStatement") walk(node.body, child);
      else walk(node.body, child);
      return;
    }

    if (node.type === "VariableDeclarator" && node.id.type === "Identifier") {
      const obj = staticObject(node.init);
      if (obj && node.id.name === "pa") Object.assign(speakers, obj);
      else if (obj) bindings.set(node.id.name, obj);
      if (node.init && (node.init.type === "ObjectExpression" || node.init.type === "ArrayExpression" || node.init.type === "FunctionExpression" || node.init.type === "ArrowFunctionExpression")) {
        walk({ ...node.init, pendingHold: node.id.name }, { ...here, pendingName: node.id.name });
        return;
      }
      if (node.init) walk(node.init, { ...here, pendingName: node.id.name });
      return;
    }

    if (node.type === "AssignmentExpression") {
      if (isSceneMember(node.left)) {
        const strings = collectStrings(node.right, null);
        for (const s of strings) noteScene(s, here);
        if (strings[0]) {
          state.scene = strings[0];
          here.scene = strings[0];
        }
      }
      const phaseObj = isPhaseMember(node.left);
      if (phaseObj && stringLiteral(node.right)) {
        phaseAt.push({ phase: stringLiteral(node.right), scene: here.scene || "", func: here.func || "" });
      }
      if (node.left.type === "Identifier") {
        walk(node.right, { ...here, pendingName: node.left.name });
        return;
      }
      if (isSceneMember(node.left) && node.right.type === "ConditionalExpression") {
        walk(node.right.consequent, { ...here, scene: stringLiteral(node.right.consequent) || here.scene });
        walk(node.right.alternate, { ...here, scene: stringLiteral(node.right.alternate) || here.scene });
        return;
      }
      walk(node.left, here);
      walk(node.right, here);
      return;
    }

    if (node.type === "VariableDeclaration") {
      if (!state.locals) state.locals = new Map();
      for (const d of node.declarations) {
        if (d.id.type === "Identifier" && d.init) state.locals.set(d.id.name, d.init);
      }
      here.locals = state.locals;
      for (const d of node.declarations) walk(d, state);
      return;
    }

    if (node.type === "LogicalExpression" && node.operator === "&&" && node.left.type === "BinaryExpression") {
      const left = node.left;
      const guard = left.left.type === "Identifier" && left.left.name === "l" ? stringLiteral(left.right) : "";
      const sceneFor = { crack: "O3", note: "O8", gbox: "O9" };
      if (guard && sceneFor[guard]) {
        walk(node.right, { ...state, scene: sceneFor[guard], loc: here.loc });
        return;
      }
    }

    if (node.type === "IfStatement") {
      const scenes = scenesInTest(node.test);
      const panels = panelIdsInTest(node.test);
      const usePanels = panels.length && (PANEL_FNS.has(here.func) || (here.panels && here.panels.length));
      const cons = { ...here };
      if (scenes.length === 1 && !here.scene) cons.scene = scenes[0];
      if (scenes.length > 1 && !here.scene) {
        for (const s of scenes) walk(node.consequent, { ...here, scene: s });
        if (node.alternate) walk(node.alternate, here);
        return;
      }
      if (usePanels) cons.panels = panels;
      const phases = phasesIn(node.test, here.locals);
      if (phases.length === 1 && !cons.scene) cons.phaseHint = phases[0];
      walk(node.test, here);
      walk(node.consequent, cons);
      if (node.alternate) walk(node.alternate, here);
      return;
    }

    if (node.type === "CallExpression") {
      const name = fnName(node.callee);
      if (name && name !== here.func) {
        calls.push({ to: name, from: here.func || "", scene: here.scene || "", args: node.arguments, loc: here.loc });
        if (name === "N" && node.arguments[0] && node.arguments[0].type === "Identifier") {
          calls.push({ to: node.arguments[0].name, from: here.func || "", scene: here.scene || "", args: [], loc: here.loc });
        }
        if (here.panels && here.panels.length) {
          const prev = panelFns.get(name) || [];
          panelFns.set(name, [...new Set([...prev, ...here.panels])]);
        }
      }
      if ((name === "v" || name === "kV") && node.arguments.length >= 2) {
        let pairs = zipPair(node.arguments[0], node.arguments[1], null);
        if (!pairs.length) {
          const memberBits = (n) => {
            if (!n || n.type !== "MemberExpression" || n.computed || !n.property) return null;
            const obj = n.object.type === "MemberExpression" ? n.object.object : n.object;
            if (!obj || obj.type !== "Identifier" || !bindings.has(obj.name)) return null;
            return { table: bindings.get(obj.name), prop: n.property.name };
          };
          const a = memberBits(node.arguments[0]);
          const b = memberBits(node.arguments[1]);
          if (a && b && a.table === b.table) {
            pairs = Object.values(a.table)
              .filter((row) => row && typeof row === "object" && typeof row[b.prop] === "string")
              .map((row) => ({ who: typeof row[a.prop] === "string" ? row[a.prop] : "", text: row[b.prop] }));
          }
        }
        if (!pairs.length && name === "kh") {
          /* handled at the kh() call */
        } else if (!pairs.length) {
          unresolved.push({ file: locate(ranges, here.loc).file, line: locate(ranges, here.loc).line, why: `${name}() line is built in code` });
        } else addSpeech(here, pairs, node.arguments[2], null);
      }
      if (name === "kh" && bindings.has("Eh")) {
        const rows = bindings.get("Eh");
        if (Array.isArray(rows)) {
          for (const row of rows) {
            if (Array.isArray(row)) {
              for (const text of row) if (typeof text === "string") addSpeech(here, [{ who: "mops", text }], null, null);
            }
          }
        }
      }
      let argState = here;
      if ((name === "spot" || name === "offer") && node.arguments[0] && node.arguments[0].type === "ObjectExpression") {
        addPrompt(here, node.arguments[0], null);
        const whenNode = prop(node.arguments[0], "when");
        const phases = whenNode ? phasesIn(whenNode, here.locals) : [];
        const phaseHint = phases.find((p) => /^(g\d|p\d|m\d|wash|back)/.test(p)) || "";
        const sceneHint = phases.find((p) => /^(O|S|G|P|M)\d/.test(p)) || "";
        const scene = sceneHint || (phaseHint && checkpointPhase(phaseHint)) || here.scene;
        if (scene) argState = { ...here, scene };
        const fNode = prop(node.arguments[0], "f");
        if (fNode && fNode.type === "Identifier") {
          calls.push({ to: fNode.name, from: here.func || "", scene: (argState && argState.scene) || here.scene || "", args: [], loc: here.loc });
        }
      }
      if (name === "roomLine") {
        for (const text of collectStrings(node.arguments[0], null)) {
          if (isPlayerText(text)) pushLine(here, { who: "Room", line: text, kind: "caption" });
        }
      }
      if (name === "hudNote") {
        for (const text of collectStrings(node.arguments[0], null)) {
          if (isPlayerText(text)) pushLine(here, { who: "Banner", line: text, kind: "banner" });
        }
      }
      if (name === "teach" && stringLiteral(node.arguments[0]) && bindings.has("TEACH")) {
        const id = stringLiteral(node.arguments[0]);
        const text = bindings.get("TEACH")[id];
        if (text) pushLine(here, { who: "Card", line: text, kind: "card" });
      }
      if (name === "switchTo" && node.arguments[1] && stringLiteral(node.arguments[1]) && bindings.has("SWITCH_WHY")) {
        const why = bindings.get("SWITCH_WHY")[stringLiteral(node.arguments[1])];
        const who = stringLiteral(node.arguments[0]);
        if (why && who) {
          const nameNow = who === "mops" ? "MOPS" : "SQUATCH";
          pushLine(here, { who: "Card", line: `You are ${nameNow} now.`, kind: "card" });
          pushLine(here, { who: "Card", line: why, kind: "card" });
        }
      }
      if (name === "g" || name === "Cn") {
        const arg = name === "Cn" ? node.arguments[2] : node.arguments[0];
        const size = name === "g" && node.arguments[3] && node.arguments[3].type === "NumericLiteral" ? node.arguments[3].value : 0;
        const texts = collectStrings(arg, null).filter(isPlayerText);
        const kind = size >= 24 ? "banner" : "caption";
        for (const text of texts) {
          if (here.panels && here.panels.length) {
            for (const id of here.panels) {
              if (!panelLines.has(id)) panelLines.set(id, []);
              panelLines.get(id).push({ who: "Sign", line: text, kind, seq: seq++ });
            }
          } else {
            pushLine(here, { who: kind === "banner" ? "Banner" : "Sign", line: text, kind });
          }
        }
      }
      if (name === "capture" && node.arguments[0] && stringLiteral(node.arguments[0])) {
        /* lockup text comes from the CAPTURES table */
      }
      if (node.callee) walk(node.callee, here);
      for (const arg of node.arguments) walk(arg, argState);
      return;
    }

    if (node.type === "ObjectExpression") {
      const k = prop(node, "k");
      const kText = stringLiteral(k);
      if (kText === "card") {
        const id = stringLiteral(prop(node, "id"));
        const textNode = prop(node, "text");
        const texts = collectStrings(textNode, null);
        const byNode = prop(node, "by");
        const by = stringLiteral(byNode);
        if (id === "jail" || id === "switch" || id === "focus") {
          /* Lockup rows come from CAPTURES. Switch and zoom cards come from switchTo() and teach(). */
        } else {
          for (const text of texts.filter(isPlayerText)) pushLine(here, { who: "Card", line: text, kind: "card" });
          if (by && isPlayerText(by)) pushLine(here, { who: "Card", line: by, kind: "card" });
        }
      }
      if (kText === "fb") {
        const cap = stringLiteral(prop(node, "cap"));
        if (cap && isPlayerText(cap)) pushLine(here, { who: "Flashback", line: cap, kind: "caption" });
      }
      if (kText === "panel") {
        const id = stringLiteral(prop(node, "id"));
        if (id) pushLine(here, { who: "Sign", line: `@panel:${id}`, kind: "caption" });
      }
      const hold = node.pendingHold;
      if (hold === "XA" || here.pendingName === "XA") {
        const shouted = staticObject(node);
        const where = { gloop: "G2", blorp: "G2", zip: "P2", mom: "M2", dad: "M2" };
        if (shouted) {
          for (const [who, text] of Object.entries(shouted)) {
            pushLine(here, { who: speakerName(who), line: text, kind: "bubble", scene: where[who] || "", chapter: chapterOfScene(where[who] || "") });
          }
        }
      }
      if (hold === "CH1_CHIPS" || hold === "CH2_CHIPS" || hold === "CH3_CHIPS" || hold === "CH4_CHIPS" || hold === "METHOD_LINES" || hold === "SNEAKY_LABELS" || hold === "TEACH" || hold === "SWITCH_WHY") {
        const obj = staticObject(node);
        if (obj) bindings.set(hold, obj);
      }
      if (hold === "CAPTURES") {
        for (const p of node.properties) {
          if (p.type !== "ObjectProperty") continue;
          const key = p.key.type === "Identifier" ? p.key.name : stringLiteral(p.key);
          const cause = p.value.type === "ObjectExpression" ? stringLiteral(prop(p.value, "cause")) : "";
          if (key && cause) {
            if (!bindings.has("CAPTURE_LIST")) bindings.set("CAPTURE_LIST", []);
            bindings.get("CAPTURE_LIST").push({ key, cause });
          }
          if (key) walk(p.value, { ...here, scene: "lockup", captureKey: key, chapter: captureChapter(key) });
        }
        return;
      }
      if (hold === "Eh" && node.type === "ArrayExpression") {
        /* filled below */
      }
    }

    if (node.type === "ArrayExpression" && here.pendingName === "D0") {
      for (const el of node.elements || []) {
        const label = stringLiteral(prop(el, "name"));
        if (!label) continue;
        pushLine(here, { who: "Squatch", line: "GRAB · " + label.toLowerCase(), kind: "prompt", scene: "S12", chapter: 1 });
      }
    }

    if (node.type === "ArrayExpression" && here.pendingName === "Eh") {
      const rows = [];
      for (const el of node.elements) {
        if (el && el.type === "ArrayExpression") rows.push(el.elements.map((x) => stringLiteral(x)).filter(Boolean));
      }
      bindings.set("Eh", rows);
    }

    if (node.type === "ArrayExpression") {
      const saved = here.scene;
      for (const el of node.elements) {
        if (!el) continue;
        walk(el, here);
        const next = lastSceneAssign(el);
        if (next) {
          if (here.scene) addFollow(here.scene, next);
          here.scene = next;
        }
      }
      here.scene = saved;
      return;
    }

    if (node.type === "JSXText") {
      const t = node.value.replace(/\s+/g, " ").trim();
      if (isPlayerText(t)) pushLine(here, { who: "Sign", line: t, kind: "caption", scene: "title" });
      return;
    }

    if (node.type === "JSXExpressionContainer") {
      walk(node.expression, here);
      return;
    }

    const skip = new Set(["loc", "range", "leadingComments", "trailingComments", "innerComments"]);
    for (const k of Object.keys(node)) {
      if (skip.has(k)) continue;
      const v = node[k];
      if (Array.isArray(v)) v.forEach((child) => walk(child, here));
      else if (v && typeof v === "object" && v.type) walk(v, here);
    }
  }

  walk(ast, { scene: "", func: "", locals: new Map(), panels: null, loc: 1 });

  const phaseScene = new Map();
  for (const row of phaseAt) {
    const scene = row.scene || funcScene.get(row.func) || "";
    if (scene && !phaseScene.has(row.phase)) phaseScene.set(row.phase, scene);
  }
  function sceneOfCaller(name, seen = new Set()) {
    if (!name || seen.has(name)) return "";
    const named = sceneFromSpotFn(name);
    if (named) return named;
    if (funcScene.has(name)) return funcScene.get(name);
    seen.add(name);
    const scenes = new Set();
    for (const c of calls) {
      if (c.to !== name) continue;
      const s = c.scene || (c.from && !seen.has(c.from) ? sceneOfCaller(c.from, seen) : "");
      if (s) scenes.add(s);
    }
    return scenes.size === 1 ? [...scenes][0] : "";
  }
  for (const c of calls) {
    const toScene = funcScene.get(c.to);
    if (!toScene) continue;
    const fromScene = c.scene || sceneOfCaller(c.from);
    if (fromScene && fromScene !== toScene) addFollow(fromScene, toScene);
  }
  for (const [phase, scene] of Object.entries(PHASE_SCENE)) {
    if (!phaseScene.has(phase)) phaseScene.set(phase, scene);
  }
  // A panel's words are drawn in a helper. The call that opens the panel is often
  // later in the file than the helper, so move those signs onto the panel now.
  for (const line of lines) {
    const ids = panelFns.get(line.func);
    if (!ids || !ids.length) continue;
    if (line.kind !== "caption" && line.kind !== "banner") continue;
    if (line.who !== "Sign" && line.who !== "Banner") continue;
    for (const id of ids) {
      if (!panelLines.has(id)) panelLines.set(id, []);
      panelLines.get(id).push({ ...line });
    }
    line.line = "@moved";
  }

  function sceneForPhaseKey(key) {
    const base = String(key).split(":")[0];
    if (phaseScene.has(base)) return phaseScene.get(base);
    if (phaseScene.has(key)) return phaseScene.get(key);
    if (/^(O|S|G|P|M)/.test(base)) return base;
    if (base === "wash") return "G2k";
    if (base === "diner" || base === "kitchen") return base === "diner" ? "G4" : "G2k";
    return "";
  }

  function sceneForSneak(key) {
    const m = /^sneak-([a-z])(\d+)$/.exec(key);
    if (!m) return "";
    return m[1].toUpperCase() + m[2];
  }

  if (bindings.has("CH1_CHIPS")) {
    for (const [key, text] of Object.entries(bindings.get("CH1_CHIPS"))) {
      const scene = key.split(":")[0];
      lines.push({ seq: seq++, who: "Goal", line: text, kind: "chip", scene, phaseHint: "", chapter: 1, file: "10-ch1.js", loc: 0, func: "CH1_CHIPS" });
    }
  }
  for (const name of ["CH2_CHIPS", "CH3_CHIPS", "CH4_CHIPS"]) {
    const table = bindings.get(name);
    if (!table) continue;
    const chapter = name === "CH2_CHIPS" ? 2 : name === "CH3_CHIPS" ? 3 : 4;
    for (const [key, text] of Object.entries(table)) {
      const scene = sceneForPhaseKey(key);
      lines.push({ seq: seq++, who: "Goal", line: text, kind: "chip", scene, phaseHint: key, chapter, file: name, loc: 0, func: name });
    }
  }
  if (bindings.has("METHOD_LINES")) {
    for (const [key, text] of Object.entries(bindings.get("METHOD_LINES"))) {
      const scene = sceneForPhaseKey(key);
      const chapter = chapterOfScene(scene) || (key.startsWith("S") ? 1 : key.startsWith("p") ? 3 : key.startsWith("m") ? 4 : 2);
      lines.push({ seq: seq++, who: "Goal", line: text, kind: "chip", scene, phaseHint: key, chapter, file: "80-hud.js", loc: 0, func: "METHOD_LINES" });
    }
  }
  if (bindings.has("SNEAKY_LABELS")) {
    for (const [key, text] of Object.entries(bindings.get("SNEAKY_LABELS"))) {
      const scene = sceneForSneak(key);
      lines.push({ seq: seq++, who: "Banner", line: text, kind: "banner", scene, phaseHint: "", chapter: chapterOfScene(scene), file: "25-capture.js", loc: 0, func: "SNEAKY_LABELS" });
    }
  }
  for (const [name, kind, who] of [
    ["NEVER_CAUGHT", "banner", "Banner"],
    ["NEVER_CAUGHT_WHY", "caption", "Banner"],
    ["NEVER_CAUGHT_TODO", "chip", "Goal"],
  ]) {
    /* filled from source strings below if present as bindings — they are consts, caught by walk if we stored them */
  }
  const captureList = bindings.get("CAPTURE_LIST") || [];
  for (const row of captureList) {
    const chapter = captureChapter(row.key);
    lines.push({ seq: seq++, who: "Lockup", line: "LOCKUP", kind: "lockup", scene: "lockup", phaseHint: row.key, chapter, file: "25-capture.js", loc: 0, func: "CAPTURES" });
    lines.push({ seq: seq++, who: "Lockup", line: row.cause, kind: "lockup", scene: "lockup", phaseHint: row.key, chapter, file: "25-capture.js", loc: 0, func: "CAPTURES" });
    lines.push({
      seq: seq++,
      who: "Lockup",
      line: "Holding pen. This part starts over.",
      kind: "lockup",
      scene: "lockup",
      phaseHint: row.key,
      chapter,
      file: "25-capture.js",
      loc: 0,
      func: "CAPTURES",
    });
  }

  // A line spoken inside a helper inherits the scene of the one place that calls it.
  const callsByTarget = new Map();
  for (const c of calls) {
    if (!callsByTarget.has(c.to)) callsByTarget.set(c.to, []);
    callsByTarget.get(c.to).push(c);
  }
  function resolvedFuncScene(name, seen = new Set()) {
    if (!name || seen.has(name)) return "";
    const fromSpot = sceneFromSpotFn(name);
    if (fromSpot) return fromSpot;
    if (name === "up") return "title";
    if (funcScene.has(name)) return funcScene.get(name);
    seen.add(name);
    const scenes = new Set();
    for (const c of callsByTarget.get(name) || []) {
      const s = c.scene || resolvedFuncScene(c.from, seen);
      if (s) scenes.add(s);
    }
    if (scenes.size === 1) return [...scenes][0];
    return "";
  }

  function scenesFor(name, seen = new Set()) {
    if (!name || name === "s8" || name === "spotsNow" || name === "pick" || seen.has(name)) return [];
    const named = sceneFromSpotFn(name);
    if (named) return [named];
    if (name === "up") return ["title"];
    if (funcScene.has(name)) return [funcScene.get(name)];
    seen.add(name);
    const scenes = new Set();
    for (const c of calls) {
      if (c.to !== name) continue;
      const direct = c.scene || (c.from && !seen.has(c.from) ? scenesFor(c.from, seen)[0] : "");
      if (direct) scenes.add(direct);
      else if (c.from) for (const s of scenesFor(c.from, seen)) scenes.add(s);
    }
    return [...scenes];
  }
  const extra = [];
  for (const line of lines) {
    if (!line.scene && line.phaseHint) {
      const s = sceneForPhaseKey(line.phaseHint);
      if (s) line.scene = s;
    }
    if (!line.scene && line.func) {
      const scenes = scenesFor(line.func);
      const fan = line.kind === "bubble" || line.kind === "prompt" || line.kind === "card" || line.kind === "PA";
      if (scenes.length === 1) line.scene = scenes[0];
      else if (fan && scenes.length > 1 && scenes.length <= 4) {
        line.scene = scenes[0];
        for (const s of scenes.slice(1)) extra.push({ ...line, scene: s, seq: seq++ });
      }
    }
    if (line.scene) line.chapter = chapterOfScene(line.scene) || line.chapter;
    if (line.line === "TANK EMPTY" || line.line === "TANK FULL") {
      line.chapter = 2;
      line.scene = line.scene || "G1";
    }
    if (line.line === "HIDE!" || /^HIDE! \d/.test(line.line) || line.line === "HIDE! …") {
      line.chapter = 2;
      line.scene = line.scene || "G3";
      line.kind = "banner";
      line.who = "Banner";
    }
  }
  for (const line of extra) {
    line.chapter = chapterOfScene(line.scene) || line.chapter;
    lines.push(line);
  }

  // Known fixed banners and help, if the walk saw the string as a g() or JSX already they are in `lines`.
  // Pull a few consts the walk does not classify on its own.
  function addConst(line, kind, who, chapter, scene) {
    if (lines.some((x) => x.line === line && x.kind === kind && x.scene === scene)) return;
    lines.push({ seq: seq++, who, line, kind, scene, phaseHint: "", chapter, file: "", loc: 0, func: "" });
  }
  const raw = src;
  const grab = (re) => {
    const m = raw.match(re);
    if (!m) return "";
    return m[1]
      .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
      .replace(/\\x([0-9a-fA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
  };
  const never = grab(/NEVER_CAUGHT = "([^"]+)"/);
  const neverWhy = grab(/NEVER_CAUGHT_WHY = "([^"]+)"/);
  const neverTodo = grab(/NEVER_CAUGHT_TODO = "([^"]+)"/);
  const keyHelp = grab(/KEY_HELP = "([^"]+)"/);
  const touchHelp = grab(/TOUCH_HELP = "([^"]+)"/);
  const secret = grab(/s: "(\+50 SECRET!)"/);
  const funny = grab(/s: "(\+25 FUNNY FIND!)"/);
  const starsHint = grab(/return "(\\u2605 = points for finds)"/) || "★ = points for finds";
  if (never) addConst(never, "banner", "Banner", 0, "score");
  if (neverWhy) addConst(neverWhy, "caption", "Banner", 0, "score");
  if (neverTodo) addConst(neverTodo, "chip", "Goal", 0, "score");
  if (secret) addConst(secret, "banner", "Banner", 0, "score");
  if (funny) addConst(funny, "banner", "Banner", 0, "score");
  if (starsHint) addConst(starsHint.replace("\\u2605", "★"), "caption", "Banner", 0, "score");
  if (keyHelp) addConst(keyHelp, "caption", "Help", 0, "help");
  if (touchHelp) addConst(touchHelp, "caption", "Help", 0, "help");
  if (raw.includes('"TANK EMPTY"')) addConst("TANK EMPTY", "banner", "Banner", 2, "G1");
  if (raw.includes('"TANK FULL"')) addConst("TANK FULL", "banner", "Banner", 2, "G1");

  // Title chapter names.
  const k1 = raw.match(/let K1 = \[([^\]]+)\]/);
  if (k1) {
    for (const m of k1[1].matchAll(/"([^"]+)"/g)) addConst(m[1], "caption", "Title", 0, "title");
  }

  return { lines, panelLines, follows, sceneOrderSeen, unresolved, speakers, phaseScene, funcScene, calls };
}

function routeOrder() {
  const order = { 1: [], 2: [] };
  const ch1 = JSON.parse(readFileSync(join(root, "tests", "routes", "ch1.json"), "utf8"));
  const ch2 = JSON.parse(readFileSync(join(root, "tests", "routes", "ch2.json"), "utf8"));
  const add = (ch, id) => {
    if (id && !order[ch].includes(id)) order[ch].push(id);
  };
  for (const step of ch1.steps) {
    const lead = /^(O\d+[a-z]?|S\d+[A-Za-z]*)\b/.exec(step.say || "");
    if (lead) add(1, lead[1]);
    const mid = (step.say || "").match(/\b(S\d+[A-Za-z]*|O\d+[a-z]?)\b/g) || [];
    for (const id of mid) add(1, id);
    if (step.untilScene) add(1, step.untilScene);
    if (step.next && step.next.scene) add(1, step.next.scene);
  }
  return { ch1: order[1], ch2Steps: ch2.steps };
}

function orderedScenes(extracted) {
  const { follows, sceneOrderSeen, phaseScene } = extracted;
  const { ch1, ch2Steps } = routeOrder();
  const ch2 = [];
  const add2 = (id) => {
    if (id && !ch2.includes(id)) ch2.push(id);
  };
  add2("G0");
  for (const step of ch2Steps) {
    if (step.next && step.next.phase) add2(phaseScene.get(step.next.phase) || "");
  }
  function fill(list, chapter) {
    const out = [...list];
    let guard = 0;
    while (guard++ < 40) {
      let grew = false;
      for (let i = 0; i < out.length; i++) {
        for (const next of follows.get(out[i]) || []) {
          if (chapterOfScene(next) !== chapter || out.includes(next)) continue;
          const at = out.indexOf(next);
          if (at === -1) {
            out.splice(i + 1, 0, next);
            grew = true;
          }
        }
      }
      if (!grew) break;
    }
    for (const s of sceneOrderSeen) if (chapterOfScene(s) === chapter && !out.includes(s)) out.push(s);
    return out;
  }
  function chain(start, chapter) {
    const out = [];
    const seen = new Set();
    let cur = start;
    while (cur && !seen.has(cur) && chapterOfScene(cur) === chapter) {
      seen.add(cur);
      out.push(cur);
      const nexts = (follows.get(cur) || []).filter((s) => chapterOfScene(s) === chapter && !seen.has(s));
      cur = nexts[0] || "";
    }
    for (const s of sceneOrderSeen) if (chapterOfScene(s) === chapter && !out.includes(s)) out.push(s);
    return out;
  }
  return {
    1: fill(ch1, 1),
    2: fill(ch2, 2),
    3: chain("P0", 3),
    4: chain("M0", 4),
  };
}

function esc(s) {
  return String(s).replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function dedupeKeepOrder(rows) {
  const seen = new Set();
  const out = [];
  const dups = [];
  for (const row of rows) {
    const key = `${row.who}\n${row.line}\n${row.kind}`;
    if (seen.has(key)) {
      dups.push(row);
      continue;
    }
    seen.add(key);
    out.push(row);
  }
  return { rows: out, dups };
}

function render(extracted) {
  const order = orderedScenes(extracted);
  const byScene = new Map();
  for (const line of extracted.lines) {
    if (line.line.startsWith("@panel:") || line.line === "@moved") continue;
    const key = `${line.chapter}:${line.scene || ""}`;
    if (!byScene.has(key)) byScene.set(key, []);
    byScene.get(key).push(line);
  }
  // Expand panel markers back into the scene where the panel opens, in source order.
  for (const line of extracted.lines) {
    if (!line.line.startsWith("@panel:")) continue;
    const id = line.line.slice(7);
    const caps = extracted.panelLines.get(id) || [];
    const key = `${line.chapter}:${line.scene || ""}`;
    if (!byScene.has(key)) byScene.set(key, []);
    const bucket = byScene.get(key);
    const at = bucket.findIndex((x) => x.seq > line.seq);
    const insert = caps.map((c) => ({ ...c, scene: line.scene, chapter: line.chapter }));
    if (at === -1) bucket.push(...insert);
    else bucket.splice(at, 0, ...insert);
  }

  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 0: 0 };
  const surprises = [];
  const broken = [];
  for (const line of extracted.lines) {
    if (line.line.startsWith("@panel:") || line.line === "@moved") continue;
    if (/hid—|undefined|NaN|\bnull\b|TODO|FIXME/.test(line.line) || /[“"]\s*$/.test(line.line) || line.line.trim() === "...")
      broken.push(line);
  }

  function sectionRows(chapter, scene) {
    const rows = byScene.get(`${chapter}:${scene}`) || [];
    rows.sort((a, b) => a.seq - b.seq);
    const { rows: kept, dups } = dedupeKeepOrder(rows);
    for (const d of dups) surprises.push(d);
    return kept;
  }

  function table(rows) {
    if (!rows.length) return "_No lines landed in this scene._\n";
    const body = rows.map((r) => `| ${esc(r.who)} | ${esc(r.line)} | ${r.kind} |`).join("\n");
    return `| Who | Line | Kind |\n| --- | --- | --- |\n${body}\n`;
  }

  let md = "";
  md += "# The script as it is built\n\n";
  md += "Every line the game can show, pulled from `src/game/*.js`. This file is not a new script. Nothing here changes the game.\n\n";
  md += "A row is who says it (or Card, Goal, Button's owner, Sign, Banner, Lockup, Help), the words, and the kind: bubble, card, chip, prompt, PA, caption, banner, or lockup. ";
  md += "Chapter 1 and Chapter 2 follow the play-through tests, with any scene the code steps through in between. Chapters 3 and 4 follow the order the scenes hand off. ";
  md += "The same words are listed once per scene. Buttons list each label they can show, including STOP after SING.\n\n";
  md += "Rebuild with `npm run export-script`.\n\n";

  const pieces = [];
  function addBlock(chapter, title, rows) {
    if (!rows.length) return;
    counts[chapter] += rows.length;
    pieces.push({ chapter, title, rows });
  }

  addBlock(0, "Title screen", sectionRows(0, "title").concat((byScene.get("0:") || []).filter((r) => r.scene === "title")));
  // title rows may have been stored with chapter 0 scene title, and also chapter from file.
  const titleRows = extracted.lines.filter((r) => r.scene === "title" && !r.line.startsWith("@panel:")).sort((a, b) => a.seq - b.seq);
  const helpRows = extracted.lines.filter((r) => r.scene === "help").sort((a, b) => a.seq - b.seq);
  const scoreRows = extracted.lines.filter((r) => r.scene === "score").sort((a, b) => a.seq - b.seq);

  const used = new Set();
  function take(chapter, scene) {
    used.add(`${chapter}:${scene}`);
    return sectionRows(chapter, scene);
  }

  let body = "";
  const tKept = dedupeKeepOrder(titleRows);
  const hKept = dedupeKeepOrder(helpRows);
  const sKept = dedupeKeepOrder(scoreRows);
  counts[0] += tKept.rows.length + hKept.rows.length + sKept.rows.length;
  body += "## Before the chapters\n\n";
  body += "### Title screen\n\n" + table(tKept.rows) + "\n";
  body += "### Controls\n\n" + table(hKept.rows) + "\n";
  body += "### Score, in every chapter\n\n" + table(sKept.rows) + "\n";

  const chapterName = { 1: "Chapter 1 · Stormtop", 2: "Chapter 2 · Gas stop", 3: "Chapter 3 · Phobos", 4: "Chapter 4 · Mars" };
  for (const ch of [1, 2, 3, 4]) {
    body += `## ${chapterName[ch]}\n\n`;
    for (const scene of order[ch]) {
      const rows = take(ch, scene);
      counts[ch] += rows.length;
      body += `### ${scene}\n\n` + table(rows) + "\n";
    }
    const lockup = take(ch, "lockup");
    // lockup rows were stored with scene lockup; sectionRows uses chapter from the line.
    const lockRows = (byScene.get(`${ch}:lockup`) || []).sort((a, b) => a.seq - b.seq);
    used.add(`${ch}:lockup`);
    const lockKept = dedupeKeepOrder(lockRows).rows;
    // Group lockup by phaseHint so each catch reads as its own card.
    if (lockKept.length) {
      counts[ch] += lockKept.length;
      body += `### If he is caught\n\n`;
      let current = "";
      const grouped = [];
      for (const row of lockKept) {
        if (row.phaseHint !== current) {
          current = row.phaseHint;
          grouped.push({ key: current, rows: [] });
        }
        grouped[grouped.length - 1].rows.push(row);
      }
      for (const g of grouped) {
        body += `**${g.key}**\n\n` + table(g.rows) + "\n";
      }
    }
    const loose = [];
    for (const [key, rows] of byScene) {
      if (used.has(key)) continue;
      const [c, scene] = key.split(":");
      if (Number(c) !== ch) continue;
      if (scene === "title" || scene === "help" || scene === "score" || scene === "lockup") continue;
      loose.push(...rows);
      used.add(key);
    }
    const looseKept = dedupeKeepOrder(loose.sort((a, b) => a.seq - b.seq)).rows;
    if (looseKept.length) {
      counts[ch] += looseKept.length;
      body += `### Signs and other lines\n\n` + table(looseKept) + "\n";
    }
  }

  const shared = [];
  for (const [key, rows] of byScene) {
    if (used.has(key)) continue;
    const [c, scene] = key.split(":");
    if (scene === "title" || scene === "help" || scene === "score") continue;
    if (c === "0" || !scene) shared.push(...rows);
  }
  const sharedKept = dedupeKeepOrder(shared.sort((a, b) => a.seq - b.seq)).rows.filter((r) => !r.line.startsWith("@panel:"));
  if (sharedKept.length) {
    counts[0] += sharedKept.length;
    body += "## Lines not tied to one scene\n\n" + table(sharedKept) + "\n";
  }

  const countTable =
    `| Chapter | Lines |\n| --- | --- |\n` +
    `| Chapter 1 | ${counts[1]} |\n` +
    `| Chapter 2 | ${counts[2]} |\n` +
    `| Chapter 3 | ${counts[3]} |\n` +
    `| Chapter 4 | ${counts[4]} |\n` +
    `| Title, help, score, and shared | ${counts[0]} |\n\n`;

  md += countTable + body;

  const dupInScene = [];
  for (const [key, rows] of byScene) {
    const seen = new Set();
    for (const row of rows) {
      const id = `${key}|${row.who}|${row.line}|${row.kind}`;
      if (seen.has(id)) dupInScene.push(`${key}: ${row.who}: ${row.line}`);
      seen.add(id);
    }
  }
  const odd = [];
  for (const line of extracted.lines) {
    if (line.line.startsWith("@panel:") || line.line === "@moved") continue;
    if (/hid—|undefined|TODO|FIXME/.test(line.line)) odd.push(`${line.scene || "?"} ${line.kind}: ${line.line}`);
  }
  const noThing = extracted.lines.filter((r) => r.kind === "prompt" && !r.line.includes("·"));
  md += "## What looks odd\n\n";
  md += "The exporter keeps a line it is unsure about, so you can see it. These are notes, not lines in the game.\n\n";
  if (!dupInScene.length && !odd.length && !noThing.length && !extracted.unresolved.length) md += "Nothing flagged.\n";
  if (odd.length) {
    md += "### Lines that look cut off\n\n";
    for (const o of [...new Set(odd)].slice(0, 40)) md += `- ${o}\n`;
    md += "\n";
  }
  if (dupInScene.length) {
    md += "### Repeated in the same scene\n\n";
    for (const o of [...new Set(dupInScene)].slice(0, 40)) md += `- ${o}\n`;
    md += "\n";
  }
  if (noThing.length) {
    md += "### Buttons with no thing after the dot\n\n";
    for (const o of noThing.slice(0, 20)) md += `- ${o.scene || "?"} ${o.line}\n`;
    md += "\n";
  }
  if (extracted.unresolved.length) {
    md += "### Lines the exporter could not read as fixed words\n\n";
    const uniq = [];
    const seen = new Set();
    for (const u of extracted.unresolved) {
      const id = `${u.file}:${u.line}:${u.why}`;
      if (seen.has(id)) continue;
      seen.add(id);
      uniq.push(`- ${u.file}:${u.line} ${u.why}`);
    }
    md += uniq.slice(0, 30).join("\n") + "\n";
  }

  return { md, counts, order };
}

function main() {
  const extracted = extractScript();
  const { md, counts, order } = render(extracted);
  writeFileSync(OUT, md);
  console.log(`Wrote docs/SCRIPT-AS-BUILT.md`);
  for (const ch of [1, 2, 3, 4]) console.log(`Chapter ${ch}: ${counts[ch]} lines, scenes ${order[ch].join(", ")}`);
  console.log(`Title, help, score, and shared: ${counts[0]}`);
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) main();
