/**
 * The talk at home, in every ending where Mops is there (Brian 2026-11-25: "Worry in the hall, shown at home", then
 * "The talk, reordered": "Worry comes after You have me"). It ends both party endings: "Keep going" after an alarm
 * (party-after-alarm.js) and closing time, when Mops finds him in the empty hall and they walk home together
 * (party-endings.js). One bubble at a time, each waiting for NEXT (the wordless walks and the hat play themselves).
 *   Squatch goes to the flyer he left on the floor by the door (it glows: the thing he wanted to show Mops), takes it
 *   in his paw and comes to the middle of the room (round the back of the room when Mops is in the way: nobody walks
 *   through anybody). Mops steps over beside him and looks at him: the costume and the flyer in his paw glow.
 *   Mops "You went to the party." / Squatch "Everyone out there has someone." / "Everyone except me." / Mops "You
 *   have me." / Mops lifts the piece on his head off him and sets it down by his foot (nothing on his head: a pat) /
 *   Squatch holds the flyer up: "But look. Robots are coming to do your job." / Mops "Nobody is replacing me. They
 *   need me here." / Squatch "But why do I have to hide from everyone but you?" / "And why can't the Guardians and I
 *   be together?" / Mops "I've been waiting to show you this." / "Here's why you have to hide." (he answers only the
 *   first question, on purpose) / with no words Mops walks to the TV and presses its button with a horn (he has no
 *   thumbs) / the TV comes on / beat 20, the TV story, full screen.
 * Positions are game positions in the home room. Everything here is PLACEHOLDER timing unless marked.
 */
import { HOME_ROOM } from "./party-hall.js";
import { wornNow } from "./party-outfit.js";
import { liftTo } from "./party-free-art.js";

// How fast they walk at home, how far apart they stand to talk and for the hat, how long Mops looks, how long the
// hat's lift (or the pat) and setting it down take, where the hat is set down (up and out from his foot), and how
// long taking the flyer and holding it up take.
export const TALK = Object.freeze({ walk: 150, beside: 170, close: 138, look: 1.4, lift: 2.6, setDown: 0.5, hatUp: 14, hatOut: 52, take: 0.45, up: 0.35 });
// Where they stand. Squatch in the middle of the room in front of the bucket and the Guardian box (`sq`), Mops beside
// him on the door side. Squatch takes the flyer standing at `take` (left of it, by the door). He never walks
// through Mops (the home room draws them big): when Mops stands between him and the flyer, he goes round along the
// back of the room (`backLane`), where he passes behind Mops without touching him.
export const TALK_SPOTS = Object.freeze({
  sq: Object.freeze({ x: 400, y: 590 }),
  take: Object.freeze({ x: HOME_ROOM.flyer.x - 60, y: HOME_ROOM.flyer.y + 40 }),
  backLane: 395,
});
// The TV on the home room's shelf, measured on the locked home picture (v6): its dark frame is 566..683 x 134..225,
// its screen 572..677 x 141..212, the shelf under it starts at 225. The picture shows it off; lit, and its button,
// are the party's own drawings, shown only for this moment (party-free-art.js drawTv). The button is on the
// frame's bottom edge, at the end Mops walks up to. `stand` is where his feet are for the top of his front horn to
// be `hop` under the button; the press is a small hop that long, and the TV comes on at its top (`peak`). `hold`
// is how long the lit TV is shown before beat 20 (a wordless moment plays itself: 30a).
// PLACEHOLDERS for Brian: the press 0.9 s, the hold 1.6 s.
const HORN_TOP = Object.freeze({ x: 27 * 3, y: 45 * 3 }); // the top of his front horn from his feet, as he is drawn at home
const TV_BUTTON = Object.freeze({ x: 672, y: 219, r: 4 });
const TV_HOP = 14;
export const TV = Object.freeze({
  button: TV_BUTTON,
  screen: Object.freeze({ x: 624, y: 176, x0: 572, x1: 678, y0: 141, y1: 213 }),
  stand: Object.freeze({ x: TV_BUTTON.x + HORN_TOP.x, y: TV_BUTTON.y + HORN_TOP.y + TV_HOP }),
  hop: TV_HOP,
  press: 0.9,
  peak: 0.5,
  hold: 1.6,
});

/** `h`: { E, P, sq, say, sound, finish () (beat 20) }. */
export function createTalk(h) {
  const E = () => h.E();
  const P = () => h.P();
  /**
   * The talk's steps, for the game's queue, from wherever the two of them are now (Squatch standing, Mops in the
   * room). Ends with the hand-over to beat 20.
   */
  function steps() {
    const e = E(),
      S = TALK_SPOTS.sq,
      K = TALK_SPOTS.take,
      B = TALK_SPOTS.backLane,
      wait = (s) => [e.run(() => (P().pt = 0)), e.until(() => !P() || P().pt >= s)],
      // a walk through waypoints, worked out when it starts (from where he is then)
      walkVia = (plan) => {
        let pts = null;
        return e.until((dt) => {
          pts = pts || plan();
          while (pts.length && e.step("sq", pts[0].x, pts[0].y, TALK.walk, dt)) pts.shift();
          return !pts.length;
        });
      },
      // Mops stands between him and the place he is going: round the back of the room
      between = (a, b) => {
        // (a Mops who has not come in yet is in nobody's way)
        if (E().get("moPose") === "hidden") return false;
        const m = e.pos("mops");
        return m && Math.min(a, b) - 40 < m.x && m.x < Math.max(a, b) + 40;
      };
    return [
      e.run(() => {
        const q = P();
        q.flyerGlow = q.flyer === "floor";
        e.walkOff();
      }),
      // Squatch fetches the flyer from by the door (if it is not in his paw already)
      walkVia(() => {
        const s = h.sq();
        if (P().flyer !== "floor") return [];
        return between(s.x, K.x) ? [{ x: s.x, y: B }, { x: K.x, y: B }, { ...K }] : [{ ...K }];
      }),
      e.run(() => {
        const q = P();
        if (q.flyer !== "floor") return;
        e.still("sq");
        e.face("sq", 1);
        q.flyer = "take";
        q.take = 0;
        h.sound.one("fwip");
      }),
      e.until(() => !P() || P().take == null || P().take >= 1),
      e.run(() => {
        const q = P();
        q.take = null;
        q.flyer = "paw";
        q.flyerGlow = false;
        e.walkOff();
      }),
      // to the middle of the room (round the back if Mops is in the way)
      walkVia(() => {
        const s = h.sq();
        return between(s.x, S.x) ? [{ x: s.x, y: B }, { x: S.x, y: B }, { ...S }] : [{ ...S }];
      }),
      e.run(() => {
        e.still("sq");
        e.face("sq", 1);
        // Mops not in the room yet (he comes home now, or comes in after Squatch): in through the door
        if (E().get("moPose") !== "hidden") return;
        e.set("moPose", "stand");
        e.place("mops", HOME_ROOM.mopsDoor.x, HOME_ROOM.mopsDoor.y);
        e.face("mops", -1);
        // (going home early, his door was heard a moment ago already: party-home-early.js)
        P().doorHeard || h.sound.one("door");
      }),
      e.until((dt) => e.step("mops", S.x + TALK.beside, S.y + 6, TALK.walk * 0.7, dt)),
      // Mops looks at him: the costume and the flyer in his paw glow
      e.run(() => (e.still("mops"), e.face("mops", -1), (P().costumeLook = true))),
      ...wait(TALK.look),
      e.run(() => (P().costumeLook = false)),
      h.say("mops", "mops-went"),
      h.say("sq", "sq-someone"),
      h.say("sq", "sq-except"),
      h.say("mops", "mops-have-me"),
      // No words: Mops steps close and gently lifts the piece on his head off him (or pats his head).
      e.until((dt) => e.step("mops", S.x + TALK.close, S.y + 6, TALK.walk * 0.5, dt)),
      e.run(() => {
        const q = P();
        e.still("mops");
        q.lift = { id: wornNow(q).head || "", k: 0 };
        h.sound.one(q.lift.id ? "fwip" : "pop");
      }),
      e.until(() => !P() || !P().lift || P().lift.k >= 1),
      // He sets the piece down on the floor by Squatch's foot, clear of his beard.
      e.run(() => {
        const q = P();
        if (!q.lift.id) return;
        const m = e.pos("mops"),
          s = h.sq();
        Object.assign(q.lift, { held: liftTo(m, s, e.squatchScale()), rest: { x: s.x + TALK.hatOut, y: Math.max(m.y, s.y) - TALK.hatUp }, set: 0 });
      }),
      e.until(() => !P() || !P().lift || !P().lift.id || P().lift.set >= 1),
      // and steps back beside him for the rest of the talk (close only for the hat: they are drawn big at home)
      e.until((dt) => e.step("mops", S.x + TALK.beside, S.y + 6, TALK.walk * 0.5, dt)),
      e.run(() => (e.still("mops"), e.face("mops", -1))),
      ...wait(0.4),
      // his worry, the flyer held up (Brian 2026-11-25: "Worry comes after You have me")
      e.run(() => ((P().flyerUp = 0), h.sound.one("fwip"))),
      e.until(() => !P() || P().flyerUp >= 1),
      h.say("sq", "sq-robots-coming"),
      h.say("mops", "mops-need-me"),
      e.run(() => (P().flyerUp = null)),
      // Squatch's two questions; Mops answers only the first (Brian 2026-11-24, night)
      h.say("sq", "sq-why-hide"),
      h.say("sq", "sq-why-guardians"),
      h.say("mops", "mops-waiting"),
      h.say("mops", "mops-heres-why"),
      // No words: Mops walks to the TV (its button glows) and presses it with his horn; the TV comes on (tick).
      e.run(() => (P().tv = { phase: "walk", k: 0 })),
      e.until((dt) => e.step("mops", TV.stand.x, TV.stand.y, TALK.walk, dt)),
      e.run(() => (e.still("mops"), e.face("mops", -1), (P().tv = { phase: "press", k: 0 }))),
      e.until(() => !P() || !P().tv || P().tv.phase === "on"),
      ...wait(TV.hold),
      e.run(() => h.finish()),
    ];
  }
  /** Every frame: taking the flyer, holding it up, the hat's lift (or the pat), setting it down, the horn press. */
  function tick(p, dt) {
    p.take != null && p.take < 1 && (p.take = Math.min(1, p.take + dt / TALK.take));
    p.flyerUp != null && p.flyerUp < 1 && (p.flyerUp = Math.min(1, p.flyerUp + dt / TALK.up));
    p.lift && p.lift.k < 1 && (p.lift.k = Math.min(1, p.lift.k + dt / TALK.lift));
    p.lift && p.lift.set != null && p.lift.set < 1 && (p.lift.set = Math.min(1, p.lift.set + dt / TALK.setDown));
    // The horn press: a small hop, his horn's top on the button at the top of it, where the TV comes on.
    const v = p.tv;
    if (v && v.phase === "press") {
      const was = v.k,
        e = E();
      v.k = Math.min(1, v.k + dt / TV.press);
      e.place("mops", TV.stand.x, TV.stand.y - Math.sin(Math.PI * v.k) * TV.hop);
      was < TV.peak && v.k >= TV.peak && (h.sound.one("click"), (v.lit = 0));
      v.k >= 1 && (v.phase = "on");
    }
    v && v.lit != null && (v.lit += dt);
  }
  return { steps, tick };
}
