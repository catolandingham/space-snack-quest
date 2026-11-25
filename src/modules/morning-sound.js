/**
 * When the morning's and home alone's made-up sounds play (the sounds themselves are in synth.js).
 * Brian 20a (2026-11-23): snoring while Squatch sleeps and a ding-dong before "Good morning, Stormtop!".
 * Brian 2026-11-24, "34(A)" (every MY PICK on the sound board): the snore whistles; a softer tick on every
 * speech bubble in place of the click; Mops's "meh" only on his first line in a scene (never over his own song,
 * no baa on every line); mopping "swish, squeak" once Squatch is awake; the dunk, the wring, the
 * beard shake, hooves walking out and the station door; home alone: the closet door, the bed flop, the homework
 * scribble, the paper rustle and the "That evening…" whoosh. "31a": the beard's squirt and Mops's grumpy
 * "meh-EH!" under "Hey, stop that!".
 * Brian 2026-11-24, after the morning video ("It's hard to tell the difference between the whistle and the
 * squeaking. Can we make the snore and whistle a bit more prominent?"): the snore is louder, and while Squatch
 * sleeps a mop stroke is a soft swish with no squeak (his yes: "just swish and not squeak. That seems fine to
 * me"), so the only high sound in the quiet room is the snore's whistle. The squeak belongs to the wring at the
 * bucket (mop-loop.js plays the strokes, the squeeze and the drips, each as it is drawn).
 *
 * Every sound goes through the effects level under the game's master volume (sound-mix.js). Nothing plays
 * while sound is off, and nothing here starts the sound engine. Each sound that really plays is written in a
 * log (tests read it: which sound, at what game time).
 */
import { SOUNDS } from "./synth.js";
import { MIX, buses } from "./sound-mix.js";
import { line } from "./morning-lines.js";

export const MORNING_SOUND = Object.freeze({
  breathEvery: 3.4, // seconds from one snore to the next
  // The snoring: the main sound of the quiet room, still under the ding-dong that wakes him. A placeholder
  // (0.22 until 2026-11-24, when Brian asked for the snore and its whistle to be more prominent).
  snoreLevel: 0.4,
  snoreFade: 0.25, // seconds the snoring takes to fade when he wakes
  mopSoftEvery: 0.8, // seconds a stroke of the beard takes while Squatch sleeps (out, then back). A placeholder.
  mopEvery: 0.5, // seconds between mop strokes as Mops mops along the floor (one a step, 4 in his 2-second walk)
  hoofEvery: 0.25, // seconds between hooves as he walks out
  mehAfter: 0.05, // seconds after the bubble's tick that Mops's "meh" starts
  // Seconds the speaker's first words wait after the tap that rings the ding-dong (morning.js).
  wordsAfter: 1.0,
});
const LOG_MAX = 400;

export function createMorningSound(getEngine) {
  let bus = null,
    busCtx = null,
    nextAt = 0,
    want = false,
    breaths = 0,
    chimes = 0,
    via = "",
    mehScene = null;
  const log = [];

  function live() {
    const b = buses(getEngine());
    return b ? { ctx: b.ctx, out: b.fx } : null;
  }
  const note = (name, k) => {
    const e = getEngine();
    log.push({ name, k: k || 0, t: e && e.time ? Math.round(e.time() * 100) / 100 : 0 });
    log.length > LOG_MAX && log.shift();
  };
  /** Plays one sound by name (synth.js) now, or `delay` seconds from now. `k` counts repeats (strokes, steps). */
  function play(name, k, delay) {
    const s = live(),
      snd = SOUNDS[name];
    if (!s || !snd) return false;
    try {
      snd.play({ c: s.ctx, o: s.out }, s.ctx.currentTime + 0.01 + (delay || 0), k || 0);
      via = "effects";
      note(name, k);
      return true;
    } catch {
      return false;
    }
  }
  function stopSnore() {
    if (!bus) return;
    const b = bus,
      ctx = busCtx;
    bus = null;
    busCtx = null;
    try {
      b.gain.setTargetAtTime(0, ctx.currentTime, MORNING_SOUND.snoreFade / 3);
      setTimeout(() => {
        try {
          b.disconnect();
        } catch {}
      }, MORNING_SOUND.snoreFade * 1000 + 2500);
    } catch {}
  }

  return {
    play,
    /** Called every frame by the morning: snore (true) or not (false). */
    snore(on) {
      want = !!on;
      const s = want ? live() : null;
      if (!s) return void stopSnore();
      try {
        if (!bus || busCtx !== s.ctx) {
          stopSnore();
          bus = s.ctx.createGain();
          bus.gain.value = MORNING_SOUND.snoreLevel;
          bus.connect(s.out);
          busCtx = s.ctx;
          nextAt = s.ctx.currentTime + 0.15;
        }
        // Each breath is booked a moment before it is due.
        while (nextAt < s.ctx.currentTime + 0.2) {
          nextAt < s.ctx.currentTime && (nextAt = s.ctx.currentTime + 0.05);
          SOUNDS.snore.play({ c: s.ctx, o: bus }, nextAt);
          note("snore", breaths);
          via = "effects";
          breaths++;
          nextAt += MORNING_SOUND.breathEvery;
        }
      } catch {
        stopSnore();
      }
    },
    /** The wall speaker's ding-dong (sound on only). */
    chime() {
      play("dingDong") && chimes++;
    },
    /**
     * A speech bubble opens (the older program calls this for every bubble, src/game/00-core.js): a soft tick;
     * Mops's goat "meh" on his first line in a scene, or the grumpy "meh-EH!" under "Hey, stop that!". Sung
     * lines get neither (Brian's recording plays under them), and no meh while his song plays.
     */
    bubble(b, scene, songPlaying) {
      if (!b || b.style === "song") return;
      play("tick");
      if (b.who !== "mops") return;
      if (b.text === line("mops-stop")) return void play("grumpy", 0, MORNING_SOUND.mehAfter);
      // Heard once in a scene: a line said while sound was off does not use it up.
      if (mehScene === scene || songPlaying) return;
      play("meh", 0, MORNING_SOUND.mehAfter) && (mehScene = scene);
    },
    /** A new morning: Mops's first line meh's again. */
    newMorning() {
      mehScene = null;
    },
    /**
     * For tests: renders one sound alone, silently (an offline audio context, at the effects level), and says
     * how loud it is: its peak and its loudness (root mean square) over its length. `opts`: `level` (the level
     * it plays at, like the snoring's), `from` and `to` (seconds into the sound: only that part), `highpass`
     * (Hz: only what is above it, 24 dB an octave).
     */
    async measure(name, opts) {
      const snd = SOUNDS[name],
        o = opts || {},
        rate = 22050,
        Off = typeof OfflineAudioContext !== "undefined" ? OfflineAudioContext : null;
      if (!snd || !Off) return null;
      const c = new Off(1, Math.ceil(rate * (snd.len + 0.3)), rate),
        lvl = c.createGain();
      lvl.gain.value = MIX.effects * (o.level == null ? 1 : o.level);
      let out = lvl;
      for (let i = 0; o.highpass && i < 2; i++) {
        const hp = c.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.value = o.highpass;
        out.connect(hp);
        out = hp;
      }
      out.connect(c.destination);
      snd.play({ c, o: lvl }, 0.01, 0);
      const d = (await c.startRendering()).getChannelData(0);
      let peak = 0,
        sum = 0;
      const i0 = Math.floor(rate * (0.01 + (o.from || 0))),
        n = Math.min(d.length, Math.ceil(rate * ((o.to == null ? snd.len : o.to) + 0.02)));
      for (let i = i0; i < n; i++) ((peak = Math.max(peak, Math.abs(d[i]))), (sum += d[i] * d[i]));
      return { peak, rms: Math.sqrt(sum / Math.max(1, n - i0)) };
    },
    /** For tests: whether he is snoring, how many breaths and ding-dongs have played, through what, and the log. */
    debug() {
      return { snoring: !!bus && want, breaths, chimes, via, log: log.slice() };
    },
  };
}
