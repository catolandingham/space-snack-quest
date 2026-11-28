# Phase 2 lines for Brian

> **The snack is now Stars Cakes** (Brian, 2026-11-26, question 86). Dated entries below keep the old name as it was said then.

Every new or changed thing the player reads or sees in Phase 2 (branch `phase-2-structure`), listed so you can say yes or change it before the merge. Same format as `docs/PHASE-1-LINES-FOR-BRIAN.md`: each row gives where it shows, the words in the game now, and one other way to say it.

To change a line: edit the "In the game now" words in this file and say so in the pull request. An agent will copy your words into `src/game/` and the tests (the tests read this file).

Tasks T13 to T16 change no words and nothing the player sees: T13 and T14 are tests, T15 removed code nothing could reach (proved by `tools/equivalence.mjs`), and T16 split the source into files.

## T17. The glowing ring sits exactly where the action works

No new words. What changed on screen: every glowing ring is now drawn from the same numbers that decide where the action works. A ring used to be a box drawn around the thing (the counter, the door, the crate), typed in by hand and separate from the range where the button lights up. Now each action is one entry ("spot") with its place on the floor, and the ring is that place: a glowing circle (or a strip, for things on a wall) on the floor where the player has to stand. Stand anywhere inside the ring and the button lights up; step out of it and it goes dark. A bouncing arrow sits over the ring.

No range changed: every spot keeps the exact distance the game used before. `tests/data/ranges.json` holds every spot's center and radius (or box) in the 77 test states, made from this branch. `tests/ring-equals-trigger.mjs` fails if any of them changes. After a deliberate change: `UPDATE_RANGES=1 node tests/ring-equals-trigger.mjs`, and say so in the pull request. Where the old ring and the real range disagreed, the range the game used wins and the ring moved to it. These are the places where the ring was pointing somewhere the action did not work, or did not show at all:

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

## T18. Every prompt in Chapters 1, 3 and 4 says where and what

### Goal chips

The chip is the yellow goal line at the top of the picture. Chapters 1, 3 and 4 now set it the way Chapter 2 does: from one table per chapter (`CH1_CHIPS`, `CH3_CHIPS`, `CH4_CHIPS`), read every frame from the scene and who the player is, and hidden while a story bubble is up. Every line names who acts. Following your chip rule, the first time a mechanic appears the chip names the step (singing in O2a, hiding in O4 and O5, singing a bot over from a hiding spot in S9, the first switch in S9, the goat costume in S11, the mirrors in P3); after that it names only the goal of the moment, never the hide or the stop (S4, S5, S11, and the singing in Chapters 3 and 4, the second switch in S10 and P3). Chips that were there before keep their words where they named a goal, with "Squatch:" or "Mops:" added; the ones that named no goal ("What's that noise?", "Hug!", "Dance!", "Mops is gone") are replaced or dropped. The hall alarm's "Hide!" chip is unchanged.

The code in backticks is the chip key the game uses (for the tests).

| # | When it shows | In the game now | Another way to say it |
| --- | --- | --- | --- |
| 18.1 | Chapter 1, `O1`: The opening, in the closet, before Squatch has walked | Squatch: walk around the room | Squatch: take a walk (was "Walk around") |
| 18.2 | Chapter 1, `O2a`: Mops hums; the SING button is up | Squatch: sing along with Mops | Squatch: sing with Mops |
| 18.3 | Chapter 1, `O3`: A noise outside the closet door (was "What's that noise?") | Squatch: peek out the door | Squatch: see what the noise is |
| 18.4 | Chapter 1, `O3b`: After the peek | Squatch: sneak out the door | Squatch: go out the door |
| 18.5 | Chapter 1, `O4`: The lobby, while security is coming after a sighting or the vent alarm (Brian's wording, 2026-11-07; since the Chapter 1 pass nobody screams "A WOOKIE!" here, see `docs/CHAPTER-1-LINES-FOR-BRIAN.md`) | Squatch: run back to the closet! | Squatch: hide, quick! (the earlier wording) |
| 18.6 | Chapter 1, `O5`: Back in the closet, the bot is coming | Squatch: hide under the bed | Squatch: get under the bed |
| 18.7 | Chapter 1, `O7`: The TV in the closet | Squatch: watch the TV | Squatch: turn on the TV |
| 18.8 | Chapter 1, `O8`: Bedtime | Squatch: go to sleep in your bed | Squatch: go to bed |
| 18.9 | Chapter 1, `O8:gift`: Morning, a gift is on the floor | Squatch: grab the gift | Squatch: pick up the gift |
| 18.10 | Chapter 1, `O9`: The note and the rocket (Brian's wording, 2026-11-07) | Squatch: put the note and the rock in the box | Squatch: put them in your Guardian Box (the earlier wording) |
| 18.11 | Chapter 1, `S1`: S1 and S1L: Mops forgot his lunch (was "Bring Mops his lunch") | Squatch: bring Mops his lunch | Squatch: take Mops his lunch |
| 18.12 | Chapter 1, `S2`: S2: Mops is in the hall | Squatch: give Mops his lunch | Squatch: hand Mops his lunch |
| 18.13 | Chapter 1, `S4`: S4: the Stars Cakes crate (Brian's wording, 2026-11-07) | Squatch: hide from the bot in the crate | Squatch: get a Moon Pie (the earlier wording) |
| 18.14 | Chapter 1, `S4:in`: S4: Squatch is in the crate | Squatch: stay hidden in the crate | Squatch: keep still in the crate |
| 18.15 | Chapter 1, `S5`: S5: the window, before the visitors talk (goal only) | Squatch: listen to the visitors | Squatch: hear what the visitors say |
| 18.16 | Chapter 1, `S5:bro`: S5: the brochure is in the bin | Squatch: grab the brochure | Squatch: take the brochure |
| 18.17 | Chapter 1, `S6`: S6: Mops asks Squatch to come (was "Follow Mops") | Squatch: follow Mops | Squatch: go after Mops |
| 18.18 | Chapter 1, `S7`: S7: the MANAGER computer with its ORDER screen (was "Use the manager's terminal") | Squatch: use the manager's computer | Squatch: go to the MANAGER computer |
| 18.19 | Chapter 1, `S7b`: S7b: the order form is on the computer | Squatch: sign the order | Squatch: sign it |
| 18.20 | Chapter 1, `S9`: S9: Mops waits by the trash (Brian's wording, 2026-11-07) | Squatch: get ready to sing to the bot | Squatch: hide in the box (the earlier wording) |
| 18.21 | Chapter 1, `S9:hid`: S9: Squatch is in the box | Squatch: sing to bring the bot over | Squatch: sing so the bot comes |
| 18.22 | Chapter 1, `S9:sing`: S9: Squatch is singing (first time switching: the chip names the step). The picture button glows while Squatch sings | Squatch: tap Mops' picture | Squatch: tap Mops' face (Mops' own words) |
| 18.23 | Chapter 1, `S9:mops`: S9: the player is Mops | Mops: grab the slip from the trash | Mops: take the slip |
| 18.24 | Chapter 1, `S10`: S10: the vent | Squatch: squeeze into the vent | Squatch: crawl into the vent |
| 18.25 | Chapter 1, `S10:bumped`: S10: Squatch is too big | Squatch: let Mops try the vent | Squatch: switch to Mops |
| 18.26 | Chapter 1, `S10:mops`: S10: the player is Mops | Mops: squeeze into the vent | Mops: crawl into the vent |
| 18.27 | Chapter 1, `S10d`: S10d: inside the duct | Mops: grab the other half of the slip | Mops: find the other half |
| 18.28 | Chapter 1, `S10d:out`: S10d: Mops has the half | Mops: crawl back out | Mops: go back out |
| 18.29 | Chapter 1, `S11`: S11: the bot guards the door (goal only: hiding and singing were taught in S9) | Squatch: get the bot away from the door | Squatch: clear the bot from the door |
| 18.30 | Chapter 1, `S11:hid`: S11: Squatch is behind the plant (goal only, same line as 18.29) | Squatch: get the bot away from the door | Squatch: clear the bot from the door |
| 18.31 | Chapter 1, `S11:sing`: S11: Squatch is singing (goal only, same line as 18.29) | Squatch: get the bot away from the door | Squatch: clear the bot from the door |
| 18.32 | Chapter 1, `S11:mops`: S11: the player is Mops | Mops: type the code at the door | Mops: open the door with the code |
| 18.33 | Chapter 1, `S11:costume`: S11: the scanner said NO WOOKIES; Mops told him about the costume | Squatch: put on the goat costume | Squatch: get the goat costume |
| 18.34 | Chapter 1, `S11:gate`: S11: the door is open | Squatch: walk through the gate | Squatch: go through the scanner |
| 18.35 | Chapter 1, `S12`: S12: the hangar (was "Grab 3 snacks") | Squatch: grab 3 snacks | Squatch: pick 3 snacks |
| 18.36 | Chapter 1, `S12:ship`: S12: three snacks found | Squatch: get on the ship | Squatch: board the ship |
| 18.37 | Chapter 3, `p1`: P1: Mops said "Hide in a barrel" | Squatch: hide in a barrel | Squatch: get in a barrel |
| 18.38 | Chapter 3, `p2`: P2: the player is Mops, Zip is at his stand | Mops: ask Zip for a ride to Mars | Mops: ask Zip the way to Mars |
| 18.39 | Chapter 3, `p3`: P3: the temple; Mops said "Echo spot's over there" | Squatch: hide in the echo spot | Squatch: go to the echo spot |
| 18.40 | Chapter 3, `p3:hid`: P3: Squatch is in the echo spot (goal only) | Squatch: sing the rovers away from the mirrors | Squatch: get the rovers away from the mirrors |
| 18.41 | Chapter 3, `p3:sing`: P3: Squatch is singing (switching: goal only) | Squatch: let Mops turn the mirrors | Squatch: switch to Mops |
| 18.42 | Chapter 3, `p3:m1`: P3: the player is Mops (first mirrors: the chip names the step) | Mops: turn the first mirror | Mops: turn the mirror |
| 18.43 | Chapter 3, `p3:m2`: P3: the first mirror is turned | Mops: turn the second mirror | Mops: turn the other mirror |
| 18.44 | Chapter 3, `p3x`: P3: Zip has his map | Mops: go out the temple door | Mops: leave the temple |
| 18.45 | Chapter 3, `p4a`: P4: the rover is on the ramp | Squatch: get the rover off the ramp | Squatch: clear the rover off the ramp |
| 18.46 | Chapter 3, `p4a:sing`: P4: Squatch is singing (goal only, same line as 18.45) | Squatch: get the rover off the ramp | Squatch: clear the rover off the ramp |
| 18.47 | Chapter 3, `p4a:run`: P4: the rover is looking at the barrel | Squatch: run to the ship | Squatch: run for the ship! |
| 18.144 | Chapter 3, `p4a:board`: P4: Squatch is at the ramp and BOARD · ship is up | Squatch: get on board | Squatch: board the ship |
| 18.48 | Chapter 3, `p4b`: P4: Mops is floating away | Squatch: grab the rope from the cart | Squatch: get the rope |
| 18.49 | Chapter 3, `p4b:rope`: P4: Squatch has the rope | Squatch: throw the rope to Mops | Squatch: throw Mops the rope |
| 18.50 | Chapter 4, `m1`: M1: the Mars dock (was "Sneak to the gate") | Squatch: sneak to the gate | Squatch: get to the gate |
| 18.51 | Chapter 4, `m1:sing`: M1: Squatch is singing in the middle trash can (goal only, same line as 18.50) | Squatch: sneak to the gate | Squatch: get to the gate |
| 18.52 | Chapter 4, `m1:run`: M1: the bot is looking at the trash can | Squatch: run to the gate | Squatch: run for the gate! |
| 18.53 | Chapter 4, `m2`: M2: the pancake stand; the player is Mops | Mops: read the poster on the stand | Mops: look at the poster |
| 18.54 | Chapter 4, `m2:knock`: M2: Mops read the poster | Mops: knock on the door | Mops: knock |
| 18.55 | Chapter 4, `m2h`: M2: "Harry? It's you!" (was "Hug!") | Squatch: hug Mom and Dad | Squatch: hug your family |
| 18.56 | Chapter 4, `m3`: M3: the van (was "Tidy the van") | Mops: mop the van floor | Mops: clean the van |
| 18.57 | Chapter 4, `m3:seat`: M3: the floor is clean | Mops: look under the seat | Mops: check under the seat |
| 18.58 | Chapter 4, `m4a`: M4: inside, the searchlight sweeps past the window | Squatch: hide from the searchlight | Squatch: hide from the light |
| 18.59 | Chapter 4, `m4b`: M4: after dinner | Squatch: go out to the van | Squatch: go see Mops in the van |
| 18.60 | Chapter 4, `m4v`: M4: the van is empty | Squatch: look under the seat | Squatch: look for Mops |
| 18.61 | Chapter 4, `m5`: M5: the dock (was "Go get Mops") | Squatch: go get Mops | Squatch: find Mops |
| 18.62 | Chapter 4, `m5d`: M5: everyone is together (was "Dance!") | Squatch: dance with Mops | Squatch: dance! |

### Captions: "VERB · thing"

Every action in Chapters 1, 3 and 4 now has a thing, like Chapter 2. The big touch button and the small label drawn on the picture by the spot both read "VERB · thing". The verbs are the game's existing ones; the things are new. On a computer the old green VERB label is gone wherever the new label shows, so there is one label, not two. The label grows for long words and always stays on the picture.

| # | Where | In the game now | Another way to say it |
| --- | --- | --- | --- |
| 18.63 | Chapter 1, O2a: Mops hums | SING · song | SING · tune |
| 18.64 | Chapter 1, O3: the closet door | PEEK · door | PEEK · outside |
| 18.65 | Chapter 1, O3b and S1: the closet door | SNEAK OUT · door | SNEAK OUT · closet |
| 18.66 | Chapter 1, O4: the lobby, over the CLOSET sign | HIDE! · closet | HIDE! · run home |
| 18.67 | Chapter 1, O5: the bed | HIDE · under the bed | HIDE · bed |
| 18.68 | Chapter 1, O7: the TV | WATCH · TV | WATCH · show |
| 18.69 | Chapter 1, O8: the bed | SLEEP · bed | SLEEP · in bed |
| 18.70 | Chapter 1, O8: the gift on the floor | GRAB · gift | GRAB · present |
| 18.71 | Chapter 1, O9: the Guardian Box | OPEN · Guardian Box | OPEN · box |
| 18.72 | Chapter 1, S1: Mops' lunch on the shelf | GRAB · lunch | GRAB · lunchbox |
| 18.73 | Chapter 1, S1: the blue tin | OPEN · tin | OPEN · box |
| 18.74 | Chapter 1, S1: the mop bucket | PULL · bucket | PULL · mop bucket |
| 18.75 | Chapter 1, S1: the DELIVERY notice on the wall | LOOK · notice | LOOK · delivery list |
| 18.76 | Chapter 1, S1L, S6, S7: while hidden | LEAVE · hiding spot | LEAVE · plant |
| 18.77 | Chapter 1, S1L, S5, S6, S11: a plant | HIDE · plant | HIDE · behind plant |
| 18.78 | Chapter 1, S1L: the box on the deck; S9: the box | HIDE · box | HIDE · in box |
| 18.79 | Chapter 1, S2: photo 23 on the gallery wall | FIX · photo | FIX · crooked photo |
| 18.80 | Chapter 1, S2: the badge on the gallery wall | FLIP · badge | FLIP · frame |
| 18.81 | Chapter 1, S2: Mops | GIVE · lunch | GIVE · Mops his lunch |
| 18.82 | Chapter 1, S2 and S6: the gallery wall | LOOK · photos | LOOK · wall |
| 18.83 | Chapter 1, S4: the Stars Cakes crate | HIDE · crate | HIDE · in crate |
| 18.84 | Chapter 1, S4: inside the crate | LEAVE · crate | LEAVE · hiding spot |
| 18.85 | Chapter 1, S4: inside the crate | GRAB · Stars Cake | GRAB · pie |
| 18.86 | Chapter 1, S5: the brochure in the bin | GRAB · brochure | GRAB · paper |
| 18.87 | Chapter 1, S5: the brochure on the table | LOOK · brochure | LOOK · paper |
| 18.88 | Chapter 1, S6: the plaque | PULL · plaque | PULL · frame |
| 18.89 | Chapter 1, S6: the poster | UNROLL · poster | UNROLL · paper |
| 18.90 | Chapter 1, S6 and S7: the plaque, found | LOOK · plaque | LOOK · hairball |
| 18.91 | Chapter 1, S6 and S7: the poster, found | LOOK · poster | LOOK · WANTED poster |
| 18.92 | Chapter 1, S6 and S7: the trash can | PEEK · trash can | PEEK · trash |
| 18.93 | Chapter 1, S6 and S7: the vent | PEEK · vent | PEEK · grate |
| 18.94 | Chapter 1, S7: the MANAGER computer | USE · computer | USE · MANAGER computer |
| 18.95 | Chapter 1, S7b: the order form | SIGN · order | SIGN · form |
| 18.96 | Chapter 1, S9: the trash can (Mops); S10d: the slip in the duct | GRAB · slip | GRAB · paper |
| 18.97 | Chapter 1, S9: the AIRLOCK lever | PULL · airlock | PULL · lever |
| 18.98 | Chapter 1, S9 and S11: hidden in the box or behind the plant | SING · song | SING · tune |
| 18.99 | Chapter 1, S9 and S11: singing in the box or behind the plant | STOP · singing | STOP · song |
| 18.100 | Chapter 1, S10: the vent | SQUEEZE · vent | SQUEEZE · in |
| 18.101 | Chapter 1, S10d: the paper ball in the duct | UNFOLD · note | UNFOLD · paper |
| 18.102 | Chapter 1, S10d: the way back out of the duct (verb was OUT) | EXIT · duct | CRAWL · out |
| 18.103 | Chapter 1, S11: the wardrobe | WEAR · goat costume | WEAR · costume |
| 18.104 | Chapter 1, S11: the keypad (Mops) | TYPE · code | TYPE · numbers |
| 18.105 | Chapter 1, S12: the cooler with SPACE JUICE | GRAB · space juice | GRAB · juice |
| 18.106 | Chapter 1, S12: the cooler with COMET CRISPS | GRAB · comet crisps | GRAB · crisps |
| 18.107 | Chapter 1, S12: the cooler with ROCKET POPS | GRAB · rocket pops | GRAB · pops |
| 18.108 | Chapter 1, S12: the tarp | PULL · tarp | PULL · cover |
| 18.109 | Chapter 1, S12: under the tarp | GRAB · nachos | GRAB · Astro-Nachos |
| 18.110 | Chapter 1, S12: the crates | PUSH · crates | PUSH · boxes |
| 18.111 | Chapter 1, S12: behind the crates | GRAB · ice cream | GRAB · freeze-dried ice cream |
| 18.112 | Chapter 1, S12: the ship (unchanged) | BOARD · ship | (none) |
| 18.113 | Chapter 3, P1 and P4: the barrel | HIDE · barrel | HIDE · in barrel |
| 18.114 | Chapter 3, P3 and P4: hidden, at the barrel or the echo spot | SING · song | SING · tune |
| 18.115 | Chapter 3, P3 and P4: singing | STOP · singing | STOP · song |
| 18.116 | Chapter 3, P4: the ramp | BOARD · ship | BOARD · ramp |
| 18.117 | Chapter 3, P4: the cart | GRAB · rope | GRAB · rope from cart |
| 18.118 | Chapter 3, P4: the pad's edge | THROW · rope | THROW · rope to Mops |
| 18.119 | Chapter 3, P2: the mug | LIFT · mug | LIFT · cup |
| 18.120 | Chapter 3, P2: the delivery log | FLIP · delivery log | FLIP · log |
| 18.121 | Chapter 3, P2: Zip at his stand | ASK · Zip | ASK · for a ride |
| 18.122 | Chapter 3, P3: the sign | WIPE · sign | WIPE · dusty sign |
| 18.123 | Chapter 3, P3: the echo spot | HIDE · echo spot | HIDE · alcove |
| 18.124 | Chapter 3, P3: each mirror | TURN · mirror | TURN · sun mirror |
| 18.125 | Chapter 3, P3: the mural | LOOK · mural | LOOK · wall picture |
| 18.126 | Chapter 3, P3: the temple door | EXIT · temple | EXIT · door |
| 18.127 | Chapter 4, M1: each trash can | HIDE · trash can | HIDE · can |
| 18.128 | Chapter 4, M1: hidden in the middle trash can | SING · song | SING · tune |
| 18.129 | Chapter 4, M1 and M5: singing | STOP · singing | STOP · song |
| 18.130 | Chapter 4, M5: the dock | SING · song | SING · tune |
| 18.131 | Chapter 4, M1: the sock | LIFT · sock | LIFT · giant sock |
| 18.132 | Chapter 4, M5: with everyone | DANCE · with Mops | DANCE · together |
| 18.133 | Chapter 4, M2: the poster on the stand | READ · poster | READ · lost poster |
| 18.134 | Chapter 4, M2: the menu | FLIP · menu | FLIP · pancake menu |
| 18.135 | Chapter 4, M2: the stand's door | KNOCK · door | KNOCK · back door |
| 18.136 | Chapter 4, M2: Mom and Dad | HUG! · Mom and Dad | HUG! · family |
| 18.137 | Chapter 4, M3: the van floor | MOP · floor | MOP · van |
| 18.138 | Chapter 4, M3: the air freshener | FLIP · air freshener | FLIP · tree |
| 18.139 | Chapter 4, M3: the seat | LOOK · under the seat | LOOK · seat |
| 18.140 | Chapter 4, M4: the searchlight | ROLL · ball | CURL · ball |
| 18.141 | Chapter 4, M4: the family photo | LOOK · photo | LOOK · family photo |
| 18.142 | Chapter 4, M4: the house door | EXIT · door | EXIT · to the van |
| 18.143 | Chapter 4, M4: under the van seat | GRAB · Guardian Box | GRAB · box |

### Sound (added after Brian's phone playtest, 2026-11-07)

The game's sound is Web Audio only: every sound is made in the page (tones, and the Wookie voice clips stored inside the page), with no `<audio>` elements and nothing downloaded. The sound icon (top right) now shows the truth in three ways: sound waves when sound is on, a red line when the player muted it, and an orange question mark when sound is not playing yet (before the first touch, or when the browser keeps it off). Any first touch, click or key starts sound: the joystick, the ACTION button and the picture all count. If a touch tried and the browser still keeps sound off, a tap on the icon tries again and shows this line for about five seconds:

| # | Where | In the game now | Another way to say it |
| --- | --- | --- | --- |
| 18.145 | Under the sound icon, after a tap on it, when the browser still keeps sound off (Brave on an iPhone with Shields up) | Sound is blocked by this browser. Tap to try again, or allow sound for this site. | This browser has sound turned off. Tap to try again, or turn on sound for this site. |

## Not finished

- **T15, "Stormtop Station" and "Asteroid Belt Gas Stop".** The brief says neither should remain. Both are still in the game because they are live: they are the names on the title screen's Chapter 1 and Chapter 2 cards (with "Phobos, the Tiny Moon" and "Mars!"). Everything else the old engine used is gone. Renaming the cards is a wording change; say if you want new names.
- **T14, the picture's top edge.** The phone test prints the check that the game sits within 16 pixels of the top of a phone screen as an expected failure (it is 170 pixels down today). It becomes a real check when T21 pins the game to the top.
- **T17, two glows that are still boxes.** The highlight on the character picture button (top right) is a box around a button, not a place on the floor, so it stays. Story pointers (the glow around a thing a line is talking about while nothing can be pressed) also stay boxes; see the T17 section.
- **T18, caption rows the test checks only in the source.** The test sweeps the floor in 77 states and finds the other captions there. Seven belong to one-off moments it cannot reach without playing the opening or the torn-slip cutscene, so the test checks that the verb and thing are written in one spot definition in the code: 18.64 PEEK · door, 18.66 HIDE! · closet, 18.69 SLEEP · bed, 18.70 GRAB · gift, 18.71 OPEN · Guardian Box, 18.92 PEEK · trash can, 18.93 PEEK · vent. 18.63 SING · song (O2a) is the same words as 18.98, which the sweep finds in S9, so the O2a spot itself is not swept either.
- **Switch cards in Chapters 1, 3 and 4** (left from Phase 1, T6). The chips now say who acts and the picture-button steps are named, but switching in those chapters still shows no "You are MOPS now." card with a reason. That needs your words for each switch.

## Also changed

- The "YOU: SQUATCH" / "YOU: MOPS" tag over the picture is gone (Brian, 2026-11-07, after a phone playtest: the switch card and the chip's "Squatch:" / "Mops:" already say who you are, and the tag covered the sound icon). Phase 1 row 6.8 is marked removed.

- A chip now shows only while its own moment lasts. Before, when a scene had no chip, the last chip from an earlier scene stayed on screen (in every chapter). Now no chip shows then. In Chapters 1, 3 and 4 the chip tables are the only place chips are set.

- The small "VERB · thing" label on the picture is now at least as wide as before and wider for long words, and it is moved in from the edge so it is never cut off (Chapter 2's EXIT · the lot sat half off the left edge).
- In the closet, on the deck, in the hall and at the window (Chapter 1), the green label that showed only the verb is replaced by the same "VERB · thing" label Chapter 2 uses, so there is one label, not two.
- A ring is not drawn while an action that works anywhere wins over it (for example, while Squatch is hidden only LEAVE works, so the plant and poster rings stay dark). Before, those rings could glow even though nothing there could be pressed.

- Chapter 1, S9: the PULL label over the airlock lever was drawn without the hall camera, so it sat in the wrong place once the hall had scrolled. It now sits over the lever.
- Chapter 1, S6: the gallery wall's LOOK has a hole near the manager's computer (it always had; that is where nothing is offered). Its ring, if it ever glowed, would not show the hole. Nothing switches that ring on today.
