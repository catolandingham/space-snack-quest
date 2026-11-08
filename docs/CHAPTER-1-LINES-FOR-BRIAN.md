# Chapter 1 lines for Brian

Every new or changed thing the player reads in the Chapter 1 pass (branch `chapter-1-pass`), listed so you can say yes or change the words before the merge. Same format as the Phase 1 to 3 files: each row gives where it shows, the words in the game now, and one other way to say it.

To change a line: edit the "In the game now" words in this file and say so in the pull request. An agent will copy your words into `src/game/` and the tests (the tests read this file).

Row numbers: the goal chips and the action labels are numbered 18.2xx, because the chip and label tests read every 18.x row; the other rows are 25.x (the night out), 26.x (switch cards) and 27.x (order fixes).

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
| 25.7 | O4, the notice close up, bottom line (over a drawn fur tuft and a drawn person, each crossed out in red) | No more fur. No more people. | No fur. No janitors. |
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
