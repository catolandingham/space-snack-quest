# Day 1 audit

2026-11-11. Chapter 1 slice, PR #21, judged against `docs/BRIAN-LENS.md`. Shots are the game canvas at 960×640, taken in an iPad-landscape window (1180×820). They live in `docs/audit-shots/day1/` so they can be reviewed from the repo.

Marks: **PASS** holds. **FIX** should change before Brian quality-gates the day. **NEEDS-BRIAN** needs his yes, usually on words. Two playtest bugs were still real on `ed80c1f` and are fixed in this commit. Everything else below is report-only.

No page errors came up while these moments were drawn. Timers, prices, ranges, and on-screen words were not changed.

## Bugs fixed in this commit

**P7-1, dress-up Go! softlock. FIX, now fixed.** On `ed80c1f` the GO spot sat at (460, 640) with a radius of 400. The closet floor only goes to y 578, so a real standing spot such as (120, 400) is outside that circle (about 449px away). Space, Enter, and E look at the feet, so they did nothing. A click on the dress screen was handled as a clothing drag and never reached the action. Holding R restarted the section and left `ch1Dress` set, so the overlay stayed up. Now, once the meter is full, GO covers the closet (the spot is on the floor at (480, 500), radius 520). A tap or click on the Go! label (x 340–620, y 545–640) leaves. Space, Enter, and E leave. Holding R clears the overlay. `tests/slice-p6.mjs` stands in that corner and checks all four.

**P4-6, the manager bubble over the desk. FIX, now fixed.** The welcome line was anchored at (300, 330), so the box still cut through the desk. The anchor is now (480, 500). The drawn box for "Welcome, everybody, to the Stormtop Space Party!" is x 281, y 378, 399×98. The desk and monitor occupy about x 86–214, y 64–262. They no longer meet. Shot: `bubble-1.png`. The tail points at the open floor, and the red name tag is what says it is Isfred. The words are unchanged.

## Audio

Joe's recording is `music/main-theme-from-brian.mp3`. It is MPEG layer III, 320 kbps, 44.1 kHz, stereo, 234.7 seconds (the 3:54 track in decision A1).

| Cue | When it plays | What you hear |
| --- | --- | --- |
| Title | The title screen | Joe's file, looping, fading in |
| Home | The closet, except the security search, the guard, and the dress-up overlay | The same file |
| Gift | The morning gift is on the floor, or Squatch is holding the toy | The same file |
| Heart | The balloon kid is smile, wide, or shh | The same file |

Sneak is still the generated triangle phrase (notes 48, 51, 55, 51). It plays on the night mailbox while he has control, and while he is hidden at the party. Journey is still the generated triangle phrase (55, 59, 62, 67, 71). It plays only during a room walk. Silence otherwise. Mute and the volume button still apply. The file is not created until the first tap has started the audio context, so nothing plays before that tap.

Checked in the built page: the browser requested `music/main-theme-from-brian.mp3`, and `audio.play()` resolved. Leaving the cue pauses the file. The old four-note sine stand-in is gone.

## Each moment

### Dress-up — FIX

Shots: `dress-1.png`, `dress-2.png`.

A six-year-old can see the big Squatch and the eight blue buttons. The meter and the word "Go!" are clear once the bar is full. The softlock is gone.

The worn pieces still land in one pile on the face. The pipe, the red nose, the shades, and the bow tie occupy the same few pixels, so "I put on a pipe" does not read. Two labels say go ("GO · party" and "Go!"). Both work. The shirt and boots are visible, which is the part that works.

Fun: the dragging is the right toy. The face pile makes the payoff mushy.

Concrete fix: give each worn piece its own place on the body (hat above, shades on the eyes, bow at the neck, nose on the snout, pipe out to the side, shirt on the torso, boots on the feet). No new words.

### Bar paw-swipe, both catches, and the FUR alarm — FIX

Shots: `bar-1.png`, `bar-2.png`, `bar-3.png`.

This does not look like a close-up of a snack bar. The whole party stays on screen under a grey wash. A brown line comes in from the corner, four yellow dots sit in the air, a white card says "0", and an X sits in the corner. A six-year-old is not going to read that as "drag a snack into the bag." The first catch ("...Nice gloves.") and the second catch (the FUR card) happen on top of that same muddy picture. The FUR card itself is a red panel with a lever. It does not show the room he is about to run out of.

Fun: the idea is the best toy in the day. The picture does not teach it.

Concrete fix: zoom the pyramid and the bag until they fill the screen, keep the paw fat and short, and show the snack landing in the bag before the line. Keep the existing words.

### Snack pyramid chain — FIX

Shots: `snack-1.png`, `snack-2.png`.

The table pyramid is three specks. The "chain" is those specks sliding right, plus an orange stick drawn out of every guest. Nothing knocks into anything else. A child cannot see a cause. The orange sticks read as a drawing error.

Fun: no. It is a particle, not a machine.

Concrete fix: three or four big snacks, each one visibly hitting the next, ending in the spill. Drop the orange sticks, or make them one clear point at the spill.

### Dance — FIX

Shots: `dance-1.png`, `dance-2.png`.

The four arrow buttons are big enough for a finger, and matching an arrow is a real game. A child can learn it by trying. The black lane is drawn across the guests' heads, the room is dimmed, and nothing says that the arrow on the right should meet the gold circle. The score is a lone 0 in the corner.

Fun: yes, once it is understood. The picture fights it.

Concrete fix: keep the buttons and the lane, sit the lane in the open floor, and stop covering faces. No new words.

### Karaoke — FIX, and NEEDS-BRIAN for the lines

Shots: `karaoke-1.png`, `karaoke-2.png`.

The screen goes dark blue and leaves the party. Squatch is a pair of feet under a yellow "Sing" circle. Four small guests stand in a row with no mouths and no reaction. Tapping Sing does howl, and the cheer is a star bonus at the end, which is never shown. A child hears a beep and does not see a crowd get louder. The two lines are still pending in `docs/CH1-LINES-FOR-BRIAN.md`.

Fun: the button is inviting. The crowd does not cheer.

Concrete fix: stay in the party, show Squatch from behind at a size you can recognize, and grow the crowd (or a visible cheer) on each howl. Words stay pending until Brian says yes.

### Octopus chase — FIX

Shots: `octopus-1.png`, `octopus-2.png`.

The octopus is a yellow blob. He slides toward Squatch and the line "*hic* Fellow tourist!" appears because Squatch walked near him, not because of a clear bump. A child will not know to run. The first hug knocks the hat askew. The second hug ends the party. Standing still is enough to get caught, and the catch jumps straight into the hug.

Fun: a slow chase can be funny. This one does not read as a chase.

Concrete fix: a tell before he moves (he turns, then he walks), and a visible gap the child is supposed to keep. Do not change his speed.

### Photo and the polaroid — FIX

Shots: `photo-1.png`, `photo-2.png`.

"Say cheese!" and the countdown number are easy to see. They are pending words. The polaroid that follows is a white card with two generic aliens. It is not a picture of this room, this Squatch, or these guests. The flash does not take the photo. SNAP still does, and it still pays the existing 25.

Fun: the countdown is a good joke. The card throws it away.

Concrete fix: the card should show the guests who were in the frame, with Squatch in the costume if he was in the shot. Keep the 25.

### Balloon — FIX

Shots: `balloon-1.png`, `balloon-2.png`.

The kid's "!" and pointing arm are the readable part. The balloon is a red dot on a string that runs across the kid, the plant, and the air in front of the guests. Squatch stands inside the blue guest. Giving it back changes the kid's face and does not show a balloon in his hand. A miss still goes to the ceiling with no yell. That part matches the decided rule.

Fun: the point-and-gasp works. The string and the dot do not look like a balloon you want.

Concrete fix: a round balloon with a highlight, and a string that stays over the plant and the kid. Show it in the kid's hand on the give.

### Run home and the search — FIX

Shot: `home-1.png`.

The guard coming in the door is the right idea. If he reaches Squatch, Squatch pops back to (760, 540) and the guard pops back to the door. That is a teleport. A child who was hiding in the wrong spot does not see "he caught me and put me back." He sees a blink. HIDE in the bed is a big target and does end it.

Fun: the chase is the right stake. The blink is cheap.

Concrete fix: walk him back to the start, or show the catch, then the reset. Do not change the guard's speed.

### TV story — FIX

Shots: `tv-1.png`, `tv-2.png`.

Three full-screen dark blue cards. They are not the television on the shelf in the home room. A child who just watched Mops walk in will not connect "Fur in the scrubber." to the TV turning on. The figures are tiny and unlabeled. "Onto the ship." is pending.

Fun: low. It is a slide, not a show.

Concrete fix: play the three pictures on the TV that is already in the room, with Mops and Squatch still standing in front of it.

### Bedtime — FIX, and NEEDS-BRIAN for the words

Shot: `bedtime-1.png`.

Another dark card. Squatch stands on top of the crate. He is not in bed. Mops stands beside the crate. The two Moon Pie lines are the right story and they are still pending. A child can read the feeling of the words and still not know this is bedtime, because nobody is lying down.

Fun: the sentence is the heart of the day. The picture misses it.

Concrete fix: the home room at night, Squatch in the bed, Mops nearby, the crate where it already sits. Keep the pending lines until Brian signs them.

### Night robot — PASS

Shots: `night-1.png`, `night-2.png`, `night-3.png`.

The robot, the yellow cone, the plant, the bin, and the mailbox are readable. Looking down catches the floor in front of him. The turn swings the cone and does not catch. Looking at the back wall leaves the floor clear, and the feet circle still catches if you hug him. The clock is still 2 seconds down, 0.3 seconds to turn, 4 seconds at the wall, 0.3 seconds back. No number was changed.

A six-year-old can learn "wait until he looks up, then go." That is the game.

Fun: yes. This is the clearest stealth moment in the day.

### Squatch beside a guest — PASS

Shots: `size-1.png` (party disguise), `size-2.png` (no disguise).

He stands next to the spotted guest and the blue guest. With the hat on he is still clearly shorter than the adults. Without it he is about three fifths of their height. The kid by the plant is his size. That matches the standing rule: adults are taller than Squatch and Mops. Guest bodies still overlap each other (the yellow blob covers the spotted guest's legs). That is a crowd problem, not a scale problem.

### Squatch and Mops at home — FIX, not changed

Shot: `home-2.png`.

He can walk through Mops. The closet solids are the bucket, the blue G box, and the crate. Neither character is solid. A scripted walk from x 250 to x 560 at y 560 passed through Mops at (455, 560). The closest he got was 2px, and he finished at (561, 560). In the shot they are drawn on top of each other, and the blue G box sits in the middle of both bodies.

A child will walk into Mops and not understand why he didn't stop.

Concrete fix, when a change is allowed: a small feet solid on the other character, the same size as the bucket's feet box, so they slide around each other. Do not change walk speed.

## Top 10, by how hard Brian would notice

1. The bar cut-in is not a snack bar. It is a grey party with a stick and four dots.
2. Karaoke, the TV story, and bedtime leave the room for a dark card.
3. Dress-up piles the pipe, nose, shades, and bow on one spot of the face.
4. The snack chain is specks and orange sticks, not a machine.
5. Squatch walks through Mops at home.
6. The balloon is a red dot, and the string crosses the people.
7. The dance lane covers the guests' heads.
8. The polaroid is not a photo of this party.
9. The guard catch blinks Squatch across the room.
10. Guests still stand inside each other, and a few read as odd shapes (the croc's bill, the antenna body).

The Go! softlock and the desk bubble were in that class. They are fixed in this commit.
