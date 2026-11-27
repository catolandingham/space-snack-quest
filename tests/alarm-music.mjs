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
  P.hushNow(2);
  el.currentTime = 6;
  const atAlarm = frame("sneak", 2.1),
    hushAt = P.hushed();
  // the alarm goes on (no music cue while it is on; it keeps the hush), then it is over and the cue is back here
  for (let t = 2.2; t < 6; t += 0.1) (P.hushNow(t), frame("", t));
  frame("sneak", 6.1);
  frame("sneak", 7.6);
  el.currentTime = 7;
  const samePlace = frame("sneak", 8);
  // he goes through a door to a place with no music (the hallway), then comes back: the place's music plays again
  frame("", 8.2);
  frame("", 9.7);
  const quietPlace = P.hushed();
  frame("sneak", 9.8);
  frame("sneak", 11.3);
  el.currentTime = 9;
  const backAgain = frame("sneak", 11.5);
  // a visit to another place
  frame("hall", 12);
  frame("hall", 13.5);
  el.currentTime = 2;
  const nextPlace = frame("hall", 14);
  const now = P.visitNow();
  g.check("1: the sneak's music plays (Sneaky Snitch) before the alarm", playing > 0 && P.fileFor("sneak") === "music/sneaky-snitch.mp3", { playing });
  g.check("1: the alarm stops the music at once", atAlarm === 0 && !!hushAt && hushAt.place === "sneak", { atAlarm, hushAt });
  g.check("1: through the alarm and after it the music stays quiet in the same place", samePlace === 0, { samePlace });
  g.check("1: a visit to a place with no music (a hallway) ends the quiet: back in the first place, its music plays again", quietPlace === null && backAgain > 0, { quietPlace, backAgain });
  g.check("1: a visit to another place brings the music back with that place's pick (the empty hall: Lobby Time)", nextPlace > 0 && now.file === "music/lobby-time.mp3" && !P.hushed(), { nextPlace, now });
  P.newVisits();
}

// ---------- 1b. a track going quiet fades out within a second (the TV story's music as the film ends) ----------
{
  P.newVisits();
  const el = { src: "", currentTime: 0, ended: false, paused: false };
  const real = () => performance.now() / 1000;
  let t0 = real();
  P.seeCue("tv", t0 - 5);
  P.seeCue("tv", t0 - 3);
  el.currentTime = 4;
  P.keepInSpan(el, "tv");
  el.currentTime = 4.2;
  const before = P.keepInSpan(el, "tv");
  // the film ends: the cue goes quiet
  P.seeCue("", real());
  const start = P.keepInSpan(el, "");
  await new Promise((r) => setTimeout(r, 450));
  const half = P.keepInSpan(el, "");
  await new Promise((r) => setTimeout(r, 450));
  const end = P.keepInSpan(el, "");
  g.check("1b: when the film ends its music fades out in under a second (not played on and cut)", before > 0 && start > 0 && half < start && end === 0, { before, start, half, end });
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
  let on = false,
    state = { part: 1 };
  // a beat with an alarm (as the party's and the lunch sneak's alarmOn), and its state (alarmKey)
  S.registerBeat("test-alarm", { alarmOn: () => on, alarmKey: () => state });
  out.before = S.refinedCue("hall");
  on = true;
  out.during = S.refinedCue("hall");
  out.duringHome = S.refinedCue("home");
  on = false;
  out.after = S.refinedCue("hall");
  out.hushedAfter = S.musicNow().hush;
  // the part starts again (a restart after the LOCKUP card, or ↺): its state is a new one, and the quiet ends
  state = { part: 1 };
  S.refinedCue("hall");
  out.hushedAfterRestart = S.musicNow().hush;
  out.soundOn = S.engine().soundState() === "on";
  out.alarmPlays = S.alarmSound();
  out.hushedByAlarmSound = S.musicNow().hush;
  out.partyHasRule = typeof S.beat("ch1-party").alarmOn === "function";
  return out;
});
g.check("2: while a beat's alarm is on, the music's cue is nothing (in the hall and at home); before and after, the place's own", game.before === "hall" && game.during === "" && game.duringHome === "" && game.after === "hall", game);
g.check("2: after the alarm, the same part goes on quiet; when the part starts again (a restart after the LOCKUP card, or ↺) the quiet ends and its music comes back", game.hushedAfter === true && game.hushedAfterRestart === false, game);
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
