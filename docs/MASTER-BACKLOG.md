# Master backlog

Precedence: the original story stays canon except the Chapter 2 kitchen sequence.

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

## Phase 3 (plan section 4, T19 to T23, with Brian's decisions of 2026-11-07)

Branch `phase-3-fairness-hud`, one commit per task with its test. Not merged. The wording of every new line waits for Brian's yes in `docs/PHASE-3-LINES-FOR-BRIAN.md`, which also lists what is not finished.

| Task | What changed | Test | State |
| --- | --- | --- | --- |
| T19 | One capture rule in every chapter; no star loss; checkpoint tables for Chapters 1, 3, 4; drawn cones cut where the sight line is blocked | `tests/capture-rule.mjs`, `tests/cone-match.mjs` | Done on branch, wording pending |
| HUD | Page-text HUD in fixed zones, faces, ↺ hold, sound under the picture, stall hint, game at the top on a phone | `tests/hud-layout.mjs` | Done on branch, wording pending |
| T20 | Kitchen window warning visible for 2.5 s | `tests/kitchen-warning.mjs` | Done on branch |
| T23 | Tap the picture to walk | `tests/phone-tap.mjs` | Done on branch, wording pending |
| T22 | Early taps kept, action clears in scenes, COOK gone, award labels say why | `tests/feel-fixes.mjs` | Done on branch, wording pending |
| Cards | Zoom-in cards for the first hide (Chapters 1 and 2) and the first switch (Chapter 1) | `tests/zoom-cards.mjs` | Done on branch, wording pending; Chapter 2's first switch keeps its switch card |

Open rows found during Phase 3 (not fixed):

| Item | What happens | State |
| --- | --- | --- |
| Keyboard route catch | The Chapter 2 keyboard route was seen once by Rusty while sneaking to the KITCHEN door (on main too, uncounted until T19) | Fixed: the route now waits for Rusty to walk left, goes along the bottom to under his turning spot, and leaves when he walks right; it ends with "Never caught! +250" |
| Phone chip row | On a phone the chip's own row covers the top of the picture, including the top of the kitchen order window | Open, Brian's call |
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

2026-11-07. Phase 1 is on `main` as PR #8 (`9215e8b`). Phase 2 (T13 to T18) is on branch `phase-2-structure`, not merged.

2026-11-06. Recorded PR #4 at `6853902` and PR #5 at `17a03c2`. SS40–SS44 pass on kitchen C, with pastdraw and `main` called out separately. DE1, DE2, DE3, DE5, and DE8 use the shots and the recovery pass. Reset section is shipped in PR #5, with the independent checks listed above. The rest stays open.

2026-11-06. PR #4 is on `main` at `9999f0cd`. Deploy is not confirmed. PR #5 is restacked onto that commit and stays open.
