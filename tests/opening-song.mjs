/**
 * The home song is the two old lines, then Mops leaves.
 * The sing-along chip stays until those lines have played.
 * The bedroom arrows point left, away from the bucket.
 *   node tests/opening-song.mjs
 */
import { readFileSync } from "node:fs";
import { startGame } from "./game-page.mjs";

const g = await startGame({ port: 8844, name: "opening-song" });
const { ctx, page, errors } = await g.open("?ch=1");

const song = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.q = [];
  n.cur = null;
  n.live = [];
  n.scene = "Q1";
  n.room = "closet";
  n.ctrl = true;
  n.ch1Song = true;
  n.ch1Party = false;
  n.ch1Chip = "Squatch: sing along with Mops";
  n.sqPose = "stand";
  n.sq.x = 400;
  n.sq.y = 520;
  n.mo.x = 730;
  n.mo.y = 420;
  const offer = ss.offerNow();
  offer.f();
  const lines = [];
  let chipDuring = "";
  let pose = "";
  for (let i = 0; i < 8; i++) {
    ss.tick(0.05);
    const c = n.cur;
    if (c && c.k === "bub") {
      if (!lines.includes(c.b.text)) lines.push(c.b.text);
      if (!chipDuring) {
        chipDuring = n.ch1Chip;
        pose = n.sqPose;
      }
    }
    n.bt = 1;
    ss.opTap();
  }
  return {
    verb: offer && offer.verb,
    lines,
    chipDuring,
    pose,
    chipAfter: n.ch1Chip,
    goodbye: lines.some((t) => t.includes("See you after work")),
  };
});
g.check("SING is the action", song.verb === "SING", song);
g.check("Squatch sings the old line first", song.lines[0] === "\u266A I'm floating in space! \u266A", song);
g.check("Mops answers with the old line", song.lines[1] === "\u266A Baaa-aa-aaa! \u266A", song);
g.check("the goodbye stand-in is gone", song.goodbye === false, song);
g.check("the sing-along chip is still up while he is singing", song.chipDuring === "Squatch: sing along with Mops", song);
g.check("he is in the singing pose for his line", song.pose === "sing", song);
g.check("the sing-along chip clears after the song", song.chipAfter === "Squatch: peek out the door", song);

const arrows = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.q = [];
  n.cur = null;
  n.scene = "O1";
  n.room = "closet";
  n.ctrl = true;
  n.moved = 0;
  n.ch1Song = false;
  ss.drawFrame();
  const c = document.querySelector("canvas");
  const g2 = c.getContext("2d", { willReadFrequently: true });
  const at = (x, y) => {
    const p = g2.getImageData(x, y, 1, 1).data;
    return [p[0], p[1], p[2]];
  };
  // First arrow points left: the head is up-left of the shaft, not up-right.
  return { head: at(410, 514), tailUp: at(448, 514), shaft: at(434, 530) };
});
const headY = (p) => p && p[0] > 170 && p[1] > 130 && p[2] < 140 && p[0] > p[2] + 40;
g.check("the bedroom arrows are on the floor", headY(arrows.shaft), arrows);
g.check("the arrow head is on the left, away from the bucket", headY(arrows.head) && !headY(arrows.tailUp), arrows);

const src = readFileSync(new URL("../src/game/12-ch1-redesign.js", import.meta.url), "utf8");
g.check("the arrow direction is the one-line flip", /let dir = -1/.test(src));

g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("opening-song");
