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
export function createBridge() {
  const beats = new Map();
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
  });
}
