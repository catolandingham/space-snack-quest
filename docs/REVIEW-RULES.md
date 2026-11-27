<!-- section-index -->
**Section index.** Read this index, then only the section you need. Do not read this file whole.

| Lines | Heading |
| --- | --- |
| 33–36 | # Review rules |
| 37–88 | ## Process: review checklist (CUMULATIVE; never drop a check, only add) |
| 89–91 | ## Techniques |
| 92–94 | ## Mistake: locked art was redrawn |
| 95–99 | ## Mistake: optional inspection interrupted getting out of bed |
| 100–102 | ## Mistake: a big doc's section index went stale |
| 103–105 | ## Mistake: a rebuilt beat forgot the step restart |
| 106–108 | ## Mistake: pictures sent to Brian with labels and outlines on top of Squatch |
| 109–111 | ## Mistake: a killed run was read as a failing test |
| 112–114 | ## Mistake: a "nothing is drawn" check looked where the old drawing never was |
| 115–117 | ## Mistake: a game wait on real audio time met a test helper that only ticks |
| 118–124 | ## Mistakes caught building the party rebuild, half one (2026-11-24) |
| 125–132 | ## Mistakes the independent review of PR #85 caught (2026-11-24) |
| 133–149 | ## Mistakes caught building the party rebuild, half two (2026-11-24) |
| 150–162 | ## Mistakes caught building party round three, Brian's video notes (2026-11-24) |
| 163–165 | ## Standing rule: painstakingly obvious (Brian, 2026-11-24) |
| 166–168 | ## Standing rule: nobody walks through furniture (Brian, 2026-11-26) |
| 169–177 | ## Mistakes caught building the morning sound (2026-11-24) |
| 178–189 | ## Mistakes caught building the quiet room's mopping loop (2026-11-24) |
| 190–201 | ## Mistakes caught building the snacks and the dance, and merging them (2026-11-24) |
| 202–215 | ## Mistakes caught building the lines before the TV and the flyer sneak (2026-11-24) |
| 216–222 | ## Mistakes caught building the sleeved paw, the bartender, and the four fixes (2026-11-25) |
| 223–233 | ## Mistakes caught building Brian's showing-4 notes (2026-11-25) |
| 234–243 | ## Mistakes caught building Brian's showing-5 notes (2026-11-25) |
| 244–249 | ## Mistakes caught building Brian's showing-6 notes (2026-11-26) |
| 250–264 | ## Mistakes caught building the loading bay (2026-11-26) |
<!-- /section-index -->
# Review rules

Copied word for word on 2026-11-06 from the "Process: review checklist" section of `HANDOFF.md` (HANDOFF: Space Snack Quest v3, updated 2026-11-02, in the Grok workspace zip). Do not edit these rules without Brian's yes. `CLAUDE.md` at the repo root holds the short form.

## Process: review checklist (CUMULATIVE; never drop a check, only add)
Run EVERY scene through ALL of these, both at script time and on screenshots after it's built.
1. **Domino rule.** Each step has a CAUSE (why now, because of the last step), a NEED (what the player already felt from earlier play), an EFFECT (what it knocks over next) and touches the ARMATURE. If it fails 1–3, add a setup or cut it.
2. **One armature:** "Home is where love doesn't have to hide." (hiding vs being seen; love that hides).
3. **Every side quest is funny or drives the story.** No fat.
4. **Clarity beats cleverness.** Use a cutscene rather than a confusing clue. A 10-year-old must get it. Short, punchy lines.
5. **Flashbacks** open with a plain "Years ago, on Stormtop..." card and end with a plain "Now" card, desaturated with a thin border. Live cutscenes get no card.
6. **One idea at a time, and a slow opening.** One new idea per beat, then a player action or a ≥2.5s breather before the next idea. At most one new mechanic per beat. One speech bubble at a time.
7. **Nothing is mentioned before it's shown.** Every referenced object is visible, sits where the line says, and is highlighted when it matters.
8. **Everything makes sense at the moment it's seen.** Every person and object has an in-world reason for being there, shown: who has it, why it's there, how Squatch gets it. Setup comes first. Only show info the player can understand at that moment (e.g. no "ask Zip, Phobos" in Ch1).
9. **Five screenshot-review questions per beat:**
   - (a) Shown, not told: is anything described in text that should be drawn?
   - (b) Set up: has the player been prepared to understand this object or person, and why it matters?
   - (c) One new idea only?
   - (d) Would a 10-year-old get it without explanation?
   - (e) Is every referenced object visible?
10. **Strangers:** Squatch never talks to strangers until Ch4.4. Their clues come through Mops talking, overhearing (ear icon), or objects.
11. **Singing** is a distraction (lure spots only) plus the bond (scripted moments only). No random or ambient singing, no opera, no goat gags unless a scene gives them a purpose.
12. **Verbatim script, and drift audits.** Also audit existing cutscenes against the chat-approved beats. Every line, card and panel is implemented WORD FOR WORD from the spine. If it doesn't fit, split it across bubbles; never rewrite it. There's an exact-text test.
13. **Dialogue presentation:**
    - Story lines are speech bubbles over the speaker (name tag, large text, clamped to the screen edges), with a pop-in and a blip. The NEXT button is the only "tap" cue (Brian 18a, 2026-11-23: "just next"); no "tap ▸" note.
    - The game pauses (no movement, timers or NPCs) until the tap.
    - Ambient chatter is small auto-fading bubbles over the speaker.
    - Overheard lines get an ear icon.
    - No bottom-left dialogue box. The objective chip is hidden while a bubble is up.
14. **Nothing auto-advances.** Every cutscene card, panel, frame and line waits for a tap/click (the NEXT button shows it; no "tap ▸" note, Brian 18a), including the "Years ago" and "Now" cards. One exception, Brian 2026-11-24, "30a": "a cutaway with no words and nothing to tap plays by itself (about 2 to 4 seconds, ending on a clear last frame), then the game goes on; one with a line, or something to tap, still waits for NEXT." A tap does not skip it, and the big button is dimmed (no NEXT) while it plays (`src/modules/cutaway.js`, `AUTO`; `tests/morning-order.mjs`, `tests/home-alone.mjs`).
15. **Simple visual style.** Gameplay looks like the cutscenes: bold flat shapes, a limited palette, no clutter, only what matters, and interactive objects clearly highlighted (pulse/glow).
16. **Drawn, not described.** Never put a visual in caption text when it can be drawn (crayon drawings, hair on a note, coffee stains, torn edges, paw prints). No "(narration in parentheses)" lines.
17. **Exact-text rule for briefs:** report scripts to Brian verbatim (speaker + exact text, every card), as clear and warm as the chat version.
18. **One bubble at a time.**
    - Never two bubbles visible at once. A scripted exchange is shown one line at a time.
    - Ambient chatter is queued in sequence, never overlapping.
    - Bubbles clamp to the screen and never collide with each other or the chip.
    - No hint banner or chip while a bubble is up.
    - A mandatory overheard line pauses for a tap.
19. **Consistent sighting rule.**
    - EVERY person or bot with vision reacts whenever Squatch is unhidden in its line of sight: a scream or alert, then security comes.
    - Nobody "randomly doesn't care".
    - Each viewer shows a view cone (bots) or an eye icon plus a soft cone (people), so the player can see who can see him.

20. **First mention.** No character, object or concept is named before it's introduced on screen (e.g. robots before the delegation, Wookie before the flashback, Zip/Phobos, GANITOR). Keep the First-mention list below; there's a test.
21. **Every sighting or alarm has a felt consequence.**
    - Security rushes over, and you get a few seconds to hide.
    - If caught, Mops swoops in: "Just a fuzzy mop! Very fuzzy." / "Shedding season." Then back to the checkpoint.
    - The only exception is O4, the scripted chase home.
22. **Audits judge meaning, not just strings.** A string-presence check alone NEVER counts as a pass (that's how the M1b audit passed bad scenes). Every report includes the per-beat screenshot review table (checks 9 + 6–8, 16, 18–21).
23. **Points.**
    - Every collectible has an in-world reason for being there (who left it, why), comes after its first mention, and passes the Domino rule.
    - No collectibles or score during the opening O0–O9.
    - Getting caught always costs −100 and returns you to the checkpoint; the score never drops below 0; O4 is exempt.
    - Tally card and final score screen wait for a tap.

## Techniques
- **Zoom-in card for a first idea** (Brian, 2026-11-07): the first time a key idea appears (the first hide, the first switch), teach it with the opening's "This is Squatch" card: the room goes dark except a spotlight on the thing, one plain line beside it, wait for a tap, once per play-through (`teach` in `src/game/25-capture.js`).

## Mistake: locked art was redrawn
2026-11-13. An agent redrew Brian's locked room art. The no-redraw rule was already in `docs/locked-rooms/README.md`, but that file existed only on the PR #21 branch when PR #25 was built, and `CLAUDE.md` said nothing about locked rooms, so the agent never saw the rule. The rule is now in `CLAUDE.md` and `AGENTS.md`, word for word: "Do not redraw a room freehand, and do not change these files, without Brian's yes and a new locked version." Mops's beard is his mop; no separate mop prop.

## Mistake: optional inspection interrupted getting out of bed
2026-11-16. The first calendar implementation offered its walking LOOK target while Squatch was seated, and could pause the automatic hop out of bed. Optional inspections must not interrupt a movement transition. Test both the seated state (no walking target) and the active hop (no inspection), as well as normal picture taps and keyboard use. For a drawn paper cutout, fill may close the erased region, but its outline must stay open where the bite meets the page edge; otherwise the missing paper looks like an opaque object pasted on top. Check the rendered pixels and still, not only the bitten flag.

The later full touch run exposed a test-driver gap: it waited whenever walking was disabled, even though the calendar offered a visible NEXT button. A new modal needs a real touch close-and-continue check, and the exploratory test player must follow visible controls while movement is paused. Fix the driver's input route; never bypass the modal, mutate story state, remove its completion check or add a known-failure exemption to make that run green.

## Mistake: a big doc's section index went stale
2026-11-23. A changelog line was added to `docs/MASTER-BACKLOG.md` and the section index at its top was not updated, so `tests/section-index.mjs` failed in the full run. After any edit to a doc with a section index, run `node scripts/md-section.mjs stamp <file>`.

## Mistake: a rebuilt beat forgot the step restart
2026-11-23. The first build of the morning module (src/modules/morning.js) let the hold-to-restart (↺) empty the story queue before the song step, which froze the morning, and in the evening it brought back the song step with Mops. The restart saves a step only once the kid has control and keys it by scene, room and ch1Step, so a beat that runs long without control, or two steps with the same key, needs its own answer. A rebuilt beat says what ↺ does at each of its steps and has a test for it (tests/morning-order.mjs, "↺"). A step added later needs its own ↺ check in the same change (2026-11-24: the reviewer found Mops's new mopping step, 21a, had none).

## Mistake: pictures sent to Brian with labels and outlines on top of Squatch
2026-11-23. The first home-alone pictures (PR #84) were checked against the locked rooms, but not for what the game draws on top: the "VERB · thing" labels covered the TV, the closet top, the bed and Squatch's head, the desk's dashed outline ran across Squatch, and an old purple bar crossed the bed in front of him. Brian caught all three. Before sending a picture, look at every label, outline and drawn prop and ask: does it cover Squatch, a bubble, or the thing another line or label names? Labels now follow one rule (`src/modules/cap-place.js`), outlines leave people out (`drawGoalOutline`'s `avoid`), and `tests/home-alone.mjs` and `tests/bed-look.mjs` check them.

## Mistake: a killed run was read as a failing test
2026-11-24. The morning-fixes full run ended in `tests/ch1-kid-play.mjs` with puppeteer's "Attempted to use detached Frame". The run had been killed (its task output read "[killed]" at the same second the log stopped) when the builder's session stopped, which closed Chrome under the robot; the game was fine, and the suite alone reached the tally card. Before debugging a run that ends in "detached Frame", "Target closed" or no summary line, check whether the run was stopped, then rerun that suite alone.

## Mistake: a "nothing is drawn" check looked where the old drawing never was
2026-11-24. The reviewer found half of the calendar's no-paw check sampled a spot the old paw had already left, so it would pass with the paw still there. A check that something is gone samples every place the old drawing could be (where it rests, and where it follows a held finger), and is run against main to see it fail.

## Mistake: a game wait on real audio time met a test helper that only ticks
2026-11-24. Mops's song line now waits until the recording has really played, but `toMorningSong` in `tests/game-page.mjs` ticked the game in one synchronous loop, so no real time passed and `tests/opening-song.mjs` failed in the full run. When the game waits on something outside its own clock (audio, a download), the shared test helpers must let real time pass, and every suite that uses them with sound on is rerun.

## Mistakes caught building the party rebuild, half one (2026-11-24)
- A full-screen view covered the page's ↺, so a kid could not restart the dress-up. Every full-screen view keeps its own ↺ (`src/modules/fullscreen.js`, `restart`), and a test presses it with a finger (`elementFromPoint` on top).
- A close-up's frame loop closed the view and then scheduled one more frame, so its "done" ran every frame and froze the alarm. A loop that can close itself checks that it is closed before asking for the next frame.
- Anyone with a cone could raise the alarm, so Isfred on the stage became a "tourist" on the LOCKUP card, and a shout appeared over someone who never moved. Only people the game can draw running, with a "who" line for the card, raise the alarm; the others show "?".
- A test number (guests at least 70 apart) blocked the dancing pairs, and the first fix loosened the test. Move the design to meet the test (the pairs now stand 72 apart); never loosen a test to fit a design.
- A Squatch line was skipped because he stood below the picture's edge while peeking (`speakerDrawn`). A beat that puts a speaker at the picture's edge says so to the bubble rule (the party's `speakerAt`).

## Mistakes the independent review of PR #85 caught (2026-11-24)
- The fur stopped mid-air when the alarm started, because only the "no alarm" branch moved it. Anything that shows the cause of an alarm keeps moving while the alarm runs, and a test follows it to its end (the tuft reaches the grille).
- A new speaker ("band") had no name, so its bubble read "undefined". Every speaker gets a name from its lines file, and a test reads the name drawn over each bubble.
- Walking into the free play moved Isfred, the camera and the octopus. Every scene change is tested for jumps: nobody (Squatch or the cast) moves more than 60 between one frame and the next inside a room.
- Some cones only ever showed "?" (Isfred's, the band's): nobody "randomly doesn't care". If the one who sees him cannot run, someone near him does.
- A test read the source for `size: 42` instead of measuring the mark drawn. Measure what is drawn (review rule 22).
- Drawings for a later half and a look Brian did not pick sat in shipped modules. They live in `tools/` until the half that uses them.

## Mistakes caught building the party rebuild, half two (2026-11-24)
- Two pieces of state shared one name (`p.lost` was both "They lost you." and the outfit's lost pieces), and the game threw every frame. A new field on a shared state object gets a name no other module uses; grep the state's name before adding one.
- Moving a beat to modules deleted the code that held tuning pins. Move each pin with its value and its name to the module that now owns the rule, point docs/TUNING-PINS.json at it, and list retired pins (their feature deleted) for Brian; never drop a pin silently.
- The party asked the old sound table for "chime", which it never had, so three moments were silent and no test noticed. A module plays its own sounds and a test reads what was played (`now().sound.played`).
- Joe's home theme played through the party night because the music picker only knew the old flags. A rebuilt beat that owns a room says so to the music picker (`warmWhy`), with a test.
- The independent review of PR #87 found a fully dressed kid standing still caught in 7 seconds, in his first minute. A rule that can end a scene gets a "do nothing for a minute" test with the real numbers (`tests/party-free.mjs`: 60 s still in the spotlight).
- A test set the octopus's rest to 0, so "a second hug knocks it off" passed while the real numbers (rest 14 s, straighten 8 s) made it impossible. Tests run with the shipped numbers; a test may wait, never zero a timer the player lives with.
- Bubbles and labels sat on Squatch in the stills ("Say cheese!", DANCE · circle, a name tag over "Mops!"). Party tests read the bubble's and the label's boxes against Squatch's (`overSquatch`), and the label rule tries beside him before giving up.
- Guests, the band and Mops walked through Squatch, and he stood on Isfred. Anyone who walks checks whether Squatch is in the way and waits; every person who stands still is solid.

- The first "wait for Squatch" rule only stopped people walking toward him, so people leaving at closing time brushed past him sideways, 21 px apart. Everyone in the party walks with one helper that goes round him or waits (`stepClear` in `party-hall.js`), keeping further off in front of him, where a taller guest covers him; a walker he blocks waits only a moment, so the party always ends. `tests/party-free.mjs` and `tests/party-endings.mjs` measure how close anyone walking comes.
- A test named the camera tourist as the guest who takes the second look; the plan names no guest, and a milling guest often gets there first. A test checks what the plan says (the same guest turns, stares and raises the alarm) and names a person only where the game makes it so.
- The double-take "?" and the "FUR!" burst are drawn over the guest's head, so a guest standing just below Squatch put them on his head (the second-look still). Every mark the party draws moves beside the guest when it would cover him, and the test measures where the "?" is drawn.
- A suite printed "checks passed" and then did not exit for many minutes: Chrome's crash handler and Google Updater, started by the test Chrome, kept its output pipes open after the browser closed. The game and the test were fine. Before calling a suite hung, look for "checks passed" or "Failed:" in its output, and wait on that line rather than on the process ending.
- Giving him control at closing time and making his hall door a circle broke two older suites that drive the party their own way (`ch1-playthrough` waited for control to be off; `every-goal-has-target` stood him inside the new trigger); only the full run found them. When a scene's control, trigger or timing changes, grep `tests/` for that scene's name and run every suite that drives it before the full run.
- In the retaken videos a "?" stayed over a guest after the alarm started and on into closing time: the double-take and the last look were never cleared when the scene moved on. Moving to the alarm or to closing time clears every per-guest look (`curious`, `seenBy`), and tests count the "?" and "!" actually drawn.

## Mistakes caught building party round three, Brian's video notes (2026-11-24)
- The brief guessed the white ring at his door was the go-home spot's ring; it was the walk-tap ring, drawn by other code. Before changing a drawing Brian points at, find what draws it from the frame itself (the video frame, then a with-and-without picture diff), not from a guess.
- A raised paw was drawn behind his ear, so one pose had only one paw showing. A posed figure is checked in every pose, by the colour at the place each part should show.
- A colour check sampled the edge of a shape (the ear, which the head's outline crosses) and failed for the wrong reason, and an earlier version sampled a place the change never touched, so it passed with and without the change. A colour check samples well inside the shape, says how many of its samples lie inside the thing being tested, and is run once without the change to see it fail.
- A still was taken after reading the game's state, and the game had moved on (the guard had already lost him). For a still of one exact moment, stop the game's clock on that frame first (`freeze` in `tests/party-round3.mjs`).
- A test pressed the action button on the same tick he got control, before the game had offered the action. A test waits for the offer it is about to press (`n.act`), as a kid waits for the button.
- A speed check took the slowest single tick, which is short whenever a walker turns a corner inside a tick. Speed is measured over the whole walk; the longest single step is the check for jumps.
- Deleting one helper took its neighbour with it (the tests' `seenByNow`), and only the next test run showed it. After deleting a block, build and run the suite that reads it before making the next change.
- The reviewer of round three found a check that could not fail: it moved the drawn beam and the point it tested by the same amount, so "the beam covers where he is seen" was true whatever the code did. For every check, name the change to the game that would make it fail; if there is none, it is not a check. (The beam is drawn higher than the floor patch sight is measured on; the tests now check the thing a kid reads: the beam lies on his head when he is seen. Brian is told the difference.)
- The push back at the hallway doorway started a line, and the same frame could still start an alarm or closing time, so the line could have shown over either. The frame that starts a scripted moment does nothing else, anything that could end the scene waits for it, and a test starts the other thing in the middle (the last song ending during the push back).
- The searching look, asked for the guard who follows him home, was also given to the hall guards. Build a look for the one character Brian named; list the others it could suit and ask.
- A length was typed twice (the flash's 0.25 in the code, `PHOTO.flash` in the table the test read). A number a test reads from a table must be the number the code uses.

## Standing rule: painstakingly obvious (Brian, 2026-11-24)
His words, on the snack close-up, for every piece of the game: "It just needs to be more painstakingly obvious, and we need to kind of build this as a core thing we're looking at all times." Before a picture or a beat goes to Brian, ask of each thing on screen: would a 10-year-old know what it is, what it is doing and what he can do about it, without being told? If the answer needs a sentence of explaining, the drawing is not done.

## Standing rule: nobody walks through furniture (Brian, 2026-11-26)
His note on the home morning (video note 0:18): "he kind of glitches through the crate... is there a physics rule we can adopt for the future?" The rule, word for word as the phase-3 brief gives it: "Nobody walks through furniture: every walk goes round it, checked by a test over every scripted walk." Every walk a beat scripts is a list of corners in its own module (the home morning's `HOME_MORNING_WALKS`, the bedtime story's `BEDTIME_WALKS`) that the code walks, and `tests/scripted-walks.mjs` samples each one every 2 px against the furniture boxes (`tests/data/home-furniture.json`, the ones `tests/standing-spots.mjs` uses) and the things on the floor. A new scripted walk goes in such a list and in that test in the same change.

## Mistakes caught building the morning sound (2026-11-24)
- A sound timed to a picture was checked against the time read after the frame that played it, so it looked a frame late. A sound check reads the picture's time at the moment the sound played (the step's `el` less that frame), and allows one frame.
- A wait on a real clock (the snoring's audio clock) met a test that only ticks the game: the room's snores did not come. A test that counts sounds booked on the audio clock lets real time pass there.
- The first glow (a yellow halo round the beard) vanished against the yellow bucket and under Mops's shirt; the test counted the halo and found none. A glow that says "tap this" must show against everything behind it: the beard itself is lit pale yellow, with outlined stars, and the test measures the drawn colour.
- An auto-advancing picture clears the step, and the next one comes up on the following frame; a test that reads the button in between reads the dimmed "~". Read what is up a frame after the change.
- The reviewer found "Hey, stop that!" was queued by a later frame, 0.68 s after the squirt, so a tap or NEXT in between ended the picture and lost the line. A line that follows an animation is queued at once, behind a wait step that plays the animation (taps do nothing during it), and a test taps impatiently in between.
- The reviewer found Mops's meh was used up by a line said while sound was off. A once-only sound is marked heard only when it really played.
- The second review found the wringing sounds due while the squirt flew were saved up and all played at once when the picture came back. When a picture's clock runs while something else is up, its sound cue moves on with it; `tests/sound-cues.mjs` checks every wringing sound lands on its beat, and failed on the old code.

## Mistakes caught building the quiet room's mopping loop (2026-11-24)
- When Mops could start his mop-along from anywhere, a tap beside the bucket left him no floor to mop, so 21a's promise (he mops just before the close-up) was gone. When a fixed start becomes "wherever he stands", re-read the ask the fixed start served and keep it from every start (he now mops two strokes at least).
- From the wring spot he mopped away from the bucket with his back to it; no test saw it, a still did. When a walk can start from several places, look at a still of each start, not only the one the old code had.
- The falling drops were drawn blue over the bucket's blue water and could not be seen. Check a new drawing against what is behind it at that exact spot (the drops now fall through the air above the rim).
- The beard's forward sweep touched the painted bucket at the end of his stretch. A part that moves is checked at both ends of its travel against the things in the locked picture.
- A "dry again" check sampled a spot the shine never reached, so it passed for nothing. A check that something has gone samples a spot where the same run saw it first.
- A check read Mops's pose in the same frame as the tap; the tap's step runs on the next frame. Read what a tap did a frame later (the same rule as for a picture that moves on).
- Loudness checks compared the peaks of noise sounds and sat within 1 dB of their limit, so they flipped between runs. Compare noise sounds by loudness (rms), leave 2 dB or more, and run a sound-level test several times before trusting it.
- The reviewer found the bucket's drips rose through the whistle's own pitches (1.1 to 1.7 kHz), the very mix-up Brian asked to end, and the check compared peaks that were mostly noise. A new sound that plays near another is measured in that sound's band (the drip now falls in pitch, under 700 Hz, and the test measures above 1 kHz).
- The reviewer found a branch for Mops standing far to the left of his bucket that nothing in the loop can reach, and no test ran it. Code for a case that cannot happen is deleted, not kept.
- The reviewer found the beard was never measured against the painted bucket (only the shine was), and a level check read the number in the source. Measure the drawn beard and the rendered sound.

## Mistakes caught building the snacks and the dance, and merging them (2026-11-24)
- A snack in his paw when the close-up closed went into the bag without its stars, because the stars were paid only where a snack lands. When something can be earned on two paths (the usual one, and a close in the middle), pay it in one place both paths go through (`snackShut`), and test closing in the middle of the action.
- A check labelled "a 44 px target" tested for 30. The number in a check is the number in its label; if the drawing does not meet it, change the drawing or change what is claimed, and say so.
- The dance's size and its smallest target were typed in the rules file and again in the drawing file. A number the drawing and the rules share is exported by one of them.
- A long "do nothing" check set the song's clock back so the song would not end the dance. Start a fresh scene with time to spare instead of resetting a clock the player lives with.
- A drawing read a list only the game's tick creates. A drawing never assumes the tick ran first; it draws a hand-made or brand-new state without throwing.
- A test that steps the game by its own ticks waited for the bartender to turn while a line was up. The bar waits while a line is up, so the wait ran out without saying so and the next step ran in the wrong moment. A "run until" helper's time-out is checked, and a test taps a line away (or checks for it) before waiting on anything the line pauses.
- A NEXT pressed in a line's first moments is ignored or only finishes writing the line. A test presses NEXT the way a kid does: after a moment, and again until the line is gone.
- The paw icon sat on the hall pyramid's top snack and nobody had noticed. Before changing a close-up, look at the picture it opens from, with its icon on.
- Another guest's line (the octopus's hiccup) can come up in the middle of the thing under test and pause it. A test of one toy either keeps inside the first minute or taps other guests' lines away as a kid would.
- Merging the two party branches, a new check ("once the staring is over the octopus notices") was written from how the builder thought the scene ends; in the game a kid who stands still after the crash is seen and the alarm starts first. Before writing a check about what happens next, run the scene once and read what does happen.

## Mistakes caught building the lines before the TV and the flyer sneak (2026-11-24)
- The TV's place was typed from the older program's drawing code, which the locked home picture does not follow (the real TV is 37 higher), so the button was drawn in mid-air under the shelf. Measure a thing in a locked picture from the picture itself (a pixel scan in the running game), never from old drawing code.
- A flag was set for the older program to draw the TV on, and nothing changed on screen: the room is a picture now. After handing a drawing job to other code, look at the frame before writing the test's expectation.
- The scene after the hat grew by four lines and a walk, and Mops carried the lifted hat on his face to the TV. When a scene is made longer, check what every character is still holding from the moment before.
- A glow made with a canvas shadow turned the white flyer yellow, because each later shape's shadow falls on the shapes drawn before it. Draw a glow as its own soft patch behind the thing, then the thing with no shadow.
- The flyer's place was chosen first ("the stage's end") and the dancers' sight mapped second; every way to it was inside a cone. Before choosing where a thing to sneak to goes, map who sees what from the game's own cones (tests/party-flyer.mjs keeps the map as a check: a clear way, how wide, and that the straight line is not clear).
- The sound suite played every quiet line in Mops's voice, so Squatch's quiet lines "failed". A test plays a line with its own speaker.
- A test compared a resting place with where Mops stood, read after Mops had walked off. A check about a moment reads the state at that moment, or compares with someone who has not moved since.
- The independent review of the flyer sneak found the flyer's box typed twice: in the party's own table and again in the goal-outline table. A goal outline for a thing the game draws reads that thing's own box (`GOAL_TARGETS["hall:grab-flyer"].rect` is `FLYER.box`), and a test checks they are one object.
- The same review found the new ending's restart tested only at its very end (the TV on). A scene that gained steps gets a restart check in the middle of each new step (the hat going down, the horn press), then one clean run to the end.
- A still tool set a Day 2 flag by hand (the office flag in the hall) and drew a room the game never shows that way. A hand-made state for a still copies a state the game itself makes (read the scene's own set-up first), and the report says which stills are hand-made.
- The first clear way to the flyer was 48 wide in game numbers and passed its own test; on a phone that is 18 px, less than a finger, and the kid robot (which keeps a kid's distance from watchers) could not get up it. A gap a kid must steer through is judged in phone pixels (the picture is about 0.37 of game size): 100 game px or more, and the kid robot must walk it before it is called clear.
- Making the showing-4 video, the robot ran home after an alarm and did not hide; the guard's light fell on him, the guard stepped at him and back to his looking place every frame, gave up, and "They lost you." sent him back to the party. Every place the capture rule can end gets a "do nothing" run (home too, not only the hall): standing in the open he is caught, with the card (`tests/party-catch.mjs`).

## Mistakes caught building the sleeved paw, the bartender, and the four fixes (2026-11-25)
- A suite threw "getImageData: Value is not of type 'long'" because a module had changed and index.html had not been rebuilt, so the game sent a number the new test expected and the old build did not have. After any change in `src/`, run `npm run build` before running a suite.
- A scripted replacement changed one of two lines that looked alike and missed the other, so the hall check read Squatch at the home room's size and failed for the wrong reason. After a scripted edit, grep that every place meant to change did.
- "No fur below the cuff" first counted single blended pixels at the edge of a snack (a pie's dark middle against its crust) as fur. A check that a colour is absent looks for a patch of it (the pixel and its neighbours), within the area the thing could be, not one blended pixel anywhere.
- A sleeve check sampled a folded arm where its own cuff and paw lie in front of the sleeve, and failed though the drawing was right. Before sampling along a part, leave out where another part of the same figure is drawn over it, and say so in the check.
- Running a test with `STILLS=x` wrote a folder `x/` into the repo and `git add -A` staged it. Stills go to an absolute path outside the repo; check `git status` before committing.

## Mistakes caught building Brian's showing-4 notes (2026-11-25)
- A test read two lines with a pause between them as one group and two lines with none as two groups, so the second read swallowed the next four lines and waited out its clock. Lines that follow one another with no pause are read together and split afterwards.
- A path search said there was no way to the flyer for any start time; the reason was a place no cone could ever leave free (the robot's sweep always crossed the only approach). Before tuning numbers, map which floor is never free over a whole cycle and give the goal a pocket nobody's cone reaches.
- The sneak planner did not know the vent, and a planned wait by it started the fur alarm. A planner for a scene knows every rule that can end it there (cones, the vent), not only the cones.
- A tool that runs the game faster than real time (the planned walk, many ticks in one call) made a real-time sampler see jumps. Any sampler around a fast-forwarded stretch is told where it starts and ends (`walkPlan` pushes a break), and the stretch measures its own steps.
- Mops and the guard (and Squatch with his top hat) are drawn about 150 to 230 tall at home, so two people on one lane can never pass each other without overlapping; the fix was different lanes (the back of the room and the front), checked by their drawn boxes every tick, and Squatch going round the back when Mops stands between him and where he is going.
- Changing who the home guard gives up on (only once Squatch is under the bed) broke an older check that he gives up on a kid standing out of sight in the early scenes. A rule Brian asked to change for one scene (after the party alarm) stays as it was everywhere else; grep the tests for the rule's old behaviour before changing it.
- A still of one exact frame (a small "?" beside a guest) came out without the "?": the test that drew it read the canvas calls in the same moment, but by the time the screenshot was taken the game's own loop had drawn later frames, in which the "?" was gone. A still of one exact frame is copied from the canvas in the same call that draws it (`toDataURL`), and the check reads a pixel of the thing, not only that it was asked to be drawn.
- Going home early through his door needs him to have walked away from it first (`leftDoor`); coming back from the alarm's card, the walk in ends inside the door's circle, and with `leftDoor` still set from before the alarm he was sent straight home again (the photo test froze). Every way back into a scene resets the "has walked away" kind of flag (`resume` now does), and a test stands him just inside the door after each way back.
- The reviewer of this round found Squatch detouring round the back of the room for a Mops who had not come in yet (`between` read Mops's place without asking whether he is in the room). A helper that reads someone's position first asks whether that someone is there.

## Mistakes caught building Brian's showing-5 notes (2026-11-25)

- Places where people stand were typed without checking them against the room's furniture, and Mops stood on the bucket at home in two scenes. Every new standing spot goes into `tests/standing-spots.mjs`, which checks it against the floor each thing takes up (at home up to the shins, since the room draws people three times bigger).
- Boots sounded every 0.45 s while any guard was "in the hall", even while the guard at home stood talking to Mops. A footstep plays only when that person's feet moved (`src/modules/footfalls.js`); `tests/footsteps.mjs` checks it across Chapter 1 from the game state, not from the footstep code.
- Logic for the party went into `src/game/` (sizes, the walk ring's bookkeeping, the singing rule) although the rule said modules. `tests/game-no-growth.mjs` now fails when `src/game/` grows.
- Moving the talk off the bucket put Squatch's held-out flyer over Mops: a drawn person is wider than his feet (his arm and what he holds). A new place for two people talking is checked with the drawn boxes (`tests/party-home.mjs`), not only with the feet.
- A test that opens a scene, waits a moment in real time and only then stops the clock reads a scene that has already moved on (the talk had fetched the flyer before the first look). Stop the clock and restart the part (`__ss.sectionReset()`) before reading where it starts; the beat's own `restart()` does not clear the story queue.
- Words drawn inside a scaled drawing (the GANITOR tag in Mops's own units, 2026-11-26) were read by `tests/canvas-text.mjs` at their unscaled font size (2 CSS px), because it only adds a move, not a scale. Write words in game pixels: find the spot in the drawing's units, then set the transform to the picture's own scale there and give the font in game pixels (`src/modules/ganitor.js` drawGanitorTag).
- A test of a ball or hiding rule that only tried the open floor passed while the doorway still let a rolled-up Squatch through and a noticed ball could stay put through the search (the round C code review). Test each button a hiding pose can still reach, and the search after a sighting.

## Mistakes caught building Brian's showing-6 notes (2026-11-26)

- Sight was tested at one point a quarter of the way up Squatch while he is drawn about 85 tall, so a cone drawn across his head did not see him ("It looks like he's right in the octopus' cone, what am I missing??"). What a cone is drawn on is what it sees: sight tests his whole drawn outline (`party-watch.js` `coneEdge`), and `tests/party-showing6.mjs` checks the drawn cone against his drawn pixels. A change to sight re-checks every layout built on it (P2's glancer, P4's sweeps, the guards' reach).
- Guards walked straight from point to point, through a plant pot. Anyone who walks a route round the room goes round its furniture (`guardStep`), and a route's whole walk is checked step by step (`tests/standing-spots.mjs`), not only where it stops.
- A wait was tied to the end of a song (the photo after the dance, 28 s of nothing). After an action ends, the next beat starts within about a second, or the wait is shown.

## Mistakes caught building the loading bay (2026-11-26)
- The older program's "pa" bubble style is a banner fixed in the middle of the picture, so the first build's PA line sat over the window, nowhere near the wall speaker (Brian's rule: beside the speaker, with sound waves). A speaker's line is an ordinary bubble placed by the beat (`bubbleBeside`, `speakerAt`), and a test reads the drawn bubble's box against the speaker's (`tests/loading-bay.mjs`).
- A beat that draws a locked room itself must paint the picture through the older program (`drawLocked`): the goal outline traces whichever locked picture was painted last, so a room painted any other way gets an outline traced from the previous room.
- A bubble over a close-up covered the close-up (a long line wraps to about 490 wide). Place the close-up and the bubble together, and test the drawn boxes apart.
- A layer over a locked picture (the hallway's Employee of the Month photo) was drawn by a beat's over-the-room hook, after the people, so Mops's horns went behind it (Brian, the loading bay video at 0:14.8). A layer that belongs to the room is painted right after the room's picture (`drawWall` from `drawCh1Passage`), and a test counts his fur's pixels over it, run once with the old order to see it fail.
- The hallway's robots were drawn at the bay's pixel size, so next to the hallway's bigger people they looked small, and they stood on the office door's painting (Brian, 1:37.2). Anything drawn in two rooms is scaled by each room's grown-up (`adultPxFor`), and a test checks its drawn box against the room's doors and walls.
- The ramp in the bay picture comes with the ship: a thing that arrives with something else goes away before it (the ramp back up into the ship, then the ship), and the scanner's posts are solid only while it is there.
- Every bubble's name tag read "Speaker" in the rebuild: the bridge's `speakerName(who)` asked every beat in turn, and the home morning's `speakerName()` (no argument, its own wall speaker's name) answered for everyone. The bridge asks only a beat whose `speakerName` takes the speaker, and the bay's test reads the name on Dot's, Bob's and Lou's bubbles.
- Three robots rolled down the ramp one after another to spots left to right, so the second rolled through the first, already standing in its place. People sent to a row of spots go to the far one first; `tests/standing-spots.mjs` checks each walk against the people already standing.
- The hallway's way into the bay was a trigger at x 916, but the hallway's walk bounds stop him at 900, so a player could never get through (the showing tool stopped at x 893; the test had placed him at 935 by hand). A place walked into must be inside the room's walk bounds, and a test checks the numbers; a test that puts him somewhere by hand cannot prove he can walk there.
- The lockup card's words ("A robot", "in the hallway") were typed in the beat's code, and Isfred or a worker seeing him read "A tourist". Every word on the card comes from the lines file, and each watcher gets its own (pending) words.
- The robots' cones faded in only near him (the party's guest rule), so in the video the sneak and the party hall showed robots with no cones, and the first lane's cone reached the hall doorway where he comes in: caught three times before he could move. Robot cones carry `always` (the shared rule), a test reads every robot cone as shown, and a test checks no lane's cone reaches the doorway.
- The ball behind the cargo sat wholly behind it, so the player could not see him at all. A ball hiding behind something sits against its side, partly showing.
- A merge left `import { readFileSync }` twice in `tests/standing-spots.mjs`, so the whole suite stopped at load and its bay checks (written for the old walks) went unseen. After a merge, run every suite the merged files touch, not only your own.
