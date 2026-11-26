/**
 * Every word the evening of Day 2 shows (Chapter 1, beats 37 to 42: the Employee of the Month wall, the pancake
 * brochure, "Are those other Sasquatches?", the Mars talk, lights out, night one's paw order), in the order a player
 * meets them. Newest decisions win (the 2026-11-26 digest of DECISIONS.md and Brian's threads): the plaque and the
 * crayon labels use the approved Ganitor words (ganitor.js), the tourists' two pancake lines are cut (Call 16), and
 * Squatch shows the brochure with no new words (Call 14).
 *   id      the line's name in the code and in tests/evening.mjs
 *   who     "chip" (the goal words, shown only after about 20 s stuck while the next thing is outlined), "button" (the
 *           big action button), "sign" (words drawn in a picture), or who says it ("tourist", "mops", "sq", "robot",
 *           "ups" (the robot mailbox))
 *   text    the words, exactly as shown
 *   status  "in-game" (the game showed these words before), "approved" (Brian's yes, word for word), "pending" (in the
 *           walkthrough or the lines file, waiting for his yes) or "suggested" (new words this beat needed; his yes
 *           first, listed in the pull request)
 *   source  where the words came from
 */
const DAY2 = "src/game/14-ch1-day2.js before this change";

export const EVENING_LINES = Object.freeze(
  [
    // ---------- beat 37: the hallway ----------
    { id: "chip-go-on", who: "chip", text: "Squatch: go on", status: "in-game", source: DAY2 + " (beat 37)" },
    { id: "button-photos", who: "button", text: "LOOK · photos", status: "in-game", source: DAY2 + " (beat 37)" },
    { id: "sign-tied", who: "sign", text: "TIED TOGETHER FOREVER", status: "approved", source: "Brian 2026-11-13 (DECISIONS R62)" },
    { id: "robot-beep", who: "robot", text: "BEEP BEEP", status: "approved", source: "Brian 2026-11-13 (DECISIONS R62)" },
    // ---------- beat 38: the snack bar ----------
    // (a line over about 12 words is shown as two or three bubbles, the words unchanged: Brian 2026-11-26, [40 0:05])
    { id: "tourist-moonpies", who: "tourist", text: "I swear we had more Moon Pies...", status: "pending", source: "walkthrough beat 38 (DECISIONS S33), first part" },
    { id: "tourist-moonpies-2", who: "tourist", text: "is that what they stole at lunch?", status: "pending", source: "walkthrough beat 38 (DECISIONS S33), second part" },
    { id: "mops-hide", who: "mops", text: "Quick, hide.", status: "pending", source: "walkthrough beat 38 (DECISIONS S33)" },
    { id: "chip-hide", who: "chip", text: "Squatch: hide", status: "in-game", source: DAY2 + " (beat 38)" },
    { id: "button-counter", who: "button", text: "HIDE · counter", status: "suggested", source: "new: hiding behind the snack counter (DECISIONS R107)" },
    { id: "chip-brochure", who: "chip", text: "Squatch: grab the brochure", status: "in-game", source: "src/game/10-ch1.js (S5:bro)" },
    { id: "button-brochure", who: "button", text: "GRAB · brochure", status: "in-game", source: "src/game/11-ch1-hall.js (the old brochure)" },
    // ---------- beat 39 ----------
    { id: "sq-other", who: "sq", text: "Are those other Sasquatches?", status: "pending", source: "walkthrough beat 39 (was \"Were those other Sasquatches?\")" },
    { id: "mops-work", who: "mops", text: "I need to get back to work, we'll talk about it tonight.", status: "pending", source: "walkthrough beat 39" },
    { id: "chip-home", who: "chip", text: "Squatch: go home", status: "in-game", source: DAY2 + " (beat 39)" },
    // ---------- beat 40: the Mars talk ----------
    { id: "chip-show", who: "chip", text: "Squatch: show Mops the brochure", status: "suggested", source: "new: Call 14 (Squatch holds up the brochure, no new words in a bubble); Brian P 36:07 \"Squatch should show him the brochure\"" },
    { id: "button-show", who: "button", text: "SHOW · brochure", status: "suggested", source: "new, as above" },
    { id: "mops-mars", who: "mops", text: "Didn't you hear what the manager said?", status: "pending", source: "walkthrough beat 40, first part" },
    { id: "mops-mars-2", who: "mops", text: "They need me here, they're not going to replace me.", status: "pending", source: "walkthrough beat 40, second part" },
    { id: "mops-mars-3", who: "mops", text: "Plus the Guardians are here.", status: "pending", source: "walkthrough beat 40, third part" },
    // ---------- beat 41: lights out ----------
    { id: "chip-bed", who: "chip", text: "Squatch: go to sleep in your bed", status: "in-game", source: "src/game/10-ch1.js (O8)" },
    { id: "button-bed", who: "button", text: "SLEEP · bed", status: "in-game", source: "src/game/10-ch1.js (O8)" },
    { id: "mark-sleep", who: "sign", text: "z z z", status: "in-game", source: "bedtime-story-lines.js mark-sleep" },
    // ---------- beat 42: night one ----------
    { id: "chip-out", who: "chip", text: "Squatch: sneak out the door", status: "in-game", source: "src/game/10-ch1.js (O3b)" },
    { id: "chip-bin", who: "chip", text: "Squatch: get the copies from the bin", status: "in-game", source: DAY2 + " (beat 42)" },
    { id: "button-copies", who: "button", text: "GRAB · copies", status: "pending", source: DAY2 + " (beat 42; pending in the lines file)" },
    { id: "sign-order", who: "sign", text: "ORDER MORE ROBOTS", status: "pending", source: "walkthrough beat 32 (\"ORDER MORE ROBOTS ☐\": the box is drawn)" },
    { id: "label-mark", who: "sign", text: "MARK · order", status: "pending", source: DAY2 + " (beat 42; pending in the lines file): the prompt beside the box in the close-up" },
    { id: "sign-code", who: "sign", text: "169556", status: "approved", source: "Brian, chat 2026-11-26: Isfred's office code is 169556 (replaces R84's 4723)" },
    { id: "chip-post", who: "chip", text: "Squatch: post the yellow copy", status: "in-game", source: DAY2 + " (beat 42)" },
    { id: "button-post", who: "button", text: "POST · mailbox", status: "in-game", source: DAY2 + " (beat 42)" },
    { id: "ups-scanned", who: "ups", text: "Mail scanned. Pawature accepted.", status: "pending", source: "walkthrough beat 42 (DECISIONS R22, O1)" },
    { id: "chip-sneak-home", who: "chip", text: "Squatch: sneak home", status: "in-game", source: DAY2 + " (beat 42)" },
    { id: "button-plant", who: "button", text: "HIDE · plant", status: "in-game", source: "lunch-sneak-lines.js button-plant" },
    { id: "button-ball", who: "button", text: "ROLL · ball", status: "approved", source: "Brian 2026-11-26 (ball anytime)" },
    // the LOCKUP card in the loading bay: the old night's words (src/game/25-capture.js "delivery")
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
