# Audit: Chapter 1 beats 22 to 42 (v1, /Users/brianhowe/Code/space-snack-quest)

Method: read the design (DECISIONS sections, WHAT-GOOD-LOOKS-LIKE, walkthrough beats 22 to 42), read `src/game/14-ch1-day2.js`, `12-ch1-redesign.js`, `15-ch1-scene1.js`, `25-capture.js`, `60-frame-draw.js`, then played Day 2 headless with `?ch=1&beat=day2` (tick, tap bubbles, press the action button) and looked at screenshots. Screenshots and the play script are in `/private/tmp/claude-502/-Users-brianhowe-Code/c66c2c5a-0e97-42b2-8633-d2705d10ae0f/scratchpad/audit/run/` (s000 to s087, log.txt, play.mjs). No repo file was edited.

Newer rules that change beats in this range:
- Confirmed 11-22: whoever sees Squatch in Chapter 1 runs to the FUR ALARM (no instant lockup); hangar robot has no close catch while it looks away; cones on everyone, dashed until Squatch is in the line of sight, then yellow, "!" for security and robots, "?" then "!" for guests, hearts for Mops; optional things get no outline.
- Nov 20: no goal line; the one next place gets a soft outline; nothing else glows or has a ring.
- WHAT-GOOD-LOOKS-LIKE: outline the real place, never a circle, dashed, outside the object (G#292, G#438).

Overall shape: Day 2 is one chain in `14-ch1-day2.js` (`ch1Day2Begin` and the functions after it). `ch1Day2Begin` is called straight after Day 1's "A flyer. And fur on the floor." (`12-ch1-redesign.js` `ch1PartyHome`). No morning marker appears before beat 22.

---

### Beat 22. A gift from the Guardians
- Design (newest): wake the morning after the scare to a toy rocket and a note from the Guardians; he pictures them as big furry Sasquatches like the crayon drawing; holds the toy up; puts both in his Guardian Box. Box label "MY GARDIANS".
- v1 today: `ch1Day2Begin` (`14-ch1-day2.js:25`) sets step "gift"; spot `TAKE · gift` at (340,520) (`ch1Day2Spots`, line ~804). Squatch says "The Guardians came! They always come when I'm scared." (`ch1TakeGift`, line 53), carries a red block plus a tag reading "Rule #1" (`drawCh1Day2`, line ~1003), then a close-up (`drawCh1Zoom` id "box", line ~951) shows a blue box labelled "MY GARDIANS" and a yellow note "Rule #1 / Brave Sasquatches / stay hidden." and he drops it in. Screenshot s000: nothing is drawn on the floor or bed at the gift spot (no toy, no note), so the player walks to an invisible spot. No toy rocket is drawn anywhere. No furry Guardians drawing. The note has no "The Guardians" signature.
- Verdict: DIFFERS (code fix, design clear). Lines and box flow match; the toy, the Guardians picture and the visible pickup spot are missing.
- Old-design leftovers: `10-ch1.js:224` ("The Guardians came!") and `10-ch1.js:865` ("A toy rocket! From the Guardians!", pulse "gift") are the old O1 version. `60-frame-draw.js:2129` draws an old `n.gift` toy and pointer. Only reachable from old O scenes or `?scene=O1` debug links, not the Day 2 chain (cannot confirm without running them).

### Beat 23. The calendar: delivery day
- Design (newest): wardrobe calendar shows DELIVERY / MOON PIES with today circled; no sign needed. Player looks at it. 11-22 list says optional things (closet, bed, calendar) get no outline.
- v1 today: step "cal", spot `LOOK · calendar` (line 807), `ch1LookCal` opens the Day 1 calendar close-up (`15-ch1-scene1.js` `drawCh1Calendar`): MOONMUNCH / FUZZUARY, a red-crayon circle around a pie on day 14, "Sponsored by MOON PIES". The word DELIVERY is not on it; the code comment says the circle is "not an extra clue or a new delivery date" (line ~197). It is the same picture as Day 1. Bite: only appears if the player taps the pie (`ch1CalendarBitten`, `15-ch1-scene1.js:123`), not "already bitten". While the step is active a pulsing yellow ring with a pointer wedge is drawn around the calendar (`drawCh1Day2`, `14-ch1-day2.js:987` to ~1000; visible in my screenshot s003). After closing, Squatch says "He forgot his lunch!".
- Verdict: DIFFERS (design unclear or conflicting). Design says "DELIVERY" and a "today" circle; v1's art does not say it. Also the calendar is required here (step blocks progress) yet the 11-22 list says calendar is optional and unoutlined, and the Nov 20 rule bans rings. The ring is code to remove either way.
- Old-design leftovers: the pulsing calendar ring/wedge above is a ring the Nov 20 rule forbids; reachable in play (beat 23).

### Beat 24. Mops forgot his lunch
- Design (newest): Mops has gone to work; his lunch bag is here; Squatch takes it to him. Line "He forgot his lunch!".
- v1 today: bag drawn on the floor (yellow bag, s000), step "lunch" `TAKE · lunch` (line 811), line spoken after the calendar (`ch1LookCal`, line 72), then `ch1TakeLunch` walks him to the hall.
- Verdict: MATCHES.
- Old-design leftovers: none found.

### Beat 25. Sneak the lunch to Mops
- Design (newest): sneak through the party hall (balloon still there) past people with sight cones, using plants and boxes; if someone sees him they run to the wall alarm and security comes; he finds Mops in the hallway.
- v1 today: `ch1TakeLunch` -> hall, step "sneak". Two guests with cones (`CH1_LUNCH_WATCH`, `14-ch1-day2.js:4`), drawn in `drawCh1Day2` (~line 960) as always-filled yellow cones plus a solid ring at the feet (s013). Being in a cone calls `capture("s6")` (`ch1LunchSee`, line 762 to 770): instant LOCKUP card and section restart (`25-capture.js:16`). The run-to-the-alarm only exists in Day 1's raid (`14-ch1-day1.js:12, 89`). Cones have no occlusion, so plants give no cover (`ch1ConeHit`, line 752); only the ROLL ball spot helps. Three pulsing yellow chevrons are drawn at the hall exit during this step (`drawCh1Day2`, ~line 957). The SNEAK · hallway spot has radius 520 at (700,540) (line 815): I pressed the action button at the start position (220,580) without moving and the game went straight to the hallway (play2.mjs), so the whole sneak can be skipped. Balloon is drawn where it rests via `drawCh1BalloonLeft` (`12-ch1-redesign.js:1455`) if not popped.
- Verdict: DIFFERS (code fix, design clear). Four gaps: seen = lockup instead of alarm run; cones solid not dashed, no "?"/"!"; no cover from plants; sneak skippable by one button press. Goal chevrons also break "no goal line".
- Old-design leftovers: always-filled cones with feet ring is the pre-11-22 look; reachable (beat 25). The baked yellow outline around the snack bar is part of the locked picture `docs/locked-rooms/hall-room-empty-v1.png` (visible in s013 even though the bar is not the goal); it shows in every hall scene. Cannot be fixed without a new locked version (CLAUDE.md rule 14).

### Beat 26. "My lunch! You're the best."
- Design (newest): Mops worried Squatch is out, happy for lunch, eats the lunch, then the empty bag.
- v1 today: `ch1GiveLunch` (line ~88): "Squatch! You should be hiding." then "My lunch! You're the best." with hearts, then feed close-up (`ch1Feed1`, `ch1Feed2`): lunch, then bag.
- Verdict: MATCHES.
- Old-design leftovers: none found.

### Beat 27. One snack, behind the counter
- Design (newest): Mops walks Squatch back toward home, they stop at the snack bar, stay behind the counter because people are around; exactly one snack. Mops: "I know you, Squatch, you're probably hungry... you know the rule, grab one snack."
- v1 today: `ch1AfterLunch` (line 112) puts Squatch at (620,580)/Mops (240,560), line word for word, spot `TAKE · snack` (760,530); close-up drag one snack into a bag (`ch1TakeOne`, `ch1OneDrop`). In s025 Squatch stands in front of the counter's end, not behind it, with a guest nearby and no bartender. Exactly one snack: yes.
- Verdict: DIFFERS (code fix, design clear): "behind the counter" is not shown. Line and one-snack rule match.
- Old-design leftovers: none found.

### Beat 28. The ship is coming
- Design (newest): PA announces the postal ship; Squatch begs; Mops gives in once. Four lines.
- v1 today: `ch1ShipCall` (line 130 to 142): all four lines word for word; wall speaker drawn in the hall (s025).
- Verdict: MATCHES.
- Old-design leftovers: none found.

### Beat 29. Walk to the loading bay
- Design (newest): cutscene walk, nothing in the hallway findable yet; at the bay Squatch hides in the plant, only eyes show. Outline the real place, never a circle.
- v1 today: `ch1GoDay` passes through the hallway with control off. At the bay, step "hide": spot `HIDE · plant` (line 819). While the step is on, a pulsing solid yellow circle (radius 54) is drawn on the floor at the plant position (`drawCh1Delivery`, `12-ch1-redesign.js:~1507`, s034). Hidden pose draws eyes on the orange pot (`ga(...)`, line 1516; s037, s040 show eyes on the pot, blinking between a dash look and round eyes). Whether these are "the very original" eyes: cannot tell from the code.
- Verdict: DIFFERS (code fix, design clear): a circle on the floor, not a dashed outline of the plant. Eyes: not judged.
- Old-design leftovers: the ring above is the same Nov 20 ring ban; reachable (beat 29).

### Beat 30. The robots arrive
- Design (newest): ship docks, ramp lowers, three robots roll down; Isfred shakes hands with leaving workers Dot, Bob, Lou; robot mailbox in the mail-room corner.
- v1 today: `ch1BayLines` (line 154): ramp grows over 1.3 s, three white mop robots appear, workers Dot, Bob, Lou are drawn with name tags and slide off left (`drawCh1Delivery`, ~line 1519, s034/s037), blue "UPS" robot at the right is the mailbox. No handshake exists in the code (searched "shake"). Added line "Isfred! A crate is damaged in the mail room." spoken by the UPS robot (line 161) is not in the walkthrough ("what calls him away is still open").
- Verdict: DIFFERS (code fix, design clear on everything except the call-away words). Handshakes missing; the invented call-away line needs Brian's yes.
- Old-design leftovers: `12-ch1-redesign.js:~478` old tourist line "Isfred Bar Neshuman! The dock needs you." (in the unreachable `ch1AtDelivery`, see end).

### Beat 31. The promise
- Design (newest): Isfred to Mops: "Mops, don't worry, you know how much we love you here. Even our visitors always love you."
- v1 today: line word for word, speaker label "Isfred Bar Neshuman" (s037).
- Verdict: MATCHES.
- Old-design leftovers: none found.

### Beat 32. Three copies
- Design (newest): Isfred signs a three-part form (white, pink with ORDER MORE ROBOTS box, small yellow carbon under the pink), writes his office code on the pink sheet, it copies to the yellow; called away; a robot files the white copy. Optional "So futuristic and we still order on paper."
- v1 today: `ch1SetPaper("set")` then `"file"` (`14-ch1-day2.js:155, 164`) but `drawCh1Day2` has no drawing for "set" or "file" (it draws only bite, mouth, slip, bin, paws, pink, box), so the bay scene shows no form, no signing, no code written (s037, s040). The ORDER MORE ROBOTS pink sheet and the code 4723 only appear in the night close-up (`drawCh1Zoom` id "paw", line 916). The paper joke is spoken by Mops after "I'll take care of it." (line 171).
- Verdict: MISSING (the form, signing, carbon copy and filing are not shown). Close-up art for the pink sheet exists.
- Old-design leftovers: none found in this beat.

### Beat 33. "Delicious."
- Design (newest): robot returns with pink and yellow still stuck together; Mops takes them, turns away, bites. Nothing goes into the vent yet.
- v1 today: lines "Left one of the copies in the office. What do I do with the other two?", "I'll take care of it.", "Delicious." word for word (lines 168 to 173). Pink and yellow slips drawn side by side near Mops's head (s043), not stuck together. The robot does not walk back; the UPS mailbox robot speaks from the corner. No vent involvement. Mops stands near the floor vent, not the big wall vent.
- Verdict: MATCHES on lines and order; the art is rough (not stuck together, no robot return). Noted, not scored as a difference.
- Old-design leftovers: `drawCh1Delivery` still draws old `ch1Prop` "delicious" with a pink slip flying to the wall vent (`12-ch1-redesign.js:~1498`); only set by unreachable `ch1AtDelivery`.

### Beat 34. Gumbling
- Design (newest): "Mmf mrrf!" then Squatch "You're gumbling! (goat mumbling)" from the bush, eyes only.
- v1 today: both lines word for word (lines 174 to 176); he is hidden in the plant.
- Verdict: MATCHES.
- Old-design leftovers: none found.

### Beat 35. Spit into the bin
- Design (newest): Mops spits both copies, still stuck together, into the garbage bin by the plant; Squatch sees where they went. "Ptoo!"
- v1 today: "Ptoo!" matches. `ch1SetPaper("bin")` draws the two slips at canvas (236,470) (`drawCh1Day2`: `n.ch1Paper === "bin" && drawSlip(236, 470...)`), which is floor beside Mops, not the bin (the bin is near (195,310); `CH1_BIN` is (212,370), `12-ch1-redesign.js:7`). Screenshots s046 and s081 show the papers on the floor, not in the can. Also the draw has no room check, so the same slips float on the floor of the hallway (s053), the party hall (s065) and the bedroom (s074) for the rest of the day, until night.
- Verdict: DIFFERS (code fix, design clear).
- Old-design leftovers: the stray papers in every room are a visible bug, reachable beats 35 to 41.

### Beat 36. Walk home past the robots
- Design (newest): Mops walks Squatch home past the new robots; "We got to watch out for these robots." / "What's the difference between fur and hair?" / "Paperwork."
- v1 today: lines word for word (lines 178 to 181), robots drawn in the bay, then walk to the hallway.
- Verdict: MATCHES.
- Old-design leftovers: none found.

### Beat 37. The Employee of the Month wall
- Design (newest): hallway can be explored now; optional: swipe 5 funny Mops photos (rotating pool), photo 4 is crooked, lifting it shows the crayon drawing (kept on wall) "TIED TOGETHER FOREVER", labels ME / MOPS, brass plate MOPS; swiping past 5 brings a robot BEEP BEEP and Squatch ducks away.
- v1 today: step "photos" with free roam and two spots: `GO · hall` and `LOOK · photos` (line 823). LOOK plays all five gags as black full-screen text cards (`ch1LookPhotos`, line 190 to 205; s054 "Mops, with a banana for a horn.", s056 "TIED TOGETHER FOREVER"), fixed gags, no pool, no swiping, no lifting a photo. After card 4 a "ME / MOPS" label appears over the wall (s058). The crooked frame is in the locked hallway picture. "BEEP BEEP" is spoken by a blue UPS robot at the right (s058) and Squatch steps down. Brass plate: cannot tell.
- Verdict: DIFFERS (code fix, design clear): the gallery is one button plus text cards, not swipe and lift.
- Old-design leftovers: none found.

### Beat 38. Missing Moon Pies and a pancake brochure
- Design (newest): people in line talk about missing Moon Pies; a tourist family walks up, Squatch hides; family talks about the Mars pancake place; Squatch ends up with the brochure showing a big furry Sasquatch couple behind the counter.
- v1 today: lines "I swear we had more Moon Pies..." and "Quick, hide." word for word (`ch1SnackLine`, line 207). Squatch hides at the plant (step "family"). Two guests are drawn, not a family. Extra lines "We ate at a pancake place on Mars." and "Here, a brochure." (line 219 to 220) are not in the walkthrough. Brochure close-up (s068) shows "PANCAKES" and two round brown faces with round ears over a white counter strip; reads closer to bears than furry Sasquatches.
- Verdict: DIFFERS (design unclear or conflicting): two unapproved tourist lines and no family, so Brian needs to say yes or cut; brochure art is a look call.
- Old-design leftovers: `12-ch1-redesign.js:504` `ch1Snack` is an older copy of this beat (see end), not reachable.

### Beat 39. Other Sasquatches?
- Design (newest): Squatch stares at the couple; Mops must go back to work; free roam with a go-home goal.
- v1 today: "Are those other Sasquatches?" (whisper bubble, s068) then "I need to get back to work, we'll talk about it tonight." word for word; then step "gohome" with free roam and spot `GO · home` (line 825).
- Verdict: MATCHES.
- Old-design leftovers: none found.

### Beat 40. The Mars talk
- Design (newest): Squatch wants to go to Mars; Mops says no ("Didn't you hear what the manager said? ..."). WHAT-GOOD-LOOKS-LIKE adds: it must be obvious why Mars is a waste of time [S#1058].
- v1 today: `ch1MarsTalk` (line 234): Mops walks in and says the line word for word. Squatch says nothing about Mars first, so Mops's line answers a question nobody asked (s074). Not drawn as evening.
- Verdict: DIFFERS (design unclear or conflicting): the walkthrough lists no Squatch line for "wants to go to Mars".
- Old-design leftovers: `12-ch1-redesign.js:518` has the old wording "what Isfred Bar Neshuman said?" in unreachable `ch1Snack`.

### Beat 41. Lights out
- Design (newest): Squatch to bed, Mops falls asleep and snores; no flashback, no Guardian hints.
- v1 today: `ch1MarsTalk` continues: both walk to bed, `sqPose = "sleep"`, `ch1Lights`, snore sound (`D.snore()`), 1.1 s, then the night starts. No flashback or Guardian text on this path.
- Verdict: MATCHES.
- Old-design leftovers: `ch1Bedtime` (`12-ch1-redesign.js:523`) shows panel "ch1guard" ("Brave Sasquatches stay hidden.", `60-frame-draw.js:1758`), a Guardian hint at lights out. Only called from `ch1Snack`, which only `ch1AtDelivery` calls, and nothing calls `ch1AtDelivery`, so not reachable in play (checked by grep for callers).

### Beat 42. Night one: the paw order
- Design (newest): Mops snores; Squatch sneaks to the garbage bin, takes the stuck-together copies; cut-in close-up, player uses his paw to check ORDER MORE ROBOTS on the pink sheet, the print presses through to the yellow; he tears off the yellow and posts it in the robot mailbox ("Mail scanned. Pawature accepted."); short cutscene: robots roll out, he hides by the big wall vent, the vent sucks the pink sheet out of his paws; control returns, he sneaks home. 11-22: hangar robot cannot catch him while it looks away, only its cone counts; cones dashed then yellow with "!"; whoever sees him runs to the wall alarm.
- v1 today: `ch1NightOut` (line 253) auto-walks home, hall, hallway, bay (no control, no robots or security outside the bay). In the bay, step "grab" at `CH1_BIN` (`GRAB · copies`), close-up "paw" (`ch1GrabCopies`, `ch1Mark`, line 296 to 300): pink sheet with ORDER MORE ROBOTS, empty box and 4723; tap draws a black check and a small brown mark on the yellow (a check, not a paw print). Then `POST · mailbox`, "Mail scanned. Pawature accepted." (line 307), robots roll in (`ch1Roll`), Squatch runs to `CH1_VENT`, pink flies into the wall vent (`ch1SuckT`), control returns with `GO · door` at (90,540), then an automatic walk home (`ch1OutHome`). No tearing animation. No thought line, as designed.
  Night robot: one robot (`CH1_ROBOT`). Cone always drawn solid yellow, feet ring drawn when `catch` is true (`drawCh1Delivery`, ~line 1530; s081). `ch1NightLook` (`12-ch1-redesign.js:240`): looks down 2 s, turns 0.3 s, looks away 4 s, turns back. During "away" `catch` is still true, and `ch1InCone` still returns true inside `STAND_FEET` (70 px) of the robot, so the close catch remains while it looks away (`ch1InCone`, line ~260; `docs/CHAPTER-1-PROBLEMS.md` problem 3). Seen = `capture("delivery")` immediately (`ch1Watch`, line 1167): lockup, not alarm. No "!" mark.
- Verdict: DIFFERS (code fix, design clear): close catch while looking away, solid cone and ring, instant lockup instead of the wall alarm. The paw cut-in, mailbox line, vent suck and return of control match.
- Old-design leftovers: `12-ch1-redesign.js:878 to 899` `ch1GrabYellow`, `ch1SignPaw` ("Signed. With my paw.") and `ch1PostMail` ("Mail scanned. Signature pawature accepted.") plus matching spots (line 1095 to 1103) are the older night flow. They sit after `if (n.ch1Day2) return ch1Day2Spots();` in `ch1QSpots`, so only reachable with Day 2 off (for example `?scene=Q4` debug link). `ch1Prop` pink-slip drawings (`drawCh1Delivery`, lines 1497 to 1503) belong to the same old flow.

---

## Dead older chain in `12-ch1-redesign.js` (affects beats 30, 33, 35, 38, 40, 41)
`ch1AtDelivery` (line ~469) has no callers (searched all of `src/game`). It leads to `ch1Snack` (504), `ch1Bedtime` (523), `ch1NightPlay` (875), `ch1PostMail` -> `ch1Week` (901) -> `ch1Tease` (907). It carries old wording ("Isfred Bar Neshuman! The dock needs you.", "Plus the Guardians are here." with Isfred's name, "Signature pawature accepted.") and the "ch1guard" panel. Judged unreachable in today's play; would run only if something calls `ch1AtDelivery`. Delete when beats are rebuilt.

Outside my range but seen: `11-ch1-hall.js:1072` ("The hangar code was on that slip I ripped.") and `50-story-frame.js:479` ("Hangar code:") are the old S-scene hangar code the design dropped; old S scenes only.

## Design questions only Brian can answer
1. Is the calendar on delivery day something the kid must do (so it gets the soft outline and the "DELIVERY" art) or optional like the Day 1 calendar (no outline)?
   - (a) Required: soft outline, add "DELIVERY / MOON PIES" and a "today" circle to the Day 2 calendar picture.
   - (b) Optional: no outline; delivery day is shown another way (Mops's lunch, the PA call).
   - (c) Required, but keep the Day 1 picture (pie circled) with no word DELIVERY.
2. What does Squatch say or do before Mops's "Didn't you hear what the manager said?" in beat 40?
   - (a) Squatch asks "Can we go to Mars?" (new line, needs his yes).
   - (b) Squatch holds the brochure up and points, no words.
   - (c) Mops's line stands alone, as now.
3. Isfred is called away in beat 32 and the call is still open. Which one?
   - (a) The UPS robot says "Isfred! A crate is damaged in the mail room." (what v1 has now).
   - (b) A speaker call: "Isfred Bar Neshuman to the front office."
   - (c) A worker taps his shoulder, no words.
4. Beat 38: the walkthrough lists only two lines; v1 adds "We ate at a pancake place on Mars." and "Here, a brochure." Keep, cut, or replace?
   - (a) Cut both, the family just hands over the brochure.
   - (b) Keep both as written.
   - (c) Keep one line, cut the other.
5. Who sees Squatch at night in beat 42 and where does the alarm run?
   - (a) Robot sees him, runs to the FUR alarm on the bay wall, security arrives (same rule as the hall).
   - (b) Robot sees him and Squatch gets one warning "?" beat before the alarm run.
   - (c) Night robot is the one exception and still catches at once.
6. Should hiding behind a plant or box in the beat 25 hall really block the guests' cones?
   - (a) Yes, plants and boxes block sight.
   - (b) No, only the ball roll helps, plants are decoration.
   - (c) Plants block sight, boxes do not.
7. The yellow outline around the snack bar is baked into the locked hall picture, so it shows when the bar is not the goal. Make a new locked hall picture without it?
   - (a) Yes, new locked version with the outline drawn by code only when it is the goal.
   - (b) Leave it.
   - (c) Keep it only in scenes where the bar is the goal and hide it elsewhere with a cover.
