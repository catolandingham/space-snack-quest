/**
 * Chapter 2 goal chip (task T5).
 * For each checkpoint phase: place the phase, hold Reset section, and check the chip matches the
 * CH2_CHIPS table, names the character the player controls, and never names the diner door while
 * the player is in the kitchen. Also checks the chip is hidden while a speech bubble is up.
 *   node tests/ch2-goal-chip.mjs
 */
import { startGame, sleep } from "./game-page.mjs";

// The words Brian sees in docs/PHASE-1-LINES-FOR-BRIAN.md. If he changes one, change it here too.
const EXPECT = {
  g1: "Squatch: hide behind the crate by the pump",
  back: "Squatch: sneak in the KITCHEN door",
  g2: "Mops: ask Gloop for work at the counter",
  wash1: "Squatch: wash the dishes at the sink",
  g3hide: "Squatch: hide in the crate before the bots look!",
  g4: "Mops: take the tip jar",
  g4k: "Mops: carry the soup to Squatch's crate",
  wash5: "Squatch: wash the next dishes",
  g6: "Squatch: sing from the crate to lure the bots",
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
      table: ss.CH2_CHIPS[ss.ch2ChipKey()],
    };
  });
  const label = `Reset section in ${ph} (now ${s.phase}, ${s.room})`;
  g.check(`${label}: chip comes from the table`, !!s.chip && s.chip === s.table, s);
  if (EXPECT[s.phase] && s.key === s.phase) g.check(`${label}: chip reads "${EXPECT[s.phase]}"`, s.chip === EXPECT[s.phase], s);
  g.check(`${label}: chip names who acts (${s.control})`, s.chip.startsWith(s.control + ": "), s);
  g.check(`${label}: no stale "Walk to the diner door"`, s.chip !== "Walk to the diner door", s);
  if (s.room === "kitchen") g.check(`${label}: a kitchen chip does not name the diner door`, !/diner door/i.test(s.chip), s);
}

// Every chip in the table names who acts, and none in a kitchen state names the diner door.
const all = await page.evaluate(() => window.__ss.CH2_CHIPS);
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
const yellowRow = () =>
  page.evaluate(() => {
    const c = document.querySelector("canvas");
    const g2 = c.getContext("2d", { willReadFrequently: true });
    const row = g2.getImageData(150, 58, 660, 1).data;
    let yellow = 0;
    for (let i = 0; i < row.length; i += 4) if (row[i] > 240 && row[i + 1] > 195 && row[i + 1] < 220 && row[i + 2] < 80) yellow++;
    return yellow;
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
