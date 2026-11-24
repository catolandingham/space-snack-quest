/**
 * The party robot: plays the party in disguise (P6) like a kid on a phone, to see whether three minutes with no
 * goal chips is fun and fair (party plan, step 3: "Is three minutes fun with no chips? Tune here, before polish").
 * It walks to the toys in its own order (or a random one with ROBOT_SEED), dances, joins the conga, stands in the
 * band photo, swipes snacks, heads for the hallway, and taps NEXT on every line. It is not a test suite: it prints
 * what happened (toys done, stars, catches, how the party ended, how long it took) and can save a phone-size video.
 *   node tools/party-robot.mjs                 one run, toys in the planned order
 *   ROBOT_SEED=3 node tools/party-robot.mjs    one run, toys in a shuffled order, wandering between them
 *   ROBOT_CAREFUL=1                            the robot walks away from a guest who turns for a second look
 *   ROBOT_VIDEO=<folder>                       saves a frame every 0.25 s and joins them into party.mp4 (ffmpeg)
 *   ROBOT_START=party:P6                       where to start (default: the dress-up's end, party:P6)
 *   ROBOT_DANCE_TAPS=12                        leaves the dance by its close button after that many moves
 *   ROBOT_ORDER=dance,photo,snacks             the toys to visit, in this order (default: all six)
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
  photo: { x: 420, y: 365 },
  snacks: { x: layout.paw.x, y: layout.paw.y, tap: true },
  conga: null, // the tail of the line, when it is on
  hallway: { x: 900, y: 325 },
  octopus: { x: 740, y: 560 },
  plant: { x: 420, y: 540 },
};
let order = process.env.ROBOT_ORDER ? process.env.ROBOT_ORDER.split(",") : ["dance", "photo", "snacks", "conga", "hallway", "octopus"];
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
    // the dance: tap anywhere, a kid's rhythm
    await page.touchscreen.tap(120 + (danceTaps % 5) * 30, 400);
    danceTaps++;
    await sleep(350);
    continue;
  }
  if (s.now.snack) {
    // drag a snack to the bag when her back is turned; close after three
    const most = process.env.ROBOT_CAREFUL ? 3 : SEED ? 6 : 5; // a careful kid stops before the pyramid falls
    if (s.now.snack.phase === "back" && s.now.snacks.bag < most) {
      const taken = s.now.snacks.bag;
      const [_, sx, sy] = layout.cut.snacks[(taken * 3) % 10];
      await pointer("down", sx, sy);
      await sleep(200);
      await pointer("move", 100, 540);
      await pointer("up", 100, 540);
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
  // a careful kid: when someone turns for a second look (the big "?"), walk away from them
  if (process.env.ROBOT_CAREFUL && s.now.curious && s.now.curious.phase !== "wait") {
    const w = s.now.people[s.now.curious.id] || { x: 890, y: 482 };
    // to whichever open corner of the front floor is further from them (clear of the plants and the vent)
    const spots = [[650, 595], [560, 330]],
      far = spots.sort((a, b) => Math.hypot(b[0] - w.x, b[1] - w.y) - Math.hypot(a[0] - w.x, a[1] - w.y))[0];
    await walk(far[0], far[1]);
    await sleep(500);
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
  if (s.now.done[toy] || (toy === "photo" && s.now.photo && s.now.photo.taken)) {
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
  if (at.tap) {
    await walk(at.x, at.y);
    await sleep(600);
  } else {
    await walk(at.x, at.y);
    await sleep(500);
    toy === "dance" && s.act === "DANCE" && (await press());
  }
  // a kid gets bored of waiting for the camera
  toy === "photo" && Math.hypot(s.x - at.x, s.y - at.y) < 20 && (await sleep(1000));
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
