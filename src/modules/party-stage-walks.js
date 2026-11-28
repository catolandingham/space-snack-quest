/**
 * The stage's people moving by themselves in P3 and P4 (moved out of party.js, which was too long): the Croc Boys
 * walking on once Isfred has called them (Brian 2026-11-25, "Shouldn't he be doing announcement alone and then have
 * them join?"), Isfred carrying a mic stand to the singer's place and setting it down in front of him once the band
 * stands in its places, then walking off to the bar and setting the flyer down on the counter's far end (Brian
 * 2026-11-26, showing 7 at 0:11: "make this transition a little bit slower. Croc Boys take a moment to get up on
 * stage. They should probably get a microphone... the manager's walking over and drops it. Take a moment for us to
 * see what's happening"), the band's clock while it plays, and P4's clock for the moving cones (party-hall.js
 * P4_SWEEP).
 */
import { CAST, FLYER, stepTo } from "./party-hall.js";

// PLACEHOLDERS: the Croc Boys walk on from this far left of their places, at this speed (pixels a second): 2 s
// (1.25 s until 2026-11-26: from 150 at 120).
export const BAND_WALK_ON = Object.freeze({ from: 200, speed: 100 });
/**
 * The mic stand (PLACEHOLDERS): where it stands once set (`at`, its foot, in front of the singer, CAST.band[1]), where
 * Isfred stands to set it (`isfredAt`), how long his walk there takes (`to`) and his bend to set it down (`down`),
 * and where he carries it (`hand`, from his feet).
 */
export const MIC = Object.freeze({ at: Object.freeze({ x: 330, y: 270 }), isfredAt: Object.freeze({ x: 352, y: 262 }), to: 1.0, down: 0.6, hand: Object.freeze({ dx: -16, dy: 4 }) });

/** The Croc Boys at the stage's left end, about to walk on (P3, at Isfred's band line). */
export const bandOffStage = () => CAST.band.map((b) => ({ x: b.x - BAND_WALK_ON.from, y: b.y, walk: 1 }));

/**
 * One frame. `p` is the party's state, `sound` its sounds, `bandIn` how long the band's coming on lasts (seconds):
 * once all three are in their places they play and the guests pair off to dance.
 */
export function tickStageWalks(p, dt, sound) {
  // Isfred, once the band is called: to the singer's place with the mic stand; once all three Croc Boys stand in their
  // places he bends and sets it down in front of the singer; then off the stage to the bar's top end, where he turns
  // to the counter, bends and puts the flyer down on its far end (FLYER: `to` the walk, `down` the bend).
  if (p.isfred.walking) {
    const w = p.isfred,
      A = CAST.isfred,
      M = MIC.isfredAt,
      B = CAST.isfredBar,
      mix = (a, b, k) => ((w.x = a.x + (b.x - a.x) * k), (w.y = a.y + (b.y - a.y) * k));
    w.wt = (w.wt || 0) + dt;
    if (!p.mic) {
      if (w.wt < MIC.to) mix(A, M, w.wt / MIC.to);
      else if (p.bandAt) ((w.x = M.x), (w.y = M.y), (w.wait = w.wt - MIC.to));
      else {
        w.micBend = Math.min(1, (w.wt - MIC.to - (w.wait || 0)) / MIC.down);
        w.micBend >= 1 && ((p.mic = true), (w.micBend = 0), (w.wt = 0), sound.one("pop"));
      }
    } else if (w.wt < FLYER.to) mix(M, B, w.wt / FLYER.to);
    else if (w.wt < FLYER.to + FLYER.down) (mix(B, B, 0), (w.face = 0), (w.bend = (w.wt - FLYER.to) / FLYER.down));
    else {
      p.flyer || ((p.flyer = "stage"), sound.one("pop"));
      p.isfred = { x: B.x, y: B.y, atBar: true };
    }
  }
  // the band's clock while it plays: the beat they bob to (party-view.js bandBeat)
  p.band && (p.bandT = (p.bandT || 0) + dt);
  // P4's clock for the moving cones: the same every play
  p.scene === "P4" && (p.sweepT = (p.sweepT || 0) + dt);
  // P3: the Croc Boys walk on and take their places; they play only after the close-up starts (party.js P3)
  if (p.scene === "P3" && p.bandAt && p.bandAt.some((b) => b.walk)) {
    let all = true;
    p.bandAt.forEach((b, i) => (all = stepTo(b, CAST.band[i].x, CAST.band[i].y, BAND_WALK_ON.speed, dt) && all));
    all && (p.bandAt = null);
  }
}

/** Where the mic stand is drawn now ({ x, y, carried }), or null: carried by Isfred, then standing in front of the singer. */
export function micNow(p) {
  if (p.mic) return { x: MIC.at.x, y: MIC.at.y, carried: false };
  const w = p.isfred;
  if (!w || !w.walking) return null;
  const k = w.micBend || 0;
  return { x: w.x + MIC.hand.dx + (MIC.at.x - (w.x + MIC.hand.dx)) * k, y: w.y + MIC.hand.dy + (MIC.at.y - (w.y + MIC.hand.dy)) * k, carried: true };
}
