# Design rules audit

Written 2026-11-08. One principle at a time, across all four chapters. Source is `src/game/*.js`. A string sitting in a file is not a pass by itself. Tests are named where a test is what proves the behavior.

This pull request fixes one fail: the cook said "A WOOKIE!" before she was drawn. That needed no new words and no change to difficulty, timers, speed, cones, range, or prices. Every other fail is reported only.

## Counts

| Verdict | Principles |
| --- | --- |
| PASS | 7 |
| FAIL | 14 |

Fixed in this pull request: principle 20's cook case, which was also a pop under principle 1. The rest of principle 1 still fails.

## 1. Nothing feels like a glitch

No waits, freezes, pops, or teleports. Control comes back right away, with a clear cue of where to go.

**FAIL.**

What holds:

- Room changes during play use `roomLine` (`src/game/90-input-shell.js`) and give control back in the same step. "Mops goes inside." is one of those lines (`Wh` in `src/game/20-ch2.js`).
- The cook no longer pops in after her line. She is standing before "A WOOKIE!" and on the floor for "*faints*". `tests/cook-order.mjs`.

What fails:

- When Gloop, Blorp, Zip, Mom, or Dad sees Squatch, `pf` in `src/game/20-ch2.js` moves him about 70 pixels in one step. That is a teleport, not a shove you can see. It is the same in every chapter that uses `pf`. Not changed here: it is the existing shove, and smoothing it would change the moment he leaves the cone.
- Story beats insert `uV(...)` waits (for example `uV(1.2)` before the opening continues, `src/game/10-ch1.js`). The player cannot act during the wait, and it advances by itself. Those waits are in all four chapters. Removing them would change pacing. Not changed here.
- In the lobby, sight is a wedge (`Ps` in `src/game/10-ch1.js`) and the drawn cone is that same wedge (`src/game/60-frame-draw.js`). The new table and counter do not block it, so a watcher can see him through the furniture. Cutting that would make the lobby easier. Not changed here.

## 2. Characters keep one size and the same drawing

The same drawing in a cutscene as in play, unless the camera is clearly zoomed.

**FAIL.**

Gameplay Squatch is `Re` at scale `he` (1.6) in `src/game/00-core.js`. Mops is `Fe`.

These are the same functions, on a card that fills the screen, so they count as a zoom: the switch card (`src/game/60-frame-draw.js`, `he * 1.7` and `he * 2.6`) and the opening "This is Squatch" card.

These do not:

- The title draws a different Squatch and a different Mops (`O0` and `Ol` in `src/game/00-core.js`), at scale 3 and 2.6.
- Some Chapter 1 views draw Squatch at `wl` (3), not `he` (`src/game/60-frame-draw.js`).
- Flashbacks scale the world by 3 and draw simplified people with `wf` (`src/game/60-frame-draw.js`), not `Re` or `Fe`.
- Story panels draw Squatch at `he * 0.85` without a zoom frame (`src/game/60-frame-draw.js`).

Brian's earlier note was to leave size alone unless he asks (request B5). He did not ask in the 2026-11-08 answers. Not changed here.

The duct drawing Mops smaller so he fits the pipe, and the closet zoom, are fits and zooms. They are not the fail.

## 3. Cones, the exclamation, and the heart

Everyone except Mops has a visible cone and pops "!" when they see Squatch. Mops's warm cone pops a heart. Every cone is gone once Squatch reaches Mars.

**FAIL.**

What holds:

- On the hug on Mars, `Ao` is set (`src/game/40-ch4.js`, "cones off for good: hugged on Mars"). `pf`, Mops's heart cone, and the Chapter 4 cone all stop when `Ao` is set.
- Rusty, the pump bots, the rovers, and the port bot draw a cone from the same numbers that detect, and they draw "!" when they see him (`src/game/20-ch2.js`, `src/game/30-ch3.js`, `src/game/40-ch4.js`). `tests/cone-match.mjs`.
- Mops's heart is `_A` in `src/game/20-ch2.js`: a warm cone and a heart spark. `Fe` calls it (`src/game/60-frame-draw.js`).

What fails:

- `pf` skips the cone entirely while the player is Mops (`x.mops` in `src/game/20-ch2.js`). Watchers who can still see Squatch show no cone in that stretch. He asked for no cones while playing the goat (B11), and on 2026-11-08 he confirmed the shoo only. He did not confirm "cones only during the soup sneak." Not changed here, because turning cones back on is a cone change.
- The heart cone is skipped when Mops is drawn below `he * 0.9`, and when the player is Mops (`Fe` in `src/game/60-frame-draw.js`). A small Mops in a cutscene has no heart cone.
- The cook has no cone. She faints instead. That is a different reaction, and it is drawn now, but it is not a cone and an exclamation.

## 4. One capture rule, and the drawn cone is what catches

**PASS.**

Every catch goes through `capture()` in `src/game/25-capture.js`. A bot that sees Mops uses `shoo()`, which he confirmed on 2026-11-08. `tests/capture-rule.mjs` checks that a catch is the lockup card, then the section, and that stars are kept.

The cone test samples just inside and just outside the drawn edge for Rusty, a pump bot, Gloop's window, the rovers, the port bot, and the hall bot (`tests/cone-match.mjs`). Inside is seen and drawn, unless the sight line is blocked, and then neither. The lobby wedge is the same numbers for drawing and for `Ps`. They match. They also see through the table (principle 1). That is not a second capture rule.

## 5. When humans spot Squatch

Onlookers react. One runs to a wall alarm and pulls it. A siren. Security arrives, about 2 to 3 seconds in all. Squatch says no line.

**FAIL.**

Chapter 1 does most of this.

- Lobby: one watcher runs to the wall alarm, the siren is "WOOO-WOOO! SECURITY!", then the guard (`wp` and `Np` in `src/game/10-ch1.js`). The run is paced by the distance divided by 2.
- Hall: a tourist runs to the alarm in about 1.7 seconds, then half a second, then security (`vh` and `Th` in `src/game/10-ch1.js`, called from `src/game/11-ch1-hall.js`). The tourist speaks. Squatch does not.

What fails:

- Squatch still speaks in the lobby: "Gulp." and "Everyone's looking!" (`src/game/10-ch1.js`). The rule says no line. Taking those lines out is a wording change. Not changed here.
- Chapter 2 humans (Gloop, Blorp) shout and call `sSec` at once (`pf` in `src/game/20-ch2.js`). Nobody runs to a wall alarm. There is no siren line. Security is the blue SEC figure walking in.
- Zip, Mom, and Dad use that same `pf` shout. Zip does not call security from `pf` (only Gloop and Blorp do, and only in a Chapter 2 scene). Mom and Dad are not on a Chapter 2 scene, so a sight from them shouts and shoves and does not start the alarm run.
- Chapters 3 and 4 send security for rovers, the gate bot, and the searchlight (`sSec` in those files). Those watchers are not humans running to a wall alarm.

Building the 2 to 3 second alarm run in every chapter would be new behavior and a timer. Not built here.

## 6. Discovery by a nudge in the world, not a tutorial prompt

**FAIL.**

Nudges that are in the world and were asked for: the vent tuft (`lobbyTuft` in `src/game/10-ch1.js`), the glowing rings from `spot`, and the window frame flash (`tests/kitchen-warning.mjs`).

What is a tutorial prompt:

- The help line is always on the page (`KEY_HELP` and `TOUCH_HELP` in `src/game/90-input-shell.js`). He asked for that line to name only real controls (T12, `tests/help-text.mjs`).
- After 60 seconds with no progress, the chip shows the method (`src/game/80-hud.js`). He asked for that hint.
- The first time a mechanic appears, the chip names the step (his chip rule).

Removing those would undo requests he already made. Not changed here.

## 7. The opening dialogue is short

**PASS.**

Chapter 1 opens on one card, "This is Squatch. He's a Sasquatch." Control returns for a short walk (`Sp` in `src/game/10-ch1.js`). The next beat is Mops humming, then the player sings, then two song lines and "That's our song." The inspection line comes after that. The player acts before a long speech.

## 8. Prompts, switches, and the HUD

Every action reads "VERB · thing". Every switch goes through `switchTo(who, why)` and is announced. HUD zones are respected.

**FAIL.**

Prompts: `tests/action-labels.mjs` checks that offered actions are "VERB · thing" in all four chapters, and that the button text is at least 16 px. A few verbs are more than one word ("SNEAK OUT", "LEAVE SOUP", "HIDE!", "HUG!"). They still use the middle dot. Changing them would be new words. Left as they are.

HUD: `tests/hud-layout.mjs` checks both phone and desktop, eight states, zones, 14 px text, 44 px targets, and that the HUD hides under cards. `CLAUDE.md` says that test does not cover text drawn in the picture. That gap is principle 6's neighbor and backlog row BL-phone-text. The zone rule itself holds.

Switches: `switchTo` is the only place that sets who you are (`src/game/11-ch1-hall.js`). A card is queued only when `why` is a key in `SWITCH_WHY`. Chapter 1 scenes S9 to S11 and the Chapter 2 story switches have keys (`tests/ch1-switch.mjs`, `tests/ch2-switch.mjs`). Chapters 3 and 4 call `switchTo` with no reason (`src/game/30-ch3.js`, `src/game/40-ch4.js`), so those switches are silent. Restarts and several Chapter 2 calls do the same. Announcing them needs his lines (E17). Not added here.

## 9. spot() is both the ring and the trigger

**PASS.**

`spot` in `src/game/00-core.js` is the one object. `inSpot` uses its circle or box. The ring drawer reads that same object. `tests/ring-equals-trigger.mjs` checks the rings in the shared state list. A spot with no circle and no box is a button with no ring (sing while hidden, roll while the light moves), which the comment in `spot` states.

## 10. Points are for uncovering things

He chose to keep "Never caught! +250".

**FAIL.**

What matches:

- Secrets are +50 and funny finds are +25 (`ee` in `src/game/00-core.js`), with a spark that says which.
- A catch does not take stars away (`countCatch` and `restartSection` in `src/game/25-capture.js`).
- "Never caught! +250" is awarded once per chapter when that chapter had no catch. He said keep it. It stays.

What does not match "only for uncovering":

- Each `sneak-*` award is +100 for not being seen (`SNEAKY_LABELS` in `src/game/25-capture.js`): "Unseen on the deck! +100", "Hidden by the pump! +100", and the rest of that list. That is a bonus for staying hidden, not for uncovering a thing.

Taking those +100 awards out would change the score. Not changed here.

## 11. "MY GARDIANS" is the kid spelling

**PASS.**

The box title is drawn "MY GARDIANS" (`src/game/60-frame-draw.js`). The lid letters are "MY GARDIAN" in the same misspelling, with the last S mirrored as part of the drawing. Nothing in this pull request "corrects" that to GUARDIANS. Squatch saying "THE GUARDIANS" in dialogue is him saying the word, not the label on the box.

## 12. One bubble at a time, and nothing plays itself

From `CLAUDE.md` rules 3 and the review rules on bubbles and taps.

**FAIL.**

One bubble: the queue shows one story line, and ambient lines wait (`kV` in `src/game/00-core.js`). The chip is blank while a bubble is up (`chipText` in `src/game/80-hud.js`). `tests/bubble-anchor.mjs`.

Plays itself: `uV` waits advance with no tap (principle 1). Flashback skip exists for a flashback already open. A cutscene the player has not seen still waits, which is right. He asked that a seen cutscene can be skipped (D14). That is not built. Not built here.

## 13. Nothing is named before it is shown

From `CLAUDE.md` rule 4.

**FAIL.**

Chapter 1 is checked: nobody says "robot" before the notice, "Wookie" before the flashback, or the hangar code before Mops (`tests/ch1-playthrough.mjs`).

Chapters 3 and 4 have not had that pass. The end of Chapter 2 says "Next stop: Phobos!" (`src/game/20-ch2.js`) before the moon is on screen. The Chapter 3 card then says "Phobos" as he arrives. He asked for a sense pass that gives each oddity a cause and names Phobos on arrival (D16), and he said start that pass without an outline first. It is not started here. Until that pass, this rule is not held for the whole game.

## 14. Draw it. No narration in parentheses

From `CLAUDE.md` rule 5.

**FAIL.**

The scrub draws the dish and the paw. The soup is a bowl. The notice draws a robot. Those match the rule.

These lines tell instead of draw, and they use parentheses or stars as stage directions:

- "(Searchlight. Back to the van.)" and "(They saw me. Van, then the barrels.)" in `src/game/25-capture.js`.
- "*faints*" and "*RUMBLE* She heard my stomach." in `src/game/20-ch2.js`.
- "*FLASH*" in the gate-bot joke in `src/game/25-capture.js`.

Changing them needs his words. Not changed here. The faint is now also drawn (principle 20).

## 15. Squatch talks to no stranger until Chapter 4.4, and singing is only a lure or a bond

From `CLAUDE.md` rule 7.

**FAIL.**

Singing holds. The opening song and the Chapter 4 dance are scripted bond moments. SING spots are the lures (`src/game/11-ch1-hall.js`, `src/game/20-ch2.js`, `src/game/30-ch3.js`, `src/game/40-ch4.js`). No other song style was found.

Talking does not hold. On the Mars dock, before the reunion, Squatch answers the gate bot: "Sasquatch. Big and furry." and "Nope. Just getting my goat." (`v6` in `src/game/40-ch4.js`). Lockup jokes also have him answer the captor in Chapters 2, 3, and 4 (`CAPTURES` in `src/game/25-capture.js`). Those are strangers, and they are before he is home with his family. Not changed here. The lines are already approved text.

## 16. Everyone who can see him reacts, and shows a cone or an eye

From `CLAUDE.md` rule 8. This is the reaction half of principle 3.

**FAIL.**

Reactions that are real: lobby shouts, hall "WOOKIE!", Gloop and Blorp shouts plus security, pump bots, Rusty, rovers, the gate bot, the searchlight. The cook faints. Mops uses the heart, when the heart cone runs.

The same holes as principle 3: no cone while you play Mops, no heart cone on a small Mops, and Zip's sight shouts without security. Not changed here.

## 17. Every sighting has a felt consequence

From `CLAUDE.md` rule 9.

**FAIL.**

A catch is the lockup card naming who and where, then the section starts over (`tests/capture-rule.mjs`). A hide that works says "They lost you." (`tests/kitchen-warning.mjs`). That part is felt.

Zip's sight (principle 5) shouts and teleports Squatch and does not bring security. A lobby sight does bring the alarm, but Squatch also speaks, which muddies who the moment belongs to. Not changed here.

## 18. Bubbles sit on the speaker. An overheard line has an ear. No chip under a bubble

From `CLAUDE.md` rule 10.

**PASS.**

`tests/bubble-anchor.mjs` checks the anchor and the ear. `chipText` in `src/game/80-hud.js` returns nothing while a bubble is the current story item. Overheard whispers use the ear flag on the bubble (`v(..., "whisper")` and the ear path in `src/game/60-frame-draw.js`).

## 19. The player knows the goal, the next small step, and why that just happened

From `CLAUDE.md` rule 11.

**FAIL.**

The machinery is in. Chapter chips come from `CH1_CHIPS`, `CH2_CHIPS`, `CH3_CHIPS`, and `CH4_CHIPS`. `tests/chapter-chips.mjs` and `tests/ch2-goal-chip.mjs`. A stall shows the method line. Chapter 2 has a forward action in every phase (`tests/ch2-next-step.mjs`).

Chapters 3 and 4 have not had the sense pass, so a chip can name a goal whose cause was never shown (principle 13). Silent switches (principle 8) mean a change of who you are can happen with no "why". Not changed here.

## 20. Never show an outcome without the event that caused it

From `CLAUDE.md` rule 13.

**PASS.**

The cook used to say "A WOOKIE!" while `ch2.cook` was still empty, so the shout had nobody on screen. She is now placed standing at the stove before that line, and set down on the floor before "*faints*" (`src/game/20-ch2.js`). `tests/cook-order.mjs`. No new words. Security still starts, and the three lines are the same.

Mom and Dad are placed in the step before they speak (`src/game/40-ch4.js`). The lockup card's cause line is the sight that just happened (`lockupCause` in `src/game/25-capture.js`).

## 21. A new key idea is taught once, with a zoom-in card

From `CLAUDE.md`: `teach(id, at)`.

**PASS.**

`TEACH` has two entries, `hide1` and `switch1` (`src/game/25-capture.js`). `teach` refuses a second show. `tests/zoom-cards.mjs`. The vent has no card, which he asked for (E29). Chapter 2's first switch still uses the old switch card. He asked for one line before that card is replaced (SWITCH2). That replacement is not this pull request, and the current card is still a one-time announcement, not a second lesson of a new idea.

## What was fixed

| Fail | Change | Test |
| --- | --- | --- |
| The cook spoke before she existed (principles 1 and 20) | She stands at the stove for "A WOOKIE!" and is on the floor for "*faints*". Same words. Same spot (x 640, y 530). | `tests/cook-order.mjs` |

No other fail was a pure glitch that could be fixed without new words or a change to difficulty, a timer, speed, a cone, range, or a price.
