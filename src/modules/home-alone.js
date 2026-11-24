/**
 * Squatch home alone (Chapter 1, the morning plan's PR 3): from Mops walking out to "That evening…".
 * Brian G 567: "you could go look at the closet, you could go look at the bed, but you don't have to. The one
 * thing you'll have to do is go to the desk and do homework." His answers of 2026-11-23 (6A, Q7, 9a, 11a).
 *   - The goal chip says "Squatch: do your homework"; only the desk gets the yellow outline (goal-targets.js,
 *     "closet:homework"). Nothing moves on by itself.
 *   - DO · homework (required): straight into the homework cutaway (homework-cutaway.js), then `done()` (the
 *     morning's "That evening…").
 *   - OPEN · closet (optional): Squatch steps back to where he can see in, the door opens (the locked
 *     open-closet picture, unchanged) and the game draws the small blue G box on the closet floor (Brian's
 *     approved look, docs/approved-art/closet/); he says his line; the tap that takes it away shuts the door,
 *     so the calendar on it is back (Q7).
 *   - FLOP · bed (optional): he flops onto the crate bed, lies there a moment, hops back off, and says his line.
 *   - LOOK · calendar stays the older program's close-up (src/game/15-ch1-scene1.js), offered here too.
 * Its progress lives inside the morning's game-state field (ch1Morning: step "home", `look` for the optional
 * thing being looked at), so the step restart (↺) keeps it. Words come only from home-alone-lines.js.
 */
import { homeLine } from "./home-alone-lines.js";
import { cutawaySteps } from "./cutaway.js";

// Where Squatch stands to use each thing (game positions), how near counts, and where the "VERB · thing"
// label sits (on the thing itself).
export const HOME_SPOTS = Object.freeze({
  homework: { x: 459, y: 380, r: 60, at: [459, 226] }, // in front of the desk
  closet: { x: 130, y: 385, r: 55, at: [108, 182] }, // in front of the closet (the wardrobe, far left)
  bed: { x: 315, y: 455, r: 55, at: [186, 396] }, // beside the crate bed, on its right
});
// Where Squatch stands while the closet is open, facing it: back across the room, so neither he nor his bubble
// hides the costumes and the box he names.
const CLOSET_VIEW = Object.freeze({ x: 450, y: 560 });
// Where he jumps onto the bed from (and lands back on).
const FLOP_FROM = Object.freeze({ x: 310, y: 450 });
// The bed drawing: Squatch sitting is drawn at (205, 444); each unit of sqLift raises him 22 (see the bed
// drawing in src/game/60-frame-draw.js). sqBedX moves him sideways from 205.
const BED = Object.freeze({ x: 205, y: 444, lift: 22 });
const PACE = Object.freeze({ walk: 230, jump: 0.45, rest: 0.6, arc: 1.6 });

/**
 * The Guardian Box, in picture pixels of the locked home picture (1280 x 830), exactly as Brian approved it on
 * 2026-11-23 ("11a", docs/approved-art/closet/closet-gbox-approved-2026-11-23.png): outline included it spans
 * x 153 to 205 and y 402 to 438, under the spare shirt.
 */
export const GUARDIAN_BOX = Object.freeze({ x0: 153, y0: 402, x1: 205, y1: 438, fill: "rgb(52,120,246)", ink: "rgb(34,36,44)", line: 3, radius: 4, letter: 21 });
const PICTURE = Object.freeze({ w: 1280, h: 830 });

/**
 * `E()` is the bridge's engine, `M()` the morning's progress, `step(name, extra)` sets it, and `done()` runs
 * after the homework (the morning's "That evening…").
 */
export function createHomeAlone({ E, M, step, done }) {
  const m = () => {
    const x = M();
    return x && x.step === "home" ? x : null;
  };
  const busy = (look) => {
    const e = E();
    e.set("ctrl", false);
    e.set("act", null);
    e.still("sq");
    M().look = look;
    M().phase = "walk";
    M().pt = 0;
  };
  const back = () => {
    const e = E(),
      h = m();
    h && ((h.look = ""), (h.phase = ""));
    e.set("ctrl", true);
    e.chipNow();
  };
  function homework() {
    const e = E();
    busy("homework");
    e.set("ch1Chip", "");
    e.queue([...cutawaySteps("homework"), e.run(done)]);
  }
  // Moves Squatch toward (x, y); true once he is there.
  const walk = (to, dt) => E().step("sq", to.x, to.y, PACE.walk, dt);
  // Where his sitting drawing is when he stands at (x, y): the same place, so switching poses does not jump.
  const liftAt = (y) => (BED.y - y) / BED.lift;

  return {
    /** Mops is gone: Squatch has the room, with the homework as the goal. */
    start() {
      const e = E();
      step("home", { look: "", phase: "" });
      e.set("sqPose", "stand");
      e.set("ch1Chip", homeLine("chip-homework"));
      e.set("ctrl", true);
      e.chipNow();
    },
    /** True while Squatch is home alone and free to walk (not in the middle of looking at something). */
    free() {
      const h = m();
      return !!h && !h.look;
    },
    /** True from the moment Mops is gone until the homework starts. */
    active() {
      return !!m();
    },
    /** The spots: the desk first (it is the goal, so it gets the outline), then the closet and the bed. */
    spots() {
      const h = m(),
        e = E();
      if (!h || h.look || !e.get("ctrl")) return null;
      const spot = (id, words, f) => {
        const [verb, cap] = words.split(" · "),
          p = HOME_SPOTS[id];
        return { id, verb, cap, who: "sq", x: p.x, y: p.y, r: p.r, at: p.at, f };
      };
      return [
        spot("homework", homeLine("button-homework"), homework),
        spot("closet", homeLine("button-closet"), () => busy("closet")),
        spot("bed", homeLine("button-bed"), () => busy("bed")),
      ];
    },
    /** Every frame: the walk to the closet or the bed, the flop, and keeping the closet door right. */
    tick(dt) {
      const h = m(),
        e = E();
      if (!h) return;
      dt = dt || 0;
      h.pt = (h.pt || 0) + dt;
      // The door is open only while Squatch looks into the closet (after ↺ it is shut again).
      const door = h.look === "closet" && h.phase === "open" ? "open" : "closed";
      e.get("wardrobe") !== door && e.set("wardrobe", door);
      if (!h.look) {
        // Not flopping (or ↺ in the middle of a flop): he stands, drawn at his feet.
        e.get("sqPose") === "sit" && e.set("sqPose", "stand");
        e.get("sqBedX") && e.set("sqBedX", 0);
        e.get("sqLift") && e.set("sqLift", 0);
        return;
      }
      if (h.look === "closet" && h.phase === "walk" && walk(CLOSET_VIEW, dt)) {
        e.still("sq");
        e.face("sq", -1);
        h.phase = "open";
        e.set("wardrobe", "open");
        e.queue([e.say("sq", homeLine("sq-closet")), e.run(back)]);
      }
      if (h.look !== "bed") return;
      const k = Math.min(1, h.pt / (h.phase === "rest" ? PACE.rest : PACE.jump));
      const from = liftAt(FLOP_FROM.y);
      if (h.phase === "walk" && walk(FLOP_FROM, dt)) {
        e.still("sq");
        e.face("sq", -1);
        e.set("sqPose", "sit");
        e.set("sqBedX", FLOP_FROM.x - BED.x);
        e.set("sqLift", from);
        h.phase = "jump";
        h.pt = 0;
      } else if (h.phase === "jump") {
        // Up and over onto the bed, landing flopped back (sqLift -1 leans him back on the pillow).
        e.set("sqBedX", (FLOP_FROM.x - BED.x) * (1 - k));
        e.set("sqLift", from + (-1 - from) * k + PACE.arc * Math.sin(Math.PI * k));
        k >= 1 && ((h.phase = "rest"), (h.pt = 0));
      } else if (h.phase === "rest") {
        k >= 1 && ((h.phase = "off"), (h.pt = 0));
      } else if (h.phase === "off") {
        // Back off the bed to where he jumped from.
        e.set("sqBedX", (FLOP_FROM.x - BED.x) * k);
        e.set("sqLift", -1 + (from + 1) * k + PACE.arc * Math.sin(Math.PI * k));
        if (k >= 1) {
          e.set("sqPose", "stand");
          e.set("sqBedX", 0);
          e.set("sqLift", 0);
          e.place("sq", FLOP_FROM.x, FLOP_FROM.y);
          e.face("sq", -1);
          h.phase = "said";
          e.queue([e.say("sq", homeLine("sq-bed")), e.run(back)]);
        }
      }
    },
    /** Drawn on the room picture, under the people: the G box on the closet floor while the door is open. */
    drawOnRoom(ctx) {
      const h = m();
      if (!h || E().get("wardrobe") !== "open") return;
      const b = GUARDIAN_BOX,
        half = b.line / 2;
      ctx.save();
      ctx.scale(960 / PICTURE.w, 640 / PICTURE.h);
      ctx.beginPath();
      ctx.roundRect(b.x0 + half, b.y0 + half, b.x1 - b.x0 - b.line, b.y1 - b.y0 - b.line, b.radius);
      ctx.fillStyle = b.fill;
      ctx.fill();
      ctx.lineWidth = b.line;
      ctx.strokeStyle = b.ink;
      ctx.stroke();
      // The letter is part of the approved picture, not reading text: drawn at the picture's own size.
      ctx.font = `900 ${b.letter}px system-ui, -apple-system, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("G", (b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2 + 1);
      ctx.restore();
    },
  };
}
