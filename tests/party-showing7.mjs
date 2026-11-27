/**
 * Brian's notes on party showing 7 (2026-11-26). Each check names his note's time in the video:
 *   0:05  "like the Charlie Brown teacher noise... anytime there's someone speaking": every bubble speaker in the
 *         party (and the morning) gets a muffled "wah-wah" voice, never over a sung line or a thought, and Mops keeps
 *         his meh (speech-voice.js; tests/speech-voices.mjs checks the voices themselves). Played with sound on.
 *   0:05  "a line coming from the plant... keep it thin... make it more obvious who the speaker or thinker is": every
 *         bubble's tail ends inside its speaker's box; Squatch's thoughts are three circles ending in the plant he
 *         hides in (or his head at home); everyone else's is a pointed tail (bubble-tail.js).
 *   0:11  "make this transition a little bit slower... a microphone... the manager's walking over and drops it... a
 *         cutaway to close up cartoon of the croc boy bebopping": the Croc Boys take about 2 s to walk on; Isfred
 *         carries a mic stand to the singer and sets it down only once they stand in their places, then sets the
 *         flyer down at the bar; a beat; then the band plays and a wordless 2 to 3 s close-up of a Croc Boy plays by
 *         itself (no tap), then the song's bubble in the hall.
 *   0:18  "I don't think it's super obvious that the music's coming from the Croc Boys": while they play in P3 and P4,
 *         notes rise from them and they bob on their song's beat; the wall speaker shows no ring while the band plays.
 *   0:46  "We should see music notes floating in from the door here": at home while the band plays next door, faint
 *         notes drift in under his door.
 *   (0:51, the flyer keeps its size as it slides under the bed: tests/party-flyer.mjs. 1:05, the shirt is needed for
 *   a disguise: tests/party-scenes.mjs.)
 *   node tests/party-showing7.mjs
 */
import { join } from "node:path";
import { startGame, sleep, root } from "./game-page.mjs";

const hall = await import(join(root, "src", "modules", "party-hall.js"));
const walks = await import(join(root, "src", "modules", "party-stage-walks.js"));
const cut = await import(join(root, "src", "modules", "cutaway.js"));
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
const g = await startGame({ port: 9474, name: "party-showing7" });

// ---------- P3, played frame by frame with sound on ----------
{
  const { page, errors } = await g.open("?beat=party:P3", PHONE);
  await sleep(1500);
  await page.click("#ss-sound").catch(() => {});
  await sleep(400);
  const run = await page.evaluate((MIC) => {
    window.requestAnimationFrame = () => 0;
    const ss = window.__ss,
      n = ss.op,
      b = window.SSQ.beat("ch1-party"),
      dt = 1 / 60,
      // (P3 again from its start now that sound is on, so its first line has its voice too)
      _ = b.jump("P3"),
      out = { bubbles: [], events: [], walkOn: null, cutaway: null, sound: window.SSQ.engine().soundState() };
    let t = 0,
      walkFrom = null,
      cutFrom = null,
      lastKey = "";
    const ev = (what) => out.events.push({ what, t: Math.round(t * 100) / 100 });
    for (let i = 0; i < 60 * 60; i++) {
      ss.tick(dt);
      ss.drawFrame();
      t += dt;
      const p = n.ch1PartyNow,
        c = n.cur,
        now = b.now();
      if (!p || now.scene !== "P3") break;
      p.bandAt && walkFrom == null && ((walkFrom = t), ev("band walks on"));
      !p.bandAt && walkFrom != null && out.walkOn == null && ((out.walkOn = t - walkFrom), ev("band in place"));
      p.mic && !out.events.some((e) => e.what === "mic set") && ev("mic set");
      p.flyer === "stage" && !out.events.some((e) => e.what === "flyer down") && ev("flyer down");
      p.band && !out.events.some((e) => e.what === "band plays") && ev("band plays");
      if (c && c.k === "cutaway") {
        cutFrom == null && ((cutFrom = t), ev("cutaway"));
        out.cutaway = { ...window.SSQ.cutaway.last(), seen: t - cutFrom + dt, ctrlWhile: !!n.ctrl, bubbleWhile: false };
      } else if (cutFrom != null && out.cutaway && out.cutaway.ended == null) out.cutaway.ended = t - cutFrom;
      const key = c ? c.k + (c.b ? c.b.text : "") : "";
      if (c && c.k === "bub" && key !== lastKey) {
        const lb = ss.lastBubble;
        out.bubbles.push({ who: c.b.who, style: c.b.style || "", text: c.b.text, tail: lb && lb.tail, target: lb && lb.target, box: lb && { x: lb.x, y: lb.y, w: lb.w, h: lb.h }, hideAt: p.hideAt });
        ev("bubble " + c.b.who);
      }
      lastKey = key;
      // the mic is still carried until the band stands in its place
      p.bandAt && p.mic && (out.micEarly = true);
      c && c.k === "bub" && ((n.bt = 1), ss.opTap());
    }
    out.voices = window.SSQ.speechVoice.debug().log;
    out.morningSounds = window.SSQ.morningSound.debug().log.map((x) => x.name);
    return out;
  }, walks.MIC);
  const at = (what) => (run.events.find((e) => e.what === what) || { t: null }).t;
  g.check("sound was on for the run", run.sound === "on", run.sound);
  // 0:11
  g.check("0:11 the Croc Boys take about 2 s to walk on and take their places", run.walkOn > 1.7 && run.walkOn < 2.6, run.walkOn);
  g.check("0:11 Isfred sets the mic stand down only once all three stand in their places", !run.micEarly && at("mic set") >= at("band in place"), run.events);
  g.check("0:11 then he sets the flyer down at the bar, and there is a beat before the band plays", at("flyer down") > at("mic set") && at("band plays") - at("flyer down") >= 0.7, run.events);
  g.check("0:11 the band starts to play as the close-up of a Croc Boy comes up (no band bubble before it)", Math.abs(at("cutaway") - at("band plays")) < 0.1 && !run.events.some((e) => e.what === "bubble band" && e.t < at("cutaway")), run.events);
  const c = run.cutaway || {};
  g.check("0:11 the close-up is the Croc Boy picture, wordless, plays by itself for 2 to 3 s (no tap), then goes", c.id === "croc" && c.auto >= 2 && c.auto <= 3 && c.ended >= 2 && c.ended <= 3.1 && c.croc && !c.ctrlWhile, c);
  g.check("0:11 he bops: the picture's beat runs on (more than 4 beats of the band's track by its end) and notes rise", c.croc && c.croc.beat > 4 && (c.notes || []).length > 0, c);
  g.check("0:11 back in the hall the band's song bubble comes after the close-up", at("bubble band") > at("cutaway") + 2, run.events);
  // 0:05 tails
  const inside = (pt, b) => pt && pt.x >= b.x0 && pt.x <= b.x1 && pt.y >= b.y0 && pt.y <= b.y1;
  const plant = hall.HALL.plants.find((q) => q.id === "middle").leaves;
  const bad = run.bubbles.filter((q) => !q.tail || !inside(q.tail.end, q.target));
  g.check("0:05 every bubble in P3 has a tail that ends inside its speaker's box", run.bubbles.length >= 7 && bad.length === 0, bad.length ? bad : run.bubbles.length);
  const thoughts = run.bubbles.filter((q) => q.who === "sq");
  g.check(
    "0:05 Squatch's thoughts in the plant: three thin circles, shrinking toward him, the last one inside the plant's leaves",
    thoughts.length === 3 && thoughts.every((q) => q.tail.kind === "thought" && q.tail.circles.length === 3 && q.tail.circles[0].r > q.tail.circles[2].r && inside(q.tail.end, plant) && JSON.stringify(q.target) === JSON.stringify(plant)),
    thoughts.map((q) => q.tail),
  );
  g.check("0:05 everyone else's bubble keeps a pointed tail", run.bubbles.filter((q) => q.who !== "sq").every((q) => q.tail.kind === "speech"), run.bubbles.map((q) => [q.who, q.tail && q.tail.kind]));
  // 0:05 voices
  const spoken = run.bubbles.filter((q) => q.who === "official").length;
  g.check("0:05 each of Isfred's lines has its voice", run.voices.filter((v) => v.who === "official").length === spoken && spoken === 3, run.voices);
  g.check("0:05 no voice under the sung line or Squatch's thoughts", !run.voices.some((v) => v.who === "band" || v.who === "sq"), run.voices);
  g.check("0:05 a longer line's voice lasts longer (\"Let's give a big hello...\" against \"And now...\")", run.voices.length === 3 && run.voices[0].len > run.voices[2].len, run.voices);
  // the voice is Brian's pick of 2026-11-26: recorded syllables (sounds/voices/), loaded once sound is on
  await page.evaluate(() => ((window.requestAnimationFrame = (f) => setTimeout(() => f(performance.now()), 16)), window.SSQ.bubbleSound({ who: "official", text: "Welcome, everybody, welcome!", style: "say" }, "voice-test")));
  await sleep(1500);
  const vd = await page.evaluate(() => window.SSQ.speechVoice.debug());
  const lastV = vd.log[vd.log.length - 1] || {};
  g.check("0:05 the voice plays recorded syllables (a man's standard voice for Isfred), all four of its files loaded", lastV.recorded === true && lastV.set === "male_standard" && vd.loaded.male_standard === 4, { lastV, loaded: vd.loaded });
  g.check("no page errors (P3)", errors.length === 0, errors);
}

// ---------- 0:18 P4: notes from the band, the beat, no speaker ring ----------
{
  const { page, errors } = await g.open("?beat=party:P4", PHONE);
  await sleep(1500);
  const r = await page.evaluate(() => {
    window.requestAnimationFrame = () => 0;
    const ss = window.__ss,
      p = ss.op.ch1PartyNow,
      c = document.querySelector("canvas"),
      k = c.width / 960,
      ctx = c.getContext("2d"),
      samples = [];
    // the notes are drawn over the band's heads and to their sides: count note colours there with and without the notes
    const box = { x0: 200, x1: 430, y0: 120, y1: 260 },
      count = () => {
        const d = ctx.getImageData(Math.round(box.x0 * k), Math.round(box.y0 * k), Math.round((box.x1 - box.x0) * k), Math.round((box.y1 - box.y0) * k)).data;
        let n = 0;
        for (let i = 0; i < d.length; i += 4) Math.abs(d[i] - 255) < 8 && Math.abs(d[i + 1] - 95) < 8 && Math.abs(d[i + 2] - 168) < 8 && n++;
        return n;
      };
    let pink = 0;
    for (let f = 0; f < 90; f++) {
      ss.tick(1 / 60);
      ss.drawFrame();
      pink += count();
      samples.push(p.bandT || 0);
    }
    return { pink, band: p.band, bandT: samples[samples.length - 1] - samples[0] };
  });
  g.check("0:18 in P4 the band plays and its clock runs (the beat they bob to)", r.band && r.bandT > 1.4, r);
  g.check("0:18 in P4 pink music notes are drawn by the Croc Boys (P3 and P4 too, not only from P6)", r.pink > 30, r.pink);
  g.check("no page errors (P4)", errors.length === 0, errors);
}

// ---------- 0:46 at home, the band next door: faint notes under his door ----------
{
  const { page, errors } = await g.open("?beat=party:P5", PHONE);
  await sleep(1500);
  const r = await page.evaluate(() => {
    window.requestAnimationFrame = () => 0;
    const ss = window.__ss,
      p = ss.op.ch1PartyNow;
    const m = window.SSQ.beat("ch1-party");
    return { room: ss.op.room, band: !!p.band, scene: m.now().scene };
  });
  // count note-pink pixels just left of his door, low (where they drift in), with the band playing and without
  const pinkNear = () =>
    page.evaluate(() => {
      const ss = window.__ss,
        c = document.querySelector("canvas"),
        k = c.width / 960,
        ctx = c.getContext("2d");
      let n = 0;
      for (let f = 0; f < 60; f++) {
        ss.tick(1 / 60);
        ss.drawFrame();
        const d = ctx.getImageData(Math.round(700 * k), Math.round(380 * k), Math.round(260 * k), Math.round(150 * k)).data;
        // (pink against the floor, by day or under the night look: night-look.js)
        for (let i = 0; i < d.length; i += 4) d[i] > 150 && d[i + 2] > 120 && d[i] - d[i + 1] > 60 && n++;
      }
      return n;
    });
  const withBand = await pinkNear();
  await page.evaluate(() => (window.__ss.op.ch1PartyNow.band = false));
  const without = await pinkNear();
  g.check("0:46 at home (P5) with the band playing next door, faint notes drift in under his door; none once it stops", r.room === "closet" && r.band && withBand > 20 && without === 0, { r, withBand, without });
  g.check("no page errors (P5)", errors.length === 0, errors);
}
await g.finish("party-showing7");
