/**
 * Showing videos of the evening of Day 2 and night one (beats 37 to 42, src/modules/evening.js) for Brian: the game
 * played by touch only (a finger on the picture, on the big button, on the full-screen close-ups), at real speed, on
 * a phone-size page (375 x 812, video 750 x 1624), with the game's own sound. Recording works as in
 * tools/party-showing.mjs (the browser's screencast, the sound recorded inside the page, joined by ffmpeg). Not a test:
 * it reads the game only to know when to act.
 *   npm run build && node tools/evening-showing.mjs <wall|bar|home|night|seen> <out.mp4>
 *     wall   beat 37: the hallway, LOOK · photos, five photos (the crooked #4 lifted: the crayon drawing), past 5 the
 *            robot and BEEP BEEP, then through the doorway to the snack bar
 *     bar    beats 38 and 39: the Moon Pie line, "Quick, hide.", HIDE · counter, the family, the brochure close-up,
 *            "Are those other Sasquatches?", Mops back to work, home through the doorway
 *     home   beats 40 and 41: the evening, SHOW · brochure, the Mars line, SLEEP · bed, Mops falls asleep (the
 *            fainting goat, feet up), the snores, out of bed
 *     night  beat 42: home, the hall, the hallway, the loading bay at night (the robot's rhythm), GRAB · copies, the
 *            paw print, POST · mailbox, the robots wake, the vent takes the pink sheet, back home past the robots,
 *            SLEEP · bed, "Six days later"
 *     seen   beat 42's capture rule: out while the robot looks down: "!", it runs to the bay's FUR alarm, guards, HIDE
 *            · plant, "They lost you."; then seen again and standing still: the LOCKUP card and the restart
 *   SHOWING_STILLS=<dir> writes a still of each step there too. SHOWING_SILENT=1 leaves the sound out.
 */
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { startGame, sleep, root } from "../tests/game-page.mjs";

const [which, outFile] = process.argv.slice(2);
const WHICH = ["wall", "bar", "home", "night", "seen"];
if (!WHICH.includes(which) || !outFile) {
  console.error("Usage: node tools/evening-showing.mjs <" + WHICH.join("|") + "> <out.mp4>");
  process.exit(2);
}
const SILENT = !!process.env.SHOWING_SILENT;
const STILLS = process.env.SHOWING_STILLS || "";
STILLS && mkdirSync(STILLS, { recursive: true });
const WORK = join(root, "tests", "out", "evening-showing-work", which);
rmSync(WORK, { recursive: true, force: true });
mkdirSync(join(WORK, "fr"), { recursive: true });
mkdirSync(dirname(outFile), { recursive: true });
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
const START = { wall: 37, bar: 37, home: 40, night: 42, seen: 142 }[which];
const g = await startGame({ port: 9790 + WHICH.indexOf(which), name: "evening-showing-" + which });
const { page, errors } = await g.open("?beat=evening:" + START, PHONE);
await sleep(900);
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
const tap = async (x, y, hold = 60) => (await page.touchscreen.touchStart(x, y), await sleep(hold), await page.touchscreen.touchEnd());
const st = () =>
  page.evaluate(() => {
    const n = window.__ss.op,
      c = n.cur,
      b = document.querySelector('[role="button"]'),
      r = b && b.getBoundingClientRect(),
      cv = [...document.querySelectorAll("canvas")].find((q) => q.style.position !== "fixed").getBoundingClientRect(),
      ev = window.SSQ.beat("ch1-evening"),
      s = n.ch1Evening || {};
    return {
      act: n.act ? n.act.verb + (n.act.cap ? " · " + n.act.cap : "") : "",
      cur: c ? c.k : "",
      id: c ? c.id || "" : "",
      text: c && c.b ? c.b.text : c ? c.text || "" : "",
      ctrl: !!n.ctrl,
      room: n.room,
      x: n.sq.x,
      y: n.sq.y,
      step: s.step || "",
      alarm: s.alarm ? s.alarm.phase : "",
      by: s.alarm ? s.alarm.w.id + "@" + Math.round(s.alarm.w.hx) + "," + Math.round(s.alarm.w.hy) : "",
      look: ev.place.nightLook(s.nightT || 0),
      nightT: s.nightT || 0,
      btn: r ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null,
      cv: [cv.x, cv.y, cv.width, cv.height],
      view: ev.viewTargets(),
      lost: ev.debug().lost,
    };
  });
const floor = async (x, y) => {
  const s = await st();
  await tap(s.cv[0] + (x * s.cv[2]) / 960, s.cv[1] + (y * s.cv[3]) / 640);
};
const press = async () => {
  const s = await st();
  s.btn && (await tap(s.btn.x, s.btn.y));
};
const until = async (f, ms = 20000) => {
  const end = Date.now() + ms;
  for (;;) {
    const s = await st();
    if (await f(s)) return s;
    if (Date.now() > end) return null;
    await sleep(100);
  }
};
// A line or card: a kid reads it, then taps NEXT (the big button).
const read = async (ms = 1600) => (await sleep(ms), await press(), await sleep(300));
const readAll = async (stop, ms = 30000) => {
  const end = Date.now() + ms;
  for (;;) {
    const s = await st();
    if (await stop(s)) return s;
    if (Date.now() > end) return null;
    if (s.cur === "bub" || s.cur === "card") await read();
    else await sleep(120);
  }
};
let k = 0;
const still = async (name) => STILLS && (await page.screenshot({ path: join(STILLS, which + "-" + String(++k).padStart(2, "0") + "-" + name + ".png") }));
const fail = async (m) => {
  const q = await st();
  console.error("STOPPED:", m, JSON.stringify({ step: q.step, room: q.room, act: q.act, cur: q.cur, text: q.text, x: Math.round(q.x), y: Math.round(q.y) }));
  await finishRecording();
  await g.finish("evening-showing-" + which);
  process.exit(1);
};
// Walks him by tapping the floor (again if he stops short) until `ok` says he is there.
async function walkTo(x, y, ok, ms = 10000) {
  const end = Date.now() + ms;
  let last = 0;
  for (;;) {
    const s = await st();
    if (s.by && !walkTo.by) ((walkTo.by = s.by), log("SEEN by " + s.by + " at " + Math.round(s.x) + "," + Math.round(s.y) + " look " + s.look.phase));
    if (ok ? ok(s) : Math.hypot(s.x - x, s.y - y) < 16) return s;
    if (Date.now() > end) return null;
    if (s.cur === "bub" || s.cur === "card") await read();
    else if (s.ctrl && Date.now() - last > 900) ((last = Date.now()), await floor(x, y));
    await sleep(120);
  }
}
const tapView = async (at, hold = 60) => (await sleep(1100), await tap(at.x, at.y, hold), await sleep(400));
const stepIs = (step, ms = 20000) => readAll((s) => s.step === step && s.ctrl && !s.cur, ms);

await startRecording();
if (which === "wall") {
  await stepIs("wall", 4000);
  await sleep(1200);
  await still("the-hallway-the-doorway-outlined");
  (await walkTo(480, 300, (s) => s.act === "LOOK · photos")) || (await fail("no LOOK · photos"));
  await still("look-photos");
  await press();
  for (let i = 0; i < 6; i++) {
    const s = await until((q) => q.view && q.view.ready, 4000);
    if (!s) break;
    await still("photo-" + (s.view.i + 1) + (s.view.i === 3 && !s.view.lifted ? "-crooked" : ""));
    if (s.view.i === 3 && !s.view.lifted) {
      await tapView(s.view.photo);
      await sleep(900);
      await still("lifted-the-crayon-drawing");
    }
    await tapView(s.view.next);
  }
  await until((s) => s.cur === "bub", 6000);
  await sleep(500);
  await still("robot-beep-beep-squatch-rolled-up");
  await stepIs("wall", 12000);
  await sleep(600);
  await still("the-crayon-drawing-stays-on-the-wall");
  (await walkTo(60, 330, (s) => s.step !== "wall", 12000)) || (await fail("not through the doorway"));
  await until((s) => s.room === "hall", 6000);
  await sleep(1500);
  await still("the-snack-bar");
}
if (which === "bar") {
  await sleep(400);
  // from the hallway (beat 37), straight through the doorway to the snack bar
  (await walkTo(60, 330, (s) => s.step !== "wall", 12000)) || (await fail("not through the doorway"));
  await until((s) => s.cur === "bub", 8000);
  await sleep(900);
  await still("overheard-the-moon-pies");
  await read(2600);
  await until((s) => s.cur === "bub", 12000);
  await sleep(700);
  await still("the-family-reads-quick-hide");
  await read(1600);
  await until((s) => s.step === "hide" && s.ctrl, 5000);
  await still("quick-hide-family-reading");
  await sleep(900);
  await press();
  await until((s) => s.step === "watch", 4000);
  await sleep(500);
  await still("hidden-behind-the-counter");
  await until((s) => s.step === "watch" && s.cur === "", 3000);
  await sleep(4200);
  await still("the-family-pancakes-and-mars");
  await stepIs("brochure", 20000);
  await sleep(800);
  await still("the-brochure-left-behind");
  await press();
  const v = await until((s) => s.view && s.view.ready, 4000);
  await sleep(1800);
  await still("the-brochure-a-sasquatch-couple");
  await tapView(v.view.close);
  await until((s) => s.cur === "bub", 4000);
  await sleep(600);
  await still("are-those-other-sasquatches");
  await read();
  await until((s) => s.cur === "bub", 4000);
  await sleep(600);
  await still("mops-back-to-work");
  await read();
  await stepIs("gohome", 10000);
  await sleep(800);
  await still("the-home-doorway-outlined");
  (await walkTo(870, 340, null, 6000)) && (await walkTo(477, 590, (s) => s.room === "closet", 14000));
  await sleep(2500);
  await still("home-evening");
}
if (which === "home") {
  await sleep(1200);
  await still("evening-show-mops-the-brochure");
  (await walkTo(600, 470, (s) => s.act === "SHOW · brochure", 6000)) || (await fail("no SHOW · brochure"));
  await press();
  await sleep(700);
  await still("he-holds-it-up");
  await until((s) => s.cur === "bub", 4000);
  await sleep(700);
  await still("the-mars-line");
  await read(3200);
  await stepIs("bed", 6000);
  await sleep(800);
  await still("the-bed-outlined");
  (await walkTo(330, 458, (s) => s.act === "SLEEP · bed", 8000)) || (await fail("no SLEEP · bed"));
  await press();
  for (const [ms, name] of [[2200, "in-bed"], [2600, "lights-down"], [2000, "mops-dozes"], [1000, "mops-tips-over"], [2000, "feet-in-the-air"], [1600, "snore"]]) (await sleep(ms), await still(name));
  await stepIs("out", 20000);
  await sleep(1000);
  await still("night-one-out-of-bed");
}
// Night one: the night robot's rhythm is the same every play (R64); a kid who watched it goes along the back while
// it looks down and along the front while it looks at the back wall.
// (the moment the robot's look has just come round to `phase`; waitLook: any moment of it with time left)
const waitStart = async (phase) => (await until((s) => s.look.phase !== phase, 9000), await until((s) => s.look.phase === phase, 9000));
const waitLook = async (phase) => waitStart(phase);
async function crossBay(points) {
  for (const p of points) (await walkTo(p.x, p.y, null, 8000)) || (await fail("stuck crossing the bay at " + p.x + "," + p.y));
}
if (which === "night") {
  await sleep(1200);
  await still("night-out-the-door");
  (await walkTo(880, 440, (s) => s.room === "hall", 8000)) || (await fail("not out of home"));
  await sleep(1400);
  await still("the-hall-at-night");
  (await walkTo(905, 320, (s) => s.room === "passage", 10000)) || (await fail("not into the hallway"));
  await sleep(1200);
  await still("the-hallway-at-night");
  (await walkTo(905, 330, (s) => s.room === "hangar", 12000)) || (await fail("not into the bay"));
  await stepIs("bin", 6000);
  await sleep(1200);
  await still("the-loading-bay-at-night-the-bin");
  (await walkTo(212, 398, (s) => s.act === "GRAB · copies", 8000)) || (await fail("no GRAB · copies"));
  await press();
  const v = await until((s) => s.view && s.view.ready, 4000);
  await sleep(1400);
  await still("the-order-papers-mark-order");
  await tap(v.view.box.x, v.view.box.y, 700);
  await sleep(300);
  await still("the-paw-print-through-to-the-yellow");
  await stepIs("post", 6000);
  await sleep(600);
  await still("post-the-yellow-copy");
  // across the robot's column: along the front while it looks at the back wall
  await crossBay([{ x: 300, y: 585 }]);
  await waitLook("up");
  await crossBay([{ x: 640, y: 585 }, { x: 690, y: 470 }]);
  (await walkTo(862, 500, (s) => s.act === "POST · mailbox", 8000)) || (await fail("no POST · mailbox"));
  await press();
  await until((s) => s.cur === "bub", 4000);
  await sleep(800);
  await still("mail-scanned-pawature-accepted");
  await read();
  await sleep(1600);
  await still("the-robots-wake-he-runs");
  await until((s) => s.step === "robots" && s.x > 820 && s.y < 360, 8000);
  await sleep(500);
  await still("the-vent-takes-the-pink-sheet");
  await stepIs("back", 8000);
  await sleep(600);
  await still("sneak-home-past-the-robots");
  await crossBay([{ x: 650, y: 342 }, { x: 650, y: 585 }]);
  await waitLook("up");
  await crossBay([{ x: 300, y: 585 }]);
  (await walkTo(70, 330, (s) => s.room === "passage", 10000)) || (await fail("not out of the bay"));
  (await walkTo(60, 330, (s) => s.room === "hall", 12000)) || (await fail("not into the hall"));
  (await walkTo(477, 590, (s) => s.room === "closet", 14000)) || (await fail("not home"));
  await stepIs("tobed", 4000);
  await sleep(800);
  await still("home-mops-still-snoring");
  (await walkTo(330, 458, (s) => s.act === "SLEEP · bed", 10000)) || (await fail("no SLEEP · bed"));
  await press();
  await sleep(2500);
  await still("back-in-bed");
  await until((s) => s.cur === "card", 8000);
  await sleep(1200);
  await still("six-days-later");
}
if (which === "seen") {
  await sleep(1200);
  await still("the-bay-at-night");
  // he waits by the robot's column until it has just turned to look down, then steps out in front of it: seen
  await walkTo(360, 585, null, 8000);
  await waitStart("down");
  await walkTo(450, 585, (s) => !!s.alarm, 4000);
  await sleep(250);
  await still("seen-the-robot-shows-!");
  // he rolls up at once (ROLL · ball, the button under his thumb)
  (await until((s) => s.act === "ROLL · ball", 3000)) || (await fail("no ROLL · ball"));
  await press();
  await sleep(1000);
  await still("rolled-up-the-robot-runs-to-the-alarm");
  await until((s) => s.alarm === "search", 8000);
  await sleep(1200);
  await still("guards-search-the-bay");
  const lost0 = (await st()).lost;
  await until((s) => !s.alarm, 25000);
  await sleep(200);
  await still("they-lost-you");
  log("lost: " + ((await st()).lost - lost0));
  await sleep(1500);
  // seen again, and he stands still in the robot's look (he unrolls as he walks)
  await walkTo(360, 585, null, 6000);
  await waitStart("down");
  await walkTo(450, 585, (s) => !!s.alarm, 4000);
  await sleep(300);
  await still("seen-again-and-standing-still");
  await until((s) => s.id === "jail", 25000);
  await sleep(900);
  await still("caught-the-lockup-card");
  await sleep(2200);
  await press();
  await stepIs("bin", 8000);
  await sleep(800);
  await still("restarts-at-the-bin-step");
}
await finishRecording();
console.log("page errors", errors.slice(0, 5));
await g.finish("evening-showing-" + which);
