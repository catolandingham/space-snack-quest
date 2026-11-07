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
| 19.2 | LOCKUP card, Chapter 1 deck: Squatch walked past the vent and the vent alarm went off | The vent alarm saw Squatch on the deck. Security caught him. | The vent alarm caught Squatch on the deck. Security caught him. |
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
| 19.13 | LOCKUP card, Chapter 4 dock: Squatch stepped into the searchlight | The searchlight found Squatch on the dock. Security caught him. | The searchlight lit up Squatch on the dock. Security caught him. |
| 19.14 | LOCKUP card, Chapter 4 dock: the gate bot saw Squatch (the scene calls it that: "Back to my gate.") | The gate bot saw Squatch on the dock. Security caught him. | The gate bot spotted Squatch on the dock. Security caught him. |

The other new or moved words:

| # | When it shows | In the game now | Another way to say it |
| --- | --- | --- | --- |
| 19.15 | The bottom line of every LOCKUP card, in every chapter (it was a Security bubble after the jokes in Chapter 2 only). The ↺ button's spoken label says the same: "Hold to start this part over" | Holding pen. This part starts over. | Lockup. This part starts over. |
| 19.16 | A short line over the picture for about two seconds, when security leaves without finding Squatch (any chapter), the hall alarm cools off while he hides, or the deck guard walks away | They lost you. | You got away. |
| 19.17 | The chapter tally card, every chapter (it used to add the stars lost, as in "Times caught 2 (−200)") | Times caught 2 | Caught 2 times |
| 19.18 | LOCKUP card, Chapter 1 hall: Squatch walked past the vent and the vent alarm went off | The vent alarm saw Squatch in the hall. Security caught him. | The vent alarm caught Squatch in the hall. Security caught him. |

The captors' joke lines after the card are the ones each catch already had (for example "Just a fuzzy mop! Very fuzzy." in Chapter 1, the rover's "A rug with legs? Rugs get ROLLED UP!" in Chapter 3). Two of them talk about being moved back ("(Searchlight. Back to the van.)", "Mmmf! (Rolled all the way back!)"); they still fit, because the section restarts where it began.

Checkpoints: Chapter 2 keeps its table (`applyG`). Chapters 1, 3 and 4 now have one each (`CH1_CHECKPOINTS`, `CH3_CHECKPOINTS`, `CH4_CHECKPOINTS` in `src/game/25-capture.js`): the deck, the S6 hall, the S9 lure and the S11 lure in Chapter 1 restart the way those sections begin; the pad, the temple and the ramp in Chapter 3 and the dock in Chapter 4 put Squatch back at the section's start (the van, the barrel, the pad's far side) with the rovers and the port bot at home. Other Chapter 1 scenes restart from the state saved when the scene began, as Reset section already did.

### The drawn cone is now exactly where Rusty, the pump bots and Gloop's window see (T19 addition)

You noticed Rusty seemed to catch Squatch only when he was right in front, though the drawn cone looked bigger. A new test (`tests/cone-match.mjs`) puts Squatch at points just inside and just outside each drawn cone and checks the game's reaction. What it found:

- The width and length of every cone already matched what the game checks: Rusty 0.85 to each side and 280 long, a pump bot 0.6 and 230, Gloop's window 0.75 and 520. Nothing about width or range changed; that stays your call.
- The difference was blocking. The pump and the crates block the sight line (as they always have), but the cone was drawn straight through them. Behind the pump, Squatch stood in the shaded cone and nobody saw him. In the test, 9 of the 16 sample points in a pump bot's cone and 2 in Rusty's were like that.
- Now the cone is drawn cut short where the sight line is blocked, so the shaded area is exactly where a standing Squatch is seen. No new words.
- The game checks a point on Squatch's body, 40 pixels above his feet (50 for the kitchen window), not his feet. The test uses that point. If you want the check at his feet or his whole body instead, that would make the cones catch more and is a difficulty change, so it is left for you.

### More watchers checked (review, 2026-11-07)

`tests/cone-match.mjs` now also covers the deck tourist, the rover's three cones, the port bot and the Chapter 1 hall bots. Two drawings did not match what they check, and now do (no width or range changed):

- The rover at the ramp (Chapter 3, p4a) checks 0.6 to each side and 230 long, but was drawn 0.55 and 240. It is now drawn 0.6 and 230.
- A Chapter 1 hall bot also notices Squatch's feet within 70 pixels of its own, all round, which was not drawn. A faint circle round the bot now shows it.
- The rover, port bot and hall bot cones are now cut short where a barrel, can or wall blocks the sight line, as the gas stop cones are.

## HUD. The status over the picture is page text, in fixed places, readable on a phone

What changed on screen (your HUD decisions, 2026-11-07). The chapter tag, the stars, the goal chip, the countdown, the tank label and the "+100" pop used to be drawn into the picture, where a phone shrinks them to about 8 pixels. They are now page text laid over the picture, at 14 CSS pixels or more on a 375-wide phone (the chip is 15 on a phone, 20 on a computer). Each has a fixed home:

- **Top left, where:** the chapter tag (for example "CH2 · GAS STOP"), then the ↺ button, then the stars.
- **Top center, the goal:** the chip; under it the "HIDE!" countdown, the tank label at the gas stop, and the points pop (for example "Hidden in time! +100", T22) while it lasts. On a phone, where the top row has no room, the chip sits just under the top row, across the picture.
- **Top right, who:** where both characters can be played (the kitchen once the cook is down, the hall from S9 to S11, the temple), two face circles: the one you are is bright, the other is dim, and the dim one glows when switching is the next step. Tapping a face switches to that character. Everywhere else only the face of the one you are shows, smaller, in the same corner, so "who am I" always has the same home. The old picture button, which showed only the other character, is gone.
- **↺:** a small round button next to the chapter tag. Hold it for about three quarters of a second to restart the section (the ring fills inside it while you hold). The big "Reset section" button under the picture is gone. On a keyboard, holding R still works.
- **Sound:** the sound button moved from the top right of the picture to the controls row under the picture. It shows the same three states as before (sound waves, a red line when muted, an orange question mark when the browser keeps sound off); the "Sound is blocked..." line (18.145) shows beside it.
- **Prompts** still sit by the thing, cards still fill the picture (the HUD hides while a card is up), and bubbles still sit over the speaker. The chip still hides while a story bubble is up.
- **On a phone (review, 2026-11-07)** the three zones sit in a bar of page text directly above the picture, and the picture starts right under it, so nothing covers the picture (the kitchen order window and Gloop's face included). The chapter tag is short there ("CH2") so it fits beside two faces. On a computer the zones stay over the picture's top edge and the game stays in the middle.
- ↺ and each face are 44 by 44 touch targets (the drawn circle inside is smaller).
- The help line under the game is 14 pixels (it was 13).

| # | When it shows | In the game now | Another way to say it |
| --- | --- | --- | --- |
| 21.1 | The touch help line under the game (replaces 12.2's "Hold Reset section to restart.") | Stick: walk. Big button: do it. Tap the picture: next line. Hold ↺ to restart. | Stick: walk. Big button: do it. Tap the picture: next line. Hold the ↺ button to start this part again. |
| 21.2 | Removed: "Mops is gone" under a gray Mops picture in Chapter 4 after Mops is taken. Only Squatch's face shows there now. | (removed) | (none) |

### The stall hint

After 60 seconds of play with no progress (no new beat, room, item or catch; time while a card or a bubble is up does not count) the chip shows the method line for that moment instead of the goal. Hiding, leaving a hiding spot and switching faces do not count as progress (review, 2026-11-07). Notes in the goal spot ("They lost you.", the walk hint, the star hint) wait while a story bubble is up. Row 21.3 (the back step, "Squatch: walk to the KITCHEN door") was dropped: it repeated the chip. The goal line comes back as soon as anything moves on. Method lines exist only where the chip names the goal and not the step (your chip rule); where the chip already names the step, it stays.

| # | When it shows | In the game now | Another way to say it |
| --- | --- | --- | --- |
| 21.4 | Chapter 2, `g2`: Mops in the diner, stuck | Mops: walk up to Gloop at the counter | Mops: go stand at the counter |
| 21.5 | Chapter 2, `wash1` or `wash5`, no dish in hand, stuck | Squatch: grab a dish from the rack by the window | Squatch: take a dish from the rack |
| 21.6 | Chapter 2, `wash1` or `wash5`, holding a dish, stuck | Squatch: scrub the dish at the sink | Squatch: wash the dish at the sink |
| 21.7 | Chapter 2, `g3h`: in the crate while the bots argue, stuck | Squatch: stay in the crate until the bots leave | Squatch: wait in the crate |
| 21.8 | Chapter 2, `g4`: Mops out front without coins, stuck | Mops: walk to the tip jar on the counter | Mops: go to the tip jar |
| 21.9 | Chapter 2, `g4k` or `g4l`: Mops carrying the soup in the kitchen, stuck | Mops: walk to the crate while the bots look away | Mops: go to the crate when the bots turn around |
| 21.10 | Chapter 2, `g6`: the lure, Squatch not hidden, stuck | Squatch: hide in the crate by the ship | Squatch: get in the crate by the ship |
| 21.11 | Chapter 2, `g6`: the lure, Squatch in the crate, stuck | Squatch: sing to call the bots over | Squatch: sing so the bots come |
| 21.12 | Chapter 1, `S11`: the bot guards the door, Squatch not hidden, stuck | Squatch: hide behind the plant | Squatch: get behind the plant |
| 21.13 | Chapter 1, `S11`: Squatch behind the plant, stuck | Squatch: sing to call the bot over | Squatch: sing so the bot comes |
| 21.15 | Chapter 3, `p4a`: the rover on the ramp, Squatch not hidden, stuck | Squatch: hide in the barrel | Squatch: get in the barrel |
| 21.16 | Chapter 3, `p4a`: Squatch in the barrel, stuck | Squatch: sing to call the rover over | Squatch: sing so the rover comes |
| 21.17 | Chapter 4, `m1`: the dock, Squatch not hidden, stuck | Squatch: hide in the middle trash can | Squatch: get in the middle trash can |
| 21.18 | Chapter 4, `m1`: Squatch in the middle trash can, stuck | Squatch: sing to call the bot over | Squatch: sing so the bot comes |

## T20. The kitchen window warning can be seen, and long enough to react to

No new words. What changed on screen: when Gloop is about to look through the order window, the window's frame flashes (two colors, four times a second) and Gloop moves to the middle of the window and grows, looking out at the sink, with a big "!" beside the window. That stays from the warning until her look ends. The warning now lasts 2.5 seconds before she looks, in both sets of dishes (it was 1.1 seconds in the second set and 1.5 in the first, with only the small "Order up?" line to see). The "Order up?" line is unchanged. "They lost you." (19.16) also shows in the kitchen when security gives up after Squatch rolls into a ball.

On a phone the HUD sits above the picture (see the HUD section), so nothing covers the window.

## T23. Tap where you want to walk (your D11)

A tap (or a click) on the picture, when no bubble or card is up, walks the character you control to that spot in a straight line, the way Sierra games do. A small white ring shows on the floor where they are heading. The arrows, WASD and the stick still walk and cancel the tap-walk. A tap while a bubble or card is up still means "next", as before. The big ACTION button stays the way to act: walking onto a glowing ring lights it up, as walking there with the stick does. A tap no longer does the action the button shows (it used to, when no bubble was up); Enter and Space on a keyboard still do.

The first time a tap walks, this shows once in the goal spot for four seconds (and never again on that device):

| # | When it shows | In the game now | Another way to say it |
| --- | --- | --- | --- |
| 23.1 | In the goal spot, the first time a tap on the picture walks | Tap the floor to walk there. | You walk where you tap. |

"They lost you." (19.16) now shows in the same goal spot as page text, so it reads on a phone (it was drawn into the picture).

## T22. Small feel fixes (none changes how hard anything is)

No new words.

- A tap in the first 0.3 seconds of a new bubble used to be ignored. Now a yellow ring spreads in the bottom right corner to show it was heard, and the tap takes effect when the 0.3 seconds are up.
- While a scene has control (a cutscene, a card, a capture), no action is offered: the ACTION button and the label by the thing clear at once. Before, the kitchen's GRAB label could stay drawn while the scene played.
- COOK stays (review, 2026-11-07): the plan recommended removing it, but that is your call and the story still has Mops cooking. It is exactly as on main: COOK · ticket at the range, "Cooking ticket N.", no effect on the jar.

### The two awards now say what they were for (Brian, 2026-11-07)

**The +250 bonus.** It was called "GHOST BONUS +250". Only a catch clears it: a LOCKUP, or a bot shooing Mops. Being seen and getting away does not clear it. So it is "Never caught", not "Never spotted". It is counted per chapter (the tally card at the end of each chapter), not per section, so the reason says "chapter". Amount and rule unchanged.

| # | When it shows | In the game now | Another way to say it |
| --- | --- | --- | --- |
| 22.1 | Each chapter's tally card, when the chapter had no catches (was "GHOST BONUS +250") | Never caught! +250 | No catches! +250 |
| 22.2 | The line under 22.1, smaller | Squatch got through this whole chapter without being caught. | Nobody caught Squatch this whole chapter. |
| 22.3 | Each chapter's tally card, when there was a catch (was "Ghost bonus: get caught 0 times") | Get through without a catch for +250 | No catches this chapter wins +250 |

**The +100 sneaky finds.** Each used to pop up as "+100 SNEAKY!". Each now names what it was for. Amounts and rules unchanged.

| # | When it shows | In the game now | Another way to say it |
| --- | --- | --- | --- |
| 22.4 | Chapter 1 deck: Squatch reached Mops and nobody saw him | Unseen on the deck! +100 | Nobody saw you on the deck! +100 |
| 22.5 | Chapter 1 S6: the tourists in the hall never saw him | Unseen in the hall! +100 | Nobody saw you in the hall! +100 |
| 22.6 | Chapter 1 S9 and S11: the lure done without the bot spotting Squatch | Unseen by the bot! +100 | The bot never saw you! +100 |
| 22.7 | Chapter 2 g1: hidden behind the crate by the pump | Hidden by the pump! +100 | Hid at the pump! +100 |
| 22.8 | Chapter 2 g3: in the crate before the bots looked | Hidden in time! +100 | Hid before they looked! +100 |
| 22.9 | Chapter 2 g4: the soup reached Squatch's crate | Soup delivered unseen! +100 | Soup sneaked in! +100 |
| 22.10 | Chapter 2 g6: the lure pulled the bots away | Lured the bots away! +100 | Bots lured! +100 |
| 22.11 | Chapter 3 p1: hidden in the barrel | Hidden in the barrel! +100 | Barrel hide! +100 |
| 22.12 | Chapter 3 p3: the temple done with no catch (only the +250 says "Never caught") | Safe through the temple! +100 | Clean temple run! +100 |
| 22.13 | Chapter 3 p4: past the rover onto the ship | Got past the rover! +100 | Slipped past the rover! +100 |
| 22.14 | Chapter 4 m1: the dock done with no catch (only the +250 says "Never caught") | Safe to the gate! +100 | Clean run to the gate! +100 |

Not renamed: the final score's "Ghost-level sneaky!" rating in Chapter 4 (a rank by sneaky finds, not this bonus). Say if it should change too.

## Zoom-in cards teach a new idea the first time it appears

The opening introduces Squatch with a card that darkens the room except a spotlight on him, with "This is Squatch. He's a Sasquatch." beside it. The same card now teaches three ideas the first time each appears in a play-through. The room is drawn under a dark cover with a yellow-ringed spotlight on the thing, and one line in a white box beside it. It waits for a tap, like every card.

| # | When it shows | In the game now | Another way to say it |
| --- | --- | --- | --- |
| 24.1 | Chapter 1, O5: the first hide. The spotlight is on the bed, just as the bot is coming. | Squatch can hide under the bed. Nobody sees him there. | Hide under the bed. Nobody can see you there. |
| 24.3 | Chapter 1, S9: the first switch. Squatch starts singing; the spotlight is on the two faces in the top right corner. | Tap a face to switch. Then you play that one. | Tap Mops' face to play as Mops. |

Removed (review, 2026-11-07): the Chapter 2 first-hide card (was 24.2). Hiding was already taught in Chapter 1, and the chip rule says goal only after the first time.

Not added: Chapter 2's first switch (g1door). It already has a switch card that fills the picture with Mops and says "You are MOPS now." and why (rows 6.1 and the T6 card); a zoom-in card right before it would be two cards in a row. If you want the spotlight version instead of that card, say so and it can replace it.

## Also changed

- **Chapter 2 lockups now count against the +250 bonus.** On main a LOCKUP by security (pump bots, Gloop, Blorp, Rusty) did not count as a catch, so a chapter could end with "GHOST BONUS" after a lockup. Now every LOCKUP counts.
- **The two lure catches go straight to LOCKUP.** When the bots reach the singing crate (Chapter 2) or the rover reaches the singing barrel (Chapter 3), the LOCKUP card shows at once, with no security walk first: they have already found him.
- **Restarts never skip a step (review, 2026-11-07).** A restart in `g6d`, or in `g6` before the tank is full, used to put Squatch at the lure, and the ship could then be boarded with an empty tank. BOARD now needs a full tank, and those restarts put Mops back with the coins by the pump (if he has them) or by the new jar in the diner. A restart from `g4l` lands on the next dishes without handing the soup back. A lure capture sends the pump bots home. In Chapter 1, a restart in S4, S7 or S7b puts the bots back where they were when the scene began, resets the crate light, and gives three seconds before a bot can see Squatch again.

## Not finished

- **Text drawn in the picture on a phone.** The HUD is page text at 14 CSS px or more. Speech bubbles, cards, the "VERB · thing" label by the thing and the zoom-in cards are still drawn into the picture, so on a 375-wide phone they read at about 8 to 15 px. Making them bigger on phones needs its own pass.
- **Chapter 2's first switch** keeps its switch card instead of a zoom-in card (see the zoom-in section).
- **Mops being seen** is a shoo (your D9 recommendation, as Chapter 2 did), not a LOCKUP. If D1 should cover Mops too, say so.
- **Chapters 3 and 4** checkpoints put Squatch back where the old nudges did (the van, the barrel, the pad's far side), which is where those sections start; they were not replayed as full scene restarts.
