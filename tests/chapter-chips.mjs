/**
 * The goal chip names who acts and what to do in Chapters 1, 3 and 4 (task T18).
 *   node tests/chapter-chips.mjs
 *
 * Every chip in CH1_CHIPS, CH3_CHIPS and CH4_CHIPS starts with "Squatch: " or "Mops: " and is word for
 * word the row with its key in docs/PHASE-2-LINES-FOR-BRIAN.md, and every row has a chip. Then, in every
 * Chapter 1, 3 and 4 state from tests/chapter-states.mjs, the chip the game sets is the table's line for
 * the state's key, and a few states show the line they should (the right step for who is playing).
 * Last, moving from a scene with a chip to one without leaves no chip on screen.
 */
import { startGame, readLines } from "./game-page.mjs";
import { STATES, setState } from "./chapter-states.mjs";

const ROWS = readLines({ where: true });
const chipRows = {};
for (const [row, r] of Object.entries(ROWS)) {
  const m = r.where.match(/^Chapter ([134]), `([^`]+)`/);
  if (row.startsWith("18.") && m) chipRows[`${m[1]}:${m[2]}`] = { row, words: r.words };
}

const g = await startGame({ port: 8793, name: "chapter-chips" });
const { ctx, page, errors } = await g.open("?ch=2");
const tables = await page.evaluate(() => ({ 1: window.__ss.CH1_CHIPS, 3: window.__ss.CH3_CHIPS, 4: window.__ss.CH4_CHIPS }));
for (const ch of [1, 3, 4])
  for (const [key, words] of Object.entries(tables[ch])) {
    const r = chipRows[`${ch}:${key}`];
    g.check(`chapter ${ch} chip ${key} names who acts`, /^(Squatch|Mops): \S/.test(words), words);
    g.check(`chapter ${ch} chip ${key} is line ${r ? r.row : "?"} word for word`, !!r && r.words === words, { words, row: r });
  }
for (const [k, r] of Object.entries(chipRows)) {
  const [ch, key] = k.split(":", 2);
  const rest = k.slice(ch.length + 1);
  g.check(`line ${r.row} (chapter ${ch}, ${rest}) is a chip in the game`, tables[ch][rest] === r.words, { row: r, game: tables[ch][rest] });
}

// What a few states must show.
const WANT = {
  "S1 lunch on the shelf": "S1",
  "S9 Mops": "S9:mops",
  "S9 singing": "S9:sing",
  "S11 keypad (Mops)": "S11:mops",
  "S11 door open": "S11:costume",
  "S12 hangar, all snacks": "S12:ship",
  "pad p2 (Mops)": "p2",
  "temple p3 (Mops)": "p3:m1",
  "temple p3, first mirror turned": "p3:m2",
  "pad p4a, singing": "p4a:sing",
  "pad p4b, rope held": "p4b:rope",
  "stand m2, poster read": "m2:knock",
  "van m3, floor mopped": "m3:seat",
  "port m1, singing": "m1:sing",
  "port m5d": "m5d",
};
for (const [chapter, label, setup] of STATES) {
  if (chapter === 2) continue;
  const got = await page.evaluate(
    (setStateSrc, setup) => {
      (0, eval)("(" + setStateSrc + ")")(setup);
      const ss = window.__ss;
      return { key: ss.chipKeyNow(), chip: ss.chipNow() };
    },
    setState.toString(),
    setup,
  );
  const table = tables[chapter];
  const want = table[got.key];
  g.check(`chapter ${chapter} ${label}: the chip is the table's line for ${got.key || "(no key)"}`, want === undefined ? true : got.chip === want, got);
  if (WANT[label]) g.check(`chapter ${chapter} ${label}: shows ${WANT[label]}`, got.key === WANT[label] && got.chip === table[WANT[label]], got);
}
// An earlier scene's chip never stays on screen: S1 has a chip, S3 (a cutscene) has none.
{
  const got = await page.evaluate(
    (setStateSrc, setup) => {
      (0, eval)("(" + setStateSrc + ")")(setup);
      const ss = window.__ss, n = ss.op;
      // Past the first 3.5 seconds of the star counter, when the chip waits its turn.
      n.T = 1e6;
      ss.chipNow();
      ss.drawFrame();
      const before = ss.chipDrawn();
      n.scene = "S3";
      ss.chipNow();
      ss.drawFrame();
      return { before, after: ss.chipDrawn(), chip: n.chip };
    },
    setState.toString(),
    STATES.find((s) => s[1] === "S1 lunch on the shelf")[2],
  );
  g.check("S1 shows its chip", got.before === tables[1].S1, got);
  g.check("after moving on to S3, which has no chip, no chip is drawn", got.after === "" && got.chip === "", got);
}
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("chapter-chips");
