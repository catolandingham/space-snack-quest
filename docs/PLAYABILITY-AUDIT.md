# Playability audit

Round 1, 2026-11-11. Chapter 1 slice (PR #21). Headless screenshots and the story code. Updated each polish round. W7 is set aside for this loop only (see `docs/DECISIONS.md`).

Follow-up the same day: the bedtime walk no longer snaps. Mops walks to (380, 460), the same spot he then lies down. R65 is home and the other rooms; the party picture is R66.

Marks: **PASS** holds. **FIX** changed in this round. **NEEDS-BRIAN** needs his yes before a change (usually new words, or a difficulty or timer change).

Screenshots: `party-before.png`, `party-after.png`, `balloon-after.png`, `night-away.png`, `dress-after.png`, `mops-on-bucket.png`.

## Audio (A1–A4)

There is no music file in the repo. Joe's warm theme is not here (`/workspace/ssq/music/main-theme-from-brian.mp3` is only named in the decisions). Sound is Web Audio oscillators in `src/game/00-core.js`, plus a few embedded voice clips played by `_i` for old wookiee moments. The mute and volume button (`ss-sound`, keys `ssq-pr21-vol` on the preview) still works.

| Decision | What exists | Mark |
| --- | --- | --- |
| A1 warm theme, Joe's track, heart moments and the title | File missing. A short generated phrase stands in on the title and when the balloon kid is happy. | NEEDS-BRIAN to drop in his file |
| A2 sneak, journey, stings | Generated phrases: sneak on the night mailbox and while hidden at the party; journey while a room-walk is playing; spotted uses the existing alarm beep; caught uses the existing caught sting; a secret find uses the existing pickup chime. | FIX (stand-ins) |
| A3 music in moments, not constant | The beds start and stop with those moments. Silence otherwise. | FIX |
| A4 noisy actions | Goat bleat on Mops's lines. Grab, hide, pop, alarm, slip already existed. This round adds a slurp when the pink copy goes to the vent, and a two-note bleep on robot, UPS, and scanner lines. | FIX |
| A5 no farts | None. | PASS |
| A6 Hendersons / podcast | Not used. | PASS |

## Checklist

| Moment | Look & feel | Story & continuity | Playability | Physics & motion | Audio | Fun | Mark |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Title, tap to start chapter 1 | Plain title. Readable. | Starts the redesigned chapter. | First tap also starts sound. | n/a | Warm stand-in if sound is on. | Thin. | PASS |
| Opening cards (Jupiter, This is Squatch) | Full-screen cards. No jump when NEXT shows. | Matches the approved cards. | Esc skips them without a click. Space or NEXT still reads them. No SKIP label. | n/a | None. | Fine. | FIX |
| Home walk before Mops speaks | Home matches the wardrobe picture. | He walks; no teleport. | Tap the floor or use the stick. | Walk speed unchanged. | Journey bed only during a room change, not this stroll. | Quiet. | PASS |
| ♪ song button | Always in the control row, next to sound. | S10. He can sing only at home before Mops leaves. | Press does nothing elsewhere, on purpose. | n/a | Plays the existing sung phrase at home. Not Joe's track. | Small. | FIX |
| Mops "See you after work", walks out | Feet were on the bucket (`mops-on-bucket.png`). He now stands at x 220. | Stand-in for the song beat. He leaves on foot. | The line is clear. Walking is locked because control is off (a cutscene). | Walk off the door. | Bleat on his line. | The real song is still missing. | FIX / NEEDS-BRIAN for the song beat |
| PEEK doorway | Ring on the door cut. | Leads into the hall on foot. | The verb is on the button and the picture. | Door walk, not a teleport. | None extra. | OK. | PASS |
| Sneak to the plant and hide | Eyes in the plant (`04-plant-hide` was the before shot). | He is walked there, then hidden. The player does not pick the plant. | Clear enough as a short scene. | Hide is a pose at the plant feet. | Sneak bed while hidden. | A little railroaded. | PASS |
| Isfred's three welcome lines | Bubble sits under the monitor, on his nameplate. | Words are the slice lines, still pending in the lines file. | Walking stays on if he has control; these lines play with control off, so they stay tap-paced. | n/a | None for Isfred (he is not a robot). | The lines are long. | PASS |
| "Robots?" | Whisper on Squatch. | Matches the walkthrough. | One tap. | n/a | None. | Good beat. | PASS |
| Croc Boys, lights down, two seconds of dance | Dim overlay and three dancers. | Cause is the announcement, then the lights. | No button. It plays out. | Dancers bob. They do not collide. | None. A sting would help. | Short. | NEEDS-BRIAN if a dance sting is wanted |
| "I've never gotten to dance" | Thought on Squatch. | Leads home to dress. | Tap. | Then a real walk home. | None. | The want is clear. | PASS |
| Dress-up: drag, SHUFFLE, meter, GO | Title was under the goal chip. The chip is hidden on this screen. Worn pieces turn blue (`dress-after.png`). | Outfit is hat, shades, shirt, not the spare jacket or horns. | Drag onto him, or SHUFFLE, then GO. Targets are about 36px; a bit small on iPad. | Pieces snap if dropped near him. | None. | Better. Still abrupt until the fade. | FIX |
| Fade, walk back in the outfit | Black fade about 0.4s, then the walk. | Same hall, costume on. | GO is the button. | Walk in from the door. | Journey bed during the walk. | Reads as a change of clothes. | FIX |
| TAKE robot flyer | Label sits on the flyer. | Starts the party clock and the balloon. | Stand on it and press. | Feet spot. | Pickup-style chime is not on this press. | The link to the balloon is sudden. | NEEDS-BRIAN for a louder "the party starts" sting |
| Balloon: gasp, point, rise, JUMP, GIVE or keep | The balloon was a speck. It is larger, with a glow and a ! (`balloon-after.png`). | R59, no new words. Give is safe. Keep starts the alarm. | The ! and the pointing arm show the idea. The JUMP label appears in reach. | Rise is still 6 seconds. | Warm bed when the kid is happy. No whoosh on the slip. | Clearer. The string can cross the office wall. | FIX |
| TALK guest "Love the shirt." | Bubble on a guest. | Existing line. | One button. You can walk during it if control is on. | n/a | None. | Light. | PASS |
| 3-minute party, then "Cool hat!" | Timer is not drawn as a clock. | Stand-in ending Brian allowed (3 to 4 minutes). | You are not told time is running. | Disguise comes off, then the alarm. | Alarm beep. | The ending can feel sudden. | NEEDS-BRIAN for a visible clock or a softer warning |
| OPEN snack bar, cut-in | Zoom, blur, pyramid, bag, X. | Matches the cut-in spec. Paw follows the finger. | Drag a snack to the bag. Bottom row spills. Bartender looks away, then at him. Two catches: gloves, then fur. | Paw is a thick line. Close X is large. | Hide chime on a successful drop. No munch. | The best toy in the slice. | PASS |
| FUR alarm after the bar or a kept balloon | Red FUR card, then the walk home. | Cause is the catch or the kept balloon. | The card is tap-paced. | He is walked home. | Alarm beep. | The red card is still abrupt. | NEEDS-BRIAN for a guest's hand on the lever (no new words until he says) |
| SNAP photo | Corner camera, frame in front of the lens. | Bonus 25 is not drawn. | Walk into the frame, then SNAP. | Feet check the frame. | Pickup chime not wired to SNAP. | Fine if you notice the camera. | PASS |
| SNAG plant | Hides him and can snag the hat. | A physical reason the disguise fails. | The verb says SNAG. | Pose at the plant. | Hide sound on some hides, not this one. | OK. | PASS |
| Party scale | Before: he was about 70% of a guest and bodies stacked (`party-before.png`). After: guests at 1.3, him at 2, spaced (`party-after.png`). | He reads as a guest, a little taller. Home size is unchanged (R65). | No new button. | Hide and collision still use feet, not the picture's height. | n/a | The room breathes. | FIX |
| Day 2 lunch lines and the walk to the ship | Same rooms. | Continues the old Day 2. | Cutscene lines, control off. | Walks. | Bleat, then the vent slurp. | Familiar. | FIX (slurp) |
| Day delivery: hide, Isfred, UPS, delicious, spit | Plant hide again. | Order matches the cartoon. | Played for him. | Copy flies to the vent. | Slurp, bleat, robot bleep. | The slurp was silent before. | FIX |
| Snack stand, "Quick, hide." | Hall, not the party. | S33. He is walked into the plant. | No hide button. That is the decided scene. | Auto walk. | Bleat. | Still railroaded. | PASS |
| Bedtime walk, then the Guardians card | Home, then the card. | He walks to the bed with Mops. The card is the memory. Squatch does not see it. | Control is off (a cutscene). Esc can skip the card. No SKIP label. | He used to walk toward x 470 and then jump to (380, 460). He now walks to that same spot. Speed is 180. | None extra. | Quiet. | FIX |
| Night mailbox | Cone was faint. It is outlined, with the feet circle (`night-away.png` shows it aimed at the back wall). | R64. Down 2s, turn 0.3s with no catch, back wall 4s, turn back. Cone stays 210 / 0.42 / 70. | Dash while it points up. Bin and mailbox are outside the down-beam. | Feet circle still catches. Ball still stands him up if he walks. | Sneak bed. Robot bleep on the mailbox line. | The turn is the fair version. | FIX |
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

## Round 2, in order

1. Drop in Joe's warm theme when the file arrives, and retire the generated stand-in for heart moments and the title.
2. A guest's hand on the FUR lever, still with no new words until Brian writes them.
3. Make the party clock readable without a new lecture (a recommendation: a small silent fill on the goal chip).
4. Larger dress-up targets for a finger.
5. Balloon string stays in the room, not across the office wall.
6. Let the vent ball actually roll, if Brian wants that physics change.
