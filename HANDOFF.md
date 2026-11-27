# Handoff: round 7, the evening builder (2026-11-27)

Branch `feat/ch1-r7-evening`, draft PR #100 against `feat/ch1-pickup-day`. Do not merge until Brian says yes in the PR.

## Done (each its own commit, pushed)
- Topic B: the brochure scene as Mops, 36b to 39 (`evening.js`, `evening-lines.js`, `evening-place.js`, `evening-art.js`, `evening-pictures.js`; 36b's hand-over in `loading-bay.js`).
- Topic C: HOLD UP · brochure as one close-up, no crayon ST (`crate-stamp.js` STAMP_CRAYON), the chart a picture only (`cake-chart.js`), the fight ending on Squatch's line then "Bed." (question 122 B).
- Topic H: the hearts rule (`mops-hearts.js`) in every heart drawing.
- Topic I: Mops asleep on his side, head on his bucket (`mops-asleep-art.js` MOPS_SLEEP), Day 1, the morning after, the evening.
- Question 120: no "pancake" in any chapter. The two vent-desk lines.
- The reviewer's two MUST-FIXes and five SHOULD-FIXes. README, backlog, DECISIONS.
- Videos and stills: `/Users/brianhowe/Code/space-snack-quest/tests/out/for-brian-2026-11-28/evening/`.

## Left
- `tests/ch1-kid-play.mjs` fails "no not-finished": the kid robot runs out of 900 s in beat 44. It gets through this branch's beats. It wanders about 25 s each time at "go to sleep in your bed" (beats 40 and 42); not looked into. On the base it stops at beat 55.
- The full `npm test` was run once at 2554bcf (119 of 122; the other two passed alone). It was not rerun after the last commit (the alarm chip), only `evening`, `every-goal-has-target`, `party-cleanup`.
- Reviewer SHOULD-FIX 6, for Brian: the wording of the pancake swaps in Chapters 2 to 4 (listed in the PR).
- `docs/CH1-LINES-FOR-BRIAN.md` still lists the old brochure lines.
- Not built on purpose (other builders): beat 37's photo wall, night one (42), beat 28's "I hope it's the kind we've been looking for!", pickup day.

## Gotchas
- The snack's and the family's names may be spelled only in `src/modules/snack-name.js` (`tests/snack-name.mjs` scans src, tests and tools). Use FAMILY.name, FAMILY.NAME, or `window.SSQ.snack("family")` in `src/game`.
- `evening.js` and `loading-bay.js` are shared with the bay builder: expect merge conflicts near 36b's `startHallSneak`, `spots()` and `highlightNow()`, and in `tests/loading-bay.mjs` and `tests/evening.mjs`.
- While the player is Mops (`greet`, `ask`), evening.js keeps `driving = "mops"` and gives Squatch back in `tick` if the evening goes away. Mops is held within STORM.mopsRoam of the bar's front.
- The worktree's `node_modules` is a link to `../space-snack-quest/node_modules`.
- Four builders share the machine: a full run took about 80 minutes; a suite can fail from load and pass alone.
