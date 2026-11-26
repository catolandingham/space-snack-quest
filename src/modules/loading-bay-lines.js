/**
 * Every word the loading bay beats show (Chapter 1, beats 28 to 36: the ship is coming, the walk to the loading bay,
 * the robots arrive, the promise, three copies, "Delicious.", gumbling, spit into the bin, the walk home past the
 * robots), in the order a player meets them. Words from docs/CH1-STORY-WALKTHROUGH.md beats 28 to 36, word for word.
 * Lines the walkthrough marks pending stay "pending" here until Brian says yes to each. Two moments have no words on
 * purpose (Brian's brief, 2026-11-26: make it wordless, ask): what calls Isfred away (the wall speaker's chime), and
 * Mops waving Squatch out of the plant.
 *   id      the line's name in the code and in tests/loading-bay.mjs
 *   who     "pa" (the wall speaker), "mops", "sq", "official" (Isfred), "robot", "chip" (the goal chip), "button"
 *           (the big action button), "paper" (words drawn on a paper)
 *   text    the words, exactly as shown
 *   status  "pending" (waiting for Brian's yes), "decided" (the walkthrough says decided), "approved" (Brian's yes,
 *           word for word), "in-game" (the game showed these words before)
 *   source  where the words came from
 */
const WALK = "docs/CH1-STORY-WALKTHROUGH.md beat ";
const BAY_DAY2 = "src/game/14-ch1-day2.js before this change";

export const BAY_LINES = Object.freeze(
  [
    { id: "pa-ship", who: "pa", text: "Universal Postal Service ship arriving!", status: "pending", source: WALK + "28 (or \"The Universal Postal Service ship is arriving.\")" },
    { id: "mops-see", who: "mops", text: "I better go see what that is.", status: "pending", source: WALK + "28" },
    { id: "sq-follow", who: "sq", text: "Please let me follow you, I'll be really sneaky.", status: "pending", source: WALK + "28" },
    { id: "mops-ok", who: "mops", text: "Okay, just this time, but hide carefully.", status: "pending", source: WALK + "28" },
    { id: "chip-hide", who: "chip", text: "Squatch: hide in the plant", status: "in-game", source: BAY_DAY2 },
    { id: "button-hide", who: "button", text: "HIDE · plant", status: "in-game", source: BAY_DAY2 },
    { id: "isfred-promise", who: "official", text: "Mops, don't worry, you know how much we love you here. Even our visitors always love you.", status: "pending", source: WALK + "31" },
    { id: "order-box", who: "paper", text: "ORDER MORE ROBOTS", status: "pending", source: WALK + "32 (\"ORDER MORE ROBOTS ☐\"; the box is drawn, not typed)" },
    { id: "paper-joke", who: "mops", text: "So futuristic and we still order on paper.", status: "pending", source: WALK + "32 (optional; Mops said it in " + BAY_DAY2 + ")" },
    { id: "robot-copies", who: "robot", text: "Left one of the copies in the office. What do I do with the other two?", status: "pending", source: WALK + "33" },
    { id: "mops-take", who: "mops", text: "I'll take care of it.", status: "pending", source: WALK + "33" },
    { id: "mops-delicious", who: "mops", text: "Delicious.", status: "pending", source: WALK + "33" },
    { id: "mops-gumble", who: "mops", text: "Mmf mrrf!", status: "pending", source: WALK + "34" },
    { id: "sq-gumbling", who: "sq", text: "You're gumbling! (goat mumbling)", status: "approved", source: WALK + "34 (decided, approved; the bracket stays, DECISIONS P5)" },
    { id: "mops-ptoo", who: "mops", text: "Ptoo!", status: "pending", source: WALK + "35" },
    { id: "mops-robots", who: "mops", text: "We got to watch out for these robots.", status: "pending", source: WALK + "36" },
    { id: "sq-fur", who: "sq", text: "What's the difference between fur and hair?", status: "decided", source: WALK + "36 (decided, in the game today)" },
    { id: "mops-paperwork", who: "mops", text: "Paperwork.", status: "decided", source: WALK + "36 (decided, in the game today)" },
  ].map((l) => Object.freeze(l)),
);

/** The words of one line, by id. Throws on an unknown id, so a typo cannot show empty words. */
export function bayWords(id) {
  const l = BAY_LINES.find((x) => x.id === id);
  if (!l) throw new Error(`no loading bay line ${id}`);
  return l.text;
}
