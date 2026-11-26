/**
 * Every word of the bedtime story (Chapter 1, beat 21: why Moon Pies), in the order a player meets them. Nothing
 * else in the bedtime story shows words: he walks to bed with no words, and he falls asleep with no words.
 * Squatch asks for the story in words (Brian, 2026-11-26, video note 0:12: "is squash asking for a story? Maybe he
 * should just say, tell me about when we first met or something like that?"; it was a wordless pat and a thought
 * bubble before).
 * The three captions are copied word for word from commit 71ec66e (2026-11-02), the crate story the game played
 * before the redesigned Chapter 1. Brian, 2026-11-25: the old crate story "is the bedtime story (beat 21) and gets
 * the same sizing fix". Mops's goat sound there was "...Baaa?"; Brian, 2026-11-26, video note 0:28: "Goats say
 * "weeeent" not baaaah", so it is his approved goat spelling (docs/MORNING-LINES-FOR-BRIAN.md row 13, DECISIONS
 * R96: "Weeee-eenn-nnttt"). Mops's line is the one the game already showed at bedtime (beat 21's line in
 * docs/CH1-STORY-WALKTHROUGH.md, still marked pending there). His Guardians line after it is Brian's ask of 2026-11-26
 * (Mops tells him about the Guardians, without hinting it's him); Brian approved its words the same day (chat 18b A).
 *   id      the line's name in the code and in tests/bedtime-story.mjs
 *   who     "caption" (the white box under a picture), "mops" or "sq" (a speech bubble over Mops or Squatch), "sign" (words painted
 *           on a thing), "mark" (a sign drawn over someone: the game's sleep mark, a surprise mark)
 *   text    the words, exactly as shown
 *   status  "restored from 71ec66e, needs-yes" (old words brought back, waiting for Brian's yes for this place),
 *           "in-game, needs-yes" (already in the game today, waiting for his yes), "Brian ..." (his words), "approved"
 *           (Brian's yes, source says where)
 *   source  where the words came from
 */
const OLD = "Old crate story, commit 71ec66e (2026-11-02)";

export const BEDTIME_STORY_LINES = Object.freeze(
  [
    // in bed, before the pictures: he asks for the story
    { id: "sq-first-met", who: "sq", text: "Tell me about when we first met?", status: "approved", source: "Brian video note 0:12, 2026-11-26; approved word for word the same day" },
    // the delivery crate's painted badge: the same words as on his crate bed in the locked home room
    { id: "sign-moon-pies", who: "sign", text: "MOON PIES", status: "approved", source: OLD + "; the same badge as the crate bed in docs/locked-rooms/home-room-empty-closed-v6.png; Brian 2026-11-26: keep the old crate story words" },
    { id: "cap-crate", who: "caption", text: "A delivery crate of Moon Pies came to Stormtop.", status: "approved", source: OLD + "; Brian 2026-11-26: keep the old crate story words" },
    { id: "mark-surprise", who: "mark", text: "!", status: "approved", source: OLD + " (over Mops as he finds the baby); Brian 2026-11-26: keep the old crate story words" },
    { id: "mark-sleep", who: "mark", text: "z z z", status: "approved", source: OLD + "; the game's sleep mark today, and over Squatch as he snores at bedtime; Brian 2026-11-26: keep the old crate story words" },
    { id: "cap-baby", who: "caption", text: "Inside: a sleeping baby Sasquatch. Covered in crumbs.", status: "approved", source: OLD + "; Brian 2026-11-26: keep the old crate story words" },
    { id: "cap-beard", who: "caption", text: "He woke up, grabbed Mops's beard, and giggled.", status: "approved", source: OLD + "; Brian 2026-11-26: keep the old crate story words" },
    { id: "mops-weent", who: "mops", text: "...Weeee-eenn-nnttt?", status: "Brian 2026-11-26 (video note 0:28), his approved goat spelling", source: OLD + ' had "...Baaa?" here; Brian: "Goats say "weeeent" not baaaah"; spelling from docs/MORNING-LINES-FOR-BRIAN.md row 13 and DECISIONS R96' },
    // The fourth old picture (Brian 2026-11-26: turn it on).
    { id: "cap-bucket", who: "caption", text: "Tourists were coming! Mops hid him in the mop bucket.", status: "approved", source: OLD + "; the fourth picture, on (Brian 2026-11-26); Brian 2026-11-26: keep the old crate story words" },
    { id: "mops-nothing", who: "mops", text: "Nothing to see here!", status: "approved", source: OLD + "; the fourth picture, on (Brian 2026-11-26); Brian 2026-11-26: keep the old crate story words" },
    // back in the room, after the pictures
    { id: "mops-moon-pie", who: "mops", text: "You came to me in a Moon Pie crate. You've loved Moon Pies ever since.", status: "in-game, needs-yes", source: "The bedtime line the game showed before this change (beat 21, docs/CH1-STORY-WALKTHROUGH.md, pending)" },
    // then, over the picture of Squatch's crayon drawing of the Guardians (Brian, 2026-11-26: Mops tells him about the
    // Guardians without hinting it's him)
    { id: "mops-guardians", who: "mops", text: "And you've always had your Guardians, watching over you.", status: "approved", source: "Brian 2026-11-26, chat 18b A" },
  ].map((l) => Object.freeze(l)),
);

/**
 * The one switch of the bedtime story. bucketPicture: the old fourth picture (Mops hides the baby in his mop bucket
 * when tourists come, "Nothing to see here!"). On: Brian's answer of 2026-11-26 (Snack Quest Chat).
 */
export const BEDTIME_SWITCHES = Object.freeze({ bucketPicture: true });

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
