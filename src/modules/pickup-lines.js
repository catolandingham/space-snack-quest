/**
 * Every word pickup day shows (Chapter 1, beats 53 to 61), in the order a player meets them, built from the story pass
 * for beats 53 to 61 (2026-11-26, Snack Quest Chat). Lines the pass marks KEEP keep their words (and stay pending where
 * they still wait for Brian in the 28 to 52 pass); CHANGED and NEW lines are built word for word and stay "pending"
 * until Brian says yes as he watches. Buttons, goal lines and switch-card reasons the pass does not word are marked
 * "new" (no words existed; listed for Brian).
 *   id      the line's name in the code and in the tests
 *   who     "card", "chip" (the goal chip), "button" (the big action button), "switch" (the reason on a "You are MOPS
 *           now." card), "paper" (words drawn on a thing), or a speaker: "sq" (style "whisper" is a thought), "mops",
 *           "robot", "scanner", "pa", "tourist" (a guest), "official" (Isfred), "ups" (the UPS ship's speaker and crew)
 *   text    the words, exactly as shown
 *   status  "pending" (waiting for Brian's yes), "in-game" (shown before), "approved" (his yes), "new" (needs his yes)
 *   source  where the words came from
 *   q       the question the line hangs on (pick A built as a placeholder until Brian answers), if any.
 * Round 7 (2026-11-27): Brian's 83 video notes, the story review (fable-story-review.md) and his question batch #116 to #133;
 * the batch is not answered yet, so pick A of each is built as a placeholder and its lines carry `q` (116 to 133).
 * A `q` under 100 is the 53-61 pass's own question.
 * The snack's name comes from snack-name.js, the crate tag from loading-bay-lines.js and the weekly tag from escape-lines.js (one place each).
 */
import { FAMILY } from "./snack-name.js";
import { escapeWords } from "./escape-lines.js";

const PK_WALK = "docs/CH1-STORY-WALKTHROUGH.md beat ";
const PK_SP = (beat, mark) => `story pass 53-61 (2026-11-26), beat ${beat} (${mark})`;
const pkLine = (id, who, text, status, source, q) => ({ id, who, text, status, source, ...(q ? { q } : {}) });
const pkPend = (id, who, text, beat, mark, q) => pkLine(id, who, text, "pending", PK_SP(beat, mark), q);
const pkNew = (id, who, text, beat, why) => pkLine(id, who, text, "new", PK_SP(beat, "no words given") + (why ? `; ${why}` : ""));
// Round 7's lines: pending, from the story review (topic letter) or Brian's own note, hung on question `q` (116 to 133).
const R7 = (topic) => `round 7 story review (2026-11-27) topic ${topic}`;
const pkR7 = (id, who, text, topic, q, why) => pkLine(id, who, text, "pending", R7(topic) + (why ? `; ${why}` : ""), q);

export const PICKUP_LINES = Object.freeze(
  [
    // ---- 53: packing the crate ----
    pkNew("chip-note", "chip", "Squatch: read the note", 53),
    pkPend("button-note", "button", "READ · note", 53, "the button the pass names"),
    pkPend("sq-know", "sq", "They know!", 53, "NEW"),
    pkPend("sq-not-mad", "sq", "They're not mad.", 53, "NEW"),
    pkNew("chip-box", "chip", "Squatch: open the Guardian Box", 53),
    pkPend("button-open-box", "button", "OPEN · box", 53, "the button the pass names"),
    pkPend("button-pack-note", "button", "PACK · note", 53, "the button the pass names"),
    pkPend("sq-safe", "sq", "Safe.", 53, "NEW, a thought as the note covers the pink", 8),
    pkPend("mops-scanner", "mops", "The scanner stops fur.", 53, "NEW"),
    pkR7("mops-hair-ok", "mops", "It lets hair through.", "A", 116, "replaces \"Even one tuft.\""),
    pkNew("switch-mop", "switch", "Mops wipes the fur out of the crate.", 53, "the reason on the switch card"),
    pkNew("chip-mop", "chip", "Mops: wipe the fur out of the crate", 53),
    pkPend("button-mop", "button", "MOP · crate", 53, "the button the pass names (a walk: no button shows)"),
    // (r6 2:21, Brian: playing as Mops, go to the STAY IN HERE poster and eat it)
    pkR7("chip-poster", "chip", "Mops: eat the STAY IN HERE poster", "P", 133, "goal words, new"),
    pkR7("button-poster", "button", "EAT · poster", "P", 133, "new"),
    pkR7("mops-dont-need", "mops", "We don't need this anymore.", "P", 133),
    pkR7("sq-you-ate", "sq", "You ATE it.", "P", 133),
    pkR7("mops-delicious", "mops", "Delicious.", "P", 133, "his own beat 33 word"),
    pkNew("switch-pack", "switch", "The crate is clean. Squatch packs.", 53, "the reason on the switch card"),
    pkNew("chip-pack", "chip", "Squatch: pack the crate", 53),
    pkLine("button-pack-box", "button", "PACK · box", "pending", PK_WALK + "53; story pass 53-61 (KEEP, pending)"),
    pkLine("button-pack-bucket", "button", "PACK · bucket", "pending", PK_WALK + "53; story pass 53-61 (KEEP, pending)"),
    pkNew("chip-walls", "chip", "Squatch: take the things off the walls", 53),
    pkNew("button-take-chart", "button", "TAKE · chart", 53, "his crayon chart of cake kinds"),
    pkNew("button-take-brochure", "button", "TAKE · brochure", 53),
    pkNew("button-take-drawing", "button", "TAKE · drawing", 53, "his own drawings on the home wall"),
    pkPend("sq-empty", "sq", "It looks so empty.", 53, "NEW"),
    pkPend("mops-empty", "mops", "It was empty before you.", 53, "NEW (one heart)"),
    pkLine("pa-ship", "pa", "Universal Postal Service ship arriving!", "pending", PK_SP(53, "KEEP: the Day 2 words, used again; ear icon")),
    pkNew("chip-label", "chip", "Squatch: put the label on the crate", 53),
    pkPend("button-label", "button", "PUT ON · label", 53, "the button the pass names"),
    // (the tag loses "EMPTY.": topic K. The same words as loading-bay-lines.js crate-empty once the bay builder's round 7
    // change lands there; point this back at bayWords("crate-empty") at that merge)
    pkR7("label", "paper", "FOR PICKUP.", "K", 124, "the same tag as last week's crate (beat 30) and the office printer's (51)"),
    pkNew("chip-get-in", "chip", "Squatch: get in the crate", 53),
    pkPend("button-get-in", "button", "GET IN · crate", 53, "the button the pass names"),
    pkPend("mops-in", "mops", "In you go.", 53, "NEW"),
    pkR7("mops-pile", "mops", "So today you're a pile of hair.", "A", 116, "Mops lays his beard hair over him on purpose"),
    pkPend("mops-sound", "mops", "Not a sound.", 53, "NEW"),
    pkNew("switch-push", "switch", "Squatch is in the crate. Mops pushes it to the mail room.", 53, "the reason on the switch card"),
    pkNew("chip-push", "chip", "Mops: push the crate to the mail room", 53),
    pkPend("button-push", "button", "PUSH · pallet", 53, "the button the pass names (a walk: no button shows)"),
    pkPend("crate-oof", "sq", "Oof!", 53, "NEW, the crate on a bump"),
    pkLine("mops-weent", "mops", "Weeee-eenn-nnttt!", "pending", PK_SP(53, "KEEP: his bleat, covering")),
    pkLine("guest-hi", "tourist", "Hi, Mops!", "pending", PK_SP(53, "KEEP: the line from 44d, used again")),
    pkR7("robot-label", "robot", "FOR PICKUP.", "K", 124, "a robot in the hallway reads the label (ear icon)"),
    // ---- 54: one upgraded robot opens a crate (Squatch inside: the room, his eyes in the crate) ----
    pkLine("scan-no-fur", "scanner", "NO FUR. PROCEED.", "pending", PK_SP(54, "KEEP: the words from beat 30 (ear icon), still pending there")),
    pkR7("bot-upgrade", "robot", "UPGRADE INSTALLED.", "A", 117),
    pkR7("bot-corners", "robot", "WE CHECK EVERY CORNER NOW.", "A", 117),
    pkR7("bot-every-crate", "robot", "AND EVERY CRATE.", "A", 117),
    pkR7("mops-told", "mops", "...I told them to check the corners.", "A", 117, "small"),
    pkR7("sq-look-inside", "sq", "They LOOK inside now.", "A", 117, "a thought, from the crate"),
    // ---- 55: Mops gets him out: KNOCK, then SPILL · bucket out in the bay; he hides behind the mail bags ----
    pkR7("chip-knock", "chip", "Mops: knock on Squatch's crate", "A", 118, "goal words, new"),
    pkPend("button-knock", "button", "KNOCK · crate", 55, "the button the pass names"),
    pkPend("mops-get-out", "mops", "Squatch! Get out.", 55, "CHANGED (in the game: \"Get out. They're checking a crate.\", split)"),
    pkPend("mops-opening", "mops", "They're opening the crates.", 55, "CHANGED"),
    pkR7("chip-spill", "chip", "Mops: get the robot out of the mail room", "A", 118, "goal words, new"),
    pkR7("button-spill", "button", "SPILL · bucket", "A", 118),
    pkR7("bot-spill", "robot", "SPILL. CLEANING EVERY CORNER.", "A", 118),
    pkR7("switch-out", "switch", "The robot is cleaning far away. Squatch's turn.", "A", 118, "the reason on the switch card, new"),
    pkNew("chip-climb", "chip", "Squatch: climb out of the crate", 55),
    pkPend("button-climb", "button", "CLIMB OUT · crate", 55, "the button the pass names"),
    pkR7("chip-bags", "chip", "Squatch: hide behind the mail bags", "A", 118, "goal words, new"),
    pkLine("button-ball", "button", "ROLL · ball", "in-game", "lunch-sneak-lines.js and escape-lines.js (the ball, R43)"),
    pkR7("button-bags", "button", "HIDE · mail bags", "A", 118),
    pkLine("lockup-cause", "card", "A robot saw Squatch in the delivery room. Security caught him.", "in-game", "src/game/25-capture.js CAPTURES.delivery (the LOCKUP card in the loading bay)"),
    // (the robot reads the crate as it is written: the stamp's first letter is scraped off. Topic D)
    pkR7("bot-ars-loading", "robot", `${FAMILY.FADED}. LOADING.`, "D", 133, "replaces the reading with its first letter put back"),
    pkPend("bot-one-box", "robot", "ONE BOX. ONE BUCKET.", 55, "NEW", 8),
    pkR7("scan-hair-ok", "scanner", "HAIR. PROCEED.", "A", 116, "ear icon; was \"GOAT HAIR. PROCEED.\""),
    pkPend("sq-on-ship", "sq", "It's on the ship. I'm not.", 55, "NEW, a thought"),
    pkNew("chip-sneak-home", "chip", "Squatch: walk home with Mops", 55),
    // (the idea, said at home instead of three thought pictures: r6 5:33)
    pkR7("sq-hair-through", "sq", "The hair got through.", "A", 116),
    pkR7("sq-they-looked", "sq", "But they LOOKED.", "A", 116),
    pkR7("mops-need-goat", "mops", "Then you need hair... and you need to look like a goat.", "A", 116),
    pkPend("sq-make-goat", "sq", "So make me a goat.", 55, "NEW"),
    // ---- 56: the goat costume ----
    pkNew("switch-snip", "switch", "Mops gives Squatch a piece of his beard.", 56, "the reason on the switch card"),
    pkNew("chip-snip", "chip", "Mops: snip a piece of your beard", 56),
    pkPend("button-snip", "button", "SNIP · beard", 56, "the button the pass names"),
    pkNew("switch-dress", "switch", "The beard is cut. Squatch dresses up.", 56, "the reason on the switch card"),
    pkLine("mops-wardrobe", "mops", "The spare jacket. The beard. And the horns.", "in-game", "src/game/14-ch1-day2.js ch1CostumeReady (KEEP)"),
    pkPend("sq-your-beard", "sq", "Your beard? That's your mop!", 56, "NEW"),
    pkPend("mops-grows", "mops", "It grows back.", 56, "NEW"),
    pkLine("chip-jacket", "chip", "Squatch: put on the spare jacket", "in-game", "src/game/12-ch1-redesign.js chips Q8 (KEEP: the goal line if stuck)"),
    pkNew("button-wear-beard", "button", "PUT ON · beard", 56, "the big button puts the next piece on"),
    pkNew("button-wear-horns", "button", "PUT ON · horns", 56),
    pkLine("button-wear-jacket", "button", "PUT ON · jacket", "in-game", "src/game/14-ch1-day2.js (PUT ON · jacket)"),
    pkLine("meter", "paper", "Disguised enough", "in-game", "dress-up.js (the party's meter; decided for the costume: story pass 53-61, decided list)"),
    pkNew("chip-bleat", "chip", "Squatch: practice your bleat", 56),
    pkNew("button-bleat-mops", "button", "BLEAT · Mops", 56, "the pass says only BLEAT; every button reads VERB · thing"),
    pkPend("sq-bleat-1", "sq", "Weee-RAWWR!", 56, "NEW, the first press"),
    pkLine("mops-less-roar", "mops", "More bleat. Less roar.", "in-game", PK_WALK + "56 (decided, in the game today)"),
    pkR7("sq-cant-bleat", "sq", "I can't bleat. I'm a Sasquatch.", "P", 133, "r6 6:23; replaces \"Sasquatches don't weent.\""),
    pkR7("mops-goat-today", "mops", "Today you're a goat.", "P", 133, "replaces \"Goats do. You're a goat now.\""),
    pkPend("sq-bleat-3", "sq", "Weeee-eenn-nnttt?", 56, "NEW, the third press"),
    pkPend("mops-close-enough", "mops", "Close enough.", 56, "NEW"),
    pkPend("mops-two-goats", "mops", "Two goats.", 56, "NEW, at the mirror"),
    pkPend("mops-not-one", "mops", "I'm not one of a kind today.", 56, "NEW (hearts)"),
    pkPend("sq-itches", "sq", "It itches.", 56, "NEW"),
    // ---- 57: the last walk ----
    pkNew("chip-last-walk", "chip", "Squatch: walk to the ship", 57),
    pkNew("button-bleat-guest", "button", "BLEAT · guest", 57),
    pkNew("button-press-beard", "button", "PRESS · beard", 58, "the pass names PRESS · beard"),
    pkLine("guest-hi-57", "tourist", "Hi, Mops!", "pending", PK_SP(57, "KEEP")),
    pkPend("guest-other-mops", "tourist", "Hi... other Mops?", 57, "NEW, with a \"?\""),
    pkPend("sq-bleat-guest", "sq", "Weeee-eenn-nnttt?", 57, "NEW (BLEAT)"),
    pkPend("guest-two", "tourist", "Aww. Two of them!", 57, "NEW"),
    pkLine("lockup-hall", "card", "A guest saw Squatch in the party hall. Security caught him.", "approved", "party-lines.js lockup-cause, its template filled in (Brian 2026-11-24: Yes to all)"),
    pkNew("button-plate", "button", "LOOK · plate", 57, "optional"),
    pkPend("sq-came", "sq", "They came!", 57, "NEW, at the plate"),
    pkPend("sq-ate", "sq", "They ate it all.", 57, "NEW"),
    pkPend("sign-photo", "paper", "PHOTO DAY", 57, "NEW, the sign on the office door"),
    pkPend("mops-good-wall", "mops", "Good wall.", 57, "NEW"),
    pkR7("button-lift-photo", "button", "LIFT · photo", "G", 128, "the drawing is hidden behind the crooked photo"),
    pkLine("button-take-keepsake", "button", "TAKE · drawing", "pending", PK_WALK + "57; story pass 53-61 (KEEP, pending)"),
    pkPend("crayon-words", "paper", "ME, MOPS, TIED TOGETHER FOREVER", 57, "the crayon drawing's words, as the pass writes them"),
    pkPend("sq-comes-with", "sq", "This one comes with us.", 57, "NEW"),
    pkPend("mops-tied", "mops", "Tied together.", 57, "NEW"),
    // ---- 58: through the scanner ----
    pkNew("button-pick-box", "button", "PICK UP · box", 58, "the pass names PICK UP · box"),
    pkNew("chip-box58", "chip", "Squatch: pick up the box", 58),
    pkLine("tag", "paper", escapeWords("blank-tag"), "pending", "escape-lines.js blank-tag (the weekly box's tag; the snack thread)"),
    pkPend("sq-my-box", "sq", "My box!", 58, "NEW"),
    pkPend("mops-mail", "mops", "I've got the mail.", 58, "NEW"),
    pkNew("chip-scanner", "chip", "Squatch: walk to the scanner", 58),
    pkPend("bot-two-goats", "robot", "TWO GOATS?", 58, "NEW", 3),
    pkPend("button-bleat-robot", "button", "BLEAT · robot", 58, "the button the pass names (in 55 too before round 7)"),
    pkPend("sq-bleat-ramp", "sq", "Weee-RAWW-eennt!", 58, "NEW (BLEAT)", 3),
    pkPend("bot-odd-goat", "robot", "ODD GOAT.", 58, "NEW", 3),
    pkPend("mops-cousin", "mops", "My cousin. He has a cold.", 58, "NEW", 3),
    pkLine("bot-compute", "robot", "Does not compute.", "pending", PK_SP(58, "KEEP: Brian's hairball line from 36, used again"), 3),
    pkNew("switch-board-mops", "switch", "Mops goes first. The scanner knows him.", 58, "the reason on the switch card"),
    pkNew("chip-go-ship", "chip", "Mops: walk through the scanner", 58),
    pkLine("button-go-ship", "button", "GO · ship", "pending", PK_WALK + "58; story pass 53-61 (KEEP, pending)"),
    pkPend("bot-tool", "robot", "HAND OVER YOUR TOOL.", 58, "NEW", 3),
    pkPend("mops-attached", "mops", "It's attached.", 58, "NEW", 3),
    pkLine("bot-beard-mop", "robot", "A BEARD IS NOT A MOP.", "pending", PK_SP(58, "KEEP: from 44b"), 3),
    pkPend("scan-goat", "scanner", "GOAT. PROCEED.", 58, "NEW (ear icon)"),
    pkNew("switch-board-sq", "switch", "Mops is through. Squatch's turn.", 58, "the reason on the switch card"),
    pkLine("chip-board", "chip", "Squatch: walk through the scanner", "in-game", "src/game/12-ch1-redesign.js chips Q9 (KEEP: the goal line if stuck)"),
    pkLine("button-board", "button", "BOARD · scanner", "in-game", "src/game/14-ch1-day2.js (BOARD · scanner)"),
    pkLine("scan-hair-58", "scanner", "HAIR...", "in-game", PK_WALK + "58: \"HAIR... PROBABLY. PROCEED.\" (decided), shown as three bubbles"),
    pkLine("scan-probably", "scanner", "...PROBABLY.", "in-game", PK_WALK + "58 (decided), the second of three bubbles"),
    pkLine("scan-proceed", "scanner", "PROCEED.", "in-game", PK_WALK + "58 (decided), the third of three bubbles"),
    pkNew("button-ramp", "button", "CLIMB · ramp", 58, "the walk up the ramp"),
    pkPend("sq-weent", "sq", "Weent.", 58, "NEW, a whisper on the ramp"),
    // ---- 59: where's Mops? ----
    pkLine("isfred-photo", "official", "Send in Mops for his Employee of the Month photo.", "pending", PK_WALK + "59; story pass 53-61 (KEEP)", 5),
    pkLine("bot-not-here", "robot", "Mops isn't here.", "pending", PK_WALK + "59; story pass 53-61 (KEEP)", 5),
    pkLine("isfred-not-here", "official", "Not here? He can't live off the station!", "pending", PK_WALK + "59; story pass 53-61 (KEEP)", 5),
    pkLine("bot-replaced-shipment", "robot", "He was replaced by the new robot shipment.", "pending", PK_WALK + "59; story pass 53-61 (KEEP)", 5),
    pkLine("isfred-tapes", "official", "I never ordered a replacement! Get me the security tapes.", "pending", PK_WALK + "59; story pass 53-61 (KEEP)", 5),
    // ---- 60: the security tape (one clip from the camera's corner: a goat and a very tall goat, the beard falls) ----
    pkLine("card-later", "card", "Later that evening...", "pending", PK_WALK + "60; story pass 53-61 (KEEP, #416)"),
    pkLine("rec", "paper", "REC", "pending", PK_WALK + "60; story pass 53-61 (KEEP)"),
    pkR7("tape-bay", "paper", "LOADING BAY", "E", 123, "the one tape's label, new"),
    pkPend("button-play", "button", "PLAY · tape", 60, "the button the pass names"),
    pkPend("button-zoom", "button", "ZOOM · in", 60, "the button the pass names"),
    pkNew("chip-tapes", "chip", "Isfred: watch the tapes", 60),
    pkPend("isfred-best", "official", "My best worker.", 60, "NEW", 4),
    pkPend("isfred-not-goat", "official", "That is not a goat.", 60, "NEW, Brian's #372", 4),
    pkPend("isfred-wookiee", "official", "A Wookiee!", 60, "NEW, Brian's Nov 8 words [49:24]", 4),
    pkPend("isfred-ship", "official", "Get me that ship.", 60, "NEW", 4),
    // ---- 61: the call to the ship ----
    pkNew("chip-hold", "chip", "Squatch: open this week's box", 61),
    pkPend("button-open-cake", "button", "OPEN · box", 61, "the button the pass names"),
    pkPend("button-bite", "button", "BITE · cake", 61, "the button the pass names"),
    pkLine("sq-no-fizz", "sq", "No fizz.", "pending", PK_SP(61, "KEEP: his line from 39b and 51")),
    pkPend("sq-fizzy-mars", "sq", "The fizzy ones are on Mars.", 61, "NEW"),
    pkPend("mops-going-there", "mops", "Then that's where we're going.", 61, "NEW (hearts)"),
    pkPend("ship-call", "ups", "Call from Stormtop.", 61, "NEW [49:24] (ear icon)", 6),
    pkPend("ship-tapes", "ups", "They checked their security tapes.", 61, "CHANGED (Brian's \"Security cameras we reviewed\")", 6),
    pkPend("ship-wookiee", "ups", "A Wookiee snuck on board.", 61, "CHANGED (Brian's \"they think that a Wookiee snuck on board\")", 6),
    pkPend("ship-search", "ups", "We are stopping to search.", 61, "NEW (Brian's \"a forced stop\")", 6),
    pkPend("sq-where", "sq", "A Wookiee? Where?!", 61, "NEW", 6),
    pkPend("mops-mean-you", "mops", "...They mean you.", 61, "NEW", 6),
    pkPend("sq-sasquatch", "sq", "I'm a SASQUATCH.", 61, "NEW (Brian's Nov 8 \"No, I'm a Sasquatch.\")", 6),
    pkNew("chip-hide-crate", "chip", "Squatch: hide in the crate", 61),
    pkPend("button-hide-crate", "button", "HIDE · crate", 61, "the button the pass names"),
    // (r6 9:15: the crew member walks down the stairs; Mops tries to stop him; it fails. Topic F)
    pkR7("switch-crew", "switch", "The crew is coming for the crate. Mops tries to stop him.", "F", 133, "the reason on the switch card, new"),
    pkR7("chip-crew", "chip", "Mops: stop the crew", "F", 133, "goal words, new"),
    pkR7("crew-out-of-way", "ups", "Out of the way, goat.", "F", 133),
    pkR7("button-bleat-crew", "button", "BLEAT · crew", "F", 133),
    pkR7("mops-bleat-crew", "mops", "Weeee-eenn-nnttt!", "F", 133, "his bleat, the same as 53's"),
    pkR7("crew-nice-try", "ups", "Nice try.", "F", 133),
    pkPend("crew-found", "ups", "Found him.", 61, "NEW", 7),
    pkPend("crew-stay", "ups", "You can stay, goat.", 61, "NEW", 7),
    pkPend("mops-with-me", "mops", "He's with me.", 61, "NEW", 7),
    pkPend("crew-both-off", "ups", "Then you're both off.", 61, "NEW (Brian's \"they kick them both off\")", 7),
  ].map((l) => Object.freeze(l)),
);

/** The words of one line, by id. Throws on an unknown id, so a typo cannot show empty words. */
export function pickupWords(id) {
  const l = PICKUP_LINES.find((x) => x.id === id);
  if (!l) throw new Error(`no pickup line ${id}`);
  return l.text;
}
