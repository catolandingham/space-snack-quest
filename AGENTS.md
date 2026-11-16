# Space Snack Quest

New here? Read `docs/START-HERE.md`: what matters now, and the loop to follow. Every agent reads `CLAUDE.md` first. Locked room art is `docs/locked-rooms/README.md`.

Do not redraw a room freehand, and do not change these files, without Brian's yes and a new locked version.

Mops's beard is his mop; no separate mop prop.

Do not replace or restyle a locked picture. Any visual change needs Brian's approval first.

## Handover note

Every pull request and every report uses `docs/HANDOVER-TEMPLATE.md`: PASSED, FAILED, NOT ASSESSED (with why), and GUESSED. Anything not checked is NOT ASSESSED, never passed. End with "Not yet played by a person" unless `QA-LOG.md` covers this exact commit.

## Section reading

Long docs carry a section index at the top (`docs/DECISIONS.md`, `docs/CH1-LINES-FOR-BRIAN.md`, `docs/MASTER-BACKLOG.md`, `docs/STATE.md`, `docs/CH1-STORY-WALKTHROUGH.md`). Read the index, then only the section you need: `node scripts/md-section.mjs extract <file> "<heading>"`. Do not read one of these files whole unless Brian asks.

## Tuning pins

`docs/TUNING-PINS.json` lists the approved numbers. Changing a pin needs Brian's written yes in the pull request, and the pin edit must be called out in the PR body. `tests/tuning-pins.mjs` fails if a pin's value changes or disappears.
