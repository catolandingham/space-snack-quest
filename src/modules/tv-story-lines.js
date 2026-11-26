/**
 * Every word of the TV story (Chapter 1, beat 20: why Squatch has to hide), in the order a player meets them.
 * Brian brought the old Wookiee picture story back on 2026-11-25 (Snack Quest Chat, "1"), "the old drawings and
 * captions as they were": the words are copied word for word from commit 71ec66e (2026-11-02), the story the game
 * played on the TV before the redesigned Chapter 1. ("Wookie" in the tour caption is the old spelling, kept.)
 *   id      the line's name in the code and in tests/tv-story.mjs
 *   who     "card" (a full dark card), "caption" (the white box under a picture), "tourist" / "official" (a speech
 *           bubble in the picture), "tag" (the name over a bubble), "sign" (words painted on a thing), "label"
 *           (the corner mark of every picture)
 *   text    the words, exactly as shown
 *   status  "approved" (Brian's yes, `source` says where)
 *   source  where the words and the yes came from
 */
const SOURCE = "Old story, commit 71ec66e (2026-11-02); brought back by Brian 2026-11-25, Snack Quest Chat";

export const TV_STORY_LINES = Object.freeze(
  [
    { id: "card-years-ago", who: "card", text: "Years ago, on Stormtop..." },
    { id: "label-years-ago", who: "label", text: "YEARS AGO" },
    { id: "cap-tour", who: "caption", text: "A Wookie tour group came to visit Stormtop." },
    { id: "cap-shed", who: "caption", text: "They shed. A LOT." },
    { id: "sign-scrubber", who: "sign", text: "AIR SCRUBBER" },
    { id: "cap-clog", who: "caption", text: "The fur clogged the air scrubbers. Everyone gasped for air!" },
    { id: "tag-tourist", who: "tag", text: "Tourist" },
    { id: "tourist-gasp", who: "tourist", text: "*gasp*" },
    { id: "sign-tours", who: "sign", text: "TOURS" },
    { id: "tag-official", who: "tag", text: "Station Official" },
    { id: "official-no-fur", who: "official", text: "Nobody can live outside. The scrubbers keep us breathing. NO FUR." },
    { id: "card-now", who: "card", text: "Now" },
  ].map((l) => Object.freeze({ ...l, status: "approved", source: SOURCE })),
);

/** The words of one line, by id. Throws on an unknown id, so a typo cannot show empty words. */
export function tvLine(id) {
  const l = TV_STORY_LINES.find((x) => x.id === id);
  if (!l) throw new Error(`no TV story line ${id}`);
  return l.text;
}
