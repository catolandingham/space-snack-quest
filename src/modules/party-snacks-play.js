/**
 * The snack close-up's sounds, lines, stars and endings (party-snacks.js is the rules, party-snacks-art.js the
 * drawings). party-free.js calls these two each frame and for each finger; they were its own lines before.
 * `h` is the party's helpers (see party-free.js createFreePlay); `alarm` is the free play's own alarm starter.
 */
import { tickSnacks, snackPointer, closeSnacks, startTopple, stock, takeOwed, SNACK_STARS } from "./party-snacks.js";

// Stars for every snack in the bag that has not been paid for (one that landed this frame, or one he was still
// carrying when the close-up closed). Returns how many were paid.
function payOwed(p, h) {
  const n = takeOwed(p);
  if (n) ((p.done.snacks = true), h.E().addStars(n * SNACK_STARS));
  return n;
}

/** One frame of the snack bar's close-up: what happened is heard, said, scored. */
export function snackFrame(p, dt, h, alarm) {
  if (!p.snack) return void payOwed(p, h);
  const e = h.E(),
    ev = tickSnacks(p, dt),
    caught = ev.includes("catch1") || ev.includes("catch2");
  for (const what of ev) {
    if (what === "turn") h.sound.one("dun");
    else if (what === "grab") h.sound.one("crinkle");
    else if (what === "settle") h.sound.one("bump");
    else if (what === "crack") h.sound.one("uhoh");
    else if (what === "bag") {
      payOwed(p, h);
      e.sfx("pickup");
      h.sound.one("tink");
      // his own thought after his first snack (Brian 2026-11-24), unless she is just now catching him
      const s = stock(p);
      !s.gotOne && !caught && ((s.gotOne = true), e.queue([h.say("sq", "sq-got-one", "whisper")]));
    } else if (what === "catch1") (e.sfx("bleep"), e.queue([h.say("bartender", "bartender-gloves")]));
    else if (what === "catch2") {
      e.sfx("bleep");
      e.queue([
        h.say("bartender", "bartender-fur"),
        e.run(() => {
          const q = h.P();
          q && q.scene === "P6" && alarm(q, "bartender", h.sq(), "where-bar", "run");
        }),
      ]);
    } else if (what === "topple") {
      // the pile falls: the zoom pulls back and the hall's chain takes over (party-free.js, tickTopple)
      closeSnacks(p);
      startTopple(p);
      h.sound.one("crash");
      h.control(true);
    }
  }
}
/**
 * Closes the close-up from outside it (an alarm, closing time, the group photo). A snack still in his paw goes in
 * the bag and is paid for here, in the same frame: after an alarm the free play does not tick again.
 */
export function snackShut(p, h) {
  if (!p.snack) return;
  closeSnacks(p);
  payOwed(p, h);
  h.control(true);
}
/** A finger in the snack close-up (game positions). True when the close-up took it. */
export function snackTouch(p, kind, x, y, h) {
  if (!p.snack) return false;
  // LEAVE · bar: a snack still in his paw goes in the bag and is paid for, like any other
  snackPointer(p, kind, x, y) === "close" && (closeSnacks(p), payOwed(p, h) && h.sound.one("tink"), h.control(true));
  return true;
}
