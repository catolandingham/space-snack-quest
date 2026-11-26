/**
 * The home morning's sounds. Only one is made here: Squatch's footsteps, a soft padded thump of a furry foot (a
 * placeholder level), played through footfalls.js, so only while his feet move. Everything else is a sound the game
 * already has: the pickup ("grab") and the box's thunk ("hide") from the older program's effects; Mops's hooves, the
 * station door, the closet's squeaky hinge and its bump from the morning's sounds (morning-sound.js, synth.js). The
 * calendar's paper rustle is played by the calendar close-up itself.
 * Every sound goes through the effects level under the game's master volume (sound-mix.js); nothing plays while sound
 * is off. Each sound asked for is counted, sound on or off (tests).
 */
import { buses } from "./sound-mix.js";

export const HOME_MORNING_SOUND = Object.freeze({ pad: 0.22, padEvery: 0.3 });

export function createHomeMorningSound(getEngine, morningSound) {
  const asked = {};
  const count = (name) => (asked[name] = (asked[name] || 0) + 1);
  return {
    /** One of Squatch's footsteps: a soft low thump with a brush of fur. `k` counts his steps (left, right). */
    pad(k) {
      count("pad");
      const b = buses(getEngine());
      if (!b) return;
      try {
        const c = b.ctx,
          t = c.currentTime + 0.01,
          os = c.createOscillator(),
          g = c.createGain();
        os.frequency.setValueAtTime(k % 2 ? 118 : 104, t);
        os.frequency.exponentialRampToValueAtTime(55, t + 0.08);
        g.gain.setValueAtTime(HOME_MORNING_SOUND.pad, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
        os.connect(g);
        g.connect(b.fx);
        os.start(t);
        os.stop(t + 0.12);
      } catch {}
    },
    /** A sound of the morning's (morning-sound.js): "hoof", "door", "closetOpen", "closetShut". */
    morning(name, k) {
      count(name);
      morningSound && morningSound.play(name, k || 0);
    },
    /** One of the older program's effects: "grab" (picking something up), "hide" (the box's thunk). */
    effect(name) {
      count(name);
      const e = getEngine();
      e && e.sfx && e.sfx(name);
    },
    /** Tests: how many of each sound were asked for. */
    asked() {
      return { ...asked };
    },
  };
}
