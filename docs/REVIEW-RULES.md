<!-- section-index -->
**Section index.** Read this index, then only the section you need. Do not read this file whole.

| Lines | Heading |
| --- | --- |
| 21–24 | # Review rules |
| 25–77 | ## Process: review checklist (CUMULATIVE; never drop a check, only add) |
| 78–80 | ## Techniques |
| 81–83 | ## Mistake: locked art was redrawn |
| 84–88 | ## Mistake: optional inspection interrupted getting out of bed |
| 89–91 | ## Mistake: a big doc's section index went stale |
| 92–94 | ## Mistake: a rebuilt beat forgot the step restart |
| 95–97 | ## Mistake: pictures sent to Brian with labels and outlines on top of Squatch |
| 98–100 | ## Mistake: a killed run was read as a failing test |
| 101–103 | ## Mistake: a "nothing is drawn" check looked where the old drawing never was |
| 104–106 | ## Mistake: a game wait on real audio time met a test helper that only ticks |
| 107–113 | ## Mistakes caught building the party rebuild, half one (2026-11-24) |
| 114–121 | ## Mistakes the independent review of PR #85 caught (2026-11-24) |
| 122–138 | ## Mistakes caught building the party rebuild, half two (2026-11-24) |
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
14. **Nothing auto-advances.** Every cutscene card, panel, frame and line waits for a tap/click (the NEXT button shows it; no "tap ▸" note, Brian 18a), including the "Years ago" and "Now" cards.
    - **Exception, Brian 30a (2026-11-24):** "a cutaway or close-up with no words and nothing to tap plays itself (about 2 to 4 seconds, ending on a clear last frame), then the game goes on. One with a line, or something to tap, still waits for NEXT." This narrows rule 14 for wordless cutaways only (the party's hand pulling the alarm plays 2.4 seconds).
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
