/**
 * Every word of the Credits screen (Brian 2026-11-26, #31: "a small Credits screen from the title screen"), in the
 * order shown. The credits say what music/CREDITS.txt and sounds/CREDITS.txt say (the CC BY tracks word for word, as
 * their licence asks). tests/credits.mjs checks the screen shows every line and that every music file is credited.
 *   id      the line's name in the code and in the tests
 *   who     "button" (on the title screen), "title", "head" (a heading) or "credit"
 *   text    the words, exactly as shown
 *   status  "needs-yes": Brian asked for the screen; its exact words wait for his yes
 */
const SOURCE = "Brian 2026-11-26 (#31): a small Credits screen from the title screen; the wording is the credit files', waiting for his yes";
const MACLEOD = ["Carefree", "Der Kleber Sting", "Funky Chunk", "Lobby Time", "Morning", "Odyssey", "Rainbows", "Reawakening", "Run Amok", "Sneaky Snitch"];

export const CREDITS_LINES = Object.freeze(
  [
    { id: "button-credits", who: "button", text: "Credits" },
    { id: "title", who: "title", text: "Credits" },
    { id: "head-music", who: "head", text: "Music" },
    { id: "theme", who: "credit", text: "Main theme: Joe's song, used with permission" },
    { id: "brian-songs", who: "credit", text: "Floating in Space and Stormtop-Sylvania: Brian's songs, made with Suno" },
    // (one line for all ten, so the screen fits a phone: each track by name, as the licence asks)
    { id: "macleod", who: "credit", text: MACLEOD.map((t) => `"${t}"`).join(", ") + " Kevin MacLeod (incompetech.com)" },
    { id: "cc-by", who: "credit", text: "Licensed under Creative Commons: By Attribution 4.0 License, http://creativecommons.org/licenses/by/4.0/" },
    { id: "hum", who: "credit", text: "Mops's hum: recorded for the game by a family member, used with permission" },
    { id: "head-sounds", who: "head", text: "Sounds" },
    { id: "kenney", who: "credit", text: "\"Impact Sounds\" by Kenney (www.kenney.nl), CC0" },
    { id: "goat", who: "credit", text: "Goat bleat: \"Herd of goats bleating\" by stephan, Wikimedia Commons, public domain" },
    { id: "crowd", who: "credit", text: "Party crowd: \"Crowd of 50-60 People #1\" by Joseph SARDIN, BigSoundBank.com, CC0" },
    { id: "voices", who: "credit", text: "Voices: \"Dialog vocal samples\", OpenGameArt.org, CC0" },
  ].map((l) => Object.freeze({ ...l, status: "needs-yes", source: SOURCE })),
);
/** The Kevin MacLeod tracks credited (tests check each is in music/CREDITS.txt). */
export const MACLEOD_TRACKS = Object.freeze(MACLEOD);

/** The words of one line, by id. Throws on an unknown id. */
export function creditsLine(id) {
  const l = CREDITS_LINES.find((x) => x.id === id);
  if (!l) throw new Error(`no credits line ${id}`);
  return l.text;
}
