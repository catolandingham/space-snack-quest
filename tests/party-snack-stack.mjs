/**
 * The snack pyramid's rule (src/modules/party-snacks-stack.js), on its own: no browser, every possible order.
 * Brian 2026-11-24: "it just depends on what he takes ... if he pulls something where it's obvious at all the
 * weight was bearing on it then it would fall ... something in the middle is more likely to have weight-bearing".
 * The rule: a snack with nothing on it comes out and nothing moves; a snack with one snack on it lets that snack
 * slide down into the gap; a snack with two snacks on it brings the pile down.
 *   - taking from the top down takes every snack, with no crash and nothing sliding;
 *   - pulling a snack that two snacks sit on is a crash (the middle of the counter row, the middle pie);
 *   - an edge snack with one snack on it is a settle: that snack, and what rode on it, each drop one place;
 *   - every possible order of pulls ends with every snack taken or with exactly one crash;
 *   - in no order does a snack ever float (every snack is on the counter or on two snacks).
 *   node tests/party-snack-stack.mjs
 */
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const S = await import(pathToFileURL(join(root, "src", "modules", "party-snacks-stack.js")).href);
const fails = [];
const check = (label, ok, detail) => {
  console.log(`${ok ? "PASS" : "FAIL"} ${label}${ok || detail === undefined ? "" : " " + JSON.stringify(detail).slice(0, 600)}`);
  ok || fails.push(label);
};
// The slot at a row (0 = on the counter) and a place in that row, counted from the left.
const at = (row, n) => S.SLOTS.map((s, i) => ({ ...s, i })).filter((s) => s.row === row).sort((a, b) => a.col - b.col)[n].i;

// ---------- the table ----------
check("ten snacks: four on the counter, then three, two, one", [0, 1, 2, 3].map((r) => S.SLOTS.filter((s) => s.row === r).length).join() === "4,3,2,1" && S.SNACK_COUNT === 10);
check("a full pyramid stands, and each snack above the counter sits on two", S.stands(S.fullStack()) && S.SLOTS.every((s, i) => S.under(i).length === (s.row === 0 ? 0 : 2)));
check("each snack sits on the two right under it (half a snack to each side, one row down)", S.SLOTS.every((s, i) => S.under(i).every((u) => S.SLOTS[u].row === s.row - 1 && Math.abs(S.SLOTS[u].col - s.col) === 1)));

// ---------- how each snack looks in a full pyramid ----------
{
  const full = S.fullStack(),
    looks = (row) => S.SLOTS.map((s, i) => ({ ...s, i })).filter((s) => s.row === row).sort((a, b) => a.col - b.col).map((s) => S.load(full, s.i)).join();
  check("the top snack is loose", looks(3) === "loose", looks(3));
  check("the counter row: the two ends carry one snack, the two middles carry two", looks(0) === "pressed,squashed,squashed,pressed", looks(0));
  check("the pies: the ends carry one, the middle carries two", looks(1) === "pressed,squashed,pressed", looks(1));
  check("the two cups under the cake carry one each (the cake)", looks(2) === "pressed,pressed", looks(2));
}

// ---------- top down ----------
{
  let slots = S.fullStack();
  const results = [];
  for (let i = 0; i < S.SNACK_COUNT; i++) {
    const r = S.pull(slots, i);
    results.push(r.result);
    slots = r.slots;
  }
  check("from the top down he takes every snack: ten free pulls, no crash, nothing slides", results.every((r) => r === "free") && S.snacksLeft(slots) === 0, results);
}

// ---------- the pulls that crash ----------
{
  const full = S.fullStack();
  check("pulling the middle pie (the cups and the cake all rest on it) is a crash", S.pull(full, at(1, 1)).result === "crash");
  check("pulling either middle cup of the counter row is a crash", S.pull(full, at(0, 1)).result === "crash" && S.pull(full, at(0, 2)).result === "crash");
  check("a crash moves nothing else by itself (the pile falls as a whole)", S.pull(full, at(1, 1)).moves.length === 0);
  check("pulling from an empty place does nothing", S.pull(S.pull(full, at(3, 0)).slots, at(3, 0)).result === "");
  // with only three left (two cups and one on them), the one on top sits on both: each cup carries one
  const three = full.map((id, i) => ([at(0, 0), at(0, 1), at(1, 0)].includes(i) ? id : -1));
  check("three left: pulling a cup lets the snack on it slide down (one on it, not two)", S.stands(three) && S.pull(three, at(0, 0)).result === "settle" && S.pull(three, at(0, 1)).result === "settle");
}

// ---------- the edges settle ----------
{
  const full = S.fullStack();
  const r = S.pull(full, at(0, 0));
  check("pulling the end cup of the counter row is a settle, not a crash", r.result === "settle");
  check("the whole edge slides down one place: the pie, the cup on it, the cake", r.moves.length === 3 && r.moves.map((m) => S.kindOf(m.id)).join() === "pie,cup,cake", r.moves);
  check("each sliding snack drops exactly one row, into the place the one below left", r.moves.every((m) => S.SLOTS[m.from].row === S.SLOTS[m.to].row + 1) && r.moves[0].to === at(0, 0) && r.moves.slice(1).every((m, i) => m.to === r.moves[i].from), r.moves);
  check("after the settle the pile stands, one snack fewer, with no gap in the counter row", S.stands(r.slots) && S.snacksLeft(r.slots) === 9 && [0, 1, 2, 3].every((n) => r.slots[at(0, n)] >= 0));
  const e = S.pull(full, at(1, 2));
  check("pulling an end pie: the cup on it slides down, then the cake", e.result === "settle" && e.moves.map((m) => S.kindOf(m.id)).join() === "cup,cake" && S.stands(e.slots), e.moves);
  const c = S.pull(full, at(2, 0));
  check("pulling a cup under the cake: the cake slides down onto the pies", c.result === "settle" && c.moves.length === 1 && S.kindOf(c.moves[0].id) === "cake" && S.stands(c.slots));
  check("the pull never changes the pile it was given", full.every((id, i) => id === i));
}

// ---------- every possible order ----------
{
  const seen = new Map(); // pile -> { allTaken, crashes } reachable from it
  let floated = 0,
    wrongKind = 0,
    lost = 0,
    orders = 0n,
    endsAll = 0n,
    endsCrash = 0n;
  const key = (s) => s.join(",");
  // counts the orders from this pile: [orders that end with every snack taken, orders that end in a crash]
  const walk = (slots) => {
    const k = key(slots);
    if (seen.has(k)) return seen.get(k);
    S.stands(slots) || floated++;
    let all = 0n,
      crash = 0n;
    if (S.snacksLeft(slots) === 0) all = 1n;
    for (let i = 0; i < slots.length; i++) {
      if (slots[i] < 0) continue;
      const r = S.pull(slots, i);
      const want = ["free", "settle", "crash"][S.sittingOn(slots, i).length];
      r.result === want || wrongKind++;
      if (r.result === "crash") {
        crash += 1n; // the pile is down: this order is over, with exactly one crash
        continue;
      }
      // nothing appears or vanishes: one snack fewer, the same snacks otherwise
      const before = slots.filter((id) => id >= 0 && id !== r.id).sort().join(),
        after = r.slots.filter((id) => id >= 0).sort().join();
      before === after || lost++;
      const [a, c] = walk(r.slots);
      all += a;
      crash += c;
    }
    seen.set(k, [all, crash]);
    return [all, crash];
  };
  [endsAll, endsCrash] = walk(S.fullStack());
  orders = endsAll + endsCrash;
  check("every pile he can reach stands: no snack ever floats", floated === 0, { floated, piles: seen.size });
  check("every pull follows the rule (nothing on it: free; one: settle; two: crash)", wrongKind === 0, wrongKind);
  check("a pull that is not a crash removes exactly that one snack", lost === 0, lost);
  check("every possible order ends with every snack taken or with exactly one crash", orders > 0n && endsAll > 0n && endsCrash > 0n, { orders: String(orders), all: String(endsAll), crash: String(endsCrash), piles: seen.size });
  console.log(`      (${seen.size} piles; ${orders} orders: ${endsAll} take every snack, ${endsCrash} end in the crash)`);
}

if (fails.length) {
  console.error("Failed:", fails.join(", "));
  process.exit(1);
}
console.log("party-snack-stack checks passed");
