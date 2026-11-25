/**
 * Showing videos of the party night for Brian (showing 4): the game played by touch only (a finger on the picture,
 * on the big button, on the full-screen views), at real speed, on a phone-size page (375 x 812, video 750 x 1624),
 * with the game's own sound. The picture is the browser's screencast, the sound is recorded inside the page from
 * the game's master volume, and ffmpeg joins them. Not a test: it reads the game only to know when to act.
 *   npm run build && node tools/party-showing.mjs <keep|back|flyer> <out.mp4>
 *     keep   from the start of P6: the dance (one spot missed), the group photo, the octopus, the snacks and the
 *            crash, the alarm, home, under the bed, the card, "Keep going" to the TV coming on.
 *     back   from the start of P6: a snack, the crash, the alarm, home, the card, "Back to the party", the dance,
 *            the group photo, closing time, Mops, home.
 *     flyer  from the start of P3: the welcome, the flyer sneak (P4), home, the dress-up, out to the party.
 *   SHOWING_SILENT=1 leaves the sound out.
 */
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { startGame, sleep, root } from "../tests/game-page.mjs";

const [which, outFile] = process.argv.slice(2);
if (!["keep", "back", "flyer"].includes(which) || !outFile) {
  console.error("Usage: node tools/party-showing.mjs <keep|back|flyer> <out.mp4>");
  process.exit(2);
}
const SILENT = !!process.env.SHOWING_SILENT;
const WORK = join(root, "tests", "out", "party-showing-work", which);
rmSync(WORK, { recursive: true, force: true });
mkdirSync(join(WORK, "fr"), { recursive: true });
mkdirSync(dirname(outFile), { recursive: true });
const hall = await import(join(root, "src", "modules", "party-hall.js"));
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
const g = await startGame({ port: 9360 + ["keep", "back", "flyer"].indexOf(which), name: "party-showing-" + which });
const { page, errors } = await g.open("?beat=" + (which === "flyer" ? "party:P3" : "party:P6"), PHONE);
await sleep(600);
SILENT || (await page.click("#ss-sound").catch(() => {}));
await sleep(600);
const t0 = Date.now();
const log = (m) => console.log(((Date.now() - t0) / 1000).toFixed(1) + "s " + m);

// ---------- recording ----------
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
  // each frame lasts until the next one (the browser sends a frame only when the picture changes)
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
      beat = window.SSQ.beat("ch1-party"),
      p = n.ch1PartyNow,
      d = p && p.dance;
    return {
      act: n.act ? n.act.verb + (n.act.cap ? " · " + n.act.cap : "") : "",
      now: beat.now(),
      cur: c ? c.k : "",
      id: c ? c.id || "" : "",
      text: c && c.b ? c.b.text : "",
      ctrl: !!n.ctrl,
      room: n.room,
      x: n.sq.x,
      y: n.sq.y,
      btn: r ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null,
      cv: [cv.x, cv.y, cv.width, cv.height],
      full: ["dance", "party card", "group photo", "dress-up"].find((l) => document.querySelector(`canvas[aria-label="${l}"]`)) || "",
      glow: d && d.live && d.seen && d.seen.glow ? { x: d.seen.glow.x, y: d.seen.glow.y, n: (d.round || 0) * 100 + d.i } : null,
      danceT: d ? d.t : -1,
      snack: p && p.snack ? { phase: p.snack.phase, t: p.snack.t, reach: !!p.snack.reach, zoom: p.snack.zoom, fall: p.snack.fall } : null,
      slots: p && p.snacks && p.snacks.slots ? p.snacks.slots.slice() : null,
      bag: p && p.snacks ? p.snacks.bag : 0,
      tv: !!n.tvOn,
      dress: beat.dressTargets ? beat.dressTargets() : null,
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
    if (f(s)) return s;
    if (Date.now() > end) return null;
    each && (await each(s));
    await sleep(110);
  }
};
// A line or a card with words: read it, then one tap on the picture.
const read = async (s) => {
  if (["bub", "card", "panel"].includes(s.cur) && !s.full) {
    await sleep(1300);
    await tap(187, 300);
    await sleep(250);
  }
};
// Walks him to a place by tapping it (again if he stops short), until he is there or `ok` says so.
async function goTo(x, y, ok, ms = 9000) {
  const end = Date.now() + ms;
  let last = 0;
  for (;;) {
    const s = await st();
    if ((ok && ok(s)) || Math.hypot(s.x - x, s.y - y) < 16) return s;
    if (Date.now() > end) return s;
    if (["bub", "card", "panel"].includes(s.cur)) await read(s);
    else if (s.ctrl && Date.now() - last > 900) ((last = Date.now()), await floor(x, y));
    await sleep(120);
  }
}
const fail = (m) => {
  log("STOPPED: " + m);
  throw new Error(m);
};

// ---------- the pieces of the party ----------
// The dance: `hits` spots tapped in time, with the `miss`th one let go by (too slow), then out by the close button.
async function dance(hits, miss) {
  let s = await goTo(hall.DANCE_SPOT.x, hall.DANCE_SPOT.y + 4, (q) => q.act === "DANCE · circle");
  s = await until((q) => q.act === "DANCE · circle", 6000, read);
  if (!s) return fail("no DANCE · circle");
  await sleep(500);
  await press();
  await until((q) => q.full === "dance", 4000);
  log("dancing");
  let done = 0,
    seen = 0,
    lastKey = "";
  const end = Date.now() + 60000;
  while (done < hits && Date.now() < end) {
    s = await st();
    if (s.full !== "dance") break;
    if (s.glow) {
      const key = Math.round(s.glow.x) + "," + Math.round(s.glow.y) + "," + s.glow.n;
      if (key !== lastKey) {
        lastKey = key;
        seen++;
        if (seen === miss) {
          // let this one go by
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
  (await st()).full === "dance" && (await tap(375 - 36, 36));
  await until((q) => q.full !== "dance" && q.ctrl, 5000);
  log(`danced: ${done} spots hit${miss ? ", one missed" : ""}`);
}
// The group photo: JOIN · photo when it is offered, the 3-2-1, the Polaroid, a tap to close it.
async function photo(ms) {
  let s = await until((q) => q.act === "JOIN · photo", ms, read);
  if (!s) return fail("the photo moment did not come");
  await sleep(900);
  await press();
  log("JOIN · photo");
  s = await until((q) => q.full === "group photo" || (q.now.shot && q.now.shot.phase === "polaroid"), 30000);
  if (!s) return fail("no Polaroid");
  await sleep(2800);
  await tap(190, 640);
  await until((q) => q.full !== "group photo" && q.ctrl, 20000, read);
  log("the Polaroid");
}
// The snack bar: `safe` snacks from the top with her back turned, then (with `crash`) the middle cup of the bottom row.
async function snacks(safe, crash) {
  const L = await page.evaluate(() => window.SSQ.beat("ch1-party").snackLayout());
  let s = await goTo(L.spot.x - 10, L.spot.y + 10, (q) => q.act === "GRAB · snacks");
  s = await until((q) => q.act === "GRAB · snacks", 8000, read);
  if (!s) return fail("no GRAB · snacks");
  await sleep(600);
  await press();
  await until((q) => q.snack && q.snack.zoom >= 1, 6000);
  log("the snack close-up");
  const take = async (i) => {
    // a finger on the snack while her back is turned, with time to spare
    const ok = await until((q) => !q.snack || (q.cur !== "bub" && q.snack.phase === "back" && q.snack.t > 0.5 && q.snack.t < 2.4 && !q.snack.reach), 20000, read);
    if (!ok || !ok.snack) return false;
    await floor(L.cut.snacks[i][1], L.cut.snacks[i][2]);
    return true;
  };
  for (let k = 0; k < safe; k++) {
    s = await st();
    const top = s.slots.findIndex((id) => id >= 0);
    if (!(await take(top))) return fail("the close-up closed early");
    await until((q) => q.bag >= k + 1, 4000);
    await sleep(700);
    await until((q) => q.cur !== "bub", 6000, read);
  }
  log(`${safe} snacks in the bag`);
  if (crash) {
    await sleep(600);
    (await take(7)) || fail("the close-up closed before the pull");
    await until((q) => !q.snack, 5000);
    log("the pyramid falls");
  } else {
    await sleep(700);
    await floor(L.cut.close.x, L.cut.close.y);
    await until((q) => !q.snack && q.ctrl, 4000);
  }
}
// The alarm: he runs home through his door and hides under the bed; the card comes.
async function runHomeToCard() {
  let s = await until((q) => q.now && q.now.scene === "P7", 20000, read);
  if (!s) return fail("no alarm");
  log("the alarm");
  s = await until((q) => q.room === "closet" || q.now.card, 40000, async (q) => {
    if (["bub", "card", "panel"].includes(q.cur)) return read(q);
    q.ctrl && q.room === "hall" && (await floor(hall.HALL_DOOR.x, hall.HALL_DOOR.y + 12), await sleep(500));
  });
  s = await until((q) => q.act === "HIDE · bed" || q.now.card, 15000);
  await sleep(400);
  s && !s.now.card && (await press());
  s = await until((q) => q.full === "party card", 30000);
  if (!s) return fail("no card");
  log("the card");
  await sleep(3200);
}
const chooseOnCard = async (id) => {
  const T = await page.evaluate(() => window.SSQ.beat("ch1-party").cardTargets());
  await tap(T[id].x, T[id].y);
  await until((q) => q.full !== "party card", 4000);
  log("card: " + id);
};
// Beat 20's first panel: the party night is over.
const toTv = async (ms) => {
  const s = await until((q) => !q.now || q.now.scene === "done" || (q.cur === "panel" && q.id === "ch1tv1"), ms, async (q) => (q.cur === "bub" || q.cur === "card") && (await read(q)));
  s || fail("beat 20 did not start");
  await sleep(2500);
};

// ---------- the three showings ----------
await startRecording();
await sleep(1800);
if (which === "keep") {
  await dance(6, 4);
  // toward the wall by the alarm box, where the row will stand; the first song ends and the photo moment begins
  await goTo(300, 545);
  await photo(70000);
  // the octopus (after the first minute): near his end of the bar he notices; one hug, then keep away until he is bored
  await goTo(640, 560, (q) => q.now.oct && q.now.oct.mode === "chase");
  let s = await until((q) => q.now.oct && q.now.oct.mode === "chase", 15000, read);
  s || fail("the octopus did not notice");
  log("the octopus");
  await until((q) => q.cur !== "bub" && q.ctrl, 20000, read);
  await until((q) => q.now.oct.hugs >= 1 || q.now.oct.mode !== "chase", 12000, read);
  await until((q) => q.ctrl && q.now.oct.mode === "chase", 6000, read);
  const lap = [
    [230, 575],
    [200, 400],
    [560, 420],
    [300, 560],
    [650, 430],
    [220, 480],
  ];
  for (let i = 0; i < 12; i++) {
    s = await st();
    if (!s.now.oct || !["chase", "hug"].includes(s.now.oct.mode)) break;
    await goTo(lap[i % lap.length][0], lap[i % lap.length][1], (q) => !q.now.oct || !["chase", "hug"].includes(q.now.oct.mode), 4500);
  }
  await until((q) => q.now.oct && !["chase", "hug"].includes(q.now.oct.mode), 25000, read);
  log("the octopus is bored");
  await snacks(3, true);
  await runHomeToCard();
  await chooseOnCard("keep");
  await toTv(120000);
}
if (which === "back") {
  await snacks(1, true);
  await runHomeToCard();
  await chooseOnCard("back");
  let s = await until((q) => q.now && q.now.scene === "P6" && q.ctrl && q.room === "hall", 60000, read);
  s || fail("he did not get back to the party");
  log("back at the party");
  await sleep(1200);
  await dance(4, 0);
  await goTo(300, 545);
  await photo(80000);
  // closing time, then Mops: he walks over to him
  s = await until((q) => q.now && q.now.scene === "P8b" && q.now.mops && q.ctrl, 150000, read);
  s || fail("closing time did not come");
  log("closing time, Mops is in");
  await until(
    (q) => !q.now || q.now.scene === "done" || (q.cur === "panel" && q.id === "ch1tv1"),
    90000,
    async (q) => {
      if (q.cur === "bub" || q.cur === "card") return read(q);
      q.ctrl && q.now && q.now.mops && (await floor(q.now.mops.x - 46, q.now.mops.y + 10), await sleep(500));
    },
  );
  await sleep(2500);
}
if (which === "flyer") {
  let s = await until((q) => q.now && q.now.scene === "P4" && q.ctrl, 90000, read);
  s || fail("P4 did not start");
  log("P4: the flyer sneak");
  await sleep(2600);
  for (const [x, y] of [[470, 585], [520, 575], [520, 400]]) await goTo(x, y);
  await goTo(hall.FLYER.reach.x, hall.FLYER.reach.y + 8, (q) => q.act === "GRAB · flyer");
  s = await until((q) => q.act === "GRAB · flyer", 4000);
  s || fail("no GRAB · flyer");
  await sleep(900);
  await press();
  await until((q) => q.now.flyer === "paw" && q.ctrl, 4000);
  log("GRAB · flyer");
  await sleep(700);
  for (const [x, y] of [[520, 400], [520, 575]]) await goTo(x, y);
  s = await until((q) => q.now && q.now.scene === "P5" && q.ctrl, 40000, async (q) => {
    if (q.cur === "bub") return read(q);
    q.ctrl && q.room === "hall" && (await floor(hall.HALL_DOOR.x, hall.HALL_DOOR.y + 12), await sleep(600));
  });
  s || fail("P5 did not start");
  log("P5: the dress-up");
  await sleep(1000);
  await goTo(150, 400, (q) => q.act === "OPEN · closet");
  await until((q) => q.act === "OPEN · closet" && q.ctrl, 8000);
  await sleep(900);
  await press();
  await until((q) => q.full === "dress-up", 4000);
  await sleep(1200);
  const dragTo = async (from, to) => {
    await page.touchscreen.touchStart(from.x, from.y);
    for (let k = 1; k <= 12; k++) (await page.touchscreen.touchMove(from.x + ((to.x - from.x) * k) / 12, from.y + ((to.y - from.y) * k) / 12), await sleep(45));
    await page.touchscreen.touchEnd();
    await sleep(900);
  };
  for (const [id, spot] of [["tophat", "head"], ["shades", "face"], ["shirt", "body"], ["boots", "legs"]]) {
    const d = (await st()).dress;
    const p = d && d.pieces.find((q) => q.id === id);
    p && (await dragTo(p, d.spots[spot]));
  }
  await sleep(1500);
  const d = (await st()).dress;
  d && d.go && (await tap(d.go.x, d.go.y));
  await sleep(1500);
  await goTo(860, 470, (q) => q.now && q.now.scene === "P6");
  s = await until((q) => q.now && q.now.scene === "P6" && q.ctrl, 15000);
  log(s ? "P6: out at the party in disguise" : "P6 did not start");
  await sleep(2500);
}
await finishRecording();
console.log("page errors", errors.slice(0, 5));
await g.finish("party-showing-" + which);
