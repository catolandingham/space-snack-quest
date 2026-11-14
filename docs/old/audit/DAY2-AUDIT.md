# Day 2 moments that play themselves

These are the beats from 22–61 where the kid mostly watches, or only taps the next line. They are proposals for Brian. None of them are built.

Each idea is one small thing a kid can do with a finger, with no new words. The story stays the same.

| Beat | What plays now | One wordless thing a kid could do |
| --- | --- | --- |
| 29. Walk to the bay | They walk the hall, the hallway, and into the bay. The first hallway walk is already a cutscene, so nothing there can be found early. | On the way back, when the hallway is allowed, drag a finger along the photo wall and the frames tilt as he passes. |
| 32–35. The form, Delicious, the grumble, the spit | Squatch watches from the plant. Isfred leaves. Mops bites, grumbles, and spits both copies into the bin. | Tap the plant. Squatch leans out a little, then tucks back in. The bite and the spit still happen on their own. |
| 41. Lights out | They walk to the bed. The light goes out. No story, no flashback. | Tap the dark window. A star blinks. He is already in bed. |
| 44. The robots tease Mops | Three robots, his beard, then they go home. The kid taps the lines. | Tap a robot. It rocks back, then rolls in again. No new line. |
| 46. The almost-slip | Two whispers at home. He covers the mailed order. | Tap Squatch. His paws come up over his mouth, then drop. |
| 48. The workstation | He watches through the grille. Mops, the letter, the stamp. | Drag the grille slats. They slide a little and he sees the desk more clearly. The letter does not change. |
| 54. Robots open a crate | He is already in the crate. A crate by the ship opens. Mops warns him. | Hold a finger down to stay tucked. Letting go makes the crate lid creak. He does not get caught. |
| 60. The tapes | The office, then the recording of the goat. | Tap the screen. The picture freezes on the goat, then plays on. |
| 61. The call | The base tells the ship to stop. | Tap the ship in the window. Its lights blink once, then it holds still. |

The vent suck in beat 42 stays a cutscene. The walkthrough already asks the kid to watch it, after he has checked the order and posted the yellow copy. He walks to the vent. He is not moved there.

## Playtest 8, played from a fresh start

A person on the preview could not finish by following the picture. The automated playthrough was stepping him onto each button. This pass starts from the title, uses only the chip, the button, and what is drawn, and writes down each place that stopped.

| Stuck | What a person saw | Fix |
| --- | --- | --- |
| P8-1. Home, after the song | Pressing the button made Mops disappear in the room. The chip still said go with Mops to the ship. | Mops walks out the door. Squatch follows him to it. The chip changes to the existing line "Squatch: peek out the door," and a yellow arrow sits on that door. |
| Mops was not solid | Squatch could walk through Mops from the side, above, or below, outside the closet. | Mops is solid from all four sides in the chapter 1 rooms he stands in: home, the party hall, the hallway, the bay, and the vent. Later chapters keep their own spacing, because the gas-stop route walks past him. `tests/mops-solid.mjs` walks into him from the left, right, above, and below in the closet and the hall. |
| Hide in the plant | At the ship, the button did nothing unless he was already on the plant, and he never tucked in. | The plant glows. Walking into the glow, or pressing the button, walks him into the plant. His eyes show. The chip becomes the existing line "Squatch: hide and watch." |
| Employee of the Month, "go to the ship" | The hallway wall is the photos, not the ship. Nothing in the picture pointed at a way out, and the button was only at the far edge. | The walkthrough's beat 60 is the tape card after boarding, which plays on its own. The stuck chip is the hallway before the scanner. A yellow arrow points at the right-hand door, and that door is the button. |
| Fur in the vent | The line popped up while walking in the home room. There is no vent on that floor. | The line does not play in this chapter's home. A prompt needs a vent on screen. |
| Walk around the room | The opening chip said to walk, with nothing on the floor showing that walking did anything. | Yellow arrows sit on the floor until he has walked. Then Mops comes in and the chip is the existing line "Squatch: sing along with Mops." |
| Snack room to the ship, jacket to the scanner | The rooms swapped in one cut. | Those changes already walk out and walk in through the hallway. The office after the scanner fades instead of popping him there. |
| Spare jacket | Pressing it spoke a line and left. The party dress-up screen did not open, and the jacket was easy to miss. | Day 2 does not use the party dress-up. That game was the party. He walks to the wardrobe, the spare jacket, beard, and horns appear on him, and then they leave. |
| PA over the monitor | The ship announcement covered the manager's screen. | The announcement sits lower and clear of that screen. |
| Lunch sneak loop | At the hall door the only button in reach was ROLL. Pressing it made a ball, and walking stood him up, so the door never became the button. Found by walking with only the on-screen button. | SNEAK is the button along the hall. ROLL is a small spot off that path. Yellow arrows point to the door. |

## Rooms with no locked picture

The vent workstation (the duct, beat 48) has no file in `docs/locked-rooms/`. It is still drawn by hand. The party hall, hallway, office, home, and loading bay (day, night, no ship, and pickup) use the locked pictures.
