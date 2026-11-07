/**
 * Chapter 2 "next step" sweep (task T7).
 * For each checkpoint phase, and for the states the story reaches by play, stand the character
 * the player controls at every point of a 20-pixel grid inside the room and list the actions
 * offered. Every state must offer at least one action that moves the story on.
 * Writes the table to tests/out/next-step.json for the reviewer.
 *   node tests/ch2-next-step.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { startGame, root } from "./game-page.mjs";

// Actions that move the story on, by phase. Side jokes (LIFT, FLIP, OPEN), COOK and ROLL are not on these lists.
// BACK takes Mops from the diner to the kitchen when the work is in the kitchen.
const FORWARD = {
  g1: ["HIDE"],
  g1door: ["ENTER"],
  back: ["ENTER"],
  g2: ["ORDER"],
  wash1: ["GRAB", "SCRUB"],
  g3: ["HIDE"],
  g3hide: ["HIDE"],
  g3h: ["HIDE"],
  g4: ["ASK", "GRAB", "BUY", "ENTER"],
  g4k: ["LEAVE SOUP", "BACK"],
  g4l: ["LEAVE SOUP", "BACK"],
  wash5: ["GRAB", "SCRUB", "MOP", "BACK"],
  g6d: ["GRAB", "EXIT"],
  g6: ["GIVE", "HIDE", "SING", "STOP", "BOARD"],
};

const fill = {
  wash1: { done: 0, held: -1, greasy: false },
  wash5: { done: 3, held: -1, greasy: false },
  g4: { jar: 30, has: "" },
  g4k: { has: "soup" },
  g4l: { has: "" },
  g6: { jar: 0, has: "", fuel: false },
  g6d: { jar: 30, has: "" },
};

// Each state: a name and the steps that build it. "act" finds the action on the floor and does it;
// "act?" does it only if it is offered; "drain" plays the queued lines to the end.
const STATES = [
  ...["g1", "back", "g1door", "g2", "wash1", "g3", "g3hide", "g3h", "g4", "g4k", "g4l", "wash5", "g6", "g6d"].map((ph) => ({
    name: "Reset section in " + ph,
    steps: [["set", fill[ph] || {}], ["reset", ph]],
  })),
  { name: "play: Squatch hid by the pump", steps: [["reset", "g1"], ["act", "HIDE"], ["drain"]] },
  { name: "play: Mops walks into the diner", steps: [["reset", "g1"], ["act", "HIDE"], ["drain"], ["act", "ENTER"], ["drain"]] },
  { name: "play: Mops asked for work", steps: [["scene", "G2"], ["act", "ORDER"], ["drain"]] },
  { name: "play: Squatch in the kitchen", steps: [["scene", "G2"], ["act", "ORDER"], ["drain"], ["act", "ENTER"], ["drain"]] },
  { name: "play: bots come to the kitchen", steps: [["reset", "wash1"], ["set", { done: 3 }], ["scene", "G3"], ["drain"]] },
  { name: "play: Mops out front after the hide", steps: [["set", { jar: 30, has: "" }], ["reset", "g3hide"], ["set", { bots: [{ x: 420, y: 520, hx: 420, f: 1, look: 0 }, { x: 600, y: 520, hx: 600, f: 1, look: 0 }] }], ["act", "HIDE"], ["drain"]] },
  { name: "play: Mops bought the soup", steps: [["set", { jar: 30, has: "" }], ["reset", "g3hide"], ["set", { bots: [{ x: 420, y: 520, hx: 420, f: 1, look: 0 }, { x: 600, y: 520, hx: 600, f: 1, look: 0 }] }], ["act", "HIDE"], ["drain"], ["set", { has: "soup", jar: 0 }]] },
  {
    name: "play: Mops carries the soup into the kitchen",
    steps: [["set", { jar: 0, has: "soup" }], ["reset", "g3hide"], ["set", { bots: [{ x: 420, y: 520, hx: 420, f: 1, look: 0 }, { x: 600, y: 520, hx: 600, f: 1, look: 0 }] }], ["act", "HIDE"], ["drain"], ["set", { has: "soup" }], ["act", "ENTER"], ["drain"]],
  },
  {
    name: "play: Mops with the soup goes back out front",
    steps: [["set", { jar: 0, has: "soup" }], ["reset", "g3hide"], ["set", { bots: [{ x: 420, y: 520, hx: 420, f: 1, look: 0 }, { x: 600, y: 520, hx: 600, f: 1, look: 0 }] }], ["act", "HIDE"], ["drain"], ["set", { has: "soup" }], ["act", "ENTER"], ["drain"], ["act?", "FRONT"], ["drain"]],
  },
  { name: "play: after the soup, more dishes", steps: [["set", { done: 3, held: -1, greasy: false, has: "" }], ["scene", "G5"], ["drain"]] },
  {
    name: "play: after the soup, whoever is in control walks out front",
    steps: [["set", { done: 3, held: -1, greasy: false, has: "" }], ["scene", "G5"], ["drain"], ["act?", "FRONT"], ["drain"]],
  },
  {
    name: "play: the greasy pot",
    steps: [["set", { done: 5, held: 6, scrub: 2, mopN: 0, greasy: false, has: "" }], ["reset", "wash5"], ["set", { held: 6, scrub: 2 }], ["act", "SCRUB"], ["drain"]],
  },
  {
    name: "play: Mops walks out front with the mop",
    steps: [["set", { done: 5, held: 6, scrub: 2, mopN: 0, greasy: false, has: "" }], ["reset", "wash5"], ["set", { held: 6, scrub: 2 }], ["act", "SCRUB"], ["drain"], ["act?", "FRONT"], ["drain"]],
  },
  { name: "play: the new jar", steps: [["set", { jar: 30, has: "" }], ["scene", "G6"], ["drain"]] },
  { name: "play: Mops takes the coins out", steps: [["set", { jar: 30, has: "" }], ["scene", "G6"], ["drain"], ["act", "GRAB"], ["act", "EXIT"], ["drain"]] },
  {
    name: "play: the tank is full",
    steps: [["set", { jar: 30, has: "" }], ["scene", "G6"], ["drain"], ["act", "GRAB"], ["act", "EXIT"], ["drain"], ["act", "GIVE"], ["drain"]],
  },
];

const g = await startGame({ port: 8781, name: "next-step" });
const table = [];
for (const state of STATES) {
  const { ctx, page, errors } = await g.open("?ch=2");
  const row = await page.evaluate((steps) => {
    const ss = window.__ss;
    const n = ss.op;
    const k = ss.ch2;
    const me = () => (ss.ch.mops ? n.mo : n.sq);
    // Start from a quiet Chapter 2: the opening lines from ?ch=2 are cleared first.
    n.q = [];
    n.cur = null;
    n.ctrl = true;
    const findAct = (verb) => {
      const b = ss.walkBounds();
      const who = me();
      if (!ss.ch.mops && n.sqPose === "hidden") n.sqPose = "stand";
      for (let y = b.y0; y <= b.y1; y += 10)
        for (let x = b.x0; x <= b.x1; x += 10) {
          who.x = x;
          who.y = y;
          const a = ss.pickAct();
          if (a && a.verb === verb) return a;
        }
      return null;
    };
    for (const st of steps) {
      if (st[0] === "reset") ss.resetTo(st[1]);
      else if (st[0] === "set") Object.assign(k, st[1]);
      else if (st[0] === "scene") ss["scene" + st[1]]();
      else if (st[0] === "drain") ss.drain();
      else if (st[0] === "act" || st[0] === "act?") {
        const a = findAct(st[1]);
        if (a) a.f();
        else if (st[0] === "act") return { error: "no " + st[1] + " offered while building the state", phase: k.phase, room: n.room };
      }
    }
    // The sweep. A hidden Squatch is checked where he hides; anywhere else he would be standing.
    const who = me();
    const start = { x: who.x, y: who.y, pose: n.sqPose };
    const verbs = {};
    const note = (a) => {
      if (!a) return;
      const label = a.verb + (a.cap ? " · " + a.cap : "");
      verbs[label] = verbs[label] || [Math.round(who.x), Math.round(who.y)];
    };
    note(ss.pickAct());
    const b = ss.walkBounds();
    if (!ss.ch.mops && n.sqPose === "hidden") n.sqPose = "stand";
    for (let y = b.y0; y <= b.y1; y += 20)
      for (let x = b.x0; x <= b.x1; x += 20) {
        who.x = x;
        who.y = y;
        note(ss.pickAct());
      }
    who.x = start.x;
    who.y = start.y;
    n.sqPose = start.pose;
    return {
      phase: k.phase,
      room: n.room,
      scene: n.scene,
      control: ss.ch.mops ? "Mops" : "Squatch",
      inControl: n.ctrl,
      chip: n.chip || "",
      squatch: { pose: n.sqPose, x: Math.round(n.sq.x), away: ss.sqAway() },
      verbs,
    };
  }, state.steps);
  row.name = state.name;
  if (errors.length) row.errors = errors;
  const forward = FORWARD[row.phase] || [];
  const offered = Object.keys(row.verbs || {}).map((v) => v.split(" · ")[0]);
  row.forward = offered.filter((v) => forward.includes(v));
  table.push(row);
  g.check(
    `${state.name}: ${row.control || "?"} in the ${row.room || "?"} (${row.phase || "?"}) has a way forward`,
    !row.error && row.forward.length > 0 && !errors.length,
    row,
  );
  // The character the player is not moving must not stand in plain sight out front.
  if (row.control === "Mops" && row.room === "diner")
    g.check(`${state.name}: Squatch is out of sight while Mops is out front`, row.squatch.pose === "hidden" || row.squatch.x < -100 || row.squatch.away, row.squatch);
  await ctx.close();
}

console.log("\nVerb table (state | control | room | phase | actions offered)");
for (const r of table) console.log(`${r.name} | ${r.control} | ${r.room} | ${r.phase} | ${Object.keys(r.verbs || {}).join(", ") || r.error || "none"}`);
mkdirSync(join(root, "tests", "out"), { recursive: true });
writeFileSync(join(root, "tests", "out", "next-step.json"), JSON.stringify(table, null, 2));
console.log("Wrote tests/out/next-step.json");
await g.finish("next-step");
