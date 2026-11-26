<!-- section-index -->
**Section index.** Read this index, then only the section you need. Do not read this file whole.

| Lines | Heading |
| --- | --- |
| 33–35 | # Space Snack Quest: every decision, in one place |
| 36–43 | ## How to use this file |
| 44–55 | ## Bedtime story, 2026-11-26 (Brian, video notes and Snack Quest Chat) |
| 56–60 | ## Party, 2026-11-24 night (Brian, Snack Quest Chat) |
| 61–69 | ## Brian's answers by multiple choice, 2026-11-23 (Snack Quest Chat) |
| 70–73 | ## Sound, 2026-11-23 |
| 74–97 | ## Brian's confirmations by multiple choice, 2026-11-22 |
| 98–109 | ## Story and points, settled 2026-11-22 (Brian: "All good") |
| 110–134 | ## Claude's design calls, 2026-11-22 (Brian can veto any) |
| 135–143 | ## Which repo is the base, 2026-11-22 |
| 144–154 | ## Sight cones, 2026-11-22 |
| 155–159 | ## Latest calendar direction, 2026-11-16 |
| 160–162 | ## Vent walk, 2026-11-16 |
| 163–165 | ## Locked home room v5, 2026-11-16 |
| 166–175 | ## Fidelity system (pictures are locked, not just words) |
| 176–213 | ## 1. Working rules |
| 214–280 | ## 2. Story and plot (Chapter 1 unless noted) |
| 281–305 | ## 3. Characters and look |
| 306–382 | ## 4. Look, rooms and layout |
| 383–404 | ## 5. Chapter 1 cartoon, panel by panel (story order) |
| 405–448 | ## 6. Later chapters (2–4 and travel) |
| 449–458 | ## 7. Audio |
| 459–493 | ## 8. Code, controls and process |
| 494–540 | ## 9. Open / waiting on Brian |
| 541–635 | ## 10. Earlier entries, kept word for word |
| 636–732 | ## 11. Decisions recorded on main on 2026-11-09 |
<!-- /section-index -->
# Space Snack Quest: every decision, in one place
For Brian and every assistant • Last full rebuild: Sunday, November 8, 2026, about 8:50 PM PT • Repo copy: Monday, November 9, 2026, synced through R63. Nothing deleted.

## How to use this file
- **This is the single source of truth for decisions.** If chat, memory or another doc disagrees with this file, this file wins. Fix the other doc, or bring the question to Brian.
- **Every assistant and thread working on Space Snack Quest writes a new decision here the moment it's made**: one line, dated, with its source and status. Don't leave it only in chat or memory.
- When something changes, the newest version is **Decided** and the older line becomes **Superseded**, with what replaced it. Nothing gets deleted, so you can see the history.
- **Status words:** **Decided** (Brian said it or approved it) · **Needs Brian's yes** (proposed, or on-screen words waiting on him) · **Superseded** (replaced; the line says by what) · **Open** (a real question nobody has answered yet).
- **This repo file is the single source of truth.** It was synced on Monday, November 9, 2026 from the designer record through decision R63, and it still holds the earlier snapshot `docs/old/project/DECISIONS-2026-11-08.md` (on `main` at commit 10030f6). Every earlier entry is kept in section 10. Where a later decision replaces an earlier one, the earlier line is marked **Superseded** and says what replaced it. The dated snapshot's full text is in `docs/old/history/DECISIONS-2026-11-08.md`. A short pointer stays at `docs/old/project/DECISIONS-2026-11-08.md`. New decisions get a row in the tables above, through a docs PR (review, "Docs match main: yes", Brian's written yes before merge).
- Don't invent a decision. If something isn't clear, add it under **Open**.

## Bedtime story, 2026-11-26 (Brian, video notes and Snack Quest Chat)
- **Mops tells Squatch about the Guardians at bedtime.** After "You came to me in a Moon Pie crate. You've loved Moon Pies ever since.", Mops says "And you've always had your Guardians, watching over you." over a full-screen picture of Squatch's crayon drawing of the Guardians (big furry Sasquatches; the same drawing shows in the morning's thought bubble and in the Guardian Box). Mops gives no hint that he writes the notes. Words approved: Brian, chat 18b A. **Decided.** This adds to STORY-DECISIONS section 5: the bedtime story is still about Mops finding him plus this one line, and the player still learns who writes the notes only at the vent (beat 48).
- **Goats say "Weeee-eenn-nnttt".** Brian, video note 0:28: "Goats say "weeeent" not baaaah". Mops's "...Baaa?" in the bedtime story picture becomes "...Weeee-eenn-nnttt?" (the spelling of R96). **Decided.**
- **Squatch asks for the story in words.** Brian, video note 0:12: "is squash asking for a story? Maybe he should just say, tell me about when we first met or something like that?" Built as "Tell me about when we first met?" in one bubble over him in bed. **Decided**: approved word for word (Brian's chat answers, 2026-11-26).
- **The old crate story's words stay, and its fourth picture is on.** Brian's chat answers, 2026-11-26: keep the old crate story words; turn on the fourth picture (Mops hides the baby in the mop bucket, "Nothing to see here!"). Bedtime drawings fine as placeholders. Mops's "...Weeee-eenn-nnttt?" gets the real goat bleat through the `mops-bleat` sound pick once its file is in. **Decided.**
- **Falling asleep plays out, with snoring.** Brian: "After story when squatch falls asleep, should be a bit more natural transition and then some snoring". Built wordless: a yawn and stretch, he lies down, Mops tucks him in, Mops goes out by the door and the light goes down, three snores, fade to black, the morning fades in. **Decided** (the ask); the drawings are placeholders.
- **The Guardian Box in the morning.** Brian, video note 0:21: "Box shouldn't look so small versus the rocket. Also, I thought the view we had in much earlier versions was better - when we also had the note and you could see the my guardians drawing etc". Built on `feat/ch1-day2-morning`: on Day 2 the box is the approved look at 2.4 times its size; the close-up brings back the first build's box view (commit 18c9157: the older notes, the crayon drawing) with the lid labelled MY GARDIAN BOX and the drawing titled MY GUARDIANS. **Needs Brian's yes** (the look and sizes).
- **Who he thinks the Guardians are.** Brian, video note 0:30, asked whether it is a story hole. Built: as he holds up the gift, a thought bubble shows his crayon drawing of the Guardians (big furry Sasquatches), before his line; and Mops's Guardians line at bedtime (above). **Decided** (Brian's chat answers that day).
- **Mops is a "Ganitor".** Brian, in chat: "Ganitor is what mops is - goat janitor - that should be an ongoing reference in the game." **Decided** (the fact). Where it shows, Brian's pick the same day ("I like all of them a b c d e"): a GANITOR name tag on Mops's shirt in every scene; the Station PA, "Ganitor Mops to the party hall." (words approved); the hallway Employee of the Month photo labeled "MOPS, GANITOR"; the robot janitor notice plays on it (wording needs his yes); "MOPS THE GANITOR" on Squatch's crayon drawings where Mops is in them. **Decided**, not built yet (a later round; `docs/BRIAN-ASKS-OPEN.md` item 14).
- **The home morning, Brian's answers.** 2026-11-26, chat: the calendar is optional (the lunch bag is the goal; LOOK · calendar stays); PICK UP · rocket and PUT IN · box approved; after the gift goes in, the Guardian Box goes back in the closet; Mops leaving is heard in the dark, as built; the note on the rocket shows its words, "Brave Sasquatches stay hidden. — The Guardians" (no "Rule #1"); the lunch bag has MOPS on it; keep the 20-second goal-words rule; drawings fine as placeholders. **Decided.**
- **The vocal song stays at bedtime.** Brian, video note 0:25: "This is the one place in ch 1 that I think this song with vocals actually works - we can leave it here". **Decided.**

## Party, 2026-11-24 night (Brian, Snack Quest Chat)
- **The flyer sneak replaces the party plan's decision 9** ("Isfred's flyers, and one sticks to Squatch's fur"). Brian: "I don't get him throwing the sheets, what if he just leaves one on the side of the stage when he leaves and we have to sneak to get it and get back to the room, avoiding lines of sight?" His click on how the kid learns he wants it: "He wants to show Mops". Isfred sets one flyer down on the stage's right end as he walks off; P4 is: sneak to it with no disguise, GRAB · flyer, sneak home. Words with his yes: "A robot flyer! I'll show Mops.", "Squatch: grab the flyer", "GRAB · flyer", then the existing "Squatch: sneak home for a disguise".
- **Home with the flyer.** Brian: "When he gets back to room it should mention the party and wanting to dance". His click: "I deserve one night of normal." then "Costume on. Then I dance!", after the flyer is down and before the closet is outlined.
- **From "You have me." to the TV.** Brian: "Shouldn't mops say something and then turn it on?" Final, his click "Shorter second Mops line": Squatch "But why do I have to hide from everyone but you?" / "And why can't the Guardians and I be together?" / Mops "I've been waiting to show you this." / "Here's why you have to hide." Then Mops presses the TV's button with his horn. Mops does not answer the Guardians question (docs/STORY-DECISIONS.md section 5). The TV story is new to Squatch (his click "New to him, Mops saved it").

## Brian's answers by multiple choice, 2026-11-23 (Snack Quest Chat)
- **Party hall picture: "C (Recommended)".** The corner doorway, the bar at full length moved down below it (his note that morning: "A is more correct but you can keep the bar long and just move it south on the screen"). Locked as `hall-room-empty-v2.png`.
- **Home room speaker: "Yes, lock it (Recommended)".** The retro wooden speaker (Squatchbot #448) at spot A near the door (Squatchbot #1385). Locked as `home-room-empty-closed-v6.png` and `-open-v6.png`.
- **Merge: "Merge #68 to #73 (Recommended)".** Merged in order on 2026-11-23, his words copied into each PR.
- **Cone numbers: "Keep for now (Recommended)".** "?" turns into "!" after 0.8 s in sight; a cone shows within 120 of Squatch, fully within 40. Placeholders until he plays it.
- **Dress-up pieces, his words: "let's try to have them snap but be okay with absurdist results, for instance, pants on the head. Is that possible?"** Yes: a piece snaps to the body spot (head, face, body, legs) nearest where it is dropped, whatever the piece is. This replaces both "snap to its own spot" (walkthrough) and "stays where dropped" (Nov 22 call 1).
- **A catch at the party: "Card, restart scene (Recommended)".** K29: the lockup card, then the current scene restarts; the party is split into its five scenes. The Nov 14 "set back a little" is superseded.
- **Karaoke: "Last, if time allows".** Not "stays out": karaoke is built last, after the rest of the party plays well. Note for then: rule 7 limits Squatch's singing to lure spots and bond moments, so the karaoke needs his word on how it fits.
- **Raising the alarm at the party: "Runs to wall alarm (Recommended)".** The guest who sees fur runs to the red wall alarm and pulls it, as at the Day 2 lunch.
## Sound, 2026-11-23
- **Brian:** "We need to fix the sound. Let's just have one button to turn on music and sound effects? you can look at what the plan was we arrived at for Ostriches." The Ostriches plan (G Bot #502 to #509, Brian's yes to default off): sound is off until the player taps one speaker button; a slash shows while off; the tap starts sound inside it; the choice is saved per device; the in-game switch is the same button; after a lock, the next tap brings sound back only if it was left on. No new words: the button's labels are the existing "Sound on" and "Sound off".
- **Claude's call (Brian can veto):** the ♪ sing-along button shows only while Squatch can sing, so it is not taken for a second sound button.

## Brian's confirmations by multiple choice, 2026-11-22
Brian does not read the long files; he confirms assumptions by multiple choice in Snack Quest Chat. Each line is his pick, word for word as the option read.
- **Morning order: "Your latest order".** The speaker announcement wakes Squatch while Mops keeps mopping, then a beard-wringing cutaway, then the song is announced, Squatch gets up, Mops says something like "Floating in space, it's our favorite song", they sing, then Mops leaves for work and mentions the party (G Bot #561). v1's current opening lines get replaced. New or changed lines still need his yes word for word.
- **Controls: "Stick + tap + button".** Joystick, tap the floor to walk, one fixed-size action button, as v1.
- **Plant eyes: "The very original".** Find the earliest approved eyes in v1's history, copy them exactly, show Brian a picture before building.
- **Optional things: "They discover them".** Only what the player must do gets a yellow outline; optional things (closet, bed, calendar) have none, and tapping them still works.
- **Balloon and dance: "Keep, simplified".** Rebuild both in the simplest form found and show Brian before it lands. (His own words, G Bot #516: "The balloon thing has just never worked when we've tried it before." If no simple version works, say so and ask before dropping.)
- **Points for a kid who plays for perfect, 2026-11-22.** Brian picked "B": each part of Chapter 1 gets its own "clean" (never caught) check; perfect means every part clean; any single part can be replayed from the chapter screen to make it clean. Parts are the walkthrough's sections: Day 1, the party (beats 1 to 21); Day 2, lunch and the first delivery (22 to 42); one week later, the escape (43 to 52); pickup day (53 to 61). Claude's recommendations that go with it: (1) the end card shows secrets found as "7 of 9" with missing ones as "???", a clean check per part, and a gold "PERFECT CHAPTER!" when all is done; (2) the chapter screen keeps his best stars and a perfect badge on that device; (3) the never-caught party ends at closing time, so the perfect run has its own ending; (4) a few stars per swiped snack, with the topple as the risk. Existing rules stay (Nov 8): +50 a secret, +25 a funny find, "Never caught! +250", a catch never takes stars, photo corner 25. Exact on-screen words need Brian's yes.
- **Snack bar, Brian 2026-11-22:** "the idea was that it was almost a mini game where he could sneak up and swipe food, and the pyramid only happens if he steals too much (it foreshadows the “only take so many snacks” in the next day)." So: the paw close-up swipe is the mini-game; the bartender glances and catches ("...Nice gloves", then "Wait a second... fur!" and the alarm, words pending); the pyramid topples only after too many snacks (a tuning pin, start near five), the crowd turns, and he has a few seconds to hide or be caught. It sets up Mops's one-snack rule on Day 2 (beat 27).
- **Party ending, Brian 2026-11-22: "(A)", two endings that meet at home.** Caught (alarm, run home, guard search, Mops finds the flyer and fur) or never caught (closing time: the speaker announces it, guests leave, Mops finds him while cleaning and walks him home). Both then "Everyone out there has someone." / "You have me." The Guardians' note line (beat 22) may need a wording change for the never-caught path; Brian's call when built. Brian added: "think about points because [his kid] loves to play the chapter perfectly".
- **Locked pictures: Brian "Good with two and three" (2026-11-22).** New locked versions of the home room (with his approved speaker, option 4) and the party hall (without the painted yellow outline around the snack bar), each shown to Brian as a picture before it is locked. The new party hall also makes his repeated bar request, asked at least four times: "the bar being too long and blocking the other door" (Grok Bot #328); "I think you can bring the bar even closer in, though, to the wall. Doesn't need so much space between it and the wall." (Squatchbot #494); "the hallway entrance needs to move, move closer to the wall, and the bar needs to move, move further away to the other wall." (G Bot #603); and the bar overlapping the hallway entrance (G Bot #474, voice chat). Added 2026-11-22 after the check of his words found it in no doc.
- **Goat suit (same message):** a short cutscene of Mops trimming his beard, then the dress-up close-up with three pieces (beard, horns, the spare jacket), the meter, and "More bleat. Less roar."
- **Test order, Claude's call (Brian: "I don't know which - your call", 2026-11-22).** The four repeat complaints that cut across every scene get tests first (walls and furniture, security timing, outlines not circles, dead ends and ↺). Then each beat is rebuilt in one sitting together with its own repeat-complaint tests, rather than writing every test before any rebuild. Reason: a playable rebuilt Day 1 much sooner, without leaving the everywhere-problems unguarded.
- **Party mini-games, revised later the same day.** Brian: "I don't think the dance game ever worked. I'm okay skipping photo corner and simplified baloon unless you are confident of making it work. Whole aim was to have a few more fun Easter eggs / mini games". Claude's call on confidence: keep the octopus juke (beat 12) and the photo corner (beat 13), each one simple rule the touch robot can test; the snack pyramid (beat 14) is needed as the party's ending; karaoke (beat 11) last, only if those play well. Out for now: the dance game (beat 10; Grok Bot #351 found it could not be played by touch: "Every tap scores 0; only keyboard arrow keys work.") and the balloon (beats 15 and 57; Brian, G Bot #516: "The balloon thing has just never worked"). Conga, chicken dance and bouquet toss are background only, with no player part. This replaces the "Keep, simplified" answer below for the balloon and dance.
- **Dress-up: "Drag-on close-up".** A close-up of Squatch on a white background; the kid drags pieces on, more or less anywhere; the "Disguised enough" meter fills as pieces go on.
- **Wookiee TV: "Full-screen story".** Cut away to full-screen story pictures, as walkthrough beat 20 says.
- **Hangar robot (problem 3): "No close catch".** While the night robot looks away it cannot catch Squatch, however close; only its cone counts.
- **Keypad: "We need the code for the office door, not the hangar"** (his own answer). v1 already puts the code (4723, from the pink slip) on the office door, walkthrough beat 50; no hangar code. No change needed.
- **Raising the alarm: "Ch 1 wall, later shout".** In Chapter 1 whoever sees Squatch runs to the FUR ALARM on the wall and pulls it, giving him time to hide; shouting for security is allowed in later chapters.
- **Goal words: "Outline; words if stuck".** The next place or thing gets a soft outline (his settled rule, Squatchbot #1343 to #1345: "You just light up that entrance"). No goal line at first; if the kid does nothing useful for about 20 seconds, a short goal line fades in. This replaces v1's always-on goal bar.
- **Outfit: "Yes, his outfit".** What the kid drags on in dress-up is what Squatch wears all party; snags and tugs pull off whatever is on him.
- **Hiding: Claude's call, Brian said "I can argue either way".** A HIDE button at the hiding spot (the "HIDE · plant" prompt), as most stealth games use an explicit hide action: the kid always knows when he is hidden, he never hides by accident while walking past, and it works the same with touch, stick and mouse.
- **Push and merge: "Push freely, merge on yes".** Claude pushes branches and opens pull requests as needed. Nothing merges into main (which goes live) until Brian says yes in Snack Quest Chat; his words are copied into the pull request.

## Story and points, settled 2026-11-22 (Brian: "All good")
From four fresh-angle checks of the design (story logic, his words missing from docs, docs that contradict, what the design needs). Claude recommended each; Brian answered "All good" to the whole list.
1. **Caught versus spotted.** Brian's own line (Nov 7): "it's the difference between being spotted versus being caught." A part stays clean if Squatch is spotted, the alarm goes and he hides; only being reached by a guard and jailed breaks it.
2. **Closing-time ending.** Guests leave in pairs and families; Squatch is the last one standing alone in the empty hall when Mops finds him. That is the cause for "Everyone out there has someone."
3. **Guardians' line (beat 22).** One line on every path: "The Guardians came!" (still needs his yes word for word when built). Drops "They always come when I'm scared".
4. **Mops during the party.** Elsewhere on the station, out of the hall until closing time; on the caught path the alarm is why he hurries home.
5. **Why Mops agrees to Mars (beat 45).** Being replaced leaves him nothing to stay for, and the pancake brochure is a fresh lead he trusts more than the old NO letter. His Guardian note ("we'll always be with you") is comfort for the trip.
6. **A free dance.** When Squatch steps into the dance circle he dances: no game, no points, no fail. It pays off "I've never gotten to dance at a party."
7. **Disguise is one state.** Disguised or not; a snag pulls off a piece, and he is exposed only when the meter drops below "Disguised enough". Replaces the earlier "three disguise levels" (R4).
8. **Points.** +100 for each clean part and +250 more for a perfect chapter (replaces the single "Never caught! +250"; new tuning pins).
Also settled in the same "All good": closing time comes after about 3 minutes of party, and the old "Cool hat!" timer goes; Mops assumes the bin was emptied, so the vent is Squatch's lead; on Day 2 a second snack gets a look from Mops; the packed crate rides as cargo with the Guardian Box and bucket, and the robots open it and find nothing; in the vent Mops's back is to Squatch, so the secret holds; karaoke stays out (rule 7: no singing in public); the hidden "goating in space" airlock joke stays as an Easter egg.

## Claude's design calls, 2026-11-22 (Brian can veto any)
From the Chapter 1 design check (`docs/ch1-design-audit-2026-11-22/`). Each is settled by Brian's own words or the repo's rules; Brian was told the list and can say "no to N".
1. Dress-up pieces stay where the kid drops them on Squatch (G Bot #603: "you should be able to put it more or less wherever"); dropped off him, they slide back.
2. The sneak's door guest is a guest, so "?" briefly, then "!" (Sight cones, 2026-11-22).
3. The peek stays as built: Squatch half hidden in his doorway (Squatchbot #1372: "he just peeks").
4. Chapter 1 alarm: the guest who spots him says "FUR!" and runs to the wall alarm; exact words wait for Brian's yes.
5. Losing the disguise shows its cause on screen: the hat tilts, then flies (rule 13).
6. The vent, plant and guard spots trigger by walking near them; the SNAG, SUCK and STAND buttons go (problem 9, walkthrough beat 16).
7. Every catch, at home too, shows the lockup card, then restarts the current scene (K29, Brian Nov 16: "Every catch: jail card, then restart the current scene; split long scenes like the party into shorter ones"). Corrected 2026-11-22: this call first cited the older Nov 14 rule.
8. Mops finds the flyer and fur without a new line, then "Everyone out there has someone." / "You have me."
9. The TV story is pictures only until Brian approves words.
10. The Moon Pie site is on the manager's office computer (R46); booked with "RETURN · empty crate".
11. On pickup day the kid plays the crate scenes (hide, then sneak home), as beats 54 and 55 say.
12. Every robot, the night ones included, gets the same dashed cone and the "!" rule.
13. Day 2 calendar (beat 23) is required: it gets the soft outline, and its close-up shows today circled.
14. Beat 40: Squatch holds up the brochure, no new words, before Mops's line.
15. Beat 32: Isfred is called away to a damaged crate in the mail room (v1 today); the line needs Brian's yes.
16. Beat 38: v1's two extra lines that the walkthrough does not have ("We ate at a pancake place on Mars." and "Here, a brochure.") are cut; the family leaves the brochure behind. The walkthrough's own two lines stay pending Brian's yes.
17. Beat 42: a robot that sees Squatch at night runs to the FUR alarm on the bay wall, same rule as the hall.
18. Plants and boxes block sight lines when Squatch hides behind them.
19. The "Disguised enough" meter: each piece on Squatch adds the same amount, so it fills wherever pieces go (fits call 1).
20. When a goal line fades in (stuck about 20 seconds), it shows in the top-center chip zone, names who acts ("Squatch: ..."), and fades out when the step is done.
21. The snack count and the bartender's catches are separate: she catches only if she glances while the paw is in, so a careful kid can reach the topple limit.
22. The game remembers the last part of Chapter 1 reached on that device; the chapter screen can start any part reached. This is needed for replaying a part, and stops a kid losing 25 minutes when the browser closes (v1 saves no progress inside a chapter today).

## Which repo is the base, 2026-11-22
- **Decided by Claude (Snack Quest Chat) at Brian's request.** Brian, 2026-11-22: "I really don't want to make the decision, I need you too to make sure you're fully considering everything, confirm you understand my goal, and then weighing all tradeoffs. [...] I'd have to defer to you." He can overturn it at any time.
- **The goal, as understood:** a Chapter 1 his 10-year-old understands and enjoys on a phone or iPad, built to his decisions, that stops breaking earlier wins and stops claiming work is done when it is not, with little of his time and no new spending. Clean and simple (G Bot #516), early-version feel with the later ideas (G Bot #583, #586).
- **Decision:** this repo (v1) is the base. Chapter 1 is rebuilt here beat by beat into new, small, clearly named files that follow `docs/WHAT-GOOD-LOOKS-LIKE.md`. Each new beat replaces the old code for that beat in the same change, and the old code is deleted then, so there is never a second live version of a beat. The test suite (54 suites, including the touch robot that plays the chapter) must pass after every change, and the game stays playable end to end at the end of every sitting. Proven shared pieces (walking, catching, the goal bar, input, the locked room pictures, approved lines) are kept and fixed where needed, not rewritten. Chapters 2 to 4 are left alone.
- **Refined the same day, after Brian asked about v2's architecture:** v1's 16 source files are one function cut into pieces (`tools/build.mjs`; pull request 61 counted 1,060 shared names, 548 used across files, `n` used by all 16), so new files added to that build would join the tangle. v2's template (Claude Code Game Studios 1.3.0) has the right target shape: real modules, values in data files, tests, a seeded replay after each change, one feature a sitting. Its 582-file toolkit (48 agents, mostly for other engines) is left out. **Brian, 2026-11-22, multiple choice "Yes, do it first":** the first job is the build change that lets new code live in real modules, with no change a player can see. It bends the "no refactor phase" rule once. Proof required: every existing test passes and before-and-after pictures match. Pull request 62 drafted this change; its claims are unverified and it is checked, not merged as is. After that, each rebuilt Chapter 1 beat goes in its own module with its values in data files, and the old code for that beat is deleted.
- **v2** (`catolandingham/space-snack-quest-v2`) is kept as a reference, not deleted. Its approved assets (the Floating in Space recording, the chosen speaker) and ideas that match Brian's spec (the morning with the speaker, homework, the bigger phone picture) are copied over one at a time, each with Brian's yes. Not its Squatch and Mops drawings: v1's stand (G Bot #419: "we completely changed Sasquatch and Mops characters, and we reverted to earlier alien drawings"). The party guests are the exception: #419 complained that v2 used earlier alien drawings, G Bot then put in the six guests Brian approved on Nov 8 (G Bot #445), and Brian picked those six for the party ("The six approved Nov 8 pictures", Squatchbot #1349). Corrected 2026-11-23: the 2026-11-22 version of this line read #419 as "use the live game's aliens".
- **Why not v2 as the base:** its only playable code is one prototype file marked "PROTOTYPE - NOT FOR PRODUCTION", its production code folder is empty, its two tests cannot run on the Mac mini, and by its own bot's account it did "the opposite on almost every point" Brian had decided (G Bot #572). Starting there means building the real game from nothing, without the checks that catch breakage.
- **Why not fix v1 in place as it stands:** the bloat Brian named is real (about 12,000 lines behind Chapter 1, two older generations of scenes still in the code, docs older than his G Bot decisions), and several beats need rebuilding anyway to match his newer spec. Rebuilding those beats clean, inside the repo that has the tests, gets the clean start without losing the safety net.

## Sight cones, 2026-11-22
- **Decided, Brian in Snack Quest Chat, 2026-11-22:** "Re cones, let's keep them on all players, but dashes until line of sight is intersected by S and then turns yellow - with the red exclamation if no disguise and hearts from mops (earlier version better than v2 build)." Read back to Brian as: every character who can see Squatch has a cone (guests, bartender, guards, robots, Mops); a faint dashed outline while Squatch is outside it; it fills yellow when Squatch enters its line of sight; a red "!" over the watcher if Squatch has no disguise; Mops shows floating hearts instead. Follow the earlier v1 look (pull request 35, R98, R104), not the v2 build.
- **Supersedes** the Nov 16 rule in `docs/CHAPTER-1-PROBLEMS.md` problem 11 (cones only on guards and robots, "?" over ordinary guests) and restores the Nov 14 dashed-cone direction. Also answers G Bot #603 ("only some of the aliens have the sight cones").
- **Decided, Brian 2026-11-22, multiple choice "Yellow, then suspicion":** with the disguise on, the cone still fills yellow when Squatch is inside it. If he stays in it a while, the watcher gets suspicious (a "?" or a line like "Nice gloves"); the second time is "fur!" and the fur alarm. This follows his earlier bartender idea (Squatchbot #1025: "maybe the first time he says nice gloves, the second time he goes, wait a second, fur"). Still to settle when built: how long "a while" is (a tuning pin) and the exact words of each line (his yes, word for word).
- **Replaced, Brian 2026-11-24, click "No yellow in disguise":** in a whole disguise a cone that holds him stays a dashed outline and the guest shows "?"; the cone fills yellow only once fur shows. This replaces "Yellow, then suspicion" above. The same evening he also chose "Lose it all" for tipping (nothing tips a piece crooked; a piece comes off only in the big moments: the snack pyramid's flying cup and the octopus's second hug), which removes the second look; that part is not built yet (docs/MASTER-BACKLOG.md).
- **Hallway doorway, Brian 2026-11-24:** no beard at the doorway ("the visual of the beard is probably not helpful"); he is bounced back "like any other video game where you try to go somewhere that you can't go yet", and thinks "I can't go there. Mops will see me." each time.
- **The guard at home, Brian 2026-11-24:** the guard who follows him home carries a flashlight and his search cone is drawn as its beam ("you get the beam even though he's not in [its] vision makes sense"). Sight is unchanged.
- **Refined, Brian 2026-11-22 (his words: "Maybe we meant it stats with a question mark and only turns into exclamation after he stays too long (if guests versus security)"; then picked "Yes, exactly that" on the read-back):** everyone has a dashed cone that turns yellow when Squatch is in it. Guests show "?" first and "!" only if he stays too long. Security (guards, robots) shows "!" right away. Mops shows hearts. The disguise slows guests down further ("Nice gloves", then "fur!" the second time). This keeps the "?" then "!" idea Brian picked on Nov 11 (Squatchbot #1146 to #1148) and adds cones on everyone. "Too long" is a tuning pin to set when built.
- **Built as a first try, 2026-11-23 (Brian, after seeing the stills: "let's try all of them and then we can adjust"):** party only, `tests/ch1-party-cones.mjs`. Everyone faces the stage except Isfred (faces the guests) and the bartender (faces the room). "Too long" is 0.8 seconds, a placeholder, not a tuning pin until Brian sets it. **Distance fade, Brian 2026-11-23 ("Add the distance fade", after asking "What if cones only came up when you were within a certain distance?"):** a cone shows only when Squatch is near the cone itself (fully within 40, gone beyond 120); both numbers are placeholders for Brian to tune. Not built yet: the disguised "Nice gloves" then "fur!" step, Mops's hearts (Mops is not at the party), cones in other rooms.
- **Check before building (Claude, 2026-11-22, after Brian asked not to agree quickly):** Brian's own Nov 11 worry was that cones on every guest "would be too much" (Squatchbot #1145). So the first step is one still of the party hall with every cone drawn dashed, at phone and iPad size, for Brian to look at once. If it reads cleanly, build it. If not, fall back to his Nov 11 pick: cones only on guards and robots, "?" then "!" over guests.

## Latest calendar direction, 2026-11-16
- **Decided, later correction in Brian's chat:** "Just call it fuzzuary under moonmunch" and remove Homework and Sing with Mops; replace with "wash outside windows (remember space suit!)". Follow-up: "And you can make bite a bit larger". FUZZUARY alone now sits beneath MOONMUNCH. Removing the calendar reminder does not cancel the desk-homework story transition.
- **Decided, Brian's chat:** "Change the paper bite so it is smaller and less obvious, and add some fake month names, and a brand sponsor for the calendar, and add 'family Olympics night' and a few other items that fit the story to random days". This authorizes the calendar revision, not a merge, a new story beat, or changes to the locked room files.
- **Superseded in part, initial draft in PR 58:** the three-month strip and Homework/Sing with Mops entries are replaced by the later correction above. Sponsored by MOON PIES, Sock hunt, family Olympics night and Blanket fort night remain in the review build. Entries use fixed scattered dates, not a new randomization mechanic. The circled pie remains in the fourth column of the third row; its delivery-story function is unchanged.

## Vent walk, 2026-11-16
- **Decided.** A walking Mops does not shove Squatch. Once the morning hum stops, that walking flag clears. Otherwise a later step, such as ROLL · ball at the hangar vent, can finish inside him. Not a change to a pinned number, and not a change to a locked picture.

## Locked home room v5, 2026-11-16
- **Decided.** Brian, Nov 16, 12:50 PM PT: yes to redrawing the locked home room and painting the Guardian box out of the floor. `docs/locked-rooms/home-room-empty-closed-v5.png` and `docs/locked-rooms/home-room-empty-open-v5.png` are the locked version. v4 is kept and superseded. The box stays in the closet until Day 2.

## Fidelity system (pictures are locked, not just words)
- **Approved pictures are frozen in `/workspace/ssq/LOCKED/`** (read-only, sha256-checked). The list is `LOCKED/INDEX.md`: every entry has an ID, version, date, source script, the decision IDs it shows, and a status (**APPROVED** = Brian explicitly OK'd that picture; **CURRENT** = latest version, not yet explicitly approved).
- **Rooms are drawn by one shared script each** (`mockups/rooms/home_room.py`, `mockups/rooms/delivery_room.py`, `mockups/rooms/hall_room.py` — the hall extracted pixel-for-pixel from the locked hall-01m on Nov 8, 11:20 PM PT). Panels import the room and add only characters and props. The connecting hallway is `mockups/rooms/hallway_room.py` (R48, approved as hallway v5 in R55). The office is `mockups/rooms/office_room.py` (R46).
- **Before Brian sees a sketch:** `tools/check_all.sh` (room layer vs the locked room) and the independent checker (`docs/CHECKER.md`) must both pass. Steps: `docs/FIDELITY.md`.
- **A locked design changes only when Brian explicitly asks**, and the change gets a new version; the old version is kept. When Brian approves a picture, it's locked as APPROVED (next version) and a line goes in this file.

**Source shorthand:** *Brian tNNN* = Brian's own words in tonight's chat (turn number). *Brian 3:36 PM* etc. = Brian's words recorded with a time in `replot/PARKED-DETAILS.md` (Nov 8, PT). *repo* = `docs/old/project/DECISIONS-2026-11-08.md` / `STATE-2026-11-08.md` on main 10030f6. *answered* = Brian's 25 answers in `reconcile-sources/answered-decisions.md` (PR #12/#16 rows). *memory* = Squatchbot's saved notes. *card* = an in-chat decision card. *sketch* = a file in `/workspace/ssq/mockups/`. Times are Pacific (PT).

---

## 1. Working rules
| # | Date | Decision | Source | Status |
|---|---|---|---|---|
| W1 | 11-06 | `main` is the truth. Source is `src/game/*.js`; `npm run build` writes `index.html`, and nobody edits `index.html` by hand. | repo D1; handover; memory | Decided |
| W2 | 11-08 | `npm test` must pass before any commit. | handover; memory | Decided |
| W3 | 11-08 | Nothing merges to `main` without Brian's yes written in the pull request, because Render publishes `main` to players. | handover; memory | Decided |
| W4 | 11-08 | Any new on-screen words go in a lines file for Brian first. | handover; memory | Decided |
| W5 | 11-08 | No difficulty, timer, price or range changes without Brian's yes. | handover; memory | Decided |
| W6 | 11-08 | Every diff gets an independent review. PRs update README and MASTER-BACKLOG and say "Docs match main: yes". Check `git ls-remote` before claiming a push. | handover | Decided |
| W7 | 11-06 | No browser-driven playtests by assistants. Tests catch regressions, and Brian's recordings show how it plays (to save compute). | repo | Decided |
| W8 | 11-06 | Don't re-read old chat threads. The Grok threads were archived once into `docs/grok-archive/`. | repo; handover | Decided |
| W9 | 11-08 | All repo work goes through a cloud agent, read-only unless Brian approved that phase. Never push from the drifted checkout `/workspace/deploy/space-snack-quest`. | handover; OPEN-ASKS E14 | Decided |
| W10 | 11-08 | Update STATE and DECISIONS before stopping. | handover | Decided |
| W11 | 11-08 | **Every decision gets written to this one decisions file**, not just kept in an assistant's memory, and the other final docs stay in step with it. | Brian t222 | Decided |
| W12 | 11-08 | Give Brian decisions as multiple choice, with context and reasoning. | memory | Decided |
| W13 | 11-08 | Use simple sketches: one picture per moment, no arrows. | memory | Decided |
| W14 | 11-08 | Brian reviews Chapter 1 as a picture-by-picture cartoon with every line in speech bubbles, not as a written script. | memory | Decided |
| W15 | 11-08 | Never drop details Brian already gave. | handover rules | Decided |
| W16 | 11-08 | Keep building without pausing. Send each sketch, start the next item right away, and fold in his feedback as it arrives. | Brian t205; memory (also asked Nov 3) | Decided |
| W17 | 11-08 | Don't invent new rooms for sketches. Put scenes in rooms that already exist so he can give feedback. | Brian t216; memory | Decided |
| W18 | 11-08 | Reuse existing scenes, props and code, and keep the look consistent. | memory; Brian 3:53 PM | Decided |
| W19 | 11-08 | Mockups use real game frames or the game's own simple style and the original robots, never cartoony AI-generated people. | Brian 3:11 PM; memory | Decided |
| W20 | 11-08 | Every room change shows a visible walk-off and walk-in. No teleports. | Brian 3:53 PM | Decided |
| W21 | 11-08 | Never invent why Squatch's parents never came back. | memory; OPEN-ASKS D13 | Decided |
| W22 | 11-08 | The story should read like a kids' book: stakes before problems, characters introduced before they matter, setups that pay off, simple words. | memory | Decided |
| W23 | 11-03 | Every alert or event has a clear story cause, and nothing happens arbitrarily. Nothing pops up without a player trigger; only clear cutscenes play on their own. | memory (Nov 3) | Decided. On 2026-11-13 Brian said a story wait (`uV`) waits for a tap in all four chapters, with a bouncing arrow and no words. A wordless walk or picture change still plays on its own. |
| W24 | 11-04 | Players discover gameplay through in-world nudges, not tutorial prompts. | memory (Nov 4) | Decided |
| W25 | 11-03 | When Brian directly asks for a change, it overrides the story spine's wording. | memory (Nov 3) | Decided |
| W26 | 11-03 | Log each change he asks for in `NICK-CHANGES.md`. | memory (Nov 3) | Superseded by W11 (this file is the log now) |
| W27 | 11-07 | The Nov 2 spine isn't binding. A departure from it is judged only by the core (the armature, hiding vs being seen, and the seven beats). Work goes chapter by chapter. "Ready for play: Chapter N" means everything discussed for that chapter is in, with a short list of what isn't. | repo | Decided |
| W28 | 11-05 | The repository is private. | repo | Decided |
| W29 | 11-06 | Keep STATE, DECISIONS and transcripts in the Wyttmab Drive folder. | repo | Superseded: moved into the repo's `docs/old/project/` (Nov 8), and now this file |
| W30 | 11-06 | Stop work early only when there's a high risk of running out of plan credit. Credit lines: 75% for the shared pool, 90% for Fable. | repo (Nov 6, Nov 7) | Decided |
| W31 | 11-08 | Wait for the weekly credit reset (docs say "Thursday 2026-11-13") before the Chapter 2 pass. Cursor's allowance may be used in the meantime. | repo | Superseded in part: Brian OK'd the P2/P3 fixes tonight (K20). What "Nov 13" means now is Open (O20). |
| W32 | 11-08 | Brian's process: build the first three replot decisions first, then come back to questions 4–10, and park every other detail in a saved file. | memory | Superseded by W14: the Chapter 1 cartoon gets reviewed before the rebuild |
| W33 | 11-08 | **Fidelity system:** approved designs are locked as pictures (LOCKED/ + INDEX.md), each room is drawn by one shared script in `mockups/rooms/`, every new sketch passes an automatic diff check against the locked room and an independent checker before Brian sees it, and a locked design changes only on his explicit request (new version, old one kept). Set up because the approved home room drifted in a redraw (TV, bucket, scale). | Brian t233 (card: "Yes, set up locked pictures, shared room drawings, diff check and the checker") | Decided |
| W34 | 11-08 | **Home room locked as APPROVED** (LOCKED/home-room-closed-v3 + home-room-empty-{closed,open,open_empty}-v3). Any change to the home room now needs Brian's yes and a new locked version. | Brian t235 card, 11:05 PM | Decided |

## 2. Story and plot (Chapter 1 unless noted)
| # | Date | Decision | Source | Status |
|---|---|---|---|---|
| S1 | 11-03 | Armature: "Home is where love doesn't have to hide." | repo STATE; memory | Decided |
| S2 | 11-08 | **1A:** Squatch hears the manager promise to keep Mops, then knowingly paw-signs the paper robot order that replaces him. It isn't a mistake. | card; memory | Decided |
| S3 | 11-08 | **2A:** They leave as passengers on the UPS ship. Security cameras cause a forced stop, they're found and put off at the Gas Stop, and their Chapter 2 wages buy soup, then another ride. No fuel-light reason. | card; memory | Decided |
| S4 | 11-08 | **3C:** Keep the escape-puzzle idea (code, vent, singing, switching, goat costume, scanner, player-typed code) but overhaul its setup and how it plays. | card; memory | Decided |
| S5 | 11-08 | The code puzzle gets them into the **manager's office**, not the escape itself. | Brian 3:45 PM | Decided |
| S6 | 11-08 | **4B:** The ordered robots arrive on the NEXT weekly UPS ship after a visible time jump. | card; memory | Decided |
| S7 | 11-08 | The gap is one week on the weekly route, shown as a time lapse: a "Six days later" card, then the ship comes tomorrow. | Brian 3:36 PM, 4:33 PM | Decided (the card's words still need his yes, see the lines file) |
| S8 | 11-08 | The robots arrive the next morning (daily route). | DOWNSTREAM Q8 proposal | Superseded by S7 |
| S9 | 11-08 | **5A:** The player sees the parents (player-only pictures). Squatch only hopes when he sees the brochure. Mops knows only that he found the baby. | card; Brian 3:36 PM | Decided |
| S10 | 11-08 | **6A:** Squatch can walk during normal talk, while deliberate close-ups stay tap-paced. The song button is always visible, which doesn't mean he can sing anywhere. | card; memory | Decided. In the unmerged slice: a spoken line no longer freezes walking while he has control. Cards, panels, and cutscenes still do. A ♪ button is always in the control row. It sings only at home before Mops leaves. |
| S11 | 11-08 | The party replaces the old notice sneak and inspection. The guards chase him home and search the room. | Brian 3:36 PM | Decided |
| S12 | 11-07 | D15 night out: a brochure table with the robot-janitor notice as the reason to go out. | repo | Superseded by S11 (party). The live game still has D15 from PR #11. |
| S13 | 11-08 | Party: after the peek, Squatch puts on Mops's tourist disguise (hat, sunglasses, Hawaiian shirt), takes the robot flyer, has a snack and joins guest conversations. It's free play. | Brian 3:18 PM, 3:20 PM | Decided |
| S14 | 11-08 | The disguise comes off only for real physical reasons: the vent sucks at it, a plant snags the hat, a robot scans him, or he stands next to security until they get suspicious. No wobble meter, and snacks don't count. Otherwise a guest says "Cool hat!" and pulls the hat off. | Brian 3:22 PM | Decided. The party knock-off ("Cool hat!" and a hat pull) is Superseded by R60(b): the octopus tourist's two hugs knock the disguise off. |
| S15 | 11-08 | The "Cool hat!" timer is 2 minutes of party play. | Brian 3:36 PM | Superseded by R60(b). The party fail is two hugs, not this timer. |
| S16 | 11-08 | Goat vs tourist: the tourist disguise eventually fails at the party. The goat suit only has to get past the boarding scanner once, and the security tapes later show it wasn't really a goat. No big scanner explanation is needed, in the TV story or anywhere else. | Brian 3:36 PM; memory | Decided (supersedes DOWNSTREAM Q5's surface-scanner rule). "The security tapes later show it wasn't really a goat" is Superseded by R60(c) (tapes proof dropped). |
| S17 | 11-08 | The TV flashback plays right after the peek, before the robot notice and the sneak. | memory (earlier Nov 8) | Superseded by S18 |
| S18 | 11-08 | Order: peek → party → disguise falls off ("FUR! Security!") → he runs home → Mops comes home, sees the flyer and the fur, and turns on the TV. | Brian 3:18 PM | Decided |
| S19 | 11-08 | The TV story uses real game places: Wookiee tourists in the lobby whose fur floats into the wall air scrubber, the scrubber clogging while people gasp ("Nobody can live outside" is cut), and the same host-manager walking the Wookiees onto their ship at the loading bay and making the no-fur rule. | memory | Decided |
| S20 | 11-08 | Peek: the host on stage welcomes the Bleep-Bloop Robotics delegation, a robot high-fives him and the crowd laughs. Squatch visibly sees pairs (a family hugging, two tourists laughing, two robots high-fiving) before "Everybody has somebody". Keep "You have me". The "ROBOTICS DELEGATION!" banner stays in the peek view. Squatch is curious ("Robots?"), not sad. | memory; repo (Nov 7); memory (Nov 3) | Partly superseded by R49 (no robots, no Mops at party) |
| S21 | 11-08 | The host is the same person as the manager in the TV story, the office and the deliveries. | memory | Decided (name = Isfred Bar Neshuman, R42) |
| S22 | 11-08 | Paw order: orders in the office outbox or mail go through automatically, and the manager is **surprised** when the replacement robots arrive. | Brian 3:36 PM | Decided |
| S23 | 11-08 | The promise scene is the first UPS delivery at lunch. | Brian 3:36 PM: "assume A" | Needs Brian's yes |
| S24 | 11-08 | Lunch to delivery: Mops says the one-snack rule ("you know the rule, grab one snack"), the PA announces the Universal Postal Service ship, Squatch asks to follow, Mops agrees ("Okay, just this time, but hide carefully"), and they walk to the delivery room together (no jump). Brian accepted beats 1–7 without changes. | Brian 4:04 PM, 4:14 PM | Decided (exact words need his yes) |
| S25 | 11-08 | Beat 8: after the robots arrive, the manager reassures Mops ("you know how much we love you here"). Mops takes his value from his job, his pseudo-family. Then something in another room pulls the manager away. | Brian 4:14 PM | Decided (words need his yes; the reason for the call-away is Open, O15) |
| S26 | 11-08 | The order is in triplicate. Nods: the "fur vs hair is paperwork" joke, and maybe "so futuristic and we still order on paper." | Brian 3:45 PM | Decided (words need his yes) |
| S27 | 11-08 | **Papers, one copy each:** the white copy stays in the office. Mops bites the **yellow** copy ("Delicious."), gumbles and spits it into the bin by the plant, and that night Squatch takes it out, paw-signs it and posts it in the robot mailbox. The **pink** copy, with the handwritten code and the carbon paw print, gets sucked into the big wall vent. | Brian 3:45 PM, 4:33 PM; sketches 04, 05a, 05b; memory | Decided (how the carbon paw gets onto the pink copy is Open, O9) |
| S28 | 11-08 | Both the yellow and pink copies go in the bin, and the code halves split between the trash liner and the grate. | memory; DOWNSTREAM Q9 | Superseded by S27 |
| S29 | 11-08 | The slip handoff: the robot asks Mops, "Left one of the copies in the office. What do I do with the other two?" Mops says "I'll take care of it," turns away, says "Delicious," and eats part of it. | Brian 3:45 PM | Decided (words need his yes) |
| S30 | 11-08 | The robot delivery's single paper is both the confirmation form and the form you mail back to order more, which is why Squatch knows he can order. Say it in the simplest words. | Brian 4:14 PM | Decided (words need his yes) |
| S31 | 11-08 | Proposed paw proof for Mars: a delivery slip reading "Ordered by:" plus a paw print. | Brian 4:33 PM (proposal awaiting his OK) | Needs Brian's yes (probably replaced by the pink copy, O8) |
| S32 | 11-08 | Walking home: Mops walks Squatch home ("We got to watch out for these robots") and the paperwork joke happens as they pass the robots. The photo wall is in a different place from the office and storage. | Brian 4:14 PM | Decided (words need his yes) |
| S33 | 11-08 | At the snack stand they overhear people in line talking about the missing Moon Pies ("I swear we had more Moon Pies... is that what they stole at lunch?"). Tourists bring up the pancake brochure, and Mops says "Quick, hide." | Brian 4:14 PM, 4:31 PM | Decided (words need his yes) |
| S34 | 11-08 | Free roam on the way home makes it clear Squatch is meant to go home: Mops's parting line plus a goal that stays up. | Brian 4:31 PM | Decided |
| S35 | 11-08 | The brochure is found at the snack stand and discussed in their room. There's no follow-Mops goal: Squatch waits for Mops to fall asleep, then sneaks out. | Brian video notes (reconcile plan) | Decided |
| S36 | 11-08 | The Mars talk: Mops says no ("They need me here, they're not going to replace me. Plus the Guardians are here"). | Brian 4:14 PM | Decided (words need his yes) |
| S37 | 11-08 | **Guardians flashback (option A):** at bedtime, Mops sits at his desk and the player sees the flashback of him coming up with the Guardians. Squatch doesn't see it. The vent workstation is revealed later, while playing as Mops. | card; memory; Brian 4:14 PM | Decided |
| S38 | 11-08 | Night one: Squatch sneaks past the robots, the night and security to get the yellow copy from the bin, paw-signs it and posts it in the robot mailbox. | Brian 4:14 PM; memory | Decided |
| S39 | 11-08 | Robots tease Mops about wiping the floor with his beard, and one says HQ messaged that he's being replaced this week anyway. Mops thinks the manager lied, tells Squatch the new robots come on the ship tomorrow, and suggests going to find the pancake stand. They sneak out together that night. | Brian 4:14 PM | Decided (words need his yes) |
| S40 | 11-08 | Escape night: Squatch almost slips ("it was on the form I sent... never mind"), then remembers a copy got sucked into the vent. | Brian 4:20 PM | Decided (words need his yes) |
| S41 | 11-08 | Escape night: Squatch sings to distract the robots while Mops goes into the vent. | Brian 4:20 PM | Superseded by S42 |
| S42 | 11-08 | Escape night: Squatch anxiously waits outside the grate, rolled into a ball (L2), instead of distracting the robots with music. | memory; sketch-05c | Decided |
| S43 | 11-08 | The big wall vent is goat-sized (about a window air conditioner). Mops always goes in to clean the vents, and he crawls in to fetch the code. One suction pulls in both fur and paper. No special note slot. | Brian 3:45 PM, 3:49 PM | Decided |
| S44 | 11-08 | Mops's secret Guardian workstation is inside the big vent. | Brian 3:52 PM | Decided |
| S45 | 11-08 | In the workstation, the pink paw slip sits on the left of the desk right beside Mops, and he doesn't notice it. Squatch outside the grille whispers "I hope Mops doesn't notice..." | memory; sketch-06 | Decided (words need his yes) |
| S46 | 11-08 | **The pink slip leaves the vent:** Mops is in a hurry, so he puts the pink slip in his mouth, says "Hurry, hurry, pink slip, got it!" and runs out, which is why he doesn't spot the paw print. As soon as he's out, Squatch rushes over and grabs it from him, thinking "Get it before he sees it." | Brian t213; memory | Needs Brian's yes (words) |
| S47 | 11-08 | In the vent, Mops writes one more Guardian note: "We know you're thinking about going to Mars. Don't worry, we'll always be with you." | Brian 4:20 PM | Needs Brian's yes (words; whether it's readable is O11) |
| S48 | 11-08 | The Moon Pie site offers "Order new box / Return empty crate" and they click Return empty crate. A reusable-shipping joke is optional. | Brian 4:20 PM | Needs Brian's yes (words) |
| S49 | 11-08 | On the way home, Squatch is allowed to break the rule and take all the snacks at the same stand. He leaves some food for the Guardians, and Mops says nothing. | Brian 4:20 PM | Decided (words need his yes; any change to required snack counts needs his yes) |
| S50 | 11-08 | The box: the Moon Pie crate goes outside, with the little Guardian Box inside it. | Brian 4:33 PM | Decided |
| S51 | 11-08 | Squatch climbs into the Guardian Box with Mops's bucket on top, on a pallet. | Brian 4:20 PM | Superseded by S50 |
| S52 | 11-08 | An announcement: "Due to suspicious activity, we will be inspecting every package." | Brian 4:20 PM | Superseded by S53 |
| S53 | 11-08 | **No inspection announcement.** On pickup day the robots load crates and big bags and open one in front of the pair, so they see the inspection happen. That's why they go for the goat costume. | Brian t211 | Decided |
| S54 | 11-08 | Costume: Mops trims part of his beard and glues it onto Squatch, and Squatch also wears the spare JANITOR shirt. It should look ridiculous on the security tapes. The costume art needs a redesign. | Brian 4:20 PM | Superseded in part by R39 (spare blue jacket worn normally + fake beard + horns; R44/R45). Where it happens moved off R17 to home, then the wardrobe (R29). "It should look ridiculous on the security tapes" is Superseded by R60(c) (tapes proof dropped). |
| S55 | 11-08 | Boarding: they pass the fur scanner and board the cargo. The manager runs after them ("Mops, it's a mistake!"), but they're already on the ship. Manager: "What happened? We need to review the security tapes." | Brian 4:20 PM | Superseded by R50 (no chase; office cutscene) |
| S56 | 11-08 | The manager checks the tapes later that evening, after a "Later that evening..." card. The tapes clearly show the ridiculous costume. Partway through the trip the ship gets a call from the base, makes a forced stop, and the pair are found and put off. | Brian 4:20 PM, 4:31 PM; S3 | Decided. "The tapes clearly show the ridiculous costume" is Superseded by R60(c). The evening review and the forced stop stay (R50, R54). |
| S57 | 11-03 | Wake-up: the toy and the note come from the Guardians. Squatch picks up both, holds the toy up, and puts both in the Guardian Box. Nothing he picks up just disappears. | memory (Nov 3) | Decided |
| S58 | 11-04 | "MY GARDIANS" is an intentional kid spelling. Keep it. | memory; reconcile plan | Decided |
| S59 | 11-07 | The Guardians secret: the player learns Mops writes the notes, Squatch doesn't, and Chapter 4's "...Then who were the Guardians?" depends on that. | repo; answered (GUARDIANS) | Decided |
| S60 | 11-08 | The bedroom vent stays, with a red line on the wall or floor. Crossing it early really sends fur in and brings security. | Brian 3:11 PM | Superseded by R37 |
| S61 | 11-03 | No fur alert in the lobby: people just see him (a reaction, a "!", guards run in). The fur alarm only comes with a visible cause (fur drifting into a vent). | memory (Nov 3) | Decided |
| S62 | 11-03 | No robots appear before the delegation brings them in. S1 uses a human guard, not a security bot. | memory (Nov 3) | Decided |
| S63 | 11-03 | In the paperwork scene it must be obvious what happens to the paperwork. It shouldn't look like Mops is just throwing it away. | memory (Nov 3) | Decided |

## 3. Characters and look
| # | Date | Decision | Source | Status |
|---|---|---|---|---|
| C1 | 11-08 | **Mops (approved design):** a goat, not sheep-like, with a lean body, short upturned tail, scraggly white beard to the floor, rounded pink-inside ears, curled tan horns, closed-eye dash, pink nose and gray legs. Shirt option 2: a blue work shirt with a chest pocket and name patch. **No badge.** Files: `mops-approved.jpg`, `spr_mops_new.png`. | Brian; memory | Decided |
| C2 | 11-08 | **No mop prop, ever.** Mops cleans with his beard everywhere, the kitchen included. | card (7); memory | Decided |
| C3 | 11-08 | **The ball pose everywhere is L2** (`_ball_head_L2.png`, from `sketch-ball-options-4.png`): a solid brown ball with Squatch's frizzy scalloped head outline and ears, and two slightly bigger dark eyes with tiny white highlights. No face, no arms or legs. | Brian, card answer "Go with L2" | Decided |
| C4 | 11-08 | Ball options A–E (sketch-ball-options.png). | Brian t215: none matched | Superseded by C3 |
| C5 | 11-08 | Ball = the Chapter 2 kitchen DUCK pose (normal Squatch squashed to 62% height, eyes closed). | memory | Superseded by C3 |
| C6 | 11-08 | Ball options F–J (F is the game's own second hiding ball), then K/K2/K3 (F as just his head), then L (F with fuzzy head and ears). | Brian t218, t221 | Superseded by C3 (L2) |
| C7 | 11-08 | Rolling into a ball is a consistent hiding option throughout the game (it already happens in the Chapter 2 kitchen). | memory | Superseded in part by C20. The L2 pose stays (C3). "A gameplay move in Chapters 3–4 needs Brian's yes" was L36, now Superseded by C20. |
| C8 | 11-08 | **Plant hides:** whenever Squatch hides in a plant or bush, show ONLY the plant and his eyes peeking out of the leaves, never his body beside or behind it. This applies to every panel, always. | Brian t217 (emphatic); memory | Decided |
| C9 | 11-08 | **Peek-eyes:** eyes in plants and boxes use the game's original look (clear white eyes with dark pupils, as in the old `beats*.png`), drawn with the shared `peek_eyes.py` helper. | Brian t220 ("a million times better") | Superseded by C21 (the v1 helper drew them about twice too big and too high, on the wrong plant) |
| C21 | 11-08 | **Hide look = exactly the game (Brian t230 screenshot, "These are the eyes!").** *Plant:* the game plant (`Xp()`): orange pot with five fuzzy leaf clumps (two side, one big top, two lower front). The two eyes sit LOW, in the two lower-front clumps (eye centre 50% down from the top of the leaves), and are small: each eye about 12% of the plant's height, centres 19% of its width apart. *Box:* the game two-box stack (`Ys()`): a small box sitting on a bigger box; the eyes peek out right at the seam, just under the small box's bottom edge. *Eyes* (`ga()`): two round white eyes, 2 px dark outline `#1e2430`, dark pupil nudged down-right. Only the plant/box and eyes show, never body or fur. Sketches use `peek_eyes.py` → `paste_plant_hide()` / `paste_box_hide()` (Chrome renders of the game code, `spr_game_*_4x.png`). **Superseded:** the v1 sketch eyes (2.5× scale, placed high, on the old smooth-circle plant with extra olive clumps), the fur-window/side-glance look, the brown fur patch with dark dot eyes, the hair tuft, and the face/body peeking beside the plant. | Brian t230 screenshot | Decided |
| C10 | 11-08 | Adults (manager, workers, guests) are clearly taller than Squatch and Mops. | memory | Decided |
| C11 | 11-08 | The current alien sprites are fine for the workers and the manager. Guests need variety: some humanoids mixed with clearly different aliens. | memory | Decided |
| C12 | 11-08 | **Guests approved:** `spr_guest_01`–`05` (teal-jacket woman, Hawaiian-shirt camera tourist, three-eyed backpacker, stilt-legged purple alien, octopus tourist) and `06` (robot tourist), plus the guests we already had. `07` (jelly) and `08` (furry alien) weren't picked. | Brian t214; sketch-ref-guest-lineup.png (was sketch-07-guest-lineup.png; renamed 11-08 so 07 is only the night-mailbox panel) | Decided |
| C13 | 11-04 | Characters keep the same size and drawings in cutscenes as in gameplay, unless the camera clearly zooms. | memory (Nov 4) | Decided |
| C14 | 11-04 | Vision cones: everyone but Mops has a cone and pops a "!" on seeing Squatch. Mops has a warm cone that pops a heart. All cones vanish on Mars. | memory (Nov 4) | Superseded by Brian, Nov 16, 4:02 PM PT: everyone who can see him gets a faint dashed cone that fills yellow when he is inside. Approved, not built. |
| C15 | 11-04 | Getting spotted can be funny instead of always a security chase (a robot vacuums his fur, a tourist bot's flash, mistaken for a rug), with one funny version per chapter and a clear way out. | memory (Nov 4) | Decided (direction) |
| C16 | 11-03 | The security guard wears a fun outfit and can actually catch him. If caught, Squatch goes back and retries. | memory (Nov 3) | Decided |
| C17 | 11-08 | Rusty's red "R" cap becomes a grease cap with a fuel-drop badge (D13). | answered | Decided |
| C18 | 11-08 | The manager's name: Puddlewick, Bimble or Clipwell. | DOWNSTREAM Q12 | Superseded by R42 (Isfred Bar Neshuman) |
| C19 | 11-08 | Escape night: the player presses the action button and Squatch squats down into the L2 ball under the wall vent (the ball is player-triggered, not automatic). | Brian t225 | Decided |
| C20 | 11-08 | **Ball anytime:** the player can press the action button to ball up (L2) whenever they want, as a hiding move in every chapter. It works less well than plants and boxes (a weaker hide: e.g. a robot already looking at him or close by still spots him; one passing at a distance may miss him). Escape night is a story spot where it fully works. Exact detection numbers still need Brian's yes before code. | Brian t228 card | Decided. The "tuning needs yes" part is Superseded by R43 (about one crate width, ~70px, for 2 seconds). |

## 4. Look, rooms and layout
| # | Date | Decision | Source | Status |
|---|---|---|---|---|
| R1 | 11-08 | **Style:** simple rounded shapes with no texture, one thick dark outline, soft muted flat colours, and yellow only for usable things. Rooms have a dark rounded frame and a back wall with one floor line, objects mostly face-on. Windows are dark navy with simple shapes (Stormtop is 2–3 cloud bands, one ring arc, dot stars). Full details in STYLE-GUIDE.md. | Brian agreed; memory | Decided |
| R2 | 11-08 | Thoughts use the game's whisper bubble (dashed outline, pale fill `#f6f7fb`, grey text `#4b5563`, no tail). Spoken lines use normal bubbles. | memory | Decided |
| R3 | 11-08 | Sketch fonts: Nunito ExtraBold for bubbles and labels, Kalam Bold for handwriting and notes. | memory | Decided |
| R4 | 11-08 | **Newer room style:** rooms are drawn like `sketch-01k/01m-hall-soft` (template `hall_soft3.py`), not the older block style. `sketch-01k` is the approved template for all rooms. | Brian; memory; Brian t213 | Decided |
| R5 | 11-08 | Stormtop floats in a gas giant's upper clouds. The hall window shows storm clouds and the rings arcing overhead. | memory | Decided |
| R6 | 11-08 | Hall (one hall): stage at the top with no "Convention Hall" banner, the home entrance at the bottom, and an open gap at the north end of the right wall into the next room. | memory | Decided |
| R7 | 11-08 | The big viewing window stays exactly where it was originally (flush in the top-right corner). | memory (Brian, firm, repeated) | Decided |
| R8 | 11-08 | A giant wraparound window along the top wall (sketch-01i). | memory | Superseded by R7 |
| R9 | 11-08 | **One snack stand**, out in the open in the hall on the far right, turned 90° against the right wall with its back turned so Squatch can hide behind it. It doubles as the bar and sits close to the wall with only a narrow service aisle behind it. There's a second plant mid-room. Current sketch: `sketch-01m-hall-soft.png`. | memory | Decided |
| R10 | 11-08 | Snack stand in a nook on the left (4:33 PM card) / an L-shaped bar against the right wall (01i). | Brian 4:33 PM; memory | Superseded by R9 |
| R11 | 11-08 | The speaker (retro wooden box with a round cone, option 4), the FUR alarm (classic red pull station reading "FUR / PULL DOWN") and the vent are spread out in sensible spots, not grouped. A small slatted vent appears once per room. No floating speaker icon. Physical alarms go on walls, not in bushes. | memory; video notes | Decided |
| R12 | 11-08 | Floor vents show soft swirl streaks always curling inward. Vents only pull in, and clean air comes out of wall grilles as a gentle puff that never grabs anything. | memory | Decided (supersedes rings and the "smell-style lines" version) |
| R13 | 11-08 | Every vent and scrubber gets an art pass to match the newer art. | Brian 3:53 PM | Decided (not built) |
| R14 | 11-08 | Delivery room (right of the hall): UPS ship window, ramp, robots, manager, Dot/Bob/Lou. The big goat-sized crawl vent is a **wall** vent under the speaker on the right. | memory; sketch-03 | Decided |
| R15 | 11-08 | The fur scanner arch (blue scan line, at the foot of the ramp) is the boarding checkpoint, and it's **only there when a ship is docked** (or it lowers from the ceiling). | Brian t211; memory | Decided |
| R16 | 11-08 | The STORAGE corner of the delivery room. | sketch-03 (old) | Superseded by R17 |
| R17 | 11-08 | **The mail room:** the old STORAGE corner is the mail room, with **no label**. | Brian t211; lines file 8:16 PM note | Decided (supersedes the "MAIL ROOM" label) |
| R18 | 11-08 | The mail room is drawn in the **newer room style** as a **partial wall, with its opening toward where the manager stands**, so robots inside can't see the vent. | Brian t213 | Decided (supersedes t211's "extend the wall up, three-quarters closed") |
| R19 | 11-08 | The mail room is big enough for the Moon Pie crate, for Squatch to jump out of it, and for several crates and big bags. | Brian t211 | Decided |
| R20 | 11-08 | The mail room is **empty except for the robot mailbox** in the early scenes. Crates and big bags only get loaded once they know the pickup ship is coming. | Brian t212 | Decided |
| R21 | 11-08 | **The robot mailbox:** an old-school-looking mailbox that's actually a robot, sitting in the mail room and visible in **every delivery-room panel**, day and night. | Brian t211; memory | Decided |
| R22 | 11-08 | What the mailbox says when mail goes in: Brian's words were "Mail scanned. Signature pawature accepted." (spelled PAWATURE). The lines file has the shorter "Mail scanned. Pawature accepted." His simpler alternative is paw prints only. | Brian t211; memory | Needs Brian's yes |
| R23 | 11-08 | The manager's office sits beside the storage corner (now the mail room) (D8). | answered; Brian 4:33 PM | Superseded by R51 (office off the hallway) |
| R24 | 11-08 | **The costume happens at home** (Squatch and Mops's room below the hall). A **closet** is added there holding the costume kits and the spare JANITOR shirt, and little else is added. The shirt doesn't come from the mail room. | Brian t216, t219; memory | Superseded by R29 (wardrobe details) |
| R25 | 11-08 | The costume panels drawn as a brand-new room / the spare shirt kept in storage. | first costume panels; Brian 4:20 PM | Superseded by R24 |
| R26 | 11-08 | Usable objects get outlines, not floor circles, everywhere. The peek door gets a yellow outline, and the white "PEEK door" label is removed. | Brian 3:11 PM; memory | Decided |
| R27 | 11-08 | Hiding in a bush = inside it with only eyes showing. | memory | Decided (same as C8) |
| R28 | 11-05 | Kitchen layout is composition C (separate wash and cook stations, a smaller serving window, Mops running between both). | repo | Decided |
| R29 | 11-08 | **Home room drawn exactly as the game's existing home; only a wardrobe added** (Brian, 2026-11-08). Uniform scale from `src/game/60-frame-draw.js` `P2()` (lines 532–645) plus helpers H2/L2/cq/Xn/Ef/rq. Objects stay small with big open floor. | Brian t224, t229; game P2 | Decided |
| R30 | 11-08 | The wardrobe stands against the **back wall at the far left**, sized like real furniture (a bit taller than Mops, base on the floor line like the desk). The whole home uses the **game's proportions** — small objects, big open floor (Brian t229). | Brian t224, t229 | Decided |
| R31 | 11-08 | The **DELIVERY / Moon Pie plan calendar** hangs on the **wardrobe door** (moved off the wall). | Brian t224 steering | Decided |
| R32 | 11-08 | The wardrobe is **closed** in early scenes, and **opens from the first time Squatch decides to get a disguise onward**. Panel 08a open (kits + spare JANITOR shirt). Panel 08b open (shirt hanger empty). Default closed look: `sketch-08-home-closed.png`. | Brian t224 steering | Decided (the spare JANITOR shirt is Superseded by R45: a plain blue jacket) |
| R33 | 11-08 | **No mop standing in the home room.** Drop the leaning mop from every home panel (it was never a thing in their room). | Brian t231 | Decided |
| R34 | 11-08 | **Wardrobe door physics:** when the wardrobe is open, the calendar swings away with the door (seen edge-on or from behind), so the DELIVERY / Moon Pie side is not shown facing the viewer. | Brian t231 | Decided |
| R35 | 11-08 | The STAY IN HERE (don't leave the room) poster hangs on the wall right next to the door out (not on the door itself). | Brian t231, t232 | Decided |
| R36 | 11-08 | **Home exit is a wall cut:** the door out of the home is just an opening cut into the RIGHT wall, like all doors now (no drawn door slab). The STAY IN HERE poster stays on the wall right beside that opening. | Brian t234 | Decided |
| R37 | 11-08 | **No vent in the home room.** The floor vent and its red line are cut from Squatch and Mops's home entirely (no swirls, no alarm risk there). | Brian t235 card | Decided (supersedes S60) |
| R38 | 11-09 | **Pickup day crate escape (storyboard 13).** The robots pull the crates out of storage and are about to load them onto the belt, and they are opening one crate there to check it. Squatch is hiding INSIDE a crate (answers Q1: he jumps out of a crate, not the game box hide). Mops (the janitor) comes in to warn him, Squatch gets out of the crate safely, and they sneak back to the home room for the disguise. | Brian t239 | Decided |
| R39 | 11-09 | **Disguise = Mops's jacket worn normally + fake beard + horns.** Squatch wears Mops's blue jacket in the ordinary way; the main pieces of the disguise are the fake (glued) beard and horns. Supersedes S54's "beard + JANITOR shirt only" and the checker's earlier removal of horns. | Brian t242 | Decided (supersedes S54 costume contents) |
| R40 | 11-09 | **No alien janitors (Dot/Bob/Lou) on pickup day.** They would not be there; remove them from the pickup-day panels. | Brian t242 | Decided |
| R41 | 11-09 | **Pickup day staging.** The robots open a crate out by the ship (on the ramp/loading side), while Squatch hides in a crate still inside the mail room. Mops comes in to warn him and he gets out unseen while the robots are busy by the ship (refines R38). | Brian t242 card | Decided |
| R42 | 11-09 | **Manager name: Isfred Bar Neshuman.** Use that name wherever the manager is labeled. Replaces the placeholder options (Puddlewick/Bimble/Clipwell) and the brief Bob Peterson mis-record (t244, withdrawn). | Brian t245 | Decided (supersedes O6/C18) |
| R43 | 11-09 | **Ball hide detection = time-in-radius.** When Squatch is balled up (L2), a robot notices him only if it stays within a small radius (~one crate width, ~70px) continuously for 2 seconds; leaving the radius resets the count. Same rule in every room/chapter; replaces the A/B/C distance options. Radius and seconds are isolated constants for tuning. Standing/walking detection unchanged. | Brian t246 ("whatever is easy and consistent") | Decided |
| R44 | 11-09 | **Costume jacket is a spare.** Squatch wears a spare blue janitor jacket (worn normally, per R39); Mops keeps his own blue jacket on in 08b, boarding and after. | Brian t246s963 card | Decided |
| R45 | 11-09 | **Wardrobe spare = plain blue jacket.** The spare JANITOR shirt hanging in the home wardrobe is replaced by a plain blue jacket (the one Squatch borrows). Changes the APPROVED home room: redraw via home_room.py, lock as CURRENT v4, needs Brian yes before APPROVED; until then APPROVED v3 stays the reference. | Brian t246s963 card | Decided (art pending yes) |
| R46 | 11-09 | **Moon Pie site is on the manager's office computer**, not the home TV; that is why they need the code (S5) to get into the office. Panel 22 moves to the office. Requires an office room module extracted from the existing game office art (not invented). Supersedes the home-TV staging of home-22-moon-pie-site-v1. | Brian t247 | Decided |
| R47 | 11-09 | **Walk home = walk over, reversed.** Mops and Squatch go back home the same way they came: through the same hallway between the rooms (hall_room.py), with visible walk-off/walk-in (W20). The walk-home panel (17) is staged in that hallway, matching the walk-over route. | Brian t248 | Decided (the hallway is the new connecting hallway, R48/R51/R55, not hall_room.py, which is the party hall) |
| R48 | 11-09 | **New connecting hallway.** No hallway between rooms existed (hall_room.py is the party hall). Brian asked for a simple hallway sketch in the house style for his approval; once APPROVED it becomes the shared route for all walks between rooms (R47). Until approved, panel 17 stays on hold. | Brian t249 | Decided. "Art pending yes" is Superseded by R55 (hallway v5 APPROVED). Layout after this row is R51, then R53. |
| R49 | 11-09 | **Party logic (Brian t250, "straightforward logic"):** (1) Squatch sneaks out to the party ALONE and hides that he went; Mops is NOT at the party in any party panel (peek, party, disguise). (2) NO robots at the party at all: the delegation is only announced; robots have not arrived yet (enforces S62; supersedes S20 robot high-five and robot pair). Pairs Squatch sees are non-robot guests only. (3) Guests and animals are sized to match the game sprites, not uniformly. (4) "You have me" is said by Mops, so it moves out of the party; placement: when Mops comes home (S18), decided in R52. | Brian t250 | Decided. The pair hunt as a party game is Superseded by R60(a). |
| R50 | 11-09 | **No manager at departure.** The manager (Isfred) is NOT at the ship while Mops and Squatch leave (Squatch in disguise). Replaces the boarding chase in S55. Instead, a short cutscene in the manager's office: Isfred asks one of the robots to send in Mops because it's time for his Employee of the Month photo, and that is how he learns Mops is gone (leads into the tape review). Panel 23 (delivery manager chase) is superseded; new panel 23 = office cutscene. Exact words pending Brian (lines file). | Brian t251 | Decided (words pending) |
| R51 | 11-09 | **The hallway = the passage between the party hall and the loading bay (delivery room).** No door to home (home connects to the hall, R6). It holds: (a) the Employee of the Month photo wall (S32: photo wall in its own spot, not with office/storage; the old photo-wall gallery interaction from Nov 3-4), (b) the manager's office, opening partly off to the side of the hallway (supersedes R23 office beside the mail room; the office is not in the loading bay). Interactions there: walk to/from the loading bay (Mops + Squatch walk past the robots with the "Paperwork." joke on the way home, S32); Squatch can look at the photo wall; the night sneak to the office (code puzzle, S5) and the Employee of the Month cutscene (R50) use this office. Supersedes the R48 v1 sketch (HOME/HALL/DELIVERY doors). | Brian t252, t253 | Superseded by the corrected R51 row below. The side alcove in this row is also Superseded by R53. |
| R51 | 11-09 | **Hallway corrected (Brian t252).** The connecting hallway runs between the party HALL and the LOADING BAY (delivery room) only. NO door to home (home opens off the hall, R6). The Employee of the Month photo wall hangs in this hallway (S32: photo wall in its own spot, not the office/storage). Interactions there: walking over/back through it (R47); on the walk home Mops says "We got to watch out for these robots" and the "Paperwork." joke happens as they pass the robots here; Squatch can look at the photo wall (close-up gallery that uncovers something, Brian Nov 3); later the Employee of the Month photo ties to R50. Supersedes the R48 v1 sketch (HOME/HALL/DELIVERY doors). | Brian t252; Brian 4:14 PM Nov 8 | Decided. The end-wall layout after this row is R53. The picture is APPROVED in R55. |
| R52 | 11-09 | **"You have me" placement.** Mops says "You have me" when he comes home and finds Squatch (S18 homecoming), not at the party. Resolves R49(4). | Brian t253s1015 card | Decided |
| R53 | 11-09 | **Hallway layout fix (Brian t254).** The exits to the party hall and the loading bay are at the two ENDS of the hallway (left and right side walls), not cuts in the back wall. The manager's office door is on the OPPOSITE side from the Employee of the Month photo wall (front/bottom wall), since the ship's outside has no big bump-out for an alcove. The office door is LOCKED with a code (keypad) when Squatch first tries it; the code puzzle (S5) opens it. Supersedes hallway v1-v4 layout and R51 "partly off to the side" alcove. | Brian t254 | Decided. "Art pending yes" is Superseded by R55 (hallway v5 APPROVED). |
| R54 | 11-09 | **Office cutscene dialogue (Brian t255/t256, shortened).** Isfred: "Send in Mops for his Employee of the Month photo." Robot: "Mops isn't here." Isfred: "Not here? He can't live off the station!" Robot: "He was replaced by the new robot shipment." Isfred: "I never ordered a replacement! Get me the security tapes." Replaces "What happened? We need to review the security tapes." Isfred no longer jumps straight to the tapes. | Brian t255/t256 | Decided (short wording proposed, awaiting his OK) |
| R55 | 11-09 | **Hallway approved + gallery (Brian t257).** Hallway v5 is APPROVED (locked as v6 copies). The first walk through the hallway to the loading bay is a CUTSCENE (no interaction, so nothing can be discovered early); the hallway first becomes interactive on the way back. The Employee of the Month wall is a swipeable gallery: every photo is the janitor Mops as Employee of the Month with something different and funny in it; at least one shows Squatch rolling in a ball in the background. Photo gag list needs Brian's pick; new captions go in the lines file first. | Brian t257 | Decided. Gag kinds are R62. Specific captions are still NEEDS BRIAN. |
| R56 | 11-09 | **Photo gallery rules (Brian t258).** 10 photos per visit (not endless). The crooked photo is always #4, so you only reach it by swiping past the first three. Lifting it reveals the crayon drawing taped behind it: Squatch and Mops, drawn by Squatch at age 5 (Nov 3 idea), and the reveal must be shown on screen. Photos rotate between playthroughs, drawn from a pool of about 16 gags (one is Squatch rolling in a ball in the background). Proposed end of gallery: after #10, a 'more photos' icon (a fresh set, no repeat of the crooked photo) or a 'move on' exit; the close X works any time. | Brian t258 | Decided. The "10 per visit" count is Superseded by R57 (5 per visit). The more-photos / move-on choice is Superseded by R62. |
| R57 | 11-09 | **Gallery tweak + keepsake (Brian t260).** 5 photos per visit (supersedes R56's 10), so the ~16-photo pool covers at least 3 visits; the crooked photo is #4 on the first visit; the more-photos / move-on choice comes after #5. After the reveal, the crayon drawing stays on the wall. On the final walk through the hallway just before boarding the ship, Squatch can stop and take it as a keepsake for bonus points (amount needs Brian). | Brian t260 | Decided (keepsake points amount pending). The more-photos / move-on choice in this row is Superseded by R62. Five photos, crooked photo #4, and the keepsake stay. |
| R58 | 11-09 | **Balloon kid.** If Squatch returns the balloon, the kid gives a wordless smile, a finger to the lips, and a thumbs-up. If he keeps it, the kid yells "Scary Wookiee!", the FUR alarm is pulled, and security comes. If he never jumps, the balloon reaches the ceiling, the kid is sad, and nothing else happens. Not in the game. | designer record, Nov 9 | Decided. "Not in the game" is **Superseded**: the party on `main` (PR #20) includes this. "Scary Wookiee!" is still NEEDS BRIAN. |
| R59 | 11-09 | **Balloon timing, delegated by Brian.** The kid gasps with a "!" and points. The balloon then rises for 6 seconds, wobbly, with a glow, and it can be grabbed during that rise. One jump grabs it. The beat must read with no words. Not in the game. The 6 seconds are recorded here only. | Brian, delegated; designer record, Nov 9 | Decided. "Not in the game" is **Superseded**: the 6-second rise is in the party on `main` (PR #20). |
| R60 | 11-09 | **Party extras, round 2.** (a) The pair hunt is dropped. A "Find someone who…" picture card is proposed and is pending Brian. (b) The octopus (guest 05) is an over-snacked, huggy tourist. The line is "*hic* Fellow tourist!" and two hugs knock the disguise off. (c) A photo corner: Squatch can enter the shot, then a cut to a Polaroid printing. Bonus points if he is in the photo (amount open). Tapes proof is dropped. (d) Snack table: the third grab starts a chain reaction that pushes things off the far end and gives a hide window. The window is a 4-second placeholder and needs Brian. Not in the game. | designer record, Nov 9 | Decided for (a)'s drop, (b)'s hugs, (c)'s Polaroid, and (d)'s chain reaction. "Not in the game" is **Superseded** for the hugs, the photo, and the snack spill: they are in the party on `main` (PR #20). The points amount and the 4-second window are **Superseded** by his 2:59 PM PT yes: PHOTO_BONUS is 25 (not drawn on screen) and SNACK_LOOK_SECONDS is 4. The picture card and the octopus line still need his yes on the words. |
| R61 | 11-09 | **The balloon stays in the party hall** in later scenes: on the ceiling if Squatch missed it, tied near the kid's spot if he returned it. On the last Chapter 1 visit to the hall it pops quietly, with a comic "POP!". Not in the game. | designer record, Nov 9 | Decided. "Not in the game" is **Superseded**: this is in the party on `main` (PR #20). "POP!" is still NEEDS BRIAN. |
| R62 | 11-09 | **Gallery gags get funnier.** Things worn as horns, something in Mops's mouth, and random things on his head. About 16 gags. The Squatch ball-roll photobomb stays. The crooked photo stays #4. The crayon drawing must clearly read as Squatch and Mops, with "Always tied together" underneath. Controls: left and right arrows under the photo, and an X that is always visible. Swiping past photo 5 always triggers robot beeping ("BEEP BEEP") and the gallery cuts out. Not in the game. | designer record, Nov 9 | Decided (supersedes the R56/R57 more-photos / move-on choice). On 2026-11-13 Brian approved the words as they are in the game: "TIED TOGETHER FOREVER" (not "Always tied together") and "BEEP BEEP". Other gag captions are still unwritten. |
| R63 | 11-09 | **Crayon drawing labels and sight line.** Kid-handwritten labels "MOPS" and "ME". A dotted sight line runs from Mops to Squatch, and hearts rise from that line. That heart line is the contrast with the "!" other characters get when they spot Squatch. Not in the game. | designer record, Nov 9 | Decided. On 2026-11-13 Brian approved "ME" and "MOPS" as they are in the game. |
| R92 | 11-13 | A story wait (`uV`) waits for a tap in all four chapters. A bouncing arrow, with no words, shows that a tap continues. A wordless walk or picture change still plays on its own. | Brian 2026-11-13 | Decided |
| R93 | 11-13 | When Gloop, Blorp, or Zip sees Squatch, the old one-step jump of about 70 pixels is a visible hop of about a quarter second. Zip's sight calls security the same way Gloop's and Blorp's do. | Brian 2026-11-13 | Decided |
| R94 | 11-13 | Squatch does not answer the Mars gate bot before Chapter 4.4. Mops answers for him. | Brian 2026-11-13, 4:10 AM ET | Decided. Brian approved the words: "He's with me." and "No thanks. We're getting my goat." |
| R95 | 11-13 | These stage directions are shown, not said: the searchlight means go to the van, the gate means the van then the barrels, the cook falls instead of saying "*faints*", the stomach rumble is a wobble and a sound, and the camera flash is a flash. | Brian 2026-11-13 | Decided |
| R96 | 11-13 | The home song uses the old lines. Squatch sings "♪ I'm floating in space! ♪". Mops answers "♪ Baaa-aa-aaa! ♪". Then Mops leaves for work. The sing-along chip stays until those lines have played. "See you after work." is not used. On 2026-11-15 Brian changed Mops's answer to "♪ Weeee-eenn-nnttt! ♪" ("Weeeennnttt", written with hyphens like the old "Baaa-aa-aaa!"). | Brian 2026-11-13, 6:12 AM ET | Decided. At 7:02 AM ET he added: Mops walks over and stands next to Squatch before they sing, bubbles stay off the face, and the peek chip shows only after Mops has left and control is back. |
| R97 | 11-13 | The bedroom walk arrows point left, away from the bucket. One number flips them back. Brian is not sure the arrows should stay. | Brian 2026-11-13, 6:12 AM ET | Decided |
| R105 | 11-13 | **Kitchen duck is press-and-hold, and the warning shows where the look will land.** When Gloop calls "Order up?", the action button offers the ball (words stay "ROLL · into a ball"). Hold it and Squatch stays a ball; let go and he stands up. He can no longer get stuck as a ball. During the 2.5-second warning a faint dashed outline shows where Gloop's look will land; the solid cone that catches is unchanged (L12). Brian: "Yes" to press-and-hold and a visible cone. (Numbered R105 because R98 to R104 are in the unmerged heart-cone pull request #35, where this decision is first written as R99.) | **Decided** by Brian. Built in this pull request. |
| R107 | 11-15 | **Snack bar.** The bartender works behind the counter. Squatch can hide behind the counter when nobody is back there; this matters later (beat 27). No sign on the bar. Brian: "Bartender should be behind it. He should be able to hide there if nobody is back there - that matters later in game. No need to put a sign on it." (Numbered R107 because R106 is in the unmerged pull request #38.) | **Decided** by Brian. Not built. |
| R108 | 11-15 | **Floor vent without disguise.** If Squatch is too close to the party hall floor vent without his disguise, his fur goes into the vent: the tuft warning, then the FUR alarm (D15, S61). With the disguise on, the vent tugs the disguise (beat 16). Brian: "if swatch is too close without disguise we need hair in the vent event, remember?" | **Decided** by Brian. Not built. |

## 5. Chapter 1 cartoon, panel by panel (story order)
Each panel's on-screen words are in CH1-CARTOON-LINES.md. Which files are current is in STATE.md.
| # | Date | Decision | Source | Status |
|---|---|---|---|---|
| P1 | 11-08 | Panel 01, the hall (`sketch-01m-hall-soft.png`): the approved layout (R6–R11). The PA announces the ship. | Brian; memory | Decided (the PA words need his yes) |
| P2 | 11-08 | Panel 02, the lunch bag (`sketch-02-lunch-bag.png`): Mops chomps the empty bag. | Brian: "Good" | Decided |
| P3 | 11-08 | Panel 03, the delivery ramp (`sketch-03-delivery-ramp.png`): Squatch is eyes-only in the plant, with the mail room and robot mailbox. | Brian t211, t213, t217 | Decided (redrawn tonight, Brian hasn't seen the new version) |
| P4 | 11-08 | Panel 04 (`sketch-04-delicious-vent.png`): Mops bites the yellow copy ("Delicious.") and the pink code copy gets sucked into the big wall vent. The mail room has the robot mailbox. | Brian 3:45 PM | Decided (words need his yes) |
| P5 | 11-08 | Panels 05a/05b (`sketch-05a-gumbling.png`, `sketch-05b-spit-bin.png`): Squatch is inside the bush with only his eyes showing, Mops gumbles with the yellow copy in his mouth, Squatch says "You're gumbling! (goat mumbling)" (the bracket stays), then Mops spits it into the bin. | Brian approved both sketches | Decided |
| P6 | 11-08 | Panel order: the night mailbox panel (07) is night one. The ball wait under the wall vent (05c) is escape night, a week later, right before the vent workstation (06). | lines file note, 8:16 PM | Decided |
| P7 | 11-08 | Panel 07, night mailbox (`sketch-07-night-mailbox.png`): Squatch gets the yellow copy from the bin, paw-signs it and posts it in the robot mailbox. | Brian 4:14 PM; memory | Decided (words still to be written) |
| P8 | 11-08 | The time jump between night one and pickup week: a "Six days later" card. | Brian 4:33 PM | Decided (the card's words need his yes) |
| P9 | 11-08 | Panel 05c, ball wait (`sketch-05c-ball-wait.png`): Squatch in the L2 ball outside the grate on escape night. | memory; card | Decided |
| P10 | 11-08 | Panel 06, vent workstation (`sketch-06-vent-workstation.png`): an "IDEAS FOR GUARDIANS" header over small unreadable notes (Squatch already has the real ones). A detective wall shows Mops searching for Squatch's parents: red strings, crossed-off planets, "HAVE YOU SEEN?" flyers, a baby photo, and Mars crossed off with a reply letter stamped NO (wrong or fake info, which is why Mops dismisses Mars). The pink paw slip is on the left of the desk, plus a TOYS bin and baby keepsakes. Squatch is behind the grille with "I hope Mops doesn't notice..." in a whisper bubble. | memory (Brian, Nov 8); sketch-06 | Decided (labels and the whisper need his yes; OPEN-ASKS A3 still asks him to confirm Mars, see contradictions) |
| P11 | 11-08 | Mops gets his own thought bubble somewhere in the workstation scene. | memory | Open, parked (O12) |
| P12 | 11-08 | Pink-slip exit panel (S46). | Brian t213 | Needs Brian's yes (drawn Nov 8 ~11:40 PM PT as `sketch-13-pink-slip-grab.png`, LOCKED CURRENT v2 after checker fixes at 11:36 PM; words and how he grabs it still open) |
| P13 | 11-08 | Panel 09, pickup day (`sketch-09-pickup-day.png`): the mail room is full of crates and bags, and a robot at the doorway opens a crate to scan inside. Squatch's eyes peek from the plant, and Mops is nearby, moved off the scanner arch. | Brian t211 | Decided; staging partly superseded by R38 (11-09: Squatch hides in a crate, not the plant; Mops comes in afterwards). Redrawn 12:30 AM PT, LOCKED v3 CURRENT |
| P14 | 11-08 | Panels 08a/08b, costume at home (`sketch-08a-costume-shave.png`, `sketch-08b-costume-on.png`) plus closed default (`sketch-08-home-closed.png`): Mops trims his beard, Squatch puts on the JANITOR shirt and the beard gets glued on, in the game's real home with a far-left wardrobe (R29–R32; R33–R35). | Brian t216, t219, t224, t231, t232 | Decided (redrawn per t231/t232: no mop, open-door calendar edge-on, STAY IN HERE on the wall by the door; R36 right-wall door cut and R37 no vent applied about 9:45 PM PT, Brian hasn't seen that version; locked CURRENT in LOCKED/). Costume contents later: R39/R44/R45. |
| P15 | 11-08 | Boarding through the fur scanner arch (the existing line "HAIR... PROBABLY. PROCEED."). | handover summary; lines file | Decided (drawn Nov 8 ~11:40 PM PT as `sketch-11-boarding-scanner.png`, LOCKED CURRENT v1; Brian hasn't seen it) |
| P16 | 11-08 | A zoom-in shot on the FUR alarm. | Brian (approval of sketch-01i) | Decided (drawn Nov 8 ~11:40 PM PT as `sketch-12-fur-alarm-zoom.png` at the party, LOCKED CURRENT v1; where it happens is still a question for Brian, see STATE) |
| P17 | 11-08 | A separate panel of Squatch taking the yellow copy from the bin and paw-signing it. | parent plan | Open (O16: may be covered by panel 07) |

## 6. Later chapters (2–4 and travel)
| # | Date | Decision | Source | Status |
|---|---|---|---|---|
| L1 | 11-07 | Chapter 2: the Guardians-note flashback ("Years ago, on Stormtop...") shows the player Mops wrote the note. It's core. Draft the lines first. | repo; answered (GUARDIANS: send lines) | Decided (where it sits now that S37 exists is Open, O18) |
| L2 | 11-08 | **Cut Chapter 2's "A hoof stamp. Mops signed it."** Keep the note panel, "THE GUARDIANS FOUND ME IN SPACE!", the slow hoof-stamp close-up and "...Eat up, kiddo." (P3). | Brian t213 ("probably fine"); OPEN-ASKS P3 | Decided (in PR #17, waiting on his merge yes, K20) |
| L3 | 11-08 | D9: when a kitchen bot sees Mops, he gets shooed back, not locked up. | answered | Decided |
| L4 | 11-08 | CH2: coins → soup → pay Rusty for gas. The chili-and-siphon path is retired. | answered | Superseded in part by S3 (2A): soup stays, gas becomes another ride |
| L5 | 11-08 | SWITCH2: Chapter 2's first switch becomes one zoom-in card like Chapter 1. Send the line first. | answered | Decided (words owed) |
| L6 | 11-08 | D17: the player may put a dish away dirty, and Gloop gets upset. It's funny, not a fail. | answered | Decided (words owed; supersedes the Nov 7 "can't-fail rub" mini-moment) |
| L7 | 11-08 | D2-TV: keep the TV warning and the crate hide, and cut the arguing after "Bots! Go watch the dock." (already absent in the game). | answered | Decided |
| L8 | 11-08 | DOCK: keep "Bots! Go watch the dock." | answered | Decided |
| L9 | 11-08 | D4: Blorp's pea gag stays parked. | answered | Decided (parked) |
| L10 | 11-08 | B17: remove COOK. | held-decisions draft recommendation | Superseded by L11 |
| L11 | 11-08 | **8B:** COOK visibly makes the next dirty pot for Squatch to wash. No extra coins, no new chore timer. | card (8B), after B17 "make COOK do something" | Decided (words owed) |
| L12 | 11-08 | E22: Rusty's sight stays the same width until Brian replays. The drawn cone equals the area that catches. | answered; repo | Decided |
| L13 | 11-08 | D12: don't move the kitchen window or sink until the player says what looked wrong (from a recording). | answered | Decided (waiting on the replay) |
| L14 | 11-08 | The run to the wall alarm is only required in Chapter 1. In later chapters, people shouting for security is fine. | memory | Decided |
| L15 | 11-07 | Chapter 3: Phobos is named as the little moon by Mars when they arrive. | repo (D16) | Decided |
| L16 | 11-08 | D16: start the Chapter 3 and 4 sense pass now, with no outline for Brian first. New words still go through a lines file. | answered | Decided (supersedes "send outline first") |
| L17 | 11-08 | D6: Zip's beat is a riddle, not songs. Write many riddles, a different one each game. If the echo riddle comes up, Zip mocks himself for picking such an obvious one. | answered | Decided (whether a riddle can repeat is O21) |
| L18 | 11-08 | D7: Harry's dance stays small: four presses and Mops's "Baaa". | answered | Decided |
| L19 | 11-08 | VEHICLE: the Mars vehicle is a ship, not the van. | answered | Decided (which ship is O22) |
| L20 | 11-08 | DAD: the pancake-hair joke ("You'll get hair in the pancakes.") replaces "Health rules". | answered | Decided (words in the lines file first) |
| L21 | 11-08 | ENDING: one closing picture instead of the long "Ever since..." card. | answered | Decided (sketch first; Mops cleans with his beard) |
| L22 | 11-07 | D18: a ship-window travel card on each leg. | repo | Superseded by L23 |
| L23 | 11-08 | D18: both the travel cards AND optional mini-games (Mops vs the Ganitor robot), skippable, at most one per leg. | answered | Decided (which game and how long is O19) |
| L24 | 11-08 | The next ride after the Gas Stop: another delivery driver, or a passenger shuttle, and the fare. | DOWNSTREAM Q11 | Open (O17) |
| L25 | 11-08 | Why buy soup if they packed snacks? (Recommendation: the snacks stay in the UPS cargo.) | DOWNSTREAM Q14 | Open (O17) |
| L26 | 11-08 | X1 = P2: replace the room teleports in Chapters 2–4 with visible walk-off/walk-in (skip line 1383 and scenes likely to change). | Brian t213 | Decided (PR waiting on his yes, K20) |
| L27 | 11-08 | X2: a why-card for every switch in Chapters 3 and 4. | LATER-CHAPTERS proposal | Needs Brian's yes |
| L28 | 11-08 | X4: later hiding poses (barrel, crate, bins) redrawn to match Chapter 1 (eyes only), art only. | LATER-CHAPTERS proposal | Needs Brian's yes |
| L29 | 11-08 | X5: redraw the later-chapter adults taller and more varied, keeping hit boxes and cones. | LATER-CHAPTERS proposal | Needs Brian's yes |
| L30 | 11-08 | X7: show the stage directions instead of writing them (stomach rumble, Rusty backing out). | LATER-CHAPTERS proposal | Needs Brian's yes |
| L31 | 11-08 | X8: show the Guardian Box and pink copy travelling from Chapter 1 to Mars, and the pink copy slides out in Chapter 4. | LATER-CHAPTERS proposal | Needs Brian's yes |
| L32 | 11-08 | X9: mop words become beard words (the pot handoff becomes teamwork). | LATER-CHAPTERS proposal | Needs Brian's yes (words). Keeping "Employee of the Month: the mop" is O27. |
| L33 | 11-08 | X13: Chapter 4's "That's ME?" becomes a callback ("Like in your story..."). | LATER-CHAPTERS proposal | Needs Brian's yes |
| L34 | 11-08 | X14: Mops's flyers and the parents' poster drawn in the same style. | LATER-CHAPTERS proposal | Needs Brian's yes |
| L35 | 11-08 | X15: Mops gets a whisper thought at Zip's "Sasquatches on Mars?" line. | LATER-CHAPTERS proposal | Needs Brian's yes |
| L36 | 11-08 | X3: the ball as a hiding move in Chapters 3–4 (A: cutscenes only, B: a ROLL button). | LATER-CHAPTERS proposal | Superseded by C20 |
| L37 | 11-08 | C2-3: Mops steps outside to tell Squatch "the kitchen has a back door" instead of whispering through a wall. | LATER-CHAPTERS proposal | Needs Brian's yes |
| L38 | 11-08 | C3-1 and C4-4 (T28): show the locals' fear (a searchlight, a frightened local) instead of saying it. | LATER-CHAPTERS proposal | Needs Brian's yes |
| L39 | 11-08 | C3-2: "I'll sing to the rovers" (fixes who sings). | LATER-CHAPTERS proposal | Needs Brian's yes |
| L40 | 11-08 | C3-4: Mops's sad walk and low-gravity float are shown before the rescue. Same words. | LATER-CHAPTERS proposal | Needs Brian's yes |

## 7. Audio
| # | Date | Decision | Source | Status |
|---|---|---|---|---|
| A1 | 11-08 | Brian's track (`music/main-theme-from-brian.mp3`, 3:54) is the warm theme for heart moments and the title. It's a song by his friend Joe, and Brian says it's fine to use. | Brian 3:17 PM, 3:19 PM, 3:20 PM | Decided (supersedes "rights not confirmed"). The file is in this unmerged slice. It plays on the title, at home (not during the search or dress-up), while the morning gift is out, and when the balloon kid is happy. Sneak and journey stay generated. Nothing starts before the first tap. |
| A2 | 11-08 | Also wanted: a sneak and chase theme, a journey/travel theme, and short stings (spotted, escape, secret found, caught). | Brian 3:19 PM | Decided. Generated stand-ins are in the unmerged slice. Not Joe's recording. |
| A3 | 11-08 | Music plays at the right moments with silence between, not constantly. | Brian 3:11 PM, 3:19 PM | Decided |
| A4 | 11-08 | Any action that makes a noise gets a sound effect (fur slurped into a vent, the robots' bleep-bloops, a goat bleat). | Brian 3:19 PM | Decided |
| A5 | 11-08 | No fart sounds. | video notes; card | Decided |
| A6 | 11-08 | The Harry and the Hendersons Sasquatch theme and Hunting Bigfoot podcast clips are mood references only (licensing unchecked). | Brian 3:11 PM | Decided (references, not for use) |

## 8. Code, controls and process
| # | Date | Decision | Source | Status |
|---|---|---|---|---|
| K1 | 11-06 | D1 Option A: the readable copy of the shipped build is the real source, with a build step. Phases 0–3 and the Chapter 1 pass are merged (PRs #7–#11; main is now 10030f6). | repo | Decided |
| K2 | 11-06 | The chip rule: the first time a mechanic appears, the goal chip names the step; after that it names only the goal. | repo | Decided |
| K3 | 11-06 | "ASK · for work" at the counter. Captor joke: "Counter's closed. Lockup's open." | repo | Decided |
| K4 | 11-07 | The YOU tag is removed. Clicking a face switches characters on a computer, with no keyboard key. | repo | Decided |
| K5 | 11-07 | The second face appears only when a switch is possible (the trimmed version). | repo | Superseded by K6 |
| K6 | 11-08 | E15: both faces always show, and the one you can't switch to is greyed. | answered | Decided (P4, not built) |
| K7 | 11-07 | Reset is a small hold-to-use ↺. After 60 seconds with no progress, the goal chip shows the method line. | repo | Decided for the current game (see K8 and O32) |
| K8 | 11-08 | Hints: try an escalating tap-for-hint (goal → place → exact action) plus a hints on/off setting in the rebuilt first scenes. No idle auto-hints. | Brian 3:19 PM | Decided (words not written) |
| K9 | 11-07 | One capture rule everywhere: sighting → security → lockup card with the cause → restart the section, coins kept. | repo | Superseded in part by K29. The lockup card stays. "Restart the section" becomes "restart the current scene" after long scenes are split. |
| K10 | 11-08 | Security is consistent: when he's seen, a witness runs to the wall alarm, then security comes and actually catches him. He can run back to the room, and security chases him in. Cut the 9-second home countdown; the guard enters half a second after reaching the door. One rule everywhere, pending a full code trace (P1). | Brian 4:04 PM, 4:33 PM | Superseded in part by K29. A witness may still run to the alarm. Where a catch puts him is K29, not a walk into the bedroom. |
| K11 | 11-07 | Tap to walk: a tap advances a bubble or card when one is up, and walks only when nothing is up. | repo | Decided |
| K12 | 11-08 | Keep both the joystick and tap-to-move, with the joystick where it is. | memory; video notes | Decided |
| K13 | 11-07 | The phone HUD: bar above the picture, or an overlay? | repo (open then) | Superseded by K14 |
| K14 | 11-08 | E24: on phones the HUD stays a bar above the picture. | answered | Decided |
| K15 | 11-08 | D14: the player can skip only cutscenes they've already seen. | answered | Decided |
| K16 | 11-08 | T24: "Continue" on the title screen, with save. Build it after the scene order is stable. | answered | Decided |
| K17 | 11-08 | D2-STARS: keep the stars and "Never caught! +250" (renamed from GHOST BONUS on Nov 7). | answered; repo | Decided (supersedes the "finds only" recommendation) |
| K18 | 11-03 | Points only for uncovering something (moving, opening, revealing), never just for looking. | memory (Nov 3) | Decided (the +100 awards question is O25) |
| K19 | 11-07 | Reuse the zoom-in card technique to teach key ideas. No teaching card for the vent; the fur tuft is bigger and shows earlier. | repo | Decided |
| K20 | 11-08 | **The room-walk fix (P2) and the hoof-stamp line cut (P3)**, OK'd by Brian tonight, were launched as one cloud agent (bc-1f6073a1-0bac-5c0f-a74a-eeae794204ec). Chapter 2's opening walk (line 1383) and scenes likely to change are left out. As of 8:45 PM PT no PR was open yet; the open PRs were #12–#16. | Brian t213; parent | **Needs Brian's yes** (written merge yes). PR #17 opened 2026-11-09 on `cursor/later-chapter-walks-04ec`. Not merged. |
| K21 | 11-08 | P1: a read-only security and capture trace across all chapters. The security rule (K10) waits on it. | OPEN-ASKS | Open (O31: not launched) |
| K22 | 11-08 | P4–P8 (both faces, the button-shift fix, Rusty's cap, the flaky test and stale docs, the script export). | OPEN-ASKS | Needs Brian's yes to start |
| K23 | 11-08 | Fix the action button changing size and shifting the whole screen. | Brian 3:11 PM | Decided (not started) |
| K24 | 11-08 | The game fills more of the iPad, in landscape and portrait. | Brian 3:11 PM | Decided (needs a layout picture first) |
| K25 | 11-08 | Scene 1: the tiny janitor button becomes a clear settings button, and the instructions under the game go away. | memory | Decided. On 2026-11-13 at 6:12 AM ET Brian said to remove the keyboard instructions under the game. The settings button still needs words. |
| K26 | 11-08 | Scene 2: the "sing along with Mops" goal disappears once he has sung. | memory | Decided. On 2026-11-13 the chip stays until "I'm floating in space!" and "Baaa-aa-aaa!" have played, then it clears. |
| K27 | 11-03 | Drop redundant "tap" hints when a NEXT button is visible. NEXT pulses gently after a few idle seconds. | memory (Nov 3) | Decided |
| K28 | 11-07 | Picture text under 14 px on a phone gets its own pass, and Brian sees it on his phone first. | repo; OPEN-ASKS E8 | Decided (not started) |
| K29 | 11-16 | **Every catch, in every chapter, present and future.** The lockup card shows, then the current scene restarts. Long scenes, such as the party, are split into shorter ones, each with its own restart point. Brian: "Every catch: jail card, then restart the current scene; split long scenes like the party into shorter ones." This supersedes the Nov 13 bedroom release (PR #38, R106) and the "set back a little where he was caught" rule (Sat Nov 14, 6:59 AM, and the 12:49 PM PT wording the same day). Brian, Nov 16, 4:02 PM PT: "Yes, split the party into those five scenes" (the peek, the sneak to the plant, the party extras, the alarm, and the run home). The set-back code stays until the next pull request builds it. | Brian, Nov 16, 12:50 PM PT; split yes 4:02 PM PT | Approved. Not built on this pull request. |

---

## 9. Open / waiting on Brian
| # | Question | Where it came from |
|---|---|---|
| O1 | The robot mailbox's words: "Mail scanned. Signature pawature accepted." (his words), "Mail scanned. Pawature accepted." (lines file), or paw prints only? | R22 |
| O2 | The pink-slip lines: "Hurry, hurry, pink slip, got it!" and "Get it before he sees it." | S46 |
| O3 | Every NEW line in CH1-CARTOON-LINES.md needs his yes. | lines file |
| O4 | The PA line: "Universal Postal Service ship arriving!" or "The Universal Postal Service ship is arriving."? | lines file |
| O5 | Is the "STAFF MAIL — collected before departure." sign still wanted now that the mailbox is a talking robot? | lines file |
| O6 | The manager's name (Puddlewick, Bimble or Clipwell). | C18 — **Closed by R42: Isfred Bar Neshuman** |
| O7 | Confirm the promise happens at the first UPS delivery. | S23 |
| O8 | Is the "Ordered by: paw" delivery slip dropped, now that the pink copy in the vent is the paw proof? | S31 |
| O9 | The pink copy goes into the vent at lunch, but Squatch paw-signs the yellow copy that night. How does the carbon paw print get onto the pink copy? | S27 |
| O10 | How does the pink copy get from Squatch's paws into the Guardian Box / Moon Pie crate and on to Mars? | X8, OPEN-ASKS A15 |
| O11 | Is Mops's new Guardian note readable on screen (a close-up)? | S47 |
| O12 | Mops's own thought bubble in the vent workstation: when, and what? | P11 |
| O13 | Confirm Mars crossed off with the NO reply letter (memory says Brian asked for it; OPEN-ASKS still lists it as waiting). | P10 |
| O14 | Bedtime desk vs vent workstation only: does Mops have a desk in their room too? (unanswered at 4:33 PM) | PARKED 4:33 PM |
| O15 | What pulls the manager away in beat 8, and why his office is empty at night. | S25 |
| O16 | Does Squatch taking the yellow copy from the bin need its own panel, or is panel 07 enough? | P17 |
| O17 | Chapter 2: the next ride and its fare; why buy soup if they packed snacks. | L24, L25 |
| O18 | Does Chapter 2's "Years ago, on Stormtop..." flashback still happen, now that the Guardians flashback is at Chapter 1 bedtime (S37)? | L1 vs S37 |
| O19 | The travel mini-game (tic-tac-toe, Connect 4 or alternating) and how long it runs. | L23 |
| O20 | What "wait until Nov 13" means now (Nov 13, 2026 is a Friday; the docs say Thursday). | W31 |
| O21 | Can the same riddle come up twice in a row? | L17 |
| O22 | Which ship they're on at Mars (probably Zip's, which depends on O17). | L19 |
| O23 | Who is "B." on the Chapter 2 Mars postcard? | LATER X15 |
| O24 | Zip shouting and shoving with no security around: an allowed exception? | LATER C3-5 |
| O25 | The hidden +100 awards vs the "points for finds" wording. | K18 |
| O26 | Mops's cone: yellow, turning red with hearts when he sees Squatch (video notes) vs the warm heart cone (C14). Confirm. | OPEN-ASKS E9 |
| O27 | Keep the "Employee of the Month: the mop" joke? | L32 |
| O28 | Kid replay recordings of Chapters 1 and 2 (needed for Rusty's width and the kitchen window and sink). | L12, L13 |
| O29 | His written merge yes on PR #17 (the P2 room walks and the P3 hoof-stamp cut). | K20 |
| O30 | All the later-chapter proposals still marked Needs Brian's yes (L27–L35 and L37–L40). L36 is Superseded by C20. | §6 |
| O31 | Start the P1 security trace and P4–P8 now? | K21, K22 |
| O32 | Does the 60-second auto stall hint stay in the chapters that aren't being rebuilt, given "no idle auto-hints"? | K7 vs K8 |
| O33 | Required snack counts if Squatch "takes all the snacks" (difficulty). | S49 |
| O34 | Where does the FUR alarm zoom happen: at the party, in the TV story, or both? Drawn at the party. | STATE Q2; P16 |
| O35 | How does Squatch take the pink slip without Mops seeing the paw print? | STATE Q3; S46 |
| O36 | At boarding, where are the Moon Pie crate and the Guardian Box? | STATE Q4; S50; O10 |
| O37 | Specific Employee of the Month captions are still unwritten. Gag kinds are R62. The more-photos / move-on choice is Superseded by R62. The keepsake points amount is still open. | R55, R57, R62 |
| O38 | Home wardrobe v4 (plain blue jacket spare) needs Brian's yes before it is APPROVED. APPROVED v3 stays the reference until then. | R45; W34 |
| O39 | The "Find someone who…" picture card (the pair hunt is already dropped). | R60(a) |
| O40 | Snack-table hide window: the 4 seconds are a placeholder. | R60(d) |
| O41 | Photo-corner bonus if Squatch is in the Polaroid: the amount is open. | R60(c) |

---

## 10. Earlier entries, kept word for word
From the 2026-11-08 snapshot of the Drive master. The full snapshot is now `docs/old/history/DECISIONS-2026-11-08.md` (it used to be `docs/old/project/DECISIONS-2026-11-08.md`). Every line below is the original entry. Nothing was deleted. **Decided** means it still stands, and the code points at the same decision in the tables above. **Superseded** means a later decision replaced it. The later decision is named.

- 2026-11-05 (Brian, in Grok): the repository is private. Why: Brian had not known it was public.
  **Decided.** Same as W28.

- 2026-11-05 (Brian, in Grok): the revised kitchen canon (Mops cooks, Squatch washes) applies only to the kitchen sequence; every other chapter stays on the original story spine, with conflicts flagged, not resolved by the agent.
  **Superseded** by W27 (the Nov 2 spine is not binding) and by the Chapter 1 replot starting at S2. The kitchen drawing itself stays (the next entry, R28).

- 2026-11-05 (Brian, in Grok): kitchen layout is composition C (separate wash and cook stations, smaller serving window, Mops runs between both jobs as the joke).
  **Decided.** Same as R28.

- 2026-11-06 (Brian, in Claude Code): the game's truth is reviewed from the GitHub repo, not from the Grok chat. The Grok threads are archived once into `docs/grok-archive/` and not re-read.
  **Decided.** Same as W8.

- 2026-11-06 (Brian): no browser-driven playtests by Claude; tests cover regressions, Brian's recordings cover how it plays. Why: compute cost.
  **Decided.** Same as W7.

- 2026-11-06 (Brian): cut work early only at high risk of running out of plan credit; otherwise let agents finish.
  **Decided.** Made specific by the 2026-11-07 line below and by W30 (75% shared pool, 90% Fable).

- 2026-11-06 (Brian): D1, Option A. The readable (Prettier-formatted) copy of the shipped build becomes the real source code, with a build step that writes `index.html`; the dead engine is deleted and the file split and renamed over time. Why: the recovered TypeScript is the old engine, so no readable source of the live game exists; A keeps every fix from PRs #1 to #5, costs about one task, and is the only option where a reviewer can read a diff.
  **Decided.** Same as K1. Phases 0–3 and the Chapter 1 pass are merged.

- 2026-11-06 (Brian): merge Phase 0 to `main` (PR #7, merge commit 21b9c4a), which deploys the rebuilt `index.html`. Why: the build is proven the same program as the live one, and Phase 1 builds on the test harness and readable source.
  **Decided.** Done. Same history as K1.

- 2026-11-06 (Brian): chip rule. The first time a mechanic appears, the goal chip names the step; after that it names only the goal, so discovery stays with the player. Why: Brian asked whether the goal line ruins discovery; it says what, not how.
  **Decided.** Same as K2.

- 2026-11-06 (Brian): the counter action on first visit is ASK · for work (was ORDER · counter); the captor joke is "Counter's closed. Lockup's open." (was "Pen's open"; his son did not know the word pen, and LOCKUP is on the card).
  **Decided.** Same as K3.

- 2026-11-07 (Brian): merge Phase 1 (PR #8) to `main` once the confirmation run is green. It was; merged 2026-11-07 morning.
  **Decided.** Done.

- 2026-11-06 (Brian): project folder is this Wyttmab Drive folder; the repo holds the code and the working docs; this folder holds STATE, DECISIONS, source snapshots and transcripts.
  **Superseded** by W29, then by W11. The live copies are this file and `docs/STATE.md`. The dated snapshots' full text is in `docs/old/history/`. Short pointers stay in `docs/old/project/`.

- 2026-11-07 (Brian): remove the YOU: SQUATCH / YOU: MOPS tag. Why: the switch card and the chip prefix already say who the player is; the tag added clutter and overlapped the sound icon.
  **Decided.** Same as K4.

- 2026-11-07 (Brian): reuse the opening zoom-in card technique to teach key ideas; shrink the Reset section button and show it full-size only when the player is stuck; one HUD zone rule with an overlap test.
  The zoom-in part is **Decided** (K19). The HUD zone rule is **Decided**. "Show Reset full-size only when the player is stuck" is **Superseded** by the next entry and by K7: Reset stays small, and a hint shows instead.

- 2026-11-07 (Brian): Reset is a small hold-to-use ↺ at the top next to the chapter tag, never enlarged. A stuck player gets a hint instead: after 60 seconds of play with no progress (no new beat, room, item or capture; time under a card or bubble not counted) the goal chip shows the method line. Why: reset should be rare; hints keep discovery.
  **Decided** for the game that is on `main` (K7). Whether that idle hint stays in chapters that are not being rebuilt is Open (O32), because K8 says the rebuilt first scenes have no idle auto-hints.

- 2026-11-07 (Brian): in scenes where both characters are playable, the existing top-right picture button becomes two face circles (active bright, other dim) and is the switch control; it does not appear elsewhere. The text YOU tag is removed. Why: one control answers "who am I" and "how do I switch".
  **Superseded** by K6 (E15). Both faces always show. The one you cannot switch to is greyed. The YOU tag stays removed (K4).

- 2026-11-07 (Brian, refined by Claude): face circles replace the YOU tag. The active character's face is always shown in a small circle at the top right, same spot in every scene. The second face appears beside it, dim, only when a switch is possible, and glows (with the chip saying so) when switching is the next step. Tapping a face switches. Brian's own version kept both faces always on, grayed when a switch is not possible; the trimmed version is the direction unless Brian objects.
  **Superseded** by K6. Brian's own version is the decision: both faces always on, greyed when a switch is not possible.

- 2026-11-07 (Brian): merge Phase 2 (PR #9) once the wording commit is green; then run Phase 3 without him present. Phase 3 scope approved: D1, one capture rule everywhere (the Chapter 2 rule: sighting, security, lockup card with the cause, restart the section from its checkpoint, coins kept) replaces Chapter 1's star-loss nudge; D11, tap to walk, with the rule that a tap advances a bubble or card when one is up and walks only when nothing is up, plus a one-time hint; new on-screen lines that follow the approved shapes (cause lines, chip rule, VERB · thing) may merge while he is away, logged in a lines file for him to edit after. Held: the nine story departures, the Chapter 1, 3 and 4 switch why-lines, and any difficulty change. Credit rule: stop launching work if the cheaper pool passes 75% or Fable passes 85%, and leave the branch with STATE.md saying where it stopped.
  Phases 2 and 3 are merged. The capture rule is **Decided** (K9). Tap to walk is **Decided** (K11). New lines still go through a lines file (W4). "Fable passes 85%" is **Superseded** by the next entry and by W30 (90%). "Held: the nine story departures" for a ruling on each one is **Superseded** by W27, and the Chapter 1 story after that night is the replot starting at S2. Chapter 1 switch why-lines shipped in PR #11. Chapters 3 and 4 switch why-lines are L27 and still need Brian's yes.

- 2026-11-07 (Brian): the Fable stop line is 90%, not 85%, for both game sessions; the all-models line stays 75%.
  **Decided.** Same as W30.

- 2026-11-07 (Brian, with Claude's two adjustments): D15, Chapter 1 night out (O3 to O6) gets a purpose and a visible hazard. The vent shows air ripples always; near it a tuft of Squatch's fur drifts toward it as the warning; only lingering in the pull sends fur in and sounds the alarm. A brochure table in the lobby holds the notice that robot janitors will replace human and animal janitors; reaching it means crossing the vent's pull or a sightline, so staying unseen is the puzzle and the brochure is the reward. Capture is a consequence, not a required step: lockup card with the cause ("Fur went into the vent. Alarm.") and restart the night under the one-capture rule. Chip: "find out what's going on out there", then "read the brochure". This makes the night out Chapter 1's "Until one day" and the robot arrival and Mars brochure "Because of that", resolving the audit's doubled beat 3 and the "robots named before shown" problem. Queued after Phase 3 as its own task unless Brian pulls it forward.
  **Superseded** by S11 and S12. The party replaces the notice sneak and the inspection. The live game on `main` still has this D15 night out from PR #11 until the Chapter 1 rebuild.

- 2026-11-07 (Brian): D16, Chapter 3 (Phobos) gets a "sense pass" after Phase 3: a one-page seven-beat skeleton for the chapter inside the game's beat 5, with a cause for each oddity Brian hit on his first play (why the ship stops at Phobos, who Zip is and why he goes to Mars daily, what the temple is, why the rovers, what the lockup is there, how they leave), then one agent pass changing only text, labels and cards, chips following; mechanics and scene geometry stay. Phobos should be named as the little moon by Mars on arrival. Chapter 4 gets the same pass after. Why: the Nov 2 spine had Chapters 3 and 4 as outlines, so the agents built scenes with no setups. Queued after Phase 3 and D15.
  Phobos named as the little moon by Mars is **Decided** (L15). "A one-page skeleton for Brian first" is **Superseded** by L16: start the sense pass with no outline first. New words still go through a lines file.

- 2026-11-07 (Brian): D17, hands-on mini-moments for repeated chores: SCRUB · dish becomes a few seconds of rubbing (stick wiggle or drag on the dish) while the plate visibly cleans; MOP · pot the same for Mops; possibly the Chapter 3 mirrors. Short, cannot be failed, satisfying. The old engine's dish mini-game (deleted in Phase 2, in git history before 6f6a912) is reference only. Queued after Phase 3 with D15 and D16.
  **Superseded** by L6. The player may put a dish away dirty, and Gloop gets upset. It is funny, not a fail. The words are still owed.

- 2026-11-07 (Brian): Rusty's sight at the gas stop now feels too narrow (he only catches Squatch right in front of him; on Nov 4 the complaint was the opposite). Rule: the drawn cone must be exactly the area that detects, with a test (same idea as ring equals trigger). Width is Brian's feel call after playing; widening is a difficulty change and waits for his yes. Goes with the capture-rule work.
  **Decided.** Same as L12. The width stays until Brian replays. The drawn cone equals the area that catches.

- 2026-11-07 (Brian): D18, travel scenes between chapters, with optional mini-games. Each leg gets a ship-window scene (the planet behind shrinking, the next growing) and one card saying where they are going and why; this is the missing "Every day" beat in Chapters 2 to 4 and sets up each arrival (Phobos named as the moon by Mars). Super-low-code mini-games in transit (tic-tac-toe first, Connect 4 later), played by Mops against the Ganitor robot with Mops lines so they carry a character beat; always skippable, at most one per leg. Queued after Phase 3 with D15 to D17; the travel card alone is the cheapest piece if pulled forward.
  **Decided.** Same as L23. This entry already includes both the travel cards and the optional mini-games. L22's "card only" reading is the line that was superseded. Which game, and how long, is Open (O19).

- 2026-11-07 (open, for Brian): on phones the HUD (where / goal / who) is a 126 px bar above the picture so nothing covers the game; the picture therefore starts lower than "at the very top". Keep the bar, or overlay a translucent HUD on the picture instead? Phase 3 shipped the bar.
  **Superseded** by K14 (E24). On phones the HUD stays a bar above the picture.

- 2026-11-07 (Brian): the Nov 2 spine is not binding; it was a first pass. Departures are judged only by consistency with the core (the armature, hiding versus being seen, and the seven beats clear and in order). Claude settles them by that test; Brian does not need to rule on each. "Ready for play: Chapter N" from now on means everything discussed about that chapter is in, with a short list of what is not. Work goes chapter by chapter, Chapter 1 first.
  **Decided.** Same as W27.

- 2026-11-07 (Claude, by that test): keep the "Everybody has somebody / You have me" lines; fix the order so "A WOOKIE!" is explained before shouted and the slip peeks do not name the code before Mops does; the toy rocket stays; the Chapter 2 flashback that shows the player Mops wrote the Guardians note is core and goes into the Chapter 2 pass.
  The heart lines and the order fixes are **Decided** (S20). The toy rocket stays. The Chapter 2 flashback being core is **Decided** (L1). Where it sits, now that the Guardians flashback is at Chapter 1 bedtime (S37), is Open (O18).

- 2026-11-07 (Brian, Chapter 1 pass review): clicking a face is the way to switch on a computer; no keyboard key needed. The "ROBOTICS DELEGATION!" banner in the door-crack view stays. No teaching card for the vent. The fur tuft is made bigger and shown earlier so it works as a warning. The S3 PA line is fixed so it cannot report fur after a clean night.
  **Decided.** Same as K4, S20 and K19.

- 2026-11-08 (Brian): wait for the weekly credit reset (Thursday 2026-11-13, about 11:00 PT) before the Chapter 2 pass; the 75% shared-pool line stays. Cursor's allowance returns 2026-11-08 and may be used for bulk building in the meantime.
  **Superseded** in part by K20. Brian OK'd the room-walk fix (P2) and the hoof-stamp line cut (P3) on 2026-11-08. What "Nov 13" means now is Open (O20).

- 2026-11-07 (Brian): the "GHOST BONUS +250" award is named by what clears it. Brian: "We have no idea what ghost bonus is, and I don't think it's clear to the player either," then "Oh, it's the difference between being spotted versus being caught." Only a catch clears it, so it reads "Never caught! +250" with a reason line, and every +100 award says what it was for. Whether the bonus exists at all is part of the open stars decision D2.
  The rename is **Decided**. "Whether the bonus exists is open" is **Superseded** by K17: keep the stars and "Never caught! +250". The hidden +100 awards versus the words "points for finds" is still Open (O25).

---

## 11. Decisions recorded on main on 2026-11-09
These lines were added to the 2026-11-08 snapshot (now `docs/old/history/DECISIONS-2026-11-08.md`) after this log was first copied. They are kept here word for word. Nothing was deleted from that snapshot.

- 2026-11-09 (Brian): office cutscene, NEEDS BRIAN. Isfred: "Send in Mops for his Employee of the Month photo." Robot: "Mops isn't here." Isfred: "Not here? He can't live off the station!" Robot: "He was replaced by the new robot shipment." Isfred: "I never ordered a replacement! Get me the security tapes."
  **In the game** (PR #19). The words are still marked NEEDS BRIAN in `docs/CH1-CARTOON-LINES.md`. He said yes to merge before the wording pass was finished.

- 2026-11-09 (Brian): R54. Office cutscene dialogue (Brian t255/t256, shortened) — five lines above; Isfred no longer jumps straight to the tapes.
  **Decided** as the shape of the scene. Same wording note as the line above.

- 2026-11-09 (Brian): R55. Hallway approved; the first walk to the loading bay is a cutscene; the hallway is interactive only on the walk home; the Employee of the Month wall is a swipeable gallery of funny Mops photos. Approved with R51 and R53. The room and the gallery are not built yet. The photo gags are still being picked. Layout, when it is built: party hall exit in the left end wall, loading bay exit in the right end wall, Employee of the Month photo wall centered on the back wall, manager office door on the front wall opposite the photos, locked with a code keypad until the code puzzle opens it, and no door to home.
  **Decided.** Not built yet.

- 2026-11-09: The Chapter 1 party is in the game from S11, S13, S14, S15, S18, S20 as amended by R49, S33, S61, S62, R49, R52, C12, C15, and P16. Squatch goes alone. Mops is not there. No robots. Isfred announces the delegation alone. "You have me" is not said there. The Cool hat timer stays 120 seconds.
  **Decided.** On `main` as PR #20.

- 2026-11-09 (Brian): R58. A guest kid lets a balloon go. Squatch can jump and grab it. The jump shows his furry legs and only the kid reacts. Giving the balloon back is silent and the disguise stays. Keeping it makes the kid yell "Scary Wookiee!" and starts the FUR alarm and the walk home. Never jumping lets the balloon reach the ceiling and the kid looks sad.
  **Decided.** In the party build.

- 2026-11-09 (Brian): R59. When the balloon slips, the kid gasps with a big ! and points up. The balloon rises slowly with a wobble and takes about 6 seconds to reach the ceiling. It glows softly while it can be grabbed, and one jump in reach grabs it. No words.
  **Decided.** The 6 seconds were already approved.

- 2026-11-09 (Brian): R61. After the party, the balloon stays in the party hall for every later Chapter 1 hall scene. If Squatch missed it, it stays on the ceiling. If he returned it or kept it, it is tied to the plant near the kid, because he does not take it home. The state is kept in the save. The last time he is in the hall, it pops once with a small "POP!" and a soft pop. Nobody reacts and play does not stop.
  **Decided.** In the party build. The word "POP!" is still marked NEEDS BRIAN in the lines file.

- 2026-11-09 2:58 PM PT (Brian): yes to merge the Chapter 1 redesign (PR #19) and the party (PR #20). His words: "if we should just go for that right now, prior to me finishing reviewing the contract script, I'd say that's totally fine, we should go for it." Posted on both pull requests by Squatchbot on his behalf. PR #19 merged to main as aed0c4f41ef7ac4ac7c6a055dafe9ebc54beb65a. PR #20 merged to main as e0e16d4ea5b51b419dcc83c9d676761647018641.
  **Decided.**

- 2026-11-09 2:59 PM PT (Brian): PHOTO_BONUS is 25 and SNACK_LOOK_SECONDS is 4. His words: "I'm okay with the two placeholder numbers if you've thought through them." The photo points are not drawn on screen. BALLOON_GRAB_SECONDS (6) was already approved (R59).
  **Decided.**

- 2026-11-09 (Brian): R60. The octopus tourist is over-snacked. His line is "*hic* Fellow tourist!" (NEEDS BRIAN). One hug tugs the hat. A second hug knocks the disguise off. A photo corner prints a Polaroid. If Squatch is in it he gets 25 points. The third snack spills the table. Guests look away for 4 seconds, then turn back. The pair hunt is not built.
  **Decided** as the scene. The octopus line is still marked NEEDS BRIAN.

- 2026-11-10 (Brian, in chat, 6:24 AM ET): "Yes, merge PRs #17 and #18."
  **Decided.** PR #18 is on `main` as `1e897aa`. PR #17 is on `main` as `bc0759f`.
- 2026-11-10 (Brian, 8:14 AM ET): "Make a separate test link so I can play it before merging."
  **Decided.** The slice stays unmerged. A separate site may serve the branch. The live site at space-snack-quest.onrender.com stays on main. Preview saves use ssq-pr21- keys.
- 2026-11-10: Slice A of the party-first Chapter 1 is a pull request and is not merged. Beat 2 is a stand-in (Mops leaves; the song is later). The party timer is 3 minutes, inside the 3 to 4 minutes Brian approved, and "Cool hat!" is the stand-in for how that time ends. The bar cut-in is the shared piece from CUT-IN-SPEC. Snack grabs do not add points. The spare blue jacket and the horns are not in the dress-up set.

- 2026-11-11 (playtest 6): The picture jumped about 30 pixels when NEXT appeared. The desktop controls row now keeps a 104 pixel slot for that button, same as the bug-fix branch.
  **In this unmerged slice.** No new words.

- 2026-11-11 (playtest 6): Isfred's party line sat on the office monitor. The monitor is the screen at about x 94–206, y 72–160. The bubble anchor for a party line from him moved from (210, 215) to (300, 330), so the box starts below that screen, next to his nameplate.
  **In this unmerged slice.** The words are unchanged.

- 2026-11-11 (Brian, 8:49 AM ET): R64. The night mailbox robot, the same one as on the bug-fix branch, looks down for 2 seconds, turns for 0.3 seconds without catching, then looks at the back wall for 4 seconds. The cone stays 210 / 0.42 / 70. His words: "Robot: make him look down 2 seconds, then at the back wall 4 seconds, and you dash while he's turned." R65: keep him a bit smaller, like now, at home and in the other rooms. "Size: keep him a bit smaller like now." The party drawing is R66. There he is a little taller than a guest and still shorter than he is at home. This is not a yes to merge.
  **Decided.**

- 2026-11-11 (this polish session only): W7 normally says assistants do not drive the game. Brian asked for headless play of each screen, so screenshots and scripted taps are allowed for this loop. W7 itself is unchanged for every other session.
  **Decided** for this session. Not a yes to merge.

- 2026-11-11: R66. Party scale, under Brian's "if there's any other solutions, go for it." Party guests are drawn at 1.3 instead of 1.6, and Squatch at the party is drawn at 2 instead of 1.6, so he is a little taller than a guest and still shorter than he is at home. Guests are spaced so their bodies do not stack. The kid stays smaller. Hiding and collision still use his feet. Other rooms are unchanged.
  **Superseded** by R67. Making him taller than a guest fought C10. The overlap was the problem, not his size.

- 2026-11-11: R68. Day 1 of the walkthrough is in this unmerged slice, from the song through bedtime. After bedtime, the existing Day 2 (lunch through the tally) still plays. Open-question defaults, listed and not a merge yes: Q4 stays the approved 3-minute "Cool hat!" because that timer was already decided; the octopus chase is in the party as well. Q5 lunch stays where the current Day 2 puts it until the Day 2 branch. Q17 the 3-minute clock pauses during the dance and the karaoke. Q20 the party keeps the standard tourist disguise (B). Q19 the dim lights are looks only. Tuning to confirm: dance is 30 arrows over 30 seconds, 10 points a hit, hit window 42px; karaoke is 15 seconds, 5 points a howl, cap 50; octopus speed 90 (Squatch walks at 190), notices within 150px, catches within 48px, gives up at 10 seconds; the guard walks at 120, catches within 36px, and leaves after the hide. Photo countdown is 6 seconds and still uses the approved 25-point SNAP.
  **In this unmerged slice.** Not a yes to merge.

- 2026-11-11: R67. Party scale, correcting R66. Brian's standing rule (C10, 2026-11-08) is that adults are clearly taller than Squatch and Mops, because Squatch is a kid. On 2026-11-11 he said "keep him a bit smaller like now." His "no good option" note was about guests overlapping, not about making Squatch bigger. At the party Squatch uses the normal hall scale (he = 1.6). Guests are drawn at 1.8, a bit taller than the old 1.6, so he is about 60% of a guest. The kid stays smaller. Guests are spaced. Hiding and collision still use feet. There is no spr_a_* sprite sheet in this repo, so the guests are drawn in the same thick-outline style. This is not a yes to merge.
  **Superseded** for the adult height by the 2026-11-12 ruler below. Home is still `wl`. Squatch stays the shorter one.

- 2026-11-12: Adult height was one number, `ADULT_PX`, from the hall door only.
  **Superseded** the same day by Brian t336u: each room uses 85% of its own door. See the next entry.

- 2026-11-12: Per-room door scaling (Brian t336u; since 2026-11-24 the hall itself is the exception, 40% bigger: see "Party round four"). An adult's head is 85% of the main door in the room he is standing in, measured on the 640-tall canvas. The hall opening and the loading-bay opening are 77.9px, so that adult head is 66.2px. The office door slab and the same door in the hallway are 123.4px, so that adult head is 104.9px. Home's right-wall opening is 99.5px, so that adult head is 84.5px. A room with no door keeps the hall height. Squatch's head is 80% of the adult in that same room. Alien scale is the room's adult height divided by 84. Qt scale is that height divided by 50. The old single `ADULT_PX` remains the hall value for rooms that are not one of these doors. No new words. Not a yes to merge.
  **Decided.** Not a yes to merge.

- 2026-11-12: K10 at the party. The FUR alarm still says the existing "FUR! Security!" lines. A guest runs to the wall alarm, then two guards come in from the hallway door and search with the same cone as the standing sight (210 long, 0.42 half-angle, 70px at the feet). If that sight catches Squatch, it calls `capture('s6')` ("A tourist saw Squatch in the hall. Security caught him."). If he hides or reaches the home door, the guard walks to that door and the existing home search starts half a second later. There is no 9-second countdown. No new on-screen words.
  **Decided.** Not a yes to merge.

- 2026-11-12: R84. Brian locked the manager's office as `docs/locked-rooms/office-room-empty-v2.png` (`office_room_v2.py`). The hallway's office door is on the office's back wall, and Squatch's entry is that door (canvas 480, 286). The desk, the computer, and the signs (NO FUR, HANG IN THERE, IN, OUT, Isfred Bar Neshuman) are in the picture. The game does not draw a second MANAGER terminal on top.
  **Decided.** Not a yes to merge.

- 2026-11-11 (playtest 6): Squatch looks about two thirds as tall as a guest. Not changed. A guest is drawn by Qt at scale 1.6: about 64 units from feet to the top of the head, so about 102 pixels. Squatch in the hall is drawn by Re at he = 1.6: about 45 units, so about 72 pixels, which is about 70% of the guest. The closet uses wl = 3 instead, which is why he looks larger at home. Matching the guest would mean drawing him at about 2.3 in the party only (102 / 45). Hiding, collision, and the plant hide use his feet and his pose, not the picture's height, so a bigger picture would not change those. It would make him overlap nearby guests and the plant visually, and his bubble would sit higher. Recommendation: leave it until Brian says yes. If he wants them to match, change only the party drawing to 2.3, not the global he.
  **Superseded** by R65 and R67. R65 does not enlarge him at home or in the other rooms. R66 (him taller than a guest) is superseded. R67 draws guests at 1.8 and Squatch at the normal hall scale.

- 2026-11-11 (playtest 6): "PUT ON · tourist disguise" turned the costume on in one frame, and the dress-up screen popped in the same way. Both now fade through black in about 0.4 seconds. No new words.
  **In this unmerged slice.**

- 2026-11-11: R84. Chapter 1 beats 22–61 use the walkthrough defaults where a question was still open. Mops is in the hallway at lunch. The calendar shows delivery morning, and the PA still says the ship is here. A robot calls Isfred away because a crate is damaged in the mail room. Squatch posts the yellow copy, then a cutscene sends the pink sheet into the vent. He hides that pink slip in the Guardian Box after the office. On pickup day the Moon Pie crate is already loaded and is not in the scanner shot. The hallway door is the north end of the party hall's right wall. Mops walks him to the snack bar, then goes back to work, and Squatch walks home. He waits at the vent as the L2 ball. The office code on the pink slip is 4723, the same digits already drawn on the old keypad. The keepsake gives no points until Brian picks a number. Lunch guests use the night robot's cone (210, 0.42, 70) so no new sight number was invented. Joe's warm theme is still the generated stand-in. None of this is a yes to merge.
  **Decided** as the build default. The words and the open questions stay pending for Brian. R67–R83 are already numbered in the 2026-11-10 planning record (the walkthrough and the decisions copy). This row does not reuse those numbers.

- 2026-11-16: Process checks (Brian t341), borrowed as ideas, not files. Every report uses the handover note (`docs/HANDOVER-TEMPLATE.md`): PASSED, FAILED, NOT ASSESSED, GUESSED, and "Not yet played by a person" unless a QA log covers that commit. Anything not checked is NOT ASSESSED, never passed. Long docs carry a section index, and agents read one section. `tests/canvas-text.mjs` records on-screen canvas words at the iPad sizes and flags type under 14 CSS px, contrast under 3:1, text off the canvas, and overlap over 25% of the smaller box. It does not change words, sizes, or layout; known failures wait for Brian. `docs/TUNING-PINS.json` pins the approved numbers, including the 85% door rule and Squatch at 80% of an adult. Changing a pin needs Brian's written yes in the PR.
  **Decided.** Not a yes to merge.

- 2026-11-16: A catch at the party stays in the party. Brian, 2026-11-14: after the jail card, set Squatch back a little and let play carry on. No guard walks into the bedroom. Scene QA restarts in the hall, the search is cleared, and a Chapter 1 scene with no checkpoint no longer restores the old opening.
  **Superseded** by K29 (Nov 16, 12:50 PM PT): the lockup card, then restart the current scene. The code from that commit stays until Brian approves the scene split. Not a yes to merge.

- 2026-11-16: Decisions recorded, not built, so this pull request can merge sooner. Brian, Nov 16, 4:02 PM PT: the party splits into the peek, the sneak to the plant, the party extras, the alarm, and the run home. The alarm gets a real security catch. Same minute: everyone who can see Squatch gets a faint dashed cone that fills yellow when he is inside. That supersedes the Nov 11 cone rule and C14. 4:03 PM PT: party extras are the robot dance only, and there is no bouquet toss. 4:04 PM PT: hearts stop at "...That's his paw" and come back after the apology. 4:05 PM PT: the opening room stays quiet until the goodbye song, and Joe's theme plays at the title and at heart moments. Same minute: the homework desk is "DO · homework", no spoken line, then "That evening…". Build order after this pull request: (1) the party split, the catch rule, the security catch, and the robot dance; (2) the cones and Mops's hearts; (3) the music and the homework desk. Not a yes to merge.
- 2026-11-16: Text minimum (Brian t342). Canvas words that failed the iPad check are 17px on the 960-wide picture, which is at least 14 CSS px on an iPad upright and sideways. The words are unchanged. The gift card, the photo labels, the party banner, the Coming Soon poster, the speaker-name chip, and the tape REC plate were enlarged in code. The locked room pictures were not redrawn. REC is white on a dark red plate so it clears 3:1 (the monitor behind it is light gray, so a brighter red on that gray would have been harder to read).
  **Decided.** Not a yes to merge.

- 2026-11-16: A party catch steps toward the open floor, not into the plant pot. The old step toward the middle of the room could leave him standing in the pot. He still stays in the party.
  **Decided.** Not a yes to merge.

- 2026-11-16: `docs/OPEN-ASKS.md` (now `docs/old/OPEN-ASKS.md`; replaced 2026-11-23 by `docs/BRIAN-ASKS-OPEN.md`) is the one review list. Each unbuilt ask says whether it is for the whole game or one chapter, and whether it is approved, awaiting yes, or built in a pull request. The older sections of that file stay as history. Brian, Nov 11 (t332): only guards and robots show vision cones; a guest shows "?" then "!". That supersedes the Nov 14 dashed cone on everyone. The party buttons SNAG, SUCK, STAND, HUG and SNAP are approved to become things you walk into (Nov 16, 11:50 AM PT) and are not built in this pull request. iPad pictures of pull requests 57 and 58 are in `docs/audit-shots/final/beat1/`. Security seeing through a disguise, the three disguise levels, the alarm ladder, and losing one piece (PR #35, R100, R102, R103) are approved and not built. The bigger heart cone is built in PR #35 and not merged. Brian, Nov 16, 12:50 PM PT (K29): every catch, in every chapter, present and future, shows the lockup card, then restarts the current scene. Long scenes such as the party are split into shorter ones. That supersedes the Nov 13 bedroom release (PR #38) and the Nov 14 "set back a little where he was caught" rule, including what commit cb87185 built. The catch code stays until Brian approves the scene split. On localhost, `?beat=day2` opens Day 2 at the gift in the closet. The live site ignores it. This branch is rebased onto main after pull requests 58 and 57 and is not merged. Playtest 12: canvas words are at least 14 CSS px at 1024×768 and 768×1024. A bubble is not drawn when its speaker is off screen. Squatch and Mops do not stand inside each other at the lunch handoff or the snack hall. The party still auto-runs home after "FUR! Security!"; a security catch there waits on the party split.
  **Decided.** Not a yes to merge.
