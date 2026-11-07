/**
 * The ACTION button names the thing in Chapter 2 (task T11), and in Chapters 1, 3 and 4 (task T18).
 * Using the T7 hooks, sweeps Chapter 2 states and checks every action offered has a caption.
 * Then, with touch controls on a desktop window and on a 375 by 812 phone, stands the character
 * at a few actions and checks the big button reads exactly "VERB · caption" in letters at least 16 px.
 * Then sweeps every state in tests/chapter-states.mjs (all four chapters): every action offered has a
 * caption, every "VERB · thing" offered in Chapters 1, 3 and 4 is a row in
 * docs/PHASE-2-LINES-FOR-BRIAN.md, and every such row is offered somewhere (or, for the few the sweep
 * cannot reach, its verb and thing are written together in that chapter's source).
 *   node tests/action-labels.mjs
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { startGame, sleep, readLines, actionOf, root } from "./game-page.mjs";
import { STATES as ALL_STATES, setState } from "./chapter-states.mjs";

const LINES = readLines();
// Named spots: lines-file row -> the state where that action must be offered with exactly those words.
const SPOTS = {
  "11.1": "g1", "11.2": "back", "11.3": "g6 hidden at the lure crate", "11.4": "g6 singing", "11.5": "g6 Mops with coins",
  "11.6": "g4", "11.7": "g4", "11.8": "g4", "11.9": "g2", "11.10": "g4", "11.11": "g4", "11.12": "g4 with coins",
  "11.14": "wash1 while Gloop looks", "11.15": "wash1", "11.16": "wash1", "11.17": "wash1 holding a dish",
  "11.18": "the greasy pot", "11.19": "g4k with soup", "7.1": "g4k out front",
};

const g = await startGame({ port: 8787, name: "action-labels" });

// States to sweep: [label, steps]. Steps: ["set", ch2 fields], ["reset", phase], ["op", op fields], ["swap", toMops].
const STATES = [
  ...["g1", "back", "g2", "wash1", "g3hide", "g4", "g4k", "wash5", "g6", "g6d"].map((ph) => [ph, [["set", { jar: 30, has: "", done: ph === "wash5" ? 3 : 0, held: -1, greasy: false, fuel: ph === "g6" || ph === "g6d" }], ["reset", ph]]]),
  ["wash1 holding a dish", [["set", { done: 0, held: 1 }], ["reset", "wash1"], ["set", { held: 1 }]]],
  ["wash1 while Gloop looks", [["reset", "wash1"], ["set", { warn: 1 }]]],
  ["g4 with coins", [["set", { jar: 0, has: "coins" }], ["reset", "g4"]]],
  ["g4 with soup", [["set", { jar: 0, has: "soup" }], ["reset", "g4"]]],
  ["g4k with soup", [["set", { has: "soup" }], ["reset", "g4k"]]],
  ["g4k out front", [["set", { has: "soup" }], ["reset", "g4k"], ["op", { room: "diner" }]]],
  ["the greasy pot", [["set", { done: 5, held: 6, greasy: true }], ["reset", "wash5"], ["set", { greasy: true }], ["swap", true]]],
  ["g6d with coins", [["set", { jar: 0, has: "coins" }], ["call", "sceneG6"], ["set", { has: "coins", jar: 0 }]]],
  ["g6 Mops with coins", [["set", { jar: 0, has: "coins" }], ["call", "g6Out"], ["swap", true], ["set", { has: "coins" }]]],
  ["g6 hidden at the lure crate", [["set", { fuel: true }], ["reset", "g6"], ["op", { sqPose: "hidden" }], ["ch", { spot: 61, sing: false }]]],
  ["g6 singing", [["set", { fuel: true }], ["reset", "g6"], ["op", { sqPose: "hidden" }], ["ch", { spot: 61, sing: true }]]],
];

const build = (steps) => {
  const ss = window.__ss;
  const n = ss.op;
  n.q = []; n.cur = null; n.live = []; n.ctrl = true;
  for (const st of steps) {
    if (st[0] === "reset") ss.resetTo(st[1]);
    else if (st[0] === "set") Object.assign(ss.ch2, st[1]);
    else if (st[0] === "op") Object.assign(n, st[1]);
    else if (st[0] === "ch") Object.assign(ss.ch, st[1]);
    else if (st[0] === "swap") ss.swapTo(st[1]);
    else if (st[0] === "call") ss[st[1]]();
  }
  n.q = []; n.cur = null; n.ctrl = true;
  ss.ch2.timer = 99; ss.ch2.peekT = 99;
};

// 1. Every action offered anywhere in these states has a caption.
{
  const { ctx, page, errors } = await g.open("?ch=2");
  const missing = [];
  const offeredIn = {};
  let total = 0;
  for (const [label, steps] of STATES) {
    await page.evaluate(build, steps);
    const found = await page.evaluate(
      () => {
        const ss = window.__ss;
        const n = ss.op;
        const who = ss.ch.mops ? n.mo : n.sq;
        const keep = { x: who.x, y: who.y };
        const out = {};
        const note = () => {
          const a = ss.pickAct();
          if (a) out[a.verb + "|" + (a.cap || "")] = [Math.round(who.x), Math.round(who.y)];
        };
        note();
        const b = ss.walkBounds();
        for (let y = b.y0; y <= b.y1; y += 20)
          for (let x = b.x0; x <= b.x1; x += 20) {
            who.x = x; who.y = y;
            note();
          }
        who.x = keep.x; who.y = keep.y;
        return out;
      },
    );
    offeredIn[label] = Object.keys(found).map((key) => key.replace("|", " \u00b7 "));
    for (const key of Object.keys(found)) {
      total++;
      const [verb, cap] = key.split("|");
      if (!cap) missing.push(`${label}: ${verb}`);
    }
    console.log(`  ${label}: ${Object.keys(found).map((k) => k.replace("|", " · ")).join(", ")}`);
  }
  g.check(`every Chapter 2 action offered has a caption (${total} found)`, missing.length === 0 && total > 20, missing);
  for (const [row, label] of Object.entries(SPOTS)) {
    const want = actionOf(LINES[row] || "");
    g.check(`line ${row} "${want}" is what the game offers in ${label}`, !!want && (offeredIn[label] || []).includes(want), { want, offered: offeredIn[label] });
  }
  g.check("no page errors (sweep)", errors.length === 0, errors);
  await ctx.close();
}

// 2. The big button reads "VERB · caption", at least 16 px, on a desktop window and on a phone.
const BUTTON_CASES = [
  ["g1", "HIDE", "crate"],
  ["g4 with coins", "BUY", "soup 30"],
  ["wash1 holding a dish", "SCRUB", "dish"],
  ["g4k with soup", "LEAVE SOUP", "crate"],
  ["g6 Mops with coins", "GIVE", "coins"],
  ["g4k out front", "BACK", "kitchen"],
];
for (const vp of [
  { name: "desktop", width: 1100, height: 800 },
  { name: "phone 375", width: 375, height: 812, isMobile: true, hasTouch: true },
]) {
  const { ctx, page, errors } = await g.open("?ch=2", vp);
  // Touch controls: phones show them; on a desktop the "Show touch controls" button turns them on.
  await page.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find((x) => /touch controls/i.test(x.textContent || x.getAttribute("aria-label") || ""));
    b && b.click();
  });
  await sleep(300);
  for (const [label, verb, cap] of BUTTON_CASES) {
    const steps = STATES.find((s) => s[0] === label)[1];
    await page.evaluate(build, steps);
    const placed = await page.evaluate(
      (verb) => {
        const ss = window.__ss;
        const n = ss.op;
        const who = ss.ch.mops ? n.mo : n.sq;
        const b = ss.walkBounds();
        for (let y = b.y0; y <= b.y1; y += 10)
          for (let x = b.x0; x <= b.x1; x += 10) {
            who.x = x; who.y = y;
            const a = ss.pickAct();
            if (a && a.verb === verb) return true;
          }
        return false;
      },
      verb,
    );
    await sleep(250);
    const btn = await page.evaluate(() => {
      const el = document.querySelector('[role="button"]');
      if (!el) return null;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return { text: el.innerText.trim(), aria: el.getAttribute("aria-label"), font: parseFloat(cs.fontSize), w: Math.round(r.width), right: Math.round(r.right), vw: window.innerWidth };
    });
    const want = `${verb} · ${cap}`;
    g.check(`${vp.name}: ${label}: the button reads "${want}"`, placed && !!btn && btn.text === want && btn.aria === want, { placed, btn });
    g.check(`${vp.name}: ${label}: button letters are at least 16 px`, !!btn && btn.font >= 16, btn);
    g.check(`${vp.name}: ${label}: the button fits on the screen`, !!btn && btn.right <= btn.vw, btn);
  }
  g.check(`no page errors (${vp.name})`, errors.length === 0, errors);
  await ctx.close();
}

// 3. All four chapters (task T18).
{
  const ROWS = readLines({ where: true });
  const capRows = Object.entries(ROWS).filter(([k, r]) => k.startsWith("18.") && / \u00b7 /.test(r.words));
  const { ctx, page, errors } = await g.open("?ch=2");
  const offered = { 1: new Set(), 2: new Set(), 3: new Set(), 4: new Set() };
  const missing = [];
  for (const [chapter, label, setup] of ALL_STATES) {
    const found = await page.evaluate(
      (setStateSrc, setup) => {
        (0, eval)("(" + setStateSrc + ")")(setup);
        const ss = window.__ss, n = ss.op;
        const keep = [n.sq.x, n.sq.y, n.mo.x, n.mo.y];
        const out = {};
        const note = () => {
          const a = ss.offerNow();
          if (a) out[a.verb + "|" + (a.cap || "")] = 1;
        };
        note();
        const b = ss.walkBounds();
        for (let y = b.y0; y <= b.y1; y += 20)
          for (let x = b.x0; x <= b.x1; x += 20) {
            n.sq.x = n.mo.x = x;
            n.sq.y = n.mo.y = y;
            note();
          }
        [n.sq.x, n.sq.y, n.mo.x, n.mo.y] = keep;
        return Object.keys(out);
      },
      setState.toString(),
      setup,
    );
    for (const key of found) {
      const [verb, cap] = key.split("|");
      if (!cap) missing.push(`chapter ${chapter} ${label}: ${verb}`);
      else offered[chapter].add(`${verb} \u00b7 ${cap}`);
    }
  }
  g.check("every action offered in all four chapters has a caption", missing.length === 0, missing);
  for (const ch of [1, 3, 4]) {
    const rowsHere = new Set(capRows.filter(([, r]) => r.where.startsWith(`Chapter ${ch},`)).map(([, r]) => r.words));
    const unlisted = [...offered[ch]].filter((w) => !rowsHere.has(w));
    g.check(`chapter ${ch}: every caption offered is a row in the Phase 2 lines file (${offered[ch].size} offered)`, unlisted.length === 0, unlisted);
  }
  // Every caption row is offered in the sweep, or its verb and thing are in one spot definition (one
  // spot({ ... }) or offer({ ... }) object) in that chapter's source.
  const objects = (src) => {
    const out = [];
    for (const m of src.matchAll(/\b(?:spot|offer)\(\{/g)) {
      let i = m.index + m[0].length - 1, depth = 0, q = null;
      for (let j = i; j < src.length; j++) {
        const ch = src[j];
        if (q) {
          if (ch === "\\") j++;
          else if (ch === q) q = null;
        } else if (ch === '"' || ch === "'" || ch === "`") q = ch;
        else if (ch === "{") depth++;
        else if (ch === "}" && --depth === 0) {
          out.push(src.slice(i, j + 1));
          break;
        }
      }
    }
    return out;
  };
  // The verb and the caption as written in one object: verb: "X" (or a ternary naming X), cap: an expression naming the thing.
  const pairs = (obj) => {
    const head = obj.split(/\n\s*f: |, f: /)[0];
    const verb = (head.match(/verb: ([^,\n]+(?: \? "[^"]*" : "[^"]*")?)/) || [])[1] || "";
    const cap = (head.match(/cap: ([^\n]+?),(?:\n| [a-z]+:)/) || [])[1] || "";
    return { verb, cap };
  };
  const SRC = { 1: ["10-ch1.js", "11-ch1-hall.js"], 3: ["30-ch3.js"], 4: ["40-ch4.js"] };
  const sourceOnly = [];
  for (const [row, r] of capRows) {
    const ch = Number(r.where.match(/^Chapter (\d)/)[1]);
    if (offered[ch].has(r.words)) continue;
    const [verb, cap] = r.words.split(" \u00b7 ");
    const src = SRC[ch].map((f) => readFileSync(join(root, "src", "game", f), "utf8")).join("");
    const near = objects(src).some((o) => {
      const p = pairs(o);
      return p.verb.includes(`"${verb}"`) && p.cap.includes(`"${cap}"`);
    });
    sourceOnly.push(`${row} ${r.words}`);
    g.check(`line ${row} "${r.words}" is in the game (not reached by the sweep; found in ${SRC[ch].join(" or ")})`, near, r);
  }
  console.log(`  caption rows checked only in the source: ${sourceOnly.length ? sourceOnly.join(", ") : "none"}`);
  g.check("no page errors (all chapters)", errors.length === 0, errors);
  await ctx.close();
}

await g.finish("action-labels");
