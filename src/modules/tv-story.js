/**
 * Beat 20, the TV story: why Squatch has to hide (Brian 2026-11-25, "1": bring back the old Wookiee story in
 * place of the "Fur in the scrubber." stand-in). Full screen, one picture at a time, each waiting for NEXT
 * (review rule 3): the "Years ago, on Stormtop..." card; the Wookiee tour; they shed; the fur clogs the air
 * scrubbers; a tourist's "*gasp*"; the Station Official sends them onto the TOURS ship ("Nobody can live
 * outside. The scrubbers keep us breathing. NO FUR."); the "Now" card. The pictures are tv-story-art.js, drawn
 * by the full-screen cutaway (cutaway.js, id "wookiee"); the words are tv-story-lines.js.
 * Brian: "remember to include wookie sound effects". His approved Wookiee recording (sounds/wookiee-roar.mp3,
 * sounds/CREDITS.txt) plays whenever a Wookiee comes on screen: the tour, the shed (a little higher, as the old
 * story played it) and the ship (a little lower). It stops when a picture without a Wookiee comes up.
 * The older program asks for the steps through window.SSQ.beat("ch1-tv-story").steps() (14-ch1-day1.js).
 */
import { tvLine } from "./tv-story-lines.js";

export const TV_STORY_ID = "wookiee";
export const WOOKIEE_SOUND = Object.freeze({ url: "sounds/wookiee-roar.mp3", level: 0.9, rate: Object.freeze({ tour: 1, shed: 1.06, banish: 0.9 }) });
// The pictures, in order (cutaway.js draws them from tv-story-art.js WOOKIEE_PANELS).
export const PICTURES = Object.freeze(["tour", "shed", "clog", "gasp", "banish"]);

export function createTvStory(bridge) {
  const E = () => bridge.engine();
  let buf = null,
    loading = false,
    playing = null,
    waiting = "";
  const asked = []; // tests: every roar asked for, by picture
  function load(c) {
    if (buf || loading || !c || typeof fetch !== "function") return;
    loading = true;
    fetch(WOOKIEE_SOUND.url)
      .then((r) => r.arrayBuffer())
      .then((b) => c.decodeAudioData(b))
      .then((d) => {
        buf = d;
        // the picture that asked is still up: it roars now
        const cur = E() && E().current();
        waiting && cur && cur.k === "cutaway" && cur.id === TV_STORY_ID && PICTURES[cur.panel] === waiting && play(waiting);
      })
      .catch(() => (loading = false));
  }
  function out() {
    const e = E();
    if (!e || !e.soundState || e.soundState() !== "on") return null;
    const c = e.audioCtx(),
      o = (e.fxGain && e.fxGain()) || e.masterGain();
    return c && o ? { c, o } : null;
  }
  function stop() {
    waiting = "";
    if (!playing) return;
    try {
      playing.stop();
    } catch {}
    playing = null;
  }
  function play(pic) {
    const A = out();
    if (!A) return;
    if (!buf) return void ((waiting = pic), load(A.c));
    waiting = "";
    const src = A.c.createBufferSource(),
      g = A.c.createGain();
    src.buffer = buf;
    src.playbackRate.value = WOOKIEE_SOUND.rate[pic] || 1;
    g.gain.value = WOOKIEE_SOUND.level;
    src.connect(g);
    g.connect(A.o);
    src.onended = () => playing === src && (playing = null);
    src.start();
    playing = src;
  }
  function roar(pic) {
    asked.push(pic);
    stop();
    play(pic);
  }
  const picture = (pic) => ({ k: "cutaway", id: TV_STORY_ID, panel: PICTURES.indexOf(pic) });
  return {
    /** The queue steps of the whole story, cards included. */
    steps() {
      const e = E(),
        A = out();
      A && load(A.c);
      return [
        e.card("fb", tvLine("card-years-ago")),
        e.run(() => roar("tour")),
        picture("tour"),
        e.run(() => roar("shed")),
        picture("shed"),
        e.run(stop),
        picture("clog"),
        picture("gasp"),
        e.run(() => roar("banish")),
        picture("banish"),
        e.run(stop),
        e.card("fb", tvLine("card-now")),
      ];
    },
    /** Tests: every Wookiee sound asked for so far, by picture ("tour", "shed", "banish"). */
    roars() {
      return asked.slice();
    },
    /** Tests: whether the recording has loaded and is playing now. */
    debug() {
      return { loaded: !!buf, playing: !!playing };
    },
  };
}
