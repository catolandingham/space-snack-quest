# Chapter 1 problems, ranked

Written 2026-11-13 from robot playthroughs of Chapter 1 on a phone-size screen (375 by 812, touch only). The robot is `tests/ch1-kid-play.mjs`. It taps like a kid: taps through speech, presses the big button, taps the spot it wants to reach. It reached the score card in 344, 367 and 482 seconds.

This list is ranked by how much each problem hurts a kid playing. Each one has what the kid sees, the cause in the code, the fix, and the check that proves the fix. Fix one problem per pull request, in this order, unless Brian says otherwise.

How to run the robot:

- `node tests/ch1-kid-play.mjs` plays Chapter 1 and prints what it met (6 to 8 minutes).
- `npm run kid-video` does the same and saves a video in `tests/out/kid-play/chapter-1.mp4`.
- Problems on the `KNOWN` list in that file print as KNOWN and do not fail the run. Anything else fails it. When you fix a problem, take it off `KNOWN` in the same pull request, so it can never come back unnoticed.

## Recommendation: do not rebuild Chapter 1

A kid can finish the chapter today. The problems below have ten separate, small causes. None of them needs the chapter rebuilt. Fix them in order, with the robot run after each one.

## Do first: scene 1 (beats 1–3), Brian 2026-11-14

### Current priority: finish beat 1 before moving on

Brian's Nov 16 direction overrides the older party-first ordering below. One beat at a time; no move to the next beat without his sign-off.

- Calendar (PR 58, unmerged): latest copy has MOONMUNCH / FUZZUARY; Sponsored by MOON PIES; Sock hunt; family Olympics night; Wash outside windows (remember space suit!); Blanket fort night. Brian removed calendar Homework and Sing with Mops, and asked for the small edge nibble to be a little larger. Desk homework remains approved separately. The day-two LOOK position is beside the wardrobe, not inside the bed. `tests/calendar-closeup.mjs`.
- Walking/Guardian box: PR 57 remains separate and unmerged. This calendar branch is based on main and does not include it.
- Approved but not built: closet look, bed flop/hop and their approved lines; homework at the desk to pass time after Mops leaves, with wording still awaiting approval.
- Still open: purple bed bar, bucket readability and Mops taking it to work, music. TV stays for beat 20. No clip needed.

### Home room sheet for this calendar change

- Keep the locked room picture unchanged. Calendar stays on the wardrobe door and faces away when that door is open (R31, R34). Close-up keeps its red pin, red strip, 5-by-4 grid, and circled Moon Pie.
- Optional opening inspection must not advance the day, move Squatch, start the song or overwrite the story queue. No arrows or floor ring added.
- Close-ups use a blurred room behind, a furry paw following the finger, and a white X. X must be usable on a phone. Brian now requested invented calendar names and dated decoration; these do not change story timing or the Guardian story. No new spoken dialogue.
- Delivery-day inspection must still lead into the existing lunch sequence. The bite must not erase the delivery clue.
- Review limitation: the full calendar fits a 375px portrait phone, but its reminder text is small in the game's landscape-shaped picture. Desktop copy is readable; a portrait-specific readable view is not implemented by this revision. Do not claim full phone typography sign-off from functional tests.

### Earlier scene work

Brian: make scene 1 right before anything else. The story is in `docs/CH1-STORY-WALKTHROUGH.md` beats 1–3. Four pull requests, in this order:

1. Done (tidy, no change in play): everything scene 1 runs is now in `src/game/15-ch1-scene1.js` (the start, the song, Mops walking out, the peek). `Sp` in `10-ch1.js` is an old copy kept for debug links; never edit it. The goal-bar labels still live in the `Q1` table in `12-ch1-redesign.js`.
2. Done (steady screen): the big button is one size for every label, the page no longer jumps, phone sideways fits, iPad sideways picture grows from about a third to over half the screen. Phone upright is limited by the phone's width; turning it sideways gives a picture about twice as big. Check: `tests/screen-fit.mjs`.
3. Done (morning): after the cards, short bubbles while Squatch is in bed (Brian: not a lot of text at once): Mops "Morning, Squatch." / "Big party in the hall tonight." / Squatch "Party?" / Mops "Stay in here." Squatch hops out of bed (no sliding through the frame) and walks; Mops walks to the door humming; they sing there as his goodbye (Brian yes, Nov 14); Mops leaves, a "That evening…" card, then the peek goal. The room is the locked picture from the first moment, so there is one bucket and nothing jumps when the song starts. Removed: floor arrows, "Tap the floor to walk there." (Chapter 1 only; other chapters keep it), the touch help line, the yellow polish sparkle, the "go with Mops to the ship" goal. New calendar picture (`home-room-empty-closed-v4.png`): a real calendar with the Moon Pie delivery day circled. Rule (Brian, Nov 14): no yellow ring and no "VERB · thing" tag when the action happens where Squatch stands (`actsWhereSquatchStands`). Check: `tests/scene1-morning.mjs`.
4. Done (peek): Squatch leans in at his doorway (stands in the gap of the bottom wall, half hidden), the hall is already full on the first frame, the goal bar is empty, Isfred's muffled "Mmf mmf... mm-mmf... mmf!" (Brian yes, Nov 14), then "Robots?" once. Then he walks to the plant and the announcement plays there. Check: the peek part of `tests/scene1-morning.mjs`.
5. Done (sneak): after "Robots?" the player steers Squatch from his doorway to the middle plant and presses HIDE there. The yellow guest by the door faces the stage for 3.5 seconds, turns, then looks toward the plant for 2 seconds with a sight cone (the cone covers the floor between the door and the plant, not the plant). If he sees Squatch out in the open, a red "!" shows and Squatch hurries back to his doorway to try again. Goal bar: "Squatch: sneak to the plant" (Brian yes and merged, Nov 15, pull request 48). Check: the sneak part of `tests/scene1-morning.mjs`; `ch1-playthrough` has the new "HIDE · plant".
6. Next: the party hall picture. Brian, Nov 15: the hall has many design problems apart from play. Read the room sheet and the graded list just below, then fix them in the order given there, one per pull request.

Saved for later, not now: a montage of Squatch's day (homework, things hidden around the room, lonely) and Mops checking in at night.

## Party hall: room sheet (every decision about how it looks, in one place)

Written 2026-11-15 because the hall was built from the walkthrough alone and missed decisions kept in other files. Before you change anything in the hall, read this. If you find a hall decision that is not here, add it here in the same pull request. Each line gives where it was decided.

The room
- The room is the locked picture `docs/locked-rooms/hall-room-empty-v1.png`. Never change it without Brian's yes. The yellow outline around the snack bar is part of that picture.
- Stage at the top (R6). In the picture the stage is the long brown platform under the window. It needs to read as a stage: Isfred stands on it, the mic is on it, the Croc Boys play on it.
- Big window stays where it is (R7). It shows the planet's clouds and rings (R5).
- Home door at the bottom; the way to the next room is the gap at the top of the right wall (R6).
- Speaker, FUR alarm and floor vent are spread out, one of each (R11). They are in the picture.
- Second plant mid-room (R9). It is the plant Squatch hides in (beat 4).

The banner and the poster
- Banner "ROBOTICS DELEGATION!" (walkthrough beat 3, decided; kept by Brian 2026-11-07). It hangs above the stage, not on the floor. "No banner" in R6 and OPEN-ASKS A24 means no "Convention Hall" banner; it is not about this one.
- A poster beside the stage with drawings of the robots, "COMING SOON!" (beat 5; the words still need Brian's yes). No real robots at the party (DECISIONS 2026-11-09 note).

People
- Isfred is on the stage when he speaks (beats 3, 5, 6). Never a speech bubble with nobody under it.
- Adults are clearly taller than Squatch (C10, R67). Guests are a varied mix of alien types (C11, C12: teal-jacket woman, camera tourist in a Hawaiian shirt, three-eyed backpacker, stilt-legged purple alien, octopus tourist, robot tourist).
- Before the dance, guests face the stage (beat 4: "everyone faces the stage").
- The octopus tourist (beat 12) and the photo corner with its camera (beat 13) must read as what they are when a kid first sees them.

Snack bar (Brian, 2026-11-15, R107)
- The bartender (she) works behind the counter, not in front of it.
- Squatch can hide behind the counter when nobody is back there. This matters later (beat 27, "One snack, behind the counter").
- No sign on it.
- Snacks on it are the picture's own (snack box, red snack bag, Moon Pie tin). Do not draw extra snacks on top.

Floor vent (Brian, 2026-11-15, R108; also D15, S61, A22)
- Soft swirls, always moving inward (A22). In the picture today they are still drawn and never move.
- If Squatch goes too close without his disguise, his fur drifts into the vent: first a tuft of fur lifts off him and drifts toward it (the warning), and staying in the pull sends fur in and sets off the FUR alarm (D15, S61). The old lobby night scene already does this: `lobbyTuft` in `src/game/10-ch1.js`. Reuse it.
- With the disguise on, the vent tugs the disguise instead (beat 16). No "SUCK · vent" button (problem 9).
- Nobody stands on the vent.

Light
- It is evening (beat 3 card "That evening…"). The lights dim for the band (beat 6).

Marks on screen (BRIAN-LENS)
- The thing to use glows or is outlined. Never an arrow, never a circle on the floor. Goals disappear once done.

## Party hall picture check, graded 2026-11-15

Graded on a full-size still of the hall during the peek (`?ch=1`, after "That evening…"), against the room sheet above and `docs/BRIAN-LENS.md`.

| Check | Today | Where in the code |
| --- | --- | --- |
| Stage reads as a stage, Isfred on it | Pass (2026-11-15). Isfred stands on it; his bubble points at him | `drawCh1Party` in `12-ch1-redesign.js` |
| Banner above the stage | Pass (2026-11-15) | same |
| "COMING SOON!" robot poster beside the stage | Pass (2026-11-15) | `drawCh1Party` |
| Guests face the stage | Fail. Scattered, side-on, all the same pose | `CH1_GUESTS` in `12-ch1-redesign.js` |
| Adults clearly taller than Squatch | Fail. Guests look Squatch's size | `Qt` scale at the party |
| Evening light | Fail. Looks like bright day | not built |
| Bartender behind the counter | Fail. She stands in front of its bottom corner | `Qt(880, 500, ...)` in `drawCh1Party` |
| Only the picture's snacks on the counter | Fail. Three extra small snacks drawn over the counter edge (848, 340/390/440) | `drawCh1Party` |
| Nobody on the vent | Fail. The teal guest stands on it | `CH1_GUESTS` |
| Vent swirls move inward | Fail. They are part of the still picture | not built |
| Fur goes in when Squatch is close without disguise | Fail. Not built in the hall | `lobbyTuft` in `10-ch1.js` to reuse |
| No arrow, no floor circle | Fail. Yellow arrow at bottom right points at nothing; pale yellow photo circle by the door; the goal ring around the plant | `drawDoorNudge`; `drawCh1Fest` in `14-ch1-day1.js`; `drawGoalMark` (shared) |
| Octopus and photo corner read clearly | Fail. The octopus looks like an orange stick creature; the camera stands alone on a tripod | `drawCh1Party`, `drawCh1Fest` |
| Door area clear | Fail. Photo table with a cake and the photo circle crowd Squatch's door and overlap the yellow guest | `drawCh1Fest` |
| Croc Boys readable (beat 6) | Fail. Problem 19 | |
| Window, speaker, alarm, plants, no sign on the bar | Pass | picture |

Fix order, one pull request each, each with a still compared against this table:

1. Done 2026-11-15. Stage: Isfred on the stage, banner above it, "COMING SOON!" poster beside it.
2. Snack bar: bartender behind the counter, remove the extra snacks, make the space behind the counter a hiding spot when she is not there (R107).
3. Guests: facing the stage, taller than Squatch, off the vent, out of the doorway.
4. Clutter: remove the arrow, move the photo corner away from the door, make the octopus and camera read.
5. Evening light, dimming for the band.
6. Vent: moving swirls, then the fur event when close without disguise (R108), then the disguise tug (replaces the button, problem 9).

## 1. A catch at the party leaves the game stuck in the bedroom

- What the kid sees: at the party, a guard sees Squatch. The card says "Holding pen. This part starts over." Then Squatch is back in his bedroom at the very start, the goal says to walk around the room, and nothing leads forward. The only way out is to restart the chapter.
- Seen: twice, both times after pressing a party button (SNAG, SUCK or STAND) while the guards were in the room.
- Cause: the party scene is `QA`. A catch calls `capture("s6")` (`src/game/14-ch1-day1.js` line 59). `reSec()` (`src/game/20-ch2.js` lines 528 to 537) looks up the scene in `CH1_CHECKPOINTS` (`src/game/25-capture.js` lines 204 to 221). There is no `QA` entry (and none for Q1, Q3, Q5 to Q9), so it falls back to the old saved opening, scene O1.
- Fix: add a `QA` entry that starts the party again. Then check every Q scene where a catch can happen has an entry.
- Brian answered (2026-11-14): after the jail card, set Squatch back a little, or back where he was caught, and let play carry on. No guard walking into the bedroom right away. Pull request 38 has that guard version and must not be merged.
- Proving check: empty `LEAVE_ALONE` in `tests/ch1-kid-play.mjs`, so the robot presses the party buttons. It must reach the score card. Add a short test that sets scene QA, calls the catch, and asserts the scene is not O1 and a spot is offered.
- Fixed 2026-11-16: `QA` now restarts in the party, a little back from where he was caught, with the guards gone. A Q scene with no checkpoint no longer restores the old opening. `tests/party-catch.mjs` checks it. The robot still skips SNAG, SUCK and STAND, so that half of the proving check is still open.

## 2. Tapping a spot behind furniture walks Squatch into the furniture and stops

- What the kid sees: tap the calendar. Squatch walks straight at it, bumps the bed, and stops. Nothing happens. The kid has to steer around with the stick.
- Seen every run: the calendar (stops at 286,509), hiding the slip and the spare jacket (stops at 596,515), the drawing in the passage (stops at 182,443).
- Cause: `walkTap` (`src/game/00-core.js` line 1075) sets one straight-line target. `oh()` (line 1215) gives up after half a second against anything solid. Mops also counts as solid for Squatch.
- Fix: give the tap walk a small path finder that goes around solids (the robot has one in `tests/ch1-kid-play.mjs` that can be copied), or move the stand points of those four spots so a straight line reaches them. The path finder is the lasting fix.
- Needs Brian: no.
- Proving check: remove `tap-stops-at-furniture` from `KNOWN`. The robot run must pass.

## 3. The hangar robot catches Squatch with no warning when he is close

- What the kid sees: at night in the hangar, the robot is looking the other way, Squatch walks past, and he is caught anyway. Nothing on screen showed the danger.
- Seen: 1 to 3 catches every run, more than anywhere else in the chapter.
- Cause: `ch1NightLook` (`src/game/12-ch1-redesign.js` line 225). The robot looks down for 2 seconds, turns, looks away for 4. A catch happens inside the drawn cone, and also anywhere within 70 px of the robot (`STAND_FEET`, line 191) even when it looks away. The 70 px circle is not drawn.
- Brian, 2026-11-13, after watching the playthrough video: "did you get caught? Did not make sense." He asked for it to be noted for later. The catch is at about 3:49 in the video (229 seconds into the run). The picture shows the robot's light pointing up, away from Squatch, who is standing just below the robot. A few seconds later the LOCKUP card comes up: "A robot saw Squatch in the delivery room." Nothing on screen showed the danger.
- Fix: draw the close circle, or drop the close catch while the robot looks away.
- Needs Brian: one pick between those two.
- Proving check: a test that stands Squatch 60 px behind the robot while it looks away, and asserts either no catch, or that a drawn circle is on screen (`__ss.conesDrawn()` has an item with `circle`).

## 4. The big button changes width with every label (fixed 2026-11-14)

- What the kid sees: the round ACTION button turns into a wide pill for "DANCE · circle" or "HIDE · plant", then back. Brian has asked several times for one size.
- Seen: 32 different sizes in one run, from 104 px to 200 px wide.
- Cause: `src/game/90-input-shell.js` lines 559 to 564. A label over 7 letters sets `width:auto`, `maxWidth:200` and padding.
- Fix: one fixed size for every label, with the text shrinking or wrapping to two lines inside it.
- Needs Brian: a look at the new button before it merges (picture in chat).
- Proving check: remove `button-size` from `KNOWN`. The robot run must pass.

## 5. The whole page jumps down once at the start (fixed 2026-11-14)

- What the kid sees: after the opening card, the picture and both controls drop by 126 px.
- Cause: on a phone the goal bar sits above the picture in `ss-hudbar` (`src/game/80-hud.js` line 117, 126 px tall, hidden at first). `hudLayout` (line 243) only shows it the first time the bar is needed, which is after the opening card.
- Fix: on a phone, keep the bar's space from page load and only hide what is inside it.
- Needs Brian: no.
- Proving check: remove `page-jump` from `KNOWN`. The robot run must pass.

## 6. A yellow ring is drawn around Squatch himself

- Fixed (scene 1 morning change): the ring and the white tag are skipped when the action is where Squatch stands. The kid robot now checks the ring the game really draws.

- What the kid sees: the yellow "go here" ring sits on Squatch, so it points nowhere.
- Seen: 8 times in one run (the song, the party, the gift box and others).
- Cause: `ch1MarkGoal` (`src/game/12-ch1-redesign.js` line 81) draws the ring at the first spot that has a position. Several spots are placed on Squatch's own feet.
- Fix: do not draw the ring when the spot is within about 60 px of Squatch.
- Needs Brian: no.
- Proving check: remove `ring-on-squatch` from `KNOWN`. The robot run must pass.

## 7. Squatch walks through the bed when he gets up

- Fixed 2026-11-16 (beat 1): walking around the bed snapped him sideways because the opening scene used old solid spots that did not match the picture. They now match, and Mops no longer shoves him (`tests/bedroom-walk.mjs`).
- Fixed (scene 1 morning change): the code-drawn bed and bucket were being drawn over the room picture in the wrong places. They are gone; Squatch hops off the front of the bed.

- What the kid sees: at the start Squatch slides out through the bed frame.
- Cause: scene O1 starts him at 205,438 (`src/game/10-ch1.js` line 81), which is inside the bed's solid box. The game then pushes him out to the nearest edge.
- Fix: a short get-up move to a fixed point beside the bed before control is given.
- Needs Brian: no.
- Proving check: a test that starts `?ch=1`, waits for control, and asserts Squatch was never inside a solid while moving.

## 8. Mops's sight cone lights up too soon (pull request 35, parked)

- What Brian saw: Mops's cone shows Squatch within about 2.5 seconds, with no heart. Hearts must act just like the exclamation points do.
- Cause: not found yet. Pull request 35 is parked and needs to be brought up to date with main first.
- Needs Brian: no new pick. His asks are recorded in `docs/DECISIONS.md` (R98, R104).

## 9. Party extras are buttons, and the dance circle plays itself

- What the kid sees: SNAG, SUCK and STAND show as button labels. Nothing bad happens unless the kid presses the button named after the bad thing. The dance circle runs about 30 seconds and ends the same whether the kid taps or not.
- What Brian asked for (walkthrough beat 16, his message t126u): the disguise comes off for real reasons. He walks too close to a plant and it snags, he gets near the vent, or he stands next to security. The kid's job is to stay away from those places.
- Fix: make the plant, the vent and the guard places in the room that act when Squatch walks too close. Remove the three buttons.
- Needs Brian: no new pick; this is confirmed in his own words. Say back to him what the kid will do, and show a picture, before merging.

## 10. A start-over with no card (seen once)

- In one run the score card counted 4 catches but only 3 "starts over" cards were shown. Not seen again in two later runs. Cause not found. The robot now fails the run if it happens (`start-over-without-card`).

## Day 1 does not yet play the way the walkthrough says (added 2026-11-14)

Found by reading the Day 1 code against beats 1 to 21 of `docs/CH1-STORY-WALKTHROUGH.md`. Ten beats match or are close. The ones below differ. They were found in the code (`src/game/13-ch1-slice.js`, `14-ch1-day1.js`, `12-ch1-redesign.js`), not by watching every beat on screen, so look at each on screen before fixing it. One per pull request, after problems 1 to 10, in this order unless Brian says otherwise.

## 11. Sight cones: a dashed outline that lights up, on everyone, in every scene

- Today: party guests show nothing. Guards and robots show a filled yellow cone all the time.
- What Brian decided (chat, Nov 14): every character who can see Squatch has a light dashed outline of a cone, not filled. It fills in yellow when Squatch steps inside it. Same rule in every scene, so the kid always knows who can see him and the party does not look busy.
- Brian, Nov 14: do this after scene 1 (beats 1–3) is right. Scene 1 comes first.
- Step 1, its own pull request with no change in play: move `seenCone` out of `src/game/20-ch2.js` into `60-frame-draw.js`.
- Step 2 fix: one shared way to draw a cone (dashed when Squatch is outside, filled when inside), used by guests, the bartender, guards and robots. Start with the party. Mops's heart cone (pull request 35) is a different thing; leave it alone.
- Needs Brian: no new pick. Show him a picture of the party and of one guard scene before merging.

## 12. The peek is not a peek (beat 3) — fixed Nov 14 (see "Do first" step 4)

- Walkthrough: he taps the doorway and peeks out at the party from inside. Game: pressing PEEK walks him out into the hall.
- Pull request 33 (Cursor, "Do not merge") has a version of beats 3 to 6. It also swaps all the music in the same change. Lift out only the peek and sneak parts; do not merge it whole.

## 13. Sneaking to the plant plays itself (beat 4) — fixed Nov 14 (see "Do first" step 5)

- Walkthrough: "Sneak to the plant without being seen." Game: he walks to the plant by himself.

## 14. The octopus and the photo have buttons that do the moment (beats 12, 13)

- Walkthrough: the octopus chases slowly and the kid steers away; the kid steps in front of the backdrop before the flash. Game: both work, but there is also a HUG · octopus button and a SNAP · photo button. Remove the two buttons.

## 15. Running home happens by itself (beat 18)

- Walkthrough: the kid runs home and hides; guards search; if a guard reaches him he goes to jail. Game: if the kid does nothing Squatch walks home on his own, and hiding in the hall plant ends the chase. Pull request 38 (jail card, then the bedroom) is waiting on Brian and covers the catch.

## 16. The TV story is a small TV in the room (beat 20)

- Walkthrough and Brian (t287u): cut away to full-screen story pictures. Game: three pictures on the TV set, with two captions that Brian has not approved ("Fur in the scrubber." and "Onto the ship.").

## 17. Mops finds the flyer and fur at the wrong time (beat 19)

- Walkthrough: he finds them when he walks in, then "Everyone out there has someone." / "You have me." Game: he finds them after bedtime, with a line that is not in the walkthrough ("A flyer. And fur on the floor.").

## 18. The bedtime story has no pictures (beat 21)

- Walkthrough: tap through story pictures of Mops finding the baby in a Moon Pie crate. Game: one text box.

## 19. The Croc Boys are barely there (beat 6)

- Walkthrough: the band plays in Crocs and every guest does the robot dance. Game: the lights dim for 2 seconds and three figures bob.
