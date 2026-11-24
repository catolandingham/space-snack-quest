/**
 * Every word the morning shows, in the order a player meets them (docs/MORNING-LINES-FOR-BRIAN.md is the
 * same list for Brian, numbered). The morning beat (morning.js) reads its words only from here.
 *   id      the line's name in the code and in the tests
 *   who     "card", "speaker" (the wooden speaker on the wall), "mops", "sq", "chip" (the goal chip),
 *           "button" (the big action button), "tag" (the name over a bubble) or "cue" (drawn on the picture)
 *   text    the words, exactly as shown
 *   status  "approved" (Brian's yes, `source` says where) or "needs-yes" (new or changed; not final until he says yes)
 *   source  where the words or the yes came from
 * Brian, 2026-11-23, on the speaker lines: "I like them generally but you can expand to help with story and flow".
 */
export const MORNING_LINES = Object.freeze([
  { id: "card-jupiter", who: "card", text: "Stormtop Cloud Resort, floating above Jupiter.", status: "approved", source: "walkthrough beat 1, decided" },
  { id: "card-squatch", who: "card", text: "This is Squatch. He's a Sasquatch.", status: "approved", source: "walkthrough beat 1, decided" },
  { id: "speaker-party", who: "speaker", text: "Good morning, Stormtop! Big party in the hall tonight!", status: "approved", source: "Brian 2026-11-23: 1A / 2B" },
  { id: "speaker-invite", who: "speaker", text: "Everyone is invited!", status: "approved", source: "Brian 2026-11-23: 1A / 2B" },
  { id: "mops-morning", who: "mops", text: "Morning, Squatch.", status: "approved", source: "walkthrough beat 1, Brian yes Nov 14; after the speaker by the Q1 answer 2026-11-23" },
  { id: "sq-party", who: "sq", text: "Party?", status: "approved", source: "walkthrough beat 1, Nov 14; before the cutaway by the Q1 answer 2026-11-23" },
  { id: "speaker-song", who: "speaker", text: "Now here's a classic hit from Dog Zylan!", status: "approved", source: "Brian 2026-11-23: 1A / 2B" },
  { id: "mops-song", who: "mops", text: "Floating in space! It's our favorite song!", status: "approved", source: "Q3 answer 2026-11-23 (from G 561)" },
  { id: "chip-sing", who: "chip", text: "Squatch: sing along with Mops", status: "approved", source: "Q4 answer 2026-11-23" },
  { id: "button-sing", who: "button", text: "SING ALONG", status: "approved", source: "card answer S 1371; \"Button is fine\" S 1356" },
  { id: "button-talk", who: "button", text: "TALK · Mops", status: "approved", source: "Brian 2026-11-23: 1A / 2B" },
  { id: "sq-sing", who: "sq", text: "♪ I'm floating in space! ♪", status: "approved", source: "walkthrough beat 2, decided; S 1335" },
  { id: "mops-sing", who: "mops", text: "♪ Weeee-eenn-nnttt! ♪", status: "approved", source: "walkthrough beat 2, decided; S 1335" },
  { id: "mops-work", who: "mops", text: "I have to go to work now.", status: "approved", source: "Q5 answer 2026-11-23 (from G 561)" },
  { id: "mops-stay", who: "mops", text: "Stay in here.", status: "approved", source: "walkthrough beat 1, Nov 14; Q5 answer 2026-11-23" },
  { id: "card-evening", who: "card", text: "That evening…", status: "approved", source: "walkthrough beat 3, Nov 14" },
  { id: "tag-speaker", who: "tag", text: "Speaker", status: "approved", source: "Brian 2026-11-23: 1A / 2B" },
  { id: "cue-tap", who: "cue", text: "tap ▸", status: "approved", source: "Brian 2026-11-23: 1A / 2B" },
]);

/** The words of one line, by id. Throws on an unknown id, so a typo cannot show empty words. */
export function line(id) {
  const l = MORNING_LINES.find((x) => x.id === id);
  if (!l) throw new Error(`no morning line ${id}`);
  return l.text;
}
