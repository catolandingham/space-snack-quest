/**
 * The home song is the two old lines, then Mops leaves.
 * The sing-along chip stays until those lines have played.
 * Then the "That evening…" card. The floor arrows are gone (scene 1 review, 2026-11-14).
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
  n.ch1PeekReady = false;
  n.ch1MopsLeave = 0;
  n.ch1Chip = "Squatch: sing along with Mops";
  n.sqPose = "stand";
  n.sq.x = 400;
  n.sq.y = 520;
  n.mo.x = 730;
  n.mo.y = 420;
  n.mo.f = -1;
  ss.tick(0.05);
  const musicBefore = ss.music;
  const offer = ss.offerNow();
  const from = n.mo.x;
  offer.f();
  let steps = 0;
  for (let i = 0; i < 200 && !(n.cur && n.cur.k === "bub"); i++) {
    ss.tick(0.05);
    steps++;
  }
  const traveled = Math.hypot(n.mo.x - from, n.mo.y - 420);
  // The song is at the door: Mops (by the door) is right of Squatch.
  const arrived = n.mo.x > n.sq.x && n.mo.x > 760 && traveled > 40;
  const facing = n.mo.f === -1 && n.sq.f === 1;
  // Drawn sizes in this room: Mops facing left reaches 94px left and 66px right of his feet.
  // Squatch singing, facing right, reaches 63px left and 61px right.
  const props = [
    { x0: 83, x1: 290, y0: 400, y1: 530 },
    { x0: 309, x1: 375, y0: 470, y1: 525 },
    { x0: 530, x1: 650, y0: 508, y1: 575 },
  ];
  const hits = (a, b) => a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;
  const blocked = [];
  let songAt = null;
  let gap = 0;
  const noteBodies = () => {
    const sqB = { x0: n.sq.x - 63, x1: n.sq.x + 61, y0: n.sq.y - 154, y1: n.sq.y };
    const moB = { x0: n.mo.x - 94, x1: n.mo.x + 66, y0: n.mo.y - 155, y1: n.mo.y };
    gap = Math.round(moB.x0 - sqB.x1);
    songAt = [Math.round(n.sq.x), Math.round(n.sq.y), Math.round(n.mo.x), Math.round(n.mo.y), gap];
    if (gap < 20) blocked.push("gap " + gap);
    for (const p of props) {
      if (hits(sqB, p)) blocked.push("squatch");
      if (hits(moB, p)) blocked.push("mops");
    }
  };
  const lines = [];
  const musicDuring = [];
  let chipDuring = "";
  let pose = "";
  const faces = [];
  for (let i = 0; i < 8; i++) {
    const c = n.cur;
    if (c && c.k === "bub") {
      if (!lines.includes(c.b.text)) lines.push(c.b.text);
      if (c.b.style === "song") (ss.tick(0.05), musicDuring.push(ss.music));
      if (!chipDuring) {
        chipDuring = n.ch1Chip;
        pose = n.sqPose;
      }
      ss.drawFrame();
      const b = ss.lastBubble;
      if (b && b.head) {
        const top = b.y - 16;
        const hit = b.x < b.head.x + b.head.w && b.x + b.w > b.head.x && top < b.head.y + b.head.h && top + b.h + 16 > b.head.y;
        faces.push({ who: b.who, hit, y: Math.round(b.y), head: Math.round(b.head.y) });
      }
      noteBodies();
    }
    n.bt = 1;
    ss.opTap();
    ss.tick(0.05);
  }
  const chipBeforeLeave = n.ch1Chip;
  // Once the tune has finished (a few seconds), the warm theme comes back.
  let backAfter = -1;
  for (let i = 0; i < 40 && backAfter < 0; i++) (ss.tick(0.25), ss.music === "warm" && (backAfter = (i + 1) * 0.25));
  const musicAfter = ss.music;
  let left = false;
  for (let i = 0; i < 100 && n.moPose !== "hidden"; i++) ss.tick(0.05);
  left = n.moPose === "hidden";
  // Then the "That evening…" card; tap through it.
  let evening = false;
  for (let i = 0; i < 60 && !n.ctrl; i++) {
    n.cur && n.cur.k === "card" && /^That evening/.test(n.cur.text || "") && (evening = true);
    n.bt = 1;
    ss.opTap();
    ss.tick(0.1);
  }
  return {
    backAfter,
    musicBefore,
    musicDuring,
    musicAfter,
    evening,
    verb: offer && offer.verb,
    steps,
    arrived,
    facing,
    lines,
    chipDuring,
    pose,
    faces,
    chipBeforeLeave,
    left,
    chipAfter: n.ch1Chip,
    ctrl: n.ctrl,
    goodbye: lines.some((t) => t.includes("See you after work")),
    blocked,
    songAt,
    gap,
  };
});
g.check("SING is the action", song.verb === "SING", song);
g.check("they meet at the door before anyone sings", song.arrived && song.steps > 2 && song.lines[0] === "\u266A I'm floating in space! \u266A", song);
g.check("singing or music, never both: the warm music stops while they sing and comes back after", song.musicBefore === "warm" && song.musicDuring.length === 2 && song.musicDuring.every((m) => m === "") && song.musicAfter === "warm", song);
g.check("Mops and Squatch face each other", song.facing, song);
g.check("Mops answers with the old line", song.lines[1] === "\u266A Baaa-aa-aaa! \u266A", song);
g.check("the goodbye stand-in is gone", song.goodbye === false, song);
g.check("the sing-along chip is still up while he is singing", song.chipDuring === "Squatch: sing along with Mops", song);
g.check("he is in the singing pose for his line", song.pose === "sing", song);
g.check("the singers have a clear gap and miss the bucket, the G box, and the crate", song.blocked.length === 0 && song.gap >= 20 && song.gap <= 60, song);
g.check("song bubbles stay off both faces", song.faces.length === 2 && song.faces.every((f) => !f.hit), song.faces);
g.check("the peek chip waits until Mops has left and control is back", song.chipBeforeLeave !== "Squatch: peek out the door" && song.left && song.ctrl && song.chipAfter === "Squatch: peek out the door", song);

g.check('the "That evening…" card comes after Mops leaves', song.evening, song);
g.check("the floor arrows are gone (scene 1 review)", !/function drawWalkNudge/.test(readFileSync(new URL("../src/game/12-ch1-redesign.js", import.meta.url), "utf8")));

g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("opening-song");
