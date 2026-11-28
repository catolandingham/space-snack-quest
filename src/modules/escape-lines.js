/**
 * Every word the escape shows (Chapter 1, beats 43 to 52), in the order a player meets them, rebuilt from the story pass
 * of 2026-11-26 (Brian: "Build this pass: yes. He approves the lines as he watches each scene, so CHANGED and NEW lines
 * are built and marked pending"). Lines the story pass marks KEEP keep their words and status; CHANGED and NEW lines are
 * built word for word and stay "pending" until Brian says yes as he watches. Goal lines and buttons the story pass does
 * not word are marked "new" (no words existed; listed for Brian).
 *   id      the line's name in the code and in the tests
 *   who     "card", "chip" (the goal chip), "button" (the big action button), "robot", "mops", "sq" (Squatch; style
 *           "whisper" is a thought), "guest", "switch" (the reason on a "You are MOPS now." card), "paper" (words drawn
 *           on a thing: a sign, a letter, a note, a screen, a tag)
 *   text    the words, exactly as shown
 *   status  "pending" (waiting for Brian's yes), "in-game" (shown before), "approved" (his yes), "new" (needs his yes)
 *   source  where the words came from
 * The snack's names come from snack-name.js (one place for the rename); the empty crate's tag is the loading bay's
 * (loading-bay-lines.js "crate-empty"), the same tag on the same kind of crate.
 */
import { SNACK, FAMILY } from "./snack-name.js";
import { bayWords } from "./loading-bay-lines.js";

const ES_WALK = "docs/CH1-STORY-WALKTHROUGH.md beat ";
const ES_OLD = "src/game/14-ch1-day2.js before the first escape rebuild";
const Q55 = "; approved: Brian 2026-11-26, notes page question 55: \"Approve all as written\" (PR #93 comment)";
// the story pass of 2026-11-26 (Snack Quest Chat), its beat and its mark
const SP = (beat, mark) => `story pass 2026-11-26, beat ${beat} (${mark})`;
const esLine = (id, who, text, status, source) => ({ id, who, text, status, source });
const kept = (id, who, text, status, source) => esLine(id, who, text, status, source);
const pend = (id, who, text, beat, mark) => esLine(id, who, text, "pending", SP(beat, mark));
// round 7 (Brian's video notes 2026-11-27): a changed or new line and the question it hangs on (option A, built before
// his answer; pending)
const r7 = (id, who, text, note, q) => esLine(id, who, text, "pending", `round 7 (Brian's video notes 2026-11-27): ${note}; q: ${q} (option A, built before his answer)`);
const fresh = (id, who, text, beat, why) => esLine(id, who, text, "new", SP(beat, "no words given") + (why ? `; ${why}` : ""));

export const ESCAPE_LINES = Object.freeze(
  [
    // ---- 43: "Six days later", on the home calendar ----
    kept("card-six-days", "card", "Six days later", "approved", ES_WALK + "43" + Q55),
    pend("cal-delivery", "paper", "DELIVERY", 43, "NEW: tomorrow's square on the calendar"),
    // ---- 44a: Mops at work (the player is Mops) ----
    fresh("switch-work", "switch", "Mops goes to work. Squatch stays home.", "44a", "the reason on the switch card"),
    fresh("chip-mop", "chip", "Mops: mop the floor", "44a"),
    pend("mops-hum", "mops", "Weeee-eenn-nnttt...", "44a", "NEW use of his bleat, hummed"),
    // ---- 44b: the Mop-Off ----
    pend("robot-sides", "robot", "ROBOT SIDE. GOAT SIDE.", "44b", "NEW"),
    pend("floor-robot", "paper", "ROBOT SIDE", "44b", "NEW: painted on the floor"),
    pend("floor-goat", "paper", "GOAT SIDE", "44b", "NEW: painted on the floor"),
    fresh("chip-mopoff", "chip", "Mops: make the goat side sparkle", "44b"),
    pend("bar-fast", "paper", "FAST", "44b", "NEW: the first bar"),
    pend("bar-sparkle", "paper", "SPARKLE", "44b", "NEW: the second bar"),
    pend("robot-done", "robot", "DONE.", "44b", "NEW, after 15 seconds; repeated"),
    pend("robot-slow", "robot", "SO SLOW.", "44b", "NEW"),
    pend("robot-efficient", "robot", "WE ARE FAR MORE EFFICIENT.", "44b", "NEW"),
    pend("robot-beard", "robot", "A BEARD IS NOT A MOP.", "44b", "NEW"),
    pend("robot-corners", "robot", "CORNERS ARE NOT EFFICIENT.", "44b", "NEW"),
    pend("robot-time", "robot", "ROBOTS: 15 SECONDS.", "44b", "NEW, at the buzzer"),
    pend("robot-goat", "robot", "GOAT: STILL NOT DONE.", "44b", "NEW"),
    pend("robot-hq", "robot", "HQ ONLY COUNTS FAST.", "44b", "NEW"),
    // (round 7, r5 10:47, q: 130: the star card is cut; its words stay for STAR_CARD in escape.js)
    pend("star-good", "paper", "GOOD GANITOR", "44b", "NEW: under half of his side sparkles"),
    pend("star-great", "paper", "GREAT GANITOR", "44b", "NEW: half or more"),
    pend("star-star", "paper", "STAR GANITOR", "44b", "NEW: all of it, corners too"),
    // ---- 44c: "HQ got the order" ----
    pend("robot-enjoy", "robot", "Enjoy it, goat.", "44c", "NEW, robot 1"),
    pend("robot-order", "robot", "HQ got the order form.", "44c", "CHANGED, robot 2; was \"HQ sent us a message, you're going to be replaced this week anyway.\""),
    pend("robot-more", "robot", "More robo-janitors come tomorrow.", "44c", "NEW, robot 1"),
    pend("robot-no-ganitor", "robot", "No more Ganitor.", "44c", "NEW, robot 2"),
    pend("mops-who", "mops", "More robots? Who ordered more robots?", "44c", "NEW"),
    r7("mops-isfred", "mops", "Must be Isfred. The manager.", "r5 10:49, CHANGED: replaces the robot's \"Stormtop did. On the form.\"", 131),
    r7("robot-is-fred", "robot", "NO. FRED IS NOT THE MANAGER.", "r5 10:54, NEW: the mix-up (ISFRED_JOKE in escape.js); Brian's answer to q 131, 2026-11-27: \"second line should say 'no, fred is not the manager.'\"", 131),
    r7("mops-no-isfred", "mops", "No. ISFRED.", "r5 10:54, NEW", 131),
    r7("robot-said", "robot", "THAT IS WHAT I SAID.", "r5 10:54, NEW", 131),
    pend("mops-form", "mops", "The form? He said he didn't need that order form.", "44c", "NEW, quoting the manager in beat 32"),
    pend("mops-replace", "mops", "He said he wouldn't replace the Ganitor.", "44c", "NEW"),
    pend("mops-sent", "mops", "And then he sent it.", "44c", "NEW"),
    pend("mops-lied", "mops", "The manager lied to me.", "44c", "CHANGED; was \"Replaced? The manager was lying to me.\""),
    // ---- 44d: walk home (still Mops) ----
    pend("mops-right", "mops", "Squatch was right.", "44d", "NEW"),
    pend("mops-tell", "mops", "I have to tell him.", "44d", "NEW"),
    fresh("chip-home", "chip", "Mops: walk home and tell Squatch", "44d"),
    pend("guest-hi", "tourist", "Hi, Mops!", "44d", "NEW, a guest in the hall"),
    pend("mops-plaque", "mops", "Employee of the Month. Ha.", "44d", "NEW; round 7 (r5 11:22, q: 128): said as he walks past the wall, no button"),
    // ---- 45a: "You were right" ----
    fresh("switch-home", "switch", "Mops is home. Squatch's turn.", "45a", "the reason on the switch card"),
    pend("mops-you-right", "mops", "Squatch. You were right.", "45a", "NEW"),
    pend("mops-replacing", "mops", "They're replacing me.", "45a", "CHANGED: the pending line, split"),
    pend("mops-ship", "mops", "New robots come on tomorrow's ship.", "45a", "CHANGED"),
    pend("mops-brochure", "mops", "Do you still have that brochure?", "45a", "CHANGED"),
    fresh("chip-show", "chip", "Squatch: show Mops the brochure", "45a"),
    esLine("button-show", "button", "SHOW · brochure", "pending", SP("45a", "the same button as the night of the fight, beat 40")),
    // (round 7, Brian 2026-11-27, question 120: no pancakes anywhere; was "Let's go find that pancake place.")
    pend("mops-pancake-go", "mops", `Let's go find that ${FAMILY.name} stand.`, "45a", "CHANGED 2026-11-27 (question 120), with a heart"),
    pend("mops-mars", "mops", "...Mars.", "45a", "NEW, the snack's thread: he touches the crate's worn letter"),
    // ---- 45b: the plan, in crayon ----
    pend("sq-how", "sq", "How? The scanner stops fur.", "45b", "NEW"),
    pend("mops-crate", "mops", "You came here in a crate.", "45b", "NEW"),
    fresh("chip-crate-look", "chip", "Squatch: look at your crate", "45b"),
    esLine("button-crate", "button", "LOOK · crate", "pending", SP("45b", "named by the story pass")),
    pend("sq-leave", "sq", "...I can LEAVE in a crate!", "45b", "NEW"),
    r7("mops-empties", "mops", "Crates ride out on the ship.", "r5 15:23, CHANGED from \"Empty crates ride back on the ship.\" (no empty crate any more)", 124),
    fresh("chip-cal-look", "chip", "Squatch: look at the calendar", "45b"),
    kept("button-calendar", "button", "LOOK · calendar", "approved", "the home calendar's button (Brian 2026-11-26: LOOK · calendar stays)"),
    pend("mops-book", "mops", "But someone has to book it.", "45b", "NEW"),
    pend("mops-computer", "mops", "On the manager's computer.", "45b", "NEW"),
    pend("sq-office", "sq", "The office! Where the hairball robot came out.", "45b", "NEW"),
    pend("sq-locked", "sq", "It's locked.", "45b", "NEW"),
    pend("mops-code", "mops", "There's a code. He wrote it on that form.", "45b", "NEW"),
    pend("mops-pen", "mops", "In pen.", "45b", "NEW"),
    // round 7 (r5 12:19, r6 0:54, q: 132): the plan is drawn at his desk, one picture a tap, with crayon words
    r7("mops-plan", "mops", "Let's make a plan.", "r5 12:19, NEW: Brian's words", 132),
    r7("chip-desk", "chip", "Squatch: draw the plan at your desk", "r5 12:19, NEW goal words", 132),
    r7("button-draw", "button", "DRAW · plan", "r5 12:19, NEW: one tap a picture", 132),
    r7("plan-1", "paper", "GET THE CODE", "r5 12:19, NEW: crayon words under the door with its keypad", 132),
    r7("plan-2", "paper", "BOOK THE CRATE", "r5 12:19, NEW: crayon words under the computer", 132),
    r7("plan-3", "paper", "RIDE TO MARS", "r5 12:19, NEW: crayon words under the crate, the arrow and the red planet", 132),
    // ---- 46: the almost-slip ----
    pend("mops-ate", "mops", "And I ate that form. Well. Half ate it.", 46, "NEW"),
    pend("mops-bin", "mops", "The bin was emptied days ago.", 46, "NEW"),
    r7("sq-slip", "sq", "It was on the form. I... never mind.", "r5 12:33, CHANGED from \"Oh, it was on the form I sent, I mean, never mind.\" (he does not say I sent)", 133),
    pend("mops-hm", "mops", "Hm?", 46, "NEW"),
    r7("sq-vent", "sq", "Didn't a copy get sucked into a vent?", "r5 13:18, CHANGED from \"...into the vent?\" (the floor vent took it)", 125),
    r7("mops-lost", "mops", "Everything the vents suck up ends up behind the big vent.", "r5 13:18, CHANGED: replaces \"The big vent!\" and \"Everything lost ends up in there.\"", 125),
    pend("mops-know", "mops", "I'll go in. I know that vent.", 46, "NEW"),
    // ---- 47: sneak to the vent ----
    fresh("chip-sneak", "chip", "Squatch: sneak to the big vent", 47),
    pend("mops-goat-sized", "mops", "Goat-sized. You keep watch.", 47, "NEW"),
    kept("chip-ball", "chip", "Squatch: roll into a ball by the vent", "in-game", ES_OLD + " (beat 47); story pass 2026-11-26 (KEEP)"),
    kept("button-ball", "button", "ROLL · ball", "in-game", ES_OLD + "; approved 2026-11-26 (lunch sneak)"),
    kept("lockup-cause", "card", "A robot saw Squatch in the delivery room. Security caught him.", "in-game", "src/game/25-capture.js CAPTURES.delivery (the LOCKUP card in the loading bay)"),
    // ---- 48: Mops's secret desk (the player is Mops) ----
    r7("switch-vent", "switch", "Mops goes into the vent. Squatch keeps watch.", "r5 13:29, CHANGED from \"Mops crawls into the vent...\" (no crawl: the big vent opens straight into his room)", 125),
    fresh("chip-crawl", "chip", "Mops: crawl through the vent", 48, "round 7: only with VENT_CRAWL on (q: 125 option B)"),
    fresh("chip-lamp", "chip", "Mops: turn on the lamp", 48),
    esLine("button-lamp", "button", "LIGHT · lamp", "pending", SP(48, "named by the story pass")),
    fresh("chip-wall", "chip", "Mops: look at the wall", 48),
    esLine("button-wall", "button", "LOOK · wall", "pending", SP(48, "named by the story pass")),
    kept("board", "paper", "IDEAS FOR GUARDIANS", "approved", ES_WALK + "48" + Q55),
    kept("flyer", "paper", "HAVE YOU SEEN?", "approved", ES_WALK + "48" + Q55),
    kept("label-mars", "paper", "MARS", "approved", ES_WALK + "48 (labels MARS / NO / TOYS)" + Q55),
    kept("label-no", "paper", "NO", "approved", ES_WALK + "48 (labels MARS / NO / TOYS)" + Q55),
    kept("label-toys", "paper", "TOYS", "approved", ES_WALK + "48 (labels MARS / NO / TOYS)" + Q55),
    kept("letter", "paper", "MARS LOST & FOUND. Re: a lost baby Sasquatch. We have NO record of any lost baby. There are NO Sasquatches on Mars.", "approved", ES_WALK + "48 (shown as four lines on the letter: story pass 2026-11-26, KEEP)" + Q55),
    pend("mops-asked", "mops", "I asked Mars. Mars said no.", 48, "NEW"),
    pend("mops-cooks", "mops", "But those cakes...", 48, "CHANGED 2026-11-27: was \"But those cooks...\" (no cooks on the brochure now, question 119)"),
    fresh("chip-toys", "chip", "Mops: look in the toy bin", 48),
    esLine("button-toys", "button", "LOOK · toy bin", "pending", SP(48, "named by the story pass")),
    fresh("chip-stubs", "chip", "Mops: look at the stubs", 48),
    esLine("button-stubs", "button", "LOOK · stubs", "pending", SP(48, "named by the story pass")),
    r7("stub", "paper", `${SNACK.NAME}. A NEW KIND.`, "r5 13:57, CHANGED: the pay stub, simpler (was the longer pay line with the amount and the count)", 133),
    r7("stub-paid", "paper", "Paid by: MOPS", "r5 13:57, the pay stub's second line", 133),
    r7("blank-tag", "paper", "For S. A new kind to try.", "r5 3:28, CHANGED from \"For S. A new kind.\" to match Day 2's tag (loading-bay-lines.js box-tag); the stubs' old tags and pickup day's weekly box", 133),
    esLine("chart", "paper", SNACK.NAME, "pending", SP(48, "Mops's chart, its ST crossed out for M in pen")),
    pend("mops-wrong", "mops", "Maybe Mars was wrong.", 48, "NEW, after the pen stroke from ST to M"),
    pend("mops-one-kind", "mops", "Maybe he is not one of a kind.", 48, "NEW"),
    fresh("chip-note", "chip", "Mops: write a Guardian note", 48),
    esLine("button-note", "button", "WRITE · note", "pending", SP(48, "named by the story pass")),
    kept("note", "paper", "We know you're thinking about going to Mars. Don't worry, we'll always be with you.", "approved", ES_WALK + "48 (the record of the approved words; shown as note-1 to note-3)" + Q55),
    pend("note-1", "paper", "We know you're thinking about going to Mars.", 48, "KEEP the words, CHANGED to four taps"),
    pend("note-2", "paper", "Don't worry.", 48, "KEEP the words, CHANGED to four taps"),
    pend("note-3", "paper", "We'll always be with you.", 48, "KEEP the words, CHANGED to four taps"),
    kept("note-sign", "paper", "— The Guardians", "approved", "the Guardians' signature on every note (the gift note, beat 22)" + Q55),
    fresh("chip-slip-take", "chip", "Mops: take the pink slip", 48),
    esLine("button-slip-take", "button", "TAKE · pink slip", "pending", SP(48, "named by the story pass")),
    pend("mops-slip", "mops", "The pink slip!", 48, "NEW"),
    pend("mops-code-pen", "mops", "And the code. In pen.", 48, "NEW"),
    r7("sq-notice", "sq", "I hope he didn't read the order form.", "r5 14:24, CHANGED from \"I hope Mops doesn't notice...\" and moved: a thought once Mops is back out (beat 49)", 133),
    // ---- 49: "You're gumbling again!" ----
    fresh("switch-out", "switch", "Mops is back out. Squatch's turn.", 49, "the reason on the switch card"),
    pend("mops-mmf", "mops", "Mmf! Mmf mmf!", 49, "CHANGED: paper in his mouth; was \"Hurry, hurry, pink slip, got it!\""),
    pend("sq-gumbling", "sq", "You're gumbling again!", 49, "NEW, the callback"),
    kept("sq-get-it", "sq", "Get it before he sees it.", "pending", ES_WALK + "49; story pass 2026-11-26 (KEEP, a thought)"),
    kept("chip-grab", "chip", "Squatch: grab the pink slip", "in-game", ES_OLD),
    kept("button-grab", "button", "GRAB · pink slip", "in-game", ES_OLD),
    pend("mops-got-it", "mops", "Got it! The code is on there.", 49, "CHANGED"),
    pend("sq-carry", "sq", "I'll carry it.", 49, "NEW"),
    kept("sheet-order", "paper", "ORDER MORE ROBOTS", "in-game", ES_OLD + " (the paw order's close-up, beat 42)"),
    // ---- 50: the office keypad ----
    fresh("chip-door", "chip", "Squatch: go to the office door", 50),
    pend("sign-closed", "paper", "CLOSED. Back at 9.", 50, "NEW: a sign on the office door"),
    kept("chip-code", "chip", "Squatch: type the code from the pink slip", "approved", ES_OLD + "; the digest of 2026-11-26 lists it pending" + Q55),
    esLine("button-code", "button", "TYPE · code", "pending", SP(50, "named by the story pass")),
    pend("mops-shh", "mops", "Shh! Try again.", 50, "NEW, on a wrong code"),
    pend("pad-open", "paper", "OPEN", 50, "NEW, on the keypad"),
    // ---- 51: the manager's office ----
    r7("chip-computer", "chip", "Squatch: book a pickup on the computer", "r5 15:23, CHANGED goal words (was \"...book the empty crate...\")", 124),
    r7("button-screens", "button", "LOOK · screens", "r5 15:01, NEW", 124),
    r7("sq-tv", "sq", "That's the loading bay. On TV!", "r5 15:01, NEW: the screens show the bay's new camera", 124),
    r7("mops-cameras", "mops", "Cameras. He never watches them.", "r5 15:01, NEW", 124),
    r7("button-poster", "button", "LOOK · poster", "r5 15:01, NEW: the NO FUR poster (he gulps; no words)", 124),
    esLine("button-chair", "button", "SPIN · chair", "pending", SP(51, "named by the story pass")),
    esLine("button-mug", "button", "LOOK · mug", "pending", SP(51, "named by the story pass")),
    pend("mug", "paper", "GALAXY'S OKAYEST MANAGER", 51, "NEW"),
    r7("button-drawer", "button", "LOOK · cabinet", "r5 15:01, CHANGED from \"OPEN · drawer\": the filing cabinet's drawer, with one snack cake", 124),
    pend("sq-no-fizz", "sq", "No fizz.", 51, "NEW, a thought"),
    pend("sq-one-snack", "sq", "One snack. That's the rule.", 51, "NEW"),
    esLine("button-frame", "button", "LOOK · frame", "pending", SP(51, "named by the story pass")),
    pend("frame", "paper", "NEXT MONTH: MOPS", 51, "NEW, the frame's brass tag (a secret, +50)"),
    esLine("button-hide-desk", "button", "HIDE · desk", "pending", SP(51, "named by the story pass")),
    pend("mops-duck", "mops", "Robot! Duck!", 51, "NEW"),
    fresh("chip-hide-desk", "chip", "Squatch: hide under the desk", 51),
    r7("button-computer", "button", "USE · computer", "r5 15:23, CHANGED from \"RETURN · empty crate\"", 124),
    r7("mops-door", "mops", "You do it. I'll watch the door.", "r6 0:41, CHANGED: replaces \"ghjk\" and \"Hooves. You do it.\"", 124),
    r7("site", "paper", "UNIVERSAL POSTAL SERVICE", "r5 15:23, CHANGED: the page's header (was the snack's name)", 124),
    r7("site-schedule", "paper", "SCHEDULE A PICKUP", "r5 15:23, NEW: the big button (replaces \"Order new box\" / \"Return empty crate\")", 124),
    r7("site-size", "paper", "How big?", "r5 15:23, NEW", 124),
    r7("size-small", "paper", "SMALL", "r5 15:23, NEW", 124),
    r7("size-medium", "paper", "MEDIUM", "r5 15:23, NEW", 124),
    r7("size-big", "paper", "BIG", "r5 15:23, NEW", 124),
    r7("site-inside", "paper", "What's inside?", "r5 15:23, NEW", 124),
    r7("in-old", "paper", "OLD MOPS", "r5 15:23, NEW: a funny choice", 124),
    r7("in-goat", "paper", "GOAT STUFF", "r5 15:23, NEW", 124),
    r7("in-sq", "paper", "ONE SASQUATCH", "r5 15:23, NEW: Mops says \"Not that one!\"", 124),
    esLine("site-to", "paper", "Where to?", "pending", "Chapter 2 question 135 A (Brian 2026-11-27: the crate stays on the ship, booked through to Mars), NEW: the postal page's fourth page; q: 135"),
    esLine("to-mars", "paper", "MARS", "pending", "Chapter 2 question 135 A, NEW: the one lit choice on \"Where to?\"; q: 135"),
    pend("mops-not-that", "mops", "Not that one!", 51, "NEW"),
    pend("site-booked", "paper", "Pickup booked.", 51, "NEW"),
    pend("site-tomorrow", "paper", "Tomorrow's ship.", 51, "NEW"),
    // (q: 135: booked through to Mars; Day 2's crate tag stays FOR PICKUP.)
    esLine("label", "paper", `${bayWords("crate-empty")} TO: MARS.`, "pending", SP(51, "NEW: the label the printer gives, last week's crate tag") + "; Chapter 2 question 135 A (Brian 2026-11-27), CHANGED: adds TO: MARS.; q: 135"),
    esLine("button-label", "button", "TAKE · label", "pending", SP(51, "NEW")),
    fresh("chip-label", "chip", "Squatch: take the label", 51),
    pend("sq-going", "sq", "We're really going.", 51, "NEW"),
    pend("mops-going", "mops", "We're really going.", 51, "NEW, hearts"),
    // ---- 52: all the snacks, and one secret ----
    r7("chip-bar", "chip", "Squatch: go home", "r5 15:47, CHANGED from the old goal words, go to the snack bar (the snack bar is on the way)", 133),
    r7("mops-long", "mops", "Wait. It's a long way to Mars.", "r5 15:47, CHANGED: said passing the bar (replaces \"We take one so nobody notices.\" / \"But it's a long way to Mars.\")", 124),
    kept("mops-all", "mops", "This time, take all the snacks you want.", "pending", ES_WALK + "52; story pass 2026-11-26 (KEEP)"),
    kept("chip-snacks", "chip", "Squatch: take the snacks", "in-game", ES_OLD),
    kept("button-snack", "button", "TAKE · snack", "in-game", "lunch-sneak-lines.js (beat 27); here the big button takes the next snack in the close-up"),
    pend("sq-what-guardians", "sq", "What about the Guardians?", 52, "CHANGED: the pending line, split"),
    pend("sq-leave-food", "sq", "I'll leave them some food.", 52, "CHANGED"),
    kept("button-food", "button", "LEAVE · food", "in-game", ES_OLD + " (LEAVE · food, beat 52)"),
    kept("chip-food", "chip", "Squatch: leave food for the Guardians", "in-game", ES_OLD),
    pend("sq-favorite", "sq", "Their favorite. I think.", 52, "NEW, the last snack cake"),
    fresh("chip-home-night", "chip", "Squatch: go home", 52),
    kept("chip-slip", "chip", "Squatch: hide the pink slip", "in-game", ES_OLD),
    kept("button-closet", "button", "OPEN · closet", "approved", "home-morning-lines.js (Brian 2026-11-23, 6A)"),
    kept("button-box", "button", "PUT IN · box", "approved", "home-morning-lines.js (Brian 2026-11-26)"),
    pend("sq-never", "sq", "Mops can never see this.", 52, "NEW, a thought"),
    pend("mops-big-day", "mops", "Big day tomorrow.", 52, "NEW"),
    kept("sq-sing", "sq", "♪ I'm floating in space! ♪", "approved", "morning-lines.js sq-sing (walkthrough beat 2, decided by Brian); story pass 2026-11-26 (KEEP, the song back as a bond moment)"),
    kept("mops-sing", "mops", "♪ Weeee-eenn-nnttt! ♪", "approved", "morning-lines.js mops-sing (walkthrough beat 2, decided by Brian); story pass 2026-11-26 (KEEP)"),
  ].map((l) => Object.freeze(l)),
);

/** The words of one line, by id. Throws on an unknown id, so a typo cannot show empty words. */
export function escapeWords(id) {
  const l = ESCAPE_LINES.find((x) => x.id === id);
  if (!l) throw new Error(`no escape line ${id}`);
  return l.text;
}
