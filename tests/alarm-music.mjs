/**
 * When the alarm goes off, the music stops (Brian, 2026-11-26, notes on the lunch video: "when alarm goes off, I
 * presume music should stop"). The alarm's own sound and the FUR! sting still play (they are sound effects). The
 * music stays quiet in that place after the alarm, and comes back only with a visit to another place, which plays
 * what the music table (src/modules/music-picks.js) picks there.
 *   1. music-picks.js on its own: a place's music plays; hushNow stops it at once; it stays stopped while the cue
 *      leaves and comes back to the same place; a visit to another place plays that place's pick.
 *   2. In the game: while any beat's alarm is on (its alarmOn), the music's cue is nothing; the older program's alarm
 *      sound (window.SSQ.alarmSound) hushes it too; at the party the alarm stops the music the same way.
 *   node tests/alarm-music.mjs
 */
import { join } from "node:path";
import { startGame, root } from "./game-page.mjs";

const P = await import(join(root, "src", "modules", "music-picks.js"));
const g = await startGame({ port: 9749, name: "alarm-music" });

// ---------- 1. the rule in music-picks.js ----------
{
  P.newVisits();
  // a stand-in for the music element: its file and where it is in it
  const el = { src: "", currentTime: 0, ended: false, paused: false };
  const frame = (cue, t) => (P.seeCue(cue, t), P.keepInSpan(el, cue));
  frame("sneak", 0);
  frame("sneak", 1.5); // (a new visit starts the track: the first frame is quiet while it seeks)
  el.currentTime = 5;
  const playing = frame("sneak", 2);
  P.hushNow();
  el.currentTime = 6;
  const atAlarm = frame("sneak", 2.1),
    hushAt = P.hushed();
  // the alarm is over: the cue goes quiet for a while, then back to the same place
  frame("", 3);
  frame("", 4.5);
  frame("sneak", 5);
  frame("sneak", 6.5);
  el.currentTime = 7;
  const samePlace = frame("sneak", 7);
  // a visit to another place
  frame("hall", 8);
  frame("hall", 9.5);
  el.currentTime = 2;
  const nextPlace = frame("hall", 10);
  const now = P.visitNow();
  g.check("1: the sneak's music plays (Sneaky Snitch) before the alarm", playing > 0 && P.fileFor("sneak") === "music/sneaky-snitch.mp3", { playing });
  g.check("1: the alarm stops the music at once", atAlarm === 0 && !!hushAt && hushAt.place === "sneak", { atAlarm, hushAt });
  g.check("1: after the alarm it stays quiet in the same place, even when the cue goes away and comes back", samePlace === 0, { samePlace });
  g.check("1: a visit to another place brings the music back with that place's pick (the empty hall: Lobby Time)", nextPlace > 0 && now.file === "music/lobby-time.mp3" && !P.hushed(), { nextPlace, now });
  P.newVisits();
}

// ---------- 2. in the game ----------
const { page, errors } = await g.open("?ch=1", { width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
await page.evaluate(() => window.__ss.lockedReady);
await new Promise((r) => setTimeout(r, 1200));
await page.click("#ss-sound");
await new Promise((r) => setTimeout(r, 600));
const game = await page.evaluate(() => {
  const S = window.SSQ,
    out = {};
  let on = false;
  // a beat with an alarm (as the party's and the lunch sneak's alarmOn)
  S.registerBeat("test-alarm", { alarmOn: () => on });
  out.before = S.refinedCue("hall");
  on = true;
  out.during = S.refinedCue("hall");
  out.duringHome = S.refinedCue("home");
  on = false;
  out.after = S.refinedCue("hall");
  out.soundOn = S.engine().soundState() === "on";
  out.alarmPlays = S.alarmSound();
  out.hushedByAlarmSound = S.musicNow().hush;
  out.partyHasRule = typeof S.beat("ch1-party").alarmOn === "function";
  return out;
});
g.check("2: while a beat's alarm is on, the music's cue is nothing (in the hall and at home); before and after, the place's own", game.before === "hall" && game.during === "" && game.duringHome === "" && game.after === "hall", game);
g.check("2: the older program's alarm sound plays (sound on) and hushes the music", game.soundOn && game.alarmPlays === true && game.hushedByAlarmSound === true, game);
// the party's own alarm answers the same question (its musicCue was already nothing during the alarm)
const party = await page.evaluate(() => {
  const beat = window.SSQ.beat("ch1-party");
  return { has: !!beat, on: beat.alarmOn() };
});
g.check("2: the party night answers whether its alarm is on (alarmOn), so the same rule stops its music", game.partyHasRule && party.has && party.on === false, { game, party });
g.check("no page errors", errors.length === 0, errors);
await page.close();
await g.finish("alarm-music");
