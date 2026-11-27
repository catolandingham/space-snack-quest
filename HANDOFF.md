# Handoff: feat/ch1-physics (2026-11-27)

The review behind this work: `/private/tmp/claude-502/-Users-brianhowe-Code/c66c2c5a-0e97-42b2-8633-d2705d10ae0f/scratchpad/review-nov27/physics-review.md`.

## Done (pushed)
- `src/modules/room-model.js`: one room model. It holds:
  - `roomWaypoint`, called from the engine's `step` in `15-ch1-scene1.js`. Every scripted step of Squatch and Mops goes round the room's solids. A walk whose straight line is clear stays straight.
  - `stepRound` for module movers. The alarm's runner uses it now (`party-alarm.js` `witnessStep`).
  - Walker widths (`bodyExtra`, Mops only).
  - The pushed crate: `setCarry` (one side only), `addKeeper` and `afterMove` (called from `50-story-frame.js` j6 after the step and turn), and `boxHit`.
  - Home depth: `HOME_BASELINES`, with `homeDepthItems` in `60-frame-draw.js` X2.
  - Highlights: `peopleBoxesNow` is the default `avoid` for `escape-art.js` `markBox`. Close-ups and held things pass `[]`.
  - The record: `physicsLog`, `physicsNow`, `addMovers`.
- `src/game` changes only in place. `tests/game-no-growth.mjs` passes.
- The night bay alarm place has `BAY_SOLIDS`, so the walkway counts (`evening.js`).
- 36b: Mops's follow spot comes from `freeSpot` (`loading-bay.js`).
- Pickup:
  - The crate is one size (`crateK`; home uses home's scale of 3) and is solid.
  - `pushTo` is now the mail room's opening (640, 462). The crate then slides into its place in the row (`PK_SLIDE`).
  - The hallway robot is solid on the push and is drawn back to front with the crate.
- The hallway office door slides its own grey leaves, cut from the locked picture (`loading-bay-art.js`). This is a placeholder for Brian's yes.
- `tests/room-physics.mjs`. It was run once on the old build: the home pixel check gives 0 there.
- `tests/loading-bay.mjs`: the walkby jump gets 60 ticks, because its walk out now goes round the cargo.
- Videos and stills are in `/Users/brianhowe/Code/space-snack-quest/tests/out/for-brian-2026-11-28/physics/`. They come from commit 5db8296, before the robot draw-order tweak.

## Left
1. Route the module robots' own moves through `stepRound`. Today they follow corner lists:
   - pickup `roll`
   - loading-bay `moveTo` and its patrol
   - the escape's night robot
   - evening `robotTick`

   Register them with `addMovers` so `physicsNow` checks them too. Careful: robots ride onto the scanner walkway on purpose, so give each one the solids for its own route, not the people's list.
2. The pushed crate is drawn after the people in the hall and the hallway, which the older program draws. A guest standing in front of the crate (feet lower on the screen) is drawn under it. Fix: add the crate as a depth item in the older program's people sort, or redraw the people in front of it.
3. `ch1-kid-play` timed out once in the full run (901 s, on night one at home: "go to sleep in your bed"). Three other worktrees were running their full suites at the same time. Rerun it alone, and compare with the base (68350d3) before blaming the physics.
4. The 13:40 highlight in the vent room has no still. The code passes Mops's box. Check it with a still, and add it to the test.
5. Office sizes (r5 15:13): the sizes are pinned (TUNING-PINS `squatch-of-adult`). This is a question for Brian, not a code change.
6. The UPS man appearing (r6 9:15) belongs to the pickup builder (topic F).
7. Merge note: the bay builder also owns the r5 3:58 door. Keep one version of `drawOfficeOpen`.
