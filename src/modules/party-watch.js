/**
 * Who watches Squatch at the party, and which way each one looks (Brian, 2026-11-23, on sight cones for
 * everyone: "let's try all of them and then we can adjust").
 *
 * Everyone faces the stage, except Isfred, who stands on it facing the guests, and the bartender, who faces
 * the room from behind the bar. After the snack spill everyone turns to look at Squatch.
 *
 * This file only says where each cone starts and which way it points. The older program draws each cone
 * with its own seenCone and checks sight with its own vt, so the shaded area stays exactly the place where
 * Squatch is seen (tests/cone-match.mjs).
 */

// The middle of the stage, in game positions (hall-room-empty-v1 and the party drawing).
export const PARTY_STAGE = { x: 448, y: 280 };
// People who do not face the stage: the way they look (radians, 0 = right, PI / 2 = down the screen).
export const PARTY_FACES = { isfred: Math.PI / 2, bartender: Math.PI };
// A cone starts this far above a person's feet, as every standing cone in the game does.
export const EYE_ABOVE_FEET = 28;
// How long a guest watches Squatch before "?" turns into "!" (Brian, 2026-11-22: "it stats with a question mark
// and only turns into exclamation after he stays too long"). PROVISIONAL: Brian has not set this number
// yet (docs/DECISIONS.md, Sight cones); it is not a tuning pin until he does.
export const SEEN_TOO_LONG_SECONDS = 0.8;
// The point on Squatch that is seen: this far above his feet (as ch1SneakSees checks).
export const SQUATCH_SEEN_ABOVE_FEET = 20;

/**
 * One cone per person. `people` is [{ id, x, y }] (feet, game positions). `sq` is Squatch's feet { x, y }.
 * With `lookAtSquatch`, every cone points at him. Returns [{ id, x, y, ox, oy, a }].
 */
export function partyCones(people, sq, lookAtSquatch) {
  return people.map((p) => {
    const ox = p.x,
      oy = p.y - EYE_ABOVE_FEET;
    const a = lookAtSquatch
      ? Math.atan2(sq.y - SQUATCH_SEEN_ABOVE_FEET - oy, sq.x - ox)
      : p.id in PARTY_FACES
        ? PARTY_FACES[p.id]
        : Math.atan2(PARTY_STAGE.y - oy, PARTY_STAGE.x - ox);
    return { id: p.id, x: p.x, y: p.y, ox, oy, a };
  });
}
