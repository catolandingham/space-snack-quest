/**
 * Every word the lunch sneak shows (Chapter 1, beats 25 to 27: sneak the lunch to Mops, "My lunch! You're the best.",
 * one snack behind the counter), in the order a player meets them. Mops's one-snack line is Brian's, approved word
 * for word (2026-11-26, chat); it replaces the wordless one-pie thought bubble. Left out on purpose (Brian,
 * 2026-11-26): Mops's "Squatch! You should be hiding." (he looks left and right instead). The capture rule's own
 * words ("A tourist", "in the hall", "They lost you.", "FUR!") are the party's (party-lines.js), unchanged.
 *   id      the line's name in the code and in tests/lunch-sneak.mjs
 *   who     "chip" (the goal chip), "button" (the big action button), "mops" (Mops says it)
 *   text    the words, exactly as shown
 *   status  "in-game" (the game showed these words before), "decided" (the walkthrough says so) or "approved" (Brian's
 *           yes, word for word)
 *   source  where the words came from
 */
const DAY2 = "src/game/14-ch1-day2.js before this change";

export const LUNCH_LINES = Object.freeze(
  [
    { id: "chip-sneak", who: "chip", text: "Squatch: take Mops his lunch", status: "in-game", source: DAY2 },
    { id: "button-plant", who: "button", text: "HIDE · plant", status: "in-game", source: DAY2 + "; party-lines.js button-hide-plant" },
    { id: "button-crate", who: "button", text: "HIDE · crate", status: "in-game", source: "src/game/11-ch1-hall.js (the old hall's crate)" },
    { id: "button-door", who: "button", text: "SNEAK · hallway", status: "in-game", source: DAY2 },
    { id: "button-ball", who: "button", text: "ROLL · ball", status: "in-game", source: "src/game/12-ch1-redesign.js (the night mailbox's ROLL · ball); offered here on Brian's yes, chat 2026-11-26" },
    { id: "chip-hide", who: "chip", text: "Squatch: hide", status: "in-game", source: DAY2 + " (beat 38)" },
    { id: "chip-give", who: "chip", text: "Squatch: give Mops his lunch", status: "in-game", source: DAY2 },
    { id: "button-give", who: "button", text: "GIVE · lunch", status: "in-game", source: DAY2 },
    { id: "mops-lunch", who: "mops", text: "My lunch! You're the best.", status: "decided", source: "walkthrough beat 26, decided (in the game today)" },
    { id: "chip-back", who: "chip", text: "Squatch: go on", status: "in-game", source: DAY2 + " (beat 37)" },
    { id: "mops-one-snack", who: "mops", text: "...you know the rule, grab one snack.", status: "approved", source: "Brian, chat 2026-11-26" },
    { id: "chip-snack", who: "chip", text: "Squatch: grab one snack", status: "in-game", source: DAY2 },
    { id: "button-snack", who: "button", text: "TAKE · snack", status: "in-game", source: DAY2 },
  ].map((l) => Object.freeze(l)),
);

/** The words of one line, by id. Throws on an unknown id, so a typo cannot show empty words. */
export function lunchWords(id) {
  const l = LUNCH_LINES.find((x) => x.id === id);
  if (!l) throw new Error(`no lunch line ${id}`);
  return l.text;
}
