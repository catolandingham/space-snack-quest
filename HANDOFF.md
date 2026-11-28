# Handoff: feat/ch1-complete, the Chapter 1 join (2026-11-27)

To-do list: /Users/brianhowe/Code/space-snack-quest-private/story-passes/ch1-finish-plan-2026-11-27.md. SSQ_PORT_OFFSET=1200.

## Done (pushed)
- Merges, in order, merge commits: #101 physics, #98 bay, #100 evening, #99 pickup. Resolutions are in each merge commit's message.
- #110 (no words beside outlined things, party included), beat 28's doorway-looking counter watcher, story hearts to 3, hall guests in front of the pushed crate, FOR PICKUP. from crate-empty, the robot reads TO: MARS., one camera, kid-play split by day, the dead pkTwo wait removed, CH1-LINES brochure rows refreshed, chapter-showing tool and the whole-chapter video.
- Full npm test (once): 120 of 123 passed; snack-name and section-index fixed after; ch1-kid-play fails (below).

## Left
1. Scale people and room together (Brian, finish plan): one scale per room from the room's real size; home today draws people at a fixed 3 (`00-core.js wl`, `room-model.js peopleBoxesNow`, `pickup.js crateK`). The door-based rule (`room-sizes.js`) gives home 1.5, half of today, though Brian expects people bigger at home: the home picture's 129 px right-wall opening is not a fair yardstick. Needs a per-room table judged from stills at 375 px. Pins `adult-door-share` and `hall-bigger` change: call them out in the PR and get Brian's written yes there.
2. Module robots' own patrols through room-model.js `stepRound` and `addMovers`: pickup `roll`, loading-bay `moveTo` and its patrol, the escape's night robot, evening `robotTick` (robots ride the scanner walkway on purpose: give each its own solids).
3. Mops drawn on top of the vent desk (escape, beat 48); Squatch and Mops overlap coming home at night (beat 52); the cabinet cake's faint ink edge.
4. ch1-kid-play: day1 passes (352 s). day2 runs out of time at "Squatch: sneak to the big vent" and once stood in furniture at QB 858,329 / 870,331 (89 s). pickup stops "stuck" at "Mops: push the crate to the mail room" in the hall. Logs: tests/out/kid-play/<part>/.
5. canvas-text passed in the full run (the base failures did not recur); party-round4 passed in the full run.
6. Stills not looked at closely: the counter watcher's cone turned toward the doorway, the camera on pickup day (pick from whole-chapter/stills/extras).

## Gotchas
- tools/day2-showing.mjs is stale for 36b and the storm; tools/chapter-showing.mjs is current.
- `git stash` during a merge carries the merge's files; do not.
