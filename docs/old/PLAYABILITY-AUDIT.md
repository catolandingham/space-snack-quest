# Playability audit

Round 2, 2026-11-11. Chapter 1 slice (PR #21). Updated after a quality-gate pass on the round-1 shots. W7 is set aside for this loop only (see `docs/DECISIONS.md`).

Round-1 shots of the party and dress-up were taken while the black fade was still up, so they looked grey. These shots are after the fade (`ch1Veil` is 0). The pixel at (510, 295) is not a red heart in any of them.

Screenshots: `r2-dress.png`, `r2-party.png`, `r2-home.png`, `r2-balloon.png`, `r2-bar.png`, `r2-night.png`.

Marks: **PASS** holds. **FIX** changed in this round. **NEEDS-BRIAN** needs his yes before a change (usually new words, or a difficulty or timer change).

Round 2 counts, 48 rows: 25 PASS, 17 FIX, 5 NEEDS-BRIAN, and 1 row that is both (Mops's goodbye, until the real song). Day 1 adds 7 FIX rows (song, dance, karaoke, octopus chase, photo countdown, hide, homecoming). The waits are Joe's file, a dance sting, a party-start sting, a visible party clock, and a rolling vent ball.

Joe's file is now in this slice as `music/main-theme-from-brian.mp3`. The Day 1 picture audit is `docs/audit/DAY1-AUDIT.md`. Mute and volume still work. Nothing starts until the first tap.

## Audio (A1–A4)

There is no music file in the repo. Joe's warm theme is not here (`/workspace/ssq/music/main-theme-from-brian.mp3` is only named in the decisions). Sound is Web Audio oscillators in `src/game/00-core.js`, plus a few embedded voice clips played by `_i` for old wookiee moments. The mute and volume button (`ss-sound`, keys `ssq-pr21-vol` on the preview) still works.

| Decision | What exists | Mark |
| --- | --- | --- |
| A1 warm theme, Joe's track, heart moments and the title | `music/main-theme-from-brian.mp3` plays on the title, at home, for the gift, and when the balloon kid is happy. The generated warm phrase is retired. | FIX |
| A2 sneak, journey, stings | Generated phrases: sneak on the night mailbox and while hidden at the party; journey while a room-walk is playing; spotted uses the existing alarm beep; caught uses the existing caught sting; a secret find uses the existing pickup chime. | FIX (stand-ins) |
| A3 music in moments, not constant | The beds start and stop with those moments. Silence otherwise. | FIX |
| A4 noisy actions | Goat bleat on Mops's lines. Grab, hide, pop, alarm, slip already existed. This round adds a slurp when the pink copy goes to the vent, and a two-note bleep on robot, UPS, and scanner lines. | FIX |
| A5 no farts | None. | PASS |
| A6 Hendersons / podcast | Not used. | PASS |

## Checklist

| Moment | Look & feel | Story & continuity | Playability | Physics & motion | Audio | Fun | Mark |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Title, tap to start chapter 1 | Plain title. Readable. | Starts the redesigned chapter. | First tap also starts sound. Sound does not start before that tap. | n/a | Warm stand-in if sound is on. Joe's file is still missing. | Thin. | PASS |
| Stray heart at (510, 295) | It was Mops's lookout heart, drawn on top of every scene including dress-up. It is not drawn in this chapter (`r2-party.png`, `r2-home.png`, `r2-dress.png`). | C14 still applies in later chapters. | Nothing to tap. | The pink cone is off at home in the daytime. | None for that heart. | The screen is quieter. | FIX |
| Opening cards (Jupiter, This is Squatch) | Full-screen cards. No jump when NEXT shows. | Matches the approved cards. | Esc skips them without a click. Space or NEXT still reads them. No SKIP label. | n/a | None. | Fine. | FIX |
| Home, Squatch and Mops | Cream room, no pink cone, no floating heart (`r2-home.png`). | They stand apart. Mops is off the crate and the bucket. Squatch is off the blue box. The pink cone was Mops's lookout cone (C14) and does not draw in this chapter. | Clear floor. | Walk speed unchanged. | Journey bed only during a room change. | Quiet, and the room reads. | FIX |
| ♪ song button | Always in the control row, next to sound. | S10. He can sing only at home before Mops leaves. | Press does nothing elsewhere, on purpose. | n/a | Plays the existing sung phrase at home. Not Joe's track. | Small. | FIX |
| Mops "See you after work", walks out | He stands clear of the crate, the blue box, and the bucket (`r2-home.png`). | Stand-in for the song beat. He leaves on foot. | The line is clear. Walking is locked because control is off (a cutscene). | Walk off the door. | Bleat on his line. | The real song is still missing. | FIX / NEEDS-BRIAN for the song beat |
| PEEK doorway | Ring on the door cut. | Leads into the hall on foot. | The verb is on the button and the picture. | Door walk, not a teleport. | None extra. | OK. | PASS |
| Sneak to the plant and hide | Eyes in the plant (`04-plant-hide` was the before shot). | He is walked there, then hidden. The player does not pick the plant. | Clear enough as a short scene. | Hide is a pose at the plant feet. | Sneak bed while hidden. | A little railroaded. | PASS |
| Isfred's three welcome lines | Bubble sits under the monitor, on his nameplate. | Words are the slice lines, still pending in the lines file. | Walking stays on if he has control; these lines play with control off, so they stay tap-paced. | n/a | None for Isfred (he is not a robot). | The lines are long. | PASS |
| "Robots?" | Whisper on Squatch. | Matches the walkthrough. | One tap. | n/a | None. | Good beat. | PASS |
| Croc Boys, lights down, two seconds of dance | Dim overlay and three dancers. | Cause is the announcement, then the lights. | No button. It plays out. | Dancers bob. They do not collide. | None. A sting would help. | Short. | NEEDS-BRIAN if a dance sting is wanted |
| "I've never gotten to dance" | Thought on Squatch. | Leads home to dress. | Tap. | Then a real walk home. | None. | The want is clear. | PASS |
| Dress-up: drag, SHUFFLE, meter, GO | Big Squatch in the middle on a cream screen. Each slot is a 72px disc with a drawing of the item (`r2-dress.png`). | Outfit is hat, shades, shirt, boots, scarf, bow tie, nose, pipe. Not the spare jacket. | Tap a disc or drag it onto him. Targets are 72px. Worn pieces sit on him. A tap also wears the piece. | Pieces pop when they go on. | Pickup chime. | Reads as dressing up. | FIX |
| Fade, walk back in the outfit | Black fade about 0.4s, then the walk. | Same hall, costume on. | GO is the button. | Walk in from the door. | Journey bed during the walk. | Reads as a change of clothes. | FIX |
| TAKE robot flyer | Label sits on the flyer. | Starts the party clock and the balloon. | Stand on it and press. | Feet spot. | Pickup-style chime is not on this press. | The link to the balloon is sudden. | NEEDS-BRIAN for a louder "the party starts" sting |
| Balloon: gasp, point, rise, JUMP, GIVE or keep | Larger balloon, glow, and a ! (`r2-balloon.png`). The string runs out of the plant and up in the hall. | R59, no new words. Give is safe. Keep starts the alarm. | The ! and the pointing arm show the idea. The JUMP label appears in reach. The grab circle is unchanged. | Rise is still 6 seconds. | Warm bed when the kid is happy. | The string no longer crosses the office monitor. | FIX |
| TALK guest "Love the shirt." | Bubble on a guest. | Existing line. | One button. You can walk during it if control is on. | n/a | None. | Light. | PASS |
| 3-minute party, then "Cool hat!" | Timer is not drawn as a clock. | Stand-in ending Brian allowed (3 to 4 minutes). | You are not told time is running. | Disguise comes off, then the alarm. | Alarm beep. | The ending can feel sudden. | NEEDS-BRIAN for a visible clock or a softer warning |
| OPEN snack bar, cut-in | Zoom, blur, pyramid, bag, X. | Matches the cut-in spec. Paw follows the finger. | Drag a snack to the bag. Bottom row spills. Bartender looks away, then at him. Two catches: gloves, then fur. | Paw is a thick line. Close X is large. | Hide chime on a successful drop. No munch. | The best toy in the slice. | PASS |
| FUR alarm after the bar or a kept balloon | Red FUR card. A hand holds the lever. The words are the ones already on the card. | Cause is the catch or the kept balloon. | The card is tap-paced. | He is walked home. | Alarm beep. | The hand shows who pulled it. | FIX |
| SNAP photo | Corner camera, frame in front of the lens. | Bonus 25 is not drawn. | Walk into the frame, then SNAP. | Feet check the frame. | Pickup chime not wired to SNAP. | Fine if you notice the camera. | PASS |
| SNAG plant | Hides him and can snag the hat. | A physical reason the disguise fails. | The verb says SNAG. | Pose at the plant. | Hide sound on some hides, not this one. | OK. | PASS |
| Party scale and crowd | Guests are thick-outline aliens, taller than Squatch (`r2-party.png`). The camera tripod is off the snack table. | R67. Adults stay taller (C10). Squatch uses the hall scale. Guests are 1.8. R66 is superseded. No spr_a_* files are in the repo. | No new button. | Hide and collision still use feet. Bodies are spaced. | n/a | The room reads as a party. | FIX |
| Day 2 lunch lines and the walk to the ship | Same rooms. | Continues the old Day 2. | Cutscene lines, control off. | Walks. | Bleat, then the vent slurp. | Familiar. | FIX (slurp) |
| Day delivery: hide, Isfred, UPS, delicious, spit | Plant hide again. | Order matches the cartoon. | Played for him. | Copy flies to the vent. | Slurp, bleat, robot bleep. | The slurp was silent before. | FIX |
| Snack stand, "Quick, hide." | Hall, not the party. | S33. He is walked into the plant. | No hide button. That is the decided scene. | Auto walk. | Bleat. | Still railroaded. | PASS |
| Bedtime walk, then the Guardians card | Home, then the card. | Squatch walks to the bed. Mops walks with him. The card is the memory. Squatch does not see it. | Control is off (a cutscene). Esc can skip the card. No SKIP label. | Mops used to walk toward x 470 and then jump to (380, 460). He now walks to that spot and stays standing. Squatch is set to sleep at (205, 470). Speed is 180. | None extra. | Quiet. | FIX |
| Night mailbox | Cone outlined, aimed at the back wall (`r2-night.png`). | R64. Down 2s, turn 0.3s with no catch, back wall 4s, turn back. Cone stays 210 / 0.42 / 70. | Dash while it points up. Bin and mailbox are outside the down-beam. | Feet circle still catches. Ball still stands him up if he walks. | Sneak bed. Robot bleep on the mailbox line. | The turn is the fair version. | FIX |
| SIGN paw, POST mailbox | Labels on the bin and the mailbox. | The yellow copy is the one he signs. | Stand and press. You can wait out a look-down. | Spots use feet. | Bleep on the mailbox line. | OK. | PASS |
| Six days later card | Full card. | Decided. | Esc can skip it. | n/a | None. | Fine. | PASS |
| Robots tease Mops | Three robots, his beard. | Day delivery room again. | Tap the lines. | They do not patrol into him. | Bleeps. | Mean in a good way. | PASS |
| ROLL ball at the vent | Only beside the vent. | Escape night. | The button is there. | Walking as a ball still stands him up. That is old physics, not changed. | Hide. | Tight. | NEEDS-BRIAN if the ball should roll instead of popping up |
| Pink slip grab | Mops runs out, Squatch grabs. | Matches the cartoon. | The grab is a button when he is close. | Walk. | Bleat, grab. | Clear. | PASS |
| Office computer, RETURN empty crate | Moon Pie page on the hall computer. | R46. | The two lines of the page are the buttons' idea. | Spot at the computer. | Pickup. | OK. | PASS |
| Pickup day, crate, climb out | He starts hidden in the crate. Mops warns him. | R38. | Played, then he walks home. | Walk. | Bleat. | OK. | PASS |
| PUT ON spare jacket | Wardrobe at home. Not the party dress-up. | Spare jacket, beard, horns. Mops keeps his jacket. | Button at the wardrobe. | n/a | Grab. | Clear. | PASS |
| BOARD scanner | "HAIR... PROBABLY. PROCEED." | They walk through. | One button. | Walk up the ramp. | Scanner bleep, then the line. | The joke lands. | PASS |
| Later that evening, office lines | Office, Isfred and a robot. | R54. Words still pending. | Tap through. | They are placed in the office, not teleported mid-line. | Robot bleep. | Heavy, as it should be. | PASS |
| Tally | End card. | Never-caught still awards. | Tap. | n/a | None. | The end. | PASS |
| Song with Mops | He mops with his beard. The SING button is big. | Their song, then he leaves for work. | Press SING or the song button. | He stays put until you sing. | The existing sung phrase. | The goodbye has a reason. | FIX |
| Dance game | Arrows slide to a gold box. Four big arrow buttons. | One song, no fail. | Tap the matching button. | About 30 seconds, 10 points a hit. | Pickup chime on a hit. | You cannot lose. | FIX |
| Karaoke | From behind Squatch, crowd in front, words on the screen. | Moon Pie jingle, pending words. | Tap Sing. Louder howls, bigger cheer. | 15 seconds. Cap 50 points. | A howl each tap. | Optional and silly. | FIX |
| Octopus chase | He walks through the crowd slower than Squatch. | He wants a hug. Two hugs still end the disguise. | Steer away for about 10 seconds. | Speed 90. Catch within 48px. | The hic line. | A slow joke, not a brick wall. | FIX |
| Photo countdown | 3-2-1 and "Say cheese!" by the tripod. | The flash is the cue. SNAP still takes the picture and pays 25. | Walk into the frame, then SNAP. | Countdown is 6 seconds. | A flash. | Easier to notice. | FIX |
| Run home and hide | The guard comes in the door. | He chased you from the party. | HIDE in the bed. If he reaches you, you pop back and try again. | Guard speed 120. | The alarm already rang. | The hide is the answer. | FIX |
| You have me, TV, bedtime | Mops walks in. Three TV pictures. Then the crate story. | No parents in the story. Then the old Day 2 starts. | Tap through. | They walk. No teleport. | Warmth is still the stand-in, not Joe's file. | The day lands. | FIX |
| Dialogue advance (Space, Enter, NEXT, tap) | NEXT no longer shifts the picture. | One line at a time still. | A tap, Space, Enter, or NEXT still advances a line. The stick and arrow keys walk during a normal line (S10). Cards and cutscenes stay put. | Walk speed unchanged. | n/a | Less stuck. | FIX |
| Room doors | Walk off, new room, walk in. | No teleport for those changes. | Control is off during the walk. | Same speeds as before. | Journey bed. | Good. | PASS |
| Restart (hold R or the arrow) | Restarts the section. | Night restart puts him back at the bin side and resets the robot's clock to "looking down". | Hold, so it is not a stray tap. | n/a | None. | Fair. | PASS |

## Beats 22–61, quality pass (2026-11-11)

Each row was opened on its own with `ch1JumpBeat` (the preview URL `?beat=` does the same jump, and only on a preview host). Marks: **PASS** holds. **FIX** changed in this pass. **WEAK** still thin. **NEEDS-BRIAN** needs his yes, usually words.

| Moment | Look & feel | Story & continuity | Playability | Physics & motion | Audio | Fun | Mark |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Gift and the Guardian Box | Close-up, blurred room, paw, white X, MY GARDIANS. | He is holding the toy and the note. | DROP snaps them in. Drag also works. | Paw follows the finger. | Warm stand-in. Joe's file is not in the repo. | Clear. | FIX |
| Calendar | Red ring on the shut wardrobe door. | Delivery morning. | LOOK. | No new timer. | None. | Small. | PASS |
| Lunch sneak | Two tall guests, cones, feet circles. | Mops is in the hallway. | Sneak along the wall. A catch uses the one lockup. | Same cone as the night robot. | Sneak bed. | Fair. | PASS |
| One snack behind the counter | One snack, big bag, paw, X, blur. | Mops is beside him. One snack, then it locks. | Drag it in, or DROP. | Paw follows. | Hide chime. | Short, readable. | FIX |
| Walk to the bay | They walk hall, hallway, bay. | First walk through the hallway is a cutscene. | Watched. | No teleport. | Journey bed. | Quiet. | PASS |
| Form, Delicious, grumble, spit | Pink and yellow at his mouth, then the bin. | Nothing goes in the vent. | Watched from the plant. | Isfred and the workers walk off. | Bleat. No slurp. | The bite reads. | PASS |
| Employee of the Month wall | Five colored frames. Number 4 can open the crayon. | Optional. GO is the way on. | LOOK, then BEEP. | He walks aside. | Bleep. | Still plain. | WEAK |
| Brochure | Big card, two furry people, PANCAKES. | He only hopes. The family is taller. | Then GO home. | The card sits over the room. | Warm stand-in. | The hope is obvious. The drawing is simple. | FIX |
| Paw-check cut-in | Blurred bay, pink sheet, yellow copy, checkbox, paw, X. | ORDER MORE ROBOTS. The print is meant to press through. | Drag the paw onto the box, or MARK. | Paw follows. Snap on the box. | Sneak bed. | The best close-up. | FIX |
| Post the yellow | Mailbox spot after the check. | Yellow goes in. Pink stays in his paws. | POST. | He walks to the mailbox. | Robot bleep. | Clear. | PASS |
| Vent suck | Pink sheet tilts and moves into the vent, with suction lines. | He is hidden by the vent, eyes there, not in the plant. | Control is off. | About 1.2 seconds. | Slurp. | Readable. Still a simple rectangle. | FIX |
| Robot tease | Three robots, Mops. | The replacement line, then home. | Tap the lines. | They do not walk into him. | Bleeps. | Mean, in a good way. | PASS |
| Almost-slip | At home, two whispers. | He covers the mailed order. | Tap. | They are already home. | None extra. | The cover is the joke. | PASS |
| Sneak to the vent and the ball | ROLL at the vent. He is the L2 ball. | He waits as the L2 ball. | One button. | Moving stands him back up. That is the existing rule in the frame update, and R43 leaves standing and walking detection as they are. | Hide. | Tight. | PASS |
| Workstation | Dark vent, big Mars letter, red NO, pink slip on the desk. | The only place you learn Mops writes the notes. | Watched through the grille. | He does not go in. | None extra. | The NO is the point. The room is plain. | FIX |
| Grab the pink slip | Mops has only the pink sheet in his mouth. | Squatch takes it before Mops reads the paw. | GRAB. | They walk out. | Grab. | Clear. | PASS |
| Keypad cut-in | Blurred hall, keys about 72 px, paw, the code on the pink slip. | 4723 (now 169556, Brian, chat, 2026-11-26) is the old keypad. A wrong digit clears. | Tap each key. | Paw follows. | Key clicks, then the door. | Fair if he looks at the slip. | FIX |
| Return the crate | Moon Pie page. | Books the empty crate. | RETURN. | Spot on the computer. | Open chime. | OK. | PASS |
| Take all the snacks | Six separate snacks. Five go in the bag one at a time. The last stays for the Guardians. | Not one drop. | Drag each, or press DROP once per snack, then LEAVE. | Paw follows. A miss does not count. | Hide chime each one. | The toy it should be. | FIX |
| Packing | Box, then bucket, into the crate. The pink slip is in the box. | Guardian Box inside, bucket on top. | Two presses, or drag. | Paw follows. | Grab. | Clear enough. | PASS |
| Robots open a crate | He starts inside a mail-room crate. A crate opens by the ship. | No Dot, Bob, or Lou. | Watched, then Mops warns him. | He climbs out and they walk home. | Bleat. | OK. | PASS |
| Goat costume | Spare jacket, beard, horns. Mops keeps his jacket. The hook is empty. | Ridiculous on purpose. | PUT ON. | Same home room. | Grab. | The joke shows. | PASS |
| Last walk, POP, keepsake | Balloon pops in the hall. The crayon can be taken. | No points until Brian picks a number. | GO, optional TAKE. | They walk. | Pop. | The pop is small. | PASS |
| Scanner | Blue arch, goat Squatch, Mops, BOARD. | HAIR... PROBABLY. | Walk through. | Then up the ramp. | Scanner bleep. | The joke lands. | PASS |
| Where's Mops | Isfred and a robot in the hallway office. | He asks for the photo and hears Mops is gone. | Tap the lines. | They are placed, not mid-line teleports. | Robot bleep. | The figures are still simple. | WEAK |
| Tapes | REC on a screen, a tiny goat. | Later that evening. | Watched. | Same office. | None extra. | The silly goat is small. | WEAK |
| The call | The base tells the ship to stop. | Chapter 2 is the gas stop. | Tap. | No fuel light. | Warm stand-in. Joe's file is still missing. | Heavy, as it should be. | PASS |

## Round 3, in order

1. Drop in Joe's warm theme when the file is actually in the workspace, and retire the generated stand-in for the title, the happy balloon kid, home warmth, and bedtime.
2. A silent party-clock hint (the 180 second timer stays until Brian says otherwise).
3. Let the vent ball actually roll, if Brian wants that physics change.
4. The dress-up pieces sit a little more clearly on the body (the pipe and the nose are still close to the shades).
5. The balloon string still crosses the open floor in front of Squatch. A shorter path that stays above the crowd would read cleaner.
