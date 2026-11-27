/**
 * Every word of the bedtime story (Chapter 1, beat 21: why he loves the station's snack), in the order a player meets them. Nothing
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
import { SNACK } from "./snack-name.js";

const OLD = "Old crate story, commit 71ec66e (2026-11-02)";

export const BEDTIME_STORY_LINES = Object.freeze(
  [
    // in bed, before the pictures: he asks for the story
    { id: "sq-first-met", who: "sq", text: "Tell me about when we first met?", status: "approved", source: "Brian video note 0:12, 2026-11-26; approved word for word the same day" },
    // (the delivery crate's stamp, as it arrived: the family crate's worn stamp, first letter scraped off, no crayon yet; its words are the
    // snack's lines, snack-name.js SNACK_LINES "stamp-family-faded")
    { id: "cap-crate", who: "caption", text: `A delivery crate of ${SNACK.name} came to Stormtop.`, status: "approved", source: OLD + "; Brian 2026-11-26: keep the old crate story words; the snack renamed the same day (question 86)" },
    { id: "mark-surprise", who: "mark", text: "!", status: "approved", source: OLD + " (over Mops as he finds the baby); Brian 2026-11-26: keep the old crate story words" },
    { id: "mark-sleep", who: "mark", text: "z z z", status: "approved", source: OLD + "; the game's sleep mark today, and over Squatch as he snores at bedtime; Brian 2026-11-26: keep the old crate story words" },
    { id: "cap-baby", who: "caption", text: "Inside: a sleeping baby Sasquatch. Covered in crumbs.", status: "approved", source: OLD + "; Brian 2026-11-26: keep the old crate story words" },
    { id: "cap-beard", who: "caption", text: "He woke up, grabbed Mops's beard, and giggled.", status: "approved", source: OLD + "; Brian 2026-11-26: keep the old crate story words" },
    { id: "mops-weent", who: "mops", text: "...Weeee-eenn-nnttt?", status: "Brian 2026-11-26 (video note 0:28), his approved goat spelling", source: OLD + ' had "...Baaa?" here; Brian: "Goats say "weeeent" not baaaah"; spelling from docs/MORNING-LINES-FOR-BRIAN.md row 13 and DECISIONS R96' },
    // The fourth old picture (Brian 2026-11-26: turn it on).
    { id: "cap-bucket", who: "caption", text: "Tourists were coming! Mops hid him in the mop bucket.", status: "approved", source: OLD + "; the fourth picture, on (Brian 2026-11-26); Brian 2026-11-26: keep the old crate story words" },
    // the wordless picture before his line: two tourists peek in at the door, a "?" over each (Brian 2026-11-26, video
    // note 0:39: "Would we actually want people to walk in so we see that tourists are suspicious?")
    { id: "mark-wonder", who: "mark", text: "?", status: "suggested, needs-yes", source: "A mark over each tourist peeking in (the cause Brian asked for, 2026-11-26 video note 0:39); the game's '?' over a guest who wonders (party-watch.js)" },
    { id: "mops-nothing", who: "mops", text: "Nothing to see here!", status: "approved", source: OLD + "; the fourth picture, on (Brian 2026-11-26); Brian 2026-11-26: keep the old crate story words" },
    // back in the room, after the pictures
    { id: "mops-moon-pie", who: "mops", text: `You came to me in a ${SNACK.name} crate. You've loved ${SNACK.name} ever since.`, status: "renamed, needs-yes", source: "Words changed by the rename (Brian 2026-11-26, question 86: the snack's new name), so his yes is asked again. Before: The bedtime line the game showed before (beat 21, docs/CH1-STORY-WALKTHROUGH.md); Brian 2026-11-26, #36: approved as written" },
    // then, over the picture of Squatch's crayon drawing of the Guardians (Brian, 2026-11-26: Mops tells him about the
    // Guardians without hinting it's him)
    // Back in the room, before his snack line: why Mops kept him (Brian, story pass 28-52, E4, proposed: his Nov 8
    // playtest words, "one of a kind, like me, the only goat janitor"). Every one waits for Brian's yes.
    { id: "mops-thought-wookiee", who: "mops", text: "I thought: a Wookiee!", status: "pending, needs-yes", source: "Brian, story pass 28-52, E2/E4 (CHANGED from his Nov 8 words \"It's a Wookiee!\")" },
    { id: "mops-looked-different", who: "mops", text: "But you looked different.", status: "pending, needs-yes", source: "Brian, story pass 28-52, E2/E4 (CHANGED from his Nov 8 words \"You do look different. You're furry like a Wookiee, but you're not.\")" },
    { id: "mops-one-of-a-kind", who: "mops", text: "Maybe you were one of a kind. Like me.", status: "pending, needs-yes", source: "Brian, story pass 28-52, E2/E4 (CHANGED, his Nov 8 words)" },
    { id: "mops-only-goat", who: "mops", text: "The only goat janitor.", status: "pending, needs-yes", source: "Brian, story pass 28-52, E2/E4 (KEEP, his Nov 8 words; new in this place)" },
    { id: "mops-know-one", who: "mops", text: "I know what it's like to be one of a kind.", status: "pending, needs-yes", source: "Brian, story pass 28-52, E2/E4 (KEEP, his Nov 8 words; new in this place)" },
    { id: "mops-take-care", who: "mops", text: "So I said: I'll take care of you.", status: "pending, needs-yes", source: "Brian, story pass 28-52, E2/E4 (CHANGED from his Nov 8 words \"I'll take care of you.\")" },
    // After his snack line: the last cake (the snack thread (docs: the crate-kind thread), decided 2026-11-26: the original had the red middle
    // that fizzes). Mops's three lines are said over one picture: the scraped crate, crumbs, one cake cut open, red in
    // the middle, sparking (the cutaway "lastcake").
    { id: "sq-last-cake", who: "sq", text: "Tell me about the last cake.", status: "pending, needs-yes", source: "Brian, story pass 28-52, E2/E4" },
    { id: "mops-one-left", who: "mops", text: "One cake left. Red in the middle.", status: "pending, needs-yes", source: "Brian, story pass 28-52, E2/E4" },
    { id: "mops-fizzed", who: "mops", text: "It fizzed.", status: "pending, needs-yes", source: "Brian, story pass 28-52, E2/E4" },
    { id: "mops-never-found", who: "mops", text: "Never found one like it.", status: "pending, needs-yes", source: "Brian, story pass 28-52, E2/E4" },
    { id: "sq-guardians-will", who: "sq", text: "The Guardians will.", status: "pending, needs-yes", source: "Brian, story pass 28-52, E2/E4 (then Mops says nothing: one heart)" },
    { id: "mops-guardians", who: "mops", text: "And you've always had your Guardians, watching over you.", status: "approved", source: "Brian 2026-11-26, chat 18b A" },
  ].map((l) => Object.freeze(l)),
);

/**
 * The one switch of the bedtime story. bucketPicture: the old fourth picture (Mops hides the baby in his mop bucket
 * when tourists come, "Nothing to see here!"). On: Brian's answer of 2026-11-26 (Snack Quest Chat).
 */
export const BEDTIME_SWITCHES = Object.freeze({ bucketPicture: true });

/** Mops's "one of a kind" lines, in order (story pass 28-52, E4, proposed; pending). */
export const ONE_OF_A_KIND = Object.freeze(["mops-thought-wookiee", "mops-looked-different", "mops-one-of-a-kind", "mops-only-goat", "mops-know-one", "mops-take-care"]);
/** The last cake's three lines, one picture each (cutaway "lastcake"). */
export const LAST_CAKE = Object.freeze(["mops-one-left", "mops-fizzed", "mops-never-found"]);

/** The words of one line, by id. Throws on an unknown id, so a typo cannot show empty words. */
export function bedLine(id) {
  const l = BEDTIME_STORY_LINES.find((x) => x.id === id);
  if (!l) throw new Error(`no bedtime story line ${id}`);
  return l.text;
}

/** True for Mops's gentle bedtime line: it never gets his goat "meh" (bridge.js bubbleSound). */
export function quietBedtimeLine(b) {
  return !!b && b.who === "mops" && QUIET_BEDTIME.some((id) => b.text === bedLine(id));
}
// Mops's gentle bedtime lines (no goat "meh"): his snack line, and the story pass's lines round it (E4).
const QUIET_BEDTIME = Object.freeze(["mops-moon-pie", ...ONE_OF_A_KIND]);
