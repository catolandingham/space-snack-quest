/**
 * The morning's and home alone's sounds (Brian 2026-11-24, "34(A)": every MY PICK on the sound board; "31a";
 * the sound plan, sections 1 to 4, 8 and 9). Plays Chapter 1 from its first card to "That evening…" on a phone,
 * and records which sound starts at which moment (src/modules/morning-sound.js keeps a log of every sound that
 * really played).
 * - Sound on: snoring (with its whistle) on "This is Squatch" and in the quiet room, the soft mop strokes (a
 *   swish, no squeak) only in the quiet room; the ding-dong on the tap; a soft tick on every spoken bubble and none on sung ones;
 *   Mops's "meh" only on his first line ("Morning, Squatch."), never on a later one or while his song plays;
 *   four mop strokes as he mops along to his bucket (one a step, stopping at the bucket); the dunk's bloop,
 *   glug glug, drips, timed to its picture; the wring's twists; the beard's squirt on a tap, and the grumpy
 *   "meh-EH!" under "Hey, stop that!" with the wringing sounds quiet meanwhile; the beard shake; hooves as he
 *   walks out, then the station door; home alone: the closet door opening and shutting, the bed flop, the
 *   calendar's rustle, the homework's scribbles and the sheet's rustle, and the "That evening…" whoosh.
 * - The old click on every bubble and the baa on every Mops line are gone.
 * - Sound off (the default): no sound engine is ever made, and the log stays empty.
 * - Levels (sound plan section 8): music and sound effects have their own levels under the master; a bubble
 *   tick is well under Brian's recording at its background level (6 dB at least).
 *   node tests/sound-cues.mjs
 */
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { startGame, sleep } from "./game-page.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { MORNING_LINES } = await import(pathToFileURL(join(root, "src", "modules", "morning-lines.js")).href);
const { MIX } = await import(pathToFileURL(join(root, "src", "modules", "sound-mix.js")).href);
const { HOME_MUSIC } = await import(pathToFileURL(join(root, "src", "modules", "home-music.js")).href);
const L = Object.fromEntries(MORNING_LINES.map((l) => [l.id, l.text]));
const g = await startGame({ port: 8957, name: "sound-cues" });
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 };

async function open(soundOn) {
  const { ctx, page, errors } = await g.open("?ch=1", PHONE);
  await page.evaluate(() => {
    window.__ctxMade = 0;
    const A = window.AudioContext || window.webkitAudioContext;
    const Wrapped = function (...a) {
      window.__ctxMade++;
      return new A(...a);
    };
    Wrapped.prototype = A.prototype;
    window.AudioContext = Wrapped;
    window.webkitAudioContext = Wrapped;
  });
  if (soundOn) await page.click("#ss-sound");
  return { ctx, page, errors };
}

// Plays the morning in the page from the first card to "That evening…", tapping every waiting step (NEXT), the
// glowing beard once, and in home alone the closet, the bed, the calendar and then the homework. Every sound in
// the log is written down with what was up when it played.
const playAll = (page, lines) =>
  page.evaluate(async (lines) => {
    const ss = window.__ss,
      n = ss.op,
      snd = window.SSQ.morningSound,
      beat = window.SSQ.beat("ch1-morning"),
      seen = [],
      dt = 1 / 30;
    let had = 0,
      tapped = false,
      roomWait = 0;
    const where = () => {
      const c = n.cur,
        m = n.ch1Morning;
      return {
        step: m ? m.step : "",
        k: c ? c.k : "",
        id: c ? (c.k === "cutaway" ? c.id + ":" + c.panel : c.id || "") : "",
        text: c && c.b ? c.b.text : c ? c.text || "" : "",
        style: c && c.b ? c.b.style : "",
        // A picture's sound plays in the frame its time is reached; that frame's tick has already moved the
        // picture's time on by one frame (dt) when this is read, so the time it played at is el - dt.
        el: c && c.k === "cutaway" ? Math.round(((c.el || 0) - dt) * 1000) / 1000 : null,
        look: m && m.look ? m.look + ":" + (m.phase || "") : "",
        cal: !!n.ch1Calendar,
        song: window.SSQ.homeMusic.debug().playing,
      };
    };
    const note = () => {
      const log = snd.debug().log;
      for (; had < log.length; had++) seen.push({ ...log[had], ...where() });
    };
    const tick = async (secs) => {
      for (let t = 0; t < secs; t += dt) {
        ss.tick(dt);
        note();
        // The song waits for the recording to really play (real time, not game ticks).
        n.cur && n.cur.k === "until" && (await new Promise((ok) => setTimeout(ok, 8)));
      }
    };
    const next = async (pause) => {
      await tick(pause || 0.6);
      n.bt = 1;
      ss.opTap();
      note();
    };
    const realUntil = performance.now() + 60000;
    // The cards, the room, the morning, up to the song step.
    for (let i = 0; i < 4000 && !(n.ctrl && n.ch1Morning && n.ch1Morning.step === "song") && performance.now() < realUntil; i++) {
      const c = n.cur;
      if (c && c.k === "wait") {
        // The quiet room: let a few breaths and mop strokes play before the tap (the snoring keeps real time).
        // Mops goes round his loop meanwhile (src/modules/mop-loop.js; its sounds: tests/morning-mop-loop.mjs),
        // so the tap comes when he is back at the door end of his stretch, a full stretch from his bucket.
        const lp = beat.debug().loop;
        roomWait < 4 || !(lp && lp.round >= 1 && lp.ph === "down") ? ((roomWait += dt), await tick(dt), roomWait < 4 && (await new Promise((ok) => setTimeout(ok, dt * 1000)))) : await next(0.1);
      } else if (c && c.k === "cutaway" && c.auto) await tick(dt);
      else if (c && c.k === "cutaway" && c.id === "beard" && c.panel === 1 && !tapped) {
        // Tap just before a loop ends, so a twist falls while the water flies (it must be skipped, not played late).
        await tick(2.6);
        const b = beat.debug().beard;
        // The tap's squirt plays as the picture gives way to the water flying over it: note it as played on
        // the picture that was tapped.
        const on = where();
        beat.pictureTap((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2);
        tapped = true;
        const from = seen.length;
        note();
        seen.slice(from).forEach((x) => Object.assign(x, { k: on.k, id: on.id, el: on.el }));
        // The water lands, then Mops says his line over the picture.
        await tick(1.2);
      } else if (c && ["card", "bub", "wait", "cutaway"].includes(c.k)) await next(0.6);
      else await tick(dt);
    }
    // Sing, the goodbye, the walk out.
    (ss.spotsNow() || []).find((s) => s.id === "sing").f();
    for (let i = 0; i < 3000 && !(n.ctrl && n.ch1Morning && n.ch1Morning.step === "home" && !n.cur); i++) {
      if (n.cur && ["card", "bub", "wait"].includes(n.cur.k)) await next(0.6);
      else await tick(dt);
    }
    // Home alone: the closet, the bed, the calendar, then the homework.
    const use = async (id, done) => {
      const s = (ss.spotsNow() || []).find((x) => x.id === id);
      if (!s) return false;
      s.f();
      for (let i = 0; i < 600 && !done(); i++) n.cur && ["bub", "card"].includes(n.cur.k) ? await next(0.6) : await tick(dt);
      return true;
    };
    const free = () => n.ctrl && !n.cur && n.ch1Morning && n.ch1Morning.step === "home" && !n.ch1Morning.look && !n.ch1Calendar;
    await use("closet", free);
    await use("bed", free);
    n.sq.x = 230;
    n.sq.y = 392;
    await tick(0.2);
    const cal = await use("home-calendar", () => !!n.ch1Calendar);
    cal && (await tick(1), ss.opTap(), await tick(0.3));
    note();
    (ss.spotsNow() || []).find((s) => s.id === "homework").f();
    for (let i = 0; i < 2000 && !(n.cur && n.cur.k === "card" && n.cur.text === lines.evening); i++)
      n.cur && n.cur.k === "cutaway" && !n.cur.auto ? await next(1) : await tick(dt);
    await tick(1);
    return { seen, cal, end: where(), debug: snd.debug() };
  }, lines);

// ---------- Sound on ----------
const on = await open(true);
await sleep(300);
const R = await playAll(on.page, { evening: L["card-evening"] });
const S = R.seen;
const at = (pred) => S.filter(pred);
const names = (list) => list.map((x) => x.name);
const firstAt = (name) => S.findIndex((x) => x.name === name);
// Played in the first frame (1/30 s) at or after `want` seconds into the picture.
const inFrame = (el, want) => el >= want - 0.001 && el <= want + 1 / 30 + 0.001;

g.check("sound on: the morning was played to the \"That evening…\" card", R.end.k === "card" && R.end.text === L["card-evening"], R.end);
{
  const sq = at((x) => x.name === "snore");
  g.check('the snore plays on "This is Squatch" and in the quiet room, and stops once he wakes', sq.length >= 2 && sq.every((x) => x.step === "asleep") && sq.some((x) => x.k === "card") && sq.some((x) => x.k === "wait"), sq);
  const soft = at((x) => x.name === "mopSoft");
  g.check("the soft mop strokes play only in the quiet room (under the snore)", soft.length >= 3 && soft.every((x) => x.k === "wait" && x.step === "asleep"), soft);
  g.check("the ding-dong plays once, on the tap in the quiet room, before the speaker's first words", at((x) => x.name === "dingDong").length === 1 && firstAt("dingDong") < S.findIndex((x) => x.text === L["speaker-party"]), names(S.slice(0, 20)));
}
{
  // Every spoken bubble ticks (the tick plays as the bubble opens); sung bubbles do not.
  const ticks = at((x) => x.name === "tick");
  const spoken = ["speaker-party", "speaker-invite", "mops-morning", "sq-party", "speaker-song", "mops-song", "mops-work", "mops-stay", "mops-stop"].map((id) => L[id]);
  const missing = spoken.filter((t) => !ticks.some((x) => x.text === t));
  g.check("a soft tick plays on every spoken bubble", missing.length === 0, missing);
  g.check("no tick on a sung line (Brian's recording plays under it)", !ticks.some((x) => x.style === "song"), ticks.filter((x) => x.style === "song"));
  const mehs = at((x) => x.name === "meh");
  g.check('Mops\'s "meh" plays once, on his first line ("Morning, Squatch."), never on a later line or over his song', mehs.length === 1 && mehs[0].text === L["mops-morning"] && !mehs[0].song, mehs);
  const old = at((x) => x.name === "baa" || x.name === "key");
  g.check("the old click and the baa on every Mops line are gone", old.length === 0, old);
}
{
  const mop = at((x) => x.name === "mop");
  g.check('"swish, squeak" as Mops mops along: four strokes, one a step, all while he walks to the bucket', mop.length === 4 && mop.every((x) => x.step === "mopping"), mop);
  const dunk = at((x) => x.id === "beard:0");
  g.check(
    "the dunk: bloop, glug glug, drips, twice, timed to the picture (bloop at 0.54 s and 2.34 s, within a frame)",
    JSON.stringify(names(dunk)) === JSON.stringify(["bloop", "glug", "glug", "drips", "bloop", "glug", "glug", "drips"]) && inFrame(dunk[0].el, 0.54) && inFrame(dunk[4].el, 2.34),
    dunk,
  );
  const wring = at((x) => x.id === "beard:1" && x.name === "twist");
  g.check("the wring: a twisting squeak with the pour, at the start of each twist", wring.length >= 2 && inFrame(wring[0].el, 0) && inFrame(wring[1].el, 1.0), wring);
  const sq = at((x) => x.name === "squirt");
  g.check("Brian 31a: a tap on the beard plays the squirt (pssht, splat), once for one tap", sq.length === 1 && sq[0].id === "beard:1", sq);
  const gr = at((x) => x.name === "grumpy");
  g.check('Brian 31a: the grumpy "meh-EH!" plays under "Hey, stop that!" (not the meh)', gr.length === 1 && gr[0].text === L["mops-stop"], gr);
  const i = firstAt("squirt"),
    j = S.findIndex((x) => x.name === "grumpy");
  const between = S.slice(i + 1, j).filter((x) => x.id === "beard:1" && x.name !== "tick");
  g.check("the wringing sounds are quiet from the squirt until his line", i >= 0 && j > i && between.length === 0, between);
  // Every wringing sound plays on its beat in the 2.8 s loop (within a frame), also once the picture comes back
  // after his line: none saved up from the skipped stretch.
  const BEATS = { twist: [0, 1.0], plink: [2.2], plinkSoft: [2.55] };
  const late = at((x) => x.id === "beard:1" && BEATS[x.name]).filter((x) => !BEATS[x.name].some((b) => inFrame(x.el, b + 2.8 * Math.floor((x.el - b + 0.001) / 2.8))));
  g.check("every wringing sound plays on its beat, none late after his line", late.length === 0 && at((x) => x.id === "beard:1" && BEATS[x.name]).length >= 3, late);
  g.check("the beard shake plays once, back in the room", at((x) => x.name === "shake").length === 1 && at((x) => x.name === "shake")[0].step === "shake", at((x) => x.name === "shake"));
  const hooves = at((x) => x.name === "hoof");
  g.check("hooves clip clop as Mops walks out (one every quarter second)", hooves.length >= 4 && hooves.every((x) => x.step === "leave"), hooves.length);
  const door = at((x) => x.name === "door");
  g.check("then the station door, once, as he goes out", door.length === 1 && firstAt("door") > S.findIndex((x) => x.name === "hoof"), door);
}
{
  const open1 = at((x) => x.name === "closetOpen"),
    shut = at((x) => x.name === "closetShut");
  g.check("home alone: the closet door creaks open, and bumps shut after his line", open1.length === 1 && shut.length === 1 && firstAt("closetShut") > firstAt("closetOpen"), { open1, shut });
  g.check("home alone: the flop plays once as he lands on the bed", at((x) => x.name === "flop").length === 1 && /^bed:/.test(at((x) => x.name === "flop")[0].look), at((x) => x.name === "flop"));
  g.check("home alone: the calendar close-up rustles as it opens", R.cal && at((x) => x.name === "rustle" && x.cal).length === 1, { cal: R.cal, rustle: at((x) => x.name === "rustle") });
  const desk = at((x) => x.id === "homework:0");
  g.check("homework: a pencil scribble for each line he writes (three in the desk picture)", JSON.stringify(names(desk)) === JSON.stringify(["scribble", "scribble", "scribble"]), desk);
  g.check("homework: a paper rustle as the sheet comes up close", at((x) => x.id === "homework:1" && x.name === "rustle").length === 1, at((x) => x.id === "homework:1"));
  const eve = at((x) => x.name === "evening");
  g.check('"That evening…": the soft whoosh and bell notes play once, as the card comes up', eve.length === 1 && eve[0].k === "card" && eve[0].text === L["card-evening"], eve);
}
// Levels (sound plan section 8).
{
  const lv = await on.page.evaluate(async (skip, end, url) => {
    const e = window.SSQ.engine();
    const data = await (await fetch(url)).arrayBuffer();
    const ac = new OfflineAudioContext(1, 22050, 22050);
    const b = await ac.decodeAudioData(data);
    const ch = b.getChannelData(0);
    let sum = 0,
      k = 0;
    for (let i = Math.floor(skip * b.sampleRate); i < Math.min(ch.length, end * b.sampleRate); i++) ((sum += ch[i] * ch[i]), k++);
    return {
      music: e.musicGain() && e.musicGain().gain.value,
      fx: e.fxGain() && e.fxGain().gain.value,
      distinct: e.musicGain() !== e.fxGain() && e.musicGain() !== e.masterGain(),
      songRms: Math.sqrt(sum / k),
      tick: await window.SSQ.morningSound.measure("tick"),
    };
  }, HOME_MUSIC.skip, HOME_MUSIC.loopEnd, HOME_MUSIC.url);
  g.check("music and sound effects each have their own level under the master", lv.distinct && Math.abs(lv.music - MIX.music) < 1e-6 && Math.abs(lv.fx - MIX.effects) < 1e-6, lv);
  const bg = lv.songRms * HOME_MUSIC.background * HOME_MUSIC.match * MIX.music,
    db = 20 * Math.log10(bg / lv.tick.rms);
  g.check("a bubble tick sits well under the morning's music at its background level (6 dB or more)", db >= 6, { db: Math.round(db * 10) / 10, tickRms: lv.tick.rms, songBg: bg });
}
g.check("no page errors (sound on)", on.errors.length === 0, on.errors);
await on.ctx.close();

// ---------- Sound off ----------
{
  const off = await open(false);
  const r = await playAll(off.page, { evening: L["card-evening"] });
  const made = await off.page.evaluate(() => window.__ctxMade);
  g.check("sound off: the morning still plays to \"That evening…\"", r.end.k === "card" && r.end.text === L["card-evening"], r.end);
  g.check("sound off: no sound engine is made and nothing plays", made === 0 && r.seen.length === 0 && r.debug.log.length === 0 && r.debug.breaths === 0 && r.debug.chimes === 0, { made, seen: r.seen.length });
  g.check("no page errors (sound off)", off.errors.length === 0, off.errors);
  await off.ctx.close();
}
await g.finish("sound-cues");
