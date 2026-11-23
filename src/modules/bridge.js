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

export function createBridge() {
  const beats = new Map();
  const outlines = new Map();
  return Object.freeze({
    version: 1,
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
      if (!outlines.has(key)) outlines.set(key, outlineCanvas(source, box));
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
  });
}
