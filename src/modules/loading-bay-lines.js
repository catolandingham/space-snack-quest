/**
 * Every word the loading bay beats show (Chapter 1, beats 28 to 36 and 36b), in the order a player meets them, word for
 * word from the story pass of 2026-11-26 (Brian: "Build this pass"; he approves the lines as he watches each scene).
 * KEEP lines keep the status they had; every CHANGED or NEW line is "pending" until Brian says yes to it.
 *   id      the line's name in the code and in tests/loading-bay.mjs
 *   who     the speaker's id in the game ("pa", "mops", "sq", "official" Isfred, "robot", "dot", "bob", "lou",
 *           "scanner" the fur scanner arch, "ups" the robot mailbox), or "chip" (the goal words), "button" (the big
 *           action button), "card" (a switch card's line), "lockup" (the lockup card's who and where), "paper"
 *           (words drawn on a thing)
 *   style   "say" (a speech bubble), "think" (Squatch's thought: a trail of circles), "ear" (overheard: the ear icon)
 *   text    the words, exactly as shown
 *   status  "pending" (waiting for Brian's yes), "decided", "approved" (Brian's yes, word for word), "in-game"
 *   source  where the words came from
 */
const PASS = "story pass 2026-11-26, beat ";
const BAY_DAY2 = "src/game/14-ch1-day2.js before this change";

export const BAY_LINES = Object.freeze(
  [
    // ---- 28. The Stars Cakes ship (behind the snack counter) ----
    { id: "pa-ship", who: "pa", style: "ear", text: "Universal Postal Service ship arriving!", status: "pending", source: PASS + "28 (KEEP)" },
    { id: "sq-stars-ship", who: "sq", text: "The Stars Cakes ship!", status: "pending", source: PASS + "28 (NEW)" },
    { id: "sq-new-kind", who: "sq", text: "A new kind from the Guardians!", status: "pending", source: PASS + "28 (NEW)" },
    { id: "sq-crate-kind", who: "sq", text: "Maybe it's the crate kind!", status: "pending", source: PASS + "28 (NEW)" },
    { id: "mops-maybe", who: "mops", text: "Maybe.", status: "pending", source: PASS + "28 (NEW)" },
    { id: "mops-see", who: "mops", text: "I better go see.", status: "pending", source: PASS + "28 (CHANGED)" },
    { id: "sq-come", who: "sq", text: "Can I come? I'll be really sneaky.", status: "pending", source: PASS + "28 (CHANGED)" },
    { id: "mops-once", who: "mops", text: "Just this once.", status: "pending", source: PASS + "28 (CHANGED)" },
    { id: "mops-hide-when", who: "mops", text: "Hide when I say hide.", status: "pending", source: PASS + "28 (CHANGED)" },
    // ---- 29. Walk to the loading bay, and the cue to hide ----
    { id: "chip-follow", who: "chip", text: "Squatch: follow Mops to the ship", status: "pending", source: PASS + "29 (goal words, NEW)" },
    { id: "mops-later", who: "mops", text: "Later. The ship!", status: "pending", source: PASS + "29 (NEW)" },
    { id: "mops-manager", who: "mops", text: "Quick! The manager is coming!", status: "pending", source: PASS + "29 (NEW)" },
    { id: "mops-hide", who: "mops", text: "Hide!", status: "pending", source: PASS + "29 (NEW)" },
    { id: "chip-cargo", who: "chip", text: "Squatch: hide behind the cargo", status: "pending", source: PASS + "29 (goal words, NEW)" },
    { id: "button-ball", who: "button", text: "ROLL · ball", status: "approved", source: "Brian, chat 2026-11-26 (lunch); " + PASS + "29" },
    // ---- 30. The robots arrive, and three workers say goodbye ----
    { id: "isfred-muffled", who: "official", text: "Mmf mmf... mmf!", status: "pending", source: PASS + "30 (NEW, muffled)" },
    { id: "scanner-proceed", who: "scanner", style: "ear", text: "NO FUR. PROCEED.", status: "pending", source: PASS + "30 (NEW)" },
    { id: "chip-plant", who: "chip", text: "Squatch: sneak to the plant", status: "in-game", source: "src/modules/party-lines.js (the party's sneak)" },
    { id: "button-hide", who: "button", text: "HIDE · plant", status: "in-game", source: BAY_DAY2 },
    { id: "ups-scanned", who: "ups", style: "ear", text: "Mail scanned.", status: "pending", source: PASS + "30 (NEW)" },
    { id: "isfred-not-sure", who: "official", text: "I wasn't sure we needed these robots.", status: "pending", source: PASS + "30 (CHANGED, Brian's Nov 8 line split)" },
    { id: "isfred-fur", who: "official", text: "But we keep getting fur in the vents.", status: "pending", source: PASS + "30 (CHANGED)" },
    { id: "isfred-convinced", who: "official", text: "I'm convinced now.", status: "pending", source: PASS + "30 (CHANGED)" },
    { id: "sq-was-me", who: "sq", style: "think", text: "Fur in the vents... that was me.", status: "pending", source: PASS + "30 (NEW)" },
    { id: "isfred-names", who: "official", text: "Dot. Bob. Lou.", status: "pending", source: PASS + "30 (NEW)" },
    { id: "isfred-thanks", who: "official", text: "Thank you for thirty years.", status: "pending", source: PASS + "30 (NEW)" },
    { id: "isfred-take-it", who: "official", text: "The robots will take it from here.", status: "pending", source: PASS + "30 (NEW)" },
    { id: "dot-toaster", who: "dot", style: "ear", text: "Thirty years. Replaced by a toaster.", status: "pending", source: PASS + "30 (NEW)" },
    { id: "bob-way-up", who: "bob", style: "ear", text: "Other way up, pal.", status: "pending", source: PASS + "30 (NEW)" },
    { id: "scanner-stop", who: "scanner", style: "ear", text: "FUR. STOP.", status: "pending", source: PASS + "30 (NEW)" },
    { id: "lou-hat", who: "lou", style: "ear", text: "It's a HAT.", status: "pending", source: PASS + "30 (NEW)" },
    { id: "mops-bleat-short", who: "mops", text: "Weee...?", status: "pending", source: PASS + "30 (NEW)" },
    // ---- 31. The promise ----
    { id: "isfred-dont-worry", who: "official", text: "Mops, don't worry.", status: "pending", source: PASS + "31 (CHANGED)" },
    { id: "isfred-love", who: "official", text: "You know how much we love you here.", status: "pending", source: PASS + "31 (CHANGED)" },
    { id: "isfred-visitors", who: "official", text: "Even our visitors love you.", status: "pending", source: PASS + "31 (CHANGED)" },
    { id: "mops-bleat-happy", who: "mops", text: "Weeee-eenn-nnttt!", status: "pending", source: PASS + "31 (NEW)" },
    // ---- 32. The form ----
    { id: "chip-peek", who: "chip", text: "Squatch: peek at the form", status: "pending", source: PASS + "32 (goal words, NEW)" },
    { id: "button-peek", who: "button", text: "PEEK · form", status: "pending", source: PASS + "32 (PEEK opens the close-up)" },
    { id: "robot-sign", who: "robot", text: "Sign here.", status: "pending", source: PASS + "32 (NEW)" },
    { id: "robot-tick", who: "robot", text: "Tick the box to order more robots.", status: "pending", source: PASS + "32 (NEW)" },
    { id: "order-box", who: "paper", text: "ORDER MORE ROBOTS", status: "pending", source: PASS + "32 (KEEP; the box is drawn)" },
    { id: "isfred-no-need", who: "official", text: "Oh, I don't need this order form.", status: "pending", source: PASS + "32 (CHANGED, Brian's Nov 8 words)" },
    { id: "isfred-ganitor", who: "official", text: "I wouldn't replace the Ganitor.", status: "pending", source: PASS + "32 (CHANGED)" },
    { id: "isfred-attraction", who: "official", text: "He's part of the attraction that brings all the tourists here.", status: "pending", source: PASS + "32 (CHANGED)" },
    { id: "isfred-office", who: "official", text: "Please put this in my office.", status: "pending", source: PASS + "32 (NEW)" },
    { id: "isfred-wait", who: "official", text: "Oh, wait.", status: "pending", source: PASS + "32 (NEW)" },
    { id: "isfred-code", who: "official", text: "Here's the code to unlock the door.", status: "pending", source: PASS + "32 (NEW)" },
    { id: "dot-leaving", who: "dot", style: "ear", text: "Isfred! We're leaving!", status: "pending", source: PASS + "32 (NEW)" },
    // ---- 33. "Delicious." (the player is Mops) ----
    { id: "card-mops", who: "card", text: "Mops takes care of the copies.", status: "pending", source: PASS + "33 (the switch card's line, NEW)" },
    { id: "robot-copies", who: "robot", text: "Left one of the copies in the office. What do I do with the other two?", status: "pending", source: PASS + "33 (KEEP)" },
    { id: "mops-take", who: "mops", text: "I'll take care of it.", status: "pending", source: PASS + "33 (KEEP)" },
    { id: "chip-take", who: "chip", text: "Mops: take the copies", status: "pending", source: PASS + "33 (goal words, NEW)" },
    { id: "button-take", who: "button", text: "TAKE · copies", status: "pending", source: PASS + "33 (NEW)" },
    { id: "chip-eat", who: "chip", text: "Mops: eat the copies", status: "pending", source: PASS + "33 (goal words, NEW)" },
    { id: "button-eat", who: "button", text: "EAT · copies", status: "pending", source: PASS + "33 (NEW)" },
    { id: "mops-delicious", who: "mops", text: "Delicious.", status: "pending", source: PASS + "33 (KEEP)" },
    // ---- 34. The robots get their orders, then gumbling ----
    { id: "robot-office", who: "robot", text: "Unit 1: clean the office.", status: "pending", source: PASS + "34 (NEW)" },
    { id: "robot-hall", who: "robot", text: "Units 2 and 3: clean the great hall.", status: "pending", source: PASS + "34 (NEW)" },
    { id: "robots-cleaning", who: "robot", text: "CLEANING.", status: "pending", source: PASS + "34 (NEW)" },
    { id: "chip-talk", who: "chip", text: "Mops: talk to Squatch", status: "pending", source: PASS + "34 (goal words, NEW)" },
    { id: "button-talk", who: "button", text: "TALK · Squatch", status: "pending", source: PASS + "34 (NEW)" },
    { id: "mops-mumble", who: "mops", style: "whisper", text: "Mee, Mwatch? Muffing moo mworry amout.", status: "pending", source: PASS + "34 (CHANGED; whispered, mouth full)" },
    { id: "sq-gumbling", who: "sq", text: "You're gumbling! (goat mumbling)", status: "approved", source: PASS + "34 (KEEP, approved; the bracket stays)" },
    { id: "sq-paper-mouth", who: "sq", text: "I can't understand you with paper in your mouth.", status: "pending", source: PASS + "34 (NEW)" },
    // ---- 35. Spit into the bin (still Mops), and the mail ----
    { id: "chip-spit", who: "chip", text: "Mops: spit them out", status: "pending", source: PASS + "35 (goal words, NEW)" },
    { id: "button-spit", who: "button", text: "SPIT · bin", status: "pending", source: PASS + "35 (NEW)" },
    { id: "mops-ptoo", who: "mops", text: "Ptoo!", status: "pending", source: PASS + "35 (KEEP)" },
    { id: "mops-see-squatch", who: "mops", text: "See, Squatch? Nothing to worry about.", status: "pending", source: PASS + "35 (NEW)" },
    { id: "chip-box", who: "chip", text: "Mops: pick up the little box", status: "pending", source: PASS + "35 (goal words, NEW)" },
    { id: "button-box", who: "button", text: "PICK UP · box", status: "pending", source: PASS + "35 (NEW; the home morning's PICK UP)" },
    { id: "chip-give", who: "chip", text: "Mops: give Squatch the box", status: "pending", source: PASS + "35 (goal words, NEW)" },
    { id: "button-give", who: "button", text: "GIVE · box", status: "pending", source: PASS + "35 (NEW)" },
    { id: "mops-mail", who: "mops", text: "Mail for you.", status: "pending", source: PASS + "35 (NEW)" },
    { id: "box-tag", who: "paper", text: "For S. A new kind. — The Guardians", status: "pending", source: PASS + "35 (NEW, the tag)" },
    { id: "sq-never-forget", who: "sq", text: "They never forget.", status: "pending", source: PASS + "35 (NEW)" },
    { id: "mops-home", who: "mops", text: "The robots are gone. Let's get you home.", status: "pending", source: PASS + "35 (NEW)" },
    { id: "mops-close", who: "mops", text: "Stay close to me.", status: "pending", source: PASS + "35 (NEW)" },
    { id: "card-squatch", who: "card", text: "Squatch goes home with Mops.", status: "pending", source: PASS + "35 (the switch card's line, NEW)" },
    { id: "crate-empty", who: "paper", text: "EMPTY. FOR PICKUP.", status: "pending", source: PASS + "30 (NEW, the empty crate's tag)" },
    // ---- 36. The hairball (the walk home) ----
    { id: "chip-home", who: "chip", text: "Squatch: go home with Mops", status: "pending", source: PASS + "36 (goal words, NEW)" },
    { id: "robot-what", who: "robot", text: "What's that?", status: "pending", source: PASS + "36 (NEW)" },
    { id: "mops-hairball", who: "mops", text: "Big hairball.", status: "pending", source: PASS + "36 (NEW)" },
    { id: "robot-compute", who: "robot", text: "Does not compute.", status: "pending", source: PASS + "36 (NEW)" },
    { id: "mops-robots", who: "mops", text: "We have to watch out for these robots.", status: "pending", source: PASS + "36 (CHANGED)" },
    { id: "sq-fur", who: "sq", text: "What's the difference between fur and hair?", status: "decided", source: PASS + "36 (KEEP, decided)" },
    { id: "mops-paperwork", who: "mops", text: "Paperwork.", status: "decided", source: PASS + "36 (KEEP, decided)" },
    // ---- 36b. Through the party hall, past three cleaning robots ----
    // ---- the lockup card's words, when someone here sees him (the one capture rule: who saw him, and where) ----
    { id: "lockup-robot", who: "lockup", text: "A robot", status: "pending", source: "builder's words for the lockup card (NEW)" },
    { id: "lockup-manager", who: "lockup", text: "The manager", status: "pending", source: "builder's words for the lockup card (NEW)" },
    { id: "lockup-worker", who: "lockup", text: "A worker", status: "pending", source: "builder's words for the lockup card (NEW)" },
    { id: "lockup-bay", who: "lockup", text: "in the delivery room", status: "pending", source: "builder's words for the lockup card (NEW)" },
    { id: "lockup-hallway", who: "lockup", text: "in the hallway", status: "pending", source: "builder's words for the lockup card (NEW)" },
    { id: "chip-hall", who: "chip", text: "Squatch: get past the robots", status: "pending", source: PASS + "36b (goal words, NEW)" },
    { id: "robot-turn", who: "robot", style: "ear", text: "CLEANING.", status: "pending", source: PASS + "36b (NEW)" },
    { id: "robot-move", who: "robot", text: "MOVE, GOAT.", status: "pending", source: PASS + "36b (NEW)" },
    { id: "mops-corner", who: "mops", text: "You missed a corner.", status: "pending", source: PASS + "36b (NEW)" },
    { id: "robot-corners", who: "robot", text: "CORNERS ARE NOT EFFICIENT.", status: "pending", source: PASS + "36b (NEW)" },
  ].map((l) => Object.freeze(l)),
);

/** The words of one line, by id. Throws on an unknown id, so a typo cannot show empty words. */
export function bayWords(id) {
  const l = BAY_LINES.find((x) => x.id === id);
  if (!l) throw new Error(`no loading bay line ${id}`);
  return l.text;
}
/** The whole line (who, style, words), by id. */
export function bayLine(id) {
  const l = BAY_LINES.find((x) => x.id === id);
  if (!l) throw new Error(`no loading bay line ${id}`);
  return l;
}
/** The speakers this beat brings, and the names over their bubbles (the workers are named on screen by Isfred). */
export const BAY_SPEAKER_NAMES = Object.freeze({ dot: "Dot", bob: "Bob", lou: "Lou" });
