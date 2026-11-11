/**
 * Nov 11 playtest fixes on the live chapter (not the party slice).
 * Esc skips a run of story cards and does not draw SKIP.
 * The desktop NEXT slot keeps its height, so the picture does not jump.
 * The night cone keeps its numbers and draws an edge plus the feet circle.
 * Mops stands clear of the home mop bucket.
 *   node tests/playtest-fixes.mjs
 */
import { startGame, sleep } from "./game-page.mjs";

const g = await startGame({ port: 8811, name: "playtest-fixes" });
const { ctx, page, errors } = await g.open("?ch=1", { width: 1100, height: 800 });

const top = () => page.evaluate(() => document.querySelector("canvas").getBoundingClientRect().top);

const before = await page.evaluate(() => {
  const n = window.__ss.op;
  const canvas = document.querySelector("canvas");
  return {
    card: !!(n.cur && n.cur.k === "card" && n.cur.id !== "fb"),
    skipGate: window.__ss.cutActive(),
    text: document.body.innerText,
    key: window.__ss.ssqKey("vol"),
    focused: document.activeElement === canvas,
  };
});
g.check("the opening is a story card", before.card, before);
g.check("the picture has the keyboard without a click", before.focused, before);
g.check("a story card does not turn on the flashback SKIP gate", before.skipGate === false, before);
g.check("the page does not say SKIP", !/\bSKIP\b/.test(before.text), before.text.slice(0, 240));
g.check("localhost keeps the live save prefix", before.key === "ssq-vol", before.key);
const topWithNext = await top();

await page.evaluate(() => {
  const canvas = document.querySelector("canvas");
  canvas.blur();
  document.body.focus();
  document.dispatchEvent(new KeyboardEvent("keydown", { code: "Escape", bubbles: true }));
  document.dispatchEvent(new KeyboardEvent("keyup", { code: "Escape", bubbles: true }));
});
await sleep(250);
const topAfter = await top();
const skipped = await page.evaluate(() => {
  const n = window.__ss.op;
  return { card: !!(n.cur && n.cur.k === "card"), scene: n.scene, ctrl: n.ctrl, step: n.cur && n.cur.k };
});
g.check("Esc leaves the opening cards", skipped.card === false && skipped.scene === "O1" && skipped.ctrl === true, skipped);
g.check("the picture stays put when NEXT hides", Math.abs(topWithNext - topAfter) < 2, { topWithNext, topAfter });

const home = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.moved = 200;
  for (let i = 0; i < 8; i++) ss.tick(0.05);
  n.cur = null;
  n.q = [];
  ss.drawFrame();
  const cv = document.querySelector("canvas");
  const k = cv.width / 960;
  const px = (x, y) => Array.from(cv.getContext("2d", { willReadFrequently: true }).getImageData(Math.round(x * k), Math.round(y * k), 1, 1).data);
  return { scene: n.scene, mo: [n.mo.x, n.mo.y], bucket: px(545, 530) };
});
g.check("Mops stands left of the mop bucket", home.scene === "Q1" && home.mo[0] === 220 && home.mo[1] === 540, home);
g.check("the bucket rim stays yellow", home.bucket[0] > 180 && home.bucket[1] > 140 && home.bucket[2] < 160, home.bucket);

const line = await page.evaluate(() => {
  const n = window.__ss.op;
  n.cur = { k: "bub", b: { who: "mops", text: "Stay.", style: "say" } };
  n.bt = 1;
  window.dispatchEvent(new KeyboardEvent("keydown", { code: "Escape", bubbles: true }));
  const still = n.cur && n.cur.k === "bub" && n.cur.b.text === "Stay.";
  n.cur = null;
  return still;
});
g.check("Esc does not skip a spoken line", line === true, line);

const night = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.scene = "Q4";
  n.room = "hangar";
  n.ch1D = true;
  n.ch1Night = true;
  n.ch1Alert = false;
  n.sqPose = "stand";
  n.sq.x = 140;
  n.sq.y = 540;
  n.cur = null;
  n.q = [];
  ss.drawFrame();
  const cone = ss.conesDrawn().filter((c) => c.ox === ss.CH1_ROBOT.x && c.len === 210);
  const cv = document.querySelector("canvas");
  const k = cv.width / 960;
  const px = (x, y) => Array.from(cv.getContext("2d", { willReadFrequently: true }).getImageData(Math.round(x * k), Math.round(y * k), 1, 1).data);
  const ring = px(ss.CH1_ROBOT.x + 70, ss.CH1_ROBOT.y);
  const outside = px(ss.CH1_ROBOT.x + 90, ss.CH1_ROBOT.y);
  return {
    n: cone.length,
    half: cone[0] && cone[0].half,
    len: cone[0] && cone[0].len,
    oy: cone[0] && cone[0].oy,
    ring,
    outside,
    feet: ss.STAND_FEET,
  };
});
g.check(
  "the night cone keeps its length, width, and origin",
  night.n === 1 && night.half === 0.42 && night.len === 210 && night.oy === 372 && night.feet === 70,
  night,
);
const diff = Math.abs(night.ring[0] - night.outside[0]) + Math.abs(night.ring[1] - night.outside[1]) + Math.abs(night.ring[2] - night.outside[2]);
g.check("the feet circle is drawn at the same 70px radius", diff > 25, { ring: night.ring, outside: night.outside, diff });

const saved = await page.evaluate(() => {
  window.__ss.cycleVol();
  return {
    live: window.localStorage.getItem("ssq-vol"),
    bugs: window.localStorage.getItem("ssq-bugs-vol"),
  };
});
g.check("a local save still uses ssq-vol", saved.live !== null && saved.bugs === null, saved);

const patrol = await page.evaluate(() => {
  const ss = window.__ss;
  const n = ss.op;
  n.scene = "Q4";
  n.room = "hangar";
  n.ch1D = true;
  n.ch1Night = true;
  n.ctrl = true;
  n.sqPose = "stand";
  const at = (t, x, y) => {
    n.ch1LookT = t;
    const look = ss.ch1NightLook(t);
    ss.drawFrame();
    const cone = ss.conesDrawn().find((c) => c.len === 210);
    return { catch: look.catch, face: look.face, seen: ss.ch1CaughtAt(x, y, "stand"), drawn: cone && cone.a };
  };
  return {
    down: at(0, 480, 540),
    bin: at(0, 210, 540),
    mail: at(0, 800, 540),
    turn: at(2.15, 480, 540),
    away: at(4, 480, 540),
    feet: at(4, 480, 410),
    back: at(6.45, 480, 540),
    again: at(6.6, 480, 540),
    len: ss.STAND_CONE_LEN,
    half: ss.STAND_CONE_HALF,
    feetR: ss.STAND_FEET,
  };
});
const near = (a, b) => Math.abs(a - b) < 0.05;
g.check("the cone numbers are still 210, 0.42, and 70", patrol.len === 210 && patrol.half === 0.42 && patrol.feetR === 70, patrol);
g.check("looking down, the middle of the floor is caught and the bin and mailbox are not", patrol.down.seen && patrol.down.catch && !patrol.bin.seen && !patrol.mail.seen, patrol);
g.check("the turn swings the cone and does not catch", !patrol.turn.catch && !patrol.turn.seen && near(patrol.turn.face, 0) && near(patrol.turn.drawn, 0), patrol.turn);
g.check("looking at the back wall, the floor is clear and the feet circle still catches", patrol.away.catch && !patrol.away.seen && near(patrol.away.face, -Math.PI / 2) && patrol.feet.seen, patrol);
g.check("he turns back without catching, then looks down again", !patrol.back.catch && !patrol.back.seen && patrol.again.catch && patrol.again.seen && near(patrol.again.face, Math.PI / 2), patrol);

g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("playtest-fixes");
