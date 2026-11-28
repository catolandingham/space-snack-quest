/**
 * The party robot: plays the party in disguise (P6) like a kid on a phone, to see whether three minutes with no
 * goal chips is fun and fair (party plan, step 3: "Is three minutes fun with no chips? Tune here, before polish").
 * It walks to the toys in its own order (or a random one with ROBOT_SEED), dances, joins the conga, stands in the
 * group photo (JOIN · photo when the first song ends), swipes snacks (GRAB · snacks at the bar), meets the octopus,
 * and taps NEXT on every line. After an alarm it runs home, hides under the bed and answers the "more to find" card
 * ("Back to the party" the first time, then "Keep going"; ROBOT_CHOICE=keep or back picks one every time). It is not a test suite: it prints
 * what happened (toys done, stars, catches, how the party ended, how long it took) and can save a phone-size video.
 *   node tools/party-robot.mjs                 one run, toys in the planned order
 *   ROBOT_SEED=3 node tools/party-robot.mjs    one run, toys in a shuffled order, wandering between them
 *   ROBOT_VIDEO=<folder>                       saves a frame every 0.25 s and joins them into party.mp4 (ffmpeg)
 *   ROBOT_START=party:P6                       where to start (default: the dress-up's end, party:P6)
 *   ROBOT_DANCE_TAPS=12                        leaves the dance by its close button after that many moves
 *   ROBOT_ORDER=dance,snacks,conga             the toys to visit, in this order (default: dance, snacks, conga, octopus)
 *   ROBOT_WAIT=560,330                         where it waits on the open floor once its toys are done
 */
import { mkdirSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { startGame, sleep } from "../tests/game-page.mjs";

const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
const SEED = +(process.env.ROBOT_SEED || 0);
const VIDEO = process.env.ROBOT_VIDEO || "";
const MAX_S = +(process.env.ROBOT_MAX_S || 320);
let rnd = SEED || 1;
const rand = () => ((rnd = (rnd * 16807) % 2147483647), rnd / 2147483647);

const g = await startGame({ port: +(process.env.ROBOT_PORT || 9103), name: "party-robot" });
const { page, errors } = await g.open("?beat=" + (process.env.ROBOT_START || "party:P6"), PHONE);
await sleep(1500);
if (VIDEO) (rmSync(join(VIDEO, "fr"), { recursive: true, force: true }), mkdirSync(join(VIDEO, "fr"), { recursive: true }));

const st = () =>
  page.evaluate(() => {
    const n = window.__ss.op,
      b = window.SSQ.beat("ch1-party"),
      now = b.now();
    return { now, room: n.room, ctrl: !!n.ctrl, cur: n.cur ? n.cur.k : "", act: n.act ? n.act.verb : "", x: n.sq.x, y: n.sq.y, stars: n.stars || 0, full: !!document.querySelector('canvas[aria-label="dance"]'), card: n.cur && n.cur.id === "jail" };
  });
const walk = (x, y) => page.evaluate((p) => window.__ss.tapAt(p[0], p[1]), [x, y]);
const press = () => page.evaluate(() => (window.__ss.actionDown(), window.__ss.actionUp()));
const next = () => page.evaluate(() => window.__ss.opTap());
const pointer = (k, x, y) => page.evaluate((a) => window.__ss.ch1Pointer(a[0], a[1], a[2]), [k, x, y]);
const layout = await page.evaluate(() => window.SSQ.beat("ch1-party").snackLayout());

// The toys and where to go for each (game positions).
const TOYS = {
  dance: { x: 470, y: 362 },
  snacks: { x: layout.spot.x - 10, y: layout.spot.y + 10, act: "GRAB" },
  conga: null, // the tail of the line, when it is on
  octopus: { x: 740, y: 560 },
  plant: { x: 420, y: 540 },
};
let order = process.env.ROBOT_ORDER ? process.env.ROBOT_ORDER.split(",") : ["dance", "snacks", "conga", "octopus"];
if (SEED) order = order.map((k) => [rand(), k]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
const log = [];
let goal = 0,
  frames = 0,
  catches = 0,
  lastCard = false,
  danceTaps = 0;
const t0 = Date.now();
let lastShot = 0;
for (;;) {
  const s = await st();
  const secs = (Date.now() - t0) / 1000;
  if (VIDEO && Date.now() - lastShot > 250) ((lastShot = Date.now()), await page.screenshot({ path: join(VIDEO, "fr", String(frames++).padStart(5, "0") + ".png") }));
  if (secs > MAX_S) (log.push("time out"), 0);
  if (secs > MAX_S) break;
  if (s.card && !lastCard) catches++;
  lastCard = s.card;
  if (!s.now || s.now.scene === "done") {
    log.push(`${Math.round(secs)}s the party is over: scene ${await page.evaluate(() => window.__ss.op.scene)}, ${s.cur} ${await page.evaluate(() => (window.__ss.op.cur && (window.__ss.op.cur.id || (window.__ss.op.cur.b && window.__ss.op.cur.b.text))) || "")}`);
    break;
  }
  // the "more to find" card: a finger on one of its buttons
  if (s.now.card) {
    const T = await page.evaluate(() => window.SSQ.beat("ch1-party").cardTargets()),
      want = process.env.ROBOT_CHOICE || (log.some((l) => l.includes("card: back")) ? "keep" : "back"),
      b = T[want] || T.keep;
    log.push(`${Math.round(secs)}s card: ${T[want] ? want : "keep"} (found ${Object.keys(T.got).filter((k) => T.got[k]).join(",") || "nothing"})`);
    await page.touchscreen.tap(b.x, b.y);
    await sleep(500);
    continue;
  }
  // the group photo's Polaroid: a tap closes it
  if (s.now.shot && s.now.shot.phase === "polaroid") {
    await sleep(900);
    await page.touchscreen.tap(190, 640);
    log.push(`${Math.round(s.now.ft)}s in the group photo`);
    await sleep(400);
    continue;
  }
  if (s.now.scene === "P8a" || s.now.scene === "P8b") {
    // the endings: walk to Mops when he is there, tap through the lines
    if (s.cur === "bub" || s.cur === "card" || s.cur === "panel") await next();
    else if (s.now.mops && s.ctrl) await walk(s.now.mops.x - 40, s.now.mops.y + 10);
    await sleep(200);
    continue;
  }
  if (s.cur === "bub" || s.cur === "card" || s.cur === "panel" || s.cur === "wait") {
    await sleep(700);
    await next();
    continue;
  }
  if (s.full) {
    // a kid who has had enough leaves by the close button (top right)
    if (process.env.ROBOT_DANCE_TAPS && danceTaps >= +process.env.ROBOT_DANCE_TAPS) {
      await page.touchscreen.tap(375 - 36, 36);
      await sleep(400);
      continue;
    }
    // the dance: tap the spot that glows on him, a kid's rhythm (the dance notes where it is on the screen)
    const glow = await page.evaluate(() => ((d) => (d && d.live && d.seen && d.seen.glow) || null)(window.__ss.op.ch1PartyNow.dance));
    glow && (await page.touchscreen.tap(glow.x, glow.y), danceTaps++);
    // one routine a visit (Brian 2026-11-25): then "Dance again" once, faster, and "Back to the party"
    const end = await page.evaluate(() => ((d) => (d && d.over && d.seen && d.seen.end ? { ...d.seen.end, level: d.level } : null))(window.__ss.op.ch1PartyNow.dance));
    if (end) {
      await sleep(900);
      const b = end.level >= 1 ? end.back : end.again;
      await page.touchscreen.tap(b.x, b.y);
    }
    await sleep(350);
    continue;
  }
  if (s.now.snack) {
    // tap a snack when her back is turned (his paw takes it; no dragging); leave by LEAVE · bar after three.
    // The pile: slots[i] is -1 for a gap; a lower slot number is higher up, so the first snack left is on top and
    // always safe. A careful kid takes from the top; the others take the fourth snack left, which is often one
    // that others stand on (a settle, or the fall).
    const most = process.env.ROBOT_CAREFUL ? 3 : SEED ? 6 : 5;
    if (s.now.snack.phase === "back" && s.now.snacks.bag < most) {
      const left = await page.evaluate(() => (window.__ss.op.ch1PartyNow.snacks.slots || []).map((id, i) => (id >= 0 ? i : -1)).filter((i) => i >= 0));
      const pick = left.length ? left[process.env.ROBOT_CAREFUL ? 0 : Math.min(left.length - 1, 3)] : -1;
      pick >= 0 && (await pointer("down", layout.cut.snacks[pick][1], layout.cut.snacks[pick][2]));
    } else if (s.now.snacks.bag >= Math.min(3, most) && !SEED) await pointer("down", layout.cut.close.x, layout.cut.close.y);
    await sleep(400);
    continue;
  }
  if (s.now.gone && s.now.gone.length > (log.lostN || 0)) {
    log.lostN = s.now.gone.length;
    log.push(`${Math.round(s.now.ft)}s lost ${s.now.gone.join(",")} at ${Math.round(s.x)},${Math.round(s.y)} (octopus ${s.now.oct && s.now.oct.mode}, hugs ${s.now.oct && s.now.oct.hugs}, stare ${s.now.stare})`);
  }
  if (s.now.scene === "P7" && !log.some((l) => l.includes("alarm"))) {
    const w = await page.evaluate(() => { const a = window.__ss.op.ch1PartyNow.alarm; return a ? a.w.id + " " + a.where : ""; });
    log.push(`${Math.round(s.now.ft)}s alarm: ${w}, fur showing ${s.now.fur}, at ${Math.round(s.x)},${Math.round(s.y)}`);
  }
  if (s.now.scene === "P7") {
    // the alarm: run home and hide under the bed
    if (s.room === "closet") s.act === "HIDE" && (await press());
    else await walk(477, 600);
    await sleep(300);
    continue;
  }
  if (!s.ctrl) {
    await sleep(200);
    continue;
  }
  // the group photo: walk into the row
  if (s.act === "JOIN") {
    await press();
    await sleep(400);
    continue;
  }
  // everything done: wait for closing time on the open floor
  if (order.every((k) => s.now.done[k])) {
    const [wx, wy] = (process.env.ROBOT_WAIT || "650,595").split(",").map(Number);
    Math.hypot(s.x - wx, s.y - wy) > 20 && (await walk(wx, wy));
    await sleep(500);
    continue;
  }
  const toy = order[goal % order.length];
  if (s.now.done[toy]) {
    log.push(`${Math.round(s.now.ft)}s done ${toy}`);
    goal++;
    continue;
  }
  if (toy === "conga") {
    if (s.now.conga && s.now.conga.formed) {
      const tail = await page.evaluate(() => {
        const p = window.__ss.op.ch1PartyNow;
        return p.people.backpack;
      });
      await walk(tail.x - 20, tail.y + 4);
    } else if (secs > 0 && Math.round(secs) % 15 === 0) goal++;
    await sleep(400);
    continue;
  }
  const at = TOYS[toy];
  if (at.act) {
    await walk(at.x, at.y);
    await sleep(600);
    (await st()).act === at.act && (await press());
  } else {
    await walk(at.x, at.y);
    await sleep(500);
    toy === "dance" && s.act === "DANCE" && (await press());
  }
  SEED && rand() < 0.05 && (await walk(150 + rand() * 650, 330 + rand() * 250));
}
const end = await st();
console.log(
  JSON.stringify(
    {
      seed: SEED,
      seconds: Math.round((Date.now() - t0) / 1000),
      partySeconds: end.now ? Math.round(end.now.ft || 0) : null,
      ended: end.now ? end.now.scene : "done (beat 20)",
      done: end.now ? end.now.done : null,
      early: end.now ? end.now.early : null,
      stars: end.stars,
      catches,
      lost: end.now ? end.now.gone : null,
      danceTaps,
      log,
      errors,
    },
    null,
    1,
  ),
);
if (VIDEO && frames) spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-framerate", "4", "-i", join(VIDEO, "fr", "%05d.png"), "-vf", "scale=750:-2,format=yuv420p", "-c:v", "libx264", join(VIDEO, "party.mp4")], { stdio: "inherit" });
await g.finish("party-robot");
