/**
 * Showing videos of the escape (Chapter 1, beats 43 to 52; src/modules/escape.js) for Brian: the game played by touch
 * only (a finger on the picture and on the big button), at real speed, on a phone-size page (375 x 812, video 750 x
 * 1624), with the game's own sound. Recorded the same way as tools/party-showing.mjs (the browser's screencast, the
 * sound from the game's master volume, joined by ffmpeg). Not a test: it reads the game only to know when to act.
 *   npm run build && node tools/escape-showing.mjs <escape|seen> <out.mp4>
 *     escape  from night one's end (the localhost link ?beat=escape): "Six days later", the robots tease Mops, home,
 *             the bay at night, ROLL · ball by the vent, inside the vent, the pink slip, the keypad (one wrong key
 *             first), the office computer, all the snacks and the Guardians' plate, the Guardian Box, bed, to beat 53.
 *     seen    the night robot's capture rule at the vent: he stands in the robot's way; "!", it pulls the FUR alarm, a
 *             guard comes; ROLL · ball, "They lost you."; then standing still in its way: the LOCKUP card, and the
 *             ball step starts again.
 *   SHOWING_STILLS=<dir> also writes a still of each step there. SHOWING_SILENT=1 leaves the sound out.
 */
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { startGame, sleep, root } from "../tests/game-page.mjs";

const [which, outFile] = process.argv.slice(2);
const WHICH = ["escape", "seen"];
if (!WHICH.includes(which) || !outFile) {
  console.error("Usage: node tools/escape-showing.mjs <" + WHICH.join("|") + "> <out.mp4>");
  process.exit(2);
}
const SILENT = !!process.env.SHOWING_SILENT;
const STILLS = process.env.SHOWING_STILLS || "";
STILLS && mkdirSync(STILLS, { recursive: true });
const WORK = join(root, "tests", "out", "escape-showing-work", which);
rmSync(WORK, { recursive: true, force: true });
mkdirSync(join(WORK, "fr"), { recursive: true });
mkdirSync(dirname(outFile), { recursive: true });
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
const g = await startGame({ port: 9400 + WHICH.indexOf(which), name: "escape-showing-" + which });
const { page, errors } = await g.open(which === "escape" ? "?beat=escape" : "?beat=escape:ball", PHONE);
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
      es = window.SSQ.beat("ch1-escape"),
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
const still = async (name) => STILLS && (await page.screenshot({ path: join(STILLS, (which === "escape" ? "" : "seen-") + String(++k).padStart(2, "0") + "-" + name + ".png") }));
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
if (which === "escape") {
  // 43 to 46
  await readUntil((s) => s.es && s.es.step === "home" && s.cur === "bub", ["card-six-days", "tease-robot", "tease-mops"]);
  await readUntil((s) => s.es && s.es.think, ["home-mops"]);
  await sleep(600);
  await still("think-crate");
  await until((s) => s.es.think && s.es.think.kind === "door", 6000);
  await sleep(600);
  await still("think-door");
  await readUntil((s) => s.es && s.es.think && s.es.think.kind === "vent", ["sq-slip", "sq-vent"]);
  await sleep(1000);
  await still("think-vent");
  log("to the bay at night");
  // 47
  await readUntil((s) => s.es && s.es.step === "ball" && s.ctrl, [], 90000);
  await sleep(800);
  await still("ball-goal");
  const vent = (await page.evaluate(() => window.SSQ.beat("ch1-escape").place.BAY.ventStand));
  await walkTo(vent.x, vent.y, (s) => s.act.startsWith("ROLL"));
  await sleep(500);
  await press();
  log("rolled up by the vent");
  await sleep(700);
  await still("ball-rolled");
  // 48
  await readUntil((s) => s.cur === "cutaway" && s.id === "eswall");
  await sleep(500);
  await read(await st(), "vent-wall");
  await until((s) => s.cur === "cutaway" && s.id === "esletter", 5000);
  await read(await st(), "vent-letter");
  await until((s) => s.cur === "bub", 5000);
  await read(await st(), "vent-notice");
  await until((s) => s.cur === "cutaway" && s.id === "esnote", 5000);
  await sleep(3800);
  await read(await st(), "vent-note");
  // 49
  await readUntil((s) => s.es && s.es.step === "grab" && s.ctrl, ["out-hurry", "out-get-it"]);
  await sleep(600);
  await still("grab");
  const m = (await st()).mo;
  await walkTo(m.x + 30, m.y, (s) => s.act.startsWith("GRAB"));
  await sleep(400);
  await press();
  log("grabbed the pink slip");
  // 50
  await readUntil((s) => s.cur === "cutaway" && s.id === "esslip", [], 60000);
  await read(await st(), "slip-code");
  await until((s) => s.es && s.es.step === "pad" && s.ctrl, 5000);
  await sleep(1200);
  await still("keypad");
  const key = async (d) => {
    const p = await page.evaluate((d) => window.SSQ.beat("ch1-escape").place.keyAt(d), d);
    await at(p.x, p.y);
    await sleep(550);
  };
  await key("9"); // a wrong key first: the buzz, the screen clears
  await still("keypad-wrong");
  await sleep(700);
  for (const d of "16955") await key(d);
  await still("keypad-five");
  await key("6");
  await sleep(300);
  await still("keypad-open");
  log("typed 169556");
  // 51
  await until((s) => s.es && s.es.step === "computer" && s.ctrl, 20000);
  await sleep(700);
  await still("office");
  const O = await page.evaluate(() => window.SSQ.beat("ch1-escape").place.OFFICE.sq);
  await walkTo(O.x, O.y, (s) => s.act.startsWith("RETURN"));
  await sleep(400);
  await press();
  await sleep(900);
  await still("site");
  const R = await page.evaluate(() => window.SSQ.beat("ch1-escape").place.SITE.ret);
  await at((R.x0 + R.x1) / 2, (R.y0 + R.y1) / 2);
  await sleep(1300);
  await still("site-booked");
  // 52
  await readUntil((s) => s.es && s.es.step === "snacks" && s.ctrl, ["bar-mops"], 60000);
  await sleep(900);
  await still("snacks");
  const SN = await page.evaluate(() => window.SSQ.beat("ch1-escape").place.SNACKS);
  for (const i of [0, 1, 2, 3]) {
    await at(SN.at[i].x, SN.at[i].y);
    await sleep(900);
    i === 1 && (await still("snacks-two"));
  }
  await readUntil((s) => s.es && s.es.step === "food" && s.ctrl, ["snacks-guardians"]);
  await sleep(800);
  await still("food-plate");
  for (const i of [4, 5]) (await at(SN.at[i].x, SN.at[i].y), await sleep(900));
  await sleep(400);
  await still("hearts");
  await until((s) => s.es && s.es.step === "closet" && s.ctrl, 60000);
  await sleep(700);
  await still("home-closet");
  const H = await page.evaluate(() => window.SSQ.beat("ch1-escape").place.HOME.closet);
  await walkTo(H.x, H.y, (s) => s.act.startsWith("OPEN"));
  await sleep(400);
  await press();
  await sleep(800);
  await still("box-goal");
  await press();
  await until((s) => s.cur === "cutaway" && s.id === "esbox", 5000);
  await sleep(2200);
  await read(await st(), "box-closeup");
  await until((s) => s.pose === "sleep", 15000);
  await sleep(1200);
  await still("asleep");
  await until((s) => s.ch1Step === "pack1", 15000);
  await sleep(1500);
  await still("beat-53");
  log("beat 53");
} else {
  // the night robot's capture rule at the vent
  await sleep(1000);
  await still("ball-start");
  // in front of the walkway, in the robot's way
  await walkTo(600, 440);
  log("standing in the robot's way");
  await until((s) => s.es.robot && s.es.robot.mark === "?", 30000);
  await still("robot-registers");
  await until((s) => s.es.robot && s.es.robot.phase === "bang", 5000);
  await still("robot-sees");
  await until((s) => s.sec, 10000);
  await sleep(500);
  await still("alarm-guard");
  await until((s) => s.act.startsWith("ROLL"), 3000);
  await press();
  log("rolled up");
  await sleep(600);
  await still("rolled-hidden");
  await until((s) => !s.sec, 20000);
  await sleep(1500);
  await still("lost-you");
  // unroll and stand still in the way until caught
  await at(600, 440);
  await until((s) => s.cur === "card" && s.id === "jail", 60000);
  await sleep(1500);
  await still("lockup");
  await press();
  await until((s) => s.es && s.es.step === "ball" && s.ctrl && !s.cur, 15000);
  await sleep(1200);
  await still("ball-again");
}
await sleep(800);
await finishRecording();
errors.length && console.log("page errors:", errors.slice(0, 5));
await g.finish("escape-showing-" + which);
process.exit(0);
