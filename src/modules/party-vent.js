/**
 * The vent's no-disguise fur rule (docs/BRIAN-ASKS-OPEN.md Build next 1a; Brian 2026-11-23: "make sure we still
 * have the rule about vents swirling and that if squatch gets too close at any time, it sucks in fur and sets off
 * alarm"; R12, R108, S 485, G 474). The swirls always turn slowly inward (party-art.js drawVentSwirl). Without his
 * disguise, too close: a tuft of fur lifts off him and drifts in (the warning: a "fwip" sound, a short shake and a
 * big fur sign over him); if he stays, a cloud of fur goes in, the nearest guest sees it, and the one capture rule
 * starts ("by the vent"). No button and no teaching card (Brian 2026-11-07). In disguise the vent sucks in a
 * piece of the costume instead and never takes fur (R108, "With the disguise on, the vent tugs the disguise"; Brian
 * 2026-11-25, showing-5 note 3: "the vent sucking in his costume"): the same warning, and if he stays, his next piece
 * flies off him into the grille and is gone; with fur showing, the guests' sight rule does the rest.
 */
import { HALL } from "./party-hall.js";

// PLACEHOLDERS for Brian to tune: how close is too close (feet to the grille's middle), and how long he may
// stay that close before the fur goes in.
export const VENT = Object.freeze({ near: 78, stay: 1.6, drift: 0.9 });

/** Distance from Squatch's feet to the vent. */
export function ventDistance(sq) {
  return Math.hypot(sq.x - HALL.vent.x, (sq.y - HALL.vent.y) * 1.4);
}

/**
 * Every frame, alarm or not: the tufts already lifted off him keep drifting until they go into the grille (the fur
 * going in is the alarm's cause, so it is always seen: rule 13).
 */
export function moveTufts(P, dt) {
  const v = P.vent;
  if (!v) return;
  v.shake = Math.max(0, (v.shake || 0) - dt);
  for (const tf of v.tufts) tf.k += dt / VENT.drift;
  v.tufts = v.tufts.filter((tf) => tf.k < 1);
}

/**
 * One frame of the rule. `P.vent` keeps { t (seconds near), tufts: [{ k, x0, y0 }] }. Returns "warn" the frame he
 * first comes too close, "fur" the frame the fur goes in, "piece" (in `costume`) the frame a piece is sucked off,
 * else "".
 */
export function tickVent(P, dt, sq, active, costume = false) {
  const v = P.vent || (P.vent = { t: 0, tufts: [], shake: 0 });
  if (!active || ventDistance(sq) > VENT.near) {
    v.t = 0;
    return "";
  }
  const first = v.t === 0;
  v.t += dt;
  // a tuft drifts in every so often while he stands too close (in costume no fur comes off: the costume tugs)
  costume || ((first || v.tufts.length === 0) && v.tufts.push({ k: 0, x0: sq.x, y0: sq.y - 30 }));
  if (first) return ((v.shake = 0.4), "warn");
  if (costume && v.t >= VENT.stay) return ((v.t = 0), (v.shake = 0.4), "piece");
  if (v.t >= VENT.stay) {
    v.t = 0;
    for (let i = 0; i < 6; i++) v.tufts.push({ k: -i * 0.08, x0: sq.x + (i % 3) * 6 - 6, y0: sq.y - 20 - i * 4 });
    return "fur";
  }
  return "";
}

/** Where the drifting tufts are now (for drawing): each slides and spins into the grille. */
export function ventTufts(P) {
  const v = P.vent;
  if (!v) return [];
  return v.tufts
    .filter((tf) => tf.k >= 0)
    .map((tf) => {
      const k = tf.k * tf.k,
        sw = Math.sin(tf.k * 8) * 10 * (1 - tf.k);
      return { x: tf.x0 + (HALL.vent.x - tf.x0) * k + sw, y: tf.y0 + (HALL.vent.y - tf.y0) * k, s: 11 * (1 - tf.k * 0.6), rot: tf.k * 6 };
    });
}
