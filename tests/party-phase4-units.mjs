/**
 * Brian's answers of 2026-11-26 that can be checked without a browser:
 *   - band order (#43): Funky Chunk until he dances, Stormtop-Sylvania while he dances, Funky Chunk after; a track that
 *     comes back carries on where it stopped, never from the top (party-band-order.js, party-sound.js);
 *   - the chase music (#44): Run Amok in the music table, credited; the closing hum (#28): Mops's hum file, credited,
 *     no name in the credit; the song titled Floating in Space (music names);
 *   - the party is on at home (#6 of phase 4): P3 to P6 while the band plays, and P8c until Mops comes home;
 *   - the dance's speed words and the "Super dancer!" badge (#45);
 *   - the photo rule (#46): in his place in the row before the 3-2-1 he is seen, safe during it, 2 s to leave after;
 *   - the crowd's three options and the voice's three options, each with a one-line switch (#4 of phase 4).
 *   node tests/party-phase4-units.mjs
 */
import { join } from "node:path";
import { readFileSync, existsSync } from "node:fs";
import { root } from "./game-page.mjs";

const mod = (f) => import(join(root, "src", "modules", f));
const order = await mod("party-band-order.js");
const picks = await mod("music-picks.js");
const { createPartySound } = await mod("party-sound.js");
const dance = await mod("party-dance.js");
const words = await mod("dance-words.js");
const end = await mod("party-dance-end.js");
const photo = await mod("party-photo.js");
const board = await mod("party-board-sounds.js");
let failed = 0;
const check = (name, ok, detail) => (console.log(`${ok ? "PASS" : "FAIL"} ${name}`), ok || (failed++, console.log(JSON.stringify(detail))));

// ---------- band order ----------
const list = picks.listFor("band");
check("#43 before he dances the band plays Funky Chunk", list[order.bandTrackNow({ dance: null })] === "funkySong", list);
check("#43 while he dances, Stormtop-Sylvania", list[order.bandTrackNow({ dance: { t: 1 } })] === "bandSong");
check("#43 after his dance, Funky Chunk again", list[order.bandTrackNow({ dance: null, done: { dance: true } })] === "funkySong");

// a track that comes back carries on where it stopped (party-sound.js), with a fake audio context and fetch
{
  const starts = [];
  const param = () => ({ value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {}, linearRampToValueAtTime() {}, setTargetAtTime() {} });
  const node = (extra) => ({ connect: (x) => x, disconnect() {}, start() {}, stop() {}, context: c, ...extra });
  const c = {
    currentTime: 0,
    sampleRate: 8000,
    createBuffer: (ch, len, rate) => ({ sampleRate: rate, duration: len / rate, getChannelData: () => new Float32Array(len) }),
    createGain: () => node({ gain: param() }),
    createBiquadFilter: () => node({ type: "", frequency: param(), Q: param() }),
    createOscillator: () => node({ type: "", frequency: param() }),
    createBufferSource: () => {
      const s = node({ buffer: null, loop: false, loopStart: 0, loopEnd: 0, playbackRate: param() });
      s.start = (w, off) => s.buffer && s.buffer.url && starts.push({ file: s.buffer.url, off });
      return s;
    },
    decodeAudioData: (b) => Promise.resolve({ duration: 200, url: b.url }),
  };
  globalThis.fetch = (url) => Promise.resolve({ ok: true, arrayBuffer: () => Promise.resolve({ url }) });
  const master = c.createGain();
  const sound = createPartySound(() => ({ soundState: () => "on", audioCtx: () => c, masterGain: () => master }));
  const funky = list.indexOf("funkySong"),
    storm = list.indexOf("bandSong");
  sound.song(funky);
  sound.tick();
  await new Promise((r) => setTimeout(r, 20));
  sound.tick();
  c.currentTime = 12;
  sound.song(storm);
  sound.tick();
  await new Promise((r) => setTimeout(r, 20));
  sound.tick();
  c.currentTime = 20;
  sound.song(funky);
  sound.tick();
  const f = starts.filter((s) => /funky/.test(s.file));
  check("#43 Funky Chunk comes back where it stopped (12 s in), not from its top", f.length === 2 && f[0].off === 0 && Math.abs(f[1].off - 12) < 0.01, starts);
  const sp = sound.debug();
  check("#43 and where each track stopped is kept", Math.abs(sp.band.resumeAt[storm] - 8) < 0.01, sp.band);
}

// ---------- the music table ----------
const credits = readFileSync(join(root, "music", "CREDITS.txt"), "utf8");
check("#44 the chase plays Run Amok, credited CC BY like the other Kevin MacLeod tracks", picks.fileFor("chase") === "music/run-amok.mp3" && existsSync(join(root, "music", "run-amok.mp3")) && credits.includes('"Run Amok" Kevin MacLeod (incompetech.com), Licensed under Creative Commons: By Attribution 4.0 License'));
check("#28 the closing hum is Mops's hum file, the whole file round and round, credited with no name", picks.fileFor("closing-hum") === "music/mops-hum.mp3" && existsSync(join(root, "music", "mops-hum.mp3")) && picks.spanFor("closing-hum").from === 0 && credits.includes("Mops's hum: recorded for the game by a family member, 2026-11-26, used with permission"));
check("the morning's song is titled Floating in Space everywhere (its file name stays)", picks.MUSIC_FILES.floating && picks.MUSIC_FILES.floating.url === "music/goating-in-space.mp3" && !/Goating in Space/.test(readFileSync(join(root, "src", "modules", "music-picks.js"), "utf8")) && !/Goating in Space/.test(credits));

// ---------- the party heard at home ----------
check("#6 the party is on from P3 to P6 while the band plays, not during an alarm", order.partyOnNow({ scene: "P4", band: true }) && order.partyOnNow({ scene: "P6", band: true }) && !order.partyOnNow({ scene: "P6", band: false }) && !order.partyOnNow({ scene: "P6", band: true, alarm: {} }));
check("#6 home early (P8c) the party is still on until Mops comes home; closing time (P8b) it is over", order.partyOnNow({ scene: "P8c" }) && !order.partyOnNow({ scene: "P8c", mopsComing: true }) && !order.partyOnNow({ scene: "P8b", band: true }));

// ---------- the dance's speed words ----------
const fake = new Proxy({}, { get: (o, k) => (k in o ? o[k] : () => ({ width: 10 })), set: (o, k, v) => ((o[k] = v), true) });
const d0 = dance.newDance(0);
check("#45 the first routine pops up \"Dance!\"", words.drawDanceWords(fake, 375, 812, d0).pop === "Dance!");
check("#45 the green button names the next speed: Faster!, Super fast!, Top speed!, and keeps Top speed!", [0, 1, 2, 3].map((l) => end.againWords(l)).join("|") === "Faster!|Super fast!|Top speed!|Top speed!");
const d1 = dance.newDance(0);
d1.t = 20;
dance.danceAgain(d1);
check("#45 each faster routine pops up its word as it starts", words.drawDanceWords(fake, 375, 812, d1).pop === "Faster!" && (d1.t += 2) && words.drawDanceWords(fake, 375, 812, d1).pop === "");
const top = dance.newDance(3);
for (let i = 0; i < 100 && !top.finished; i++) {
  dance.tickDance(top, 0.05);
  const s = dance.spotNow(top);
  if (s && top.live) {
    const at = dance.spotOnScreen(375, 812, top, s);
    dance.danceTap(top, at.x, at.y, 375, 812);
  }
}
check("#45 a perfect routine at top speed earns the gold \"Super dancer!\" badge", top.finished && top.big && top.superDancer && words.drawDanceWords(fake, 375, 812, top).badge, { finished: top.finished, big: top.big, superDancer: top.superDancer, missed: top.missed });
const slow = dance.newDance(1);
for (let i = 0; i < 100 && !slow.finished; i++) {
  dance.tickDance(slow, 0.05);
  const s = dance.spotNow(slow);
  if (s && slow.live) {
    const at = dance.spotOnScreen(375, 812, slow, s);
    dance.danceTap(slow, at.x, at.y, 375, 812);
  }
}
check("#45 a perfect routine below top speed earns no badge", slow.finished && slow.big && !slow.superDancer, { finished: slow.finished, big: slow.big });

// ---------- the photo rule ----------
const gap = photo.PHOTO_ROW.squatch,
  inRow = { x: gap.x, y: gap.y },
  away = { x: gap.x - 200, y: gap.y + 100 };
const shot = (phase) => ({ shot: { phase } });
check("#46 standing in his place before the 3-2-1 (everyone walking in, or in place) he is seen", photo.photoSeen(shot("gather"), inRow, 0.1, true) && photo.photoSeen(shot("join"), inRow, 0.1, true));
check("#46 away from it before the 3-2-1, nothing; a scripted walk is never seen", !photo.photoSeen(shot("join"), away, 0.1, true) && !photo.photoSeen(shot("join"), inRow, 0.1, false));
check("#46 during the 3-2-1 he is safe in his place, and JOIN · photo is open only then", !photo.photoSeen(shot("count"), inRow, 0.1, true) && photo.photoOpen(shot("count")) && !photo.photoOpen(shot("join")));
{
  const p = shot("flash");
  let seenAt = null;
  for (let t = 0; t < 3 && seenAt == null; t += 0.1) photo.photoSeen(p, inRow, 0.1, true) && (seenAt = Math.round((t + 0.1) * 10) / 10);
  const q = shot("flash");
  let left = false;
  for (let t = 0; t < 3; t += 0.1) left = left || photo.photoSeen(q, t < 1.5 ? inRow : away, 0.1, true);
  check("#46 still in his place 2 s after the click he is seen; stepping out within 2 s he is not", seenAt != null && seenAt >= photo.PHOTO.leave - 0.05 && seenAt <= photo.PHOTO.leave + 0.15 && !left, { seenAt, left });
}

// ---------- the sound options ----------
check("#4 the crowd has three options and plays A until Brian picks (one line: CROWD_STYLE)", ["A", "B", "C"].every((k) => typeof board.CROWD[k] === "function") && board.CROWD_STYLE === "A");
check("#4 the party's crowd plays the chosen option", /CROWD\[CROWD_STYLE\]/.test(readFileSync(join(root, "src", "modules", "party-sound.js"), "utf8")));

console.log(failed ? `${failed} failed` : "party-phase4-units checks passed");
process.exit(failed ? 1 : 0);
