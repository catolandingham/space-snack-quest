/**
 * Showing videos of pickup day (Chapter 1, beats 53 to 61; src/modules/pickup.js) for Brian: the game played by touch
 * only (a finger on the picture and on the big button), at real speed, on a phone-size page (375 x 812, video 750 x
 * 1624), with the game's own sound. Recorded the same way as tools/escape-showing.mjs. Not a test: it reads the game only
 * to know when to act.
 *   npm run build && node tools/pickup-showing.mjs <pickup|seen> <out.mp4>
 *     pickup  from the escape's end (the localhost link ?beat=pickup, or SHOWING_FROM=<step>) through pickup day: every
 *             line read and NEXT, every walk tapped on the floor (Mops's too), every button pressed where it comes up;
 *             the sneak to the plant done the way a careful kid does it (rolled up until the robots carry crate two
 *             out, then along the front).
 *     seen    the robots' capture rule in the mail room: he climbs out and stands in their way; "!", the FUR alarm, a
 *             guard; ROLL · ball, "They lost you.".
 *   SHOWING_STILLS=<dir> also writes a still of each step there. SHOWING_SILENT=1 leaves the sound out.
 */
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { startGame, sleep, root } from "../tests/game-page.mjs";

const [which, outFile] = process.argv.slice(2);
const WHICH = ["pickup", "seen"];
if (!WHICH.includes(which) || !outFile) {
  console.error("Usage: node tools/pickup-showing.mjs <" + WHICH.join("|") + "> <out.mp4>");
  process.exit(2);
}
const SILENT = !!process.env.SHOWING_SILENT;
const STILLS = process.env.SHOWING_STILLS || "";
STILLS && mkdirSync(STILLS, { recursive: true });
const WORK = join(root, "tests", "out", "pickup-showing-work", which);
rmSync(WORK, { recursive: true, force: true });
mkdirSync(join(WORK, "fr"), { recursive: true });
mkdirSync(dirname(outFile), { recursive: true });
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: +process.env.SHOWING_DPR || 2 };
const g = await startGame({ port: 9420 + WHICH.indexOf(which), name: "pickup-showing-" + which });
const { page, errors } = await g.open(which === "pickup" ? "?beat=pickup" + (process.env.SHOWING_FROM ? ":" + process.env.SHOWING_FROM : "") : "?beat=pickup:climb", PHONE);
await page.evaluate(() => (window.__ss.drawFrame(), 0));
page.on("pageerror", (e) => console.log("PAGE ERROR " + String(e).slice(0, 300)));
page.on("console", (m) => m.type() === "error" && console.log("CONSOLE " + m.text().slice(0, 300)));
await sleep(800);
SILENT || (await page.click("#ss-sound").catch(() => {}));
await sleep(600);
const t0 = Date.now();
const log = (m) => console.log(((Date.now() - t0) / 1000).toFixed(1) + "s " + m);

// ---------- recording (as tools/party-showing.mjs) ----------
let cdp = null;
const frames = [];
async function startRecording() {
  SILENT ||
    (await page.evaluate(() => {
      const e = window.SSQ.engine(),
        ctx = e.audioCtx(),
        dest = ctx.createMediaStreamDestination();
      e.masterGain().connect(dest);
      window.__chunks = [];
      const rec = new MediaRecorder(dest.stream, { mimeType: "audio/webm;codecs=opus", audioBitsPerSecond: 160000 });
      rec.ondataavailable = (ev) => ev.data.size && window.__chunks.push(ev.data);
      rec.start(250);
      window.__rec = rec;
      window.__audioStart = Date.now();
    }));
  cdp = await page.createCDPSession();
  cdp.on("Page.screencastFrame", async (f) => {
    const file = join(WORK, "fr", String(frames.length).padStart(5, "0") + ".jpg");
    frames.push({ file, t: f.metadata.timestamp });
    writeFileSync(file, Buffer.from(f.data, "base64"));
    try {
      await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId });
    } catch {}
  });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 82, everyNthFrame: 2 });
}
async function finishRecording() {
  await sleep(300);
  await cdp.send("Page.stopScreencast");
  const videoEnd = Date.now() / 1000;
  let audio = "",
    lead = 0;
  if (!SILENT) {
    const audioStart = await page.evaluate(() => window.__audioStart);
    const b64 = await page.evaluate(async () => {
      window.__rec.stop();
      await new Promise((ok) => setTimeout(ok, 600));
      const buf = new Uint8Array(await new Blob(window.__chunks, { type: "audio/webm" }).arrayBuffer());
      let s = "";
      for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000));
      return btoa(s);
    });
    audio = join(WORK, "audio.webm");
    writeFileSync(audio, Buffer.from(b64, "base64"));
    lead = Math.max(0, frames[0].t - audioStart / 1000);
  }
  const list = frames.map((f, i) => `file '${f.file}'\nduration ${Math.max(0.001, (i + 1 < frames.length ? frames[i + 1].t : videoEnd) - f.t).toFixed(4)}`).join("\n") + `\nfile '${frames[frames.length - 1].file}'\n`;
  writeFileSync(join(WORK, "frames.txt"), list);
  const v = ["-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "30", "-fps_mode", "cfr", "-vf", "scale=750:1624", "-crf", "24"];
  const args = audio ? ["-f", "concat", "-safe", "0", "-i", join(WORK, "frames.txt"), "-ss", String(lead), "-i", audio, "-map", "0:v", "-map", "1:a", ...v, "-c:a", "aac", "-b:a", "128k", "-shortest", outFile] : ["-f", "concat", "-safe", "0", "-i", join(WORK, "frames.txt"), ...v, outFile];
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...args]);
  console.log(`frames ${frames.length}, seconds ${(videoEnd - frames[0].t).toFixed(1)}, sound ${audio ? "yes" : "no"}: ${outFile}`);
}

// ---------- a finger ----------
const tap = async (x, y) => (await page.touchscreen.touchStart(x, y), await sleep(60), await page.touchscreen.touchEnd());
const st = () =>
  page.evaluate(() => {
    const n = window.__ss.op,
      c = n.cur,
      b = document.querySelector('[role="button"]'),
      r = b && b.getBoundingClientRect(),
      cv = document.querySelector("canvas").getBoundingClientRect(),
      es = window.SSQ.beat("ch1-pickup"),
      d = es.debug(),
      label = b ? [...b.childNodes].filter((x) => x.nodeType === 3 || (x.nodeType === 1 && x.tagName !== "STYLE")).map((x) => x.textContent).join("").trim() : "";
    return {
      act: n.act ? n.act.verb + (n.act.cap ? " · " + n.act.cap : "") : "",
      btnLabel: label,
      cur: c ? c.k : "",
      id: c ? c.id || "" : "",
      text: c && c.b ? c.b.text : c && c.text ? c.text : "",
      ctrl: !!n.ctrl,
      room: n.room,
      x: n.sq.x,
      y: n.sq.y,
      mo: { x: n.mo.x, y: n.mo.y },
      pose: n.sqPose,
      btn: r ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null,
      cv: [cv.x, cv.y, cv.width, cv.height],
      es: d.state,
      active: es.active(),
      ch1Step: n.ch1Step || "",
      sec: !!(d.state && d.state.guard),
    };
  });
const at = async (x, y) => {
  const s = await st();
  await tap(s.cv[0] + (x * s.cv[2]) / 960, s.cv[1] + (y * s.cv[3]) / 640);
};
const press = async () => {
  const s = await st();
  s.btn && (await tap(s.btn.x, s.btn.y));
};
const until = async (f, ms = 30000, each) => {
  const end = Date.now() + ms;
  for (;;) {
    const s = await st();
    if (await f(s)) return s;
    if (Date.now() > end) return null;
    each && (await each(s));
    await sleep(110);
  }
};
let k = 0;
const still = async (name) => STILLS && (await page.screenshot({ path: join(STILLS, (which === "pickup" ? "" : "seen-") + String(++k).padStart(2, "0") + "-" + name + ".png") }));
// A line or a card with words: read it (a little longer for long lines), then NEXT.
const read = async (s, name) => {
  if (!["bub", "card", "cutaway"].includes(s.cur)) return;
  name && (await still(name));
  await sleep(Math.min(3200, 1300 + s.text.length * 25));
  await press();
  await sleep(300);
};
const fail = async (m) => {
  const q = await st();
  log("STOPPED: " + m + " " + JSON.stringify({ act: q.act, cur: q.cur, text: q.text, step: q.es && q.es.step, ctrl: q.ctrl, room: q.room }));
  await finishRecording().catch(() => {});
  throw new Error(m);
};
// Walks him by tapping the floor (again if he stops short), until `ok`.
async function walkTo(x, y, ok, ms = 12000) {
  const end = Date.now() + ms;
  let last = 0;
  for (;;) {
    const s = await st();
    if ((ok && ok(s)) || Math.hypot(s.x - x, s.y - y) < 14) return s;
    if (Date.now() > end) return s;
    if (s.ctrl && Date.now() - last > 900) ((last = Date.now()), await at(x, y));
    await sleep(120);
  }
}
// Reads every line and card until `ok` (naming each line's still by `names` in turn).
async function readUntil(ok, names = [], ms = 60000) {
  let i = 0;
  const s = await until(async (q) => {
    if (await ok(q)) return true;
    if (["bub", "card", "cutaway"].includes(q.cur)) await read(q, names[i++] || "");
    return false;
  }, ms);
  return s || fail("never got to the next step");
}

await startRecording();
if (which === "pickup") {
  let lastStep = "",
    tapAt = 0,
    sneak = "";
  const spots = () => page.evaluate(() => window.__ss.spotsNow().map((q) => ({ id: q.id, verb: q.verb || "", cap: q.cap || "", who: q.who, x: q.x, y: q.y, extra: !!q.extra })));
  const end = Date.now() + 20 * 60000;
  for (;;) {
    if (Date.now() > end) await fail("ran out of time");
    const s = await st();
    if ((!s.active && lastStep && !s.cur) || (s.cur === "panel" && s.id === "tally")) break;
    const step = s.es && s.es.step;
    if (step && step !== lastStep) ((lastStep = step), log(step), await sleep(300), await still(step));
    if (["bub", "card", "cutaway"].includes(s.cur)) {
      await read(s, "");
      continue;
    }
    if (s.cur === "wait") {
      await sleep(3000);
      await press();
      await sleep(300);
      continue;
    }
    if (!s.ctrl || s.cur) {
      await sleep(110);
      continue;
    }
    const es = s.es || {};
    // 55: the sneak to the plant, the way a careful kid does it: rolled up behind the bags until the robots have carried
    // crate two out of the mail room, then along the front of the bay and up to the plant
    if (es.step === "sneak") {
      if (Date.now() - (globalThis.__lastLog || 0) > 4000) ((globalThis.__lastLog = Date.now()), log("sneak " + JSON.stringify({ sneak, two: es.two, x: Math.round(s.x), y: Math.round(s.y), pose: s.pose, act: s.act, guard: !!es.guard })));
      const go = async (x, y) => Date.now() - tapAt > 700 && ((tapAt = Date.now()), await page.evaluate(([x, y]) => (window.__ss.drawFrame(), window.__ss.tapAt(x, y, false)), [x, y]));
      if (!sneak) ((sneak = "ball"), await sleep(600), await press(), log("rolled up"), await still("rolled-up"));
      // (out of the mail room by its opening, then along the front of the bay, then up to the plant)
      // (the plant stands right of the bin since the bay's pickup v4 picture: pickup-place.js PK_BAY.plantAt; the tap
      // walks him round the open crate below it)
      const W = { out: [700, 462], front: [560, 600], left: [190, 600], up: [294, 388] },
        near = (k) => Math.hypot(s.x - W[k][0], s.y - W[k][1]) < 26;
      if (sneak === "ball" && ["scan", "up", "done"].includes(es.two)) ((sneak = "out"), await go(...W.out));
      else if (sneak === "out" && near("out")) ((sneak = "front"), (tapAt = 0), await go(...W.front));
      else if (sneak === "front" && near("front")) ((sneak = "left"), (tapAt = 0), await go(...W.left));
      else if (sneak === "left" && near("left")) ((sneak = "up"), (tapAt = 0), await go(...W.up));
      else if (sneak === "up" && s.act.startsWith("HIDE")) (await sleep(500), await press());
      else if (sneak !== "ball") await go(...W[sneak]);
      await sleep(150);
      continue;
    }
    let list = (await spots()).filter((q) => !q.extra);
    const sp = list[0];
    if (!sp) {
      await sleep(150);
      continue;
    }
    if (Date.now() - (globalThis.__lastLog || 0) > 8000) ((globalThis.__lastLog = Date.now()), log("at " + JSON.stringify({ step: es.step, room: s.room, x: Math.round(s.x), y: Math.round(s.y), mo: [Math.round(s.mo.x), Math.round(s.mo.y)], sp: sp.id, to: [Math.round(sp.x), Math.round(sp.y)], act: s.act })));
    const here = sp.who === "mo" ? s.mo : { x: s.x, y: s.y };
    const close = Math.hypot(here.x - sp.x, here.y - sp.y) < 12;
    if (sp.verb && s.act === sp.verb + " · " + sp.cap) {
      await sleep(600);
      await press();
      await sleep(500);
      continue;
    }
    if (!close && Date.now() - tapAt > 700) ((tapAt = Date.now()), await at(sp.x, sp.y));
    await sleep(120);
  }
  await sleep(2500);
  await still("tally");
  log("pickup day shown");
} else {
  await until((s) => s.act.startsWith("CLIMB"), 15000);
  await sleep(800);
  await press();
  await sleep(600);
  await still("out");
  // he stands where the robots will turn to (in front of the row)
  await until((s) => s.es.bots.some((b) => b.mark === "?"), 30000);
  await still("robot-registers");
  await until((s) => s.sec, 10000);
  await sleep(500);
  await still("alarm-guard");
  await until((s) => s.act.startsWith("ROLL"), 3000);
  await press();
  log("rolled up");
  await sleep(600);
  await still("rolled-hidden");
  await until((s) => !s.sec, 25000);
  await sleep(1500);
  await still("lost-you");
}
await sleep(800);
await finishRecording();
errors.length && console.log("page errors:", errors.slice(0, 5));
await g.finish("pickup-showing-" + which);
process.exit(0);
