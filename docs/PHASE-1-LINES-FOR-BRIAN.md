# Phase 1 lines for Brian

Every new or changed thing the player reads in Phase 1 (branch `phase-1-kitchen-clarity`), listed so you can say yes or change the words before the merge. Each line gives the task, where it shows, the words in the game now, and one other way to say it where we had to choose.

To change a line: edit the "In the game now" words in this file and say so in the pull request. An agent will copy your words into `src/game.js` and the tests.

## T7. Every Chapter 2 phase offers a way forward

| # | Where it shows | In the game now | Another way to say it |
| --- | --- | --- | --- |
| 7.1 | Action button and the caption on the picture, when Mops is in the diner but the work is in the kitchen (after he walks out the kitchen's front door) | BACK · kitchen | GO IN · kitchen |

## T5. The goal chip names who acts and what to do

The chip is the yellow goal line at the top of the picture. It is set from one table (`CH2_CHIPS` in `src/game.js`) and hides while a story bubble is up. Where the plan had a draft, the draft is used unless noted.

**Chip rule (Brian, 2026-11-06), for every chapter:** the first time a mechanic appears, the chip names the step; after that it names only the goal, so discovery stays with the player. In Chapter 2, 5.1 (first hide) and 5.6 (first kitchen hide) name the step; 5.7 and 5.18 were changed to name only the goal; the rest already name goals.

| # | When it shows | In the game now | Another way to say it |
| --- | --- | --- | --- |
| 5.1 | Start of the gas stop (g1) | Squatch: hide behind the crate by the pump | Squatch: hide by the crate at the pump |
| 5.2 | Squatch hid, Mops goes to the diner (g1door) | Mops: walk to the diner door and go in | Mops: walk to the diner door, then press ENTER (the plan's draft; on a keyboard Enter also means "next line", so I left it out) |
| 5.3 | Mops found work; Squatch sneaks to the back (back) | Squatch: sneak in the KITCHEN door | Squatch: go in the door that says KITCHEN |
| 5.4 | Mops in the diner the first time (g2) | Mops: ask Gloop for work at the counter | (plan draft) |
| 5.5 | First dishes (wash1) | Squatch: wash the dishes at the sink | (plan draft) |
| 5.6 | The bots come to look (g3, g3hide) | Squatch: hide in the crate before the bots look! | (plan draft) |
| 5.7 | Squatch is in the crate while the bots argue (g3h) | Squatch: stay out of sight | (Brian's wording, 2026-11-06) |
| 5.8 | Mops out front, before he has coins (g4) | Mops: take the tip jar | Mops: grab the tip jar (review: one action per line, so the plan's "take the tip jar and buy at the counter" is split into 5.8 and 5.9) |
| 5.9 | Mops has the coins (g4) | Mops: buy soup at the counter | Mops: buy the soup at the counter |
| 5.10 | Mops has the soup (g4) | Mops: take the soup through the kitchen door | Mops: carry the soup to the kitchen |
| 5.11 | Mops in the kitchen with the soup (g4k, g4l) | Mops: carry the soup to Squatch's crate | (plan draft) |
| 5.12 | Mops walked out front while the work is in the kitchen | Mops: go back through the kitchen door | Mops: go back to the kitchen |
| 5.13 | Next dishes (wash5) | Squatch: wash the next dishes | (plan draft) |
| 5.14 | The greasy pot, Mops has the mop (wash5) | Mops: mop the greasy pot at the sink | Mops: mop the pot at the sink |
| 5.15 | The new jar, out front (g6d) | Mops: grab the new tip jar | Mops: take the tip jar |
| 5.16 | Mops has the coins (g6d) | Mops: take the coins out the EXIT door | Mops: take the coins out to the pump |
| 5.17 | Back on the lot with coins (g6, Mops) | Mops: give the coins to Rusty at the pump | Mops: pay Rusty at the pump |
| 5.18 | Tank is full, bots on the ramp (g6, Squatch) | Squatch: lure the bots away from the ship | (Brian's wording, 2026-11-06) |
| 5.19 | Squatch is singing (g6) | Squatch: stop singing before they reach you | Squatch: stop before the bots get to you |
| 5.20 | The bots are looking at the crate (g6) | Squatch: run to the ship and get on board | Squatch: run to the ship! |
| 5.21 | The player tapped the picture button in the kitchen and is now Mops, while the work is Squatch's (added with T6). The picture button glows while this chip shows. | Mops: tap Squatch's picture (top right) to switch back | Mops: tap the picture, top right, to be Squatch again |

## T6. Every switch between Squatch and Mops, and every room change, is announced

A switch card fills the picture, shows the character, and waits for a tap. Its top line is "You are MOPS now." or "You are SQUATCH now." (the plan's wording). The second line says why:

| # | When it shows | In the game now (why line) | Another way to say it |
| --- | --- | --- | --- |
| 6.1 | Squatch hid by the pump; Mops goes to the diner | Mops goes to the diner. Squatch stays hidden by the pump. | Squatch hides by the pump. Mops walks to the diner. |
| 6.2 | Mops asked for work; Squatch goes to the back door | Mops found work. Squatch sneaks in the back. | Gloop needs a dishwasher. Squatch sneaks in the back. |
| 6.3 | Squatch is hiding from the bots; Mops goes out front | Squatch stays hidden in the crate. Mops goes out front. | Squatch is hiding. Mops goes out front. |
| 6.4 | Soup delivered; back to the dishes | Squatch washes the next dishes. | Squatch goes back to the sink. |
| 6.5 | The greasy pot | This pot needs a mop. Mops goes to get it. | This pot needs a mop. |
| 6.6 | The second set of dishes is done; Mops goes for the new jar | The dishes are done. Mops goes out front. | Dishes done. Mops goes out front. |
| 6.7 | Tank is full; Squatch has to lure the bots | The tank is full. Squatch has to lure the bots away. | Tank full! Now Squatch lures the bots away. |

The tag beside the chip, in page text over the top of the picture:

| # | When it shows | In the game now | Another way to say it |
| --- | --- | --- | --- |
| 6.8 | Any time the story is playing, for whoever the player moves | YOU: SQUATCH / YOU: MOPS | (plan wording) |

A short line over the fade when a character changes room during play (it fades after about two seconds; it is not a card):

| # | When it shows | In the game now | Another way to say it |
| --- | --- | --- | --- |
| 6.9 | Mops goes in the diner door from the lot | Mops goes inside. | (plan wording) |
| 6.10 | Squatch goes in the KITCHEN door from the lot | Squatch sneaks into the kitchen. | Squatch slips into the kitchen. |
| 6.11 | Mops walks from the kitchen to the diner | Mops goes out front. | Mops goes to the diner. |
| 6.12 | Mops walks back from the diner to the kitchen (BACK · kitchen) | Mops goes back to the kitchen. | Mops heads back in. |
| 6.13 | Mops carries the soup into the kitchen | Mops brings the soup into the kitchen. | Mops brings the soup in. |
| 6.14 | Mops takes the coins out to the lot | Mops goes out to the pump. | Mops heads out to Rusty. |

## T8. No capture the player cannot prevent, and every lockup card says why

The LOCKUP card's second line used to be a short joke caption ("Nozzle's ready.", "Counter's closed.", "Seen from the window.", "No coins, no lot."). That line now says who saw Squatch and where. The captor's joke bubbles still come after the card.

| # | When it shows | In the game now | Another way to say it |
| --- | --- | --- | --- |
| 8.1 | LOCKUP card, caught by the pump bots on the lot | A pump bot saw Squatch on the lot. Security caught him. | A pump bot spotted Squatch. Security caught him. |
| 8.2 | LOCKUP card, Gloop at the diner counter | Gloop saw Squatch at the counter. Security caught him. | (plan draft) |
| 8.3 | LOCKUP card, Blorp in the diner | Blorp saw Squatch in the diner. Security caught him. | Blorp spotted Squatch by his soup. Security caught him. |
| 8.4 | LOCKUP card, Gloop through the kitchen window | Gloop saw Squatch at the sink. Security caught him. | Gloop saw Squatch through the window. Security caught him. |
| 8.5 | LOCKUP card, Rusty on the lot | Rusty saw Squatch by the pump. Security caught him. | Rusty spotted Squatch at his pump. Security caught him. |
| 8.6 | Any other LOCKUP (none in Chapter 2 today) | Security caught Squatch. | (none) |
| 8.7 | Pump bot bubble when the bots shoo Mops in the kitchen (replaces "Former Ganitor? SHOO!"; costs no stars now, and still counts as a capture as before) | No goats with food past here! Shoo! | Hey! No goats by the crate! Shoo! |
| 8.8 | Gloop's bubble after a counter LOCKUP (was "Counter's closed. Pen's open."; a child did not know what a pen was, and LOCKUP is the word on the card) | Counter's closed. Lockup's open. | (Brian's wording, 2026-11-06) |

## T9. Speech bubbles sit over the speaker, one at a time

No new words. What changed on screen: bubbles in the kitchen now sit over the person talking instead of in a band at the bottom (Gloop's lines sit just right of her order window so the tickets stay readable); a voice from another room (the pump bots arguing in the kitchen while Mops is out front) shows as a bubble with an ear at the door on that side; ambient lines take turns, one bubble at a time; and the "HIDE! 5" countdown moved down to sit under the goal chip.

## T10. The soup sits on Mops' head and looks like soup

No new words. The bowl now rests on top of Mops' head (it used to float about 130 pixels above him) and bobs with him. It is a white bowl, 56 pixels wide, with yellow soup, two bits of vegetable, a spoon sticking out, and three wavy lines of steam. No label.

## T11. The ACTION button names the thing

The big touch button, and the small caption drawn on the picture by the spot, now read "VERB · thing" for every Chapter 2 action. The verbs are the game's existing ones; the things are new. The button turns into a wider pill for these labels, with letters at least 16 pixels.

| # | Where | In the game now | Another way to say it |
| --- | --- | --- | --- |
| 11.1 | Crate by the pump (g1), crate in the kitchen (g3), crate by the ship ramp (g6) | HIDE · crate | HIDE · box |
| 11.2 | KITCHEN door on the lot | ENTER · kitchen door | ENTER · kitchen |
| 11.3 | Hidden in the crate by the ramp | SING · lure song | SING · song |
| 11.4 | Singing in the crate | STOP · singing | STOP · song |
| 11.5 | Mops by Rusty with the coins | GIVE · coins | PAY · Rusty |
| 11.6 | Blorp's covered plate | LIFT · lid | LIFT · plate lid |
| 11.7 | Employee of the Month frame | FLIP · picture | FLIP · frame |
| 11.8 | Postcard on the wall | FLIP · postcard | (none) |
| 11.9 | Counter, first visit | ASK · for work | (Brian's wording, 2026-11-06; was ORDER · counter) |
| 11.10 | Tip jar | GRAB · tip jar | GRAB · jar |
| 11.11 | Counter, before buying | ASK · Gloop | ASK · prices |
| 11.12 | Counter, with coins | BUY · soup 30 | (plan wording) |
| 11.13 | The range | COOK · ticket | COOK · order |
| 11.14 | Anywhere, while Gloop is about to look | ROLL · into a ball | ROLL · ball |
| 11.15 | Recipe on the shelf | OPEN · recipe | READ · recipe |
| 11.16 | Dish rack at the order window | GRAB · dish | GRAB · plate |
| 11.17 | Sink, holding a dish | SCRUB · dish | WASH · dish |
| 11.18 | Sink, greasy pot, as Mops | MOP · pot | MOP · greasy pot |
| 11.19 | Kitchen crate, as Mops with the soup | LEAVE SOUP · crate (the picture keeps its own "LEAVE SOUP" label with an arrow) | LEAVE · soup |
| 11.20 | Already captioned before this phase and unchanged | ENTER · diner door, ENTER · kitchen, EXIT · the lot, BOARD · ship, FRONT · diner | (none) |

## T12. The help line tells the truth

| # | Where | In the game now | Another way to say it |
| --- | --- | --- | --- |
| 12.1 | Under the game on a computer (replaces the old line that named Shift, Tab and opera) | Arrows or WASD: walk. E: do the action in the white label. Space or Enter: next line. Hold R: restart this section. Esc: skip a flashback. M: sound. | Arrows or WASD: walk. E: do what the button says. (the plan's draft; on a computer there is no big button, only the label on the picture) |
| 12.2 | Under the touch controls on a phone or tablet, and on a computer after "Show touch controls" | Stick: walk. Big button: do it. Tap the picture: next line. Hold Reset section to restart. | Stick: walk. Big button: do what it says. Tap the picture: next line. Hold Reset section to start this part again. |
| 12.3 | The joystick's spoken label for screen readers (was "Move (push far to run)") | Move | Walk |

There is no keyboard key for switching characters in the story chapters: Tab only worked in the old engine. On a computer, switching back (5.21) is a click on Squatch's picture. A key for it would be a new control; say if you want one.

The old line also said "Click the game first so it hears your keys." It is gone, because the plan's wording replaces the whole line. Say if you want it back.

## Not finished

- **T6, acceptance 2 (every switch in Chapters 1 to 4 has a why line).** Every switch in all four chapters now goes through `switchTo`, and only `switchTo` sets `x.mops` (checked by `tests/ch2-switch.mjs`). Only the seven Chapter 2 story switches have why lines and cards. The switches in Chapters 1, 3 and 4 (for example Mops taking over in the Phobos `P2` and `p3x` scenes, the Mars `m2` poster and `m3` van, and the Chapter 1 picture button) are silent, as before. Writing their why lines needs those scenes read closely and your wording, and adding tap cards there changes flows the progression tests play; it fits Phase 3 (T18 and T19) better.
- **T8, "a HIDE action exists nearby".** Diner recognition now only starts security while the player controls Squatch, which is the fix the recording needed (Squatch is never the player in the diner during normal play). I did not add "and a hiding spot is close", because the diner has no hiding spot, so that rule would switch off diner recognition completely and break the counter-capture checks in `tests/kitchen.mjs`. That is a design call for you.
- **T11, verbs.** I kept the game's existing verbs (FRONT, LEAVE SOUP and so on) and only added the things, except ORDER, which Brian changed to ASK · for work (11.9).

- **Playtest issue 9 (window and sink in the wrong spot).** Not touched in Phase 1. It waits on decision D12 in the plan, then a recording.

## Also changed

Changes the player may notice that are not new words:

- Reset section during g4l (after the soup is left in the crate) now resumes at wash5, the next dishes, instead of leaving Mops with nothing to do. `docs/README.md` says so in the checkpoint table.
- Ambient chatter (the small bubbles that fade on their own) now waits its turn, one bubble at a time, in every chapter, not only Chapter 2.
- The "YOU: SQUATCH" / "YOU: MOPS" tag shows in every chapter while the story is playing.
- `switchTo` stops both characters' walking when control changes, in every chapter (the old direct switches did not).
- In the kitchen, the picture button now puts Squatch in the crate while the player is Mops, and back where he was on the return switch. While the bots are searching (g3hide), tapping it counts as hiding in the crate, exactly like HIDE, and the story moves on.
- The RUMBLE banner and the HIDE countdown in the kitchen sit under the goal chip.

## Other things I noticed and did not change

- Reset section in g6d (Mops out front, about to take the new jar) puts the player back on the lot as Squatch at the lure, and the ship can then be boarded without the tank being filled. Reset section in g6 after Mops has the coins does the same. Neither is a dead end, but both skip the fuel step.
- The cook's "A WOOKIE!" is spoken before she is drawn (she only appears once she is on the floor), so her bubble now sits where she falls.
- In the kitchen the picture button (top right) lets the player switch to Mops once the cook is down. That is how a player can end up as Mops at the sink. The chip now says how to switch back (5.21), and the button is off while security is coming.
