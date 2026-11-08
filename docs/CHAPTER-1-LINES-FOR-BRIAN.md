# Chapter 1 lines for Brian

Every new or changed thing the player reads in the Chapter 1 pass (branch `chapter-1-pass`), listed so you can say yes or change the words before the merge. Same format as the Phase 1 to 3 files: each row gives where it shows, the words in the game now, and one other way to say it.

To change a line: edit the "In the game now" words in this file and say so in the pull request. An agent will copy your words into `src/game/` and the tests (the tests read this file).

Row numbers: the goal chips and the action labels are numbered 18.2xx, because the chip and label tests read every 18.x row; the other rows are 25.x (the night out), 26.x (switch cards) and 27.x (order fixes).

## What Chapter 1 now has

Read this before you play. It is the short version; the tables further down have every word.

- **The night out is a sneak with a goal.** After the peek through the door crack ("...Everybody has somebody."), Squatch sneaks into the lobby and the chip says "Squatch: find out what's going on out there". A brochure table on the right holds a sign labelled NOTICE. When he gets close enough to make it out, the chip changes to "Squatch: read the notice". The notice says "ROBOT JANITORS COMING." and "They take every janitor's job.", with a drawn robot holding a mop. He whispers "Robot janitors? Mops is a janitor." and takes it home.
- **The vent is a hazard you can see before it bites.** A grille in the middle of the lobby floor has a pale blue circle round it and ripples running in toward it, all the time. When Squatch comes near the circle, a big tuft of his fur lifts off him; inside the circle it drifts toward the grille. If he keeps walking, nothing happens. If he stays in the circle for a second and a half, the fur goes in, "FUR IN THE VENT!" sounds and security comes.
- **Every way to the table crosses the vent or someone's sight.** The quickest way is straight up through the vent's circle, in the gap between the man in the suit's cone and the snack clerk's cone, without stopping. The other ways cross the kid's, the man in the suit's or the clerk's cone, which you can time. A snack counter now stands on the right wall, so there is no way round the back.
- **Getting caught follows the one capture rule.** Seen, or the vent alarm: security comes, and HIDE! runs Squatch back into the closet ("They lost you."), where he can sneak out again. If security reaches him first, the LOCKUP card says why (for the vent: "Fur went into the vent. Alarm.") and the night starts over at the closet door. Getting caught is never a step you have to take.
- **What he brings back is used.** Back home, Security's voice at the door says "Inspection! Closet next." (the big inspection Mops mentioned). In O6 Mops sees the notice in his hand: "You went OUT? Tonight?", "Everybody out there has somebody.", "You have me.", "But look. Robot janitors are coming.", "A notice can't mop a floor." Next morning, when the robot delivery rolls down the ramp, Squatch whispers "Robot janitors. Like the notice said."
- **Nobody says "robot" before the notice, and nobody says "Wookie" before the flashback.** The lobby watchers shout the spine's words ("DADDY! A BIG DOG!", "Was that... FUR?") and the clerk shouts "Fur! Near my snacks!". The slip peeks in S6 and S7 no longer mention the hangar code ("Mops's torn slip. Just paperwork."); Mops names it first in S8.
- **Every switch says why.** In S9, S10 and S11 every switch between Squatch and Mops, by a face tap or by the story, shows the switch card with a reason, as Chapter 2 does. The one exception is the very first tap on Mops's face in S9, which the zoom-in card has just taught.
- **The story beats.** The night out is now Chapter 1's "Until one day": Squatch learns that robot janitors are coming. The robot delivery (S3) and the Mars brochure (S5) follow as "Because of that".
- **A test plays the whole chapter.** `tests/ch1-playthrough.mjs` plays from `?ch=1` to the ship with keys, crosses the vent twice without stopping, and is never caught.

## What Chapter 1 still does not have

- **A key for switching.** On a computer you switch by clicking a face. The play-through test clicks the faces with the mouse for that reason; everything else in it is keys.
- **Tested numbers for the vent.** The circle reaches 80 pixels out from the grille, and the fur goes in after 1.5 seconds inside. Walking straight through takes about one second. These are first guesses; say if the circle should be bigger or smaller, or the fur quicker or slower.
- **The old, easier lobby.** The kid's and the clerk's cones used to see nothing, because their own bodies blocked their sight lines, so only the man in the suit ever saw Squatch. Now each sees what its cone shows. Cone sizes and sweeps did not change, but the lobby is harder than the old chase because of it. The gap in the vent is narrow, and once in a while the man in the suit's cone touches it at the far end of its sweep.
- **A card for restarts.** After a catch or a shoo in S9 or S11, the section starts over as Squatch with the LOCKUP card (or Mops's lines), and no switch card, the same as Reset section in Chapter 2.
- **A stall hint in the lobby.** If a player stands still for a minute there, the chip does not change to a "how to" line yet.
- **A sure S3 report.** "Delegation report: FUR in the air scrubbers." shows only if Squatch walked past the closet's floor vent; otherwise the PA says "FUR spotted in the lobby." That is as before, and after a clean night out (nobody saw him) the second line can sound wrong.
- **Answers to the 2026-11-07 phone playtest.** `docs/playtests/2026-11-07-brian-phone-playtest-ch1.md` is not in the repo, so nothing here answers those notes directly.

## D15. The night out has a purpose and a hazard you can see

### Goal chips

| # | When it shows | In the game now | Another way to say it |
| --- | --- | --- | --- |
| 18.201 | Chapter 1, `O4:out`: the lobby, before Squatch has come near the brochure table | Squatch: find out what's going on out there | Squatch: see what's happening out there |
| 18.202 | Chapter 1, `O4:table`: the lobby, once Squatch is close enough to see the table (about a third of the room away) | Squatch: read the notice | Squatch: read the notice on the table |
| 18.203 | Chapter 1, `O4:home`: the lobby, after he has read the notice | Squatch: sneak back to the closet | Squatch: go home without being seen |

Row 18.5 ("Squatch: run back to the closet!") stays: it now shows only while security is coming, after a sighting or the vent alarm.

### Action labels

| # | Where it shows | In the game now | Another way to say it |
| --- | --- | --- | --- |
| 18.204 | Chapter 1, O4: the notice on the brochure table | READ · notice | READ · sign |
| 18.205 | Chapter 1, O4: the closet door, after the notice is read | ENTER · closet | GO IN · closet |

### Words on screen

| # | Where it shows | In the game now | Another way to say it |
| --- | --- | --- | --- |
| 25.1 | O3, after the peek through the door crack (the spine's line, replacing "Robots? What are they talking about?") | ...Everybody has somebody. | (spine wording, word for word) |
| 25.2 | O4, the kid sees Squatch (the spine's line, replacing "A WOOKIE!") | DADDY! A BIG DOG! | (spine wording) |
| 25.3 | O4, the man in the suit sees Squatch (the spine's line, replacing "A WOOKIE!") | Was that... FUR? | (spine wording) |
| 25.4 | O4, the snack clerk sees Squatch (replacing "A WOOKIE!"; the spine gave this spot to a demo bot, which the game drew as a snack clerk) | Fur! Near my snacks! | FUR DETECTED? (the spine's demo bot line) |
| 25.5 | O4, the label on the sign standing on the brochure table | NOTICE | ROBOT NEWS |
| 25.6 | O4, the notice close up, top line (big red letters over a drawn robot holding a mop) | ROBOT JANITORS COMING. | ROBOTS WILL CLEAN STORMTOP. |
| 25.7 | O4, the notice close up, bottom line, under the drawn robot (Brian, 2026-11-07; was "No more fur. No more people.") | They take every janitor's job. | Every janitor loses their job. |
| 25.8 | O4, Squatch's whisper after reading the notice (the first time anyone says "robot") | Robot janitors? Mops is a janitor. | Robot janitors? But Mops is our janitor. |
| 25.9 | O4, the vent alarm when the fur goes in (the line the hall vent alarm already uses) | FUR IN THE VENT! | (unchanged) |
| 25.10 | LOCKUP card, Chapter 1 lobby: fur went into the vent and security reached Squatch (your wording from the brief) | Fur went into the vent. Alarm. | The vent alarm caught Squatch in the lobby. Security caught him. |
| 25.11 | LOCKUP card, Chapter 1 lobby: the kid saw Squatch and security reached him | A kid saw Squatch in the lobby. Security caught him. | The kid spotted Squatch in the lobby. Security caught him. |
| 25.12 | LOCKUP card, Chapter 1 lobby: the man in the suit saw Squatch | A man in a suit saw Squatch in the lobby. Security caught him. | A visitor saw Squatch in the lobby. Security caught him. |
| 25.13 | LOCKUP card, Chapter 1 lobby: the snack clerk saw Squatch | The snack clerk saw Squatch in the lobby. Security caught him. | The clerk spotted Squatch by the snacks. Security caught him. |
| 25.14 | O5, back in the closet with the notice: Security's voice through the door, with the ear icon (why the bot comes when nobody saw him: Mops said "Big inspection tonight") | Inspection! Closet next. | Inspection. Every room. |
| 25.15 | O6, Squatch's answer to "You went OUT? Tonight?" (the spine's line, replacing "I wanted to see the robots.") | Everybody out there has somebody. | (spine wording) |
| 25.16 | O6, Mops (the spine's line, replacing "Curious gets you caught.") | You have me. | (spine wording) |
| 25.17 | O6, Squatch holds up the notice he took from the table | But look. Robot janitors are coming. | Look what I found. Robot janitors. |
| 25.18 | O6, Mops waves the notice away (his reaction to what Squatch brought back) | A notice can't mop a floor. | Pfft. Paper can't mop. |
| 25.19 | S3, Squatch's whisper when the robot delivery rolls down the ramp, after the PA's "Bleep-Bloop Bots! Floors that mop THEMSELVES!" | Robot janitors. Like the notice said. | The notice was right. |
| 25.20 | O4, the label on the snack counter on the right wall | SNACKS | SNACK BAR |

## Switch cards: every Squatch and Mops switch in Chapter 1 says why

The same card as Chapter 2 (rows 6.1 to 6.7): it fills the picture, its top line is "You are MOPS now." or "You are SQUATCH now.", the second line is the why, and it waits for a tap. The very first switch (Squatch to Mops in S9, by tapping Mops's face) has no card of its own: the zoom-in card (row 24.3, "Tap a face to switch. Then you play that one.") already taught it a moment before. Restarts after a catch or a shoo switch back to Squatch with no card, as Reset section does in Chapter 2.

| # | When it shows | In the game now | Another way to say it |
| --- | --- | --- | --- |
| 26.1 | S9, tapping Mops's face (any time after the first switch) | Mops goes for the slip in the trash. | Mops grabs the slip while the bot looks away. |
| 26.2 | S9, tapping Squatch's face | Squatch sings to bring the bot over. | Squatch calls the bot over with his song. |
| 26.3 | S9 into S10, after Mops grabs the trash half (the game switches back to Squatch) | Mops has one half. Squatch goes for the other half. | One half found. The other half is in the vent. |
| 26.4 | S10, tapping Mops's face | Squatch is too big for the vent. Mops tries it. | Only Mops fits in the vent. |
| 26.5 | S10, tapping Squatch's face while Mops is outside the vent | Only Mops fits in the vent. Squatch waits. | Squatch waits by the vent. |
| 26.6 | S10 into S11, Mops climbs out of the duct with both halves (the game switches back to Squatch) | Mops has the whole code. Now Squatch helps him reach the door. | Mops has the code. Squatch's turn to help. |
| 26.7 | S11, tapping Mops's face | Mops goes to type the code at the door. | Mops heads for the keypad. |
| 26.8 | S11, tapping Squatch's face | Squatch sings to pull the bot off the door. | Squatch lures the bot away from the door. |
| 26.9 | S11, the door opens; right after Squatch says "Door open! Uh oh... a fur scanner." (the game switches back to Squatch) | Squatch has to get past the scanner. | The scanner is Squatch's problem now. |

## Order fixes: nothing is said before the player can understand it

| # | When it shows | In the game now | Another way to say it |
| --- | --- | --- | --- |
| 27.1 | S6 and S7, PEEK at the trash can holding half the torn slip (replaces "Half the torn slip! The hangar code's on it..." and "Not yet. Mops needs me first.", which named the code before Mops does in S8) | Mops's torn slip. Just paperwork. | Half of Mops's slip. Paperwork. |
| 27.2 | S6 and S7, PEEK at the vent holding the other half (unchanged; it names no code) | The other half's down the vent. Way too small for me. | (unchanged) |

"A WOOKIE!" in the lobby and the heart lines in O3 and O6 changed with D15, because the night out rewrote those exact lines: rows 25.1 to 25.4 and 25.15 to 25.16. The word "Wookie" is now first heard in the O7 flashback ("A Wookie tour group came to visit Stormtop."), and the first "WOOKIE!" shout is the deck tourist in S1L, after it.
