# Repeat complaints: what guards them today, and the tests to write

Sources read: repeat-issues.md, the four audit reports, DECISIONS.md (2026-11-22 sections), CHAPTER-1-PROBLEMS.md, every tests/*.mjs check label, the locked hall picture, and one probe (probes/bed.mjs, picture probes/bed.png, port 9110). I did not run the suite or any other test. "Present today" comes from the audit reports and code reading unless I say "probe". Check labels are quoted from the test source.

Four facts that apply to many rows:
- No issue is fully guarded. The closest is 13 (button size).
- Three existing tests demand the things Brian rejects, so fixing issue 2 or 21 will fail them unless they are rewritten in the same change: `ring-equals-trigger.mjs` ("every usable spot with a place drew its ring"), `every-goal-has-target.mjs` (every goal "has a highlighted target"), and `ch1-playthrough.mjs` (the action list `JUMP · balloon`, `GIVE · balloon`, and the balloon checks). Squatchbot said this itself (S#1290).
- `locked-rooms.mjs` locks the hall picture as it is today. That picture holds the long bar running to the hallway door and the painted yellow outline round the bar (I looked at `docs/locked-rooms/hall-room-empty-v1.png`). So that test protects issues 10 and 7's "bar lit up" until the new hall picture is locked.
- `ch1-kid-play.mjs` never presses SNAG, SUCK or STAND (`LEAVE_ALONE`), never steps into a cone on purpose, and its only KNOWN item is `tap-stops-at-furniture`. It cannot see party catches or security timing.

## Table

| # | Issue | Guard today | Present in v1 today | Still wanted | Test to write or PERSON CHECK |
|---|---|---|---|---|---|
| 1 | Sound and music | PARTIAL: slice-p6 (theme plays title, home, gift), phone-tap (AudioContext runs after touch), opening-song (music stops while singing) | Partly: one mp3, no music in party or sneaky or chase, no speaker, no notes | Yes, plus new speaker morning | Sound-log test (new `sound-cues.mjs`) + PERSON CHECK for how it sounds |
| 2 | Outline, not circle or arrow | NONE (existing tests require rings) | Yes: circle r54 `drawGoalMark`, yellow triangle `drawDoorNudge` | Yes; outline only the required thing, none on optional | `outline-not-circle.mjs` |
| 3 | Eyes in the plant, thought above | NONE | Cannot tell: hidden position (220,530) differs from drawn eyes `ga(400,500)` | Yes, "the very original" eyes | `plant-eyes.mjs` golden crop after Brian approves one still |
| 4 | Rooms differ from locked | PARTIAL: locked-rooms (9 empty pictures, 2% pixels), locked-art (sha256 and "still drawn") | Partly: pictures match; home picture has no speaker; props and play differ | Yes, and two new locked versions coming | Extend locked-rooms to rooms as played |
| 5 | Vent | PARTIAL: ch1-playthrough ("the home floor vent is gone"), ch1-lobby (tint, tuft, alarm in night lobby) | Partly: bedroom clean; hall swirls still, button SUCK, no pull | Yes | `vent-hall.mjs` |
| 6 | Security late or missing | PARTIAL: capture-rule, party-catch, ch1-lobby | Yes: no timing check; home catch has no card; witness walks to a floor point | Yes; witness runs to wall alarm | `ch1-security-timing.mjs` |
| 7 | Things with no cause | PARTIAL at best: capture-rule ("every captor has a lines-file row") covers catch causes only | Partly: ring on optional spot, timed camera flash, painted bar outline | Yes | `no-uncaused-marks.mjs` + PERSON CHECK |
| 8 | Characters drawn wrong | NONE | Cannot tell | Yes; v1 characters stand, six approved guests | Golden sprite sheet, PERSON CHECK to approve |
| 9 | Scenes jump, follow-Mops slow | PARTIAL: ch1-playthrough ("every room change walks off and walks in", "walks stay on the picture"), bedroom-walk (step size) | Partly: peek is a room switch; Nov 15 jump to bush | Yes | `transition-steps.mjs` |
| 10 | Bar too long, blocks hall door | NONE (people-scale only checks heads clear the counter; locked-rooms locks the problem) | Yes (picture viewed) | Yes, via new hall picture | Geometry test in party-solid |
| 11 | Walking through things | PARTIAL: party-solid (10 checks), mops-solid, ch1-fixes, bedroom-walk, kid-play | Partly: party hall fixed in PR 55; window sill, all guests, other rooms, character-through-character open | Yes | `room-solid-sweep.mjs` |
| 12 | Character sizes | PARTIAL: people-scale ("adult head is 82-88% of that room's door", 13 checks) | Partly: Brian still says guests massive; cutscenes not measured | Yes | Extend people-scale to all beats + PERSON CHECK |
| 13 | Action button size, screen jump | PARTIAL (strong): screen-fit ("the big button kept one size", 4 sizes, chapter start), kid-play ("no button-size", "no page-jump", phone, whole chapter), slice-p6 | No, as far as the robot sees (not run) | Yes | Add iPad run to kid-play; hide and party buttons |
| 14 | Alarm and speaker on the wall | NONE | Partly: on the wall in hall picture; home has no speaker; one-per-room unchecked | Yes | Wall-band test; PERSON CHECK for "classic alarm" look |
| 15 | Isfred on stage, camera, banner, tag | PARTIAL: party-stage (banner, poster, Isfred pixel on stage, bubble tail) | Partly: stage and banner pass; guests face right not stage; name badge only in dead code | Yes | Add to party-stage |
| 16 | Text and figures overlap | PARTIAL: canvas-text (text vs text over 25%, 1024x768 and 768x1024), hud-layout (HUD boxes) | Cannot tell | Yes | Phone size and figure-vs-figure checks |
| 17 | Sight cones | PARTIAL: cone-match (drawn cone equals seeing area for six cases and the hall bot) | Yes: only the sneak watcher and raid guards have one, solid yellow | Yes, rule changed (dashed then yellow, everyone) | `cones-everyone.mjs` + PERSON CHECK still |
| 18 | Stuck, no way out | PARTIAL: kid-play ends at tally; reliability; every-goal-has-target | Partly | Yes | Dead-end sweep |
| 19 | Calendar | PARTIAL (strong, Day 1): calendar-closeup (29 checks) | Day 1 no; Day 2 art differs from design | Yes; Day 2 required with outline | Day 2 checks + PERSON CHECK for look |
| 20 | Croc Boys and dance | NONE | Yes: no band drawn, dim code dead; touch scoring disputed | Dance out for now; Croc Boys still wanted | Absence test now; band test later |
| 21 | Balloon | PARTIAL: ch1-playthrough balloon state checks (guards the thing Brian rejected) | Yes: old button version | Out for now | Absence test; rewrite old checks |
| 22 | Dress-up drag and drop | NONE for dragging (slice-p6 covers only the Go fade) | Partly: drag exists, but robot route uses SHUFFLE; pieces snap | Yes | Touch-drag test |
| 23 | Purple bar on bed | NONE | Yes (probe: purple bar across Squatch on the bed, probes/bed.png) | Yes, the bar goes | Pixel test, ten lines |
| 24 | Fix process, one list | PARTIAL: locked-art, section-index, tuning-pins | Yes, by Brian's account | Yes | Register test |

Count: 0 fully guarded, 15 partly (1, 4, 5, 6, 9, 11, 12, 13, 15, 16, 17, 18, 19, 21, 24), 9 unguarded (2, 3, 7, 8, 10, 14, 20, 22, 23). PERSON CHECK is the main method for 5 (1, 3, 8, 17, 19) and an extra look for 12, 14, 15, 20, 21.

## One block per issue

### 1. Sound and music
- Guard: slice-p6 "Joe's theme is requested and plays for the title, home, and the gift"; phone-tap "after the first joystick touch, the AudioContext is running and the icon shows on"; opening-song "singing or music, never both". Misses: no test records any effect. `window.__ss.SFX` (the effect table) is exposed but no test uses it. Nothing checks the alarm sound, snoring in the crate, laughing at the party, robot noises, the Wookiee voice, or music in the party and chases.
- Present: partly. 00-core.js has Web Audio effects and one file, `music/main-theme-from-brian.mp3`. Audit beat 2: no speaker, no notes from a speaker, no "favorite song" line. The Floating in Space recording is not in the repo (music/ holds only the main theme).
- Still wanted: yes. New decision adds a wall speaker that announces and plays the song while Mops sings.
- Test (new `sound-cues.mjs`, ports free, 1100x800 and 375x812): wrap each `ss.SFX.*` and `ss.wookVoice` with a counter, play the Ch1 jump beats with `ss.ch1JumpBeat(n)` and ticks, and assert per beat: alarm sound at the alarm pull, snore while in the crate, a laugh cue at the party, an announcement cue in beat 1, a robot sound when Mops's janitor robot is on screen. Also assert `ss.music` is not empty in the home, party and chase rooms, and that `ss.audio().state === "running"` after one touch. Speaker notes: assert a note shape is drawn near the speaker only while a sound cue is active (pixel diff of the speaker box, on and off).
- PERSON CHECK: how the Wookiee roar sounds (Brian wanted a real one, not a whoopee cushion). Brian needs to hear a 20 second recording of each cue, one per beat.

### 2. Outline, not circle, ring or arrow
- Guard: NONE. Worse, `ring-equals-trigger.mjs` "every usable spot with a place drew its ring" and `every-goal-has-target.mjs` require rings. `scene1-morning` "no yellow ring around Squatch for the song" and kid-play "no ring-on-squatch" only guard one ring location.
- Present: yes. `drawGoalMark` strokes `#ffcf33`, radius 54, width 6 (12-ch1-redesign.js), `drawDoorNudge` draws a yellow triangle, and it rings the first non-hot party spot even when optional (audit beats 3, 4, 9). Brian saw it again on Nov 15.
- Still wanted: yes, and the decisions sharpen it. Only the next required place gets a soft dashed outline traced round the real object, outside it; optional things (closet, bed, calendar) get none; goal words appear only after about 20 seconds of nothing.
- Test (new `outline-not-circle.mjs`, rooms: home, peek door, plant, party flyer, Day 2 calendar and lunch, loading bay, office; sizes 375x812 and 960x640): wrap `CanvasRenderingContext2D.arc` and `fill` and record calls whose style is yellow. Fail on any yellow-stroked arc with radius 40 to 70 or any yellow filled triangle. Pass only if one yellow dashed path (`setLineDash` non-empty) has a bounding box that contains the target object's box (from the spot or solid hook) with a margin, and its centre is not Squatch. In states with only optional things, assert zero yellow pixels beyond the room picture. Rewrite ring-equals-trigger so it checks "standing in the outline offers the action" and drops "must draw a ring".
- Also add the 20 second rule: idle 19 s no goal line, 21 s a line appears in the top-centre chip.

### 3. Eyes in the plant, thought above the plant
- Guard: NONE (grep for eyes in tests finds nothing).
- Present: cannot tell without Brian's reference; audit marks it NOT CHECKED. A mismatch exists in code: hidden coordinates (220,530) versus the eyes drawn with `ga(400,500)`. Brian reported it on Nov 15 in the party plant.
- Still wanted: yes ("The very original" eyes, picture to Brian first).
- Test (new `plant-eyes.mjs`): after Brian approves one still, store the cropped plant area as `tests/data/plant-eyes.png`. In every room with a hide plant (party hall plant, the others the audit lists), hide Squatch and compare the crop with the golden (like locked-rooms, share of differing pixels under 2%) at 375x812 and 960x640. Also assert the eyes' pixel centroid sits inside the plant's box, no fur-brown pixels outside the leaves, and `ss.lastBubble` tail x inside the plant box and y above its top.
- PERSON CHECK first: Brian looks at one still of the candidate eyes from the earliest approved commit before the golden is stored.

### 4. Rooms differ from the locked version
- Guard: locked-rooms "<room> matches its locked picture" (nine empty pictures); locked-art "<name> matches its locked sha256", "<id> still points at <name>". Misses: the rooms as played (props, furniture, wardrobe, bucket, TV, mop bucket, door gaps), every scene mapping to a locked picture, and the moment a scene switches rooms (the "room that no longer exists", hallway and loading bay physics).
- Present: partly. The empty pictures match. The home picture lacks the approved speaker (audit beat 1). Which rooms differ in play is not measured.
- Still wanted: yes. Two new locked versions (home with speaker, hall without the painted bar outline and with the moved bar) must replace the old ones with Brian's yes.
- Test: extend locked-rooms to full-frame comparison with characters hidden: for each Ch1 scene id, draw the frame, mask the character and speech areas, and diff against a stored golden of the room as played (stored once Brian approves). Add a check that every Ch1 scene's `room` appears in `LOCKED_ROOMS` and that no non-locked room draw function is called in Ch1 (wrap the old draw functions and fail if called).

### 5. The vent
- Guard: ch1-playthrough "the home floor vent is gone" (one colour sample); ch1-lobby "the pull is drawn before it can bite", "within 1.5 times the circle the tuft shows before the clock starts", "staying in the pull ... security comes" (night lobby only). Misses: party hall vent, "nothing happens near a vent", swirls moving, vent size, any vent alert in the bedroom.
- Present: partly. Hall vent swirls are painted in the still picture and never move, the vent tug is the SUCK · vent button (CHAPTER-1-PROBLEMS table, audit beat 16). Bedroom: probe shows no vent.
- Still wanted: yes (decision 6: trigger by walking near, buttons go).
- Test (new `vent-hall.mjs`): at party, no disguise: walk Squatch to 2x the vent radius, assert nothing; to 1.5x, assert tuft state shows with no action button; stay, assert FUR alarm. With disguise: assert the hat tilts then flies. Draw two frames 0.5 s apart and assert the pixels inside the vent box change while pixels outside do not (swirls move). Bedroom: sweep Squatch over the old vent spot, assert no vent state or alert.

### 6. Security does not come, comes late, or does not jail
- Guard: capture-rule ("Chapter 1 deck: the guard reaches Squatch and the LOCKUP card names the tourist", "Chapter 1 hall alarm: hidden for 2 seconds shows \"They lost you.\"", "after a restart there is no catch for 2 seconds"), party-catch ("the lockup card shows before he is set back in the party"), ch1-lobby (alarm, security, lockup in the night lobby). Misses: no time limit from sighting to the guard entering, nothing about the witness running to the wall alarm, no test of the home-room catch, none of Day 2 lunch sneak, party raid with a standing Squatch.
- Present: yes in places. Audit beat 17: guest runs to a floor point, not the pull station (about x 892, y 164); beat 18: a catch at home has no jail card (`ch1Escort`); beat 25: seen at lunch sneak gives lockup, not an alarm run; beat 42: instant lockup.
- Still wanted: yes ("Ch 1 wall, later shout"; every catch shows the lockup card then restarts the scene).
- Test (new `ch1-security-timing.mjs`): for each sighting site (plant sneak, party, home search, Day 2 lunch sneak, night robot) trigger a sighting via the hooks, tick in 0.05 s steps, and record: seconds until the witness reaches the alarm's coordinates, seconds until guards enter, and the card. Assert the witness ends within 40 px of the pull station, guards arrive within a tuning-pin limit (Brian's "way sooner"), standing still gives the lockup card in every room including home, hiding gives "They lost you." Run each site five times and assert the timings are identical (the inconsistency complaint, S#398).

### 7. Things appear with no cause
- Guard: NONE for marks (capture-rule only checks catch cause lines).
- Present: partly: audit shows a ring on optional things and the timed camera flash (a 6 s timer, flash with no tourist drawn) and the painted bar outline in the locked hall picture ("The bar is lit up for no reason").
- Still wanted: yes (rule: nothing pops up without a cause).
- Test (new `no-uncaused-marks.mjs`): idle Squatch far from everything in each Ch1 room for 60 game seconds. Count yellow pixels and "!" or "FUR" marks per frame. Assert none appear unless an event record exists (sighting, fur loss, required goal outline). This needs one small hook, a `ss.causes` log that sighting and alert code writes to, so the test can say "this mark had no entry". Camera flash: assert a tourist and the red light are drawn before any flash.
- PERSON CHECK: whether a given cause "makes sense" to a child; one recording of the party with the camera.

### 8. Characters drawn wrong
- Guard: NONE (people-scale checks sizes only).
- Present: cannot tell; audit did not judge drawings. Brian's "six party guests" were never shown to him (S#1343).
- Still wanted: yes (v1 characters stand, per DECISIONS).
- Test: render each character (Squatch, Mops, six guests, Isfred, octopus, bartender, guards) at fixed size via a hook onto a plain background and compare to approved crops, as locked-art does with sha256 for pictures. File: new `character-sheet.mjs`.
- PERSON CHECK: Brian approves one contact sheet of all figures once; that sheet becomes the golden.

### 9. Scene changes jump; follow-Mops slow
- Guard: ch1-playthrough "every room change walks off and walks in" (walks at least 12), "walks stay on the picture"; bedroom-walk "no jumps while walking around the bed". Misses: follow-Mops timing, the peek's room switch, "jumped to this scene", the Nov 15 jump near the bush.
- Present: partly (audit beat 3: peek swaps room by `ch1Go`; Nov 15 transcript).
- Still wanted: yes.
- Test (new `transition-steps.mjs`, via route-player): sample every character's position each frame across every scene change in Ch1; fail on any step over a limit unless black is at least 0.9 for the frame. Follow-Mops: when Mops starts leaving, assert the FOLLOW offer appears while Mops is still on screen and within 0.5 s.

### 10. Snack bar too long, blocks the hallway door
- Guard: NONE. people-scale "back-row heads clear the snack counter" is about heads. party-solid keeps the counter solid.
- Present: yes. The picture shows the L-shaped bar reaching the doorway gap at the right wall.
- Still wanted: yes; new locked hall picture moves the bar (DECISIONS, Locked pictures).
- Test (add to party-solid): from the solids hook take the bar's box and the hallway door box; assert a gap of at least Squatch's width (about 60 px) between them, that a flood fill over the solids finds a walkable path from the bar front to the door and behind the bar, and that the octopus's rest box does not touch the bar box. Runs at 960x640. Update locked-rooms golden at the same time.

### 11. Walking through or climbing on things
- Guard: party-solid ("walking up into the stage stops in front of it", walls, bar, guest at (250,460), balloon kid, plant, table), mops-solid, ch1-fixes, bedroom-walk, kid-play ("no squatch-in-furniture"). Misses: the window, the person at the bar, all guests, the bartender, the stage sides, the hallway, office, bay, robots and guards passing through each other.
- Present: partly (Nov 15 recording predates or overlaps PR 55; Grok K#312 saw stacking in the snack hall).
- Still wanted: yes.
- Test (new `room-solid-sweep.mjs`): for each Ch1 room at 960x640, drive Squatch into every direction from a grid of 40 points and assert his feet never end inside any character box, in any solid, or above the floor line taken from the locked picture. Add a character-pair check: any two characters in the same room keep at least 40 px between feet through a scripted scene.

### 12. Character sizes
- Guard: people-scale "<room> adult head is 82-88% of that room's door", "party guests do not overlap Squatch or each other", plus an iPad run. Misses: animals shrinking in cutscenes, the crate cutscene, the lobby, zoomed scenes, and size jumping between frames.
- Present: partly. The ratio rule passes by construction; Brian's complaint is that guests look massive, which is a judgment.
- Still wanted: yes.
- Test: extend people-scale to every `ch1JumpBeat(1..61)` scene: measure drawn heights through a hook and assert the ratio to the room door stays in band and does not change more than 5 percent between consecutive frames unless a zoom flag is set.
- PERSON CHECK: Brian sees one party still next to the door and says if the ratio looks right.

### 13. Action button changes size, screen jumps
- Guard: screen-fit "<name>: the big button kept one size", "<name>: the picture did not move after the opening cards" (four sizes, chapter start only); kid-play "no button-size", "no page-jump" (phone, all of Ch1, but never presses SNAG, SUCK, STAND or the hide buttons); slice-p6 "the picture stays put when NEXT hides".
- Present: no, as far as the robot sees (I did not run it).
- Still wanted: yes.
- Test: run kid-play at iPad size too and with `KID_AVOID=` empty in the suite; add the same measurement to the hide, sneak-out and dress-up Go states.

### 14. Alarm and speaker on the wall, one per room
- Guard: NONE.
- Present: partly. In the hall picture both are on the back wall (I viewed it). The home room has no speaker. The alarm pull close-up exists.
- Still wanted: yes (new home picture adds the speaker).
- Test: for each room, read the alarm and speaker boxes from hooks; assert their feet are within the wall band above the floor line and that each room has at most one of each. Also the witness ends at the alarm (see 6).
- PERSON CHECK: whether it looks like a classic red wall alarm; one still.

### 15. Isfred on stage, camera faces stage, banner hangs, tag reads as a tag
- Guard: party-stage "the banner hangs above the stage", "Isfred is drawn on the stage", "Isfred is not also standing among the guests", "Isfred's line points at the stage". Misses: guests facing the stage, camera direction, the name tag.
- Present: partly. Stage, banner and poster pass. Guests are drawn facing right. The Isfred name badge exists only in dead code `drawCh1SliceParty`.
- Still wanted: yes.
- Test (add to party-stage): at beat 5 every guest's facing points toward the stage centre; the camera tripod faces the stage; a tag-coloured box with text is drawn within 40 px under Isfred, backed (no floating text: canvas-text overlap check passes).
- PERSON CHECK: the tag look.

### 16. Text and figures draw on top of each other
- Guard: canvas-text "no new canvas-text failures" (text vs text over 25 percent, at 1024x768 and 768x1024, Ch1 states including party, dress-up, mini-game); hud-layout "no two HUD boxes overlap" (375x812 and 1100x800). The allow list is empty. Misses: text over figures, figure over figure (octopus on the bar, label under a character), phone size for canvas text.
- Present: cannot tell. The locked picture has the bar at the right wall and the octopus nearby.
- Still wanted: yes.
- Test: run canvas-text also at 375x812; add figure-box overlap for named pairs (octopus and bar, guests and Isfred label, SING button and Mops).

### 17. Sight cones
- Guard: cone-match "<name>: N sample points, the drawn cone and the seeing area agree" and "Chapter 1 hall bot ...". Misses: that every watcher has one, dashed then yellow, "?" then "!", hearts for Mops, different directions.
- Present: yes. Audit beats 4 and 8: only the sneak watcher (solid yellow) and raid guards; no "?" anywhere.
- Still wanted: yes, and the rule changed (dashed outline until Squatch is inside, then yellow; guests "?" then "!"; guards and robots "!" at once; Mops hearts). Decision also says first show Brian one still of the hall with every cone dashed.
- Test (new `cones-everyone.mjs`, hall at 375x812 and 960x640): every character in `CH1_GUESTS`, bartender, guards, robots has a cone record; with Squatch outside, `setLineDash` is non-empty and fill is none; move him inside, fill turns yellow within one frame; guest mark goes "?" then "!" after the tuning-pin seconds; guards and robots "!" at once; Mops shows hearts; at least three different cone angles in the hall; cone-match extended to the same cones.
- PERSON CHECK: the one still for Brian (cones all dashed, phone and iPad) before it is built.

### 18. Stuck with no way out
- Guard: ch1-kid-play ends at the tally ("kid play: no not-finished"), reliability (reset stays on scene, ↺ shown), every-goal-has-target, gas-stop and kitchen suites for Ch2. Misses: the repeated catch loop (K#180), the Q-scene reset fallbacks, the Nov 6 diner trap.
- Present: partly. CHAPTER-1-PROBLEMS problem 1: scenes Q1, Q3, Q5 to Q9 have no checkpoint, so ↺ falls back to O1 (`CH1_CHECKPOINTS` in 25-capture.js lists only O4, S1L, S4, S6, S7, S7b, S9, S11, Q4, QB, QA).
- Still wanted: yes.
- Test: dead-end sweep (extend route-player): from each state in chapter-states.mjs, play 90 game seconds with a random valid input mix and assert progress changes or a working ↺ exists; five catches in a row in any scene must not repeat forever (cap the catch count). Run kid-play a second time with `KID_AVOID=` empty.

### 19. Calendar
- Guard: calendar-closeup, 29 checks at the tag sizes ("tapping calendar opens close-up", "close-up is actually drawn (red header across center)", "invented months and sponsor are actually printed", "open wardrobe does not expose calendar front", "day-two calendar uses close-up", "visible NEXT button closes the day-two inspection"). Misses: Day 2 "today circled" and the delivery word, and whether it looks like a calendar.
- Present: Day 1 no (probe shows a calendar on the closet). Day 2: audit beat 23 says art does not say DELIVERY and the ring is code to remove.
- Still wanted: yes; Day 2 required with a soft outline and today circled (design call 13).
- Test: add to calendar-closeup: on Day 2 the printed text contains the delivery word and a circle shape on today's date; the outline (not a ring) is present and Day 1 has none.
- PERSON CHECK: one still of each close-up.

### 20. Croc Boys and the robot dance
- Guard: NONE. canvas-text only draws the mini-game state for text overlap.
- Present: yes for the band (audit beat 6: line plays, no band drawn, dim code dead). The dance: audit says four big buttons score points; Grok K#351 says taps score 0. They disagree, so cannot tell without a touch probe.
- Still wanted: dance is out for now (Brian, 2026-11-22). Croc Boys on the stage in beat 6 stay wanted.
- Test: now, an absence test: no DANCE spot and no dance button offered. Later: band test (three figures drawn on the stage when Isfred says the band's name). If the dance returns: a touch-robot test, taps on the buttons raise score above 0, and the music cue is active.

### 21. Balloon
- Guard: PARTIAL by the wrong things: ch1-playthrough "a balloon that reaches the ceiling only makes the kid sad", "bringing the balloon back keeps the disguise...", "keeping the balloon makes the kid yell...". They guard the old button version.
- Present: yes, that old version (audit beat 15).
- Still wanted: out for now.
- Test: absence test (no `JUMP · balloon` spot); remove the old balloon checks and the three balloon entries in `wantActs` in the same change. When rebuilt: one simple rule the touch robot can play.

### 22. Dress-up as drag and drop on white
- Guard: NONE for dragging. ch1-playthrough uses `SHUFFLE · outfit`, which skips the drag. slice-p6 covers only the Go fade.
- Present: partly. Audit beat 7: white background, drag exists but pieces snap to fixed spots within 180 px of Squatch; Shuffle fills the meter at once.
- Still wanted: yes (Drag-on close-up; pieces stay where dropped on him; dropped off him they slide back).
- Test (new `dress-up-drag.mjs`, 375x812, touch): a tap on a piece does not put it on; a drag from the tray onto Squatch raises the meter by a fixed amount; the piece draws where it was dropped; a drop off him returns it; the Go button appears only when full; corner pixels are white.

### 23. Purple bar on the bed
- Guard: NONE.
- Present: yes. Probe at the first control frame of the opening (probes/bed.mjs, picture probes/bed.png): a purple rounded bar lies across Squatch's chest on the crate bed.
- Still wanted: yes.
- Test: in scene O1 at 375x812 and 960x640, count purple pixels (blue above red by 30, red above green by 20) inside Squatch's box while he sits; require under 20 and no object drawn over his body. Put it in scene1-morning.

### 24. The fix process
- Guard: locked-art (locked files and still-drawn check), section-index, tuning-pins, capture-rule's no new capture path. Nothing ties a complaint to a test.
- Present: yes, by Brian's account.
- Still wanted: yes.
- Test (new `repeat-register.mjs`): a data file `tests/data/repeat-register.json` mapping each of these 24 issues to a test file and a check label; the test fails if the file or label is gone, or if the label is listed as known or skipped. Add a source scan that fails if a test asserts a banned thing (a ring or a circle around a goal). Add a test that `docs/MASTER-BACKLOG.md` lists every issue id once.

## ONCE-SEVERE items

- G#108 "major step backward in the first playable scene" (bed crowded, door unreachable). Guard PARTIAL: bedroom-walk ("he gets behind the bed", "he gets in front of the bed"), scene1-morning (peek goal reached), kid-play (reaches the tally). Present: no; the probe frame shows the door side clear. Test: a flood fill from Squatch's start to every required spot in each room (add to every-goal-has-target as "target is reachable by walking").
- Rewind button did not work after being moved into a new section. Guard PARTIAL: hud-layout "holding ↺ restarts the section", reliability "Chapter 1 reset stays on that scene" (S5 only). Present: yes for Q1, Q3, Q5 to Q9 (no checkpoints, see 18). Test: for every Ch1 scene id that gives control, hold ↺ and assert same scene, control back, goal chip non-empty.
- "Take robot flyer" in the middle with nothing there. Guard PARTIAL: every-goal-has-target says a target is highlighted, not that an object is drawn. Present: cannot tell (the flyer's drawing was not checked). Test: for each goal, pixel-diff the target area against the empty room and require drawn content within the outline.
- Follow-Mops delay ("people will delete the game"). Guard NONE. Test: see 9.
- Bot-found: caught again and again in the Hide loop (K#180). Guard PARTIAL: capture-rule "Chapter 1 <scene>: after a restart there is no catch for 2 seconds". Present: cannot tell. Test: see 18.
- Bot-found: the dance cannot be scored by touch. Dance is out; see 20.

## Priority order for writing the tests

First (came back after a claimed fix, can be judged by a machine):
1. #2 outline-not-circle, with the ring tests rewritten in the same change. Most repeated (13 times), claimed fixed four times, and the current tests protect the wrong thing.
2. #10 bar geometry plus the new hall golden. Asked four or more times; the current test locks the fault.
3. #6 security timing, across all sighting sites. Twelve mentions, claimed fixed repeatedly.
4. #11 solid sweep.
5. #9 transition steps and follow-Mops timing (also the follow-Mops once-severe).
6. #18 dead-end sweep and the ↺ fallback test (also the rewind once-severe).
7. #5 vent in the hall.
8. #17 cones on everyone (after Brian sees the one still).
9. #3 plant eyes golden (after Brian approves one still).
10. #12 sizes in every beat, #4 rooms as played.

Second (cheap, present today, not a comeback):
11. #23 purple bar (ten lines, fails today).
12. #22 drag test, #7 no uncaused marks, #14 wall band, #15 stage additions, #16 phone and figure overlaps.
13. #13 iPad kid-play, #19 Day 2 additions.

Last or when the feature returns:
14. #1 sound-cue log (mechanical part can go earlier; sound quality is by ear), #8 sprite sheet golden, #20 and #21 absence tests now and real tests when rebuilt, #24 register.
