/**
 * After an alarm, at home (Brian's answers of 2026-11-24 and 2026-11-25, asks/video-notes-2026-11-24/ANSWERS.md;
 * it replaces the old P8a). The alarm itself is the one capture rule (party-alarm.js): he runs home, a guard follows
 * with his flashlight. Only the beam finds him (he need not be under the bed before the guard walks in, Brian
 * 2026-11-25), and after a party alarm the guard looks round until he is under the bed (HIDE · bed).
 *   Mops sends the guard off. The guard's search is over: he steps aside to the back of the room; Mops comes in
 *     along the front (the two are never drawn over each other) and stops between him and the door; their six
 *     lines; the guard leaves along the back.
 *   The card. Then, with Squatch still under the bed: "There's more to find at the party!", the party's things as
 *     pictures, and two buttons (party-card.js). The game waits behind it (Brian 2026-11-25, his click "Card after
 *     Mops sends the guard off").
 *   "Back to the party" (still P7). With no words Mops heads back out to work; Squatch comes out after him, puts the
 *     pieces he lost back on at his closet, and walks back out through his door. The party carries on from where
 *     it was (party-free.js `resume`).
 *   "Keep going" (P8a; ↺ restarts it from here: Squatch under the bed, Mops in the room). Squatch comes out, and the
 *     talk at home (party-talk.js), then beat 20.
 *   Hiding in a plant in the hall and walking home later: a guard follows him in a moment later all the same, so
 *     the card and both endings are the same (`follow`).
 */
import { HOME_ROOM, HALL_DOOR } from "./party-hall.js";
import { startAlarm } from "./party-alarm.js";
import { openFullScreen, closeFullScreen, fullScreenOpen } from "./fullscreen.js";
import { found, cardLayout, cardButtonAt, drawCard } from "./party-card.js";
import { wornNow } from "./party-outfit.js";
import { createTalk, TV, TALK, TALK_SPOTS } from "./party-talk.js";
const TALK_OUT = TALK_SPOTS.sq;
export { TV };

// PLACEHOLDERS for Brian: how fast they walk at home, and how long a piece takes to go back on.
export const AFTER = Object.freeze({ walk: TALK.walk, redress: 0.45, hatUp: TALK.hatUp });
// Where they stand while Mops sends the guard off (game positions; the home room draws them big, about 190 tall):
// the guard steps aside to the back of the room (`guardAside`), Mops comes in along the front (`mopsPast`) and stops
// in front of him (`mopsTalk`, well below him: their drawings never overlap, and clear of the flyer by the door); the
// guard leaves along the back (`guardOut`) to the door, never across Mops. `out`: where Squatch stands once he is out from under the bed.
export const AFTER_SPOTS = Object.freeze({
  guardAside: Object.freeze({ x: 540, y: 385 }),
  guardOut: Object.freeze({ x: 880, y: 385 }),
  mopsPast: Object.freeze({ x: 850, y: 578 }),
  mopsTalk: Object.freeze({ x: 600, y: 578 }),
  out: TALK_OUT,
});

/**
 * `h`: { E, P, sq, say, chip, control, sound, homeRoom, pace, guests (the approved art), finish () (beat 20),
 * resume (p) (the party goes on, party-free.js) }.
 */
export function createAfterAlarm(h) {
  const E = () => h.E();
  const P = () => h.P();
  const talk = createTalk(h);
  // What the card's pictures are drawn with: Squatch as the game draws him, and a guest's approved picture `tall` high.
  const art = {
    squatch: (ctx, x, y, scale) => E().drawSquatch(ctx, x, y, scale, { f: 1 }),
    guest: (ctx, id, x, y, tall) => h.guests.drawId(ctx, id, x, y, tall / (h.guests.height(id, 1) || 1), 0),
  };

  // ---------- the card ----------
  /** Squatch is under the bed and Mops has sent the guard off: the card (once; a restart of P8a has already chosen). */
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
  /** "back" or "keep": the card closes; Mops goes back to work, or the talk. */
  function choose(p, id) {
    closeFullScreen();
    p.card = null;
    p.choice = id;
    // he is hidden: the "run home and hide!" chip has done its job
    h.chip("");
    h.sound.one("pop");
    // (the same card after going home early: party-home-early.js)
    if (p.homeEarly) return id === "keep" ? h.homeEarly().keep(p) : h.homeEarly().backOut(p);
    if (id === "keep") return keepGoing(p);
    back(p);
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

  // ---------- Mops sends the guard off ----------
  /**
   * The guard has finished looking with Squatch under the bed (party-alarm.js asks). After a party alarm (P7) Mops
   * comes in and sends him off; then the card. True keeps the guard standing (`held`) until he is sent off.
   */
  function guardSearched(g) {
    const p = P();
    if (!p || p.scene !== "P7") return false;
    if (p.mopsIn) return true;
    p.mopsIn = true;
    const e = E(),
      A = AFTER_SPOTS,
      guard = () => (P() && P().alarm && P().alarm.homeGuard) || null;
    // the guard steps aside to the back of the room, then turns to the door
    Object.assign(g, { to: { ...A.guardAside }, faceTo: 0 });
    h.control(false);
    e.queue([
      e.until(() => !guard() || !guard().to),
      e.run(() => {
        e.set("moPose", "stand");
        e.place("mops", h.homeRoom.mopsDoor.x, h.homeRoom.mopsDoor.y);
        e.face("mops", -1);
        h.sound.one("door");
      }),
      // Mops comes in along the front, in front of the guard and well below him
      e.until((dt) => e.step("mops", A.mopsPast.x, A.mopsPast.y, AFTER.walk, dt)),
      e.until((dt) => e.step("mops", A.mopsTalk.x, A.mopsTalk.y, AFTER.walk, dt)),
      // Mops turns to the guard, and the guard looks at him
      e.run(() => (e.still("mops"), e.face("mops", -1), guard() && (guard().a = Math.atan2(A.mopsTalk.y - guard().y, A.mopsTalk.x - guard().x)))),
      h.say("guard", "guard-alarm"),
      h.say("guard", "guard-ran"),
      h.say("mops", "mops-wookiee"),
      h.say("guard", "guard-ridiculous"),
      h.say("guard", "guard-poker"),
      h.say("mops", "mops-thumbs"),
      // the guard leaves along the back of the room, then out through the door
      e.run(() => guard() && Object.assign(guard(), { held: false, leaving: true, exit: [{ ...A.guardOut }] })),
      e.until(() => !guard()),
      e.run(() => {
        const q = P();
        q.alarm = null;
        h.sound.one("door");
        // still under the bed: the card
        underBed(q);
      }),
    ]);
    return true;
  }

  // ---------- "Back to the party" ----------
  /** With no words Mops goes back out to work; Squatch comes out, puts his disguise back on, and goes out too. */
  function back(p) {
    const e = E(),
      R = h.homeRoom,
      missing = (p.lostPieces || []).slice(),
      wait = (s) => [e.run(() => (P().pt = 0)), e.until(() => !P() || P().pt >= s)],
      steps = [];
    h.control(false);
    steps.push(
      e.run(() => e.walkOff()),
      e.until((dt) => e.step("mops", R.mopsDoor.x + 30, R.mopsDoor.y, AFTER.walk, dt)),
      e.run(() => (e.set("moPose", "hidden"), h.sound.one("door"))),
      ...wait(0.5),
      e.run(() => {
        e.set("sqPose", "stand");
        P().pose = "stand";
      }),
    );
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
  /** The ending: its own restart point from here. Squatch comes out from under the bed, and the talk. */
  function keepGoing(p) {
    const e = E();
    p.scene = "P8a";
    e.forgetSaved();
    h.control(false);
    e.queue([
      e.run(() => {
        e.set("sqPose", "stand");
        P().pose = "stand";
        e.walkOff();
      }),
      ...talk.steps(),
    ]);
  }
  /** Every frame: the card once Mops has sent the guard off (see guardSearched); the talk's own moving parts. */
  function tick(p, dt) {
    talk.tick(p, dt);
  }
  /** ↺ in "Keep going" (or a link straight to P8a): under the bed, Mops in the room, the guard gone; then the talk. */
  function startKeep(p) {
    const e = E(),
      R = h.homeRoom;
    e.room() !== "closet" && e.enterRoom("closet", "Q1");
    e.set("scene", "Q1");
    e.set("wardrobe", "closed");
    e.set("moPose", "stand");
    e.place("mops", AFTER_SPOTS.mopsTalk.x, AFTER_SPOTS.mopsTalk.y);
    e.face("mops", -1);
    e.place("sq", R.bed.x, R.bed.y);
    e.set("sqPose", "under");
    p.pose = "bed";
    p.alarm = null;
    // (a restart after the TV came on: it is off again, and its button is not drawn; nothing is lifted yet; the
    // flyer back on the floor where he put it)
    p.tv = null;
    p.lift = null;
    p.take = null;
    p.flyerUp = null;
    p.flyer = "floor";
    p.mopsIn = true;
    p.choice = "keep";
    h.chip("");
    keepGoing(p);
  }
  return { underBed, choose, cardTargets, follow, back, guardSearched, tick, startKeep, talk };
}
