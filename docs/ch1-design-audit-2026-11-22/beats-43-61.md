# Audit: Chapter 1 beats 43 to 61 (six days later through the call to the ship)

Repo checked: /Users/brianhowe/Code/space-snack-quest (read only). I ran `node tests/ch1-playthrough.mjs`: all checks pass. The test presses the keypad digits directly, so it does not prove a kid can type the code by touch.

Where today's play lives: `src/game/14-ch1-day2.js` (all of beats 43 to 61). `n.ch1Day2` is set true at the end of Day 1 (`ch1Day2Begin`, 14-ch1-day2.js:26) and only reset in `15-ch1-scene1.js:42`. The older Q4 to Q9 chain in `12-ch1-redesign.js` (about lines 895 to 1140) only runs when `ch1Day2` is false, so it is dead code now. `?scene=Q*` links do nothing (no `sceneQ*` function exists in 90-input-shell.js). `?scene=S*` links do work (90-input-shell.js:266 onward), so the old S scenes are debug-link-only.

Design sources used: DECISIONS "Brian's confirmations 2026-11-22" (keypad: "office door, not the hangar"; cones on everyone, dashed then yellow; hangar robot "no close catch"; optional things have no outline), WHAT-GOOD-LOOKS-LIKE, walkthrough beats 43 to 61, Nov 20 outline rule (only the one next place gets a soft outline).

### Beat 43. "Six days later"
- Design (newest): A time card "Six days later", then the next weekly ship is tomorrow.
- v1 today: `ch1SixDays` shows card "Six days later" (14-ch1-day2.js:343 to 346), then walks to the loading bay.
- Verdict: MATCHES
- Old-design leftovers: Same card in dead code, 12-ch1-redesign.js:903 (`ch1Week`). Not reachable.

### Beat 44. The robots tease Mops
- Design (newest): Robots mock Mops's beard, say HQ will replace him this week; Mops says the manager lied.
- v1 today: `ch1TeaseLines` (14-ch1-day2.js:353 to 367): "We could wipe the floor with that beard." / "HQ sent us a message. You're going to be replaced this week anyway." / "Replaced? The manager was lying to me." Punctuation differs slightly from the walkthrough line (comma vs period); the beard line is extra but fits "What happens". All lines are marked pending in the walkthrough. Three robots drawn at 12-ch1-redesign.js:1522 (`ch1Crew === "tease"`), with no sight cone, which is fine for a cutscene.
- Verdict: MATCHES
- Old-design leftovers: none live.

### Beat 45. "Let's go find that pancake place"
- Design (newest): At home that night, Mops says the new robots come on tomorrow's ship, and they will mail themselves in the empty crate booked on the office computer; they need the code.
- v1 today: `ch1EscapeHome` (14-ch1-day2.js:369): Mops says the line word for word. The "office computer" and "code" are not said; that matches the beat's quoted words (pending), and the code need becomes clear at beat 50.
- Verdict: MATCHES
- Old-design leftovers: dead copy with a different line ("Let's go find the pancake stand."), 12-ch1-redesign.js:915. Not reachable.

### Beat 46. The almost-slip
- Design (newest): Squatch almost reveals he mailed the order, then covers: a copy got sucked into the vent.
- v1 today: 14-ch1-day2.js:372 and 373: "Oh, it was on the form I sent, I mean, never mind." then "Didn't a copy get sucked into the vent?" (whisper). The suck-into-vent is drawn earlier at beat 40ish (14-ch1-day2.js:1022 to 1031).
- Verdict: MATCHES
- Old-design leftovers: dead copy "A copy got sucked into the vent.", 12-ch1-redesign.js:917. Not reachable.

### Beat 47. Sneak to the vent
- Design (newest): They sneak out together at night (home, party hall, hallway, loading bay). Mops crawls into the big wall vent; Squatch waits outside the grate, rolled into a ball (one action button). Robots are about.
- v1 today: `ch1ToVent` (14-ch1-day2.js:378) walks both through the rooms at night, then `ch1Ready("roll", ...)` with the button "ROLL · ball" at the vent (14-ch1-day2.js:827, 12-ch1-redesign.js:10 gives CH1_VENT). `ch1RollVent` (line 387) makes him a ball and cuts to the duct. Cannot tell from the code whether Mops is ever shown crawling into the vent: nothing in `ch1ToVent` or `ch1RollVent` moves Mops into the grate. The night robot is drawn with a cone and a ring in every night scene (12-ch1-redesign.js:1525 to 1534), but `ch1Watch` only catches in scene Q4 (12-ch1-redesign.js:1155), so in Q5 (this beat) and Q6 (beat 49) the robot shows a solid yellow cone and ring that do nothing.
- Verdict: DIFFERS (code fix, design is clear). Two items: (a) show Mops entering the vent (cannot tell if shown), (b) the robot's cone/ring in Q5 and Q6 promise danger that is not there, and the cone is solid yellow, not dashed-then-yellow as the Sight cones decision says. Also the ring around the robot (`STAND_FEET` circle, line 1530) is a ring, which the Nov 20 rule says nothing else should have.
- Old-design leftovers: none about this beat except the dead Q chain.

### Beat 48. Mops's secret workstation
- Design (newest): Inside the vent is Mops's secret desk (only the player learns he writes the Guardian notes). Detective wall: Mops searching for Squatch's parents, flyers "HAVE YOU SEEN?", labels MARS / NO / TOYS, Mars crossed off with the big readable reply letter and red NO stamp. The pink sheet lies on the desk next to him; he does not notice. He writes one more Guardian note.
- v1 today: `drawCh1Duct` (12-ch1-redesign.js:1555 to 1568) draws a vent grille, "IDEAS FOR GUARDIANS" with the note "We know you're thinking about going to Mars. Don't worry, we'll always be with you.", the "MARS LOST & FOUND" letter with the three NO lines and a red NO, a desk, and the pink slip on the desk (`ch1Prop === "desk"`, line 1567). Squatch's eyes in the grille (line 1556); whisper "I hope Mops doesn't notice..." (14-ch1-day2.js:400). Not found anywhere in the code: "HAVE YOU SEEN?" flyers, "TOYS" label, a detective wall, Mars crossed off, Mops writing the note (the scene goes straight from the whisper to Mops taking the slip in his mouth, 14-ch1-day2.js:401 to 404).
- Verdict: DIFFERS (code fix, design is clear). Missing pieces: flyers, TOYS label, Mars crossed off, the "writes one more note" action. The letter, NO stamp, board and slip are built.
- Old-design leftovers: the dead `ch1Workstation` (12-ch1-redesign.js:928 to 954) shows a separate full-screen "ch1slip" note panel (60-frame-draw.js:1758). Not reachable in today's play (day 2 never calls it).

### Beat 49. Grab the pink slip
- Design (newest): Mops rushes out with the pink sheet in his mouth (it has the office code); Squatch grabs it at once, before Mops sees the paw print.
- v1 today: 14-ch1-day2.js:403 to 411: slip drawn in Mops's mouth (line 1012), Mops says "Hurry, hurry, pink slip, got it!", the kid presses "GRAB · pink slip" (line 829, `ch1GrabPinkNow` 412), then whisper "Get it before he sees it." The paper log goes to "paw" so the paw-checked slip is the one held (1015).
- Verdict: MATCHES
- Old-design leftovers: none live. Dead `ch1GrabPink` (12-ch1-redesign.js:967) says "The code from the slip. His computer." and goes to the hall computer (a hall room, not today's hallway keypad). Not reachable.

### Beat 50. The office keypad
- Design (newest): Office door in the hallway is locked by a keypad. The kid types the code from the paper. Brian, 2026-11-22: "We need the code for the office door, not the hangar".
- v1 today: `CH1_OFFICE_CODE = "4723 (now 169556, Brian, chat, 2026-11-26)"` (14-ch1-day2.js:3). `ch1ToPad` (line 413 area) goes to the hallway, shows a zoomed keypad with the slip and "4723 (now 169556, Brian, chat, 2026-11-26)" drawn beside it (drawCh1Zoom, lines 945 to 948), and a wrong digit clears with a buzz (`ch1PadPress` 433 to 443). Right code opens the door. The kid taps the digits (`ch1Day2Pointer`, line 780ish). The test confirms 4723 (now 169556, Brian, chat, 2026-11-26) opens and a wrong digit clears. No hangar code anywhere in this path.
- Verdict: MATCHES
- Old-design leftovers (the pink slip, office code, hangar code):
  - `11-ch1-hall.js:1072` "The hangar code was on that slip I ripped." and `:1073` "Half's in the trash. Half's in the vent." These contradict the design (there is no hangar code). Only in the old S8 scene. Reachable only by `?scene=S8` debug link, not from `?ch=1` play (no code path goes from Q scenes to S scenes).
  - `11-ch1-hall.js:882` comment "Mops names the hangar code first, in S8 (rule 20)" and `:1129` "When the bot comes to look, tap my face and grab the slip!" and `:916` "Mops's torn slip. Just paperwork." Same old S scenes; debug links only.
  - `50-story-frame.js:479` the torn slip is drawn labelled "Hangar code:" with "4 7", and the second half shows "2 3" and "(the rest of the code)" (lines 479 to 484, panels `half1`/`half2`). Reachable only inside old S9/S10. The two halves 47 and 23 are where today's 4723 (now 169556, Brian, chat, 2026-11-26) comes from, so the number is the same, only the label is old.
  - `10-ch1.js:950` and `:954` goal-bar chips "Mops: grab the slip from the trash" and "Mops: grab the other half of the slip". Old S9/S10 only.
  - The Day 2 file itself says (14-ch1-day2.js:2) the code is "the one already drawn on the old keypad", fine.

### Beat 51. Return empty crate
- Design (newest): Manager's office computer has the Moon Pie site; click "Return empty crate" to book the crate on tomorrow's ship.
- v1 today: `ch1OfficeIn` (14-ch1-day2.js:444) shows a Moon Pie page panel (`ch1site`, 60-frame-draw.js:1744: "MOON PIES", "Order new box", "Return empty crate"), then the goal "return the empty crate" and the button "RETURN · empty crate" (line 830) runs `ch1Booked`. Two differences from the walkthrough: (1) the site is shown in the hallway (`ch1SiteRoom = "passage"`; the test is named "the office computer is in the hallway"), not inside the manager's office; (2) the page is a picture the kid taps past, and the booking is a separate big button, so the kid does not click "Return empty crate" on the page. START-HERE lesson 6 warns about buttons that play the moment.
- Verdict: DIFFERS (design unclear or conflicting): see questions 2 and 3.
- Old-design leftovers: dead `ch1Site` in 12-ch1-redesign.js:970 to 981 puts the site on a hall computer. Not reachable.

### Beat 52. Take all the snacks
- Design (newest): Mops says take all the snacks; Squatch leaves some for the Guardians; Mops says nothing; at home Squatch tucks the pink slip under the notes in the Guardian Box (proposed); they go to bed.
- v1 today: `ch1AllStart` (14-ch1-day2.js:456): Mops's line, a drag-snacks zoom into a bag, then "LEAVE · food", "I'm worried about the Guardians. I'll leave them some food.", then at home "PUT · slip" (`ch1HideSlip` 532), slip drawn in the box and the packed crate (lines 962, 1016), they sleep (snore). Matches the walkthrough.
- Verdict: MATCHES
- Old-design leftovers: none live.

### Beat 53. Packing the crate
- Design (newest): The Guardian Box goes inside the big Moon Pie crate with Mops's bucket on top. They take their things off the walls and roll the crate out on a pallet.
- v1 today: `ch1PackStart` to `ch1PackBucket` (14-ch1-day2.js:553 to 565): zoomed pack of the box, then the bucket (draw at 957 to 963). Not found in the code: things taken off the walls, a pallet, rolling the crate out.
- Verdict: DIFFERS (code fix, design is clear; low priority): wall things and pallet roll-out are not built.
- Old-design leftovers: none.

### Beat 54. The robots open a crate
- Design (newest): Mail room full of crates; Squatch hides in a crate; a robot out by the ship opens a crate and scans it; no announcement; hiding in a crate will not work; no Dot, Bob or Lou. Player: stay hidden.
- v1 today: `ch1PickupWatch` (14-ch1-day2.js:578 to 590): Squatch hidden in a crate, crates loaded (`ch1Load`, drawn at 12-ch1-redesign.js:1488 to 1496), no named crew (Dot/Bob/Lou only draw for crew "day"/"leave", 12-ch1-redesign.js:1511), and Mops's line "Get out. They're checking a crate." It is all a cutscene (`ctrl = !1`), so there is nothing for the kid to do. The room is the delivery bay (hangar room id), not a separate mail room.
- Verdict: DIFFERS (code fix, design is clear): "Stay hidden" is not an action the kid does.
- Old-design leftovers: dead `ch1Pickup` copy in 12-ch1-redesign.js:996 to 1020. Not reachable.

### Beat 55. Mops warns him
- Design (newest): Mops comes in and warns him; Squatch climbs out while robots are busy at the ship and they sneak home. Player: sneak home unseen.
- v1 today: The warning line and climb out are in the same cutscene (14-ch1-day2.js:591 to 604), then `ch1GoDay` walks them through passage, hall, closet automatically. The kid never steers and no robot sight is checked. The robots' cones are not drawn here.
- Verdict: DIFFERS (code fix, design is clear): "Sneak home unseen" is a cutscene walk. If Brian wants a sneak with the robots' dashed cones (Sight cones decision), it is not built.
- Old-design leftovers: none live.

### Beat 56. The goat costume
- Design (newest): At the wardrobe Mops trims some of his beard and glues it on Squatch; Squatch adds horns and the spare blue jacket; ridiculous on purpose; Mops keeps his jacket. Mops: "More bleat. Less roar." Player: put on the costume. Separately, the confirmed dress-up decision is a drag-on close-up on a white background with a "Disguised enough" meter.
- v1 today: `ch1CostumeReady` and `ch1Jacket` (14-ch1-day2.js:606 to 612). Mops says "The spare jacket. The beard. And the horns." The kid presses one button "PUT ON · jacket", Squatch walks to 200,500, and jacket, goat beard and horns all appear at once (draw flags at 14-ch1-day2.js:907). No beard trimming, no gluing, no drag-on close-up. "More bleat. Less roar." matches.
- Verdict: DIFFERS (design unclear or conflicting): the dress-up decision may or may not also apply to the goat costume; see question 1.
- Old-design leftovers: dead `ch1Trim` (12-ch1-redesign.js:1036 to 1043). Not reachable.

### Beat 57. Last walk: POP! and the keepsake
- Design (newest): Passing through the party hall for the last time, the old balloon pops; nobody cares. In the hallway Squatch may take his crayon drawing off the wall (points pending).
- v1 today: `ch1LastWalk` (14-ch1-day2.js:613) calls `ch1BalloonPopNow` in the hall (12-ch1-redesign.js:820: pops once, only if a balloon was kept, `ch1BalloonRest`). The hallway has "TAKE · drawing" (14-ch1-day2.js:839) and "GO · ship"; the drawing is optional with no required outline in the code I saw. No points for the drawing (`ch1Crayon` only a flag; amount pending in the design). If the balloon was never played with, no pop happens; this depends on how the balloon is rebuilt ("Keep, simplified").
- Verdict: MATCHES
- Old-design leftovers: none.

### Beat 58. Through the scanner
- Design (newest): They walk through the fur scanner, it is fooled ("HAIR... PROBABLY. PROCEED."), they board; Isfred is not there.
- v1 today: `ch1ToScanner` then `ch1Leave` (14-ch1-day2.js:623 to 649): "BOARD · scanner", scanner line word for word, both walk up the ramp.
- Verdict: MATCHES
- Old-design leftovers: dead copy `ch1Board` (12-ch1-redesign.js:1048). Not reachable.

### Beat 59. Where's Mops?
- Design (newest): Office cutscene; Isfred wants Mops for his Employee of the Month photo and learns he is gone.
- v1 today: 14-ch1-day2.js:645 to 651: all five lines word for word (official, robot, official, robot, official).
- Verdict: MATCHES
- Old-design leftovers: none live.

### Beat 60. The security tapes
- Design (newest): Card "Later that evening...", Isfred watches the tapes and sees a very silly goat boarding; screen badge "REC".
- v1 today: card at 14-ch1-day2.js:653, then `ch1Tape` draws a "REC" screen with the goat Squatch (12-ch1-redesign.js:1266 to 1270).
- Verdict: MATCHES
- Old-design leftovers: none.

### Beat 61. The call to the ship
- Design (newest): On the ship; partway through, the base calls the ship; it stops; Squatch and Mops are found and put off at the Gas Stop; Chapter 2 begins. No lines decided.
- v1 today: After the tapes, `v("pa", "The base called the ship. It has to stop.", "pa")` (14-ch1-day2.js:657), then the Chapter 1 tally card, next beat "Ch2" (lines 658 to 662). The tally page says "Next stop: the gas stop. Chapter 2 is coming soon." (60-frame-draw.js:1398). There is no ship scene, no crew finding them and no put-off at the Gas Stop.
- Verdict: MISSING. (Lines are undecided in the design, so the scene needs Brian's words first.)
- Old-design leftovers: the older S ending `11-ch1-hall.js:1795 to 1817` ("Fuel gauge says... just enough to reach the gas stop." / "Mars, here we come!") is a different ending. Only in old S scenes; debug link only.

## Summary of leftovers (old design contradicting the current one)
- Hangar code lines and slip label: `11-ch1-hall.js:1072`, `11-ch1-hall.js:1073`, `11-ch1-hall.js:882` (comment), `50-story-frame.js:479` ("Hangar code:" on the torn slip with "4 7" / "2 3"), `10-ch1.js:950` and `:954` (chips). Only old S scenes, debug links (`?scene=S*`) only.
- Old ending lines: `11-ch1-hall.js:1809` and `:1810`. Same.
- Dead older Q chain: `12-ch1-redesign.js:895 to 1062` (ch1Week, ch1Tease, ch1Workstation, ch1PinkReady, ch1GrabPink, ch1Site, ch1ReturnCrate, ch1Pickup, ch1Costume, ch1Trim, ch1Board) and the fallback spots in `ch1QSpots` (12-ch1-redesign.js:1090 to 1140), with older wording ("pancake stand", "The code from the slip. His computer.") and the hall-computer position. Unreachable while `ch1Day2` is true (always after Day 1).
- Live drawing issue in my range: night robot cone drawn solid and a ring around it (12-ch1-redesign.js:1525 to 1534) in scenes where it cannot catch (Q5, Q6), against the Sight cones decision and the Nov 20 "nothing else has a ring" rule.
- Not an old-design leftover but worth knowing: `ch1Watch` (12-ch1-redesign.js:1155) is Q4 only, and in its look-away phase `ch1NightLook` still returns `catch: true` with the close ring (`STAND_FEET`, lines 237 to 243), so the "no close catch while looking away" decision (Hangar robot, "No close catch") looks unmet in Q4 (beat 37 to 42 range, not mine; flagging because it shares the same code).

## Design questions only Brian can answer
1. Does the goat costume (beat 56) use the same drag-pieces-on close-up as the party disguise?
   - A. Yes: close-up on white, drag on Mops's glued beard, horns and blue jacket, with the meter.
   - B. No: keep one tap, but show Mops trimming and gluing the beard first.
   - C. Mops dresses him by himself in a short cutaway; no kid action.
2. Where is the office computer in beat 51: manager's office or the hallway?
   - A. Kid walks into the manager's office through the opened door (matches the walkthrough text).
   - B. Computer stays in the hallway by the keypad door (what v1 draws and tests today).
3. How does the kid book the crate in beat 51?
   - A. Tap the "Return empty crate" button drawn on the Moon Pie page.
   - B. Keep the big action button "RETURN · empty crate" and show the page as a picture.
4. Do beats 54 and 55 ("stay hidden", "sneak home unseen") need a kid action?
   - A. Yes: hide in the crate while the robot's dashed cone sweeps, then sneak home past the robots (needs the cone look Brian approved).
   - B. No: keep both as a short cutscene and change the walkthrough's Player lines to "none".
5. What happens in beat 61?
   - A. Short ship scene: the call comes, the ship stops, the crew finds them, put off at the Gas Stop (needs Brian's words for the captain and crew).
   - B. Keep today's one PA line and cut to the tally card; Chapter 2 opens at the Gas Stop.
6. Should the night robot in the vent and slip scenes (beats 47 to 49) show a sight cone at all?
   - A. Yes, with dashed outline that turns yellow, and catching (Sight cones decision).
   - B. No cone there: the robot is only background in these three beats.
