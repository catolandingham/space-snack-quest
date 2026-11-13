# Chapter 1 problems, ranked

Written 2026-11-13 from robot playthroughs of Chapter 1 on a phone-size screen (375 by 812, touch only). The robot is `tests/ch1-kid-play.mjs`. It taps like a kid: taps through speech, presses the big button, taps the spot it wants to reach. It reached the score card in 344, 367 and 482 seconds.

This list is ranked by how much each problem hurts a kid playing. Each one has what the kid sees, the cause in the code, the fix, and the check that proves the fix. Fix one problem per pull request, in this order, unless Brian says otherwise.

How to run the robot:

- `node tests/ch1-kid-play.mjs` plays Chapter 1 and prints what it met (6 to 8 minutes).
- `npm run kid-video` does the same and saves a video in `tests/out/kid-play/chapter-1.mp4`.
- Problems on the `KNOWN` list in that file print as KNOWN and do not fail the run. Anything else fails it. When you fix a problem, take it off `KNOWN` in the same pull request, so it can never come back unnoticed.

## Recommendation: do not rebuild Chapter 1

A kid can finish the chapter today. The problems below have ten separate, small causes. None of them needs the chapter rebuilt. Fix them in order, with the robot run after each one.

## 1. A catch at the party leaves the game stuck in the bedroom

- What the kid sees: at the party, a guard sees Squatch. The card says "Holding pen. This part starts over." Then Squatch is back in his bedroom at the very start, the goal says to walk around the room, and nothing leads forward. The only way out is to restart the chapter.
- Seen: twice, both times after pressing a party button (SNAG, SUCK or STAND) while the guards were in the room.
- Cause: the party scene is `QA`. A catch calls `capture("s6")` (`src/game/14-ch1-day1.js` line 59). `reSec()` (`src/game/20-ch2.js` lines 528 to 537) looks up the scene in `CH1_CHECKPOINTS` (`src/game/25-capture.js` lines 204 to 221). There is no `QA` entry (and none for Q1, Q3, Q5 to Q9), so it falls back to the old saved opening, scene O1.
- Fix: add a `QA` entry that starts the party again. Then check every Q scene where a catch can happen has an entry.
- Needs Brian: one pick. After a catch at the party, start the whole party again, or start again from when the guards walk in.
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
- Fix: draw the close circle, or drop the close catch while the robot looks away.
- Needs Brian: one pick between those two.
- Proving check: a test that stands Squatch 60 px behind the robot while it looks away, and asserts either no catch, or that a drawn circle is on screen (`__ss.conesDrawn()` has an item with `circle`).

## 4. The big button changes width with every label

- What the kid sees: the round ACTION button turns into a wide pill for "DANCE · circle" or "HIDE · plant", then back. Brian has asked several times for one size.
- Seen: 32 different sizes in one run, from 104 px to 200 px wide.
- Cause: `src/game/90-input-shell.js` lines 559 to 564. A label over 7 letters sets `width:auto`, `maxWidth:200` and padding.
- Fix: one fixed size for every label, with the text shrinking or wrapping to two lines inside it.
- Needs Brian: a look at the new button before it merges (picture in chat).
- Proving check: remove `button-size` from `KNOWN`. The robot run must pass.

## 5. The whole page jumps down once at the start

- What the kid sees: after the opening card, the picture and both controls drop by 126 px.
- Cause: on a phone the goal bar sits above the picture in `ss-hudbar` (`src/game/80-hud.js` line 117, 126 px tall, hidden at first). `hudLayout` (line 243) only shows it the first time the bar is needed, which is after the opening card.
- Fix: on a phone, keep the bar's space from page load and only hide what is inside it.
- Needs Brian: no.
- Proving check: remove `page-jump` from `KNOWN`. The robot run must pass.

## 6. A yellow ring is drawn around Squatch himself

- What the kid sees: the yellow "go here" ring sits on Squatch, so it points nowhere.
- Seen: 8 times in one run (the song, the party, the gift box and others).
- Cause: `ch1MarkGoal` (`src/game/12-ch1-redesign.js` line 81) draws the ring at the first spot that has a position. Several spots are placed on Squatch's own feet.
- Fix: do not draw the ring when the spot is within about 60 px of Squatch.
- Needs Brian: no.
- Proving check: remove `ring-on-squatch` from `KNOWN`. The robot run must pass.

## 7. Squatch walks through the bed when he gets up

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

- What the kid sees: SNAG, SUCK and STAND show as button labels. The dance circle runs about 30 seconds and ends the same whether the kid taps or not.
- Needs Brian: his earlier lean was that the vent, plant and security should be hazards in the room, not buttons. Not confirmed.

## 10. A start-over with no card (seen once)

- In one run the score card counted 4 catches but only 3 "starts over" cards were shown. Not seen again in two later runs. Cause not found. The robot now fails the run if it happens (`start-over-without-card`).
