# Phase 2 lines for Brian

Every new or changed thing the player reads or sees in Phase 2 (branch `phase-2-structure`), listed so you can say yes or change it before the merge. Same format as `docs/PHASE-1-LINES-FOR-BRIAN.md`: each row gives where it shows, the words in the game now, and one other way to say it.

To change a line: edit the "In the game now" words in this file and say so in the pull request. An agent will copy your words into `src/game/` and the tests (the tests read this file).

Tasks T13 to T16 change no words and nothing the player sees: T13 and T14 are tests, T15 removed code nothing could reach (proved by `tools/equivalence.mjs`), and T16 split the source into files.

## T17. The glowing ring sits exactly where the action works

No new words. What changed on screen: every glowing ring is now drawn from the same numbers that decide where the action works. A ring used to be a box drawn around the thing (the counter, the door, the crate), typed in by hand and separate from the range where the button lights up. Now each action is one entry ("spot") with its place on the floor, and the ring is that place: a glowing circle (or a strip, for things on a wall) on the floor where the player has to stand. Stand anywhere inside the ring and the button lights up; step out of it and it goes dark. A bouncing arrow sits over the ring.

No range changed: every spot keeps the exact distance the game used before. Where the old ring and the real range disagreed, the range the game used wins and the ring moved to it. These are the places where the ring was pointing somewhere the action did not work, or did not show at all:

| # | Where | Before | Now |
| --- | --- | --- | --- |
| 17.1 | Kitchen dish rack (Chapter 2, wash1 and wash5) | The "rail" ring was switched on but never drawn, so the dish rack never glowed. | It glows: a circle on the floor in front of the rack, where GRAB · dish works. |
| 17.2 | Phobos pad, Zip (Chapter 3, P2) | The ring followed Zip as he walked around, but ASK only works near his pretzel stand. | The ring sits by the stand, where ASK works. |
| 17.3 | Scanner gate (Chapter 1, S11, door open) | The ring was the whole tall door frame. The scanner only fires when Squatch's feet are within 50 pixels of its middle. | A small circle on the floor in the gate. |
| 17.4 | TV in the closet (Chapter 1, O7) | Box around the TV on the wall. WATCH works on the floor in front of it. | Circle on the floor in front of the TV. |
| 17.5 | Mops' lunch on the shelf (Chapter 1, S1) | Box around the lunch on the high shelf. GRAB works on the floor below it. | Circle on the floor below the shelf. |
| 17.6 | The diner counter (Chapter 2, g4) | One box for both ASK · Gloop and BUY · soup 30. | The circle is a little bigger for ASK · Gloop (90 pixels) than for BUY · soup 30 (80 pixels), because those were the real ranges. |
| 17.7 | Gas pump nozzle and pump (Chapter 2) | Ring code for "nozzle" and "pump" that nothing ever switched on. | Removed. |
| 17.8 | Gallery photos and badge (Chapter 1, S2), plaque and poster (S6), schedule (S1) | A small box on the picture, shown only when the player stood close. | The strip or circle of floor under the picture, shown the same way (only when the player stands in it). |

Glows that are not rings stay as they were. A line that talks about something makes it glow (your rule 4), even when there is nothing to press: the mop bot and the ship's hull during a cutscene, the trash can and the vent while Mops explains the torn slip, the gift on the closet floor (GRAB works anywhere there), and the terminal while Squatch signs. These are now called "story pointers" in the code (`pointer` in `src/game/00-core.js`). A story pointer never marks where an action works: when an action with the same name can be used, its ring is drawn instead.

## Not finished

(Filled in as tasks finish.)

## Also changed

- Chapter 1, S9: the PULL label over the airlock lever was drawn without the hall camera, so it sat in the wrong place once the hall had scrolled. It now sits over the lever.
- Chapter 1, S6: the gallery wall's LOOK has a hole near the manager's terminal (it always had; that is where nothing is offered). Its ring, if it ever glowed, would not show the hole. Nothing switches that ring on today.
