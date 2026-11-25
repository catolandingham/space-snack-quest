// A phone video of the party night's first half (P1 to P5), played by touch only (taps on the picture and on the
// big button, a finger dragging the dress-up pieces), for Brian (showing 2). It plays one catch (the LOCKUP card)
// and one "They lost you." on purpose, then the rest straight through, and ends as he walks into the party in
// disguise (P6, src/modules/party-free.js), a few seconds into its free play.
//   npm run build && node tools/party-video.mjs        -> tests/out/party-video/party-half-one.mp4
//   PARTY_VIDEO_OUT=/some/folder node tools/party-video.mjs
// It reads the game only to know when to act (the scene, the glancer's rhythm, where the pieces are).
import { mkdirSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { startGame, sleep, root } from "../tests/game-page.mjs";

const OUT = process.env.PARTY_VIDEO_OUT || join(root, "tests", "out", "party-video");
rmSync(join(OUT, "fr"), { recursive: true, force: true });
mkdirSync(join(OUT, "fr"), { recursive: true });
const g = await startGame({ port: 8992, name: "party-video" });
const { page, errors } = await g.open("?beat=party", { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
await sleep(1500);
let shooting = true,
  shot = 0;
const t0 = Date.now();
(async () => {
  while (shooting) {
    try {
      await page.screenshot({ path: join(OUT, "fr", String(shot++).padStart(5, "0") + ".jpg"), type: "jpeg", quality: 70 });
    } catch {}
    await sleep(90);
  }
})();
const tap = async (x, y) => (await page.touchscreen.touchStart(x, y), await sleep(50), await page.touchscreen.touchEnd());
const st = () =>
  page.evaluate(() => {
    const n = window.__ss.op,
      c = n.cur,
      b = document.querySelector('[role="button"]'),
      r = b && b.getBoundingClientRect(),
      cv = document.querySelector("canvas").getBoundingClientRect();
    return { act: n.act ? n.act.verb : "", now: window.SSQ.beat("ch1-party").now(), cur: c ? c.k : "", id: c ? c.id || "" : "", ctrl: n.ctrl, room: n.room, btn: r ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null, cv: [cv.x, cv.y, cv.width, cv.height], sq: [n.sq.x, n.sq.y], dress: window.SSQ.beat("ch1-party").dressTargets() };
  });
const floor = async (s, x, y) => tap(s.cv[0] + (x * s.cv[2]) / 960, s.cv[1] + (y * s.cv[3]) / 640);
const press = async (s) => s.btn && tap(s.btn.x, s.btn.y);
const until = async (f, ms = 20000, each) => {
  const end = Date.now() + ms;
  for (;;) {
    const s = await st();
    if (f(s)) return s;
    if (Date.now() > end) return null;
    each && (await each(s));
    await sleep(120);
  }
};
// Lines and cards: tap once each, after a moment to read.
let lastTapped = "";
const readOn = async (s) => {
  if (s.cur === "bub" || s.cur === "card") {
    const key = s.cur + s.id + JSON.stringify(s.now && s.now.scene);
    await sleep(1100);
    await tap(187, 300);
    lastTapped = key;
  }
};
const log = (m) => console.log(((Date.now() - t0) / 1000).toFixed(1) + "s " + m);

// P1: walk to the door, PEEK · door, read the peek.
let s = await st();
await sleep(1500);
await floor(s, 880, 470);
s = await until((q) => q.act === "PEEK" && q.ctrl, 8000);
await sleep(800);
log("PEEK");
await press(await st());
await until((q) => q.now && q.now.scene === "P2" && q.ctrl, 40000, readOn);
// P2, the catch: wait for the glancer's look and step up into it, then stay.
log("P2: step into the glancer's look");
await until((q) => q.now && q.now.glance === "warn", 12000);
s = await st();
await floor(s, 490, 500);
await until((q) => q.cur === "card" && q.id === "jail", 30000);
log("LOCKUP");
await sleep(1800);
await until((q) => q.now && q.now.scene === "P2" && q.ctrl && !q.cur, 20000, readOn);
// P2, "They lost you.": seen again, then into the plant.
log("P2: seen again, hide in the plant");
await until((q) => q.now && q.now.glance === "warn", 12000);
s = await st();
await floor(s, 490, 500);
await until((q) => q.now && (q.now.alarm === "run" || q.now.alarm === "ring"), 10000);
s = await st();
await floor(s, 400, 552);
await until((q) => q.act === "HIDE", 5000);
await sleep(300);
await press(await st());
await until((q) => q.now && q.now.scene === "P3", 30000);
log("P3");
await until((q) => q.now && q.now.scene === "P4" && q.ctrl, 60000, readOn);
// P4, the flyer sneak: out of the plant, round the dancers' sight to the flyer on the stage's end (the way
// tests/party-flyer.mjs maps), GRAB · flyer, back the same way and home; his two thoughts at home.
log("P4");
await sleep(1800);
const walkTo = async (x, y, ok) => {
  await floor(await st(), x, y);
  await until((q) => (ok && ok(q)) || Math.hypot(q.sq[0] - x, q.sq[1] - y) < 16, 8000);
};
for (const [x, y] of [[470, 585], [520, 575], [520, 400]]) await walkTo(x, y);
await walkTo(536, 332, (q) => q.act === "GRAB");
await until((q) => q.act === "GRAB", 4000);
await sleep(700);
await press(await st());
await until((q) => q.now && q.now.flyer === "paw" && q.ctrl, 4000);
for (const [x, y] of [[520, 400], [520, 575]]) await walkTo(x, y);
await floor(await st(), 477, 600);
await until((q) => q.now && q.now.scene === "P5" && q.ctrl, 30000, readOn);
// P5: to the closet, dress up, out the door.
log("P5");
await sleep(1000);
await floor(await st(), 150, 400);
await until((q) => q.act === "OPEN" && q.ctrl, 8000);
await sleep(1200);
await press(await st());
await sleep(1200);
const dragTo = async (from, to) => {
  await page.touchscreen.touchStart(from.x, from.y);
  for (let k = 1; k <= 12; k++) (await page.touchscreen.touchMove(from.x + ((to.x - from.x) * k) / 12, from.y + ((to.y - from.y) * k) / 12), await sleep(45));
  await page.touchscreen.touchEnd();
  await sleep(900);
};
for (const [id, spot] of [
  ["boots", "head"],
  ["stache", "face"],
  ["shirt", "body"],
  ["tutu", "legs"],
]) {
  const d = (await st()).dress;
  const p = d && d.pieces.find((q) => q.id === id);
  p && (await dragTo(p, d.spots[spot]));
}
await sleep(1500);
const d = (await st()).dress;
d && d.go && (await tap(d.go.x, d.go.y));
await sleep(1500);
log("out to the party");
await floor(await st(), 860, 470);
const p6 = await until((q) => q.now && q.now.scene === "P6" && q.ctrl, 15000);
log(p6 ? "P6: the party in disguise" : "P6 did not start");
await sleep(3000);
shooting = false;
await sleep(400);
const secs = (Date.now() - t0) / 1000,
  fps = Math.max(1, shot / secs).toFixed(2),
  mp4 = join(OUT, "party-half-one.mp4");
const ff = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-framerate", fps, "-i", join(OUT, "fr", "%05d.jpg"), "-vf", "scale=750:-2", "-r", "15", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "26", mp4]);
console.log(ff.status === 0 ? `Video: ${mp4} (${secs.toFixed(0)} s)` : "Video not made (is ffmpeg installed?)");
console.log("errors", errors.slice(0, 5));
await g.finish("party-video");
