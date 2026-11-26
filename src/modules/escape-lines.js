/**
 * Every word the escape shows (Chapter 1, beats 43 to 52: "Six days later", the robots tease Mops, the pancake place,
 * the almost-slip, the vent, Mops's secret workstation, the pink slip, the office keypad, the Moon Pie site, all the
 * snacks), in the order a player meets them. Story lines are the walkthrough's, word for word, and still pending
 * Brian's yes. Goal lines and buttons are the ones the game showed for these beats before this rebuild
 * (src/game/14-ch1-day2.js), unless marked "new" (no words existed; listed for Brian).
 *   id      the line's name in the code and in tests/escape.mjs
 *   who     "card", "chip" (the goal chip), "button" (the big action button), "robot", "mops", "sq" (Squatch; style
 *           "whisper" is a thought), "paper" (words drawn on a thing: a sign, a letter, a note, a screen)
 *   text    the words, exactly as shown
 *   status  "pending" (the walkthrough's words, waiting for Brian's yes), "in-game" (shown before), "approved" (his yes),
 *           "new" (needs his yes)
 *   source  where the words came from
 */
const ES_WALK = "docs/CH1-STORY-WALKTHROUGH.md beat ";
const ES_OLD = "src/game/14-ch1-day2.js before this change";

export const ESCAPE_LINES = Object.freeze(
  [
    { id: "card-six-days", who: "card", text: "Six days later", status: "pending", source: ES_WALK + "43" },
    { id: "robot-replaced", who: "robot", text: "HQ sent us a message, you're going to be replaced this week anyway.", status: "pending", source: ES_WALK + "44" },
    { id: "mops-lying", who: "mops", text: "Replaced? The manager was lying to me.", status: "pending", source: ES_WALK + "44" },
    { id: "mops-pancake", who: "mops", text: "I'm going to be replaced. The new robots are coming on the ship tomorrow. Remember that pancake place? Let's go find out about it.", status: "pending", source: ES_WALK + "45" },
    { id: "sq-slip", who: "sq", text: "Oh, it was on the form I sent, I mean, never mind.", status: "pending", source: ES_WALK + "46" },
    { id: "sq-vent", who: "sq", text: "Didn't a copy get sucked into the vent?", status: "pending", source: ES_WALK + "46" },
    { id: "chip-ball", who: "chip", text: "Squatch: roll into a ball by the vent", status: "in-game", source: ES_OLD + " (beat 47)" },
    { id: "button-ball", who: "button", text: "ROLL · ball", status: "in-game", source: ES_OLD + "; approved 2026-11-26 (lunch sneak)" },
    { id: "board", who: "paper", text: "IDEAS FOR GUARDIANS", status: "pending", source: ES_WALK + "48" },
    { id: "flyer", who: "paper", text: "HAVE YOU SEEN?", status: "pending", source: ES_WALK + "48" },
    { id: "label-mars", who: "paper", text: "MARS", status: "pending", source: ES_WALK + "48 (labels MARS / NO / TOYS)" },
    { id: "label-no", who: "paper", text: "NO", status: "pending", source: ES_WALK + "48 (labels MARS / NO / TOYS)" },
    { id: "label-toys", who: "paper", text: "TOYS", status: "pending", source: ES_WALK + "48 (labels MARS / NO / TOYS)" },
    { id: "letter", who: "paper", text: "MARS LOST & FOUND. Re: a lost baby Sasquatch. We have NO record of any lost baby. There are NO Sasquatches on Mars.", status: "pending", source: ES_WALK + "48" },
    { id: "sq-notice", who: "sq", text: "I hope Mops doesn't notice...", status: "pending", source: ES_WALK + "48" },
    { id: "note", who: "paper", text: "We know you're thinking about going to Mars. Don't worry, we'll always be with you.", status: "pending", source: ES_WALK + "48" },
    { id: "note-sign", who: "paper", text: "— The Guardians", status: "new", source: "the Guardians' signature on every note (the gift note, beat 22); on this note it needs Brian's yes" },
    { id: "mops-hurry", who: "mops", text: "Hurry, hurry, pink slip, got it!", status: "pending", source: ES_WALK + "49" },
    { id: "sq-get-it", who: "sq", text: "Get it before he sees it.", status: "pending", source: ES_WALK + "49" },
    { id: "chip-grab", who: "chip", text: "Squatch: grab the pink slip", status: "in-game", source: ES_OLD },
    { id: "button-grab", who: "button", text: "GRAB · pink slip", status: "in-game", source: ES_OLD },
    { id: "sheet-order", who: "paper", text: "ORDER MORE ROBOTS", status: "in-game", source: ES_OLD + " (the paw order's close-up, beat 42)" },
    { id: "chip-code", who: "chip", text: "Squatch: type the code from the pink slip", status: "pending", source: ES_OLD + "; the digest of 2026-11-26 lists it pending" },
    { id: "chip-crate", who: "chip", text: "Squatch: return the empty crate", status: "in-game", source: ES_OLD },
    { id: "button-computer", who: "button", text: "RETURN · empty crate", status: "in-game", source: ES_OLD + " (DECISIONS calls 2026-11-22, call 10)" },
    { id: "site", who: "paper", text: "MOON PIES", status: "pending", source: ES_WALK + "51" },
    { id: "site-order", who: "paper", text: "Order new box", status: "pending", source: ES_WALK + "51" },
    { id: "site-return", who: "paper", text: "Return empty crate", status: "pending", source: ES_WALK + "51" },
    { id: "mops-all", who: "mops", text: "This time, take all the snacks you want.", status: "pending", source: ES_WALK + "52" },
    { id: "chip-snacks", who: "chip", text: "Squatch: take the snacks", status: "in-game", source: ES_OLD },
    { id: "sq-guardians", who: "sq", text: "I'm worried about the Guardians. I'll leave them some food.", status: "pending", source: ES_WALK + "52" },
    { id: "button-snack", who: "button", text: "TAKE · snack", status: "in-game", source: "lunch-sneak-lines.js (beat 27); here the big button takes the next snack in the close-up" },
    { id: "button-food", who: "button", text: "LEAVE · food", status: "in-game", source: ES_OLD + " (LEAVE · food, beat 52)" },
    { id: "chip-food", who: "chip", text: "Squatch: leave food for the Guardians", status: "in-game", source: ES_OLD },
    { id: "chip-slip", who: "chip", text: "Squatch: hide the pink slip", status: "in-game", source: ES_OLD },
    { id: "button-closet", who: "button", text: "OPEN · closet", status: "approved", source: "home-morning-lines.js (Brian 2026-11-23, 6A)" },
    { id: "button-box", who: "button", text: "PUT IN · box", status: "approved", source: "home-morning-lines.js (Brian 2026-11-26)" },
  ].map((l) => Object.freeze(l)),
);

/** The words of one line, by id. Throws on an unknown id, so a typo cannot show empty words. */
export function escapeWords(id) {
  const l = ESCAPE_LINES.find((x) => x.id === id);
  if (!l) throw new Error(`no escape line ${id}`);
  return l.text;
}
