/**
 * Every word the evening of Day 2 shows (Chapter 1, beats 37 to 42c, the story pass of 2026-11-26 and round 7 of
 * 2026-11-27: the Employee of the Month wall, Jupiter's big red storm, the kid who pets the goat, Mops asking about the
 * family's cakes, the brochure, home alone ("No fizz.", "Maybe it's MARS!"), the fight, lights out and the idea, and night
 * one's choice), in the order a player meets them. Lines the
 * story pass marks KEEP (Brian's own Nov 8 words), CHANGED or NEW are built word for word and stay "pending" until
 * Brian says yes as he watches (Brian 2026-11-26: "Go! Go as far as you can without me.").
 *   id      the line's name in the code and in tests/evening.mjs
 *   who     "chip" (the goal words, shown only after about 20 s stuck while the next thing is outlined), "button" (the
 *           big action button), "sign" (words drawn in a picture), "card" (a card's words), "lockup" (the LOCKUP
 *           card's who and where), or who says it ("mops", "sq", "robot", "pa" (the station speaker), "dad", "mom",
 *           "kid" (the family at the window), "guest" (the guest at the bar), "ups" (the robot mailbox)). An "sq" line
 *           marked "a thought" or "a whisper" is drawn as his thought (the whisper style: a trail of circles).
 *   text    the words, exactly as shown
 *   status  "in-game" (the game showed these words before), "approved" (Brian's yes, word for word), "pending" (in the
 *           walkthrough or the lines file, waiting for his yes) or "suggested" (new words this beat needed; his yes
 *           first, listed in the pull request)
 *   source  where the words came from
 * The snack's names come from snack-name.js (one place for the rename).
 */
import { FAMILY } from "./snack-name.js";
import { OFFICE_CODE } from "./office-code.js";

export const EVENING_LINES = Object.freeze(
  [
    { id: "chip-go-on", who: "chip", text: "Squatch: go on", status: "in-game", source: "src/game/14-ch1-day2.js (beat 37)" },
    { id: "button-photos", who: "button", text: "LOOK · photos", status: "in-game", source: "src/game/14-ch1-day2.js (beat 37)" },
    { id: "sign-month", who: "sign", text: "EMPLOYEE OF THE MONTH", status: "pending", source: "story pass 2026-11-26 beat 37 (KEEP, pending)" },
    { id: "button-lift", who: "button", text: "LIFT · photo", status: "pending", source: "story pass 2026-11-26 beat 37 (the button reads LIFT · photo)" },
    { id: "sq-hid-it", who: "sq", text: "I hid that there when I was five.", status: "pending", source: "story pass 2026-11-26 beat 37 (NEW, a thought)" },
    { id: "sign-tied", who: "sign", text: "TIED TOGETHER FOREVER", status: "approved", source: "Brian 2026-11-13 (DECISIONS R62)" },
    { id: "sign-me", who: "sign", text: "ME", status: "approved", source: "story pass 2026-11-26 decided 2026-11-26 (question 2: A, two tags with arrows)" },
    { id: "sign-mops", who: "sign", text: "MOPS", status: "approved", source: "story pass 2026-11-26 decided 2026-11-26 (question 2: A)" },
    { id: "robot-beep", who: "robot", text: "BEEP BEEP", status: "approved", source: "Brian 2026-11-13 (DECISIONS R62)" },
    { id: "chip-to-hall", who: "chip", text: "Squatch: go on to the hall", status: "suggested", source: "new: after the hallway robot has gone (beat 37), the hall's doorway outlined" },
    { id: "chip-roll", who: "chip", text: "Squatch: roll up!", status: "suggested", source: "new: the robot comes through the hallway (story pass beat 37: ROLL · ball or step back)" },
    { id: "where-hallway", who: "lockup", text: "in the hallway", status: "suggested", source: "new: the lockup card when the hallway robot sees him (beat 37)" },
    // ---- 36b to 39, round 7 (Brian's video notes of 2026-11-27, r5 4:49 to 6:08; q: 119, the pick A): he hides behind the
    // bar as they walk in, the player is Mops, the kid pets the goat, Mops asks about the cakes, Dad hands him a brochure ----
    { id: "mops-behind-bar", who: "mops", text: "Behind the bar. Quick.", status: "pending", source: "review 2026-11-27 topic B (NEW; Brian r5 4:49: they hide behind the bar when they walk in)" },
    { id: "chip-hide", who: "chip", text: "Squatch: hide behind the bar", status: "pending", source: "review 2026-11-27 topic B (goal words, CHANGED: it said only to hide)" },
    { id: "button-counter", who: "button", text: "HIDE · bar", status: "pending", source: "review 2026-11-27 topic B (CHANGED: was HIDE · counter; Mops calls it the bar)" },
    { id: "pa-storm", who: "pa", text: "The Great Red Storm is passing!", status: "pending", source: "story pass 2026-11-26 beat 38a (KEEP)" },
    { id: "pa-window", who: "pa", text: "Best view: the big window.", status: "pending", source: "story pass 2026-11-26 beat 38a (KEEP)" },
    { id: "robots-paused", who: "robot", text: "GUESTS PRESENT. CLEANING PAUSED.", status: "pending", source: "story pass 2026-11-26 beat 38a (KEEP: the cleaning robots, as they roll out)" },
    { id: "kid-red", who: "kid", text: "Whoa. It's SO red.", status: "pending", source: "story pass 2026-11-26 beat 38a (KEEP)" },
    { id: "mom-mars", who: "mom", text: "Red like Mars.", status: "pending", source: "story pass 2026-11-26 beat 38a (KEEP)" },
    { id: "dad-loved", who: "dad", text: "Oh, we loved Mars.", status: "pending", source: "story pass 2026-11-26 beat 38a (KEEP)" },
    { id: "mom-best", who: "mom", text: "What did you like best?", status: "pending", source: "story pass 2026-11-26 beat 38a (KEEP)" },
    // (question 120, Brian 2026-11-27: the stand sells only these; no pancakes anywhere in the game)
    { id: "kid-mars-cakes", who: "kid", text: `The ${FAMILY.NAME}!`, status: "pending", source: "review 2026-11-27 topic B (CHANGED: the old line named another food; Brian r5 5:22)" },
    { id: "kid-goat", who: "kid", text: "A GOAT! Can I pet him?", status: "pending", source: "review 2026-11-27 topic B (NEW; Brian r5 5:34)" },
    { id: "mom-ganitor", who: "mom", text: "That's the Ganitor. He's famous.", status: "pending", source: "review 2026-11-27 topic B (NEW; Brian r5 5:34)" },
    { id: "mom-only-goat", who: "mom", text: "The only goat janitor in the whole galaxy.", status: "pending", source: "review 2026-11-27 topic B (NEW; Brian r5 5:34, his words)" },
    { id: "switch-mops", who: "switch", text: "Squatch stays hidden. Mops meets the guests.", status: "pending", source: "review 2026-11-27 topic B (NEW: the reason on the switch card)" },
    { id: "chip-greet", who: "chip", text: "Mops: say hello to the kid", status: "pending", source: "review 2026-11-27 topic B (goal words, NEW)" },
    { id: "button-greet", who: "button", text: "GREET · kid", status: "pending", source: "review 2026-11-27 topic B (NEW: the kid pets him)" },
    { id: "mom-bedtime", who: "mom", text: "Come on. Bedtime.", status: "pending", source: "review 2026-11-27 topic B (CHANGED: was \"Bedtime.\")" },
    { id: "chip-ask", who: "chip", text: `Mops: ask the family about the ${FAMILY.name}`, status: "pending", source: "review 2026-11-27 topic B (goal words, NEW)" },
    { id: "button-talk", who: "button", text: "TALK · family", status: "pending", source: "review 2026-11-27 topic B (NEW)" },
    { id: "mops-what", who: "mops", text: `Hey. What were you saying about ${FAMILY.name}?`, status: "pending", source: "review 2026-11-27 topic B (NEW; Brian r5 5:53, his words, the snack named from snack-name.js)" },
    { id: "dad-best-had", who: "dad", text: "The best I've ever had.", status: "pending", source: "review 2026-11-27 topic B (NEW; Brian r5 5:53, his words)" },
    { id: "kid-fizzy", who: "kid", text: "And FIZZY!", status: "pending", source: "review 2026-11-27 topic B (CHANGED: was \"And the fizzy cakes!\"; Brian r5 5:53: \"and fizzy\")" },
    { id: "dad-wookiees", who: "dad", text: "A family of Wookiees makes them.", status: "pending", source: "review 2026-11-27 topic B (CHANGED; Brian r5 6:08: they say Wookiees on purpose)" },
    { id: "dad-only-stand", who: "dad", text: "You can only get them at their stand.", status: "pending", source: "review 2026-11-27 topic B (NEW: or Mops would just order them)" },
    { id: "dad-brochure", who: "dad", text: "In fact, I've got a brochure here.", status: "pending", source: "review 2026-11-27 topic B (CHANGED: was \"Here's a brochure I got on it.\"; Brian r5 5:53, his words)" },
    { id: "sign-mars-cakes", who: "sign", text: FAMILY.NAME, status: "pending", source: "review 2026-11-27 topic B: the one cake box on the brochure (a brochure for the stand: no cooks, no paw print; Brian r5 6:08)" },
    { id: "switch-squatch", who: "switch", text: "The guests are gone. Squatch can come out.", status: "pending", source: "review 2026-11-27 topic B (NEW: the reason on the switch card)" },
    { id: "mops-take-home", who: "mops", text: "Take this home.", status: "pending", source: "review 2026-11-27 topic B (CHANGED: was \"I have to get back to work.\"; Mops passes the brochure down to him)" },
    { id: "mops-tonight", who: "mops", text: "We'll talk tonight.", status: "pending", source: "story pass 2026-11-26 beat 39 (KEEP)" },
    { id: "chip-home", who: "chip", text: "Squatch: go home", status: "in-game", source: "src/game/14-ch1-day2.js (beat 39)" },
    { id: "chip-box", who: "chip", text: "Squatch: open the box from the Guardians", status: "suggested", source: "new: story pass beat 39b (OPEN · box)" },
    { id: "button-open-box", who: "button", text: "OPEN · box", status: "pending", source: "story pass 2026-11-26 beat 39b (OPEN · box)" },
    { id: "chip-bite", who: "chip", text: "Squatch: bite the cake", status: "suggested", source: "new: story pass beat 39b (BITE)" },
    { id: "button-bite", who: "button", text: "BITE · cake", status: "suggested", source: "story pass 2026-11-26 beat 39b (BITE; the action buttons read VERB · thing)" },
    { id: "sq-no-fizz", who: "sq", text: "No fizz.", status: "pending", source: "story pass 2026-11-26 beat 39b (NEW)" },
    { id: "chip-crate", who: "chip", text: "Squatch: hold the brochure up to your crate", status: "suggested", source: "new: story pass beat 39b (HOLD UP · brochure)" },
    { id: "button-hold-up", who: "button", text: "HOLD UP · brochure", status: "pending", source: "story pass 2026-11-26 beat 39b (HOLD UP · brochure)" },
    // (q: 121, the pick A: one close-up, the brochure beside the faded stamp; no slide, no crayon ST)
    { id: "sq-thought-stars", who: "sq", text: "We always thought it said STARS.", status: "pending", source: "review 2026-11-27 topic C (NEW; Brian r5 7:00, his words)" },
    { id: "sq-maybe-mars", who: "sq", text: "Maybe it's MARS!", status: "pending", source: "review 2026-11-27 topic C (CHANGED: was \"MARS!\"; Brian r5 7:00)" },
    { id: "card-evening", who: "card", text: "That evening…", status: "approved", source: "the approved card from Day 1, reused (story pass beat 40)" },
    { id: "chip-show", who: "chip", text: "Squatch: show Mops the brochure", status: "suggested", source: "Call 14; Brian P 36:07 \"Squatch should show him the brochure\"" },
    { id: "button-show", who: "button", text: "SHOW · brochure", status: "suggested", source: "Call 14" },
    // (question 122, Brian's answer of 2026-11-27: B. The fight ends on his line, then straight to "Bed.")
    { id: "sq-crate-mars", who: "sq", text: "Mops! Look. Maybe my crate says MARS.", status: "pending", source: "review 2026-11-27 topic C (CHANGED: was \"Mops! My crate says MARS!\")" },
    { id: "mops-maybe", who: "mops", text: "...Maybe.", status: "pending", source: "review 2026-11-27 topic C (CHANGED: was \"It says Stars.\"; Brian r5 7:22: he would not insist it says Stars)" },
    { id: "sq-came", who: "sq", text: "I came in that crate. Maybe I came from Mars!", status: "pending", source: "review 2026-11-27 topic C (NEW: his hope comes from his crate now)" },
    { id: "sq-can-we", who: "sq", text: "Can we go?", status: "pending", source: "review 2026-11-27 topic C (CHANGED: was \"Can we go to Mars?\")" },
    { id: "mops-wookiees", who: "mops", text: "The man said Wookiees. You're not a Wookiee.", status: "pending", source: "review 2026-11-27 topic C (NEW; Brian r5 6:08 and 7:34)" },
    { id: "sq-you-thought", who: "sq", text: "YOU thought I was a Wookiee!", status: "pending", source: "review 2026-11-27 topic C (NEW: Mops's own bedtime-story line turned on him)" },
    { id: "mops-no-others", who: "mops", text: "Squatch. There are no other Sasquatches.", status: "pending", source: "story pass 2026-11-26 beat 40 (NEW)" },
    { id: "mops-one-kind", who: "mops", text: "You're one of a kind. Like me.", status: "pending", source: "story pass 2026-11-26 beat 40 (CHANGED: Brian's Nov 8 words)" },
    { id: "mops-know", who: "mops", text: "I know what it's like to be one of a kind.", status: "pending", source: "story pass 2026-11-26 beat 40 (KEEP: Brian's Nov 8 words)" },
    { id: "mops-manager", who: "mops", text: "You heard the manager.", status: "pending", source: "story pass 2026-11-26 beat 40 (CHANGED)" },
    { id: "mops-need-me", who: "mops", text: "They need me here.", status: "pending", source: "story pass 2026-11-26 beat 40 (CHANGED)" },
    { id: "sq-replace", who: "sq", text: "What if they replace you anyway?", status: "pending", source: "story pass 2026-11-26 beat 40 (NEW)" },
    { id: "mops-wont", who: "mops", text: "They won't.", status: "pending", source: "story pass 2026-11-26 beat 40 (NEW)" },
    { id: "mops-safe", who: "mops", text: "And we're safe here.", status: "pending", source: "story pass 2026-11-26 beat 40 (NEW)" },
    { id: "sq-hide-here", who: "sq", text: "Safe? I have to HIDE here.", status: "pending", source: "story pass 2026-11-26 beat 40 (NEW)" },
    { id: "mops-guardians", who: "mops", text: "The Guardians are here.", status: "pending", source: "story pass 2026-11-26 beat 40 (CHANGED: was \"Plus the Guardians are here.\")" },
    { id: "button-ask", who: "button", text: "ASK · again", status: "pending", source: "story pass 2026-11-26 beat 40 (the two picture buttons)" },
    { id: "button-stomp", who: "button", text: "STOMP · to bed", status: "pending", source: "story pass 2026-11-26 beat 40" },
    { id: "mops-wait", who: "mops", text: "Squatch. Wait.", status: "pending", source: "story pass 2026-11-26 beat 40 (STOMP: Mops calls him back first)" },
    { id: "sq-why", who: "sq", text: "Why won't you help me find my family?", status: "pending", source: "story pass 2026-11-26 beat 40 (NEW: Brian's words)" },
    { id: "mops-already", who: "mops", text: "Squatch... I already...", status: "pending", source: "story pass 2026-11-26 beat 40 (NEW; decided 2026-11-26, question 5: A)" },
    { id: "mops-family", who: "mops", text: "I AM your family.", status: "pending", source: "story pass 2026-11-26 beat 40 (NEW)" },
    { id: "sq-real", who: "sq", text: "Maybe my REAL family wouldn't make me hide!", status: "pending", source: "story pass 2026-11-26 beat 40 (CHANGED; decided 2026-11-26, question 4: B)" },
    { id: "mops-bed", who: "mops", text: "Bed. The floors don't mop themselves.", status: "pending", source: "story pass 2026-11-26 beat 40 (CHANGED: Brian's Nov 8 line)" },
    { id: "chip-bed", who: "chip", text: "Squatch: go to sleep in your bed", status: "in-game", source: "src/game/10-ch1.js (O8)" },
    { id: "button-bed", who: "button", text: "SLEEP · bed", status: "in-game", source: "src/game/10-ch1.js (O8)" },
    { id: "mark-sleep", who: "sign", text: "z z z", status: "in-game", source: "bedtime-story-lines.js mark-sleep" },
    { id: "sq-floors", who: "sq", text: "The floors don't mop themselves...", status: "pending", source: "story pass 2026-11-26 beat 41 (CHANGED: Brian's Nov 8 words, a whisper)" },
    { id: "sq-robots-do", who: "sq", text: "But those robots do.", status: "pending", source: "story pass 2026-11-26 beat 41 (CHANGED, same line)" },
    { id: "sq-the-form", who: "sq", text: "The form!", status: "pending", source: "story pass 2026-11-26 beat 41 (NEW)" },
    { id: "chip-out", who: "chip", text: "Squatch: sneak out the door", status: "in-game", source: "src/game/10-ch1.js (O3b)" },
    { id: "mops-weee", who: "mops", text: "Weee...?", status: "pending", source: "story pass 2026-11-26 beat 42a (Mops snorts when the bucket clangs)" },
    { id: "chip-bin", who: "chip", text: "Squatch: get the form from the bin", status: "pending", source: "story pass 2026-11-26 beat 42a (CHANGED)" },
    { id: "button-copies", who: "button", text: "GRAB · copies", status: "pending", source: "src/game/14-ch1-day2.js (beat 42; pending in the lines file)" },
    { id: "sign-order", who: "sign", text: "ORDER MORE ROBOTS", status: "pending", source: "walkthrough beat 32 (the box is drawn)" },
    { id: "sign-code", who: "sign", text: OFFICE_CODE, status: "approved", source: "Brian, chat 2026-11-26: Isfred's office code (office-code.js)" },
    { id: "sq-if-replace", who: "sq", text: "If they replace Mops...", status: "pending", source: "story pass 2026-11-26 beat 42b (CHANGED: Brian's Nov 8 words)" },
    { id: "sq-come-with", who: "sq", text: "Maybe he would come with me.", status: "pending", source: "story pass 2026-11-26 beat 42b (CHANGED, same line)" },
    { id: "sq-or-stay", who: "sq", text: "Or put it back. And stay.", status: "pending", source: "story pass 2026-11-26 beat 42b (NEW)" },
    { id: "button-mark", who: "button", text: "MARK · box", status: "pending", source: "story pass 2026-11-26 beat 42b" },
    { id: "button-put-back", who: "button", text: "PUT BACK · bin", status: "pending", source: "story pass 2026-11-26 beat 42b" },
    { id: "card-put-back", who: "card", text: "Squatch put it back.", status: "pending", source: "story pass 2026-11-26 beat 42b (NEW; decided 2026-11-26, question 6: A)" },
    { id: "card-kept", who: "card", text: "Mops kept mopping. Squatch kept hiding.", status: "pending", source: "story pass 2026-11-26 beat 42b (NEW)" },
    { id: "card-happily", who: "card", text: "They lived happily-ish ever after.", status: "pending", source: "story pass 2026-11-26 beat 42b (NEW)" },
    { id: "card-end", who: "card", text: "THE END?", status: "pending", source: "story pass 2026-11-26 beat 42b (NEW)" },
    { id: "button-go-back", who: "button", text: "GO BACK · to the form", status: "pending", source: "story pass 2026-11-26 beat 42b (NEW)" },
    { id: "chip-post", who: "chip", text: "Squatch: post the yellow copy", status: "in-game", source: "src/game/14-ch1-day2.js (beat 42)" },
    { id: "button-post", who: "button", text: "POST · mailbox", status: "in-game", source: "src/game/14-ch1-day2.js (beat 42)" },
    { id: "ups-scanned", who: "ups", text: "MAIL SCANNED.", status: "pending", source: "story pass 2026-11-26 beat 42c (CHANGED: split in two, capitals because it is loud)" },
    { id: "ups-accepted", who: "ups", text: "PAWATURE ACCEPTED.", status: "pending", source: "story pass 2026-11-26 beat 42c (CHANGED)" },
    { id: "sq-shhh", who: "sq", text: "Shhh!", status: "pending", source: "story pass 2026-11-26 beat 42c (NEW)" },
    { id: "button-crate", who: "button", text: "HIDE · crate", status: "in-game", source: "lunch-sneak-lines.js button-crate (the crate by the big wall vent)" },
    { id: "sq-pink", who: "sq", text: "No! The pink one!", status: "pending", source: "story pass 2026-11-26 beat 42c (NEW)" },
    { id: "sq-mailed", who: "sq", text: "...The yellow one got mailed.", status: "pending", source: "story pass 2026-11-26 beat 42c (NEW)" },
    { id: "sq-done", who: "sq", text: "It's done.", status: "pending", source: "story pass 2026-11-26 beat 42c (NEW)" },
    { id: "chip-sneak-home", who: "chip", text: "Squatch: sneak home", status: "in-game", source: "src/game/14-ch1-day2.js (beat 42)" },
    { id: "button-plant", who: "button", text: "HIDE · plant", status: "in-game", source: "lunch-sneak-lines.js button-plant" },
    { id: "button-ball", who: "button", text: "ROLL · ball", status: "approved", source: "Brian 2026-11-26 (ball anytime)" },
    { id: "who-robot", who: "lockup", text: "A robot", status: "in-game", source: "src/game/25-capture.js (delivery)" },
    { id: "where-bay", who: "lockup", text: "in the delivery room", status: "in-game", source: "src/game/25-capture.js (delivery)" },
  ].map((l) => Object.freeze(l)),
);

/** The words of one line, by id. Throws on an unknown id, so a typo cannot show empty words. */
export function eveningWords(id) {
  const l = EVENING_LINES.find((x) => x.id === id);
  if (!l) throw new Error(`no evening line ${id}`);
  return l.text;
}
