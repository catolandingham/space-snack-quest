/**
 * The snack close-up's sounds, lines, stars and endings (party-snacks.js is the rules, party-snacks-art.js the
 * drawings). party-free.js calls these two each frame and for each finger; they were its own lines before.
 * `h` is the party's helpers (see party-free.js createFreePlay); `alarm` is the free play's own alarm starter.
 */
import { tickSnacks, snackPointer, closeSnacks, startTopple, stock, SNACK_STARS } from "./party-snacks.js";

/** One frame of the snack bar's close-up: what happened is heard, said, scored. */
export function snackFrame(p, dt, h, alarm) {
  if (!p.snack) return;
  const e = h.E(),
    ev = tickSnacks(p, dt),
    caught = ev.includes("catch1") || ev.includes("catch2");
  for (const what of ev) {
    if (what === "turn") h.sound.one("dun");
    else if (what === "grab") h.sound.one("crinkle");
    else if (what === "settle") h.sound.one("bump");
    else if (what === "crack") h.sound.one("uhoh");
    else if (what === "bag") {
      p.done.snacks = true;
      e.addStars(SNACK_STARS);
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
/** A finger in the snack close-up (game positions). True when the close-up took it. */
export function snackTouch(p, kind, x, y, h) {
  if (!p.snack) return false;
  snackPointer(p, kind, x, y) === "close" && (closeSnacks(p), h.control(true));
  return true;
}
