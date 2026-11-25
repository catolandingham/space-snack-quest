/**
 * The stage's people moving by themselves in P3 and P4 (moved out of party.js, which was too long): Isfred walking
 * off to the bar and setting the flyer down on the counter's far end, the Croc Boys walking on once he has called
 * them (Brian 2026-11-25, "Shouldn't he be doing announcement alone and then have them join?"), and P4's clock for
 * the moving cones (party-hall.js P4_SWEEP).
 */
import { CAST, FLYER, stepTo } from "./party-hall.js";

// PLACEHOLDERS: the Croc Boys walk on from this far left of their places, at this speed (pixels a second).
export const BAND_WALK_ON = Object.freeze({ from: 150, speed: 120 });

/** The Croc Boys at the stage's left end, about to walk on (P3, at Isfred's band line). */
export const bandOffStage = () => CAST.band.map((b) => ({ x: b.x - BAND_WALK_ON.from, y: b.y, walk: 1 }));

/**
 * One frame. `p` is the party's state, `sound` its sounds, `bandIn` how long the band's coming on lasts (seconds):
 * once all three are in their places they play and the guests pair off to dance.
 */
export function tickStageWalks(p, dt, sound, bandIn) {
  // Isfred walks off the stage to the bar's top end once the band is called; there he turns to the counter, bends
  // and puts the flyer down on its far end (FLYER: `to` the walk, `down` the bend).
  if (p.isfred.walking) {
    const w = p.isfred,
      A = CAST.isfred,
      B = CAST.isfredBar,
      mix = (a, b, k) => ((w.x = a.x + (b.x - a.x) * k), (w.y = a.y + (b.y - a.y) * k));
    w.wt = (w.wt || 0) + dt;
    if (w.wt < FLYER.to) mix(A, B, w.wt / FLYER.to);
    else if (w.wt < FLYER.to + FLYER.down) (mix(B, B, 0), (w.face = 0), (w.bend = (w.wt - FLYER.to) / FLYER.down));
    else {
      p.flyer || ((p.flyer = "stage"), sound.one("pop"));
      p.isfred = { x: B.x, y: B.y, atBar: true };
    }
  }
  // P4's clock for the moving cones: the same every play
  p.scene === "P4" && (p.sweepT = (p.sweepT || 0) + dt);
  if (p.scene === "P3" && p.bandAt && p.bandAt.some((b) => b.walk)) {
    let all = true;
    p.bandAt.forEach((b, i) => (all = stepTo(b, CAST.band[i].x, CAST.band[i].y, BAND_WALK_ON.speed, dt) && all));
    if (all) ((p.bandAt = null), (p.band = true), (p.mode = "pairs"), (p.pt = Math.max(p.pt, bandIn - 0.6)));
  }
}
