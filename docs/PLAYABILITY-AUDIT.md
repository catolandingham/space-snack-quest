# Playability audit

Round 2, 2026-11-11. Chapter 1 slice (PR #21). Updated after a quality-gate pass on the round-1 shots. W7 is set aside for this loop only (see `docs/DECISIONS.md`).

Round-1 shots of the party and dress-up were taken while the black fade was still up, so they looked grey. These shots are after the fade (`ch1Veil` is 0). The pixel at (510, 295) is not a red heart in any of them.

Screenshots: `r2-dress.png`, `r2-party.png`, `r2-home.png`, `r2-balloon.png`, `r2-bar.png`, `r2-night.png`.

Marks: **PASS** holds. **FIX** changed in this round. **NEEDS-BRIAN** needs his yes before a change (usually new words, or a difficulty or timer change).

Round 2 counts, 48 rows: 25 PASS, 17 FIX, 5 NEEDS-BRIAN, and 1 row that is both (Mops's goodbye, until the real song). The waits are Joe's file, a dance sting, a party-start sting, a visible party clock, and a rolling vent ball.

Joe's file: `warm-theme-joe.tar.gz` was named in the request and was not on this machine. The generated warm stand-in is still what plays. Mute and volume still work. Nothing starts until the first tap.

## Audio (A1–A4)

There is no music file in the repo. Joe's warm theme is not here (`/workspace/ssq/music/main-theme-from-brian.mp3` is only named in the decisions). Sound is Web Audio oscillators in `src/game/00-core.js`, plus a few embedded voice clips played by `_i` for old wookiee moments. The mute and volume button (`ss-sound`, keys `ssq-pr21-vol` on the preview) still works.

| Decision | What exists | Mark |
| --- | --- | --- |
| A1 warm theme, Joe's track, heart moments and the title | The tar was not in the workspace. A short generated phrase still stands in on the title and when the balloon kid is happy. | NEEDS-BRIAN to resend the file |
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
| Dialogue advance (Space, Enter, NEXT, tap) | NEXT no longer shifts the picture. | One line at a time still. | A tap, Space, Enter, or NEXT still advances a line. The stick and arrow keys walk during a normal line (S10). Cards and cutscenes stay put. | Walk speed unchanged. | n/a | Less stuck. | FIX |
| Room doors | Walk off, new room, walk in. | No teleport for those changes. | Control is off during the walk. | Same speeds as before. | Journey bed. | Good. | PASS |
| Restart (hold R or the arrow) | Restarts the section. | Night restart puts him back at the bin side and resets the robot's clock to "looking down". | Hold, so it is not a stray tap. | n/a | None. | Fair. | PASS |

## Round 3, in order

1. Drop in Joe's warm theme when the file is actually in the workspace, and retire the generated stand-in for the title, the happy balloon kid, home warmth, and bedtime.
2. A silent party-clock hint (the 180 second timer stays until Brian says otherwise).
3. Let the vent ball actually roll, if Brian wants that physics change.
4. The dress-up pieces sit a little more clearly on the body (the pipe and the nose are still close to the shades).
5. The balloon string still crosses the open floor in front of Squatch. A shorter path that stays above the crowd would read cleaner.
