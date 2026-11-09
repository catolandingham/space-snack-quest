# Master backlog

## Where this branch is (Chapter 1 redesign)

A new game plays the redesigned Chapter 1 from the Nov 8 cartoon: home, delivery room, night mailbox, six days later, the vent, the costume, and the scanner. Docs for that pass: `docs/CH1-LINES-FOR-BRIAN.md`. The home room has the wardrobe, no mop, and no vent. A balled-up Squatch is noticed only when a robot stays within 70 pixels for 2 seconds. The older night-out scenes are still reachable from a debug link. They are not the path from the title.

On pickup day the robots open a crate on the ramp by the ship. Squatch hides in a crate still in the mail room. Dot, Bob, and Lou are not there. Mops warns him, he slips out, and they walk home. The disguise is a spare blue jacket, a fake beard, and horns. Mops keeps his own jacket on. The wardrobe's spare jacket is plain blue, and that hook is empty once Squatch takes it.

The party is in this build. Squatch goes alone after bedtime, Mops stays home, and no robots are there. Not in this build yet, because the cartoon or a decision is still open: the hallway room and its photo gallery (next build, R51/R53/R55; photo gags still being picked), a full redraw of the hall, how the pink copy rides to Mars inside the Guardian Box after Squatch pockets it, Mops's extra thought in the vent, a separate FUR-alarm zoom shot, the pancake brochure at the snack stand, taking every snack and leaving food for the Guardians, new music, and the bigger iPad layout. Old Chapter 1 debug scenes still open, and they use the new home drawing. The manager's name on his bubbles is Isfred Bar Neshuman. The hiding ball is the L2 ball in this chapter and in the Chapter 2 kitchen. Ball notice is BALL_NOTICE_RADIUS (70) and BALL_NOTICE_SECONDS (2.0), the same in every room. Chapter 2's first spoken line is now "They put us off here. This is the gas stop." The rest of Chapters 2 to 4 is the same. The pink-slip code opens the manager's computer in the hall, and the Moon Pie page is on that screen, not the home TV. Walking home in this build still uses the existing hall, including its door to home. R50 is in: the manager is not at the ship when they leave. R54 is the office dialogue after that: five lines, and Isfred no longer jumps straight to the tapes.

Next build: the hallway (R51, R53, R55). R55: Hallway approved; the first walk to the loading bay is a cutscene; the hallway is interactive only on the walk home; the Employee of the Month wall is a swipeable gallery of funny Mops photos. Layout: party hall exit in the left end wall, loading bay exit in the right end wall, Employee of the Month photo wall centered on the back wall, manager office door on the front wall opposite the photos, locked with a code keypad until the code puzzle opens it, and no door to home. The room and the gallery are not in this build. The photo gags are still being picked.

Precedence: the original story stays canon except the Chapter 2 kitchen sequence, and except this Chapter 1 redesign where `docs/CH1-LINES-FOR-BRIAN.md` and the Nov 8 decisions say otherwise.

- Kitchen revision, and only that revision: `docs/story-bible.md`
- Choices still waiting on Brian, outside that kitchen: `docs/STORY-DECISIONS.md`
- Previous on-repo story note, not deleted: `docs/spine-archive.md`

A pending item stays pending until Brian decides that item. This page does not mark the rest of the backlog done. The full original attachment was not in the workspace, so it is not listed as shipped and it is not replaced.

What the game already plays is the root `README.md` and the build. Where that and an older story idea disagree outside the kitchen, the disagreement is a hold in `docs/STORY-DECISIONS.md`, not a change to the game.

## Register

PR #4 is squash-merged. `main` is `9999f0cd`. That commit has the same tree as kitchen C `6853902`. The site is not confirmed live. PR #5 is open on `main` and is not merged.

| PR | Branch | Head | Base | State |
| --- | --- | --- | --- | --- |
| #4 | `cursor/wash-presentation-f809` | `6853902`, squash `9999f0cd` | `main` | Merged. Not confirmed live |
| #5 | `cursor/p0-reliability-f809` | Restack of `17a03c2` and `0ab2781` onto `9999f0cd` | `main` | Open. Not merged. Not deployed |

The recovery commits are replayed onto `9999f0cd`. Their changes match `17a03c2` and `0ab2781`. The kitchen commits are not in this pull request.

## Chapter 1 pass (Brian's brief of 2026-11-07)

Branch `chapter-1-pass`, one commit per item with its test. Not merged. The wording of every new line waits for Brian's yes in `docs/CHAPTER-1-LINES-FOR-BRIAN.md`, which also says what Chapter 1 still does not have.

| Item | What changed | Test | State |
| --- | --- | --- | --- |
| D15 | The night out has a goal (the robot janitors notice) and a vent whose pull is drawn; capture under the one rule; the notice comes back in O5, O6 and S3; the lobby cones see what they draw; a snack counter closes the back route | `tests/ch1-lobby.mjs`, `tests/capture-rule.mjs` | Done on branch, wording pending |
| Switches | Every Chapter 1 switch shows a card with a reason, except the first (taught by the zoom-in card) and restarts | `tests/ch1-switch.mjs` | Done on branch, wording pending |
| Order | No "robot" before the notice, no "Wookie" before the flashback, no hangar code before S8, the spine's heart lines in O3 and O6 | `tests/ch1-playthrough.mjs` | Done on branch, wording pending |
| Play-through | Chapter 1 from `?ch=1` to the ship with keys (and face clicks), never caught | `tests/ch1-playthrough.mjs` | Done on branch |

Open rows found in this pass (not fixed):

| Item | What happens | State |
| --- | --- | --- |
| Switching key | There is no key for switching characters; the Chapter 1 play-through clicks the faces | Closed: Brian, 2026-11-07, clicking a face is fine |
| Lobby difficulty | The kid's and the clerk's cones now see (before, their own bodies blocked them); the vent lane is narrow (the suit's cone touches it about one crossing in seven without waiting); crossing the circle takes about 1.2 s of the 1.5 s; cones see through the table and counter | Open, wants a playtest |
| Lobby catch | A lobby catch now restarts the night and costs the +250 bonus; HIDE! after the notice skips "They lost you."; the right guard enters at (1010, 530) | Listed for Brian |
| S3 report | The PA used to say "FUR spotted in the lobby" after a clean night out | Fixed in the review: the report follows what happened (rows 25.23 to 25.25) |
| Phone playtest notes | `docs/playtests/2026-11-07-brian-phone-playtest-ch1.md` is not in the repo | Open |
| Test timing | hud-layout, phone-tap and kitchen checks failed now and then on a loaded machine; hud-layout and phone-tap now wait for the page to settle; kitchen was left as it was | Watch |

## Phase 3 (plan section 4, T19 to T23, with Brian's decisions of 2026-11-07)

Branch `phase-3-fairness-hud`, one commit per task with its test. Not merged. The wording of every new line waits for Brian's yes in `docs/PHASE-3-LINES-FOR-BRIAN.md`, which also lists what is not finished.

| Task | What changed | Test | State |
| --- | --- | --- | --- |
| T19 | One capture rule in every chapter; no star loss; checkpoint tables for Chapters 1, 3, 4; drawn cones cut where the sight line is blocked | `tests/capture-rule.mjs`, `tests/cone-match.mjs` | Done on branch, wording pending |
| HUD | Page-text HUD in fixed zones, faces, ↺ hold, sound under the picture, stall hint, game at the top on a phone | `tests/hud-layout.mjs` | Done on branch, wording pending |
| T20 | Kitchen window warning visible for 2.5 s | `tests/kitchen-warning.mjs` | Done on branch |
| T23 | Tap the picture to walk | `tests/phone-tap.mjs` | Done on branch, wording pending |
| T22 | Early taps kept, action clears in scenes, award labels say why (COOK kept as on main) | `tests/feel-fixes.mjs` | Done on branch, wording pending |
| Cards | Zoom-in cards for the first hide and the first switch (Chapter 1) | `tests/zoom-cards.mjs` | Done on branch, wording pending; Chapter 2's first switch keeps its switch card |

Open rows found during Phase 3 (not fixed):

| Item | What happens | State |
| --- | --- | --- |
| Keyboard route catch | The Chapter 2 keyboard route was seen once by Rusty while sneaking to the KITCHEN door (on main too, uncounted until T19) | Fixed: the route now waits for Rusty to walk left, goes along the bottom to under his turning spot, and leaves when he walks right; it ends with "Never caught! +250" |
| Phone chip row | On a phone the chip's own row covered the top of the picture, including the top of the kitchen order window | Fixed: on a phone the HUD is a bar above the picture |
| Canvas text on a phone | Bubbles, cards and labels drawn in the picture are still under 14 CSS px on a 375-wide phone | Open |

## Phase 2 (plan section 4, T13 to T18)

Branch `phase-2-structure`, one commit per task with its test. Not merged. The wording of every new line, and every ring that moved, waits for Brian's yes in `docs/PHASE-2-LINES-FOR-BRIAN.md`, which also lists what is not finished.

| Task | What changed | Test | State |
| --- | --- | --- | --- |
| T13 | A test plays Chapter 2 start to tally card with keys only | `tests/ch2-playthrough.mjs` | Done on branch |
| T14 | A phone test walks with the joystick and acts with the button into the kitchen | `tests/phone-tap.mjs` | Done on branch; the "game at the top" check waits for T21 |
| T15 | The dead engine is removed (3,515 lines) | `node tools/equivalence.mjs 9215e8b`, `npm test` | Done on branch; the title cards keep "Stormtop Station" and "Asteroid Belt Gas Stop" |
| T16 | Source split into files by chapter; `npm run rename` | `npm run check-build`, `npm test` | Done on branch; one rename (k to ch2) |
| T17 | Every ring is drawn from the spot that decides where its action works | `tests/ring-equals-trigger.mjs` | Done on branch; ring moves listed for Brian |
| T18 | "VERB · thing" and goal chips in Chapters 1, 3 and 4 | `tests/action-labels.mjs`, `tests/chapter-chips.mjs` | Done on branch, wording pending |

## Phase 1 (plan section 3, T5 to T12)

Merged to `main` as PR #8 (`9215e8b`). The wording of every new line waits for Brian's yes in `docs/PHASE-1-LINES-FOR-BRIAN.md`, which also lists what is not finished.

| Task | What the player will notice | Test | State |
| --- | --- | --- | --- |
| T7 | No dead ends: BACK · kitchen, Squatch washes after the soup, g4l resets to the dishes | `tests/ch2-next-step.mjs` | Done on branch |
| T5 | Goal chip names who acts and what to do | `tests/ch2-goal-chip.mjs` | Done on branch, wording pending |
| T6 | Switch cards with a reason, YOU tag, room-change lines | `tests/ch2-switch.mjs` | Chapter 2 done on branch; Chapters 1, 3, 4 why lines not written |
| T8 | No capture while Mops; free shoo; LOCKUP says who and where | `tests/ch2-capture-cause.mjs` | Done on branch, wording pending |
| T9 | Bubbles over the speaker, one at a time, ear at the door | `tests/bubble-anchor.mjs` | Done on branch |
| T10 | Soup bowl on Mops' head | `tests/soup-on-head.mjs` | Done on branch |
| T11 | "VERB · thing" on every Chapter 2 action, 16 px button text | `tests/action-labels.mjs` | Done on branch, wording pending |
| T12 | Help names only working controls | `tests/help-text.mjs` | Done on branch, wording pending |

Open rows found during Phase 1 (not fixed):

| Item | What happens | State |
| --- | --- | --- |
| g6d reset | Reset section in g6d (or in g6 once Mops has the coins) puts the player back as Squatch on the lot, and the ship can be boarded without filling the tank | Fixed in Phase 3 (review group 1): BOARD needs a full tank; those restarts go to Mops with the coins or the diner jar |
| Cook's first line | The cook says "A WOOKIE!" before she is drawn; she only appears once she is on the floor | Open |
| Playtest issue 9 | Window and sink read as being in the wrong spot | Open, waits on decision D12 |

## SS40–SS44

Kitchen C at `6853902` is the pass for these five checks. The ground drawing is one floor line: the full-height diner door, the counter, and the spice rack share it. Pastdraw is the galley through `db3a82c`. QA note `df55e0c` reviewed `d4e3714` (that note is not a commit) and is part of pastdraw.

| ID | Check | `main` `32156c7` | Pastdraw | Kitchen C `6853902` |
| --- | --- | --- | --- | --- |
| SS40 | Window, Gloop's arm and hand, tickets through the pass | Older galley. This pass does not apply | `d4e3714`: phone tickets and the arm failed that review. `db3a82c`: arm, hand, and ticket ink passed | PASS. Pass about 300 wide. The arm reaches the right ticket. The hand is visible |
| SS41 | Tickets move right to left, the rail scales, NEXT stays on the left | Older galley. This pass does not apply | `d4e3714`: a one-ticket rail stayed full width. `db3a82c`: the rail scales | PASS |
| SS42 | The oven is a real cook station | Older galley. This pass does not apply | `d4e3714`: the oven sat under the pass and the COOK label was hidden | PASS. Four burners in the counter. Cook hotspot x 800 |
| SS43 | Spice storage sits on the counter | Older galley. This pass does not apply | `db3a82c`: the spice area was still a strange high cabinet | PASS. Three jars on a rack on the counter, with posts down to the counter |
| SS44 | Soup on the crate, label clear of the door | Older galley. This pass does not apply | `db3a82c` failed. The LEAVE SOUP chip covered the DINER door | PASS. The bowl is on the crate. The chip is beside the door. DINER reads |

No further layout review is open for that drawing. Later work does not redraw the kitchen.

## Story rows

These rows record what was on screen. They do not resolve `docs/STORY-DECISIONS.md`. Brian still decides each item.

An older mark said `32156c7` / current false for DE1, DE2, DE3, DE5, and DE8. That mark is retired. The status is the capture below.

The story shots are from the capture on this stack before `17a03c2`. PR #5 does not retune TV, stars, prices, or those notes. The soup purchase and the Chapter 2 pen were played again at `17a03c2`.

| ID | On screen | Still open |
| --- | --- | --- |
| DE1 | Station PA: "WOOKIE SPOTTED IN SPACE! Last seen near Stormtop." Hide badge "HIDE! 6". Gloop: "Bots! Go watch the dock." | Whether the TV hide stays. The crate-watch exchange was not in the saved shots |
| DE2 | "+50 SECRET!", "+100 SNEAKY!", "+25 FUNNY FIND!", and "★ = points for finds." | What the stars are for. A Chapter 1 loss of 100 stars was not in the capture |
| DE3 | At `17a03c2` a soup buy stayed durable across Reset section: jar 0, register 30, soup in hand. The chapter map on screen is "Talk to Grandma Gloop at the diner counter" and the fuel line | More dishes after soup and gas. A chili wash was not the scene on screen |
| DE5 | Soup note: "You're not alone out here." signed "— The Guardians", with a paw print | The Chapter 1 box, "Brave Sasquatches stay hidden", and the lid spelling were not in the capture |
| DE8 | Chapter 1 alarm: "WOOKIE ALERT! PROTECT THE AIR SCRUBBERS!" At `17a03c2`, Rusty said "SECURITY! A Squatch on the lot!" while control was still on. LOCKUP followed about two seconds later. Space then landed at the gas entrance (760, 540) with jar 12 and coins still in hand | Whether the two captures stay separate. A later Mops pen was not played |

DE4, DE6, and DE7 stay pending in `docs/STORY-DECISIONS.md`. This page does not mark them verified. Zip's songs and Harry's dance were not on screen. The pea gag was not on screen.

## Reset section

Shipped in PR #5 at `17a03c2`. The control is the Reset section button and the R key, held about three quarters of a second. It is the build, not an open design goal.

Independent QA at `17a03c2` used the mouse, the keyboard, and a coarse-pointer finger:

- A short click, and R released before 0.75s, left the player where he was.
- A finished hold restarted once. A later hold restarted again.
- Bought soup survived: jar 0, register 30, soup in hand, 55 stars, the find kept. Landing was the wash 5 crate, (230, 520).
- A finished wash set left the jar at 30. Reset left it at 30.
- Unknown phase `g5`, after a wash 5 note, returned to wash 5 with the soup. The gas entrance and a chapter wipe did not run.
- Rusty warned first, then the pen, then the gas entrance with control back. Space cleared the card. The landing did not catch him again.
- Phone width 396: Reset section at (14, 605), 148 by 44, canvas overlap 0. A finger hold restarted the section and kept the soup. The pen, NEXT, and Reset sat apart.
- The desktop R bar sits on the canvas floor. The button sits under the keyboard sentence.
- Pump sight: open ground is visible. Under the pump, the far side, and a ray through the body stay blocked.
- A walk into the kitchen crate stopped on the crate's free left edge, x 130.

The pass drove wash 5, wash 1, `g1`, and unknown `g5`. The other checkpoint rows are the implementation table in `docs/README.md`. The play-mode chapter restart was not played. This is not a full pass of every note in the backlog.

## Still open

- Boarding caption. A g3 shot in the story capture is the dock line, not an explicit boarding caption.
- DE4, DE6, and DE7.
- Checkpoint rows the independent pass did not drive.
- Any item not named in the tables above.

## Changelog

2026-11-07. Chapter 1 pass on branch `chapter-1-pass` (D15 night out, Chapter 1 switch cards, order fixes, Chapter 1 tests), not merged.

2026-11-07. Phase 1 is on `main` as PR #8 (`9215e8b`). Phase 2 (T13 to T18) is on branch `phase-2-structure`, not merged.

2026-11-06. Recorded PR #4 at `6853902` and PR #5 at `17a03c2`. SS40–SS44 pass on kitchen C, with pastdraw and `main` called out separately. DE1, DE2, DE3, DE5, and DE8 use the shots and the recovery pass. Reset section is shipped in PR #5, with the independent checks listed above. The rest stays open.

2026-11-06. PR #4 is on `main` at `9999f0cd`. Deploy is not confirmed. PR #5 is restacked onto that commit and stays open.
