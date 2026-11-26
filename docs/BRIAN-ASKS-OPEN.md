<!-- section-index -->
**Section index.** Read this index, then only the section you need. Do not read this file whole.

| Lines | Heading |
| --- | --- |
| 26–32 | # Brian's asks that are not in the game yet |
| 33–42 | ## 1. Build next |
| 43–60 | ## 2. Needs your eyes |
| 61–64 | ## 3. Your instructions disagree |
| 65–66 | ## 4. Everything else not built |
| 67–85 | ### Morning and home |
| 86–96 | ### Party |
| 97–108 | ### Playthrough 2026-11-23 (party, for the party rebuild) |
| 109–112 | ### Party video notes and answers, 2026-11-24 (not built yet) |
| 113–117 | ### Snacks and dress-up |
| 118–130 | ### Day 2 and night |
| 131–135 | ### Escape and later chapters |
| 136–139 | ### Looks and lines |
| 140–147 | ### Sound |
| 148–151 | ### Words and rules |
| 152–164 | ### How the bots work |
| 165–172 | ### Ideas kept from closed pull requests (Brian's "10a", 2026-11-23) |
| 173–189 | ## 5. Merged, in a pull request, and being built |
| 190–200 | ## 6. Corrections to the checkers |
<!-- /section-index -->
# Brian's asks that are not in the game yet

This page lists everything Brian asked for that is not in the game yet, checked against main on 2026-11-23 and against an independent review the same day.
When an ask gets built, it leaves this page. Bots: read "Build next" before choosing work.
The full lists are in ~/Code/space-snack-quest-private/asks/. Source tags: G = G Bot, S = Squatchbot, K = Grok Bot, P = Nov 8 playtest.
Brian's G Bot messages 419 to 603 were written while he looked at the old "v2" build, so a few faults he named there may not exist in today's game. Those rows say so.

## 1. Build next

Brian's answers of 2026-11-23 (Snack Quest Chat) are in the rows below and win over older words.

9. **No outline unless required.** Only the thing the player must go to next gets an outline. "I don't think we should have yellow outlines in Squatch when it's not actually requiring you to do the thing." (G 567). Outline of props the game draws itself, dashed and outside: "For the bush outline, I'd still like it to be outside of the object and dashed." (G 438). The glowing circle and bouncing arrow still draw outside Chapter 1 (60-frame-draw.js:522-545): "it doesn't need an arrow!!" (S 1153).
11. **A check that catches drift.** Open PR #34 checks his rules on each pull request; a first try is closed PR #34 (rules check on every PR); nothing compares the game to DECISIONS.md. "I think we basically need to have a recurring built-in check to make sure we're not drifting." (G 433).
12. **Delete the old Chapter 1.** "we didn't get rid of the wrong ideas as we went" (G 433); "deleting bad code" (G 516). The old opening is still in 10-ch1.js and 11-ch1-hall.js.
13. **Last, if time allows: karaoke.** Brian, 2026-11-23. Karaoke with the Moon Pie song: "For karaoke, let's actually do a different song." (S 1013); "I'm good with the Moon Pie's song." (S 1019). Today it is tap-to-howl only.
14. **"Ganitor".** Brian, 2026-11-26: "Ganitor is what mops is - goat janitor - that should be an ongoing reference in the game." Make "Ganitor" (goat + janitor, Mops's job title) an ongoing reference in the game; where it shows is Brian's choice, being asked 2026-11-26. Not on screen anywhere until he says where (decided as a fact in `docs/STORY-DECISIONS.md`, "Also answered").

## 2. Needs your eyes

- **Pick the FUR alarm** (2026-11-25, showing-5 note 8). Five made-up alarm sounds on one page, `tools/alarm-choices.html`; the one he picks becomes the only alarm in Chapter 1. Not changed in the game until he picks.
- **The Moon Pie bedtime story (beat 21).** Brian 2026-11-25: the old crate story "is the bedtime story (beat 21) and gets the same sizing fix". Built on branch `feat/ch1-bedtime-story` (PR #89, draft, not merged) with the old captions and his bedtime line, needs-yes; the mop bucket picture is off for his answer. His 2026-11-26 notes are built there too: Squatch asks "Tell me about when we first met?" (exact words to confirm), Mops's "...Weeee-eenn-nnttt?", the vocal song kept, the Guardians picture with his approved line, and falling asleep with a yawn, the tuck, the light going down and three snores. Waiting for his eyes. Open: where Mops sleeps (built: he goes out by the door).
- **Home room objects.** "the new version of the crate in the room is off, at least in the picture you showed." (G 597). Covers crate, bed, bucket, bedtime-story look, janitor facing. Walls and furniture merged today; check.
- **The dance game.** A scrolling-arrow dance exists but you said it never worked. "The dance game, hopefully that can be done clean and simple. If not, forget it." (G 516). "the fur shows at the dance scene" (G 603) is unclear.
- **The balloon game.** "The balloon thing has just never worked when we've tried it before ... if it's all wonky and confusing, forget it." (G 516); "the balloon's just total nonsense" (K 336). Still in main (12-ch1-redesign.js:808-834).
- **The theme song.** "don't like the theme song :/ definitely not the singing part" (G 318). Joe's track is one he uploaded ("This should be main theme", S 354; "It's all good", S 361). Ask which song he meant before building.
- **Hallway and corners.** "Adding The Airlock Button Here For No Reason Doesn't Really Make Sense" (P L198). "The Alarm Can Not Be In The Bush Here" (P L163). The hall asks about the speaker and FUR alarm on one wall and the window wrap (S 457, 463, 466) are checked against the locked hall picture, which has the speaker and alarm on the back wall and no wrap.
- **Sizes and looks of people.** Room-door sizing is built, cutscene sizes unchecked. "please go ahead with sizing people by each room's door, even tho it risks running out" (S 1163). "It could just be is Fred." (S 982). "I hate the arms on the green guys - just make them normal" (K 314).
- **Room changes and camera.** "it kind of jumps to him dropping into the middle of the next scene versus like a smooth walk" (S 195); "the camera being in off placement and so so so many of those things" (K 328). Characters jumping: "All Of A Sudden You're Hidden Like We Need An Actual Transition Here" (P L90) means show how he got hidden.
- **Extra lit-up things.** "the purple extra thing on the bed", "the extra thing next to the planter" (K 328); "The thoughts aren't above the bush. The bar is lit up for no reason." (K 332); "there's multiple lit up yellow things on the screen" (K 336). Not checked by eye.
- **Smaller drawings.** "Highlights The Square In The Middle Of The Room Doesn't Make Sense" (P L73). "balloon is underneath the speaker." (S 968). "I don't know about the font" (S 580). "I do like option one on the shirt when we go with it" (S 497).
- **Night and escape.** Step restart merged today; "maybe it's that it restarts the last scene" (S 1224). Robots: "maybe it needs to be a cut scene that the robots roll out of storage and he runs back there." (S 1065). "Just remember to have action button lead to him squatting" (S 693). "It should be the same mechanism." (S 383).
- **Story clarity.** "We need to make sure we really clean up story to be as understandable as a kids book" (S 294); "Feels like there's a lot of dialogues to get through right at the beginning of the game" (S 175).
- **Unclear messages.** "Illustrations. it's really about the illustrations for the, the shelves." (G 543); "have you hidden Easter eggs like previously discussed" (S 118).
- **The red line.** "some visual to remind him not to go past there, like a, a red line on the wall or something" (S 347) was about the bedroom vent, which G 313 says the docs now drop. Confirm it is moot.

## 3. Your instructions disagree

- **May bots merge while you are away?** "Nothing merges without my yes in the pull request." (S 227) against "merge without checking with me" (S 1286), and in the newest thread "I want you to just make decisions and update the live game without me having to verify anything further" (G 516) and "no need to ask for permission, i'm walking away" (G 365). Two waivers or a standing rule; confirm.

## 4. Everything else not built

### Morning and home
- Thought bubbles for animals. "Thought bubble is fine just was pointing out it was not in the version you showed" (S 593).
- Vent strings, crossed-off planets, toy bin. "Draw strings between postings and make it more obvious he's searching like a detective" (S 590).
- Mops goat body and tail. "Full beard to floor, remember!! And more goat body" (S 522). He is called "Janitor, goat janitor is what mops is called." (G 565); humor "where do we have humor about him being the planet's first goat / janitor - aka ganitor? Need to add that in." (S 218). Old unused scenes hold some of these words.
- Make the first gift obvious. "that needs to be more obvious." (S 92).
- Things to touch on the walk to the room. "maybe look around, maybe there's another thing or two he can interact with on the way." (S 405).
- Bedtime story flashback: Mops at his desk, Guardians, big furry Sasquatches. "I agree with A, that works really well." (S 429).
- Janitor finds Squatch and keeps him. "I Know What It's Like To Be One Of A Kind" (P L134).
- Sasquatch family visits and is sent back. "We Should Show Sasquatch Family Coming To Visit" (P L120).
- Pretend to sleep, wait for the janitor. "You Would Just Pretend To Go To Sleep And Then Wait For The Ganitor To Actually Fall Asleep" (P L168).
- Guardian note in the vent. "we know you're thinking about going to Mars. Don't worry, we'll always be with you." (S 408).
- Package inspection announcement. "due to suspicious activity, we will be inspecting every package" (S 408).
- The slip is the confirmation and mail-back form. "this is the confirmation form and also what you mail back to us if you want to order any more." (S 405).
- UPS-replacing-Amazon joke. "Maybe there's kind of a funny nod, like UPS replacing Amazon" (S 408).
- Pink note needs a paw print. "pink note needs squatch print remember?" (S 580).
- Reason Mops dismisses Mars, made obvious. "there's a reason why he thinks it's a waste of time to go to Mars." (S 1058).
- Order signed in triplicate. "I like Paul signs the order, but it's in triplicate" (S 380).
- Moon Pies delivered for a reason. "Actually make sure the moonpies get delivered and maybe there's a reason why ?" (K 156).

### Party
- Hall: speaker and FUR alarm placement, window wrap, fur-alarm zoom. "let's have the viewing portal wrap from the far left wall all the way up behind the wall where the fur alarm and the speaker are" (S 457); "let's just make sure at some point we do a zoom in on the fur alarm." (S 466). Check against the locked hall picture.
- More people. The bartender (draft PR #85) and the Croc Boys are in; more guests wait until Brian sees this cast. "don't we need more people around than just one, two, three, four Five, six" (S 954).
- Random conversations to join. "there should be random conversations he could join and be part of" (S 361).
- "Got any pancakes" at the stand, "Mom's Pancakes", spilled coffee. "It's Just Mom's Pancakes" (P L154); "One Of Them Should Say Got Any Pancakes" (P L147).
- Guests' eyes pop after the spill. "why are there eyeballs if they can't see us?" (S 65).
- An alarm on the wall of every room. "There Should Be An Alarm In Every Room Too" (P L107).
- Trip on the bucket; janitor turns around. "Should he Trip on the Bucket Sure Yeah" (P L41).
- A photo drawing kept as a memory. A bonus for the party photo exists; the keepsake drawing does not. "you get bonus points if you stop and take it with you as a memory." (S 853).
- Manager's office look. "Think about hallway and entrance to managers office and how it should look inside (door type and placement), then think about how an office would actually look and what fun quirks can be added" (S 1120).

### Playthrough 2026-11-23 (party, for the party rebuild)
Brian played the live game on his iPhone on 2026-11-23. His party comments, in his words, in the order he said them. These are for the party rebuild, not for the morning fixes. Two of them are built in the morning-fixes PR and left off this list: the faces at the top right ("that's supposed to tell me who I'm playing") show only where a switch is possible (19a), and "The yellow flashing light on the bottom right doesn't make sense" (the bobbing arrow on story waits) is gone; NEXT is the only cue (18a).
- The banner and the camera: "The 'coming soon' is not on the actual sign. The camera's pointing in the wrong direction."
- Guest sizes (unclear on the recording; best reading, the guests are different sizes in a way that looks wrong): "The creatures are kind of various sizes, the way that doesn't make sense."
- One sign: "It's not clear that's an actual sign. I think we could just have 'Robotics Delegation, coming soon' on the same sign, if we want."
- Sideways: "Notice how when I've got it landscape, that label is behind Chapter One. But this is fine."
- Placement, at the host on the stage: "And then what's this random thing here? And then that's like a truncated, oddly shaped thing. Got to think about placement of everyone."
- "Why are there no eyeballs on this?"
- The host's welcome speech: "Just think about the order of this too. And then, again, coming from the exact wrong place. Now the eyeballs. And then just magically back in there. I shouldn't have to talk you through this. They should make sense. This is just random now."
- The disguise screen: "Come on. You should be able to audit all these things, like what is this?"
- Brian in Snack Quest Chat, 2026-11-23: "line of sights are cut off": the drawn sight cones are cut short.

### Party video notes and answers, 2026-11-24 (not built yet)
Brian watched the party video and answered every question the same evening (his clicks and words; the builder's copy is the private ANSWERS file of 2026-11-24). Built already and left off this list: the dance drawn once, the small camera flash, no walk ring on an outlined place, the hallway bounce and its line, the guard's flashlight beam and searching look, no yellow cones in a whole disguise. Still to build, in his words:
- Day 2 and the snack bar (for the Day 2 build, not the party PR): "Next day, if he stole all the snacks, then they can go to the bar and [someone] could say that's strange. I've never seen the snack bar empty before, but if he didn't steal all the snacks then there's a chance to get one the next day". Who says the line is still to ask. The party saves it: `window.SSQ.beat("ch1-party").snackRecord()` gives { all, left, bag, toppled }.

### Snacks and dress-up
- A hint on/off option and a Settings button. "Maybe we have like a Hints on Hints off Option" (P L21); "Maybe We just have like a Settings button Or something" (P L23).
- Explain each part of the screen at the start. "ways to kind of interact with each part of the screen right out of the gate" (S 30).
- Ball-hide in every room. "I like the idea he can do it to hide when he wants" (S 705).

### Day 2 and night
- Photo gallery with five photos a visit, a crooked picture, movie-still gags. "each visit should by default just be like five photos maybe?" (S 853); "Darth Vader's pretty much near perfect, really no notes there" (S 985).
- Gallery with arrows and an X always there. "arrows to sweep left or right, and then an X that's there at all times" (S 883).
- Janitor gets sucked out when robots land. "Is there a way where, like, the janitor can get sucked out when the robots land or something?" (S 223).
- Squatch sneaks to the grate, music distracts robots. "we should have squatch sneak over to grate after distracting robots with music" (S 596).
- Manager shakes the robots' hands. "The Guy Who Ordered Them Should Shake The Hands Of Dot Bob And Lou As They Leave" (P L103).
- Foreshadow rolling into a ball. "Foreshadowing The Fact That You Can Roll Up Into A Ball" (P L182).
- Ship cutscene, security cameras. "We got a call from The From Stormtop Uh Security cameras" (P L222).
- Squatch shows the brochure. "Squatch Should Show Him The Brochure" (P L165).
- Hurtful line, then "I didn't mean that". "He Should Say Something More Like Um I Wish You Would Have Left Me In That Crate Or Something" (P L176).
- Loading-bay banishment shown, and the office rule issued. "It Should Actually Show Them Getting On The Ship At The Loading Bay" (P L50); "Then Show Him In Like The Office Issuing A New Rule On The Computer" (P L53).
- Lobby crowd obvious. "I kind of think it should be obvious that they're coming in, it needs to be a change" (S 33).

### Escape and later chapters
- Zip's riddle changes every game. "Riddle should change every game though" (S 274).
- Dirty dish put away, Gloop upset. "maybe for 5 you can out the dish away dirty and gloop gets upset" (S 266).
- Cut or fix a confusing line in Chapter 2. "Troopers are the greater danger I don't know what that means" (P L220).

### Looks and lines
- Squatch also says hi. "I do like the idea of Squatch also saying hi, that would be fine." (S 20).
- Squatch refers to the TV. "I saw on TV about when the Wookiees got kicked out." (S 96). Old unused scenes hold the words.

### Sound
- Snoring in the crate flashback. "By the Way We Should Have Snoring Noises Here" (P L119).
- Music during the dance. "it's not making any noise music when it's happening" (K 341).
- More music and laughing. "We need way more music And sounds throughout" (P L24). The morning and home alone have their sounds (branch feat/morning-sound, Brian 34A); the party, Day 2 and the night do not yet, and there is no laughing.
- Robot janitor always bleeping. "the robot janitor should always be making cool robot noises I think." (S 195).
- Short stings on heart moments (the warm theme, sneak and travel tunes already play). "the music I uploaded is really the, the warm theme for the heart moments." (S 359).
- Hendersons theme or podcast clips. "there was a Sasquatch theme from Harry and the Henderson." (S 347).

### Words and rules
- Lines go in a lines file first, with a test. "Any new on-screen words go in a lines file for me first." (S 232).
- No tuning change without a yes beyond the 36 pinned numbers. "No difficulty, timer, price or range changes without my yes." (S 232).

### How the bots work
- Early versions set the look, later versions give ideas. "Some of our concepts improved as we went later on. It's just that I think the execution got really messy" (G 586).
- One list of the plan, checked against the game. "Just remember to check that you're not drifting off the plan we have in GitHub, the decided beats research." (G 579).
- Questions one at a time with context. "Give them to me one at a time with context" (S 1366).
- Watch my recordings first. "See if you can view some older cideos to get a sense of gameplay" (G 526).
- Check what a person would expect. "what would a human expect to see here? Is there something confusing?" (G 262).
- Use the robots to find issues. "let's maximize the robots as much as possible to find out all the issues" (G 338).
- Rules must be followed, not just written. "I think all of them should be the actual rules as opposed to violating really" (G 297).
- Change as little as possible. "think about how to do so with reusing current scenes and minimizing code rebuilds." (S 380).
- Show a cartoon, not a script. "If you build it as a cartoon then I would!" (S 555).
- Audit each mini-game alone. "Really think having sn agent just sudit each mini game or interaction like the bar or dancing or balloon on their own in isolation" (S 1091).
- A separate reviewer agent, proven. "I think you might need like a new agent to look at this maybe." (S 729).

### Ideas kept from closed pull requests (Brian's "10a", 2026-11-23)

Each of these is checked against main first; guests and cones were rebuilt in #75.

- From closed PR #35 (Mops's heart cone, decisions R98 and R104). Check against main first; guests and cones were rebuilt in #75. Mops gets a warm cone and pops hearts when Squatch is in it, while everyone else shows "!". Bigger and brighter (R104). Hearts act just like the "!" marks. Brian: "eyesight lights up way sooner than it should." Rebuild it on the cones in `src/modules/party-watch.js`.
- From closed PR #60 (playtest 15 fixes). Check against main first; guests and cones were rebuilt in #75. The pink and yellow slips stay in the hangar bin so they do not cover Squatch after BEEP BEEP. Party guests step and lean with their arms on their bodies (the robot dance in pairs is in draft PR #85; milling waits for half two). The guard in blue, the teal guest off the vent and the who-and-where lockup card are in draft PR #85.
- From closed PR #33 (party notes). No "Oops. Fur in the vent." line in the bedroom. The plant outline, the low eyes, the readable banner and the Croc Boys' line from the stage are in draft PR #85. Its music swap is not wanted (Brian's newer asks are the Floating in Space recording and Joe's theme).

## 5. Merged, in a pull request, and being built

Merged today on main: one sound button, off by default (PR #77); squatch.onrender.com shows the game (PR #76); walls and furniture, step restart, outlines, lunch alarm, goal words after 20 s, plant eyes (PRs #68 to #73).
Merged 2026-11-23: cones on everyone and the six approved guests (#75), controls always shown (#79), the hall v2 and home v6 pictures (this change).

Merged 2026-11-23: home alone after Mops leaves (#84, morning plan PR 3): the homework goal and cutaway, OPEN · closet with the G box, FLOP · bed, the calendar already bitten (13A to 16A).

Not merged yet:
- The party night (draft PR #87, branch feat/party-half-two): Brian's showing-5 decisions of 2026-11-25 are built, with the Wookiee TV story back (his Wookiee recording plays on it); showing 6 waits for his eyes.
- The quiet room's mopping (the same branch, draft PR #88), Brian after its video, 2026-11-24: "It's hard to tell the difference between the whistle and the squeaking. Can we make the snore and whistle a bit more prominent? ... see the janitor walking around, mopping the floor with his beard ... the water on the floor kind of following ... And then walking back to the bucket to squeeze it out." Built: Mops's loop before the first tap, a louder snore, swish-only strokes while Squatch sleeps (`src/modules/mop-loop.js`). Waiting for his ears and eyes.
- The morning's sound (branch feat/morning-sound, draft), Brian's answers of 2026-11-24: 34A (every MY PICK on the sound board, in the morning and home alone), 31a (the beard squirts when tapped; "Hey, stop that!"), 30a (a cutaway with no words and nothing to tap plays by itself), the music and effects levels and Brian's recording turned up 10 dB. The morning fixes (18a to 21a) merged on 2026-11-24 as PR #86.
- The tap-path change.
- Mops's heart cone in Chapter 1 (PR #35, open since Nov 13) and the rules check on pull requests (PR #34).


Settled 2026-11-23 in Snack Quest Chat: unattended work stops at 75% of weekly credit ("let's keep it to 75% for now").

## 6. Corrections to the checkers

- Bartender: a figure is drawn behind the bar (12-ch1-redesign.js:1342); the row is "more people", partly built.
- Banner: both checkers were right; moved to section 2 as a placement question, newest words win.
- "Mops carries no mop": already true in Chapter 1; narrowed to later chapters.
- Removed as wrong or moot: "Fart sounds" (a child asks, the adult says no, which matches decision A5); "Text runs over on the Sir Mopsalot award" (no award text exists); "Adopt the studio template fully" and "Bring over old games drawings" (said while starting v2); "The start of the game" (G 114, replaced by the specific morning rows).
- Status fixes: Wookiee TV panel is a question, not missing; warm theme and sneak and travel tunes exist, only stings missing; alarm runs and a photo bonus exist at the party, so those rows are partly built.
- Moved: the "red line" row (bedroom vent, maybe moot); the three hall rows (to Party); the prop-outline row (to the outline row); "Real transitions" reworded to show how he got hidden; karaoke is no longer "floating in space".
- The banner "move or remove" pair and the sing-button row were reworded; the playtest line numbers point at the first of two lines.
- Statuses re-run with grep and found right: no riddle, vania, laugh, growl, thought bubble, settings, tether, "Mom's" or "suspicious" in src.
