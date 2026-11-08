/**
 * Chapter 2 goal chip (task T5).
 * For each checkpoint phase: place the phase, hold Reset section, and check the chip matches the
 * CH2_CHIPS table, names the character the player controls, and never names the diner door while
 * the player is in the kitchen. Also checks the chip is hidden while a speech bubble is up.
 *   node tests/ch2-goal-chip.mjs
 */
import { startGame, sleep, readLines } from "./game-page.mjs";

// Every chip is compared to the literal words in docs/PHASE-1-LINES-FOR-BRIAN.md, by row.
const LINES = readLines();
const ROW = {
  g1: "5.1", g1door: "5.2", back: "5.3", g2: "5.4", wash1: "5.5", g3: "5.6", g3hide: "5.6", g3h: "5.7",
  g4: "5.8", "g4:coins": "5.9", "g4:soup": "5.10", g4k: "5.11", g4l: "5.11", "diner:kitchen": "5.12",
  wash5: "5.13", "wash5:mop": "5.14", g6d: "5.15", "g6d:coins": "5.16", "g6:mops": "5.17", g6: "5.18",
  "g6:sing": "5.19", "g6:run": "5.20", "kitchen:mops": "5.21",
};
const fill = {
  g4: { jar: 30, has: "" },
  g4k: { has: "soup" },
  wash1: { done: 0, held: -1 },
  wash5: { done: 3, held: -1, greasy: false },
  g6: { has: "", jar: 0 },
};
const PHASES = ["g1", "back", "g1door", "g2", "wash1", "g3", "g3hide", "g3h", "g4", "g4k", "g4l", "wash5", "g6", "g6d"];

const g = await startGame({ port: 8782, name: "goal-chip" });
const { ctx, page, errors } = await g.open("?ch=2");

for (const ph of PHASES) {
  await page.evaluate(
    (ph, fill) => {
      const ss = window.__ss;
      Object.assign(ss.ch2, fill || {});
      ss.resetTo(ph);
      // An old goal from somewhere else must not survive the reset.
      ss.op.chip = "Walk to the diner door";
      ss.resetHold(true);
    },
    ph,
    fill[ph],
  );
  await sleep(950);
  const s = await page.evaluate(() => {
    const ss = window.__ss;
    ss.resetHold(false);
    return {
      phase: ss.ch2.phase,
      room: ss.op.room,
      control: ss.ch.mops ? "Mops" : "Squatch",
      chip: ss.op.chip,
      key: ss.ch2ChipKey(),
    };
  });
  const label = `Reset section in ${ph} (now ${s.phase}, ${s.room})`;
  const want = LINES[ROW[s.key]];
  g.check(`${label}: chip is line ${ROW[s.key]} word for word`, !!want && s.chip === want, { ...s, want });
  g.check(`${label}: chip names who acts (${s.control})`, s.chip.startsWith(s.control + ": "), s);
  g.check(`${label}: no stale "Walk to the diner door"`, s.chip !== "Walk to the diner door", s);
  if (s.room === "kitchen") g.check(`${label}: a kitchen chip does not name the diner door`, !/diner door/i.test(s.chip), s);
}

// Every step inside a phase: build it, read the chip, compare to the lines file.
const SUBSTATES = [
  ["g4:coins", [["set", { jar: 0, has: "coins" }], ["reset", "g4"]]],
  ["g4:soup", [["set", { jar: 0, has: "soup" }], ["reset", "g4"]]],
  ["diner:kitchen", [["set", { has: "soup" }], ["reset", "g4k"], ["op", { room: "diner" }]]],
  ["wash5:mop", [["set", { done: 5, held: 6 }], ["reset", "wash5"], ["set", { greasy: true }], ["mops"]]],
  ["kitchen:mops", [["set", { done: 0, held: -1 }], ["reset", "wash1"], ["set", { cook: "down", peekT: 99 }], ["picswap"]]],
  ["g6d", [["set", { jar: 30, has: "" }], ["reset", "wash5"], ["scene", "G6"]]],
  ["g6d:coins", [["set", { jar: 30, has: "" }], ["reset", "wash5"], ["scene", "G6"], ["set", { has: "coins", jar: 0 }]]],
  ["g6:mops", [["set", { jar: 0, has: "coins" }], ["reset", "wash5"], ["call", "g6Out"], ["mops"]]],
  ["g6:sing", [["set", { fuel: true }], ["reset", "g6"], ["op", { sqPose: "hidden" }], ["ch", { spot: 61, sing: true }]]],
  ["g6:run", [["set", { fuel: true }], ["reset", "g6"], ["ch", { sing: false }], ["set", { bots: [{ x: 700, y: 500, hx: 700, f: -1, look: 5 }, { x: 900, y: 520, hx: 900, f: -1, look: 5 }] }]]],
];
for (const [key, steps] of SUBSTATES) {
  await page.evaluate((steps) => {
    const ss = window.__ss;
    const n = ss.op;
    for (const st of steps) {
      if (st[0] === "reset") ss.resetTo(st[1]);
      else if (st[0] === "set") Object.assign(ss.ch2, st[1]);
      else if (st[0] === "op") Object.assign(n, st[1]);
      else if (st[0] === "ch") Object.assign(ss.ch, st[1]);
      else if (st[0] === "mops") ss.swapTo(true);
      else if (st[0] === "picswap") ss.picSwap();
      else if (st[0] === "scene") ss["scene" + st[1]]();
      else if (st[0] === "call") ss[st[1]]();
    }
    n.q = []; n.cur = null; n.ctrl = true; n.chip = "";
  }, steps);
  await sleep(120);
  const s = await page.evaluate(() => ({ key: window.__ss.ch2ChipKey(), chip: window.__ss.op.chip }));
  g.check(`step ${key}: chip is line ${ROW[key]} word for word`, s.key === key && s.chip === LINES[ROW[key]], { ...s, want: LINES[ROW[key]] });
}

// Every chip in the table has a row in the lines file, names who acts, and none in a kitchen state names the diner door.
const all = await page.evaluate(() => window.__ss.CH2_CHIPS);
g.check("every chip in the game has a row in the lines file with the same words", Object.entries(all).every(([key, t]) => ROW[key] && LINES[ROW[key]] === t), Object.entries(all).filter(([key, t]) => !(ROW[key] && LINES[ROW[key]] === t)));
g.check("every table line starts with Squatch: or Mops:", Object.values(all).every((t) => /^(Squatch|Mops): /.test(t)), all);
g.check("no table line names the diner door except the walk to it", Object.entries(all).every(([key, t]) => key === "g1door" || !/diner door/i.test(t)), all);

// The goal follows the step inside g4: jar, then soup.
const steps = await page.evaluate(() => {
  const ss = window.__ss;
  const read = () => (ss.op.chip = "", ss.ch2ChipKey() && window.__ss.CH2_CHIPS[ss.ch2ChipKey()]);
  ss.ch2.jar = 30; ss.ch2.has = ""; ss.resetTo("g4");
  const jar = read();
  ss.ch2.has = "coins";
  const coins = read();
  ss.ch2.has = "soup";
  const soup = read();
  return { jar, coins, soup };
});
g.check("g4 chip moves on from the jar to buying to carrying the soup", steps.jar !== steps.coins && steps.coins !== steps.soup && /soup/.test(steps.soup), steps);

// The chip is hidden while a speech bubble is up.
// Since Phase 3 the chip is page text over the picture (#ss-chip, src/game/80-hud.js): its width in
// CSS pixels when it shows, 0 when it is hidden.
const yellowRow = () =>
  page.evaluate(() => {
    const el = document.getElementById("ss-chip");
    return el && getComputedStyle(el).display !== "none" && el.textContent ? Math.round(el.getBoundingClientRect().width) : 0;
  });
await page.evaluate(() => {
  const ss = window.__ss;
  ss.ch2.done = 0; ss.ch2.held = -1;
  ss.resetTo("wash1");
  ss.ch2.peekT = 99;
});
await sleep(4000);
const before = await yellowRow();
await page.evaluate(() => {
  const n = window.__ss.op;
  n.sq.x = 480; n.sq.y = 560;
  n.cur = { k: "bub", b: { who: "sq", text: "Dishes!", style: "say" } };
  n.bt = 0;
});
await sleep(200);
const during = await yellowRow();
g.check("the chip shows when no bubble is up", before > 80, { before });
// Ambient chatter (live bubbles, like the bots arguing in g4k) does not hide the chip.
await page.evaluate(() => {
  const n = window.__ss.op;
  n.cur = null;
  n.live = [{ who: "gloop", text: "Order up?", style: "say", live: 30 }];
});
await sleep(200);
const ambient = await yellowRow();
const stillLive = await page.evaluate(() => window.__ss.op.live.length);
g.check("the chip stays up while ambient chatter shows", ambient > 80 && stillLive > 0, { ambient, stillLive });
await page.evaluate(() => {
  window.__ss.op.live = [];
});
g.check("the chip is hidden while a bubble is up", during < 10, { before, during });

g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("goal-chip");
