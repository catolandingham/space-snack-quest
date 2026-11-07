/**
 * The ACTION button names the thing in Chapter 2 (task T11).
 * Using the T7 hooks, sweeps Chapter 2 states and checks every action offered has a caption.
 * Then, with touch controls on a desktop window and on a 375 by 812 phone, stands the character
 * at a few actions and checks the big button reads exactly "VERB · caption" in letters at least 16 px.
 *   node tests/action-labels.mjs
 */
import { startGame, sleep } from "./game-page.mjs";

const g = await startGame({ port: 8787, name: "action-labels" });

// States to sweep: [label, steps]. Steps: ["set", ch2 fields], ["reset", phase], ["op", op fields], ["swap", toMops].
const STATES = [
  ...["g1", "back", "g2", "wash1", "g3hide", "g4", "g4k", "wash5", "g6", "g6d"].map((ph) => [ph, [["set", { jar: 30, has: "", done: ph === "wash5" ? 3 : 0, held: -1, greasy: false }], ["reset", ph]]]),
  ["wash1 holding a dish", [["set", { done: 0, held: 1 }], ["reset", "wash1"], ["set", { held: 1 }]]],
  ["wash1 while Gloop looks", [["reset", "wash1"], ["set", { warn: 1 }]]],
  ["g4 with coins", [["set", { jar: 0, has: "coins" }], ["reset", "g4"]]],
  ["g4 with soup", [["set", { jar: 0, has: "soup" }], ["reset", "g4"]]],
  ["g4k with soup", [["set", { has: "soup" }], ["reset", "g4k"]]],
  ["g4k out front", [["set", { has: "soup" }], ["reset", "g4k"], ["op", { room: "diner" }]]],
  ["the greasy pot", [["set", { done: 5, held: 6, greasy: true }], ["reset", "wash5"], ["set", { greasy: true }], ["swap", true]]],
  ["g6d with coins", [["set", { jar: 0, has: "coins" }], ["call", "sceneG6"], ["set", { has: "coins", jar: 0 }]]],
  ["g6 Mops with coins", [["set", { jar: 0, has: "coins" }], ["call", "g6Out"], ["swap", true], ["set", { has: "coins" }]]],
  ["g6 hidden at the lure crate", [["reset", "g6"], ["op", { sqPose: "hidden" }], ["ch", { spot: 61, sing: false }]]],
  ["g6 singing", [["reset", "g6"], ["op", { sqPose: "hidden" }], ["ch", { spot: 61, sing: true }]]],
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
    for (const key of Object.keys(found)) {
      total++;
      const [verb, cap] = key.split("|");
      if (!cap) missing.push(`${label}: ${verb}`);
    }
    console.log(`  ${label}: ${Object.keys(found).map((k) => k.replace("|", " · ")).join(", ")}`);
  }
  g.check(`every Chapter 2 action offered has a caption (${total} found)`, missing.length === 0 && total > 20, missing);
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

await g.finish("action-labels");
