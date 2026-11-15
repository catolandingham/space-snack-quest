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

Brian: make scene 1 right before anything else. The story is in `docs/CH1-STORY-WALKTHROUGH.md` beats 1–3. Four pull requests, in this order:

1. Done (tidy, no change in play): everything scene 1 runs is now in `src/game/15-ch1-scene1.js` (the start, the song, Mops walking out, the peek). `Sp` in `10-ch1.js` is an old copy kept for debug links; never edit it. The goal-bar labels still live in the `Q1` table in `12-ch1-redesign.js`.
2. Done (steady screen): the big button is one size for every label, the page no longer jumps, phone sideways fits, iPad sideways picture grows from about a third to over half the screen. Phone upright is limited by the phone's width; turning it sideways gives a picture about twice as big. Check: `tests/screen-fit.mjs`.
3. Done (morning): after the cards, short bubbles while Squatch is in bed (Brian: not a lot of text at once): Mops "Morning, Squatch." / "Big party in the hall tonight." / Squatch "Party?" / Mops "Stay in here." Squatch hops out of bed (no sliding through the frame) and walks; Mops walks to the door humming; they sing there as his goodbye (Brian yes, Nov 14); Mops leaves, a "That evening…" card, then the peek goal. The room is the locked picture from the first moment, so there is one bucket and nothing jumps when the song starts. Removed: floor arrows, "Tap the floor to walk there." (Chapter 1 only; other chapters keep it), the touch help line, the yellow polish sparkle, the "go with Mops to the ship" goal. New calendar picture (`home-room-empty-closed-v4.png`): a real calendar with the Moon Pie delivery day circled. Rule (Brian, Nov 14): no yellow ring and no "VERB · thing" tag when the action happens where Squatch stands (`actsWhereSquatchStands`). Check: `tests/scene1-morning.mjs`.
4. The real peek: problem 12, beat 3.

Saved for later, not now: a montage of Squatch's day (homework, things hidden around the room, lonely) and Mops checking in at night.

## 1. A catch at the party leaves the game stuck in the bedroom

- What the kid sees: at the party, a guard sees Squatch. The card says "Holding pen. This part starts over." Then Squatch is back in his bedroom at the very start, the goal says to walk around the room, and nothing leads forward. The only way out is to restart the chapter.
- Seen: twice, both times after pressing a party button (SNAG, SUCK or STAND) while the guards were in the room.
- Cause: the party scene is `QA`. A catch calls `capture("s6")` (`src/game/14-ch1-day1.js` line 59). `reSec()` (`src/game/20-ch2.js` lines 528 to 537) looks up the scene in `CH1_CHECKPOINTS` (`src/game/25-capture.js` lines 204 to 221). There is no `QA` entry (and none for Q1, Q3, Q5 to Q9), so it falls back to the old saved opening, scene O1.
- Fix: add a `QA` entry that starts the party again. Then check every Q scene where a catch can happen has an entry.
- Brian answered (2026-11-14): after the jail card, set Squatch back a little, or back where he was caught, and let play carry on. No guard walking into the bedroom right away. Pull request 38 has that guard version and must not be merged.
- Proving check: empty `LEAVE_ALONE` in `tests/ch1-kid-play.mjs`, so the robot presses the party buttons. It must reach the score card. Add a short test that sets scene QA, calls the catch, and asserts the scene is not O1 and a spot is offered.

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

## 12. The peek is not a peek (beat 3)

- Walkthrough: he taps the doorway and peeks out at the party from inside. Game: pressing PEEK walks him out into the hall.
- Pull request 33 (Cursor, "Do not merge") has a version of beats 3 to 6. It also swaps all the music in the same change. Lift out only the peek and sneak parts; do not merge it whole.

## 13. Sneaking to the plant plays itself (beat 4)

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
