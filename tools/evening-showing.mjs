/**
 * Showing videos of the evening of Day 2 and night one (beats 37 to 42, src/modules/evening.js) for Brian: the game
 * played by touch only (a finger on the picture, on the big button, on the full-screen close-ups), at real speed, on
 * a phone-size page (375 x 812, video 750 x 1624), with the game's own sound. Recording works as in
 * tools/party-showing.mjs (the browser's screencast, the sound recorded inside the page, joined by ffmpeg). Not a test:
 * it reads the game only to know when to act.
 *   npm run build && node tools/evening-showing.mjs <wall|bar|alone|fight|night|seen> <out.mp4>
 *     wall   beat 37: the hallway, LOOK · photos, the photos (holding LIFT · photo on the crooked #4: the crayon
 *            drawing, ME and MOPS), past 5 the robot comes in from the hall's end, ROLL · ball, BEEP BEEP, the doorway
 *     bar    beats 38a to 39: Jupiter's big red storm, the PA, HIDE · counter, PEEK · window, the family's Mars talk,
 *            DUCK · down, the pancake talk at the bar, the close-up at "Sasquatches", the coffee and the toss, GRAB ·
 *            brochure, its five taps, "Are those other Sasquatches?", Mops back to work
 *     alone  beat 39b: home alone, OPEN · box, BITE · cake, "No fizz.", X · chart, HOLD UP · brochure, "MARS!"
 *     fight  beats 40 and 41: "That evening…", SHOW · brochure, the fight, STOMP · to bed, the turned back, lights out
 *            with no song, Mops's fainting-goat sleep, the idea in pictures, "The form!"
 *     night  beats 42a to 42c: out past Mops (a bump on his bucket), the night rooms, GRAB · copies, the choice (PUT
 *            BACK · bin first: the happily-ish ending and GO BACK), MARK · box, the robots asleep, POST · mailbox (loud:
 *            they wake, NIGHT SHIFT.), HIDE · crate by the floor vent, the floor vent takes the pink sheet, home, SLEEP ·
 *            bed, "Six days later" (round 7, q: 125)
 *     seen   the capture rule in the bay after the post: seen by the night robot, the alarm, guards, "They lost you.";
 *            seen again and standing still: the LOCKUP card and the step again from the crate
 *   SHOWING_STILLS=<dir> writes a still of each step there too. SHOWING_SILENT=1 leaves the sound out.
 */
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { startGame, sleep, root } from "../tests/game-page.mjs";

const [which, outFile] = process.argv.slice(2);
const WHICH = ["wall", "bar", "alone", "fight", "night", "seen"];
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
const START = { wall: 37, bar: 37, alone: 139, fight: 141, night: 42, seen: 143 }[which]; // (seen: 143, the post step; round 7, q: 125, the robots wake at the post)
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
// reads every line up to `stop`, with a still of each one named by `names` (by the line's words), if given
async function readStills(stop, names = {}, ms = 60000) {
  const end = Date.now() + ms,
    done = new Set();
  for (;;) {
    const s = await st();
    if (await stop(s)) return s;
    if (Date.now() > end) return null;
    if ((s.cur === "bub" || s.cur === "card") && names[s.text] && !done.has(s.text)) (done.add(s.text), await sleep(700), await still(names[s.text]));
    if (s.cur === "bub" || s.cur === "card") await read();
    else await sleep(120);
  }
}
if (which === "wall") {
  await stepIs("wall", 4000);
  await sleep(1200);
  await still("the-hallway-the-doorway-outlined");
  (await walkTo(480, 300, (s) => s.act === "LOOK · photos")) || (await fail("no LOOK · photos"));
  await still("look-photos");
  await press();
  for (let i = 0; i < 6; i++) {
    const s = await until((q) => (q.view && q.view.ready) || q.step === "dodge", 4000);
    if (!s || !s.view) break;
    await sleep(500);
    await still("photo-" + (s.view.i + 1) + (s.view.i === 3 ? "-crooked-lift-photo" : ""));
    if (s.view.i === 3 && !s.view.lifted) {
      // he holds LIFT · photo: the frame swings up on its nail, the crayon drawing under it, his thought
      await page.touchscreen.touchStart(s.view.lift.x, s.view.lift.y);
      await sleep(1300);
      await still("held-the-frame-swings-up-the-crayon-drawing");
      await sleep(900);
      await page.touchscreen.touchEnd();
      await sleep(1300);
      await still("let-go-it-swings-back");
    }
    await tapView(s.view.next);
  }
  await until((s) => s.step === "dodge" && s.ctrl, 4000);
  await sleep(300);
  await still("the-robot-comes-in-from-the-hall-roll-ball");
  (await until((s) => s.act === "ROLL · ball", 3000)) || (await fail("no ROLL · ball"));
  await sleep(400);
  await press();
  await sleep(1400);
  await still("rolled-up-the-robot-rolls-past");
  await readStills((s) => s.step === "past" && s.ctrl, { "BEEP BEEP": "beep-beep" }, 15000);
  await sleep(600);
  await still("the-robot-gone");
  (await walkTo(60, 330, (s) => s.step !== "past", 12000)) || (await fail("not through the doorway"));
  await until((s) => s.room === "hall", 6000);
  await sleep(1500);
  await still("the-hall");
}
if (which === "bar") {
  await sleep(400);
  (await walkTo(60, 330, (s) => s.step !== "wall", 12000)) || (await fail("not through the doorway"));
  await until((s) => s.step === "storm", 8000);
  await sleep(3500);
  await still("jupiters-big-red-storm-rolls-in");
  await readStills((s) => s.step === "hide" && s.ctrl, { "The Great Red Storm is passing!": "pa-the-storm", "Guests! Quick, hide.": "mops-guests-quick-hide" }, 30000);
  await sleep(700);
  await still("guests-coming-the-counter-outlined");
  (await walkTo(862, 330, (s) => s.act === "HIDE · counter", 6000)) || (await fail("no HIDE · counter"));
  await press();
  (await stepIs("peek", 6000)) || (await fail("not behind the counter"));
  await sleep(1500);
  await still("behind-the-counter-rolled-up-peek-window");
  await press();
  await sleep(600);
  await readStills((s) => s.step === "duck" && s.ctrl && !s.cur, { "Whoa. It's SO red.": "peeking-the-family-at-the-window", "Red like Mars.": "red-like-mars", "The PANCAKES!": "the-pancakes", "Now I'm hungry.": "now-im-hungry" }, 60000);
  await sleep(700);
  await still("they-turn-duck-down");
  await press();
  await sleep(600);
  await still("ducked");
  for (;;) {
    const s = await st();
    if (s.step === "brochure" && s.ctrl && !s.cur) break;
    if (s.view && s.view.kind === "shock" && s.view.ready) {
      await sleep(900);
      await still("the-close-up-mops-and-squatch-at-sasquatches");
      await tapView(s.view.close);
      continue;
    }
    if (s.cur === "bub") {
      const names = { "Got any pancakes?": "got-any-pancakes", "But I talked to them, and they said they were Sasquatches.": "they-said-they-were-sasquatches", "Here's a brochure I got on it.": "dad-holds-up-the-brochure", "Ugh. Coffee.": "coffee", "Bedtime.": "the-brochure-in-the-bin-bedtime" };
      names[s.text] && (await sleep(700), await still(names[s.text]));
      await read();
      continue;
    }
    await sleep(150);
  }
  await sleep(800);
  await still("the-bin-outlined-grab-brochure");
  await press();
  const v = await until((s) => s.view && s.view.kind === "brochure" && s.view.ready, 5000);
  v || (await fail("no brochure close-up"));
  await sleep(1400);
  await still("the-brochure-close-up");
  for (const part of ["window", "pancakes", "cake", "paw"]) {
    await tapView(v.view.parts[part]);
    await sleep(900);
    await still("tapped-" + part);
  }
  await tapView(v.view.parts.cooks);
  await readStills((s) => s.step === "gohome" && s.ctrl && !s.cur, { "They look just like the Guardians.": "they-look-just-like-the-guardians", "Are those other Sasquatches?": "are-those-other-sasquatches", "We'll talk tonight.": "we-will-talk-tonight" }, 40000);
  await sleep(900);
  await still("the-home-doorway-outlined");
}
if (which === "alone") {
  await stepIs("gohome", 5000);
  await sleep(800);
  (await walkTo(477, 600, (s) => s.room === "closet", 12000)) || (await fail("not home"));
  await stepIs("box", 8000);
  await sleep(800);
  await still("home-alone-open-box");
  await press();
  await stepIs("bite", 4000);
  await sleep(700);
  await still("this-weeks-kind-bite");
  await press();
  await sleep(1100);
  await still("crunch-silence");
  await readStills((s) => s.step === "chart" && s.ctrl && !s.cur, { "No fizz.": "no-fizz" }, 10000);
  await sleep(700);
  await still("the-chart-outlined");
  (await walkTo(236, 440, (s) => s.act === "X · chart", 6000)) || (await fail("no X · chart"));
  await press();
  const c = await until((s) => s.view && s.view.kind === "chart" && s.view.ready, 4000);
  await sleep(900);
  await still("the-chart-close-up");
  await tapView(c.view.cake);
  await sleep(500);
  await tapView(c.view.cake);
  await sleep(600);
  await still("this-weeks-x");
  await stepIs("crate", 6000);
  await sleep(700);
  await still("the-crate-outlined-hold-up-brochure");
  (await walkTo(330, 458, (s) => s.act === "HOLD UP · brochure", 6000)) || (await fail("no HOLD UP · brochure"));
  await press();
  const k2 = await until((s) => s.view && s.view.kind === "crate" && s.view.ready, 4000);
  await sleep(1000);
  await still("the-crate-close-up");
  for (let i = 0; i < 3; i++) (await tapView(k2.view.card, 80), await sleep(300), await still("slid-" + (i + 1)));
  await sleep(2000);
  await still("st-rubbed-out");
  await readStills((s) => s.step === "evening", { "Not STARS...": "not-stars", "MARS!": "mars" }, 12000);
}
if (which === "fight") {
  await stepIs("crate", 5000);
  (await walkTo(330, 458, (s) => s.act === "HOLD UP · brochure", 6000)) || (await fail("no HOLD UP · brochure"));
  await press();
  const k2 = await until((s) => s.view && s.view.kind === "crate" && s.view.ready, 4000);
  for (let i = 0; i < 3; i++) await tapView(k2.view.card, 80);
  await readStills((s) => s.step === "show" && s.ctrl && !s.cur, { "That evening…": "that-evening" }, 30000);
  await sleep(800);
  await still("mops-home-his-hearts-show-brochure");
  await press();
  await sleep(900);
  await still("he-holds-it-up");
  await readStills((s) => s.step === "choose" && s.ctrl && !s.cur, { "Mops! My crate says MARS!": "my-crate-says-mars", "You're one of a kind. Like me.": "one-of-a-kind", "Safe? I have to HIDE here.": "i-have-to-hide-here", "The Guardians are here.": "the-guardians-are-here" }, 90000);
  await sleep(900);
  await still("ask-again-or-stomp-to-bed");
  (await walkTo(330, 458, (s) => s.act === "STOMP · to bed", 6000)) || (await fail("no STOMP · to bed"));
  await press();
  for (;;) {
    const s = await st();
    if (s.step === "bed" && s.ctrl && !s.cur) break;
    if (s.view && s.view.kind === "back" && s.view.ready) {
      await sleep(900);
      await still("his-turned-back");
      await tapView(s.view.close);
      continue;
    }
    if (s.cur === "bub") {
      const names = { "Squatch. Wait.": "squatch-wait", "Squatch... I already...": "i-already", "Maybe my REAL family wouldn't make me hide!": "my-real-family", "We say things we don't mean all the time.": "one-small-heart" };
      names[s.text] && (await sleep(700), await still(names[s.text]));
      await read();
      continue;
    }
    await sleep(150);
  }
  await sleep(700);
  await still("to-bed");
  await press();
  for (const [ms, name] of [[2600, "in-bed"], [2600, "lights-down-no-song"], [2600, "mops-dozes"], [2200, "fainting-goat"], [2400, "on-his-back-snoring"]]) (await sleep(ms), await still(name));
  await until((s) => s.step === "idea", 20000);
  for (const [ms, name] of [[1100, "idea-mops-mopping"], [1400, "idea-robots-mopping"], [1400, "idea-the-ship"]]) (await sleep(ms), await still(name));
  await readStills((s) => s.step === "out" && s.ctrl && !s.cur, { "The floors don't mop themselves...": "the-floors-dont-mop-themselves", "The form!": "the-form" }, 30000);
  await sleep(800);
  await still("night-one-the-doorway-outlined");
}
const waitStart = async (phase) => (await until((s) => s.look.phase !== phase, 9000), await until((s) => s.look.phase === phase, 9000));
const waitLook = async (phase) => waitStart(phase);
async function crossBay(points) {
  for (const p of points) (await walkTo(p.x, p.y, null, 8000)) || (await fail("stuck crossing the bay at " + p.x + "," + p.y));
}
if (which === "night") {
  await sleep(1200);
  await still("night-out-of-bed");
  // a bump on Mops's bucket: a clang, "Weee...?", and back beside his bed
  (await walkTo(566, 498, (s) => s.step === "out" && !s.ctrl, 6000)) || (await fail("no bump"));
  await readStills((s) => s.step === "out" && s.ctrl && !s.cur, { "Weee...?": "bumped-the-bucket-weee" }, 8000);
  await sleep(600);
  (await walkTo(880, 440, (s) => s.room === "hall", 10000)) || (await fail("not out of home"));
  await sleep(1400);
  await still("the-hall-at-night-its-vent-on");
  (await walkTo(905, 320, (s) => s.room === "passage", 10000)) || (await fail("not into the hallway"));
  await sleep(1200);
  await still("the-hallway-at-night");
  (await walkTo(905, 330, (s) => s.room === "hangar", 12000)) || (await fail("not into the bay"));
  await stepIs("bin", 6000);
  await sleep(1200);
  await still("the-loading-bay-at-night-the-bin");
  (await walkTo(212, 398, (s) => s.act === "GRAB · copies", 8000)) || (await fail("no GRAB · copies"));
  await press();
  await readStills((s) => s.view && s.view.kind === "order" && s.view.ready, { "If they replace Mops...": "if-they-replace-mops", "Or put it back. And stay.": "or-put-it-back" }, 20000);
  await sleep(1200);
  await still("the-choice-mark-box-or-put-back");
  // first PUT BACK · bin: the short ending, the cards, GO BACK · to the form
  let v = await st();
  await tapView(v.view.putBack);
  await sleep(1200);
  await still("put-back-the-cutaway");
  await sleep(2600);
  await still("years-later");
  for (let i = 0; i < 4; i++) {
    v = await st();
    await tap(v.view.tap.x, v.view.tap.y);
    await sleep(1300);
    await still("card-" + (i + 1));
  }
  v = await st();
  await tapView(v.view.goBack);
  await sleep(1200);
  await still("go-back-the-choice-again");
  v = await st();
  await tapView(v.view.mark);
  await sleep(600);
  await still("mark-box-the-box-outlined");
  v = await st();
  await tap(v.view.box.x, v.view.box.y, 700);
  await sleep(300);
  await still("the-paw-print-through-to-the-yellow");
  await stepIs("post", 6000);
  await sleep(600);
  await still("the-mailbox-outlined");
  // (round 7, q: 125: the robots sleep, z z z, no cones, until the loud post wakes them)
  await still("the-robots-asleep");
  await crossBay([{ x: 300, y: 585 }, { x: 640, y: 585 }, { x: 690, y: 470 }]);
  (await walkTo(862, 500, (s) => s.act === "POST · mailbox", 8000)) || (await fail("no POST · mailbox"));
  await press();
  await readStills((s) => s.ctrl && !s.cur, { "MAIL SCANNED.": "mail-scanned", "PAWATURE ACCEPTED.": "pawature-accepted", "Shhh!": "shhh", "NIGHT SHIFT.": "night-shift-the-robots-wake" }, 15000);
  await sleep(300);
  await still("awake-hide-the-crate-by-the-floor-vent");
  // out of the mail room, down, and along the front while the robot looks at the back wall, to the crate by the floor vent
  await crossBay([{ x: 700, y: 463 }, { x: 650, y: 585 }]);
  await waitLook("up");
  (await walkTo(300, 566, (s) => s.act === "HIDE · crate", 9000)) || (await fail("no HIDE · crate"));
  await press();
  await sleep(900);
  await still("in-the-crate-the-floor-vent-pulls-the-pink-sheet");
  await readStills((s) => s.step === "back" && s.ctrl && !s.cur, { "No! The pink one!": "no-the-pink-one", "...The yellow one got mailed.": "the-yellow-one-got-mailed", "It's done.": "its-done" }, 40000);
  await sleep(800);
  await still("sneak-home");
  await waitLook("up");
  (await walkTo(70, 330, (s) => s.room === "passage", 10000)) || (await fail("not out of the bay"));
  (await walkTo(40, 330, (s) => s.room === "hall", 10000)) || (await fail("not back in the hall"));
  (await walkTo(477, 600, (s) => s.room === "closet", 12000)) || (await fail("not home"));
  await stepIs("tobed", 6000);
  await sleep(800);
  await still("home-mops-still-snoring");
  (await walkTo(330, 458, (s) => s.act === "SLEEP · bed", 8000)) || (await fail("no SLEEP · bed"));
  await press();
  await sleep(3000);
  await still("back-in-bed");
  await until((s) => s.cur === "card", 12000);
  await sleep(800);
  await still("six-days-later");
}
if (which === "seen") {
  await sleep(1200);
  await still("the-bay-at-night-the-robots-asleep");
  // (round 7, q: 125: asleep until the loud post; awake after it, he walks into the robot's look along the front)
  await crossBay([{ x: 300, y: 585 }, { x: 640, y: 585 }, { x: 690, y: 470 }]);
  (await walkTo(862, 500, (s) => s.act === "POST · mailbox", 8000)) || (await fail("no POST · mailbox"));
  await press();
  await readStills((s) => s.ctrl && !s.cur, {}, 15000);
  await crossBay([{ x: 700, y: 463 }, { x: 650, y: 585 }]);
  await waitStart("down");
  await walkTo(450, 585, (s) => !!s.alarm, 5000);
  await sleep(250);
  await still("seen-the-robot-shows-!");
  // hiding: a ball never fools a search, so a real hiding place: the crate by the floor vent (outlined)
  (await walkTo(300, 566, (s) => s.act === "HIDE · crate", 6000)) || (await fail("no HIDE · crate"));
  await press();
  await sleep(1000);
  await still("hidden-in-the-crate");
  await until((s) => s.alarm === "search", 10000);
  await sleep(1200);
  await still("guards-search-the-bay");
  const lost0 = (await st()).lost;
  await until((s) => !s.alarm, 25000);
  await sleep(200);
  await still("they-lost-you");
  log("lost: " + ((await st()).lost - lost0));
  await sleep(1500);
  // seen again, and he stands still in the robot's look
  await walkTo(360, 585, null, 6000);
  await waitStart("down");
  await walkTo(450, 585, (s) => !!s.alarm, 4000);
  // (caught on the way home: the step restarts where it began, in the crate by the floor vent)
  await sleep(300);
  await still("seen-again-and-standing-still");
  await until((s) => s.id === "jail", 25000);
  await sleep(900);
  await still("caught-the-lockup-card");
  await sleep(2200);
  await press();
  await until((s) => s.ctrl && !s.cur, 8000);
  await sleep(800);
  await still("restarts-the-step-in-the-crate");
}
await finishRecording();
console.log("page errors", errors.slice(0, 5));
await g.finish("evening-showing-" + which);
