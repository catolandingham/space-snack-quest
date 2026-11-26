/**
 * The morning's music (music-picks.js; Brian's Floating in Space until 2026-11-26, a stand-in with no singing since) (plan section 3, "home-music.js"; Q8 answer 2026-11-23:
 * from the Dog Zylan line until "That evening…", then it fades; Joe's theme stays everywhere else).
 * - Sound off (the default): nothing plays, but the notes still come out of the speaker.
 * - The morning keeps the room quiet before the song (Joe's theme does not play under the speaker).
 * - Sound on: the morning's song (music-picks.js; Goating in Space since 2026-11-26, once, no loop) starts on the tap after "Now here's a classic hit
 *   from Dog Zylan!", never before; it plays as a decoded buffer through the game's master volume (no new
 *   <audio> element) on the music level, turned up 10 dB to sit level with Joe's theme (sound plan section 8);
 *   Joe's theme is quiet while it plays; it dips under each sung line and comes back; the
 *   made-up tune (co) does not play over it; after Mops leaves it keeps playing while Squatch is home alone,
 *   and fades out on "That evening…".
 * - Sound turned on partway through the song step: the recording starts from the top, at background level.
 * Brian 20a (2026-11-23: "I've got sound on but nothing's happening", "not hearing music or snoring"):
 * - Sound on: Joe's theme plays on the title and the first card, through the master volume (so it can fade on
 *   an iPhone, which ignores an <audio> element's volume), then fades out on the "This is Squatch" card.
 * - Soft snoring while Squatch sleeps (the "This is Squatch" card and the quiet room), synthesized through the
 *   master volume; the tap that wakes him stops it and rings a ding-dong before "Good morning, Stormtop!".
 * - Sound off: no theme, no snoring, no ding-dong.
 * Brian, at Mops's song line: "I should be hearing the song before this". The recording's first 3 seconds are
 * nearly silent, so it starts past them, where it is clearly audible, and Mops's line waits until it plays.
 *   node tests/morning-music.mjs
 */
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { startGame, sleep } from "./game-page.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { HOME_MUSIC } = await import(pathToFileURL(join(root, "src", "modules", "home-music.js")).href);
const SKIP = HOME_MUSIC.skip || 0;
const MOPS_SONG = "Floating in space! It's our favorite song!";

const g = await startGame({ port: 8972, name: "morning-music" });
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 };
const SONG = "Now here's a classic hit from Dog Zylan!";

async function open(soundFirst, query = "?ch=1") {
  const { ctx, page, errors } = await g.open(query, PHONE);
  await page.evaluate(() => {
    window.__mm = { starts: [], audios: [], osc: 0 };
    const start = AudioBufferSourceNode.prototype.start;
    AudioBufferSourceNode.prototype.start = function (...a) {
      this.buffer && this.buffer.duration > 5 && window.__mm.starts.push({ dur: this.buffer.duration, offset: a[1] || 0, loop: this.loop });
      return start.apply(this, a);
    };
    const A = window.Audio;
    window.Audio = function (src) {
      window.__mm.audios.push(String(src || ""));
      return new A(src);
    };
    const osc = (window.AudioContext || window.webkitAudioContext).prototype.createOscillator;
    (window.AudioContext || window.webkitAudioContext).prototype.createOscillator = function () {
      window.__mm.osc++;
      return osc.call(this);
    };
  });
  if (soundFirst) await page.click("#ss-sound");
  const box = await page.evaluate(() => {
    const r = document.querySelector("canvas").getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  });
  const tap = async (x = 480, y = 320) => {
    await page.touchscreen.tap(box.x + (x / 960) * box.w, box.y + (y / 640) * box.h);
    await sleep(350);
  };
  const st = () =>
    page.evaluate(() => {
      const n = window.__ss.op,
        c = n.cur,
        m = window.SSQ.homeMusic.debug();
      const ms = window.SSQ.morningSound ? window.SSQ.morningSound.debug() : null;
      return { state: window.__ss.game.state, k: c ? c.k : "", id: c ? c.id || "" : "", text: c ? (c.b ? c.b.text : c.text || "") : "", style: c && c.b ? c.b.style : "", ctrl: n.ctrl, chip: window.__ss.chipNow(), m, ms, mm: window.__mm, warmCue: window.__ss.warmCue, warmPaused: window.__ss.warmPaused, warmVia: window.__ss.warmVia, fx: window.SSQ.beat("ch1-morning").debug().fx };
    });
  return { ctx, page, errors, tap, st };
}

// Taps through the morning until `stop(state)` is true; returns the state.
async function tapUntil(r, stop, max = 60) {
  let s = await r.st();
  for (let i = 0; i < max && !stop(s); i++) {
    if (["card", "bub", "wait", "cutaway"].includes(s.k)) await r.tap();
    else await sleep(250);
    s = await r.st();
  }
  return s;
}
const waitFor = async (r, ok, ms = 8000) => {
  let s = await r.st();
  for (let t = 0; t < ms && !ok(s); t += 200) (await sleep(200), (s = await r.st()));
  return s;
};

// ---------- Sound off ----------
{
  const r = await open(false);
  let s = await tapUntil(r, (s) => s.ctrl && !!s.chip);
  g.check("sound off: the song step comes with no recording playing", !s.m.playing && s.mm.starts.length === 0, s.m);
  g.check("sound off: the notes still come out of the speaker", s.fx === "notes", s.fx);
  g.check("sound off: the morning still owns the room's music (Joe's theme stays off)", s.m.owns === true, s.m);
  g.check("sound off: no snoring and no ding-dong", !!s.ms && s.ms.breaths === 0 && s.ms.chimes === 0, s.ms);
  g.check("no page errors (sound off)", r.errors.length === 0, r.errors);
  await r.ctx.close();
}

// ---------- Sound on: the title, the cards, the snoring and the ding-dong (Brian 20a) ----------
{
  // The title screen (no ?ch link): turn sound on with the speaker, then tap the Chapter 1 card.
  const r = await open(true, "");
  let s = await waitFor(r, (s) => s.warmPaused === false, 6000);
  g.check("sound on: Joe's theme plays on the title", s.state === "title" && s.warmCue === "title" && s.warmPaused === false, s);
  g.check("Joe's theme plays through the master volume (it can fade on an iPhone)", s.warmVia === "gain", s.warmVia);
  await r.tap(148, 540);
  s = await waitFor(r, (s) => s.k === "card", 3000);
  g.check("it keeps playing on the first card (Stormtop Cloud Resort)", s.k === "card" && s.id === "jupiter" && s.warmCue !== "" && s.warmPaused === false, s);
  g.check("no snoring on the first card", !!s.ms && !s.ms.snoring, s.ms);
  await r.tap();
  s = await waitFor(r, (s) => s.warmPaused !== false && s.ms && s.ms.breaths > 0, 6000);
  g.check('on "This is Squatch" the theme fades out and he snores softly', s.k === "card" && s.id === "squatch" && s.warmPaused !== false && s.ms.snoring && s.ms.breaths > 0, s);
  g.check("the snoring plays through the sound-effects level, under the game's master volume", s.ms.via === "effects", s.ms);
  await r.tap();
  s = await waitFor(r, (s) => s.k === "wait", 3000);
  const b0 = s.ms.breaths;
  s = await waitFor(r, (s) => s.ms.breaths > b0, 6000);
  g.check("he keeps snoring in the quiet room until the tap", s.k === "wait" && s.ms.snoring && s.ms.breaths > b0, s.ms);
  const osc0 = s.mm.osc;
  await r.tap();
  s = await r.st();
  g.check("the tap that wakes him stops the snoring and rings the ding-dong", !s.ms.snoring && s.ms.chimes === 1 && s.mm.osc > osc0, { ms: s.ms, osc: s.mm.osc - osc0 });
  g.check('the ding-dong comes before "Good morning, Stormtop!"', s.k !== "bub", s);
  s = await waitFor(r, (s) => s.k === "bub", 3000);
  g.check('then "Good morning, Stormtop!"', /^Good morning, Stormtop!/.test(s.text), s.text);
  g.check("no Joe's theme under the speaker", s.warmPaused !== false, s);
  g.check("no page errors (title and snoring)", r.errors.length === 0, r.errors);
  await r.ctx.close();
}

// ---------- Leaving for the title while he snores: the snoring stops ----------
{
  const r = await open(true);
  let s = await tapUntil(r, (s) => s.k === "card" && s.id === "squatch", 10);
  s = await waitFor(r, (s) => s.ms && s.ms.snoring, 4000);
  g.check("he snores on the \"This is Squatch\" card", s.ms.snoring, s.ms);
  await r.page.evaluate(() => (window.__ss.game.state = "title"));
  s = await waitFor(r, (s) => s.ms && !s.ms.snoring, 3000);
  g.check("back on the title, the snoring stops", s.state === "title" && !s.ms.snoring, s);
  g.check("no page errors (snoring stops off the game screen)", r.errors.length === 0, r.errors);
  await r.ctx.close();
}

// ---------- The recording's quiet start (Brian: "I should be hearing the song before this") ----------
{
  const { ctx, page } = await g.open("?ch=1", PHONE);
  const lv = await page.evaluate(async (skip, url) => {
    const data = await (await fetch(url)).arrayBuffer();
    const ac = new OfflineAudioContext(1, 22050, 22050);
    const b = await ac.decodeAudioData(data);
    const ch = b.getChannelData(0);
    const db = (t0, t1) => {
      let sum = 0, n = 0;
      for (let i = Math.floor(t0 * b.sampleRate); i < Math.min(ch.length, t1 * b.sampleRate); i++) (sum += ch[i] * ch[i]), n++;
      return 10 * Math.log10(sum / Math.max(1, n) + 1e-12);
    };
    return { intro: skip > 0 ? db(0, Math.min(2.5, skip)) : null, atStart: db(skip, skip + 0.6), skip, dur: b.duration };
  }, SKIP, HOME_MUSIC.url);
  // (Goating in Space starts at once, so it plays from 0; a file with a quiet start skips it)
  g.check("before where it starts, the file is nearly silent (or it starts at 0)", SKIP === 0 || lv.intro < -45, lv);
  g.check("it starts where the music is clearly audible", lv.atStart > -35, lv);
  await ctx.close();
}

// ---------- Sound on from the start ----------
{
  const r = await open(true);
  let s = await tapUntil(r, (s) => s.k === "bub" && s.text === SONG);
  g.check("sound on: nothing of the recording plays before the Dog Zylan line is tapped", s.mm.starts.length === 0 && !s.m.playing, s);
  g.check("the morning keeps the room quiet before the song (no Joe's theme under the speaker)", s.m.owns && s.warmCue === "", s);
  await r.tap();
  const atLine = await r.page.evaluate(async (want) => {
    const n = window.__ss.op;
    for (let i = 0; i < 400 && !(n.cur && n.cur.b && n.cur.b.text === want); i++) await new Promise((ok) => setTimeout(ok, 15));
    return window.SSQ.homeMusic.debug();
  }, MOPS_SONG);
  g.check("the song has been playing for over a second before Mops's \"Floating in space!\" line",atLine.playing && atLine.playedFor >= 1.2, atLine);
  s = await waitFor(r, (s) => s.m.playing);
  g.check("the tap after the Dog Zylan line starts the morning's music (Goating in Space, 1:44, the whole file loaded), from its start, once (no loop)", s.m.playing && s.mm.starts.length === 1 && Math.abs(s.mm.starts[0].dur - 103.96) < 1 && Math.abs(s.mm.starts[0].offset - SKIP) < 0.01 && s.mm.starts[0].loop === false && s.m.once, s.mm.starts);
  g.check("it plays through the music level under the game's master volume, not a new <audio> element", s.m.via === "music" && !s.mm.audios.some((a) => /goating/.test(a)), { via: s.m.via, audios: s.mm.audios });
  g.check("first play at full level", Math.abs(s.m.target - 1) < 0.01, s.m);
  // Sound plan section 8: each file is turned up to sit level with Joe's theme (Floating in Space by 10 dB; ffmpeg:
  // -27.1 against -17.1 LUFS); the morning's pick is in music-picks.js.
  g.check("the morning's music is turned up to sit level with Joe's theme (its file's match)", Math.abs(s.m.gain - HOME_MUSIC.match) < 0.01, [s.m, HOME_MUSIC.match]);
  s = await waitFor(r, (s) => s.warmPaused !== false, 3000);
  g.check("Joe's theme is quiet while the recording plays", s.warmCue === "" && s.warmPaused !== false && s.m.playing, { warmCue: s.warmCue, warmPaused: s.warmPaused });
  s = await tapUntil(r, (s) => s.ctrl && !!s.chip);
  // Sing.
  const btn = await r.page.evaluate(() => {
    const b = document.querySelector('[role="button"]').getBoundingClientRect();
    return [b.x + b.width / 2, b.y + b.height / 2];
  });
  const osc0 = (await r.st()).mm.osc;
  await r.page.touchscreen.tap(btn[0], btn[1]);
  s = await waitFor(r, (s) => s.k === "bub" && s.style === "song", 4000);
  await sleep(500);
  s = await r.st();
  g.check("the recording dips under Squatch's sung line", s.m.target < 0.5 && s.m.playing, s.m);
  g.check("the made-up tune does not play over the recording", s.mm.osc - osc0 < 15, s.mm.osc - osc0);
  s = await tapUntil(r, (s) => s.k === "bub" && s.style !== "song", 10);
  await sleep(300);
  s = await r.st();
  g.check("and comes back up after the singing", s.m.target >= s.m.background - 0.01 && s.m.target > 0.35, s.m);
  // Mops leaves; Squatch is home alone (src/modules/home-alone.js) until he does his homework.
  s = await tapUntil(r, (s) => s.ctrl && /homework/.test(s.chip));
  await sleep(1500);
  s = await r.st();
  g.check("it keeps playing while Squatch is home alone", /homework/.test(s.chip) && s.m.playing && s.m.owns, { chip: s.chip, m: s.m });
  await r.page.evaluate(() => (window.__ss.spotsNow() || []).find((x) => x.id === "homework").f());
  s = await tapUntil(r, (s) => s.k === "card");
  g.check('it is still playing after the homework when "That evening…" comes up', /^That evening/.test(s.text) && s.m.playing && s.m.owns, { text: s.text, m: s.m });
  s = await waitFor(r, (s) => !s.m.playing && !s.m.owns, 5000);
  g.check('it fades out on "That evening…" and gives the room back to Joe\'s theme', !s.m.playing && !s.m.owns, s.m);
  g.check("no page errors (sound on)", r.errors.length === 0, r.errors);
  await r.ctx.close();
}

// ---------- Sound turned on partway through ----------
{
  const r = await open(false);
  let s = await tapUntil(r, (s) => s.ctrl && !!s.chip);
  await r.page.click("#ss-sound");
  s = await waitFor(r, (s) => s.m.playing);
  g.check("sound turned on during the song: the recording starts from the top at background level", s.m.playing && s.mm.starts.length === 1 && Math.abs(s.mm.starts[0].offset - SKIP) < 0.01 && Math.abs(s.m.target - s.m.background) < 0.01, s);
  g.check("no page errors (sound on later)", r.errors.length === 0, r.errors);
  await r.ctx.close();
}
await g.finish("morning-music");
