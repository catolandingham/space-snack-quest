/**
 * Which music plays where, and which stretch of its file: one table, so a swap, or a new music file, is one line
 * (Brian 2026-11-26: showing 6, "I don't think we should default to the vocal part of this song"; his own two songs;
 * "C: everywhere at home"; then his final picks of that day, from his music page and in chat).
 *
 * The music files (music/; credits in music/CREDITS.txt and the README). Loudness: ffmpeg ebur128, whole file; `match`
 * brings each to Joe's theme's loudness (-17.1 LUFS).
 *   theme     main-theme-from-brian.mp3, Joe's song, 3:54. No words 0:00 to 0:19 (the opening tune; the music starts
 *             at 0:01 and dips quiet at 0:18.5) and about 2:33 to 2:59; sung otherwise (judged with a speech-to-text
 *             program, whisper.cpp on this Mac, and spectrum pictures of the stereo's middle against its sides: a
 *             curving middle-only voice line starts at 0:19.5; edges are estimates).
 *   floating  goating-in-space.mp3, "Floating in Space, Brian's song made with Suno, 2026-11-26", his new recording
 *             of Floating in Space (its words sing "goating in space"; Brian 2026-11-26: "The new Ganitor song is
 *             still called Floating in Space. It just happens to have the lyrics goating in space"), 1:44, sung almost
 *             all through, -15.7 LUFS. (The old Floating in Space recording left the repo the same day and never
 *             comes back.)
 *   band      stormtop-sylvania.mp3, "Stormtop-Sylvania, Brian's song made with Suno, 2026-11-26", for the Croc Boys,
 *             2:00, sung all through, -15.1 LUFS.
 *   Kevin MacLeod (incompetech.com), CC BY 4.0, Brian's picks of 2026-11-26, 112 kbps:
 *   funky     funky-chunk.mp3, "Funky Chunk", cut to its first 1:10 with a 3 s fade (the band's songs last a minute
 *             each; the whole is 3:59), -13.8 LUFS.
 *   lobby     lobby-time.mp3, "Lobby Time", 3:13, -17.3 LUFS.
 *   odyssey   odyssey.mp3, "Odyssey", cut to its first 1:15 with a 3 s fade (the TV story is under a minute; the
 *             whole is 5:06), -16.8 LUFS.
 *   sneaky    sneaky-snitch.mp3, "Sneaky Snitch", 2:17, -17.9 LUFS.
 *   carefree  carefree.mp3, "Carefree", 3:25, -20.6 LUFS.
 *   sting     der-kleber-sting.mp3, "Der Kleber Sting", 0:08, -12.2 LUFS.
 *   morning   morning.mp3, "Morning", 2:33, -18.5 LUFS.
 *   rainbows  rainbows.mp3, "Rainbows", 3:39, -15.7 LUFS.
 *   reawakening  reawakening.mp3, "Reawakening", 3:34, -35.6 LUFS (very quiet).
 *   runamok   run-amok.mp3, "Run Amok", 1:47, re-encoded at 112 kbps (Brian 2026-11-26: the octopus chase), -16.6 LUFS.
 *   mopshum   mops-hum.mp3, Mops's hum at closing time (Brian 2026-11-26): recorded for the game, pitched down to
 *             sound like Mops, his goat bleat, then more of the hum; 0:32, mono, -18.8 LUFS. Played quiet and muffled.
 * A span plays from `from` to `to` seconds and goes back to `from` (a short fade at the end and the start), or,
 * `once`, plays to `to` a single time, fades out, and stays quiet until the next visit (Brian: "I don't think it should
 * play all the way thru a lot of times").
 */

// Each file, and how much it is turned up or down to sound as loud as Joe's theme.
export const MUSIC_FILES = Object.freeze({
  theme: Object.freeze({ url: "music/main-theme-from-brian.mp3", match: 1 }),
  floating: Object.freeze({ url: "music/goating-in-space.mp3", match: 0.85 }),
  band: Object.freeze({ url: "music/stormtop-sylvania.mp3", match: 0.79 }),
  funky: Object.freeze({ url: "music/funky-chunk.mp3", match: 0.68 }),
  lobby: Object.freeze({ url: "music/lobby-time.mp3", match: 0.98 }),
  odyssey: Object.freeze({ url: "music/odyssey.mp3", match: 0.95 }),
  sneaky: Object.freeze({ url: "music/sneaky-snitch.mp3", match: 1.1 }),
  carefree: Object.freeze({ url: "music/carefree.mp3", match: 1.5 }),
  sting: Object.freeze({ url: "music/der-kleber-sting.mp3", match: 0.57 }),
  morning: Object.freeze({ url: "music/morning.mp3", match: 1.17 }),
  rainbows: Object.freeze({ url: "music/rainbows.mp3", match: 0.85 }),
  // (a very quiet track, -35.6 LUFS: turned up 12 dB, not the full 18.5, so its hiss stays down)
  runamok: Object.freeze({ url: "music/run-amok.mp3", match: 0.94 }),
  mopshum: Object.freeze({ url: "music/mops-hum.mp3", match: 1 }),
  reawakening: Object.freeze({ url: "music/reawakening.mp3", match: 4 }),
});
// Stretches of the files that can be picked.
export const SPANS = Object.freeze({
  themeTune: Object.freeze({ file: "theme", from: 1.0, to: 18.5, words: false }),
  themeBreak: Object.freeze({ file: "theme", from: 154, to: 178, words: false }), // an option, not used
  // `bleats`: seconds into the song where Mops's goat bleat plays over it, in its three quiet gaps (found by loudness:
  // the music dips about 15 dB at 0:36.5 to 0:38.9 after "A really long way from home", at 1:04.0 to 1:06.4 after
  // "It's really a pretty nice room", and at 1:35 to 1:38 after "He means I love you"; estimates to about 0.2 s).
  floatingOnce: Object.freeze({ file: "floating", from: 0, to: 102.7, words: true, once: true, bleats: Object.freeze([36.6, 64.1, 95.8]) }),
  carefreeOnce: Object.freeze({ file: "carefree", from: 0, to: 205, words: false, once: true }),
  morningOnce: Object.freeze({ file: "morning", from: 0, to: 153, words: false, once: true }),
  rainbowsOnce: Object.freeze({ file: "rainbows", from: 0, to: 219, words: false, once: true }),
  reawakeningOnce: Object.freeze({ file: "reawakening", from: 0, to: 214, words: false, once: true }),
  // `bpm`: the beat the Croc Boys bob to while it plays (party-art.js drawBand). Estimated 2026-11-26 from 40 s of each
  // file (the loudness rises' repeat time): Stormtop-Sylvania about 160 a minute, Funky Chunk about 115.
  bandSong: Object.freeze({ file: "band", from: 0, to: 119.6, words: true, bpm: 160 }), // ends on its count, "...six."
  funkySong: Object.freeze({ file: "funky", from: 0, to: 70, words: false, bpm: 115 }),
  lobbyLoop: Object.freeze({ file: "lobby", from: 0, to: 193, words: false }),
  odysseyOnce: Object.freeze({ file: "odyssey", from: 0, to: 75, words: false, once: true }),
  sneakyLoop: Object.freeze({ file: "sneaky", from: 0, to: 136.5, words: false }),
  stingOnce: Object.freeze({ file: "sting", from: 0, to: 8, words: false, once: true }),
  runAmokLoop: Object.freeze({ file: "runamok", from: 0, to: 107, words: false }),
  // the whole file, round and round (party-sound.js hum: quiet and muffled)
  mopsHumLoop: Object.freeze({ file: "mopshum", from: 0, to: 32.1, words: false }),
});
/**
 * Every moment music plays. A list is stepped through in order, one track a visit, round and round. null is
 * silence.
 *   title    the title screen (the older program's "title" cue, src/game/00-core.js warmWhy)
 *   morning  Day 1's morning at home, from the Dog Zylan line to "That evening..." (home-music.js): the first time
 *            Squatch is home on day one, so Floating in Space (Brian 2026-11-26: only there)
 *   home     every other daytime visit home (the "home" cue, and the talk at home after the party: party.js musicCue):
 *            the next track of the home rotation each visit, Carefree, Morning, Rainbows, then Carefree again (Brian:
 *            "so it isn't repetitive")
 *   bedtime  the bedtime story (beat 21, on its own branch: it adds the "bedtime" cue): Reawakening
 *   gift     the gift, out at home: the same visit as home (MUSIC_PLACE), so the home track carries on
 *   heart    the heart moments: the same visit as home (MUSIC_PLACE, Brian 2026-11-26 #32), so the home track carries
 *            on through them
 *   tv       the TV story (beat 20; tv-story.js says when it is showing)
 *   hall     the party hall with no party going on (the Day 2 hall)
 *   sneak    sneaking: the night sneak and the lunch sneak (the older program's sneak cue), and P2's sneak to the
 *            plant at the party (party.js musicCue). In P4, the flyer sneak, the band plays: the band's song wins.
 *   caught   the FUR! moment at the party: the sting, once (party-sound.js)
 *   band     the Croc Boys on the stage (Brian 2026-11-26, band order): Funky Chunk until he dances, Stormtop-Sylvania
 *            while he dances, then Funky Chunk again; a song that comes back carries on where it stopped, never
 *            from the top (party-band-order.js chooses, party-sound.js plays)
 *   chase    the octopus chase (Brian 2026-11-26, sample A): the band fades out and Run Amok plays until the chase
 *            ends (party-sound.js chase)
 *   closing-hum  Mops humming at the party's closing time: his hum recording, the whole file round and round, quiet
 *            and muffled (Brian 2026-11-26)
 */
export const MUSIC_PICKS = Object.freeze({
  title: "themeTune",
  morning: "floatingOnce",
  home: Object.freeze(["carefreeOnce", "morningOnce", "rainbowsOnce"]),
  gift: Object.freeze(["carefreeOnce", "morningOnce", "rainbowsOnce"]),
  bedtime: "reawakeningOnce",
  heart: "themeTune",
  tv: "odysseyOnce",
  hall: "lobbyLoop",
  sneak: "sneakyLoop",
  caught: "stingOnce",
  band: Object.freeze(["bandSong", "funkySong"]),
  chase: "runAmokLoop",
  "closing-hum": "mopsHumLoop",
});
// Sounds that are not music. Mops's bleat (Brian 2026-11-26, "Bleat 2": sounds/goat-bleat.mp3, 1.2 s, cut from
// Wikimedia Commons "Herd of goats bleating.ogg" by stephan, public domain): on his bleat line only (the morning song's
// "♪ Weeee-eenn-nnttt! ♪", morning-sound.js), and over Floating in Space where it leaves a gap for one (`bleats`).
// The crowd in the hall (Brian 2026-11-26: "I don't like any of the crowd sounds. They don't sound like crowds at all."):
// a recording to be dropped in later, looped under the band, quiet. Its pick is this one line (`url`); with none, the
// made-up murmur plays as before (party-sound.js).
export const SOUND_PICKS = Object.freeze({ "mops-bleat": Object.freeze({ url: "sounds/goat-bleat.mp3", level: 0.7 }), crowd: Object.freeze({ url: null, level: 0.35 }) });
// Cues that are the same place (one visit): moving between them does not start a `once` track again.
// (Brian 2026-11-26, #32: the heart moments at home count as the same home visit, so the home track carries on)
export const MUSIC_PLACE = Object.freeze({ gift: "home", heart: "home" });
// The moments where a sung track may play (Brian 2026-11-26): the morning's Floating in Space, and the band.
export const SINGING_OK = Object.freeze(["morning", "band"]);
// Seconds of fade at the end of a span (before it goes back to its start, or stops), and in again after.
export const SPAN_FADE = Object.freeze({ out: 0.8, in: 0.3 });

// Where each rotation is (the next track for that moment's next visit).
const turn = {};
/** The span names a moment plays, as a list (one name, or the rotation). */
export function listFor(cue) {
  const pick = cue in MUSIC_PICKS ? MUSIC_PICKS[cue] : MUSIC_PICKS.home;
  return pick == null ? [] : Array.isArray(pick) ? pick : [pick];
}
/** The span a moment plays now (`n`: its nth track, for a list), or null for silence. */
export function spanFor(cue, n = 0) {
  const list = listFor(cue);
  return list.length ? SPANS[list[n % list.length]] : null;
}
/** The file a moment plays (a path in music/), or null for silence. */
export function fileFor(cue, n = 0) {
  const s = spanFor(cue, n);
  return s ? MUSIC_FILES[s.file].url : null;
}
/** How much a moment's file is turned up or down to sound as loud as Joe's theme. */
export function matchFor(cue, n = 0) {
  const s = spanFor(cue, n);
  return s ? MUSIC_FILES[s.file].match : 1;
}
/** The next visit's track number for a moment with a rotation (and steps the rotation on). */
export function nextTurn(place) {
  const n = turn[place] || 0;
  turn[place] = n + 1;
  return n;
}

// Where the music is: the place (a moment, or "" for none) the older program's cue has stayed at for HOLD seconds,
// its cue and track number, whether a `once` track has played out there, and whether the track still has to be
// started (fresh). A cue that changes for less than HOLD (a frame between two story steps, a moment's walk) is not a
// new visit.
export const HOLD = 1;
const visit = { place: null, cue: "", n: 0, done: false, fresh: false, pend: null };
/** Tests: forget the visits and the rotations (as if the page were new). */
export function newVisits() {
  Object.assign(visit, { place: null, cue: "", n: 0, done: false, fresh: false, pend: null });
  for (const k of Object.keys(turn)) delete turn[k];
}
const clock = () => (typeof performance !== "undefined" ? performance.now() : Date.now()) / 1000;
/**
 * Every frame while sound is on (the older program calls this with its music cue once its music has started): moves
 * to a new visit once the cue's place has held for HOLD seconds. Returns the cue. `now` (seconds) is for tests.
 */
export function seeCue(cue, now = clock()) {
  const place = cue && cue in MUSIC_PICKS ? MUSIC_PLACE[cue] || cue : "";
  if (place === visit.place) return ((visit.pend = null), cue);
  if (!visit.pend || visit.pend.place !== place) return ((visit.pend = { place, cue, since: now }), cue);
  if (now - visit.pend.since >= HOLD || visit.place === null) {
    Object.assign(visit, { place, cue: visit.pend.cue, n: place ? nextTurn(place) : 0, done: false, fresh: !!place, pend: null });
  }
  return cue;
}
/** Tests: where the music is. */
export function visitNow() {
  return { place: visit.place, cue: visit.cue, n: visit.n, done: visit.done, file: visit.place ? fileFor(visit.cue, visit.n) : null };
}

/**
 * Every frame while the older program's music element plays or fades (it was Joe's theme's element; it plays every
 * file here now): plays the visit's track and keeps it inside its span, and returns how loud it should be just now
 * (the fades times the file's loudness match; 0 for silence, and for a `once` track that has played out in this
 * visit, and while there is no music place: the old track's own fade has taken it out by then).
 */
export function keepInSpan(el, cue) {
  if (!el) return 1;
  visit.place === null && cue && seeCue(cue, -1e9) && seeCue(cue, 0);
  // no music here (a place with none, held a second: the old track has faded out by then), or waiting for a new
  // place to hold: quiet, so nothing old is heard again
  if (!visit.place) return 0;
  const s = spanFor(visit.cue, visit.n);
  if (!s) return 0;
  const file = MUSIC_FILES[s.file];
  if (visit.fresh) {
    visit.fresh = false;
    el.src && !el.src.endsWith(file.url) && (el.src = file.url);
    try {
      el.currentTime = s.from;
    } catch {}
    return 0;
  }
  if (el.src && !el.src.endsWith(file.url)) el.src = file.url;
  const t = el.currentTime || 0;
  if (s.once) {
    if (visit.done) return 0;
    if (t >= s.to || el.ended) {
      visit.done = true;
      return 0;
    }
  }
  if (t >= s.to || t < s.from - 0.25) {
    try {
      el.currentTime = s.from;
    } catch {}
    return 0;
  }
  return file.match * Math.max(0, Math.min(1, (s.to - t) / SPAN_FADE.out, (t - s.from + 0.05) / SPAN_FADE.in));
}

// One decoded copy of each sound per audio context (the bleat is shared by the morning's line and the song).
const decoded = new WeakMap();
/** The decoded sound `name` of SOUND_PICKS for audio context `c` (a promise), or null when it has no file. */
export function loadSound(c, name) {
  const pick = SOUND_PICKS[name];
  if (!pick || !c || typeof fetch !== "function") return null;
  let m = decoded.get(c);
  m || decoded.set(c, (m = {}));
  return (m[name] =
    m[name] ||
    fetch(pick.url)
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(name + " " + r.status))))
      .then((b) => c.decodeAudioData(b))
      .catch((e) => {
        delete m[name]; // (a failed load is tried again next time)
        throw e;
      }));
}
/** Plays the sound `name` at time `t` into node `out` (at its level times `v`), once it has loaded. */
export function playSound(c, out, name, t, v = 1) {
  const p = loadSound(c, name);
  p &&
    p
      .then((buf) => {
        const src = c.createBufferSource(),
          g = c.createGain();
        src.buffer = buf;
        g.gain.value = SOUND_PICKS[name].level * v;
        src.connect(g);
        g.connect(out);
        src.start(Math.max(t, c.currentTime));
      })
      .catch(() => {});
  return !!p;
}
