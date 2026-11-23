# Space Snack Quest

Calendar review status (2026-11-16): Brian said yes to merge the calendar (Nov 16, 12:50 PM PT). Latest printed copy: FUZZUARY alone beneath MOONMUNCH; Homework and Sing with Mops removed; "Wash outside windows (remember space suit!)"; a slightly larger edge bite that does not touch the grid.

**Decisions:** [`docs/DECISIONS.md`](docs/DECISIONS.md) is the single source of truth. If this README or any other doc disagrees with it, `docs/DECISIONS.md` wins. Where things stand is [`docs/STATE.md`](docs/STATE.md). Open asks are [`docs/OPEN-ASKS.md`](docs/OPEN-ASKS.md).

**New here?** Read [`docs/START-HERE.md`](docs/START-HERE.md). It names the four files that say what Chapter 1 should be, the ranked problem list, and the loop to follow. Brian's own messages are in [`docs/grok-archive/squatchbot-brian-words.md`](docs/grok-archive/squatchbot-brian-words.md).

**Next up (Brian, 2026-11-16):** Chapter 1, one beat at a time in [`docs/CH1-STORY-WALKTHROUGH.md`](docs/CH1-STORY-WALKTHROUGH.md). Do not leave beat 1 until Brian says it is right. Squatch walks around the bed and the bucket, and the Guardian box is in the closet on day 1 (locked home room v5; Brian's yes, Nov 16, 12:50 PM PT). On day 2 he takes the box out at the closet (`tests/bedroom-walk.mjs`). The calendar is tappable. Printed copy: MOONMUNCH / FUZZUARY; Sponsored by MOON PIES; Sock hunt; family Olympics night; Wash outside windows (remember space suit!); Blanket fort night. These are decoration, not new quests. X or NEXT returns to the same scene (`tests/calendar-closeup.mjs`). Still to build: closet and bed looks, desk homework (words need Brian's yes), purple bed bar, bucket, and music. The night vent step no longer finishes inside Mops: the morning hum was leaving him marked as walking. Docs match main: yes.

## Chapter 1 redesign (on main)

2026-11-13. Brian said yes, merge (without the beard gag). Pull requests #21 and #23 are on main. The rooms are Brian's locked pictures in `docs/locked-rooms/`. Walks stop at the doors on those pictures. After the opening walk, control stays on and the chip says to sing along. In the locked bedroom the bed and the mop bucket stop you (the G box is in the closet on day 1; locked picture v5). Mops's beard hangs to the floor. There is no mop prop and no cut-in at the bucket. The title screen no longer logs "Va is not defined" every frame. The rule there, word for word: "Do not redraw a room freehand, and do not change these files, without Brian's yes and a new locked version." Mops's beard is his mop; no separate mop prop. A new game takes the lunch, sneaks the hallway, and hands it to Mops. The Nov 8 docs pulls were checked. Anything still missing is section G of `docs/OPEN-ASKS.md`. On 2026-11-13 Brian approved the gallery words "TIED TOGETHER FOREVER", "ME" / "MOPS", and "BEEP BEEP", and the gameplay in R92–R95. At 4:10 AM ET he approved Mops's gate lines: "He's with me." and "No thanks. We're getting my goat." At 6:12 AM ET he said to build the home song with the old lines, point the bedroom arrows away from the bucket, and remove the keyboard instructions under the game. The title picture stays. Docs match main: yes. Do not merge.

Brian said yes to merge the redesign (PR #19) and the party (PR #20) on 2026-11-09. Starting a new game now plays the redesigned Chapter 1: lunch with Mops, the walk to the delivery room, the yellow and pink copies, the night mailbox, the week jump, the ball under the vent, pickup day (Squatch slips out of a crate in the mail room while a crate is opened on the ramp), the spare blue jacket at home (Mops keeps his own jacket on), and boarding. The home room matches the approved picture: wardrobe on the far left, the Moon Pie calendar on its door, no mop, no vent, and the STAY IN HERE poster beside a cut in the right wall. Room changes show Squatch (and Mops, when he comes too) walk off and walk in. The walk home in this build still uses the existing hall, including its door to home. The hallway (R51, R53, R55) is in the game. It is `docs/locked-rooms/hallway-room-empty-v6.png`. The photo gags are still being picked, so the room and the gallery are not drawn. This branch plays the party first, then Chapter 1 from the morning gift through the ship (walkthrough beats 22–61). After the opening walk, Mops leaves for work (a stand-in: there is no song yet). Squatch peeks from the doorway, hides in the plant, hears Isfred and the Croc Boys, then dresses up at the wardrobe and wears that outfit back into the party. The snack bar is a reusable cut-in. The party lasts 3 minutes, and "Cool hat!" is the stand-in ending. Then he runs home. The next morning he finds a Guardian gift, sees Moon Pie day circled on the calendar, and sneaks Mops's lunch to him in the hallway. At the loading bay the pink and yellow copies go in the bin, not the vent. That night he paw-checks ORDER MORE ROBOTS, posts the yellow copy, and the vent takes the pink sheet while he hides. A week later they find Mops's desk in the vent, type the office code, book the crate, and leave in the goat costume. The ship is stopped by a call from the base. A kid's balloon takes about 6 seconds to reach the ceiling. Giving it back is safe. Keeping it starts the alarm. Either way it stays in the hall and pops on the last visit. An octopus hug can knock the disguise off, and a photo can include him for 25 points. R50 is in: the manager is not at the ship when they leave. R54 is the office cutscene after that: five lines, and Isfred no longer jumps straight to the tapes. The Moon Pie page is on the manager's computer in the current hall, not on the home TV.

On a preview host, `?beat=42` opens that beat by itself. Local play and the live site ignore a numbered beat. On localhost, `?beat=day2` opens Day 2 at the gift in the closet, so a playtester can reach the closet box and, by playing on, the lunch handoff. The live site ignores it. No new words.

A separate preview site can serve this branch. It is not the live game at space-snack-quest.onrender.com. On that preview, saved settings use ssq-day2- keys so they do not mix with the live game or the slice preview on the same iPad.

Every new line is listed for Brian in `docs/CH1-LINES-FOR-BRIAN.md`. He said yes to merge this chapter before the wording pass was finished, so a line in that file can still change. `tests/ch1-playthrough.mjs` plays this chapter to the tally card.

2026-11-16, not merged: playtest 13. After lunch, Squatch and Mops stand apart in the snack hall, off the plant and clear of the snack. The name Mops is dark on the green song chip. "BEEP BEEP" plays with the UPS robot visible. A long goal stays on one line. The party split, cones, hearts, music, and homework desk are written down and not built. Docs match main: yes. Do not merge.

2026-11-16, not merged: playtest 12. Canvas words are at least 14 CSS px at 1024x768 and 768x1024. The Rule #1 tag sits beside Squatch, not on his eyes. He and Mops no longer stand inside each other at the lunch handoff or the snack hall. A bubble is not shown when the speaker is off screen. Docs match main: yes. Do not merge.

2026-11-16, not merged: Brian t342. The small canvas words are 17px, which is at least 14 CSS px on an iPad. REC is white on a dark red plate. The locked pictures were not redrawn. Docs match main: yes. Do not merge.

2026-11-16, not merged: `docs/OPEN-ASKS.md` is the one review list. Each row says whole game or one chapter, and approved, awaiting yes, or built in a pull request. PR #35's disguise rules are approved and not built. The bigger heart cone is built in PR #35. Brian, Nov 16, 12:50 PM PT (K29): every catch is the lockup card, then restart the current scene, and long scenes such as the party are split. PR #38 and the "set back where he was caught" rule are superseded. The catch code stays until Brian approves the split. On localhost, `?beat=day2` opens Day 2. The older sections stay as history. iPad pictures of pull requests 57 and 58 are in `docs/audit-shots/final/beat1/`. Docs match main: yes. Do not merge.

2026-11-16, not merged: a catch at the party puts Squatch back in the party, on the open floor, not in the plant. It does not restart the bedroom. Docs match main: yes. Do not merge.

2026-11-16, not merged: Brian t341. Reports use the handover note. The long docs have a section index; read one section. Canvas words are checked at iPad size, and failures already on screen are listed for Brian instead of restyled. Approved tuning numbers are pinned. In the office cutscene the white robot stands beside Isfred, on the floor, fully on screen. Docs match main: yes. Do not merge.

2026-11-12, not merged: people are sized by the door of the room they are in (Brian t336u). An adult head is 85% of that door. The hall door is 77.9px (adult 66.2px). The office door is 123.4px (adult 104.9px). Squatch is 80% of the adult in the same room. A room with no door uses the hall. No new words. Docs match main: yes. Do not merge.

2026-11-12, not merged: the party alarm follows the security rule. A guest runs to the wall alarm, guards search, and a sighting uses the existing hall lockup. Hiding or reaching home starts the old home search half a second after the guard reaches the door. The manager's office is the locked v2 picture. No new words. Do not merge.

Playtest 6 and round 1 polish, not merged: the picture keeps its place when NEXT appears, and it takes the keyboard on load so Esc skips a card. Isfred's party line sits under the office monitor. Putting on the tourist disguise fades through black. No new words. At the party, guests are drawn at 1.8 and Squatch stays at his normal hall size, so the adults are clearly taller (R67). R65 does not enlarge him at home or in the other rooms. R66 is superseded. At bedtime Mops walks to (380, 460) and stays there, with no snap. Squatch lies down. Joe's warm theme is `music/main-theme-from-brian.mp3`. It plays on the title, at home, and for the gift. It never plays under singing: it fades out while a song plays and comes back after (2026-11-15). Day 1 plays from the song at home through bedtime. After that, the old Day 2 still runs. New lines are pending. The night robot looks down for 2 seconds, turns for 0.3 seconds without catching, then looks at the back wall for 4 seconds (R64), and that cone is outlined. Mops stands clear of the mop bucket. Docs match main: yes. Do not merge.

The older Chapter 1 scenes are still in the program so a debug link such as `?scene=S9` can open them. They are not what a new game plays. Those old scenes are drawn in the new home room. The ball Squatch rolls into, including in the Chapter 2 kitchen, is the L2 ball. A robot notices that ball only after staying within 70 pixels for 2 seconds, in every room. Standing and walking sight is unchanged. The manager's name on his bubbles is Isfred Bar Neshuman. Chapter 2 now opens with "They put us off here. This is the gas stop." instead of a fuel light.

## Source and build

The game's source is in `src/`. `index.html` is build output: never edit it by hand.

- `src/game/` is the game, in pieces the build joins in name order. Each piece starts with one comment line saying what it holds:
  `00-core.js` (sound, title, drawing helpers, the story queue, spots), `10-ch1.js` and `11-ch1-hall.js` (Chapter 1, in two parts), `15-ch1-scene1.js` (everything Chapter 1 scene 1 runs: the start, the song, Mops walking out, the peek),
  `20-ch2.js`, `30-ch3.js`, `40-ch4.js` (one per chapter),
  `50-story-frame.js` (the story update every chapter shares), `60-frame-draw.js` (the frame update and the main draw),
  `90-input-shell.js` (keys, taps, the debug link, `window.__ss`, the page and touch controls). The pieces are cut from one function,
  so no piece runs on its own; read them as one file in that order.
- `src/vendor-react.js` is the React runtime. Leave it alone.
- `src/index.template.html` is the page around the program. It has two script slots: MODULES, then BUILD.
- `src/modules/` is new code written as real modules. `src/modules/main.js` is the entry; esbuild bundles it into its own script that runs first. `src/modules/bridge.js` is `window.SSQ`, the only meeting point with the older program: rebuilt beats register there by id. Chapter 1 is being rebuilt into modules one beat at a time, with each beat's old code deleted as it goes (the base decision: `docs/DECISIONS.md`, "Which repo is the base, 2026-11-22"). `node tools/compare-builds.mjs <git ref>` draws the same moments from that ref's build and this one and compares the pictures.

```
npm run build
npm run check-build
```

`npm run build` writes `index.html` from `src/`. `npm run check-build` fails if the committed `index.html` is not a fresh build of `src/`. The build compacts the code with esbuild but keeps every name, so a name seen in the browser can be found in `src/game/`.

To give a short name a readable one, use the rename tool. It changes only that one variable (Babel's scope analysis), never an object key or another variable with the same short name, and refuses a new name that would collide:

```
npm run rename -- k ch2 src/game/20-ch2.js:22
```

The last part is a line where the old name appears. Each rename is recorded in `tools/renames.json` (old name, new name, where, why, date), so renames can be reviewed in a pull request; `npm run rename` with nothing after it applies any entry not yet applied. Then run `npm run build && npm test`.

`src/` is the readable copy of `index.html` at commit `15051ec`, made with Prettier 3.9.10 (`--print-width 140`). `node tools/equivalence.mjs` is the one-time proof that the build is the same program as that commit. `node tools/equivalence.mjs <ref>` checks that a fresh build plays the same as `index.html` at `<ref>` (40 Enter presses in each chapter, and the Chapter 2 keyboard route).

## Debug link

Add these to the address of `index.html` to jump into the game. Without them, nothing changes.

- `?ch=2` starts Chapter 2 from the title, even if it is still locked.
- `?ch=2&phase=wash1` starts Chapter 2, then jumps to that checkpoint (the same table Reset section uses, `applyG` in `src/game/20-ch2.js`).
- `?scene=P3` starts that scene's chapter, then opens the scene.
- `&debug=1` shows a line under the game, updated four times a second: chapter, scene, phase, room, who you control, pose, the prompt, the button label, the chip, security, and the kitchen warn and peek timers. The Copy button copies it. The backtick key hides and shows it.

For example, `index.html?ch=2&phase=wash1&debug=1` opens the kitchen sink with the line showing `phase wash1` and `control Squatch`.

## Automatic checks

GitHub runs `npm run build`, `npm run check-build`, and `npm test` on every pull request and every push to main (`.github/workflows/pr.yml`). A change counts as passing only when that check is green on GitHub, not when someone says it passed on their machine. The test output (videos and screenshots) is attached to each run for 14 days. The test step uses `set -o pipefail`, so a failed suite turns the check red (before 2026-11-15 it did not, and one failure on pull request 51 showed green).

**While GitHub's checks are off (Brian, 2026-11-15):** "Until GitHub's checks run again, run the full test suite before every merge and paste the pass count in the pull request." GitHub stopped running checks on 2026-11-15 because the monthly free minutes ran out or billing needs attention. Until the check runs again, a pull request may be merged only after the full suite (`npm run build && npm run check-build && npm test`) passes on your machine and the result (for example "36 of 36 suites passed") is pasted in a pull request comment, along with Brian's yes.

## Screen fit

`tests/screen-fit.mjs` checks phone and iPad, upright and sideways: the whole picture is on screen, it does not move after the opening cards, and the big button keeps one size.

## Brian's repeat complaints, as tests (2026-11-22)

Four complaints Brian raised again and again now have tests that run with `npm test`. Each problem still in the game prints as KNOWN (it does not fail the run) until the change that fixes it takes it off the list; `g.known` in `tests/game-page.mjs` does this.
- `tests/ch1-rooms-solid.mjs`: Squatch cannot walk up the walls (feet stop at the floor line, y 256, in the hallway, the office and the redesigned Chapter 1 hall scenes) or into the office desk and filing cabinet or the loading bay plant, bin, scanner posts, mail room wall and robot mailbox. Fixed in this change; all pass.
- `tests/ch1-security.mjs`: at the party the alarm sounds and a guard walks in within 1.5 seconds, a second follows, a guard who sees him catches him, and hiding sends the guards to search his home. At the Day 2 lunch and in the loading bay at night, being seen now sounds the alarm and a guard (the party guard, with his sight cone) walks in through a door; rolling into a ball gets "They lost you.", standing still gets the LOCKUP card. While the lunch guard is coming, ROLL works anywhere.
- `tests/every-goal-has-target.mjs`: no Chapter 1 goal is marked with a yellow circle, a floor ring or an arrow. The thing to go to gets a soft yellow dashed outline that follows its shape, traced from the locked picture (`src/modules/outline.js`, targets in `src/modules/goal-targets.js`); doorways get a dashed line round the opening. KNOWN: 17 of 34 goals have no outline yet (props the game draws, Mops, close-ups, Squatch's own spot).
- `tests/ch1-restart.mjs`: ↺ never sends him to the opening, keeps him in the same part with a goal, and puts him back where the step he is on began (the game saves each Chapter 1 step the moment it hands the player control). The party and the night keep their own restarts. Each beat runs in a fresh page.

## Scene 1 morning

`tests/scene1-morning.mjs` plays the start of Chapter 1 on a phone: Mops's morning line while Squatch is in bed, one bucket, no "ship" in the goal bar, no ring around Squatch, the "That evening…" card, then the peek goal, and the peek itself: the hall full on the first frame, Squatch in his doorway, an empty goal bar, the muffled talk, then "Robots?" once before the announcement, and the sneak: seen while the yellow guest looks back sends Squatch to his doorway; going while he faces the stage and pressing HIDE at the plant hides him.

## Chapter 1 kid robot

`tests/ch1-kid-play.mjs` plays all of Chapter 1 on a phone-size screen by touch, the way a kid would, from waking up to the score card. It runs with `npm test`. `npm run kid-video` also saves a video in `tests/out/kid-play/chapter-1.mp4`. Problems it meets that are already listed in `docs/CHAPTER-1-PROBLEMS.md` print as KNOWN; anything new fails the run. That file ranks the Chapter 1 problems, each with its cause and the check that proves the fix. `docs/START-HERE.md` is the one-page handbook for whoever works on the game next.

## Phase 1: kitchen and diner clarity

Branch `phase-1-kitchen-clarity` makes Chapter 2 clear to a 10-year-old (plan section 3, tasks T5 to T12). Every new line the player reads is listed for Brian in `docs/PHASE-1-LINES-FOR-BRIAN.md`.

- The goal chip names who acts and what to do, from one table (`CH2_CHIPS`), and hides while a bubble is up. `tests/ch2-goal-chip.mjs`.
- Every switch between Squatch and Mops goes through `switchTo` and, in Chapter 2, shows a card with the reason; room changes show one short line. (A "YOU:" tag over the picture was removed in Phase 2 at Brian's request.) `tests/ch2-switch.mjs`.
- In Chapters 2 to 4, a room change through a door walks the character out, draws the new room, and walks them in from that door's side. Control is off during the walk. The captions are the same words. The Chapter 2 opening and the walk out to the fuel pump are unchanged. `tests/room-walk.mjs`.
- Squatch no longer says "A hoof stamp. Mops signed it." at the soup note, so Chapter 4's "Then who were the Guardians?" is still a question. The note, the Guardians line, the hoof-stamp picture, and "...Eat up, kiddo." stay. `tests/soup-note.mjs`. `docs/LATER-CHAPTERS-LINES-FOR-BRIAN.md`.
- Every Chapter 2 state offers a way forward (BACK · kitchen, Squatch in control after the soup, g4l resets to the next dishes) and Squatch is out of sight while Mops is out front. `tests/ch2-next-step.mjs` writes the action table to `tests/out/next-step.json`.
- No capture while the player is Mops; a shoo costs no stars; the LOCKUP card says who saw Squatch and where. `tests/ch2-capture-cause.mjs`.
- Speech bubbles sit over the speaker, one at a time; a voice from another room gets an ear at the door. `tests/bubble-anchor.mjs`.
- The soup bowl rests on Mops' head, with steam and a spoon. `tests/soup-on-head.mjs`.
- Every Chapter 2 action reads "VERB · thing" on the button and the picture, in letters at least 16 px. `tests/action-labels.mjs`.
- The help line names only controls that work. `tests/help-text.mjs`.

Test hooks added for these: `__ss.resetTo(phase)`, `pickAct()`, `walkBounds()`, `drain()`, `sqAway()`, `CH2_CHIPS`, `ch2ChipKey()`, `lastBubble`, `bubbleFrame`. `tests/game-page.mjs` is the shared start-up code for the new suites.

## Phase 2: tests, dead engine out, files by chapter, rings, captions

Branch `phase-2-structure` (plan section 4, tasks T13 to T18). Every new line the player reads, and every place a ring moved, is listed for Brian in `docs/PHASE-2-LINES-FOR-BRIAN.md`, with what is not finished.

- `tests/ch2-playthrough.mjs` plays Chapter 2 from `?ch=2` to the tally card with real key presses (arrows, E, Enter), following `tests/routes/ch2.json`. It never writes to the game. A step stuck for 20 seconds fails with its number and the debug strip's state line. `ROUTE_LOG=1` prints each step. About 95 seconds.
- `tests/phone-tap.mjs` plays the same route's start on a 375 by 812 phone with touches only (joystick, ACTION button, a tap on the picture) through the diner and the first kitchen dish. Both use `tests/route-player.mjs`.
- The old level engine (keypad, dish mini-game, guard AI, old levels and their exports) is gone. `node tools/equivalence.mjs <ref>` shows a fresh build plays the same as `index.html` at `<ref>`.
- The source is in pieces by chapter (see "Source and build"), and `npm run rename` renames one variable safely.
- One helper, `spot` in `src/game/00-core.js`, holds every action in all four chapters: what the button says, where the player's feet must be, and the ring, which is drawn from those same numbers. `tests/ring-equals-trigger.mjs` checks every ring in 77 states.
- Every action in Chapters 1, 3 and 4 reads "VERB · thing", and those chapters have goal chips from one table each (`CH1_CHIPS`, `CH3_CHIPS`, `CH4_CHIPS`). `tests/action-labels.mjs` (all chapters) and `tests/chapter-chips.mjs`.

Test hooks added: `__ss.spotsNow()`, `placedSpots()`, `offerNow()`, `drawFrame()`, `rings()`, `inSpot()`, `chipNow()`, `chipKeyNow()`, `CH1_CHIPS`, `CH3_CHIPS`, `CH4_CHIPS`. `tests/chapter-states.mjs` holds the states the ring and caption tests share.

## Phase 3: one capture rule, phone HUD, tap to walk

Branch `phase-3-fairness-hud` (plan section 4, tasks T19 to T23, with Brian's decisions of 2026-11-07). Every new line the player reads is listed for Brian in `docs/PHASE-3-LINES-FOR-BRIAN.md`, with what is not finished.

- One capture rule in every chapter: seen, security comes, time to hide ("They lost you." if hidden), caught shows the LOCKUP card with who saw Squatch and where, then the section restarts from its checkpoint with coins and stars kept. No catch takes stars. `src/game/25-capture.js`; `tests/capture-rule.mjs`.
- The HUD is page text over the picture in fixed zones: chapter, ↺ and stars top left; the goal chip top center; the faces top right. The ↺ button (hold) replaces the big Reset section button; the sound button is under the picture. After 60 seconds without progress the chip shows how to do the step. On a phone the game sits at the top of the screen. `src/game/80-hud.js`; `tests/hud-layout.mjs`.
- The kitchen duck is press-and-hold (R105): while Gloop warns or looks, hold the action button to stay a ball and let go to stand up. A faint dashed outline shows where her look will land during the warning. `tests/kitchen-duck-hold.mjs`.
- The kitchen window warning lasts 2.5 seconds and shows: the window frame flashes and Gloop fills the window until her look ends. `tests/kitchen-warning.mjs`.
- A tap on the picture walks there when no bubble or card is up; the big button acts. `tests/phone-tap.mjs` reaches the diner with taps and the button only.
- Small feel fixes: an early tap on a bubble is kept and shown; the action clears when a scene takes control; the awards say what they were for. COOK stays as on main. `tests/feel-fixes.mjs`.
- Zoom-in cards (the opening's spotlight card) teach the first hide and the first switch in Chapter 1. `tests/zoom-cards.mjs`.

Test hooks added: `__ss.capture()`, `shoo()`, `lostYou()`, `startSec()`, `CAPTURES`, `LOCKUP_RESTART`, `hallAlarm`, `hallAlarmStart()`, `CH1_CHECKPOINTS`, `CH3_CHECKPOINTS`, `CH4_CHECKPOINTS`, `stallFor()`, `methodLine()`, `METHOD_LINES`.

## Chapter 1 pass: the night out has a purpose, switches say why

Branch `chapter-1-pass`. Merged to `main` as PR #11. "Not merged" is **Superseded**. Every new line from that pass is listed in `docs/CHAPTER-1-LINES-FOR-BRIAN.md`. The later redesign and the party are also on `main` (PRs #19 and #20). Decisions through R63 are in `docs/DECISIONS.md`. The hallway gallery (R62, R63) is not in the game yet. Words still marked NEEDS BRIAN can change.

- The night out (O3 to O6, Brian's D15): Squatch sneaks into the lobby to find out what is going on and reads a NOTICE on a brochure table ("ROBOT JANITORS COMING."). The vent's pull is drawn at all times; a tuft of fur drifts toward it, and 1.5 seconds in the pull sets off "FUR IN THE VENT!". Sightings and the vent go through the one capture rule (HIDE! into the closet, or LOCKUP and the night starts over). The notice comes back in O5, O6 and S3. `tests/ch1-lobby.mjs`.
- After the review (Brian, 2026-11-07): the notice's second line is "They take every janitor's job."; the fur tuft shows within 1.5 times the vent's circle, is twice as large and keeps moving during a chase; S3's delegation report follows what happened (vent, seen, or "all clear").
- Every Squatch and Mops switch in S9, S10 and S11 shows a switch card with a reason (the first, taught by the zoom-in card, does not). `tests/ch1-switch.mjs`.
- Order fixes: nobody says "robot" before the notice or "Wookie" before the flashback; the S6 and S7 slip peeks no longer name the hangar code; O3 and O6 have the spine's "Everybody has somebody" and "You have me".
- `tests/ch1-playthrough.mjs` plays Chapter 1 from `?ch=1` to the tally card with real key presses (and mouse clicks on the faces, since there is no switching key), following `tests/routes/ch1.json`, and must end never caught. About 4 minutes.

## Progression tests

`tests/progression.mjs` plays the real game loop in headless Chrome. It checks the hangar door, the Mars reunion, Rusty's sighting through security and a section restart, pump sight, and the closet G-sign and bucket lanes.

`tests/gas-stop.mjs` checks the gas stop on its own: security leaves when Squatch hides, Mops walks to the diner door and presses enter, the tank gauge, and that pump-bot cones stay while Rusty's cone is hidden during Mops.

`tests/kitchen.mjs` checks the cook's walk out the kitchen door, the soup bowl on Mops, the timed hoof stamp, boarding at the ship, the red EXIT door, the soup-or-gas purchase, the scrub gag, and the rumble before the cook wakes.

Soup and the tank each cost 30. The tip jar still fills with 30 when a wash set finishes. Grabbing it turns the jar into coins, and buying soup spends those coins once: Mops has soup, the jar is 0, and the register is 30. A later jar buys the gas. Cooking a ticket does not pay coins.

Pump bots call security the same way Rusty does. Hiding sends security away. Getting caught shows the holding pen and restarts the current section. Their "report him or fuel him" line stays. Cone length and patrol speed are unchanged. The singing lure is still its own setback.

On Stormtop, the fear is specific: fur clogs the air scrubbers. After that, locals are still afraid of a Sasquatch, and that fear is not the scrubber fear. Troopers, searchlights, and gate bots are the ones who lock him up. Locals are not harmless. Squatch's lines move from panic to choosing a hiding place. Sightings, cones, and prices do not get easier.

If Gloop or Blorp recognizes him at the counter, they still say their own startled line and shove him, and they call security. Gloop's kitchen window is a short uncertain look, then the cook faints and security comes. Hiding or rolling sends security away. Getting caught still restarts that section and does not touch the jar. The holding pen looks different for Rusty, the pump bots, the counter, and the kitchen window.

Each scrub in the wash shows the dish, Squatch's paw, and a sponge. A plate still being washed says DIRTY DISH. The third scrub says CLEAN DISH and stays 3/3 until the picture clears. The card closes before the wash-set line and before the greasy-pot handoff, so those spoken lines stay whole. The cook still wakes on the same timer; Squatch's stomach rumbles just before she does. Mops wears a chef hat only while he is cooking in the kitchen. The kitchen is one floor. A full-height diner door stands on the left. The sink stays on the left of a continuous counter, the service window is the middle bay (about 300 wide, where Gloop hangs the next three tickets and can pass a hand), and a four-burner range with an oven door is built into the right end. Three spice jars sit on a rack on that counter, past the burners. Mops runs the sink-to-range distance. LEAVE SOUP stays on the crate hotspot and its label sits beside the door. After the greasy pot, Mops keeps the mop and stays in the kitchen. Hold Reset section (or the R key) to return to this section's capture checkpoint. It does not pay coins or skip ahead. None of that changes the three-scrub count, the 30-coin jar, cones, or security. The kitchen drawing at `6853902` passed visual review for that drawing. Reset section is in this branch at `17a03c2`. The evidence, and what is still open, is in `docs/MASTER-BACKLOG.md`.

## Left as they were

These came up in the notes and were not given a new behavior:

- Coins are not paid per dish. The jar is 30 at the end of a wash set.
- Mops already whispers in a few lines. Nothing new was added to that.
- Character size was checked and left alone. The closet zooms both of them, the duct draws Mops smaller so he fits the pipe, and the large portrait is a close-up.
- Only the old DUCK prompts became ROLL. Hiding in a crate, a barrel, or under the bed is unchanged.
- The bots' "You watch the crate" lines stay. They happen before Gloop sends them to the dock.
- The lockup card is the jail. There is no separate jail game.
- Cook and Gloop stay two speakers.

`docs/DECISIONS.md` is the single source of truth for the story and for every other decision. `docs/story-bible.md` is the Chapter 2 kitchen revision. `docs/STORY-DECISIONS.md` is the older list of eight questions, updated so an answered item is not shown as pending. `docs/README.md` points at these, and at the section-reset checkpoints. `docs/MASTER-BACKLOG.md` is the backlog. Its register that says `main` is `9999f0cd` and PR #5 is open is **Superseded**. `main` at the start of this log was `10030f6` (PRs #7 through #11 merged). It now also has the Chapter 1 redesign (PR #19, `aed0c4f`) and the party (PR #20, `e0e16d4`). Render publishes `main`. The independent reset check from that older register is still listed on the backlog page as history.

From the repo root:

```
npm install
npm test
```

`npm test` runs every suite in `tests/` one at a time and prints one PASS or FAIL line per suite. It exits non-zero if any suite fails. To run one suite: `npm run test:one tests/kitchen.mjs`.

The tests find Chrome on their own: the `CHROME` environment variable if it is set, then Google Chrome in `/Applications` on a Mac, then `/usr/bin/google-chrome`. Set `CHROME` to use another Chrome or Chromium binary. Pictures the tests save go to `tests/out/`, which git ignores.

If `puppeteer-core` is missing, or Chrome cannot be found or started, the test prints the failed step and the command to fix it, then exits.
