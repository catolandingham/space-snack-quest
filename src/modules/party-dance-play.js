/**
 * The dance's stars and sounds (party-dance.js is the rules, party-dance-art.js the drawings). party-free.js calls
 * these each frame and for each tap while the dance is open. `h` is the party's helpers (see party-free.js
 * createFreePlay). Stars are added the way the photo's are (the engine's addStars), under the cap in
 * party-dance.js (dancePays); what the dance has paid in each song is kept on the party's state as p.dancePay.
 * Every sound goes through the party's sounds (the master volume; silent with sound off).
 */
import { tickDance, danceTap, dancePays } from "./party-dance.js";

// What each thing that can happen sounds like.
const SOUNDS = Object.freeze({ hit: ["robot"], wrong: ["uhoh"], slow: ["uhoh"], perfect: ["cheer", "sparkle"], round: ["clap"] });

function settle(p, ev, h) {
  const d = p.dance,
    pay = p.dancePay || (p.dancePay = {});
  for (const what of ev) {
    for (const name of SOUNDS[what] || []) h.sound.one(name);
    if (what !== "hit" && what !== "perfect") continue;
    const stars = dancePays(pay, d.song || 0, what);
    if (!stars) continue;
    h.E().addStars(stars);
    // shown where it happens: "+5" by the spot he just hit, the bonus over his head
    if (what === "hit") d.fx[d.fx.length - 1].stars = stars;
    else d.fx.push({ kind: "bonus", t: -0.25, stars });
  }
}
/** One frame of the dance: a ring that closes costs him that spot. */
export function danceFrame(p, dt, h) {
  p.dance && settle(p, tickDance(p.dance, dt), h);
}
/** A tap on the dance at screen point (x, y); `size` is the dance view's { w, h }. */
export function danceTouch(p, x, y, size, h) {
  p.dance && settle(p, danceTap(p.dance, x, y, size.w, size.h), h);
}
