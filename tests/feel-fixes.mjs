/**
 * Small feel fixes that change no difficulty (task T22).
 * (1) A tap in the first 0.3 seconds of a new bubble is not lost: it is shown (a ring in the corner) and
 *     applied when the 0.3 seconds are up.
 * (2) While a scene has control, no action is offered: n.act is cleared and the ACTION button is empty.
 * (3) COOK stays as on main (its removal waits for Brian).
 * (4) The +250 and +100 awards say what they were for (Brian, 2026-11-07).
 *   node tests/feel-fixes.mjs
 */
import { startGame, sleep, readLines } from "./game-page.mjs";
import { setState } from "./chapter-states.mjs";

const g = await startGame({ port: 8796, name: "feel-fixes" });
const { page, errors } = await g.open("?ch=2");

// (1) An early tap.
await page.evaluate(setState, { kind: "ch2", steps: [["reset", "wash1"]] });
const early = await page.evaluate(() => {
  const ss = window.__ss, n = ss.op;
  const b1 = { k: "bub", b: { who: "sq", text: "One.", style: "say" } };
  const b2 = { k: "bub", b: { who: "sq", text: "Two.", style: "say" } };
  n.q = [b2]; n.cur = b1; n.bt = 0.05; n.ctrl = false;
  ss.opTap();
  return { stillFirst: n.cur === b1, kept: n.tapLate === b1, heard: typeof n.tapT === "number" && Math.abs(n.T - n.tapT) < 0.05 };
});
g.check("a tap 0.05 s into a bubble does not skip it at once", early.stillFirst, early);
g.check("the early tap is kept and shown as heard", early.kept && early.heard, early);
await sleep(500);
const later = await page.evaluate(() => { const n = window.__ss.op; return { text: n.cur && n.cur.b ? n.cur.b.text : null, kept: !!n.tapLate }; });
g.check("when 0.3 s are up the kept tap moves to the next line", later.text === "Two." && !later.kept, later);
await page.evaluate(() => { const n = window.__ss.op; n.q = []; n.cur = null; n.ctrl = true; });

// (2) A scene takes control: the action and the button clear.
await page.evaluate(setState, { kind: "ch2", steps: [["set", { done: 0, held: -1 }], ["reset", "wash1"]] });
await page.evaluate(() => { const n = window.__ss.op; n.sq.x = 660; n.sq.y = 450; });
await sleep(300);
const offered = await page.evaluate(() => ({ act: window.__ss.op.act && window.__ss.op.act.verb, button: window.__ss.game.verb }));
await page.evaluate(() => { window.__ss.op.ctrl = false; });
await sleep(200);
const taken = await page.evaluate(() => ({ act: window.__ss.op.act, button: window.__ss.game.verb }));
g.check("standing at the rack offers GRAB", offered.act === "GRAB" && /GRAB/.test(offered.button), offered);
g.check("when a scene takes control the action clears and the button is empty", taken.act === null && taken.button === "", taken);
await page.evaluate(() => { window.__ss.op.ctrl = true; });

// (3) COOK stays as on main (Brian has not decided its removal): Mops at the range is offered COOK · ticket.
await page.evaluate(setState, { kind: "ch2", steps: [["set", { cook: "down" }], ["reset", "wash1"], ["swap", true]] });
await page.evaluate(() => { const n = window.__ss.op; n.mo.x = 800; n.mo.y = 500; });
await sleep(300);
const atRange = await page.evaluate(() => ({ act: window.__ss.op.act && window.__ss.op.act.verb, cap: window.__ss.op.act && window.__ss.op.act.cap }));
g.check("Mops at the range is offered COOK · ticket (kept, as on main)", atRange.act === "COOK" && atRange.cap === "ticket", atRange);
// (4) The awards say what they were for (rows 22.1 to 22.14); amounts unchanged.
const lines = readLines();
const aw = await page.evaluate(() => {
  const ss = window.__ss;
  ss.ch2.caught = 0;
  const none = ss.ch2Tally();
  ss.ch2.caught = 2;
  const two = ss.ch2Tally();
  ss.ch2.caught = 0;
  return { none, two, never: ss.NEVER_CAUGHT, sneaky: ss.SNEAKY_LABELS };
});
g.check("no catches: the tally says row 22.1 and its reason 22.2", aw.none.includes(lines["22.1"]) && aw.none.includes(lines["22.2"]) && !aw.none.some((t) => /GHOST/i.test(t)), aw.none);
g.check("with catches: the tally says row 22.3", aw.two.includes(lines["22.3"]) && !aw.two.includes(lines["22.1"]), aw.two);
g.check("the bonus is still +250", /\+250$/.test(lines["22.1"]) && aw.never[0] === lines["22.1"]);
const rows = Object.fromEntries(Object.entries(lines).filter(([k]) => /^22\.(\d+)$/.test(k) && +k.split(".")[1] >= 4));
g.check("every sneaky label is a row in the lines file and ends in +100", Object.values(aw.sneaky).every((t) => Object.values(rows).includes(t) && /\+100$/.test(t)), aw.sneaky);
g.check("no page errors", errors.length === 0, errors);
await g.finish("feel-fixes");
