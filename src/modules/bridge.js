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
import { quietLine } from "./party-lines.js";
import { quietBedtimeLine } from "./bedtime-story-lines.js";
import { drawHomeMopBucket, lastHomeMopBucket } from "./mop-bucket.js"; // (bedtime branch, 2026-11-26: Mops's mop bucket)
import { adultPxFor, doorAdultPx } from "./room-sizes.js";
import { drawGanitorTag, drawHallwayCrayon, ganitorTagsDrawn, hallwayCrayonDrawn } from "./ganitor.js";
import { singingNow } from "./music-rules.js";
import { keepInSpan, seeCue, visitNow, playSound, soundsPlayed, hushNow, hushKey, unhush } from "./music-picks.js";
import { drawBubbleTail } from "./bubble-tail.js";
import { createSpeechVoice } from "./speech-voice.js";
import { drawCreditsButton, creditsTap, creditsShown } from "./credits.js";

/**
 * The game-state fields a rebuilt beat may write, through engine().set(field, value). Anything else it
 * changes goes through a named hand-over function (place, face, step, still, moWalking). A beat that tries
 * to write another field stops with an error; tests/module-build.mjs checks the morning (and its home-alone
 * part) and the party night against this list.
 */
export const BEAT_WRITES = Object.freeze(["ch1Morning", "ch1PartyNow", "ch1HomeMorning", "ch1Lunch", "ch1Sneak", "ch1Step", "ch1Chip", "ctrl", "scene", "act", "sqPose", "moPose", "sqLift", "zzz", "wardrobe"]);

export function createBridge() {
  const beats = new Map();
  const outlines = new Map();
  const guests = createGuestArt();
  // The engine functions the older program hands over (see handOver), and the fields beats have written.
  let engine = null;
  const written = new Set();
  const homeMusic = createHomeMusic(() => engine);
  const morningSound = createMorningSound(() => engine);
  // (a guest's line: which guest says it, for the guest's own voice)
  const speechVoice = createSpeechVoice(() => engine, () => {
    const party = beats.get("ch1-party");
    return party && party.talker ? party.talker() : "";
  });
  // At home, while the TV story is on the screen, the music's cue is "tv"; while the bedtime story plays and the night
  // after it is still dark (the home morning's start), "bedtime" (music-picks.js: Joe's theme with its singing,
  // 2026-11-26); through the rest of the home morning, what it says (quiet for the PA, then "day2am").
  let musicCueNow = ""; // the cue the music last followed (refined), for tests
  const refineCue = (cue) => {
    // While a beat's alarm is on (the one capture rule: FUR!, the alarm, the search), no music; after it, the music
    // stays quiet in this place until a visit to another place (music-picks.js hushNow; Brian 2026-11-26).
    for (const [id, b] of beats) if (b.alarmOn && b.alarmOn()) return (hushNow(undefined, b.alarmKey ? b.alarmKey() : null, id), "");
    // the part that had the alarm started again (its state is a new one: a restart after the LOCKUP card, or ↺): a new
    // visit, so the music comes back
    const h = hushKey();
    if (h && h.owner) {
      const b = beats.get(h.owner);
      (!b || !b.alarmKey || b.alarmKey() !== h.key) && unhush();
    }
    if (cue !== "home") return cue;
    const tv = beats.get("ch1-tv-story"),
      bed = beats.get("ch1-bedtime-story"),
      hm = beats.get("ch1-home-morning"),
      // the home morning's own music: the bedtime music while the night is dark, quiet as it comes up and through the
      // PA, then "Morning" from the speaker (home-morning.js musicCue; null when it has no say)
      morning = hm && hm.musicCue ? hm.musicCue() : null;
    // (the bedtime story's walk to bed and climb in are quiet: the TV story's music has ended with the film, and the
    // bedtime music starts as Squatch asks; Brian 2026-11-26, video note 0:03)
    if (tv && tv.showing && tv.showing()) return "tv";
    if (bed && bed.quietNow && bed.quietNow()) return "";
    return bed && bed.showing && bed.showing() ? "bedtime" : morning != null ? morning : cue;
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
    /**
     * Mops's GANITOR name tag (ganitor.js), drawn by his drawing (60-frame-draw.js Fe) in his own units on `ctx`, at his
     * scale `scale` (game pixels to one of his units).
     */
    drawGanitorTag(ctx, scale) {
      return drawGanitorTag(ctx, scale);
    },
    /** Tests: Mops's name tags drawn since the last call ({ readable, scale }). */
    ganitorTags() {
      return ganitorTagsDrawn();
    },
    /** Tests: what the hallway's crayon card drew last (ganitor.js), or null. */
    hallwayCrayonDrawn() {
      return hallwayCrayonDrawn();
    },
    /** Squatch's crayon card on the hallway wall, "ME" and "MOPS THE GANITOR" (ganitor.js), for 14-ch1-day2.js. */
    drawHallwayCrayon(ctx) {
      return drawHallwayCrayon(ctx);
    },
    /** The morning's music at home (its pick in music-picks.js: Floating in Space). See home-music.js. */
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
     * the older program's alarm sound. The music stops with it (hushNow). True once played; false while sound is off
     * (the older program then plays nothing either).
     */
    alarmSound() {
      const b = buses(engine);
      if (!b) return false;
      // (the music stops with the alarm, and stays quiet here until another place: music-picks.js hushNow; the older
      // program calls this each time its alarm sounds)
      hushNow();
      BOARD.alarm({ c: b.ctx, o: b.fx }, b.ctx.currentTime + 0.01);
      return true;
    },
    /** The older program's music cue, every frame once its music has started: where the music is (music-picks.js). */
    musicCue(cue) {
      seeCue((musicCueNow = refineCue(cue)));
      return cue;
    },
    /** Tests: the cue the music follows for the older program's cue `cue` (after the TV and bedtime stories'). */
    refinedCue(cue) {
      return refineCue(cue);
    },
    /** Tests: the cue the music follows now (after the TV story's and the bedtime story's), and where it is. */
    musicNow() {
      const v = visitNow();
      return { ...v, visitCue: v.cue, cue: musicCueNow };
    },
    /**
     * Plays one of the game's sounds that are not music by its name (music-picks.js SOUND_PICKS: Mops's bleat),
     * at the effects level under the master volume. The same player as the morning's bleat (music-picks.js
     * playSound); nothing plays while sound is off. True once asked for.
     */
    playSoundPick(name) {
      const b = buses(engine);
      return !!b && playSound(b.ctx, b.fx, name, b.ctx.currentTime + 0.05);
    },
    /** Tests: every sound pick asked for so far ({ name, at, started }). */
    soundPicksPlayed() {
      return soundsPlayed();
    },
    /** The morning's and home alone's made-up sounds (snoring, the ding-dong, mopping...). See morning-sound.js. */
    morningSound,
    /** How loud music and sound effects are under the master volume; the engine reads it. See sound-mix.js. */
    mix: MIX,
    /**
     * A speech bubble opens: its tick, and Mops's meh on his first line in a scene. His gentle lines
     * ("You have me.", party-lines.js `quiet`; his bedtime line, bedtime-story-lines.js) never get the meh. See
     * morning-sound.js. Everyone else's speech gets a muffled "wah-wah" voice under it (never a sung line or a
     * thought). See speech-voice.js.
     */
    bubbleSound(b, scene) {
      morningSound.bubble(b, scene, homeMusic.debug().playing, quietLine(b) || quietBedtimeLine(b));
      speechVoice.speak(b);
    },
    /** The title screen's Credits button (drawn by the older program's title) and a tap on it. See credits.js. */
    credits: Object.freeze({ drawButton: drawCreditsButton, tap: creditsTap, shown: creditsShown }),
    /** The voices under speech bubbles (tests read what played). See speech-voice.js. */
    speechVoice,
    /**
     * A bubble's tail, drawn after the older program draws the bubble: pointed to the speaker's head, or a thought's
     * three circles to the thinker. Returns what it drew (tests). See bubble-tail.js.
     */
    drawBubbleTail,
    /** The wall speaker in the home room, for placing its bubble. See morning.js. */
    speakerBox() {
      return SPEAKER;
    },
    /**
     * (bedtime branch, 2026-11-26) Mops's mop bucket in the home room (Brian: "Let's go with it moving forward"), drawn
     * over the painted bucket of the locked picture, under the people, and again over Squatch when he stands behind it.
     * Returns its box, or null while not ready (the painted bucket shows). See mop-bucket.js.
     */
    drawHomeBucket: drawHomeMopBucket,
    /** Tests: where the home bucket was last drawn. */
    homeBucketDrawn: lastHomeMopBucket,
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
    /**
     * The rebuilt beat that draws the party hall now (the party night, or the lunch sneak), or null: the older
     * program asks it for the hall's picture, its walls (bounds) and what feet cannot walk through (solids).
     */
    hallOwner() {
      for (const b of beats.values()) if (b.ownsRoom && b.ownsRoom()) return b;
      return null;
    },
    /** Ids of every rebuilt beat, in the order they were registered. */
    beatIds() {
      return [...beats.keys()];
    },
    /**
     * The dashed outline of the thing inside `box` (game positions) of `source` (a locked room picture or a
     * canvas the size of the game picture), traced once and kept under `key`, with `opts` (outline.js OUTLINE:
     * width, dash, gap). Returns { canvas, x, y } to draw at (x, y), or null. See outline.js.
     */
    outline(key, source, box, opts) {
      // A picture the browser will not let us read (a page opened straight from disk) gets no outline
      // rather than stopping the game's drawing.
      if (!outlines.has(key)) {
        let o = null;
        try {
          o = outlineCanvas(source, box, opts);
        } catch (e) {
          o = null;
        }
        outlines.set(key, o);
      }
      return outlines.get(key);
    },
    /**
     * Draws the one highlight (outline.js: the dashed gold line) round the real thing a Chapter 1 goal needs (GOAL_TARGETS), pulsing
     * gently. `picture` is the locked room picture on screen (traced things come from it). `avoid` is a list of
     * boxes (the people standing there): the outline is not drawn inside them, so it never draws over Squatch
     * (Brian, 2026-11-23: "The dash outline drawing over him doesn't work."). Returns the box outlined, or null
     * when this goal has no outline.
     */
    drawGoalOutline(ctx, room, spotId, picture, time, avoid) {
      const target = GOAL_TARGETS[room + ":" + spotId];
      if (!target) return null;
      // the party draws the hall on its own locked picture: trace from that one (the older program's last room
      // picture is another room's, so the plant's outline was traced from the wrong picture and drew nothing)
      const party = beats.get("ch1-party"),
        own = party && party.roomPicture ? party.roomPicture() : null;
      own && (picture = own);
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
      } else if (target.source) {
        // a thing the game draws itself (the home morning's rocket and lunch bag): traced from its own drawing
        const src = target.source();
        const o = src ? this.outline(room + ":" + spotId + ":drawn", src, target.trace, target.line) : null;
        o && ctx.drawImage(o.canvas, o.x, o.y);
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
