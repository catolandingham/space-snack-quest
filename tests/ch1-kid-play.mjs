/**
 * Chapter 1 played the way a kid plays it: phone size, touches only, from the first screen.
 * The robot taps through speech, presses whatever the action button offers, taps the floor to walk
 * to the next spot, and keeps out of the cones it can see. It reads the game only to steer.
 * While it plays it measures what a kid would see: the action button changing size, the page
 * jumping, Squatch standing inside furniture, a tap that stops at furniture, a goal ring on
 * Squatch himself, and errors. Each problem it meets is checked against KNOWN below: a problem
 * on that list passes with a note, a problem not on it fails.
 * The run ends at the Chapter 1 tally card (about 8 minutes). Not getting there fails the suite.
 *   npm run kid-video   plays it and saves tests/out/kid-play/chapter-1.mp4 for Brian to watch
 *   KID_MAX_S  most seconds to play (default 900)   KID_OUT  folder for kid-play.json and the log
 *   KID_SHOTS=1  saves pictures while playing and joins them into chapter-1.mp4 (needs ffmpeg)
 *   KID_AVOID=   (empty) lets the robot press every button, the party ones included
 */
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { root, startGame, sleep } from "./game-page.mjs";

// Problems Brian knows about. Take one off this list in the change that fixes it.
const KNOWN = {
  "tap-stops-at-furniture": "A tap on a spot behind furniture walks Squatch into the furniture and stops (problem 2).",
  "ring-on-squatch": "A goal ring is drawn around Squatch himself (problem 6).",
};
// Party buttons that get Squatch caught. A catch at the party leaves the game stuck in the bedroom
// (docs/CHAPTER-1-PROBLEMS.md, problem 1), so the robot leaves them alone. The change that fixes problem 1
// should empty this list, so the robot presses them and proves the fix.
const LEAVE_ALONE = ["SNAG", "SUCK", "STAND"];

const MAX_S = +(process.env.KID_MAX_S || 900);
const OUT = process.env.KID_OUT || join(root, "tests", "out", "kid-play");
const SHOTS = process.env.KID_SHOTS === "1";
const AVOID = process.env.KID_AVOID === undefined ? LEAVE_ALONE : process.env.KID_AVOID.split(",").filter(Boolean);
const SLIP_CODE = "4723"; // what the pink slip says
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 };
mkdirSync(OUT, { recursive: true });
if (SHOTS) (rmSync(join(OUT, "fr"), { recursive: true, force: true }), mkdirSync(join(OUT, "fr"), { recursive: true }));

const g = await startGame({ port: 8902, name: "ch1-kid-play" });
const { page, errors } = await g.open("?ch=1", PHONE);
const tap = async (x, y) => {
  await page.touchscreen.touchStart(x, y);
  await sleep(40);
  await page.touchscreen.touchEnd();
};
const st = () =>
  page.evaluate(() => {
    const ss = window.__ss,
      n = ss.op,
      c = n.cur;
    const rr = (e) => {
      if (!e) return null;
      const r = e.getBoundingClientRect();
      return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)];
    };
    const b = document.querySelector('[role="button"]');
    const label = b
      ? [...b.childNodes]
          .filter((x) => x.nodeType === 3 || (x.nodeType === 1 && x.tagName !== "STYLE"))
          .map((x) => x.textContent)
          .join("")
          .trim()
      : "";
    const who = ss.ch.mops ? n.mo : n.sq;
    return {
      state: ss.game.state,
      scene: n.scene || "",
      room: n.room || "",
      ctrl: !!n.ctrl,
      up: !!(c && ["bub", "card", "panel", "fb", "wait"].includes(c.k)),
      cur: c ? c.k : "",
      curId: c ? c.id || "" : "",
      by: c && c.id === "jail" ? c.by || "?" : "",
      chip: ss.chipNow() || "",
      btn: label,
      btnR: rr(b),
      joyR: rr(document.querySelector('[aria-label="Move"]')),
      picR: rr(document.querySelector("canvas")),
      x: Math.round(who.x),
      y: Math.round(who.y),
      mops: !!ss.ch.mops,
      pose: n.sqPose,
      mini: n.ch1Mini || "",
      raid: !!n.ch1Raid,
      pad: !!n.ch1PadOn && !!n.ch1Zoom && n.ch1Zoom.zoom >= 1,
      padHave: n.ch1Pad || "",
      zoom: n.ch1Zoom ? n.ch1Zoom.id : "",
      zoomKey: n.ch1Zoom ? [n.ch1Zoom.id, n.ch1Zoom.bag || 0, n.ch1Packed || 0].join(":") : "",
      jailBy: n.jailBy || "",
      step: n.ch1Step || "",
      placed: ss.placedSpots().map((s) => ({ id: s.id || "", verb: s.verb || "", cap: s.cap || "", x: Math.round(s.x || 0), y: Math.round(s.y || 0), r: s.r || 0 })),
      // Furniture, plus Mops: the game does not let Squatch walk through him.
      solids: ss.solids().concat(!ss.ch.mops && n.moPose !== "hidden" && n.moPose !== "sleep" && n.mo.x > 20 && n.mo.x < 1000 ? [{ x0: n.mo.x - 46, x1: n.mo.x + 46, y0: n.mo.y - 46, y1: n.mo.y + 46, mops: true }] : []),
      bounds: ss.walkBounds(),
      cones: ss.conesDrawn().filter((k) => !k.room || k.room === n.room),
      // The goal circle (ch1MarkGoal) is drawn at the first spot that has a place. A spot placed on
      // Squatch's own feet puts that circle around Squatch.
      selfSpot: !ss.ch.mops && ss.spotsNow().some((k) => k && k.verb && k.x && Math.abs(k.x - n.sq.x) < 2 && Math.abs(k.y - n.sq.y) < 2),
    };
  });

// What the robot can see of danger: any cone on screen, with a little room to spare.
const inDanger = (s, x, y) => {
  for (const c of s.cones) {
    // Close to a watcher is never safe, whichever way it faces.
    if (Math.hypot(x - c.ox, y - (c.oy + 28)) < 96) return true;
    for (const py of [y, y - 20]) {
      const d = Math.hypot(x - c.ox, py - c.oy);
      if (c.circle) {
        if (d < c.len + 26) return true;
        continue;
      }
      if (d > c.len + 36) continue;
      let a = Math.atan2(py - c.oy, x - c.ox) - c.a;
      for (; a > Math.PI; ) a -= 2 * Math.PI;
      for (; a < -Math.PI; ) a += 2 * Math.PI;
      if (Math.abs(a) < c.half + 0.16) return true;
    }
  }
  return false;
};
const inSolid = (s, x, y, pad = 8) => s.solids.some((b) => x > b.x0 - pad && x < b.x1 + pad && y > b.y0 - pad && y < b.y1 + pad);
const lineOk = (s, x0, y0, x1, y1, solidsToo = true) => {
  const d = Math.hypot(x1 - x0, y1 - y0),
    k = Math.max(1, Math.ceil(d / 8));
  for (let i = 1; i <= k; i++) {
    const x = x0 + ((x1 - x0) * i) / k,
      y = y0 + ((y1 - y0) * i) / k;
    if (inDanger(s, x, y) || (solidsToo && inSolid(s, x, y, 4))) return false;
  }
  return true;
};
// A kid learns where a cone sweeps. The robot remembers, for each bit of floor, when a cone was last
// on it. Floor a cone covered in the last REMEMBER seconds is "risky": the robot crosses it only
// just after the cone has left (the window has just opened), or once it is already on its way across.
const CELL = 16,
  REMEMBER = 8,
  JUST_LEFT = 1.0;
const memory = new Map();
function look(s) {
  const b = s.bounds || { x0: 60, x1: 900, y0: 380, y1: 590 };
  const W = Math.floor((b.x1 - b.x0) / CELL) + 1,
    H = Math.floor((b.y1 - b.y0) / CELL) + 1;
  const id = [s.room, b.x0, b.y0, W, H].join("|");
  let last = memory.get(id);
  last || memory.set(id, (last = new Float64Array(W * H).fill(-1e9)));
  const hot = new Uint8Array(W * H),
    t = Date.now() / 1000;
  for (let j = 0; j < H; j++)
    for (let i = 0; i < W; i++) if (inDanger(s, b.x0 + i * CELL, b.y0 + j * CELL)) ((hot[j * W + i] = 1), (last[j * W + i] = t));
  const cell = (x, y) => Math.max(0, Math.min(H - 1, Math.round((y - b.y0) / CELL))) * W + Math.max(0, Math.min(W - 1, Math.round((x - b.x0) / CELL)));
  return { b, W, H, hot, last, t, cell, risky: (k) => !hot[k] && t - last[k] < REMEMBER, justLeft: (k) => !hot[k] && t - last[k] < JUST_LEFT };
}
// Where to tap next to get near (tx, ty) without crossing furniture or a cone. wait = stay here.
function nextStep(s, tx, ty, reach) {
  const v = look(s),
    { b, W, H } = v;
  const cx = (i) => b.x0 + i * CELL,
    cy = (j) => b.y0 + j * CELL;
  // Already on risky floor, or inside a cone right now: keep going, do not freeze there.
  const onMyWay = v.risky(v.cell(s.x, s.y)) || !!v.hot[v.cell(s.x, s.y)];
  const free = new Uint8Array(W * H);
  // Squatch can start a scene inside furniture (sitting on the bed) or inside a cone: let him step out.
  const mine = s.solids.filter((q) => s.x > q.x0 + 2 && s.x < q.x1 - 2 && s.y > q.y0 + 2 && s.y < q.y1 - 2);
  const hot = inDanger(s, s.x, s.y);
  const okCell = (x, y) => {
    const out = !s.solids.some((q) => !mine.includes(q) && x > q.x0 - 8 && x < q.x1 + 8 && y > q.y0 - 8 && y < q.y1 + 8);
    if (!out) return false;
    const k = v.cell(x, y);
    if (v.hot[k]) return hot && Math.hypot(x - s.x, y - s.y) < 120;
    return !v.risky(k) || onMyWay || v.justLeft(k);
  };
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) free[j * W + i] = okCell(cx(i), cy(j)) ? 1 : 0;
  const start = v.cell(s.x, s.y);
  const cost = new Float32Array(W * H).fill(Infinity),
    from = new Int32Array(W * H).fill(-1);
  cost[start] = 0;
  const open = [start];
  while (open.length) {
    let bi = 0;
    for (let k = 1; k < open.length; k++) if (cost[open[k]] < cost[open[bi]]) bi = k;
    const cur = open.splice(bi, 1)[0],
      ci = cur % W,
      cj = (cur - ci) / W;
    for (let dj = -1; dj <= 1; dj++)
      for (let di = -1; di <= 1; di++) {
        if (!di && !dj) continue;
        const ni = ci + di,
          nj = cj + dj;
        if (ni < 0 || nj < 0 || ni >= W || nj >= H) continue;
        const nk = nj * W + ni;
        if (!free[nk]) continue;
        const c2 = cost[cur] + (di && dj ? 1.414 : 1);
        if (c2 < cost[nk]) (cost[nk] === Infinity && open.push(nk), (cost[nk] = c2), (from[nk] = cur));
      }
  }
  let best = -1,
    bestD = Infinity,
    arrive = false;
  for (let k = 0; k < W * H; k++) {
    if (cost[k] === Infinity) continue;
    const d = Math.hypot(cx(k % W) - tx, cy((k - (k % W)) / W) - ty);
    const inside = d <= reach;
    // Prefer a cell inside the spot (cheapest walk); else the reachable cell nearest the spot.
    const score = inside ? cost[k] * CELL - 1e6 : d;
    if (score < bestD) ((bestD = score), (best = k), (arrive = inside));
  }
  if (best < 0 || best === start) return { wait: true, arrive };
  const path = [];
  for (let k = best; k !== -1 && k !== start; k = from[k]) path.push(k);
  path.reverse();
  let pickK = path[0];
  for (const k of path) if (lineOk(s, s.x, s.y, cx(k % W), cy((k - (k % W)) / W), !mine.length)) pickK = k;
  return { x: cx(pickK % W), y: cy((pickK - (pickK % W)) / W), arrive, last: pickK === best };
}

const tapGame = async (s, gx, gy) => {
  const r = s.picR;
  await tap(r[0] + (gx * r[2]) / 960, r[1] + (gy * r[3]) / 640);
};
const t0 = Date.now();
const now = () => (Date.now() - t0) / 1000;
const log = [];
const say = (s, what) => {
  const line = `${now().toFixed(1)}s ${s.scene}/${s.room} [${s.chip}] btn="${s.btn}" at ${s.x},${s.y} :: ${what}`;
  log.push(line);
  console.log(line);
};
const rects = { btn: new Map(), pic: new Map(), joy: new Map() };
const seen = { inSolid: [], blocked: new Set(), selfRing: new Set(), caught: [], scenes: [], silent: [] };
const firstChip = new Map();
let lastChip = "",
  lastScene = "",
  lastCaughtAt = 0;
const presses = new Map(),
  done = new Set(),
  directTried = new Set();
let lastKey = "",
  lastChange = Date.now(),
  wander = 0,
  progress = 0,
  end = "time",
  shot = 0,
  shooting = SHOTS,
  jailUp = false,
  waitSince = 0,
  hidAt = 0;
(async () => {
  while (shooting) {
    try {
      await page.screenshot({ path: join(OUT, "fr", String(shot++).padStart(5, "0") + ".jpg"), type: "jpeg", quality: 60 });
    } catch {}
    await sleep(110);
  }
})();

while (now() < MAX_S) {
  const s = await st();
  for (const [k, r] of [
    ["btn", s.btnR && [s.btnR[2], s.btnR[3]]],
    ["pic", s.picR && [s.picR[1]]],
    ["joy", s.joyR && [s.joyR[1]]],
  ])
    if (r) rects[k].has(r.join("x")) || rects[k].set(r.join("x"), `${now().toFixed(1)}s ${s.scene} "${s.btn}"`);
  if (s.ctrl && !s.mops && !s.zoom && s.pose === "stand" && inSolid(s, s.x, s.y, -6)) seen.inSolid.push(`${now().toFixed(1)}s ${s.scene} at ${s.x},${s.y}`);
  if (s.ctrl && s.selfSpot) seen.selfRing.add(`${s.scene}: ${s.chip}`);
  if (s.by && !jailUp) {
    seen.caught.push(`${now().toFixed(1)}s ${s.scene} by ${s.by}`);
    say(s, "CAUGHT by " + s.by);
    lastCaughtAt = Date.now();
    // The part starts over, so everything in it is to do again.
    for (const k of [...done]) if (k.startsWith(s.scene + "|")) done.delete(k);
  }
  jailUp = !!s.by;
  look(s);
  // A part that starts over with no LOCKUP card on screen is its own finding.
  if (firstChip.get(s.scene) === undefined && s.chip) firstChip.set(s.scene, s.chip);
  if (s.chip && s.chip !== lastChip) {
    if (s.chip === firstChip.get(s.scene) && lastScene === s.scene && lastChip && !s.by && Date.now() - lastCaughtAt > 6000)
      (seen.silent.push(`${now().toFixed(1)}s ${s.scene}: back to "${s.chip}" from "${lastChip}" with no LOCKUP card (last captor: ${s.jailBy || "none"})`), say(s, "STARTED OVER with no card"));
    lastChip = s.chip;
    lastScene = s.scene;
  }
  const tag = s.scene + ": " + s.chip;
  if (!seen.scenes.length || seen.scenes[seen.scenes.length - 1][1] !== tag) seen.scenes.push([Math.round(now()), tag]);
  if (s.curId === "tally") {
    end = "tally";
    say(s, "TALLY CARD: Chapter 1 finished");
    await sleep(1500);
    break;
  }
  const key = [s.scene, s.room, s.chip, s.mops, s.zoomKey, done.size, seen.caught.length].join("|");
  if (key !== lastKey) ((lastKey = key), (lastChange = Date.now()), progress++);
  if (Date.now() - lastChange > 75000) {
    end = "stuck";
    say(s, "STUCK 75s. Spots: " + JSON.stringify(s.placed) + " mini=" + s.mini + " cur=" + s.cur + " ctrl=" + s.ctrl + " zoom=" + s.zoom + " step=" + s.step);
    break;
  }
  if (s.up) {
    await tapGame(s, 480, 320);
    await sleep(220);
    continue;
  }
  if (!s.ctrl) {
    await sleep(200);
    continue;
  }
  const avoid = (v) => AVOID.some((a) => v.startsWith(a));
  // The door keypad: type the number printed on the pink slip beside it, one key at a time.
  if (s.pad) {
    const d = SLIP_CODE[s.padHave.length] || SLIP_CODE[0];
    const i = +d - 1;
    say(s, "KEY " + d);
    await tapGame(s, d === "0" ? 480 : 480 + ((i % 3) - 1) * 88, d === "0" ? 514 : 250 + Math.floor(i / 3) * 88);
    await sleep(450);
    continue;
  }
  // Hidden with a cone on screen: stay put, the way a kid holds still while someone is looking.
  if ((s.pose === "hidden" || s.pose === "under") && (s.cones.length || s.raid) && Date.now() - (hidAt || (hidAt = Date.now())) < 20000) {
    await sleep(250);
    continue;
  }
  if (s.pose !== "hidden" && s.pose !== "under") hidAt = 0;
  const verb = s.btn && s.btn !== "ACTION" && !avoid(s.btn) ? s.btn : "";
  const vkey = s.scene + "|" + verb;
  // Press what is offered, but not the same thing over and over when nothing new came of it.
  const pr = presses.get(vkey) || { count: 0, at: -1 };
  if (verb && (pr.count < 2 || pr.at !== progress)) {
    presses.set(vkey, { count: pr.count + 1, at: progress });
    for (const p of s.placed) if (verb.startsWith(p.verb)) done.add(s.scene + "|" + (p.id || p.verb + p.cap));
    say(s, "PRESS " + verb);
    await tap(s.btnR[0] + s.btnR[2] / 2, s.btnR[1] + s.btnR[3] / 2);
    await sleep(500);
    continue;
  }
  const open = s.placed.filter((p) => p.x && !avoid(p.verb) && !done.has(s.scene + "|" + (p.id || p.verb + p.cap)));
  if (open.length) {
    const p = open.sort((a, b) => Math.hypot(a.x - s.x, a.y - s.y) - Math.hypot(b.x - s.x, b.y - s.y))[0];
    const pk = s.scene + "|" + (p.id || p.verb + p.cap);
    // First, what a kid does: tap the thing itself. If Squatch stops short of it, that is a finding.
    const v = look(s);
    const calm = (x0, y0, x1, y1) => {
      const k = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 8));
      for (let i = 0; i <= k; i++) if (v.risky(v.cell(x0 + ((x1 - x0) * i) / k, y0 + ((y1 - y0) * i) / k))) return false;
      return true;
    };
    const py = Math.max(p.y, s.bounds.y0);
    if (!directTried.has(pk) && lineOk(s, s.x, s.y, p.x, py, false) && calm(s.x, s.y, p.x, py)) {
      directTried.add(pk);
      say(s, `TAP ${p.verb} · ${p.cap} (${p.x},${p.y})`);
      await tapGame(s, p.x, p.y);
      let prev = "",
        still = 0,
        got = false,
        s2 = s;
      for (let i = 0; i < 40 && still < 4; i++) {
        await sleep(150);
        s2 = await st();
        if (!s2.ctrl || s2.up || s2.scene !== s.scene) { got = true; break; }
        if (s2.btn.startsWith(p.verb) || Math.hypot(s2.x - p.x, s2.y - p.y) < Math.max(40, (p.r || 0) - 10)) { got = true; break; }
        const pos = s2.x + "," + s2.y;
        still = pos === prev ? still + 1 : 0;
        prev = pos;
      }
      if (!got) (seen.blocked.add(`${s.scene}: a tap on "${p.verb} · ${p.cap}" at ${p.x},${p.y} leaves Squatch at ${s2.x},${s2.y}`), say(s2, "STOPPED SHORT of " + p.verb + " · " + p.cap));
      continue;
    }
    const step = nextStep(s, p.x, Math.max(s.bounds.y0, Math.min(s.bounds.y1, p.y)), Math.max(28, (p.r || 70) - 30));
    if (step.wait) {
      waitSince = waitSince || Date.now();
      if (Date.now() - waitSince > 12000) {
        waitSince = 0;
        done.add(pk);
        say(s, `GAVE UP on ${p.verb} · ${p.cap} for now (no safe way found)`);
      }
      await sleep(200);
      continue;
    }
    waitSince = 0;
    await tapGame(s, step.x, step.y);
    await sleep(step.last ? 350 : 220);
    continue;
  }
  if (s.placed.length && Date.now() - lastChange > 20000) {
    for (const k of [...done]) if (k.startsWith(s.scene + "|")) done.delete(k);
    directTried.clear();
    say(s, "RETRY everything in this scene");
    lastChange = Date.now() - 1000;
    await sleep(300);
    continue;
  }
  const pts = [[760, 470], [480, 540], [240, 560], [820, 560], [600, 420]];
  const w = pts[wander++ % pts.length];
  const step = nextStep(s, w[0], w[1], 30);
  say(s, `WANDER toward ${w}`);
  if (!step.wait) await tapGame(s, step.x, step.y);
  await sleep(1200);
}
shooting = false;
await sleep(300);
const fin = await st();
const found = {
  "button-size": rects.btn.size > 1 ? [...rects.btn].map(([k, v]) => `${k} at ${v}`) : [],
  "page-jump": rects.pic.size > 1 || rects.joy.size > 1 ? [...rects.pic].map(([k, v]) => `picture top ${k} at ${v}`) : [],
  "squatch-in-furniture": seen.inSolid.slice(0, 20),
  "tap-stops-at-furniture": [...seen.blocked],
  "ring-on-squatch": [...seen.selfRing],
  "start-over-without-card": seen.silent,
  "script-error": errors.slice(0, 10),
  "not-finished": end === "tally" ? [] : [`stopped (${end}) in ${fin.scene}/${fin.room}: ${fin.chip}`],
};
const out = { end, seconds: Math.round(now()), final: { scene: fin.scene, room: fin.room, chip: fin.chip }, caught: seen.caught, scenes: seen.scenes, found, shots: shot };
writeFileSync(join(OUT, "kid-play.json"), JSON.stringify(out, null, 1));
writeFileSync(join(OUT, "kid-play-log.txt"), log.join("\n"));
console.log(`Played ${out.seconds}s, ended: ${end}, caught ${seen.caught.length} times, last scene ${fin.scene} (${fin.chip})`);
for (const [name, list] of Object.entries(found)) {
  if (!list.length) {
    g.check(`kid play: no ${name}`, true);
    if (KNOWN[name]) console.log(`NOTE ${name} is on the known list but did not happen this run. If it is fixed, take it off the list.`);
  } else if (KNOWN[name]) console.log(`KNOWN ${name} (${list.length}): ${KNOWN[name]}\n   e.g. ${list.slice(0, 3).join("\n        ")}`);
  else g.check(`kid play: no ${name}`, false, list.slice(0, 5));
}
if (SHOTS && shot > 10) {
  // Join the pictures into a video that plays at the speed the robot played.
  const fps = Math.max(1, shot / Math.max(1, out.seconds)).toFixed(2);
  const mp4 = join(OUT, "chapter-1.mp4");
  const ff = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-framerate", fps, "-i", join(OUT, "fr", "%05d.jpg"), "-vf", "pad=ceil(iw/2)*2:ceil(ih/2)*2", "-r", "10", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "30", mp4]);
  console.log(ff.status === 0 ? `Video: ${mp4}` : "Video not made (is ffmpeg installed?)");
}
await g.finish("ch1-kid-play");
