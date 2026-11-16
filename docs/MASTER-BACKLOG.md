# Master backlog

**[`DECISIONS.md`](DECISIONS.md) is the single source of truth for decisions.** If this page disagrees with it, `DECISIONS.md` wins. Where things stand is [`STATE.md`](STATE.md). Open asks are [`OPEN-ASKS.md`](OPEN-ASKS.md).

## Where main is (Chapter 1 redesign)

2026-11-13. Brian said yes, merge (without the beard gag). PR #21 (locked rooms) and PR #23 (lunch through the ship) are on main. Walks between the locked pictures stay on the picture, at the doors. The opening keeps control and shows the sing-along chip. The locked bedroom's blue G box and mop bucket block the walk. Mops's beard hangs to the floor. There is no mop prop and no cut-in at the bucket. The title screen no longer logs "Va is not defined" every frame. Sentences below that say the hallway is not built, or that Day 2 is not merged, are from before those merges. Locked pictures stay in `docs/locked-rooms/`. Do not redraw a room freehand, and do not change these files, without Brian's yes and a new locked version. Pull requests #12, #13, #15, and #16 were read against `OPEN-ASKS.md`. New leftovers are section G there. Docs match main: yes.

A new game plays the redesigned Chapter 1 from the Nov 8 cartoon: home, delivery room, night mailbox, six days later, the vent, the costume, and the scanner. Docs for that pass: `docs/CH1-LINES-FOR-BRIAN.md`. The home room has the wardrobe, no mop, and no vent. A balled-up Squatch is noticed only when a robot stays within 70 pixels for 2 seconds. The older night-out scenes are still reachable from a debug link. They are not the path from the title.

On pickup day the robots open a crate on the ramp by the ship. Squatch hides in a crate still in the mail room. Dot, Bob, and Lou are not there. Mops warns him, he slips out, and they walk home. The disguise is a spare blue jacket, a fake beard, and horns. Mops keeps his own jacket on. The wardrobe's spare jacket is plain blue, and that hook is empty once Squatch takes it.

This pull request plays Chapter 1 from the morning after the party through the ship (walkthrough beats 22–61). It is stacked on the party slice (PR #21) and is not merged. A separate preview may serve this branch. The live site stays on main. Preview saves use ssq-day2- keys. After the FUR alarm he runs home, then Day 2 replaces the old paper order: the pink and yellow copies go in the bin, Squatch paw-checks them at night, posts the yellow copy, and the vent takes the pink sheet in a cutscene. The hallway, the photo wall, the office keypad, the brochure, the Mars letter, the goat costume, and the call from the base are in this build. Beat 2 is still a stand-in. The song, the wedding dances, the dance game, karaoke, the guard search, the new homecoming words, the TV story, and the bedtime story are still the other slice's job.

The party is in this build. Squatch goes alone. Mops stays home, and no robots are there. A kid's balloon takes about 6 seconds to reach the ceiling (R59). After the party it stays in the hall and pops once on the last visit (R61). Giving it back is silent and safe. Keeping it starts the alarm. Ignoring it only makes the kid sad. An octopus hug, a photo corner, and a third-snack spill are in (R60). The pair hunt is not. A photo that includes him is worth 25 points (`PHOTO_BONUS`, approved by Brian on 2026-11-09, not drawn). Guests look at a snack spill for 4 seconds (`SNACK_LOOK_SECONDS`, approved the same day).

In this build: the hallway between the party hall and the loading bay, a five-photo wall (optional), the office keypad, the pancake brochure, the readable Mars NO letter, taking the snacks and leaving food, and the pink slip tucked into the Guardian Box. Still open: a full redraw of the hall to the locked art, Joe's music file, the keepsake's point value, and the bigger iPad layout. Old Chapter 1 debug scenes still open, and they use the new home drawing. The manager's name on his bubbles is Isfred Bar Neshuman. The hiding ball is the L2 ball in this chapter and in the Chapter 2 kitchen. Ball notice is BALL_NOTICE_RADIUS (70) and BALL_NOTICE_SECONDS (2.0), the same in every room. Chapter 2's first spoken line is now "They put us off here. This is the gas stop." The rest of Chapters 2 to 4 is the same. The pink-slip code opens the manager's computer in the hall, and the Moon Pie page is on that screen, not the home TV. Walking home in this build still uses the existing hall, including its door to home. R50 is in: the manager is not at the ship when they leave. R54 is the office dialogue after that: five lines, and Isfred no longer jumps straight to the tapes.

Next build: the hallway (R51, R53, R55). R55: Hallway approved; the first walk to the loading bay is a cutscene; the hallway is interactive only on the walk home; the Employee of the Month wall is a swipeable gallery of funny Mops photos. Layout: party hall exit in the left end wall, loading bay exit in the right end wall, Employee of the Month photo wall centered on the back wall, manager office door on the front wall opposite the photos, locked with a code keypad until the code puzzle opens it, and no door to home. The room and the gallery are not in this build. The photo gags are still being picked.

The live rule is `docs/DECISIONS.md` (W27: the Nov 2 spine is not binding). The kitchen revision is still `docs/story-bible.md` (R28). The Chapter 1 redesign on `main` follows `docs/CH1-LINES-FOR-BRIAN.md` and the decisions in `docs/DECISIONS.md`.

The precedence below is **Superseded** as the live rule.

- Kitchen revision: `docs/story-bible.md`
- The older eight questions, with answered items no longer marked pending: `docs/STORY-DECISIONS.md`
- Previous on-repo story note, not deleted: `docs/old/spine-archive.md`

This page does not mark the rest of the backlog done, and it does not change the game. What the game already plays is the root `README.md` and the build on `main` (Chapter 1 redesign `aed0c4f`, party `e0e16d4`, on top of `10030f6`). A story note does not add a mechanic.

## Register

**Superseded** as the live status of `main`. This register describes `main` at `9999f0cd`. Later, `main` was `10030f6` (PRs #7 through #11). It now also has the Chapter 1 redesign (PR #19) and the party (PR #20). Render publishes `main`. Brian wrote yes on 2026-11-10 to merge [PR #17](https://github.com/catolandingham/space-snack-quest/pull/17) and [PR #18](https://github.com/catolandingham/space-snack-quest/pull/18). PR #17 still conflicts with the Chapter 1 code now on `main`, so it is not merged here. It also edits this page, `README.md`, `docs/old/CHIP-ARMATURE-AUDIT.md`, `docs/old/project/DECISIONS-2026-11-08.md`, `docs/old/project/STATE-2026-11-08.md`, and adds `docs/LATER-CHAPTERS-LINES-FOR-BRIAN.md`. PR #18 does not change the game.

Kept, as the history of that older register:

PR #4 is squash-merged. `main` was `9999f0cd`. That commit has the same tree as kitchen C `6853902`. PR #5 later merged.

| PR | Branch | Head | Base | State |
| --- | --- | --- | --- | --- |
| #4 | `cursor/wash-presentation-f809` | `6853902`, squash `9999f0cd` | `main` | Merged. "Not confirmed live" is **Superseded**: Render publishes `main` |
| #5 | `cursor/p0-reliability-f809` | Restack of `17a03c2` and `0ab2781` onto `9999f0cd` | `main` | **Superseded** as "open": merged |

History of PR #5: the recovery commits were replayed onto `9999f0cd`. Their changes match `17a03c2` and `0ab2781`. The kitchen commits were not in that pull request. PR #5 is merged.

## Chapter 1 pass (Brian's brief of 2026-11-07)

Branch `chapter-1-pass`, one commit per item with its test. **Superseded** as "not merged": merged to `main` as PR #11. The wording of every new line from that pass is in `docs/CHAPTER-1-LINES-FOR-BRIAN.md`, which also says what Chapter 1 still does not have. The later cartoon words are in `docs/CH1-CARTOON-LINES.md` and are not in the game.

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
| Phone playtest notes | `docs/old/playtests/2026-11-07-brian-phone-playtest-ch1.md` is not in the repo | Open |
| Test timing | hud-layout, phone-tap and kitchen checks failed now and then on a loaded machine; hud-layout and phone-tap now wait for the page to settle; kitchen was left as it was | Watch |

## Phase 3 (plan section 4, T19 to T23, with Brian's decisions of 2026-11-07)

Branch `phase-3-fairness-hud`, one commit per task with its test. **Superseded** as "not merged": merged to `main` as PR #10. The wording of every new line is in `docs/PHASE-3-LINES-FOR-BRIAN.md`, which also lists what is not finished.

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

Branch `phase-2-structure`, one commit per task with its test. **Superseded** as "not merged": merged to `main` as PR #9. The wording of every new line, and every ring that moved, is in `docs/PHASE-2-LINES-FOR-BRIAN.md`, which also lists what is not finished.

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

These rows record what was on screen. They do not change the game. Brian's answers are in `docs/DECISIONS.md`. The same picks are written on `docs/STORY-DECISIONS.md`, and an answered item there is not shown as pending.

An older mark said `32156c7` / current false for DE1, DE2, DE3, DE5, and DE8. That mark is retired. The status is the capture below.

The story shots are from the capture on this stack before `17a03c2`. PR #5 does not retune TV, stars, prices, or those notes. The soup purchase and the Chapter 2 pen were played again at `17a03c2`.

| ID | On screen | Still open |
| --- | --- | --- |
| DE1 | Station PA: "WOOKIE SPOTTED IN SPACE! Last seen near Stormtop." Hide badge "HIDE! 6". Gloop: "Bots! Go watch the dock." | **Answered** (L7, L8). Keep the TV warning and the crate hide. Cut the arguing after the dock line. Keep "Bots! Go watch the dock." |
| DE2 | "+50 SECRET!", "+100 SNEAKY!", "+25 FUNNY FIND!", and "★ = points for finds." | **Answered** in part (K17). Keep the stars and "Never caught! +250". A catch does not take stars (K9). Still open: the hidden +100 awards versus "points for finds" (O25) |
| DE3 | At `17a03c2` a soup buy stayed durable across Reset section: jar 0, register 30, soup in hand. The chapter map on screen is "Talk to Grandma Gloop at the diner counter" and the fuel line | **Answered** in part (L4, S3). The chili path is retired. Soup stays. Gas is **Superseded** in part by another ride. The ride itself is still open (O17) |
| DE5 | Soup note: "You're not alone out here." signed "— The Guardians", with a paw print | **Answered** (S58, S59). The player learns Mops writes the notes. Squatch does not. "MY GARDIANS" stays. Where the Chapter 2 flashback sits is still open (O18) |
| DE8 | Chapter 1 alarm: "WOOKIE ALERT! PROTECT THE AIR SCRUBBERS!" At `17a03c2`, Rusty said "SECURITY! A Squatch on the lot!" while control was still on. LOCKUP followed about two seconds later. Space then landed at the gas entrance (760, 540) with jar 12 and coins still in hand | **Answered** (K9, L3). One capture rule everywhere. A kitchen bot that sees Mops shoos him. He is not locked up |

DE4, DE6, and DE7 are **Answered** in `docs/STORY-DECISIONS.md`. The pea gag stays parked (L9). Zip's beat is a riddle, not songs (L17). Harry's dance stays small: four presses and Mops's "Baaa" (L18). This page does not mark them built. They were not on screen in the capture.

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

Live open questions are `docs/DECISIONS.md` §9 and `docs/OPEN-ASKS.md`. The leftovers from this older page:

- Boarding caption. A g3 shot in the story capture is the dock line, not an explicit boarding caption.
- DE4, DE6, and DE7 are answered (see the story rows). They are not built.
- Checkpoint rows the independent pass did not drive.
- Any item not named in the tables above.
- Chapter 1 problems: `docs/CHAPTER-1-PROBLEMS.md`, nineteen items in ranked order. 1 to 10 came from the kid robot. 11 to 19 are where Day 1 differs from the walkthrough. Fix one per pull request.
- An Easter egg Brian asked for and nobody built: Mops says "I'm goating in space", once, where it is unexpected and easy to notice (his message t88u). New words, so it needs his yes.

## Chapter 1 replot, recorded and not built

`docs/DECISIONS.md` rows R29 through R63 are the Nov 8–9 cartoon decisions. R29–R57 cover the home wardrobe, no home vent, the pickup-day crate, the spare blue jacket disguise, Isfred Bar Neshuman, ball-hide timing, the office computer, the connecting hallway, the party with no Mops and no robots, the office cutscene, and the Employee of the Month gallery (5 photos, crooked photo #4, keepsake points still open). R58–R63 are not in the game. R58: returning the balloon gets a wordless smile, a finger to the lips, and a thumbs-up; keeping it makes the kid yell "Scary Wookiee!" (NEEDS BRIAN), pulls the FUR alarm, and brings security; never jumping sends the balloon to the ceiling, the kid is sad, and nothing else happens. R59, delegated by Brian: the kid gasps with "!" and points, then a 6-second wobbly glowing rise while grabbable, one jump grabs it, and it reads with no words. R60: the pair hunt is dropped; a "Find someone who…" picture card is proposed and pending Brian; the octopus is an over-snacked, huggy tourist ("*hic* Fellow tourist!", NEEDS BRIAN) whose two hugs knock the disguise off; a photo corner lets Squatch enter the shot, then a cut to a printing Polaroid, with bonus points if he is in it (amount open); tapes proof is dropped; the third snack-table grab starts a chain reaction that pushes things off the far end and gives a hide window (4-second placeholder, needs Brian). R61: the balloon stays in the party hall later (on the ceiling if missed, tied near the kid's spot if returned) and pops quietly with a comic "POP!" (NEEDS BRIAN) on the last Chapter 1 hall visit. R62: funnier gags are things worn as horns, something in his mouth, and random things on his head, about 16, the Squatch ball-roll photobomb stays, and the crooked photo stays #4; the crayon drawing reads as Squatch and Mops with "Always tied together" (NEEDS BRIAN) underneath; controls are left and right arrows under the photo plus an X that is always visible; swiping past photo 5 always triggers "BEEP BEEP" (NEEDS BRIAN) and the gallery cuts out. R63: kid-handwritten "MOPS" and "ME" (NEEDS BRIAN), and a dotted sight line from Mops to Squatch with hearts rising from it, contrasting with the "!" other characters get. They are not in the game. New on-screen words are marked NEEDS BRIAN in `docs/CH1-CARTOON-LINES.md`. Ball-hide numbers (R43, about 70px for 2 seconds), the 6-second rise (R59), and the 4-second snack-table placeholder (R60) are written down only. This page does not change a timer, a price, or a range in the build.

## Changelog

2026-11-16. Beat 1, bedroom walk and Guardian box (Brian: "Make Squatch walk smoothly around the crate instead of glitching. Let's put the guardian crate in the closet and they can get it out later."). Cause of the glitch: in the opening scene the game still used old solid spots for the bed and bucket that did not match the picture, so Squatch snapped sideways at invisible edges; and Mops walking to the door shoved him. Now the solid spots match the picture, Mops does not shove him while walking, and the blue Guardian box is not in the room on day 1. Locked picture changed with Brian's yes (Nov 16, 12:50 PM PT): `home-room-empty-closed-v5.png` and `home-room-empty-open-v5.png` are the locked home room. v4 is kept. On day 2 "PUT · box" is at the closet, and after that the box sits out on the floor by the bed (drawn by the game, solid). No new words. New check `tests/bedroom-walk.mjs`. Docs match main: yes.

2026-11-16. Latest calendar correction: FUZZUARY alone beneath MOONMUNCH; Homework and Sing with Mops removed; "Wash outside windows (remember space suit!)" added, wrapping into the next blank day. Margin bite slightly enlarged while preserving the whole grid. Removing calendar Homework does not cancel desk homework. Added replacement/absence/depth checks and a real NEXT-button tap for day-two continuation. Hosted run 43907229073 (preceding build) passed 44/45 suites but stopped at the calendar because the touch runner ignored visible NEXT when movement control was off; runner now taps the actual visible NEXT instead of waiting. This is distinct from the older party-catch failure. No full-green claim for this revision. Independent incremental review found no new blockers; portrait-phone small text remains documented. Docs match main: yes.

2026-11-16. Feedback coverage audit: archived the complete latest Chapter 1 iPad machine transcript as `docs/grok-archive/ch1-ipad-playtest-2026-11-15.txt`. Earlier issue 54 notes were a grouped summary, not the full transcript. Correcting its stale party-first/offline-check handoff; preserve opening-room-first order and all later party feedback. Original older 24-minute Chapter 2 transcript remains unavailable in the repo (section B of FEEDBACK-INDEX is reconstructed feedback, not verbatim evidence). Cursor opened PR 59 at 17:06 UTC with code/docs changes; Brian was alerted, no Cursor work copied or merged.

2026-11-16. Verification boundary: the preceding calendar build (2f6f6e3, hosted run 43903980438) finished with 44 of 45 suites passing. The only failed suite was ch1-kid-play: a party catch returned Squatch to O1 and play stayed stuck (documented problem 1). The revised calendar has 52 focused checks passing plus the story route, opening scene, target and locked-room suites; its full hosted run must still be checked separately. No full-pass or merge claim.

2026-11-16. Latest calendar revision, PR 58 unmerged: Brian requested a smaller, less obvious paper bite, fake month names, a calendar sponsor, "family Olympics night" and other fitting entries on random days. The close-up is wider to fit the entries. Draft copy: Fuzzuary / Moonmunch / Napril; Sponsored by MOON PIES; day 2 Sock hunt, 6 Homework, 9 family Olympics night, 12 Sing with Mops, 18 Blanket fort night. The circled pie stays in column four, row three (day 14). Dates are fixed scattered decoration, not new story events or randomized clues. The tiny margin nibble leaves the whole grid intact; two tiny crumbs fade quickly. Added rendered-text and grid-preservation checks; 52 focused checks pass. Exact new wording awaits Brian's visual sign-off, not permission to invent additional story beats. Locked room files unchanged. No merge/deploy. Docs match main: yes.

2026-11-16. Calendar review follow-up, PR 58 still unmerged: no seated walking LOOK target and no inspection during the automatic get-up hop. The paper bite's outline stays open at the page edge. Added seated/hop guards and a rendered-edge regression check; 44 calendar checks pass across computer and phone. Full hosted suite remains pending, not a full-pass claim. Independent incremental review found no blockers. Docs match main: yes.

2026-11-16. Bedroom calendar (Brian: "Let’s make the calendar Tappsble, that’s fine - create a closeup view. Try to add something funny." / "No need for a clip. Focus on the other items."). Tap the visible calendar in the opening room or use LOOK beside the wardrobe. A close-up matches the locked calendar's red pin, red strip, 5-by-4 grid and circled Moon Pie. Tap the printed snack for a scalloped bite out of the paper and paper crumbs; the delivery clue stays recognizable. X or the existing NEXT button closes it. The scene and queue pause while inspecting; reopening remembers the bite until a new game. Day 2 uses the same close-up and resumes the existing lunch sequence on close. No new words; no locked image changes. Test: `tests/calendar-closeup.mjs`, plus updated story-route and target checks. PR 57 is separate, not merged. Docs match main: yes.

2026-11-16. Opening-room decisions retained from Brian's prior approval: closet look "Mops's costumes. And my Guardian Box."; bed flop then hop up, "Not sleepy anymore." The desk is homework, not "Mops's work lists. Boring."; homework is to pass time after Mops's goodbye until evening. Homework wording still needs Brian's yes. These looks and homework are NOT implemented by the calendar change. TV waits for beat 20. The floating purple bed bar, bucket readability/carrying, and music remain open. Do not treat this calendar PR or PR 57 as sign-off on the whole beat.

2026-11-15. New words, Brian yes: the goat says "Weeeennnttt", "make weeeennntt with hyphens like you did with baaa". In the home song Mops now answers "♪ Weeee-eenn-nnttt! ♪" instead of "♪ Baaa-aa-aaa! ♪". Nothing else changes. Checks updated: `tests/opening-song.mjs`, `tests/ch1-playthrough.mjs`. Docs match main: yes.
2026-11-15. Party hall made solid (Brian: "Make the party hall solid so Squatch can't walk through walls, the stage, or guests"). At the party Squatch now stays on the floor below the back wall and stops at the stage, the poster, the snack bar and its stools, both plants, the snack table, the camera tripod, and every guest (the balloon kid and the octopus too). The old hall boxes are not used at the party. Guests block walking only, not sight, so the doorway sneak still works as before. Not fixed here: security guards still walk through the bar, and a tap-to-walk can still stop at something in the way (CHAPTER-1-PROBLEMS item on tap walks). No new words, no locked picture changed. New check `tests/party-solid.mjs`. Docs match main: yes.
2026-11-15. Test fix, no change in play. GitHub showed pull request 51 as passing even though one check failed: the workflow piped `npm test` into `tee`, so the step took the exit code of `tee`. The workflow now sets `pipefail`, so a failed suite turns the check red. The failed check, in `tests/slice-p6.mjs`, still expected Isfred's party line low in the room, clear of an old office desk; since the stage fix his line points at him on the stage, and the check now says that. No new words. Docs match main: yes.
2026-11-15. Docs only, no change in play. Brian: "Yes, add the test-count line to both projects' instructions." The README now says that while GitHub's checks are off, a pull request is merged only after the full suite passes locally and the pass count is pasted in a pull request comment. Docs match main: yes.

2026-11-15. Party hall fix 1, the stage (CHAPTER-1-PROBLEMS fix order): the ROBOTICS DELEGATION! banner moves from mid-floor to hang above the stage; Isfred (the horned guest) now stands on the stage instead of among the guests, and his peek line points at him there; the "COMING SOON!" robot poster (Brian yes, 2026-11-15: "Approve the poster wording COMING SOON! for the party hall") stands on legs beside the stage. No other new words. New check `tests/party-stage.mjs`. While Isfred speaks, his bubble covers the banner; Squatch reads it right after, on "Robots?".

2026-11-15. Singing or music, never both (Brian): the warm background music now fades out while anyone sings (the home song at the door, a song tune still playing, or Squatch at the party mic) and fades back in after. One shared fix in `00-core.js` (`singNow`), so every song bubble in the game gets it. New check in `tests/opening-song.mjs`. No new words.

2026-11-15. Docs only, no change in play. Party hall room sheet and a graded picture check in `docs/CHAPTER-1-PROBLEMS.md` (16 checks, 15 fail, with a fix order). New decisions R107 (bartender behind the snack bar; Squatch can hide behind it when nobody is there; no sign) and R108 (fur into the floor vent when Squatch is close without his disguise). `docs/START-HERE.md` now says the walkthrough does not hold every room decision, and adds a picture check step to the loop. A pull request template asks for that check. `tools/hall-still.mjs` takes a full-size still of the hall. Pull request 48 (sneak) merged with Brian's yes; its goal words are approved. Docs match main: yes.

2026-11-14. Scene 1 sneak (beat 4, problem 13): the player now steers Squatch from his doorway to the middle plant and presses HIDE (it used to walk itself). The yellow guest by the door faces the stage 3.5s, turns 0.4s, looks toward the plant 2s with a sight cone, turns back. Seen in the open: a red "!", then Squatch goes back to his doorway to try again. New goal words "Squatch: sneak to the plant" (pending Brian yes). Code in `15-ch1-scene1.js` (`ch1SneakStart`, `ch1SneakTick`, flag `n.ch1PlantSneak`; `n.ch1Sneak` is a different Day 2 flag). Checks added to `tests/scene1-morning.mjs`; "HIDE · plant" added to `tests/ch1-playthrough.mjs`.

2026-11-14. Scene 1 peek (beat 3, problem 12): Squatch stands in his doorway (half hidden in the bottom wall gap) instead of walking into the hall; the hall is full on the first frame (no guests popping in); the goal bar is empty during the peek; new muffled line from Isfred "Mmf mmf... mm-mmf... mmf!" (Brian yes, Nov 14); "Robots?" now plays once, at the door (the second copy in the plant is gone). Checks added to `tests/scene1-morning.mjs`; `tests/ch1-playthrough.mjs` word order updated.

2026-11-14. Scene 1 morning (beats 1–2, problems 6 and 7): short morning bubbles ("Morning, Squatch." / "Big party in the hall tonight." / "Party?" / "Stay in here."), Squatch hops out of bed, Mops hums at the door and they sing there as his goodbye, "That evening…", then the peek goal. One bucket (the old code bucket and bed are no longer drawn over the room picture; the picture is used from the first moment). Removed the floor arrows, "Tap the floor to walk there." (Chapter 1 only), the touch help line, the polish sparkle, and the "ship" goal. New calendar picture `home-room-empty-closed-v4.png` (v3 removed). Rule: no ring or tag where Squatch stands. New test `tests/scene1-morning.mjs`.

2026-11-14. Tidy, no change in play: `drawCap` (the white "VERB · thing" label every chapter uses) moved from `20-ch2.js` to `60-frame-draw.js`, before the scene 1 morning fix changes it.

2026-11-14. Steady screen (problems 4 and 5, Brian t119): one size big button (long labels get smaller letters), the phone goal bar keeps its space from the first picture, sideways the goal sits over the picture and the picture fits the window height (iPad sideways about 59% of the screen, was 32%; phone sideways no longer cut off). New check `tests/screen-fit.mjs`; `button-size` and `page-jump` off the kid robot's KNOWN list.

2026-11-14. Tidy, no change in play: Chapter 1 scene 1 (start, song, Mops walking out, peek) moved into `src/game/15-ch1-scene1.js` from `12-ch1-redesign.js`, `13-ch1-slice.js` and `14-ch1-day1.js`. `tools/equivalence.mjs main` and the kid robot show the same play.

2026-11-14. Notes only. Scene 1 (beats 1–3) comes first: new story agreed with Brian (morning, Mops's line, the song as goodbye, "That evening…", the peek with "Robots?"). Walkthrough beats 1–3 rewritten; `docs/CHAPTER-1-PROBLEMS.md` has a "Do first" section with four pull requests in order.

2026-11-14. Notes only. `docs/START-HERE.md` loop step 3: move shared code out of a chapter file in its own pull request before a fix, never mixed. Brian's answer for problem 1 (after jail, set back and carry on) recorded; problem 11 (cones) goes first.

2026-11-14. Cleanup with Brian's yes: 18 branches already in `main` deleted; pull requests 22 and 29 closed (branches kept). `docs/START-HERE.md` says only pull requests named in the problem list matter.

2026-11-14. Notes tidy-up, no game change. Thirteen old pages and five old folders (screenshots, audits, snapshots, playtest notes) moved into `docs/old/`, so `docs/` shows only what matters. Links updated. Nothing deleted.

2026-11-14. Handover, docs only. `docs/START-HERE.md` now names the four files that say what the game should be. Every message Brian wrote to Squatchbot is in `docs/grok-archive/squatchbot-brian-words.md`; the walkthrough was checked against it and three missing points were added (jail on a catch, guards every time, and Brian's Nov 14 rule for sight cones: a dashed outline on everyone that fills in when Squatch is inside). `docs/BRIAN-LENS.md` has six more of his rules. `docs/CHAPTER-1-PROBLEMS.md` has problems 11 to 19. No game code changed.

2026-11-13. Chapter 1 kid robot and ranked problem list, merged on Brian's yes (pull request 37). `tests/ch1-kid-play.mjs` plays all of Chapter 1 on a phone-size screen by touch and ends at the score card. It runs with `npm test`; `npm run kid-video` saves a video. `docs/CHAPTER-1-PROBLEMS.md` ranks ten Chapter 1 problems, each with its cause, fix, and the check that proves it. `docs/START-HERE.md` is a one-page handbook: what matters now, what went wrong before, and the loop to follow. No game code changed.

2026-11-13. Automatic checks and the kitchen duck, merged on Brian's yes (pull request 36, R105). GitHub now runs the build check and the full test suite on every pull request and on main (`.github/workflows/pr.yml`). The kitchen duck is press-and-hold: hold the action button to stay a ball, let go to stand up, so Squatch cannot get stuck as a ball. A faint dashed outline shows where Gloop's look will land during her warning. New test `tests/kitchen-duck-hold.mjs`. No new words.

2026-11-13. Home song, not merged. Mops walks over and stands next to Squatch. Squatch sings "I'm floating in space!" and Mops answers "Baaa-aa-aaa!", then Mops leaves. Bubbles sit off the face. The peek chip shows only after Mops is gone. The sing-along chip stays until those lines have played. "See you after work." is gone. The bedroom arrows point away from the bucket. The keyboard instructions under the game are gone. The title picture is unchanged. Docs match main: yes. Do not merge.

2026-11-13. Brian said yes, merge. Story waits need a tap. A sight is a short hop, and Zip calls security. Mops answers the Mars gate bot: "He's with me." and "No thanks. We're getting my goat." Stage directions are pictures and a sound. Gallery words "TIED TOGETHER FOREVER", "ME" / "MOPS", and "BEEP BEEP" are approved. Docs match main: yes.

2026-11-13. Brian said yes, merge (without the beard gag). Walks stay on the locked pictures, at the doors. The opening keeps the sing-along chip. The blue G box and the mop bucket block the bedroom walk. Mops's beard hangs to the floor, with no mop prop and no cut-in at the bucket. The title screen no longer logs "Va is not defined". Docs match main: yes.

2026-11-13. Guardrail. Brian said yes, merge. Locked room art must not be redrawn, replaced, or restyled. The rule from `docs/locked-rooms/README.md` is now in `CLAUDE.md` and `AGENTS.md`, word for word. Mops's beard is his mop; no separate mop prop. `docs/locked-rooms/manifest.json` holds the sha256 of each locked picture, and `tests/locked-art.mjs` fails if a picture changes or a room stops using it. Docs match main: yes.

2026-11-13. Folded the stale docs pulls. #12's reply sheet was already answered in `DECISIONS.md` and `OPEN-ASKS.md`. #13's script export was from the old chapter and was not copied. #15's Chapter 1 line changes were for the old night-out and were not copied. #16's cook drawing was game code and was not copied. Seven leftovers are `OPEN-ASKS.md` section G. Docs match main: yes.

2026-11-12. Per-room door scaling, not merged. Brian t336u: an adult's head is 85% of the door in that room. Hall 77.9px door gives 66.2px. Office 123.4px door gives 104.9px. Squatch is 80% of the adult in the same room. A room with no door keeps the hall height. Docs match main: yes. Do not merge.

2026-11-12. Party security and adult scale, not merged. K10: a guest runs to the wall alarm, guards search the party hall, sight calls the existing hall lockup, and the home search starts half a second after the guard reaches the door. No 9-second countdown. No new words. The single hall-door height is superseded the same day by per-room door scaling (Brian t336u). Office art is v2 (R84). Docs match main: yes. Do not merge.

2026-11-11. Day 1 through bedtime, not merged. The song, a party with a dance game, karaoke, an octopus chase, a photo countdown, the run home and the hide, "You have me", the TV story, and the Moon Pie bedtime with no parents. After bedtime the existing Day 2 still plays. New words are pending. Docs match main: yes. Do not merge.

2026-11-11. Slice round 2, not merged. R66 is superseded by R67: guests at 1.8, Squatch at the normal hall scale, adults clearly taller. The stray heart and Mops's pink cone are off for this chapter. Dress-up shows each item and uses bigger targets. The party crowd is drawn in the thick-outline style (no spr_a_* files are in the repo). The camera tripod is off the snack table. The balloon string stays in the hall. Joe's track is now `music/main-theme-from-brian.mp3` on this slice (title, home, gift). Docs match main: yes. Do not merge.

2026-11-11. Slice follow-up, not merged. Bedtime: Mops walks to (380, 460) and stays there, instead of walking toward x 470 and snapping. R65 is the smaller size at home and in the other rooms. The party drawing is R66. Docs match main: yes. Do not merge.

2026-11-11. Slice round 1 polish, not merged. Brought the bug-fix keyboard focus, card skip, outlined night cone, and Mops-off-the-bucket positions onto this branch. Party guests were scale 1.3 and Squatch at the party was scale 2 (R66, superseded the same day by R67). The night turn is R64. Dress-up no longer shows the wrong goal chip, and worn pieces are marked. The rising balloon is larger. No new on-screen words. Docs match main: yes. Do not merge.

2026-11-11. Slice playtest 6, not merged. The desktop NEXT slot keeps its height. Isfred's party line sits under the office monitor. The tourist disguise and the dress-up screen fade through black, with no new words. Squatch stays a bit smaller at home and in the other rooms (R65). The night mailbox robot uses the same turn as the bug-fix branch (R64): down 2 seconds, a 0.3 second turn with no catch, then the back wall for 4 seconds. Cone numbers unchanged. Docs match main: yes. Do not merge.

2026-11-10. Later-chapter doors walk out and in (Chapters 2 to 4), merged as PR #17. The Chapter 2 opening and the fuel-pump walk are unchanged. The soup-note whisper "A hoof stamp. Mops signed it." is cut so Squatch does not know who wrote the note. Captions are unchanged.

2026-11-09. Docs only, third pass on PR #18. Synced designer decisions R58–R63 into `docs/DECISIONS.md`, `docs/STATE.md`, `docs/OPEN-ASKS.md`, `docs/CH1-CARTOON-LINES.md`, `README.md`, and this page. Recorded and not in the game. New lines stay NEEDS BRIAN. No game code and no on-screen words in the game changed.

2026-11-09. Docs only, second pass on PR #18. Synced the designer record through R57 into `docs/DECISIONS.md`, `docs/STATE.md`, `docs/OPEN-ASKS.md`, `docs/CH1-CARTOON-LINES.md`, and `docs/STYLE-GUIDE.md`. README and this page point at that sync. New cartoon words stay NEEDS BRIAN. No game code and no on-screen words in the game changed.

2026-11-09. Docs only. `docs/DECISIONS.md` is the single source of truth, merged with the 2026-11-08 snapshot. Answered rows in `docs/STORY-DECISIONS.md` are no longer pending. This page points at `docs/DECISIONS.md`. No game code and no on-screen words changed.

2026-11-07. Chapter 1 pass on branch `chapter-1-pass` (D15 night out, Chapter 1 switch cards, order fixes, Chapter 1 tests). **Superseded** as "not merged": merged as PR #11.

2026-11-07. Phase 1 is on `main` as PR #8 (`9215e8b`). Phase 2 (T13 to T18) was on branch `phase-2-structure`. **Superseded** as "not merged": merged as PR #9.

2026-11-06. Recorded PR #4 at `6853902` and PR #5 at `17a03c2`. SS40–SS44 pass on kitchen C, with pastdraw and `main` called out separately. DE1, DE2, DE3, DE5, and DE8 use the shots and the recovery pass. Reset section is shipped in PR #5, with the independent checks listed above. The rest stays open.

2026-11-06. PR #4 is on `main` at `9999f0cd`. Deploy is not confirmed. PR #5 is restacked onto that commit and stays open.
