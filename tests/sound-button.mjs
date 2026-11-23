/**
 * One sound button for music and sound effects (Brian, 2026-11-23: "Let's just have one button to turn on music
 * and sound effects? you can look at what the plan was we arrived at for Ostriches"). The Battle Ostriches plan
 * (G Bot #502 to #509): sound is off until the player taps the speaker; the speaker shows a slash while it is
 * off; one tap turns music and sound effects on, started inside that tap (iPhones allow sound only from a tap);
 * another tap turns it off; the choice is saved on the device; if it was left on, the next tap after a reload
 * or a locked phone brings it back. Tapping the game itself never turns sound on.
 *   node tests/sound-button.mjs
 */
import { startGame, sleep } from "./game-page.mjs";

const g = await startGame({ port: 8986, name: "sound-button" });
const PHONE = { width: 375, height: 812, isMobile: true, hasTouch: true };
const { page, ctx, errors } = await g.open("?ch=1", PHONE);
const now = () =>
  page.evaluate(() => {
    const b = document.getElementById("ss-sound");
    let saved = null;
    try {
      saved = localStorage.getItem("ssq-sound");
    } catch {}
    return { ...window.__ss.audio(), icon: window.__ss.soundState(), label: b && b.getAttribute("aria-label"), saved };
  });
const centre = (sel) =>
  page.evaluate((sel) => {
    const el = document.querySelector(sel);
    el && el.scrollIntoView({ block: "center" });
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }, sel);
const tap = async (sel) => {
  const p = await centre(sel);
  await page.touchscreen.touchStart(p.x, p.y);
  await sleep(60);
  await page.touchscreen.touchEnd();
  await sleep(400);
};

await sleep(500);
let s = await now();
g.check("a new player starts with sound off: the speaker shows the slash and says Sound off", s.icon === "muted" && s.label === "Sound off" && s.state !== "running", s);
await tap("canvas");
await tap('[aria-label="Move"]');
s = await now();
g.check("tapping the game and the joystick does not turn sound on", s.icon === "muted" && s.state !== "running", s);
await tap("#ss-sound");
s = await now();
g.check("one tap on the speaker turns sound on: the sound engine runs, the slash goes, it says Sound on", s.state === "running" && s.icon === "on" && s.label === "Sound on" && !s.muted, s);
g.check("the same tap gets the music ready (iPhones only allow it inside a tap)", s.music === true, s);
g.check("the choice is saved on this device", s.saved === "on", s);
// The music really plays while a music moment is on (the title has Joe's theme).
const musicPlays = async (want) => {
  await page.evaluate(() => {
    window.__ss.game.state = "title";
  });
  for (let i = 0; i < 40; i++) {
    const paused = await page.evaluate(() => window.__ss.warmPaused);
    if (paused === !want) return true;
    await sleep(100);
  }
  return false;
};
g.check("with sound on, the music plays", await musicPlays(true), await page.evaluate(() => ({ play: window.__ss.warmPlay, paused: window.__ss.warmPaused })));
await tap("#ss-sound");
s = await now();
g.check("a second tap turns music and sound effects off and saves that", s.icon === "muted" && s.muted && s.saved === "off" && s.label === "Sound off", s);
g.check("with sound off, the music stops", await musicPlays(false), await page.evaluate(() => ({ paused: window.__ss.warmPaused })));
await tap("#ss-sound");
g.check("turned on again, the music plays again", await musicPlays(true), await page.evaluate(() => ({ play: window.__ss.warmPlay, paused: window.__ss.warmPaused })));
// A keyboard player: Enter on the focused speaker, and the M key, do the same as a tap.
await page.focus("#ss-sound");
await page.keyboard.press("Enter");
await sleep(300);
s = await now();
g.check("Enter on the speaker turns sound off", s.muted && s.saved === "off", s);
await page.keyboard.press("KeyM");
await sleep(300);
s = await now();
g.check("the M key turns it back on, and the sound engine runs", !s.muted && s.saved === "on" && s.state === "running", s);

// Left on, then the page is opened again (the same as a locked phone or a new visit): the next tap brings it back.
await page.reload({ waitUntil: "load" });
await sleep(800);
s = await now();
g.check("opened again with sound left on: no sound until a tap", s.state !== "running" && s.saved === "on", s);
await tap("canvas");
s = await now();
g.check("then any tap brings sound back, because it was left on", s.state === "running" && s.icon === "on", s);

// Players from before this change: a saved volume above zero means sound was on.
for (const [vol, want] of [["0.5", "on"], ["1", "on"], ["0", "muted"]]) {
  await page.evaluate((vol) => (localStorage.removeItem("ssq-sound"), localStorage.setItem("ssq-vol", vol)), vol);
  await page.reload({ waitUntil: "load" });
  await sleep(600);
  await tap("canvas");
  s = await now();
  g.check(`an older save of volume ${vol} keeps sound ${want === "on" ? "on" : "off"}`, want === "on" ? s.icon === "on" : s.icon === "muted", s);
}
// The sing-along button (♪) shows only while Squatch can sing, so there is one sound button the rest of the time.
const song = await page.evaluate(async () => {
  const ss = window.__ss,
    n = ss.op,
    shown = () => getComputedStyle(document.getElementById("ss-song")).display !== "none";
  ((ss.game.state = "op"), (n.q = []), (n.cur = null), (n.ctrl = true), (n.ch1Song = false), (n.scene = "Q1"));
  (ss.tick(1 / 30), ss.drawFrame());
  const usual = shown();
  n.ch1Song = true;
  (ss.tick(1 / 30), ss.drawFrame());
  const singing = shown();
  n.ch1Song = false;
  (ss.tick(1 / 30), ss.drawFrame());
  return { usual, singing };
});
g.check("the sing-along button is hidden when there is nothing to sing", song.usual === false, song);
g.check("the sing-along button shows while Squatch can sing along with Mops", song.singing === true, song);
g.check("no page errors", errors.length === 0, errors);
await ctx.close();
await g.finish("sound-button");
