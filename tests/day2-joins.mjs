/**
 * Day 2 afternoon to the night before pickup, joined (the loading bay #95, the evening #94 and the escape #93, built
 * side by side and joined on feat/ch1-day2-joined). Checks the joins and the one-copy rule for what they shared:
 *   (a) the hand-overs play in story order: 36 (the hallway, the hairball) -> 37 (the photo wall, the evening) ->
 *       36b (the party hall's cleaning robots, the bay's startHallSneak) -> 38a (the storm, the evening's startStorm);
 *       nobody jumps across the room at a hand-over.
 *   (b) his crayon in the crate bed's stamp is there on Day 2's morning, gone once he rubs it out (39b), and gone in
 *       the escape (43 on); the home picture carries the one stamp (crate-stamp.js), never a second one.
 *   (c) one file each for what the three branches shared: the snack's names (snack-name.js), the night look
 *       (night-look.js), the office code (office-code.js); thought-place.js and thought-bubble.js export different
 *       names; no Day 2 module shares a top-level function name with another module (CLAUDE.md, esbuild renames it).
 *   (d) the bay plant's new spot (locked bay pictures v3) is the escape's and the evening's too.
 *   node tests/day2-joins.mjs
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { startGame, root } from "./game-page.mjs";

const M = (f) => join(root, "src", "modules", f);
const g = await startGame({ port: 9871, name: "day2-joins" });

// ---------- (c) one copy each ----------
const mods = readdirSync(join(root, "src", "modules")).filter((f) => f.endsWith(".js"));
const src = Object.fromEntries(mods.map((f) => [f, readFileSync(M(f), "utf8")]));
g.check("the snack's names have one module (snack-name.js): stars-cakes.js and cakes-brand.js are gone", !existsSync(M("stars-cakes.js")) && !existsSync(M("cakes-brand.js")) && !mods.some((f) => /stars-cakes|cakes-brand/.test(src[f])));
g.check("one night look (night-look.js), used by the evening and the escape", ["evening.js", "escape.js"].every((f) => /from "\.\/night-look\.js"/.test(src[f])));
const codeAt = mods.filter((f) => /169556/.test(src[f]));
const game = readdirSync(join(root, "src", "game")).map((f) => readFileSync(join(root, "src", "game", f), "utf8")).join("\n");
g.check("the office code is typed once, in office-code.js (the older program keeps only its old keypad picture's spaced digits)", codeAt.join() === "office-code.js" && !/CH1_OFFICE_CODE/.test(game), codeAt);
const exportsOf = (f) => [...src[f].matchAll(/^export const ([A-Z_]+)/gm)].map((m) => m[1]);
g.check("thought-place.js and thought-bubble.js export no name in common", !exportsOf("thought-place.js").some((x) => exportsOf("thought-bubble.js").includes(x)), [exportsOf("thought-place.js"), exportsOf("thought-bubble.js")]);
const fnNames = {};
// (functions, and functions written as arrow constants: esbuild renames the second of either)
for (const f of mods) for (const m of src[f].matchAll(/^(?:export )?(?:(?:async )?function\s+([A-Za-z0-9_$]+)|(?:const|let) ([A-Za-z0-9_$]+) = (?:async )?(?:\([^)]*\)|[A-Za-z_$][\w$]*) =>)/gm)) (fnNames[m[1] || m[2]] = fnNames[m[1] || m[2]] || []).push(f);
const day2 = /^(loading-bay|evening|escape|bay-watch|office-code|thought-place|pen-digits|line-split|crate-stamp)/;
const clash = Object.entries(fnNames).filter(([, fs]) => fs.length > 1 && fs.some((f) => day2.test(f)));
g.check("no Day 2 module shares a top-level function name with another module", clash.length === 0, clash);

// ---------- (d) the plant's spot ----------
const W = await import(M("bay-watch.js"));
const EV = await import(M("evening-place.js"));
const core = readFileSync(join(root, "src", "game", "00-core.js"), "utf8");
const plant = (core.match(/\{ x0: (\d+), x1: (\d+), y0: (\d+), y1: (\d+) \}, \/\/ plant \(locked bay pictures v3/) || []).slice(1).map(Number);
const wPlant = W.BAY_SOLIDS.find((b) => b.id === "plant");
g.check("the escape's bay plant is the locked v3 picture's (the older program's plant, grown by a person's feet)", plant.length === 4 && wPlant.x0 === plant[0] - 25 && wPlant.x1 === plant[1] + 25, { plant, wPlant });
const evPlant = EV.BAY_FURNITURE[0];
g.check("the evening's bay plant at night is the same plant", evPlant.x0 === plant[0] && evPlant.x1 === plant[1] && EV.EV_BAY.plant.x > evPlant.x0 && EV.EV_BAY.plant.x < evPlant.x1, { evPlant, plant: EV.EV_BAY.plant });

// 36b's robots mop lanes in the hall that keeps the lunch's crates and the plants: no lane runs through one
const { HALL_SNEAK } = await import(M("loading-bay-place.js"));
const { LUNCH_SOLIDS } = await import(M("lunch-sneak-place.js"));
const laneHits = [];
for (const [i, L] of HALL_SNEAK.lanes.entries())
  for (let x = L.x0; x <= L.x1; x += 4) {
    const feet = { x0: x - 22, x1: x + 22, y0: L.y - 12, y1: L.y + 8 };
    LUNCH_SOLIDS.forEach((b, j) => feet.x0 < b.x1 && feet.x1 > b.x0 && feet.y0 < b.y1 && feet.y1 > b.y0 && laneHits.push({ lane: i, x, solid: j }));
  }
g.check("36b: no cleaning robot's lane runs through the hall's crates, plants, stools or counter", laneHits.length === 0, laneHits.slice(0, 5));

// ---------- (a) and (b) in the game ----------
const { page, errors } = await g.open("?beat=bay:walkby", { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
await page.evaluate(() => window.__ss.lockedReady);
const joins = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op,
    bay = window.SSQ.beat("ch1-bay"),
    ev = window.SSQ.beat("ch1-evening"),
    order = [],
    jumps = [];
  const who = () => (bay.active() ? "bay:" + bay.debug().state.step + (n.ch1Evening && n.ch1Evening.step === "hallsneak" ? "/evening waits" : "") : ev.active() ? "evening:" + n.ch1Evening.step : n.ch1Evening && n.ch1Evening.step === "hallsneak" ? "evening:hallsneak" : "none");
  let prev = null;
  for (let i = 0; i < 9000; i++) {
    ss.tick(0.05);
    const w = who();
    order[order.length - 1] !== w && order.push(w);
    const at = { room: n.room, sq: { x: n.sq.x, y: n.sq.y }, mo: { x: n.mo.x, y: n.mo.y }, ctrl: n.ctrl };
    if (prev && prev.room === at.room && !prev.ctrl && !at.ctrl) for (const k of ["sq", "mo"]) Math.hypot(at[k].x - prev[k].x, at[k].y - prev[k].y) > 60 && jumps.push(k + " in " + at.room + " at " + w);
    prev = at;
    if (w === "evening:hide") break;
    if (n.cur && (n.cur.k === "bub" || n.cur.k === "card")) {
      n.bt = 1;
      ss.opTap();
      continue;
    }
    if (!n.ctrl || n.cur) continue;
    // the player: the hairball (ROLL · ball when the robot comes out), on along the hallway; the photo wall skipped,
    // into the hall's doorway; across the party hall to the snack counter's front
    const b = bay.active() && bay.debug().state;
    if (b && b.step === "walkby") {
      if (b.rollBy < 0 && b.office === 0) ((n.sq.x = 600), (n.sq.y = 360));
      else if (b.rollBy > 0 && !b.ball) {
        ss.tick(0.05);
        const o = ss.offerNow();
        o && o.f();
      } else if (b.rollBy < 0 && !b.ball && b.office >= 1) ((n.sq.x = 30), (n.sq.y = 340));
    } else if (b && b.step === "hall") ((n.sq.x = bay.place.HALL_SNEAK.goal.x), (n.sq.y = bay.place.HALL_SNEAK.goal.y));
    else if (ev.active() && n.ch1Evening.step === "wall") ((n.sq.x = ev.place.HALLWAY.left.x), (n.sq.y = ev.place.HALLWAY.left.y));
  }
  return { order, jumps, room: n.room, sq: { x: Math.round(n.sq.x), y: Math.round(n.sq.y) } };
});
const story = joins.order.filter((s) => /^(bay:(walkby|after|done|hall\/evening waits|hallout\/evening waits)|evening:(walkin|wall|tostorm|storm|hide))$/.test(s));
const want = ["bay:walkby", "bay:after", "evening:walkin", "evening:wall", "bay:hall/evening waits", "bay:hallout/evening waits", "evening:tostorm", "evening:storm", "evening:hide"];
const inOrder = want.every((s, i) => story.indexOf(s) >= 0 && (i === 0 || story.indexOf(s) > story.indexOf(want[i - 1])));
g.check("36 (the hairball) -> 37 (the photo wall) -> 36b (the party hall's robots, who roll out when he reaches the counter) -> 38a (the storm), in that order", inOrder && joins.room === "hall", joins.order);
g.check("nobody jumps across the room at a hand-over (more than 60 in a frame while the game moves them)", joins.jumps.length === 0, joins.jumps.slice(0, 5));
g.check("after 36b he is behind the counter's strip for the storm (the evening's spot), not where 36b left him", Math.hypot(joins.sq.x - 852, joins.sq.y - 326) < 70, joins.sq);

// (b) the crayon
const crayon = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op,
    out = {};
  const look = (b) => {
    n.q = [];
    n.cur = null;
    ss.ch1JumpBeat(b);
    for (let i = 0; i < 4; i++) ss.tick(0.05);
    n.room === "closet" ? ss.drawFrame() : ((n.room = "closet"), ss.drawFrame());
    const d = window.SSQ.crateStampDrawn();
    return { room: n.room, crayon: d.crayonNow };
  };
  out.morning = look(22);
  out.evening = look(40);
  out.escape = look(45);
  return out;
});
g.check("his crayon is in the crate bed's stamp on Day 2's morning, gone after he rubs it out (40), and in the escape (45)", crayon.morning.crayon && !crayon.evening.crayon && !crayon.escape.crayon, crayon);
// night one in the loading bay (the evening draws it): the walls are the bay's, not the party hall's counter
const nightBay = await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op;
  n.q = [];
  n.cur = null;
  ss.ch1JumpBeat(143);
  for (let i = 0; i < 40 && !(n.ctrl && !n.cur); i++) ss.tick(0.05);
  return { room: n.room, counter: ss.solids().some((b) => b.x0 === 806 && b.x1 === 862 && b.y0 === 350) };
});
g.check("in the loading bay at night none of the party hall's solids stand in his way (the mailbox can be reached)", nightBay.room === "hangar" && !nightBay.counter, nightBay);
g.check("no page errors", errors.length === 0, errors.slice(0, 5));
await g.finish("day2-joins");
