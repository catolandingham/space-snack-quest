/**
 * One showing video of Day 2 joined, beat 28 to beat 53, for Brian: the loading bay (28 to 36), the evening's photo
 * wall (37), the party hall's cleaning robots (36b), the storm and the evening (38a to 42c), the escape (43 to 52) and
 * pickup day's first moment (53), played in one go by touch only, at real speed, on a phone-size page (375 x 812, video
 * 750 x 1624), with the game's own sound. The finger does what the three beats' own showing tools do
 * (tools/party-showing.mjs bay, tools/evening-showing.mjs wall to night, tools/escape-showing.mjs escape), one after
 * the other in the same game, so every hand-over plays as a player meets it. Recorded the same way (the browser's
 * screencast, the sound from the game's master volume, joined by ffmpeg). Not a test: it reads the game only to know
 * when to act.
 *   npm run build && node tools/day2-showing.mjs <out.mp4>
 *   SHOWING_STILLS=<dir> also writes a still of each step there, and of each hand-over (named "JOIN-..."); the moments
 *   go to <out>.marks.json too. SHOWING_SILENT=1 leaves the sound out.
 */
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { startGame, sleep, root } from "../tests/game-page.mjs";

const [outFile] = process.argv.slice(2);
if (!outFile) {
  console.error("Usage: node tools/day2-showing.mjs <out.mp4>");
  process.exit(2);
}
const SILENT = !!process.env.SHOWING_SILENT;
const STILLS = process.env.SHOWING_STILLS || "";
STILLS && mkdirSync(STILLS, { recursive: true });
const WORK = join(root, "tests", "out", "day2-showing-work");
rmSync(WORK, { recursive: true, force: true });
mkdirSync(join(WORK, "fr"), { recursive: true });
mkdirSync(dirname(outFile), { recursive: true });
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
const g = await startGame({ port: 9488, name: "day2-showing" });
const { page, errors } = await g.open("?ch=1", PHONE);
page.on("pageerror", (e) => console.log("PAGE ERROR " + String(e).slice(0, 300)));
await page.evaluate(() => window.__ss.lockedReady);
// (as the bay's showing does: the lunch sneak's own end behind the snack counter, then beat 28 starts)
await page.evaluate(() => {
  const ss = window.__ss,
    n = ss.op;
  n.q = [];
  n.cur = null;
  ss.ch1JumpBeat(28);
});
await sleep(800);
SILENT || (await page.click("#ss-sound").catch(() => {}));
await sleep(300);
const t0 = Date.now();
const log = (m) => console.log(((Date.now() - t0) / 1000).toFixed(1) + "s " + m);

// ---------- recording (as tools/party-showing.mjs) ----------
let cdp = null;
const marks = [];
const mark = (name) => marks.push({ name, at: Date.now() / 1000 });
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
  writeFileSync(outFile.replace(/\.mp4$/, "") + ".marks.json", JSON.stringify(marks.map((m) => ({ name: m.name, s: +(m.at - frames[0].t).toFixed(2) })), null, 1));
}

// ---------- a finger, and what it reads (every field the three tools read) ----------
const tap = async (x, y, hold = 60) => (await page.touchscreen.touchStart(x, y), await sleep(hold), await page.touchscreen.touchEnd());
const st = () =>
  page.evaluate(() => {
    const n = window.__ss.op,
      c = n.cur,
      b = document.querySelector('[role="button"]'),
      r = b && b.getBoundingClientRect(),
      cv = [...document.querySelectorAll("canvas")].find((q) => q.style.position !== "fixed").getBoundingClientRect(),
      ev = window.SSQ.beat("ch1-evening"),
      s = n.ch1Evening || {},
      es = window.SSQ.beat("ch1-escape"),
      d = es.debug();
    return {
      act: n.act ? n.act.verb + (n.act.cap ? " · " + n.act.cap : "") : "",
      cur: c ? c.k : "",
      id: c ? c.id || "" : "",
      text: c && c.b ? c.b.text : c ? c.text || "" : "",
      ctrl: !!n.ctrl,
      room: n.room,
      x: n.sq.x,
      y: n.sq.y,
      mo: { x: n.mo.x, y: n.mo.y },
      pose: n.sqPose,
      btn: r ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null,
      cv: [cv.x, cv.y, cv.width, cv.height],
      full: "",
      // the evening's (tools/evening-showing.mjs)
      step: s.step || "",
      alarm: s.alarm ? s.alarm.phase : "",
      by: s.alarm ? s.alarm.w.id : "",
      look: ev.place.nightLook(s.nightT || 0),
      view: ev.viewTargets(),
      // the escape's (tools/escape-showing.mjs)
      es: d.state,
      active: es.active(),
      ch1Step: n.ch1Step || "",
      sec: !!(d.state && d.state.guard),
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
const until = async (f, ms = 20000, each) => {
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
const still = async (name) => (mark(name), STILLS && (await page.screenshot({ path: join(STILLS, String(++k).padStart(3, "0") + "-" + name + ".png") })));
// a hand-over between two beats: its own still and mark, so the joins can be looked at one by one
const join_ = async (name) => (log("JOIN " + name), await still("JOIN-" + name));
const fail = async (m) => {
  const q = await st();
  log("STOPPED: " + m + " " + JSON.stringify({ act: q.act, step: q.step, es: q.es && q.es.step, ctrl: q.ctrl, cur: q.cur, text: q.text, room: q.room, x: Math.round(q.x), y: Math.round(q.y) }));
  await finishRecording().catch(() => {});
  await g.finish("day2-showing");
  process.exit(1);
};
const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);

await startRecording();
await sleep(300);

// ---------- 28 to 36: the loading bay (as tools/party-showing.mjs bay) ----------
const bay = () =>
  page.evaluate(() => {
    const b = window.SSQ.beat("ch1-bay"),
      s = b.debug().state || {},
      d = b.debug().drew || {};
    return { step: s.step || "", active: b.active(), closeUp: d.closeUp && d.closeUp.u === 1 ? d.closeUp.id : "", papers: s.papers ? s.papers.where : "", ship: s.ship || 0 };
  });
const who = () =>
  page.evaluate(() => {
    const n = window.__ss.op,
      b = window.SSQ.beat("ch1-bay").debug().state || {},
      p = b.asMops ? n.mo : n.sq;
    return { x: p.x, y: p.y, asMops: !!b.asMops, step: b.step || "", ctrl: !!n.ctrl, cur: n.cur ? n.cur.k : "", act: n.act ? n.act.verb + (n.act.cap ? " · " + n.act.cap : "") : "", alarm: !!b.alarm, ball: !!b.ball, rollBy: b.rollBy, office: b.office, robots: (b.robots || []).map((r) => ({ x: r.x, y: r.y, f: r.f, dir: r.dir })), hall: b.hall ? b.hall.robots.map((r) => ({ x: r.x, y: r.y, dir: r.dir })) : null };
  });
{
  // a line or a card with words: read it, then one tap on the picture
  const read = async (s) => {
    if (["bub", "card", "panel"].includes(s.cur)) (await sleep(1300), await tap(187, 300), await sleep(250));
  };
  async function watch(done, ms) {
    const end = Date.now() + ms;
    let seen = "";
    for (;;) {
      const s = await st(),
        b = await bay();
      if (await done(s, b)) return true;
      if (Date.now() > end) return false;
      const key = [b.step, b.closeUp, b.papers, b.ship >= 1 ? "ship" : ""].join("|");
      if (key !== seen) ((seen = key), s.cur !== "bub" && (await sleep(500), await still("bay-" + slug([b.step, b.closeUp && b.closeUp + " close-up"].filter(Boolean).join(" ")))));
      if (s.cur === "bub") (await sleep(700), await still(slug(s.text)), await sleep(900), await tap(s.btn.x, s.btn.y), await sleep(300));
      else if (s.cur === "card") (await sleep(900), await still("switch-card"), await read(s));
      await sleep(120);
    }
  }
  async function walk(x, y, ok, ms = 12000) {
    const end = Date.now() + ms;
    let last = 0;
    for (;;) {
      const q = await who(),
        s = await st();
      if ((ok && ok(q)) || Math.hypot(q.x - x, q.y - y) < 14) return q;
      if (Date.now() > end) return q;
      if (s.cur === "bub") (await sleep(700), await still(slug(s.text)), await sleep(900), await tap(s.btn.x, s.btn.y), await sleep(300));
      else if (["card", "panel"].includes(s.cur)) await read(s);
      else if (q.ctrl && Date.now() - last > 900) ((last = Date.now()), await floor(x, y));
      await sleep(110);
    }
  }
  async function act(step, x, y, words) {
    (await watch((s, b) => b.step === step && s.ctrl && !s.cur, 90000)) || (await fail("the bay's " + step + " step did not come"));
    await sleep(900);
    await still("bay-" + step + "-the-goal");
    x != null && (await walk(x, y, (q) => q.act === words));
    (await until((q) => q.act === words, 8000)) || (await fail("no " + words + " at " + step));
    await sleep(500);
    await press();
    await sleep(700);
  }
  // (round 7, r5 0:20: after the talk he is ducked behind the counter; he stands up and walks out himself)
  (await watch((s, b) => b.step === "counter" && s.ctrl && !s.cur, 60000)) || (await fail("the counter step did not come"));
  await sleep(1400);
  await still("29-ducked-behind-the-counter-the-doorway-outlined");
  await walk(893, 380);
  await sleep(500);
  await walk(930, 318, (q) => q.step !== "counter");
  (await watch((s, b) => b.step === "hallway" && s.ctrl, 60000)) || (await fail("the hallway did not come"));
  await sleep(900);
  await walk(500, 270, (q) => q.cur === "bub");
  await walk(946, 330, (q) => q.step !== "hallway");
  await act("cargo", 176, 350, "ROLL · ball");
  (await watch((s, b) => b.step === "sneak" && s.ctrl && s.cur !== "bub", 90000)) || (await fail("the sneak did not come"));
  await sleep(900);
  await until(async () => ((q) => q.robots[1] && q.robots[1].dir > 0 && q.robots[1].x > 360)(await who()), 20000);
  await walk(294, 384, (q) => q.act === "HIDE · plant");
  await sleep(300);
  await press();
  await sleep(900);
  await act("peek", null, null, "PEEK · form");
  await act("take", 250, 474, "TAKE · copies");
  await act("eat", 250, 474, "EAT · copies");
  await act("talkto", 330, 404, "TALK · Squatch");
  await act("spit", 244, 404, "SPIT · bin");
  await act("box", 448, 454, "PICK UP · box");
  await act("give", 330, 404, "GIVE · box");
  (await watch((s, b) => b.step === "home" && s.ctrl && !s.cur, 90000)) || (await fail("the walk home did not come"));
  await sleep(900);
  await walk(30, 336, (q) => q.step === "walkby");
  (await watch((s, b) => b.step === "walkby" && s.ctrl, 20000)) || (await fail("the hallway walk home did not come"));
  await sleep(700);
  await walk(560, 360, (q) => q.rollBy > 0);
  // (round 7, q: 133: the robot comes out looking away for 2 s: the moment to curl up)
  await sleep(1300);
  await still("bay-the-office-door-opens-roll-ball");
  await press();
  // the hairball and the lines after it; beat 36 ends, the evening goes on from here (37)
  (await watch((s, b) => !b.active && s.step === "walkin", 60000)) || (await fail("beat 37 did not follow beat 36"));
  await join_("36-to-37-the-hallway-goes-on");
}

// ---------- 37: the photo wall (as tools/evening-showing.mjs wall) ----------
const readEv = async (ms = 1600) => (await sleep(ms), await press(), await sleep(300));
const readAll = async (stop, ms = 30000) => {
  const end = Date.now() + ms;
  for (;;) {
    const s = await st();
    if (await stop(s)) return s;
    if (Date.now() > end) return null;
    if (s.cur === "bub" || s.cur === "card") await readEv();
    else await sleep(120);
  }
};
async function walkTo(x, y, ok, ms = 10000) {
  const end = Date.now() + ms;
  let last = 0;
  for (;;) {
    const s = await st();
    if (ok ? ok(s) : Math.hypot(s.x - x, s.y - y) < 16) return s;
    if (Date.now() > end) return null;
    if (s.cur === "bub" || s.cur === "card") await readEv();
    else if (s.ctrl && Date.now() - last > 900) ((last = Date.now()), await floor(x, y));
    await sleep(120);
  }
}
const tapView = async (at, hold = 60) => (await sleep(1100), await tap(at.x, at.y, hold), await sleep(400));
const stepIs = (step, ms = 20000) => readAll((s) => s.step === step && s.ctrl && !s.cur, ms);
async function readStills(stop, names = {}, ms = 60000) {
  const end = Date.now() + ms,
    done = new Set();
  for (;;) {
    const s = await st();
    if (await stop(s)) return s;
    if (Date.now() > end) return null;
    if ((s.cur === "bub" || s.cur === "card") && names[s.text] && !done.has(s.text)) (done.add(s.text), await sleep(700), await still(names[s.text]));
    if (s.cur === "bub" || s.cur === "card") await readEv();
    else await sleep(120);
  }
}
(await stepIs("wall", 15000)) || (await fail("the photo wall step did not come"));
await sleep(1200);
await still("37-the-hallway-the-photos-outlined-the-goal");
(await walkTo(480, 300, (s) => s.act === "LOOK · photos")) || (await fail("no LOOK · photos"));
await press();
for (let i = 0; i < 6; i++) {
  const s = await until((q) => (q.view && q.view.ready) || q.step === "dodge", 4000);
  if (!s || !s.view) break;
  await sleep(500);
  await still("37-photo-" + (s.view.i + 1));
  if (s.view.i === 3 && !s.view.lifted) {
    await page.touchscreen.touchStart(s.view.lift.x, s.view.lift.y);
    await sleep(1300);
    await still("37-the-frame-swings-up-the-crayon-drawing");
    await sleep(900);
    await page.touchscreen.touchEnd();
    await sleep(1300);
  }
  await tapView(s.view.next);
}
await until((s) => s.step === "dodge" && s.ctrl, 4000);
await sleep(300);
(await until((s) => s.act === "ROLL · ball", 3000)) || (await fail("no ROLL · ball"));
await sleep(400);
await press();
await sleep(1400);
await still("37-rolled-up-the-robot-rolls-past");
await readStills((s) => s.step === "past" && s.ctrl, { "BEEP BEEP": "37-beep-beep" }, 15000);
await sleep(600);
(await walkTo(60, 330, (s) => s.step !== "past", 12000)) || (await fail("not through the doorway"));
(await until((s) => s.room === "hall" && s.step === "hallsneak", 8000)) || (await fail("36b did not start from the hall's doorway"));
await sleep(600);
await join_("37-to-36b-the-party-hall-robots");

// ---------- 36b: the party hall's cleaning robots (as tools/party-showing.mjs bay) ----------
{
  async function walk(x, y, ok, ms = 12000) {
    const end = Date.now() + ms;
    let last = 0;
    for (;;) {
      const q = await who(),
        s = await st();
      if ((ok && ok(q)) || Math.hypot(q.x - x, q.y - y) < 14) return q;
      if (Date.now() > end) return q;
      if (s.cur === "bub") (await sleep(1600), await tap(s.btn.x, s.btn.y), await sleep(300));
      else if (q.ctrl && Date.now() - last > 900) ((last = Date.now()), await floor(x, y));
      await sleep(110);
    }
  }
  (await until(async (s) => (await bay()).step === "hall" && s.ctrl && s.cur !== "bub", 20000)) || (await fail("36b's control did not come"));
  await sleep(900);
  await still("36b-get-past-the-robots");
  await walk(850, 340);
  await until(async () => ((q) => q.hall && [1, 2].every((i) => q.hall[i].dir < 0 && q.hall[i].x < 520))(await who()), 45000);
  await walk(772, 584, (q) => q.step !== "hall", 15000);
  (await until((s) => s.step === "tostorm" || s.step === "storm", 8000)) || (await fail("the storm did not follow 36b"));
  await join_("36b-to-38a-to-the-storm");
}

// ---------- 38a to 42c: the evening and night one (as tools/evening-showing.mjs bar, alone, fight, night) ----------
// bar
(await until((s) => s.step === "storm", 15000)) || (await fail("no storm"));
await sleep(3500);
await still("38a-jupiters-big-red-storm-rolls-in");
await readStills((s) => s.step === "hide" && s.ctrl, { "Guests! Quick, hide.": "38a-mops-guests-quick-hide" }, 30000);
await sleep(700);
(await walkTo(862, 330, (s) => s.act === "HIDE · counter", 6000)) || (await fail("no HIDE · counter"));
await press();
(await stepIs("peek", 6000)) || (await fail("not behind the counter"));
await sleep(1500);
await press();
await sleep(600);
await readStills((s) => s.step === "duck" && s.ctrl && !s.cur, { "Red like Mars.": "38b-red-like-mars", "The PANCAKES!": "38b-the-pancakes" }, 60000);
await sleep(700);
await press();
await sleep(600);
for (;;) {
  const s = await st();
  if (s.step === "brochure" && s.ctrl && !s.cur) break;
  if (s.view && s.view.kind === "shock" && s.view.ready) {
    await sleep(900);
    await still("38c-the-close-up-at-sasquatches");
    await tapView(s.view.close);
    continue;
  }
  if (s.cur === "bub") {
    const names = { "But I talked to them, and they said they were Sasquatches.": "38c-they-said-they-were-sasquatches", "Here's a brochure I got on it.": "38c-the-brochure", "Ugh. Coffee.": "38c-coffee" };
    names[s.text] && (await sleep(700), await still(names[s.text]));
    await readEv();
    continue;
  }
  await sleep(150);
}
await sleep(800);
await press();
const v = await until((s) => s.view && s.view.kind === "brochure" && s.view.ready, 5000);
v || (await fail("no brochure close-up"));
await sleep(1400);
await still("39-the-brochure-close-up");
for (const part of ["window", "pancakes", "cake", "paw"]) await tapView(v.view.parts[part]);
await tapView(v.view.parts.cooks);
await readStills((s) => s.step === "gohome" && s.ctrl && !s.cur, { "Are those other Sasquatches?": "39-are-those-other-sasquatches" }, 40000);
await sleep(900);
// alone
(await walkTo(477, 600, (s) => s.room === "closet", 12000)) || (await fail("not home"));
await stepIs("box", 8000);
await sleep(800);
await still("39b-home-alone-the-crate-stamp-with-his-crayon");
await press();
await stepIs("bite", 4000);
await sleep(700);
await press();
await readStills((s) => s.step === "chart" && s.ctrl && !s.cur, { "No fizz.": "39b-no-fizz" }, 10000);
await sleep(700);
(await walkTo(236, 440, (s) => s.act === "X · chart", 6000)) || (await fail("no X · chart"));
await press();
const c = await until((s) => s.view && s.view.kind === "chart" && s.view.ready, 4000);
await sleep(900);
await tapView(c.view.cake);
await sleep(500);
await tapView(c.view.cake);
await stepIs("crate", 6000);
await sleep(700);
(await walkTo(330, 458, (s) => s.act === "HOLD UP · brochure", 6000)) || (await fail("no HOLD UP · brochure"));
await press();
const k2 = await until((s) => s.view && s.view.kind === "crate" && s.view.ready, 4000);
await sleep(1000);
await still("39b-the-crate-close-up-the-family-stamp");
for (let i = 0; i < 3; i++) (await tapView(k2.view.card, 80), await sleep(300));
await sleep(2000);
await still("39b-his-crayon-rubbed-out");
await readStills((s) => s.step === "evening", { "MARS!": "39b-mars" }, 12000);
// fight
await readStills((s) => s.step === "show" && s.ctrl && !s.cur, { "That evening…": "40-that-evening" }, 30000);
await sleep(800);
await still("40-the-crate-stamp-without-his-crayon");
await press();
await readStills((s) => s.step === "choose" && s.ctrl && !s.cur, { "Mops! My crate says MARS!": "40-my-crate-says-mars" }, 90000);
await sleep(900);
(await walkTo(330, 458, (s) => s.act === "STOMP · to bed", 6000)) || (await fail("no STOMP · to bed"));
await press();
for (;;) {
  const s = await st();
  if (s.step === "bed" && s.ctrl && !s.cur) break;
  if (s.view && s.view.kind === "back" && s.view.ready) {
    await sleep(900);
    await still("41-his-turned-back");
    await tapView(s.view.close);
    continue;
  }
  if (s.cur === "bub") {
    await readEv();
    continue;
  }
  await sleep(150);
}
await sleep(700);
await press();
for (const [ms, name] of [[2600, "41-in-bed"], [5200, "41-lights-down"], [4800, "41-on-his-back-snoring"]]) (await sleep(ms), await still(name));
await until((s) => s.step === "idea", 20000);
await readStills((s) => s.step === "out" && s.ctrl && !s.cur, { "The form!": "41-the-form" }, 30000);
// night
const waitStart = async (phase) => (await until((s) => s.look.phase !== phase, 9000), await until((s) => s.look.phase === phase, 9000));
async function crossBay(points) {
  // (near enough: a step from the point; a tap there can stop him a few pixels short)
  for (const p of points) (await walkTo(p.x, p.y, (s) => Math.hypot(s.x - p.x, s.y - p.y) < 22, 8000)) || (await fail("stuck crossing the bay at " + p.x + "," + p.y));
}
await sleep(1200);
await still("42-night-out-of-bed");
(await walkTo(566, 498, (s) => s.step === "out" && !s.ctrl, 6000)) || (await fail("no bump"));
await readStills((s) => s.step === "out" && s.ctrl && !s.cur, { "Weee...?": "42-bumped-the-bucket-weee" }, 8000);
await sleep(600);
(await walkTo(880, 440, (s) => s.room === "hall", 10000)) || (await fail("not out of home"));
await sleep(1400);
await still("42-the-hall-at-night");
(await walkTo(905, 320, (s) => s.room === "passage", 10000)) || (await fail("not into the hallway"));
await sleep(1200);
await still("42-the-hallway-at-night");
(await walkTo(905, 330, (s) => s.room === "hangar", 12000)) || (await fail("not into the bay"));
await stepIs("bin", 6000);
await sleep(1200);
await still("42b-the-loading-bay-at-night-the-plant-right-of-the-bin");
(await walkTo(212, 398, (s) => s.act === "GRAB · copies", 8000)) || (await fail("no GRAB · copies"));
await press();
await readStills((s) => s.view && s.view.kind === "order" && s.view.ready, {}, 20000);
await sleep(1200);
await still("42b-the-choice-the-code-in-pen");
let w = await st();
await tapView(w.view.mark);
await sleep(600);
w = await st();
await tap(w.view.box.x, w.view.box.y, 700);
await sleep(300);
await stepIs("post", 6000);
await sleep(600);
// (round 7, q: 125: the robots sleep, z z z, no cones, until the loud post wakes them)
await still("42b-the-robots-asleep");
await crossBay([{ x: 300, y: 585 }, { x: 640, y: 585 }, { x: 690, y: 470 }]);
(await walkTo(862, 500, (s) => s.act === "POST · mailbox", 8000)) || (await fail("no POST · mailbox"));
await press();
await readStills((s) => s.act === "HIDE · crate" || (s.ctrl && !s.cur), { "Shhh!": "42c-shhh", "NIGHT SHIFT.": "42c-night-shift-the-robots-wake" }, 15000);
await sleep(600);
await still("42c-awake-hide-the-crate-by-the-floor-vent");
// out of the mail room, down, and along the bottom while the robot looks up, to the crate by the floor vent
await crossBay([{ x: 700, y: 463 }, { x: 650, y: 585 }]);
await waitStart("up");
(await walkTo(300, 566, (s) => s.act === "HIDE · crate", 9000)) || (await fail("no HIDE · crate"));
await press();
await sleep(900);
await still("42c-in-the-crate-the-floor-vent-pulls-the-pink-sheet");
await readStills((s) => s.step === "back" && s.ctrl && !s.cur, { "No! The pink one!": "42c-no-the-pink-one", "It's done.": "42c-its-done" }, 40000);
await sleep(800);
await waitStart("up");
(await walkTo(70, 330, (s) => s.room === "passage", 10000)) || (await fail("not out of the bay"));
(await walkTo(40, 330, (s) => s.room === "hall", 10000)) || (await fail("not back in the hall"));
(await walkTo(477, 600, (s) => s.room === "closet", 12000)) || (await fail("not home"));
await stepIs("tobed", 6000);
await sleep(800);
(await walkTo(330, 458, (s) => s.act === "SLEEP · bed", 8000)) || (await fail("no SLEEP · bed"));
await press();
(await until((s) => s.active, 15000)) || (await fail("the escape (43) did not follow night one"));
await sleep(1200);
await join_("42c-to-43-six-days-later");

// ---------- 43 to 52: the escape, and beat 53 (as tools/escape-showing.mjs escape) ----------
{
  const at = floor;
  const read = async (s) => {
    if (!["bub", "card", "cutaway"].includes(s.cur)) return;
    await sleep(Math.min(3200, 1300 + s.text.length * 25));
    await press();
    await sleep(300);
  };
  const done = { wrong: false, plan: 0, sasquatch: false, plaque: false, chair: false, frame: false };
  let lastStep = "",
    tapAt = 0,
    lastLog = 0;
  const spots = () => page.evaluate(() => window.__ss.spotsNow().map((q) => ({ id: q.id, verb: q.verb || "", who: q.who, x: q.x, y: q.y })));
  const end = Date.now() + 15 * 60000;
  for (;;) {
    if (Date.now() > end) await fail("ran out of time in the escape");
    const s = await st();
    // (beat 53 is pickup day's module now: it is on as soon as the escape hands over)
    if (s.ch1Step === "pack1" || (await page.evaluate(() => !!(window.SSQ.beat("ch1-pickup") && window.SSQ.beat("ch1-pickup").active())))) break;
    const step = s.es && s.es.step;
    if (step && step !== lastStep) ((lastStep = step), log(step), await sleep(300), await still("es-" + step));
    if (["bub", "card", "cutaway"].includes(s.cur)) {
      await read(s);
      continue;
    }
    if (s.cur === "wait") {
      await sleep(3600);
      await press();
      await sleep(300);
      continue;
    }
    if (!s.ctrl || s.cur) {
      await sleep(110);
      continue;
    }
    const es = s.es || {};
    if (es.cu) {
      if (es.step === "pad") {
        const key = async (d) => {
          const p = await page.evaluate((d) => window.SSQ.beat("ch1-escape").place.keyAt(d), d);
          await at(p.x, p.y);
          await sleep(550);
        };
        const code = await page.evaluate(() => window.SSQ.beat("ch1-escape").place.OFFICE_CODE);
        if (!done.wrong) ((done.wrong = true), await sleep(900), await key("9"), await sleep(900));
        for (const d of code) await key(d);
        await sleep(400);
        await still("50-keypad-open");
      } else if (es.step === "site") {
        // (round 7, q: 124: the Universal Postal Service page: SCHEDULE A PICKUP, then BIG, then ONE SASQUATCH once for
        // "Not that one!", then GOAT STUFF)
        const R = await page.evaluate(() => window.SSQ.beat("ch1-escape").place.SITE);
        const pg = es.sitePage || 0;
        const b = pg === 2 && !done.sasquatch ? ((done.sasquatch = true), R.inside[2]) : [R.schedule, R.sizes[2], R.inside[1]][pg];
        await sleep(1200);
        await still("51-site-page-" + (pg + 1));
        await at((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2);
        await sleep(700);
      } else if (es.step === "drawplan") {
        // (round 7, q: 132: the plan drawn at his desk, one picture a tap)
        await sleep(1200);
        await still("45-plan-picture-" + ++done.plan);
        await press();
        await sleep(700);
      } else if (es.step === "label") (await sleep(800), await at(480, 600), await sleep(600));
      else if (es.step === "note") (await sleep(900), await at(480, 320), await sleep(500));
      else if (es.step === "snacks" || es.step === "food") {
        const SN = await page.evaluate(() => window.SSQ.beat("ch1-escape").place.SNACKS);
        const i = SN.kinds.findIndex((kk, j) => !es.snacks.gone[j] && !(es.step === "snacks" && j === SN.kinds.lastIndexOf("cake")));
        es.step === "food" ? await at(SN.plate.x, SN.plate.y - 30) : i >= 0 && (await at(SN.at[i].x, SN.at[i].y));
        await sleep(1000);
      } else await sleep(200);
      continue;
    }
    // the bay at night (47): round the patrolling robot, as the escape's own showing does
    if (es.step === "sneak" && s.room === "hangar" && es.robot) {
      const r = es.robot,
        P = { x: s.x, y: s.y },
        go = async (x, y) => Date.now() - tapAt > 700 && ((tapAt = Date.now()), await page.evaluate(([x, y]) => (window.__ss.drawFrame(), window.__ss.tapAt(x, y, false)), [x, y]));
      if (s.pose === "ball") (!es.guard && r.phase === "patrol" && (await go(P.x + 30, P.y)), await sleep(200));
      else if (P.y < 560 && P.x < 600) r.f > 0 || P.x > 90 ? await go(P.x < 120 ? 70 : P.x, 585) : await sleep(150);
      else if (P.x < 630) await go(636, 585);
      else if (P.y > 340) r.f < 0 || P.y < 560 ? await go(636, 330) : await sleep(150);
      else await go(846, 322);
      await sleep(120);
      continue;
    }
    let list = await spots();
    const pick = (id) => list.find((q) => q.id === id);
    let sp = list[0];
    if (es.step === "walkhome" && s.room === "passage" && !done.plaque && pick("es-plaque")) ((sp = pick("es-plaque")), (done.plaque = true));
    // (round 7, q: 124: LOOK · screens, the bay on the security screen; LOOK · poster; LOOK · cabinet)
    if (es.step === "computer" && !done.frame && pick("es-screens")) sp = pick("es-screens");
    else if (es.step === "computer" && !done.chair && pick("es-poster")) sp = pick("es-poster");
    else if (es.step === "computer" && !done.drawer && pick("es-drawer")) sp = pick("es-drawer");
    if (!sp) {
      await sleep(150);
      continue;
    }
    if (Date.now() - lastLog > 8000) ((lastLog = Date.now()), log("at " + JSON.stringify({ step: es.step, room: s.room, sp: sp.id, act: s.act })));
    const mops = sp.who === "mo";
    const here = mops ? s.mo : { x: s.x, y: s.y };
    const close = Math.hypot(here.x - sp.x, here.y - sp.y) < 12;
    if (sp.verb && s.act === sp.verb + " · " + (await page.evaluate((id) => (window.__ss.spotsNow().find((q) => q.id === id) || {}).cap || "", sp.id))) {
      sp.id === "es-screens" && (done.frame = true);
      sp.id === "es-poster" && (done.chair = true);
      sp.id === "es-drawer" && (done.drawer = true);
      await sleep(500);
      await press();
      await sleep(500);
      continue;
    }
    if (!close && Date.now() - tapAt > 700) ((tapAt = Date.now()), await at(sp.x, sp.y));
    await sleep(120);
  }
  await sleep(1500);
  await join_("52-to-53-pickup-day");
}
await sleep(1500);
await finishRecording();
errors.length && console.log("page errors:", errors.slice(0, 5));
await g.finish("day2-showing");
process.exit(0);
