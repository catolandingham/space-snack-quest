/**
 * Brian's Floating in Space recording in the morning (plan section 3, "home-music.js"; Q8 answer 2026-11-23:
 * from the Dog Zylan line until "That evening…", then it fades; Joe's theme stays everywhere else).
 * - Sound off (the default): nothing plays, but the notes still come out of the speaker.
 * - Sound on: the recording music/floating-in-space.mp3 starts on the tap after "Now here's a classic hit
 *   from Dog Zylan!", never before; it plays as a decoded buffer through the game's master volume (no new
 *   <audio> element); Joe's theme is quiet while it plays; it dips under each sung line and comes back; the
 *   made-up tune (co) does not play over it; after Mops leaves it fades out on "That evening…".
 * - Sound turned on partway through the song step: the recording starts from the top, at background level.
 *   node tests/morning-music.mjs
 */
import { startGame, sleep } from "./game-page.mjs";

const g = await startGame({ port: 8972, name: "morning-music" });
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 1 };
const SONG = "Now here's a classic hit from Dog Zylan!";

async function open(soundFirst) {
  const { ctx, page, errors } = await g.open("?ch=1", PHONE);
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
  const tap = async () => {
    await page.touchscreen.tap(box.x + box.w / 2, box.y + box.h / 2);
    await sleep(350);
  };
  const st = () =>
    page.evaluate(() => {
      const n = window.__ss.op,
        c = n.cur,
        m = window.SSQ.homeMusic.debug();
      return { k: c ? c.k : "", text: c ? (c.b ? c.b.text : c.text || "") : "", style: c && c.b ? c.b.style : "", ctrl: n.ctrl, chip: window.__ss.chipNow(), m, mm: window.__mm, warmCue: window.__ss.warmCue, warmPaused: window.__ss.warmPaused, fx: window.SSQ.beat("ch1-morning").debug().fx };
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
  g.check("no page errors (sound off)", r.errors.length === 0, r.errors);
  await r.ctx.close();
}

// ---------- Sound on from the start ----------
{
  const r = await open(true);
  let s = await tapUntil(r, (s) => s.k === "bub" && s.text === SONG);
  g.check("sound on: nothing of the recording plays before the Dog Zylan line is tapped", s.mm.starts.length === 0 && !s.m.playing && !s.m.owns, s);
  await r.tap();
  s = await waitFor(r, (s) => s.m.playing);
  g.check("the tap after the Dog Zylan line starts the recording (32.6 s, from the top)", s.m.playing && s.mm.starts.length === 1 && Math.abs(s.mm.starts[0].dur - 32.6) < 0.5 && s.mm.starts[0].offset === 0, s.mm.starts);
  g.check("it plays through the game's master volume, not a new <audio> element", s.m.via === "master" && !s.mm.audios.some((a) => /floating/.test(a)), { via: s.m.via, audios: s.mm.audios });
  g.check("first play at full level", Math.abs(s.m.target - 1) < 0.01, s.m);
  g.check("Joe's theme is quiet while the recording plays", s.warmCue === "" && s.warmPaused !== false, { warmCue: s.warmCue, warmPaused: s.warmPaused });
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
  await r.tap();
  s = await waitFor(r, (s) => s.k === "bub" && s.style !== "song", 4000);
  await sleep(300);
  s = await r.st();
  g.check("and comes back up after the singing", s.m.target > 0.5, s.m);
  s = await tapUntil(r, (s) => s.k === "card");
  g.check('it is still playing when Mops is gone and "That evening…" comes up', /^That evening/.test(s.text), s.text);
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
  g.check("sound turned on during the song: the recording starts from the top at background level", s.m.playing && s.mm.starts.length === 1 && s.mm.starts[0].offset === 0 && Math.abs(s.m.target - s.m.background) < 0.01, s);
  g.check("no page errors (sound on later)", r.errors.length === 0, r.errors);
  await r.ctx.close();
}
await g.finish("morning-music");
