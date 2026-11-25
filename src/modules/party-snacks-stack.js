/**
 * The snack pyramid on the bar: the one table of snacks both pictures draw (the hall's small pyramid and the
 * close-up's big one), and the rule for what happens when Squatch pulls one out (Brian 2026-11-24: "it just
 * depends on what he takes ... if he pulls something where it's obvious at all the weight was bearing on it then
 * it would fall ... something in the middle is more likely to have weight-bearing").
 *
 * THE RULE, as a 10-year-old can read it off the picture:
 *   Every snack sits on the two snacks under it. Pull a snack with nothing on it and nothing moves. Pull a snack
 *   with one snack on it and that snack slides down into the gap (and whatever rode on it slides down after it).
 *   Pull a snack with two snacks on it and the whole pile falls.
 *
 * It is a rule written as data, not a physics engine and not a count: taking from the top down he can take every
 * snack. No browser here: tests/party-snack-stack.mjs checks every possible order.
 *
 * A "slot" is a place in the pyramid (row 0 is on the counter; `col` counts half snacks from the left). A snack
 * has an id (0 to 9) and a kind; `slots[i]` is the id of the snack standing in slot i, or -1 for a gap.
 */

// The pyramid, top down: the cake on top, two cups, three pies, four cups on the counter. Slot i starts with
// snack i. (The hall drew these rows before; the close-up now draws the same ones.)
export const SLOTS = Object.freeze(
  [
    [3, 3, "cake"],
    [2, 2, "cup"],
    [2, 4, "cup"],
    [1, 1, "pie"],
    [1, 3, "pie"],
    [1, 5, "pie"],
    [0, 0, "cup"],
    [0, 2, "cup"],
    [0, 4, "cup"],
    [0, 6, "cup"],
  ].map(([row, col, kind]) => Object.freeze({ row, col, kind })),
);
export const SNACK_COUNT = SLOTS.length;
/** The kind of snack `id` (it keeps its kind wherever it slides to). */
export const kindOf = (id) => SLOTS[id].kind;
const slotAt = (row, col) => SLOTS.findIndex((s) => s.row === row && s.col === col);

/** A full pyramid. */
export function fullStack() {
  return SLOTS.map((_, i) => i);
}
/** The two slots a slot's snack sits on (none for the counter row). */
export function under(slot) {
  const { row, col } = SLOTS[slot];
  return row === 0 ? [] : [slotAt(row - 1, col - 1), slotAt(row - 1, col + 1)];
}
/** The slots whose snacks would sit on this slot (one or two places; none above the top). */
export function over(slot) {
  const { row, col } = SLOTS[slot];
  return [slotAt(row + 1, col - 1), slotAt(row + 1, col + 1)].filter((i) => i >= 0);
}
/** The slots with a snack sitting on this slot right now. */
export function sittingOn(slots, slot) {
  return over(slot).filter((i) => slots[i] >= 0);
}
/** How a snack looks: "loose" (nothing on it), "pressed" (one snack on it) or "squashed" (two on it). */
export function load(slots, slot) {
  return ["loose", "pressed", "squashed"][sittingOn(slots, slot).length];
}
/** How many snacks are still on the bar. */
export function snacksLeft(slots) {
  return slots.filter((id) => id >= 0).length;
}
/** True when every snack is on the counter or on two snacks: nothing floats. */
export function stands(slots) {
  return slots.every((id, i) => id < 0 || under(i).every((u) => slots[u] >= 0));
}

/**
 * He pulls the snack out of `slot`. Returns { result, slots, id, moves }:
 *   result "free"    nothing was on it; nothing else moves
 *          "settle"  one snack was on it: `moves` lists each snack that slides down, [{ id, from, to }], lowest first
 *          "crash"   two snacks were on it: the pile falls (`slots` is the pile as it stood, without the pulled snack)
 *          ""        there was no snack in that slot
 * `slots` is the pile afterwards (a new array; the one passed in is not changed) and `id` the snack pulled.
 */
export function pull(slots, slot) {
  const id = slots[slot];
  if (id == null || id < 0) return { result: "", slots: slots.slice(), id: -1, moves: [] };
  const next = slots.slice();
  next[slot] = -1;
  const on = sittingOn(slots, slot);
  if (on.length === 0) return { result: "free", slots: next, id, moves: [] };
  if (on.length === 2) return { result: "crash", slots: next, id, moves: [] };
  // One snack on it: it slides into the gap, and the gap it leaves is filled the same way, up the pile.
  const moves = [];
  let gap = slot;
  for (;;) {
    const up = sittingOn(next, gap);
    if (up.length === 0) break;
    // (Two snacks over a gap cannot happen in a pile that stood; if it ever did, the pile falls.)
    if (up.length === 2) return { result: "crash", slots: next, id, moves: [] };
    moves.push({ id: next[up[0]], from: up[0], to: gap });
    next[gap] = next[up[0]];
    next[up[0]] = -1;
    gap = up[0];
  }
  return { result: "settle", slots: next, id, moves };
}
