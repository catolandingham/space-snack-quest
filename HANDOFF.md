# Handoff: feat/ch1-r8-fixes, round 8 fixes (2026-11-27)

Draft PR #103 into feat/ch1-complete. SSQ_PORT_OFFSET=1300. Finish plan: space-snack-quest-private/story-passes/ch1-finish-plan-2026-11-27.md.

## Done (pushed)
- Kid robot stops fixed at their cause (README entry "round 8, fixes"); kid-play is four parts: day1, day2, escape, pickup.
- Module robots step through room-model.js robotStep; physicsNow checks them; the kid robot reports anyone in a solid.
- Vent desk painted over Mops (VENT_BASELINES); followGap and followSpot for Mops following.
- One scale per room: src/modules/room-scale.js, OFF. Needs Brian's written yes in PR #103 (pins adult-door-share, hall-bigger).
- DECISIONS: the counter robot's glance toward the doorway is decided.

## Left
1. Art builder: the cabinet cake's faint ink edge, escape-office-art.js drawerPanel (outline stroked before the bite is cut).
2. The scale table, if Brian says yes: turn ROOM_SCALE_ON on, update the two pins, check the closet and vent fixed scales.
3. In the party hall during the escape's walk to the bar, Mops at the strip above the counter's end looked drawn over the counter (seen once in a still, not checked).

## Gotchas
- The kid robot's 600 s per part is real time; a busy machine (several suites at once) makes parts slower.
