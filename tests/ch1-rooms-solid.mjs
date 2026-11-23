/**
 * Squatch cannot walk up the walls or through the furniture drawn in Chapter 1's locked rooms.
 * Brian raised this again and again ("then it let me climb the walls", things walked through; see
 * docs/ch1-design-audit-2026-11-22/angles/repeat-issues.md, issue 11).
 *
 * Numbers come from the locked pictures in docs/locked-rooms/ (1280 x 830), which the game stretches
 * onto its 960 x 640 picture: game x = picture x * 0.75, game y = picture y * 640 / 830.
 *   - The wall meets the floor at picture row 332 in the hall, hallway, office and delivery-room
 *     pictures (read off the pictures' baseboard line), which is game y 256. Feet above that are on
 *     the wall.
 *   - Furniture boxes are the bottom strip of each object, where its feet stand on the floor.
 *   - Getting past an object counts too: the game pushes Squatch out of a solid to its nearest side, so
 *     a thin solid can be crossed without his feet ever being seen inside it. Sliding along its side is fine.
 *
 * Each room: (a) walking up from a row of points along the floor stops at or below the floor line;
 * (b) walking into each object from four sides, at a normal frame and at the game's slowest frame (its
 *     longest step), never puts Squatch's feet inside it or past it.
 *   node tests/ch1-rooms-solid.mjs
 */
import { startGame } from "./game-page.mjs";

const FLOOR_Y = 256;
const pic = (x0, x1, y0, y1) => ({ x0: Math.round(x0 * 0.75), x1: Math.round(x1 * 0.75), y0: Math.round((y0 * 640) / 830), y1: Math.round((y1 * 640) / 830) });

const ROOMS = [
  { id: "party hall, outside the party (lunch on Day 2)", set: { room: "hall", scene: "Q3", ch1D: true, ch1Party: false }, floor: true, things: [] },
  { id: "hallway", set: { room: "passage", scene: "QP", ch1D: true }, floor: true, things: [] },
  {
    id: "manager's office",
    set: { room: "office", scene: "Q9", ch1D: true, ch1Office: true },
    floor: true,
    things: [
      { name: "filing cabinet", box: pic(78, 222, 630, 660) },
      { name: "desk", box: pic(782, 1180, 680, 715) },
    ],
  },
  {
    id: "loading bay by day",
    set: { room: "hangar", scene: "Q4", ch1D: true, ch1Night: false },
    floor: true,
    things: [
      { name: "plant", box: pic(137, 197, 455, 480) },
      { name: "bin", box: pic(252, 316, 465, 485) },
      { name: "left post of the scanner arch", box: pic(465, 485, 515, 540) },
      { name: "right post of the scanner arch", box: pic(757, 777, 515, 540) },
      { name: "mail room wall, above its door", box: pic(911, 921, 467, 545) },
      { name: "mail room wall, below its door", box: pic(911, 921, 657, 790) },
      { name: "robot mailbox", box: pic(1131, 1211, 590, 617) },
    ],
  },
];

const g = await startGame({ port: 8963, name: "ch1-rooms-solid" });
const { page, ctx, errors } = await g.open("?ch=1");
await page.click("canvas");

async function place(room, x, y) {
  await page.evaluate(
    ([set, x, y]) => {
      const ss = window.__ss, n = ss.op;
      Object.assign(n, { q: [], cur: null, ch1Party: false, ch1Office: false, ch1Night: false }, set);
      Object.assign(n, { ctrl: true, sqPose: "stand", walkTo: null, moPose: "hidden" });
      ss.hall.camX = 0;
      n.sq.x = x;
      n.sq.y = y;
    },
    [room.set, x, y],
  );
}
// Holds a key for `steps` frames; returns the end point and the frames where the feet were inside `box`.
// dt is one frame; the game never steps more than 0.05 s at once (90-input-shell.js), its longest step.
async function walk(key, steps, box, dt = 1 / 30) {
  await page.keyboard.down(key);
  const r = await page.evaluate(
    ([steps, box, dt]) => {
      const n = window.__ss.op;
      let inside = 0, minY = n.sq.y;
      for (let i = 0; i < steps; i++) {
        window.__ss.tick(dt);
        minY = Math.min(minY, n.sq.y);
        if (box && n.sq.x > box.x0 + 2 && n.sq.x < box.x1 - 2 && n.sq.y > box.y0 + 2 && n.sq.y < box.y1 - 2) inside++;
      }
      return { x: Math.round(n.sq.x), y: Math.round(n.sq.y), minY: Math.round(minY), inside };
    },
    [steps, box, dt],
  );
  await page.keyboard.up(key);
  return r;
}

for (const room of ROOMS) {
  if (room.floor) {
    const high = [];
    for (let x = 140; x <= 820; x += 85) {
      await place(room, x, 520);
      const e = await walk("ArrowUp", 120);
      if (e.minY < FLOOR_Y) high.push({ from: x, feetUpTo: e.minY });
    }
    g.check(`${room.id}: walking up stops on the floor, not up the wall (feet at y ${FLOOR_Y} or lower)`, high.length === 0, high);
  }
  for (const t of room.things) {
    const b = t.box, cx = Math.round((b.x0 + b.x1) / 2), cy = Math.round((b.y0 + b.y1) / 2);
    const tries = [
      ["from below", cx, b.y1 + 40, "ArrowUp", (e) => e.y < b.y0 && e.x > b.x0 && e.x < b.x1],
      ["from above", cx, Math.max(FLOOR_Y + 6, b.y0 - 40), "ArrowDown", (e) => e.y > b.y1 && e.x > b.x0 && e.x < b.x1],
      ["from the left", b.x0 - 40, cy, "ArrowRight", (e) => e.x > b.x1 && e.y > b.y0 && e.y < b.y1],
      ["from the right", b.x1 + 40, cy, "ArrowLeft", (e) => e.x < b.x0 && e.y > b.y0 && e.y < b.y1],
    ];
    const through = [];
    for (const dt of [1 / 30, 0.05])
      for (const [side, x, y, key, crossed] of tries) {
        await place(room, x, y);
        const e = await walk(key, 75, b, dt);
        if (e.inside || crossed(e)) through.push({ side, dt, end: [e.x, e.y], framesInside: e.inside });
      }
    g.check(`${room.id}: Squatch cannot walk into the ${t.name}`, through.length === 0, through);
  }
}
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("ch1-rooms-solid");
