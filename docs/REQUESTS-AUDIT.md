# Requests audit

Written 2026-11-08 from the code on `main` (`10030f6`) plus the cook fix on this branch. Each row is one comment from section 5 of `docs/HANDOVER-FOR-GROK-2026-11-08.md`, then the backlog items that are not already one of those rows.

Old chat threads were not re-read. A row is **DONE** when the game already does what Brian asked. **PARTIAL** when some of it is in and a named piece is not. **MISSING** when he has asked for it and it is not in the game. **NEEDS-BRIAN** when the next step is his lines, a replay, or an idea. His answers of 2026-11-08 are recorded in `docs/project/DECISIONS-2026-11-08.md`. This pull request does not build those answers, except the cook drawing, which was already a glitch with no new words.

## Counts

| Status | Section 5 | Backlog (not already a section 5 row) |
| --- | --- | --- |
| DONE | 125 | 35 |
| PARTIAL | 27 | 5 |
| MISSING | 4 | 6 |
| NEEDS-BRIAN | 5 | 6 |

Section 5 is 161 rows (A1–A27, B1–B29, C1–C8, P1–P43, N1–N13, M1–M7, E1–E34). The backlog table is 52 rows.

## 5a. Grok asks, section A

| Id | Request | Status | Evidence | What's left |
| --- | --- | --- | --- | --- |
| A1 | Put the repo in a private one | DONE | The GitHub repo is private. Not a game line. | Nothing. |
| A2 | This is for my grok bot, not the team | DONE | Account matter. No game task. | Nothing in the game. |
| A3 | Deal with the cloud-agent error | DONE | `CLAUDE.md` verify rule (tests, then a separate review). | Nothing. |
| A4 | Review inside the app, not only on GitHub | DONE | `CLAUDE.md`: report to Brian in plain English in chat. | Nothing. |
| A5 | There were more items | DONE | Split into B9–B15 below. | Nothing. |
| A6 | Build it all, ideally in parallel | DONE | `docs/PLAN-2026-11-06.md` section 8: parallel only where files do not overlap. | Nothing. |
| A7 | Locals still afraid after Saturn, and think about gameplay | PARTIAL | The line is in `src/game/40-ch4.js` (Mops: "Locals are scared of a Squatch..."). The old alarm text is gone. Showing the fear, instead of saying it, is T28 and is not built. | T28. He has not approved a shown version. |
| A8 | Squatch gets more comfortable in his own skin | DONE | `src/game/40-ch4.js`: "Trash cans. I'll use them on purpose." | Nothing. |
| A9 | Different funny ways of being captured | DONE | Four joke sets in `src/game/25-capture.js` `CAPTURES`. The counter joke is "Lockup's open." | Nothing. |
| A10 | Play live and offer commentary | DONE | `tests/debug-link.mjs`. `?debug=1` state strip. | Nothing. |
| A11 | Do chapter 1, then merge | DONE | Pull requests 1 to 3 are merged. | Nothing. |
| A12 | How to reconnect Render | DONE | Not a game task. | Nothing in the game. |
| A13 | One idea at a time, all the way | DONE | `docs/REVIEW-RULES.md` rules 6 and 18. `CLAUDE.md`. | Nothing. |
| A14 | Build what does not conflict, and hold the rest | DONE | Kitchen C is on main. Mops wears the chef hat only while cooking (`README.md`). | Nothing. |
| A15 | The kitchen window needs to be way bigger | PARTIAL | Kitchen C is the layout that shipped. He later said the window could be a bit smaller, then on 2026-11-06 said the window and sink looked wrong again. | D12: ask what looked wrong before any move. |
| A16 | A more comprehensive review | DONE | Code review, checklists, Hermes check, the plan, all in `docs/`. | Nothing. |
| A17 | One source of truth | DONE | The repo is the truth (`CLAUDE.md`). This pull request brings `docs/MASTER-BACKLOG.md` up to main. | Keep the backlog in the same pull request as the code. |
| A18 | Something like hitting the side of a pinball table | DONE | Small hold-to-use ↺ in `src/game/80-hud.js`. Stall hint after 60 seconds. `tests/hud-layout.mjs`. | Nothing. |
| A19 | New spine, just for the kitchen | DONE | `docs/story-bible.md`. Other chapters stay on `docs/original-story-spine.md`. | Nothing. |
| A20 | Show options and visuals | DONE | `story-options.html` was never in the repo. The choices are in plain words in the plan and in `docs/HELD-DECISIONS` on pull request 12. | Nothing. The missing file was replaced on purpose. |
| A21 | Look with fresh eyes | DONE | Three layouts were shown. Kitchen C is what shipped. | Nothing. |
| A22 | The TV question was not clear | DONE | Rewritten as D2-TV. He answered on 2026-11-08: keep the TV and the crate hide, and cut arguing after "Go watch the dock." | The cut itself is row C1. In the current scene there is no arguing after that line. |
| A23 | Likes C; window a bit smaller; spices not quite right | PARTIAL | Kitchen C is in. Spices are three jars on the counter. The smaller window was not confirmed, and N9 raised the window and sink again. | D12: ask first. |
| A24 | How is it going, what is next | DONE | `CLAUDE.md`: no merge without his yes in the pull request. | Nothing. |
| A25 | Keep going on a fresh-player Chapter 1 audit | DONE | Crate hide, zoom card (`tests/zoom-cards.mjs`), `tests/ch1-playthrough.mjs` reaches the ship. | Nothing. |
| A26 | The manager's office seems strangely placed | MISSING | The computer is at x 150 (`src/game/11-ch1-hall.js`, `lt`). The STORAGE sign is at x 1325 (`src/game/10-ch1.js`). | He said on 2026-11-08: move it beside storage. Not built here. |
| A27 | Are we continuing with other tests | DONE | `npm test` runs every suite in `tests/`. This branch adds `tests/cook-order.mjs`. | Nothing. |

## 5b. Grok asks, section B

| Id | Request | Status | Evidence | What's left |
| --- | --- | --- | --- | --- |
| B1 | Skip button and progress dots | PARTIAL | Esc skips a flashback (`src/game/60-frame-draw.js`, `KEY_HELP` in `src/game/90-input-shell.js`). Dots exist for flashbacks. | He said skip only a cutscene already seen (D14). That wider skip is not built. |
| B2 | Collision snags near the G sign and the bucket | DONE | `tests/progression.mjs` checks the closet G-sign and bucket lanes. | Nothing. |
| B3 | Hide only works sometimes | DONE | `tests/ring-equals-trigger.mjs`. The prompt is "HIDE · crate". | Nothing. |
| B4 | Stacked bubbles and a layout jump | DONE | `tests/bubble-anchor.mjs`. One bubble at a time. | Nothing. |
| B5 | Cone hierarchy and character size | PARTIAL | Cones match the area that sees (`tests/cone-match.mjs`). Sizes were left as they are. | He has not asked to change size. See the design-rules audit, principle 2. |
| B6 | Ganitor lines, song preview, airlock egg | PARTIAL | "What's a GANITOR?" is in `src/game/11-ch1-hall.js`. The airlock egg is `dA` in the same file. | A person has not watched the egg. |
| B7 | Rusty capture soft-lock | DONE | One capture rule, `tests/capture-rule.mjs`. The Chapter 2 keyboard route is never caught (`tests/ch2-playthrough.mjs`). | Nothing. |
| B8 | Rusty sight glitches, and the pump cover | PARTIAL | The glitch fixes have tests (`tests/cone-match.mjs`, `tests/gas-stop.mjs`). On 2026-11-07 the cone felt too narrow. | He said replay before any widening (E22). Width is unchanged. |
| B9 | Low fuel is not clear | PARTIAL | "TANK EMPTY" / "TANK FULL" in `src/game/80-hud.js`. | Letters drawn inside the picture are still small on a phone. |
| B10 | Mops walks to the door and presses the action | DONE | `Wh` in `src/game/20-ch2.js` says "Mops goes inside." `tests/ch2-switch.mjs`. | Nothing. |
| B11 | No sight lines while playing the goat | DONE | `pf` in `src/game/20-ch2.js` does not draw a cone while `x.mops` is set. | He confirmed the shoo (D9). He did not confirm showing cones only during the soup sneak. |
| B12 | Pump bots show cones | DONE | `seenCone` for the pump bots in `src/game/20-ch2.js`. `tests/gas-stop.mjs`. | Nothing. |
| B13 | Seen, security, hide, lock up, restart the section | DONE | `src/game/25-capture.js`. `tests/capture-rule.mjs`. | Nothing. |
| B14 | Cook faints, Mops cooks, Squatch washes | DONE | Canon in `docs/story-bible.md`. The cook is drawn before "A WOOKIE!" (`tests/cook-order.mjs`, `src/game/20-ch2.js`). | Nothing for this row. The hands-on rub is D17, still waiting on lines. |
| B15 | Hunger and visible prices | DONE | Soup 30 and tank 30. "BUY · soup 30" in `src/game/20-ch2.js`. | Nothing. |
| B16 | Soup on Mops's head | DONE | `tests/soup-on-head.mjs`. | Nothing. |
| B17 | Oven and ticket logic | NEEDS-BRIAN | COOK adds one to a counter and says "Cooking ticket N." (`src/game/20-ch2.js`). It pays nothing. | He said make COOK do something. Ideas needed. Do not remove it. |
| B18 | Keep the mop handoff | DONE | The greasy-pot handoff is in `src/game/20-ch2.js`. `tests/kitchen.mjs`. | Nothing. |
| B19 | Paw and sponge scrub | DONE | The scrub card draws the dish, the paw, and the sponge (`src/game/60-frame-draw.js`). `tests/kitchen.mjs`. | The later rub-the-dish idea is E21, not this row. |
| B20 | Roll instead of duck | DONE | "ROLL · ball" in `src/game/40-ch4.js`. No DUCK prompt remains. `tests/kitchen.mjs`. | Nothing. |
| B21 | Slow hoof-stamp scene | PARTIAL | The stamp scene plays. `tests/kitchen.mjs` includes the timed hoof stamp. | A recording has not looked at it since. |
| B22 | Stop the arguing after the dock | DONE | After "Bots! Go watch the dock." (`src/game/20-ch2.js`) the bots walk out and the next wash starts. There is no argument after that line. | Nothing to cut. The crate lines stay, and they come before the dock line. |
| B23 | Exit, boarding, caption flow | PARTIAL | Boarding is "BOARD · ship". The next-stop line sits with the ship. | A recording has not confirmed the flow. |
| B24 | Remove "Just like that first night" | DONE | That sentence is not in `src/game/`. | Nothing. |
| B25 | A clear cone for Gloop | DONE | The window warning lasts 2.5 seconds (`WINDOW_WARN` in `src/game/20-ch2.js`). `tests/kitchen-warning.mjs`. | Nothing. |
| B26 | Arrival warning about locals | PARTIAL | Same as A7. The line is spoken. It is not shown. | T28. |
| B27 | The Mops whisper is fine | DONE | Left as it was. He said so. | Nothing. |
| B28 | A coin per dish, or show the prices | DONE | The jar becomes 30 when a wash set finishes. Not one coin per dish. He chose the coins chain on 2026-11-08 (CH2). | Nothing. |
| B29 | Crib hop, dialogue controls, audio | PARTIAL | The crib gag and the bubble controls are in. Sound starts on the first touch. | A person has not listened to it. |

## 5c. Story decisions, section C

| Id | Request | Status | Evidence | What's left |
| --- | --- | --- | --- | --- |
| C1 | TV hiding beat: keep the TV, cut the argument after the dock line | DONE | TV lines are `e2` in `src/game/20-ch2.js` ("Ooh, my show!", "WOOKIE SPOTTED IN SPACE!"). The crate lines stay in `HA`, before the dock line. Nothing after the dock line is an argument. | Nothing to build. This matches his 2026-11-08 answer. |
| C2 | What stars are for | DONE | Finds add stars (`src/game/00-core.js`, +50 and +25). No catch takes stars (`src/game/25-capture.js`). "Never caught! +250" stays. He said keep that bonus. | The +100 "unseen" awards are a design-rule question, not this row. See the design audit. |
| C3 | After soup and gas, chili or coins | DONE | The coins, soup, then gas chain is what plays. He chose coins. The old chili objective went out with the dead engine. | Nothing. |
| C4 | Blorp's pea gag | DONE | Not in the counter scene. He said park it. | Leave it parked. |
| C5 | Who the Guardians are | NEEDS-BRIAN | Chapter 4 asks "Then who were the Guardians?" (`src/game/40-ch4.js`). No "Years ago" scene shows that Mops wrote the note. | He said send the lines first. Not built here. |
| C6 | Zip's songs | NEEDS-BRIAN | The old "I have rings" riddle is not in `src/game/`. The echo spot is a hide, not a riddle. | He wants many riddles, a different one each game. If the echo riddle is used, Zip mocks himself for it being obvious. Write them for him first. |
| C7 | Harry's dance | DONE | Four presses, then the song (`src/game/40-ch4.js`, `H.dance < 4`). He said keep it small. | Nothing. |
| C8 | Chapter 1 capture versus Chapter 2 | DONE | One `capture()` for every chapter (`src/game/25-capture.js`). The lobby uses it too. `tests/capture-rule.mjs`, `tests/ch1-lobby.mjs`. | Nothing. |

## 5d. The 2026-11-04 recording

| Id | Request | Status | Evidence | What's left |
| --- | --- | --- | --- | --- |
| P1 | Rusty's capture does not make sense | DONE | Cause line on the LOCKUP card (`src/game/25-capture.js`, `rust`). `tests/ch2-capture-cause.mjs`. | Nothing. |
| P2 | He gets stuck, and it feels like a glitch | DONE | ↺ restarts the section (`src/game/80-hud.js`). | Nothing. |
| P3 | The fuel gauge is in a confusing place | PARTIAL | "TANK EMPTY" / "TANK FULL" at the top (`src/game/80-hud.js`). | Phone picture-text is still small (B9). |
| P4 | Rusty keeps glitching what he sees | DONE | `tests/cone-match.mjs` for Rusty. | Width is a separate row (E22). |
| P5 | The goat does a weird jump going inside | DONE | "Mops goes inside." (`roomLine` in `Wh`, `src/game/20-ch2.js`). | Nothing. |
| P6 | A better way to show low fuel | PARTIAL | Same as P3. Banner and chip. | Phone picture-text. |
| P7 | Rusty looks like Mario | MISSING | The cap is still a red cap with a white "R" (`src/game/20-ch2.js`). | He said a grease cap and a fuel-drop badge (D13). Not built here. |
| P8 | The goat should walk in the door and press the action | DONE | Same as B10. | Nothing. |
| P9 | No sight lines while the goat | DONE | Same as B11. | Nothing further unless he asks for cones during the soup sneak. |
| P10 | Why whisper about the back door when already inside | DONE | He then said the whisper is fine (B27). | Nothing. |
| P11 | How did you switch back? Did you just hit next? | DONE | Switch cards with a reason in Chapter 2 (`SWITCH_WHY` in `src/game/11-ch1-hall.js`). Face tap (`src/game/80-hud.js`). `tests/ch2-switch.mjs`. | Chapter 2's first switch still uses the old card (M1). |
| P12 | Hiding behind the pump is logical, but Rusty sees him | DONE | Pump cover blocks sight. `tests/cone-match.mjs` (blocked lines are neither drawn nor seen). | Nothing. |
| P13 | Slipping under Rusty's sight feels like a glitch | DONE | Props block the space under the sprite. Same cone test. | Nothing. |
| P14 | Scrub should show a dirty dish and a paw as the sponge | DONE | Same as B19. | Nothing. |
| P15 | Gloop sees Squatch but she is okay with it | DONE | She shouts and security comes (`pf` and `sSec` in `src/game/20-ch2.js`). | The wall-alarm beat for humans is a design-rule gap, not this row. |
| P16 | On landing, locals are less worried, but be careful | PARTIAL | Same as A7. The line plays. The fear is told, not shown. | T28. |
| P17 | Window, the done line, spices, door sizes, half of Gloop | PARTIAL | Kitchen C and the 2.5 second window warning. | D12: ask what looked wrong. |
| P18 | Ducking looks weird; roll into a ball | DONE | Same as B20. | Nothing. |
| P19 | Gloop saw him, was not concerned, then the announcement | DONE | One capture rule. The window look calls security (`sSec("sink")`). | Nothing. |
| P20 | Every sighting sends security; hide and they leave; caught restarts the section | DONE | `tests/capture-rule.mjs`. "They lost you." in `lostYou`. | Mops is a shoo, which he confirmed (D9), not a lockup. |
| P21 | Pump bots have no vision lines | DONE | Same as B12. | Nothing. |
| P22 | The orders window faces out with no cook behind it | DONE | The cook is drawn in the kitchen (`src/game/20-ch2.js`). | Nothing. |
| P23 | Cook sees him and faints; Mops cooks in a chef hat; Squatch washes | DONE | Same as B14, including the cook now being on screen for her line. | Nothing. |
| P24 | Pump bots still need sight lines inside | DONE | Cones are drawn for them in the kitchen too (`f2` / `seenCone` in `src/game/20-ch2.js`). | Nothing. |
| P25 | "Scared, just like that first night" no longer fits | DONE | Same as B24. The line is gone. | Nothing. |
| P26 | "Gas money or soup" makes no sense | DONE | Hunger is the reason, and the prices are on the button (B15). | Nothing. |
| P27 | Stomach rumbles, so Mops fetches food | DONE | `*RUMBLE*` in `src/game/20-ch2.js`. `tests/kitchen.mjs`. | Nothing. |
| P28 | Show coins and prices; maybe a coin per dish | DONE | Prices are on the button. He chose the jar of coins, not a coin per dish (B28, CH2). | Nothing. |
| P29 | Coins then soup on the head; not obvious it is soup | DONE | Bowl, steam, and spoon. `tests/soup-on-head.mjs`. | Nothing. |
| P30 | LEAVE SOUP label is off to the side | DONE | The label sits beside the door in kitchen C (`src/game/20-ch2.js`). | Nothing. |
| P31 | A slow scene of the hoof making the stamp | PARTIAL | Same as B21. It plays. | A recording has not looked again. |
| P32 | After "go watch the dock", no reason to keep arguing | DONE | Same as B22 and C1. No argument follows that line. | Nothing. |
| P33 | Cutting back to the janitor in the diner is super confusing | PARTIAL | The switch card says why (`g3-front` in `SWITCH_WHY`). The cut to the diner is still there (`t2` in `src/game/20-ch2.js`). | A recording would show whether the card is enough. |
| P34 | Why would tickets matter? | DONE | The cook canon: tickets are her orders. COOK still does not pay (B17). | The "why tickets" line is answered. What COOK should do is B17. |
| P35 | Likes the mop handoff; the janitor can stay in the kitchen | DONE | Same as B18. Mops keeps the mop. | Nothing. |
| P36 | Cook wakes, screams, runs out; Gloop blames the janitor | DONE | Wake, scream, run, then "The janitor is cooking and washing?" (`src/game/20-ch2.js`). | Nothing. |
| P37 | The purple ball looks right at Squatch, unconcerned | PARTIAL | The watcher is drawn as Gloop, with a cone, for 2.5 seconds (`tests/kitchen-warning.mjs`). | A recording has not confirmed she reads as Gloop. |
| P38 | Should there be a button to switch? | DONE | Face circles. Tap a face when a switch is possible (`src/game/80-hud.js`, `O2`). | He wants both faces always (E15). That part is not built. |
| P39 | EXIT says EXIT but you go to the side | PARTIAL | The trigger sits on the spot that draws the ring (`tests/ring-equals-trigger.mjs`). | A recording has not looked at the red door again. |
| P40 | Why the crate business | DONE | He chose to keep the crate lines (D2-TV). They are `HA` in `src/game/20-ch2.js`, before the dock line. | Nothing. |
| P41 | A pump bot trying to fuel Squatch is weird | DONE | "Report him or fuel him?" is still the pump joke (`src/game/25-capture.js`). | Nothing. |
| P42 | Behind the crates, or boarding the ship? | PARTIAL | Boarding is its own spot, "BOARD · ship", and it needs a full tank. | A recording has not watched that choice. |
| P43 | "Next stop" text on the left of the screen | PARTIAL | The line was moved onto the ship. | A recording has not confirmed where it reads. |

## 5e. The 2026-11-06 recording

| Id | Request | Status | Evidence | What's left |
| --- | --- | --- | --- | --- |
| N1 | Bubbles at the bottom while the speakers are at the top | DONE | `tests/bubble-anchor.mjs`. Bubbles sit over the speaker. | Nothing. |
| N2 | "Walk to the diner door" is confusing | DONE | The chip names who acts (`tests/ch2-goal-chip.mjs`). Tap walks (`tests/phone-tap.mjs`). | Nothing. |
| N3 | You switched to the goat? How do you switch? | DONE | Switch card with a reason (`tests/ch2-switch.mjs`). | The Chapter 2 zoom card is M1. |
| N4 | Soup is an inch above his head | DONE | `tests/soup-on-head.mjs`. | Nothing. |
| N5 | How do I get back there (hide behind me) | DONE | "HIDE · crate", the chip, and the zoom-in card (`tests/zoom-cards.mjs`). | Nothing. |
| N6 | Mops in the other room, bubbles over blank air, caught, loses points, no way out | DONE | Room line, bubbles on the speaker, no lockup while Mops, no star loss. `tests/ch2-capture-cause.mjs`. | Nothing. |
| N7 | Both characters in the diner and no way out | DONE | `tests/ch2-next-step.mjs`. | Nothing. |
| N8 | "Walk to the diner door" in the kitchen, then suddenly locked up | DONE | One chip per step. The LOCKUP card names who and where. | Nothing. |
| N9 | The window and the sink are in the wrong spot again | NEEDS-BRIAN | The drawing was not moved after kitchen C. | He said ask the player what looked wrong, then a recording (D12). |
| N10 | Do I do that as Sasquatch or Mops? What is on Mops's head? | DONE | The chip names who. The bowl reads as soup. | Nothing. |
| N11 | As Mops there is nothing to do and no way to switch back | DONE | A forward action in every Chapter 2 phase (`tests/ch2-next-step.mjs`). | Nothing. |
| N12 | Found the dish job just by luck | DONE | Chip and "SCRUB · dish" / "WASH" path (`tests/ch2-goal-chip.mjs`, `tests/action-labels.mjs`). | Nothing. |
| N13 | Locked up after a dish; "counters close" means nothing | DONE | The card names who and where. The joke is "Counter's closed. Lockup's open." | Nothing. |

## 5f. The 2026-11-07 phone notes

| Id | Request | Status | Evidence | What's left |
| --- | --- | --- | --- | --- |
| M1 | Love the zoom-in on "this is Squatch"; use that technique | PARTIAL | The rule is in `docs/REVIEW-RULES.md`. Chapter 1 teaches the first hide and the first switch (`teach` in `src/game/25-capture.js`, `tests/zoom-cards.mjs`). | Chapter 2's first switch still uses the old card. He said send that one line (SWITCH2). |
| M2 | Reset is too big for something rare | DONE | Small ↺, never enlarged. Hint after 60 seconds (`src/game/80-hud.js`). | Nothing. |
| M3 | YOU tag overlaps the sound icon; one consistent rule | DONE | `tests/hud-layout.mjs` at 375 and 1100, eight states. Sound sits under the picture. | Nothing. |
| M4 | Is YOU: SQUATCH needed? | DONE | Superseded by M5. The tag is gone. | Nothing. |
| M5 | Remove the YOU tag | DONE | Removed. Faces say who (`src/game/80-hud.js`). | He wants both faces always on (E15). |
| M6 | Sound is intermittent on iPhone in Brave | DONE | Sound starts on the first touch (`src/game/00-core.js`). | Nothing in the game for Brave Shields. |
| M7 | Silent in Brave until Shields is off | DONE | The speaker says "Sound is blocked by this browser." (`src/game/90-input-shell.js`). | Nothing. It is the browser, not the game. |

## 5g. Chat with Claude, 2026-11-06 to 2026-11-08

| Id | Request | Status | Evidence | What's left |
| --- | --- | --- | --- | --- |
| E1 | The truth is the GitHub repo; archive Grok once | DONE | `docs/grok-archive/`. Threads are not re-read. | Nothing. |
| E2 | No browser-driven playtests | DONE | `CLAUDE.md`. This audit did not play the game to judge fun. | Nothing. |
| E3 | Cut work early only at high credit risk | DONE | Standing rule. | Nothing in the game. |
| E4 | The readable copy becomes the source | DONE | `src/game/`. `npm run build` writes `index.html`. Pull request 7. | Nothing. |
| E5 | Merge Phase 0 | DONE | Merge `21b9c4a`. | Nothing. |
| E6 | Chip names the step the first time, then only the goal | DONE | Chip tables and `docs/CHIP-ARMATURE-AUDIT.md`. His four chip edits are in `89dd2a0`. | Nothing. |
| E7 | The counter action is ASK · for work | DONE | `src/game/20-ch2.js`, verb ASK, cap "for work". | Nothing. |
| E8 | Joke: "Counter's closed. Lockup's open." | DONE | `src/game/25-capture.js`. | Nothing. |
| E9 | Merge Phase 1 once the run is green | DONE | Merge `9215e8b`. | Nothing. |
| E10 | The project folder is the Drive folder | DONE | Snapshots in `docs/project/`. | The Drive copy is still the live one when he can open it. |
| E11 | Remove the YOU tag | DONE | Same as M5. | Nothing. |
| E12 | Reuse the zoom-in card | DONE | `teach(id, at)` in `src/game/25-capture.js`. | Chapter 2's first switch is M1. |
| E13 | Reset stays a small ↺; a stuck player gets a hint | DONE | `src/game/80-hud.js`. 60 seconds, not 30. | Nothing. |
| E14 | One HUD zone rule with an overlap test | DONE | `tests/hud-layout.mjs`. | Nothing. |
| E15 | Face circles replace the YOU tag | PARTIAL | The active face is always shown. The other face shows only when a switch is possible (`O2` in `src/game/50-story-frame.js`, drawn in `src/game/80-hud.js`). | He said both faces always, the other one grayed when you cannot switch. Not built here. |
| E16 | Merge Phase 2, then Phase 3; new lines in a lines file | DONE | Pull requests 9 and 10. Lines files are in `docs/`. | Nothing. |
| E17 | Hold the nine departures and the switch lines for Chapters 1, 3, and 4 | PARTIAL | Chapter 1 why-lines are in (`tests/ch1-switch.mjs`). Chapters 3 and 4 call `switchTo` with no reason, so no card (`SWITCH_WHY` has no Chapter 3 or 4 keys). | Why-lines for Chapters 3 and 4 need his words. Departures he answered are in the decisions file and are not built here. |
| E18 | Fable stop line is 90%; all-models stays 75% | DONE | In effect. Not game code. | Nothing. |
| E19 | The night out gets a purpose and a visible hazard | DONE | Vent, tuft, notice. `tests/ch1-lobby.mjs`. `tests/ch1-playthrough.mjs`. | Vent numbers are still first guesses (backlog). |
| E20 | Chapter 3 sense pass, then Chapter 4 | MISSING | Not started. No seven-beat text pass in `src/game/30-ch3.js` or `src/game/40-ch4.js`. | He said start now, with no outline first (D16). Not built here. New words still go in a lines file. |
| E21 | Scrub and mop become a few seconds of rubbing that cannot be failed | NEEDS-BRIAN | Still one button press (`SCRUB · dish`, `MOP · pot` in `src/game/20-ch2.js`). | He changed this on 2026-11-08: the player may put a dish away dirty, and Gloop gets upset. Funny, not a fail. Lines to him first. |
| E22 | Rusty's sight feels too narrow; the drawn cone must equal the area | PARTIAL | The cone matches (`tests/cone-match.mjs`). The width was not changed. | He said replay first. Do not widen it in code until then. |
| E23 | Ship-window travel scenes, and optional mini-games | MISSING | No travel card and no tic-tac-toe or Connect 4 in `src/game/`. | He said both the cards and the mini-games (D18). Not built here. |
| E24 | Phone HUD: a bar, or a see-through overlay | DONE | The bar shipped (`src/game/80-hud.js`, `tests/hud-layout.mjs`). He said keep the bar. | Nothing. |
| E25 | The Nov 2 spine is not binding; ready for play means the discussed items are in | DONE | Working rule in the handover and `CLAUDE.md`. Chapter 1 is ready for play. | Chapter 2 is not ready for play until its pass. |
| E26 | Keep the heart lines; fix Wookie and slip order; keep the toy rocket; Guardians flashback is core | PARTIAL | Heart lines, order, and the rocket are in Chapter 1 (`tests/ch1-playthrough.mjs`). | The flashback is C5. Lines first. |
| E27 | Clicking a face switches; no key | DONE | `hudFaceTap` in `src/game/80-hud.js`. No switch key. | Nothing. |
| E28 | Keep the "ROBOTICS DELEGATION!" banner | DONE | Still drawn in the door-crack view. | Nothing. |
| E29 | No teaching card for the vent | DONE | `TEACH` has only `hide1` and `switch1` (`src/game/25-capture.js`). | Nothing. |
| E30 | Make the fur tuft bigger and show it earlier | DONE | `lobbyTuft` in `src/game/10-ch1.js`. Commit `77adbdb`. `tests/ch1-lobby.mjs`. | Nothing. |
| E31 | The morning report must not say fur after a clean night | DONE | The report follows what happened. Commit `5aea76f`. `tests/ch1-playthrough.mjs`. | Nothing. |
| E32 | Wait for the credit reset before the Chapter 2 pass | DONE | This pull request does not start that pass. It records answers and fixes one drawing glitch. | The Chapter 2 pass is still the later job. |
| E33 | The ghost bonus is unclear; it is spotted versus caught | DONE | It reads "Never caught! +250" (`src/game/25-capture.js`). He said keep the bonus (D2-STARS). | Nothing. |
| E34 | D11 tap to walk; D9 a bot seeing Mops is a shoo | DONE | Tap to walk is in (`tests/phone-tap.mjs`). `shoo()` is in `src/game/25-capture.js`. He confirmed shoo. | Nothing for the shoo question. |

## Backlog items that are not already a section 5 row

Plan tasks T1 to T28, the Hermes jobs, the kitchen drawing checks, and the story rows DE1 to DE8. Where a task is the same request as a section 5 row, that row above is the status and this table only says where it lives.

| Id | Request | Status | Evidence | What's left |
| --- | --- | --- | --- | --- |
| T1 | One command runs every test | DONE | `npm test` is `tests/run-all.mjs`. | Nothing. |
| T2 | Readable source and a build | DONE | `src/game/*.js`. `npm run build`. | Nothing. |
| T3 | Rule file and the review checklist | DONE | `CLAUDE.md`, `docs/REVIEW-RULES.md`. | Nothing. |
| T4 | A link opens a scene, with a state strip | DONE | `tests/debug-link.mjs`. | Nothing. |
| T5 | Chapter 2 chip names who and what | DONE | `tests/ch2-goal-chip.mjs`. Same as E6 for the rule. | Nothing. |
| T6 | Every switch is announced | PARTIAL | Chapters 1 and 2: `tests/ch1-switch.mjs`, `tests/ch2-switch.mjs`. | Chapters 3 and 4 are E17. |
| T7 | Every Chapter 2 phase has a way forward | DONE | `tests/ch2-next-step.mjs`. | Nothing. |
| T8 | Lockup says who and where; no capture as Mops | DONE | `tests/ch2-capture-cause.mjs`. | Nothing. |
| T9 | Bubbles over the speaker | DONE | `tests/bubble-anchor.mjs`. | Nothing. |
| T10 | Soup on the head | DONE | `tests/soup-on-head.mjs`. | Nothing. |
| T11 | Chapter 2 actions read VERB · thing | DONE | `tests/action-labels.mjs`. | Nothing. |
| T12 | Help names only controls that work | DONE | `tests/help-text.mjs`. | Nothing. |
| T13 | A test plays Chapter 2 with keys | DONE | `tests/ch2-playthrough.mjs`. | Nothing. |
| T14 | A phone test walks and acts | DONE | `tests/phone-tap.mjs`. | Nothing. |
| T15 | Remove the dead engine | DONE | It is not in `src/game/`. Pull request 9. | Nothing. |
| T16 | Split the source by chapter | DONE | Eleven files in `src/game/`, joined in name order. | Nothing. |
| T17 | Ring and trigger are the same spot | DONE | `spot` in `src/game/00-core.js`. `tests/ring-equals-trigger.mjs`. | Nothing. |
| T18 | VERB · thing and chips in Chapters 1, 3, and 4 | DONE | `tests/action-labels.mjs`, `tests/chapter-chips.mjs`. | Nothing. |
| T19 | One capture rule | DONE | `tests/capture-rule.mjs`. | Nothing. |
| T20 | Kitchen warning you can see | DONE | `tests/kitchen-warning.mjs`. | Nothing. |
| T21 | Phone text you can read | PARTIAL | The HUD is page text at 14 px or more (`tests/hud-layout.mjs`). | Bubbles, cards, and labels drawn in the picture are still about 8 to 15 px on a 375-wide phone. |
| T22 | Small feel fixes; COOK means something or goes | PARTIAL | Early taps, the button clearing, and award labels: `tests/feel-fixes.mjs`. | COOK is B17. He said do not remove it. |
| T23 | Tap the picture to walk | DONE | `tests/phone-tap.mjs`. | Nothing. |
| T24 | Save, and Continue on the title screen | MISSING | No Continue control. Best score uses `localStorage` only (`src/game/40-ch4.js`). | He approved the word "Continue". Not built here. Put the word in a lines file when it is built. |
| T25 | The backlog matches main | PARTIAL | This pull request adds a current-status section to `docs/MASTER-BACKLOG.md`. | The older tables below that section are history. They are marked that way. |
| T26 | Write his answers into the decisions doc | DONE | Dated section in `docs/project/DECISIONS-2026-11-08.md`. `docs/STORY-DECISIONS.md` points at it. | Nothing. The answers are not built. |
| T27 | Move the manager's office beside storage | MISSING | Same place as A26. | He said move it (D8). Not built here. |
| T28 | Show the locals' fear instead of only saying it | NEEDS-BRIAN | The arrival line is still spoken (A7). | He has not approved a shown beat or its lines. |
| H1 | Hermes checks each feedback row | DONE | `docs/FEEDBACK-CODE-CHECK.md`. | Nothing. It checked text, not play. |
| H2 | A table of every hotspot and ring | MISSING | No `docs/HOTSPOTS.csv`. | A mechanical export. Not this pull request. |
| H3 | Export the script in play order | MISSING | No `docs/SCRIPT-AS-BUILT.md` on main. Pull request 13 is open and is a different branch. | Not copied into this branch. |
| SS40 | Window, Gloop's arm, tickets through the pass | DONE | Kitchen C drawing in `src/game/20-ch2.js`. The backlog's SS40 note. | Nothing. Do not redraw the kitchen for this. |
| SS41 | Tickets move, the rail scales, NEXT stays left | DONE | Same drawing. | Nothing. |
| SS42 | The oven is a real cook station | DONE | Four burners. COOK hotspot. | What COOK does is B17. |
| SS43 | Spice jars on the counter | DONE | Three jars on a rack. | D12 if a player still says the spot looks wrong. |
| SS44 | Soup on the crate, label clear of the door | DONE | Same as P30. | Nothing. |
| DE1 | TV hide and "Go watch the dock" | DONE | Same as C1. He kept the dock line and the TV. | Nothing. |
| DE2 | What the stars are for | DONE | Same as C2. He kept "Never caught! +250". | Nothing. |
| DE3 | Soup and gas, and whether more dishes follow | DONE | Same as C3. He chose coins, and the choice ends once the gas is paid. | Nothing. |
| DE4 | Pea gag | DONE | Same as C4. Parked. | Nothing. |
| DE5 | Guardians note and the box | NEEDS-BRIAN | The note and "MY GARDIANS" are in. The reveal scene is not. | Same as C5. |
| DE6 | Zip's songs | NEEDS-BRIAN | Same as C6. | Write the riddles. |
| DE7 | Harry's dance | DONE | Same as C7. | Nothing. |
| DE8 | Two different captures | DONE | Same as C8. One rule. | Nothing. |
| BL-cook | The cook speaks before she is drawn | DONE | Fixed here. `tests/cook-order.mjs`. | Nothing. |
| BL-phone-text | Picture text on a phone is under 14 px | MISSING | Same gap as T21. The HUD test does not measure canvas text (`CLAUDE.md`). | Its own pass. He should see it on his phone before a merge of that pass. |
| BL-lobby-cover | Lobby cones see through the table and the counter | MISSING | Lobby sight is a wedge (`Ps` in `src/game/10-ch1.js`) with no furniture cut. The drawn cone uses the same wedge. | Not changed here. Cutting them would change how hard the lobby is. |
| BL-lobby-feel | The lobby is harder, and the vent timing is a first guess | NEEDS-BRIAN | Two watchers see their cones (`tests/ch1-lobby.mjs`). Vent bite is 1.5 seconds (`src/game/10-ch1.js`). | A playtest. Do not tune it in code first. |
| BL-kitchen-test | `tests/kitchen.mjs` can fail on a busy machine | PARTIAL | The suite is still one long browser run with sleeps. | Not rewritten here. `tests/cook-order.mjs` uses the game clock instead of the wall clock. |
| BL-phone-note | The 2026-11-07 phone note is not in the repo | DONE | `docs/playtests/2026-11-07-brian-phone-playtest-ch1.md` is on main (`0582333`). | Nothing. |
| BL-vent-numbers | Vent circle and fur timing are first guesses | NEEDS-BRIAN | Circle and `PULL_BITE` in `src/game/10-ch1.js`. | His feel after a play. |
| BL-switch-34 | Chapters 3 and 4 switches say why | NEEDS-BRIAN | Same as E17. | His lines, then a card. |
