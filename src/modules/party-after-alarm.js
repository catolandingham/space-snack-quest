/**
 * After an alarm, at home (Brian's answers of 2026-11-24, asks/video-notes-2026-11-24/ANSWERS.md; it replaces the
 * old P8a). The alarm itself is the one capture rule, unchanged (party-alarm.js): he runs home, a guard follows,
 * HIDE · bed or be caught.
 *   The card. Once he is under the bed: "There's more to find at the party!", the party's things as pictures, and
 *     two buttons (party-card.js). The game waits behind it.
 *   "Back to the party" (still P7). The guard comes in with his flashlight, sweeps the room, gives up and leaves;
 *     "They lost you."; Mops does not come. Squatch comes out, puts the pieces he lost back on at his closet, and
 *     walks back out through his door. The party carries on from where it was (party-free.js `resume`).
 *   "Keep going" (P8a; ↺ restarts it from under the bed). The guard comes in and sweeps the room; Mops comes in;
 *     their six lines; the guard leaves; Squatch comes out from under the bed still in costume; Mops looks at the
 *     costume; "You went to the party."; "Everyone out there has someone."; "Everyone except me."; "You have me.";
 *     Mops gently lifts the piece on his head off him, with no words (nothing on his head: a gentle pat). Then
 *     Squatch's two questions and Mops's two answers (he answers only the first, on purpose); with no words Mops
 *     walks to the TV and presses its button with a horn (he has no thumbs); the TV comes on; beat 20.
 *   Hiding in a plant in the hall and walking home later: a guard follows him in a moment later all the same, so
 *     the card and both endings are the same (`follow`).
 */
import { HOME_ROOM, HALL_DOOR } from "./party-hall.js";
import { startAlarm } from "./party-alarm.js";
import { openFullScreen, closeFullScreen, fullScreenOpen } from "./fullscreen.js";
import { found, cardLayout, cardButtonAt, drawCard } from "./party-card.js";
import { wornNow } from "./party-outfit.js";
import { liftTo } from "./party-free-art.js";

// PLACEHOLDERS for Brian: how fast they walk at home, how far apart they stand to talk and for the hat, how long
// Mops looks at the costume, how long a piece takes to go back on, and how long the hat's lift (or the pat) plays.
export const AFTER = Object.freeze({ walk: 150, beside: 170, close: 138, look: 1.4, redress: 0.45, lift: 2.6, setDown: 0.5, hatUp: 24 });
// Where they stand in the home room (game positions): Mops walks in past the guard (`mopsPast`, well in front of
// him) and stops between the guard and the bed to talk (`mopsTalk`), so the guard's way out is clear; and Squatch
// once he is out from under the bed (beside it, on the open floor in front of the bucket and the Guardian box,
// which are part of the locked room picture).
// The TV on the home room's shelf, measured on the locked home picture (v6): its dark frame is 566..683 x 134..225,
// its screen 572..677 x 141..212, the shelf under it starts at 225. The picture shows it off; lit, and its button,
// are the party's own drawings, shown only for this moment (party-free-art.js drawTv). The button is on the
// frame's bottom edge, at the end Mops walks up to. `stand` is where his feet are for the top of his front horn to
// be `hop` under the button; the press is a small hop that long, and the TV comes on at its top (`peak`). `hold`
// is how long the lit TV is shown before beat 20 (a wordless moment plays itself: 30a).
// PLACEHOLDERS for Brian: the press 0.9 s, the hold 1.6 s, setting the hat down 0.5 s.
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
export const AFTER_SPOTS = Object.freeze({ mopsPast: Object.freeze({ x: 850, y: 548 }), mopsTalk: Object.freeze({ x: 662, y: 540 }), out: Object.freeze({ x: 400, y: 590 }) });

/**
 * `h`: { E, P, sq, say, chip, control, sound, homeRoom, pace, guests (the approved art), finish () (beat 20),
 * resume (p) (the party goes on, party-free.js) }.
 */
export function createAfterAlarm(h) {
  const E = () => h.E();
  const P = () => h.P();
  // What the card's pictures are drawn with: Squatch as the game draws him, and a guest's approved picture `tall` high.
  const art = {
    squatch: (ctx, x, y, scale) => E().drawSquatch(ctx, x, y, scale, { f: 1 }),
    guest: (ctx, id, x, y, tall) => h.guests.drawId(ctx, id, x, y, tall / (h.guests.height(id, 1) || 1), 0),
  };

  // ---------- the card ----------
  /** He is under the bed with the alarm on: the card (once; a restart of P8a has already chosen). */
  function underBed(p) {
    if (p.choice || p.card) return;
    const e = E();
    h.control(false);
    p.card = { ...found(p.done), pressed: "" };
    openFullScreen({
      label: "party card",
      restart: () => e.restartPart(),
      draw(ctx, w, hgt) {
        const q = P();
        q && q.card && drawCard(ctx, cardLayout(w, hgt, q.card.all), q.card, art);
      },
      pointer(kind, x, y) {
        const q = P(),
          o = fullScreenOpen();
        if (!q || !q.card || !o) return;
        const b = cardButtonAt(cardLayout(o.size().w, o.size().h, q.card.all), x, y);
        if (kind === "down") q.card.pressed = b;
        else if (kind === "up") {
          const was = q.card.pressed;
          q.card.pressed = "";
          b && b === was && choose(q, b);
        }
      },
    });
  }
  /** "back" or "keep": the card closes and the guard's search goes on. */
  function choose(p, id) {
    closeFullScreen();
    p.card = null;
    p.choice = id;
    // he is hidden: the "run home and hide!" chip has done its job
    h.chip("");
    h.sound.one("pop");
    // "Keep going" is the ending: its own restart point from here on.
    id === "keep" && ((p.scene = "P8a"), E().forgetSaved());
  }
  /** Tests and the robot: where the card's buttons are on the screen now. */
  function cardTargets() {
    const p = P(),
      o = fullScreenOpen();
    if (!p || !p.card || !o) return null;
    const L = cardLayout(o.size().w, o.size().h, p.card.all);
    return { ...Object.fromEntries(L.buttons.map((b) => [b.id, { x: b.x + b.w / 2, y: b.y + b.h / 2 }])), got: { ...p.card.got }, all: p.card.all, tiles: L.tiles.map((t) => ({ id: t.id, x: t.x, y: t.y, s: L.tile })) };
  }

  // ---------- a guard follows him home, alarm or not ----------
  /** In P7 with the hall already calm (he hid in a plant): through his door, a guard still follows a moment later. */
  function follow(p) {
    const w = p.people.backpack;
    startAlarm(p, { id: "backpack", x: w.x, y: w.y }, "where-home", "who-guard");
    Object.assign(p.alarm, { phase: "home", t: 0, quiet: true });
    p.phase = "hiding";
    p.lost = false;
    h.chip("chip-run");
    h.control(true);
  }

  // ---------- "Back to the party" ----------
  /** The guard has gone and the hall is calm: out from under the bed, his disguise back on, out through his door. */
  function back(p) {
    const e = E(),
      R = h.homeRoom,
      missing = (p.lostPieces || []).slice(),
      wait = (s) => [e.run(() => (P().pt = 0)), e.until(() => !P() || P().pt >= s)],
      steps = [];
    h.control(false);
    e.set("sqPose", "stand");
    p.pose = "stand";
    e.walkOff();
    if (missing.length) {
      // at his closet, the pieces he lost go back on one at a time
      steps.push(
        e.until((dt) => e.step("sq", R.inFront.x, R.inFront.y, AFTER.walk * 1.4, dt)),
        e.run(() => (e.still("sq"), e.face("sq", -1), e.set("wardrobe", "open"), e.sfx("open"))),
      );
      for (const spot of missing)
        steps.push(
          ...wait(AFTER.redress),
          e.run(() => {
            const q = P();
            q.lostPieces = q.lostPieces.filter((s) => s !== spot);
            // the piece is on him again, so it no longer lies where it fell in the hall
            q.fallen = (q.fallen || []).filter((f) => f.id !== q.outfit[spot]);
            e.sfx("pickup");
          }),
        );
      steps.push(...wait(AFTER.redress), e.run(() => e.set("wardrobe", "closed")));
    }
    steps.push(
      e.until((dt) => (e.trail(), e.step("sq", R.doorStep.x, R.doorStep.y, h.pace.walk, dt))),
      e.until((dt) => e.step("sq", R.doorIn.x, R.doorIn.y - 4, h.pace.walk, dt)),
      e.run(() => {
        e.enterRoom("hall", "QA");
        e.place("sq", HALL_DOOR.x, 636);
        e.face("sq", 1);
      }),
      e.until((dt) => e.step("sq", 480, 560, h.pace.walk, dt)),
      e.run(() => P() && h.resume(P())),
    );
    e.queue(steps);
  }

  // ---------- "Keep going" ----------
  /** The guard has finished looking (party-alarm.js asks): with "Keep going" chosen, Mops comes in and he stays. */
  function guardSearched(g) {
    const p = P();
    if (!p || p.choice !== "keep" || p.mopsIn) return !!(p && p.mopsIn);
    p.mopsIn = true;
    const e = E(),
      T = AFTER_SPOTS.mopsTalk,
      O = AFTER_SPOTS.out,
      guard = () => (P() && P().alarm && P().alarm.homeGuard) || null,
      wait = (s) => [e.run(() => (P().pt = 0)), e.until(() => !P() || P().pt >= s)];
    e.set("moPose", "stand");
    e.place("mops", h.homeRoom.mopsDoor.x, h.homeRoom.mopsDoor.y);
    e.face("mops", -1);
    h.sound.one("door");
    e.queue([
      e.until((dt) => e.step("mops", AFTER_SPOTS.mopsPast.x, AFTER_SPOTS.mopsPast.y, AFTER.walk, dt)),
      e.until((dt) => e.step("mops", T.x, T.y, AFTER.walk, dt)),
      // Mops turns to the guard, and the guard looks at him
      e.run(() => (e.still("mops"), e.face("mops", 1), guard() && (guard().a = Math.atan2(T.y - guard().y, T.x - guard().x)))),
      h.say("guard", "guard-alarm"),
      h.say("guard", "guard-ran"),
      h.say("mops", "mops-wookiee"),
      h.say("guard", "guard-ridiculous"),
      h.say("guard", "guard-poker"),
      h.say("mops", "mops-thumbs"),
      // the guard leaves
      e.run(() => guard() && ((guard().held = false), (guard().leaving = true))),
      e.until(() => !guard()),
      e.run(() => {
        P().alarm = null;
        h.sound.one("door");
        // Squatch comes out from under the bed, still in costume
        e.set("sqPose", "stand");
        P().pose = "stand";
        e.walkOff();
      }),
      e.until((dt) => e.step("sq", O.x, O.y, AFTER.walk, dt)),
      e.run(() => (e.still("sq"), e.face("sq", 1))),
      e.until((dt) => e.step("mops", O.x + AFTER.beside, O.y + 6, AFTER.walk * 0.7, dt)),
      // Mops looks at the costume (it glows while he looks)
      e.run(() => (e.still("mops"), e.face("mops", -1), (P().costumeLook = true))),
      ...wait(AFTER.look),
      e.run(() => (P().costumeLook = false)),
      h.say("mops", "mops-went"),
      h.say("sq", "sq-someone"),
      h.say("sq", "sq-except"),
      h.say("mops", "mops-have-me"),
      // No words: Mops steps close and gently lifts the piece on his head off him (or pats his head).
      e.until((dt) => e.step("mops", O.x + AFTER.close, O.y + 6, AFTER.walk * 0.5, dt)),
      e.run(() => {
        const q = P();
        e.still("mops");
        q.lift = { id: wornNow(q).head || "", k: 0 };
        h.sound.one(q.lift.id ? "fwip" : "pop");
      }),
      e.until(() => !P() || !P().lift || P().lift.k >= 1),
      // He sets the piece down on the floor between them (his mouth is for talking, his horn for the TV).
      e.run(() => {
        const q = P();
        if (!q.lift.id) return;
        const m = e.pos("mops"),
          s = h.sq();
        Object.assign(q.lift, { held: liftTo(m, s, e.squatchScale()), rest: { x: (m.x + s.x) / 2 + 6, y: Math.max(m.y, s.y) - AFTER.hatUp }, set: 0 });
      }),
      e.until(() => !P() || !P().lift || !P().lift.id || P().lift.set >= 1),
      ...wait(0.6),
      // Squatch's two questions; Mops answers only the first (Brian 2026-11-24, night)
      h.say("sq", "sq-why-hide"),
      h.say("sq", "sq-why-guardians"),
      h.say("mops", "mops-waiting"),
      h.say("mops", "mops-heres-why"),
      // No words: Mops walks to the TV (its button glows) and presses it with his horn; the TV comes on (tick).
      e.run(() => (P().tv = { phase: "walk", k: 0 })),
      e.until((dt) => e.step("mops", TV.stand.x, TV.stand.y, AFTER.walk, dt)),
      e.run(() => (e.still("mops"), e.face("mops", -1), (P().tv = { phase: "press", k: 0 }))),
      e.until(() => !P() || !P().tv || P().tv.phase === "on"),
      ...wait(TV.hold),
      e.run(() => h.finish()),
    ]);
    return true;
  }
  /**
   * Every frame: under the bed in P7 with the search come home (the alarm's own close-up, if it is still playing in
   * the hall's last moments, has finished), the card shows; and the hat's lift (or the pat) plays itself.
   */
  function tick(p, dt) {
    p.scene === "P7" && p.pose === "bed" && p.alarm && p.alarm.phase === "home" && !fullScreenOpen() && underBed(p);
    p.lift && p.lift.k < 1 && (p.lift.k = Math.min(1, p.lift.k + dt / AFTER.lift));
    p.lift && p.lift.set != null && p.lift.set < 1 && (p.lift.set = Math.min(1, p.lift.set + dt / AFTER.setDown));
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
  /** ↺ in "Keep going" (or a link straight to P8a): under the bed, the guard about to come in. */
  function startKeep(p) {
    const e = E(),
      R = h.homeRoom;
    e.room() !== "closet" && e.enterRoom("closet", "Q1");
    e.set("scene", "Q1");
    e.set("wardrobe", "closed");
    e.set("moPose", "hidden");
    e.place("sq", R.bed.x, R.bed.y);
    e.set("sqPose", "under");
    p.pose = "bed";
    startAlarm(p, { id: "backpack", x: p.people.backpack.x, y: p.people.backpack.y }, "where-home", "who-guard");
    Object.assign(p.alarm, { phase: "home", t: 0 });
    // (a restart after the TV came on: it is off again, and its button is not drawn; nothing is lifted yet)
    p.tv = null;
    p.lift = null;
    p.choice = "keep";
    e.forgetSaved();
    h.chip("");
    h.control(false);
  }
  return { underBed, choose, cardTargets, follow, back, guardSearched, tick, startKeep };
}
