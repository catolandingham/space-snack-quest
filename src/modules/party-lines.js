/**
 * Every word the party night shows (Chapter 1, the eight party scenes P1 to P8 of the party plan), in the order
 * a player meets them. docs/PARTY-LINES-FOR-BRIAN.md is the same list for Brian, numbered; tests/party-lines.mjs
 * fails if the two ever differ, and fails if the party code types a word of its own.
 *   id      the line's name in the code and in the tests
 *   half    1 = scenes P1 to P5 (peek to dress-up, built first), 2 = P6 to P8 (free play, alarm, endings)
 *   who     "banner", "isfred", "sq" (Squatch thinks or says it), "card", "chip" (the goal chip), "button" (the big
 *           action button), "meter", "guest" (a party guest), "bartender", "octopus", "band", "speaker", "mops",
 *           "lockup" (the LOCKUP card) or "note" (the small note after hiding)
 *   text    the words, exactly as shown. The lockup line has two blanks, {who} and {where}, filled from the
 *           "who-*" and "where-*" lines.
 *   status  "approved" (Brian's yes, `source` says where) or "needs-yes" (not final until he says yes). Until he
 *           answers, the draft words are what the game shows (coordinator, 2026-11-24: build with the draft lines).
 *   source  where the words or the yes came from. "Waiting" = written before, never given his yes. "New" = written
 *           for the party plan.
 * The "That evening…" card is the morning's (morning-lines.js); Isfred's name over his bubble is the engine's.
 */
export const PARTY_LINES = Object.freeze([
  // P1, the peek
  { id: "chip-peek", half: 1, who: "chip", text: "Squatch: peek out the door", status: "needs-yes", source: "Waiting: in the game since the evening was built" },
  { id: "button-peek", half: 1, who: "button", text: "PEEK · door", status: "needs-yes", source: "Waiting: party plan line 33" },
  { id: "banner-1", half: 1, who: "banner", text: "ROBOTICS DELEGATION!", status: "approved", source: "walkthrough beat 3; kept 2026-11-07" },
  { id: "banner-2", half: 1, who: "banner", text: "COMING SOON!", status: "needs-yes", source: "Your own idea (comment 14, 2026-11-23): one sign; please confirm" },
  { id: "isfred-muffled", half: 1, who: "isfred", text: "Mmf mmf... mm-mmf... mmf!", status: "approved", source: "walkthrough beat 3, Nov 14" },
  { id: "sq-robots", half: 1, who: "sq", text: "Robots?", status: "approved", source: "walkthrough beat 3, Nov 14" },
  { id: "teach-cones", half: 1, who: "card", text: "Stay out of their sight!", status: "needs-yes", source: "New: the one teach card, for cones" },
  // P2, the sneak to the plant
  { id: "chip-plant", half: 1, who: "chip", text: "Squatch: sneak to the plant", status: "needs-yes", source: "Waiting: walkthrough beat 4" },
  { id: "button-hide-plant", half: 1, who: "button", text: "HIDE · plant", status: "approved", source: "In the game; HIDE · thing is the rule everywhere" },
  { id: "guest-fur", half: 1, who: "guest", text: "FUR!", status: "needs-yes", source: "Waiting: Claude's call 4, 2026-11-22 (whoever sees him shouts it)" },
  { id: "note-lost", half: 1, who: "note", text: "They lost you.", status: "approved", source: "The one capture rule (CLAUDE.md)" },
  { id: "lockup-cause", half: 1, who: "lockup", text: "{who} saw Squatch {where}. Security caught him.", status: "needs-yes", source: "Pattern from the game's own \"A tourist saw Squatch in the hall. Security caught him.\"" },
  { id: "who-tourist", half: 1, who: "lockup", text: "A tourist", status: "approved", source: "In the game (the hall's lockup card)" },
  { id: "who-bartender", half: 2, who: "lockup", text: "The bartender", status: "needs-yes", source: "New: party plan line 28" },
  { id: "who-guard", half: 1, who: "lockup", text: "A guard", status: "needs-yes", source: "New: party plan line 28" },
  { id: "where-hall", half: 1, who: "lockup", text: "in the hall", status: "approved", source: "In the game (the hall's lockup card)" },
  { id: "where-bar", half: 2, who: "lockup", text: "at the snack bar", status: "needs-yes", source: "New: party plan line 28" },
  { id: "where-vent", half: 1, who: "lockup", text: "by the vent", status: "needs-yes", source: "New: party plan line 28" },
  { id: "where-dance", half: 2, who: "lockup", text: "on the dance floor", status: "needs-yes", source: "New: party plan line 28" },
  { id: "where-home", half: 1, who: "lockup", text: "at home", status: "needs-yes", source: "New: party plan line 28" },
  { id: "button-hide-bed", half: 1, who: "button", text: "HIDE · bed", status: "approved", source: "In the game (the home search)" },
  // P3, the welcome and the band, seen from the plant
  { id: "isfred-hello", half: 1, who: "isfred", text: "Let's give a big hello to our friends from Bleep-Bloop Robotics!", status: "needs-yes", source: "Waiting: in the game, never given your yes" },
  { id: "isfred-helpers", half: 1, who: "isfred", text: "Soon their helper robots will be here, to help with the heavy work.", status: "needs-yes", source: "Waiting: in the game, never given your yes" },
  { id: "isfred-band", half: 1, who: "isfred", text: "And now... put your hands together for the Croc Boys!", status: "needs-yes", source: "Waiting: in the game, never given your yes" },
  { id: "band-song", half: 1, who: "band", text: "Stormtop-vania 1-2-3-4-5!", status: "needs-yes", source: "Waiting: from G 318 (\"the name of the planet or station- vania 12345\")" },
  { id: "sq-dance-wish", half: 1, who: "sq", text: "I've never gotten to dance at a party.", status: "needs-yes", source: "Waiting: your words, S 982" },
  { id: "chip-home", half: 1, who: "chip", text: "Squatch: sneak home for a disguise", status: "needs-yes", source: "New" },
  // P5, dress-up
  { id: "button-closet", half: 1, who: "button", text: "OPEN · closet", status: "approved", source: "Brian 2026-11-23: 6A (home alone)" },
  { id: "meter-disguised", half: 1, who: "meter", text: "Disguised enough", status: "needs-yes", source: "Waiting: your \"sufficiently disguised\", S 996" },
  { id: "button-go", half: 1, who: "button", text: "GO · party", status: "needs-yes", source: "Waiting: party plan line 17" },
  // P6, the party in disguise
  { id: "button-dance", half: 2, who: "button", text: "DANCE · circle", status: "needs-yes", source: "Waiting: party plan line 33" },
  { id: "guest-cheese", half: 2, who: "guest", text: "Say cheese!", status: "needs-yes", source: "Waiting: in the game, never given your yes" },
  { id: "bartender-gloves", half: 2, who: "bartender", text: "...Nice gloves.", status: "needs-yes", source: "Waiting: your words, S 1025" },
  { id: "bartender-fur", half: 2, who: "bartender", text: "Wait a second... fur!", status: "needs-yes", source: "Waiting: your words, S 1025" },
  { id: "octopus-hic", half: 2, who: "octopus", text: "*hic* Fellow tourist!", status: "needs-yes", source: "Waiting: R60" },
  { id: "sq-juke", half: 2, who: "sq", text: "I gotta juke this fool.", status: "needs-yes", source: "Waiting: your words, S 1001" },
  { id: "sq-mops", half: 2, who: "sq", text: "Mops!", status: "needs-yes", source: "New: Squatch's thought when Mops's beard is in the hallway doorway" },
  // P7, the FUR alarm and the run home
  { id: "chip-run", half: 2, who: "chip", text: "Squatch: run home and hide!", status: "needs-yes", source: "New" },
  // P8, the endings
  { id: "speaker-closing", half: 2, who: "speaker", text: "The party's over. Good night, Stormtop!", status: "needs-yes", source: "New" },
  { id: "sq-someone", half: 2, who: "sq", text: "Everyone out there has someone.", status: "needs-yes", source: "Waiting: your words, t291u" },
  { id: "mops-have-me", half: 2, who: "mops", text: "You have me.", status: "approved", source: "R52" },
]);

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
