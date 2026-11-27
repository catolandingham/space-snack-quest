/**
 * Showing videos of the party night for Brian (showing 4): the game played by touch only (a finger on the picture,
 * on the big button, on the full-screen views), at real speed, on a phone-size page (375 x 812, video 750 x 1624),
 * with the game's own sound. The picture is the browser's screencast, the sound is recorded inside the page from
 * the game's master volume, and ffmpeg joins them. Not a test: it reads the game only to know when to act.
 *   npm run build && node tools/party-showing.mjs <keep|back|flyer|early> <out.mp4>
 *     keep   from the start of P6: the dance (one spot missed), the group photo, the octopus (one hug), snacks, the
 *            bartender's two catches, the alarm, home, under the bed, the card, "Keep going" to the TV coming on.
 *     back   from the start of P6: a snack, the crash, the alarm, home, the card, "Back to the party", the dance,
 *            the group photo, closing time, Mops, home.
 *     flyer  from the start of P3: the welcome, the flyer sneak (P4, the cones timed: tests/party-sneak.mjs plans the
 *            waits from the game's own cones, and the finger follows the plan in real time), home, the dress-up, out.
 *     early  from the start of P6: a dance, then home early through his own door, the card, "Keep going", the
 *            closet (the costume off), Mops comes home, the talk, the TV.
 *     ventfur      from the start of P2 (no disguise): he stands by the floor vent; a tuft of his fur goes in, then
 *                  a cloud of it; a guest sees it and the alarm rings.
 *     ventcostume  from the start of P6 (in disguise): a dance (his first minute passes), then he stands by the vent;
 *                  it sucks his hat in, then he steps away.
 *     tv           beat 20 on its own: the TV story (the Wookiee story), every picture, with its sounds.
 *     bedtime      beat 21: from the TV story's last picture, the bedtime story (to bed, Squatch asks, the crate
 *                  story's pictures, Mops's line, the Guardians picture, falling asleep: the yawn, lying down, the
 *                  tuck, the light, three snores, the fade to black) to the morning fading in. With SHOWING_STILLS=<dir>, a still of each
 *                  step goes there too.
 *     morning      beats 22 to 24, the home morning: from the bedtime story's fade to black (played unrecorded,
 *                  fast, up to the fade) through the night, the wake, the rocket, the Guardian Box, the calendar and the
 *                  lunch bag, to the lunch sneak's first moment in the party hall. A kid's taps: the floor to walk,
 *                  the action button, NEXT. With SHOWING_STILLS=<dir>, a still of each step goes there too.
 *     lunch        beats 25 to 27, the lunch sneak: from TAKE · lunch at home through the sneak past the guests (the
 *                  cones timed: the finger goes when the watcher has just looked away), the hallway, GIVE · lunch, Mops
 *                  eating the lunch and the bag, back behind the snack counter, one snack cake, to beat 28's first line.
 *     lunchseen    the lunch sneak's capture rule: he steps out while a guest looks; FUR!, the alarm, the guards, back
 *                  into the plant, "They lost you."; then seen again and standing still: the LOCKUP card, and the
 *                  restart hidden in the plant. Both write a still of each step to SHOWING_STILLS=<dir> if it is set.
 *     day1end      the new end of Day 1 (story pass 28-52, E2/E4): closing time with the Polaroid (he joined the group
 *                  photo), he walks home himself, the wall speaker calls Mops, the player is Mops cleaning the hall (the
 *                  dust, a spill, the full beard and the wring, the fur trail, the Polaroid close-up), home, truth or
 *                  fib (TELL), the talk, the TV story, the bedtime story (why Mops kept him, the last cake, one heart),
 *                  to Day 2 fading in. A kid's taps: the floor, the big button, NEXT, the two buttons.
 *   SHOWING_SILENT=1 leaves the sound out.
 */
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { startGame, sleep, root } from "../tests/game-page.mjs";

const [which, outFile] = process.argv.slice(2);
const WHICH = ["keep", "back", "flyer", "early", "ventfur", "ventcostume", "tv", "bedtime", "morning", "lunch", "lunchseen", "day1end"];
if (!WHICH.includes(which) || !outFile) {
  console.error("Usage: node tools/party-showing.mjs <" + WHICH.join("|") + "> <out.mp4>");
  process.exit(2);
}
const SILENT = !!process.env.SHOWING_SILENT;
const WORK = join(root, "tests", "out", "party-showing-work", which);
rmSync(WORK, { recursive: true, force: true });
mkdirSync(join(WORK, "fr"), { recursive: true });
mkdirSync(dirname(outFile), { recursive: true });
const hall = await import(join(root, "src", "modules", "party-hall.js"));
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
const g = await startGame({ port: 9360 + WHICH.indexOf(which), name: "party-showing-" + which });
const sneak = await import(join(root, "tests", "party-sneak.mjs"));
const { page, errors } = await g.open(which === "tv" || which === "bedtime" || which === "morning" || which === "lunch" || which === "lunchseen" ? "?ch=1" : "?beat=" + (which === "flyer" ? "party:P3" : which === "ventfur" ? "party:P2" : which === "day1end" ? "party:P8b" : "party:P6"), PHONE);
await sleep(600);
SILENT || (await page.click("#ss-sound").catch(() => {}));
await sleep(600);
const t0 = Date.now();
const log = (m) => console.log(((Date.now() - t0) / 1000).toFixed(1) + "s " + m);

// ---------- recording ----------
let cdp = null;
// Moments named while recording (wall clock, seconds), written out at the end as seconds into the video
// (<out>.marks.json): where each still and each bedtime part falls, for measuring the sound there.
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
  // each frame lasts until the next one (the browser sends a frame only when the picture changes)
  const list = frames.map((f, i) => `file '${f.file}'\nduration ${Math.max(0.001, (i + 1 < frames.length ? frames[i + 1].t : videoEnd) - f.t).toFixed(4)}`).join("\n") + `\nfile '${frames[frames.length - 1].file}'\n`;
  writeFileSync(join(WORK, "frames.txt"), list);
  const v = ["-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "30", "-fps_mode", "cfr", "-vf", "scale=750:1624", "-crf", "24"];
  const args = audio ? ["-f", "concat", "-safe", "0", "-i", join(WORK, "frames.txt"), "-ss", String(lead), "-i", audio, "-map", "0:v", "-map", "1:a", ...v, "-c:a", "aac", "-b:a", "128k", "-shortest", outFile] : ["-f", "concat", "-safe", "0", "-i", join(WORK, "frames.txt"), ...v, outFile];
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...args]);
  console.log(`frames ${frames.length}, seconds ${(videoEnd - frames[0].t).toFixed(1)}, sound ${audio ? "yes" : "no"}: ${outFile}`);
  marks.length && writeFileSync(outFile.replace(/\.mp4$/, "") + ".marks.json", JSON.stringify(marks.map((m) => ({ name: m.name, s: +(m.at - frames[0].t).toFixed(2) })), null, 1));
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
      end: d && d.over && d.seen && d.seen.end ? { ...d.seen.end, level: d.level } : null,
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
    if (await f(s)) return s;
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
const fail = async (m) => {
  const q = await st();
  log("STOPPED: " + m + " " + JSON.stringify({ act: q.act, scene: q.now && q.now.scene, ctrl: q.ctrl, cur: q.cur, text: q.text, x: Math.round(q.x), y: Math.round(q.y), oct: q.now && q.now.oct, gone: q.now && q.now.gone, alarm: q.now && q.now.alarm, pose: q.now && q.now.pose, full: q.full }));
  // (what was recorded so far is still written, so the frames can be looked at)
  await finishRecording().catch(() => {});
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
  const end = Date.now() + 90000;
  while (done < hits && Date.now() < end) {
    s = await st();
    if (s.full !== "dance") break;
    // one routine a visit: then "Dance again" (faster) while he still has spots to dance, else "Back to the party"
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
  // out: by "Back to the party" once the routine is over, else by the X
  const e2 = await until((q) => q.end || q.full !== "dance", 30000);
  e2 && e2.end ? (await sleep(1200), await tap(e2.end.back.x, e2.end.back.y), log("Back to the party")) : (await st()).full === "dance" && (await tap(375 - 36, 36));
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
  // out of his place in the row at once: 2 s after the click he would be seen (Brian 2026-11-26, #46)
  await floor(560, 470);
  log("the Polaroid");
}
// The snack bar: `safe` snacks from the top with her back turned; then, by `end`: "crash" pulls the middle cup of the
// bottom row (the pile falls), "caught" reaches in twice while she faces him ("Nice gloves.", then the alarm), and
// anything else leaves by LEAVE · bar.
async function snacks(safe, end) {
  const crash = end === true || end === "crash";
  const L = await page.evaluate(() => window.SSQ.beat("ch1-party").snackLayout());
  let s = await goTo(L.spot.x - 10, L.spot.y + 10, (q) => q.act === "GRAB · snacks");
  s = await until((q) => q.act === "GRAB · snacks" || (q.now && q.now.scene === "P7"), 8000, read);
  if (s && s.now && s.now.scene === "P7") return void log("an alarm before the snacks");
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
    // (fur showing after the octopus's second hug, a guest may see him at the bar first: the alarm closes it)
    if (!s.slots || !s.snack) return void log("the snack close-up closed (the alarm)");
    const top = s.slots.findIndex((id) => id >= 0);
    if (!(await take(top))) return (await st()).now.scene === "P7" ? void log("the snack close-up closed (the alarm)") : fail("the close-up closed early");
    await until((q) => q.bag >= k + 1, 4000);
    await sleep(700);
    await until((q) => q.cur !== "bub", 6000, read);
  }
  log(`${safe} snacks in the bag`);
  if (end === "caught") {
    for (let n = 1; n <= 2; n++) {
      // a finger on a snack just after she has turned to face him: his paw is out in her sight
      const ok = await until((q) => !q.snack || (q.cur !== "bub" && q.snack.phase === "face" && q.snack.t > 0.25 && q.snack.t < 1.2 && !q.snack.reach), 25000, read);
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
    await until((q) => !q.snack, 6000, read);
    return;
  }
  if (crash) {
    await sleep(600);
    (await take(7)) || (await fail("the close-up closed before the pull"));
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
  // HIDE · bed, pressed as soon as it is offered (and again if the alarm's own close-up was in the way)
  s = await until((q) => q.full === "party card" || (q.now && q.now.pose === "bed"), 20000, async (q) => {
    process.env.SHOWING_DEBUG && log(`home: act "${q.act}" ctrl ${q.ctrl} full "${q.full}" pose ${q.now && q.now.pose} alarm ${q.now && q.now.alarm} cur ${q.cur} btn ${JSON.stringify(q.btn)}`);
    q.act === "HIDE · bed" && q.ctrl && !q.full && (await sleep(250), await press(), await sleep(500));
  });
  // the guard looks round; Mops comes in and sends him off (their six lines); then the card
  s = await until((q) => q.full === "party card", 60000, read);
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
// Beat 20's first card ("Years ago, on Stormtop...", src/modules/tv-story.js): the party night is over.
const toTv = async (ms) => {
  const s = await until((q) => !q.now || q.now.scene === "done" || (q.cur === "card" && q.id === "fb"), ms, async (q) => (q.cur === "bub" || q.cur === "card") && (await read(q)));
  s || (await fail("beat 20 did not start"));
  await sleep(2500);
};

// P4: a way to `to` past the moving cones, planned from the game's own cones and P4's clock now (the game keeps
// running in real time), then followed by a finger: every tenth of a second the finger is on the plan's place for
// P4's clock now (he walks a little faster than the plan, so he keeps up).
async function follow(to, hidden) {
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
    // standing still in the plan is standing still: no tap (a tap on his own spot does nothing anyway)
    moved && s.ctrl && (await floor(q.x, q.y));
    if (at === plan[plan.length - 1] && Math.hypot(s.x - at.x, s.y - at.y) < 14) break;
    await sleep(90);
  }
  const q = await st();
  q.now && q.now.alarm && (await fail("seen on the way"));
}

// The octopus chases him: the finger keeps tapping the floor away from the octopus (turning along a wall when it
// would run into one), until the octopus gives up or `ms` is over.
async function juke(ms) {
  const end = Date.now() + ms,
    B = { x0: 120, x1: 760, y0: 380, y1: 585 };
  for (;;) {
    const s = await st();
    if (Date.now() > end || !s.now || !s.now.oct || !["chase", "hug", "ready"].includes(s.now.oct.mode)) break;
    if (["bub", "card", "panel"].includes(s.cur)) {
      await read(s);
      continue;
    }
    const o = await page.evaluate(() => window.__ss.op.ch1PartyNow.people["octopus-guest"]);
    let dx = s.x - o.x,
      dy = s.y - o.y;
    const d = Math.hypot(dx, dy) || 1;
    (dx /= d), (dy /= d);
    let to = { x: s.x + dx * 160, y: s.y + dy * 160 };
    // a wall ahead: run along it instead, toward the roomier side
    if (to.x < B.x0 || to.x > B.x1) to = { x: Math.min(B.x1, Math.max(B.x0, to.x)), y: s.y + (s.y < (B.y0 + B.y1) / 2 ? 150 : -150) };
    if (to.y < B.y0 || to.y > B.y1) to = { x: s.x + (s.x < (B.x0 + B.x1) / 2 ? 170 : -170), y: Math.min(B.y1, Math.max(B.y0, to.y)) };
    s.ctrl && (await floor(to.x, to.y));
    await sleep(260);
  }
}

// ---------- the showings ----------
// The bedtime video starts at the TV story's last picture: the story before it plays unrecorded, fast.
if (which === "bedtime") {
  await page.evaluate(() => window.__ss.lockedReady);
  const ok = await page.evaluate(() => {
    const ss = window.__ss,
      n = ss.op;
    n.q = [];
    n.cur = null;
    // (after the party, as party.js finish() leaves it: the evening is at night, night-look.js)
    n.ch1PartyNow = { scene: "done" };
    window.SSQ.engine().tvStory();
    for (let i = 0; i < 600; i++) {
      ss.tick(0.05);
      const c = n.cur;
      if (c && c.k === "cutaway" && c.id === "wookiee" && c.panel === 4) return true;
      c && ["card", "cutaway"].includes(c.k) && ((n.bt = 1), ss.opTap());
    }
    return false;
  });
  ok || (await fail("the TV story did not reach its last picture"));
}
// The morning video starts at the bedtime story's fade to black: the TV story and the bedtime story before it play
// unrecorded, fast.
if (which === "morning") {
  await page.evaluate(() => window.__ss.lockedReady);
  const ok = await page.evaluate(() => {
    const ss = window.__ss,
      n = ss.op,
      bed = window.SSQ.beat("ch1-bedtime-story");
    n.q = [];
    n.cur = null;
    // (after the party, as party.js finish() leaves it: the evening is at night, night-look.js)
    n.ch1PartyNow = { scene: "done" };
    window.SSQ.engine().tvStory();
    for (let i = 0; i < 6000; i++) {
      if (bed.debug().phase === "fade") return true;
      ss.tick(0.05);
      const c = n.cur;
      c && ["card", "cutaway", "bub", "panel", "wait"].includes(c.k) && ((n.bt = 1), ss.opTap());
    }
    return false;
  });
  ok || (await fail("the bedtime story did not reach its fade to black"));
}
// The lunch videos start at home on Day 2 with the lunch bag in reach (the home morning's last step), or in the hall.
if (which === "lunch" || which === "lunchseen") {
  await page.evaluate(() => window.__ss.lockedReady);
  await page.evaluate((w) => {
    const ss = window.__ss,
      n = ss.op;
    n.q = [];
    n.cur = null;
    ss.ch1JumpBeat(22);
    w === "lunch" ? window.SSQ.beat("ch1-home-morning").jump("lunch") : window.SSQ.beat("ch1-lunch").jump("plant");
  }, which);
}
await startRecording();
// (day1end: Squatch joined the group photo, so Mops finds the Polaroid)
which === "day1end" && (await page.evaluate(() => (window.__ss.op.ch1PartyNow.shot = { phase: "done", got: true })));
await sleep(which === "morning" || which === "lunch" || which === "lunchseen" ? 300 : 1800);
if (which === "keep") {
  await dance(16, 4);
  // toward the wall by the alarm box, where the row will stand; the first song ends and the photo moment begins
  await goTo(300, 545);
  await photo(70000);
  // The octopus (after the first minute): near his end of the bar his "?" fills in, then "*hic* Fellow tourist!", a
  // lunge and a first hug (just a hug, his hat tips), Squatch's two thoughts, and the real chase: he jukes away
  // from him until the octopus gets bored (20 s).
  // (after the photo he walks back to the snacks and rests there before he looks at anyone)
  const octOn = (q) => q.now.oct && ["ready", "lunge", "hug", "chase"].includes(q.now.oct.mode);
  await goTo(640, 560, octOn);
  let s = await until(octOn, 40000, read);
  s || (await fail("the octopus did not notice"));
  log("the octopus");
  s = await until((q) => q.now.oct.mode === "chase" && q.ctrl && q.cur !== "bub", 30000, read);
  s || (await fail("the real chase did not start"));
  log("the chase: juke");
  await juke(26000);
  s = await st();
  log(s.now.gone.length ? "the second hug knocked his " + s.now.gone.join(", ") + " off; off to the snack bar" : "the octopus is bored; off to the snack bar");
  // Straight to the snack bar: two snacks while her back is turned, then his paw out twice while she is looking.
  // The second time she sees fur and runs for the alarm; his hat is still on (for Mops to lift at home).
  (await st()).now.scene === "P6" && (await snacks(2, "caught"));
  await runHomeToCard();
  await chooseOnCard("keep");
  await toTv(120000);
}
if (which === "back") {
  await snacks(1, true);
  await runHomeToCard();
  await chooseOnCard("back");
  let s = await until((q) => q.now && q.now.scene === "P6" && q.ctrl && q.room === "hall", 60000, read);
  s || (await fail("he did not get back to the party"));
  log("back at the party");
  await sleep(1200);
  await dance(14, 0);
  await goTo(300, 545);
  await photo(80000);
  // The dance, the snacks and the photo are found: the last song comes early. He dances it out (the dance ends
  // with the song), and closing time begins.
  await dance(40, 0);
  // closing time, then Mops: he walks over to him
  s = await until((q) => q.now && q.now.scene === "P8b" && q.now.mops && q.ctrl, 150000, read);
  s || (await fail("closing time did not come"));
  log("closing time, Mops is in");
  await until(
    (q) => !q.now || q.now.scene === "done" || (q.cur === "card" && q.id === "fb"),
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
  s || (await fail("P4 did not start"));
  log("P4: the flyer sneak");
  await sleep(2600);
  await follow(hall.FLYER.reach, true);
  s = await until((q) => q.act === "GRAB · flyer", 4000);
  s || (await fail("no GRAB · flyer"));
  await sleep(900);
  await press();
  await until((q) => q.now.flyer === "paw" && q.ctrl, 4000);
  log("GRAB · flyer");
  await sleep(700);
  await follow({ x: hall.HALL_DOOR.x, y: hall.HALL_DOOR.y - 50, r: 30 }, false);
  // home: "Phew, made it!", then SAVE · flyer at his bed (it glows), then his two thoughts
  let saved = false;
  s = await until((q) => q.now && q.now.scene === "P5" && q.ctrl, 40000, async (q) => {
    if (q.cur === "bub") return read(q);
    if (!saved && q.act === "SAVE · flyer" && q.ctrl) return void ((saved = true), await sleep(1500), await press(), log("SAVE · flyer"));
    q.ctrl && q.room === "hall" && (await floor(hall.HALL_DOOR.x, hall.HALL_DOOR.y + 12), await sleep(600));
  });
  s || (await fail("P5 did not start"));
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
if (which === "ventfur") {
  // P2, no disguise: from his doorway to the floor vent, then he stands there
  let s = await until((q) => q.now && q.now.scene === "P2" && q.ctrl, 8000, read);
  s || (await fail("P2 did not start"));
  await sleep(1500);
  // (sight sees his whole body since 2026-11-26: he waits for the glancer to face the stage, then goes along the
  // front of the hall, under the cones, to the vent)
  await until((q) => q.now.glance === "back", 12000);
  await until((q) => q.now.glance === "stage", 4000);
  await goTo(300, 588, (q) => q.now.alarm, 4000);
  await goTo(hall.HALL.vent.x + 40, hall.HALL.vent.y - 20, (q) => q.now.alarm, 9000);
  log("by the vent");
  s = await until((q) => q.now.alarm, 12000);
  s || (await fail("the vent took no fur"));
  log("the fur went in: the alarm");
  await until((q) => q.now.alarm === "ring" || q.now.alarm === "search", 12000, read);
  await sleep(5000);
}
if (which === "ventcostume") {
  // in disguise: a dance first (nothing comes off in his first minute), then he stands by the vent
  await dance(14, 0);
  const ready = await until((q) => q.now.ft >= 61, 70000, read);
  log(ready ? "his first minute is over" : "(first minute: not read, going on)");
  await goTo(hall.HALL.vent.x + 40, hall.HALL.vent.y - 20, null, 9000);
  log("by the vent");
  const s = await until((q) => q.now.gone && q.now.gone.length, 15000);
  s || (await fail("the vent took no piece"));
  log("the vent took " + JSON.stringify(s.now.gone));
  await sleep(2500);
  await goTo(480, 450);
  await sleep(3000);
}
if (which === "tv") {
  await page.evaluate(() => {
    const n = window.__ss.op;
    n.q = [];
    n.cur = null;
    // (after the party, as party.js finish() leaves it: the evening is at night, night-look.js)
    n.ch1PartyNow = { scene: "done" };
    window.SSQ.engine().tvStory();
  });
  // every picture: read it (about 3 s), then NEXT; the ship picture gets 6 s
  await until((q) => q.cur === "card", 6000);
  for (let i = 0; i < 14; i++) {
    const s = await until((q) => ["card", "panel", "bub", "cutaway"].includes(q.cur), 3000);
    if (!s) break;
    // (the "Now" card is the story's last; what comes after it is bedtime, not part of this video)
    const last = i > 0 && s.cur === "card";
    await sleep(s.cur === "cutaway" ? 6000 : 3200);
    if (last) break;
    await page.evaluate(() => ((window.__ss.op.bt = 1), window.__ss.opTap()));
    await sleep(500);
  }
  await sleep(1500);
}
if (which === "bedtime") {
  const STILLS = process.env.SHOWING_STILLS || "";
  STILLS && mkdirSync(STILLS, { recursive: true });
  let k = 0;
  const still = async (name) => (mark("still " + name), STILLS && (await page.screenshot({ path: join(STILLS, String(++k).padStart(2, "0") + "-" + name + ".png") })));
  const next = () => page.evaluate(() => ((window.__ss.op.bt = 1), window.__ss.opTap()));
  // the TV story's last picture, then its Now card
  await sleep(2500);
  await next();
  await until((q) => q.cur === "card", 3000);
  await sleep(2500);
  await next();
  log("bedtime");
  const bedT = () => page.evaluate(() => window.SSQ.beat("ch1-bedtime-story").debug().phase);
  const waitPhase = (p, ms) => until(async () => (await bedT()) === p, ms || 8000);
  // 1. to bed with no words: he walks to his crate bed and climbs in, Mops comes over; then he asks
  await waitPhase("walk", 3000);
  await sleep(1300);
  await still("walks-to-bed");
  await waitPhase("bed");
  await sleep(1800);
  await still("in-bed-mops-comes-over");
  await until((q) => q.cur === "bub", 6000);
  await sleep(1500);
  await still("asks-when-we-first-met");
  await sleep(2500);
  await next();
  // 2. the pictures: read each (about 4 s), then NEXT
  for (let i = 0; i < 6; i++) {
    const s = await until((q) => q.cur === "cutaway" || q.cur === "bub", 8000);
    if (!s || s.cur !== "cutaway") break;
    await sleep(1200);
    const pic = await page.evaluate(() => window.SSQ.cutaway.last().pic);
    await still("picture-" + pic);
    await sleep(3000);
    await next();
    await sleep(300);
  }
  // 3. Mops's line
  await until((q) => q.cur === "bub", 6000);
  await sleep(1500);
  await still("mops-line");
  await sleep(2800);
  await next();
  // the Guardians picture: Squatch's crayon drawing, Mops's Guardians line
  await until((q) => q.cur === "cutaway", 6000);
  await sleep(1500);
  await still("guardians-picture");
  await sleep(3500);
  await next();
  // 4. falling asleep, every part plays by itself: a still near the end of each part
  for (const [p, wait, name] of [
    ["yawn", 1100, "yawns-and-stretches"],
    ["lie", 1700, "lies-down"],
    ["tuck", 1500, "mops-tucks-him-in"],
    ["door", 2600, "mops-walks-to-the-door"],
    ["lights", 1500, "light-goes-down"],
    ["snore1", 1000, "snore-1"],
    ["snore2", 1300, "snore-2"],
    ["snore3", 1600, "snore-3"],
    ["fade", 1000, "fades-to-black"],
  ]) {
    await waitPhase(p);
    mark("part " + p);
    await sleep(wait);
    await still(name);
  }
  // 5. the morning fades in
  await until(() => page.evaluate(() => !!window.__ss.op.ch1Day2), 8000);
  await sleep(500);
  await still("morning-fades-in");
  await sleep(2500);
  await still("morning");
  await sleep(1000);
}
if (which === "morning") {
  const STILLS = process.env.SHOWING_STILLS || "";
  STILLS && mkdirSync(STILLS, { recursive: true });
  let k = 0;
  const still = async (name) => STILLS && (await page.screenshot({ path: join(STILLS, String(++k).padStart(2, "0") + "-" + name + ".png") }));
  const hm = () => page.evaluate(() => {
    const d = window.SSQ.beat("ch1-home-morning").debug();
    return d.state ? d.state.step : "";
  });
  const next = () => page.evaluate(() => ((window.__ss.op.bt = 1), window.__ss.opTap()));
  const stepIs = (name, ms = 8000) => until(async (q) => (await hm()) === name && (q.ctrl || !["rocket", "closet", "box", "cal", "lunch"].includes(name)), ms);
  // a kid's walk: tap the floor where he should go, then wait until the button offers the action
  const walkTo = async (x, y, act) => {
    await floor(x, y);
    (await until((q) => q.act === act, 9000)) || (await fail("no " + act + " after walking to " + x + ", " + y));
  };
  log("the bedtime story's fade to black");
  await sleep(900);
  await still("bedtime-fades-to-black");
  await until(async () => (await hm()) === "night", 4000);
  mark("part night");
  await sleep(700);
  await still("dark-mops-leaves-heard");
  await sleep(1300);
  await still("room-comes-up-asleep-under-the-blanket");
  await until(async () => (await hm()) === "wake", 4000);
  mark("part wake");
  // From the PA on, the morning is played by what is on screen (round D: Mops asleep until the PA, the PA's line,
  // the note close-up, the Guardians line, the thought bubble, the closet, the box close-up, the walk to the bag):
  // a line, card or close-up is read and closed with NEXT; with control, the step's action is done the way a kid does.
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
      again.cur === q.cur && again.text === q.text && (await next());
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
      await walkTo(300, 400, "OPEN · closet");
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
      // (one tap: a second one while his line is up would close it before it is read)
      await until(async (q2) => q2.cur === "bub" || (await hm()) !== "toBag", 8000);
    } else if (step === "lunch") {
      await sleep(700);
      await once("lunch-goal");
      // the calendar is there to look at (not a step): LOOK · calendar by the wardrobe, once, then back to the lunch
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
      await walkTo(760, 505, "TAKE · lunch");
      await sleep(400);
      await once("take-lunch");
      await press();
      await until((q2) => q2.room === "hall" && q2.ctrl, 10000);
    } else await sleep(300);
  }
  await sleep(600);
  await still("out-the-door-lunch-sneak-starts");
  await sleep(1500);
}
if (which === "lunch" || which === "lunchseen") {
  const STILLS = process.env.SHOWING_STILLS || "";
  STILLS && mkdirSync(STILLS, { recursive: true });
  let k = 0;
  const still = async (name) => STILLS && (await page.screenshot({ path: join(STILLS, (which === "lunch" ? "" : "seen-") + String(++k).padStart(2, "0") + "-" + name + ".png") }));
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
  const next = () => page.evaluate(() => ((window.__ss.op.bt = 1), window.__ss.opTap()));
  const stepIs = (name, ms = 10000) => until(async (q) => (await lu()).step === name && q.ctrl, ms);
  const walkTo = async (x, y, act, ms = 9000) => {
    await floor(x, y);
    (await until((q) => q.act === act, ms, async (q) => q.ctrl && !q.act && Math.hypot(q.x - x, q.y - y) > 30 && !q.cur && (await sleep(700), await floor(x, y)))) || (await fail("no " + act + " after walking to " + x + ", " + y));
  };
  // inside the hallway doorway's opening (lunch-sneak-place.js LUNCH_PLACES.door.walkTo)
  const LUNCH_DOOR = (await import(join(root, "src", "modules", "lunch-sneak-place.js"))).LUNCH_PLACES.door.walkTo;
  // a kid who has watched the cone: waits for the watcher to have just looked away
  const awayNow = (id, ms = 9000) => until(async () => ((w) => w.phase === "away" && w.k < 0.08)((await lu())[id]), ms);
  const lookNow = (id, ms = 9000) => until(async () => ((w) => w.phase === "look" && w.k > 0.1 && w.k < 0.3)((await lu())[id]), ms);
  if (which === "lunch") {
    await sleep(700);
    await still("take-lunch-at-home");
    await press();
    await sleep(500);
    await still("walk-in-mops-mops-his-way-out");
    await stepIs("plant");
    await sleep(900);
    await still("only-the-hallway-doorway-glows");
    // ROLL · ball (Brian 2026-11-26): he rolls up where he stands, then walks on (moving unrolls him)
    if ((await st()).act === "ROLL · ball") {
      await press();
      await sleep(900);
      await still("roll-ball");
      await sleep(600);
    }
    await walkTo(396, 552, "HIDE · plant");
    await press();
    await sleep(700);
    await still("hidden-in-the-plant");
    await awayNow("teal");
    await still("she-looks-away-go");
    await walkTo(600, 478, "HIDE · crate");
    await press();
    await sleep(700);
    await still("hidden-behind-the-crates-eyes-at-the-seam");
    await awayNow("camera");
    // the doorway is walk-through (Brian #47): he walks up the strip and on into the opening, no button
    await floor(905, 320);
    await sleep(1400);
    await still("at-the-hallway-doorway");
    await floor(LUNCH_DOOR.x, LUNCH_DOOR.y);
    await until((q) => q.room === "passage", 6000);
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
    await stepIs("give");
    await sleep(700);
    await still("mops-glows-give-him-his-lunch");
    await walkTo(540, 488, "GIVE · lunch");
    await press();
    await sleep(300);
    await still("the-bag-goes-to-mops");
    await until((q) => q.cur === "bub", 4000);
    await sleep(700);
    await still("my-lunch-youre-the-best");
    await sleep(1400);
    await next();
    await until((q) => q.cur === "cutaway", 3000);
    await sleep(900);
    await still("mops-eats-the-sandwich");
    await sleep(1400);
    await still("then-the-bag");
    await stepIs("back", 8000);
    await sleep(600);
    await still("go-on-the-doorway-is-outlined");
    await floor(50, 345);
    await until(async () => (await lu()).step === "one", 9000);
    await until((q) => q.cur === "bub", 5000);
    await sleep(900);
    await still("counter-close-up-mops-grab-one-snack");
    await sleep(2200);
    await next();
    await stepIs("snack", 8000);
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
    await sleep(1600);
  } else {
    await sleep(600);
    await walkTo(396, 552, "HIDE · plant");
    await press();
    await sleep(600);
    await still("hidden-in-the-plant");
    // out into the open while she looks across: a kid who did not wait
    await lookNow("teal");
    await floor(498, 520);
    await until(async () => !!(await lu()).alarm, 4000);
    await sleep(300);
    await still("seen-fur");
    await until(async () => (await lu()).alarm === "pull", 4000);
    await sleep(900);
    await still("the-alarm-pulled");
    await until(async () => (await lu()).alarm === "search", 6000);
    await sleep(300);
    await still("guards-come-hide");
    await walkTo(396, 552, "HIDE · plant", 5000);
    await press();
    await sleep(900);
    await still("hidden-they-search");
    await until(async () => !(await lu()).alarm, 15000);
    await sleep(500);
    await still("they-lost-you");
    // seen again, and he stands still: a guard catches him
    await lookNow("teal", 12000);
    await floor(498, 520);
    await until(async () => (await lu()).jail, 20000);
    await sleep(800);
    await still("caught-the-lockup-card");
    await sleep(2600);
    for (let i = 0; i < 6 && (await st()).cur; i++) (await tap(187, 300), await sleep(900));
    await stepIs("crate", 6000);
    await sleep(700);
    await still("restarts-hidden-in-the-plant");
    await sleep(1200);
  }
}
if (which === "early") {
  await dance(10, 0);
  // away from his door, then home through it: the party ends with the card
  await goTo(480, 450);
  let s = await until((q) => q.full === "party card", 20000, async (q) => {
    if (["bub", "card", "panel"].includes(q.cur)) return read(q);
    q.ctrl && q.room === "hall" && (await floor(hall.HALL_DOOR.x, hall.HALL_DOOR.y + 12), await sleep(500));
  });
  s || (await fail("no card after going home"));
  log("home early: the card");
  await sleep(3200);
  await chooseOnCard("keep");
  // the closet: OPEN · closet takes the costume off
  await goTo(150, 400, (q) => q.act === "OPEN · closet");
  s = await until((q) => q.act === "OPEN · closet" && q.ctrl, 8000);
  s || (await fail("no OPEN · closet at home"));
  await sleep(900);
  await press();
  await until((q) => q.ctrl && q.now && Object.values(q.now.worn).every((v) => !v), 8000);
  log("the costume off");
  await toTv(120000);
}
if (which === "day1end") {
  const C = await import(join(root, "src", "modules", "party-cleanup.js"));
  const next = () => page.evaluate(() => ((window.__ss.op.bt = 1), window.__ss.opTap()));
  const more = () =>
    page.evaluate(() => {
      const n = window.__ss.op,
        now = window.SSQ.beat("ch1-party").now();
      return { mo: { x: n.mo.x, y: n.mo.y }, clean: now && now.clean, truthOpen: !!(now && now.truthOpen), close: now && now.close ? now.close.phase : "" };
    });
  // a line, a card or a picture with words: read it, then NEXT (a picture that plays by itself is left alone)
  const readIt = async (q) => {
    const auto = await page.evaluate(() => !!(window.__ss.op.cur && window.__ss.op.cur.auto));
    if (auto) return;
    await sleep(q.cur === "cutaway" ? 2600 : 1500);
    await next();
    await sleep(250);
  };
  // the Mops walk: a finger on the floor, again if he stops short
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
  // closing time: the speaker, then he walks home through his own door
  await until((q) => q.ctrl && q.now && q.now.close && q.now.close.phase !== "speak" && q.now.close.phase !== "cheer" && q.now.close.phase !== "dim", 25000, async (q) => ["bub", "card"].includes(q.cur) && (await readIt(q)));
  await sleep(1500);
  log("home through his own door");
  await until((q) => q.now && q.now.scene === "P9" && q.ctrl && !q.cur, 40000, async (q) => {
    if (["bub", "card", "panel"].includes(q.cur)) return readIt(q);
    q.ctrl && q.room === "hall" && (await floor(hall.HALL_DOOR.x, hall.HALL_DOOR.y + 12), await sleep(600));
  });
  log("the cleanup");
  // mop a while (the dust and a spill), then on until the beard is full
  const sp = C.SPILLS[1];
  await mopsTo(sp.x + 60, sp.y);
  await mopsTo(sp.x - 90, sp.y);
  for (let i = 0; i < 30; i++) {
    const m = await more();
    if (!m.clean || m.clean.beard >= 1) break;
    await mopsTo(i % 2 ? 90 : 760, [330, 390, 450, 510, 570][i % 5]);
  }
  await sleep(1200);
  // the bucket (outlined), WRING · beard, the pictures, then the fur
  for (let i = 0; i < 600; i++) {
    const q = await st(),
      m = await more(),
      c = m.clean;
    if (q.now && q.now.scene === "P9b") break;
    if (["bub", "card", "panel", "cutaway"].includes(q.cur)) {
      await readIt(q);
      continue;
    }
    if (!q.ctrl || !c) {
      await sleep(120);
      continue;
    }
    if (c.close) {
      await sleep(1600);
      const b = c.close === "shirt" ? c.targets.shirt : c.close === "feet" ? c.targets.feet : null;
      b && (await floor(b.x, b.y));
      await sleep(400);
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
  await until(async () => (await more()).truthOpen, 40000, async (q) => ["bub", "card"].includes(q.cur) && (await readIt(q)));
  await sleep(2500);
  const T = await page.evaluate(() => window.SSQ.beat("ch1-party").truthTargets());
  T ? await tap(T.tell.x, T.tell.y) : await fail("no truth or fib buttons");
  // the talk, to the TV
  await toTv(150000);
  log("the TV story");
  // the TV story and the bedtime story, read at a kid's pace, to Day 2
  await until(() => page.evaluate(() => !!window.__ss.op.ch1Day2), 400000, async (q) => ["bub", "card", "panel", "cutaway"].includes(q.cur) && (await readIt(q)));
  log("Day 2");
  await sleep(3000);
}
await finishRecording();
console.log("page errors", errors.slice(0, 5));
await g.finish("party-showing-" + which);
