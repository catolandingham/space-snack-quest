/**
 * One showing video of the whole of Chapter 1, from the Day 1 morning to the Chapter 1 tally card, for Brian: ONE game
 * session (?ch=1 opened once, never reloaded, no debug jump), played by touch only, at real speed, on a phone-size page
 * (375 x 812, video 750 x 1624), with the game's own sound. The finger does what the other showing tools do, one after the
 * other in the same game, so every hand-over plays as a player meets it:
 *   morning   the Day 1 morning at home (sing along, homework, the calendar, the closet, peek out the door)
 *   party     tools/party-video.mjs (the sneak, the disguise: P2 to P6), tools/party-showing.mjs keep (the dance, the photo,
 *             the octopus, the snack bar, the alarm, home, the card), day1end (the cleanup as Mops, truth or fib, the talk,
 *             the TV story, the bedtime story) to Day 2 fading in
 *   day2      tools/party-showing.mjs morning (the home morning) and lunch (the lunch sneak), then tools/day2-showing.mjs (beat
 *             28 to beat 53: the bay, the photo wall, the party hall's robots, the storm and the evening, the escape)
 *   pickup    tools/pickup-showing.mjs pickup (pickup day, to the tally card)
 * Recorded the same way (the browser's screencast, the sound from the game's master volume, joined by ffmpeg). Not a
 * test: it reads the game only to know when to act.
 *   npm run build && node tools/chapter-showing.mjs <out.mp4>
 *   SHOWING_STILLS=<dir> also writes a still of each step there, and of each hand-over (named "JOIN-<from>-to-<to>.png",
 *   with no number in front); extra pictures (jpeg) of a few moments go to <dir>/extras. The moments go to <out>.marks.json.
 *   SHOWING_SILENT=1 leaves the sound out.
 *   CHAPTER_FROM=cleanup|day2|bay|pickup starts further on, from a debug link: for looking into one part only; the whole
 *   chapter in one session is the default and the only thing the video is for.
 */
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { startGame, sleep, root } from "../tests/game-page.mjs";

const [outFile] = process.argv.slice(2);
if (!outFile) {
  console.error("Usage: node tools/chapter-showing.mjs <out.mp4>");
  process.exit(2);
}
const SILENT = !!process.env.SHOWING_SILENT;
const STILLS = process.env.SHOWING_STILLS || "";
STILLS && mkdirSync(join(STILLS, "extras"), { recursive: true });
const FROM = ["day1", "cleanup", "day2", "bay", "pickup"].indexOf(process.env.CHAPTER_FROM || "day1");
if (FROM < 0) throw new Error("CHAPTER_FROM must be day1, cleanup, day2, bay or pickup");
const WORK = join(root, "tests", "out", "chapter-showing-work");
rmSync(WORK, { recursive: true, force: true });
mkdirSync(join(WORK, "fr"), { recursive: true });
mkdirSync(dirname(outFile), { recursive: true });
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
const g = await startGame({ port: 9500, name: "chapter-showing" });
const START = ["?ch=1", "?beat=party:P8b", "?beat=day2", "?ch=1", "?beat=pickup"][FROM];
const { page, errors } = await g.open(START, PHONE);
page.on("pageerror", (e) => console.log("PAGE ERROR " + String(e).slice(0, 300)));
await page.evaluate(() => window.__ss.lockedReady);
if (FROM === 1) await page.evaluate(() => (window.__ss.op.ch1PartyNow.shot = { phase: "done", got: true }));
if (FROM === 3)
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

// ---------- recording (as tools/day2-showing.mjs) ----------
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

// ---------- a finger, and what it reads (every field the tools read) ----------
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
      d = es.debug(),
      pb = window.SSQ.beat("ch1-party"),
      pkb = window.SSQ.beat("ch1-pickup"),
      p = n.ch1PartyNow,
      dn = p && p.dance,
      label = b ? [...b.childNodes].filter((x) => x.nodeType === 3 || (x.nodeType === 1 && x.tagName !== "STYLE")).map((x) => x.textContent).join("").trim() : "";
    return {
      act: n.act ? n.act.verb + (n.act.cap ? " · " + n.act.cap : "") : "",
      label,
      cur: c ? c.k : "",
      id: c ? c.id || "" : "",
      text: c && c.b ? c.b.text : c ? c.text || "" : "",
      auto: !!(c && c.auto),
      ctrl: !!n.ctrl,
      room: n.room,
      scene: n.scene || "",
      x: n.sq.x,
      y: n.sq.y,
      mo: { x: n.mo.x, y: n.mo.y },
      pose: n.sqPose,
      btn: r ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null,
      cv: [cv.x, cv.y, cv.width, cv.height],
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
      // pickup day's (tools/pickup-showing.mjs)
      pk: pkb.debug().state,
      pkOn: pkb.active(),
      // the party's (tools/party-showing.mjs)
      now: pb.now(),
      full: ["dance", "party card", "group photo", "dress-up"].find((l) => document.querySelector(`canvas[aria-label="${l}"]`)) || "",
      glow: dn && dn.live && dn.seen && dn.seen.glow ? { x: dn.seen.glow.x, y: dn.seen.glow.y, n: (dn.round || 0) * 100 + dn.i } : null,
      end: dn && dn.over && dn.seen && dn.seen.end ? { ...dn.seen.end, level: dn.level } : null,
      snack: p && p.snack ? { phase: p.snack.phase, t: p.snack.t, reach: !!p.snack.reach, zoom: p.snack.zoom, fall: p.snack.fall } : null,
      slots: p && p.snacks && p.snacks.slots ? p.snacks.slots.slice() : null,
      bag: p && p.snacks ? p.snacks.bag : 0,
      dress: pb.dressTargets ? pb.dressTargets() : null,
      day2: !!n.ch1Day2,
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
// a hand-over between two parts: its own still and mark, with the name the joins are looked at by (no number in front)
const join_ = async (name) => (log("JOIN " + name), mark("JOIN-" + name), STILLS && (await page.screenshot({ path: join(STILLS, "JOIN-" + name + ".png") })));
// pictures of a moment as it plays (jpeg, in extras/): started with burst(), stopped with the function it returns
const burst = (name, every = 450) => {
  let on = true,
    i = 0;
  const run = (async () => {
    while (on && STILLS) {
      try {
        await page.screenshot({ path: join(STILLS, "extras", name + "-" + String(i++).padStart(3, "0") + ".jpg"), type: "jpeg", quality: 72 });
      } catch {}
      await sleep(every);
    }
  })();
  return async () => ((on = false), await run);
};
const fail = async (m) => {
  const q = await st();
  log("STOPPED: " + m + " " + JSON.stringify({ act: q.act, label: q.label, scene: q.scene, party: q.now && q.now.scene, step: q.step, es: q.es && q.es.step, pk: q.pk && q.pk.step, ctrl: q.ctrl, cur: q.cur, text: q.text, room: q.room, x: Math.round(q.x), y: Math.round(q.y) }));
  STILLS && (await page.screenshot({ path: join(STILLS, "STOPPED.png") }).catch(() => {}));
  await finishRecording().catch(() => {});
  await g.finish("chapter-showing");
  process.exit(1);
};
const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);
// a line, card or picture with words: wait a little, then the big button (or a tap on the picture)
const nextT = async (q, ms) => {
  if (q.auto) return void (await sleep(200));
  await sleep(ms == null ? (q.cur === "cutaway" ? 2600 : 1500) : ms);
  const s = await st();
  s.btn ? await tap(s.btn.x, s.btn.y) : await tap(187, 300);
  await sleep(250);
};

await startRecording();
await sleep(300);

const hall = await import(join(root, "src", "modules", "party-hall.js"));

// =====================================================================================================================
// the Day 1 morning (Q1): the opening, singing along, the homework, the calendar and the closet; then peek out the door
// =====================================================================================================================
if (FROM <= 0) {
  const pressed = new Map(),
    done = new Set();
  const end = Date.now() + 240000;
  let lastTap = 0,
    seenAct = "";
  for (;;) {
    if (Date.now() > end) await fail("the Day 1 morning did not get to the peek");
    const s = await st();
    if (s.cur === "wait") {
      await sleep(3000);
      await press();
      await sleep(300);
      continue;
    }
    if (["bub", "card", "panel", "cutaway"].includes(s.cur)) {
      await nextT(s);
      continue;
    }
    if (!s.ctrl && s.label === "NEXT") {
      // (a close-up, the calendar: its own NEXT)
      await sleep(1500);
      await press();
      await sleep(350);
      continue;
    }
    if (!s.ctrl) {
      await sleep(150);
      continue;
    }
    if (s.label && s.label !== "ACTION") {
      const n = (pressed.get(s.label) || 0) + 1;
      if (n <= 2) {
        pressed.set(s.label, n);
        const verb = s.label.split(" · ")[0];
        for (const q of await page.evaluate(() => window.__ss.placedSpots().map((q) => ({ id: q.id || "", verb: q.verb || "", cap: q.cap || "" })))) q.verb && verb.startsWith(q.verb) && done.add(q.id || q.verb + q.cap);
        if (s.label !== seenAct) ((seenAct = s.label), await sleep(500), await still("q1-" + slug(s.label)));
        await sleep(400);
        await press();
        log("PRESS " + s.label);
        await sleep(500);
        if (/^PEEK/.test(s.label)) break;
        continue;
      }
    }
    const spots = (await page.evaluate(() => window.__ss.placedSpots().map((q) => ({ id: q.id || "", verb: q.verb || "", cap: q.cap || "", x: q.x || 0, y: q.y || 0 })))).filter((q) => q.x && !done.has(q.id || q.verb + q.cap));
    const sp = spots.sort((a, b) => Math.hypot(a.x - s.x, a.y - s.y) - Math.hypot(b.x - s.x, b.y - s.y))[0];
    if (!sp && Date.now() - lastTap > 6000) (done.clear(), pressed.clear());
    if (sp && Date.now() - lastTap > 800) {
      lastTap = Date.now();
      await floor(sp.x, Math.max(sp.y, 380));
    }
    await sleep(120);
  }
  await join_("day1-morning-to-the-party-night");
}

// =====================================================================================================================
// the party night, P2 to P6 (tools/party-video.mjs): into the plant, the catch, "They lost you.", the flyer, the dress-up
// =====================================================================================================================
if (FROM <= 0) {
  const readOn = async (s) => {
    if (s.cur === "bub" || s.cur === "card") {
      await sleep(1100);
      await tap(187, 300);
    }
  };
  await until((q) => q.now && q.now.scene === "P2" && q.ctrl, 40000, readOn);
  log("P2: step into the glancer's look");
  await until((q) => q.now && q.now.glance === "warn", 12000);
  await floor(490, 500);
  (await until((q) => q.cur === "card" && q.id === "jail", 30000)) || (await fail("no LOCKUP card"));
  log("LOCKUP");
  await sleep(1800);
  await still("P2-the-lockup-card");
  await until((q) => q.now && q.now.scene === "P2" && q.ctrl && !q.cur, 20000, readOn);
  log("P2: seen again, hide in the plant");
  await until((q) => q.now && q.now.glance === "warn", 12000);
  await floor(490, 500);
  await until((q) => q.now && (q.now.alarm === "run" || q.now.alarm === "ring"), 10000);
  await floor(400, 552);
  (await until((q) => /^HIDE/.test(q.act), 5000)) || (await fail("no HIDE in the plant"));
  await sleep(300);
  await press();
  (await until((q) => q.now && q.now.scene === "P3", 30000)) || (await fail("P3 did not come"));
  log("P3");
  await until((q) => q.now && q.now.scene === "P4" && q.ctrl, 60000, readOn);
  log("P4");
  await sleep(1800);
  await still("P4-the-flyer-sneak");
  // the cones sweep on a fixed rhythm: the way past them is planned from the game's own cones (tests/party-sneak.mjs) and the
  // finger follows it in real time (as tools/party-showing.mjs flyer)
  const sneak = await import(join(root, "tests", "party-sneak.mjs"));
  const follow = async (to, hidden) => {
    const now = await page.evaluate(() => window.__ss.op.ch1PartyNow.sweepT || 0),
      tl = await sneak.coneTimeline(page, now + 75),
      from = await page.evaluate(() => ({ x: window.__ss.op.sq.x, y: window.__ss.op.sq.y })),
      plan = sneak.planSneak(tl, from, now + 0.3, to, { hidden });
    plan || (await fail("no way past the cones"));
    log(`a way past the cones: ${(plan[plan.length - 1].t - plan[0].t).toFixed(1)} s, with waits`);
    for (;;) {
      const s = await st(),
        t = s.now ? await page.evaluate(() => window.__ss.op.ch1PartyNow.sweepT || 0) : 1e9,
        q = plan.find((p) => p.t >= t + 0.1) || plan[plan.length - 1];
      if (!s.now || s.now.alarm || t > plan[plan.length - 1].t + 1.5) break;
      const at = plan.find((p) => p.t >= t) || plan[plan.length - 1],
        moved = Math.hypot(q.x - s.x, q.y - s.y) > 6;
      moved && s.ctrl && (await floor(q.x, q.y));
      if (at === plan[plan.length - 1] && Math.hypot(s.x - at.x, s.y - at.y) < 14) break;
      await sleep(90);
    }
    const q = await st();
    q.now && q.now.alarm && (await fail("seen on the way"));
  };
  await sleep(800);
  await follow(hall.FLYER.reach, true);
  (await until((q) => q.act === "GRAB · flyer", 4000)) || (await fail("no GRAB · flyer"));
  await sleep(900);
  await press();
  await until((q) => q.now.flyer === "paw" && q.ctrl, 4000);
  log("GRAB · flyer");
  await sleep(700);
  await follow({ x: hall.HALL_DOOR.x, y: hall.HALL_DOOR.y - 50, r: 30 }, false);
  let saved = false;
  (await until((q) => q.now && q.now.scene === "P5" && q.ctrl, 40000, async (q) => {
    if (q.cur === "bub") return readOn(q);
    if (!saved && q.act === "SAVE · flyer" && q.ctrl) return void ((saved = true), await sleep(1500), await press(), log("SAVE · flyer"));
    q.ctrl && q.room === "hall" && (await floor(hall.HALL_DOOR.x, hall.HALL_DOOR.y + 12), await sleep(600));
  })) || (await fail("P5 did not start"));
  log("P5");
  await sleep(1000);
  await floor(150, 400);
  (await until((q) => q.act === "OPEN · closet" && q.ctrl, 8000)) || (await fail("no OPEN · closet"));
  await sleep(1200);
  await press();
  await sleep(1200);
  await still("P5-the-dress-up");
  const dragTo = async (from, to) => {
    await page.touchscreen.touchStart(from.x, from.y);
    for (let i = 1; i <= 12; i++) (await page.touchscreen.touchMove(from.x + ((to.x - from.x) * i) / 12, from.y + ((to.y - from.y) * i) / 12), await sleep(45));
    await page.touchscreen.touchEnd();
    await sleep(900);
  };
  for (const spot of ["head", "face", "body", "legs"]) {
    const d = (await st()).dress;
    const piece = d && d.pieces && d.pieces[0];
    piece && d.spots && (await dragTo(piece, d.spots[spot]));
  }
  await sleep(1500);
  const d = (await st()).dress;
  d && d.go && (await tap(d.go.x, d.go.y));
  await sleep(1500);
  log("out to the party");
  await floor(860, 470);
  (await until((q) => q.now && q.now.scene === "P6" && q.ctrl, 15000)) || (await fail("P6 did not start"));
  await sleep(1800);
  await join_("p5-dress-up-to-p6-the-party");
}

// =====================================================================================================================
// P6 to the card (tools/party-showing.mjs keep), then the cleanup, truth or fib, the TV story and the bedtime story
// (tools/party-showing.mjs day1end), to Day 2 fading in
// =====================================================================================================================
// the pieces of the party (as tools/party-showing.mjs)
const partyRead = async (s) => {
  if (["bub", "card", "panel"].includes(s.cur) && !s.full) {
    await sleep(1300);
    await tap(187, 300);
    await sleep(250);
  }
};
async function goTo(x, y, ok, ms = 9000) {
  const end = Date.now() + ms;
  let last = 0;
  for (;;) {
    const s = await st();
    if ((ok && ok(s)) || Math.hypot(s.x - x, s.y - y) < 16) return s;
    if (Date.now() > end) return s;
    if (["bub", "card", "panel"].includes(s.cur)) await partyRead(s);
    else if (s.ctrl && Date.now() - last > 900) ((last = Date.now()), await floor(x, y));
    await sleep(120);
  }
}
async function dance(hits, miss) {
  let s = await goTo(hall.DANCE_SPOT.x, hall.DANCE_SPOT.y + 4, (q) => q.act === "DANCE · circle");
  s = await until((q) => q.act === "DANCE · circle", 6000, partyRead);
  if (!s) return fail("no DANCE · circle");
  await sleep(500);
  await press();
  await until((q) => q.full === "dance", 4000);
  log("dancing");
  let done = 0,
    seen = 0,
    lastKey = "";
  const end = Date.now() + 90000;
  while (done < hits && Date.now() < end) {
    s = await st();
    if (s.full !== "dance") break;
    if (s.end) {
      await sleep(1600);
      const b = done < hits ? s.end.again : s.end.back;
      await tap(b.x, b.y);
      log(done < hits ? "Dance again (faster)" : "Back to the party");
      await sleep(600);
      continue;
    }
    if (s.glow) {
      const key = Math.round(s.glow.x) + "," + Math.round(s.glow.y) + "," + s.glow.n;
      if (key !== lastKey) {
        lastKey = key;
        seen++;
        if (seen === miss) {
          await until((q) => !q.glow || Math.round(q.glow.x) + "," + Math.round(q.glow.y) + "," + q.glow.n !== key, 5000);
          continue;
        }
        await sleep(650);
        await tap(s.glow.x, s.glow.y);
        done++;
      }
    }
    await sleep(120);
  }
  await sleep(1400);
  const e2 = await until((q) => q.end || q.full !== "dance", 30000);
  e2 && e2.end ? (await sleep(1200), await tap(e2.end.back.x, e2.end.back.y), log("Back to the party")) : (await st()).full === "dance" && (await tap(375 - 36, 36));
  await until((q) => q.full !== "dance" && q.ctrl, 5000);
  log(`danced: ${done} spots hit${miss ? ", one missed" : ""}`);
}
async function photo(ms) {
  let s = await until((q) => q.act === "JOIN · photo", ms, partyRead);
  if (!s) return fail("the photo moment did not come");
  await sleep(900);
  await press();
  log("JOIN · photo");
  s = await until((q) => q.full === "group photo" || (q.now.shot && q.now.shot.phase === "polaroid"), 30000);
  if (!s) return fail("no Polaroid");
  await sleep(2800);
  await still("party-the-polaroid");
  await tap(190, 640);
  await until((q) => q.full !== "group photo" && q.ctrl, 20000, partyRead);
  await floor(560, 470);
  log("the Polaroid");
}
async function snacks(safe, end) {
  const L = await page.evaluate(() => window.SSQ.beat("ch1-party").snackLayout());
  let s = await goTo(L.spot.x - 10, L.spot.y + 10, (q) => q.act === "GRAB · snacks");
  s = await until((q) => q.act === "GRAB · snacks" || (q.now && q.now.scene === "P7"), 8000, partyRead);
  if (s && s.now && s.now.scene === "P7") return void log("an alarm before the snacks");
  if (!s) return fail("no GRAB · snacks");
  await sleep(600);
  await press();
  await until((q) => q.snack && q.snack.zoom >= 1, 6000);
  log("the snack close-up");
  await sleep(500);
  await still("party-the-snack-close-up");
  const take = async (i) => {
    const ok = await until((q) => !q.snack || (q.cur !== "bub" && q.snack.phase === "back" && q.snack.t > 0.5 && q.snack.t < 2.4 && !q.snack.reach), 20000, partyRead);
    if (!ok || !ok.snack) return false;
    await floor(L.cut.snacks[i][1], L.cut.snacks[i][2]);
    return true;
  };
  for (let n = 0; n < safe; n++) {
    s = await st();
    if (!s.slots || !s.snack) return void log("the snack close-up closed (the alarm)");
    const top = s.slots.findIndex((id) => id >= 0);
    if (!(await take(top))) return (await st()).now.scene === "P7" ? void log("the snack close-up closed (the alarm)") : fail("the close-up closed early");
    await until((q) => q.bag >= n + 1, 4000);
    await sleep(700);
    await until((q) => q.cur !== "bub", 6000, partyRead);
  }
  log(`${safe} snacks in the bag`);
  if (end === "caught") {
    for (let n = 1; n <= 2; n++) {
      const ok = await until((q) => !q.snack || (q.cur !== "bub" && q.snack.phase === "face" && q.snack.t > 0.25 && q.snack.t < 1.2 && !q.snack.reach), 25000, partyRead);
      if (ok && !ok.snack && ok.now && ok.now.scene === "P7") return void log("the snack close-up closed (the alarm)");
      if (!ok || !ok.snack) return fail("the close-up closed before she caught him");
      const top = ok.slots.findIndex((id) => id >= 0);
      await floor(L.cut.snacks[top][1], L.cut.snacks[top][2]);
      await until((q) => q.cur === "bub" || !q.snack, 4000);
      log("caught by the bartender, " + n);
      await sleep(1700);
      await tap(187, 300);
      await sleep(400);
    }
    await until((q) => !q.snack, 6000, partyRead);
  }
}
async function runHomeToCard() {
  let s = await until((q) => q.now && q.now.scene === "P7", 20000, partyRead);
  if (!s) return fail("no alarm");
  log("the alarm");
  await still("party-the-alarm");
  s = await until((q) => q.room === "closet" || q.now.card, 40000, async (q) => {
    if (["bub", "card", "panel"].includes(q.cur)) return partyRead(q);
    q.ctrl && q.room === "hall" && (await floor(hall.HALL_DOOR.x, hall.HALL_DOOR.y + 12), await sleep(500));
  });
  s = await until((q) => q.full === "party card" || (q.now && q.now.pose === "bed"), 20000, async (q) => {
    q.act === "HIDE · bed" && q.ctrl && !q.full && (await sleep(250), await press(), await sleep(500));
  });
  s = await until((q) => q.full === "party card", 60000, partyRead);
  if (!s) return fail("no card");
  log("the card");
  await sleep(3200);
  await still("party-the-card");
}
async function juke(ms) {
  const end = Date.now() + ms,
    B = { x0: 120, x1: 760, y0: 380, y1: 585 };
  for (;;) {
    const s = await st();
    if (Date.now() > end || !s.now || !s.now.oct || !["chase", "hug", "ready"].includes(s.now.oct.mode)) break;
    if (["bub", "card", "panel"].includes(s.cur)) {
      await partyRead(s);
      continue;
    }
    const o = await page.evaluate(() => window.__ss.op.ch1PartyNow.people["octopus-guest"]);
    let dx = s.x - o.x,
      dy = s.y - o.y;
    const d = Math.hypot(dx, dy) || 1;
    (dx /= d), (dy /= d);
    let to = { x: s.x + dx * 160, y: s.y + dy * 160 };
    if (to.x < B.x0 || to.x > B.x1) to = { x: Math.min(B.x1, Math.max(B.x0, to.x)), y: s.y + (s.y < (B.y0 + B.y1) / 2 ? 150 : -150) };
    if (to.y < B.y0 || to.y > B.y1) to = { x: s.x + (s.x < (B.x0 + B.x1) / 2 ? 170 : -170), y: Math.min(B.y1, Math.max(B.y0, to.y)) };
    s.ctrl && (await floor(to.x, to.y));
    await sleep(260);
  }
}

if (FROM <= 0) {
  // keep (tools/party-showing.mjs): the dance (one spot missed), the group photo, the octopus, the snack bar, the alarm, home, the card
  await dance(16, 4);
  await goTo(300, 545);
  await photo(70000);
  const octOn = (q) => q.now.oct && ["ready", "lunge", "hug", "chase"].includes(q.now.oct.mode);
  await goTo(640, 560, octOn);
  let s = await until(octOn, 40000, partyRead);
  s || (await fail("the octopus did not notice"));
  log("the octopus");
  s = await until((q) => q.now.oct.mode === "chase" && q.ctrl && q.cur !== "bub", 30000, partyRead);
  s || (await fail("the real chase did not start"));
  log("the chase: juke");
  await juke(26000);
  s = await st();
  log(s.now.gone.length ? "the second hug knocked his " + s.now.gone.join(", ") + " off; off to the snack bar" : "the octopus is bored; off to the snack bar");
  (await st()).now.scene === "P6" && (await snacks(2, "caught"));
  await runHomeToCard();
  const T = await page.evaluate(() => window.SSQ.beat("ch1-party").cardTargets());
  await tap(T.keep.x, T.keep.y);
  await until((q) => q.full !== "party card", 4000);
  log("card: keep");
}
if (FROM <= 1) {
  // the cleanup (tools/party-showing.mjs day1end): the player is Mops, mopping the party hall
  const C = await import(join(root, "src", "modules", "party-cleanup.js"));
  const more = () =>
    page.evaluate(() => {
      const n = window.__ss.op,
        now = window.SSQ.beat("ch1-party").now();
      return { mo: { x: n.mo.x, y: n.mo.y }, clean: now && now.clean, truthOpen: !!(now && now.truthOpen), close: now && now.close ? now.close.phase : "" };
    });
  const mopsTo = async (x, y, ms = 7000) => {
    const end = Date.now() + ms;
    let last = 0;
    for (;;) {
      const m = await more(),
        q = await st();
      if (Math.hypot(m.mo.x - x, m.mo.y - y) < 14 || Date.now() > end || (q.cur && q.cur !== "until")) return;
      q.ctrl && Date.now() - last > 900 && ((last = Date.now()), await floor(x, y));
      await sleep(120);
    }
  };
  // (from a debug start at closing time the speaker comes first; from the card Squatch is home and Mops starts at once)
  await until((q) => q.now && q.now.scene === "P9" && q.ctrl && !q.cur, 90000, async (q) => {
    if (["bub", "card", "panel"].includes(q.cur)) return nextT(q);
    q.ctrl && q.room === "hall" && q.now && q.now.scene !== "P9" && q.now.close && !["speak", "cheer", "dim"].includes(q.now.close.phase) && (await floor(hall.HALL_DOOR.x, hall.HALL_DOOR.y + 12), await sleep(600));
  });
  log("the cleanup");
  await join_("party-card-to-the-cleanup-as-mops");
  await still("p9-mops-cleans-the-party-hall");
  const sp = C.SPILLS[1];
  await mopsTo(sp.x + 60, sp.y);
  await mopsTo(sp.x - 90, sp.y);
  for (let i = 0; i < 30; i++) {
    const m = await more();
    if (!m.clean || m.clean.beard >= 1) break;
    await mopsTo(i % 2 ? 90 : 760, [330, 390, 450, 510, 570][i % 5]);
  }
  await sleep(1200);
  for (const end = Date.now() + 300000; Date.now() < end; ) {
    const q = await st(),
      m = await more(),
      c = m.clean;
    if (q.now && q.now.scene === "P9b") break;
    if (["bub", "card", "panel", "cutaway"].includes(q.cur)) {
      await nextT(q);
      continue;
    }
    if (c && c.close) {
      await sleep(1600);
      const b = c.close === "shirt" ? c.targets.shirt : c.close === "feet" ? c.targets.feet : null;
      b && (await floor(b.x, b.y));
      await sleep(400);
      continue;
    }
    if (!q.ctrl || !c) {
      await sleep(120);
      continue;
    }
    if (q.act) {
      await sleep(700);
      await press();
      await sleep(400);
      continue;
    }
    if (c.beard >= 1) await mopsTo(C.WRING_AT.x, C.WRING_AT.y);
    else if (c.found) (await sleep(800), await floor(477, 622), await sleep(1500));
    else if (c.phase === "find") await mopsTo(c.find.x, c.find.y + 30);
    else if (c.lit) {
      const x = (c.lit.x0 + c.lit.x1) / 2,
        y = (c.lit.y0 + c.lit.y1) / 2 + 4;
      await mopsTo(Math.max(70, x - C.BEARD_TIP.dx - 50), y);
      await mopsTo(x - C.BEARD_TIP.dx + 6, y);
    } else await sleep(200);
  }
  log("home: truth or fib");
  await until(async () => (await more()).truthOpen, 40000, async (q) => ["bub", "card"].includes(q.cur) && (await nextT(q)));
  await sleep(2500);
  await still("p9b-truth-or-fib");
  const T = await page.evaluate(() => window.SSQ.beat("ch1-party").truthTargets());
  T ? await tap(T.tell.x, T.tell.y) : await fail("no truth or fib buttons");
  // the talk, the TV story and the bedtime story, read at a kid's pace, to Day 2
  const seenCards = new Set();
  await until((q) => q.day2, 400000, async (q) => {
    if (!["bub", "card", "panel", "cutaway"].includes(q.cur)) return;
    const key = q.cur + "|" + q.id + "|" + q.text.slice(0, 30);
    if (q.cur !== "bub" && !seenCards.has(key) && seenCards.size < 60) (seenCards.add(key), await sleep(800), await still("tv-bedtime-" + slug(q.cur + " " + q.id + " " + q.text.slice(0, 24))));
    await nextT(q);
  });
  log("Day 2");
  await sleep(600);
  await join_("bedtime-to-day-2-the-home-morning");
}

// =====================================================================================================================
// Day 2's home morning (tools/party-showing.mjs morning) and the lunch sneak (tools/party-showing.mjs lunch)
// =====================================================================================================================
if (FROM <= 2) {
  const hm = () =>
    page.evaluate(() => {
      const d = window.SSQ.beat("ch1-home-morning").debug();
      return d.state ? d.state.step : "";
    });
  const walkTo2 = async (x, y, act) => {
    await floor(x, y);
    (await until((q) => q.act === act, 9000)) || (await fail("no " + act + " after walking to " + x + ", " + y));
  };
  log("the bedtime story's fade to black");
  await sleep(900);
  await still("bedtime-fades-to-black");
  await until(async () => (await hm()) === "night", 4000);
  await sleep(700);
  await still("dark-mops-leaves-heard");
  await sleep(1300);
  await still("room-comes-up-asleep-under-the-blanket");
  await until(async () => (await hm()) === "wake", 4000);
  const seenOnce = new Set();
  const once = async (name) => seenOnce.has(name) || (seenOnce.add(name), await still(name));
  const t1 = Date.now() + 150000;
  let calendar = false;
  for (;;) {
    if (Date.now() > t1) await fail("the home morning did not reach the hall");
    const q = await st(),
      step = await hm();
    if (q.room === "hall" && q.ctrl) break;
    if (["bub", "card", "panel", "cutaway"].includes(q.cur)) {
      await sleep(q.cur === "cutaway" ? 1400 : 900);
      await once(step + "-" + q.cur + "-" + String(q.text || "").slice(0, 24).replace(/[^A-Za-z0-9]+/g, "-").toLowerCase());
      await sleep(q.cur === "cutaway" ? 1200 : 1500);
      const again = await st();
      again.cur === q.cur && again.text === q.text && (await nextT(again, 0));
      await sleep(400);
      continue;
    }
    if (!q.ctrl) {
      step === "wake" && (await once("sits-up-and-stretches"));
      step === "think" && (await sleep(500), await once("thinks-of-the-guardian-box"));
      step === "mopsUp" && (await sleep(500), await once("mops-gets-up-heart"));
      await sleep(250);
      continue;
    }
    if (step === "rocket") {
      await sleep(1000);
      await once("rocket-outlined-pick-up");
      await press();
    } else if (step === "closet") {
      await sleep(800);
      await once("closet-outlined");
      await walkTo2(300, 400, "OPEN · closet");
      await sleep(500);
      await once("open-closet");
      await press();
    } else if (step === "box") {
      await sleep(900);
      await once("box-outlined-put-in");
      await press();
    } else if (step === "toBag") {
      await sleep(900);
      await once("bag-outlined-walk-to-it");
      await floor(760, 505);
      await until(async (q2) => q2.cur === "bub" || (await hm()) !== "toBag", 8000);
    } else if (step === "lunch") {
      await sleep(700);
      await once("lunch-goal");
      if (!calendar && q.act === "LOOK · calendar") {
        calendar = true;
        await press();
        await sleep(1300);
        await once("calendar-today-optional");
        await sleep(2400);
        await floor(880, 540);
        await sleep(600);
        continue;
      }
      await walkTo2(760, 505, "TAKE · lunch");
      await sleep(400);
      await once("take-lunch");
      await press();
      await until((q2) => q2.room === "hall" && q2.ctrl, 10000);
    } else await sleep(300);
  }
  await sleep(600);
  await still("out-the-door-lunch-sneak-starts");
  await join_("day-2-home-morning-to-the-lunch-sneak");
  await sleep(900);
}
if (FROM <= 2) {
  const lu = () =>
    page.evaluate(() => {
      const n = window.__ss.op,
        l = n.ch1Lunch || {},
        b = window.SSQ.beat("ch1-lunch"),
        w = (id) => {
          const q = [...b.place.WATCHERS, b.place.COUNTER_WATCHER].find((x) => x.id === id);
          return b.place.watcherNow(q, id === "robot" ? l.counterT || 0 : l.t || 0);
        };
      return { step: l.step, pose: l.pose, alarm: l.alarm ? l.alarm.phase : "", look: l.mops ? l.mops.phase || "" : "", teal: w("teal"), camera: w("camera"), robot: w("robot"), jail: !!(n.cur && n.cur.id === "jail") };
    });
  const stepIs3 = (name, ms = 10000) => until(async (q) => (await lu()).step === name && q.ctrl, ms);
  const walkTo3 = async (x, y, act, ms = 9000) => {
    await floor(x, y);
    (await until((q) => q.act === act, ms, async (q) => q.ctrl && !q.act && Math.hypot(q.x - x, q.y - y) > 30 && !q.cur && (await sleep(700), await floor(x, y)))) || (await fail("no " + act + " after walking to " + x + ", " + y));
  };
  const LUNCH_DOOR = (await import(join(root, "src", "modules", "lunch-sneak-place.js"))).LUNCH_PLACES.door.walkTo;
  const awayNow = (id, ms = 9000) => until(async () => ((w) => w.phase === "away" && w.k < 0.08)((await lu())[id]), ms);
  await sleep(300);
  await still("take-lunch-done-walk-in-mops-his-way-out");
  (await stepIs3("plant", 40000)) || (await fail("no plant step"));
  await sleep(900);
  await still("only-the-hallway-doorway-glows");
  if ((await st()).act === "ROLL · ball") {
    await press();
    await sleep(900);
    await still("roll-ball");
    await sleep(600);
  }
  await walkTo3(396, 552, "HIDE · plant");
  await press();
  await sleep(700);
  await still("hidden-in-the-plant");
  await awayNow("teal");
  await still("she-looks-away-go");
  await walkTo3(600, 478, "HIDE · crate");
  await press();
  await sleep(700);
  await still("hidden-behind-the-crates-eyes-at-the-seam");
  await awayNow("camera");
  await floor(905, 320);
  await sleep(1400);
  await still("at-the-hallway-doorway");
  await floor(LUNCH_DOOR.x, LUNCH_DOOR.y);
  (await until((q) => q.room === "passage", 6000)) || (await fail("not into the hallway"));
  await sleep(900);
  await still("the-hallway-mops-mops-with-his-beard");
  await until(async () => ((await lu()).look || "") === "left", 4000);
  await sleep(700);
  await still("mops-looks-left");
  await until(async () => ((await lu()).look || "") === "right", 3000);
  await sleep(700);
  await still("mops-looks-right");
  await until(async () => ((await lu()).look || "") === "hearts", 3000);
  await sleep(500);
  await still("mops-sees-him-hearts");
  (await stepIs3("give")) || (await fail("no give step"));
  await sleep(700);
  await still("mops-glows-give-him-his-lunch");
  await walkTo3(540, 488, "GIVE · lunch");
  await press();
  await sleep(300);
  await still("the-bag-goes-to-mops");
  await until((q) => q.cur === "bub", 4000);
  await sleep(700);
  await still("my-lunch-youre-the-best");
  await sleep(1400);
  await nextT(await st(), 0);
  await until((q) => q.cur === "cutaway", 3000);
  await sleep(900);
  await still("mops-eats-the-sandwich");
  await sleep(1400);
  await still("then-the-bag");
  (await stepIs3("back", 12000)) || (await fail("no back step"));
  await sleep(600);
  await still("go-on-the-doorway-is-outlined");
  await floor(50, 345);
  await until(async () => (await lu()).step === "one", 9000);
  await until((q) => q.cur === "bub", 5000);
  await sleep(900);
  await still("counter-close-up-mops-grab-one-snack");
  await sleep(2200);
  await nextT(await st(), 0);
  (await stepIs3("snack", 8000)) || (await fail("no snack step"));
  await sleep(500);
  await still("grab-one-snack-he-looks-away");
  await press();
  await sleep(700);
  await still("he-reaches-over-for-one");
  await until(async () => (await lu()).step === "chew", 3000);
  await sleep(400);
  await still("he-eats-it");
  await until((q) => q.cur === "bub", 5000);
  await sleep(800);
  await still("beat-28-the-ship-is-coming");
  await sleep(1000);
  await join_("lunch-sneak-to-28-the-loading-bay");
}

// =====================================================================================================================
// beat 28 to beat 53 (tools/day2-showing.mjs)
// =====================================================================================================================
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

// ---------- 28 to 36: the loading bay (as tools/party-showing.mjs bay) ----------
if (FROM <= 3) {
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
  (await watch((s, b) => b.step === "counter" && s.ctrl && !s.cur, 60000)) || (await fail("the counter step did not come"));
  await sleep(1400);
  await still("29-ducked-behind-the-counter-the-doorway-outlined");
  // (extra pictures of the walk out from behind the counter, for the counter robot's cone)
  const stopCounter = burst("28-walk-out-counter", 350);
  await walk(893, 380);
  await sleep(500);
  await walk(930, 318, (q) => q.step !== "counter");
  await stopCounter();
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
  await sleep(1300);
  await still("bay-the-office-door-opens-roll-ball");
  // (extra pictures of the hallway's office door closing)
  const stopDoor = burst("hallway-office-door", 350);
  await press();
  (await watch((s, b) => !b.active && s.step === "walkin", 60000)) || (await fail("beat 37 did not follow beat 36"));
  await stopDoor();
  await join_("36-to-37-the-hallway-goes-on");
}

if (FROM <= 3) {
  // ---------- 37: the photo wall (as tools/evening-showing.mjs wall) ----------
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
}

if (FROM <= 3) {
  // ---------- 36b: the party hall's cleaning robots ----------
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
  (await until(async (s) => (await bay()).step === "hall" && s.ctrl && s.cur !== "bub", 30000, async (s) => s.cur === "bub" && (await sleep(1600), await tap(s.btn.x, s.btn.y), await sleep(300)))) || (await fail("36b's control did not come"));
  await sleep(900);
  await still("36b-get-past-the-robots");
  // (since the story pass the goal is HIDE · bar, a step in from the doorway: no crossing of the robots' lanes)
  (await until((q) => q.act === "HIDE · bar", 8000)) || (await walk(862, 330, (q) => q.act === "HIDE · bar", 6000));
  (await until((q) => q.act === "HIDE · bar", 3000)) || (await fail("no HIDE · bar"));
  await sleep(700);
  await still("36b-hide-bar");
  await press();
  (await until((s) => s.step === "tostorm" || s.step === "storm", 30000, async (s) => (s.cur === "bub" || s.cur === "card") && (await readEv()) )) || (await fail("the storm did not follow 36b"));
  await join_("36b-to-38a-to-the-storm");
}

if (FROM <= 3) {
  // ---------- 38a to 42c: the evening and night one (as tools/evening-showing.mjs bar, alone, fight, night; round 7) ----------
  await sleep(1800);
  await still("rolled-up-behind-the-bar");
  (await readStills((s) => s.step === "greet" && s.ctrl && !s.cur, { "You missed a corner.": "you-missed-a-corner", "The Great Red Storm is passing!": "pa-the-storm", "GUESTS PRESENT. CLEANING PAUSED.": "the-robots-stop", "You are MOPS now.": "you-are-mops-now", "Red like Mars.": "the-family-at-the-window", "A GOAT! Can I pet him?": "a-goat-can-i-pet-him", "The only goat janitor in the whole galaxy.": "the-only-goat-janitor" }, 150000)) || (await fail("the greet step did not come"));
  await sleep(800);
  await still("the-family-at-the-bar-greet-kid");
  await press();
  await sleep(2200);
  await still("the-kid-pets-the-goat");
  (await readStills((s) => s.step === "ask" && s.ctrl && !s.cur, { "Come on. Bedtime.": "come-on-bedtime" }, 40000)) || (await fail("the ask step did not come"));
  await sleep(700);
  await still("they-turn-to-go-talk-family");
  await press();
  for (const end = Date.now() + 90000; ; ) {
    if (Date.now() > end) await fail("no brochure close-up");
    const s = await st();
    if (s.view && s.view.kind === "brochure" && s.view.ready) break;
    if (s.cur === "bub") {
      const names = { "And FIZZY!": "and-fizzy", "A family of Wookiees makes them.": "a-family-of-wookiees", "You can only get them at their stand.": "only-at-their-stand", "In fact, I've got a brochure here.": "dad-hands-mops-the-brochure" };
      names[s.text] && (await sleep(700), await still(names[s.text]));
      await readEv();
      continue;
    }
    await sleep(150);
  }
  await sleep(1600);
  await still("the-brochure-close-up-waits-for-a-tap");
  await tapView((await st()).view.close);
  (await readStills((s) => s.step === "gohome" && s.ctrl && !s.cur, { "You are SQUATCH now.": "you-are-squatch-now", "Take this home.": "mops-passes-it-down", "We'll talk tonight.": "well-talk-tonight" }, 60000)) || (await fail("the walk home did not come"));
  await sleep(900);
  await still("the-home-doorway-outlined");
  // alone
  (await walkTo(477, 600, (s) => s.room === "closet", 12000)) || (await fail("not home"));
  (await stepIs("box", 8000)) || (await fail("no box step"));
  await sleep(800);
  await still("home-alone-open-box");
  await press();
  (await stepIs("bite", 4000)) || (await fail("no bite step"));
  await sleep(700);
  await still("this-weeks-kind-bite");
  await press();
  await sleep(1100);
  await still("crunch-silence");
  await readStills((s) => s.step === "crate" && s.ctrl && !s.cur, { "No fizz.": "no-fizz" }, 10000);
  await sleep(700);
  (await walkTo(330, 458, (s) => s.act === "HOLD UP · brochure", 6000)) || (await fail("no HOLD UP · brochure"));
  await press();
  const k2 = await until((s) => s.view && s.view.kind === "crate" && s.view.ready, 4000);
  k2 || (await fail("no crate close-up"));
  await sleep(2200);
  await still("the-brochure-beside-the-faded-stamp");
  await tapView(k2.view.close);
  await readStills((s) => s.step === "evening", { "We always thought it said STARS.": "we-always-thought-it-said-stars", "Maybe it's MARS!": "maybe-its-mars" }, 12000);
  // fight
  (await readStills((s) => s.step === "show" && s.ctrl && !s.cur, { "That evening…": "that-evening" }, 40000)) || (await fail("no show step"));
  await sleep(800);
  await still("mops-home-show-brochure");
  await press();
  await sleep(900);
  await still("he-holds-it-up");
  (await readStills((s) => s.step === "choose" && s.ctrl && !s.cur, { "Mops! Look. Maybe my crate says MARS.": "maybe-my-crate-says-mars", "The man said Wookiees. You're not a Wookiee.": "the-man-said-wookiees", "YOU thought I was a Wookiee!": "you-thought-i-was-a-wookiee", "You're one of a kind. Like me.": "one-of-a-kind", "Safe? I have to HIDE here.": "i-have-to-hide-here", "The Guardians are here.": "the-guardians-are-here" }, 90000)) || (await fail("no choose step"));
  await sleep(900);
  await still("ask-again-or-stomp-to-bed");
  (await walkTo(330, 458, (s) => s.act === "STOMP · to bed", 6000)) || (await fail("no STOMP · to bed"));
  await press();
  for (const end = Date.now() + 90000; ; ) {
    if (Date.now() > end) await fail("no bed step");
    const s = await st();
    if (s.step === "bed" && s.ctrl && !s.cur) break;
    if (s.cur === "bub") {
      const names = { "Squatch. Wait.": "squatch-wait", "Squatch... I already...": "i-already", "Maybe my REAL family wouldn't make me hide!": "my-real-family", "Bed. The floors don't mop themselves.": "bed" };
      names[s.text] && (await sleep(700), await still(names[s.text]));
      await readEv();
      continue;
    }
    await sleep(150);
  }
  await sleep(700);
  await still("to-bed");
  await press();
  for (const [ms, name] of [[2600, "in-bed"], [2600, "lights-down-no-song"], [2600, "mops-dozes"], [2200, "fainting-goat"], [2400, "on-his-side-head-on-the-bucket-snoring"]]) (await sleep(ms), await still(name));
  await until((s) => s.step === "idea", 20000);
  for (const [ms, name] of [[1100, "idea-mops-mopping"], [1400, "idea-robots-mopping"], [1400, "idea-the-ship"]]) (await sleep(ms), await still(name));
  (await readStills((s) => s.step === "out" && s.ctrl && !s.cur, { "The floors don't mop themselves...": "the-floors-dont-mop-themselves", "The form!": "the-form" }, 40000)) || (await fail("no out step"));
  await sleep(800);
  await still("night-one-the-doorway-outlined");
  // night
  const waitStart = async (phase) => (await until((s) => s.look.phase !== phase, 9000), await until((s) => s.look.phase === phase, 9000));
  async function crossBay(points) {
    for (const p of points) (await walkTo(p.x, p.y, null, 8000)) || (await fail("stuck crossing the bay at " + p.x + "," + p.y));
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
  await still("42b-the-loading-bay-at-night-the-bin");
  (await walkTo(212, 398, (s) => s.act === "GRAB · copies", 8000)) || (await fail("no GRAB · copies"));
  await press();
  await readStills((s) => s.view && s.view.kind === "order" && s.view.ready, { "If they replace Mops...": "if-they-replace-mops", "Or put it back. And stay.": "or-put-it-back" }, 20000);
  await sleep(1200);
  await still("42b-the-choice-mark-box-or-put-back");
  let w = await st();
  await tapView(w.view.mark);
  await sleep(600);
  await still("42b-mark-box-the-box-outlined");
  w = await st();
  await tap(w.view.box.x, w.view.box.y, 700);
  await sleep(300);
  (await stepIs("post", 8000)) || (await fail("no post step"));
  await sleep(600);
  await still("42b-the-mailbox-outlined");
  await still("42b-the-robots-asleep");
  await crossBay([{ x: 300, y: 585 }, { x: 640, y: 585 }, { x: 690, y: 470 }]);
  (await walkTo(862, 500, (s) => s.act === "POST · mailbox", 8000)) || (await fail("no POST · mailbox"));
  await press();
  await readStills((s) => s.ctrl && !s.cur, { "MAIL SCANNED.": "mail-scanned", "PAWATURE ACCEPTED.": "pawature-accepted", "Shhh!": "42c-shhh", "NIGHT SHIFT.": "42c-night-shift-the-robots-wake" }, 15000);
  await sleep(300);
  await still("42c-awake-hide-the-crate-by-the-floor-vent");
  await crossBay([{ x: 700, y: 463 }, { x: 650, y: 585 }]);
  await waitStart("up");
  (await walkTo(300, 566, (s) => s.act === "HIDE · crate", 9000)) || (await fail("no HIDE · crate"));
  await press();
  await sleep(900);
  await still("42c-in-the-crate-the-floor-vent-pulls-the-pink-sheet");
  (await readStills((s) => s.step === "back" && s.ctrl && !s.cur, { "No! The pink one!": "42c-no-the-pink-one", "...The yellow one got mailed.": "the-yellow-one-got-mailed", "It's done.": "42c-its-done" }, 40000)) || (await fail("no back step"));
  await sleep(800);
  await waitStart("up");
  (await walkTo(70, 330, (s) => s.room === "passage", 10000)) || (await fail("not out of the bay"));
  (await walkTo(40, 330, (s) => s.room === "hall", 10000)) || (await fail("not back in the hall"));
  (await walkTo(477, 600, (s) => s.room === "closet", 12000)) || (await fail("not home"));
  (await stepIs("tobed", 6000)) || (await fail("no tobed step"));
  await sleep(800);
  (await walkTo(330, 458, (s) => s.act === "SLEEP · bed", 8000)) || (await fail("no SLEEP · bed"));
  await press();
  (await until((s) => s.active, 20000, async (s) => s.cur === "card" && (await sleep(800), await press()))) || (await fail("the escape (43) did not follow night one"));
  await sleep(1200);
  await join_("42c-to-43-six-days-later");
}

if (FROM <= 3) {
  // ---------- 43 to 52: the escape, and beat 53 (as tools/escape-showing.mjs escape) ----------
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
    if (s.ch1Step === "pack1" || s.pkOn) break;
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
        const R = await page.evaluate(() => window.SSQ.beat("ch1-escape").place.SITE);
        const pg = es.sitePage || 0;
        const b = pg === 2 && !done.sasquatch ? ((done.sasquatch = true), R.inside[2]) : [R.schedule, R.sizes[2], R.inside[1], R.to[0]][pg];
        await sleep(1200);
        await still("51-site-page-" + (pg + 1));
        await at((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2);
        await sleep(700);
      } else if (es.step === "drawplan") {
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

// =====================================================================================================================
// pickup day, beat 53 to the tally card (tools/pickup-showing.mjs pickup)
// =====================================================================================================================
{
  let lastStep = "",
    tapAt = 0;
  const stopPickup = burst("pickup", 2500);
  const spots = () => page.evaluate(() => window.__ss.spotsNow().map((q) => ({ id: q.id, verb: q.verb || "", cap: q.cap || "", who: q.who, x: q.x, y: q.y, extra: !!q.extra })));
  const end = Date.now() + 20 * 60000;
  let lastLog = 0;
  for (;;) {
    if (Date.now() > end) await fail("ran out of time in pickup day");
    const s = await st();
    if ((!s.pkOn && lastStep && !s.cur) || (s.cur === "panel" && s.id === "tally")) break;
    const step = s.pk && s.pk.step;
    if (step && step !== lastStep) ((lastStep = step), log(step), await sleep(300), await still("pickup-" + step));
    if (["bub", "card", "cutaway"].includes(s.cur)) {
      await nextT(s, Math.min(3200, 1300 + s.text.length * 25));
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
    const es = s.pk || {};
    if (es.step === "sneak") {
      const go = async (x, y) => Date.now() - tapAt > 700 && ((tapAt = Date.now()), await page.evaluate(([x, y]) => (window.__ss.drawFrame(), window.__ss.tapAt(x, y, false)), [x, y]));
      if (s.act.startsWith("HIDE")) (await sleep(500), await press());
      else await go(878, 508);
      await sleep(150);
      continue;
    }
    const list = (await spots()).filter((q) => !q.extra);
    const sp = list[0];
    if (!sp) {
      await sleep(150);
      continue;
    }
    if (Date.now() - lastLog > 8000) ((lastLog = Date.now()), log("at " + JSON.stringify({ step: es.step, room: s.room, x: Math.round(s.x), y: Math.round(s.y), sp: sp.id, act: s.act })));
    const here = sp.who === "mo" ? s.mo : { x: s.x, y: s.y };
    const close = Math.hypot(here.x - sp.x, here.y - sp.y) < 12;
    if (sp.verb && s.act === sp.verb + " · " + sp.cap) {
      await sleep(600);
      await press();
      await sleep(500);
      continue;
    }
    if (!close && Date.now() - tapAt > 700) ((tapAt = Date.now()), await floor(sp.x, sp.y));
    await sleep(120);
  }
  await stopPickup();
  await sleep(2500);
  await still("tally");
  log("pickup day shown: the Chapter 1 tally card");
}
await sleep(1500);
await finishRecording();
errors.length && console.log("page errors:", errors.slice(0, 5));
await g.finish("chapter-showing");
process.exit(0);
