/**
 * Every word the home morning shows (Chapter 1, beats 22 to 24: the Guardians' gift, the calendar, Mops's lunch), in
 * the order a player meets them. Nothing here is new: each line is in the game today, decided or approved. The note
 * tied to the rocket shows its words in the box close-up (Brian, 2026-11-26; no "Rule #1"). The calendar is optional
 * (Brian, 2026-11-26), so it has no goal chip. The calendar close-up's own words
 * ("MOONMUNCH", "FUZZUARY", the reminders, "Sponsored by MOON PIES") are the older program's, unchanged.
 *   id      the line's name in the code and in tests/home-morning.mjs
 *   who     "chip" (the goal chip), "button" (the big action button), "sq" (Squatch says it), "sign" (painted on a thing)
 *   text    the words, exactly as shown
 *   status  "in-game" (the game showed these words here before this change), "decided" or "approved" (Brian's yes,
 *           `source` says where), "needs-yes" (named by the brief, waiting for Brian's yes)
 *   source  where the words came from
 */
const DAY2 = "src/game/14-ch1-day2.js before this change";

export const HOME_MORNING_LINES = Object.freeze(
  [
    { id: "chip-gift", who: "chip", text: "Squatch: pick up the gift", status: "in-game", source: DAY2 },
    { id: "button-rocket", who: "button", text: "PICK UP · rocket", status: "approved", source: "Brian 2026-11-26 (chat answers); the game said TAKE · gift" },
    { id: "sq-guardians", who: "sq", text: "The Guardians came! They always come when I'm scared.", status: "in-game", source: DAY2 + "; walkthrough beat 22, pending (from the original story outline)" },
    { id: "note-words", who: "sign", text: "Brave Sasquatches stay hidden. — The Guardians", status: "approved", source: "Brian 2026-11-26 (chat answers): the note on the rocket shows its words (no \"Rule #1\"); the box close-up shows them" },
    { id: "chip-box", who: "chip", text: "Squatch: put the gift in the box", status: "in-game", source: DAY2 },
    { id: "button-closet", who: "button", text: "OPEN · closet", status: "approved", source: "Brian 2026-11-23: 6A (home alone, home-alone-lines.js)" },
    { id: "button-box", who: "button", text: "PUT IN · box", status: "approved", source: "Brian 2026-11-26 (chat answers); the game said PUT · box, then DROP · box" },
    { id: "sign-box", who: "sign", text: "MY GARDIAN BOX", status: "decided", source: "docs/STORY-DECISIONS.md section 5: the lid says MY GARDIAN BOX (S58: the kid spelling is on purpose); on the lid's taped label in the box close-up" },
    { id: "sign-drawing", who: "sign", text: "MY GUARDIANS", status: "decided", source: "docs/STORY-DECISIONS.md section 5: the title says MY GUARDIANS; the crayon title on Squatch's drawing of the Guardians in the box close-up" },
    { id: "button-cal", who: "button", text: "LOOK · calendar", status: "in-game", source: DAY2 + " and src/game/15-ch1-scene1.js" },
    { id: "sign-bag", who: "sign", text: "MOPS", status: "approved", source: "Brian 2026-11-26 (chat answers): the lunch bag gets MOPS written on it (the old one said MOPS)" },
    { id: "sq-lunch", who: "sq", text: "He forgot his lunch!", status: "decided", source: "walkthrough beat 24, decided (in the game today)" },
    { id: "chip-lunch", who: "chip", text: "Squatch: take the lunch", status: "in-game", source: DAY2 },
    { id: "button-lunch", who: "button", text: "TAKE · lunch", status: "in-game", source: DAY2 },
  ].map((l) => Object.freeze(l)),
);

/** The words of one line, by id. Throws on an unknown id, so a typo cannot show empty words. */
export function morningWords(id) {
  const l = HOME_MORNING_LINES.find((x) => x.id === id);
  if (!l) throw new Error(`no home morning line ${id}`);
  return l.text;
}
