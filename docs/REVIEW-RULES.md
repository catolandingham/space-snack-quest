<!-- section-index -->
**Section index.** Read this index, then only the section you need. Do not read this file whole.

| Lines | Heading |
| --- | --- |
| 21–24 | # Review rules |
| 25–76 | ## Process: review checklist (CUMULATIVE; never drop a check, only add) |
| 77–79 | ## Techniques |
| 80–82 | ## Mistake: locked art was redrawn |
| 83–87 | ## Mistake: optional inspection interrupted getting out of bed |
| 88–90 | ## Mistake: a big doc's section index went stale |
| 91–93 | ## Mistake: a rebuilt beat forgot the step restart |
| 94–96 | ## Mistake: pictures sent to Brian with labels and outlines on top of Squatch |
| 97–99 | ## Mistake: a killed run was read as a failing test |
| 100–102 | ## Mistake: a "nothing is drawn" check looked where the old drawing never was |
| 103–105 | ## Mistake: a game wait on real audio time met a test helper that only ticks |
| 106–112 | ## Mistakes caught building the party rebuild, half one (2026-11-24) |
| 113–120 | ## Mistakes the independent review of PR #85 caught (2026-11-24) |
| 121–129 | ## Mistakes caught building the morning sound (2026-11-24) |
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

## Mistakes caught building the morning sound (2026-11-24)
- A sound timed to a picture was checked against the time read after the frame that played it, so it looked a frame late. A sound check reads the picture's time at the moment the sound played (the step's `el` less that frame), and allows one frame.
- A wait on a real clock (the snoring's audio clock) met a test that only ticks the game: the room's snores did not come. A test that counts sounds booked on the audio clock lets real time pass there.
- The first glow (a yellow halo round the beard) vanished against the yellow bucket and under Mops's shirt; the test counted the halo and found none. A glow that says "tap this" must show against everything behind it: the beard itself is lit pale yellow, with outlined stars, and the test measures the drawn colour.
- An auto-advancing picture clears the step, and the next one comes up on the following frame; a test that reads the button in between reads the dimmed "~". Read what is up a frame after the change.
- The reviewer found "Hey, stop that!" was queued by a later frame, 0.68 s after the squirt, so a tap or NEXT in between ended the picture and lost the line. A line that follows an animation is queued at once, behind a wait step that plays the animation (taps do nothing during it), and a test taps impatiently in between.
- The reviewer found Mops's meh was used up by a line said while sound was off. A once-only sound is marked heard only when it really played.
- The second review found the wringing sounds due while the squirt flew were saved up and all played at once when the picture came back. When a picture's clock runs while something else is up, its sound cue moves on with it; `tests/sound-cues.mjs` checks every wringing sound lands on its beat, and failed on the old code.
