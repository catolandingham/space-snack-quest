/**
 * Every word Squatch's home-alone morning shows (after Mops leaves, before "That evening…"), in the order a
 * player meets them. docs/HOME-ALONE-LINES-FOR-BRIAN.md is the same list for Brian, numbered;
 * tests/home-alone-lines.mjs fails if the two ever differ. The home-alone code (home-alone.js and
 * homework-cutaway.js) reads its words only from here.
 *   id      the line's name in the code and in the tests
 *   who     "chip" (the goal chip), "button" (the big action button), "sq" (Squatch says it) or "sheet"
 *           (written on the homework sheet in the cutaway)
 *   text    the words, exactly as shown
 *   status  "approved" (Brian's yes, `source` says where) or "needs-yes" (new; not final until he says yes)
 *   source  where the words or the yes came from
 * The calendar's words ("LOOK · calendar" and the close-up) are the older program's, unchanged; the
 * "That evening…" card is the morning's (morning-lines.js). There is no "tap ▸" cue (Brian 18a): NEXT only.
 */
export const HOME_ALONE_LINES = Object.freeze([
  { id: "chip-homework", who: "chip", text: "Squatch: do your homework", status: "approved", source: "Brian 2026-11-23: 6A" },
  { id: "button-homework", who: "button", text: "DO · homework", status: "approved", source: "Brian Nov 16, 4:05 PM PT (CH1-LINES-FOR-BRIAN.md, Homework desk)" },
  { id: "button-closet", who: "button", text: "OPEN · closet", status: "approved", source: "Brian 2026-11-23: 6A" },
  { id: "sq-closet", who: "sq", text: "Mops's costumes. And my Guardian Box.", status: "approved", source: "walkthrough beat 1, approved room looks" },
  { id: "button-bed", who: "button", text: "FLOP · bed", status: "approved", source: "Brian 2026-11-23: 6A" },
  { id: "sq-bed", who: "sq", text: "Not sleepy anymore.", status: "approved", source: "walkthrough beat 1, approved room looks" },
  { id: "sheet-heading", who: "sheet", text: "I SWEATY", status: "approved", source: "G 567 (I sweaty); okayed G 579" },
  { id: "sheet-name", who: "sheet", text: "Name: Squatch", status: "approved", source: "okayed G 579" },
  { id: "sheet-subject", who: "sheet", text: "SPACE MATH", status: "approved", source: "Brian 2026-11-23: 13A (Good with the 3 words on the homework sheet)" },
  { id: "sheet-sum", who: "sheet", text: "2 + 2 = 4 Moon Pies", status: "approved", source: "Brian 2026-11-23: 13A (Good with the 3 words on the homework sheet)" },
  { id: "sheet-take", who: "sheet", text: "4 − 4 = yum!", status: "approved", source: "Brian 2026-11-23: 13A (Good with the 3 words on the homework sheet)" },
]);

/** The words of one line, by id. Throws on an unknown id, so a typo cannot show empty words. */
export function homeLine(id) {
  const l = HOME_ALONE_LINES.find((x) => x.id === id);
  if (!l) throw new Error(`no home-alone line ${id}`);
  return l.text;
}
