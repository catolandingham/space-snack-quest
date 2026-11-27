/**
 * Mops's hearts, one rule for the whole chapter (Brian, 2026-11-27, video notes r5 3:45, 7:18 and 8:14: "come on with
 * the hearts... I just need [them] to show up right at the beginning"; question 126, the pick A, a placeholder until
 * he answers): two or three hearts float up the first time Squatch comes into Mops's view in a scene, then none; one
 * single heart at a few story moments; none during the fight. This narrows decision #48 ("always sends up hearts").
 * Each scene draws its hearts in its own look; this file only says how many and for how long.
 * q: 126. Option B (only at story moments, never just for seeing him): set FIRST_SIGHT.count to 0.
 */
export const FIRST_SIGHT = Object.freeze({ count: 3, seconds: 2.4 });
/** A story moment's single heart floats this long. */
export const STORY_HEART = Object.freeze({ count: 1, seconds: 1.8 });

/** True while the first-sight hearts are up: `age` is the seconds since he came into view in this scene (-1: not yet). */
export function firstSightHeartsUp(age) {
  return FIRST_SIGHT.count > 0 && age >= 0 && age < FIRST_SIGHT.seconds;
}
/**
 * The first-sight hearts at `age` seconds: for each, how far it has risen (0 to 1) and how solid it is (0 to 1); they
 * set off one after another and each fades as it rises. Empty before and after.
 */
export function firstSightHearts(age) {
  if (!firstSightHeartsUp(age)) return [];
  const out = [];
  for (let i = 0; i < FIRST_SIGHT.count; i++) {
    const u = (age - i * 0.3) / (FIRST_SIGHT.seconds - (FIRST_SIGHT.count - 1) * 0.3);
    u > 0 && u < 1 && out.push({ i, rise: u, alpha: Math.sin(u * Math.PI) });
  }
  return out;
}
