/**
 * The one meeting point between new code (real modules in src/modules/) and the older program
 * (the pieces in src/game/, which are slices of one function).
 *
 * New Chapter 1 beats register here by id, and the older program asks for a beat by id where that
 * beat has been rebuilt. When the first rebuilt beat needs engine functions from the older program
 * (walking, catching, drawing), a hand-over is added here for exactly those, and nothing more.
 *
 * The older program must guard every use (`window.SSQ && ...`): if the module script ever fails to
 * load, the game must still run as it did.
 */
import { outlineCanvas, OUTLINE } from "./outline.js";
import { GOAL_TARGETS } from "./goal-targets.js";
import { SEEN_TOO_LONG_SECONDS } from "./party-watch.js";
import { createGuestArt } from "./guests.js";
import { findPath } from "./tap-path.js";
import { createHomeMusic } from "./home-music.js";
import { createMorningSound } from "./morning-sound.js";
import { MIX, buses } from "./sound-mix.js";
import { BOARD } from "./party-board-sounds.js";
import { lastCutaway } from "./cutaway.js";
import { SPEAKER } from "./morning.js";
import { placeLabel } from "./cap-place.js";
import { walkRingShows } from "./walk-ring.js";
import { quietLine } from "./party-lines.js";
import { adultPxFor, doorAdultPx } from "./room-sizes.js";
import { createGoalMark } from "./goal-mark.js";
import { singingNow } from "./music-rules.js";
import { keepInSpan, seeCue } from "./music-picks.js";

/**
 * The game-state fields a rebuilt beat may write, through engine().set(field, value). Anything else it
 * changes goes through a named hand-over function (place, face, step, still, moWalking). A beat that tries
 * to write another field stops with an error; tests/module-build.mjs checks the morning (and its home-alone
 * part) and the party night against this list.
 */
export const BEAT_WRITES = Object.freeze(["ch1Morning", "ch1PartyNow", "ch1Chip", "ctrl", "scene", "act", "sqPose", "moPose", "sqLift", "zzz", "wardrobe"]);

export function createBridge() {
  const beats = new Map();
  const outlines = new Map();
  const guests = createGuestArt();
  // The engine functions the older program hands over (see handOver), and the fields beats have written.
  let engine = null;
  const written = new Set();
  const homeMusic = createHomeMusic(() => engine);
  const morningSound = createMorningSound(() => engine);
  const goalMark = createGoalMark();
  // At home, while the TV story is on the screen, the music's cue is "tv" (music-picks.js).
  const refineCue = (cue) => {
    const tv = beats.get("ch1-tv-story");
    return cue === "home" && tv && tv.showing && tv.showing() ? "tv" : cue;
  };
  return Object.freeze({
    version: 1,
    /**
     * The older program hands over, once at start, the small engine functions rebuilt beats use: the story
     * queue (queue, say, card, run, until, tapWait, current), people (pos, place, face, step, still,
     * moWalking), state (get, and set for the BEAT_WRITES fields only), the chip, the chapter reset, the
     * evening start, forgetting the step restart's saved start, sound (soundState, audioCtx, masterGain, and the
     * music and effects levels under it: musicGain, fxGain), drawing (drawMops, squatchScale, text) and the clock.
     * cutIn(items) puts story steps in front of the one up now, which comes back after them (Brian 31a).
     * A later hand-over replaces an earlier one (the page made a new game).
     */
    handOver(e) {
      if (!e || typeof e !== "object") throw new Error("handOver needs the engine functions");
      engine = Object.freeze({
        ...e,
        set(field, value) {
          if (!BEAT_WRITES.includes(field)) throw new Error(`a beat may not write ${field} (bridge.js BEAT_WRITES)`);
          written.add(field);
          e.set(field, value);
        },
      });
    },
    /** The handed-over engine functions, or null before the older program has started. */
    engine() {
      return engine;
    },
    /** Every game-state field a beat has written so far (tests). */
    beatWrites() {
      return [...written];
    },
    /** Brian's Floating in Space recording in the morning. See home-music.js. */
    homeMusic,
    /**
     * The music element, every frame it plays: the file and stretch its cue plays, and how loud now (music-picks.js).
     * At home while the TV story is on the screen the cue is "tv".
     */
    musicSpan(el, cue) {
      return keepInSpan(el, refineCue(cue));
    },
    /**
     * The one FUR alarm of Chapter 1 (Brian 2026-11-26, the red alert whoop: party-board-sounds.js BOARD.alarm), for
     * the older program's alarm sound. True once played; false while sound is off (the older program then plays
     * nothing either).
     */
    alarmSound() {
      const b = buses(engine);
      if (!b) return false;
      BOARD.alarm({ c: b.ctx, o: b.fx }, b.ctx.currentTime + 0.01);
      return true;
    },
    /** The older program's music cue, every frame once its music has started: where the music is (music-picks.js). */
    musicCue(cue) {
      seeCue(refineCue(cue));
      return cue;
    },
    /** The morning's and home alone's made-up sounds (snoring, the ding-dong, mopping...). See morning-sound.js. */
    morningSound,
    /** How loud music and sound effects are under the master volume; the engine reads it. See sound-mix.js. */
    mix: MIX,
    /**
     * A speech bubble opens: its tick, and Mops's meh on his first line in a scene. His gentle lines
     * ("You have me.", party-lines.js `quiet`) never get the meh. See morning-sound.js.
     */
    bubbleSound(b, scene) {
      morningSound.bubble(b, scene, homeMusic.debug().playing, quietLine(b));
    },
    /** The wall speaker in the home room, for placing its bubble. See morning.js. */
    speakerBox() {
      return SPEAKER;
    },
    /** The full-screen cutaway (tests read what its last frame drew). See cutaway.js. */
    cutaway: Object.freeze({ last: lastCutaway }),
    /** Register a rebuilt beat. Ids are unique; registering one twice is a mistake, so it throws. */
    registerBeat(id, beat) {
      if (typeof id !== "string" || !id) throw new Error("registerBeat needs an id");
      if (!beat || typeof beat !== "object") throw new Error(`registerBeat(${id}) needs a beat object`);
      if (beats.has(id)) throw new Error(`beat ${id} is registered twice`);
      beats.set(id, beat);
    },
    /** The rebuilt beat with this id, or null while the older program still runs it. */
    beat(id) {
      return beats.get(id) || null;
    },
    /** Ids of every rebuilt beat, in the order they were registered. */
    beatIds() {
      return [...beats.keys()];
    },
    /**
     * The dashed outline of the thing inside `box` (game positions) of `source` (a locked room picture or a
     * canvas the size of the game picture), traced once and kept under `key`. Returns { canvas, x, y } to
     * draw at (x, y), or null. See outline.js.
     */
    outline(key, source, box) {
      // A picture the browser will not let us read (a page opened straight from disk) gets no outline
      // rather than stopping the game's drawing.
      if (!outlines.has(key)) {
        let o = null;
        try {
          o = outlineCanvas(source, box);
        } catch (e) {
          o = null;
        }
        outlines.set(key, o);
      }
      return outlines.get(key);
    },
    /**
     * Draws the soft yellow outline round the real thing a Chapter 1 goal needs (GOAL_TARGETS), pulsing
     * gently. `picture` is the locked room picture on screen (traced things come from it). `avoid` is a list of
     * boxes (the people standing there): the outline is not drawn inside them, so it never draws over Squatch
     * (Brian, 2026-11-23: "The dash outline drawing over him doesn't work."). Returns the box outlined, or null
     * when this goal has no outline.
     */
    drawGoalOutline(ctx, room, spotId, picture, time, avoid) {
      const target = GOAL_TARGETS[room + ":" + spotId];
      if (!target) return null;
      const alpha = 0.85 + 0.15 * Math.sin((time || 0) * 4); // always clearly visible (Brian G#430: "I can't really see it")
      ctx.save();
      for (const b of avoid || []) {
        if (!b) continue;
        ctx.beginPath();
        ctx.rect(-4000, -4000, 9000, 9000);
        ctx.rect(b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0);
        ctx.clip("evenodd");
      }
      ctx.globalAlpha = alpha;
      if (target.rect) {
        const b = target.rect;
        ctx.setLineDash([OUTLINE.dash, OUTLINE.dash * 0.7]);
        ctx.lineWidth = OUTLINE.width;
        ctx.strokeStyle = OUTLINE.color;
        ctx.strokeRect(b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0);
      } else if (picture && picture.complete && picture.naturalWidth) {
        const o = this.outline(room + ":" + spotId + ":" + picture.src, picture, target.trace);
        o && ctx.drawImage(o.canvas, o.x, o.y);
      }
      ctx.restore();
      return target.rect || target.trace;
    },
    /** Where a "VERB · thing" label goes: next to its thing, clear of Squatch and other things. See cap-place.js. */
    placeLabel,
    /** Tap to walk around furniture: the corners to walk through. See tap-path.js. */
    findPath,
    /** False when a walk-tap's ring would sit on a place the goal outline already marks. See walk-ring.js. */
    walkRingShows,
    /** The goal outline drawn this frame (drew) and the one on screen now (now), for the walk ring. See goal-mark.js. */
    goalMark,
    /** How tall a grown-up is drawn in a room (85% of its door; the party hall 40% bigger). See room-sizes.js. */
    adultPxFor,
    /** 85% of a room's door, with no party-hall growth. See room-sizes.js. */
    doorAdultPx,
    /** True while singing is on (no background music then). See music-rules.js. */
    singingNow,
    /** Seconds a guest watches Squatch with "?" before it turns into "!". See party-watch.js. */
    seenTooLong: SEEN_TOO_LONG_SECONDS,
    /** The approved guest pictures (guests.js), for the party's own drawing. */
    guests,
    /** The approved guest who stands in place of one of the older program's guest kinds, or null. See guests.js. */
    guestId(kind) {
      return guests.idFor(kind);
    },
    /** Draws an approved party guest; false while its picture is not ready (the caller draws its own). */
    drawGuest(ctx, kind, x, y, adultPx, time) {
      return guests.draw(ctx, kind, x, y, adultPx, time);
    },
  });
}
