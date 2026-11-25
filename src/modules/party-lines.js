/**
 * Every word the party night shows (Chapter 1, the eight party scenes P1 to P8 of the party plan), in the order
 * a player meets them. docs/PARTY-LINES-FOR-BRIAN.md is the same list for Brian, numbered; tests/party-lines.mjs
 * fails if the two ever differ, and fails if the party code types a word of its own.
 *   id      the line's name in the code and in the tests
 *   half    1 = scenes P1 to P5 (peek to dress-up, built first), 2 = P6 to P8 (free play, alarm, endings)
 *   who     "banner", "isfred", "sq" (Squatch thinks or says it), "card", "chip" (the goal chip), "button" (the big
 *           action button), "tag" (the name over a bubble), "meter", "guest" (a party guest), "bartender", "octopus", "band", "speaker", "mops", "guard" (the guard who follows him home),
 *           "lockup" (the LOCKUP card) or "note" (the small note after hiding)
 *   text    the words, exactly as shown. The lockup line has two blanks, {who} and {where}, filled from the
 *           "who-*" and "where-*" lines.
 *   status  "approved" (Brian's yes, `source` says where) or "needs-yes" (not final until he says yes). Brian said
 *           "Yes to all" to the 31 lines that needed it on 2026-11-24 (Snack Quest Chat).
 *   removed true for a line the game no longer shows (its row stays, so the sheet's numbers never shift)
 *   quiet   true for a gentle line of Mops's that must not get his goat "meh" (the bubble's soft tick stays)
 *   source  where the words or the yes came from. "Waiting" = written before, never given his yes. "New" = written
 *           for the party plan.
 * The "That evening…" card is the morning's (morning-lines.js); Isfred's name over his bubble is the engine's.
 */
export const PARTY_LINES = Object.freeze([
  // P1, the peek
  { id: "chip-peek", half: 1, who: "chip", text: "Squatch: peek out the door", status: "approved", source: "Brian 2026-11-24: Yes to all" },
  { id: "button-peek", half: 1, who: "button", text: "PEEK · door", status: "approved", source: "Brian 2026-11-24: Yes to all" },
  { id: "banner-1", half: 1, who: "banner", text: "ROBOTICS DELEGATION!", status: "approved", source: "walkthrough beat 3; kept 2026-11-07" },
  { id: "banner-2", half: 1, who: "banner", text: "COMING SOON!", status: "approved", source: "Brian 2026-11-24: Yes to all" },
  { id: "isfred-muffled", half: 1, who: "isfred", text: "Mmf mmf... mm-mmf... mmf!", status: "approved", source: "walkthrough beat 3, Nov 14" },
  { id: "sq-robots", half: 1, who: "sq", text: "Robots?", status: "approved", source: "walkthrough beat 3, Nov 14" },
  { id: "teach-cones", half: 1, who: "card", text: "Stay out of their sight!", status: "approved", source: "Brian 2026-11-24: Yes to all" },
  // P2, the sneak to the plant
  { id: "chip-plant", half: 1, who: "chip", text: "Squatch: sneak to the plant", status: "approved", source: "Brian 2026-11-24: Yes to all" },
  { id: "button-hide-plant", half: 1, who: "button", text: "HIDE · plant", status: "approved", source: "In the game; HIDE · thing is the rule everywhere" },
  { id: "guest-fur", half: 1, who: "guest", text: "FUR!", status: "approved", source: "Brian 2026-11-24: Yes to all" },
  { id: "note-lost", half: 1, who: "note", text: "They lost you.", status: "approved", source: "The one capture rule (CLAUDE.md)" },
  { id: "lockup-cause", half: 1, who: "lockup", text: "{who} saw Squatch {where}. Security caught him.", status: "approved", source: "Brian 2026-11-24: Yes to all" },
  { id: "who-tourist", half: 1, who: "lockup", text: "A tourist", status: "approved", source: "In the game (the hall's lockup card)" },
  { id: "who-bartender", half: 1, who: "lockup", text: "The bartender", status: "approved", source: "Brian 2026-11-24: Yes to all" },
  { id: "who-guard", half: 1, who: "lockup", text: "A guard", status: "approved", source: "Brian 2026-11-24: Yes to all" },
  { id: "where-hall", half: 1, who: "lockup", text: "in the hall", status: "approved", source: "In the game (the hall's lockup card)" },
  { id: "where-bar", half: 2, who: "lockup", text: "at the snack bar", status: "approved", source: "Brian 2026-11-24: Yes to all" },
  { id: "where-vent", half: 1, who: "lockup", text: "by the vent", status: "approved", source: "Brian 2026-11-24: Yes to all" },
  { id: "where-dance", half: 2, who: "lockup", text: "on the dance floor", status: "approved", source: "Brian 2026-11-24: Yes to all" },
  { id: "where-home", half: 1, who: "lockup", text: "at home", status: "approved", source: "Brian 2026-11-24: Yes to all" },
  { id: "button-hide-bed", half: 1, who: "button", text: "HIDE · bed", status: "approved", source: "In the game (the home search)" },
  // P3, the welcome and the band, seen from the plant
  { id: "isfred-hello", half: 1, who: "isfred", text: "Let's give a big hello to our friends from Bleep-Bloop Robotics!", status: "approved", source: "Brian 2026-11-24: Yes to all" },
  { id: "isfred-helpers", half: 1, who: "isfred", text: "Soon their helper robots will be here, to help with the heavy work.", status: "approved", source: "Brian 2026-11-24: Yes to all" },
  { id: "isfred-band", half: 1, who: "isfred", text: "And now... put your hands together for the Croc Boys!", status: "approved", source: "Brian 2026-11-24: Yes to all" },
  { id: "tag-band", half: 1, who: "tag", text: "Croc Boys", status: "needs-yes", source: "New: the name over the band's song bubble (Isfred has just called them the Croc Boys); coordinator, 2026-11-24" },
  { id: "band-song", half: 1, who: "band", text: "Stormtop-vania 1-2-3-4-5!", status: "approved", source: "Brian 2026-11-24: Yes to all" },
  { id: "sq-dance-wish", half: 1, who: "sq", text: "I've never gotten to dance at a party.", status: "approved", source: "Brian 2026-11-24: Yes to all" },
  { id: "chip-home", half: 1, who: "chip", text: "Squatch: sneak home for a disguise", status: "approved", source: "Brian 2026-11-24: Yes to all" },
  // P5, dress-up
  { id: "button-closet", half: 1, who: "button", text: "OPEN · closet", status: "approved", source: "Brian 2026-11-23: 6A (home alone)" },
  { id: "meter-disguised", half: 1, who: "meter", text: "Disguised enough", status: "approved", source: "Brian 2026-11-24: Yes to all" },
  { id: "button-go", half: 1, who: "button", text: "GO · party", status: "approved", source: "Brian 2026-11-24: Yes to all" },
  // P6, the party in disguise
  { id: "button-dance", half: 2, who: "button", text: "DANCE · circle", status: "approved", source: "Brian 2026-11-24: Yes to all" },
  { id: "guest-cheese", half: 2, who: "guest", text: "Say cheese!", status: "approved", source: "Brian 2026-11-24: Yes to all" },
  { id: "bartender-gloves", half: 2, who: "bartender", text: "...Nice gloves.", status: "approved", source: "Brian 2026-11-24: Yes to all" },
  { id: "bartender-fur", half: 2, who: "bartender", text: "Wait a second... fur!", status: "approved", source: "Brian 2026-11-24: Yes to all" },
  { id: "octopus-hic", half: 2, who: "octopus", text: "*hic* Fellow tourist!", status: "approved", source: "Brian 2026-11-24: Yes to all" },
  { id: "sq-juke", half: 2, who: "sq", text: "I gotta juke this fool.", status: "approved", source: "Brian 2026-11-24: Yes to all" },
  // Removed 2026-11-24 (the row is kept so the sheet's numbers do not shift): "sq-hallway" below replaced it.
  { id: "sq-mops", half: 2, who: "sq", text: "Mops!", status: "approved", source: "Removed 2026-11-24: replaced by line 43 (it had Brian's yes of 2026-11-24)", removed: true },
  // P7, the FUR alarm and the run home
  { id: "chip-run", half: 1, who: "chip", text: "Squatch: run home and hide!", status: "approved", source: "Brian 2026-11-24: Yes to all" },
  // P8, the endings
  { id: "speaker-closing", half: 2, who: "speaker", text: "The party's over. Good night, Stormtop!", status: "approved", source: "Brian 2026-11-24: Yes to all" },
  { id: "sq-someone", half: 2, who: "sq", text: "Everyone out there has someone.", status: "approved", source: "Brian 2026-11-24: Yes to all" },
  { id: "mops-have-me", half: 2, who: "mops", text: "You have me.", status: "approved", source: "R52, decided", quiet: true },
  // Added after the first 42 (new lines go at the end, so no number ever shifts)
  { id: "sq-hallway", half: 2, who: "sq", text: "I can't go there. Mops will see me.", status: "approved", source: "Brian 2026-11-24, click in Snack Quest Chat" },
  // Party round four (Brian's answers of 2026-11-24, asks/video-notes-2026-11-24/ANSWERS.md)
  { id: "sq-arms", half: 2, who: "sq", text: "Those arms will pull off my disguise!", status: "approved", source: "Brian 2026-11-24, Snack Quest Chat" },
  { id: "button-grab", half: 2, who: "button", text: "GRAB · snacks", status: "approved", source: "Brian 2026-11-24, Snack Quest Chat" },
  { id: "button-join", half: 2, who: "button", text: "JOIN · photo", status: "approved", source: "Brian 2026-11-24, Snack Quest Chat" },
  { id: "card-more", half: 2, who: "card", text: "There's more to find at the party!", status: "approved", source: "Brian 2026-11-24, Snack Quest Chat" },
  { id: "card-all", half: 2, who: "card", text: "You found everything at the party!", status: "approved", source: "Brian 2026-11-24, Snack Quest Chat" },
  { id: "button-back", half: 2, who: "button", text: "Back to the party", status: "approved", source: "Brian 2026-11-24, Snack Quest Chat" },
  { id: "button-keep", half: 2, who: "button", text: "Keep going", status: "approved", source: "Brian 2026-11-24, Snack Quest Chat" },
  { id: "guard-alarm", half: 2, who: "guard", text: "Someone pulled the fur alarm.", status: "approved", source: "Brian 2026-11-24, Snack Quest Chat" },
  { id: "guard-ran", half: 2, who: "guard", text: "They saw someone run in here.", status: "approved", source: "Brian 2026-11-24, Snack Quest Chat" },
  { id: "mops-wookiee", half: 2, who: "mops", text: "Sure. I'm hiding a Wookiee in here.", status: "approved", source: "Brian 2026-11-24, Snack Quest Chat" },
  { id: "guard-ridiculous", half: 2, who: "guard", text: "Ha! You're right. That's ridiculous.", status: "approved", source: "Brian 2026-11-24, Snack Quest Chat" },
  { id: "guard-poker", half: 2, who: "guard", text: "You coming to poker night?", status: "approved", source: "Brian 2026-11-24, Snack Quest Chat" },
  { id: "mops-thumbs", half: 2, who: "mops", text: "You know I don't have opposable thumbs.", status: "approved", source: "Brian 2026-11-24, Snack Quest Chat" },
  { id: "mops-went", half: 2, who: "mops", text: "You went to the party.", status: "approved", source: "Brian 2026-11-24, Snack Quest Chat", quiet: true },
  { id: "sq-except", half: 2, who: "sq", text: "Everyone except me.", status: "approved", source: "Brian 2026-11-24, Snack Quest Chat" },
  // After the hat, before the TV (Brian 2026-11-24, night: his own words, then his click "Shorter second Mops line").
  // Mops answers only the first question, on purpose (docs/STORY-DECISIONS.md section 5: the Guardians).
  { id: "sq-why-hide", half: 2, who: "sq", text: "But why do I have to hide from everyone but you?", status: "approved", source: "Brian 2026-11-24, Snack Quest Chat", quiet: true },
  { id: "sq-why-guardians", half: 2, who: "sq", text: "And why can't the Guardians and I be together?", status: "approved", source: "Brian 2026-11-24, Snack Quest Chat", quiet: true },
  { id: "mops-waiting", half: 2, who: "mops", text: "I've been waiting to show you this.", status: "approved", source: "Brian 2026-11-24, Snack Quest Chat", quiet: true },
  { id: "mops-heres-why", half: 2, who: "mops", text: "Here's why you have to hide.", status: "approved", source: "Brian 2026-11-24, Snack Quest Chat", quiet: true },
  // The flyer sneak (Brian 2026-11-24, night: "what if he just leaves one on the side of the stage ... and we have
  // to sneak to get it and get back to the room"; his click "He wants to show Mops"; then, for getting home, "it
  // should mention the party and wanting to dance").
  { id: "sq-flyer", half: 1, who: "sq", text: "A robot flyer! I'll show Mops.", status: "approved", source: "Brian 2026-11-24, Snack Quest Chat" },
  { id: "chip-flyer", half: 1, who: "chip", text: "Squatch: grab the flyer", status: "approved", source: "Brian 2026-11-24, Snack Quest Chat" },
  { id: "button-grab-flyer", half: 1, who: "button", text: "GRAB · flyer", status: "approved", source: "Brian 2026-11-24, Snack Quest Chat" },
  { id: "sq-normal", half: 1, who: "sq", text: "I deserve one night of normal.", status: "approved", source: "Brian 2026-11-24, Snack Quest Chat" },
  { id: "sq-costume", half: 1, who: "sq", text: "Costume on. Then I dance!", status: "approved", source: "Brian 2026-11-24, Snack Quest Chat" },
  { id: "sq-got-one", half: 2, who: "sq", text: "Got one!", status: "approved", source: "Brian 2026-11-24, Snack Quest Chat: \"I like his own thought\"" },
  { id: "button-leave-bar", half: 2, who: "button", text: "LEAVE · bar", status: "approved", source: "Brian 2026-11-24, Snack Quest Chat: a LEAVE · bar button always on screen" },
  { id: "honor-snack-bandit", half: 2, who: "card", text: "Snack Bandit: took every snack at the party.", status: "approved", source: "Brian 2026-11-24, click in Snack Quest Chat: \"Snack Bandit (Recommended)\"" },
]);

/** Whether this bubble is one of Mops's gentle lines, which never get his "meh" (morning-sound.js, through the bridge). */
export function quietLine(b) {
  return !!b && PARTY_LINES.some((l) => l.quiet && !l.removed && l.who === b.who && l.text === b.text);
}

/** The words of one line, by id. Throws on an unknown id, so a typo cannot show empty words. */
export function partyLine(id) {
  const l = PARTY_LINES.find((x) => x.id === id);
  if (!l) throw new Error(`no party line ${id}`);
  return l.text;
}

/** The LOCKUP card's cause: who saw him and where, from the one pattern (party plan line 28). */
export function lockupCause(whoId, whereId) {
  return partyLine("lockup-cause").replace("{who}", partyLine(whoId)).replace("{where}", partyLine(whereId));
}
