# Phase 3 lines for Brian

Every new or changed thing the player reads or sees in Phase 3 (branch `phase-3-fairness-hud`), listed so you can say yes or change it before the merge. Same format as `docs/PHASE-1-LINES-FOR-BRIAN.md` and `docs/PHASE-2-LINES-FOR-BRIAN.md`: each row gives where it shows, the words in the game now, and one other way to say it.

To change a line: edit the "In the game now" words in this file and say so in the pull request. An agent will copy your words into `src/game/` and the tests (the tests read this file).

## T19. One capture rule everywhere (your D1)

Every chapter now works like Chapter 2. Someone sees Squatch, security comes, and he has time to hide. If he hides, security leaves and "They lost you." shows. If security reaches him, the LOCKUP card shows who saw him and where, the captor's joke follows, and the section starts over from its checkpoint. Coins and stars are kept: no catch takes stars away any more (the old "−100 CAUGHT"). A chapter with no catches still earns the +250 ghost bonus.

What changed by chapter:

- **Chapter 1.** The deck guard, the tourist in the hall, the hall alarm and the singing lures used to take 100 stars and move Squatch back. They now end in the LOCKUP card and the section restart. The hall alarm keeps its timing (the bot runs to the alarm, then Squatch has until the end of the run to hide).
- **Chapter 3 and Chapter 4.** A rover, the port bot or the searchlight used to catch Squatch the moment they saw him. Now they call security, and security walks in from the side (the same blue SEC figure as the gas lot), so Squatch has time to get into a barrel, the echo spot or a trash can.
- **Chapter 2.** Unchanged, except that a catch now keeps the coins in hand and the jar (it used to keep only the stars), and two catches that took stars (the bots reaching the singing crate, and the bots searching the kitchen) now show the LOCKUP card.
- **Mops.** A bot that sees Mops still shoos him back with no LOCKUP and no star loss (your D9 recommendation, as Chapter 2 already did). That is now the same in Chapters 1 and 3, where it used to cost 100 stars.

The LOCKUP card's cause line, one per captor (rows 8.1 to 8.5 cover Chapter 2's five, unchanged):

| # | When it shows | In the game now | Another way to say it |
| --- | --- | --- | --- |
| 19.1 | LOCKUP card, Chapter 1 deck: a tourist saw Squatch and the guard reached him | A tourist saw Squatch on the deck. Security caught him. | A tourist spotted Squatch on the deck. Security caught him. |
| 19.2 | LOCKUP card, Chapter 1 deck or hall: Squatch walked past the vent and the vent alarm went off | The vent alarm found Squatch's fur. Security caught him. | Squatch's fur set off the vent alarm. Security caught him. |
| 19.3 | LOCKUP card, Chapter 1 hall (S6): a tourist ran to the alarm and Squatch was not hidden | A tourist saw Squatch in the hall. Security caught him. | A tourist spotted Squatch in the hall. Security caught him. |
| 19.4 | LOCKUP card, Chapter 1 hall: a bot's light found Squatch and he was not hidden when the alarm run ended | A bot saw Squatch in the hall. Security caught him. | A cleaning bot saw Squatch in the hall. Security caught him. |
| 19.5 | LOCKUP card, Chapter 1 S9: the bot reached the box while Squatch sang | The bot saw Squatch in the box. Security caught him. | The bot found Squatch in the box. Security caught him. |
| 19.6 | LOCKUP card, Chapter 1 S11: the bot reached the plant while Squatch sang | The bot saw Squatch behind the plant. Security caught him. | The bot found Squatch behind the plant. Security caught him. |
| 19.7 | LOCKUP card, Chapter 2 lure: the bots reached the crate while Squatch sang | A pump bot saw Squatch in the crate. Security caught him. | The pump bots found Squatch in the crate. Security caught him. |
| 19.8 | LOCKUP card, Chapter 2 kitchen: the bots searched and Squatch was not in the crate | A pump bot saw Squatch in the kitchen. Security caught him. | The pump bots found Squatch in the kitchen. Security caught him. |
| 19.9 | LOCKUP card, Chapter 3 pad: the rover saw Squatch | A rover saw Squatch on the pad. Security caught him. | A rover spotted Squatch on the pad. Security caught him. |
| 19.10 | LOCKUP card, Chapter 3 temple: a rover saw Squatch | A rover saw Squatch in the temple. Security caught him. | A rover spotted Squatch by the mirrors. Security caught him. |
| 19.11 | LOCKUP card, Chapter 3 ramp: the rover reached the barrel while Squatch sang | The rover saw Squatch in the barrel. Security caught him. | The rover found Squatch in the barrel. Security caught him. |
| 19.12 | LOCKUP card, Chapter 3 ramp: the rover saw Squatch out of the barrel | The rover saw Squatch by the ramp. Security caught him. | The rover spotted Squatch at the ramp. Security caught him. |
| 19.13 | LOCKUP card, Chapter 4 dock: Squatch stepped into the searchlight | The searchlight found Squatch at the dock. Security caught him. | The searchlight lit up Squatch at the dock. Security caught him. |
| 19.14 | LOCKUP card, Chapter 4 dock: the port bot saw Squatch | The port bot saw Squatch at the dock. Security caught him. | The port bot spotted Squatch at the dock. Security caught him. |

The other new or moved words:

| # | When it shows | In the game now | Another way to say it |
| --- | --- | --- | --- |
| 19.15 | The bottom line of every LOCKUP card, in every chapter (it was a Security bubble after the jokes in Chapter 2 only) | Holding pen. This section starts over. | Lockup. This part starts over. |
| 19.16 | A short line over the picture for about two seconds, when security leaves without finding Squatch (any chapter), the hall alarm cools off while he hides, or the deck guard walks away | They lost you. | You got away. |
| 19.17 | The chapter tally card, every chapter (it used to add the stars lost, as in "Times caught 2 (−200)") | Times caught 2 | Caught 2 times |

The captors' joke lines after the card are the ones each catch already had (for example "Just a fuzzy mop! Very fuzzy." in Chapter 1, the rover's "A rug with legs? Rugs get ROLLED UP!" in Chapter 3). Two of them talk about being moved back ("(Searchlight. Back to the van.)", "Mmmf! (Rolled all the way back!)"); they still fit, because the section restarts where it began.

Checkpoints: Chapter 2 keeps its table (`applyG`). Chapters 1, 3 and 4 now have one each (`CH1_CHECKPOINTS`, `CH3_CHECKPOINTS`, `CH4_CHECKPOINTS` in `src/game/25-capture.js`): the deck, the S6 hall, the S9 lure and the S11 lure in Chapter 1 restart the way those sections begin; the pad, the temple and the ramp in Chapter 3 and the dock in Chapter 4 put Squatch back at the section's start (the van, the barrel, the pad's far side) with the rovers and the port bot at home. Other Chapter 1 scenes restart from the state saved when the scene began, as Reset section already did.

