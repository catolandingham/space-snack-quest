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
 *   - FLOP · bed (optional): he flops onto the crate bed and lies down on it (14A), hops back off, and says his
 *     line. While he flops, this file draws him (lying turned on his side); the room does not (pose "lie").
 *   - LOOK · calendar stays the older program's close-up (src/game/15-ch1-scene1.js), offered here too.
 * Its progress lives inside the morning's game-state field (ch1Morning: step "home", `look` for the optional
 * thing being looked at), so the step restart (↺) keeps it. Words come only from home-alone-lines.js.
 */
import { homeLine } from "./home-alone-lines.js";
import { cutawaySteps } from "./cutaway.js";
import { drawSquatchArt } from "./squatch-art.js";

// The things in the home room (the locked picture v6, game positions). A "VERB · thing" label sits next to the
// thing it names and covers neither Squatch nor any of these (the label rule in drawCap, 60-frame-draw.js).
export const HOME_THINGS = Object.freeze({
  closet: { x0: 36, x1: 180, y0: 193, y1: 345 },
  calendar: { x0: 99, x1: 167, y0: 196, y1: 279 },
  desk: { x0: 403, x1: 515, y0: 245, y1: 345 },
  bed: { x0: 84, x1: 286, y0: 395, y1: 545 },
  tv: { x0: 545, x1: 705, y0: 135, y1: 238 },
  bucket: { x0: 536, x1: 596, y0: 500, y1: 571 },
  poster: { x0: 834, x1: 914, y0: 244, y1: 324 },
  speaker: { x0: 856, x1: 893, y0: 162, y1: 203 },
});
// Where Squatch stands to use each thing (game positions), how near counts, and which thing it names.
export const HOME_SPOTS = Object.freeze({
  // Anywhere in front of the desk or just right of it; the kid's own walk to it ends right of the desk, so
  // Squatch does not hide the desk he is told to go to.
  homework: { x: 550, y: 392, box: { x0: 395, x1: 615, y0: 360, y1: 440 }, thing: "desk" },
  closet: { x: 130, y: 385, r: 55, thing: "closet" }, // in front of the closet (the wardrobe, far left)
  bed: { x: 315, y: 455, r: 55, thing: "bed" }, // beside the crate bed, on its right
});
// Where Squatch stands while the closet is open, facing it: back across the room, so neither he nor his bubble
// hides the costumes and the box he names.
const CLOSET_VIEW = Object.freeze({ x: 450, y: 560 });
// Where he jumps onto the bed from (and lands back on), and where his feet are while he lies on the locked
// picture's mattress (top edge at y 399, from x 96 to 276), head to the left, turned a quarter turn.
const FLOP_FROM = Object.freeze({ x: 310, y: 450 });
const LIE = Object.freeze({ x: 266, y: 386, a: -Math.PI / 2 });
// His drawing round his feet, in his units (ears and fur included), for the flop's box (tests).
const SQ_BOX = Object.freeze({ x0: -18, x1: 18, y0: -50, y1: 1.5 });
const PACE = Object.freeze({ walk: 230, jump: 0.5, rest: 0.8, arc: 44 });

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
  // Where his drawing is during the flop: his feet, and the angle he is turned by (0 standing, a quarter turn
  // lying). Jumping on and hopping off follow an arc; lying he stays put.
  const flopAt = (h) => {
    const k = Math.min(1, (h.pt || 0) / PACE.jump),
      ease = k * k * (3 - 2 * k),
      lie = h.phase === "rest" ? 1 : h.phase === "jump" ? ease : h.phase === "off" ? 1 - ease : 0,
      arc = h.phase === "jump" || h.phase === "off" ? PACE.arc * Math.sin(Math.PI * k) : 0;
    return { x: FLOP_FROM.x + (LIE.x - FLOP_FROM.x) * lie, y: FLOP_FROM.y + (LIE.y - FLOP_FROM.y) * lie - arc, a: LIE.a * lie };
  };
  const flopping = (h) => !!h && h.look === "bed" && ["jump", "rest", "off"].includes(h.phase);

  return {
    /** Mops is gone: Squatch has the room, with the homework as the goal. */
    start() {
      const e = E();
      // A new step for the step restart (↺): forget any start saved while Mops walked out, so ↺ at home
      // always comes back to home alone as it began.
      e.forgetSaved();
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
        const thing = HOME_THINGS[p.thing];
        // The label goes next to `thing`, clear of every home thing (drawCap); `at` is its middle, for the tests
        // and pickers that read it.
        return { id, verb, cap, who: "sq", x: p.x, y: p.y, r: p.r, box: p.box, at: [(thing.x0 + thing.x1) / 2, thing.y0], thing, avoid: Object.values(HOME_THINGS), f };
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
        // Not flopping (or ↺ in the middle of a flop): he stands, drawn by the room.
        e.get("sqPose") === "lie" && e.set("sqPose", "stand");
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
      const k = h.pt / (h.phase === "rest" ? PACE.rest : PACE.jump);
      if (h.phase === "walk" && walk(FLOP_FROM, dt)) {
        e.still("sq");
        e.face("sq", 1);
        // From here this file draws him (see draw), so the room does not draw him twice.
        e.set("sqPose", "lie");
        h.phase = "jump";
        h.pt = 0;
      } else if (h.phase === "jump" && k >= 1) {
        h.phase = "rest";
        h.pt = 0;
      } else if (h.phase === "rest" && k >= 1) {
        h.phase = "off";
        h.pt = 0;
      } else if (h.phase === "off" && k >= 1) {
        e.set("sqPose", "stand");
        e.place("sq", FLOP_FROM.x, FLOP_FROM.y);
        e.face("sq", -1);
        h.phase = "said";
        e.queue([e.say("sq", homeLine("sq-bed")), e.run(back)]);
      }
    },
    /** Drawn over the room: Squatch while he flops onto the bed, lies on it and hops off. */
    draw(ctx) {
      const h = m();
      if (!flopping(h)) return;
      const f = flopAt(h),
        e = E();
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(f.a);
      // The room's Squatch at the room's size and outline (2 of his units), turned on his side.
      drawSquatchArt(ctx, 0, 0, e.squatchScale(), { line: 2 * e.squatchScale(), shadow: false });
      ctx.restore();
    },
    /** For tests: where the flop draws him (feet, angle and the box round his drawing), or null. */
    flop() {
      const h = m();
      if (!flopping(h)) return null;
      const f = flopAt(h),
        k = E().squatchScale(),
        c = Math.cos(f.a),
        s = Math.sin(f.a),
        pts = [
          [SQ_BOX.x0, SQ_BOX.y0],
          [SQ_BOX.x1, SQ_BOX.y0],
          [SQ_BOX.x0, SQ_BOX.y1],
          [SQ_BOX.x1, SQ_BOX.y1],
        ].map(([x, y]) => [f.x + (x * c - y * s) * k, f.y + (x * s + y * c) * k]);
      const xs = pts.map((p) => p[0]),
        ys = pts.map((p) => p[1]);
      return { ...f, phase: h.phase, box: { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) } };
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
