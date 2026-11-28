/**
 * The station's snack, named in one place (Brian, 2026-11-26, question 86: the old name becomes this one
 * everywhere). Every lines file, drawing and test spells the name from here; tests/snack-name.mjs fails if the name
 * is spelled anywhere else in src/, tests/ or tools/.
 *   SNACK.name    "Stars Cakes" (sentence text, more than one)
 *   SNACK.one     "Stars Cake" (one of them)
 *   SNACK.NAME    the name in capitals, as on a crate or a sign
 *   SNACK.ONE     one, in capitals
 * The older program (src/game/) reads these through the bridge, guarded: window.SSQ.snack("name").
 *
 * Squatch's own crate bed is his family's crate (docs/moonpie-thread spec, Brian 2026-11-26): its stamp is worn, the
 * first letter scraped off, so it reads "_ARS CAKES", and his old crayon fills the gap the way he has always read
 * it. FAMILY.NAME is what the stamp said before it was scraped (the brochure's cake box has it; FAMILY.name as spoken);
 * FAMILY.FADED is what is left; FAMILY.CRAYON is the two letters he wrote in the gap, so CRAYON + FADED reads as the
 * station's name. The family's name is made from the station's (one letter changed), so the name is still spelled
 * only here.
 */
const NAME = "Stars Cakes";

export const SNACK = Object.freeze({
  name: NAME,
  one: NAME.replace(/s$/, ""),
  NAME: NAME.toUpperCase(),
  ONE: NAME.replace(/s$/, "").toUpperCase(),
});

const FAMILY_NAME = ("M" + NAME.slice(2)).toUpperCase();
export const FAMILY = Object.freeze({
  NAME: FAMILY_NAME,
  // (as people say it: the family at the big window, and Mops, in the evening of Day 2; round 7, 2026-11-27)
  name: "M" + NAME.slice(2),
  FADED: FAMILY_NAME.slice(1),
  CRAYON: SNACK.NAME.slice(0, SNACK.NAME.length - FAMILY_NAME.length + 1),
});

/**
 * One form of the name, for the older program: "name", "one", "NAME" or "ONE". An unknown form throws, so a typo
 * cannot show empty words.
 */
export function snackWord(form) {
  // ("family", "FAMILY": his family's cakes, the stand's name; Brian 2026-11-27, question 120: the stand sells only these)
  if (form === "family") return FAMILY.name;
  if (form === "FAMILY") return FAMILY.NAME;
  if (!Object.prototype.hasOwnProperty.call(SNACK, form)) throw new Error(`no snack form ${form}`);
  return SNACK[form];
}

/**
 * The words on the two kinds of crate (shown, not spoken). Status as in every lines file: "approved" or
 * "needs-yes". docs/CH1-LINES-FOR-BRIAN.md lists them for Brian ("The snack's name on crates").
 */
export const SNACK_LINES = Object.freeze([
  {
    id: "stamp-station",
    who: "crate",
    text: SNACK.NAME,
    status: "approved",
    source: "Brian 2026-11-26, question 86: the station's snack is Stars Cakes; thin blue letters with a star (the spec's 2.3 and 2.12)",
  },
  {
    id: "tin-label",
    who: "tin",
    text: SNACK.name,
    status: "approved",
    source: "Brian 2026-11-26, question 86: the snack tin painted on the party hall's snack bar (docs/locked-rooms/hall-room-empty-v2.png) had the old name on its lid",
  },
  {
    id: "stamp-family-faded",
    who: "crate",
    text: "_" + FAMILY.FADED,
    status: "approved",
    source: "Brian 2026-11-26 (the notes page, Mars Cakes thread): \"the box he came in is faded, so all you can see is R's Cakes, A-R-S\"",
  },
  {
    id: "stamp-family-crayon",
    who: "crayon",
    text: FAMILY.CRAYON,
    status: "needs-yes",
    source: "NEW, the spec's 2.12 (a call made without a question): Squatch's crayon in the scraped gap, years ago",
  },
  {
    id: "chart-title",
    who: "crayon",
    text: SNACK.NAME,
    status: "needs-yes",
    source: "Brian, story pass 28-52, E2/E4: the crayon chart of kinds tried over his bed (cake-chart.js), its title",
  },
]);

/** The words of one snack line, by id. Throws on an unknown id. */
export function snackLine(id) {
  const l = SNACK_LINES.find((x) => x.id === id);
  if (!l) throw new Error(`no snack line ${id}`);
  return l.text;
}
