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
import { partyCones, SEEN_TOO_LONG_SECONDS } from "./party-watch.js";
import { createGuestArt } from "./guests.js";
import { createHomeMusic } from "./home-music.js";
import { lastCutaway } from "./cutaway.js";
import { SPEAKER } from "./morning.js";

/**
 * The game-state fields a rebuilt beat may write, through engine().set(field, value). Anything else it
 * changes goes through a named hand-over function (place, face, step, still, moWalking). A beat that tries
 * to write another field stops with an error; tests/module-build.mjs checks the morning against this list.
 */
export const BEAT_WRITES = Object.freeze(["ch1Morning", "ch1Chip", "ctrl", "scene", "act", "sqPose", "moPose", "sqLift", "zzz"]);

export function createBridge() {
  const beats = new Map();
  const outlines = new Map();
  const guests = createGuestArt();
  // The engine functions the older program hands over (see handOver), and the fields beats have written.
  let engine = null;
  const written = new Set();
  const homeMusic = createHomeMusic(() => engine);
  return Object.freeze({
    version: 1,
    /**
     * The older program hands over, once at start, the small engine functions rebuilt beats use: the story
     * queue (queue, say, card, run, until, tapWait, current), people (pos, place, face, step, still,
     * moWalking), state (get, and set for the BEAT_WRITES fields only), the chip, the chapter reset, the
     * evening start, forgetting the step restart's saved start, sound (soundState, audioCtx, masterGain, chime), drawing (drawMops, text) and the clock.
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
     * gently. `picture` is the locked room picture on screen (traced things come from it). Returns the box
     * outlined, or null when this goal has no outline.
     */
    drawGoalOutline(ctx, room, spotId, picture, time) {
      const target = GOAL_TARGETS[room + ":" + spotId];
      if (!target) return null;
      const alpha = 0.85 + 0.15 * Math.sin((time || 0) * 4); // always clearly visible (Brian G#430: "I can't really see it")
      ctx.save();
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
    /** Party sight cones: where each person's cone starts and which way it points. See party-watch.js. */
    partyCones,
    /** Seconds a guest watches Squatch with "?" before it turns into "!". See party-watch.js. */
    seenTooLong: SEEN_TOO_LONG_SECONDS,
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
