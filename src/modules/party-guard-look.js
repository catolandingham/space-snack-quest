/**
 * The searching guard's look (Brian 2026-11-24, on the guard who follows Squatch home: "he doesn't seem alarmed").
 * While a guard looks for him, his head turns from side to side with the swing of his cone, he leans forward to
 * look, and (in Squatch's room, where he stands alone) a "?" sits over him until he sees Squatch ("!") or gives
 * up. It is the same guard drawing (party-art.js drawPerson, LOOKS.guard) with two of its parts moved: the head's
 * features and the lean of his upper body. No words.
 *   g.turn  -1 to 1 while he looks round (party-alarm.js sets it from the cone's own swing), null or undefined
 *           while he walks; g.sees  true once he sees Squatch; g.leaving  true once he has given up.
 */
import { LOOKS, TORCH } from "./party-art.js";
import { EYE_ABOVE_FEET } from "./party-watch.js";

// PLACEHOLDERS for Brian: how far he leans to look (radians), how much more as his look swings down to the floor,
// and how big the "?" over him is (game pixels, as the "!" is).
export const SEARCH_LOOK = Object.freeze({ lean: 0.12, swing: 0.05, mark: 48, markUp: 26 });

/** True while this guard is looking for him: looking round, not yet seeing him, not walking off. */
export function searching(g) {
  return !!g && g.turn != null && !g.sees && !g.leaving;
}
/** The guard's look for drawPerson: the plain guard, or the searching one (head turned, leaning in). */
export function guardLook(g) {
  if (!searching(g)) return LOOKS.guard;
  return { ...LOOKS.guard, headTurn: g.turn, lean: SEARCH_LOOK.lean - SEARCH_LOOK.swing * g.turn };
}
/**
 * Where the guard's flashlight is, as a move from where his sight is measured (party-watch.js coneFrom's `draw`):
 * the front of the flashlight in his hand, for a guard drawn `h` tall facing `f`, leaning as he looks.
 */
export function torchShift(g, h, f) {
  const k = h / 100,
    lean = guardLook(g).lean || 0,
    // drawPerson tips everything above the hips (34 up) by `lean`
    x = TORCH.x * Math.cos(lean) - (TORCH.y + 34) * Math.sin(lean),
    y = -34 + TORCH.x * Math.sin(lean) + (TORCH.y + 34) * Math.cos(lean);
  return { dx: (f < 0 ? -1 : 1) * x * k, dy: y * k + EYE_ABOVE_FEET };
}
/**
 * The mark over a guard drawn `h` tall with feet at (g.x, g.y), facing `f`: "!" when he sees Squatch, "?" while he
 * searches, or null. It sits over his head, which leans forward with him.
 */
export function guardMark(g, h, f) {
  const mark = g && g.sees ? "!" : searching(g) ? "?" : "";
  if (!mark) return null;
  const lean = mark === "?" ? guardLook(g).lean : 0;
  return { mark, x: g.x + (f < 0 ? -1 : 1) * Math.sin(lean) * h * 0.5, y: g.y - h - SEARCH_LOOK.markUp, size: SEARCH_LOOK.mark };
}
