/**
 * Every word of the bedtime story (Chapter 1, beat 21: why Moon Pies), in the order a player meets them. Nothing
 * else in the bedtime story shows words: Squatch asks for the story with no words (he pats his crate bed and a
 * thought bubble shows a little Moon Pie crate), and he falls asleep with no words.
 * The three captions and "...Baaa?" are copied word for word from commit 71ec66e (2026-11-02), the crate story
 * the game played before the redesigned Chapter 1. Brian, 2026-11-25: the old crate story "is the bedtime story
 * (beat 21) and gets the same sizing fix". Mops's line is the one the game already showed at bedtime (beat 21's
 * line in docs/CH1-STORY-WALKTHROUGH.md, still marked pending there).
 *   id      the line's name in the code and in tests/bedtime-story.mjs
 *   who     "caption" (the white box under a picture), "mops" (a speech bubble over Mops), "sign" (words painted
 *           on a thing), "mark" (a sign drawn over someone: the game's sleep mark, a surprise mark)
 *   text    the words, exactly as shown
 *   status  "restored from 71ec66e, needs-yes" (old words brought back, waiting for Brian's yes for this place),
 *           "in-game, needs-yes" (already in the game today, waiting for his yes)
 *   source  where the words came from
 */
const OLD = "Old crate story, commit 71ec66e (2026-11-02)";

export const BEDTIME_STORY_LINES = Object.freeze(
  [
    // the delivery crate's painted badge: the same words as on his crate bed in the locked home room
    { id: "sign-moon-pies", who: "sign", text: "MOON PIES", status: "restored from 71ec66e, needs-yes", source: OLD + "; the same badge as the crate bed in docs/locked-rooms/home-room-empty-closed-v6.png" },
    { id: "cap-crate", who: "caption", text: "A delivery crate of Moon Pies came to Stormtop.", status: "restored from 71ec66e, needs-yes", source: OLD },
    { id: "mark-surprise", who: "mark", text: "!", status: "restored from 71ec66e, needs-yes", source: OLD + " (over Mops as he finds the baby)" },
    { id: "mark-sleep", who: "mark", text: "z z z", status: "restored from 71ec66e, needs-yes", source: OLD + "; the game's sleep mark today" },
    { id: "cap-baby", who: "caption", text: "Inside: a sleeping baby Sasquatch. Covered in crumbs.", status: "restored from 71ec66e, needs-yes", source: OLD },
    { id: "cap-beard", who: "caption", text: "He woke up, grabbed Mops's beard, and giggled.", status: "restored from 71ec66e, needs-yes", source: OLD },
    { id: "mops-baa", who: "mops", text: "...Baaa?", status: "restored from 71ec66e, needs-yes", source: OLD + " (Mops says it: docs/old/original-story-spine.md)" },
    // The fourth old picture. Left out for now (BEDTIME_SWITCHES.bucketPicture): it is a question for Brian.
    { id: "cap-bucket", who: "caption", text: "Tourists were coming! Mops hid him in the mop bucket.", status: "restored from 71ec66e, needs-yes", source: OLD + "; shown only with BEDTIME_SWITCHES.bucketPicture on" },
    { id: "mops-nothing", who: "mops", text: "Nothing to see here!", status: "restored from 71ec66e, needs-yes", source: OLD + "; shown only with BEDTIME_SWITCHES.bucketPicture on" },
    // back in the room, after the pictures
    { id: "mops-moon-pie", who: "mops", text: "You came to me in a Moon Pie crate. You've loved Moon Pies ever since.", status: "in-game, needs-yes", source: "The bedtime line the game showed before this change (beat 21, docs/CH1-STORY-WALKTHROUGH.md, pending)" },
  ].map((l) => Object.freeze(l)),
);

/**
 * The one switch of the bedtime story. bucketPicture: the old fourth picture (Mops hides the baby in his mop bucket
 * when tourists come, "Nothing to see here!"). Off: it is a question for Brian whether it stays.
 */
export const BEDTIME_SWITCHES = Object.freeze({ bucketPicture: false });

/** The words of one line, by id. Throws on an unknown id, so a typo cannot show empty words. */
export function bedLine(id) {
  const l = BEDTIME_STORY_LINES.find((x) => x.id === id);
  if (!l) throw new Error(`no bedtime story line ${id}`);
  return l.text;
}

/** True for Mops's gentle bedtime line: it never gets his goat "meh" (bridge.js bubbleSound). */
export function quietBedtimeLine(b) {
  return !!b && b.who === "mops" && b.text === bedLine("mops-moon-pie");
}
