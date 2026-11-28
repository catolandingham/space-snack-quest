# Handoff: feat/ch1-r8-all, round 8 combined (2026-11-27)

Draft PR into feat/ch1-complete, for Brian's phone test. SSQ_PORT_OFFSET=1600. It joins #103 (fixes), #104 (art A), #105 (art B) with merge commits and applies Brian's yeses of 2026-11-27 (DECISIONS.md, "Round 8: final art approved, and one scale per room turned on").

## Done
- Every round 8 drawing is final art (sheets 1 and 2, "Yes, all of it"); after the snip the switch card's and HUD face's Mops show the snipped beard (mops-face.js).
- One scale per room is on (ROOM_SCALE_ON = true). Pins adult-door-share and hall-bigger retired; room-scale-table and room-scale-on added.
- With the table on: Mops at home is wl (3) in every scene (moDrawScale); the pickup crate keeps its size (crateK measured against doorAdultPx("closet")); people-scale and canvas-text measure the table.
- Pickup day's crayon close-up draws evening-art.js drawCrayonDrawing.
- The cabinet cake's ink edge was fixed in #104's art (kept as merged).
- The escape's walk to the bar: Mops at the counter's top end stands at its front line, drawn in front by the feet rule; looked at in one still, no change.

## Left
- Brian plays the build on his phone; merge only on his "merge" in the PR.
- index.html loads music/, sounds/ (sounds/voices/), docs/locked-rooms/ and docs/approved-art/guests/ by relative paths: a published copy needs those folders beside it.

## Gotchas
- The kid robot's 600 s per part is real time; a busy machine (several suites at once) makes parts slower.
- The room table is read live by adultPxFor, but the hall's sizes in the older program (HALL_ADULT_PX) are fixed at load: showRoomScaleTable(false) at run time does not fully undo the hall.
